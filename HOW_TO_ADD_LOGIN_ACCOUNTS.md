# 🔐 How to Add Login Accounts (Without Shell)

**Problem:** No Shell tab in Railway  
**Solution:** Use Railway's Database Query Console (SQL)

---

## ✅ **Step-by-Step Instructions:**

### **Step 1: Go to Railway Database**

1. Go to: https://railway.app/dashboard
2. Click on your **RealCo project**
3. **IMPORTANT:** Click on the **PostgreSQL database box** (NOT the backend service)
   - Look for a box labeled "Postgres" or "PostgreSQL"
   - It usually has a database icon

### **Step 2: Open Query/Data Tab**

After clicking the database, look for tabs:
- **Data** OR
- **Query** OR
- **Console**

Click on whichever tab shows an SQL query interface

### **Step 3: Copy the SQL Script**

Open the file: `CREATE_LOGIN_ACCOUNTS.sql`

Or copy this complete script:

```sql
-- Create Organization
INSERT INTO "Organization" (id, name, "createdAt", "updatedAt")
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'RealCo Demo Org',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Create Demo User (password: demo123)
INSERT INTO "User" (id, email, "passwordHash", "orgId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'demo@realco.com',
  '$2b$10$VeKsfHxec2SEeUGo2zgJfOVkyRvQeh/LucYOWSSW1uhWIto.Ua6C6',
  '00000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create Admin User (password: admin123)
INSERT INTO "User" (id, email, "passwordHash", "orgId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@realco.com',
  '$2b$10$hOXOxlZfnk0r7oeOIFZvi.UX37GApDA7JqoU05a3QFse3/RrsXKLK',
  '00000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create Investor User (password: investor123)
INSERT INTO "User" (id, email, "passwordHash", "orgId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'investor@realco.com',
  '$2b$10$08iHnmm7sGZ12pHIqPjQf.YYpA8pn0WlRhnEd858Ew..D8w6t5Y2.',
  '00000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
```

### **Step 4: Paste and Run**

1. **Paste** the entire SQL script into the query box
2. Click **"Run"** or **"Execute"** button
3. Wait for success message

### **Step 5: Verify Accounts Created**

Run this query to check:

```sql
SELECT email, "createdAt" FROM "User" ORDER BY "createdAt" DESC;
```

**Expected Result:**
```
email                 | createdAt
----------------------|------------------------
investor@realco.com   | 2026-01-23 03:45:00
admin@realco.com      | 2026-01-23 03:45:00
demo@realco.com       | 2026-01-23 03:45:00
```

### **Step 6: Test Login**

1. Go to: https://real-co-qa8k.vercel.app/login
2. Email: `demo@realco.com`
3. Password: `demo123`
4. Click "Login"
5. **Should work now!** ✅

---

## 🔑 **Login Credentials Created:**

| Email | Password | Use |
|-------|----------|-----|
| demo@realco.com | demo123 | General demo |
| admin@realco.com | admin123 | Admin testing |
| investor@realco.com | investor123 | Investor testing |

---

## 📍 **Where to Find Database in Railway:**

```
Railway Dashboard
└── Your Project (RealCo)
    └── PostgreSQL Box ← CLICK THIS ONE
        └── Tabs:
            ├── Overview
            ├── Metrics
            ├── Settings
            ├── Variables
            └── Data or Query ← USE THIS TAB
```

**Don't click the backend service!** Click the **database box** instead.

---

## 🎨 **Visual Guide:**

**Railway Project View shows:**
- 📦 Backend Service Box (your code)
- 🗄️ **PostgreSQL Box** ← **Click this one!**
- (Maybe other services)

**After clicking PostgreSQL:**
- You'll see database-specific tabs
- Look for "Data", "Query", or "Console"
- That's where you paste the SQL

---

## ⚠️ **Common Issues:**

### Issue: "Table User does not exist"
**Solution:** Run migrations first
```sql
-- Check if tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

If tables don't exist, your database hasn't been migrated. Contact me for migration instructions.

### Issue: "Syntax error near INSERT"
**Solution:** Make sure you copied the entire SQL script, including quotes around table names like `"User"`.

### Issue: Query runs but login still fails
**Solution:** 
1. Verify password hash is correct (copy exactly as shown)
2. Check there are no extra spaces
3. Verify email is lowercase: `demo@realco.com`

---

## 🔧 **Alternative: Railway CLI**

If SQL doesn't work, install Railway CLI:

```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run seed
cd backend
railway run npm run seed
```

---

## ✅ **Success Checklist:**

- [ ] Found PostgreSQL box in Railway
- [ ] Opened Data/Query tab
- [ ] Pasted complete SQL script
- [ ] Ran the script successfully
- [ ] Verified users with SELECT query
- [ ] Tested login at https://real-co-qa8k.vercel.app/login
- [ ] Successfully logged in with demo@realco.com / demo123

---

**You're creating login accounts directly in the database using SQL!** 🎯

No Shell needed - just paste SQL into Railway's database query console.
