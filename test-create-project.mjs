import axios from 'axios';

async function testCreateProject() {
  try {
    console.log('Logging in...');
    
    // Login to get token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('Login successful!');
    
    // Create a new project
    console.log('Creating a new project...');
    const projectData = {
      title: 'Test Project',
      description: 'This is a test project to verify the publish functionality',
      content: 'This is the detailed content of the test project...',
      technologies: ['React', 'Node.js', 'TypeScript'],
      project_url: 'https://example.com',
      github_url: 'https://github.com/example/project',
      published: true // This is the key field we're testing
    };
    
    const createResponse = await axios.post('http://localhost:5000/api/projects/admin', projectData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Project created successfully!');
    console.log('Project ID:', createResponse.data.data.project.id);
    
    // Verify the project is published by fetching public projects
    console.log('Fetching published projects...');
    const publicResponse = await axios.get('http://localhost:5000/api/projects?published=true');
    
    console.log('Published projects count:', publicResponse.data.data.projects.length);
    
    // Check if our project is in the list
    const ourProject = publicResponse.data.data.projects.find(
      p => p.id === createResponse.data.data.project.id
    );
    
    if (ourProject) {
      console.log('✓ Project is successfully published and visible publicly');
    } else {
      console.log('✗ Project is not visible publicly');
    }
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testCreateProject();