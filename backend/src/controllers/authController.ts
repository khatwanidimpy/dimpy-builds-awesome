import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { LoginCredentials } from '../models/User';
import { generateToken } from '../middleware/auth';
import { sanitizeString } from '../utils/helpers';
import { UserModel } from '../models/userModel';

/**
 * Login Controller
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: LoginCredentials = req.body;

    // Validate input
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
      return;
    }

    // Sanitize input
    const sanitizedUsername = sanitizeString(username);

    // Find user in database
    const user = await UserModel.findByUsername(sanitizedUsername);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    // Return success response (don't send password hash)
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Verify Token Controller
 */
export const verifyToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // If we reach here, the token is valid (middleware passed)
    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get Current User Profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const user = await UserModel.findById(req.user.userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};