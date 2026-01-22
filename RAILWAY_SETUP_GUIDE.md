# 🚂 Railway Environment Variables Setup Guide

**Quick Reference for Setting Up RealCo Platform on Railway**

---

## 🚀 Quick Setup (Automated)

### Option 1: PowerShell Script (Windows)

```powershell
cd backend/scripts
.\setup-railway-env.ps1
```

### Option 2: Bash Script (Mac/Linux)

```bash
cd backend/scripts
chmod +x setup-railway-env.sh
./setup-railway-env.sh
```

---

## 📋 Manual Setup (Step-by-Step)

If you prefer to set variables manually, follow these steps:

### Step 1: Install & Login to Railway

```bash
npm install -g @railway/cli
railway login
railway link  # Link to your project
```

### Step 2: Generate Secure Secrets

```bash
# Generate JWT Secret (64 hex characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Encryption Key (64 hex characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Session Secret (128 hex characters)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**💾 SAVE THESE SECRETS!** Store them in a password manager.

### Step 3: Set Core Variables

```bash
# Environment
railway variables set NODE_ENV=production
railway variables set PORT=8080
railway variables set LOG_LEVEL=info
railway variables set LOG_FORMAT=json

# Secrets (use the generated values from Step 2)
railway variables set JWT_SECRET="YOUR_GENERATED_JWT_SECRET"
railway variables set ENCRYPTION_KEY="YOUR_GENERATED_ENCRYPTION_KEY"
railway variables set SESSION_SECRET="YOUR_GENERATED_SESSION_SECRET"
railway variables set JWT_EXPIRY=15m
```

### Step 4: Set Stripe Variables

```bash
railway variables set STRIPE_SECRET_KEY="sk_live_YOUR_KEY"
railway variables set STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET"
```

### Step 5: Set Plaid Variables

```bash
railway variables set PLAID_CLIENT_ID="YOUR_CLIENT_ID"
railway variables set PLAID_SECRET="YOUR_SECRET"
railway variables set PLAID_ENV=production
```

### Step 6: Set AWS S3 Variables

```bash
railway variables set AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY"
railway variables set AWS_SECRET_ACCESS_KEY="YOUR_SECRET_KEY"
railway variables set AWS_REGION=us-east-1
railway variables set AWS_S3_BUCKET_DOCS=realco-prod-documents
railway variables set AWS_S3_BUCKET_CONSTRUCTION=realco-prod-construction
```

### Step 7: Set Email Variables (SendGrid)

```bash
railway variables set SENDGRID_API_KEY="YOUR_API_KEY"
railway variables set SENDGRID_FROM_EMAIL=noreply@realco.com
railway variables set SENDGRID_FROM_NAME="RealCo Platform"
railway variables set EMAIL_SERVICE=sendgrid
```

### Step 8: Set Application URLs

```bash
railway variables set FRONTEND_URL=https://app.realco.com
railway variables set CORS_ORIGINS=https://app.realco.com
railway variables set WEBHOOK_BASE_URL=https://api.realco.com
```

### Step 9: Set Feature Flags

```bash
railway variables set ENABLE_CONSTRUCTION_MODULE=true
railway variables set ENABLE_ESCROW_MODULE=true
railway variables set ENABLE_PAYMENT_PROCESSING=true
railway variables set ENABLE_DISTRIBUTIONS=true
```

### Step 10: Set Security & Compliance

```bash
railway variables set RATE_LIMIT_MAX=100
railway variables set RATE_LIMIT_WINDOW=60000
railway variables set ENABLE_OFAC_SCREENING=false
```

### Step 11: Optional - Monitoring (Sentry)

```bash
railway variables set SENTRY_DSN="https://YOUR_KEY@sentry.io/PROJECT_ID"
railway variables set SENTRY_ENVIRONMENT=production
railway variables set SENTRY_TRACES_SAMPLE_RATE=0.1
```

---

## 🗄️ Database Setup

### Add PostgreSQL Database

```bash
# In Railway dashboard, click "New" → "Database" → "PostgreSQL"
# Railway automatically sets DATABASE_URL variable

