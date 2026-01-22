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

# Confirm rollback decision with tech lead
```

#### 2. Rollback Frontend (Vercel) (2 minutes)
```bash
vercel rollback [PREVIOUS_DEPLOYMENT_URL]
```

#### 3. Rollback Backend (Railway) (5 minutes)
```bash
railway rollback [PREVIOUS_DEPLOYMENT_ID]
```

#### 4. Rollback Database (if needed) (10 minutes)
```bash
# ⚠️ ONLY if database changes caused issues
railway run psql < backup_[TIMESTAMP].sql
```

#### 5. Verify Rollback (5 minutes)
- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Authentication works

---

## 📊 POST-DEPLOYMENT MONITORING

### First 30 Minutes (Critical Monitoring)

```bash
# Monitor error logs
railway logs --tail 100 --follow | grep -i "error"

# Check API health
watch -n 30 "curl https://your-backend.railway.app/health"
```

**Acceptance Criteria:**
- ✅ Error rate <0.1%
- ✅ API response time <200ms (p95)
- ✅ No 5xx errors

---

## ✅ DEPLOYMENT SIGN-OFF

Before proceeding to production, obtain sign-off from:

- [ ] **Tech Lead:** ________________
- [ ] **QA Lead:** ________________
- [ ] **DevOps:** ________________
- [ ] **Product Manager:** ________________

---

## 🎯 DEPLOYMENT WINDOW SCHEDULE

**Days:** Tuesday, Wednesday, Thursday  
**Time:** 9:00 AM - 2:00 PM  
**Duration:** Max 2 hours deployment + 2 hours monitoring

---

*Last Updated: January 22, 2026*  
*Review Before Each Production Deployment*
