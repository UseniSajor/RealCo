# Frontend Troubleshooting Guide

## What You Should See

### **Working Site:**
- ✅ Purple gradient background
- ✅ White navigation bar at top with "RealCo Platform" logo
- ✅ Clickable "Home", "Offerings", "Login" buttons
- ✅ Beautiful hero section with feature cards
- ✅ Smooth animations and hover effects

### **What Login Does:**
- Login is an authentication page where users enter email/password
- It connects to your Railway backend API
- After successful login, users can access protected features
- For now, you'd need to create a user in the database first

---

## If You See Minimal/Broken Design

### **Quick Check:**

1. **Open Browser Console (F12)**
   - Press F12 in your browser
   - Click **Console** tab
   - Look for red errors
   - Common errors:
     - ❌ "Failed to load module" → Build issue
     - ❌ "VITE_API_URL is not defined" → Environment variable missing
     - ❌ "Network error" → Backend connection issue

2. **Check Vercel Deployment:**
   - Go to: https://vercel.com/dashboard
   - Find your project
   - Check latest deployment status:
     - ✅ **Ready** = Deployed successfully
     - ❌ **Error** = Build failed
     - ⏳ **Building** = Still deploying

3. **View Build Logs:**
   - Click on the deployment
   - Check **Build Logs** for errors
   - Check **Function Logs** for runtime errors

---

## Common Issues & Fixes

### **Issue 1: Environment Variable Missing**

**Symptoms:** App crashes immediately, console shows "VITE_API_URL required"

**Fix:**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://realco-production-staging.up.railway.app/api/v1`
3. Check: Production, Preview, Development
4. Redeploy

### **Issue 2: Old Deployment Cached**

**Symptoms:** Changes not showing up

**Fix:**
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Try incognito/private window

### **Issue 3: Build Not Triggered**

**Symptoms:** Still showing old version

**Fix:**
1. Vercel Dashboard → Deployments
2. Click **⋯** on latest → **Redeploy**
3. Wait 1-2 minutes for completion

### **Issue 4: JavaScript Not Loading**

**Symptoms:** Plain HTML, no styling, no interactivity

**Fix:**
1. Check Vercel build logs for errors
2. Ensure `vercel.json` has correct rewrites
3. Check if `dist/` folder was created in build

---

## Test These URLs

1. **Frontend Home:**
   - https://real-co-qa8k.vercel.app
   - Should show: Beautiful hero page with purple gradient

2. **Frontend Login:**
   - https://real-co-qa8k.vercel.app/login
   - Should show: White login form with email/password fields

3. **Backend Health:**
   - https://realco-production-staging.up.railway.app/health
   - Should show: `{"ok":true,"name":"realco-backend"}`

---

## What to Send Me

If still broken, send:

1. **Screenshot** of what you see
2. **Console errors** (F12 → Console tab)
3. **Vercel deployment status** (Ready/Error/Building)
4. **What happens when you click links** (nothing? error? redirect?)

Then I can give you the exact fix!
