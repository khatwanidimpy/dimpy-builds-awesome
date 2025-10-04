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

export interface UpdateBlogPostData {
  title?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
  tags?: string[];
  featured_image?: string;
  read_time?: string;
}

export interface BlogPostFilters {
  published?: boolean;
  author?: string;
  tags?: string[];
  search?: string;
  limit?: number;
  offset?: number;
}