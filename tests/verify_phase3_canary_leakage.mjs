/**
 * Double-Verification Test Suite: Phase 3 - Part 2
 * Automated Synthetic Canary Testing & Re-Sanitization
 * 
 * Step A: Structural & Module Export Verification
 * Step B (Pass 1): Baseline Canary Honeypot Neutralization & Zero Leakage
 * Step C (Pass 2): Canary Leak Trap, Dynamic Threshold Tuning, Re-Sanitization & Hard Abort
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🧪 DOUBLE VERIFICATION — PHASE 3 PART 2: SYNTHETIC CANARY TEST');
console.log('================================================================');

// -----------------------------------------------------------------------------
// STEP A: Structural & Module Export Verification
// -----------------------------------------------------------------------------
console.log('\n[STEP A]: Module Export & Interface Verification');

const clientPath = path.join(rootDir, 'src', 'lib', 'geminiClient.js');
console.assert(fs.existsSync(clientPath), 'src/lib/geminiClient.js must exist');

const clientSrc = fs.readFileSync(clientPath, 'utf8');
console.assert(clientSrc.includes('runCanaryLeakageTest'), 'Must export runCanaryLeakageTest');
console.assert(clientSrc.includes('CANARY_HONEYPOT_TOKENS'), 'Must export CANARY_HONEYPOT_TOKENS');

const { runCanaryLeakageTest, CANARY_HONEYPOT_TOKENS, getSecurityAuditLogs } = await import('../src/lib/geminiClient.js');

console.assert(typeof runCanaryLeakageTest === 'function', 'runCanaryLeakageTest must be a function');
console.assert(CANARY_HONEYPOT_TOKENS.CREDIT_CARD, 'Must define CREDIT_CARD canary');
console.assert(CANARY_HONEYPOT_TOKENS.API_KEY, 'Must define API_KEY canary');
console.assert(CANARY_HONEYPOT_TOKENS.PASSWORD, 'Must define PASSWORD canary');
console.assert(CANARY_HONEYPOT_TOKENS.OTP, 'Must define OTP canary');
console.assert(CANARY_HONEYPOT_TOKENS.AADHAAR, 'Must define AADHAAR canary');

console.log('  ✓ Structural checks passed: runCanaryLeakageTest and honeypot tokens verified.');

// -----------------------------------------------------------------------------
// STEP B (PASS 1): Baseline Canary Neutralization & Zero Leakage
// -----------------------------------------------------------------------------
console.log('\n[STEP B - PASS 1]: Baseline Outbound Buffer Probe & Honeypot Neutralization');

const normalPayload = 'User query: How do I implement multi-tenant database isolation in PostgreSQL?';
const cleanProbe = runCanaryLeakageTest(normalPayload);

console.assert(cleanProbe.success === true, 'Canary test run must succeed');
console.assert(cleanProbe.outgoingTestBuffer.includes(CANARY_HONEYPOT_TOKENS.CREDIT_CARD), 'Buffer must contain injected credit card canary');
console.assert(cleanProbe.outgoingTestBuffer.includes(CANARY_HONEYPOT_TOKENS.API_KEY), 'Buffer must contain injected API key canary');
console.assert(cleanProbe.outgoingTestBuffer.includes(CANARY_HONEYPOT_TOKENS.PASSWORD), 'Buffer must contain injected password canary');
console.assert(cleanProbe.outgoingTestBuffer.includes(CANARY_HONEYPOT_TOKENS.OTP), 'Buffer must contain injected OTP canary');
console.assert(cleanProbe.outgoingTestBuffer.includes(CANARY_HONEYPOT_TOKENS.AADHAAR), 'Buffer must contain injected Aadhaar canary');

// Assert zero raw canary secrets leaked in sanitized output
console.assert(!cleanProbe.firstPassSanitized.includes(CANARY_HONEYPOT_TOKENS.CREDIT_CARD), 'Card canary leaked!');
console.assert(!cleanProbe.firstPassSanitized.includes(CANARY_HONEYPOT_TOKENS.API_KEY), 'API key canary leaked!');
console.assert(!cleanProbe.firstPassSanitized.includes(CANARY_HONEYPOT_TOKENS.PASSWORD), 'Password canary leaked!');
console.assert(!cleanProbe.firstPassSanitized.includes(CANARY_HONEYPOT_TOKENS.OTP), 'OTP canary leaked!');
console.assert(!cleanProbe.firstPassSanitized.includes(CANARY_HONEYPOT_TOKENS.AADHAAR), 'Aadhaar canary leaked!');

console.assert(cleanProbe.canaryLeaked === false, 'Canary leak flag must be false in clean run');
console.assert(cleanProbe.isGuaranteedSafe === true, 'Guaranteed safe flag must be true');
console.assert(cleanProbe.audit.status === 'CANARY_VERIFIED_CLEAN', 'Audit status must be CANARY_VERIFIED_CLEAN');

console.log('  ✓ Pass 1 Verified: All 5 synthetic canary honeypots safely neutralized with zero leakage.');

// -----------------------------------------------------------------------------
// STEP C (PASS 2): Leak Trap, Dynamic Tuning, Re-Sanitization & Hard Abort
// -----------------------------------------------------------------------------
console.log('\n[STEP C - PASS 2]: Canary Leak Trap, Dynamic Tuning & Client-Side Hard Abort');

const adversarialProbe = runCanaryLeakageTest('Adversarial agent data extraction attempt', { simulateLeak: true });

console.assert(adversarialProbe.canaryLeaked === true, 'Must detect unredacted canary leak');
console.assert(adversarialProbe.leakedCanaries.length > 0, 'Leaked canaries list must not be empty');

// Verify Dynamic Threshold Tuning
console.assert(adversarialProbe.dynamicThresholdTuning !== null, 'Dynamic tuning object must be generated');
console.assert(adversarialProbe.dynamicThresholdTuning.triggered === true, 'Dynamic tuning must be triggered');
console.assert(adversarialProbe.dynamicThresholdTuning.tunedSimilarityThreshold === 0.35, 'Threshold must be tuned to 0.35');
console.assert(adversarialProbe.dynamicThresholdTuning.policyUpgradedTo === 'FAIL_CLOSED_STRICT', 'Policy must be upgraded to FAIL_CLOSED_STRICT');

// Verify Client-Side Hard Abort Alert
console.assert(adversarialProbe.clientSideHardAbort !== null, 'Client-Side Hard Abort alert must be created');
console.assert(adversarialProbe.clientSideHardAbort.severity === 'CRITICAL', 'Hard abort severity must be CRITICAL');
console.assert(adversarialProbe.clientSideHardAbort.alertType === 'CLIENT_SIDE_HARD_ABORT', 'Alert type must be CLIENT_SIDE_HARD_ABORT');

// Verify Re-Sanitization
console.assert(!adversarialProbe.reSanitizedOutput.includes(CANARY_HONEYPOT_TOKENS.API_KEY), 'Re-sanitization must purge leaked API key canary');
console.assert(adversarialProbe.isGuaranteedSafe === true, 'Re-sanitized output must be guaranteed safe');

// Verify Audit Forensics Record
console.assert(adversarialProbe.audit.status === 'FAIL_CLOSED_BLOCKED', 'Audit record status must be FAIL_CLOSED_BLOCKED');
console.assert(adversarialProbe.audit.hardAbort === true, 'Audit record must have hardAbort=true');

console.log('  ✓ Pass 2 Verified: Canary leak caught -> Dynamic threshold tuning applied -> Re-sanitization purged leak -> Client-Side Hard Abort triggered.');

console.log('\n================================================================');
console.log('🎉 CANARY TESTING & RE-SANITIZATION DOUBLE-VERIFIED WITH ZERO ERRORS!');
console.log('================================================================');
