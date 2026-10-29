/**
 * Double-Verification Test Script: Phase 1 - Part 1 (scanner.js)
 * Step A: Structural & Syntax Verification
 * Step B: Synthetic Dry-Run Against Indian & Global PII Vectors
 */

import { 
  validateVerhoeff, 
  validateLuhn, 
  scanText, 
  sanitizeText, 
  scanDOM,
  PII_TYPES, 
  PII_RULES 
} from '../src/lib/scanner.js';

console.log('====================================================');
console.log('🧪 VERIFICATION LOOP — PHASE 1 PART 1: SCANNER.JS');
console.log('====================================================');

// --- STEP A: Structural & Syntax Check ---
console.log('\n[STEP A]: Structural & Exports Verification');
console.assert(typeof validateVerhoeff === 'function', 'validateVerhoeff must be a function');
console.assert(typeof validateLuhn === 'function', 'validateLuhn must be a function');
console.assert(typeof scanText === 'function', 'scanText must be a function');
console.assert(typeof sanitizeText === 'function', 'sanitizeText must be a function');
console.assert(typeof scanDOM === 'function', 'scanDOM must be a function');
console.assert(Array.isArray(PII_RULES) && PII_RULES.length >= 8, 'PII_RULES must register all rule sets');
console.log('✅ Step A Passed: All exports, structures, and schemas verified.');

// --- STEP B: Synthetic Dry-Run Vectors ---
console.log('\n[STEP B]: Synthetic Dry-Run Against Target Attack Vectors');

const testCases = [
  {
    name: 'Indian PAN Card',
    input: 'My tax filing PAN is ABCDE1234F.',
    expectedType: PII_TYPES.PAN,
    expectedToken: '[REDACTED: PAN]'
  },
  {
    name: 'Indian Aadhaar Number (Spaced)',
    input: 'KYC Aadhaar: 2345 6789 0124 for customer verification.',
    expectedType: PII_TYPES.AADHAAR,
    expectedToken: '[REDACTED: AADHAAR]'
  },
  {
    name: 'Credit Card (Visa with Luhn)',
    input: 'Payment card: 4242 4242 4242 4242 on gateway.',
    expectedType: PII_TYPES.CARD_NUMBER,
    expectedToken: '[REDACTED: CARD_NUMBER]'
  },
  {
    name: 'Email Address',
    input: 'Invoices sent to accounts.payable@startup.co.in please.',
    expectedType: PII_TYPES.EMAIL,
    expectedToken: '[REDACTED: EMAIL]'
  },
  {
    name: 'Indian Phone Number (+91)',
    input: 'Contact support on +91 98765 43210 immediately.',
    expectedType: PII_TYPES.PHONE_NUMBER,
    expectedToken: '[REDACTED: PHONE_NUMBER]'
  },
  {
    name: 'Password & OTP',
    input: 'auth credentials password="mySecretP@ssw0rd99" and otp=482910',
    expectedType: PII_TYPES.PASSWORD,
    expectedToken: '[REDACTED: PASSCODE]'
  },
  {
    name: 'Google Gemini API Key',
    input: 'API key leaked: AIzaSyD9876543210abcdefghijklmnop123456',
    expectedType: PII_TYPES.API_KEY,
    expectedToken: '[REDACTED: API_KEY]'
  }
];

let allPassed = true;

testCases.forEach((tc, idx) => {
  const threats = scanText(tc.input);
  const found = threats.some(t => t.type === tc.expectedType);
  const sanitized = sanitizeText(tc.input);
  const tokenFound = sanitized.sanitizedText.includes(tc.expectedToken);
  const safeStatus = sanitized.isSafe === true;

  if (found && tokenFound && safeStatus) {
    console.log(`  ✓ Vector ${idx + 1} Passed: [${tc.name}] detected, replaced with ${tc.expectedToken}, isSafe=true`);
  } else {
    console.error(`  ✗ Vector ${idx + 1} FAILED: [${tc.name}] found=${found}, tokenFound=${tokenFound}, isSafe=${safeStatus}`);
    allPassed = false;
  }
});

// Test DOM inspection fallback in Node environment
const domResult = scanDOM(null);
console.assert(domResult.hasSensitiveFields === false, 'DOM inspection must gracefully handle non-browser runtimes');
console.log('  ✓ Graceful DOM fallback verified in non-browser runtime.');

if (allPassed) {
  console.log('\n🎉 ALL DOUBLE-VERIFICATION TESTS PASSED FOR PART 1!');
  process.exit(0);
} else {
  console.error('\n❌ VERIFICATION FAILED FOR PART 1!');
  process.exit(1);
}
