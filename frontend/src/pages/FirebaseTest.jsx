import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const FirebaseTest = () => {
  const [authState, setAuthState] = useState('checking');
  const [user, setUser] = useState(null);
  const [domainInfo, setDomainInfo] = useState('');

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState('authenticated');
        setUser(user);
      } else {
        setAuthState('unauthenticated');
        setUser(null);
      }
    });

    // Get domain information
    setDomainInfo({
      hostname: window.location.hostname,
      origin: window.location.origin,
      protocol: window.location.protocol,
      isSecureContext: window.isSecureContext
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Firebase Authentication Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="mb-4">
            <span className="font-medium">Status:</span> {authState}
          </div>
          
          {user && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">User Information:</h3>
              <p>Email: {user.email}</p>
              <p>UID: {user.uid}</p>
            </div>
          )}
          
          {authState === 'checking' && (
            <div className="text-blue-600">Checking authentication status...</div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Domain Information</h2>
          <div className="mb-4">
            <p><span className="font-medium">Hostname:</span> {domainInfo.hostname}</p>
            <p><span className="font-medium">Origin:</span> {domainInfo.origin}</p>
            <p><span className="font-medium">Protocol:</span> {domainInfo.protocol}</p>
            <p><span className="font-medium">Secure Context:</span> {domainInfo.isSecureContext ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
          <div className="mb-4">
            <h3 className="font-medium mb-2">If you're seeing auth/unauthorized-domain errors:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Copy your domain ({domainInfo.hostname})</li>
              <li>Go to Firebase Console &gt; Authentication &gt; Settings</li>
              <li>Add your domain to "Authorized domains"</li>
              <li>Save changes and redeploy your application</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest;