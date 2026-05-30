# Vercel Deployment & Configuration Guide

## Problem Fixed
Users could register but couldn't login on Vercel production. This was caused by:
1. Missing `MONGODB_URI` environment variable (fell back to localhost)
2. Stale database connections in serverless environment
3. Missing `NEXTAUTH_SECRET` for session encryption
4. Inadequate retry logic for flaky network conditions

## Required Vercel Environment Variables

Set these in your Vercel project settings → Environment Variables:

### 1. **MONGODB_URI** (Critical)
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/easyoil?retryWrites=true&w=majority
```
- Replace `<username>` and `<password>` with your MongoDB Atlas credentials
- Replace `<cluster>` with your cluster name
- **Must be set** or deployment will fail

### 2. **NEXTAUTH_SECRET** (Critical)
```
# Generate a secure 32+ character secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- Use the output as your secret
- This encrypts JWT tokens and sessions
- **Must be set** or auth will fail

### 3. **NEXTAUTH_URL** (Required for production)
```
https://easyoil.vercel.app
```
- Replace with your actual Vercel domain
- Needed for callback URL validation

### 4. **NODE_ENV** (Optional but recommended)
```
production
```
- Enables production-specific optimizations
- Connection pooling adjusted automatically

## Step-by-Step Vercel Setup

### 1. Connect your GitHub repository to Vercel
- Go to https://vercel.com/new
- Import your GitHub repository
- Select "Next.js" framework

### 2. Add Environment Variables
Before deploying:
- Click "Environment Variables"
- Add each variable above with its value
- **Important**: Do NOT commit `.env.local` to GitHub

### 3. Deploy
- Click "Deploy"
- Wait for build to complete
- Visit your Vercel URL to test

### 4. Test Registration & Login
```
# On Vercel (https://easyoil.vercel.app):
1. Go to /register
2. Create a new account with test email
3. Go to /login
4. Login with same credentials
```

## Common Issues & Fixes

### "Invalid credential or inactive account" on login after registration
**Cause**: `MONGODB_URI` not set (falls back to localhost)
**Fix**: Verify `MONGODB_URI` is set in Vercel environment variables

### "Database configuration error" on registration
**Cause**: Missing database environment variable
**Fix**: Check that `MONGODB_URI` is correctly formatted and set in Vercel

### "Unauthorized" after login
**Cause**: `NEXTAUTH_SECRET` not set or inconsistent
**Fix**: Generate a new secret and set it in Vercel environment variables

### Deployment build fails
**Cause**: Missing build dependencies or environment variables
**Fix**: Run `npm run build` locally first to verify, then check Vercel build logs

## Database Connection Improvements (in this version)

The code now includes:
1. **Improved retry logic**: 5 retries in production, exponential backoff
2. **Connection validation**: Pings database on each request to detect stale connections
3. **Proper error handling**: Fails fast if `MONGODB_URI` missing in production
4. **Serverless optimized**: Smaller connection pool (5) for production
5. **Better timeouts**: 10s for production, 5s for local development

## After Deployment

### Monitor for issues
- Check Vercel deployment logs
- Monitor MongoDB Atlas for connection spike
- Test all three roles: customer, officer, admin

### Optional: Set up production database backup
- Enable MongoDB Atlas backups
- Test restore procedure
- Document backup location

### Security hardening
- Enable NextAuth callback URL validation
- Set secure cookies (HTTPS only)
- Consider IP whitelisting for API routes

## Local Development vs Production Differences

| Feature | Local | Production (Vercel) |
|---------|-------|---------------------|
| Database | Local or Atlas | Must use Atlas |
| Port | 3000 | Assigned by Vercel |
| HTTPS | Not required | Required |
| Connection pooling | 10 max | 5 max |
| Retries | 3 attempts | 5 attempts |
| Timeout | 5s | 10s |

## Troubleshooting Commands

```bash
# Test local build (do this before pushing to Vercel)
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# View Vercel logs live
vercel logs --tail

# Manually redeploy if issues
vercel redeploy
```

## Rolling Back a Bad Deployment

If production breaks after deployment:
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find the previous working deployment
4. Click "..."  → "Promote to Production"

## Need Help?

- **Build fails**: Check Vercel build logs (shown in dashboard)
- **Login fails**: Verify `MONGODB_URI` and `NEXTAUTH_SECRET` are set
- **Database error**: Check MongoDB Atlas connection IP whitelist includes Vercel
