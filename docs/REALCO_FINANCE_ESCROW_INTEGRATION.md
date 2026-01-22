# RealCo Platform - Kealee Finance Escrow Module Integration Plan

## Overview

This document outlines the integration of the **Finance Escrow Module** from Kealee Platform V10 into RealCo's payment and transaction system. This proven escrow infrastructure will handle investor payments, capital distributions, construction draws, and all financial transactions within the RealCo platform.

**Integration Goals:**
1. Leverage Kealee's battle-tested escrow and payment infrastructure
2. Ensure SEC-compliant fund handling for investor transactions
3. Provide complete audit trail for all financial movements
4. Support multiple payment methods (ACH, wire, check)
5. Enable automated distribution calculations and disbursements
6. Integrate with construction draw requests
7. Handle fee calculations and splits

---

## Kealee Finance Escrow Module Capabilities

Based on Kealee Platform V10 architecture, the finance escrow module provides:

### Core Features

**Transaction Management:**
- Multi-party escrow accounts
- Payment initiation and tracking
- Transaction status monitoring
- Failed payment retry logic
- Refund processing
- Fee calculation and deduction

**Payment Methods:**
- ACH transfers (via Plaid or Stripe)
- Wire transfers with instructions
- Check processing and tracking
- Bank account verification (micro-deposits or instant via Plaid)

**Escrow Operations:**
- Segregated escrow accounts per offering
- Fund holding and release controls
- Multi-signature authorization
- Waterfall distribution calculations
- Preferred return tracking
- Profit split automation

**Financial Reporting:**
- Transaction history and reconciliation
- Payment status dashboards
- Distribution schedules
- Tax reporting preparation (1099s, K-1 basis tracking)
- Fee reporting

**Compliance & Audit:**
- All transactions logged with metadata
- AML/KYC integration
- OFAC screening
- Bank Secrecy Act (BSA) compliance
- Suspicious Activity Report (SAR) flagging
- Complete audit trail

### Technical Architecture (Kealee V10)

- **Payment Processors:** Stripe, Plaid integration
- **Database:** PostgreSQL with transaction isolation
- **Queue System:** Bull/BullMQ for async payment processing
- **Webhooks:** Real-time payment status updates
- **Encryption:** PCI-compliant data handling
- **Reconciliation:** Daily automated reconciliation with bank statements

---

## Integration Architecture

### High-Level Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      RealCo Platform                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │   Investor   │    │    Sponsor   │    │  Contractor  │    │
│  │  Investment  │    │  Fundraise   │    │   Payment    │    │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘    │
│         │                   │                    │             │
│         └───────────────────┴────────────────────┘             │
│                             │                                   │
│                  ┌──────────▼──────────┐                       │
│                  │  Finance Escrow     │                       │
│                  │  Module (Kealee)    │                       │
│                  ├─────────────────────┤                       │
│                  │                     │                       │
│                  │ • Payment Gateway   │                       │
│                  │ • Escrow Accounts   │                       │
│                  │ • Transaction Queue │                       │
│                  │ • Distribution Calc │                       │
│                  │ • Fee Processing    │                       │
│                  │ • Reconciliation    │                       │
│                  │                     │                       │
│                  └──────────┬──────────┘                       │
│                             │                                   │
│         ┌───────────────────┼───────────────────┐              │
│         │                   │                   │              │
│         ▼                   ▼                   ▼              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │  Stripe/    │    │  Compliance │    │   Audit     │       │
│  │  Plaid      │    │   Engine    │    │   Events    │       │
│  └─────────────┘    └─────────────┘    └─────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

External Integrations:
├── Stripe (ACH, card processing)
├── Plaid (bank verification, balance checks)
├── Banking APIs (wire transfers)
└── IRS 1099 Filing Services
```

---

## Database Schema Integration

### Kealee Finance Escrow Tables to Import

Add these tables to RealCo's Prisma schema:

```prisma
// ============================================================================
// FINANCE & ESCROW (Kealee Module)
// ============================================================================

enum PaymentGateway {
  STRIPE
  PLAID
  WIRE
  CHECK
}

enum BankAccountType {
  CHECKING
  SAVINGS
  MONEY_MARKET
}

enum BankAccountStatus {
  PENDING_VERIFICATION
  VERIFIED
  VERIFICATION_FAILED
  SUSPENDED
  CLOSED
}

model BankAccount {
  id                    Int                @id @default(autoincrement())
  userId                Int                @map("user_id")
  accountType           BankAccountType    @map("account_type")
  
  // Bank Details
  bankName              String             @map("bank_name")
  accountHolderName     String             @map("account_holder_name")
  accountNumberLast4    String             @map("account_number_last4")
  routingNumber         String             @map("routing_number")
  accountNumberHash     String             @map("account_number_hash") // Encrypted full number
  
  // Verification
  verificationStatus    BankAccountStatus  @map("verification_status") @default(PENDING_VERIFICATION)
  verificationMethod    String?            @map("verification_method") // PLAID, MICRO_DEPOSIT, MANUAL
  plaidAccountId        String?            @unique @map("plaid_account_id")
  plaidAccessToken      String?            @map("plaid_access_token") // Encrypted
  microDepositAmount1   Decimal?           @map("micro_deposit_amount_1") @db.Decimal(5, 2)
  microDepositAmount2   Decimal?           @map("micro_deposit_amount_2") @db.Decimal(5, 2)
  verificationAttempts  Int                @default(0) @map("verification_attempts")
  verifiedAt            DateTime?          @map("verified_at")
  
  // Settings
  isDefault             Boolean            @default(false) @map("is_default")
  isActive              Boolean            @default(true) @map("is_active")
  
  // Metadata
  metadata              Json?              // Additional bank-specific data
  createdAt             DateTime           @default(now()) @map("created_at")
  updatedAt             DateTime           @updatedAt @map("updated_at")
  
  // Relations
  user                  User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactionsFrom      Transaction[]      @relation("FromBankAccount")
  transactionsTo        Transaction[]      @relation("ToBankAccount")
  
  @@index([userId])
  @@index([verificationStatus])
  @@map("bank_accounts")
}

