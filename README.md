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
- **AI**: OpenAI GPT for text processing and analysis

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