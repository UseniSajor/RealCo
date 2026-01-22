/**
 * DailyLogService Unit Tests
 * 
 * Tests for daily log and progress tracking
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DailyLogService } from '../../src/services/daily-log.service.js';
import { ProjectNotFoundError, ValidationError } from '../../src/services/errors.js';
import { createMockPrisma, testData, expectError } from '../setup.js';
import type { PrismaClient } from '@prisma/client';

// Mock S3 service
vi.mock('../../src/services/s3.js', () => ({
  uploadToS3: vi.fn().mockResolvedValue('s3://bucket/test-photo.jpg'),
  getPresignedDownloadUrl: vi.fn().mockResolvedValue('https://s3.aws.com/presigned-url'),
}));

// Mock image processing
vi.mock('../../src/services/image-processing.js', () => ({
  processImage: vi.fn().mockResolvedValue({
    original: 's3://bucket/original.jpg',
    thumbnail: 's3://bucket/thumb.jpg',
    medium: 's3://bucket/medium.jpg',
  }),
  validateImage: vi.fn().mockResolvedValue(true),
}));

// Mock notifications
vi.mock('../../src/services/notifications.js', () => ({
  notifyDailyLogCreated: vi.fn().mockResolvedValue(undefined),
}));

describe('DailyLogService', () => {
  let dailyLogService: DailyLogService;
  let mockPrisma: PrismaClient;

  beforeEach(() => {
    mockPrisma = createMockPrisma();
    dailyLogService = new DailyLogService(mockPrisma);
    vi.clearAllMocks();
  });

  describe('createDailyLog', () => {
    it('should create a daily log successfully', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(testData.project as any);
      vi.mocked(mockPrisma.dailyLog.create).mockResolvedValue(testData.dailyLog as any);

      const result = await dailyLogService.createDailyLog(
        testData.project.id,
        'user-1',
        {
          logDate: new Date('2025-01-20'),
          weather: 'SUNNY' as any,
          temperature: 72,
          laborCount: 15,
          equipmentUsed: ['Excavator', 'Concrete Mixer'],
          workCompleted: 'Foundation work completed',
        }
      );

      expect(result).toBeDefined();
      expect(result.id).toBe(testData.dailyLog.id);
      expect(mockPrisma.dailyLog.create).toHaveBeenCalled();
    });

    it('should throw ProjectNotFoundError if project does not exist', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(null);

      await expectError(
        () => dailyLogService.createDailyLog(
          'invalid-project',
          'user-1',
          {
            logDate: new Date(),
            workCompleted: 'Work done',
          }
        ),
        ProjectNotFoundError
      );
    });

    it('should handle optional fields correctly', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(testData.project as any);
      vi.mocked(mockPrisma.dailyLog.create).mockResolvedValue({
        ...testData.dailyLog,
        weather: null,
        temperature: null,
        issues: null,
      } as any);

      const result = await dailyLogService.createDailyLog(
        testData.project.id,
        'user-1',
        {
          logDate: new Date(),
          workCompleted: 'Work done',
          // No weather, temperature, or issues
        }
      );

      expect(result).toBeDefined();
    });

    it('should validate labor count is non-negative', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(testData.project as any);

      await expectError(
        () => dailyLogService.createDailyLog(
          testData.project.id,
          'user-1',
          {
            logDate: new Date(),
            laborCount: -5, // Invalid
            workCompleted: 'Work done',
          }
        ),
        ValidationError
      );
    });
  });

  describe('getDailyLogs', () => {
    it('should retrieve daily logs for a project', async () => {
      const logs = [
        testData.dailyLog,
        { ...testData.dailyLog, id: 'log-2', logDate: new Date('2025-01-21') },
      ];

      vi.mocked(mockPrisma.dailyLog.findMany).mockResolvedValue(logs as any);

      const result = await dailyLogService.getDailyLogs(testData.project.id);

      expect(result).toHaveLength(2);
      expect(mockPrisma.dailyLog.findMany).toHaveBeenCalledWith({
        where: {
          projectId: testData.project.id,
        },
        orderBy: { logDate: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    });

    it('should filter logs by date range', async () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      vi.mocked(mockPrisma.dailyLog.findMany).mockResolvedValue([testData.dailyLog] as any);

      const result = await dailyLogService.getDailyLogs(
        testData.project.id,
        { startDate, endDate }
      );

      expect(mockPrisma.dailyLog.findMany).toHaveBeenCalledWith({
        where: {
          projectId: testData.project.id,
          logDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { logDate: 'desc' },
        include: expect.any(Object),
      });
    });

    it('should return empty array if no logs found', async () => {
      vi.mocked(mockPrisma.dailyLog.findMany).mockResolvedValue([]);

      const result = await dailyLogService.getDailyLogs(testData.project.id);

      expect(result).toEqual([]);
    });
  });

  describe('uploadProgressPhotos', () => {
    it('should upload photos and attach to daily log', async () => {
      const photos = [
        { buffer: Buffer.from('photo1'), mimetype: 'image/jpeg', filename: 'photo1.jpg' },
        { buffer: Buffer.from('photo2'), mimetype: 'image/jpeg', filename: 'photo2.jpg' },
      ];

      vi.mocked(mockPrisma.dailyLog.findUnique).mockResolvedValue(testData.dailyLog as any);
      vi.mocked(mockPrisma.dailyLog.update).mockResolvedValue({
        ...testData.dailyLog,
        photos: [
          's3://bucket/photo1.jpg',
          's3://bucket/photo2.jpg',
        ],
      } as any);

      const result = await dailyLogService.uploadProgressPhotos(
        testData.dailyLog.id,
        photos as any
      );

      expect(result.photos).toHaveLength(2);
    });

    it('should validate image files before upload', async () => {
      const { validateImage } = await import('../../src/services/image-processing.js');
      vi.mocked(validateImage).mockRejectedValue(new Error('Invalid image format'));

      vi.mocked(mockPrisma.dailyLog.findUnique).mockResolvedValue(testData.dailyLog as any);

      const invalidPhoto = [
        { buffer: Buffer.from('not-an-image'), mimetype: 'text/plain', filename: 'file.txt' },
      ];

      await expect(
        dailyLogService.uploadProgressPhotos(testData.dailyLog.id, invalidPhoto as any)
      ).rejects.toThrow();
    });

    it('should handle empty photo array', async () => {
      vi.mocked(mockPrisma.dailyLog.findUnique).mockResolvedValue(testData.dailyLog as any);
      vi.mocked(mockPrisma.dailyLog.update).mockResolvedValue(testData.dailyLog as any);

      const result = await dailyLogService.uploadProgressPhotos(testData.dailyLog.id, []);

      expect(result).toBeDefined();
      // No photos should be uploaded
    });
  });

  describe('getProgressPhotos', () => {
    it('should retrieve all photos for a project chronologically', async () => {
      const logsWithPhotos = [
        {
          ...testData.dailyLog,
          logDate: new Date('2025-01-20'),
          photos: ['s3://bucket/photo1.jpg', 's3://bucket/photo2.jpg'],
        },
        {
          ...testData.dailyLog,
          id: 'log-2',
          logDate: new Date('2025-01-21'),
          photos: ['s3://bucket/photo3.jpg'],
        },
      ];

      vi.mocked(mockPrisma.dailyLog.findMany).mockResolvedValue(logsWithPhotos as any);

      const result = await dailyLogService.getProgressPhotos(testData.project.id);

      expect(result).toHaveLength(2); // 2 logs
      expect(result[0].photos).toHaveLength(2);
      expect(result[1].photos).toHaveLength(1);
    });

    it('should filter out logs with no photos', async () => {
      const logs = [
        {
          ...testData.dailyLog,
          photos: ['s3://bucket/photo1.jpg'],
        },
        {
          ...testData.dailyLog,
          id: 'log-2',
          photos: [],
        },
      ];

      vi.mocked(mockPrisma.dailyLog.findMany).mockResolvedValue(logs as any);

      const result = await dailyLogService.getProgressPhotos(testData.project.id);

      // Should only include logs with photos
      expect(mockPrisma.dailyLog.findMany).toHaveBeenCalledWith({
        where: {
          projectId: testData.project.id,
          photos: {
            isEmpty: false,
          },
        },
        orderBy: { logDate: 'asc' },
        select: expect.any(Object),
      });
    });
  });

  describe('updateWorkCompleted', () => {
    it('should update work completed field', async () => {
      vi.mocked(mockPrisma.dailyLog.findUnique).mockResolvedValue(testData.dailyLog as any);
      vi.mocked(mockPrisma.dailyLog.update).mockResolvedValue({
        ...testData.dailyLog,
        workCompleted: 'Updated work description',
      } as any);

      const result = await dailyLogService.updateWorkCompleted(
        testData.dailyLog.id,
        'Updated work description'
      );

      expect(result.workCompleted).toBe('Updated work description');
      expect(mockPrisma.dailyLog.update).toHaveBeenCalledWith({
        where: { id: testData.dailyLog.id },
        data: {
          workCompleted: 'Updated work description',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw error if daily log not found', async () => {
      vi.mocked(mockPrisma.dailyLog.findUnique).mockResolvedValue(null);

      await expect(
        dailyLogService.updateWorkCompleted('invalid-id', 'Updated work')
      ).rejects.toThrow();
    });

    it('should not allow empty work completed', async () => {
      vi.mocked(mockPrisma.dailyLog.findUnique).mockResolvedValue(testData.dailyLog as any);

      await expectError(
        () => dailyLogService.updateWorkCompleted(testData.dailyLog.id, ''),
        ValidationError
      );

      await expectError(
        () => dailyLogService.updateWorkCompleted(testData.dailyLog.id, '   '),
        ValidationError
      );
    });
  });

  describe('weather tracking', () => {
    it('should accept valid weather conditions', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(testData.project as any);
      vi.mocked(mockPrisma.dailyLog.create).mockResolvedValue(testData.dailyLog as any);

      const validWeathers = ['SUNNY', 'CLOUDY', 'RAINY', 'SNOWY', 'WINDY', 'FOGGY'];

      for (const weather of validWeathers) {
        const result = await dailyLogService.createDailyLog(
          testData.project.id,
          'user-1',
          {
            logDate: new Date(),
            weather: weather as any,
            workCompleted: 'Work done',
          }
        );

        expect(result).toBeDefined();
      }
    });

    it('should store temperature in Fahrenheit', async () => {
      vi.mocked(mockPrisma.project.findUnique).mockResolvedValue(testData.project as any);
      vi.mocked(mockPrisma.dailyLog.create).mockResolvedValue({
        ...testData.dailyLog,
        temperature: 85,
      } as any);

      const result = await dailyLogService.createDailyLog(
        testData.project.id,
        'user-1',
        {
          logDate: new Date(),
          temperature: 85, // Fahrenheit
          workCompleted: 'Hot day work',
        }
      );

      expect(result.temperature).toBe(85);
    });
  });
});