enum TransactionType {
  INVESTMENT_DEPOSIT
  CAPITAL_CALL_PAYMENT
  DISTRIBUTION_PAYOUT
  DRAW_PAYMENT
  PLATFORM_FEE
  SPONSOR_FEE
  REFUND
  INTEREST_PAYMENT
  DIVIDEND
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
  ON_HOLD
}

enum TransactionDirection {
  INBOUND   // Money coming into platform
  OUTBOUND  // Money leaving platform
  INTERNAL  // Between escrow accounts
}

model Transaction {
  id                    Int                @id @default(autoincrement())
  
  // Transaction Details
  transactionType       TransactionType    @map("transaction_type")
  transactionDirection  TransactionDirection @map("transaction_direction")
  amount                Decimal            @db.Decimal(12, 2)
  currency              String             @default("USD")
  
  // Parties
  fromUserId            Int?               @map("from_user_id")
  toUserId              Int?               @map("to_user_id")
  fromBankAccountId     Int?               @map("from_bank_account_id")
  toBankAccountId       Int?               @map("to_bank_account_id")
  fromEscrowAccountId   Int?               @map("from_escrow_account_id")
  toEscrowAccountId     Int?               @map("to_escrow_account_id")
  
  // Related Entities
  offeringId            Int?               @map("offering_id")
  investmentId          Int?               @map("investment_id")
  distributionId        Int?               @map("distribution_id")
  drawRequestId         Int?               @map("draw_request_id")
  
  // Payment Details
  paymentGateway        PaymentGateway     @map("payment_gateway")
  paymentMethod         String             @map("payment_method") // ACH, WIRE, CHECK, etc.
  
  // External IDs (from payment processors)
  stripePaymentIntentId String?            @map("stripe_payment_intent_id")
  stripeChargeId        String?            @map("stripe_charge_id")
  stripeTransferId      String?            @map("stripe_transfer_id")
  plaidTransactionId    String?            @map("plaid_transaction_id")
  checkNumber           String?            @map("check_number")
  wireConfirmationCode  String?            @map("wire_confirmation_code")
  
  // Status & Tracking
  status                TransactionStatus  @default(INITIATED)
  statusHistory         Json[]             @default([]) @map("status_history") // [{status, timestamp, reason}]
  
  // Fees
  platformFeeAmount     Decimal?           @map("platform_fee_amount") @db.Decimal(12, 2)
  processingFeeAmount   Decimal?           @map("processing_fee_amount") @db.Decimal(12, 2)
  netAmount             Decimal?           @map("net_amount") @db.Decimal(12, 2)
  
  // Failure Handling
  failureReason         String?            @map("failure_reason")
  failureCode           String?            @map("failure_code")
  retryCount            Int                @default(0) @map("retry_count")
  maxRetries            Int                @default(3) @map("max_retries")
  nextRetryAt           DateTime?          @map("next_retry_at")
  
  // Approval Workflow
  requiresApproval      Boolean            @default(false) @map("requires_approval")
  approvedBy            Int?               @map("approved_by")
  approvedAt            DateTime?          @map("approved_at")
  approvalNotes         String?            @map("approval_notes") @db.Text
  
  // Timestamps
  initiatedAt           DateTime           @default(now()) @map("initiated_at")
  processedAt           DateTime?          @map("processed_at")
  settledAt             DateTime?          @map("settled_at")
  completedAt           DateTime?          @map("completed_at")
  failedAt              DateTime?          @map("failed_at")
  cancelledAt           DateTime?          @map("cancelled_at")
  
  // Audit
  initiatedBy           Int                @map("initiated_by")
  ipAddress             String?            @map("ip_address")
  userAgent             String?            @map("user_agent")
  
  // Notes & Metadata
  description           String?            @db.Text
  internalNotes         String?            @map("internal_notes") @db.Text
  metadata              Json?              // Additional transaction-specific data
  
  createdAt             DateTime           @default(now()) @map("created_at")
  updatedAt             DateTime           @updatedAt @map("updated_at")
  
  // Relations
  fromUser              User?              @relation("TransactionFromUser", fields: [fromUserId], references: [id])
  toUser                User?              @relation("TransactionToUser", fields: [toUserId], references: [id])
  fromBankAccount       BankAccount?       @relation("FromBankAccount", fields: [fromBankAccountId], references: [id])
  toBankAccount         BankAccount?       @relation("ToBankAccount", fields: [toBankAccountId], references: [id])
  fromEscrowAccount     EscrowAccount?     @relation("FromEscrow", fields: [fromEscrowAccountId], references: [id])
  toEscrowAccount       EscrowAccount?     @relation("ToEscrow", fields: [toEscrowAccountId], references: [id])
  offering              Offering?          @relation(fields: [offeringId], references: [id])
  investment            Investment?        @relation(fields: [investmentId], references: [id])
  distribution          Distribution?      @relation(fields: [distributionId], references: [id])
  drawRequest           DrawRequest?       @relation(fields: [drawRequestId], references: [id])
  initiator             User               @relation("TransactionInitiator", fields: [initiatedBy], references: [id])
  approver              User?              @relation("TransactionApprover", fields: [approvedBy], references: [id])
  webhooks              TransactionWebhook[]
  
  @@index([status])
  @@index([transactionType])
  @@index([offeringId])
  @@index([investmentId])
  @@index([fromUserId])
  @@index([toUserId])
  @@index([initiatedAt])
  @@index([stripePaymentIntentId])
  @@map("transactions")
}

