import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '../../../lib/db';
import { User } from '../../../models/User';
import { Company } from '../../../models/Company';
import { Application } from '../../../models/Application';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      name,
      email: rawEmail,
      mobile,
      password,
      companyName,
      firmType,
      gst: rawGst,
      pan: rawPan,
      address,
      district,
      state,
      pincode,
      contactPerson
    } = body;

    const email = rawEmail ? rawEmail.trim().toLowerCase() : '';
    const gst = rawGst ? rawGst.trim().toUpperCase() : '';
    const pan = rawPan ? rawPan.trim().toUpperCase() : '';

    // Validation checks
    if (!email || !password || !gst || !companyName) {
      return NextResponse.json(
        { success: false, message: 'Missing mandatory fields' },
        { status: 400 }
      );
    }

    // 1. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // 2. Password strength validation (min 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // 3. GST format validation (removed as requested)

    // 4. PAN format validation (10-char alphanumeric if provided)
    if (pan) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(pan)) {
        return NextResponse.json(
          { success: false, message: 'Invalid PAN format. Must be a valid 10-character Indian PAN.' },
          { status: 400 }
        );
      }
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email address is already registered' },
        { status: 400 }
      );
    }

    // Check if GST is already registered
    const existingCompany = await Company.findOne({ gst });
    if (existingCompany) {
      return NextResponse.json(
        { success: false, message: 'GST Number is already registered' },
        { status: 400 }
      );
    }

    // Create Company
    const company = await Company.create({
      companyName,
      firmType,
      gst,
      pan,
      address,
      district,
      state,
      pincode,
      contactPerson: contactPerson || name,
      mobile: mobile,
      email: email.toLowerCase()
    });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobile,
      role: 'customer',
      password: hashedPassword,
      companyRef: company._id,
      isActive: true
    });

    // Create an initial draft Application automatically
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const applicationId = `IOCL-${year}-${randomNum}`;

    await Application.create({
      applicationId,
      companyRef: company._id,
      productType: 'HSD', // default
      quantity: 1000,     // default
      location: address,  // default
      storageAvailability: false,
      requirementStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'draft'
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful! You can now log in.',
      userId: user._id
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during registration' },
      { status: 500 }
    );
  }
}
