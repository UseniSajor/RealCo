// Auth API Client for Production Mode
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface AuthUser {
  id: string;
  email: string;
  organizationId: string;
  organizationName: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterRequest {
  email: string;
  password: string;
  orgName?: string;
  firstName?: string;
  lastName?: string;
  role?: 'SPONSOR' | 'INVESTOR' | 'FUND_MANAGER' | 'SERVICE_PROVIDER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export class AuthAPI {
  private static getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('realco_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Registration failed');
    }

    const result: AuthResponse = await response.json();
    
    // Store token
    localStorage.setItem('realco_token', result.token);
    localStorage.setItem('realco_user', JSON.stringify(result.user));
    
    return result;
  }

  /**
   * Login existing user
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Login failed');
    }

    const result: AuthResponse = await response.json();
    
    // Store token
    localStorage.setItem('realco_token', result.token);
    localStorage.setItem('realco_user', JSON.stringify(result.user));
    
    return result;
  }

  /**
   * Request password reset email
   */
  static async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/forgot-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send password reset email');
    }

    return await response.json();
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/reset-password`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Password reset failed');
    }

    return await response.json();
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/change-password`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Password change failed');
    }

    return await response.json();
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/profile`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch profile');
    }

    return await response.json();
  }

  /**
   * Refresh JWT token
   */
  static async refreshToken(): Promise<{ token: string }> {
    const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const result = await response.json();
    
    // Update stored token
    localStorage.setItem('realco_token', result.token);
    
    return result;
  }

  /**
   * Logout (clear local storage)
   */
  static logout(): void {
    localStorage.removeItem('realco_token');
    localStorage.removeItem('realco_user');
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('realco_token');
  }

  /**
   * Get stored token
   */
  static getToken(): string | null {
    return localStorage.getItem('realco_token');
  }

  /**
   * Get stored user
   */
  static getUser(): AuthUser | null {
    const user = localStorage.getItem('realco_user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch {
        return null;
      }
    }
    return null;
  }
}
