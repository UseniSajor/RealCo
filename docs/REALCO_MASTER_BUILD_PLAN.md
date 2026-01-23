# RealCo Platform - Master Build Plan

## Executive Summary

**RealCo** is a comprehensive regulated capital platform for real estate investment syndication, property acquisition, and development management. The platform manages the complete lifecycle from lead generation through investor syndication, due diligence, closing, and construction handoff.

**Tech Stack:**
- Backend: Fastify + Prisma + PostgreSQL
- Frontend: Vite + React + TypeScript
- Deployment: Railway (backend) + Vercel (frontend)
- Key Principle: **All compliance and state transitions enforced server-side**

---

## Platform Objectives

### Primary Objectives

1. **Capital Formation**
   - Enable sponsors to raise capital from accredited investors
   - Manage investor onboarding, verification, and compliance (SEC Reg D, Reg A+)
   - Track investment commitments, capital calls, and distributions
   - Facilitate secure fund transfers via escrow

2. **Deal Flow Management**
   - Property sourcing and lead management
   - Property analysis and underwriting
   - Due diligence coordination
   - Offering document generation and management
   - Closing coordination and document execution

3. **Regulatory Compliance**
   - SEC regulations (Reg D 506(b), 506(c), Reg A+, Reg CF)
   - Accredited investor verification (IRS Rule 506)
   - Anti-money laundering (AML) and Know Your Customer (KYC)
   - State securities (Blue Sky) compliance
   - Audit trail for all material actions

4. **Construction & Development**
   - Pre-development conceptual design
   - Budget and cost estimation
   - Construction handoff workflows
   - Contractor management interface
   - Progress tracking and draw management

5. **Investor Experience**
   - Investment portfolio dashboard
   - Document access and e-signing
   - Distribution tracking and tax reporting
   - Property performance metrics
   - Communication center

### Success Metrics

- **Capital Raised:** Track total capital commitments and funded investments
- **Deal Velocity:** Time from lead to closing
- **Investor Retention:** Repeat investment rate
- **Compliance Score:** Zero regulatory violations
- **Platform Efficiency:** Reduction in manual processes vs traditional syndication

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         RealCo Platform                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Sponsor    │  │   Investor   │  │  Contractor  │        │
│  │  Dashboard   │  │   Portal     │  │   Interface  │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                  │                  │                │
│         └──────────────────┴──────────────────┘                │
│                            │                                    │
│                  ┌─────────▼─────────┐                         │
│                  │   API Gateway     │                         │
│                  │  (Fastify Server) │                         │
│                  └─────────┬─────────┘                         │
│                            │                                    │
│         ┌──────────────────┼──────────────────┐                │
│         │                  │                  │                │
│    ┌────▼─────┐   ┌────────▼────────┐  ┌─────▼──────┐        │
│    │  Deal    │   │   Compliance    │  │  Payment   │        │
│    │  Engine  │   │     Engine      │  │   Engine   │        │
│    └────┬─────┘   └────────┬────────┘  └─────┬──────┘        │
│         │                  │                  │                │
│         └──────────────────┴──────────────────┘                │
│                            │                                    │
│                  ┌─────────▼─────────┐                         │
│                  │  PostgreSQL DB    │                         │
│                  │  + Audit Logs     │                         │
│                  └───────────────────┘                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

