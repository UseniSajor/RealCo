# RealCo-Kealee Integration - Quick Reference Guide
## Common Patterns & Code Snippets

---

## 📚 TABLE OF CONTENTS

1. [Database Operations](#database-operations)
2. [API Patterns](#api-patterns)
3. [Authentication & Authorization](#authentication--authorization)
4. [Payment Processing](#payment-processing)
5. [File Uploads](#file-uploads)
6. [Email Notifications](#email-notifications)
7. [Error Handling](#error-handling)
8. [Testing Patterns](#testing-patterns)
9. [Common Utilities](#common-utilities)
10. [Frontend Patterns](#frontend-patterns)

---

## DATABASE OPERATIONS

### Basic CRUD with Prisma

```typescript
// CREATE
const project = await prisma.project.create({
  data: {
    developmentProjectId: 1,
    projectCode: 'RC-2025-001',
    projectPhase: 'PRE_CONSTRUCTION',
    plannedStartDate: new Date('2025-02-01'),
    plannedEndDate: new Date('2025-12-31')
  }
});

// READ (single)
const project = await prisma.project.findUnique({
  where: { id: 1 },
  include: {
    tasks: {
      where: { status: 'IN_PROGRESS' },
      orderBy: { priority: 'desc' }
    },
    developmentProject: true
  }
});

// READ (multiple with pagination)
const projects = await prisma.project.findMany({
  where: {
    projectPhase: { in: ['FOUNDATION', 'FRAMING'] },
    actualStartDate: { gte: new Date('2025-01-01') }
  },
  orderBy: { createdAt: 'desc' },
  skip: (page - 1) * limit,
  take: limit,
  include: {
    _count: { select: { tasks: true } }
  }
});

// UPDATE
const project = await prisma.project.update({
  where: { id: 1 },
  data: {
    projectPhase: 'FRAMING',
    overallProgress: 45.5,
    updatedAt: new Date()
  }
});

// DELETE (soft delete pattern)
const project = await prisma.project.update({
  where: { id: 1 },
  data: { 
    deletedAt: new Date(),
    isActive: false 
  }
});

// COUNT
const activeProjects = await prisma.project.count({
  where: {
    deletedAt: null,
    projectPhase: { not: 'COMPLETE' }
  }
});
```

### Transactions for Data Integrity

```typescript
// Multi-table transaction
const result = await prisma.$transaction(async (tx) => {
  // 1. Create transaction
  const transaction = await tx.transaction.create({
    data: {
      transactionType: 'INVESTMENT_DEPOSIT',
      amount: 50000,
      fromUserId: investorId,
      status: 'INITIATED'
    }
  });

  // 2. Update investment
  const investment = await tx.investment.update({
    where: { id: investmentId },
    data: {
      investmentStatus: 'FUNDED',
      fundedAt: new Date()
    }
  });

  // 3. Update escrow account
  await tx.escrowAccount.update({
    where: { id: escrowAccountId },
    data: {
      currentBalance: { increment: 50000 }
    }
  });

  // 4. Create ledger entry
  await tx.escrowLedgerEntry.create({
    data: {
      escrowAccountId,
      transactionId: transaction.id,
      entryType: 'CREDIT',
      amount: 50000
    }
  });

  // 5. Create audit log
  await tx.auditEvent.create({
    data: {
      action: 'INVESTMENT_FUNDED',
      entityType: 'Investment',
      entityId: investment.id,
      userId: investorId
    }
  });

  return { transaction, investment };
});
```

### Optimized Queries (Avoiding N+1)

```typescript
// ❌ BAD: N+1 query problem
const projects = await prisma.project.findMany();
for (const project of projects) {
  project.tasks = await prisma.task.findMany({
    where: { projectId: project.id }
  });
  project.taskCount = project.tasks.length;
}

// ✅ GOOD: Single query with include
const projects = await prisma.project.findMany({
  include: {
    tasks: {
      select: {
        id: true,
        taskName: true,
        status: true,
        percentComplete: true
      }
    },
    _count: {
      select: { tasks: true }
    }
  }
});

// ✅ BETTER: Aggregations for counts
const projectsWithStats = await prisma.project.findMany({
  include: {
    _count: {
      select: {
        tasks: true,
        dailyLogs: true,
        rfi: true
      }
    }
  }
});
```

### Raw SQL for Complex Queries

```typescript
// Complex aggregation with raw SQL
const projectStats = await prisma.$queryRaw<ProjectStats[]>`
  SELECT 
    p.id,
    p.project_code,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'COMPLETED' THEN t.id END) as completed_tasks,
    AVG(t.percent_complete) as avg_progress,
    SUM(t.actual_cost) as total_cost
  FROM projects p
  LEFT JOIN tasks t ON t.project_id = p.id
  WHERE p.deleted_at IS NULL
  GROUP BY p.id, p.project_code
  ORDER BY p.created_at DESC
`;

// Always use parameterized queries to prevent SQL injection
const projects = await prisma.$queryRaw`
  SELECT * FROM projects
  WHERE project_phase = ${phase}
  AND created_at >= ${startDate}
`;
```

---

## API PATTERNS

### Standard REST Endpoint Template

```typescript
// routes/projects.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ProjectService } from '../services/project.service';
import { authenticate, authorize } from '../middleware/auth';

const createProjectSchema = z.object({
  developmentProjectId: z.number().int().positive(),
  plannedStartDate: z.string().datetime(),
  plannedEndDate: z.string().datetime(),
  workingDaysPerWeek: z.number().int().min(1).max(7).default(5)
});

export async function projectRoutes(server: FastifyInstance) {
  const projectService = new ProjectService(server.prisma);

  // CREATE
  server.post('/projects',
    { 
      preHandler: [authenticate, authorize(['SPONSOR', 'ADMIN'])]
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const data = createProjectSchema.parse(request.body);
        
        const project = await projectService.createProject(
          data.developmentProjectId,
          data,
          request.user.id
        );
        
        reply.code(201).send({
          success: true,
          data: project
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({
            success: false,
            error: 'Validation failed',
            details: error.errors
          });
        }
        throw error;
      }
    }
  );

  // READ (single)
  server.get('/projects/:id',
    { preHandler: authenticate },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const projectId = parseInt(request.params.id);
      
      const project = await projectService.getProject(
        projectId,
        request.user.id
      );
      
      if (!project) {
        return reply.code(404).send({
          success: false,
          error: 'Project not found'
        });
      }
      
      reply.send({
        success: true,
        data: project
      });
    }
  );

  // READ (list with filters)
  server.get('/projects',
    { preHandler: authenticate },
    async (request: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        phase?: string;
        status?: string;
      }
    }>, reply) => {
      const page = parseInt(request.query.page || '1');
      const limit = parseInt(request.query.limit || '20');
      
      const { projects, total } = await projectService.getProjects({
        userId: request.user.id,
        phase: request.query.phase,
        page,
        limit
      });
      
      reply.send({
        success: true,
        data: projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    }
  );

  // UPDATE
  server.patch('/projects/:id',
    { preHandler: [authenticate, authorize(['SPONSOR', 'CONTRACTOR', 'ADMIN'])] },
    async (request: FastifyRequest<{
      Params: { id: string };
      Body: any;
    }>, reply) => {
      const projectId = parseInt(request.params.id);
      
      const project = await projectService.updateProject(
        projectId,
        request.body,
        request.user.id
      );
      
      reply.send({
        success: true,
        data: project
      });
    }
  );

  // DELETE
  server.delete('/projects/:id',
    { preHandler: [authenticate, authorize(['ADMIN'])] },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const projectId = parseInt(request.params.id);
      
      await projectService.deleteProject(projectId, request.user.id);
      
      reply.code(204).send();
    }
  );
}
```

### Error Response Standardization

```typescript
// types/api.types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// middleware/errorHandler.ts
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log error
  logger.error('Request error', {
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    userId: request.user?.id
  });

  // Handle known errors
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      success: false,
      error: error.message,
      details: error.details
    });
  }

  // Handle Prisma errors
  if (error.code === 'P2002') {
    return reply.code(409).send({
      success: false,
      error: 'Duplicate entry',
      details: error.meta
    });
  }

  // Handle validation errors
  if (error.validation) {
    return reply.code(400).send({
      success: false,
      error: 'Validation failed',
      details: error.validation
    });
  }

  // Default 500 error
  reply.code(500).send({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message
  });
}
```

---

## AUTHENTICATION & AUTHORIZATION

### JWT Token Generation & Validation

```typescript
// utils/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    issuer: 'realco-api'
  });
}

export function generateRefreshToken(userId: number): string {
  return jwt.sign(
    { userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

// middleware/auth.ts
import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number;
      email: string;
      role: string;
    };
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }
    
    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    
    // Attach user to request
    request.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    reply.code(401).send({
      success: false,
      error: 'Authentication required'
    });
  }
}

export function authorize(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!allowedRoles.includes(request.user.role)) {
      return reply.code(403).send({
        success: false,
        error: 'Insufficient permissions'
      });
    }
  };
}

// Usage in routes
server.get('/admin/users',
  { preHandler: [authenticate, authorize(['ADMIN'])] },
  async (request, reply) => {
    // Only admins can access
  }
);
```

### Login Flow with Refresh Tokens

```typescript
// routes/auth.ts
server.post('/auth/login', async (request, reply) => {
  const { email, password } = request.body;
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    return reply.code(401).send({
      success: false,
      error: 'Invalid credentials'
    });
  }
  
  // Verify password
  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return reply.code(401).send({
      success: false,
      error: 'Invalid credentials'
    });
  }
  
  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });
  
  const refreshToken = generateRefreshToken(user.id);
  
  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });
  
  reply.send({
    success: true,
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }
  });
});

server.post('/auth/refresh', async (request, reply) => {
  const { refreshToken } = request.body;
  
  // Verify refresh token
  const payload = jwt.verify(refreshToken, JWT_SECRET) as { userId: number };
  
  // Check if token exists and not expired
  const storedToken = await prisma.refreshToken.findFirst({
    where: {
      token: refreshToken,
      userId: payload.userId,
      expiresAt: { gte: new Date() },
      revokedAt: null
    },
    include: { user: true }
  });
  
  if (!storedToken) {
    return reply.code(401).send({
      success: false,
      error: 'Invalid refresh token'
    });
  }
  
  // Generate new access token
  const accessToken = generateAccessToken({
    userId: storedToken.user.id,
    email: storedToken.user.email,
    role: storedToken.user.role
  });
  
  reply.send({
    success: true,
    data: { accessToken }
  });
});
```

---

## PAYMENT PROCESSING

### Stripe Payment Intent Creation

```typescript
// services/payment.service.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true
});

export class PaymentService {
  async createInvestmentPayment(
    investmentId: number,
    amount: number,
    investorId: number
  ): Promise<Transaction> {
    return await prisma.$transaction(async (tx) => {
      // 1. Get investment and investor
      const investment = await tx.investment.findUnique({
        where: { id: investmentId },
        include: { offering: true }
      });
      
      const investor = await tx.user.findUnique({
        where: { id: investorId },
        include: { 
          bankAccounts: {
            where: { isDefault: true, verificationStatus: 'VERIFIED' }
          }
        }
      });
      
      if (!investor.bankAccounts[0]) {
        throw new ValidationError('No verified bank account found');
      }
      
      // 2. Run compliance checks
      const compliance = await this.runComplianceChecks(investorId, amount);
      if (!compliance.approved) {
        throw new ComplianceError(compliance.reason);
      }
      
      // 3. Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          transactionType: 'INVESTMENT_DEPOSIT',
          transactionDirection: 'INBOUND',
          amount,
          currency: 'USD',
          fromUserId: investorId,
          fromBankAccountId: investor.bankAccounts[0].id,
          toEscrowAccountId: investment.offering.escrowAccountId,
          investmentId,
          offeringId: investment.offeringId,
          status: 'INITIATED',
          paymentGateway: 'STRIPE'
        }
      });
      
      // 4. Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        payment_method_types: ['us_bank_account'],
        metadata: {
          transactionId: transaction.id.toString(),
          investmentId: investmentId.toString(),
          investorId: investorId.toString()
        }
      });
      
      // 5. Update transaction with Stripe ID
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          stripePaymentIntentId: paymentIntent.id,
          status: 'QUEUED'
        }
      });
      
      // 6. Create audit log
      await tx.auditEvent.create({
        data: {
          action: 'PAYMENT_INITIATED',
          entityType: 'Transaction',
          entityId: transaction.id,
          userId: investorId,
          metadata: { amount, paymentIntentId: paymentIntent.id }
        }
      });
      
      return transaction;
    });
  }
  
  async processACHPayment(transactionId: number): Promise<void> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { fromBankAccount: true }
    });
    
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }
    
    try {
      // Confirm payment intent
      const paymentIntent = await stripe.paymentIntents.confirm(
        transaction.stripePaymentIntentId!,
        {
          payment_method: transaction.fromBankAccount!.stripePaymentMethodId
        }
      );
      
      // Update transaction status
      await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: 'PROCESSING',
          processedAt: new Date()
        }
      });
    } catch (error) {
      // Handle Stripe errors
      if (error instanceof Stripe.errors.StripeCardError) {
        await this.handlePaymentFailure(transactionId, error.code, error.message);
      } else {
        throw error;
      }
    }
  }
  
  private async handlePaymentFailure(
    transactionId: number,
    code: string,
    message: string
  ): Promise<void> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });
    
    const shouldRetry = this.isRetriableError(code);
    const nextStatus = shouldRetry && transaction!.retryCount < transaction!.maxRetries
      ? 'QUEUED'
      : 'FAILED';
    
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: nextStatus,
        failureCode: code,
        failureReason: message,
        failedAt: new Date(),
        retryCount: { increment: 1 },
        nextRetryAt: shouldRetry 
          ? new Date(Date.now() + (30 * 60 * 1000)) 
          : null
      }
    });
  }
  
  private isRetriableError(code: string): boolean {
    const retriableCodes = [
      'processing_error',
      'rate_limit',
      'temporary_failure'
    ];
    return retriableCodes.includes(code);
  }
}
```

### Plaid Bank Account Verification

```typescript
// services/plaid.service.ts
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const plaidConfig = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!
    }
  }
});

const plaidClient = new PlaidApi(plaidConfig);

export class PlaidService {
  async exchangePublicToken(
    userId: number,
    publicToken: string
  ): Promise<BankAccount> {
    // Exchange public token for access token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken
    });
    
    const accessToken = response.data.access_token;
    
    // Get account information
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken
    });
    
    const account = accountsResponse.data.accounts[0]; // Primary account
    
    // Get auth information (routing & account numbers)
    const authResponse = await plaidClient.authGet({
      access_token: accessToken
    });
    
    const numbers = authResponse.data.numbers.ach![0];
    
    // Store bank account
    const bankAccount = await prisma.bankAccount.create({
      data: {
        userId,
        accountType: account.subtype === 'checking' ? 'CHECKING' : 'SAVINGS',
        bankName: authResponse.data.item.institution_id!,
        accountHolderName: account.name,
        accountNumberLast4: numbers.account.slice(-4),
        routingNumber: numbers.routing,
        accountNumberHash: await this.encryptAccountNumber(numbers.account),
        verificationStatus: 'VERIFIED',
        verificationMethod: 'PLAID',
        plaidAccountId: account.account_id,
        plaidAccessToken: await this.encryptAccessToken(accessToken),
        verifiedAt: new Date(),
        isDefault: true
      }
    });
    
    return bankAccount;
  }
  
  async getAccountBalance(bankAccountId: number): Promise<number> {
    const bankAccount = await prisma.bankAccount.findUnique({
      where: { id: bankAccountId }
    });
    
    if (!bankAccount?.plaidAccessToken) {
      throw new Error('Bank account not linked via Plaid');
    }
    
    const accessToken = await this.decryptAccessToken(bankAccount.plaidAccessToken);
    
    const response = await plaidClient.accountsBalanceGet({
      access_token: accessToken
    });
    
    const account = response.data.accounts.find(
      a => a.account_id === bankAccount.plaidAccountId
    );
    
    return account?.balances.current || 0;
  }
  
  private async encryptAccountNumber(accountNumber: string): Promise<string> {
    // Use encryption utility
    return encrypt(accountNumber);
  }
  
  private async encryptAccessToken(token: string): Promise<string> {
    return encrypt(token);
  }
  
  private async decryptAccessToken(encrypted: string): Promise<string> {
    return decrypt(encrypted);
  }
}
```

---

## FILE UPLOADS

### S3 File Upload with Presigned URLs

```typescript
// services/s3.service.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export class S3Service {
  private readonly bucket = process.env.AWS_S3_BUCKET_CONSTRUCTION!;
  
  async generateUploadUrl(
    projectId: number,
    fileName: string,
    contentType: string
  ): Promise<{ uploadUrl: string; fileKey: string }> {
    const fileExtension = fileName.split('.').pop();
    const fileKey = `projects/${projectId}/photos/${uuidv4()}.${fileExtension}`;
    
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ContentType: contentType
    });
    
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600 // 1 hour
    });
    
    return { uploadUrl, fileKey };
  }
  
  async uploadFile(
    fileKey: string,
    fileBuffer: Buffer,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: contentType
    });
    
    await s3Client.send(command);
    
    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }
  
  async getFileUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileKey
    });
    
    return await getSignedUrl(s3Client, command, {
      expiresIn: 3600
    });
  }
}

// routes/upload.ts
server.post('/projects/:id/photos/upload-url',
  { preHandler: authenticate },
  async (request, reply) => {
    const { fileName, contentType } = request.body;
    const projectId = parseInt(request.params.id);
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      return reply.code(400).send({
        success: false,
        error: 'Invalid file type'
      });
    }
    
    const s3Service = new S3Service();
    const { uploadUrl, fileKey } = await s3Service.generateUploadUrl(
      projectId,
      fileName,
      contentType
    );
    
    reply.send({
      success: true,
      data: { uploadUrl, fileKey }
    });
  }
);

// Frontend usage
async function uploadPhoto(file: File, projectId: number) {
  // 1. Get presigned URL
  const response = await fetch(`/api/projects/${projectId}/photos/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type
    })
  });
  
  const { uploadUrl, fileKey } = await response.json();
  
  // 2. Upload directly to S3
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  });
  
  // 3. Save file record
  await fetch(`/api/projects/${projectId}/photos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileKey,
      fileName: file.name,
      fileSize: file.size
    })
  });
}
```

---

## EMAIL NOTIFICATIONS

### Email Service with Templates

```typescript
// services/email.service.ts
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export class EmailService {
  private templateCache = new Map<string, HandlebarsTemplateDelegate>();
  
  async sendEmail(
    to: string | string[],
    subject: string,
    template: string,
    data: any
  ): Promise<void> {
    const html = await this.renderTemplate(template, data);
    
    await transporter.sendMail({
      from: `"RealCo" <${process.env.SMTP_FROM}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html
    });
  }
  
  private async renderTemplate(
    templateName: string,
    data: any
  ): Promise<string> {
    if (!this.templateCache.has(templateName)) {
      const templatePath = path.join(
        __dirname,
        '../templates/emails',
        `${templateName}.hbs`
      );
      const templateSource = await fs.readFile(templatePath, 'utf-8');
      const template = Handlebars.compile(templateSource);
      this.templateCache.set(templateName, template);
    }
    
    const template = this.templateCache.get(templateName)!;
    return template(data);
  }
  
  // Specific email types
  async sendInvestmentConfirmation(
    investorEmail: string,
    investment: any
  ): Promise<void> {
    await this.sendEmail(
      investorEmail,
      'Investment Confirmation',
      'investment-confirmation',
      {
        investorName: investment.investor.firstName,
        offeringName: investment.offering.propertyName,
        investmentAmount: investment.amount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD'
        }),
        confirmationNumber: investment.confirmationNumber,
        dashboardUrl: `${process.env.FRONTEND_URL}/investor/investments/${investment.id}`
      }
    );
  }
  
  async sendWeeklyProgressUpdate(
    investorEmails: string[],
    project: any,
    updates: any
  ): Promise<void> {
    await this.sendEmail(
      investorEmails,
      `Weekly Progress Update: ${project.name}`,
      'weekly-progress',
      {
        projectName: project.name,
        weekEnding: new Date().toLocaleDateString(),
        progress: project.overallProgress,
        updates: updates.highlights,
        photos: updates.photos.slice(0, 3),
        dashboardUrl: `${process.env.FRONTEND_URL}/investor/projects/${project.id}`
      }
    );
  }
}

