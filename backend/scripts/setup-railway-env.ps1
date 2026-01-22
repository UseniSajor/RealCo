# =============================================================================
# Railway Environment Variables Setup Script (PowerShell)
# =============================================================================
# This script sets up all required environment variables for Railway deployment
# Run this after creating your Railway project
# =============================================================================

Write-Host "🚂 Railway Environment Variables Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
try {
    railway whoami | Out-Null
    Write-Host "✅ Railway CLI ready" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found or not logged in" -ForegroundColor Red
    Write-Host "Install: npm install -g @railway/cli" -ForegroundColor Yellow
    Write-Host "Login: railway login" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# =============================================================================
# GENERATE SECURE SECRETS
# =============================================================================

Write-Host "🔐 Generating secure secrets..." -ForegroundColor Yellow
Write-Host ""

$JWT_SECRET = -join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Max 16) })
$ENCRYPTION_KEY = -join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Max 16) })
$SESSION_SECRET = -join ((1..128) | ForEach-Object { '{0:x}' -f (Get-Random -Max 16) })

Write-Host "✅ Generated JWT_SECRET" -ForegroundColor Green
Write-Host "✅ Generated ENCRYPTION_KEY" -ForegroundColor Green
Write-Host "✅ Generated SESSION_SECRET" -ForegroundColor Green
Write-Host ""

# =============================================================================
# SET ENVIRONMENT VARIABLES
# =============================================================================

Write-Host "📝 Setting environment variables in Railway..." -ForegroundColor Yellow
Write-Host ""

# Environment
railway variables set NODE_ENV=production
railway variables set PORT=8080
railway variables set LOG_LEVEL=info
railway variables set LOG_FORMAT=json

# Generated Secrets
railway variables set "JWT_SECRET=$JWT_SECRET"
railway variables set "ENCRYPTION_KEY=$ENCRYPTION_KEY"
railway variables set "SESSION_SECRET=$SESSION_SECRET"
railway variables set JWT_EXPIRY=15m
railway variables set REFRESH_TOKEN_EXPIRY=7d

Write-Host "✅ Environment and secrets configured" -ForegroundColor Green
Write-Host ""

# =============================================================================
# THIRD-PARTY SERVICES (USER INPUT REQUIRED)
# =============================================================================

Write-Host "⚠️  The following variables need YOUR input:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Please provide the following values (press Enter to skip):" -ForegroundColor Cyan
Write-Host ""

# Stripe
$STRIPE_SECRET_KEY = Read-Host "STRIPE_SECRET_KEY (sk_live_...)"
if ($STRIPE_SECRET_KEY) {
    railway variables set "STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY"
    Write-Host "✅ Stripe secret key set" -ForegroundColor Green
}

$STRIPE_WEBHOOK_SECRET = Read-Host "STRIPE_WEBHOOK_SECRET (whsec_...)"
if ($STRIPE_WEBHOOK_SECRET) {
    railway variables set "STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET"
    Write-Host "✅ Stripe webhook secret set" -ForegroundColor Green
}

# Plaid
$PLAID_CLIENT_ID = Read-Host "PLAID_CLIENT_ID"
if ($PLAID_CLIENT_ID) {
    railway variables set "PLAID_CLIENT_ID=$PLAID_CLIENT_ID"
    Write-Host "✅ Plaid client ID set" -ForegroundColor Green
}

$PLAID_SECRET = Read-Host "PLAID_SECRET"
if ($PLAID_SECRET) {
    railway variables set "PLAID_SECRET=$PLAID_SECRET"
    railway variables set PLAID_ENV=production
    Write-Host "✅ Plaid credentials set" -ForegroundColor Green
}

# AWS S3
$AWS_ACCESS_KEY_ID = Read-Host "AWS_ACCESS_KEY_ID"
if ($AWS_ACCESS_KEY_ID) {
    railway variables set "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
    Write-Host "✅ AWS access key set" -ForegroundColor Green
}

