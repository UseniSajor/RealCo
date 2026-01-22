# Pre-Deployment Validation Checklist
## RealCo-Kealee Integration

**Purpose:** Ensure all systems are ready before deploying to production  
**Target Environment:** Production (Railway + Vercel)  
**Last Updated:** January 22, 2026

---

## 🎯 DEPLOYMENT READINESS CRITERIA

### ✅ CRITICAL REQUIREMENTS (ALL MUST PASS)

#### 1. Code Quality & Testing
- [ ] **All unit tests passing** (`npm test` in backend)
- [ ] **Test coverage >80%** (verified via `npm test -- --coverage`)
- [ ] **No TypeScript errors** (`npm run typecheck` in backend and frontend)
- [ ] **No linter errors** (`npm run lint` in both projects)
- [ ] **Build succeeds** (`npm run build` in both projects)
- [ ] **No console errors in development** (check browser console)

#### 2. Staging Environment Validation
- [ ] **✅ No critical bugs in staging**
  - [ ] All P0/P1 bugs resolved
  - [ ] P2 bugs documented and triaged
  - [ ] No blockers preventing production use
  - [ ] Error logs reviewed (no unexpected errors)
  - [ ] Performance metrics acceptable (API <200ms p95)

#### 3. Database & Data Safety
- [ ] **✅ Database backup created**
  - [ ] Full PostgreSQL backup completed
  - [ ] Backup tested (restore verified)
  - [ ] Backup stored securely (encrypted, off-site)
  - [ ] Backup timestamp recorded
  - [ ] Recovery time estimated (<15 minutes)

#### 4. Team Readiness
- [ ] **✅ Team available**
  - [ ] Tech lead available during deployment
  - [ ] Backend developer on standby
  - [ ] Frontend developer on standby
  - [ ] DevOps/Infrastructure person available
  - [ ] All team members briefed on deployment plan

#### 5. Deployment Window
- [ ] **✅ Tuesday-Thursday, 9am-2pm**
  - [ ] Deployment scheduled within approved window
  - [ ] Sufficient time for monitoring (2-4 hours post-deploy)
  - [ ] No holidays or blackout dates
  - [ ] Customer support notified
  - [ ] Low-traffic period confirmed

#### 6. Rollback Preparedness
- [ ] **✅ Rollback plan ready**
  - [ ] Previous version tagged in git
  - [ ] Rollback steps documented (see below)
  - [ ] Database rollback scripts prepared
  - [ ] Rollback tested in staging
  - [ ] Team trained on rollback procedure

---

## 📋 DETAILED VALIDATION CHECKLIST

### A. Code & Build Validation

#### Backend (Railway)
```bash
cd backend

# 1. Run all tests
npm test
# Expected: All tests pass, >80% coverage

# 2. Type checking
npm run typecheck
# Expected: No TypeScript errors

# 3. Build for production
npm run build
# Expected: dist/ directory created without errors

# 4. Check for TODO/FIXME in critical code
grep -r "TODO\|FIXME" src/services/ src/api/
# Expected: No critical TODOs, only documented future enhancements
```

#### Frontend (Vercel)
```bash
cd frontend

# 1. Run linter
npm run lint
# Expected: No errors (warnings acceptable if documented)

# 2. Type checking
npm run typecheck
# Expected: No TypeScript errors

# 3. Build for production
npm run build
# Expected: dist/ directory created, bundle size <500KB

# 4. Test build locally
npm run preview
# Expected: App loads, no console errors
```

### B. Database Validation

#### Pre-Migration Checks
- [ ] Current schema documented
- [ ] Migration scripts reviewed and approved
- [ ] Migrations tested on staging database
- [ ] No pending migrations on production
- [ ] Database disk space sufficient (>30% free)
- [ ] Database connections within limits (<80% of max)

#### Backup Verification
```bash
# 1. Create production backup
railway run pg_dump --verbose > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Verify backup file
ls -lh backup_*.sql
# Expected: File size reasonable (>100KB), not empty

# 3. Test restore on staging
railway run psql < backup_*.sql
# Expected: Restore completes without errors

# 4. Verify restored data
railway run psql -c "SELECT COUNT(*) FROM projects;"
# Expected: Count matches production
```

### C. Environment Configuration

