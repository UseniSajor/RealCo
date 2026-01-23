# RealCo Platform - Login Credentials & Access Guide

## 🌐 **Live Platform URLs**

### **Frontend (Vercel)**
- **Production:** https://real-co-qa8k.vercel.app
- **Preview:** https://real-co-qa8k-[branch]-ottoway-5abe7e76.vercel.app

### **Backend API (Railway)**
- **Staging:** https://realco-production-staging.up.railway.app
- **Health Check:** https://realco-production-staging.up.railway.app/health
- **API Base:** https://realco-production-staging.up.railway.app/api/v1

---

## 🔐 **Test Accounts**

### **Admin Account**
```
Email:    admin@realco.com
Password: admin123
Role:     Platform Administrator
```
**Access:**
- Full platform administration
- Create/manage offerings
- View all projects and investments
- Financial reporting
- User management

---

### **Investor Account**
```
Email:    investor@realco.com
Password: investor123
Role:     Active Investor
```
**Access:**
- Personal investor dashboard
- Active investment: $50,000 in "Sunset Vista Apartments"
- Construction progress tracking
- Financial statements
- Distribution history
- Tax documents

**Current Investment:**
- Offering: Sunset Vista Apartments - Series A
- Amount: $50,000
- Ownership: 5%
- Equity Shares: 5,000
- Preferred Return: 8% annually
- Status: Active

---

### **Demo Account**
```
Email:    demo@realco.com
Password: demo123
Role:     Demo User
```
**Access:**
- General platform exploration
- View public offerings
- Sample dashboards
- Limited features

---

## 📊 **Pre-Seeded Data**

The database includes demo data for testing:

### **Organization**
- **Name:** RealCo Demo Org
- **ID:** `00000000-0000-0000-0000-000000000001`

### **Active Offering**
- **Name:** Sunset Vista Apartments - Series A
- **Type:** 506(c) (Accredited Investors Only)
- **Status:** Active
- **Escrow Account:** `ESCROW-2026-001`

### **Development Project**
- **Name:** Sunset Vista Apartments
- **Address:** 123 Main Street, Austin, TX 78701
- **Type:** Multi-Family
- **Status:** In Development

### **Transaction Limits** (Regulatory Compliance)
| Limit Type | Amount | Purpose |
|------------|--------|---------|
| Daily Deposit | $50,000 | Per-user daily maximum |
| Monthly Deposit | $500,000 | Per-user monthly maximum |
| Annual Investment (Non-Accredited Low) | $2,200 | SEC Reg CF limit |
| Annual Investment (Non-Accredited) | $124,000 | 10% income/net worth rule |
| Accredited Investor | $100,000,000 | No regulatory limit |
| Per Transaction | $250,000 | Fraud prevention |

---

## 🚀 **How to Login**

### **Step 1: Visit the Platform**
Open your browser and go to:
```
https://real-co-qa8k.vercel.app
```

### **Step 2: Click Login**
Click the **"Login"** button in the top-right corner of the navigation bar.

### **Step 3: Enter Credentials**
Enter one of the test accounts:
- **Email:** `investor@realco.com`
- **Password:** `investor123`

### **Step 4: Explore**
After login, you'll see:
- **Dashboard:** Your investment portfolio overview
- **Offerings:** Browse available investment opportunities
- **Projects:** Track construction progress
- **Financials:** View transactions and distributions

---

## 🛠️ **Developer Setup**

### **Run Database Seed**
To populate the database with test data:

```bash
# Navigate to backend
cd backend

# Ensure DATABASE_URL is set in .env
# Example: DATABASE_URL=postgresql://user:pass@host:5432/realco

# Run migrations
npx prisma migrate deploy

# Seed the database
npm run seed
```

### **Create Additional Users**
Use the API to create new users:

```bash
# Create a new user via API
POST https://realco-production-staging.up.railway.app/api/v1/auth/register
Content-Type: application/json

{
  "email": "newuser@realco.com",
  "password": "securepassword123",
  "orgId": "00000000-0000-0000-0000-000000000001"
}
```

