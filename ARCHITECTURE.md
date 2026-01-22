# RealCo Platform - Architecture Overview
## Monorepo Structure & System Design

**Last Updated:** January 22, 2026  
**Architecture Type:** Monorepo with Multiple Applications

---

## 🏗️ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                     RealCo Platform Monorepo                    │
│                    (Single Git Repository)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   Backend    │      │   Frontend   │     │  Investor    │
│   (API)      │◄────►│   (Web App)  │     │  Portal      │
│              │      │              │     │              │
│  Fastify +   │      │  React +     │     │  Next.js +   │
│  Prisma      │      │  Vite        │     │  Prisma      │
└──────┬───────┘      └──────────────┘     └──────────────┘
       │
       │ Connects to
       ▼
┌──────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                        │
│         (Shared across all applications)                     │
└──────────────────────────────────────────────────────────────┘
       │
       │ Integrations
       ▼
┌──────────────────────────────────────────────────────────────┐
│  External Services: Stripe, Plaid, AWS S3, Email (SMTP)     │
└──────────────────────────────────────────────────────────────┘
```

---

## 📦 MONOREPO APPLICATIONS

### 1. Backend (`backend/`)

**Purpose:** Main API server for construction and finance management

**Tech Stack:**
- **Framework:** Fastify (Node.js)
- **Database ORM:** Prisma
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL 15+
- **Deployment:** Railway

**Key Features:**
- Construction project management
- Task scheduling with CPM
- Daily logs and progress tracking
- Finance and escrow management
- Transaction processing (Stripe)
- Bank account verification (Plaid)
- File storage (AWS S3)

**API Structure:**
```
/api/v1/
├── /auth                   # Authentication
├── /development-projects   # Development projects
├── /projects               # Construction projects
├── /tasks                  # Task management
├── /daily-logs            # Daily logs
├── /transactions          # Payment transactions
├── /bank-accounts         # Bank account management
└── /escrow-accounts       # Escrow management
```

---

### 2. Frontend (`frontend/`)

**Purpose:** Main web application for sponsors and investors

**Tech Stack:**
- **Framework:** React 18+
- **Router:** TanStack Router
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State Management:** React Query
- **Language:** TypeScript
- **Deployment:** Vercel

**Key Pages:**
- Authentication (login/register)
- Owner dashboard
- Offerings management
- Construction project views
- Transaction history
- Bank account management

---

### 3. Next.js App (`apps/web/`)

**Purpose:** Alternative web application (Next.js based)

**Tech Stack:**
- **Framework:** Next.js 14+
- **Styling:** TailwindCSS
- **Language:** TypeScript
- **Deployment:** Vercel

**Status:** In development

---

### 4. Investor App (`realco-investor-app/`)

**Purpose:** Dedicated investor portal application

**Structure:**
- `apps/api/` - Investor API service
- `packages/db/` - Investor database layer
  - Separate Prisma schema for investor-specific data
  - ITSPE synchronization jobs

**Tech Stack:**
- Separate database schema
- Integration with main platform
- Scheduled sync jobs

---

### 5. Demo App (`demo/`)

**Purpose:** Testing and demonstration

**Tech Stack:**
- TypeScript
- Simple Express/Fastify server

**Usage:** Testing new features before integration

---

## 🔗 DATA FLOW

### User Request Flow

```
User → Frontend → Backend API → Database → External Services
  │        │          │             │            │
  │        │          │             │            ├─ Stripe (payments)
  │        │          │             │            ├─ Plaid (bank verification)
  │        │          │             │            ├─ AWS S3 (file storage)
  │        │          │             │            └─ SMTP (email)
  │        │          │             │
  │        │          │             └─ PostgreSQL
  │        │          │
  │        │          └─ Prisma ORM
  │        │
  │        └─ React Query (caching)
  │
  └─ Browser
```

### Construction Project Lifecycle

```
1. Deal Funded (Offering)
   │
   ├─ Event: offering.funded
   │
2. Auto-Create Construction Project
   │
   ├─ Generate project code (RC-2025-001)
   ├─ Apply task template
   ├─ Create milestones
   ├─ Create escrow account
   │
3. Daily Progress Tracking
   │
   ├─ Daily logs created
   ├─ Photos uploaded to S3
   ├─ Progress updated
   │
4. Task Completion
   │
   ├─ Update task progress
   ├─ Calculate critical path
   ├─ Rollup to project progress
   │
5. Milestone Achievement
   │
   ├─ Notify investors
   ├─ Update dashboard
   │
6. Project Completion
   │
   └─ Final distribution
      └─ Investor payouts
