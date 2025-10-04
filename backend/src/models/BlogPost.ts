/**
 * @swagger
 * components:
 *   schemas:
 *     BlogPost:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Blog post ID
 *         title:
 *           type: string
 *           description: Blog post title
 *         slug:
 *           type: string
 *           description: Blog post slug
 *         content:
 *           type: string
 *           description: Blog post content
 *         excerpt:
 *           type: string
 *           description: Blog post excerpt
 *         author:
 *           type: string
 *           description: Blog post author
 *         published:
 *           type: boolean
 *           description: Whether the post is published
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Blog post tags
 *         featured_image:
 *           type: string
 *           description: URL to featured image
 *         read_time:
 *           type: string
 *           description: Estimated read time
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         published_at:
 *           type: string
 *           format: date-time
 *           description: Publication timestamp
 */
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  published: boolean;
  tags: string[];
  featured_image?: string;
  read_time?: string;
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateBlogPostData:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           description: Blog post title
 *         content:
 *           type: string
 *           description: Blog post content
 *         excerpt:
 *           type: string
 *           description: Blog post excerpt
 *         author:
 *           type: string
 *           description: Blog post author
 *         published:
 *           type: boolean
 *           description: Whether the post is published
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Blog post tags
 *         featured_image:
 *           type: string
 *           description: URL to featured image
 *         read_time:
 *           type: string
 *           description: Estimated read time
 */
export interface CreateBlogPostData {
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  published?: boolean;
  tags?: string[];
  featured_image?: string;
  read_time?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateBlogPostData:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Blog post title
 *         content:
 *           type: string
 *           description: Blog post content
 *         excerpt:
 *           type: string
 *           description: Blog post excerpt
 *         published:
 *           type: boolean
 *           description: Whether the post is published
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Blog post tags
 *         featured_image:
 *           type: string
 *           description: URL to featured image
 *         read_time:
 *           type: string
 *           description: Estimated read time
 */
export interface UpdateBlogPostData {
  title?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
  tags?: string[];
  featured_image?: string;
  read_time?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     BlogPostFilters:
 *       type: object
 *       properties:
 *         published:
 *           type: boolean
 *           description: Filter by published status
 *         author:
 *           type: string
 *           description: Filter by author
 *         tags:
 *           type: string
 *           description: Filter by tags
 *         search:
 *           type: string
 *           description: Search term
 *         limit:
 *           type: integer
 *           description: Number of posts to return
 *         offset:
 *           type: integer
 *           description: Number of posts to skip
 */
export interface BlogPostFilters {
  published?: boolean;
  author?: string;
  tags?: string[];
  search?: string;
  limit?: number;
  offset?: number;
}