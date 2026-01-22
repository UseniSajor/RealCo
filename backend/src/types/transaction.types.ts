/**
 * TypeScript types and interfaces for Transaction management
 * 
 * These types define the shape of data for transaction operations
 * and provide type safety throughout the application.
 */

import type {
  Transaction,
  TransactionType,
  TransactionStatus,
  PaymentMethod,
  TransactionWebhook,
} from '@prisma/client';

// =============================================================================
// DTOs (Data Transfer Objects)
// =============================================================================

/**
 * DTO for initiating a new transaction
 */
export interface InitiateTransactionDTO {
  type: TransactionType;
  paymentMethod: PaymentMethod;
  amount: number;
  currency?: string;
  
  // Parties
  fromUserId?: string;
  toUserId?: string;
  fromBankAccountId?: string;
  toBankAccountId?: string;
  
  // Related entities
  offeringId?: string;
  escrowAccountId?: string;
  distributionId?: string;
  
  // Description
  description?: string;
  internalMemo?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Client information
  ipAddress?: string;
  userAgent?: string;
}

/**
 * DTO for updating a transaction
 */
export interface UpdateTransactionDTO {
  status?: TransactionStatus;
  description?: string;
  internalMemo?: string;
  metadata?: Record<string, any>;
}

/**
 * DTO for transaction list filters
 */
export interface TransactionFilters {
  // Status filters
  status?: TransactionStatus | TransactionStatus[];
  type?: TransactionType | TransactionType[];
  paymentMethod?: PaymentMethod | PaymentMethod[];
  
  // User filters
  userId?: string; // Transactions where user is from or to
  fromUserId?: string;
  toUserId?: string;
  
  // Related entity filters
  offeringId?: string;
  escrowAccountId?: string;
  distributionId?: string;
  
  // Amount filters
  minAmount?: number;
  maxAmount?: number;
  
  // Date filters
  startDate?: Date;
  endDate?: Date;
  
  // Pagination
  limit?: number;
  offset?: number;
  cursor?: string;
  
  // Sorting
  sortBy?: 'createdAt' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
  
  // Search
  search?: string; // Search in description, idempotencyKey, etc.
}

/**
 * DTO for transaction retry operation
 */
export interface RetryTransactionDTO {
  reason?: string;
  forceRetry?: boolean; // Override retry count limit
}

/**
 * DTO for transaction cancellation
 */
export interface CancelTransactionDTO {
  reason: string;
  cancelledBy?: string; // User ID who cancelled
}

// =============================================================================
// Response Types
// =============================================================================

/**
 * Transaction detail response with relations
 */
export interface TransactionDetailResponse extends Transaction {
  fromUser?: {
    id: string;
    email: string;
  } | null;
  toUser?: {
    id: string;
    email: string;
  } | null;
  fromBankAccount?: {
    id: string;
    accountType: string;
    last4: string;
  } | null;
  toBankAccount?: {
    id: string;
    accountType: string;
    last4: string;
  } | null;
  offering?: {
    id: string;
    name: string;
  } | null;
  escrowAccount?: {
    id: string;
    accountNumber: string;
    currentBalance: number;
  } | null;
  distribution?: {
    id: string;
    distributionNumber: string;
    totalAmount: number;
  } | null;
}

/**
 * Transaction list response with pagination
 */