```

### Payment Processing Flow

```
1. Investor Initiates Transaction
   │
   ├─ Compliance Check (OFAC, limits)
   ├─ Bank Account Validation
   │
2. Transaction Created (INITIATED)
   │
   ├─ Stripe Payment Intent
   │
3. Processing (PROCESSING)
   │
   ├─ ACH/Wire/Check processing
   │
4. Webhook Received
   │
   ├─ Signature verification
   ├─ Idempotency check
   │
5. Transaction Completed (COMPLETED)
   │
   ├─ Update escrow balance
   ├─ Create ledger entry
   ├─ Notify investor
   │
[If Failed: Retry with exponential backoff]
```

---

## 🗃️ DATABASE ARCHITECTURE

### Main Database (PostgreSQL)

**Schemas:**
1. **User Management**
   - Organization
   - User
   - Roles & Permissions

2. **Real Estate Deals**
   - DevelopmentProject
   - Offering
   - Investment

3. **Construction Management** (Kealee Integration)
   - Project
   - Task (with dependencies)
   - Milestone
   - DailyLog
   - RFI, Submittal, Inspection
   - SafetyIncident

4. **Finance & Escrow**
   - BankAccount (encrypted)
   - Transaction (state machine)
   - EscrowAccount
   - EscrowLedgerEntry
   - Distribution

5. **Audit & Compliance**
   - AuditEvent
   - ComplianceCheck
   - TransactionWebhook

**Key Relations:**
```
Organization (1) → (many) User
Organization (1) → (many) DevelopmentProject
DevelopmentProject (1) → (1) Project (construction)
DevelopmentProject (1) → (1) Offering
Offering (1) → (many) Investment
Offering (1) → (1) EscrowAccount
Project (1) → (many) Task
Task (1) → (many) Task (parent-child)
User (1) → (many) BankAccount
Transaction (many) → (1) BankAccount
```

---

## 🔐 SECURITY ARCHITECTURE

### Authentication Flow

```
1. User Login
   │
   ├─ Email/Password validation
   ├─ Generate JWT token
   ├─ Include: userId, orgId, role
   │
2. API Request
   │
   ├─ Verify JWT signature
   ├─ Check token expiration
   ├─ Extract user context
   │
3. Authorization
   │
   ├─ Check user role
   ├─ Verify organization access
   ├─ Validate resource ownership
   │
4. Process Request
   │
   └─ Organization-scoped queries
```

### Data Encryption

**At Rest:**
- Bank account numbers → AES-256 encryption
- Plaid access tokens → Encrypted
- Sensitive PII → Encrypted

**In Transit:**
- HTTPS/TLS 1.2+ required
- JWT tokens signed and encrypted
- Webhook signatures verified

**Hashing:**
- Passwords → bcrypt (10 rounds)
- Routing numbers → SHA-256 hash
- Idempotency keys → SHA-256

---

## 🚀 DEPLOYMENT ARCHITECTURE

### Development
```
Local Machine
├── Backend: localhost:5001
├── Frontend: localhost:3000
└── Database: Docker PostgreSQL
```

### Staging
```
Railway (Backend + Database)
├── API: https://staging-api.railway.app
└── PostgreSQL: railway.internal

Vercel (Frontend)
└── Web: https://staging-app.vercel.app
```

### Production
```
Railway (Backend + Database)
├── API: https://api.railway.app
├── PostgreSQL: railway.internal
└── Redis: railway.internal (future)

Vercel (Frontend)
└── Web: https://app.realco.com

