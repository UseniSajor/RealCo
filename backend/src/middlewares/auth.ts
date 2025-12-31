import type { FastifyRequest, FastifyReply } from 'fastify';

export interface AuthenticatedUser {
  userId: string;
  orgId: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  // Fastify JWT decorates request with jwtVerify
  // @ts-expect-error - added by plugin at runtime
  await req.jwtVerify();
  
  // Extract user_id and org_id from JWT payload
  // Fastify JWT stores decoded payload in request.user after jwtVerify
  // @ts-expect-error - jwtVerify adds user property with JWT payload
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
  req.user = {
    userId: jwtPayload.sub,
    orgId: jwtPayload.org_id,
  };
}
