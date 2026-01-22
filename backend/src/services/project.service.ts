/**
 * Project Management Service
 * 
 * Handles construction project lifecycle management including:
 * - Project creation from development projects
 * - Progress tracking and schedule variance calculation
 * - Project metrics and dashboard data
 * - Project archiving (soft delete)
 * 
 * Integrates with compliance checks and audit logging.
 * 
 * @module services/project
 */

import type { PrismaClient, Project, ProjectPhase } from '@prisma/client';
import { ProjectNotFoundError, ValidationError, ComplianceError } from './errors.js';
import { runComplianceChecks } from './compliance.js';
import { emit } from './events.js';

/**
 * Data transfer object for creating a new construction project.
 */
export interface CreateProjectDTO {
  plannedStartDate: Date;
  plannedEndDate: Date;
  totalBudget?: number;
  phase?: ProjectPhase;
}

/**
 * Service for managing construction projects.
 * 
 * Provides full project lifecycle management with compliance checks,
 * audit logging, and event emission for notifications.
 */
export class ProjectService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Generate unique project code (RC-YYYY-NNN format).
   */
  private async generateProjectCode(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `RC-${year}-`;
    const last = await this.prisma.project.findFirst({
      where: { projectCode: { startsWith: prefix } },
      orderBy: { projectCode: 'desc' },
    });
    const nextNum = last
      ? parseInt(last.projectCode.replace(prefix, ''), 10) + 1
      : 1;
    return `${prefix}${String(nextNum).padStart(3, '0')}`;
  }

  /**
   * Create a new construction project from a development project.
   * 
   * Validates:
   * - Development project exists
   * - Offering is funded (if linked)
   * - Date ranges are valid (end > start)
   * - Compliance checks pass
   * 
   * Generates unique project code (RC-YYYY-NNN format).
   * Creates audit log entry and emits 'project.created' event.
   * 
   * @param developmentProjectId - Development project ID
   * @param data - Project creation data
   * @returns Promise resolving to created project
   * @throws {ValidationError} if validation fails
   * @throws {ComplianceError} if compliance checks fail
   * 
   * @example
   * ```typescript
   * const project = await projectService.createProject(devProjectId, {
   *   plannedStartDate: new Date('2025-01-01'),
   *   plannedEndDate: new Date('2025-12-31'),
   *   totalBudget: 5000000,
   *   phase: 'PRE_CONSTRUCTION'
   * });
   * ```
   */
  async createProject(
    developmentProjectId: string,
    data: CreateProjectDTO
  ): Promise<Project> {
    const compliance = await runComplianceChecks({ developmentProjectId, ...data });
    if (!compliance.approved) {
      throw new ComplianceError(
        compliance.reason || 'Compliance check failed',
        'PROJECT_CREATION',
        compliance.checks
      );
    }

    const devProject = await this.prisma.developmentProject.findUnique({
      where: { id: developmentProjectId },
      include: { offering: true },
    });

    if (!devProject) {
      throw new ValidationError('Development project not found');
    }

    if (devProject.offering && devProject.offering.status !== 'funded') {
      throw new ValidationError('Offering must be funded to create construction project');
    }

    if (data.plannedEndDate <= data.plannedStartDate) {
      throw new ValidationError('plannedEndDate must be after plannedStartDate');
    }

    const projectCode = await this.generateProjectCode();

    const project = await this.prisma.$transaction(async (tx) => {
      const p = await tx.project.create({
        data: {
          projectCode,
          developmentProjectId,
          plannedStartDate: data.plannedStartDate,
          plannedEndDate: data.plannedEndDate,
          totalBudget: data.totalBudget ?? null,
          phase: (data.phase as ProjectPhase) ?? 'PRE_CONSTRUCTION',
          percentComplete: 0,
        },
      });

      await tx.auditEvent.create({
        data: {
          action: 'PROJECT_CREATED',
          entityType: 'Project',
          entityId: p.id,
          metadata: { developmentProjectId, projectCode, ...data },
        },
      });

      return p;
    });

    await emit('project.created', { projectId: project.id, developmentProjectId });
    return project;
  }

  /**
   * Get project with all relations.
   */
  async getProject(id: string) {
    const p = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
      include: {
        developmentProject: true,
        tasks: { where: { deletedAt: null } },
        milestones: true,
        dailyLogs: true,
      },
    });
    return p;
  }

  /**
   * Update overall progress % (cascade from tasks handled elsewhere).
   */
  async updateProgress(id: string, percentComplete: number): Promise<Project> {
    if (percentComplete < 0 || percentComplete > 100) {
      throw new ValidationError('percentComplete must be 0–100');
    }

    const existing = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new ProjectNotFoundError(id);

    const project = await this.prisma.$transaction(async (tx) => {
      const p = await tx.project.update({
        where: { id },
        data: { percentComplete, updatedAt: new Date() },
      });
      await tx.auditEvent.create({
        data: {
          action: 'PROJECT_PROGRESS_UPDATED',
          entityType: 'Project',
          entityId: id,
          metadata: { percentComplete, previous: existing.percentComplete },
        },
      });
      return p;
    });

    await emit('project.progressUpdated', { projectId: id, percentComplete });
    return project;
  }

  /**
   * Calculate schedule variance for a project.
   * 
   * Compares actual end date (or current date if not completed)
   * against planned end date.
   * 
   * @param id - Project ID
   * @returns Promise resolving to variance in days:
   *   - Positive = ahead of schedule
   *   - Negative = behind schedule
   *   - Zero = on schedule
   * @throws {ProjectNotFoundError} if project doesn't exist
   * 
   * @example
   * ```typescript
   * const variance = await projectService.calculateScheduleVariance(projectId);
   * if (variance < 0) {
   *   console.log(`Project is ${Math.abs(variance)} days behind schedule`);
   * }
   * ```
   */
  async calculateScheduleVariance(id: string): Promise<number> {
    const p = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
    });
    if (!p) throw new ProjectNotFoundError(id);

    const referenceEnd = p.actualEndDate ?? new Date();
    const plannedEnd = p.plannedEndDate;
    if (!plannedEnd) return 0;

    const ms = plannedEnd.getTime() - referenceEnd.getTime();
    const days = Math.round(ms / (1000 * 60 * 60 * 24));
    return days; // positive = ahead, negative = behind
  }

  /**
   * Get critical path task IDs for a project.
   * 
   * Delegates to TaskService.calculateCriticalPath() which performs
   * full critical path analysis (forward/backward pass, float calculation).
   * This method returns a simplified list of critical task IDs.
   * 
   * For full critical path details (schedule, float, etc.), use TaskService directly.
   * 
   * @param id - Project ID
   * @returns Promise resolving to array of critical task IDs
   * @throws {ProjectNotFoundError} if project doesn't exist
   */
  async getCriticalPath(id: string): Promise<string[]> {
    const p = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
      include: { tasks: { where: { deletedAt: null, isCriticalPath: true } } },
    });
    if (!p) throw new ProjectNotFoundError(id);
    return p.tasks.map((t) => t.id);
  }

  /**
   * Get comprehensive project metrics for dashboard display.
   * 
   * Returns:
   * - Budget: total, spent, remaining
   * - Schedule: planned dates, variance in days
   * - Progress: completion percentage
   * - Active tasks count
   * 
   * @param id - Project ID
   * @returns Promise resolving to project metrics object
   * @throws {ProjectNotFoundError} if project doesn't exist
   * 
   * @example
   * ```typescript
   * const metrics = await projectService.getProjectMetrics(projectId);
   * console.log(`Progress: ${metrics.progress}%`);
   * console.log(`Budget: $${metrics.budget.spent} / $${metrics.budget.total}`);
   * console.log(`Schedule: ${metrics.schedule.varianceDays} days variance`);
   * ```
   */
  async getProjectMetrics(id: string): Promise<{
    budget: { total: number | null; spent: number; remaining: number | null };
    schedule: { plannedStart: Date | null; plannedEnd: Date | null; varianceDays: number };
    progress: number;
    activeTasksCount: number;
  }> {
    const p = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
      include: {
        tasks: {
          where: {
            deletedAt: null,
            status: { in: ['NOT_STARTED', 'IN_PROGRESS', 'ON_HOLD'] },
          },
        },
      },
    });
    if (!p) throw new ProjectNotFoundError(id);

    const varianceDays = await this.calculateScheduleVariance(id);
    const total = p.totalBudget ?? 0;
    const spent = p.spentToDate ?? 0;
    const remaining = p.totalBudget != null ? Math.max(0, total - spent) : null;

    return {
      budget: {
        total: p.totalBudget,
        spent,
        remaining,
      },
      schedule: {
        plannedStart: p.plannedStartDate,
        plannedEnd: p.plannedEndDate,
        varianceDays,
      },
      progress: p.percentComplete,
      activeTasksCount: p.tasks.length,
    };
  }

  /**
   * Soft delete (archive) project.
   */
  async archiveProject(id: string): Promise<Project> {
    const existing = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new ProjectNotFoundError(id);

    const project = await this.prisma.$transaction(async (tx) => {
      const p = await tx.project.update({
        where: { id },
        data: { deletedAt: new Date(), updatedAt: new Date() },
      });
      await tx.auditEvent.create({
        data: {
          action: 'PROJECT_ARCHIVED',
          entityType: 'Project',
          entityId: id,
        },
      });
      return p;
    });

    await emit('project.archived', { projectId: id });
    return project;
  }
}

