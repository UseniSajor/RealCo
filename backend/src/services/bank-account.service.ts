import { PrismaClient } from '@prisma/client';

export class BankAccountService {
  constructor(private prisma: PrismaClient) {}

  async getBankAccounts(userId: string) {
    return this.prisma.bankAccount.findMany({
      where: { userId },
    });
  }

  async addBankAccount(userId: string, data: any) {
    // Stub implementation
    throw new Error('Not implemented');
  }

  async verifyWithPlaid(userId: string, publicToken: string, accountId?: string) {
    // Stub implementation
    throw new Error('Not implemented');
  }

  async initiateMicroDeposits(accountId: string) {
    // Stub implementation
    throw new Error('Not implemented');
  }

  async verifyMicroDeposits(accountId: string, amounts: { amount1: number; amount2: number }) {
    // Stub implementation
    throw new Error('Not implemented');
  }

  async setDefaultAccount(accountId: string, userId: string) {
    // Stub implementation
    throw new Error('Not implemented');
  }

  async removeBankAccount(accountId: string, userId: string) {
    // Stub implementation
    throw new Error('Not implemented');
  }
}