#### Backend Environment Variables (Railway)
- [ ] `DATABASE_URL` - Pointing to production database
- [ ] `JWT_SECRET` - Secure random string (32+ chars)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `PORT` - Set (Railway auto-assigns)
- [ ] `CORS_ORIGIN` - Matches frontend URL (no trailing slash)
- [ ] `STRIPE_SECRET_KEY` - Production key (if applicable)
- [ ] `STRIPE_WEBHOOK_SECRET` - Production webhook secret
- [ ] `PLAID_CLIENT_ID` - Production credential
- [ ] `PLAID_SECRET` - Production secret
- [ ] `AWS_ACCESS_KEY_ID` - For S3 (if using)
- [ ] `AWS_SECRET_ACCESS_KEY` - For S3
- [ ] `AWS_REGION` - S3 region
- [ ] `AWS_S3_BUCKET` - Production bucket name

#### Frontend Environment Variables (Vercel)
- [ ] `VITE_API_URL` - Production backend URL (no trailing slash)
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` - Production key (if applicable)

#### Verify Environment Variables
```bash
# Backend (Railway)
cd backend
railway variables
# Check all required variables are set

# Frontend (Vercel)
cd frontend
vercel env ls
# Check all required variables are set
```

### D. Security Validation

- [ ] **Authentication**
  - [ ] JWT secret is secure (not default value)
  - [ ] Token expiration configured (e.g., 1 hour)
  - [ ] Refresh token logic implemented

- [ ] **Authorization**
  - [ ] Organization scoping enforced on all routes
  - [ ] Admin-only routes protected
  - [ ] User roles validated

- [ ] **Data Encryption**
  - [ ] Bank account numbers encrypted
  - [ ] Sensitive PII encrypted
  - [ ] Encryption key stored securely (not in code)

- [ ] **API Security**
  - [ ] Rate limiting configured
  - [ ] CORS configured (whitelist only)
  - [ ] No sensitive data in logs
  - [ ] Error messages don't leak internal details

- [ ] **SSL/TLS**
  - [ ] HTTPS enforced (no HTTP)
  - [ ] SSL certificate valid
  - [ ] TLS 1.2+ required

### E. Integration Validation

#### Stripe (Payment Processing)
- [ ] Production Stripe account activated
- [ ] API keys updated to production keys
- [ ] Webhook endpoint registered (backend URL)
- [ ] Webhook signature verification enabled
- [ ] Test payment in staging (with test card)

#### Plaid (Bank Account Verification)
- [ ] Production Plaid account activated
- [ ] API credentials updated to production
- [ ] Webhook endpoint registered
- [ ] Test account verification in staging

#### AWS S3 (File Storage)
- [ ] Production S3 bucket created
- [ ] Bucket permissions configured (private)
- [ ] CORS configured for frontend domain
- [ ] Lifecycle policies set (auto-delete old files)
- [ ] Test file upload/download in staging

### F. Monitoring & Observability

- [ ] **Error Tracking**
  - [ ] Sentry (or similar) configured
  - [ ] Source maps uploaded
  - [ ] Alerts configured for critical errors
  - [ ] Team has access to dashboard

- [ ] **Application Logging**
  - [ ] Structured logging enabled (JSON)
  - [ ] Log aggregation configured (Railway/Vercel logs)
  - [ ] Log retention policy set
  - [ ] Sensitive data redacted from logs

- [ ] **Performance Monitoring**
  - [ ] API response time tracking
  - [ ] Database query performance monitoring
  - [ ] Frontend page load tracking
  - [ ] Alerts for degraded performance

- [ ] **Uptime Monitoring**
  - [ ] Health check endpoint configured (`/health`)
  - [ ] Uptime monitoring service configured (e.g., UptimeRobot)
  - [ ] Alerts configured for downtime
  - [ ] Team receives notifications

### G. Performance Validation

#### Backend Performance
```bash
# Test API response times
time curl https://your-backend.railway.app/api/v1/health
# Expected: <200ms

