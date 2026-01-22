#!/bin/bash

# =============================================================================
# RealCo Platform - Production Deployment Script
# =============================================================================
# This script handles production deployment with safety checks
# Usage: ./scripts/deploy-production.sh
# =============================================================================

set -e # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

# =============================================================================
# Helper Functions
# =============================================================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        log_error "Railway CLI not found. Install with: npm install -g @railway/cli"
        exit 1
    fi
    log_info "Railway CLI found"
}

check_environment() {
    log_info "Checking environment..."
    
    # Verify we're on the right branch
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        log_error "Not on main branch. Current branch: $CURRENT_BRANCH"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Check for uncommitted changes
    if [[ -n $(git status -s) ]]; then
        log_warn "Uncommitted changes detected"
        git status -s
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    log_info "Environment check passed"
}

create_backup() {
    log_info "Creating database backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Create backup using Railway
    if railway run pg_dump -Fc > "$BACKUP_FILE"; then
        log_info "Backup created: $BACKUP_FILE"
        
        # Get backup size
        BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        log_info "Backup size: $BACKUP_SIZE"
        
        # Keep only last 7 backups
        log_info "Cleaning old backups (keeping last 7)..."
        cd "$BACKUP_DIR"
        ls -t backup_*.sql | tail -n +8 | xargs -r rm
        cd ..
    else
        log_error "Backup failed!"
        exit 1
    fi
}

run_tests() {
    log_info "Running tests..."
    
    if npm test; then
        log_info "Tests passed"
    else
        log_error "Tests failed!"
        exit 1
    fi
}

check_migration_status() {
    log_info "Checking migration status..."
    
    railway run npx prisma migrate status
    
    read -p "Proceed with migration? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warn "Deployment cancelled by user"
        exit 0
    fi
}

run_migrations() {
    log_info "Running database migrations..."
    
    if railway run npx prisma migrate deploy; then
        log_info "Migrations completed successfully"
    else
        log_error "Migration failed!"
        log_error "Rolling back..."
        # TODO: Implement rollback logic
        exit 1
    fi
    
    # Verify migration
    log_info "Verifying migration..."
    railway run npx prisma migrate status
}

generate_prisma_client() {
    log_info "Generating Prisma client..."
    
    if railway run npx prisma generate; then
        log_info "Prisma client generated"
    else
        log_error "Prisma client generation failed!"
        exit 1
    fi
}

build_application() {
    log_info "Building application..."
    
    if npm run build; then
        log_info "Build completed successfully"
    else
        log_error "Build failed!"
        exit 1
    fi
}

deploy_to_railway() {
    log_info "Deploying to Railway..."
    
    if railway up; then
        log_info "Deployment initiated"
    else
        log_error "Deployment failed!"
        exit 1
    fi
}

verify_deployment() {
    log_info "Verifying deployment..."
    
    # Wait for deployment to be ready
    sleep 10
    
    # Check health endpoint
    HEALTH_URL="https://api.realco.com/api/v1/health/live"
    
    log_info "Checking health endpoint: $HEALTH_URL"
    
    if curl -f -s "$HEALTH_URL" > /dev/null; then
        log_info "Health check passed"
    else
        log_error "Health check failed!"
        exit 1
    fi
}

run_smoke_tests() {
    log_info "Running smoke tests..."
    
    # Test version endpoint
    VERSION_URL="https://api.realco.com/api/v1/version"
    VERSION=$(curl -s "$VERSION_URL" | jq -r '.version')
    
    if [ -n "$VERSION" ]; then
        log_info "API version: $VERSION"
    else
        log_error "Could not retrieve API version"
        exit 1
    fi
    
    log_info "Smoke tests passed"
}

# =============================================================================
# Main Deployment Flow
# =============================================================================

main() {
    log_info "Starting production deployment..."
    log_info "Timestamp: $TIMESTAMP"
    echo
    
    # Pre-deployment checks
    check_railway_cli
    check_environment
    
    # Confirm deployment
    log_warn "This will deploy to PRODUCTION"
    read -p "Are you sure you want to continue? (yes/no): " -r
    echo
    if [[ ! $REPLY == "yes" ]]; then
        log_warn "Deployment cancelled"
        exit 0
    fi
    
    # Deployment steps
    create_backup
    run_tests
    check_migration_status
    run_migrations
    generate_prisma_client
    build_application
    deploy_to_railway
    verify_deployment
    run_smoke_tests
    
    # Success
    echo
    log_info "========================================="
    log_info "Deployment completed successfully! 🚀"
    log_info "========================================="
    log_info "Backup: $BACKUP_FILE"
    log_info "Timestamp: $TIMESTAMP"
    log_info "API: https://api.realco.com"
    log_info "========================================="
}

# Handle script interruption
trap 'log_error "Deployment interrupted"; exit 1' INT TERM

# Run main function
main
