/**
 * PrivacyLens — Local Secret Injection Helper (DOM Automation Bridge)
 * 
 * Part of PrivacyLens (PS-004) by Team 05-HoneyPoters
 * Client-Side RAM Secret Vault & DOM Automation Bridge:
 * Allows Chrome Extension & Autonomous Browser Agents to map sanitized schema
 * placeholders back to local browser RAM secrets and auto-fill DOM fields
 * upon AI action execution without ever exposing raw credentials to the cloud.
 */

import { SCENARIOS } from './testScenarios.js';

// ============================================================================
// 1. Ephemeral In-Memory Secret Vault (Zero Persistence)
// ============================================================================

export class LocalSecretVault {
  constructor(defaultTtlMs = 15 * 60 * 1000) { // 15-minute default TTL
    this.vault = new Map();
    this.defaultTtlMs = defaultTtlMs;
  }

  /**
   * Registers a sanitized token and its real secret in local browser RAM
   * @param {string} token - e.g. '[REDACTED: CARD_NUMBER]'
   * @param {string} secret - e.g. '4242 4242 4242 4242'
   * @param {Object} [metadata={}]
   * @returns {string} token
   */
  register(token, secret, metadata = {}) {
    if (!token || typeof secret !== 'string') return token;

    const expiresAt = Date.now() + (metadata.ttlMs || this.defaultTtlMs);
    this.vault.set(token, {
      token,
      secret,
      category: metadata.category || 'PII',
      fieldName: metadata.fieldName || 'field',
      registeredAt: Date.now(),
      expiresAt
    });

    return token;
  }

  /**
   * Bulk registers threats extracted from sanitizeText()
   * @param {Array<Object>} threats
   * @returns {number} count of registered secrets
   */
  registerFromThreats(threats = []) {
    let count = 0;
    if (!Array.isArray(threats)) return count;

    threats.forEach((threat) => {
      if (threat.replacementToken && threat.rawMatch) {
        this.register(threat.replacementToken, threat.rawMatch, {
          category: threat.type,
          fieldName: threat.label
        });
        count++;
      }
    });

    return count;
  }

  /**
   * Resolves a token back to its real secret from local RAM
   * @param {string} token 
   * @returns {string|null}
   */
  resolve(token) {
    if (!token) return null;
    const entry = this.vault.get(token);
    if (!entry) return null;

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.vault.delete(token);
      return null;
    }

    return entry.secret;
  }

  /**
   * Checks if a token is present in the vault
   * @param {string} token 
   * @returns {boolean}
   */
  has(token) {
    return this.resolve(token) !== null;
  }

  /**
   * Returns all active tokens currently stored in the RAM vault
   * @returns {string[]}
   */
  getAllTokens() {
    this.purgeExpired();
    return Array.from(this.vault.keys());
  }

  /**
   * Purges expired entries from RAM
   */
  purgeExpired() {
    const now = Date.now();
    for (const [token, entry] of this.vault.entries()) {
      if (now > entry.expiresAt) {
        this.vault.delete(token);
      }
    }
  }

  /**
   * Clears all secrets immediately (e.g. upon tab close or logout)
   */
  clear() {
    this.vault.clear();
  }

  /**
   * Number of active secrets in vault
   */
  get size() {
    this.purgeExpired();
    return this.vault.size;
  }
}

// Global default singleton vault instance
export const defaultSecretVault = new LocalSecretVault();

// ============================================================================
// 2. String De-Tokenization & Reverse Mapping
// ============================================================================

/**
 * Replaces all sanitized schema tokens in a string with their real secrets from RAM
 * 
 * @param {string} textWithTokens 
 * @param {LocalSecretVault} [vault=defaultSecretVault]
 * @returns {string}
 */
export function detokenizeText(textWithTokens, vault = defaultSecretVault) {
  if (typeof textWithTokens !== 'string') return '';

  let result = textWithTokens;
  const tokens = vault.getAllTokens();

  tokens.forEach((token) => {
    if (result.includes(token)) {
      const secret = vault.resolve(token);
      if (secret !== null) {
        result = result.replaceAll(token, secret);
      }
    }
  });

  return result;
}

