# RealCo Platform - Reorganization Guide
## Step-by-Step Structure Cleanup

**Status:** This IS a monorepo ✅  
**Action Required:** Light organization recommended  
**Estimated Time:** 30 minutes

---

## 🎯 QUICK REORGANIZATION SCRIPT

### Phase 1: Create Organized Folder Structure (5 min)

```bash
# Navigate to project root
cd "c:\RealCo Platfrom"

# Create organized documentation structure
mkdir -p docs/guides
mkdir -p docs/development  
mkdir -p docs/architecture
mkdir -p docs/api

# Create tools directory
mkdir tools

# Create proper apps structure (for future)
# mkdir -p apps/api apps/web apps/investor-portal

# Create packages structure (for future)
# mkdir -p packages/database packages/types packages/ui packages/config packages/utils
```

---

## 📋 PHASE 2: ORGANIZE DOCUMENTATION (15 min)

### Step 1: Move Root Documentation

```bash
# Keep at root (these are important top-level docs)
# - README.md
# - QUICK_START.md  
# - PROJECT_STATUS_RECOMMENDATIONS.md
# - MONOREPO_STRUCTURE.md
# - REORGANIZE_STRUCTURE.md (this file)

# Archive completed session docs (optional)
mkdir -p archive/sessions
mv SESSION_SUMMARY.md archive/sessions/
mv DOCUMENTATION_ORGANIZATION_COMPLETE.md archive/sessions/
mv REQUIREMENT_10_COMPLETE.md archive/sessions/
mv UNIT_TESTS_IMPLEMENTATION_SUMMARY.md archive/sessions/
```

### Step 2: Organize docs/ folder

```powershell
# Move to guides/
Move-Item "docs/DEPLOYMENT.md" "docs/guides/"
Move-Item "docs/PRE_DEPLOYMENT_VALIDATION.md" "docs/guides/"
Move-Item "docs/TROUBLESHOOTING_GUIDE.md" "docs/guides/"
Move-Item "docs/INTEGRATION_CHECKLIST.md" "docs/guides/"

# Move to development/
Move-Item "docs/CURSOR_PROMPTS_SONNET_4.5.md" "docs/development/"
Move-Item "docs/QUICK_REFERENCE_GUIDE.md" "docs/development/"
Move-Item "docs/REALCO_KEALEE_SPECIFIC_PROMPTS.md" "docs/development/"

# Move to architecture/
Move-Item "docs/REALCO_KEALEE_INTEGRATION.md" "docs/architecture/"
Move-Item "docs/REALCO_KEALEE_INTEGRATION OS-PM.md" "docs/architecture/"
Move-Item "docs/REALCO_FINANCE_ESCROW_INTEGRATION.md" "docs/architecture/"
Move-Item "docs/REALCO_KEALEE_IMPLEMENTATION_SUMMARY.md" "docs/architecture/"

# Keep at docs/ root
# - README.md (index)
# - DOCUMENTATION_INDEX.md
# - MASTER_CONTEXT_COMPLIANCE.md
```

### Step 3: Clean up docs/files/ subfolder

```powershell
# Merge docs/files/ content back to docs/
Move-Item "docs/files/*" "docs/guides/"
Remove-Item "docs/files" -Force
```

---

## 🛠️ PHASE 3: MOVE UTILITY FILES (5 min)

```bash
# Move to tools directory
mv generate-jwt-secret.js tools/
mv update-jwt-secret.js tools/

# Move scripts
mkdir -p scripts
mv backend/scripts/* scripts/
```

---

## 📦 PHASE 4: UPDATE REFERENCES (5 min)

### Update package.json references

**Root `package.json`:**
```json
{
  "name": "realco-platform",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "backend",
    "frontend",
    "apps/*",
    "realco-investor-app/*",
    "demo"
  ],
  "scripts": {
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "test:backend": "cd backend && npm test",
    "build:all": "npm run build --workspaces",
    "test:all": "npm run test --workspaces"
  }
}
```