enum EscrowAccountType {
  OFFERING_ESCROW      // Holds investor funds for a specific offering
  OPERATING_ACCOUNT    // Platform operating account
  FEE_COLLECTION       // Collects platform fees
  CONSTRUCTION_DRAWS   // Holds funds for construction draws
  RESERVE_ACCOUNT      // Reserve funds
}

enum EscrowAccountStatus {
  PENDING_SETUP
  ACTIVE
  FROZEN
  CLOSED
}

model EscrowAccount {
  id                    Int                @id @default(autoincrement())
  
  // Account Details
  accountType           EscrowAccountType  @map("account_type")
  accountName           String             @map("account_name")
  accountNumber         String             @unique @map("account_number") // Encrypted
  routingNumber         String             @map("routing_number")
  
  // Bank Information
  bankName              String             @map("bank_name")
  bankAddress           String?            @map("bank_address")
  swiftCode             String?            @map("swift_code")
  
  // Balance
  currentBalance        Decimal            @default(0) @map("current_balance") @db.Decimal(12, 2)
  availableBalance      Decimal            @default(0) @map("available_balance") @db.Decimal(12, 2)
  pendingInbound        Decimal            @default(0) @map("pending_inbound") @db.Decimal(12, 2)
  pendingOutbound       Decimal            @default(0) @map("pending_outbound") @db.Decimal(12, 2)
  reservedAmount        Decimal            @default(0) @map("reserved_amount") @db.Decimal(12, 2)
  
  // Ownership
  offeringId            Int?               @unique @map("offering_id") // If offering-specific
  ownerId               Int?               @map("owner_id") // Platform admin or sponsor
  
  // Controls
  status                EscrowAccountStatus @default(PENDING_SETUP)
  requiresDualApproval  Boolean            @default(true) @map("requires_dual_approval")
  approvers             Int[]              @default([]) @map("approvers") // User IDs
  dailyWithdrawalLimit  Decimal?           @map("daily_withdrawal_limit") @db.Decimal(12, 2)
  
  // Reconciliation
  lastReconciledAt      DateTime?          @map("last_reconciled_at")
  lastReconciledBalance Decimal?           @map("last_reconciled_balance") @db.Decimal(12, 2)
  
  // Metadata
  metadata              Json?
  createdAt             DateTime           @default(now()) @map("created_at")
  updatedAt             DateTime           @updatedAt @map("updated_at")
  
  // Relations
  offering              Offering?          @relation(fields: [offeringId], references: [id])
  owner                 User?              @relation(fields: [ownerId], references: [id])
  transactionsFrom      Transaction[]      @relation("FromEscrow")
  transactionsTo        Transaction[]      @relation("ToEscrow")
  ledgerEntries         EscrowLedgerEntry[]
  
  @@index([accountType])
  @@index([status])
  @@index([offeringId])
  @@map("escrow_accounts")
}

enum LedgerEntryType {
  CREDIT  // Money in
  DEBIT   // Money out
}

model EscrowLedgerEntry {
  id                Int              @id @default(autoincrement())
  escrowAccountId   Int              @map("escrow_account_id")
  transactionId     Int              @map("transaction_id")
  
  // Entry Details
  entryType         LedgerEntryType  @map("entry_type")
  amount            Decimal          @db.Decimal(12, 2)
  balanceBefore     Decimal          @map("balance_before") @db.Decimal(12, 2)
  balanceAfter      Decimal          @map("balance_after") @db.Decimal(12, 2)
  
  // Description
  description       String
  category          String?          // INVESTMENT, DISTRIBUTION, FEE, etc.
  
  // Reconciliation
  reconciled        Boolean          @default(false)
  reconciledAt      DateTime?        @map("reconciled_at")
  
  createdAt         DateTime         @default(now()) @map("created_at")
  
  // Relations
  escrowAccount     EscrowAccount    @relation(fields: [escrowAccountId], references: [id], onDelete: Cascade)
  transaction       Transaction      @relation(fields: [transactionId], references: [id])
  
  @@index([escrowAccountId])
  @@index([transactionId])
  @@index([createdAt])
  @@map("escrow_ledger_entries")
}

enum DistributionType {
  RETURN_OF_CAPITAL
  PREFERRED_RETURN
  PROFIT_SPLIT
  INTEREST_PAYMENT
  DIVIDEND
  LIQUIDATION
}

enum DistributionStatus {
  SCHEDULED
  CALCULATED
  PENDING_APPROVAL
  APPROVED
  QUEUED
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
}

model Distribution {
  id                    Int                @id @default(autoincrement())
  offeringId            Int                @map("offering_id")
  
  // Distribution Details
  distributionType      DistributionType   @map("distribution_type")
  distributionDate      DateTime           @map("distribution_date")
  totalAmount           Decimal            @map("total_amount") @db.Decimal(12, 2)
  
  // Calculation
  calculationMethod     String             @map("calculation_method") // PRO_RATA, WATERFALL
  waterfallRules        Json?              @map("waterfall_rules") // If using waterfall
  
  // Status
  status                DistributionStatus @default(SCHEDULED)
  
  // Approval
  calculatedBy          Int?               @map("calculated_by")
  calculatedAt          DateTime?          @map("calculated_at")
  approvedBy            Int?               @map("approved_by")
  approvedAt            DateTime?          @map("approved_at")
  
  // Processing
  processedAt           DateTime?          @map("processed_at")
  completedAt           DateTime?          @map("completed_at")
  
  // Notes
  description           String?            @db.Text
  internalNotes         String?            @map("internal_notes") @db.Text
  
  createdAt             DateTime           @default(now()) @map("created_at")
  updatedAt             DateTime           @updatedAt @map("updated_at")
  
  // Relations
  offering              Offering           @relation(fields: [offeringId], references: [id])
  calculator            User?              @relation("DistributionCalculator", fields: [calculatedBy], references: [id])
  approver              User?              @relation("DistributionApprover", fields: [approvedBy], references: [id])
  investorDistributions InvestorDistribution[]
  transactions          Transaction[]
  
  @@index([offeringId])
  @@index([status])
  @@index([distributionDate])
  @@map("distributions")
}

