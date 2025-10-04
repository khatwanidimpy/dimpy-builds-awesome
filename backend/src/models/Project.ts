/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Project ID
 *         title:
 *           type: string
 *           description: Project title
 *         description:
 *           type: string
 *           description: Project description
 *         content:
 *           type: string
 *           description: Project content
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *           description: Technologies used in the project
 *         featured_image:
 *           type: string
 *           nullable: true
 *           description: URL to featured image
 *         project_url:
 *           type: string
 *           nullable: true
 *           description: URL to the project
 *         github_url:
 *           type: string
 *           nullable: true
 *           description: URL to the GitHub repository
 *         published:
 *           type: boolean
 *           description: Whether the project is published
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */
export interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  technologies: string[];
  featured_image: string | null;
  project_url: string | null;
  github_url: string | null;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProjectData:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           description: Project title
 *         description:
 *           type: string
 *           description: Project description
 *         content:
 *           type: string
 *           description: Project content
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *           description: Technologies used in the project
 *         featured_image:
 *           type: string
 *           description: URL to featured image
 *         project_url:
 *           type: string
 *           description: URL to the project
 *         github_url:
 *           type: string
 *           description: URL to the GitHub repository
 *         published:
 *           type: boolean
 *           description: Whether the project is published
 */
export interface CreateProjectData {
  title: string;
  description: string;
  content: string;
  technologies?: string[];
  featured_image?: string;
  project_url?: string;
  github_url?: string;
  published?: boolean;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProjectData:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Project title
 *         description:
 *           type: string
 *           description: Project description
 *         content:
 *           type: string
 *           description: Project content
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *           description: Technologies used in the project
 *         featured_image:
 *           type: string
 *           description: URL to featured image
 *         project_url:
 *           type: string
 *           description: URL to the project
 *         github_url:
 *           type: string
 *           description: URL to the GitHub repository
 *         published:
 *           type: boolean
 *           description: Whether the project is published
 */
export interface UpdateProjectData {
  title?: string;
  description?: string;
  content?: string;
  technologies?: string[];
  featured_image?: string;
  project_url?: string;
  github_url?: string;
  published?: boolean;
}