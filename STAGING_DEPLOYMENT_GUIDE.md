# RealCo Platform - Staging Deployment Guide

**Status:** Ready to Deploy  
**Date:** January 23, 2026  
**Environment:** Staging (Railway + Vercel)

---

## 🎯 **DEPLOYMENT STRATEGY**

**Always deploy to STAGING first before production!**

### Staging Benefits:
- ✅ Test all features in production-like environment
- ✅ Verify database migrations safely
- ✅ Test payment integrations (Stripe test mode, Plaid sandbox)
- ✅ Check performance under load
- ✅ Validate security configurations
- ✅ Train team on new features
- ✅ Get user feedback before production

---

## 📋 **STEP 1: RAILWAY STAGING SETUP**

### Create Staging Project

```bash
# Login to Railway
railway login

# Create new project for staging
railway init

# Name it: realco-staging
```

### Add PostgreSQL Database

1. Go to Railway Dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Railway will auto-provision a PostgreSQL instance
4. Note: `DATABASE_URL` is auto-populated in environment variables

### Add Redis (Optional but Recommended)

1. Click "New" → "Database" → "Redis"
2. Auto-provisioned with `REDIS_URL`

---

## 🔐 **STEP 2: CONFIGURE STAGING ENVIRONMENT VARIABLES**

In Railway Dashboard → Your Project → Variables, add these:

### Core Configuration
```bash
NODE_ENV=staging
PORT=3000
```

### Authentication (Generate New Secrets!)
```bash
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=[GENERATE_NEW_SECRET_FOR_STAGING]
ENCRYPTION_KEY=[GENERATE_NEW_SECRET_FOR_STAGING]
SESSION_SECRET=[GENERATE_NEW_SECRET_FOR_STAGING]
```

### Database (Auto-populated by Railway)
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

### Stripe (TEST MODE - Critical!)
```bash
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_test_your_webhook_secret
STRIPE_API_VERSION=2023-10-16
```

### Plaid (SANDBOX MODE)
```bash
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_sandbox_secret
PLAID_ENV=sandbox
PLAID_PRODUCTS=auth,transactions
```

### AWS S3 (Staging Bucket)
```bash
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=realco-staging-documents
```

### Email (SendGrid Test or Console)
```bash
EMAIL_SERVICE=console  # Use console for staging
SENDGRID_FROM_EMAIL=staging@realco.com
```

### Redis (Auto-populated)
```bash
REDIS_URL=${{Redis.REDIS_URL}}
```

### Logging & Monitoring
```bash
LOG_LEVEL=debug
LOG_FORMAT=json
SENTRY_DSN=your_staging_sentry_dsn
SENTRY_ENVIRONMENT=staging
```

### Security
```bash
CORS_ORIGINS=https://staging.realco.com,https://staging-frontend.vercel.app
RATE_LIMIT_MAX=100
```

### Feature Flags (Enable all for testing)
```bash
ENABLE_CONSTRUCTION_MODULE=true
ENABLE_ESCROW_MODULE=true
ENABLE_PAYMENT_PROCESSING=true
ENABLE_PLAID_INTEGRATION=true
ENABLE_STRIPE_INTEGRATION=true
ENABLE_EMAIL_NOTIFICATIONS=true
```

### Frontend URL
```bash
FRONTEND_URL=https://staging-frontend.vercel.app
WEBHOOK_BASE_URL=https://staging-api.railway.app
```

---

## 🗄️ **STEP 3: DATABASE MIGRATION TO STAGING**

### Run Initial Migration

```bash
# In your backend directory
cd backend

# Link to Railway staging project
railway link

# Run Prisma migration
railway run npx prisma migrate deploy

# Verify
railway run npx prisma migrate status
```

### Seed Staging Database

```bash
# Run seed script
railway run npm run seed

# This creates:
# - Demo organizations
# - Test users (admin, sponsor, investor, fund-manager)
# - Sample data for testing
```

---

## 🚀 **STEP 4: DEPLOY BACKEND TO RAILWAY**

### Deploy Backend

```bash
# From backend directory
railway up

# Railway will:
# 1. Build your application
# 2. Run npm run build
# 3. Start with npm run start
# 4. Assign a public URL
```

### Verify Deployment

```bash
# Check health endpoint
curl https://your-staging-url.railway.app/api/v1/health/live

# Should return:
# {
#   "status": "ok",
#   "uptime": 123,
#   "timestamp": "2026-01-23T..."
# }

# Check version
curl https://your-staging-url.railway.app/api/v1/version
```

---

## 🎨 **STEP 5: DEPLOY FRONTEND TO VERCEL (Staging)**

### Create Staging Branch

```bash
cd frontend

# Create staging branch
git checkout -b staging

# Push to GitHub
git push origin staging
```

### Configure Vercel Staging Environment

1. Go to Vercel Dashboard
2. Import your repository (if not already)
3. Go to Project → Settings → Git
4. Add "staging" as a deployment branch
5. Vercel will auto-create a staging deployment

### Set Staging Environment Variables in Vercel

Go to Vercel → Settings → Environment Variables → Environment: "Preview (staging branch)"

```env
# API Endpoint (Your Railway staging URL)
VITE_API_URL=https://your-staging-url.railway.app/api/v1

# Stripe Test Mode
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Plaid Sandbox
VITE_PLAID_ENV=sandbox

# Feature Flags
VITE_ENABLE_CONSTRUCTION=true
VITE_ENABLE_ESCROW=true

# Analytics
VITE_SENTRY_DSN=your_staging_sentry_dsn
```

### Deploy to Vercel Staging

```bash
# Push to staging branch triggers automatic deployment
git push origin staging

# Or deploy manually
vercel --prod --scope staging
```

### Get Staging URL

Vercel will provide a URL like: `https://realco-staging.vercel.app`