### Update Documentation Links

Search and replace in all `.md` files:

```bash
# Old path → New path
docs/DEPLOYMENT.md → docs/guides/DEPLOYMENT.md
docs/TROUBLESHOOTING_GUIDE.md → docs/guides/TROUBLESHOOTING_GUIDE.md
docs/CURSOR_PROMPTS_SONNET_4.5.md → docs/development/CURSOR_PROMPTS_SONNET_4.5.md
```

**Or use PowerShell:**
```powershell
Get-ChildItem -Path . -Filter *.md -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace 'docs/DEPLOYMENT.md', 'docs/guides/DEPLOYMENT.md' | Set-Content $_.FullName
}
```

---

## 🔍 VERIFICATION CHECKLIST

After reorganization, verify:

- [ ] All documentation accessible
- [ ] No broken links in markdown files
- [ ] Backend still runs (`cd backend && npm run dev`)
- [ ] Frontend still runs (`cd frontend && npm run dev`)
- [ ] Tests still pass (`cd backend && npm test`)
- [ ] Git status shows moved files (not deleted/added)
- [ ] Updated DOCUMENTATION_INDEX.md with new paths

---

## 📁 FINAL STRUCTURE (After Light Organization)

```
RealCo Platform/
├── .cursor/Docs/                    # Cursor-specific (keep as-is)
│
├── apps/                             # Multiple applications
│   └── web/                          # Next.js app
│
├── backend/                          # Main API
│   ├── prisma/
│   ├── src/
│   └── tests/
│
├── frontend/                         # Main web app
│   └── src/
│
├── realco-investor-app/              # Investor portal
│
├── docs/                             # ⭐ ORGANIZED
│   ├── guides/                       # ⭐ NEW
│   │   ├── DEPLOYMENT.md
│   │   ├── PRE_DEPLOYMENT_VALIDATION.md
│   │   ├── TROUBLESHOOTING_GUIDE.md
│   │   └── INTEGRATION_CHECKLIST.md
│   ├── development/                  # ⭐ NEW
│   │   ├── CURSOR_PROMPTS_SONNET_4.5.md
│   │   ├── QUICK_REFERENCE_GUIDE.md
│   │   └── REALCO_KEALEE_SPECIFIC_PROMPTS.md
│   ├── architecture/                 # ⭐ NEW
│   │   ├── REALCO_KEALEE_INTEGRATION.md
│   │   ├── REALCO_FINANCE_ESCROW_INTEGRATION.md
│   │   └── REALCO_KEALEE_IMPLEMENTATION_SUMMARY.md
│   ├── README.md
│   ├── DOCUMENTATION_INDEX.md
│   └── MASTER_CONTEXT_COMPLIANCE.md
│
├── tools/                            # ⭐ NEW
│   ├── generate-jwt-secret.js
│   └── update-jwt-secret.js
│
├── scripts/                          # ⭐ NEW (future)
│   ├── deploy-production.sh
│   └── migrate-database.sh
│
├── archive/                          # ⭐ NEW (optional)
│   └── sessions/
│       ├── SESSION_SUMMARY.md
│       └── ...
│
├── Root Documentation/
│   ├── README.md
│   ├── QUICK_START.md
│   ├── PROJECT_STATUS_RECOMMENDATIONS.md
│   ├── MONOREPO_STRUCTURE.md
│   └── REORGANIZE_STRUCTURE.md
│
└── Configuration/
    ├── package.json
    ├── .gitignore
    └── docker-compose.yml
```

---

## 🚀 ONE-COMMAND REORGANIZATION (PowerShell)

