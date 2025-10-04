/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: User ID
 *         username:
 *           type: string
 *           description: Username
 *         password_hash:
 *           type: string
 *           description: Hashed password
 *         email:
 *           type: string
 *           description: User email
 *         role:
 *           type: string
 *           description: User role
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

export interface User {
  id: number;
  username: string;
  password_hash: string;
  email?: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserData:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Username
 *         password:
 *           type: string
 *           description: Password
 *         email:
 *           type: string
 *           description: User email
 *         role:
 *           type: string
 *           description: User role
 */
export interface CreateUserData {
  username: string;
  password: string;
  email?: string;
  role?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Username
 *         password:
 *           type: string
 *           description: Password
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     JWTPayload:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           description: User ID
 *         username:
 *           type: string
 *           description: Username
 *         role:
 *           type: string
 *           description: User role
 */
export interface JWTPayload {
  userId: number;
  username: string;
  role: string;
}