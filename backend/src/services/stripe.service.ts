/**
 * Stripe Service
 * Centralized Stripe client configuration
 */

import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

/**
 * Get configured Stripe client
 * Singleton pattern to reuse the same client instance
 */
export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable not set');
    }

    stripeClient = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia', // Use latest stable API version
      typescript: true,
      maxNetworkRetries: 3,
      timeout: 30000 // 30 seconds
    });
  }

  return stripeClient;
}

/**
 * Create a payment intent
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripeClient();
  
  return await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true
    }
  });
}

/**
 * Create a payout
 */
export async function createPayout(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
): Promise<Stripe.Payout> {
  const stripe = getStripeClient();
  
  return await stripe.payouts.create({
    amount,
    currency,
    metadata
  });
}

/**
 * Create a refund
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number
): Promise<Stripe.Refund> {
  const stripe = getStripeClient();
  
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount
  });
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  const stripe = getStripeClient();
  
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