enum InvestorDistributionStatus {
  CALCULATED
  PENDING_PAYMENT
  PAYMENT_INITIATED
  PAID
  FAILED
  CANCELLED
}

model InvestorDistribution {
  id                    Int                      @id @default(autoincrement())
  distributionId        Int                      @map("distribution_id")
  investmentId          Int                      @map("investment_id")
  investorId            Int                      @map("investor_id")
  
  // Amounts
  grossAmount           Decimal                  @map("gross_amount") @db.Decimal(12, 2)
  taxWithholding        Decimal                  @default(0) @map("tax_withholding") @db.Decimal(12, 2)
  fees                  Decimal                  @default(0) @db.Decimal(12, 2)
  netAmount             Decimal                  @map("net_amount") @db.Decimal(12, 2)
  
  // Breakdown (for waterfall distributions)
  returnOfCapital       Decimal?                 @map("return_of_capital") @db.Decimal(12, 2)
  preferredReturn       Decimal?                 @map("preferred_return") @db.Decimal(12, 2)
  profitSplit           Decimal?                 @map("profit_split") @db.Decimal(12, 2)
  
  // Payment
  status                InvestorDistributionStatus @default(CALCULATED)
  transactionId         Int?                     @unique @map("transaction_id")
  paymentMethod         String?                  @map("payment_method")
  paidAt                DateTime?                @map("paid_at")
  
  // Tax Reporting
  taxYear               Int?                     @map("tax_year")
  form1099Issued        Boolean                  @default(false) @map("form_1099_issued")
  
  createdAt             DateTime                 @default(now()) @map("created_at")
  updatedAt             DateTime                 @updatedAt @map("updated_at")
  
  // Relations
  distribution          Distribution             @relation(fields: [distributionId], references: [id], onDelete: Cascade)
  investment            Investment               @relation(fields: [investmentId], references: [id])
  investor              Investor                 @relation(fields: [investorId], references: [id])
  transaction           Transaction?             @relation(fields: [transactionId], references: [id])
  
  @@index([distributionId])
  @@index([investmentId])
  @@index([investorId])
  @@index([status])
  @@map("investor_distributions")
}

enum FeeType {
  PLATFORM_FEE
  MANAGEMENT_FEE
  PERFORMANCE_FEE
  TRANSACTION_FEE
  PROCESSING_FEE
  ACQUISITION_FEE
  DISPOSITION_FEE
  ASSET_MANAGEMENT_FEE
}

model FeeStructure {
  id                Int      @id @default(autoincrement())
  offeringId        Int?     @unique @map("offering_id")
  
  // Fee Configuration
  feeType           FeeType  @map("fee_type")
  feePercentage     Decimal? @map("fee_percentage") @db.Decimal(5, 4) // 0.0200 = 2%
  flatFeeAmount     Decimal? @map("flat_fee_amount") @db.Decimal(12, 2)
  
  // Application Rules
  appliesTo         String   @map("applies_to") // INVESTMENT, DISTRIBUTION, TRANSACTION
  minimumFee        Decimal? @map("minimum_fee") @db.Decimal(12, 2)
  maximumFee        Decimal? @map("maximum_fee") @db.Decimal(12, 2)
  
  // Split Rules
  platformSplit     Decimal  @default(100) @map("platform_split") @db.Decimal(5, 2) // Percentage
  sponsorSplit      Decimal  @default(0) @map("sponsor_split") @db.Decimal(5, 2)
  
  // Timing
  feeFrequency      String?  @map("fee_frequency") // ONE_TIME, MONTHLY, QUARTERLY, ANNUAL
  
  isActive          Boolean  @default(true) @map("is_active")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  
  // Relations
  offering          Offering? @relation(fields: [offeringId], references: [id])
  
  @@index([offeringId])
  @@map("fee_structures")
}

enum WebhookEventType {
  PAYMENT_INTENT_CREATED
  PAYMENT_INTENT_SUCCEEDED
  PAYMENT_INTENT_FAILED
  CHARGE_SUCCEEDED
  CHARGE_FAILED
  TRANSFER_CREATED
  TRANSFER_PAID
  TRANSFER_FAILED
  PAYOUT_PAID
  PAYOUT_FAILED
}

model TransactionWebhook {
  id                Int              @id @default(autoincrement())
  transactionId     Int              @map("transaction_id")
  
  // Webhook Details
  eventType         WebhookEventType @map("event_type")
  eventId           String           @unique @map("event_id") // From payment processor
  payload           Json             // Full webhook payload
  
  // Processing
  processed         Boolean          @default(false)
  processedAt       DateTime?        @map("processed_at")
  processingError   String?          @map("processing_error") @db.Text
  
  receivedAt        DateTime         @default(now()) @map("received_at")
  
  // Relations
  transaction       Transaction      @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  
  @@index([transactionId])
  @@index([eventType])
  @@index([processed])
  @@map("transaction_webhooks")
}

