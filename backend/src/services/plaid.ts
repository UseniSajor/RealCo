/**
 * Plaid Service
 * Centralized Plaid client configuration
 */

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

let plaidClient: PlaidApi | null = null;

/**
 * Get configured Plaid client
 * Singleton pattern to reuse the same client instance
 */
export function getPlaidClient(): PlaidApi {
  if (!plaidClient) {
    const plaidClientId = process.env.PLAID_CLIENT_ID;
    const plaidSecret = process.env.PLAID_SECRET;
    const plaidEnv = process.env.PLAID_ENV || 'sandbox';

    if (!plaidClientId || !plaidSecret) {
      throw new Error('PLAID_CLIENT_ID and PLAID_SECRET environment variables must be set');
    }

    const configuration = new Configuration({
      basePath: PlaidEnvironments[plaidEnv as keyof typeof PlaidEnvironments],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': plaidClientId,
          'PLAID-SECRET': plaidSecret,
        },
      },
    });

    plaidClient = new PlaidApi(configuration);
  }

  return plaidClient;
}

/**
 * Exchange public token for access token
 */
export async function exchangePublicToken(publicToken: string) {
  const client = getPlaidClient();
  const response = await client.itemPublicTokenExchange({
    public_token: publicToken
  });
  return response.data;
}

/**
 * Get account information
 */
export async function getAccountInfo(accessToken: string) {
  const client = getPlaidClient();
  const response = await client.authGet({
    access_token: accessToken
  });
  return response.data;
}

/**
 * Get account balance
 */
export async function getAccountBalance(accessToken: string, accountIds?: string[]) {
  const client = getPlaidClient();
  const response = await client.accountsBalanceGet({
    access_token: accessToken,
    options: accountIds ? { account_ids: accountIds } : undefined
  });
  return response.data;
}
