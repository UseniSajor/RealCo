# RealCo Platform - Kealee m-os-pm Module Integration Plan

## Overview

This document outlines the integration of the **m-os-pm (Module Operating System - Project Management)** from Kealee Platform V10 into the RealCo real estate syndication platform. This integration brings enterprise-grade construction project management capabilities to RealCo's development projects.

**Integration Goals:**
1. Leverage proven Kealee construction management workflows
2. Maintain RealCo's compliance-first architecture
3. Preserve audit trail requirements for investor reporting
4. Enable seamless handoff from deal closing to construction
5. Provide real-time construction updates to investors

---

## m-os-pm Module Capabilities

Based on Kealee Platform V10 architecture, the m-os-pm module provides:

### Core Features
- **Project Planning:** Work breakdown structure, task dependencies, critical path
- **Schedule Management:** Gantt charts, milestone tracking, baseline comparison
- **Resource Management:** Labor, materials, equipment allocation
- **Cost Tracking:** Budget vs actual, change orders, cost forecasting
- **Document Management:** Plans, specs, RFIs, submittals, closeout docs
- **Quality Control:** Inspections, punch lists, deficiency tracking
- **Safety Management:** Safety plans, incident reporting, compliance
- **Progress Tracking:** Daily logs, photo documentation, percent complete
- **Subcontractor Management:** Contracts, insurance, compliance, payments
- **Owner/Stakeholder Portal:** Progress visibility, approval workflows

### Technical Architecture (Kealee V10)
- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express/Fastify
- **Database:** PostgreSQL with Prisma ORM
- **File Storage:** S3-compatible storage
- **Real-time:** WebSocket for live updates
- **Mobile:** Progressive Web App (PWA)

---

## Integration Architecture

### High-Level Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      RealCo Platform                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │   Deal Flow  │───▶│  Closing     │───▶│ Construction │    │
│  │   (Offering) │    │  (Funded)    │    │  Handoff     │    │
│  └──────────────┘    └──────────────┘    └──────┬───────┘    │
│                                                   │             │
│                                                   ▼             │
│         ┌─────────────────────────────────────────────┐        │
│         │    m-os-pm Module (Kealee Integration)      │        │
│         ├─────────────────────────────────────────────┤        │
│         │                                             │        │
│         │  • Project Setup & Planning                 │        │
│         │  • Task & Schedule Management               │        │
│         │  • Budget & Cost Tracking                   │        │
│         │  • Draw Requests → RealCo Payments          │        │
│         │  • Progress Reporting → Investor Updates    │        │
│         │  • Document Management                      │        │
│         │  • Subcontractor Portal                     │        │
│         │  • Quality & Safety Tracking                │        │
│         │                                             │        │
│         └─────────────────────────────────────────────┘        │
│                          │                                      │
│              ┌───────────┴──────────┬──────────────┐           │
│              ▼                      ▼              ▼           │
│      ┌──────────────┐      ┌──────────────┐  ┌─────────┐     │
│      │   Investor   │      │  Compliance  │  │  Audit  │     │
│      │   Updates    │      │   Engine     │  │  Events │     │
│      └──────────────┘      └──────────────┘  └─────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Integration

### New Tables for m-os-pm Module

Add these tables to RealCo's Prisma schema:

