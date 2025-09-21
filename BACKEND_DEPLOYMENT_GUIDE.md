# Backend Deployment Guide for Render

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A Firebase project with service account configured
3. A Google Gemini API key

## Deployment Steps

1. Fork this repository to your GitHub account
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the service with these settings:
   - Name: legal-backend (or any name you prefer)
   - Region: Choose the region closest to your users
   - Branch: main (or your preferred branch)
   - Root Directory: backend
   - Runtime: Node.js
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free or Starter (depending on your needs)

## Environment Variables

Set these environment variables in your Render service:

- `PORT` - 10000 (Render's default port)
- `NODE_ENV` - production
- `FRONTEND_URL` - Your frontend URL (e.g., https://legal-ai-frontend.onrender.com)
- `GEMINI_API_KEY` - Your Google Gemini API key
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_PRIVATE_KEY_ID` - Your Firebase private key ID
- `FIREBASE_PRIVATE_KEY` - Your Firebase private key (make sure to escape newlines with \n)
- `FIREBASE_CLIENT_EMAIL` - Your Firebase client email
- `FIREBASE_CLIENT_ID` - Your Firebase client ID
- `FIREBASE_AUTH_URI` - https://accounts.google.com/o/oauth2/auth
- `FIREBASE_TOKEN_URI` - https://oauth2.googleapis.com/token
- `JWT_SECRET` - A secure secret key for JWT tokens

## CORS Configuration

The backend has been configured to allow requests from common localhost ports and Render domains:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`
- `http://localhost:5176`
- `http://localhost:5178`
- `https://legal-ai-frontend.onrender.com`
- Any domain matching the pattern `*.onrender.com`

If you're using a custom domain, make sure to add it to the allowed origins in `server.js`.

## File Upload Configuration

The backend is configured to handle file uploads up to 50MB:
- Maximum file size: 50MB
- Supported file types: PDF, DOCX, DOC, TXT
- Text extraction: PDF parsing, DOCX parsing, plain text

## Health Check

The backend exposes a health check endpoint at `/api/health` which you can use to monitor the service status.

## Troubleshooting

### Common Issues:

1. **CORS errors**: 
   - Ensure your frontend domain is added to the allowed origins in `server.js`
   - Redeploy the backend after making changes to CORS configuration

2. **Environment variables not set**:
   - Double-check all environment variables are correctly set in Render
   - Make sure Firebase private key is properly escaped

3. **File upload errors**:
   - Check file size limits
   - Verify the file type is supported
   - Check backend logs for specific error messages

4. **Firebase authentication errors**:
   - Verify Firebase service account credentials
   - Check Firebase project settings

### Monitoring Logs:

You can monitor your application logs in the Render dashboard:
1. Go to your service in the Render dashboard
2. Click on "Logs" tab
3. Check for any error messages or warnings

## Scaling

The application is designed to run on a single instance. For production use with high traffic:
1. Consider upgrading to a paid Render plan
2. Monitor resource usage in the Render dashboard
3. Set up auto-scaling if needed (requires paid plan)

## Updates and Redeployment

To update your deployed backend:
1. Push changes to your GitHub repository
2. Render will automatically trigger a new deployment
3. Or manually trigger a deployment from the Render dashboard

For manual deployment:
1. Go to your service in the Render dashboard
2. Click "Manual Deploy"
3. Select the branch you want to deploy