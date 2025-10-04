import { Request, Response } from 'express';
import pool from '../config/database';
import { Project, CreateProjectData, UpdateProjectData } from '../models/Project';
import { sanitizeString } from '../utils/helpers';

/**
 * Get all projects
 */
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if we should only return published projects
    const publishedOnly = req.query.published === 'true';
    
    const client = await pool.connect();
    try {
      let query = `SELECT * FROM projects`;
      const params: any[] = [];
      
      if (publishedOnly) {
        query += ` WHERE published = true`;
      }
      
      query += ` ORDER BY created_at DESC`;
      
      const result = await client.query(query, params);
      
      const projects: Project[] = result.rows.map(row => ({
        ...row,
        technologies: row.technologies || []
      }));
      
      res.json({
        success: true,
        data: {
          projects,
          pagination: {
            total: projects.length,
            limit: projects.length,
            offset: 0,
            pages: 1
          }
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get project by ID
 */
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        success: false,
        message: 'Valid project ID is required'
      });
      return;
    }
    
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM projects WHERE id = $1`,
        [id]
      );
      
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }
      
      const project: Project = {
        ...result.rows[0],
        technologies: result.rows[0].technologies || []
      };
      
      res.json({
        success: true,
        data: {
          project
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create new project
 */
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      content,
      technologies = [],
      featured_image,
      project_url,
      github_url,
      published = false
    }: CreateProjectData = req.body;
    
    // Validate required fields
    if (!title || !description || !content) {
      res.status(400).json({
        success: false,
        message: 'Title, description, and content are required'
      });
      return;
    }
    
    // Sanitize input
    const sanitizedTitle = sanitizeString(title);
    const sanitizedDescription = sanitizeString(description);
    const sanitizedContent = sanitizeString(content);
    const sanitizedTechnologies = Array.isArray(technologies) 
      ? technologies.map(tech => sanitizeString(tech)) 
      : [];
    const sanitizedFeaturedImage = featured_image ? sanitizeString(featured_image) : null;
    const sanitizedProjectUrl = project_url ? sanitizeString(project_url) : null;
    const sanitizedGithubUrl = github_url ? sanitizeString(github_url) : null;
    
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO projects (
          title, description, content, technologies, featured_image, project_url, github_url, published
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          sanitizedTitle,
          sanitizedDescription,
          sanitizedContent,
          sanitizedTechnologies,
          sanitizedFeaturedImage,
          sanitizedProjectUrl,
          sanitizedGithubUrl,
          published
        ]
      );
      
      const project: Project = {
        ...result.rows[0],
        technologies: result.rows[0].technologies || []
      };
      
      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: {
          project
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update project
 */
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      content,
      technologies,
      featured_image,
      project_url,
      github_url,
      published
    }: UpdateProjectData = req.body;
    
    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        success: false,
        message: 'Valid project ID is required'
      });
      return;
    }
    
    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;
    
    if (title !== undefined) {
      updates.push(`title = $${valueIndex++}`);
      values.push(sanitizeString(title));
    }
    
    if (description !== undefined) {
      updates.push(`description = $${valueIndex++}`);
      values.push(sanitizeString(description));
    }
    
    if (content !== undefined) {
      updates.push(`content = $${valueIndex++}`);
      values.push(sanitizeString(content));
    }
    
    if (technologies !== undefined) {
      updates.push(`technologies = $${valueIndex++}`);
      values.push(Array.isArray(technologies) 
        ? technologies.map(tech => sanitizeString(tech)) 
        : []);
    }
    
    if (featured_image !== undefined) {
      updates.push(`featured_image = $${valueIndex++}`);
      values.push(featured_image ? sanitizeString(featured_image) : null);
    }
    
    if (project_url !== undefined) {
      updates.push(`project_url = $${valueIndex++}`);
      values.push(project_url ? sanitizeString(project_url) : null);
    }
    
    if (github_url !== undefined) {
      updates.push(`github_url = $${valueIndex++}`);
      values.push(github_url ? sanitizeString(github_url) : null);
    }
    
    if (published !== undefined) {
      updates.push(`published = $${valueIndex++}`);
      values.push(published);
      
      // Add published_at timestamp update
      updates.push(`published_at = $${valueIndex++}`);
      values.push(published ? new Date() : null);
    }
    
    // Always update the updated_at timestamp
    updates.push(`updated_at = NOW()`);
    
    // Check if any actual fields (not including updated_at) are being updated
    if (updates.length <= 1) { // Only updated_at was added or no fields
      res.status(400).json({
        success: false,
        message: 'At least one field must be provided for update'
      });
      return;
    }
    
    values.push(id); // Add ID for WHERE clause
    
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE projects SET ${updates.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
        values
      );
      
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }
      
      const project: Project = {
        ...result.rows[0],
        technologies: result.rows[0].technologies || []
      };
      
      res.json({
        success: true,
        message: 'Project updated successfully',
        data: {
          project
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete project
 */
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        success: false,
        message: 'Valid project ID is required'
      });
      return;
    }
    
    const client = await pool.connect();
    try {
      const result = await client.query(
        `DELETE FROM projects WHERE id = $1 RETURNING id`,
        [id]
      );
      
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};