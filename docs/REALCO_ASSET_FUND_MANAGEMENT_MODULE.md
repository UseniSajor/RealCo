# RealCo Platform - Asset & Fund Management Module

## Module 9: Asset & Fund Management

### Overview

The **Asset & Fund Management Module** manages properties during the hold period after acquisition/construction and before exit. This bridges the gap between deal closing and eventual sale/refinance, providing ongoing operations management, investor relations, and performance tracking.

**Hold Period:** Typically 3-7 years for real estate value-add and development deals

**Key Responsibilities:**
1. Property operations and performance monitoring
2. Lease management and tenant relations
3. Property management coordination
4. Investor relations and reporting
5. Fund-level accounting and compliance
6. Portfolio performance tracking
7. Exit strategy execution

---

## Sub-Module 9.1: Asset Operations Management

### Purpose
Manage day-to-day property operations during the hold period

### Features

**Property Operations Dashboard:**
- Occupancy tracking (current, trending, forecast)
- Rental income tracking (actual vs budgeted)
- Operating expense monitoring
- NOI (Net Operating Income) tracking
- Capital expenditure tracking
- Maintenance request management
- Vendor/contractor management

**Lease Management:**
- Lease abstraction and database
- Lease expiration calendar
- Renewal tracking and notifications
- Rent roll management
- Lease amendment tracking
- Security deposit tracking
- Late payment tracking and collections

**Tenant Management:**
- Tenant portal integration
- Rent payment processing
- Maintenance request routing
- Tenant communication log
- Lease violation tracking
- Move-in/move-out coordination
- Tenant satisfaction surveys

**Maintenance & Capital Projects:**
- Preventive maintenance scheduling
- Work order management
- Service request tracking
- Capital improvement planning
- Vendor bid management
- Project milestone tracking
- Warranty management

**Property Management Integration:**
- Third-party PM software integration (Yardi, AppFolio, Buildium)
- Financial data import (rent roll, operating statements)
- Automated reconciliation
- Document synchronization
- Reporting aggregation

### Key Entities

