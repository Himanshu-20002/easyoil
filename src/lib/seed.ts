import bcrypt from 'bcryptjs';
import { dbConnect } from './db';
import { User } from '../models/User';
import { Company } from '../models/Company';
import { Application } from '../models/Application';
import { Document } from '../models/Document';
import { ActivityLog } from '../models/ActivityLog';

export async function seedDatabase() {
  await dbConnect();

  // 1. Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Application.deleteMany({}),
    Document.deleteMany({}),
    ActivityLog.deleteMany({})
  ]);

  // 2. Hash default password
  const hashedPassword = await bcrypt.hash('iocl1234', 10);

  // 3. Create Users (Admin & Sales Officers)
  const admin = await User.create({
    name: 'EasyOil Chief Administrator',
    email: 'admin@easyoil.in',
    mobile: '9876543210',
    role: 'admin',
    password: hashedPassword,
    isActive: true
  });

  const officer1 = await User.create({
    name: 'Rajesh Kumar (Sales Officer)',
    email: 'officer1@easyoil.in',
    mobile: '9876543211',
    role: 'sales_officer',
    password: hashedPassword,
    isActive: true
  });

  const officer2 = await User.create({
    name: 'Anjali Sharma (Sales Officer)',
    email: 'officer2@easyoil.in',
    mobile: '9876543212',
    role: 'sales_officer',
    password: hashedPassword,
    isActive: true
  });

  // 4. Create Mock Companies & Applications in various states
  
  // Company A - Approved state
  const companyA = await Company.create({
    companyName: 'Apex Industrial Fuels Ltd',
    firmType: 'Private Limited',
    gst: '27AAAAA1111A1Z1',
    pan: 'AAAAA1111A',
    address: 'Plot 42, MIDC Industrial Area, Andheri East',
    district: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400093',
    contactPerson: 'Suresh Patil',
    mobile: '9988776655',
    email: 'suresh@apexind.com'
  });

  const customerA = await User.create({
    name: 'Suresh Patil',
    email: 'customerA@apexind.com',
    mobile: '9988776655',
    role: 'customer',
    password: hashedPassword,
    companyRef: companyA._id,
    isActive: true
  });

  const applicationA = await Application.create({
    applicationId: 'IOCL-2026-10001',
    companyRef: companyA._id,
    productType: 'HSD',
    quantity: 12000,
    location: 'Nagpur Depot Storage',
    storageAvailability: true,
    existingSupplier: 'HPCL',
    requirementStartDate: new Date('2026-06-01'),
    leadSource: 'Reference',
    status: 'approved',
    assignedOfficer: officer1._id
  });

  await Document.create([
    {
      applicationRef: applicationA._id,
      fileType: 'request_letter',
      fileName: 'request_letter_apex.pdf',
      fileUrl: '/uploads/mock/request_letter_apex.pdf',
      verificationStatus: 'verified',
      comments: 'Duly signed and stamped.'
    },
    {
      applicationRef: applicationA._id,
      fileType: 'gst_certificate',
      fileName: 'gst_cert_apex.pdf',
      fileUrl: '/uploads/mock/gst_cert_apex.pdf',
      verificationStatus: 'verified',
      comments: 'Verified against government portal.'
    }
  ]);

  // Company B - Under Review state
  const companyB = await Company.create({
    companyName: 'Bhartia Logistics Pvt Ltd',
    firmType: 'Private Limited',
    gst: '07BBBBB2222B2Z2',
    pan: 'BBBBB2222B',
    address: 'F-12, Okhla Phase 3',
    district: 'New Delhi',
    state: 'Delhi',
    pincode: '110020',
    contactPerson: 'Ramesh Bhartia',
    mobile: '9988776656',
    email: 'ramesh@bhartialogistics.com'
  });

  await User.create({
    name: 'Ramesh Bhartia',
    email: 'customerB@bhartialogistics.com',
    mobile: '9988776656',
    role: 'customer',
    password: hashedPassword,
    companyRef: companyB._id,
    isActive: true
  });

  const applicationB = await Application.create({
    applicationId: 'IOCL-2026-10002',
    companyRef: companyB._id,
    productType: 'LDO',
    quantity: 8000,
    location: 'Okhla Yard',
    storageAvailability: true,
    existingSupplier: '',
    requirementStartDate: new Date('2026-07-01'),
    status: 'under_review',
    assignedOfficer: officer1._id
  });

  await Document.create([
    {
      applicationRef: applicationB._id,
      fileType: 'request_letter',
      fileName: 'req_letter_bhartia.pdf',
      fileUrl: '/uploads/mock/req_letter_bhartia.pdf',
      verificationStatus: 'verified',
      comments: 'Looks correct.'
    },
    {
      applicationRef: applicationB._id,
      fileType: 'gst_certificate',
      fileName: 'gst_bhartia.png',
      fileUrl: '/uploads/mock/gst_bhartia.png',
      verificationStatus: 'pending'
    }
  ]);

  // Company C - Correction Required state
  const companyC = await Company.create({
    companyName: 'Chroma Polymers LLP',
    firmType: 'LLP',
    gst: '24CCCCC3333C3Z3',
    pan: 'CCCCC3333C',
    address: 'GIDC Sector 5, Gandhinagar',
    district: 'Gandhinagar',
    state: 'Gujarat',
    pincode: '382010',
    contactPerson: 'Mehta Shah',
    mobile: '9988776657',
    email: 'mehta@chromapolymers.com'
  });

  await User.create({
    name: 'Mehta Shah',
    email: 'customerC@chromapolymers.com',
    mobile: '9988776657',
    role: 'customer',
    password: hashedPassword,
    companyRef: companyC._id,
    isActive: true
  });

  const applicationC = await Application.create({
    applicationId: 'IOCL-2026-10003',
    companyRef: companyC._id,
    productType: 'Bitumen',
    quantity: 25000,
    location: 'Vadodara Plant',
    storageAvailability: false,
    existingSupplier: 'BPCL',
    requirementStartDate: new Date('2026-08-15'),
    status: 'correction_required',
    assignedOfficer: officer2._id,
    remarks: [
      {
        author: officer2._id,
        authorName: 'Anjali Sharma (Sales Officer)',
        authorRole: 'sales_officer',
        text: 'The PAN Card uploaded is blurred. Please upload a clear scanned copy of your PAN card to proceed.',
        createdAt: new Date()
      }
    ]
  });

  await Document.create([
    {
      applicationRef: applicationC._id,
      fileType: 'request_letter',
      fileName: 'request_letter_chroma.pdf',
      fileUrl: '/uploads/mock/request_letter_chroma.pdf',
      verificationStatus: 'verified',
      comments: 'Okay'
    },
    {
      applicationRef: applicationC._id,
      fileType: 'pan_card',
      fileName: 'pan_blurry.jpg',
      fileUrl: '/uploads/mock/pan_blurry.jpg',
      verificationStatus: 'rejected',
      comments: 'Too blurry. Please re-upload.'
    }
  ]);

  // Company D - Submitted state
  const companyD = await Company.create({
    companyName: 'Delta Engineering Works',
    firmType: 'Proprietorship',
    gst: '03DDDDD4444D4Z4',
    pan: 'DDDDD4444D',
    address: 'Industrial Area Phase 2, Ludhiana',
    district: 'Ludhiana',
    state: 'Punjab',
    pincode: '141003',
    contactPerson: 'Gurpreet Singh',
    mobile: '9988776658',
    email: 'gurpreet@deltaeng.com'
  });

  await User.create({
    name: 'Gurpreet Singh',
    email: 'customerD@deltaeng.com',
    mobile: '9988776658',
    role: 'customer',
    password: hashedPassword,
    companyRef: companyD._id,
    isActive: true
  });

  const applicationD = await Application.create({
    applicationId: 'IOCL-2026-10004',
    companyRef: companyD._id,
    productType: 'HSD',
    quantity: 15000,
    location: 'Ludhiana Yard',
    storageAvailability: true,
    requirementStartDate: new Date('2026-06-10'),
    status: 'submitted',
    assignedOfficer: null // Unassigned, admin can assign
  });

  await Document.create([
    {
      applicationRef: applicationD._id,
      fileType: 'gst_certificate',
      fileName: 'gst_delta.pdf',
      fileUrl: '/uploads/mock/gst_delta.pdf',
      verificationStatus: 'pending'
    }
  ]);

  // Company E - Draft state
  const companyE = await Company.create({
    companyName: 'Eco-Green Synthetics Ltd',
    firmType: 'Private Limited',
    gst: '33EEEEE5555E5Z5',
    pan: 'EEEEE5555E',
    address: 'SIPCOT Industrial Park',
    district: 'Kanchipuram',
    state: 'Tamil Nadu',
    pincode: '602105',
    contactPerson: 'Srinivasan Iyer',
    mobile: '9988776659',
    email: 'srini@ecogreen.com'
  });

  await User.create({
    name: 'Srinivasan Iyer',
    email: 'customerE@ecogreen.com',
    mobile: '9988776659',
    role: 'customer',
    password: hashedPassword,
    companyRef: companyE._id,
    isActive: true
  });

  await Application.create({
    applicationId: 'IOCL-2026-10005',
    companyRef: companyE._id,
    productType: 'LDO',
    quantity: 5000,
    location: 'Kanchipuram Storage Depot',
    storageAvailability: false,
    requirementStartDate: new Date('2026-09-01'),
    status: 'draft'
  });

  // 5. Create Activity Logs
  await ActivityLog.create([
    {
      action: 'Register',
      actor: admin._id,
      actorName: admin.name,
      actorRole: admin.role,
      metadata: { detail: 'System seeded by chief administrator' }
    },
    {
      action: 'Submit Application',
      actor: customerA._id,
      actorName: customerA.name,
      actorRole: customerA.role,
      metadata: { applicationId: 'IOCL-2026-10001' }
    },
    {
      action: 'Verify Document',
      actor: officer1._id,
      actorName: officer1.name,
      actorRole: officer1.role,
      metadata: { applicationId: 'IOCL-2026-10001', docType: 'gst_certificate' }
    },
    {
      action: 'Approve Application',
      actor: officer1._id,
      actorName: officer1.name,
      actorRole: officer1.role,
      metadata: { applicationId: 'IOCL-2026-10001' }
    }
  ]);

  return {
    users: 6,
    companies: 5,
    applications: 5
  };
}
