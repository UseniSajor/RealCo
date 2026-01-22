# RealCo Platform - Monorepo Structure
## Organized File & Folder Architecture

**Type:** Monorepo (Multiple applications in one repository)  
**Last Updated:** January 22, 2026

---

## 🏗️ CURRENT STRUCTURE ANALYSIS

### Yes, This IS a Monorepo ✅

The RealCo Platform is a **monorepo** containing multiple applications:
- `backend/` - Main backend API (Fastify + Prisma)
- `frontend/` - Main frontend app (React + Vite)
- `apps/web/` - Next.js web application
- `apps/api/` - Additional API service
- `realco-investor-app/` - Investor-specific application
- `demo/` - Demo/testing application

**Why Monorepo?**
- Shared code and types across apps
- Unified version control
- Easier dependency management
- Single source of truth for documentation

---

## 📁 CURRENT STRUCTURE (As-Is)

```
RealCo Platform/
├── .cursor/                          # Cursor IDE configuration
│   └── Docs/                         # Cursor-specific documentation
│       ├── README.md
│       ├── CURSOR_PROMPTS_SONNET_4.5.md
│       ├── REALCO_KEALEE_SPECIFIC_PROMPTS.md
│       ├── QUICK_REFERENCE_GUIDE.md
│       ├── INTEGRATION_CHECKLIST.md
│       ├── TROUBLESHOOTING_GUIDE.md
│       ├── MASTER_CONTEXT_COMPLIANCE.md
│       ├── REALCO_KEALEE_IMPLEMENTATION_SUMMARY.md
│       ├── DOCUMENTATION_INDEX.md
│       └── PRE_DEPLOYMENT_VALIDATION.md
│
├── apps/                             # Next.js applications
│   ├── web/                          # Main web app (Next.js)
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.ts
│   └── api/                          # API service
│       └── package.json
│
├── backend/                          # Main backend (Fastify + Prisma)
│   ├── docs/                         # Backend-specific docs
│   │   ├── ENV_TEMPLATE.md
│   │   ├── TRANSACTION_API.md
│   │   ├── TRANSACTION_IMPLEMENTATION_SUMMARY.md
│   │   └── TRANSACTION_QUICK_REFERENCE.md
│   ├── prisma/                       # Database schema
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   ├── README.md
│   │   ├── MIGRATION_GUIDE.md
│   │   ├── QUICK_REFERENCE.md
│   │   ├── PERFORMANCE_OPTIMIZATION.md
│   │   ├── SCHEMA_CHANGES.md
│   │   └── IMPLEMENTATION_SUMMARY.md
│   ├── scripts/
│   │   ├── railwayStart.mjs
│   │   ├── deploy-production.sh
│   │   └── migrate-database.sh
│   ├── src/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   └── v1.ts
│   │   ├── lib/
│   │   │   ├── health.ts
│   │   │   └── prisma.ts
│   │   ├── middlewares/
│   │   │   └── auth.ts
│   │   ├── services/               # Business logic
│   │   │   ├── project.service.ts
│   │   │   ├── task.service.ts
│   │   │   ├── daily-log.service.ts
│   │   │   ├── bank-account.service.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── stripe.service.ts
│   │   │   ├── plaid.ts
│   │   │   ├── s3.ts
│   │   │   ├── encryption.ts
│   │   │   ├── compliance.ts
│   │   │   ├── events.ts
│   │   │   ├── errors.ts
│   │   │   ├── notifications.ts
│   │   │   └── image-processing.ts
│   │   ├── types/
│   │   │   └── transaction.types.ts
│   │   ├── validators/
│   │   │   └── transaction.validators.ts
│   │   └── index.ts
│   ├── tests/                       # Unit & integration tests
│   │   ├── services/
│   │   │   ├── project.service.test.ts
│   │   │   ├── task.service.test.ts
│   │   │   ├── daily-log.service.test.ts
│   │   │   ├── bank-account.service.test.ts
│   │   │   └── transaction.service.test.ts
│   │   ├── setup.ts
│   │   ├── README.md
│   │   ├── health.test.ts
│   │   └── transaction.test.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── frontend/                         # Main frontend (React + Vite)
│   ├── src/
│   │   ├── app/
│   │   │   ├── __root.tsx
│   │   │   ├── router.tsx
│   │   │   ├── index.tsx
│   │   │   ├── login.tsx
│   │   │   ├── offerings.tsx
│   │   │   ├── health-check.tsx
│   │   │   └── owner/
│   │   │       ├── dashboard.tsx
│   │   │       └── index.tsx
│   │   ├── features/
│   │   │   └── offerings/
│   │   │       └── OfferingsPage.tsx
│   │   ├── lib/
│   │   │   ├── apiClient.ts
│   │   │   └── auth.ts
│   │   └── main.tsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── vercel.json
│
├── realco-investor-app/              # Investor application
│   ├── apps/
│   │   └── api/
│   │       └── src/
│   │           └── jobs/
│   │               └── syncItspe.ts
│   ├── packages/
│   │   └── db/
│   │       ├── prisma/
│   │       │   └── schema.prisma
│   │       ├── index.ts
│   │       ├── itspe-sync.ts
│   │       └── package.json
│   └── package.json
│
├── demo/                             # Demo/testing app
│   ├── index.ts
│   └── package.json
│
├── docs/                             # Project documentation (public)
│   ├── README.md
│   ├── CURSOR_PROMPTS_SONNET_4.5.md
│   ├── REALCO_KEALEE_SPECIFIC_PROMPTS.md
│   ├── QUICK_REFERENCE_GUIDE.md
│   ├── INTEGRATION_CHECKLIST.md
│   ├── TROUBLESHOOTING_GUIDE.md
│   ├── MASTER_CONTEXT_COMPLIANCE.md
│   ├── REALCO_KEALEE_IMPLEMENTATION_SUMMARY.md
│   ├── DOCUMENTATION_INDEX.md
│   ├── PRE_DEPLOYMENT_VALIDATION.md
│   ├── DEPLOYMENT.md
│   ├── REALCO_KEALEE_INTEGRATION.md
│   ├── REALCO_FINANCE_ESCROW_INTEGRATION.md
│   └── REALCO_KEALEE_INTEGRATION OS-PM.md
│
├── shared/                           # Shared code (future use)
│   └── contracts/
│       └── README.md
│
├── Root Documentation/               # Root-level docs
│   ├── DOCUMENTATION_INDEX.md
│   ├── DOCUMENTATION_ORGANIZATION_COMPLETE.md
│   ├── PROJECT_STATUS_RECOMMENDATIONS.md
│   ├── PRODUCTION_DEPLOYMENT_GUIDE.md
│   ├── QUICK_START.md
│   ├── REQUIREMENT_10_COMPLETE.md
│   ├── SESSION_SUMMARY.md
│   ├── UNIT_TESTS_IMPLEMENTATION_SUMMARY.md
│   └── MONOREPO_STRUCTURE.md (this file)
│
├── Configuration Files/
│   ├── .gitignore
│   ├── docker-compose.yml
│   ├── package.json (root)
│   └── README.md (root)
│
└── [Other Files]
    ├── generate-jwt-secret.js
    └── update-jwt-secret.js
```

---

## 🎯 RECOMMENDED STRUCTURE (Organized)

### Proposed Clean Monorepo Structure

```
realco-platform/                     # Root (rename from "RealCo Platfrom")
│
├── apps/                            # All applications
│   ├── api/                         # Main backend API
│   │   ├── src/
│   │   ├── tests/
│   │   ├── prisma/
│   │   └── package.json
│   │
│   ├── web/                         # Main web frontend
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── investor-portal/             # Investor-specific app
│   │   ├── src/
│   │   └── package.json
│   │
│   └── admin-dashboard/             # Admin dashboard (future)
│       ├── src/
│       └── package.json
│
├── packages/                        # Shared packages
│   ├── database/                    # Shared Prisma schema
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── types/                       # Shared TypeScript types
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── ui/                          # Shared UI components
│   │   ├── src/
│   │   └── package.json
│   │
│   ├── config/                      # Shared configs (ESLint, TS, etc.)
│   │   └── package.json
│   │
│   └── utils/                       # Shared utilities
│       ├── src/
│       └── package.json
│
├── docs/                            # All documentation
│   ├── guides/                      # User & developer guides
│   │   ├── getting-started.md
│   │   ├── deployment.md
│   │   ├── testing.md
│   │   └── troubleshooting.md
│   │
│   ├── api/                         # API documentation
│   │   ├── endpoints.md
│   │   ├── authentication.md
│   │   └── webhooks.md
│   │
│   ├── architecture/                # Architecture docs
│   │   ├── overview.md
│   │   ├── database-schema.md
│   │   └── integrations.md
│   │
│   ├── development/                 # Development docs
│   │   ├── cursor-prompts.md
│   │   ├── code-patterns.md
│   │   └── quick-reference.md
│   │
│   └── README.md                    # Documentation index
│
├── scripts/                         # Build & deployment scripts
│   ├── build.sh
│   ├── deploy.sh
│   ├── migrate.sh
│   └── seed.sh
│
├── tools/                           # Development tools
│   ├── generate-jwt-secret.js
│   └── update-jwt-secret.js
│
├── .github/                         # GitHub configuration
│   └── workflows/                   # CI/CD workflows
│       ├── test.yml
│       └── deploy.yml
│
├── Configuration Files (Root)/
│   ├── .gitignore
│   ├── .nvmrc                       # Node version
│   ├── docker-compose.yml
│   ├── package.json                 # Root package.json
│   ├── pnpm-workspace.yaml          # Monorepo config
│   ├── tsconfig.base.json           # Base TypeScript config
│   ├── turbo.json                   # Turborepo config (optional)
│   └── README.md
│
└── Documentation (Root)/
    ├── CONTRIBUTING.md
    ├── CHANGELOG.md
    ├── LICENSE
    └── PROJECT_STATUS.md
```

