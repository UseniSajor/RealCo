/**
 * Escrow Account & Distribution Service
 * Manages segregated escrow accounts with waterfall distribution calculations
 */

import { PrismaClient } from '@prisma/client';
import type { EscrowAccount, EscrowLedgerEntry, Distribution, Investment } from '@prisma/client';
import { ValidationError } from './errors.js';
import { emit } from './events.js';
import { TransactionService } from './transaction.service.js';

export interface DistributionTier {
  tier: number;
  description: string;
  totalAmount: number;
  allocations: {
    investmentId: string;
    investorId: string;
    amount: number;
    type: 'RETURN_OF_CAPITAL' | 'PREFERRED_RETURN' | 'SPONSOR_CATCHUP' | 'PROFIT_SPLIT';
  }[];
}

export interface WaterfallConfig {
  preferredReturnRate: number; // e.g., 0.08 for 8%
  sponsorCatchupRate: number; // e.g., 0.08 to match investors
  profitSplitInvestor: number; // e.g., 0.70 for 70%
  profitSplitSponsor: number; // e.g., 0.30 for 30%
}

const DEFAULT_WATERFALL_CONFIG: WaterfallConfig = {
  preferredReturnRate: 0.08, // 8% annually
  sponsorCatchupRate: 0.08,
  profitSplitInvestor: 0.70, // 70/30 split
  profitSplitSponsor: 0.30
};

export class EscrowAccountService {
  private transactionService: TransactionService;

  constructor(private prisma: PrismaClient) {
    this.transactionService = new TransactionService(prisma);
  }

  /**
   * Create escrow account for an offering
   */
  async createEscrowAccount(offeringId: string): Promise<EscrowAccount> {
    // Check if offering exists
    const offering = await this.prisma.offering.findUnique({
      where: { id: offeringId }
    });

    if (!offering) {
      throw new ValidationError('Offering not found');
    }

    // Check if escrow account already exists
    const existing = await this.prisma.escrowAccount.findUnique({
      where: { offeringId }
    });

    if (existing) {
      return existing;
    }

    // Create escrow account
    const escrowAccount = await this.prisma.escrowAccount.create({
      data: {
        offeringId,
        currentBalance: 0,
        availableBalance: 0,
        pendingBalance: 0,
        heldBalance: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalDistributions: 0
      }
    });

    emit('escrowAccount.created', {
      escrowAccountId: escrowAccount.id,
      offeringId
    });

    await this.prisma.auditEvent.create({
      data: {
        action: 'escrow_account.created',
        entityType: 'EscrowAccount',
        entityId: escrowAccount.id,
        metadata: {
          offeringId
        }
      }
    });

    return escrowAccount;
  }

  /**
   * Deposit funds into escrow from investment transaction
   */
  async depositFunds(
    accountId: string,
    transactionId: string,
    amount: number
  ): Promise<EscrowAccount> {
    const account = await this.prisma.escrowAccount.findUnique({
      where: { id: accountId }
    });

    if (!account) {
      throw new ValidationError('Escrow account not found');
    }

    if (amount <= 0) {
      throw new ValidationError('Deposit amount must be positive');
    }

    return await this.prisma.$transaction(async (tx) => {
      // Get balance before
      const balanceBefore = account.currentBalance;

      // Update escrow account
      const updated = await tx.escrowAccount.update({
        where: { id: accountId },
        data: {
          currentBalance: { increment: amount },
          availableBalance: { increment: amount },
          totalDeposits: { increment: amount }
        }
      });

      // Create ledger entry
      await tx.escrowLedgerEntry.create({
        data: {
          escrowAccountId: accountId,
          transactionId,
          type: 'CREDIT',
          amount,
          balanceBefore,
          balanceAfter: updated.currentBalance,
          description: 'Investment deposit'
        }
      });

      emit('escrowAccount.deposited', {
        escrowAccountId: accountId,
        transactionId,
        amount,
        newBalance: updated.currentBalance
      });

      await tx.auditEvent.create({
        data: {
          action: 'escrow_account.deposit',
          entityType: 'EscrowAccount',
          entityId: accountId,
          metadata: {
            transactionId,
            amount,
            balanceBefore,
            balanceAfter: updated.currentBalance
          }
        }
      });

      return updated;
    });
  }

