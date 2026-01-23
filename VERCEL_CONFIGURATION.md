# 🚀 Vercel Configuration Guide

## ✅ CORRECT VERCEL SETTINGS

### **1. Project Settings**

Go to: https://vercel.com/dashboard → Your Project → Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/web` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |
| **Development Command** | `npm run dev` |
| **Node.js Version** | 20.x (or 18.x) |

---

### **2. Environment Variables**

Go to: Settings → Environment Variables

**FOR DEMO MODE (No Backend) - CURRENTLY ACTIVE:**

```
NEXT_PUBLIC_DEMO_MODE=true
```

That's it! The app works with just this one variable (or even without it).

---

**FOR PRODUCTION (With Backend) - FUTURE:**

```bash
# Backend API
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
API_KEY=your-secret-api-key

# Stripe (Payment Processing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Plaid (Bank Linking)
NEXT_PUBLIC_PLAID_ENV=production
PLAID_CLIENT_ID=your-client-id
PLAID_SECRET=your-secret

# AWS S3 (File Uploads)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=realco-documents
AWS_REGION=us-east-1
```

---

## 🔧 STEP-BY-STEP FIX FOR BLANK PAGE

### **Step 1: Update Root Directory**

1. Go to: https://vercel.com/dashboard
2. Click your `RealCo` project
3. Click **Settings** → **General**
4. Find **Root Directory**
5. Click **Edit**
6. Enter: `apps/web`
7. Click **Save**

### **Step 2: Verify Build Settings**

Still in Settings → General:

- **Framework Preset:** Should say "Next.js"
- **Build Command:** Should be `npm run build` or empty (auto-detected)
- **Output Directory:** Should be `.next` or empty (auto-detected)
- **Install Command:** Should be `npm install` or empty (auto-detected)

### **Step 3: Add Environment Variable (Optional)**

Settings → Environment Variables:

1. Click **Add New**
2. **Name:** `NEXT_PUBLIC_DEMO_MODE`
3. **Value:** `true`
4. **Environments:** Production, Preview, Development (check all)
5. Click **Save**

### **Step 4: Trigger Redeploy**

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click the **"⋯"** menu (three dots)
4. Click **Redeploy**
5. Check **"Use existing Build Cache"** → UNCHECK IT
6. Click **Redeploy**

---

## 🎯 QUICK FIX (If Still Blank)

### **Option A: Delete & Reimport (Fastest)**

1. **Delete Project:**
   - Settings → General → Scroll to bottom
   - Click "Delete Project"
   - Type project name to confirm

2. **Reimport:**
   - Click "Add New Project"
   - Import from GitHub
   - Select your `RealCo` repository
   - **IMPORTANT:** Set Root Directory to `apps/web`
   - Click Deploy

### **Option B: Check Build Logs**

1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **"Building"** or **"View Build Logs"**
4. Look for errors (screenshot and share if you see any)

---

## 📋 TROUBLESHOOTING CHECKLIST

**If page is still blank, check:**

- [ ] Root Directory is set to `apps/web` (NOT empty, NOT `frontend`)
- [ ] Latest deployment shows "Ready" (green checkmark)
- [ ] Build logs show "Compiled successfully"
- [ ] No red errors in build logs
- [ ] Browser console (F12) has no errors
- [ ] Hard refresh (Ctrl + Shift + R)
- [ ] Try incognito/private window
- [ ] Try different browser

---

## 🔍 COMMON ISSUES

### **Issue 1: Wrong Root Directory**
**Symptom:** Build fails with "Cannot find package.json"  
**Fix:** Set Root Directory to `apps/web`

### **Issue 2: Building Old Frontend**
**Symptom:** Build succeeds but old Vite app loads  
**Fix:** Set Root Directory to `apps/web` (not `frontend`)

### **Issue 3: Turbopack Warning**
**Symptom:** Warning about multiple lockfiles  
**Fix:** This is just a warning, safe to ignore

### **Issue 4: TypeScript Errors**
**Symptom:** Build fails with type errors  
**Fix:** Already fixed in latest commit

### **Issue 5: Import Syntax Error**
**Symptom:** "Unexpected token" in imports  
**Fix:** Already fixed in latest commit

---

## 📊 WHAT SHOULD WORK

After proper configuration:

**Marketing Pages:**
- ✅ https://your-app.vercel.app/ (Homepage)
- ✅ https://your-app.vercel.app/investors
- ✅ https://your-app.vercel.app/sponsors
- ✅ https://your-app.vercel.app/providers
- ✅ https://your-app.vercel.app/login
- ✅ https://your-app.vercel.app/signup

**Demo Portals:**
- ✅ https://your-app.vercel.app/dashboard
- ✅ https://your-app.vercel.app/dashboard/investor
- ✅ https://your-app.vercel.app/dashboard/sponsor
- ✅ https://your-app.vercel.app/dashboard/provider

**Finance Features:**
- ✅ Bank account management (all roles)
- ✅ Transaction history (all roles)
- ✅ Fund investment (investor)
- ✅ Draw requests (sponsor)
- ✅ Invoice submission (provider)

---

## 🚨 IF NOTHING WORKS

**Share with me:**

1. **Screenshot of Vercel Settings:**
   - Settings → General → Root Directory section

2. **Screenshot of Latest Build Log:**
   - Deployments → Click latest → Build logs

3. **Screenshot of Browser Console:**
   - Press F12 → Console tab → Any red errors

4. **Your Vercel Project URL:**
   - So I can check what's deployed

---

## ✅ FINAL CHECKLIST

Before asking for help, verify:

1. [ ] Root Directory = `apps/web` (Settings → General)
2. [ ] Latest commit pushed to GitHub (`c784d56` or newer)
3. [ ] Vercel deployment shows "Ready"
4. [ ] Hard refreshed browser (Ctrl + Shift + R)
5. [ ] Tried incognito window
6. [ ] Checked browser console for errors (F12)

---

## 📞 NEED HELP?

**Provide:**
- Vercel project URL
- Screenshot of Settings → General → Root Directory
- Screenshot of latest deployment status
- Any error messages from browser console

---

**Last Updated:** January 23, 2026  
**Status:** Demo mode fully functional, no backend required