External Integrations:
├── Plaid / Stripe (Payment Processing & Verification)
├── DocuSign / HelloSign (E-Signatures)
├── Parallel Markets / VerifyInvestor (Accreditation)
├── Twilio (Communications)
├── SendGrid (Email)
└── S3 / R2 (Document Storage)
```

---

## Core Modules

### Module 1: Lead & Property Management

**Purpose:** Source, track, and qualify real estate opportunities

**Features:**
- Property lead capture (web forms, MLS integration, broker feeds)
- Lead scoring and qualification
- Property information database (location, specs, photos, documents)
- Comparable sales analysis
- Market research integration
- Lead assignment and routing
- Activity tracking and notes
- Pipeline visualization

**Key Entities:**
- `Property` (address, type, specs, listing_status)
- `Lead` (source, assigned_to, status, score)
- `Activity` (type, timestamp, user, notes)
- `Market_Data` (comps, market_metrics, census_data)

**State Machine:**
```
NEW → QUALIFYING → QUALIFIED → UNDER_ANALYSIS → 
APPROVED → UNDER_CONTRACT → CLOSED → ARCHIVED
```

---

### Module 2: Deal Underwriting & Analysis

**Purpose:** Financial analysis and investment decision support

**Features:**
- Pro forma creation (income, expenses, cash flow projections)
- Return calculations (IRR, equity multiple, cash-on-cash)
- Sensitivity analysis
- Debt structuring and scenario modeling
- Hold period assumptions
- Exit strategy modeling
- Investment memo generation
- Comparable transaction analysis

**Key Entities:**
- `Deal` (property_id, sponsor_id, deal_structure, status)
- `Proforma` (deal_id, assumptions, projections)
- `Return_Scenario` (base_case, best_case, worst_case)
- `Debt_Structure` (lender, terms, LTV, rate)
- `Investment_Memo` (executive_summary, highlights, risks)

**Key Calculations:**
- Purchase price and acquisition costs
- Renovation/development budget
- Operating income (gross rents - vacancy - expenses)
- Debt service and returns to equity
- Waterfall distributions (preferred return, profit splits)

---

### Module 3: Investor Syndication

**Purpose:** Raise capital from accredited investors in compliance with securities regulations

**Features:**

**Investor Onboarding:**
- Registration and account creation
- Identity verification (KYC)
- Accredited investor verification (income/net worth docs, 3rd party verification)
- Entity structure support (individual, IRA, LLC, trust)
- Banking information and verification
- Subscription agreement e-signature
- W-9 / W-8BEN collection

**Offering Management:**
- Deal structure configuration (equity, debt, preferred equity, JV)
- Investment minimums and maximums
- Offering circular / PPM generation
- Reg D filing preparation (Form D)
- Investor communications (updates, Q&A)
- Data room access controls
- Investment commitment tracking
- Capital call management

**Compliance:**
- SEC Regulation D (506b, 506c) compliance
- Reg A+, Reg CF support
- Pre-existing relationship verification (506b)
- General solicitation rules (506c)
- State Blue Sky filings
- Bad actor disqualification checks
- Integration safe harbors
- Audit trail for all investor actions

**Key Entities:**
- `Investor` (user_id, accreditation_status, investor_type)
- `Accreditation_Verification` (method, verified_date, expiration, documents)
- `Offering` (deal_id, regulation_type, min_investment, max_raise)
- `Investment` (investor_id, offering_id, amount, status)
- `Capital_Call` (offering_id, amount_requested, due_date)
- `Distribution` (offering_id, amount, distribution_date, type)
- `Compliance_Check` (entity_type, check_type, result, timestamp)

**Investor Portal Features:**
- Portfolio dashboard (all investments, performance metrics)
- Document library (PPMs, operating agreements, K-1s)
- Distribution history and tax documents
- Investment activity and capital call notices
- Property updates and reports
- Communication center
- Profile and banking management

**State Machine (Investment):**
```
INITIATED → DOCUMENTS_PENDING → COMPLIANCE_CHECK → 
APPROVED → FUNDS_PENDING → FUNDED → ACTIVE → 
EXITED (or CANCELLED)
```

---

### Module 4: Document Management & E-Signature

**Purpose:** Secure document generation, storage, and execution

**Features:**
- Template library (PPMs, operating agreements, subscription docs)
- Mail merge and dynamic document generation
- Version control and audit trail
- E-signature workflows (DocuSign integration)
- Signer tracking and reminders
- Fully executed document storage
- Investor document access
- Data room with role-based permissions

**Key Entities:**
- `Document_Template` (name, type, content, merge_fields)
- `Document` (template_id, deal_id, investor_id, version)
- `Signature_Request` (document_id, signers, status)
- `Document_Access_Log` (document_id, user_id, action, timestamp)

---

### Module 5: Escrow & Payment Processing

**Purpose:** Secure fund collection and disbursement with audit trail

**Features:**
- Integration with payment processors (Stripe, Plaid)
- Bank account verification (micro-deposits, Plaid)
- ACH transfers for investments
- Wire transfer tracking
- Escrow account management
- Distribution processing (quarterly/annual)
- Fee calculations and deductions
- Payment reconciliation
- Failed payment handling
- Refund processing

**Key Entities:**
- `Payment_Account` (investor_id, bank_name, account_type, verified)
- `Transaction` (type, amount, status, from_account, to_account)
- `Escrow_Account` (offering_id, balance, bank_account)
- `Distribution_Schedule` (offering_id, frequency, next_date)

**State Machine (Transaction):**
```
INITIATED → PENDING → PROCESSING → COMPLETED
  ├─→ FAILED → RETRY_SCHEDULED
  └─→ CANCELLED
```

---

### Module 6: Compliance Engine (Critical)

**Purpose:** Enforce SEC regulations and maintain audit trail

**Core Function:**
```javascript
runComplianceChecks(action, context) {
  // All state transitions MUST pass through this
  const checks = [
    verifyAccreditation(context.investor),
    checkInvestmentLimits(context.investment),
    validateOfferingCompliance(context.offering),
    checkBadActors(context.investor),
    verifyDocumentation(context),
    validateStateCompliance(context.investor.state)
  ];
  
  const results = await Promise.all(checks);
  
  // Log audit event BEFORE allowing transition
  await createAuditEvent({
    action,
    before_state: context.before,
    after_state: context.after,
    compliance_results: results,
    user_id: context.user_id,
    timestamp: new Date()
  });
  
  if (results.some(r => !r.passed)) {
    throw new ComplianceViolation(results);
  }
  
  return { approved: true, checks: results };
}
```

**Compliance Rules:**

1. **Accreditation Verification (Rule 506)**
   - Income: $200k individual / $300k joint for 2 years
   - Net worth: $1M excluding primary residence
   - Professional certifications (Series 7, 65, 82)
   - Entity: $5M in assets
   - Verification expiration: 90 days

2. **Investment Limits**
   - Individual limits per offering
   - Total exposure across platform
   - Entity-specific limits
   - Concentration risk controls

3. **Offering Compliance**
   - Maximum raise amounts (Reg D: unlimited, Reg CF: $5M, Reg A+: $75M)
   - Investor count limits (Reg D: unlimited if accredited)
   - General solicitation restrictions (506b vs 506c)
   - Integration period monitoring (6 months)

4. **Bad Actor Disqualification**
   - Felony convictions related to securities
   - SEC/FINRA sanctions
   - Court injunctions
   - Applies to issuers, directors, officers, 20%+ shareholders

5. **State Securities (Blue Sky)**
   - State-by-state filing requirements
   - Investor location tracking
   - Filing fee management
   - Notice filing vs merit review states

**Key Entities:**
- `Compliance_Rule` (regulation, rule_name, check_function)
- `Audit_Event` (action, entity_type, entity_id, before_state, after_state, user_id, timestamp)
- `Compliance_Violation` (rule_id, entity_id, severity, resolution_status)

---

### Module 7: Pre-Development & Construction

**Purpose:** Manage conceptual design, budgeting, and construction workflows

**Pre-Development Features:**
- Conceptual design parameters (unit mix, finishes, amenities)
- Square footage and unit count planning
- Rough order of magnitude (ROM) budgeting
- Cost per square foot analysis
- Schedule estimates
- Feasibility study integration
- Design document library
- Zoning and entitlement tracking

**Construction Features:**
- Contractor onboarding and verification
- Scope of work (SOW) management
- Budget tracking (line item detail)
- Draw schedule and requests
- Lien waiver collection
- Change order management
- Progress photo uploads
- Punch list tracking
- Certificate of occupancy tracking

**Key Entities:**
- `Development_Project` (deal_id, project_type, status)
- `Design_Parameters` (unit_mix, finishes, amenities, sqft)
- `Budget` (line_items, contingency, total)
- `Budget_Line_Item` (category, description, budgeted, actual, variance)
- `Contractor` (company_name, license_number, insurance)
- `Draw_Request` (contractor_id, amount, supporting_docs, status)
- `Change_Order` (description, cost_impact, approved_by, status)

**State Machine (Construction Project):**
```
PLANNING → DESIGN → PERMITTING → BIDDING → 
AWARDED → CONSTRUCTION → PUNCH_LIST → 
CERTIFICATE_OF_OCCUPANCY → COMPLETE
```

---

### Module 8: Reporting & Analytics

**Purpose:** Investor reporting and portfolio analytics

**Features:**

**Investor Reports:**
- Quarterly performance reports
- Annual K-1 tax forms
- Distribution statements
- Property performance metrics
- Portfolio summary dashboard

**Sponsor Analytics:**
- Deal pipeline metrics
- Capital raise progress
- Investor engagement analytics
- Portfolio performance (aggregated)
- Compliance dashboard
- Financial projections vs actuals

**Key Metrics:**
- Assets Under Management (AUM)
- Total capital raised
- Active investors
- Average investment size
- Deal velocity (time to close)
- Return metrics (realized and unrealized)
- Compliance score

**Key Entities:**
- `Report` (type, period, generated_date, recipients)
- `Metric` (metric_name, value, period, entity_id)
- `Dashboard_Widget` (user_id, widget_type, config)

---

## Database Schema (ERD)

### Core Tables

**Users & Authentication:**
```sql
users (
  id, email, password_hash, role (SPONSOR|INVESTOR|CONTRACTOR|ADMIN),
  first_name, last_name, phone, created_at, updated_at
)

