// Kealee Integration Client for Finance & Trust and PM Modules

import { config } from '../config'

export interface KealeeTransaction {
  id: string
  type: 'escrow_deposit' | 'escrow_release' | 'distribution' | 'capital_call'
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
}

export interface KealeeEscrowAccount {
  id: string
  property_id: string
  balance: number
  status: 'active' | 'closed'
  created_at: string
}

export interface KealeeProject {
  id: string
  name: string
  status: 'planning' | 'active' | 'on_hold' | 'completed'
  budget: number
  spent: number
  progress: number
  start_date: string
  end_date: string
}

export interface KealeeDrawRequest {
  id: string
  project_id: string
  amount: number
  status: 'submitted' | 'review' | 'approved' | 'paid' | 'rejected'
  submitted_date: string
  items: Array<{
    description: string
    amount: number
    category: string
  }>
}

export class KealeeClient {
  private static instance: KealeeClient
  private baseUrl: string
  private apiKey: string

  private constructor() {
    this.baseUrl = config.kealee.apiUrl || `${config.apiUrl}/api/v1/kealee`
    this.apiKey = config.kealee.apiKey
  }

  static getInstance(): KealeeClient {
    if (!KealeeClient.instance) {
      KealeeClient.instance = new KealeeClient()
    }
    return KealeeClient.instance
  }

  // =========================================================================
  // FINANCE & TRUST MODULE
  // =========================================================================

  /**
   * Create an escrow account
   */
  async createEscrowAccount(data: {
    property_id: string
    initial_deposit?: number
  }): Promise<KealeeEscrowAccount> {
    const response = await this.request('/finance/escrow/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return response.json()
  }

  /**
   * Deposit funds to escrow
   */
  async depositToEscrow(accountId: string, amount: number): Promise<KealeeTransaction> {
    const response = await this.request('/finance/escrow/deposit', {
      method: 'POST',
      body: JSON.stringify({ account_id: accountId, amount }),
    })

    return response.json()
  }

  /**
   * Release funds from escrow
   */
  async releaseFromEscrow(
    accountId: string,
    amount: number,
    recipient: string,
    purpose: string
  ): Promise<KealeeTransaction> {
    const response = await this.request('/finance/escrow/release', {
      method: 'POST',
      body: JSON.stringify({ account_id: accountId, amount, recipient, purpose }),
    })

    return response.json()
  }

  /**
   * Process a distribution through Kealee
   */
  async processDistribution(data: {
    property_id: string
    investor_id: string
    amount: number
    distribution_date: string
    type: 'preferred_return' | 'profit_split'
  }): Promise<KealeeTransaction> {
    const response = await this.request('/finance/distributions/process', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return response.json()
  }

  /**
   * Get trust account balance
   */
  async getTrustBalance(propertyId: string): Promise<{
    balance: number
    reserved: number
    available: number
  }> {
    const response = await this.request(`/finance/trust/balance/${propertyId}`)
    return response.json()
  }

  /**
   * Generate tax documents
   */
  async generateTaxDocuments(year: number, investorId: string): Promise<{
    k1_url: string
    schedule_e_url: string
  }> {
    const response = await this.request('/finance/tax/generate', {
      method: 'POST',
      body: JSON.stringify({ year, investor_id: investorId }),
    })

    return response.json()
  }

  // =========================================================================
  // PROJECT MANAGEMENT MODULE (m-os-pm)
  // =========================================================================

  /**
   * Create a construction project
   */
  async createProject(data: {
    name: string
    property_id: string
    budget: number
    start_date: string
    end_date: string
  }): Promise<KealeeProject> {
    const response = await this.request('/pm/projects/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return response.json()
  }

  /**
   * Get project details
   */
  async getProject(projectId: string): Promise<KealeeProject> {
    const response = await this.request(`/pm/projects/${projectId}`)
    return response.json()
  }

  /**
   * Submit a draw request
   */
  async submitDrawRequest(data: {
    project_id: string
    amount: number
    description: string
    line_items: Array<{
      description: string
      amount: number
      category: string
    }>
    supporting_documents?: string[]
  }): Promise<KealeeDrawRequest> {
    const response = await this.request('/pm/draw-requests/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return response.json()
  }

  /**
   * Approve a draw request
   */
  async approveDrawRequest(drawRequestId: string, notes?: string): Promise<KealeeDrawRequest> {
    const response = await this.request(`/pm/draw-requests/${drawRequestId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    })

    return response.json()
  }

  /**
   * Get project progress
   */
  async getProjectProgress(projectId: string): Promise<{
    overall_progress: number
    phase: string
    milestones_completed: number
    milestones_total: number
    on_schedule: boolean
    days_variance: number
  }> {
    const response = await this.request(`/pm/projects/${projectId}/progress`)
    return response.json()
  }

  /**
   * Update project progress
   */
  async updateProgress(projectId: string, progress: number, notes?: string): Promise<KealeeProject> {
    const response = await this.request(`/pm/projects/${projectId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress, notes }),
    })

    return response.json()
  }

  /**
   * Get project budget status
   */
  async getBudgetStatus(projectId: string): Promise<{
    budget: number
    committed: number
    spent: number
    remaining: number
    variance_percent: number
  }> {
    const response = await this.request(`/pm/projects/${projectId}/budget`)
    return response.json()
  }

  // =========================================================================
  // HELPER METHODS
  // =========================================================================

  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    if (!config.kealee.enabled) {
      throw new Error('Kealee integration is not enabled')
    }

    const url = `${this.baseUrl}${endpoint}`
    const headers = new Headers(options.headers)
    
    headers.set('Content-Type', 'application/json')
    headers.set('Authorization', `Bearer ${this.getAuthToken()}`)
    
    if (this.apiKey) {
      headers.set('X-Kealee-API-Key', this.apiKey)
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }))
      throw new Error(error.message || `Kealee API error: ${response.status}`)
    }

    return response
  }

  private getAuthToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || ''
    }
    return ''
  }
}

export const kealeeClient = KealeeClient.getInstance()