---

## 🔄 MIGRATION PLAN

### Phase 1: Create New Structure (No File Moves Yet)

1. **Create `packages/` directory structure**
   ```bash
   mkdir -p packages/database packages/types packages/ui packages/config packages/utils
   ```

2. **Create organized `docs/` structure**
   ```bash
   mkdir -p docs/guides docs/api docs/architecture docs/development
   ```

3. **Create `tools/` directory**
   ```bash
   mkdir tools
   ```

### Phase 2: Move Backend to `apps/api/`

```bash
# Option 1: Git mv (preserves history)
git mv backend apps/api

# Option 2: Manual move then git add
mv backend apps/api
git add apps/api
```

**Update paths in:**
- Root `package.json` workspace configuration
- CI/CD workflows
- Documentation references
- Import statements

### Phase 3: Move Frontend to `apps/web/`

```bash
git mv frontend apps/web
```

**Update:**
- Vercel configuration
- API URL references
- Build scripts

### Phase 4: Consolidate Documentation

**Move docs from `.cursor/Docs/` and `docs/` to organized structure:**

```bash
# Development docs
mv .cursor/Docs/CURSOR_PROMPTS_SONNET_4.5.md docs/development/cursor-prompts.md
mv .cursor/Docs/QUICK_REFERENCE_GUIDE.md docs/development/quick-reference.md

# Guides
mv docs/DEPLOYMENT.md docs/guides/deployment.md
mv docs/TROUBLESHOOTING_GUIDE.md docs/guides/troubleshooting.md
mv docs/PRE_DEPLOYMENT_VALIDATION.md docs/guides/pre-deployment-validation.md

# Architecture
mv docs/REALCO_KEALEE_INTEGRATION.md docs/architecture/kealee-integration.md
mv backend/prisma/README.md docs/architecture/database-schema.md
```

### Phase 5: Extract Shared Code to `packages/`

**Identify shared code:**
- Types used across frontend and backend
- Database schema (Prisma)
- Shared utilities (validation, formatting)
- UI components used in multiple apps

**Create shared packages:**

```typescript
// packages/types/src/index.ts
export * from './transaction.types';
export * from './project.types';
export * from './user.types';

// packages/database/prisma/schema.prisma
// Move from backend/prisma/schema.prisma

// packages/ui/src/components/
// Shared React components
```

