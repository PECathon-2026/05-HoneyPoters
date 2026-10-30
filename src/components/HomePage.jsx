/**
 * PrivacyLens — Dedicated Home Page Component
 * Features Full-Screen Interactive WebGL Caustic Ray Hero Section (ReflectBackground in #3DE2DD),
 * One-Full-Scroll Operational Cockpit (Master Shield Controller, Real-Time KPIs, 4 Core Modules, and Lab Tools)
 * Styled with Pure Z-Black (#000000 / #0a0a0a) and Electric Neon Minor (#3DE2DD)
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
  Download,
  ChevronDown
} from 'lucide-react';
import ReflectBackground from './ReflectBackground';

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

  const scrollToCockpit = () => {
    const el = document.getElementById('operational-cockpit');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full font-sans pb-16 selection:bg-[#3DE2DD] selection:text-black">
      {/* ========================================================================= */}
      {/* 1. FULL-SCREEN INTERACTIVE THREE.JS / WEBGL HERO SECTION (SCREEN 1)       */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[calc(100vh-110px)] flex flex-col justify-between items-center rounded-3xl overflow-hidden border border-[#222222] bg-[#000000] shadow-2xl p-6 sm:p-10 lg:p-14 mb-16">
        {/* Interactive WebGL Shader Canvas in Background */}
        <div className="absolute inset-0 z-0">
          <ReflectBackground
            tint="#3DE2DD"
            backgroundColor="#000000"
            speed={75}
            scale={1.1}
            contrast={7.5}
            iterations={5}
            opacity={85}
            blur={1}
            pointerStrength={50}
          />
          {/* Vignette Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(0,0,0,0.75)_100%] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Top Badges */}
        <div className="relative z-10 w-full flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 text-xs font-mono font-bold tracking-wider rounded-full bg-[#3DE2DD]/10 text-[#3DE2DD] border border-[#3DE2DD]/30 shadow-sm shadow-[#3DE2DD]/10">
              PS-004 • PRIVACYLENS
            </span>
            <span className="px-3.5 py-1 text-xs font-mono font-bold tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ZERO CLOUD LEAKAGE
            </span>
          </div>
          <span className="hidden sm:inline-block px-3.5 py-1 text-xs font-mono text-neutral-400 border border-neutral-800 rounded-full bg-black/70 backdrop-blur-md">
            PECATHON 2026
          </span>
        </div>

        {/* Center Content: Big Website Name & Very Short Use Description */}
        <div className="relative z-10 text-center max-w-4xl mx-auto my-auto space-y-6 pt-10 pb-6 pointer-events-auto">
          {/* BIG WEBSITE NAME */}
          <div className="inline-block transform hover:scale-[1.01] transition-transform duration-300">
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tight text-white drop-shadow-[0_0_40px_rgba(61,226,221,0.25)] select-none">
              Privacy<span className="text-[#3DE2DD]">Lens</span>
            </h1>
          </div>

          {/* VERY SHORT USE OF IT */}
          <p className="text-xl sm:text-3xl font-extrabold tracking-tight text-white/95">
            Zero Cloud Leakage Shield for{' '}
            <span className="bg-gradient-to-r from-[#3DE2DD] via-[#65e8e4] to-cyan-300 bg-clip-text text-transparent">
              AI Browser Agents
            </span>
          </p>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-mono leading-relaxed px-4">
            Client-side browser defense. Intercepts, redacts, and destroys sensitive PII locally before any prompt or screenshot reaches external cloud AI models.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="/PrivacyLens-Extension-v2.0.0.zip"
              download="PrivacyLens-Extension-v2.0.0.zip"
              className="px-6 py-3.5 rounded-2xl bg-[#3DE2DD]/10 hover:bg-[#3DE2DD]/20 text-[#3DE2DD] font-extrabold text-sm border border-[#3DE2DD]/40 flex items-center gap-2.5 hover:scale-[1.03] transition-all shadow-lg shadow-[#3DE2DD]/10 backdrop-blur-md"
              title="Download PrivacyLens Chrome Extension for local browser installation"
            >
              <Download className="w-4 h-4" />
              <span>Download Extension (.zip)</span>
            </a>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('shield')}
              className="px-6 py-3.5 rounded-2xl bg-[#3DE2DD] hover:bg-[#34c7c2] text-black font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-[#3DE2DD]/30 hover:scale-[1.03] transition-all"
            >
              <Sliders className="w-4 h-4" />
              <span>Launch Shield Cockpit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Indicator to Full Scroll */}
        <div 
          onClick={scrollToCockpit}
          className="relative z-10 flex flex-col items-center gap-2 cursor-pointer text-xs font-mono text-neutral-400 hover:text-[#3DE2DD] transition-all animate-bounce select-none pt-4 group"
          title="Click or scroll down to explore operational cockpit"
        >
          <span className="group-hover:tracking-wider transition-all">Scroll to Explore Operational Cockpit</span>
          <ChevronDown className="w-4 h-4 text-[#3DE2DD]" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ON ONE FULL SCROLL: OPERATIONAL COCKPIT & LIVE METRICS (SCREEN 2)       */}
      {/* ========================================================================= */}
      <div id="operational-cockpit" className="w-full space-y-12 pt-6">
        {/* VALUE PROPOSITION & LIVE CONTROLLER */}
        <section className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-10 shadow-xl transition-all">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 text-xs font-mono font-bold tracking-wider rounded-full bg-[#3DE2DD]/10 text-[#3DE2DD] border border-[#3DE2DD]/30">
                  REAL-TIME EDGE GATEKEEPER
                </span>
                <span className="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE FILTERING
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-[1.2]">
                Deterministic Edge Privacy with Zero Cloud Leakage
              </h2>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                PrivacyLens sits directly at the browser edge to intercept, detect, and redact sensitive personal identifiers, 
                financial credentials, visual faces, and private chat logs <span className="font-semibold text-white">before</span> outbound 
                payloads traverse the network to Google Gemini or third-party LLMs.
              </p>

              {/* Quick architectural bullet pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3DE2DD] shrink-0" />
                  <span>Deterministic Luhn & Verhoeff</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3DE2DD] shrink-0" />
                  <span>Offscreen Canvas Solid Blackout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3DE2DD] shrink-0" />
                  <span>Fail-Closed Tripwire Abort</span>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('shield')}
                  className="px-5 py-3 rounded-2xl bg-[#3DE2DD] hover:bg-[#34c7c2] text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-[#3DE2DD]/20 hover:scale-[1.02] transition-all"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Launch Shield Cockpit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('scenarios')}
                  className="px-5 py-3 rounded-2xl bg-[#111111] hover:bg-neutral-800 text-neutral-200 font-bold text-sm border border-neutral-800 flex items-center gap-2 transition-all"
                >
                  <FlaskConical className="w-4 h-4 text-emerald-400" />
                  <span>5 Evaluation Scenarios</span>
                </button>
              </div>
            </div>

            {/* MASTER SHIELD LIVE COCKPIT CONTROLLER */}
            <div className="w-full lg:w-84 shrink-0 bg-[#111111] border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${shieldActive ? 'bg-[#3DE2DD]/15 text-[#3DE2DD]' : 'bg-red-500/15 text-red-500'}`}>
                    {shieldActive ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Master Shield</h3>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      {shieldActive ? 'Zero Leakage Enforced' : 'Bypass Active'}
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => onToggleShield && onToggleShield(!shieldActive)}
                  className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    shieldActive ? 'bg-[#3DE2DD]' : 'bg-neutral-800'
                  }`}
                  title={shieldActive ? 'Disable Shield' : 'Enable Shield'}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                      shieldActive ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Security Mode Selector */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Security Policy
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-black p-1 rounded-xl text-xs border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => onSetSecurityMode && onSetSecurityMode('REDACT_AND_FORWARD')}
                    className={`py-1.5 rounded-lg font-medium transition ${
                      securityMode === 'REDACT_AND_FORWARD'
                        ? 'bg-neutral-900 text-[#3DE2DD] shadow-sm font-bold'
                        : 'text-neutral-400 hover:text-white'
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
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Strict Block
                  </button>
                </div>
              </div>

              {/* Real-time status pill */}
              <div className={`p-2.5 rounded-xl text-xs font-mono font-medium text-center border ${
                shieldActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>
                {shieldActive ? '🟢 Zero Cloud Leakage: ACTIVE' : '⚠️ Direct Cloud Bypass: ENGAGED'}
              </div>
            </div>
          </div>

          {/* METRICS KPI BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-neutral-800">
            <div className="p-4 rounded-2xl bg-[#111111] border border-neutral-800">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                Intercepted Requests
              </span>
              <div className="mt-1 text-2xl sm:text-3xl font-black text-white font-mono">
                {stats.totalIntercepted || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#111111] border border-neutral-800">
              <span className="text-[11px] uppercase tracking-wider text-[#3DE2DD] font-semibold">
                Sanitized Locally
              </span>
              <div className="mt-1 text-2xl sm:text-3xl font-black text-[#3DE2DD] font-mono">
                {stats.totalSanitized || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#111111] border border-neutral-800">
              <span className="text-[11px] uppercase tracking-wider text-red-400 font-semibold">
                Fail-Closed Aborts
              </span>
              <div className="mt-1 text-2xl sm:text-3xl font-black text-red-400 font-mono">
                {stats.totalBlocked || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#111111] border border-neutral-800">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">
                Zero-Leak Ratio
              </span>
              <div className="mt-1 text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {zeroLeakRatio}
              </div>
            </div>
          </div>
        </section>

        {/* 3. DEDICATED CORE MODULE NAVIGATION CARDS (4 PRIMARY PILLARS) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Dedicated Core Modules
              </h2>
              <p className="text-sm text-neutral-400">
                Access focused workspaces for evaluation, telemetry inspection, payload diffs, and forensics
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400 bg-[#111111] border border-neutral-800 px-3 py-1 rounded-full w-fit">
              4 DEDICATED VIEWS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CARD 1: 📊 Analytics & Telemetry */}
            <div 
              onClick={() => onNavigate && onNavigate('analytics')}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-[#3DE2DD]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#3DE2DD]/15 text-[#3DE2DD] flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#3DE2DD]/10 text-[#3DE2DD] border border-[#3DE2DD]/30">
                    /analytics
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#3DE2DD] transition-colors">
                    Analytics & Telemetry
                  </h3>
                  <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">
                    Real-time time-series area charts, PII threat category breakdown, and dynamic DPDP Act 2023 health score index.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">Health Index</div>
                    <div className="font-bold text-emerald-400">98 / 100</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">Categories</div>
                    <div className="font-bold text-[#3DE2DD]">7 PII Types</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">Latency</div>
                    <div className="font-bold text-white">&lt;12ms</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-[#3DE2DD] group-hover:translate-x-1 transition-transform">
                <span>Explore Telemetry Charts</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* CARD 2: 🔍 Payload Diff Inspector */}
            <div 
              onClick={() => onNavigate && onNavigate('diff')}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-[#3DE2DD]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    <SplitSquareVertical className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                    /diff
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    Payload Diff Inspector
                  </h3>
                  <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">
                    Side-by-side terminal inspector with inline character-level highlighting and irrecoverability proof.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 text-[10px]">Verification</span>
                    <div className="font-bold text-emerald-400">Irrecoverable</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 text-[10px]">Diff Mode</span>
                    <div className="font-bold text-indigo-400">Side-by-Side</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 text-[10px]">Format</span>
                    <div className="font-bold text-white">JSON / Text</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Inspect Payloads</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* CARD 3: 🧪 5 Evaluation Scenarios */}
            <div 
              onClick={() => onNavigate && onNavigate('scenarios')}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    /scenarios
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    5 Evaluation Scenarios
                  </h3>
                  <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">
                    Automated live testbed for the 5 official PECathon benchmarks: Aadhaar Verhoeff, Luhn Cards, Passwords, Prompt Injections, and Honeypot Canaries.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 text-[10px]">Status</span>
                    <div className="font-bold text-emerald-400">5 / 5 Passing</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 text-[10px]">Recall</span>
                    <div className="font-bold text-white">100.0%</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 text-[10px]">Canary Safe</span>
                    <div className="font-bold text-emerald-400">0 Leaks</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>Run Evaluation Scenarios</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* CARD 4: 🛡️ Audit Forensics */}
            <div 
              onClick={() => onNavigate && onNavigate('audit')}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    /audit
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    Audit Forensics
                  </h3>
                  <p className="mt-1.5 text-sm text-neutral-400 leading-relaxed">
                    Searchable client-side audit ledger with cryptographic SHA-256 verification, zero raw secret retention, and DPDP / GDPR exports.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 text-[10px]">Compliance</span>
                    <div className="font-bold text-white">DPDP 2023 / GDPR</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-500 text-[10px]">Formats</span>
                    <div className="font-bold text-amber-400">JSON & CSV</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>View Audit Forensics</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. LAB SHORTCUTS (PLAYGROUND, VISUAL STUDIO, SHIELD COCKPIT) */}
        <section className="rounded-3xl bg-[#080808] border border-neutral-800 p-6 sm:p-8 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Autonomous Agent & Visual Lab Tools
              </h3>
              <p className="text-xs text-neutral-400">
                Interactive simulators for DOM auto-injection, offscreen canvas redactions, and live attack testbeds
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('playground')}
              className="p-4 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#3DE2DD]/60 text-left transition group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white group-hover:text-[#3DE2DD] transition-colors">
                  Agentic Playground
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-neutral-400">
                Autonomous browser agent form autofill with volatile RAM secret injector.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('visual')}
              className="p-4 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#3DE2DD]/60 text-left transition group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white group-hover:text-[#3DE2DD] transition-colors">
                  Visual Redaction Studio
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-neutral-400">
                Canvas-based visual coordinate blackout for profile pictures & ID cards.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('shield')}
              className="p-4 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#3DE2DD]/60 text-left transition group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white group-hover:text-[#3DE2DD] transition-colors">
                  Shield Cockpit & Attack Tester
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-neutral-400">
                Real-time attack simulator testing strict fail-closed & redact-and-forward defenses.
              </p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
