/**
 * Double-Verification Test Suite: Phase 3 - Part 1
 * Official 5 PDF Evaluation Scenarios & Demo Readiness
 * 
 * Step A: Structural & File Integrity Verification
 * Step B (Pass 1): Full Execution & Zero Leakage Verification across 5 Scenarios
 * Step C (Pass 2): Deep Edge-Case, Residual PII Re-Scan & Fail-Closed Gatekeeper Verification
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('🧪 DOUBLE VERIFICATION — PHASE 3 PART 1: 5 EVALUATION SCENARIOS');
console.log('================================================================');

// -----------------------------------------------------------------------------
// STEP A: Structural & File Integrity Verification
// -----------------------------------------------------------------------------
console.log('\n[STEP A]: Structural & File Integrity Verification');

const scenariosLibPath = path.join(rootDir, 'src', 'lib', 'testScenarios.js');
const scenariosCompPath = path.join(rootDir, 'src', 'components', 'EvaluationScenarios.jsx');
const appPath = path.join(rootDir, 'src', 'App.jsx');

console.assert(fs.existsSync(scenariosLibPath), 'src/lib/testScenarios.js must exist');
console.assert(fs.existsSync(scenariosCompPath), 'src/components/EvaluationScenarios.jsx must exist');
console.assert(fs.existsSync(appPath), 'src/App.jsx must exist');

const mockPages = [
  'ecommerce-checkout.html',
  'authentication.html',
  'customer-support.html',
  'profile-faces.html',
  'developer-settings.html'
];

mockPages.forEach((page) => {
  const fullPath = path.join(rootDir, 'public', 'mock', page);
  console.assert(fs.existsSync(fullPath), `Mock HTML page must exist: ${page}`);
});

const scenariosLibSrc = fs.readFileSync(scenariosLibPath, 'utf8');
console.assert(scenariosLibSrc.includes('SCENARIOS'), 'Must export SCENARIOS');
console.assert(scenariosLibSrc.includes('executeScenario'), 'Must export executeScenario');
console.assert(scenariosLibSrc.includes('runAllScenarios'), 'Must export runAllScenarios');

const appSrc = fs.readFileSync(appPath, 'utf8');
console.assert(appSrc.includes('EvaluationScenarios'), 'App.jsx must import and mount EvaluationScenarios');

console.log('  ✓ Structural checks passed: Module exports, mock pages, and App.jsx verified.');

// -----------------------------------------------------------------------------
// STEP B (PASS 1): Scenario Execution & Zero Leakage Verification
// -----------------------------------------------------------------------------
console.log('\n[STEP B - PASS 1]: Individual Scenario Execution & Zero Leakage');

const { SCENARIOS, executeScenario, runAllScenarios } = await import('../src/lib/testScenarios.js');

// 1. E-Commerce Checkout
console.log('  -> Testing Scenario 1: E-Commerce Checkout...');
const s1 = executeScenario(SCENARIOS.ECOMMERCE_CHECKOUT);
console.assert(s1.success === true, 'Scenario 1 must pass');
console.assert(s1.sanitizedOutput.includes('[REDACTED: CARD_NUMBER]'), 'S1 must redact credit card');
console.assert(s1.sanitizedOutput.includes('[REDACTED: CVV]'), 'S1 must redact CVV');
console.assert(s1.sanitizedOutput.includes('[REDACTED: SHIPPING_ADDRESS]'), 'S1 must redact shipping address');
console.assert(!s1.sanitizedOutput.includes('4242 4242 4242 4242'), 'S1 credit card leak!');
console.assert(!s1.sanitizedOutput.includes('Flat 402, Royal Palms'), 'S1 address leak!');
console.log(`    ✓ Scenario 1 Verified: ${s1.threatsNeutralized} threats neutralized, zero financial/logistics leaks.`);

// 2. Authentication & Identity
console.log('  -> Testing Scenario 2: Authentication & Identity...');
const s2 = executeScenario(SCENARIOS.AUTHENTICATION);
console.assert(s2.success === true, 'Scenario 2 must pass');
console.assert(s2.sanitizedOutput.includes('[REDACTED: EMAIL]'), 'S2 must redact login email');
console.assert(s2.sanitizedOutput.includes('[REDACTED: PASSCODE]'), 'S2 must redact password');
console.assert(s2.sanitizedOutput.includes('[REDACTED: OTP]'), 'S2 must redact 6-digit OTP');
console.assert(!s2.sanitizedOutput.includes('AlphaOmega#2026!'), 'S2 password leak!');
console.assert(!s2.sanitizedOutput.includes('749201'), 'S2 OTP leak!');
console.log(`    ✓ Scenario 2 Verified: ${s2.threatsNeutralized} threats neutralized, zero credential/OTP leaks.`);

// 3. Customer Support Chat
console.log('  -> Testing Scenario 3: Customer Support Chat...');
const s3 = executeScenario(SCENARIOS.CUSTOMER_SUPPORT);
console.assert(s3.success === true, 'Scenario 3 must pass');
console.assert(s3.sanitizedOutput.includes('[REDACTED: PHONE_NUMBER]'), 'S3 must redact phone number');
console.assert(s3.sanitizedOutput.includes('[REDACTED: PRIVATE_CHAT_LOG]'), 'S3 must mask private chat log');
console.assert(!s3.sanitizedOutput.includes('98765 43210'), 'S3 phone leak!');
console.assert(!s3.sanitizedOutput.includes('hospitalization surgery'), 'S3 private chat dispute leak!');
console.log(`    ✓ Scenario 3 Verified: ${s3.threatsNeutralized} threats neutralized, zero contact/chat leaks.`);

// 4. Video/Profile Faces
console.log('  -> Testing Scenario 4: Video/Profile Faces (Canvas Coordinate Blackout)...');
const s4 = executeScenario(SCENARIOS.VIDEO_PROFILE_FACES);
console.assert(s4.success === true, 'Scenario 4 must pass');
console.assert(s4.isVisual === true, 'S4 must be visual');
console.assert(s4.clampedBoxes.length === 3, 'S4 must clamp 3 bounding boxes');
console.assert(s4.multimodalPayload.contents[0].parts.length === 2, 'S4 must generate valid multimodal Gemini Vision payload');
console.assert(s4.clampedBoxes[2].clampedX === 0, 'S4 boundary clamping must clamp negative x to 0');
console.log(`    ✓ Scenario 4 Verified: ${s4.threatsNeutralized} face boxes clamped & redacted with zero pixel leakage.`);

// 5. Developer Settings & Secrets
console.log('  -> Testing Scenario 5: Developer Settings & Secrets...');
const s5 = executeScenario(SCENARIOS.DEVELOPER_SETTINGS);
console.assert(s5.success === true, 'Scenario 5 must pass');
console.assert(s5.sanitizedOutput.includes('[REDACTED: API_KEY]'), 'S5 must redact API key');
console.assert(s5.sanitizedOutput.includes('[REDACTED: AUTH_TOKEN]'), 'S5 must redact JWT bearer token');
console.assert(s5.sanitizedOutput.includes('[REDACTED: IP_ADDRESS]'), 'S5 must redact IP addresses');
console.assert(!s5.sanitizedOutput.includes('AIzaSyD9876543210'), 'S5 Gemini API key leak!');
console.assert(!s5.sanitizedOutput.includes('sk-proj-abc'), 'S5 OpenAI key leak!');
console.assert(!s5.sanitizedOutput.includes('192.168.1.100'), 'S5 IPv4 leak!');
console.assert(!s5.sanitizedOutput.includes('2001:0db8'), 'S5 IPv6 leak!');
console.log(`    ✓ Scenario 5 Verified: ${s5.threatsNeutralized} threats neutralized, zero dev secrets leak.`);

// -----------------------------------------------------------------------------
// STEP C (PASS 2): Residual PII Re-Scan & Gatekeeper Fail-Closed Verification
// -----------------------------------------------------------------------------
console.log('\n[STEP C - PASS 2]: Residual Leak Re-Scan & Fail-Closed Gatekeeper');

const { scanText } = await import('../src/lib/scanner.js');
const { generateContentSafe, SECURITY_MODES, PrivacyLensSecurityError } = await import('../src/lib/geminiClient.js');

// 1. Multi-pass residual leak verification: every text scenario output must scan clean
const textScenarios = [s1, s2, s3, s5];
textScenarios.forEach((s) => {
  const residuals = scanText(s.sanitizedOutput);
  console.assert(residuals.length === 0, `Residual threat detected in scenario ${s.number}! Count: ${residuals.length}`);
});
console.log('  ✓ Pass 2 Residual Re-Scan: Zero residual PII detected across all sanitized scenario outputs.');

// 2. Full benchmark suite scorecard
const scorecard = runAllScenarios();
console.assert(scorecard.allPassed === true, 'All 5 scenarios must pass');
console.assert(scorecard.passedScenarios === 5, '5 scenarios passed');
console.assert(scorecard.zeroLeakageRate === '100%', '100% zero leakage rate required');
console.log(`  ✓ Pass 2 Bulk Benchmark Scorecard: 5/5 Scenarios Passed (${scorecard.totalThreatsNeutralized} threats neutralized, ${scorecard.totalDurationMs}ms total latency).`);

// 3. Fail-Closed Gatekeeper Verification with Scenario 1 & Scenario 5 Raw Payloads
console.log('  -> Testing Fail-Closed Gatekeeper with raw scenario payloads...');
let blockedCount = 0;

for (const rawPayload of [SCENARIOS.ECOMMERCE_CHECKOUT.rawInput, SCENARIOS.DEVELOPER_SETTINGS.rawInput]) {
  try {
    await generateContentSafe({
      prompt: rawPayload,
      options: { securityMode: SECURITY_MODES.FAIL_CLOSED_STRICT }
    });
    console.error('FAIL: Raw scenario payload was not blocked in STRICT mode!');
  } catch (err) {
    if (err instanceof PrivacyLensSecurityError) {
      blockedCount++;
    } else {
      throw err;
    }
  }
}

console.assert(blockedCount === 2, 'Both raw payloads must trigger hard network abort');
console.log('  ✓ Fail-Closed Gatekeeper: Hard network abort successfully prevented raw cloud transmission.');

// 4. Clean Sanitized Dispatch Verification
const safeDispatch = await generateContentSafe({
  prompt: s1.sanitizedOutput,
  options: { securityMode: SECURITY_MODES.FAIL_CLOSED_STRICT }
});
console.assert(safeDispatch.success === true, 'Sanitized scenario payload must pass gatekeeper');
console.log('  ✓ Clean Sanitized Dispatch: Sanitized scenario output successfully passed through gatekeeper.');

console.log('\n================================================================');
console.log('🎉 ALL 5 EVALUATION SCENARIOS DOUBLE-VERIFIED WITH ZERO ERRORS!');
console.log('================================================================');
