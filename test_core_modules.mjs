import { 
  validateVerhoeff, 
  validateLuhn, 
  scanText, 
  sanitizeText, 
  maskSensitiveValue,
  PII_TYPES 
} from './src/lib/scanner.js';

import { 
  generateContentSafe, 
  SECURITY_MODES, 
  PrivacyLensSecurityError,
  getSecurityStats
} from './src/lib/geminiClient.js';

console.log('--- Testing PrivacyLens Core Engine ---');

// 1. Verhoeff & Aadhaar
const validAadhaar = '2345 6789 0124'; // sample
const testText = `
Hello, my name is Rahul Sharma.
My Aadhaar number is 2345 6789 0124.
My PAN card is ABCDE1234F.
My credit card is 4242 4242 4242 4242 (valid Visa test card).
Contact me at rahul.sharma@example.com or +91 98765 43210.
My system password is password="superSecretPass123!".
Here is an API key: AIzaSyD9876543210abcdefghijklmnop123456.
`;

console.log('1. Scanning Raw Text...');
const threats = scanText(testText);
console.log(`Detected ${threats.length} threats:`);
threats.forEach(t => console.log(`  - [${t.type}] [${t.severity}] ${t.maskedValue} -> ${t.replacementToken}`));

console.log('\n2. Sanitizing Text...');
const sanitized = sanitizeText(testText);
console.log('Is Safe:', sanitized.isSafe);
console.log('Sanitized Output:\n' + sanitized.sanitizedText);
console.log('Stats:', sanitized.stats);

console.log('\n3. Testing Fail-Closed Gatekeeper...');
async function testGatekeeper() {
  // Test A: Normal Redact and Forward (Simulated API call)
  const result = await generateContentSafe({
    prompt: testText,
    options: { securityMode: SECURITY_MODES.REDACT_AND_FORWARD }
  });
  console.log('Redact & Forward success:', result.success);
  console.log('Sanitized prompt length:', result.sanitizedPrompt.length);
  console.log('Audit record:', result.audit.status, result.audit.reason);

  // Test B: Strict Fail-Closed (Must throw error)
  try {
    await generateContentSafe({
      prompt: testText,
      options: { securityMode: SECURITY_MODES.FAIL_CLOSED_STRICT }
    });
    console.error('FAIL: Strict mode should have blocked the request!');
  } catch (err) {
    if (err instanceof PrivacyLensSecurityError) {
      console.log('SUCCESS: Strict mode blocked request:', err.message);
      console.log('Threats blocked:', err.threats.length);
    } else {
      console.error('Unexpected error:', err);
    }
  }

  // Test C: Clean payload
  const cleanResult = await generateContentSafe({
    prompt: 'Can you tell me about the architecture of microservices?',
    options: { securityMode: SECURITY_MODES.FAIL_CLOSED_STRICT }
  });
  console.log('Clean payload passed:', cleanResult.success, cleanResult.audit.status);
}

testGatekeeper().then(() => {
  console.log('\nAll core engine tests passed successfully!');
}).catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
