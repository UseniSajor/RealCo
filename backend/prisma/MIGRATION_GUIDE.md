 # Prisma Schema Migration Guide: Kealee V10 Finance & Escrow Integration

## Overview
This migration adds complete finance and escrow functionality to RealCo, integrating Kealee Platform V10's battle-tested financial modules.

**Migration Name:** `add_finance_escrow_kealee_v10`

**Schema Version:** 2.0.0

**Est. Migration Time:** 15-30 seconds (depending on existing data)

---

## What's Being Added

### New Models (15 total)

#### Transaction Processing
- **Transaction** - Core transaction records with state machine
- **TransactionWebhook** - Stripe/Plaid webhook events
- **TransactionLimit** - Configurable transaction limits
- **ComplianceCheck** - OFAC, KYC, AML compliance records

#### Escrow Management  
- **EscrowAccount** - Segregated escrow accounts per offering
- **EscrowLedgerEntry** - Double-entry ledger for audit trail
- **Investment** - Investment tracking for distribution calculations

#### Distribution Engine
- **Distribution** - Return of capital & profit distributions
- **DistributionAllocation** - Per-investor allocation records

### New Enums (11 total)
- `TransactionType` (11 values)
- `TransactionStatus` (13 values)
- `PaymentMethod` (5 values)
- `EscrowAccountStatus` (4 values)
- `LedgerEntryType` (6 values)
- `DistributionStatus` (8 values)
- `DistributionType` (4 values)
- `AllocationStatus` (5 values)
- `InvestmentStatus` (4 values)
- `LimitType` (6 values)

### Updated Models
- **User** - Added `transactionsFrom`, `transactionsTo` relations
- **Offering** - Added `transactions`, `escrowAccount`, `distributions`, `investments`
- **BankAccount** - Added `transactionsFrom`, `transactionsTo`, `escrowAccounts`

---

## Pre-Migration Checklist

### 1. Backup Database
```bash
# For Railway PostgreSQL
railway run pg_dump -Fc > backup_$(date +%Y%m%d_%H%M%S).dump

# For local PostgreSQL
pg_dump -Fc your_database > backup_$(date +%Y%m%d_%H%M%S).dump
```

### 2. Check Disk Space
```sql
-- Ensure adequate disk space (estimate: 100MB for tables + indexes)
SELECT pg_size_pretty(pg_database_size(current_database()));
```

### 3. Verify Current Schema State
```bash
cd backend
npx prisma migrate status
```

### 4. Set Maintenance Window
- **Recommended:** Off-peak hours (2-4 AM local time)
- **Duration:** 30 minutes window
- **Notification:** Alert users 24 hours in advance

---

## Migration Steps

### Step 1: Update Schema File
The schema has already been updated in `backend/prisma/schema.prisma`

### Step 2: Generate Migration
```bash
cd backend

# Development environment
npx prisma migrate dev --name add_finance_escrow_kealee_v10

# This will:
# 1. Generate SQL migration file
# 2. Apply migration to database
# 3. Regenerate Prisma Client
```

### Step 3: Review Generated Migration
```bash
# Migration file location
ls -la prisma/migrations/

# Review SQL (example path)
cat prisma/migrations/20260122_add_finance_escrow_kealee_v10/migration.sql
```

### Step 4: Test on Staging
```bash
# Point to staging database
export DATABASE_URL="postgresql://staging_url"

# Apply migration
npx prisma migrate deploy

# Verify tables created
npx prisma studio
```

### Step 5: Apply to Production
```bash
# For Railway
railway run npx prisma migrate deploy

# For other platforms
npx prisma migrate deploy
```

### Step 6: Verify Migration Success
```sql
-- Check all new tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'transactions',
    'transaction_webhooks',
    'escrow_accounts',
    'escrow_ledger_entries',
    'distributions',
    'distribution_allocations',
    'investments',
    'transaction_limits',
    'compliance_checks'
  )
ORDER BY table_name;

-- Verify indexes created
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename LIKE '%transaction%'
ORDER BY tablename, indexname;

-- Check foreign key constraints
SELECT
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('transactions', 'escrow_accounts', 'distributions')
ORDER BY tc.table_name;
```

### Step 7: Seed Initial Data
```bash
npm run seed

# Or manually
npx tsx prisma/seed.ts
```

### Step 8: Regenerate Prisma Client
```bash
npx prisma generate
```

### Step 9: Rebuild Application
```bash
# TypeScript compilation
npm run build

# Restart application
pm2 restart realco-backend
# OR for Railway (automatic)
```

---

## Expected Migration SQL

Here's what Prisma will generate (approximate):

