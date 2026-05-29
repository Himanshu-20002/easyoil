# IndianOil B2B Customer Onboarding Portal

A complete, production-ready, full-stack B2B Customer Onboarding Portal for IndianOil. This application will enable new industrial and commercial customers to register, fill out onboarding details, upload required compliance documents, and track their application progress. IndianOil Sales Officers and Administrators will have access to dashboards to review documents, manage workflows, assign tasks, view analytics, and generate reports.

---

## Technical Stack & Libraries

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS (with IndianOil corporate theme colors)
- **UI Components**: Shadcn UI & Lucide Icons
- **Database**: MongoDB Atlas via Mongoose
- **Authentication**: NextAuth.js v5 (Auth.js) with role-based routing
- **Form Management**: React Hook Form with Zod validation
- **Data Table**: TanStack Table
- **Charts**: Recharts (for analytics and status breakdowns)
- **File Upload**: UploadThing with a fully functional local disk fallback for quick setup and offline running
- **Exports**: Excel export (`xlsx` / `exceljs`) and PDF export (`jspdf` + `jspdf-autotable`)

---

## User Review Required

Please review the following design decisions:
1. **Fallback File Upload**: Since UploadThing requires external API credentials (`UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`), I will implement a custom API route (`/api/upload`) as a fallback that saves files locally to the `public/uploads` folder. This ensures the app is fully runnable out-of-the-box without external dependencies, while remaining UploadThing-compatible.
2. **NextAuth.js v5 Setup**: We will implement NextAuth.js Credentials Provider with bcryptjs passwords. This keeps authentication self-contained and easy to run locally.
3. **Database Seed Data**: We will build an automatic database seeding script to pre-populate the database with:
   - 1 Admin user (`admin@indianoil.in`)
   - 2 Sales Officers (`officer1@indianoil.in`, `officer2@indianoil.in`)
   - 5 Mock companies and onboarding applications in different states (Draft, Submitted, Under Review, Correction Required, Approved) to make the admin/sales dashboards instantly inspectable.

---

## Open Questions

> [!NOTE]
> 1. **Email Notifications**: For the "email notifications" feature, should we integrate with a live SMTP/Nodemailer configuration, or is a mocked notification log in the dashboard (and console output) sufficient for this phase? *We propose mock/console logging by default with ready-to-wire SMTP helper functions.*
> 2. **Document Types**: Should we enforce file size limits and file format restrictions? *We propose allowing PDF, JPEG, and PNG files up to 5MB.*

---

## Proposed Database Schemas (Mongoose)

### 1. User Schema (`src/models/User.ts`)
```typescript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  mobile: { type: String, required: true },
  role: { type: String, enum: ['customer', 'sales_officer', 'admin'], default: 'customer' },
  password: { type: String, required: true }, // Hashed
  companyRef: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
  isActive: { type: Boolean, default: true }
}
```

### 2. Company Schema (`src/models/Company.ts`)
```typescript
{
  companyName: { type: String, required: true },
  firmType: { type: String, required: true, enum: ['Proprietorship', 'Partnership', 'Private Limited', 'Public Limited', 'LLP', 'Others'] },
  gst: { type: String, required: true, unique: true, index: true },
  pan: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  contactPerson: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true }
}
```

### 3. Application Schema (`src/models/Application.ts`)
```typescript
{
  applicationId: { type: String, required: true, unique: true, index: true }, // e.g. IOCL-2026-10001
  companyRef: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  productType: { type: String, enum: ['LDO', 'HSD', 'Bitumen'], required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  storageAvailability: { type: Boolean, default: false },
  existingSupplier: { type: String, default: '' },
  requirementStartDate: { type: Date, required: true },
  leadSource: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['draft', 'submitted', 'under_review', 'correction_required', 'approved', 'rejected'], 
    default: 'draft',
    index: true 
  },
  assignedOfficer: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  remarks: [{
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, required: true },
    authorRole: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}
```

### 4. Document Schema (`src/models/Document.ts`)
```typescript
{
  applicationRef: { type: Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
  fileType: { 
    type: String, 
    enum: ['request_letter', 'gst_certificate', 'pan_card', 'incorporation_cert', 'auth_letter', 'supporting_doc'], 
    required: true 
  },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  comments: { type: String, default: '' }
}
```

### 5. ActivityLog Schema (`src/models/ActivityLog.ts`)
```typescript
{
  action: { type: String, required: true }, // e.g. 'Register', 'Submit Application', 'Verify Document', 'Approve'
  actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  actorName: { type: String, required: true },
  actorRole: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed } // e.g. applicationId, documentId
}
```

---

## Directory Structure Plan

We will create a structured, modular Next.js application inside `x:\projects\next.js\easyOil`:

