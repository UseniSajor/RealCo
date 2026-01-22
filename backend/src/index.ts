import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { registerV1Routes } from './api/v1.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(',') ?? true,
  credentials: true,
});

await app.register(jwt, {
  secret: process.env.JWT_SECRET || 'dev_only_change_me',
});

app.get('/health', async () => ({ ok: true, name: 'realco-backend' }));

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
