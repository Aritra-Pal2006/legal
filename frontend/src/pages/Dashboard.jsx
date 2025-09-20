import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, FileText, MessageSquare, Shield, LogOut, User, ExternalLink, Trash2, Scale } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

const Dashboard = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple loading check - let ProtectedRoute handle auth redirection
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Load user's documents on component mount
  useEffect(() => {
    let isMounted = true;
    
    const loadDocuments = async () => {
      if (!user || !isMounted) return;
      
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          setLoading(false);
          return;
        }
        
        const response = await fetch('http://localhost:5000/api/documents', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (response.ok && isMounted) {
          const result = await response.json();
          setDocuments(result.documents || []);
        } else if (isMounted) {
          console.error('Failed to load documents, status:', response.status);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to load documents:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (user) {
      loadDocuments();
    } else {
      setLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('document', file);

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        toast.error('Please sign in again');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      
      // Create a document object from the upload response
      const uploadedDocument = {
        id: result.documentId,
        filename: file.name,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        metadata: result.metadata,
        processed: !result.warning
      };
      
      // Add the uploaded document to the list
      setDocuments(prev => [...prev, uploadedDocument]);
      
      // Show appropriate success message
      if (result.warning) {
        toast.success(`${result.message}`, {
          duration: 5000,
          icon: '⚠️'
        });
        toast(result.warning, {
          duration: 8000,
          icon: 'ℹ️',
          style: {
            background: '#FEF3C7',
            color: '#92400E',
          },
        });
      } else {
        toast.success('Document uploaded successfully!');
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // Try to get error details from response
      let errorMessage = error.message || 'Failed to upload document. Please try again.';
      let suggestion = '';
      
      // If it's a network error, provide more context
      if (error.message.includes('fetch')) {
        errorMessage = 'Network error occurred while uploading.';
        suggestion = 'Please check your connection and try again.';
      }
      
      toast.error(errorMessage, {
        duration: 6000
      });
      
      if (suggestion) {
        toast(suggestion, {
          duration: 8000,
          icon: 'ℹ️',
          style: {
            background: '#FEF3C7',
            color: '#92400E',
          },
        });
      }
    } finally {
      setUploading(false);
    }
  }, [navigate]);

  const handleDeleteDocument = async (documentId, filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        toast.error('Please sign in again');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        // Remove the document from the local state
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        toast.success('Document deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.message || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete document. Please try again.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Legal AI Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{user?.displayName || user?.email}</span>
              </div>
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName ? user.displayName.split(' ')[0] : 'User'}!
          </h2>
          <p className="text-gray-600">
            Upload your legal documents to get started with AI-powered analysis and translation.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold">Plain Language Translation</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Convert complex legal jargon into easy-to-understand language.
            </p>
            <Link 
              to={documents.length > 0 ? `/document/${documents[0].id}?tab=translation` : '#'}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {documents.length > 0 ? 'Try Now →' : 'Upload a document first'}
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold">Chat with Documents</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Ask questions about your documents and get instant answers.
            </p>
            <Link 
              to={documents.length > 0 ? `/document/${documents[0].id}?tab=chat` : '#'}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              {documents.length > 0 ? 'Try Now →' : 'Upload a document first'}
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold">Risk Analysis</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Identify potential risks and obligations in your contracts.
            </p>
            <Link 
              to={documents.length > 0 ? `/document/${documents[0].id}?tab=risks` : '#'}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              {documents.length > 0 ? 'Analyze →' : 'Upload a document first'}
            </Link>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h3>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            
            {uploading ? (
              <div className="space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600">Uploading document...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg text-gray-600">
                  {isDragActive
                    ? 'Drop your document here'
                    : 'Drag & drop a document here, or click to select'}
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOCX, and TXT files up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Documents</h3>
          
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents uploaded yet</p>
              <p className="text-sm text-gray-400">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc, index) => (
                <div key={doc.id || index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.filename || 'Untitled Document'}</h4>
                      <p className="text-sm text-gray-500">
                        Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => navigate(`/document/${doc.id}`)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      title="Analyze document"
                    >
                      Analyze
                    </button>
                    <button 
                      onClick={() => navigate(`/document/${doc.id}?tab=chat`)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      title="Chat with document"
                    >
                      Chat
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(doc.id, doc.filename)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center space-x-1"
                      title="Delete document"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;