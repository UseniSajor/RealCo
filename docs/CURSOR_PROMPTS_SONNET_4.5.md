# Cursor AI Prompts - Sonnet 4.5 | RealCo-Kealee Integration
## Production-Ready Development Prompts

---

## 🎯 MASTER CONTEXT PROMPT (Use First)

```
You are an expert full-stack developer specializing in enterprise-grade TypeScript applications. You're integrating battle-tested Kealee Platform V10 modules (construction management and finance escrow) into the RealCo real estate syndication platform.

TECH STACK:
- Frontend: React 18+ with TypeScript, Vite, TailwindCSS
- Backend: Node.js with Fastify, TypeScript
- Database: PostgreSQL 15+ with Prisma ORM
- Deployment: Railway (backend), Vercel (frontend)
- Payment Processing: Stripe, Plaid
- Storage: AWS S3 compatible

CRITICAL REQUIREMENTS:
1. Production-ready code only - no placeholders or TODOs
2. Complete error handling with proper logging
3. Type safety - strict TypeScript throughout
4. Security-first approach (PCI compliance, encryption, audit trails)
5. SEC compliance for financial transactions
6. Comprehensive input validation and sanitization
7. Database transactions for data integrity
8. Proper indexing for performance
9. RESTful API design with OpenAPI/Swagger docs
10. Unit tests using Vitest, integration tests where applicable

CODE STYLE:
- Use functional programming patterns
- Prefer async/await over callbacks
- Use TypeScript strict mode
- Follow Airbnb style guide for JavaScript/TypeScript
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Implement proper error boundaries in React
- Use React hooks (no class components)
- Implement proper loading and error states

When generating code:
1. Always provide complete, working implementations
2. Include all necessary imports
3. Add inline comments for complex logic
4. Consider edge cases and error scenarios
5. Optimize for both performance and readability
6. Follow SOLID principles
7. Implement proper separation of concerns
8. Use dependency injection where appropriate
```

---

## 📊 DATABASE SCHEMA MIGRATION PROMPT

```
Task: Implement production-ready Prisma schema migration for RealCo platform integrating Kealee V10 modules.

CONTEXT:
I need to add construction project management (m-os-pm) and finance escrow tables to our existing RealCo Prisma schema. This must be backward compatible and handle data migration safely.

REQUIREMENTS:
1. Create complete Prisma schema definitions for:
   - Construction Projects & Tasks
   - Milestones, Daily Logs, RFIs, Submittals
   - Finance: BankAccounts, Transactions, EscrowAccounts
   - Payment processing and webhooks
   - Audit trails and compliance logging

2. Schema must include:
   - Proper relation mappings with cascade rules
   - Database indexes for query optimization
   - Enum definitions for type safety
   - Json fields for flexible metadata
   - Timestamp fields (createdAt, updatedAt)
   - Soft delete support where needed
   - Snake_case database naming with camelCase Prisma models

3. Migration strategy:
   - Create migration file that's idempotent
   - Handle potential conflicts with existing tables
   - Include rollback capability
   - Seed essential enum data
   - Validate constraints

4. Performance considerations:
   - Add composite indexes for common queries
   - Optimize foreign key relationships
   - Consider partitioning for large tables
   - Index fields used in WHERE clauses

DELIVERABLES:
- Complete schema.prisma file with all models
- Migration SQL file (npx prisma migrate dev)
- Seed script for initial data
- Documentation of breaking changes
- Performance optimization notes

Generate the complete Prisma schema with all necessary models, enums, and relations.
```

---

## 🔧 BACKEND API DEVELOPMENT PROMPT

