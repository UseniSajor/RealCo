# Transaction API Documentation

**Version:** 1.0.0  
**Base URL:** `/api/v1`  
**Authentication:** Required (JWT Bearer Token)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Endpoints](#endpoints)
5. [Data Models](#data-models)
6. [State Machine](#state-machine)
7. [Examples](#examples)
8. [Testing](#testing)

---

## Overview

The Transaction API provides comprehensive financial transaction management for the RealCo platform. It supports multiple payment methods (ACH, Wire, Check, Credit Card), compliance checks, state management, and audit trails.

### Key Features

- ✅ Multiple payment methods (ACH, Wire, Check, Card, Internal)
- ✅ 13-state transaction state machine
- ✅ Automatic fee calculation
- ✅ Compliance checks (OFAC, KYC, AML, limits)
- ✅ Idempotency guarantees
- ✅ Retry logic with exponential backoff
- ✅ Complete audit trail
- ✅ Real-time statistics

---

## Authentication

All endpoints require JWT authentication via Bearer token.

### Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Getting a Token

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional details
  }
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions or compliance failure |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource or state conflict |
| 422 | Unprocessable Entity | Business rule violation |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 502 | Bad Gateway | External service error (Stripe, Plaid) |

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `INVALID_TOKEN` | 401 | JWT token invalid or expired |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `TRANSACTION_NOT_FOUND` | 404 | Transaction ID not found |
| `DUPLICATE_RESOURCE` | 409 | Idempotency key already used |
| `INVALID_STATE_TRANSITION` | 422 | Cannot transition from current status |
| `TRANSACTION_LIMIT_EXCEEDED` | 422 | Amount exceeds regulatory limits |
| `COMPLIANCE_ERROR` | 403 | Failed OFAC/KYC/AML checks |
| `INSUFFICIENT_FUNDS` | 422 | Insufficient funds for operation |
| `RATE_LIMIT_ERROR` | 429 | Too many requests |
| `STRIPE_ERROR` | 502 | Stripe API error |
| `PLAID_ERROR` | 502 | Plaid API error |

---

## Endpoints

### 1. Initiate Transaction

Create a new financial transaction.

```http
POST /api/v1/transactions
```

**Request Body:**

```json
{
  "type": "DEPOSIT",
  "paymentMethod": "ACH",
  "amount": 10000.00,
  "description": "Investment deposit for Sunset Vista Apartments",
  "fromUserId": "user-uuid",
  "fromBankAccountId": "bank-account-uuid",
  "offeringId": "offering-uuid",
  "metadata": {
    "investmentId": "inv-123",
    "notes": "First investment"
  }
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | enum | Yes | Transaction type (see [Transaction Types](#transaction-types)) |
| `paymentMethod` | enum | Yes | Payment method (ACH, WIRE, CHECK, CREDIT_CARD, INTERNAL_TRANSFER) |
| `amount` | number | Yes | Transaction amount (positive, max 2 decimals) |
| `description` | string | Yes | Transaction description (1-500 chars) |
| `currency` | string | No | Currency code (default: USD) |
| `fromUserId` | uuid | No | Source user ID |
| `toUserId` | uuid | No | Destination user ID |
| `fromBankAccountId` | uuid | No | Source bank account ID |
| `toBankAccountId` | uuid | No | Destination bank account ID |
| `offeringId` | uuid | No | Related offering ID |
| `escrowAccountId` | uuid | No | Related escrow account ID |
| `distributionId` | uuid | No | Related distribution ID |
| `internalMemo` | string | No | Internal notes (max 1000 chars) |
| `metadata` | object | No | Flexible JSON metadata |

**Response (201 Created):**

```json
{
  "transaction": {
    "id": "tx-uuid",
    "type": "DEPOSIT",
    "status": "INITIATED",
    "paymentMethod": "ACH",
    "amount": 10000.00,
    "feeAmount": 50.80,
    "netAmount": 9949.20,
    "currency": "USD",
    "description": "Investment deposit for Sunset Vista Apartments",
    "idempotencyKey": "tx-1234567890-abc123",
    "complianceCheckPassed": true,
    "createdAt": "2026-01-22T10:00:00Z",
    "updatedAt": "2026-01-22T10:00:00Z"
  },
  "estimatedSettlementDate": "2026-01-25T10:00:00Z",
  "requiresApproval": false,
  "complianceChecks": [
    {
      "checkType": "LIMIT_CHECK",
      "passed": true,
      "details": {
        "dailyLimit": 50000,
        "currentTotal": 10000
      }
    }
  ]
}
```

---

### 2. Get Transaction

Retrieve transaction details by ID.

```http
GET /api/v1/transactions/:id
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | uuid | Transaction ID |

**Response (200 OK):**

```json
{
  "id": "tx-uuid",
  "type": "DEPOSIT",
  "status": "COMPLETED",
  "paymentMethod": "ACH",
  "amount": 10000.00,
  "feeAmount": 50.80,
  "netAmount": 9949.20,
  "currency": "USD",
  "description": "Investment deposit",
  "fromUser": {
    "id": "user-uuid",
    "email": "investor@example.com"
  },
  "fromBankAccount": {
    "id": "bank-uuid",
    "accountType": "CHECKING",
    "last4": "1234"
  },
  "offering": {
    "id": "offering-uuid",
    "name": "Sunset Vista Apartments"
  },
  "completedAt": "2026-01-25T10:00:00Z",
  "createdAt": "2026-01-22T10:00:00Z",
  "updatedAt": "2026-01-25T10:00:00Z"
}
```

---

### 3. List Transactions

List transactions with filters and pagination.

```http
GET /api/v1/transactions?status=COMPLETED&limit=50&offset=0
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | enum | Filter by status (can be array) |
| `type` | enum | Filter by type (can be array) |
| `paymentMethod` | enum | Filter by payment method |
| `userId` | uuid | Filter by user (from or to) |
| `offeringId` | uuid | Filter by offering |
| `minAmount` | number | Minimum amount |
| `maxAmount` | number | Maximum amount |
| `startDate` | ISO 8601 | Start date filter |
| `endDate` | ISO 8601 | End date filter |
| `limit` | number | Results per page (1-100, default: 50) |
| `offset` | number | Pagination offset (default: 0) |
| `sortBy` | enum | Sort field (createdAt, amount, status) |
| `sortOrder` | enum | Sort order (asc, desc) |
| `search` | string | Search in description |

**Response (200 OK):**

```json
{
  "transactions": [
    {
      "id": "tx-uuid-1",
      "type": "DEPOSIT",
      "status": "COMPLETED",
      "amount": 10000.00,
      "createdAt": "2026-01-22T10:00:00Z"
    },
    {
      "id": "tx-uuid-2",
      "type": "WITHDRAWAL",
      "status": "COMPLETED",
      "amount": 5000.00,
      "createdAt": "2026-01-21T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  },
  "summary": {
    "totalAmount": 1500000.00,
    "totalFees": 7500.00,
    "transactionCount": 150
  }
}
```

---

### 4. Update Transaction

Update transaction details (limited fields).

```http
PATCH /api/v1/transactions/:id
```

**Request Body:**

```json
{
  "description": "Updated description",
  "internalMemo": "Additional notes",
  "metadata": {
    "updated": true
  }
}
```

**Response (200 OK):**

```json
{
  "id": "tx-uuid",
  "description": "Updated description",
  "internalMemo": "Additional notes",
  "updatedAt": "2026-01-22T11:00:00Z"
}
```

---

### 5. Approve Transaction

Approve a pending transaction (admin only).

```http
POST /api/v1/transactions/:id/approve
```

**Request Body:**

```json
{
  "notes": "Approved by finance team"
}
```

**Response (200 OK):**

```json
{
  "transaction": {
    "id": "tx-uuid",
    "status": "APPROVED",
    "approvedAt": "2026-01-22T10:30:00Z"
  },
  "message": "Transaction approved successfully"
}
```

---

### 6. Cancel Transaction

Cancel a transaction (before processing).

```http
POST /api/v1/transactions/:id/cancel
```

**Request Body:**

```json
{
  "reason": "Investor requested cancellation"
}
```

**Response (200 OK):**

```json
{
  "transaction": {
    "id": "tx-uuid",
    "status": "CANCELLED",
    "cancelledAt": "2026-01-22T10:45:00Z"
  },
  "message": "Transaction cancelled successfully"
}
```

---

### 7. Retry Transaction

Retry a failed transaction.

```http
POST /api/v1/transactions/:id/retry
```

**Request Body:**

```json
{
  "forceRetry": false,
  "reason": "Retry after bank account verification"
}
```

**Response (200 OK):**

```json
{
  "transaction": {
    "id": "tx-uuid",
    "status": "PENDING_RETRY",
    "retryCount": 1,
    "nextRetryAt": "2026-01-22T11:00:00Z"
  },
  "message": "Transaction retry scheduled",
  "nextRetryAt": "2026-01-22T11:00:00Z"
}
```

---

### 8. Get Transaction Statistics

Get transaction statistics and analytics.

```http
GET /api/v1/transactions/stats?startDate=2026-01-01&endDate=2026-01-31
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `startDate` | ISO 8601 | Start date |
| `endDate` | ISO 8601 | End date |
| `offeringId` | uuid | Filter by offering |

**Response (200 OK):**

```json
{
  "totalVolume": 1500000.00,
  "totalFees": 7500.00,
  "transactionCount": 150,
  "avgTransactionAmount": 10000.00,
  "byStatus": {
    "COMPLETED": {
      "count": 120,
      "totalAmount": 1200000.00
    },
    "FAILED": {
      "count": 5,
      "totalAmount": 50000.00
    }
  },
  "byType": {
    "DEPOSIT": {
      "count": 100,
      "totalAmount": 1000000.00
    },
    "WITHDRAWAL": {
      "count": 50,
      "totalAmount": 500000.00
    }
  },
  "byPaymentMethod": {
    "ACH": {
      "count": 130,
      "totalAmount": 1300000.00
    },
    "WIRE": {
      "count": 20,
      "totalAmount": 200000.00
    }
  },
  "recentTransactions": [
    // Last 10 transactions
  ]
}
```

---

## Data Models

### Transaction Types

| Type | Description |
|------|-------------|
| `DEPOSIT` | Investor deposits funds |
| `WITHDRAWAL` | Investor withdraws funds |
| `DISTRIBUTION` | Return of capital / profit distribution |
| `CONSTRUCTION_DRAW` | Payment to contractor/vendors |
| `PLATFORM_FEE` | Platform commission |
| `REFERRAL_FEE` | Referral commission |
| `ESCROW_DEPOSIT` | Deposit into escrow |
| `ESCROW_WITHDRAWAL` | Withdrawal from escrow |
| `REFUND` | Refund to investor |
| `TRANSFER` | Internal transfer |

### Transaction Status

| Status | Description | Terminal |
|--------|-------------|----------|
| `INITIATED` | Transaction created | No |
| `PENDING_APPROVAL` | Awaiting admin approval | No |
| `APPROVED` | Approved for processing | No |
| `QUEUED` | Queued for processing | No |
| `PROCESSING` | Being processed | No |
| `PENDING_SETTLEMENT` | ACH clearing period (3-5 days) | No |
| `SETTLED` | Funds settled in account | No |
| `COMPLETED` | Transaction complete | Yes |
| `FAILED` | Processing failed | No |
| `CANCELLED` | Cancelled before processing | Yes |
| `REVERSED` | Refunded/reversed | Yes |
| `PENDING_RETRY` | Queued for retry | No |

### Payment Methods

| Method | Settlement Time | Fee |
|--------|----------------|-----|
| `ACH` | 3-5 business days | $0.80 |
| `WIRE` | Same/next business day | $25.00 |
| `CHECK` | 5-7 business days | $0.00 |
| `CREDIT_CARD` | Immediate | 2.9% + $0.30 |
| `INTERNAL_TRANSFER` | Immediate | $0.00 |

---

## State Machine

### Allowed Transitions

```
INITIATED
  ├─> PENDING_APPROVAL (large amounts or specific types)
  ├─> APPROVED
  ├─> QUEUED
  └─> CANCELLED

PENDING_APPROVAL
  ├─> APPROVED
  └─> CANCELLED

APPROVED
  ├─> QUEUED
  └─> CANCELLED

QUEUED
  ├─> PROCESSING
  └─> CANCELLED

PROCESSING
  ├─> PENDING_SETTLEMENT (ACH)
  ├─> SETTLED
  ├─> COMPLETED
  └─> FAILED

PENDING_SETTLEMENT
  ├─> SETTLED
  └─> FAILED

SETTLED
  └─> COMPLETED

COMPLETED
  └─> REVERSED (refunds only)

FAILED
  ├─> PENDING_RETRY
  └─> CANCELLED

PENDING_RETRY
  ├─> QUEUED
  └─> CANCELLED

CANCELLED (terminal)
REVERSED (terminal)
```

---

## Examples

### Example 1: Investor Deposit

```bash
# 1. Initiate deposit
curl -X POST https://api.realco.com/api/v1/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "DEPOSIT",
    "paymentMethod": "ACH",
    "amount": 50000.00,
    "description": "Investment in Sunset Vista Apartments",
    "fromUserId": "user-uuid",
    "fromBankAccountId": "bank-uuid",
    "offeringId": "offering-uuid"
  }'

# Response:
# {
#   "transaction": {
#     "id": "tx-123",
#     "status": "INITIATED",
#     ...
#   },
#   "estimatedSettlementDate": "2026-01-27T00:00:00Z"
# }

# 2. Check status
curl https://api.realco.com/api/v1/transactions/tx-123 \
  -H "Authorization: Bearer $TOKEN"

# 3. Transaction automatically processes through:
# INITIATED -> QUEUED -> PROCESSING -> PENDING_SETTLEMENT -> SETTLED -> COMPLETED
```

### Example 2: Construction Draw (Requires Approval)

```bash
# 1. Initiate construction draw
curl -X POST https://api.realco.com/api/v1/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "CONSTRUCTION_DRAW",
    "paymentMethod": "WIRE",
    "amount": 250000.00,
    "description": "Foundation work - Phase 1",
    "offeringId": "offering-uuid",
    "toBankAccountId": "contractor-bank-uuid"
  }'

# Response:
# {
#   "transaction": {
#     "id": "tx-456",
#     "status": "PENDING_APPROVAL",
#     ...
#   },
#   "requiresApproval": true
# }

# 2. Admin approves
curl -X POST https://api.realco.com/api/v1/transactions/tx-456/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Approved by finance team - verified invoice"
  }'

# 3. Transaction processes automatically
```

### Example 3: Failed Transaction Retry

```bash
# 1. Transaction fails (e.g., insufficient funds)
# Status: FAILED

# 2. Retry transaction
curl -X POST https://api.realco.com/api/v1/transactions/tx-789/retry \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Bank account funded, retry payment"
  }'

# Response:
# {
#   "transaction": {
#     "id": "tx-789",
#     "status": "PENDING_RETRY",
#     "retryCount": 1,
#     "nextRetryAt": "2026-01-22T11:30:00Z"
#   }
# }

# 3. System automatically retries at scheduled time
```

---

## Testing

### Running Tests

```bash
cd backend
npm test -- transaction.test.ts
```

### Test Coverage

- ✅ Transaction creation (all types)
- ✅ Idempotency enforcement
- ✅ Status transitions
- ✅ Filtering and pagination
- ✅ Aggregations and statistics
- ✅ Retry logic
- ✅ Compliance checks
- ✅ Fee calculations

### Test Database

Tests use a separate test database. Configure in `.env.test`:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/realco_test"
```

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /transactions | 100 requests | 1 hour |
| GET /transactions/:id | 1000 requests | 1 hour |
| GET /transactions | 500 requests | 1 hour |
| POST /transactions/:id/retry | 10 requests | 1 hour |

---

## Webhooks

### Stripe Webhook

```http
POST /api/v1/webhooks/stripe
```

Handles Stripe payment events (payment_intent.succeeded, etc.)

### Plaid Webhook

```http
POST /api/v1/webhooks/plaid
```

Handles Plaid bank account events.

---

## Support

- **API Issues:** engineering@realco.com
- **Documentation:** https://docs.realco.com
- **Status Page:** https://status.realco.com

---

**Last Updated:** 2026-01-22  
**API Version:** 1.0.0  
**Maintained By:** RealCo Engineering Team



