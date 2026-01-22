#!/bin/bash

# =============================================================================
# RealCo Platform - Database Migration Script
# =============================================================================
# Safe database migration with backup and rollback capability
# Usage: ./scripts/migrate-database.sh [environment]
# Example: ./scripts/migrate-database.sh production
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
ENVIRONMENT=${1:-production}
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/migration_backup_${TIMESTAMP}.sql"

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup
create_backup() {
    log_info "Creating database backup..."
    mkdir -p "$BACKUP_DIR"
    
    if [ "$ENVIRONMENT" == "production" ]; then
        railway run pg_dump -Fc > "$BACKUP_FILE"
    else
        pg_dump -Fc $DATABASE_URL > "$BACKUP_FILE"
    fi
    
    log_info "Backup created: $BACKUP_FILE"
    log_info "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
}

# Check migration status
check_status() {
    log_info "Current migration status:"
    
    if [ "$ENVIRONMENT" == "production" ]; then
        railway run npx prisma migrate status
    else
        npx prisma migrate status
    fi
}

# Run migrations
run_migrations() {
    log_info "Running migrations..."
    
    if [ "$ENVIRONMENT" == "production" ]; then
        railway run npx prisma migrate deploy
    else
        npx prisma migrate dev
    fi
}

# Verify migration
verify_migration() {
    log_info "Verifying migration..."
    
    if [ "$ENVIRONMENT" == "production" ]; then
        railway run npx prisma migrate status
    else
        npx prisma migrate status
    fi
}

# Rollback function
rollback() {
    log_error "Migration failed! Rolling back..."
    
    if [ -f "$BACKUP_FILE" ]; then
        log_info "Restoring from backup: $BACKUP_FILE"
        
        if [ "$ENVIRONMENT" == "production" ]; then
            railway run pg_restore -d \$DATABASE_URL "$BACKUP_FILE"
        else
            pg_restore -d $DATABASE_URL "$BACKUP_FILE"
        fi
        
        log_info "Database restored from backup"
    else
        log_error "No backup file found!"
    fi
}

# Main
main() {
    log_info "Starting database migration for: $ENVIRONMENT"
    log_info "Timestamp: $TIMESTAMP"
    
    # Confirm
    log_warn "This will modify the database schema"
    read -p "Continue? (yes/no): " -r
    if [[ ! $REPLY == "yes" ]]; then
        log_warn "Migration cancelled"
        exit 0
    fi
    
    # Backup
    create_backup
    
    # Status
    check_status
    
    # Migrate
    if run_migrations; then
        log_info "Migration successful"
        verify_migration
    else
        rollback
        exit 1
    fi
    
    log_info "Migration completed successfully!"
}

# Trap errors
trap 'rollback; exit 1' ERR

# Run
main
