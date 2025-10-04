const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with admin credentials...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
    
    // Test accessing protected route with token
    if (response.data.success && response.data.data.token) {
      console.log('\nTesting access to admin posts with token...');
      const postsResponse = await axios.get('http://localhost:5000/api/blog/admin/posts', {
        headers: {
          'Authorization': `Bearer ${response.data.data.token}`
        }
      });
      
      console.log('Admin posts access successful!');
      console.log('Posts count:', postsResponse.data.data.posts.length);
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testLogin();