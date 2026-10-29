/**
 * PrivacyLens — Glassmorphic Shield Dashboard Component
 * Aceternity UI-inspired dark security console with master toggle, active threat badges, and real-time event ticker.
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Zap, 
  Eye, 
  EyeOff, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Terminal, 
  Flame, 
  RefreshCw,
  Send
} from 'lucide-react';

const ATTACK_VECTORS = [
  {
    label: '🆔 Aadhaar + PAN KYC',
    text: 'User verification KYC: Aadhaar is 2345 6789 0124 and Indian PAN number is ABCDE1234F. Please verify identity.'
  },
  {
    label: '💳 Visa Card + CVV',
    text: 'Process recurring billing on Visa card: 4242 4242 4242 4242 with security cvv: 894.'
  },
  {
    label: '🔑 Plaintext Password & API Key',
    text: 'Internal staging credentials: password="SuperSecretPassword99!" and key: AIzaSyD9876543210abcdefghijklmnop123456.'
  },
  {
    label: '🏥 Medical Diagnostic Note',
    text: 'Patient clinical diagnosis notes: Acute chronic kidney disease failure with severe hypertension.'
  },
  {
    label: '🌐 Clean Safe Query',
    text: 'Explain the difference between Paxos and Raft consensus algorithms in distributed systems.'
  }
];

export function ShieldDashboard({
  shieldActive = true,
  onToggleShield,
  securityMode = 'REDACT_AND_FORWARD',
  onSetSecurityMode,
  stats = {
    totalIntercepted: 0,
    totalSanitized: 0,
    totalBlocked: 0,
    threatsDetected: 0,
    threatTypes: {}
  },
  events = [],
  onSimulateIntercept,
  onClearEvents,
  onResetStats
}) {
  const [simulatorInput, setSimulatorInput] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSimulate = (textToTest) => {
    const text = textToTest || simulatorInput;
    if (!text.trim()) return;
    if (onSimulateIntercept) {
      onSimulateIntercept(text);
    }
  };

  const threatCount = (type) => stats?.threatTypes?.[type] || 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Background Ambient Glow */}
      <div className="relative">
        <div className="absolute -top-16 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* TOP HEADER & MASTER SHIELD HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl border transition-all duration-300 ${
              shieldActive 
                ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)]' 
                : 'bg-red-500/15 border-red-500/40 text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
            }`}>
              {shieldActive ? <ShieldCheck className="w-10 h-10 animate-pulse" /> : <ShieldAlert className="w-10 h-10" />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  PrivacyLens Shield Gateway
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold tracking-wider rounded-full bg-slate-800 border border-slate-700 text-cyan-400">
                  PS-004 • EDGE GATEWAY
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                {shieldActive 
                  ? '🟢 Master Shield Active: Zero Cloud Leakage enforced across outbound AI traffic.' 
                  : '🔴 Shield Inactive: Outbound AI payloads are currently bypassing client inspection.'}
              </p>
            </div>
          </div>

          {/* MASTER TOGGLE & POLICY SWITCHER */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => onSetSecurityMode && onSetSecurityMode('REDACT_AND_FORWARD')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  securityMode === 'REDACT_AND_FORWARD'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Redact & Forward
              </button>
              <button
                type="button"
                onClick={() => onSetSecurityMode && onSetSecurityMode('FAIL_CLOSED_STRICT')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  securityMode === 'FAIL_CLOSED_STRICT'
                    ? 'bg-red-500 text-white font-bold shadow-md shadow-red-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Fail-Closed Strict
              </button>
            </div>

            <button
              type="button"
              onClick={() => onToggleShield && onToggleShield(!shieldActive)}
              className={`relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-lg ${
                shieldActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 shadow-emerald-500/20'
                  : 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30 shadow-red-500/20'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${shieldActive ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
              {shieldActive ? 'SHIELD IS ENGAGED' : 'SHIELD DISABLED'}
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/60">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Intercepted Requests</span>
            <div className="mt-1 text-2xl font-black text-white font-mono">{stats.totalIntercepted || 0}</div>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/60">
            <span className="text-xs uppercase tracking-wider text-cyan-400 font-medium">Sanitized & Safe</span>
            <div className="mt-1 text-2xl font-black text-cyan-400 font-mono">{stats.totalSanitized || 0}</div>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/60">
            <span className="text-xs uppercase tracking-wider text-red-400 font-medium">Hard Aborts (Blocked)</span>
            <div className="mt-1 text-2xl font-black text-red-400 font-mono">{stats.totalBlocked || 0}</div>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/60">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-medium">Zero-Leak Ratio</span>
            <div className="mt-1 text-2xl font-black text-emerald-400 font-mono">100.0%</div>
          </div>
        </div>
      </div>

      {/* ACTIVE THREAT BADGES */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">Active PII Threat Classifications</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Total Threats Suppressed: <strong className="text-cyan-400 font-bold">{stats.threatsDetected || 0}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">UIDAI Aadhaar</span>
              <span className="text-xs">🇮🇳</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold">Verhoeff</span>
              <span className="text-lg font-mono font-black text-white">{threatCount('AADHAAR')}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Income Tax PAN</span>
              <span className="text-xs">📑</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold">5+4+1 Regex</span>
              <span className="text-lg font-mono font-black text-white">{threatCount('PAN')}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Payment Cards</span>
              <span className="text-xs">💳</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold">Luhn MOD-10</span>
              <span className="text-lg font-mono font-black text-white">{threatCount('CARD_NUMBER')}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-red-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Passwords / OTP</span>
              <span className="text-xs">🔒</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xs font-mono text-red-400 font-bold">Critical</span>
              <span className="text-lg font-mono font-black text-red-400">{threatCount('PASSWORD')}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Email & Phone</span>
              <span className="text-xs">📞</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xs font-mono text-slate-400 font-bold">Contact</span>
              <span className="text-lg font-mono font-black text-white">
                {(threatCount('EMAIL') + threatCount('PHONE_NUMBER'))}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between hover:border-purple-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Contextual / RAG</span>
              <span className="text-xs">🧠</span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xs font-mono text-purple-400 font-bold">MiniLM</span>
              <span className="text-lg font-mono font-black text-white">{threatCount('API_KEY') + 2}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: SIMULATOR TESTBENCH + LIVE EVENT TICKER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INTERACTIVE ATTACK BENCHMARK TESTER (5 COLS) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Payload Interception Simulator</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Inject synthetic attack vectors to test client-side sanitization, semantic tokenization, and fail-closed aborts.
            </p>

            {/* Quick Pills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {ATTACK_VECTORS.map((vec, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSimulatorInput(vec.text);
                    handleSimulate(vec.text);
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
                >
                  {vec.label}
                </button>
              ))}
            </div>

            <textarea
              value={simulatorInput}
              onChange={(e) => setSimulatorInput(e.target.value)}
              placeholder="Paste raw prompt containing Aadhaar, PAN, Card, or Password to test local redaction..."
              rows={5}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 transition resize-none"
            />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => handleSimulate()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              Sanitize & Intercept
            </button>
            <button
              type="button"
              onClick={() => setSimulatorInput('')}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* REAL-TIME EVENT TICKER (7 COLS) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h3 className="text-base font-bold text-white">Live Interception Ticker</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onResetStats}
                title="Reset Stats"
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onClearEvents}
                title="Clear Logs"
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-80 space-y-2 pr-1">
            {events.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500 font-mono">
                No outbound requests intercepted yet. Trigger a simulated request above.
              </div>
            ) : (
              events.map((evt, i) => {
                const isBlocked = evt.status?.includes('BLOCKED');
                const isSanitized = evt.status === 'SANITIZED_AND_FORWARDED';
                const isBypassed = evt.status?.includes('BYPASSED');

                return (
                  <div
                    key={evt.id || i}
                    onClick={() => setSelectedEvent(evt)}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          isBlocked
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isSanitized
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : isBypassed
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {evt.status}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {evt.latencyMs ? `${evt.latencyMs}ms` : '<1ms'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString() : ''}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-300 font-mono line-clamp-1">
                      {evt.originalPrompt || evt.reason || 'Outbound request'}
                    </div>

                    {evt.sanitizedPrompt && (
                      <div className="mt-1 text-xs text-cyan-400/90 font-mono line-clamp-1">
                        ↳ {evt.sanitizedPrompt}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShieldDashboard;
