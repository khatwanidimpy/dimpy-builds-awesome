import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import upload from '../middleware/upload';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController';

const router = express.Router();

// Public Routes (no authentication required)

/**
 * @route   GET /api/projects
 * @desc    Get all published projects
 * @access  Public
 */
router.get('/', [
  query('published').optional().isBoolean(),
  query('search').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], getAllProjects);

// Admin Routes (authentication required)

/**
 * @route   GET /api/projects/admin
 * @desc    Get all projects for admin (includes drafts)
 * @access  Private (Admin)
 */
router.get('/admin', [
  authenticateToken,
  requireAdmin,
  query('published').optional().isBoolean(),
  query('search').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], getAllProjects);

/**
 * @route   GET /api/projects/admin/:id
 * @desc    Get single project by ID for admin
 * @access  Private (Admin)
 */
router.get('/admin/:id', [
  authenticateToken,
  requireAdmin,
  param('id').isInt().withMessage('Valid project ID is required')
], getProjectById);

/**
 * @route   POST /api/projects/admin/upload
 * @desc    Upload project image
 * @access  Private (Admin)
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
 * @route   POST /api/projects/admin
 * @desc    Create new project
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
 * @route   PUT /api/projects/admin/:id
 * @desc    Update project
 * @access  Private (Admin)
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
 * @route   DELETE /api/projects/admin/:id
 * @desc    Delete project
 * @access  Private (Admin)
 */
router.delete('/admin/:id', [
  authenticateToken,
  requireAdmin,
  param('id').isInt().withMessage('Valid project ID is required')
], deleteProject);

export default router;