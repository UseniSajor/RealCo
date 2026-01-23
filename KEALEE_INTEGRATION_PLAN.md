# 🚀 Kealee Module Integration Plan - Phase 10

**Last Updated:** January 22, 2026  
**Status:** Planning Complete - Ready for Implementation  
**Modules:** Finance & Trust + PM (Project Management)

---

## 📋 **EXECUTIVE SUMMARY**

RealCo Platform (Phases 1-9 complete) will now integrate two proven Kealee modules:

| Module | Purpose | Priority | Effort |
|--------|---------|----------|--------|
| **Finance & Trust** | Payment processing, **escrow/trust operations**, compliance | 🔴 CRITICAL | 3-4 weeks |
| **PM (Project Management)** | Construction tracking, task management | 🟡 HIGH | 2-3 weeks |

**Note:** "Trust" in Kealee = Escrow functionality (holding funds in trust accounts for secure transactions)

**Total Timeline:** 5-7 weeks for complete integration  
**Strategy:** Selective integration - use only features that enhance RealCo

---

## 🎯 **MODULE 1: FINANCE & TRUST** (Priority 1)

**Note:** This is ONE combined module from Kealee. "Trust" = Escrow/trust account operations for secure fund handling.

### **Why First?**
Without payment processing, RealCo is demo-only. This module enables:
- Real investor capital contributions
- Automated distributions
- SEC-compliant escrow/trust operations (segregated accounts)
- Tax reporting (1099s, K-1s)

### **What It Provides:**

#### **Payment Processing:**
- ✅ ACH transfers via Stripe
- ✅ Bank account linking via Plaid
- ✅ Micro-deposit verification (backup)
- ✅ Wire transfer tracking
- ⚠️ Check processing (optional - less common)

#### **Escrow & Trust Operations:**
**("Trust" = Holding funds in escrow/trust accounts for secure transactions)**
- ✅ Segregated trust/escrow accounts per offering (SEC requirement)
- ✅ Multi-signature authorization for large transfers (dual approval)
- ✅ Fund holding and release controls (controlled disbursements)
- ✅ Automated distribution processing (from trust accounts to investors)
- ✅ Trust account reconciliation (daily balance verification)

#### **Compliance & Trust:**
- ✅ AML/KYC identity verification
- ✅ OFAC sanctions screening
- ✅ Bank Secrecy Act (BSA) compliance
- ✅ Suspicious Activity Report (SAR) flagging
- ✅ Complete audit trail (all transactions logged)

#### **Tax & Reporting:**
- ✅ 1099 generation for investors
- ✅ K-1 basis tracking for partnerships
- ✅ Daily bank reconciliation
- ✅ Transaction export (CSV, PDF)

### **Integration Decisions:**

#### **DECISION 1: Waterfall Calculations**
**Question:** Use Kealee's distribution waterfall OR RealCo's Phase 3 waterfall?

**RECOMMENDATION: Use RealCo's Phase 3 waterfall** ✅
- Already built and tested
- Tailored to RealCo's specific structure
- Use Kealee only for payment processing

**Implementation:**
```typescript
// Step 1: Calculate using RealCo Phase 3
const distribution = await RealCoDistributionService.calculateWaterfall(offeringId);

// Step 2: Process payments using Kealee
await KealeeFinanceService.processDistribution(distribution.breakdown);
```

#### **DECISION 2: Payment Methods**
**Include:**
- ✅ ACH (primary method)
- ✅ Wire transfers (high-value investors)
- ✅ Bank linking via Plaid

**Exclude:**
- ❌ Check processing (too manual, rare use case)

### **Backend Implementation:**

