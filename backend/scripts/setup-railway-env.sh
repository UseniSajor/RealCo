#!/bin/bash
# =============================================================================
# Railway Environment Variables Setup Script
# =============================================================================
# This script sets up all required environment variables for Railway deployment
# Run this after creating your Railway project
# =============================================================================

set -e

echo "🚂 Railway Environment Variables Setup"
echo "======================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Install with: npm install -g @railway/cli"
    exit 1
fi

# Check if logged in
railway whoami || (echo "❌ Not logged into Railway. Run: railway login" && exit 1)

echo "✅ Railway CLI ready"
echo ""

# =============================================================================
# GENERATE SECURE SECRETS
# =============================================================================

echo "🔐 Generating secure secrets..."
echo ""

JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

echo "✅ Generated JWT_SECRET"
echo "✅ Generated ENCRYPTION_KEY"
echo "✅ Generated SESSION_SECRET"
echo ""

# =============================================================================
# SET ENVIRONMENT VARIABLES
# =============================================================================

echo "📝 Setting environment variables in Railway..."
echo ""

# Environment
railway variables set NODE_ENV=production
railway variables set PORT=8080
railway variables set LOG_LEVEL=info
railway variables set LOG_FORMAT=json

# Generated Secrets
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set ENCRYPTION_KEY="$ENCRYPTION_KEY"
railway variables set SESSION_SECRET="$SESSION_SECRET"
railway variables set JWT_EXPIRY=15m
railway variables set REFRESH_TOKEN_EXPIRY=7d

echo "✅ Environment and secrets configured"
echo ""

# =============================================================================
# THIRD-PARTY SERVICES (USER INPUT REQUIRED)
# =============================================================================

echo "⚠️  The following variables need YOUR input:"
echo ""
echo "Please provide the following values (press Enter to skip):"
echo ""

# Stripe
read -p "STRIPE_SECRET_KEY (sk_live_...): " STRIPE_SECRET_KEY
if [ -n "$STRIPE_SECRET_KEY" ]; then
    railway variables set STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY"
    echo "✅ Stripe secret key set"
fi

read -p "STRIPE_WEBHOOK_SECRET (whsec_...): " STRIPE_WEBHOOK_SECRET
if [ -n "$STRIPE_WEBHOOK_SECRET" ]; then
    railway variables set STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET"
    echo "✅ Stripe webhook secret set"
fi

# Plaid
read -p "PLAID_CLIENT_ID: " PLAID_CLIENT_ID
if [ -n "$PLAID_CLIENT_ID" ]; then
    railway variables set PLAID_CLIENT_ID="$PLAID_CLIENT_ID"
    echo "✅ Plaid client ID set"
fi

read -p "PLAID_SECRET: " PLAID_SECRET
if [ -n "$PLAID_SECRET" ]; then
    railway variables set PLAID_SECRET="$PLAID_SECRET"
    railway variables set PLAID_ENV=production
    echo "✅ Plaid credentials set"
fi

# AWS S3
read -p "AWS_ACCESS_KEY_ID: " AWS_ACCESS_KEY_ID
if [ -n "$AWS_ACCESS_KEY_ID" ]; then
    railway variables set AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
    echo "✅ AWS access key set"
fi

read -p "AWS_SECRET_ACCESS_KEY: " AWS_SECRET_ACCESS_KEY
if [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
    railway variables set AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
    railway variables set AWS_REGION=us-east-1
    railway variables set AWS_S3_BUCKET_DOCS=realco-prod-documents
    railway variables set AWS_S3_BUCKET_CONSTRUCTION=realco-prod-construction
    echo "✅ AWS S3 configured"
fi

# SendGrid
read -p "SENDGRID_API_KEY: " SENDGRID_API_KEY
if [ -n "$SENDGRID_API_KEY" ]; then
    railway variables set SENDGRID_API_KEY="$SENDGRID_API_KEY"
    railway variables set SENDGRID_FROM_EMAIL=noreply@realco.com
    railway variables set SENDGRID_FROM_NAME="RealCo Platform"
    railway variables set EMAIL_SERVICE=sendgrid
    echo "✅ SendGrid configured"
fi

# Sentry
read -p "SENTRY_DSN (optional): " SENTRY_DSN
if [ -n "$SENTRY_DSN" ]; then
    railway variables set SENTRY_DSN="$SENTRY_DSN"
    railway variables set SENTRY_ENVIRONMENT=production
    railway variables set SENTRY_TRACES_SAMPLE_RATE=0.1
    echo "✅ Sentry configured"
fi

echo ""

# =============================================================================
# APPLICATION SETTINGS
# =============================================================================

echo "🔧 Setting application configuration..."
echo ""

# Frontend URL
read -p "Frontend URL (e.g., https://app.realco.com): " FRONTEND_URL
if [ -n "$FRONTEND_URL" ]; then
    railway variables set FRONTEND_URL="$FRONTEND_URL"
    railway variables set CORS_ORIGINS="$FRONTEND_URL"
    railway variables set WEBHOOK_BASE_URL="${FRONTEND_URL/app/api}"
    echo "✅ Frontend URL configured"
fi

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

echo "✅ Application settings configured"
echo ""

# =============================================================================
# SUMMARY
# =============================================================================

echo "======================================"
echo "✅ Railway Environment Setup Complete!"
echo "======================================"
echo ""
echo "📊 Variables configured:"
railway variables | head -20
echo ""
echo "🔒 Your secrets (SAVE THESE SECURELY):"
echo "   JWT_SECRET: $JWT_SECRET"
echo "   ENCRYPTION_KEY: $ENCRYPTION_KEY"
echo "   SESSION_SECRET: [hidden for security]"
echo ""
echo "⚠️  IMPORTANT:"
echo "   1. Save these secrets in your password manager"
echo "   2. Database URL will be auto-set when you add PostgreSQL"
echo "   3. Redis URL will be auto-set when you add Redis"
echo ""
echo "📝 Next steps:"
echo "   1. Add PostgreSQL database: railway add"
echo "   2. Add Redis (optional): railway add"
echo "   3. Deploy your app: railway up"
echo "   4. Run migrations: railway run npx prisma migrate deploy"
echo ""
echo "🎉 Ready to deploy!"