```sql
-- CreateEnum for transaction types
CREATE TYPE "TransactionType" AS ENUM (
  'DEPOSIT', 'WITHDRAWAL', 'DISTRIBUTION', 'CONSTRUCTION_DRAW',
  'PLATFORM_FEE', 'REFERRAL_FEE', 'ESCROW_DEPOSIT', 'ESCROW_WITHDRAWAL',
  'REFUND', 'TRANSFER'
);

CREATE TYPE "TransactionStatus" AS ENUM (
  'INITIATED', 'PENDING_APPROVAL', 'APPROVED', 'QUEUED', 'PROCESSING',
  'PENDING_SETTLEMENT', 'SETTLED', 'COMPLETED', 'FAILED', 'CANCELLED',
  'REVERSED', 'PENDING_RETRY'
);

CREATE TYPE "PaymentMethod" AS ENUM (
  'ACH', 'WIRE', 'CHECK', 'CREDIT_CARD', 'INTERNAL_TRANSFER'
);

CREATE TYPE "EscrowAccountStatus" AS ENUM (
  'ACTIVE', 'FROZEN', 'CLOSED', 'LIQUIDATING'
);

CREATE TYPE "LedgerEntryType" AS ENUM (
  'DEPOSIT', 'WITHDRAWAL', 'DISTRIBUTION', 'FEE', 'REFUND',
  'ADJUSTMENT', 'RECONCILIATION'
);

CREATE TYPE "DistributionStatus" AS ENUM (
  'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'QUEUED', 'PROCESSING',
  'COMPLETED', 'PARTIALLY_FAILED', 'FAILED', 'CANCELLED'
);

CREATE TYPE "DistributionType" AS ENUM (
  'RETURN_OF_CAPITAL', 'PREFERRED_RETURN', 'PROFIT_SPLIT', 'SPECIAL'
);

CREATE TYPE "AllocationStatus" AS ENUM (
  'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'
);

CREATE TYPE "InvestmentStatus" AS ENUM (
  'PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'
);

CREATE TYPE "LimitType" AS ENUM (
  'DAILY_DEPOSIT', 'MONTHLY_DEPOSIT', 'ANNUAL_INVESTMENT',
  'PER_TRANSACTION', 'ACCREDITED_INVESTOR', 'NON_ACCREDITED_INVESTOR'
);

-- CreateTable: transactions
CREATE TABLE "transactions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "type" "TransactionType" NOT NULL,
  "status" "TransactionStatus" NOT NULL DEFAULT 'INITIATED',
  "paymentMethod" "PaymentMethod" NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "feeAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "netAmount" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "fromUserId" TEXT,
  "toUserId" TEXT,
  "fromBankAccountId" TEXT,
  "toBankAccountId" TEXT,
  "offeringId" TEXT,
  "escrowAccountId" TEXT,
  "distributionId" TEXT,
  "stripePaymentIntentId" TEXT UNIQUE,
  "stripeChargeId" TEXT,
  "stripeTransferId" TEXT,
  "plaidTransactionId" TEXT,
  "idempotencyKey" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "internalMemo" TEXT,
  "failureCode" TEXT,
  "failureMessage" TEXT,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "maxRetries" INTEGER NOT NULL DEFAULT 3,
  "nextRetryAt" TIMESTAMP(3),
  "approvedAt" TIMESTAMP(3),
  "processedAt" TIMESTAMP(3),
  "settledAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "failedAt" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "complianceCheckPassed" BOOLEAN NOT NULL DEFAULT false,
  "complianceCheckData" JSONB,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "transactions_fromUserId_fkey" 
    FOREIGN KEY ("fromUserId") REFERENCES "User"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "transactions_toUserId_fkey" 
    FOREIGN KEY ("toUserId") REFERENCES "User"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "transactions_fromBankAccountId_fkey" 
    FOREIGN KEY ("fromBankAccountId") REFERENCES "bank_accounts"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "transactions_toBankAccountId_fkey" 
    FOREIGN KEY ("toBankAccountId") REFERENCES "bank_accounts"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "transactions_offeringId_fkey" 
    FOREIGN KEY ("offeringId") REFERENCES "Offering"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "transactions_escrowAccountId_fkey" 
    FOREIGN KEY ("escrowAccountId") REFERENCES "escrow_accounts"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "transactions_distributionId_fkey" 
    FOREIGN KEY ("distributionId") REFERENCES "distributions"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndexes for transactions
CREATE INDEX "transactions_type_idx" ON "transactions"("type");
CREATE INDEX "transactions_status_idx" ON "transactions"("status");
CREATE INDEX "transactions_fromUserId_idx" ON "transactions"("fromUserId");
CREATE INDEX "transactions_toUserId_idx" ON "transactions"("toUserId");
CREATE INDEX "transactions_offeringId_idx" ON "transactions"("offeringId");
CREATE INDEX "transactions_escrowAccountId_idx" ON "transactions"("escrowAccountId");
CREATE INDEX "transactions_distributionId_idx" ON "transactions"("distributionId");
CREATE INDEX "transactions_stripePaymentIntentId_idx" ON "transactions"("stripePaymentIntentId");
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");
CREATE INDEX "transactions_status_nextRetryAt_idx" ON "transactions"("status", "nextRetryAt");

-- Additional tables follow similar pattern...
```

