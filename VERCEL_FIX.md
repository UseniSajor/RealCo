# 🔧 Vercel Build Error - SOLUTION

## ❌ Current Error
```
Type error: Cannot find name 'RoleTabs'.
./src/app/investors/page.tsx:28:8
```

## 🔍 Root Cause
Vercel is building from the **wrong directory**. Your project is now a monorepo with the Next.js app in `apps/web/`, but Vercel is trying to build from the root or the old `frontend/` directory.

---

## ✅ SOLUTION: Update Vercel Project Settings

### **Option 1: Via Vercel Dashboard (RECOMMENDED)**

1. **Go to your Vercel project:**
   - Visit: https://vercel.com/dashboard
   - Click on your `RealCo` project

2. **Open Settings:**
   - Click **Settings** tab
   - Go to **General** section

3. **Update Root Directory:**
   - Find "Root Directory" setting
   - Click **Edit**
   - Enter: `apps/web`
   - Click **Save**

4. **Trigger Redeploy:**
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Click **Redeploy** button

5. **Build should now succeed!** ✅

---

### **Option 2: Via Vercel CLI**

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Deploy with correct settings
vercel --prod --cwd apps/web
```

---

### **Option 3: Delete and Reimport Project**

If settings don't work:

1. **In Vercel Dashboard:**
   - Go to your project
   - Settings → General → **Delete Project**
   - Confirm deletion

2. **Re-import from GitHub:**
   - Click **Add New Project**
   - Select your GitHub repository
   - **IMPORTANT:** Set Framework Preset to **Next.js**
   - **IMPORTANT:** Set Root Directory to `apps/web`
   - Click **Deploy**

---

## 📋 Correct Vercel Configuration

Your `vercel.json` should look like this (already updated):

```json
{
  "buildCommand": "cd apps/web && pnpm build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "devCommand": "cd apps/web && pnpm dev"
}
```

---

## 🔍 Verify Configuration

After updating, your Vercel project settings should show:

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Root Directory | `apps/web` |
| Build Command | `pnpm build` (or `cd apps/web && pnpm build`) |
| Output Directory | `.next` |
| Install Command | `pnpm install` |
| Node Version | 18.x or 20.x |

---

## 🧪 Test Local Build

Before deploying, test locally to ensure everything works:

```bash
cd apps/web
pnpm install
pnpm build
```

If this succeeds locally, it will succeed on Vercel once the root directory is set correctly.

---

## 📂 Project Structure

Your current monorepo structure:

```
RealCo Platfrom/
├── apps/
│   └── web/              ← NEW Next.js app (Vercel should build THIS)
│       ├── src/
│       │   └── app/
│       │       ├── investors/page.tsx
│       │       ├── sponsors/page.tsx
│       │       └── providers/page.tsx
│       ├── package.json
│       └── vercel.json
├── frontend/             ← OLD app (Vercel should IGNORE this)
│   └── vercel.json
├── backend/
├── vercel.json           ← Root config
└── package.json
```

**Vercel MUST be pointed to `apps/web/`**

---

## ✅ Expected Result

Once configured correctly, you should see:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Build completed successfully!
```

---

## 🚀 Quick Fix Steps

**The fastest way to fix this NOW:**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → General → Root Directory → Edit
4. Enter: `apps/web`
5. Save
6. Go to Deployments → Latest → Redeploy
7. Done! ✅

---

## 📞 Still Having Issues?

If you're still getting errors:

1. **Check the build logs** - Look for the exact path being built
2. **Verify Node version** - Should be 18.x or 20.x
3. **Check pnpm version** - Should be 8.x or 9.x
4. **Clear Vercel cache** - In deployment, click "..." → "Redeploy" → Check "Clear cache"

---

## 🎯 Summary

**Problem:** Vercel building from wrong directory  
**Solution:** Set Root Directory to `apps/web` in Vercel dashboard  
**Time to fix:** 2 minutes  

Your code is correct! Just need to point Vercel to the right folder! 🎉
