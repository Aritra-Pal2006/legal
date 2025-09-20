import React, { useEffect, useState } from 'react';
import useAuthStore from '../stores/authStore';
import { Link } from 'react-router-dom';

const AuthTest = () => {
  const { user, loading, error, initialize } = useAuthStore();
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('AuthTest component mounted');
    addLog(`Initial state - loading: ${loading}, user: ${user?.email || 'none'}, error: ${error || 'none'}`);
    
    if (!user && !loading) {
      addLog('Initializing auth...');
      initialize();
    }
  }, []);

  useEffect(() => {
    addLog(`Auth state changed - loading: ${loading}, user: ${user?.email || 'none'}, error: ${error || 'none'}`);
  }, [user, loading, error]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>User:</strong> {user ? user.email : 'None'}
            </div>
            <div>
              <strong>Error:</strong> {error || 'None'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="space-x-4">
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
              Go to Login
            </Link>
            <Link to="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded">
              Go to Dashboard
            </Link>
            <Link to="/debug" className="bg-purple-600 text-white px-4 py-2 rounded">
              Go to Debug
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
          <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;