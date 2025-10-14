/**
 * SEO utility functions for managing meta tags and page titles
 */

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  author?: string;
}

/**
 * Default SEO configuration
 */
const DEFAULT_SEO: SEOConfig = {
  title: "Dimpy Khatwani - DevOps Engineer | Portfolio",
  description: "DevOps Engineer specializing in AWS, Docker, Kubernetes, and CI/CD automation. Explore my projects and experience in cloud infrastructure.",
  keywords: ["DevOps", "AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Jenkins", "Cloud Engineer"],
  ogTitle: "Dimpy Khatwani - DevOps Engineer Portfolio",
  ogDescription: "Professional DevOps Engineer with expertise in cloud automation, containerization, and scalable infrastructure.",
  ogImage: "/og-image.jpg",
  ogUrl: "https://dimpykhatwani.dev",
  twitterCard: "summary_large_image",
  author: "Dimpy Khatwani"
};

/**
 * Update document meta tags
 * @param config SEO configuration
 */
export const updateMetaTags = (config: Partial<SEOConfig> = {}) => {
  const seoConfig = { ...DEFAULT_SEO, ...config };
  
  // Update title
  document.title = seoConfig.title;
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    (metaDescription as HTMLMetaElement).content = seoConfig.description;
  } else {
    metaDescription = document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    metaDescription.setAttribute("content", seoConfig.description);
    document.head.appendChild(metaDescription);
  }
  
  // Update keywords
  if (seoConfig.keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      (metaKeywords as HTMLMetaElement).content = seoConfig.keywords.join(", ");
    } else {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      metaKeywords.setAttribute("content", seoConfig.keywords.join(", "));
      document.head.appendChild(metaKeywords);
    }
  }
  
  // Update author
  if (seoConfig.author) {
    let metaAuthor = document.querySelector('meta[name="author"]');
    if (metaAuthor) {
      (metaAuthor as HTMLMetaElement).content = seoConfig.author;
    } else {
      metaAuthor = document.createElement("meta");
      metaAuthor.setAttribute("name", "author");
      metaAuthor.setAttribute("content", seoConfig.author);
      document.head.appendChild(metaAuthor);
    }
  }
  
  // Update Open Graph tags
  updateOpenGraphTags(seoConfig);
  
  // Update Twitter tags
  updateTwitterTags(seoConfig);
};

/**
 * Update Open Graph meta tags
 * @param config SEO configuration
 */
const updateOpenGraphTags = (config: SEOConfig) => {
  // OG Title
  updateMetaProperty("og:title", config.ogTitle || config.title);
  
  // OG Description
  updateMetaProperty("og:description", config.ogDescription || config.description);
  
  // OG Type
  updateMetaProperty("og:type", "website");
  
  // OG URL
  if (config.ogUrl) {
    updateMetaProperty("og:url", config.ogUrl);
  }
  
  // OG Image
  if (config.ogImage) {
    updateMetaProperty("og:image", config.ogImage);
  }
};

/**
 * Update Twitter meta tags
 * @param config SEO configuration
 */
const updateTwitterTags = (config: SEOConfig) => {
  // Twitter Card
  updateMetaProperty("twitter:card", config.twitterCard || "summary");
  
  // Twitter Title
  updateMetaProperty("twitter:title", config.ogTitle || config.title);
  
  // Twitter Description
  updateMetaProperty("twitter:description", config.ogDescription || config.description);
  
  // Twitter Image
  if (config.ogImage) {
    updateMetaProperty("twitter:image", config.ogImage);
  }
};

/**
 * Helper function to update or create meta property tags
 * @param property Property name
 * @param content Content value
 */
const updateMetaProperty = (property: string, content: string) => {
  let metaTag = document.querySelector(`meta[property="${property}"]`);
  if (metaTag) {
    (metaTag as HTMLMetaElement).content = content;
  } else {
    metaTag = document.createElement("meta");
    metaTag.setAttribute("property", property);
    metaTag.setAttribute("content", content);
    document.head.appendChild(metaTag);
  }
};

/**
 * SEO configuration for different page types
 */
export const SEO_CONFIGS = {
  home: {
    title: "Dimpy Khatwani - DevOps Engineer | Portfolio",
    description: "DevOps Engineer specializing in AWS, Docker, Kubernetes, and CI/CD automation. Explore my projects and experience in cloud infrastructure.",
    ogTitle: "Dimpy Khatwani - DevOps Engineer Portfolio",
    ogDescription: "Professional DevOps Engineer with expertise in cloud automation, containerization, and scalable infrastructure."
  },
  blog: {
    title: "Blog - Dimpy Khatwani | DevOps & Cloud Engineering",
    description: "Technical articles and tutorials on DevOps, cloud engineering, AWS, Docker, Kubernetes, and CI/CD automation.",
    ogTitle: "Blog - Dimpy Khatwani | DevOps & Cloud Engineering",
    ogDescription: "Explore technical articles on DevOps practices, cloud infrastructure, and automation tools."
  },
  blogPost: (postTitle: string, postExcerpt: string) => ({
    title: `${postTitle} - Dimpy Khatwani Blog`,
    description: postExcerpt,
    ogTitle: postTitle,
    ogDescription: postExcerpt
  }),
  projects: {
    title: "Projects - Dimpy Khatwani | DevOps Portfolio",
    description: "Explore my DevOps and cloud engineering projects featuring AWS, Docker, Kubernetes, and CI/CD implementations.",
    ogTitle: "Projects - Dimpy Khatwani | DevOps Portfolio",
    ogDescription: "View my portfolio of DevOps and cloud engineering projects with detailed case studies."
  },
  login: {
    title: "Admin Login - Dimpy Khatwani Portfolio",
    description: "Admin login portal for portfolio management.",
    ogTitle: "Admin Login - Dimpy Khatwani Portfolio",
    ogDescription: "Secure admin login for portfolio content management."
  },
  admin: {
    title: "Admin Dashboard - Dimpy Khatwani Portfolio",
    description: "Admin dashboard for managing portfolio content, blog posts, and projects.",
    ogTitle: "Admin Dashboard - Dimpy Khatwani Portfolio",
    ogDescription: "Content management system for portfolio administration."
  }
};