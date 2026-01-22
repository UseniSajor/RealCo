# Fix and add Railway variables

Write-Host "Fixing Railway Variables..." -ForegroundColor Cyan

# Generate secrets
$JWT_SECRET = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$ENCRYPTION_KEY = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
$SESSION_SECRET = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

Write-Host "[*] Setting core application variables..." -ForegroundColor Yellow

railway variables set "NODE_ENV=production"
railway variables set "PORT=8080"
railway variables set "LOG_LEVEL=info"
railway variables set "ENABLE_CONSTRUCTION_MODULE=true"
railway variables set "ENABLE_FINANCE_MODULE=true"

railway variables set "JWT_SECRET=$JWT_SECRET"
railway variables set "ENCRYPTION_KEY=$ENCRYPTION_KEY"
railway variables set "SESSION_SECRET=$SESSION_SECRET"

Write-Host "[OK] Core variables set" -ForegroundColor Green

Write-Host "`n[*] Fixing Stripe variables..." -ForegroundColor Yellow
# Fix STRIPE_CLIENT_ID (should be STRIPE_WEBHOOK_SECRET)
railway variables set "STRIPE_WEBHOOK_SECRET=whsec_BINJ6Cm10rVdzelCgDHiV3AqsEX1Asc2"
# STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY are already set correctly

Write-Host "[OK] Stripe fixed" -ForegroundColor Green

Write-Host "`n[*] Fixing Plaid variables..." -ForegroundColor Yellow
Write-Host "Enter your Plaid credentials:"
$plaidClient = Read-Host "Plaid Client ID"
$plaidSecret = Read-Host "Plaid Secret"
$plaidEnv = Read-Host "Plaid Environment (sandbox/production)"

railway variables set "PLAID_CLIENT_ID=$plaidClient"
railway variables set "PLAID_SECRET=$plaidSecret"
railway variables set "PLAID_ENV=$plaidEnv"

Write-Host "[OK] Plaid configured" -ForegroundColor Green

Write-Host "`n[*] Setting AWS S3 variables..." -ForegroundColor Yellow
Write-Host "Enter your AWS S3 credentials:"
$awsKey = Read-Host "AWS Access Key ID"
$awsSecret = Read-Host "AWS Secret Access Key"
$awsBucket = Read-Host "S3 Bucket Name"
$awsRegion = Read-Host "AWS Region (e.g. us-east-1)"

railway variables set "AWS_ACCESS_KEY_ID=$awsKey"
railway variables set "AWS_SECRET_ACCESS_KEY=$awsSecret"
railway variables set "AWS_S3_BUCKET=$awsBucket"
railway variables set "AWS_REGION=$awsRegion"

Write-Host "[OK] AWS configured" -ForegroundColor Green

Write-Host "`n[*] Setting CORS origin..." -ForegroundColor Yellow
$vercelUrl = Read-Host "Enter your Vercel frontend URL (https://your-app.vercel.app)"
railway variables set "CORS_ORIGIN=$vercelUrl"

Write-Host "[OK] CORS configured" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "   Variables Updated Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nNext: Deploy the backend" -ForegroundColor Cyan
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  railway up" -ForegroundColor White
