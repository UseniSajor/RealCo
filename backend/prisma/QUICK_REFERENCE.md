# Prisma Quick Reference
## RealCo Finance & Escrow Schema

**Version:** 2.0.0 | **Updated:** 2026-01-22

---

## 🚀 Quick Commands

### Setup & Migration
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migration (dev)
npx prisma migrate dev --name migration_name

# Run migration (production)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Seed database
npm run seed

# Open Prisma Studio
npx prisma studio
```

### Database Management
```bash
# View schema
npx prisma db pull

# Validate schema
npx prisma validate

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Format schema
npx prisma format
```

---

## 📊 Schema Overview

### Core Models (24 total)

**Platform Core**
- Organization, User, Offering

**Construction (9 models)**
- DevelopmentProject, Project, Task, Milestone
- DailyLog, Rfi, Submittal, Inspection, SafetyIncident

**Finance & Escrow (9 models)**
- BankAccount, Transaction, TransactionWebhook
- EscrowAccount, EscrowLedgerEntry
- Distribution, DistributionAllocation
- Investment, TransactionLimit, ComplianceCheck

**Audit**
- AuditEvent

---

## 💡 Common Queries

### Transactions

```typescript
// Create transaction
const tx = await prisma.transaction.create({
  data: {
    type: 'DEPOSIT',
    status: 'INITIATED',
    paymentMethod: 'ACH',
    amount: 10000,
    feeAmount: 50,
    netAmount: 9950,
    fromUserId: 'user-id',
    offeringId: 'offering-id',
    idempotencyKey: `tx-${Date.now()}-${Math.random()}`,
  },
});

// Get transaction with relations
const tx = await prisma.transaction.findUnique({
  where: { id },
  include: {
    fromUser: { select: { id: true, email: true } },
    offering: { select: { id: true, name: true } },
  },
});

// List user transactions
const txs = await prisma.transaction.findMany({
  where: { fromUserId: userId },
  orderBy: { createdAt: 'desc' },
  take: 50,
});

// Get pending transactions
const pending = await prisma.transaction.findMany({
  where: {
    status: { in: ['INITIATED', 'PENDING_APPROVAL', 'QUEUED'] },
  },
});

// Aggregate transaction totals
const stats = await prisma.transaction.aggregate({
  where: { status: 'COMPLETED' },
  _sum: { amount: true, feeAmount: true },
  _count: true,
});
```

### Escrow Accounts

```typescript
// Create escrow account
const escrow = await prisma.escrowAccount.create({
  data: {
    offeringId: 'offering-id',
    accountNumber: `ESCROW-${new Date().getFullYear()}-001`,
    status: 'ACTIVE',
  },
});

// Get account balance
const account = await prisma.escrowAccount.findUnique({
  where: { offeringId },
  select: {
    currentBalance: true,
    availableBalance: true,
    pendingBalance: true,
    heldBalance: true,
  },
});

// Get ledger history (last 30 days)
const entries = await prisma.escrowLedgerEntry.findMany({
  where: {
    escrowAccountId,
    createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  },
  orderBy: { createdAt: 'desc' },
  take: 100,
});

// Update balance (with ledger entry)
await prisma.$transaction(async (tx) => {
  const account = await tx.escrowAccount.findUnique({
    where: { id: escrowAccountId },
  });
  
  await tx.escrowLedgerEntry.create({
    data: {
      escrowAccountId,
      transactionId,
      entryType: 'DEPOSIT',
      amount: 10000,
      balanceBefore: account!.currentBalance,
      balanceAfter: account!.currentBalance + 10000,
      description: 'Investor deposit',
    },
  });
  
  await tx.escrowAccount.update({
    where: { id: escrowAccountId },
    data: {
      currentBalance: { increment: 10000 },
      availableBalance: { increment: 10000 },
    },
  });
});
```

### Distributions

```typescript
// Create distribution
const dist = await prisma.distribution.create({
  data: {
    offeringId,
    escrowAccountId,
    distributionNumber: `DIST-${new Date().getFullYear()}-0001`,
    distributionType: 'RETURN_OF_CAPITAL',
    status: 'DRAFT',
    totalAmount: 100000,
    netAmount: 100000,
  },
});

// Get distribution with allocations
const dist = await prisma.distribution.findUnique({
  where: { id },
  include: {
    allocations: {
      include: {
        investor: { select: { email: true } },
      },
    },
  },
});

// Calculate distribution allocations
const investments = await prisma.investment.findMany({
  where: { offeringId, status: 'ACTIVE' },
});

for (const inv of investments) {
  await prisma.distributionAllocation.create({
    data: {
      distributionId: dist.id,
      investorId: inv.investorId,
      investmentId: inv.id,
      returnOfCapital: calculateReturnOfCapital(inv),
      preferredReturn: calculatePreferredReturn(inv),
      profitSplit: calculateProfitSplit(inv),
      totalAmount: /* sum of above */,
      status: 'PENDING',
    },
  });
}
```

### Investments

```typescript
// Create investment
const investment = await prisma.investment.create({
  data: {
    investorId: userId,
    offeringId,
    investmentAmount: 50000,
    currentBalance: 50000,
    preferredReturnRate: 0.08, // 8%
    status: 'ACTIVE',
    fundedAt: new Date(),
    ownershipPercentage: 5.0,
  },
});

