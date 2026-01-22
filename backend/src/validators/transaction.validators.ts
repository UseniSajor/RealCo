/**
 * Zod validation schemas for Transaction API endpoints
 * 
 * These schemas provide runtime validation and type inference
 * for all transaction-related API inputs.
 */

import { z } from 'zod';
import { TransactionType, TransactionStatus, PaymentMethod } from '@prisma/client';

// =============================================================================
// BASE SCHEMAS
// =============================================================================

/**
 * UUID validation schema
 */
const uuidSchema = z.string().uuid('Invalid UUID format');

/**
 * Positive number validation
 */
const positiveNumberSchema = z.number().positive('Must be a positive number');

/**
 * Non-negative number validation
 */
const nonNegativeNumberSchema = z.number().nonnegative('Must be non-negative');

/**
 * Currency code validation (ISO 4217)
 */
const currencySchema = z.string().length(3).toUpperCase().default('USD');

/**
 * Transaction amount validation
 * - Must be positive
 * - Max 2 decimal places
 * - Reasonable limits
 */
const amountSchema = z
  .number()
  .positive('Amount must be positive')
  .max(100000000, 'Amount exceeds maximum limit')
  .refine(
    (val) => Math.round(val * 100) / 100 === val,
    'Amount can have at most 2 decimal places'
  );

// =============================================================================
// ENUM SCHEMAS
// =============================================================================

const transactionTypeSchema = z.nativeEnum(TransactionType, {
  errorMap: () => ({ message: 'Invalid transaction type' }),
});

const transactionStatusSchema = z.nativeEnum(TransactionStatus, {
  errorMap: () => ({ message: 'Invalid transaction status' }),
});

const paymentMethodSchema = z.nativeEnum(PaymentMethod, {
  errorMap: () => ({ message: 'Invalid payment method' }),
});

// =============================================================================
// REQUEST SCHEMAS
// =============================================================================

/**
 * Schema for initiating a new transaction
 */
export const initiateTransactionSchema = z.object({
  // Required fields
  type: transactionTypeSchema,
  paymentMethod: paymentMethodSchema,
  amount: amountSchema,
  
  // Optional fields
  currency: currencySchema.optional(),
  
  // Parties (at least one fromUser or fromBankAccount required for most types)
  fromUserId: uuidSchema.optional(),
  toUserId: uuidSchema.optional(),
  fromBankAccountId: uuidSchema.optional(),
  toBankAccountId: uuidSchema.optional(),
  
  // Related entities
  offeringId: uuidSchema.optional(),
  escrowAccountId: uuidSchema.optional(),
  distributionId: uuidSchema.optional(),
  
  // Description
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description too long'),
  internalMemo: z.string().max(1000, 'Internal memo too long').optional(),
  
  // Metadata (flexible JSON)
  metadata: z.record(z.any()).optional(),
  
  // Client info (usually from request)
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().max(500).optional(),
}).superRefine((data, ctx) => {
  // Business rule validations
  
  // Deposits require fromBankAccount
  if (data.type === 'DEPOSIT' && !data.fromBankAccountId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Deposit transactions require a source bank account',
      path: ['fromBankAccountId'],
    });
  }
  
  // Withdrawals require toBankAccount
  if (data.type === 'WITHDRAWAL' && !data.toBankAccountId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Withdrawal transactions require a destination bank account',
      path: ['toBankAccountId'],
    });
  }
  
  // Escrow operations require escrowAccountId
  if (
    (data.type === 'ESCROW_DEPOSIT' || data.type === 'ESCROW_WITHDRAWAL') &&
    !data.escrowAccountId
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Escrow transactions require an escrow account ID',
      path: ['escrowAccountId'],
    });
  }
  
  // Distributions require distributionId
  if (data.type === 'DISTRIBUTION' && !data.distributionId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Distribution transactions require a distribution ID',
      path: ['distributionId'],
    });
  }
  
  // Construction draws require offeringId
  if (data.type === 'CONSTRUCTION_DRAW' && !data.offeringId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Construction draw transactions require an offering ID',
      path: ['offeringId'],
    });
  }
});

/**
 * Schema for updating a transaction
 */