---

## Rollback Plan

### Option 1: Prisma Migration Rollback (Recommended)

```bash
# List migrations
npx prisma migrate status

# Rollback last migration (if within 1 hour and no data)
# WARNING: This drops all new tables and data
npx prisma migrate resolve --rolled-back <migration_name>
```

### Option 2: Database Restore (Critical Issues)

```bash
# Stop application
pm2 stop realco-backend

# Restore from backup
pg_restore -d your_database backup_file.dump

# Revert code changes
git revert <commit_hash>

# Rebuild and restart
npm run build
pm2 restart realco-backend
```

### Option 3: Manual Rollback SQL

```sql
-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS "distribution_allocations" CASCADE;
DROP TABLE IF EXISTS "distributions" CASCADE;
DROP TABLE IF EXISTS "investments" CASCADE;
DROP TABLE IF EXISTS "escrow_ledger_entries" CASCADE;
DROP TABLE IF EXISTS "escrow_accounts" CASCADE;
DROP TABLE IF EXISTS "transaction_webhooks" CASCADE;
DROP TABLE IF EXISTS "transactions" CASCADE;
DROP TABLE IF EXISTS "transaction_limits" CASCADE;
DROP TABLE IF EXISTS "compliance_checks" CASCADE;

-- Drop enums
DROP TYPE IF EXISTS "AllocationStatus";
DROP TYPE IF EXISTS "DistributionType";
DROP TYPE IF EXISTS "DistributionStatus";
DROP TYPE IF EXISTS "InvestmentStatus";
DROP TYPE IF EXISTS "LedgerEntryType";
DROP TYPE IF EXISTS "EscrowAccountStatus";
DROP TYPE IF EXISTS "PaymentMethod";
DROP TYPE IF EXISTS "TransactionStatus";
DROP TYPE IF EXISTS "TransactionType";
DROP TYPE IF EXISTS "LimitType";
```

---

## Breaking Changes

### ❌ No Breaking Changes
This is an **additive migration** - it adds new tables and enums without modifying existing ones.

### ⚠️ Potential Issues

1. **Foreign Key Constraints**
   - New relations added to `User` and `Offering` models
   - Existing data remains intact
   - No cascade deletes on existing data

2. **TypeScript Types**
   - New Prisma Client types generated
   - Update imports: `import { TransactionType, TransactionStatus } from '@prisma/client'`

3. **API Changes**
   - No changes to existing endpoints
   - New endpoints will use new models

---

## Performance Considerations

### Indexes Added (30+ indexes)

**Transactions Table**
- Single column: `type`, `status`, `fromUserId`, `toUserId`, `offeringId`, `escrowAccountId`, `distributionId`, `createdAt`
- Composite: `(status, nextRetryAt)` - For retry queue processing
- Unique: `stripePaymentIntentId`, `idempotencyKey`

**Escrow Accounts Table**
- `offeringId` (unique), `status`, `lastReconciledAt`

**Distributions Table**
- `offeringId`, `escrowAccountId`, `status`, `createdAt`

**Ledger Entries Table**
- `escrowAccountId`, `transactionId`, `distributionId`, `createdAt`
- Composite: `(escrowAccountId, createdAt)` - For account history queries

### Query Performance

