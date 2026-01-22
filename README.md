# RealCo Platform (Monorepo)

This is the RealCo capital formation + execution platform.

Folders:
- /frontend: Vite + React + TS
- /backend: Fastify + TS + Prisma
- /shared/contracts: shared DTOs/schemas
- /.cursor: Cursor instructions

Quick start:
1) Backend
   cd backend
   cp .env.example .env
   npm i
   npm run prisma:generate
   npm run dev

2) Frontend
   cd frontend
   cp .env.example .env
   npm i
   npm run dev
