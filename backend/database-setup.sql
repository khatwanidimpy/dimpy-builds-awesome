-- Portfolio Database Setup Script
-- Run this in pgAdmin or psql to set up the database

-- Create database (run this first if database doesn't exist)
-- CREATE DATABASE portfolio_db;

-- Connect to the portfolio_db database before running the rest

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert sample admin user (password: admin123)
-- Note: The actual password will be hashed by the application
INSERT INTO users (username, password_hash, email, role) 
VALUES (
    'admin', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2dZNz.ue3y', -- admin123
    'admin@dimpykhatwani.dev', 
    'admin'
) 
ON CONFLICT (username) DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (
    title, 
    slug, 
    content, 
    excerpt, 
    author, 
    published, 
    tags, 
    read_time,
    published_at
) VALUES 
(
    'Getting Started with DevOps: A Comprehensive Guide',
    'getting-started-with-devops',
    'DevOps has revolutionized the way we develop, deploy, and maintain software applications. In this comprehensive guide, we''ll explore the fundamental concepts, tools, and practices that make DevOps so powerful.\n\n## What is DevOps?\n\nDevOps is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle and provide continuous delivery with high software quality.\n\n## Key Principles\n\n1. **Automation**: Automate repetitive tasks\n2. **Collaboration**: Break down silos between teams\n3. **Continuous Integration**: Integrate code changes frequently\n4. **Continuous Deployment**: Deploy changes automatically\n5. **Monitoring**: Monitor applications and infrastructure\n\n## Essential Tools\n\n- **Version Control**: Git, GitHub, GitLab\n- **CI/CD**: Jenkins, GitHub Actions, GitLab CI\n- **Containerization**: Docker, Kubernetes\n- **Infrastructure as Code**: Terraform, Ansible\n- **Monitoring**: Prometheus, Grafana, ELK Stack\n\n## Getting Started\n\nStart your DevOps journey by learning Git, understanding CI/CD pipelines, and practicing with Docker containers.',
    'Learn the fundamentals of DevOps, including key principles, essential tools, and best practices for modern software development and operations.',
    'admin',
    true,
    ARRAY['DevOps', 'Tutorial', 'Beginner'],
    '8 min read',
    CURRENT_TIMESTAMP
),
(
    'Docker Best Practices for Production Deployments',
    'docker-best-practices-production',
    'Docker has become the de facto standard for containerization, but deploying containers in production requires careful consideration of security, performance, and reliability.\n\n## Image Optimization\n\n### Use Multi-stage Builds\n\n```dockerfile\n# Multi-stage build example\nFROM node:16-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\n\nFROM node:16-alpine AS production\nWORKDIR /app\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY . .\nUSER node\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\n```\n\n### Minimize Image Size\n\n- Use Alpine Linux base images\n- Remove unnecessary packages\n- Use .dockerignore files\n- Leverage layer caching\n\n## Security Best Practices\n\n1. **Run as non-root user**\n2. **Scan images for vulnerabilities**\n3. **Use specific image tags**\n4. **Implement resource limits**\n5. **Keep base images updated**\n\n## Performance Optimization\n\n- Set appropriate resource limits\n- Use health checks\n- Optimize startup time\n- Implement graceful shutdowns',
    'Essential Docker best practices for production deployments, covering image optimization, security, and performance considerations.',
    'admin',
    true,
    ARRAY['Docker', 'Production', 'Security'],
    '6 min read',
    CURRENT_TIMESTAMP
),
(
    'Building CI/CD Pipelines with GitHub Actions',
    'github-actions-cicd-pipelines',
    'GitHub Actions provides a powerful platform for building robust CI/CD pipelines directly in your GitHub repository.\n\n## Why GitHub Actions?\n\n- **Native Integration**: Built into GitHub\n- **Rich Ecosystem**: Thousands of pre-built actions\n- **Flexible Workflows**: Support for complex scenarios\n- **Cost Effective**: Generous free tier\n\n## Basic Workflow Structure\n\n```yaml\nname: CI/CD Pipeline\n\non:\n  push:\n    branches: [ main, develop ]\n  pull_request:\n    branches: [ main ]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v3\n    - name: Setup Node.js\n      uses: actions/setup-node@v3\n      with:\n        node-version: 16\n    - name: Install dependencies\n      run: npm ci\n    - name: Run tests\n      run: npm test\n```\n\n## Advanced Features\n\n### Matrix Builds\nTest across multiple versions and platforms\n\n### Secrets Management\nSecurely store API keys and credentials\n\n### Environment Protection\nControl deployments to production\n\n### Reusable Workflows\nShare common workflows across repositories',
    'Learn how to build efficient CI/CD pipelines using GitHub Actions, from basic workflows to advanced deployment strategies.',
    'admin',
    false,
    ARRAY['GitHub Actions', 'CI/CD', 'Automation'],
    '7 min read',
    NULL
)
ON CONFLICT (slug) DO NOTHING;

-- Display success message
SELECT 'Database setup completed successfully!' as message;

-- Show created data
SELECT 'Users created:' as info, COUNT(*) as count FROM users;
SELECT 'Blog posts created:' as info, COUNT(*) as count FROM blog_posts;