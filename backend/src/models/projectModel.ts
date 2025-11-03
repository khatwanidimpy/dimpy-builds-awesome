import pool from '../config/database';
import { Project, CreateProjectData, UpdateProjectData } from './Project';
import { RowDataPacket } from 'mysql2/promise';

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
    // Parse the technologies field from JSON string to array
    return (rows as RowDataPacket[]).map(row => ({
      ...row,
      technologies: typeof row.technologies === 'string'
        ? JSON.parse(row.technologies)
        : row.technologies || []
    })) as Project[];
  }

  static async findById(id: number): Promise<Project | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM Project WHERE id = ?',
      [id]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const row = rows[0] as RowDataPacket;
      // Parse the technologies field from JSON string to array
      return {
        ...row,
        technologies: typeof row.technologies === 'string'
          ? JSON.parse(row.technologies)
          : row.technologies || []
      } as Project;
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

    // Ensure optional fields are null instead of undefined
    const safeFeaturedImage = featured_image !== undefined ? featured_image : null;
    const safeProjectUrl = project_url !== undefined ? project_url : null;
    const safeGithubUrl = github_url !== undefined ? github_url : null;

    const [result]: any = await pool.execute(
      'INSERT INTO Project (title, description, content, technologies, featured_image, project_url, github_url, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, content, JSON.stringify(technologies), safeFeaturedImage, safeProjectUrl, safeGithubUrl, published]
    );

    const [rows]: [RowDataPacket[], any] = await pool.execute(
      'SELECT * FROM Project WHERE id = ?',
      [result.insertId]
    );

    const row = rows[0];
    // Parse the technologies field from JSON string to array
    return {
      ...row,
      technologies: typeof row.technologies === 'string'
        ? JSON.parse(row.technologies)
        : row.technologies || []
    } as Project;
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
        // Ensure optional fields are null instead of undefined
        const value = projectData[key as keyof UpdateProjectData];
        params.push(value !== undefined ? value : null);
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

    const [rows]: [RowDataPacket[], any] = await pool.execute(query, params);
    return rows[0].count as number;
  }
}