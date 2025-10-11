const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  return data;
};

// Blog API functions
export const blogApi = {
  // Get all published blog posts
  getAllPosts: async (params?: {
    search?: string;
    tags?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/blog?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  // Get single blog post by slug
  getPostBySlug: async (slug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  // Get admin blog posts
  getAdminPosts: async (token: string, params?: {
    published?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/blog/admin/posts?${searchParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching admin blog posts:', error);
      throw error;
    }
  },

  // Create blog post
  createPost: async (token: string, postData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  // Update blog post
  updatePost: async (token: string, id: number, postData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  // Delete blog post
  deletePost: async (token: string, id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },

  // Upload image for blog post
  uploadImage: async (token: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/blog/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

// Auth API functions
export const authApi = {
  // Login
  login: async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  // Verify token
  verifyToken: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  },

  // Get profile
  getProfile: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
};

// Projects API functions
export const projectsApi = {
  // Get all published projects
  getAllProjects: async (params?: {
    published?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/projects?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get admin projects
  getAdminProjects: async (token: string, params?: {
    published?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/projects/admin?${searchParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching admin projects:', error);
      throw error;
    }
  },

  // Create project
  createProject: async (token: string, projectData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project
  updateProject: async (token: string, id: number, projectData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  deleteProject: async (token: string, id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Upload image for project
  uploadImage: async (token: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/projects/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }
      return data;
    } catch (error) {
      console.error('Error uploading project image:', error);
      throw error;
    }
  }
};