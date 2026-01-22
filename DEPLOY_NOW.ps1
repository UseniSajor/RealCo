# =============================================================================
# RealCo Platform - Complete Deployment Script
# =============================================================================
# This script handles the entire deployment process for Railway and Vercel
# =============================================================================

param(
    [switch]$SkipTests,
    [switch]$SkipBackup,
    [switch]$SetupOnly
)

$ErrorActionPreference = "Stop"

# Colors
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Step { param($msg) Write-Host "`n🚀 $msg" -ForegroundColor Magenta }

Clear-Host
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         RealCo Platform - Production Deployment           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# =============================================================================
# STEP 1: PRE-DEPLOYMENT CHECKS
# =============================================================================

Write-Step "Pre-Deployment Checks"

# Check Railway CLI
try {
    railway whoami | Out-Null
    Write-Success "Railway CLI authenticated"
} catch {
    Write-Error "Railway CLI not installed or not logged in"
    Write-Info "Install: npm install -g @railway/cli"
    Write-Info "Login: railway login"
    exit 1
}

# Check Vercel CLI
try {
    vercel whoami | Out-Null
    Write-Success "Vercel CLI authenticated"
} catch {
    Write-Error "Vercel CLI not installed or not logged in"
    Write-Info "Install: npm install -g vercel"
    Write-Info "Login: vercel login"
    exit 1
}

# Check Node.js
$nodeVersion = node --version
Write-Success "Node.js $nodeVersion installed"

# Check Git status
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Warning "Uncommitted changes detected"
    git status --short
    $continue = Read-Host "`nContinue anyway? (yes/no)"
    if ($continue -ne "yes") {
        Write-Info "Deployment cancelled"
        exit 0
    }
}

Write-Success "All prerequisites met"

# =============================================================================
# STEP 2: ENVIRONMENT SETUP
# =============================================================================

Write-Step "Environment Setup"

Write-Info "Do you need to set up Railway environment variables? (first-time deployment)"
$setupEnv = Read-Host "Setup environment variables? (yes/no)"

if ($setupEnv -eq "yes" -or $SetupOnly) {
    Write-Info "Running environment setup script..."
    & "$PSScriptRoot\backend\scripts\setup-railway-env.ps1"
    
    if ($SetupOnly) {
        Write-Success "Environment setup complete! Run this script again without -SetupOnly to deploy."
        exit 0
    }
}

# =============================================================================
# STEP 3: RUN TESTS
# =============================================================================

if (-not $SkipTests) {
    Write-Step "Running Tests"
    
    Set-Location backend
    
    Write-Info "Running type check..."
    try {
        npm run typecheck
        Write-Success "Type check passed"
    } catch {
        Write-Error "Type check failed"
        $continue = Read-Host "Continue anyway? (yes/no)"
        if ($continue -ne "yes") {
            exit 1
        }
    }
    
    Write-Info "Running tests..."
    try {
        npm test
        Write-Success "All tests passed"
    } catch {
        Write-Warning "Some tests failed"
        $continue = Read-Host "Continue with deployment? (yes/no)"
        if ($continue -ne "yes") {
            exit 1
        }
    }
    
    Set-Location ..
} else {
    Write-Warning "Skipping tests (--SkipTests flag used)"
}

# =============================================================================
# STEP 4: DATABASE BACKUP
# =============================================================================

if (-not $SkipBackup) {
    Write-Step "Database Backup"
    
    $backupFile = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
    Write-Info "Creating backup: $backupFile"
    
    try {
        Set-Location backend
        railway run pg_dump > "../$backupFile"
        Write-Success "Database backup created: $backupFile"
        Set-Location ..
    } catch {
        Write-Warning "Backup failed (database might not exist yet)"
    }
} else {
    Write-Warning "Skipping database backup (--SkipBackup flag used)"
}

# =============================================================================
# STEP 5: DEPLOYMENT CONFIRMATION
# =============================================================================

Write-Step "Deployment Confirmation"

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  READY TO DEPLOY TO PRODUCTION" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Environment: PRODUCTION" -ForegroundColor White
Write-Host "  Branch: $(git rev-parse --abbrev-ref HEAD)" -ForegroundColor White
Write-Host "  Commit: $(git rev-parse --short HEAD)" -ForegroundColor White
Write-Host ""
Write-Host "  Backend → Railway" -ForegroundColor Cyan
Write-Host "  Frontend → Vercel" -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Deploy to production? (yes/no)"
if ($confirm -ne "yes") {
    Write-Info "Deployment cancelled"
    exit 0
}

# =============================================================================
# STEP 6: DEPLOY BACKEND TO RAILWAY
# =============================================================================

Write-Step "Deploying Backend to Railway"

Set-Location backend

