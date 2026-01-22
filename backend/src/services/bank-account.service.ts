import { PrismaClient } from '@prisma/client';

export class BankAccountService {
  constructor(private prisma: PrismaClient) {}

  // Placeholder methods - to be implemented
  async getBankAccounts(userId: string) {
    return this.prisma.bankAccount.findMany({
      where: { userId },
    });
  }
}