export const updateTransactionSchema = z.object({
  status: transactionStatusSchema.optional(),
  description: z.string().min(1).max(500).optional(),
  internalMemo: z.string().max(1000).optional(),
  metadata: z.record(z.any()).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  'At least one field must be provided for update'
);

/**
 * Schema for transaction list filters
 */
export const transactionListFiltersSchema = z.object({
  // Status filters
  status: z
    .union([transactionStatusSchema, z.array(transactionStatusSchema)])
    .optional(),
  type: z
    .union([transactionTypeSchema, z.array(transactionTypeSchema)])
    .optional(),
  paymentMethod: z
    .union([paymentMethodSchema, z.array(paymentMethodSchema)])
    .optional(),
  
  // User filters
  userId: uuidSchema.optional(),
  fromUserId: uuidSchema.optional(),
  toUserId: uuidSchema.optional(),
  
  // Related entity filters
  offeringId: uuidSchema.optional(),
  escrowAccountId: uuidSchema.optional(),
  distributionId: uuidSchema.optional(),
  
  // Amount filters
  minAmount: nonNegativeNumberSchema.optional(),
  maxAmount: positiveNumberSchema.optional(),
  
  // Date filters (ISO 8601 strings)
  startDate: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
  endDate: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
  
  // Pagination
  limit: z
    .number()
    .int()
    .positive()
    .max(100, 'Maximum limit is 100')
    .default(50),
  offset: z.number().int().nonnegative().default(0),
  cursor: uuidSchema.optional(),
  
  // Sorting
  sortBy: z.enum(['createdAt', 'amount', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  
  // Search
  search: z.string().max(100).optional(),
}).refine(
  (data) => {
    if (data.minAmount && data.maxAmount) {
      return data.minAmount <= data.maxAmount;
    }
    return true;
  },
  {
    message: 'minAmount must be less than or equal to maxAmount',
    path: ['minAmount'],
  }
).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: 'startDate must be before or equal to endDate',
    path: ['startDate'],
  }
);

/**
 * Schema for retrying a failed transaction
 */
export const retryTransactionSchema = z.object({
  reason: z.string().max(500).optional(),
  forceRetry: z.boolean().default(false),
});

/**
 * Schema for cancelling a transaction
 */
export const cancelTransactionSchema = z.object({
  reason: z
    .string()
    .min(1, 'Cancellation reason is required')
    .max(500, 'Reason too long'),
  cancelledBy: uuidSchema.optional(),
});

/**
 * Schema for transaction ID param
 */
export const transactionIdParamSchema = z.object({
  id: uuidSchema,
});

/**
 * Schema for transaction approval
 */
export const approveTransactionSchema = z.object({
  approved: z.boolean(),
  notes: z.string().max(1000).optional(),
  approvedBy: uuidSchema.optional(),
});

/**
 * Schema for bulk transaction operations
 */
export const bulkTransactionOperationSchema = z.object({
  transactionIds: z
    .array(uuidSchema)
    .min(1, 'At least one transaction ID required')
    .max(100, 'Maximum 100 transactions per bulk operation'),
  operation: z.enum(['approve', 'cancel', 'retry']),
  reason: z.string().max(500).optional(),
});

// =============================================================================
// WEBHOOK SCHEMAS
// =============================================================================

/**
 * Schema for Stripe webhook signature verification
 */
export const stripeWebhookSchema = z.object({
  // Raw body is validated by Stripe library
  signature: z.string(),
});

/**
 * Schema for Plaid webhook payload
 */
export const plaidWebhookSchema = z.object({
  webhook_type: z.string(),
  webhook_code: z.string(),
  item_id: z.string().optional(),
  error: z.any().optional(),
});

// =============================================================================
// QUERY PARAMETER SCHEMAS
// =============================================================================

/**
 * Schema for transaction statistics query
 */
export const transactionStatsQuerySchema = z.object({
  startDate: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
  endDate: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
  offeringId: uuidSchema.optional(),
  groupBy: z.enum(['status', 'type', 'paymentMethod', 'day', 'week', 'month']).optional(),
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Validate and parse transaction initiation data
 */
export function validateInitiateTransaction(data: unknown) {
  return initiateTransactionSchema.parse(data);
}

/**
 * Validate and parse transaction update data
 */
export function validateUpdateTransaction(data: unknown) {
  return updateTransactionSchema.parse(data);
}

/**
 * Validate and parse transaction filters
 */
export function validateTransactionFilters(data: unknown) {
  return transactionListFiltersSchema.parse(data);
}

/**
 * Validate transaction ID
 */
export function validateTransactionId(id: string) {
  return uuidSchema.parse(id);
}

/**
 * Validate amount is within reasonable limits and properly formatted
 */
export function validateAmount(amount: number): number {
  return amountSchema.parse(amount);
}

/**
 * Validate currency code
 */
export function validateCurrency(currency: string): string {
  return currencySchema.parse(currency);
}



