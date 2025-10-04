#!/usr/bin/env node

/**
 * JWT Secret Key Generator
 * 
 * This script generates a cryptographically secure JWT secret key
 * suitable for production use with the jsonwebtoken library.
 * 
 * Usage:
 *   node scripts/generate-jwt-secret.js
 *   npm run generate-jwt
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Configuration
const SECRET_LENGTH = 64; // 64 bytes = 512 bits (recommended minimum: 256 bits)
const ENV_FILE_PATH = path.join(__dirname, '..', '.env');

/**
 * Generate a cryptographically secure random JWT secret
 * @param {number} length - Length in bytes (default: 64)
 * @returns {string} - Hex-encoded secret key
 */
function generateJWTSecret(length = SECRET_LENGTH) {
  // Generate random bytes using Node.js crypto module
  const randomBytes = crypto.randomBytes(length);
  
  // Convert to hexadecimal string
  return randomBytes.toString('hex');
}

/**
 * Generate a base64-encoded secret (alternative format)
 * @param {number} length - Length in bytes
 * @returns {string} - Base64-encoded secret key
 */
function generateJWTSecretBase64(length = SECRET_LENGTH) {
  const randomBytes = crypto.randomBytes(length);
  return randomBytes.toString('base64');
}

/**
 * Generate a URL-safe base64 secret
 * @param {number} length - Length in bytes
 * @returns {string} - URL-safe base64-encoded secret key
 */
function generateJWTSecretBase64URL(length = SECRET_LENGTH) {
  const randomBytes = crypto.randomBytes(length);
  return randomBytes.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Update .env file with new JWT secret
 * @param {string} secret - The JWT secret to write
 */
function updateEnvFile(secret) {
  try {
    let envContent = '';
    
    // Read existing .env file if it exists
    if (fs.existsSync(ENV_FILE_PATH)) {
      envContent = fs.readFileSync(ENV_FILE_PATH, 'utf8');
    }
    
    // Check if JWT_SECRET already exists
    const jwtSecretRegex = /^JWT_SECRET=.*$/m;
    const newSecretLine = `JWT_SECRET=${secret}`;
    
    if (jwtSecretRegex.test(envContent)) {
      // Replace existing JWT_SECRET
      envContent = envContent.replace(jwtSecretRegex, newSecretLine);
      console.log('✅ Updated existing JWT_SECRET in .env file');
    } else {
      // Add new JWT_SECRET
      if (envContent && !envContent.endsWith('\n')) {
        envContent += '\n';
      }
      envContent += `\n# JWT Configuration\n${newSecretLine}\n`;
      console.log('✅ Added new JWT_SECRET to .env file');
    }
    
    // Write back to file
    fs.writeFileSync(ENV_FILE_PATH, envContent);
    
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
    console.log('💡 Please manually add this to your .env file:');
    console.log(`   JWT_SECRET=${secret}`);
  }
}

/**
 * Display security information about the generated secret
 * @param {string} secret - The generated secret
 */
function displaySecurityInfo(secret) {
  console.log('\n🔐 JWT Secret Security Information:');
  console.log('=====================================');
  console.log(`Length: ${secret.length} characters`);
  console.log(`Entropy: ~${(secret.length * 4)} bits`); // Each hex char = 4 bits
  console.log(`Format: Hexadecimal`);
  console.log(`Cryptographically secure: ✅ Yes`);
  
  // Calculate character distribution for randomness check
  const charSet = new Set(secret);
  console.log(`Unique characters: ${charSet.size}/16 possible hex chars`);
  
  // Security recommendations
  console.log('\n🛡️  Security Recommendations:');
  console.log('• Store this secret securely (never commit to git)');
  console.log('• Use different secrets for different environments');
  console.log('• Rotate secrets periodically in production');
  console.log('• Never log or display secrets in production code');
}

/**
 * Main function
 */
function main() {
  console.log('🔑 JWT Secret Key Generator');
  console.log('==========================\n');
  
  // Generate different format options
  const hexSecret = generateJWTSecret();
  const base64Secret = generateJWTSecretBase64();
  const base64URLSecret = generateJWTSecretBase64URL();
  
  console.log('Generated JWT Secrets:');
  console.log('---------------------');
  console.log(`Hexadecimal (recommended): ${hexSecret}`);
  console.log(`Base64: ${base64Secret}`);
  console.log(`Base64 URL-safe: ${base64URLSecret}`);
  
  // Display security information
  displaySecurityInfo(hexSecret);
  
  // Ask user which format to use (or auto-select hex)
  const args = process.argv.slice(2);
  let selectedSecret = hexSecret;
  let format = 'hexadecimal';
  
  if (args.includes('--base64')) {
    selectedSecret = base64Secret;
    format = 'base64';
  } else if (args.includes('--base64url')) {
    selectedSecret = base64URLSecret;
    format = 'base64 URL-safe';
  }
  
  console.log(`\n📝 Using ${format} format for .env file`);
  
  // Update .env file unless --no-update flag is present
  if (!args.includes('--no-update')) {
    updateEnvFile(selectedSecret);
  } else {
    console.log('\n💡 Manual setup required:');
    console.log(`   Add this to your .env file: JWT_SECRET=${selectedSecret}`);
  }
  
  console.log('\n✨ JWT Secret generation complete!');
  console.log('\n⚠️  Remember to:');
  console.log('• Restart your server to use the new secret');
  console.log('• Update production environment variables');
  console.log('• Keep this secret secure and never share it');
}

// Run the generator
if (require.main === module) {
  main();
}

module.exports = {
  generateJWTSecret,
  generateJWTSecretBase64,
  generateJWTSecretBase64URL
};