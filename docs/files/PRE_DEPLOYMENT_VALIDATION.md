# Pre-Deployment Validation Checklist
## Critical Verification Before Production

---

## ⚠️ CRITICAL WARNING

**DO NOT deploy to production without completing ALL items in this checklist.**

Cursor AI generates production-ready code, but you must verify:
- Security configurations are correct
- Environment variables are set
- Database is properly configured
- External services are connected
- Tests pass
- Performance meets targets

---

## 🔍 PHASE 1: CODE QUALITY VALIDATION (30 minutes)

### TypeScript Compilation

```bash
# Must pass with ZERO errors
npm run type-check

# If errors exist:
# - Fix all TypeScript errors
# - Do NOT use @ts-ignore or any to bypass
# - Ensure strict mode is enabled
```

**✅ Checklist:**
- [ ] `npm run type-check` passes with 0 errors
- [ ] No `any` types in critical paths
- [ ] All functions have return types
- [ ] All parameters are typed
- [ ] Strict mode enabled in tsconfig.json

---

### Linting & Code Style

```bash
# Must pass with ZERO errors
npm run lint

# Auto-fix what you can
npm run lint -- --fix

# Check for security issues
npm audit
npm audit fix
```

**✅ Checklist:**
- [ ] `npm run lint` passes
- [ ] No security vulnerabilities (high/critical)
- [ ] All dependencies up to date (or documented why not)
- [ ] No unused imports or variables
- [ ] Consistent code formatting

---

### Build Verification

```bash
# Backend build
cd backend
npm run build

# Check dist folder created
ls -la dist/

# Frontend build
cd frontend
npm run build

# Check dist folder created
ls -la dist/

# Check bundle size
npm run build -- --mode production
# Should see bundle size report
# Main bundle should be < 500KB
```

**✅ Checklist:**
- [ ] Backend builds successfully
- [ ] Frontend builds successfully
- [ ] No build warnings about large bundles
- [ ] Source maps generated (for debugging)
- [ ] Environment-specific configs work

---

## 🔐 PHASE 2: SECURITY VALIDATION (45 minutes)

### Environment Variables Audit

```bash
# Create production .env.example
cat > .env.production.example << 'EOF'
# Database
DATABASE_URL=postgresql://user:password@host:5432/db
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Authentication
JWT_SECRET=CHANGE_THIS_TO_RANDOM_256_BIT_HEX
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=30d

# Encryption
ENCRYPTION_KEY=CHANGE_THIS_TO_RANDOM_256_BIT_HEX

# Stripe
STRIPE_SECRET_KEY=sk_live_CHANGE_THIS
STRIPE_WEBHOOK_SECRET=whsec_CHANGE_THIS
STRIPE_PUBLISHABLE_KEY=pk_live_CHANGE_THIS

# Plaid
PLAID_CLIENT_ID=CHANGE_THIS
PLAID_SECRET=CHANGE_THIS
PLAID_ENV=production

# AWS S3
AWS_ACCESS_KEY_ID=CHANGE_THIS
AWS_SECRET_ACCESS_KEY=CHANGE_THIS
AWS_S3_BUCKET_DOCS=realco-prod-docs
AWS_S3_BUCKET_CONSTRUCTION=realco-prod-construction
AWS_REGION=us-east-1

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=CHANGE_THIS
SMTP_FROM=noreply@realco.com

# Application
NODE_ENV=production
PORT=8080
LOG_LEVEL=info
CORS_ORIGIN=https://app.realco.com

# Monitoring
SENTRY_DSN=CHANGE_THIS
EOF
```

**✅ Checklist:**
- [ ] All secrets are set in Railway/Vercel (not in code)
- [ ] JWT_SECRET is random 256-bit hex
- [ ] ENCRYPTION_KEY is random 256-bit hex
- [ ] Stripe keys are LIVE keys (sk_live_, pk_live_)
- [ ] Plaid environment is "production"
- [ ] CORS_ORIGIN is set to production domain
- [ ] No development/test secrets in production
- [ ] Database URL points to production database
- [ ] All API keys are valid and tested

**Generate secure secrets:**
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Security Headers Verification

**Create test file:**
```typescript
// test/security/headers.test.ts
import { test, expect } from 'vitest';

test('Security headers are set', async () => {
  const response = await fetch('https://api.realco.com/health');
  
  // Check security headers
  expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  expect(response.headers.get('Strict-Transport-Security')).toContain('max-age=');
});
```

