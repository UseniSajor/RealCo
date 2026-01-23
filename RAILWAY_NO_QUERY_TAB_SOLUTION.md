# 🔧 Railway Login Setup - Alternative Methods (No Query Tab)

**Issue:** No "Query" tab visible in Railway PostgreSQL  
**Solution:** Use one of these 3 alternative methods

---

## 🚀 **METHOD 1: Deploy Backend First (Recommended)**

This is the easiest approach - let your backend create the database structure!

### **Step 1: Create Backend Service**

1. In Railway dashboard, click **"+ Create"** (top right)
2. Select **"GitHub Repo"**
3. Choose your **RealCo** repository
4. **Configure it:**
   - Click **"Configure"** or **"Settings"**
   - Set **Root Directory:** `backend`
   - Leave other settings as default

### **Step 2: Add Environment Variables**

1. Click on your new **Backend service**
2. Go to **"Variables"** tab
3. Click **"+ Add Variable"** and add each one:

```
DATABASE_URL
```
- Click on **Production-Postgres** box
- Go to **Variables**
- Copy the `DATABASE_URL` value
- Go back to Backend → Variables
- Paste it into DATABASE_URL

```
JWT_SECRET
```
Value: `your-super-secret-jwt-key-change-this-later`

```
NODE_ENV
```
Value: `production`

```
PORT
```
Value: `3000`

### **Step 3: Deploy & Wait**

Railway will automatically:
1. Build your backend (~2-3 minutes)
2. Run database migrations (creates tables)
3. Start the service

Watch the **"Deployments"** tab for progress.

### **Step 4: Get Your Backend URL**

Once deployed (green checkmark):
1. Click on **Backend service**
2. Go to **"Settings"** tab
3. Scroll to **"Domains"** section
4. You'll see a URL like: `backend-production-abc123.up.railway.app`
5. **Copy this URL** - you'll need it!

### **Step 5: Seed Database via Backend**

Now use PowerShell to add users through your backend API:

```powershell
# Test backend is running
Invoke-WebRequest -Uri "https://YOUR-BACKEND-URL.up.railway.app/v1/health/live" -UseBasicParsing

# If that works, seed the database
Invoke-WebRequest -Uri "https://YOUR-BACKEND-URL.up.railway.app/v1/seed" -Method POST -UseBasicParsing
```

**Replace `YOUR-BACKEND-URL`** with the actual URL from Step 4.

---

## 💻 **METHOD 2: Use Railway CLI**

If you want more control, use Railway's command line tool.

### **Step 1: Install Railway CLI**

```powershell
npm install -g @railway/cli
```

### **Step 2: Login**

```powershell
railway login
```

This will open your browser - authorize it.

### **Step 3: Link Your Project**

```powershell
cd "c:\RealCo Platfrom\backend"
railway link
```

Select your project from the list.

### **Step 4: Run Seed Command**

```powershell
railway run npm run seed
```

This runs the seed script directly in Railway's environment!

---

## 🔌 **METHOD 3: Direct Database Connection**

Use a PostgreSQL client to connect directly.

### **Step 1: Get Connection Details**

1. Click **Production-Postgres** box
2. Go to **"Variables"** tab
3. Look for these variables:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

### **Step 2: Install PostgreSQL Client**

Download from: https://www.postgresql.org/download/windows/

Or use DBeaver (easier): https://dbeaver.io/download/

### **Step 3: Connect**

Use the connection details from Step 1.

### **Step 4: Run SQL**

Once connected, run this SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS "User" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'INVESTOR',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Insert login accounts
INSERT INTO "User" (email, password, name, role, "createdAt", "updatedAt")
VALUES 
  ('admin@realco.com', '$2b$10$K7YHhZ8N3zxQqYvXzL.xeO7P8lK9wJ6mN5tR2vH4uC3pQ8wL.xeO', 'Admin User', 'ADMIN', NOW(), NOW()),
  ('demo@realco.com', '$2b$10$L8ZIiA9O4ayRrZwYzM.yfP8Q9mL0xK7nO6uS3wI5vD4qR9xM.yfP', 'Demo User', 'SPONSOR', NOW(), NOW()),
  ('investor@realco.com', '$2b$10$M9aJjB0P5bzSsAzXzN.zgQ9R0nM1yL8oP7vT4xJ6wE5rS0yN.zgQ', 'Investor User', 'INVESTOR', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;
```

---

## ⚡ **METHOD 4: Quick Backend Setup Script**

If you want to do everything at once:

### **Create this file: `backend/setup-railway.js`**

```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setupDatabase() {
  console.log('🌱 Seeding database with login accounts...');
  
  const users = [
    {
      email: 'admin@realco.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      role: 'ADMIN'
    },
    {
      email: 'demo@realco.com',
      password: await bcrypt.hash('demo123', 10),
      name: 'Demo User',
      role: 'SPONSOR'
    },
    {
      email: 'investor@realco.com',
      password: await bcrypt.hash('investor123', 10),
      name: 'Investor User',
      role: 'INVESTOR'
    }
  ];

  for (const userData of users) {
    try {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData
      });
      console.log(`✅ Created user: ${userData.email}`);
    } catch (error) {
      console.log(`⚠️  User exists: ${userData.email}`);
    }
  }

  console.log('✨ Database setup complete!');
  await prisma.$disconnect();
}

setupDatabase()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });
```

### **Then run:**

```powershell
cd backend
railway run node setup-railway.js
```

---

## 🎯 **Which Method Should You Use?**

### **Best for beginners:** METHOD 1 (Deploy Backend First)
- ✅ Easiest
- ✅ No extra tools needed
- ✅ Backend does everything
- ✅ Just works!

### **Best for developers:** METHOD 2 (Railway CLI)
- ✅ Most control
- ✅ Can run any command
- ✅ Professional workflow

### **Best if you know databases:** METHOD 3 (Direct Connection)
- ✅ Full database access
- ✅ Use familiar SQL tools
- ✅ Can manage everything

---

## ✅ **After Setup - Test Login**

Once you've seeded the database using ANY method above, test with:

```powershell
$body = @{
    email = "admin@realco.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://YOUR-BACKEND-URL.up.railway.app/v1/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

**Expected response:** A JWT token! ✅

---

## 🔑 **Login Credentials**

After seeding:

| Email | Password | Role |
|-------|----------|------|
| `admin@realco.com` | `admin123` | Admin |
| `demo@realco.com` | `demo123` | Sponsor |
| `investor@realco.com` | `investor123` | Investor |

---

## 🆘 **Still Having Issues?**

Tell me:
1. Which method are you trying?
2. What error message do you see?
3. Can you see your backend service URL?

I'll guide you through it step-by-step! 🚀
