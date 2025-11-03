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
  canonicalUrl?: string;
  robots?: string;
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
  ogUrl: "https://dimpykhatwani.com",
  twitterCard: "summary_large_image",
  author: "Dimpy Khatwani",
  canonicalUrl: "https://dimpykhatwani.com",
  robots: "index, follow"
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
  
  // Update canonical URL
  if (seoConfig.canonicalUrl) {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", seoConfig.canonicalUrl);
    } else {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      canonicalLink.setAttribute("href", seoConfig.canonicalUrl);
      document.head.appendChild(canonicalLink);
    }
  }
  
  // Update robots
  if (seoConfig.robots) {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta) {
      (robotsMeta as HTMLMetaElement).content = seoConfig.robots;
    } else {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      robotsMeta.setAttribute("content", seoConfig.robots);
      document.head.appendChild(robotsMeta);
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
  
  // OG Site Name
  updateMetaProperty("og:site_name", "Dimpy Khatwani Portfolio");
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
  
  // Twitter Site
  updateMetaProperty("twitter:site", "@dimpykhatwani");
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
    title: "Dimpy Khatwani - Senior DevOps Engineer | AWS, Docker, Kubernetes Expert",
    description: "Senior DevOps Engineer specializing in AWS, Docker, Kubernetes, and CI/CD automation. Explore my portfolio of cloud infrastructure projects and technical expertise.",
    keywords: ["DevOps Engineer", "AWS Expert", "Docker Specialist", "Kubernetes Expert", "CI/CD Automation", "Cloud Infrastructure", "Terraform", "Jenkins"],
    ogTitle: "Dimpy Khatwani - Senior DevOps Engineer Portfolio",
    ogDescription: "Professional DevOps Engineer with expertise in cloud automation, containerization, and scalable infrastructure solutions.",
    canonicalUrl: "https://dimpykhatwani.com"
  },
  skills: {
    title: "DevOps Skills & Expertise - Dimpy Khatwani | AWS, Docker, Kubernetes",
    description: "Explore my technical expertise in DevOps, Cloud Platforms, Containerization, CI/CD, and Infrastructure as Code. AWS, Docker, Kubernetes, Terraform specialist.",
    keywords: ["DevOps Skills", "AWS Skills", "Docker Expertise", "Kubernetes Skills", "CI/CD Expertise", "Infrastructure as Code", "Terraform", "Cloud Engineering"],
    ogTitle: "DevOps Skills & Expertise - Dimpy Khatwani",
    ogDescription: "Detailed overview of my technical skills in DevOps, Cloud Engineering, and Infrastructure Automation with AWS, Docker, and Kubernetes.",
    canonicalUrl: "https://dimpykhatwani.com/skills"
  },
  experience: {
    title: "Professional Experience - Dimpy Khatwani | DevOps Career Journey",
    description: "Discover my professional experience as a DevOps Engineer, including roles at Toshal Infotech, Infinity Brains, and Narola Infotech with key achievements.",
    keywords: ["DevOps Experience", "Cloud Engineer Career", "DevOps Roles", "Infrastructure Automation Experience", "CI/CD Implementation"],
    ogTitle: "Professional Experience - Dimpy Khatwani | DevOps Career",
    ogDescription: "Explore my career progression and key achievements in DevOps and Cloud Engineering roles with detailed case studies.",
    canonicalUrl: "https://dimpykhatwani.com/experience"
  },
  portfolio: {
    title: "DevOps Projects Portfolio - Dimpy Khatwani | AWS, Docker, Kubernetes",
    description: "View my DevOps and Cloud Engineering portfolio featuring projects with AWS, Docker, Kubernetes, and CI/CD implementations with case studies.",
    keywords: ["DevOps Portfolio", "Cloud Projects", "AWS Projects", "Docker Projects", "Kubernetes Case Studies", "CI/CD Implementations"],
    ogTitle: "DevOps Projects Portfolio - Dimpy Khatwani",
    ogDescription: "Explore my portfolio of DevOps projects with detailed case studies and technical implementations using AWS, Docker, and Kubernetes.",
    canonicalUrl: "https://dimpykhatwani.com/portfolio"
  },
  blog: {
    title: "DevOps & Cloud Engineering Blog - Dimpy Khatwani | Technical Articles",
    description: "Technical articles and tutorials on DevOps, cloud engineering, AWS, Docker, Kubernetes, and CI/CD automation best practices.",
    keywords: ["DevOps Blog", "Cloud Engineering Articles", "AWS Tutorials", "Docker Tutorials", "Kubernetes Guides", "CI/CD Best Practices"],
    ogTitle: "DevOps & Cloud Engineering Blog - Dimpy Khatwani",
    ogDescription: "Explore technical articles on DevOps practices, cloud infrastructure, and automation tools with hands-on tutorials.",
    canonicalUrl: "https://dimpykhatwani.com/blog"
  },
  blogPost: (postTitle: string, postExcerpt: string) => ({
    title: `${postTitle} - Dimpy Khatwani DevOps Blog`,
    description: postExcerpt,
    ogTitle: postTitle,
    ogDescription: postExcerpt,
    canonicalUrl: `https://dimpykhatwani.com/blog/${postTitle.toLowerCase().replace(/\s+/g, '-')}`
  }),
  projects: {
    title: "DevOps & Cloud Projects - Dimpy Khatwani Portfolio | Case Studies",
    description: "Explore my DevOps and cloud engineering projects featuring AWS, Docker, Kubernetes, and CI/CD implementations with detailed case studies.",
    keywords: ["DevOps Projects", "Cloud Engineering", "AWS Case Studies", "Docker Implementations", "Kubernetes Solutions", "CI/CD Projects"],
    ogTitle: "DevOps & Cloud Projects - Dimpy Khatwani Portfolio",
    ogDescription: "View my portfolio of DevOps and cloud engineering projects with detailed case studies and technical solutions.",
    canonicalUrl: "https://dimpykhatwani.com/projects"
  },
  login: {
    title: "Admin Login - Dimpy Khatwani Portfolio",
    description: "Admin login portal for portfolio management.",
    robots: "noindex, nofollow",
    canonicalUrl: "https://dimpykhatwani.com/login"
  },
  admin: {
    title: "Admin Dashboard - Dimpy Khatwani Portfolio",
    description: "Admin dashboard for managing portfolio content, blog posts, and projects.",
    robots: "noindex, nofollow",
    canonicalUrl: "https://dimpykhatwani.com/admin"
  }
};