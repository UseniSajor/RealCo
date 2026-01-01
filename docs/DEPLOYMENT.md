# Deployment Guide

## Railway Backend Settings

- **Root Directory**: `backend`
- **Build Command**: `npm ci && npx prisma generate && npm run build`
- **Start Command**: `npm run railway:start`

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string from Railway Postgres service |
| `JWT_SECRET` | ✅ Yes | Secret key for JWT token signing |
| `CORS_ORIGIN` | ✅ Yes | Frontend URL(s), comma-separated (e.g., `https://app.vercel.app`) |
| `NODE_ENV` | ❌ No | Set to `production` in production |
| `PORT` | ❌ No | Auto-set by Railway |

## Railway Postgres Environment Variables

- `DATABASE_URL` - Automatically provided when Postgres service is linked to backend service

## Vercel Frontend Settings

- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ Yes | Backend URL without trailing slash (e.g., `https://backend.up.railway.app`) |

## CORS Settings

- Set `CORS_ORIGIN` in Railway backend to match your Vercel frontend URL
- In production, CORS strictly validates origins - unknown origins are rejected
- Multiple origins can be comma-separated: `https://app1.vercel.app,https://app2.vercel.app`

## Troubleshooting Checklist

- [ ] Backend `DATABASE_URL` is set and points to Railway Postgres
- [ ] Backend `CORS_ORIGIN` includes exact frontend URL (no trailing slash)
- [ ] Frontend `VITE_API_URL` matches backend URL (no trailing slash)
- [ ] Backend health check works: `https://backend.up.railway.app/health`
- [ ] Backend ready check works: `https://backend.up.railway.app/api/v1/ready`
- [ ] Frontend can call backend API endpoints
- [ ] Browser console shows no CORS errors

---

# ADD NODE_ENV AND OTHER CRITICAL ENVIRONMENT VARIABLES

NODE_ENV is missing from your Railway backend. Let's add it and verify all 
required environment variables are set.

═══════════════════════════════════════════════════════════════════════════════
STEP 1: ADD NODE_ENV TO RAILWAY
═══════════════════════════════════════════════════════════════════════════════
```bash
cd backend

# Set NODE_ENV to production
railway variables set NODE_ENV=production

# Verify it was added
railway variables | grep NODE_ENV

# Should output:
# NODE_ENV=production
```

═══════════════════════════════════════════════════════════════════════════════
STEP 2: ADD ALL REQUIRED ENVIRONMENT VARIABLES
═══════════════════════════════════════════════════════════════════════════════

Let's add ALL the environment variables your backend needs:
```bash
cd backend

echo "=== SETTING ALL RAILWAY ENVIRONMENT VARIABLES ==="

# 1. NODE_ENV (production mode)
railway variables set NODE_ENV=production

# 2. PORT (Railway needs this)
railway variables set PORT=5001

# 3. JWT_SECRET (secure random string for authentication)
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# 4. CORS_ORIGIN (your Vercel frontend URL)
# IMPORTANT: Get your actual Vercel URL first
cd ../frontend
vercel ls
# Copy the production URL, then:
cd ../backend

# Replace with YOUR actual Vercel URL:
railway variables set CORS_ORIGIN=https://kealee-platform.vercel.app

# 5. Optional: Stripe keys (if you have them)
# railway variables set STRIPE_SECRET_KEY=sk_live_...
# railway variables set STRIPE_PUBLISHABLE_KEY=pk_live_...

# 6. Optional: Anthropic API key (for ML features)
# railway variables set ANTHROPIC_API_KEY=sk-ant-...

echo "✅ Environment variables set"
```

═══════════════════════════════════════════════════════════════════════════════
STEP 3: VERIFY ALL VARIABLES ARE SET
═══════════════════════════════════════════════════════════════════════════════
```bash
cd backend

echo "=== CURRENT RAILWAY ENVIRONMENT VARIABLES ==="

railway variables

# You should see:
# ┌────────────────────┬──────────────────────────────────────────┐
# │ Name               │ Value                                     │
# ├────────────────────┼──────────────────────────────────────────┤
# │ DATABASE_URL       │ postgresql://postgres:***@***            │
# │ NODE_ENV           │ production                               │
# │ PORT               │ 5001                                     │
# │ JWT_SECRET         │ *** (hidden)                             │
# │ CORS_ORIGIN        │ https://kealee-platform.vercel.app       │
# └────────────────────┴──────────────────────────────────────────┘

# Check for required variables:
railway variables | grep -E "DATABASE_URL|NODE_ENV|PORT|JWT_SECRET|CORS_ORIGIN"
```

═══════════════════════════════════════════════════════════════════════════════
STEP 4: REDEPLOY BACKEND WITH NEW VARIABLES
═══════════════════════════════════════════════════════════════════════════════

After setting environment variables, redeploy so they take effect:
```bash
cd backend

echo "=== REDEPLOYING BACKEND WITH NEW ENVIRONMENT VARIABLES ==="

railway up

# Wait for deployment to complete (1-2 minutes)
# You'll see:
# ✓ Build successful
# ✓ Deployment successful
```

