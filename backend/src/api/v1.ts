import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { requireAuth } from '../middlewares/auth.js';
import { prisma } from '../lib/prisma.js';

export async function registerV1Routes(app: FastifyInstance) {
  // Login endpoint
  app.post('/auth/login', async (req, reply) => {
    const body = z
      .object({
        email: z.string().email(),
        password: z.string().min(1),
      })
      .parse(req.body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: { organization: true },
    });

    if (!user) {
      return reply.status(401).send({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(body.password, user.passwordHash);
    if (!isValidPassword) {
      return reply.status(401).send({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Generate JWT with user_id (sub) and org_id
    const token = await reply.jwtSign(
      {
        sub: user.id,
        org_id: user.orgId,
      },
      { expiresIn: '8h' }
    );

    return { token };
  });

  // Dev login endpoint - only available in development
  if (process.env.NODE_ENV === 'development') {
    app.post('/auth/dev-login', async (_req, reply) => {
      // WARNING: dev-only endpoint for local bootstrap
      const token = await reply.jwtSign({ sub: 'dev-user', org_id: '00000000-0000-0000-0000-000000000001' }, { expiresIn: '8h' });
      return { token };
    });
  }

  // Debug config endpoint - only available in development
  if (process.env.NODE_ENV === 'development') {
    app.get('/debug/config', async () => {
      return {
        nodeEnv: process.env.NODE_ENV || null,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        corsOrigin: process.env.CORS_ORIGIN || null,
      };
    });
  }

  // Get offerings - organization scoped
  app.get('/offerings', { preHandler: [requireAuth] }, async (req) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) {
      throw new Error('User not authenticated');
    }

    const offerings = await prisma.offering.findMany({
      where: { orgId: user.orgId },
      select: {
        id: true,
        name: true,
        status: true,
        regulationMode: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { items: offerings };
  });

  // Create offering - organization scoped
  app.post('/offerings', { preHandler: [requireAuth] }, async (req) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) {
      throw new Error('User not authenticated');
    }

    const body = z
      .object({
        name: z.string().min(2),
        regulation_mode: z.enum(['506b', '506c', 'internal']).default('internal'),
      })
      .parse(req.body);

    const offering = await prisma.offering.create({
      data: {
        name: body.name,
        regulationMode: body.regulation_mode,
        status: 'draft',
        orgId: user.orgId,
      },
      select: {
        id: true,
        name: true,
        status: true,
        regulationMode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { id: offering.id };
  });
}
