import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(jwt, { secret: process.env.SUPABASE_JWT_SECRET || "dev" });

// --- Auth guard (Supabase JWT) ---
app.decorate("auth", async (req: any) => {
  try {
    await req.jwtVerify();
  } catch {
    throw app.httpErrors.unauthorized();
  }
});

// Health
app.get("/health", async () => ({ ok: true }));

// Properties search
app.get("/api/properties", { preHandler: (app as any).auth }, async (req) => {
  const q = z.object({
    ward: z.string().optional(),
    homestead: z.enum(["ANY", "HOMESTEAD", "NON_HOMESTEAD"]).optional(),
    absentee: z.enum(["ANY", "TRUE"]).optional(),
    minAssessment: z.coerce.number().optional(),
    maxAssessment: z.coerce.number().optional(),
    band: z.enum(["ANY", "LIKELY", "MAYBE", "UNLIKELY"]).optional(),
    take: z.coerce.number().optional().default(50),
    skip: z.coerce.number().optional().default(0),
  }).parse(req.query);

  const where: any = {};
  if (q.ward) where.ward = q.ward;

  if (q.homestead === "HOMESTEAD") where.hstdCode = { not: null };
  if (q.homestead === "NON_HOMESTEAD") where.OR = [{ hstdCode: null }, { hstdCode: "" }];

  if (q.absentee === "TRUE") where.absenteeLikely = true;

  if (q.minAssessment || q.maxAssessment) {
    where.assessment = {};
    if (q.minAssessment) where.assessment.gte = q.minAssessment;
    if (q.maxAssessment) where.assessment.lte = q.maxAssessment;
  }

  if (q.band && q.band !== "ANY") where.mortgageUnder200Band = q.band;

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: [{ mortgageUnder200Score: "desc" }, { updatedAt: "desc" }],
      take: q.take,
      skip: q.skip,
    }),
    prisma.property.count({ where }),
  ]);

  return { total, items };
});

// Lead create
app.post("/api/leads", { preHandler: (app as any).auth }, async (req) => {
  const body = z.object({ propertyId: z.string() }).parse(req.body);
  const lead = await prisma.lead.create({ data: { propertyId: body.propertyId } });
  return lead;
});

app.listen({ port: Number(process.env.PORT || 8080), host: "0.0.0.0" });




