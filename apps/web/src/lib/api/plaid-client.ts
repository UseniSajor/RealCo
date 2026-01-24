// Plaid Integration Client for Bank Verification

import { config } from '../config'

export interface PlaidLinkOptions {
  token: string
  onSuccess: (public_token: string, metadata: any) => void
  onExit?: (err: any, metadata: any) => void
  onEvent?: (eventName: string, metadata: any) => void
}

export interface BankAccount {
  id: string
  name: string
  mask: string
  type: 'checking' | 'savings'
  subtype: string
  institutionName: string
  available: number
  current: number
}

export class PlaidClient {
  private static instance: PlaidClient
  private baseUrl: string

  private constructor() {
    this.baseUrl = `${config.apiUrl}/api/v1/plaid`
  }

  static getInstance(): PlaidClient {
    if (!PlaidClient.instance) {
      PlaidClient.instance = new PlaidClient()
    }
    return PlaidClient.instance
  }

  /**
   * Create a Link Token to initialize Plaid Link
   */
  async createLinkToken(userId: string): Promise<{ link_token: string }> {
    if (!config.plaid.enabled) {
      throw new Error('Plaid is not enabled')
    }

    const response = await fetch(`${this.baseUrl}/create_link_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({ user_id: userId }),
    })

    if (!response.ok) {
      throw new Error('Failed to create link token')
    }

    return response.json()
  }

  /**
   * Exchange public token for access token
   */
  async exchangePublicToken(publicToken: string): Promise<{
    access_token: string
    item_id: string
  }> {
    const response = await fetch(`${this.baseUrl}/exchange_public_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({ public_token: publicToken }),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange public token')
    }

    return response.json()
  }

  /**
   * Get bank accounts for a user
   */
  async getAccounts(userId: string): Promise<BankAccount[]> {
    const response = await fetch(`${this.baseUrl}/accounts/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch accounts')
    }

    return response.json()
  }

  /**
   * Get account balance
   */
  async getBalance(accountId: string): Promise<{
    available: number
    current: number
    limit: number | null
  }> {
    const response = await fetch(`${this.baseUrl}/balance/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch balance')
    }

    return response.json()
  }

  /**
   * Verify account for ACH transfers
   */
  async verifyAccount(accountId: string, amounts: number[]): Promise<{
    verified: boolean
  }> {
    const response = await fetch(`${this.baseUrl}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({ account_id: accountId, amounts }),
    })

    if (!response.ok) {
      throw new Error('Failed to verify account')
    }

    return response.json()
  }

  private getAuthToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || ''
    }
    return ''
  }
}

export const plaidClient = PlaidClient.getInstance()
