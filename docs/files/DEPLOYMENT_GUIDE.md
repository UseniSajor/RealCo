# Production Deployment Guide
## Step-by-Step Deployment to Railway & Vercel

---

## 🎯 OVERVIEW

This guide walks you through deploying RealCo platform to production:
- **Backend:** Railway (Node.js + PostgreSQL + Redis)
- **Frontend:** Vercel (React + Vite)

**Estimated Time:** 2-3 hours  
**Prerequisites:** PRE_DEPLOYMENT_VALIDATION.md completed ✅

---

## 📅 DEPLOYMENT TIMELINE

```
T-24 hours: Team notification
T-12 hours: Final testing in staging
T-4 hours:  Create database backup
T-2 hours:  Begin deployment window
T-0:        Deploy backend
T+15 min:   Deploy frontend
T+30 min:   Smoke tests
T+2 hours:  Monitor closely
T+24 hours: Post-deployment review
```

---

## 🚀 PHASE 1: PRE-DEPLOYMENT (T-2 hours)

### Step 1.1: Notify Stakeholders

```markdown
Subject: Production Deployment - RealCo Kealee Integration

Team,

We will be deploying the RealCo-Kealee integration to production:

**Deployment Window:** [Date] [Time] - [Time] [Timezone]
**Expected Downtime:** ~5 minutes during database migration
**Services Affected:** API, Web App

**Timeline:**
- [Time]: Begin deployment
- [Time]: Database migration
- [Time]: Backend deployment
- [Time]: Frontend deployment
- [Time]: Smoke tests
- [Time]: Monitoring period

**Team Availability:**
- Tech Lead: [Name] (on-site)
- DevOps: [Name] (on-call)
- Support: [Name] (monitoring)

**Rollback Plan:** Available if critical issues arise

Please avoid making changes during deployment window.

Questions? Reply to this email or #engineering-alerts

Thanks,
[Your Name]
```

**Send to:**
- [ ] Engineering team
- [ ] Product team
- [ ] Support team
- [ ] Executive team (if major release)

---

### Step 1.2: Final Staging Verification

```bash
# Run full test suite on staging
npm run test
npm run test:integration
npm run test:e2e

# Verify staging is working
curl https://staging.realco.com/health
curl https://api-staging.realco.com/health

# Test critical user flows manually
# 1. Login
# 2. Create investment
# 3. Add bank account
# 4. Initiate payment
# 5. View project dashboard
```

**✅ Checklist:**
- [ ] All tests pass on staging
- [ ] Health checks green
- [ ] Critical flows work
- [ ] No errors in logs
- [ ] Performance acceptable

---

### Step 1.3: Create Production Database Backup

```bash
# Connect to Railway
railway login
railway link

# Create timestamped backup
BACKUP_FILE="backup_prod_$(date +%Y%m%d_%H%M%S).sql"

# Create backup
railway run pg_dump realco_prod > $BACKUP_FILE

# Verify backup
ls -lh $BACKUP_FILE
echo "Backup size: $(du -h $BACKUP_FILE | cut -f1)"

# Verify backup has content
head -n 100 $BACKUP_FILE
tail -n 100 $BACKUP_FILE

# Store backup securely
# Option 1: Upload to S3
aws s3 cp $BACKUP_FILE s3://realco-backups/database/

# Option 2: Keep local copy
cp $BACKUP_FILE ~/backups/realco/

# Verify you can read the backup
pg_restore --list $BACKUP_FILE | head -n 20
```

**✅ Checklist:**
- [ ] Backup file created
- [ ] Backup file >1MB (has data)
- [ ] Backup stored in 2 locations
- [ ] Backup is readable
- [ ] Backup timestamp noted

---

### Step 1.4: Prepare Deployment Commands

Create a deployment script:

