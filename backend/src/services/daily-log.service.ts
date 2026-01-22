/**
 * Daily Log Service
 * 
 * Handles construction daily log creation, photo management, and investor notifications.
 * 
 * Features:
 * - Daily log entry creation with weather, labor, equipment tracking
 * - Photo upload with automatic thumbnail generation
 * - Progress photo retrieval
 * - Investor notification system
 * 
 * @module services/daily-log
 */

import type { PrismaClient, DailyLog, WeatherCondition } from '@prisma/client';
import { ProjectNotFoundError, ValidationError } from './errors.js';
import { uploadToS3, getPhotoKey } from './s3.js';
import { processImage, validateImage, extractGPS } from './image-processing.js';
import { emit } from './events.js';

export interface LaborCount {
  trade: string;
  count: number;
}

export interface CreateDailyLogDTO {
  logDate: Date;
  weather?: WeatherCondition;
  temperature?: number;
  laborCount?: LaborCount[];
  equipmentUsed?: string[];
  materialsDelivered?: string;
  workCompleted?: string;
  issuesDelays?: string;
  visitorLog?: string;
  safetyObservations?: string;
}

export interface PhotoUpload {
  filename: string;
  buffer: Buffer;
  contentType: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Service for managing construction daily logs.
 */
export class DailyLogService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a daily log entry for a project.
   * 
   * @param projectId - Project ID
   * @param userId - User ID creating the log
   * @param data - Daily log data
   * @returns Promise resolving to created daily log
   * @throws {ProjectNotFoundError} if project doesn't exist
   * @throws {ValidationError} if validation fails
   */
  async createDailyLog(
    projectId: string,
    userId: string,
    data: CreateDailyLogDTO
  ): Promise<DailyLog> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
    });
    if (!project) throw new ProjectNotFoundError(projectId);

    // Check for duplicate log date
    const existing = await this.prisma.dailyLog.findUnique({
      where: {
        projectId_logDate: {
          projectId,
          logDate: data.logDate,
        },
      },
    });
    if (existing) {
      throw new ValidationError(`Daily log already exists for date: ${data.logDate.toISOString().split('T')[0]}`);
    }

    // Validate temperature range (reasonable construction site range)
    if (data.temperature !== undefined && (data.temperature < -50 || data.temperature > 150)) {
      throw new ValidationError('Temperature must be between -50°F and 150°F');
    }

    const log = await this.prisma.dailyLog.create({
      data: {
        projectId,
        logDate: data.logDate,
        weather: data.weather ?? null,
        temperature: data.temperature ?? null,
        laborCount: data.laborCount ? (data.laborCount as any) : null,
        equipmentUsed: data.equipmentUsed ?? [],
        materialsDelivered: data.materialsDelivered ?? null,
        workCompleted: data.workCompleted ?? null,
        issuesDelays: data.issuesDelays ?? null,
        visitorLog: data.visitorLog ?? null,
        safetyObservations: data.safetyObservations ?? null,
        createdById: userId,
        photoUrls: [],
      },
    });

    await emit('dailyLog.created', { logId: log.id, projectId, logDate: data.logDate });
    return log;
  }

  /**
   * Upload progress photos for a daily log.
   * 
   * Generates thumbnails and medium-sized versions, uploads all to S3,
   * and updates the log with photo URLs.
   * 
   * @param logId - Daily log ID
   * @param photos - Array of photo uploads
   * @returns Promise resolving to array of photo URLs
   * @throws {ValidationError} if log doesn't exist or photos are invalid
   */
  async uploadProgressPhotos(logId: string, photos: PhotoUpload[]): Promise<string[]> {
    const log = await this.prisma.dailyLog.findUnique({
      where: { id: logId },
      include: { project: true },
    });
    if (!log) throw new ValidationError('Daily log not found');

    if (photos.length === 0) {
      throw new ValidationError('At least one photo is required');
    }

    if (photos.length > 20) {
      throw new ValidationError('Maximum 20 photos per log entry');
    }

    const photoUrls: string[] = [];

    for (const photo of photos) {
      // Validate image
      const validation = await validateImage(photo.buffer);
      if (!validation.valid) {
        throw new ValidationError(validation.error || 'Invalid image');
      }

      // Process image (generate thumbnails)
      const processed = await processImage(photo.buffer);

      // Extract GPS if available
      const gps = await extractGPS(photo.buffer);

      // Upload original
      const originalKey = getPhotoKey(log.projectId, logId, photo.filename);
      const originalUrl = await uploadToS3(originalKey, processed.original, photo.contentType);
      photoUrls.push(originalUrl);

      // Upload thumbnail
      if (processed.thumbnail) {
        const thumbKey = getPhotoKey(log.projectId, logId, photo.filename, 'thumb');
        await uploadToS3(thumbKey, processed.thumbnail, 'image/jpeg');
      }

      // Upload medium size
      if (processed.medium) {
        const mediumKey = getPhotoKey(log.projectId, logId, photo.filename, 'medium');
        await uploadToS3(mediumKey, processed.medium, 'image/jpeg');
      }

      // TODO: Store GPS coordinates in metadata if needed
      if (gps) {
        console.log(`[DailyLog] GPS extracted: ${gps.lat}, ${gps.lng} for ${photo.filename}`);
      }
    }

    // Update log with photo URLs
    const updatedLog = await this.prisma.dailyLog.update({
      where: { id: logId },
      data: {
        photoUrls: [...log.photoUrls, ...photoUrls],
      },
    });

    await emit('dailyLog.photosUploaded', { logId, projectId: log.projectId, photoCount: photos.length });
    return photoUrls;
  }

  /**
   * Get daily logs for a project with optional date range filter.
   * 
   * @param projectId - Project ID
   * @param dateRange - Optional date range filter
   * @returns Promise resolving to array of daily logs
   * @throws {ProjectNotFoundError} if project doesn't exist
   */
  async getDailyLogs(projectId: string, dateRange?: DateRange): Promise<DailyLog[]> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
    });
    if (!project) throw new ProjectNotFoundError(projectId);

    const where: { projectId: string; logDate?: { gte: Date; lte: Date } } = { projectId };

    if (dateRange) {
      where.logDate = {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      };
    }

    const logs = await this.prisma.dailyLog.findMany({
      where,
      include: { createdBy: { select: { id: true, email: true } } },
      orderBy: { logDate: 'desc' },
    });

    return logs;
  }

  /**
   * Get all progress photos for a project, chronologically sorted.
   * 
   * @param projectId - Project ID
   * @returns Promise resolving to array of photo URLs with metadata
   */
  async getProgressPhotos(projectId: string): Promise<
    Array<{
      logId: string;
      logDate: Date;
      photoUrl: string;
      thumbnailUrl?: string;
    }>
  > {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
    });
    if (!project) throw new ProjectNotFoundError(projectId);

    const logs = await this.prisma.dailyLog.findMany({
      where: { projectId, photoUrls: { isEmpty: false } },
      select: { id: true, logDate: true, photoUrls: true },
      orderBy: { logDate: 'asc' },
    });

    const photos: Array<{
      logId: string;
      logDate: Date;
      photoUrl: string;
      thumbnailUrl?: string;
    }> = [];

    for (const log of logs) {
      for (const url of log.photoUrls) {
        // Generate thumbnail URL (replace original with thumb suffix)
        const thumbnailUrl = url.replace(/\.(jpg|jpeg|png|webp)$/i, '_thumb.$1');
        photos.push({
          logId: log.id,
          logDate: log.logDate,
          photoUrl: url,
          thumbnailUrl,
        });
      }
    }

    return photos;
  }

  /**
   * Update work completed for a daily log.
   * 
   * @param logId - Daily log ID
   * @param workCompleted - Updated work completed description
   * @returns Promise resolving to updated daily log
   * @throws {ValidationError} if log doesn't exist
   */
  async updateWorkCompleted(logId: string, workCompleted: string): Promise<DailyLog> {
    const log = await this.prisma.dailyLog.findUnique({
      where: { id: logId },
    });
    if (!log) throw new ValidationError('Daily log not found');

    const updated = await this.prisma.dailyLog.update({
      where: { id: logId },
      data: { workCompleted, updatedAt: new Date() },
    });

    await emit('dailyLog.workUpdated', { logId, projectId: log.projectId });
    return updated;
  }
}

