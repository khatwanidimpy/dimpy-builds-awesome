import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getAdminBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById
} from '../controllers/blogController';

const router = express.Router();

// Public Routes (no authentication required)

/**
 * @route   GET /api/blog
 * @desc    Get all published blog posts
 * @access  Public
 */
router.get('/', [
  query('search').optional().isString(),
  query('tags').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], getAllBlogPosts);

/**
 * @route   GET /api/blog/:slug
 * @desc    Get single blog post by slug
 * @access  Public
 */
router.get('/:slug', [
  param('slug').notEmpty().withMessage('Slug is required')
], getBlogPostBySlug);

// Admin Routes (authentication required)

/**
 * @route   GET /api/blog/admin/posts
 * @desc    Get all blog posts for admin (includes drafts)
 * @access  Private (Admin)
 */
router.get('/admin/posts', [
  authenticateToken,
  requireAdmin,
  query('published').optional().isBoolean(),
  query('search').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], getAdminBlogPosts);

/**
 * @route   GET /api/blog/admin/:id
 * @desc    Get single blog post by ID for admin
 * @access  Private (Admin)
 */
router.get('/admin/:id', [
  authenticateToken,
  requireAdmin,
  param('id').isInt().withMessage('Valid blog post ID is required')
], getBlogPostById);

/**
 * @route   POST /api/blog/admin
 * @desc    Create new blog post
 * @access  Private (Admin)
 */
router.post('/admin', [
  authenticateToken,
  requireAdmin,
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  body('excerpt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('featured_image')
    .optional()
    .isURL()
    .withMessage('Featured image must be a valid URL'),
  body('read_time')
    .optional()
    .isString()
    .withMessage('Read time must be a string')
], createBlogPost);

/**
 * @route   PUT /api/blog/admin/:id
 * @desc    Update blog post
 * @access  Private (Admin)
 */
router.put('/admin/:id', [
  authenticateToken,
  requireAdmin,
  param('id').isInt().withMessage('Valid blog post ID is required'),
  body('title')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('content')
    .optional()
    .notEmpty()
    .withMessage('Content cannot be empty'),
  body('excerpt')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('featured_image')
    .optional()
    .isURL()
    .withMessage('Featured image must be a valid URL'),
  body('read_time')
    .optional()
    .isString()
    .withMessage('Read time must be a string')
], updateBlogPost);

/**
 * @route   DELETE /api/blog/admin/:id
 * @desc    Delete blog post
 * @access  Private (Admin)
 */
router.delete('/admin/:id', [
  authenticateToken,
  requireAdmin,
  param('id').isInt().withMessage('Valid blog post ID is required')
], deleteBlogPost);

export default router;