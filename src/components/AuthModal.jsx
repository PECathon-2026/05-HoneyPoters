/**
 * PrivacyLens — Authentication & SecOps Session Modal
 * Manages in-memory ephemeral credentials, role-based access, and DPDP Act 2023 clearance
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
  Fingerprint
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const DEFAULT_PROFILES = [
  {
    id: 'secops-lead',
    name: 'Pranav Pushya (SecOps Lead)',
    email: 'secops@privacylens.internal',
    role: 'Security Administrator',
    clearance: 'Level 3 — Root Forensics & Policy Tuning',
    team: 'Team 05-HoneyPoters'
  },
  {
    id: 'pecathon-judge',
    name: 'PECathon 2026 Evaluator',
    email: 'evaluator@pecathon.org',
    role: 'Official Benchmark Judge',
    clearance: 'Level 3 — Evaluation Scenarios & Synthetic Benchmarks',
    team: 'PECathon PS-004 Jury'
  },
  {
    id: 'compliance-auditor',
    name: 'DPDP Privacy Auditor',
    email: 'compliance@dpdp-board.gov.in',
    role: 'Compliance Officer',
    clearance: 'Level 2 — Audit Trail & Ledger Verification',
    team: 'Regulatory Oversight'
  }
];

export function AuthModal({
  isOpen = false,
  onClose,
  currentUser = null,
  onLogin,
  onLogout
}) {
  const { isDark } = useTheme();
  const [selectedProfileId, setSelectedProfileId] = useState(
    currentUser?.id || 'secops-lead'
  );
  const [tokenCopied, setTokenCopied] = useState(false);

  if (!isOpen) return null;

  const handleSelectProfile = (profile) => {
    setSelectedProfileId(profile.id);
    if (onLogin) {
      onLogin(profile);
    }
  };

  const handleCopyToken = () => {
    const token = `privacylens_session_ram_${selectedProfileId}_${Date.now().toString(36)}`;
    navigator.clipboard?.writeText(token);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          isDark 
            ? 'bg-[#0a0a0a] border-neutral-800 text-neutral-100' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isDark ? 'border-neutral-800 bg-[#0d0d0d]' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">SecOps Authentication</h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono">
                Ephemeral In-Memory Client Session (PS-004)
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

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Active Session Status */}
          {currentUser ? (
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-black border-neutral-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{currentUser.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono">
                    {currentUser.role} • {currentUser.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 border border-red-500/20 transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <div className={`p-4 rounded-2xl border text-center space-y-2 ${
              isDark ? 'bg-black border-neutral-800' : 'bg-amber-50/50 border-amber-200'
            }`}>
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Operating as Anonymous Guest Evaluator</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Select an authorized SecOps profile below to unlock full telemetry injection and forensic override powers.
              </p>
            </div>
          )}

          {/* Profile Selector */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400 font-semibold block">
              Authorized SecOps Roles
            </label>
            <div className="space-y-2.5">
              {DEFAULT_PROFILES.map((profile) => {
                const isSelected = currentUser?.id === profile.id || selectedProfileId === profile.id;
                return (
                  <div
                    key={profile.id}
                    onClick={() => handleSelectProfile(profile)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/10 shadow-sm'
                        : isDark
                          ? 'border-neutral-800 bg-[#111111] hover:border-neutral-700'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isSelected 
                          ? 'bg-cyan-500 text-black' 
                          : isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {profile.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{profile.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            ({profile.team})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono">
                          {profile.clearance}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Privacy & Zero-Knowledge Safeguards */}
          <div className={`p-3.5 rounded-2xl border font-mono text-[11px] space-y-1.5 ${
            isDark ? 'bg-black border-neutral-800 text-neutral-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Storage Trust Boundary:</span>
            </div>
            <p>
              Session tokens and secret injection keys are stored solely in volatile browser RAM and purged upon tab closure. No credentials or session states are transmitted to any cloud server.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs font-mono ${
          isDark ? 'border-neutral-800 bg-[#0d0d0d]' : 'border-slate-100 bg-slate-50'
        }`}>
          <button
            type="button"
            onClick={handleCopyToken}
            className="text-slate-500 hover:text-cyan-500 transition flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            <span>{tokenCopied ? '✓ Token Copied' : 'Copy Session Token'}</span>
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
