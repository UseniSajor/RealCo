# RealCo Platform - Monorepo

**Real Estate Syndication Platform with Construction Management & Finance Escrow**

[![Master Context Compliance](https://img.shields.io/badge/Compliance-100%25-brightgreen)]()
[![Test Coverage](https://img.shields.io/badge/Coverage->80%25-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)]()
[![Monorepo](https://img.shields.io/badge/Monorepo-Active-blue)]()

---

## 🎯 What is RealCo Platform?

A comprehensive **monorepo** containing multiple applications for real estate syndication, construction project management, and finance escrow operations.

**Key Features:**
- 🏢 Real estate deal syndication
- 🏗️ Construction project management (Kealee V10 integration)
- 💰 Finance and escrow management  
- 📊 Investor dashboards and reporting
- 🔒 SEC-compliant transaction processing
- ✅ 100% Master Context Compliance
- ✅ >80% Test Coverage

---

## 📦 Monorepo Structure

This repository contains **5 applications** in one unified codebase:

```
RealCo Platform/
├── backend/              Main API (Fastify + Prisma)
├── frontend/             Main web app (React + Vite)
├── apps/web/             Next.js application
├── realco-investor-app/  Investor portal
├── demo/                 Testing application
├── docs/                 Documentation
└── shared/               Shared code/types
```

**Why Monorepo?**
- Shared code and types across apps
- Unified version control
- Single source of truth
- Atomic changes (update API + frontend together)

**Tech Stack:**
- **Backend:** Node.js, Fastify, Prisma, PostgreSQL
- **Frontend:** React 18, Vite, TailwindCSS, TanStack Router
- **Database:** PostgreSQL 15+
- **Testing:** Vitest (100+ tests, >80% coverage)
- **Deployment:** Railway (backend) + Vercel (frontend)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or Docker)
- npm or pnpm

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database URL
# DATABASE_URL="postgresql://user:password@localhost:5432/realco"

# Generate Prisma client
npm run prisma:generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev

# Server runs on http://localhost:5001
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your backend URL
# VITE_API_URL=http://localhost:5001

# Start development server
npm run dev

# App runs on http://localhost:3000
```

### 3. Run Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## 📚 Documentation

### 🎯 Start Here
- **[QUICK_START.md](QUICK_START.md)** - Fast reference guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture & monorepo structure
- **[docs/README.md](docs/README.md)** - Complete documentation index

### 📖 Essential Documents
- **[PROJECT_STATUS_RECOMMENDATIONS.md](PROJECT_STATUS_RECOMMENDATIONS.md)** - Current status & 12-week roadmap
- **[docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md)** - Find any documentation quickly
- **[MONOREPO_STRUCTURE.md](MONOREPO_STRUCTURE.md)** - Detailed monorepo explanation

### 🛠️ Development
- **[docs/development/](docs/development/)** - Development guides & prompts
  - CURSOR_PROMPTS_SONNET_4.5.md - Master development framework
  - QUICK_REFERENCE_GUIDE.md - Code patterns & snippets
  - REALCO_KEALEE_SPECIFIC_PROMPTS.md - Feature-specific prompts

### 📋 Deployment
- **[docs/guides/](docs/guides/)** - Deployment & troubleshooting
  - PRE_DEPLOYMENT_VALIDATION.md - Pre-deploy checklist
  - DEPLOYMENT.md - Railway & Vercel setup
  - TROUBLESHOOTING_GUIDE.md - Common issues & fixes

### 🏗️ Architecture
- **[docs/architecture/](docs/architecture/)** - System design & integrations
  - REALCO_KEALEE_INTEGRATION.md - Construction management specs
  - REALCO_FINANCE_ESCROW_INTEGRATION.md - Finance module specs

---

## 🎨 Project Organization

### Current Status: 35% Complete

**✅ Phase 1: Foundation (Complete)**
- Database schema designed and migrated
- Backend services implemented (Project, Task, DailyLog)
- Unit tests (100+ tests, >80% coverage)
- S3 integration for file uploads
- Authentication system

**⏳ Phase 2: Finance Module (In Progress)**
- Bank account management (Plaid integration)
- Transaction processing (Stripe)
- Escrow accounts and distribution
- Payment dashboards

**📋 Phase 3-9: Pending**
- Frontend dashboards
- Deal-to-construction automation
- Beta testing
- Production deployment

**Full Roadmap:** See [PROJECT_STATUS_RECOMMENDATIONS.md](PROJECT_STATUS_RECOMMENDATIONS.md)

---

## 🧪 Testing

**100+ Unit Tests** covering:
- ProjectService (creation, metrics, schedule variance)
- TaskService (dependencies, critical path algorithm)
- DailyLogService (logs, photos, S3)
- BankAccountService (Plaid, encryption, verification)
- TransactionService (state machine, retries, compliance)

```bash
cd backend
npm test                    # Run all tests
npm test -- --coverage     # Coverage report
npm test -- --watch        # Watch mode
```

**Coverage:** >80% (lines, functions, statements)

**Test Guide:** [backend/tests/README.md](backend/tests/README.md)

---

## 🔧 Available Scripts

### Backend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm test                 # Run tests
npm run typecheck        # TypeScript validation
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
```

### Frontend
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code
```

### Monorepo (Root)
```bash
npm run dev:backend      # Start backend
npm run dev:frontend     # Start frontend
npm run test:backend     # Run backend tests
npm run build:all        # Build all workspaces
```

---

## 🛠️ Reorganization Available

To clean up and organize the monorepo structure:

```bash
# Automated reorganization (PowerShell)
.\reorganize.ps1

# Or follow manual guide
# See REORGANIZE_STRUCTURE.md
```

**Reorganization includes:**
- Organized documentation (guides/, development/, architecture/)
- Utility files moved to tools/
- Session summaries archived
- Clean root directory

**Details:** [REORGANIZE_STRUCTURE.md](REORGANIZE_STRUCTURE.md)

---

## 🚀 Deployment

### Staging
- **Backend:** Railway - [Setup Guide](docs/guides/DEPLOYMENT.md)
- **Frontend:** Vercel - [Setup Guide](docs/guides/DEPLOYMENT.md)
- **Database:** Railway PostgreSQL

### Production
**Before deploying, review:**
- [docs/guides/PRE_DEPLOYMENT_VALIDATION.md](docs/guides/PRE_DEPLOYMENT_VALIDATION.md) - Complete checklist
- [PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md) - Step-by-step guide

**Deployment Window:** Tuesday-Thursday, 9am-2pm only

---

## 📊 Project Status

- **Progress:** 35% Complete
- **Master Context Compliance:** 100% (10/10)
- **Test Coverage:** >80%
- **Documentation:** Complete
- **Production Ready:** Staging only

**Detailed Status:** [PROJECT_STATUS_RECOMMENDATIONS.md](PROJECT_STATUS_RECOMMENDATIONS.md)

---

## 🤝 Contributing

### Development Workflow

1. **Start Cursor session** with Master Context Prompt
   - See [docs/development/CURSOR_PROMPTS_SONNET_4.5.md](docs/development/CURSOR_PROMPTS_SONNET_4.5.md)

2. **Pick a task** from Integration Checklist
   - See [docs/guides/INTEGRATION_CHECKLIST.md](docs/guides/INTEGRATION_CHECKLIST.md)

3. **Use specific prompts** for features
   - See [docs/development/REALCO_KEALEE_SPECIFIC_PROMPTS.md](docs/development/REALCO_KEALEE_SPECIFIC_PROMPTS.md)

4. **Write tests** alongside code
   - See [backend/tests/README.md](backend/tests/README.md)

5. **Update documentation** as you go

### Code Standards
- TypeScript strict mode
- >80% test coverage required
- Linting must pass
- No console.log in production code
- JSDoc comments for complex functions

---

## 📞 Support

### Need Help?

1. **Quick Reference:** [QUICK_START.md](QUICK_START.md)
2. **Documentation Index:** [docs/DOCUMENTATION_INDEX.md](docs/DOCUMENTATION_INDEX.md)
3. **Troubleshooting:** [docs/guides/TROUBLESHOOTING_GUIDE.md](docs/guides/TROUBLESHOOTING_GUIDE.md)
4. **Architecture Overview:** [ARCHITECTURE.md](ARCHITECTURE.md)

### Common Issues
- Database connection: Check `DATABASE_URL` in `.env`
- CORS errors: Verify `CORS_ORIGIN` matches frontend URL
- Build errors: Run `npm run typecheck`
- Test failures: See [backend/tests/README.md](backend/tests/README.md)

---

## 📜 License

[License Type] - See LICENSE file

---

## 🎉 Quick Stats

- **Applications:** 5
- **Services:** 14+ backend services
- **API Endpoints:** 30+
- **Database Tables:** 25+
- **Unit Tests:** 100+
- **Test Coverage:** >80%
- **Documentation Pages:** 20+
- **Master Context Compliance:** 100%

---

**Ready to build? Start with [QUICK_START.md](QUICK_START.md)!**

---

*Last Updated: January 22, 2026*  
*Version: 1.0*  
*Status: Active Development*