#### **Schema to Add (Prisma):**
```prisma
// Add to backend/prisma/schema.prisma

model BankAccount {
  id                String   @id @default(uuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  accountType       BankAccountType
  bankName          String?
  accountNumber     String   @db.Text // Encrypted
  routingNumber     String   @db.Text // Encrypted
  accountHolderName String
  isVerified        Boolean  @default(false)
  verificationMethod VerificationMethod?
  plaidItemId       String?
  plaidAccessToken  String?  @db.Text // Encrypted
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model Transaction {
  id                String         @id @default(uuid())
  offeringId        String?
  investorId        String?
  sponsorId         String?
  transactionType   TransactionType
  amount            Decimal        @db.Decimal(15, 2)
  currency          String         @default("USD")
  status            TransactionStatus
  paymentMethod     PaymentMethod
  bankAccountId     String?
  stripePaymentId   String?
  description       String
  metadata          Json?
  initiatedAt       DateTime       @default(now())
  completedAt       DateTime?
  failedAt          DateTime?
  errorMessage      String?
  retryCount        Int            @default(0)
  escrowAccountId   String?
  feeAmount         Decimal?       @db.Decimal(15, 2)
  netAmount         Decimal        @db.Decimal(15, 2)
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
}

model EscrowAccount {
  id              String   @id @default(uuid())
  offeringId      String   @unique
  accountNumber   String   @unique
  balance         Decimal  @db.Decimal(15, 2) @default(0)
  reservedAmount  Decimal  @db.Decimal(15, 2) @default(0)
  status          EscrowStatus
  stripeAccountId String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model ComplianceCheck {
  id              String   @id @default(uuid())
  userId          String
  checkType       ComplianceCheckType // KYC, AML, OFAC
  status          CheckStatus
  result          Json?
  performedAt     DateTime @default(now())
  expiresAt       DateTime?
  notes           String?
}

enum BankAccountType {
  CHECKING
  SAVINGS
  MONEY_MARKET
}

enum TransactionType {
  INVESTMENT
  DISTRIBUTION
  REFUND
  FEE
  DRAW_REQUEST
  PROVIDER_PAYMENT
}

enum TransactionStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
  REFUNDED
}

enum PaymentMethod {
  ACH
  WIRE
  CHECK
}

enum EscrowStatus {
  ACTIVE
  SUSPENDED
  CLOSED
}

enum ComplianceCheckType {
  KYC
  AML
  OFAC
  ACCREDITATION
}

enum CheckStatus {
  PENDING
  APPROVED
  REJECTED
  EXPIRED
}
```

#### **Services to Build:**
```bash
backend/src/services/
├── bank-account.service.ts
│   - addBankAccount(userId, data)
│   - linkPlaidAccount(userId, publicToken)
│   - verifyMicroDeposits(accountId, amounts)
│   - getBankAccounts(userId)
│   - setDefaultAccount(accountId)
│
├── plaid.service.ts
│   - createLinkToken(userId)
│   - exchangePublicToken(publicToken)
│   - getBalance(accessToken)
│   - verifyAccount(accessToken)
│
├── stripe-payment.service.ts (enhance existing)
│   - processACHPayment(amount, bankAccountId)
│   - createTransfer(amount, destinationAccount)
│   - handleWebhook(event)
│   - retryFailedPayment(transactionId)
│
├── escrow.service.ts
│   - createEscrowAccount(offeringId)
│   - depositFunds(escrowAccountId, amount)
│   - releaseFunds(escrowAccountId, amount)
│   - getBalance(escrowAccountId)
│   - holdFunds(escrowAccountId, amount, reason)
│
├── compliance.service.ts
│   - performKYC(userId, documents)
│   - checkOFAC(name, dob, ssn)
│   - verifyAccreditation(userId, documents)
│   - flagSuspiciousActivity(transactionId, reason)
│
└── tax-reporting.service.ts
    - generate1099(userId, year)
    - generateK1(userId, offeringId, year)
    - trackDistributions(userId, year)
    - exportTaxSummary(userId, year)
```

#### **API Routes to Add:**
```typescript
// backend/src/api/routes/banking.routes.ts
POST   /api/v1/banking/accounts                 // Add bank account
GET    /api/v1/banking/accounts                 // List accounts
DELETE /api/v1/banking/accounts/:id             // Remove account
POST   /api/v1/banking/accounts/:id/verify      // Verify micro-deposits
POST   /api/v1/banking/accounts/:id/default     // Set as default
POST   /api/v1/banking/plaid/link-token         // Get Plaid link token
POST   /api/v1/banking/plaid/exchange           // Exchange public token

// backend/src/api/routes/payment.routes.ts
POST   /api/v1/payments/invest                  // Initiate investment
POST   /api/v1/payments/distribute              // Process distribution
GET    /api/v1/payments/transactions            // List transactions
GET    /api/v1/payments/transactions/:id        // Get transaction
POST   /api/v1/payments/transactions/:id/retry  // Retry failed payment

// backend/src/api/routes/escrow.routes.ts
POST   /api/v1/escrow/accounts                  // Create escrow account
GET    /api/v1/escrow/accounts/:offeringId      // Get escrow details
GET    /api/v1/escrow/accounts/:id/balance      // Get balance

// backend/src/api/routes/compliance.routes.ts
POST   /api/v1/compliance/kyc                   // Submit KYC
POST   /api/v1/compliance/accreditation         // Verify accreditation
GET    /api/v1/compliance/status                // Check compliance status
```

