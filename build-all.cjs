const { execSync } = require('child_process');
const path = require('path');

console.log('📦 Building full application...\n');

try {
  // Build frontend
  console.log('🏗️  Building frontend...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Frontend build completed!\n');
  
  // Build backend
  console.log('⚙️  Building backend...');
  execSync('npm run backend:build', { stdio: 'inherit' });
  console.log('✅ Backend build completed!\n');
  
  console.log('🎉 All builds completed successfully!');
  console.log('\n🚀 To start the application, run: npm start');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}