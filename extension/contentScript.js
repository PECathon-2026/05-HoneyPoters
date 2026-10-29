/**
 * PrivacyLens — Content Script
 * In-Page DOM Inspector & Form Input Security Interceptor
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import { scanDOM, scanText, sanitizeText, PII_TYPES } from './lib/scanner.js';

export const CHANNEL_NAME = 'privacylens_channel';

class PrivacyLensContentScript {
  constructor() {
    this.channel = null;
    this.detectedElements = new Map();
    this.badgeElements = new Map();
    this.isListening = false;
    this.initChannel();
  }

  initChannel() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => this.handleChannelMessage(event.data);
      } catch (err) {
        console.warn('[PrivacyLens ContentScript] BroadcastChannel init error:', err);
      }
    }
  }

  broadcast(type, payload = {}) {
    const message = {
      source: 'CONTENT_SCRIPT',
      type,
      payload,
      timestamp: new Date().toISOString()
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (err) {
        // channel closed or detached
      }
    }

    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      try {
        chrome.runtime.sendMessage(message).catch(() => {});
      } catch (err) {
        // runtime disconnected
      }
    }

    return message;
  }

  /**
   * Scans current DOM inputs and elements for sensitive fields.
   * @param {Document|HTMLElement} [rootNode]
   * @returns {{ hasSensitiveFields: boolean, sensitiveElements: Array, redactionBoxes: Array }}
   */
  scanPage(rootNode) {
    const root = rootNode || (typeof document !== 'undefined' ? document : null);
    if (!root) {
      return { hasSensitiveFields: false, sensitiveElements: [], redactionBoxes: [] };
    }

    const scanResult = scanDOM(root);

    // Track detected elements
    this.detectedElements.clear();
    scanResult.sensitiveElements.forEach((item, idx) => {
      this.detectedElements.set(`field_${idx}`, item);
    });

    this.broadcast('DOM_SCAN_COMPLETED', {
      url: typeof window !== 'undefined' ? window.location?.href : '',
      count: scanResult.sensitiveElements.length,
      redactionBoxes: scanResult.redactionBoxes,
      hasSensitiveFields: scanResult.hasSensitiveFields
    });

    return scanResult;
  }

  /**
   * Attaches live input listeners to detect sensitive typed values in real time.
   */
  attachListeners(rootNode) {
    const doc = rootNode || (typeof document !== 'undefined' ? document : null);
    if (!doc || this.isListening) return;

    this.isListening = true;

    const handleInput = (event) => {
      const target = event.target;
      if (!target || !['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      const val = target.value || '';
      if (val.length < 3) {
        this.removeBadge(target);
        return;
      }

      // Check text for PII
      const textScan = scanText(val);
      const isPasswordType = target.type === 'password';

      if (textScan.length > 0 || isPasswordType) {
        const topThreat = textScan[0] || {
          type: PII_TYPES.PASSWORD,
          label: 'Password Field',
          severity: 'CRITICAL'
        };

        this.applyFieldProtection(target, topThreat);

        this.broadcast('DOM_FIELD_THREAT_DETECTED', {
          threatType: topThreat.type,
          severity: topThreat.severity,
          fieldName: target.name || target.id || 'unnamed_field',
          maskedValue: topThreat.maskedValue || '********',
          timestamp: new Date().toISOString()
        });
      } else {
        this.removeBadge(target);
      }
    };

    doc.addEventListener('input', handleInput, true);
    doc.addEventListener('focusin', handleInput, true);

    // Intercept form submissions
    doc.addEventListener('submit', (event) => {
      const form = event.target;
      if (!form) return;

      const formData = new FormData(form);
      const values = Array.from(formData.values()).filter(v => typeof v === 'string').join(' ');
      const scan = scanText(values);

      if (scan.length > 0) {
        this.broadcast('FORM_SUBMIT_INTERCEPTED', {
          threatCount: scan.length,
          threats: scan.map(t => ({ type: t.type, label: t.label, severity: t.severity })),
          action: form.action || ''
        });
      }
    }, true);
  }

  applyFieldProtection(element, threat) {
    if (typeof document === 'undefined') return;

    const isCritical = threat.severity === 'CRITICAL';
    element.classList.add('privacylens-protected-input');
    if (isCritical) {
      element.classList.add('privacylens-critical-input');
    }

    // Attach floating badge if not present
    let badge = this.badgeElements.get(element);
    if (!badge) {
      badge = document.createElement('div');
      badge.className = `privacylens-shield-badge ${isCritical ? 'critical' : ''}`;
      badge.textContent = `🛡️ [PrivacyLens: ${threat.type || 'SENSITIVE'}]`;
      
      const parent = element.parentNode;
      if (parent) {
        const rect = element.getBoundingClientRect?.() || { top: 0, left: 0 };
        badge.style.top = `${Math.max(0, rect.top - 20)}px`;
        badge.style.left = `${rect.left}px`;
        document.body?.appendChild(badge);
        this.badgeElements.set(element, badge);
      }
    }
  }

  removeBadge(element) {
    element.classList?.remove('privacylens-protected-input', 'privacylens-critical-input');
    const badge = this.badgeElements.get(element);
    if (badge && badge.parentNode) {
      badge.parentNode.removeChild(badge);
      this.badgeElements.delete(element);
    }
  }

  handleChannelMessage(message) {
    if (!message || message.source === 'CONTENT_SCRIPT') return;

    if (message.type === 'SCAN_PAGE_REQUEST') {
      const result = this.scanPage();
      this.broadcast('DOM_SCAN_RESPONSE', result);
    }
  }

  destroy() {
    if (this.channel) {
      try {
        this.channel.close();
      } catch (e) {}
      this.channel = null;
    }
    this.badgeElements.forEach((badge) => {
      if (badge && badge.parentNode) badge.parentNode.removeChild(badge);
    });
    this.badgeElements.clear();
    this.isListening = false;
  }
}

// Singleton instantiation in browser environment
export const contentScriptInstance = new PrivacyLensContentScript();

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Auto-init on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      contentScriptInstance.scanPage();
      contentScriptInstance.attachListeners();
    });
  } else {
    contentScriptInstance.scanPage();
    contentScriptInstance.attachListeners();
  }

  // Handle Chrome runtime messages
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'SCAN_PAGE') {
        const res = contentScriptInstance.scanPage();
        sendResponse(res);
      } else if (request.action === 'GET_THREATS') {
        sendResponse({
          count: contentScriptInstance.detectedElements.size,
          elements: Array.from(contentScriptInstance.detectedElements.values())
        });
      }
      return true;
    });
  }
}

export default PrivacyLensContentScript;
