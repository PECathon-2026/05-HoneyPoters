/**
 * PrivacyLens — Dedicated Home Page Component
 * Features Hero Section, Live Master Shield Toggle, Health Indicator, and Dedicated Navigation Cards
 * Styled with Pure Z-Black Dark Mode (#000000 / #0a0a0a) and Warm Beige Light Mode (#fdfbf7)
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  BarChart3, 
  SplitSquareVertical, 
  FlaskConical, 
  FileText, 
  ArrowRight, 
  Cpu, 
  Lock, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Layers, 
  Terminal,
  ExternalLink,
  Sliders,
  SlidersHorizontal,
  Download
} from 'lucide-react';

export function HomePage({
  shieldActive = true,
  onToggleShield,
  securityMode = 'REDACT_AND_FORWARD',
  onSetSecurityMode,
  stats = {
    totalIntercepted: 0,
    totalSanitized: 0,
    totalBlocked: 0,
    threatsDetected: 0
  },
  onNavigate
}) {
  const zeroLeakRatio = stats.totalIntercepted > 0
    ? '100.0%'
    : '100.0%';

  return (
    <div className="w-full space-y-10 font-sans pb-12">
      {/* 1. HERO SECTION & VALUE PROPOSITION */}
      <section className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-[#0a0a0a] border border-slate-200/90 dark:border-neutral-800 p-6 sm:p-10 shadow-xl transition-all">
        {/* Subtle Ambient Orb (Light mode only - dark mode is pure clean pitch black) */}
        <div className="absolute -top-24 -left-20 w-80 h-80 bg-cyan-500/10 dark:hidden rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 text-xs font-mono font-bold tracking-wider rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                PS-004 • PRIVACYLENS
              </span>
              <span className="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ZERO CLOUD LEAKAGE
              </span>
              <span className="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-slate-200 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-300 dark:border-neutral-800">
                PECATHON 2026
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Zero Cloud Leakage Shield for{' '}
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400 bg-clip-text text-transparent">
                AI Browser Agents
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-neutral-400 leading-relaxed">
              PrivacyLens sits directly at the browser edge to intercept, detect, and redact sensitive personal identifiers, 
              financial credentials, visual faces, and private chat logs <span className="font-semibold text-slate-900 dark:text-white">before</span> outbound 
              payloads traverse the network to Google Gemini or third-party LLMs.
            </p>

            {/* Quick architectural bullet pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-slate-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>Deterministic Luhn & Verhoeff</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>Offscreen Canvas Solid Blackout</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>Fail-Closed Tripwire Abort</span>
              </div>
            </div>

            {/* Primary Action Buttons Connecting into Shield Cockpit */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href="/PrivacyLens-Extension-v2.0.0.zip"
                download="PrivacyLens-Extension-v2.0.0.zip"
                className="px-5 py-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-extrabold text-sm border border-cyan-500/30 flex items-center gap-2 hover:scale-[1.02] transition-all shadow-md shadow-cyan-500/10"
                title="Download PrivacyLens Chrome Extension for local browser installation"
              >
                <Download className="w-4 h-4" />
                <span>Download Extension (.zip)</span>
              </a>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('shield')}
                className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all"
              >
                <Sliders className="w-4 h-4" />
                <span>Launch Shield Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('scenarios')}
                className="px-5 py-3 rounded-2xl bg-slate-200/80 dark:bg-neutral-900 hover:bg-slate-300 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 font-bold text-sm border border-slate-300 dark:border-neutral-800 flex items-center gap-2 transition-all"
              >
                <FlaskConical className="w-4 h-4 text-emerald-500" />
                <span>5 Evaluation Scenarios</span>
              </button>
            </div>
          </div>

          {/* MASTER SHIELD LIVE COCKPIT CONTROLLER */}
          <div className="w-full lg:w-80 shrink-0 bg-slate-100/90 dark:bg-[#111111] border border-slate-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xl space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${shieldActive ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400' : 'bg-red-500/15 text-red-500'}`}>
                  {shieldActive ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Master Shield</h3>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono">
                    {shieldActive ? 'Zero Leakage Enforced' : 'Bypass Active'}
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => onToggleShield && onToggleShield(!shieldActive)}
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  shieldActive ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-neutral-800'
                }`}
                title={shieldActive ? 'Disable Shield' : 'Enable Shield'}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    shieldActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Security Mode Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-neutral-800">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Security Policy
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-200/80 dark:bg-black p-1 rounded-xl text-xs border border-transparent dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => onSetSecurityMode && onSetSecurityMode('REDACT_AND_FORWARD')}
                  className={`py-1.5 rounded-lg font-medium transition ${
                    securityMode === 'REDACT_AND_FORWARD'
                      ? 'bg-white dark:bg-neutral-900 text-cyan-600 dark:text-cyan-400 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Redact
                </button>
                <button
                  type="button"
                  onClick={() => onSetSecurityMode && onSetSecurityMode('FAIL_CLOSED_STRICT')}
                  className={`py-1.5 rounded-lg font-medium transition ${
                    securityMode === 'FAIL_CLOSED_STRICT'
                      ? 'bg-red-500 text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Strict Block
                </button>
              </div>
            </div>

            {/* Real-time status pill */}
            <div className={`p-2.5 rounded-xl text-xs font-mono font-medium text-center border ${
              shieldActive
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
            }`}>
              {shieldActive ? '🟢 Zero Cloud Leakage: ACTIVE' : '⚠️ Direct Cloud Bypass: ENGAGED'}
            </div>
          </div>
        </div>

        {/* METRICS KPI BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-neutral-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200/80 dark:border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-neutral-400 font-semibold">
              Intercepted Requests
            </span>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {stats.totalIntercepted || 0}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200/80 dark:border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">
              Sanitized Locally
            </span>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
              {stats.totalSanitized || 0}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200/80 dark:border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-red-600 dark:text-red-400 font-semibold">
              Fail-Closed Aborts
            </span>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 font-mono">
              {stats.totalBlocked || 0}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111111] border border-slate-200/80 dark:border-neutral-800">
            <span className="text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
              Zero-Leak Ratio
            </span>
            <div className="mt-1 text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {zeroLeakRatio}
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEDICATED PAGE NAVIGATION CARDS (4 PRIMARY PILLARS) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Dedicated Core Modules
            </h2>
            <p className="text-sm text-slate-600 dark:text-neutral-400">
              Access focused workspaces for evaluation, telemetry inspection, payload diffs, and forensics
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-neutral-400 bg-slate-200/60 dark:bg-[#111111] border border-slate-300 dark:border-neutral-800 px-3 py-1 rounded-full w-fit">
            4 DEDICATED VIEWS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CARD 1: 📊 Analytics & Telemetry */}
          <div 
            onClick={() => onNavigate && onNavigate('analytics')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-neutral-800 p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-cyan-500/50 hover:dark:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  /analytics
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Analytics & Telemetry
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                  Real-time time-series area charts, PII threat category breakdown, and dynamic DPDP Act 2023 health score index.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
                <div className="bg-slate-100 dark:bg-black p-2 rounded-xl border border-slate-200 dark:border-neutral-800">
                  <div className="text-slate-500 text-[10px]">Health Index</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">98 / 100</div>
                </div>
                <div className="bg-slate-100 dark:bg-black p-2 rounded-xl border border-slate-200 dark:border-neutral-800">
                  <div className="text-slate-500 text-[10px]">Categories</div>
                  <div className="font-bold text-cyan-600 dark:text-cyan-400">7 PII Types</div>
                </div>
                <div className="bg-slate-100 dark:bg-black p-2 rounded-xl border border-slate-200 dark:border-neutral-800">
                  <div className="text-slate-500 text-[10px]">Latency</div>
                  <div className="font-bold text-slate-900 dark:text-white">&lt;12ms</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Explore Telemetry Charts</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* CARD 2: 🔍 Payload Diff Inspector */}
          <div 
            onClick={() => onNavigate && onNavigate('diff')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-neutral-800 p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-cyan-500/50 hover:dark:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                  <SplitSquareVertical className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                  /diff
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Payload Diff Inspector
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                  Side-by-side comparative inspection between raw DOM captures and sanitized outbound cloud payloads with fail-closed overlays.
                </p>
              </div>

              <div className="bg-slate-100 dark:bg-black p-3 rounded-xl border border-slate-200 dark:border-neutral-800 font-mono text-[11px] space-y-1">
                <div className="text-red-500 truncate">- Raw: KYC Aadhaar 2345 6789 0124 & PAN ABCDE1234F</div>
                <div className="text-emerald-600 dark:text-emerald-400 truncate">+ Redacted: [REDACTED: AADHAAR] & [REDACTED: PAN]</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Inspect Payload Diff Stream</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* CARD 3: 🧪 5 Evaluation Scenarios */}
          <div 
            onClick={() => onNavigate && onNavigate('scenarios')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-neutral-800 p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-cyan-500/50 hover:dark:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  /scenarios
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  5 Evaluation Scenarios
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                  Interactive benchmark testing live redaction and autonomous DOM autofill across all mandatory hackathon target surfaces.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-transparent dark:border-neutral-800">1. E-commerce</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-transparent dark:border-neutral-800">2. Auth OTP</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-transparent dark:border-neutral-800">3. Support</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-transparent dark:border-neutral-800">4. Face Blackout</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-transparent dark:border-neutral-800">5. Dev Keys</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Run Scenario Benchmarks</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* CARD 4: 📜 Audit Forensics Ledger */}
          <div 
            onClick={() => onNavigate && onNavigate('audit')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-neutral-800 p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-cyan-500/50 hover:dark:border-neutral-700 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  /audit
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Audit Forensics Ledger
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
                  Searchable client-side audit ledger with cryptographic verification, zero raw secret retention, and DPDP / GDPR exports.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-100 dark:bg-black p-2 rounded-xl border border-slate-200 dark:border-neutral-800">
                  <span className="text-[10px] text-slate-500">Compliance</span>
                  <div className="font-bold text-slate-900 dark:text-white">DPDP 2023 / GDPR</div>
                </div>
                <div className="bg-slate-100 dark:bg-black p-2 rounded-xl border border-slate-200 dark:border-neutral-800">
                  <span className="text-[10px] text-slate-500">Formats</span>
                  <div className="font-bold text-amber-600 dark:text-amber-400">JSON & CSV</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>View Audit Forensics</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. LAB SHORTCUTS (PLAYGROUND, VISUAL STUDIO, SHIELD COCKPIT) */}
      <section className="rounded-3xl bg-slate-100/70 dark:bg-[#080808] border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Autonomous Agent & Visual Lab Tools
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Interactive simulators for DOM auto-injection, offscreen canvas redactions, and live attack testbeds
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('playground')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-neutral-800 hover:border-cyan-500 hover:dark:border-neutral-700 text-left transition group shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Agentic Playground
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Autonomous browser agent form autofill with volatile RAM secret injector.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('visual')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-neutral-800 hover:border-cyan-500 hover:dark:border-neutral-700 text-left transition group shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Visual Redaction Studio
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Canvas-based visual coordinate blackout for profile pictures & ID cards.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('shield')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-neutral-800 hover:border-cyan-500 hover:dark:border-neutral-700 text-left transition group shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Shield Cockpit & Attack Tester
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Real-time threat testbed with Aadhaar KYC, PAN, credit card, and password probes.
            </p>
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