### Phase 6: Update Package Manager Configuration

**Root `package.json`:**
```json
{
  "name": "realco-platform",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^1.10.0"
  }
}
```

**`pnpm-workspace.yaml`:**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## 📋 IMMEDIATE ACTIONS (Minimal Disruption)

### Option A: Light Organization (Recommended for Now)

Keep current structure but organize documentation:

```bash
# Create organized docs structure
mkdir -p docs/guides docs/development docs/architecture

# Move files (keeping git history)
git mv docs/DEPLOYMENT.md docs/guides/
git mv docs/TROUBLESHOOTING_GUIDE.md docs/guides/
git mv docs/PRE_DEPLOYMENT_VALIDATION.md docs/guides/

git mv docs/CURSOR_PROMPTS_SONNET_4.5.md docs/development/
git mv docs/QUICK_REFERENCE_GUIDE.md docs/development/

git mv docs/REALCO_KEALEE_INTEGRATION.md docs/architecture/
git mv docs/REALCO_FINANCE_ESCROW_INTEGRATION.md docs/architecture/

# Create tools directory
mkdir tools
git mv generate-jwt-secret.js tools/
git mv update-jwt-secret.js tools/

# Update all references in documentation
```

### Option B: Full Reorganization (Future)

Wait until after Finance Module (Phase 2) is complete, then do full monorepo restructure.

---

## 🛠️ MONOREPO TOOLS RECOMMENDATION

### Current Setup: npm/pnpm Workspaces ✅

Already using workspaces (good!)

### Enhanced Tools (Optional)

**Turborepo** (Recommended)
- Fast build caching
- Parallel execution
- Easy task pipelines

```bash
npm install -D turbo

# turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```

**Nx** (Alternative)
- More powerful but more complex
- Better for very large monorepos

---

## 📊 CURRENT STATUS

### Monorepo Maturity: ⭐⭐⭐☆☆ (3/5)

**✅ Strengths:**
- Multiple apps in one repo
- Shared documentation
- Consistent tooling (TypeScript, Prisma)

**⚠️ Areas for Improvement:**
- Scattered documentation
- No shared packages yet
- Tools in root directory
- Inconsistent naming (`backend` vs `apps/web`)

**🎯 Target (After Organization): ⭐⭐⭐⭐⭐**
- Clean `apps/` and `packages/` structure
- Organized documentation
- Shared code extracted
- Monorepo build tools (Turbo/Nx)

---

## 🎯 RECOMMENDATION

### Short-Term (This Week)

**Do Light Organization:**
```bash
# 1. Organize docs
mkdir -p docs/{guides,development,architecture}
# Move docs to organized folders

# 2. Move tools
mkdir tools
mv *-jwt-secret.js tools/

# 3. Create proper README at root
# Update with monorepo structure explanation

# 4. Add ARCHITECTURE.md
# Document current monorepo setup
```

### Medium-Term (After Finance Module)

**Full Reorganization:**
1. Move `backend/` → `apps/api/`
2. Move `frontend/` → `apps/web/`
3. Move `realco-investor-app/` → `apps/investor-portal/`
4. Create `packages/` with shared code
5. Set up Turborepo for builds
6. Update all paths and references

### Long-Term (Production)

**Advanced Monorepo:**
- Shared component library
- Shared type packages
- Automated versioning
- Changesets for releases
- CI/CD optimized for monorepo

---

## ✅ BENEFITS OF PROPER MONOREPO STRUCTURE

1. **Code Sharing** - DRY principle across apps
2. **Unified Versioning** - Single source of truth
3. **Easier Refactoring** - Change types once, update everywhere
4. **Consistent Tooling** - Same linting, testing, building
5. **Faster Onboarding** - One repo to clone and understand
6. **Better CI/CD** - Build what changed, not everything

---

**Next Steps:** Choose Option A (Light Organization) or Option B (Full Reorganization) and proceed accordingly.

---

*Last Updated: January 22, 2026*  
*Monorepo Status: Active, needs organization*  
*Recommended Action: Light organization now, full reorganization after Phase 2*
