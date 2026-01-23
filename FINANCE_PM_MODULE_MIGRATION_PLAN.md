# 🏗️ Finance & PM Module Migration Plan

## Overview

Based on `.cursor/Docs/REALCO_KEALEE_IMPLEMENTATION_SUMMARY.md` and `REALCO_FINANCE_ESCROW_INTEGRATION.md`, this document outlines the complete implementation plan for migrating Finance and Project Management modules to the RealCo Next.js portals.

---

## 📊 Current Portal Status

### ✅ **Completed:**
- Marketing website (Home, Sponsors, Investors, Providers)
- Universal login system (any credentials work)
- Role selection flow
- 3 demo dashboards with sample data:
  - Sponsor Portal
  - Investor Portal
  - Provider Portal

### 🚧 **To Be Implemented:**

Based on the documentation, we need to add these modules:

1. **Construction/PM Module** (Kealee Integration)
2. **Finance/Escrow Module** (Kealee Integration)
3. **Transaction Processing** (Stripe/Plaid)
4. **Bank Account Management**
5. **Distribution Calculations**
6. **Compliance Workflows**

---

## 🏗️ Construction/PM Module (Kealee)

### **Backend Status:** ✅ COMPLETE (Per REALCO_KEALEE_IMPLEMENTATION_SUMMARY.md)

**Implemented Features:**
- Project schema with DevelopmentProject, Project, Task, Milestone
- Task management with dependencies and critical path
- Daily logs, RFIs, Submittals, Inspections
- Safety incidents and audit events
- Project service layer with metrics
- Task service with dependency validation

### **Frontend Status:** ⏳ NEEDS IMPLEMENTATION

**Required UI Components for Sponsor Portal:**

1. **Construction Dashboard** (`/dashboard/sponsor/construction`)
   - Project list with phase/status
   - Budget tracking (planned vs actual)
   - Schedule variance visualization
   - Critical path tasks highlight
   - Quick stats: Active projects, budget variance, schedule variance

2. **Project Detail Page** (`/dashboard/sponsor/construction/[projectId]`)
   - Project overview (name, address, type, phase, dates)
   - Budget breakdown with variance
   - Schedule: Gantt chart with critical path
   - Task list with filters (status, priority, assignee)
   - Milestone tracking
   - Progress percentage with visual indicator

3. **Task Management** (`/dashboard/sponsor/construction/[projectId]/tasks`)
   - Task hierarchy tree view
   - Drag-and-drop task reordering
   - Dependency visualization
   - Task creation/edit forms
   - Assignment and status updates
   - Progress tracking

4. **Daily Log Entry** (`/dashboard/sponsor/construction/[projectId]/daily-logs`)
   - Date picker
   - Weather conditions
   - Labor and equipment logs
   - Work completed description
   - Issues and visitor log
   - Photo upload (S3 integration)
   - Safety observations

5. **RFI Management** (`/dashboard/sponsor/construction/[projectId]/rfis`)
   - RFI list with status
   - Create new RFI form
   - RFI detail with response tracking
   - Assignment to responder
   - Status workflow (Open → Pending → Closed)

6. **Submittal Tracking** (`/dashboard/sponsor/construction/[projectId]/submittals`)
   - Submittal register
   - Spec section organization
   - Status tracking (Not Submitted → Under Review → Approved/Rejected)
   - Document upload

7. **Inspection Schedule** (`/dashboard/sponsor/construction/[projectId]/inspections`)
   - Calendar view of inspections
   - Schedule new inspection
   - Inspection results entry
   - Photo documentation
   - Pass/Fail status

8. **Safety Incidents** (`/dashboard/sponsor/construction/[projectId]/safety`)
   - Incident log
   - OSHA reportable flag
   - Corrective action tracking
   - Photo documentation
   - Incident analytics

**Provider Portal Construction Views:**

1. **Active Projects List** (✅ Already in demo)
2. **Project Detail** - View-only access to:
   - Task assignments
   - Daily logs
   - RFIs (respond to assigned)
   - Submittals (submit documents)
   - Inspections (view schedule)

**Investor Portal Construction Views:**

1. **Project Progress Dashboard** (Read-only)
   - Visual progress indicators
   - Milestone completions
   - Photo gallery from daily logs
   - Budget status (high-level)
   - Schedule adherence

---

## 💰 Finance/Escrow Module (Kealee)

### **Backend Status:** ⏳ NEEDS IMPLEMENTATION (Per REALCO_FINANCE_ESCROW_INTEGRATION.md)

**Required Backend Components:**

1. **Bank Account Schema:**
   ```prisma
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
     plaidItemId       String?  // If using Plaid
     plaidAccessToken  String?  @db.Text // Encrypted
     createdAt         DateTime @default(now())
     updatedAt         DateTime @updatedAt
   }
   ```

