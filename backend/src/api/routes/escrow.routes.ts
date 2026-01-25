/**
 * Escrow API Routes
 * 
 * RESTful endpoints for escrow account management
 * All routes require authentication
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { EscrowService } from '../../services/escrow.service.js';
import { requireAuth } from '../../middlewares/auth.js';
import type { AuthenticatedUser } from '../../middlewares/auth.js';
import { AppError } from '../../services/errors.js';
import { prisma } from '../../lib/prisma.js';

const escrowService = new EscrowService(prisma);

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const createEscrowAccountSchema = z.object({
  offeringId: z.string().uuid(),
  externalAccountId: z.string().optional(),
});

const depositFundsSchema = z.object({
  amount: z.number().positive(),
  transactionId: z.string().uuid(),
  description: z.string().min(1).max(500),
});

const withdrawFundsSchema = z.object({
  amount: z.number().positive(),
  transactionId: z.string().uuid(),
  description: z.string().min(1).max(500),
  requiresApproval: z.boolean().optional(),
});

const reconcileSchema = z.object({
  bankBalance: z.number(),
});

const freezeSchema = z.object({
  reason: z.string().min(1).max(500),
});

const ledgerQuerySchema = z.object({
  startDate: z.string().datetime().transform((s) => new Date(s)).optional(),
  endDate: z.string().datetime().transform((s) => new Date(s)).optional(),
  limit: z.number().int().positive().max(1000).default(100),
});

// =============================================================================
// ROUTES
// =============================================================================

export async function escrowRoutes(server: FastifyInstance) {
  
  // ==========================================================================
  // POST /escrow/accounts - Create escrow account
  // ==========================================================================
  server.post(
    '/escrow/accounts',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Create escrow account for an offering',
        tags: ['escrow'],
        body: {
          type: 'object',
          required: ['offeringId'],
          properties: {
            offeringId: { type: 'string', format: 'uuid' },
            externalAccountId: { type: 'string' },
          },
        },
        response: {
          201: {
            description: 'Escrow account created',
            type: 'object',
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const data = createEscrowAccountSchema.parse(req.body);
        
        const escrowAccount = await escrowService.createEscrowAccount(data);
        
        return reply.status(201).send({
          escrowAccount,
          message: 'Escrow account created successfully',
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // GET /escrow/accounts/:id - Get escrow account
  // ==========================================================================
  server.get(
    '/escrow/accounts/:id',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Get escrow account details',
        tags: ['escrow'],
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
        const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
        
        const escrowAccount = await escrowService.getEscrowAccount(id);
        
        return reply.send(escrowAccount);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // GET /escrow/accounts/:id/balance - Get balance
  // ==========================================================================
  server.get(
    '/escrow/accounts/:id/balance',
    {
      preHandler: requireAuth,
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
        
        const account = await escrowService.getEscrowAccount(id);
        
        return reply.send({
          balance: account.balance,
          availableBalance: account.availableBalance,
          reservedAmount: account.reservedAmount,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // GET /escrow/accounts/:id/ledger - Get ledger history
  // ==========================================================================
  server.get(
    '/escrow/accounts/:id/ledger',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Get escrow account ledger history',
        tags: ['escrow'],
        querystring: {
          type: 'object',
          properties: {
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            limit: { type: 'number', minimum: 1, maximum: 1000, default: 100 },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
        const query = ledgerQuerySchema.parse(req.query);
        
        const entries = await escrowService.getLedger(
          id,
          query.startDate,
          query.endDate,
          query.limit
        );
        
        return reply.send({
          entries,
          count: entries.length,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // POST /escrow/accounts/:id/reconcile - Reconcile account
  // ==========================================================================
  server.post(
    '/escrow/accounts/:id/reconcile',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Reconcile escrow account with bank statement',
        tags: ['escrow'],
        body: {
          type: 'object',
          required: ['bankBalance'],
          properties: {
            bankBalance: { type: 'number' },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
        const { bankBalance } = reconcileSchema.parse(req.body);
        
        const result = await escrowService.reconcileAccount(id, bankBalance);
        
        return reply.send(result);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // POST /escrow/accounts/:id/freeze - Freeze account
  // ==========================================================================
  server.post(
    '/escrow/accounts/:id/freeze',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Freeze escrow account (admin only)',
        tags: ['escrow'],
        body: {
          type: 'object',
          required: ['reason'],
          properties: {
            reason: { type: 'string' },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
        const { reason } = freezeSchema.parse(req.body);
        
        // TODO: Check admin role
        
        const account = await escrowService.freezeAccount(id, reason);
        
        return reply.send({
          account,
          message: 'Escrow account frozen',
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // POST /escrow/accounts/:id/unfreeze - Unfreeze account
  // ==========================================================================
  server.post(
    '/escrow/accounts/:id/unfreeze',
    {
      preHandler: requireAuth,
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
        
        // TODO: Check admin role
        
        const account = await escrowService.unfreezeAccount(id);
        
        return reply.send({
          account,
          message: 'Escrow account unfrozen',
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // POST /escrow/accounts/:id/calculate-distribution - Calculate distribution
  // ==========================================================================
  server.post(
    '/escrow/accounts/:id/calculate-distribution',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Calculate waterfall distribution for offering',
        tags: ['escrow'],
        body: {
          type: 'object',
          required: ['amount'],
          properties: {
            amount: { type: 'number', minimum: 0 },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
        const { amount } = z.object({ amount: z.number().positive() }).parse(req.body);
        
        const account = await escrowService.getEscrowAccount(id);
        const calculation = await escrowService.calculateDistribution(account.offeringId, amount);
        
        return reply.send(calculation);
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
  console.error('Escrow API Error:', error);

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
