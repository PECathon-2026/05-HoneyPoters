/**
 * PrivacyLens — Main Application Container
 * Integrated Shield Dashboard, Payload Diff Inspector, Visual Studio, Agentic Playground, Audit Forensics, and Analytics
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useState } from 'react';
import ShieldDashboard from './components/ShieldDashboard';
import PayloadDiffInspector from './components/PayloadDiffInspector';
import PrivacyAnalytics from './components/PrivacyAnalytics';
import VisualRedactionStudio from './components/VisualRedactionStudio';
import AgenticPlayground from './components/AgenticPlayground';
import AuditForensics from './components/AuditForensics';
import EvaluationScenarios from './components/EvaluationScenarios';
import { usePrivacyLensIPC } from './hooks/usePrivacyLensIPC';

export function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'diff' | 'playground' | 'visual' | 'forensics' | 'analytics' | 'shield'

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
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/20 overflow-hidden p-1">
            <img src="/favicon.svg" alt="PrivacyLens Logo" className="w-full h-full object-contain" />
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
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'overview' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Full Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scenarios')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'scenarios' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Evaluation Scenarios
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'playground' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Agentic Playground
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'visual' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Visual Studio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('diff')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'diff' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Payload Diff
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('forensics')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'forensics' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Forensics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'analytics' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics
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
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 p-4 sm:p-8 max-w-7xl mx-auto w-full flex-1 space-y-8">
        {(activeTab === 'overview' || activeTab === 'shield') && (
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

        {(activeTab === 'overview' || activeTab === 'scenarios') && (
          <EvaluationScenarios />
        )}

        {(activeTab === 'overview' || activeTab === 'playground') && (
          <AgenticPlayground onSimulateIntercept={simulateIntercept} />
        )}

        {(activeTab === 'overview' || activeTab === 'visual') && (
          <VisualRedactionStudio />
        )}

        {(activeTab === 'overview' || activeTab === 'diff') && (
          <PayloadDiffInspector
            latestIntercept={latestIntercept}
            events={events}
            securityMode={securityMode}
          />
        )}

        {(activeTab === 'overview' || activeTab === 'forensics') && (
          <AuditForensics
            events={events}
            onClearEvents={clearEvents}
            stats={stats}
          />
        )}

        {(activeTab === 'overview' || activeTab === 'analytics') && (
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