2. **Transaction Schema:**
   ```prisma
   model Transaction {
     id                String         @id @default(uuid())
     offeringId        String?
     investorId        String?
     sponsorId         String?
     providerId        String?
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
   ```

3. **Escrow Account Schema:**
   ```prisma
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
   ```

4. **Distribution Schema:**
   ```prisma
   model Distribution {
     id               String   @id @default(uuid())
     offeringId       String
     distributionDate DateTime
     totalAmount      Decimal  @db.Decimal(15, 2)
     distributionType DistributionType // PREFERRED_RETURN, PROFIT_SPLIT, etc.
     status           DistributionStatus
     calculations     Json     // Waterfall breakdown
     createdAt        DateTime @default(now())
     updatedAt        DateTime @updatedAt
   }
   ```

**Required Services:**

1. **BankAccountService:**
   - `addBankAccount()` - Manual entry with encryption
   - `linkPlaidAccount()` - Plaid integration
   - `verifyMicroDeposits()` - Traditional verification
   - `verifyInstant()` - Plaid instant verification
   - `getBankAccounts()` - List user accounts
   - `setDefaultAccount()` - Set primary payment method

2. **TransactionService:**
   - `initiateInvestment()` - Investor capital contribution
   - `processDraw()` - Construction draw request
   - `processDistribution()` - Investor distributions
   - `processProviderPayment()` - Contractor/provider payment
   - `getTransactionHistory()` - Filter by user/offering/date
   - `retryFailedTransaction()` - Retry logic
   - `refundTransaction()` - Process refunds

3. **EscrowService:**
   - `createEscrowAccount()` - Per offering
   - `depositFunds()` - Move funds to escrow
   - `releaseFunds()` - Controlled release
   - `calculateWaterfall()` - Distribution calculations
   - `getEscrowBalance()` - Current balance
   - `holdFunds()` - Reserve for specific purpose

4. **StripeService (Enhanced):**
   - ACH payment processing
   - Transfer to connected accounts
   - Webhook handlers
   - Payment verification

5. **PlaidService:**
   - Link token generation
   - Account linking
   - Balance checks
   - Transaction sync

### **Frontend Status:** ⏳ NEEDS IMPLEMENTATION

**Sponsor Portal Finance Features:**

1. **Capital Raise Dashboard** (`/dashboard/sponsor/capital`)
   - Total raised vs target (visual progress)
   - Recent investments list
   - Investor breakdown (commitment amounts)
   - Pending subscriptions
   - Funding velocity chart

2. **Draw Request Management** (`/dashboard/sponsor/draws`)
   - Create draw request form
   - Budget categories
   - Supporting documentation upload
   - Lien waiver requirements
   - Approval workflow status
   - Payment disbursement tracking

3. **Investor Management** (`/dashboard/sponsor/investors`)
   - Investor list with commitment amounts
   - Accreditation status
   - Payment status (paid/pending)
   - Contact information
   - Investment history per investor
   - Send updates/notifications

4. **Distribution Planning** (`/dashboard/sponsor/distributions`)
   - Calculate distribution waterfall
   - Preview distribution amounts per investor
   - Schedule distribution date
   - Payment method selection
   - Tax document generation (K-1 prep)
   - Distribution history

5. **Financial Reports** (`/dashboard/sponsor/reports`)
   - Cash flow statement
   - Budget vs actual
   - Investor statements
   - Fee calculations
   - Tax reporting
   - Export options (PDF, CSV)

**Investor Portal Finance Features:**

1. **Investment Overview** (✅ Already in demo - needs enhancement)
   - Portfolio summary
   - Add: Payment status per investment
   - Add: Pending actions (fund commitment)

2. **Transaction History** (`/dashboard/investor/transactions`)
   - All transactions (investments, distributions, fees)
   - Filter by date, type, offering
   - Export capability
   - Receipt downloads

3. **Distribution Center** (`/dashboard/investor/distributions`)
   - Upcoming distributions calendar
   - Distribution history with amounts
   - Tax document downloads (K-1s, 1099s)
   - YTD earnings summary
   - Reinvestment options

4. **Investment Funding** (`/dashboard/investor/fund`)
   - Bank account management
   - Add/verify bank accounts
   - Initiate ACH transfer
   - Payment status tracking
   - Payment history

5. **Documents & Tax Center** (`/dashboard/investor/documents`)
   - Subscription agreements
   - Operating agreements
   - Quarterly reports
   - K-1 tax forms
   - 1099 forms
   - Consolidated tax summary

**Provider Portal Finance Features:**

1. **Invoice Management** (✅ Already in demo - needs enhancement)
   - Add: Invoice creation form
   - Add: Invoice status workflow
   - Add: Payment tracking
   - Add: Dispute resolution

