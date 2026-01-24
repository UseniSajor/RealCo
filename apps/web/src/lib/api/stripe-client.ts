// Stripe Integration Client for Payment Processing

import { loadStripe, Stripe } from '@stripe/stripe-js'
import { config } from '../config'

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled'
  client_secret: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account'
  card?: {
    brand: string
    last4: string
    exp_month: number
    exp_year: number
  }
  bank_account?: {
    bank_name: string
    last4: string
    routing_number: string
  }
}

export class StripeClient {
  private static instance: StripeClient
  private stripePromise: Promise<Stripe | null> | null = null
  private baseUrl: string

  private constructor() {
    this.baseUrl = `${config.apiUrl}/api/v1/payments`
    if (config.stripe.enabled && config.stripe.publishableKey) {
      this.stripePromise = loadStripe(config.stripe.publishableKey)
    }
  }

  static getInstance(): StripeClient {
    if (!StripeClient.instance) {
      StripeClient.instance = new StripeClient()
    }
    return StripeClient.instance
  }

  /**
   * Get Stripe instance
   */
  async getStripe(): Promise<Stripe | null> {
    if (!config.stripe.enabled) {
      throw new Error('Stripe is not enabled')
    }
    return this.stripePromise
  }

  /**
   * Create a payment intent
   */
  async createPaymentIntent(data: {
    amount: number
    currency?: string
    description?: string
    metadata?: Record<string, string>
  }): Promise<PaymentIntent> {
    const response = await fetch(`${this.baseUrl}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to create payment intent')
    }

    return response.json()
  }

  /**
   * Confirm a payment
   */
  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent> {
    const response = await fetch(`${this.baseUrl}/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
        payment_method_id: paymentMethodId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to confirm payment')
    }

    return response.json()
  }

  /**
   * Get payment methods for a user
   */
  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const response = await fetch(`${this.baseUrl}/payment-methods/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch payment methods')
    }

    return response.json()
  }

  /**
   * Add a payment method
   */
  async addPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
    const response = await fetch(`${this.baseUrl}/payment-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({ payment_method_id: paymentMethodId }),
    })

    if (!response.ok) {
      throw new Error('Failed to add payment method')
    }

    return response.json()
  }

  /**
   * Process a distribution payment
   */
  async processDistribution(data: {
    investorId: string
    amount: number
    propertyId: string
    description: string
  }): Promise<{ success: boolean; transactionId: string }> {
    const response = await fetch(`${this.baseUrl}/distributions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to process distribution')
    }

    return response.json()
  }

  /**
   * Process a capital call payment
   */
  async processCapitalCall(data: {
    investorId: string
    amount: number
    propertyId: string
    dueDate: string
  }): Promise<{ success: boolean; transactionId: string }> {
    const response = await fetch(`${this.baseUrl}/capital-calls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to process capital call')
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

export const stripeClient = StripeClient.getInstance()