user_profiles (
  user_id FK, profile_type (INDIVIDUAL|ENTITY),
  entity_name, entity_type, tax_id,
  address, city, state, zip, country
)

sessions (
  id, user_id FK, token, expires_at, created_at
)
```

**Properties & Leads:**
```sql
properties (
  id, address, city, state, zip,
  property_type, beds, baths, sqft, lot_size,
  year_built, listing_price, listing_status,
  created_at, updated_at
)

leads (
  id, property_id FK, source, assigned_to FK users,
  status, score, priority,
  created_at, updated_at
)

activities (
  id, lead_id FK, user_id FK,
  activity_type, notes, timestamp
)
```

**Deals & Underwriting:**
```sql
deals (
  id, property_id FK, sponsor_id FK users,
  deal_name, deal_structure (EQUITY|DEBT|PREFERRED|JV),
  status, target_raise, equity_multiple, irr,
  created_at, updated_at
)

proformas (
  id, deal_id FK,
  purchase_price, acquisition_costs, renovation_budget,
  stabilized_noi, cap_rate, exit_value,
  hold_period_years, assumptions JSONB,
  created_at, updated_at
)

return_scenarios (
  id, deal_id FK, scenario_type (BASE|BEST|WORST),
  irr, equity_multiple, cash_on_cash,
  assumptions JSONB
)
```

**Investors & Accreditation:**
```sql
investors (
  id, user_id FK,
  investor_type (INDIVIDUAL|IRA|LLC|TRUST),
  accreditation_status (PENDING|VERIFIED|EXPIRED),
  verified_date, verification_expiration,
  created_at, updated_at
)

accreditation_verifications (
  id, investor_id FK,
  verification_method (INCOME|NET_WORTH|PROFESSIONAL|ENTITY|THIRD_PARTY),
  verified_by, verified_date, expiration_date,
  documents JSONB, notes TEXT,
  created_at
)
```

**Offerings & Investments:**
```sql
offerings (
  id, deal_id FK, sponsor_id FK users,
  offering_name, regulation_type (REG_D_506B|REG_D_506C|REG_A|REG_CF),
  min_investment, max_investment, total_raise_target,
  offering_status (DRAFT|OPEN|CLOSED|FUNDED),
  start_date, close_date,
  created_at, updated_at
)

investments (
  id, investor_id FK, offering_id FK,
  investment_amount, committed_date,
  investment_status (INITIATED|APPROVED|FUNDED|ACTIVE|EXITED),
  payment_method, transaction_id,
  created_at, updated_at
)

capital_calls (
  id, offering_id FK,
  call_amount, due_date, purpose,
  status (PENDING|SENT|COMPLETE),
  created_at
)

distributions (
  id, offering_id FK,
  distribution_amount, distribution_date, distribution_type (RETURN_OF_CAPITAL|PROFIT|INTEREST),
  status (SCHEDULED|PROCESSING|COMPLETE),
  created_at
)

investor_distributions (
  id, distribution_id FK, investor_id FK,
  amount, payment_method, transaction_id,
  created_at
)
```

**Documents:**
```sql
document_templates (
  id, template_name, document_type (PPM|SUB_AGREEMENT|OPERATING_AGREEMENT|K1),
  content TEXT, merge_fields JSONB,
  created_at, updated_at
)

documents (
  id, template_id FK, deal_id FK, investor_id FK,
  document_name, version, file_url, file_hash,
  created_at, updated_at
)

signature_requests (
  id, document_id FK,
  signers JSONB, status (PENDING|SIGNED|EXPIRED),
  sent_date, completed_date,
  docusign_envelope_id
)

document_access_log (
  id, document_id FK, user_id FK,
  action (VIEW|DOWNLOAD|SIGN), ip_address,
  timestamp
)
```

**Payments & Escrow:**
```sql
payment_accounts (
  id, investor_id FK,
  account_type (CHECKING|SAVINGS), bank_name,
  account_last_four, routing_number_hash,
  verification_status (PENDING|VERIFIED),
  plaid_account_id, created_at
)

transactions (
  id, type (INVESTMENT|DISTRIBUTION|FEE|REFUND),
  from_account_id FK, to_account_id FK,
  amount, status (INITIATED|PENDING|COMPLETE|FAILED),
  stripe_payment_intent_id, failure_reason,
  created_at, updated_at
)

