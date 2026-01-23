# 🚀 Deploy Demo Site NOW - Quick Start

**Status:** ✅ Demo branch ready with all property search tools  
**Branch:** `demo-version` (currently active)  
**Features:** 62 pages including Property Search, Lead Management, Market Research

---

## 🎯 **FASTEST METHOD: Vercel CLI (5 Minutes)**

You have Vercel CLI installed! Here's how to deploy:

### **Step 1: Login to Vercel**

```bash
vercel login
```

- Opens browser for authentication
- Login with your Vercel account
- Returns to terminal when authenticated

### **Step 2: Navigate to Frontend**

```bash
cd apps/web
```

### **Step 3: Deploy Demo Site**

```bash
# Deploy to production (creates new project)
vercel --prod

# You'll be prompted:
# 1. "Set up and deploy?" → Yes
# 2. "Which scope?" → Select your account
# 3. "Link to existing project?" → No
# 4. "What's your project's name?" → realco-demo
# 5. "In which directory is your code located?" → ./
# 6. "Want to modify settings?" → No

# Deploy starts immediately!
```

### **Step 4: Get Your Demo URL**

After 2-3 minutes, you'll see:

```
✅ Production: https://realco-demo.vercel.app [2m 15s]
```

**That's your demo site URL!** Bookmark it and share with your sales team.

---

## 🌐 **ALTERNATIVE: Vercel Dashboard (10 Minutes)**

If you prefer using the web interface:

### **Step 1: Open Vercel Dashboard**

1. Go to: https://vercel.com/dashboard
2. Login with your account

### **Step 2: Create New Project**

1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Select: **`UseniSajor/RealCo`**

### **Step 3: Configure Project**

**Basic Settings:**
- **Project Name:** `realco-demo`
- **Framework:** Next.js (auto-detected)
- **Root Directory:** `apps/web`

**Build Settings:**
- **Build Command:** `pnpm run build`
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `pnpm install`

**Git Configuration (IMPORTANT!):**
- **Production Branch:** `demo-version` ← Must select this!

### **Step 4: Environment Variables (Optional for Demo)**

Add only if needed:

```bash
NEXT_PUBLIC_API_URL=https://realco-api.up.railway.app
NODE_ENV=production
```

Demo mode works without payment credentials (Plaid/Stripe).

### **Step 5: Deploy**

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Visit your new demo site!

---

## ✅ **VERIFY DEPLOYMENT**

Once deployed, test these features:

### **1. Login Works**
- ✅ sponsor@realco.com / Demo123!
- ✅ investor@realco.com / Demo123!
- ✅ fundmanager@realco.com / Demo123!
- ✅ provider@realco.com / Demo123!

### **2. Property Search Works** (NEW!)
- ✅ Navigate to: `/dashboard/sponsor/property-search`
- ✅ See 6 properties
- ✅ Filters work (type, price, search)
- ✅ View toggle works (List/Map)

### **3. Lead Management Works** (NEW!)
- ✅ Navigate to: `/dashboard/sponsor/leads`
- ✅ See 6 leads with scoring
- ✅ Metrics dashboard shows
- ✅ Filters work

### **4. Market Research Works** (NEW!)
- ✅ Navigate to: `/dashboard/sponsor/market-research`
- ✅ Switch markets (Austin, Dallas, Houston)
- ✅ Switch asset types
- ✅ See market data and insights

---

## 📊 **WHAT'S DEPLOYED**

Your demo site includes:

### **All Pages (62 Total):**
- ✅ 4 role-specific dashboards
- ✅ Landing and marketing pages
- ✅ Authentication pages
- ✅ Property Search (NEW!)
- ✅ Lead Management (NEW!)
- ✅ Market Research (NEW!)
- ✅ Deal Pipeline
- ✅ Underwriting
- ✅ Portfolio Analytics
- ✅ Tax Center
- ✅ Banking & Transactions
- ✅ And 50+ more pages!

