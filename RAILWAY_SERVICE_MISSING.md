# 🔍 Railway Backend Service Missing - Troubleshooting Guide

**Issue:** Railway backend service "box" is gone from dashboard

---

## 🔎 **Step 1: Check Railway Dashboard**

### **Go to Railway Dashboard:**
1. Visit: https://railway.app/dashboard
2. Log in with your account
3. Look for your project

### **What to Look For:**

**Option A: Project Still Exists**
- You see the project name
- But the backend service is missing
- → Go to **Step 2: Restore Service**

**Option B: Project is Gone**
- No project visible at all
- → Go to **Step 3: Create New Project**

**Option C: Service is Paused/Sleeping**
- Service exists but shows "Paused" or "Sleeping"
- → Go to **Step 4: Wake Up Service**

---

## 🛠️ **Step 2: Restore Service (If Project Exists)**

If your project exists but the backend service is missing:

### **Option A: Add Service Back**

1. Click your project name in Railway dashboard
2. Click **"+ New"** button
3. Select **"GitHub Repo"**
4. Connect your RealCo repository
5. Select **"backend"** folder as root directory
6. Railway will auto-detect the service

### **Option B: Check If Service is Hidden**

Sometimes services are just collapsed:
1. In your project, look for a collapsed/minimized service
2. Click the expand icon
3. The service might just be hidden in the UI

---

## 🆕 **Step 3: Create New Railway Project**

If your entire project is gone, recreate it:

### **A) Create New Project:**
1. Go to: https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Authorize GitHub access
4. Select **RealCo** repository
5. Name it: `realco-production` or `realco-backend`

### **B) Configure Backend Service:**

**Build Settings:**
- **Root Directory:** `backend`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Watch Paths:** `backend/**`

**Environment Variables (Required):**
```bash
DATABASE_URL=postgresql://...  # PostgreSQL connection string
JWT_SECRET=your-jwt-secret-here
NODE_ENV=production
PORT=3000

# Optional (if using)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=your-bucket

PLAID_CLIENT_ID=your-plaid-id
PLAID_SECRET=your-plaid-secret
PLAID_ENV=sandbox

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### **C) Add PostgreSQL Database:**
1. In Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will auto-provision it
4. Copy the connection string
5. Add it to `DATABASE_URL` environment variable

### **D) Run Database Migrations:**
1. In Railway service settings, go to **"Settings"** tab
2. Open **"Deploy"** section
3. Add a deploy command: `npm run migrate:deploy`
4. Or use the Railway shell to run:
```bash
npm run migrate:deploy
npm run seed
```

---

## 💤 **Step 4: Wake Up Sleeping Service**

If your service shows as "Paused" or "Sleeping":

1. Click on the service in Railway dashboard
2. Look for **"Resume"** or **"Wake Up"** button
3. Click it to restart the service

**Common Reasons for Pausing:**
- Free tier inactivity limit reached
- Payment issues
- Manual pause by user
- Resource limits exceeded

---

## 🔗 **Step 5: Get Your Backend URL**

Once service is running:

1. Click on your backend service in Railway
2. Go to **"Settings"** tab
3. Look for **"Domains"** section
4. Copy the URL (looks like `https://realco-production-staging.up.railway.app`)

**Update Your Frontend:**

If you have a new URL, update it in:

```bash
# frontend/.env
VITE_API_URL=https://your-new-railway-url.up.railway.app

# apps/web/.env.local (Next.js)
NEXT_PUBLIC_API_URL=https://your-new-railway-url.up.railway.app
```

---

## 🆘 **Quick Restore Checklist**

If you need to completely recreate your backend:

- [ ] Create new Railway project
- [ ] Connect GitHub repo
- [ ] Set root directory to `backend`
- [ ] Add PostgreSQL database
- [ ] Copy `DATABASE_URL` to env vars
- [ ] Add `JWT_SECRET` env var
- [ ] Add other required env vars (AWS, Stripe, Plaid if needed)
- [ ] Deploy the service
- [ ] Run migrations: `npm run migrate:deploy`
- [ ] Seed database: `npm run seed`
- [ ] Get the service URL
- [ ] Update frontend env vars
- [ ] Test: `https://your-url.up.railway.app/v1/health/live`

---

## 🔐 **Your Previous Backend URL**

Based on earlier sessions, your backend was at:
```
https://realco-production-staging.up.railway.app
```

**Test if it's still working:**
```bash
curl https://realco-production-staging.up.railway.app/v1/health/live
```

If you get a response, the service might still be there!

---

## 💡 **Common Scenarios**

### **Scenario 1: Accidentally Deleted Service**
- **Solution:** Recreate service following Step 3
- **Database:** If database still exists, reconnect it
- **Data:** Should be preserved if database wasn't deleted

### **Scenario 2: Railway Account Issue**
- **Check:** Make sure you're logged into correct Railway account
- **Solution:** Try logging out and back in
- **Note:** You might have multiple Railway accounts

### **Scenario 3: Free Tier Limits**
- **Issue:** Railway free tier has limits (500 hours/month)
- **Solution:** Upgrade to paid plan or optimize usage
- **Check:** Railway dashboard will show usage warnings

### **Scenario 4: Payment Method Expired**
- **Issue:** If on paid plan, expired payment pauses services
- **Solution:** Update payment method in Railway settings
- **Location:** Settings → Billing → Update Payment Method

---

## 📞 **Railway Support**

If you can't find your service:

1. **Check Email:** Railway sends notifications about service changes
2. **Contact Support:** https://railway.app/help
3. **Discord:** Railway has active Discord support
4. **Twitter:** @Railway

---

## 🚀 **Quick Test**

Run this to check if your backend is still accessible:

```bash
# Test health endpoint
curl https://realco-production-staging.up.railway.app/v1/health/live

# If you get a response, it's still running!
# If you get an error, service is down
```

---

## 🔄 **If You Need to Redeploy**

From your local machine:

```bash
# Go to backend directory
cd backend

# Make sure dependencies are installed
npm install

# Test locally first
npm run dev

# If working, push to GitHub
git add .
git commit -m "Backend update"
git push origin main

# Railway will auto-deploy from GitHub
```

---

**What happened to your Railway service? Let me know what you see in your dashboard and I'll help you restore it!** 🔧
