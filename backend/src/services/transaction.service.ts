/**
 * Transaction Processing Service
 * Handles payment processing with state machine, retry logic, and compliance
 */

import { PrismaClient } from '@prisma/client';
import type { Transaction, TransactionType, TransactionStatus, TransactionMethod } from '@prisma/client';
import { getStripeClient } from './stripe.service.js';
import { runComplianceChecks } from './compliance.js';
import { BankAccountService } from './bank-account.service.js';
import { ValidationError } from './errors.js';
import { emit } from './events.js';
import { hash } from './encryption.js';

export interface InitiateTransactionDTO {
  userId: string;
  organizationId: string;
  type: TransactionType;
  method: TransactionMethod;
  amount: number; // in cents
  currency?: string;
  bankAccountId?: string;
  offeringId?: string;
  description?: string;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
}

export interface TransactionFilters {
  userId?: string;
  organizationId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  method?: TransactionMethod;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  limit?: number;
  offset?: number;
}

// State machine transitions
const VALID_TRANSITIONS: Record<TransactionStatus, TransactionStatus[]> = {
  INITIATED: ['PROCESSING', 'CANCELLED', 'FAILED'],
  PROCESSING: ['COMPLETED', 'FAILED', 'PENDING_SETTLEMENT'],
  PENDING_SETTLEMENT: ['COMPLETED', 'FAILED'],
  COMPLETED: ['REFUNDED'],
  FAILED: ['PROCESSING', 'CANCELLED'], // Can retry
  CANCELLED: [],
  REFUNDED: []
};

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [30 * 60 * 1000, 2 * 60 * 60 * 1000, 8 * 60 * 60 * 1000]; // 30min, 2hr, 8hr

export class TransactionService {
  private bankAccountService: BankAccountService;

  constructor(private prisma: PrismaClient) {
    this.bankAccountService = new BankAccountService(prisma);
  }

  /**
   * Initiate a new transaction
   */
  async initiateTransaction(data: InitiateTransactionDTO): Promise<Transaction> {
    // Validate amount
    if (data.amount <= 0) {
      throw new ValidationError('Amount must be greater than 0');
    }

    // Generate idempotency key if not provided
    const idempotencyKey = data.idempotencyKey || hash(
      `${data.userId}-${data.type}-${data.amount}-${Date.now()}`
    );

    // Check for duplicate transaction using idempotency key
    const existing = await this.prisma.transaction.findFirst({
      where: { idempotencyKey }
    });

    if (existing) {
      return existing;
    }

    // Validate bank account if provided
    if (data.bankAccountId) {
      const bankAccount = await this.bankAccountService.getBankAccount(
        data.bankAccountId,
        data.userId
      );

      if (bankAccount.verificationStatus !== 'VERIFIED') {
        throw new ValidationError('Bank account must be verified');
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      // Run compliance checks
      const complianceResult = await runComplianceChecks({
        userId: data.userId,
        amount: data.amount,
        type: data.type,
        organizationId: data.organizationId
      });

      if (!complianceResult.approved) {
        throw new ValidationError(
          `Transaction failed compliance: ${complianceResult.reason || 'Unknown reason'}`
        );
      }

      // Calculate fees
      const fees = this.calculateFees(data.amount, data.method);

      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          userId: data.userId,
          organizationId: data.organizationId,
          type: data.type,
          method: data.method,
          status: 'INITIATED',
          amount: data.amount,
          currency: data.currency || 'USD',
          platformFee: fees.platformFee,
          processingFee: fees.processingFee,
          netAmount: data.amount - fees.platformFee - fees.processingFee,
          bankAccountId: data.bankAccountId,
          offeringId: data.offeringId,
          description: data.description,
          metadata: data.metadata || {},
          idempotencyKey,
          retryCount: 0
        }
      });

      // Create audit log
      await tx.auditEvent.create({
        data: {
          action: 'transaction.initiated',
          entityType: 'Transaction',
          entityId: transaction.id,
          userId: data.userId,
          metadata: {
            type: data.type,
            method: data.method,
            amount: data.amount,
            status: 'INITIATED'
          }
        }
      });

      // Create compliance record
      if (complianceResult.requiresReporting) {
        await tx.complianceCheck.create({
          data: {
            transactionId: transaction.id,
            checkType: 'OFAC_SCREENING',
            status: complianceResult.approved ? 'PASSED' : 'FAILED',
            result: complianceResult,
            checkedAt: new Date()
          }
        });
      }