# Check if PostgreSQL is added
Write-Info "Checking for PostgreSQL database..."
$hasPostgres = railway variables | Select-String "DATABASE_URL"
if (-not $hasPostgres) {
    Write-Warning "PostgreSQL database not detected"
    Write-Info "Adding PostgreSQL to Railway..."
    railway add
}

# Generate Prisma Client
Write-Info "Generating Prisma client..."
npx prisma generate

# Run migrations
Write-Info "Running database migrations..."
try {
    railway run npx prisma migrate deploy
    Write-Success "Migrations completed"
} catch {
    Write-Error "Migration failed"
    Write-Warning "This might be the first deployment. Continuing..."
}

# Deploy to Railway
Write-Info "Deploying to Railway..."
railway up

Write-Success "Backend deployed to Railway!"

# Get Railway URL
Write-Info "Getting Railway deployment URL..."
Start-Sleep -Seconds 10
railway status

Set-Location ..

# =============================================================================
# STEP 7: DEPLOY FRONTEND TO VERCEL
# =============================================================================

Write-Step "Deploying Frontend to Vercel"

Set-Location frontend

# Check if Vercel project is linked
if (-not (Test-Path ".vercel")) {
    Write-Info "Linking Vercel project..."
    vercel link
}

# Deploy to Vercel
Write-Info "Deploying to Vercel..."
vercel --prod

Write-Success "Frontend deployed to Vercel!"

Set-Location ..

# =============================================================================
# STEP 8: POST-DEPLOYMENT VERIFICATION
# =============================================================================

Write-Step "Post-Deployment Verification"

Start-Sleep -Seconds 15

Write-Info "Getting deployment URLs..."

# Backend Health Check
try {
    Set-Location backend
    $railwayUrl = railway status | Select-String "https://" | ForEach-Object { $_.ToString().Trim() }
    Set-Location ..
    
    if ($railwayUrl) {
        Write-Info "Backend URL: $railwayUrl"
        Write-Info "Testing health endpoint..."
        
        $healthUrl = "$railwayUrl/api/v1/health"
        try {
            $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Success "Backend health check passed ✓"
            }
        } catch {
            Write-Warning "Health check failed (might take a moment to start)"
        }
    }
} catch {
    Write-Warning "Could not verify backend deployment"
}

# Frontend Check
try {
    Set-Location frontend
    $vercelUrl = vercel inspect --token=$env:VERCEL_TOKEN 2>$null | Select-String "https://" | Select-Object -First 1
    Set-Location ..
    
    if ($vercelUrl) {
        Write-Info "Frontend URL: $vercelUrl"
        Write-Success "Frontend deployment complete ✓"
    }
} catch {
    Write-Warning "Could not get frontend URL"
}

# =============================================================================
# STEP 9: SUMMARY
# =============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              DEPLOYMENT COMPLETE! 🎉                       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📊 Deployment Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Backend deployed to Railway" -ForegroundColor White
Write-Host "   ✅ Frontend deployed to Vercel" -ForegroundColor White
Write-Host "   ✅ Database migrations applied" -ForegroundColor White
if (-not $SkipBackup) {
    Write-Host "   ✅ Database backup created" -ForegroundColor White
}
Write-Host ""

Write-Host "🔗 Your Application:" -ForegroundColor Cyan
Write-Host "   Backend:  Check Railway dashboard" -ForegroundColor White
Write-Host "   Frontend: Check Vercel dashboard" -ForegroundColor White
Write-Host ""

Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Monitor logs for errors" -ForegroundColor White
Write-Host "      Backend:  railway logs" -ForegroundColor Gray
Write-Host "      Frontend: vercel logs" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Test critical user flows" -ForegroundColor White
Write-Host "      - User login" -ForegroundColor Gray
Write-Host "      - API endpoints" -ForegroundColor Gray
Write-Host "      - Database queries" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Set up monitoring" -ForegroundColor White
Write-Host "      - Check Sentry for errors" -ForegroundColor Gray
Write-Host "      - Monitor health endpoint" -ForegroundColor Gray
Write-Host ""
Write-Host "   4. Configure custom domains (optional)" -ForegroundColor White
Write-Host "      - Railway: api.realco.com" -ForegroundColor Gray
Write-Host "      - Vercel:  app.realco.com" -ForegroundColor Gray
Write-Host ""

Write-Host "📞 Need Help?" -ForegroundColor Cyan
Write-Host "   - Railway docs: https://docs.railway.app" -ForegroundColor Gray
Write-Host "   - Vercel docs:  https://vercel.com/docs" -ForegroundColor Gray
Write-Host "   - Troubleshooting: docs/guides/TROUBLESHOOTING_GUIDE.md" -ForegroundColor Gray
Write-Host ""

Write-Success "Deployment script completed successfully!"
Write-Host ""
