# RealCo-Kealee Integration - Specific Feature Prompts
## Ready-to-Use Cursor Prompts for Sonnet 4.5

---

## 🏗️ CONSTRUCTION PROJECT MANAGEMENT INTEGRATION

### 1. Project Schema Migration
```
Task: Create Prisma schema for construction project management (m-os-pm module) integration.

CONTEXT:
Integrating Kealee Platform V10's construction project management into RealCo. Need complete schema for projects, tasks, milestones, daily logs, RFIs, submittals, inspections, and safety incidents.

REQUIREMENTS:
1. Create all construction-related models with proper relations to existing RealCo DevelopmentProject model
2. Include enums: ProjectPhase, TaskStatus, TaskPriority, WeatherCondition, RFIStatus, SubmittalStatus, InspectionStatus
3. Add proper indexes for query optimization (projectId, status, assignedToId)
4. Use snake_case for database columns, camelCase for Prisma models
5. Include audit timestamps (createdAt, updatedAt)
6. Add support for task dependencies and critical path calculation
7. Include progress tracking (percentComplete, scheduleVariance, costVariance)
8. Support for file attachments via S3 URLs
9. Implement soft delete pattern where appropriate

SCHEMA MODELS NEEDED:
- Project (links to DevelopmentProject)
- Task (with parent-child hierarchy)
- Milestone
- DailyLog (weather, labor, equipment, progress notes)
- RFI (Request for Information)
- Submittal (material/equipment approvals)
- Inspection (quality control)
- SafetyIncident (OSHA compliance)

EXAMPLE RELATIONS:
- DevelopmentProject (1) → (1) Project
- Project (1) → (many) Tasks
- Task (1) → (many) Tasks (parent-child)
- Project (1) → (many) DailyLogs
- Task (many) → (1) User (assignedTo)

Generate the complete Prisma schema with all models, enums, relations, and indexes.
```

### 2. Project Service Layer
```
Task: Implement ProjectService class for construction project management with full CRUD operations.

CONTEXT:
Building the service layer for managing construction projects in RealCo. Must integrate with existing compliance checks and audit logging.

REQUIREMENTS:
1. Create TypeScript service class with these methods:
   - createProject(developmentProjectId, data): Initialize project from funded offering
   - getProject(id): Get project with all relations
   - updateProgress(id, progress): Update overall progress %
   - calculateScheduleVariance(id): Compare actual vs planned
   - getCriticalPath(id): Calculate critical path from task dependencies
   - getProjectMetrics(id): Dashboard metrics (budget, schedule, progress)
   - archiveProject(id): Soft delete

2. Business logic:
   - Auto-generate unique project code (RC-YYYY-NNN format)
   - Calculate schedule variance in days (ahead/behind)
   - Cascade progress updates from tasks to project
   - Validate plannedEndDate > plannedStartDate
   - Ensure developmentProjectId exists and is funded

3. Integration requirements:
   - Call runComplianceChecks() before state changes
   - Create audit log entries for all changes
   - Use Prisma transactions for multi-table updates
   - Emit events for investor notifications

4. Error handling:
   - Throw ProjectNotFoundError if project doesn't exist
   - Throw ValidationError for invalid data
   - Throw UnauthorizedError for permission issues
   - Log all errors with context

EXAMPLE STRUCTURE:
```typescript
export class ProjectService {
  constructor(private prisma: PrismaClient) {}
  
  async createProject(
    developmentProjectId: number,
    data: CreateProjectDTO
  ): Promise<Project> {
    // Implementation
  }
  
  async calculateScheduleVariance(id: number): Promise<number> {
    // Calculate days ahead/behind schedule
  }
}
```

Generate complete ProjectService implementation with all methods, error handling, and TypeScript types.
```

