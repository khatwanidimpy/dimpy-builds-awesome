import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
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

const prisma = new PrismaClient();

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

    // Build where clause
    const where: any = {
      published: true
    };

    // Add search filter
    if (search && typeof search === 'string') {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          excerpt: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    // Remove Postgres-specific array filter; we'll filter in memory for SQLite

    // Get posts without pagination first
    const postsRaw = await prisma.blogPost.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        author: true,
        tags: true,
        featured_image: true,
        read_time: true,
        created_at: true,
        published_at: true
      },
      orderBy: [
        {
          published_at: 'desc'
        },
        {
          created_at: 'desc'
        }
      ]
    });

    // Filter by tag if provided (works with JSON array stored in SQLite)
    let filteredPosts = postsRaw;
    if (tags && typeof tags === 'string') {
      filteredPosts = postsRaw.filter((p: any) => Array.isArray(p.tags) && p.tags.includes(tags));
    }

    const totalCount = filteredPosts.length;
    const off = parseInt(offset as string) || 0;
    const lim = parseInt(limit as string) || 10;
    const paginatedPosts = filteredPosts.slice(off, off + lim);

    res.json({
      success: true,
      data: {
        posts: paginatedPosts,
        pagination: {
          total: totalCount,
          limit: lim,
          offset: off,
          pages: Math.ceil(totalCount / lim)
        }
      }
    });

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

    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        published: true
      }
    });

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        post
      }
    });

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

    // Build where clause
    const where: any = {};

    // Add published filter
    if (published !== undefined) {
      where.published = published === 'true';
    }

    // Add search filter
    if (search && typeof search === 'string') {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          content: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    // Get posts with pagination
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: {
        created_at: 'desc'
      },
      skip: parseInt(offset as string) || 0,
      take: parseInt(limit as string) || 10
    });

    res.json({
      success: true,
      data: {
        posts
      }
    });

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

    // Check if slug already exists and make it unique if needed
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existingSlug = await prisma.blogPost.findUnique({
        where: {
          slug
        }
      });
      if (!existingSlug) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Auto-generate excerpt if not provided
    const finalExcerpt = excerpt || extractExcerpt(content);

    // Auto-calculate read time if not provided
    const finalReadTime = read_time || calculateReadTime(content);

    // Insert blog post
    const post = await prisma.blogPost.create({
      data: {
        title: sanitizeString(title),
        slug,
        content, // Don't sanitize content as it may contain HTML
        excerpt: finalExcerpt,
        author,
        published,
        tags,
        featured_image,
        read_time: finalReadTime,
        published_at: published ? new Date() : null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: {
        post
      }
    });

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

    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingPost) {
      res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
      return;
    }

    // Build update data
    const data: any = {
      updated_at: new Date()
    };

    // Handle title update (regenerate slug if title changes)
    if (updateData.title && updateData.title !== existingPost.title) {
      data.title = sanitizeString(updateData.title);

      // Generate new slug
      const baseSlug = generateSlug(updateData.title);
      let newSlug = baseSlug;
      let counter = 1;

      while (true) {
        const existingSlug = await prisma.blogPost.findFirst({
          where: {
            slug: newSlug,
            NOT: {
              id: parseInt(id)
            }
          }
        });
        if (!existingSlug) break;
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      data.slug = newSlug;
    }

    // Handle other fields
    if (updateData.content !== undefined) {
      data.content = updateData.content;

      // Auto-update read time when content changes (only if not explicitly provided)
      if (updateData.read_time === undefined) {
        data.read_time = calculateReadTime(updateData.content);
      }

      // Auto-update excerpt if not explicitly provided
      if (updateData.excerpt === undefined) {
        data.excerpt = extractExcerpt(updateData.content);
      }
    }

    if (updateData.excerpt !== undefined) {
      data.excerpt = updateData.excerpt;
    }

    if (updateData.published !== undefined) {
      data.published = updateData.published;

      // Update published_at timestamp
      data.published_at = updateData.published ? new Date() : null;
    }

    if (updateData.tags !== undefined) {
      data.tags = updateData.tags;
    }

    if (updateData.featured_image !== undefined) {
      data.featured_image = updateData.featured_image;
    }

    if (updateData.read_time !== undefined) {
      data.read_time = updateData.read_time;
    }

    // Update the blog post
    const post = await prisma.blogPost.update({
      where: {
        id: parseInt(id)
      },
      data
    });

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: {
        post
      }
    });

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

    // Check if blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: {
        id: parseInt(id)
      },
      select: {
        id: true,
        title: true
      }
    });

    if (!existingPost) {
      res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
      return;
    }

    // Delete the blog post
    await prisma.blogPost.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

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

    const post = await prisma.blogPost.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        post
      }
    });

  } catch (error) {
    console.error('Get blog post by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};