```bash
#!/bin/bash
# deploy-production.sh

set -e  # Exit on error

echo "=== RealCo Production Deployment ==="
echo "Started at: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
echo "Checking prerequisites..."

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    print_error "Railway CLI not installed"
    exit 1
fi
print_status "Railway CLI installed"

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not installed"
    exit 1
fi
print_status "Vercel CLI installed"

# Check logged in
railway whoami || (print_error "Not logged into Railway" && exit 1)
print_status "Logged into Railway"

vercel whoami || (print_error "Not logged into Vercel" && exit 1)
print_status "Logged into Vercel"

echo ""
echo "=== Ready to Deploy ==="
echo ""
read -p "Continue with deployment? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    print_warning "Deployment cancelled"
    exit 0
fi

# Save this script for later steps
```

Make it executable:
```bash
chmod +x deploy-production.sh
```

---

## 🗄️ PHASE 2: DATABASE MIGRATION (T-0)

### Step 2.1: Put Application in Maintenance Mode (Optional)

```typescript
// backend/src/middleware/maintenance.ts
export function maintenanceMode(req, res, next) {
  if (process.env.MAINTENANCE_MODE === 'true') {
    return res.status(503).json({
      success: false,
      error: 'System is currently under maintenance. Please try again in 5 minutes.',
      retryAfter: 300  // 5 minutes
    });
  }
  next();
}

// Enable maintenance mode
railway variables set MAINTENANCE_MODE=true
```

**✅ Checklist:**
- [ ] Maintenance mode enabled (if needed)
- [ ] Users notified via status page
- [ ] Support team aware

---

### Step 2.2: Run Database Migration

```bash
# Navigate to backend
cd backend

# Check current migration status
railway run npx prisma migrate status

# Should show pending migrations
# If no pending migrations, skip to Step 2.3

# CRITICAL: Double-check you're in production
railway status
# Verify it shows production environment

# Run migrations
echo "Running database migrations..."
railway run npx prisma migrate deploy

# Verify migrations applied
railway run npx prisma migrate status
# Should show: "Database is up to date"

# Generate Prisma Client
railway run npx prisma generate

# Verify schema
railway run npx prisma db pull
# This should match your local schema
```

**If migration fails:**
```bash
# Check error message
railway logs --tail

# Common fixes:
# 1. Constraint violation - check data
# 2. Timeout - increase database resources
# 3. Lock - wait and retry

# If critical error, ROLLBACK:
railway run psql < $BACKUP_FILE
```

**✅ Checklist:**
- [ ] Migration status checked
- [ ] Migrations applied successfully
- [ ] Schema verified
- [ ] No errors in logs
- [ ] Database accessible

---

## 🖥️ PHASE 3: BACKEND DEPLOYMENT (T+5 min)

### Step 3.1: Deploy Backend to Railway

```bash
# Ensure you're in backend directory
cd backend

# Verify production environment variables
railway variables

# Check required variables:
# - DATABASE_URL
# - JWT_SECRET
# - ENCRYPTION_KEY
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET
# - PLAID_CLIENT_ID
# - PLAID_SECRET
# etc.

# Set any missing variables
railway variables set VARIABLE_NAME=value

# Build locally first (to catch any build errors)
npm run build

# Verify build succeeded
ls -la dist/

# Deploy to Railway
railway up

# This will:
# 1. Push code to Railway
# 2. Install dependencies
# 3. Run build
# 4. Start application

# Watch deployment logs
railway logs --tail
```

**Watch for:**
- ✅ "Build succeeded"
- ✅ "Deployment live"
- ✅ "Server started on port 8080"
- ❌ Any errors or crashes

**✅ Checklist:**
- [ ] Build completed successfully
- [ ] Application started
- [ ] No errors in logs
- [ ] Health check passing

---

### Step 3.2: Verify Backend Deployment