### 3. Task Management with Dependencies
```
Task: Implement task management system with dependency tracking and critical path calculation.

CONTEXT:
Creating task scheduling system for construction projects with support for predecessor relationships and automatic critical path identification.

REQUIREMENTS:
1. TaskService methods:
   - createTask(projectId, data): Create task with validation
   - updateTask(id, updates): Update with dependency checks
   - getTasks(projectId, filters): Get filtered tasks
   - calculateCriticalPath(projectId): Find critical path tasks
   - updateTaskProgress(id, percent): Update with cascade to project
   - validateDependencies(task): Ensure no circular dependencies
   - getTaskHierarchy(projectId): Return nested task structure

2. Dependency logic:
   - Store predecessorTaskIds as integer array
   - Support finish-to-start relationships with lag days
   - Detect circular dependencies before save
   - Auto-calculate task start dates based on predecessors
   - Mark critical path tasks (isCriticalPath = true)

3. Critical path algorithm:
   - Forward pass: Calculate earliest start/finish
   - Backward pass: Calculate latest start/finish
   - Float calculation: Latest - earliest
   - Critical path: Tasks with zero float

4. Progress rollup:
   - Parent task progress = average of children
   - Project progress = weighted average of all tasks
   - Update milestones when related tasks complete

DELIVERABLES:
- TaskService class with all methods
- Dependency validation function
- Critical path calculation algorithm
- Task hierarchy builder
- TypeScript interfaces for DTOs
- Unit tests for dependency logic

Generate complete task management implementation with critical path support.
```

### 4. Daily Log & Progress Tracking
```
Task: Create daily log system for construction progress tracking with photo documentation.

CONTEXT:
Building daily log functionality to track weather, labor, equipment, work completed, and progress photos for investor transparency.

REQUIREMENTS:
1. DailyLogService methods:
   - createDailyLog(projectId, data): Create log entry
   - uploadProgressPhotos(logId, files): Upload to S3
   - getDailyLogs(projectId, dateRange): Get logs with filters
   - getProgressPhotos(projectId): Get all photos chronologically
   - updateWorkCompleted(logId, workItems): Track completed work

2. Daily log data capture:
   - Weather condition (enum)
   - Temperature (Fahrenheit)
   - Labor count by trade
   - Equipment usage
   - Materials delivered
   - Work completed (task IDs + descriptions)
   - Issues/delays
   - Visitor log
   - Safety observations

3. Photo management:
   - Upload to S3: s3://realco-construction/projects/{projectId}/logs/{logId}/
   - Generate thumbnails (200x200, 800x600)
   - Store URLs in database
   - Tag photos with GPS coordinates if available
   - Support multiple photos per log entry

4. Investor notification:
   - Email weekly digest with:
     - Progress summary
     - Latest photos (3-5)
     - Upcoming milestones
     - Budget status
   - Generate notification when daily log created

EXAMPLE SCHEMA:
```typescript
interface CreateDailyLogDTO {
  projectId: number;
  logDate: Date;
  weather: WeatherCondition;
  temperature: number;
  laborCount: { trade: string; count: number }[];
  equipmentUsed: string[];
  workCompleted: string;
  issuesDelays: string | null;
  photos?: File[];
}
```

Generate DailyLogService with S3 integration and investor notification logic.
```

### 5. Construction Dashboard UI
```
Task: Build responsive construction project dashboard for contractors and investors.

CONTEXT:
Creating two views: (1) Contractor dashboard with full project management, (2) Investor dashboard with progress visibility.

REQUIREMENTS:

CONTRACTOR DASHBOARD:
1. Header:
   - Project name, code, phase badge
   - Overall progress bar (0-100%)
   - Schedule status (on time, ahead, behind)
   - Budget status (under, on, over)

2. Quick stats grid:
   - Days elapsed / total duration
   - Budget spent / total budget
   - Active tasks count
   - Upcoming milestones

3. Gantt chart:
   - Task timeline visualization
   - Critical path highlighted
   - Dependency lines
   - Today marker
   - Drag to adjust dates

4. Task list:
   - Filter by: phase, status, assigned to
   - Sort by: priority, due date, % complete
   - Bulk actions: update status, assign
   - Progress slider per task

5. Daily logs section:
   - Create new log button
   - Recent logs list
   - Photo grid
   - Quick filters by date range

INVESTOR DASHBOARD:
1. Simplified header:
   - Project name, location
   - Completion percentage (big number)
   - Estimated completion date
   - Investment amount shown

2. Progress timeline:
   - Major milestones only
   - Visual progress bar
   - Photo documentation
   - Status updates

3. Financial summary:
   - Budget allocated
   - Funds disbursed
   - Remaining budget
   - Next draw request

4. Photo gallery:
   - Chronological grid
   - Lightbox view
   - Filter by date/phase
   - Before/after comparison

COMPONENTS TO BUILD:
- ProjectHeader (shared)
- ContractorDashboard
- InvestorDashboard
- GanttChart (use recharts or custom)
- TaskList with filters
- DailyLogList
- PhotoGallery
- ProgressTimeline
- BudgetSummary

TECHNICAL:
- React Query for data fetching
- Optimistic updates for task progress
- WebSocket for real-time updates
- Responsive grid layouts
- Mobile-friendly controls
- Export to PDF functionality

Generate complete dashboard implementation with all components.
```

