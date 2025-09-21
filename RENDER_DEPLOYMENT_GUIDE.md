# Render Deployment Guide

This guide explains how to deploy the Legal AI Document Analyzer frontend to Render.

## Prerequisites

1. A Render account (https://render.com)
2. A GitHub repository with your code
3. Environment variables configured (if needed)

## Deployment Steps

### 1. Connect Your Repository

1. Go to your Render Dashboard
2. Click "New Web Service"
3. Connect your GitHub account and select your repository

### 2. Configure Your Service

Use the following settings:

- **Name**: legal-ai-frontend (or any name you prefer)
- **Environment**: Static Site
- **Build Command**: `rm -rf frontend/node_modules frontend/package-lock.json && cd frontend && npm install --legacy-peer-deps && npm run build`
- **Publish Directory**: `frontend/dist`
- **Node Version**: 20.18.0 (specified in .nvmrc file)

### 3. Environment Variables

Add any required environment variables in the Render dashboard:

- `VITE_BACKEND_URL`: Your backend API URL (e.g., https://legal-backend-96zq.onrender.com)
- Any other environment variables your application needs

Note: The `VITE_BACKEND_URL` environment variable will override the default localhost URL and is used for all API calls in production.

### 4. Deploy

Click "Create Web Service" to start the deployment.

## Alternative: Using render.yaml

If you prefer to use the render.yaml file included in this repository:

1. Make sure the render.yaml file is in your repository root
2. Render will automatically detect and use this configuration

## Troubleshooting

### Build Issues

If you encounter build issues related to peer dependencies:

1. The project has been updated to use compatible versions of all dependencies
2. React has been downgraded to version 18.x for better compatibility
3. All packages now use versions that support React 18
4. Rollup has been pinned to version 4.x to avoid binary compatibility issues

### Runtime Issues

If the application doesn't work after deployment:

1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure your backend API is accessible from the frontend

## Updating Your Deployment

To update your deployed application:

1. Push changes to your GitHub repository
2. Render will automatically detect the changes and start a new build
3. Monitor the build logs in the Render dashboard

## Custom Domain

To use a custom domain:

1. Go to your service settings in Render
2. Click "Custom Domains"
3. Follow the instructions to add your domain
4. Update DNS records as instructed

## Clean Installation

If you encounter persistent dependency issues, you can perform a clean installation:

```bash
# Remove node_modules and package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# Install dependencies with legacy peer deps flag
cd frontend && npm install --legacy-peer-deps

# Build the project
npm run build
```

This approach ensures that all dependencies are installed fresh without any cached or conflicting modules.