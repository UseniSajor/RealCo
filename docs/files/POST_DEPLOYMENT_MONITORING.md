# Post-Deployment Monitoring Guide
## 24-Hour Watch & Ongoing Operations

---

## 🎯 OVERVIEW

After deploying to production, continuous monitoring is critical to:
- Detect issues early
- Ensure system stability
- Maintain user trust
- Meet SLAs

This guide covers monitoring for:
- **First 2 hours:** Critical watch period
- **First 24 hours:** Enhanced monitoring
- **Ongoing:** Normal operations

---

## ⏰ FIRST 2 HOURS - CRITICAL WATCH

### Monitoring Checklist (Every 15 minutes)

```bash
#!/bin/bash
# monitor-critical.sh

echo "=== Critical Monitoring Check ==="
echo "Time: $(date)"
echo ""

# 1. Health Check
echo "1. Health Check:"
HEALTH=$(curl -s https://api.realco.com/health)
echo $HEALTH | jq .

# Extract status
DB_STATUS=$(echo $HEALTH | jq -r '.checks.database')
if [ "$DB_STATUS" != "true" ]; then
    echo "⚠️  DATABASE ISSUE DETECTED!"
    # Send alert
fi

# 2. Error Rate
echo ""
echo "2. Error Rate (from Sentry):"
# Check Sentry API or dashboard
# Target: <1%

# 3. Response Time
echo ""
echo "3. Response Time:"
for i in {1..5}; do
    TIME=$(curl -w "%{time_total}" -o /dev/null -s https://api.realco.com/health)
    echo "  Request $i: ${TIME}s"
done

# 4. Active Connections
echo ""
echo "4. Database Connections:"
railway run psql -c "SELECT count(*) as active_connections FROM pg_stat_activity WHERE state = 'active';"

# 5. Recent Errors
echo ""
echo "5. Recent Errors (last 15 min):"
railway logs --since 15m | grep -i "error" | tail -n 10

echo ""
echo "=== Check Complete ==="
```

Run this script every 15 minutes:
```bash
chmod +x monitor-critical.sh

# Option 1: Run manually
./monitor-critical.sh

# Option 2: Set up cron (don't forget to remove after 2 hours)
crontab -e
# Add: */15 * * * * /path/to/monitor-critical.sh >> /tmp/monitoring.log 2>&1
```

---

### Key Metrics to Watch

**🚨 Critical Thresholds (Alert immediately):**

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error Rate | >5% | Investigate immediately |
| Response Time (p95) | >2 seconds | Check performance |
| Database Connections | >90% of max | Scale database |
| CPU Usage | >90% | Scale instances |
| Memory Usage | >90% | Check for memory leaks |
| Failed Login Attempts | >50 in 5 min | Check for attack |

**⚠️ Warning Thresholds (Investigate):**

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error Rate | >1% | Monitor closely |
| Response Time (p95) | >500ms | Optimize if sustained |
| Database Connections | >70% of max | Plan scaling |
| CPU Usage | >70% | Monitor trends |
| Memory Usage | >70% | Check for growth |

---

### Real-Time Monitoring Dashboard

**Set up a dashboard with these panels:**

```markdown
## System Health
- API Status: ✅ Healthy
- Database: ✅ Connected
- Redis: ✅ Connected
- Stripe: ✅ Connected

## Performance (Last 5 min)
- Requests/min: 1,234
- Avg Response Time: 123ms
- p95 Response Time: 456ms
- Error Rate: 0.2%

## Infrastructure
- CPU: 45% (of 100%)
- Memory: 60% (of 8GB)
- DB Connections: 12 (of 100)
- Disk: 45% (of 100GB)

## Business Metrics
- Active Users: 145
- New Investments (last hour): 5
- Payments Processing: 3
- Failed Payments: 0

## Recent Errors (Last hour)
- None detected ✅
```

**Tools to use:**
- **Sentry:** Error tracking
- **Railway Dashboard:** Infrastructure metrics
- **Vercel Dashboard:** Frontend analytics
- **Custom Dashboard:** Business metrics

---

### Incident Response (First 2 Hours)

**If you detect an issue:**

1. **Assess Severity (2 minutes)**
   ```
   CRITICAL: System down, data loss, security breach
   HIGH: Major feature broken, many users affected
   MEDIUM: Minor feature issue, some users affected
   LOW: Cosmetic issue, workaround available
   ```

2. **Alert Team (Immediate)**
   ```
   #engineering-alerts:
   🚨 [SEVERITY] Production Issue Detected
   
   Issue: [Brief description]
   Impact: [How many users? What's broken?]
   Started: [Time]
   Status: Investigating
   
   Thread: [Link to incident thread]
   ```

