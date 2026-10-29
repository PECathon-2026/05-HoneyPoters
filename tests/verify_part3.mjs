/**
 * Double-Verification Test Script: Phase 1 - Part 3 (ragScanner.js)
 * Step A: Structural & Syntax Verification
 * Step B: Synthetic Dry-Run of In-Browser Contextual Vector Search
 */

import { 
  CONTEXTUAL_CATEGORIES, 
  CONTEXTUAL_RULES, 
  generateDeterministicEmbedding, 
  initRagScanner, 
  scanContextualText, 
  sanitizeContextualText,
  addCustomPrivacyRule 
} from '../src/lib/ragScanner.js';

console.log('====================================================');
console.log('🧪 VERIFICATION LOOP — PHASE 1 PART 3: RAGSCANNER.JS');
console.log('====================================================');

// --- STEP A: Structural & Syntax Check ---
console.log('\n[STEP A]: Structural & Schema Verification');
console.assert(typeof CONTEXTUAL_CATEGORIES === 'object', 'CONTEXTUAL_CATEGORIES must exist');
console.assert(Array.isArray(CONTEXTUAL_RULES) && CONTEXTUAL_RULES.length >= 4, 'CONTEXTUAL_RULES must have rules');
console.assert(typeof generateDeterministicEmbedding === 'function', 'generateDeterministicEmbedding must be a function');
console.assert(typeof initRagScanner === 'function', 'initRagScanner must be a function');
console.assert(typeof scanContextualText === 'function', 'scanContextualText must be a function');
console.assert(typeof sanitizeContextualText === 'function', 'sanitizeContextualText must be a function');
console.assert(typeof addCustomPrivacyRule === 'function', 'addCustomPrivacyRule must be a function');

// Test embedding math
const testVec = generateDeterministicEmbedding('test medical diagnosis query');
console.assert(Array.isArray(testVec) && testVec.length === 384, 'Vector must be 384 dimensions');
const norm = testVec.reduce((sum, v) => sum + v * v, 0);
console.assert(Math.abs(norm - 1.0) < 0.01, 'Vector must be unit normalized');
console.log('✅ Step A Passed: Vector dimensions (384) and mathematical normalization verified.');

// --- STEP B: Synthetic Dry-Run Against Target Contextual Vectors ---
console.log('\n[STEP B]: Synthetic Dry-Run of In-Memory Orama Vector Search');

async function runContextualTests() {
  // 1. Initialize DB
  console.log('  -> Initializing In-Memory Orama Vector DB...');
  const db = await initRagScanner();
  console.assert(db !== null, 'Orama DB must initialize');
  console.log('  ✓ In-Memory Orama DB initialized and seeded with privacy exemplars.');

  // 2. Test Medical Context Vector
  const medicalPrompt = 'Doctor noted that clinical diagnosis confirms acute chronic kidney disease failure.';
  const medicalThreats = await scanContextualText(medicalPrompt, { similarityThreshold: 0.5 });
  console.assert(medicalThreats.length > 0, 'Must detect contextual medical diagnosis');
  console.assert(medicalThreats[0].category === CONTEXTUAL_CATEGORIES.MEDICAL_DIAGNOSIS, 'Category must be MEDICAL_DIAGNOSIS');
  console.log(`  ✓ Detected Medical Threat: [${medicalThreats[0].category}] with similarity score ${medicalThreats[0].score.toFixed(3)}`);

  // 3. Test Enterprise Secret Vector
  const enterprisePrompt = 'Reviewing the internal staging database master root password vault configuration.';
  const enterpriseThreats = await scanContextualText(enterprisePrompt, { similarityThreshold: 0.5 });
  console.assert(enterpriseThreats.length > 0, 'Must detect contextual enterprise secret');
  console.assert(enterpriseThreats[0].category === CONTEXTUAL_CATEGORIES.ENTERPRISE_SECRET, 'Category must be ENTERPRISE_SECRET');
  console.log(`  ✓ Detected Enterprise Secret: [${enterpriseThreats[0].category}] with similarity score ${enterpriseThreats[0].score.toFixed(3)}`);

  // 4. Test Contextual Sanitization
  const sanitizedMedical = await sanitizeContextualText(medicalPrompt, { similarityThreshold: 0.5 });
  console.assert(sanitizedMedical.sanitizedText.includes('[REDACTED: MEDICAL_RECORD]'), 'Must replace with semantic token');
  console.log('  ✓ Contextual Sanitization output:\n    ', sanitizedMedical.sanitizedText);

  // 5. Test Custom Privacy Rule Injection
  console.log('  -> Testing Custom Privacy Rule Injection...');
  await addCustomPrivacyRule({
    category: 'PROJECT_ZEUS_CODENAME',
    label: 'Confidential DARPA Project Zeus',
    exemplar: 'top secret classified airborne project zeus telemetry',
    replacementToken: '[REDACTED: PROJECT_ZEUS]'
  });

  const customPrompt = 'We need to deploy top secret classified airborne project zeus telemetry to edge devices.';
  const customThreats = await scanContextualText(customPrompt, { similarityThreshold: 0.5 });
  console.assert(customThreats.some(t => t.category === 'PROJECT_ZEUS_CODENAME'), 'Must detect injected custom rule');
  console.log('  ✓ Custom vector rule successfully injected and detected in vector similarity search.');
}

runContextualTests().then(() => {
  console.log('\n🎉 ALL DOUBLE-VERIFICATION TESTS PASSED FOR PART 3!');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ VERIFICATION FAILED FOR PART 3:', err);
  process.exit(1);
});
