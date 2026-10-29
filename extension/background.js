/**
 * PrivacyLens — Background Service Worker & Interceptor Gateway
 * Handles Chrome Extension MV3 background requests, IPC, fail-closed enforcement, and telemetry.
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import { scanText, sanitizeText, PII_TYPES, SEVERITY } from './lib/scanner.js';
import { sanitizeAndSendToGemini, SECURITY_MODES, PrivacyLensSecurityError } from './lib/geminiClient.js';
import { maskImage } from './lib/imageMasker.js';

export const CHANNEL_NAME = 'privacylens_channel';

// In-memory Gateway State
const gatewayState = {
  shieldActive: true,
  securityMode: SECURITY_MODES.REDACT_AND_FORWARD,
  stats: {
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
      PHONE_NUMBER: 0,
      API_KEY: 0,
      CVV: 0
    }
  },
  auditLogs: []
};

// Sync shield state from chrome.storage.local on service worker startup
if (typeof chrome !== 'undefined' && chrome.storage?.local) {
  chrome.storage.local.get(['shieldEnabled'], (res) => {
    if (res && typeof res.shieldEnabled === 'boolean') {
      gatewayState.shieldActive = res.shieldEnabled;
    }
  });
}

// Initialize BroadcastChannel
let broadcastChannel = null;

export function getBroadcastChannel() {
  if (!broadcastChannel && typeof BroadcastChannel !== 'undefined') {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      broadcastChannel.onmessage = (event) => handleIncomingChannelMessage(event.data);
    } catch (err) {
      console.warn('[PrivacyLens Gateway] BroadcastChannel init error:', err);
    }
  }
  return broadcastChannel;
}

export function broadcastEvent(type, payload = {}) {
  const channel = getBroadcastChannel();
  const eventMessage = {
    source: 'PRIVACYLENS_GATEWAY',
    type,
    payload,
    timestamp: new Date().toISOString()
  };

  if (channel) {
    try {
      channel.postMessage(eventMessage);
    } catch (e) {
      // channel error
    }
  }

  // Also broadcast via chrome.runtime if available
  if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
    try {
      chrome.runtime.sendMessage(eventMessage).catch(() => {});
    } catch (e) {}
  }

  return eventMessage;
}

/**
 * Core Request Interceptor
 * Evaluates, sanitizes, or blocks an outbound request before it leaves the browser.
 * 
 * @param {Object} request - { prompt, image, targetUrl, options }
 * @returns {Promise<Object>}
 */
export async function interceptOutboundPayload(request = {}) {
  const startTime = Date.now();
  gatewayState.stats.totalIntercepted++;

  const prompt = request.prompt || '';
  const image = request.image || null;
  const targetUrl = request.targetUrl || 'https://api.generativeai.google.com';
  const options = request.options || {};
  const mode = options.securityMode || gatewayState.securityMode;

  // 1. If shield is inactive, bypass without sanitization
  if (!gatewayState.shieldActive) {
    const bypassLog = {
      id: `bypass_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: 'BYPASSED_SHIELD_INACTIVE',
      originalPrompt: prompt,
      sanitizedPrompt: prompt,
      threatCount: 0,
      latencyMs: Date.now() - startTime,
      targetUrl
    };
    gatewayState.auditLogs.unshift(bypassLog);
    broadcastEvent('REQUEST_BYPASSED', bypassLog);
    return {
      allowed: true,
      blocked: false,
      status: 'BYPASSED_SHIELD_INACTIVE',
      payload: { prompt, image },
      audit: bypassLog
    };
  }

  // 2. Scan and Sanitize text locally
  const sanitizeResult = sanitizeText(prompt);
  const detectedThreats = sanitizeResult.threats;
  gatewayState.stats.threatsDetected += detectedThreats.length;

  detectedThreats.forEach(t => {
    if (gatewayState.stats.threatTypes[t.type] !== undefined) {
      gatewayState.stats.threatTypes[t.type]++;
    } else {
      gatewayState.stats.threatTypes[t.type] = 1;
    }
  });

  // 3. Process image if attached with redaction boxes
  let sanitizedImage = image;
  if (image && request.redactionBoxes && request.redactionBoxes.length > 0) {
    try {
      const maskResult = await maskImage(image, request.redactionBoxes);
      sanitizedImage = maskResult.sanitizedBase64;
    } catch (err) {
      console.warn('[PrivacyLens Gateway] Image masking error:', err);
    }
  }

  // 4. Fail-Closed Strict Mode Enforcement
  if (mode === SECURITY_MODES.FAIL_CLOSED_STRICT && detectedThreats.length > 0) {
    gatewayState.stats.totalBlocked++;
    const blockedLog = {
      id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: 'FAIL_CLOSED_BLOCKED',
      reason: `Strict policy hard-aborted request: ${detectedThreats.length} sensitive threat(s) detected.`,
      threatCount: detectedThreats.length,
      threats: detectedThreats.map(t => ({ type: t.type, label: t.label, severity: t.severity })),
      rawPromptLength: prompt.length,
      latencyMs: Date.now() - startTime,
      targetUrl
    };
    gatewayState.auditLogs.unshift(blockedLog);
    broadcastEvent('FAIL_CLOSED_BLOCKED', blockedLog);

    return {
      allowed: false,
      blocked: true,
      status: 'FAIL_CLOSED_BLOCKED',
      reason: blockedLog.reason,
      threats: blockedLog.threats,
      audit: blockedLog
    };
  }

  // 5. Residual Leak Fail-Closed Check
  if (!sanitizeResult.isSafe) {
    gatewayState.stats.totalBlocked++;
    const residualLog = {
      id: `residual_block_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: 'RESIDUAL_LEAK_BLOCKED',
      reason: 'Sanitization verification failed: unredacted residual sensitive data detected.',
      threatCount: sanitizeResult.residualThreats?.length || 1,
      latencyMs: Date.now() - startTime,
      targetUrl
    };
    gatewayState.auditLogs.unshift(residualLog);
    broadcastEvent('FAIL_CLOSED_BLOCKED', residualLog);

    return {
      allowed: false,
      blocked: true,
      status: 'RESIDUAL_LEAK_BLOCKED',
      reason: residualLog.reason,
      audit: residualLog
    };
  }

  // 6. Request is Safe for Cloud Forwarding
  if (detectedThreats.length > 0) {
    gatewayState.stats.totalSanitized++;
  } else {
    gatewayState.stats.totalClean++;
  }

  const successLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    status: detectedThreats.length > 0 ? 'SANITIZED_AND_FORWARDED' : 'CLEAN_DISPATCH',
    originalPrompt: prompt,
    sanitizedPrompt: sanitizeResult.sanitizedText,
    threatCount: detectedThreats.length,
    threats: detectedThreats.map(t => ({ type: t.type, label: t.label, severity: t.severity })),
    latencyMs: Date.now() - startTime,
    targetUrl
  };

  // Limit audit log in memory to 100 entries
  if (gatewayState.auditLogs.length > 100) {
    gatewayState.auditLogs.pop();
  }
  gatewayState.auditLogs.unshift(successLog);

  broadcastEvent('REQUEST_SANITIZED', successLog);

  return {
    allowed: true,
    blocked: false,
    status: successLog.status,
    sanitizedPayload: {
      prompt: sanitizeResult.sanitizedText,
      image: sanitizedImage
    },
    originalPayload: {
      prompt,
      image
    },
    threatCount: detectedThreats.length,
    threats: successLog.threats,
    audit: successLog
  };
}

