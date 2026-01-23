# Landing Pages Guide - RealCo Platform

## 📄 Available Landing Pages

RealCo now has **THREE** landing pages optimized for different audiences:

### 1. **Investor-Focused Landing Page** (Current Default) ✅
**File:** `frontend/src/app/index-investor.tsx`

**Target Audience:** Individual investors looking to invest in real estate

**Key Features:**
- Side cards with stats (left: "Diversify Portfolio", right: "Track Returns")
- Investor-centric language ("Build Wealth", "Passive Income")
- Focus on benefits: low minimums, transparency, security
- Testimonials from actual investors
- Clear investment process (4 steps)

**Messaging Focus:**
- "Build wealth through real estate investment"
- "Earn passive income"
- "Start with $10,000"
- "Track your returns in real-time"

---

### 2. **Sponsor-Focused Landing Page**
**File:** `frontend/src/app/index-sponsor.tsx`

**Target Audience:** Real estate developers, sponsors, fund managers

**Key Features:**
- Professional platform capabilities
- Deal syndication and capital raising
- Construction management tools
- White-label options

**Messaging Focus:**
- "Syndicate real estate without the headache"
- "Raise capital faster"
- "Manage construction projects"
- "White-label platform"

---

### 3. **Original Landing Page** (Backup)
**File:** `frontend/src/app/pages-backup/index-original.tsx`

**Purpose:** Backup of the previous version

---

## 🔄 How to Switch Landing Pages

### Option 1: Edit `index.tsx` (Recommended)

Open `frontend/src/app/index.tsx` and change which component is returned:

```typescript
// USE INVESTOR-FOCUSED (Current Default)
export function IndexPage() {
  return <InvestorLandingPage />;
}

// OR USE SPONSOR-FOCUSED
export function IndexPage() {
  return <SponsorLandingPage />;
}
```

### Option 2: Environment Variable (Advanced)

1. Add to `frontend/.env`:
```env
VITE_LANDING_PAGE=investor  # or 'sponsor'
```

2. Update `index.tsx`:
```typescript
export function IndexPage() {
  const pageType = import.meta.env.VITE_LANDING_PAGE || 'investor';
  return pageType === 'sponsor' ? <SponsorLandingPage /> : <InvestorLandingPage />;
}
```

### Option 3: URL-Based Routing (Advanced)

Create separate routes:
- `/` → Investor landing page
- `/for-sponsors` → Sponsor landing page
- `/for-investors` → Investor landing page (explicit)

---

## 🎨 Design Differences

### Investor Page Layout:
```
┌─────────────────────────────────────────┐
│  [Side Card]  [Main Hero]  [Side Card]  │
│                                         │
│  Benefits Grid (6 cards)                │
│  How It Works (4 steps)                 │
│  Testimonials (3 investor stories)      │
│  Final CTA                              │
└─────────────────────────────────────────┘
```

**Side Cards:**
- **Left:** Diversify Portfolio (12-18% target returns)
- **Right:** Track Returns ($850M+ total invested)

### Sponsor Page Layout:
```
┌─────────────────────────────────────────┐
│         [Full-Width Hero]               │
│                                         │
│  Platform Features (6 cards)            │
│  How It Works for Sponsors (4 steps)    │
│  Final CTA                              │
└─────────────────────────────────────────┘
```

---

## 🔐 Fixing the Login Issue

### Problem:
Investor login (`investor@realco.com` / `investor123`) doesn't work because the **database hasn't been seeded on Railway yet**.

### Solution: Run Seed on Railway

#### Method 1: Railway CLI (Recommended)

```bash
# 1. Link to Railway project
cd backend
railway link

# 2. Select your project
# → Select "refreshing-reverence" or your project name

# 3. Select the Staging environment

# 4. Run the seed command on Railway
railway run npm run seed
```

**Expected Output:**
```
🌱 Starting database seed...

📦 Seeding organizations and users...
  ✅ Created organization: RealCo Demo Org
  ✅ Created demo user: demo@realco.com
  ✅ Created admin user: admin@realco.com
  ✅ Created investor user: investor@realco.com

💰 Seeding transaction limits...
  ✅ DAILY_DEPOSIT: $50,000
  ...

🏢 Seeding demo offering...
  ✅ Created offering: Sunset Vista Apartments - Series A
  ✅ Created escrow account: ESCROW-2026-001

📈 Seeding demo investment...
  ✅ Created investment: $50,000 by investor@realco.com

🏗️ Seeding demo development project...
  ✅ Created development project: Sunset Vista Apartments

✨ Seed completed successfully!
```

#### Method 2: Railway Dashboard + Connect

```bash
# 1. Get Railway Postgres connection string
railway variables get DATABASE_URL

# 2. Run seed locally with Railway DATABASE_URL
DATABASE_URL="postgresql://postgres:password@host:5432/railway" npm run seed
```

#### Method 3: Add Seed to Railway Build

Add to `backend/package.json`:
```json
{
  "scripts": {
    "railway:start": "npm run migrate:deploy && npm run seed && npm run start"
  }
}
```

Then update Railway start command to `npm run railway:start`.

---

## ✅ Test Accounts (After Seeding)

