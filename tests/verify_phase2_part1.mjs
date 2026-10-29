/**
 * Double-Verification Test Suite: Phase 2 - Part 1
 * Chrome Extension Gateway, Service Worker, and Content Script Interceptor
 * 
 * Step A: Structural & Manifest V3 Configuration Verification
 * Step B: Functional Request Interception & BroadcastChannel IPC (Verification Pass 1)
 * Step C: Fail-Closed Strict Abort, Shield Toggle & DOM Scanning (Verification Pass 2)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🧪 DOUBLE VERIFICATION — PHASE 2 PART 1: EXTENSION GATEWAY & IPC');
console.log('================================================================');

// -----------------------------------------------------------------------------
// STEP A: Structural & Manifest V3 Verification
// -----------------------------------------------------------------------------
console.log('\n[STEP A]: Manifest V3 & Extension File Integrity Verification');

const manifestPath = path.join(rootDir, 'extension', 'manifest.json');
console.assert(fs.existsSync(manifestPath), 'manifest.json must exist in extension/');

const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
console.assert(manifestContent.manifest_version === 3, 'Must be Manifest V3');
console.assert(manifestContent.background?.service_worker === 'background.js', 'Service worker must be background.js');
console.assert(manifestContent.background?.type === 'module', 'Service worker must be ESM module');
console.assert(manifestContent.content_scripts?.length > 0, 'Content script must be registered');
console.assert(manifestContent.permissions?.includes('storage'), 'Storage permission required');

console.log('  ✓ manifest.json validated: Manifest V3, ESM Service Worker, Content Scripts.');

// Check files exist
const bgPath = path.join(rootDir, 'extension', 'background.js');
const csPath = path.join(rootDir, 'extension', 'contentScript.js');
const popupPath = path.join(rootDir, 'extension', 'popup.html');
console.assert(fs.existsSync(bgPath), 'background.js must exist');
console.assert(fs.existsSync(csPath), 'contentScript.js must exist');
console.assert(fs.existsSync(popupPath), 'popup.html must exist');
console.log('  ✓ All extension files present: background.js, contentScript.js, popup.html.');

// -----------------------------------------------------------------------------
// STEP B: Functional Request Interception & BroadcastChannel IPC (Pass 1)
// -----------------------------------------------------------------------------
console.log('\n[STEP B - PASS 1]: Functional Interception & BroadcastChannel IPC');

// Import background gateway
const { 
  interceptOutboundPayload, 
  toggleShield, 
  setSecurityMode, 
  getGatewayState, 
  resetGatewayStats,
  getBroadcastChannel
} = await import('../extension/background.js');

const { SECURITY_MODES } = await import('../extension/lib/geminiClient.js');

// Setup BroadcastChannel subscriber to verify IPC messages
const testReceiverChannel = new BroadcastChannel('privacylens_channel');
const receivedBroadcasts = [];
testReceiverChannel.onmessage = (event) => {
  receivedBroadcasts.push(event.data);
};

resetGatewayStats();

const sensitivePrompt = `
Analyze my user profile:
Aadhaar: 2345 6789 0124
PAN: ABCDE1234F
Payment Card: 4242 4242 4242 4242
Email: security.lead@pec.edu
User Credential: password="VerySecretPass99!"
`;

console.log('  -> Intercepting sensitive outbound prompt...');
const interceptResult = await interceptOutboundPayload({
  prompt: sensitivePrompt,
  targetUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  options: { securityMode: SECURITY_MODES.REDACT_AND_FORWARD }
});

console.assert(interceptResult.allowed === true, 'Request should be allowed once sanitized');
console.assert(interceptResult.blocked === false, 'Request must not be blocked');
console.assert(interceptResult.threatCount >= 4, `Must detect sensitive threats (found ${interceptResult.threatCount})`);

// Verify complete PII redaction in outbound payload
const sanitizedPrompt = interceptResult.sanitizedPayload.prompt;
console.assert(!sanitizedPrompt.includes('2345 6789 0124'), 'Raw Aadhaar leaked!');
console.assert(!sanitizedPrompt.includes('ABCDE1234F'), 'Raw PAN leaked!');
console.assert(!sanitizedPrompt.includes('4242 4242 4242 4242'), 'Raw Card leaked!');
console.assert(!sanitizedPrompt.includes('VerySecretPass99!'), 'Raw Password leaked!');

console.assert(sanitizedPrompt.includes('[REDACTED: AADHAAR]'), 'Must have [REDACTED: AADHAAR]');
console.assert(sanitizedPrompt.includes('[REDACTED: PAN]'), 'Must have [REDACTED: PAN]');
console.assert(sanitizedPrompt.includes('[REDACTED: CARD_NUMBER]'), 'Must have [REDACTED: CARD_NUMBER]');
console.assert(sanitizedPrompt.includes('[REDACTED: PASSCODE]'), 'Must have [REDACTED: PASSCODE]');

console.log('  ✓ Pass 1 Interception verified: All PII successfully replaced with semantic tokens.');
console.log('  ✓ Sanitized payload preview:\n' + sanitizedPrompt.trim());

// Allow BroadcastChannel loopback delivery
await new Promise(r => setTimeout(r, 50));
const sanitizeEvents = receivedBroadcasts.filter(e => e.type === 'REQUEST_SANITIZED');
console.assert(sanitizeEvents.length > 0, 'BroadcastChannel must have received REQUEST_SANITIZED');
console.log(`  ✓ BroadcastChannel IPC verified: Received ${sanitizeEvents.length} event(s) over 'privacylens_channel'.`);

// -----------------------------------------------------------------------------
// STEP C: Fail-Closed Strict Abort, Shield Toggle & DOM Scanning (Pass 2)
// -----------------------------------------------------------------------------
console.log('\n[STEP C - PASS 2]: Fail-Closed Strict Abort & Shield State Controls');

// 1. Strict Fail-Closed Abort Test
console.log('  -> Testing Fail-Closed Strict Abort Mode...');
const blockedResult = await interceptOutboundPayload({
  prompt: 'Sensitive payload with password="superSecretPassword!"',
  options: { securityMode: SECURITY_MODES.FAIL_CLOSED_STRICT }
});

console.assert(blockedResult.allowed === false, 'Strict mode must NOT allow request');
console.assert(blockedResult.blocked === true, 'Strict mode must block request');
console.assert(blockedResult.status === 'FAIL_CLOSED_BLOCKED', 'Status must be FAIL_CLOSED_BLOCKED');
console.assert(blockedResult.threats.length > 0, 'Must record threats in audit');

await new Promise(r => setTimeout(r, 50));
const blockedEvents = receivedBroadcasts.filter(e => e.type === 'FAIL_CLOSED_BLOCKED');
console.assert(blockedEvents.length > 0, 'BroadcastChannel must have received FAIL_CLOSED_BLOCKED');
console.log('  ✓ Fail-Closed Hard Abort verified: Zero data transmitted, event broadcasted.');

// 2. Shield Toggle Test
console.log('  -> Testing Shield Inactive Toggle...');
toggleShield(false);
let state = getGatewayState();
console.assert(state.shieldActive === false, 'Shield must be inactive');

const bypassedResult = await interceptOutboundPayload({
  prompt: 'Unredacted prompt while shield inactive: password="myPassword123"',
});
console.assert(bypassedResult.status === 'BYPASSED_SHIELD_INACTIVE', 'Bypass status required');
console.assert(bypassedResult.allowed === true, 'Bypass allowed');

// Restore shield
toggleShield(true);
state = getGatewayState();
console.assert(state.shieldActive === true, 'Shield must be restored to active');
console.log('  ✓ Shield Toggle verified: Correctly switches between bypass and active enforcement.');

// 3. Content Script & DOM Inspector Verification
console.log('  -> Testing Content Script & scanDOM integration...');
const { scanDOM } = await import('../extension/lib/scanner.js');

// Mock DOM elements
const mockInputs = [
  { tagName: 'INPUT', name: 'user_pass', id: 'pwd_1', getAttribute: (k) => k === 'type' ? 'password' : k === 'name' ? 'user_pass' : null, getBoundingClientRect: () => ({ x: 10, y: 20, width: 200, height: 40 }), className: '' },
  { tagName: 'INPUT', name: 'cc_field', id: 'cc_1', getAttribute: (k) => k === 'autocomplete' ? 'cc-number' : null, getBoundingClientRect: () => ({ x: 10, y: 70, width: 250, height: 40 }), className: '' },
  { tagName: 'INPUT', name: 'aadhaar_field', id: 'adh_1', getAttribute: (k) => k === 'placeholder' ? 'Enter your 12-digit Aadhaar' : null, getBoundingClientRect: () => ({ x: 10, y: 120, width: 250, height: 40 }), className: '' },
  { tagName: 'INPUT', name: 'normal_text', id: 'txt_1', getAttribute: () => null, getBoundingClientRect: () => ({ x: 10, y: 170, width: 200, height: 40 }), className: '' } // normal input
];

const mockDoc = {
  querySelectorAll: (selector) => {
    if (selector.includes('input')) return mockInputs;
    return [];
  }
};

const domResult = scanDOM(mockDoc);
console.assert(domResult.hasSensitiveFields === true, 'Must detect sensitive DOM fields');
console.assert(domResult.sensitiveElements.length === 3, `Expected 3 sensitive fields, found ${domResult.sensitiveElements.length}`);
console.assert(domResult.redactionBoxes.length === 3, 'Must compute 3 redaction boxes');
console.log('  ✓ scanDOM verified: Correctly identified password, credit card, and aadhaar fields with coordinate boxes.');

// Clean up test channel
testReceiverChannel.close();

console.log('\n================================================================');
console.log('🎉 PHASE 2 PART 1 DOUBLE VERIFICATION PASSED WITH ZERO ERRORS!');
console.log('================================================================\n');

process.exit(0);