```prisma
// ============================================================================
// CONSTRUCTION PROJECT MANAGEMENT (m-os-pm Integration)
// ============================================================================

enum ProjectPhase {
  PRE_CONSTRUCTION
  MOBILIZATION
  FOUNDATION
  FRAMING
  MEP_ROUGH_IN
  INSULATION_DRYWALL
  FINISHES
  LANDSCAPING
  PUNCH_LIST
  CLOSEOUT
  COMPLETE
}

enum TaskStatus {
  NOT_STARTED
  IN_PROGRESS
  ON_HOLD
  BLOCKED
  COMPLETED
  CANCELLED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

model Project {
  id                    Int                @id @default(autoincrement())
  developmentProjectId  Int                @unique @map("development_project_id")
  projectCode           String             @unique @map("project_code")
  projectPhase          ProjectPhase       @map("project_phase") @default(PRE_CONSTRUCTION)
  
  // Schedule
  plannedStartDate      DateTime?          @map("planned_start_date")
  actualStartDate       DateTime?          @map("actual_start_date")
  plannedEndDate        DateTime?          @map("planned_end_date")
  forecastEndDate       DateTime?          @map("forecast_end_date")
  actualEndDate         DateTime?          @map("actual_end_date")
  
  // Progress
  overallProgress       Float              @default(0) @map("overall_progress") // 0-100
  scheduleVariance      Int?               @map("schedule_variance") // days ahead/behind
  costVariance          Decimal?           @map("cost_variance") @db.Decimal(12, 2)
  
  // Configuration
  workingDaysPerWeek    Int                @default(5) @map("working_days_per_week")
  hoursPerDay           Float              @default(8) @map("hours_per_day")
  
  createdAt             DateTime           @default(now()) @map("created_at")
  updatedAt             DateTime           @updatedAt @map("updated_at")
  
  // Relations
  developmentProject    DevelopmentProject @relation(fields: [developmentProjectId], references: [id], onDelete: Cascade)
  tasks                 Task[]
  milestones            Milestone[]
  dailyLogs             DailyLog[]
  rfi                   RFI[]
  submittals            Submittal[]
  inspections           Inspection[]
  safetyIncidents       SafetyIncident[]
  
  @@map("projects")
}

model Task {
  id                Int          @id @default(autoincrement())
  projectId         Int          @map("project_id")
  parentTaskId      Int?         @map("parent_task_id")
  
  // Task Details
  taskCode          String       @map("task_code")
  taskName          String       @map("task_name")
  description       String?      @db.Text
  phase             ProjectPhase
  
  // Assignment
  assignedToId      Int?         @map("assigned_to_id")
  contractorId      Int?         @map("contractor_id")
  
  // Schedule
  plannedStartDate  DateTime?    @map("planned_start_date")
  plannedEndDate    DateTime?    @map("planned_end_date")
  actualStartDate   DateTime?    @map("actual_start_date")
  actualEndDate     DateTime?    @map("actual_end_date")
  duration          Int?         // working days
  
  // Dependencies
  predecessorTaskIds Int[]       @map("predecessor_task_ids")
  lagDays           Int          @default(0) @map("lag_days")
  
  // Status
  status            TaskStatus   @default(NOT_STARTED)
  priority          TaskPriority @default(MEDIUM)
  percentComplete   Float        @default(0) @map("percent_complete")
  
  // Resources
  budgetedHours     Float?       @map("budgeted_hours")
  actualHours       Float?       @map("actual_hours")
  budgetedCost      Decimal?     @map("budgeted_cost") @db.Decimal(12, 2)
  actualCost        Decimal?     @map("actual_cost") @db.Decimal(12, 2)
  
  // Flags
  isMilestone       Boolean      @default(false) @map("is_milestone")
  isCriticalPath    Boolean      @default(false) @map("is_critical_path")
  
  createdAt         DateTime     @default(now()) @map("created_at")
  updatedAt         DateTime     @updatedAt @map("updated_at")
  
  // Relations
  project           Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignedTo        User?        @relation(fields: [assignedToId], references: [id])
  contractor        Contractor?  @relation(fields: [contractorId], references: [id])
  parentTask        Task?        @relation("TaskHierarchy", fields: [parentTaskId], references: [id])
  subtasks          Task[]       @relation("TaskHierarchy")
  
  @@index([projectId])
  @@index([status])
  @@index([assignedToId])
  @@map("tasks")
}

model Milestone {
  id              Int          @id @default(autoincrement())
  projectId       Int          @map("project_id")
  milestoneName   String       @map("milestone_name")
  description     String?      @db.Text
  phase           ProjectPhase
  plannedDate     DateTime     @map("planned_date")
  actualDate      DateTime?    @map("actual_date")
  isCompleted     Boolean      @default(false) @map("is_completed")
  completedBy     Int?         @map("completed_by")
  completedAt     DateTime?    @map("completed_at")
  createdAt       DateTime     @default(now()) @map("created_at")
  updatedAt       DateTime     @updatedAt @map("updated_at")
  
  // Relations
  project         Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  completedByUser User?        @relation(fields: [completedBy], references: [id])
  
  @@index([projectId])
  @@map("milestones")
}

enum WeatherCondition {
  CLEAR
  PARTLY_CLOUDY
  CLOUDY
  RAIN
  HEAVY_RAIN
  SNOW
  EXTREME_HEAT
  EXTREME_COLD
}

model DailyLog {
  id                  Int              @id @default(autoincrement())
  projectId           Int              @map("project_id")
  logDate             DateTime         @map("log_date") @db.Date
  createdBy           Int              @map("created_by")
  
  // Work Summary
  workPerformed       String           @map("work_performed") @db.Text
  areasWorked         String[]         @map("areas_worked")
  
  // Labor
  laborSummary        Json?            @map("labor_summary") // {contractor_id, workers_count, hours}
  totalWorkers        Int              @default(0) @map("total_workers")
  totalLaborHours     Float            @default(0) @map("total_labor_hours")
  
  // Equipment
  equipmentUsed       Json?            @map("equipment_used") // {equipment_name, hours_used}
  
  // Materials
  materialsDelivered  Json?            @map("materials_delivered")
  materialsUsed       Json?            @map("materials_used")
  
  // Site Conditions
  weatherCondition    WeatherCondition @map("weather_condition")
  temperature         Int?             // Fahrenheit
  weatherDelay        Boolean          @default(false) @map("weather_delay")
  weatherDelayHours   Float?           @map("weather_delay_hours")
  
  // Visitors
  visitorsOnSite      Json?            @map("visitors_on_site") // {name, company, purpose}
  
  // Issues
  issues              String?          @db.Text
  safetyIncidents     Boolean          @default(false) @map("safety_incidents")
  
  // Progress Photos
  photoUrls           String[]         @map("photo_urls")
  
  createdAt           DateTime         @default(now()) @map("created_at")
  updatedAt           DateTime         @updatedAt @map("updated_at")
  
  // Relations
  project             Project          @relation(fields: [projectId], references: [id], onDelete: Cascade)
  creator             User             @relation(fields: [createdBy], references: [id])
  
  @@unique([projectId, logDate])
  @@index([projectId])
  @@index([logDate])
  @@map("daily_logs")
}

enum RFIStatus {
  OPEN
  PENDING_RESPONSE
  ANSWERED
  CLOSED
  CANCELLED
}

enum RFIPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model RFI {
  id              Int         @id @default(autoincrement())
  projectId       Int         @map("project_id")
  rfiNumber       String      @map("rfi_number")
  
  // Details
  subject         String
  description     String      @db.Text
  priority        RFIPriority @default(MEDIUM)
  
  // Assignment
  submittedBy     Int         @map("submitted_by")
  assignedTo      Int         @map("assigned_to")
  
  // References
  drawingReferences String[]  @map("drawing_references")
  specReferences  String[]    @map("spec_references")
  attachments     Json?       // [{url, filename, type}]
  
  // Response
  response        String?     @db.Text
  respondedBy     Int?        @map("responded_by")
  respondedAt     DateTime?   @map("responded_at")
  
  // Status
  status          RFIStatus   @default(OPEN)
  dueDate         DateTime?   @map("due_date")
  
  // Impact
  impactsSchedule Boolean     @default(false) @map("impacts_schedule")
  impactsCost     Boolean     @default(false) @map("impacts_cost")
  
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")
  
  // Relations
  project         Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  submitter       User        @relation("RFISubmitter", fields: [submittedBy], references: [id])
  assignee        User        @relation("RFIAssignee", fields: [assignedTo], references: [id])
  responder       User?       @relation("RFIResponder", fields: [respondedBy], references: [id])
  
  @@unique([projectId, rfiNumber])
  @@index([projectId])
  @@index([status])
  @@map("rfi")
}

enum SubmittalStatus {
  NOT_SUBMITTED
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  APPROVED_AS_NOTED
  REJECTED
  RESUBMIT
}

model Submittal {
  id                Int             @id @default(autoincrement())
  projectId         Int             @map("project_id")
  submittalNumber   String          @map("submittal_number")
  
  // Details
  title             String
  specSection       String          @map("spec_section")
  description       String?         @db.Text
  
  // Submission
  submittedBy       Int             @map("submitted_by")
  submittedDate     DateTime?       @map("submitted_date")
  
  // Review
  reviewedBy        Int?            @map("reviewed_by")
  reviewedDate      DateTime?       @map("reviewed_date")
  
  // Status
  status            SubmittalStatus @default(NOT_SUBMITTED)
  revisionNumber    Int             @default(0) @map("revision_number")
  
  // Documents
  submittalFiles    Json?           @map("submittal_files") // [{url, filename, revision}]
  reviewComments    String?         @map("review_comments") @db.Text
  
  // Dates
  requiredDate      DateTime?       @map("required_date")
  leadTime          Int?            @map("lead_time") // days
  
  createdAt         DateTime        @default(now()) @map("created_at")
  updatedAt         DateTime        @updatedAt @map("updated_at")
  
  // Relations
  project           Project         @relation(fields: [projectId], references: [id], onDelete: Cascade)
  submitter         User            @relation("SubmittalSubmitter", fields: [submittedBy], references: [id])
  reviewer          User?           @relation("SubmittalReviewer", fields: [reviewedBy], references: [id])
  
  @@unique([projectId, submittalNumber])
  @@index([projectId])
  @@index([status])
  @@map("submittals")
}

enum InspectionType {
  FOOTING
  FOUNDATION
  FRAMING
  ROUGH_PLUMBING
  ROUGH_ELECTRICAL
  ROUGH_MECHANICAL
  INSULATION
  DRYWALL
  FINAL_PLUMBING
  FINAL_ELECTRICAL
  FINAL_MECHANICAL
  FINAL_BUILDING
  FIRE_SAFETY
  OCCUPANCY
  OTHER
}

enum InspectionResult {
  SCHEDULED
  PASSED
  PASSED_WITH_CONDITIONS
  FAILED
  CANCELLED
}

model Inspection {
  id              Int              @id @default(autoincrement())
  projectId       Int              @map("project_id")
  inspectionType  InspectionType   @map("inspection_type")
  
  // Schedule
  scheduledDate   DateTime         @map("scheduled_date")
  inspector       String?
  inspectorPhone  String?          @map("inspector_phone")
  
  // Results
  inspectionDate  DateTime?        @map("inspection_date")
  result          InspectionResult @default(SCHEDULED)
  findings        String?          @db.Text
  deficiencies    Json?            // [{item, description, resolution_required}]
  
  // Follow-up
  reinspectionRequired Boolean     @default(false) @map("reinspection_required")
  reinspectionDate     DateTime?   @map("reinspection_date")
  
  // Documents
  reportUrl       String?          @map("report_url")
  photoUrls       String[]         @map("photo_urls")
  
  // Tracking
  requestedBy     Int              @map("requested_by")
  createdAt       DateTime         @default(now()) @map("created_at")
  updatedAt       DateTime         @updatedAt @map("updated_at")
  
  // Relations
  project         Project          @relation(fields: [projectId], references: [id], onDelete: Cascade)
  requester       User             @relation(fields: [requestedBy], references: [id])
  
  @@index([projectId])
  @@index([inspectionType])
  @@map("inspections")
}

enum IncidentSeverity {
  NEAR_MISS
  FIRST_AID
  MEDICAL_TREATMENT
  LOST_TIME
  FATALITY
}

model SafetyIncident {
  id                  Int              @id @default(autoincrement())
  projectId           Int              @map("project_id")
  
  // Incident Details
  incidentDate        DateTime         @map("incident_date")
  incidentTime        String?          @map("incident_time")
  location            String
  severity            IncidentSeverity
  
  // People Involved
  injuredPerson       String?          @map("injured_person")
  injuredCompany      String?          @map("injured_company")
  witnesses           Json?            // [{name, company, contact}]
  
  // Description
  description         String           @db.Text
  immediateAction     String?          @map("immediate_action") @db.Text
  rootCause           String?          @map("root_cause") @db.Text
  correctiveActions   String?          @map("corrective_actions") @db.Text
  
  // Medical
  medicalTreatment    String?          @map("medical_treatment")
  hospitalName        String?          @map("hospital_name")
  
  // Reporting
  reportedBy          Int              @map("reported_by")
  reportedToOSHA      Boolean          @default(false) @map("reported_to_osha")
  oshaReportDate      DateTime?        @map("osha_report_date")
  
  // Investigation
  investigatedBy      Int?             @map("investigated_by")
  investigationDate   DateTime?        @map("investigation_date")
  investigationReport String?          @map("investigation_report") @db.Text
  
  // Documents
  photoUrls           String[]         @map("photo_urls")
  documentUrls        String[]         @map("document_urls")
  
  // Follow-up
  preventativeMeasures String?         @map("preventative_measures") @db.Text
  closedDate          DateTime?        @map("closed_date")
  closedBy            Int?             @map("closed_by")
  
  createdAt           DateTime         @default(now()) @map("created_at")
  updatedAt           DateTime         @updatedAt @map("updated_at")
  
  // Relations
  project             Project          @relation(fields: [projectId], references: [id], onDelete: Cascade)
  reporter            User             @relation("IncidentReporter", fields: [reportedBy], references: [id])
  investigator        User?            @relation("IncidentInvestigator", fields: [investigatedBy], references: [id])
  closer              User?            @relation("IncidentCloser", fields: [closedBy], references: [id])
  
  @@index([projectId])
  @@index([severity])
  @@map("safety_incidents")
}

// Extend existing models
model DevelopmentProject {
  // ... existing fields ...
  
  // Add relation to m-os-pm
  project  Project?
}

model Contractor {
  // ... existing fields ...
  
  // Add relations to m-os-pm
  tasks    Task[]
}

model DrawRequest {
  // ... existing fields ...
  
  // Add relation to tasks
  taskIds  Int[]  @map("task_ids") // Links draw to completed tasks
}
```