```bash
# Test health endpoint
curl https://api.realco.com/health

# Should return:
# {
#   "uptime": 123,
#   "timestamp": 1234567890,
#   "checks": {
#     "database": true,
#     "redis": true,
#     "stripe": true,
#     "s3": true
#   }
# }

# Test authentication
curl -X POST https://api.realco.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@realco.com",
    "password": "TestPassword123!"
  }'

# Should return access token

# Test protected endpoint
TOKEN="your_access_token_here"
curl https://api.realco.com/api/projects \
  -H "Authorization: Bearer $TOKEN"

# Should return projects or empty array

# Check logs for any errors
railway logs --tail
```

**✅ Checklist:**
- [ ] Health check returns 200
- [ ] All dependency checks pass
- [ ] Authentication works
- [ ] Protected endpoints require auth
- [ ] No errors in logs
- [ ] Response times acceptable (<500ms)

---

### Step 3.3: Test Critical API Endpoints

```bash
# Create test script
cat > test-api.sh << 'EOF'
#!/bin/bash

API_URL="https://api.realco.com"
TEST_EMAIL="test@realco.com"
TEST_PASSWORD="TestPassword123!"

echo "Testing RealCo API..."

# 1. Login
echo "1. Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')

if [ "$TOKEN" != "null" ]; then
    echo "✓ Login successful"
else
    echo "✗ Login failed"
    exit 1
fi

# 2. Get projects
echo "2. Testing get projects..."
curl -s $API_URL/api/projects \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. Get bank accounts
echo "3. Testing get bank accounts..."
curl -s $API_URL/api/bank-accounts \
  -H "Authorization: Bearer $TOKEN" | jq .

# 4. Get transactions
echo "4. Testing get transactions..."
curl -s $API_URL/api/transactions \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "API tests complete!"
EOF

chmod +x test-api.sh
./test-api.sh
```

**✅ Checklist:**
- [ ] Login works
- [ ] Projects endpoint works
- [ ] Bank accounts endpoint works
- [ ] Transactions endpoint works
- [ ] All responses under 500ms

---

## 🌐 PHASE 4: FRONTEND DEPLOYMENT (T+15 min)

### Step 4.1: Update Frontend Environment Variables

```bash
# Navigate to frontend
cd frontend

# Verify Vercel project is linked
vercel link

# Check current environment variables
vercel env ls

# Add/update production variables
vercel env add VITE_API_URL production
# Enter: https://api.realco.com

vercel env add VITE_STRIPE_PUBLISHABLE_KEY production
# Enter: pk_live_...

# Add all required variables:
# - VITE_API_URL
# - VITE_STRIPE_PUBLISHABLE_KEY
# - VITE_PLAID_ENV
# - VITE_ENABLE_CONSTRUCTION
# - VITE_GA_TRACKING_ID
```

---

### Step 4.2: Build and Deploy Frontend

```bash
# Build locally first
npm run build

# Check build output
ls -la dist/
# Verify index.html and assets/ exist

# Check bundle size
du -sh dist/

# Deploy to Vercel
vercel --prod

# This will:
# 1. Build the application
# 2. Deploy to production
# 3. Assign to production domain

# Wait for deployment to complete
# Vercel will output: https://app.realco.com
```

**✅ Checklist:**
- [ ] Build succeeded
- [ ] Bundle size reasonable (<2MB)
- [ ] Deployment completed
- [ ] Production URL active

---

### Step 4.3: Verify Frontend Deployment

```bash
# Test production URL
curl -I https://app.realco.com

# Should return 200 OK

# Check in browser
# Open: https://app.realco.com

# Verify:
# - Page loads
# - No console errors
# - Can login
# - Can navigate
# - API calls work
```

**Manual testing checklist:**
- [ ] Homepage loads
- [ ] No JavaScript errors in console
- [ ] No failed network requests
- [ ] Can login successfully
- [ ] Dashboard loads with data
- [ ] Can navigate between pages
- [ ] Images load correctly
- [ ] Responsive on mobile

---

## 🧪 PHASE 5: SMOKE TESTS (T+30 min)

### Step 5.1: Critical User Flows

**Test each flow manually:**

