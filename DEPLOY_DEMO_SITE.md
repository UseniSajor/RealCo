# Deploy Demo Site to Vercel - Step by Step Guide

**Date:** January 23, 2026  
**Purpose:** Deploy the `demo-version` branch as a separate demo site for sales and marketing  
**Branch:** `demo-version` (frozen demo with 4 accounts)  
**Main Site:** `main` branch (continues development)

---

## ✅ **WHAT'S IN THE DEMO VERSION**

The demo-version branch includes:
- ✅ **62 pages** fully functional
- ✅ **4 demo accounts** (sponsor, investor, fund manager, provider)
- ✅ **Module 1 (NEW!):** Property Search, Lead Management, Market Research
- ✅ All existing features (deal pipeline, underwriting, analytics, etc.)
- ✅ Client-side demo authentication (localStorage)
- ✅ 100+ mock data entries

---

## 🚀 **OPTION 1: CREATE NEW VERCEL PROJECT (RECOMMENDED)**

This creates a completely separate demo site that won't interfere with your main production site.

### **Step 1: Open Vercel Dashboard**
1. Go to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**

### **Step 2: Import Repository**
1. Select your GitHub repository: **`UseniSajor/RealCo`**
2. If not visible, click **"Adjust GitHub App Permissions"** and grant access

### **Step 3: Configure Project Settings**

**Project Name:**
```
realco-demo
```

**Framework Preset:**
```
Next.js
```

**Root Directory:**
```
apps/web
```

**Build Command:**
```
pnpm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```
pnpm install
```

### **Step 4: Configure Git Branch**

**IMPORTANT - Git Configuration:**
```
Production Branch: demo-version
```

This ensures the demo site deploys from the demo-version branch, not main.

### **Step 5: Environment Variables**

Add these environment variables (demo mode doesn't need payment credentials):

```bash
# Required
NEXT_PUBLIC_API_URL=https://realco-api.up.railway.app
NODE_ENV=production

# Optional (for future)
NEXT_PUBLIC_PLAID_ENV=sandbox
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### **Step 6: Deploy**
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your demo site will be live at: **`realco-demo.vercel.app`**

### **Step 7: Custom Domain (Optional)**
1. Go to project **Settings** → **Domains**
2. Add custom domain like: `demo.realco.com`
3. Update DNS records as instructed by Vercel

---

## 🚀 **OPTION 2: ADD DEMO AS BRANCH DEPLOYMENT (SIMPLER)**

This adds the demo as a preview deployment in your existing Vercel project.

### **Step 1: Open Existing Project**
1. Go to: https://vercel.com/dashboard
2. Select your existing **RealCo** project

### **Step 2: Access Settings**
1. Click **Settings** tab
2. Navigate to **Git** section

### **Step 3: Configure Branch Deployments**

**Git Integration:**
```
Connected Branch: demo-version
```

Vercel will automatically:
- Deploy `main` to production: `realco.vercel.app`
- Deploy `demo-version` to preview: `realco-demo-version.vercel.app`

### **Step 4: Trigger Deployment**
1. Go to **Deployments** tab
2. Click **"..."** → **"Redeploy"**
3. Select branch: **demo-version**

### **Step 5: Get Demo URL**
1. Once deployed, find the demo deployment
2. URL format: `realco-git-demo-version-username.vercel.app`
3. Bookmark this URL for your sales team

---

## 🎯 **RECOMMENDED APPROACH**

### **Best Practice: Two Separate Projects**

**Project 1: RealCo Production**
- Branch: `main`
- URL: `realco.vercel.app` or `app.realco.com`
- Purpose: Production site with real auth
- Updates: Continuous development

**Project 2: RealCo Demo**
- Branch: `demo-version`
- URL: `realco-demo.vercel.app` or `demo.realco.com`
- Purpose: Sales demos and marketing
- Updates: Only when you update demo-version branch

**Benefits:**
- ✅ Clear separation
- ✅ Demo stays stable
- ✅ Production can evolve independently
- ✅ Different environment variables
- ✅ Better analytics tracking

---

## 📋 **VERCEL CLI METHOD (FASTEST)**

If you have Vercel CLI installed, you can deploy from command line:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Make sure you're on demo-version branch
git checkout demo-version

# Navigate to frontend
cd apps/web

# Deploy to Vercel
vercel --prod

# Follow prompts:
# - Link to existing project? No (for new project)
# - Project name: realco-demo
# - Directory: . (current)
```

---

## 🔄 **UPDATING THE DEMO SITE**

When you want to update the demo with new features:

```bash
# 1. Merge main into demo-version
git checkout demo-version
git merge main

# 2. Test locally
cd apps/web
pnpm run build

# 3. Push to trigger Vercel deployment
git push origin demo-version

