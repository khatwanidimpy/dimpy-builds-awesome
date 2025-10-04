import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Error response interface
 */
interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
  stack?: string;
}

/**
 * Global Error Handler
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  const response: ErrorResponse = {
    success: false,
    message: err.message || 'Internal Server Error'
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    response.message = 'Validation Error';
    response.errors = Object.values(err.errors).map((error: any) => ({
      field: error.path,
      message: error.message
    }));
    res.status(400).json(response);
    return;
  }

  if (err.code === '23505') { // PostgreSQL unique violation
    response.message = 'Resource already exists';
    res.status(409).json(response);
    return;
  }

  if (err.code === '23503') { // PostgreSQL foreign key violation
    response.message = 'Referenced resource not found';
    res.status(404).json(response);
    return;
  }

  // Default error response
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json(response);
};

/**
 * Validation Error Handler
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }
  
  next();
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

/**
 * Async Error Wrapper
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};