**Flow 1: User Authentication**
1. [ ] Go to https://app.realco.com/login
2. [ ] Enter email and password
3. [ ] Click "Login"
4. [ ] Verify redirected to dashboard
5. [ ] Verify user name displayed
6. [ ] Click "Logout"
7. [ ] Verify redirected to login

**Flow 2: Investment Creation (Investor)**
1. [ ] Login as investor
2. [ ] Navigate to "Browse Deals"
3. [ ] Click on an offering
4. [ ] Click "Invest"
5. [ ] Enter amount
6. [ ] Submit investment
7. [ ] Verify confirmation message

**Flow 3: Bank Account Addition**
1. [ ] Navigate to "Payment Methods"
2. [ ] Click "Add Bank Account"
3. [ ] Connect with Plaid (use test account)
4. [ ] Verify bank account appears in list
5. [ ] Verify verification status

**Flow 4: Payment Processing**
1. [ ] Create test investment
2. [ ] Add bank account
3. [ ] Initiate payment
4. [ ] Wait for webhook processing (30 seconds)
5. [ ] Verify payment status updates
6. [ ] Check transaction appears in history

**Flow 5: Construction Project (Contractor)**
1. [ ] Login as contractor
2. [ ] Navigate to project
3. [ ] View project dashboard
4. [ ] Create daily log
5. [ ] Upload photo
6. [ ] Verify photo appears
7. [ ] Update task progress

---

### Step 5.2: Automated Smoke Tests

```typescript
// smoke-tests/production.test.ts
import { test, expect } from '@playwright/test';

test.describe('Production Smoke Tests', () => {
  test('Homepage loads', async ({ page }) => {
    await page.goto('https://app.realco.com');
    await expect(page).toHaveTitle(/RealCo/);
  });

  test('Login flow works', async ({ page }) => {
    await page.goto('https://app.realco.com/login');
    
    await page.fill('[name="email"]', 'test@realco.com');
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/dashboard/);
  });

  test('API health check', async ({ request }) => {
    const response = await request.get('https://api.realco.com/health');
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.checks.database).toBe(true);
    expect(body.checks.redis).toBe(true);
  });
});
```

Run smoke tests:
```bash
npx playwright test smoke-tests/production.test.ts
```

**✅ Checklist:**
- [ ] All smoke tests pass
- [ ] No console errors
- [ ] No failed API calls
- [ ] No visual regressions

---

## 🔍 PHASE 6: POST-DEPLOYMENT MONITORING (T+1 hour)

### Step 6.1: Monitor Error Rates

```bash
# Check Sentry for errors
# Go to: https://sentry.io/organizations/realco/issues/

# Should see:
# - No new critical errors
# - Error rate stable or decreasing
# - No spike in errors

# Check Railway logs
railway logs --tail

# Watch for:
# - Any uncaught exceptions
# - Database errors
# - Timeout errors
# - Memory issues
```

**Create monitoring dashboard:**
```bash
# Key metrics to watch:
# - Error rate (should be <1%)
# - Response time (p95 <500ms)
# - Request rate
# - Database connections
# - Memory usage
# - CPU usage
```

---

### Step 6.2: Monitor Performance

```bash
# Test response times
for i in {1..10}; do
  curl -w "Response time: %{time_total}s\n" -o /dev/null -s https://api.realco.com/health
done

# Should all be <500ms

# Check database query performance
railway run npx prisma studio
# Monitor slow queries
```

---

### Step 6.3: Monitor User Activity

```bash
# Check analytics
# - Active users
# - Page views
# - API calls
# - Conversions

# Check support channels
# - Any user complaints?
# - Any bug reports?
# - Any confusion?
```

---

## 📊 PHASE 7: VALIDATION (T+2 hours)

### Step 7.1: Metrics Dashboard

Create a monitoring checklist:

