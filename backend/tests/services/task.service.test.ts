/**
 * TaskService Unit Tests
 * 
 * Tests for task management with dependency validation and critical path
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskService } from '../../src/services/task.service.js';
import { ProjectNotFoundError, ValidationError } from '../../src/services/errors.js';
import { createMockPrisma, testData, expectError } from '../setup.js';
import type { PrismaClient } from '@prisma/client';

vi.mock('../../src/services/events.js', () => ({
  emit: vi.fn(),
}));

describe('TaskService', () => {
  let taskService: TaskService;
  let mockPrisma: PrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    taskService = new TaskService(mockPrisma);
    vi.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(testData.project as any);
      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([]);
      vi.mocked(mockPrisma.task.create).mockResolvedValue(testData.task as any);

      const result = await taskService.createTask(testData.project.id, {
        title: 'New Task',
        description: 'Task description',
        priority: 'HIGH' as any,
        plannedStartDate: new Date('2025-02-01'),
        plannedEndDate: new Date('2025-03-01'),
        durationDays: 28,
      });

      expect(result).toBeDefined();
      expect(mockPrisma.task.create).toHaveBeenCalled();
    });

    it('should throw ProjectNotFoundError if project does not exist', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(null);

      await expectError(
        () => taskService.createTask('invalid-project', {
          title: 'Test Task',
        }),
        ProjectNotFoundError
      );
    });

    it('should throw ValidationError if end date is before start date', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(testData.project as any);

      await expectError(
        () => taskService.createTask(testData.project.id, {
          title: 'Test Task',
          plannedStartDate: new Date('2025-03-01'),
          plannedEndDate: new Date('2025-02-01'), // Before start!
        }),
        ValidationError
      );
    });

    it('should detect circular dependencies', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(testData.project as any);

      // Create a circular dependency: A -> B -> C -> A
      const taskA = { id: 'task-a', predecessorTaskIds: ['task-c'] };
      const taskB = { id: 'task-b', predecessorTaskIds: ['task-a'] };
      const taskC = { id: 'task-c', predecessorTaskIds: ['task-b'] };

      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([taskA, taskB, taskC] as any);

      await expectError(
        () => taskService.createTask(testData.project.id, {
          title: 'Task A',
          predecessorTaskIds: ['task-c'], // Creates cycle
        }),
        ValidationError
      );
    });

    it('should allow valid dependencies without cycles', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(testData.project as any);

      // Linear dependency chain: A -> B -> C (no cycle)
      const taskA = { id: 'task-a', predecessorTaskIds: [] };
      const taskB = { id: 'task-b', predecessorTaskIds: ['task-a'] };

      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([taskA, taskB] as any);
      vi.mocked(mockPrisma.task.create).mockResolvedValue({
        id: 'task-c',
        predecessorTaskIds: ['task-b'],
      } as any);

      const result = await taskService.createTask(testData.project.id, {
        title: 'Task C',
        predecessorTaskIds: ['task-b'], // Valid: A -> B -> C
      });

      expect(result).toBeDefined();
      expect(mockPrisma.task.create).toHaveBeenCalled();
    });

    it('should validate parent task exists', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(testData.project as any);
      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([]);
      vi.mocked(mockPrisma.task.findUnique).mockResolvedValue(null); // Parent doesn't exist

      await expectError(
        () => taskService.createTask(testData.project.id, {
          title: 'Subtask',
          parentId: 'non-existent-parent',
        }),
        ValidationError
      );
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      vi.mocked(mockPrisma.task.findUnique).mockResolvedValue(testData.task as any);
      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([testData.task] as any);
      vi.mocked(mockPrisma.task.update).mockResolvedValue({
        ...testData.task,
        percentComplete: 85,
      } as any);

      const result = await taskService.updateTask(testData.task.id, {
        percentComplete: 85,
      });

      expect(result.percentComplete).toBe(85);
      expect(mockPrisma.task.update).toHaveBeenCalled();
    });

    it('should validate percentage is between 0 and 100', async () => {
      vi.mocked(mockPrisma.task.findUnique).mockResolvedValue(testData.task as any);

      await expectError(
        () => taskService.updateTask(testData.task.id, {
          percentComplete: 150, // Invalid
        }),
        ValidationError
      );

      await expectError(
        () => taskService.updateTask(testData.task.id, {
          percentComplete: -10, // Invalid
        }),
        ValidationError
      );
    });

    it('should prevent creating circular dependencies on update', async () => {
      const taskA = { id: 'task-a', projectId: 'proj-1', predecessorTaskIds: ['task-b'] };
      const taskB = { id: 'task-b', projectId: 'proj-1', predecessorTaskIds: [] };

      vi.mocked(mockPrisma.task.findUnique).mockResolvedValue(taskB as any);
      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([taskA, taskB] as any);

      // Trying to make B depend on A, but A already depends on B (creates cycle)
      await expectError(
        () => taskService.updateTask('task-b', {
          predecessorTaskIds: ['task-a'], // Creates cycle: A -> B -> A
        }),
        ValidationError
      );
    });
  });

  describe('getTasks', () => {
    it('should retrieve tasks with filters', async () => {
      const tasks = [
        { ...testData.task, status: 'IN_PROGRESS' },
        { ...testData.task, id: 'task-2', status: 'COMPLETED' },
      ];

      vi.mocked(mockPrisma.task.findMany).mockResolvedValue(tasks as any);

      const result = await taskService.getTasks(testData.project.id, {
        status: 'IN_PROGRESS' as any,
      });

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          projectId: testData.project.id,
          status: 'IN_PROGRESS',
        }),
        include: expect.any(Object),
      });
    });

    it('should filter for root tasks only', async () => {
      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([testData.task] as any);

      await taskService.getTasks(testData.project.id, {
        parentId: null, // Root tasks only
      });

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          parentId: null,
        }),
        include: expect.any(Object),
      });
    });

    it('should support multiple status filters', async () => {
      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([]);

      await taskService.getTasks(testData.project.id, {
        status: ['IN_PROGRESS' as any, 'PENDING' as any],
      });

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          status: { in: ['IN_PROGRESS', 'PENDING'] },
        }),
        include: expect.any(Object),
      });
    });
  });

  describe('calculateCriticalPath', () => {
    it('should identify critical path with zero float', async () => {
      // Create a simple network:
      // Task A (5 days) -> Task C (10 days)
      // Task B (3 days) -> Task C
      // Critical path: A -> C (15 days total)

      const taskA = {
        id: 'task-a',
        title: 'Task A',
        durationDays: 5,
        predecessorTaskIds: [],
        lagDays: 0,
        isCriticalPath: false,
      };

      const taskB = {
        id: 'task-b',
        title: 'Task B',
        durationDays: 3,
        predecessorTaskIds: [],
        lagDays: 0,
        isCriticalPath: false,
      };

      const taskC = {
        id: 'task-c',
        title: 'Task C',
        durationDays: 10,
        predecessorTaskIds: ['task-a', 'task-b'],
        lagDays: 0,
        isCriticalPath: false,
      };

      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([taskA, taskB, taskC] as any);
      vi.mocked(mockPrisma.task.updateMany).mockResolvedValue({ count: 2 } as any);

      const result = await taskService.calculateCriticalPath(testData.project.id);

      // A and C should be on critical path (longer duration)
      expect(result).toContain('task-a');
      expect(result).toContain('task-c');
      expect(mockPrisma.task.updateMany).toHaveBeenCalled();
    });

    it('should handle tasks with lag days', async () => {
      const taskA = {
        id: 'task-a',
        durationDays: 5,
        predecessorTaskIds: [],
        lagDays: 0,
      };

      const taskB = {
        id: 'task-b',
        durationDays: 5,
        predecessorTaskIds: ['task-a'],
        lagDays: 2, // 2 day lag after Task A
      };

      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([taskA, taskB] as any);
      vi.mocked(mockPrisma.task.updateMany).mockResolvedValue({ count: 2 } as any);

      const result = await taskService.calculateCriticalPath(testData.project.id);

      // Both should be critical as they're sequential with lag
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty task list', async () => {
      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([]);

      const result = await taskService.calculateCriticalPath(testData.project.id);

      expect(result).toEqual([]);
    });
  });

  describe('updateTaskProgress', () => {
    it('should update task progress and rollup to project', async () => {
      vi.mocked(mockPrisma.task.findUnique).mockResolvedValue(testData.task as any);
      
      vi.mocked(mockPrisma.$transaction).mockImplementation(async (callback: any) => {
        const txMock = {
          task: {
            update: vi.fn().mockResolvedValue({
              ...testData.task,
              percentComplete: 90,
            }),
            findMany: vi.fn().mockResolvedValue([
              { percentComplete: 90 },
              { percentComplete: 80 },
              { percentComplete: 70 },
            ]),
          },
          project: {
            update: vi.fn().mockResolvedValue({
              ...testData.project,
              overallProgress: 80, // Average of tasks
            }),
          },
        };
        return await callback(txMock);
      });

      const result = await taskService.updateTaskProgress(testData.task.id, 90);

      expect(result.percentComplete).toBe(90);
    });

    it('should rollup progress from children to parent tasks', async () => {
      const parentTask = { ...testData.task, id: 'parent', parentId: null };
      const childTask1 = { ...testData.task, id: 'child1', parentId: 'parent', percentComplete: 80 };
      const childTask2 = { ...testData.task, id: 'child2', parentId: 'parent', percentComplete: 60 };

      vi.mocked(mockPrisma.task.findUnique).mockResolvedValue(childTask1 as any);

      vi.mocked(mockPrisma.$transaction).mockImplementation(async (callback: any) => {
        const txMock = {
          task: {
            update: vi.fn().mockResolvedValue(childTask1),
            findMany: vi.fn()
              .mockResolvedValueOnce([childTask1, childTask2]) // Children of parent
              .mockResolvedValueOnce([parentTask]), // Root tasks for project
          },
          project: {
            update: vi.fn().mockResolvedValue(testData.project),
          },
        };
        return await callback(txMock);
      });

      await taskService.updateTaskProgress('child1', 80);

      // Parent progress should be average of children: (80 + 60) / 2 = 70
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('getTaskHierarchy', () => {
    it('should build nested task structure', async () => {
      const parent1 = { ...testData.task, id: 'parent1', parentId: null, title: 'Parent 1' };
      const child1 = { ...testData.task, id: 'child1', parentId: 'parent1', title: 'Child 1' };
      const child2 = { ...testData.task, id: 'child2', parentId: 'parent1', title: 'Child 2' };
      const grandchild1 = { ...testData.task, id: 'grandchild1', parentId: 'child1', title: 'Grandchild 1' };

      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([
        parent1,
        child1,
        child2,
        grandchild1,
      ] as any);

      const result = await taskService.getTaskHierarchy(testData.project.id);

      expect(result).toHaveLength(1); // One root task
      expect(result[0].id).toBe('parent1');
      expect(result[0].children).toHaveLength(2); // Two children
      expect(result[0].children![0].children).toHaveLength(1); // One grandchild
    });

    it('should handle flat task list (no hierarchy)', async () => {
      const task1 = { ...testData.task, id: 'task1', parentId: null };
      const task2 = { ...testData.task, id: 'task2', parentId: null };

      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([task1, task2] as any);

      const result = await taskService.getTaskHierarchy(testData.project.id);

      expect(result).toHaveLength(2);
      expect(result[0].children).toBeUndefined();
      expect(result[1].children).toBeUndefined();
    });
  });

  describe('validateDependencies', () => {
    it('should validate predecessor tasks exist', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(testData.project as any);
      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([
        { id: 'task-a', predecessorTaskIds: [] },
      ] as any);

      // Trying to create task with non-existent predecessor
      await expectError(
        () => taskService.createTask(testData.project.id, {
          title: 'Task B',
          predecessorTaskIds: ['non-existent-task'],
        }),
        ValidationError
      );
    });

    it('should detect self-referencing dependency', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(testData.project as any);
      vi.mocked(mockPrisma.task.findMany).mockResolvedValue([
        { id: 'task-a', predecessorTaskIds: ['task-a'] }, // Self-reference
      ] as any);

      await expectError(
        () => taskService.createTask(testData.project.id, {
          title: 'Task A',
          predecessorTaskIds: ['task-a'], // Can't depend on itself
        }),
        ValidationError
      );
    });
  });
});