```
Task: Implement production-ready Fastify API endpoints for [SPECIFIC_MODULE: e.g., "construction projects" or "escrow transactions"].

CONTEXT:
Building RESTful API services for RealCo platform using Fastify framework with TypeScript. APIs must be secure, performant, and maintainable.

REQUIREMENTS:

1. API Structure:
   - RESTful endpoint design following best practices
   - Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
   - Request validation using Zod or JSON Schema
   - Response standardization (success, error formats)
   - Pagination support (limit, offset, cursor-based)
   - Filtering and sorting capabilities
   - API versioning (v1, v2)

2. Authentication & Authorization:
   - JWT token validation middleware
   - Role-based access control (RBAC)
   - Permission checks per endpoint
   - Rate limiting per user/IP
   - CSRF protection where needed

3. Business Logic:
   - Service layer pattern (controllers → services → repositories)
   - Database transactions for multi-step operations
   - Optimistic locking for concurrent updates
   - Event emission for audit trails
   - Idempotency for critical operations

4. Error Handling:
   - Custom error classes (ValidationError, AuthError, etc.)
   - Centralized error handler
   - Proper error logging with context
   - User-friendly error messages
   - Stack trace sanitization in production

5. Data Validation:
   - Input sanitization to prevent injection
   - Type validation using TypeScript + runtime checks
   - Business rule validation
   - Foreign key existence checks
   - File upload validation (type, size limits)

6. Performance:
   - Database query optimization
   - Connection pooling
   - Caching strategy (Redis if needed)
   - Lazy loading for relations
   - N+1 query prevention

7. Compliance & Audit:
   - Log all state changes to audit_events table
   - Compliance checks before critical operations
   - OFAC screening for financial transactions
   - PII encryption for sensitive data
   - Immutable audit trail

EXAMPLE STRUCTURE:
```typescript
// routes/construction/projects.ts
export async function projectRoutes(server: FastifyInstance) { ... }

// services/construction/project.service.ts
export class ProjectService { ... }

// validators/construction/project.validator.ts
export const createProjectSchema = z.object({ ... });

// types/construction/project.types.ts
export interface CreateProjectDTO { ... }
```

DELIVERABLES:
- Complete route handlers with all CRUD operations
- Service layer with business logic
- Validators for all inputs
- TypeScript types/interfaces
- Error handling middleware
- Integration tests
- API documentation (JSDoc or OpenAPI)

Generate complete, production-ready code for [SPECIFIC_ENDPOINT].
```

---

## 💰 FINANCE ESCROW INTEGRATION PROMPT

```
Task: Implement production-ready finance escrow and payment processing system with Stripe and Plaid integration.

CONTEXT:
Building SEC-compliant escrow and payment infrastructure for real estate syndication platform. Must handle investor deposits, capital distributions, construction draws, and all financial transactions with complete audit trail.

CRITICAL REQUIREMENTS:

1. Payment Gateway Integration:
   - Stripe Connect for ACH transfers
   - Plaid for bank account verification
   - Support for wire transfers with instructions
   - Check processing workflow
   - Webhook handlers for async events

2. Escrow Account Management:
   - Segregated accounts per offering
   - Multi-signature authorization
   - Fund hold and release controls
   - Waterfall distribution calculations
   - Preferred return tracking
   - Automated profit splits

3. Transaction Processing:
   - Atomic database transactions
   - Retry logic for failed payments
   - Idempotent payment processing
   - Transaction status state machine
   - Refund and reversal handling
   - Fee calculation and deduction

4. Security & Compliance:
   - PCI-DSS compliance (never store full card numbers)
   - AES-256 encryption for bank account data
   - OFAC screening on all transactions
   - AML/KYC integration
   - Bank Secrecy Act (BSA) reporting >$10k
   - SAR flagging for suspicious activity
   - SSL/TLS for all data in transit

5. Reconciliation & Reporting:
   - Daily automated bank reconciliation
   - Transaction history with full audit trail
   - Tax reporting preparation (1099, K-1)
   - Payment status dashboards
   - Distribution schedules
   - Fee reporting

6. Webhook Security:
   - Stripe webhook signature verification
   - Plaid webhook authentication
   - Event deduplication
   - Webhook retry logic
   - Event logging to database

7. Error Handling:
   - Payment failure handling
   - Network timeout recovery
   - Insufficient funds handling
   - Bank account verification failures
   - Webhook processing errors

IMPLEMENTATION DETAILS:

```typescript
// Example: Transaction state machine
enum TransactionStatus {
  INITIATED → PENDING_APPROVAL → APPROVED → QUEUED 
  → PROCESSING → PENDING_SETTLEMENT → SETTLED → COMPLETED
  OR → FAILED → (retry) → QUEUED
  OR → CANCELLED
  OR → REVERSED
}

