import { PrismaClient, LimitType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // =============================================================================
  // ORGANIZATIONS & USERS
  // =============================================================================
  
  console.log('📦 Seeding organizations and users...');
  
  // Create demo organization
  const org = await prisma.organization.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: { 
      id: '00000000-0000-0000-0000-000000000001', 
      name: 'RealCo Demo Org' 
    },
  });
  console.log('  ✅ Created organization:', org.name);

  // Create demo user (password: "demo123")
  const passwordHash = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@realco.com' },
    update: {},
    create: {
      email: 'demo@realco.com',
      passwordHash,
      orgId: org.id,
    },
  });
  console.log('  ✅ Created demo user:', demoUser.email);

  // Create admin user (password: "admin123")
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@realco.com' },
    update: {},
    create: {
      email: 'admin@realco.com',
      passwordHash: adminPasswordHash,
      orgId: org.id,
    },
  });
  console.log('  ✅ Created admin user:', adminUser.email);

  // Create investor user (password: "investor123")
  const investorPasswordHash = await bcrypt.hash('investor123', 10);
  const investorUser = await prisma.user.upsert({
    where: { email: 'investor@realco.com' },
    update: {},
    create: {
      email: 'investor@realco.com',
      passwordHash: investorPasswordHash,
      orgId: org.id,
    },
  });
  console.log('  ✅ Created investor user:', investorUser.email);

  // =============================================================================
  // TRANSACTION LIMITS (Regulatory Compliance)
  // =============================================================================
  
  console.log('\n💰 Seeding transaction limits...');

  const limits = [
    {
      limitType: LimitType.DAILY_DEPOSIT,
      amount: 50000.00,
      currency: 'USD',
      description: 'Maximum daily deposit amount per user',
    },
    {
      limitType: LimitType.MONTHLY_DEPOSIT,
      amount: 500000.00,
      currency: 'USD',
      description: 'Maximum monthly deposit amount per user',
    },
    {
      limitType: LimitType.ANNUAL_INVESTMENT,
      amount: 2200.00, // SEC Reg CF limit for non-accredited (income/net worth < $124k)
      currency: 'USD',
      description: 'Annual investment limit for non-accredited investors (low income)',
    },
    {
      limitType: LimitType.NON_ACCREDITED_INVESTOR,
      amount: 124000.00, // 10% of income or net worth threshold
      currency: 'USD',
      description: 'Annual investment limit for non-accredited investors (10% rule)',
    },
    {
      limitType: LimitType.ACCREDITED_INVESTOR,
      amount: 100000000.00, // No SEC limit for accredited
      currency: 'USD',
      description: 'No regulatory limit for accredited investors',
    },
    {
      limitType: LimitType.PER_TRANSACTION,
      amount: 250000.00,
      currency: 'USD',
      description: 'Maximum per-transaction amount (fraud prevention)',
    },
  ];

  for (const limit of limits) {
    const created = await prisma.transactionLimit.upsert({
      where: {
        id: `limit-${limit.limitType.toLowerCase().replace(/_/g, '-')}`,
      },
      update: { ...limit },
      create: {
        id: `limit-${limit.limitType.toLowerCase().replace(/_/g, '-')}`,
        ...limit,
      },
    });
    console.log(`  ✅ ${limit.limitType}: $${limit.amount.toLocaleString()}`);
  }

  // =============================================================================
  // DEMO OFFERING & ESCROW ACCOUNT
  // =============================================================================
  
  console.log('\n🏢 Seeding demo offering...');

  const offering = await prisma.offering.upsert({
    where: { id: 'offering-demo-001' },
    update: {},
    create: {
      id: 'offering-demo-001',
      name: 'Sunset Vista Apartments - Series A',
      status: 'active',
      regulationMode: '506c',
      orgId: org.id,
    },
  });
  console.log('  ✅ Created offering:', offering.name);

  // Create escrow account for offering
  const escrowAccount = await prisma.escrowAccount.upsert({
    where: { offeringId: offering.id },
    update: {},
    create: {
      offeringId: offering.id,
      accountNumber: `ESCROW-${new Date().getFullYear()}-001`,
      currentBalance: 0,
      availableBalance: 0,
      pendingBalance: 0,
      heldBalance: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalDistributions: 0,
      status: 'ACTIVE',
    },
  });
  console.log('  ✅ Created escrow account:', escrowAccount.accountNumber);

  // =============================================================================
  // DEMO INVESTMENT
  // =============================================================================
  
  console.log('\n📈 Seeding demo investment...');

  const investment = await prisma.investment.upsert({
    where: { id: 'investment-demo-001' },
    update: {},
    create: {
      id: 'investment-demo-001',
      investorId: investorUser.id,
      offeringId: offering.id,
      investmentAmount: 50000.00,
      currentBalance: 50000.00,
      returnedCapital: 0,
      preferredReturnRate: 0.08, // 8% preferred return
      preferredReturnOwed: 0,
      preferredReturnPaid: 0,
      profitsPaid: 0,
      status: 'ACTIVE',
      fundedAt: new Date(),
      ownershipPercentage: 5.0,
      equityShares: 5000,
    },
  });
  console.log('  ✅ Created investment: $50,000 by', investorUser.email);

  // =============================================================================
  // DEMO DEVELOPMENT PROJECT
  // =============================================================================
  
  console.log('\n🏗️ Seeding demo development project...');

  const devProject = await prisma.developmentProject.upsert({
    where: { id: 'devproject-demo-001' },
    update: {},
    create: {
      id: 'devproject-demo-001',
      name: 'Sunset Vista Apartments',
      address: '123 Main Street, Austin, TX 78701',
      projectType: 'MULTI_FAMILY',
      orgId: org.id,
      offeringId: offering.id,
    },
  });
  console.log('  ✅ Created development project:', devProject.name);

  // =============================================================================
  // SUMMARY
  // =============================================================================
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ Seed completed successfully!\n');
  console.log('🔐 Demo Credentials:');
  console.log('  Admin:    admin@realco.com / admin123');
  console.log('  Demo:     demo@realco.com / demo123');
  console.log('  Investor: investor@realco.com / investor123');
  console.log('\n📊 Seeded Data:');
  console.log('  - 1 Organization');
  console.log('  - 3 Users');
  console.log('  - 6 Transaction Limits');
  console.log('  - 1 Offering');
  console.log('  - 1 Escrow Account');
  console.log('  - 1 Investment');
  console.log('  - 1 Development Project');
  console.log('='.repeat(60) + '\n');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
