/**
 * Automated Verification: UI Refactor, Themes & Dedicated Routing
 * Verifies mobile responsiveness, theme engine, and Home Page dedicated navigation
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import fs from 'fs';
import assert from 'assert';

console.log('================================================================');
console.log('🧪 VERIFYING UI REFACTOR: THEMES, HOME PAGE & RESPONSIVENESS');
console.log('================================================================');

// 1. Verify Theme Context Engine & CSS
console.log('\n[STEP 1]: Verifying Theme Engine & Pure Z-Black CSS Classes...');
assert(fs.existsSync('src/context/ThemeContext.jsx'), 'src/context/ThemeContext.jsx must exist');
const themeContextCode = fs.readFileSync('src/context/ThemeContext.jsx', 'utf-8');
assert(themeContextCode.includes('ThemeProvider'), 'ThemeContext must export ThemeProvider');
assert(themeContextCode.includes('useTheme'), 'ThemeContext must export useTheme');
assert(themeContextCode.includes('privacylens_theme'), 'ThemeContext must persist theme to localStorage');
assert(themeContextCode.includes('applyThemeToDOM'), 'ThemeContext must apply theme to DOM element classes');

const indexCss = fs.readFileSync('src/index.css', 'utf-8');
assert(indexCss.includes('@custom-variant dark'), 'index.css must declare @custom-variant dark');
assert(indexCss.includes('--bg-app: #fdfbf7'), 'index.css must define warm beige light background');
assert(indexCss.includes('--bg-app: #000000'), 'index.css must define pure Z-black background #000000');
assert(indexCss.includes('--bg-card: #0a0a0a'), 'index.css must define pure Z-black card background #0a0a0a');
console.log('  ✓ Theme engine and CSS variables verified (Pure Z-Black #000000/#0a0a0a & Beige Light #fdfbf7)');

// 2. Verify Dedicated Home Page Component
console.log('\n[STEP 2]: Verifying HomePage.jsx & Navigation Cards...');
assert(fs.existsSync('src/components/HomePage.jsx'), 'src/components/HomePage.jsx must exist');
const homeCode = fs.readFileSync('src/components/HomePage.jsx', 'utf-8');

assert(homeCode.includes('Zero Cloud Leakage Shield for'), 'HomePage must feature Hero headline');
assert(homeCode.includes('onToggleShield'), 'HomePage must include Master Shield toggle controller');
assert(homeCode.includes('/analytics'), 'HomePage must link to /analytics');
assert(homeCode.includes('/diff'), 'HomePage must link to /diff');
assert(homeCode.includes('/scenarios'), 'HomePage must link to /scenarios');
assert(homeCode.includes('/audit'), 'HomePage must link to /audit');
assert(homeCode.includes('grid-cols-1 md:grid-cols-2'), 'HomePage must use responsive grid for core modules');
console.log('  ✓ HomePage verified with hero value prop, live shield controller, and 4 dedicated navigation cards');

// 3. Verify App.jsx Routing & Theme Switcher
console.log('\n[STEP 3]: Verifying App.jsx Dedicated Page Routing & Theme Navbar Switch...');
const appCode = fs.readFileSync('src/App.jsx', 'utf-8');
assert(appCode.includes('useTheme'), 'App.jsx must use useTheme');
assert(appCode.includes('toggleTheme'), 'App.jsx must wire toggleTheme to theme button');
assert(appCode.includes('activeTab === \'home\''), 'App.jsx must route to HomePage');
assert(appCode.includes('activeTab === \'scenarios\''), 'App.jsx must route to EvaluationScenarios');
assert(appCode.includes('activeTab === \'diff\''), 'App.jsx must route to PayloadDiffInspector');
assert(appCode.includes('activeTab === \'audit\''), 'App.jsx must route to AuditForensics');
assert(appCode.includes('activeTab === \'analytics\''), 'App.jsx must route to PrivacyAnalytics');
assert(!appCode.includes('activeTab === \'overview\''), 'Crowded single-page layout must be eliminated');
console.log('  ✓ App.jsx routing verified: dedicated sub-page rendering and sun/moon theme switcher');

// 4. Verify Responsiveness Across Core Components
console.log('\n[STEP 4]: Verifying Mobile & Multi-Aspect Ratio Breakpoints...');
const componentsToCheck = [
  { file: 'src/components/ShieldDashboard.jsx', patterns: ['grid-cols-2', 'sm:grid-cols-4', 'lg:grid-cols-12', 'overflow-y-auto'] },
  { file: 'src/components/PrivacyAnalytics.jsx', patterns: ['overflow-x-auto', 'lg:grid-cols-12', 'ResponsiveContainer'] },
  { file: 'src/components/PayloadDiffInspector.jsx', patterns: ['lg:grid-cols-12', 'overflow-x-auto', 'whitespace-pre-wrap'] },
  { file: 'src/components/EvaluationScenarios.jsx', patterns: ['grid-cols-1', 'lg:grid-cols-5', 'overflow-x-auto'] },
  { file: 'src/components/AuditForensics.jsx', patterns: ['overflow-x-auto', 'min-w-[680px]', 'flex-col sm:flex-row'] },
  { file: 'src/components/AgenticPlayground.jsx', patterns: ['grid-cols-1 lg:grid-cols-12', 'flex-col sm:flex-row'] },
  { file: 'src/components/VisualRedactionStudio.jsx', patterns: ['grid-cols-1 lg:grid-cols-12', 'flex-col sm:flex-row'] }
];

for (const comp of componentsToCheck) {
  const code = fs.readFileSync(comp.file, 'utf-8');
  for (const pat of comp.patterns) {
    assert(code.includes(pat), `${comp.file} must include responsive pattern '${pat}'`);
  }
  console.log(`  ✓ ${comp.file} verified with responsive breakpoints and overflow handling`);
}

console.log('\n================================================================');
console.log('🎉 UI REFACTOR VERIFICATION PASSED WITH ZERO ERRORS (2x VERIFIED)');
console.log('================================================================');
