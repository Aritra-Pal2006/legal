import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, FileText, MessageSquare, Shield, LogOut, User, ExternalLink, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';

const Dashboard = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTranslationInfo, setShowTranslationInfo] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showRiskInfo, setShowRiskInfo] = useState(false);

  // Show loading if user is not available yet
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
    const loadDocuments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/documents', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          setDocuments(result.documents || []);
        }
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDocuments();
    }
  }, [user]);

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
        processed: false
      };
      
      // Add the uploaded document to the list
      setDocuments(prev => [...prev, uploadedDocument]);
      toast.success('Document uploaded successfully!');
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload document. Please try again.');
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
      <header className="bg-white shadow-sm border-b">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName ? user.displayName.split(' ')[0] : 'User'}!
          </h2>
          <p className="text-gray-600">
            Upload your legal documents to get started with AI-powered analysis and translation.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold">Plain Language Translation</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Convert complex legal jargon into easy-to-understand language.
            </p>
            <button 
              onClick={() => setShowTranslationInfo(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Learn More →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold">Chat with Documents</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Ask questions about your documents and get instant answers.
            </p>
            <button 
              onClick={() => setShowChatInfo(true)}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Try Now →
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-lg font-semibold">Risk Analysis</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Identify potential risks and obligations in your contracts.
            </p>
            <button 
              onClick={() => setShowRiskInfo(true)}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Analyze →
            </button>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
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
        <div className="bg-white rounded-lg shadow-sm border p-6">
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

      {/* Information Modals */}
      {showTranslationInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Plain Language Translation</h3>
            <p className="text-gray-600 mb-4">
              Our AI-powered translation service converts complex legal jargon into plain English. 
              Choose from different difficulty levels:
            </p>
            <ul className="text-sm text-gray-600 mb-4 space-y-1">
              <li>• <strong>5th Grade:</strong> Very simple language for everyone</li>
              <li>• <strong>10th Grade:</strong> Clear everyday language</li>
              <li>• <strong>Business Level:</strong> Professional but accessible</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Upload a document to start translating your legal texts!
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTranslationInfo(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Close
              </button>
              {documents.length > 0 && (
                <button
                  onClick={() => {
                    setShowTranslationInfo(false);
                    navigate(`/document/${documents[0].id}?tab=translation`);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Try with Recent Document
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showChatInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Chat with Documents</h3>
            <p className="text-gray-600 mb-4">
              Ask questions about your uploaded documents and get instant, accurate answers. 
              Our AI assistant can help you:
            </p>
            <ul className="text-sm text-gray-600 mb-4 space-y-1">
              <li>• Understand specific clauses</li>
              <li>• Find key information quickly</li>
              <li>• Explain legal terms and concepts</li>
              <li>• Identify important deadlines</li>
              <li>• Clarify obligations and rights</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Upload a document to start chatting with your legal texts!
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowChatInfo(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Close
              </button>
              {documents.length > 0 && (
                <button
                  onClick={() => {
                    setShowChatInfo(false);
                    navigate(`/document/${documents[0].id}?tab=chat`);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Try with Recent Document
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showRiskInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Risk Analysis</h3>
            <p className="text-gray-600 mb-4">
              Our AI analyzes your legal documents to identify potential risks and obligations. 
              We categorize clauses by:
            </p>
            <ul className="text-sm text-gray-600 mb-4 space-y-1">
              <li>• <span className="text-red-600">🔴 HIGH RISK:</span> Penalties, liability, termination</li>
              <li>• <span className="text-yellow-600">🟠 OBLIGATIONS:</span> Payments, deadlines, compliance</li>
              <li>• <span className="text-green-600">🟢 USER-FRIENDLY:</span> Rights, protections, benefits</li>
            </ul>
            <p className="text-gray-600 mb-4">
              We also provide fairness scores and detailed recommendations.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRiskInfo(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Close
              </button>
              {documents.length > 0 && (
                <button
                  onClick={() => {
                    setShowRiskInfo(false);
                    navigate(`/document/${documents[0].id}?tab=risks`);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Try with Recent Document
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;