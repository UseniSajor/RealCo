import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { registerV1Routes } from './api/v1.js';

// Startup guards
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL missing (set Railway Variables)');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production') {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    const hostname = dbUrl.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.error('ERROR: DATABASE_URL cannot point to localhost/127.0.0.1 in production');
      process.exit(1);
    }
  } catch {
    // If URL parsing fails, skip the check (will fail later at connection time)
  }
}

const app = Fastify({ logger: true });

// Configure CORS
let corsOrigin: string[] | false;
if (process.env.CORS_ORIGIN) {
  corsOrigin = process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
  // In development, also allow http://localhost:5173
  if (process.env.NODE_ENV === 'development') {
    const localhostOrigin = 'http://localhost:5173';
    if (!corsOrigin.includes(localhostOrigin)) {
      corsOrigin.push(localhostOrigin);
    }
  }
} else {
  if (process.env.NODE_ENV === 'production') {
    console.warn('WARNING: CORS_ORIGIN is not set in production. CORS is disabled.');
    corsOrigin = false;
  } else {
    corsOrigin = ['http://localhost:5173'];
  }
}

await app.register(cors, {
  origin: corsOrigin,
  credentials: true,
});

await app.register(jwt, {
  secret: process.env.JWT_SECRET || 'dev_only_change_me',
});

app.get('/health', async () => ({ ok: true, service: 'realco-backend' }));

app.setErrorHandler((err, _req, reply) => {
  const status = err.statusCode ?? 500;
  reply.status(status).send({
    error: {
      code: (err as any).code ?? 'INTERNAL_ERROR',
      message: err.message ?? 'Unknown error',
      details: (err as any).validation ?? undefined,
    },
  });
});

await app.register(registerV1Routes, { prefix: '/api/v1' });

const port = Number(process.env.PORT || 5001);
await app.listen({ port, host: '0.0.0.0' });
