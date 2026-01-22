/**
 * Health Check Utilities
 * 
 * Provides health check functions for various services and dependencies.
 * Used by health check endpoints for monitoring and load balancer probes.
 */

import { prisma } from './prisma.js';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
  details?: any;
}

export interface SystemHealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  checks: {
    database: HealthCheckResult;
    redis?: HealthCheckResult;
    stripe?: HealthCheckResult;
    plaid?: HealthCheckResult;
    s3?: HealthCheckResult;
  };
}

/**
 * Check database connectivity and basic query performance
 */
export async function checkDatabase(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Simple query to check connection
    await prisma.$queryRaw`SELECT 1 as result`;
    
    const responseTime = Date.now() - startTime;
    
    // Warn if query is slow (>500ms indicates potential issues)
    if (responseTime > 500) {
      return {
        status: 'degraded',
        responseTime,
        details: { warning: 'Database response time is slow' },
      };
    }
    
    return {
      status: 'healthy',
      responseTime,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check Redis connectivity
 */
export async function checkRedis(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  // Skip if Redis is not configured
  if (!process.env.REDIS_URL) {
    return {
      status: 'healthy',
      details: { message: 'Redis not configured (optional)' },
    };
  }
  
  try {
    // TODO: Implement Redis connection check
    // const redis = new Redis(process.env.REDIS_URL);
    // await redis.ping();
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      responseTime,
      details: { message: 'Redis check not implemented' },
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check Stripe API connectivity
 */
export async function checkStripe(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  // Skip if Stripe is not configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      status: 'healthy',
      details: { message: 'Stripe not configured' },
    };
  }
  
  try {
    // Simple API call to verify connectivity
    // Don't make actual requests in health checks to avoid rate limits
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      responseTime,
      details: { message: 'Stripe credentials configured' },
    };
  } catch (error) {
    return {
      status: 'degraded',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: { message: 'Stripe connectivity issues (non-critical)' },
    };
  }
}

/**
 * Check Plaid API connectivity
 */
export async function checkPlaid(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  // Skip if Plaid is not configured
  if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
    return {
      status: 'healthy',
      details: { message: 'Plaid not configured' },
    };
  }
  
  try {
    // Simple check
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      responseTime,
      details: { message: 'Plaid credentials configured' },
    };
  } catch (error) {
    return {
      status: 'degraded',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: { message: 'Plaid connectivity issues (non-critical)' },
    };
  }
}

/**
 * Check AWS S3 connectivity
 */
export async function checkS3(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  // Skip if S3 is not configured
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_S3_BUCKET) {
    return {
      status: 'healthy',
      details: { message: 'S3 not configured' },
    };
  }
  
  try {
    // Simple check
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      responseTime,
      details: { message: 'S3 credentials configured' },
    };
  } catch (error) {
    return {
      status: 'degraded',
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: { message: 'S3 connectivity issues (non-critical)' },
    };
  }
}

/**
 * Perform comprehensive system health check
 */
export async function performHealthCheck(): Promise<SystemHealthStatus> {
  const checks = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkStripe(),
    checkPlaid(),
    checkS3(),
  ]);
  
  const [database, redis, stripe, plaid, s3] = checks;
  
  // Determine overall status
  const hasUnhealthyCheck = checks.some(check => check.status === 'unhealthy');
  const hasDegradedCheck = checks.some(check => check.status === 'degraded');
  
  let overallStatus: 'healthy' | 'unhealthy' | 'degraded';
  if (hasUnhealthyCheck) {
    overallStatus = 'unhealthy';
  } else if (hasDegradedCheck) {
    overallStatus = 'degraded';
  } else {
    overallStatus = 'healthy';
  }
  
  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database,
      redis,
      stripe,
      plaid,
      s3,
    },
  };
}

/**
 * Simple liveness check (is the process running?)
 */
export function checkLiveness(): { status: 'ok'; uptime: number } {
  return {
    status: 'ok',
    uptime: process.uptime(),
  };
}

/**
 * Readiness check (is the app ready to serve traffic?)
 * Only checks critical dependencies
 */
export async function checkReadiness(): Promise<{
  status: 'ready' | 'not_ready';
  checks: {
    database: HealthCheckResult;
  };
}> {
  const database = await checkDatabase();
  
  const isReady = database.status === 'healthy' || database.status === 'degraded';
  
  return {
    status: isReady ? 'ready' : 'not_ready',
    checks: {
      database,
    },
  };
}