// Example: Payment processing
async function processInvestmentPayment(investmentId: number) {
  return await prisma.$transaction(async (tx) => {
    // 1. Verify investment exists and is pending
    // 2. Get investor bank account
    // 3. Create transaction record
    // 4. Initiate Stripe payment
    // 5. Update investment status
    // 6. Create audit log
    // 7. Send notification
  });
}
```

DELIVERABLES:
- Complete payment service layer
- Stripe and Plaid integration modules
- Webhook handlers with signature verification
- Transaction state machine implementation
- Escrow account management system
- Distribution calculation engine
- Reconciliation service
- Comprehensive error handling
- Security audit checklist
- PCI compliance documentation

Generate production-ready code for [SPECIFIC_PAYMENT_FEATURE].
```

---

## ⚛️ FRONTEND COMPONENT DEVELOPMENT PROMPT

```
Task: Build production-ready React TypeScript components for [SPECIFIC_FEATURE] with TailwindCSS styling.

CONTEXT:
Creating enterprise-grade UI components for RealCo platform. Components must be accessible, responsive, performant, and follow React best practices.

REQUIREMENTS:

1. Component Architecture:
   - Functional components with hooks
   - Proper prop typing with TypeScript
   - Component composition over inheritance
   - Custom hooks for reusable logic
   - Context API for shared state (avoid prop drilling)
   - Error boundaries for graceful failures

2. State Management:
   - React Query for server state
   - useState/useReducer for local state
   - Context for global UI state
   - Optimistic updates where appropriate
   - Loading and error states
   - Polling or WebSocket for real-time updates

3. Form Handling:
   - React Hook Form for form management
   - Zod for validation schema
   - Real-time validation feedback
   - Submit button disable during processing
   - Error message display
   - Success confirmation
   - File upload with progress

4. Data Fetching:
   - React Query for API calls
   - Automatic retry on failure
   - Cache invalidation strategy
   - Prefetching for better UX
   - Infinite scroll with pagination
   - Search with debouncing

5. UI/UX Best Practices:
   - Responsive design (mobile-first)
   - Accessibility (ARIA labels, keyboard nav)
   - Loading skeletons
   - Empty states
   - Error states with retry actions
   - Success/confirmation modals
   - Toast notifications for feedback
   - Tooltips for additional info

6. Performance:
   - React.memo for expensive renders
   - useMemo/useCallback optimization
   - Lazy loading for code splitting
   - Virtual scrolling for long lists
   - Image optimization
   - Bundle size monitoring

7. Styling:
   - TailwindCSS utility classes
   - Responsive breakpoints (sm, md, lg, xl)
   - Dark mode support if needed
   - Consistent spacing/typography
   - Custom component variants
   - Animation with Tailwind transitions

8. Testing:
   - Vitest for unit tests
   - React Testing Library
   - User event simulation
   - Accessibility testing
   - Visual regression tests (optional)

EXAMPLE STRUCTURE:
```typescript
// components/construction/ProjectDashboard.tsx
export function ProjectDashboard() {
  // Hooks
  const { data, isLoading, error } = useProjectData();
  
  // Handlers
  const handleUpdate = async () => { ... }
  
  // Render
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  
  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
}
```

DELIVERABLES:
- Complete React component(s)
- TypeScript interfaces for props
- Custom hooks if needed
- TailwindCSS styling
- Loading/error/empty states
- Accessibility features
- Unit tests
- Storybook stories (optional)

Generate production-ready React component for [SPECIFIC_UI_FEATURE].
```

---

## 🧪 TESTING & QUALITY ASSURANCE PROMPT

```
Task: Write comprehensive test suites for [SPECIFIC_MODULE] ensuring production readiness.

CONTEXT:
Creating thorough test coverage for RealCo platform to ensure reliability, catch bugs early, and enable confident refactoring.

REQUIREMENTS:

1. Unit Tests (Vitest):
   - Test all business logic functions
   - Test edge cases and error scenarios
   - Mock external dependencies
   - Test async operations
   - Aim for >80% coverage on critical paths
   - Test TypeScript type guards

2. Integration Tests:
   - Test API endpoints end-to-end
   - Test database operations
   - Test external service integrations
   - Test authentication flows
   - Test transaction rollbacks

3. Component Tests (React Testing Library):
   - Test user interactions
   - Test form validation
   - Test loading/error states
   - Test accessibility
   - Test responsive behavior
   - Avoid testing implementation details

4. E2E Tests (Playwright/Cypress):
   - Critical user journeys
   - Payment flows
   - Investment process
   - Project creation workflow
   - Multi-user scenarios

5. Test Organization:
   ```typescript
   describe('ProjectService', () => {
     describe('createProject', () => {
       it('should create project with valid data', async () => {});
       it('should throw ValidationError with invalid data', async () => {});
       it('should enforce unique project codes', async () => {});
       it('should create audit log entry', async () => {});
     });
   });
   ```

6. Mocking Strategy:
   - Mock Prisma client for unit tests
   - Mock HTTP calls with MSW
   - Mock Stripe/Plaid in tests
   - Use test database for integration tests
   - Seed test data consistently

7. Test Data:
   - Factory functions for test data
   - Realistic test scenarios
   - Edge case data (empty, null, extreme values)
   - Invalid data for validation tests

8. Assertions:
   - Use specific matchers
   - Test error messages
   - Verify database state
   - Check audit log creation
   - Validate response structure

DELIVERABLES:
- Complete unit test suite
- Integration tests for critical paths
- Component tests for UI
- Test utilities and factories
- Test coverage report
- CI/CD integration config

Generate comprehensive tests for [SPECIFIC_FEATURE].
```

