/**
 * Plaid Service
 * 
 * Handles Plaid API integration for bank account verification.
 * 
 * Features:
 * - Link token creation for Plaid Link UI
 * - Public token exchange for access token
 * - Account information retrieval
 * - Balance checking
 * - Transaction history
 * - Account verification
 */

import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
  type LinkTokenCreateRequest,
  type ItemPublicTokenExchangeRequest,
} from 'plaid';
import { PlaidError as PlaidAPIError } from './errors.js';
import { encrypt, decrypt, hash, getLast4 } from '../lib/encryption.js';

/**
 * Plaid service configuration
 */
const PLAID_CONFIG = {
  clientId: process.env.PLAID_CLIENT_ID!,
  secret: process.env.PLAID_SECRET!,
  env: (process.env.PLAID_ENV || 'sandbox') as 'sandbox' | 'development' | 'production',
};

/**
 * Get Plaid environment URL
 */
function getPlaidEnvironment(): string {
  const envMap: Record<string, string | undefined> = {
    sandbox: PlaidEnvironments.sandbox,
    development: PlaidEnvironments.development,
    production: PlaidEnvironments.production,
  };
  
  return (envMap[PLAID_CONFIG.env] as string) || (PlaidEnvironments.sandbox as string);
}

/**
 * Initialize Plaid client
 */