```prisma
enum AssetStatus {
  STABILIZING      // Post-construction lease-up
  STABILIZED       // Fully leased and operating
  VALUE_ADD        // Renovations in progress
  DISPOSITION_PREP // Preparing for sale
  UNDER_CONTRACT   // Sale contract signed
  SOLD             // Asset exited
}

model Asset {
  id                    Int          @id @default(autoincrement())
  propertyId            Int          @unique @map("property_id")
  dealId                Int          @unique @map("deal_id")
  
  // Status
  assetStatus           AssetStatus  @map("asset_status")
  stabilizationDate     DateTime?    @map("stabilization_date")
  
  // Property Management
  propertyManagerId     Int?         @map("property_manager_id")
  pmCompanyName         String?      @map("pm_company_name")
  pmContractStart       DateTime?    @map("pm_contract_start")
  pmContractEnd         DateTime?    @map("pm_contract_end")
  pmFeeStructure        Json?        @map("pm_fee_structure") // {type, rate, minimum}
  
  // External System Integration
  yardiPropertyId       String?      @map("yardi_property_id")
  appfolioPropertyId    String?      @map("appfolio_property_id")
  buildiumPropertyId    String?      @map("buildium_property_id")
  lastSyncedAt          DateTime?    @map("last_synced_at")
  
  // Performance Metrics (current period)
  currentOccupancy      Decimal?     @map("current_occupancy") @db.Decimal(5, 2) // 95.50%
  currentAvgRent        Decimal?     @map("current_avg_rent") @db.Decimal(10, 2)
  currentNOI            Decimal?     @map("current_noi") @db.Decimal(12, 2)
  ytdNOI                Decimal?     @map("ytd_noi") @db.Decimal(12, 2)
  
  createdAt             DateTime     @default(now()) @map("created_at")
  updatedAt             DateTime     @updatedAt @map("updated_at")
  
  // Relations
  property              Property     @relation(fields: [propertyId], references: [id])
  deal                  Deal         @relation(fields: [dealId], references: [id])
  propertyManager       User?        @relation(fields: [propertyManagerId], references: [id])
  units                 Unit[]
  leases                Lease[]
  operatingStatements   OperatingStatement[]
  maintenanceRequests   MaintenanceRequest[]
  capitalProjects       CapitalProject[]
  
  @@index([assetStatus])
  @@map("assets")
}

enum UnitStatus {
  VACANT
  OCCUPIED
  NOTICE_GIVEN
  RENOVATING
  READY_TO_LEASE
}

model Unit {
  id                Int        @id @default(autoincrement())
  assetId           Int        @map("asset_id")
  
  // Unit Details
  unitNumber        String     @map("unit_number")
  unitType          String     @map("unit_type") // 1BR, 2BR, STUDIO, etc.
  squareFeet        Int?       @map("square_feet")
  bedrooms          Int
  bathrooms         Decimal    @db.Decimal(3, 1) // 2.5
  floor             Int?
  
  // Status
  status            UnitStatus @default(VACANT)
  
  // Rent
  marketRent        Decimal    @map("market_rent") @db.Decimal(10, 2)
  currentRent       Decimal?   @map("current_rent") @db.Decimal(10, 2)
  
  // Amenities
  amenities         Json?      // {hasBalcony, hasParking, petFriendly, etc}
  
  // Availability
  availableDate     DateTime?  @map("available_date")
  
  createdAt         DateTime   @default(now()) @map("created_at")
  updatedAt         DateTime   @updatedAt @map("updated_at")
  
  // Relations
  asset             Asset      @relation(fields: [assetId], references: [id])
  leases            Lease[]
  
  @@unique([assetId, unitNumber])
  @@index([assetId])
  @@index([status])
  @@map("units")
}

enum LeaseStatus {
  PENDING    // Application submitted
  APPROVED   // Application approved
  ACTIVE     // Lease in effect
  EXPIRING   // Within 60 days of expiration
  EXPIRED    // Past end date
  RENEWED    // Converted to renewal
  TERMINATED // Ended early
}

model Lease {
  id                    Int         @id @default(autoincrement())
  assetId               Int         @map("asset_id")
  unitId                Int         @map("unit_id")
  
  // Tenant
  tenantName            String      @map("tenant_name")
  tenantEmail           String      @map("tenant_email")
  tenantPhone           String      @map("tenant_phone")
  coTenants             Json?       @map("co_tenants") // [{name, email}]
  
  // Lease Terms
  leaseStartDate        DateTime    @map("lease_start_date")
  leaseEndDate          DateTime    @map("lease_end_date")
  monthlyRent           Decimal     @map("monthly_rent") @db.Decimal(10, 2)
  securityDeposit       Decimal     @map("security_deposit") @db.Decimal(10, 2)
  
  // Payment Terms
  rentDueDay            Int         @map("rent_due_day") // Day of month (1-31)
  lateFeeAmount         Decimal?    @map("late_fee_amount") @db.Decimal(10, 2)
  lateFeeGraceDays      Int?        @map("late_fee_grace_days")
  
  // Lease Details
  leaseType             String      @map("lease_type") // FIXED, MONTH_TO_MONTH
  petsAllowed           Boolean     @default(false) @map("pets_allowed")
  smokingAllowed        Boolean     @default(false) @map("smoking_allowed")
  parkingSpaces         Int         @default(0) @map("parking_spaces")
  
  // Status
  status                LeaseStatus @default(PENDING)
  
  // Renewal
  renewalNoticeDays     Int?        @map("renewal_notice_days")
  renewalNoticeDate     DateTime?   @map("renewal_notice_date")
  renewalOffered        Boolean     @default(false) @map("renewal_offered")
  
  // Move-in/out
  moveInDate            DateTime?   @map("move_in_date")
  moveOutDate           DateTime?   @map("move_out_date")
  moveInInspection      Json?       @map("move_in_inspection")
  moveOutInspection     Json?       @map("move_out_inspection")
  
  // Documents
  leaseDocumentUrl      String?     @map("lease_document_url")
  
  createdAt             DateTime    @default(now()) @map("created_at")
  updatedAt             DateTime    @updatedAt @map("updated_at")
  
  // Relations
  asset                 Asset       @relation(fields: [assetId], references: [id])
  unit                  Unit        @relation(fields: [unitId], references: [id])
  rentPayments          RentPayment[]
  
  @@index([assetId])
  @@index([unitId])
  @@index([status])
  @@index([leaseEndDate])
  @@map("leases")
}

enum PaymentStatus {
  PENDING
  PAID
  LATE
  PARTIAL
  DELINQUENT
}

model RentPayment {
  id                Int           @id @default(autoincrement())
  leaseId           Int           @map("lease_id")
  
  // Payment Details
  periodStartDate   DateTime      @map("period_start_date")
  periodEndDate     DateTime      @map("period_end_date")
  amountDue         Decimal       @map("amount_due") @db.Decimal(10, 2)
  amountPaid        Decimal       @default(0) @map("amount_paid") @db.Decimal(10, 2)
  lateFees          Decimal       @default(0) @map("late_fees") @db.Decimal(10, 2)
  
  // Due Date
  dueDate           DateTime      @map("due_date")
  paidDate          DateTime?     @map("paid_date")
  
  // Status
  status            PaymentStatus @default(PENDING)
  
  // Payment Method
  paymentMethod     String?       @map("payment_method") // ACH, CHECK, CREDIT_CARD
  transactionId     String?       @map("transaction_id")
  
  // Notes
  notes             String?       @db.Text
  
  createdAt         DateTime      @default(now()) @map("created_at")
  updatedAt         DateTime      @updatedAt @map("updated_at")
  
  // Relations
  lease             Lease         @relation(fields: [leaseId], references: [id])
  
  @@index([leaseId])
  @@index([dueDate])
  @@index([status])
  @@map("rent_payments")
}

enum RequestStatus {
  SUBMITTED
  ACKNOWLEDGED
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum RequestPriority {
  LOW
  NORMAL
  HIGH
  EMERGENCY
}

model MaintenanceRequest {
  id                Int             @id @default(autoincrement())
  assetId           Int             @map("asset_id")
  unitId            Int?            @map("unit_id")
  
  // Request Details
  category          String          // HVAC, PLUMBING, ELECTRICAL, APPLIANCE, etc.
  title             String
  description       String          @db.Text
  priority          RequestPriority @default(NORMAL)
  
  // Requester
  requestedBy       String          @map("requested_by") // Tenant name or staff
  contactPhone      String?         @map("contact_phone")
  contactEmail      String?         @map("contact_email")
  
  // Assignment
  assignedTo        Int?            @map("assigned_to") // Vendor/contractor user_id
  estimatedCost     Decimal?        @map("estimated_cost") @db.Decimal(10, 2)
  actualCost        Decimal?        @map("actual_cost") @db.Decimal(10, 2)
  
  // Schedule
  scheduledDate     DateTime?       @map("scheduled_date")
  completedDate     DateTime?       @map("completed_date")
  
  // Status
  status            RequestStatus   @default(SUBMITTED)
  
  // Photos
  photoUrls         String[]        @map("photo_urls")
  
  // Resolution
  resolutionNotes   String?         @map("resolution_notes") @db.Text
  
  createdAt         DateTime        @default(now()) @map("created_at")
  updatedAt         DateTime        @updatedAt @map("updated_at")
  
  // Relations
  asset             Asset           @relation(fields: [assetId], references: [id])
  unit              Unit?           @relation(fields: [unitId], references: [id])
  assignee          User?           @relation(fields: [assignedTo], references: [id])
  
  @@index([assetId])
  @@index([status])
  @@index([priority])
  @@map("maintenance_requests")
}

enum ProjectStatus {
  PLANNING
  BUDGETED
  APPROVED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model CapitalProject {
  id                Int           @id @default(autoincrement())
  assetId           Int           @map("asset_id")
  
  // Project Details
  projectName       String        @map("project_name")
  description       String        @db.Text
  category          String        // ROOF, HVAC_UPGRADE, UNIT_RENOVATION, etc.
  
  // Budget
  budgetedAmount    Decimal       @map("budgeted_amount") @db.Decimal(12, 2)
  actualCost        Decimal       @default(0) @map("actual_cost") @db.Decimal(12, 2)
  
  // Schedule
  plannedStartDate  DateTime?     @map("planned_start_date")
  plannedEndDate    DateTime?     @map("planned_end_date")
  actualStartDate   DateTime?     @map("actual_start_date")
  actualEndDate     DateTime?     @map("actual_end_date")
  
  // Status
  status            ProjectStatus @default(PLANNING)
  
  // Approval
  approvedBy        Int?          @map("approved_by")
  approvedDate      DateTime?     @map("approved_date")
  
  // Contractor
  contractorId      Int?          @map("contractor_id")
  
  // Tracking
  percentComplete   Int           @default(0) @map("percent_complete")
  
  // Documents
  documentUrls      String[]      @map("document_urls")
  
  // Notes
  notes             String?       @db.Text
  
  createdAt         DateTime      @default(now()) @map("created_at")
  updatedAt         DateTime      @updatedAt @map("updated_at")
  
  // Relations
  asset             Asset         @relation(fields: [assetId], references: [id])
  approver          User?         @relation(fields: [approvedBy], references: [id])
  contractor        Contractor?   @relation(fields: [contractorId], references: [id])
  
  @@index([assetId])
  @@index([status])
  @@map("capital_projects")
}

model OperatingStatement {
  id                    Int      @id @default(autoincrement())
  assetId               Int      @map("asset_id")
  
  // Period
  periodStart           DateTime @map("period_start")
  periodEnd             DateTime @map("period_end")
  statementType         String   @map("statement_type") // MONTHLY, QUARTERLY, ANNUAL
  
  // Income
  rentalIncome          Decimal  @map("rental_income") @db.Decimal(12, 2)
  otherIncome           Decimal  @default(0) @map("other_income") @db.Decimal(12, 2)
  vacancyLoss           Decimal  @default(0) @map("vacancy_loss") @db.Decimal(12, 2)
  effectiveGrossIncome  Decimal  @map("effective_gross_income") @db.Decimal(12, 2)
  
  // Operating Expenses
  propertyManagement    Decimal  @default(0) @map("property_management") @db.Decimal(12, 2)
  utilities             Decimal  @default(0) @db.Decimal(12, 2)
  insurance             Decimal  @default(0) @db.Decimal(12, 2)
  propertyTaxes         Decimal  @default(0) @map("property_taxes") @db.Decimal(12, 2)
  repairsMaintenance    Decimal  @default(0) @map("repairs_maintenance") @db.Decimal(12, 2)
  marketing             Decimal  @default(0) @db.Decimal(12, 2)
  administrative        Decimal  @default(0) @db.Decimal(12, 2)
  other Expenses        Decimal  @default(0) @map("other_expenses") @db.Decimal(12, 2)
  totalOperatingExpenses Decimal @map("total_operating_expenses") @db.Decimal(12, 2)
  
  // Net Operating Income
  noi                   Decimal  @db.Decimal(12, 2)
  
  // Debt Service (if applicable)
  debtService           Decimal  @default(0) @map("debt_service") @db.Decimal(12, 2)
  
  // Cash Flow
  netCashFlow           Decimal  @map("net_cash_flow") @db.Decimal(12, 2)
  
  // Variance Analysis
  budgetedNOI           Decimal? @map("budgeted_noi") @db.Decimal(12, 2)
  noiVariance           Decimal? @map("noi_variance") @db.Decimal(12, 2)
  noiVariancePct        Decimal? @map("noi_variance_pct") @db.Decimal(5, 2)
  
  // Source
  importedFrom          String?  @map("imported_from") // YARDI, APPFOLIO, MANUAL
  importedAt            DateTime? @map("imported_at")
  
  // Approval
  approvedBy            Int?     @map("approved_by")
  approvedAt            DateTime? @map("approved_at")
  
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")
  
  // Relations
  asset                 Asset    @relation(fields: [assetId], references: [id])
  approver              User?    @relation(fields: [approvedBy], references: [id])
  
  @@unique([assetId, periodStart, periodEnd])
  @@index([assetId])
  @@map("operating_statements")
}
```