### **Frontend Implementation:**

#### **Investor Portal Pages:**

**1. Bank Account Management** (`/dashboard/investor/banking`)
```tsx
Features:
- List linked bank accounts (show last 4 digits only)
- Add bank account button:
  - Option 1: Plaid instant link (recommended)
  - Option 2: Manual entry with micro-deposit verification
- Verification status badges (Pending, Verified, Failed)
- Set default payment method
- Remove account option

Components:
<PlaidLink onSuccess={handlePlaidSuccess} />
<BankAccountList accounts={accounts} />
<AddBankAccountModal />
<VerifyMicroDepositsModal />
```

**2. Fund Investment** (`/dashboard/investor/fund/[offeringId]`)
```tsx
Features:
- Offering details summary
- Investment amount input (validate against offering limits)
- Bank account selection (verified accounts only)
- Fee breakdown (if any)
- ACH authorization checkbox
- Review & confirm screen
- Payment status tracking

Flow:
1. Select offering to invest in
2. Enter investment amount
3. Select bank account
4. Review terms & fees
5. Authorize ACH
6. Submit → Show pending status
7. Redirect to transaction tracking
```

**3. Transaction History** (`/dashboard/investor/transactions`)
```tsx
Features:
- Sortable/filterable table
  - Columns: Date, Type, Amount, Status, Offering, Receipt
  - Filters: Date range, Type (Investment/Distribution/Fee), Status
- Status badges (Pending, Processing, Completed, Failed)
- Download receipt per transaction
- Export all transactions (CSV)
- Retry failed payments (if applicable)

Stats at top:
- Total invested YTD
- Total distributions received YTD
- Pending transactions count
- Average processing time
```

**4. Tax Center Enhancement** (`/dashboard/investor/tax-center`)
```tsx
Add to existing Phase 6 page:
- 1099 forms download (per year)
- K-1 forms download (per offering, per year)
- Consolidated tax summary (all offerings)
- Distribution summary for tax year
- Cost basis tracking

New section:
📊 Tax Summary 2026
├── Total Distributions: $45,230
├── Taxable Income: $12,400
├── Depreciation Deductions: $8,200
├── Cost Basis: $250,000
└── Available Forms:
    ├── Form 1099 ✅ Download
    ├── K-1 (Offering A) ✅ Download
    └── K-1 (Offering B) ✅ Download
```

#### **Sponsor Portal Pages:**

**1. Capital Management** (`/dashboard/sponsor/capital-management`)
```tsx
Features:
- Real-time capital raised dashboard
  - Total raised vs target (progress bar)
  - Number of investors
  - Average investment size
  - Funding velocity chart (daily/weekly)

- Pending investments table
  - Investor name
  - Amount
  - Payment status
  - ACH submission date
  - Expected clearing date
  - Actions: View details

- Escrow account summary
  - Available balance
  - Reserved funds (pending distributions)
  - Recent transactions
  - Transfer to operating account option

Stats cards:
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Capital Raised  │ │ Pending Funds   │ │ Escrow Balance  │
│ $2.4M / $5M     │ │ $125K           │ │ $2.275M         │
│ 48% funded      │ │ 3 investors     │ │ Available       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

**2. Distribution Processing** (`/dashboard/sponsor/distributions/process`)
```tsx
Features:
- Select offering
- Enter distribution date
- Calculate distribution (use RealCo Phase 3 waterfall)
- Review breakdown per investor
- Preview payments
- Approve & schedule
- Process via Kealee Finance