---

## 💰 FINANCE ESCROW INTEGRATION

### 6. Bank Account Management
```
Task: Implement secure bank account storage with Plaid verification and encryption.

CONTEXT:
Building bank account management for investor payments with Plaid instant verification or micro-deposit verification.

REQUIREMENTS:
1. BankAccountService methods:
   - addBankAccount(userId, data): Add with verification
   - verifyWithPlaid(userId, publicToken): Instant verification
   - initiateMicroDeposits(accountId): Send verification amounts
   - verifyMicroDeposits(accountId, amounts): Confirm amounts
   - getBankAccounts(userId): List user accounts
   - setDefaultAccount(accountId): Set default for payments
   - removeBankAccount(accountId): Soft delete

2. Security requirements:
   - Encrypt account numbers with AES-256
   - Store only last 4 digits in plaintext
   - Encrypt Plaid access tokens
   - Hash routing numbers
   - Never log sensitive data
   - Audit all account access

3. Plaid integration:
   - Exchange public token for access token
   - Get account and routing numbers
   - Verify account ownership
   - Get real-time balance
   - Check account status

4. Micro-deposit flow:
   - Generate two random amounts ($0.01-$0.99)
   - Initiate ACH deposits via Stripe
   - Store amounts encrypted
   - Allow 3 verification attempts
   - Lock account after failed attempts
   - Expire after 7 days if not verified

5. Validation:
   - Valid routing number (ABA format)
   - Account number length (4-17 digits)
   - Account holder name matches user
   - Account type (checking/savings)
   - Duplicate detection

EXAMPLE ENCRYPTION:
```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encryptBankAccount(accountNumber: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(accountNumber, 'utf8'),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('hex');
}
```

Generate BankAccountService with Plaid integration and encryption utilities.
```

### 7. Transaction Processing Engine
```
Task: Build transaction processing system with state machine and retry logic.

CONTEXT:
Creating robust payment processing for investor deposits, capital distributions, and construction draws with full audit trail.

REQUIREMENTS:
1. TransactionService methods:
   - initiateTransaction(type, data): Create transaction
   - processACHPayment(transactionId): Execute via Stripe
   - processWireTransfer(transactionId): Generate instructions
   - processCheck(transactionId): Track manual processing
   - getTransaction(id): Get with full history
   - getTransactions(filters): List with pagination
   - cancelTransaction(id): Cancel if not processed
   - retryFailedTransaction(id): Retry with backoff

2. Transaction state machine:
   ```
   INITIATED → PENDING_APPROVAL → APPROVED → QUEUED → PROCESSING
   → PENDING_SETTLEMENT → SETTLED → COMPLETED
   
   OR → FAILED (can retry if retryCount < maxRetries)
   OR → CANCELLED (only if not processing)
   OR → REVERSED (refund scenario)
   ```

3. Payment processing:
   - ACH: Use Stripe ACH debit/credit
   - Wire: Generate instruction PDF, mark complete when received
   - Check: Track deposit, manual completion
   - Fee calculation: Platform fee + Stripe/Plaid fees
   - Multi-party splits: Sponsor, platform, referrals

4. Retry logic:
   - Max 3 retries for transient failures
   - Exponential backoff: 30min, 2hr, 8hr
   - Retry on: network errors, temporary declines, rate limits
   - Don't retry: invalid account, insufficient funds, fraud

5. Idempotency:
   - Use idempotency key for Stripe calls
   - Prevent duplicate processing
   - Handle webhook duplicates

6. Compliance checks before processing:
   - OFAC screening (checkOFAC service)
   - Investment limit validation
   - Accredited investor verification
   - Transaction reporting threshold ($10k)
   - Velocity limits (daily/monthly max)

7. Audit trail:
   - Log every state change
   - Store webhook events
   - Link to escrow ledger entries
   - Create compliance records
   - Immutable transaction history

EXAMPLE STRUCTURE:
```typescript
export class TransactionService {
  async initiateTransaction(
    type: TransactionType,
    data: InitiateTransactionDTO
  ): Promise<Transaction> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Run compliance checks
      const compliance = await runComplianceChecks(data);
      if (!compliance.approved) throw new ComplianceError();
      
      // 2. Create transaction record
      const transaction = await tx.transaction.create({ ... });
      
      // 3. Create audit log
      await tx.auditEvent.create({ ... });
      
