# Production Readiness — EasyOil (IndianOil B2B Onboarding Portal)

Make the project build cleanly, pass strict TypeScript checks, eliminate security holes, remove debug cruft, and harden configuration so it can be deployed to Vercel/any Node host with confidence.

---

## User Review Required

> [!IMPORTANT]
> **Deployment Target** — The plan assumes Vercel as the deployment platform (best for Next.js). If you plan to self-host (Docker, EC2, etc.), let me know so I can adjust the file-upload strategy and environment config accordingly.

> [!WARNING]
> **File Uploads** — The current `/api/upload` route writes files to `public/uploads/` on the local filesystem. This **will not work** on Vercel or any serverless platform (filesystem is ephemeral). The plan includes replacing this with a base64/buffer approach saved to MongoDB, or you can switch to Cloudinary/S3. Let me know your preference.

> [!CAUTION]
> **Database Credentials Exposed** — `.env.local` contains your real MongoDB Atlas connection string and NEXTAUTH_SECRET in the repo. The plan adds an `.env.example` template and ensures `.gitignore` covers `.env.local` properly, but **you should rotate your NEXTAUTH_SECRET and MongoDB password** before going live.

---

## Open Questions

1. **File storage strategy**: Should uploaded documents be stored as base64 blobs in MongoDB, or do you want to integrate a cloud storage provider (AWS S3 / Cloudinary / Firebase Storage)?  
   *Default: I'll use MongoDB GridFS-style base64 storage for simplicity since files are small compliance PDFs.*

2. **Should the seed endpoint + debug-db endpoint be completely removed**, or gated behind `NODE_ENV === 'development'` only?  
   *Default: I'll gate them behind development-only checks and disable in production.*

3. **Do you want rate limiting on the auth/register APIs**, or is this acceptable for v1?  
   *Default: I'll skip rate limiting for now but add comments for future integration.*

---

## Proposed Changes

### 1. TypeScript Fixes & Type Safety

> Fix **14 TypeScript errors** that currently prevent `next build` from succeeding (even though `ignoreBuildErrors: true` masks them).

---

#### [NEW] [types/next-auth.d.ts](file:///x:/projects/next.js/easyOil/src/types/next-auth.d.ts)

