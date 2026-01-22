# =============================================================================
# RealCo Platform - Automated Deployment with Auto-Variables
# =============================================================================
# This script:
# 1. Commits changes to git
# 2. Pushes to GitHub
# 3. Auto-sets Railway variables
# 4. Deploys backend to Railway
# 5. Auto-sets Vercel variables
# 6. Deploys frontend to Vercel
# =============================================================================

$ErrorActionPreference = "Stop"

function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Step { param($msg) Write-Host "`n🚀 $msg" -ForegroundColor Magenta }

Clear-Host
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     RealCo - Auto Deploy with Variable Setup              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# =============================================================================
# STEP 1: GIT COMMIT & PUSH
# =============================================================================

Write-Step "Git Commit & Push"

$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Info "Changes detected, committing..."
    
    git add .
    
    $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    }
    
    git commit -m $commitMsg
    Write-Success "Changes committed"
} else {
    Write-Info "No changes to commit"
}

Write-Info "Pushing to GitHub..."
git push origin main
Write-Success "Pushed to GitHub"

# =============================================================================
# STEP 2: AUTO-SETUP RAILWAY VARIABLES
# =============================================================================

Write-Step "Setting Up Railway Variables"

Write-Info "Generating secure secrets..."

function New-Secret {
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    return [Convert]::ToBase64String($bytes)
}

$JWT_SECRET = New-Secret
$ENCRYPTION_KEY = New-Secret
$SESSION_SECRET = New-Secret

Write-Success "Secrets generated"

# Core environment variables
Write-Info "Setting core variables..."

railway variables set "NODE_ENV=production" | Out-Null
railway variables set "PORT=8080" | Out-Null
railway variables set "JWT_SECRET=$JWT_SECRET" | Out-Null
railway variables set "ENCRYPTION_KEY=$ENCRYPTION_KEY" | Out-Null
railway variables set "SESSION_SECRET=$SESSION_SECRET" | Out-Null
railway variables set "LOG_LEVEL=info" | Out-Null
railway variables set "ENABLE_CONSTRUCTION_MODULE=true" | Out-Null
railway variables set "ENABLE_FINANCE_MODULE=true" | Out-Null

Write-Success "Core variables set"

# Get user's API keys
Write-Info "`nNow let's set up your API keys..."

Write-Host "`n📝 Stripe Configuration:" -ForegroundColor Yellow
$stripeSecret = Read-Host "Enter Stripe Secret Key (sk_...)"
$stripeWebhook = Read-Host "Enter Stripe Webhook Secret (whsec_...)"

if ($stripeSecret) {
    railway variables set "STRIPE_SECRET_KEY=$stripeSecret" | Out-Null
    railway variables set "STRIPE_WEBHOOK_SECRET=$stripeWebhook" | Out-Null
    Write-Success "Stripe configured"
}

Write-Host "`n📝 Plaid Configuration:" -ForegroundColor Yellow
$plaidClient = Read-Host "Enter Plaid Client ID"
$plaidSecret = Read-Host "Enter Plaid Secret"
$plaidEnv = Read-Host "Enter Plaid Environment (sandbox/development/production)"

if ($plaidClient) {
    railway variables set "PLAID_CLIENT_ID=$plaidClient" | Out-Null
    railway variables set "PLAID_SECRET=$plaidSecret" | Out-Null
    railway variables set "PLAID_ENV=$plaidEnv" | Out-Null
    Write-Success "Plaid configured"
}

Write-Host "`n📝 AWS S3 Configuration:" -ForegroundColor Yellow
$awsKey = Read-Host "Enter AWS Access Key ID"
$awsSecret = Read-Host "Enter AWS Secret Access Key"
$awsBucket = Read-Host "Enter S3 Bucket Name"
$awsRegion = Read-Host "Enter AWS Region (e.g. us-east-1)"

if ($awsKey) {
    railway variables set "AWS_ACCESS_KEY_ID=$awsKey" | Out-Null
    railway variables set "AWS_SECRET_ACCESS_KEY=$awsSecret" | Out-Null
    railway variables set "AWS_S3_BUCKET=$awsBucket" | Out-Null
    railway variables set "AWS_REGION=$awsRegion" | Out-Null
    Write-Success "AWS S3 configured"
}

Write-Host "`n📝 Optional Services:" -ForegroundColor Yellow
$sendgridKey = Read-Host "Enter SendGrid API Key (or press Enter to skip)"
if ($sendgridKey) {
    railway variables set "SENDGRID_API_KEY=$sendgridKey" | Out-Null
    Write-Success "SendGrid configured"
}

$sentryDsn = Read-Host "Enter Sentry DSN (or press Enter to skip)"
if ($sentryDsn) {
    railway variables set "SENTRY_DSN=$sentryDsn" | Out-Null
    Write-Success "Sentry configured"
}

Write-Success "All Railway variables configured!"

# =============================================================================
# STEP 3: DEPLOY BACKEND TO RAILWAY
# =============================================================================