      // 4. Queue for processing
      await this.queue.add('process-payment', {
        transactionId: transaction.id
      });
      
      return transaction;
    });
  }
}
```

Generate complete TransactionService with state machine and retry logic.
```

### 8. Escrow Account & Distribution Engine
```
Task: Implement escrow account management with waterfall distribution calculations.

CONTEXT:
Managing segregated escrow accounts per real estate offering with automated distribution calculations following investor preferences and waterfalls.

REQUIREMENTS:
1. EscrowAccountService methods:
   - createEscrowAccount(offeringId): Create segregated account
   - depositFunds(accountId, transactionId): Credit from investment
   - calculateDistribution(accountId, amount): Waterfall calculation
   - executeDistribution(accountId, amount): Disburse to investors
   - getAccountBalance(accountId): Current + available balance
   - getAccountActivity(accountId): Ledger entries
   - reconcileAccount(accountId): Match with bank statement

2. Escrow account structure:
   - Separate account per offering (1:1 relationship)
   - Track: currentBalance, availableBalance, pendingBalance, heldBalance
   - availableBalance = currentBalance - pendingBalance - heldBalance
   - Link to bank account for ACH
   - Support multiple funding sources

3. Distribution waterfall logic:
   ```
   1. Return of capital: Pay back investor principal first
   2. Preferred return: Pay cumulative preferred return (e.g., 8% annually)
   3. Catch-up: Sponsor catches up to same return as investors
   4. Profit split: Remaining profits split (e.g., 70/30 investor/sponsor)
   ```

4. Distribution calculation:
   - Get all investments for offering
   - Calculate each investor's:
     - Original investment amount
     - Capital returned to date
     - Preferred return owed (8% annual cumulative)
     - Preferred return paid to date
     - Remaining capital balance
   - Apply waterfall tiers:
     - Tier 1: Return remaining capital
     - Tier 2: Pay preferred return arrears
     - Tier 3: Sponsor catch-up
     - Tier 4: Profit split (70/30)

5. Distribution execution:
   - Create distribution record
   - Generate payment transactions for each investor
   - Update escrow ledger (debit)
   - Update investment balances
   - Queue payment processing
   - Send distribution notices

6. Ledger tracking:
   - Every escrow transaction creates ledger entry
   - Track: debit/credit, amount, balance before/after
   - Link to source transaction
   - Immutable audit trail
   - Daily balance reconciliation

EXAMPLE DISTRIBUTION CALCULATION:
```typescript
interface DistributionTier {
  tier: number;
  description: string;
  totalAmount: number;
  allocations: {
    investmentId: number;
    investorId: number;
    amount: number;
    type: 'RETURN_OF_CAPITAL' | 'PREFERRED_RETURN' | 'PROFIT_SPLIT';
  }[];
}

async function calculateWaterfallDistribution(
  offeringId: number,
  distributionAmount: number
): Promise<DistributionTier[]> {
  // Get all investments
  const investments = await getInvestments(offeringId);
  
  let remaining = distributionAmount;
  const tiers: DistributionTier[] = [];
  
  // Tier 1: Return of Capital
  const tier1 = calculateReturnOfCapital(investments, remaining);
  tiers.push(tier1);
  remaining -= tier1.totalAmount;
  
  // Tier 2: Preferred Return
  if (remaining > 0) {
    const tier2 = calculatePreferredReturn(investments, remaining);
    tiers.push(tier2);
    remaining -= tier2.totalAmount;
  }
  
  // Tier 3: Sponsor Catch-up
  if (remaining > 0) {
    const tier3 = calculateSponsorCatchup(investments, remaining);
    tiers.push(tier3);
    remaining -= tier3.totalAmount;
  }
  
  // Tier 4: Profit Split
  if (remaining > 0) {
    const tier4 = calculateProfitSplit(investments, remaining, 0.70);
    tiers.push(tier4);
  }
  
  return tiers;
}
```

Generate EscrowAccountService with waterfall distribution engine.
```