**✅ Checklist:**
- [ ] Helmet.js configured in backend
- [ ] HTTPS enforced (no HTTP allowed)
- [ ] Security headers present on all responses
- [ ] CORS properly configured (not wildcard in production)
- [ ] CSP (Content Security Policy) configured
- [ ] Rate limiting enabled

---

### Authentication & Authorization Test

```typescript
// test/security/auth.test.ts
import { test, expect } from 'vitest';

test('Protected routes require authentication', async () => {
  const response = await fetch('https://api.realco.com/api/projects');
  expect(response.status).toBe(401);
});

test('Invalid token is rejected', async () => {
  const response = await fetch('https://api.realco.com/api/projects', {
    headers: { 'Authorization': 'Bearer invalid_token' }
  });
  expect(response.status).toBe(401);
});

test('Insufficient permissions return 403', async () => {
  // Use investor token to access admin endpoint
  const response = await fetch('https://api.realco.com/api/admin/users', {
    headers: { 'Authorization': `Bearer ${investorToken}` }
  });
  expect(response.status).toBe(403);
});
```

**✅ Checklist:**
- [ ] All protected routes require authentication
- [ ] Invalid tokens are rejected
- [ ] Role-based access control works
- [ ] Token expiration works correctly
- [ ] Refresh token rotation implemented
- [ ] No endpoints accessible without auth (except public ones)

---

### Input Validation Test

```typescript
// test/security/validation.test.ts
import { test, expect } from 'vitest';

test('SQL injection is prevented', async () => {
  const maliciousInput = "1' OR '1'='1";
  const response = await fetch('https://api.realco.com/api/projects', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      projectCode: maliciousInput
    })
  });
  
  expect(response.status).toBe(400); // Should be rejected
});

test('XSS is prevented', async () => {
  const xssPayload = '<script>alert("xss")</script>';
  const response = await fetch('https://api.realco.com/api/projects', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description: xssPayload
    })
  });
  
  // Should either reject or sanitize
  expect(response.status).toBe(400);
});
```

**✅ Checklist:**
- [ ] All inputs validated with Zod schemas
- [ ] SQL injection prevention tested
- [ ] XSS prevention tested
- [ ] File upload validation works
- [ ] Max payload size enforced
- [ ] All user inputs sanitized

---

## 🗄️ PHASE 3: DATABASE VALIDATION (30 minutes)

### Schema Validation

```bash
# Check schema is up to date
npx prisma migrate status

# Should show: "Database is up to date"
# If not, you have unapplied migrations
```

**✅ Checklist:**
- [ ] All migrations applied
- [ ] Schema matches Prisma schema
- [ ] No pending migrations
- [ ] Foreign key constraints working
- [ ] Indexes created properly

---

### Database Backup

```bash
# Create backup BEFORE any production deployment
# Railway
railway run pg_dump realco_prod > backup_pre_deploy_$(date +%Y%m%d_%H%M%S).sql

# Or direct connection
pg_dump $DATABASE_URL > backup_pre_deploy_$(date +%Y%m%d_%H%M%S).sql

# Verify backup file created and has content
ls -lh backup_*.sql
head -n 50 backup_*.sql
```

**✅ Checklist:**
- [ ] Database backup created
- [ ] Backup file is not empty
- [ ] Backup file size reasonable (>1KB)
- [ ] Backup stored securely
- [ ] Restore procedure documented
- [ ] Backup retention policy set

---

### Connection Pool Test

```typescript
// test/database/connection.test.ts
import { PrismaClient } from '@prisma/client';

test('Database connection pool works', async () => {
  const prisma = new PrismaClient();
  
  // Create multiple concurrent connections
  const promises = Array(20).fill(null).map(() => 
    prisma.user.count()
  );
  
  const results = await Promise.all(promises);
  
  expect(results.length).toBe(20);
  expect(results.every(r => typeof r === 'number')).toBe(true);
  
  await prisma.$disconnect();
});
```

**✅ Checklist:**
- [ ] Connection pool configured (min/max)
- [ ] Concurrent queries work
- [ ] No connection exhaustion under load
- [ ] Connection timeout configured
- [ ] Idle connection cleanup works

---

## 💰 PHASE 4: PAYMENT INTEGRATION VALIDATION (45 minutes)

### Stripe Configuration

```bash
# Verify Stripe keys
stripe login
stripe config --list

# Test webhook endpoint
stripe listen --forward-to https://api.realco.com/webhooks/stripe
stripe trigger payment_intent.succeeded
```

