# Environment Variables Configuration Guide

## Overview

RealCo platform requires environment-specific configuration for development, staging, and production environments. This document provides templates and guidelines for setting up environment variables.

---

## Development Environment

Create `.env` file in `backend/` directory:

```env
# =============================================================================
# ENVIRONMENT
# =============================================================================
NODE_ENV=development
PORT=3000

# =============================================================================
# DATABASE
# =============================================================================
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/realco_dev
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# =============================================================================
# AUTHENTICATION
# =============================================================================
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=dev-secret-change-in-production
JWT_EXPIRY=8h

# =============================================================================
# ENCRYPTION
# =============================================================================
ENCRYPTION_KEY=dev-encryption-key-change-in-production

# =============================================================================
# STRIPE (Test Mode)
# =============================================================================
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here

# =============================================================================
# PLAID (Sandbox)
# =============================================================================
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox

# =============================================================================
# AWS S3
# =============================================================================
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=realco-dev-documents

# =============================================================================
# REDIS (Optional in dev)
# =============================================================================
REDIS_URL=redis://localhost:6379

# =============================================================================
# EMAIL (Console for dev)
# =============================================================================
EMAIL_SERVICE=console
SENDGRID_FROM_EMAIL=noreply@realco.com

# =============================================================================
# LOGGING
# =============================================================================
LOG_LEVEL=debug
LOG_FORMAT=pretty

# =============================================================================
# FEATURE FLAGS
# =============================================================================
ENABLE_CONSTRUCTION_MODULE=true
ENABLE_ESCROW_MODULE=true
ENABLE_PAYMENT_PROCESSING=true

# =============================================================================
# FRONTEND
# =============================================================================
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## Production Environment (Railway)

### Setting Environment Variables in Railway

1. Go to Railway dashboard → Your project → Variables
2. Add each variable below
3. Railway automatically restarts services when variables change

### Required Production Variables

```bash
# CRITICAL: Generate secure random values!
# Use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Environment
NODE_ENV=production
PORT=3000

# Database (Auto-populated by Railway PostgreSQL plugin)
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=50

# Authentication (REQUIRED - Generate secure values)
JWT_SECRET=[GENERATE_SECURE_VALUE]
ENCRYPTION_KEY=[GENERATE_SECURE_VALUE]

# Stripe Production
STRIPE_SECRET_KEY=sk_live_[YOUR_KEY]
STRIPE_PUBLISHABLE_KEY=pk_live_[YOUR_KEY]
STRIPE_WEBHOOK_SECRET=whsec_[YOUR_SECRET]

# Plaid Production
PLAID_CLIENT_ID=[YOUR_CLIENT_ID]
PLAID_SECRET=[YOUR_SECRET]
PLAID_ENV=production

# AWS S3 Production
AWS_ACCESS_KEY_ID=[YOUR_KEY]
AWS_SECRET_ACCESS_KEY=[YOUR_SECRET]
AWS_REGION=us-east-1
AWS_S3_BUCKET=realco-prod-documents

# Redis (Auto-populated by Railway Redis plugin)
REDIS_URL=${{Redis.REDIS_URL}}

# Email (SendGrid)
SENDGRID_API_KEY=[YOUR_KEY]
SENDGRID_FROM_EMAIL=noreply@realco.com
EMAIL_SERVICE=sendgrid

# Logging & Monitoring
LOG_LEVEL=info
LOG_FORMAT=json
SENTRY_DSN=[YOUR_DSN]
SENTRY_ENVIRONMENT=production

# Security
CORS_ORIGINS=https://app.realco.com
RATE_LIMIT_MAX=60
SESSION_SECRET=[GENERATE_SECURE_VALUE]

# Compliance
ENABLE_OFAC_SCREENING=true
OFAC_API_KEY=[YOUR_KEY]

# Frontend
FRONTEND_URL=https://app.realco.com
WEBHOOK_BASE_URL=https://api.realco.com

# Feature Flags
ENABLE_CONSTRUCTION_MODULE=true
ENABLE_ESCROW_MODULE=true
ENABLE_PAYMENT_PROCESSING=true
```

---

## Generating Secure Secrets

### JWT Secret and Encryption Keys

```bash
# Generate 256-bit secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

### Session Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Environment Validation

The application validates required environment variables on startup:

```typescript
// src/lib/config.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().length(64),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  // ... more validations
});

export const config = envSchema.parse(process.env);
```

---

## Railway-Specific Variables

Railway automatically provides these variables:

```env
RAILWAY_ENVIRONMENT=production
RAILWAY_PROJECT_ID=your-project-id
RAILWAY_SERVICE_ID=your-service-id
RAILWAY_DEPLOYMENT_ID=your-deployment-id
RAILWAY_GIT_COMMIT_SHA=commit-hash
RAILWAY_GIT_BRANCH=main
```

Use these for deployment tracking and debugging.

---

## Vercel Environment Variables (Frontend)

Set in Vercel dashboard → Your project → Settings → Environment Variables:

```env
# API Endpoint
VITE_API_URL=https://api.realco.com/api/v1

# Stripe Publishable Key (safe to expose)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_[YOUR_KEY]

# Plaid Public Key
VITE_PLAID_ENV=production

# Feature Flags
VITE_ENABLE_CONSTRUCTION=true
VITE_ENABLE_ESCROW=true

# Analytics
VITE_GA_TRACKING_ID=G-[YOUR_ID]
VITE_SENTRY_DSN=[YOUR_DSN]
```

---

## Security Best Practices

### DO ✅

- Generate unique secrets for each environment
- Use Railway/Vercel secret management
- Rotate secrets regularly (quarterly)
- Use 256-bit keys minimum
- Enable 2FA on all service accounts
- Audit access logs regularly

### DON'T ❌

- Commit .env files to git
- Share secrets via email/Slack
- Reuse secrets across environments
- Use weak/predictable secrets
- Store secrets in code comments
- Log sensitive environment variables

---

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
railway run -- node -e "require('./dist/lib/prisma.js').prisma.\$connect().then(() => console.log('Connected!'))"

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Missing Environment Variables

```bash
# List all Railway variables
railway variables

# Set a variable
railway variables set KEY=VALUE

# Delete a variable
railway variables delete KEY
```

### Stripe Webhook Issues

```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/v1/webhooks/stripe

# Get webhook secret
stripe webhooks create --url https://api.realco.com/api/v1/webhooks/stripe
```

---

## Environment Checklist

### Development Setup

- [ ] Copy `.env.example` to `.env`
- [ ] Generate JWT_SECRET and ENCRYPTION_KEY
- [ ] Set up local PostgreSQL database
- [ ] Get Stripe test keys
- [ ] Get Plaid sandbox credentials
- [ ] Configure AWS S3 bucket
- [ ] Test email service (use console)

### Production Deployment

- [ ] Generate secure production secrets
- [ ] Set all Railway environment variables
- [ ] Configure Stripe live mode
- [ ] Configure Plaid production
- [ ] Set up production S3 bucket
- [ ] Configure SendGrid API key
- [ ] Set up Sentry error tracking
- [ ] Enable OFAC screening
- [ ] Configure CORS for production domain
- [ ] Test all integrations

---

## References

- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Stripe API Keys](https://stripe.com/docs/keys)
- [Plaid Keys](https://plaid.com/docs/quickstart/#get-your-api-keys)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