### 9. Stripe & Plaid Webhook Handlers
```
Task: Implement secure webhook handlers for Stripe and Plaid with signature verification and idempotent processing.

CONTEXT:
Processing payment status updates from Stripe and bank events from Plaid asynchronously via webhooks.

REQUIREMENTS:
1. Stripe webhook endpoint:
   - POST /api/v1/webhooks/stripe
   - Verify signature using stripe.webhooks.constructEvent
   - Log all events to webhook_events table
   - Check for duplicate processing (by event ID)
   - Process asynchronously via queue
   - Return 200 immediately
   - Handle these events:
     * payment_intent.succeeded
     * payment_intent.payment_failed
     * charge.succeeded
     * charge.failed
     * transfer.paid
     * payout.paid

2. Plaid webhook endpoint:
   - POST /api/v1/webhooks/plaid
   - Verify webhook signature
   - Handle these events:
     * ITEM_LOGIN_REQUIRED
     * ERROR
     * TRANSACTIONS_REMOVED
     * DEFAULT_UPDATE

3. Event processing logic:
   - payment_intent.succeeded:
     * Update transaction status to SETTLED
     * Update investment status to FUNDED
     * Credit escrow account balance
     * Create ledger entry
     * Send investor confirmation
   
   - payment_intent.payment_failed:
     * Update transaction status to FAILED
     * Store failure reason and code
     * Schedule retry if under max attempts
     * Send investor notification
   
   - ITEM_LOGIN_REQUIRED (Plaid):
     * Mark bank account needs re-verification
     * Send user notification to re-link
     * Pause scheduled payments

4. Idempotency:
   - Check webhookEvent table for event.id
   - If exists, return success without processing
   - Use database unique constraint on event ID
   - Handle race conditions

5. Error handling:
   - Catch all errors in webhook processing
   - Log errors but always return 200
   - Retry failed processing via queue
   - Alert on repeated failures

6. Security:
   - Verify signatures (reject if invalid)
   - Rate limit webhook endpoint
   - IP whitelist (Stripe/Plaid IPs)
   - Log suspicious requests

EXAMPLE IMPLEMENTATION:
```typescript
import Stripe from 'stripe';
import { FastifyInstance } from 'fastify';

export async function webhookRoutes(server: FastifyInstance) {
  server.post('/api/v1/webhooks/stripe', async (request, reply) => {
    const sig = request.headers['stripe-signature'] as string;
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(
        request.body as any,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      logger.error('Stripe webhook signature verification failed', err);
      return reply.code(400).send({ error: 'Invalid signature' });
    }
    
    // Check for duplicate
    const exists = await prisma.webhookEvent.findUnique({
      where: { eventId: event.id }
    });
    
    if (exists) {
      logger.info('Duplicate webhook event', { eventId: event.id });
      return reply.send({ received: true });
    }
    
    // Log event
    await prisma.webhookEvent.create({
      data: {
        eventId: event.id,
        eventType: event.type,
        provider: 'STRIPE',
        payload: event as any,
        status: 'PENDING'
      }
    });
    
    // Queue for processing
    await paymentQueue.add('process-stripe-webhook', {
      eventId: event.id
    });
    
    return reply.send({ received: true });
  });
}

// Worker process
async function processStripeWebhook(eventId: string) {
  const webhookEvent = await prisma.webhookEvent.findUnique({
    where: { eventId }
  });
  
  if (!webhookEvent) return;
  
  const event = webhookEvent.payload as Stripe.Event;
  
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      // ... more cases
    }
    
    await prisma.webhookEvent.update({
      where: { eventId },
      data: { 
        status: 'PROCESSED',
        processedAt: new Date()
      }
    });
  } catch (error) {
    logger.error('Webhook processing failed', { eventId, error });
    
    await prisma.webhookEvent.update({
      where: { eventId },
      data: { 
        status: 'FAILED',
        errorMessage: error.message
      }
    });
    
    // Retry logic
    throw error; // Will be retried by queue
  }
}
```

Generate complete webhook handler implementation with all event types.
```

