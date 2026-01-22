# RealCo-Kealee Troubleshooting Guide
## Common Issues & Solutions

---

## 🔍 TABLE OF CONTENTS

1. [Database Issues](#database-issues)
2. [Deployment Issues](#deployment-issues)
3. [Payment Processing Issues](#payment-processing-issues)
4. [Authentication Issues](#authentication-issues)
5. [API Issues](#api-issues)
6. [Frontend Issues](#frontend-issues)
7. [Performance Issues](#performance-issues)
8. [Security Issues](#security-issues)

---

## DATABASE ISSUES

### Issue: Prisma Migration Fails

**Symptoms:**
```
Error: P3005: The database schema is not empty
```

**Solution:**
```bash
# Option 1: Reset database (DEV ONLY)
npx prisma migrate reset

# Option 2: Create migration from existing schema
npx prisma db pull
npx prisma migrate dev --name init

# Option 3: Force apply migrations (be careful)
npx prisma migrate deploy --force
```

**Prevention:**
- Always backup before migrations
- Test migrations on development first
- Use migrations in correct order

---

### Issue: N+1 Query Problem (Slow Queries)

**Symptoms:**
```typescript
// This creates N+1 queries
const projects = await prisma.project.findMany();
for (const project of projects) {
  project.tasks = await prisma.task.findMany({
    where: { projectId: project.id }
  });
}
```

**Solution:**
```typescript
// Use include to fetch related data in one query
const projects = await prisma.project.findMany({
  include: {
    tasks: {
      where: { status: 'IN_PROGRESS' },
      orderBy: { priority: 'desc' }
    }
  }
});
```

**Debug:**
```typescript
// Enable query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

// Check query performance
const result = await prisma.$queryRaw`
  EXPLAIN ANALYZE
  SELECT * FROM projects WHERE id = ${projectId}
`;
```

---

### Issue: Transaction Timeout

**Symptoms:**
```
Error: Transaction timed out after 5000ms
```

**Solution:**
```typescript
// Increase transaction timeout
const result = await prisma.$transaction(
  async (tx) => {
    // Your transaction logic
  },
  {
    maxWait: 10000, // 10 seconds
    timeout: 30000  // 30 seconds
  }
);

// Or break into smaller transactions
await prisma.transaction.create({ ... });
await prisma.escrowAccount.update({ ... });
// Instead of one big transaction
```

---

### Issue: Foreign Key Constraint Error

**Symptoms:**
```
Error: Foreign key constraint failed on the field: `developmentProjectId`
```

**Solution:**
```typescript
// Always verify foreign key exists first
const developmentProject = await prisma.developmentProject.findUnique({
  where: { id: developmentProjectId }
});

if (!developmentProject) {
  throw new NotFoundError('Development project not found');
}

// Then create related record
const project = await prisma.project.create({
  data: {
    developmentProjectId,
    // ... other fields
  }
});
```

---

### Issue: Database Connection Pool Exhausted

**Symptoms:**
```
Error: Can't reach database server
Error: Too many connections
```

**Solution:**
```typescript
// Configure connection pool in Prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  
  // Add connection pool configuration
  // Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?connection_limit=10&pool_timeout=20
}

// Or in environment variable
DATABASE_URL="postgresql://user:pass@localhost:5432/realco?connection_limit=10"

// Ensure you're closing connections
await prisma.$disconnect();
```

---

## DEPLOYMENT ISSUES

### Issue: Railway Build Fails

**Symptoms:**
```
Error: ENOENT: no such file or directory, open 'dist/server.js'
```

**Solution:**
```json
// package.json - ensure build script is correct
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "start:prod": "node dist/server.js"
  }
}

// railway.json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod"
  }
}
```

**Check:**
```bash
# Test build locally
npm run build
node dist/server.js

# Check if dist folder is created
ls -la dist/
```

---

### Issue: Environment Variables Not Loading

**Symptoms:**
```
Error: process.env.STRIPE_SECRET_KEY is undefined
```

**Solution:**
```bash
# Railway - check variables are set
railway variables

# Set missing variables
railway variables set STRIPE_SECRET_KEY=sk_live_xxx

# For local development, use .env
cp .env.example .env
# Fill in values

# Load environment variables in code
import dotenv from 'dotenv';
dotenv.config();

// Validate required env vars on startup
const required = ['DATABASE_URL', 'JWT_SECRET', 'STRIPE_SECRET_KEY'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

---

### Issue: Vercel Build Timeout

**Symptoms:**
```
Error: Build exceeded maximum time
```

**Solution:**
```javascript
// vite.config.ts - optimize build
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          // Split large dependencies
        }
      }
    }
  }
});

// Remove unused dependencies
npm prune

// Use lighter alternatives if possible
// e.g., date-fns instead of moment
```

---

### Issue: CORS Errors in Production

**Symptoms:**
```
Access to fetch at 'https://api.realco.com' from origin 'https://app.realco.com' 
has been blocked by CORS policy
```

**Solution:**
```typescript
// Backend - configure CORS properly
import cors from '@fastify/cors';

app.register(cors, {
  origin: [
    'https://app.realco.com',
    'https://realco.vercel.app',
    process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : ''
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
});
```

---

## PAYMENT PROCESSING ISSUES

### Issue: Stripe Webhook Signature Verification Fails

**Symptoms:**
```
Error: No signatures found matching the expected signature for payload
```

**Solution:**
```typescript
// Check webhook secret is correct
console.log('Expected secret:', process.env.STRIPE_WEBHOOK_SECRET);

// Ensure raw body is passed to Stripe
app.post('/webhooks/stripe',
  {
    config: {
      rawBody: true  // Important for signature verification
    }
  },
  async (request, reply) => {
    const sig = request.headers['stripe-signature'];
    
    try {
      const event = stripe.webhooks.constructEvent(
        request.rawBody,  // Must be raw body, not parsed JSON
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      // Process event...
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return reply.code(400).send({ error: err.message });
    }
  }
);
```

**Test:**
```bash
# Use Stripe CLI to test webhooks locally
stripe listen --forward-to localhost:8080/webhooks/stripe
stripe trigger payment_intent.succeeded
```

---

### Issue: Payment Fails Silently

**Symptoms:**
- Payment intent created but never completes
- No error messages
- Transaction stuck in PROCESSING

**Solution:**
```typescript
// Add comprehensive error handling
async function processPayment(transactionId: number) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { fromBankAccount: true }
    });
    
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }
    
    // Log attempt
    console.log('Processing payment:', {
      transactionId,
      amount: transaction.amount,
      paymentIntentId: transaction.stripePaymentIntentId
    });
    
    const paymentIntent = await stripe.paymentIntents.confirm(
      transaction.stripePaymentIntentId,
      {
        payment_method: transaction.fromBankAccount.stripePaymentMethodId
      }
    );
    
    // Log success
    console.log('Payment confirmed:', paymentIntent.id);
    
    await updateTransactionStatus(transactionId, 'PROCESSING');
    
  } catch (error) {
    // Log detailed error
    console.error('Payment processing failed:', {
      transactionId,
      error: error.message,
      code: error.code,
      type: error.type
    });
    
    // Update transaction with error
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'FAILED',
        failureCode: error.code,
        failureReason: error.message
      }
    });
    
    throw error;
  }
}
```

---

### Issue: Plaid Link Opens But Doesn't Complete

**Symptoms:**
- Plaid Link opens successfully
- User selects bank
- Window closes but no callback

**Solution:**
```typescript
// Frontend - ensure onSuccess callback is working
import { usePlaidLink } from 'react-plaid-link';

