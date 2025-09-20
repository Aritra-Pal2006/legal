# Legal AI Document Analyzer - Setup Guide

## Quick Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- OpenAI API key

### 1. Environment Variables Setup

#### Backend (.env)
Create a `.env` file in the `backend` directory:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=\"-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\"
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

#### Frontend (.env)
Create a `.env` file in the `frontend` directory:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Firebase Setup (Updated for your project)

Your Firebase project `plain-text-legal` is already configured. Complete these steps:

#### Step 1: Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/project/plain-text-legal)
2. Navigate to **Authentication** > **Sign-in method**
3. Enable **Email/Password** provider
4. Enable **Google** provider
   - Add your domain: `localhost` for development
   - Add authorized domains as needed

#### Step 2: Setup Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **test mode** (for development)
4. Choose a location (preferably close to your users)

#### Step 3: Generate Service Account Key (Backend)
1. Go to **Project Settings** > **Service accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Extract the following values and update `backend/.env`:
   - `project_id` → `FIREBASE_PROJECT_ID` (already set: plain-text-legal)
   - `private_key_id` → `FIREBASE_PRIVATE_KEY_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `client_id` → `FIREBASE_CLIENT_ID`

### 3. OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. Add the API key to your backend `.env` file

### 4. Installation

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install --legacy-peer-deps
```

### 5. Running the Application

#### Option 1: Run both services simultaneously (from root directory)
```bash
npm start
```

#### Option 2: Run services separately

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Features

### Core Features Implemented:

1. **Document Upload & Processing**
   - PDF, DOCX, DOC, and TXT file support
   - Text extraction and storage
   - Firebase integration for document management

2. **Plain Language Translation**
   - Multiple difficulty levels (5th grade, 10th grade, business)
   - OpenAI-powered translation
   - Toggle between legal and plain language views

3. **Risk & Obligation Analysis**
   - Color-coded clause highlighting
   - Risk level categorization
   - Detailed explanations for each clause

4. **Conversational AI Assistant**
   - Chat with your documents
   - Context-aware responses using RAG
   - Conversation history storage

5. **Fairness Score Analysis**
   - Contract balance assessment
   - Scoring system (0-10)
   - Recommendations for fairer terms

6. **User Authentication**
   - Firebase Auth integration
   - Email/password and Google sign-in
   - Protected routes and user sessions

7. **Responsive UI**
   - Modern React interface
   - Tailwind CSS styling
   - Mobile-friendly design

### API Endpoints:

**Authentication:**
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `DELETE /api/auth/account` - Delete user account
- `GET /api/auth/stats` - Get user statistics

**Documents:**
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user documents
- `GET /api/documents/:id` - Get specific document
- `DELETE /api/documents/:id` - Delete document

**AI Analysis:**
- `POST /api/ai/translate` - Plain language translation
- `POST /api/ai/analyze-risks` - Risk analysis
- `POST /api/ai/fairness-score` - Fairness analysis
- `POST /api/ai/chat` - Chat with document
- `GET /api/ai/conversations/:documentId` - Get conversations

## Troubleshooting

### Common Issues:

1. **Dependency conflicts:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Firebase permission errors:**
   - Check your Firebase rules
   - Ensure service account has proper permissions

3. **OpenAI API errors:**
   - Verify your API key is correct
   - Check your OpenAI account has sufficient credits

4. **CORS issues:**
   - Ensure FRONTEND_URL is set correctly in backend .env
   - Check that both services are running on correct ports

### Development Notes:

- The project uses TypeScript configuration but JSX files for simplicity
- Some linter warnings are expected and don't affect functionality
- File upload size is limited to 10MB by default
- OpenAI GPT-4 is used for all AI operations

## Next Steps

To enhance the application further:

1. Add multilingual support for translations
2. Implement document comparison features
3. Add more sophisticated risk analysis
4. Create dashboard analytics
5. Add document collaboration features
6. Implement subscription plans
7. Add email notifications
8. Create mobile applications

## Security Considerations

- All uploaded documents are processed securely
- Firebase Auth handles user authentication
- API routes are protected with authentication middleware
- File uploads are validated and sanitized
- Environment variables store sensitive configuration

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Firebase and OpenAI documentation
3. Check console logs for error details
4. Ensure all environment variables are set correctly"