  /**
   * Calculate waterfall distribution for an offering
   */
  async calculateDistribution(
    accountId: string,
    distributionAmount: number,
    config: Partial<WaterfallConfig> = {}
  ): Promise<DistributionTier[]> {
    const account = await this.prisma.escrowAccount.findUnique({
      where: { id: accountId },
      include: {
        offering: {
          include: {
            investments: {
              where: { status: 'CONFIRMED' },
              include: {
                user: { select: { id: true, firstName: true, lastName: true } },
                distributions: true
              }
            }
          }
        }
      }
    });

    if (!account) {
      throw new ValidationError('Escrow account not found');
    }

    if (distributionAmount > account.availableBalance) {
      throw new ValidationError('Insufficient available balance for distribution');
    }

    const waterfallConfig = { ...DEFAULT_WATERFALL_CONFIG, ...config };
    const investments = account.offering.investments;

    if (investments.length === 0) {
      throw new ValidationError('No investments found for this offering');
    }

    // Calculate distribution tiers
    let remaining = distributionAmount;
    const tiers: DistributionTier[] = [];

    // Tier 1: Return of Capital
    const tier1 = this.calculateReturnOfCapital(investments, remaining);
    if (tier1.totalAmount > 0) {
      tiers.push(tier1);
      remaining -= tier1.totalAmount;
    }

    // Tier 2: Preferred Return
    if (remaining > 0) {
      const tier2 = this.calculatePreferredReturn(
        investments,
        remaining,
        waterfallConfig.preferredReturnRate
      );
      if (tier2.totalAmount > 0) {
        tiers.push(tier2);
        remaining -= tier2.totalAmount;
      }
    }

    // Tier 3: Sponsor Catch-up
    if (remaining > 0) {
      const tier3 = this.calculateSponsorCatchup(
        investments,
        remaining,
        waterfallConfig.sponsorCatchupRate
      );
      if (tier3.totalAmount > 0) {
        tiers.push(tier3);
        remaining -= tier3.totalAmount;
      }
    }

    // Tier 4: Profit Split
    if (remaining > 0) {
      const tier4 = this.calculateProfitSplit(
        investments,
        remaining,
        waterfallConfig.profitSplitInvestor,
        waterfallConfig.profitSplitSponsor
      );
      if (tier4.totalAmount > 0) {
        tiers.push(tier4);
      }
    }

    return tiers;
  }

  /**
   * Execute distribution to investors
   */
  async executeDistribution(
    accountId: string,
    distributionAmount: number,
    description: string,
    config: Partial<WaterfallConfig> = {}
  ): Promise<Distribution> {
    // Calculate distribution tiers
    const tiers = await this.calculateDistribution(accountId, distributionAmount, config);

    return await this.prisma.$transaction(async (tx) => {
      const account = await tx.escrowAccount.findUnique({
        where: { id: accountId }
      });

      if (!account) {
        throw new ValidationError('Escrow account not found');
      }

      // Create distribution record
      const distribution = await tx.distribution.create({
        data: {
          escrowAccountId: accountId,
          offeringId: account.offeringId,
          totalAmount: distributionAmount,
          description,
          tiers: tiers as any,
          status: 'PENDING'
        }
      });

      // Update escrow account
      const balanceBefore = account.currentBalance;
      const updatedAccount = await tx.escrowAccount.update({
        where: { id: accountId },
        data: {
          availableBalance: { decrement: distributionAmount },
          pendingBalance: { increment: distributionAmount },
          totalDistributions: { increment: distributionAmount }
        }
      });

      // Create ledger entry for the distribution
      await tx.escrowLedgerEntry.create({
        data: {
          escrowAccountId: accountId,
          distributionId: distribution.id,
          type: 'DEBIT',
          amount: distributionAmount,
          balanceBefore,
          balanceAfter: updatedAccount.currentBalance - distributionAmount,
          description: `Distribution: ${description}`
        }
      });

      // Create payment transactions for each allocation
      for (const tier of tiers) {
        for (const allocation of tier.allocations) {
          // Create transaction for investor payment
          const transaction = await this.transactionService.initiateTransaction({
            userId: allocation.investorId,
            organizationId: account.offeringId, // Using offering as org context
            type: 'DISTRIBUTION_PAYOUT',
            method: 'ACH',
            amount: allocation.amount,
            description: `${tier.description} - ${description}`,
            metadata: {
              distributionId: distribution.id,
              investmentId: allocation.investmentId,
              tier: tier.tier,
              type: allocation.type
            }
          });

          // Update investment with distribution record
          await tx.investment.update({
            where: { id: allocation.investmentId },
            data: {
              totalDistributions: { increment: allocation.amount }
            }
          });
        }
      }

      // Update distribution status
      await tx.distribution.update({
        where: { id: distribution.id },
        data: {
          status: 'PROCESSING',
          processedAt: new Date()
        }
      });

      emit('distribution.executed', {
        distributionId: distribution.id,
        escrowAccountId: accountId,
        totalAmount: distributionAmount,
        tierCount: tiers.length
      });

      await tx.auditEvent.create({
        data: {
          action: 'distribution.executed',
          entityType: 'Distribution',
          entityId: distribution.id,
          metadata: {
            escrowAccountId: accountId,
            totalAmount: distributionAmount,
            description,
            tiers: tiers.length
          }
        }
      });

      return distribution;
    });
  }

