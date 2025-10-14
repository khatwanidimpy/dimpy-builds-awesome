const fs = require('fs');
const path = require('path');

// Base URL for your site
const BASE_URL = 'https://dimpykhatwani.dev';

// Static pages
const STATIC_PAGES = [
  '',
  '/blog',
  '/projects',
  '/login'
];

// Generate sitemap.xml
const generateSitemap = async () => {
  try {
    // Start building sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Add static pages
    for (const page of STATIC_PAGES) {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${BASE_URL}${page}</loc>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
      sitemap += `  </url>\n`;
    }
    
    // TODO: Add dynamic pages like blog posts and projects
    // This would require fetching data from your API
    
    sitemap += `</urlset>`;
    
    // Write sitemap to public directory
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    
    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

generateSitemap();