---

## API Integration Points

### Endpoint Mapping: Kealee → RealCo

```typescript
// KEALEE ENDPOINTS                    →  REALCO ENDPOINTS
// ====================================================================

// Project Management
GET  /api/projects                    →  GET  /api/v1/construction/projects
POST /api/projects                    →  POST /api/v1/construction/projects
GET  /api/projects/:id                →  GET  /api/v1/construction/projects/:id
PUT  /api/projects/:id                →  PUT  /api/v1/construction/projects/:id

// Tasks & Schedule
GET  /api/projects/:id/tasks          →  GET  /api/v1/construction/projects/:id/tasks
POST /api/projects/:id/tasks          →  POST /api/v1/construction/projects/:id/tasks
PUT  /api/tasks/:id                   →  PUT  /api/v1/construction/tasks/:id
GET  /api/projects/:id/gantt          →  GET  /api/v1/construction/projects/:id/gantt

// Daily Logs
GET  /api/projects/:id/daily-logs     →  GET  /api/v1/construction/projects/:id/daily-logs
POST /api/projects/:id/daily-logs     →  POST /api/v1/construction/projects/:id/daily-logs

// RFIs
GET  /api/projects/:id/rfis           →  GET  /api/v1/construction/projects/:id/rfis
POST /api/projects/:id/rfis           →  POST /api/v1/construction/projects/:id/rfis
PUT  /api/rfis/:id/respond            →  PUT  /api/v1/construction/rfis/:id/respond

// Submittals
GET  /api/projects/:id/submittals     →  GET  /api/v1/construction/projects/:id/submittals
POST /api/projects/:id/submittals     →  POST /api/v1/construction/projects/:id/submittals
PUT  /api/submittals/:id/review       →  PUT  /api/v1/construction/submittals/:id/review

// Inspections
GET  /api/projects/:id/inspections    →  GET  /api/v1/construction/projects/:id/inspections
POST /api/projects/:id/inspections    →  POST /api/v1/construction/projects/:id/inspections

// Safety
GET  /api/projects/:id/safety         →  GET  /api/v1/construction/projects/:id/safety-incidents
POST /api/projects/:id/safety         →  POST /api/v1/construction/projects/:id/safety-incidents
```

