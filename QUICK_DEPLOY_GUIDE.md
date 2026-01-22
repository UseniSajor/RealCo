# 🚀 Quick Deploy Guide

## One-Command Deployment

Run this single command to deploy everything:

```powershell
.\AUTO_DEPLOY.ps1
```

This script will:
1. ✅ Commit & push your changes to GitHub
2. ✅ Auto-generate secure secrets (JWT, encryption keys)
3. ✅ Set all Railway environment variables
4. ✅ Deploy backend to Railway
5. ✅ Set all Vercel environment variables
6. ✅ Deploy frontend to Vercel
7. ✅ Verify deployments

**Total Time: ~10 minutes**

---

## What You'll Need

Have these ready when prompted:

### **Required:**
- ✅ **Stripe Keys:**
  - Secret Key: `sk_test_...` or `sk_live_...`
  - Webhook Secret: `whsec_...`
  - Publishable Key: `pk_test_...` or `pk_live_...`

- ✅ **Plaid Keys:**
  - Client ID
  - Secret
  - Environment: `sandbox`, `development`, or `production`

- ✅ **AWS S3:**
  - Access Key ID
  - Secret Access Key
  - Bucket Name
  - Region (e.g., `us-east-1`)

### **Optional:**
- SendGrid API Key (for emails)
- Sentry DSN (for error tracking)

---

## Step-by-Step Process

### 1. Start Deployment

```powershell
.\AUTO_DEPLOY.ps1
```

### 2. Answer Prompts

**Commit Message:**
```
Enter commit message (or press Enter for default):
> Production deployment 2026-01-22
```

**Stripe Configuration:**
```
Enter Stripe Secret Key (sk_...): sk_live_xxxxx
Enter Stripe Webhook Secret (whsec_...): whsec_xxxxx
Enter Stripe Publishable Key (pk_...): pk_live_xxxxx
```

**Plaid Configuration:**
```
Enter Plaid Client ID: your_client_id
Enter Plaid Secret: your_secret
Enter Plaid Environment: production
```

**AWS S3 Configuration:**
```
Enter AWS Access Key ID: AKIAXXXXX
Enter AWS Secret Access Key: your_secret
Enter S3 Bucket Name: realco-documents
Enter AWS Region: us-east-1
```

**Optional Services:**
```
Enter SendGrid API Key (or press Enter to skip): 
Enter Sentry DSN (or press Enter to skip):
```

### 3. Wait for Deployment

The script will:
- Push code to GitHub
- Set Railway variables
- Deploy backend
- Run database migrations
- Set Vercel variables
- Deploy frontend
- Test health endpoints

### 4. Deployment Complete! 🎉

You'll see:
```
╔════════════════════════════════════════════════════════════╗
║           🎉 DEPLOYMENT COMPLETE! 🎉                      ║
╚════════════════════════════════════════════════════════════╝

🔗 Your Application URLs:
   Backend:  https://your-app.railway.app
   Frontend: https://your-app.vercel.app
```

---

## Verify Deployment

### Test Backend

```powershell
# Check health
curl https://your-app.railway.app/api/v1/health

# View logs
railway logs
```

### Test Frontend

```powershell
# Open in browser
start https://your-app.vercel.app

# View logs
vercel logs
```

---

## Troubleshooting

### Railway Deployment Failed

```powershell
# Check logs
railway logs --tail

# Verify variables
railway variables

# Retry deployment
railway up
```

### Vercel Deployment Failed

```powershell
# Check logs
vercel logs

# Redeploy
vercel --prod --force
```

### Database Migration Failed

```powershell
# Check migration status
railway run npx prisma migrate status

# Apply migrations manually
railway run npx prisma migrate deploy
```

### Variables Not Set

```powershell
# View Railway variables
railway variables

# Set manually
railway variables set "KEY=value"

# View Vercel variables
vercel env ls

# Set manually
vercel env add KEY_NAME production
```

---

## Re-Deployment

To deploy again after making changes:

```powershell
# Run the same script
.\AUTO_DEPLOY.ps1
```

It will:
- Skip variable setup (already configured)
- Commit new changes
- Deploy updates
- Verify health

---

## Manual Deployment

If you prefer manual control:

### Backend (Railway)

```powershell
cd backend
git push
railway up
railway run npx prisma migrate deploy
```

### Frontend (Vercel)

```powershell
cd frontend
vercel --prod
```

---

## Environment Variables Reference

### Railway (Backend)

**Auto-Generated:**
- `JWT_SECRET` - JSON Web Token secret
- `ENCRYPTION_KEY` - Data encryption key
- `SESSION_SECRET` - Session encryption key

**Auto-Set:**
- `NODE_ENV=production`
- `PORT=8080`
- `LOG_LEVEL=info`
- `ENABLE_CONSTRUCTION_MODULE=true`
- `ENABLE_FINANCE_MODULE=true`

**User-Provided:**
- `STRIPE_SECRET_KEY` - Stripe API secret
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signature
- `PLAID_CLIENT_ID` - Plaid client ID
- `PLAID_SECRET` - Plaid secret
- `PLAID_ENV` - Plaid environment
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret
- `AWS_S3_BUCKET` - S3 bucket name
- `AWS_REGION` - AWS region
- `SENDGRID_API_KEY` - SendGrid key (optional)
- `SENTRY_DSN` - Sentry DSN (optional)

**Auto-Set by Railway:**
- `DATABASE_URL` - PostgreSQL connection string

### Vercel (Frontend)

**User-Provided:**
- `VITE_API_URL` - Backend API URL
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `VITE_PLAID_ENV` - Plaid environment

---

## Success Indicators

✅ Deployment is successful when:
- No errors in script output
- Backend health returns `{"status":"healthy"}`
- Frontend loads in browser
- No errors in Railway logs
- No errors in Vercel logs

---

## Getting Help

**View Logs:**
```powershell
# Railway
railway logs --tail

# Vercel
vercel logs --follow
```

**Check Status:**
```powershell
# Railway
railway status

# Vercel
vercel ls
```

**Documentation:**
- Full guide: `DEPLOYMENT_INSTRUCTIONS.md`
- Railway setup: `RAILWAY_SETUP_GUIDE.md`
- Troubleshooting: `docs/TROUBLESHOOTING_GUIDE.md`

---

**Ready to deploy?**

```powershell
.\AUTO_DEPLOY.ps1
```

🚀 Let's go!
