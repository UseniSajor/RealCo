# Finance & Trust Module - Implementation Guide

**Module:** Finance & Trust Integration (Kealee Module 1)  
**Priority:** 1 (Highest)  
**Timeline:** Weeks 1-4  
**Status:** Ready to Implement

---

## 📋 **IMPLEMENTATION OVERVIEW**

### The 9 Core Components:

**Prisma Schema Models (4)**:
1. BankAccount - Encrypted bank account storage
2. Transaction - Payment transaction records
3. EscrowAccount - Segregated escrow accounts
4. ComplianceCheck - KYC/AML/OFAC compliance records

**Services (5)**:
5. bank-account.service.ts - Bank account management
6. plaid.service.ts - Plaid API integration
7. stripe-payment.service.ts - Stripe payment processing
8. escrow.service.ts - Escrow account management
9. compliance.service.ts - Compliance screening

**Plus**:
- API Routes (4 sets of endpoints)
- Database Migration
- Encryption utilities
- Error handling
- Tests

---

## 🚀 **IMPLEMENTATION ORDER**

### Phase 1: Foundation (Days 1-2)
1. Encryption utilities
2. Prisma schema models
3. Database migration
4. Seed data

### Phase 2: Core Services (Days 3-7)
5. Plaid service
6. Stripe service
7. Bank account service
8. Compliance service
9. Escrow service

### Phase 3: API Layer (Days 8-10)
10. Banking API routes
11. Payment API routes
12. Escrow API routes
13. Compliance API routes

### Phase 4: Testing & Integration (Days 11-14)
14. Unit tests
15. Integration tests
16. Frontend integration
17. End-to-end testing

---

## 📝 **ITEM 1: ENCRYPTION UTILITIES**

### Create `backend/src/lib/encryption.ts`

```typescript
/**
 * Encryption utilities for sensitive data
 * Uses AES-256-GCM for encryption
 */

import crypto from 'crypto';

// Algorithm
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // AES block size
const AUTH_TAG_LENGTH = 16; // GCM authentication tag
const KEY_LENGTH = 32; // 256 bits

/**
 * Get encryption key from environment
 * Key must be 64-character hex string (32 bytes)
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable not set');
  }
  
  if (key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be 64 character hex string (32 bytes)');
  }
  
  return Buffer.from(key, 'hex');
}

/**
 * Encrypt a string value
 * Returns: hex string of [IV || Auth Tag || Ciphertext]
 */
export function encrypt(plaintext: string): string {
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    
    const authTag = cipher.getAuthTag();
    
    // Combine: IV + AuthTag + Ciphertext
    const combined = Buffer.concat([iv, authTag, encrypted]);
    
    return combined.toString('hex');
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt a hex string
 * Input format: hex string of [IV || Auth Tag || Ciphertext]
 */
export function decrypt(ciphertext: string): string {
  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(ciphertext, 'hex');
    
    // Extract components
    const iv = combined.subarray(0, IV_LENGTH);
    const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Hash a value (one-way, for routing numbers)
 * Uses SHA-256
 */
export function hash(value: string): string {
  return crypto
    .createHash('sha256')
    .update(value)
    .digest('hex');
}

/**
 * Generate a secure random string
 * Used for verification codes, etc.
 */
export function generateSecureRandom(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Mask sensitive data for display
 * Shows only last N characters
 */
export function maskAccountNumber(accountNumber: string, visibleChars: number = 4): string {
  if (accountNumber.length <= visibleChars) {
    return '*'.repeat(accountNumber.length);
  }
  
  const masked = '*'.repeat(accountNumber.length - visibleChars);
  const visible = accountNumber.slice(-visibleChars);
  
  return masked + visible;
}

/**
 * Extract last 4 digits for display
 */
export function getLast4(value: string): string {
  return value.slice(-4);
}

/**
 * Validate encryption key format
 */
export function validateEncryptionKey(key: string): boolean {
  return /^[0-9a-f]{64}$/i.test(key);
}

// Test encryption on module load (only in development)
if (process.env.NODE_ENV === 'development') {
  try {
    const testString = 'test-encryption-12345';
    const encrypted = encrypt(testString);
    const decrypted = decrypt(encrypted);
    
    if (testString !== decrypted) {
      console.error('❌ Encryption test failed!');
    } else {
      console.log('✅ Encryption utilities loaded successfully');
    }
  } catch (error) {
    console.error('❌ Encryption test error:', error);
  }
}
```

### Test Encryption

```bash
# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to Railway staging environment variables
railway variables set ENCRYPTION_KEY=your_generated_key

# Test
railway run node -e "
const {encrypt, decrypt} = require('./dist/lib/encryption.js');
const test = 'account-123456789';
const enc = encrypt(test);
const dec = decrypt(enc);
console.log('Original:', test);
console.log('Encrypted:', enc);
console.log('Decrypted:', dec);
console.log('Match:', test === dec);
"
```

