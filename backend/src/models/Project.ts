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