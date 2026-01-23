/**
 * Stripe Payment Service
 * 
 * Handles Stripe API integration for payment processing.
 * 
 * Features:
 * - ACH payment processing
 * - Payment intent creation
 * - Payment method management
 * - Customer management
 * - Webhook signature verification
 * - Refund processing
 */

import Stripe from 'stripe';
import type { PrismaClient } from '@prisma/client';
import { StripeError as StripeAPIError, PaymentProcessingError } from './errors.js';

/**
 * Initialize Stripe client
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

/**
 * Stripe payment intent result
 */
export interface PaymentIntentResult {
  paymentIntentId: string;
  clientSecret: string;
  status: string;
  amount: number;
  currency: string;
}

/**
 * ACH payment options
 */
export interface ACHPaymentOptions {
  amount: number;
  currency: string;
  description: string;
  customerId?: string;
  bankAccountToken?: string; // Plaid processor token
  metadata?: Record<string, string>;
}

/**
 * Stripe Service Class
 * Encapsulates all Stripe API operations
 */
export class StripePaymentService {
  constructor(private prisma: PrismaClient) {}

  // ===========================================================================
  // CUSTOMER MANAGEMENT
  // ===========================================================================

  /**
   * Create or get Stripe customer
   * 
   * @param userId - RealCo user ID
   * @param email - User email
   * @param name - User name
   * @returns Stripe customer ID
   */
  async createOrGetCustomer(
    userId: string,
    email: string,
    name: string
  ): Promise<string> {
    try {
      // Check if customer exists in metadata
      // (You might want to store stripeCustomerId on User model)
      
      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
          platform: 'realco',
        },
      });
      
      return customer.id;
    } catch (error: any) {
      throw new StripeAPIError(
        `Failed to create customer: ${error.message}`,
        error
      );
    }
  }

  /**
   * Attach bank account to customer using Plaid processor token
   * 
   * @param customerId - Stripe customer ID
   * @param bankAccountToken - Plaid processor token
   * @returns Stripe bank account ID
   */
  async attachBankAccount(
    customerId: string,
    bankAccountToken: string
  ): Promise<string> {
    try {
      const bankAccount = await stripe.customers.createSource(customerId, {
        source: bankAccountToken,
      });
      
      return (bankAccount as any).id;
    } catch (error: any) {
      throw new StripeAPIError(
        `Failed to attach bank account: ${error.message}`,
        error
      );
    }
  }

  // ===========================================================================
  // PAYMENT PROCESSING
  // ===========================================================================

  /**
   * Create ACH payment intent
   * 
   * @param options - Payment options
   * @returns Payment intent details
   */
  async createACHPayment(options: ACHPaymentOptions): Promise<PaymentIntentResult> {
    try {
      const amountInCents = Math.round(options.amount * 100);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: options.currency.toLowerCase(),
        description: options.description,
        payment_method_types: ['us_bank_account'],
        customer: options.customerId,
        metadata: options.metadata || {},
      });
      
      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
      };
    } catch (error: any) {
      throw new StripeAPIError(
        `Failed to create ACH payment: ${error.message}`,
        error
      );
    }
  }

  /**
   * Confirm payment intent (server-side confirmation)
   * 
   * @param paymentIntentId - Stripe payment intent ID
   * @param paymentMethodId - Payment method ID
   * @returns Updated payment intent
   */
  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });
      
      return paymentIntent;
    } catch (error: any) {
      throw new PaymentProcessingError(
        `Payment confirmation failed: ${error.message}`,
        error.code
      );
    }
  }

  /**
   * Get payment intent status
   * 
   * @param paymentIntentId - Stripe payment intent ID
   * @returns Payment intent
   */
  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error: any) {
      throw new StripeAPIError(
        `Failed to retrieve payment intent: ${error.message}`,
        error
      );
    }
  }

  /**
   * Cancel payment intent (before completion)
   * 
   * @param paymentIntentId - Stripe payment intent ID
   * @returns Cancelled payment intent
   */
  async cancelPayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error: any) {
      throw new StripeAPIError(
        `Failed to cancel payment: ${error.message}`,
        error
      );
    }
  }

  // ===========================================================================
  // REFUNDS
  // ===========================================================================

  /**
   * Create refund for a charge
   * 
   * @param chargeId - Stripe charge ID
   * @param amount - Refund amount (optional, full refund if not provided)
   * @param reason - Refund reason
   * @returns Refund object
   */
  async createRefund(
    chargeId: string,
    amount?: number,
    reason?: string
  ): Promise<Stripe.Refund> {
    try {
      const refund = await stripe.refunds.create({
        charge: chargeId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason as any,
      });
      
      return refund;
    } catch (error: any) {
      throw new StripeAPIError(
        `Failed to create refund: ${error.message}`,
        error
      );
    }
  }

  // ===========================================================================
  // TRANSFERS (for distributions to investors)
  // ===========================================================================

  /**
   * Create transfer to bank account
   * Used for distributions and payouts
   * 
   * @param amount - Amount in dollars
   * @param destinationBankAccount - Stripe bank account ID
   * @param description - Transfer description
   * @returns Transfer object
   */
  async createTransfer(
    amount: number,
    destinationBankAccount: string,
    description: string
  ): Promise<any> {
    try {
      const amountInCents = Math.round(amount * 100);
      
      // Create payout (ACH transfer to bank account)
      const payout = await stripe.payouts.create({
        amount: amountInCents,
        currency: 'usd',
        description,
        destination: destinationBankAccount,
      });
      
      return payout;
    } catch (error: any) {
      throw new StripeAPIError(
        `Failed to create transfer: ${error.message}`,
        error
      );
    }
  }

  // ===========================================================================
  // WEBHOOK HANDLING
  // ===========================================================================

  /**
   * Verify Stripe webhook signature
   * CRITICAL: Always verify webhooks to prevent forgery
   * 
   * @param rawBody - Raw request body (Buffer or string)
   * @param signature - Stripe-Signature header value
   * @returns Verified Stripe event
   */
  verifyWebhookSignature(
    rawBody: string | Buffer,
    signature: string
  ): Stripe.Event {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET not configured');
      }
      
      return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (error: any) {
      throw new StripeAPIError(
        `Webhook signature verification failed: ${error.message}`,
        error
      );
    }
  }

  /**
   * Handle payment intent succeeded event
   * 
   * @param event - Stripe event
   */
  async handlePaymentIntentSucceeded(event: Stripe.Event): Promise<void> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    // Find transaction by Stripe payment intent ID
    const transaction = await this.prisma.transaction.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
    });
    
    if (!transaction) {
      console.warn(`Transaction not found for payment intent: ${paymentIntent.id}`);
      return;
    }
    
    // Update transaction status
    await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        stripeChargeId: paymentIntent.latest_charge as string,
      },
    });
    
    // Create audit log
    await this.prisma.auditEvent.create({
      data: {
        action: 'payment.succeeded',
        entityType: 'Transaction',
        entityId: transaction.id,
        userId: transaction.fromUserId,
        metadata: {
          stripePaymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
        },
      },
    });
    
    console.log(`Payment succeeded for transaction: ${transaction.id}`);
  }

  /**
   * Handle payment intent failed event
   * 
   * @param event - Stripe event
   */
  async handlePaymentIntentFailed(event: Stripe.Event): Promise<void> {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    const transaction = await this.prisma.transaction.findUnique({
      where: { stripePaymentIntentId: paymentIntent.id },
    });
    
    if (!transaction) {
      console.warn(`Transaction not found for payment intent: ${paymentIntent.id}`);
      return;
    }
    
    // Update transaction as failed
    await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'FAILED',
        failedAt: new Date(),
        failureCode: paymentIntent.last_payment_error?.code || 'unknown',
        failureMessage: paymentIntent.last_payment_error?.message || 'Payment failed',
      },
    });
    
    console.error(`Payment failed for transaction: ${transaction.id}`);
  }
}