const { open, ready } = usePlaidLink({
  token: linkToken,
  onSuccess: async (publicToken, metadata) => {
    console.log('Plaid success:', { publicToken, metadata });
    
    try {
      // Exchange public token
      const response = await fetch('/api/bank-accounts/verify/plaid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicToken })
      });
      
      if (!response.ok) {
        throw new Error('Failed to exchange token');
      }
      
      const result = await response.json();
      console.log('Bank account added:', result);
      
      // Update UI
      refetchBankAccounts();
    } catch (error) {
      console.error('Token exchange failed:', error);
      setError('Failed to add bank account');
    }
  },
  onExit: (err, metadata) => {
    if (err) {
      console.error('Plaid Link error:', err);
      setError('Bank connection failed');
    }
  }
});

// Backend - verify token exchange
app.post('/api/bank-accounts/verify/plaid', async (request, reply) => {
  const { publicToken } = request.body;
  
  console.log('Exchanging public token...');
  
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken
    });
    
    console.log('Token exchanged successfully');
    
    const accessToken = response.data.access_token;
    // Continue with account setup...
    
  } catch (error) {
    console.error('Plaid token exchange failed:', error);
    throw error;
  }
});
```

---

## AUTHENTICATION ISSUES

### Issue: JWT Token Expires Too Quickly

**Symptoms:**
- Users logged out frequently
- "Unauthorized" errors during normal usage

**Solution:**
```typescript
// Increase token expiry
const JWT_EXPIRY = '1h';  // Instead of '15m'
const REFRESH_TOKEN_EXPIRY = '30d';  // Instead of '7d'

