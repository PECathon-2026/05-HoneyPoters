/**
 * PrivacyLens — Client-Side PII Detection & Sanitization Engine
 * 
 * Part of PrivacyLens (PS-004) by Team 05-HoneyPoters
 * Zero Cloud Leakage: Real-time local regex matching + DOM attribute inspection + 
 * algorithmic verification (Verhoeff for Aadhaar, Luhn for Credit/Debit Cards).
 */

// ============================================================================
// 1. Algorithmic Checksum Validators
// ============================================================================

/**
 * Verhoeff Algorithm Tables (UIDAI Aadhaar Checksum Standard)
 */
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

/**
 * Validates a number string using the Verhoeff algorithm (Aadhaar).
 * @param {string} str - Raw number string
 * @returns {boolean}
 */
export function validateVerhoeff(str) {
  const clean = String(str).replace(/\D/g, '');
  if (clean.length !== 12) return false;
  let c = 0;
  const reversed = clean.split('').reverse().map(Number);
  for (let i = 0; i < reversed.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][reversed[i]]];
  }
  return c === 0;
}

/**
 * Validates card numbers using the Luhn Algorithm (MOD 10)
 * @param {string} str - Card number string
 * @returns {boolean}
 */
export function validateLuhn(str) {
  const clean = String(str).replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// ============================================================================
// 2. Comprehensive PII Definitions & Pattern Matchers
// ============================================================================

export const PII_TYPES = {
  AADHAAR: 'AADHAAR',
  PAN: 'PAN',
  CARD_NUMBER: 'CARD_NUMBER',
  CVV: 'CVV',
  PHONE_NUMBER: 'PHONE_NUMBER',
  EMAIL: 'EMAIL',
  PASSWORD: 'PASSWORD',
  OTP: 'OTP',
  IP_ADDRESS: 'IP_ADDRESS',
  SHIPPING_ADDRESS: 'SHIPPING_ADDRESS',
  PRIVATE_CHAT_LOG: 'PRIVATE_CHAT_LOG',
  API_KEY: 'API_KEY',
  JWT_TOKEN: 'JWT_TOKEN',
  PASSPORT: 'PASSPORT',
  DRIVING_LICENSE: 'DRIVING_LICENSE'
};

export const SEVERITY = {
  CRITICAL: 'CRITICAL', // Immediate high-risk financial/identity secrets
  HIGH: 'HIGH',         // Identity numbers & direct contact
  MEDIUM: 'MEDIUM'      // General contact identifiers
};

/**
 * PII Rule Configurations with regex patterns, semantic replacement tokens,
 * severity classifications, and validator functions.
 * Ordered intentionally: Credentials & high-specificity patterns evaluated first.
 */
export const PII_RULES = [
  {
    type: PII_TYPES.API_KEY,
    label: 'API Key / Secret Token',
    severity: SEVERITY.CRITICAL,
    replacementToken: '[REDACTED: API_KEY]',
    // Matches Google/Gemini keys (AIza...), OpenAI keys (sk-...), AWS keys (AKIA...), GitHub tokens
    pattern: /\b(?:AIza[0-9A-Za-z\-_]{35}|sk-(?:proj-)?[a-zA-Z0-9_\-]{20,}|AKIA[0-9A-Z]{16}|(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36,})\b/g,
    validate: (match) => !match.startsWith('[REDACTED:')
  },
  {
    type: PII_TYPES.JWT_TOKEN,
    label: 'JWT / Bearer Auth Token',
    severity: SEVERITY.CRITICAL,
    replacementToken: '[REDACTED: AUTH_TOKEN]',
    pattern: /\beyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\b/g,
    validate: (match) => !match.startsWith('[REDACTED:')
  },
  {
    type: PII_TYPES.OTP,
    label: '6-Digit One-Time Password (OTP)',
    severity: SEVERITY.CRITICAL,
    replacementToken: '[REDACTED: OTP]',
    // Matches 6-digit OTPs in SMS / auth contexts e.g. OTP: 749201, verification code 492018
    pattern: /(?:(?:^|[^\w])(?:otp|one[- ]time[- ](?:code|password)|verification[- ]code|2fa[- ]code|security[- ]code)\s*[:=]?\s*["']?(\d{6})["']?|\b(?:your\s+(?:otp|verification\s+code)\s+is\s+)(\d{6})\b)/gi,
    captureGroupIndex: 1,
    validate: (match) => {
      if (!match) return false;
      const clean = match.replace(/\D/g, '');
      return clean.length === 6 && !match.startsWith('[REDACTED:');
    }
  },
  {
    type: PII_TYPES.CARD_NUMBER,
    label: 'Payment Card Number (Visa/MC/RuPay/Amex)',
    severity: SEVERITY.CRITICAL,
    replacementToken: '[REDACTED: CARD_NUMBER]',
    // Evaluated before Aadhaar so 16-digit cards (4x4) are not truncated into 12-digit Aadhaar
    pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b(?:\d{4}[-\s]?){2}\d{4}[-\s]?\d{3}\b|\b\d{13,19}\b/g,
    validate: (match) => {
      if (match.startsWith('[REDACTED:')) return false;
      const clean = match.replace(/\D/g, '');
      return validateLuhn(clean);
    }
  },
  {
    type: PII_TYPES.CVV,
    label: 'Card CVV / Security Code',
    severity: SEVERITY.CRITICAL,
    replacementToken: '[REDACTED: CVV]',
    pattern: /\b(?:cvv|cvc|security[- ]code)\s*[:=]?\s*(\d{3,4})\b/gi,
    captureGroupIndex: 1,
    validate: (match) => !match.startsWith('[REDACTED:')
  },
  {
    type: PII_TYPES.PASSWORD,
    label: 'Plaintext Password / Passcode',
    severity: SEVERITY.CRITICAL,
    replacementToken: '[REDACTED: PASSCODE]',
    // Supports quoted or unquoted password/pin/otp patterns
    pattern: /(?:password|passwd|pwd|passcode|secret|pin)\s*[:=]\s*(?:["']([^"']+)["']|([^\s"'`]+))/gi,
    captureGroupIndex: 1, // Will test group 1 or 2 in extraction
    validate: (match) => {
      if (!match) return false;
      const trimmed = match.trim();
      return !trimmed.startsWith('[REDACTED:');
    }
  },
  {
    type: PII_TYPES.IP_ADDRESS,
    label: 'IP Address (IPv4/IPv6)',
    severity: SEVERITY.HIGH,
    replacementToken: '[REDACTED: IP_ADDRESS]',
    // Matches IPv4 addresses (0.0.0.0 to 255.255.255.255) and standard IPv6 addresses
    pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\b|\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g,
    validate: (match) => {
      if (!match || match.startsWith('[REDACTED:')) return false;
      const parts = match.split('.');
      if (parts.length === 4) {
        return parts.every(p => {
          const n = Number(p);
          return !isNaN(n) && n >= 0 && n <= 255;
        });
      }
      return match.includes(':');
    }
  },
  {
    type: PII_TYPES.SHIPPING_ADDRESS,
    label: 'Shipping & Delivery Address',
    severity: SEVERITY.HIGH,
    replacementToken: '[REDACTED: SHIPPING_ADDRESS]',
    // Matches labeled addresses or multi-part street/city/state/PIN addresses
    pattern: /(?:(?:shipping|delivery|billing|home|office)?\s*address\s*[:=]\s*|\b(?:ship\s+to|deliver\s+to)\s*[:=]?\s*)([^\n\r,]+(?:,[^\n\r,]+){1,5}(?:[,\s]+\b\d{5,6}\b)?)|(?:\b(?:Flat|Apt|Apartment|Suite|Unit|House|Plot|H\.No\.?|#)\s*\d{1,5}[A-Za-z]?[\s,]+(?:[A-Za-z0-9\s,.-]+)(?:Street|St\.?|Road|Rd\.?|Avenue|Ave\.?|Lane|Ln\.?|Drive|Dr\.?|Boulevard|Blvd\.?|Nagar|Colony|Sector|Phase|Floor|Marg|Cross)[\s,]+(?:[A-Za-z\s,.-]+)(?:[A-Za-z\s]+)?(?:\b\d{5,6}\b|\b[A-Z]{2}\s+\d{5}\b))/gi,
    captureGroupIndex: 1,
    validate: (match) => {
      if (!match || match.startsWith('[REDACTED:')) return false;
      return match.trim().length >= 10;
    }
  },
  {
    type: PII_TYPES.AADHAAR,
    label: 'Indian Aadhaar Number (12 digits)',
    severity: SEVERITY.HIGH,
    replacementToken: '[REDACTED: AADHAAR]',
    // Standard Aadhaar: 12 digits, cannot start with 0 or 1, not followed by a 4th 4-digit block
    pattern: /\b([2-9]\d{3}[\s-]?\d{4}[\s-]?\d{4})\b(?!\s*[- ]?\d{4})/g,
    validate: (match) => {
      if (match.startsWith('[REDACTED:')) return false;
      const clean = match.replace(/\D/g, '');
      if (clean.length !== 12) return false;
      const hasAadhaarSpacing = /\b[2-9]\d{3}[\s-]\d{4}[\s-]\d{4}\b/.test(match);
      return hasAadhaarSpacing || validateVerhoeff(clean);
    }
  },
  {
    type: PII_TYPES.PAN,
    label: 'Indian Income Tax PAN',
    severity: SEVERITY.HIGH,
    replacementToken: '[REDACTED: PAN]',
    // 5 letters, 4 digits, 1 letter (case insensitive, accommodates real & mock hackathon test data)
    pattern: /\b([A-Z]{5}\d{4}[A-Z])\b/gi,
    validate: (match) => !match.startsWith('[REDACTED:')
  },
  {
    type: PII_TYPES.PRIVATE_CHAT_LOG,
    label: 'Private Chat Log / Confidential Inquiry',
    severity: SEVERITY.HIGH,
    replacementToken: '[REDACTED: PRIVATE_CHAT_LOG]',
    // Matches private customer conversation inquiries or transcript lines
    pattern: /(?:(?:\[?(?:Customer|User|Client|Patient|Caller)\]?\s*[:\-]\s*|\b(?:private\s+chat|customer\s+note|support\s+log|chat\s+transcript)\s*[:=]\s*)(["']?[^"'\n\r]+["']?))/gi,
    captureGroupIndex: 1,
    validate: (match) => {
      if (!match || match.startsWith('[REDACTED:')) return false;
      return match.trim().length >= 8;
    }
  },
  {
    type: PII_TYPES.PHONE_NUMBER,
    label: 'Phone / Mobile Number',
    severity: SEVERITY.MEDIUM,
    replacementToken: '[REDACTED: PHONE_NUMBER]',
    // Starts with +91, 91, 0, or direct 10-digit starting with 6-9, or US/Intl format (+1 (555) 234-5678)
    pattern: /(?:(?:\+91|91|0)[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b|(?:\+?1[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
    validate: (match) => {
      if (match.startsWith('[REDACTED:')) return false;
      const clean = match.replace(/\D/g, '');
      return clean.length === 10 || clean.length === 11 || (clean.length === 12 && clean.startsWith('91'));
    }
  },
  {
    type: PII_TYPES.EMAIL,
    label: 'Email Address',
    severity: SEVERITY.MEDIUM,
    replacementToken: '[REDACTED: EMAIL]',
    pattern: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g,
    validate: (match) => !match.startsWith('[REDACTED:')
  },
  {
    type: PII_TYPES.PASSPORT,
    label: 'Indian Passport Number',
    severity: SEVERITY.HIGH,
    replacementToken: '[REDACTED: PASSPORT]',
    pattern: /\b[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]\b/g,
    validate: (match) => !match.startsWith('[REDACTED:')
  },
  {
    type: PII_TYPES.DRIVING_LICENSE,
    label: 'Indian Driving License',
    severity: SEVERITY.HIGH,
    replacementToken: '[REDACTED: DRIVING_LICENSE]',
    pattern: /\b[A-Z]{2}[0-9]{2}[-\s]?[0-9]{11}\b/gi,
    validate: (match) => !match.startsWith('[REDACTED:')
  }
];

// ============================================================================
// 3. Masking & Obfuscation Utilities
// ============================================================================

/**
 * Creates a human-friendly visual mask for security audit logs
 * (never exposes raw credentials, retains minimal context for debugging)
 * e.g., "9876543210" -> "98*****210", "user@test.com" -> "u***@test.com"
 * 
 * @param {string} value - Raw string
 * @param {string} type - PII type constant
 * @returns {string} Safe masked representation
 */
export function maskSensitiveValue(value, type) {
  if (!value) return '';
  const str = String(value).trim();
  
  switch (type) {
    case PII_TYPES.AADHAAR: {
      const clean = str.replace(/\D/g, '');
      if (clean.length >= 12) {
        return `XXXX-XXXX-${clean.slice(-4)}`;
      }
      return 'XXXX-XXXX-XXXX';
    }
    case PII_TYPES.PAN: {
      if (str.length >= 10) {
        return `${str.slice(0, 2)}*****${str.slice(-2)}`.toUpperCase();
      }
      return '*****';
    }
    case PII_TYPES.CARD_NUMBER: {
      const clean = str.replace(/\D/g, '');
      if (clean.length >= 4) {
        return `****-****-****-${clean.slice(-4)}`;
      }
      return '****-****-****-****';
    }
    case PII_TYPES.EMAIL: {
      const [user, domain] = str.split('@');
      if (!domain) return '***@***';
      const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}*`;
      return `${maskedUser}@${domain}`;
    }
    case PII_TYPES.PHONE_NUMBER: {
      const clean = str.replace(/\D/g, '');
      if (clean.length >= 4) {
        return `+91 ${clean.slice(-10, -7)}****${clean.slice(-2)}`;
      }
      return '+91 **********';
    }
    case PII_TYPES.OTP: {
      return `***${str.slice(-2)}`;
    }
    case PII_TYPES.IP_ADDRESS: {
      const parts = str.split('.');
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.*.*`;
      }
      return `${str.slice(0, 4)}:****:****`;
    }
    case PII_TYPES.SHIPPING_ADDRESS: {
      const parts = str.split(',');
      if (parts.length >= 2) {
        return `${parts[0].trim()}, ***, ${parts[parts.length - 1].trim()}`;
      }
      return `${str.slice(0, 10)}... [ADDRESS]`;
    }
    case PII_TYPES.PRIVATE_CHAT_LOG: {
      return `[Private conversation: ${str.slice(0, 12)}... (${str.length} chars)]`;
    }
    default:
      if (str.length <= 4) return '****';
      return `${str.slice(0, 2)}****${str.slice(-2)}`;
  }
}

// ============================================================================
// 4. Core Text Scanning & Sanitization Engine
// ============================================================================

/**
 * Scans text and extracts all detected PII threats without modifying the input.
 * 
 * @param {string} text - Raw input string to inspect
 * @param {Object} [options={}] - Custom options
 * @param {string[]} [options.enabledTypes] - Subset of PII types to inspect
 * @returns {Array<Object>} List of detected threats
 */
export function scanText(text, options = {}) {
  if (typeof text !== 'string' || !text.trim()) {
    return [];
  }

  const enabledRules = options.enabledTypes
    ? PII_RULES.filter(rule => options.enabledTypes.includes(rule.type))
    : PII_RULES;

  const threats = [];

  for (const rule of enabledRules) {
    // Reset regex index
    rule.pattern.lastIndex = 0;
    let match;

    while ((match = rule.pattern.exec(text)) !== null) {
      let rawMatch = match[0];
      let matchIndex = match.index;

      if (rule.captureGroupIndex !== undefined) {
        // Support optional capture groups (e.g., quotes vs unquoted)
        const g1 = match[1];
        const g2 = match[2];
        const captured = (g1 !== undefined && g1 !== '') ? g1 : g2;
        if (captured) {
          rawMatch = captured;
          matchIndex = match.index + match[0].indexOf(captured);
        }
      }

      if (!rawMatch || typeof rawMatch !== 'string') continue;

      // Skip semantic tokens already redacted
      if (rawMatch.startsWith('[REDACTED:')) continue;

      // Run custom algorithmic verification if defined (e.g. Luhn/Verhoeff)
      if (rule.validate && !rule.validate(rawMatch)) {
        continue;
      }

      threats.push({
        id: `threat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type: rule.type,
        label: rule.label,
        severity: rule.severity,
        rawMatch,
        maskedValue: maskSensitiveValue(rawMatch, rule.type),
        replacementToken: rule.replacementToken,
        index: matchIndex,
        endIndex: matchIndex + rawMatch.length,
        length: rawMatch.length
      });
    }
  }

  // Sort threats by start index ascending; if same start, prioritize longer match
  return threats.sort((a, b) => {
    if (a.index !== b.index) return a.index - b.index;
    return b.length - a.length;
  });
}

/**
 * Sanitizes input text by replacing all sensitive PII with semantic tokens.
 * Performs post-sanitization leak verification.
 * 
 * @param {string} text - Raw text to redact
 * @param {Object} [options={}] - Custom options
 * @returns {{
 *   isSafe: boolean,
 *   originalText: string,
 *   sanitizedText: string,
 *   threats: Array<Object>,
 *   stats: Object,
 *   timestamp: string
 * }}
 */
export function sanitizeText(text, options = {}) {
  const timestamp = new Date().toISOString();

  if (typeof text !== 'string') {
    return {
      isSafe: true,
      originalText: '',
      sanitizedText: '',
      threats: [],
      stats: { totalThreats: 0, criticalCount: 0, highCount: 0, mediumCount: 0 },
      timestamp
    };
  }

  const threats = scanText(text, options);

  if (threats.length === 0) {
    return {
      isSafe: true,
      originalText: text,
      sanitizedText: text,
      threats: [],
      stats: { totalThreats: 0, criticalCount: 0, highCount: 0, mediumCount: 0 },
      timestamp
    };
  }

  // Deduplicate overlapping threats (preserve earlier / higher severity match)
  const nonOverlappingThreats = [];
  let lastEnd = -1;

  for (const threat of threats) {
    if (threat.index >= lastEnd) {
      nonOverlappingThreats.push(threat);
      lastEnd = threat.endIndex;
    }
  }

  // Build sanitized text from back to front to preserve string indices
  let sanitized = text;
  for (let i = nonOverlappingThreats.length - 1; i >= 0; i--) {
    const threat = nonOverlappingThreats[i];
    const before = sanitized.slice(0, threat.index);
    const after = sanitized.slice(threat.endIndex);
    sanitized = before + threat.replacementToken + after;
  }

  // POST-SANITIZATION VERIFICATION (Fail-Closed Check)
  // Ensure the sanitized text does not contain residual PII
  const residualThreats = scanText(sanitized, options);
  const isSafe = residualThreats.length === 0;

  // Aggregate telemetry stats
  const stats = {
    totalThreats: nonOverlappingThreats.length,
    criticalCount: nonOverlappingThreats.filter(t => t.severity === SEVERITY.CRITICAL).length,
    highCount: nonOverlappingThreats.filter(t => t.severity === SEVERITY.HIGH).length,
    mediumCount: nonOverlappingThreats.filter(t => t.severity === SEVERITY.MEDIUM).length,
    threatTypes: nonOverlappingThreats.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {})
  };

  return {
    isSafe,
    originalText: text,
    sanitizedText: sanitized,
    threats: nonOverlappingThreats,
    residualThreats,
    stats,
    timestamp
  };
}

// ============================================================================
// 5. DOM Inspection & Sensitive Input Field Detection
// ============================================================================

const SENSITIVE_ATTR_KEYWORDS = [
  'password', 'passwd', 'pwd', 'passcode',
  'secret', 'token', 'auth', 'cvv', 'cvc',
  'pin', 'otp', 'aadhaar', 'aadhar', 'pan',
  'ssn', 'card', 'credit', 'debit', 'cc-number',
  'private', 'apikey', 'api-key', 'address',
  'shipping', 'ip-address', 'ipaddress'
];

/**
 * Inspects a DOM tree or current document to identify sensitive input elements
 * and extract their exact screen coordinates for canvas visual blackouts.
 * 
 * @param {Document|HTMLElement} [rootNode] - Root DOM node to inspect (defaults to window.document)
 * @returns {{
 *   hasSensitiveFields: boolean,
 *   sensitiveElements: Array<Object>,
 *   redactionBoxes: Array<Object>
 * }}
 */
export function scanDOM(rootNode) {
  const root = rootNode || (typeof document !== 'undefined' ? document : null);
  if (!root || typeof root.querySelectorAll !== 'function') {
    return { hasSensitiveFields: false, sensitiveElements: [], redactionBoxes: [] };
  }
  const elements = root.querySelectorAll('input, textarea, select, [contenteditable="true"]');
  const sensitiveElements = [];
  const redactionBoxes = [];

  elements.forEach((el, index) => {
    let isSensitive = false;
    let reason = '';
    let category = PII_TYPES.PASSWORD;

    // 1. Check input type
    const type = (el.getAttribute('type') || '').toLowerCase();
    if (type === 'password') {
      isSensitive = true;
      reason = 'input[type="password"]';
      category = PII_TYPES.PASSWORD;
    }

    // 2. Check autocomplete attribute
    const autocomplete = (el.getAttribute('autocomplete') || '').toLowerCase();
    if (autocomplete.includes('password') || autocomplete.includes('current-password') || autocomplete.includes('new-password')) {
      isSensitive = true;
      reason = `autocomplete="${autocomplete}"`;
      category = PII_TYPES.PASSWORD;
    } else if (autocomplete.includes('cc-') || autocomplete.includes('card')) {
      isSensitive = true;
      reason = `autocomplete="${autocomplete}"`;
      category = PII_TYPES.CARD_NUMBER;
    } else if (autocomplete.includes('one-time-code')) {
      isSensitive = true;
      reason = `autocomplete="${autocomplete}"`;
      category = PII_TYPES.CVV;
    }

    // 3. Check element attributes (id, name, class, placeholder, aria-label, data-*)
    if (!isSensitive) {
      const attributesToCheck = [
        el.getAttribute('id') || '',
        el.getAttribute('name') || '',
        el.getAttribute('placeholder') || '',
        el.getAttribute('aria-label') || '',
        el.getAttribute('className') || el.className || '',
        el.getAttribute('data-field') || '',
        el.getAttribute('data-type') || ''
      ].map(s => String(s).toLowerCase());

      for (const attrValue of attributesToCheck) {
        for (const keyword of SENSITIVE_ATTR_KEYWORDS) {
          if (attrValue.includes(keyword)) {
            isSensitive = true;
            reason = `attribute matching keyword "${keyword}"`;
            if (keyword.includes('pan')) category = PII_TYPES.PAN;
            else if (keyword.includes('aadhaar') || keyword.includes('aadhar')) category = PII_TYPES.AADHAAR;
            else if (keyword.includes('card') || keyword.includes('cvv')) category = PII_TYPES.CARD_NUMBER;
            else if (keyword.includes('address') || keyword.includes('shipping')) category = PII_TYPES.SHIPPING_ADDRESS;
            else if (keyword.includes('otp')) category = PII_TYPES.OTP;
            else if (keyword.includes('ip')) category = PII_TYPES.IP_ADDRESS;
            else category = PII_TYPES.PASSWORD;
            break;
          }
        }
        if (isSensitive) break;
      }
    }

    if (isSensitive) {
      const rect = el.getBoundingClientRect();
      // Only include elements that are rendered and visible on screen
      if (rect.width > 0 && rect.height > 0) {
        const item = {
          elementId: el.id || `field_${index}`,
          selector: el.id ? `#${el.id}` : `${(el.tagName || 'input').toLowerCase()}[name="${el.name || ''}"]`,
          type: category,
          reason,
          boundingClientRect: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom
          }
        };

        sensitiveElements.push(item);

        // Pre-formatted bounding box ready for imageMasker.js
        redactionBoxes.push({
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          label: `[REDACTED: ${category}]`,
          type: category
        });
      }
    }
  });

  return {
    hasSensitiveFields: sensitiveElements.length > 0,
    sensitiveElements,
    redactionBoxes
  };
}

/**
 * Direct bridge helper: Extracts DOM redaction boxes formatted directly for imageMasker.
 * @param {Document|HTMLElement} [rootNode]
 * @returns {Array<Object>}
 */
export function getDOMRedactionBoxes(rootNode) {
  return scanDOM(rootNode).redactionBoxes;
}
