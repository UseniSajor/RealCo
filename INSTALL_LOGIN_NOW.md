# 🚀 Install Login Credentials - 3 Simple Commands

## Run These Commands in PowerShell (One by One)

### **Step 1: Link Your Railway Project**

```powershell
cd "c:\RealCo Platfrom\backend"
railway link
```

You'll see a list of projects. **Select the one for RealCo** (use arrow keys, press Enter).

I can see you have these projects:
- graceful-surprise
- refreshing-reverence
- miraculous-eagerness

Choose the one that's your RealCo backend.

---

### **Step 2: Run Database Migrations**

```powershell
railway run npx prisma migrate deploy
```

This creates the database tables.

---

### **Step 3: Seed Login Accounts**

```powershell
railway run npm run seed
```

This installs these 3 login accounts:

| Email | Password | Role |
|-------|----------|------|
| `admin@realco.com` | `admin123` | Admin |
| `demo@realco.com` | `demo123` | Sponsor |
| `investor@realco.com` | `investor123` | Investor |

---

## ✅ **Test Your Login**

After Step 3 completes, test with:

```powershell
# Get your backend URL first
railway status

# Then test login (replace YOUR-URL)
$body = @{
    email = "admin@realco.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://YOUR-URL.up.railway.app/v1/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

---

## 🎯 **Quick Version (Copy & Paste All)**

```powershell
cd "c:\RealCo Platfrom\backend"
railway link
railway run npx prisma migrate deploy
railway run npm run seed
railway status
```

Then test login as shown above!

---

## 🆘 **If You Get Errors**

**Error: "No DATABASE_URL found"**
- Go to Railway dashboard
- Click on your backend service
- Go to Variables tab
- Make sure `DATABASE_URL` is set (should reference PostgreSQL)

**Error: "Cannot find module"**
- Run: `railway run npm install` first

**Error: "P1001: Can't reach database"**
- Make sure PostgreSQL service is running in Railway
- Check that backend service is linked to PostgreSQL

---

Let me know when you run Step 3 and I'll help you test the login! 🚀
