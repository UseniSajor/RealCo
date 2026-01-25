import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middlewares/auth.js';
import { prisma } from '../lib/prisma.js';
import { ProjectService } from '../services/project.service.js';
import { TaskService } from '../services/task.service.js';
import { DailyLogService } from '../services/daily-log.service.js';
import { NotificationService } from '../services/notifications.js';
// import { BankAccountService } from '../services/bank-account.service.js'; // TODO: Refactor bank account service
// import { transactionRoutes } from './routes/transactions.routes.js'; // TODO: Create transactions routes
// import { bankingRoutes } from './routes/banking.routes.js';
// import { escrowRoutes } from './routes/escrow.routes.js';
// import { complianceRoutes } from './routes/compliance.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { constructionRoutes } from './routes/construction.routes.js';
import { ProjectNotFoundError, ValidationError, ComplianceError } from '../services/errors.js';

const projectService = new ProjectService(prisma);
const taskService = new TaskService(prisma);
const dailyLogService = new DailyLogService(prisma);
const notificationService = new NotificationService(prisma);
// Bank account service disabled pending refactor
  // const bankAccountService = new BankAccountService(prisma);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));

export async function registerV1Routes(app: FastifyInstance) {
  // Version endpoint - unauthenticated
  app.get('/version', async () => {
    return {
      name: 'realco',
      version: packageJson.version,
      environment: process.env.NODE_ENV,
      ...(process.env.RAILWAY_GIT_COMMIT_SHA && { sha: process.env.RAILWAY_GIT_COMMIT_SHA }),
      ...(process.env.RAILWAY_DEPLOYMENT_ID && { deploymentId: process.env.RAILWAY_DEPLOYMENT_ID }),
    };
  });

  // Ready endpoint - unauthenticated (DB health check)
  app.get('/ready', async () => {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  });

  // Liveness probe - unauthenticated (Kubernetes/Railway)
  app.get('/health/live', async () => {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  });

  // Readiness probe - unauthenticated (critical services only)
  app.get('/health/ready', async (req, reply) => {
    try {
      // Check database
      await prisma.$queryRaw`SELECT 1`;
      return reply.status(200).send({
        status: 'ready',
        checks: {
          database: 'healthy',
        },
      });
    } catch (error) {
      return reply.status(503).send({
        status: 'not_ready',
        checks: {
          database: 'unhealthy',
        },
      });
    }
  });

  // Comprehensive health check - requires auth in production
  app.get('/health', {
    preHandler: process.env.NODE_ENV === 'production' ? requireAuth : undefined,
  }, async (req, reply) => {
    try {
      const { performHealthCheck } = await import('../lib/health.js');
      const health = await performHealthCheck();
      
      const statusCode = health.status === 'unhealthy' ? 503 : 200;
      return reply.status(statusCode).send(health);
    } catch (error) {
      return reply.status(500).send({
        status: 'error',
        error: 'Health check failed',
      });
    }
  });

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

  // ========== Construction Project Management (Kealee m-os-pm) ==========

  app.get('/development-projects', { preHandler: [requireAuth] }, async (req) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const items = await prisma.developmentProject.findMany({
      where: { orgId: user.orgId },
      select: {
        id: true,
        name: true,
        address: true,
        projectType: true,
        offeringId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { items };
  });

  app.post('/development-projects', { preHandler: [requireAuth] }, async (req) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const body = z
      .object({
        name: z.string().min(2),
        address: z.string().optional(),
        projectType: z.enum(['NEW_CONSTRUCTION', 'RENOVATION', 'MULTI_FAMILY', 'COMMERCIAL']).optional(),
        offeringId: z.string().uuid().optional(),
      })
      .parse(req.body);

    const dp = await prisma.developmentProject.create({
      data: {
        name: body.name,
        address: body.address ?? null,
        projectType: body.projectType ?? null,
        orgId: user.orgId,
        offeringId: body.offeringId ?? null,
      },
    });
    return { id: dp.id };
  });

  app.post('/projects', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const body = z
      .object({
        developmentProjectId: z.string().uuid(),
        plannedStartDate: z.coerce.date(),
        plannedEndDate: z.coerce.date(),
        totalBudget: z.number().positive().optional(),
        phase: z
          .enum([
            'PRE_CONSTRUCTION',
            'FOUNDATION',
            'FRAMING',
            'MEP_ROUGH_IN',
            'ENCLOSURE',
            'INTERIOR_FINISH',
            'CLOSEOUT',
            'COMPLETED',
          ])
          .optional(),
      })
      .parse(req.body);

    try {
      const project = await projectService.createProject(body.developmentProjectId, {
        plannedStartDate: body.plannedStartDate,
        plannedEndDate: body.plannedEndDate,
        totalBudget: body.totalBudget,
        phase: body.phase as any,
      });
      return reply.status(201).send(project);
    } catch (e) {
      if (e instanceof ValidationError || e instanceof ComplianceError) {
        return reply.status(400).send({ error: e.name, message: e.message });
      }
      throw e;
    }
  });

  app.get('/projects', { preHandler: [requireAuth] }, async (req) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const devProjects = await prisma.developmentProject.findMany({
      where: { orgId: user.orgId },
      select: { id: true },
    });
    const devIds = devProjects.map((p) => p.id);

    const projects = await prisma.project.findMany({
      where: { developmentProjectId: { in: devIds }, deletedAt: null },
      include: { developmentProject: { select: { name: true, address: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { items: projects };
  });

  app.get('/projects/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const project = await projectService.getProject((req.params as any).id);
    if (!project) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });

    const dev = await prisma.developmentProject.findUnique({
      where: { id: project.developmentProjectId },
    });
    if (!dev || dev.orgId !== user.orgId) {
      return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });
    }
    return project;
  });

  app.patch('/projects/:id/progress', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const body = z.object({ percentComplete: z.number().min(0).max(100) }).parse(req.body);
    try {
      const project = await projectService.updateProgress((req.params as any).id, body.percentComplete);
      return project;
    } catch (e) {
      if (e instanceof ProjectNotFoundError) return reply.status(404).send({ error: 'ProjectNotFound', message: e.message });
      if (e instanceof ValidationError) return reply.status(400).send({ error: 'Validation', message: e.message });
      throw e;
    }
  });

  app.get('/projects/:id/metrics', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const project = await projectService.getProject((req.params as any).id);
    if (!project) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });
    const dev = await prisma.developmentProject.findUnique({ where: { id: project.developmentProjectId } });
    if (!dev || dev.orgId !== user.orgId) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });

    const metrics = await projectService.getProjectMetrics((req.params as any).id);
    return metrics;
  });

  app.get('/projects/:id/critical-path', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const project = await projectService.getProject((req.params as any).id);
    if (!project) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });
    const dev = await prisma.developmentProject.findUnique({ where: { id: project.developmentProjectId } });
    if (!dev || dev.orgId !== user.orgId) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });

    const path = await taskService.calculateCriticalPath((req.params as any).id);
    return { items: path };
  });

  app.post('/projects/:id/archive', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const project = await projectService.getProject((req.params as any).id);
    if (!project) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });
    const dev = await prisma.developmentProject.findUnique({ where: { id: project.developmentProjectId } });
    if (!dev || dev.orgId !== user.orgId) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });

    try {
      const archived = await projectService.archiveProject((req.params as any).id);
      return archived;
    } catch (e) {
      if (e instanceof ProjectNotFoundError) return reply.status(404).send({ error: 'ProjectNotFound', message: e.message });
      throw e;
    }
  });

  app.get('/projects/:id/tasks', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const project = await projectService.getProject((req.params as any).id);
    if (!project) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });
    const dev = await prisma.developmentProject.findUnique({ where: { id: project.developmentProjectId } });
    if (!dev || dev.orgId !== user.orgId) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });

    const q = (req.query as any) || {};
    const filters: any = {};
    if (q.status) filters.status = q.status;
    if (q.priority) filters.priority = q.priority;
    if (q.assignedToId) filters.assignedToId = q.assignedToId;
    if (q.rootOnly === 'true') filters.parentId = null;

    const tasks = await taskService.getTasks((req.params as any).id, Object.keys(filters).length ? filters : undefined);
    return { items: tasks };
  });

  app.post('/projects/:id/tasks', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const project = await projectService.getProject((req.params as any).id);
    if (!project) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });
    const dev = await prisma.developmentProject.findUnique({ where: { id: project.developmentProjectId } });
    if (!dev || dev.orgId !== user.orgId) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });

    const body = z
      .object({
        title: z.string().min(1),
        description: z.string().optional(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
        plannedStartDate: z.coerce.date().optional(),
        plannedEndDate: z.coerce.date().optional(),
        durationDays: z.number().int().positive().optional(),
        predecessorTaskIds: z.array(z.string().uuid()).optional(),
        lagDays: z.number().int().min(0).optional(),
        parentId: z.string().uuid().optional(),
        assignedToId: z.string().uuid().optional(),
        budgetAmount: z.number().positive().optional(),
      })
      .parse(req.body);

    try {
      const task = await taskService.createTask((req.params as any).id, {
        ...body,
        priority: body.priority as any,
      });
      return reply.status(201).send(task);
    } catch (e) {
      if (e instanceof ValidationError || e instanceof ProjectNotFoundError) {
        return reply.status(400).send({ error: e.name, message: e.message });
      }
      throw e;
    }
  });

  app.get('/projects/:id/task-hierarchy', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const project = await projectService.getProject((req.params as any).id);
    if (!project) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });
    const dev = await prisma.developmentProject.findUnique({ where: { id: project.developmentProjectId } });
    if (!dev || dev.orgId !== user.orgId) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });

    const hierarchy = await taskService.getTaskHierarchy((req.params as any).id);
    return { items: hierarchy };
  });

  app.patch('/tasks/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const body = z
      .object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
        priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
        percentComplete: z.number().min(0).max(100).optional(),
        plannedStartDate: z.coerce.date().optional(),
        plannedEndDate: z.coerce.date().optional(),
        actualStartDate: z.coerce.date().optional(),
        actualEndDate: z.coerce.date().optional(),
        durationDays: z.number().int().positive().optional(),
        predecessorTaskIds: z.array(z.string().uuid()).optional(),
        lagDays: z.number().int().min(0).optional(),
        assignedToId: z.string().uuid().nullable().optional(),
        budgetAmount: z.number().positive().optional(),
        actualCost: z.number().optional(),
      })
      .parse(req.body);

    try {
      const task = await taskService.updateTask((req.params as any).id, { ...body, status: body.status as any, priority: body.priority as any });
      return task;
    } catch (e) {
      if (e instanceof ValidationError) return reply.status(400).send({ error: 'Validation', message: e.message });
      return reply.status(404).send({ error: 'TaskNotFound', message: 'Task not found' });
    }
  });

  app.patch('/tasks/:id/progress', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const body = z.object({ percentComplete: z.number().min(0).max(100) }).parse(req.body);
    try {
      const task = await taskService.updateTaskProgress((req.params as any).id, body.percentComplete);
      return task;
    } catch (e) {
      if (e instanceof ValidationError) return reply.status(400).send({ error: 'Validation', message: e.message });
      return reply.status(404).send({ error: 'TaskNotFound', message: 'Task not found' });
    }
  });

  // ========== Daily Logs (Prompt 4) ==========

  app.post('/projects/:id/daily-logs', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const project = await projectService.getProject((req.params as any).id);
    if (!project) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });
    const dev = await prisma.developmentProject.findUnique({ where: { id: project.developmentProjectId } });
    if (!dev || dev.orgId !== user.orgId) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });

    const body = z
      .object({
        logDate: z.coerce.date(),
        weather: z
          .enum(['CLEAR', 'CLOUDY', 'RAIN', 'SNOW', 'WIND', 'EXTREME_HEAT', 'EXTREME_COLD', 'OTHER'])
          .optional(),
        temperature: z.number().min(-50).max(150).optional(),
        laborCount: z
          .array(
            z.object({
              trade: z.string(),
              count: z.number().int().positive(),
            })
          )
          .optional(),
        equipmentUsed: z.array(z.string()).optional(),
        materialsDelivered: z.string().optional(),
        workCompleted: z.string().optional(),
        issuesDelays: z.string().optional(),
        visitorLog: z.string().optional(),
        safetyObservations: z.string().optional(),
      })
      .parse(req.body);

    try {
      const log = await dailyLogService.createDailyLog((req.params as any).id, user.userId, body);
      await notificationService.notifyDailyLogCreated((req.params as any).id, log.id, false);
      return reply.status(201).send(log);
    } catch (e) {
      if (e instanceof ValidationError || e instanceof ProjectNotFoundError) {
        return reply.status(400).send({ error: e.name, message: e.message });
      }
      throw e;
    }
  });

  app.get('/projects/:id/daily-logs', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const project = await projectService.getProject((req.params as any).id);
    if (!project) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });
    const dev = await prisma.developmentProject.findUnique({ where: { id: project.developmentProjectId } });
    if (!dev || dev.orgId !== user.orgId) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });

    const q = (req.query as any) || {};
    const dateRange =
      q.startDate && q.endDate
        ? { startDate: new Date(q.startDate), endDate: new Date(q.endDate) }
        : undefined;

    try {
      const logs = await dailyLogService.getDailyLogs((req.params as any).id, dateRange);
      return { items: logs };
    } catch (e) {
      if (e instanceof ProjectNotFoundError) return reply.status(404).send({ error: 'ProjectNotFound', message: e.message });
      throw e;
    }
  });

  app.get('/projects/:id/progress-photos', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const project = await projectService.getProject((req.params as any).id);
    if (!project) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });
    const dev = await prisma.developmentProject.findUnique({ where: { id: project.developmentProjectId } });
    if (!dev || dev.orgId !== user.orgId) return reply.status(404).send({ error: 'ProjectNotFound', message: 'Project not found' });

    try {
      const photos = await dailyLogService.getProgressPhotos((req.params as any).id);
      return { items: photos };
    } catch (e) {
      if (e instanceof ProjectNotFoundError) return reply.status(404).send({ error: 'ProjectNotFound', message: e.message });
      throw e;
    }
  });

  // Photo upload endpoint - requires @fastify/multipart and sharp packages
  // Commented out for minimal build
  /*
  app.post('/daily-logs/:id/photos', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const data = await req.file();
    if (!data) {
      return reply.status(400).send({ error: 'Validation', message: 'No file uploaded' });
    }

    const log = await prisma.dailyLog.findUnique({
      where: { id: (req.params as any).id },
      include: { project: { include: { developmentProject: true } } },
    });
    if (!log) return reply.status(404).send({ error: 'DailyLogNotFound', message: 'Daily log not found' });
    const dev = log.project.developmentProject;
    if (!dev || dev.orgId !== user.orgId) {
      return reply.status(404).send({ error: 'DailyLogNotFound', message: 'Daily log not found' });
    }

    try {
      const buffer = await data.toBuffer();
      const photos = [
        {
          filename: data.filename || 'photo.jpg',
          buffer,
          contentType: data.mimetype || 'image/jpeg',
        },
      ];

      const photoUrls = await dailyLogService.uploadProgressPhotos((req.params as any).id, photos);
      await notificationService.notifyDailyLogCreated(log.projectId, (req.params as any).id, true);
      return { photoUrls };
    } catch (e) {
      if (e instanceof ValidationError) return reply.status(400).send({ error: 'Validation', message: e.message });
      throw e;
    }
  });
  */

  app.patch('/daily-logs/:id/work-completed', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const body = z.object({ workCompleted: z.string().min(1) }).parse(req.body);
    try {
      const log = await dailyLogService.updateWorkCompleted((req.params as any).id, body.workCompleted);
      return log;
    } catch (e) {
      if (e instanceof ValidationError) return reply.status(400).send({ error: 'Validation', message: e.message });
      return reply.status(404).send({ error: 'DailyLogNotFound', message: 'Daily log not found' });
    }
  });

  // ========== Bank Account Management (Prompt 6) ==========
  // Bank account endpoints disabled pending service refactor
  /*
  app.post('/bank-accounts', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const body = z
      .object({
        accountType: z.enum(['CHECKING', 'SAVINGS']),
        accountHolderName: z.string().min(1),
        routingNumber: z.string().regex(/^\d{9}$/),
        accountNumber: z.string().min(4).max(17),
      })
      .parse(req.body);

    try {
      const account = await bankAccountService.addBankAccount(user.userId, body);
      return reply.status(201).send(account);
    } catch (e) {
      if (e instanceof ValidationError) return reply.status(400).send({ error: 'Validation', message: e.message });
      throw e;
    }
  });
  */

  // TODO: Implement Plaid account linking
  /*
  app.post('/bank-accounts/link-plaid', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const body = z
      .object({
        publicToken: z.string().min(1),
        accountId: z.string().optional(),
      })
      .parse(req.body);

    try {
      const account = await bankAccountService.verifyWithPlaid(user.userId, body.publicToken, body.accountId);
      return reply.status(201).send(account);
    } catch (e) {
      if (e instanceof ValidationError) return reply.status(400).send({ error: 'Validation', message: e.message });
      throw e;
    }
  });
  */

  // TODO: Implement micro-deposit initiation
  /*
  app.post('/bank-accounts/:id/initiate-micro-deposits', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    try {
      const result = await bankAccountService.initiateMicroDeposits((req.params as any).id);
      return result;
    } catch (e) {
      if (e instanceof ValidationError) return reply.status(400).send({ error: 'Validation', message: e.message });
      return reply.status(404).send({ error: 'BankAccountNotFound', message: 'Bank account not found' });
    }
  });
  */

  // TODO: Implement micro-deposit verification
  /*
  app.post('/bank-accounts/:id/verify-micro-deposits', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const body = z
      .object({
        amount1: z.number().positive().max(1),
        amount2: z.number().positive().max(1),
      })
      .parse(req.body);

    try {
      const account = await bankAccountService.verifyMicroDeposits((req.params as any).id, body);
      return account;
    } catch (e) {
      if (e instanceof ValidationError) return reply.status(400).send({ error: 'Validation', message: e.message });
      return reply.status(404).send({ error: 'BankAccountNotFound', message: 'Bank account not found' });
    }
  });
  */

  // Bank account get/set-default/delete endpoints disabled pending service refactor
  /*
  app.get('/bank-accounts', { preHandler: [requireAuth] }, async (req) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    const accounts = await bankAccountService.getBankAccounts(user.userId);
    return { items: accounts };
  });

  app.patch('/bank-accounts/:id/set-default', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    try {
      const account = await bankAccountService.setDefaultAccount((req.params as any).id, user.userId);
      return account;
    } catch (e) {
      if (e instanceof ValidationError) return reply.status(400).send({ error: 'Validation', message: e.message });
      return reply.status(404).send({ error: 'BankAccountNotFound', message: 'Bank account not found' });
    }
  });
  */
  /*
  app.delete('/bank-accounts/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const user = (req as any).user as { userId: string; orgId: string };
    if (!user) throw new Error('User not authenticated');

    try {
      const account = await bankAccountService.removeAccount((req.params as any).id, user.userId);
      return account;
    } catch (e) {
      if (e instanceof ValidationError) return reply.status(400).send({ error: 'Validation', message: e.message });
      return reply.status(404).send({ error: 'BankAccountNotFound', message: 'Bank account not found' });
    }
  });
  */

  // ==========================================================================
  // AUTHENTICATION ROUTES
  // ==========================================================================
  
  // Register authentication routes (register, login, password reset, etc.)
  await authRoutes(app);

  // ==========================================================================
  // FINANCE & TRUST MODULE ROUTES
  // ==========================================================================

  // Register all transaction routes
  // await transactionRoutes(app); // TODO: Create transactions routes

  // Register banking routes
  // await bankingRoutes(app); // TODO: Refactor banking services

  // Register escrow routes
  // await escrowRoutes(app); // TODO: Refactor escrow services

  // Register compliance routes
  // await complianceRoutes(app); // TODO: Refactor compliance services

  // ==========================================================================
  // CONSTRUCTION PROJECT MANAGEMENT (OS-PM MODULE)
  // ==========================================================================

  // Register construction management routes (projects, tasks, daily logs, RFIs, etc.)
  await constructionRoutes(app);
}
