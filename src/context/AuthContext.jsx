/**
 * PrivacyLens — Firebase Authentication & Role-Based Access Control (RBAC) Context
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 * 
 * Manages Firebase User sessions, Demo Role Switching (SecOps Lead, PECathon Evaluator, DPDP Auditor),
 * cross-context token persistence (chrome.storage.local & localStorage), and backend API token headers.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from '../lib/firebase';
import { loginUser } from '../lib/apiClient';
import { USER_ROLES } from '../lib/roles';

export { USER_ROLES };

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(USER_ROLES.SECOPS_LEAD);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /**
   * Persists session token and role across Chrome Extension storage & LocalStorage
   */
  const saveAuthSession = (userObj, roleObj, sessionToken) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (sessionToken) window.localStorage.setItem('privacylens_auth_token', sessionToken);
        if (roleObj) window.localStorage.setItem('privacylens_auth_role', JSON.stringify(roleObj));
        if (userObj) window.localStorage.setItem('privacylens_auth_user', JSON.stringify(userObj));
      }

      // Sync to Chrome Extension Storage if running inside or alongside extension
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.set({
          privacylens_auth_token: sessionToken,
          privacylens_auth_role: roleObj,
          privacylens_auth_user: userObj
        });
      }
    } catch (e) {
      console.warn('[AuthContext] Session storage sync warning:', e);
    }
  };

  /**
   * Clears session from all storage providers
   */
  const clearAuthSession = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('privacylens_auth_token');
        window.localStorage.removeItem('privacylens_auth_role');
        window.localStorage.removeItem('privacylens_auth_user');
      }

      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.remove(['privacylens_auth_token', 'privacylens_auth_role', 'privacylens_auth_user']);
      }
    } catch (e) {}
  };

  // 1. Initial State Restoration
  useEffect(() => {
    const restoreSession = async () => {
      let savedUser = null;
      let savedRole = USER_ROLES.SECOPS_LEAD;
      let savedToken = null;

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const u = window.localStorage.getItem('privacylens_auth_user');
          const r = window.localStorage.getItem('privacylens_auth_role');
          const t = window.localStorage.getItem('privacylens_auth_token');
          if (u) savedUser = JSON.parse(u);
          if (r) savedRole = JSON.parse(r);
          if (t) savedToken = t;
        }
      } catch (e) {}

      // Default demo initial user if none saved
      if (!savedUser) {
        savedUser = {
          uid: 'secops-lead',
          displayName: USER_ROLES.SECOPS_LEAD.name,
          email: USER_ROLES.SECOPS_LEAD.email,
          isAnonymous: false,
          role: USER_ROLES.SECOPS_LEAD.role
        };
        savedToken = `privacylens_ram_token_${Date.now()}`;
      }

      setCurrentUser(savedUser);
      setUserRole(savedRole);
      setToken(savedToken);
      saveAuthSession(savedUser, savedRole, savedToken);
      setLoading(false);
    };

    restoreSession();

    // 2. Listen to Firebase Auth State Changes if auth initialized
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          const userPayload = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Authenticated User',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            role: userRole.role
          };
          setCurrentUser(userPayload);
          setToken(idToken);
          saveAuthSession(userPayload, userRole, idToken);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  /**
   * Login with Email and Password (Firebase Auth)
   */
  const loginWithEmail = async (email, password) => {
    setAuthError(null);
    try {
      if (!auth) throw new Error('Firebase Auth is in offline mode');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const userPayload = {
        uid: userCredential.user.uid,
        displayName: userCredential.user.displayName || email.split('@')[0],
        email: userCredential.user.email,
        role: userRole.role
      };
      setCurrentUser(userPayload);
      setToken(idToken);
      saveAuthSession(userPayload, userRole, idToken);
      return { success: true, user: userPayload };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Register with Email and Password (Firebase Auth)
   */
  const signupWithEmail = async (email, password, displayName = '', roleId = 'secops-lead') => {
    setAuthError(null);
    try {
      if (!auth) throw new Error('Firebase Auth is in offline mode');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      const idToken = await userCredential.user.getIdToken();
      const targetRole = Object.values(USER_ROLES).find(r => r.id === roleId) || USER_ROLES.SECOPS_LEAD;
      const userPayload = {
        uid: userCredential.user.uid,
        displayName: displayName || email.split('@')[0],
        email: userCredential.user.email,
        role: targetRole.role
      };
      setCurrentUser(userPayload);
      setUserRole(targetRole);
      setToken(idToken);
      saveAuthSession(userPayload, targetRole, idToken);
      return { success: true, user: userPayload };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * Sign in with Google Auth Provider (Firebase Auth)
   */
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      if (!auth || !googleProvider) throw new Error('Google Auth is unavailable in this environment');
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const userPayload = {
        uid: result.user.uid,
        displayName: result.user.displayName || 'Google User',
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: userRole.role
      };
      setCurrentUser(userPayload);
      setToken(idToken);
      saveAuthSession(userPayload, userRole, idToken);
      return { success: true, user: userPayload };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  /**
   * 1-Click Demo Role Switcher (Dedicated to Hackathon Evaluators & Jury)
   */
  const switchDemoRole = async (roleKey) => {
    const targetRole = USER_ROLES[roleKey] || Object.values(USER_ROLES).find(r => r.id === roleKey) || USER_ROLES.SECOPS_LEAD;
    setUserRole(targetRole);

    // Call backend login to retrieve authorized HMAC session token
    let backendToken = null;
    try {
      const res = await loginUser(targetRole.id, targetRole.name, targetRole.email);
      if (res && res.token) {
        backendToken = res.token;
      }
    } catch (e) {}

    const newToken = backendToken || `pl_demo_${targetRole.id}_${Date.now()}`;
    const userPayload = {
      uid: targetRole.id,
      displayName: targetRole.name,
      email: targetRole.email,
      role: targetRole.role,
      clearance: targetRole.clearance,
      team: targetRole.team
    };

    setCurrentUser(userPayload);
    setToken(newToken);
    saveAuthSession(userPayload, targetRole, newToken);
    return { success: true, user: userPayload, role: targetRole };
  };

  /**
   * Log out
   */
  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (e) {}
    setCurrentUser(null);
    setToken(null);
    clearAuthSession();
  };

  const value = {
    currentUser,
    userRole,
    token,
    loading,
    authError,
    setAuthError,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    switchDemoRole,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