### 10. Payment Dashboard UI
```
Task: Build payment management dashboard for admins and transaction history for investors.

CONTEXT:
Creating interfaces for monitoring payment status, processing approvals, and viewing transaction history.

REQUIREMENTS:

ADMIN PAYMENT DASHBOARD:
1. Overview stats:
   - Total processed today/week/month
   - Pending approvals count
   - Failed transactions count (needs attention)
   - Total in escrow

2. Transaction list:
   - Paginated table with filters:
     * Status (all, pending, settled, failed)
     * Type (investment, distribution, draw)
     * Date range
     * Amount range
   - Columns:
     * Transaction ID
     * Date/time
     * Type (badge)
     * From/To users
     * Amount
     * Status (color-coded badge)
     * Actions (view details, retry, cancel)
   - Bulk actions:
     * Approve selected
     * Cancel selected
     * Export to CSV

3. Transaction details modal:
   - Full transaction info
   - Related investment/distribution
   - Timeline of status changes
   - Webhook events received
   - Retry history
   - Stripe/Plaid links
   - Approve/reject buttons for pending
   - Manual refund option

4. Failed transactions queue:
   - List of failed transactions
   - Failure reason displayed
   - Retry button (manual override)
   - Mark as resolved
   - Alert configuration

5. Escrow account summary:
   - List all escrow accounts
   - Current balance per account
   - Recent activity
   - Reconciliation status
   - Drill into ledger

INVESTOR TRANSACTION HISTORY:
1. Personal transaction list:
   - All transactions for this investor
   - Filters: type, status, date range
   - Columns:
     * Date
     * Type (deposit, distribution, etc.)
     * Property name
     * Amount (color: green for credits, red for debits)
     * Status
   - Download statement (PDF)

2. Transaction details:
   - Amount breakdown (principal, interest, fees)
   - Payment method used
   - Confirmation number
   - Receipt (PDF download)
   - Tax information if applicable

3. Payment methods:
   - List linked bank accounts
   - Add new account (Plaid or manual)
   - Set default account
   - Remove account
   - Verification status indicators

COMPONENTS TO BUILD:
- TransactionTable (reusable)
- TransactionFilters
- TransactionDetailModal
- EscrowAccountCard
- PaymentMethodList
- AddBankAccountModal
- TransactionTimeline
- StatusBadge
- AmountDisplay (formatted currency)

TECHNICAL:
- React Query for data fetching
- Server-side pagination
- Real-time updates via polling or WebSocket
- CSV export functionality
- PDF generation for receipts/statements
- Responsive table (card view on mobile)

Generate complete payment dashboard implementation.
```

---

## 🔄 DEAL-TO-CONSTRUCTION HANDOFF

### 11. Automated Construction Project Initialization
```
Task: Implement automated project creation when real estate deal closes and funding completes.

CONTEXT:
When an offering reaches full funding, automatically initialize construction project with budget, schedule, and team assignments.

REQUIREMENTS:
1. Event-driven trigger:
   - Listen for offering status change to 'FUNDED'
   - Validate minimum funding threshold met
   - Check all compliance requirements satisfied
   - Verify construction documents uploaded

2. Project initialization:
   - Create Project record linked to DevelopmentProject
   - Copy budget from offering (hard costs, soft costs)
   - Set planned dates from offering timeline
   - Generate unique project code (RC-2025-001)
   - Set initial phase to PRE_CONSTRUCTION
   - Create escrow account for construction funds

3. Task template application:
   - Load task template based on project type:
     * New construction
     * Renovation
     * Multi-family
     * Commercial
   - Create all template tasks with:
     * Proper phase assignments
     * Realistic duration estimates
     * Dependency chains (foundation → framing → MEP)
     * Budget allocation per task
   - Calculate initial schedule (forward pass)
   - Identify critical path

4. Team assignments:
   - Assign sponsor as project owner
   - Add general contractor (if selected)
   - Add architect (if engaged)
   - Create contractor portal access
   - Send welcome email with login credentials

5. Milestones creation:
   - Generate standard milestones:
     * Building permit approval
     * Foundation complete
     * Framing complete
     * MEP rough-in complete
     * Certificate of Occupancy
   - Link to task completion triggers
   - Set investor notification rules

6. Document migration:
   - Copy offering documents to project:
     * Site plans
     * Architectural drawings
     * Pro forma
     * Purchase agreement
   - Create document folders:
     * Plans & Specifications
     * Permits
     * RFIs
     * Submittals
     * Closeout Documents

7. Investor communication:
   - Send "Project Initiated" email
   - Include:
     * Project overview
     * Key dates and milestones
     * Budget summary
     * Link to investor construction dashboard
     * Contact information

8. Compliance records:
   - Create audit log entry
   - Record handoff date/time
   - Link to offering closure documents
   - Initialize compliance checklist

EXAMPLE WORKFLOW:
```typescript
// Event handler
eventBus.on('offering.funded', async (offeringId: number) => {
  await initiateConstructionProject(offeringId);
});