---

## 🚀 DEPLOYMENT & PRODUCTION READINESS PROMPT

```
Task: Prepare production deployment configuration and monitoring for RealCo platform.

CONTEXT:
Setting up production infrastructure on Railway (backend) and Vercel (frontend) with proper monitoring, logging, and error tracking.

REQUIREMENTS:

1. Environment Configuration:
   - Separate .env files for dev/staging/prod
   - Secrets management (Railway/Vercel secrets)
   - Environment validation on startup
   - Feature flags for gradual rollout

   ```env
   # Production .env
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   REDIS_URL=redis://...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   PLAID_CLIENT_ID=...
   PLAID_SECRET=...
   AWS_S3_BUCKET=realco-prod-docs
   LOG_LEVEL=info
   ENABLE_CONSTRUCTION_MODULE=true
   ```

2. Database Migration:
   - Production migration checklist
   - Backup before migration
   - Migration rollback plan
   - Zero-downtime migration strategy
   - Index creation during low traffic

   ```bash
   # Migration script
   #!/bin/bash
   # 1. Create backup
   railway run pg_dump > backup_$(date +%Y%m%d).sql
   # 2. Run migration
   railway run npx prisma migrate deploy
   # 3. Verify
   railway run npx prisma migrate status
   ```

3. Monitoring & Logging:
   - Structured logging (Winston/Pino)
   - Error tracking (Sentry)
   - Performance monitoring (Datadog/New Relic)
   - Uptime monitoring (Pingdom/UptimeRobot)
   - Log aggregation (CloudWatch/Papertrail)

   ```typescript
   // Logger setup
   import pino from 'pino';
   
   export const logger = pino({
     level: process.env.LOG_LEVEL || 'info',
     transport: {
       target: 'pino-pretty',
       options: { colorize: true }
     }
   });
   ```

4. Health Checks:
   - Liveness probe endpoint
   - Readiness probe endpoint
   - Database connection check
   - Redis connection check
   - External service health checks

   ```typescript
   app.get('/health', async (req, res) => {
     const checks = {
       database: await checkDatabase(),
       redis: await checkRedis(),
       stripe: await checkStripe(),
     };
     const healthy = Object.values(checks).every(c => c);
     res.status(healthy ? 200 : 503).json(checks);
   });
   ```

5. Performance Optimization:
   - Enable gzip compression
   - CDN for static assets
   - Database connection pooling
   - Query optimization
   - Caching strategy
   - Asset optimization (images, JS bundles)

6. Security Hardening:
   - HTTPS enforcement
   - Security headers (Helmet.js)
   - Rate limiting
   - CORS configuration
   - SQL injection prevention
   - XSS protection
   - CSRF tokens

   ```typescript
   import helmet from '@fastify/helmet';
   import rateLimit from '@fastify/rate-limit';
   
   app.register(helmet);
   app.register(rateLimit, {
     max: 100,
     timeWindow: '15 minutes'
   });
   ```

7. CI/CD Pipeline:
   - GitHub Actions workflow
   - Automated testing
   - Linting and type checking
   - Build verification
   - Deployment on merge to main
   - Rollback capability

   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy
   on:
     push:
       branches: [main]
   jobs:
     test:
       - run: npm test
     deploy:
       - run: railway up
       - run: vercel --prod
   ```

8. Disaster Recovery:
   - Automated database backups
   - Backup retention policy
   - Restore procedure documentation
   - Incident response playbook