// templates/emails/investment-confirmation.hbs
/*
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .button { background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Investment Confirmed!</h1>
    </div>
    <div class="content">
      <p>Dear {{investorName}},</p>
      <p>Thank you for your investment in {{offeringName}}.</p>
      <p><strong>Investment Amount:</strong> {{investmentAmount}}</p>
      <p><strong>Confirmation Number:</strong> {{confirmationNumber}}</p>
      <p>You can view your investment details and track project progress in your dashboard.</p>
      <p style="text-align: center; margin-top: 30px;">
        <a href="{{dashboardUrl}}" class="button">View Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
*/
```

---

## TESTING PATTERNS

### Unit Test Template

```typescript
// __tests__/services/project.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';
import { ProjectService } from '../../services/project.service';

// Mock Prisma
vi.mock('../../lib/prisma', () => ({
  prisma: mockDeep<PrismaClient>()
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('ProjectService', () => {
  let projectService: ProjectService;
  
  beforeEach(() => {
    mockReset(prismaMock);
    projectService = new ProjectService(prismaMock);
  });
  
  describe('createProject', () => {
    it('should create project with valid data', async () => {
      const mockProject = {
        id: 1,
        developmentProjectId: 1,
        projectCode: 'RC-2025-001',
        projectPhase: 'PRE_CONSTRUCTION',
        plannedStartDate: new Date('2025-02-01'),
        plannedEndDate: new Date('2025-12-31'),
        overallProgress: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      prismaMock.project.create.mockResolvedValue(mockProject);
      
      const result = await projectService.createProject(1, {
        plannedStartDate: new Date('2025-02-01'),
        plannedEndDate: new Date('2025-12-31')
      });
      
      expect(result).toEqual(mockProject);
      expect(prismaMock.project.create).toHaveBeenCalledTimes(1);
    });
    
    it('should throw error with invalid dates', async () => {
      await expect(
        projectService.createProject(1, {
          plannedStartDate: new Date('2025-12-31'),
          plannedEndDate: new Date('2025-02-01')
        })
      ).rejects.toThrow('End date must be after start date');
    });
    
    it('should enforce unique project codes', async () => {
      prismaMock.project.create.mockRejectedValue({
        code: 'P2002',
        meta: { target: ['projectCode'] }
      });
      
      await expect(
        projectService.createProject(1, {
          plannedStartDate: new Date('2025-02-01'),
          plannedEndDate: new Date('2025-12-31')
        })
      ).rejects.toThrow();
    });
  });
  
  describe('calculateScheduleVariance', () => {
    it('should return positive variance when ahead of schedule', async () => {
      const mockProject = {
        id: 1,
        plannedEndDate: new Date('2025-12-31'),
        forecastEndDate: new Date('2025-11-30')
      };
      
      prismaMock.project.findUnique.mockResolvedValue(mockProject as any);
      
      const variance = await projectService.calculateScheduleVariance(1);
      
      expect(variance).toBeGreaterThan(0); // Ahead of schedule
    });
    
    it('should return negative variance when behind schedule', async () => {
      const mockProject = {
        id: 1,
        plannedEndDate: new Date('2025-11-30'),
        forecastEndDate: new Date('2025-12-31')
      };
      
      prismaMock.project.findUnique.mockResolvedValue(mockProject as any);
      
      const variance = await projectService.calculateScheduleVariance(1);
      
      expect(variance).toBeLessThan(0); // Behind schedule
    });
  });
});
```

### Integration Test Template

```typescript
// __tests__/integration/api/projects.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { build } from '../../app';
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let app: FastifyInstance;
let authToken: string;

beforeAll(async () => {
  app = await build();
  await app.ready();
  
  // Create test user and get token
  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: 'test@example.com',
      password: 'Test123!'
    }
  });
  
  authToken = JSON.parse(response.body).data.accessToken;
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});

beforeEach(async () => {
  // Clean up test data
  await prisma.project.deleteMany({
    where: { projectCode: { startsWith: 'TEST-' } }
  });
});

describe('POST /api/projects', () => {
  it('should create project with valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/projects',
      headers: {
        authorization: `Bearer ${authToken}`
      },
      payload: {
        developmentProjectId: 1,
        plannedStartDate: '2025-02-01T00:00:00Z',
        plannedEndDate: '2025-12-31T00:00:00Z'
      }
    });
    
    expect(response.statusCode).toBe(201);
    
    const body = JSON.parse(response.body);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('id');
    expect(body.data).toHaveProperty('projectCode');
  });
  
  it('should return 401 without auth token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/projects',
      payload: {
        developmentProjectId: 1,
        plannedStartDate: '2025-02-01T00:00:00Z',
        plannedEndDate: '2025-12-31T00:00:00Z'
      }
    });
    
    expect(response.statusCode).toBe(401);
  });
  
  it('should return 400 with invalid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/projects',
      headers: {
        authorization: `Bearer ${authToken}`
      },
      payload: {
        // Missing required fields
        plannedStartDate: '2025-02-01T00:00:00Z'
      }
    });
    
    expect(response.statusCode).toBe(400);
    
    const body = JSON.parse(response.body);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Validation failed');
  });
});
```

---

## COMMON UTILITIES

### Date & Time Helpers

```typescript
// utils/date.ts
import { addDays, differenceInDays, isWeekend, parseISO } from 'date-fns';

