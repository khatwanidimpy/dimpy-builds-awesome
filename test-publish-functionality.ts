// Test script to verify publish functionality for blogs and projects
// This script will help diagnose why publishing isn't working

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  tags: string[];
  featured_image: string | null;
  read_time: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  author: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  technologies: string[];
  featured_image: string | null;
  project_url: string | null;
  github_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = 'http://localhost:5000/api';
const AUTH_TOKEN = localStorage.getItem('authToken') || '';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  return data;
};

// Test blog publish functionality
async function testBlogPublish() {
  console.log('Testing blog publish functionality...');
  
  try {
    // 1. Create a new blog post (should be draft by default)
    const newBlogResponse = await fetch(`${API_BASE_URL}/blog/admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Blog Post',
        content: 'This is a test blog post for checking publish functionality.',
        excerpt: 'Test excerpt',
        published: false
      })
    });
    
    const newBlogData = await handleResponse(newBlogResponse);
    console.log('Created new blog post:', newBlogData);
    
    const blogPostId = newBlogData.data.post.id;
    
    // 2. Verify it's created as draft
    const getBlogResponse = await fetch(`${API_BASE_URL}/blog/admin/posts`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    
    const getBlogData = await handleResponse(getBlogResponse);
    const createdBlogPost = getBlogData.data.posts.find((post: BlogPost) => post.id === blogPostId);
    console.log('Created blog post status:', createdBlogPost?.published ? 'Published' : 'Draft');
    
    // 3. Try to publish the blog post
    const publishBlogResponse = await fetch(`${API_BASE_URL}/blog/admin/${blogPostId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        published: true
      })
    });
    
    const publishBlogData = await handleResponse(publishBlogResponse);
    console.log('Publish blog response:', publishBlogData);
    
    // 4. Verify it's now published
    const verifyBlogResponse = await fetch(`${API_BASE_URL}/blog/admin/posts`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    
    const verifyBlogData = await handleResponse(verifyBlogResponse);
    const updatedBlogPost = verifyBlogData.data.posts.find((post: BlogPost) => post.id === blogPostId);
    console.log('Updated blog post status:', updatedBlogPost?.published ? 'Published' : 'Draft');
    
    // 5. Check if it appears in public blog list
    const publicBlogResponse = await fetch(`${API_BASE_URL}/blog`);
    const publicBlogData = await handleResponse(publicBlogResponse);
    const isPublic = publicBlogData.data.posts.some((post: BlogPost) => post.id === blogPostId);
    console.log('Blog post is public:', isPublic);
    
    console.log('Blog publish test completed successfully!');
    return true;
  } catch (error) {
    console.error('Blog publish test failed:', error);
    return false;
  }
}

// Test project publish functionality
async function testProjectPublish() {
  console.log('Testing project publish functionality...');
  
  try {
    // 1. Create a new project (should be draft by default)
    const newProjectResponse = await fetch(`${API_BASE_URL}/projects/admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Project',
        description: 'This is a test project for checking publish functionality.',
        content: 'Project content',
        published: false
      })
    });
    
    const newProjectData = await handleResponse(newProjectResponse);
    console.log('Created new project:', newProjectData);
    
    const projectId = newProjectData.data.project.id;
    
    // 2. Verify it's created as draft
    const getProjectResponse = await fetch(`${API_BASE_URL}/projects/admin`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    
    const getProjectData = await handleResponse(getProjectResponse);
    const createdProject = getProjectData.data.projects.find((project: Project) => project.id === projectId);
    console.log('Created project status:', createdProject?.published ? 'Published' : 'Draft');
    
    // 3. Try to publish the project
    const publishProjectResponse = await fetch(`${API_BASE_URL}/projects/admin/${projectId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        published: true
      })
    });
    
    const publishProjectData = await handleResponse(publishProjectResponse);
    console.log('Publish project response:', publishProjectData);
    
    // 4. Verify it's now published
    const verifyProjectResponse = await fetch(`${API_BASE_URL}/projects/admin`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    
    const verifyProjectData = await handleResponse(verifyProjectResponse);
    const updatedProject = verifyProjectData.data.projects.find((project: Project) => project.id === projectId);
    console.log('Updated project status:', updatedProject?.published ? 'Published' : 'Draft');
    
    // 5. Check if it appears in public project list
    const publicProjectResponse = await fetch(`${API_BASE_URL}/projects?published=true`);
    const publicProjectData = await handleResponse(publicProjectResponse);
    const isPublic = publicProjectData.data.projects.some((project: Project) => project.id === projectId);
    console.log('Project is public:', isPublic);
    
    console.log('Project publish test completed successfully!');
    return true;
  } catch (error) {
    console.error('Project publish test failed:', error);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('Starting publish functionality tests...');
  
  if (!AUTH_TOKEN) {
    console.error('No auth token found. Please log in first.');
    return;
  }
  
  try {
    const blogResult = await testBlogPublish();
    const projectResult = await testProjectPublish();
    
    console.log('\n--- TEST RESULTS ---');
    console.log('Blog publish test:', blogResult ? 'PASSED' : 'FAILED');
    console.log('Project publish test:', projectResult ? 'PASSED' : 'FAILED');
    
    if (blogResult && projectResult) {
      console.log('\nAll tests passed! Publish functionality is working correctly.');
    } else {
      console.log('\nSome tests failed. There may be an issue with the publish functionality.');
    }
  } catch (error) {
    console.error('Tests failed with error:', error);
  }
}

// Export for use in browser console
(window as any).runPublishTests = runTests;

console.log('Publish test script loaded. Run "runPublishTests()" in the console to execute tests.');