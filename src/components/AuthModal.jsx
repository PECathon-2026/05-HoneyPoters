/**
 * PrivacyLens — Glassmorphic Authentication & Role-Based Access Control (RBAC) Modal
 * Features Firebase Auth (Email/Password & Google Sign-In) + 1-Click Demo Role Switcher
 * Supported Roles: SecOps Lead, PECathon 2026 Evaluator, DPDP Auditor
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Key, 
  Lock, 
  LogOut, 
  LogIn, 
  CheckCircle2, 
  X, 
  Cpu, 
  ShieldAlert,
  Fingerprint,
  Mail,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, USER_ROLES } from '../context/AuthContext';

export const DEFAULT_PROFILES = Object.values(USER_ROLES);

export function AuthModal({
  isOpen = false,
  onClose,
  currentUser: propUser,
  onLogin,
  onLogout
}) {
  const { isDark } = useTheme();
  const { 
    currentUser: contextUser, 
    userRole, 
    token, 
    loginWithEmail, 
    signupWithEmail, 
    loginWithGoogle, 
    switchDemoRole, 
    logout: contextLogout,
    authError,
    setAuthError
  } = useAuth();

  const user = contextUser || propUser;

  // Active view: 'ROLES' (1-Click demo switcher for judges) | 'FIREBASE' (Email/Google login)
  const [activeTab, setActiveTab] = useState('ROLES');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);

  if (!isOpen) return null;

  const handleSelectRole = async (roleKey) => {
    setActionLoading(true);
    try {
      const res = await switchDemoRole(roleKey);
      if (onLogin && res.user) onLogin(res.user);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setActionLoading(true);
    try {
      if (isRegisterMode) {
        const res = await signupWithEmail(email, password, displayName);
        if (res.success && onLogin) onLogin(res.user);
      } else {
        const res = await loginWithEmail(email, password);
        if (res.success && onLogin) onLogin(res.user);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setActionLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success && onLogin) onLogin(res.user);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    await contextLogout();
    if (onLogout) onLogout();
  };

  const handleCopyToken = () => {
    const activeToken = token || `privacylens_session_ram_${user?.uid || 'guest'}_${Date.now().toString(36)}`;
    navigator.clipboard?.writeText(activeToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          isDark 
            ? 'bg-[#0a0a0a] border-neutral-800 text-neutral-100' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* HEADER */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isDark ? 'border-neutral-800 bg-[#0d0d0d]' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">SecOps Authentication</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold">
                  Firebase RBAC
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono">
                Team 05-HoneyPoters • PECathon 2026 (PS-004)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB SWITCHER: 1-Click Role Switcher vs Firebase Auth */}
        <div className={`flex border-b text-xs font-semibold ${
          isDark ? 'border-neutral-800 bg-black' : 'border-slate-200 bg-slate-100/70'
        }`}>
          <button
            type="button"
            onClick={() => { setActiveTab('ROLES'); setAuthError(null); }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'ROLES'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/5'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Role Switcher (Jury Demo)</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('FIREBASE'); setAuthError(null); }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'FIREBASE'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/5'
                : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Firebase Login & Register</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Active Session Status Card */}
          {user ? (
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-black border-neutral-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
                  {user.displayName ? user.displayName.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{user.displayName || user.name || 'SecOps User'}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                      {userRole?.role || user.role || 'ACTIVE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono">
                    {userRole?.clearance || user.clearance || 'Level 3 Clearance'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 border border-red-500/20 transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className={`p-4 rounded-2xl border text-center space-y-1 ${
              isDark ? 'bg-black border-neutral-800' : 'bg-amber-50/50 border-amber-200'
            }`}>
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Operating as Anonymous Guest Evaluator</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Select an authorized SecOps profile or sign in below to activate policy controls.
              </p>
            </div>
          )}

          {/* TAB 1: 1-Click Role Switcher */}
          {activeTab === 'ROLES' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400 font-semibold">
                  Select Evaluation Role
                </label>
                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                  Instant Access (No Password)
                </span>
              </div>

              <div className="space-y-2.5">
                {Object.entries(USER_ROLES).map(([key, role]) => {
                  const isSelected = userRole?.id === role.id || user?.uid === role.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => handleSelectRole(key)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/10 shadow-sm'
                          : isDark
                            ? 'border-neutral-800 bg-[#111111] hover:border-neutral-700'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                          isSelected 
                            ? 'bg-cyan-500 text-black' 
                            : isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {role.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{role.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300">
                              {role.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono mt-0.5">
                            {role.clearance}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Firebase Email/Password & Google Auth */}
          {activeTab === 'FIREBASE' && (
            <div className="space-y-4">
              {authError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                  {authError}
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-3">
                {isRegisterMode && (
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-neutral-400 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-black text-xs font-sans focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-neutral-400 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="evaluator@pecathon.org"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-black text-xs font-sans focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-neutral-400 block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-black text-xs font-sans focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
                  <span>{isRegisterMode ? 'Create Firebase Account' : 'Sign In with Email'}</span>
                </button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-neutral-800"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-400 uppercase">Or Continue With</span>
                <div className="flex-grow border-t border-slate-200 dark:border-neutral-800"></div>
              </div>

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={actionLoading}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-[#111111] hover:bg-slate-50 dark:hover:bg-neutral-900 font-semibold text-xs flex items-center justify-center gap-2.5 transition shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign In with Google</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  {isRegisterMode ? 'Already have an account? Sign In' : 'Need an evaluator account? Register'}
                </button>
              </div>
            </div>
          )}

          {/* Privacy & Zero-Knowledge Trust Boundary */}
          <div className={`p-3.5 rounded-2xl border font-mono text-[11px] space-y-1.5 ${
            isDark ? 'bg-black border-neutral-800 text-neutral-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Storage Trust Boundary:</span>
            </div>
            <p>
              Session tokens are synchronized with ephemeral browser memory. No sensitive credentials or PII are retained in persistent cloud databases.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className={`p-4 border-t flex items-center justify-between text-xs font-mono ${
          isDark ? 'border-neutral-800 bg-[#0d0d0d]' : 'border-slate-100 bg-slate-50'
        }`}>
          <button
            type="button"
            onClick={handleCopyToken}
            className="text-slate-500 hover:text-cyan-500 transition flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{tokenCopied ? '✓ Session Token Copied' : 'Copy Session Token'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
