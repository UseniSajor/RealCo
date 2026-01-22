# Prisma Performance Optimization Guide
## RealCo Finance & Escrow Schema

**Version:** 2.0.0  
**Last Updated:** 2026-01-22  
**Target Database:** PostgreSQL 15+

---

## Table of Contents

1. [Query Optimization](#query-optimization)
2. [Index Strategy](#index-strategy)
3. [Connection Pooling](#connection-pooling)
4. [Caching Strategy](#caching-strategy)
5. [Pagination Best Practices](#pagination-best-practices)
6. [Transaction Optimization](#transaction-optimization)
7. [Monitoring & Profiling](#monitoring--profiling)
8. [Scaling Considerations](#scaling-considerations)

---

## Query Optimization

### 1. Use Select Sparingly

**❌ Bad - Fetches all fields:**
```typescript
const transactions = await prisma.transaction.findMany({
  where: { status: 'COMPLETED' },
});
```

**✅ Good - Only fetch needed fields:**
```typescript
const transactions = await prisma.transaction.findMany({
  where: { status: 'COMPLETED' },
  select: {
    id: true,
    amount: true,
    status: true,
    createdAt: true,
  },
});
```

**Performance Impact:** 40-60% reduction in data transfer

---

### 2. Include vs. Select

**❌ Bad - Over-fetching:**
```typescript
const transaction = await prisma.transaction.findUnique({
  where: { id },
  include: {
    fromUser: true,
    toUser: true,
    fromBankAccount: true,
    toBankAccount: true,
    offering: true,
    escrowAccount: true,
    webhookEvents: true,
    ledgerEntries: true,
  },
});
```

**✅ Good - Selective includes:**
```typescript
const transaction = await prisma.transaction.findUnique({
  where: { id },
  include: {
    fromUser: {
      select: { id: true, email: true },
    },
    offering: {
      select: { id: true, name: true },
    },
  },
});
```

**Performance Impact:** 70-80% reduction in query time

---

### 3. Batch Queries with dataloader Pattern

**❌ Bad - N+1 Query Problem:**
```typescript
for (const transaction of transactions) {
  const user = await prisma.user.findUnique({
    where: { id: transaction.fromUserId },
  });
  // Process...
}
```

**✅ Good - Single batch query:**
```typescript
const userIds = transactions.map((t) => t.fromUserId).filter(Boolean);
const users = await prisma.user.findMany({
  where: { id: { in: userIds } },
});
const userMap = new Map(users.map((u) => [u.id, u]));

for (const transaction of transactions) {
  const user = userMap.get(transaction.fromUserId!);
  // Process...
}
```

**Performance Impact:** 100x faster for 100+ transactions

---

### 4. Efficient Counting

**❌ Bad - Loads all records:**
```typescript
const count = (await prisma.transaction.findMany({
  where: { status: 'COMPLETED' },
})).length;
```

**✅ Good - Database count:**
```typescript
const count = await prisma.transaction.count({
  where: { status: 'COMPLETED' },
});
```

**Performance Impact:** 95% reduction in memory usage

---

### 5. Aggregations

**Use Prisma aggregations for analytics:**

```typescript
// Transaction volume by status
const stats = await prisma.transaction.groupBy({
  by: ['status'],
  _sum: {
    amount: true,
    feeAmount: true,
  },
  _count: true,
  where: {
    createdAt: {
      gte: new Date('2026-01-01'),
    },
  },
});

// Average transaction amount
const avg = await prisma.transaction.aggregate({
  _avg: {
    amount: true,
  },
  where: {
    type: 'DEPOSIT',
    status: 'COMPLETED',
  },
});
```

---

## Index Strategy

### Current Indexes (32 total)

#### Transactions Table (10 indexes)

```sql
-- Primary key (automatic)
CREATE UNIQUE INDEX "Transaction_pkey" ON "transactions"("id");

-- Unique constraints (idempotency, Stripe integration)
CREATE UNIQUE INDEX "transactions_stripePaymentIntentId_key" 
  ON "transactions"("stripePaymentIntentId");
CREATE UNIQUE INDEX "transactions_idempotencyKey_key" 
  ON "transactions"("idempotencyKey");

-- Filter indexes (WHERE clauses)
CREATE INDEX "transactions_type_idx" ON "transactions"("type");
CREATE INDEX "transactions_status_idx" ON "transactions"("status");
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");

-- Foreign key indexes (JOIN optimization)
CREATE INDEX "transactions_fromUserId_idx" ON "transactions"("fromUserId");
CREATE INDEX "transactions_toUserId_idx" ON "transactions"("toUserId");
CREATE INDEX "transactions_offeringId_idx" ON "transactions"("offeringId");
CREATE INDEX "transactions_escrowAccountId_idx" ON "transactions"("escrowAccountId");

-- Composite index (complex queries)
CREATE INDEX "transactions_status_nextRetryAt_idx" 
  ON "transactions"("status", "nextRetryAt");
```

**Query Coverage:**
- ✅ List by status: `status_idx`
- ✅ User transactions: `fromUserId_idx`, `toUserId_idx`
- ✅ Offering transactions: `offeringId_idx`
- ✅ Retry queue: `status_nextRetryAt_idx`
- ✅ Recent transactions: `createdAt_idx`

---

#### Escrow Accounts Table (4 indexes)

```sql
-- Primary key
CREATE UNIQUE INDEX "EscrowAccount_pkey" ON "escrow_accounts"("id");

-- Business key
CREATE UNIQUE INDEX "escrow_accounts_offeringId_key" 
  ON "escrow_accounts"("offeringId");
CREATE UNIQUE INDEX "escrow_accounts_accountNumber_key" 
  ON "escrow_accounts"("accountNumber");

-- Filter indexes
CREATE INDEX "escrow_accounts_status_idx" ON "escrow_accounts"("status");
CREATE INDEX "escrow_accounts_lastReconciledAt_idx" 
  ON "escrow_accounts"("lastReconciledAt");
```

---

#### Ledger Entries Table (5 indexes)

```sql
-- Primary key
CREATE UNIQUE INDEX "EscrowLedgerEntry_pkey" ON "escrow_ledger_entries"("id");

-- Foreign keys
CREATE INDEX "escrow_ledger_entries_escrowAccountId_idx" 
  ON "escrow_ledger_entries"("escrowAccountId");
CREATE INDEX "escrow_ledger_entries_transactionId_idx" 
  ON "escrow_ledger_entries"("transactionId");
CREATE INDEX "escrow_ledger_entries_distributionId_idx" 
  ON "escrow_ledger_entries"("distributionId");

-- Time-series queries
CREATE INDEX "escrow_ledger_entries_createdAt_idx" 
  ON "escrow_ledger_entries"("createdAt");

-- Composite (account history)
CREATE INDEX "escrow_ledger_entries_escrowAccountId_createdAt_idx" 
  ON "escrow_ledger_entries"("escrowAccountId", "createdAt");
```

**Query Coverage:**
- ✅ Account history: `escrowAccountId_createdAt_idx`
- ✅ Transaction audit: `transactionId_idx`
- ✅ Distribution audit: `distributionId_idx`

---

### Index Maintenance

#### Monitor Index Usage

```sql
-- Find unused indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
  AND indexrelname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Most used indexes
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC
LIMIT 20;
```

#### Rebuild Indexes (if needed)

```sql
-- Rebuild all indexes for a table (requires lock)
REINDEX TABLE transactions;

-- Rebuild concurrently (no lock, PostgreSQL 12+)
REINDEX INDEX CONCURRENTLY transactions_status_idx;

-- Analyze table (update statistics)
ANALYZE transactions;
```

---

### Future Index Recommendations

#### When Transactions > 1 Million Rows

1. **Partial Indexes** (only active transactions)
```sql
CREATE INDEX transactions_active_status_idx 
  ON transactions(status)
  WHERE status NOT IN ('COMPLETED', 'CANCELLED', 'FAILED');
```

2. **Expression Indexes** (date truncation)
```sql
CREATE INDEX transactions_created_date_idx 
  ON transactions(DATE_TRUNC('day', "createdAt"));
```

3. **Covering Indexes** (include columns)
```sql
-- PostgreSQL 15+ INCLUDE clause
CREATE INDEX transactions_status_covering_idx 
  ON transactions(status)
  INCLUDE (amount, feeAmount, createdAt);
```

---

## Connection Pooling

### Prisma Connection Settings

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Database URL Configuration

```env
# Development (small pool)
DATABASE_URL="postgresql://user:pass@localhost:5432/realco?connection_limit=10&pool_timeout=20"

# Production (larger pool)
DATABASE_URL="postgresql://user:pass@prod-host:5432/realco?connection_limit=50&pool_timeout=20&connect_timeout=10"

# Railway PostgreSQL (with pooling)
DATABASE_URL="postgresql://user:pass@proxy.railway.app:5432/railway?pgbouncer=true&connection_limit=20"
```

### Pool Size Recommendations

| Environment | Connections | Reasoning |
|-------------|-------------|-----------|
| Development | 5-10 | Low traffic |
| Staging | 10-20 | Medium traffic |
| Production (small) | 20-50 | High traffic, single instance |
| Production (scaled) | 10-20/instance | Multiple instances |

**Formula:** `pool_size = (core_count * 2) + effective_spindle_count`

---

### Connection Pooling with PgBouncer (Railway)

```ini
# pgbouncer.ini (Railway managed)
[databases]
realco = host=postgres port=5432 dbname=realco

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
reserve_pool_size = 5
reserve_pool_timeout = 3
```

**Benefits:**
- 1000 clients → 25 database connections
- 40x connection multiplexing
- Reduced database overhead

---

## Caching Strategy

### 1. Application-Level Caching (Redis)

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache escrow account balance (5 min TTL)
async function getEscrowAccountBalance(accountId: string) {
  const cacheKey = `escrow:balance:${accountId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const account = await prisma.escrowAccount.findUnique({
    where: { id: accountId },
    select: {
      currentBalance: true,
      availableBalance: true,
      pendingBalance: true,
      heldBalance: true,
    },
  });
  
  await redis.set(cacheKey, JSON.stringify(account), 'EX', 300);
  return account;
}

// Invalidate cache on update
async function updateEscrowBalance(accountId: string, newBalance: number) {
  await prisma.escrowAccount.update({
    where: { id: accountId },
    data: { currentBalance: newBalance },
  });
  
  // Invalidate cache
  await redis.del(`escrow:balance:${accountId}`);
}
```

---

### 2. Query Result Caching

```typescript
// Cache expensive distribution calculations
async function calculateDistribution(offeringId: string, amount: number) {
  const cacheKey = `dist:calc:${offeringId}:${amount}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const result = await expensiveDistributionCalculation(offeringId, amount);
  
  // Cache for 1 hour
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 3600);
  return result;
}
```

---

### 3. Cache Patterns

#### Read-Through Cache
```typescript
async function getCachedEntity<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetcher();
  await redis.set(key, JSON.stringify(data), 'EX', ttl);
  return data;
}

// Usage
const transaction = await getCachedEntity(
  `transaction:${id}`,
  () => prisma.transaction.findUnique({ where: { id } }),
  300 // 5 minutes
);
```

#### Cache-Aside Pattern
```typescript
async function getTransaction(id: string) {
  // Try cache first
  const cached = await redis.get(`transaction:${id}`);
  if (cached) return JSON.parse(cached);
  
  // Cache miss - fetch from DB
  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });
  
  if (transaction) {
    // Populate cache
    await redis.set(
      `transaction:${id}`,
      JSON.stringify(transaction),
      'EX',
      300
    );
  }
  
  return transaction;
}
```

---

## Pagination Best Practices

### 1. Cursor-Based Pagination (Recommended)

**❌ Bad - Offset pagination (slow for large offsets):**
```typescript
const transactions = await prisma.transaction.findMany({
  skip: page * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
});
```

**✅ Good - Cursor pagination:**
```typescript
async function getTransactions(cursor?: string, limit: number = 50) {
  return await prisma.transaction.findMany({
    take: limit + 1, // Fetch one extra to determine if more pages exist
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1, // Skip the cursor
    }),
    orderBy: { createdAt: 'desc' },
  });
}

// Usage
const transactions = await getTransactions();
const hasMore = transactions.length > 50;
const items = transactions.slice(0, 50);
const nextCursor = hasMore ? items[items.length - 1].id : null;
```

**Performance Impact:** Constant time (O(1)) regardless of page number

---

### 2. Efficient Count Queries

**❌ Bad - Count all rows:**
```typescript
const [transactions, total] = await Promise.all([
  prisma.transaction.findMany({ skip: 0, take: 50 }),
  prisma.transaction.count(), // Expensive for large tables
]);
```

**✅ Good - Estimate or cache count:**
```typescript
// Option 1: Use PostgreSQL table statistics
async function getApproximateCount(tableName: string) {
  const result = await prisma.$queryRaw<[{ estimate: number }]>`
    SELECT reltuples::bigint AS estimate
    FROM pg_class
    WHERE relname = ${tableName}
  `;
  return result[0].estimate;
}

// Option 2: Cache exact count (5 min TTL)
async function getCachedTransactionCount() {
  const cached = await redis.get('transaction:count');
  if (cached) return parseInt(cached);
  
  const count = await prisma.transaction.count();
  await redis.set('transaction:count', count.toString(), 'EX', 300);
  return count;
}
```

---

## Transaction Optimization

### 1. Use Database Transactions Sparingly

**❌ Bad - Unnecessary transaction:**
```typescript
await prisma.$transaction(async (tx) => {
  const transaction = await tx.transaction.create({ data });
  return transaction;
});
```

**✅ Good - Only when needed:**
```typescript
// Single operation - no transaction needed
const transaction = await prisma.transaction.create({ data });

// Multiple dependent operations - transaction needed
await prisma.$transaction(async (tx) => {
  const transaction = await tx.transaction.create({ data: transactionData });
  
  await tx.escrowLedgerEntry.create({
    data: {
      escrowAccountId: transaction.escrowAccountId,
      transactionId: transaction.id,
      amount: transaction.amount,
      balanceBefore: escrowBalance,
      balanceAfter: escrowBalance + transaction.amount,
    },
  });
  
  await tx.escrowAccount.update({
    where: { id: transaction.escrowAccountId },
    data: {
      currentBalance: { increment: transaction.amount },
      availableBalance: { increment: transaction.amount },
    },
  });
});
```

---

### 2. Transaction Isolation Levels

```typescript
// Default: READ COMMITTED (PostgreSQL default)
await prisma.$transaction(
  async (tx) => {
    // Operations
  }
);

// Serializable (prevents concurrent updates)
await prisma.$transaction(
  async (tx) => {
    // Critical operations (distribution calculation)
  },
  {
    isolationLevel: 'Serializable',
    timeout: 10000, // 10 seconds
  }
);
```

---

### 3. Optimistic Locking

```typescript
// Add version field to schema
model EscrowAccount {
  // ... existing fields
  version Int @default(0)
}

// Update with version check
async function updateEscrowBalance(accountId: string, newBalance: number) {
  const account = await prisma.escrowAccount.findUnique({
    where: { id: accountId },
  });
  
  if (!account) throw new Error('Account not found');
  
  const updated = await prisma.escrowAccount.updateMany({
    where: {
      id: accountId,
      version: account.version, // Optimistic lock
    },
    data: {
      currentBalance: newBalance,
      version: { increment: 1 },
    },
  });
  
  if (updated.count === 0) {
    throw new Error('Concurrent update detected - please retry');
  }
}
```

---

## Monitoring & Profiling

### 1. Enable Query Logging

```typescript
// Development
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
});
```

---

### 2. Prisma Metrics (Production)

```typescript
import { PrismaClient } from '@prisma/client';
import { createClient } from '@vercel/kv';

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }],
});

