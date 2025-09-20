import React, { useState, useEffect } from 'react';
import useAuthStore from '../stores/authStore';

const DashboardDebug = () => {
  const { user } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    const runTests = async () => {
      const authToken = localStorage.getItem('authToken');
      
      setDebugInfo({
        user: user ? {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        } : null,
        authToken: authToken ? 'Present' : 'Missing',
        tokenLength: authToken ? authToken.length : 0
      });

      // Test backend health
      try {
        const healthResponse = await fetch('http://localhost:5000/api/health');
        const healthData = await healthResponse.json();
        setTestResults(prev => ({
          ...prev,
          health: {
            status: healthResponse.status,
            data: healthData
          }
        }));
      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          health: {
            error: error.message
          }
        }));
      }

      // Test documents API if token exists
      if (authToken) {
        try {
          const documentsResponse = await fetch('http://localhost:5000/api/documents', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          const documentsData = await documentsResponse.json();
          setTestResults(prev => ({
            ...prev,
            documents: {
              status: documentsResponse.status,
              data: documentsData
            }
          }));
        } catch (error) {
          setTestResults(prev => ({
            ...prev,
            documents: {
              error: error.message
            }
          }));
        }
      }
    };

    if (user) {
      runTests();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard Debug Information</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Debug Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>

          {/* Test Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">API Test Results</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        </div>

        {/* Navigation Test */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
            >
              Go to Dashboard (direct)
            </button>
            <button 
              onClick={() => window.location.href = '/profile'}
              className="bg-green-600 text-white px-4 py-2 rounded mr-4"
            >
              Go to Profile
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDebug;