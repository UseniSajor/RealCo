console.log("BOOT_OK");

// Only load dotenv in development
if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}

import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import { registerMinimalV1Routes } from './api/v1.minimal.js';

// Process-level error handlers
process.on("unhandledRejection", (e) => console.error("unhandledRejection", e));
process.on("uncaughtException", (e) => console.error("uncaughtException", e));

// Startup guards
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL missing (set Railway Variables)');
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

  // JWT_SECRET is required in production
  if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET is required in production (set Railway Variables)');
    process.exit(1);
  }
}

const app = Fastify({ logger: true });

// Define routes BEFORE middleware (Railway health checks)
app.get('/', async (_req, reply) => {
  reply.status(200).send('ok');
});

app.get('/health', async () => ({ ok: true }));

// Configure CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:5173'];

// In development, also allow http://localhost:5173 if not already included
if (process.env.NODE_ENV === 'development' && !allowedOrigins.includes('http://localhost:5173')) {
  allowedOrigins.push('http://localhost:5173');
}

await app.register(cors, {
  origin: (origin, cb) => {
    // In production, reject unknown origins
    if (process.env.NODE_ENV === 'production') {
      if (!origin || allowedOrigins.length === 0) {
        return cb(new Error('Not allowed by CORS'), false);
      }
      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS'), false);
    }
    // In development, allow any origin if no CORS_ORIGIN is set, or check against allowed origins
    if (allowedOrigins.length === 0 || !origin || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
});

await app.register(jwt, {
  secret: process.env.JWT_SECRET || 'dev_only_change_me',
});

await app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

await app.register(registerMinimalV1Routes, { prefix: '/api/v1' });

// Error handler middleware at the end
app.setErrorHandler((err, _req, reply) => {
  console.error("UNHANDLED_ERROR", err);
  const status = err.statusCode ?? 500;
  reply.status(status).send({
    error: status === 500 ? "internal_error" : (err as any).code ?? 'INTERNAL_ERROR',
    message: err.message ?? 'Unknown error',
    details: (err as any).validation ?? undefined,
  });
});

// Startup diagnostics
console.log('PORT =', process.env.PORT);
console.log('NODE_ENV =', process.env.NODE_ENV);
console.log('has DATABASE_URL =', Boolean(process.env.DATABASE_URL));
try {
  console.log('DB_HOST', new URL(process.env.DATABASE_URL!).hostname);
} catch {}

const port = Number(process.env.PORT);
if (!port) throw new Error("Missing PORT");
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on ${port}`);
});