Flow:
1. Click "New Distribution"
2. Select offering
3. System calculates using Phase 3 waterfall
4. Review investor breakdown:
   ┌────────────────────────────────────────────┐
   │ Investor: John Smith                       │
   │ Capital Account: $250,000                  │
   │ Return of Capital: $10,000                 │
   │ Preferred Return (8%): $5,000              │
   │ Profit Split (80/20): $3,200               │
   │ Total Distribution: $18,200                │
   │ Payment Method: ACH (Bank ***4567)         │
   └────────────────────────────────────────────┘
5. Approve → Schedule → Process
6. Track payment status
```

**3. Investor Management Enhancement** (Add to existing)
```tsx
Add to existing investor list:
- Payment status per investor
- Bank account verification status
- Last investment date
- Total capital contributed (actual, not just committed)
- Payment history link
- Send payment reminder (for pending investments)
```

#### **Fund Manager Portal Pages:**

**1. Finance Dashboard** (`/dashboard/fund-manager/finance-overview`)
```tsx
Features:
- Multi-offering finance overview
- Escrow accounts status (all offerings)
- Recent transactions across portfolio
- Compliance alerts
- Distribution schedule (upcoming)

Stats:
- Total AUM (Assets Under Management)
- Total escrow balance
- Pending transactions
- Compliance issues to resolve
```

**2. Compliance Monitoring** (`/dashboard/fund-manager/compliance`)
```tsx
Features:
- KYC/AML status per investor
- OFAC screening results
- Accreditation verification status
- Flagged transactions (SAR)
- Document review queue

Table:
┌──────────────┬─────────┬────────┬──────────────┬────────┐
│ Investor     │ KYC     │ AML    │ Accreditation│ Actions│
├──────────────┼─────────┼────────┼──────────────┼────────┤
│ John Smith   │ ✅ Pass │ ✅ Pass│ ✅ Verified  │ View   │
│ Jane Doe     │ ⏳ Pend │ ✅ Pass│ ⏳ Pending   │ Review │
│ Bob Johnson  │ ❌ Fail │ ⏳ Pend│ ❌ Expired   │ Flag   │
└──────────────┴─────────┴────────┴──────────────┴────────┘
```

#### **Provider Portal:**

**1. Payment Tracking** (Add to existing vendor portal)
```tsx
Add section to existing /dashboard/provider/vendor-portal:
- Pending payments (draw requests, invoices)
- Payment history
- Bank account setup (receive payments)
- Average payment time tracking
```

### **Environment Variables Required:**

```bash
# Add to backend/.env

# Plaid
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_secret
PLAID_ENV=sandbox # or development, production

# Stripe (enhance existing)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Encryption for bank account data
BANK_ACCOUNT_ENCRYPTION_KEY=generate_32_byte_key

# Compliance APIs (optional third-party)
KYC_API_KEY=xxx # if using third-party KYC service
OFAC_API_KEY=xxx # if using third-party OFAC service
```

### **NPM Dependencies:**

```bash
# Backend
npm install --save stripe plaid bull bullmq ioredis @stripe/stripe-js bcryptjs

# Frontend
npm install --save react-plaid-link @stripe/stripe-js @stripe/react-stripe-js
```

---

## 🏗️ **MODULE 2: PM (PROJECT MANAGEMENT)** (Priority 2)

### **Why Second?**
Construction tracking is valuable but not blocking. Can be added after payment processing is live.

### **What It Provides:**

#### **Core Features:**
- ✅ Project setup linked to funded offerings
- ✅ Task management with dependencies
- ✅ Critical path calculation
- ✅ Daily logs with photo upload
- ✅ Budget tracking (planned vs actual)
- ✅ Schedule variance tracking
- ⚠️ RFI management (optional - may be too complex)
- ⚠️ Submittal tracking (optional)
- ⚠️ Inspection scheduling (optional)
- ❌ Safety incident reporting (exclude - not core to RealCo)

### **Integration Decisions:**

#### **DECISION 3: PM Feature Scope**
**Include (Core):**
- ✅ Project/Task tracking
- ✅ Daily logs with photos
- ✅ Budget vs actual
- ✅ Schedule tracking
- ✅ Progress updates → Investor portal

**Exclude (Too Complex):**
- ❌ Full RFI workflow
- ❌ Submittal management
- ❌ Safety module
- ❌ Quality control

**Why?** RealCo is investor-focused, not general contractor-focused. Keep PM simple.

### **Backend Implementation:**

#### **Schema to Add:**

```prisma
// Add to backend/prisma/schema.prisma

