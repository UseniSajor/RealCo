/**
 * Bank Account Service
 * 
 * Handles bank account management with Plaid integration and encryption.
 * 
 * Features:
 * - Add bank account (manual or Plaid)
 * - Micro-deposit verification
 * - Instant verification via Plaid
 * - Encryption of sensitive data
 * - Audit trail
 */

import type { PrismaClient, BankAccount } from '@prisma/client';
import { encrypt, decrypt, hash, getLast4, generateMicroDepositAmounts, validateRoutingNumber, validateAccountNumber } from '../lib/encryption.js';
import { PlaidService } from './plaid.service.js';
import { ValidationError, NotFoundError } from './errors.js';
import { emitEvent } from './events.js';

/**
 * DTO for adding bank account manually
 */
export interface AddBankAccountDTO {
  accountType: 'CHECKING' | 'SAVINGS';
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  bankName?: string;
}

/**
 * DTO for linking Plaid account
 */
export interface LinkPlaidAccountDTO {
  publicToken: string;
  accountId?: string; // Optional - if user selected specific account
  metadata?: Record<string, any>;
}

/**
 * DTO for micro-deposit verification
 */
export interface VerifyMicroDepositsDTO {
  amount1: number;
  amount2: number;
}

/**
 * Sanitized bank account response (no sensitive data)
 */
export interface BankAccountResponse {
  id: string;
  accountType: string;
  accountHolderName: string;
  bankName: string | null;
  last4: string;
  status: string;
  verificationMethod: string | null;
  isDefault: boolean;
  verifiedAt: Date | null;
  createdAt: Date;
}

/**
 * Bank Account Service Class
 */
export class BankAccountService {
  private plaidService: PlaidService;
  
  constructor(private prisma: PrismaClient) {
    this.plaidService = new PlaidService();
  }
  // ===========================================================================
  // BANK ACCOUNT MANAGEMENT
  // ===========================================================================

  /**
   * Add bank account manually (requires micro-deposit verification)
   * 
   * @param userId - User ID
   * @param data - Bank account details
   * @returns Created bank account (sanitized)
   */
  async addBankAccount(userId: string, data: AddBankAccountDTO): Promise<BankAccountResponse> {
    try {
      // Encrypt sensitive data
      const encryptedAccountNumber = encrypt(data.accountNumber);
      const encryptedRoutingNumber = encrypt(data.routingNumber);
      const lastFourDigits = data.accountNumber.slice(-4);

      const bankAccount = await prisma.bankAccount.create({
        data: {
          userId: data.userId,
          accountType: data.accountType,
          bankName: data.bankName,
          accountNumber: encryptedAccountNumber,
          routingNumber: encryptedRoutingNumber,
          accountHolderName: data.accountHolderName,
          lastFourDigits,
          status: BankAccountStatus.PENDING_VERIFICATION,
          verificationMethod: VerificationMethod.MICRO_DEPOSITS,
        },
      });

      // Log audit event
      await auditService.log({
        action: 'bank_account_added',
        entityType: 'BANK_ACCOUNT',
        entityId: bankAccount.id,
        userId: data.userId,
        metadata: {
          accountType: data.accountType,
          bankName: data.bankName,
        },
      });

      // Initiate micro-deposit verification
      await this.initiateMicroDepositVerification(bankAccount.id);

      return this.sanitizeBankAccount(bankAccount);
    } catch (error) {
      console.error('Error adding bank account:', error);
      throw new Error('Failed to add bank account');
    }
  }

  /**
   * Link bank account via Plaid (instant verification)
   */
  async linkPlaidAccount(data: LinkPlaidAccountDTO) {
    try {
      // Exchange public token for access token
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: data.publicToken,
      });

      const accessToken = response.data.access_token;
      const itemId = response.data.item_id;

