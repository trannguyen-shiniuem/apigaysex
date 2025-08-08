#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎵 Setting up SoundCloud Clone...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 14) {
  console.error('❌ Node.js version 14 or higher is required');
  process.exit(1);
}

console.log(`✅ Node.js ${nodeVersion} detected`);

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing server dependencies...');
  execSync('cd server && npm install', { stdio: 'inherit' });
  
  console.log('Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Check environment files
console.log('\n⚙️  Checking environment configuration...');

const serverEnvPath = path.join(__dirname, 'server', '.env');
const clientEnvPath = path.join(__dirname, 'client', '.env');

if (!fs.existsSync(serverEnvPath)) {
  console.log('⚠️  Server .env file not found, using defaults');
}

if (!fs.existsSync(clientEnvPath)) {
  console.log('⚠️  Client .env file not found, using defaults');
}

// Display setup completion message
console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Set up MongoDB (local or MongoDB Atlas)');
console.log('2. Configure Cloudinary credentials in server/.env');
console.log('3. Run "npm run dev" to start the development server');
console.log('\n🔧 Configuration files:');
console.log('- server/.env - Backend configuration');
console.log('- client/.env - Frontend configuration');
console.log('\n📚 Documentation: README.md');
console.log('\n🚀 Happy coding!');