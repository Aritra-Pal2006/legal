#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Legal AI Document Analyzer...');

// Helper function to run commands
const runCommand = (command, cwd = process.cwd()) => {
  try {
    execSync(command, { stdio: 'inherit', cwd });
  } catch (error) {
    console.error(`❌ Error running command: ${command}`);
    process.exit(1);
  }
};

// Helper function to create env file from example
const createEnvFile = (examplePath, envPath) => {
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log(`✅ Created ${envPath}`);
    } else {
      console.log(`⚠️  ${examplePath} not found`);
    }
  } else {
    console.log(`✅ ${envPath} already exists`);
  }
};

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  process.exit(1);
}
console.log(`✅ Node.js version: ${nodeVersion}`);

// Install root dependencies
console.log('\n📦 Installing root dependencies...');
runCommand('npm install');

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
runCommand('npm install', path.join(process.cwd(), 'backend'));

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
runCommand('npm install --legacy-peer-deps', path.join(process.cwd(), 'frontend'));

// Create environment files
console.log('\n📝 Setting up environment files...');
createEnvFile(
  path.join(process.cwd(), 'backend', '.env.example'),
  path.join(process.cwd(), 'backend', '.env')
);
createEnvFile(
  path.join(process.cwd(), 'frontend', '.env.example'),
  path.join(process.cwd(), 'frontend', '.env')
);

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Set up your Firebase project and update the .env files');
console.log('2. Get your OpenAI API key and add it to backend/.env');
console.log('3. Run `npm start` to start both services');
console.log('\nFor detailed setup instructions, see SETUP.md');