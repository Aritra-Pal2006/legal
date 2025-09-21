# Render Deployment Guide

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A Firebase project with web app configured
3. Backend API deployed (assumed to be at https://legal-backend-96zq.onrender.com)

## Deployment Steps

1. Fork this repository to your GitHub account
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the service with these settings:
   - Build Command: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps && npm run build`
   - Publish Directory: `dist`
   - Node Version: 20.18.0 (set as environment variable)

## Environment Variables

Set these environment variables in your Render service:

- `VITE_FIREBASE_API_KEY` - Your Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Your Firebase app ID
- `VITE_BACKEND_URL` - Your backend API URL (https://legal-backend-96zq.onrender.com)

## Fixing Firebase "auth/unauthorized-domain" Error

After deploying your application, you may encounter a Firebase "auth/unauthorized-domain" error. This happens because Firebase Authentication restricts which domains can use your authentication service for security reasons.

To fix this issue:

1. Go to the Firebase Console (https://console.firebase.google.com/)
2. Select your project
3. Navigate to Authentication > Settings tab
4. In the "Authorized domains" section, add your Render domain:
   - It will be in the format: `your-service-name.onrender.com`
   - You can find your exact domain in the Render dashboard for your service
   - For example: `legal-ai-frontend.onrender.com`
5. Click "Save" to add the domain
6. Redeploy your application on Render

If you're using the default service name from this repository, your domain will likely be:
`legal-ai-frontend.onrender.com`

## Troubleshooting

If you still encounter issues:

1. Check that all environment variables are correctly set in Render
2. Verify that your backend API is accessible
3. Ensure your Firebase configuration is correct
4. Check Render logs for any build or runtime errors

## Common Error Messages

- `auth/unauthorized-domain`: Add your Render domain to Firebase authorized domains
- `auth/network-request-failed`: Check network connectivity and CORS settings
- `auth/invalid-api-key`: Verify your Firebase API key is correct