# 4. Vercel auto-deploys in 2-3 minutes
```

---

## 🎨 **CUSTOMIZING DEMO SITE**

### **Add Demo Banner**

To make it clear users are on the demo site, you can add a banner.

**File:** `apps/web/src/components/demo-banner.tsx`

```typescript
export function DemoBanner() {
  return (
    <div className="bg-[#E07A47] text-white py-2 px-4 text-center font-bold">
      🎯 DEMO SITE - Using demo accounts | 
      <a href="https://realco.com/contact" className="underline ml-2">
        Contact Sales for Real Account
      </a>
    </div>
  )
}
```

Then add to layout on demo-version branch only.

### **Demo-Specific Environment Variables**

```bash
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SITE_NAME="RealCo Demo"
NEXT_PUBLIC_DEMO_ACCOUNTS=sponsor@realco.com,investor@realco.com,fundmanager@realco.com,provider@realco.com
```

---

## 📊 **VERIFICATION CHECKLIST**

After deployment, verify these features work:

### **Demo Authentication**
- [ ] Can login with sponsor@realco.com / Demo123!
- [ ] Can login with investor@realco.com / Demo123!
- [ ] Can login with fundmanager@realco.com / Demo123!
- [ ] Can login with provider@realco.com / Demo123!

### **New Property Search Features**
- [ ] Property Search page loads (`/dashboard/sponsor/property-search`)
- [ ] Can filter properties by type
- [ ] Can filter by price range
- [ ] Search functionality works
- [ ] All 6 properties display correctly
- [ ] View toggle (List/Map) works

### **Lead Management**
- [ ] Leads page loads (`/dashboard/sponsor/leads`)
- [ ] All 6 leads display
- [ ] Lead scoring visible (Hot/Warm/Cold)
- [ ] Filters work (status, score)
- [ ] Metrics dashboard shows correct numbers

### **Market Research**
- [ ] Market Research page loads (`/dashboard/sponsor/market-research`)
- [ ] Can switch between markets (Austin, Dallas, Houston)
- [ ] Can switch between asset types
- [ ] Metrics display correctly
- [ ] Market insights show

### **Navigation**
- [ ] Sponsor dashboard has "Deal Sourcing" section
- [ ] Quick Actions links work
- [ ] All pages accessible
- [ ] Back buttons work

---

## 🌐 **SHARE WITH SALES TEAM**

Once deployed, share these details:

### **Demo Site Access**

**URL:** `https://realco-demo.vercel.app` (or your custom domain)

**Demo Accounts:**

| Role | Email | Password | Features |
|------|-------|----------|----------|
| Sponsor | sponsor@realco.com | Demo123! | Property search, leads, deals, underwriting |
| Investor | investor@realco.com | Demo123! | Portfolio, investments, distributions, taxes |
| Fund Manager | fundmanager@realco.com | Demo123! | Asset operations, reporting, analytics |
| Provider | provider@realco.com | Demo123! | Vendor portal, invoices, work orders |

### **Demo Walkthrough Script**

1. **Start:** Login as sponsor@realco.com
2. **Property Search:** Show multi-source property discovery
3. **Lead Management:** Show CRM and lead tracking
4. **Market Research:** Show market analysis tools
5. **Deal Pipeline:** Show existing deals
6. **Underwriting:** Show financial modeling
7. **Switch Roles:** Show investor or fund manager views

---

## 🎯 **DEPLOYMENT STATUS**

**Current Status:**
- ✅ Demo branch created: `demo-version`
- ✅ Tagged as: `v1.0-demo`
- ✅ Pushed to GitHub
- ✅ Contains all 62 pages including Module 1
- ⏳ Pending: Vercel deployment (follow steps above)

**Next Steps:**
1. Follow Option 1 or Option 2 above to deploy
2. Test all features
3. Share URL with sales team
4. Update this doc with final URL

---

## 📞 **SUPPORT & MAINTENANCE**

### **If Demo Breaks:**
```bash
# Demo version is frozen, so it shouldn't break
# But if needed, you can always redeploy
vercel --prod --force
```

### **If You Need to Roll Back:**
```bash
# The v1.0-demo tag is permanent
git checkout v1.0-demo
git checkout -b demo-version-rollback
git push origin demo-version-rollback --force
```

### **If You Want to Update Demo:**
```bash
# Merge latest main into demo
git checkout demo-version
git merge main
git push origin demo-version
# Vercel auto-deploys
```

---

## 🎉 **SUMMARY**

**You now have:**
- ✅ Complete demo version with all features
- ✅ Property search, lead management, market research (NEW!)
- ✅ 4 demo accounts ready for presentations
- ✅ Git branch and tag for stability
- ✅ Ready to deploy to Vercel

**Choose your deployment method:**
- **Recommended:** Option 1 (New Project) for clean separation
- **Quick:** Option 2 (Branch Deployment) for simplicity
- **Fastest:** Vercel CLI (for developers)

---

**Once deployed, your sales team will have a live demo site that showcases the complete RealCo platform! 🚀**
