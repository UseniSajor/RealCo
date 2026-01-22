/**
 * Investor Notification Service
 * 
 * Handles investor notifications for construction project updates.
 * 
 * Features:
 * - Weekly digest emails with progress summary
 * - Daily log creation notifications
 * - Milestone achievement notifications
 * 
 * NOTE: Full implementation requires email service integration (SendGrid, SES, etc.)
 * 
 * @module services/notifications
 */

import type { PrismaClient } from '@prisma/client';
import { emit } from './events.js';

export interface WeeklyDigestData {
  projectId: string;
  projectName: string;
  progress: number;
  photos: Array<{ url: string; date: Date }>;
  milestones: Array<{ name: string; targetDate: Date; completed: boolean }>;
  budget: {
    total: number | null;
    spent: number;
    remaining: number | null;
  };
}

/**
 * Service for sending investor notifications.
 */
export class NotificationService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Send weekly digest email to investors.
   * 
   * Includes:
   * - Progress summary
   * - Latest photos (3-5)
   * - Upcoming milestones
   * - Budget status
   * 
   * @param projectId - Project ID
   * @param data - Weekly digest data
   * @returns Promise resolving when notifications are queued
   */
  async sendWeeklyDigest(projectId: string, data: WeeklyDigestData): Promise<void> {
    // Get all investors for this project
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        developmentProject: {
          include: {
            offering: {
              include: {
                organization: {
                  include: {
                    users: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      console.warn(`[Notifications] Project not found: ${projectId}`);
      return;
    }

    // TODO: Get actual investors from investment records
    // For now, use organization users as placeholder
    const investors = project.developmentProject?.offering?.organization?.users || [];

    if (investors.length === 0) {
      console.log(`[Notifications] No investors found for project ${projectId}`);
      return;
    }

    // Emit event for email service to process
    await emit('notification.weeklyDigest', {
      projectId,
      investors: investors.map((u) => ({ id: u.id, email: u.email })),
      data,
    });

    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    // Example:
    // for (const investor of investors) {
    //   await emailService.send({
    //     to: investor.email,
    //     subject: `Weekly Update: ${data.projectName}`,
    //     template: 'weekly-digest',
    //     data: { ...data, investorName: investor.name },
    //   });
    // }

    console.log(`[Notifications] Weekly digest queued for ${investors.length} investors (project: ${projectId})`);
  }

  /**
   * Send notification when daily log is created.
   * 
   * @param projectId - Project ID
   * @param logId - Daily log ID
   * @param hasPhotos - Whether log includes photos
   */
  async notifyDailyLogCreated(projectId: string, logId: string, hasPhotos: boolean): Promise<void> {
    await emit('notification.dailyLogCreated', {
      projectId,
      logId,
      hasPhotos,
    });

    // TODO: Send real-time notification (email, push, etc.)
    console.log(`[Notifications] Daily log created notification (project: ${projectId}, log: ${logId}, photos: ${hasPhotos})`);
  }

  /**
   * Send notification when milestone is achieved.
   * 
   * @param projectId - Project ID
   * @param milestoneName - Milestone name
   */
  async notifyMilestoneAchieved(projectId: string, milestoneName: string): Promise<void> {
    await emit('notification.milestoneAchieved', {
      projectId,
      milestoneName,
    });

    // TODO: Send notification to investors
    console.log(`[Notifications] Milestone achieved: ${milestoneName} (project: ${projectId})`);
  }
}



