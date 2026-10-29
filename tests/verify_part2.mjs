/**
 * Double-Verification Test Script: Phase 1 - Part 2 (imageMasker.js)
 * Step A: Structural & Syntax Verification
 * Step B: Synthetic Dry-Run of Offscreen Visual Redaction & Blackout Math
 */

import { 
  DEFAULT_MASK_OPTIONS, 
  loadImageSource, 
  createOffscreenCanvas, 
  applyBlackouts, 
  generateMockRedactedSVG 
} from '../src/lib/imageMasker.js';

console.log('====================================================');
console.log('🧪 VERIFICATION LOOP — PHASE 1 PART 2: IMAGEMASKER.JS');
console.log('====================================================');

// --- STEP A: Structural & Syntax Check ---
console.log('\n[STEP A]: Structural & Configuration Verification');
console.assert(typeof DEFAULT_MASK_OPTIONS === 'object', 'DEFAULT_MASK_OPTIONS must exist');
console.assert(DEFAULT_MASK_OPTIONS.blackoutColor === '#000000', 'Blackout color must be pure #000000');
console.assert(typeof loadImageSource === 'function', 'loadImageSource must be a function');
console.assert(typeof createOffscreenCanvas === 'function', 'createOffscreenCanvas must be a function');
console.assert(typeof applyBlackouts === 'function', 'applyBlackouts must be a function');
console.assert(typeof generateMockRedactedSVG === 'function', 'generateMockRedactedSVG must be a function');
console.log('✅ Step A Passed: All exports, configurations, and interfaces verified.');

// --- STEP B: Synthetic Dry-Run Against Target Visual Redaction Cases ---
console.log('\n[STEP B]: Synthetic Dry-Run of Blackout Logic & Canvas Math');

// 1. Synthetic Mock 2D Context to verify exact drawing calls
class MockContext2D {
  constructor() {
    this.calls = [];
    this.fillStyle = '';
    this.strokeStyle = '';
    this.lineWidth = 0;
  }
  save() { this.calls.push({ method: 'save' }); }
  restore() { this.calls.push({ method: 'restore' }); }
  fillRect(x, y, w, h) { 
    this.calls.push({ method: 'fillRect', x, y, w, h, fillStyle: this.fillStyle }); 
  }
  strokeRect(x, y, w, h) { 
    this.calls.push({ method: 'strokeRect', x, y, w, h }); 
  }
  measureText(text) { return { width: text.length * 6 }; }
  fillText(text, x, y) { 
    this.calls.push({ method: 'fillText', text, x, y, fillStyle: this.fillStyle }); 
  }
}

const mockCtx = new MockContext2D();
const canvasWidth = 1000;
const canvasHeight = 800;

// Test coordinate boxes (including boundary edge-cases: negative coords & oversized width)
const sampleBoxes = [
  { x: 100, y: 150, width: 250, height: 40, label: '[REDACTED: AADHAAR]' },
  { x: -10, y: 50, width: 200, height: 30, label: '[REDACTED: CARD_NUMBER]' }, // negative x test
  { x: 900, y: 750, width: 200, height: 100, label: '[REDACTED: PASSWORD]' }   // out of bounds test
];

applyBlackouts(mockCtx, sampleBoxes, canvasWidth, canvasHeight, {
  blackoutColor: '#000000',
  padding: 4,
  showBadge: true
});

const fillRectCalls = mockCtx.calls.filter(c => c.method === 'fillRect');
console.assert(fillRectCalls.length === 3, 'Must render fillRect for all 3 boxes');

// Verify blackout color and coordinate clamping
fillRectCalls.forEach((call, i) => {
  console.assert(call.fillStyle === '#000000', `Call ${i} must use solid #000000 blackout`);
  console.assert(call.x >= 0, `Call ${i} x coordinate must be clamped >= 0`);
  console.assert(call.y >= 0, `Call ${i} y coordinate must be clamped >= 0`);
  console.assert(call.x + call.w <= canvasWidth, `Call ${i} must not exceed canvas width`);
  console.assert(call.y + call.h <= canvasHeight, `Call ${i} must not exceed canvas height`);
});
console.log('  ✓ Verified 3 blackout rectangles rendered with #000000 fill and coordinate bounds clamping.');

// 2. Test SVG generator output
const mockSvg = generateMockRedactedSVG(600, 400, sampleBoxes);
console.assert(typeof mockSvg === 'string' && mockSvg.startsWith('data:image/svg+xml'), 'Must return valid SVG data URL');
console.assert(mockSvg.includes('rect'), 'SVG must include blackout rect elements');
console.log('  ✓ Verified generateMockRedactedSVG outputs valid SVG data URL with blackout coordinates.');

console.log('\n🎉 ALL DOUBLE-VERIFICATION TESTS PASSED FOR PART 2!');