// Implement token refresh on frontend
import { useEffect } from 'react';

function useTokenRefresh() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });
          
          const { accessToken } = await response.json();
          localStorage.setItem('accessToken', accessToken);
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Redirect to login
          window.location.href = '/login';
        }
      }
    }, 50 * 60 * 1000); // Refresh every 50 minutes (before 1h expiry)
    
    return () => clearInterval(interval);
  }, []);
}
```

---

### Issue: "Invalid or expired token" on Valid Token

**Symptoms:**
```
Error: Invalid or expired token
```

**Solution:**
```typescript
// Check JWT_SECRET is consistent
console.log('JWT_SECRET:', process.env.JWT_SECRET?.substring(0, 10) + '...');

// Verify token manually
import jwt from 'jsonwebtoken';

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Token valid:', decoded);
} catch (error) {
  console.error('Token verification failed:', error.message);
  
  if (error.name === 'TokenExpiredError') {
    console.log('Token expired at:', error.expiredAt);
  } else if (error.name === 'JsonWebTokenError') {
    console.log('Invalid token format');
  }
}

// Ensure consistent token generation
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
      issuer: 'realco-api',  // Must match verification
      algorithm: 'HS256'     // Specify algorithm
    }
  );
}
```

---

## API ISSUES

### Issue: 413 Payload Too Large

**Symptoms:**
```
Error: Request entity too large
```

**Solution:**
```typescript
// Increase body size limit
import multipart from '@fastify/multipart';

app.register(multipart, {
  limits: {
    fieldNameSize: 100,
    fieldSize: 100,
    fields: 10,
    fileSize: 10 * 1024 * 1024,  // 10MB
    files: 5,
    headerPairs: 2000
  }
});

// For JSON bodies
app.addContentTypeParser(
  'application/json',
  { parseAs: 'string' },
  function (req, body, done) {
    try {
      const json = JSON.parse(body, { limit: '10mb' });
      done(null, json);
    } catch (err) {
      err.statusCode = 400;
      done(err, undefined);
    }
  }
);
```

---

### Issue: Rate Limiting Blocking Legitimate Requests

**Symptoms:**
```
Error: Too many requests
```

**Solution:**
```typescript
// Adjust rate limits
import rateLimit from '@fastify/rate-limit';

app.register(rateLimit, {
  max: 1000,           // Increased from 100
  timeWindow: '15min',
  
  // Different limits per route
  keyGenerator: (request) => {
    return request.user?.id || request.ip;
  },
  
  // Whitelist certain IPs
  allowList: [
    '127.0.0.1',
    // Your office IP
  ],
  
  // Skip rate limit for admins
  skip: (request) => {
    return request.user?.role === 'ADMIN';
  }
});

// Different limits for different routes
app.register(rateLimit, {
  max: 5,
  timeWindow: '1min'
}, {
  prefix: '/api/auth/login'  // Strict limit on login
});
```

---

### Issue: Validation Errors Not Clear

**Symptoms:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [...]  // Unclear what's wrong
}
```