---

## Sub-Module 9.2: Fund Accounting & Investor Relations

### Purpose
Manage fund-level accounting, investor communications, and ongoing reporting

### Features

**Fund-Level Accounting:**
- Capital account tracking per investor
- Distribution waterfall calculations
- Preferred return tracking
- Carried interest calculations
- Management fee calculations
- Fund expenses allocation
- Investor capital statements

**Investor Reporting:**
- Quarterly investor reports
- Performance dashboards
- Portfolio statements
- Tax document preparation (K-1s)
- Distribution notices
- Capital call notices
- Annual meetings and updates

**Investor Communications:**
- Mass email campaigns
- Investor Q&A forum
- Document library
- News and updates feed
- Event calendar
- Investor satisfaction surveys

**Portfolio Analytics:**
- Cross-deal performance metrics
- Portfolio-level IRR
- Diversification analysis
- Geographic concentration
- Sector allocation
- Vintage year analysis

### Key Entities

```prisma
model InvestorCapitalAccount {
  id                        Int      @id @default(autoincrement())
  investmentId              Int      @unique @map("investment_id")
  
  // Capital Tracking
  committedCapital          Decimal  @map("committed_capital") @db.Decimal(12, 2)
  calledCapital             Decimal  @default(0) @map("called_capital") @db.Decimal(12, 2)
  uncalledCapital           Decimal  @map("uncalled_capital") @db.Decimal(12, 2)
  
  // Distributions
  returnOfCapital           Decimal  @default(0) @map("return_of_capital") @db.Decimal(12, 2)
  preferredReturnPaid       Decimal  @default(0) @map("preferred_return_paid") @db.Decimal(12, 2)
  profitDistributions       Decimal  @default(0) @map("profit_distributions") @db.Decimal(12, 2)
  totalDistributions        Decimal  @default(0) @map("total_distributions") @db.Decimal(12, 2)
  
  // Current Position
  currentCapitalBalance     Decimal  @map("current_capital_balance") @db.Decimal(12, 2)
  unrealizedGain            Decimal  @default(0) @map("unrealized_gain") @db.Decimal(12, 2)
  
  // Returns
  totalValueMultiple        Decimal? @map("total_value_multiple") @db.Decimal(5, 2) // TVPI
  distributionMultiple      Decimal? @map("distribution_multiple") @db.Decimal(5, 2) // DPI
  residualValueMultiple     Decimal? @map("residual_value_multiple") @db.Decimal(5, 2) // RVPI
  
  // Tax Tracking
  taxBasis                  Decimal  @map("tax_basis") @db.Decimal(12, 2)
  taxableIncome YTD         Decimal  @default(0) @map("taxable_income_ytd") @db.Decimal(12, 2)
  
  lastCalculatedAt          DateTime @default(now()) @map("last_calculated_at")
  createdAt                 DateTime @default(now()) @map("created_at")
  updatedAt                 DateTime @updatedAt @map("updated_at")
  
  // Relations
  investment                Investment @relation(fields: [investmentId], references: [id])
  
  @@index([investmentId])
  @@map("investor_capital_accounts")
}

model InvestorReport {
  id                Int      @id @default(autoincrement())
  offeringId        Int      @map("offering_id")
  
  // Report Period
  reportPeriod      DateTime @map("report_period") // Quarter/year end date
  reportType        String   @map("report_type") // QUARTERLY, ANNUAL
  
  // Performance Summary
  periodReturn      Decimal? @map("period_return") @db.Decimal(5, 2) // %
  inceptionIRR      Decimal? @map("inception_irr") @db.Decimal(5, 2)
  
  // Property Updates
  propertyUpdates   Json     @map("property_updates") // [{property_name, update}]
  
  // Financials
  noiSummary        Json     @map("noi_summary")
  occupancySummary  Json     @map("occupancy_summary")
  
  // Market Commentary
  marketCommentary  String?  @map("market_commentary") @db.Text
  
  // Report Document
  reportDocumentUrl String   @map("report_document_url")
  
  // Distribution
  sentToInvestors   Boolean  @default(false) @map("sent_to_investors")
  sentAt            DateTime? @map("sent_at")
  
  createdBy         Int      @map("created_by")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  
  // Relations
  offering          Offering @relation(fields: [offeringId], references: [id])
  creator           User     @relation(fields: [createdBy], references: [id])
  
  @@unique([offeringId, reportPeriod])
  @@index([offeringId])
  @@map("investor_reports")
}

model InvestorCommunication {
  id                Int      @id @default(autoincrement())
  offeringId        Int?     @map("offering_id") // Null if platform-wide
  
  // Communication Details
  communicationType String   @map("communication_type") // EMAIL, ANNOUNCEMENT, ALERT
  subject           String
  message           String   @db.Text
  
  // Targeting
  recipientFilter   Json?    @map("recipient_filter") // {accreditation_status, investment_size, etc}
  
  // Delivery
  scheduledSendTime DateTime? @map("scheduled_send_time")
  sentAt            DateTime? @map("sent_at")
  recipientCount    Int?     @map("recipient_count")
  
  // Attachments
  attachmentUrls    String[] @map("attachment_urls")
  
  // Author
  authorId          Int      @map("author_id")
  
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  
  // Relations
  offering          Offering? @relation(fields: [offeringId], references: [id])
  author            User     @relation(fields: [authorId], references: [id])
  
  @@index([offeringId])
  @@index([sentAt])
  @@map("investor_communications")
}

enum EventType {
  ANNUAL_MEETING
  PROPERTY_TOUR
  WEBINAR
  INVESTOR_CALL
  DISPOSITION_UPDATE
  OTHER
}

model InvestorEvent {
  id                Int       @id @default(autoincrement())
  offeringId        Int?      @map("offering_id")
  
  // Event Details
  eventType         EventType @map("event_type")
  title             String
  description       String    @db.Text
  
  // Schedule
  eventDate         DateTime  @map("event_date")
  duration Minutes   Int?     @map("duration_minutes")
  
  // Location/Link
  location          String?
  virtualMeetingUrl String?   @map("virtual_meeting_url")
  
  // RSVP
  rsvpRequired      Boolean   @default(false) @map("rsvp_required")
  rsvpDeadline      DateTime? @map("rsvp_deadline")
  maxAttendees      Int?      @map("max_attendees")
  
  // Materials
  agendaUrl         String?   @map("agenda_url")
  materialsUrl      String?   @map("materials_url")
  recordingUrl      String?   @map("recording_url")
  
  createdBy         Int       @map("created_by")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  
  // Relations
  offering          Offering? @relation(fields: [offeringId], references: [id])
  creator           User      @relation(fields: [createdBy], references: [id])
  rsvps             EventRSVP[]
  
  @@index([offeringId])
  @@index([eventDate])
  @@map("investor_events")
}

model EventRSVP {
  id                Int      @id @default(autoincrement())
  eventId           Int      @map("event_id")
  investorId        Int      @map("investor_id")
  
  // Response
  attending         Boolean
  guestCount        Int      @default(1) @map("guest_count")
  dietaryNeeds      String?  @map("dietary_needs")
  
  respondedAt       DateTime @default(now()) @map("responded_at")
  
  // Relations
  event             InvestorEvent @relation(fields: [eventId], references: [id], onDelete: Cascade)
  investor          Investor @relation(fields: [investorId], references: [id])
  
  @@unique([eventId, investorId])
  @@index([eventId])
  @@map("event_rsvps")
}
```

