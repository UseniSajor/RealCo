/**
 * Audit Service
 * Logs all important actions for compliance and security
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuditLogParams {
  action: string;
  entityType: string;
  entityId: string;
  userId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  /**
   * Log an audit event
   */
  async log(params: AuditLogParams) {
    try {
      // In production, this would write to AuditEvent model
      // For now, we'll use console logging with structured format
      const auditEntry = {
        timestamp: new Date().toISOString(),
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        userId: params.userId,
        metadata: params.metadata,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      };

      console.log('AUDIT:', JSON.stringify(auditEntry));

      // TODO: Write to database when AuditEvent model is available
      // await prisma.auditEvent.create({
      //   data: {
      //     action: params.action,
      //     entityType: params.entityType,
      //     entityId: params.entityId,
      //     userId: params.userId,
      //     metadata: params.metadata as any,
      //     ipAddress: params.ipAddress,
      //     userAgent: params.userAgent,
      //   },
      // });

      return auditEntry;
    } catch (error) {
      console.error('Audit logging error:', error);
      // Don't throw - audit logging should never break the main flow
    }
  }

  /**
   * Log user action
   */
  async logUserAction(
    userId: string,
    action: string,
    details?: any,
    ipAddress?: string
  ) {
    return this.log({
      action: `user_${action}`,
      entityType: 'USER',
      entityId: userId,
      userId,
      metadata: details,
      ipAddress,
    });
  }

  /**
   * Log financial transaction
   */
  async logTransaction(
    transactionId: string,
    action: string,
    userId: string,
    amount: number,
    details?: any
  ) {
    return this.log({
      action: `transaction_${action}`,
      entityType: 'TRANSACTION',
      entityId: transactionId,
      userId,
      metadata: {
        amount,
        ...details,
      },
    });
  }

  /**
   * Log security event
   */
  async logSecurityEvent(
    event: string,
    userId?: string,
    details?: any,
    ipAddress?: string
  ) {
    return this.log({
      action: `security_${event}`,
      entityType: 'SECURITY',
      entityId: `sec_${Date.now()}`,
      userId,
      metadata: details,
      ipAddress,
    });
  }

  /**
   * Log compliance check
   */
  async logComplianceCheck(
    checkId: string,
    checkType: string,
    userId: string,
    result: 'PASSED' | 'FAILED' | 'PENDING',
    details?: any
  ) {
    return this.log({
      action: `compliance_${checkType.toLowerCase()}_${result.toLowerCase()}`,
      entityType: 'COMPLIANCE_CHECK',
      entityId: checkId,
      userId,
      metadata: {
        checkType,
        result,
        ...details,
      },
    });
  }

  /**
   * Log API request (for sensitive endpoints)
   */
  async logAPIRequest(
    endpoint: string,
    method: string,
    userId?: string,
    statusCode?: number,
    ipAddress?: string,
    userAgent?: string
  ) {
    return this.log({
      action: `api_${method.toLowerCase()}_${endpoint.replace(/\//g, '_')}`,
      entityType: 'API_REQUEST',
      entityId: `req_${Date.now()}`,
      userId,
      metadata: {
        endpoint,
        method,
        statusCode,
      },
      ipAddress,
      userAgent,
    });
  }

  /**
   * Query audit logs (for admin/compliance review)
   */
  async queryLogs(filters: {
    userId?: string;
    entityType?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    // TODO: Implement when AuditEvent model is available
    console.log('Query audit logs:', filters);
    
    // return await prisma.auditEvent.findMany({
    //   where: {
    //     userId: filters.userId,
    //     entityType: filters.entityType,
    //     action: filters.action,
    //     createdAt: {
    //       gte: filters.startDate,
    //       lte: filters.endDate,
    //     },
    //   },
    //   orderBy: { createdAt: 'desc' },
    //   take: filters.limit || 100,
    // });

    return [];
  }

  /**
   * Generate audit report (for compliance)
   */
  async generateReport(filters: {
    startDate: Date;
    endDate: Date;
    entityType?: string;
    userId?: string;
  }) {
    const logs = await this.queryLogs(filters);

    // Group by action type
    const summary: Record<string, number> = {};
    logs.forEach((log: any) => {
      summary[log.action] = (summary[log.action] || 0) + 1;
    });

    return {
      period: {
        start: filters.startDate,
        end: filters.endDate,
      },
      totalEvents: logs.length,
      summary,
      logs,
    };
  }
}

export const auditService = new AuditService();
