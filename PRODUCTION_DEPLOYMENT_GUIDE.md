# RealCo Platform - Production Deployment Guide

**Version:** 1.0.0  
**Last Updated:** 2026-01-22  
**Status:** Production Ready ✅

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Database Migration](#database-migration)
5. [Backend Deployment (Railway)](#backend-deployment-railway)
6. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
7. [Health Checks & Monitoring](#health-checks--monitoring)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Security Checklist](#security-checklist)
10. [Disaster Recovery](#disaster-recovery)
11. [Troubleshooting](#troubleshooting)

---

## Overview

RealCo platform consists of:
- **Backend API:** Node.js/Fastify on Railway
- **Frontend:** React/Vite on Vercel
- **Database:** PostgreSQL on Railway
- **Redis:** Redis on Railway (optional)
- **File Storage:** AWS S3
- **Payment Processing:** Stripe
- **Bank Verification:** Plaid

---

## Prerequisites

### Required Tools

```bash
# Node.js 18+
node --version  # v18.0.0+

# Railway CLI
npm install -g @railway/cli

# Vercel CLI
npm install -g vercel

# Database tools
psql --version  # PostgreSQL client
```

### Required Accounts

- ✅ Railway account (for backend + database)
- ✅ Vercel account (for frontend)
- ✅ Stripe account (live mode)
- ✅ Plaid account (production)
- ✅ AWS account (S3 buckets)
- ✅ SendGrid account (email)
- ✅ Sentry account (error tracking)

---

## Environment Setup

### Step 1: Generate Secure Secrets

```bash
# Generate 256-bit secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate 3 secrets:
# 1. JWT_SECRET
# 2. ENCRYPTION_KEY
# 3. SESSION_SECRET
```

**⚠️ CRITICAL:** Never reuse secrets across environments!

### Step 2: Configure Railway Variables

Navigate to Railway Dashboard → Your Project → Variables:

```bash
# Core
NODE_ENV=production
PORT=3000

# Database (auto-populated)
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=50

# Authentication (PASTE YOUR GENERATED VALUES)
JWT_SECRET=[YOUR_GENERATED_SECRET]
ENCRYPTION_KEY=[YOUR_GENERATED_SECRET]
SESSION_SECRET=[YOUR_GENERATED_SECRET]

# Stripe (Live Mode)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Plaid (Production)
PLAID_CLIENT_ID=...
PLAID_SECRET=...
PLAID_ENV=production

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=realco-prod-documents

# Redis (auto-populated)
REDIS_URL=${{Redis.REDIS_URL}}

# Email
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=noreply@realco.com
EMAIL_SERVICE=sendgrid

# Monitoring
SENTRY_DSN=...
SENTRY_ENVIRONMENT=production
LOG_LEVEL=info
LOG_FORMAT=json

# Security
CORS_ORIGINS=https://app.realco.com
RATE_LIMIT_MAX=60

# Frontend
FRONTEND_URL=https://app.realco.com
WEBHOOK_BASE_URL=https://api.realco.com

# Feature Flags
ENABLE_CONSTRUCTION_MODULE=true
ENABLE_ESCROW_MODULE=true
ENABLE_PAYMENT_PROCESSING=true
```

### Step 3: Verify Environment

```bash
railway run printenv | grep -E "DATABASE_URL|STRIPE|PLAID"
```

---

## Database Migration

### Pre-Migration Checklist

- [ ] Database backup created
- [ ] Migration tested on staging
- [ ] Migration SQL reviewed
- [ ] Rollback plan ready
- [ ] Maintenance window scheduled (if needed)
- [ ] Team notified

### Step 1: Create Backup

```bash
# Using Railway
railway run pg_dump -Fc > backup_$(date +%Y%m%d_%H%M%S).dump

# Verify backup
ls -lh backup_*.dump
```

### Step 2: Check Migration Status

```bash
railway run npx prisma migrate status
```

### Step 3: Run Migration

```bash
# Automated script (recommended)
chmod +x scripts/migrate-database.sh
./scripts/migrate-database.sh production

# OR Manual
railway run npx prisma migrate deploy
```

### Step 4: Verify Migration

```bash
# Check status
railway run npx prisma migrate status

# Test a simple query
railway run -- node -e "require('./dist/lib/prisma.js').prisma.\$queryRaw\`SELECT COUNT(*) FROM transactions\`.then(console.log)"
```

### Step 5: Generate Prisma Client

```bash
railway run npx prisma generate
```

---

## Backend Deployment (Railway)

### Method 1: Automated Deployment Script

```bash
# Make script executable
chmod +x scripts/deploy-production.sh

# Run deployment
./scripts/deploy-production.sh
```

The script will:
1. ✅ Check environment
2. ✅ Create database backup
3. ✅ Run tests
4. ✅ Run migrations
5. ✅ Build application
6. ✅ Deploy to Railway
7. ✅ Verify deployment
8. ✅ Run smoke tests

### Method 2: Manual Deployment

```bash
# 1. Login to Railway
railway login

# 2. Link to project
railway link

# 3. Run tests
npm test

# 4. Build
npm run build

# 5. Deploy
railway up

# 6. Verify
curl https://api.realco.com/api/v1/health/live
```

### Post-Deployment Verification

```bash
# Check version
curl https://api.realco.com/api/v1/version

# Check health
curl https://api.realco.com/api/v1/health/live

# Check database connectivity
curl https://api.realco.com/api/v1/health/ready
```

---

## Frontend Deployment (Vercel)

### Step 1: Configure Environment Variables

Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
# API Endpoint
VITE_API_URL=https://api.realco.com/api/v1

# Stripe Publishable Key (safe to expose)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Plaid
VITE_PLAID_ENV=production

# Feature Flags
VITE_ENABLE_CONSTRUCTION=true
VITE_ENABLE_ESCROW=true

# Analytics
VITE_GA_TRACKING_ID=G-...
VITE_SENTRY_DSN=...
```

### Step 2: Deploy

```bash
# Login
vercel login

# Link project
vercel link

# Deploy to production
vercel --prod

# OR use GitHub integration (automatic on push to main)
```

### Step 3: Configure Custom Domain

1. Go to Vercel Dashboard → Domains
2. Add domain: `app.realco.com`
3. Configure DNS (A record or CNAME)
4. Enable HTTPS (automatic)

---

## Health Checks & Monitoring

### Health Check Endpoints

| Endpoint | Purpose | Auth Required |
|----------|---------|---------------|
| `/api/v1/version` | API version info | No |
| `/api/v1/health/live` | Liveness probe | No |
| `/api/v1/health/ready` | Readiness probe | No |
| `/api/v1/health` | Comprehensive check | Yes (prod) |

### Liveness Probe (Is the process running?)

```bash
curl https://api.realco.com/api/v1/health/live

# Response:
# {
#   "status": "ok",
#   "uptime": 12345,
#   "timestamp": "2026-01-22T10:00:00Z"
# }
```

### Readiness Probe (Can it serve traffic?)

```bash
curl https://api.realco.com/api/v1/health/ready

# Response (200 = ready, 503 = not ready):
# {
#   "status": "ready",
#   "checks": {
#     "database": "healthy"
#   }
# }
```

### Comprehensive Health Check

```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://api.realco.com/api/v1/health

# Response:
# {
#   "status": "healthy",
#   "timestamp": "2026-01-22T10:00:00Z",
#   "uptime": 12345,
#   "checks": {
#     "database": { "status": "healthy", "responseTime": 5 },
#     "redis": { "status": "healthy", "responseTime": 2 },
#     "stripe": { "status": "healthy" },
#     "plaid": { "status": "healthy" },
#     "s3": { "status": "healthy" }
#   }
# }
```

### Set Up Monitoring

#### Uptime Robot (Free)

1. Sign up at uptimerobot.com
2. Add monitor: https://api.realco.com/api/v1/health/live
3. Check interval: 5 minutes
4. Alert via email/Slack

#### Sentry (Error Tracking)

Already configured via `SENTRY_DSN` environment variable.

View errors at: https://sentry.io/organizations/realco/projects/

#### Railway Metrics

Railway automatically provides:
- CPU usage
- Memory usage
- Network traffic
- Request rate

View in Railway Dashboard → Metrics

---

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Type check
        run: npm run typecheck
        
      - name: Run tests
        run: npm test
        
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Railway CLI
        run: npm install -g @railway/cli
        
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
          
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Configure GitHub Secrets

Go to GitHub → Settings → Secrets → Actions:

```
RAILWAY_TOKEN=...
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...
```

---

## Security Checklist

### Pre-Deployment

- [ ] All secrets are unique and randomly generated
- [ ] No secrets committed to git
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enabled (Railway/Vercel handle this)
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS protection (sanitize inputs)
- [ ] CSRF tokens implemented
- [ ] JWT expiration set (8 hours)
- [ ] Strong password requirements
- [ ] 2FA on all service accounts

### Runtime Security

- [ ] Helmet.js security headers
- [ ] Request validation (Zod schemas)
- [ ] Input sanitization
- [ ] Output encoding
- [ ] Secure session management
- [ ] Audit logging enabled
- [ ] Error messages don't leak sensitive info

### Data Protection

- [ ] Database encryption at rest (Railway default)
- [ ] TLS for all connections
- [ ] Bank account numbers encrypted (AES-256)
- [ ] PII encrypted
- [ ] Secure file uploads (S3 presigned URLs)
- [ ] Sensitive data not logged

### Compliance

- [ ] PCI DSS compliance (Stripe handles card data)
- [ ] OFAC screening enabled
- [ ] KYC/AML checks integrated
- [ ] Audit trail complete
- [ ] Data retention policies
- [ ] Privacy policy updated
- [ ] Terms of service updated

---

## Disaster Recovery

### Backup Strategy

**Database Backups:**
- Automated daily backups (Railway automatic)
- Manual backups before each deployment
- Retention: 7 days rolling + monthly archives
- Storage: Railway + S3 archive

**Code Backups:**
- Git repository (GitHub)
- Tagged releases
- Docker images (Railway)

### Restore Procedure

#### Database Restore

```bash
# List backups
railway run pg_dump --list

# Restore from backup
railway run pg_restore -d \$DATABASE_URL backup_file.dump

# Verify
railway run psql -c "SELECT COUNT(*) FROM transactions"
```

#### Application Rollback

```bash
# Railway rollback to previous deployment
railway rollback

# Or deploy specific version
git checkout v1.0.0
railway up
```

### Incident Response

1. **Detect** - Alerts via monitoring
2. **Assess** - Check health endpoints, logs
3. **Communicate** - Status page, team notification
4. **Mitigate** - Rollback or hotfix
5. **Resolve** - Fix root cause
6. **Review** - Post-mortem document

---

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
railway run psql

# Check connection pool
railway logs | grep "connection"

# Increase pool size
railway variables set DATABASE_POOL_MAX=100
```

### Deployment Fails

```bash
# Check build logs
railway logs --deployment latest

# Check for errors
railway logs | grep ERROR

# Verify environment variables
railway variables list
```

### API Not Responding

```bash
# Check health
curl https://api.realco.com/api/v1/health/live

# Check logs
railway logs --tail 100

# Restart service
railway restart
```

### High Memory Usage

```bash
# Check Railway metrics
railway status

# Scale vertically
# Railway Dashboard → Settings → Resources → Increase memory
```

### Stripe Webhook Failures

```bash
# Check webhook logs
railway logs | grep webhook

# Verify webhook secret
railway variables get STRIPE_WEBHOOK_SECRET

# Test webhook
stripe trigger payment_intent.succeeded
```

---

## Post-Deployment Checklist

### Immediate (< 1 hour)

- [ ] Health checks passing
- [ ] Smoke tests complete
- [ ] No error spikes in Sentry
- [ ] API response times normal
- [ ] Frontend loads correctly
- [ ] User can login
- [ ] Test transaction flow

### Short-term (< 24 hours)

- [ ] Monitor error rates
- [ ] Check database performance
- [ ] Verify webhook processing
- [ ] Review logs for warnings
- [ ] Test all critical flows
- [ ] User feedback positive

### Long-term (< 1 week)

- [ ] No memory leaks
- [ ] Performance stable
- [ ] No security issues
- [ ] Backup restore tested
- [ ] Documentation updated
- [ ] Team trained on new features

---

## Support

### Emergency Contacts

- **On-call Engineer:** See PagerDuty
- **DevOps Lead:** devops@realco.com
- **CTO:** cto@realco.com

### Service Status Pages

- Railway: https://railway.app/status
- Vercel: https://vercel-status.com
- Stripe: https://status.stripe.com
- Plaid: https://status.plaid.com

### Documentation

- API Docs: [backend/docs/TRANSACTION_API.md](./backend/docs/TRANSACTION_API.md)
- Environment Config: [backend/docs/ENV_TEMPLATE.md](./backend/docs/ENV_TEMPLATE.md)
- Prisma Schema: [backend/prisma/README.md](./backend/prisma/README.md)

---

## Conclusion

Following this guide ensures a safe, secure, and successful production deployment of the RealCo platform. Always test on staging first, create backups, and have a rollback plan ready.

**Questions?** Contact engineering@realco.com

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-01-22  
**Next Review:** 2026-04-22