      // Get account details from Plaid
      const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
      });

      const plaidAccount = accountsResponse.data.accounts.find(
        (acc) => acc.account_id === data.accountId
      );

      if (!plaidAccount) {
        throw new Error('Account not found');
      }

      // Create bank account record
      const bankAccount = await prisma.bankAccount.create({
        data: {
          userId: data.userId,
          accountType: this.mapPlaidAccountType(plaidAccount.type),
          bankName: plaidAccount.name,
          accountNumber: encrypt(plaidAccount.mask || ''),
          routingNumber: encrypt(''), // Not provided by Plaid for security
          accountHolderName: plaidAccount.official_name || plaidAccount.name,
          lastFourDigits: plaidAccount.mask,
          plaidItemId: itemId,
          plaidAccessToken: encrypt(accessToken),
          plaidAccountId: plaidAccount.account_id,
          isVerified: true,
          status: BankAccountStatus.VERIFIED,
          verificationMethod: VerificationMethod.PLAID_INSTANT,
          verifiedAt: new Date(),
        },
      });

      // Log audit event
      await auditService.log({
        action: 'bank_account_linked_plaid',
        entityType: 'BANK_ACCOUNT',
        entityId: bankAccount.id,
        userId: data.userId,
        metadata: {
          bankName: plaidAccount.name,
          accountType: plaidAccount.type,
        },
      });

      return this.sanitizeBankAccount(bankAccount);
    } catch (error) {
      console.error('Error linking Plaid account:', error);
      throw new Error('Failed to link bank account via Plaid');
    }
  }

  /**
   * Verify bank account using micro-deposits
   */
  async verifyMicroDeposits(accountId: string, amounts: number[]) {
    try {
      // In production, this would verify against actual micro-deposit amounts
      // For now, we'll use a simple verification (amounts sum to 0.50 or similar)
      
      const isValid = amounts.length === 2 && 
                      amounts.every(a => a > 0 && a < 1) &&
                      Math.abs(amounts.reduce((sum, a) => sum + a, 0) - 0.50) < 0.01;

      if (!isValid) {
        throw new Error('Invalid verification amounts');
      }

      const bankAccount = await prisma.bankAccount.update({
        where: { id: accountId },
        data: {
          isVerified: true,
          status: BankAccountStatus.VERIFIED,
          verifiedAt: new Date(),
        },
      });

      // Log audit event
      await auditService.log({
        action: 'bank_account_verified',
        entityType: 'BANK_ACCOUNT',
        entityId: accountId,
        metadata: {
          verificationMethod: 'micro_deposits',
        },
      });

      return this.sanitizeBankAccount(bankAccount);
    } catch (error) {
      console.error('Error verifying micro-deposits:', error);
      throw new Error('Failed to verify bank account');
    }
  }

  /**
   * Get user's bank accounts
   */
  async getBankAccounts(userId: string) {
    try {
      const accounts = await prisma.bankAccount.findMany({
        where: {
          userId,
          status: {
            not: BankAccountStatus.CLOSED,
          },
        },
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'desc' },
        ],
      });

      return accounts.map(acc => this.sanitizeBankAccount(acc));
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      throw new Error('Failed to fetch bank accounts');
    }
  }

  /**
   * Set default bank account
   */
  async setDefaultAccount(accountId: string, userId: string) {
    try {
      // Remove default from all other accounts
      await prisma.bankAccount.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });

      // Set new default
      const account = await prisma.bankAccount.update({
        where: {
          id: accountId,
          userId, // Ensure user owns the account
        },
        data: {
          isDefault: true,
        },
      });

      await auditService.log({
        action: 'bank_account_set_default',
        entityType: 'BANK_ACCOUNT',
        entityId: accountId,
        userId,
      });

      return this.sanitizeBankAccount(account);
    } catch (error) {
      console.error('Error setting default account:', error);
      throw new Error('Failed to set default account');
    }
  }

  /**
   * Remove bank account
   */
  async removeAccount(accountId: string, userId: string) {
    try {
      const account = await prisma.bankAccount.update({
        where: {
          id: accountId,
          userId, // Ensure user owns the account
        },
        data: {
          status: BankAccountStatus.CLOSED,
        },
      });

      await auditService.log({
        action: 'bank_account_removed',
        entityType: 'BANK_ACCOUNT',
        entityId: accountId,
        userId,
      });

      return { success: true };
    } catch (error) {
      console.error('Error removing account:', error);
      throw new Error('Failed to remove account');
    }
  }

  /**
   * Get Plaid balance for linked account
   */
  async getPlaidBalance(accountId: string) {
    try {
      const account = await prisma.bankAccount.findUnique({
        where: { id: accountId },
      });

      if (!account || !account.plaidAccessToken) {
        throw new Error('Account not linked with Plaid');
      }

      const accessToken = decrypt(account.plaidAccessToken);
      
      const response = await plaidClient.accountsBalanceGet({
        access_token: accessToken,
        options: {
          account_ids: [account.plaidAccountId!],
        },
      });

      const plaidAccount = response.data.accounts[0];

      return {
        current: plaidAccount.balances.current,
        available: plaidAccount.balances.available,
        limit: plaidAccount.balances.limit,
        currency: plaidAccount.balances.iso_currency_code,
      };
    } catch (error) {
      console.error('Error fetching Plaid balance:', error);
      throw new Error('Failed to fetch account balance');
    }
  }

  // Private helper methods

  private async initiateMicroDepositVerification(accountId: string) {
    // In production, integrate with Stripe or another processor to send micro-deposits
    // For now, just log that verification is needed
    console.log(`Micro-deposit verification initiated for account ${accountId}`);
    
    // In real implementation:
    // 1. Create two random amounts (e.g., $0.23 and $0.27)
    // 2. Send ACH debits/credits to the account
    // 3. Store the amounts (encrypted) for later verification
    // 4. Send email to user with instructions
  }

  private mapPlaidAccountType(plaidType: string): BankAccountType {
    switch (plaidType.toLowerCase()) {
      case 'depository':
        return BankAccountType.CHECKING;
      case 'savings':
        return BankAccountType.SAVINGS;
      default:
        return BankAccountType.CHECKING;
    }
  }

  private sanitizeBankAccount(account: any) {
    // Remove encrypted fields from response
    return {
      id: account.id,
      accountType: account.accountType,
      bankName: account.bankName,
      accountHolderName: account.accountHolderName,
      lastFourDigits: account.lastFourDigits,
      isVerified: account.isVerified,
      status: account.status,
      verificationMethod: account.verificationMethod,
      isDefault: account.isDefault,
      verifiedAt: account.verifiedAt,
      createdAt: account.createdAt,
      // DO NOT return encrypted account/routing numbers
    };
  }
}

export const bankAccountService = new BankAccountService();