3. **Create Incident Channel**
   ```bash
   # Slack
   /create #incident-YYYYMMDD-HHMM
   
   # Invite key people
   /invite @tech-lead @devops @on-call
   ```

4. **Triage (5-10 minutes)**
   - What's the root cause?
   - Can it be fixed quickly?
   - Should we rollback?

5. **Execute Fix**
   - Hotfix: Deploy fix immediately
   - Rollback: See ROLLBACK_PROCEDURE.md
   - Workaround: Implement temporary solution

6. **Verify Fix**
   - Run smoke tests
   - Check metrics
   - Confirm with users

7. **Post-Mortem (After resolution)**
   - Document timeline
   - Root cause analysis
   - Prevention steps
   - Update runbooks

---

## 📊 FIRST 24 HOURS - ENHANCED MONITORING

### Hourly Monitoring Checklist

**Every hour, check:**

```markdown
## Hour [X] Check - [Time]

### System Status
- [ ] Health check: ✅ All systems green
- [ ] Error rate: [X]% (target <1%)
- [ ] Response time p95: [X]ms (target <500ms)
- [ ] Database health: ✅ Connected

### Performance Trends
- [ ] Response time trend: ⬆️ Increasing / ⬇️ Decreasing / → Stable
- [ ] Error rate trend: ⬆️ Increasing / ⬇️ Decreasing / → Stable
- [ ] Traffic trend: ⬆️ Increasing / ⬇️ Decreasing / → Stable

### User Activity
- [ ] Active users: [X] (expected range: [Y-Z])
- [ ] New signups: [X]
- [ ] New investments: [X]
- [ ] Payments processing: [X]

### Issues Detected
- [ ] None ✅
- [ ] Minor: [Description]
- [ ] Major: [Description]

### Actions Taken
- [ ] None needed
- [ ] [Action 1]
- [ ] [Action 2]

### Notes
[Any observations or concerns]
```

---

### Automated Monitoring Scripts

**Set up automated checks:**

```bash
#!/bin/bash
# hourly-monitoring.sh

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
LOG_FILE="/tmp/realco-monitoring-$(date +%Y%m%d).log"

echo "=== Hourly Monitoring Report ===" >> $LOG_FILE
echo "Time: $TIMESTAMP" >> $LOG_FILE
echo "" >> $LOG_FILE

# 1. Performance Check
echo "Performance Metrics:" >> $LOG_FILE
echo "===================" >> $LOG_FILE

# Average response time (last hour)
echo "Sampling API response times..." >> $LOG_FILE
TOTAL_TIME=0
for i in {1..20}; do
    TIME=$(curl -w "%{time_total}" -o /dev/null -s https://api.realco.com/health)
    TOTAL_TIME=$(echo "$TOTAL_TIME + $TIME" | bc)
done
AVG_TIME=$(echo "scale=3; $TOTAL_TIME / 20" | bc)
echo "Average response time: ${AVG_TIME}s" >> $LOG_FILE

# 2. Database Stats
echo "" >> $LOG_FILE
echo "Database Metrics:" >> $LOG_FILE
echo "================" >> $LOG_FILE
railway run psql -t -c "
SELECT 
    'Active Connections: ' || count(*) 
FROM pg_stat_activity 
WHERE state = 'active';
" >> $LOG_FILE

railway run psql -t -c "
SELECT 
    'Database Size: ' || pg_size_pretty(pg_database_size('realco_prod'));
" >> $LOG_FILE

# 3. Application Metrics
echo "" >> $LOG_FILE
echo "Application Metrics:" >> $LOG_FILE
echo "===================" >> $LOG_FILE

# Query your database for business metrics
railway run psql -t -c "
SELECT 'Active Users (last hour): ' || count(DISTINCT user_id)
FROM audit_events
WHERE created_at > NOW() - INTERVAL '1 hour';
" >> $LOG_FILE

railway run psql -t -c "
SELECT 'New Investments (last hour): ' || count(*)
FROM investments
WHERE created_at > NOW() - INTERVAL '1 hour';
" >> $LOG_FILE

railway run psql -t -c "
SELECT 'Failed Transactions (last hour): ' || count(*)
FROM transactions
WHERE status = 'FAILED' 
AND created_at > NOW() - INTERVAL '1 hour';
" >> $LOG_FILE

echo "" >> $LOG_FILE
echo "================================" >> $LOG_FILE
echo "" >> $LOG_FILE

# Check for anomalies
if (( $(echo "$AVG_TIME > 0.5" | bc -l) )); then
    echo "⚠️  WARNING: High response time detected!" >> $LOG_FILE
    # Send alert
fi

# Display log
tail -n 50 $LOG_FILE
```