**Solution:**
```typescript
// Use Zod for clear error messages
import { z } from 'zod';

const createProjectSchema = z.object({
  developmentProjectId: z.number({
    required_error: "Development project ID is required",
    invalid_type_error: "Development project ID must be a number"
  }).int().positive(),
  
  plannedStartDate: z.string().datetime({
    message: "Start date must be in ISO 8601 format (e.g., 2025-02-01T00:00:00Z)"
  }),
  
  plannedEndDate: z.string().datetime(),
}).refine(
  data => new Date(data.plannedEndDate) > new Date(data.plannedStartDate),
  {
    message: "End date must be after start date",
    path: ['plannedEndDate']
  }
);

// Format errors nicely
try {
  const data = createProjectSchema.parse(request.body);
} catch (error) {
  if (error instanceof z.ZodError) {
    return reply.code(400).send({
      success: false,
      error: 'Validation failed',
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }
}
```

---

## FRONTEND ISSUES

### Issue: React Query Not Refetching

**Symptoms:**
- Data not updating after mutation
- Stale data displayed

**Solution:**
```typescript
// Ensure invalidation is working
const updateProject = useMutation({
  mutationFn: (data) => api.updateProject(id, data),
  onSuccess: () => {
    // Invalidate all project queries
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    
    // Or invalidate specific query
    queryClient.invalidateQueries({ queryKey: ['projects', id] });
    
    // Or set data directly
    queryClient.setQueryData(['projects', id], updatedProject);
  }
});

// Check if queries are being cached correctly
const { data } = useQuery({
  queryKey: ['projects', id],  // Must include all dependencies
  queryFn: () => api.getProject(id),
  enabled: !!id,  // Don't fetch if no id
  staleTime: 5 * 60 * 1000  // 5 minutes
});
```

---

### Issue: Infinite Re-renders

**Symptoms:**
```
Error: Maximum update depth exceeded
```

**Solution:**
```typescript
// Problem: Creating new object in render
function MyComponent() {
  const filters = { status: 'active' };  // New object each render!
  
  const { data } = useQuery({
    queryKey: ['projects', filters],  // Different key each render!
    queryFn: () => api.getProjects(filters)
  });
}

// Solution: Stable reference
function MyComponent() {
  const [filters] = useState({ status: 'active' });  // Stable
  
  const { data } = useQuery({
    queryKey: ['projects', filters],
    queryFn: () => api.getProjects(filters)
  });
}

// Or use useMemo
const filters = useMemo(() => ({ status: 'active' }), []);
```

---

### Issue: Form Not Validating

**Symptoms:**
- Form submits with invalid data
- Validation messages not showing

**Solution:**
```typescript
// Ensure schema is connected to form
const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm<FormData>({
  resolver: zodResolver(schema),  // Connect Zod schema
  mode: 'onBlur'  // Validate on blur
});

// Check errors object
console.log('Form errors:', errors);

// Ensure error messages are displayed
{errors.email && (
  <p className="text-red-600 text-sm mt-1">
    {errors.email.message}
  </p>
)}

// Trigger validation manually
const { trigger } = useForm();
await trigger('email');  // Validate single field
await trigger();  // Validate all fields
```

---

## PERFORMANCE ISSUES

### Issue: Slow Database Queries

**Symptoms:**
- API responses taking >1 second
- Database CPU usage high

**Solution:**
```sql
-- Add missing indexes
CREATE INDEX idx_projects_phase ON projects(project_phase);
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_transactions_user_status ON transactions(from_user_id, status);

-- Composite index for common queries
CREATE INDEX idx_tasks_project_phase_status 
ON tasks(project_id, phase, status);

-- Check query plan
EXPLAIN ANALYZE
SELECT * FROM tasks
WHERE project_id = 1 AND status = 'IN_PROGRESS';

-- Look for "Seq Scan" (bad) vs "Index Scan" (good)
```