### **Investor Account**
```
Email:    investor@realco.com
Password: investor123
```
**What You'll See:**
- Active $50,000 investment
- Sunset Vista Apartments project
- Portfolio dashboard
- Construction progress

### **Admin Account**
```
Email:    admin@realco.com
Password: admin123
```
**What You'll See:**
- Full platform access
- All offerings and projects
- Financial reports
- User management

### **Demo Account**
```
Email:    demo@realco.com
Password: demo123
```
**What You'll See:**
- Limited access
- Public offerings
- General exploration

---

## 📊 Pre-Seeded Data

After running the seed, you'll have:

### Organization
- **Name:** RealCo Demo Org
- **ID:** `00000000-0000-0000-0000-000000000001`

### Offering
- **Name:** Sunset Vista Apartments - Series A
- **Type:** 506(c) Accredited Only
- **Status:** Active
- **Escrow:** ESCROW-2026-001

### Investment
- **Investor:** investor@realco.com
- **Amount:** $50,000
- **Ownership:** 5%
- **Returns:** 8% preferred
- **Status:** Active

### Development Project
- **Name:** Sunset Vista Apartments
- **Location:** Austin, TX
- **Type:** Multi-Family

---

## 🚀 Quick Deployment Checklist

### Before Deploying Landing Page Changes:

1. **Choose Your Landing Page**
   ```bash
   # Edit frontend/src/app/index.tsx
   # Choose InvestorLandingPage or SponsorLandingPage
   ```

2. **Test Locally**
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```

3. **Commit & Push**
   ```bash
   git add frontend/src/app/index*.tsx frontend/src/index.css
   git commit -m "Add investor and sponsor landing pages with page switcher"
   git push origin main
   ```

4. **Vercel Auto-Deploy**
   - Vercel will automatically deploy
   - Wait 1-2 minutes
   - Visit: https://real-co-qa8k.vercel.app

5. **Seed Database (If Not Done)**
   ```bash
   cd backend
   railway link
   railway run npm run seed
   ```

6. **Test Login**
   - Visit: https://real-co-qa8k.vercel.app/login
   - Use: `investor@realco.com` / `investor123`
   - Should redirect to dashboard

---

## 📱 Mobile Responsive

Both landing pages are fully responsive:

**Desktop (>968px):**
- Investor: 3-column layout (side card | hero | side card)
- Sponsor: Full-width hero with centered content

**Tablet (640px-968px):**
- Investor: Single column (side cards stack above/below hero)
- Sponsor: Adjusted padding and font sizes

**Mobile (<640px):**
- All sections stack vertically
- Optimized touch targets
- Readable font sizes

---

## 🎯 SEO & Marketing

Both pages include:
- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags (social sharing)
- ✅ Semantic HTML
- ✅ Clear value propositions
- ✅ Trust indicators
- ✅ Call-to-action buttons

**Investor Page Keywords:**
- Real estate investment
- Passive income
- Property investment platform
- Diversify portfolio
- Earn returns

**Sponsor Page Keywords:**
- Real estate syndication
- Capital raising platform
- Construction management
- White-label solution
- Fund manager tools

---

## 🔧 Troubleshooting

### Landing Page Not Updating
```bash
# Clear build cache
cd frontend
rm -rf dist .vite
npm run build
```

### Login Still Doesn't Work
```bash
# Verify seed ran successfully
railway run npx prisma db seed --schema=./prisma/schema.prisma

# Check if users exist
railway run npx prisma studio
# Open browser, check Users table
```

### Side Cards Not Showing
```bash
# Verify CSS was updated
git status
# Should show changes to frontend/src/index.css

# If not, re-apply CSS changes and commit
```

---

## 📚 File Structure

```
frontend/src/app/
├── index.tsx                    # Main entry (choose investor/sponsor)
├── index-investor.tsx           # Investor-focused landing page
├── index-sponsor.tsx            # Sponsor-focused landing page
├── pages-backup/
│   └── index-original.tsx       # Backup of original page
├── login.tsx                    # Login page
├── offerings.tsx                # Offerings list
└── __root.tsx                   # Root layout with nav
```

---

## 💡 Tips

### For A/B Testing:
1. Deploy investor version to main domain
2. Deploy sponsor version to `/for-sponsors` route
3. Track which converts better

### For Multiple Brands:
1. Use environment variables
2. Different landing pages per subdomain
3. White-label for each client

### For Performance:
1. Both pages use lazy-loaded images
2. CSS is minified in production
3. React components are code-split

---

## ✅ Summary

**Current Setup:**
- ✅ Investor landing page (default)
- ✅ Sponsor landing page (available)
- ✅ Original page (backed up)
- ✅ Easy switching mechanism
- ✅ Mobile responsive
- ✅ SEO optimized

**To Use:**
1. Edit `index.tsx` to choose page
2. Run seed on Railway for login
3. Deploy to Vercel
4. Test with `investor@realco.com` / `investor123`

---

**Need Help?** Check:
- `LOGIN_CREDENTIALS.md` - All test account info
- `DEPLOYMENT_SUMMARY.md` - Full platform overview
- `VERCEL_ENV_SETUP.md` - Environment configuration

*Last Updated: January 22, 2026*
