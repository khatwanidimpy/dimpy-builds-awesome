import pool from '../config/database';
import bcrypt from 'bcryptjs';

// Create tables
export const createTables = async (): Promise<void> => {
  const client = await pool.connect();
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create blog_posts table
    await client.query(`
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
      )
    `);

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        content TEXT NOT NULL,
        technologies TEXT[] DEFAULT '{}',
        featured_image VARCHAR(500),
        project_url VARCHAR(500),
        github_url VARCHAR(500),
        published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published_at TIMESTAMP
      )
    `);
    
    // Add published_at column if it doesn't exist (for existing databases)
    try {
      await client.query(`
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS published_at TIMESTAMP
      `);
    } catch (error) {
      console.log('published_at column already exists or error adding it:', error);
    }
    
    // Add published column if it doesn't exist (for existing databases)
    try {
      await client.query(`
        ALTER TABLE projects ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false
      `);
    } catch (error) {
      console.log('published column already exists or error adding it:', error);
    }

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Seed initial admin user
export const seedAdminUser = async (): Promise<void> => {
  const client = await pool.connect();
  
  try {
    // Check if admin user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE username = $1',
      [process.env.ADMIN_USERNAME || 'admin']
    );

    if (existingUser.rows.length === 0) {
      // Hash the admin password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'admin123',
        saltRounds
      );

      // Insert admin user
      await client.query(`
        INSERT INTO users (username, password_hash, email, role)
        VALUES ($1, $2, $3, $4)
      `, [
        process.env.ADMIN_USERNAME || 'admin',
        passwordHash,
        'admin@dimpykhatwani.dev',
        'admin'
      ]);

      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Initialize database
export const initializeDatabase = async (): Promise<void> => {
  try {
    await createTables();
    await seedAdminUser();
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};