```markdown
## 2-Hour Post-Deployment Metrics

**System Health:**
- [ ] CPU usage: <70%
- [ ] Memory usage: <80%
- [ ] Database connections: <80% of max
- [ ] Disk usage: <80%

**Application Metrics:**
- [ ] Error rate: <1%
- [ ] API response time (p95): <500ms
- [ ] API success rate: >99%
- [ ] Active users: Normal range

**Business Metrics:**
- [ ] New investments: Working
- [ ] Payments: Processing correctly
- [ ] Bank verifications: Working
- [ ] Email notifications: Sending

**User Feedback:**
- [ ] No critical bug reports
- [ ] No login issues
- [ ] No payment failures
- [ ] No data loss reports
```

---

### Step 7.2: Disable Maintenance Mode

```bash
# If maintenance mode was enabled
railway variables set MAINTENANCE_MODE=false

# Verify application accessible
curl https://api.realco.com/health
```

---

### Step 7.3: Notify Team of Successful Deployment

```markdown
Subject: ✅ Production Deployment Complete - RealCo

Team,

The RealCo-Kealee integration has been successfully deployed to production.

**Deployment Summary:**
- Started: [Time]
- Completed: [Time]
- Duration: [X] minutes
- Downtime: ~5 minutes

**Status:**
✅ Database migration successful
✅ Backend deployed and healthy
✅ Frontend deployed and accessible
✅ All smoke tests passed
✅ No critical errors detected

**Monitoring:**
- Error rate: <1%
- Response time: [X]ms (p95)
- All systems operational

**What's New:**
- Construction project management
- Escrow and payment processing
- Bank account management with Plaid
- Investor dashboards

**Next Steps:**
- Continue monitoring for 24 hours
- Address any user feedback
- Post-deployment review scheduled for [Date]

Questions or issues? Report in #engineering-alerts

Thanks to everyone for their work on this release!

[Your Name]
```

---

## 🎉 DEPLOYMENT COMPLETE!

**Congratulations!** Your RealCo-Kealee integration is now live in production.

### Next 24 Hours:

**Immediate (0-2 hours):**
- [ ] Monitor error rates closely
- [ ] Watch for any spike in errors
- [ ] Be ready to rollback if needed

**Short-term (2-8 hours):**
- [ ] Continue monitoring dashboards
- [ ] Check user feedback
- [ ] Address any minor issues

**Medium-term (8-24 hours):**
- [ ] Review performance metrics
- [ ] Analyze user behavior
- [ ] Document any issues
- [ ] Plan improvements

---

## 📋 POST-DEPLOYMENT CHECKLIST

24 hours after deployment:

- [ ] No critical errors
- [ ] Performance within targets
- [ ] User feedback positive
- [ ] All features working
- [ ] Database healthy
- [ ] Backups running
- [ ] Monitoring stable

---

## 🚨 IF SOMETHING GOES WRONG

### Signs of Critical Issues:

- ❌ Error rate >5%
- ❌ Multiple users unable to login
- ❌ Payment failures
- ❌ Database connection errors
- ❌ Application crashes

### Immediate Actions:

1. **Assess Severity**
   - Is system usable?
   - How many users affected?
   - Is data at risk?

2. **Communicate**
   - Alert team in #engineering-alerts
   - Update status page
   - Notify leadership if critical

3. **Decide: Fix Forward or Rollback**
   - Can it be hotfixed quickly (<30 min)?
   - Or is rollback safer?

4. **Execute Decision**
   - If rollback: See ROLLBACK_PROCEDURE.md
   - If hotfix: Deploy fix ASAP

5. **Post-Incident**
   - Document what happened
   - Root cause analysis
   - Update procedures

---

## 📞 EMERGENCY CONTACTS

```
On-Call Engineer: [Name] [Phone]
Tech Lead: [Name] [Phone]
DevOps: [Name] [Phone]
CTO: [Name] [Phone]

Slack: #engineering-alerts
PagerDuty: [URL]
```

---

**You did it!** 🎊

Now move to POST_DEPLOYMENT_MONITORING.md for ongoing monitoring guidance.