// Get investor investments
const investments = await prisma.investment.findMany({
  where: { investorId: userId },
  include: {
    offering: { select: { name: true } },
  },
});

// Calculate preferred return owed
const daysSinceFunded = Math.floor(
  (Date.now() - investment.fundedAt.getTime()) / (1000 * 60 * 60 * 24)
);
const dailyReturn = (investment.investmentAmount * 0.08) / 365;
const preferredOwed = dailyReturn * daysSinceFunded - investment.preferredReturnPaid;
```

---

## 🔐 Environment Variables

```env
# Database (Required)
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10"

# JWT (Required)
JWT_SECRET="your-256-bit-secret"

# Encryption (Required)
ENCRYPTION_KEY="64-char-hex-string"

# Stripe (Required for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Plaid (Required for bank accounts)
PLAID_CLIENT_ID="your-client-id"
PLAID_SECRET="your-secret"
PLAID_ENV="sandbox"

# AWS S3 (Required for construction photos)
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_S3_BUCKET="realco-construction"

# Redis (Optional - for caching)
REDIS_URL="redis://localhost:6379"
```

---

## 🎯 State Machines

### Transaction Status Flow
```
INITIATED
  ↓
PENDING_APPROVAL (large amounts)
  ↓
APPROVED
  ↓
QUEUED
  ↓
PROCESSING
  ↓
PENDING_SETTLEMENT (ACH 3-5 days)
  ↓
SETTLED
  ↓
COMPLETED

OR → FAILED (can retry)
OR → CANCELLED (before processing)
OR → REVERSED (refund)
```

### Distribution Status Flow
```
DRAFT
  ↓
PENDING_APPROVAL
  ↓
APPROVED
  ↓
QUEUED
  ↓
PROCESSING
  ↓
COMPLETED

OR → PARTIALLY_FAILED (some payments failed)
OR → FAILED (all failed)
OR → CANCELLED (before processing)
```

---

## 📝 TypeScript Types

```typescript
import {
  PrismaClient,
  Transaction,
  TransactionType,
  TransactionStatus,
  PaymentMethod,
  EscrowAccount,
  Distribution,
  Investment,
} from '@prisma/client';

// Transaction with relations
type TransactionWithUser = Transaction & {
  fromUser: { id: string; email: string } | null;
  toUser: { id: string; email: string } | null;
};

// Distribution with allocations
type DistributionWithAllocations = Distribution & {
  allocations: DistributionAllocation[];
};
```

---

## ⚡ Performance Tips

1. **Use `select` instead of fetching all fields**
   ```typescript
   // Bad: Fetches all fields
   const tx = await prisma.transaction.findUnique({ where: { id } });
   
   // Good: Only fetch needed fields
   const tx = await prisma.transaction.findUnique({
     where: { id },
     select: { id: true, amount: true, status: true },
   });
   ```

2. **Avoid N+1 queries - use batch fetching**
   ```typescript
   // Bad: N+1 query
   for (const tx of transactions) {
     const user = await prisma.user.findUnique({ where: { id: tx.fromUserId } });
   }
   
   // Good: Single query
   const userIds = transactions.map(tx => tx.fromUserId);
   const users = await prisma.user.findMany({ where: { id: { in: userIds } } });
   ```

3. **Use cursor-based pagination for large datasets**
   ```typescript
   // Bad: Offset pagination (slow for large offsets)
   const txs = await prisma.transaction.findMany({
     skip: page * 50,
     take: 50,
   });
   
   // Good: Cursor pagination
   const txs = await prisma.transaction.findMany({
     cursor: cursor ? { id: cursor } : undefined,
     skip: cursor ? 1 : 0,
     take: 50,
   });
   ```

4. **Use transactions for multi-table updates**
   ```typescript
   await prisma.$transaction(async (tx) => {
     await tx.transaction.create({ data: txData });
     await tx.escrowLedgerEntry.create({ data: ledgerData });
     await tx.escrowAccount.update({ where, data });
   });
   ```

---

## 🔍 Debugging

### Enable Query Logging
```typescript
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

prisma.$on('query', (e) => {
  console.log('Query:', e.query);
  console.log('Duration:', e.duration, 'ms');
});
```

### Check Database Connection
```bash
# Test connection
psql $DATABASE_URL

# Check active connections
SELECT count(*) FROM pg_stat_activity;
```

### View Migration Status
```bash
npx prisma migrate status
```

---

## 📚 Documentation

- [README.md](./README.md) - Getting started
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration steps
- [SCHEMA_CHANGES.md](./SCHEMA_CHANGES.md) - Complete schema docs
- [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) - Performance guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Implementation summary

---

## 🆘 Common Issues

**Migration fails:**
```bash
npx prisma migrate status
npx prisma migrate resolve --rolled-back <migration>
```

**Connection errors:**
```bash
# Check DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

**Slow queries:**
```sql
-- Enable logging
ALTER SYSTEM SET log_min_duration_statement = 100;
SELECT pg_reload_conf();
```

---

## 📞 Support

- **Docs:** [./README.md](./README.md)
- **Slack:** #engineering-database
- **Email:** engineering@realco.com

---

**Quick Reference v2.0.0** | © 2026 RealCo



