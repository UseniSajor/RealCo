/**
 * Webhook Processor Service
 * Processes Stripe and Plaid webhook events
 */

import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { TransactionService } from './transaction.service.js';
import { EscrowAccountService } from './escrow.service.js';
import { BankAccountService } from './bank-account.service.js';
import { emit } from './events.js';

const prisma = new PrismaClient();

/**
 * Process Stripe webhook event
 */
export async function processStripeWebhook(eventId: string): Promise<void> {
  const webhookEvent = await prisma.webhookEvent.findUnique({
    where: { eventId }
  });

  if (!webhookEvent) {
    throw new Error(`Webhook event not found: ${eventId}`);
  }

  if (webhookEvent.status === 'PROCESSED') {
    console.log(`Webhook ${eventId} already processed`);
    return;
  }

  const event = webhookEvent.payload as Stripe.Event;

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object as Stripe.Charge);
        break;

      case 'charge.failed':
        await handleChargeFailed(event.data.object as Stripe.Charge);
        break;

      case 'transfer.paid':
        await handleTransferPaid(event.data.object as Stripe.Transfer);
        break;

      case 'payout.paid':
        await handlePayoutPaid(event.data.object as Stripe.Payout);
        break;

      case 'payout.failed':
        await handlePayoutFailed(event.data.object as Stripe.Payout);
        break;

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    // Mark as processed
    await prisma.webhookEvent.update({
      where: { eventId },
      data: {
        status: 'PROCESSED',
        processedAt: new Date()
      }
    });
  } catch (error: any) {
    console.error('Stripe webhook processing failed', {
      eventId,
      error: error.message
    });

    await prisma.webhookEvent.update({
      where: { eventId },
      data: {
        status: 'FAILED',
        errorMessage: error.message,
        retryCount: webhookEvent.retryCount + 1
      }
    });

    throw error;
  }
}

/**
 * Handle payment_intent.succeeded
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const transactionId = paymentIntent.metadata.transactionId;

  if (!transactionId) {
    console.warn('No transactionId in payment intent metadata', {
      paymentIntentId: paymentIntent.id
    });
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Update transaction status
    const transaction = await tx.transaction.update({
      where: { id: transactionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        stripePaymentIntentId: paymentIntent.id,
        metadata: {
          ...((await tx.transaction.findUnique({ where: { id: transactionId } }))?.metadata || {}),
          stripeChargeId: paymentIntent.latest_charge,
          stripeStatus: paymentIntent.status
        }
      }
    });

    // If this is an investment deposit, update investment and credit escrow
    if (transaction.type === 'INVESTMENT_DEPOSIT' && transaction.offeringId) {
      // Find the investment
      const investment = await tx.investment.findFirst({
        where: {
          userId: transaction.userId,
          offeringId: transaction.offeringId,
          status: 'PENDING'
        }
      });

      if (investment) {
        // Update investment status to CONFIRMED
        await tx.investment.update({
          where: { id: investment.id },
          data: {
            status: 'CONFIRMED',
            confirmedAt: new Date()
          }
        });

        // Get or create escrow account
        let escrowAccount = await tx.escrowAccount.findUnique({
          where: { offeringId: transaction.offeringId }
        });

        if (!escrowAccount) {
          const escrowService = new EscrowAccountService(tx as any);
          escrowAccount = await escrowService.createEscrowAccount(transaction.offeringId);
        }

        // Credit escrow account
        const escrowService = new EscrowAccountService(tx as any);
        await escrowService.depositFunds(
          escrowAccount.id,
          transaction.id,
          transaction.netAmount
        );
      }
    }

    // Create audit log
    await tx.auditEvent.create({
      data: {
        action: 'transaction.payment_succeeded',
        entityType: 'Transaction',
        entityId: transactionId,
        userId: transaction.userId,
        metadata: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status
        }
      }
    });

    emit('transaction.completed', {
      transactionId: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount,
      type: transaction.type
    });
  });
}

/**
 * Handle payment_intent.payment_failed
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const transactionId = paymentIntent.metadata.transactionId;

  if (!transactionId) {
    console.warn('No transactionId in payment intent metadata', {
      paymentIntentId: paymentIntent.id
    });
    return;
  }

  const transaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status: 'FAILED',
      failedAt: new Date(),
      failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
      metadata: {
        ...((await prisma.transaction.findUnique({ where: { id: transactionId } }))?.metadata || {}),
        stripeError: paymentIntent.last_payment_error,
        stripeStatus: paymentIntent.status
      }
    }
  });

  // Create audit log
  await prisma.auditEvent.create({
    data: {
      action: 'transaction.payment_failed',
      entityType: 'Transaction',
      entityId: transactionId,
      userId: transaction.userId,
      metadata: {
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message,
        code: paymentIntent.last_payment_error?.code
      }
    }
  });

  emit('transaction.failed', {
    transactionId: transaction.id,
    userId: transaction.userId,
    error: paymentIntent.last_payment_error?.message,
    shouldRetry: isRetryableError(paymentIntent.last_payment_error)
  });

  // Schedule retry if appropriate
  if (transaction.retryCount < 3 && isRetryableError(paymentIntent.last_payment_error)) {
    const transactionService = new TransactionService(prisma);
    await transactionService.retryFailedTransaction(transactionId);
  }
}

/**
 * Handle charge.succeeded
 */