---

## 📝 **ITEMS 2-5: PRISMA SCHEMA MODELS**

### Update `backend/prisma/schema.prisma`

Add these models (already partially defined, complete them):

```prisma
// =============================================================================
// BANK ACCOUNTS
// =============================================================================

enum BankAccountType {
  CHECKING
  SAVINGS
}

enum BankAccountStatus {
  PENDING_VERIFICATION
  VERIFIED
  VERIFICATION_FAILED
  LOCKED
  REMOVED
}

enum VerificationMethod {
  PLAID
  MICRO_DEPOSIT
  MANUAL
}

model BankAccount {
  id                    String             @id @default(uuid())
  userId                String
  user                  User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Account details
  accountType           BankAccountType
  accountHolderName     String
  bankName              String?
  
  // Security (encrypted/hashed)
  last4                 String             // Last 4 digits (plaintext for display)
  routingNumberHash     String             // Hashed routing number
  accountNumberEnc      String             // Encrypted account number
  
  // Plaid integration
  plaidAccessTokenEnc   String?            // Encrypted Plaid access token
  plaidAccountId        String?            // Plaid account ID
  plaidItemId           String?            // Plaid item ID
  
  // Verification
  status                BankAccountStatus  @default(PENDING_VERIFICATION)
  verificationMethod    VerificationMethod?
  isDefault             Boolean            @default(false)
  
  // Micro-deposit verification
  microDepositAmount1   String?            // Encrypted amount
  microDepositAmount2   String?            // Encrypted amount
  microDepositExpiresAt DateTime?          // Expires after 7 days
  verificationAttempts  Int                @default(0)
  maxVerificationAttempts Int              @default(3)
  
  // Status tracking
  verifiedAt            DateTime?
  lockedAt              DateTime?
  removedAt             DateTime?          // Soft delete
  
  // Audit
  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt
  
  // Relations
  transactionsFrom      Transaction[]      @relation("TransactionFromAccount")
  transactionsTo        Transaction[]      @relation("TransactionToAccount")

  @@index([userId])
  @@index([status])
  @@index([removedAt])
  @@map("bank_accounts")
}

// =============================================================================
// TRANSACTIONS
// =============================================================================

enum TransactionType {
  DEPOSIT
  WITHDRAWAL
  DISTRIBUTION
  CONSTRUCTION_DRAW
  PLATFORM_FEE
  REFERRAL_FEE
  ESCROW_DEPOSIT
  ESCROW_WITHDRAWAL
  REFUND
  TRANSFER
}

enum TransactionStatus {
  INITIATED
  PENDING_APPROVAL
  APPROVED
  QUEUED
  PROCESSING
  PENDING_SETTLEMENT
  SETTLED
  COMPLETED
  FAILED
  CANCELLED
  REVERSED
  PENDING_RETRY
}

enum PaymentMethod {
  ACH
  WIRE
  CHECK
  CREDIT_CARD
  INTERNAL_TRANSFER
}

model Transaction {
  id                    String            @id @default(uuid())
  type                  TransactionType
  status                TransactionStatus @default(INITIATED)
  paymentMethod         PaymentMethod
  
  // Amounts
  amount                Float             // Transaction amount
  feeAmount             Float             @default(0)
  netAmount             Float             // Amount - fees
  currency              String            @default("USD")
  
  // Parties
  fromUserId            String?
  fromUser              User?             @relation("TransactionsFrom", fields: [fromUserId], references: [id], onDelete: SetNull)
  toUserId              String?
  toUser                User?             @relation("TransactionsTo", fields: [toUserId], references: [id], onDelete: SetNull)
  
  // Bank accounts
  fromBankAccountId     String?
  fromBankAccount       BankAccount?      @relation("TransactionFromAccount", fields: [fromBankAccountId], references: [id], onDelete: SetNull)
  toBankAccountId       String?
  toBankAccount         BankAccount?      @relation("TransactionToAccount", fields: [toBankAccountId], references: [id], onDelete: SetNull)
  
  // Related entities
  offeringId            String?
  offering              Offering?         @relation(fields: [offeringId], references: [id], onDelete: SetNull)
  escrowAccountId       String?
  escrowAccount         EscrowAccount?    @relation(fields: [escrowAccountId], references: [id], onDelete: SetNull)
  
  // Payment processor references
  stripePaymentIntentId String?          @unique
  stripeChargeId        String?
  stripeTransferId      String?
  plaidTransactionId    String?
  idempotencyKey        String           @unique
  
  // Description
  description           String?
  internalMemo          String?
  
  // Processing details
  failureCode           String?
  failureMessage        String?
  retryCount            Int              @default(0)
  maxRetries            Int              @default(3)
  nextRetryAt           DateTime?
  
  // Timestamps
  approvedAt            DateTime?
  processedAt           DateTime?
  settledAt             DateTime?
  completedAt           DateTime?
  failedAt              DateTime?
  cancelledAt           DateTime?
  
  // Audit & compliance
  ipAddress             String?
  userAgent             String?
  complianceCheckPassed Boolean          @default(false)
  complianceCheckData   Json?
  metadata              Json?
  
  createdAt             DateTime         @default(now())
  updatedAt             DateTime         @updatedAt

  @@index([type])
  @@index([status])
  @@index([fromUserId])
  @@index([toUserId])
  @@index([offeringId])
  @@index([escrowAccountId])
  @@index([createdAt])
  @@index([status, nextRetryAt])
  @@map("transactions")
}

// =============================================================================
// ESCROW ACCOUNTS
// =============================================================================

enum EscrowAccountStatus {
  ACTIVE
  FROZEN
  CLOSED
  LIQUIDATING
}

model EscrowAccount {
  id                  String              @id @default(uuid())
  offeringId          String              @unique
  offering            Offering            @relation(fields: [offeringId], references: [id], onDelete: Cascade)
  
  // Account details
  accountNumber       String              @unique
  externalAccountId   String?             // Stripe/bank account ID
  
  // Balances (in cents for precision)
  currentBalance      Float               @default(0)
  availableBalance    Float               @default(0)
  pendingBalance      Float               @default(0)
  heldBalance         Float               @default(0)
  
  // Totals
  totalDeposits       Float               @default(0)
  totalWithdrawals    Float               @default(0)
  totalDistributions  Float               @default(0)
  
  // Status
  status              EscrowAccountStatus @default(ACTIVE)
  frozenReason        String?
  frozenAt            DateTime?
  closedAt            DateTime?
  
  // Reconciliation
  lastReconciledAt    DateTime?
  lastReconciledBalance Float?
  
  // Audit
  metadata            Json?
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt
  
  // Relations
  transactions        Transaction[]

  @@index([offeringId])
  @@index([status])
  @@map("escrow_accounts")
}

// =============================================================================
// COMPLIANCE CHECKS
// =============================================================================

enum ComplianceCheckType {
  OFAC
  KYC
  AML
  ACCREDITATION
  LIMIT_CHECK
}

enum ComplianceCheckStatus {
  PENDING
  PASSED
  FAILED
  MANUAL_REVIEW
}

model ComplianceCheck {
  id              String                @id @default(uuid())
  
  // Entity being checked
  entityType      String                // USER, TRANSACTION, INVESTMENT
  entityId        String
  
  // Check details
  checkType       ComplianceCheckType
  status          ComplianceCheckStatus
  score           Float?                // Risk score if applicable
  
  // Results
  passed          Boolean
  failureReason   String?
  details         Json?                 // Full check results
  
  // Review
  requiresManualReview Boolean          @default(false)
  reviewedBy      String?
  reviewedAt      DateTime?
  reviewNotes     String?
  
  // Provider
  provider        String?               // e.g., "ComplyAdvantage", "Jumio"
  providerRef     String?               // Provider's reference ID
  
  // Audit
  performedAt     DateTime              @default(now())
  createdAt       DateTime              @default(now())

  @@index([entityType, entityId])
  @@index([checkType])
  @@index([status])
  @@index([performedAt])
  @@map("compliance_checks")
}
```