Schedule hourly:
```bash
crontab -e
# Add: 0 * * * * /path/to/hourly-monitoring.sh
```

---

### User Feedback Monitoring

**Monitor these channels:**

1. **Support Tickets**
   - Check Zendesk/Intercom every 2 hours
   - Look for patterns in issues
   - Priority: Payment issues, login problems

2. **User Behavior**
   - Dropped sessions (users leaving mid-flow)
   - Failed actions (errors users encounter)
   - Support requests spike

3. **Social Media**
   - Twitter mentions
   - LinkedIn posts
   - Reddit discussions

4. **Internal Feedback**
   - Sales team reports
   - Account managers feedback
   - Executive concerns

---

## 🔄 ONGOING OPERATIONS (After 24 Hours)

### Daily Monitoring Routine

**Every Morning (First thing):**

```markdown
## Daily Health Check - [Date]

### 1. System Status (5 min)
- [ ] Check Sentry dashboard: Any new errors?
- [ ] Review Railway metrics: Any anomalies?
- [ ] Check Vercel analytics: Traffic normal?
- [ ] Review uptime monitor: Any downtime overnight?

### 2. Performance Review (10 min)
- [ ] Response times: Within targets?
- [ ] Error rates: Below threshold?
- [ ] Database performance: No slow queries?
- [ ] Resource usage: Trending well?

### 3. Business Metrics (5 min)
- [ ] New users: [X] (vs yesterday: [Y])
- [ ] New investments: [X]
- [ ] Payment success rate: [X]%
- [ ] Active projects: [X]

### 4. Issues Review (10 min)
- [ ] Open incidents: [X]
- [ ] Support tickets: [X] (critical: [Y])
- [ ] User reports: Any patterns?
- [ ] Pending fixes: [List]

### 5. Planned Actions
- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Action item 3]

### Red Flags (Investigate immediately)
- [ ] None ✅
- [ ] [Issue to investigate]
```

---

### Weekly Review

**Every Monday (30 minutes):**

```markdown
## Weekly Operations Review - Week of [Date]

### Performance Summary
- Uptime: [X]% (target: 99.9%)
- Average response time: [X]ms
- Error rate: [X]% (target: <1%)
- Peak traffic: [X] req/min

### Incidents
- Total incidents: [X]
- CRITICAL: [X]
- HIGH: [X]
- MEDIUM: [X]
- LOW: [X]
- MTTR (Mean Time to Resolve): [X] minutes

### Business Metrics
- New users: [X] (+/- [Y]% vs last week)
- Total investments: [X]
- Payment volume: $[X]
- Active projects: [X]

### Infrastructure
- Database size: [X]GB
- Storage usage: [X]%
- Average load: [X]%
- Costs: $[X]

### Action Items
- [ ] [Item 1]
- [ ] [Item 2]
- [ ] [Item 3]

### Improvements Needed
- Performance: [Notes]
- Features: [Notes]
- Infrastructure: [Notes]
```

---

### Alerts Configuration

**Set up alerts for these scenarios:**

```yaml
# alerts.yaml

- name: High Error Rate
  condition: error_rate > 5%
  duration: 5 minutes
  severity: CRITICAL
  notify:
    - #engineering-alerts
    - pagerduty
    - email: on-call@realco.com

- name: Slow Response Time
  condition: p95_response_time > 1000ms
  duration: 10 minutes
  severity: HIGH
  notify:
    - #engineering-alerts

- name: Database Connection Pool
  condition: db_connections > 90%
  duration: 5 minutes
  severity: CRITICAL
  notify:
    - #engineering-alerts
    - #devops

- name: Failed Payments Spike
  condition: failed_payments_count > 10
  duration: 15 minutes
  severity: HIGH
  notify:
    - #engineering-alerts
    - #finance

- name: API Down
  condition: health_check_failed
  duration: 1 minute
  severity: CRITICAL
  notify:
    - #engineering-alerts
    - pagerduty
    - sms: [on-call-phone]

- name: Memory Usage High
  condition: memory_usage > 85%
  duration: 10 minutes
  severity: HIGH
  notify:
    - #devops

- name: Disk Space Low
  condition: disk_usage > 80%
  duration: 5 minutes
  severity: HIGH
  notify:
    - #devops
```

---

### Performance Optimization Routine

**Monthly Performance Review:**

1. **Analyze Slow Queries**
   ```sql
   -- Find slow queries
   SELECT 
       query,
       calls,
       total_time,
       mean_time,
       max_time
   FROM pg_stat_statements
   ORDER BY mean_time DESC
   LIMIT 20;
   ```

