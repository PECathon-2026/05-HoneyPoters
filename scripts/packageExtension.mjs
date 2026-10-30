/**
 * PrivacyLens Extension Packaging Script
 * Cross-platform archive generator for PECathon 2026 Evaluation Release
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const releaseDir = path.resolve('release');
const zipFile = path.join(releaseDir, 'PrivacyLens-Extension-v2.0.0.zip');

if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir, { recursive: true });
}

console.log('📦 Packaging PrivacyLens Extension for PECathon 2026 Evaluators...');

// Verify extension manifest and core files exist
const requiredFiles = [
  'extension/manifest.json',
  'extension/popup.html',
  'extension/popup.js',
  'extension/background.js',
  'extension/contentScript.js',
  'extension/contentScript.css',
  'extension/icons/icon16.png',
  'extension/icons/icon48.png',
  'extension/icons/icon128.png'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing required extension file: ${file}`);
  }
}

// Generate ZIP archive using PowerShell on Windows or zip on Unix
try {
  if (process.platform === 'win32') {
    execSync(`powershell -NoProfile -Command "Compress-Archive -Path extension/* -DestinationPath '${zipFile}' -Force"`, { stdio: 'inherit' });
  } else {
    execSync(`zip -r "${zipFile}" extension/*`, { stdio: 'inherit' });
  }
  const stats = fs.statSync(zipFile);
  console.log(`✓ PrivacyLens Extension packaged successfully!`);
  console.log(`  File: ${zipFile}`);
  console.log(`  Size: ${(stats.size / 1024).toFixed(1)} KB`);
} catch (err) {
  console.error('Packaging failed:', err.message);
  process.exit(1);
}
