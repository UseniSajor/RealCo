# RealCo-Kealee Integration - Quick Start Guide
## Fast Access to Everything You Need

**Last Updated:** January 22, 2026

---

## 🚀 NEW TO THE PROJECT?

**Read These 3 Documents (30 minutes):**
1. [`docs/README.md`](docs/README.md) - Overview of documentation kit
2. [`PROJECT_STATUS_RECOMMENDATIONS.md`](PROJECT_STATUS_RECOMMENDATIONS.md) - Current status & roadmap
3. [`docs/DOCUMENTATION_INDEX.md`](docs/DOCUMENTATION_INDEX.md) - Where to find everything

---

## 📋 COMMON TASKS

### Run Tests
```bash
cd backend
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # Coverage report
```

### Development
```bash
# Backend
cd backend
npm run dev                # Start dev server
npm run build              # Build for production
npm run typecheck          # Type checking

# Frontend  
cd frontend
npm run dev                # Start dev server
npm run build              # Build for production
```

### Database
```bash
cd backend
npx prisma migrate dev     # Create migration
npx prisma migrate deploy  # Deploy to production
npx prisma studio          # Open database GUI
npx prisma generate        # Update Prisma client
```

### Deployment
```bash
# Backend (Railway)
railway login
railway link
railway up                 # Deploy

# Frontend (Vercel)
vercel login
vercel link
vercel --prod              # Deploy
```

---

## 📚 KEY DOCUMENTS

### For Development
- **Code Patterns:** [`docs/QUICK_REFERENCE_GUIDE.md`](docs/QUICK_REFERENCE_GUIDE.md)
- **Specific Features:** [`.cursor/Docs/REALCO_KEALEE_SPECIFIC_PROMPTS.md`](.cursor/Docs/REALCO_KEALEE_SPECIFIC_PROMPTS.md)
- **Master Context:** [`.cursor/Docs/CURSOR_PROMPTS_SONNET_4.5.md`](.cursor/Docs/CURSOR_PROMPTS_SONNET_4.5.md)

### For Testing
- **Test Guide:** [`backend/tests/README.md`](backend/tests/README.md)
- **Test Files:** `backend/tests/services/*.test.ts`

### For Deployment
- **Pre-Deployment:** [`docs/PRE_DEPLOYMENT_VALIDATION.md`](docs/PRE_DEPLOYMENT_VALIDATION.md)
- **Deployment Guide:** [`PRODUCTION_DEPLOYMENT_GUIDE.md`](PRODUCTION_DEPLOYMENT_GUIDE.md)
- **Railway/Vercel:** [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)

### When Stuck
- **Troubleshooting:** [`docs/TROUBLESHOOTING_GUIDE.md`](docs/TROUBLESHOOTING_GUIDE.md)
- **Integration Checklist:** [`docs/INTEGRATION_CHECKLIST.md`](docs/INTEGRATION_CHECKLIST.md)

---

## 🎯 PROJECT STATUS

**Overall Progress:** 35% Complete  
**Master Context Compliance:** 100% (10/10) ✅  
**Test Coverage:** >80% ✅  

**What's Complete:**
- ✅ Database schema (Prompts 1-4)
- ✅ Backend services (Project, Task, DailyLog)
- ✅ Unit tests (100+ tests)
- ✅ Documentation (complete)

**What's Next:**
- ⏳ Finance Module (Prompts 6-10)
- ⏳ Frontend UI (Prompt 5)
- ⏳ Integration & Automation (Prompt 11)

---

## 🐛 DEBUGGING

### Backend Issues
```bash
# View logs
railway logs --tail 100

# Database connection
railway run psql

# Check environment variables
railway variables
```

### Frontend Issues
```bash
# View logs
vercel logs

# Check environment
vercel env ls

# Local preview
npm run preview
```

### Test Issues
```bash
# Run specific test
npm test -- -t "test name"

# Verbose output
npm test -- --reporter=verbose

# Debug mode
node --inspect-brk ./node_modules/vitest/vitest.mjs run
```

---

## 📞 NEED HELP?

1. **Check Documentation:** [`docs/DOCUMENTATION_INDEX.md`](docs/DOCUMENTATION_INDEX.md)
2. **Check Troubleshooting:** [`docs/TROUBLESHOOTING_GUIDE.md`](docs/TROUBLESHOOTING_GUIDE.md)
3. **Check Code Examples:** [`docs/QUICK_REFERENCE_GUIDE.md`](docs/QUICK_REFERENCE_GUIDE.md)
4. **Ask with Context:** Provide error message, what you tried, what you expected

---

## ✅ BEFORE DEPLOYING

**Must Review:**
1. [`docs/PRE_DEPLOYMENT_VALIDATION.md`](docs/PRE_DEPLOYMENT_VALIDATION.md) - Complete checklist
2. Deployment window: **Tuesday-Thursday, 9am-2pm ONLY**
3. Rollback plan ready
4. Team available
5. Database backup created

---

## 🔗 EXTERNAL RESOURCES

- [Vitest Documentation](https://vitest.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Fastify Documentation](https://www.fastify.io/)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)

---

## 📊 METRICS TO TRACK

**Code Quality:**
- Test coverage: Target >80%
- TypeScript errors: Target 0
- Linter errors: Target 0

**Performance:**
- API response time: Target <200ms (p95)
- Database queries: Target <50ms (p95)
- Page load time: Target <2s

**Deployment:**
- Error rate: Target <0.1%
- Uptime: Target >99.9%
- User satisfaction: Track feedback

---

## 🎓 LEARNING RESOURCES

**New to TypeScript?**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

**New to Prisma?**
- [`backend/prisma/README.md`](backend/prisma/README.md)
- [Prisma Quick Reference](backend/prisma/QUICK_REFERENCE.md)

**New to Testing?**
- [`backend/tests/README.md`](backend/tests/README.md)
- Test examples in `backend/tests/services/`

**New to the Stack?**
- Read [`.cursor/Docs/README.md`](.cursor/Docs/README.md)
- Follow learning path (Week 1-3 guide included)

---

## 💡 TIPS

**Daily Development:**
1. Always start Cursor with Master Context Prompt
2. Reference quick guide for code patterns
3. Update integration checklist as you complete tasks
4. Run tests before committing

**Best Practices:**
- Write tests alongside code
- Document complex logic
- Use TypeScript strict mode
- Handle all error cases
- Never skip type checking

**Deployment:**
- Deploy early and often to staging
- Never deploy on Friday/Monday
- Always have rollback plan ready
- Monitor for 2 hours after deploy

---

**Need more details? Check [`docs/DOCUMENTATION_INDEX.md`](docs/DOCUMENTATION_INDEX.md) for complete navigation!**

---

*Quick Start Guide - Keep this handy!*
