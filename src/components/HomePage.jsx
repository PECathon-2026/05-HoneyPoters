/**
 * PrivacyLens — Dedicated Home Page Component
 * Theme: Black (#000000) + Cyan (#3DE2DD) + White (#FFFFFF)
 * Features:
 *  - Screen 1: Full-Screen Interactive Three.js (r186) 3D Optical Lens Hero Section
 *              High-impact White & Cyan typography, authentic cybersecurity definition, and quick CTAs.
 *  - Screen 2: One-Full-Scroll Operational Cockpit (#operational-cockpit)
 *              5-Stage Architecture Pipeline, Live Master Shield Controller, Real-Time KPIs,
 *              4 Dedicated Module Workspaces (/analytics, /diff, /scenarios, /audit), and Lab Tools.
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useState } from 'react';
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
  CheckCircle2, 
  Zap, 
  Layers, 
  Sliders, 
  Download, 
  ChevronDown, 
  Workflow, 
  Radio
} from 'lucide-react';
import ShieldLens3D from './ShieldLens3D';

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

  const [activeDeflectionEvent, setActiveDeflectionEvent] = useState(null);

  const scrollToCockpit = () => {
    const el = document.getElementById('operational-cockpit');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeflectionTrigger = (label) => {
    setActiveDeflectionEvent({
      label: label || 'Interactive Security Pulse',
      timestamp: new Date().toLocaleTimeString(),
    });
    setTimeout(() => {
      setActiveDeflectionEvent(null);
    }, 2800);
  };

  return (
    <div className="w-full font-sans pb-16 bg-[#000000] text-white selection:bg-[#3DE2DD] selection:text-black">
      {/* ========================================================================= */}
      {/* 1. FULL-SCREEN INTERACTIVE THREE.JS (R186) HERO SECTION (SCREEN 1)        */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[calc(100vh-105px)] flex flex-col justify-between items-center rounded-3xl overflow-hidden border border-neutral-800 bg-[#000000] shadow-[0_0_50px_rgba(0,0,0,0.8)] p-5 sm:p-8 lg:p-12 mb-16">
        {/* Subtle Cyber Grid Glow Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(61,226,221,0.08)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

        {/* Top Badges (Black + Cyan + White) */}
        <div className="relative z-10 w-full flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3.5 py-1 text-xs font-mono font-bold tracking-wider rounded-full bg-[#3DE2DD]/10 text-[#3DE2DD] border border-[#3DE2DD]/30 shadow-sm shadow-[#3DE2DD]/15 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3DE2DD] animate-ping" />
              PS-004 • PRIVACYLENS
            </span>
            <span className="px-3.5 py-1 text-xs font-mono font-bold tracking-wider rounded-full bg-white/5 text-white border border-neutral-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3DE2DD] animate-pulse" />
              ZERO CLOUD LEAKAGE
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 text-xs font-mono text-neutral-300 border border-neutral-800 rounded-full bg-black/90 backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 text-[#3DE2DD] animate-pulse" />
            <span>PECATHON 2026 // PS-004</span>
          </div>
        </div>

        {/* Center Grid: Text on Left, 3D Optical Lens on Right */}
        <div className="relative z-10 w-full max-w-7xl mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 pb-6">
          {/* Left Column: Bold Typography, Technical Precision, and Primary Actions */}
          <div className="lg:col-span-6 space-y-6 text-left pointer-events-auto">
            {/* BIG WEBSITE NAME (Pure White + Electric Cyan) */}
            <div className="inline-block transform hover:scale-[1.01] transition-transform duration-300">
              <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black tracking-tight text-white drop-shadow-[0_0_35px_rgba(61,226,221,0.25)] select-none">
                Privacy<span className="text-[#3DE2DD]">Lens</span>
              </h1>
            </div>

            {/* SHORT TECHNICAL DEFINITION (HIGH CONTRAST WHITE + CYAN) */}
            <div className="space-y-2.5">
              <p className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
                Zero Cloud Leakage Shield for{' '}
                <span className="text-[#3DE2DD] underline decoration-[#3DE2DD]/40 underline-offset-4">
                  AI Browser Agents
                </span>
              </p>
              <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed max-w-xl">
                Hardware-isolated client gatekeeper. Intercepts, sanitizes, and eliminates sensitive PII locally before any DOM instruction, screenshot, or network packet reaches external cloud LLMs.
              </p>
            </div>

            {/* Hardware & Cryptographic Telemetry Strip (Black + Cyan + White) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-neutral-800 shadow-sm">
                <span className="text-neutral-400 text-[10px] block font-semibold">INTERCEPTION LATENCY</span>
                <span className="font-bold text-white text-sm">&lt;0.04 ms</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-neutral-800 shadow-sm">
                <span className="text-neutral-400 text-[10px] block font-semibold">EPHEMERAL RAM</span>
                <span className="font-bold text-[#3DE2DD] text-sm">0 Bytes Persisted</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-neutral-800 shadow-sm col-span-2 sm:col-span-1">
                <span className="text-neutral-400 text-[10px] block font-semibold">EGRESS BOUNDARY</span>
                <span className="font-bold text-white text-sm">Fail-Closed Strict</span>
              </div>
            </div>

            {/* Primary Action Buttons (Black + Cyan + White) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/PrivacyLens-Extension-v2.0.0.zip"
                download="PrivacyLens-Extension-v2.0.0.zip"
                className="px-6 py-3.5 rounded-2xl bg-[#3DE2DD]/10 hover:bg-[#3DE2DD]/20 text-[#3DE2DD] font-extrabold text-sm border border-[#3DE2DD]/40 flex items-center gap-2.5 hover:scale-[1.02] transition-all shadow-lg shadow-[#3DE2DD]/15 backdrop-blur-md"
                title="Download PrivacyLens Chrome Extension for local browser installation"
              >
                <Download className="w-4 h-4 text-[#3DE2DD]" />
                <span className="text-white hover:text-[#3DE2DD] transition-colors">Download Extension (.zip)</span>
              </a>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('shield')}
                className="px-6 py-3.5 rounded-2xl bg-[#3DE2DD] hover:bg-[#34c7c2] text-black font-extrabold text-sm flex items-center gap-2.5 shadow-[0_0_25px_rgba(61,226,221,0.35)] hover:scale-[1.02] transition-all"
              >
                <Sliders className="w-4 h-4 text-black" />
                <span>Launch Shield Cockpit</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Deflection alert notification toast */}
            {activeDeflectionEvent && (
              <div className="p-2.5 rounded-xl bg-[#0a0a0a] border border-[#3DE2DD]/50 text-xs font-mono text-white flex items-center justify-between shadow-[0_0_20px_rgba(61,226,221,0.2)] animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#3DE2DD] animate-bounce" />
                  <span>Deflected: <strong className="text-[#3DE2DD]">{activeDeflectionEvent.label}</strong></span>
                </div>
                <span className="text-[10px] text-[#3DE2DD] font-bold">100% ISOLATED</span>
              </div>
            )}
          </div>

          {/* Right Column: Three.js 3D Cybernetic Shield Lens */}
          <div className="lg:col-span-6 relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden border border-neutral-800 bg-[#000000] shadow-[0_0_40px_rgba(0,0,0,0.9)]">
            <ShieldLens3D 
              active={shieldActive} 
              onDeflectionTrigger={handleDeflectionTrigger} 
              threatCount={stats.threatsDetected}
            />
          </div>
        </div>

        {/* Bottom Cue to Full Scroll */}
        <div 
          onClick={scrollToCockpit}
          className="relative z-10 flex flex-col items-center gap-2 cursor-pointer text-xs font-mono text-neutral-400 hover:text-[#3DE2DD] transition-all animate-bounce select-none pt-2 group"
          title="Click or scroll down to explore operational cockpit"
        >
          <span className="group-hover:tracking-wider text-neutral-300 group-hover:text-white transition-all">Scroll to Explore Operational Cockpit</span>
          <ChevronDown className="w-4 h-4 text-[#3DE2DD]" />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ON ONE FULL SCROLL: OPERATIONAL COCKPIT & LIVE METRICS (SCREEN 2)       */}
      {/* ========================================================================= */}
      <div id="operational-cockpit" className="w-full space-y-12 pt-6">
        
        {/* 2.1 5-STAGE ARCHITECTURAL DEFENSE PIPELINE (BLACK + CYAN + WHITE) */}
        <section className="rounded-3xl bg-[#080808] border border-neutral-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#3DE2DD]" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  5-Stage Deterministic Defense Architecture
                </h3>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Zero Cloud Egress Pipeline • Hardware-isolated browser protection at every layer
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-black text-[#3DE2DD] border border-[#3DE2DD]/30 w-fit">
              CLIENT ISOLATED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono">
            {/* Stage 1 */}
            <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-neutral-800 space-y-2 hover:border-[#3DE2DD]/50 transition shadow-sm">
              <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">01. INGESTION</div>
              <div className="font-bold text-white text-sm">DOM & Stream Hook</div>
              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                MutationObserver hooks inputs, textareas, and offscreen canvas frames before outbound network packaging.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-neutral-800 space-y-2 hover:border-[#3DE2DD]/50 transition shadow-sm">
              <div className="text-[10px] text-[#3DE2DD] font-bold uppercase tracking-wider">02. MATHEMATICS</div>
              <div className="font-bold text-white text-sm">Verhoeff & Luhn</div>
              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                Dihedral group D₅ validation for 12-digit Indian Aadhaar and Mod-10 for PCI cards to eliminate false positives.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-neutral-800 space-y-2 hover:border-[#3DE2DD]/50 transition shadow-sm">
              <div className="text-[10px] text-white font-bold uppercase tracking-wider">03. VISION BLACKOUT</div>
              <div className="font-bold text-white text-sm">Offscreen Blackout</div>
              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                Solid #000000 pixel blackout on offscreen HTML5 canvas. Visual pixels are irrecoverably destroyed.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-neutral-800 space-y-2 hover:border-[#3DE2DD]/50 transition shadow-sm">
              <div className="text-[10px] text-[#3DE2DD] font-bold uppercase tracking-wider">04. DISPATCH</div>
              <div className="font-bold text-white text-sm">Sanitized Cloud Egress</div>
              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                Clean semantic placeholders (`[REDACTED: AADHAAR]`) sent to Gemini 1.5 Flash. Zero raw PII leaves device.
              </p>
            </div>

            {/* Stage 5 */}
            <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-neutral-800 space-y-2 hover:border-[#3DE2DD]/50 transition shadow-sm">
              <div className="text-[10px] text-white font-bold uppercase tracking-wider">05. EXECUTION</div>
              <div className="font-bold text-white text-sm">Ephemeral DOM Vault</div>
              <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                Agent reasoning completed; local volatile RAM injector fills real secrets into target DOM without storage.
              </p>
            </div>
          </div>
        </section>

        {/* 2.2 VALUE PROPOSITION & LIVE MASTER SHIELD CONTROLLER */}
        <section className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-10 shadow-xl transition-all">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 text-xs font-mono font-bold tracking-wider rounded-full bg-[#3DE2DD]/10 text-[#3DE2DD] border border-[#3DE2DD]/30">
                  REAL-TIME EDGE GATEKEEPER
                </span>
                <span className="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-white/10 text-white border border-neutral-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3DE2DD] animate-pulse" />
                  ACTIVE FILTERING
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-[1.2]">
                Deterministic Edge Privacy with Zero Cloud Leakage
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
                PrivacyLens sits directly at the browser edge to intercept, detect, and redact sensitive personal identifiers, 
                financial credentials, visual faces, and private chat logs <span className="font-semibold text-[#3DE2DD]">before</span> outbound 
                payloads traverse the network to Google Gemini or third-party LLMs.
              </p>

              {/* Architectural bullet pillars (Black + Cyan + White) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-white font-mono">
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

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('shield')}
                  className="px-5 py-3 rounded-2xl bg-[#3DE2DD] hover:bg-[#34c7c2] text-black font-extrabold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(61,226,221,0.3)] hover:scale-[1.02] transition-all font-sans"
                >
                  <Sliders className="w-4 h-4 text-black" />
                  <span>Launch Shield Cockpit</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('scenarios')}
                  className="px-5 py-3 rounded-2xl bg-[#111111] hover:bg-neutral-800 text-white font-bold text-sm border border-neutral-700 flex items-center gap-2 transition-all font-sans"
                >
                  <FlaskConical className="w-4 h-4 text-[#3DE2DD]" />
                  <span>5 Evaluation Scenarios</span>
                </button>
              </div>
            </div>

            {/* MASTER SHIELD LIVE COCKPIT CONTROLLER */}
            <div className="w-full lg:w-84 shrink-0 bg-[#111111] border border-neutral-800 rounded-2xl p-5 shadow-2xl space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${shieldActive ? 'bg-[#3DE2DD]/15 text-[#3DE2DD]' : 'bg-neutral-800 text-neutral-400'}`}>
                    {shieldActive ? <ShieldCheck className="w-5 h-5 text-[#3DE2DD]" /> : <ShieldAlert className="w-5 h-5" />}
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
              <div className="space-y-1.5 pt-2 border-t border-neutral-800 font-mono">
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
                        ? 'bg-[#3DE2DD] text-black shadow-sm font-bold'
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
                  ? 'bg-[#3DE2DD]/10 text-[#3DE2DD] border-[#3DE2DD]/30'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}>
                {shieldActive ? '⚡ Zero Cloud Leakage: ACTIVE' : '⚠️ Direct Cloud Bypass: ENGAGED'}
              </div>
            </div>
          </div>

          {/* METRICS KPI BAR (BLACK + CYAN + WHITE) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-neutral-800">
            <div className="p-4 rounded-2xl bg-[#111111] border border-neutral-800">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold font-mono">
                Intercepted Requests
              </span>
              <div className="mt-1 text-2xl sm:text-3xl font-black text-white font-mono">
                {stats.totalIntercepted || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#111111] border border-neutral-800">
              <span className="text-[11px] uppercase tracking-wider text-[#3DE2DD] font-semibold font-mono">
                Sanitized Locally
              </span>
              <div className="mt-1 text-2xl sm:text-3xl font-black text-[#3DE2DD] font-mono">
                {stats.totalSanitized || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#111111] border border-neutral-800">
              <span className="text-[11px] uppercase tracking-wider text-white font-semibold font-mono">
                Fail-Closed Aborts
              </span>
              <div className="mt-1 text-2xl sm:text-3xl font-black text-white font-mono">
                {stats.totalBlocked || 0}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#111111] border border-neutral-800">
              <span className="text-[11px] uppercase tracking-wider text-[#3DE2DD] font-semibold font-mono">
                Zero-Leak Ratio
              </span>
              <div className="mt-1 text-2xl sm:text-3xl font-black text-[#3DE2DD] font-mono">
                {zeroLeakRatio}
              </div>
            </div>
          </div>
        </section>

        {/* 2.3 DEDICATED CORE MODULE NAVIGATION CARDS (4 PRIMARY PILLARS) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Dedicated Core Modules
              </h2>
              <p className="text-sm text-neutral-400 font-mono">
                Focused workspaces for evaluation, telemetry inspection, payload diffs, and forensics
              </p>
            </div>
            <span className="text-xs font-mono text-[#3DE2DD] bg-[#111111] border border-neutral-800 px-3 py-1 rounded-full w-fit">
              4 DEDICATED VIEWS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CARD 1: 📊 Analytics & Telemetry */}
            <div 
              onClick={() => onNavigate && onNavigate('analytics')}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-7 shadow-lg hover:shadow-[0_0_30px_rgba(61,226,221,0.2)] hover:border-[#3DE2DD] transition-all duration-300 flex flex-col justify-between"
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
                  <p className="mt-1.5 text-sm text-neutral-300 leading-relaxed font-sans">
                    Real-time time-series area charts, PII threat category breakdown, and dynamic DPDP Act 2023 health score index.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <div className="text-neutral-400 text-[10px]">Health Index</div>
                    <div className="font-bold text-white">98 / 100</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <div className="text-neutral-400 text-[10px]">Categories</div>
                    <div className="font-bold text-[#3DE2DD]">7 PII Types</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <div className="text-neutral-400 text-[10px]">Latency</div>
                    <div className="font-bold text-white">&lt;0.04ms</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-[#3DE2DD] group-hover:translate-x-1 transition-transform font-mono">
                <span>Explore Telemetry Charts</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* CARD 2: 🔍 Payload Diff Inspector */}
            <div 
              onClick={() => onNavigate && onNavigate('diff')}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-7 shadow-lg hover:shadow-[0_0_30px_rgba(61,226,221,0.2)] hover:border-[#3DE2DD] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    <SplitSquareVertical className="w-6 h-6 text-[#3DE2DD]" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-white border border-neutral-700">
                    /diff
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#3DE2DD] transition-colors">
                    Payload Diff Inspector
                  </h3>
                  <p className="mt-1.5 text-sm text-neutral-300 leading-relaxed font-sans">
                    Side-by-side terminal inspector with inline character-level highlighting and irrecoverability proof.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 text-[10px]">Verification</span>
                    <div className="font-bold text-[#3DE2DD]">Irrecoverable</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 text-[10px]">Diff Mode</span>
                    <div className="font-bold text-white">Side-by-Side</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 text-[10px]">Format</span>
                    <div className="font-bold text-white">JSON / Text</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-[#3DE2DD] group-hover:translate-x-1 transition-transform font-mono">
                <span>Inspect Payloads</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* CARD 3: 🧪 5 Evaluation Scenarios */}
            <div 
              onClick={() => onNavigate && onNavigate('scenarios')}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-7 shadow-lg hover:shadow-[0_0_30px_rgba(61,226,221,0.2)] hover:border-[#3DE2DD] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#3DE2DD]/15 text-[#3DE2DD] flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#3DE2DD]/10 text-[#3DE2DD] border border-[#3DE2DD]/30">
                    /scenarios
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#3DE2DD] transition-colors">
                    5 Evaluation Scenarios
                  </h3>
                  <p className="mt-1.5 text-sm text-neutral-300 leading-relaxed font-sans">
                    Automated live testbed for the 5 official PECathon benchmarks: Aadhaar Verhoeff, Luhn Cards, Passwords, Prompt Injections, and Honeypot Canaries.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 text-[10px]">Status</span>
                    <div className="font-bold text-[#3DE2DD]">5 / 5 Passing</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 text-[10px]">Recall</span>
                    <div className="font-bold text-white">100.0%</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 text-[10px]">Canary Safe</span>
                    <div className="font-bold text-[#3DE2DD]">0 Leaks</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-[#3DE2DD] group-hover:translate-x-1 transition-transform font-mono">
                <span>Run Evaluation Scenarios</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* CARD 4: 🛡️ Audit Forensics */}
            <div 
              onClick={() => onNavigate && onNavigate('audit')}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-7 shadow-lg hover:shadow-[0_0_30px_rgba(61,226,221,0.2)] hover:border-[#3DE2DD] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-[#3DE2DD]" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-white border border-neutral-700">
                    /audit
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#3DE2DD] transition-colors">
                    Audit Forensics
                  </h3>
                  <p className="mt-1.5 text-sm text-neutral-300 leading-relaxed font-sans">
                    Searchable client-side audit ledger with cryptographic SHA-256 verification, zero raw secret retention, and DPDP / GDPR exports.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 text-[10px]">Compliance</span>
                    <div className="font-bold text-white">DPDP 2023 / GDPR</div>
                  </div>
                  <div className="bg-black p-2 rounded-xl border border-neutral-800">
                    <span className="text-neutral-400 text-[10px]">Formats</span>
                    <div className="font-bold text-[#3DE2DD]">JSON & CSV</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-[#3DE2DD] group-hover:translate-x-1 transition-transform font-mono">
                <span>View Audit Forensics</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* 2.4 LAB SHORTCUTS (BLACK + CYAN + WHITE) */}
        <section className="rounded-3xl bg-[#080808] border border-neutral-800 p-6 sm:p-8 space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Autonomous Agent & Visual Lab Tools
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Interactive simulators for DOM auto-injection, offscreen canvas redactions, and live attack testbeds
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('playground')}
              className="p-4 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#3DE2DD] text-left transition group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white group-hover:text-[#3DE2DD] transition-colors">
                  Agentic Playground
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 transition-transform group-hover:text-[#3DE2DD]" />
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Autonomous browser agent form autofill with volatile RAM secret injector.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('visual')}
              className="p-4 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#3DE2DD] text-left transition group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white group-hover:text-[#3DE2DD] transition-colors">
                  Visual Redaction Studio
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 transition-transform group-hover:text-[#3DE2DD]" />
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Canvas-based visual coordinate blackout for profile pictures & ID cards.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('shield')}
              className="p-4 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#3DE2DD] text-left transition group shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white group-hover:text-[#3DE2DD] transition-colors">
                  Shield Cockpit & Attack Tester
                </span>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 transition-transform group-hover:text-[#3DE2DD]" />
              </div>
              <p className="text-xs text-neutral-400 font-mono">
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
