/**
 * BankAccountService Unit Tests
 * 
 * Tests for bank account management with Plaid integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BankAccountService } from '../../src/services/bank-account.service.js';
import { ValidationError } from '../../src/services/errors.js';
import { createMockPrisma, testData, expectError } from '../setup.js';
import type { PrismaClient } from '@prisma/client';

// Mock Plaid service
vi.mock('../../src/services/plaid.js', () => ({
  PlaidService: vi.fn().mockImplementation(() => ({
    exchangePublicToken: vi.fn().mockResolvedValue({
      accessToken: 'access-token-123',
      accountId: 'plaid-account-id',
    }),
    getAccountDetails: vi.fn().mockResolvedValue({
      accountType: 'CHECKING',
      accountHolderName: 'John Doe',
      last4: '1234',
      routingNumber: '123456789',
    }),
    verifyAccount: vi.fn().mockResolvedValue(true),
  })),
}));

// Mock encryption service
vi.mock('../../src/services/encryption.js', () => ({
  encrypt: vi.fn((data) => `encrypted_${data}`),
  decrypt: vi.fn((data) => data.replace('encrypted_', '')),
  hashData: vi.fn((data) => `hash_${data}`),
}));

describe('BankAccountService', () => {
  let bankAccountService: BankAccountService;
  let mockPrisma: PrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    bankAccountService = new BankAccountService(mockPrisma);
    vi.clearAllMocks();
  });

  describe('addBankAccount', () => {
    it('should add bank account via Plaid', async () => {
      vi.mocked(mockPrisma.bankAccount.create).mockResolvedValue(testData.bankAccount as any);

      const result = await bankAccountService.addBankAccount(
        'user-1',
        {
          publicToken: 'public-token-123',
          accountId: 'plaid-account-id',
          verificationMethod: 'PLAID',
        }
      );

      expect(result).toBeDefined();
      expect(result.status).toBe('VERIFIED');
      expect(mockPrisma.bankAccount.create).toHaveBeenCalled();
    });

    it('should add bank account manually', async () => {
      vi.mocked(mockPrisma.bankAccount.create).mockResolvedValue({
        ...testData.bankAccount,
        status: 'PENDING_VERIFICATION',
        verificationMethod: 'MICRO_DEPOSIT',
      } as any);

      const result = await bankAccountService.addBankAccount(
        'user-1',
        {
          accountHolderName: 'Jane Doe',
          routingNumber: '987654321',
          accountNumber: '9876543210',
          accountType: 'SAVINGS',
          verificationMethod: 'MICRO_DEPOSIT',
        }
      );

      expect(result.status).toBe('PENDING_VERIFICATION');
      expect(result.verificationMethod).toBe('MICRO_DEPOSIT');
    });

    it('should encrypt account number', async () => {
      const { encrypt } = await import('../../src/services/encryption.js');

      vi.mocked(mockPrisma.bankAccount.create).mockResolvedValue(testData.bankAccount as any);

      await bankAccountService.addBankAccount(
        'user-1',
        {
          accountHolderName: 'John Doe',
          routingNumber: '123456789',
          accountNumber: '1234567890',
          accountType: 'CHECKING',
          verificationMethod: 'MANUAL',
        }
      );

      expect(encrypt).toHaveBeenCalledWith('1234567890');
    });

    it('should hash routing number', async () => {
      const { hashData } = await import('../../src/services/encryption.js');

      vi.mocked(mockPrisma.bankAccount.create).mockResolvedValue(testData.bankAccount as any);

      await bankAccountService.addBankAccount(
        'user-1',
        {
          accountHolderName: 'John Doe',
          routingNumber: '123456789',
          accountNumber: '1234567890',
          accountType: 'CHECKING',
          verificationMethod: 'MANUAL',
        }
      );

      expect(hashData).toHaveBeenCalledWith('123456789');
    });

    it('should set first account as default', async () => {
      vi.mocked(mockPrisma.bankAccount.findMany).mockResolvedValue([]);
      vi.mocked(mockPrisma.bankAccount.create).mockResolvedValue({
        ...testData.bankAccount,
        isDefault: true,
      } as any);

      const result = await bankAccountService.addBankAccount(
        'user-1',
        {
          publicToken: 'token',
          accountId: 'id',
          verificationMethod: 'PLAID',
        }
      );

      expect(result.isDefault).toBe(true);
    });

    it('should validate routing number format', async () => {
      await expectError(
        () => bankAccountService.addBankAccount(
          'user-1',
          {
            accountHolderName: 'John Doe',
            routingNumber: '12345', // Invalid: too short
            accountNumber: '1234567890',
            accountType: 'CHECKING',
            verificationMethod: 'MANUAL',
          }
        ),
        ValidationError
      );
    });
  });

  describe('verifyWithPlaid', () => {
    it('should verify account via Plaid', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue({
        ...testData.bankAccount,
        status: 'PENDING_VERIFICATION',
      } as any);

      vi.mocked(mockPrisma.bankAccount.update).mockResolvedValue({
        ...testData.bankAccount,
        status: 'VERIFIED',
      } as any);

      const result = await bankAccountService.verifyWithPlaid(testData.bankAccount.id);

      expect(result.status).toBe('VERIFIED');
      expect(mockPrisma.bankAccount.update).toHaveBeenCalledWith({
        where: { id: testData.bankAccount.id },
        data: {
          status: 'VERIFIED',
          verifiedAt: expect.any(Date),
        },
      });
    });

    it('should throw error if account not found', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue(null);

      await expect(
        bankAccountService.verifyWithPlaid('invalid-id')
      ).rejects.toThrow();
    });
  });

  describe('initiateMicroDeposits', () => {
    it('should initiate micro-deposit verification', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue(testData.bankAccount as any);
      vi.mocked(mockPrisma.bankAccount.update).mockResolvedValue(testData.bankAccount as any);

      // Mock Stripe micro-deposit creation
      const result = await bankAccountService.initiateMicroDeposits(testData.bankAccount.id);

      expect(result).toBeDefined();
      expect(mockPrisma.bankAccount.update).toHaveBeenCalled();
    });
  });

  describe('verifyMicroDeposits', () => {
    it('should verify account with correct amounts', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue({
        ...testData.bankAccount,
        status: 'PENDING_VERIFICATION',
        microDepositAmount1: 32,
        microDepositAmount2: 45,
      } as any);

      vi.mocked(mockPrisma.bankAccount.update).mockResolvedValue({
        ...testData.bankAccount,
        status: 'VERIFIED',
      } as any);

      const result = await bankAccountService.verifyMicroDeposits(
        testData.bankAccount.id,
        32,
        45
      );

      expect(result.status).toBe('VERIFIED');
    });

    it('should reject incorrect amounts', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue({
        ...testData.bankAccount,
        status: 'PENDING_VERIFICATION',
        microDepositAmount1: 32,
        microDepositAmount2: 45,
        verificationAttempts: 0,
      } as any);

      vi.mocked(mockPrisma.bankAccount.update).mockResolvedValue({
        ...testData.bankAccount,
        verificationAttempts: 1,
      } as any);

      await expectError(
        () => bankAccountService.verifyMicroDeposits(
          testData.bankAccount.id,
          10, // Wrong
          20  // Wrong
        ),
        ValidationError
      );
    });

    it('should block account after max attempts', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue({
        ...testData.bankAccount,
        status: 'PENDING_VERIFICATION',
        microDepositAmount1: 32,
        microDepositAmount2: 45,
        verificationAttempts: 2, // Already 2 attempts
      } as any);

      vi.mocked(mockPrisma.bankAccount.update).mockResolvedValue({
        ...testData.bankAccount,
        status: 'VERIFICATION_FAILED',
        verificationAttempts: 3,
      } as any);

      // Third failed attempt should fail verification
      await expectError(
        () => bankAccountService.verifyMicroDeposits(
          testData.bankAccount.id,
          10,
          20
        ),
        ValidationError
      );
    });
  });

  describe('getBankAccounts', () => {
    it('should retrieve all bank accounts for user', async () => {
      const accounts = [
        testData.bankAccount,
        { ...testData.bankAccount, id: 'bank-2', isDefault: false },
      ];

      vi.mocked(mockPrisma.bankAccount.findMany).mockResolvedValue(accounts as any);

      const result = await bankAccountService.getBankAccounts('user-1');

      expect(result).toHaveLength(2);
      expect(mockPrisma.bankAccount.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'desc' },
        ],
      });
    });

    it('should filter for verified accounts only', async () => {
      vi.mocked(mockPrisma.bankAccount.findMany).mockResolvedValue([testData.bankAccount] as any);

      const result = await bankAccountService.getBankAccounts('user-1', {
        verifiedOnly: true,
      });

      expect(mockPrisma.bankAccount.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          status: 'VERIFIED',
        },
        orderBy: expect.any(Array),
      });
    });
  });

  describe('setDefaultAccount', () => {
    it('should set account as default and unset others', async () => {
      vi.mocked(mockPrisma.$transaction).mockImplementation(async (callback: any) => {
        const txMock = {
          bankAccount: {
            updateMany: vi.fn(),
            update: vi.fn().mockResolvedValue({
              ...testData.bankAccount,
              isDefault: true,
            }),
          },
        };
        return await callback(txMock);
      });

      const result = await bankAccountService.setDefaultAccount(
        'user-1',
        testData.bankAccount.id
      );

      expect(result.isDefault).toBe(true);
    });

    it('should unset previous default', async () => {
      let updateManyCalled = false;

      vi.mocked(mockPrisma.$transaction).mockImplementation(async (callback: any) => {
        const txMock = {
          bankAccount: {
            updateMany: vi.fn().mockImplementation(() => {
              updateManyCalled = true;
              return { count: 1 };
            }),
            update: vi.fn().mockResolvedValue(testData.bankAccount),
          },
        };
        return await callback(txMock);
      });

      await bankAccountService.setDefaultAccount('user-1', testData.bankAccount.id);

      expect(updateManyCalled).toBe(true);
    });
  });

  describe('removeBankAccount', () => {
    it('should soft delete bank account', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue(testData.bankAccount as any);
      vi.mocked(mockPrisma.bankAccount.update).mockResolvedValue({
        ...testData.bankAccount,
        deletedAt: new Date(),
      } as any);

      await bankAccountService.removeBankAccount(testData.bankAccount.id);

      expect(mockPrisma.bankAccount.update).toHaveBeenCalledWith({
        where: { id: testData.bankAccount.id },
        data: {
          deletedAt: expect.any(Date),
        },
      });
    });

    it('should prevent removing default account if others exist', async () => {
      vi.mocked(mockPrisma.bankAccount.findUnique).mockResolvedValue({
        ...testData.bankAccount,
        isDefault: true,
      } as any);

      vi.mocked(mockPrisma.bankAccount.findMany).mockResolvedValue([
        testData.bankAccount,
        { ...testData.bankAccount, id: 'bank-2' },
      ] as any);

      await expectError(
        () => bankAccountService.removeBankAccount(testData.bankAccount.id),
        ValidationError
      );
    });
  });

  describe('account security', () => {
    it('should never expose full account number', async () => {
      vi.mocked(mockPrisma.bankAccount.findMany).mockResolvedValue([testData.bankAccount] as any);

      const result = await bankAccountService.getBankAccounts('user-1');

      expect(result[0]).toHaveProperty('last4');
      expect(result[0]).not.toHaveProperty('accountNumber');
      expect(result[0]).toHaveProperty('accountNumberEnc'); // Encrypted only
    });

    it('should mask routing number in responses', async () => {
      vi.mocked(mockPrisma.bankAccount.findMany).mockResolvedValue([testData.bankAccount] as any);

      const result = await bankAccountService.getBankAccounts('user-1');

      expect(result[0]).toHaveProperty('routingNumberHash');
      expect(result[0]).not.toHaveProperty('routingNumber'); // Never exposed
    });
  });
});
