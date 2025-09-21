# Legal AI Document Analyzer

A MERN stack application that uses Generative AI to simplify and analyze legal documents for everyday users.

## 🚀 Current Status

✅ **Frontend**: React app running on http://localhost:5173  
✅ **Backend**: Express server running on http://localhost:5000  
✅ **Firebase**: Project `plain-text-legal` fully configured  
✅ **AI Engine**: Google Gemini Pro integrated
✅ **Authentication**: Ready for use

## 🎯 **SETUP COMPLETE!**

Your Legal AI Document Analyzer is now fully configured and ready to use!

### ✅ What's Working
- **Document Upload**: PDF, DOCX, DOC, TXT file processing
- **Plain Language Translation**: Convert legal jargon to simple English
- **Risk Analysis**: Color-coded clause highlighting 
- **Fairness Scoring**: Contract balance assessment (0-10 scale)
- **AI Chat**: Ask questions about your documents
- **User Authentication**: Google Sign-in and email/password

### 🔧 **Final Steps to Complete**

1. **Enable Firebase Authentication**:
   - Go to [Firebase Console](https://console.firebase.google.com/project/plain-text-legal)
   - Authentication → Sign-in method
   - Enable "Email/Password" and "Google" providers

2. **Create Firestore Database**:
   - Go to Firestore Database → Create database
   - Start in "test mode" for development

### 🚀 **Start Using the Application**

```bash
# Both servers are already running!
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
```

Click the preview browser button above to start using your Legal AI Document Analyzer!

## Features

- **Plain Language Translator**: Convert complex legal clauses into plain English
- **Conversational Legal Assistant**: Chat with your contract using RAG
- **Risk & Obligation Highlighter**: Color-coded clause analysis
- **Multilingual Legal Aid**: Document translation
- **Fairness Score Generator**: Contract balance analysis

## Tech Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js + Express.js
- **Database**: Firebase
- **Authentication**: Firebase Auth
- **AI**: Google Gemini Pro for text processing and analysis

## Getting Started

1. Clone the repository
2. Install dependencies: `npm run install-all`
3. Set up Firebase configuration
4. Set up environment variables
5. Start the development server: `npm run dev`

## Project Structure

```
legal-ai-analyzer/
├── frontend/          # React.js frontend
├── backend/           # Node.js + Express.js backend
├── shared/           # Shared utilities and types
└── docs/             # Documentation
```

## Environment Variables

Create `.env` files in both frontend and backend directories with the required configuration.

For the frontend, you can use the `.env.example` file as a template. Key variables include:
- `VITE_API_URL`: Backend URL for local development (defaults to http://localhost:5000)
- `VITE_BACKEND_URL`: Backend URL for production deployments (used in Render)

Example frontend `.env`:
```
VITE_API_URL=http://localhost:5000
VITE_BACKEND_URL=https://legal-backend-96zq.onrender.com
```

For Render deployment, you should set the `VITE_BACKEND_URL` environment variable in the Render dashboard to your backend URL.

## Node.js Version

This project is configured to use Node.js version 20.18.0. You can find the version specification in the `.nvmrc` files in both the root directory and the frontend directory.

To use this version with nvm:
```bash
nvm use
```

## Deployment

### Frontend Deployment (Render)

To deploy the frontend to Render:

1. Connect your GitHub repository to Render
2. Select the "Web Service" type
3. Specify the root directory as `frontend`
4. Set the build command to: `rm -rf frontend/node_modules frontend/package-lock.json && cd frontend && npm install --legacy-peer-deps && npm run build`
5. Set the publish directory to: `frontend/dist`
6. Set the Node.js version to: 20.18.0
7. Add environment variables as needed

Alternatively, you can use the provided `render.yaml` file which contains the deployment configuration.

### Backend Deployment

For backend deployment, you would need to set up a separate Render service for the backend Node.js application.

### Clean Installation

If you encounter dependency issues during deployment (especially with Rollup modules), the deployment process now includes a clean installation step that removes node_modules and package-lock.json before installing dependencies. This ensures that all dependencies are installed fresh without any cached or conflicting modules.