model ReconciliationReport {
  id                    Int      @id @default(autoincrement())
  escrowAccountId       Int?     @map("escrow_account_id")
  
  // Report Period
  periodStart           DateTime @map("period_start")
  periodEnd             DateTime @map("period_end")
  
  // Balances
  openingBalance        Decimal  @map("opening_balance") @db.Decimal(12, 2)
  closingBalance        Decimal  @map("closing_balance") @db.Decimal(12, 2)
  bankStatementBalance  Decimal  @map("bank_statement_balance") @db.Decimal(12, 2)
  
  // Activity
  totalCredits          Decimal  @map("total_credits") @db.Decimal(12, 2)
  totalDebits           Decimal  @map("total_debits") @db.Decimal(12, 2)
  transactionCount      Int      @map("transaction_count")
  
  // Reconciliation
  variance              Decimal  @map("variance") @db.Decimal(12, 2) // Bank vs ledger
  reconciled            Boolean  @default(false)
  reconciledBy          Int?     @map("reconciled_by")
  reconciledAt          DateTime? @map("reconciled_at")
  
  // Notes
  discrepancies         Json?    // [{description, amount, resolved}]
  notes                 String?  @db.Text
  
  // Report File
  reportFileUrl         String?  @map("report_file_url")
  
  createdAt             DateTime @default(now()) @map("created_at")
  
  // Relations
  escrowAccount         EscrowAccount? @relation(fields: [escrowAccountId], references: [id])
  reconciler            User?    @relation(fields: [reconciledBy], references: [id])
  
  @@index([escrowAccountId])
  @@index([periodStart])
  @@map("reconciliation_reports")
}

// Update existing models with relations
model Offering {
  // ... existing fields ...
  
  // Add relations
  escrowAccount     EscrowAccount?
  distributions     Distribution[]
  feeStructures     FeeStructure[]
  transactions      Transaction[]
}

model Investment {
  // ... existing fields ...
  
  // Add relations
  transactions            Transaction[]
  investorDistributions   InvestorDistribution[]
}

model Investor {
  // ... existing fields ...
  
  // Add relations
  investorDistributions   InvestorDistribution[]
}

model DrawRequest {
  // ... existing fields ...
  
  // Add relations
  transactions      Transaction[]
}

model User {
  // ... existing fields ...
  
  // Add relations
  bankAccounts                  BankAccount[]
  transactionsFrom              Transaction[]      @relation("TransactionFromUser")
  transactionsTo                Transaction[]      @relation("TransactionToUser")
  transactionsInitiated         Transaction[]      @relation("TransactionInitiator")
  transactionsApproved          Transaction[]      @relation("TransactionApprover")
  escrowAccounts                EscrowAccount[]
  distributionsCalculated       Distribution[]     @relation("DistributionCalculator")
  distributionsApproved         Distribution[]     @relation("DistributionApprover")
  reconciliationReports         ReconciliationReport[]
}
```

---

## API Integration Points

### Endpoint Mapping: Kealee Finance → RealCo

```typescript
// KEALEE ENDPOINTS                    →  REALCO ENDPOINTS
// ====================================================================

// Bank Accounts
GET  /api/finance/bank-accounts       →  GET  /api/v1/finance/bank-accounts
POST /api/finance/bank-accounts       →  POST /api/v1/finance/bank-accounts
POST /api/finance/bank-accounts/:id/verify → POST /api/v1/finance/bank-accounts/:id/verify
DELETE /api/finance/bank-accounts/:id →  DELETE /api/v1/finance/bank-accounts/:id

// Transactions
GET  /api/finance/transactions        →  GET  /api/v1/finance/transactions
POST /api/finance/transactions        →  POST /api/v1/finance/transactions
GET  /api/finance/transactions/:id    →  GET  /api/v1/finance/transactions/:id
POST /api/finance/transactions/:id/retry → POST /api/v1/finance/transactions/:id/retry
POST /api/finance/transactions/:id/cancel → POST /api/v1/finance/transactions/:id/cancel

// Escrow Accounts
GET  /api/finance/escrow-accounts     →  GET  /api/v1/finance/escrow-accounts
GET  /api/finance/escrow-accounts/:id →  GET  /api/v1/finance/escrow-accounts/:id
GET  /api/finance/escrow-accounts/:id/balance → GET /api/v1/finance/escrow-accounts/:id/balance
GET  /api/finance/escrow-accounts/:id/ledger → GET /api/v1/finance/escrow-accounts/:id/ledger

// Distributions
POST /api/finance/distributions/calculate → POST /api/v1/finance/distributions/calculate
POST /api/finance/distributions/:id/approve → POST /api/v1/finance/distributions/:id/approve
POST /api/finance/distributions/:id/process → POST /api/v1/finance/distributions/:id/process
GET  /api/finance/distributions/:id/preview → GET /api/v1/finance/distributions/:id/preview

// Reconciliation
GET  /api/finance/reconciliation      →  GET  /api/v1/finance/reconciliation
POST /api/finance/reconciliation      →  POST /api/v1/finance/reconciliation

// Webhooks (Stripe/Plaid)
POST /api/finance/webhooks/stripe     →  POST /api/v1/finance/webhooks/stripe
POST /api/finance/webhooks/plaid      →  POST /api/v1/finance/webhooks/plaid
```

---

## Critical Integration Services

### 1. Investment Payment Service

**Purpose:** Process investor investment payments

```typescript
// backend/src/services/finance/investmentPayment.service.ts

import { PrismaClient } from '@prisma/client';
import { runComplianceChecks, createAuditEvent } from '../../lib/compliance';
import { initiateStripePayment } from './stripe.service';
import { processACHTransfer } from './ach.service';

const prisma = new PrismaClient();

