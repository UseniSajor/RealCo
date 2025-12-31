# Deployment Guide

This document outlines the deployment process for the RealCo Platform to Railway (backend) and Vercel (frontend).

## Overview

- **Backend**: Deployed on Railway (Node.js + Fastify + Prisma + PostgreSQL)
- **Frontend**: Deployed on Vercel (Vite + React)

---

## Backend Deployment (Railway)

### Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- GitHub repository connected to Railway

### Setup Steps

1. **Create New Project**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Service**
   - Add a new service: "Empty Service"
   - Set the **Root Directory** to: `backend`
   - Railway will auto-detect Node.js

3. **Add PostgreSQL Database**
   - Click "+ New" → "Database" → "Add PostgreSQL"
   - Railway will automatically provision a PostgreSQL instance
   - The `DATABASE_URL` environment variable will be automatically set

4. **Configure Environment Variables**
   
   Go to the service → Variables tab and add:
   
   ```
   DATABASE_URL=<auto-provided by Railway PostgreSQL service>
   JWT_SECRET=<generate a secure random string>
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   PORT=<auto-set by Railway, typically don't override>
   ```
   
   **Note**: Copy the `DATABASE_URL` from the PostgreSQL service's "Connect" tab and paste it into your backend service variables.

5. **Configure Build Settings** (if needed)
   
   Railway typically auto-detects, but you can set:
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

6. **Run Prisma Migrations**
   
   After first deployment, run migrations:
   - Go to service → "Deployments" → Click on latest deployment
   - Open "Logs" or use Railway CLI:
   
   ```bash
   railway run --service backend npm run prisma:migrate
   ```
   
   Or connect to the service and run:
   ```bash
   railway connect
   cd backend
   npm run prisma:migrate
   ```

7. **Deploy**
   - Railway will automatically deploy on every push to your main branch
   - Check the "Deployments" tab for build logs and status
   - Your backend will be available at: `https://your-service-name.up.railway.app`

### Environment Variables Reference (Backend)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | ✅ Yes | Secret key for JWT token signing | `your-secure-random-string-here` |
| `CORS_ORIGIN` | ❌ No | Allowed CORS origins (comma-separated) | `https://app.vercel.app` |
| `PORT` | ❌ No | Server port (Railway sets this automatically) | `5001` |

### Generating JWT_SECRET

Generate a secure random string:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

---

## Frontend Deployment (Vercel)

### Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository connected to Vercel

### Setup Steps

1. **Import Project**
   - Go to Vercel dashboard
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Project Settings**
   
   In the project configuration:
   
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables**
   
   Go to Project Settings → Environment Variables and add:
   
   ```
   VITE_API_URL=https://your-backend-service.up.railway.app
   ```
   
   **Important**: Replace `your-backend-service.up.railway.app` with your actual Railway backend URL.

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend
   - Your site will be available at: `https://your-project.vercel.app`

5. **Update Backend CORS_ORIGIN**
   
   After deploying frontend, update the backend `CORS_ORIGIN` environment variable in Railway to include your Vercel domain:
   ```
   CORS_ORIGIN=https://your-project.vercel.app
   ```

### Environment Variables Reference (Frontend)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ Yes | Backend API base URL (without `/api/v1`) | `https://backend.up.railway.app` |

---

## Post-Deployment Checklist

- [ ] Backend deployed successfully on Railway
- [ ] PostgreSQL database provisioned and connected
- [ ] Prisma migrations run successfully
- [ ] Backend health check works: `https://your-backend.railway.app/health`
- [ ] Frontend deployed successfully on Vercel
- [ ] `VITE_API_URL` set correctly in Vercel environment variables
- [ ] `CORS_ORIGIN` in Railway backend includes frontend URL
- [ ] Test authentication flow end-to-end
- [ ] Verify API calls from frontend to backend work correctly

---

## Continuous Deployment

Both Railway and Vercel support automatic deployments:

- **Railway**: Automatically deploys on every push to the main branch (configure in project settings)
- **Vercel**: Automatically deploys on every push to the main branch (default behavior)

To deploy from a specific branch, configure branch settings in each platform's dashboard.

---

## Troubleshooting

### Backend Issues

- **Database connection errors**: Verify `DATABASE_URL` is correctly set and accessible
- **Prisma client errors**: Ensure `npm run prisma:generate` runs during build
- **CORS errors**: Check `CORS_ORIGIN` includes your frontend URL
- **Port binding**: Railway sets `PORT` automatically; don't override unless necessary

### Frontend Issues

- **API connection errors**: Verify `VITE_API_URL` matches your Railway backend URL
- **Build failures**: Check build logs in Vercel dashboard for TypeScript or build errors
- **Environment variables not working**: Ensure variables are prefixed with `VITE_` for Vite apps

---

## Railway CLI (Optional)

For advanced operations, install Railway CLI:

```bash
npm install -g @railway/cli
railway login
railway link  # Link to your project
railway up    # Deploy from current directory
```

## Vercel CLI (Optional)

For local testing and deployments:

```bash
npm install -g vercel
vercel login
vercel          # Deploy preview
vercel --prod   # Deploy to production
```