DELIVERABLES:
- Production .env template
- Migration deployment script
- Health check endpoints
- Monitoring configuration
- CI/CD pipeline setup
- Security audit checklist
- Disaster recovery plan
- Deployment runbook

Generate production deployment configuration for [SPECIFIC_COMPONENT].
```

---

## 🔐 SECURITY & COMPLIANCE PROMPT

```
Task: Implement security measures and compliance checks for [SPECIFIC_FEATURE] in RealCo platform.

CONTEXT:
Ensuring SEC compliance, PCI-DSS adherence, and comprehensive security for real estate syndication and payment processing.

CRITICAL SECURITY REQUIREMENTS:

1. Data Encryption:
   - Encrypt sensitive data at rest (AES-256)
   - Encrypt data in transit (TLS 1.3)
   - Encrypt bank account numbers
   - Encrypt Plaid access tokens
   - Never log sensitive data
   - Secure key management

   ```typescript
   import crypto from 'crypto';
   
   const algorithm = 'aes-256-gcm';
   const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
   
   export function encrypt(text: string): string {
     const iv = crypto.randomBytes(16);
     const cipher = crypto.createCipheriv(algorithm, key, iv);
     const encrypted = Buffer.concat([
       cipher.update(text, 'utf8'),
       cipher.final()
     ]);
     const authTag = cipher.getAuthTag();
     return Buffer.concat([iv, authTag, encrypted]).toString('hex');
   }
   ```

2. Authentication & Authorization:
   - JWT with short expiration (15 min)
   - Refresh token rotation
   - Multi-factor authentication (MFA)
   - Role-based access control (RBAC)
   - Permission-level checks
   - Session management

3. Input Validation:
   - Sanitize all user inputs
   - Prevent SQL injection (use Prisma)
   - Prevent XSS attacks
   - Validate file uploads
   - Check content types
   - Limit file sizes

   ```typescript
   import DOMPurify from 'isomorphic-dompurify';
   
   export function sanitizeInput(input: string): string {
     return DOMPurify.sanitize(input, {
       ALLOWED_TAGS: [],
       ALLOWED_ATTR: []
     });
   }
   ```

4. Payment Security:
   - PCI-DSS Level 1 compliance
   - Never store card numbers
   - Use Stripe tokenization
   - Validate webhook signatures
   - Implement 3D Secure for cards
   - Fraud detection rules

5. Compliance Checks:
   - OFAC screening before transactions
   - Accredited investor verification
   - Investment limit checks
   - KYC/AML verification
   - Transaction reporting >$10k
   - SAR filing for suspicious activity

   ```typescript
   export async function runComplianceChecks(
     transaction: Transaction
   ): Promise<ComplianceResult> {
     return {
       ofacClear: await checkOFAC(transaction.userId),
       kycVerified: await checkKYC(transaction.userId),
       amlClear: await checkAML(transaction),
       withinLimits: await checkLimits(transaction),
       reportingRequired: transaction.amount > 10000
     };
   }
   ```

6. Audit Trail:
   - Log all state changes
   - Immutable audit logs
   - User action tracking
   - IP address logging
   - Timestamp all events
   - Retain for 7 years

   ```typescript
   await prisma.auditEvent.create({
     data: {
       userId,
       action: 'INVESTMENT_CREATED',
       entityType: 'Investment',
       entityId: investment.id,
       changes: JSON.stringify({ before: null, after: investment }),
       ipAddress: req.ip,
       userAgent: req.headers['user-agent']
     }
   });
   ```

7. Rate Limiting:
   - Per-user rate limits
   - Per-IP rate limits
   - API key throttling
   - Brute force protection
   - DDoS mitigation

8. Secrets Management:
   - Environment variables only
   - No secrets in code
   - Rotate keys regularly (90 days)
   - Separate keys per environment
   - Use Railway/Vercel secrets

DELIVERABLES:
- Encryption/decryption utilities
- Auth middleware
- Compliance check functions
- Audit logging system
- Rate limiting configuration
- Security test suite
- PCI compliance checklist
- Security documentation

Generate secure, compliant code for [SPECIFIC_FEATURE].
```

---

## 📈 PERFORMANCE OPTIMIZATION PROMPT

```
Task: Optimize performance for [SPECIFIC_FEATURE] to handle production load.

CONTEXT:
Ensuring RealCo platform can handle high traffic, large datasets, and concurrent users while maintaining fast response times.

