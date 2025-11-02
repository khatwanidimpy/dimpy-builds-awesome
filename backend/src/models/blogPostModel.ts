import pool from '../config/database';
import { BlogPost, CreateBlogPostData, UpdateBlogPostData } from './BlogPost';

export class BlogPostModel {
  static async findAll(filters: any = {}): Promise<BlogPost[]> {
    let query = 'SELECT * FROM BlogPost WHERE 1=1';
    const params: any[] = [];
    
    if (filters.published !== undefined) {
      query += ' AND published = ?';
      params.push(filters.published);
    }
    
    if (filters.author) {
      query += ' AND author = ?';
      params.push(filters.author);
    }
    
    if (filters.search) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }
    
    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }
    
    const [rows] = await pool.execute(query, params);
    return rows as BlogPost[];
  }

  static async findBySlug(slug: string): Promise<BlogPost | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM BlogPost WHERE slug = ?',
      [slug]
    );
    
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as BlogPost;
    }
    return null;
  }

  static async findById(id: number): Promise<BlogPost | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM BlogPost WHERE id = ?',
      [id]
    );
    
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as BlogPost;
    }
    return null;
  }

  static async create(postData: CreateBlogPostData): Promise<BlogPost> {
    const {
      title,
      content,
      excerpt,
      author,
      published = false,
      tags = [],
      featured_image,
      read_time
    } = postData;
    
    // Generate slug from title if not provided
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const [result]: any = await pool.execute(
      'INSERT INTO BlogPost (title, slug, content, excerpt, author, published, tags, featured_image, read_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, content, excerpt, author, published, JSON.stringify(tags), featured_image, read_time]
    );
    
    const [rows] = await pool.execute(
      'SELECT * FROM BlogPost WHERE id = ?',
      [result.insertId]
    );
    
    return (rows as BlogPost[])[0];
  }

  static async update(id: number, postData: UpdateBlogPostData): Promise<BlogPost | null> {
    const fields: string[] = [];
    const params: any[] = [];
    
    Object.keys(postData).forEach(key => {
      if (key === 'tags') {
        fields.push(`${key} = ?`);
        params.push(JSON.stringify(postData[key as keyof UpdateBlogPostData]));
      } else {
        fields.push(`${key} = ?`);
        params.push(postData[key as keyof UpdateBlogPostData]);
      }
    });
    
    if (fields.length === 0) {
      return await this.findById(id);
    }
    
    params.push(id);
    
    await pool.execute(
      `UPDATE BlogPost SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    
    return await this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const [result]: any = await pool.execute(
      'DELETE FROM BlogPost WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  static async count(filters: any = {}): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM BlogPost WHERE 1=1';
    const params: any[] = [];
    
    if (filters.published !== undefined) {
      query += ' AND published = ?';
      params.push(filters.published);
    }
    
    if (filters.author) {
      query += ' AND author = ?';
      params.push(filters.author);
    }
    
    if (filters.search) {
      query += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    
    const [rows] = await pool.execute(query, params);
    return (rows as any[])[0].count;
  }
}