model DevelopmentProject {
  id          String   @id @default(uuid())
  offeringId  String   @unique
  offering    Offering @relation(fields: [offeringId], references: [id])
  name        String
  address     String
  projectType ProjectType
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  projects    Project[]
}

model Project {
  id                    String              @id @default(uuid())
  developmentProjectId  String
  developmentProject    DevelopmentProject  @relation(fields: [developmentProjectId], references: [id])
  projectCode           String              @unique // RC-2026-001
  phase                 ProjectPhase
  percentComplete       Int                 @default(0)
  plannedStartDate      DateTime
  plannedEndDate        DateTime
  actualStartDate       DateTime?
  actualEndDate         DateTime?
  budget                Decimal             @db.Decimal(15, 2)
  actualCost            Decimal             @db.Decimal(15, 2) @default(0)
  scheduleVarianceDays  Int                 @default(0) // Positive = ahead, negative = behind
  costVariance          Decimal             @db.Decimal(15, 2) @default(0)
  status                ProjectStatus       @default(ACTIVE)
  deletedAt             DateTime?
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt
  tasks                 Task[]
  milestones            Milestone[]
  dailyLogs             DailyLog[]
}

model Task {
  id                  String       @id @default(uuid())
  projectId           String
  project             Project      @relation(fields: [projectId], references: [id])
  name                String
  description         String?
  parentTaskId        String?
  predecessorTaskIds  String[]     // Array of task IDs
  lagDays             Int          @default(0)
  plannedStartDate    DateTime
  plannedEndDate      DateTime
  actualStartDate     DateTime?
  actualEndDate       DateTime?
  status              TaskStatus   @default(NOT_STARTED)
  priority            TaskPriority @default(NORMAL)
  assignedToId        String?
  percentComplete     Int          @default(0)
  estimatedHours      Decimal?     @db.Decimal(8, 2)
  actualHours         Decimal?     @db.Decimal(8, 2)
  budgetAmount        Decimal?     @db.Decimal(15, 2)
  actualCost          Decimal?     @db.Decimal(15, 2)
  isCriticalPath      Boolean      @default(false)
  notes               String?
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt
}

model Milestone {
  id             String    @id @default(uuid())
  projectId      String
  project        Project   @relation(fields: [projectId], references: [id])
  name           String
  description    String?
  targetDate     DateTime
  completedDate  DateTime?
  status         MilestoneStatus @default(PENDING)
  relatedTaskIds String[]  // Array of task IDs
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model DailyLog {
  id             String    @id @default(uuid())
  projectId      String
  project        Project   @relation(fields: [projectId], references: [id])
  logDate        DateTime
  weather        WeatherCondition?
  temperature    String?
  laborCount     Int?
  equipmentUsed  String?
  workCompleted  String
  issues         String?
  visitorLog     String?
  safetyNotes    String?
  photoUrls      String[]  // S3 URLs
  createdBy      String
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

enum ProjectType {
  NEW_CONSTRUCTION
  RENOVATION
  MULTI_FAMILY
  COMMERCIAL
  MIXED_USE
}

enum ProjectPhase {
  PRE_CONSTRUCTION
  MOBILIZATION
  FOUNDATION
  FRAMING
  MEP_ROUGH_IN
  EXTERIOR_CLOSEUP
  INTERIOR_FINISHES
  CLOSEOUT
  COMPLETE
}

enum ProjectStatus {
  ACTIVE
  ON_HOLD
  COMPLETED
  CANCELLED
}

enum TaskStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
  ON_HOLD
  CANCELLED
}

enum TaskPriority {
  LOW
  NORMAL
  HIGH
  CRITICAL
}

enum MilestoneStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  DELAYED
}

