/**
 * TransactionService Unit Tests
 * 
 * Tests for transaction processing with state machine logic
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransactionService } from '../../src/services/transaction.service.js';
import { ValidationError, ComplianceError } from '../../src/services/errors.js';
import { createMockPrisma, testData, expectError } from '../setup.js';
import type { PrismaClient } from '@prisma/client';

// Mock dependencies
vi.mock('../../src/services/stripe.service.js', () => ({
  StripeService: vi.fn().mockImplementation(() => ({
    createPaymentIntent: vi.fn().mockResolvedValue({
      id: 'pi_test123',
      status: 'processing',
    }),
    processACHPayment: vi.fn().mockResolvedValue({
      success: true,
      paymentIntentId: 'pi_test123',
    }),
    refundPayment: vi.fn().mockResolvedValue({
      success: true,
      refundId: 're_test123',
    }),
  })),
}));

vi.mock('../../src/services/compliance.js', () => ({
  runComplianceChecks: vi.fn().mockResolvedValue({ approved: true, reason: null }),
  checkOFAC: vi.fn().mockResolvedValue({ passed: true }),
  checkTransactionLimits: vi.fn().mockResolvedValue({ passed: true }),
}));

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let mockPrisma: PrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    transactionService = new TransactionService(mockPrisma);
    vi.clearAllMocks();
  });

  describe('initiateTransaction', () => {
    it('should initiate a transaction successfully', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue(testData.bankAccount as any);
      vi.mocked(mockPrisma.transaction.create).mockResolvedValue(testData.transaction as any);

      const result = await transactionService.initiateTransaction({
        type: 'INVESTMENT_DEPOSIT',
        amount: 50000,
        fromUserId: 'user-1',
        fromBankAccountId: 'bank-1',
        offeringId: 'offering-1',
        paymentMethod: 'ACH',
        description: 'Investment deposit',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });

      expect(result).toBeDefined();
      expect(result.status).toBe('INITIATED');
      expect(mockPrisma.transaction.create).toHaveBeenCalled();
    });

    it('should calculate fees automatically', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue(testData.bankAccount as any);
      vi.mocked(mockPrisma.transaction.create).mockImplementation((data: any) => {
        const amount = data.data.amount;
        const feeAmount = data.data.feeAmount;
        const netAmount = data.data.netAmount;

        expect(feeAmount).toBeGreaterThan(0);
        expect(netAmount).toBe(amount - feeAmount);

        return Promise.resolve(testData.transaction as any);
      });

      await transactionService.initiateTransaction({
        type: 'INVESTMENT_DEPOSIT',
        amount: 50000,
        fromUserId: 'user-1',
        fromBankAccountId: 'bank-1',
        offeringId: 'offering-1',
        paymentMethod: 'ACH',
        description: 'Investment',
      });
    });

    it('should run compliance checks before creating transaction', async () => {
      const { runComplianceChecks } = await import('../../src/services/compliance.js');
      vi.mocked(runComplianceChecks).mockResolvedValue({ approved: false, reason: 'OFAC match' });

      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue(testData.bankAccount as any);

      await expectError(
        () => transactionService.initiateTransaction({
          type: 'INVESTMENT_DEPOSIT',
          amount: 50000,
          fromUserId: 'user-1',
          fromBankAccountId: 'bank-1',
          offeringId: 'offering-1',
          paymentMethod: 'ACH',
          description: 'Investment',
        }),
        ComplianceError
      );
    });

    it('should validate minimum transaction amount', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue(testData.bankAccount as any);

      await expectError(
        () => transactionService.initiateTransaction({
          type: 'INVESTMENT_DEPOSIT',
          amount: 0.50, // Too low
          fromUserId: 'user-1',
          fromBankAccountId: 'bank-1',
          offeringId: 'offering-1',
          paymentMethod: 'ACH',
          description: 'Investment',
        }),
        ValidationError
      );
    });

    it('should validate bank account is verified', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue({
        ...testData.bankAccount,
        status: 'PENDING_VERIFICATION',
      } as any);

      await expectError(
        () => transactionService.initiateTransaction({
          type: 'INVESTMENT_DEPOSIT',
          amount: 50000,
          fromUserId: 'user-1',
          fromBankAccountId: 'bank-1',
          offeringId: 'offering-1',
          paymentMethod: 'ACH',
          description: 'Investment',
        }),
        ValidationError
      );
    });

    it('should generate unique idempotency key', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue(testData.bankAccount as any);

      const createdKeys = new Set();

      vi.mocked(mockPrisma.transaction.create).mockImplementation((data: any) => {
        const key = data.data.idempotencyKey;
        expect(createdKeys.has(key)).toBe(false);
        createdKeys.add(key);
        return Promise.resolve({ ...testData.transaction, idempotencyKey: key } as any);
      });

      // Create multiple transactions
      await transactionService.initiateTransaction({
        type: 'INVESTMENT_DEPOSIT',
        amount: 50000,
        fromUserId: 'user-1',
        fromBankAccountId: 'bank-1',
        offeringId: 'offering-1',
        paymentMethod: 'ACH',
        description: 'Investment 1',
      });

      await transactionService.initiateTransaction({
        type: 'INVESTMENT_DEPOSIT',
        amount: 50000,
        fromUserId: 'user-1',
        fromBankAccountId: 'bank-1',
        offeringId: 'offering-1',
        paymentMethod: 'ACH',
        description: 'Investment 2',
      });

      expect(createdKeys.size).toBe(2);
    });
  });

  describe('processACHPayment', () => {
    it('should process ACH payment successfully', async () => {
      vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
        ...testData.transaction,
        status: 'INITIATED',
      } as any);

      vi.mocked(mockPrisma.transaction.update).mockResolvedValue({
        ...testData.transaction,
        status: 'PROCESSING',
        processedAt: new Date(),
      } as any);

      const result = await transactionService.processACHPayment(testData.transaction.id);

      expect(result.status).toBe('PROCESSING');
      expect(result.processedAt).toBeDefined();
    });

    it('should handle processing failures with retry logic', async () => {
      const { StripeService } = await import('../../src/services/stripe.service.js');
      
      vi.mocked(StripeService).mockImplementation(() => ({
        processACHPayment: vi.fn().mockRejectedValue(new Error('Stripe error')),
      }) as any);

      vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
        ...testData.transaction,
        status: 'INITIATED',
        retryCount: 0,
      } as any);

      vi.mocked(mockPrisma.transaction.update).mockResolvedValue({
        ...testData.transaction,
        status: 'FAILED',
        retryCount: 1,
        nextRetryAt: new Date(Date.now() + 1800000), // 30 min
      } as any);

      await expect(
        transactionService.processACHPayment(testData.transaction.id)
      ).rejects.toThrow();

      // Should have updated to FAILED with retry scheduled
      expect(mockPrisma.transaction.update).toHaveBeenCalledWith({
        where: { id: testData.transaction.id },
        data: expect.objectContaining({
          status: 'FAILED',
          retryCount: expect.any(Number),
          nextRetryAt: expect.any(Date),
        }),
      });
    });

    it('should not retry after max attempts', async () => {
      vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
        ...testData.transaction,
        status: 'FAILED',
        retryCount: 3, // Max retries
      } as any);

      await expectError(
        () => transactionService.processACHPayment(testData.transaction.id),
        ValidationError
      );
    });
  });

  describe('State Machine Transitions', () => {
    it('should enforce valid state transitions', async () => {
      // INITIATED -> PROCESSING (valid)
      vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
        ...testData.transaction,
        status: 'INITIATED',
      } as any);

      vi.mocked(mockPrisma.transaction.update).mockResolvedValue({
        ...testData.transaction,
        status: 'PROCESSING',
      } as any);

      const result = await transactionService.updateStatus(
        testData.transaction.id,
        'PROCESSING'
      );

      expect(result.status).toBe('PROCESSING');
    });

    it('should prevent invalid state transitions', async () => {
      // COMPLETED -> INITIATED (invalid)
      vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
        ...testData.transaction,
        status: 'COMPLETED',
      } as any);

      await expectError(
        () => transactionService.updateStatus(testData.transaction.id, 'INITIATED'),
        ValidationError
      );
    });

    it('should track timestamp for each state change', async () => {
      const transitions = [
        { from: 'INITIATED', to: 'PROCESSING', timestampField: 'processedAt' },
        { from: 'PROCESSING', to: 'COMPLETED', timestampField: 'completedAt' },
      ];

      for (const transition of transitions) {
        vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
          ...testData.transaction,
          status: transition.from,
        } as any);

        vi.mocked(mockPrisma.transaction.update).mockImplementation((data: any) => {
          expect(data.data).toHaveProperty(transition.timestampField);
          expect(data.data[transition.timestampField]).toBeInstanceOf(Date);
          return Promise.resolve({
            ...testData.transaction,
            status: transition.to,
          } as any);
        });

        await transactionService.updateStatus(testData.transaction.id, transition.to as any);
      }
    });
  });

  describe('cancelTransaction', () => {
    it('should cancel initiated transaction', async () => {
      vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
        ...testData.transaction,
        status: 'INITIATED',
      } as any);

      vi.mocked(mockPrisma.transaction.update).mockResolvedValue({
        ...testData.transaction,
        status: 'CANCELLED',
        cancelledAt: new Date(),
      } as any);

      const result = await transactionService.cancelTransaction(
        testData.transaction.id,
        'User requested cancellation'
      );

      expect(result.status).toBe('CANCELLED');
      expect(result.cancelledAt).toBeDefined();
    });

    it('should not cancel completed transaction', async () => {
      vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
        ...testData.transaction,
        status: 'COMPLETED',
      } as any);

      await expectError(
        () => transactionService.cancelTransaction(
          testData.transaction.id,
          'Cancel reason'
        ),
        ValidationError
      );
    });
  });

  describe('refundTransaction', () => {
    it('should refund completed transaction', async () => {
      vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
        ...testData.transaction,
        status: 'COMPLETED',
        stripePaymentIntentId: 'pi_test123',
      } as any);

      vi.mocked(mockPrisma.transaction.update).mockResolvedValue({
        ...testData.transaction,
        status: 'REFUNDED',
        refundedAt: new Date(),
      } as any);

      const result = await transactionService.refundTransaction(
        testData.transaction.id,
        50000,
        'Refund reason'
      );

      expect(result.status).toBe('REFUNDED');
    });

    it('should validate refund amount does not exceed original', async () => {
      vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
        ...testData.transaction,
        status: 'COMPLETED',
        amount: 50000,
      } as any);

      await expectError(
        () => transactionService.refundTransaction(
          testData.transaction.id,
          60000, // More than original
          'Refund'
        ),
        ValidationError
      );
    });

    it('should support partial refunds', async () => {
      vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
        ...testData.transaction,
        status: 'COMPLETED',
        amount: 50000,
      } as any);

      vi.mocked(mockPrisma.transaction.update).mockResolvedValue({
        ...testData.transaction,
        status: 'PARTIALLY_REFUNDED',
        refundedAmount: 25000,
      } as any);

      const result = await transactionService.refundTransaction(
        testData.transaction.id,
        25000, // Partial refund
        'Partial refund'
      );

      expect(result.status).toBe('PARTIALLY_REFUNDED');
      expect(result.refundedAmount).toBe(25000);
    });
  });

  describe('retryFailedTransaction', () => {
    it('should retry failed transaction', async () => {
      vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
        ...testData.transaction,
        status: 'FAILED',
        retryCount: 1,
        nextRetryAt: new Date(Date.now() - 1000), // Past retry time
      } as any);

      vi.mocked(mockPrisma.transaction.update).mockResolvedValue({
        ...testData.transaction,
        status: 'PENDING_RETRY',
        retryCount: 2,
      } as any);

      const result = await transactionService.retryFailedTransaction(testData.transaction.id);

      expect(result.status).toBe('PENDING_RETRY');
      expect(result.retryCount).toBe(2);
    });

    it('should use exponential backoff for retries', async () => {
      const retryDelays: number[] = [];

      for (let i = 0; i < 3; i++) {
        vi.mocked(mockPrisma.transaction.findUnique).mockResolvedValue({
          ...testData.transaction,
          status: 'FAILED',
          retryCount: i,
        } as any);

        vi.mocked(mockPrisma.transaction.update).mockImplementation((data: any) => {
          const nextRetryAt = data.data.nextRetryAt;
          if (nextRetryAt) {
            const delay = nextRetryAt.getTime() - Date.now();
            retryDelays.push(delay);
          }
          return Promise.resolve(testData.transaction as any);
        });

        await transactionService.retryFailedTransaction(testData.transaction.id);
      }

      // Each retry should have longer delay (exponential backoff)
      expect(retryDelays[1]).toBeGreaterThan(retryDelays[0]);
      expect(retryDelays[2]).toBeGreaterThan(retryDelays[1]);
    });
  });

  describe('getTransactions', () => {
    it('should retrieve transactions with filters', async () => {
      const transactions = [testData.transaction];

      vi.mocked(mockPrisma.transaction.findMany).mockResolvedValue(transactions as any);

      const result = await transactionService.getTransactions({
        userId: 'user-1',
        status: 'COMPLETED',
        type: 'INVESTMENT_DEPOSIT',
      });

      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          fromUserId: 'user-1',
          status: 'COMPLETED',
          type: 'INVESTMENT_DEPOSIT',
        }),
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should support pagination', async () => {
      vi.mocked(mockPrisma.transaction.findMany).mockResolvedValue([]);

      await transactionService.getTransactions({
        page: 2,
        limit: 20,
      });

      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 20, // (page - 1) * limit
        take: 20,
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by date range', async () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      vi.mocked(mockPrisma.transaction.findMany).mockResolvedValue([]);

      await transactionService.getTransactions({
        startDate,
        endDate,
      });

      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
