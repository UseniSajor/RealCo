# CLAUDE.MD - RealCo Platform Context

## Project Overview
**RealCo Platform** is a comprehensive construction and real estate investment management platform built with a modern tech stack. It combines finance escrow management, project management, asset fund management, and investor portals into a unified system.

## Tech Stack
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Railway)
- **Hosting**:
  - Frontend: Vercel
  - Backend: Railway
- **Payments**: Stripe integration
- **Finance**: Plaid integration
- **Design System**: Custom RealCo design system with smoke grey dark mode

## Project Structure
```
RealCo Platform/
├── frontend/          # Next.js application
├── backend/           # Express API server
├── shared/            # Shared types and utilities
├── docs/             # Comprehensive documentation
│   └── files/        # Deployment guides
├── demo/             # Demo configurations
└── [various .md files] # Implementation summaries and guides
```

## Key Modules

### 1. Finance & Escrow Module
- Trust account management
- Draw requests and approvals
- Invoice processing
- Payment provider integration (Stripe, Plaid)
- Financial reporting and analytics

### 2. Project Management Module
- Construction project tracking
- Task and milestone management
- Document management
- Team collaboration tools
- Budget tracking

### 3. Asset Fund Management
- Investment portfolio tracking
- Fund performance analytics
- Investor reporting
- Distribution management

### 4. User Roles
- **Investors**: Portfolio viewing, document access
- **Sponsors**: Project creation, fund management
- **Property Managers**: Day-to-day operations
- **Contractors**: Task management, invoicing
- **Lenders**: Loan monitoring, draw approvals

## Important Documentation

### Start Here (Priority Order)
1. `docs/files/00_START_HERE.md` - Master overview
2. `README.md` - Quick reference
3. `FINAL_DEPLOYMENT_STATUS.md` - Current deployment state

### Development Guides
- `docs/CURSOR_PROMPTS_SONNET_4.5.md` - Universal development framework (35KB)
- `docs/REALCO_KEALEE_SPECIFIC_PROMPTS.md` - Feature-specific prompts (38KB)
- `docs/QUICK_REFERENCE_GUIDE.md` - Code snippets and patterns (43KB)
- `docs/INTEGRATION_CHECKLIST.md` - 14-week implementation plan
- `docs/TROUBLESHOOTING_GUIDE.md` - Common issues and solutions

### Deployment Guides (in docs/files/)
1. `DEPLOYMENT_READY.md` - Overview
2. `PRE_DEPLOYMENT_VALIDATION.md` - Pre-flight checks
3. `DEPLOYMENT_GUIDE.md` - Step-by-step deployment
4. `POST_DEPLOYMENT_MONITORING.md` - Monitoring procedures
5. `ROLLBACK_PROCEDURE.md` - Emergency recovery

### Implementation Status
- `PRODUCTION_V5_SUMMARY.md` - Latest production status
- `MODULE_1_IMPLEMENTATION_SUMMARY.md` - Finance module status
- `KEALEE_IMPLEMENTATION_PROGRESS.md` - Integration progress
- `SESSION_SUMMARY_JAN_23_2026.md` - Recent session work

## Current State (v5.1)

### Completed ✅
- Finance & Trust Management module
- Project Management integration
- RealCo design system implementation
- Demo mode with mock data
- Production deployment infrastructure
- All 3rd party integrations configured
- Marketing pages with RealCo branding

### Deployment Status
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway
- **Database**: PostgreSQL on Railway
- **Branch**: Currently on `demo-version`, main branch is `main`

### Recent Updates (Jan 2026)
- Applied RealCo design system to all marketing pages
- Completed production v5.0 implementation
- Added comprehensive deployment guides
- Configured Vercel deployment for v5.1

## Environment Setup

### Required Environment Variables
See `CREDENTIAL_SETUP_README.md` and `CREDENTIALS_TEMPLATE.txt` for complete setup.

**Critical Variables:**
- `JWT_SECRET` - Authentication
- `ENCRYPTION_KEY` - Data encryption
- `DATABASE_URL` - PostgreSQL connection
- `STRIPE_SECRET_KEY` - Payment processing
- `PLAID_CLIENT_ID` & `PLAID_SECRET` - Banking integration
- `FRONTEND_URL` & `BACKEND_URL` - CORS configuration

### Quick Start Commands
```bash
# Frontend development
cd frontend
npm install
npm run dev

# Backend development
cd backend
npm install
npm run dev

# Database seed
See SEED_DATABASE_INSTRUCTIONS.md
```

## Development Workflow

### Before Making Changes
1. Check relevant documentation in `docs/`
2. Review `QUICK_REFERENCE_GUIDE.md` for code patterns
3. Understand the module structure
4. Follow TypeScript best practices

### When Implementing Features
1. Use `CURSOR_PROMPTS_SONNET_4.5.md` for universal patterns
2. Reference `REALCO_KEALEE_SPECIFIC_PROMPTS.md` for domain-specific logic
3. Check `TROUBLESHOOTING_GUIDE.md` if issues arise
4. Update `INTEGRATION_CHECKLIST.md` to track progress

