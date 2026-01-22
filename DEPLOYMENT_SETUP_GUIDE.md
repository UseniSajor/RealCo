# 🚀 RealCo Platform - Deployment Setup Guide
## Git Push → Railway Backend → Vercel Frontend

**Status:** Ready to Deploy  
**Estimated Time:** 45 minutes  
**Date:** January 22, 2026

---

## ✅ PRE-FLIGHT CHECKLIST

Before starting, ensure:
- [ ] All code committed locally
- [ ] Tests passing (`cd backend && npm test`)
- [ ] Railway account created
- [ ] Vercel account created
- [ ] GitHub repository exists
- [ ] Stripe account setup (test/production keys)
- [ ] Plaid account setup (sandbox/production keys)
- [ ] AWS S3 bucket created

---

## 📋 STEP-BY-STEP DEPLOYMENT

### STEP 1: Push to GitHub (5 min)

```bash
# Navigate to project root
cd "c:\RealCo Platfrom"

# Check git status
git status

# Add all files
git add .

# Commit with meaningful message
git commit -m "Production deployment ready - backend API, frontend, tests, and documentation complete"

# Push to GitHub
git push origin main

# Verify push succeeded
git log -1
```

**✅ Verification:** Check GitHub repository to confirm code is pushed

---

### STEP 2: Railway Backend Setup (20 min)