**✅ Checklist:**
- [ ] Stripe account in production mode
- [ ] Live API keys configured
- [ ] Webhook endpoint URL correct
- [ ] Webhook secret matches environment variable
- [ ] Test webhook delivery successful
- [ ] Payment methods enabled (ACH, card)
- [ ] Stripe Connect configured (if needed)

---

### Plaid Configuration

```typescript
// test/integrations/plaid.test.ts
import { PlaidApi } from 'plaid';

test('Plaid production configuration', async () => {
  const plaidClient = new PlaidApi(config);
  
  // Verify environment
  expect(process.env.PLAID_ENV).toBe('production');
  
  // Test connection (this will fail if keys invalid)
  const response = await plaidClient.institutionsGet({
    count: 1,
    offset: 0,
    country_codes: ['US']
  });
  
  expect(response.data.institutions.length).toBeGreaterThan(0);
});
```

**✅ Checklist:**
- [ ] Plaid account in production
- [ ] Production credentials configured
- [ ] PLAID_ENV set to "production"
- [ ] Institution search works
- [ ] Link token creation works
- [ ] Public token exchange works
- [ ] Account verification tested

---

### End-to-End Payment Test

**⚠️ Use Stripe test mode for this, then verify production is configured correctly**

```typescript
// test/integrations/payment-flow.test.ts
test('Complete payment flow', async () => {
  // 1. Create investment
  const investment = await createTestInvestment();
  
  // 2. Add bank account (use Plaid test credentials)
  const bankAccount = await addTestBankAccount();
  
  // 3. Initiate payment
  const transaction = await initiatePayment(investment.id, bankAccount.id);
  expect(transaction.status).toBe('INITIATED');
  
  // 4. Process payment (use Stripe test mode)
  await processPayment(transaction.id);
  
  // 5. Wait for webhook
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // 6. Verify payment completed
  const updatedTransaction = await getTransaction(transaction.id);
  expect(updatedTransaction.status).toBe('COMPLETED');
  
  // 7. Verify escrow account updated
  const escrow = await getEscrowAccount(investment.offeringId);
  expect(escrow.currentBalance).toBeGreaterThan(0);
});
```

**✅ Checklist:**
- [ ] Bank account creation works
- [ ] Payment initiation works
- [ ] Stripe payment processing works
- [ ] Webhook received and processed
- [ ] Transaction status updated correctly
- [ ] Escrow account balance updated
- [ ] Ledger entry created
- [ ] Audit log created
- [ ] Investor notification sent

---

## 🧪 PHASE 5: TESTING VALIDATION (60 minutes)

### Unit Tests

```bash
# Run all unit tests
npm run test

# Should see:
# - All tests passing
# - Coverage report
# - No skipped tests
```

**✅ Checklist:**
- [ ] All unit tests pass
- [ ] No skipped or pending tests
- [ ] Coverage >80% on critical paths
- [ ] All service layer tested
- [ ] All utility functions tested
- [ ] Edge cases covered

---

### Integration Tests

```bash
# Run integration tests
npm run test:integration

# Or specific test suites
npm run test -- --grep "API"
npm run test -- --grep "Database"
npm run test -- --grep "Payment"
```

**✅ Checklist:**
- [ ] All API endpoints tested
- [ ] Database operations tested
- [ ] External service integrations tested
- [ ] Authentication flows tested
- [ ] Authorization checks tested

---

### Load Testing

```bash
# Install k6
brew install k6  # macOS
# or
curl https://github.com/grafana/k6/releases/download/v0.48.0/k6-v0.48.0-linux-amd64.tar.gz -L | tar xvz

# Create load test script
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '30s', target: 100 }, // Spike to 100 users
    { duration: '1m', target: 50 },   // Ramp down
    { duration: '30s', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function() {
  const res = http.get('https://api.realco.com/api/projects');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
EOF

# Run load test
k6 run load-test.js
```

**✅ Checklist:**
- [ ] API handles 100 concurrent users
- [ ] 95% of requests < 500ms
- [ ] Error rate < 1%
- [ ] No memory leaks under load
- [ ] Database connections stable
- [ ] No crashes or freezes

---

## 🚀 PHASE 6: DEPLOYMENT READINESS (30 minutes)

### Health Check Endpoint

```bash
# Test health check
curl https://api.realco.com/health

# Should return:
# {
#   "uptime": 12345,
#   "timestamp": 1234567890,
#   "checks": {
#     "database": true,
#     "redis": true,
#     "stripe": true,
#     "s3": true
#   }
# }
```

