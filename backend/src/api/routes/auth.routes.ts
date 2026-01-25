import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthService } from '../../services/auth.service.js';
import { prisma } from '../../lib/prisma.js';
import { requireAuth } from '../../middlewares/auth.js';
import { ValidationError } from '../../services/errors.js';

const authService = new AuthService(prisma);

export async function authRoutes(app: FastifyInstance) {
  /**
   * POST /v1/auth/register
   * Register a new user account
   */
  app.post('/auth/register', async (req, reply) => {
    const body = z
      .object({
        email: z.string().email(),
        password: z.string().min(8),
        orgName: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        role: z.enum(['SPONSOR', 'INVESTOR', 'FUND_MANAGER', 'SERVICE_PROVIDER']).optional(),
      })
      .parse(req.body);

    try {
      const result = await authService.registerUser(body);

      // Generate JWT token for newly registered user
      const token = await reply.jwtSign(
        {
          sub: result.user.id,
          org_id: result.user.organizationId,
        },
        { expiresIn: '8h' }
      );

      return reply.status(201).send({
        token,
        user: result.user,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
      }
      throw error;
    }
  });

  /**
   * POST /v1/auth/login
   * Authenticate user and return JWT token
   * (Already implemented in v1.ts - removed duplicate to prevent FST_ERR_DUPLICATED_ROUTE)
   */
  // Duplicate route removed - see v1.ts for implementation

  /**
   * POST /v1/auth/forgot-password
   * Request password reset email
   */
  app.post('/auth/forgot-password', async (req, reply) => {
    const body = z
      .object({
        email: z.string().email(),
      })
      .parse(req.body);

    try {
      const result = await authService.requestPasswordReset(body.email);
      return result;
    } catch (error) {
      // Always return success message for security
      return {
        message: 'If an account exists with this email, a password reset link has been sent',
      };
    }
  });

  /**
   * POST /v1/auth/reset-password
   * Reset password with token from email
   */
  app.post('/auth/reset-password', async (req, reply) => {
    const body = z
      .object({
        token: z.string().min(1),
        newPassword: z.string().min(8),
      })
      .parse(req.body);

    try {
      const result = await authService.confirmPasswordReset(body.token, body.newPassword);
      return result;
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
      }
      throw error;
    }
  });

  /**
   * POST /v1/auth/change-password
   * Change password for authenticated user
   */
  app.post('/auth/change-password', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) {
      throw new Error('User not authenticated');
    }

    const body = z
      .object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8),
      })
      .parse(req.body);

    try {
      const result = await authService.changePassword(
        user.userId,
        body.currentPassword,
        body.newPassword
      );
      return result;
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
      }
      throw error;
    }
  });

  /**
   * GET /v1/auth/profile
   * Get current user profile
   */
  app.get('/auth/profile', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const profile = await authService.getUserProfile(user.userId);
      return profile;
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.status(404).send({
          error: {
            code: 'USER_NOT_FOUND',
            message: error.message,
          },
        });
      }
      throw error;
    }
  });

  /**
   * POST /v1/auth/logout
   * Logout user (client-side token removal, server does nothing with JWT)
   */
  app.post('/auth/logout', async () => {
    return {
      message: 'Logged out successfully',
    };
  });

  /**
   * POST /v1/auth/verify-email
   * Verify email with token
   */
  app.post('/auth/verify-email', async (req, reply) => {
    const body = z
      .object({
        token: z.string().min(1),
      })
      .parse(req.body);

    try {
      const result = await authService.verifyEmail(body.token);
      return result;
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        });
      }
      throw error;
    }
  });

  /**
   * POST /v1/auth/refresh
   * Refresh JWT token (extends expiration)
   */
  app.post('/auth/refresh', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Generate new token with extended expiration
    const token = await reply.jwtSign(
      {
        sub: user.userId,
        org_id: user.orgId,
      },
      { expiresIn: '8h' }
    );

    return { token };
  });
}
