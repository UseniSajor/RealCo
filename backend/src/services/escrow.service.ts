/**
 * Escrow Account Service
 * 
 * Manages segregated escrow accounts for real estate offerings.
 * 
 * Features:
 * - Create escrow account per offering
 * - Track deposits and withdrawals
 * - Calculate waterfall distributions
 * - Maintain double-entry ledger
 * - Daily reconciliation
 * - Fund hold/release controls
 */

import type { PrismaClient, EscrowAccount, Distribution } from '@prisma/client';
import {
  EscrowAccountNotFoundError,
  ValidationError,
  InsufficientFundsError,
  BusinessRuleError,
} from './errors.js';
import { emitEvent } from './events.js';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface CreateEscrowAccountDTO {
  offeringId: string;
  externalAccountId?: string;
}

export interface DepositFundsDTO {
  amount: number;
  transactionId: string;
  description: string;
}

export interface WithdrawFundsDTO {
  amount: number;
  transactionId: string;
  description: string;
  requiresApproval?: boolean;
}

export interface DistributionCalculation {
  totalAmount: number;
  returnOfCapitalAmount: number;
  preferredReturnAmount: number;
  sponsorCatchupAmount: number;
  profitSplitAmount: number;
  allocations: InvestorAllocation[];
}

export interface InvestorAllocation {
  investorId: string;
  investmentId: string;
  returnOfCapital: number;
  preferredReturn: number;
  profitSplit: number;
  totalAmount: number;
}

// =============================================================================
// ESCROW SERVICE
// =============================================================================

export class EscrowService {
  constructor(private prisma: PrismaClient) {}

  // ===========================================================================
  // ACCOUNT MANAGEMENT
  // ===========================================================================

  /**
   * Create escrow account for an offering
   */
  async createEscrowAccount(data: CreateEscrowAccountDTO): Promise<EscrowAccount> {
    // Check if offering exists
    const offering = await this.prisma.offering.findUnique({
      where: { id: data.offeringId },
    });

    if (!offering) {
      throw new ValidationError('Offering not found');
    }

    // Check if escrow already exists
    const existing = await this.prisma.escrowAccount.findUnique({
      where: { offeringId: data.offeringId },
    });

    if (existing) {
      throw new BusinessRuleError('Escrow account already exists for this offering');
    }

    // Generate account number
    const year = new Date().getFullYear();
    const count = await this.prisma.escrowAccount.count();
    const accountNumber = `ESCROW-${year}-${String(count + 1).padStart(4, '0')}`;

    const escrow = await this.prisma.$transaction(async (tx) => {
      const account = await tx.escrowAccount.create({
        data: {
          offeringId: data.offeringId,
          accountNumber,
          accountName: `Escrow Account ${accountNumber}`, // Added missing required field
          status: 'ACTIVE',
          balance: 0,
          availableBalance: 0,
          reservedAmount: 0,
        },
      });

      await tx.auditEvent.create({
        data: {
          action: 'escrow_account.created',
          entityType: 'EscrowAccount',
          entityId: account.id,
          metadata: {
            offeringId: data.offeringId,
            accountNumber,
          },
        },
      });

      return account;
    });

    await emitEvent('escrow_account.created', {
      escrowAccountId: escrow.id,
      offeringId: data.offeringId,
    });

    return escrow;
  }

  /**
   * Get escrow account by ID
   */
  async getEscrowAccount(id: string): Promise<EscrowAccount> {
    const account = await this.prisma.escrowAccount.findUnique({
      where: { id },
      include: {
        offering: {
          select: { id: true, name: true },
        },
      },
    });

    if (!account) {
      throw new EscrowAccountNotFoundError(id);
    }

    return account;
  }

  /**
   * Get escrow account by offering ID
   */
  async getEscrowAccountByOffering(offeringId: string): Promise<EscrowAccount> {
    const account = await this.prisma.escrowAccount.findUnique({
      where: { offeringId },
    });

    if (!account) {
      throw new EscrowAccountNotFoundError(`for offering ${offeringId}`);
    }

    return account;
  }