enum WeatherCondition {
  CLEAR
  CLOUDY
  RAIN
  SNOW
  EXTREME_HEAT
  EXTREME_COLD
}
```

#### **Services to Build:**

```bash
backend/src/services/
├── project.service.ts
│   - createProject(developmentProjectId, data)
│   - getProject(projectId)
│   - updateProgress(projectId, percentComplete)
│   - calculateScheduleVariance(projectId)
│   - getProjectMetrics(projectId)
│   - archiveProject(projectId)
│
├── task.service.ts
│   - createTask(projectId, data)
│   - updateTask(taskId, updates)
│   - getTasks(projectId, filters)
│   - calculateCriticalPath(projectId)
│   - updateTaskProgress(taskId, percentComplete)
│   - validateDependencies(task)
│   - getTaskHierarchy(projectId)
│
├── daily-log.service.ts
│   - createDailyLog(projectId, data)
│   - getDailyLogs(projectId, dateRange)
│   - uploadPhotos(files)
│   - getDailyLogPhotos(logId)
│
└── milestone.service.ts
    - createMilestone(projectId, data)
    - updateMilestoneStatus(milestoneId, status)
    - getMilestones(projectId)
    - checkMilestoneCompletion(milestoneId)
```

#### **API Routes to Add:**

```typescript
// backend/src/api/routes/construction.routes.ts
POST   /api/v1/construction/projects              // Create project
GET    /api/v1/construction/projects              // List projects
GET    /api/v1/construction/projects/:id          // Get project
PATCH  /api/v1/construction/projects/:id          // Update project
PATCH  /api/v1/construction/projects/:id/progress // Update progress
GET    /api/v1/construction/projects/:id/metrics  // Get metrics
POST   /api/v1/construction/projects/:id/archive  // Archive

POST   /api/v1/construction/projects/:id/tasks    // Create task
GET    /api/v1/construction/projects/:id/tasks    // List tasks
PATCH  /api/v1/construction/tasks/:id             // Update task
PATCH  /api/v1/construction/tasks/:id/progress    // Update progress
GET    /api/v1/construction/projects/:id/critical-path // Get critical path

POST   /api/v1/construction/projects/:id/daily-logs // Create log
GET    /api/v1/construction/projects/:id/daily-logs // List logs
POST   /api/v1/construction/daily-logs/:id/photos   // Upload photos

POST   /api/v1/construction/projects/:id/milestones // Create milestone
GET    /api/v1/construction/projects/:id/milestones // List milestones
PATCH  /api/v1/construction/milestones/:id          // Update milestone
```

### **Frontend Implementation:**

#### **Sponsor Portal:**

**1. Construction Dashboard** (`/dashboard/sponsor/construction`)
```tsx
Features:
- Project list with cards
  - Project name & address
  - Phase (badge)
  - Progress % (progress bar)
  - Budget: Planned vs Actual
  - Schedule: On time / X days behind/ahead
  - Last updated date
  - View details button

Stats at top:
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Active Projects │ │ Avg Progress    │ │ Budget Variance │
│ 4 projects      │ │ 67% complete    │ │ -2.3% under     │
└─────────────────┘ └─────────────────┘ └─────────────────┘

Filter: Phase, Status
Sort: Progress, Budget, Schedule
```

**2. Project Detail** (`/dashboard/sponsor/construction/[projectId]`)
```tsx
Features:
- Project header (name, address, phase, progress)
- 4 main tabs:

Tab 1: Overview
- Budget breakdown (planned vs actual)
- Schedule timeline (visual)
- Key metrics cards
- Recent daily logs (last 5)
- Upcoming milestones

Tab 2: Tasks
- Task list (table view)
  - Name, Assigned to, Status, Progress, Dates
  - Filter: Status, Priority, Assigned to
  - Critical path tasks highlighted
- Create task button
- Gantt chart view (simple, using react-gantt)

Tab 3: Daily Logs
- Log entry form (if creating new)
- Log history (list view)
  - Date, Weather, Work completed summary
  - Labor count, Equipment
  - Photos (gallery view)
  - Issues flagged
- Photo upload (drag & drop to S3)

Tab 4: Milestones
- Milestone list with status
- Target date vs completion date
- Create milestone button
```

**3. Task Management Modal**
```tsx
Form fields:
- Task name*
- Description
- Parent task (dropdown)
- Predecessor tasks (multi-select)
- Planned start/end dates*
- Assigned to (dropdown of project team)
- Priority (dropdown)
- Budget amount
- Notes