Create a module augmentation file to extend the NextAuth `User`, `Session`, and `JWT` types with `role`, `companyRef`, and `id` fields. This eliminates all "Property 'role' does not exist on type 'User'" errors across:
- [page.tsx (home)](file:///x:/projects/next.js/easyOil/src/app/page.tsx#L15)
- [Header.tsx](file:///x:/projects/next.js/easyOil/src/components/brand/Header.tsx#L61)
- [route.ts (applications/current)](file:///x:/projects/next.js/easyOil/src/app/api/applications/current/route.ts#L11)
- [route.ts (applications/save)](file:///x:/projects/next.js/easyOil/src/app/api/applications/save/route.ts#L12)
- [route.ts (officer/applications)](file:///x:/projects/next.js/easyOil/src/app/api/officer/applications/route.ts#L14)

#### [MODIFY] [page.tsx (admin dashboard)](file:///x:/projects/next.js/easyOil/src/app/admin/dashboard/page.tsx)

- Add missing `CheckCircle` to the lucide-react import (line 12).

#### [MODIFY] [page.tsx (officer dashboard)](file:///x:/projects/next.js/easyOil/src/app/officer/dashboard/page.tsx#L140)

- Fix implicit `any` on `prev` parameter by typing it explicitly.

---

### 2. Next.js Build Configuration Hardening

> Remove the safety nets that mask broken code, and configure for production output.

---

#### [MODIFY] [next.config.ts](file:///x:/projects/next.js/easyOil/next.config.ts)

- **Remove** `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`
- Add `poweredBy: false` (hide X-Powered-By header)
- Add `images` config for allowed domains if needed
- Add `output: 'standalone'` for containerized deployments (optional, based on user answer)

---

### 3. Security Hardening

> Eliminate debug endpoints, tighten auth, add input validation, secure file uploads.

---

#### [MODIFY] [middleware.ts](file:///x:/projects/next.js/easyOil/src/middleware.ts)

- **Remove** `/api/db/seed` from the public pass-through list (line 18)
- Add security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy) via `NextResponse.headers`

#### [MODIFY] [route.ts (db/seed)](file:///x:/projects/next.js/easyOil/src/app/api/db/seed/route.ts)

- Gate behind `process.env.NODE_ENV !== 'production'` check — return 404 in production

#### [DELETE] [routes.ts (debug-db)](file:///x:/projects/next.js/easyOil/src/app/api/debug-db/routes.ts)

- Remove the debug-db API entirely. It serves no purpose and leaks database state.

#### [MODIFY] [route.ts (upload)](file:///x:/projects/next.js/easyOil/src/app/api/upload/route.ts)

- Add auth guard (only authenticated customers can upload)
- Add file size limit validation (max 5 MB)
- Add file type whitelist validation (pdf, png, jpg, jpeg only)
- Sanitize file names more rigorously

#### [MODIFY] [route.ts (register)](file:///x:/projects/next.js/easyOil/src/app/api/register/route.ts)

- Add password strength validation (minimum 8 chars)
- Add GST format validation (15-char alphanumeric pattern)
- Add PAN format validation (10-char alphanumeric pattern)
- Add email format validation
- Remove debug `console.log` statements

#### [MODIFY] [route.ts (officer/applications POST)](file:///x:/projects/next.js/easyOil/src/app/api/officer/applications/route.ts)

- Remove `error` field from error responses (don't leak stack traces to client)

#### [MODIFY] [route.ts (applications/save)](file:///x:/projects/next.js/easyOil/src/app/api/applications/save/route.ts)

- Remove `error` field from error responses

---

### 4. Debug Logging Cleanup

> Remove all development `console.log` statements that pollute production logs.

---

#### [MODIFY] [db.ts](file:///x:/projects/next.js/easyOil/src/lib/db.ts)

- Remove `console.log('db.ts module loaded')` (line 3)
- Remove `console.log('dbConnect invoked')` (line 31)
- Remove `console.log('Database already connected')` (line 33)
- Remove `console.log('DB connection attempt ...')` (line 41)
- Remove `console.log('Database connected successfully')` (line 50)
- Remove `console.log('Database connection failed:...')` (line 53)
- Keep error-path logging, but use `console.error` for actual failures only

#### [MODIFY] [route.ts (register)](file:///x:/projects/next.js/easyOil/src/app/api/register/route.ts)

- Remove `console.log('Calling dbConnect before registration')` and `console.log('dbConnect returned successfully')`

---

### 5. Environment & Deployment Configuration

> Proper env management and deployment readiness.

---

#### [NEW] [.env.example](file:///x:/projects/next.js/easyOil/.env.example)

Create a template with placeholder values:
```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=http://localhost:3000
```

#### [MODIFY] [.gitignore](file:///x:/projects/next.js/easyOil/.gitignore)

- Verify `.env.local` and `.env*.local` are listed (they already appear to be, but I'll confirm)
- Add `public/uploads/` to gitignore (user-uploaded files shouldn't be committed)

#### [MODIFY] [package.json](file:///x:/projects/next.js/easyOil/package.json)

- Fix the project name from `temp-next` to `easyoil`
- Add `engines` field to lock Node.js version >= 18
- Remove `react` RC versions and update to stable React 19 (or pin to the latest stable that Next.js 15.0.0 supports)

---

### 6. Login Page — Remove Dev Quick-Login Panel

> The "Developer Quick-Login Accounts" section exposes hardcoded credentials and seed data instructions. This must not ship to production.

---

#### [MODIFY] [page.tsx (login)](file:///x:/projects/next.js/easyOil/src/app/login/page.tsx)

- Wrap the quick-login panel in a `process.env.NODE_ENV === 'development'` guard, or remove it entirely
- I'll gate it behind `NODE_ENV` so it still works locally but is hidden in production builds

---

### 7. Error Response Consistency

> Standardize all API error responses and stop leaking internal details.

---

#### Files affected:
- [route.ts (applications/save)](file:///x:/projects/next.js/easyOil/src/app/api/applications/save/route.ts) — remove `error: error.message` from 500 responses  
- [route.ts (officer/applications)](file:///x:/projects/next.js/easyOil/src/app/api/officer/applications/route.ts) — remove `error: error.message` from both GET and POST 500 responses  
- [route.ts (upload)](file:///x:/projects/next.js/easyOil/src/app/api/upload/route.ts) — remove `error: error.message` from 500 response

---

### 8. Database Connection — Production Tuning

> Add MongoDB connection options appropriate for production.

---

#### [MODIFY] [db.ts](file:///x:/projects/next.js/easyOil/src/lib/db.ts)

- Add `serverSelectionTimeoutMS`, `socketTimeoutMS`, and `maxPoolSize` options
- Store the cached connection on `global.mongoose` to survive HMR properly (fix: assignment is currently only in `cached` local variable, not written back to `global.mongoose`)

---

### 9. Missing `CheckCircle` Import Fix (Admin Dashboard)

> The admin dashboard references `CheckCircle` but doesn't import it, causing a runtime crash.

Already covered in Section 1 above.

---

## Summary of All File Changes

| # | File | Action | Category |
|---|------|--------|----------|
| 1 | `src/types/next-auth.d.ts` | NEW | TypeScript |
| 2 | `next.config.ts` | MODIFY | Build config |
| 3 | `src/middleware.ts` | MODIFY | Security |
| 4 | `src/lib/db.ts` | MODIFY | Debug cleanup + production tuning |
| 5 | `src/lib/auth.ts` | MODIFY | Remove `any` types in callbacks |
| 6 | `src/app/api/db/seed/route.ts` | MODIFY | Security (env gate) |
| 7 | `src/app/api/debug-db/routes.ts` | DELETE | Security |
| 8 | `src/app/api/upload/route.ts` | MODIFY | Security (auth + validation) |
| 9 | `src/app/api/register/route.ts` | MODIFY | Validation + cleanup |
| 10 | `src/app/api/applications/save/route.ts` | MODIFY | Error response cleanup |
| 11 | `src/app/api/officer/applications/route.ts` | MODIFY | Error response cleanup |
| 12 | `src/app/admin/dashboard/page.tsx` | MODIFY | Missing import |
| 13 | `src/app/officer/dashboard/page.tsx` | MODIFY | Type fix |
| 14 | `src/app/login/page.tsx` | MODIFY | Hide dev panel |
| 15 | `.env.example` | NEW | Deployment |
| 16 | `.gitignore` | MODIFY | Deployment |
| 17 | `package.json` | MODIFY | Metadata + engines |

---

## Verification Plan

### Automated Tests
1. **`npx tsc --noEmit`** — Must pass with zero errors
2. **`npm run build`** — Must complete successfully (with `ignoreBuildErrors` and `ignoreDuringBuilds` removed)
3. **`npm run lint`** — Must pass

### Manual Verification
- Confirm login flow still works after dev-panel changes
- Confirm file upload still functions with new validation guards
- Confirm seed endpoint returns 404 when `NODE_ENV=production`
- Confirm admin/officer/customer dashboards render correctly