export function calculateWorkingDays(
  startDate: Date,
  endDate: Date,
  workingDaysPerWeek = 5
): number {
  let current = startDate;
  let workingDays = 0;
  
  while (current <= endDate) {
    if (!isWeekend(current)) {
      workingDays++;
    }
    current = addDays(current, 1);
  }
  
  return workingDays;
}

export function addWorkingDays(
  startDate: Date,
  daysToAdd: number
): Date {
  let current = startDate;
  let added = 0;
  
  while (added < daysToAdd) {
    current = addDays(current, 1);
    if (!isWeekend(current)) {
      added++;
    }
  }
  
  return current;
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

export function formatDate(date: Date | string, format = 'short'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  
  const formats = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' }
  };
  
  return new Intl.DateTimeFormat('en-US', formats[format]).format(d);
}
```

### Encryption Utilities

```typescript
// utils/crypto.ts
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

export function decrypt(encrypted: string): string {
  const buffer = Buffer.from(encrypted, 'hex');
  
  const iv = buffer.subarray(0, 16);
  const authTag = buffer.subarray(16, 32);
  const ciphertext = buffer.subarray(32);
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]);
  
  return decrypted.toString('utf8');
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}
```

---

## FRONTEND PATTERNS

### React Query Setup

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

// hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => api.getProjects(filters)
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => api.getProject(id),
    enabled: !!id
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProjectDTO) => api.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) =>
      api.updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
    }
  });
}
```