// ============================================================================
// 3. DOM Automation & Secret Injection Engine
// ============================================================================

/**
 * Injects a secret into a DOM input/textarea element, resolving tokens from RAM
 * and firing standard input/change events for modern reactive frameworks (React, Vue).
 * 
 * @param {HTMLElement|string} elementOrSelector 
 * @param {string} tokenOrSecret - Either raw secret or sanitized token
 * @param {Object} [options={}]
 * @param {LocalSecretVault} [options.vault=defaultSecretVault]
 * @param {Document|HTMLElement} [options.rootNode]
 * @returns {Object} Injection result
 */
export function injectIntoDOM(elementOrSelector, tokenOrSecret, options = {}) {
  const vault = options.vault || defaultSecretVault;
  const root = options.rootNode || (typeof document !== 'undefined' ? document : null);

  let element = null;
  if (typeof elementOrSelector === 'string') {
    if (root && typeof root.querySelector === 'function') {
      element = root.querySelector(elementOrSelector);
    }
  } else if (elementOrSelector && typeof elementOrSelector === 'object') {
    element = elementOrSelector;
  }

  if (!element) {
    return {
      success: false,
      error: `DOM Element not found for selector: "${elementOrSelector}"`,
      selector: typeof elementOrSelector === 'string' ? elementOrSelector : null
    };
  }

  // Resolve secret from RAM vault if a token was supplied
  const rawSecret = vault.resolve(tokenOrSecret) !== null
    ? vault.resolve(tokenOrSecret)
    : tokenOrSecret;

  if (rawSecret === null || rawSecret === undefined) {
    return {
      success: false,
      error: `Secret could not be resolved from RAM vault for token: "${tokenOrSecret}"`,
      selector: typeof elementOrSelector === 'string' ? elementOrSelector : null
    };
  }

  // Apply value to DOM input / textarea
  if ('value' in element) {
    // React / Modern framework compatibility: call native prototype setter if present
    const nativeSetter = typeof window !== 'undefined'
      ? (Object.getOwnPropertyDescriptor(window.HTMLInputElement?.prototype || {}, 'value')?.set ||
         Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement?.prototype || {}, 'value')?.set)
      : null;

    if (nativeSetter) {
      try {
        nativeSetter.call(element, rawSecret);
      } catch (e) {
        element.value = rawSecret;
      }
    } else {
      element.value = rawSecret;
    }

    // Dispatch input & change events for reactive state synchronization
    if (typeof Event !== 'undefined') {
      try {
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (e) {}
    }
  } else if (element.isContentEditable || element.getAttribute?.('contenteditable') === 'true') {
    element.textContent = rawSecret;
    if (typeof Event !== 'undefined') {
      try {
        element.dispatchEvent(new Event('input', { bubbles: true }));
      } catch (e) {}
    }
  } else {
    element.textContent = rawSecret;
  }

  return {
    success: true,
    selector: typeof elementOrSelector === 'string' ? elementOrSelector : element.id || element.tagName,
    element,
    injectedLength: String(rawSecret).length,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// 4. Autonomous AI Action Execution Bridge & Safety Validation
// ============================================================================

const DANGEROUS_TARGET_PATTERNS = [
  /<script/i,
  /<iframe/i,
  /<object/i,
  /<embed/i,
  /javascript:/i,
  /vbscript:/i,
  /data:text\/html/i,
  /on\w+\s*=/i
];

/**
 * Validates proposed AI actions to reject invalid targets or unsafe operations.
 * @param {Object} action
 * @param {Object} [options={}]
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateProposedAction(action, options = {}) {
  if (!action || typeof action !== 'object') {
    return { valid: false, error: 'Invalid action object' };
  }

  const actionType = (action.type || action.action || 'FILL_FORM').toUpperCase();
  const allowedActions = ['FILL', 'FILL_FIELD', 'AUTOTYPE', 'BATCH_FILL', 'FILL_FORM', 'SUBMIT_FORM', 'CLICK', 'SUBMIT'];
  if (!allowedActions.includes(actionType)) {
    return { valid: false, error: `Unsupported or prohibited AI action type: "${actionType}"` };
  }

  // Collect selectors to validate
  const selectors = [];
  if (action.selector) selectors.push(action.selector);
  if (action.field) selectors.push(action.field);
  if (Array.isArray(action.fields)) {
    action.fields.forEach(f => {
      if (f.selector) selectors.push(f.selector);
      if (f.id) selectors.push(`#${f.id}`);
    });
  }

  for (const sel of selectors) {
    if (typeof sel !== 'string') continue;
    for (const pat of DANGEROUS_TARGET_PATTERNS) {
      if (pat.test(sel)) {
        return { valid: false, error: `Rejected unsafe operation: target selector contains hazardous pattern "${sel}"` };
      }
    }
  }

  return { valid: true };
}

/**
 * Determines if an action is sensitive or irreversible, requiring explicit user approval
 * @param {Object} action
 * @returns {boolean}
 */
export function requiresUserApproval(action) {
  if (!action || typeof action !== 'object') return false;
  if (action.requireApproval === true) return true;

  const actionType = (action.type || action.action || '').toUpperCase();
  const irreversibleTypes = ['SUBMIT', 'SUBMIT_FORM', 'DELETE', 'PURGE', 'TRANSFER_FUNDS', 'PAYMENT', 'PURCHASE'];
  if (irreversibleTypes.includes(actionType)) return true;

  // Check for critical financial tokens
  const tokensToCheck = [];
  if (action.token) tokensToCheck.push(action.token);
  if (Array.isArray(action.fields)) {
    action.fields.forEach(f => {
      if (f.token) tokensToCheck.push(f.token);
    });
  }

  const criticalTokens = ['[REDACTED: CARD_NUMBER]', '[REDACTED: CVV]', '[REDACTED: PASSCODE]', '[REDACTED: OTP]'];
  const hasCritical = tokensToCheck.some(t => criticalTokens.includes(t));
  return hasCritical && (actionType.includes('SUBMIT') || action.requiresConfirmation === true);
}

/**
 * Executes structured autonomous AI agent browser actions (fill, submit, type)
 * translating sanitized schema tokens into local RAM secrets and filling DOM fields.
 * 
 * @param {Object} action - AI action command object
 * @param {Object} [options={}]
 * @param {LocalSecretVault} [options.vault=defaultSecretVault]
 * @param {Document|HTMLElement} [options.rootNode]
 * @returns {Object} Action execution report
 */
export function executeAIAction(action, options = {}) {
  const vault = options.vault || defaultSecretVault;
  const root = options.rootNode || (typeof document !== 'undefined' ? document : null);
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  if (!action || typeof action !== 'object') {
    return { success: false, error: 'Invalid AI action payload supplied', zeroCloudLeakageConfirmed: true };
  }

  // 1. Validate proposed action and reject invalid targets / unsafe operations
  const validation = validateProposedAction(action, options);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      status: 'REJECTED_UNSAFE_OPERATION',
      actionType: action.type || action.action,
      zeroCloudLeakageConfirmed: true
    };
  }

  // 2. User approval check for sensitive or irreversible actions
  const needsApproval = action.requireApproval === true || (options.enforceUserApproval && requiresUserApproval(action));
  if (needsApproval && action.userApproved !== true) {
    return {
      success: false,
      status: 'PENDING_USER_APPROVAL',
      requiresApproval: true,
      error: 'Sensitive or irreversible action requires explicit user approval before execution.',
      actionType: action.type || action.action,
      zeroCloudLeakageConfirmed: true
    };
  }

  const results = [];
  const actionType = action.type || action.action || 'FILL_FORM';

  switch (actionType.toUpperCase()) {
    case 'FILL':
    case 'FILL_FIELD':
    case 'AUTOTYPE': {
      const res = injectIntoDOM(action.selector || action.field, action.token || action.value, { vault, rootNode: root });
      results.push(res);
      break;
    }

    case 'BATCH_FILL':
    case 'FILL_FORM':
    case 'SUBMIT_FORM': {
      const fields = action.fields || action.inputs || [];
      fields.forEach((f) => {
        const selector = f.selector || f.id || f.name;
        const token = f.token || f.value;
        const res = injectIntoDOM(selector, token, { vault, rootNode: root });
        results.push(res);
      });
      break;
    }

    default:
      return { success: false, error: `Unsupported AI action type: "${actionType}"` };
  }

  const allSuccess = results.length > 0 && results.every(r => r.success);
  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const latencyMs = Math.round((endTime - startTime) * 100) / 100;

  return {
    success: allSuccess,
    actionType,
    fieldsProcessed: results.length,
    results,
    latencyMs,
    zeroCloudLeakageConfirmed: true,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// 5. Test Scenarios Integration Helper
// ============================================================================

/**
 * Registers secrets from one of the 5 official evaluation scenarios into the vault
 * @param {string} scenarioId 
 * @param {LocalSecretVault} [vault=defaultSecretVault]
 * @returns {number} count of registered secrets
 */
export function populateScenarioSecrets(scenarioId, vault = defaultSecretVault) {
  const scenario = Object.values(SCENARIOS).find(s => s.id === scenarioId);
  if (!scenario || !scenario.sensitiveFields) return 0;

  let count = 0;
  scenario.sensitiveFields.forEach((field) => {
    // Preserve primary token mapping for first exemplar of this token type
    if (!vault.has(field.token)) {
      vault.register(field.token, field.raw, {
        fieldName: field.name,
        category: field.expectedType
      });
    }
    // Also register specific field name token
    if (field.name) {
      vault.register(`[REDACTED: ${field.expectedType}: ${field.name}]`, field.raw, {
        fieldName: field.name,
        category: field.expectedType
      });
    }
    count++;
  });

  return count;
}

/**
 * Simulates end-to-end AI agent autonomous form fill on scenario DOM
 * @param {string} scenarioId 
 * @param {HTMLElement} domContainer 
 * @param {LocalSecretVault} [vault] - Custom vault or fresh isolated vault
 * @returns {Object} Simulation report
 */
export function simulateAIScenarioAutofill(scenarioId, domContainer, vault = null) {
  const activeVault = vault || new LocalSecretVault();
  populateScenarioSecrets(scenarioId, activeVault);

  const scenario = Object.values(SCENARIOS).find(s => s.id === scenarioId);
  if (!scenario) return { success: false, error: 'Scenario not found' };

  // Generate AI action payload with sanitized schema tokens only (no real secrets!)
  let actionPayload = null;

  if (scenarioId === 'ecommerce_checkout') {
    actionPayload = {
      action: 'FILL_FORM',
      fields: [
        { selector: '#cardNumber', token: '[REDACTED: CARD_NUMBER]' },
        { selector: '#cardCvv', token: '[REDACTED: CVV]' },
        { selector: '#shippingAddress', token: '[REDACTED: SHIPPING_ADDRESS]' }
      ]
    };
  } else if (scenarioId === 'authentication') {
    actionPayload = {
      action: 'FILL_FORM',
      fields: [
        { selector: '#loginEmail', token: '[REDACTED: EMAIL]' },
        { selector: '#loginPassword', token: '[REDACTED: PASSCODE]' },
        { selector: '#loginOtp', token: '[REDACTED: OTP]' }
      ]
    };
  } else if (scenarioId === 'developer_settings') {
    actionPayload = {
      action: 'FILL_FORM',
      fields: [
        { selector: '#apiKey', token: '[REDACTED: API_KEY]' },
        { selector: '#jwtToken', token: '[REDACTED: AUTH_TOKEN]' },
        { selector: '#serverIp', token: '[REDACTED: IP_ADDRESS]' }
      ]
    };
  } else {
    actionPayload = {
      action: 'FILL_FORM',
      fields: []
    };
  }

  // Execute AI action on local DOM container
  return executeAIAction(actionPayload, { vault: activeVault, rootNode: domContainer });
}