$AWS_SECRET_ACCESS_KEY = Read-Host "AWS_SECRET_ACCESS_KEY"
if ($AWS_SECRET_ACCESS_KEY) {
    railway variables set "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
    railway variables set AWS_REGION=us-east-1
    railway variables set AWS_S3_BUCKET_DOCS=realco-prod-documents
    railway variables set AWS_S3_BUCKET_CONSTRUCTION=realco-prod-construction
    Write-Host "✅ AWS S3 configured" -ForegroundColor Green
}

# SendGrid
$SENDGRID_API_KEY = Read-Host "SENDGRID_API_KEY"
if ($SENDGRID_API_KEY) {
    railway variables set "SENDGRID_API_KEY=$SENDGRID_API_KEY"
    railway variables set SENDGRID_FROM_EMAIL=noreply@realco.com
    railway variables set "SENDGRID_FROM_NAME=RealCo Platform"
    railway variables set EMAIL_SERVICE=sendgrid
    Write-Host "✅ SendGrid configured" -ForegroundColor Green
}

# Sentry
$SENTRY_DSN = Read-Host "SENTRY_DSN (optional)"
if ($SENTRY_DSN) {
    railway variables set "SENTRY_DSN=$SENTRY_DSN"
    railway variables set SENTRY_ENVIRONMENT=production
    railway variables set SENTRY_TRACES_SAMPLE_RATE=0.1
    Write-Host "✅ Sentry configured" -ForegroundColor Green
}

Write-Host ""

# =============================================================================
# APPLICATION SETTINGS
# =============================================================================

Write-Host "🔧 Setting application configuration..." -ForegroundColor Yellow
Write-Host ""

# Frontend URL
$FRONTEND_URL = Read-Host "Frontend URL (e.g., https://app.realco.com)"
if ($FRONTEND_URL) {
    railway variables set "FRONTEND_URL=$FRONTEND_URL"
    railway variables set "CORS_ORIGINS=$FRONTEND_URL"
    $API_URL = $FRONTEND_URL -replace "app", "api"
    railway variables set "WEBHOOK_BASE_URL=$API_URL"
    Write-Host "✅ Frontend URL configured" -ForegroundColor Green
}

# Feature Flags
railway variables set ENABLE_CONSTRUCTION_MODULE=true
railway variables set ENABLE_ESCROW_MODULE=true
railway variables set ENABLE_PAYMENT_PROCESSING=true
railway variables set ENABLE_DISTRIBUTIONS=true

# Security
railway variables set RATE_LIMIT_MAX=100
railway variables set RATE_LIMIT_WINDOW=60000

# Compliance
railway variables set ENABLE_OFAC_SCREENING=false

Write-Host "✅ Application settings configured" -ForegroundColor Green
Write-Host ""

# =============================================================================
# SUMMARY
# =============================================================================

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ Railway Environment Setup Complete!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Variables configured:" -ForegroundColor Cyan
railway variables | Select-Object -First 20
Write-Host ""
Write-Host "🔒 Your secrets (SAVE THESE SECURELY):" -ForegroundColor Yellow
Write-Host "   JWT_SECRET: $JWT_SECRET" -ForegroundColor Gray
Write-Host "   ENCRYPTION_KEY: $ENCRYPTION_KEY" -ForegroundColor Gray
Write-Host "   SESSION_SECRET: [hidden for security]" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  IMPORTANT:" -ForegroundColor Yellow
Write-Host "   1. Save these secrets in your password manager" -ForegroundColor White
Write-Host "   2. Database URL will be auto-set when you add PostgreSQL" -ForegroundColor White
Write-Host "   3. Redis URL will be auto-set when you add Redis" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Add PostgreSQL database: railway add" -ForegroundColor White
Write-Host "   2. Add Redis (optional): railway add" -ForegroundColor White
Write-Host "   3. Deploy your app: railway up" -ForegroundColor White
Write-Host "   4. Run migrations: railway run npx prisma migrate deploy" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Ready to deploy!" -ForegroundColor Green