  // ===========================================================================
  // DEPOSIT & WITHDRAWAL
  // ===========================================================================

  /**
   * Deposit funds into escrow
   */
  async depositFunds(escrowAccountId: string, data: DepositFundsDTO): Promise<EscrowAccount> {
    const account = await this.getEscrowAccount(escrowAccountId);

    const updated = await this.prisma.$transaction(async (tx) => {
      // Get current balance
      const currentBalance = Number(account.balance);

      // Create ledger entry
      await tx.escrowLedgerEntry.create({
        data: {
          escrowAccountId,
          transactionId: data.transactionId,
          entryType: 'DEPOSIT',
          amount: Number(data.amount),
          balanceBefore: currentBalance,
          balanceAfter: currentBalance + Number(data.amount),
          description: data.description,
        },
      });

      // Update escrow account
      return await tx.escrowAccount.update({
        where: { id: escrowAccountId },
        data: {
          balance: { increment: data.amount },
          availableBalance: { increment: data.amount },
        },
      });
    });

    // emitEvent('escrow.deposited', {
    //   escrowAccountId,
    //   amount: data.amount,
    //   newBalance: updated.balance,
    // });

    return updated;
  }

  /**
   * Withdraw funds from escrow
   */
  async withdrawFunds(escrowAccountId: string, data: WithdrawFundsDTO): Promise<EscrowAccount> {
    const account = await this.getEscrowAccount(escrowAccountId);

    // Check sufficient funds
    const availableBal = typeof account.availableBalance === 'object' 
      ? account.availableBalance.toNumber() 
      : Number(account.availableBalance);
    if (availableBal < data.amount) {
      throw new InsufficientFundsError(
        `Insufficient escrow funds. Available: $${availableBal}, Requested: $${data.amount}`
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const currentBalance = Number(account.balance);

      // Create ledger entry
      await tx.escrowLedgerEntry.create({
        data: {
          escrowAccountId,
          transactionId: data.transactionId,
          entryType: 'WITHDRAWAL',
          amount: -Number(data.amount), // Negative for withdrawal
          balanceBefore: currentBalance,
          balanceAfter: currentBalance - Number(data.amount),
          description: data.description,
        },
      });

      // Update escrow account
      return await tx.escrowAccount.update({
        where: { id: escrowAccountId },
        data: {
          balance: { decrement: data.amount },
          availableBalance: { decrement: data.amount },
        },
      });
    });

    // emitEvent('escrow.withdrawn', {
    //   escrowAccountId,
    //   amount: data.amount,
    //   newBalance: updated.balance,
    // });

    return updated;
  }

  // ===========================================================================
  // DISTRIBUTION CALCULATIONS
  // ===========================================================================