### **Reset Passwords**
If you need to reset a password:

```bash
# Connect to Railway Postgres
railway connect postgres

# Update password (bcrypt hash for "newpassword123")
UPDATE users 
SET password_hash = '$2b$10$...' 
WHERE email = 'investor@realco.com';
```

---

## 📱 **Testing User Flows**

### **Investor Journey**
1. **Login** as `investor@realco.com`
2. **View Dashboard** - See your $50K investment
3. **Check Offerings** - Browse active opportunities
4. **Track Construction** - View project progress, photos, timelines
5. **Review Financials** - Check distributions, transaction history

### **Admin Journey**
1. **Login** as `admin@realco.com`
2. **Manage Offerings** - Create/edit investment opportunities
3. **Oversee Projects** - Monitor all construction projects
4. **Process Distributions** - Calculate and distribute returns
5. **Generate Reports** - Financial statements, tax forms

---

## 🔒 **Security Notes**

### **Development/Staging Only**
These credentials are for **development and staging environments only**. 

### **Production Security**
For production:
- ✅ Use strong, unique passwords (minimum 12 characters)
- ✅ Enable two-factor authentication (2FA)
- ✅ Implement IP whitelisting for admin accounts
- ✅ Regular security audits
- ✅ Password rotation policy
- ✅ Session timeout enforcement

### **JWT Secrets**
Ensure these are set in Railway environment:
```bash
JWT_SECRET=<your-secret-from-earlier>
ENCRYPTION_KEY=<your-secret-from-earlier>
```

---

## 🆘 **Troubleshooting**

### **Login Fails**
1. **Check Backend:** Visit https://realco-production-staging.up.railway.app/health
2. **Verify CORS:** Ensure `CORS_ORIGIN` includes Vercel domain
3. **Check Console:** Press F12 and look for errors
4. **Verify Database:** Ensure seed script ran successfully

### **"Database is empty"**
Run the seed script:
```bash
cd backend
npm run seed
```

### **"API Not Found"**
1. Verify `VITE_API_URL` is set in Vercel
2. Check Railway backend is deployed and active
3. Test API directly: `curl https://realco-production-staging.up.railway.app/health`

---

## 📚 **API Endpoints**

### **Authentication**
```
POST /api/v1/auth/login          # Login
POST /api/v1/auth/register       # Register new user
POST /api/v1/auth/logout         # Logout
GET  /api/v1/auth/me             # Get current user
```

### **Offerings**
```
GET  /api/v1/offerings           # List offerings
GET  /api/v1/offerings/:id       # Get offering details
POST /api/v1/offerings           # Create offering (admin)
```

### **Projects**
```
GET  /api/v1/projects            # List projects
GET  /api/v1/projects/:id        # Get project details
GET  /api/v1/projects/:id/tasks  # Get project tasks
GET  /api/v1/projects/:id/daily-logs  # Get daily logs
```

### **Investments**
```
GET  /api/v1/investments         # List user investments
GET  /api/v1/investments/:id     # Get investment details
POST /api/v1/investments         # Create investment
```

### **Health**
```
GET  /health                     # Basic health check
GET  /api/v1/health              # Detailed health check
GET  /api/v1/ready               # Readiness probe
GET  /api/v1/version             # API version info
```

---

## 📧 **Support**

For issues or questions:
- **Email:** support@realco.com (fictional)
- **Documentation:** Check `/docs` folder
- **API Docs:** https://realco-production-staging.up.railway.app/api/v1/version

---

## ✅ **Quick Reference**

**Login URL:** https://real-co-qa8k.vercel.app/login

**Test Accounts:**
- 👤 Admin: `admin@realco.com` / `admin123`
- 💼 Investor: `investor@realco.com` / `investor123`
- 🎯 Demo: `demo@realco.com` / `demo123`

**API Health:** https://realco-production-staging.up.railway.app/health
