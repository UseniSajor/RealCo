/**
 * Minimal V1 API - Core functionality only
 * Use this for initial deployment
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticateRequest } from '../middlewares/auth.js';

export async function registerMinimalV1Routes(fastify: FastifyInstance) {
  // Health check
  fastify.get('/health', async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        version: '1.0.0'
      };
    } catch (error) {
      throw new Error('Database connection failed');
    }
  });

  // Protected routes
  fastify.register(async (instance) => {
    instance.addHook('onRequest', authenticateRequest);

    // Get user profile
    instance.get('/users/me', async (request) => {
      const userId = request.user.userId;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          orgId: true,
          createdAt: true,
          organization: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    });

    // List offerings
    instance.get('/offerings', async (request) => {
      const offerings = await prisma.offering.findMany({
        where: {
          orgId: request.user.orgId
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              investments: true,
              transactions: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return { offerings };
    });

    // Get offering by ID
    instance.get<{ Params: { id: string } }>(
      '/offerings/:id',
      async (request) => {
        const offering = await prisma.offering.findFirst({
          where: {
            id: request.params.id,
            orgId: request.user.orgId
          },
          include: {
            organization: true,
            developmentProjects: true,
            escrowAccount: true,
            _count: {
              select: {
                investments: true,
                transactions: true,
                distributions: true
              }
            }
          }
        });

        if (!offering) {
          throw new Error('Offering not found');
        }

        return offering;
      }
    );

    // List projects
    instance.get('/projects', async (request) => {
      const projects = await prisma.project.findMany({
        where: {
          developmentProject: {
            orgId: request.user.orgId
          },
          deletedAt: null
        },
        include: {
          developmentProject: {
            include: {
              offering: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          _count: {
            select: {
              tasks: true,
              milestones: true,
              dailyLogs: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return { projects };
    });

    // Get project by ID
    instance.get<{ Params: { id: string } }>(
      '/projects/:id',
      async (request) => {
        const project = await prisma.project.findFirst({
          where: {
            id: request.params.id,
            developmentProject: {
              orgId: request.user.orgId
            },
            deletedAt: null
          },
          include: {
            developmentProject: {
              include: {
                offering: true
              }
            },
            tasks: {
              where: { deletedAt: null },
              orderBy: { plannedStartDate: 'asc' }
            },
            milestones: {
              orderBy: { targetDate: 'asc' }
            }
          }
        });

        if (!project) {
          throw new Error('Project not found');
        }

        return project;
      }
    );

    // List transactions
    instance.get('/transactions', async (request) => {
      const transactions = await prisma.transaction.findMany({
        where: {
          OR: [
            { fromUserId: request.user.userId },
            { toUserId: request.user.userId }
          ]
        },
        include: {
          offering: {
            select: {
              id: true,
              name: true
            }
          },
          escrowAccount: {
            select: {
              id: true,
              accountNumber: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 100
      });

      return { transactions };
    });

    // Get transaction by ID
    instance.get<{ Params: { id: string } }>(
      '/transactions/:id',
      async (request) => {
        const transaction = await prisma.transaction.findFirst({
          where: {
            id: request.params.id,
            OR: [
              { fromUserId: request.user.userId },
              { toUserId: request.user.userId }
            ]
          },
          include: {
            offering: true,
            escrowAccount: true,
            distribution: true,
            fromUser: {
              select: {
                id: true,
                email: true
              }
            },
            toUser: {
              select: {
                id: true,
                email: true
              }
            }
          }
        });

        if (!transaction) {
          throw new Error('Transaction not found');
        }

        return transaction;
      }
    );
  });
}