/**
 * Handle incoming IPC message from BroadcastChannel
 */
function handleIncomingChannelMessage(message) {
  if (!message || message.source === 'PRIVACYLENS_GATEWAY') return;

  switch (message.type) {
    case 'TOGGLE_SHIELD':
      toggleShield(message.payload?.active);
      break;
    case 'SET_SECURITY_MODE':
      if (message.payload?.mode) setSecurityMode(message.payload.mode);
      break;
    case 'INTERCEPT_PAYLOAD_REQUEST':
      interceptOutboundPayload(message.payload).then(res => {
        broadcastEvent('INTERCEPT_PAYLOAD_RESPONSE', res);
      });
      break;
    case 'GET_STATUS_REQUEST':
      broadcastEvent('GATEWAY_STATUS_RESPONSE', getGatewayState());
      break;
    case 'CLEAR_LOGS_REQUEST':
      clearAuditLogs();
      break;
    default:
      break;
  }
}

// Controller Methods
export function toggleShield(forceActive) {
  gatewayState.shieldActive = typeof forceActive === 'boolean' ? forceActive : !gatewayState.shieldActive;
  
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.set({ shieldEnabled: gatewayState.shieldActive });
  }

  broadcastEvent('SHIELD_TOGGLED', { shieldActive: gatewayState.shieldActive });
  return gatewayState.shieldActive;
}

export function setSecurityMode(mode) {
  if (Object.values(SECURITY_MODES).includes(mode)) {
    gatewayState.securityMode = mode;
    broadcastEvent('SECURITY_MODE_CHANGED', { securityMode: mode });
  }
  return gatewayState.securityMode;
}

export function getGatewayState() {
  return {
    shieldActive: gatewayState.shieldActive,
    securityMode: gatewayState.securityMode,
    stats: { ...gatewayState.stats },
    auditLogs: [...gatewayState.auditLogs]
  };
}

export function resetGatewayStats() {
  gatewayState.stats = {
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
      PHONE_NUMBER: 0,
      API_KEY: 0,
      CVV: 0
    }
  };
  broadcastEvent('STATS_RESET', gatewayState.stats);
}

export function clearAuditLogs() {
  gatewayState.auditLogs = [];
  broadcastEvent('AUDIT_LOGS_CLEARED', {});
}

// Auto-initialize BroadcastChannel
getBroadcastChannel();

// Setup Chrome Runtime Listeners if inside Chrome Extension Service Worker
if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'INTERCEPT_OUTBOUND_PAYLOAD') {
      interceptOutboundPayload(request.payload).then(res => sendResponse(res));
      return true; // asynchronous response
    }
    if (request.action === 'TOGGLE_SHIELD') {
      const active = toggleShield(request.active);
      sendResponse({ shieldActive: active, stats: gatewayState.stats });
      return false;
    }
    if (request.action === 'GET_STATE') {
      sendResponse(getGatewayState());
      return false;
    }
    if (request.action === 'CLEAR_LOGS') {
      clearAuditLogs();
      sendResponse({ success: true });
      return false;
    }
    return false;
  });
}

export default {
  interceptOutboundPayload,
  toggleShield,
  setSecurityMode,
  getGatewayState,
  resetGatewayStats,
  clearAuditLogs,
  broadcastEvent,
  getBroadcastChannel
};