export async function processInvestmentPayment(data: {
  investmentId: number;
  bankAccountId: number;
  amount: number;
  userId: number;
}): Promise<Transaction> {
  
  // 1. Get investment and verify status
  const investment = await prisma.investment.findUnique({
    where: { id: data.investmentId },
    include: {
      offering: {
        include: {
          escrowAccount: true,
          deal: true
        }
      },
      investor: {
        include: { user: true }
      }
    }
  });
  
  if (!investment) throw new Error('Investment not found');
  if (investment.investmentStatus !== 'APPROVED') {
    throw new Error('Investment must be in APPROVED status');
  }
  
  // 2. Verify bank account
  const bankAccount = await prisma.bankAccount.findUnique({
    where: { id: data.bankAccountId }
  });
  
  if (!bankAccount) throw new Error('Bank account not found');
  if (bankAccount.verificationStatus !== 'VERIFIED') {
    throw new Error('Bank account must be verified');
  }
  
  // 3. Compliance checks
  const complianceContext = {
    action: 'PROCESS_INVESTMENT_PAYMENT',
    entity_type: 'TRANSACTION',
    entity_id: 0,
    user_id: data.userId,
    before_state: { investment_status: 'APPROVED' },
    after_state: { investment_status: 'FUNDS_PENDING', amount: data.amount },
    investment,
    bank_account: bankAccount
  };
  
  await runComplianceChecks('PROCESS_INVESTMENT_PAYMENT', complianceContext);
  
  // 4. Create transaction record
  const transaction = await prisma.transaction.create({
    data: {
      transactionType: 'INVESTMENT_DEPOSIT',
      transactionDirection: 'INBOUND',
      amount: data.amount,
      fromUserId: investment.investorId,
      fromBankAccountId: bankAccount.id,
      toEscrowAccountId: investment.offering.escrowAccount.id,
      offeringId: investment.offeringId,
      investmentId: investment.id,
      paymentGateway: 'STRIPE',
      paymentMethod: 'ACH',
      status: 'INITIATED',
      initiatedBy: data.userId,
      description: `Investment payment for ${investment.offering.deal.dealName}`
    }
  });
  
  // 5. Initiate payment with Stripe
  try {
    const paymentIntent = await initiateStripePayment({
      amount: data.amount,
      customerId: bankAccount.plaidAccountId,
      metadata: {
        transaction_id: transaction.id,
        investment_id: investment.id,
        offering_id: investment.offeringId
      }
    });
    
    // Update transaction with Stripe details
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        stripePaymentIntentId: paymentIntent.id,
        status: 'PROCESSING'
      }
    });
    
  } catch (error) {
    // Mark transaction as failed
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'FAILED',
        failureReason: error.message,
        failedAt: new Date()
      }
    });
    
    throw error;
  }
  
  // 6. Update investment status
  await prisma.investment.update({
    where: { id: investment.id },
    data: { investmentStatus: 'FUNDS_PENDING' }
  });
  
  // 7. Log audit event
  await createAuditEvent('PROCESS_INVESTMENT_PAYMENT', {
    ...complianceContext,
    entity_id: transaction.id
  }, []);
  
  return transaction;
}
```

### 2. Distribution Calculation Service

**Purpose:** Calculate and process investor distributions

```typescript
// backend/src/services/finance/distributionCalculation.service.ts

import { PrismaClient } from '@prisma/client';
import { runComplianceChecks } from '../../lib/compliance';

const prisma = new PrismaClient();

interface WaterfallRule {
  tier: number;
  type: 'PREFERRED_RETURN' | 'RETURN_OF_CAPITAL' | 'PROFIT_SPLIT';
  rate?: number; // For preferred return
  sponsorSplit?: number; // For profit split
  investorSplit?: number;
}

export async function calculateDistribution(data: {
  offeringId: number;
  totalDistributionAmount: number;
  distributionType: string;
  userId: number;
}): Promise<any> {
  
  // 1. Get offering with all investments
  const offering = await prisma.offering.findUnique({
    where: { id: data.offeringId },
    include: {
      investments: {
        where: { investmentStatus: 'ACTIVE' },
        include: {
          investor: {
            include: { user: true }
          }
        }
      },
      deal: true
    }
  });
  
  if (!offering) throw new Error('Offering not found');
  
  // 2. Get fee structure
  const feeStructure = await prisma.feeStructure.findFirst({
    where: {
      offeringId: offering.id,
      feeType: 'MANAGEMENT_FEE',
      isActive: true
    }
  });
  
  // 3. Calculate management fee
  const managementFee = feeStructure 
    ? Number(data.totalDistributionAmount) * Number(feeStructure.feePercentage)
    : 0;
  
  const netDistributable = data.totalDistributionAmount - managementFee;
  
  // 4. Create distribution record
  const distribution = await prisma.distribution.create({
    data: {
      offeringId: offering.id,
      distributionType: data.distributionType as any,
      distributionDate: new Date(),
      totalAmount: data.totalDistributionAmount,
      status: 'CALCULATED',
      calculatedBy: data.userId,
      calculatedAt: new Date(),
      description: `${data.distributionType} distribution`
    }
  });
  
  // 5. Calculate per-investor distributions
  const totalInvested = offering.investments.reduce(
    (sum, inv) => sum + Number(inv.investmentAmount),
    0
  );
  
  const investorDistributions = [];
  
  for (const investment of offering.investments) {
    const ownershipPct = Number(investment.investmentAmount) / totalInvested;
    const grossAmount = netDistributable * ownershipPct;
    
    // Apply any tax withholding
    const taxWithholding = 0; // TODO: Implement tax withholding logic
    const netAmount = grossAmount - taxWithholding;
    
    const investorDist = await prisma.investorDistribution.create({
      data: {
        distributionId: distribution.id,
        investmentId: investment.id,
        investorId: investment.investorId,
        grossAmount,
        taxWithholding,
        netAmount,
        status: 'CALCULATED'
      }
    });
    
    investorDistributions.push(investorDist);
  }
  
  // 6. Compliance check
  await runComplianceChecks('CALCULATE_DISTRIBUTION', {
    action: 'CALCULATE_DISTRIBUTION',
    entity_type: 'DISTRIBUTION',
    entity_id: distribution.id,
    user_id: data.userId,
    before_state: {},
    after_state: { distribution, investor_distributions: investorDistributions }
  });
  
  return {
    distribution,
    investorDistributions,
    summary: {
      totalAmount: data.totalDistributionAmount,
      managementFee,
      netDistributable,
      investorCount: investorDistributions.length
    }
  };
}