escrow_accounts (
  id, offering_id FK,
  bank_account_number, routing_number,
  balance, created_at, updated_at
)
```

**Construction:**
```sql
development_projects (
  id, deal_id FK,
  project_type (GROUND_UP|RENOVATION|REHAB),
  status, start_date, estimated_completion,
  created_at, updated_at
)

design_parameters (
  id, project_id FK,
  unit_mix JSONB, finishes JSONB,
  total_sqft, unit_count,
  created_at, updated_at
)

budgets (
  id, project_id FK,
  total_budget, contingency_pct,
  created_at, updated_at
)

budget_line_items (
  id, budget_id FK,
  category, description,
  budgeted_amount, actual_amount, variance,
  created_at, updated_at
)

contractors (
  id, company_name, license_number,
  insurance_expiration, verified,
  created_at, updated_at
)

draw_requests (
  id, project_id FK, contractor_id FK,
  draw_amount, supporting_docs JSONB,
  status (SUBMITTED|REVIEWED|APPROVED|PAID|REJECTED),
  submitted_date, approved_date,
  created_at, updated_at
)

change_orders (
  id, project_id FK,
  description, cost_impact, schedule_impact,
  approved_by FK users, status,
  created_at, updated_at
)
```

**Compliance & Audit:**
```sql
compliance_rules (
  id, regulation, rule_name,
  check_function TEXT, severity (INFO|WARNING|CRITICAL),
  created_at
)

audit_events (
  id, action, entity_type, entity_id,
  before_state JSONB, after_state JSONB,
  user_id FK, ip_address,
  compliance_results JSONB,
  timestamp
)

compliance_violations (
  id, rule_id FK, entity_type, entity_id,
  severity, description, resolution_status,
  created_at, resolved_at
)
```

---

## API Design

### Authentication & Authorization

**POST /api/v1/auth/register**
- Create new user account
- Request: `{ email, password, role, profile }`
- Response: `{ user, token }`

**POST /api/v1/auth/login**
- Authenticate user
- Request: `{ email, password }`
- Response: `{ user, token }`

**POST /api/v1/auth/logout**
- Invalidate session token
- Response: `{ success: true }`

### Properties & Leads

**GET /api/v1/properties**
- List properties with filtering
- Query params: `status, type, city, state, min_price, max_price`
- Response: `{ properties: [], total, page, limit }`

**POST /api/v1/properties**
- Create new property listing
- Request: `{ address, city, state, type, specs }`
- Response: `{ property }`
- **Compliance:** Audit event logged

**GET /api/v1/leads**
- List leads with filtering
- Query params: `status, assigned_to, source, priority`
- Response: `{ leads: [], total }`

**PUT /api/v1/leads/:id/status**
- Update lead status
- Request: `{ status, notes }`
- **Compliance:** runComplianceChecks() → state transition audit
- Response: `{ lead }`

### Deals & Underwriting

**POST /api/v1/deals**
- Create new deal
- Request: `{ property_id, deal_name, structure, target_raise }`
- **Compliance:** Verify sponsor permissions
- Response: `{ deal }`

**PUT /api/v1/deals/:id/proforma**
- Update deal proforma
- Request: `{ purchase_price, assumptions, projections }`
- Response: `{ proforma, calculations }`

**GET /api/v1/deals/:id/returns**
- Calculate return scenarios
- Response: `{ base_case, best_case, worst_case }`

### Investor Management

**POST /api/v1/investors/onboard**
- Start investor onboarding
- Request: `{ user_id, investor_type, entity_info }`
- Response: `{ investor, next_steps }`

**POST /api/v1/investors/:id/accreditation**
- Submit accreditation verification
- Request: `{ verification_method, documents }`
- **Compliance:** Verify income/net worth against thresholds
- Response: `{ verification, status }`

**GET /api/v1/investors/:id/portfolio**
- Get investor's portfolio
- Response: `{ investments: [], total_invested, distributions }`

### Offerings & Investments

**POST /api/v1/offerings**
- Create new offering
- Request: `{ deal_id, regulation_type, min_investment, max_raise }`
- **Compliance:** Verify regulation limits, Form D preparation
- Response: `{ offering }`

**POST /api/v1/investments**
- Create investment commitment
- Request: `{ investor_id, offering_id, amount }`
- **Compliance:** 
  - runComplianceChecks() verifies:
    - Investor accreditation
    - Investment limits
    - Offering status
    - Bad actor check
    - State Blue Sky compliance
- **Audit:** Log before/after state
- Response: `{ investment }`

**PUT /api/v1/investments/:id/status**
- Update investment status
- Request: `{ status }`
- **Compliance:** State transition validation
- Response: `{ investment }`

**POST /api/v1/capital-calls**
- Issue capital call
- Request: `{ offering_id, amount, due_date }`
- **Compliance:** Verify offering status, investor notifications
- Response: `{ capital_call, notifications_sent }`

**POST /api/v1/distributions**
- Process distribution
- Request: `{ offering_id, amount, distribution_date, type }`
- **Compliance:** Verify funds available, calculate per-investor amounts
- Response: `{ distribution, investor_distributions }`

### Documents

**POST /api/v1/documents/generate**
- Generate document from template
- Request: `{ template_id, deal_id, investor_id, merge_data }`
- Response: `{ document, file_url }`

**POST /api/v1/documents/:id/sign**
- Send document for e-signature
- Request: `{ signers: [{ email, name }] }`
- Response: `{ signature_request, docusign_url }`

**GET /api/v1/documents/:id/status**
- Check signature status
- Response: `{ status, signed_by, pending_signers }`

### Payments

**POST /api/v1/payment-accounts**
- Add payment account
- Request: `{ investor_id, account_type, bank_info }`
- **Compliance:** Initiate Plaid verification
- Response: `{ payment_account, verification_status }`

**POST /api/v1/transactions**
- Initiate transaction
- Request: `{ type, from_account, to_account, amount }`
- **Compliance:** Verify account balances, AML check
- **Audit:** Transaction audit event
- Response: `{ transaction }`

**GET /api/v1/transactions/:id**
- Get transaction status
- Response: `{ transaction }`

### Construction

**POST /api/v1/development-projects**
- Create development project
- Request: `{ deal_id, project_type, design_parameters }`
- Response: `{ project }`

**POST /api/v1/budgets**
- Create project budget
- Request: `{ project_id, line_items: [], contingency_pct }`
- Response: `{ budget }`

**POST /api/v1/draw-requests**
- Submit draw request
- Request: `{ project_id, contractor_id, amount, supporting_docs }`
- **Compliance:** Verify lien waivers, budget availability
- Response: `{ draw_request }`

**PUT /api/v1/draw-requests/:id/approve**
- Approve draw request
- **Compliance:** Verify approver authority, budget tracking
- **Audit:** Approval audit event
- Response: `{ draw_request, payment_initiated }`

### Compliance & Reporting

**POST /api/v1/compliance/check**
- Run ad-hoc compliance check
- Request: `{ entity_type, entity_id, checks: [] }`
- Response: `{ results: [], passed, violations }`

**GET /api/v1/audit-events**
- Query audit trail
- Query params: `entity_type, entity_id, start_date, end_date, user_id`
- Response: `{ events: [], total }`

**GET /api/v1/reports/investor-performance**
- Generate investor performance report
- Query params: `investor_id, period, format`
- Response: `{ report_url, metrics }`

**GET /api/v1/reports/k1**
- Generate K-1 tax form
- Query params: `investor_id, tax_year`
- Response: `{ k1_url }`

---

## State Machines

### Deal Status State Machine

```
States: 
- DRAFT: Initial creation, can be edited freely
- UNDERWRITING: Financial analysis in progress
- APPROVED: Internal approval to proceed
- OFFERING_PREP: Preparing offering documents
- OFFERING_OPEN: Accepting investments
- OFFERING_CLOSED: No longer accepting investments
- FUNDED: All capital raised
- ACTIVE: Project in progress
- EXITED: Project sold/completed
- CANCELLED: Deal abandoned