---

## Critical Integration Points

### 1. Deal → Construction Handoff

When a deal moves from FUNDED → ACTIVE status, automatically create construction project:

```typescript
// backend/src/services/constructionHandoff.ts

import { PrismaClient } from '@prisma/client';
import { runComplianceChecks, createAuditEvent } from '../lib/compliance';

const prisma = new PrismaClient();

export async function initiateConstructionHandoff(
  dealId: number,
  userId: number
): Promise<{ project: any; developmentProject: any }> {
  
  // 1. Get deal and offering details
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { 
      property: true,
      proforma: true,
      offerings: true 
    }
  });
  
  if (!deal) {
    throw new Error('Deal not found');
  }
  
  // 2. Verify deal is funded
  if (deal.status !== 'FUNDED') {
    throw new Error('Deal must be in FUNDED status for construction handoff');
  }
  
  // 3. Compliance check
  const complianceContext = {
    action: 'INITIATE_CONSTRUCTION_HANDOFF',
    entity_type: 'DEAL',
    entity_id: dealId,
    user_id: userId,
    before_state: { status: 'FUNDED' },
    after_state: { status: 'ACTIVE' },
    deal
  };
  
  await runComplianceChecks('INITIATE_CONSTRUCTION_HANDOFF', complianceContext);
  
  // 4. Create development project
  const developmentProject = await prisma.developmentProject.create({
    data: {
      dealId: deal.id,
      projectType: determineProjectType(deal),
      status: 'PLANNING',
      projectManagerId: userId
    }
  });
  
  // 5. Create m-os-pm project
  const project = await prisma.project.create({
    data: {
      developmentProjectId: developmentProject.id,
      projectCode: generateProjectCode(deal),
      projectPhase: 'PRE_CONSTRUCTION',
      plannedStartDate: calculateStartDate(deal),
      plannedEndDate: calculateEndDate(deal),
      workingDaysPerWeek: 5,
      hoursPerDay: 8
    }
  });
  
  // 6. Create initial budget from proforma
  await createInitialBudget(developmentProject.id, deal.proforma);
  
  // 7. Create initial project plan
  await createInitialProjectPlan(project.id, deal);
  
  // 8. Update deal status to ACTIVE
  await prisma.deal.update({
    where: { id: dealId },
    data: { status: 'ACTIVE' }
  });
  
  // 9. Log audit event
  await createAuditEvent('INITIATE_CONSTRUCTION_HANDOFF', {
    ...complianceContext,
    after_state: { 
      status: 'ACTIVE',
      development_project_id: developmentProject.id,
      project_id: project.id
    }
  }, []);
  
  // 10. Notify investors
  await notifyInvestorsConstructionStart(deal.id, project.id);
  
  return { project, developmentProject };
}

function determineProjectType(deal: any): string {
  if (deal.proforma?.renovationBudget > deal.proforma?.purchasePrice * 0.5) {
    return 'RENOVATION';
  } else if (deal.property.propertyType === 'LAND') {
    return 'GROUND_UP';
  } else {
    return 'VALUE_ADD';
  }
}

function generateProjectCode(deal: any): string {
  const prefix = 'RC'; // RealCo
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${year}-${random}`;
}