# Or via CLI:
railway add
# Select: PostgreSQL
```

The `DATABASE_URL` variable will be automatically set as:
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Add Redis (Optional)

```bash
# In Railway dashboard, click "New" → "Database" → "Redis"
# Railway automatically sets REDIS_URL variable

# Or via CLI:
railway add
# Select: Redis
```

The `REDIS_URL` variable will be automatically set as:
```
REDIS_URL=${{Redis.REDIS_URL}}
```

---

## ✅ Verification

### Check All Variables

```bash
railway variables
```

### Verify Database Connection

```bash
railway run npx prisma migrate status
```

---

## 📋 Complete Variable Checklist

**Core (11 variables):**
- [x] NODE_ENV
- [x] PORT
- [x] LOG_LEVEL
- [x] LOG_FORMAT
- [x] JWT_SECRET
- [x] ENCRYPTION_KEY
- [x] SESSION_SECRET
- [x] JWT_EXPIRY
- [x] REFRESH_TOKEN_EXPIRY
- [x] DATABASE_URL (auto-set by Railway)
- [x] REDIS_URL (auto-set by Railway)

**Stripe (2 variables):**
- [x] STRIPE_SECRET_KEY
- [x] STRIPE_WEBHOOK_SECRET

**Plaid (3 variables):**
- [x] PLAID_CLIENT_ID
- [x] PLAID_SECRET
- [x] PLAID_ENV

**AWS S3 (5 variables):**
- [x] AWS_ACCESS_KEY_ID
- [x] AWS_SECRET_ACCESS_KEY
- [x] AWS_REGION
- [x] AWS_S3_BUCKET_DOCS
- [x] AWS_S3_BUCKET_CONSTRUCTION

**Email/SendGrid (4 variables):**
- [x] SENDGRID_API_KEY
- [x] SENDGRID_FROM_EMAIL
- [x] SENDGRID_FROM_NAME
- [x] EMAIL_SERVICE

**Application (3 variables):**
- [x] FRONTEND_URL
- [x] CORS_ORIGINS
- [x] WEBHOOK_BASE_URL

**Feature Flags (4 variables):**
- [x] ENABLE_CONSTRUCTION_MODULE
- [x] ENABLE_ESCROW_MODULE
- [x] ENABLE_PAYMENT_PROCESSING
- [x] ENABLE_DISTRIBUTIONS

**Security (3 variables):**
- [x] RATE_LIMIT_MAX
- [x] RATE_LIMIT_WINDOW
- [x] ENABLE_OFAC_SCREENING

**Monitoring (3 variables - Optional):**
- [ ] SENTRY_DSN
- [ ] SENTRY_ENVIRONMENT
- [ ] SENTRY_TRACES_SAMPLE_RATE

**Total: 41 variables** (38 required + 3 optional)

---

## 🚀 Deploy After Setup

```bash
# Run database migrations
railway run npx prisma migrate deploy

# Deploy application
railway up

# Check deployment status
railway status

# View logs
railway logs

# Check health endpoint
curl https://YOUR_RAILWAY_URL/api/v1/health
```

---

## 🔒 Security Best Practices

1. **Never commit secrets** to git
2. **Save secrets securely** in a password manager
3. **Rotate secrets quarterly**
4. **Use strong random values** (32+ bytes)
5. **Enable 2FA** on Railway account
6. **Limit team access** to production variables

---

## 🆘 Troubleshooting

### Variables Not Set

```bash
# List all variables
railway variables

# Set a specific variable
railway variables set KEY=VALUE

# Delete a variable
railway variables delete KEY
```

### Database Connection Issues

```bash
# Check DATABASE_URL
railway variables | grep DATABASE_URL

# Test connection
railway run npx prisma db pull
```

### Can't Find Railway Project

```bash
# List projects
railway projects

# Link to project
railway link
```

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app
- **Deployment Guide:** See `DEPLOYMENT_INSTRUCTIONS.md`
- **Troubleshooting:** See `docs/guides/TROUBLESHOOTING_GUIDE.md`

---

**🎉 Ready to deploy! All variables configured!**
