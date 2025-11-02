import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createTables = async () => {
  let connection: mysql.Connection | null = null;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'portfolio_db'
    });

    // Create User table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS User (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create BlogPost table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS BlogPost (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        author VARCHAR(255) NOT NULL,
        published BOOLEAN NOT NULL DEFAULT false,
        tags JSON,
        featured_image VARCHAR(255),
        read_time VARCHAR(50),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        published_at TIMESTAMP NULL
      )
    `);

    // Create Project table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Project (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        content TEXT NOT NULL,
        technologies JSON,
        featured_image VARCHAR(255),
        project_url VARCHAR(255),
        github_url VARCHAR(255),
        published BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        published_at TIMESTAMP NULL
      )
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error creating database tables:', error.message);
      if (error.message.includes('ECONNREFUSED')) {
        console.error('💡 Tip: Make sure MySQL is installed and running on your system.');
        console.error('💡 Tip: You can download MySQL from https://dev.mysql.com/downloads/mysql/');
      } else if (error.message.includes('Unknown database')) {
        console.error('💡 Tip: Make sure the database exists. Create it with: CREATE DATABASE portfolio_db;');
      }
    } else {
      console.error('❌ Unknown error creating database tables:', error);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

createTables();