import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import upload from '../middleware/upload';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getAdminProjects
} from '../controllers/projectController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 */

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filter by published status
 *     responses:
 *       200:
 *         description: List of projects
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
 *                     projects:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           content:
 *                             type: string
 *                           technologies:
 *                             type: array
 *                             items:
 *                               type: string
 *                           featured_image:
 *                             type: string
 *                           project_url:
 *                             type: string
 *                           github_url:
 *                             type: string
 *                           published:
 *                             type: boolean
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           updated_at:
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
  query('published').optional().isBoolean(),
  query('search').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], getAllProjects);

/**
 * @swagger
 * /api/projects/admin:
 *   get:
 *     summary: Get all projects (admin)
 *     tags: [Projects]
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
 *         description: Search in title or description
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of projects per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of projects to skip
 *     responses:
 *       200:
 *         description: List of projects
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
 *                     projects:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           content:
 *                             type: string
 *                           technologies:
 *                             type: array
 *                             items:
 *                               type: string
 *                           featured_image:
 *                             type: string
 *                           project_url:
 *                             type: string
 *                           github_url:
 *                             type: string
 *                           published:
 *                             type: boolean
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           updated_at:
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/admin', [
  authenticateToken,
  requireAdmin,
  query('published').optional().isBoolean(),
  query('search').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], getAdminProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get single project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: Project details
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
 *                     project:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         content:
 *                           type: string
 *                         technologies:
 *                           type: array
 *                           items:
 *                             type: string
 *                         featured_image:
 *                           type: string
 *                         project_url:
 *                           type: string
 *                         github_url:
 *                           type: string
 *                         published:
 *                           type: boolean
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
 *         description: Valid project ID is required
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', [
  param('id').isInt().withMessage('Valid project ID is required')
], getProjectById);

/**
 * @swagger
 * /api/projects/admin:
 *   post:
 *     summary: Create new project
 *     tags: [Projects]
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
 *               - description
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Project title
 *               description:
 *                 type: string
 *                 description: Project description
 *               content:
 *                 type: string
 *                 description: Project content
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Technologies used in the project
 *               featured_image:
 *                 type: string
 *                 description: URL to featured image
 *               project_url:
 *                 type: string
 *                 description: URL to the project
 *               github_url:
 *                 type: string
 *                 description: URL to the GitHub repository
 *               published:
 *                 type: boolean
 *                 description: Whether the project is published
 *     responses:
 *       201:
 *         description: Project created successfully
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
 *                     project:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         content:
 *                           type: string
 *                         technologies:
 *                           type: array
 *                           items:
 *                             type: string
 *                         featured_image:
 *                           type: string
 *                         project_url:
 *                           type: string
 *                         github_url:
 *                           type: string
 *                         published:
 *                           type: boolean
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
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  body('featured_image')
    .optional()
    .isURL()
    .withMessage('Featured image must be a valid URL'),
  body('project_url')
    .optional()
    .isURL()
    .withMessage('Project URL must be a valid URL'),
  body('github_url')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean')
], createProject);

/**
 * @swagger
 * /api/projects/admin/upload:
 *   post:
 *     summary: Upload project image
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
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
 *                     url:
 *                       type: string
 *                     filename:
 *                       type: string
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post('/admin/upload', [
  authenticateToken,
  requireAdmin
], upload.single('image'), (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return the URL where the file can be accessed
    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/projects/admin/{id}:
 *   put:
 *     summary: Update project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Project title
 *               description:
 *                 type: string
 *                 description: Project description
 *               content:
 *                 type: string
 *                 description: Project content
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Technologies used in the project
 *               featured_image:
 *                 type: string
 *                 description: URL to featured image
 *               project_url:
 *                 type: string
 *                 description: URL to the project
 *               github_url:
 *                 type: string
 *                 description: URL to the GitHub repository
 *               published:
 *                 type: boolean
 *                 description: Whether the project is published
 *     responses:
 *       200:
 *         description: Project updated successfully
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
 *                     project:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         content:
 *                           type: string
 *                         technologies:
 *                           type: array
 *                           items:
 *                             type: string
 *                         featured_image:
 *                           type: string
 *                         project_url:
 *                           type: string
 *                         github_url:
 *                           type: string
 *                         published:
 *                           type: boolean
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
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.put('/admin/:id', [
  authenticateToken,
  requireAdmin,
  param('id').isInt().withMessage('Valid project ID is required'),
  body('title')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('content')
    .optional()
    .notEmpty()
    .withMessage('Content cannot be empty'),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  body('featured_image')
    .optional()
    .isURL()
    .withMessage('Featured image must be a valid URL'),
  body('project_url')
    .optional()
    .isURL()
    .withMessage('Project URL must be a valid URL'),
  body('github_url')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published must be a boolean')
], updateProject);

/**
 * @swagger
 * /api/projects/admin/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: Project deleted successfully
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
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.delete('/admin/:id', [
  authenticateToken,
  requireAdmin,
  param('id').isInt().withMessage('Valid project ID is required')
], deleteProject);

export default router;