Transitions:
DRAFT → UNDERWRITING [action: submit_for_analysis]
  Compliance: Verify property data complete
  
UNDERWRITING → APPROVED [action: approve_deal]
  Compliance: Verify sponsor authority, proforma complete
  Audit: Log approval with user_id, timestamp
  
APPROVED → OFFERING_PREP [action: create_offering]
  Compliance: Verify regulation selected, prepare Form D
  
OFFERING_PREP → OFFERING_OPEN [action: open_offering]
  Compliance: Verify documents uploaded, investors can view
  Audit: Log offering open date
  
OFFERING_OPEN → OFFERING_CLOSED [action: close_offering]
  Compliance: Can close early or at deadline
  
OFFERING_CLOSED → FUNDED [action: confirm_funding]
  Compliance: Verify total raised >= minimum
  Audit: Log funded amount, investor count
  
FUNDED → ACTIVE [action: deploy_capital]
  Compliance: Verify escrow released, construction starts
  
ACTIVE → EXITED [action: complete_exit]
  Compliance: Process final distributions, close offering
  Audit: Log exit details, returns
  
Any State → CANCELLED [action: cancel_deal]
  Compliance: Refund investor funds if collected
  Audit: Log cancellation reason
```

### Investment Status State Machine

```
States:
- INITIATED: Investor expressed interest
- DOCUMENTS_PENDING: Waiting for subscription agreement
- COMPLIANCE_CHECK: Verifying accreditation, limits
- APPROVED: Passed compliance, awaiting funds
- FUNDS_PENDING: Payment processing
- FUNDED: Money received
- ACTIVE: Investment live
- EXITED: Investment closed, distributions complete
- CANCELLED: Investment cancelled/refunded

Transitions:
INITIATED → DOCUMENTS_PENDING [action: request_documents]
  Send subscription agreement, W-9
  
DOCUMENTS_PENDING → COMPLIANCE_CHECK [action: documents_received]
  Verify all documents signed
  
COMPLIANCE_CHECK → APPROVED [action: compliance_pass]
  Compliance Checks:
  1. Verify investor accreditation (not expired)
  2. Check investment amount within limits
  3. Verify offering still open
  4. Check bad actor status
  5. Verify state Blue Sky compliance
  Audit: Log all check results
  
COMPLIANCE_CHECK → CANCELLED [action: compliance_fail]
  If any check fails
  Audit: Log failure reason
  
APPROVED → FUNDS_PENDING [action: initiate_payment]
  Send payment instructions
  
FUNDS_PENDING → FUNDED [action: payment_received]
  Compliance: Verify payment amount matches commitment
  Audit: Log transaction ID, date
  
FUNDED → ACTIVE [action: deploy_to_deal]
  Offering is funded and capital deployed
  
ACTIVE → EXITED [action: complete_distributions]
  All distributions processed
  Audit: Log total distributions, returns
```

### Construction Project State Machine

```
States:
- PLANNING: Initial project setup
- DESIGN: Conceptual design phase
- PERMITTING: Obtaining permits
- BIDDING: Contractor selection
- AWARDED: Contractor selected
- CONSTRUCTION: Active construction
- PUNCH_LIST: Completion items
- CERTIFICATE_OF_OCCUPANCY: Final approval
- COMPLETE: Project finished

Transitions:
PLANNING → DESIGN [action: start_design]
  Create design parameters
  
DESIGN → PERMITTING [action: submit_permits]
  Upload design docs, submit applications
  
PERMITTING → BIDDING [action: permits_approved]
  Compliance: Verify all permits obtained
  
BIDDING → AWARDED [action: award_contract]
  Compliance: Verify contractor license, insurance
  Audit: Log contractor selection
  
AWARDED → CONSTRUCTION [action: start_construction]
  Issue notice to proceed
  
CONSTRUCTION → PUNCH_LIST [action: substantial_completion]
  Compliance: Verify % complete threshold
  
PUNCH_LIST → CERTIFICATE_OF_OCCUPANCY [action: punch_complete]
  All items resolved
  
CERTIFICATE_OF_OCCUPANCY → COMPLETE [action: final_inspection]
  Building approved for occupancy
  Audit: Log completion date, final cost