const metrics = {
  queryCount: 0,
  totalDuration: 0,
  slowQueries: [] as any[],
};

prisma.$on('query', (e) => {
  metrics.queryCount++;
  metrics.totalDuration += e.duration;
  
  // Track slow queries (>100ms)
  if (e.duration > 100) {
    metrics.slowQueries.push({
      query: e.query,
      duration: e.duration,
      timestamp: new Date(),
    });
  }
});

// Expose metrics endpoint
app.get('/metrics/database', (req, res) => {
  res.json({
    ...metrics,
    avgDuration: metrics.totalDuration / metrics.queryCount,
  });
});
```

---

### 3. PostgreSQL Monitoring

```sql
-- Current connections
SELECT 
  count(*),
  state
FROM pg_stat_activity
GROUP BY state;

-- Long-running queries
SELECT
  pid,
  now() - query_start as duration,
  query,
  state
FROM pg_stat_activity
WHERE state != 'idle'
  AND query NOT LIKE '%pg_stat_activity%'
ORDER BY duration DESC;

-- Table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY bytes DESC;

-- Index hit rate (should be >99%)
SELECT
  sum(idx_blks_hit) / nullif(sum(idx_blks_hit + idx_blks_read), 0) * 100 as index_hit_rate,
  sum(heap_blks_hit) / nullif(sum(heap_blks_hit + heap_blks_read), 0) * 100 as table_hit_rate
