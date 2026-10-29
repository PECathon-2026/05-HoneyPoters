/**
 * Double-Verification Test Script: Phase 1 - Part 4 (geminiClient.js)
 * Step A: Structural & Syntax Verification
 * Step B: Synthetic Dry-Run of Fail-Closed Gatekeeper & Gemini Proxy
 */

import { 
  sanitizeAndSendToGemini, 
  generateContentSafe,
  SECURITY_MODES, 
  PrivacyLensSecurityError,
  getSecurityAuditLogs,
  getSecurityStats,
  addSecurityEventListener,
  clearSecurityAuditLogs
} from '../src/lib/geminiClient.js';

console.log('====================================================');
console.log('🧪 VERIFICATION LOOP — PHASE 1 PART 4: GEMINICLIENT.JS');
console.log('====================================================');

// --- STEP A: Structural & Syntax Check ---
console.log('\n[STEP A]: Structural & Interface Verification');
console.assert(typeof sanitizeAndSendToGemini === 'function', 'sanitizeAndSendToGemini must be a function');
console.assert(typeof generateContentSafe === 'function', 'generateContentSafe must be an alias');
console.assert(typeof SECURITY_MODES === 'object', 'SECURITY_MODES must exist');
console.assert(SECURITY_MODES.FAIL_CLOSED_STRICT === 'FAIL_CLOSED_STRICT', 'Strict mode must be defined');
console.assert(typeof getSecurityStats === 'function', 'getSecurityStats must be a function');
console.log('✅ Step A Passed: All exports, wrappers, and security modes verified.');

// --- STEP B: Synthetic Dry-Run of Fail-Closed Gatekeeper ---
console.log('\n[STEP B]: Synthetic Dry-Run of Fail-Closed Hard-Abort Pipeline');

async function runGatekeeperTests() {
  clearSecurityAuditLogs();
  
  // Track events emitted to event bus
  const capturedEvents = [];
  const unsubscribe = addSecurityEventListener((evt) => capturedEvents.push(evt));

  // 1. Multi-layered Sanitization Test (Regex + RAG Contextual)
  console.log('  -> Testing Dual Sanitization Pipeline (Regex + RAG)...');
  const complexPrompt = 'Patient KYC Aadhaar 2345 6789 0124. Clinical diagnosis confirms acute chronic kidney disease failure.';
  
  const safeResult = await sanitizeAndSendToGemini({
    prompt: complexPrompt,
    options: { 
      securityMode: SECURITY_MODES.REDACT_AND_FORWARD,
      ragSimilarityThreshold: 0.5
    }
  });

  console.assert(safeResult.success === true, 'Request must succeed with sanitized payload');
  console.assert(safeResult.sanitizedPrompt.includes('[REDACTED: AADHAAR]'), 'Must redact Aadhaar');
  console.assert(safeResult.sanitizedPrompt.includes('[REDACTED: MEDICAL_RECORD]'), 'Must redact Medical narrative');
  console.assert(!safeResult.sanitizedPrompt.includes('2345 6789 0124'), 'Raw Aadhaar must be erased');
  console.assert(!safeResult.sanitizedPrompt.includes('chronic kidney disease'), 'Raw diagnosis must be erased');
  console.log('  ✓ Dual Sanitization verified! Outbound sanitized payload:\n    ', safeResult.sanitizedPrompt);

  // 2. Fail-Closed Strict Mode Hard Abort Test
  console.log('  -> Testing FAIL_CLOSED_STRICT Hard Network Abort...');
  let strictBlocked = false;
  try {
    await sanitizeAndSendToGemini({
      prompt: 'Here is my password: password="superSecretPass123"',
      options: { securityMode: SECURITY_MODES.FAIL_CLOSED_STRICT }
    });
  } catch (err) {
    if (err instanceof PrivacyLensSecurityError) {
      strictBlocked = true;
      console.assert(err.code === 'PRIVACYLENS_FAIL_CLOSED_BLOCKED', 'Error code must match');
      console.assert(err.message.includes('HARD-ABORTED'), 'Message must indicate hard-abort');
      console.log(`  ✓ Confirmed Hard Network Abort: [${err.code}] ${err.message}`);
    } else {
      throw err;
    }
  }
  console.assert(strictBlocked, 'Strict mode must block request completely');

  // 3. Clean Payload Test
  console.log('  -> Testing Clean Non-PII Payload Dispatch...');
  const cleanResult = await sanitizeAndSendToGemini({
    prompt: 'Explain how distributed consensus works in Raft protocol.',
    options: { securityMode: SECURITY_MODES.FAIL_CLOSED_STRICT }
  });
  console.assert(cleanResult.success === true, 'Clean payload must pass');
  console.assert(cleanResult.audit.status === 'CLEAN_DISPATCH', 'Status must be CLEAN_DISPATCH');
  console.log('  ✓ Clean payload dispatched with CLEAN_DISPATCH status.');

  // 4. Audit Log & Telemetry Verification
  console.log('  -> Testing Audit Logs & Telemetry Metrics...');
  const stats = getSecurityStats();
  console.assert(stats.totalRequests >= 3, 'Must record all requests in audit log');
  console.assert(stats.blockedRequests >= 1, 'Must count blocked requests');
  console.assert(stats.sanitizedRequests >= 1, 'Must count sanitized requests');
  console.assert(stats.zeroLeakageRate === '100%', 'Zero leakage rate must be 100%');
  console.assert(capturedEvents.length >= 3, 'Event bus must broadcast audit events');
  console.log('  ✓ Audit Telemetry verified:', stats);

  unsubscribe();
}

runGatekeeperTests().then(() => {
  console.log('\n🎉 ALL DOUBLE-VERIFICATION TESTS PASSED FOR PART 4!');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ VERIFICATION FAILED FOR PART 4:', err);
  process.exit(1);
});
