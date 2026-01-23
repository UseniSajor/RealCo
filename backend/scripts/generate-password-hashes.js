/**
 * Generate bcrypt password hashes for seeding
 * 
 * Usage:
 *   node scripts/generate-password-hashes.js
 */

import bcrypt from 'bcrypt';

async function generateHashes() {
  console.log('🔐 Generating password hashes...\n');
  
  const passwords = {
    'demo123': null,
    'admin123': null,
    'investor123': null,
  };

  for (const [password, _] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    passwords[password] = hash;
    console.log(`Password: ${password}`);
    console.log(`Hash:     ${hash}\n`);
  }

  console.log('\n📋 SQL INSERT statements:\n');
  
  console.log(`-- Demo user (password: demo123)`);
  console.log(`INSERT INTO "User" (id, email, "passwordHash", "orgId", "createdAt", "updatedAt")`);
  console.log(`VALUES (`);
  console.log(`  gen_random_uuid(),`);
  console.log(`  'demo@realco.com',`);
  console.log(`  '${passwords['demo123']}',`);
  console.log(`  '00000000-0000-0000-0000-000000000001',`);
  console.log(`  NOW(),`);
  console.log(`  NOW()`);
  console.log(`) ON CONFLICT (email) DO NOTHING;\n`);

  console.log(`-- Admin user (password: admin123)`);
  console.log(`INSERT INTO "User" (id, email, "passwordHash", "orgId", "createdAt", "updatedAt")`);
  console.log(`VALUES (`);
  console.log(`  gen_random_uuid(),`);
  console.log(`  'admin@realco.com',`);
  console.log(`  '${passwords['admin123']}',`);
  console.log(`  '00000000-0000-0000-0000-000000000001',`);
  console.log(`  NOW(),`);
  console.log(`  NOW()`);
  console.log(`) ON CONFLICT (email) DO NOTHING;\n`);

  console.log(`-- Investor user (password: investor123)`);
  console.log(`INSERT INTO "User" (id, email, "passwordHash", "orgId", "createdAt", "updatedAt")`);
  console.log(`VALUES (`);
  console.log(`  gen_random_uuid(),`);
  console.log(`  'investor@realco.com',`);
  console.log(`  '${passwords['investor123']}',`);
  console.log(`  '00000000-0000-0000-0000-000000000001',`);
  console.log(`  NOW(),`);
  console.log(`  NOW()`);
  console.log(`) ON CONFLICT (email) DO NOTHING;\n`);
}

generateHashes().catch(console.error);
