/**
 * Transaction API Integration Tests
 * 
 * Tests for transaction management endpoints
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

describe('Transaction API', () => {
  let testUser: any;
  let testOrg: any;
  let testOffering: any;
  let testBankAccount: any;

  beforeAll(async () => {
    // Create test organization
    testOrg = await prisma.organization.create({
      data: {
        name: 'Test Org',
      },
    });

    // Create test user
    const passwordHash = await bcrypt.hash('test123', 10);
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash,
        orgId: testOrg.id,
      },
    });

    // Create test offering
    testOffering = await prisma.offering.create({
      data: {
        name: 'Test Offering',
        status: 'active',
        regulationMode: '506c',
        orgId: testOrg.id,
      },
    });

    // Create test bank account
    testBankAccount = await prisma.bankAccount.create({
      data: {
        userId: testUser.id,
        accountType: 'CHECKING',
        accountHolderName: 'Test User',
        last4: '1234',
        routingNumberHash: 'hash123',
        accountNumberEnc: 'encrypted123',
        status: 'VERIFIED',
        verificationMethod: 'PLAID',
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.transaction.deleteMany({
      where: { fromUserId: testUser.id },
    });
    await prisma.bankAccount.deleteMany({
      where: { userId: testUser.id },
    });
    await prisma.offering.deleteMany({
      where: { orgId: testOrg.id },
    });
    await prisma.user.deleteMany({
      where: { orgId: testOrg.id },
    });
    await prisma.organization.deleteMany({
      where: { id: testOrg.id },
    });
    await prisma.$disconnect();
  });

  describe('Transaction Creation', () => {
    it('should create a deposit transaction', async () => {
      const transaction = await prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          status: 'INITIATED',
          paymentMethod: 'ACH',
          amount: 10000,
          feeAmount: 50.80,
          netAmount: 9949.20,
          fromUserId: testUser.id,
          fromBankAccountId: testBankAccount.id,
          offeringId: testOffering.id,
          idempotencyKey: `test-${Date.now()}`,
          description: 'Test deposit',
          complianceCheckPassed: true,
        },
      });

      expect(transaction.id).toBeDefined();
      expect(transaction.type).toBe('DEPOSIT');
      expect(transaction.amount).toBe(10000);
      expect(transaction.status).toBe('INITIATED');
    });

    it('should enforce unique idempotency key', async () => {
      const idempotencyKey = `test-unique-${Date.now()}`;

      await prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          status: 'INITIATED',
          paymentMethod: 'ACH',
          amount: 10000,
          feeAmount: 50.80,
          netAmount: 9949.20,
          fromUserId: testUser.id,
          idempotencyKey,
          description: 'Test deposit',
        },
      });

      // Attempt to create duplicate
      await expect(
        prisma.transaction.create({
          data: {
            type: 'DEPOSIT',
            status: 'INITIATED',
            paymentMethod: 'ACH',
            amount: 10000,
            feeAmount: 50.80,
            netAmount: 9949.20,
            fromUserId: testUser.id,
            idempotencyKey, // Same key
            description: 'Test deposit',
          },
        })
      ).rejects.toThrow();
    });

    it('should create transaction with all optional fields', async () => {
      const transaction = await prisma.transaction.create({
        data: {
          type: 'WITHDRAWAL',
          status: 'INITIATED',
          paymentMethod: 'WIRE',
          amount: 50000,
          feeAmount: 75,
          netAmount: 49925,
          fromUserId: testUser.id,
          toUserId: testUser.id,
          fromBankAccountId: testBankAccount.id,
          toBankAccountId: testBankAccount.id,
          offeringId: testOffering.id,
          idempotencyKey: `test-full-${Date.now()}`,
          description: 'Test withdrawal with all fields',
          internalMemo: 'Internal note',
          ipAddress: '127.0.0.1',
          userAgent: 'Test Agent',
          complianceCheckPassed: true,
          metadata: {
            testField: 'testValue',
          },
        },
      });

      expect(transaction.id).toBeDefined();
      expect(transaction.internalMemo).toBe('Internal note');
      expect(transaction.ipAddress).toBe('127.0.0.1');
      expect(transaction.metadata).toEqual({ testField: 'testValue' });
    });
  });

  describe('Transaction Queries', () => {
    let testTransaction: any;

    beforeEach(async () => {
      testTransaction = await prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          status: 'COMPLETED',
          paymentMethod: 'ACH',
          amount: 25000,
          feeAmount: 50.80,
          netAmount: 24949.20,
          fromUserId: testUser.id,
          offeringId: testOffering.id,
          idempotencyKey: `test-query-${Date.now()}`,
          description: 'Test query transaction',
          completedAt: new Date(),
        },
      });
    });

    it('should find transaction by ID', async () => {
      const found = await prisma.transaction.findUnique({
        where: { id: testTransaction.id },
      });

      expect(found).not.toBeNull();
      expect(found?.id).toBe(testTransaction.id);
      expect(found?.amount).toBe(25000);
    });

    it('should find transaction with relations', async () => {
      const found = await prisma.transaction.findUnique({
        where: { id: testTransaction.id },
        include: {
          fromUser: {
            select: { id: true, email: true },
          },
          offering: {
            select: { id: true, name: true },
          },
        },
      });

      expect(found).not.toBeNull();
      expect(found?.fromUser?.email).toBe(testUser.email);
      expect(found?.offering?.name).toBe(testOffering.name);
    });

    it('should filter transactions by status', async () => {
      const completed = await prisma.transaction.findMany({
        where: {
          fromUserId: testUser.id,
          status: 'COMPLETED',
        },
      });

      expect(completed.length).toBeGreaterThan(0);
      expect(completed.every((t) => t.status === 'COMPLETED')).toBe(true);
    });

    it('should filter transactions by amount range', async () => {
      const inRange = await prisma.transaction.findMany({
        where: {
          fromUserId: testUser.id,
          amount: {
            gte: 20000,
            lte: 30000,
          },
        },
      });

      expect(inRange.length).toBeGreaterThan(0);
      expect(inRange.every((t) => t.amount >= 20000 && t.amount <= 30000)).toBe(true);
    });

    it('should sort transactions by creation date', async () => {
      const sorted = await prisma.transaction.findMany({
        where: { fromUserId: testUser.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(
          sorted[i].createdAt.getTime()
        );
      }
    });
  });

  describe('Transaction Updates', () => {
    let testTransaction: any;

    beforeEach(async () => {
      testTransaction = await prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          status: 'INITIATED',
          paymentMethod: 'ACH',
          amount: 15000,
          feeAmount: 50.80,
          netAmount: 14949.20,
          fromUserId: testUser.id,
          idempotencyKey: `test-update-${Date.now()}`,
          description: 'Test update transaction',
        },
      });
    });

    it('should update transaction status', async () => {
      const updated = await prisma.transaction.update({
        where: { id: testTransaction.id },
        data: {
          status: 'PROCESSING',
          processedAt: new Date(),
        },
      });

      expect(updated.status).toBe('PROCESSING');
      expect(updated.processedAt).not.toBeNull();
    });

    it('should update transaction description', async () => {
      const updated = await prisma.transaction.update({
        where: { id: testTransaction.id },
        data: {
          description: 'Updated description',
        },
      });

      expect(updated.description).toBe('Updated description');
    });

    it('should increment retry count', async () => {
      const updated = await prisma.transaction.update({
        where: { id: testTransaction.id },
        data: {
          retryCount: { increment: 1 },
        },
      });

      expect(updated.retryCount).toBe(testTransaction.retryCount + 1);
    });
  });

  describe('Transaction Aggregations', () => {
    beforeAll(async () => {
      // Create multiple transactions for aggregation
      await prisma.transaction.createMany({
        data: [
          {
            type: 'DEPOSIT',
            status: 'COMPLETED',
            paymentMethod: 'ACH',
            amount: 10000,
            feeAmount: 50,
            netAmount: 9950,
            fromUserId: testUser.id,
            idempotencyKey: `agg-1-${Date.now()}`,
            description: 'Agg test 1',
          },
          {
            type: 'DEPOSIT',
            status: 'COMPLETED',
            paymentMethod: 'ACH',
            amount: 20000,
            feeAmount: 50,
            netAmount: 19950,
            fromUserId: testUser.id,
            idempotencyKey: `agg-2-${Date.now()}`,
            description: 'Agg test 2',
          },
          {
            type: 'WITHDRAWAL',
            status: 'COMPLETED',
            paymentMethod: 'WIRE',
            amount: 5000,
            feeAmount: 25,
            netAmount: 4975,
            fromUserId: testUser.id,
            idempotencyKey: `agg-3-${Date.now()}`,
            description: 'Agg test 3',
          },
        ],
      });
    });

    it('should calculate total transaction volume', async () => {
      const result = await prisma.transaction.aggregate({
        where: { fromUserId: testUser.id },
        _sum: {
          amount: true,
          feeAmount: true,
        },
        _count: true,
      });

      expect(result._sum.amount).toBeGreaterThan(0);
      expect(result._sum.feeAmount).toBeGreaterThan(0);
      expect(result._count).toBeGreaterThan(0);
    });

    it('should group transactions by status', async () => {
      const grouped = await prisma.transaction.groupBy({
        by: ['status'],
        where: { fromUserId: testUser.id },
        _sum: {
          amount: true,
        },
        _count: true,
      });

      expect(grouped.length).toBeGreaterThan(0);
      expect(grouped[0]._sum.amount).toBeGreaterThan(0);
    });

    it('should group transactions by type', async () => {
      const grouped = await prisma.transaction.groupBy({
        by: ['type'],
        where: { fromUserId: testUser.id },
        _sum: {
          amount: true,
        },
        _count: true,
      });

      expect(grouped.length).toBeGreaterThan(0);
    });

    it('should calculate average transaction amount', async () => {
      const result = await prisma.transaction.aggregate({
        where: {
          fromUserId: testUser.id,
          status: 'COMPLETED',
        },
        _avg: {
          amount: true,
        },
      });

      expect(result._avg.amount).toBeGreaterThan(0);
    });
  });

  describe('Transaction State Machine', () => {
    it('should track status transition timestamps', async () => {
      const transaction = await prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          status: 'INITIATED',
          paymentMethod: 'ACH',
          amount: 10000,
          feeAmount: 50,
          netAmount: 9950,
          fromUserId: testUser.id,
          idempotencyKey: `state-${Date.now()}`,
          description: 'State machine test',
        },
      });

      // Transition to PROCESSING
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'PROCESSING',
          processedAt: new Date(),
        },
      });

      // Transition to COMPLETED
      const completed = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      expect(completed.processedAt).not.toBeNull();
      expect(completed.completedAt).not.toBeNull();
    });

    it('should handle failed transaction retry', async () => {
      const transaction = await prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          status: 'FAILED',
          paymentMethod: 'ACH',
          amount: 10000,
          feeAmount: 50,
          netAmount: 9950,
          fromUserId: testUser.id,
          idempotencyKey: `retry-${Date.now()}`,
          description: 'Retry test',
          failedAt: new Date(),
          failureCode: 'insufficient_funds',
          failureMessage: 'Insufficient funds',
        },
      });

      // Schedule retry
      const retried = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'PENDING_RETRY',
          retryCount: { increment: 1 },
          nextRetryAt: new Date(Date.now() + 1800000), // 30 minutes
        },
      });

      expect(retried.status).toBe('PENDING_RETRY');
      expect(retried.retryCount).toBe(1);
      expect(retried.nextRetryAt).not.toBeNull();
    });
  });

  describe('Transaction Compliance', () => {
    it('should store compliance check results', async () => {
      const transaction = await prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          status: 'INITIATED',
          paymentMethod: 'ACH',
          amount: 10000,
          feeAmount: 50,
          netAmount: 9950,
          fromUserId: testUser.id,
          idempotencyKey: `compliance-${Date.now()}`,
          description: 'Compliance test',
          complianceCheckPassed: true,
          complianceCheckData: {
            checks: [
              {
                checkType: 'LIMIT_CHECK',
                passed: true,
                details: { dailyLimit: 50000, currentTotal: 10000 },
              },
            ],
          },
        },
      });

      expect(transaction.complianceCheckPassed).toBe(true);
      expect(transaction.complianceCheckData).toBeDefined();
    });

    it('should track IP address and user agent', async () => {
      const transaction = await prisma.transaction.create({
        data: {
          type: 'DEPOSIT',
          status: 'INITIATED',
          paymentMethod: 'ACH',
          amount: 10000,
          feeAmount: 50,
          netAmount: 9950,
          fromUserId: testUser.id,
          idempotencyKey: `tracking-${Date.now()}`,
          description: 'Tracking test',
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 Test',
        },
      });

      expect(transaction.ipAddress).toBe('192.168.1.1');
      expect(transaction.userAgent).toBe('Mozilla/5.0 Test');
    });
  });
});