Validation:
- Check for circular dependencies
- Ensure dates are logical
- Auto-calculate critical path on save
```

**4. Daily Log Entry** (`/dashboard/sponsor/construction/[projectId]/daily-logs/new`)
```tsx
Form:
- Date* (date picker, default today)
- Weather conditions (dropdown)
- Temperature
- Labor count (number)
- Equipment used (textarea)
- Work completed* (rich text editor)
- Issues encountered (textarea)
- Visitor log (textarea)
- Safety notes (textarea)
- Photo upload (multi-file, S3)
  - Preview thumbnails
  - Max 10 photos per log

Submit → Redirect to project detail
```

#### **Investor Portal:**

**1. Project Progress** (`/dashboard/investor/projects/[projectId]`)
```tsx
Features (READ-ONLY):
- Project overview
  - Name, address, type
  - Current phase (visual progress)
  - Overall % complete
  - Estimated completion date

- Photo gallery (from daily logs)
  - Chronological order
  - Date stamps
  - Before/after views

- Milestone tracker
  - Visual timeline
  - Completed milestones (✅)
  - Upcoming milestones
  - Target dates

- High-level budget status
  - On budget / over budget
  - No detailed breakdown (keep private)

Updates section:
- Recent progress updates (from daily logs)
- Major milestones achieved
- Expected next milestone

Note: Investors see progress, NOT detailed tasks/costs
```

#### **Provider Portal:**

**1. Project Assignments** (`/dashboard/provider/projects`)
```tsx
Features:
- List of projects where provider is involved
- Assigned tasks (from Task model)
  - Task name
  - Due date
  - Status
  - Update status button

- Submit work update
  - Upload photos of completed work
  - Add notes
  - Mark task progress %