### **Demo Data:**
- ✅ 6 properties (multi-source)
- ✅ 6 leads (all stages)
- ✅ 12 market datasets
- ✅ 100+ mock data points
- ✅ 4 demo user accounts

---

## 🎨 **CUSTOM DOMAIN (OPTIONAL)**

Want `demo.realco.com` instead of `realco-demo.vercel.app`?

### **Step 1: Add Domain in Vercel**

1. Go to project **Settings** → **Domains**
2. Click **"Add"**
3. Enter: `demo.realco.com`

### **Step 2: Update DNS**

Add these records to your domain registrar:

```
Type: CNAME
Name: demo
Value: cname.vercel-dns.com
```

### **Step 3: Wait for Propagation**

- Takes 1-60 minutes
- Vercel auto-issues SSL certificate
- Your demo is live at `demo.realco.com`!

---

## 🔄 **UPDATING THE DEMO**

When you want to add new features to the demo:

```bash
# 1. Switch to demo branch
git checkout demo-version

# 2. Merge latest from main
git merge main

# 3. Push to GitHub
git push origin demo-version

# 4. Vercel auto-deploys in 2-3 minutes!
```

---

## 📧 **SHARE WITH SALES TEAM**

Send this to your sales/marketing team:

---

**Subject: RealCo Demo Site is Live! 🚀**

Hey team,

Our new demo site is live with all the latest features!

**Demo Site URL:** https://realco-demo.vercel.app

**Demo Accounts:**

| Role | Email | Password |
|------|-------|----------|
| Sponsor | sponsor@realco.com | Demo123! |
| Investor | investor@realco.com | Demo123! |
| Fund Manager | fundmanager@realco.com | Demo123! |
| Provider | provider@realco.com | Demo123! |

**NEW Features to Show:**
1. **Property Search** - Multi-source property discovery (LoopNet, CoStar, etc.)
2. **Lead Management** - Full CRM with lead scoring and tracking
3. **Market Research** - Real-time market data and insights

**Demo Flow:**
1. Login as Sponsor
2. Show Property Search → Lead Management → Deal Pipeline
3. Switch to Investor role to show portfolio view
4. Highlight the professional design and complete workflow

Let me know if you need any help or want to schedule a walkthrough!

---

## 🎯 **DEPLOYMENT CHECKLIST**

- [x] Demo branch created (`demo-version`)
- [x] Property search tools confirmed (3 pages)
- [x] All 62 pages included
- [x] Demo accounts configured (4 roles)
- [x] Build tested and passing
- [x] Tagged as `v1.0-demo`
- [ ] Vercel deployment executed ← **DO THIS NOW**
- [ ] Demo URL verified
- [ ] All features tested
- [ ] Sales team notified

---

## 🚀 **EXECUTE NOW**

**If using CLI, run:**

```bash
vercel login
cd apps/web
vercel --prod
```

**If using Dashboard:**
1. Go to https://vercel.com/dashboard
2. Follow steps above
3. Deploy!

**Your demo will be live in 3 minutes! 🎉**

---

## 💡 **TIPS FOR DEMOS**

### **Best Demo Path:**
1. Start at homepage (show landing page)
2. Login as sponsor@realco.com
3. Show Property Search → Filter properties → Save favorite
4. Show Lead Management → Explain scoring → Track activity
5. Show Market Research → Compare markets → Show insights
6. Show Deal Pipeline → Explain workflow
7. Quick tour of Underwriting tool
8. Switch to Investor role → Show portfolio
9. End with "This is just a demo - production has even more!"

### **Key Talking Points:**
- ✅ "End-to-end platform for real estate syndication"
- ✅ "From property discovery to asset management"
- ✅ "Regulatory compliant and investor-ready"
- ✅ "4 role-based dashboards for complete workflow"
- ✅ "New: Property search from multiple sources"
- ✅ "New: CRM for lead tracking and conversion"
- ✅ "New: Real-time market research and analytics"

---

**Ready to deploy? Let's do it! 🚀**