export async function processDistribution(
  distributionId: number,
  userId: number
): Promise<void> {
  
  // 1. Get distribution with all investor distributions
  const distribution = await prisma.distribution.findUnique({
    where: { id: distributionId },
    include: {
      investorDistributions: {
        include: {
          investment: {
            include: {
              investor: {
                include: {
                  user: true
                }
              }
            }
          }
        }
      },
      offering: {
        include: {
          escrowAccount: true
        }
      }
    }
  });
  
  if (!distribution) throw new Error('Distribution not found');
  if (distribution.status !== 'APPROVED') {
    throw new Error('Distribution must be approved first');
  }
  
  // 2. Check escrow balance
  if (distribution.offering.escrowAccount.availableBalance < distribution.totalAmount) {
    throw new Error('Insufficient funds in escrow account');
  }
  
  // 3. Process each investor distribution
  for (const investorDist of distribution.investorDistributions) {
    // Get investor's default bank account
    const bankAccount = await prisma.bankAccount.findFirst({
      where: {
        userId: investorDist.investment.investor.userId,
        isDefault: true,
        verificationStatus: 'VERIFIED'
      }
    });
    
    if (!bankAccount) {
      console.error(`No verified bank account for investor ${investorDist.investorId}`);
      continue;
    }
    
    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        transactionType: 'DISTRIBUTION_PAYOUT',
        transactionDirection: 'OUTBOUND',
        amount: investorDist.netAmount,
        fromEscrowAccountId: distribution.offering.escrowAccount.id,
        toUserId: investorDist.investment.investor.userId,
        toBankAccountId: bankAccount.id,
        distributionId: distribution.id,
        investmentId: investorDist.investmentId,
        paymentGateway: 'STRIPE',
        paymentMethod: 'ACH',
        status: 'INITIATED',
        initiatedBy: userId,
        description: `Distribution payout for ${distribution.distributionType}`
      }
    });
    
    // Link transaction to investor distribution
    await prisma.investorDistribution.update({
      where: { id: investorDist.id },
      data: {
        transactionId: transaction.id,
        status: 'PAYMENT_INITIATED'
      }
    });
    
    // Initiate ACH transfer (will be handled async by queue)
    await processACHTransfer(transaction.id);
  }
  
  // 4. Update distribution status
  await prisma.distribution.update({
    where: { id: distributionId },
    data: {
      status: 'PROCESSING',
      processedAt: new Date()
    }
  });
}
```

### 3. Draw Payment Service

**Purpose:** Process construction draw payments

```typescript
// backend/src/services/finance/drawPayment.service.ts

