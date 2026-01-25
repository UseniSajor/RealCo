// Portfolio API Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalGain: number;
  totalGainPercent: number;
  weightedAvgIRR: number;
  portfolioTVPI: number;
  activeInvestments: number;
  properties: number;
  funds: number;
}

class PortfolioAPI {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('realco_user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token || null;
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }
    return response.json();
  }

  // Get portfolio summary for the current user
  async getPortfolioSummary(): Promise<PortfolioSummary> {
    return this.request('/portfolio/summary');
  }

  // Enhanced update endpoint for investments
  async updateInvestmentSummary(): Promise<{ success: boolean }> {
    return this.request('/portfolio/update-investments', { method: 'POST' });
  }

  // Enhanced update endpoint for transaction summaries
  async updateTransactionSummary(): Promise<{ success: boolean }> {
    return this.request('/portfolio/update-transactions', { method: 'POST' });
  }
}

export const portfolioAPI = new PortfolioAPI();
