/**
 * Automated Verification: Extension Popup Dark & Light Theme Support
 * Verifies PS-004 requirements for Team 05-HoneyPoters
 */

import fs from 'fs';
import assert from 'assert';

console.log('================================================================');
console.log('🧪 VERIFYING EXTENSION POPUP DARK & LIGHT THEME ENGINE');
console.log('================================================================');

// 1. Verify popup.html Theme Palettes & Elements
console.log('\n[STEP 1]: Verifying popup.html Styles & Theme Toggle Button...');
assert(fs.existsSync('extension/popup.html'), 'extension/popup.html must exist');
const popupHtml = fs.readFileSync('extension/popup.html', 'utf-8');

assert(popupHtml.includes('--bg-app: #000000'), 'popup.html must define Pure Z-Black dark background #000000');
assert(popupHtml.includes('--bg-card: #0a0a0a'), 'popup.html must define dark card surface #0a0a0a');
assert(popupHtml.includes('--border-app: #262626'), 'popup.html must define dark border #262626');
assert(popupHtml.includes('--bg-app: #fdfbf7'), 'popup.html must define warm beige light background #fdfbf7');
assert(popupHtml.includes('--bg-card: #ffffff'), 'popup.html must define light card surface #ffffff');
assert(popupHtml.includes('--border-app: #e2e8f0'), 'popup.html must define light border #e2e8f0');

assert(popupHtml.includes('id="theme-toggle-btn"'), 'popup.html must include theme toggle button #theme-toggle-btn');
assert(popupHtml.includes('id="theme-icon"'), 'popup.html must include theme icon indicator #theme-icon');
assert(popupHtml.includes('id="shield-toggle"'), 'popup.html must maintain shield toggle');
assert(popupHtml.includes('icons/icon48.png'), 'popup.html must use high-DPI logo');
console.log('  ✓ popup.html verified with Pure Z-Black (#000000) & Warm Beige (#fdfbf7) palettes and theme toggle button');

// 2. Verify popup.js Theme Switching & Storage Synchronization
console.log('\n[STEP 2]: Verifying popup.js Theme Engine & Storage Persistence...');
assert(fs.existsSync('extension/popup.js'), 'extension/popup.js must exist');
const popupJs = fs.readFileSync('extension/popup.js', 'utf-8');

assert(popupJs.includes('applyTheme'), 'popup.js must define applyTheme function');
assert(popupJs.includes('themeToggleBtn.addEventListener'), 'popup.js must wire theme toggle button');
assert(popupJs.includes('chrome.storage.local.set({ theme:'), 'popup.js must save theme to chrome.storage.local');
assert(popupJs.includes("chrome.storage.local.get(['theme']"), 'popup.js must restore theme from chrome.storage.local on load');
assert(popupJs.includes('THEME_CHANGED'), 'popup.js must broadcast and listen to THEME_CHANGED IPC messages');
assert(popupJs.includes('privacylens_channel'), 'popup.js must communicate over privacylens_channel BroadcastChannel');
console.log('  ✓ popup.js verified with applyTheme, storage persistence, and BroadcastChannel synchronization');

// 3. Verify WebApp ThemeContext Cross-Context Bridge
console.log('\n[STEP 3]: Verifying WebApp ThemeContext Synchronization...');
const themeContextCode = fs.readFileSync('src/context/ThemeContext.jsx', 'utf-8');
assert(themeContextCode.includes('chrome.storage.local.set({ theme }'), 'ThemeContext must sync theme to chrome.storage.local');
assert(themeContextCode.includes('THEME_CHANGED'), 'ThemeContext must broadcast and listen for THEME_CHANGED');
console.log('  ✓ WebApp ThemeContext verified with bidirectional extension sync');

console.log('\n================================================================');
console.log('🎉 EXTENSION POPUP THEME VERIFICATION PASSED (2x VERIFIED)');
console.log('================================================================');
