import { Request, Response } from 'express';
import { CreateProjectData, UpdateProjectData } from '../models/Project';
import { sanitizeString } from '../utils/helpers';
import { ProjectModel } from '../models/projectModel';

/**
 * Get all projects
 */
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if we should only return published projects
    const publishedOnly = req.query.published === 'true';

    const filters: any = {};
    if (publishedOnly) {
      filters.published = true;
    }

    const projects = await ProjectModel.findAll(filters);

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

    const project = await ProjectModel.findById(parseInt(id));

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        project
      }
    });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get all projects (admin)
 */
export const getAdminProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    // Build filters for filtering
    const filters: any = {};

    // Add published filter if specified
    if (req.query.published !== undefined) {
      filters.published = req.query.published === 'true';
    }

    // Add search filter if specified
    if (req.query.search) {
      filters.search = req.query.search as string;
    }

    // Parse pagination parameters
    const limit = req.query.limit ? Math.min(parseInt(req.query.limit as string), 100) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    // Add pagination to filters
    filters.limit = limit;
    filters.offset = offset;

    // Get projects and total count
    const projects = await ProjectModel.findAll(filters);
    const total = await ProjectModel.count(filters);

    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          total,
          limit,
          offset,
          pages
        }
      }
    });
  } catch (error) {
    console.error('Get admin projects error:', error);
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

    const projectData: any = {
      title: sanitizedTitle,
      description: sanitizedDescription,
      content: sanitizedContent,
      technologies: sanitizedTechnologies,
      published
    };

    // Only add properties if they are not null
    if (sanitizedFeaturedImage !== null) {
      projectData.featured_image = sanitizedFeaturedImage;
    }

    if (sanitizedProjectUrl !== null) {
      projectData.project_url = sanitizedProjectUrl;
    }

    if (sanitizedGithubUrl !== null) {
      projectData.github_url = sanitizedGithubUrl;
    }

    const project = await ProjectModel.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        project
      }
    });
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

    // Build update data
    const data: any = {
      updated_at: new Date()
    };

    if (title !== undefined) {
      data.title = sanitizeString(title);
    }

    if (description !== undefined) {
      data.description = sanitizeString(description);
    }

    if (content !== undefined) {
      data.content = sanitizeString(content);
    }

    if (technologies !== undefined) {
      data.technologies = Array.isArray(technologies)
        ? technologies.map(tech => sanitizeString(tech))
        : [];
    }

    if (featured_image !== undefined) {
      data.featured_image = featured_image ? sanitizeString(featured_image) : null;
    }

    if (project_url !== undefined) {
      data.project_url = project_url ? sanitizeString(project_url) : null;
    }

    if (github_url !== undefined) {
      data.github_url = github_url ? sanitizeString(github_url) : null;
    }

    if (published !== undefined) {
      data.published = published;

      // Add published_at timestamp update
      data.published_at = published ? new Date() : null;
    }

    // Check if any actual fields (not including updated_at) are being updated
    const updateFields = Object.keys(data).filter(key => key !== 'updated_at');
    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one field must be provided for update'
      });
      return;
    }

    const project = await ProjectModel.update(parseInt(id), data);

    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: {
        project
      }
    });
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

    const deleted = await ProjectModel.delete(parseInt(id));
    if (!deleted) {
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
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};