async function initiateConstructionProject(offeringId: number) {
  return await prisma.$transaction(async (tx) => {
    // 1. Get offering data
    const offering = await tx.offering.findUnique({
      where: { id: offeringId },
      include: { developmentProject: true }
    });
    
    // 2. Create project
    const project = await tx.project.create({
      data: {
        developmentProjectId: offering.developmentProjectId,
        projectCode: await generateProjectCode(),
        projectPhase: 'PRE_CONSTRUCTION',
        plannedStartDate: offering.developmentProject.constructionStartDate,
        plannedEndDate: offering.developmentProject.constructionEndDate,
        // ... more fields
      }
    });
    
    // 3. Apply task template
    const tasks = await applyTaskTemplate(
      tx,
      project.id,
      offering.developmentProject.projectType
    );
    
    // 4. Create milestones
    await createStandardMilestones(tx, project.id);
    
    // 5. Create escrow account
    const escrowAccount = await tx.escrowAccount.create({
      data: {
        offeringId,
        accountType: 'CONSTRUCTION_FUND',
        currentBalance: offering.totalRaised
      }
    });
    
    // 6. Assign team
    await assignProjectTeam(tx, project.id, offering);
    
    // 7. Send notifications
    await notifyInvestors(offering.id, project.id);
    
    // 8. Create audit log
    await tx.auditEvent.create({
      data: {
        action: 'PROJECT_INITIATED',
        entityType: 'Project',
        entityId: project.id,
        metadata: { offeringId, fundingAmount: offering.totalRaised }
      }
    });
    
    return project;
  });
}
```

Generate complete project initialization system with task templates.
```

---

## 🎯 DEPLOYMENT & CONFIGURATION

### 12. Railway Backend Deployment Setup
```
Task: Configure Railway deployment for RealCo backend with PostgreSQL, Redis, and environment variables.

CONTEXT:
Setting up production backend deployment on Railway with proper database connections, secrets management, and health checks.

REQUIREMENTS:
1. Railway services configuration:
   - Backend service (Node.js)
   - PostgreSQL 15 database
   - Redis instance
   - Stripe CLI for webhook testing (dev only)

2. Environment variables:
   ```env
   # Database
   DATABASE_URL=postgresql://user:pass@host:5432/realco_prod
   DATABASE_POOL_MIN=2
   DATABASE_POOL_MAX=10
   
   # Redis
   REDIS_URL=redis://host:6379
   
   # Auth
   JWT_SECRET=<generate-secure-random>
   JWT_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   
   # Stripe
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_CONNECT_CLIENT_ID=ca_...
   
   # Plaid
   PLAID_CLIENT_ID=...
   PLAID_SECRET=...
   PLAID_ENV=production
   
   # AWS S3
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_S3_BUCKET_DOCS=realco-prod-docs
   AWS_S3_BUCKET_CONSTRUCTION=realco-prod-construction
   AWS_REGION=us-east-1
   
   # Application
   NODE_ENV=production
   PORT=8080
   LOG_LEVEL=info
   CORS_ORIGIN=https://app.realco.com
   
   # Feature Flags
   ENABLE_CONSTRUCTION_MODULE=true
   ENABLE_DISTRIBUTIONS=true
   
   # Monitoring
   SENTRY_DSN=https://...@sentry.io/...
   ```

3. Deployment configuration (railway.json):
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "npm run build"
     },
     "deploy": {
       "startCommand": "npm run start:prod",
       "healthcheckPath": "/health",
       "healthcheckTimeout": 30,
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 5
     }
   }
   ```

4. Database migration strategy:
   ```bash
   # Migration script
   #!/bin/bash
   set -e
   
   echo "Starting database migration..."
   
   # Backup current database
   railway run pg_dump realco_prod > backup_$(date +%Y%m%d_%H%M%S).sql
   
   # Run Prisma migrations
   railway run npx prisma migrate deploy
   
   # Verify migration
   railway run npx prisma migrate status
   
   echo "Migration completed successfully"
   ```

5. Health check endpoint:
   ```typescript
   app.get('/health', async (req, res) => {
     const health = {
       uptime: process.uptime(),
       timestamp: Date.now(),
       checks: {
         database: await checkDatabase(),
         redis: await checkRedis(),
         stripe: await checkStripe(),
         s3: await checkS3()
       }
     };
     
     const healthy = Object.values(health.checks).every(c => c === true);
     res.status(healthy ? 200 : 503).json(health);
   });
   
   async function checkDatabase(): Promise<boolean> {
     try {
       await prisma.$queryRaw`SELECT 1`;
       return true;
     } catch {
       return false;
     }
   }
   ```

6. Logging configuration:
   ```typescript
   import pino from 'pino';
   
   export const logger = pino({
     level: process.env.LOG_LEVEL || 'info',
     transport: process.env.NODE_ENV === 'development'
       ? { target: 'pino-pretty', options: { colorize: true } }
       : undefined,
     redact: {
       paths: [
         'req.headers.authorization',
         '*.password',
         '*.token',
         '*.secret',
         '*.accountNumber'
       ],
       remove: true
     }
   });
   ```

