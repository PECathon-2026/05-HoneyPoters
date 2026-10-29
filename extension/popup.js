/**
 * PrivacyLens Extension Popup Script
 * Manages Master Shield Toggle, Chrome Storage Persistence, and Cross-Context IPC
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

const shieldToggle = document.getElementById('shield-toggle');
const statusPill = document.getElementById('status-pill');
const statIntercepted = document.getElementById('stat-intercepted');
const statThreats = document.getElementById('stat-threats');
const shieldModeDesc = document.getElementById('shield-mode-desc');

/**
 * Updates Popup UI elements according to the active shield state and gateway stats.
 * @param {Object} state - { shieldActive, shieldEnabled, stats }
 */
function updateUI(state) {
  if (!state) return;

  const isActive = typeof state.shieldActive === 'boolean' 
    ? state.shieldActive 
    : (typeof state.shieldEnabled === 'boolean' ? state.shieldEnabled : true);

  if (shieldToggle) {
    shieldToggle.checked = isActive;
  }

  if (statusPill) {
    if (isActive) {
      statusPill.textContent = '🟢 Shield Active: Zero Cloud Leakage';
      statusPill.style.color = '#38bdf8';
      statusPill.style.borderColor = 'rgba(14, 165, 233, 0.3)';
      statusPill.style.background = 'rgba(14, 165, 233, 0.15)';
    } else {
      statusPill.textContent = '⚠️ Shield Inactive: Direct Cloud Bypass';
      statusPill.style.color = '#f87171';
      statusPill.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      statusPill.style.background = 'rgba(239, 68, 68, 0.15)';
    }
  }

  if (shieldModeDesc) {
    shieldModeDesc.textContent = isActive ? 'Intercepting Outbound AI' : 'Bypassing Local Redaction';
  }

  if (state.stats) {
    if (statIntercepted) statIntercepted.textContent = state.stats.totalIntercepted || 0;
    if (statThreats) statThreats.textContent = (state.stats.totalBlocked || 0) + (state.stats.totalSanitized || 0);
  }
}

/**
 * 1. Initial State Restoration:
 * Read 'shieldEnabled' from chrome.storage.local immediately on popup load.
 * Default to true only if undefined.
 */
if (typeof chrome !== 'undefined' && chrome.storage?.local) {
  chrome.storage.local.get(['shieldEnabled'], (result) => {
    const isEnabled = (result && result.shieldEnabled !== undefined) ? result.shieldEnabled : true;
    updateUI({ shieldActive: isEnabled });
  });
}

/**
 * 2. Request Gateway State from Background Service Worker:
 * Fetches real-time telemetry stats and current runtime status.
 */
if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
  chrome.runtime.sendMessage({ action: 'GET_STATE' }, (res) => {
    if (res) {
      updateUI(res);
    }
  });
}

/**
 * 3. User Toggle Event Handler:
 * Persists state to chrome.storage.local, notifies background worker,
 * broadcasts to all active tab content scripts, and informs BroadcastChannel listeners.
 */
if (shieldToggle) {
  shieldToggle.addEventListener('change', () => {
    const active = shieldToggle.checked;

    // A. Save state to Chrome Storage (Requirement 1: chrome.storage.local.set)
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ shieldEnabled: active }, () => {
        if (chrome.runtime?.lastError) {
          console.warn('[PrivacyLens Popup] Storage sync error:', chrome.runtime.lastError);
        }
      });
    }

    // B. Broadcast to Background Service Worker
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ action: 'TOGGLE_SHIELD', active }, (res) => {
        if (res) updateUI(res);
      });
    }

    // C. Broadcast to all open tabs / Content Scripts so interceptors respect OFF state
    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      chrome.tabs.query({}, (tabs) => {
        if (Array.isArray(tabs)) {
          tabs.forEach((tab) => {
            if (tab.id) {
              chrome.tabs.sendMessage(tab.id, { action: 'SHIELD_TOGGLED', active }).catch(() => {
                // Ignore errors for unscripted/privileged tabs (e.g. chrome://)
              });
            }
          });
        }
      });
    }

    // D. Broadcast via BroadcastChannel for React WebApp / client sync
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('privacylens_channel');
        channel.postMessage({
          source: 'PRIVACYLENS_POPUP',
          type: 'TOGGLE_SHIELD',
          payload: { active, shieldActive: active }
        });
        channel.close();
      }
    } catch (err) {
      // BroadcastChannel unavailable in isolated popup environment
    }

    // E. Immediate UI Update
    updateUI({ shieldActive: active });
  });
}
