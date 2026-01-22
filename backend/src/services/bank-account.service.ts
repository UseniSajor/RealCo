/**
 * Bank Account Management Service
 * Handles secure bank account storage with Plaid verification
 */

import { PrismaClient } from '@prisma/client';
import type { BankAccount, VerificationStatus, BankAccountType } from '@prisma/client';
import { encrypt, decrypt, hash, getLast4, maskAccountNumber, validateRoutingNumber, validateAccountNumber, generateMicroDepositAmounts } from './encryption.js';
import { getPlaidClient } from './plaid.js';
import { ValidationError } from './errors.js';
import { emit } from './events.js';

export interface AddBankAccountDTO {
  accountHolderName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: BankAccountType;
  isDefault?: boolean;
}

export interface VerifyMicroDepositsDTO {
  amount1: number; // in cents
  amount2: number; // in cents
}

export class BankAccountService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Add bank account (manual entry)
   * Encrypts sensitive data
   */
  async addBankAccount(
    userId: string,
    data: AddBankAccountDTO
  ): Promise<BankAccount> {
    // Validation
    if (!validateRoutingNumber(data.routingNumber)) {
      throw new ValidationError('Invalid routing number');
    }
    if (!validateAccountNumber(data.accountNumber)) {
      throw new ValidationError('Invalid account number (must be 4-17 digits)');
    }

    // Check for duplicates (using routing number hash + last 4)
    const routingHash = hash(data.routingNumber);
    const last4 = getLast4(data.accountNumber);
    
    const existing = await this.prisma.bankAccount.findFirst({
      where: {
        userId,
        routingNumberHash: routingHash,
        last4,
        deletedAt: null
      }
    });

    if (existing) {
      throw new ValidationError('Bank account already exists');
    }

    // Encrypt sensitive data
    const accountNumberEncrypted = encrypt(data.accountNumber);
    const routingNumberEncrypted = encrypt(data.routingNumber);

    // If this is the first account or marked as default, set as default
    const existingAccounts = await this.prisma.bankAccount.count({
      where: { userId, deletedAt: null }
    });
    const isDefault = data.isDefault || existingAccounts === 0;

    // If setting as default, unset other defaults
    if (isDefault) {
      await this.prisma.bankAccount.updateMany({
        where: { userId, isDefault: true, deletedAt: null },
        data: { isDefault: false }
      });
    }

    // Create bank account
    const bankAccount = await this.prisma.bankAccount.create({
      data: {
        userId,
        accountHolderName: data.accountHolderName,
        accountNumberEncrypted,
        routingNumberEncrypted,
        routingNumberHash: routingHash,
        last4,
        accountType: data.accountType,
        verificationStatus: 'PENDING',
        isDefault,
        verificationAttempts: 0
      }
    });

    // Emit event
    emit('bankAccount.added', {
      userId,
      bankAccountId: bankAccount.id,
      accountType: bankAccount.accountType
    });

    // Audit log
    await this.prisma.auditEvent.create({
      data: {
        action: 'bank_account.created',
        entityType: 'BankAccount',
        entityId: bankAccount.id,
        userId,
        metadata: {
          accountType: data.accountType,
          last4,
          isDefault
        }
      }
    });

    return bankAccount;
  }

  /**
   * Verify bank account with Plaid
   * Exchange public token for access token and verify instantly
   */
  async verifyWithPlaid(
    userId: string,
    publicToken: string
  ): Promise<BankAccount> {
    const plaidClient = getPlaidClient();

    // Exchange public token for access token
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken
    });
    const accessToken = tokenResponse.data.access_token;

    // Get account information
    const authResponse = await plaidClient.authGet({
      access_token: accessToken
    });

    const account = authResponse.data.accounts[0];
    const numbers = authResponse.data.numbers.ach[0];

    if (!numbers) {
      throw new ValidationError('Unable to retrieve account numbers from Plaid');
    }

    // Encrypt sensitive data
    const accountNumberEncrypted = encrypt(numbers.account);
    const routingNumberEncrypted = encrypt(numbers.routing);
    const accessTokenEncrypted = encrypt(accessToken);
    const routingHash = hash(numbers.routing);
    const last4 = getLast4(numbers.account);

    // Check for duplicates
    const existing = await this.prisma.bankAccount.findFirst({
      where: {
        userId,
        routingNumberHash: routingHash,
        last4,
        deletedAt: null
      }
    });

    if (existing) {
      // Update existing account with Plaid data
      const updated = await this.prisma.bankAccount.update({
        where: { id: existing.id },
        data: {
          plaidAccessToken: accessTokenEncrypted,
          plaidAccountId: account.account_id,
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date()
        }
      });

      emit('bankAccount.verified', {
        userId,
        bankAccountId: updated.id,
        method: 'plaid'
      });

      return updated;
    }

    // Determine if this should be default
    const existingCount = await this.prisma.bankAccount.count({
      where: { userId, deletedAt: null }
    });
    const isDefault = existingCount === 0;

    if (isDefault) {
      await this.prisma.bankAccount.updateMany({
        where: { userId, isDefault: true, deletedAt: null },
        data: { isDefault: false }
      });
    }

    // Create new verified account
    const bankAccount = await this.prisma.bankAccount.create({
      data: {
        userId,
        accountHolderName: account.name,
        accountNumberEncrypted,
        routingNumberEncrypted,
        routingNumberHash: routingHash,
        last4,
        accountType: account.subtype === 'savings' ? 'SAVINGS' : 'CHECKING',
        plaidAccessToken: accessTokenEncrypted,
        plaidAccountId: account.account_id,
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        isDefault,
        verificationAttempts: 0
      }
    });

    emit('bankAccount.verified', {
      userId,
      bankAccountId: bankAccount.id,
      method: 'plaid'
    });

    await this.prisma.auditEvent.create({
      data: {
        action: 'bank_account.verified_plaid',
        entityType: 'BankAccount',
        entityId: bankAccount.id,
        userId,
        metadata: {
          accountType: bankAccount.accountType,
          last4,
          plaidAccountId: account.account_id
        }
      }
    });

    return bankAccount;
  }

  /**
   * Initiate micro-deposit verification
   * Sends two small amounts to the account
   */
  async initiateMicroDeposits(accountId: string, userId: string): Promise<void> {
    const account = await this.prisma.bankAccount.findFirst({
      where: { id: accountId, userId, deletedAt: null }
    });

    if (!account) {
      throw new ValidationError('Bank account not found');
    }

    if (account.verificationStatus === 'VERIFIED') {
      throw new ValidationError('Account is already verified');
    }

    // Generate random micro-deposit amounts
    const [amount1, amount2] = generateMicroDepositAmounts();

    // In production, initiate actual ACH deposits via Stripe
    // For now, store the amounts encrypted
    const microDepositData = {
      amount1,
      amount2,
      initiatedAt: new Date().toISOString()
    };
    const microDepositEncrypted = encrypt(JSON.stringify(microDepositData));

    await this.prisma.bankAccount.update({
      where: { id: accountId },
      data: {
        verificationStatus: 'MICRO_DEPOSITS_PENDING',
        microDepositData: microDepositEncrypted,
        verificationAttempts: 0
      }
    });

    emit('bankAccount.microDepositsInitiated', {
      userId,
      bankAccountId: accountId,
      amounts: [amount1, amount2] // For development/testing only
    });

    await this.prisma.auditEvent.create({
      data: {
        action: 'bank_account.micro_deposits_initiated',
        entityType: 'BankAccount',
        entityId: accountId,
        userId,
        metadata: {
          last4: account.last4
        }
      }
    });
  }

  /**
   * Verify micro-deposit amounts
   * Allows 3 attempts before locking
   */
  async verifyMicroDeposits(
    accountId: string,
    userId: string,
    data: VerifyMicroDepositsDTO
  ): Promise<BankAccount> {
    const account = await this.prisma.bankAccount.findFirst({
      where: { id: accountId, userId, deletedAt: null }
    });

    if (!account) {
      throw new ValidationError('Bank account not found');
    }

    if (account.verificationStatus === 'VERIFIED') {
      throw new ValidationError('Account is already verified');
    }

    if (account.verificationStatus !== 'MICRO_DEPOSITS_PENDING') {
      throw new ValidationError('Micro-deposits not initiated for this account');
    }

    if (!account.microDepositData) {
      throw new ValidationError('Micro-deposit data not found');
    }

    // Check attempts
    if (account.verificationAttempts >= 3) {
      await this.prisma.bankAccount.update({
        where: { id: accountId },
        data: { verificationStatus: 'FAILED' }
      });
      throw new ValidationError('Maximum verification attempts exceeded. Please contact support.');
    }

    // Decrypt and verify amounts
    const microDepositData = JSON.parse(decrypt(account.microDepositData));
    const { amount1, amount2 } = microDepositData;

    const isValid = (
      (data.amount1 === amount1 && data.amount2 === amount2) ||
      (data.amount1 === amount2 && data.amount2 === amount1)
    );

    if (!isValid) {
      // Increment attempts
      const updated = await this.prisma.bankAccount.update({
        where: { id: accountId },
        data: {
          verificationAttempts: account.verificationAttempts + 1
        }
      });

      const attemptsRemaining = 3 - updated.verificationAttempts;
      
      emit('bankAccount.verificationFailed', {
        userId,
        bankAccountId: accountId,
        attemptsRemaining
      });

      throw new ValidationError(
        `Incorrect amounts. ${attemptsRemaining} attempt(s) remaining.`
      );
    }

    // Success! Mark as verified
    const verified = await this.prisma.bankAccount.update({
      where: { id: accountId },
      data: {
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
        microDepositData: null // Clear sensitive data
      }
    });

    emit('bankAccount.verified', {
      userId,
      bankAccountId: accountId,
      method: 'micro-deposits'
    });

    await this.prisma.auditEvent.create({
      data: {
        action: 'bank_account.verified_micro_deposits',
        entityType: 'BankAccount',
        entityId: accountId,
        userId,
        metadata: {
          last4: account.last4
        }
      }
    });

    return verified;
  }

  /**
   * Get all bank accounts for a user
   */
  async getBankAccounts(
    userId: string,
    includeDeleted: boolean = false
  ): Promise<BankAccount[]> {
    return this.prisma.bankAccount.findMany({
      where: {
        userId,
        ...(includeDeleted ? {} : { deletedAt: null })
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  /**
   * Get single bank account
   */
  async getBankAccount(accountId: string, userId: string): Promise<BankAccount> {
    const account = await this.prisma.bankAccount.findFirst({
      where: { id: accountId, userId, deletedAt: null }
    });

    if (!account) {
      throw new ValidationError('Bank account not found');
    }

    return account;
  }

  /**
   * Get decrypted account number (for payment processing only)
   * WARNING: Use with extreme caution and never log the result
   */
  async getDecryptedAccountNumber(accountId: string, userId: string): Promise<string> {
    const account = await this.getBankAccount(accountId, userId);
    return decrypt(account.accountNumberEncrypted);
  }

  /**
   * Get decrypted routing number (for payment processing only)
   */
  async getDecryptedRoutingNumber(accountId: string, userId: string): Promise<string> {
    const account = await this.getBankAccount(accountId, userId);
    return decrypt(account.routingNumberEncrypted);
  }

  /**
   * Set default bank account
   */
  async setDefaultAccount(accountId: string, userId: string): Promise<BankAccount> {
    const account = await this.getBankAccount(accountId, userId);

    if (account.verificationStatus !== 'VERIFIED') {
      throw new ValidationError('Can only set verified accounts as default');
    }

    // Unset other defaults
    await this.prisma.bankAccount.updateMany({
      where: { userId, isDefault: true, deletedAt: null },
      data: { isDefault: false }
    });

    // Set new default
    const updated = await this.prisma.bankAccount.update({
      where: { id: accountId },
      data: { isDefault: true }
    });

    emit('bankAccount.defaultChanged', {
      userId,
      bankAccountId: accountId
    });

    await this.prisma.auditEvent.create({
      data: {
        action: 'bank_account.set_default',
        entityType: 'BankAccount',
        entityId: accountId,
        userId,
        metadata: {
          last4: account.last4
        }
      }
    });

    return updated;
  }

  /**
   * Remove bank account (soft delete)
   */
  async removeBankAccount(accountId: string, userId: string): Promise<void> {
    const account = await this.getBankAccount(accountId, userId);

    // Check if account has pending transactions
    const pendingTransactions = await this.prisma.transaction.count({
      where: {
        bankAccountId: accountId,
        status: { in: ['INITIATED', 'PROCESSING'] }
      }
    });

    if (pendingTransactions > 0) {
      throw new ValidationError(
        'Cannot remove account with pending transactions'
      );
    }

    // Soft delete
    await this.prisma.bankAccount.update({
      where: { id: accountId },
      data: {
        deletedAt: new Date(),
        isDefault: false
      }
    });

    emit('bankAccount.removed', {
      userId,
      bankAccountId: accountId
    });

    await this.prisma.auditEvent.create({
      data: {
        action: 'bank_account.removed',
        entityType: 'BankAccount',
        entityId: accountId,
        userId,
        metadata: {
          last4: account.last4
        }
      }
    });
  }

  /**
   * Get account balance from Plaid (if available)
   */
  async getAccountBalance(accountId: string, userId: string): Promise<number | null> {
    const account = await this.getBankAccount(accountId, userId);

    if (!account.plaidAccessToken || !account.plaidAccountId) {
      return null;
    }

    try {
      const plaidClient = getPlaidClient();
      const accessToken = decrypt(account.plaidAccessToken);

      const response = await plaidClient.accountsBalanceGet({
        access_token: accessToken,
        options: {
          account_ids: [account.plaidAccountId]
        }
      });

      const plaidAccount = response.data.accounts[0];
      return plaidAccount.balances.current || 0;
    } catch (error) {
      console.error('Error fetching Plaid balance:', error);
      return null;
    }
  }
}
