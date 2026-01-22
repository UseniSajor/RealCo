# RealCo Platform - Reorganization Script
# Run this to organize the documentation and file structure

Write-Host "🚀 Starting RealCo Platform Reorganization..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Create organized directory structure
Write-Host "📁 Creating organized directory structure..." -ForegroundColor Yellow

New-Item -ItemType Directory -Force -Path "docs/guides" | Out-Null
New-Item -ItemType Directory -Force -Path "docs/development" | Out-Null
New-Item -ItemType Directory -Force -Path "docs/architecture" | Out-Null
New-Item -ItemType Directory -Force -Path "docs/api" | Out-Null
New-Item -ItemType Directory -Force -Path "tools" | Out-Null
New-Item -ItemType Directory -Force -Path "archive/sessions" | Out-Null

Write-Host "✅ Directories created" -ForegroundColor Green
Write-Host ""

# Step 2: Move documentation to organized folders
Write-Host "📚 Organizing documentation..." -ForegroundColor Yellow

# Move to guides/
$guideDocs = @(
    "docs/DEPLOYMENT.md",
    "docs/PRE_DEPLOYMENT_VALIDATION.md",
    "docs/TROUBLESHOOTING_GUIDE.md",
    "docs/INTEGRATION_CHECKLIST.md"
)

foreach ($doc in $guideDocs) {
    if (Test-Path $doc) {
        $filename = Split-Path $doc -Leaf
        Move-Item -Path $doc -Destination "docs/guides/$filename" -Force
        Write-Host "  ✓ Moved $filename to guides/" -ForegroundColor Gray
    }
}

# Move to development/
$devDocs = @(
    "docs/CURSOR_PROMPTS_SONNET_4.5.md",
    "docs/QUICK_REFERENCE_GUIDE.md",
    "docs/REALCO_KEALEE_SPECIFIC_PROMPTS.md"
)

foreach ($doc in $devDocs) {
    if (Test-Path $doc) {
        $filename = Split-Path $doc -Leaf
        Move-Item -Path $doc -Destination "docs/development/$filename" -Force
        Write-Host "  ✓ Moved $filename to development/" -ForegroundColor Gray
    }
}

# Move to architecture/
$archDocs = @(
    "docs/REALCO_KEALEE_INTEGRATION.md",
    "docs/REALCO_KEALEE_INTEGRATION OS-PM.md",
    "docs/REALCO_FINANCE_ESCROW_INTEGRATION.md",
    "docs/REALCO_KEALEE_IMPLEMENTATION_SUMMARY.md"
)

foreach ($doc in $archDocs) {
    if (Test-Path $doc) {
        $filename = Split-Path $doc -Leaf
        Move-Item -Path $doc -Destination "docs/architecture/$filename" -Force
        Write-Host "  ✓ Moved $filename to architecture/" -ForegroundColor Gray
    }
}

# Merge docs/files/ if exists
if (Test-Path "docs/files") {
    Write-Host "  ✓ Merging docs/files/ content..." -ForegroundColor Gray
    Get-ChildItem "docs/files" | ForEach-Object {
        Move-Item -Path $_.FullName -Destination "docs/guides/" -Force -ErrorAction SilentlyContinue
    }
    Remove-Item "docs/files" -Force -Recurse -ErrorAction SilentlyContinue
}

Write-Host "✅ Documentation organized" -ForegroundColor Green
Write-Host ""

# Step 3: Archive session summaries
Write-Host "📦 Archiving session summaries..." -ForegroundColor Yellow

$sessionDocs = @(
    "SESSION_SUMMARY.md",
    "DOCUMENTATION_ORGANIZATION_COMPLETE.md",
    "REQUIREMENT_10_COMPLETE.md",
    "UNIT_TESTS_IMPLEMENTATION_SUMMARY.md"
)

foreach ($doc in $sessionDocs) {
    if (Test-Path $doc) {
        Move-Item -Path $doc -Destination "archive/sessions/" -Force
        Write-Host "  ✓ Archived $doc" -ForegroundColor Gray
    }
}

Write-Host "✅ Session docs archived" -ForegroundColor Green
Write-Host ""

# Step 4: Move utility files to tools/
Write-Host "🛠️  Moving utility files to tools/..." -ForegroundColor Yellow

$toolFiles = @(
    "generate-jwt-secret.js",
    "update-jwt-secret.js"
)

foreach ($file in $toolFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "tools/" -Force
        Write-Host "  ✓ Moved $file to tools/" -ForegroundColor Gray
    }
}

Write-Host "✅ Utility files organized" -ForegroundColor Green
Write-Host ""

# Step 5: Summary
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 Reorganization Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "New Structure:" -ForegroundColor White
Write-Host "  📁 docs/guides/          - Deployment & troubleshooting guides" -ForegroundColor Gray
Write-Host "  📁 docs/development/     - Development docs & prompts" -ForegroundColor Gray
Write-Host "  📁 docs/architecture/    - Architecture & integration docs" -ForegroundColor Gray
Write-Host "  📁 tools/                - Utility scripts" -ForegroundColor Gray
Write-Host "  📁 archive/sessions/     - Historical session summaries" -ForegroundColor Gray
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review the new structure" -ForegroundColor White
Write-Host "  2. Update DOCUMENTATION_INDEX.md with new paths" -ForegroundColor White
Write-Host "  3. Test that backend and frontend still run" -ForegroundColor White
Write-Host "  4. Commit changes: git add . && git commit -m 'Reorganize project structure'" -ForegroundColor White
Write-Host ""
Write-Host "To verify everything works:" -ForegroundColor Yellow
Write-Host "  cd backend && npm run dev" -ForegroundColor White
Write-Host "  cd frontend && npm run dev" -ForegroundColor White
Write-Host "  cd backend && npm test" -ForegroundColor White
Write-Host ""
Write-Host "✨ Happy coding!" -ForegroundColor Cyan
