/**
 * PrivacyLens — Main Application Container
 * Features Extension-First Architecture, Home Page with 3-Button Header (Shield Cockpit, Theme, Auth),
 * Cockpit Operational Tab Bar (Zero Home button on tab navbar), and True Z-Black / Beige Light Themes
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
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { usePrivacyLensIPC } from './hooks/usePrivacyLensIPC';
import { useTheme } from './context/ThemeContext';
import { 
  Sun, 
  Moon, 
  ShieldCheck, 
  ShieldAlert, 
  Menu, 
  X, 
  BarChart3, 
  SplitSquareVertical, 
  FlaskConical, 
  FileText, 
  Bot, 
  Eye, 
  Sliders,
  User,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'shield' | 'scenarios' | 'diff' | 'audit' | 'analytics' | 'playground' | 'visual'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [localAuthUser, setLocalAuthUser] = useState(null);
  const { theme, isDark, toggleTheme } = useTheme();

  // Connect Firebase / RBAC Auth Context with local fallback (Option 1: Default Guest Mode)
  let authContext = {};
  try {
    authContext = useAuth();
  } catch (e) {}
  const authUser = authContext.currentUser || localAuthUser;
  const authUserName = authUser?.displayName || authUser?.name || authUser?.email?.split('@')[0] || '';
  const authButtonLabel = authUserName ? (authUserName.split(' ')[0] || 'SecOps') : 'Sign In';

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

  // Cockpit Operational Navigation Tabs (Strict requirement: NO Home button on tab navbar)
  const navLinks = [
    { id: 'shield', label: 'Shield Cockpit', icon: Sliders },
    { id: 'scenarios', label: '5 Scenarios', icon: FlaskConical },
    { id: 'diff', label: 'Diff Inspector', icon: SplitSquareVertical },
    { id: 'audit', label: 'Forensics', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'playground', label: 'Agent Lab', icon: Bot },
    { id: 'visual', label: 'Visual Studio', icon: Eye },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHomePage = activeTab === 'home';

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-black transition-colors duration-250 ${
      isDark ? 'bg-black text-neutral-100' : 'bg-[#fdfbf7] text-slate-900'
    }`}>
      {/* Background radial gradient glow (Light mode only - dark mode is pure pitch Z-black) */}
      {!isDark && (
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.08),rgba(14,165,233,0.04))] opacity-100" />
      )}

      {/* TOP NAVIGATION BAR */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-200 ${
        isDark 
          ? 'bg-black/90 border-neutral-800 shadow-lg shadow-black/60' 
          : 'bg-white/90 border-slate-200/90 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Brand Logo & Title (Clicking returns to Home) */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Return to Home Overview"
            >
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-md overflow-hidden p-1 transition-transform group-hover:scale-105 ${
                isDark 
                  ? 'bg-[#0a0a0a] border-neutral-800' 
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

            {/* Back to Home pill (Shown only when inside Cockpit / operational sub-pages) */}
            {!isHomePage && (
              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className="hidden md:flex items-center gap-1 ml-2 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold text-slate-500 dark:text-neutral-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-neutral-900 border border-transparent hover:border-slate-300 dark:hover:border-neutral-800 transition"
                title="Return to Home Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            )}
          </div>

          {/* COCKPIT OPERATIONAL TAB NAVBAR (Shown ONLY when inside Cockpit / sub-pages; ZERO home button) */}
          {!isHomePage && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-[#0d0d0d] border border-slate-200/80 dark:border-neutral-800 p-1 rounded-2xl text-xs font-medium">
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
                        ? 'bg-cyan-500 text-black font-bold shadow-sm'
                        : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* TOP RIGHT CONTROLS */}
          {isHomePage ? (
            /* HOME PAGE TOP RIGHT: EXACTLY 3 BUTTONS (Shield Cockpit, Theme, Auth) */
            <div className="flex items-center gap-2.5">
              {/* Button 1: Shield Cockpit */}
              <button
                type="button"
                onClick={() => handleNavClick('shield')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-black shadow-md shadow-cyan-500/20 hover:scale-[1.02] transition-all"
                title="Open Shield Cockpit & Attack Tester"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Shield Cockpit</span>
              </button>

              {/* Button 2: Theme Toggle Switch (Sun / Moon) */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2 rounded-xl border transition-all duration-200 ${
                  isDark 
                    ? 'bg-[#111111] border-neutral-800 text-amber-400 hover:bg-neutral-800 hover:text-amber-300 shadow-sm' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
                }`}
                title={isDark ? 'Switch to Beige Light Mode' : 'Switch to Z-Black Dark Mode'}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Button 3: Auth Session Trigger */}
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all ${
                  authUser 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    : isDark 
                      ? 'bg-[#111111] border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white' 
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
                title={authUser ? `Signed in as ${authUserName || 'SecOps'}` : 'Sign In to PrivacyLens'}
              >
                <User className={`w-3.5 h-3.5 ${authUser ? 'text-emerald-500' : 'text-slate-400 dark:text-neutral-400'}`} />
                <span>{authUser ? authButtonLabel : 'Sign In'}</span>
              </button>

              {/* Mobile Hamburger (Home view) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 transition"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            /* COCKPIT PAGES TOP RIGHT: Master Shield Pill, Theme, Auth, Mobile Menu */
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
                    ? 'bg-[#111111] border-neutral-800 text-amber-400 hover:bg-neutral-800 hover:text-amber-300 shadow-sm' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900 shadow-sm'
                }`}
                title={isDark ? 'Switch to Beige Light Mode' : 'Switch to Z-Black Dark Mode'}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Auth Button */}
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all duration-200 ${
                  authUser 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                    : isDark 
                      ? 'bg-[#111111] border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white' 
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
                title={authUser ? `Signed in as ${authUserName || 'SecOps'}` : 'Sign In'}
              >
                <User className={`w-3.5 h-3.5 ${authUser ? 'text-emerald-500' : 'text-slate-400 dark:text-neutral-400'}`} />
                <span className="hidden sm:inline">{authUser ? authButtonLabel : 'Sign In'}</span>
              </button>

              {/* Mobile Menu Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900 transition"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-xl px-4 py-4 space-y-3 shadow-2xl">
            {/* Quick Home link on mobile */}
            {!isHomePage && (
              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className="w-full flex items-center gap-2 p-2.5 rounded-xl font-bold bg-slate-100 dark:bg-neutral-900 text-slate-900 dark:text-white text-xs text-left"
              >
                <ChevronLeft className="w-4 h-4 text-cyan-500" />
                <span>Return to Home Page</span>
              </button>
            )}

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
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs font-mono">
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

        {/* 2. Full Shield Cockpit & Attack Tester */}
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

        {/* 3. 5 Evaluation Scenarios */}
        {activeTab === 'scenarios' && (
          <EvaluationScenarios />
        )}

        {/* 4. Payload Diff Inspector */}
        {activeTab === 'diff' && (
          <PayloadDiffInspector
            latestIntercept={latestIntercept}
            events={events}
            securityMode={securityMode}
          />
        )}

        {/* 5. Forensic Audit Trail & Ledger */}
        {activeTab === 'audit' && (
          <AuditForensics
            events={events}
            onClearEvents={clearEvents}
            stats={stats}
          />
        )}

        {/* 6. Live Recharts Analytics */}
        {activeTab === 'analytics' && (
          <PrivacyAnalytics
            shieldActive={shieldActive}
            stats={stats}
            events={events}
          />
        )}

        {/* 7. Autonomous Agentic Playground */}
        {activeTab === 'playground' && (
          <AgenticPlayground onSimulateIntercept={simulateIntercept} />
        )}

        {/* 8. HTML5 Visual Redaction Studio */}
        {activeTab === 'visual' && (
          <VisualRedactionStudio />
        )}
      </main>

      {/* FOOTER */}
      <footer className={`relative z-10 border-t py-6 px-4 sm:px-8 text-center text-xs font-mono transition-colors ${
        isDark 
          ? 'bg-black border-neutral-800 text-neutral-500' 
          : 'bg-white/80 border-slate-200/90 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-neutral-300">PrivacyLens (PS-004)</span>
            <span>•</span>
            <span>Team 05-HoneyPoters</span>
            <span>•</span>
            <span>PECathon 2026</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <button 
              type="button" 
              onClick={() => handleNavClick('shield')}
              className="hover:text-cyan-500 transition-colors"
            >
              Shield Cockpit
            </button>
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

      {/* SecOps Authentication & Identity Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={authUser}
        onLogin={(profile) => setLocalAuthUser(profile)}
        onLogout={() => setLocalAuthUser(null)}
      />
    </div>
  );
}

export default App;