  /**
   * Calculate waterfall distribution
   * 
   * Waterfall structure:
   * 1. Return of Capital - Return investor principal
   * 2. Preferred Return - 8% annual cumulative
   * 3. Sponsor Catch-up - Sponsor catches up to investor preferred return
   * 4. Profit Split - Remaining profits split 70/30 (investor/sponsor)
   */
  async calculateDistribution(
    offeringId: string,
    distributionAmount: number
  ): Promise<DistributionCalculation> {
    // Get all active investments
    const investments = await this.prisma.investment.findMany({
      where: {
        offeringId,
        status: 'ACTIVE',
      },
    });

    if (investments.length === 0) {
      throw new ValidationError('No active investments found for offering');
    }

    let remaining = distributionAmount;
    const allocations: InvestorAllocation[] = [];
    let totalReturnOfCapital = 0;
    let totalPreferredReturn = 0;
    let totalSponsorCatchup = 0;
    let totalProfitSplit = 0;

    // Tier 1: Return of Capital
    for (const investment of investments) {
      if (remaining <= 0) break;

      const capitalOwed = investment.currentBalance;
      const allocation = Math.min(remaining, capitalOwed);

      if (allocation > 0) {
        allocations.push({
          investorId: investment.investorId,
          investmentId: investment.id,
          returnOfCapital: allocation,
          preferredReturn: 0,
          profitSplit: 0,
          totalAmount: allocation,
        });

        remaining -= allocation;
        totalReturnOfCapital += allocation;
      }
    }

    // Tier 2: Preferred Return
    if (remaining > 0) {
      for (const investment of investments) {
        if (remaining <= 0) break;

        const preferredOwed = investment.preferredReturnOwed - investment.preferredReturnPaid;
        const allocation = Math.min(remaining, preferredOwed);

        if (allocation > 0) {
          const existing = allocations.find((a) => a.investmentId === investment.id);
          if (existing) {
            existing.preferredReturn = allocation;
            existing.totalAmount += allocation;
          } else {
            allocations.push({
              investorId: investment.investorId,
              investmentId: investment.id,
              returnOfCapital: 0,
              preferredReturn: allocation,
              profitSplit: 0,
              totalAmount: allocation,
            });
          }

          remaining -= allocation;
          totalPreferredReturn += allocation;
        }
      }
    }

    // Tier 3: Sponsor Catch-up (20% to sponsor until they match preferred return)
    // Tier 4: Profit Split (70/30)
    // TODO: Implement sponsor catch-up and profit split logic

    return {
      totalAmount: distributionAmount,
      returnOfCapitalAmount: totalReturnOfCapital,
      preferredReturnAmount: totalPreferredReturn,
      sponsorCatchupAmount: totalSponsorCatchup,
      profitSplitAmount: totalProfitSplit,
      allocations,
    };
  }

  /**
   * Get escrow ledger (transaction history)
   */
  async getLedger(
    escrowAccountId: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 100
  ): Promise<any[]> {
    const entries = await this.prisma.escrowLedgerEntry.findMany({
      where: {
        escrowAccountId,
        ...(startDate && { createdAt: { gte: startDate } }),
        ...(endDate && { createdAt: { lte: endDate } }),
      },
      include: {
        transaction: {
          select: {
            id: true,
            // type: true, // Not in Transaction model
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return entries;
  }

  /**
   * Reconcile escrow account
   * Compares database balance with actual bank balance
   */
  async reconcileAccount(escrowAccountId: string, bankBalance: number): Promise<{
    matched: boolean;
    difference: number;
    databaseBalance: number;
    bankBalance: number;
  }> {
    const account = await this.getEscrowAccount(escrowAccountId);

    const difference = Math.abs(Number(account.balance) - bankBalance);
    const matched = difference < 0.01; // Allow 1 cent variance for rounding

    // Update last reconciled
    await this.prisma.escrowAccount.update({
      where: { id: escrowAccountId },
      data: {
        lastReconciledAt: new Date(),
        lastReconciledBalance: bankBalance,
      },
    });

    if (!matched) {
      console.warn(
        `Escrow reconciliation mismatch: DB=${account.balance}, Bank=${bankBalance}, Diff=${difference}`
      );
    }

    return {
      matched,
      difference,
      databaseBalance: Number(account.balance),
      bankBalance,
    };
  }

  /**
   * Freeze escrow account (compliance or legal hold)
   */
  async freezeAccount(escrowAccountId: string, reason: string): Promise<EscrowAccount> {
    const updated = await this.prisma.escrowAccount.update({
      where: { id: escrowAccountId },
      data: {
        status: 'SUSPENDED',
      },
    });

    // emitEvent('escrow.frozen', {
    //   escrowAccountId,
    //   reason,
    // });

    return updated;
  }

  /**
   * Unfreeze escrow account
   */
  async unfreezeAccount(escrowAccountId: string): Promise<EscrowAccount> {
    const updated = await this.prisma.escrowAccount.update({
      where: { id: escrowAccountId },
      data: {
        status: 'ACTIVE',
      },
    });

    // emitEvent('escrow.unfrozen', {
    //   escrowAccountId,
    // });

    return updated;
  }
}
