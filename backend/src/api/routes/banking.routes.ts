/**
 * Banking API Routes
 * 
 * RESTful endpoints for bank account management
 * All routes require authentication
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { BankAccountService } from '../../services/bank-account.service-complete.js';
import { PlaidService } from '../../services/plaid.service.js';
import { requireAuth } from '../../middlewares/auth.js';
import type { AuthenticatedUser } from '../../middlewares/auth.js';
import { ValidationError, NotFoundError, AppError } from '../../services/errors.js';
import { prisma } from '../../lib/prisma.js';

const bankAccountService = new BankAccountService(prisma);
const plaidService = new PlaidService();

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const addBankAccountSchema = z.object({
  accountType: z.enum(['CHECKING', 'SAVINGS']),
  accountHolderName: z.string().min(2).max(100),
  accountNumber: z.string().regex(/^\d{4,17}$/, 'Account number must be 4-17 digits'),
  routingNumber: z.string().regex(/^\d{9}$/, 'Routing number must be 9 digits'),
  bankName: z.string().max(100).optional(),
});

const linkPlaidAccountSchema = z.object({
  publicToken: z.string().min(1),
  accountId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const verifyMicroDepositsSchema = z.object({
  amount1: z.number().min(0.01).max(0.99),
  amount2: z.number().min(0.01).max(0.99),
});

const accountIdParamSchema = z.object({
  id: z.string().uuid(),
});

// =============================================================================
// ROUTES
// =============================================================================

export async function bankingRoutes(server: FastifyInstance) {
  
  // ==========================================================================
  // POST /banking/link-token - Create Plaid Link token
  // ==========================================================================
  server.post(
    '/banking/link-token',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Create Plaid Link token for bank account connection',
        tags: ['banking'],
        response: {
          200: {
            type: 'object',
            properties: {
              linkToken: { type: 'string' },
              expiration: { type: 'string' },
            },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        
        const linkToken = await plaidService.createLinkToken(user.userId);
        
        return reply.send({
          linkToken,
          expiration: new Date(Date.now() + 3600000).toISOString(), // 1 hour
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // POST /banking/accounts - Add bank account manually
  // ==========================================================================
  server.post(
    '/banking/accounts',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Add bank account manually (requires micro-deposit verification)',
        tags: ['banking'],
        body: {
          type: 'object',
          required: ['accountType', 'accountHolderName', 'accountNumber', 'routingNumber'],
          properties: {
            accountType: { type: 'string', enum: ['CHECKING', 'SAVINGS'] },
            accountHolderName: { type: 'string' },
            accountNumber: { type: 'string' },
            routingNumber: { type: 'string' },
            bankName: { type: 'string' },
          },
        },
        response: {
          201: {
            description: 'Bank account added, pending verification',
            type: 'object',
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const data = addBankAccountSchema.parse(req.body);
        
        const bankAccount = await bankAccountService.addBankAccount(user.userId, data);
        
        return reply.status(201).send({
          bankAccount,
          message: 'Bank account added. Please verify micro-deposits within 7 days.',
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // POST /banking/accounts/plaid - Link bank account via Plaid
  // ==========================================================================
  server.post(
    '/banking/accounts/plaid',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Link bank account via Plaid (instant verification)',
        tags: ['banking'],
        body: {
          type: 'object',
          required: ['publicToken'],
          properties: {
            publicToken: { type: 'string' },
            accountId: { type: 'string' },
            metadata: { type: 'object' },
          },
        },
        response: {
          201: {
            description: 'Bank account linked and verified',
            type: 'object',
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const data = linkPlaidAccountSchema.parse(req.body);
        
        const bankAccount = await bankAccountService.linkPlaidAccount(user.userId, data);
        
        return reply.status(201).send({
          bankAccount,
          message: 'Bank account linked and verified successfully',
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // POST /banking/accounts/:id/verify - Verify micro-deposits
  // ==========================================================================
  server.post(
    '/banking/accounts/:id/verify',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Verify bank account using micro-deposit amounts',
        tags: ['banking'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          required: ['amount1', 'amount2'],
          properties: {
            amount1: { type: 'number', minimum: 0.01, maximum: 0.99 },
            amount2: { type: 'number', minimum: 0.01, maximum: 0.99 },
          },
        },
        response: {
          200: {
            description: 'Bank account verified',
            type: 'object',
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const { id } = accountIdParamSchema.parse(req.params);
        const data = verifyMicroDepositsSchema.parse(req.body);
        
        const bankAccount = await bankAccountService.verifyMicroDeposits(user.userId, id, data);
        
        return reply.send({
          bankAccount,
          message: 'Bank account verified successfully',
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // GET /banking/accounts - List bank accounts
  // ==========================================================================
  server.get(
    '/banking/accounts',
    {
      preHandler: requireAuth,
      schema: {
        description: 'List user bank accounts',
        tags: ['banking'],
        response: {
          200: {
            description: 'List of bank accounts',
            type: 'object',
            properties: {
              accounts: { type: 'array' },
              count: { type: 'number' },
            },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        
        const accounts = await bankAccountService.listBankAccounts(user.userId);
        
        return reply.send({
          accounts,
          count: accounts.length,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // GET /banking/accounts/:id - Get bank account details
  // ==========================================================================
  server.get(
    '/banking/accounts/:id',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Get bank account details',
        tags: ['banking'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const { id } = accountIdParamSchema.parse(req.params);
        
        const account = await bankAccountService.getBankAccount(id, user.userId);
        const sanitized = (bankAccountService as any).sanitize(account);
        
        return reply.send(sanitized);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // PATCH /banking/accounts/:id/default - Set default account
  // ==========================================================================
  server.patch(
    '/banking/accounts/:id/default',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Set bank account as default for payments',
        tags: ['banking'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const { id } = accountIdParamSchema.parse(req.params);
        
        const bankAccount = await bankAccountService.setDefaultAccount(user.userId, id);
        
        return reply.send({
          bankAccount,
          message: 'Default account updated',
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // DELETE /banking/accounts/:id - Remove bank account
  // ==========================================================================
  server.delete(
    '/banking/accounts/:id',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Remove bank account',
        tags: ['banking'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const { id } = accountIdParamSchema.parse(req.params);
        
        await bankAccountService.removeBankAccount(user.userId, id);
        
        return reply.send({
          message: 'Bank account removed successfully',
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // GET /banking/accounts/:id/balance - Get real-time balance (Plaid)
  // ==========================================================================
  server.get(
    '/banking/accounts/:id/balance',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Get real-time bank account balance via Plaid',
        tags: ['banking'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const { id } = accountIdParamSchema.parse(req.params);
        
        const account = await bankAccountService.getBankAccount(id, user.userId);
        
        if (!account.plaidAccessTokenEnc) {
          return reply.status(400).send({
            error: {
              code: 'PLAID_NOT_LINKED',
              message: 'Account not linked via Plaid. Real-time balance not available.',
            },
          });
        }
        
        const balance = await plaidService.getBalance(account.plaidAccessTokenEnc, account.plaidAccountId!);
        
        return reply.send({
          accountId: id,
          balance: balance[0],
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );
}

// =============================================================================
// ERROR HANDLER
// =============================================================================

function handleError(error: unknown, reply: FastifyReply) {
  console.error('Banking API Error:', error);

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.name,
        message: error.message,
      },
    });
  }

  if ((error as any).name === 'ZodError') {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: (error as any).errors,
      },
    });
  }

  return reply.status(500).send({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
