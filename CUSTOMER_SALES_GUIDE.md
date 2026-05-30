# EasyOil Customer & Sales Officer Guide

## 1. Overview
This document provides a detailed operational guide for two main users:
- **Customers** who use the EasyOil portal to submit B2B fuel onboarding applications.
- **Sales Officers** who verify submitted applications, review documents, and request corrections.

The guide explains the roles, workflow, interface behavior, and expected actions for each user.

---

## 2. Customer Guide

### 2.1 Purpose
As a customer, your goal is to complete the onboarding form, upload the required compliance documents, and submit the application for sales officer review.

### 2.2 Login & Registration
1. Open the application landing page.
2. Register with:
   - Name
   - Email
   - Mobile number
   - Password
   - Company details (GST, PAN, address, contact person)
3. After registration, you are automatically logged in and redirected to your customer dashboard.

### 2.3 Dashboard Behavior
Your dashboard shows:
- Current application status: `Draft`, `Submitted`, `Under Review`, `Correction Required`, `Approved`, or `Rejected`.
- Recommended next action based on the status.
- A summary of your application and uploaded documents.

### 2.4 Multi-Step Application Form
The form is broken into four logical steps.

#### Step 1: Legal Profile & Corporate Address
You must fill:
- Company Name
- Firm Type
- GSTIN Number
- PAN Number
- Corporate Address
- District
- State
- Pincode
- Contact Person
- Mobile Number
- Email

> Important: These values are stored under your company profile and should be accurate before submitting.

#### Step 2: Logistics & Fuel Requirements
Enter logistics and demand details:
- Product Category (HSD, LDO, or Bitumen)
- Monthly Required Quantity
- Delivery Location / Depot
- Requirement Commencement Date
- Existing Supplier (optional)
- Storage availability checkbox

#### Step 3: Compliance Document Uploads
Upload mandatory documents:
- Official B2B Request Letter
- GSTIN Registration Certificate
- Corporate PAN Card Copy

For each document you upload, the UI now shows:
- A visible upload button
- The current file name
- The status badge
- Option to replace the file

If a document is already uploaded, the button changes to **Replace file**.

#### Step 4: Review & Submit
You can review all entered details in one place:
- Corporate & Legal information
- Logistics summary
- Uploaded documents list with status badges

The final action button changes based on application status:
- `Lock & Submit Application` for a new submission
- `Update & Reapply` if the officer requested corrections

### 2.5 Correction Flow
If a sales officer marks your application as `Correction Required`:
- Your form becomes editable again.
- You will see a correction banner with officer remarks.
- The final submit button changes to `Update & Reapply`.
- You can correct fields, replace documents, and resubmit.

### 2.6 Recommended Best Practices
- Always fill all mandatory fields before moving to the next step.
- Upload clear, readable scans for all documents.
- Use the review panel to confirm what was submitted before final submission.
- If corrections are requested, read the officer remark carefully and update only the requested items.

---

## 3. Sales Officer Guide

### 3.1 Purpose
As a sales officer, your role is to verify customer onboarding documents, ensure compliance, and approve or request corrections.

### 3.2 Dashboard View
The officer dashboard provides:
- A list of submitted applications
- Search and status filters
- A quick summary of counts by status
- A review button to open application details

### 3.3 Application Review Workflow
When you open an application, you can see:
- Application status badge
- Partner details
- Application summary
- Uploaded documents for verification

### 3.4 Verifying Documents
For each uploaded document, you can:
- Mark it as `Verified`
- Mark it as `Rejected`
- Add comments if rejection is needed

The system sends these decisions back to the application record.

### 3.5 Workflow Status Updates
You can update the application status to one of the following:
- `under_review` when you start review
- `correction_required` if documents are incomplete, unclear, or invalid
- `approved` when everything is verified and ready
- `rejected` if the application is not acceptable

### 3.6 Correction Request Flow
If you set status to `correction_required`:
- The customer receives the remark text.
- Their form unlocks for editing.
- They can re-upload documents and resubmit.
- The final submit button becomes `Update & Reapply`.

### 3.7 Officer Best Practices
- Confirm the customer’s company contact details are present and valid.
- Verify the document type matches the expected file.
- Use the remark field clearly:
  - Describe what is wrong.
  - Specify which document or field needs correction.
- Only mark `approved` when all mandatory documents are verified.

---

## 4. Common Trouble Points & Fixes

### 4.1 Missing Company Phone / Email in Officer View
The officer dashboard must use the customer’s company data fields correctly:
- `mobile` instead of `phone`
- `firmType` instead of `companyType`

### 4.2 Customer Upload Status
Uploaded documents now show both:
- `Uploaded` status after successful file upload
- `Pending review` text until a sales officer verifies them

### 4.3 Current Step Clarity
The form progress tracker highlights the active step visually with a blue card and clear `Current step` label.

---

## 5. Workflow Summary

### Customer
1. Register and verify account.
2. Complete the multi-step application form.
3. Upload mandatory documents.
4. Review and submit.
5. If corrections are requested, update and resubmit.

### Sales Officer
1. Review submitted applications from the queue.
2. Verify uploaded documents.
3. Set status and add remarks.
4. Approve or request corrections.
5. Monitor resubmissions and finalize approvals.

---

## 6. Notes for Developers & Operations
- All API calls are secured with user session validation.
- Role-based data access prevents cross-role actions.
- The customer and officer workflows are connected through application status changes.
- The document verification workflow is designed to support iterative correction and resubmission.
