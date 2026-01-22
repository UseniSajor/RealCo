/**
 * Transaction API Routes
 * 
 * RESTful endpoints for transaction management
 * All routes require authentication unless specified
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TransactionService } from '../../services/transaction.service.js';
import { requireAuth } from '../../middlewares/auth.js';
import type { AuthenticatedUser } from '../../middlewares/auth.js';
import {
  initiateTransactionSchema,
  updateTransactionSchema,
  transactionListFiltersSchema,
  retryTransactionSchema,
  cancelTransactionSchema,
  transactionIdParamSchema,
  approveTransactionSchema,
  transactionStatsQuerySchema,
} from '../../validators/transaction.validators.js';
import {
  TransactionNotFoundError,
  ValidationError,
  UnauthorizedError,
  AppError,
} from '../../services/errors.js';
import { prisma } from '../../lib/prisma.js';

const transactionService = new TransactionService(prisma);

/**
 * Register all transaction routes
 */
export async function transactionRoutes(server: FastifyInstance) {
  // ==========================================================================
  // POST /transactions - Initiate a new transaction
  // ==========================================================================
  server.post(
    '/transactions',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Initiate a new financial transaction',
        tags: ['transactions'],
        body: {
          type: 'object',
          required: ['type', 'paymentMethod', 'amount', 'description'],
          properties: {
            type: { type: 'string', enum: ['DEPOSIT', 'WITHDRAWAL', 'DISTRIBUTION', 'CONSTRUCTION_DRAW', 'PLATFORM_FEE', 'REFERRAL_FEE', 'ESCROW_DEPOSIT', 'ESCROW_WITHDRAWAL', 'REFUND', 'TRANSFER'] },
            paymentMethod: { type: 'string', enum: ['ACH', 'WIRE', 'CHECK', 'CREDIT_CARD', 'INTERNAL_TRANSFER'] },
            amount: { type: 'number', minimum: 0 },
            description: { type: 'string' },
          },
        },
        response: {
          201: {
            description: 'Transaction created successfully',
            type: 'object',
            properties: {
              transaction: { type: 'object' },
              estimatedSettlementDate: { type: 'string' },
              requiresApproval: { type: 'boolean' },
            },
          },
          400: {
            description: 'Validation error',
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const data = initiateTransactionSchema.parse(req.body);

        // Add client info from request
        const transactionData = {
          ...data,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'] || undefined,
        };

        const result = await transactionService.initiateTransaction(
          transactionData,
          user.userId
        );

        return reply.status(201).send({
          transaction: result.transaction,
          estimatedSettlementDate: result.estimatedSettlementDate,
          requiresApproval: result.requiresApproval,
          complianceChecks: result.complianceChecks,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // GET /transactions/:id - Get transaction details
  // ==========================================================================
  server.get(
    '/transactions/:id',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Get transaction details by ID',
        tags: ['transactions'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          200: {
            description: 'Transaction details',
            type: 'object',
          },
          404: {
            description: 'Transaction not found',
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const { id } = transactionIdParamSchema.parse(req.params);

        const transaction = await transactionService.getTransaction(id, user.userId);

        return reply.send(transaction);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // GET /transactions - List transactions with filters
  // ==========================================================================
  server.get(
    '/transactions',
    {
      preHandler: requireAuth,
      schema: {
        description: 'List transactions with filters and pagination',
        tags: ['transactions'],
        querystring: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            type: { type: 'string' },
            paymentMethod: { type: 'string' },
            offeringId: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 50 },
            offset: { type: 'number', minimum: 0, default: 0 },
            sortBy: { type: 'string', enum: ['createdAt', 'amount', 'status'], default: 'createdAt' },
            sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          },
        },
        response: {
          200: {
            description: 'List of transactions',
            type: 'object',
            properties: {
              transactions: { type: 'array' },
              pagination: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                  limit: { type: 'number' },
                  offset: { type: 'number' },
                  hasMore: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const filters = transactionListFiltersSchema.parse(req.query);

        // Non-admin users can only see their own transactions
        // TODO: Add role check here
        const result = await transactionService.listTransactions(filters, user.userId);

        return reply.send(result);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // PATCH /transactions/:id - Update transaction
  // ==========================================================================
  server.patch(
    '/transactions/:id',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Update transaction details',
        tags: ['transactions'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            description: { type: 'string' },
            internalMemo: { type: 'string' },
            metadata: { type: 'object' },
          },
        },
        response: {
          200: {
            description: 'Updated transaction',
            type: 'object',
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const { id } = transactionIdParamSchema.parse(req.params);
        const updates = updateTransactionSchema.parse(req.body);

        const transaction = await transactionService.updateTransaction(
          id,
          updates,
          user.userId
        );

        return reply.send(transaction);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // POST /transactions/:id/approve - Approve a transaction
  // ==========================================================================
  server.post(
    '/transactions/:id/approve',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Approve a pending transaction (admin only)',
        tags: ['transactions'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          properties: {
            notes: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Transaction approved',
            type: 'object',
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const { id } = transactionIdParamSchema.parse(req.params);
        const { notes } = req.body as { notes?: string };

        // TODO: Check if user has admin role

        const transaction = await transactionService.approveTransaction(
          id,
          user.userId,
          notes
        );

        return reply.send({
          transaction,
          message: 'Transaction approved successfully',
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // POST /transactions/:id/cancel - Cancel a transaction
  // ==========================================================================
  server.post(
    '/transactions/:id/cancel',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Cancel a transaction',
        tags: ['transactions'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          required: ['reason'],
          properties: {
            reason: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Transaction cancelled',
            type: 'object',
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const { id } = transactionIdParamSchema.parse(req.params);
        const { reason } = cancelTransactionSchema.parse(req.body);

        const transaction = await transactionService.cancelTransaction(
          id,
          reason,
          user.userId
        );

        return reply.send({
          transaction,
          message: 'Transaction cancelled successfully',
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // POST /transactions/:id/retry - Retry a failed transaction
  // ==========================================================================
  server.post(
    '/transactions/:id/retry',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Retry a failed transaction',
        tags: ['transactions'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          properties: {
            forceRetry: { type: 'boolean', default: false },
            reason: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Transaction retry scheduled',
            type: 'object',
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = (req as any).user as AuthenticatedUser;
        const { id } = transactionIdParamSchema.parse(req.params);
        const { forceRetry } = retryTransactionSchema.parse(req.body);

        // TODO: Check if user has admin role for forceRetry

        const transaction = await transactionService.retryTransaction(id, forceRetry);

        return reply.send({
          transaction,
          message: 'Transaction retry scheduled',
          nextRetryAt: transaction.nextRetryAt,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // GET /transactions/stats - Get transaction statistics
  // ==========================================================================
  server.get(
    '/transactions/stats',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Get transaction statistics',
        tags: ['transactions'],
        querystring: {
          type: 'object',
          properties: {
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            offeringId: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          200: {
            description: 'Transaction statistics',
            type: 'object',
            properties: {
              totalVolume: { type: 'number' },
              totalFees: { type: 'number' },
              transactionCount: { type: 'number' },
              avgTransactionAmount: { type: 'number' },
            },
          },
        },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      try {
        const query = transactionStatsQuerySchema.parse(req.query);

        const stats = await transactionService.getStatistics(
          query.startDate,
          query.endDate,
          query.offeringId
        );

        return reply.send(stats);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // ==========================================================================
  // GET /transactions/:id/receipt - Download transaction receipt (future)
  // ==========================================================================
  server.get(
    '/transactions/:id/receipt',
    {
      preHandler: requireAuth,
      schema: {
        description: 'Download transaction receipt (PDF)',
        tags: ['transactions'],
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
        const { id } = transactionIdParamSchema.parse(req.params);

        const transaction = await transactionService.getTransaction(id, user.userId);

        // TODO: Generate PDF receipt
        return reply.status(501).send({
          error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Receipt generation coming soon',
          },
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

/**
 * Centralized error handler
 * Converts service errors to appropriate HTTP responses
 */
function handleError(error: unknown, reply: FastifyReply) {
  // Log error for monitoring
  console.error('Transaction API Error:', error);

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.name,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
    });
  }

  // Zod validation errors
  if ((error as any).name === 'ZodError') {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: (error as any).errors,
      },
    });
  }

  // Prisma errors
  if ((error as any).code?.startsWith('P')) {
    return reply.status(400).send({
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed',
        ...(process.env.NODE_ENV === 'development' && { details: error }),
      },
    });
  }

  // Unknown errors
  return reply.status(500).send({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { details: error }),
    },
  });
}