2. **Payment Dashboard** (`/dashboard/provider/payments`)
   - Pending payments with due dates
   - Payment history
   - Average payment time
   - Outstanding amount
   - Payment method preferences

3. **Billing Center** (`/dashboard/provider/billing`)
   - Create invoice form
   - Project selection
   - Line items with quantities
   - Supporting documentation upload
   - Lien waiver generation
   - Submit for approval

4. **Document Management** (`/dashboard/provider/documents`)
   - Contracts
   - Insurance certificates
   - Lien waivers (conditional/unconditional)
   - W-9 forms
   - Change orders

---

## 🔐 Bank Account Management UI

**Required for All Roles:**

1. **Bank Account Settings** (`/dashboard/[role]/settings/banking`)
   - List of linked bank accounts
   - Add bank account options:
     - Manual entry (routing + account number)
     - Plaid instant link (preferred)
   - Verification status indicators
   - Set default payment method
   - Remove account
   - Security: Show last 4 digits only

2. **Plaid Integration Component:**
   ```tsx
   <PlaidLink
     onSuccess={(publicToken) => exchangeAndSave(publicToken)}
     onExit={() => handleExit()}
   />
   ```

3. **Manual Entry Form:**
   - Bank name
   - Routing number (validation)
   - Account number (encrypted storage)
   - Account type (checking/savings)
   - Account holder name
   - Micro-deposit verification flow

4. **Verification Flow:**
   - Initiate micro-deposits
   - Wait 1-2 business days
   - User enters deposit amounts
   - System verifies
   - Account status → Verified

---

## 📱 Required UI Components Library

### **Charts & Visualizations:**
- **Gantt Chart:** For project schedules (use `react-gantt-chart` or `dhtmlx-gantt`)
- **Progress Bars:** Budget, schedule, funding progress
- **Pie Charts:** Budget breakdown, investor allocation
- **Line Charts:** Funding velocity, project timeline
- **Bar Charts:** Budget vs actual comparisons

### **Forms:**
- **Multi-step Forms:** Investment onboarding, draw requests
- **File Upload:** Documents, photos, lien waivers (S3 integration)
- **Rich Text Editor:** Daily logs, RFI descriptions
- **Date Pickers:** Inspection scheduling, milestone dates
- **Number Inputs:** Currency formatting, percentage inputs

### **Data Tables:**
- **Sortable Tables:** Transaction history, investor lists
- **Filterable Tables:** Task lists, RFI registers
- **Expandable Rows:** Task hierarchy, transaction details
- **Export Functions:** CSV, PDF generation

### **Interactive Elements:**
- **Drag & Drop:** Task reordering, file uploads
- **Modals:** Confirmation dialogs, quick views
- **Toasts:** Success/error notifications
- **Progress Indicators:** File uploads, API calls
- **Tabs:** Multi-view dashboards

### **Calendar Components:**
- **Calendar View:** Inspection scheduling, milestone dates
- **Timeline View:** Project schedule visualization

---

## 🚀 Implementation Priority

### **Phase 1: Essential Finance (Weeks 1-3)**

**Backend:**
1. Bank account schema & encryption setup
2. Transaction schema & service
3. Stripe ACH integration
4. Plaid integration basics

**Frontend:**
1. Bank account management UI (all roles)
2. Investor: Fund investment flow
3. Sponsor: View capital raised
4. Provider: Invoice submission

### **Phase 2: Construction Management (Weeks 4-6)**

**Backend:** ✅ Already complete (per docs)

**Frontend:**
1. Sponsor: Construction dashboard
2. Sponsor: Task management
3. Sponsor: Daily logs
4. Provider: View assigned tasks
5. Investor: Project progress view

### **Phase 3: Advanced Finance (Weeks 7-9)**

**Backend:**
1. Escrow account management
2. Distribution waterfall calculations
3. Draw request workflow
4. Payment processing

**Frontend:**
1. Sponsor: Draw request management
2. Sponsor: Distribution planning
3. Investor: Distribution history
4. Provider: Payment tracking

### **Phase 4: RFIs, Submittals, Safety (Weeks 10-12)**

**Backend:** ✅ Already complete (per docs)

**Frontend:**
1. Sponsor: RFI management
2. Sponsor: Submittal tracking
3. Sponsor: Inspection scheduling
4. Sponsor: Safety incident reporting
5. Provider: RFI responses
6. Provider: Submittal uploads

### **Phase 5: Reporting & Analytics (Weeks 13-14)**

**Frontend:**
1. Financial reports (all roles)
2. Project analytics (sponsor)
3. Tax document center (investor)
4. Export functionality
5. Dashboard enhancements

---

## 📋 Required Dependencies

### **NPM Packages to Install:**

