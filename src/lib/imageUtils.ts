/**
 * Utility functions for handling image URLs in the application
 */

// Base URL for backend API (without /api prefix for image URLs)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';

/**
 * Function to get full image URL for uploaded images
 * @param imagePath - The image path from the database (could be a filename, relative path, or full URL)
 * @returns The full URL to access the image
 */
export const getImageUrl = (imagePath: string | null): string | null => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /uploads, prefix with API base URL
  if (imagePath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // If it looks like a filename (no path separators), construct the full path
  if (!imagePath.includes('/') && !imagePath.includes('\\')) {
    return `${API_BASE_URL}/uploads/${imagePath}`;
  }
  
  // For any other case, assume it's a relative path
  return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};