FROM pg_statio_user_tables;
```

---

## Scaling Considerations

### 1. Read Replicas

```typescript
// Primary database (writes)
const prismaPrimary = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_PRIMARY_URL },
  },
});

// Read replica (reads)
const prismaReplica = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_REPLICA_URL },
  },
});

// Router
export function getPrismaClient(operation: 'read' | 'write') {
  return operation === 'write' ? prismaPrimary : prismaReplica;
}

// Usage
const transactions = await getPrismaClient('read').transaction.findMany({
  where: { status: 'COMPLETED' },
});
```

---

### 2. Table Partitioning (Future)

**When transactions > 10 million rows:**

```sql
-- Partition by month
CREATE TABLE transactions_2026_01 PARTITION OF transactions
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE transactions_2026_02 PARTITION OF transactions
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- Auto-create partitions
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
  partition_date DATE;
  partition_name TEXT;
  start_date DATE;
  end_date DATE;
BEGIN
  partition_date := date_trunc('month', CURRENT_DATE + interval '1 month');
  partition_name := 'transactions_' || to_char(partition_date, 'YYYY_MM');
  start_date := partition_date;
  end_date := partition_date + interval '1 month';
  
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF transactions FOR VALUES FROM (%L) TO (%L)',
    partition_name, start_date, end_date
  );