```bash
# Charts & Visualization
npm install recharts
npm install react-gantt-chart
npm install date-fns

# Forms & File Upload
npm install react-hook-form
npm install zod
npm install react-dropzone

# Rich Text
npm install @tiptap/react @tiptap/starter-kit

# Data Tables
npm install @tanstack/react-table

# Date/Time
npm install react-datepicker

# Plaid
npm install react-plaid-link

# Stripe
npm install @stripe/stripe-js @stripe/react-stripe-js

# PDF Generation
npm install jspdf jspdf-autotable

# CSV Export
npm install papaparse

# Currency Formatting
npm install accounting-js
```

---

## 🔌 API Integration Points

### **Backend Endpoints Needed:**

**Finance:**
- `POST /api/v1/bank-accounts` - Add bank account
- `GET /api/v1/bank-accounts` - List accounts
- `POST /api/v1/bank-accounts/verify` - Verify micro-deposits
- `POST /api/v1/plaid/link-token` - Get Plaid link token
- `POST /api/v1/plaid/exchange-token` - Exchange public token
- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions` - List transactions
- `POST /api/v1/transactions/:id/retry` - Retry failed
- `POST /api/v1/draws` - Create draw request
- `GET /api/v1/draws` - List draw requests
- `POST /api/v1/distributions` - Calculate distribution
- `GET /api/v1/escrow/:offeringId` - Get escrow balance

**Construction:** ✅ Already implemented (see docs)
- `GET /api/v1/projects` - List projects
- `GET /api/v1/projects/:id` - Get project details
- `POST /api/v1/projects/:id/tasks` - Create task
- `GET /api/v1/projects/:id/tasks` - List tasks
- `POST /api/v1/projects/:id/daily-logs` - Create daily log
- `GET /api/v1/projects/:id/rfis` - List RFIs
- `POST /api/v1/projects/:id/rfis` - Create RFI
- And more... (per KEALEE_IMPLEMENTATION_SUMMARY.md)

---

## 🎨 Design System Consistency

**All new pages must follow:**
- ✅ Rustic orange borders (4px, #E07A47)
- ✅ Sky blue accents (#56CCF2)
- ✅ Smoke grey dark mode (#6b7280)
- ✅ Card-based layouts
- ✅ Responsive design (mobile-first)
- ✅ Consistent button styles
- ✅ Form validation with error states
- ✅ Loading states for async operations
- ✅ Success/error toast notifications

---

## ✅ Testing Checklist

### **Finance Module:**
- [ ] Add bank account (manual)
- [ ] Add bank account (Plaid)
- [ ] Verify bank account
- [ ] Initiate investment payment
- [ ] Process draw request
- [ ] Calculate distribution
- [ ] Process distribution payment
- [ ] View transaction history
- [ ] Handle failed transactions
- [ ] Generate tax documents

### **Construction Module:**
- [ ] Create project
- [ ] Create tasks with dependencies
- [ ] Calculate critical path
- [ ] Add daily log
- [ ] Upload photos
- [ ] Create RFI
- [ ] Respond to RFI
- [ ] Submit submittal
- [ ] Schedule inspection
- [ ] Record safety incident
- [ ] View project metrics
- [ ] Archive project

---

## 📝 Summary

**Current Status:**
- ✅ Marketing site complete
- ✅ Login/signup flows complete (compact forms)
- ✅ Demo dashboards for 3 roles
- ✅ Construction backend complete (per docs)
- ⏳ Construction frontend needed
- ⏳ Finance backend needed
- ⏳ Finance frontend needed

**Next Steps:**
1. Review this plan with stakeholders
2. Install required dependencies
3. Begin Phase 1 implementation (Essential Finance)
4. Implement Phase 2 (Construction UI)
5. Continue through remaining phases

**Estimated Timeline:** 14 weeks for complete implementation

**Team Needed:**
- 2 Backend developers (Finance & API integration)
- 2 Frontend developers (React/Next.js)
- 1 Designer (UI/UX for new modules)
- 1 QA Engineer (Testing & validation)

---

## 📞 Questions for Stakeholders

1. **Priority:** Should we start with Finance or Construction module?
2. **Plaid:** Do we have Plaid API credentials?
3. **Stripe:** Do we have Stripe account set up?
4. **S3:** Is AWS S3 bucket configured for file uploads?
5. **Design:** Do we have designs for the new modules?
6. **Timeline:** Is 14-week timeline acceptable or should we adjust scope?

---

**This plan aligns with documentation in:**
- `.cursor/Docs/REALCO_KEALEE_IMPLEMENTATION_SUMMARY.md`
- `.cursor/Docs/REALCO_FINANCE_ESCROW_INTEGRATION.md`

All modules will maintain the same design consistency as current portals.
