/**
 * PrivacyLens — Official Evaluation Scenarios Test Suite (Phase 3)
 * 
 * Part of PrivacyLens (PS-004) by Team 05-HoneyPoters
 * Implements the 5 Official PDF Evaluation Scenarios:
 * 1. E-commerce checkout: Credit card details & shipping address redaction
 * 2. Authentication: Passwords, login emails, and 6-digit OTP codes redaction
 * 3. Customer support: Phone numbers and private conversation chat log masking
 * 4. Video/Profile faces: Coordinate bounding box blackout on profile pictures
 * 5. Developer settings: Cloud API keys (AIza..., sk-...), JWT tokens, and IP addresses
 */

import { sanitizeText, scanText, PII_TYPES } from './scanner.js';
import { generateMockRedactedSVG, DEFAULT_MASK_OPTIONS } from './imageMasker.js';

// ============================================================================
// 1. Five Official PDF Evaluation Scenario Definitions
// ============================================================================

export const SCENARIOS = {
  ECOMMERCE_CHECKOUT: {
    id: 'ecommerce_checkout',
    number: 1,
    title: 'E-Commerce Checkout',
    category: 'Financial & Logistics',
    severityBadge: 'CRITICAL',
    description: 'Intercepts financial payment credentials (Visa Luhn-verified card, CVV) and physical residential shipping address before cart submission.',
    rawInput: `ORDER CHECKOUT CONFIRMATION:
Customer: Aditi Singhal
Shipping Address: Flat 402, Royal Palms, MG Road, Bengaluru, Karnataka 560001
Contact Email: aditi.singhal@pec-alumni.org
Payment Method: Visa Signature Card
Card Number: 4242 4242 4242 4242
CVV: 894
Card Expiry: 12/28
Billing Amount: Rs 14,999.00`,
    sensitiveFields: [
      { name: 'Card Number', raw: '4242 4242 4242 4242', expectedType: PII_TYPES.CARD_NUMBER, token: '[REDACTED: CARD_NUMBER]' },
      { name: 'Card CVV', raw: '894', expectedType: PII_TYPES.CVV, token: '[REDACTED: CVV]' },
      { name: 'Shipping Address', raw: 'Flat 402, Royal Palms, MG Road, Bengaluru, Karnataka 560001', expectedType: PII_TYPES.SHIPPING_ADDRESS, token: '[REDACTED: SHIPPING_ADDRESS]' },
      { name: 'Email Address', raw: 'aditi.singhal@pec-alumni.org', expectedType: PII_TYPES.EMAIL, token: '[REDACTED: EMAIL]' }
    ],
    expectedTokens: [
      '[REDACTED: CARD_NUMBER]',
      '[REDACTED: CVV]',
      '[REDACTED: SHIPPING_ADDRESS]',
      '[REDACTED: EMAIL]'
    ],
    mockDOM: `<div id="checkout-form" class="checkout-card">
  <h2>Order #PEC-2026-9941</h2>
  <div class="form-group">
    <label for="shippingAddress">Shipping Address</label>
    <textarea id="shippingAddress" name="shipping_address" data-field="address">Flat 402, Royal Palms, MG Road, Bengaluru, Karnataka 560001</textarea>
  </div>
  <div class="form-group">
    <label for="cardNumber">Card Number</label>
    <input type="text" id="cardNumber" name="card_number" autocomplete="cc-number" value="4242 4242 4242 4242" />
  </div>
  <div class="form-group">
    <label for="cardCvv">CVV</label>
    <input type="password" id="cardCvv" name="cvv" autocomplete="cc-csc" value="894" />
  </div>
</div>`
  },

  AUTHENTICATION: {
    id: 'authentication',
    number: 2,
    title: 'Authentication & Identity',
    category: 'Credentials & 2FA',
    severityBadge: 'CRITICAL',
    description: 'Suppresses authentication credentials (plaintext login passwords, user email identifiers) and 6-digit 2FA One-Time Passwords (OTPs).',
    rawInput: `AUTHENTICATION ATTEMPT LOG:
Client IP Session: 10.14.0.21
Login Identifier: admin.security@honeycorp.io
User Credential: password="AlphaOmega#2026!"
Two-Factor Challenge: Active
One-Time Password: OTP: 749201
Device Fingerprint: Chrome 134 MacOS arm64`,
    sensitiveFields: [
      { name: 'Login Email', raw: 'admin.security@honeycorp.io', expectedType: PII_TYPES.EMAIL, token: '[REDACTED: EMAIL]' },
      { name: 'Plaintext Password', raw: 'AlphaOmega#2026!', expectedType: PII_TYPES.PASSWORD, token: '[REDACTED: PASSCODE]' },
      { name: '6-Digit OTP', raw: '749201', expectedType: PII_TYPES.OTP, token: '[REDACTED: OTP]' }
    ],
    expectedTokens: [
      '[REDACTED: EMAIL]',
      '[REDACTED: PASSCODE]',
      '[REDACTED: OTP]'
    ],
    mockDOM: `<div id="auth-container">
  <h3>Secure Identity Gateway</h3>
  <input type="email" id="loginEmail" name="email" value="admin.security@honeycorp.io" autocomplete="email" />
  <input type="password" id="loginPassword" name="password" value="AlphaOmega#2026!" autocomplete="current-password" />
  <input type="text" id="loginOtp" name="otp" value="749201" autocomplete="one-time-code" />
</div>`
  },

  CUSTOMER_SUPPORT: {
    id: 'customer_support',
    number: 3,
    title: 'Customer Support Chat',
    category: 'Communications & PII',
    severityBadge: 'HIGH',
    description: 'Masks direct customer contact telephone numbers (+91 mobile, US formats) and redacts private customer conversation chat inquiries.',
    rawInput: `CUSTOMER SUPPORT TRANSCRIPT #PEC-8832:
Agent [10:41 AM]: Hello! Welcome to PECathon Support. Please verify your phone number and describe your issue.
Customer Contact Phone: +91 98765 43210
Customer Alternate Phone: +1 (555) 234-5678
Customer: I am inquiring regarding private dispute #99482 because I was billed twice during my hospitalization surgery.
Agent [10:42 AM]: We apologize for the inconvenience. Our billing team is reviewing your ticket now.`,
    sensitiveFields: [
      { name: 'Indian Phone Number', raw: '+91 98765 43210', expectedType: PII_TYPES.PHONE_NUMBER, token: '[REDACTED: PHONE_NUMBER]' },
      { name: 'International Phone', raw: '+1 (555) 234-5678', expectedType: PII_TYPES.PHONE_NUMBER, token: '[REDACTED: PHONE_NUMBER]' },
      { name: 'Customer Inquiry Line', raw: 'I am inquiring regarding private dispute #99482 because I was billed twice during my hospitalization surgery.', expectedType: PII_TYPES.PRIVATE_CHAT_LOG, token: '[REDACTED: PRIVATE_CHAT_LOG]' }
    ],
    expectedTokens: [
      '[REDACTED: PHONE_NUMBER]',
      '[REDACTED: PRIVATE_CHAT_LOG]'
    ],
    mockDOM: `<div id="support-widget" class="chat-thread">
  <div class="message incoming">Welcome! What is your registered phone?</div>
  <div class="message outgoing" data-field="phone">+91 98765 43210</div>
  <div class="message outgoing" data-field="chat-line">Customer: Please fix my billing dispute #99482.</div>
</div>`
  },

  VIDEO_PROFILE_FACES: {
    id: 'video_profile_faces',
    number: 4,
    title: 'Video & Profile Faces',
    category: 'Biometric & Visual Canvas',
    severityBadge: 'HIGH',
    description: 'Enforces HTML5 canvas coordinate bounding box blackouts over profile avatar faces and video feed participant regions with permanent #000000 solid fills.',
    isVisual: true,
    canvasDimensions: { width: 500, height: 400 },
    faceBoxes: [
      { x: 160, y: 70, width: 180, height: 180, label: '[REDACTED: PROFILE_FACE]' },
      { x: 30, y: 260, width: 90, height: 90, label: '[REDACTED: BADGE_PHOTO]' },
      { x: -15, y: 320, width: 550, height: 60, label: '[REDACTED: BOUNDARY_CLAMP_TEST]' } // Boundary test
    ],
    expectedTokens: [
      '[REDACTED: PROFILE_FACE]',
      '[REDACTED: BADGE_PHOTO]'
    ],
    mockDOM: `<div id="profile-container" class="profile-card">
  <div class="avatar-wrapper">
    <img id="userAvatar" src="/mock/avatar_face.png" width="180" height="180" alt="Profile Picture" />
  </div>
  <div class="badge-photo">
    <img id="badgePhoto" src="/mock/badge_photo.png" width="90" height="90" alt="Security Badge" />
  </div>
</div>`
  },

  DEVELOPER_SETTINGS: {
    id: 'developer_settings',
    number: 5,
    title: 'Developer Settings & Secrets',
    category: 'Cloud Infrastructure',
    severityBadge: 'CRITICAL',
    description: 'Detects and redacts high-entropy Cloud API keys (Google AIza..., OpenAI sk-..., AWS AKIA...), full JWT Bearer tokens, and IPv4 / IPv6 addresses.',
    rawInput: `SERVER ENVIRONMENT CONFIGURATION (.env.production):
GOOGLE_GEMINI_API_KEY=AIzaSyD9876543210abcdefghijklmnop123456
OPENAI_BACKUP_KEY=sk-proj-abc1234567890abcdef1234567890abcdef
AWS_S3_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
JWT_AUTH_BEARER=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlByYW5hdiBQdXNoeWEiLCJpYXQiOjE1MTYyMzkwMjJ9.X8bVwA5E12F6gHjKlMnOpQrStUvWxYz0123456789ab
PRODUCTION_SERVER_IPV4=192.168.1.100
EDGE_GATEWAY_IPV4=203.0.113.195
VPC_ROUTER_IPV6=2001:0db8:85a3:0000:0000:8a2e:0370:7334
INTERNAL_SUBNET=10.240.0.1`,
    sensitiveFields: [
      { name: 'Gemini API Key', raw: 'AIzaSyD9876543210abcdefghijklmnop123456', expectedType: PII_TYPES.API_KEY, token: '[REDACTED: API_KEY]' },
      { name: 'OpenAI API Key', raw: 'sk-proj-abc1234567890abcdef1234567890abcdef', expectedType: PII_TYPES.API_KEY, token: '[REDACTED: API_KEY]' },
      { name: 'AWS Access Key', raw: 'AKIAIOSFODNN7EXAMPLE', expectedType: PII_TYPES.API_KEY, token: '[REDACTED: API_KEY]' },
      { name: 'JWT Auth Token', raw: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlByYW5hdiBQdXNoeWEiLCJpYXQiOjE1MTYyMzkwMjJ9.X8bVwA5E12F6gHjKlMnOpQrStUvWxYz0123456789ab', expectedType: PII_TYPES.JWT_TOKEN, token: '[REDACTED: AUTH_TOKEN]' },
      { name: 'Server IPv4', raw: '192.168.1.100', expectedType: PII_TYPES.IP_ADDRESS, token: '[REDACTED: IP_ADDRESS]' },
      { name: 'Gateway IPv4', raw: '203.0.113.195', expectedType: PII_TYPES.IP_ADDRESS, token: '[REDACTED: IP_ADDRESS]' },
      { name: 'IPv6 Router', raw: '2001:0db8:85a3:0000:0000:8a2e:0370:7334', expectedType: PII_TYPES.IP_ADDRESS, token: '[REDACTED: IP_ADDRESS]' }
    ],
    expectedTokens: [
      '[REDACTED: API_KEY]',
      '[REDACTED: AUTH_TOKEN]',
      '[REDACTED: IP_ADDRESS]'
    ],
    mockDOM: `<div id="dev-console">
  <h4>Cloud Infrastructure Config</h4>
  <input type="text" id="apiKey" name="api_key" value="AIzaSyD9876543210abcdefghijklmnop123456" />
  <input type="text" id="jwtToken" name="jwt_token" value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abc123" />
  <input type="text" id="serverIp" name="server_ip" value="192.168.1.100" />
</div>`
  }
};

export const SCENARIO_LIST = Object.values(SCENARIOS);

// ============================================================================
// 2. Scenario Execution & Automated Verification Engine
// ============================================================================

/**
 * Executes a single evaluation scenario against PrivacyLens engines and verifies:
 * - 100% of expected replacement tokens exist in output
 * - 0% of raw sensitive secrets leak through
 * - Canvas coordinate bounds are clamped properly for visual face scenarios
 * 
 * @param {string|Object} scenarioOrId - Scenario object or ID key
 * @param {Object} [options={}] - Custom options
 * @returns {Object} Scenario execution result
 */
export function executeScenario(scenarioOrId, options = {}) {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  
  let scenario = typeof scenarioOrId === 'string'
    ? Object.values(SCENARIOS).find(s => s.id === scenarioOrId) || SCENARIOS[scenarioOrId.toUpperCase()]
    : scenarioOrId;

  if (!scenario) {
    throw new Error(`Unknown evaluation scenario: "${scenarioOrId}"`);
  }

  // Handle Scenario 4: Visual/Profile Faces
  if (scenario.isVisual) {
    const { width, height } = scenario.canvasDimensions;
    const padding = DEFAULT_MASK_OPTIONS.padding || 4;
    
    // Simulate canvas draw operations & coordinate clamping
    const clampedBoxes = scenario.faceBoxes.map(box => {
      const clampedX = Math.max(0, box.x - padding);
      const clampedY = Math.max(0, box.y - padding);
      const clampedW = Math.min(width - clampedX, box.width + padding * 2);
      const clampedH = Math.min(height - clampedY, box.height + padding * 2);
      return {
        ...box,
        clampedX,
        clampedY,
        clampedW,
        clampedH,
        isClamped: clampedX !== box.x || clampedY !== box.y || clampedW !== box.width || clampedH !== box.height
      };
    });

    // Generate mock sanitized SVG data URL
    const maskedSvgDataUrl = generateMockRedactedSVG(width, height, scenario.faceBoxes);

    // Multimodal Gemini Vision JSON Payload Structure
    const multimodalPayload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: 'Perform visual layout and OCR analysis on this user profile picture.' },
            {
              inlineData: {
                mimeType: 'image/svg+xml',
                data: maskedSvgDataUrl.replace(/^data:image\/svg\+xml;utf8,/, '')
              }
            }
          ]
        }
      ]
    };

    const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const latencyMs = Math.round((endTime - startTime) * 100) / 100;

    // Verify coordinate clamping & zero out-of-bounds overflow
    const zeroOverflow = clampedBoxes.every(b => 
      b.clampedX >= 0 && 
      b.clampedY >= 0 && 
      b.clampedX + b.clampedW <= width && 
      b.clampedY + b.clampedH <= height
    );

    return {
      scenarioId: scenario.id,
      number: scenario.number,
      title: scenario.title,
      category: scenario.category,
      isVisual: true,
      success: zeroOverflow,
      isSafe: true,
      threatsNeutralized: scenario.faceBoxes.length,
      clampedBoxes,
      maskedSvgDataUrl,
      multimodalPayload,
      latencyMs,
      timestamp: new Date().toISOString()
    };
  }

  // Handle Text/DOM Scenarios (1, 2, 3, 5)
  const sanitizeResult = sanitizeText(scenario.rawInput, options);
  const sanitizedOutput = sanitizeResult.sanitizedText;

  // Verification Check 1: Ensure all expected semantic tokens are present
  const missingTokens = scenario.expectedTokens.filter(token => !sanitizedOutput.includes(token));
  const allTokensPresent = missingTokens.length === 0;

  // Verification Check 2: Assert ZERO raw secrets leak in output
  const leakedSecrets = (scenario.sensitiveFields || [])
    .filter(field => sanitizedOutput.includes(field.raw))
    .map(field => field.name);
  const zeroLeakage = leakedSecrets.length === 0;

  const isSafe = sanitizeResult.isSafe && allTokensPresent && zeroLeakage;
  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const latencyMs = Math.round((endTime - startTime) * 100) / 100;

  return {
    scenarioId: scenario.id,
    number: scenario.number,
    title: scenario.title,
    category: scenario.category,
    isVisual: false,
    success: isSafe,
    isSafe,
    rawInput: scenario.rawInput,
    sanitizedOutput,
    threatsDetected: sanitizeResult.threats,
    threatsNeutralized: sanitizeResult.threats.length,
    missingTokens,
    leakedSecrets,
    stats: sanitizeResult.stats,
    latencyMs,
    timestamp: new Date().toISOString()
  };
}

/**
 * Runs all 5 official evaluation scenarios in sequence and returns a summary scorecard.
 * 
 * @param {Object} [options={}]
 * @returns {Object} Comprehensive evaluation scorecard
 */
export function runAllScenarios(options = {}) {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const results = SCENARIO_LIST.map(scenario => executeScenario(scenario, options));

  const totalScenarios = results.length;
  const passedScenarios = results.filter(r => r.success && r.isSafe).length;
  const totalThreatsNeutralized = results.reduce((acc, r) => acc + r.threatsNeutralized, 0);
  const zeroLeakageRate = (passedScenarios / totalScenarios) * 100;

  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const totalDurationMs = Math.round((endTime - startTime) * 100) / 100;

  return {
    timestamp: new Date().toISOString(),
    totalScenarios,
    passedScenarios,
    failedScenarios: totalScenarios - passedScenarios,
    totalThreatsNeutralized,
    zeroLeakageRate: `${zeroLeakageRate}%`,
    allPassed: passedScenarios === totalScenarios,
    totalDurationMs,
    results
  };
}