async function createInitialProjectPlan(projectId: number, deal: any) {
  // Create standard construction phases as milestones
  const phases = [
    { name: 'Site Preparation', phase: 'PRE_CONSTRUCTION', duration: 14 },
    { name: 'Foundation', phase: 'FOUNDATION', duration: 21 },
    { name: 'Framing', phase: 'FRAMING', duration: 30 },
    { name: 'MEP Rough-In', phase: 'MEP_ROUGH_IN', duration: 21 },
    { name: 'Insulation & Drywall', phase: 'INSULATION_DRYWALL', duration: 14 },
    { name: 'Interior Finishes', phase: 'FINISHES', duration: 30 },
    { name: 'Exterior & Landscaping', phase: 'LANDSCAPING', duration: 14 },
    { name: 'Punch List', phase: 'PUNCH_LIST', duration: 7 },
    { name: 'Final Closeout', phase: 'CLOSEOUT', duration: 7 }
  ];
  
  let startDate = new Date();
  
  for (const phase of phases) {
    await prisma.milestone.create({
      data: {
        projectId,
        milestoneName: phase.name,
        phase: phase.phase,
        plannedDate: new Date(startDate.getTime() + phase.duration * 24 * 60 * 60 * 1000)
      }
    });
    
    startDate = new Date(startDate.getTime() + phase.duration * 24 * 60 * 60 * 1000);
  }
}
```

### 2. Draw Requests → Payment Integration

Connect construction draws to RealCo's payment system:

```typescript
// backend/src/services/drawRequestIntegration.ts

