#!/bin/bash

# Clean installation script for Legal AI Document Analyzer

echo "Starting clean installation..."

# Remove node_modules and package-lock.json from root
echo "Removing root node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

# Remove node_modules and package-lock.json from frontend
echo "Removing frontend node_modules and package-lock.json..."
rm -rf frontend/node_modules frontend/package-lock.json

# Remove node_modules and package-lock.json from backend
echo "Removing backend node_modules and package-lock.json..."
rm -rf backend/node_modules backend/package-lock.json

# Install dependencies in root
echo "Installing root dependencies..."
npm install

# Install dependencies in backend
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install dependencies in frontend with legacy peer deps
echo "Installing frontend dependencies with legacy peer deps..."
cd frontend
npm install --legacy-peer-deps
cd ..

echo "Clean installation completed successfully!"
echo "You can now run the application with 'npm run dev'"