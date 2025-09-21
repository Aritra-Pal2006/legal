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
- **Build Command**: `npm install --legacy-peer-deps && cd frontend && npm install --legacy-peer-deps && npm run build`
- **Publish Directory**: `frontend/dist`

### 3. Environment Variables

Add any required environment variables in the Render dashboard:

- `VITE_API_URL`: Your backend API URL
- Any other environment variables your application needs

### 4. Deploy

Click "Create Web Service" to start the deployment.

## Alternative: Using render.yaml

If you prefer to use the render.yaml file included in this repository:

1. Make sure the render.yaml file is in your repository root
2. Render will automatically detect and use this configuration

## Troubleshooting

### Build Issues

If you encounter build issues related to peer dependencies:

1. Ensure the build command includes `--legacy-peer-deps`
2. Check that all dependencies are compatible with each other
3. Verify that react-pdf is version 10.1.0 or higher

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