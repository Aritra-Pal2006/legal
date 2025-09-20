import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDH9zB8G2cD6bqDPmgoOQWUzhUIJNiFcQ",
  authDomain: "plain-text-legal.firebaseapp.com",
  projectId: "plain-text-legal",
  storageBucket: "plain-text-legal.firebasestorage.app",
  messagingSenderId: "376447417101",
  appId: "1:376447417101:web:a486cb23eae0dfabb98e44"
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