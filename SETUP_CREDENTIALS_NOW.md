# 🚀 SETUP PAYMENT CREDENTIALS - INTERACTIVE GUIDE

**Status:** Ready to configure  
**Time Required:** 15 minutes  
**You're here:** Let's get real payments working!

---

## 📋 **PRE-FLIGHT CHECKLIST**

Before starting, open these in browser tabs:
- [ ] Tab 1: https://dashboard.plaid.com/signup
- [ ] Tab 2: https://dashboard.stripe.com/register  
- [ ] Tab 3: https://railway.app (login to your project)
- [ ] Tab 4: https://vercel.com (login to your project)
- [ ] Tab 5: This guide

---

## STEP 1: PLAID SANDBOX (5 MINUTES) 🏦

### ✅ **1.1 Create Plaid Account (2 min)**

**In Tab 1 (Plaid):**
1. Click "Sign Up"
2. Enter your email
3. Create password
4. Click "Create Account"
5. Check email for verification link
6. Click verification link
7. ✅ You're now in Plaid Dashboard!

**What you should see:**
- Dashboard with "Welcome to Plaid" message
- Left sidebar with navigation
- "Team Settings" option at bottom left

---

### ✅ **1.2 Get Plaid Credentials (1 min)**

**In Plaid Dashboard:**
1. Click **"Team Settings"** (bottom left corner)
2. Click **"Keys"** tab at the top
3. You'll see two sections:
   - **Sandbox** (use this one!)
   - **Development**

**Copy these values:**
```
client_id: [Copy this - looks like: 61234567890abcdef1234567]
sandbox secret: [Copy this - long string starting with letters]
```

**Write them down here:**
```bash
PLAID_CLIENT_ID="_______________PASTE_HERE_______________"
PLAID_SECRET="_______________PASTE_HERE_______________"
```

---

### ✅ **1.3 Add to Railway (2 min)**

**In Tab 3 (Railway):**

1. Find your **RealCo Backend** project
2. Click on the service/project
3. Click **"Variables"** tab
4. Click **"+ New Variable"** button
5. Add these THREE variables:

**Variable 1:**
```
Variable Name: PLAID_CLIENT_ID
Value: [paste your client_id from step 1.2]
```
Click "Add" ✅

**Variable 2:**
```
Variable Name: PLAID_SECRET
Value: [paste your sandbox secret from step 1.2]
```
Click "Add" ✅

**Variable 3:**
```
Variable Name: PLAID_ENVIRONMENT
Value: sandbox
```
Click "Add" ✅

**Important:** Railway will auto-redeploy your backend after adding variables!

**Wait for redeploy** (watch the logs, takes ~2-3 minutes)

---

## STEP 2: STRIPE TEST MODE (5 MINUTES) 💳

### ✅ **2.1 Create Stripe Account (2 min)**

**In Tab 2 (Stripe):**
1. Click "Start now" or "Sign up"
2. Enter your email
3. Create password
4. Enter your name
5. Click "Create account"
6. Check email for verification
7. Click verification link
8. **Skip** business verification (click "I'll do this later")
9. ✅ You're now in Stripe Dashboard!