### Form Handling with React Hook Form

```typescript
// components/CreateProjectForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProject } from '../hooks/useProjects';

const schema = z.object({
  developmentProjectId: z.number(),
  plannedStartDate: z.string().datetime(),
  plannedEndDate: z.string().datetime(),
  workingDaysPerWeek: z.number().min(1).max(7).default(5)
}).refine(
  data => new Date(data.plannedEndDate) > new Date(data.plannedStartDate),
  { message: 'End date must be after start date', path: ['plannedEndDate'] }
);

type FormData = z.infer<typeof schema>;

export function CreateProjectForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  
  const createProject = useCreateProject();
  
  const onSubmit = async (data: FormData) => {
    try {
      await createProject.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      // Error handled by mutation
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="plannedStartDate" className="block text-sm font-medium">
          Start Date
        </label>
        <input
          type="date"
          id="plannedStartDate"
          {...register('plannedStartDate')}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
        {errors.plannedStartDate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.plannedStartDate.message}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="plannedEndDate" className="block text-sm font-medium">
          End Date
        </label>
        <input
          type="date"
          id="plannedEndDate"
          {...register('plannedEndDate')}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
        {errors.plannedEndDate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.plannedEndDate.message}
          </p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
```

---

## 🎯 QUICK COMMANDS

```bash
# Database
npx prisma migrate dev --name add_construction_tables
npx prisma generate
npx prisma studio
railway run npx prisma migrate deploy

# Testing
npm run test
npm run test:watch
npm run test:coverage

# Build
npm run build
npm run type-check
npm run lint

# Deploy
railway up
vercel --prod

# Logs
railway logs
vercel logs
```

---

This quick reference covers the most common patterns you'll need. Refer back to the main prompt files for comprehensive feature-specific guidance.
