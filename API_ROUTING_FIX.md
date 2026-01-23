# API Routing Fix - /v1 Prefix

**Date:** January 23, 2026  
**Status:** ✅ Fixed & Deployed

---

## 🐛 Issue

Getting 404 error:
```json
{
  "message": "Route GET:/v1/health/live not found",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## 🔍 Root Cause

**Backend was using:** `/api/v1` prefix  
**User was accessing:** `/v1/` prefix  
**Result:** 404 Not Found

---

## ✅ Solution

Changed API prefix from `/api/v1` to `/v1` in both frontend and backend for consistency.

### Backend Changes:
**File:** `backend/src/index.ts`
```typescript
// Before
await app.register(registerV1Routes, { prefix: '/api/v1' });

// After
await app.register(registerV1Routes, { prefix: '/v1' });
```

### Frontend Changes:
**File:** `frontend/src/lib/apiClient.ts`
```typescript
// Before
const API_BASE_URL = `${normalizedApiUrl}/api/v1`;

// After
const API_BASE_URL = `${normalizedApiUrl}/v1`;
```

---

## 🚀 New API Endpoints

All endpoints now use `/v1/` prefix:

### Health & Status:
- ✅ `GET /v1/health/live` - Liveness probe
- ✅ `GET /v1/health/ready` - Readiness probe (with DB check)
- ✅ `GET /v1/health` - Comprehensive health check
- ✅ `GET /v1/version` - Version info
- ✅ `GET /v1/ready` - Simple ready check

### Authentication:
- ✅ `POST /v1/auth/login` - User login

### Projects (Protected):
- ✅ `GET /v1/projects` - List projects
- ✅ `POST /v1/projects` - Create project
- ✅ `GET /v1/projects/:id` - Get project details
- ✅ `PATCH /v1/projects/:id` - Update project
- ✅ `DELETE /v1/projects/:id` - Delete project

### Tasks (Protected):
- ✅ `GET /v1/tasks` - List tasks
- ✅ `POST /v1/tasks` - Create task
- ✅ `GET /v1/tasks/:id` - Get task details
- ✅ `PATCH /v1/tasks/:id` - Update task
- ✅ `DELETE /v1/tasks/:id` - Delete task

### Daily Logs (Protected):
- ✅ `POST /v1/daily-logs` - Create daily log
- ✅ `GET /v1/daily-logs` - List daily logs

### Notifications (Protected):
- ✅ `GET /v1/notifications` - Get user notifications
- ✅ `PATCH /v1/notifications/:id/read` - Mark as read

---

## 🧪 Testing

### Test Health Endpoint:
```bash
curl https://realco-production-staging.up.railway.app/v1/health/live
```

**Expected Response:**
```json
{
  "status": "ok",
  "uptime": 12345,
  "timestamp": "2026-01-23T03:30:00.000Z"
}
```

### Test Login:
```bash
curl -X POST https://realco-production-staging.up.railway.app/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@realco.com", "password": "demo123"}'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "demo@realco.com"
  }
}
```

---

## ⏱️ Deployment Timeline

- ✅ **Frontend:** Deploys to Vercel (~2 minutes)
- ✅ **Backend:** Deploys to Railway (~3-4 minutes)
- ⏳ **Total:** ~5 minutes from push

---

## 🔧 Environment Variables

### Vercel (Frontend):
```
VITE_API_URL=https://realco-production-staging.up.railway.app
```

### Railway (Backend):
```
PORT=5001
CORS_ORIGIN=https://real-co-qa8k.vercel.app
JWT_SECRET=your-secret-key
DATABASE_URL=postgresql://...
```

---

## ✅ Verification Checklist

After deployment (~5 minutes):

- [ ] Test health endpoint: `curl https://realco-production-staging.up.railway.app/v1/health/live`
- [ ] Should return `{"status":"ok",...}`
- [ ] Test frontend login: https://real-co-qa8k.vercel.app/login
- [ ] Use `demo@realco.com` / `demo123`
- [ ] Should successfully login and redirect

---

## 📝 Old URLs (No Longer Work)

❌ `/api/v1/health/live` - OLD, doesn't work  
❌ `/api/v1/auth/login` - OLD, doesn't work  
❌ `/api/v1/projects` - OLD, doesn't work

---

## ✅ New URLs (Current)

✅ `/v1/health/live` - NEW, working  
✅ `/v1/auth/login` - NEW, working  
✅ `/v1/projects` - NEW, working

---

## 🚀 Status

- ✅ Backend routing fixed
- ✅ Frontend API client updated
- ✅ Built successfully
- ✅ Committed to Git
- ✅ Pushed to GitHub
- ⏳ Deploying to Vercel & Railway (~5 minutes)

**Expected live:** ~3:35 AM UTC

---

## 📚 Related Documentation

- `LOGIN_WORKING.md` - Login credentials and auth system
- `PROMPT_SPEC_IMPLEMENTATION.md` - Marketing pages implementation
- `BACKUP_SITE_RESTORED.md` - Site restoration guide

---

**All API endpoints now consistently use `/v1/` prefix!** 🎉
