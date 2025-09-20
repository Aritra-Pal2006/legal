import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './stores/authStore';

// Temporary simplified components that work
const Home = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Legal AI Document Analyzer
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Transform complex legal documents into plain English with AI-powered analysis
        </p>
        <div className="space-x-4">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold inline-block"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold inline-block mr-4"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 font-semibold inline-block"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Import actual page components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DocumentViewer from './pages/DocumentViewer';
import ProtectedRoute from './components/ProtectedRoute';

// Temporary simple components removed - using actual page components now

function App() {
  const { user, initialize, loading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/document/:documentId" 
            element={
              <ProtectedRoute>
                <DocumentViewer />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
