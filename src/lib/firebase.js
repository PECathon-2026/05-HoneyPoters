/**
 * PrivacyLens — Firebase Authentication Configuration & Helpers
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 * 
 * Configures Firebase App & Auth for Role-Based Access Control (RBAC),
 * Email/Password authentication, and Google Auth Provider with offline/demo resilience.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// Web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDUBUKDmKHTzBjwGPMNT440WI-khD4s2us",
  authDomain: "policylen-s.firebaseapp.com",
  projectId: "policylen-s",
  storageBucket: "policylen-s.firebasestorage.app",
  messagingSenderId: "1033931345489",
  appId: "1:1033931345489:web:061daddb44fa4093d27270",
  measurementId: "G-BP78CPYJ8X"
};

// Initialize Firebase safely
let app;
let auth;
let googleProvider;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (error) {
  console.warn('[PrivacyLens Firebase] Auth initialization warning:', error.message);
  app = null;
  auth = null;
  googleProvider = null;
}

export { 
  app, 
  auth, 
  googleProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  updateProfile
};