```

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

**Goals:** Core infrastructure, authentication, basic data models

**Deliverables:**
- ✅ Backend setup (Fastify + Prisma + PostgreSQL)
- ✅ Frontend setup (Vite + React + TypeScript)
- ✅ Database schema v1 (users, properties, leads, deals)
- ✅ Authentication system (JWT, role-based access)
- ✅ API structure and routing
- ✅ Compliance engine foundation (runComplianceChecks, audit logging)
- ✅ Basic UI components library
- ✅ Deployment pipeline (Railway + Vercel)

**Sprint 1 (Week 1-2): Backend Foundation**
- Initialize Fastify server with plugins
- Setup Prisma schema and migrations
- Implement authentication endpoints
- Create base compliance engine
- Setup audit event logging
- Health check and ready endpoints

**Sprint 2 (Week 3-4): Frontend Foundation**
- Initialize Vite + React + TypeScript
- Setup routing (React Router)
- Create authentication flows (login, register)
- Build component library (buttons, forms, tables)
- Setup API client with auth interceptors
- Create layout templates

---

### Phase 2: Lead & Deal Management (Weeks 5-8)

**Goals:** Property sourcing, underwriting, deal creation

**Deliverables:**
- Property and lead CRUD
- Lead pipeline visualization
- Deal underwriting calculator
- Proforma builder
- Return scenario modeling
- Investment memo generation

**Sprint 3 (Week 5-6): Properties & Leads**
- Property listing and search
- Lead capture forms
- Lead assignment and routing
- Activity tracking
- Pipeline kanban board

**Sprint 4 (Week 7-8): Deal Underwriting**
- Deal creation wizard
- Proforma input forms
- Financial calculations (IRR, equity multiple)
- Sensitivity analysis
- Investment memo template
- Deal approval workflow

---

### Phase 3: Investor Syndication (Weeks 9-16)

**Goals:** Investor onboarding, accreditation, offering creation

**Deliverables:**
- Investor registration and KYC
- Accreditation verification workflow
- Offering management
- Investment commitment flow
- Document generation and e-signature
- Investor portal

**Sprint 5 (Week 9-10): Investor Onboarding**
- Investor registration flow
- Profile creation (individual/entity)
- KYC document upload
- Accreditation verification (income/net worth)
- Third-party verification integration (Parallel Markets)
- Email verification

**Sprint 6 (Week 11-12): Offering Creation**
- Offering creation wizard
- Regulation type selection (506b, 506c, Reg A+)
- Investment terms configuration
- Form D preparation
- Offering document upload
- Data room access control

**Sprint 7 (Week 13-14): Investment Flow**
- Investment commitment interface
- Subscription agreement e-signature (DocuSign)
- Compliance check integration
- Investment approval workflow
- Payment account verification (Plaid)
- Investment dashboard

**Sprint 8 (Week 15-16): Investor Portal**
- Portfolio dashboard
- Document library
- Distribution history
- Tax document access (K-1s)
- Communication center
- Profile management

---

### Phase 4: Payments & Escrow (Weeks 17-20)

**Goals:** Secure fund collection and distribution

**Deliverables:**
- Payment account management
- ACH/wire processing
- Escrow account tracking
- Distribution processing
- Transaction reconciliation
- Payment failure handling

**Sprint 9 (Week 17-18): Payment Infrastructure**
- Stripe/Plaid integration
- Bank account verification
- ACH initiation
- Transaction status tracking
- Webhook handling (payment confirmations)

**Sprint 10 (Week 19-20): Distributions**
- Distribution calculation engine
- Waterfall distribution logic (preferred return, splits)
- Distribution scheduling
- Payment processing
- Investor notification
- Tax reporting (1099s)

---

### Phase 5: Construction & Development (Weeks 21-26)

**Goals:** Pre-development and construction management

**Deliverables:**
- Development project setup
- Conceptual design tools
- Budget creation and tracking
- Contractor management
- Draw request workflow
- Change order management
- Progress tracking

**Sprint 11 (Week 21-22): Pre-Development**
- Project creation
- Design parameter input
- Unit mix calculator
- ROM budget builder
- Cost per sqft analysis
- Schedule estimates

**Sprint 12 (Week 23-24): Construction Budgeting**
- Budget line item management
- Budget vs actual tracking
- Variance reporting
- Contingency tracking
- Budget reforecasting

**Sprint 13 (Week 25-26): Construction Execution**
- Contractor onboarding
- Draw request submission
- Lien waiver tracking
- Draw approval workflow
- Change order submission and approval
- Progress photo uploads
- Punch list management

---

### Phase 6: Compliance & Reporting (Weeks 27-32)

**Goals:** Comprehensive compliance, investor reporting, analytics

**Deliverables:**
- Full compliance rule engine
- Audit trail reporting
- Investor performance reports
- K-1 generation
- Sponsor analytics dashboard
- Form D filing automation

**Sprint 14 (Week 27-28): Compliance Hardening**
- Implement all compliance rules
- State Blue Sky filing tracker
- Bad actor check automation
- Integration period monitoring
- Compliance violation workflow
- Remediation tracking

**Sprint 15 (Week 29-30): Investor Reporting**
- Quarterly performance reports
- Distribution statements
- K-1 generation (integration with tax software)
- Annual reports
- Investor communication templates

**Sprint 16 (Week 31-32): Analytics & Dashboards**
- Sponsor analytics dashboard
- Deal pipeline metrics
- Capital raise tracking
- Portfolio performance rollup
- Compliance scorecard
- Custom report builder

---

### Phase 7: Polish & Launch Prep (Weeks 33-36)

**Goals:** Security hardening, performance optimization, user testing

**Deliverables:**
- Security audit and fixes
- Performance optimization
- User acceptance testing
- Documentation
- Training materials
- Launch checklist

**Sprint 17 (Week 33-34): Security & Performance**
- Penetration testing
- SQL injection prevention
- Rate limiting
- Database indexing optimization
- Query performance tuning
- Load testing
- CDN setup for static assets

**Sprint 18 (Week 35-36): Launch Prep**
- User acceptance testing
- Bug fixes and polish
- Admin documentation
- User guides and videos
- Support workflows
- Monitoring and alerting setup
- Backup and disaster recovery testing

---

## Technology Stack Detail

### Backend

**Framework:** Fastify v4
- Ultra-fast Node.js web framework
- Schema-based validation
- Plugin architecture
- Excellent TypeScript support

**ORM:** Prisma v5
- Type-safe database access
- Automatic migrations
- Excellent DX with Prisma Studio

**Database:** PostgreSQL 15
- ACID compliance (critical for financial transactions)
- JSONB support (flexible compliance data)
- Full-text search
- Row-level security (future enhancement)

**Key Libraries:**
- `fastify-jwt` - JWT authentication
- `fastify-cors` - CORS handling
- `fastify-helmet` - Security headers
- `fastify-rate-limit` - Rate limiting
- `@prisma/client` - Database client
- `bcrypt` - Password hashing
- `zod` - Runtime schema validation
- `winston` - Logging
- `stripe` - Payment processing
- `@docusign/esign-client` - E-signatures
- `@sendgrid/mail` - Transactional email
- `aws-sdk` - S3 document storage

### Frontend

**Framework:** React 18 + TypeScript
- Component-based architecture
- Type safety
- Hooks for state management

**Build Tool:** Vite 5
- Lightning-fast HMR
- Optimized production builds
- Plugin ecosystem

**Routing:** React Router v6
- Declarative routing
- Protected routes
- Nested layouts

**State Management:** 
- React Query (TanStack Query) - Server state
- Zustand - Client state (user session, UI state)

**UI Components:**
- Tailwind CSS - Utility-first styling
- Headless UI - Accessible components
- Recharts - Data visualization
- React Hook Form - Form management
- Zod - Form validation

**Key Libraries:**
- `axios` - HTTP client
- `date-fns` - Date manipulation
- `react-dropzone` - File uploads
- `react-pdf` - PDF rendering
- `@tanstack/react-table` - Table management

### Infrastructure

**Backend Hosting:** Railway
- PostgreSQL managed database
- Automatic deployments from Git
- Environment variable management
- Monitoring and logs

**Frontend Hosting:** Vercel
- Edge network CDN
- Automatic HTTPS
- Preview deployments
- Analytics

**File Storage:** AWS S3 / Cloudflare R2
- Document storage
- Secure presigned URLs
- Version control

**Email:** SendGrid
- Transactional emails
- Template management
- Delivery tracking

**Monitoring:** 
- Sentry - Error tracking
- LogRocket - Session replay (compliance/debugging)
- DataDog - Application performance monitoring

---

## Security Considerations

### Authentication & Authorization

- JWT tokens with short expiration (15 min access, 7 day refresh)
- Role-based access control (RBAC)
- Multi-factor authentication (MFA) for sensitive actions
- IP allowlisting for admin actions
- Session management and revocation

### Data Protection

- Encryption at rest (database encryption)
- Encryption in transit (TLS 1.3)
- PII encryption for sensitive fields (SSN, bank accounts)
- Document encryption (AES-256)
- Secure key management (AWS KMS / HashiCorp Vault)

### Compliance & Audit

- Immutable audit log (append-only)
- User action tracking
- IP address logging
- Failed login attempt monitoring
- Compliance check versioning (track rule changes)

### Payment Security

- PCI DSS compliance (via Stripe)
- No storage of full card numbers
- Tokenization of payment methods
- Fraud detection integration
- AML transaction monitoring

### Penetration Testing

- Annual third-party security audit
- Vulnerability scanning (OWASP Top 10)
- Dependency scanning (Snyk)
- Code review for security issues

---

## Regulatory Compliance Summary

### SEC Regulations

**Regulation D (Rule 506(b)):**
- Private placement exemption
- Unlimited accredited investors
- Max 35 sophisticated non-accredited investors
- No general solicitation
- Pre-existing relationship required for non-accredited
- Form D filing within 15 days

**Regulation D (Rule 506(c)):**
- Private placement exemption
- Only accredited investors
- General solicitation permitted
- Must verify accreditation (third-party or docs)
- Form D filing within 15 days

**Regulation A+ (Tier 2):**
- Mini-IPO (up to $75M in 12 months)
- Both accredited and non-accredited investors
- Offering statement filed with SEC
- Ongoing reporting requirements
- No state Blue Sky review (federal preemption)

**Regulation Crowdfunding (Reg CF):**
- Up to $5M in 12 months
- Investment limits based on investor income/net worth
- Must use registered broker-dealer or funding portal
- Form C filing required

### State Securities (Blue Sky Laws)

- State-by-state filing requirements (notice filing or merit review)
- Varies by state even for federal exemptions
- Reg D: Most states require notice filing + fees
- Reg A+ Tier 2: Federal preemption (no state review)
- Track investor states, ensure compliance

### Accredited Investor Definition

- Individual: $200k income (or $300k joint) for 2 years + expectation of same
- Individual: $1M net worth (excluding primary residence)
- Professional: Series 7, 65, 82 license holders
- Entity: $5M in assets
- Verification expires after 90 days

### Anti-Money Laundering (AML) / Know Your Customer (KYC)

- Investor identity verification (government ID)
- Address verification
- OFAC sanctions screening
- Suspicious activity reporting (SARs) if applicable
- Customer Identification Program (CIP)

### Tax Reporting

- K-1s for partnership/LLC structures (Schedule K-1 Form 1065)
- 1099-DIV for C-corp dividends
- 1099-INT for debt interest
- Annual distribution statements
- Basis tracking for investors

---

## Future Enhancements (Post-MVP)

### Advanced Features

1. **Secondary Market**
   - Investor-to-investor trading
   - Valuation services
   - Transfer agent integration
   - Liquidity events

2. **Automated Underwriting**
   - Machine learning for property valuation
   - Automated rent comps
   - Risk scoring
   - Market analysis integration

3. **Mobile Apps**
   - iOS and Android native apps
   - Push notifications
   - Mobile document signing
   - Biometric authentication

4. **Advanced Analytics**
   - Portfolio optimization
   - Risk-adjusted returns
   - Benchmark comparisons
   - Predictive modeling

5. **Blockchain Integration**
   - Tokenized securities (Reg A+ tokens)
   - Smart contracts for distributions
   - Immutable audit trail on-chain
   - Digital asset custody

6. **Construction Tech**
   - BIM integration
   - Drone progress monitoring
   - AR/VR property tours
   - IoT sensors for construction tracking

7. **Investor Relations**
   - Automated investor updates
   - AI-powered Q&A chatbot
   - Virtual property tours
   - Live construction webcams

---

## Success Criteria

### Technical KPIs

- 99.9% uptime
- < 200ms API response time (p95)
- Zero critical security vulnerabilities
- 100% audit trail coverage
- < 1% payment failure rate

### Business KPIs

- $50M capital raised in year 1
- 500 active investors
- 25 successful deals closed
- 95% investor satisfaction score
- Zero regulatory violations

### Compliance KPIs

- 100% Form D filings on time
- 100% accreditation verification before funding
- All state Blue Sky filings current
- Zero failed compliance checks reaching funding
- < 24 hour audit event availability

---

## Team Structure Recommendation

**Engineering:**
- 1 Senior Full-Stack Engineer (Tech Lead)
- 2 Full-Stack Engineers (Backend/Frontend)
- 1 DevOps Engineer (part-time)
- 1 QA Engineer (part-time, can be outsourced)

**Product:**
- 1 Product Manager
- 1 Product Designer (UI/UX)

**Compliance & Legal:**
- 1 Securities Attorney (advisor/consultant)
- 1 Compliance Officer (can be part-time initially)

**Business:**
- 1 COO / General Manager
- 1 Head of Investor Relations
- 1 Head of Sponsor Relations

**Total Team Size:** 10-12 people (some roles part-time or advisory)

---

## Immediate Next Steps

### Week 1 Priorities

1. **Database Schema Finalization**
   - Review ERD with stakeholders
   - Identify any missing entities
   - Create Prisma schema file
   - Run initial migration

2. **Compliance Engine Foundation**
   - Design runComplianceChecks() function signature
   - Define compliance rule structure
   - Implement audit event logging
   - Create first compliance rules (accreditation check)

3. **Authentication & Authorization**
   - Implement JWT authentication
   - Create role-based middleware
   - Build user registration/login endpoints
   - Setup session management

4. **Frontend Bootstrap**
   - Setup Vite + React + TypeScript project
   - Create component library structure
   - Implement authentication UI
   - Connect to backend API

5. **DevOps Setup**
   - Configure Railway backend deployment
   - Configure Vercel frontend deployment
   - Setup environment variables
   - Create CI/CD pipeline
   - Configure monitoring (Sentry)

### Key Decisions Needed

1. **Regulation Focus:** Start with 506(c) only or support multiple?
2. **Payment Provider:** Stripe or alternative (Plaid, Dwolla)?
3. **E-Signature:** DocuSign, HelloSign, or PandaDoc?
4. **Accreditation Verification:** Build in-house or use third-party (Parallel Markets, VerifyInvestor)?
5. **Document Storage:** AWS S3, Cloudflare R2, or other?
6. **Tax Software:** Integrate with QuickBooks, Xero, or standalone?

---

## Risk Mitigation

### Regulatory Risks

**Risk:** Non-compliance with SEC regulations
**Mitigation:**
- Engage securities attorney for review
- Implement mandatory compliance checks
- Regular compliance audits
- Training for team on regulations

**Risk:** State Blue Sky violations
**Mitigation:**
- Track investor locations
- Automate state filing reminders
- Partner with Blue Sky filing service

### Technical Risks

**Risk:** Payment processing failures
**Mitigation:**
- Implement retry logic
- Multiple payment methods
- Real-time monitoring and alerts
- Manual fallback procedures

**Risk:** Data breach
**Mitigation:**
- Encryption at rest and in transit
- Regular security audits
- Access controls and logging
- Incident response plan

### Operational Risks

**Risk:** Investor onboarding bottleneck
**Mitigation:**
- Automated document verification
- Self-service onboarding flow
- Clear status tracking
- Support team for complex cases

**Risk:** Construction delays impacting returns
**Mitigation:**
- Realistic timeline assumptions
- Contingency budgets
- Frequent progress tracking
- Investor communication plan

---

## Glossary

**Accredited Investor:** Individual or entity meeting SEC income/net worth thresholds to invest in private securities offerings.

**Blue Sky Laws:** State securities regulations requiring registration or exemption for securities offerings.

**Capital Call:** Request from sponsor to investors to fund committed capital.

**Cap Rate (Capitalization Rate):** Net operating income divided by property value, used to estimate investment returns.

**Distribution:** Payment to investors from property cash flow or sale proceeds.

**Equity Multiple:** Total distributions divided by total invested capital.

**Escrow:** Third-party account holding funds until transaction conditions are met.

**Form D:** SEC filing required for Regulation D offerings.

**IRR (Internal Rate of Return):** Annualized rate of return accounting for time value of money.

**K-1 (Schedule K-1):** Tax form reporting investor's share of partnership income, deductions, and credits.

**KYC (Know Your Customer):** Process of verifying investor identity for compliance and fraud prevention.

**LTV (Loan-to-Value):** Loan amount divided by property value.

**PPM (Private Placement Memorandum):** Offering document disclosing investment details and risks.

**Proforma:** Financial projection estimating property income, expenses, and returns.

**Reg D (Regulation D):** SEC exemption for private securities offerings to accredited investors.

**Subscription Agreement:** Contract between investor and sponsor committing capital to an offering.

**Syndication:** Pooling capital from multiple investors for a real estate investment.

**Waterfall:** Structure defining distribution priority (e.g., preferred return before profit splits).

---

**END OF MASTER BUILD PLAN**

This plan provides a comprehensive framework for building RealCo. Adjust timelines and priorities based on available resources and market feedback. The phased approach allows for iterative development and early user feedback while ensuring compliance is never compromised.