export async function submitDrawRequest(
  projectId: number,
  drawData: {
    contractorId: number;
    drawAmount: number;
    completedTaskIds: number[];
    lienWaivers: any[];
    supportingDocs: any[];
  },
  userId: number
): Promise<any> {
  
  // 1. Get project and development project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { developmentProject: true }
  });
  
  // 2. Verify completed tasks
  const tasks = await prisma.task.findMany({
    where: {
      id: { in: drawData.completedTaskIds },
      status: 'COMPLETED'
    }
  });
  
  if (tasks.length !== drawData.completedTaskIds.length) {
    throw new Error('All tasks must be completed for draw request');
  }
  
  // 3. Calculate work completed percentage
  const totalProjectTasks = await prisma.task.count({
    where: { projectId }
  });
  
  const completedTasks = await prisma.task.count({
    where: { projectId, status: 'COMPLETED' }
  });
  
  const workCompletedPct = (completedTasks / totalProjectTasks) * 100;
  
  // 4. Create RealCo draw request (existing table)
  const drawRequest = await prisma.drawRequest.create({
    data: {
      projectId: project.developmentProjectId,
      contractorId: drawData.contractorId,
      drawNumber: await getNextDrawNumber(project.developmentProjectId),
      drawAmount: drawData.drawAmount,
      workCompletedPct,
      supportingDocs: drawData.supportingDocs,
      lienWaivers: drawData.lienWaivers,
      taskIds: drawData.completedTaskIds, // Link to m-os-pm tasks
      status: 'SUBMITTED',
      submittedDate: new Date()
    }
  });
  
  // 5. Compliance check (existing RealCo compliance)
  const complianceContext = {
    action: 'SUBMIT_DRAW_REQUEST',
    entity_type: 'DRAW_REQUEST',
    entity_id: drawRequest.id,
    user_id: userId,
    before_state: {},
    after_state: { status: 'SUBMITTED' },
    draw_request: drawRequest
  };
  
  await runComplianceChecks('SUBMIT_DRAW_REQUEST', complianceContext);
  
  // 6. Update task records with draw request ID
  await prisma.task.updateMany({
    where: { id: { in: drawData.completedTaskIds } },
    data: { 
      actualCost: {
        increment: drawData.drawAmount / drawData.completedTaskIds.length
      }
    }
  });
  
  // 7. Update project progress
  await prisma.project.update({
    where: { id: projectId },
    data: { overallProgress: workCompletedPct }
  });
  
  return drawRequest;
}
```

### 3. Progress Updates → Investor Notifications

Automatically notify investors of construction progress:

```typescript
// backend/src/services/investorUpdates.ts

