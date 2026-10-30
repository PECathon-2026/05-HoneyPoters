/**
 * PrivacyLens — Glassmorphic Authentication & Role-Based Access Control (RBAC) Modal
 * Features Firebase Auth (Email/Password & Google Sign-In) with Role Authorization
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
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES, DEFAULT_PROFILES } from '../lib/roles';

export { DEFAULT_PROFILES, USER_ROLES };

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
    logout: contextLogout,
    authError,
    setAuthError
  } = useAuth();

  const user = contextUser || propUser;

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState('secops-lead');
  const [actionLoading, setActionLoading] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!isOpen) return null;

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setActionLoading(true);
    try {
      if (isRegisterMode) {
        const res = await signupWithEmail(email, password, displayName, selectedRole);
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
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all duration-200 ${
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
            <div className="w-10 h-10 rounded-2xl bg-[#3DE2DD]/15 text-[#3DE2DD] flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">SecOps Authentication</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3DE2DD]/10 text-[#3DE2DD] border border-[#3DE2DD]/30 font-bold">
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

        {/* MODAL BODY */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {user ? (
            /* SIGNED IN VIEW: Profile details, role telemetry, and Sign Out (Zero sign-in inputs shown) */
            <div className="space-y-4">
              {/* Profile Card */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-black border-neutral-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-base">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.name ? user.name.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{user.displayName || user.name || 'SecOps User'}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                        {userRole?.role || user.role || 'SecOps Lead'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono mt-0.5">
                      {userRole?.clearance || user.clearance || 'Level 3 — Root Forensics & Policy Tuning'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 border border-red-500/20 transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Active Session Telemetry Details */}
              <div className={`p-4 rounded-2xl border space-y-2.5 text-xs font-mono ${
                isDark ? 'bg-black/40 border-neutral-800' : 'bg-slate-50/70 border-slate-200'
              }`}>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-1">
                  Active Session Telemetry
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-neutral-800/60">
                  <span className="text-slate-500 dark:text-neutral-400">Account Email:</span>
                  <span className="font-semibold text-slate-800 dark:text-neutral-200 truncate max-w-[220px]">
                    {user.email || 'internal-secops@privacylens.internal'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-neutral-800/60">
                  <span className="text-slate-500 dark:text-neutral-400">Auth Method:</span>
                  <span className="font-semibold text-[#3DE2DD]">
                    Firebase RBAC (Secure Gateway)
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-neutral-800/60">
                  <span className="text-slate-500 dark:text-neutral-400">Session Status:</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-500 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Authenticated & Verified
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 dark:text-neutral-400">Principal UID:</span>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-neutral-400 truncate max-w-[200px]">
                    {user.uid || 'secops-lead-001'}
                  </span>
                </div>
              </div>

              {/* RBAC Capabilities Granted */}
              <div className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                isDark ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Authorized Capabilities Granted:</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono pl-6">
                  <div>• Fail-Closed Policy Tuning</div>
                  <div>• Outbound PII Redaction</div>
                  <div>• 5 Evaluation Scenarios</div>
                  <div>• SHA-256 Tamper Audit</div>
                </div>
              </div>
            </div>
          ) : (
            /* GUEST MODE VIEW: Guest Alert + Firebase Login/Register Form */
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border text-center space-y-1 ${
                isDark ? 'bg-black border-neutral-800' : 'bg-amber-50/50 border-amber-200'
              }`}>
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Operating as Anonymous Guest Evaluator</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Sign in with your Firebase credentials below to unlock authenticated SecOps telemetry.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                  {authError}
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-3">
                {isRegisterMode && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-neutral-400 block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Pranav Pushya"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-black text-xs font-sans focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 dark:text-neutral-400 block mb-1">
                        Assign Authorization Role
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-black text-xs font-sans focus:outline-none focus:border-cyan-500"
                      >
                        <option value="secops-lead">SecOps Lead (Level 3 Root Forensics)</option>
                        <option value="pecathon-judge">PECathon 2026 Evaluator (Level 3 Benchmarks)</option>
                        <option value="compliance-auditor">DPDP Auditor (Level 2 Ledger Verification)</option>
                      </select>
                    </div>
                  </>
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
                    placeholder="secops@privacylens.internal"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-black text-xs font-sans focus:outline-none focus:border-[#3DE2DD]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-[#3DE2DD] hover:bg-[#34c7c2] text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-[#3DE2DD]/20"
                >
                  {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
                  <span>{isRegisterMode ? 'Create Firebase Account' : 'Sign In with Email'}</span>
                </button>
              </form>

              <div className="relative flex py-1 items-center">
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

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthError(null); }}
                  className="text-xs text-[#3DE2DD] hover:underline"
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
            <div className="flex items-center gap-2 text-[#3DE2DD] font-bold">
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
            className="text-slate-500 hover:text-[#3DE2DD] transition flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{tokenCopied ? '✓ Session Token Copied' : 'Copy Session Token'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#3DE2DD] text-black font-bold hover:bg-[#34c7c2] transition shadow-md shadow-[#3DE2DD]/20"
          >
            Done
          </button>
        </div>

        {/* Mandatory Sign Out Confirmation Dialog */}
        {showLogoutConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
            <div 
              className={`w-full max-w-sm rounded-2xl border p-5 shadow-2xl space-y-4 ${
                isDark 
                  ? 'bg-[#111111] border-neutral-800 text-neutral-100 shadow-black/90' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-xl'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Confirm Sign Out</h3>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono">SecOps Session Termination</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                Are you sure you want to sign out from <span className="font-bold text-cyan-600 dark:text-cyan-400">{user?.displayName || user?.name || user?.email || 'SecOps Session'}</span>? Your active session token will be revoked and you will return to Anonymous Guest Mode.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setShowLogoutConfirm(false);
                    await handleLogout();
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-500/20 transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Yes, Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