---

## 🗄️ **DATABASE MIGRATION**

### Create and Run Migration

```bash
# Generate migration
railway run npx prisma migrate dev --name add_finance_trust_module

# This creates:
# - BankAccount table
# - Transaction table
# - EscrowAccount table
# - ComplianceCheck table
# - All enums
# - All indexes

# Verify
railway run npx prisma migrate status

# Generate Prisma client
railway run npx prisma generate
```

### Seed Test Data

Create `backend/prisma/seed-finance.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { encrypt, hash } from '../src/lib/encryption';

const prisma = new PrismaClient();

async function seedFinance() {
  console.log('Seeding finance data...');
  
  // Get demo user
  const demoUser = await prisma.user.findFirst({
    where: { email: 'investor@realco.com' },
  });
  
  if (!demoUser) {
    console.log('Demo user not found, skipping finance seed');
    return;
  }
  
  // Create test bank account
  await prisma.bankAccount.create({
    data: {
      userId: demoUser.id,
      accountType: 'CHECKING',
      accountHolderName: 'John Doe',
      bankName: 'Chase Bank',
      last4: '6789',
      routingNumberHash: hash('110000000'),
      accountNumberEnc: encrypt('123456789'),
      status: 'VERIFIED',
      verificationMethod: 'PLAID',
      isDefault: true,
      verifiedAt: new Date(),
    },
  });
  
  console.log('✅ Finance data seeded');
}

seedFinance()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seed:
```bash
railway run npx tsx prisma/seed-finance.ts
```

---

**Continue to next message for Services implementation (Items 6-9)...**
