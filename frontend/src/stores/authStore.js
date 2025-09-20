import { create } from 'zustand';
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  // Initialize auth listener
  initialize: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get fresh token
        const token = await user.getIdToken();
        localStorage.setItem('authToken', token);
        
        set({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
          },
          loading: false,
          error: null
        });
      } else {
        localStorage.removeItem('authToken');
        set({ user: null, loading: false, error: null });
      }
    });
  },

  // Sign in with email and password
  signInWithEmail: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', token);
      // Don't set loading to false here, let onAuthStateChanged handle it
      return userCredential.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Sign up with email and password
  signUpWithEmail: async (email, password, displayName) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', token);
      // Don't set loading to false here, let onAuthStateChanged handle it
      return userCredential.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', token);
      // Don't set loading to false here, let onAuthStateChanged handle it
      return userCredential.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      set({ user: null, error: null });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useAuthStore;