OPTIMIZATION AREAS:

1. Database Query Optimization:
   - Use proper indexes
   - Avoid N+1 queries
   - Use select to limit fields
   - Implement cursor-based pagination
   - Use database transactions efficiently
   - Analyze query plans

   ```typescript
   // Before: N+1 query problem
   const projects = await prisma.project.findMany();
   for (const project of projects) {
     project.tasks = await prisma.task.findMany({
       where: { projectId: project.id }
     });
   }
   
   // After: Optimized with include
   const projects = await prisma.project.findMany({
     include: {
       tasks: {
         select: { id: true, taskName: true, status: true }
       }
     }
   });
   ```

2. Caching Strategy:
   - Redis for frequently accessed data
   - Cache invalidation on updates
   - TTL-based expiration
   - Cache warming
   - Query result caching

   ```typescript
   import { Redis } from 'ioredis';
   const redis = new Redis(process.env.REDIS_URL);
   
   async function getProject(id: number) {
     const cacheKey = `project:${id}`;
     const cached = await redis.get(cacheKey);
     
     if (cached) return JSON.parse(cached);
     
     const project = await prisma.project.findUnique({
       where: { id },
       include: { tasks: true }
     });
     
     await redis.setex(cacheKey, 300, JSON.stringify(project));
     return project;
   }
   ```

3. API Response Optimization:
   - Compress responses (gzip)
   - Minimize payload size
   - Use HTTP/2
   - Implement ETags
   - Enable browser caching

4. Frontend Performance:
   - Code splitting by route
   - Lazy load components
   - Optimize images (WebP, lazy loading)
   - Reduce bundle size
   - Tree shake unused code
   - Use CDN for static assets

   ```typescript
   // Code splitting
   const ProjectDashboard = lazy(() => 
     import('./components/ProjectDashboard')
   );
   
   // Component
   <Suspense fallback={<Loading />}>
     <ProjectDashboard />
   </Suspense>
   ```

5. Connection Pooling:
   - Database connection pool
   - HTTP keep-alive
   - WebSocket connection reuse

6. Async Operations:
   - Background jobs for heavy tasks
   - Queue system (Bull/BullMQ)
   - Worker threads for CPU-intensive
   - Batch processing

7. Monitoring:
   - Response time tracking
   - Database query duration
   - Error rate monitoring
   - Resource utilization
   - Real User Monitoring (RUM)

PERFORMANCE TARGETS:
- API response time: <200ms (p95)
- Page load time: <2s
- Time to interactive: <3s
- Database queries: <50ms (p95)
- Bundle size: <500KB initial

DELIVERABLES:
- Optimized database queries
- Caching implementation
- Background job setup
- Frontend optimization config
- Performance monitoring setup
- Load testing results
- Performance documentation

Generate optimized code for [SPECIFIC_FEATURE].
```

---

## 🎨 UI/UX IMPLEMENTATION PROMPT

```
Task: Implement pixel-perfect, accessible UI for [SPECIFIC_SCREEN] following RealCo design system.

CONTEXT:
Creating professional, investor-grade interface with excellent UX that works across all devices and meets WCAG 2.1 AA accessibility standards.

REQUIREMENTS:

1. Design System Adherence:
   - Use RealCo color palette
   - Follow typography scale
   - Consistent spacing (Tailwind scale)
   - Reusable component library
   - Dark mode support (optional)

   ```typescript
   // tailwind.config.js
   export default {
     theme: {
       extend: {
         colors: {
           primary: {
             50: '#f0f9ff',
             500: '#0ea5e9',
             900: '#0c4a6e',
           },
           // ... more colors
         },
         fontFamily: {
           sans: ['Inter', 'system-ui'],
         }
       }
     }
   }
   ```

2. Responsive Design:
   - Mobile-first approach
   - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
   - Touch-friendly targets (min 44x44px)
   - Responsive typography
   - Flexible layouts

3. Accessibility:
   - Semantic HTML
   - ARIA labels and roles
   - Keyboard navigation
   - Focus management
   - Screen reader support
   - Color contrast (4.5:1)
   - Skip links
   - Alt text for images

   ```typescript
   <button
     type="button"
     className="..."
     aria-label="Create new project"
     aria-describedby="project-help"
   >
     <PlusIcon className="w-5 h-5" aria-hidden="true" />
     <span className="sr-only">Create Project</span>
   </button>
   ```

