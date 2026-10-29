/**
 * PrivacyLens — Main Application Container
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useState } from 'react';
import ShieldDashboard from './components/ShieldDashboard';
import { usePrivacyLensIPC } from './hooks/usePrivacyLensIPC';

export function App() {
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

      {/* Main Content Area */}
      <main className="relative z-10 p-4 sm:p-8 max-w-7xl mx-auto w-full flex-1">
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
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-4 px-6 text-center text-xs text-slate-500 font-mono">
        PrivacyLens PS-004 • Zero Cloud Leakage AI Browser Gateway • Team 05-HoneyPoters • PECathon 2026
      </footer>
    </div>
  );
}

export default App;
