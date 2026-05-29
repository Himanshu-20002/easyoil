import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/auth';
import { dbConnect } from '../../../../lib/db';
import { Application } from '../../../../models/Application';
import { Company } from '../../../../models/Company';
import { Document } from '../../../../models/Document';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'customer') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const companyId = session.user.companyRef;
    if (!companyId) {
      return NextResponse.json(
        { success: false, message: 'No associated company profile found' },
        { status: 400 }
      );
    }

    // Get company details
    const company = await Company.findById(companyId);

    // Get active application
    let application = await Application.findOne({ companyRef: companyId }).sort({ updatedAt: -1 });

    if (!application) {
      // Create one on the fly as backup
      const year = new Date().getFullYear();
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const applicationId = `IOCL-${year}-${randomNum}`;
      
      application = await Application.create({
        applicationId,
        companyRef: companyId,
        productType: 'HSD',
        quantity: 1000,
        location: company?.address || 'Mumbai Depot',
        storageAvailability: false,
        requirementStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'draft'
      });
    }

    // Fetch documents associated with this application
    const documents = await Document.find({ applicationRef: application._id });

    return NextResponse.json({
      success: true,
      company,
      application,
      documents
    });
  } catch (error: any) {
    console.error('Fetch current application error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error fetching application details' },
      { status: 500 }
    );
  }
}