export async function processDrawPayment(
  drawRequestId: number,
  userId: number
): Promise<Transaction> {
  
  // 1. Get draw request
  const drawRequest = await prisma.drawRequest.findUnique({
    where: { id: drawRequestId },
    include: {
      project: {
        include: {
          developmentProject: {
            include: {
              deal: {
                include: {
                  offerings: {
                    include: {
                      escrowAccount: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      contractor: true
    }
  });
  
  if (!drawRequest) throw new Error('Draw request not found');
  if (drawRequest.status !== 'APPROVED') {
    throw new Error('Draw request must be approved');
  }
  
  // 2. Get contractor's bank account
  const contractorBank = await prisma.bankAccount.findFirst({
    where: {
      userId: drawRequest.contractor.userId,
      isDefault: true,
      verificationStatus: 'VERIFIED'
    }
  });
  
  if (!contractorBank) {
    throw new Error('Contractor has no verified bank account');
  }
  
  // 3. Get offering escrow account
  const offering = drawRequest.project.developmentProject.deal.offerings[0];
  if (!offering?.escrowAccount) {
    throw new Error('No escrow account found for this project');
  }
  
  // 4. Verify sufficient funds
  if (offering.escrowAccount.availableBalance < drawRequest.drawAmount) {
    throw new Error('Insufficient funds in escrow account');
  }
  
  // 5. Compliance check
  await runComplianceChecks('PROCESS_DRAW_PAYMENT', {
    action: 'PROCESS_DRAW_PAYMENT',
    entity_type: 'TRANSACTION',
    entity_id: 0,
    user_id: userId,
    before_state: { draw_status: 'APPROVED' },
    after_state: { draw_status: 'PAID' },
    draw_request: drawRequest
  });
  
  // 6. Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      transactionType: 'DRAW_PAYMENT',
      transactionDirection: 'OUTBOUND',
      amount: drawRequest.drawAmount,
      fromEscrowAccountId: offering.escrowAccount.id,
      toUserId: drawRequest.contractor.userId,
      toBankAccountId: contractorBank.id,
      drawRequestId: drawRequest.id,
      paymentGateway: 'STRIPE',
      paymentMethod: 'ACH',
      status: 'INITIATED',
      initiatedBy: userId,
      description: `Draw payment #${drawRequest.drawNumber} to ${drawRequest.contractor.companyName}`
    }
  });
  
  // 7. Update draw request
  await prisma.drawRequest.update({
    where: { id: drawRequestId },
    data: {
      status: 'PAID',
      paymentTransactionId: transaction.id
    }
  });
  
  // 8. Initiate payment
  await processACHTransfer(transaction.id);
  
  return transaction;
}
```

---

## Webhook Handler Integration

```typescript
// backend/src/routes/finance/webhooks.ts

import { FastifyInstance } from 'fastify';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

export async function webhookRoutes(server: FastifyInstance) {
  
  // Stripe webhook handler
  server.post('/api/v1/finance/webhooks/stripe', async (request, reply) => {
    const sig = request.headers['stripe-signature'] as string;
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(
        request.body as any,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      return reply.code(400).send({ error: 'Webhook signature verification failed' });
    }
    
    // Log webhook
    const transaction = await findTransactionByStripeId(event);
    
    if (transaction) {
      await prisma.transactionWebhook.create({
        data: {
          transactionId: transaction.id,
          eventType: mapStripeEventType(event.type),
          eventId: event.id,
          payload: event as any
        }
      });
    }
    
    // Process webhook
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
        
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object as Stripe.Charge);
        break;
        
      case 'transfer.paid':
        await handleTransferPaid(event.data.object as Stripe.Transfer);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return reply.send({ received: true });
  });
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Find transaction by Stripe payment intent ID
  const transaction = await prisma.transaction.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id }
  });
  
  if (!transaction) {
    console.error(`Transaction not found for payment intent: ${paymentIntent.id}`);
    return;
  }
  
  // Update transaction status
  await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      status: 'SETTLED',
      settledAt: new Date(),
      stripeChargeId: paymentIntent.latest_charge as string
    }
  });
  
  // If investment payment, update investment status
  if (transaction.investmentId) {
    await prisma.investment.update({
      where: { id: transaction.investmentId },
      data: { investmentStatus: 'FUNDED' }
    });
    
    // Update escrow account balance
    await updateEscrowBalance(
      transaction.toEscrowAccountId!,
      Number(transaction.amount),
      'CREDIT'
    );
    
    // Create ledger entry
    await createLedgerEntry(transaction);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const transaction = await prisma.transaction.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id }
  });
  
  if (!transaction) return;
  
  const failureMessage = paymentIntent.last_payment_error?.message || 'Unknown error';
  const failureCode = paymentIntent.last_payment_error?.code || 'unknown';
  
  await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      status: 'FAILED',
      failureReason: failureMessage,
      failureCode: failureCode,
      failedAt: new Date(),
      retryCount: { increment: 1 }
    }
  });
  
  // Schedule retry if under max retries
  if (transaction.retryCount < transaction.maxRetries) {
    const nextRetryAt = new Date(Date.now() + (30 * 60 * 1000)); // 30 minutes
    
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { 
        nextRetryAt,
        status: 'QUEUED'
      }
    });
  }
}

async function createLedgerEntry(transaction: any) {
  const escrowAccount = await prisma.escrowAccount.findUnique({
    where: { id: transaction.toEscrowAccountId }
  });
  
  if (!escrowAccount) return;
  
  await prisma.escrowLedgerEntry.create({
    data: {
      escrowAccountId: escrowAccount.id,
      transactionId: transaction.id,
      entryType: 'CREDIT',
      amount: transaction.amount,
      balanceBefore: escrowAccount.currentBalance,
      balanceAfter: escrowAccount.currentBalance + transaction.amount,
      description: transaction.description,
      category: transaction.transactionType
    }
  });
}

async function updateEscrowBalance(
  escrowAccountId: number,
  amount: number,
  type: 'CREDIT' | 'DEBIT'
) {
  const increment = type === 'CREDIT' ? amount : -amount;
  
  await prisma.escrowAccount.update({
    where: { id: escrowAccountId },
    data: {
      currentBalance: { increment },
      availableBalance: { increment }
    }
  });
}
```

---

## Migration Timeline

**Week 1:** Database schema migration
**Week 2:** Copy and adapt Kealee finance services
**Week 3:** Implement payment processor integrations (Stripe/Plaid)
**Week 4:** Build webhook handlers and async job processing
**Week 5:** Frontend payment components and flows
**Week 6:** Integration testing (investment payments, distributions, draws)
**Week 7:** Security audit and compliance review
**Week 8:** Production deployment

**Total: 8 weeks to production-ready finance system**

---

## Security Considerations

### PCI Compliance
- Never store full credit card numbers
- Use Stripe's tokenization
- All cardholder data encrypted at rest
- PCI DSS Level 1 compliance via Stripe

### Data Encryption
- Bank account numbers encrypted with AES-256
- Plaid access tokens encrypted
- SSL/TLS for all data in transit
- Key rotation policy (90 days)

### Access Controls
- Role-based permissions for financial operations
- Dual approval for large transactions (>$50k)
- Audit trail for all fund movements
- IP whitelist for admin finance operations

### Fraud Prevention
- OFAC screening on all transactions
- Velocity limits (max $ per day per user)
- Anomaly detection for unusual patterns
- Manual review queue for suspicious activity

---

## Compliance Checklist

- ✅ **Bank Secrecy Act (BSA):** Transaction reporting >$10k
- ✅ **Anti-Money Laundering (AML):** OFAC screening, KYC
- ✅ **SEC Custody Rules:** Qualified custodian for investor funds
- ✅ **State Money Transmitter:** Licenses if required by state
- ✅ **Tax Reporting:** 1099 generation, K-1 basis tracking
- ✅ **Audit Trail:** Immutable record of all transactions
- ✅ **Escrow Requirements:** Segregated accounts per offering

---

**END OF FINANCE ESCROW INTEGRATION PLAN**
