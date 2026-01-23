import axios, { AxiosError, AxiosInstance } from 'axios';
import { auth } from './auth';

export interface ApiError {
  code?: string;
  message: string;
  details?: unknown;
}

// Read and normalize VITE_API_URL (remove trailing slash)
const rawApiUrl = import.meta.env.VITE_API_URL;

// In production, VITE_API_URL must be set
if (import.meta.env.PROD && !rawApiUrl) {
  throw new Error('VITE_API_URL environment variable is required in production. Please set it in your deployment configuration.');
}

// Fallback to localhost for development
const apiUrl = rawApiUrl || 'http://localhost:5001';
const normalizedApiUrl = apiUrl.replace(/\/+$/, '');
const API_BASE_URL = `${normalizedApiUrl}/v1`;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' }
    });

    this.client.interceptors.request.use((config) => {
      const token = auth.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (r) => r,
      (error: AxiosError<{ error?: ApiError }>) => {
        // Handle 401 Unauthorized - clear token and redirect to login
        if (error.response?.status === 401) {
          auth.clearToken();
          // Only redirect if we're not already on the login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }

        const apiErr = error.response?.data?.error;
        // Pass through a normalized error
        return Promise.reject(apiErr ?? { message: error.message });
      }
    );
  }

  get instance() {
    return this.client;
  }
}

export const apiClient = new ApiClient().instance;