      return transaction;
    });
  }

  /**
   * Process ACH payment via Stripe
   */
  async processACHPayment(transactionId: string): Promise<Transaction> {
    const transaction = await this.getTransaction(transactionId);

    // Validate state
    await this.validateTransition(transaction, 'PROCESSING');

    // Update status to PROCESSING
    await this.updateTransactionStatus(transactionId, 'PROCESSING', {
      processedAt: new Date()
    });

    try {
      const stripe = getStripeClient();
      const bankAccount = await this.prisma.bankAccount.findUnique({
        where: { id: transaction.bankAccountId! }
      });

      if (!bankAccount) {
        throw new ValidationError('Bank account not found');
      }

      // Get decrypted bank details
      const accountNumber = await this.bankAccountService.getDecryptedAccountNumber(
        bankAccount.id,
        transaction.userId
      );
      const routingNumber = await this.bankAccountService.getDecryptedRoutingNumber(
        bankAccount.id,
        transaction.userId
      );

      // Create payment intent or charge based on transaction type
      let stripePaymentId: string;

      if (transaction.type === 'INVESTMENT_DEPOSIT' || transaction.type === 'CONTRIBUTION') {
        // Debit from investor (charge them)
        const paymentIntent = await stripe.paymentIntents.create({
          amount: transaction.amount,
          currency: transaction.currency.toLowerCase(),
          payment_method_types: ['us_bank_account'],
          description: transaction.description || `${transaction.type} - ${transaction.id}`,
          metadata: {
            transactionId: transaction.id,
            userId: transaction.userId,
            organizationId: transaction.organizationId
          }
        }, {
          idempotencyKey: transaction.idempotencyKey
        });

        stripePaymentId = paymentIntent.id;
      } else {
        // Credit to investor (payout/distribution)
        const payout = await stripe.payouts.create({
          amount: transaction.netAmount,
          currency: transaction.currency.toLowerCase(),
          description: transaction.description || `${transaction.type} - ${transaction.id}`,
          metadata: {
            transactionId: transaction.id,
            userId: transaction.userId
          }
        }, {
          idempotencyKey: transaction.idempotencyKey
        });

        stripePaymentId = payout.id;
      }

      // Update transaction with Stripe ID
      const updated = await this.updateTransactionStatus(transactionId, 'PENDING_SETTLEMENT', {
        stripePaymentIntentId: stripePaymentId,
        processedAt: new Date()
      });

      emit('transaction.processing', {
        transactionId: transaction.id,
        userId: transaction.userId,
        amount: transaction.amount,
        type: transaction.type
      });

      return updated;
    } catch (error: any) {
      // Handle Stripe errors
      await this.handlePaymentError(transactionId, error);
      throw error;
    }
  }

  /**
   * Process wire transfer (manual)
   */
  async processWireTransfer(transactionId: string): Promise<Transaction> {
    const transaction = await this.getTransaction(transactionId);

    await this.validateTransition(transaction, 'PROCESSING');

    // Generate wire instructions
    const wireInstructions = this.generateWireInstructions(transaction);

    const updated = await this.updateTransactionStatus(transactionId, 'PROCESSING', {
      wireInstructions,
      processedAt: new Date()
    });

    emit('transaction.wireInstructionsGenerated', {
      transactionId: transaction.id,
      userId: transaction.userId,
      instructions: wireInstructions
    });

    return updated;
  }

  /**
   * Mark wire transfer as completed (called manually after confirmation)
   */
  async completeWireTransfer(
    transactionId: string,
    confirmationNumber: string
  ): Promise<Transaction> {
    const transaction = await this.getTransaction(transactionId);

    if (transaction.method !== 'WIRE') {
      throw new ValidationError('Transaction is not a wire transfer');
    }

    const updated = await this.updateTransactionStatus(transactionId, 'COMPLETED', {
      completedAt: new Date(),
      metadata: {
        ...transaction.metadata,
        wireConfirmation: confirmationNumber
      }
    });

    emit('transaction.completed', {
      transactionId: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount
    });

    return updated;
  }

  /**
   * Process check payment (manual tracking)
   */
  async processCheck(transactionId: string, checkNumber: string): Promise<Transaction> {
    const transaction = await this.getTransaction(transactionId);

    await this.validateTransition(transaction, 'PROCESSING');

    const updated = await this.updateTransactionStatus(transactionId, 'PROCESSING', {
      processedAt: new Date(),
      metadata: {
        ...transaction.metadata,
        checkNumber
      }
    });

    emit('transaction.checkIssued', {
      transactionId: transaction.id,
      userId: transaction.userId,
      checkNumber
    });

    return updated;
  }

  /**
   * Mark check as deposited
   */
  async completeCheck(
    transactionId: string,
    depositConfirmation: string
  ): Promise<Transaction> {
    const transaction = await this.getTransaction(transactionId);

    if (transaction.method !== 'CHECK') {
      throw new ValidationError('Transaction is not a check');
    }

    const updated = await this.updateTransactionStatus(transactionId, 'COMPLETED', {
      completedAt: new Date(),
      metadata: {
        ...transaction.metadata,
        depositConfirmation
      }
    });

    emit('transaction.completed', {
      transactionId: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount
    });

    return updated;
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        bankAccount: { select: { id: true, last4: true, accountType: true } },
        offering: { select: { id: true, name: true } },
        escrowAccount: { select: { id: true, currentBalance: true } }
      }
    });

    if (!transaction) {
      throw new ValidationError('Transaction not found');
    }

    return transaction;
  }

  /**
   * Get transactions with filters
   */
  async getTransactions(filters: TransactionFilters = {}): Promise<{
    transactions: Transaction[];
    total: number;
    hasMore: boolean;
  }> {
    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.organizationId) where.organizationId = filters.organizationId;
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.method) where.method = filters.method;

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    if (filters.minAmount || filters.maxAmount) {
      where.amount = {};
      if (filters.minAmount) where.amount.gte = filters.minAmount;
      if (filters.maxAmount) where.amount.lte = filters.maxAmount;
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          bankAccount: { select: { id: true, last4: true, accountType: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      this.prisma.transaction.count({ where })
    ]);

    return {
      transactions,
      total,
      hasMore: offset + limit < total
    };
  }

  /**
   * Cancel transaction (only if not processing)
   */
  async cancelTransaction(transactionId: string, reason: string): Promise<Transaction> {
    const transaction = await this.getTransaction(transactionId);

    await this.validateTransition(transaction, 'CANCELLED');

    const updated = await this.updateTransactionStatus(transactionId, 'CANCELLED', {
      cancelledAt: new Date(),
      metadata: {
        ...transaction.metadata,
        cancellationReason: reason
      }
    });

    emit('transaction.cancelled', {
      transactionId: transaction.id,
      userId: transaction.userId,
      reason
    });

    return updated;
  }

  /**
   * Refund completed transaction
   */
  async refundTransaction(
    transactionId: string,
    amount?: number,
    reason?: string
  ): Promise<Transaction> {
    const transaction = await this.getTransaction(transactionId);

    if (transaction.status !== 'COMPLETED') {
      throw new ValidationError('Can only refund completed transactions');
    }

    const refundAmount = amount || transaction.netAmount;

    if (refundAmount > transaction.netAmount) {
      throw new ValidationError('Refund amount exceeds transaction amount');
    }

    // Process refund via Stripe if applicable
    if (transaction.stripePaymentIntentId && transaction.method === 'ACH') {
      const stripe = getStripeClient();
      await stripe.refunds.create({
        payment_intent: transaction.stripePaymentIntentId,
        amount: refundAmount
      }, {
        idempotencyKey: `${transaction.idempotencyKey}-refund`
      });
    }

    const updated = await this.updateTransactionStatus(transactionId, 'REFUNDED', {
      refundedAt: new Date(),
      refundAmount,
      metadata: {
        ...transaction.metadata,
        refundReason: reason,
        originalAmount: transaction.amount
      }
    });

    emit('transaction.refunded', {
      transactionId: transaction.id,
      userId: transaction.userId,
      refundAmount,
      reason
    });

    return updated;
  }

  /**
   * Retry failed transaction with exponential backoff
   */
  async retryFailedTransaction(transactionId: string): Promise<Transaction> {
    const transaction = await this.getTransaction(transactionId);

    if (transaction.status !== 'FAILED') {
      throw new ValidationError('Can only retry failed transactions');
    }

    if (transaction.retryCount >= MAX_RETRIES) {
      throw new ValidationError('Maximum retry attempts exceeded');
    }

    // Calculate next retry time with exponential backoff
    const delayMs = RETRY_DELAYS[transaction.retryCount] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
    const nextRetryAt = new Date(Date.now() + delayMs);

    // Reset to INITIATED status for retry
    const updated = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'INITIATED',
        retryCount: transaction.retryCount + 1,
        nextRetryAt,
        metadata: {
          ...transaction.metadata,
          lastFailure: transaction.failureReason,
          retryAttempts: transaction.retryCount + 1
        }
      }
    });

    emit('transaction.retryScheduled', {
      transactionId: transaction.id,
      userId: transaction.userId,
      retryCount: updated.retryCount,
      nextRetryAt
    });

    // Process the transaction
    if (transaction.method === 'ACH') {
      return this.processACHPayment(transactionId);
    }

    return updated;
  }

  /**
   * Update transaction status with audit trail
   */
  private async updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus,
    additionalData: Partial<Transaction> = {}
  ): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) {
      throw new ValidationError('Transaction not found');
    }

    const updated = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status,
        ...additionalData,
        updatedAt: new Date()
      }
    });

    // Create audit log
    await this.prisma.auditEvent.create({
      data: {
        action: `transaction.status_changed`,
        entityType: 'Transaction',
        entityId: transactionId,
        userId: transaction.userId,
        metadata: {
          oldStatus: transaction.status,
          newStatus: status,
          ...additionalData
        }
      }
    });

    return updated;
  }

  /**
   * Validate state transition
   */
  private async validateTransition(
    transaction: Transaction,
    newStatus: TransactionStatus
  ): Promise<void> {
    const validTransitions = VALID_TRANSITIONS[transaction.status];

    if (!validTransitions.includes(newStatus)) {
      throw new ValidationError(
        `Invalid transition from ${transaction.status} to ${newStatus}`
      );
    }
  }

  /**
   * Calculate transaction fees
   */
  private calculateFees(amount: number, method: TransactionMethod): {
    platformFee: number;
    processingFee: number;
  } {
    let platformFee = 0;
    let processingFee = 0;

    // Platform fee (1% of amount)
    platformFee = Math.floor(amount * 0.01);

    // Processing fee varies by method
    switch (method) {
      case 'ACH':
        processingFee = Math.min(Math.floor(amount * 0.008), 500); // 0.8%, max $5
        break;
      case 'WIRE':
        processingFee = 2500; // $25 flat fee
        break;
      case 'CHECK':
        processingFee = 0; // No processing fee for checks
        break;
      default:
        processingFee = 0;
    }

    return { platformFee, processingFee };
  }

  /**
   * Handle payment processing errors
   */
  private async handlePaymentError(transactionId: string, error: any): Promise<void> {
    const shouldRetry = this.isRetryableError(error);

    await this.updateTransactionStatus(transactionId, 'FAILED', {
      failureReason: error.message || 'Unknown error',
      failedAt: new Date(),
      metadata: {
        error: error.code || 'UNKNOWN',
        shouldRetry
      }
    });

    emit('transaction.failed', {
      transactionId,
      error: error.message,
      shouldRetry
    });
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    const retryableErrors = [
      'rate_limit_error',
      'api_connection_error',
      'temporary_hold',
      'processing_error'
    ];

    const nonRetryableErrors = [
      'insufficient_funds',
      'account_invalid',
      'account_closed',
      'fraud'
    ];

    if (error.type && nonRetryableErrors.includes(error.type)) {
      return false;
    }

    if (error.type && retryableErrors.includes(error.type)) {
      return true;
    }

    if (error.code && retryableErrors.includes(error.code)) {
      return true;
    }

    // Default to not retrying for unknown errors
    return false;
  }

  /**
   * Generate wire transfer instructions
   */
  private generateWireInstructions(transaction: Transaction): any {
    return {
      recipientName: 'RealCo Platform LLC',
      bankName: 'Example Bank',
      accountNumber: '****1234',
      routingNumber: '021000021',
      wireRoutingNumber: '026009593',
      swiftCode: 'BOFAUS3N',
      amount: transaction.amount / 100, // Convert to dollars
      reference: transaction.id,
      instructions: [
        'Include transaction ID in wire reference',
        'Processing time: 1-2 business days',
        'Contact support if you need assistance'
      ]
    };
  }
}
