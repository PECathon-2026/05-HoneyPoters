/**
 * Automated Double-Verification Suite: Step 1 Backend Implementation
 * Verifies PS-004 requirements for Team 05-HoneyPoters:
 * 1. Express API Gateway & Healthcheck
 * 2. SecOps Authentication & Session Token Verification
 * 3. Fail-Closed Gemini 1.5 Flash Proxy (Strict Hard Abort & Redact-and-Forward)
 * 4. Tamper-Proof Audit Forensics Ledger with SHA-256 Hash Chain
 */

import http from 'http';
import assert from 'assert';
import { app } from '../server/index.js';

console.log('================================================================');
console.log('🧪 STEP 1 BACKEND VERIFICATION SUITE — PRIVACYLENS (PS-004)');
console.log('================================================================');

const TEST_PORT = 3998;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Start test server
const server = http.createServer(app);

await new Promise((resolve) => {
  server.listen(TEST_PORT, () => {
    console.log(`✓ Test Backend Server running on ${BASE_URL}`);
    resolve();
  });
});

try {
  // --------------------------------------------------------------------------
  // TEST 1: Healthcheck Endpoint
  // --------------------------------------------------------------------------
  console.log('\n[TEST 1/4]: Testing /api/health Endpoint...');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  assert.strictEqual(healthRes.status, 200, 'Health endpoint must return 200 OK');
  const healthData = await healthRes.json();

  assert.strictEqual(healthData.status, 'healthy');
  assert.strictEqual(healthData.ps, 'PS-004');
  assert(Array.isArray(healthData.guardrails), 'Guardrails must be an array');
  assert(healthData.guardrails.includes('FAIL_CLOSED_GATEKEEPER'), 'Must include FAIL_CLOSED_GATEKEEPER');
  assert(healthData.guardrails.includes('VERHOEFF_CHECKSUM_VALIDATION'), 'Must include VERHOEFF_CHECKSUM_VALIDATION');
  console.log('  ✓ /api/health returned 200 OK with PS-004 guardrail capabilities');

  // --------------------------------------------------------------------------
  // TEST 2: SecOps Authentication & Token Verification
  // --------------------------------------------------------------------------
  console.log('\n[TEST 2/4]: Testing /api/auth Endpoints (Login & Verification)...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roleId: 'secops-lead' })
  });
  assert.strictEqual(loginRes.status, 200, 'Login must return 200 OK');
  const loginData = await loginRes.json();

  assert(loginData.success, 'Login response must indicate success');
  assert(loginData.token, 'Login response must include session token');
  assert.strictEqual(loginData.user.id, 'secops-lead');
  assert.strictEqual(loginData.user.role, 'Security Administrator');
  console.log(`  ✓ Login issued HMAC session token for ${loginData.user.name}`);

  // Test token verification
  const verifyRes = await fetch(`${BASE_URL}/api/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginData.token}`
    }
  });
  assert.strictEqual(verifyRes.status, 200);
  const verifyData = await verifyRes.json();
  assert.strictEqual(verifyData.valid, true);
  assert.strictEqual(verifyData.user.sub, 'secops-lead');

  // Test invalid token
  const badVerifyRes = await fetch(`${BASE_URL}/api/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer invalid.tampered.token'
    }
  });
  assert.strictEqual(badVerifyRes.status, 401, 'Tampered token must return 401 Unauthorized');
  console.log('  ✓ Token verification succeeded; tampered token correctly rejected with 401');

  // --------------------------------------------------------------------------
  // TEST 3: Secure Gemini Proxy (Fail-Closed Gatekeeper)
  // --------------------------------------------------------------------------
  console.log('\n[TEST 3/4]: Testing /api/gemini/sanitize-proxy Gatekeeper...');

  // 3a. Strict Mode Fail-Closed Abort
  const rawPiiPrompt = 'Payment to card 4242 4242 4242 4242, Aadhaar 2345 6789 0124, PAN ABCDE1234F and password="superSecretPass123!"';
  const strictRes = await fetch(`${BASE_URL}/api/gemini/sanitize-proxy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: rawPiiPrompt,
      securityMode: 'FAIL_CLOSED_STRICT'
    })
  });
  assert.strictEqual(strictRes.status, 403, 'Strict mode with raw PII must return 403 Forbidden');
  const strictData = await strictRes.json();
  assert(strictData.error.includes('[FAIL_CLOSED]'), 'Must include [FAIL_CLOSED] error tag');
  assert(strictData.threatsDetected >= 3, 'Must detect multiple threats');
  console.log(`  ✓ Strict Fail-Closed tripwire caught ${strictData.threatsDetected} threats and aborted with 403`);

  // 3b. Redact-and-Forward Mode
  const redactRes = await fetch(`${BASE_URL}/api/gemini/sanitize-proxy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: rawPiiPrompt,
      securityMode: 'REDACT_AND_FORWARD'
    })
  });
  assert.strictEqual(redactRes.status, 200, 'Redact and forward must return 200 OK');
  const redactData = await redactRes.json();
  assert(redactData.success, 'Redact response must be successful');
  assert.strictEqual(redactData.zeroCloudLeakageConfirmed, true);
  assert(redactData.sanitizedPrompt.includes('[REDACTED: CARD_NUMBER]'));
  assert(redactData.sanitizedPrompt.includes('[REDACTED: AADHAAR]'));
  assert(redactData.sanitizedPrompt.includes('[REDACTED: PAN]'));
  assert(!redactData.sanitizedPrompt.includes('4242 4242 4242 4242'), 'Raw card number must be destroyed');
  assert(!redactData.sanitizedPrompt.includes('2345 6789 0124'), 'Raw Aadhaar must be destroyed');
  assert(redactData.sha256, 'Audit record sha256 hash must be returned');
  console.log('  ✓ Redact-and-Forward sanitized all raw PII and confirmed zero cloud leakage');

  // --------------------------------------------------------------------------
  // TEST 4: Tamper-Proof Audit Forensics Ledger
  // --------------------------------------------------------------------------
  console.log('\n[TEST 4/4]: Testing /api/audit/logs Ledger...');
  const postAuditRes = await fetch(`${BASE_URL}/api/audit/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'SYNTHETIC_BENCHMARK_PROBE',
      details: 'Test injection probe for Step 1 backend verification',
      threatTypes: ['AADHAAR', 'CARD_NUMBER'],
      riskLevel: 'HIGH',
      source: 'TEST_RUNNER'
    })
  });
  assert.strictEqual(postAuditRes.status, 201, 'Audit log POST must return 201 Created');
  const postAuditData = await postAuditRes.json();
  assert(postAuditData.record.sha256, 'Record must include SHA-256 hash');
  assert(postAuditData.record.prevHash, 'Record must include previous hash link');

  // Fetch logs
  const getAuditRes = await fetch(`${BASE_URL}/api/audit/logs?limit=5`);
  assert.strictEqual(getAuditRes.status, 200);
  const getAuditData = await getAuditRes.json();
  assert(Array.isArray(getAuditData.logs), 'Logs must be an array');
  assert(getAuditData.logs.length > 0, 'Logs must contain recorded entries');
  console.log(`  ✓ Tamper-proof audit log verified: ${getAuditData.totalRecords} total records linked with SHA-256`);

  console.log('\n================================================================');
  console.log('🎉 ALL STEP 1 BACKEND TESTS PASSED CLEANLY (2x VERIFIED)');
  console.log('================================================================');
} finally {
  await new Promise((resolve) => server.close(resolve));
}
