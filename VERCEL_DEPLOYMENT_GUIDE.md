# Vercel Deployment Guide for Legal AI Document Analyzer

## Overview
This guide will help you deploy your Legal AI Document Analyzer to Vercel. The application consists of two parts:
- **Frontend**: React/Vite application
- **Backend**: Node.js/Express API

## Prerequisites
1. [Vercel Account](https://vercel.com) (free tier is sufficient)
2. [Vercel CLI](https://vercel.com/cli) installed: `npm i -g vercel`
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Environment Variables

### Backend Environment Variables
Create these environment variables in your Vercel dashboard:

```
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PROJECT_ID=plain-text-legal
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

### Frontend Environment Variables
```
VITE_FIREBASE_API_KEY=AIzaSyBDH9zB8G2cD6bqDPmgoOQWUzhUIJNiFcQ
VITE_FIREBASE_AUTH_DOMAIN=plain-text-legal.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=plain-text-legal
VITE_FIREBASE_STORAGE_BUCKET=plain-text-legal.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=376447417101
VITE_FIREBASE_APP_ID=1:376447417101:web:a486cb23eae0dfabb98e44
VITE_API_URL=https://your-backend-deployment.vercel.app
```

## Step 2: Deploy Backend First

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set environment variables:**
   ```bash
   vercel env add FIREBASE_PRIVATE_KEY
   vercel env add FIREBASE_CLIENT_EMAIL
   vercel env add FIREBASE_PROJECT_ID
   vercel env add GEMINI_API_KEY
   vercel env add NODE_ENV
   ```

5. **Note the deployment URL** (e.g., `https://legal-ai-backend.vercel.app`)

## Step 3: Deploy Frontend

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Update VITE_API_URL with your backend URL:**
   In Vercel dashboard, set `VITE_API_URL` to your backend deployment URL.

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set environment variables:**
   ```bash
   vercel env add VITE_FIREBASE_API_KEY
   vercel env add VITE_FIREBASE_AUTH_DOMAIN
   vercel env add VITE_FIREBASE_PROJECT_ID
   vercel env add VITE_FIREBASE_STORAGE_BUCKET
   vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
   vercel env add VITE_FIREBASE_APP_ID
   vercel env add VITE_API_URL
   ```

## Step 4: Alternative - Deploy via Git Integration

### For GitHub Integration:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Deploy backend and frontend as separate projects

3. **Configure Build Settings:**
   
   **Backend Project:**
   - Root Directory: `backend`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

   **Frontend Project:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Step 5: Configure Environment Variables in Vercel Dashboard

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add all the required variables listed above
4. Redeploy both projects

## Step 6: Update CORS Configuration

Your backend needs to allow your frontend domain. Update the CORS configuration in your backend to include your Vercel frontend URL:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', 
  'http://localhost:5175',
  'http://localhost:5176',
  'https://your-frontend-deployment.vercel.app', // Add this
  process.env.FRONTEND_URL
].filter(Boolean);
```

## Step 7: Testing

1. Visit your frontend URL
2. Test user registration/login
3. Test document upload
4. Test AI features (translation, chat, risk analysis)

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure your frontend URL is added to CORS configuration
   - Redeploy backend after updating CORS

2. **Environment Variables:**
   - Double-check all environment variables are set correctly
   - Ensure no trailing spaces in values

3. **Firebase Errors:**
   - Verify Firebase project configuration
   - Check Firebase rules and permissions

4. **API Endpoints:**
   - Ensure VITE_API_URL points to your backend deployment
   - Check that all API endpoints are accessible

### Helpful Commands:

```bash
# Check deployment logs
vercel logs [deployment-url]

# Redeploy
vercel --prod

# View environment variables
vercel env ls
```

## Security Notes

- Never commit sensitive environment variables to Git
- Use Vercel's environment variable management
- Consider using different Firebase projects for development and production
- Implement proper rate limiting and authentication in production

## Cost Considerations

- Vercel Free Tier includes:
  - 100GB bandwidth per month
  - 100 serverless function invocations per day
  - 6000 serverless function execution hours per month

For higher usage, consider upgrading to Pro plan or using alternative hosting for the backend.

## Success!

Once deployed, your Legal AI Document Analyzer will be available at:
- Frontend: `https://your-frontend.vercel.app`
- Backend API: `https://your-backend.vercel.app`

Your application is now ready for production use!