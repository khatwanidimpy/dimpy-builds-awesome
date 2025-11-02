import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  let connection: mysql.Connection | null = null;
  
  try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'portfolio_db'
      });

    // Check if admin user already exists
    const [rows] = await connection.execute(
      'SELECT id FROM User WHERE username = ?',
      ['admin']
    );

    if (Array.isArray(rows) && rows.length === 0) {
      // Hash the admin password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash('admin123', saltRounds);

      // Create admin user
      await connection.execute(
        'INSERT INTO User (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
        ['admin', passwordHash, 'admin@example.com', 'admin']
      );

      console.log('✅ Admin user created successfully');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('⚠️  Remember to change these credentials in production!');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Error seeding database:', error.message);
      if (error.message.includes('ECONNREFUSED')) {
        console.error('💡 Tip: Make sure MySQL is installed and running on your system.');
        console.error('💡 Tip: You can download MySQL from https://dev.mysql.com/downloads/mysql/');
      } else if (error.message.includes('Unknown database')) {
        console.error('💡 Tip: Make sure the database exists. Create it with: CREATE DATABASE portfolio_db;');
      }
    } else {
      console.error('❌ Unknown error seeding database:', error);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

seedDatabase();