### Security Considerations
- Never commit secrets or API keys
- Use environment variables for all credentials
- Follow security patterns in `CURSOR_PROMPTS_SONNET_4.5.md`
- Validate all user inputs
- Implement proper RBAC (Role-Based Access Control)

### Testing
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Manual testing using demo accounts (see `DEMO_ACCOUNTS_QUICK_LOGIN.md`)

## Common Tasks

### Adding a New Feature
1. Read relevant prompt guide in `docs/`
2. Check if similar patterns exist in codebase
3. Follow established conventions
4. Update relevant documentation
5. Test with demo accounts

### Fixing Bugs
1. Check `TROUBLESHOOTING_GUIDE.md`
2. Review error logs (Railway/Vercel)
3. Test fix locally
4. Verify in demo environment
5. Deploy to production

### Deployment
1. Complete `PRE_DEPLOYMENT_VALIDATION.md` checklist
2. Follow `DEPLOYMENT_GUIDE.md` step-by-step
3. Monitor using `POST_DEPLOYMENT_MONITORING.md`
4. Have `ROLLBACK_PROCEDURE.md` ready

## Code Conventions

### TypeScript
- Strict type checking enabled
- No `any` types without justification
- Proper interface definitions for all data structures
- Use shared types from `shared/` directory

### React/Next.js
- App Router (not Pages Router)
- Server Components by default
- Client Components only when needed
- Proper error boundaries
- Loading states for async operations

### API Design
- RESTful endpoints
- Consistent error responses
- Proper HTTP status codes
- Request validation with Zod
- JWT-based authentication

### Database
- Prisma ORM for type-safe queries
- Migrations for schema changes
- Proper indexing for performance
- Transaction handling for critical operations

## Integration Points

### Payment Processing (Stripe)
- See `PAYMENT_PROVIDERS_SETUP.md`
- Use test keys in development
- Production keys in Railway environment variables

### Banking (Plaid)
- See `QUICK_START_PAYMENTS.md`
- Sandbox mode for development
- Production mode configuration in docs

### Third-Party Services
- See `THIRD_PARTY_INTEGRATION_STRATEGY.md`
- All services configured via environment variables
- Fallback handling for service outages

## Demo Mode
- Mock data for testing without real transactions
- Role-specific demo accounts
- See `DEMO_ACCOUNTS_QUICK_LOGIN.md` for credentials
- Toggle via environment variable: `DEMO_MODE=true`

## Production Checklist
Before any production deployment:
- [ ] All tests passing
- [ ] TypeScript compilation successful (0 errors)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Backup created
- [ ] Team notified
- [ ] Rollback plan ready

## Support Resources

### Documentation
- `docs/` - Comprehensive guides
- `*.md` files in root - Implementation summaries
- `FEATURE_LOCATION_GUIDE.md` - Code location reference

### Troubleshooting
1. Check `TROUBLESHOOTING_GUIDE.md`
2. Review recent commits for context
3. Check Railway/Vercel logs
4. Review error monitoring (if configured)

### Emergency Procedures
- Rollback: `docs/files/ROLLBACK_PROCEDURE.md`
- Database restore: See Railway backup procedures
- Service status: Check Railway and Vercel dashboards

## Git Workflow
- **Main branch**: `main` (production)
- **Current branch**: `demo-version` (demo features)
- Feature branches for new work
- Merge to main only after validation
- Tag releases with version numbers

## Key Contacts & Links
- Repository: (check `.git/config`)
- Frontend URL: (in Vercel dashboard)
- Backend URL: (in Railway dashboard)
- Database: Railway PostgreSQL instance

## Notes for AI Assistants

### When Helping with This Project:
1. **Always** read relevant documentation first
2. **Never** commit secrets or modify `.env` files
3. **Follow** established patterns in codebase
4. **Reference** code snippets from `QUICK_REFERENCE_GUIDE.md`
5. **Check** recent implementation summaries for context
6. **Validate** changes don't break existing functionality
7. **Update** documentation when making significant changes

### Common Pitfalls to Avoid:
- Don't skip pre-deployment validation
- Don't deploy on Fridays or late nights
- Don't rush through checklists
- Don't assume environment variables are set
- Don't modify core authentication without thorough testing
- Don't change database schema without migrations

### Best Practices:
- Read before writing code
- Understand before modifying
- Test before deploying
- Document as you go
- Follow the established patterns
- Ask for clarification when unclear

## Version History
- **v5.1**: Vercel deployment with RealCo design system (Jan 2026)
- **v5.0**: Production implementation with all integrations (Jan 2026)
- **v4.0**: Complete UI/UX redesign
- **v3.0**: Finance module completion
- Earlier versions documented in git history

---

**Last Updated**: January 24, 2026
**Project Status**: Production-ready, actively maintained
**Documentation Status**: Comprehensive guides available

For the most current information, always check:
1. `FINAL_DEPLOYMENT_STATUS.md`
2. Recent commit messages
3. Latest session summaries in root directory