async function handleChargeSucceeded(charge: Stripe.Charge): Promise<void> {
  // Find transaction by charge ID or payment intent
  const transaction = await prisma.transaction.findFirst({
    where: {
      OR: [
        { stripePaymentIntentId: charge.payment_intent as string },
        { metadata: { path: ['stripeChargeId'], equals: charge.id } }
      ]
    }
  });

  if (!transaction) {
    console.warn('No transaction found for charge', { chargeId: charge.id });
    return;
  }

  // Update transaction with charge details
  await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      metadata: {
        ...transaction.metadata,
        stripeChargeId: charge.id,
        chargeStatus: charge.status,
        receiptUrl: charge.receipt_url
      }
    }
  });

  console.log('Charge succeeded', {
    transactionId: transaction.id,
    chargeId: charge.id,
    amount: charge.amount
  });
}

/**
 * Handle charge.failed
 */
async function handleChargeFailed(charge: Stripe.Charge): Promise<void> {
  const transaction = await prisma.transaction.findFirst({
    where: {
      OR: [
        { stripePaymentIntentId: charge.payment_intent as string },
        { metadata: { path: ['stripeChargeId'], equals: charge.id } }
      ]
    }
  });

  if (!transaction) {
    console.warn('No transaction found for failed charge', { chargeId: charge.id });
    return;
  }

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      status: 'FAILED',
      failedAt: new Date(),
      failureReason: charge.failure_message || 'Charge failed',
      metadata: {
        ...transaction.metadata,
        stripeChargeId: charge.id,
        failureCode: charge.failure_code
      }
    }
  });

  emit('transaction.failed', {
    transactionId: transaction.id,
    userId: transaction.userId,
    error: charge.failure_message
  });
}

/**
 * Handle transfer.paid
 */
async function handleTransferPaid(transfer: Stripe.Transfer): Promise<void> {
  console.log('Transfer paid', {
    transferId: transfer.id,
    amount: transfer.amount
  });

  // Find transactions related to this transfer
  const transactions = await prisma.transaction.findMany({
    where: {
      metadata: {
        path: ['stripeTransferId'],
        equals: transfer.id
      }
    }
  });

  for (const transaction of transactions) {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });
  }
}

/**
 * Handle payout.paid
 */
async function handlePayoutPaid(payout: Stripe.Payout): Promise<void> {
  const transactionId = payout.metadata.transactionId;

  if (!transactionId) {
    console.warn('No transactionId in payout metadata', { payoutId: payout.id });
    return;
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      metadata: {
        ...((await prisma.transaction.findUnique({ where: { id: transactionId } }))?.metadata || {}),
        stripePayoutId: payout.id,
        payoutStatus: payout.status,
        arrivalDate: payout.arrival_date
      }
    }
  });

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId }
  });

  if (transaction) {
    emit('transaction.completed', {
      transactionId: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount
    });
  }
}

/**
 * Handle payout.failed
 */
