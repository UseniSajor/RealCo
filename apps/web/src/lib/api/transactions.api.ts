// Transactions API Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface Transaction {
  id: string;
  type: 'INVESTMENT' | 'DISTRIBUTION' | 'REFUND' | 'FEE' | 'TRANSFER';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  paymentMethod: 'ACH' | 'WIRE' | 'CHECK' | 'INTERNAL';
  amount: number;
  feeAmount: number;
  netAmount: number;
  currency: string;
  description: string;
  fromUserId: string | null;
  toUserId: string | null;
  bankAccountId: string | null;
  offeringId: string | null;
  escrowAccountId: string | null;
  stripePaymentId: string | null;
  initiatedAt: string;
  completedAt: string | null;
  failedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvestmentRequest {
  offeringId: string;
  amount: number;
  bankAccountId: string;
  paymentMethod: 'ACH' | 'WIRE';
}

export interface TransactionFilters {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

class TransactionsAPI {
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

  // Get all transactions for the current user
  async getTransactions(filters?: TransactionFilters): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.startDate) queryParams.append('startDate', filters.startDate);
    if (filters?.endDate) queryParams.append('endDate', filters.endDate);
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.offset) queryParams.append('offset', filters.offset.toString());

    const query = queryParams.toString();
    return this.request(`/transactions${query ? `?${query}` : ''}`);
  }

  // Get a specific transaction
  async getTransaction(transactionId: string): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${transactionId}`);
  }

  // Create investment transaction
  async createInvestment(data: CreateInvestmentRequest): Promise<Transaction> {
    return this.request<Transaction>('/transactions/investment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get transaction status
  async getTransactionStatus(transactionId: string): Promise<{
    status: string;
    statusDetails: any;
  }> {
    return this.request(`/transactions/${transactionId}/status`);
  }

  // Cancel pending transaction
  async cancelTransaction(transactionId: string): Promise<{
    success: boolean;
    transaction: Transaction;
  }> {
    return this.request(`/transactions/${transactionId}/cancel`, {
      method: 'POST',
    });
  }

  // Get transaction history summary
  async getTransactionSummary(): Promise<{
    totalInvested: number;
    totalDistributions: number;
    totalFees: number;
    pendingAmount: number;
    transactionCount: number;
  }> {
    return this.request('/transactions/summary');
  }
}

export const transactionsAPI = new TransactionsAPI();
