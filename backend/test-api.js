#!/usr/bin/env node

/**
 * Simple API Test Script
 * Tests the main endpoints of the portfolio backend API
 */

const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Simple HTTP request function
async function makeRequest(method, endpoint, data = null, headers = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  const result = await makeRequest('GET', '/health');
  console.log(`Status: ${result.status}`);
  console.log('Response:', result.data || result.error);
  return result.status === 200;
}

async function testLogin() {
  console.log('\n🔐 Testing Login...');
  const loginData = {
    username: 'admin',
    password: 'admin123'
  };
  
  const result = await makeRequest('POST', '/api/auth/login', loginData);
  console.log(`Status: ${result.status}`);
  
  if (result.data && result.data.success) {
    authToken = result.data.data.token;
    console.log('✅ Login successful! Token received.');
    return true;
  } else {
    console.log('❌ Login failed:', result.data || result.error);
    return false;
  }
}

async function testPublicBlogPosts() {
  console.log('\n📚 Testing Public Blog Posts...');
  const result = await makeRequest('GET', '/api/blog');
  console.log(`Status: ${result.status}`);
  
  if (result.data && result.data.success) {
    console.log(`✅ Found ${result.data.data.posts.length} published blog posts`);
    if (result.data.data.posts.length > 0) {
      console.log('First post:', result.data.data.posts[0].title);
    }
    return true;
  } else {
    console.log('❌ Failed to fetch blog posts:', result.data || result.error);
    return false;
  }
}

async function testAdminBlogPosts() {
  if (!authToken) {
    console.log('\n❌ Skipping admin tests - no auth token');
    return false;
  }
  
  console.log('\n🔒 Testing Admin Blog Posts...');
  const result = await makeRequest('GET', '/api/blog/admin/posts', null, {
    Authorization: `Bearer ${authToken}`
  });
  
  console.log(`Status: ${result.status}`);
  
  if (result.data && result.data.success) {
    console.log(`✅ Found ${result.data.data.posts.length} total blog posts (including drafts)`);
    return true;
  } else {
    console.log('❌ Failed to fetch admin blog posts:', result.data || result.error);
    return false;
  }
}

async function testCreateBlogPost() {
  if (!authToken) {
    console.log('\n❌ Skipping create blog test - no auth token');
    return false;
  }
  
  console.log('\n✍️ Testing Create Blog Post...');
  const blogData = {
    title: 'Test Blog Post from API',
    content: 'This is a test blog post created via API to verify the backend functionality.',
    published: false,
    tags: ['Test', 'API']
  };
  
  const result = await makeRequest('POST', '/api/blog/admin', blogData, {
    Authorization: `Bearer ${authToken}`
  });
  
  console.log(`Status: ${result.status}`);
  
  if (result.data && result.data.success) {
    console.log('✅ Blog post created successfully!');
    console.log('Slug:', result.data.data.post.slug);
    return result.data.data.post.id;
  } else {
    console.log('❌ Failed to create blog post:', result.data || result.error);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Portfolio Backend API Tests');
  console.log('================================');
  
  const results = {
    health: await testHealthCheck(),
    login: await testLogin(),
    publicBlog: await testPublicBlogPosts(),
    adminBlog: await testAdminBlogPosts(),
    createBlog: await testCreateBlogPost()
  };
  
  console.log('\n📊 Test Results:');
  console.log('================');
  console.log('Health Check:', results.health ? '✅ PASS' : '❌ FAIL');
  console.log('Login:', results.login ? '✅ PASS' : '❌ FAIL');
  console.log('Public Blog Posts:', results.publicBlog ? '✅ PASS' : '❌ FAIL');
  console.log('Admin Blog Posts:', results.adminBlog ? '✅ PASS' : '❌ FAIL');
  console.log('Create Blog Post:', results.createBlog ? '✅ PASS' : '❌ FAIL');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.values(results).length;
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the backend setup and database connection.');
  }
}

// Check if running directly
if (require.main === module) {
  // Add fetch polyfill for Node.js < 18
  if (!global.fetch) {
    console.log('Installing fetch polyfill...');
    global.fetch = require('node-fetch');
  }
  
  runTests().catch(console.error);
}

module.exports = { runTests };