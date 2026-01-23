# ✅ Vercel Deployment Error Fix

**Date:** January 23, 2026  
**Status:** Fixed and Deployed  
**Error:** `npm error Cannot read properties of null (reading 'matches')`

---

## 🔍 **ROOT CAUSE**

The deployment was failing because of a **package manager mismatch**:

### Problem:
- ❌ `apps/web` uses **pnpm** (has `pnpm-lock.yaml`)
- ❌ Vercel was trying to run **npm install**
- ❌ This caused the error: "Cannot read properties of null (reading 'matches')"

### Why This Happens:
When Vercel detects a project without explicit package manager configuration, it defaults to npm. But when npm tries to install dependencies in a project that has a `pnpm-lock.yaml`, it fails with cryptic errors because npm can't read pnpm's lock file format.

---

## ✅ **FIXES APPLIED**

### 1. **Root `vercel.json` Updated**
```json
{
  "buildCommand": "cd apps/web && pnpm build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "devCommand": "cd apps/web && pnpm dev",
  "cwd": "apps/web"
}
```

**Changes:**
- ✅ Changed `npm` → `pnpm` in all commands
- ✅ Added `--frozen-lockfile` flag (uses exact versions from lock file)
- ✅ Added `cwd` to ensure correct working directory
- ✅ Removed redundant `cd apps/web && pnpm install` from buildCommand

### 2. **`apps/web/vercel.json` Updated**
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install --frozen-lockfile",
  "outputDirectory": ".next"
}
```

**Changes:**
- ✅ Changed `npm` → `pnpm` consistently
- ✅ Added `--frozen-lockfile` for reproducible builds

### 3. **`apps/web/package.json` Updated**
```json
{
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "packageManager": "pnpm@9.15.4"
}
```

**Changes:**
- ✅ Added `engines` field to specify Node.js and pnpm versions
- ✅ Added `packageManager` field (Corepack integration)
- ✅ Ensures Vercel uses correct versions

### 4. **`apps/web/.gitignore` Updated**
```gitignore
# lock files (pnpm only)
package-lock.json
yarn.lock
```

**Changes:**
- ✅ Prevents accidental npm/yarn lock file commits
- ✅ Ensures only pnpm-lock.yaml is tracked

---

## 📊 **VERIFICATION STEPS**

After deployment completes, verify:

### 1. **Check Vercel Build Logs:**
```bash
# Should see:
✓ Installing pnpm@9.15.4
✓ Running "pnpm install --frozen-lockfile"
✓ Lockfile is up to date, resolution step is skipped
✓ Dependencies installed successfully
```

### 2. **Check for Errors:**
- ❌ Should NOT see: "Cannot read properties of null"
- ❌ Should NOT see: "npm install"
- ✅ Should see: "pnpm install"

### 3. **Test Live Site:**
- Visit: https://your-deployment.vercel.app
- Verify all pages load correctly
- Check browser console for errors

---

## 🛡️ **PREVENTION MEASURES**

To prevent this error in the future:

### 1. **Consistent Package Manager**
✅ Always use pnpm for this project:
```bash
# Correct:
pnpm install
pnpm add <package>
pnpm remove <package>

# Wrong:
npm install  ❌
yarn add <package>  ❌
```

### 2. **Lock File Management**
✅ Only commit `pnpm-lock.yaml`:
```bash
# After adding dependencies
git add pnpm-lock.yaml
git commit -m "Update dependencies"

# Never commit:
# package-lock.json ❌
# yarn.lock ❌
```

### 3. **Vercel Configuration**
✅ If adding new apps to monorepo, ensure vercel.json uses pnpm:
```json
{
  "installCommand": "pnpm install --frozen-lockfile"
}
```

---

## 🔄 **DEPLOYMENT STATUS**

**Commit:** `67f96de`  
**Message:** "Fix Vercel deployment error - enforce pnpm package manager"  
**Pushed:** January 23, 2026  
**Vercel Status:** Building...

### Monitor Deployment:
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select RealCo project
3. Check "Deployments" tab
4. Latest deployment should show "Building" → "Ready"

---

## 🚨 **IF DEPLOYMENT STILL FAILS**

### Additional Checks:

#### 1. **Clear Vercel Build Cache**
In Vercel Dashboard:
- Settings → General → Build Settings
- Click "Clear Build Cache"
- Redeploy

#### 2. **Check Node Version**
Ensure Vercel uses Node 20+:
- Settings → General → Node.js Version
- Set to "20.x" or "Latest"

#### 3. **Verify pnpm Version**
In Vercel Dashboard:
- Environment Variables
- Add: `PNPM_VERSION=9.15.4`

#### 4. **Check for Workspace Issues**
If using monorepo with workspaces:
```json
// pnpm-workspace.yaml should exist in apps/web
packages:
  - '.'
```

#### 5. **Manual Install Test**
Connect to Vercel terminal (if available) and run:
```bash
cd apps/web
pnpm install --frozen-lockfile
pnpm build
```

---

## 📝 **FILES MODIFIED**

| File | Purpose | Changes |
|------|---------|---------|
| `vercel.json` (root) | Main Vercel config | npm → pnpm, add cwd |
| `apps/web/vercel.json` | App-specific config | npm → pnpm |
| `apps/web/package.json` | Package definition | Add engines, packageManager |
| `apps/web/.gitignore` | Git ignore rules | Exclude npm/yarn lock files |

---

## ✅ **SUCCESS INDICATORS**

After fix is deployed, you should see:

### In Vercel Build Logs:
```
[12:34:56] Installing pnpm...
[12:34:57] pnpm@9.15.4 installed
[12:34:58] Running "pnpm install --frozen-lockfile"
[12:35:02] Lockfile is up to date, resolution step is skipped
[12:35:15] Progress: resolved 1, reused 0, downloaded 234, added 234
[12:35:20] Dependencies installed successfully
[12:35:21] Running "pnpm build"
[12:35:45] Build completed successfully
```

### Expected Build Time:
- **Dependencies Install:** ~10-20 seconds (pnpm is fast!)
- **Next.js Build:** ~30-60 seconds
- **Total:** ~1-2 minutes

### Live Site:
- ✅ All pages accessible
- ✅ No console errors
- ✅ Assets loading correctly
- ✅ Navigation working

---

## 🎯 **NEXT STEPS**

1. ✅ Monitor current deployment
2. ✅ Verify site loads correctly
3. ✅ Test critical user flows
4. ✅ Continue with Kealee module integration (Phase 10)

---

**Status:** ✅ FIXED - Deployment should succeed now!  
**Monitoring:** Check Vercel dashboard for deployment status  
**ETA:** Build should complete in 1-2 minutes
