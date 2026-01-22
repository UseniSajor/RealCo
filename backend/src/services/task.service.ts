/**
 * Task Management Service
 * 
 * Handles construction project task management with dependency tracking,
 * critical path calculation, and progress rollup.
 * 
 * Features:
 * - Task creation with dependency validation
 * - Circular dependency detection
 * - Critical path analysis (CPM algorithm)
 * - Progress rollup from tasks to parent tasks to project
 * - Task hierarchy management
 * 
 * @module services/task
 */

import type { PrismaClient, Task, TaskStatus, TaskPriority } from '@prisma/client';
import { ProjectNotFoundError, ValidationError } from './errors.js';
import { emit } from './events.js';

/**
 * Data transfer object for creating a new task.
 */
export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: TaskPriority;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  durationDays?: number;
  predecessorTaskIds?: string[];
  lagDays?: number;
  parentId?: string;
  assignedToId?: string;
  budgetAmount?: number;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  percentComplete?: number;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  durationDays?: number;
  predecessorTaskIds?: string[];
  lagDays?: number;
  assignedToId?: string | null;
  budgetAmount?: number;
  actualCost?: number;
}

export interface TaskFilters {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority;
  assignedToId?: string;
  parentId?: string | null; // null = root tasks only
}

interface TaskWithSchedule {
  id: string;
  title: string;
  durationDays: number;
  predecessorTaskIds: string[];
  lagDays: number;
  earliestStart?: number;
  earliestFinish?: number;
  latestStart?: number;
  latestFinish?: number;
  float?: number;
  isCriticalPath: boolean;
}

/**
 * Validate no circular dependencies. Uses DFS to detect cycles.
 */
function validateDependencies(
  taskId: string,
  predecessorIds: string[],
  allTasks: Map<string, { predecessorTaskIds: string[] }>
): void {
  const visited = new Set<string>();
  const stack = new Set<string>();

  function visit(id: string): boolean {
    if (stack.has(id)) return true; // cycle
    if (visited.has(id)) return false;
    visited.add(id);
    stack.add(id);
    const t = allTasks.get(id);
    for (const predId of t?.predecessorTaskIds ?? []) {
      if (visit(predId)) {
        stack.delete(id);
        return true;
      }
    }
    stack.delete(id);
    return false;
  }

  for (const predId of predecessorIds) {
    if (!allTasks.has(predId)) {
      throw new ValidationError(`Predecessor task not found: ${predId}`);
    }
    if (visit(predId)) {
      throw new ValidationError('Circular dependency detected');
    }
  }
  // Also check that adding this task doesn't create cycle (this -> pred -> ... -> this)
  const mock = new Map(allTasks);
  mock.set(taskId, { predecessorTaskIds: predecessorIds });
  visited.clear();
  stack.clear();
  if (visit(taskId)) {
    throw new ValidationError('Circular dependency detected');
  }
}

/**
 * Service for managing construction project tasks.
 * 
 * Provides full CRUD operations with dependency tracking,
 * critical path calculation, and automatic progress rollup.
 */
