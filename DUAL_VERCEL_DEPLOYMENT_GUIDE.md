# 🚀 Dual Vercel Deployment Guide

## Your Two Vercel Deployments

You have **two separate Vercel deployments** for your RealCo demo:

### 🌐 Deployment 1: real-3f1zykxtq
**URL:** https://real-3f1zykxtq-ottoway-5abe7e76.vercel.app/dashboard/sponsor

### 🌐 Deployment 2: real-co-qa8k
**URL:** https://real-co-qa8k-ix87326m9-ottoway-5abe7e76.vercel.app/dashboard/sponsor

---

## 💡 Recommended Setup

Since you have TWO deployments, I recommend using them strategically:

### Option A: Keep Both for Different Purposes

**Deployment 1 (real-3f1zykxtq)** → **Enhanced Demo**
- Deploy `demo-version` branch here
- $95M+ portfolio, 6 properties
- Full professional details
- For: Investor presentations, sales demos

**Deployment 2 (real-co-qa8k)** → **Original v3.1**
- Keep `main` branch here
- Original design and data
- For: Development, testing, backup

### Option B: Use One Primary Deployment

**Choose your main URL** and apply enhancements there
- Deploy enhanced demo to primary URL
- Archive or delete secondary URL

---

## 🎯 How to Deploy Enhanced Demo to Specific URL

### Step 1: Identify Which Vercel Project is Which

Go to https://vercel.com and check:
1. Click on each project
2. Check which branch each is connected to
3. Check which GitHub repo/branch it deploys from

### Step 2: Deploy Enhanced to Chosen URL

**Method 1: Via Vercel Dashboard (Easiest)**
```
1. Go to Vercel dashboard
2. Select the project you want to enhance
3. Settings → Git
4. Change "Production Branch" to: demo-version
5. Save
6. Trigger new deployment
```

**Method 2: Via Git Push**
```bash
# This deploys to whatever Vercel project is watching 'main'
git checkout main
git merge demo-version
git push origin main
```

**Method 3: Create New Branch for Specific Deployment**
```bash
# Create a branch specifically for one Vercel deployment
git checkout demo-version
git checkout -b production-enhanced
git push origin production-enhanced

# Then in Vercel:
# Settings → Git → Production Branch: production-enhanced
```

---

## 📊 Current Branch Status

### ✅ main (Currently Deployed)
- **Content:** Original v3.1
- **Demo Data:** 2 bank accounts, 5 transactions
- **Status:** Restored and pushed
- **Deploys to:** Whichever Vercel project watches `main`

### ✅ demo-version (Enhanced - Ready to Deploy)
- **Content:** Enhanced demo v2.0
- **Demo Data:** 3 bank accounts, 15 transactions, 6 properties
- **Status:** Ready and waiting
- **Deploys to:** Can deploy to any Vercel project

### ✅ v3.1-master-original (Backup)
- **Content:** Original v3.1 backup
- **Status:** Permanent archive
- **Purpose:** Safety backup

---

## 🎨 Recommended Configuration

### For Maximum Flexibility:

**URL 1: https://real-3f1zykxtq-ottoway-5abe7e76.vercel.app**
```
Purpose: Sales & Marketing Demo
Branch: demo-version
Data: Enhanced ($95M+, 6 properties)
Use For: Investor presentations, sales calls
```

**URL 2: https://real-co-qa8k-ix87326m9-ottoway-5abe7e76.vercel.app**
```
Purpose: Development/Staging
Branch: main
Data: Original v3.1
Use For: Testing, development, backup
```

---

## 🚀 Quick Deploy Commands

### Deploy Enhanced to URL 1 (real-3f1zykxtq)

**In Vercel Dashboard:**
1. Find "real-3f1zykxtq" project
2. Settings → Git
3. Production Branch: `demo-version`
4. Save and redeploy

### Deploy Enhanced to URL 2 (real-co-qa8k)

**In Vercel Dashboard:**
1. Find "real-co-qa8k" project
2. Settings → Git
3. Production Branch: `demo-version`
4. Save and redeploy

### Or Deploy via Git:

```bash
# This will deploy to whichever Vercel watches 'main'
git checkout main
git merge demo-version
git push origin main
```

---

## 📝 Step-by-Step: Deploy Enhanced to Both URLs

### Option 1: Via Vercel Dashboard (Recommended)

**For First URL:**
1. Go to https://vercel.com
2. Find "real-3f1zykxtq" project (or similar name)
3. Click Settings
4. Click Git section
5. Under "Production Branch", change to: `demo-version`
6. Click Save
7. Go to Deployments tab
8. Click "..." menu on latest deployment
9. Click "Redeploy"
10. Wait 2-3 minutes