# Check database connection pool
railway logs --tail 50 | grep "connection"
# Expected: No connection pool exhaustion
```

#### Frontend Performance
- [ ] Lighthouse score >90 (Performance)
- [ ] Time to Interactive <3 seconds
- [ ] Bundle size <500KB
- [ ] Images optimized (WebP, lazy loading)
- [ ] Code splitting implemented

#### Database Performance
- [ ] Query execution times <50ms (p95)
- [ ] No N+1 query issues
- [ ] Indexes optimized
- [ ] Connection pool sized appropriately

### H. Compliance & Legal

- [ ] **PCI Compliance** (if handling payments)
  - [ ] No credit card data stored
  - [ ] PCI-DSS requirements met
  - [ ] Stripe handles card processing

- [ ] **SEC Compliance** (for investment platform)
  - [ ] Compliance checks implemented
  - [ ] Audit trail enabled
  - [ ] Transaction reporting configured

- [ ] **Data Privacy**
  - [ ] GDPR compliance (if applicable)
  - [ ] Privacy policy updated
  - [ ] Cookie consent implemented
  - [ ] Data retention policies set

- [ ] **Legal Review**
  - [ ] Terms of Service reviewed
  - [ ] Privacy Policy reviewed
  - [ ] User agreements updated

### I. User Communication

- [ ] **Pre-Deployment**
  - [ ] Maintenance window announced (if downtime expected)
  - [ ] Users notified 48 hours in advance
  - [ ] Support team briefed

- [ ] **Post-Deployment**
  - [ ] Release notes prepared
  - [ ] User-facing changes documented
  - [ ] Support team trained on new features
  - [ ] FAQ updated

---

## 🔄 ROLLBACK PLAN

### When to Rollback

Trigger rollback if ANY of these occur within 2 hours of deployment:
- ❌ Critical bug affecting >10% of users
- ❌ Data loss or corruption detected
- ❌ Payment processing failures
- ❌ Authentication/login broken
- ❌ API error rate >5%
- ❌ Database connection failures
- ❌ Security vulnerability discovered

### Rollback Steps (Execute in Order)

#### 1. Assess Impact (5 minutes)
```bash
# Check error rates
railway logs --tail 100 | grep -i error

# Check Sentry for error spike
# Review monitoring dashboards

# Confirm rollback decision with tech lead
```

#### 2. Rollback Frontend (Vercel) (2 minutes)
```bash
cd frontend

# List recent deployments
vercel ls

# Rollback to previous version
vercel rollback [PREVIOUS_DEPLOYMENT_URL]

# Verify rollback
curl https://your-frontend.vercel.app
```

#### 3. Rollback Backend (Railway) (5 minutes)
```bash
cd backend

# View deployment history
railway logs --deployment [DEPLOYMENT_ID]

# Rollback to previous deployment
railway rollback [PREVIOUS_DEPLOYMENT_ID]

# Verify rollback
curl https://your-backend.railway.app/health
```

#### 4. Rollback Database (if needed) (10 minutes)
```bash
# ⚠️ ONLY if database changes caused issues

# 1. Stop application (prevent new writes)
railway down

# 2. Restore from backup
railway run psql < backup_[TIMESTAMP].sql

# 3. Verify data integrity
railway run psql -c "SELECT COUNT(*) FROM projects;"

# 4. Restart application
railway up
```

#### 5. Verify Rollback (5 minutes)
- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Database queries work
- [ ] Authentication works
- [ ] Critical user flows work (login, view data)

#### 6. Communicate (5 minutes)
- [ ] Notify team of rollback completion
- [ ] Update status page (if applicable)
- [ ] Inform support team
- [ ] Schedule post-mortem meeting

### Rollback Testing

- [ ] Rollback procedure tested in staging
- [ ] Team trained on rollback steps
- [ ] Rollback can be executed in <15 minutes
- [ ] Documentation is clear and accessible

---

## 📊 POST-DEPLOYMENT MONITORING

### First 30 Minutes (Critical Monitoring)

Monitor these metrics closely:

```bash
# Error logs
railway logs --tail 100 --follow

# Watch for errors
railway logs --tail 100 --follow | grep -i "error\|fail\|exception"

# Check API health
watch -n 30 "curl -s https://your-backend.railway.app/health | jq"

