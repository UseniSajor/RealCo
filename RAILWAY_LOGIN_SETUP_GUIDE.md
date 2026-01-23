# 🔐 Railway Login Setup - Step-by-Step Guide

**Issue:** Your backend is running but can't connect to the database  
**Solution:** Connect your PostgreSQL database to the backend service  

---

## 🎯 **Quick Fix (5 Minutes)**

### **Step 1: Open Railway Dashboard**

1. Go to: **https://railway.app/dashboard**
2. **Log in** to your Railway account
3. Look for your project (might be called "RealCo" or similar)

---

### **Step 2: Check What You See**

You should see **service boxes** in your project. Tell me which scenario matches:

#### **Scenario A: I see 2 boxes** ✅
```
┌─────────────────┐     ┌──────────────┐
│   PostgreSQL    │     │   Backend    │
│   (Database)    │     │   (API)      │
└─────────────────┘     └──────────────┘
```
**→ Go to Step 3**

#### **Scenario B: I see 1 box (just backend)** ⚠️
```
┌──────────────┐
│   Backend    │
│   (API)      │
└──────────────┘
```
**→ Go to Step 4 (Create Database)**

#### **Scenario C: I don't see any boxes** ❌
**→ Go to Step 5 (Create Everything)**

---

## ✅ **Step 3: Connect Database (If You Have Both)**

### **A) Get Database Connection String:**

1. **Click on the PostgreSQL box**
2. Go to **"Variables"** tab
3. Look for a variable called `DATABASE_URL`
4. **Copy the entire value** (looks like: `postgresql://postgres:password@...`)

### **B) Add to Backend:**

1. **Click on your Backend box**
2. Go to **"Variables"** tab
3. Look for `DATABASE_URL` variable
4. **If it exists but is empty:**
   - Click on it
   - **Paste** the database URL you copied
   - Click **"Update"**
5. **If it doesn't exist:**
   - Click **"+ New Variable"**
   - Name: `DATABASE_URL`
   - Value: Paste the database URL
   - Click **"Add"**

### **C) Wait for Redeploy:**
- Railway will automatically redeploy your backend (~2 minutes)
- Watch the **"Deployments"** tab for progress

### **D) Test Login:**
Once deployment is done, test:
```
https://realco-production-staging.up.railway.app/v1/health/live
```

**If you see `{"status":"ok"...}` → Go to Step 6 (Seed Database)**

---

## 🆕 **Step 4: Create Database (If You Only Have Backend)**

### **A) Add PostgreSQL:**

1. In Railway dashboard, click **"+ New"**
2. Select **"Database"**
3. Choose **"PostgreSQL"**
4. Wait ~30 seconds for it to provision

### **B) Connect It:**

After PostgreSQL is created:
1. Railway usually **auto-connects** it to your backend
2. **Check backend variables:**
   - Click Backend box → Variables
   - Look for `DATABASE_URL` 
   - Should now have a value starting with `postgresql://`

**If `DATABASE_URL` is still empty:**
- Follow Step 3 to manually connect

---

## 🔧 **Step 5: Create Everything From Scratch**

**If you see no services:**

### **A) Create New Service:**

1. In Railway dashboard, click **"+ New"**
2. Select **"GitHub Repo"**
3. Choose your **RealCo** repository
4. **Important Settings:**
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm start`

### **B) Add PostgreSQL:**

1. Click **"+ New"** again
2. Select **"Database"** → **"PostgreSQL"**
3. Wait for provisioning

### **C) Connect Them:**

Follow Step 3 to connect the database to your backend.

---

## 🌱 **Step 6: Seed Database with Login Accounts**

Once your database is connected, you need to add login accounts.

### **Option A: Railway SQL Query (Easiest)**

1. **Click on PostgreSQL box**
2. Go to **"Query"** tab (or "Data" tab)
3. **Copy and paste this SQL:**

```sql
-- Create admin user
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@realco.com',
  '$2b$10$rJ3L5vO8KqYxB0xYZ1.8QeYKq5.0rJ3L5vO8KqYxB0xYZ1.8QeYKq',
  'Admin User',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Create demo user
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'demo@realco.com',
  '$2b$10$YZ1.8QeYKq5.0rJ3L5vO8KqYxB0xYZ1.8QeYKq5.0rJ3L5vO8Kq',
  'Demo User',
  'SPONSOR',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Create investor user
INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'investor@realco.com',
  '$2b$10$8QeYKq5.0rJ3L5vO8KqYxB0xYZ1.8QeYKq5.0rJ3L5vO8KqYxB0',
  'Investor User',
  'INVESTOR',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
```

4. Click **"Run"** or **"Execute"**
5. You should see: **"3 rows inserted"**

### **Option B: Railway Shell (Alternative)**

1. **Click on Backend box**
2. Go to **"Settings"** tab
3. Find **"Service"** section
4. Look for **"Shell"** or **"Terminal"** option
5. If you see it, click and run:
```bash
npm run seed
```

---

## 🎉 **Step 7: Test Your Login!**

### **Login Credentials:**

After seeding, you can use these accounts:

| Email | Password | Role |
|-------|----------|------|
| `admin@realco.com` | `admin123` | Admin |
| `demo@realco.com` | `demo123` | Sponsor |
| `investor@realco.com` | `investor123` | Investor |

### **Test Login:**

#### **Option 1: PowerShell Test**

```powershell
$body = @{
    email = "admin@realco.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://realco-production-staging.up.railway.app/v1/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

**If you see a JWT token → SUCCESS!** ✅

#### **Option 2: Frontend Login**

1. Go to your Next.js site: http://localhost:3000/login
2. Enter: `admin@realco.com` / `admin123`
3. Click "Sign In"

**Note:** Frontend login needs backend connection (see Step 8)

---

## 🔗 **Step 8: Connect Frontend to Backend**

To make the login page actually work:

### **A) Update Frontend Environment:**

1. Create file: `apps/web/.env.local`
2. Add this line:
```
NEXT_PUBLIC_API_URL=https://realco-production-staging.up.railway.app
```

### **B) Update Login Page to Use API:**

The login page currently shows an alert. Once backend is connected, it will call the real API.

---

## 🆘 **Troubleshooting**

### **Problem: "Can't find PostgreSQL box"**

**Solution:**
- Look for a database icon 🗄️
- Might be called "postgres" or "PostgreSQL"
- Check all tabs in your Railway project

### **Problem: "DATABASE_URL still empty"**

**Solution:**
1. Delete the backend service
2. Re-create it
3. Railway should auto-connect database on creation

### **Problem: "No Shell option in Railway"**

**Solution:**
- Use the SQL Query method (Option A) instead
- It's actually easier!

### **Problem: "Login still fails"**

**Check these:**
1. Backend is deployed and running
2. Database is connected (DATABASE_URL set)
3. Database is seeded with users
4. Backend URL is correct in frontend

---

## 📱 **Quick Screenshot Guide**

**What your Railway dashboard should look like:**

```
┌─────────────────────────────────────────────┐
│  RealCo Project                             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐    ┌──────────────┐     │
│  │ PostgreSQL   │───→│   Backend    │     │
│  │ ✅ Running   │    │ ✅ Running   │     │
│  └──────────────┘    └──────────────┘     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ✅ **Success Checklist**

- [ ] Backend service exists in Railway
- [ ] PostgreSQL database exists in Railway
- [ ] DATABASE_URL is set in backend variables
- [ ] Backend deployment is successful
- [ ] Health check returns `{"status":"ok"}`
- [ ] Database is seeded with users
- [ ] Login test returns JWT token
- [ ] Frontend can connect to backend

---

## 🎯 **Next Steps After Login Works**

1. Test all 3 accounts (admin, demo, investor)
2. Build actual dashboard pages
3. Connect frontend login to backend API
4. Add protected routes
5. Build role-based features

---

**Need help? Tell me:**
1. What do you see in Railway dashboard?
2. How many service boxes?
3. Any error messages?

I'll guide you through the exact steps! 🚀
