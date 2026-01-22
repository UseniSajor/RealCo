# 🚀 Manual Deployment Commands

Copy and paste these commands one by one.

## Step 1: Commit & Push

```powershell
git add .
git commit -m "Production deployment"
git push origin main
```

## Step 2: Set Railway Variables

```powershell
# Generate secrets (run each line)
$JWT_SECRET = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$ENCRYPTION_KEY = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$SESSION_SECRET = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Set core variables
railway variables set "NODE_ENV=production"
railway variables set "PORT=8080"
railway variables set "JWT_SECRET=$JWT_SECRET"
railway variables set "ENCRYPTION_KEY=$ENCRYPTION_KEY"
railway variables set "SESSION_SECRET=$SESSION_SECRET"
railway variables set "LOG_LEVEL=info"
railway variables set "ENABLE_CONSTRUCTION_MODULE=true"
railway variables set "ENABLE_FINANCE_MODULE=true"

# Set your API keys (replace with your actual keys)
railway variables set "STRIPE_SECRET_KEY=sk_live_YOUR_KEY"
railway variables set "STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET"
railway variables set "PLAID_CLIENT_ID=YOUR_CLIENT_ID"
railway variables set "PLAID_SECRET=YOUR_SECRET"
railway variables set "PLAID_ENV=production"
railway variables set "AWS_ACCESS_KEY_ID=YOUR_AWS_KEY"
railway variables set "AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET"
railway variables set "AWS_S3_BUCKET=your-bucket-name"
railway variables set "AWS_REGION=us-east-1"
```

## Step 3: Deploy Backend

```powershell
cd backend
npx prisma generate
railway run npx prisma migrate deploy
railway up
railway status
cd ..
```

## Step 4: Deploy Frontend

```powershell
cd frontend

# Link project (first time only)
vercel link

# Build and deploy
vercel --prod

# Note the URL displayed
cd ..
```

## Step 5: Test

```powershell
# Get your Railway URL
railway status

# Test backend
curl https://your-app.railway.app/api/v1/health

# View logs
railway logs
```

## Done!

Your app is now live!

- Backend: Check `railway status` for URL
- Frontend: Check Vercel dashboard for URL
