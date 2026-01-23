# Payment Providers Setup Guide

**Last Updated:** January 23, 2026  
**Purpose:** Configure Plaid and Stripe for real payment processing

---

## 🏦 **PLAID SETUP (Bank Verification)**

### What is Plaid?
Plaid enables instant bank account verification without micro-deposits. Users connect their bank accounts securely through Plaid Link, and we receive verified account details.

### Sign Up for Plaid
1. Go to [https://dashboard.plaid.com/signup](https://dashboard.plaid.com/signup)
2. Create a free account (Sandbox is free forever)
3. Complete identity verification
4. Create your first application

### Get API Credentials

#### Development/Sandbox (Free)
```bash
# From Plaid Dashboard > Team Settings > Keys
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_sandbox_secret_here
PLAID_ENVIRONMENT=sandbox

# Frontend (Next.js)
NEXT_PUBLIC_PLAID_ENVIRONMENT=sandbox
```

#### Production
```bash
# After KYC approval and going live
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_production_secret_here
PLAID_ENVIRONMENT=production

# Frontend
NEXT_PUBLIC_PLAID_ENVIRONMENT=production
```

### Plaid Products to Enable
In your Plaid Dashboard, enable these products:
- ✅ **Auth** - Bank account and routing numbers
- ✅ **Balance** - Real-time account balances
- ✅ **Identity** - Account holder information
- ⚠️ **Transactions** (optional) - Transaction history

### Webhook Setup (Production)
1. In Plaid Dashboard, go to **Webhooks**
2. Add webhook URL: `https://your-backend.railway.app/api/v1/webhooks/plaid`
3. Enable events:
   - `DEFAULT_UPDATE` - Account changes
   - `ITEM_LOGIN_REQUIRED` - Re-authentication needed
   - `PENDING_EXPIRATION` - Access expiring soon

### Testing in Sandbox
Use these test credentials in Plaid Link (Sandbox):

**Bank of America (Checking)**
- Username: `user_good`
- Password: `pass_good`
- MFA: `1234`

**Chase (Savings)**
- Username: `user_good`
- Password: `pass_good`

**Wells Fargo (Verification Fail)**
- Username: `user_bad`
- Password: `pass_good`
- Use this to test error handling

### Cost (Production)
- **Auth**: $0.05 per successful verification
- **Balance**: $0.10 per balance check
- **Identity**: Included with Auth
- **First 100 Auth verifications/month**: FREE

---

## 💳 **STRIPE SETUP (Payment Processing)**

### What is Stripe?
Stripe handles ACH payments, wire transfers, and all payment processing. We use Stripe for:
- ACH direct debits (investments)
- ACH credits (distributions)
- Payment tracking and reconciliation
- PCI-compliant payment handling

### Sign Up for Stripe
1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Create account (no verification required for test mode)
3. Complete business verification for production

### Get API Credentials

#### Test Mode (Free)
```bash
# Backend API keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend (Next.js)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### Live Mode (Production)
```bash
# After business verification
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Enable ACH Payments
1. In Stripe Dashboard, go to **Settings** > **Payment Methods**
2. Enable **ACH Direct Debit** (US Bank Accounts)
3. Enable **ACH Credit Transfer** (for distributions)
4. Set up **Bank Accounts** under **Connect**

### Webhook Setup
1. In Stripe Dashboard, go to **Developers** > **Webhooks**
2. Add endpoint: `https://your-backend.railway.app/api/v1/webhooks/stripe`
3. Select events to listen for:

**Payment Events:**
- `payment_intent.succeeded`
- `payment_intent.failed`
- `payment_intent.canceled`
- `payment_intent.processing`

**ACH Events:**
- `charge.succeeded`
- `charge.failed`
- `charge.refunded`

**Payout Events:**
- `payout.paid`
- `payout.failed`
- `payout.canceled`

**Account Events:**
- `account.updated`
- `account.external_account.created`

4. Copy the **Signing Secret** (starts with `whsec_`)
5. Add to backend environment: `STRIPE_WEBHOOK_SECRET=whsec_...`

### Testing in Test Mode
Use these test bank accounts:

**Successful ACH Payment:**
```
Routing Number: 110000000
Account Number: 000123456789
```

**Failed ACH Payment:**
```
Routing Number: 110000000
Account Number: 000111111116 (triggers failure)
```

**Insufficient Funds:**
```
Routing Number: 110000000
Account Number: 000111111113
```

### Cost (Production)
- **ACH Payments**: 0.8% capped at $5.00
- **ACH Credits (Payouts)**: $0.00 (free)
- **No monthly fees**
- **No setup fees**

---

## 🔒 **SECURITY SETUP**

### Bank Account Encryption Key
Generate a secure 32-byte encryption key for storing bank account numbers:

```bash
# Generate on Linux/Mac
openssl rand -base64 32

# Generate with Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add to environment:
```bash
BANK_ACCOUNT_ENCRYPTION_KEY=your_32_byte_key_here
```

### JWT Secret
For API authentication:

```bash
# Generate secure JWT secret
openssl rand -base64 64

# Add to environment
JWT_SECRET=your_jwt_secret_here
```

---

## 📦 **ENVIRONMENT VARIABLES SUMMARY**

### Backend (Railway)
```bash
# Database
DATABASE_URL=postgresql://...

# Plaid
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENVIRONMENT=sandbox  # or production

# Stripe
STRIPE_SECRET_KEY=sk_test_... # or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Security
BANK_ACCOUNT_ENCRYPTION_KEY=your_32_byte_key
JWT_SECRET=your_jwt_secret

# Node
NODE_ENV=production
```

### Frontend (Vercel)
```bash
# API
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1

# Plaid
NEXT_PUBLIC_PLAID_ENVIRONMENT=sandbox  # or production

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # or pk_live_...
```

---

## ✅ **TESTING CHECKLIST**

### Plaid Integration
- [ ] Can open Plaid Link modal
- [ ] Can connect test bank account (user_good)
- [ ] Account appears in bank accounts list
- [ ] Account shows as verified immediately
- [ ] Can set as default account
- [ ] Error handling works (user_bad)

### Stripe Integration
- [ ] Can initiate ACH payment
- [ ] Payment intent created successfully
- [ ] Payment status updates via webhook
- [ ] Failed payment handled correctly
- [ ] Can view payment in Stripe Dashboard
- [ ] Payout/distribution works

### Security
- [ ] Bank account numbers encrypted in database
- [ ] API endpoints require authentication
- [ ] Webhook signatures verified
- [ ] Environment variables not exposed to frontend

---

## 🚀 **DEPLOYMENT STEPS**

### 1. Setup Sandbox Environment (Development)
```bash
# Add to Railway backend
railway variables set PLAID_CLIENT_ID="your_client_id"
railway variables set PLAID_SECRET="your_sandbox_secret"
railway variables set PLAID_ENVIRONMENT="sandbox"
railway variables set STRIPE_SECRET_KEY="sk_test_..."
railway variables set BANK_ACCOUNT_ENCRYPTION_KEY="generated_key"

# Add to Vercel frontend
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_PLAID_ENVIRONMENT production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
```

### 2. Test Sandbox
- Test Plaid bank verification
- Test Stripe ACH payments
- Test webhooks (use Stripe CLI or ngrok)
- Verify data encryption

### 3. Apply for Production Access

**Plaid:**
1. Complete KYC in Plaid Dashboard
2. Provide business information
3. Describe use case
4. Wait for approval (1-2 business days)
5. Switch to production credentials

**Stripe:**
1. Complete business verification
2. Add business details
3. Verify bank account
4. Enable live mode
5. Update to live credentials

### 4. Deploy Production
```bash
# Update Railway with production keys
railway variables set PLAID_ENVIRONMENT="production"
railway variables set PLAID_SECRET="your_production_secret"
railway variables set STRIPE_SECRET_KEY="sk_live_..."

# Update Vercel
vercel env add NEXT_PUBLIC_PLAID_ENVIRONMENT production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
```

---

## 📞 **SUPPORT & DOCUMENTATION**

### Plaid
- Dashboard: https://dashboard.plaid.com
- Docs: https://plaid.com/docs
- Support: https://plaid.com/contact
- Status: https://status.plaid.com

### Stripe
- Dashboard: https://dashboard.stripe.com
- Docs: https://stripe.com/docs
- Support: https://support.stripe.com
- Status: https://status.stripe.com

---

## 🔍 **TROUBLESHOOTING**

### Plaid Link Not Opening
- Check `NEXT_PUBLIC_PLAID_ENVIRONMENT` is set
- Verify link token is being created on backend
- Check browser console for errors
- Ensure `react-plaid-link` package is installed

### Stripe Payment Failing
- Verify webhook secret is correct
- Check Stripe Dashboard for error details
- Ensure test bank account numbers are correct
- Verify API keys are for correct mode (test vs live)

### Bank Account Not Saving
- Check encryption key is set
- Verify database connection
- Check backend logs for errors
- Ensure Prisma schema is up to date

---

**Status:** Ready for testing once credentials are added ✅

**Next Steps:**
1. Sign up for Plaid (Sandbox)
2. Sign up for Stripe (Test Mode)
3. Add environment variables to Railway/Vercel
4. Test bank verification flow
5. Test payment processing
