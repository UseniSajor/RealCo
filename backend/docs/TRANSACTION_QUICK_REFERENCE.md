# Transaction API Quick Reference

**Version:** 1.0.0 | **Base URL:** `/api/v1` | **Auth:** JWT Required

---

## 🚀 Quick Start

```bash
# 1. Login
curl -X POST https://api.realco.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# 2. Create Transaction
curl -X POST https://api.realco.com/api/v1/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type":"DEPOSIT",
    "paymentMethod":"ACH",
    "amount":10000,
    "description":"Investment deposit",
    "fromBankAccountId":"bank-uuid",
    "offeringId":"offering-uuid"
  }'

# 3. Check Status
curl https://api.realco.com/api/v1/transactions/tx-uuid \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📋 Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/transactions` | Create transaction |
| GET | `/transactions/:id` | Get transaction |
| GET | `/transactions` | List transactions |
| PATCH | `/transactions/:id` | Update transaction |
| POST | `/transactions/:id/approve` | Approve (admin) |
| POST | `/transactions/:id/cancel` | Cancel transaction |
| POST | `/transactions/:id/retry` | Retry failed |
| GET | `/transactions/stats` | Get statistics |

---

## 💰 Transaction Types

| Type | Description | Requires Approval |
|------|-------------|-------------------|
| `DEPOSIT` | Investor deposit | No |
| `WITHDRAWAL` | Investor withdrawal | No |
| `DISTRIBUTION` | Capital/profit distribution | Yes |
| `CONSTRUCTION_DRAW` | Contractor payment | Yes |
| `PLATFORM_FEE` | Platform commission | No |
| `REFERRAL_FEE` | Referral commission | No |
| `ESCROW_DEPOSIT` | Into escrow | No |
| `ESCROW_WITHDRAWAL` | From escrow | No |
| `REFUND` | Refund to investor | No |
| `TRANSFER` | Internal transfer | No |

---

## 📊 Transaction Status

| Status | Description | Terminal |
|--------|-------------|----------|
| `INITIATED` | Created | ❌ |
| `PENDING_APPROVAL` | Awaiting approval | ❌ |
| `APPROVED` | Approved | ❌ |
| `QUEUED` | Queued | ❌ |
| `PROCESSING` | Processing | ❌ |
| `PENDING_SETTLEMENT` | ACH clearing | ❌ |
| `SETTLED` | Funds settled | ❌ |
| `COMPLETED` | Complete | ✅ |
| `FAILED` | Failed | ❌ |
| `CANCELLED` | Cancelled | ✅ |
| `REVERSED` | Refunded | ✅ |
| `PENDING_RETRY` | Retry scheduled | ❌ |

---

## 💳 Payment Methods

| Method | Settlement | Fee |
|--------|-----------|-----|
| `ACH` | 3-5 days | $0.80 |
| `WIRE` | 1 day | $25.00 |
| `CHECK` | 5-7 days | $0.00 |
| `CREDIT_CARD` | Immediate | 2.9% + $0.30 |
| `INTERNAL_TRANSFER` | Immediate | $0.00 |

---

## 🔄 State Machine

```
INITIATED → PENDING_APPROVAL → APPROVED → QUEUED → PROCESSING
→ PENDING_SETTLEMENT → SETTLED → COMPLETED

OR:
→ FAILED → PENDING_RETRY → QUEUED
→ CANCELLED (from most states)
→ REVERSED (from COMPLETED only)
```

---

## ⚠️ Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input |
| `INVALID_TOKEN` | 401 | Auth failed |
| `INSUFFICIENT_PERMISSIONS` | 403 | No permission |
| `TRANSACTION_NOT_FOUND` | 404 | Not found |
| `DUPLICATE_RESOURCE` | 409 | Already exists |
| `INVALID_STATE_TRANSITION` | 422 | Invalid status change |
| `TRANSACTION_LIMIT_EXCEEDED` | 422 | Exceeds limit |
| `COMPLIANCE_ERROR` | 403 | Failed compliance |
| `INSUFFICIENT_FUNDS` | 422 | Not enough funds |
| `STRIPE_ERROR` | 502 | Stripe API error |

---

## 📝 Request Examples

### Create Deposit

