# 🚀 Quick Start - Enable Real Payments (15 Minutes)

**Goal:** Get RealCo processing real payments in 15 minutes

---

## Step 1: Plaid Sandbox Setup (5 minutes)

### 1.1 Create Plaid Account
```
1. Go to: https://dashboard.plaid.com/signup
2. Sign up with email (free, no credit card)
3. Verify email
4. Login to dashboard
```

### 1.2 Get API Credentials
```
1. Click "Team Settings" (bottom left)
2. Click "Keys" tab
3. Copy your credentials:
   - client_id: (starts with numbers)
   - Sandbox secret: (long string)
```

### 1.3 Add to Railway Backend
```bash
# In Railway dashboard:
railway variables set PLAID_CLIENT_ID="your_client_id_here"
railway variables set PLAID_SECRET="your_sandbox_secret_here"
railway variables set PLAID_ENVIRONMENT="sandbox"

# Redeploy backend
railway up
```

### 1.4 Test Credentials
```
Test bank account (use in Plaid Link):
Username: user_good
Password: pass_good
MFA Code: 1234

This will successfully verify a test "Bank of America" account
```

---

## Step 2: Stripe Test Mode Setup (5 minutes)

### 2.1 Create Stripe Account
```
1. Go to: https://dashboard.stripe.com/register
2. Sign up with email (free, no credit card for test mode)
3. Skip business verification (not needed for test mode)
4. Login to dashboard
```

### 2.2 Get API Credentials
```
1. Click "Developers" in left sidebar
2. Click "API keys" tab
3. Toggle "Test mode" ON (top right)
4. Copy your credentials:
   - Publishable key: pk_test_...
   - Secret key: sk_test_... (click "Reveal test key")
```

### 2.3 Setup Webhook
```
1. Click "Webhooks" (under Developers)
2. Click "Add endpoint"
3. Enter URL: https://your-backend.railway.app/api/v1/webhooks/stripe
4. Select events: payment_intent.succeeded, payment_intent.failed
5. Click "Add endpoint"
6. Copy "Signing secret" (whsec_...)
```

### 2.4 Add to Railway & Vercel
```bash
# Railway backend:
railway variables set STRIPE_SECRET_KEY="sk_test_..."
railway variables set STRIPE_WEBHOOK_SECRET="whsec_..."

# Vercel frontend:
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# When prompted, enter: pk_test_...
# Select: Production, Preview, Development (all three)
```

### 2.5 Test Credentials
```
Test ACH bank account (use in Stripe):
Routing Number: 110000000
Account Number: 000123456789

This will successfully process a test ACH payment
```

---

## Step 3: Add Encryption Key (2 minutes)

### 3.1 Generate Encryption Key
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3.2 Add to Railway
```bash
railway variables set BANK_ACCOUNT_ENCRYPTION_KEY="your_generated_key"
```

---

## Step 4: Deploy & Test (3 minutes)

### 4.1 Restart Services
```bash
# Backend will auto-restart with new variables
# Frontend redeploy:
vercel --prod
```

### 4.2 Test Payment Flow
```
1. Go to: https://your-app.vercel.app/dashboard/investor/banking
2. Click "Add Bank Account"
3. Use Plaid test credentials:
   - Username: user_good
   - Password: pass_good
   - MFA: 1234
4. Select "Bank of America" test account
5. Confirm connection
6. Bank account should appear as "Verified"
```

### 4.3 Test Investment
```
1. Go to: /dashboard/investor/invest
2. Select an offering
3. Enter amount (e.g., $50,000)
4. Select your bank account
5. Choose "ACH Transfer"
6. Review and confirm
7. Check transaction status
```

---

## ✅ Success Checklist

After completing steps above, you should be able to:
- [ ] Add bank account via Plaid Link
- [ ] See verified account in banking page
- [ ] Make test investment
- [ ] See transaction in history
- [ ] View transaction in Stripe Dashboard
- [ ] Receive webhook confirmations in logs

---

## 🚨 Troubleshooting

### Plaid Link not opening?
```
- Check Railway logs for errors
- Verify PLAID_CLIENT_ID is set correctly
- Ensure PLAID_ENVIRONMENT="sandbox"
- Check browser console for JavaScript errors
```

### Stripe payment failing?
```
- Verify STRIPE_SECRET_KEY starts with sk_test_
- Check webhook secret is correct
- Use correct test bank account: 110000000 / 000123456789
- Check Stripe Dashboard > Logs for errors
```

### Bank account not saving?
```
- Verify BANK_ACCOUNT_ENCRYPTION_KEY is set
- Check Railway logs for encryption errors
- Ensure DATABASE_URL is correct
- Run database migration if needed: npx prisma migrate deploy
```

---

## 📞 Need Help?

**Check logs:**
```bash
# Railway backend logs
railway logs

# Vercel frontend logs
vercel logs
```

**Verify environment variables:**
```bash
# Railway
railway variables

# Vercel
vercel env ls
```

**Documentation:**
- Full setup guide: `PAYMENT_PROVIDERS_SETUP.md`
- Integration status: `KEALEE_FINANCE_INTEGRATION_STATUS.md`
- Session summary: `SESSION_SUMMARY_JAN_23_2026.md`

---

**Time to complete:** 15 minutes  
**Cost:** $0 (all in sandbox/test mode)  
**Result:** Real payment processing enabled! 🎉