Keep simple - providers don't need full PM access
```

### **NPM Dependencies (PM Module):**

```bash
# Frontend
npm install --save react-gantt-chart date-fns react-dropzone @tiptap/react @tiptap/starter-kit
```

---

## 📅 **IMPLEMENTATION TIMELINE**

### **Week 1-2: Finance & Trust Backend** ⭐
- [ ] Add Prisma schema (BankAccount, Transaction, Escrow, Compliance)
- [ ] Build bank-account.service.ts
- [ ] Integrate Plaid (plaid.service.ts)
- [ ] Enhance Stripe service for ACH
- [ ] Build escrow.service.ts
- [ ] Build compliance.service.ts
- [ ] Add API routes for banking, payments, escrow
- [ ] Test API endpoints with Postman
- [ ] Create migration: `npx prisma migrate dev --name add_finance_trust`

### **Week 3: Finance & Trust Frontend (Investor)**
- [ ] `/dashboard/investor/banking` page
- [ ] Plaid Link integration
- [ ] `/dashboard/investor/fund/[offeringId]` page (investment flow)
- [ ] `/dashboard/investor/transactions` page
- [ ] Enhance tax center with 1099/K-1 downloads
- [ ] Test investor payment flow end-to-end

### **Week 4: Finance & Trust Frontend (Sponsor + Fund Manager)**
- [ ] `/dashboard/sponsor/capital-management` page
- [ ] `/dashboard/sponsor/distributions/process` page
- [ ] `/dashboard/fund-manager/finance-overview` page
- [ ] `/dashboard/fund-manager/compliance` page
- [ ] Connect RealCo Phase 3 waterfall to Kealee payment processing
- [ ] Test distribution flow end-to-end

### **Week 5: PM Backend**
- [ ] Add Prisma schema (Project, Task, DailyLog, Milestone)
- [ ] Build project.service.ts
- [ ] Build task.service.ts (with critical path calculation)
- [ ] Build daily-log.service.ts
- [ ] Build milestone.service.ts
- [ ] Add API routes for construction
- [ ] Link to S3 for photo uploads
- [ ] Test API endpoints
- [ ] Create migration: `npx prisma migrate dev --name add_pm_module`

### **Week 6: PM Frontend (Sponsor)**
- [ ] `/dashboard/sponsor/construction` page (project list)
- [ ] `/dashboard/sponsor/construction/[projectId]` page (detail)
- [ ] Task management UI
- [ ] Daily log entry form with photo upload
- [ ] Gantt chart integration
- [ ] Test project tracking flow

### **Week 7: PM Frontend (Investor + Provider)**
- [ ] `/dashboard/investor/projects/[projectId]` page (read-only progress)
- [ ] `/dashboard/provider/projects` page (assignments)
- [ ] Test all user journeys
- [ ] Polish UI consistency

### **Week 8: Testing, Documentation, Deploy**
- [ ] End-to-end testing (all roles)
- [ ] Update `MASTER_BUILD_PLAN_V2_IMPLEMENTATION_STATUS.md`
- [ ] Create `KEALEE_INTEGRATION_COMPLETE.md` summary
- [ ] Update README with new features
- [ ] Local build test: `npm run build`
- [ ] Git commit and push
- [ ] Verify Vercel deployment
- [ ] Test production environment

---

## 🔧 **TECHNICAL REQUIREMENTS**

### **Backend Setup:**

1. **Database Migration:**
```bash
cd backend
npx prisma migrate dev --name add_finance_trust_pm_modules
npx prisma generate
```

2. **Environment Variables:**
```bash
# Add to backend/.env (see sections above for full list)
PLAID_CLIENT_ID=xxx
PLAID_SECRET=xxx
STRIPE_SECRET_KEY=xxx
BANK_ACCOUNT_ENCRYPTION_KEY=xxx
```

3. **Install Dependencies:**
```bash
cd backend
npm install --save stripe plaid bull bullmq ioredis bcryptjs
```

### **Frontend Setup:**

1. **Install Dependencies:**
```bash
cd apps/web
npm install --save react-plaid-link @stripe/stripe-js @stripe/react-stripe-js react-gantt-chart date-fns react-dropzone @tiptap/react @tiptap/starter-kit
```

2. **Environment Variables:**
```bash
# Add to apps/web/.env.local
NEXT_PUBLIC_PLAID_PUBLIC_KEY=xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxx
```

---

## ✅ **SUCCESS CRITERIA**

### **Finance & Trust Module:**
- ✅ Investor can link bank account via Plaid
- ✅ Investor can fund investment via ACH
- ✅ Sponsor can view real-time capital raised
- ✅ Fund Manager can process distributions
- ✅ All transactions logged in audit trail
- ✅ 1099 forms generated for investors
- ✅ Compliance checks (KYC/OFAC) integrated

### **PM Module:**
- ✅ Sponsor can create construction project
- ✅ Sponsor can add tasks with dependencies
- ✅ Sponsor can log daily progress with photos
- ✅ Critical path auto-calculated
- ✅ Investor can view project progress (read-only)
- ✅ Provider can view task assignments

---

## 🚨 **RISKS & MITIGATION**

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Plaid/Stripe API complexity | High | Use sandbox environments first, test thoroughly |
| Bank account security | Critical | Use encryption for stored data, follow PCI compliance |
| Waterfall calculation conflicts | Medium | Keep RealCo Phase 3 logic, use Kealee only for payments |
| PM feature scope creep | Medium | Stick to core features, exclude RFI/safety modules |
| Data migration issues | High | Test migrations on dev database first |
| Frontend complexity (Gantt charts) | Medium | Use proven library (react-gantt-chart), keep simple |

---

## 📝 **POST-INTEGRATION TASKS**

After both modules are live:

1. **User Testing:**
   - Invite beta testers from each role
   - Run through complete flows
   - Gather feedback

2. **Documentation:**
   - Update user guides
   - Create video tutorials (especially for Plaid linking)
   - Update API documentation

3. **Compliance Review:**
   - Legal review of payment flows
   - SEC compliance check
   - Update Terms of Service

4. **Performance Optimization:**
   - Database query optimization
   - S3 image optimization
   - API response caching

5. **Monitoring:**
   - Set up transaction monitoring
   - Failed payment alerts
   - Compliance alert system

---

## 🎯 **NEXT STEPS**

Ready to begin implementation?

**OPTION A: Start Finance & Trust Module** ⭐ RECOMMENDED
I'll begin building the payment infrastructure first since it's the most critical.

**OPTION B: Start PM Module**
If you prefer to see construction tracking first.

**OPTION C: Review & Adjust Plan**
If you want to modify the scope or timeline.

**To proceed, respond with:**
- **"START FINANCE MODULE"** - I'll begin Week 1-2 backend implementation
- **"START PM MODULE"** - I'll begin PM backend implementation
- **"ADJUST PLAN"** - Tell me what you want to change

---

**Document Status:** ✅ Ready for Implementation  
**Estimated Completion:** 7-8 weeks for both modules  
**Current Phase:** Phase 10 - Kealee Integration Planning