**For Second URL:**
- Repeat same steps for "real-co-qa8k" project
- OR keep it on `main` for comparison

### Option 2: Merge to Main (Simpler)

```bash
# This deploys enhanced to whatever watches 'main'
git checkout main
git merge demo-version
git push origin main

# Vercel auto-deploys in 2-3 minutes
```

---

## 🧪 Testing After Deployment

### Test Enhanced Features:

**Visit URL and verify:**
- ✅ Login as `investor@realco.com`
- ✅ See **6 properties** (not 3)
- ✅ Portfolio shows **~$776K**
- ✅ **15 transactions** visible
- ✅ Switch to `sponsor@realco.com`
- ✅ See **4 projects**
- ✅ Budget categories visible in projects
- ✅ **10 draw requests** shown
- ✅ Switch to `provider@realco.com`
- ✅ See **8 invoices** with vendor details

### Test Original v3.1:

**Visit URL and verify:**
- Login as any demo account
- See 2-3 properties
- ~5 transactions
- Basic demo data

---

## 💡 Which URL Should You Use?

### For Your Question About Which to Enhance:

**I recommend:**
1. **Enhance BOTH URLs** with the demo-version data
2. **OR** enhance your PRIMARY URL (the one you share most)
3. **Keep one** as backup with v3.1

### Primary URL is Likely:
**https://real-co-qa8k-ix87326m9-ottoway-5abe7e76.vercel.app**
- This matches your earlier question
- Longer URL suggests it's the main project

### To Apply Enhancements NOW:

**Quick Method - Merge to Main:**
```bash
git checkout main
git merge demo-version
git push origin main
```

This will update whichever Vercel project is watching `main` branch.

**Then check Vercel dashboard to see which project is deploying.**

---

## 🎯 My Recommendation

### Best Setup for You:

1. **Merge enhanced demo to main** (it's ready!)
   ```bash
   git checkout main
   git merge demo-version
   git push origin main
   ```

2. **Both URLs will deploy** the enhanced version (if both watch main)

3. **Result:**
   - Both URLs show: 6 properties, $95M+, professional details
   - Sales-ready demos everywhere
   - Original v3.1 safe in `v3.1-master-original` branch

### Why This is Best:
- ✅ Enhanced demo is way better for sales
- ✅ Original v3.1 safely backed up
- ✅ Consistent experience across URLs
- ✅ Can always revert to v3.1 if needed

---

## 🔄 Revert if Needed

If you want to go back to v3.1 later:

```bash
git checkout main
git reset --hard v3.1-master-original
git push origin main --force
```

Your original v3.1 is permanently saved in `v3.1-master-original` branch.

---

## 📊 Summary Table

| URL | Current | Recommended | Purpose |
|-----|---------|-------------|---------|
| real-3f1zykxtq | v3.1 | Enhanced | Sales demos |
| real-co-qa8k | v3.1 | Enhanced | Main demo |
| v3.1 backup | N/A | Archived | Safety backup |

---

## ✅ Recommended Action NOW

**Since your enhanced demo is ready and better:**

```bash
# Deploy enhanced to main (updates both URLs if both watch main)
git checkout main
git merge demo-version
git push origin main

# Wait 2-3 minutes
# Test both URLs
# Enjoy your $95M+ demo! 🎉
```

---

## 🆘 Need Help?

**Check which Vercel project uses which branch:**
1. Go to https://vercel.com
2. Click each project
3. Settings → Git
4. See "Production Branch"

**Want to keep URLs separate:**
- Deploy `demo-version` to one
- Keep `main` (v3.1) on the other

**Want both enhanced:**
- Merge demo-version to main
- Both will deploy enhanced

---

## 📞 Quick Decision Guide

**Question:** Which URL should get enhanced demo?

**Answer:**
- **Both!** Enhanced demo is better for all purposes
- Merge to main → Both URLs get it
- Original v3.1 safe in backup branch

**Worried about losing v3.1?**
- Don't be! It's saved in `v3.1-master-original`
- Can revert anytime in 30 seconds

**Ready to enhance?**
```bash
git checkout main
git merge demo-version
git push origin main
```

---

**Your enhanced demo with $95M+ portfolio is ready to deploy to both URLs!** 🚀

**Recommendation: Merge to main and let both URLs showcase your impressive demo.** ✨

---

*Both URLs will impress investors with professional-grade data!*
*Original v3.1 safely backed up in v3.1-master-original branch.*