END;
$$ LANGUAGE plpgsql;
```

---

### 3. Archive Strategy

**Archive completed transactions older than 7 years:**

```typescript
async function archiveOldTransactions() {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 7);
  
  // Move to archive table
  await prisma.$executeRaw`
    INSERT INTO transactions_archive
    SELECT * FROM transactions
    WHERE status IN ('COMPLETED', 'CANCELLED')
      AND "createdAt" < ${cutoffDate}
  `;
  
  // Delete from main table
  const result = await prisma.transaction.deleteMany({
    where: {
      status: { in: ['COMPLETED', 'CANCELLED'] },
      createdAt: { lt: cutoffDate },
    },
  });
  
  console.log(`Archived ${result.count} transactions`);
}

// Run monthly via cron
```

---

## Performance Benchmarks

### Target Metrics

| Operation | Target (p50) | Target (p95) | Target (p99) |
|-----------|-------------|-------------|-------------|
| Transaction by ID | <5ms | <10ms | <20ms |
| List transactions (50) | <15ms | <30ms | <50ms |
| Escrow balance | <3ms | <8ms | <15ms |
| Ledger history (30d) | <20ms | <40ms | <80ms |
| Distribution calc | <100ms | <200ms | <500ms |
| Create transaction | <10ms | <20ms | <40ms |

### Load Testing

```yaml
# artillery.yml
config:
  target: "https://api.realco.com"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 300
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"

scenarios:
  - name: "Get transaction"
    flow:
      - get:
          url: "/api/v1/transactions/{{ transactionId }}"
          
  - name: "List transactions"
    flow:
      - get:
          url: "/api/v1/transactions?limit=50"
```

---

## Checklist

### Pre-Production
- [ ] All indexes created
- [ ] Connection pooling configured
- [ ] Query logging enabled
- [ ] Monitoring dashboards set up
- [ ] Load tests passed
- [ ] Slow query alerts configured

### Ongoing Monitoring
- [ ] Weekly index usage review
- [ ] Monthly table size check
- [ ] Quarterly performance audit
- [ ] Annual archive process

---

**Author:** RealCo Engineering Team  
**Contact:** performance@realco.com  
**Last Reviewed:** 2026-01-22