**✅ Checklist:**
- [ ] Health check endpoint responds
- [ ] All dependency checks pass
- [ ] Response time < 100ms
- [ ] Proper status codes (200/503)
- [ ] Monitoring can access endpoint

---

### Monitoring Setup

```bash
# Verify Sentry is configured
curl -X POST https://api.realco.com/test-sentry-error

# Check Sentry dashboard for error

# Verify logging is working
tail -f logs/application.log  # Or check log aggregation service
```

**✅ Checklist:**
- [ ] Sentry configured and tested
- [ ] Error tracking working
- [ ] Log aggregation working
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Alert notifications set up

---

### Rollback Plan

```bash
# Document rollback procedure
cat > ROLLBACK_PROCEDURE.md << 'EOF'
# Emergency Rollback Procedure

## If Deployment Fails:

### 1. Immediate Actions (5 minutes)
- Alert team in #engineering-alerts
- Stop new deployments
- Assess impact

### 2. Rollback Code (10 minutes)
```bash
# Backend (Railway)
railway rollback

# Frontend (Vercel)
vercel rollback
```

### 3. Rollback Database (IF NEEDED - 15 minutes)
```bash
# ONLY if migration caused issues
railway run psql < backup_pre_deploy_YYYYMMDD_HHMMSS.sql
```

### 4. Verify (5 minutes)
- Check health endpoint: curl https://api.realco.com/health
- Test critical user flow
- Monitor error rates

### 5. Post-Incident
- Document what went wrong
- Update deployment checklist
- Schedule fix
EOF
```

**✅ Checklist:**
- [ ] Rollback procedure documented
- [ ] Team knows how to rollback
- [ ] Rollback tested in staging
- [ ] Database backup accessible
- [ ] Contact list for emergencies

---

## 📋 FINAL PRE-DEPLOYMENT CHECKLIST

### Code & Quality
- [ ] TypeScript compiles (0 errors)
- [ ] Linting passes (0 errors)
- [ ] Build succeeds (backend + frontend)
- [ ] No security vulnerabilities
- [ ] All tests pass (unit + integration)

### Security
- [ ] All secrets in environment variables
- [ ] JWT_SECRET is secure random value
- [ ] ENCRYPTION_KEY is secure random value
- [ ] Stripe live keys configured
- [ ] Plaid production configured
- [ ] Security headers enabled
- [ ] HTTPS enforced
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] CORS properly configured

### Database
- [ ] Database backup created
- [ ] Migrations applied
- [ ] Schema validated
- [ ] Connection pool configured
- [ ] Indexes created

### Integrations
- [ ] Stripe production mode
- [ ] Stripe webhook working
- [ ] Plaid production mode
- [ ] Plaid Link working
- [ ] S3 buckets created
- [ ] Email service configured

### Infrastructure
- [ ] Health check working
- [ ] Monitoring configured
- [ ] Logging working
- [ ] Alerts set up
- [ ] Load testing passed

### Documentation
- [ ] API documentation updated
- [ ] Deployment runbook ready
- [ ] Rollback procedure documented
- [ ] Environment variables documented

### Team Readiness
- [ ] Team notified of deployment
- [ ] Support team briefed
- [ ] On-call rotation scheduled
- [ ] Emergency contacts updated

---

## ⚠️ GO / NO-GO DECISION

**You can deploy if:**
✅ ALL items above are checked  
✅ No critical bugs in staging  
✅ Performance tests passed  
✅ Team is available for monitoring  
✅ Backup and rollback plan ready  

**DO NOT deploy if:**
❌ Any critical item unchecked  
❌ Active critical bugs  
❌ Tests failing  
❌ No backup created  
❌ Friday afternoon/weekend (wait for Monday)  

---

## 📞 EMERGENCY CONTACTS

```
Tech Lead: [Name] - [Phone]
DevOps: [Name] - [Phone]
Database Admin: [Name] - [Phone]
On-Call Engineer: [Name] - [Phone]

Slack: #engineering-alerts
Incident Manager: [Name]
```

---

## ✅ SIGN-OFF

```
[ ] Code Review Approved By: _________________ Date: _______
[ ] Security Review By: _________________ Date: _______
[ ] QA Approved By: _________________ Date: _______
[ ] Tech Lead Approved: _________________ Date: _______

Deployment Authorized: YES / NO

If NO, reason: _____________________________________________
```

---

**Once ALL items are verified, proceed to DEPLOYMENT_GUIDE.md**