export interface TransactionListResponse {
  transactions: TransactionDetailResponse[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  summary?: {
    totalAmount: number;
    totalFees: number;
    transactionCount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
  };
}

/**
 * Transaction statistics response
 */
export interface TransactionStatsResponse {
  totalVolume: number;
  totalFees: number;
  transactionCount: number;
  avgTransactionAmount: number;
  byStatus: Record<TransactionStatus, {
    count: number;
    totalAmount: number;
  }>;
  byType: Record<TransactionType, {
    count: number;
    totalAmount: number;
  }>;
  byPaymentMethod: Record<PaymentMethod, {
    count: number;
    totalAmount: number;
  }>;
  recentTransactions: Transaction[];
}

// =============================================================================
// Service Layer Types
// =============================================================================

/**
 * Transaction processing result
 */
export interface ProcessTransactionResult {
  transaction: Transaction;
  externalTransactionId?: string; // Stripe payment intent ID, etc.
  estimatedSettlementDate?: Date;
  requiresApproval?: boolean;
  complianceChecks: ComplianceCheckResult[];
}

/**
 * Compliance check result
 */
export interface ComplianceCheckResult {
  checkType: 'OFAC' | 'KYC' | 'AML' | 'LIMIT_CHECK' | 'VELOCITY_CHECK';
  passed: boolean;
  details?: any;
  requiresManualReview?: boolean;
  blocksTransaction?: boolean;
}

/**
 * Fee calculation result
 */
export interface FeeCalculation {
  platformFee: number;
  paymentProcessorFee: number;
  totalFee: number;
  netAmount: number;
}

/**
 * Transaction state machine transition
 */
export interface StateTransition {
  from: TransactionStatus;
  to: TransactionStatus;
  allowedBy?: string[]; // User roles that can perform this transition
  requiresApproval?: boolean;
  automatedTransition?: boolean;
}

// =============================================================================
// Webhook Types
// =============================================================================

/**
 * Stripe webhook event payload
 */
export interface StripeWebhookPayload {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
  livemode: boolean;
}

/**
 * Plaid webhook event payload
 */
export interface PlaidWebhookPayload {
  webhook_type: string;
  webhook_code: string;
  item_id?: string;
  error?: any;
  [key: string]: any;
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Transaction status state machine
 * Defines allowed status transitions
 */
export const TRANSACTION_STATE_MACHINE: Record<TransactionStatus, TransactionStatus[]> = {
  INITIATED: ['PENDING_APPROVAL', 'APPROVED', 'QUEUED', 'CANCELLED'],
  PENDING_APPROVAL: ['APPROVED', 'CANCELLED'],
  APPROVED: ['QUEUED', 'CANCELLED'],
  QUEUED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['PENDING_SETTLEMENT', 'SETTLED', 'COMPLETED', 'FAILED'],
  PENDING_SETTLEMENT: ['SETTLED', 'FAILED'],
  SETTLED: ['COMPLETED'],
  COMPLETED: ['REVERSED'], // Refunds only
  FAILED: ['PENDING_RETRY', 'CANCELLED'],
  CANCELLED: [], // Terminal state
  REVERSED: [], // Terminal state
  PENDING_RETRY: ['QUEUED', 'CANCELLED'],
};

/**
 * Transaction types that require approval
 */
export const REQUIRES_APPROVAL_TYPES: TransactionType[] = [
  'CONSTRUCTION_DRAW',
  'DISTRIBUTION',
];

/**
 * Transaction amount threshold for manual approval (in dollars)
 */
export const APPROVAL_AMOUNT_THRESHOLD = 50000;

/**
 * Maximum retry count for failed transactions
 */
export const MAX_RETRY_COUNT = 3;

/**
 * Retry backoff intervals (in milliseconds)
 */
export const RETRY_BACKOFF_INTERVALS = [
  1800000, // 30 minutes
  7200000, // 2 hours
  28800000, // 8 hours
];

/**
 * Transaction types that require compliance checks
 */
export const REQUIRES_COMPLIANCE_TYPES: TransactionType[] = [
  'DEPOSIT',
  'WITHDRAWAL',
  'DISTRIBUTION',
];

/**
 * Payment methods and their processing times
 */
export const PAYMENT_SETTLEMENT_TIMES: Record<PaymentMethod, number> = {
  ACH: 3, // 3-5 business days
  WIRE: 1, // Same or next business day
  CHECK: 5, // 5-7 business days
  CREDIT_CARD: 0, // Immediate
  INTERNAL_TRANSFER: 0, // Immediate
};



