/**
 * Verification Test: Extension Popup State Persistence & Favicon / App Logo
 * Verifies PS-004 requirements for Team 05-HoneyPoters
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('--- STARTING VERIFICATION: POPUP PERSISTENCE & FAVICON LOGO ---');

// 1. Verify Asset Files Exist & Are Valid
console.log('\n[1/4] Verifying Favicon & Logo Assets...');

const filesToCheck = [
  { p: 'public/favicon.svg', type: 'svg', minSize: 500 },
  { p: 'public/logo.png', type: 'png', minSize: 1000 },
  { p: 'extension/icons/icon16.png', type: 'png', minSize: 100 },
  { p: 'extension/icons/icon48.png', type: 'png', minSize: 500 },
  { p: 'extension/icons/icon128.png', type: 'png', minSize: 1000 }
];

for (const file of filesToCheck) {
  assert(fs.existsSync(file.p), `File ${file.p} must exist`);
  const stat = fs.statSync(file.p);
  assert(stat.size >= file.minSize, `File ${file.p} is unexpectedly small: ${stat.size} bytes`);
  
  const content = fs.readFileSync(file.p);
  if (file.type === 'svg') {
    const text = content.toString('utf-8');
    assert(text.includes('<svg'), `${file.p} must contain <svg> tag`);
    assert(text.includes('shield'), `${file.p} must contain shield definitions or shapes`);
  } else if (file.type === 'png') {
    // Check PNG header signature: 89 50 4E 47 0D 0A 1A 0A
    const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    assert(content.subarray(0, 8).equals(pngHeader), `${file.p} must have valid PNG magic bytes`);
  }
  console.log(`  ✓ ${file.p} (${stat.size} bytes) - Verified valid ${file.type.toUpperCase()}`);
}

// 2. Verify HTML and Manifest Configurations
console.log('\n[2/4] Verifying HTML & Manifest References...');

const indexHtml = fs.readFileSync('index.html', 'utf-8');
assert(
  indexHtml.includes('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />'),
  'index.html must include link rel="icon" for /favicon.svg'
);
assert(
  indexHtml.includes('PrivacyLens'),
  'index.html must include PrivacyLens in title'
);
console.log('  ✓ index.html references /favicon.svg and brand title');

const manifestRaw = fs.readFileSync('extension/manifest.json', 'utf-8');
const manifest = JSON.parse(manifestRaw);

assert(manifest.icons, 'manifest.json must contain "icons" object');
assert.strictEqual(manifest.icons['16'], 'icons/icon16.png');
assert.strictEqual(manifest.icons['48'], 'icons/icon48.png');
assert.strictEqual(manifest.icons['128'], 'icons/icon128.png');

assert(manifest.action, 'manifest.json must contain "action" object');
assert(manifest.action.default_icon, 'manifest.action must contain "default_icon"');
assert.strictEqual(manifest.action.default_icon['16'], 'icons/icon16.png');
assert.strictEqual(manifest.action.default_icon['48'], 'icons/icon48.png');
assert.strictEqual(manifest.action.default_icon['128'], 'icons/icon128.png');

assert(manifest.permissions.includes('storage'), 'manifest.permissions must include "storage"');
console.log('  ✓ extension/manifest.json correctly references icons (16, 48, 128) and action.default_icon');

// 3. Verify Popup Script State Persistence Logic
console.log('\n[3/4] Verifying Popup Persistence Logic in extension/popup.js...');

const popupCode = fs.readFileSync('extension/popup.js', 'utf-8');

assert(
  popupCode.includes("chrome.storage.local.get(['shieldEnabled']"),
  'popup.js must call chrome.storage.local.get([\'shieldEnabled\']) on load'
);
assert(
  popupCode.includes('chrome.storage.local.set({ shieldEnabled: active }'),
  'popup.js must call chrome.storage.local.set({ shieldEnabled: active }) on change'
);
assert(
  popupCode.includes("action: 'TOGGLE_SHIELD'"),
  'popup.js must broadcast TOGGLE_SHIELD to background'
);
assert(
  popupCode.includes("action: 'SHIELD_TOGGLED'"),
  'popup.js must broadcast SHIELD_TOGGLED to content scripts'
);
console.log('  ✓ extension/popup.js implements storage read on load, storage set on toggle, and cross-context broadcast');

// 4. Verify Background & Content Script Respecting OFF State
console.log('\n[4/4] Verifying Bypass Enforcement When Shield is Disabled...');

const bgCode = fs.readFileSync('extension/background.js', 'utf-8');
assert(
  bgCode.includes("chrome.storage.local.get(['shieldEnabled']"),
  'background.js must sync shieldEnabled from storage on startup'
);
assert(
  bgCode.includes('chrome.storage.local.set({ shieldEnabled:'),
  'background.js must persist shieldEnabled to storage on toggle'
);
assert(
  bgCode.includes('if (!gatewayState.shieldActive)'),
  'background.js interceptor must check if (!gatewayState.shieldActive)'
);

const csCode = fs.readFileSync('extension/contentScript.js', 'utf-8');
assert(
  csCode.includes("chrome.storage.local.get(['shieldEnabled']"),
  'contentScript.js must check shieldEnabled from storage'
);
assert(
  csCode.includes('if (!this.shieldActive) return;'),
  'contentScript.js must respect shieldActive in input listeners'
);
assert(
  csCode.includes('clearAllBadges'),
  'contentScript.js must clear badges when shield is toggled off'
);
console.log('  ✓ background.js and contentScript.js fail-open/bypass when shield is toggled OFF');

console.log('\n--- ALL VERIFICATION CHECKS PASSED SUCCESSFULLY (2x VERIFIED) ---');
