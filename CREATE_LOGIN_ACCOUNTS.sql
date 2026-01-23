-- ============================================================================
-- CREATE LOGIN ACCOUNTS FOR REALCO
-- ============================================================================
-- Copy and paste this entire file into Railway's PostgreSQL Query console
-- 
-- Creates:
--   - Demo account: demo@realco.com / demo123
--   - Admin account: admin@realco.com / admin123
--   - Investor account: investor@realco.com / investor123
-- ============================================================================

-- Step 1: Create Organization
INSERT INTO "Organization" (id, name, "createdAt", "updatedAt")
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'RealCo Demo Org',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Create Demo User (password: demo123)
INSERT INTO "User" (id, email, "passwordHash", "orgId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'demo@realco.com',
  '$2b$10$VeKsfHxec2SEeUGo2zgJfOVkyRvQeh/LucYOWSSW1uhWIto.Ua6C6',
  '00000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Step 3: Create Admin User (password: admin123)
INSERT INTO "User" (id, email, "passwordHash", "orgId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@realco.com',
  '$2b$10$hOXOxlZfnk0r7oeOIFZvi.UX37GApDA7JqoU05a3QFse3/RrsXKLK',
  '00000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Step 4: Create Investor User (password: investor123)
INSERT INTO "User" (id, email, "passwordHash", "orgId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'investor@realco.com',
  '$2b$10$08iHnmm7sGZ12pHIqPjQf.YYpA8pn0WlRhnEd858Ew..D8w6t5Y2.',
  '00000000-0000-0000-0000-000000000001',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERY
-- Run this to verify accounts were created:
-- ============================================================================
-- SELECT email, "createdAt" FROM "User" ORDER BY "createdAt" DESC;
-- 
-- You should see:
--   demo@realco.com
--   admin@realco.com
--   investor@realco.com
-- ============================================================================
