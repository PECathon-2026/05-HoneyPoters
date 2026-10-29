/**
 * PrivacyLens — Payload Diff Inspector Component
 * Side-by-side comparison: Raw Intercepted Payload vs Sanitized Cloud Dispatch
 * Responsive from 320px mobile to 4K desktop, with Deep Dark & Beige Light theme support.
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  Layers, 
  Flame, 
  X,
  RefreshCw
} from 'lucide-react';

export function PayloadDiffInspector({
  latestIntercept,
  events = [],
  securityMode = 'REDACT_AND_FORWARD'
}) {
  const [copied, setCopied] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [dismissBlockedAlert, setDismissBlockedAlert] = useState(false);

  // Active event to display (either explicitly selected or latest from stream)
  const activeEvent = useMemo(() => {
    if (selectedEventId) {
      const found = events.find((e) => e.id === selectedEventId);
      if (found) return found;
    }
    if (latestIntercept) return latestIntercept;
    if (events.length > 0) return events[0];

    // Default fallback demo record
    return {
      id: 'demo_1',
      timestamp: new Date().toISOString(),
      status: 'SANITIZED_AND_FORWARDED',
      targetUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      threatCount: 3,
      threats: [
        { type: 'AADHAAR', severity: 'HIGH' },
        { type: 'PAN', severity: 'HIGH' },
        { type: 'PASSWORD', severity: 'CRITICAL' }
      ],
      originalPrompt: `User onboarding KYC request:
Customer Aadhaar: 2345 6789 0124
Customer PAN: ABCDE1234F
Temporary Password: password="OnboardSecret99!"
Please generate a welcome email for this user.`,
      sanitizedPrompt: `User onboarding KYC request:
Customer Aadhaar: [REDACTED: AADHAAR]
Customer PAN: [REDACTED: PAN]
Temporary Password: password="[REDACTED: PASSCODE]"
Please generate a welcome email for this user.`,
      latencyMs: 11
    };
  }, [selectedEventId, events, latestIntercept]);

  const isBlocked = activeEvent?.status?.includes('BLOCKED');
  const showBlockedOverlay = isBlocked && !dismissBlockedAlert;

  const handleCopySanitized = () => {
    if (!activeEvent?.sanitizedPrompt) return;
    navigator.clipboard?.writeText(activeEvent.sanitizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render text with highlighted tokens
  const renderHighlightedSanitized = (text) => {
    if (!text) return <span className="text-slate-400 italic">No payload transmitted</span>;

    const parts = text.split(/(\[REDACTED:\s*[A-Z_]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[REDACTED:')) {
        return (
          <span
            key={index}
            className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-500/40 shadow-sm"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="w-full space-y-6 text-slate-800 dark:text-slate-100 font-sans transition-colors">
      {/* SECTION HEADER & SELECTOR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Payload Diff & Gatekeeper Inspector
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero-leak verification: compare raw client input against safe payload dispatched to cloud AI
            </p>
          </div>
        </div>

        {/* Transaction Selector Dropdown */}
        {events.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Transaction:</span>
            <select
              value={activeEvent?.id || ''}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setDismissBlockedAlert(false);
              }}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {events.slice(0, 10).map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.status} ({evt.threatCount || 0} threats) - {new Date(evt.timestamp).toLocaleTimeString()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* FAIL-CLOSED HARD ABORT VISUAL ALERT OVERLAY */}
      {showBlockedOverlay && (
        <div className="relative overflow-hidden rounded-2xl bg-red-500/10 dark:bg-red-950/80 border-2 border-red-500/70 backdrop-blur-xl p-5 shadow-lg transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40 animate-pulse">
                <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded bg-red-500 text-white">
                    HARD NETWORK ABORT
                  </span>
                  <span className="text-xs font-mono text-red-600 dark:text-red-300">
                    CODE: PRIVACYLENS_FAIL_CLOSED_BLOCKED
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                  Outbound Request Terminated Locally — Zero Bytes Transmitted
                </h3>
                <p className="text-xs text-red-700 dark:text-red-200/90 mt-1">
                  {activeEvent?.reason || 'Strict security policy hard-aborted request due to sensitive credential detection.'}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-slate-600 dark:text-slate-300">
                  <span>Target: <strong className="text-slate-900 dark:text-white">{activeEvent?.targetUrl || 'Google Gemini API'}</strong></span>
                  <span>Threats Blocked: <strong className="text-red-600 dark:text-red-400">{activeEvent?.threatCount || 1}</strong></span>
                  <span>Latency: <strong className="text-slate-900 dark:text-white">{activeEvent?.latencyMs || 2}ms</strong></span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDismissBlockedAlert(true)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg transition"
              title="Dismiss Alert Overlay"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE DIFF PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        {/* LEFT COLUMN: RAW INTERCEPTED PAYLOAD (5 COLS) */}
        <div className="lg:col-span-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-red-500/30 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-red-500/20 pb-2.5">
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-bold text-red-600 dark:text-red-300">
                  Raw Intercepted Payload (Unsanitized)
                </h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-red-500/15 text-red-600 dark:text-red-300 border border-red-500/30">
                {activeEvent?.threatCount || 0} RAW LEAK(S) DETECTED
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              Captured from client DOM / AI prompt before leaving the browser:
            </p>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 font-mono text-xs text-red-700 dark:text-red-200/90 whitespace-pre-wrap break-words leading-relaxed min-h-[180px] max-h-[300px] overflow-y-auto overflow-x-auto">
              {activeEvent?.originalPrompt || 'No raw payload captured'}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Size: {activeEvent?.originalPrompt?.length || 0} chars</span>
            <span className="text-red-500 font-semibold">Intercepted at Edge</span>
          </div>
        </div>

        {/* CENTER PILLAR: PIPELINE BRIDGE (2 COLS) */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 lg:py-0">
          <div className="flex lg:flex-col items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-sm">
              <Layers className="w-6 h-6 animate-pulse" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 hidden lg:block" />
            <div className="text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
                Local Redaction
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-300 block">
                {activeEvent?.latencyMs ? `${activeEvent.latencyMs}ms` : '<10ms'}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SANITIZED CLOUD DISPATCH (5 COLS) */}
        <div className={`lg:col-span-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between transition-colors ${
          isBlocked ? 'border-red-500/40' : 'border-emerald-500/30'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                {isBlocked ? (
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                ) : (
                  <Lock className="w-4 h-4 text-emerald-500" />
                )}
                <h3 className={`text-sm font-bold ${isBlocked ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-300'}`}>
                  {isBlocked ? 'Dispatched to Cloud: NONE (Blocked)' : 'Sanitized Payload (Safe for Gemini)'}
                </h3>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                isBlocked
                  ? 'bg-red-500/15 text-red-600 dark:text-red-300 border border-red-500/30'
                  : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
              }`}>
                {isBlocked ? 'ABORTED' : '0 LEAKS VERIFIED'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              {isBlocked 
                ? 'Network transmission halted in RAM; zero data sent to external AI servers.' 
                : 'All PII substituted with semantic tokens ready for Google Gemini API:'}
            </p>

            <div className={`rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border font-mono text-xs whitespace-pre-wrap break-words leading-relaxed min-h-[180px] max-h-[300px] overflow-y-auto overflow-x-auto ${
              isBlocked ? 'border-red-500/30 text-red-700 dark:text-red-300/80 italic' : 'border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
            }`}>
              {isBlocked ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center space-y-2">
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                  <p className="font-bold text-red-600 dark:text-red-400">HARD NETWORK ABORT ENFORCED</p>
                  <p className="text-xs text-slate-500">Zero bytes traversed the browser network boundary.</p>
                </div>
              ) : (
                renderHighlightedSanitized(activeEvent?.sanitizedPrompt)
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Size: {activeEvent?.sanitizedPrompt?.length || 0} chars</span>
            {!isBlocked && activeEvent?.sanitizedPrompt && (
              <button
                type="button"
                onClick={handleCopySanitized}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy Sanitized'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayloadDiffInspector;
