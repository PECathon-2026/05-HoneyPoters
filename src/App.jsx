/**
 * PrivacyLens — Main Application Container
 * Features Dedicated Page Routing, Responsive Layouts, and Deep Dark / Beige Light Theme Toggle
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useState } from 'react';
import HomePage from './components/HomePage';
import ShieldDashboard from './components/ShieldDashboard';
import PayloadDiffInspector from './components/PayloadDiffInspector';
import PrivacyAnalytics from './components/PrivacyAnalytics';
import VisualRedactionStudio from './components/VisualRedactionStudio';
import AgenticPlayground from './components/AgenticPlayground';
import AuditForensics from './components/AuditForensics';
import EvaluationScenarios from './components/EvaluationScenarios';
import { usePrivacyLensIPC } from './hooks/usePrivacyLensIPC';
import { useTheme } from './context/ThemeContext';
import { 
  Sun, 
  Moon, 
  ShieldCheck, 
  ShieldAlert, 
  Menu, 
  X, 
  Home, 
  BarChart3, 
  SplitSquareVertical, 
  FlaskConical, 
  FileText, 
  Bot, 
  Eye, 
  Sliders
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'scenarios' | 'diff' | 'audit' | 'analytics' | 'playground' | 'visual' | 'shield'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, isDark, toggleTheme } = useTheme();

  const {
    shieldActive,
    toggleShield,
    securityMode,
    setSecurityMode,
    stats,
    events,
    latestIntercept,
    simulateIntercept,
    clearEvents,
    resetStats
  } = usePrivacyLensIPC();

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'scenarios', label: 'Scenarios', icon: FlaskConical },
    { id: 'diff', label: 'Diff Inspector', icon: SplitSquareVertical },
    { id: 'audit', label: 'Forensics', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'playground', label: 'Agent Lab', icon: Bot },
    { id: 'visual', label: 'Visual Studio', icon: Eye },
    { id: 'shield', label: 'Shield Cockpit', icon: Sliders },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-250 ${
      isDark ? 'bg-[#020617] text-slate-100' : 'bg-[#fdfbf7] text-slate-900'
    }`}>
      {/* Background radial gradient glow */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
        isDark 
          ? 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] opacity-100' 
          : 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.08),rgba(14,165,233,0.04))] opacity-100'
      }`} />

      {/* TOP NAVIGATION BAR */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-950/85 border-slate-800/80 shadow-lg shadow-black/20' 
          : 'bg-white/90 border-slate-200/90 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-md overflow-hidden p-1 transition-transform group-hover:scale-105 ${
              isDark 
                ? 'bg-slate-900 border-cyan-500/40 shadow-cyan-500/10' 
                : 'bg-white border-cyan-500/30 shadow-slate-200'
            }`}>
              <img src="/favicon.svg" alt="PrivacyLens Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-lg tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  PrivacyLens
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  PS-004
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono hidden sm:block">
                Client-Side AI Safety Shield
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-1 rounded-2xl text-xs font-medium">
            {navLinks.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNavClick(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Shield Status Pill & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Quick Master Shield Status Pill */}
            <button
              type="button"
              onClick={() => toggleShield(!shieldActive)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                shieldActive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/20'
              }`}
              title={shieldActive ? 'Master Shield is ENGAGED. Click to disable.' : 'Master Shield is BYPASSED. Click to engage.'}
            >
              <span className={`w-2 h-2 rounded-full ${shieldActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="hidden md:inline">{shieldActive ? 'Zero Leakage' : 'Bypassed'}</span>
            </button>

            {/* Theme Toggle Button (Sun / Moon) */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all duration-200 ${
                isDark 
                  ? 'bg-slate-900 border-slate-700/80 text-amber-400 hover:bg-slate-800 hover:text-amber-300 shadow-sm' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
              }`}
              title={isDark ? 'Switch to Beige Light Mode' : 'Switch to Deep Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-2 shadow-2xl">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {navLinks.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleNavClick(tab.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl font-medium transition text-left ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Master Shield:</span>
              <button
                type="button"
                onClick={() => toggleShield(!shieldActive)}
                className={`px-3 py-1 rounded-lg font-bold border ${
                  shieldActive 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                    : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
                }`}
              >
                {shieldActive ? '🟢 Engaged' : '🔴 Bypassed'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT WORKSPACE (DEDICATED PAGE RENDERING) */}
      <main className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
        {/* 1. Dedicated Home Page */}
        {activeTab === 'home' && (
          <HomePage
            shieldActive={shieldActive}
            onToggleShield={toggleShield}
            securityMode={securityMode}
            onSetSecurityMode={setSecurityMode}
            stats={stats}
            onNavigate={handleNavClick}
          />
        )}

        {/* 2. 5 Evaluation Scenarios */}
        {activeTab === 'scenarios' && (
          <EvaluationScenarios />
        )}

        {/* 3. Payload Diff Inspector */}
        {activeTab === 'diff' && (
          <PayloadDiffInspector
            latestIntercept={latestIntercept}
            events={events}
            securityMode={securityMode}
          />
        )}

        {/* 4. Forensic Audit Trail & Ledger */}
        {activeTab === 'audit' && (
          <AuditForensics
            events={events}
            onClearEvents={clearEvents}
            stats={stats}
          />
        )}

        {/* 5. Live Recharts Analytics */}
        {activeTab === 'analytics' && (
          <PrivacyAnalytics
            shieldActive={shieldActive}
            stats={stats}
            events={events}
          />
        )}

        {/* 6. Autonomous Agentic Playground */}
        {activeTab === 'playground' && (
          <AgenticPlayground onSimulateIntercept={simulateIntercept} />
        )}

        {/* 7. HTML5 Visual Redaction Studio */}
        {activeTab === 'visual' && (
          <VisualRedactionStudio />
        )}

        {/* 8. Full Shield Cockpit & Attack Tester */}
        {activeTab === 'shield' && (
          <ShieldDashboard
            shieldActive={shieldActive}
            onToggleShield={toggleShield}
            securityMode={securityMode}
            onSetSecurityMode={setSecurityMode}
            stats={stats}
            events={events}
            onSimulateIntercept={simulateIntercept}
            onClearEvents={clearEvents}
            onResetStats={resetStats}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className={`relative z-10 border-t py-6 px-4 sm:px-8 text-center text-xs font-mono transition-colors ${
        isDark 
          ? 'bg-slate-950/80 border-slate-800/80 text-slate-500' 
          : 'bg-white/80 border-slate-200/90 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">PrivacyLens (PS-004)</span>
            <span>•</span>
            <span>Team 05-HoneyPoters</span>
            <span>•</span>
            <span>PECathon 2026</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button 
              type="button" 
              onClick={() => handleNavClick('scenarios')}
              className="hover:text-cyan-500 transition-colors"
            >
              5 Evaluation Scenarios
            </button>
            <button 
              type="button" 
              onClick={() => handleNavClick('diff')}
              className="hover:text-cyan-500 transition-colors"
            >
              Payload Diff
            </button>
            <button 
              type="button" 
              onClick={() => handleNavClick('audit')}
              className="hover:text-cyan-500 transition-colors"
            >
              Audit Forensics
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
