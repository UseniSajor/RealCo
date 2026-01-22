# Emergency Rollback Procedure
## When Things Go Wrong - Fast Recovery Guide

---

## 🚨 WHEN TO USE THIS GUIDE

Use this procedure when you need to quickly revert to the previous stable version due to:

- **CRITICAL:** System completely down
- **CRITICAL:** Data loss or corruption
- **CRITICAL:** Security breach
- **HIGH:** Major functionality broken affecting >50% of users
- **HIGH:** Payment processing completely broken
- **HIGH:** Cannot fix within 30 minutes

**DO NOT** use for minor issues that can be hotfixed quickly.

---

## ⚡ QUICK DECISION MATRIX

```
Can you fix it in <30 minutes? 
    ↓
   YES → Try hotfix first
    ↓
   NO → Is data at risk?
         ↓
        YES → ROLLBACK IMMEDIATELY
         ↓
        NO → Is service completely down?
              ↓
             YES → ROLLBACK IMMEDIATELY
              ↓
             NO → Are >50% of users affected?
                   ↓
                  YES → ROLLBACK
                   ↓
                  NO → Monitor and plan fix
```

---

## 🎯 ROLLBACK OBJECTIVES

**Goals:**
1. Restore service to stable state (within 15 minutes)
2. Minimize data loss
3. Preserve user trust
4. Document for post-mortem

**What rollback does:**
- ✅ Reverts code to previous version
- ✅ Restores stable functionality
- ✅ Gets users back online quickly

**What rollback does NOT do:**
- ❌ Fix the underlying issue (requires separate fix)
- ❌ Recover lost data (requires database restore)
- ❌ Prevent future occurrences (requires root cause fix)

---

## 📋 PRE-ROLLBACK CHECKLIST (2 minutes)

Before starting rollback:

```markdown
## Rollback Authorization

**Date/Time:** [YYYY-MM-DD HH:MM UTC]
**Initiated By:** [Your Name]
**Severity:** [CRITICAL/HIGH]

**Issue Description:**
[Brief description of the problem]

**Impact:**
- Users affected: [Number or %]
- Features broken: [List]
- Data at risk: [YES/NO]

**Decision:**
- [ ] Rollback APPROVED
- [ ] Rollback NOT NEEDED (pursuing hotfix)

**Approved By:** [Name/Role]

**Team Notified:**
- [ ] #engineering-alerts posted
- [ ] On-call engineer informed
- [ ] Tech lead informed
- [ ] Status page updated
```

**⚠️ Stop and get approval if:**
- You're not the on-call engineer
- There's any uncertainty about the decision
- Data loss is involved

---

## 🔴 PHASE 1: IMMEDIATE ACTIONS (2 minutes)

### Step 1.1: Alert Team

Post to #engineering-alerts:
```
🚨 ROLLBACK IN PROGRESS 🚨

Issue: [Brief description]
Impact: [User impact]
Decision: Rolling back to previous version
ETA: 15 minutes

Status updates will follow.

DO NOT deploy anything until rollback complete.
```

---

### Step 1.2: Update Status Page

```markdown
⚠️ Service Degradation

We are currently experiencing issues with [feature/system].
Our team is working to restore normal service.

Status: Investigating
Started: [Time]
Next update: In 15 minutes

We apologize for the inconvenience.
```

---

### Step 1.3: Enable Maintenance Mode (Optional)

**Only if system is completely unusable:**

```bash
# Backend
railway variables set MAINTENANCE_MODE=true

# This will show users a maintenance message
# instead of broken functionality
```

---

## 🔧 PHASE 2: BACKEND ROLLBACK (5 minutes)

### Step 2.1: Verify Previous Version

```bash
# Check Railway deployment history
railway status

# List recent deployments
railway logs --deployments

# Note the deployment ID of last stable version
# Example: deployment-abc123def456
```

---

### Step 2.2: Rollback Backend Code

```bash
# Option 1: Rollback via Railway CLI
railway rollback

# This will prompt you to select a deployment
# Choose the last stable deployment (before current)

# Option 2: Rollback to specific deployment
railway rollback deployment-abc123def456

# Option 3: Redeploy previous commit
cd backend
git log --oneline -10  # See recent commits
git checkout <previous-stable-commit-hash>
railway up

# Wait for deployment
railway logs --tail
```

**Watch for:**
- ✅ "Deployment successful"
- ✅ "Service is running"
- ❌ Any errors (if errors, try alternative method)

