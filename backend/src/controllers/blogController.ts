import { Request, Response } from 'express';
import pool from '../config/database';
import { 
  BlogPost, 
  CreateBlogPostData, 
  UpdateBlogPostData, 
  BlogPostFilters 
} from '../models/BlogPost';
import { 
  generateSlug, 
  calculateReadTime, 
  extractExcerpt, 
  sanitizeString 
} from '../utils/helpers';

/**
 * Get All Blog Posts (Public - only published posts)
 */
export const getAllBlogPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      search, 
      tags, 
      limit = '10', 
      offset = '0' 
    } = req.query;

    const client = await pool.connect();
    try {
      let query = `
        SELECT id, title, slug, excerpt, author, tags, featured_image, 
               read_time, created_at, published_at
        FROM blog_posts 
        WHERE published = true
      `;
      const queryParams: any[] = [];
      let paramCount = 0;

      // Add search filter
      if (search && typeof search === 'string') {
        paramCount++;
        query += ` AND (title ILIKE $${paramCount} OR excerpt ILIKE $${paramCount})`;
        queryParams.push(`%${search}%`);
      }

      // Add tags filter
      if (tags && typeof tags === 'string') {
        paramCount++;
        query += ` AND tags && $${paramCount}`;
        queryParams.push([tags]);
      }

      // Add ordering and pagination
      query += ` ORDER BY published_at DESC, created_at DESC`;
      
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      queryParams.push(parseInt(limit as string) || 10);
      
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      queryParams.push(parseInt(offset as string) || 0);

      const result = await client.query(query, queryParams);

      // Get total count for pagination
      let countQuery = `SELECT COUNT(*) FROM blog_posts WHERE published = true`;
      const countParams: any[] = [];
      let countParamCount = 0;

      if (search && typeof search === 'string') {
        countParamCount++;
        countQuery += ` AND (title ILIKE $${countParamCount} OR excerpt ILIKE $${countParamCount})`;
        countParams.push(`%${search}%`);
      }

      if (tags && typeof tags === 'string') {
        countParamCount++;
        countQuery += ` AND tags && $${countParamCount}`;
        countParams.push([tags]);
      }

      const countResult = await client.query(countQuery, countParams);
      const totalCount = parseInt(countResult.rows[0].count);

      res.json({
        success: true,
        data: {
          posts: result.rows,
          pagination: {
            total: totalCount,
            limit: parseInt(limit as string) || 10,
            offset: parseInt(offset as string) || 0,
            pages: Math.ceil(totalCount / (parseInt(limit as string) || 10))
          }
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Get all blog posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get Single Blog Post by Slug (Public - only published posts)
 */
export const getBlogPostBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!slug) {
      res.status(400).json({
        success: false,
        message: 'Slug is required'
      });
      return;
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM blog_posts 
         WHERE slug = $1 AND published = true`,
        [slug]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          post: result.rows[0]
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Get blog post by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get All Blog Posts for Admin (includes drafts)
 */
export const getAdminBlogPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      published, 
      search, 
      limit = '10', 
      offset = '0' 
    } = req.query;

    const client = await pool.connect();
    try {
      let query = `
        SELECT * FROM blog_posts
      `;
      const queryParams: any[] = [];
      let paramCount = 0;
      let whereAdded = false;

      // Add published filter
      if (published !== undefined) {
        paramCount++;
        query += ` WHERE published = $${paramCount}`;
        queryParams.push(published === 'true');
        whereAdded = true;
      }

      // Add search filter
      if (search && typeof search === 'string') {
        paramCount++;
        query += whereAdded ? ` AND` : ` WHERE`;
        query += ` (title ILIKE $${paramCount} OR content ILIKE $${paramCount})`;
        queryParams.push(`%${search}%`);
        whereAdded = true;
      }

      // Add ordering and pagination
      query += ` ORDER BY created_at DESC`;
      
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      queryParams.push(parseInt(limit as string) || 10);
      
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      queryParams.push(parseInt(offset as string) || 0);

      const result = await client.query(query, queryParams);

      res.json({
        success: true,
        data: {
          posts: result.rows
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Get admin blog posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create New Blog Post (Admin only)
 */
export const createBlogPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      content,
      excerpt,
      published = false,
      tags = [],
      featured_image,
      read_time
    }: CreateBlogPostData = req.body;

    // Validate required fields
    if (!title || !content) {
      res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
      return;
    }

    // Get author from authenticated user
    const author = req.user?.username || 'Admin';

    // Generate slug from title
    const baseSlug = generateSlug(title);
    
    const client = await pool.connect();
    try {
      // Check if slug already exists and make it unique if needed
      let slug = baseSlug;
      let counter = 1;
      while (true) {
        const existingSlug = await client.query(
          'SELECT id FROM blog_posts WHERE slug = $1',
          [slug]
        );
        if (existingSlug.rows.length === 0) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Auto-generate excerpt if not provided
      const finalExcerpt = excerpt || extractExcerpt(content);

      // Auto-calculate read time if not provided
      const finalReadTime = read_time || calculateReadTime(content);

      // Insert blog post
      const insertQuery = `
        INSERT INTO blog_posts (
          title, slug, content, excerpt, author, published, tags, 
          featured_image, read_time, published_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      
      const values = [
        sanitizeString(title),
        slug,
        content, // Don't sanitize content as it may contain HTML
        finalExcerpt,
        author,
        published,
        tags,
        featured_image,
        finalReadTime,
        published ? new Date() : null
      ];

      const result = await client.query(insertQuery, values);

      res.status(201).json({
        success: true,
        message: 'Blog post created successfully',
        data: {
          post: result.rows[0]
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update Blog Post (Admin only)
 */
export const updateBlogPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateBlogPostData = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Blog post ID is required'
      });
      return;
    }

    const client = await pool.connect();
    try {
      // Check if blog post exists
      const existingPost = await client.query(
        'SELECT * FROM blog_posts WHERE id = $1',
        [id]
      );

      if (existingPost.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
        return;
      }

      const currentPost = existingPost.rows[0];
      
      // Build update query dynamically
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramCount = 0;

      // Handle title update (regenerate slug if title changes)
      if (updateData.title && updateData.title !== currentPost.title) {
        paramCount++;
        updateFields.push(`title = $${paramCount}`);
        updateValues.push(sanitizeString(updateData.title));

        // Generate new slug
        const baseSlug = generateSlug(updateData.title);
        let newSlug = baseSlug;
        let counter = 1;
        
        while (true) {
          const existingSlug = await client.query(
            'SELECT id FROM blog_posts WHERE slug = $1 AND id != $2',
            [newSlug, id]
          );
          if (existingSlug.rows.length === 0) break;
          newSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        
        paramCount++;
        updateFields.push(`slug = $${paramCount}`);
        updateValues.push(newSlug);
      }

      // Handle other fields
      if (updateData.content !== undefined) {
        paramCount++;
        updateFields.push(`content = $${paramCount}`);
        updateValues.push(updateData.content);
        
        // Auto-update read time when content changes (only if not explicitly provided)
        if (updateData.read_time === undefined) {
          paramCount++;
          updateFields.push(`read_time = $${paramCount}`);
          updateValues.push(calculateReadTime(updateData.content));
        }
        
        // Auto-update excerpt if not explicitly provided
        if (updateData.excerpt === undefined) {
          paramCount++;
          updateFields.push(`excerpt = $${paramCount}`);
          updateValues.push(extractExcerpt(updateData.content));
        }
      }

      if (updateData.excerpt !== undefined) {
        paramCount++;
        updateFields.push(`excerpt = $${paramCount}`);
        updateValues.push(updateData.excerpt);
      }

      if (updateData.published !== undefined) {
        paramCount++;
        updateFields.push(`published = $${paramCount}`);
        updateValues.push(updateData.published);
        
        // Update published_at timestamp
        paramCount++;
        updateFields.push(`published_at = $${paramCount}`);
        updateValues.push(updateData.published ? new Date() : null);
      }

      if (updateData.tags !== undefined) {
        paramCount++;
        updateFields.push(`tags = $${paramCount}`);
        updateValues.push(updateData.tags);
      }

      if (updateData.featured_image !== undefined) {
        paramCount++;
        updateFields.push(`featured_image = $${paramCount}`);
        updateValues.push(updateData.featured_image);
      }

      if (updateData.read_time !== undefined) {
        paramCount++;
        updateFields.push(`read_time = $${paramCount}`);
        updateValues.push(updateData.read_time);
      }

      // Always update the updated_at timestamp
      paramCount++;
      updateFields.push(`updated_at = $${paramCount}`);
      updateValues.push(new Date());

      if (updateFields.length === 1) { // Only updated_at
        res.status(400).json({
          success: false,
          message: 'No valid fields to update'
        });
        return;
      }

      // Add WHERE clause
      paramCount++;
      updateValues.push(id);

      const updateQuery = `
        UPDATE blog_posts 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(updateQuery, updateValues);

      res.json({
        success: true,
        message: 'Blog post updated successfully',
        data: {
          post: result.rows[0]
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete Blog Post (Admin only)
 */
export const deleteBlogPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Blog post ID is required'
      });
      return;
    }

    const client = await pool.connect();
    try {
      // Check if blog post exists
      const existingPost = await client.query(
        'SELECT id, title FROM blog_posts WHERE id = $1',
        [id]
      );

      if (existingPost.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
        return;
      }

      // Delete the blog post
      await client.query('DELETE FROM blog_posts WHERE id = $1', [id]);

      res.json({
        success: true,
        message: 'Blog post deleted successfully'
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get Single Blog Post by ID (Admin only - includes drafts)
 */
export const getBlogPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'Blog post ID is required'
      });
      return;
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM blog_posts WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          post: result.rows[0]
        }
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Get blog post by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};