async function handlePayoutFailed(payout: Stripe.Payout): Promise<void> {
  const transactionId = payout.metadata.transactionId;

  if (!transactionId) {
    console.warn('No transactionId in payout metadata', { payoutId: payout.id });
    return;
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status: 'FAILED',
      failedAt: new Date(),
      failureReason: payout.failure_message || 'Payout failed',
      metadata: {
        ...((await prisma.transaction.findUnique({ where: { id: transactionId } }))?.metadata || {}),
        stripePayoutId: payout.id,
        failureCode: payout.failure_code
      }
    }
  });

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId }
  });

  if (transaction) {
    emit('transaction.failed', {
      transactionId: transaction.id,
      userId: transaction.userId,
      error: payout.failure_message
    });
  }
}

/**
 * Process Plaid webhook event
 */
export async function processPlaidWebhook(eventId: string, payload: any): Promise<void> {
  const webhookEvent = await prisma.webhookEvent.findFirst({
    where: { eventId }
  });

  if (!webhookEvent) {
    throw new Error(`Webhook event not found: ${eventId}`);
  }

  if (webhookEvent.status === 'PROCESSED') {
    console.log(`Webhook ${eventId} already processed`);
    return;
  }

  const { webhook_type, webhook_code, item_id, error } = payload;

  try {
    switch (webhook_type) {
      case 'ITEM':
        if (webhook_code === 'ERROR' || webhook_code === 'LOGIN_REQUIRED') {
          await handlePlaidItemError(item_id, error);
        }
        break;

      case 'TRANSACTIONS':
        if (webhook_code === 'TRANSACTIONS_REMOVED') {
          await handlePlaidTransactionsRemoved(item_id, payload);
        }
        break;

      case 'HOLDINGS':
        // Handle holdings updates if needed
        break;

      default:
        console.log(`Unhandled Plaid webhook type: ${webhook_type}`);
    }

    await prisma.webhookEvent.update({
      where: { eventId },
      data: {
        status: 'PROCESSED',
        processedAt: new Date()
      }
    });
  } catch (error: any) {
    console.error('Plaid webhook processing failed', {
      eventId,
      error: error.message
    });

    await prisma.webhookEvent.update({
      where: { eventId },
      data: {
        status: 'FAILED',
        errorMessage: error.message,
        retryCount: webhookEvent.retryCount + 1
      }
    });

    throw error;
  }
}

/**
 * Handle Plaid item error (re-authentication required)
 */
async function handlePlaidItemError(itemId: string, error: any): Promise<void> {
  // Find bank account(s) using this Plaid item
  const bankAccounts = await prisma.bankAccount.findMany({
    where: {
      plaidAccountId: itemId,
      deletedAt: null
    }
  });

  for (const account of bankAccounts) {
    // Mark account as needing re-verification
    await prisma.bankAccount.update({
      where: { id: account.id },
      data: {
        verificationStatus: 'PENDING',
        metadata: {
          ...account.metadata,
          plaidError: error,
          plaidErrorCode: error?.error_code,
          requiresRelink: true
        }
      }
    });

    // Notify user
    emit('bankAccount.requiresRelink', {
      userId: account.userId,
      bankAccountId: account.id,
      error: error?.error_message
    });

    // Pause any pending transactions
    await prisma.transaction.updateMany({
      where: {
        bankAccountId: account.id,
        status: { in: ['INITIATED', 'PROCESSING'] }
      },
      data: {
        status: 'FAILED',
        failureReason: 'Bank account requires re-authentication'
      }
    });
  }
}

/**
 * Handle transactions removed
 */
async function handlePlaidTransactionsRemoved(itemId: string, payload: any): Promise<void> {
  console.log('Plaid transactions removed', {
    itemId,
    removedCount: payload.removed_transactions?.length
  });

  // Handle transaction removal if we're storing Plaid transactions
  // This is application-specific
}

/**
 * Check if Stripe error is retryable
 */
function isRetryableError(error: any): boolean {
  if (!error) return false;

  const retryableCodes = [
    'rate_limit_error',
    'processing_error',
    'temporary_hold'
  ];

  const nonRetryableCodes = [
    'insufficient_funds',
    'card_declined',
    'incorrect_cvc',
    'expired_card',
    'invalid_account'
  ];

  if (error.code && nonRetryableCodes.includes(error.code)) {
    return false;
  }

  if (error.code && retryableCodes.includes(error.code)) {
    return true;
  }

  if (error.type === 'api_connection_error') {
    return true;
  }

  return false;
}
