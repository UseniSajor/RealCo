# 🚀 Quick Deploy Guide

**Deploy RealCo Platform in 5 Minutes**

---

## 🎯 **One-Command Deploy**

```powershell
.\DEPLOY_NOW.ps1
```

This script handles everything:
- ✅ Pre-deployment checks
- ✅ Environment setup (if needed)
- ✅ Run tests
- ✅ Database backup
- ✅ Deploy backend to Railway
- ✅ Deploy frontend to Vercel
- ✅ Post-deployment verification

---

## 📋 **Before You Start**

### Prerequisites

1. **Install CLIs:**
   ```powershell
   npm install -g @railway/cli
   npm install -g vercel
   ```

2. **Login to Services:**
   ```powershell
   railway login
   vercel login
   ```

3. **Have Credentials Ready:**
   - Stripe API keys
   - Plaid credentials
   - AWS S3 credentials
   - (Optional) SendGrid, Sentry

---

## 🚀 **Deployment Options**

### Option 1: Full Deploy (Recommended First Time)

```powershell
# Complete deployment with setup
.\DEPLOY_NOW.ps1
```

When prompted, answer:
- Environment setup: `yes` (first time)
- Continue with tests: `yes`
- Deploy to production: `yes`

### Option 2: Setup Only (First Time)

```powershell
# Just set up environment variables
.\DEPLOY_NOW.ps1 -SetupOnly
```

Then deploy later:
```powershell
.\DEPLOY_NOW.ps1
```

### Option 3: Quick Deploy (Skip Tests)

```powershell
# Fast deployment, skip tests and backup
.\DEPLOY_NOW.ps1 -SkipTests -SkipBackup
```

---

## 📊 **What Happens During Deployment**

### 1. Pre-Deployment Checks (30 seconds)
- ✅ Verify Railway CLI
- ✅ Verify Vercel CLI
- ✅ Check Node.js version
- ✅ Check git status

### 2. Environment Setup (5 minutes - first time only)
- 🔐 Generate secure secrets
- 📝 Set Railway variables
- ⚙️ Configure integrations

### 3. Run Tests (1 minute)
- 🧪 Type checking
- ✅ Unit tests
- 📋 Integration tests

### 4. Database Backup (30 seconds)
- 💾 Create SQL backup
- 📦 Save to local file

### 5. Deploy Backend (2 minutes)
- 🚂 Railway deployment
- 🗄️ Database migrations
- 🏥 Health check

### 6. Deploy Frontend (1 minute)
- ▲ Vercel deployment
- 📦 Build optimization
- 🌐 CDN distribution

### 7. Verification (30 seconds)
- ✅ Health endpoint check
- 🔗 Get deployment URLs
- 📊 Display summary

**Total Time: ~10 minutes (first time) or ~5 minutes (subsequent deploys)**

---

## 🎯 **Post-Deployment Checklist**

After deployment completes:

### 1. Verify Backend (1 minute)
```powershell
# Check health endpoint
curl https://your-app.railway.app/api/v1/health

# View logs
railway logs --tail
```

### 2. Verify Frontend (1 minute)
```powershell
# Open in browser
start https://your-app.vercel.app

# View logs
vercel logs
```

### 3. Test Critical Flows (5 minutes)
- [ ] User can access the app
- [ ] API endpoints respond
- [ ] Database queries work
- [ ] Authentication works

### 4. Configure Domains (Optional, 10 minutes)
- [ ] Railway: `api.realco.com`
- [ ] Vercel: `app.realco.com`

---

## 🔧 **Common Commands**

### Backend (Railway)

```powershell
# View logs
railway logs

# Check status
railway status

# List variables
railway variables

# Run migrations
railway run npx prisma migrate deploy

# Open dashboard
railway open
```

### Frontend (Vercel)

```powershell
# View logs
vercel logs

# List deployments
vercel ls

# Inspect deployment
vercel inspect

# Open dashboard
vercel open
```

---

## 🆘 **Troubleshooting**

### Deployment Fails

**Backend deployment failed:**
```powershell
# Check Railway logs
railway logs --tail

# Verify environment variables
railway variables

# Retry deployment
railway up
```

**Frontend deployment failed:**
```powershell
# Check Vercel logs
vercel logs

# Rebuild and deploy
vercel --prod --force
```

### Health Check Fails

```powershell
# Wait a moment (app might be starting)
Start-Sleep -Seconds 30

# Check logs
railway logs --tail

# Verify database connection
railway run npx prisma db pull
```

### Migration Errors

```powershell
# Check migration status
railway run npx prisma migrate status

# Manually run migrations
railway run npx prisma migrate deploy

# If stuck, reset (⚠️ DANGER - destroys data)
railway run npx prisma migrate reset
```

---

## 🔄 **Rollback Procedure**

If something goes wrong:

### Backend Rollback
```powershell
# View recent deployments
railway deployments

# Rollback to previous
railway rollback
```

### Frontend Rollback
```powershell
# View deployments
vercel ls

# Promote previous deployment
# (Go to Vercel dashboard → Deployments → Promote to Production)
```

### Database Rollback
```powershell
# Restore from backup
railway run psql < backup_TIMESTAMP.sql
```

---

## 📞 **Need Help?**

**Documentation:**
- Full guide: `DEPLOYMENT_INSTRUCTIONS.md`
- Railway setup: `RAILWAY_SETUP_GUIDE.md`
- Troubleshooting: `docs/guides/TROUBLESHOOTING_GUIDE.md`

**Support:**
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support
- Sentry: https://sentry.io/support

---

## ✅ **Success Indicators**

Your deployment is successful when:

- ✅ Health endpoint returns 200 OK
- ✅ Frontend loads in browser
- ✅ No errors in Railway logs
- ✅ No errors in Vercel logs
- ✅ Database queries execute
- ✅ API endpoints respond

---

## 🎉 **You're Live!**

**Congratulations! Your RealCo Platform is now deployed and running in production! 🚀**

**What's Next?**
1. Monitor for the first hour
2. Test all critical user flows
3. Set up uptime monitoring
4. Configure custom domains
5. Celebrate! 🎊

---

*Need to redeploy? Just run `.\DEPLOY_NOW.ps1` again!*
