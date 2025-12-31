You are working ONLY in /backend.
Stack: Fastify + Prisma + Postgres.
All state transitions MUST call runComplianceChecks() before DB writes.
All successful transitions MUST write AUDIT_EVENTS with before_state/after_state JSON.