# Monitor response times
watch -n 30 "time curl -s https://your-backend.railway.app/api/v1/ready"
```

**Acceptance Criteria:**
- ✅ Error rate <0.1%
- ✅ API response time <200ms (p95)
- ✅ Database queries <50ms (p95)
- ✅ No 5xx errors
- ✅ User login success rate >99%

### First 2 Hours (Active Monitoring)

- [ ] Monitor error tracking (Sentry)
- [ ] Check application logs every 15 minutes
- [ ] Verify key user flows work
- [ ] Monitor database performance
- [ ] Check external integrations (Stripe, Plaid, S3)
- [ ] Review user feedback/support tickets

### First 24 Hours (Passive Monitoring)

- [ ] Review error logs twice (morning, evening)
- [ ] Check performance metrics
- [ ] Monitor user activity
- [ ] Verify scheduled jobs run correctly
- [ ] Check backup/maintenance tasks

### First Week (Standard Monitoring)

- [ ] Daily error log review
- [ ] Weekly performance report
- [ ] User feedback analysis
- [ ] Identify any issues for next deployment

---

## ✅ DEPLOYMENT SIGN-OFF

Before proceeding to production, obtain sign-off from:

- [ ] **Tech Lead:** Code quality, architecture reviewed
  - Name: ________________
  - Date: ________________
  - Signature: ________________

- [ ] **QA Lead:** Testing complete, bugs triaged
  - Name: ________________
  - Date: ________________
  - Signature: ________________

- [ ] **DevOps:** Infrastructure ready, monitoring configured
  - Name: ________________
  - Date: ________________
  - Signature: ________________

- [ ] **Product Manager:** Features approved, ready for users
  - Name: ________________
  - Date: ________________
  - Signature: ________________

---

## 🎯 DEPLOYMENT WINDOW SCHEDULE

### Approved Deployment Windows

**Days:** Tuesday, Wednesday, Thursday  
**Time:** 9:00 AM - 2:00 PM (Local Time)  
**Duration:** Max 2 hours for deployment + 2 hours monitoring

**Rationale:**
- Mid-week reduces weekend/Monday risk
- Morning deployment allows full day for monitoring
- Avoids Friday (weekend coverage issues)
- Avoids Monday (high user activity)
- 2 PM cutoff ensures team available for issues

### Blackout Dates (No Deployments)

- ❌ Week before major holidays
- ❌ During company all-hands/events
- ❌ When key team members unavailable
- ❌ During high-traffic periods (month-end for financial)
- ❌ Friday, Saturday, Sunday, Monday

---

## 📞 EMERGENCY CONTACTS

### Deployment Day Contacts

**Tech Lead:**
- Name: ________________
- Phone: ________________
- Email: ________________

**Backend Developer:**
- Name: ________________
- Phone: ________________
- Email: ________________

**Frontend Developer:**
- Name: ________________
- Phone: ________________
- Email: ________________

**DevOps/Infrastructure:**
- Name: ________________
- Phone: ________________
- Email: ________________

**Product Manager:**
- Name: ________________
- Phone: ________________
- Email: ________________

### Escalation Path

1. **Level 1:** Developer on call (initial response <15 min)
2. **Level 2:** Tech Lead (if issue persists >30 min)
3. **Level 3:** CTO/VP Engineering (critical issues only)

---

## 📋 FINAL CHECKLIST (DAY OF DEPLOYMENT)

### T-24 Hours (Day Before)
- [ ] All team members confirmed available
- [ ] Database backup completed and verified
- [ ] Staging environment matches production
- [ ] No critical bugs in staging
- [ ] All stakeholders notified
- [ ] Support team briefed

### T-1 Hour (Morning of Deployment)
- [ ] Team standup completed
- [ ] Deployment plan reviewed
- [ ] Rollback plan reviewed
- [ ] Monitoring dashboards open
- [ ] Communication channels ready (Slack, etc.)

### T-0 (Deployment Start)
- [ ] Create git tag for current production version
- [ ] Start deployment (backend first, then frontend)
- [ ] Monitor logs actively
- [ ] Run smoke tests

### T+15 Minutes (Immediate Post-Deploy)
- [ ] Health check passes
- [ ] API responding correctly
- [ ] Frontend loads
- [ ] Authentication works
- [ ] Database queries work

### T+2 Hours (Extended Monitoring)
- [ ] No critical errors logged
- [ ] Performance metrics normal
- [ ] User activity normal
- [ ] External integrations working
- [ ] Team can stand down (passive monitoring begins)

---

## ✅ VALIDATION COMPLETE

Once all items checked:

**Deployment Status:** ⬜ READY | ⬜ NOT READY | ⬜ NEEDS REVIEW

**Deployment Approved By:**
- Name: ________________
- Role: ________________
- Date: ________________

**Deployment Scheduled For:**
- Date: ________________
- Time: ________________
- Window: Tuesday/Wednesday/Thursday, 9am-2pm

---

*Last Updated: January 22, 2026*  
*Version: 1.0*  
*Review Frequency: Before each production deployment*