#### 2.1 Create New Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `RealCo Platfrom` repository
5. Select **backend/** directory as root path

#### 2.2 Add PostgreSQL Database

1. In your Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will auto-provision a database
4. Database URL will be available as `${{Postgres.DATABASE_URL}}`

#### 2.3 Configure Environment Variables

Go to your Railway backend service → **Variables** tab

**Copy-paste these variables (update values):**

```bash
# ==========================================
# ENVIRONMENT
# ==========================================
NODE_ENV=production
PORT=5001

# ==========================================
# DATABASE (Auto-filled by Railway)
# ==========================================
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20

# ==========================================
# AUTHENTICATION (CRITICAL - Generate new!)
# ==========================================
JWT_SECRET=GENERATE_THIS_SEE_BELOW
ENCRYPTION_KEY=GENERATE_THIS_SEE_BELOW

# ==========================================
# CORS & SECURITY
# ==========================================
CORS_ORIGIN=https://your-app.vercel.app
FRONTEND_URL=https://your-app.vercel.app

# ==========================================
# STRIPE (Get from Stripe Dashboard)
# ==========================================
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# ==========================================
# PLAID (Get from Plaid Dashboard)
# ==========================================
PLAID_CLIENT_ID=YOUR_PLAID_CLIENT_ID
PLAID_SECRET=YOUR_PLAID_SECRET
PLAID_ENV=sandbox

# ==========================================
# AWS S3 (Get from AWS Console)
# ==========================================
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET
AWS_REGION=us-east-1
AWS_S3_BUCKET=realco-prod-photos

# ==========================================
# EMAIL (SendGrid)
# ==========================================
SENDGRID_API_KEY=YOUR_SENDGRID_KEY
SENDGRID_FROM_EMAIL=noreply@realco.com
EMAIL_SERVICE=sendgrid

# ==========================================
# LOGGING & MONITORING
# ==========================================
LOG_LEVEL=info
LOG_FORMAT=json

# ==========================================
# FEATURE FLAGS
# ==========================================
ENABLE_CONSTRUCTION_MODULE=true
ENABLE_ESCROW_MODULE=true
ENABLE_PAYMENT_PROCESSING=true
```

#### 2.4 Generate Secure Secrets

**Run locally to generate secrets:**

```bash
# Generate JWT_SECRET (256-bit)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output and paste as JWT_SECRET in Railway

# Generate ENCRYPTION_KEY (512-bit)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy output and paste as ENCRYPTION_KEY in Railway
```

**Or using PowerShell:**

```powershell
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 2.5 Configure Build Settings

In Railway project settings:

**Root Directory:** `backend`  
**Build Command:** `npm install && npx prisma generate && npm run build`  
**Start Command:** `npm start`  
**Watch Paths:** `backend/**`

#### 2.6 Run Database Migrations

After first deployment:

```bash
# Install Railway CLI locally
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run migrations
railway run --service backend npx prisma migrate deploy

# Verify migrations
railway run --service backend npx prisma migrate status
```

**✅ Verification:** 
- Check Railway logs for successful deployment
- Visit your Railway URL: `https://your-backend.railway.app/health`
- Should return: `{"status":"ok","timestamp":"..."}`

---

### STEP 3: Vercel Frontend Setup (15 min)

#### 3.1 Create New Project

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select **frontend/** as root directory

#### 3.2 Configure Build Settings

**Framework Preset:** Vite  
**Root Directory:** `frontend`  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

#### 3.3 Configure Environment Variables

Go to your Vercel project → **Settings** → **Environment Variables**

**Add these variables:**

```bash
# ==========================================
# API ENDPOINT (Update after Railway deploy)
# ==========================================
VITE_API_URL=https://your-backend.railway.app

# ==========================================
# STRIPE PUBLISHABLE KEY (Safe for frontend)
# ==========================================
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE

# ==========================================
# PLAID ENVIRONMENT
# ==========================================
VITE_PLAID_ENV=sandbox

# ==========================================
# FEATURE FLAGS
# ==========================================
VITE_ENABLE_CONSTRUCTION=true
VITE_ENABLE_ESCROW=true

# ==========================================
# ANALYTICS (Optional)
# ==========================================
VITE_GA_TRACKING_ID=G-YOUR_TRACKING_ID
```

**Important:** Set these for **Production** environment

#### 3.4 Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete (~2-3 minutes)
3. Vercel will provide your production URL

**✅ Verification:**
- Visit your Vercel URL: `https://your-app.vercel.app`
- App should load successfully
- Check browser console for errors

---

### STEP 4: Connect Frontend to Backend (5 min)

#### 4.1 Update CORS in Railway

Go back to Railway → Backend service → Variables

**Update these values:**

```bash
CORS_ORIGIN=https://your-app.vercel.app
FRONTEND_URL=https://your-app.vercel.app
```

Replace `your-app.vercel.app` with your actual Vercel URL

#### 4.2 Update Frontend API URL

If you deployed frontend first, update Vercel:

1. Vercel → Settings → Environment Variables
2. Update `VITE_API_URL` to your Railway backend URL
3. Redeploy: Deployments → Latest → "Redeploy"

**✅ Verification:**
- Open browser DevTools → Network tab
- Visit your Vercel app
- API calls should go to Railway backend
- No CORS errors

---

## 🔑 GETTING API KEYS

### Stripe Keys

1. Go to https://dashboard.stripe.com
2. Developers → API Keys
3. Copy:
   - **Publishable key** (pk_test_...) → Frontend
   - **Secret key** (sk_test_...) → Backend
4. Webhooks → Add endpoint: `https://your-backend.railway.app/api/v1/webhooks/stripe`
5. Copy **Webhook Secret** → Backend `STRIPE_WEBHOOK_SECRET`

### Plaid Keys

1. Go to https://dashboard.plaid.com
2. Team Settings → Keys
3. Copy:
   - **client_id** → Backend `PLAID_CLIENT_ID`
   - **secret** (sandbox) → Backend `PLAID_SECRET`
4. Set environment to `sandbox` for testing

### AWS S3

1. Go to https://console.aws.amazon.com/s3
2. Create bucket: `realco-prod-photos`
3. Go to IAM → Users → Create user
4. Attach policy: `AmazonS3FullAccess` (or custom policy)
5. Create access key
6. Copy:
   - **Access Key ID** → `AWS_ACCESS_KEY_ID`
   - **Secret Access Key** → `AWS_SECRET_ACCESS_KEY`

### SendGrid (Email)

1. Go to https://app.sendgrid.com
2. Settings → API Keys → Create API Key
3. Full Access permissions
4. Copy API key → `SENDGRID_API_KEY`
5. Settings → Sender Authentication → Verify email

---

## 🧪 POST-DEPLOYMENT TESTING

### Test Backend Health

```bash
# Health check
curl https://your-backend.railway.app/health

# Should return:
# {"status":"ok","timestamp":"2026-01-22T..."}

# API version check
curl https://your-backend.railway.app/api/v1/health

# Database connectivity
curl https://your-backend.railway.app/api/v1/health/db
```

### Test Frontend

1. Open `https://your-app.vercel.app`
2. Open DevTools → Console
3. Check for errors
4. Try to access login page
5. Verify API calls in Network tab

### Test Integration

1. Try to login (create test user first)
2. Navigate to dashboard
3. Check if data loads from backend
4. Test any critical user flow

---

## 🔧 TROUBLESHOOTING

### Backend Not Starting

**Check Railway logs:**
```bash
railway logs --service backend
```

**Common issues:**
- Missing environment variables → Add them in Railway
- Database connection failed → Check DATABASE_URL
- Build failed → Check package.json scripts

### Frontend Build Failed

**Check Vercel deployment logs**

**Common issues:**
- Wrong build command → Should be `npm run build`
- Missing env variables → Add VITE_* variables
- Wrong root directory → Should be `frontend`

### CORS Errors

**Symptoms:** Browser console shows CORS policy errors

**Fix:**
1. Railway → Backend → Variables
2. Update `CORS_ORIGIN` to match Vercel URL exactly
3. Include protocol: `https://your-app.vercel.app` (no trailing slash)
4. Redeploy backend

### Database Connection Issues

**Check DATABASE_URL format:**
```
postgresql://user:password@host:port/database
```

**Test connection in Railway:**
```bash
railway run --service backend npx prisma db pull
```

### Stripe Webhooks Not Working

1. Railway URL changed → Update webhook URL in Stripe
2. Webhook secret wrong → Regenerate in Stripe dashboard
3. Check Railway logs for webhook errors

---

## 📊 ENVIRONMENT VARIABLES REFERENCE

### Backend (Railway) - Complete List

| Variable | Required | Example | Where to Get |
|----------|----------|---------|--------------|
| `NODE_ENV` | ✅ | `production` | Set manually |
| `PORT` | ✅ | `5001` | Set manually |
| `DATABASE_URL` | ✅ | `postgresql://...` | Railway auto |
| `JWT_SECRET` | ✅ | `abc123...` | Generate locally |
| `ENCRYPTION_KEY` | ✅ | `def456...` | Generate locally |
| `CORS_ORIGIN` | ✅ | `https://app.vercel.app` | Vercel URL |
| `STRIPE_SECRET_KEY` | ✅ | `sk_test_...` | Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | ✅ | `whsec_...` | Stripe webhooks |
| `PLAID_CLIENT_ID` | ✅ | `abc123` | Plaid dashboard |
| `PLAID_SECRET` | ✅ | `def456` | Plaid dashboard |
| `AWS_ACCESS_KEY_ID` | ✅ | `AKIA...` | AWS IAM |
| `AWS_SECRET_ACCESS_KEY` | ✅ | `abc123...` | AWS IAM |
| `AWS_S3_BUCKET` | ✅ | `realco-photos` | S3 bucket name |
| `SENDGRID_API_KEY` | ⚠️ | `SG.abc...` | SendGrid |

### Frontend (Vercel) - Complete List

| Variable | Required | Example | Where to Get |
|----------|----------|---------|--------------|
| `VITE_API_URL` | ✅ | `https://backend.railway.app` | Railway URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | ✅ | `pk_test_...` | Stripe dashboard |
| `VITE_PLAID_ENV` | ✅ | `sandbox` | Set manually |
| `VITE_ENABLE_CONSTRUCTION` | ⚠️ | `true` | Set manually |
| `VITE_ENABLE_ESCROW` | ⚠️ | `true` | Set manually |

✅ = Required  
⚠️ = Optional but recommended

---

## 🎯 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [x] Code pushed to GitHub
- [ ] All tests passing
- [ ] Environment variables documented
- [ ] API keys obtained

### Railway Backend
- [ ] Project created
- [ ] GitHub repo connected
- [ ] PostgreSQL database added
- [ ] All environment variables set
- [ ] Secrets generated (JWT, encryption)
- [ ] Build settings configured
- [ ] First deployment successful
- [ ] Database migrations run
- [ ] Health endpoint working

### Vercel Frontend
- [ ] Project created
- [ ] GitHub repo connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] First deployment successful
- [ ] App loads in browser
- [ ] No console errors

### Integration
- [ ] CORS configured correctly
- [ ] Frontend connects to backend
- [ ] Login flow works
- [ ] Stripe integration tested
- [ ] Plaid integration tested
- [ ] File uploads work (S3)
- [ ] Email sending works

---

## 🚨 ROLLBACK PLAN

If deployment fails:

### Railway Backend
```bash
# Rollback to previous deployment
railway rollback --service backend

# Or redeploy specific commit
railway up --service backend --detach
```

### Vercel Frontend
1. Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

---

## 📞 SUPPORT

### Railway Issues
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### Vercel Issues
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Status: https://www.vercel-status.com

---

## 🎉 SUCCESS CRITERIA

Your deployment is successful when:

- ✅ Backend health check returns 200 OK
- ✅ Frontend loads without errors
- ✅ Login flow works end-to-end
- ✅ Database queries execute successfully
- ✅ No CORS errors in browser console
- ✅ API calls complete successfully
- ✅ Stripe test payment works
- ✅ File uploads to S3 work

---

## 📝 NEXT STEPS AFTER DEPLOYMENT

1. **Set up monitoring** (Sentry, LogRocket)
2. **Configure custom domains** (Railway + Vercel)
3. **Enable SSL certificates** (auto in both platforms)
4. **Set up CI/CD** (auto-deploy on push)
5. **Configure backups** (Railway auto-backups)
6. **Add status page** (statuspage.io)
7. **Set up alerts** (PagerDuty, Slack)

---

**Ready to deploy? Follow the steps above sequentially!**

---

*Last Updated: January 22, 2026*  
*Deployment Platform: Railway + Vercel*  
*Estimated Total Time: 45 minutes*