2. **Review Database Indexes**
   ```sql
   -- Find missing indexes
   SELECT 
       schemaname,
       tablename,
       seq_scan,
       idx_scan,
       seq_scan / (idx_scan + 1) as scan_ratio
   FROM pg_stat_user_tables
   WHERE seq_scan > 1000
   ORDER BY scan_ratio DESC;
   ```

3. **Optimize Bundle Size**
   ```bash
   # Analyze frontend bundle
   npm run build -- --mode production
   npx vite-bundle-visualizer
   
   # Look for:
   # - Large dependencies to tree-shake
   # - Duplicate dependencies
   # - Opportunities for code splitting
   ```

4. **Review API Performance**
   ```bash
   # Identify slow endpoints
   grep "response_time" logs/api.log | \
     awk '{if($5>500) print $0}' | \
     sort | uniq -c | sort -rn | head -20
   ```

---

## 📈 METRICS TO TRACK

### Technical Metrics

**System Health:**
- Uptime: >99.9%
- Error rate: <1%
- Response time (p95): <500ms
- Response time (p99): <1000ms

**Infrastructure:**
- CPU usage: <70% average
- Memory usage: <70% average
- Database connections: <70% of max
- Disk usage: <80%

**Database:**
- Query time (p95): <50ms
- Connection pool utilization: <70%
- Database size growth: Monitor trend
- Slow query count: <10 per hour

**External Services:**
- Stripe API success rate: >99%
- Plaid API success rate: >99%
- S3 upload success rate: >99%
- Email delivery rate: >98%

---

### Business Metrics

**User Activity:**
- Daily active users (DAU)
- Monthly active users (MAU)
- User retention rate
- Session duration

**Transactions:**
- Payment success rate: >95%
- Average payment processing time: <24 hours
- Bank verification success rate: >90%
- Failed payment rate: <5%

**Features:**
- Investment creation success rate: >95%
- Project creation success rate: >95%
- Daily log creation rate
- Photo upload success rate: >98%

---

## 🚨 EMERGENCY PROCEDURES

### When to Escalate

**Escalate to Tech Lead if:**
- Error rate >10% for >10 minutes
- Database connection failure
- Payment processing completely broken
- Security incident detected
- Data loss suspected

**Escalate to CTO if:**
- Service down >30 minutes
- Data breach confirmed
- Regulatory compliance issue
- Significant financial loss
- Major customer impact (>1000 users)

---

### Rollback Decision Tree

```
Issue Detected
    ↓
Is service operational?
    ├── YES → Can it wait for hotfix?
    │        ├── YES → Deploy hotfix
    │        └── NO → Is issue getting worse?
    │                 ├── YES → ROLLBACK
    │                 └── NO → Monitor closely
    │
    └── NO → Is data at risk?
             ├── YES → ROLLBACK IMMEDIATELY
             └── NO → Can you fix in <30 min?
                      ├── YES → Deploy hotfix
                      └── NO → ROLLBACK
```

---

## 📝 RUNBOOK TEMPLATES

### Incident Response Template

```markdown
# Incident Report: [TITLE]

**Date/Time:** [YYYY-MM-DD HH:MM UTC]
**Severity:** [CRITICAL/HIGH/MEDIUM/LOW]
**Status:** [INVESTIGATING/IDENTIFIED/MONITORING/RESOLVED]
**Impact:** [Description of user impact]

## Timeline

- **HH:MM** - Issue detected
- **HH:MM** - Team alerted
- **HH:MM** - Root cause identified
- **HH:MM** - Fix deployed
- **HH:MM** - Issue resolved

## Root Cause

[Detailed explanation of what caused the issue]

## Resolution

[What was done to fix it]

## Prevention

[What will be done to prevent this in the future]

## Action Items

- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]
- [ ] [Action 3] - Owner: [Name] - Due: [Date]
```

---

## 🎯 SUCCESS CRITERIA

**After 30 days of production:**

- [ ] Uptime >99.9%
- [ ] Error rate <1%
- [ ] Response time p95 <500ms
- [ ] Payment success rate >95%
- [ ] No critical incidents
- [ ] User satisfaction >4/5
- [ ] All monitoring in place
- [ ] Team trained on procedures

---

## 📞 ON-CALL ROTATION

**Set up on-call schedule:**

```markdown
## Week of [Date]

**Primary:** [Name] [Phone] [Email]
**Secondary:** [Name] [Phone] [Email]
**Escalation:** [Tech Lead] [Phone]

**Responsibilities:**
- Monitor alerts
- Respond to incidents within 15 minutes
- Escalate if needed
- Document all incidents
- Hand off to next person with context
```

---

**You're now equipped for production operations!** 

Continue monitoring, stay vigilant, and iterate on these procedures as you learn more about your system's behavior in production.
