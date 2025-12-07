const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_PORT = process.env.BACKEND_PORT || 5000;

// Serve static files from the React app build directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// API proxy - forward API requests to backend
app.use('/api', (req, res) => {
  // In production, you might want to proxy to the separate backend service
  // For now, we'll handle this in the backend server
  req.pipe(require('http').request({
    hostname: 'localhost',
    port: BACKEND_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers
  }, backendRes => {
    res.writeHead(backendRes.statusCode, backendRes.headers);
    backendRes.pipe(res);
  })).on('error', (err) => {
    console.error('Backend proxy error:', err);
    res.status(500).send('Backend service unavailable');
  }).end();
});

// The "catchall" handler: for any request that doesn't match an API route,
// send back React's index.html file.
app.get(/^(?!\/api).*$/, (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  
  // Check if the frontend has been built
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // If not built, show a helpful message
    res.status(500).send(`
      <h1>Frontend not built yet</h1>
      <p>Please run <code>npm run build</code> to build the frontend first.</p>
      <p>Or run <code>npm run dev:full</code> for development mode.</p>
    `);
  }
});

// Start backend server as a child process
let backendProcess;

function startBackend() {
  console.log('Starting backend server...');
  const backendPath = path.join(__dirname, 'backend/dist/server.js');
  
  // Check if backend has been built
  if (!fs.existsSync(backendPath)) {
    console.error('Backend not built yet. Please run "npm run backend:build" first.');
    process.exit(1);
  }
  
  backendProcess = spawn('node', [backendPath], {
    stdio: 'inherit',
    cwd: path.join(__dirname, 'backend')
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
    if (code !== 0) {
      console.log('Restarting backend server...');
      setTimeout(startBackend, 1000); // Restart after 1 second
    }
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend:', err);
  });
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  if (backendProcess) {
    backendProcess.kill('SIGINT');
  }
  process.exit(0);
});

// Start both servers
app.listen(PORT, () => {
  console.log(`\n🚀 Combined server starting...`);
  console.log(`📁 Frontend static files served from: ${distPath}`);
  console.log(`📡 Frontend server listening on port ${PORT}`);
  console.log(`🔧 Backend server will start on port ${BACKEND_PORT}`);
  console.log(`\n📝 To build the frontend, run: npm run build`);
  console.log(`📝 To build the backend, run: npm run backend:build`);
  console.log(`📝 For development mode, run: npm run dev:full\n`);
  
  // Start backend server
  startBackend();
});