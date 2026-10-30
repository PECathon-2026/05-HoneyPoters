/**
 * PrivacyLens Extension Popup Script
 * Manages Master Shield Toggle, Dynamic Dark/Light Theme Switching, Chrome Storage Persistence, and Cross-Context IPC
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

const shieldToggle = document.getElementById('shield-toggle');
const statusPill = document.getElementById('status-pill');
const statIntercepted = document.getElementById('stat-intercepted');
const statThreats = document.getElementById('stat-threats');
const shieldModeDesc = document.getElementById('shield-mode-desc');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const openWebappLink = document.getElementById('open-webapp-link');
const launchWebappBtn = document.getElementById('launch-webapp-btn');

let currentTheme = 'dark';

/**
 * Applies the active theme ('dark' | 'light') to popup DOM.
 * @param {string} theme - 'dark' (Pure Z-Black) or 'light' (Warm Beige)
 */
function applyTheme(theme) {
  currentTheme = (theme === 'light') ? 'light' : 'dark';
  
  if (document.body) {
    document.body.className = currentTheme;
  }
  
  if (themeIcon) {
    themeIcon.textContent = (currentTheme === 'dark') ? '☀️' : '🌙';
  }
  
  if (themeToggleBtn) {
    themeToggleBtn.title = (currentTheme === 'dark') 
      ? 'Switch to Beige Light Mode' 
      : 'Switch to Pure Z-Black Dark Mode';
  }

  try {
    localStorage.setItem('privacylens_theme', currentTheme);
  } catch (e) {}
}

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
      statusPill.className = 'status-pill active';
    } else {
      statusPill.textContent = '⚠️ Shield Inactive: Direct Cloud Bypass';
      statusPill.className = 'status-pill inactive';
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
 * 1. Initial State & Theme Restoration:
 * Read 'shieldEnabled' and 'theme' from chrome.storage.local immediately on popup load.
 * Default shieldEnabled to true only if undefined. Default theme to 'dark'.
 */
if (typeof chrome !== 'undefined' && chrome.storage?.local) {
  chrome.storage.local.get(['shieldEnabled'], (result) => {
    const isEnabled = (result && result.shieldEnabled !== undefined) ? result.shieldEnabled : true;
    updateUI({ shieldActive: isEnabled });
  });

  chrome.storage.local.get(['theme'], (result) => {
    const savedTheme = result?.theme || (function() {
      try { return localStorage.getItem('privacylens_theme'); } catch(e) { return null; }
    })() || 'dark';
    applyTheme(savedTheme);
  });
} else {
  applyTheme('dark');
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
 * 3. User Master Shield Toggle Event Handler:
 * Persists state to chrome.storage.local, notifies background worker,
 * broadcasts to all active tab content scripts, and informs BroadcastChannel listeners.
 */
if (shieldToggle) {
  shieldToggle.addEventListener('change', () => {
    const active = shieldToggle.checked;

    // A. Save state to Chrome Storage (Requirement: chrome.storage.local.set)
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

/**
 * 4. Theme Toggle Button Event Handler:
 * Switches between Pure Z-Black Dark Mode (#000000) and Warm Beige Light Mode (#fdfbf7).
 * Persists to chrome.storage.local and broadcasts to WebApp.
 */
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = (currentTheme === 'dark') ? 'light' : 'dark';
    applyTheme(nextTheme);

    // Save to chrome.storage.local
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ theme: nextTheme });
    }

    // Broadcast theme change via BroadcastChannel
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('privacylens_channel');
        channel.postMessage({
          source: 'PRIVACYLENS_POPUP',
          type: 'THEME_CHANGED',
          payload: { theme: nextTheme }
        });
        channel.close();
      }
    } catch (err) {}
  });
}

/**
 * 5. Cross-Context Listener (Sync theme & shield when updated outside popup)
 */
if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      if (changes.shieldEnabled) {
        updateUI({ shieldActive: changes.shieldEnabled.newValue });
      }
      if (changes.theme) {
        applyTheme(changes.theme.newValue);
      }
    }
  });
}

try {
  if (typeof BroadcastChannel !== 'undefined') {
    const bc = new BroadcastChannel('privacylens_channel');
    bc.onmessage = (event) => {
      const data = event.data;
      if (!data) return;
      if (data.type === 'THEME_CHANGED' && data.payload?.theme) {
        applyTheme(data.payload.theme);
      } else if (data.type === 'TOGGLE_SHIELD' && typeof data.payload?.active === 'boolean') {
        updateUI({ shieldActive: data.payload.active });
      }
    };
  }
} catch (e) {}

/**
 * 6. Open WebApp Cockpit Link & Primary Launch Button
 * Opens http://localhost:5173/ in the browser tab or focuses existing WebApp tab.
 */
function openWebappHome() {
  const targetUrl = 'http://localhost:5173/';
  if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
    chrome.tabs.query({ url: '*://localhost:5173/*' }, (tabs) => {
      if (tabs && tabs.length > 0 && tabs[0].id) {
        chrome.tabs.update(tabs[0].id, { active: true });
        if (chrome.windows?.update && tabs[0].windowId) {
          chrome.windows.update(tabs[0].windowId, { focused: true });
        }
      } else if (chrome.tabs?.create) {
        chrome.tabs.create({ url: targetUrl });
      } else {
        window.open(targetUrl, '_blank');
      }
    });
  } else {
    window.open(targetUrl, '_blank');
  }
}

if (openWebappLink) {
  openWebappLink.addEventListener('click', (e) => {
    e.preventDefault();
    openWebappHome();
  });
}

if (launchWebappBtn) {
  launchWebappBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openWebappHome();
  });
}