7. CI/CD with GitHub Actions:
   ```yaml
   name: Deploy Backend
   
   on:
     push:
       branches: [main]
   
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '20'
         - run: npm ci
         - run: npm run type-check
         - run: npm run test
   
     deploy:
       needs: test
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - run: npm install -g @railway/cli
         - run: railway up
           env:
             RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
   ```

DELIVERABLES:
- Complete .env template
- railway.json configuration
- Health check implementation
- Migration deployment script
- GitHub Actions workflow
- Database backup automation
- Monitoring setup (Sentry)
- Deployment documentation

Generate production Railway configuration with all necessary setup.
```

### 13. Vercel Frontend Deployment
```
Task: Configure Vercel deployment for RealCo React frontend with environment variables and build optimization.

CONTEXT:
Setting up production frontend deployment on Vercel with proper API connections, static asset optimization, and preview deployments.

REQUIREMENTS:
1. Vercel configuration (vercel.json):
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       { "source": "/api/:path*", "destination": "https://api.realco.com/api/:path*" }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           { "key": "X-Frame-Options", "value": "DENY" },
           { "key": "X-Content-Type-Options", "value": "nosniff" },
           { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
         ]
       }
     ]
   }
   ```

2. Environment variables:
   ```env
   # API
   VITE_API_URL=https://api.realco.com
   VITE_API_TIMEOUT=30000
   
   # Auth
   VITE_JWT_STORAGE_KEY=realco_token
   
   # Stripe
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   
   # Plaid
   VITE_PLAID_ENV=production
   
   # Feature Flags
   VITE_ENABLE_CONSTRUCTION=true
   VITE_ENABLE_DISTRIBUTIONS=true
   
   # File Upload
   VITE_MAX_FILE_SIZE=10485760
   VITE_ALLOWED_FILE_TYPES=.pdf,.jpg,.png,.docx
   
   # Analytics
   VITE_GA_TRACKING_ID=G-...
   ```

3. Build optimization:
   ```typescript
   // vite.config.ts
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import { compression } from 'vite-plugin-compression';
   
   export default defineConfig({
     plugins: [
       react(),
       compression({ algorithm: 'gzip' })
     ],
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             'react-vendor': ['react', 'react-dom', 'react-router-dom'],
             'ui-vendor': ['@headlessui/react', '@heroicons/react'],
             'form-vendor': ['react-hook-form', 'zod'],
             'query-vendor': ['@tanstack/react-query']
           }
         }
       },
       sourcemap: false,
       minify: 'terser',
       terserOptions: {
         compress: {
           drop_console: true,
           drop_debugger: true
         }
       }
     }
   });
   ```

4. GitHub Actions workflow:
   ```yaml
   name: Deploy Frontend
   
   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]
   
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '20'
         - run: npm ci
         - run: npm run type-check
         - run: npm run lint
         - run: npm run test:unit
   
     deploy:
       needs: test
       if: github.ref == 'refs/heads/main'
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: amondnet/vercel-action@v20
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
             vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
             vercel-args: '--prod'
   ```

DELIVERABLES:
- vercel.json configuration
- Optimized vite.config.ts
- Environment variable template
- GitHub Actions workflow
- Build optimization report
- Deployment documentation

Generate production Vercel configuration with optimization.
```

---

## END OF SPECIFIC FEATURE PROMPTS

These prompts are tailored to your exact RealCo-Kealee integration needs. Each prompt provides comprehensive requirements and context for Cursor AI with Sonnet 4.5.

**Usage Tips:**
1. Start with the master context prompt from the main file
2. Select specific feature prompts based on your current development priority
3. Copy the entire prompt into Cursor's AI chat
4. Review generated code before committing
5. Test thoroughly in development environment first

**Recommended Development Order:**
1. Database Schema Migration (Prompt #1)
2. Bank Account Management (Prompt #6)
3. Transaction Processing Engine (Prompt #7)
4. Project Service Layer (Prompt #2)
5. Task Management (Prompt #3)
6. Webhook Handlers (Prompt #9)
7. UI Dashboards (Prompts #5, #10)
8. Deal-to-Construction Handoff (Prompt #11)
9. Deployment Configuration (Prompts #12, #13)

For questions or issues, refer back to the integration documentation and adjust prompts as needed.