External Services
├── Stripe: Payment processing
├── Plaid: Bank verification
├── AWS S3: File storage
└── SendGrid: Email delivery
```

---

## 📊 PERFORMANCE TARGETS

### API Performance
- **Response Time:** <200ms (p95)
- **Database Queries:** <50ms (p95)
- **Error Rate:** <0.1%
- **Uptime:** >99.9%

### Frontend Performance
- **Time to Interactive:** <3s
- **Bundle Size:** <500KB
- **Lighthouse Score:** >90
- **Core Web Vitals:** All "Good"

### Database Performance
- **Connection Pool:** 20 connections
- **Query Timeout:** 10s
- **Index Coverage:** >95% of queries

---

## 🔄 SCALABILITY PLAN

### Current Capacity
- **Users:** Up to 10,000
- **Projects:** Up to 1,000 active
- **Transactions:** Up to 100,000/month
- **Database Size:** Up to 100GB

### Future Scaling (When Needed)
1. **Database:** Read replicas, connection pooling (PgBouncer)
2. **Backend:** Horizontal scaling (multiple Railway instances)
3. **Frontend:** Edge deployment (Vercel Edge)
4. **Caching:** Redis for sessions and frequently accessed data
5. **Queue:** Background jobs (BullMQ) for heavy processing

---

## 🛡️ COMPLIANCE & SECURITY

### Regulatory Compliance
- **SEC:** Investment transaction tracking and reporting
- **PCI-DSS:** No credit card storage (Stripe handles)
- **SOC 2:** Audit logging for all data changes
- **GDPR:** Data retention and deletion policies

### Security Measures
- **Authentication:** JWT with short expiration
- **Authorization:** Organization-scoped, role-based
- **Encryption:** AES-256 for sensitive data
- **Audit Trail:** All state changes logged
- **Rate Limiting:** API endpoints protected
- **CORS:** Strict whitelist only
- **Input Validation:** Zod schemas on all endpoints

---

## 🎯 MONOREPO ADVANTAGES

**For RealCo:**
1. ✅ **Shared Types** - TypeScript types shared between frontend/backend
2. ✅ **Unified Database** - Single Prisma schema
3. ✅ **Single Version Control** - All code in one repo
4. ✅ **Atomic Changes** - Update API + frontend in one commit
5. ✅ **Easier Testing** - Test across apps in one suite
6. ✅ **Consistent Tooling** - Same linting, formatting, testing

**Trade-offs:**
- ⚠️ Larger repository size
- ⚠️ Need monorepo build tools (Turborepo/Nx)
- ⚠️ Workspace management complexity

---

## 📁 RECOMMENDED FUTURE STRUCTURE

```
realco-platform/
├── apps/
│   ├── api/              # Main backend (rename from backend/)
│   ├── web/              # Main frontend (rename from frontend/)
│   └── investor-portal/  # Investor app (rename from realco-investor-app/)
│
├── packages/
│   ├── database/         # Shared Prisma schema
│   ├── types/            # Shared TypeScript types
│   ├── ui/               # Shared React components
│   ├── config/           # Shared configs
│   └── utils/            # Shared utilities
│
├── docs/
│   ├── guides/           # User & deployment guides
│   ├── development/      # Development docs
│   ├── architecture/     # System architecture
│   └── api/              # API documentation
│
├── tools/                # Utility scripts
├── scripts/              # Build & deploy scripts
├── .github/              # CI/CD workflows
│
└── Configuration Files
    ├── package.json
    ├── pnpm-workspace.yaml
    ├── turbo.json
    └── tsconfig.base.json
```

---

## 🔧 TECHNOLOGY STACK SUMMARY

### Backend (API)
| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20+ |
| Framework | Fastify 4+ |
| Database ORM | Prisma 5+ |
| Database | PostgreSQL 15+ |
| Authentication | JWT |
| Validation | Zod |
| Testing | Vitest |
| Deployment | Railway |

### Frontend (Web)
| Layer | Technology |
|-------|------------|
| Framework | React 18+ |
| Router | TanStack Router |
| Build Tool | Vite |
| Styling | TailwindCSS |
| State | React Query |
| Forms | React Hook Form |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

### External Services
| Service | Purpose |
|---------|---------|
| Stripe | Payment processing |
| Plaid | Bank account verification |
| AWS S3 | File storage |
| SendGrid | Email delivery |
| Railway | Backend hosting |
| Vercel | Frontend hosting |

---

## 📈 CURRENT IMPLEMENTATION STATUS

### Completed Features (35%)
- ✅ Database schema (construction + finance)
- ✅ Project management service
- ✅ Task management with CPM
- ✅ Daily logs and progress tracking
- ✅ S3 integration
- ✅ Authentication system
- ✅ Unit tests (>80% coverage)

### In Progress (0%)
- ⏳ Finance module (bank accounts, transactions, escrow)
- ⏳ Frontend UI (dashboards)
- ⏳ Integration automation

### Planned (65%)
- 📋 Payment dashboards
- 📋 Deal-to-construction handoff
- 📋 Investor notifications
- 📋 Production deployment
- 📋 Monitoring and alerts

---

## 🎯 NEXT STEPS

### Immediate (This Week)
1. Execute light reorganization (run `reorganize.ps1`)
2. Update documentation links
3. Deploy to staging environment

### Short-term (Next 2 Weeks)
1. Complete finance module
2. Build frontend dashboards
3. Integration testing

### Medium-term (Next Month)
1. Full monorepo reorganization
2. Extract shared packages
3. Production deployment

---

**This is a monorepo with strong foundations. Light organization now, full restructure after Phase 2!**

---

*Last Updated: January 22, 2026*  
*Monorepo Status: Active*  
*Applications: 5*  
*Shared Database: PostgreSQL*
