// Banking API Client - connects to RealCo backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string | null;
  accountType: 'CHECKING' | 'SAVINGS' | 'MONEY_MARKET';
  lastFourDigits: string;
  accountHolderName: string;
  isVerified: boolean;
  isDefault: boolean;
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'SUSPENDED' | 'REMOVED';
  verificationMethod: 'PLAID_INSTANT' | 'MICRO_DEPOSITS' | 'MANUAL';
  plaidItemId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlaidLinkToken {
  linkToken: string;
  expiration: string;
}

export interface BankAccountVerification {
  amount1: number;
  amount2: number;
}

class BankingAPI {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('realco_user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token || null;
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // Get all bank accounts for the current user
  async getBankAccounts(): Promise<BankAccount[]> {
    return this.request<BankAccount[]>('/banking/accounts');
  }

  // Get a specific bank account
  async getBankAccount(accountId: string): Promise<BankAccount> {
    return this.request<BankAccount>(`/banking/accounts/${accountId}`);
  }

  // Create Plaid Link token for instant bank verification
  async createPlaidLinkToken(): Promise<PlaidLinkToken> {
    return this.request<PlaidLinkToken>('/banking/plaid/create-link-token', {
      method: 'POST',
    });
  }

  // Exchange Plaid public token for account
  async exchangePlaidToken(publicToken: string, metadata: any): Promise<BankAccount> {
    return this.request<BankAccount>('/banking/plaid/exchange-token', {
      method: 'POST',
      body: JSON.stringify({ publicToken, metadata }),
    });
  }

  // Add bank account manually (micro-deposit verification)
  async addBankAccountManual(data: {
    accountType: 'CHECKING' | 'SAVINGS' | 'MONEY_MARKET';
    routingNumber: string;
    accountNumber: string;
    accountHolderName: string;
  }): Promise<BankAccount> {
    return this.request<BankAccount>('/banking/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Verify micro-deposits
  async verifyMicroDeposits(
    accountId: string,
    amounts: BankAccountVerification
  ): Promise<{ success: boolean; verified: boolean }> {
    return this.request(`/banking/accounts/${accountId}/verify`, {
      method: 'POST',
      body: JSON.stringify(amounts),
    });
  }

  // Set default bank account
  async setDefaultAccount(accountId: string): Promise<BankAccount> {
    return this.request<BankAccount>(`/banking/accounts/${accountId}/set-default`, {
      method: 'PUT',
    });
  }

  // Remove bank account
  async removeBankAccount(accountId: string): Promise<{ success: boolean }> {
    return this.request(`/banking/accounts/${accountId}`, {
      method: 'DELETE',
    });
  }

  // Get account balance from Plaid
  async getAccountBalance(accountId: string): Promise<{
    available: number;
    current: number;
    currency: string;
  }> {
    return this.request(`/banking/accounts/${accountId}/balance`);
  }
}

export const bankingAPI = new BankingAPI();