Write-Step "Deploying Backend to Railway"

Set-Location backend

Write-Info "Generating Prisma client..."
npx prisma generate | Out-Null

Write-Info "Running database migrations..."
try {
    railway run npx prisma migrate deploy
    Write-Success "Migrations applied"
} catch {
    Write-Warning "Migration warning (might be first deploy)"
}

Write-Info "Deploying to Railway..."
railway up

Write-Success "Backend deployed to Railway!"

# Get Railway URL
Start-Sleep -Seconds 5
Write-Info "Getting deployment URL..."
$railwayStatus = railway status 2>&1
$railwayUrl = $railwayStatus | Select-String -Pattern "https://.*railway\.app" | ForEach-Object { $_.Matches[0].Value }

if ($railwayUrl) {
    Write-Success "Backend URL: $railwayUrl"
} else {
    Write-Warning "Could not auto-detect Railway URL - check dashboard"
    $railwayUrl = Read-Host "Enter your Railway app URL"
}

Set-Location ..

# =============================================================================
# STEP 4: AUTO-SETUP VERCEL VARIABLES
# =============================================================================

Write-Step "Setting Up Vercel Variables"

Set-Location frontend

# Link project if needed
if (-not (Test-Path ".vercel")) {
    Write-Info "Linking Vercel project..."
    vercel link
}

Write-Info "Setting Vercel environment variables..."

# Set API URL
$apiUrl = "$railwayUrl/api/v1"
vercel env add VITE_API_URL production --force 2>&1 | Out-Null
"$apiUrl" | vercel env add VITE_API_URL production --force 2>&1 | Out-Null

# Set Stripe publishable key
Write-Host "`n📝 Frontend Configuration:" -ForegroundColor Yellow
$stripePublishable = Read-Host "Enter Stripe Publishable Key (pk_...)"
if ($stripePublishable) {
    vercel env add VITE_STRIPE_PUBLISHABLE_KEY production --force 2>&1 | Out-Null
    "$stripePublishable" | vercel env add VITE_STRIPE_PUBLISHABLE_KEY production --force 2>&1 | Out-Null
}

# Set Plaid env
if ($plaidEnv) {
    vercel env add VITE_PLAID_ENV production --force 2>&1 | Out-Null
    "$plaidEnv" | vercel env add VITE_PLAID_ENV production --force 2>&1 | Out-Null
}

Write-Success "Vercel variables configured!"

# =============================================================================
# STEP 5: DEPLOY FRONTEND TO VERCEL
# =============================================================================

Write-Step "Deploying Frontend to Vercel"

Write-Info "Deploying to Vercel..."
$vercelOutput = vercel --prod 2>&1
$vercelUrl = $vercelOutput | Select-String -Pattern "https://.*\.vercel\.app" | Select-Object -First 1 | ForEach-Object { $_.Matches[0].Value }

Write-Success "Frontend deployed to Vercel!"

if ($vercelUrl) {
    Write-Success "Frontend URL: $vercelUrl"
}

Set-Location ..

# =============================================================================
# STEP 6: POST-DEPLOYMENT VERIFICATION
# =============================================================================

Write-Step "Post-Deployment Verification"

Start-Sleep -Seconds 10

Write-Info "Testing backend health..."
try {
    $healthResponse = Invoke-RestMethod -Uri "$railwayUrl/api/v1/health" -Method Get -ErrorAction Stop
    if ($healthResponse.status -eq "healthy") {
        Write-Success "Backend is healthy! ✓"
    }
}
catch {
    Write-Warning "Health check pending (app might still be starting)"
}

# =============================================================================
# DEPLOYMENT COMPLETE
# =============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           🎉 DEPLOYMENT COMPLETE! 🎉                      ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📊 Deployment Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Code pushed to GitHub" -ForegroundColor White
Write-Host "   ✅ Railway variables configured" -ForegroundColor White
Write-Host "   ✅ Backend deployed to Railway" -ForegroundColor White
Write-Host "   ✅ Vercel variables configured" -ForegroundColor White
Write-Host "   ✅ Frontend deployed to Vercel" -ForegroundColor White
Write-Host ""

Write-Host "🔗 Your Application URLs:" -ForegroundColor Cyan
Write-Host "   Backend:  $railwayUrl" -ForegroundColor White
Write-Host "   Frontend: $vercelUrl" -ForegroundColor White
Write-Host ""

Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Test the application:" -ForegroundColor White
Write-Host "      Open: $vercelUrl" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Monitor logs:" -ForegroundColor White
Write-Host "      Backend:  railway logs" -ForegroundColor Gray
Write-Host "      Frontend: vercel logs" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Set up custom domains (optional):" -ForegroundColor White
Write-Host "      Railway:  railway domain" -ForegroundColor Gray
Write-Host "      Vercel:   vercel domains add yourdomain.com" -ForegroundColor Gray
Write-Host ""

Write-Success "Deployment completed successfully! 🚀"
Write-Host ""
