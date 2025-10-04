# 🚀 Quick Start Guide - Portfolio Backend

Get your portfolio backend up and running in minutes!

## Prerequisites

- ✅ Node.js (v16+)
- ✅ PostgreSQL (v12+)
- ✅ Git

## 🏃‍♂️ Quick Setup (5 minutes)

### 1. Database Setup

**Option A: Using pgAdmin (Recommended)**
1. Open pgAdmin
2. Right-click \"Databases\" → Create Database
3. Name: `portfolio_db`
4. Click Save

**Option B: Command Line**
```bash
psql -U postgres
CREATE DATABASE portfolio_db;
\\q
```

### 2. Configure Environment

Edit `backend/.env`:
```env
DB_PASSWORD=your_postgresql_password_here
JWT_SECRET=your_very_long_secret_key_at_least_64_characters_for_security
```

### 3. Install & Run

```bash
# Install all dependencies (frontend + backend)
npm run setup:full

# Start both frontend and backend
npm run dev:full
```

## ✅ Verify Setup

1. **Backend**: http://localhost:5000/health
2. **Frontend**: http://localhost:5173
3. **Admin Login**: username: `admin`, password: `admin123`

## 🧪 Test the API

```bash
# Test all endpoints
cd backend
node test-api.js
```

## 🔑 API Quick Reference

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \\n  -H \"Content-Type: application/json\" \\n  -d '{\"username\":\"admin\",\"password\":\"admin123\"}'
```

### Get Blog Posts
```bash
curl http://localhost:5000/api/blog
```

### Create Blog Post (Admin)
```bash
curl -X POST http://localhost:5000/api/blog/admin \\n  -H \"Content-Type: application/json\" \\n  -H \"Authorization: Bearer YOUR_JWT_TOKEN\" \\n  -d '{
    \"title\": \"My First Post\",
    \"content\": \"Hello World!\",
    \"published\": true
  }'
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection error | Check PostgreSQL is running & credentials in .env |
| JWT_SECRET not configured | Set a long random string in .env |
| Port 5000 already in use | Change PORT in backend/.env |
| Frontend can't reach backend | Check CORS settings in server.ts |

## 🎯 Next Steps

1. **Change default admin password** in production
2. **Add your blog posts** via API or directly in database
3. **Customize frontend** to display your content
4. **Deploy to production** (Heroku, DigitalOcean, etc.)

---

**Need help?** Check the full [Backend README](README.md) for detailed documentation.