# Portfolio Website with Full-Stack Backend

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS, featuring a complete Node.js backend API with PostgreSQL database for dynamic blog management.

## ✨ Features

### Frontend

- **Modern Tech Stack**: React 18, TypeScript, Vite
- **Responsive Design**: Tailwind CSS with mobile-first approach
- **UI Components**: Radix UI primitives with shadcn/ui
- **Smooth Animations**: Framer Motion and CSS transitions
- **Dark Mode**: Built-in theme switching
- **Performance**: Optimized with Vite for fast development and builds

### Backend API

- **Authentication**: JWT-based admin authentication
- **Blog Management**: Complete CRUD operations for blog posts
- **Database**: PostgreSQL with connection pooling
- **Security**: Rate limiting, CORS, input validation
- **API Documentation**: RESTful endpoints with proper status codes

### Portfolio Sections

- **Hero**: Introduction with social links
- **Skills**: Technical expertise and tools
- **Experience**: Professional background
- **Projects**: Showcase of work and achievements
- **Blog**: Dynamic blog posts from backend API
- **Contact**: Professional contact information

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install all dependencies (frontend + backend)
npm run setup:full

# Set up database (see backend/QUICKSTART.md for details)
# Configure backend/.env file with your database credentials

# Start both frontend and backend
npm run dev:full
```

### Quick Database Setup

1. Create PostgreSQL database named `portfolio_db`
2. Update `backend/.env` with your database credentials
3. The backend will auto-create tables and seed admin user on first run

**Default Admin Credentials:**

- Username: `admin`
- Password: `admin123`

⚠️ **Change these in production!**

## 📊 Available Scripts

### Full-Stack Development

```bash
npm run dev:full      # Start both frontend and backend
npm run setup:full    # Install all dependencies
```

### Frontend Only

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Only

```bash
npm run backend:dev    # Start backend in development
npm run backend:build  # Build backend TypeScript
npm run backend:start  # Start built backend
```

## 🌐 API Endpoints

### Base URL: `http://localhost:5000`

### Public Endpoints

- `GET /health` - Health check
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/:slug` - Get single blog post

### Admin Endpoints (Requires JWT)

- `POST /api/auth/login` - Admin login
- `GET /api/blog/admin/posts` - Get all posts (including drafts)
- `POST /api/blog/admin` - Create blog post
- `PUT /api/blog/admin/:id` - Update blog post
- `DELETE /api/blog/admin/:id` - Delete blog post

## 🗂️ Project Structure

```
├── src/                  # Frontend React application
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and configurations
├── backend/             # Node.js Express API
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Data models and types
│   │   ├── routes/      # API route definitions
│   │   ├── middleware/  # Authentication and validation
│   │   ├── config/      # Database and app configuration
│   │   └── utils/       # Helper functions
│   ├── .env            # Environment variables
│   └── README.md       # Backend documentation
└── package.json        # Root package configuration
```

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in your project.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

### Frontend

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - Component-based UI library
- **shadcn-ui** - Modern UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Query** - Data fetching and state management

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## How can I deploy this project?

You can deploy this project to any hosting platform that supports Node.js and static file serving, such as:

- Vercel
- Netlify
- Render
- Heroku
- AWS
- DigitalOcean

## Can I connect a custom domain to my project?

Yes, you can connect a custom domain to your deployed project. The process varies depending on your hosting provider, but generally involves:

1. Purchasing a domain (if you haven't already)
2. Configuring DNS settings to point to your hosting provider
3. Adding the domain to your hosting provider's dashboard
4. Setting up SSL certificates (most providers offer this automatically)

Check your hosting provider's documentation for specific instructions.
