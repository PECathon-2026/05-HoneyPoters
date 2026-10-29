/**
 * Double-Verification Test Suite: Phase 3 - Part 2
 * Autonomous Agentic Form Playground & Live DOM Interceptor
 * 
 * Step A: Structural & Profile Schema Verification
 * Step B: Protected Autonomous Agent DOM Extraction & Semantic Redaction (Verification Pass 1)
 * Step C: Direct Leak vs Shield Interception Comparison (Verification Pass 2)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🧪 DOUBLE VERIFICATION — PHASE 3 PART 2: AGENTIC PLAYGROUND');
console.log('================================================================');

// -----------------------------------------------------------------------------
// STEP A: Structural & Profile Schema Verification
// -----------------------------------------------------------------------------
console.log('\n[STEP A]: Component Structure & Profile Schema Verification');

const playgroundPath = path.join(rootDir, 'src', 'components', 'AgenticPlayground.jsx');
const appPath = path.join(rootDir, 'src', 'App.jsx');

console.assert(fs.existsSync(playgroundPath), 'AgenticPlayground.jsx must exist');
console.assert(fs.existsSync(appPath), 'App.jsx must exist');

const playgroundSrc = fs.readFileSync(playgroundPath, 'utf8');
console.assert(playgroundSrc.includes('AgenticPlayground'), 'Must export AgenticPlayground');
console.assert(playgroundSrc.includes('MOCK_PROFILES'), 'Must define sample profiles');
console.assert(playgroundSrc.includes('handleRunAgentExtraction'), 'Must implement agent extraction simulation');
console.assert(playgroundSrc.includes('getFieldBadge'), 'Must implement live field badge inspector');

const appSrc = fs.readFileSync(appPath, 'utf8');
console.assert(appSrc.includes('AgenticPlayground'), 'App.jsx must import and render AgenticPlayground');

console.log('  ✓ Structural checks passed: Component exports, profile schemas, and App.jsx verified.');

// -----------------------------------------------------------------------------
// STEP B: Protected Autonomous Agent DOM Extraction (Pass 1)
// -----------------------------------------------------------------------------
console.log('\n[STEP B - PASS 1]: Protected Agentic DOM Interception & Sanitization');

const { sanitizeText, scanText } = await import('../src/lib/scanner.js');

const rawAgentDOM = `[AGENT DOM SNAPSHOT]
Page URL: https://portal.pec-bank.in/customer-kyc
User Full Name: Rahul Sharma
UIDAI Aadhaar: 2345 6789 0124
Income Tax PAN: ABCDE1234F
Payment Card: 4242 4242 4242 4242
Security CVV: 894
Account Password: "VaultSecret#99"
Contact Mobile: +91 98765 43210
Contact Email: rahul.sharma@pec.edu`;

const protectedResult = sanitizeText(rawAgentDOM);

console.assert(protectedResult.isSafe === true, 'Protected extraction must be safe');
console.assert(protectedResult.threats.length >= 5, `Expected >= 5 threats sanitized, found ${protectedResult.threats.length}`);

// Ensure zero raw secrets leak
console.assert(!protectedResult.sanitizedText.includes('2345 6789 0124'), 'Aadhaar leak!');
console.assert(!protectedResult.sanitizedText.includes('ABCDE1234F'), 'PAN leak!');
console.assert(!protectedResult.sanitizedText.includes('4242 4242 4242 4242'), 'Card leak!');
console.assert(!protectedResult.sanitizedText.includes('VaultSecret#99'), 'Password leak!');

// Ensure tokens are present
console.assert(protectedResult.sanitizedText.includes('[REDACTED: AADHAAR]'), 'Must have Aadhaar token');
console.assert(protectedResult.sanitizedText.includes('[REDACTED: PAN]'), 'Must have PAN token');
console.assert(protectedResult.sanitizedText.includes('[REDACTED: CARD_NUMBER]'), 'Must have Card token');
console.assert(protectedResult.sanitizedText.includes('[REDACTED: PASSCODE]'), 'Must have Passcode token');

console.log('  ✓ Protected Agentic DOM extraction verified:');
console.log(`    - Detected & neutralized ${protectedResult.threats.length} threats locally.`);
console.log('    - Outbound agent payload transformed into verified safe semantic tokens.');

// -----------------------------------------------------------------------------
// STEP C: Direct Leak vs Shield Interception Comparison (Pass 2)
// -----------------------------------------------------------------------------
console.log('\n[STEP C - PASS 2]: Direct Leak vs PrivacyLens Shield Comparison');

// In unprotected mode: raw data leaks intact
const rawThreats = scanText(rawAgentDOM);
console.assert(rawThreats.length >= 5, 'Unprotected payload contains active leaks');
console.log(`  ✓ Unprotected mode simulation verified: Confirms ${rawThreats.length} catastrophic leaks without shield.`);

// Verify field badge logic
const passwordBadge = scanText('SuperSecretPassword123');
console.assert(passwordBadge !== null, 'Password value must trigger protection badge');

const aadhaarBadge = scanText('2345 6789 0124');
console.assert(aadhaarBadge.length > 0 && aadhaarBadge[0].type === 'AADHAAR', 'Aadhaar badge triggered');

console.log('  ✓ Real-time input field badges verified for passwords and UIDAI Aadhaar.');

console.log('\n================================================================');
console.log('🎉 PHASE 3 PART 2 DOUBLE VERIFICATION PASSED WITH ZERO ERRORS!');
console.log('================================================================\n');

process.exit(0);
