import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { requireAuth } from '../../middlewares/auth.js';
import { ValidationError } from '../../services/errors.js';
import { ProjectPhase, TaskStatus, TaskPriority, RfiStatus, SubmittalStatus, InspectionStatus } from '@prisma/client';

export async function constructionRoutes(app: FastifyInstance) {
  // =============================================================================
  // CONSTRUCTION PROJECTS
  // =============================================================================

  /**
   * GET /v1/construction/projects
   * List all construction projects for the organization
   */
  app.get('/construction/projects', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;

    const projects = await prisma.project.findMany({
      where: {
        developmentProject: {
          orgId: orgId,
        },
        deletedAt: null,
      },
      include: {
        developmentProject: {
          include: {
            offering: true,
          },
        },
        tasks: {
          where: { deletedAt: null },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        milestones: {
          take: 3,
          orderBy: { targetDate: 'asc' },
        },
        _count: {
          select: {
            tasks: true,
            dailyLogs: true,
            rfis: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { projects };
  });

  /**
   * POST /v1/construction/projects
   * Create a new construction project
   */
  app.post('/construction/projects', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;

    const body = z
      .object({
        developmentProjectId: z.string().uuid(),
        plannedStartDate: z.string().datetime().optional(),
        plannedEndDate: z.string().datetime().optional(),
        totalBudget: z.number().positive().optional(),
      })
      .parse(req.body);

    // Verify development project exists and belongs to org
    const devProject = await prisma.developmentProject.findFirst({
      where: {
        id: body.developmentProjectId,
        orgId: orgId,
      },
    });

    if (!devProject) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Development project not found',
        },
      });
    }

    // Check if project already exists
    const existing = await prisma.project.findFirst({
      where: { developmentProjectId: body.developmentProjectId },
    });

    if (existing) {
      return reply.status(400).send({
        error: {
          code: 'ALREADY_EXISTS',
          message: 'Construction project already exists for this development',
        },
      });
    }

    // Generate project code (RC-YYYY-NNN)
    const year = new Date().getFullYear();
    const count = await prisma.project.count({
      where: {
        projectCode: {
          startsWith: `RC-${year}-`,
        },
      },
    });
    const projectCode = `RC-${year}-${String(count + 1).padStart(3, '0')}`;

    const project = await prisma.project.create({
      data: {
        projectCode,
        developmentProjectId: body.developmentProjectId,
        phase: ProjectPhase.PRE_CONSTRUCTION,
        plannedStartDate: body.plannedStartDate ? new Date(body.plannedStartDate) : null,
        plannedEndDate: body.plannedEndDate ? new Date(body.plannedEndDate) : null,
        totalBudget: body.totalBudget,
      },
      include: {
        developmentProject: {
          include: {
            offering: true,
          },
        },
      },
    });

    return reply.status(201).send({ project });
  });

  /**
   * GET /v1/construction/projects/:id
   * Get detailed project information
   */
  app.get('/construction/projects/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

    const project = await prisma.project.findFirst({
      where: {
        id,
        developmentProject: { orgId },
        deletedAt: null,
      },
      include: {
        developmentProject: {
          include: {
            offering: true,
          },
        },
        tasks: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        milestones: {
          orderBy: { targetDate: 'asc' },
        },
        dailyLogs: {
          orderBy: { logDate: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            tasks: true,
            dailyLogs: true,
            rfis: true,
            submittals: true,
            inspections: true,
            safetyIncidents: true,
          },
        },
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    return { project };
  });

  /**
   * PATCH /v1/construction/projects/:id
   * Update construction project
   */
  app.patch('/construction/projects/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

    const body = z
      .object({
        phase: z.nativeEnum(ProjectPhase).optional(),
        percentComplete: z.number().min(0).max(100).optional(),
        plannedStartDate: z.string().datetime().optional(),
        plannedEndDate: z.string().datetime().optional(),
        actualStartDate: z.string().datetime().optional(),
        actualEndDate: z.string().datetime().optional(),
        totalBudget: z.number().positive().optional(),
        spentToDate: z.number().min(0).optional(),
      })
      .parse(req.body);

    // Verify project exists and belongs to org
    const existing = await prisma.project.findFirst({
      where: {
        id,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!existing) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(body.phase && { phase: body.phase }),
        ...(body.percentComplete !== undefined && { percentComplete: body.percentComplete }),
        ...(body.plannedStartDate && { plannedStartDate: new Date(body.plannedStartDate) }),
        ...(body.plannedEndDate && { plannedEndDate: new Date(body.plannedEndDate) }),
        ...(body.actualStartDate && { actualStartDate: new Date(body.actualStartDate) }),
        ...(body.actualEndDate && { actualEndDate: new Date(body.actualEndDate) }),
        ...(body.totalBudget && { totalBudget: body.totalBudget }),
        ...(body.spentToDate !== undefined && { spentToDate: body.spentToDate }),
      },
      include: {
        developmentProject: {
          include: {
            offering: true,
          },
        },
      },
    });

    return { project };
  });

  // =============================================================================
  // TASKS
  // =============================================================================

  /**
   * GET /v1/construction/projects/:projectId/tasks
   * List all tasks for a project
   */
  app.get('/construction/projects/:projectId/tasks', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        deletedAt: null,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
          },
        },
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
        children: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return { tasks };
  });

  /**
   * POST /v1/construction/projects/:projectId/tasks
   * Create a new task
   */
  app.post('/construction/projects/:projectId/tasks', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);

    const body = z
      .object({
        title: z.string().min(1),
        description: z.string().optional(),
        parentId: z.string().uuid().optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        priority: z.nativeEnum(TaskPriority).optional(),
        plannedStartDate: z.string().datetime().optional(),
        plannedEndDate: z.string().datetime().optional(),
        durationDays: z.number().int().positive().optional(),
        predecessorTaskIds: z.array(z.string().uuid()).optional(),
        budgetAmount: z.number().positive().optional(),
        assignedToId: z.string().uuid().optional(),
      })
      .parse(req.body);

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title: body.title,
        description: body.description,
        parentId: body.parentId,
        status: body.status || TaskStatus.NOT_STARTED,
        priority: body.priority || TaskPriority.MEDIUM,
        plannedStartDate: body.plannedStartDate ? new Date(body.plannedStartDate) : null,
        plannedEndDate: body.plannedEndDate ? new Date(body.plannedEndDate) : null,
        durationDays: body.durationDays,
        predecessorTaskIds: body.predecessorTaskIds || [],
        budgetAmount: body.budgetAmount,
        assignedToId: body.assignedToId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return reply.status(201).send({ task });
  });

  /**
   * PATCH /v1/construction/tasks/:id
   * Update a task
   */
  app.patch('/construction/tasks/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

    const body = z
      .object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z.nativeEnum(TaskStatus).optional(),
        priority: z.nativeEnum(TaskPriority).optional(),
        percentComplete: z.number().min(0).max(100).optional(),
        plannedStartDate: z.string().datetime().optional(),
        plannedEndDate: z.string().datetime().optional(),
        actualStartDate: z.string().datetime().optional(),
        actualEndDate: z.string().datetime().optional(),
        budgetAmount: z.number().positive().optional(),
        actualCost: z.number().min(0).optional(),
        assignedToId: z.string().uuid().optional(),
      })
      .parse(req.body);

    // Verify task exists and user has access
    const existing = await prisma.task.findFirst({
      where: {
        id,
        project: {
          developmentProject: { orgId },
        },
        deletedAt: null,
      },
    });

    if (!existing) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Task not found',
        },
      });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status && { status: body.status }),
        ...(body.priority && { priority: body.priority }),
        ...(body.percentComplete !== undefined && { percentComplete: body.percentComplete }),
        ...(body.plannedStartDate && { plannedStartDate: new Date(body.plannedStartDate) }),
        ...(body.plannedEndDate && { plannedEndDate: new Date(body.plannedEndDate) }),
        ...(body.actualStartDate && { actualStartDate: new Date(body.actualStartDate) }),
        ...(body.actualEndDate && { actualEndDate: new Date(body.actualEndDate) }),
        ...(body.budgetAmount && { budgetAmount: body.budgetAmount }),
        ...(body.actualCost !== undefined && { actualCost: body.actualCost }),
        ...(body.assignedToId !== undefined && { assignedToId: body.assignedToId }),
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return { task };
  });

  // =============================================================================
  // DAILY LOGS
  // =============================================================================

  /**
   * GET /v1/construction/projects/:projectId/daily-logs
   * List daily logs for a project
   */
  app.get('/construction/projects/:projectId/daily-logs', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const dailyLogs = await prisma.dailyLog.findMany({
      where: { projectId },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { logDate: 'desc' },
      take: 30,
    });

    return { dailyLogs };
  });

  /**
   * POST /v1/construction/projects/:projectId/daily-logs
   * Create a daily log entry
   */
  app.post('/construction/projects/:projectId/daily-logs', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);

    const body = z
      .object({
        logDate: z.string().datetime(),
        weather: z.enum(['CLEAR', 'CLOUDY', 'RAIN', 'SNOW', 'WIND', 'EXTREME_HEAT', 'EXTREME_COLD', 'OTHER']).optional(),
        temperature: z.number().optional(),
        laborCount: z.any().optional(), // JSON object
        equipmentUsed: z.array(z.string()).optional(),
        materialsDelivered: z.string().optional(),
        workCompleted: z.string().optional(),
        issuesDelays: z.string().optional(),
        visitorLog: z.string().optional(),
        safetyObservations: z.string().optional(),
        photoUrls: z.array(z.string().url()).optional(),
      })
      .parse(req.body);

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const dailyLog = await prisma.dailyLog.create({
      data: {
        projectId,
        logDate: new Date(body.logDate),
        weather: body.weather as any,
        temperature: body.temperature,
        laborCount: body.laborCount,
        equipmentUsed: body.equipmentUsed || [],
        materialsDelivered: body.materialsDelivered,
        workCompleted: body.workCompleted,
        issuesDelays: body.issuesDelays,
        visitorLog: body.visitorLog,
        safetyObservations: body.safetyObservations,
        createdById: userId,
        photoUrls: body.photoUrls || [],
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return reply.status(201).send({ dailyLog });
  });

  // =============================================================================
  // RFIs (Requests for Information)
  // =============================================================================

  /**
   * GET /v1/construction/projects/:projectId/rfis
   * List RFIs for a project
   */
  app.get('/construction/projects/:projectId/rfis', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const rfis = await prisma.rfi.findMany({
      where: { projectId },
      include: {
        respondedBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { rfis };
  });

  /**
   * POST /v1/construction/projects/:projectId/rfis
   * Create a new RFI
   */
  app.post('/construction/projects/:projectId/rfis', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);

    const body = z
      .object({
        subject: z.string().min(1),
        description: z.string().min(1),
        dueDate: z.string().datetime().optional(),
        attachmentUrls: z.array(z.string().url()).optional(),
      })
      .parse(req.body);

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    // Generate RFI number
    const count = await prisma.rfi.count({ where: { projectId } });
    const rfiNumber = `RFI-${String(count + 1).padStart(3, '0')}`;

    const rfi = await prisma.rfi.create({
      data: {
        projectId,
        rfiNumber,
        subject: body.subject,
        description: body.description,
        status: RfiStatus.OPEN,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        attachmentUrls: body.attachmentUrls || [],
      },
    });

    return reply.status(201).send({ rfi });
  });

  /**
   * PATCH /v1/construction/rfis/:id
   * Update/respond to an RFI
   */
  app.patch('/construction/rfis/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

    const body = z
      .object({
        status: z.nativeEnum(RfiStatus).optional(),
        response: z.string().optional(),
      })
      .parse(req.body);

    // Verify RFI exists and user has access
    const existing = await prisma.rfi.findFirst({
      where: {
        id,
        project: {
          developmentProject: { orgId },
        },
      },
    });

    if (!existing) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'RFI not found',
        },
      });
    }

    const rfi = await prisma.rfi.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.response && {
          response: body.response,
          respondedById: userId,
          respondedAt: new Date(),
        }),
      },
      include: {
        respondedBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return { rfi };
  });

  // =============================================================================
  // SUBMITTALS
  // =============================================================================

  /**
   * GET /v1/construction/projects/:projectId/submittals
   * List submittals for a project
   */
  app.get('/construction/projects/:projectId/submittals', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const submittals = await prisma.submittal.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return { submittals };
  });

  /**
   * POST /v1/construction/projects/:projectId/submittals
   * Create a new submittal
   */
  app.post('/construction/projects/:projectId/submittals', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);

    const body = z
      .object({
        name: z.string().min(1),
        description: z.string().optional(),
        specSection: z.string().optional(),
        attachmentUrls: z.array(z.string().url()).optional(),
      })
      .parse(req.body);

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    // Generate submittal number
    const count = await prisma.submittal.count({ where: { projectId } });
    const submittalNumber = `SUB-${String(count + 1).padStart(3, '0')}`;

    const submittal = await prisma.submittal.create({
      data: {
        projectId,
        submittalNumber,
        name: body.name,
        description: body.description,
        specSection: body.specSection,
        status: SubmittalStatus.DRAFT,
        attachmentUrls: body.attachmentUrls || [],
      },
    });

    return reply.status(201).send({ submittal });
  });

  /**
   * PATCH /v1/construction/submittals/:id
   * Update/review a submittal
   */
  app.patch('/construction/submittals/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

    const body = z
      .object({
        status: z.nativeEnum(SubmittalStatus).optional(),
        reviewerNotes: z.string().optional(),
      })
      .parse(req.body);

    // Verify submittal exists and user has access
    const existing = await prisma.submittal.findFirst({
      where: {
        id,
        project: {
          developmentProject: { orgId },
        },
      },
    });

    if (!existing) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Submittal not found',
        },
      });
    }

    const submittal = await prisma.submittal.update({
      where: { id },
      data: {
        ...(body.status && {
          status: body.status,
          ...(body.status === SubmittalStatus.SUBMITTED && { submittedAt: new Date() }),
          ...(body.status !== SubmittalStatus.DRAFT && body.status !== SubmittalStatus.SUBMITTED && {
            reviewedAt: new Date(),
          }),
        }),
        ...(body.reviewerNotes && { reviewerNotes: body.reviewerNotes }),
      },
    });

    return { submittal };
  });

  // =============================================================================
  // INSPECTIONS
  // =============================================================================

  /**
   * GET /v1/construction/projects/:projectId/inspections
   * List inspections for a project
   */
  app.get('/construction/projects/:projectId/inspections', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const inspections = await prisma.inspection.findMany({
      where: { projectId },
      include: {
        leadInspector: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { scheduledDate: 'desc' },
    });

    return { inspections };
  });

  /**
   * POST /v1/construction/projects/:projectId/inspections
   * Create a new inspection
   */
  app.post('/construction/projects/:projectId/inspections', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);

    const body = z
      .object({
        inspectionType: z.string().min(1),
        scheduledDate: z.string().datetime(),
        leadInspectorId: z.string().uuid().optional(),
      })
      .parse(req.body);

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const inspection = await prisma.inspection.create({
      data: {
        projectId,
        inspectionType: body.inspectionType,
        scheduledDate: new Date(body.scheduledDate),
        status: InspectionStatus.SCHEDULED,
        leadInspectorId: body.leadInspectorId,
      },
      include: {
        leadInspector: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return reply.status(201).send({ inspection });
  });

  /**
   * PATCH /v1/construction/inspections/:id
   * Update inspection results
   */
  app.patch('/construction/inspections/:id', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

    const body = z
      .object({
        status: z.nativeEnum(InspectionStatus).optional(),
        result: z.enum(['PASSED', 'FAILED', 'DEFERRED']).optional(),
        notes: z.string().optional(),
        photoUrls: z.array(z.string().url()).optional(),
        completedDate: z.string().datetime().optional(),
      })
      .parse(req.body);

    // Verify inspection exists and user has access
    const existing = await prisma.inspection.findFirst({
      where: {
        id,
        project: {
          developmentProject: { orgId },
        },
      },
    });

    if (!existing) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Inspection not found',
        },
      });
    }

    const inspection = await prisma.inspection.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.result && { result: body.result }),
        ...(body.notes && { notes: body.notes }),
        ...(body.photoUrls && { photoUrls: body.photoUrls }),
        ...(body.completedDate && { completedDate: new Date(body.completedDate) }),
      },
      include: {
        leadInspector: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return { inspection };
  });

  // =============================================================================
  // SAFETY INCIDENTS
  // =============================================================================

  /**
   * GET /v1/construction/projects/:projectId/safety-incidents
   * List safety incidents for a project
   */
  app.get('/construction/projects/:projectId/safety-incidents', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const safetyIncidents = await prisma.safetyIncident.findMany({
      where: { projectId },
      orderBy: { incidentDate: 'desc' },
    });

    return { safetyIncidents };
  });

  /**
   * POST /v1/construction/projects/:projectId/safety-incidents
   * Report a safety incident
   */
  app.post('/construction/projects/:projectId/safety-incidents', { preHandler: [requireAuth] }, async (req, reply) => {
    const { userId, orgId } = (req as any).user;
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);

    const body = z
      .object({
        incidentType: z.string().min(1),
        description: z.string().min(1),
        incidentDate: z.string().datetime(),
        location: z.string().optional(),
        oshaReportable: z.boolean().optional(),
        correctiveActions: z.string().optional(),
        photoUrls: z.array(z.string().url()).optional(),
      })
      .parse(req.body);

    // Verify project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        developmentProject: { orgId },
        deletedAt: null,
      },
    });

    if (!project) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: 'Project not found',
        },
      });
    }

    const safetyIncident = await prisma.safetyIncident.create({
      data: {
        projectId,
        incidentType: body.incidentType,
        description: body.description,
        incidentDate: new Date(body.incidentDate),
        location: body.location,
        oshaReportable: body.oshaReportable || false,
        correctiveActions: body.correctiveActions,
        photoUrls: body.photoUrls || [],
      },
    });

    return reply.status(201).send({ safetyIncident });
  });
}
