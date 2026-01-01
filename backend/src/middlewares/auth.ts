import type { FastifyRequest, FastifyReply } from 'fastify';

export interface AuthenticatedUser {
  userId: string;
  orgId: string;
}

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  // Fastify JWT decorates request with jwtVerify
  await (req as any).jwtVerify();
  
  // Extract user_id and org_id from JWT payload
  // Fastify JWT stores decoded payload in request.user after jwtVerify
  const jwtPayload = (req as any).user as { sub: string; org_id: string };
  
  if (!jwtPayload?.sub || !jwtPayload?.org_id) {
    return reply.status(401).send({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token missing required claims',
      },
    });
  }

  // Attach user info to request for use in route handlers
  (req as any).user = {
    userId: jwtPayload.sub,
    orgId: jwtPayload.org_id,
  };
}
