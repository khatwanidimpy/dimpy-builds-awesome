import pool from '../config/database';
import { Project, CreateProjectData, UpdateProjectData } from './Project';

export class ProjectModel {
  static async findAll(filters: any = {}): Promise<Project[]> {
    let query = 'SELECT * FROM Project WHERE 1=1';
    const params: any[] = [];
    
    if (filters.published !== undefined) {
      query += ' AND published = ?';
      params.push(filters.published);
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
    return rows as Project[];
  }

  static async findById(id: number): Promise<Project | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM Project WHERE id = ?',
      [id]
    );
    
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as Project;
    }
    return null;
  }

  static async create(projectData: CreateProjectData): Promise<Project> {
    const {
      title,
      description,
      content,
      technologies = [],
      featured_image,
      project_url,
      github_url,
      published = false
    } = projectData;
    
    const [result]: any = await pool.execute(
      'INSERT INTO Project (title, description, content, technologies, featured_image, project_url, github_url, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, content, JSON.stringify(technologies), featured_image, project_url, github_url, published]
    );
    
    const [rows] = await pool.execute(
      'SELECT * FROM Project WHERE id = ?',
      [result.insertId]
    );
    
    return (rows as Project[])[0];
  }

  static async update(id: number, projectData: UpdateProjectData): Promise<Project | null> {
    const fields: string[] = [];
    const params: any[] = [];
    
    Object.keys(projectData).forEach(key => {
      if (key === 'technologies') {
        fields.push(`${key} = ?`);
        params.push(JSON.stringify(projectData[key as keyof UpdateProjectData]));
      } else {
        fields.push(`${key} = ?`);
        params.push(projectData[key as keyof UpdateProjectData]);
      }
    });
    
    if (fields.length === 0) {
      return await this.findById(id);
    }
    
    params.push(id);
    
    await pool.execute(
      `UPDATE Project SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    
    return await this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const [result]: any = await pool.execute(
      'DELETE FROM Project WHERE id = ?',
      [id]
    );
    
    return result.affectedRows > 0;
  }

  static async count(filters: any = {}): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM Project WHERE 1=1';
    const params: any[] = [];
    
    if (filters.published !== undefined) {
      query += ' AND published = ?';
      params.push(filters.published);
    }
    
    const [rows] = await pool.execute(query, params);
    return (rows as any[])[0].count;
  }
}