---

## Sub-Module 9.3: Exit Strategy & Disposition

### Purpose
Manage property sales and investor exits

### Features

**Disposition Planning:**
- Market timing analysis
- Valuation modeling
- Broker selection
- Marketing strategy
- Buyer qualification

**Sale Process Management:**
- Listing agreement tracking
- Marketing activity log
- Showing coordination
- Offer management
- LOI negotiation
- Due diligence coordination
- Closing checklist

**Exit Distributions:**
- Sale proceeds calculation
- Waterfall distribution modeling
- Tax impact analysis
- Distribution scheduling
- Closing statement reconciliation

**Performance Analysis:**
- Realized vs projected returns
- IRR calculation
- Equity multiple calculation
- Post-mortem analysis
- Lessons learned documentation

### Key Entities

```prisma
enum DispositionStatus {
  PLANNING
  BROKER_SELECTION
  LISTED
  UNDER_CONTRACT
  DUE_DILIGENCE
  CLOSING
  SOLD
  CANCELLED
}

model Disposition {
  id                    Int                @id @default(autoincrement())
  assetId               Int                @unique @map("asset_id")
  
  // Listing Details
  listPrice             Decimal            @map("list_price") @db.Decimal(12, 2)
  listDate              DateTime?          @map("list_date")
  
  // Broker
  brokerCompany         String?            @map("broker_company")
  brokerContact         String?            @map("broker_contact")
  brokerCommission      Decimal?           @map("broker_commission") @db.Decimal(5, 2) // %
  
  // Marketing
  marketingBudget       Decimal?           @map("marketing_budget") @db.Decimal(10, 2)
  marketingMaterials    String[]           @map("marketing_materials")
  
  // Status
  status                DispositionStatus  @default(PLANNING)
  
  // Best Offer
  bestOfferAmount       Decimal?           @map("best_offer_amount") @db.Decimal(12, 2)
  bestOfferDate         DateTime?          @map("best_offer_date")
  
  // Contract
  contractPrice         Decimal?           @map("contract_price") @db.Decimal(12, 2)
  contractDate          DateTime?          @map("contract_date")
  dueDiligenceDeadline  DateTime?          @map("due_diligence_deadline")
  closingDate           DateTime?          @map("closing_date")
  
  // Buyer
  buyerName             String?            @map("buyer_name")
  buyerType             String?            @map("buyer_type") // INDIVIDUAL, INSTITUTION, REIT
  
  // Closing
  actualSalePrice       Decimal?           @map("actual_sale_price") @db.Decimal(12, 2)
  actualCloseDate       DateTime?          @map("actual_close_date")
  closingCosts          Decimal?           @map("closing_costs") @db.Decimal(12, 2)
  netProceeds           Decimal?           @map("net_proceeds") @db.Decimal(12, 2)
  
  createdAt             DateTime           @default(now()) @map("created_at")
  updatedAt             DateTime           @updatedAt @map("updated_at")
  
  // Relations
  asset                 Asset              @relation(fields: [assetId], references: [id])
  offers                DispositionOffer[]
  
  @@index([status])
  @@map("dispositions")
}

model DispositionOffer {
  id                Int         @id @default(autoincrement())
  dispositionId     Int         @map("disposition_id")
  
  // Offer Details
  offerAmount       Decimal     @map("offer_amount") @db.Decimal(12, 2)
  offerDate         DateTime    @map("offer_date")
  expirationDate    DateTime?   @map("expiration_date")
  
  // Buyer
  buyerName         String      @map("buyer_name")
  buyerContact      String?     @map("buyer_contact")
  
  // Terms
  financing         String?     // CASH, CONVENTIONAL, etc.
  contingencies     Json?       // {inspection, financing, appraisal}
  closingTimeline   Int?        @map("closing_timeline") // Days
  
  // Status
  offerStatus       String      @map("offer_status") // SUBMITTED, COUNTERED, ACCEPTED, REJECTED
  
  // Response
  counterOffer      Decimal?    @map("counter_offer") @db.Decimal(12, 2)
  counterDate       DateTime?   @map("counter_date")
  
  // Documents
  offerDocumentUrl  String?     @map("offer_document_url")
  
  // Notes
  notes             String?     @db.Text
  
  createdAt         DateTime    @default(now()) @map("created_at")
  updatedAt         DateTime    @updatedAt @map("updated_at")
  
  // Relations
  disposition       Disposition @relation(fields: [dispositionId], references: [id], onDelete: Cascade)
  
  @@index([dispositionId])
  @@map("disposition_offers")
}

model ExitAnalysis {
  id                    Int      @id @default(autoincrement())
  dispositionId         Int      @unique @map("disposition_id")
  
  // Investment Summary
  totalInvested         Decimal  @map("total_invested") @db.Decimal(12, 2)
  totalDistributions    Decimal  @map("total_distributions") @db.Decimal(12, 2)
  exitProceeds          Decimal  @map("exit_proceeds") @db.Decimal(12, 2)
  
  // Returns
  realizedIRR           Decimal  @map("realized_irr") @db.Decimal(5, 2) // %
  equityMultiple        Decimal  @map("equity_multiple") @db.Decimal(4, 2)
  cashOnCashReturn      Decimal  @map("cash_on_cash_return") @db.Decimal(5, 2)
  
  // vs Projections
  projectedIRR          Decimal  @map("projected_irr") @db.Decimal(5, 2)
  irrVariance           Decimal  @map("irr_variance") @db.Decimal(5, 2)
  projectedEquityMultiple Decimal @map("projected_equity_multiple") @db.Decimal(4, 2)
  equityMultipleVariance Decimal @map("equity_multiple_variance") @db.Decimal(4, 2)
  
  // Hold Period
  acquisitionDate       DateTime @map("acquisition_date")
  saleDate              DateTime @map("sale_date")
  holdPeriodDays        Int      @map("hold_period_days")
  
  // Value Creation
  acquisitionPrice      Decimal  @map("acquisition_price") @db.Decimal(12, 2)
  renovationCosts       Decimal  @map("renovation_costs") @db.Decimal(12, 2)
  salePrice             Decimal  @map("sale_price") @db.Decimal(12, 2)
  valueAdded            Decimal  @map("value_added") @db.Decimal(12, 2)
  
  // Post-Mortem
  successFactors        Json?    @map("success_factors")
  challenges            Json?    
  lessonsLearned        String?  @map("lessons_learned") @db.Text
  
  analyzedBy            Int      @map("analyzed_by")
  analyzedAt            DateTime @default(now()) @map("analyzed_at")
  
  // Relations
  disposition           Disposition @relation(fields: [dispositionId], references: [id])
  analyzer              User     @relation(fields: [analyzedBy], references: [id])
  
  @@map("exit_analyses")
}
```

