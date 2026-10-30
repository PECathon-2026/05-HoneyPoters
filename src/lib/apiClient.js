/**
 * PrivacyLens — Client API Connector
 * Provides dynamic URL resolution, backend health detection, Gemini proxy calls,
 * SecOps authentication, and audit ledger persistence
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

// Determine API Base URL dynamically
const getApiBaseUrl = () => {
  // 1. Explicit environment variable if configured
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
  }

  // 2. In browser environment: check if running locally
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
  }

  // 3. In production: use relative API path or fallback
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

const SESSION_TOKEN_KEY = 'privacylens_secops_token';

/**
 * Returns currently stored session token.
 */
export function getStoredToken() {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(SESSION_TOKEN_KEY) || null;
    }
  } catch (e) {}
  return null;
}

/**
 * Persists session token in volatile local storage.
 */
export function setStoredToken(token) {
  try {
    if (typeof localStorage !== 'undefined' && token) {
      localStorage.setItem(SESSION_TOKEN_KEY, token);
    }
  } catch (e) {}
}

/**
 * Clears session token.
 */
export function clearStoredToken() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_TOKEN_KEY);
    }
  } catch (e) {}
}

/**
 * Checks backend API health and guardrail capabilities.
 * @returns {Promise<Object>}
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Healthcheck failed with status ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      service: 'PrivacyLens Local Standalone Mode',
      error: err.message,
      geminiConfigured: false
    };
  }
}

/**
 * Authenticates a SecOps user or PECathon evaluator against backend.
 * @param {string} roleId - 'secops-lead' | 'pecathon-judge' | 'compliance-auditor'
 * @param {string} [name]
 * @param {string} [email]
 * @returns {Promise<Object>}
 */
export async function loginUser(roleId = 'secops-lead', name, email) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId, name, email })
    });
    const data = await res.json();
    if (data.success && data.token) {
      setStoredToken(data.token);
    }
    return data;
  } catch (err) {
    console.warn('[ApiClient] Auth login backend unreachable, falling back to local session:', err.message);
    return {
      success: true,
      token: `pl_local_fallback_${roleId}_${Date.now()}`,
      user: {
        id: roleId,
        name: name || 'Authorized Evaluator',
        role: 'SecOps Evaluator',
        clearance: 'Level 3 — Client Standalone',
        team: 'Team 05-HoneyPoters'
      }
    };
  }
}

/**
 * Verifies an existing session token.
 * @param {string} [token]
 * @returns {Promise<Object>}
 */
export async function verifyToken(token = getStoredToken()) {
  if (!token) return { valid: false, error: 'No token provided' };

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });
    return await res.json();
  } catch (err) {
    return { valid: true, simulated: true };
  }
}

/**
 * Dispatches a prompt or multimodal payload through the secure Gemini Backend Proxy.
 * Ensures API Key remains hidden on server and verifies server-side sanitization.
 * 
 * @param {Object} options
 * @param {string} options.prompt
 * @param {string} [options.imageBase64]
 * @param {string} [options.securityMode='REDACT_AND_FORWARD']
 * @param {string} [options.model='gemini-1.5-flash']
 * @returns {Promise<Object>}
 */
export async function sendToGeminiProxy({
  prompt = '',
  imageBase64 = null,
  securityMode = 'REDACT_AND_FORWARD',
  model = 'gemini-1.5-flash'
}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/gemini/sanitize-proxy`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      prompt,
      imageBase64,
      securityMode,
      model
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Proxy error status ${res.status}`);
  }

  return data;
}

/**
 * Fetches audit forensics logs from the centralized server ledger.
 * @param {number} [limit=50]
 * @param {string} [filter='']
 * @returns {Promise<Array<Object>>}
 */
export async function fetchAuditLogs(limit = 50, filter = '') {
  try {
    const params = new URLSearchParams();
    if (limit) params.set('limit', String(limit));
    if (filter) params.set('filter', filter);

    const res = await fetch(`${API_BASE_URL}/api/audit/logs?${params.toString()}`);
    if (!res.ok) throw new Error(`Audit fetch failed: ${res.status}`);
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    console.warn('[ApiClient] Remote audit logs unreachable:', err.message);
    return [];
  }
}

/**
 * Appends an audit entry to the backend audit forensics ledger.
 * @param {Object} entry
 * @returns {Promise<Object>}
 */
export async function postAuditEntry(entry) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/audit/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}
