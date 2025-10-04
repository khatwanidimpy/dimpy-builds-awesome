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

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog posts management
 */

// Public Routes (no authentication required)

/**
 * @swagger
 * /api/blog:
 *   get:
 *     summary: Get all published blog posts
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter posts by title or excerpt
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter posts by tag
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of posts to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of posts to skip
 *     responses:
 *       200:
 *         description: List of published blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     posts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           slug:
 *                             type: string
 *                           excerpt:
 *                             type: string
 *                           author:
 *                             type: string
 *                           tags:
 *                             type: array
 *                             items:
 *                               type: string
 *                           featured_image:
 *                             type: string
 *                           read_time:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           published_at:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         offset:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/', [
  query('search').optional().isString(),
  query('tags').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], getAllBlogPosts);

/**
 * @swagger
 * /api/blog/{slug}:
 *   get:
 *     summary: Get single blog post by slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug of the blog post
 *     responses:
 *       200:
 *         description: Blog post details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     post:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         title:
 *                           type: string
 *                         slug:
 *                           type: string
 *                         content:
 *                           type: string
 *                         excerpt:
 *                           type: string
 *                         author:
 *                           type: string
 *                         published:
 *                           type: boolean
 *                         tags:
 *                           type: array
 *                           items:
 *                             type: string
 *                         featured_image:
 *                           type: string
 *                         read_time:
 *                           type: string
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                         published_at:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Slug is required
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
router.get('/:slug', [
  param('slug').notEmpty().withMessage('Slug is required')
], getBlogPostBySlug);

// Admin Routes (authentication required)

/**
 * @swagger
 * /api/blog/admin/posts:
 *   get:
 *     summary: Get all blog posts for admin (includes drafts)
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filter by published status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter posts by title or content
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of posts to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of posts to skip
 *     responses:
 *       200:
 *         description: List of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     posts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           slug:
 *                             type: string
 *                           content:
 *                             type: string
 *                           excerpt:
 *                             type: string
 *                           author:
 *                             type: string
 *                           published:
 *                             type: boolean
 *                           tags:
 *                             type: array
 *                             items:
 *                               type: string
 *                           featured_image:
 *                             type: string
 *                           read_time:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                           published_at:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
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
 * @swagger
 * /api/blog/admin/{id}:
 *   get:
 *     summary: Get single blog post by ID for admin
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post
 *     responses:
 *       200:
 *         description: Blog post details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     post:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         title:
 *                           type: string
 *                         slug:
 *                           type: string
 *                         content:
 *                           type: string
 *                         excerpt:
 *                           type: string
 *                         author:
 *                           type: string
 *                         published:
 *                           type: boolean
 *                         tags:
 *                           type: array
 *                           items:
 *                             type: string
 *                         featured_image:
 *                           type: string
 *                         read_time:
 *                           type: string
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                         published_at:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
router.get('/admin/:id', [
  authenticateToken,
  requireAdmin,
  param('id').isInt().withMessage('Valid blog post ID is required')
], getBlogPostById);

/**
 * @swagger
 * /api/blog/admin:
 *   post:
 *     summary: Create new blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog post title
 *               content:
 *                 type: string
 *                 description: Blog post content
 *               excerpt:
 *                 type: string
 *                 description: Blog post excerpt
 *               published:
 *                 type: boolean
 *                 description: Whether the post is published
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for the blog post
 *               featured_image:
 *                 type: string
 *                 description: URL to featured image
 *               read_time:
 *                 type: string
 *                 description: Estimated read time
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     post:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         title:
 *                           type: string
 *                         slug:
 *                           type: string
 *                         content:
 *                           type: string
 *                         excerpt:
 *                           type: string
 *                         author:
 *                           type: string
 *                         published:
 *                           type: boolean
 *                         tags:
 *                           type: array
 *                           items:
 *                             type: string
 *                         featured_image:
 *                           type: string
 *                         read_time:
 *                           type: string
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                         published_at:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
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
 * @swagger
 * /api/blog/admin/{id}:
 *   put:
 *     summary: Update blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog post title
 *               content:
 *                 type: string
 *                 description: Blog post content
 *               excerpt:
 *                 type: string
 *                 description: Blog post excerpt
 *               published:
 *                 type: boolean
 *                 description: Whether the post is published
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for the blog post
 *               featured_image:
 *                 type: string
 *                 description: URL to featured image
 *               read_time:
 *                 type: string
 *                 description: Estimated read time
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     post:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         title:
 *                           type: string
 *                         slug:
 *                           type: string
 *                         content:
 *                           type: string
 *                         excerpt:
 *                           type: string
 *                         author:
 *                           type: string
 *                         published:
 *                           type: boolean
 *                         tags:
 *                           type: array
 *                           items:
 *                             type: string
 *                         featured_image:
 *                           type: string
 *                         read_time:
 *                           type: string
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                         published_at:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
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
 * @swagger
 * /api/blog/admin/{id}:
 *   delete:
 *     summary: Delete blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the blog post
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
router.delete('/admin/:id', [
  authenticateToken,
  requireAdmin,
  param('id').isInt().withMessage('Valid blog post ID is required')
], deleteBlogPost);

export default router;