═══════════════════════════════════════════════════════════════════════════════
STEP 5: TEST BACKEND WITH NEW VARIABLES
═══════════════════════════════════════════════════════════════════════════════
```bash
# Get your Railway backend URL
railway status

# Or get it directly:
BACKEND_URL=$(railway status --json | grep "url" | cut -d'"' -f4)

echo "Testing backend at: $BACKEND_URL"

# Test 1: Health check
curl -s "$BACKEND_URL/api/health"

# Test 2: Check if NODE_ENV is working
# View logs to see if "production" mode is logged
railway logs --tail 20

# Should see something like:
# Server running in production mode
# Database connected
# Server started on port 5001

echo "✅ Backend deployed with NODE_ENV=production"
```

═══════════════════════════════════════════════════════════════════════════════
ALTERNATIVE: SET VARIABLES VIA RAILWAY DASHBOARD
═══════════════════════════════════════════════════════════════════════════════

If CLI doesn't work, use the Railway web dashboard:

STEP-BY-STEP:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to https://railway.app
2. Log in to your account
3. Click on your backend project
4. Click "Variables" tab (on the left sidebar)
5. Click "+ New Variable" button
6. Add each variable:

   Variable Name: NODE_ENV
   Value: production
   [Add Variable]

   Variable Name: PORT
   Value: 5001
   [Add Variable]

   Variable Name: JWT_SECRET
   Value: [paste output of: openssl rand -base64 32]
   [Add Variable]

   Variable Name: CORS_ORIGIN
   Value: https://your-vercel-url.vercel.app
   [Add Variable]

7. Railway will auto-redeploy with new variables

═══════════════════════════════════════════════════════════════════════════════
STEP 6: VERIFY CORS_ORIGIN MATCHES YOUR VERCEL URL
═══════════════════════════════════════════════════════════════════════════════

CRITICAL: CORS_ORIGIN must EXACTLY match your Vercel frontend URL.
```bash
# Get your exact Vercel URL
cd frontend
vercel ls

# You'll see output like:
# Age    Deployment                          Status
# 5m     kealee-platform-abc123.vercel.app   Ready (Production)

# Copy the production URL (without https://)
# Then set it on Railway:
cd ../backend

# IMPORTANT: Use YOUR actual URL, not this example
railway variables set CORS_ORIGIN=https://kealee-platform-abc123.vercel.app

# Redeploy
railway up
```

═══════════════════════════════════════════════════════════════════════════════
TROUBLESHOOTING
═══════════════════════════════════════════════════════════════════════════════

ISSUE: "railway: command not found"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```bash
# Install Railway CLI
npm install -g @railway/cli

# Or use the dashboard method above
```

ISSUE: "railway variables" shows no output
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```bash
# Link to your Railway project
railway link

# Select your backend project from the list
# Then try again:
railway variables
```

ISSUE: Cannot generate JWT_SECRET (Windows/no openssl)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```bash
# Option 1: Use Node.js to generate
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 2: Use a password generator
# Go to: https://passwordsgenerator.net/
# Generate a 32+ character password
# Use that as JWT_SECRET

# Option 3: Just use a long random string
railway variables set JWT_SECRET=your-very-long-random-string-min-32-chars-abc123xyz789
```

═══════════════════════════════════════════════════════════════════════════════
COMPLETE ENVIRONMENT VARIABLE CHECKLIST
═══════════════════════════════════════════════════════════════════════════════

REQUIRED VARIABLES (Backend - Railway):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ DATABASE_URL (auto-set by Railway when you add Postgres)
□ NODE_ENV=production
□ PORT=5001
□ JWT_SECRET=<random-32-char-string>
□ CORS_ORIGIN=https://your-vercel-url.vercel.app

OPTIONAL VARIABLES (Backend - Railway):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ STRIPE_SECRET_KEY=sk_live_... (for payments)
□ STRIPE_PUBLISHABLE_KEY=pk_live_... (for payments)
□ ANTHROPIC_API_KEY=sk-ant-... (for ML features)

REQUIRED VARIABLES (Frontend - Vercel):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ VITE_API_URL=https://your-railway-backend.up.railway.app

OPTIONAL VARIABLES (Frontend - Vercel):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ VITE_STRIPE_PUBLISHABLE_KEY=pk_live_... (for payments)

═══════════════════════════════════════════════════════════════════════════════
QUICK COPY-PASTE FIX
═══════════════════════════════════════════════════════════════════════════════

Run this complete script to set everything at once:
```bash
cd backend

# Set all required variables
railway variables set NODE_ENV=production
railway variables set PORT=5001
railway variables set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")

# Get Vercel URL and set CORS
cd ../frontend
VERCEL_URL=$(vercel ls --json 2>/dev/null | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
cd ../backend
railway variables set CORS_ORIGIN=https://$VERCEL_URL

# Redeploy
railway up

echo "✅ All environment variables set and deployed"
echo ""
echo "Verify with: railway variables"
```

═══════════════════════════════════════════════════════════════════════════════
AFTER SETTING VARIABLES
═══════════════════════════════════════════════════════════════════════════════

Once all variables are set and backend is redeployed:

1. ✅ Check variables are set:
```bash
   railway variables
```

2. ✅ Check logs for successful startup:
```bash
   railway logs --tail 50
```

3. ✅ Test backend responds:
```bash
   curl https://your-backend.up.railway.app/api/health
```

4. ✅ Test CORS from frontend:
   - Open your Vercel frontend in browser
   - Open DevTools (F12)
   - Try to login/register
   - Check for CORS errors (should be none)

═══════════════════════════════════════════════════════════════════════════════