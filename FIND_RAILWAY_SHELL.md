# 🔍 How to Find Railway Shell

**Issue:** Can't find the Shell/Terminal in Railway Dashboard  
**Solution:** Step-by-step guide with screenshots locations

---

## 🎯 **Finding the Shell in Railway Dashboard:**

### **Step 1: Login to Railway**
1. Go to: https://railway.app/dashboard
2. Login with your account

### **Step 2: Select Your Project**
1. You should see a list of projects
2. Click on your RealCo project

### **Step 3: Select Backend Service**
1. You'll see multiple services (boxes) in your project
2. Look for the backend service - likely named:
   - `realco-production-staging` OR
   - `backend` OR
   - Whatever you named your backend service

3. **Click on this backend service box**

### **Step 4: Find the Shell Tab**
Once you click on the service, you'll see tabs at the top:
- **Overview** (or Deployments)
- **Metrics**
- **Settings**
- **Variables**
- **Logs**
- **Shell** ← **THIS IS WHAT YOU NEED!**

**Click on "Shell"** - This opens a terminal/command line interface

---

## 🖥️ **What the Shell Looks Like:**

When you click on "Shell", you'll see:
```
~ $ ▊ (blinking cursor)
```

This is where you type commands!

---

## ✅ **Run Seed Command in Shell:**

Once you're in the Shell tab, type:

```bash
npm run seed
```

Press Enter and wait for:
```
🌱 Starting database seed...
📦 Seeding organizations and users...
  ✅ Created demo user: demo@realco.com
  ✅ Created admin user: admin@realco.com
  ✅ Created investor user: investor@realco.com
...
✅ Seeding complete!
```

---

## 🚫 **What You're Looking At (Wrong Section):**

**"Config-as-code"** section is for:
- Creating railway.json or railway.toml files
- Managing build configurations
- Setting deployment settings
- This is **NOT** where you run commands!

---

## 📍 **Visual Guide:**

```
Railway Dashboard
└── Your Project (RealCo)
    └── Backend Service (click this box)
        └── Tabs at top:
            ├── Overview
            ├── Metrics
            ├── Settings
            ├── Variables
            ├── Logs
            └── Shell ← CLICK HERE!
                └── Terminal appears
                    └── Type: npm run seed
```

---

## 🔍 **Alternative: Look for Terminal Icon**

Some Railway versions show a **terminal/console icon** (looks like `>_`) instead of "Shell" text.

Click that icon to open the shell.

---

## 🆘 **Still Can't Find Shell Tab?**

### **Option 1: Check Railway Version**
Railway occasionally changes UI. The Shell might be under:
- "Terminal" instead of "Shell"
- A dropdown menu
- Under "Tools" or "Actions"

### **Option 2: Use Railway CLI** (Alternative method)

If you can't find the Shell tab, use Railway CLI from your local terminal:

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login:**
```bash
railway login
```

3. **Link to your project:**
```bash
railway link
```
(Select your project from the list)

4. **Run seed command:**
```bash
cd backend
railway run npm run seed
```

---

## 📊 **What Tab Names Look Like:**

Depending on Railway's UI version, tabs might be:
- Text labels: "Shell", "Logs", "Settings"
- Icons: Terminal icon (>_), Gear icon (⚙️), Chart icon (📊)
- Or both text + icons

---

## ✅ **Success Indicators:**

You're in the right place when you see:
- A black/dark terminal window
- A command prompt with `$` or `>`
- Ability to type commands
- Text like `~ $` or `root@...:`

---

## 🎯 **Quick Test:**

Once you find the Shell, test it by typing:
```bash
pwd
```
Press Enter. Should show something like:
```
/app
```

This confirms you're in the right place!

Then run:
```bash
npm run seed
```

---

## 📱 **On Mobile/Tablet?**

The Shell tab might be:
- Hidden in a hamburger menu (☰)
- Under a "More" dropdown
- Scrollable - swipe left/right to see more tabs

---

**Summary:** Look for "Shell" or "Terminal" tab AFTER clicking on your backend service box in Railway Dashboard! 🚀