```json
POST /api/v1/transactions

{
  "type": "DEPOSIT",
  "paymentMethod": "ACH",
  "amount": 10000.00,
  "description": "Investment deposit",
  "fromUserId": "user-uuid",
  "fromBankAccountId": "bank-uuid",
  "offeringId": "offering-uuid"
}
```

### List Transactions

```http
GET /api/v1/transactions?status=COMPLETED&limit=50&offset=0&sortBy=createdAt&sortOrder=desc
```

### Approve Transaction

```json
POST /api/v1/transactions/:id/approve

{
  "notes": "Approved by finance team"
}
```

### Cancel Transaction

```json
POST /api/v1/transactions/:id/cancel

{
  "reason": "Investor requested cancellation"
}
```

### Retry Failed Transaction

```json
POST /api/v1/transactions/:id/retry

{
  "forceRetry": false,
  "reason": "Bank account funded"
}
```

---

## 🔍 Query Parameters

### List Transactions

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | enum | Filter by status |
| `type` | enum | Filter by type |
| `paymentMethod` | enum | Filter by method |
| `offeringId` | uuid | Filter by offering |
| `minAmount` | number | Minimum amount |
| `maxAmount` | number | Maximum amount |
| `startDate` | ISO 8601 | Start date |
| `endDate` | ISO 8601 | End date |
| `limit` | number | Results per page (1-100) |
| `offset` | number | Pagination offset |
| `sortBy` | enum | Sort field |
| `sortOrder` | enum | asc or desc |
| `search` | string | Search description |

---

## 💡 Common Patterns

### Idempotency

```typescript
// Include idempotency key in metadata
{
  "metadata": {
    "idempotencyKey": "unique-key-123"
  }
}

// Or let system generate one automatically
```

### Pagination

```typescript
// Offset-based
GET /transactions?limit=50&offset=0

// Get next page
GET /transactions?limit=50&offset=50
```

### Filtering

```typescript
// Single status
GET /transactions?status=COMPLETED

// Multiple statuses (comma-separated)
GET /transactions?status=COMPLETED,FAILED

// Date range
GET /transactions?startDate=2026-01-01&endDate=2026-01-31

// Amount range
GET /transactions?minAmount=1000&maxAmount=50000
```

---

## 🧪 Testing

```bash
# Run tests
npm test -- transaction.test.ts

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- -t "should create deposit transaction"
```

---

## 📊 Fee Calculation

```typescript
// Example: $10,000 ACH deposit
amount: 10000.00
platformFee: 50.00      // 0.5% (min $1, max $50)
processorFee: 0.80      // ACH fee
totalFee: 50.80
netAmount: 9949.20
```

---

## 🔒 Security

### Authentication

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /transactions | 100 | 1 hour |
| GET /transactions/:id | 1000 | 1 hour |
| GET /transactions | 500 | 1 hour |

---

## 📈 Monitoring

### Key Metrics

- Transaction volume (by type, status)
- Average processing time
- Error rate
- Retry rate
- Compliance pass rate

### Health Check

```bash
curl https://api.realco.com/api/v1/ready
# Response: {"ok":true}
```

---

## 🐛 Troubleshooting

### Transaction Stuck in PROCESSING

```bash
# Check transaction status
GET /transactions/:id

# If failed, retry
POST /transactions/:id/retry
```

### Compliance Error

```bash
# Check compliance details
GET /transactions/:id

# Review complianceCheckData field
```

### Payment Failed

```bash
# Check failure details
GET /transactions/:id

# Review failureCode and failureMessage
# Retry if transient error
POST /transactions/:id/retry
```

---

## 📚 Documentation

- **Full API Docs:** [TRANSACTION_API.md](./TRANSACTION_API.md)
- **Implementation:** [TRANSACTION_IMPLEMENTATION_SUMMARY.md](./TRANSACTION_IMPLEMENTATION_SUMMARY.md)
- **Prisma Schema:** [../prisma/SCHEMA_CHANGES.md](../prisma/SCHEMA_CHANGES.md)

---

## 🆘 Support

- **API Issues:** engineering@realco.com
- **Slack:** #engineering-api
- **Status:** https://status.realco.com

---

**Quick Reference v1.0.0** | © 2026 RealCo



