# CORS Fix for File Upload Network Error

## Problem
When deploying the Legal AI Document Analyzer to Render, users encounter a "network error" when trying to upload files. This is caused by CORS (Cross-Origin Resource Sharing) restrictions between the frontend and backend services.

## Solution Implemented
The backend server.js file has been updated to allow requests from Render domains.

### Changes Made
1. Added specific Render domain to allowed origins:
   ```javascript
   'https://legal-ai-frontend.onrender.com'
   ```

2. Added wildcard support for any Render domain:
   ```javascript
   /\.onrender\.com$/
   ```

3. Enhanced CORS validation logic to properly check against both string and regex patterns.

## Deployment Steps

### 1. Redeploy the Backend
You need to redeploy your backend service to Render for the changes to take effect.

If you're using the Render dashboard:
1. Go to your backend service in the Render dashboard
2. Click "Manual Deploy" or make a small change to trigger a new deployment
3. Wait for the deployment to complete

### 2. Verify the Fix
After redeployment:
1. Try uploading a file again
2. Check the browser's developer console for any remaining CORS errors
3. Check your backend logs for any CORS-related messages

## Troubleshooting

### If the issue persists:
1. Check that your frontend `VITE_BACKEND_URL` environment variable is correctly set to your backend URL
2. Verify that your backend is accessible by visiting `https://your-backend-url.onrender.com/api/health`
3. Check the network tab in your browser's developer tools to see the exact error message

### Common Error Messages:
- `CORS error: No 'Access-Control-Allow-Origin' header present` - The domain is not properly configured
- `CORS error: Request header field Authorization is not allowed` - Headers configuration issue
- `500 Internal Server Error` - Backend processing error

## Additional Notes
- The fix supports both specific domains and wildcard patterns for flexibility
- The enhanced validation logic ensures proper security while allowing legitimate requests
- File size limits remain at 50MB for uploads