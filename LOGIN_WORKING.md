# ✅ Login Credentials - Working

**Last Updated:** January 23, 2026  
**Status:** ✅ Active

---

## 🔑 Test Accounts

### 1. Demo Account
- **Email:** `demo@realco.com`
- **Password:** `demo123`
- **Purpose:** General demo/testing

### 2. Admin Account
- **Email:** `admin@realco.com`
- **Password:** `admin123`
- **Purpose:** Administrative testing

### 3. Investor Account
- **Email:** `investor@realco.com`
- **Password:** `investor123`
- **Purpose:** Investor role testing

---

## 🚀 How to Login

1. Go to: https://real-co-qa8k.vercel.app/login
2. Enter one of the email addresses above
3. Enter the corresponding password
4. Click "Login"

---

## 🔧 Backend Setup Required

**IMPORTANT:** The database must be seeded with these accounts.

### Check if Database is Seeded:

In Railway dashboard, run this query:
```sql
SELECT email FROM "User";
```

You should see:
- demo@realco.com
- admin@realco.com
- investor@realco.com

### If Users Don't Exist, Seed the Database:

**Option 1: Railway Dashboard**
1. Go to Railway Dashboard
2. Click on your backend service
3. Go to "Shell" tab
4. Run: `npm run seed`

**Option 2: Railway CLI**
```bash
railway run npm run seed
```

---

## ⚙️ Environment Variables Required

Ensure these are set in Railway:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key
```

---

## 🧪 Testing Login Flow

### Frontend Test:
```
1. Visit https://real-co-qa8k.vercel.app/login
2. Use: demo@realco.com / demo123
3. Should redirect to homepage after successful login
```

### Backend Test (API):
```bash
curl -X POST https://realco-production-staging.up.railway.app/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@realco.com",
    "password": "demo123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "demo@realco.com",
    "orgId": "..."
  }
}
```

---

## 🐛 Troubleshooting

### Issue: "Invalid credentials"
- ✅ Check database is seeded (`npm run seed` in Railway)
- ✅ Verify password is exactly: `demo123` (case-sensitive)
- ✅ Verify email is exactly: `demo@realco.com` (lowercase)

### Issue: "Network error" or "Cannot connect"
- ✅ Check backend is running: https://realco-production-staging.up.railway.app/v1/health/live
- ✅ Verify CORS is enabled for your frontend domain
- ✅ Check Railway logs for errors

### Issue: Login button doesn't work
- ✅ Check browser console for JavaScript errors
- ✅ Verify API_URL environment variable in Vercel
- ✅ Hard refresh (Ctrl+Shift+R)

---

## 📝 Password Security

**Production Note:**
These are **TEST PASSWORDS** for development/demo only.

For production:
- Generate strong passwords
- Use password hashing (bcrypt) ✅ Already implemented
- Implement password reset flow
- Enable 2FA for sensitive accounts
- Rotate credentials regularly

---

## 🔐 Backend Authentication

### How It Works:
1. User submits email + password
2. Backend checks password hash with bcrypt
3. If valid, generates JWT token
4. Token includes: user ID, email, org ID
5. Frontend stores token in localStorage
6. Token sent in `Authorization: Bearer <token>` header

### Token Expiration:
- Current: 7 days
- Configurable in backend code

---

## ✅ Current Status

- ✅ Login page exists: `/login`
- ✅ Backend endpoint: `/v1/auth/login`
- ✅ Password hashing: bcrypt (10 rounds)
- ✅ JWT token generation
- ✅ Frontend auth storage
- ✅ Protected routes
- ✅ Seed data with 3 test users

---

**Need Help?**
- Check Railway logs: `railway logs`
- Check browser console: F12 → Console tab
- Verify backend health: https://realco-production-staging.up.railway.app/v1/health/live
