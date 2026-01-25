/**
 * Plaid Service
 * Handles Plaid API integration for bank account linking and verification
 */

import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

// Initialize Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
      'PLAID-SECRET': process.env.PLAID_SECRET || '',
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

export interface CreateLinkTokenParams {
  userId: string;
  userEmail?: string;
}

export interface ExchangePublicTokenResponse {
  accessToken: string;
  itemId: string;
}

/**
 * Create Plaid Link token for frontend integration
 */
export async function createLinkToken(params: CreateLinkTokenParams) {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: params.userId,
        email_address: params.userEmail,
      },
      client_name: 'RealCo Platform',
      products: [Products.Auth, Products.Transactions, Products.Identity],
      country_codes: [CountryCode.Us],
      language: 'en',
      redirect_uri: process.env.PLAID_REDIRECT_URI,
      webhook: process.env.PLAID_WEBHOOK_URL,
    });

    return {
      linkToken: response.data.link_token,
      expiration: response.data.expiration,
    };
  } catch (error: any) {
    console.error('Plaid link token creation error:', error.response?.data || error.message);
    throw new Error('Failed to create Plaid link token');
  }
}

/**
 * Exchange public token for access token
 */
export async function exchangePublicToken(publicToken: string): Promise<ExchangePublicTokenResponse> {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    return {
      accessToken: response.data.access_token,
      itemId: response.data.item_id,
    };
  } catch (error: any) {
    console.error('Plaid token exchange error:', error.response?.data || error.message);
    throw new Error('Failed to exchange Plaid token');
  }
}

/**
 * Get account details
 */
export async function getAccounts(accessToken: string) {
  try {
    const response = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    return response.data.accounts;
  } catch (error: any) {
    console.error('Plaid get accounts error:', error.response?.data || error.message);
    throw new Error('Failed to get account details');
  }
}

/**
 * Get account balance
 */
export async function getBalance(accessToken: string, accountId?: string) {
  try {
    const response = await plaidClient.accountsBalanceGet({
      access_token: accessToken,
      options: accountId ? { account_ids: [accountId] } : undefined,
    });

    return response.data.accounts;
  } catch (error: any) {
    console.error('Plaid get balance error:', error.response?.data || error.message);
    throw new Error('Failed to get account balance');
  }
}

/**
 * Get account holder identity
 */
export async function getIdentity(accessToken: string) {
  try {
    const response = await plaidClient.identityGet({
      access_token: accessToken,
    });

    return response.data;
  } catch (error: any) {
    console.error('Plaid get identity error:', error.response?.data || error.message);
    throw new Error('Failed to get account holder identity');
  }
}

/**
 * Get account transactions
 */
export async function getTransactions(
  accessToken: string,
  startDate: string,
  endDate: string,
  accountId?: string
) {
  try {
    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: accountId ? { account_ids: [accountId] } : undefined,
    });

    return response.data.transactions;
  } catch (error: any) {
    console.error('Plaid get transactions error:', error.response?.data || error.message);
    throw new Error('Failed to get transactions');
  }
}

/**
 * Verify account for ACH
 */
export async function verifyAccountForACH(accessToken: string, accountId: string) {
  try {
    const authResponse = await plaidClient.authGet({
      access_token: accessToken,
      options: {
        account_ids: [accountId],
      },
    });

    const account = authResponse.data.accounts.find(acc => acc.account_id === accountId);
    const numbers = authResponse.data.numbers.ach?.find(
      num => num.account_id === accountId
    );

    if (!account || !numbers) {
      throw new Error('Account not found or ACH numbers not available');
    }

    return {
      accountId: account.account_id,
      accountType: account.type,
      accountSubtype: account.subtype,
      routingNumber: numbers.routing,
      accountNumber: numbers.account,
      wireRoutingNumber: numbers.wire_routing,
    };
  } catch (error: any) {
    console.error('Plaid verify ACH error:', error.response?.data || error.message);
    throw new Error('Failed to verify account for ACH');
  }
}

/**
 * Create processor token (for Stripe or other payment processors)
 */
export async function createProcessorToken(
  accessToken: string,
  accountId: string,
  processor: 'stripe' | 'dwolla' | 'checkout' = 'stripe'
) {
  try {
    const response = await plaidClient.processorTokenCreate({
      access_token: accessToken,
      account_id: accountId,
      // @ts-ignore - Plaid API enum mismatch
      processor: processor,
    });

    return response.data.processor_token;
  } catch (error: any) {
    console.error('Plaid create processor token error:', error.response?.data || error.message);
    throw new Error('Failed to create processor token');
  }
}

/**
 * Remove Plaid item (unlink account)
 */
export async function removeItem(accessToken: string) {
  try {
    await plaidClient.itemRemove({
      access_token: accessToken,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Plaid remove item error:', error.response?.data || error.message);
    throw new Error('Failed to remove Plaid item');
  }
}

/**
 * Handle Plaid webhooks
 */
export async function handleWebhook(webhookType: string, webhookCode: string, payload: any) {
  console.log('Plaid webhook received:', { webhookType, webhookCode });

  switch (webhookType) {
    case 'TRANSACTIONS':
      // Handle transaction updates
      if (webhookCode === 'DEFAULT_UPDATE') {
        console.log('New transactions available');
      }
      break;

    case 'ITEM':
      // Handle item updates
      if (webhookCode === 'ERROR') {
        console.error('Plaid item error:', payload.error);
      }
      break;

    case 'AUTH':
      // Handle auth updates
      if (webhookCode === 'AUTOMATICALLY_VERIFIED') {
        console.log('Account automatically verified');
      }
      break;

    default:
      console.log('Unhandled webhook type:', webhookType);
  }

  return { received: true };
}