  /**
   * Get escrow account balance
   */
  async getAccountBalance(accountId: string): Promise<{
    currentBalance: number;
    availableBalance: number;
    pendingBalance: number;
    heldBalance: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalDistributions: number;
  }> {
    const account = await this.prisma.escrowAccount.findUnique({
      where: { id: accountId }
    });

    if (!account) {
      throw new ValidationError('Escrow account not found');
    }

    return {
      currentBalance: account.currentBalance,
      availableBalance: account.availableBalance,
      pendingBalance: account.pendingBalance,
      heldBalance: account.heldBalance,
      totalDeposits: account.totalDeposits,
      totalWithdrawals: account.totalWithdrawals,
      totalDistributions: account.totalDistributions
    };
  }

  /**
   * Get escrow account activity (ledger entries)
   */
  async getAccountActivity(
    accountId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<{
    entries: EscrowLedgerEntry[];
    total: number;
  }> {
    const [entries, total] = await Promise.all([
      this.prisma.escrowLedgerEntry.findMany({
        where: { escrowAccountId: accountId },
        include: {
          transaction: { select: { id: true, type: true, amount: true, userId: true } },
          distribution: { select: { id: true, description: true, totalAmount: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      this.prisma.escrowLedgerEntry.count({
        where: { escrowAccountId: accountId }
      })
    ]);

    return { entries, total };
  }

  /**
   * Reconcile escrow account with ledger
   */
  async reconcileAccount(accountId: string): Promise<{
    isBalanced: boolean;
    currentBalance: number;
    calculatedBalance: number;
    discrepancy: number;
  }> {
    const account = await this.prisma.escrowAccount.findUnique({
      where: { id: accountId }
    });

    if (!account) {
      throw new ValidationError('Escrow account not found');
    }

    // Calculate balance from ledger
    const ledgerEntries = await this.prisma.escrowLedgerEntry.findMany({
      where: { escrowAccountId: accountId },
      select: { type: true, amount: true }
    });

    let calculatedBalance = 0;
    for (const entry of ledgerEntries) {
      if (entry.type === 'CREDIT') {
        calculatedBalance += entry.amount;
      } else {
        calculatedBalance -= entry.amount;
      }
    }

    const discrepancy = account.currentBalance - calculatedBalance;
    const isBalanced = Math.abs(discrepancy) < 1; // Allow 1 cent tolerance

    if (!isBalanced) {
      emit('escrowAccount.reconciliationFailed', {
        escrowAccountId: accountId,
        currentBalance: account.currentBalance,
        calculatedBalance,
        discrepancy
      });
    }

    await this.prisma.auditEvent.create({
      data: {
        action: 'escrow_account.reconciled',
        entityType: 'EscrowAccount',
        entityId: accountId,
        metadata: {
          isBalanced,
          currentBalance: account.currentBalance,
          calculatedBalance,
          discrepancy
        }
      }
    });

    return {
      isBalanced,
      currentBalance: account.currentBalance,
      calculatedBalance,
      discrepancy
    };
  }

  // ========== PRIVATE WATERFALL CALCULATION METHODS ==========

  /**
   * Tier 1: Return of Capital
   * Returns investor principal first
   */
  private calculateReturnOfCapital(
    investments: any[],
    availableAmount: number
  ): DistributionTier {
    const allocations: DistributionTier['allocations'] = [];
    let totalAllocated = 0;

    for (const investment of investments) {
      // Calculate remaining capital to return
      const capitalReturned = investment.distributions
        .filter((d: any) => d.type === 'RETURN_OF_CAPITAL')
        .reduce((sum: number, d: any) => sum + d.amount, 0);

      const remainingCapital = investment.amount - capitalReturned;

      if (remainingCapital > 0 && totalAllocated < availableAmount) {
        const allocationAmount = Math.min(
          remainingCapital,
          availableAmount - totalAllocated
        );

        allocations.push({
          investmentId: investment.id,
          investorId: investment.userId,
          amount: allocationAmount,
          type: 'RETURN_OF_CAPITAL'
        });

        totalAllocated += allocationAmount;
      }
    }

    return {
      tier: 1,
      description: 'Return of Capital',
      totalAmount: totalAllocated,
      allocations
    };
  }

  /**
   * Tier 2: Preferred Return
   * Pays cumulative preferred return (e.g., 8% annually)
   */
  private calculatePreferredReturn(
    investments: any[],
    availableAmount: number,
    preferredRate: number
  ): DistributionTier {
    const allocations: DistributionTier['allocations'] = [];
    let totalAllocated = 0;

    for (const investment of investments) {
      // Calculate years since investment
      const investmentDate = new Date(investment.createdAt);
      const now = new Date();
      const yearsHeld = (now.getTime() - investmentDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

      // Calculate total preferred return owed
      const totalPreferredOwed = Math.floor(investment.amount * preferredRate * yearsHeld);

      // Calculate preferred return already paid
      const preferredPaid = investment.distributions
        .filter((d: any) => d.type === 'PREFERRED_RETURN')
        .reduce((sum: number, d: any) => sum + d.amount, 0);

      const preferredDue = totalPreferredOwed - preferredPaid;

      if (preferredDue > 0 && totalAllocated < availableAmount) {
        const allocationAmount = Math.min(
          preferredDue,
          availableAmount - totalAllocated
        );

        allocations.push({
          investmentId: investment.id,
          investorId: investment.userId,
          amount: allocationAmount,
          type: 'PREFERRED_RETURN'
        });

        totalAllocated += allocationAmount;
      }
    }

    return {
      tier: 2,
      description: 'Preferred Return',
      totalAmount: totalAllocated,
      allocations
    };
  }

  /**
   * Tier 3: Sponsor Catch-up
   * Sponsor receives returns until they match investor returns
   */
  private calculateSponsorCatchup(
    investments: any[],
    availableAmount: number,
    catchupRate: number
  ): DistributionTier {
    // Find sponsor investment (usually role = 'SPONSOR' or specific flag)
    const sponsorInvestment = investments.find((inv: any) => inv.role === 'SPONSOR');

    if (!sponsorInvestment) {
      return {
        tier: 3,
        description: 'Sponsor Catch-up',
        totalAmount: 0,
        allocations: []
      };
    }

    // Calculate total investor returns
    const totalInvestorReturns = investments
      .filter((inv: any) => inv.role !== 'SPONSOR')
      .reduce((sum: number, inv: any) => {
        const returns = inv.distributions
          .filter((d: any) => d.type === 'PREFERRED_RETURN')
          .reduce((s: number, d: any) => s + d.amount, 0);
        return sum + returns;
      }, 0);

    // Calculate sponsor returns to date
    const sponsorReturns = sponsorInvestment.distributions
      .filter((d: any) => d.type === 'SPONSOR_CATCHUP')
      .reduce((sum: number, d: any) => sum + d.amount, 0);

    const catchupNeeded = Math.max(0, totalInvestorReturns - sponsorReturns);
    const allocationAmount = Math.min(catchupNeeded, availableAmount);

    if (allocationAmount > 0) {
      return {
        tier: 3,
        description: 'Sponsor Catch-up',
        totalAmount: allocationAmount,
        allocations: [{
          investmentId: sponsorInvestment.id,
          investorId: sponsorInvestment.userId,
          amount: allocationAmount,
          type: 'SPONSOR_CATCHUP'
        }]
      };
    }

    return {
      tier: 3,
      description: 'Sponsor Catch-up',
      totalAmount: 0,
      allocations: []
    };
  }

  /**
   * Tier 4: Profit Split
   * Remaining profits split between investors and sponsor (e.g., 70/30)
   */
  private calculateProfitSplit(
    investments: any[],
    availableAmount: number,
    investorSplit: number,
    sponsorSplit: number
  ): DistributionTier {
    const allocations: DistributionTier['allocations'] = [];

    // Calculate investor portion (70%)
    const investorPortion = Math.floor(availableAmount * investorSplit);
    const sponsorPortion = availableAmount - investorPortion;

    // Split investor portion pro-rata by investment amount
    const nonSponsorInvestments = investments.filter((inv: any) => inv.role !== 'SPONSOR');
    const totalInvestorCapital = nonSponsorInvestments.reduce(
      (sum: number, inv: any) => sum + inv.amount,
      0
    );

    for (const investment of nonSponsorInvestments) {
      const proRataShare = investment.amount / totalInvestorCapital;
      const allocationAmount = Math.floor(investorPortion * proRataShare);

      if (allocationAmount > 0) {
        allocations.push({
          investmentId: investment.id,
          investorId: investment.userId,
          amount: allocationAmount,
          type: 'PROFIT_SPLIT'
        });
      }
    }

    // Allocate sponsor portion
    const sponsorInvestment = investments.find((inv: any) => inv.role === 'SPONSOR');
    if (sponsorInvestment && sponsorPortion > 0) {
      allocations.push({
        investmentId: sponsorInvestment.id,
        investorId: sponsorInvestment.userId,
        amount: sponsorPortion,
        type: 'PROFIT_SPLIT'
      });
    }

    return {
      tier: 4,
      description: 'Profit Split',
      totalAmount: availableAmount,
      allocations
    };
  }
}