4. Loading States:
   - Skeleton screens
   - Progress indicators
   - Optimistic updates
   - Infinite scroll loaders

5. Error Handling:
   - Inline validation errors
   - Toast notifications
   - Error boundaries
   - Retry mechanisms
   - Helpful error messages

6. Forms:
   - Clear labels
   - Helpful placeholders
   - Real-time validation
   - Error messages below fields
   - Success confirmation
   - Autofocus on mount
   - Tab order

7. Data Visualization:
   - Charts (Recharts/Victory)
   - Tables with sorting/filtering
   - Progress indicators
   - Status badges
   - Timeline views

8. Animations:
   - Subtle transitions
   - Loading animations
   - Page transitions
   - Micro-interactions
   - Respect prefers-reduced-motion

   ```typescript
   <div className="transition-all duration-200 hover:scale-105">
     {/* Content */}
   </div>
   ```

DELIVERABLES:
- Complete UI implementation
- Responsive across breakpoints
- Accessibility audit passed
- Loading/error/empty states
- Form validation
- Animation polish
- Component documentation

Generate production-ready UI for [SPECIFIC_SCREEN].
```

---

## 🔄 API INTEGRATION PROMPT

```
Task: Integrate [EXTERNAL_SERVICE] API into RealCo platform with proper error handling and resilience.

CONTEXT:
Integrating external services (Stripe, Plaid, AWS S3, etc.) with robust error handling, retry logic, and monitoring.

REQUIREMENTS:

1. API Client Setup:
   - TypeScript SDK if available
   - HTTP client configuration
   - Authentication handling
   - Base URL configuration
   - Timeout settings
   - Request/response interceptors

   ```typescript
   import Stripe from 'stripe';
   
   export const stripe = new Stripe(
     process.env.STRIPE_SECRET_KEY!,
     {
       apiVersion: '2023-10-16',
       typescript: true,
       timeout: 30000, // 30 seconds
       maxNetworkRetries: 3,
     }
   );
   ```

2. Error Handling:
   - Catch API errors
   - Parse error responses
   - Log errors with context
   - User-friendly error messages
   - Retry transient failures
   - Circuit breaker pattern

   ```typescript
   async function createStripePayment(amount: number) {
     try {
       const paymentIntent = await stripe.paymentIntents.create({
         amount,
         currency: 'usd',
       });
       return paymentIntent;
     } catch (error) {
       if (error instanceof Stripe.errors.StripeCardError) {
         // Card declined
         throw new PaymentError('Card declined', error.code);
       } else if (error instanceof Stripe.errors.StripeRateLimitError) {
         // Rate limit - retry
         await sleep(1000);
         return createStripePayment(amount);
       } else {
         logger.error('Stripe payment failed', { error, amount });
         throw new PaymentError('Payment processing failed');
       }
     }
   }
   ```

3. Webhook Handling:
   - Signature verification
   - Idempotency
   - Event logging
   - Async processing
   - Error recovery

   ```typescript
   app.post('/webhooks/stripe', async (req, res) => {
     const sig = req.headers['stripe-signature']!;
     
     let event: Stripe.Event;
     try {
       event = stripe.webhooks.constructEvent(
         req.body,
         sig,
         process.env.STRIPE_WEBHOOK_SECRET!
       );
     } catch (err) {
       return res.status(400).send('Invalid signature');
     }
     
     // Check for duplicate processing
     const exists = await prisma.webhookEvent.findUnique({
       where: { eventId: event.id }
     });
     if (exists) return res.json({ received: true });
     
     // Log webhook
     await prisma.webhookEvent.create({
       data: { eventId: event.id, type: event.type, payload: event }
     });
     
     // Process asynchronously
     await queue.add('process-webhook', { eventId: event.id });
     
     return res.json({ received: true });
   });
   ```

4. Rate Limiting:
   - Respect API rate limits
   - Implement exponential backoff
   - Queue requests if needed
   - Monitor usage

5. Testing:
   - Mock API responses
   - Test error scenarios
   - Integration tests with sandbox
   - Webhook testing

6. Monitoring:
   - Log all API calls
   - Track response times
   - Error rate monitoring
   - Usage metrics

DELIVERABLES:
- API client configuration
- Service wrapper functions
- Error handling implementation
- Webhook handlers
- Retry logic
- Integration tests
- API usage documentation

