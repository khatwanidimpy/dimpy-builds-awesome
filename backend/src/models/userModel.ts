import pool from '../config/database';
import { User, CreateUserData } from './User';
import bcrypt from 'bcryptjs';

export class UserModel {
  static async findByUsername(username: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM User WHERE username = ?',
      [username]
    );
    
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as User;
    }
    return null;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM User WHERE id = ?',
      [id]
    );
    
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as User;
    }
    return null;
  }

  static async create(userData: CreateUserData): Promise<User> {
    const { username, password, email, role = 'admin' } = userData;
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const [result]: any = await pool.execute(
      'INSERT INTO User (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
      [username, passwordHash, email, role]
    );
    
    const [rows] = await pool.execute(
      'SELECT * FROM User WHERE id = ?',
      [result.insertId]
    );
    
    return (rows as User[])[0];
  }
}