**What you should see:**
- Dashboard with charts (may be empty)
- Toggle in top right: **"Test mode"** (make sure it's ON/blue)
- Left sidebar with "Developers" option

---

### ✅ **2.2 Get Stripe API Keys (1 min)**

**In Stripe Dashboard:**
1. Make sure **"Test mode"** toggle is ON (top right - should be blue)
2. Click **"Developers"** in left sidebar
3. Click **"API keys"** tab

**You'll see two keys:**

**Publishable key:**
```
pk_test_51....[long string]
```
**Copy it!** ✅

**Secret key:**
```
sk_test_51....[hidden - click "Reveal test key token"]
```
**Click "Reveal test key token"** then **Copy it!** ✅

**Write them down here:**
```bash
STRIPE_PUBLISHABLE="pk_test_____________PASTE_HERE____________"
STRIPE_SECRET="sk_test_____________PASTE_HERE____________"
```

---

### ✅ **2.3 Setup Stripe Webhook (2 min)**

**Still in Stripe Developers section:**
1. Click **"Webhooks"** tab (next to API keys)
2. Click **"+ Add endpoint"** button
3. Fill in the form:

**Endpoint URL:**
```
https://your-backend-name.up.railway.app/api/v1/webhooks/stripe
```
**Replace** `your-backend-name` with your actual Railway backend URL!

**To find your Railway URL:**
- Go to Railway → Your Backend Service → Settings → Domains
- Copy the railway.app URL

**Description:** (optional)
```
RealCo Payment Webhooks
```

**Events to listen to:**
- Click **"Select events"**
- Search and select these:
  - ✅ `payment_intent.succeeded`
  - ✅ `payment_intent.failed`
  - ✅ `payment_intent.canceled`
  - ✅ `charge.succeeded`
  - ✅ `charge.failed`

4. Click **"Add endpoint"** ✅

**Copy the Signing Secret:**
After endpoint is created, you'll see:
```
Signing secret: whsec_...[long string]
```
**Click "Reveal"** then **Copy it!** ✅

**Write it down here:**
```bash
STRIPE_WEBHOOK_SECRET="whsec_____________PASTE_HERE____________"
```

---

### ✅ **2.4 Add Stripe to Railway (1 min)**

**Back to Tab 3 (Railway):**

1. Same backend project → **"Variables"** tab
2. Add these TWO more variables:

**Variable 1:**
```
Variable Name: STRIPE_SECRET_KEY
Value: [paste your sk_test_... from step 2.2]
```
Click "Add" ✅

**Variable 2:**
```
Variable Name: STRIPE_WEBHOOK_SECRET
Value: [paste your whsec_... from step 2.3]
```
Click "Add" ✅

**Railway will redeploy again** (wait ~2 minutes)

---

### ✅ **2.5 Add Stripe to Vercel (1 min)**

**In Tab 4 (Vercel):**

1. Find your **RealCo** frontend project
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in left sidebar
4. Click **"Add New"** button

**Add this variable:**
```
Key: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: [paste your pk_test_... from step 2.2]
```

**Select environments:**
- ✅ Production
- ✅ Preview
- ✅ Development

5. Click **"Save"** ✅

**Redeploy frontend:**
1. Go to **"Deployments"** tab
2. Click the three dots (...) on latest deployment
3. Click **"Redeploy"**
4. Wait ~2-3 minutes

---

## STEP 3: ENCRYPTION KEY (2 MINUTES) 🔐

### ✅ **3.1 Generate Encryption Key**

**You have 3 options - pick one:**

**Option A: Use PowerShell (Windows)**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Option B: Use Node.js (Any OS)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option C: Use Online Tool**
Go to: https://generate-random.org/encryption-key-generator
- Select: "256-bit"
- Format: "Base64"
- Click "Generate"

**Copy the generated key!** ✅

**Write it down here:**
```bash
ENCRYPTION_KEY="_______________PASTE_HERE_______________"
```

---

### ✅ **3.2 Add Encryption Key to Railway**

**Back to Tab 3 (Railway):**

1. Backend project → **"Variables"** tab
2. Add this variable:

```
Variable Name: BANK_ACCOUNT_ENCRYPTION_KEY
Value: [paste your generated key from step 3.1]
```
Click "Add" ✅

**Railway will redeploy** (final redeploy! ~2 minutes)

---

## STEP 4: TEST PAYMENT FLOW (5 MINUTES) ✅

### ✅ **4.1 Wait for Deployments**

**Check Railway:**
- Go to your backend service
- Look at "Deployments" section
- Wait until status shows: ✅ **"Active"**
- Check logs for: "Server listening on port 5000" or similar

**Check Vercel:**
- Go to "Deployments" tab
- Wait until latest deployment shows: ✅ **"Ready"**
- Should take 2-3 minutes

---

### ✅ **4.2 Test Bank Account Connection**

**Open your live site:**
```
https://your-app.vercel.app/login
```

1. **Login as Investor:**
   - Email: `investor@realco.com`
   - Password: `password123`

2. **Go to Banking:**
   - Click "Banking" in sidebar
   - Click **"Add Bank Account"** button

3. **Plaid Link Should Open!** 🎉
   - If it doesn't open, check browser console (F12)
   - Look for any errors

4. **Connect Test Bank:**
   - Select **"Bank of America"** from list
   - Username: `user_good`
   - Password: `pass_good`
   - MFA Code: `1234`
   - Click "Submit"

5. **Select Account:**
   - Choose "Plaid Checking" account
   - Click "Continue"

6. **Success!** ✅
   - You should see the bank account appear
   - Status: "Verified"
   - Account: "Bank of America ••••0000"

---

### ✅ **4.3 Test Investment Flow**

**Make a test investment:**

1. **Go to Invest Page:**
   - Click "Invest" in sidebar
   - Select an offering (e.g., "Riverside Apartments")
   - Click "Continue"

2. **Enter Amount:**
   - Enter: `50000` (or any amount above minimum)
   - Click "Continue"

3. **Select Payment:**
   - Select your verified bank account
   - Choose **"ACH Transfer"**
   - Click "Review Investment"

4. **Review & Confirm:**
   - Review details
   - Click **"Confirm Investment"** 

5. **Success!** 🎉
   - You should see "Investment Initiated!" message
   - Transaction ID displayed
   - Status: "Processing"

---

### ✅ **4.4 Verify in Dashboards**

**Check Stripe Dashboard:**
1. Go to https://dashboard.stripe.com
2. Make sure **"Test mode"** is ON
3. Click "Payments" in left sidebar
4. You should see your test payment! ✅

**Check Railway Logs:**
1. Go to your backend in Railway
2. Click "Deployments" → "View Logs"
3. Look for payment processing logs
4. Should see: "Payment intent created" or similar ✅

**Check Transaction History:**
1. In your app, go to "Transactions"
2. You should see your investment transaction
3. Status: "Processing" or "Completed"
4. Amount: $50,000 ✅

---

## ✅ **SUCCESS CHECKLIST**

After completing all steps, you should have:
- [x] Plaid account created and credentials added
- [x] Stripe account created and credentials added
- [x] Webhooks configured for both services
- [x] Encryption key generated and added
- [x] Both Railway and Vercel redeployed
- [x] Successfully connected test bank account
- [x] Successfully made test investment
- [x] Transaction visible in dashboards

---

## 🎉 **YOU'RE DONE!**

Your RealCo platform is now processing **REAL** payments (in sandbox mode)!

**What you can do now:**
- ✅ Add bank accounts via Plaid
- ✅ Process ACH payments via Stripe
- ✅ Track transactions in real-time
- ✅ View payment history
- ✅ Test the full investment flow

**Next Steps:**
1. Test with different bank accounts (use different test credentials)
2. Test failed payments (use `user_bad` in Plaid)
3. Test different investment amounts
4. Review Stripe Dashboard for payment details
5. When ready for production, apply for Plaid & Stripe live access

---

## 🚨 **TROUBLESHOOTING**

### Plaid Link not opening?
**Check:**
1. Railway backend has `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENVIRONMENT="sandbox"`
2. Backend logs show no errors (Railway → Logs)
3. Browser console (F12) for JavaScript errors
4. Try hard refresh (Ctrl+Shift+R)

**Fix:**
```bash
# Verify in Railway dashboard:
Variables → Should see:
- PLAID_CLIENT_ID: 123456...
- PLAID_SECRET: [long string]
- PLAID_ENVIRONMENT: sandbox
```

### Payment failing?
**Check:**
1. Stripe test mode is ON
2. Using correct test credentials: `110000000` / `000123456789`
3. Webhook secret is correct
4. Backend logs for errors

**Fix:**
```bash
# Verify in Railway dashboard:
Variables → Should see:
- STRIPE_SECRET_KEY: sk_test_...
- STRIPE_WEBHOOK_SECRET: whsec_...

# Verify in Vercel dashboard:
Settings → Environment Variables → Should see:
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_...
```

### Bank account not saving?
**Check:**
1. `BANK_ACCOUNT_ENCRYPTION_KEY` is set in Railway
2. Database connection is working
3. Backend logs for database errors

**Fix:**
```bash
# In Railway dashboard:
Variables → Should see:
- BANK_ACCOUNT_ENCRYPTION_KEY: [32-byte base64 string]
- DATABASE_URL: postgresql://...
```

---

## 📞 **NEED HELP?**

If you get stuck at any step, note:
1. Which step you're on (1.1, 2.3, etc.)
2. What error message you see
3. Screenshot if helpful

Check these logs:
- **Railway Backend:** Railway Dashboard → Your Service → View Logs
- **Vercel Frontend:** Vercel Dashboard → Deployments → View Logs
- **Browser Console:** Press F12 → Console tab

---

**Good luck! You got this! 🚀**
