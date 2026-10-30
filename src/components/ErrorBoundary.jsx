/**
 * PrivacyLens — Application Error Boundary
 * Catches unhandled runtime render errors and provides graceful recovery
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { Component } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[PrivacyLens ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        // Clear any corrupt cached session data
        window.localStorage.removeItem('privacylens_auth_user');
      }
    } catch (e) {}
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7 text-cyan-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight">PrivacyLens Auto-Recovery</h1>
              <p className="text-xs text-neutral-400">
                A rendering anomaly was caught by the client-side safety guardrail. Your data and local security boundaries remain completely safe.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-left font-mono text-[11px] text-red-400 max-h-28 overflow-y-auto">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload & Reset</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