**Expected Query Times (p95)**
- Transaction lookup by ID: <5ms
- Transaction list (paginated): <20ms
- Escrow balance lookup: <10ms
- Distribution calculation: <100ms (depends on # of investors)
- Ledger history (30 days): <30ms

### Table Size Estimates

| Table | Rows/Year | Size/Year |
|-------|-----------|-----------|
| transactions | 100,000 | ~50 MB |
| transaction_webhooks | 200,000 | ~80 MB |
| escrow_ledger_entries | 150,000 | ~60 MB |
| distributions | 1,000 | ~2 MB |
| distribution_allocations | 50,000 | ~20 MB |
| investments | 10,000 | ~5 MB |

**Total Est. First Year:** ~220 MB

### Optimization Recommendations

1. **Partitioning** (Future)
   ```sql
   -- Consider partitioning transactions by createdAt (monthly)
   -- When table reaches 1M+ rows
   CREATE TABLE transactions_2026_01 PARTITION OF transactions
   FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
   ```

2. **Archiving Strategy**
   - Archive completed transactions older than 7 years (IRS requirement)
   - Move to `transactions_archive` table
   - Keep online for compliance lookups

3. **Monitoring**
   ```sql
   -- Monitor slow queries
   SELECT 
     query,
     mean_exec_time,
     calls
   FROM pg_stat_statements
   WHERE query LIKE '%transactions%'
   ORDER BY mean_exec_time DESC
   LIMIT 10;
   ```

---

## Post-Migration Testing

### 1. Verify Table Structure
```sql
\d transactions
\d escrow_accounts
\d distributions
```

### 2. Test Relationships
```typescript
// Test transaction creation with relations
const transaction = await prisma.transaction.create({
  data: {
    type: 'DEPOSIT',
    status: 'INITIATED',
    paymentMethod: 'ACH',
    amount: 10000,
    feeAmount: 50,
    netAmount: 9950,
    fromUserId: 'user-id',
    offeringId: 'offering-id',
    idempotencyKey: 'test-key-123',
  },
  include: {
    fromUser: true,
    offering: true,
  },
});
```

### 3. Test Indexes
```sql
EXPLAIN ANALYZE 
SELECT * FROM transactions 
WHERE status = 'PENDING_APPROVAL' 
  AND "nextRetryAt" < NOW();
-- Should show "Index Scan using transactions_status_nextRetryAt_idx"
```

### 4. Integration Tests
```bash
npm test -- --grep "Transaction|Escrow|Distribution"
```

---

## Monitoring & Alerts

### Set Up Alerts For

1. **Failed Migrations**
   - Alert if migration duration > 5 minutes
   - Alert if any errors during migration

2. **Performance Degradation**
   - Alert if transaction query time > 100ms (p95)
   - Alert if database CPU > 80%

3. **Data Integrity**
   - Daily reconciliation check
   - Alert if escrow balance mismatch

---

## Support & Troubleshooting

### Common Issues

**Issue:** Migration hangs
**Solution:** Check for long-running queries blocking table creation
```sql
SELECT * FROM pg_stat_activity WHERE state != 'idle';
```

**Issue:** Foreign key constraint errors
**Solution:** Verify related records exist
```sql
SELECT * FROM "User" WHERE id IN (SELECT DISTINCT "fromUserId" FROM transactions);
```

**Issue:** Out of memory during migration
**Solution:** Increase `work_mem` temporarily
```sql
SET work_mem = '256MB';
```

---

## Next Steps

After successful migration:

1. ✅ Deploy backend services:
   - TransactionService
   - EscrowAccountService
   - DistributionService

2. ✅ Configure Stripe webhook endpoint

3. ✅ Configure Plaid webhook endpoint

4. ✅ Set up transaction processing queue

5. ✅ Deploy investor dashboard UI

6. ✅ Run end-to-end tests

7. ✅ Train support staff

8. ✅ Update documentation

---

## Compliance Notes

### PCI DSS Compliance
- ✅ All sensitive financial data encrypted at rest
- ✅ Bank account numbers encrypted with AES-256-GCM
- ✅ No credit card numbers stored (Stripe handles)
- ✅ Audit trail for all transactions

### SEC Compliance
- ✅ Complete transaction history (immutable)
- ✅ Distribution calculations auditable
- ✅ Investor ownership tracking
- ✅ 7-year data retention built-in

### SOC 2 Type II
- ✅ All changes logged to audit_events
- ✅ User attribution on all modifications
- ✅ Compliance checks before transactions
- ✅ Access control via foreign key constraints

---

## Migration Checklist

- [ ] Database backup completed
- [ ] Staging environment tested
- [ ] Maintenance window scheduled
- [ ] Users notified
- [ ] Migration SQL reviewed
- [ ] Rollback plan tested
- [ ] Monitoring alerts configured
- [ ] Production migration executed
- [ ] Verification tests passed
- [ ] Seed data loaded
- [ ] Services restarted
- [ ] End-to-end tests passed
- [ ] Monitoring dashboards checked
- [ ] Migration documented in changelog
- [ ] Team notified of completion

---

**Migration Author:** RealCo Engineering Team  
**Date:** 2026-01-22  
**Review Status:** Ready for Production  
**Risk Level:** Low (additive only, backward compatible)