---

## ✅ **STEP 6: VERIFY STAGING DEPLOYMENT**

### Health Checks

```bash
# Backend health
curl https://your-staging-url.railway.app/api/v1/health/live
curl https://your-staging-url.railway.app/api/v1/health/ready

# Frontend
curl https://realco-staging.vercel.app
```

### Test User Flows

1. **Sign Up Flow:**
   - Visit `https://realco-staging.vercel.app/signup`
   - Create test accounts for each role
   - Verify email flow (console logs in Railway)

2. **Login Flow:**
   - Test login with demo credentials
   - Verify JWT token generation
   - Check dashboard routing

3. **Dashboard Access:**
   - Sponsor: `/dashboard/sponsor`
   - Investor: `/dashboard/investor`
   - Provider: `/dashboard/provider`
   - Fund Manager: `/dashboard/fund-manager`

4. **API Endpoints:**
   ```bash
   # Get auth token
   TOKEN=$(curl -X POST https://your-staging-url.railway.app/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"demo@realco.com","password":"demo123"}' \
     | jq -r '.token')

   # Test authenticated endpoint
   curl https://your-staging-url.railway.app/api/v1/transactions \
     -H "Authorization: Bearer $TOKEN"
   ```

---

## 📊 **STEP 7: MONITORING STAGING**

### Railway Logs

```bash
# View live logs
railway logs

# Tail logs
railway logs --tail

# Filter by level
railway logs | grep ERROR
```

### Vercel Logs

1. Go to Vercel Dashboard
2. Project → Deployments → Click staging deployment
3. View "Functions" tab for API routes logs
4. View "Build Logs" for build issues

### Health Check Monitoring

Set up simple uptime monitoring:
- UptimeRobot (free tier)
- Monitor: `https://your-staging-url.railway.app/api/v1/health/live`
- Check interval: 5 minutes
- Alert via email if down

---

## 🧪 **STEP 8: TESTING CHECKLIST**

### Smoke Tests

- [ ] Homepage loads
- [ ] All 4 role landing pages load (sponsors, investors, providers, fund-managers)
- [ ] Pricing page shows all 4 roles
- [ ] Signup flow works for all roles
- [ ] Login works
- [ ] Dashboard routes correctly for each role
- [ ] Health endpoints return 200
- [ ] Version endpoint shows correct version

### Integration Tests

- [ ] User can sign up
- [ ] User can login
- [ ] JWT token generated correctly
- [ ] Protected routes require authentication
- [ ] User can access their dashboard
- [ ] API endpoints return proper errors
- [ ] Database queries work
- [ ] Redis cache works (if enabled)

### Payment Tests (Stripe Test Mode)

- [ ] Stripe test mode keys configured
- [ ] Test card numbers work (4242 4242 4242 4242)
- [ ] Webhooks receive test events
- [ ] Payment intent creation works
- [ ] ACH verification simulated

### Bank Account Tests (Plaid Sandbox)

- [ ] Plaid Link opens
- [ ] Can connect test bank account
- [ ] Public token exchange works
- [ ] Account details retrieved
- [ ] Plaid webhooks work

---

## 🎉 **STAGING DEPLOYMENT COMPLETE!**

### What You Have Now:

✅ **Backend on Railway Staging**
- Live API at `https://your-staging-url.railway.app`
- PostgreSQL database with migrations
- Redis cache (optional)
- Stripe test mode
- Plaid sandbox
- Health check endpoints
- Full logging

✅ **Frontend on Vercel Staging**
- Live app at `https://realco-staging.vercel.app`
- Connected to staging API
- All 4 roles accessible
- Test payment flows
- Test bank connections

✅ **Testing Environment**
- Safe to test all features
- No risk to production data
- Stripe/Plaid in test mode
- Full monitoring and logs

---

## 🚀 **NEXT STEPS: IMPLEMENT 9 FINANCE ITEMS**

Now that staging is deployed, you can safely implement the 9 Finance & Trust backend components:

1. **Prisma Schema Models** (4 items):
   - BankAccount
   - Transaction
   - EscrowAccount
   - ComplianceCheck

2. **Services** (5 items):
   - bank-account.service.ts
   - plaid.service.ts
   - stripe-payment.service.ts
   - escrow.service.ts
   - compliance.service.ts

3. **API Routes**:
   - /api/v1/banking/*
   - /api/v1/payments/*
   - /api/v1/escrow/*
   - /api/v1/compliance/*

4. **Database Migration**:
   - Run migration to add new tables
   - Seed with test data

**Each change deploys automatically to staging when you push!**

---

## 📝 **STAGING BEST PRACTICES**

### DO ✅
- Test all new features on staging first
- Use staging for demos and user acceptance testing
- Keep staging environment as close to production as possible
- Run load tests on staging
- Test disaster recovery on staging
- Use staging for training

### DON'T ❌
- Use production API keys on staging
- Store real customer data on staging
- Skip staging and deploy directly to production
- Use weak secrets on staging
- Neglect staging monitoring

---

## 🆘 **TROUBLESHOOTING STAGING**

### Backend Won't Start

```bash
# Check Railway logs
railway logs

# Common issues:
# - Missing environment variables
# - Database connection failed
# - Build errors

# Verify env vars
railway variables list
```

### Frontend Build Fails

```bash
# Check Vercel build logs
# Common issues:
# - Missing VITE_ variables
# - TypeScript errors
# - Import errors

# Rebuild
vercel --force
```

### Database Connection Issues

```bash
# Test connection
railway run npx prisma db pull

# Reset database (⚠️ deletes data)
railway run npx prisma migrate reset
```

---

**You're now ready to start implementing the 9 Finance & Trust backend components on staging!**

Let me know when staging is deployed and I'll guide you through implementing the 9 items.