```
easyOil/
├── public/
│   ├── uploads/               # Standard folder for local file uploads (fallback)
│   └── images/                # Brand logo / IndianOil placeholders
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with Tailwind config
│   │   ├── page.tsx           # Premium Landing page
│   │   ├── login/             # Public Login page
│   │   ├── register/          # Customer Registration page
│   │   ├── dashboard/         # Customer Hub (Routes based on Session role)
│   │   ├── customer/          # Customer portal paths
│   │   │   ├── dashboard/     # Customer Dashboard & status tracker
│   │   │   ├── apply/         # Multi-step Onboarding Form (Steps 1-4)
│   │   │   └── profile/       # Company & contact profile details
│   │   ├── officer/           # Sales Officer workspace
│   │   │   ├── dashboard/     # Officer dashboard list
│   │   │   └── applications/  # Onboarding application review, workflow & verify
│   │   ├── admin/             # Administrator workspace
│   │   │   ├── dashboard/     # Analytics charts & system configs
│   │   │   ├── users/         # Manage Users, assign Sales Officers
│   │   │   ├── audit/         # Audit Logs viewer
│   │   │   └── reports/       # Excel / PDF reporting page
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth.js dynamic handlers
│   │   │   ├── upload/        # Local disk file upload endpoint
│   │   │   ├── db/seed/       # Seeding endpoint (triggered once)
│   │   │   └── reports/       # Report download streams
│   │   └── middleware.ts      # Authentication & role enforcement
│   ├── components/
│   │   ├── ui/                # Reusable design components (Shadcn style)
│   │   ├── brand/             # IndianOil Header, Footer & Sidebar
│   │   ├── forms/             # Multi-step form sub-components
│   │   ├── dashboard/         # Analytics charts, status badges
│   │   └── ui-table.tsx       # Reusable TanStack data table
│   ├── lib/
│   │   ├── db.ts              # Mongoose connection utility with caching
│   │   ├── auth.ts            # Auth.js configurations & callback actions
│   │   ├── seed.ts            # Seeding data definition
│   │   └── schemas.ts         # Zod schemas for forms validation
│   ├── models/                # Database Mongoose models
│   └── services/              # Export formats, Notifications, Audits
├── tailwind.config.ts         # IndianOil Branding Theme Colors (Blue/Orange)
├── tsconfig.json
├── package.json
└── .env.example               # Template environment settings
```

---

## IndianOil Styling and Theme Design

The application will feature a premium B2B UI adhering to IndianOil's design palette:
- **Primary Blue**: `#0054A6` (IndianOil Blue, representing trust, strength, and enterprise scale)
- **Accent Orange**: `#FF6600` (IndianOil Orange, highlighting actions, pending items, and active statuses)
- **Backgrounds**: High-end light themes with soft borders (`bg-slate-50`), glassmorphic layouts for dashboards, and bold corporate cards.
- **Typography**: Modern font stack (`Inter` / `Outfit` / `Geist`).

---

## Form Validation & Multi-step Logic

We will build a multi-step customer form using `react-hook-form` paired with `zod` validation.
- **Step 1**: Basic registration & fiscal compliance (`gst`, `pan`, company details).
- **Step 2**: Logistics & requirement (`productType`, `quantity`, `location`, `storage`).
- **Step 3**: File upload mechanism with status badges (allowing download, edit, or re-upload).
- **Step 4**: Full summary table of inputted fields. Submitting locks the application state and changes the status from `draft` to `submitted`.

---

## Role-Based Routing & Security (NextAuth + Middleware)

- **Middleware Rules**:
  - `/customer/*` pages are restricted strictly to users with the role `customer`.
  - `/officer/*` pages are restricted strictly to users with the role `sales_officer` (or `admin`).
  - `/admin/*` pages are restricted strictly to users with the role `admin`.
  - If a user tries to access a page they don't have access to, they will be redirected to their dashboard or the landing page.
- **Session Extensions**: The role and company ID are loaded into the NextAuth token/session to easily verify ownership of resources.

---

## Verification Plan

### Automated Tests
1. **API Validations**: Perform post requests with malformed Zod formats to ensure response is code 400.
2. **Middleware Redirects**: Attempt to access `/admin/dashboard` while logged in as a `customer` role to verify redirect to `/customer/dashboard`.

### Manual Verification
1. **Interactive Form Walkthrough**:
   - Register a customer user -> Log in -> Fill Form Steps 1 to 3 -> Review page -> Click Submit.
   - Verify application status is now `submitted`.
2. **Sales Officer Flow**:
   - Log in as Sales Officer -> View application list -> Select the customer -> Review and change document verification states to `verified` / `rejected` -> Request correction -> Verify customer dashboard shows "Correction Required" and allows edits.
3. **Admin Dashboard Flow**:
   - Log in as Admin -> View charts, export Excel/PDF reports, assign Sales Officer, check Audit Logs.