```powershell
# Run this script to reorganize everything at once
# Save as: reorganize.ps1

# Create directories
New-Item -ItemType Directory -Force -Path "docs/guides"
New-Item -ItemType Directory -Force -Path "docs/development"
New-Item -ItemType Directory -Force -Path "docs/architecture"
New-Item -ItemType Directory -Force -Path "tools"
New-Item -ItemType Directory -Force -Path "archive/sessions"

# Move documentation
Move-Item -Path "docs/DEPLOYMENT.md" -Destination "docs/guides/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "docs/PRE_DEPLOYMENT_VALIDATION.md" -Destination "docs/guides/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "docs/TROUBLESHOOTING_GUIDE.md" -Destination "docs/guides/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "docs/INTEGRATION_CHECKLIST.md" -Destination "docs/guides/" -Force -ErrorAction SilentlyContinue

Move-Item -Path "docs/CURSOR_PROMPTS_SONNET_4.5.md" -Destination "docs/development/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "docs/QUICK_REFERENCE_GUIDE.md" -Destination "docs/development/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "docs/REALCO_KEALEE_SPECIFIC_PROMPTS.md" -Destination "docs/development/" -Force -ErrorAction SilentlyContinue

Move-Item -Path "docs/REALCO_KEALEE_INTEGRATION.md" -Destination "docs/architecture/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "docs/REALCO_KEALEE_INTEGRATION OS-PM.md" -Destination "docs/architecture/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "docs/REALCO_FINANCE_ESCROW_INTEGRATION.md" -Destination "docs/architecture/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "docs/REALCO_KEALEE_IMPLEMENTATION_SUMMARY.md" -Destination "docs/architecture/" -Force -ErrorAction SilentlyContinue

# Move session docs to archive
Move-Item -Path "SESSION_SUMMARY.md" -Destination "archive/sessions/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "DOCUMENTATION_ORGANIZATION_COMPLETE.md" -Destination "archive/sessions/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "REQUIREMENT_10_COMPLETE.md" -Destination "archive/sessions/" -Force -ErrorAction SilentlyContinue
Move-Item -Path "UNIT_TESTS_IMPLEMENTATION_SUMMARY.md" -Destination "archive/sessions/" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Reorganization complete!" -ForegroundColor Green
Write-Host "📋 Next: Update documentation links" -ForegroundColor Yellow
```

---

## ⚠️ IMPORTANT NOTES

### Before Running Reorganization:

1. **Commit current changes**
   ```bash
   git add .
   git commit -m "Save current state before reorganization"
   ```

2. **Create backup branch**
   ```bash
   git checkout -b backup-before-reorganization
   git checkout main
   ```

3. **Test after reorganization**
   - Build backend
   - Build frontend
   - Run tests
   - Check all links in docs

### If Something Breaks:

```bash
# Revert to backup
git checkout backup-before-reorganization
```

---

## 📊 BENEFITS OF REORGANIZATION

**Before:**
- ❌ Documentation scattered (root, docs/, .cursor/Docs/)
- ❌ Utility files in root
- ❌ Hard to find specific docs
- ❌ No clear structure

**After:**
- ✅ Documentation organized by purpose
- ✅ Clean root directory
- ✅ Easy to navigate
- ✅ Clear monorepo structure
- ✅ Tools in dedicated folder

---

## 🎯 NEXT STEPS AFTER REORGANIZATION

1. **Update DOCUMENTATION_INDEX.md** with new paths
2. **Update README.md** with new structure
3. **Test all npm scripts** still work
4. **Update CI/CD** if paths changed
5. **Communicate changes** to team

---

## 🚀 FUTURE: FULL MONOREPO TRANSFORMATION

After Finance Module complete, consider:

1. **Move backend/** → **apps/api/**
2. **Move frontend/** → **apps/web/**  
3. **Extract shared code** → **packages/**
4. **Add Turborepo** for faster builds
5. **Unified testing** and linting

**Estimated effort:** 2-4 hours  
**Best time:** Between major milestones

---

*Ready to reorganize? Run the PowerShell script above or follow manual steps!*

---

*Last Updated: January 22, 2026*  
*Status: Ready to execute*  
*Estimated Time: 30 minutes*
