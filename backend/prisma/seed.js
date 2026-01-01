import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    // Create demo organization
    const org = await prisma.organization.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: { id: '00000000-0000-0000-0000-000000000001', name: 'RealCo Demo Org' },
    });
    // Create demo user (password: "demo123")
    const passwordHash = await bcrypt.hash('demo123', 10);
    await prisma.user.upsert({
        where: { email: 'demo@realco.com' },
        update: {},
        create: {
            email: 'demo@realco.com',
            passwordHash,
            orgId: org.id,
        },
    });
    console.log('Seeded organization and demo user (demo@realco.com / demo123)');
}
main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map