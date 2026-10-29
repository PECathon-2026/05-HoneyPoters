/**
 * PrivacyLens — Main Application Container
 * Integrated Shield Dashboard & Privacy Analytics Telemetry
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useState } from 'react';
import ShieldDashboard from './components/ShieldDashboard';
import PrivacyAnalytics from './components/PrivacyAnalytics';
import { usePrivacyLensIPC } from './hooks/usePrivacyLensIPC';

export function App() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'shield' | 'analytics'

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      {/* Background radial gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Main Navigation Bar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 font-bold text-slate-950">
            🛡️
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              PrivacyLens
            </span>
            <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              PS-004
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shield')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'shield' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Shield Cockpit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'analytics' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Analytics
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 p-4 sm:p-8 max-w-7xl mx-auto w-full flex-1 space-y-8">
        {(activeTab === 'all' || activeTab === 'shield') && (
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

        {(activeTab === 'all' || activeTab === 'analytics') && (
          <PrivacyAnalytics
            shieldActive={shieldActive}
            stats={stats}
            events={events}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-4 px-6 text-center text-xs text-slate-500 font-mono">
        PrivacyLens PS-004 • Client-Side Privacy-Preserving AI Browser Agent Shield • Team 05-HoneyPoters • PECathon 2026
      </footer>
    </div>
  );
}

export default App;