export class TaskService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new task for a project.
   * 
   * Validates:
   * - Project exists and is not deleted
   * - Date ranges are valid (end > start)
   * - Parent task exists (if provided)
   * - No circular dependencies in predecessor chain
   * 
   * @param projectId - Project ID
   * @param data - Task creation data
   * @returns Promise resolving to created task
   * @throws {ProjectNotFoundError} if project doesn't exist
   * @throws {ValidationError} if validation fails
   * 
   * @example
   * ```typescript
   * const task = await taskService.createTask(projectId, {
   *   title: 'Foundation Pour',
   *   priority: 'HIGH',
   *   plannedStartDate: new Date('2025-01-15'),
   *   plannedEndDate: new Date('2025-01-20'),
   *   predecessorTaskIds: [previousTaskId],
   *   lagDays: 2
   * });
   * ```
   */
  async createTask(projectId: string, data: CreateTaskDTO): Promise<Task> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
    });
    if (!project) throw new ProjectNotFoundError(projectId);

    if (data.plannedEndDate && data.plannedStartDate && data.plannedEndDate <= data.plannedStartDate) {
      throw new ValidationError('plannedEndDate must be after plannedStartDate');
    }

    const durationDays = data.durationDays ?? (data.plannedStartDate && data.plannedEndDate
      ? Math.ceil((data.plannedEndDate.getTime() - data.plannedStartDate.getTime()) / (1000 * 60 * 60 * 24))
      : null);

    const predecessorIds = data.predecessorTaskIds ?? [];
    if (predecessorIds.length) {
      const tasks = await this.prisma.task.findMany({
        where: { projectId, deletedAt: null },
        select: { id: true, predecessorTaskIds: true },
      });
      const map = new Map(tasks.map((t) => [t.id, { predecessorTaskIds: t.predecessorTaskIds }]));
      validateDependencies('__new__', predecessorIds, map);
    }

    if (data.parentId) {
      const parent = await this.prisma.task.findFirst({
        where: { id: data.parentId, projectId, deletedAt: null },
      });
      if (!parent) throw new ValidationError('Parent task not found');
    }

    const task = await this.prisma.task.create({
      data: {
        projectId,
        parentId: data.parentId ?? null,
        title: data.title,
        description: data.description ?? null,
        priority: data.priority ?? 'MEDIUM',
        plannedStartDate: data.plannedStartDate ?? null,
        plannedEndDate: data.plannedEndDate ?? null,
        durationDays: durationDays ?? null,
        predecessorTaskIds: predecessorIds,
        lagDays: data.lagDays ?? 0,
        assignedToId: data.assignedToId ?? null,
        budgetAmount: data.budgetAmount ?? null,
      },
    });

    await emit('task.created', { taskId: task.id, projectId });
    return task;
  }

  async updateTask(id: string, updates: UpdateTaskDTO): Promise<Task> {
    const existing = await this.prisma.task.findUnique({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new ValidationError('Task not found');

    const predecessorIds = updates.predecessorTaskIds ?? existing.predecessorTaskIds;
    if (predecessorIds.length && updates.predecessorTaskIds) {
      const tasks = await this.prisma.task.findMany({
        where: { projectId: existing.projectId, deletedAt: null },
        select: { id: true, predecessorTaskIds: true },
      });
      const map = new Map(tasks.map((t) => [t.id, { predecessorTaskIds: t.predecessorTaskIds }]));
      validateDependencies(id, predecessorIds, map);
    }

    if (updates.percentComplete != null && (updates.percentComplete < 0 || updates.percentComplete > 100)) {
      throw new ValidationError('percentComplete must be 0–100');
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...(updates.title != null && { title: updates.title }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.status != null && { status: updates.status }),
        ...(updates.priority != null && { priority: updates.priority }),
        ...(updates.percentComplete != null && { percentComplete: updates.percentComplete }),
        ...(updates.plannedStartDate !== undefined && { plannedStartDate: updates.plannedStartDate }),
        ...(updates.plannedEndDate !== undefined && { plannedEndDate: updates.plannedEndDate }),
        ...(updates.actualStartDate !== undefined && { actualStartDate: updates.actualStartDate }),
        ...(updates.actualEndDate !== undefined && { actualEndDate: updates.actualEndDate }),
        ...(updates.durationDays !== undefined && { durationDays: updates.durationDays }),
        ...(updates.predecessorTaskIds !== undefined && { predecessorTaskIds: updates.predecessorTaskIds }),
        ...(updates.lagDays !== undefined && { lagDays: updates.lagDays }),
        ...(updates.assignedToId !== undefined && { assignedToId: updates.assignedToId }),
        ...(updates.budgetAmount !== undefined && { budgetAmount: updates.budgetAmount }),
        ...(updates.actualCost !== undefined && { actualCost: updates.actualCost }),
        updatedAt: new Date(),
      },
    });

    if (updates.percentComplete != null) {
      await this.rollupProjectProgress(existing.projectId);
    }
    await emit('task.updated', { taskId: id, projectId: existing.projectId });
    return task;
  }

  async getTasks(projectId: string, filters?: TaskFilters) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
    });
    if (!project) throw new ProjectNotFoundError(projectId);

    const where: Record<string, unknown> = { projectId, deletedAt: null };
    if (filters?.status) {
      where.status = Array.isArray(filters.status) ? { in: filters.status } : filters.status;
    }
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.assignedToId) where.assignedToId = filters.assignedToId;
    if (filters?.parentId !== undefined) where.parentId = filters.parentId;

    const tasks = await this.prisma.task.findMany({
      where,
      include: { assignedTo: true, parent: true, children: true },
      orderBy: [{ priority: 'desc' }, { plannedStartDate: 'asc' }, { createdAt: 'asc' }],
    });
    return tasks;
  }

  /**
   * Calculate critical path for a project using CPM (Critical Path Method).
   * 
   * Algorithm:
   * 1. Topological sort of tasks by dependencies
   * 2. Forward pass: Calculate earliest start (ES) and earliest finish (EF)
   * 3. Backward pass: Calculate latest start (LS) and latest finish (LF)
   * 4. Float calculation: Float = LS - ES (slack time)
   * 5. Critical path: Tasks with zero float
   * 
   * Updates task.isCriticalPath flag in database.
   * 
   * @param projectId - Project ID
   * @returns Promise resolving to array of tasks with schedule data
   * @throws {ProjectNotFoundError} if project doesn't exist
   * 
   * @example
   * ```typescript
   * const criticalPath = await taskService.calculateCriticalPath(projectId);
   * const criticalTasks = criticalPath.filter(t => t.isCriticalPath);
   * console.log(`Project has ${criticalTasks.length} critical tasks`);
   * ```
   */
  async calculateCriticalPath(projectId: string): Promise<TaskWithSchedule[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
    });
    if (!project) throw new ProjectNotFoundError(projectId);

    const tasks = await this.prisma.task.findMany({
      where: { projectId, deletedAt: null },
      select: {
        id: true,
        title: true,
        durationDays: true,
        predecessorTaskIds: true,
        lagDays: true,
      },
    });

    type TaskRow = (typeof tasks)[0];
    const byId = new Map<string, TaskRow & { durationDays: number }>(
      tasks.map((t) => [t.id, { ...t, durationDays: t.durationDays ?? 1 }])
    );
    const ordered = topologicalSort(tasks, byId);

    // Forward pass: ES, EF
    const es = new Map<string, number>();
    const ef = new Map<string, number>();
    for (const t of ordered) {
      const duration = byId.get(t.id)!.durationDays;
      const preds = t.predecessorTaskIds;
      const start = preds.length
        ? Math.max(...preds.map((p) => (ef.get(p) ?? 0) + (byId.get(p)?.lagDays ?? 0)))
        : 0;
      es.set(t.id, start);
      ef.set(t.id, start + duration);
    }

    const projectEnd = Math.max(...Array.from(ef.values()), 0);

    // Backward pass: LS, LF
    const ls = new Map<string, number>();
    const lf = new Map<string, number>();
    for (let i = ordered.length - 1; i >= 0; i--) {
      const t = ordered[i]!;
      const duration = byId.get(t.id)!.durationDays;
      const successors = ordered.filter((o) => o.predecessorTaskIds.includes(t.id));
      const finish = successors.length
        ? Math.min(...successors.map((s) => (ls.get(s.id) ?? projectEnd) - (byId.get(s.id)?.lagDays ?? 0)))
        : projectEnd;
      lf.set(t.id, finish);
      ls.set(t.id, finish - duration);
    }

    const result: TaskWithSchedule[] = ordered.map((t) => {
      const row = byId.get(t.id)!;
      const duration = row.durationDays;
      const eStart = es.get(t.id) ?? 0;
      const eFinish = ef.get(t.id) ?? 0;
      const lStart = ls.get(t.id) ?? 0;
      const lFinish = lf.get(t.id) ?? 0;
      const float = Math.max(0, lStart - eStart);
      return {
        id: t.id,
        title: row.title,
        durationDays: duration,
        predecessorTaskIds: t.predecessorTaskIds,
        lagDays: row.lagDays,
        earliestStart: eStart,
        earliestFinish: eFinish,
        latestStart: lStart,
        latestFinish: lFinish,
        float,
        isCriticalPath: float === 0,
      };
    });

    const criticalIds = new Set(result.filter((r) => r.isCriticalPath).map((r) => r.id));
    await this.prisma.task.updateMany({
      where: { projectId, deletedAt: null },
      data: { isCriticalPath: false },
    });
    if (criticalIds.size) {
      await this.prisma.task.updateMany({
        where: { id: { in: Array.from(criticalIds) } },
        data: { isCriticalPath: true },
      });
    }

    return result;
  }

  async updateTaskProgress(id: string, percentComplete: number): Promise<Task> {
    if (percentComplete < 0 || percentComplete > 100) {
      throw new ValidationError('percentComplete must be 0–100');
    }
    const existing = await this.prisma.task.findUnique({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new ValidationError('Task not found');

    const task = await this.prisma.task.update({
      where: { id },
      data: { percentComplete, updatedAt: new Date() },
    });
    await this.rollupProjectProgress(existing.projectId);
    await emit('task.progressUpdated', { taskId: id, projectId: existing.projectId, percentComplete });
    return task;
  }

  /**
   * Roll up task progress to parent tasks and project.
   * 
   * Progress calculation:
   * - Leaf tasks: Use their own percentComplete
   * - Parent tasks: Average of all children's progress
   * - Project: Average of all root (top-level) tasks
   * 
   * Updates all affected tasks and project in a single transaction.
   * 
   * @param projectId - Project ID
   * @private
   */
  private async rollupProjectProgress(projectId: string): Promise<void> {
    const tasks = await this.prisma.task.findMany({
      where: { projectId, deletedAt: null },
      select: { id: true, parentId: true, percentComplete: true },
    });

    const byParent = new Map<string | null, typeof tasks>();
    for (const t of tasks) {
      const key = t.parentId;
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push(t);
    }

    const progressById = new Map<string, number>();

    function compute(nodeId: string): number {
      const children = byParent.get(nodeId) ?? [];
      if (!children.length) {
        const t = tasks.find((x) => x.id === nodeId);
        const p = t ? t.percentComplete : 0;
        progressById.set(nodeId, p);
        return p;
      }
      let sum = 0;
      for (const c of children) {
        sum += compute(c.id);
      }
      const a = sum / children.length;
      progressById.set(nodeId, a);
      return a;
    }

    const roots = byParent.get(null) ?? [];
    let projectTotal = 0;
    for (const r of roots) {
      projectTotal += compute(r.id);
    }
    const projectPct = roots.length ? projectTotal / roots.length : 0;

    await this.prisma.$transaction(async (tx) => {
      await tx.project.update({
        where: { id: projectId },
        data: { percentComplete: projectPct, updatedAt: new Date() },
      });
      for (const [id, p] of progressById) {
        await tx.task.update({ where: { id }, data: { percentComplete: p, updatedAt: new Date() } });
      }
    });
  }

  async validateDependencies(task: { predecessorTaskIds: string[]; projectId: string; id?: string }): Promise<void> {
    const tasks = await this.prisma.task.findMany({
      where: { projectId: task.projectId, deletedAt: null },
      select: { id: true, predecessorTaskIds: true },
    });
    const map = new Map(tasks.map((t) => [t.id, { predecessorTaskIds: t.predecessorTaskIds }]));
    validateDependencies(task.id ?? '__new__', task.predecessorTaskIds, map);
  }

  async getTaskHierarchy(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
    });
    if (!project) throw new ProjectNotFoundError(projectId);

    const tasks = await this.prisma.task.findMany({
      where: { projectId, deletedAt: null },
      include: { assignedTo: true },
      orderBy: [{ priority: 'desc' }, { plannedStartDate: 'asc' }],
    });

    type Node = (typeof tasks)[0] & { children: Node[] };
    const byId = new Map<string, Node>();
    for (const t of tasks) {
      byId.set(t.id, { ...t, children: [] });
    }
    const roots: Node[] = [];
    for (const t of tasks) {
      const node = byId.get(t.id)!;
      if (!t.parentId) {
        roots.push(node);
      } else {
        const parent = byId.get(t.parentId);
        if (parent) parent.children.push(node);
        else roots.push(node);
      }
    }
    return roots;
  }
}

function topologicalSort<T extends { id: string; predecessorTaskIds: string[] }>(
  tasks: T[],
  byId: Map<string, { predecessorTaskIds: string[] }>
): T[] {
  const visited = new Set<string>();
  const result: T[] = [];

  function visit(id: string): void {
    if (visited.has(id)) return;
    visited.add(id);
    const t = byId.get(id);
    for (const p of t?.predecessorTaskIds ?? []) {
      visit(p);
    }
    const orig = tasks.find((x) => x.id === id);
    if (orig) result.push(orig);
  }

  for (const t of tasks) {
    visit(t.id);
  }
  return result;
}

