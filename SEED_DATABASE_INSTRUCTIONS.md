# 🌱 Seed Railway Database - Step by Step

**Issue:** Login failing with "Login failed. Please check your credentials."  
**Cause:** Database not seeded with test accounts  
**Solution:** Run seed command in Railway

---

## 🚀 Quick Fix - Seed Database

### **Option 1: Railway Dashboard (Easiest)**

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app/dashboard
   - Login to your account

2. **Select Your Backend Service:**
   - Click on your project
   - Click on the backend service (should be named something like "realco-production-staging")

3. **Open Shell Tab:**
   - Click on the "Shell" tab at the top

4. **Run Seed Command:**
   ```bash
   npm run seed
   ```

5. **Wait for Completion:**
   You should see output like:
   ```
   🌱 Starting database seed...
   📦 Seeding organizations and users...
     ✅ Created organization: RealCo Demo Org
     ✅ Created demo user: demo@realco.com
     ✅ Created admin user: admin@realco.com
     ✅ Created investor user: investor@realco.com
   ...
   ✅ Seeding complete!
   ```

6. **Test Login:**
   - Go back to: https://real-co-qa8k.vercel.app/login
   - Email: `demo@realco.com`
   - Password: `demo123`
   - Should work now! ✅

---

### **Option 2: Railway CLI** (If you have it installed)

```bash
# Login to Railway
railway login

# Link to your project (if not linked)
railway link

# Run seed command
railway run npm run seed
```

---

## 🔍 Verify Database is Seeded

### **Check in Railway Dashboard:**

1. Go to your backend service in Railway
2. Click on "PostgreSQL" database
3. Click on "Query" tab
4. Run this query:

```sql
SELECT email FROM "User";
```

**Expected Result:**
```
email
-----------------------
demo@realco.com
admin@realco.com
investor@realco.com
```

If you see these 3 emails, database is seeded! ✅

---

## 🔑 Test Accounts (After Seeding)

### Demo Account
- **Email:** demo@realco.com
- **Password:** demo123

### Admin Account
- **Email:** admin@realco.com
- **Password:** admin123

### Investor Account
- **Email:** investor@realco.com
- **Password:** investor123

---

## ⚠️ Troubleshooting

### Issue: "npm: command not found" in Railway Shell

**Solution:** Your Railway service might not be set up correctly.

1. Check that `nixpacks.toml` or `Dockerfile` exists in backend folder
2. Make sure Railway detected it as a Node.js app
3. Try redeploying the service

### Issue: "Cannot connect to database"

**Solution:** Check DATABASE_URL environment variable

1. Go to Railway Dashboard → Your Service → Variables
2. Verify `DATABASE_URL` is set
3. Should look like: `postgresql://postgres:password@host:port/database`

### Issue: Seed runs but login still fails

**Solution:** Check password is EXACTLY `demo123`

1. Passwords are case-sensitive
2. No spaces before/after
3. Try copy-pasting: `demo123`

### Issue: "prisma command not found"

**Solution:** Install dependencies first

```bash
npm install
npm run seed
```

---

## 📊 What Seed Creates

The seed script creates:

### Organizations:
- RealCo Demo Org

### Users (3):
- demo@realco.com (password: demo123)
- admin@realco.com (password: admin123)
- investor@realco.com (password: investor123)

### Transaction Limits:
- Daily deposit limit: $50,000
- Monthly deposit limit: $500,000
- Single transaction limit: $250,000
- Annual deposit limit: $5,000,000

### Offerings:
- Luxury Apartment Complex
- Mixed-Use Development

### Bank Accounts:
- Demo bank accounts with validation

### Projects & Tasks:
- Sample construction projects
- Sample tasks

---

## 🎯 After Seeding

1. ✅ Go to: https://real-co-qa8k.vercel.app/login
2. ✅ Email: `demo@realco.com`
3. ✅ Password: `demo123`
4. ✅ Click "Login"
5. ✅ Should successfully login and redirect to homepage!

---

## 📝 Seed File Location

The seed file is at: `backend/prisma/seed.ts`

It contains all the test data that gets inserted into the database.

---

## 🔄 Re-seed Database (If Needed)

If you need to start fresh:

```bash
# In Railway Shell
npm run prisma:reset  # This will DROP all data and re-seed
```

⚠️ **Warning:** This deletes ALL data in the database!

---

## ✅ Success Indicators

**You'll know seeding worked when:**
- ✅ Seed command completes without errors
- ✅ You see "✅ Seeding complete!" message
- ✅ Login with demo@realco.com works
- ✅ You can access the dashboard after login

---

## 🆘 Still Not Working?

If login still fails after seeding:

1. **Check Railway Logs:**
   - Railway Dashboard → Service → Logs
   - Look for login attempt errors

2. **Verify Backend is Running:**
   ```bash
   curl https://realco-production-staging.up.railway.app/v1/health/live
   ```
   Should return: `{"status":"ok",...}`

3. **Check Browser Console:**
   - Press F12 in browser
   - Go to Console tab
   - Look for red error messages

4. **Verify Environment Variables:**
   - JWT_SECRET is set
   - DATABASE_URL is correct
   - CORS_ORIGIN includes your frontend URL

---

**Next Step:** Go to Railway Dashboard and run `npm run seed` in the Shell tab! 🚀