Generate complete integration code for [EXTERNAL_SERVICE].
```

---

## 📱 MOBILE-RESPONSIVE PROMPT

```
Task: Make [COMPONENT/SCREEN] fully responsive and mobile-optimized.

REQUIREMENTS:

1. Breakpoint Strategy:
   - Mobile: <640px (default)
   - Tablet: 640px-1023px (sm/md)
   - Desktop: ≥1024px (lg/xl)

2. Mobile Optimizations:
   - Touch targets ≥44x44px
   - Thumb-friendly navigation
   - Hamburger menu for mobile
   - Bottom navigation if needed
   - Swipe gestures
   - Pull to refresh

3. Layout Adaptations:
   - Stack columns on mobile
   - Hide/show elements by breakpoint
   - Responsive font sizes
   - Flexible images
   - Scroll containers

4. Performance:
   - Lazy load images
   - Code split by route
   - Minimize initial bundle
   - Progressive Web App (PWA)

Example responsive component:
```typescript
export function DashboardGrid({ projects }: Props) {
  return (
    <div className="
      grid gap-4
      grid-cols-1          // Mobile: 1 column
      sm:grid-cols-2       // Tablet: 2 columns
      lg:grid-cols-3       // Desktop: 3 columns
      xl:grid-cols-4       // Large: 4 columns
    ">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

Generate fully responsive implementation for [COMPONENT].
```

---

## 🎯 QUICK FEATURE PROMPTS

### Database Query
```
Write an optimized Prisma query to [DESCRIPTION] with proper error handling and TypeScript types.
```

### API Endpoint
```
Create a Fastify POST endpoint at /api/v1/[RESOURCE] that [DESCRIPTION], including validation, auth, and error handling.
```

### React Component
```
Build a React component [COMPONENT_NAME] that [DESCRIPTION] with loading/error states, TypeScript types, and TailwindCSS styling.
```

### Form Handling
```
Implement a form for [FEATURE] using React Hook Form and Zod validation, with proper error display and submit handling.
```

### Authentication
```
Add JWT authentication middleware for [ENDPOINT] with role-based access control for [ROLES].
```

### Payment Processing
```
Implement Stripe payment processing for [PAYMENT_TYPE] with webhook handling and transaction logging.
```

### Testing
```
Write comprehensive Vitest tests for [FUNCTION/COMPONENT] covering happy path and error scenarios.
```

---

## 🚨 TROUBLESHOOTING PROMPTS

### Debug Build Error
```
I'm getting this TypeScript/build error: [ERROR_MESSAGE]

Code context:
[PASTE CODE]

Fix the error and explain the solution.
```

### Fix Performance Issue
```
This query/component is slow: [DESCRIPTION]

Current implementation:
[PASTE CODE]

Optimize it for better performance.
```

### Resolve Deployment Error
```
Deployment is failing with: [ERROR_MESSAGE]

Environment: [Railway/Vercel]
Configuration: [RELEVANT_CONFIG]

Debug and fix the deployment issue.
```

---

## ✅ CODE REVIEW CHECKLIST PROMPT

```
Review this code for production readiness:

[PASTE CODE]

Check for:
1. TypeScript type safety
2. Error handling completeness
3. Security vulnerabilities
4. Performance issues
5. Code organization
6. Test coverage
7. Documentation
8. Edge cases
9. Database transaction safety
10. Accessibility (for UI)

Provide specific improvements with code examples.
```

---

## 📚 DOCUMENTATION PROMPT

```
Generate comprehensive documentation for [FEATURE/MODULE]:

Include:
1. Overview and purpose
2. Architecture diagram (ASCII)
3. API endpoints (if applicable)
4. Database schema (if applicable)
5. Usage examples
6. Error handling
7. Configuration
8. Testing approach
9. Deployment notes
10. Known limitations

Format in Markdown with code examples.
```

---

## END OF CURSOR PROMPTS

These prompts are optimized for Claude Sonnet 4.5 and designed to produce production-ready code. Use the MASTER CONTEXT PROMPT first, then select specific prompts based on your current task.

Remember to:
- Replace [SPECIFIC_MODULE], [SPECIFIC_FEATURE], etc. with actual names
- Provide relevant context from your codebase
- Ask for clarifications if needed
- Request code reviews before deploying

For best results, break large features into smaller tasks and use multiple prompts in sequence.
