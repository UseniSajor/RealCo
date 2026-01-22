# RealCo Platform - Deployment Instructions
## Complete Guide for Railway (Backend) & Vercel (Frontend)

**Last Updated:** January 22, 2026  
**Status:** Production-ready configuration

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before deploying, ensure you have completed:

- [ ] All tests passing (`npm test` in backend)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] No critical bugs in staging
- [ ] Database backup created
- [ ] Team notified of deployment window
- [ ] Rollback plan documented
- [ ] Environment variables configured
- [ ] Domain DNS configured
- [ ] SSL certificates ready

**Review:** [docs/guides/PRE_DEPLOYMENT_VALIDATION.md](docs/guides/PRE_DEPLOYMENT_VALIDATION.md)

---

## 🚂 RAILWAY BACKEND DEPLOYMENT

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your RealCo repository
5. Select `backend/` as root directory

### Step 3: Add PostgreSQL Database

1. In Railway project dashboard, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway automatically sets `DATABASE_URL` environment variable

### Step 4: Add Redis (Optional)

1. Click "New" → "Database" → "Redis"
2. Railway automatically sets `REDIS_URL` environment variable

### Step 5: Configure Environment Variables

In Railway dashboard → Your Service → Variables tab, add:

**Critical Variables (Generate Secure Values!):**
```bash
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=[64_hex_characters]
ENCRYPTION_KEY=[64_hex_characters]
SESSION_SECRET=[128_hex_characters]
```

**Stripe (Production):**
```bash
STRIPE_SECRET_KEY=sk_live_[your_key]
STRIPE_WEBHOOK_SECRET=whsec_[your_secret]
```

**Plaid (Production):**
```bash
PLAID_CLIENT_ID=[your_client_id]
PLAID_SECRET=[your_secret]
PLAID_ENV=production
```

**AWS S3:**
```bash
AWS_ACCESS_KEY_ID=[your_key]
AWS_SECRET_ACCESS_KEY=[your_secret]
AWS_S3_BUCKET_DOCS=realco-prod-documents
AWS_S3_BUCKET_CONSTRUCTION=realco-prod-construction
AWS_REGION=us-east-1
```

**Application:**
```bash
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://app.realco.com
CORS_ORIGINS=https://app.realco.com
```

**Feature Flags:**
```bash
ENABLE_CONSTRUCTION_MODULE=true
ENABLE_ESCROW_MODULE=true
ENABLE_PAYMENT_PROCESSING=true
```

**Complete list:** See `backend/.env.production.example`

### Step 6: Configure Build Settings

Railway should auto-detect settings from `railway.json`, but verify:

- **Build Command:** `npm ci && npx prisma generate && npm run build`
- **Start Command:** `npm run start:prod`
- **Health Check Path:** `/api/v1/health`
- **Region:** us-west1 (or your preferred region)

### Step 7: Run Database Migrations

```bash
cd backend
railway run npx prisma migrate deploy
railway run npx prisma migrate status
```

### Step 8: Deploy

**Option A: Manual Deployment**
```bash
cd backend
railway up
```

**Option B: Automatic with GitHub Actions**
- Push to `main` branch
- GitHub Actions workflow automatically runs tests and deploys
- See `.github/workflows/deploy-backend.yml`

### Step 9: Configure Custom Domain

1. Railway dashboard → Your Service → Settings → Domains
2. Click "Custom Domain"
3. Add `api.realco.com`
4. Update your DNS:
   ```
   api.realco.com CNAME [your-service].railway.app
   ```
5. Wait for SSL certificate provisioning (automatic)

### Step 10: Verify Deployment

```bash
# Health check
curl https://api.realco.com/api/v1/health

# Should return:
# {"status":"ok","database":true,"redis":true,...}
```

---

## ▲ VERCEL FRONTEND DEPLOYMENT

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
vercel login
```

### Step 2: Link Project

```bash
cd frontend
vercel link
```

### Step 3: Configure Environment Variables

In Vercel dashboard → Your Project → Settings → Environment Variables:

**Production Variables:**
```bash
VITE_API_URL=https://api.realco.com/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_[your_key]
VITE_PLAID_ENV=production
VITE_SENTRY_DSN=https://[your_key]@sentry.io/[project]
VITE_GA_TRACKING_ID=G-[your_id]
VITE_ENABLE_CONSTRUCTION=true
VITE_ENABLE_ESCROW=true
```

**Important:** Set these for "Production" environment only!

### Step 4: Configure Build Settings

Vercel auto-detects from `vercel.json`, but verify:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Node Version:** 20.x

### Step 5: Deploy

**Option A: Manual Deployment**
```bash
cd frontend
vercel --prod
```

**Option B: Automatic with Git**
- Push to `main` branch
- Vercel automatically deploys
- Preview deployments for PRs

**Option C: GitHub Actions**
```bash
# Triggered automatically on push to main
# See .github/workflows/deploy-frontend.yml
```

### Step 6: Configure Custom Domain

1. Vercel dashboard → Your Project → Settings → Domains
2. Add `app.realco.com`
3. Update DNS:
   ```
   app.realco.com CNAME cname.vercel-dns.com
   ```
4. SSL automatic (Let's Encrypt)

### Step 7: Verify Deployment

```bash
# Open in browser
open https://app.realco.com

