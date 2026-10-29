/**
 * PrivacyLens Extension Popup Script
 */

const shieldToggle = document.getElementById('shield-toggle');
const statusPill = document.getElementById('status-pill');
const statIntercepted = document.getElementById('stat-intercepted');
const statThreats = document.getElementById('stat-threats');

function updateUI(state) {
  if (!state) return;
  shieldToggle.checked = state.shieldActive;
  if (state.shieldActive) {
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

  if (state.stats) {
    statIntercepted.textContent = state.stats.totalIntercepted || 0;
    statThreats.textContent = (state.stats.totalBlocked || 0) + (state.stats.totalSanitized || 0);
  }
}

// Request initial state from background service worker
if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
  chrome.runtime.sendMessage({ action: 'GET_STATE' }, (res) => {
    if (res) updateUI(res);
  });
}

shieldToggle.addEventListener('change', () => {
  const active = shieldToggle.checked;
  if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
    chrome.runtime.sendMessage({ action: 'TOGGLE_SHIELD', active }, (res) => {
      if (res) updateUI(res);
    });
  }
});
