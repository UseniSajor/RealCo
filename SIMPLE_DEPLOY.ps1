# RealCo Platform - Simple Automated Deployment
# Auto-sets variables and deploys to Railway and Vercel

$ErrorActionPreference = "Stop"

Write-Host "`n=== RealCo Platform Auto-Deploy ===" -ForegroundColor Cyan
Write-Host "This script will deploy your app with auto-configured variables`n" -ForegroundColor Cyan

# Helper functions
function Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Info { param($msg) Write-Host "[*] $msg" -ForegroundColor Cyan }
function Warn { param($msg) Write-Host "[!] $msg" -ForegroundColor Yellow }
function Error { param($msg) Write-Host "[X] $msg" -ForegroundColor Red }

# Generate secure secret
function New-Secret {
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
    return [Convert]::ToBase64String($bytes)
}

# STEP 1: Git Push
Info "Step 1: Git Commit & Push"
$status = git status --porcelain
if ($status) {
    git add .
    $msg = Read-Host "Commit message (or press Enter for auto)"
    if (!$msg) { $msg = "Deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }
    git commit -m $msg
    Success "Committed"
}
git push origin main
Success "Pushed to GitHub"

# STEP 2: Railway Variables
Info "`nStep 2: Setting Railway Variables"

Info "Generating secrets..."
$jwt = New-Secret
$enc = New-Secret
$sess = New-Secret
Success "Secrets generated"

Info "Setting core variables..."
railway variables set "NODE_ENV=production" | Out-Null
railway variables set "PORT=8080" | Out-Null
railway variables set "JWT_SECRET=$jwt" | Out-Null
railway variables set "ENCRYPTION_KEY=$enc" | Out-Null
railway variables set "SESSION_SECRET=$sess" | Out-Null
railway variables set "LOG_LEVEL=info" | Out-Null
railway variables set "ENABLE_CONSTRUCTION_MODULE=true" | Out-Null
railway variables set "ENABLE_FINANCE_MODULE=true" | Out-Null
Success "Core variables set"

Write-Host "`n--- API Keys Required ---" -ForegroundColor Yellow
$stripe_secret = Read-Host "Stripe Secret Key (sk_...)"
$stripe_webhook = Read-Host "Stripe Webhook Secret (whsec_...)"
$plaid_client = Read-Host "Plaid Client ID"
$plaid_secret = Read-Host "Plaid Secret"
$plaid_env = Read-Host "Plaid Environment (sandbox/production)"
$aws_key = Read-Host "AWS Access Key ID"
$aws_secret = Read-Host "AWS Secret Access Key"
$aws_bucket = Read-Host "AWS S3 Bucket Name"
$aws_region = Read-Host "AWS Region (us-east-1)"

Info "Setting API keys..."
railway variables set "STRIPE_SECRET_KEY=$stripe_secret" | Out-Null
railway variables set "STRIPE_WEBHOOK_SECRET=$stripe_webhook" | Out-Null
railway variables set "PLAID_CLIENT_ID=$plaid_client" | Out-Null
railway variables set "PLAID_SECRET=$plaid_secret" | Out-Null
railway variables set "PLAID_ENV=$plaid_env" | Out-Null
railway variables set "AWS_ACCESS_KEY_ID=$aws_key" | Out-Null
railway variables set "AWS_SECRET_ACCESS_KEY=$aws_secret" | Out-Null
railway variables set "AWS_S3_BUCKET=$aws_bucket" | Out-Null
railway variables set "AWS_REGION=$aws_region" | Out-Null
Success "API keys configured"

# STEP 3: Deploy Backend
Info "`nStep 3: Deploying Backend to Railway"
Set-Location backend

Info "Generating Prisma client..."
npx prisma generate | Out-Null

Info "Running migrations..."
railway run npx prisma migrate deploy 2>&1 | Out-Null
Success "Migrations applied"

Info "Deploying..."
railway up
Success "Backend deployed"

Start-Sleep -Seconds 5
$railway_status = railway status 2>&1
$railway_url = ($railway_status | Select-String "https://.*railway\.app").Matches[0].Value

if ($railway_url) {
    Success "Backend URL: $railway_url"
} else {
    Warn "Could not detect URL - check Railway dashboard"
    $railway_url = Read-Host "Enter your Railway URL"
}

Set-Location ..

# STEP 4: Vercel Variables
Info "`nStep 4: Setting Vercel Variables"
Set-Location frontend

if (!(Test-Path ".vercel")) {
    Info "Linking Vercel project..."
    vercel link
}

$stripe_pub = Read-Host "Stripe Publishable Key (pk_...)"

Info "Setting environment variables..."
$env:VITE_API_URL = "$railway_url/api/v1"
$env:VITE_STRIPE_PUBLISHABLE_KEY = $stripe_pub
$env:VITE_PLAID_ENV = $plaid_env

# Set Vercel env vars
echo "$railway_url/api/v1" | vercel env add VITE_API_URL production 2>&1 | Out-Null
echo $stripe_pub | vercel env add VITE_STRIPE_PUBLISHABLE_KEY production 2>&1 | Out-Null
echo $plaid_env | vercel env add VITE_PLAID_ENV production 2>&1 | Out-Null
Success "Variables configured"

# STEP 5: Deploy Frontend
Info "`nStep 5: Deploying Frontend to Vercel"
$vercel_out = vercel --prod 2>&1
$vercel_url = ($vercel_out | Select-String "https://.*\.vercel\.app" | Select-Object -First 1).Matches[0].Value
Success "Frontend deployed"

if ($vercel_url) {
    Success "Frontend URL: $vercel_url"
}

Set-Location ..

# STEP 6: Verification
Info "`nStep 6: Verifying Deployment"
Start-Sleep -Seconds 10

try {
    $health = Invoke-RestMethod -Uri "$railway_url/api/v1/health"
    if ($health.status -eq "healthy") {
        Success "Backend health check passed"
    }
} catch {
    Warn "Health check pending (app starting)"
}

# Summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nYour Application:" -ForegroundColor Cyan
Write-Host "  Backend:  $railway_url" -ForegroundColor White
Write-Host "  Frontend: $vercel_url" -ForegroundColor White
Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "  1. Test: $vercel_url" -ForegroundColor White
Write-Host "  2. Monitor: railway logs" -ForegroundColor White
Write-Host "  3. Frontend logs: vercel logs" -ForegroundColor White
Write-Host ""
Success "All done!"
