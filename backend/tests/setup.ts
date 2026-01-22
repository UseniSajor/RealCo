/**
 * Test Setup and Utilities
 * 
 * Provides mock implementations and test helpers for unit testing
 */

import { vi } from 'vitest';
import type { PrismaClient } from '@prisma/client';

/**
 * Create a mock PrismaClient for unit testing
 */
export function createMockPrisma(): PrismaClient {
  return {
    project: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    task: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    dailyLog: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    developmentProject: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    auditEvent: {
      create: vi.fn(),
    },
    transaction: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    bankAccount: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    escrowAccount: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback({
      project: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      task: {
        findMany: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      auditEvent: {
        create: vi.fn(),
      },
    })),
  } as any;
}

/**
 * Mock compliance service
 */
export const mockCompliance = {
  runComplianceChecks: vi.fn().mockResolvedValue({
    approved: true,
    reason: null,
  }),
};

/**
 * Mock event emitter
 */
export const mockEvents = {
  emit: vi.fn(),
  on: vi.fn(),
};

/**
 * Sample test data
 */
export const testData = {
  project: {
    id: 'test-project-1',
    projectCode: 'RC-2025-001',
    developmentProjectId: 'dev-project-1',
    projectPhase: 'FOUNDATION',
    overallProgress: 45.5,
    plannedStartDate: new Date('2025-01-01'),
    plannedEndDate: new Date('2025-12-31'),
    actualStartDate: new Date('2025-01-15'),
    totalBudget: 5000000,
    spentBudget: 1250000,
    scheduleVarianceDays: -14,
    costVariance: 50000,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
    deletedAt: null,
  },
  developmentProject: {
    id: 'dev-project-1',
    name: 'Test Development Project',
    address: '123 Test St',
    city: 'Test City',
    state: 'CA',
    zip: '90210',
    projectType: 'NEW_CONSTRUCTION',
    orgId: 'org-1',
    offeringId: 'offering-1',
    offering: {
      id: 'offering-1',
      status: 'FUNDED',
      totalRaised: 5000000,
    },
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  task: {
    id: 'task-1',
    projectId: 'test-project-1',
    title: 'Foundation Work',
    description: 'Pour foundation',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    percentComplete: 75,
    plannedStartDate: new Date('2025-01-01'),
    plannedEndDate: new Date('2025-02-01'),
    actualStartDate: new Date('2025-01-05'),
    durationDays: 30,
    predecessorTaskIds: [],
    lagDays: 0,
    isCriticalPath: true,
    budgetAmount: 250000,
    actualCost: 220000,
    assignedToId: 'user-1',
    parentId: null,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-20'),
  },
  dailyLog: {
    id: 'log-1',
    projectId: 'test-project-1',
    logDate: new Date('2025-01-20'),
    weather: 'SUNNY',
    temperature: 72,
    laborCount: 15,
    equipmentUsed: ['Excavator', 'Concrete Mixer'],
    workCompleted: 'Completed foundation pour in south section',
    issues: 'Minor delay due to concrete delivery',
    visitorLog: ['Inspector John Doe'],
    safetyNotes: 'All safety protocols followed',
    photos: ['s3://bucket/photo1.jpg', 's3://bucket/photo2.jpg'],
    createdById: 'user-1',
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
  },
  transaction: {
    id: 'txn-1',
    type: 'INVESTMENT_DEPOSIT',
    status: 'COMPLETED',
    paymentMethod: 'ACH',
    amount: 50000,
    feeAmount: 50.80,
    netAmount: 49949.20,
    fromUserId: 'user-1',
    fromBankAccountId: 'bank-1',
    offeringId: 'offering-1',
    stripePaymentIntentId: 'pi_test123',
    idempotencyKey: 'idem-key-1',
    description: 'Investment deposit',
    complianceCheckPassed: true,
    processedAt: new Date('2025-01-15T10:00:00Z'),
    completedAt: new Date('2025-01-15T10:05:00Z'),
    createdAt: new Date('2025-01-15T09:55:00Z'),
    updatedAt: new Date('2025-01-15T10:05:00Z'),
  },
  bankAccount: {
    id: 'bank-1',
    userId: 'user-1',
    accountType: 'CHECKING',
    accountHolderName: 'John Doe',
    last4: '1234',
    routingNumberHash: 'hash123',
    accountNumberEnc: 'encrypted123',
    status: 'VERIFIED',
    verificationMethod: 'PLAID',
    plaidAccessToken: 'token123',
    isDefault: true,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
};

/**
 * Helper to create date ranges for testing
 */
export function createDateRange(startDaysAgo: number, endDaysFromNow: number) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - startDaysAgo);
  const end = new Date(now);
  end.setDate(end.getDate() + endDaysFromNow);
  return { start, end };
}

/**
 * Helper to assert error is thrown
 */
export async function expectError(
  fn: () => Promise<any>,
  errorType: new (...args: any[]) => Error
): Promise<void> {
  let error: Error | null = null;
  try {
    await fn();
  } catch (e) {
    error = e as Error;
  }
  if (!error) {
    throw new Error(`Expected ${errorType.name} to be thrown, but no error was thrown`);
  }
  if (!(error instanceof errorType)) {
    throw new Error(`Expected ${errorType.name}, but got ${error.constructor.name}: ${error.message}`);
  }
}
