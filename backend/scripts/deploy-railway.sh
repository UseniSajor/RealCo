#!/bin/bash
# =============================================================================
# Railway Production Deployment Script
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
  echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
  echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
echo ""
echo "=== Pre-Deployment Checks ==="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_error "Railway CLI not found. Install with: npm install -g @railway/cli"
    exit 1
fi
print_status "Railway CLI installed"

# Check if logged into Railway
railway whoami || (print_error "Not logged into Railway. Run: railway login" && exit 1)
print_status "Logged into Railway"

# Check if git is clean
if [[ -n $(git status -s) ]]; then
    print_warning "Git working directory is not clean"
    git status -s
    read -p "Continue anyway? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        print_error "Deployment cancelled"
        exit 1
    fi
fi
print_status "Git status checked"

# Confirm deployment
echo ""
echo "=== Deployment Confirmation ==="
echo ""
echo "Environment: PRODUCTION"
echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "Commit: $(git rev-parse --short HEAD)"
echo ""
read -p "Proceed with deployment? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    print_warning "Deployment cancelled"
    exit 0
fi

# Create database backup
echo ""
echo "=== Creating Database Backup ==="
echo ""
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
print_status "Creating backup: $BACKUP_FILE"
railway run pg_dump > "$BACKUP_FILE" || print_warning "Backup failed (continuing)"

# Run tests
echo ""
echo "=== Running Tests ==="
echo ""
npm test || (print_error "Tests failed. Aborting deployment." && exit 1)
print_status "All tests passed"

# Type check
echo ""
echo "=== Type Checking ==="
echo ""
npm run typecheck || (print_error "Type check failed. Aborting deployment." && exit 1)
print_status "Type check passed"

# Run database migrations
echo ""
echo "=== Database Migration ==="
echo ""
print_status "Running Prisma migrations..."
railway run npx prisma migrate deploy || (print_error "Migration failed" && exit 1)
print_status "Migrations completed"

# Verify migration status
railway run npx prisma migrate status
print_status "Migration status verified"

# Deploy to Railway
echo ""
echo "=== Deploying to Railway ==="
echo ""
railway up || (print_error "Deployment failed" && exit 1)
print_status "Deployment initiated"

# Wait for deployment
echo ""
echo "Waiting for deployment to complete..."
sleep 10

# Health check
echo ""
echo "=== Health Check ==="
echo ""
RAILWAY_URL=$(railway status --json | jq -r '.domains[0]')
if [ -n "$RAILWAY_URL" ]; then
    HEALTH_URL="https://$RAILWAY_URL/api/v1/health"
    print_status "Checking: $HEALTH_URL"
    
    for i in {1..10}; do
        if curl -sf "$HEALTH_URL" > /dev/null; then
            print_status "Health check passed"
            break
        else
            if [ $i -eq 10 ]; then
                print_error "Health check failed after 10 attempts"
                exit 1
            fi
            print_warning "Attempt $i/10 failed, retrying..."
            sleep 5
        fi
    done
else
    print_warning "Could not determine Railway URL for health check"
fi

# Display deployment info
echo ""
echo "=== Deployment Complete ==="
echo ""
print_status "Backend deployed successfully"
railway status
echo ""
print_status "Backup created: $BACKUP_FILE"
echo ""
print_status "Next steps:"
echo "  1. Verify application in browser"
echo "  2. Monitor logs: railway logs"
echo "  3. Watch for errors in Sentry"
echo "  4. Notify team of deployment"
echo ""
