/**
 * Webhook Routes - Stripe and Plaid
 * Handles asynchronous payment and bank account events
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { getStripeClient } from '../../services/stripe.service.js';
import { processStripeWebhook, processPlaidWebhook } from '../../services/webhook-processor.service.js';

const prisma = new PrismaClient();

export async function webhookRoutes(server: FastifyInstance) {
  /**
   * Stripe webhook endpoint
   * POST /api/v1/webhooks/stripe
   */
  server.post(
    '/webhooks/stripe',
    {
      config: {
        // Disable body parsing to get raw body for signature verification
        rawBody: true
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const sig = request.headers['stripe-signature'] as string;

      if (!sig) {
        server.log.error({ msg: 'Missing Stripe signature header' });
        return reply.code(400).send({ error: 'Missing signature' });
      }

      const stripe = getStripeClient();
      let event: Stripe.Event;

      try {
        // Verify webhook signature
        // Get raw body from request
        const rawBody = (request as any).rawBody || request.body;
        event = stripe.webhooks.constructEvent(
          rawBody as string | Buffer,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
      } catch (err: any) {
        server.log.error({ msg: 'Stripe webhook signature verification failed', error: err.message });
        return reply.code(400).send({ error: 'Invalid signature' });
      }

      try {
        // Check for duplicate event
        const exists = await prisma.webhookEvent.findUnique({
          where: { eventId: event.id }
        });

        if (exists) {
        server.log.info({ msg: 'Duplicate Stripe webhook event', eventId: event.id, type: event.type });
        return reply.send({ received: true, duplicate: true });
      }

      // Log webhook event
      const webhookEvent = await prisma.webhookEvent.create({
        data: {
          eventId: event.id,
          eventType: event.type,
          provider: 'STRIPE',
          payload: event as any,
          status: 'PENDING'
        }
      });

      server.log.info({ msg: 'Stripe webhook received', eventId: event.id, type: event.type });

      // Process webhook asynchronously
      // In production, use a queue (BullMQ, etc.)
      processStripeWebhook(event.id).catch((error: any) => {
        server.log.error({ msg: 'Stripe webhook processing failed', eventId: event.id, error: error.message });
      });

      // Return 200 immediately
      return reply.send({ received: true });
    } catch (error: any) {
      server.log.error({ msg: 'Error handling Stripe webhook', eventId: event?.id, error: error.message });
        // Still return 200 to prevent retries
        return reply.send({ received: true, error: 'Processing error' });
      }
    }
  );

  /**
   * Plaid webhook endpoint
   * POST /api/v1/webhooks/plaid
   */
  server.post<{ Body: any }>(
    '/webhooks/plaid',
    async (request, reply) => {
      const { webhook_type, webhook_code, item_id, error } = request.body as any;

      try {
        // Verify Plaid webhook (in production, verify signature)
        const plaidWebhookSecret = process.env.PLAID_WEBHOOK_SECRET;
        if (plaidWebhookSecret) {
          const signature = request.headers['plaid-verification'] as string;
          // TODO: Implement Plaid signature verification
        }

        // Generate event ID for idempotency
        const eventId = `plaid_${webhook_type}_${item_id}_${Date.now()}`;

        // Check for duplicate (use shorter time window for Plaid)
        const recentEvent = await prisma.webhookEvent.findFirst({
          where: {
            provider: 'PLAID',
            eventType: webhook_type,
            payload: {
              path: ['item_id'],
              equals: item_id
            },
            createdAt: {
              gte: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes
            }
          }
        });

        if (recentEvent) {
        server.log.info({ msg: 'Recent Plaid webhook already processed', eventId, type: webhook_type, itemId: item_id });
        return reply.send({ received: true });
      }

      // Log webhook event
      await prisma.webhookEvent.create({
        data: {
          eventId,
          eventType: webhook_type,
          provider: 'PLAID',
          payload: request.body as any,
          status: 'PENDING'
        }
      });

      server.log.info({ msg: 'Plaid webhook received', eventId, type: webhook_type, code: webhook_code, itemId: item_id });

      // Process webhook asynchronously
      processPlaidWebhook(eventId, request.body).catch((error: any) => {
        server.log.error({ msg: 'Plaid webhook processing failed', eventId, error: error.message });
      });

      // Return 200 immediately
      return reply.send({ received: true });
    } catch (error: any) {
      server.log.error({ msg: 'Error handling Plaid webhook', error: error.message, body: request.body });
        // Still return 200 to prevent retries
        return reply.send({ received: true, error: 'Processing error' });
      }
    }
  );

  /**
   * Webhook test endpoint (development only)
   */
  if (process.env.NODE_ENV === 'development') {
    server.post('/webhooks/test', async (request, reply) => {
      return reply.send({
        message: 'Webhook test endpoint',
        body: request.body
      });
    });
  }
}
