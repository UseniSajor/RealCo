# Vercel Environment Variable Setup

## Backend API URL Configuration

Your Railway staging backend: `https://realco-production-staging.up.railway.app`

## Option 1: Using Vercel Dashboard (Recommended)

1. Go to: https://vercel.com/dashboard
2. Select your **RealCo** project
3. Click **Settings** → **Environment Variables**
4. Add the following variable:

```
Name: VITE_API_URL
Value: https://realco-production-staging.up.railway.app/api/v1
Environments: ✅ Production  ✅ Preview  ✅ Development
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click **⋯** on latest deployment → **Redeploy**

## Option 2: Using Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
cd frontend
vercel link

# Add environment variable
vercel env add VITE_API_URL production
# When prompted, paste: https://realco-production-staging.up.railway.app/api/v1

vercel env add VITE_API_URL preview
# When prompted, paste: https://realco-production-staging.up.railway.app/api/v1

# Trigger a new deployment
vercel --prod
```

## Test Endpoints

After deployment, test these:

1. **Backend Health:**
   - https://realco-production-staging.up.railway.app/health
   - Should return: `{"ok":true,"name":"realco-backend"}`

2. **API Version:**
   - https://realco-production-staging.up.railway.app/api/v1/version
   - Should return version info

3. **Frontend:**
   - https://real-co-qa8k.vercel.app
   - Login page should work
   - Offerings page should connect to backend

## Local Development

Create `frontend/.env.local` (not tracked by git):

```env
VITE_API_URL=https://realco-production-staging.up.railway.app/api/v1
```

Or for local backend testing:
```env
VITE_API_URL=http://localhost:5001/api/v1
```

## Troubleshooting

**CORS Errors:**
Make sure Railway backend has this environment variable:
```
CORS_ORIGIN=https://real-co-qa8k.vercel.app,https://real-co-qa8k-*.vercel.app
```

**API Not Found:**
Verify the backend is running:
- Railway Dashboard → Staging → Backend service → Check status is "Active"
- Test the health endpoint manually in browser
