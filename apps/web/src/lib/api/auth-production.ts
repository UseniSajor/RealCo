// Production Authentication API Client

import { config } from '../config'

export interface User {
  id: string
  email: string
  name: string
  role: 'sponsor' | 'fund_manager' | 'investor' | 'provider'
  company?: string
  verified: boolean
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role: 'sponsor' | 'fund_manager' | 'investor' | 'provider'
  company?: string
}

export class AuthProductionClient {
  private static instance: AuthProductionClient
  private baseUrl: string

  private constructor() {
    this.baseUrl = `${config.apiUrl}/api/v1/auth`
  }

  static getInstance(): AuthProductionClient {
    if (!AuthProductionClient.instance) {
      AuthProductionClient.instance = new AuthProductionClient()
    }
    return AuthProductionClient.instance
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    const result = await response.json()
    this.storeTokens(result.token, result.refreshToken)
    return result
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const result = await response.json()
    this.storeTokens(result.token, result.refreshToken)
    return result
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      })
    } finally {
      this.clearTokens()
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/me`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }

    return response.json()
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ token: string }> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${this.baseUrl}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      this.clearTokens()
      throw new Error('Token refresh failed')
    }

    const result = await response.json()
    this.storeTokens(result.token, refreshToken)
    return result
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Password reset request failed')
    }

    return response.json()
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, new_password: newPassword }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Password reset failed')
    }

    return response.json()
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Password change failed')
    }

    return response.json()
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<Pick<User, 'name' | 'company'>>): Promise<User> {
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Profile update failed')
    }

    return response.json()
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Email verification failed')
    }

    return response.json()
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('authToken')
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('refreshToken')
  }

  /**
   * Store tokens
   */
  private storeTokens(token: string, refreshToken: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('authToken', token)
    localStorage.setItem('refreshToken', refreshToken)
  }

  /**
   * Clear tokens
   */
  private clearTokens(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }
}

export const authProductionClient = AuthProductionClient.getInstance()
