/**
 * PrivacyLens — Autonomous Agentic Form Playground
 * Live Simulated Browser Session with Real-Time DOM Attribute & Value Interception
 * Demonstrates Autonomous AI Browser Agent DOM Extraction Defense.
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useState } from 'react';
import { 
  Bot, 
  Globe, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  CreditCard, 
  Lock, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Zap, 
  Eye, 
  EyeOff,
  Copy,
  Check
} from 'lucide-react';
import { scanText, sanitizeText, PII_TYPES } from '../lib/scanner.js';

const MOCK_PROFILES = [
  {
    name: 'Rahul Sharma',
    aadhaar: '2345 6789 0124',
    pan: 'ABCDE1234F',
    card: '4242 4242 4242 4242',
    cvv: '894',
    password: 'SuperSecretPass99!',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@pec.edu'
  },
  {
    name: 'Priya Patel',
    aadhaar: '9876 5432 1098',
    pan: 'BNZPP9876K',
    card: '4111 1111 1111 1111',
    cvv: '123',
    password: 'VaultPassword#2026',
    phone: '+91 91234 56789',
    email: 'priya.patel@startup.in'
  }
];

export function AgenticPlayground({ onSimulateIntercept }) {
  const [formData, setFormData] = useState({
    fullName: '',
    aadhaar: '',
    pan: '',
    card: '',
    cvv: '',
    password: '',
    phone: '',
    email: ''
  });

  const [agentRunning, setAgentRunning] = useState(false);
  const [extractedPayload, setExtractedPayload] = useState(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAutofill = (profileIndex = 0) => {
    const prof = MOCK_PROFILES[profileIndex] || MOCK_PROFILES[0];
    setFormData(prof);
    setExtractedPayload(null);
  };

  const handleClear = () => {
    setFormData({
      fullName: '',
      aadhaar: '',
      pan: '',
      card: '',
      cvv: '',
      password: '',
      phone: '',
      email: ''
    });
    setExtractedPayload(null);
  };

  // Run Autonomous Agent DOM Extraction Simulation
  const handleRunAgentExtraction = (withShield = true) => {
    setAgentRunning(true);
    setExtractedPayload(null);

    setTimeout(() => {
      // Raw string assembled by agent reading page DOM
      const rawDOMString = `[AGENT DOM SNAPSHOT]
Page URL: https://portal.pec-bank.in/customer-kyc
User Full Name: ${formData.fullName || 'Rahul Sharma'}
UIDAI Aadhaar: ${formData.aadhaar || '2345 6789 0124'}
Income Tax PAN: ${formData.pan || 'ABCDE1234F'}
Payment Card: ${formData.card || '4242 4242 4242 4242'}
Security CVV: ${formData.cvv || '894'}
Account Password: "${formData.password || 'SuperSecretPass99!'}"
Contact Mobile: ${formData.phone || '+91 98765 43210'}
Contact Email: ${formData.email || 'rahul.sharma@pec.edu'}`;

      if (withShield) {
        // PrivacyLens Intercepts the extraction locally
        const sanitized = sanitizeText(rawDOMString);
        setExtractedPayload({
          mode: 'PROTECTED',
          original: rawDOMString,
          sanitized: sanitized.sanitizedText,
          threats: sanitized.threats,
          threatCount: sanitized.threats.length,
          isSafe: sanitized.isSafe
        });

        if (onSimulateIntercept) {
          onSimulateIntercept(rawDOMString);
        }
      } else {
        // Unprotected: Raw leak to cloud
        setExtractedPayload({
          mode: 'LEAKING',
          original: rawDOMString,
          sanitized: rawDOMString,
          threats: scanText(rawDOMString),
          threatCount: scanText(rawDOMString).length,
          isSafe: false
        });
      }

      setAgentRunning(false);
    }, 600);
  };

  const handleCopy = () => {
    if (!extractedPayload) return;
    navigator.clipboard?.writeText(extractedPayload.sanitized);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  // Inspect field for real-time visual badge
  const getFieldBadge = (field, val) => {
    if (!val || val.length < 3) return null;
    const scan = scanText(val);
    if (field === 'password' || scan.length > 0) {
      const type = scan[0]?.type || (field === 'password' ? 'PASSWORD' : 'PII');
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
          🛡️ Protected [{type}]
        </span>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-6 text-slate-100 font-sans mt-2">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <Bot className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              Autonomous Agentic Browser & DOM Playground
            </h2>
            <p className="text-xs text-slate-400">
              Simulate autonomous AI agents (web assistants, crawlers) reading live web forms and intercepting extraction
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleAutofill(0)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            Autofill Sample Profile 1
          </button>
          <button
            type="button"
            onClick={() => handleAutofill(1)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            Autofill Profile 2
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-400 border border-slate-800 transition"
          >
            Reset Form
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID: SIMULATED BROWSER SESSION + AGENT EXTRACTION INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SIMULATED WEB BROWSER WINDOW (6 COLS) */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col justify-between">
          {/* MOCK BROWSER CHROME URL BAR */}
          <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-md text-[11px] font-mono text-slate-300 w-3/4 justify-center">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>https://secure-portal.pec-bank.in/customer-kyc</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">CLIENT DOM</span>
          </div>

          {/* MOCK PAGE FORM CONTENT */}
          <div className="p-5 space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-semibold">User Full Name:</label>
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500/60 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold">UIDAI Aadhaar:</label>
                  {getFieldBadge('aadhaar', formData.aadhaar)}
                </div>
                <input
                  type="text"
                  value={formData.aadhaar}
                  onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                  placeholder="2345 6789 0124"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500/60 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold">Income Tax PAN:</label>
                  {getFieldBadge('pan', formData.pan)}
                </div>
                <input
                  type="text"
                  value={formData.pan}
                  onChange={(e) => handleInputChange('pan', e.target.value)}
                  placeholder="ABCDE1234F"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono uppercase focus:border-cyan-500/60 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold">Payment Card:</label>
                  {getFieldBadge('card', formData.card)}
                </div>
                <input
                  type="text"
                  value={formData.card}
                  onChange={(e) => handleInputChange('card', e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500/60 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold">CVV:</label>
                  {getFieldBadge('cvv', formData.cvv)}
                </div>
                <input
                  type="password"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  placeholder="894"
                  maxLength={4}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500/60 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold">Account Password:</label>
                  {getFieldBadge('password', formData.password)}
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500/60 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold">Contact Mobile:</label>
                  {getFieldBadge('phone', formData.phone)}
                </div>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500/60 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SIMULATION TRIGGER BUTTONS */}
          <div className="bg-slate-950/90 border-t border-slate-800 p-4 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              disabled={agentRunning}
              onClick={() => handleRunAgentExtraction(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <Bot className="w-4 h-4" />
              {agentRunning ? 'Agent Scanning DOM...' : 'Extract with PrivacyLens Shield'}
            </button>

            <button
              type="button"
              disabled={agentRunning}
              onClick={() => handleRunAgentExtraction(false)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40 text-xs font-semibold transition disabled:opacity-50"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Simulate Direct Leak
            </button>
          </div>
        </div>

        {/* AGENT EXTRACTION INSPECTOR (6 COLS) */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Autonomous Agent Outbound Payload Telemetry
                </h3>
              </div>
              {extractedPayload && (
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                  extractedPayload.mode === 'PROTECTED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse'
                }`}>
                  {extractedPayload.mode === 'PROTECTED' ? '🛡️ ZERO LEAKAGE' : '⚠️ CATASTROPHIC LEAK'}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Payload constructed by the autonomous agent ready for cloud LLM reasoning:
            </p>

            <div className={`rounded-xl p-4 border font-mono text-xs whitespace-pre-wrap leading-relaxed min-h-[220px] max-h-[320px] overflow-y-auto ${
              !extractedPayload
                ? 'bg-slate-950/80 border-slate-800 text-slate-500 flex items-center justify-center text-center'
                : extractedPayload.mode === 'PROTECTED'
                ? 'bg-slate-950 border-cyan-500/40 text-cyan-200'
                : 'bg-red-950/40 border-red-500/50 text-red-200 selection:bg-red-500 selection:text-white'
            }`}>
              {!extractedPayload ? (
                <span>
                  Click <strong className="text-cyan-400">"Extract with PrivacyLens Shield"</strong> to see how
                  PrivacyLens intercepts the autonomous agent before payload dispatch.
                </span>
              ) : (
                extractedPayload.sanitized
              )}
            </div>
          </div>

          {/* TELEMETRY FOOTER */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            {extractedPayload ? (
              <>
                <span>
                  Threats Sanitized: <strong className={extractedPayload.mode === 'PROTECTED' ? 'text-emerald-400' : 'text-red-400'}>
                    {extractedPayload.threatCount}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                >
                  {copiedPayload ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedPayload ? 'Copied' : 'Copy Output'}
                </button>
              </>
            ) : (
              <span>Status: Ready for Agentic Interception</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgenticPlayground;