**Optimize in Prisma:**
```typescript
// Use select to limit fields
const projects = await prisma.project.findMany({
  select: {
    id: true,
    projectCode: true,
    projectPhase: true,
    overallProgress: true,
    // Only fields you need
  }
});

// Use cursor pagination for large datasets
const tasks = await prisma.task.findMany({
  take: 20,
  skip: 1,
  cursor: { id: lastTaskId },
  orderBy: { id: 'asc' }
});
```

---

### Issue: Frontend Bundle Too Large

**Symptoms:**
- Initial page load >5 seconds
- Large JavaScript files

**Solution:**
```typescript
// Code splitting by route
const ProjectDashboard = lazy(() => import('./components/ProjectDashboard'));
const PaymentDashboard = lazy(() => import('./components/PaymentDashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/projects" element={<ProjectDashboard />} />
        <Route path="/payments" element={<PaymentDashboard />} />
      </Routes>
    </Suspense>
  );
}

// Analyze bundle size
npm run build
npx vite-bundle-visualizer

// Use lighter alternatives
// Instead of: moment (huge)
// Use: date-fns (tree-shakeable)

// Dynamic imports for heavy components
const HeavyChart = lazy(() =>
  import('./components/HeavyChart').then(module => ({
    default: module.HeavyChart
  }))
);
```

---

## SECURITY ISSUES

### Issue: SQL Injection Vulnerability

**Symptoms:**
- User can inject SQL in inputs
- Unexpected database behavior

**Solution:**
```typescript
// ❌ NEVER do this
const email = request.body.email;
const user = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = '${email}'
`;  // Vulnerable to SQL injection!

// ✅ Always use parameterized queries
const user = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${email}
`;  // Safe - Prisma handles escaping

// ✅ Or use Prisma's type-safe methods
const user = await prisma.user.findUnique({
  where: { email }
});  // Safest
```

---

### Issue: XSS Vulnerability

**Symptoms:**
- User can inject JavaScript
- Scripts execute in browser

**Solution:**
```typescript
// Backend - sanitize inputs
import DOMPurify from 'isomorphic-dompurify';

const sanitizedContent = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: [],  // No HTML tags
  ALLOWED_ATTR: []
});

// Frontend - use dangerouslySetInnerHTML only when necessary
// ❌ Dangerous
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ Safe
<div>{userContent}</div>  // React escapes by default

// ✅ If HTML needed, sanitize first
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userContent)
}} />
```

---

### Issue: Sensitive Data in Logs

**Symptoms:**
- Passwords, tokens visible in logs
- Compliance violation

**Solution:**
```typescript
// Configure logger to redact sensitive fields
import pino from 'pino';

const logger = pino({
  redact: {
    paths: [
      'req.headers.authorization',
      'password',
      'token',
      'secret',
      'accessToken',
      'refreshToken',
      'accountNumber',
      'routingNumber',
      'ssn',
      '*.password',
      '*.token'
    ],
    remove: true
  }
});

// Never log sensitive data
logger.info({ user, password: '***' });  // ✅ Masked
logger.info({ user, password });  // ❌ Never do this!
```

---

## 🆘 GETTING HELP

If you can't resolve an issue:

1. **Check Logs**
   ```bash
   # Railway
   railway logs
   
   # Vercel
   vercel logs
   
   # Local
   npm run dev
   ```

2. **Enable Debug Mode**
   ```typescript
   // Backend
   const prisma = new PrismaClient({ log: ['query', 'error'] });
   
   // Frontend
   localStorage.debug = 'app:*';
   ```

3. **Search Documentation**
   - Prisma: https://www.prisma.io/docs
   - Fastify: https://www.fastify.io/docs
   - Stripe: https://stripe.com/docs
   - Plaid: https://plaid.com/docs

4. **Community Support**
   - Stack Overflow
   - GitHub Issues
   - Discord servers

5. **Create Minimal Reproduction**
   - Isolate the problem
   - Remove unrelated code
   - Share on GitHub Gist

---

**Remember:** Most issues have been solved before. Search error messages, check documentation, and don't hesitate to ask for help!
