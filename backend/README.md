# Portfolio Backend API

A robust Node.js/Express backend for the portfolio website with JWT authentication, PostgreSQL database, and complete blog management system.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Admin role-based access control
  - Secure password hashing with bcrypt
  - Rate limiting for security

- **Blog Management**
  - Complete CRUD operations
  - Published/Draft states
  - Auto-generated slugs
  - Search and filtering
  - Tagging system
  - Read time calculation

- **Database**
  - PostgreSQL with connection pooling
  - Auto-generated schemas
  - Data validation
  - Database migrations

- **Security**
  - CORS configuration
  - Helmet for security headers
  - Request validation
  - Error handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install both frontend and backend dependencies
npm run setup:full
```

### 2. Database Setup

#### Option A: Using pgAdmin (Recommended)

1. Open pgAdmin
2. Create a new database named `portfolio_db`
3. Update the `.env` file with your database credentials

#### Option B: Using Command Line

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE portfolio_db;

# Exit psql
\\q
```

### 3. Environment Configuration

Update `backend/.env` with your configuration:

```env
# Environment
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration  
JWT_SECRET=your_super_secure_jwt_secret_key_here_at_least_64_characters_long
JWT_EXPIRES_IN=7d

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**⚠️ Important:** Change the default admin credentials in production!

## 🚀 Running the Application

### Development Mode (Both Frontend + Backend)

```bash
# Start both frontend and backend together
npm run dev:full
```

### Individual Services

```bash
# Frontend only (Vite dev server)
npm run dev

# Backend only
npm run backend:dev
```

### Production Build

```bash
# Build frontend
npm run build

# Build backend
npm run backend:build

# Start backend in production
npm run backend:start
```

## 📊 API Endpoints

### Base URL
- Development: `http://localhost:5000`
- Health Check: `GET /health`

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | Admin login | Public |
| POST | `/api/auth/verify` | Verify JWT token | Private |
| GET | `/api/auth/profile` | Get user profile | Private |

### Blog Endpoints

#### Public Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/blog` | Get published blog posts | Public |
| GET | `/api/blog/:slug` | Get single blog post by slug | Public |

#### Admin Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/blog/admin/posts` | Get all posts (including drafts) | Admin |
| GET | `/api/blog/admin/:id` | Get post by ID | Admin |
| POST | `/api/blog/admin` | Create new blog post | Admin |
| PUT | `/api/blog/admin/:id` | Update blog post | Admin |
| DELETE | `/api/blog/admin/:id` | Delete blog post | Admin |

### Query Parameters

**Blog List (`GET /api/blog`)**
- `search`: Search in title and excerpt
- `tags`: Filter by tags
- `limit`: Number of posts per page (default: 10)
- `offset`: Pagination offset (default: 0)

**Admin Blog List (`GET /api/blog/admin/posts`)**
- `published`: Filter by published status (true/false)
- `search`: Search in title and content
- `limit`: Number of posts per page (default: 10)
- `offset`: Pagination offset (default: 0)

## 🔐 Authentication

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \\n  -H \"Content-Type: application/json\" \\n  -d '{
    \"username\": \"admin\",
    \"password\": \"admin123\"
  }'
```

### Using JWT Token

Include the JWT token in the Authorization header:

```bash
curl -X GET http://localhost:5000/api/blog/admin/posts \\n  -H \"Authorization: Bearer YOUR_JWT_TOKEN\"
```

## 📝 Blog Post Structure

### Create Blog Post

```json
{
  \"title\": \"My First Blog Post\",
  \"content\": \"This is the full content of the blog post...\",
  \"excerpt\": \"Optional excerpt (auto-generated if not provided)\",
  \"published\": true,
  \"tags\": [\"DevOps\", \"Tutorial\"],
  \"featured_image\": \"https://example.com/image.jpg\",
  \"read_time\": \"5 min read\"
}
```

### Blog Post Response

```json
{
  \"success\": true,
  \"data\": {
    \"post\": {
      \"id\": 1,
      \"title\": \"My First Blog Post\",
      \"slug\": \"my-first-blog-post\",
      \"content\": \"This is the full content...\",
      \"excerpt\": \"This is the excerpt...\",
      \"author\": \"admin\",
      \"published\": true,
      \"tags\": [\"DevOps\", \"Tutorial\"],
      \"featured_image\": \"https://example.com/image.jpg\",
      \"read_time\": \"5 min read\",
      \"created_at\": \"2025-09-25T18:00:00.000Z\",
      \"updated_at\": \"2025-09-25T18:00:00.000Z\",
      \"published_at\": \"2025-09-25T18:00:00.000Z\"
    }
  }
}
```

## 🗃️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author VARCHAR(100) NOT NULL,
  published BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  featured_image VARCHAR(500),
  read_time VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);
```

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes (5 for auth endpoints)
- **CORS**: Configured for frontend domains
- **Helmet**: Security headers
- **Input Validation**: Express-validator for all inputs
- **Password Hashing**: bcrypt with salt rounds
- **JWT**: Secure token-based authentication

## 🔧 Development

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── init.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── blogController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── BlogPost.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── blogRoutes.ts
│   ├── utils/
│   │   └── helpers.ts
│   └── server.ts
├── .env
├── package.json
└── tsconfig.json
```

### Available Scripts

```bash
# Backend development
cd backend
npm run dev        # Start with nodemon
npm run build      # Compile TypeScript
npm start          # Start compiled version

# Full-stack development (from root)
npm run dev:full   # Start both frontend and backend
npm run setup:full # Install all dependencies
```

## 🐛 Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL is running**
   ```bash
   # Windows (if installed as service)
   net start postgresql-x64-13
   
   # Check if process is running
   tasklist /fi \"imagename eq postgres.exe\"
   ```

2. **Verify database exists**
   ```bash
   psql -U postgres -l
   ```

3. **Check connection parameters in .env**

### Common Errors

- **\"JWT_SECRET not configured\"**: Set JWT_SECRET in .env file
- **\"Database connection failed\"**: Check PostgreSQL service and credentials
- **\"Port already in use\"**: Change PORT in .env or stop conflicting process
- **\"Invalid credentials\"**: Verify admin username/password in .env

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [Helmet.js](https://helmetjs.github.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.