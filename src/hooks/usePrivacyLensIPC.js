/**
 * usePrivacyLensIPC — Inter-Process Communication React Hook
 * Connects React UI to Chrome Extension Service Worker & Local Gatekeeper via BroadcastChannel
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { sanitizeText, PII_TYPES } from '../lib/scanner.js';
import { SECURITY_MODES } from '../lib/geminiClient.js';

export const CHANNEL_NAME = 'privacylens_channel';

export function usePrivacyLensIPC() {
  const [shieldActive, setShieldActive] = useState(true);
  const [securityMode, setSecurityModeState] = useState(SECURITY_MODES.REDACT_AND_FORWARD);
  const [stats, setStats] = useState({
    totalIntercepted: 12,
    totalSanitized: 9,
    totalBlocked: 2,
    totalClean: 1,
    threatsDetected: 19,
    threatTypes: {
      AADHAAR: 5,
      PAN: 3,
      CARD_NUMBER: 4,
      PASSWORD: 3,
      EMAIL: 2,
      PHONE_NUMBER: 2
    }
  });

  const [events, setEvents] = useState([
    {
      id: 'init_1',
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      type: 'REQUEST_SANITIZED',
      status: 'SANITIZED_AND_FORWARDED',
      threatCount: 3,
      threats: [
        { type: 'AADHAAR', severity: 'HIGH' },
        { type: 'PAN', severity: 'HIGH' },
        { type: 'EMAIL', severity: 'MEDIUM' }
      ],
      targetUrl: 'https://generativelanguage.googleapis.com',
      originalPrompt: 'User KYC: Aadhaar 2345 6789 0124 and PAN ABCDE1234F. Email accounts@pec.edu',
      sanitizedPrompt: 'User KYC: Aadhaar [REDACTED: AADHAAR] and PAN [REDACTED: PAN]. Email [REDACTED: EMAIL]',
      latencyMs: 14
    },
    {
      id: 'init_2',
      timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
      type: 'FAIL_CLOSED_BLOCKED',
      status: 'FAIL_CLOSED_BLOCKED',
      reason: 'Strict policy hard-aborted request: Plaintext password detected.',
      threatCount: 1,
      threats: [{ type: 'PASSWORD', severity: 'CRITICAL' }],
      targetUrl: 'https://api.openai.com/v1/chat/completions',
      originalPrompt: 'System auth config: password="superSecretPass123!"',
      sanitizedPrompt: null,
      latencyMs: 4
    }
  ]);

  const [latestIntercept, setLatestIntercept] = useState(null);
  const channelRef = useRef(null);

  // Broadcast helper
  const postToChannel = useCallback((type, payload = {}) => {
    const msg = {
      source: 'REACT_DASHBOARD',
      type,
      payload,
      timestamp: new Date().toISOString()
    };

    if (channelRef.current) {
      try {
        channelRef.current.postMessage(msg);
      } catch (err) {
        console.warn('[IPC Hook] Post message error:', err);
      }
    }

    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      try {
        chrome.runtime.sendMessage(msg).catch(() => {});
      } catch (e) {}
    }
  }, []);

  // Initialize BroadcastChannel
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const channel = new BroadcastChannel(CHANNEL_NAME);
        channelRef.current = channel;

        channel.onmessage = (event) => {
          const msg = event.data;
          if (!msg || msg.source === 'REACT_DASHBOARD') return;

          switch (msg.type) {
            case 'REQUEST_SANITIZED':
            case 'FAIL_CLOSED_BLOCKED':
            case 'REQUEST_BYPASSED': {
              const audit = msg.payload;
              if (audit) {
                setEvents((prev) => [audit, ...prev.slice(0, 49)]);
                setLatestIntercept(audit);

                setStats((prev) => {
                  const isBlocked = audit.status?.includes('BLOCKED');
                  const isSanitized = audit.status === 'SANITIZED_AND_FORWARDED';
                  const threatInc = audit.threatCount || 0;

                  const newTypes = { ...prev.threatTypes };
                  if (audit.threats && Array.isArray(audit.threats)) {
                    audit.threats.forEach((t) => {
                      newTypes[t.type] = (newTypes[t.type] || 0) + 1;
                    });
                  }

                  return {
                    ...prev,
                    totalIntercepted: prev.totalIntercepted + 1,
                    totalBlocked: isBlocked ? prev.totalBlocked + 1 : prev.totalBlocked,
                    totalSanitized: isSanitized ? prev.totalSanitized + 1 : prev.totalSanitized,
                    threatsDetected: prev.threatsDetected + threatInc,
                    threatTypes: newTypes
                  };
                });
              }
              break;
            }
            case 'SHIELD_TOGGLED':
              if (typeof msg.payload?.shieldActive === 'boolean') {
                setShieldActive(msg.payload.shieldActive);
              }
              break;
            case 'SECURITY_MODE_CHANGED':
              if (msg.payload?.securityMode) {
                setSecurityModeState(msg.payload.securityMode);
              }
              break;
            default:
              break;
          }
        };
      } catch (err) {
        console.warn('[IPC Hook] BroadcastChannel unsupported:', err);
      }
    }

    return () => {
      if (channelRef.current) {
        try {
          channelRef.current.close();
        } catch (e) {}
        channelRef.current = null;
      }
    };
  }, []);

  // Toggle master shield
  const toggleShield = useCallback((targetState) => {
    const next = typeof targetState === 'boolean' ? targetState : !shieldActive;
    setShieldActive(next);
    postToChannel('TOGGLE_SHIELD', { active: next });
  }, [shieldActive, postToChannel]);

  // Set security mode
  const setSecurityMode = useCallback((mode) => {
    setSecurityModeState(mode);
    postToChannel('SET_SECURITY_MODE', { mode });
  }, [postToChannel]);

  // Simulate or execute local sanitization
  const simulateIntercept = useCallback((rawPrompt, options = {}) => {
    const mode = options.securityMode || securityMode;
    const startTime = performance.now();

    if (!shieldActive) {
      const bypassEntry = {
        id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        status: 'BYPASSED_SHIELD_INACTIVE',
        originalPrompt: rawPrompt,
        sanitizedPrompt: rawPrompt,
        threatCount: 0,
        threats: [],
        latencyMs: Math.round(performance.now() - startTime),
        targetUrl: 'https://generativelanguage.googleapis.com'
      };
      setEvents((prev) => [bypassEntry, ...prev.slice(0, 49)]);
      setLatestIntercept(bypassEntry);
      postToChannel('REQUEST_BYPASSED', bypassEntry);
      return { allowed: true, blocked: false, audit: bypassEntry };
    }

    const sanitizeResult = sanitizeText(rawPrompt);
    const threats = sanitizeResult.threats;
    const latency = Math.max(1, Math.round(performance.now() - startTime));

    if (mode === SECURITY_MODES.FAIL_CLOSED_STRICT && threats.length > 0) {
      const blockEntry = {
        id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        status: 'FAIL_CLOSED_BLOCKED',
        reason: `Strict security gatekeeper hard-aborted: ${threats.length} sensitive threat(s) detected.`,
        threatCount: threats.length,
        threats: threats.map((t) => ({ type: t.type, label: t.label, severity: t.severity })),
        originalPrompt: rawPrompt,
        sanitizedPrompt: null,
        latencyMs: latency,
        targetUrl: 'https://generativelanguage.googleapis.com'
      };
      setEvents((prev) => [blockEntry, ...prev.slice(0, 49)]);
      setLatestIntercept(blockEntry);
      setStats((prev) => ({
        ...prev,
        totalIntercepted: prev.totalIntercepted + 1,
        totalBlocked: prev.totalBlocked + 1,
        threatsDetected: prev.threatsDetected + threats.length
      }));
      postToChannel('FAIL_CLOSED_BLOCKED', blockEntry);
      return { allowed: false, blocked: true, audit: blockEntry };
    }

    const isClean = threats.length === 0;
    const status = isClean ? 'CLEAN_DISPATCH' : 'SANITIZED_AND_FORWARDED';

    const successEntry = {
      id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      status,
      threatCount: threats.length,
      threats: threats.map((t) => ({ type: t.type, label: t.label, severity: t.severity })),
      originalPrompt: rawPrompt,
      sanitizedPrompt: sanitizeResult.sanitizedText,
      latencyMs: latency,
      targetUrl: 'https://generativelanguage.googleapis.com'
    };

    setEvents((prev) => [successEntry, ...prev.slice(0, 49)]);
    setLatestIntercept(successEntry);
    setStats((prev) => {
      const newTypes = { ...prev.threatTypes };
      threats.forEach((t) => {
        newTypes[t.type] = (newTypes[t.type] || 0) + 1;
      });
      return {
        ...prev,
        totalIntercepted: prev.totalIntercepted + 1,
        totalSanitized: isClean ? prev.totalSanitized : prev.totalSanitized + 1,
        totalClean: isClean ? prev.totalClean + 1 : prev.totalClean,
        threatsDetected: prev.threatsDetected + threats.length,
        threatTypes: newTypes
      };
    });
    postToChannel('REQUEST_SANITIZED', successEntry);
    return { allowed: true, blocked: false, audit: successEntry };
  }, [shieldActive, securityMode, postToChannel]);

  const clearEvents = useCallback(() => {
    setEvents([]);
    postToChannel('CLEAR_LOGS_REQUEST', {});
  }, [postToChannel]);

  const resetStats = useCallback(() => {
    setStats({
      totalIntercepted: 0,
      totalSanitized: 0,
      totalBlocked: 0,
      totalClean: 0,
      threatsDetected: 0,
      threatTypes: {
        AADHAAR: 0,
        PAN: 0,
        CARD_NUMBER: 0,
        PASSWORD: 0,
        EMAIL: 0,
        PHONE_NUMBER: 0
      }
    });
    postToChannel('STATS_RESET', {});
  }, [postToChannel]);

  return {
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
  };
}

export default usePrivacyLensIPC;
