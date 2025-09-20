const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      // Check if Firebase environment variables are set
      if (!process.env.FIREBASE_PROJECT_ID) {
        console.log('⚠️  Firebase environment variables not configured. Please check SETUP.md for instructions.');
        console.log('🔧 Create a .env file in the backend directory with your Firebase credentials.');
        return;
      }

      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
        token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: `https://www.googleapis.com/oauth2/v1/certs`,
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      });

      console.log('✅ Firebase Admin initialized successfully');
    }
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.log('🔧 Please check your Firebase configuration in the .env file.');
    console.log('📋 See SETUP.md for detailed Firebase setup instructions.');
    // Don't throw error to allow server to start without Firebase
  }
};

module.exports = { initializeFirebase };