---

## API Endpoints

### Asset Operations

```typescript
// Assets
GET    /api/v1/assets                          // List all assets
GET    /api/v1/assets/:id                      // Get asset details
PUT    /api/v1/assets/:id                      // Update asset
GET    /api/v1/assets/:id/performance          // Performance metrics

// Units
GET    /api/v1/assets/:id/units                // List units
POST   /api/v1/assets/:id/units                // Create unit
PUT    /api/v1/units/:id                       // Update unit
GET    /api/v1/units/:id/availability          // Check availability

// Leases
GET    /api/v1/assets/:id/leases               // List leases
POST   /api/v1/assets/:id/leases               // Create lease
PUT    /api/v1/leases/:id                      // Update lease
GET    /api/v1/leases/:id/expiring             // Expiring leases
POST   /api/v1/leases/:id/renew                // Process renewal

// Rent Payments
GET    /api/v1/leases/:id/payments             // Payment history
POST   /api/v1/leases/:id/payments             // Record payment
GET    /api/v1/assets/:id/delinquencies        // Delinquent tenants

// Maintenance
GET    /api/v1/assets/:id/maintenance          // Maintenance requests
POST   /api/v1/assets/:id/maintenance          // Create request
PUT    /api/v1/maintenance/:id                 // Update request
POST   /api/v1/maintenance/:id/assign          // Assign to vendor

// Capital Projects
GET    /api/v1/assets/:id/capital-projects     // List projects
POST   /api/v1/assets/:id/capital-projects     // Create project
PUT    /api/v1/capital-projects/:id            // Update project
POST   /api/v1/capital-projects/:id/approve    // Approve project

// Operating Statements
GET    /api/v1/assets/:id/operating-statements // Financial statements
POST   /api/v1/assets/:id/operating-statements // Import statement
GET    /api/v1/assets/:id/noi-trend            // NOI trend analysis
```

### Fund Management

```typescript
// Investor Capital Accounts
GET    /api/v1/investments/:id/capital-account // Capital account details
GET    /api/v1/offerings/:id/capital-accounts  // All investor accounts
POST   /api/v1/capital-accounts/recalculate    // Recalculate balances

// Investor Reports
GET    /api/v1/offerings/:id/reports           // List reports
POST   /api/v1/offerings/:id/reports           // Generate report
POST   /api/v1/reports/:id/distribute          // Send to investors

// Communications
GET    /api/v1/communications                  // List communications
POST   /api/v1/communications                  // Create communication
POST   /api/v1/communications/:id/send         // Send communication

// Events
GET    /api/v1/events                          // List events
POST   /api/v1/events                          // Create event
POST   /api/v1/events/:id/rsvp                 // RSVP to event
GET    /api/v1/events/:id/attendees            // Get attendee list
```

### Disposition

```typescript
// Dispositions
GET    /api/v1/assets/:id/disposition          // Disposition details
POST   /api/v1/assets/:id/disposition          // Initiate disposition
PUT    /api/v1/dispositions/:id                // Update status

// Offers
GET    /api/v1/dispositions/:id/offers         // List offers
POST   /api/v1/dispositions/:id/offers         // Record offer
POST   /api/v1/offers/:id/counter              // Counter offer
POST   /api/v1/offers/:id/accept               // Accept offer

// Exit Analysis
GET    /api/v1/dispositions/:id/exit-analysis  // Exit analysis
POST   /api/v1/dispositions/:id/exit-analysis  // Create analysis
```

---

## Integration with Existing Modules

### Finance Module Integration
- Operating income flows to distribution calculations
- Capital project costs tracked for investor reporting
- Exit proceeds trigger final distribution waterfall

### Construction Module Integration
- Capital projects link to construction tasks
- Renovation work tracked in both systems
- Draw requests for capital improvements

### Compliance Module Integration
- Investor communications require compliance approval
- Distribution calculations verified against waterfall rules
- Tax reporting compliance checks

---

## Reporting Dashboards

### Sponsor Asset Management Dashboard
- Portfolio overview (all assets)
- Occupancy trends
- NOI performance vs budget
- Upcoming lease expirations
- Maintenance backlog
- Capital project status

### Investor Portfolio Dashboard
- All investments summary
- Total returns (realized + unrealized)
- Distribution history
- Upcoming distributions
- Tax document center
- Property updates feed

---

## Implementation Priority

**Phase 1 (Weeks 1-4):** Asset Setup
- Asset and unit database
- Operating statement import
- Basic performance tracking

**Phase 2 (Weeks 5-8):** Lease Management
- Lease database
- Rent roll integration
- Payment tracking
- Expiration calendar

**Phase 3 (Weeks 9-12):** Maintenance & CapEx
- Maintenance request system
- Vendor management
- Capital project tracking

**Phase 4 (Weeks 13-16):** Investor Relations
- Capital account tracking
- Investor reporting
- Communication tools

**Phase 5 (Weeks 17-20):** Disposition
- Disposition workflow
- Exit analysis
- Final distributions

---

## Success Metrics

**Asset Performance:**
- Portfolio-wide occupancy > 95%
- NOI variance within 5% of budget
- Tenant satisfaction score > 4.0/5.0

**Investor Relations:**
- Quarterly reports sent on time (100%)
- Investor inquiry response time < 24 hours
- Investor retention rate > 80%

**Operational Efficiency:**
- Maintenance request resolution time < 72 hours
- Lease renewal rate > 70%
- On-time rent collection > 95%

---

**END OF ASSET & FUND MANAGEMENT MODULE**

This module completes the RealCo platform by managing the critical hold period between acquisition and exit, ensuring strong asset performance, investor satisfaction, and successful exits.