const configuration = new Configuration({
  basePath: getPlaidEnvironment(),
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CONFIG.clientId,
      'PLAID-SECRET': PLAID_CONFIG.secret,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

/**
 * Interface for extracted bank account data
 */
export interface PlaidBankAccountData {
  accountId: string;
  accountType: 'checking' | 'savings';
  accountHolderName: string;
  last4: string;
  accountNumber: string; // Full number (should be encrypted before storage)
  routingNumber: string; // Full routing number (should be hashed before storage)
  bankName: string;
  plaidAccessToken: string; // Should be encrypted before storage
  plaidItemId: string;
  verificationStatus: string;
}

/**
 * Plaid Service Class
 * Encapsulates all Plaid API operations
 */
export class PlaidService {
  /**
   * Create a Link token for Plaid Link initialization
   * 
   * @param userId - User ID for webhook notifications
   * @param products - Plaid products to enable (default: auth)
   * @returns Link token for client-side Plaid Link
   */
  async createLinkToken(
    userId: string,
    products: Products[] = [Products.Auth, Products.Transactions]
  ): Promise<string> {
    try {
      const request: LinkTokenCreateRequest = {
        user: {
          client_user_id: userId,
        },
        client_name: 'RealCo Platform',
        products,
        country_codes: [CountryCode.Us],
        language: 'en',
        webhook: process.env.WEBHOOK_BASE_URL
          ? `${process.env.WEBHOOK_BASE_URL}/api/v1/webhooks/plaid`
          : undefined,
        account_filters: {
          depository: {
            // @ts-ignore - Plaid API version mismatch
            account_subtypes: ['checking', 'savings'],
          },
        },
      };
      
      const response = await plaidClient.linkTokenCreate(request);
      
      return response.data.link_token;
    } catch (error: any) {
      throw new PlaidAPIError(
        `Failed to create Link token: ${error.response?.data?.error_message || error.message}`,
        error
      );
    }
  }

  /**
   * Exchange public token for access token
   * This happens after user completes Plaid Link flow
   * 
   * @param publicToken - Public token from Plaid Link
   * @returns Access token and item ID (encrypted access token returned)
   */
  async exchangePublicToken(publicToken: string): Promise<{
    accessToken: string;
    accessTokenEncrypted: string;
    itemId: string;
  }> {
    try {
      const request: ItemPublicTokenExchangeRequest = {
        public_token: publicToken,
      };
      
      const response = await plaidClient.itemPublicTokenExchange(request);
      
      const accessToken = response.data.access_token;
      const itemId = response.data.item_id;
      
      // Encrypt access token before returning
      const accessTokenEncrypted = encrypt(accessToken);
      
      return {
        accessToken, // Raw token (for immediate use, don't store)
        accessTokenEncrypted, // Encrypted token (store this in database)
        itemId,
      };
    } catch (error: any) {
      throw new PlaidAPIError(
        `Failed to exchange public token: ${error.response?.data?.error_message || error.message}`,
        error
      );
    }
  }

  /**
   * Get account information from Plaid
   * 
   * @param accessTokenEncrypted - Encrypted Plaid access token from database
   * @returns Array of bank account information
   */
  async getAccounts(accessTokenEncrypted: string): Promise<PlaidBankAccountData[]> {
    try {
      // Decrypt access token
      const accessToken = decrypt(accessTokenEncrypted);
      
      // Get accounts
      const authResponse = await plaidClient.authGet({
        access_token: accessToken,
      });
      
      const accounts = authResponse.data.accounts;
      const numbers = authResponse.data.numbers.ach || [];
      const item = authResponse.data.item;
      
      // Map to our format
      const bankAccounts: PlaidBankAccountData[] = accounts.map((account) => {
        const numberInfo = numbers.find((n) => n.account_id === account.account_id);
        
        return {
          accountId: account.account_id,
          accountType: account.subtype === 'savings' ? 'savings' : 'checking',
          accountHolderName: account.name,
          last4: account.mask || '0000',
          accountNumber: numberInfo?.account || '',
          routingNumber: numberInfo?.routing || '',
          bankName: account.official_name || account.name,
          plaidAccessToken: accessToken, // Raw token (encrypt before storing)
          plaidItemId: item.item_id,
          verificationStatus: account.verification_status || 'unverified',
        };
      });
      
      return bankAccounts;
    } catch (error: any) {
      throw new PlaidAPIError(
        `Failed to get accounts: ${error.response?.data?.error_message || error.message}`,
        error
      );
    }
  }

  /**
   * Get account balance
   * 
   * @param accessTokenEncrypted - Encrypted Plaid access token
   * @param accountId - Plaid account ID (optional, returns all if not provided)
   * @returns Balance information
   */
  async getBalance(accessTokenEncrypted: string, accountId?: string): Promise<any> {
    try {
      const accessToken = decrypt(accessTokenEncrypted);
      
      const response = await plaidClient.accountsBalanceGet({
        access_token: accessToken,
        options: accountId ? { account_ids: [accountId] } : undefined,
      });
      
      return response.data.accounts.map((account) => ({
        accountId: account.account_id,
        availableBalance: account.balances.available,
        currentBalance: account.balances.current,
        limit: account.balances.limit,
        currency: account.balances.iso_currency_code || 'USD',
      }));
    } catch (error: any) {
      throw new PlaidAPIError(
        `Failed to get balance: ${error.response?.data?.error_message || error.message}`,
        error
      );
    }
  }

  /**
   * Verify account ownership (processor token for Stripe)
   * Creates a processor token that can be used with Stripe
   * 
   * @param accessTokenEncrypted - Encrypted Plaid access token
   * @param accountId - Plaid account ID
   * @returns Stripe bank account token
   */
  async createProcessorToken(
    accessTokenEncrypted: string,
    accountId: string
  ): Promise<string> {
    try {
      const accessToken = decrypt(accessTokenEncrypted);
      
      const response = await plaidClient.processorStripeBankAccountTokenCreate({
        access_token: accessToken,
        account_id: accountId,
      });
      
      return response.data.stripe_bank_account_token;
    } catch (error: any) {
      throw new PlaidAPIError(
        `Failed to create processor token: ${error.response?.data?.error_message || error.message}`,
        error
      );
    }
  }

  /**
   * Remove Plaid item (revoke access)
   * Called when user removes bank account
   * 
   * @param accessTokenEncrypted - Encrypted Plaid access token
   */
  async removeItem(accessTokenEncrypted: string): Promise<void> {
    try {
      const accessToken = decrypt(accessTokenEncrypted);
      
      await plaidClient.itemRemove({
        access_token: accessToken,
      });
    } catch (error: any) {
      // Don't throw error if item already removed
      if (error.response?.data?.error_code !== 'ITEM_NOT_FOUND') {
        throw new PlaidAPIError(
          `Failed to remove item: ${error.response?.data?.error_message || error.message}`,
          error
        );
      }
    }
  }

  /**
   * Get transactions (for transaction history)
   * 
   * @param accessTokenEncrypted - Encrypted Plaid access token
   * @param startDate - Start date for transaction history
   * @param endDate - End date for transaction history
   * @returns Transaction list
   */
  async getTransactions(
    accessTokenEncrypted: string,
    startDate: string,
    endDate: string
  ): Promise<any> {
    try {
      const accessToken = decrypt(accessTokenEncrypted);
      
      const response = await plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
      });
      
      return response.data.transactions;
    } catch (error: any) {
      throw new PlaidAPIError(
        `Failed to get transactions: ${error.response?.data?.error_message || error.message}`,
        error
      );
    }
  }
}
