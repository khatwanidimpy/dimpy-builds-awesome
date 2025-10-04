const axios = require('axios');

// Test creating a blog post
async function testBlogPost() {
  try {
    // Login to get token
    console.log('Attempting to login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Login successful:', loginResponse.data);
    const token = loginResponse.data.data.token;
    console.log('Token:', token);
    
    // Create a test blog post
    const blogPost = {
      title: 'Test Blog Post',
      content: '# This is a test blog post\n\nThis is the content of our test blog post. It shows how we can create blog posts through the API.',
      excerpt: 'This is a test blog post excerpt',
      published: true,
      tags: ['test', 'api', 'blog'],
      read_time: '3 min read'
    };
    
    console.log('Creating blog post...');
    const createResponse = await axios.post('http://localhost:5000/api/blog/admin', blogPost, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Blog post created:', createResponse.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testBlogPost();