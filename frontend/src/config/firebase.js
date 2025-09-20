import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBDH9zB8G2cD6bqDPmgoOQWUzhUIJNiFcQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "plain-text-legal.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "plain-text-legal",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "plain-text-legal.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "376447417101",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:376447417101:web:a486cb23eae0dfabb98e44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;