---

### Step 2.3: Verify Backend Rollback

```bash
# Test health endpoint
curl https://api.realco.com/health

# Should return 200 OK with healthy checks

# Test authentication
curl -X POST https://api.realco.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@realco.com","password":"TestPassword123!"}'

# Should return access token

# Check logs for errors
railway logs --tail

# Should see normal operation, no errors
```

**✅ Backend Rollback Complete if:**
- Health check returns 200
- No errors in logs
- API endpoints responding

---

## 🌐 PHASE 3: FRONTEND ROLLBACK (3 minutes)

### Step 3.1: Rollback Frontend Code

```bash
cd frontend

# Option 1: Use Vercel dashboard
# Go to: https://vercel.com/your-team/realco-frontend/deployments
# Find last successful deployment
# Click "..." menu → "Promote to Production"

# Option 2: Rollback via CLI
vercel rollback
# Select previous deployment from list

# Option 3: Redeploy previous commit
git log --oneline -10
git checkout <previous-stable-commit-hash>
vercel --prod

# Wait for deployment
```

---

### Step 3.2: Verify Frontend Rollback

```bash
# Test production URL
curl -I https://app.realco.com

# Should return 200 OK

# Manual browser test:
# 1. Open https://app.realco.com
# 2. Clear cache (Cmd+Shift+R or Ctrl+Shift+R)
# 3. Verify page loads
# 4. Try logging in
# 5. Test critical functionality
```

**✅ Frontend Rollback Complete if:**
- Site loads without errors
- No JavaScript errors in console
- Can login successfully
- Critical features work

---

## 🗄️ PHASE 4: DATABASE ROLLBACK (If Needed - 10 minutes)

**⚠️ CRITICAL WARNING:**
- Database rollback causes data loss
- Only do this if migration caused corruption
- Get approval from Tech Lead first
- This is the last resort

### Step 4.1: Assess Database Situation

```bash
# Check if database migration was run
railway run npx prisma migrate status

# If migration was NOT run:
# → Skip this phase, no database rollback needed

# If migration WAS run and caused issues:
# → Proceed with caution
```

---

### Step 4.2: Restore Database from Backup

**Prerequisites:**
- You have a recent backup (created during deployment)
- Backup file is accessible
- You have approval from Tech Lead

```bash
# 1. Find your backup file
ls -lh backup_prod_*.sql

# Use the backup from just before deployment
BACKUP_FILE="backup_prod_20250122_120000.sql"

# 2. Create a new backup of current state (just in case)
railway run pg_dump realco_prod > backup_before_rollback_$(date +%Y%m%d_%H%M%S).sql

# 3. Restore from backup
railway run psql realco_prod < $BACKUP_FILE

# This will take several minutes depending on database size

# 4. Verify restoration
railway run psql realco_prod -c "SELECT COUNT(*) FROM users;"
railway run psql realco_prod -c "SELECT MAX(created_at) FROM users;"

# Check that data looks correct
```

**⚠️ Data Loss:**
- Any data created between backup and restore will be lost
- Notify users of potential data loss
- Document what was lost for recovery attempts

---

### Step 4.3: Reset Migration State

```bash
# After restoring database, reset migration state
cd backend

# Mark migrations as reverted
railway run npx prisma migrate resolve --rolled-back <migration-name>

# Verify state
railway run npx prisma migrate status

# Should show migrations before the problematic one as applied
```

---

## ✅ PHASE 5: VERIFICATION (3 minutes)

### Step 5.1: Smoke Tests

**Run automated smoke tests:**
```bash
npm run test:smoke:production

# Or manual tests:
```

**Manual Smoke Test Checklist:**
```markdown
- [ ] Homepage loads: https://app.realco.com
- [ ] Can login with test account
- [ ] Dashboard loads with data
- [ ] Can view projects
- [ ] Can view transactions
- [ ] API health check passes
- [ ] No console errors
- [ ] No failed network requests
```

---

### Step 5.2: Monitor Error Rates

```bash
# Check Sentry dashboard
# Error rate should drop back to normal (<1%)

# Check Railway logs
railway logs --tail

# Should see normal operation
# No repeated errors
# No crashes

# Watch for 5-10 minutes to ensure stability
```

---

### Step 5.3: Test Critical User Flows

**Priority 1: Authentication**
- [ ] Login works
- [ ] Logout works
- [ ] Password reset works

**Priority 2: Payments**
- [ ] Can view payment methods
- [ ] Can add bank account (test mode)
- [ ] Can initiate payment (test mode)

**Priority 3: Core Features**
- [ ] Can view investments
- [ ] Can view projects
- [ ] Can view transactions

---

## 📢 PHASE 6: COMMUNICATION (5 minutes)

### Step 6.1: Update Team

Post to #engineering-alerts:
```
✅ ROLLBACK COMPLETE

Status: Service restored to previous stable version
Rollback duration: [X] minutes
Current status: Monitoring

Impact:
- Backend: Rolled back to version [X]
- Frontend: Rolled back to deployment [X]
- Database: [Restored from backup / No changes]

Verification:
✅ Health checks passing
✅ Error rate back to normal
✅ Critical features working

Next steps:
1. Continue monitoring for 2 hours
2. Root cause analysis scheduled for [Time]
3. Fix planned for [Timeline]

Questions? Ask in thread.
```

---

### Step 6.2: Update Status Page

```markdown
✅ Service Restored

The issues with [feature/system] have been resolved.
Service has been restored to full functionality.

We apologize for any inconvenience.

Resolved: [Time]
Duration: [X] minutes

Post-mortem will be shared within 24 hours.
```

---

### Step 6.3: Notify Affected Users (If Applicable)

**If there was significant downtime or data loss:**

```markdown
Subject: Service Restored - Brief Outage

Dear RealCo User,

We experienced a brief service disruption today from [Start Time] to [End Time] ([Duration] minutes).

What happened:
[Brief, non-technical explanation]

Impact:
- [What users might have experienced]
- [Any data loss or required actions]

Status:
✅ Service fully restored
✅ All systems operational
✅ Monitoring closely

We sincerely apologize for any inconvenience this may have caused.

If you have any questions or concerns, please contact support@realco.com

Thank you for your patience,
The RealCo Team
```

---

### Step 6.4: Disable Maintenance Mode

```bash
# If maintenance mode was enabled
railway variables set MAINTENANCE_MODE=false

# Verify users can access system
curl https://api.realco.com/health
```

---

## 📊 PHASE 7: POST-ROLLBACK MONITORING (2 hours)

### Monitor These Metrics Closely:

```markdown
## Post-Rollback Monitoring

**Every 15 minutes for first 2 hours:**

### System Health
- [ ] Health check: [Status]
- [ ] Error rate: [X]% (should be <1%)
- [ ] Response time: [X]ms (should be <500ms)
- [ ] Database connections: [X]

### User Activity
- [ ] Active users: [X]
- [ ] New logins: [X]
- [ ] Failed logins: [X]
- [ ] Support tickets: [X]

### Red Flags
- [ ] Error rate spike
- [ ] Performance degradation
- [ ] User complaints
- [ ] Data inconsistencies

### Notes
[Any observations]
```

---

## 📝 PHASE 8: POST-MORTEM (Within 24 hours)

### Schedule Post-Mortem Meeting

**Attendees:**
- Engineering team
- DevOps
- Product (if user-facing)
- Anyone involved in incident

**Agenda:**
1. Timeline review (15 min)
2. Root cause analysis (20 min)
3. What went well (10 min)
4. What could improve (15 min)
5. Action items (10 min)

---

### Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

**Date:** [YYYY-MM-DD]
**Severity:** [CRITICAL/HIGH]
**Duration:** [X] minutes
**Impact:** [Description]

## Timeline

| Time | Event |
|------|-------|
| HH:MM | Deployment started |
| HH:MM | Issue first detected |
| HH:MM | Team alerted |
| HH:MM | Rollback decision made |
| HH:MM | Rollback started |
| HH:MM | Service restored |
| HH:MM | Monitoring normal |

## What Happened

[Detailed description of the incident]

## Root Cause

**Immediate Cause:**
[What directly caused the failure]

**Contributing Factors:**
- [Factor 1]
- [Factor 2]
- [Factor 3]

## Impact

**Users Affected:** [Number or percentage]
**Functionality Impacted:** [List]
**Data Loss:** [YES/NO - Details]
**Financial Impact:** [If applicable]

## What Went Well

- [Thing 1]
- [Thing 2]
- [Thing 3]

## What Could Be Improved

- [Improvement 1]
- [Improvement 2]
- [Improvement 3]

## Action Items

| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
| Fix underlying bug | [Name] | [Date] | P0 |
| Add test coverage | [Name] | [Date] | P0 |
| Improve monitoring | [Name] | [Date] | P1 |
| Update deployment process | [Name] | [Date] | P1 |
| Training session | [Name] | [Date] | P2 |

## Prevention

**Immediate:**
- [Action to prevent recurrence]

**Short-term (1-2 weeks):**
- [Improvements to process]

**Long-term (1-3 months):**
- [Systemic improvements]

## Lessons Learned

1. [Lesson 1]
2. [Lesson 2]
3. [Lesson 3]
```

---

## 🔄 PHASE 9: PLANNING FIX (After Rollback)

### Now that service is stable:

**1. Understand what went wrong**
```bash
# Review logs from failed deployment
railway logs --since 1h > failed_deployment_logs.txt

# Look for:
# - Error messages
# - Stack traces
# - Failed database queries
# - Timeout errors
```

**2. Create fix branch**
```bash
git checkout -b hotfix/issue-description
```

**3. Fix the issue**
- Write failing test first (if applicable)
- Implement fix
- Verify fix locally
- Run all tests

**4. Test thoroughly**
```bash
# Run full test suite
npm run test
npm run test:integration

# Test in staging
# Deploy to staging
# Verify fix works
# Run smoke tests
# Let it bake for a few hours
```

**5. Deploy fix (carefully)**
```bash
# Follow deployment process again
# But this time:
# - Deploy during low traffic period
# - Have team on standby
# - Monitor extra carefully
# - Have rollback plan ready (again)
```

---

## 📚 ROLLBACK SCENARIOS

### Scenario 1: Backend Deploy Broke API

**Symptoms:**
- 500 errors on all endpoints
- Health check failing
- Cannot connect to database

**Rollback Steps:**
1. Rollback backend (Phase 2)
2. Verify API working
3. No database rollback needed
4. Monitor for 1 hour

---

### Scenario 2: Database Migration Corrupted Data

**Symptoms:**
- Data inconsistencies
- Foreign key violations
- Missing records

**Rollback Steps:**
1. Rollback backend (Phase 2)
2. Restore database from backup (Phase 4)
3. Reset migration state
4. Verify data integrity
5. Monitor for 2 hours
6. Contact users about data loss

---

### Scenario 3: Frontend Deploy Broke UI

**Symptoms:**
- White screen of death
- JavaScript errors
- Cannot login

**Rollback Steps:**
1. Rollback frontend only (Phase 3)
2. Clear CDN cache if needed
3. Verify site working
4. No backend/database changes needed

---

### Scenario 4: Payment Processing Broken

**Symptoms:**
- All payments failing
- Stripe errors
- Webhook errors

**Rollback Steps:**
1. Rollback backend (Phase 2)
2. Verify Stripe webhook working
3. Test payment flow
4. Check for stuck transactions
5. May need to manually process payments

---

## ⚠️ COMMON PITFALLS

**DON'T:**
- ❌ Panic and make hasty decisions
- ❌ Try to fix forward if issue is severe
- ❌ Skip team communication
- ❌ Forget to update status page
- ❌ Rollback database without backup
- ❌ Deploy new changes during rollback

**DO:**
- ✅ Stay calm and follow procedure
- ✅ Communicate clearly and often
- ✅ Document everything
- ✅ Verify each step
- ✅ Monitor after rollback
- ✅ Learn from the incident

---

## 📞 EMERGENCY CONTACTS

```
On-Call Engineer: [Name] [Phone]
Tech Lead: [Name] [Phone]
DevOps Lead: [Name] [Phone]
CTO: [Name] [Phone]

Slack: #engineering-alerts
PagerDuty: [URL]
Status Page: [URL]
```

---

## ✅ ROLLBACK SUCCESS CRITERIA

**You can consider rollback successful when:**

- [ ] Service is operational
- [ ] Error rate back to normal (<1%)
- [ ] Response times normal (<500ms)
- [ ] Critical features working
- [ ] No data corruption
- [ ] Users can access system
- [ ] Team is monitoring
- [ ] Post-mortem scheduled

---

## 🎯 REMEMBER

**The goal of rollback is:**
- Get service working FAST
- Preserve user trust
- Minimize data loss

**Rollback is not defeat:**
- It's responsible engineering
- It protects users
- It gives you time to fix properly

**After rollback:**
- Take a breath
- Review what happened
- Plan proper fix
- Deploy fix carefully
- Learn and improve

---

**You've got this!** 💪

Rollbacks are stressful, but you have a plan. Follow the steps, communicate clearly, and your system will be back up quickly.