# Check console for errors
# Verify API connection works
```

---

## 🔄 CI/CD SETUP

### GitHub Actions Configuration

**Required Secrets (Settings → Secrets → Actions):**

For Backend (Railway):
```
RAILWAY_TOKEN=<from railway tokens>
RAILWAY_URL=https://api.realco.com
SLACK_WEBHOOK=<optional>
```

For Frontend (Vercel):
```
VERCEL_TOKEN=<from vercel settings>
VERCEL_ORG_ID=<from vercel project settings>
VERCEL_PROJECT_ID=<from vercel project settings>
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_[your_key]
SLACK_WEBHOOK=<optional>
```

### Workflows

**Backend:** `.github/workflows/deploy-backend.yml`
- Triggers on push to `main` with changes in `backend/`
- Runs tests → Type check → Deploy → Migrate → Health check

**Frontend:** `.github/workflows/deploy-frontend.yml`
- Triggers on push to `main` with changes in `frontend/`
- Runs build → Tests → Deploy to Vercel

---

## 🔧 POST-DEPLOYMENT

### 1. Smoke Tests

```bash
# Backend health
curl https://api.realco.com/api/v1/health

# Frontend
open https://app.realco.com

# Test critical flows:
# - User login
# - API connection
# - Database queries
# - Stripe webhook
```

### 2. Monitor Logs

**Railway:**
```bash
railway logs
railway logs --follow
```

**Vercel:**
```bash
vercel logs
vercel logs --follow
```

### 3. Set Up Monitoring

**Sentry (Error Tracking):**
1. Create Sentry project
2. Add DSN to environment variables
3. Monitor for errors

**Uptime Monitoring:**
- Configure uptime checks for health endpoints
- Set up alerts for downtime

### 4. Database Backups

**Railway:**
```bash
# Manual backup
railway run pg_dump > backup.sql

# Automated daily backups (configure in Railway)
# Settings → Backups → Enable Daily Backups
```

---

## 🚨 ROLLBACK PROCEDURE

### If Deployment Fails:

**Backend (Railway):**
```bash
# Revert to previous deployment
railway rollback

# Or restore database from backup
railway run psql < backup_[timestamp].sql
```

**Frontend (Vercel):**
```bash
# Vercel dashboard → Deployments → Previous deployment → Promote to Production
# Or via CLI:
vercel rollback
```

---

## 🔐 SECURITY CHECKLIST

- [ ] All secrets are in environment variables (not code)
- [ ] CORS configured correctly (`CORS_ORIGINS`)
- [ ] Rate limiting enabled
- [ ] HTTPS enforced (automatic on Railway/Vercel)
- [ ] Database has strong password
- [ ] JWT secrets are strong (64+ hex characters)
- [ ] Stripe webhook signature verification enabled
- [ ] Plaid environment set to `production`
- [ ] No sensitive data in logs

---

## 📊 MONITORING URLS

**Production:**
- Frontend: https://app.realco.com
- Backend API: https://api.realco.com/api/v1
- Health Check: https://api.realco.com/api/v1/health

**Dashboards:**
- Railway: https://railway.app/project/[your-project]
- Vercel: https://vercel.com/[your-org]/realco-frontend
- Sentry: https://sentry.io/organizations/realco/

---

## 📞 SUPPORT

**Issues?**
1. Check logs: `railway logs` or `vercel logs`
2. Review [TROUBLESHOOTING_GUIDE.md](docs/guides/TROUBLESHOOTING_GUIDE.md)
3. Contact DevOps team
4. Emergency rollback if critical

---

## ✅ DEPLOYMENT SUCCESS CHECKLIST

After deployment, verify:

- [ ] Health check returns 200 OK
- [ ] Frontend loads in browser
- [ ] User can log in
- [ ] API requests work
- [ ] Database queries execute
- [ ] Webhooks receive events
- [ ] No errors in Sentry
- [ ] SSL certificates valid
- [ ] Custom domains resolve
- [ ] Team notified of deployment

---

**🎉 Deployment Complete!**

**Next Steps:**
1. Monitor for 1 hour
2. Check error rates in Sentry
3. Review logs for warnings
4. Document any issues
5. Celebrate! 🎉

---

*For detailed deployment guide, see [.cursor/Docs/DEPLOYMENT_GUIDE.md](.cursor/Docs/DEPLOYMENT_GUIDE.md)*
