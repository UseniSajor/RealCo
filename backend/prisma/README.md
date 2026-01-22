# RealCo Prisma Schema Documentation

## Quick Links

- 📘 [Schema Overview](#schema-overview)
- 🚀 [Quick Start](#quick-start)
- 📋 [Migration Guide](./MIGRATION_GUIDE.md)
- 📊 [Schema Changes](./SCHEMA_CHANGES.md)
- ⚡ [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)

---

## Schema Overview

### Current Version: 2.0.0
**Last Updated:** 2026-01-22

### Database Models (24 total)

#### Core Platform
- **Organization** - Multi-tenant organizations
- **User** - Platform users with role-based access
- **Offering** - Real estate investment offerings

#### Construction Management (Kealee m-os-pm)
- **DevelopmentProject** - Real estate development projects
- **Project** - Construction project details
- **Task** - Task management with dependencies
- **Milestone** - Project milestones
- **DailyLog** - Daily construction logs
- **Rfi** - Requests for Information
- **Submittal** - Material/equipment submittals
- **Inspection** - Quality control inspections
- **SafetyIncident** - Safety incident tracking

#### Finance & Escrow (Kealee Finance)
- **BankAccount** - Verified bank accounts (encrypted)
- **Transaction** - All financial transactions
- **TransactionWebhook** - Stripe/Plaid webhook events
- **EscrowAccount** - Segregated escrow accounts
- **EscrowLedgerEntry** - Double-entry ledger
- **Distribution** - Capital & profit distributions
- **DistributionAllocation** - Per-investor allocations
- **Investment** - Investment tracking
- **TransactionLimit** - Regulatory limits
- **ComplianceCheck** - OFAC/KYC/AML checks

#### Audit
- **AuditEvent** - System-wide audit trail

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

```bash
# Install dependencies
cd backend
npm install

# Set up environment
cp .env.example .env
# Edit .env and set DATABASE_URL
```

### Database Setup

#### Option 1: Local PostgreSQL (Docker)

```bash
# Start PostgreSQL
docker run --name realco-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=realco \
  -p 5432:5432 \
  -d postgres:15

# Set DATABASE_URL
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/realco"
```

#### Option 2: Railway PostgreSQL

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Get DATABASE_URL
railway variables

# Or run commands via Railway
railway run npx prisma migrate dev
```

### Run Migration

```bash
# Development (creates migration + applies)
npx prisma migrate dev --name add_finance_escrow_kealee_v10

# Production (applies pending migrations)
npx prisma migrate deploy

# Check status
npx prisma migrate status
```

### Seed Database

```bash
# Seed demo data
npm run seed

# Or manually
npx tsx prisma/seed.ts
```

**Seeded Data:**
- 3 demo users (admin, demo, investor)
- 1 organization
- 6 transaction limits
- 1 demo offering with escrow account
- 1 demo investment
- 1 demo development project

**Demo Credentials:**
- Admin: `admin@realco.com` / `admin123`
- Demo: `demo@realco.com` / `demo123`
- Investor: `investor@realco.com` / `investor123`

### Generate Prisma Client

```bash
# Generate TypeScript types
npx prisma generate
```

### Open Prisma Studio (Database GUI)

```bash
npx prisma studio
# Opens at http://localhost:5555
```

---

## Schema Visualization

```
Organization
├── Users
│   ├── BankAccounts (encrypted)
│   │   └── Transactions
│   ├── Tasks (assigned)
│   └── DailyLogs (created)
│
├── Offerings
│   ├── DevelopmentProjects
│   │   └── Projects (construction)
│   │       ├── Tasks
│   │       ├── Milestones
│   │       ├── DailyLogs
│   │       ├── RFIs
│   │       ├── Submittals
│   │       ├── Inspections
│   │       └── SafetyIncidents
│   │
│   ├── Investments
│   ├── EscrowAccount
│   │   ├── Transactions
│   │   └── LedgerEntries
│   │
│   └── Distributions
│       └── Allocations
│           └── Transactions
```

---

## Environment Variables

### Required

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname?connection_limit=10"

# JWT Authentication
JWT_SECRET="your-256-bit-secret-here"

# Encryption (bank account numbers)
ENCRYPTION_KEY="64-character-hex-string"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Plaid
PLAID_CLIENT_ID="your-plaid-client-id"
PLAID_SECRET="your-plaid-secret"
PLAID_ENV="sandbox" # sandbox | development | production

# AWS S3 (construction photos)
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="realco-construction"

# Email (SendGrid or AWS SES)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"

# Redis (caching - optional)
REDIS_URL="redis://localhost:6379"
```

### Optional

```env
# Node Environment
NODE_ENV="development" # development | production

# Logging
LOG_LEVEL="info" # error | warn | info | debug

# Feature Flags
ENABLE_PLAID="true"
ENABLE_STRIPE="true"
ENABLE_EMAIL="false"
```

---

## Common Tasks

### View Schema

```bash
# View current schema
npx prisma db pull

# Validate schema
npx prisma validate
```

### Reset Database

```bash
# ⚠️ WARNING: Deletes all data
npx prisma migrate reset
```

### Create Migration

```bash
# After editing schema.prisma
npx prisma migrate dev --name descriptive_name
```

### Deploy to Production

```bash
# Apply pending migrations
npx prisma migrate deploy

# Or via Railway
railway run npx prisma migrate deploy
```

### Rollback Migration

```bash
# Mark as rolled back (doesn't undo changes)
npx prisma migrate resolve --rolled-back <migration_name>

# Manual rollback (run SQL from migration file)
psql $DATABASE_URL < rollback.sql
```

---

## TypeScript Usage

### Basic Queries

```typescript
import { prisma } from './lib/prisma';

// Create transaction
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
    idempotencyKey: 'unique-key-123',
  },
});

// Get transaction with relations
const tx = await prisma.transaction.findUnique({
  where: { id: transactionId },
  include: {
    fromUser: {
      select: { id: true, email: true },
    },
    offering: {
      select: { id: true, name: true },
    },
    escrowAccount: true,
  },
});

// List transactions with pagination
const transactions = await prisma.transaction.findMany({
  where: {
    status: 'COMPLETED',
    type: { in: ['DEPOSIT', 'DISTRIBUTION'] },
  },
  orderBy: { createdAt: 'desc' },
  take: 50,
  skip: page * 50,
});

// Aggregate
const stats = await prisma.transaction.aggregate({
  where: { status: 'COMPLETED' },
  _sum: { amount: true, feeAmount: true },
  _count: true,
  _avg: { amount: true },
});
```

### Database Transactions

```typescript
// Multi-table update with transaction
await prisma.$transaction(async (tx) => {
  const transaction = await tx.transaction.create({
    data: transactionData,
  });
  
  await tx.escrowLedgerEntry.create({
    data: {
      escrowAccountId: escrowId,
      transactionId: transaction.id,
      amount: transaction.amount,
      balanceBefore: currentBalance,
      balanceAfter: currentBalance + transaction.amount,
    },
  });
  
  await tx.escrowAccount.update({
    where: { id: escrowId },
    data: {
      currentBalance: { increment: transaction.amount },
      availableBalance: { increment: transaction.amount },
    },
  });
});
```

### Type-Safe Enums

```typescript
import {
  TransactionType,
  TransactionStatus,
  PaymentMethod,
} from '@prisma/client';

const transaction = await prisma.transaction.create({
  data: {
    type: TransactionType.DEPOSIT,
    status: TransactionStatus.INITIATED,
    paymentMethod: PaymentMethod.ACH,
    // ...
  },
});
```

---

## Testing

### Unit Tests

```typescript
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

// Mock Prisma Client
export const prismaMock = mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

// Test
it('should create transaction', async () => {
  const mockTransaction = {
    id: 'tx-123',
    type: 'DEPOSIT',
    amount: 10000,
    // ...
  };
  
  prismaMock.transaction.create.mockResolvedValue(mockTransaction);
  
  const result = await transactionService.create(data);
  
  expect(result.id).toBe('tx-123');
  expect(prismaMock.transaction.create).toHaveBeenCalledTimes(1);
});
```

### Integration Tests

```typescript
import { PrismaClient } from '@prisma/client';

describe('Transaction Service Integration', () => {
  let prisma: PrismaClient;
  
  beforeAll(async () => {
    prisma = new PrismaClient({
      datasources: {
        db: { url: process.env.TEST_DATABASE_URL },
      },
    });
  });
  
  afterAll(async () => {
    await prisma.$disconnect();
  });
  
  beforeEach(async () => {
    // Clean database
    await prisma.transaction.deleteMany();
  });
  
  it('should create and retrieve transaction', async () => {
    const created = await prisma.transaction.create({
      data: {
        type: 'DEPOSIT',
        status: 'INITIATED',
        paymentMethod: 'ACH',
        amount: 10000,
        feeAmount: 50,
        netAmount: 9950,
        idempotencyKey: 'test-key-123',
      },
    });
    
    const retrieved = await prisma.transaction.findUnique({
      where: { id: created.id },
    });
    
    expect(retrieved).not.toBeNull();
    expect(retrieved?.amount).toBe(10000);
  });
});
```

---

## Troubleshooting

### Migration Fails

**Error:** `P3006: Migration could not be applied`

```bash
# Check database status
npx prisma migrate status

# Force reset (⚠️ deletes data)
npx prisma migrate reset

# Or manually fix
psql $DATABASE_URL
\d transactions  # Check if table exists
DROP TABLE transactions CASCADE;  # If needed
```

### Connection Issues

**Error:** `Can't reach database server`

```bash
# Test connection
psql $DATABASE_URL

# Check connection limit
SELECT count(*) FROM pg_stat_activity;

# Increase connection limit
DATABASE_URL="postgresql://...?connection_limit=20"
```

### Slow Queries

```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 100;
SELECT pg_reload_conf();

-- View slow queries
SELECT
  query,
  mean_exec_time,
  calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

See [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) for details.

---

## Migration Checklist

### Before Migration
- [ ] Backup database
- [ ] Test on staging
- [ ] Review migration SQL
- [ ] Schedule maintenance window
- [ ] Notify team

### During Migration
- [ ] Run migration
- [ ] Verify tables created
- [ ] Check indexes
- [ ] Run seed script
- [ ] Test critical queries

### After Migration
- [ ] Run tests
- [ ] Monitor logs
- [ ] Check performance
- [ ] Update documentation
- [ ] Notify team of completion

---

## Support

### Documentation
- [Migration Guide](./MIGRATION_GUIDE.md) - Detailed migration steps
- [Schema Changes](./SCHEMA_CHANGES.md) - Complete schema documentation
- [Performance Guide](./PERFORMANCE_OPTIMIZATION.md) - Optimization strategies

### External Resources
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Railway Docs](https://docs.railway.app/)

### Contact
- **Engineering:** engineering@realco.com
- **Support:** support@realco.com
- **Slack:** #engineering-database

---

## License

Proprietary - RealCo Platform  
© 2026 RealCo. All rights reserved.

---

**Last Updated:** 2026-01-22  
**Maintained By:** RealCo Engineering Team  
**Next Review:** 2026-04-22



