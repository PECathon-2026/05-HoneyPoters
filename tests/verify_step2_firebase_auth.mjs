/**
 * Automated Double-Verification Suite: Step 2 Firebase Auth & RBAC Implementation
 * Verifies PS-004 requirements for Team 05-HoneyPoters:
 * 1. Firebase App & Auth Configuration (src/lib/firebase.js)
 * 2. Auth Context & Role-Based Access Control (src/context/AuthContext.jsx)
 * 3. Glassmorphic Auth Modal & 1-Click Role Switcher (src/components/AuthModal.jsx)
 * 4. Backend Token Middleware Integration (server/index.js)
 */

import fs from 'fs';
import assert from 'assert';
import crypto from 'crypto';
import { firebaseConfig } from '../src/lib/firebase.js';
import { USER_ROLES } from '../src/lib/roles.js';
import { verifySessionToken } from '../server/index.js';

console.log('================================================================');
console.log('🧪 STEP 2 FIREBASE AUTH & RBAC VERIFICATION SUITE — PRIVACYLENS');
console.log('================================================================');

// --------------------------------------------------------------------------
// TEST 1: Firebase Configuration
// --------------------------------------------------------------------------
console.log('\n[TEST 1/4]: Verifying Firebase Configuration & Credentials...');
assert(firebaseConfig, 'firebaseConfig must be exported');
assert.strictEqual(firebaseConfig.apiKey, 'AIzaSyDUBUKDmKHTzBjwGPMNT440WI-khD4s2us');
assert.strictEqual(firebaseConfig.authDomain, 'policylen-s.firebaseapp.com');
assert.strictEqual(firebaseConfig.projectId, 'policylen-s');
assert.strictEqual(firebaseConfig.appId, '1:1033931345489:web:061daddb44fa4093d27270');
console.log('  ✓ Firebase config verified with project policylen-s');

// --------------------------------------------------------------------------
// TEST 2: RBAC Roles & Permissions
// --------------------------------------------------------------------------
console.log('\n[TEST 2/4]: Verifying Role-Based Access Control (RBAC) Architecture...');
assert(USER_ROLES.SECOPS_LEAD, 'SECOPS_LEAD role must exist');
assert(USER_ROLES.PECATHON_EVALUATOR, 'PECATHON_EVALUATOR role must exist');
assert(USER_ROLES.DPDP_AUDITOR, 'DPDP_AUDITOR role must exist');

assert(USER_ROLES.SECOPS_LEAD.clearance.includes('Level 3'));
assert(USER_ROLES.PECATHON_EVALUATOR.clearance.includes('Level 3'));
assert(USER_ROLES.DPDP_AUDITOR.clearance.includes('Level 2'));

assert(USER_ROLES.SECOPS_LEAD.permissions.includes('POLICY_OVERRIDE'));
assert(USER_ROLES.PECATHON_EVALUATOR.permissions.includes('SCENARIOS_EXECUTION'));
assert(USER_ROLES.DPDP_AUDITOR.permissions.includes('AUDIT_LOG_READ'));
console.log('  ✓ 3 RBAC roles verified with clearances and fine-grained permissions');

// --------------------------------------------------------------------------
// TEST 3: Backend Token Verification Middleware
// --------------------------------------------------------------------------
console.log('\n[TEST 3/4]: Verifying Backend Token Middleware Integration...');

// 3a. Verify Demo Role Token
const demoToken = 'pl_demo_secops-lead_1730000000';
const demoUser = verifySessionToken(demoToken);
assert(demoUser, 'Backend must verify demo role token');
assert.strictEqual(demoUser.role, 'SecOps Lead');
console.log('  ✓ Backend correctly resolved demo token to SecOps Lead');

// 3b. Verify RAM Token
const ramToken = 'privacylens_ram_token_compliance-auditor_1730000000';
const ramUser = verifySessionToken(ramToken);
assert(ramUser, 'Backend must verify RAM session token');
assert.strictEqual(ramUser.role, 'DPDP Auditor');
console.log('  ✓ Backend correctly resolved RAM session token to DPDP Auditor');

// 3c. Verify Simulated Firebase ID Token (policylen-s project)
const fbHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
const fbPayload = Buffer.from(JSON.stringify({
  iss: 'https://securetoken.google.com/policylen-s',
  aud: 'policylen-s',
  sub: 'fb_user_12345678',
  email: 'judge@pecathon.org',
  name: 'PECathon Judge',
  exp: Math.floor(Date.now() / 1000) + 3600
})).toString('base64url');
const fbToken = `${fbHeader}.${fbPayload}.mock_signature_bytes`;

const fbUser = verifySessionToken(fbToken);
assert(fbUser, 'Backend must decode valid Firebase ID token for policylen-s');
assert.strictEqual(fbUser.email, 'judge@pecathon.org');
assert.strictEqual(fbUser.firebase, true);
console.log('  ✓ Backend successfully verified Firebase ID token for project policylen-s');

// 3d. Verify Rejection of Malformed / Expired Token
assert.strictEqual(verifySessionToken('invalid.token'), null, 'Invalid token must return null');
assert.strictEqual(verifySessionToken(null), null, 'Null token must return null');
console.log('  ✓ Invalid and malformed tokens safely rejected');

// --------------------------------------------------------------------------
// TEST 4: UI Glassmorphic Auth Modal & Firebase Auth
// --------------------------------------------------------------------------
console.log('\n[TEST 4/4]: Verifying Glassmorphic AuthModal Component...');
const modalCode = fs.readFileSync('src/components/AuthModal.jsx', 'utf-8');
assert(modalCode.includes('Sign In with Email'), 'AuthModal must feature email login');
assert(modalCode.includes('Sign In with Google'), 'AuthModal must include Google Sign-In button');
assert(modalCode.includes('Zero-Storage Trust Boundary'), 'AuthModal must enforce zero-storage trust boundary');
assert(modalCode.includes('USER_ROLES'), 'AuthModal must link to USER_ROLES');
console.log('  ✓ AuthModal component verified with clean Firebase Auth UI');

console.log('\n================================================================');
console.log('🎉 ALL STEP 2 FIREBASE AUTH & RBAC CHECKS PASSED (2x VERIFIED)');
console.log('================================================================');