export async function sendConstructionProgressUpdate(
  projectId: number
): Promise<void> {
  
  // 1. Get project details
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      developmentProject: {
        include: {
          deal: {
            include: {
              offerings: {
                include: {
                  investments: {
                    include: {
                      investor: {
                        include: { user: true }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      milestones: true,
      tasks: true
    }
  });
  
  // 2. Calculate progress metrics
  const metrics = {
    overallProgress: project.overallProgress,
    scheduleVariance: project.scheduleVariance,
    completedMilestones: project.milestones.filter(m => m.isCompleted).length,
    totalMilestones: project.milestones.length,
    activeTasks: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
    completedTasks: project.tasks.filter(t => t.status === 'COMPLETED').length,
    budgetStatus: await calculateBudgetStatus(project.developmentProject.id)
  };
  
  // 3. Get recent activity (past 30 days)
  const recentActivity = await prisma.dailyLog.findMany({
    where: {
      projectId,
      logDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    },
    orderBy: { logDate: 'desc' },
    take: 10
  });
  
  // 4. Get recent photos
  const recentPhotos = recentActivity
    .flatMap(log => log.photoUrls)
    .slice(0, 5);
  
  // 5. Send email to each investor
  const offering = project.developmentProject.deal.offerings[0];
  
  for (const investment of offering.investments) {
    await sendEmail({
      to: investment.investor.user.email,
      template: 'construction-progress-update',
      data: {
        investorName: investment.investor.user.firstName,
        projectName: project.developmentProject.deal.dealName,
        metrics,
        recentActivity: recentActivity.map(log => ({
          date: log.logDate,
          summary: log.workPerformed
        })),
        photos: recentPhotos,
        projectDashboardUrl: `${process.env.FRONTEND_URL}/investor/projects/${projectId}`
      }
    });
  }
  
  // 6. Create notification in platform
  for (const investment of offering.investments) {
    await prisma.notification.create({
      data: {
        userId: investment.investor.userId,
        notificationType: 'CONSTRUCTION_UPDATE',
        title: 'Construction Progress Update',
        message: `${project.developmentProject.deal.dealName} is ${metrics.overallProgress.toFixed(0)}% complete`,
        linkUrl: `/investor/projects/${projectId}`
      }
    });
  }
}

// Scheduled job to run weekly
export async function scheduleWeeklyProgressUpdates() {
  // Get all active construction projects
  const activeProjects = await prisma.project.findMany({
    where: {
      projectPhase: {
        notIn: ['COMPLETE']
      }
    }
  });
  
  for (const project of activeProjects) {
    await sendConstructionProgressUpdate(project.id);
  }
}
```

---

## Frontend Component Integration

### Construction Dashboard for Investors

```typescript
// frontend/src/pages/InvestorConstructionDashboard.tsx

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import apiClient from '../lib/apiClient';

export default function InvestorConstructionDashboard() {
  const { projectId } = useParams();
  
  const { data: project } = useQuery({
    queryKey: ['construction-project', projectId],
    queryFn: () => apiClient.get(`/api/v1/construction/projects/${projectId}`).then(r => r.data)
  });
  
  const { data: milestones } = useQuery({
    queryKey: ['construction-milestones', projectId],
    queryFn: () => apiClient.get(`/api/v1/construction/projects/${projectId}/milestones`).then(r => r.data)
  });
  
  const { data: recentLogs } = useQuery({
    queryKey: ['daily-logs', projectId],
    queryFn: () => apiClient.get(`/api/v1/construction/projects/${projectId}/daily-logs`).then(r => r.data)
  });
  
  if (!project) return <div>Loading...</div>;
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{project.dealName} - Construction Progress</h1>
      
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Overall Progress" 
          value={`${project.overallProgress.toFixed(0)}%`}
          trend={project.scheduleVariance > 0 ? 'ahead' : 'behind'}
        />
        <MetricCard 
          title="Schedule Status" 
          value={`${Math.abs(project.scheduleVariance)} days`}
          subtitle={project.scheduleVariance > 0 ? 'Ahead of Schedule' : 'Behind Schedule'}
        />
        <MetricCard 
          title="Budget Status" 
          value="On Track"
          subtitle="Within 2% of budget"
        />
        <MetricCard 
          title="Current Phase" 
          value={formatPhase(project.projectPhase)}
        />
      </div>
      
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Construction Timeline</h2>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                In Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {project.overallProgress.toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div 
              style={{ width: `${project.overallProgress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
            />
          </div>
        </div>
      </div>
      
      {/* Milestones */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Key Milestones</h2>
        <div className="space-y-4">
          {milestones?.map((milestone: any) => (
            <MilestoneItem key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentLogs?.map((log: any) => (
            <DailyLogSummary key={log.id} log={log} />
          ))}
        </div>
      </div>
      
      {/* Photo Gallery */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Progress Photos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentLogs?.flatMap((log: any) => log.photoUrls).slice(0, 8).map((url: string, idx: number) => (
            <img key={idx} src={url} alt="Progress" className="rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Migration Strategy

### Phase 1: Database Migration (Week 1)

1. **Add m-os-pm tables to RealCo schema**
   ```bash
   # Add new tables to schema.prisma
   npx prisma migrate dev --name add_m_os_pm_module
   npx prisma generate
   ```

2. **Test schema locally**
   ```bash
   npx prisma studio
   # Verify all tables created correctly
   ```

### Phase 2: Backend API Migration (Week 2-3)

1. **Copy m-os-pm service layer from Kealee**
   ```
   kealee-platform-v10/backend/src/services/
     ├── project.service.ts        → realco/backend/src/services/construction/
     ├── task.service.ts
     ├── dailyLog.service.ts
     ├── rfi.service.ts
     └── submittal.service.ts
   ```

2. **Adapt services for RealCo compliance**
   - Wrap all state changes with `runComplianceChecks()`
   - Add audit event logging
   - Connect to RealCo's user/auth system

3. **Create new API routes**
   ```typescript
   // backend/src/routes/construction.ts
   import { projectRoutes } from './construction/projects';
   import { taskRoutes } from './construction/tasks';
   import { dailyLogRoutes } from './construction/dailyLogs';
   
   export async function constructionRoutes(server: FastifyInstance) {
     server.register(projectRoutes, { prefix: '/api/v1/construction' });
     server.register(taskRoutes, { prefix: '/api/v1/construction' });
     server.register(dailyLogRoutes, { prefix: '/api/v1/construction' });
   }
   ```

### Phase 3: Frontend Migration (Week 4-5)

1. **Copy UI components from Kealee**
   ```
   kealee-platform-v10/frontend/src/components/
     ├── ProjectDashboard/          → realco/frontend/src/components/construction/
     ├── TaskManager/
     ├── GanttChart/
     ├── DailyLogForm/
     └── RFIManager/
   ```

2. **Adapt for RealCo design system**
   - Update to use RealCo's Tailwind config
   - Replace Kealee branding with RealCo
   - Add investor-specific views

3. **Create routing**
   ```typescript
   // In App.tsx
   <Route path="/construction/projects/:id" element={
     <ProtectedRoute role="CONTRACTOR">
       <ProjectDashboard />
     </ProtectedRoute>
   } />
   
   <Route path="/investor/projects/:id" element={
     <ProtectedRoute role="INVESTOR">
       <InvestorConstructionDashboard />
     </ProtectedRoute>
   } />
   ```

### Phase 4: Integration Testing (Week 6)

1. **Test handoff flow**
   - Create test deal
   - Fund offering
   - Trigger construction handoff
   - Verify project created in m-os-pm

2. **Test draw request flow**
   - Create tasks
   - Mark tasks complete
   - Submit draw request
   - Verify payment integration

3. **Test investor updates**
   - Add daily logs
   - Upload photos
   - Verify investor receives update email

### Phase 5: Production Deployment (Week 7)

1. **Deploy database migration**
   ```bash
   railway run npx prisma migrate deploy
   ```

2. **Deploy backend**
   ```bash
   railway up
   ```

3. **Deploy frontend**
   ```bash
   vercel --prod
   ```

4. **Enable feature flag**
   ```typescript
   // Enable construction module for beta users
   ENABLE_CONSTRUCTION_MODULE=true
   ```

---

## Code Reuse Checklist

### Components to Import from Kealee

- ✅ **Project Management Core**
  - Project service
  - Task service
  - Milestone tracking
  - Schedule calculations (critical path, dependencies)

- ✅ **Daily Operations**
  - Daily log forms
  - Weather tracking
  - Labor/equipment tracking
  - Photo upload component

- ✅ **Quality & Safety**
  - RFI management
  - Submittal workflow
  - Inspection scheduler
  - Safety incident reporting

- ✅ **Document Management**
  - Document upload/storage
  - Version control
  - Access controls

- ✅ **Visualization Components**
  - Gantt chart
  - Progress charts
  - Budget tracking charts
  - Photo galleries

### Components to Build New for RealCo

- ⚠️ **Deal → Construction Handoff**
  - New workflow unique to RealCo
  - Compliance integration

- ⚠️ **Investor Communication**
  - Progress updates
  - Email templates
  - Notification system

- ⚠️ **Draw Request → Payment Integration**
  - Connect to RealCo payment engine
  - Compliance checks for fund disbursement

- ⚠️ **Investor Construction Dashboard**
  - Simplified view for non-technical users
  - Focus on progress and photos

---

## Configuration & Environment Variables

### Backend .env additions

```env
# Construction Module
ENABLE_CONSTRUCTION_MODULE=true
CONSTRUCTION_FILE_STORAGE=s3
AWS_S3_BUCKET_CONSTRUCTION=realco-construction-docs

# Kealee m-os-pm Settings
PROJECT_CODE_PREFIX=RC
DEFAULT_WORKING_DAYS_PER_WEEK=5
DEFAULT_HOURS_PER_DAY=8

# Notifications
CONSTRUCTION_UPDATE_FREQUENCY=weekly
SEND_INVESTOR_PROGRESS_UPDATES=true
```

### Frontend .env additions

```env
# Construction Module
VITE_ENABLE_CONSTRUCTION=true
VITE_CONSTRUCTION_FILE_UPLOAD_MAX_SIZE=10485760
```

---

## Benefits of Integration

### For Sponsors/Developers
1. **Unified Platform:** Manage fundraising and construction in one system
2. **Real-time Visibility:** Track construction progress alongside investor commitments
3. **Automated Reporting:** Investor updates generated from construction data
4. **Budget Control:** Direct connection between construction costs and investor funds

### For Investors
1. **Transparency:** Real-time access to construction progress
2. **Photo Documentation:** Visual proof of work progression
3. **Milestone Tracking:** Clear visibility into project timeline
4. **Confidence:** Professional project management increases trust

### For RealCo Platform
1. **Competitive Advantage:** Full-stack solution from capital raise to project completion
2. **Data Integration:** Construction data enhances underwriting for future deals
3. **Network Effects:** Contractors become part of platform ecosystem
4. **Recurring Revenue:** Construction management fees in addition to capital raise fees

---

## Timeline Summary

**Week 1:** Database migration
**Week 2-3:** Backend API integration
**Week 4-5:** Frontend component migration
**Week 6:** Integration testing
**Week 7:** Production deployment

**Total: 7 weeks to full m-os-pm integration**

---

## Next Steps

1. ✅ Review this integration plan
2. ⏭️ Set up Kealee V10 codebase access for component extraction
3. ⏭️ Prioritize which m-os-pm features to launch first (MVP vs full suite)
4. ⏭️ Identify team member to lead construction module integration
5. ⏭️ Schedule kickoff meeting for integration project

---

**END OF KEALEE INTEGRATION PLAN**
