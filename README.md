# 🛡️ PrivacyLens (PS-004)
### Client-Side Privacy-Preserving AI Browser Agent Shield & Safety Gateway

[![PECathon 2026](https://img.shields.io/badge/PECathon_2026-PS--004_PrivacyLens-0284c7?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/PECathon-2026/05-HoneyPoters)
[![Zero Cloud Leakage](https://img.shields.io/badge/Zero_Cloud_Leakage-100%25_Verified-10b981?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/PECathon-2026/05-HoneyPoters)
[![Production Build](https://img.shields.io/badge/Production_Build-Passing_(416ms)-38bdf8?style=for-the-badge&logo=vite&logoColor=white)](https://github.com/PECathon-2026/05-HoneyPoters)
[![Team](https://img.shields.io/badge/Team-05--HoneyPoters-f59e0b?style=for-the-badge&logo=github&logoColor=white)](https://github.com/PECathon-2026/05-HoneyPoters)
[![Compliance](https://img.shields.io/badge/Compliance-DPDP_Act_2023_|_GDPR-a855f7?style=for-the-badge)](./PROJECT_DOCUMENTATION.md)

**PECathon 2026 (PECFEST)** — Punjab Engineering College (PEC), Chandigarh  
**Team Name:** `05-HoneyPoters`  
**Problem Statement:** `PS-004` (PrivacyLens: Client-side Privacy-Preserving AI Browser / Safety Gateway)  
**Repository:** [https://github.com/PECathon-2026/05-HoneyPoters](https://github.com/PECathon-2026/05-HoneyPoters)

---

> ### 💡 Core Mantra
> *"Compute what is sensitive locally. Reason globally only on sanitized data."*
> 
> PrivacyLens enforces a strict **Zero Cloud Leakage** boundary by intercepting, scanning, detecting, masking, and redacting sensitive PII (Aadhaar, PAN, Credit Cards, Passwords, OTPs, Contact details, API Keys, Medical/Contextual secrets, and visual DOM coordinates) on the client side **BEFORE** any text payload or visual screenshot ever leaves the browser.

---

## 📐 System Architecture & End-to-End Data Flow

```text
  +-------------------------------------------------------------------------------------------------+
  |                                   CLIENT-SIDE BROWSER (EDGE)                                    |
  |                                                                                                 |
  |   +--------------------+               +----------------------------------------------------+   |
  |   |  User Input / DOM  |  --------->   | DOM Attribute Inspector & Live Input Badges        |   |
  |   |  (Forms, Prompts)  |               | (Password, CVV, Card Auto-detect, scanDOM())       |   |
  |   +--------------------+               +----------------------------------------------------+   |
  |             |                                                    |                              |
  |             v                                                    v                              |
  |   +----------------------------+                       +------------------------------------+   |
  |   | Local Deterministic Engine |                       | HTML5 Offscreen Canvas Masker      |   |
  |   | (Aadhaar Verhoeff, Luhn,   |                       | (Solid #000000 Permanent Blackout, |   |
  |   |  PAN, Passwords, API Keys) |                       |  Coordinate Bounds Clamping Math)  |   |
  |   +----------------------------+                       +------------------------------------+   |
  |             |                                                    |                              |
  |             +--------------------------+-------------------------+                              |
  |                                        |                                                        |
  |                                        v                                                        |
  |                          +---------------------------+                                          |
  |                          | In-Browser Contextual RAG |                                          |
  |                          | (MiniLM-L6-v2 + Orama DB) |                                          |
  |                          | 100% Local Vector Search  |                                          |
  |                          +---------------------------+                                          |
  |                                        |                                                        |
  |                                        v                                                        |
  |                        +===============================+                                        |
  |                        | FAIL-CLOSED SAFETY GATEKEEPER |                                        |
  |                        |  (Double-Verification Barrier)|                                        |
  |                        +===============================+                                        |
  |                           /                         \                                           |
  |         [Synthetic Canary Probe Tripwire]      [Post-Sanitization Check]                        |
  |         (runCanaryLeakageTest Honeypots)       (Zero Residual PII Asserted)                     |
  |                   /                                         \                                   |
  |         [Leak Caught / Strict Block]                  [100% Verified Safe]                      |
  |                   v                                           v                                 |
  |         +-------------------+                       +-------------------+                       |
  |         | HARD NETWORK ABORT|                       | Outbound Payload  |                       |
  |         | (Dynamic Tuning & |                       | (Semantic Tokens) |                       |
  |         |  Tamper-Proof Log)|                       +-------------------+                       |
  |         +-------------------+                                 |                                 |
  |                   ^                                           | Safe fetch()                    |
  |                   |                                           v                                 |
  |         +----------------------------------+    +---------------------------+                   |
  |         | Local RAM Secret Vault           |    | EXTERNAL CLOUD AI / APIs  |                   |
  |         | (secretInjector.js DOM Bridge)   |    | (Google Gemini 1.5 Flash) |                   |
  |         | Maps tokens -> RAM -> DOM Autofill|   +---------------------------+                   |
  |         +----------------------------------+                  |                                 |
  |                   ^                                           | AI Action Execution Response    |
  |                   |                                           v                                 |
  |                   +----------------- [Local AI Action Injection Bridge]                         |
  +-------------------------------------------------------------------------------------------------+
```

---

## 🚀 Key Technical Pillars

1. **Deterministic Algorithmic & Regex Scanning (`src/lib/scanner.js`)**:
   - Indian standard checksums: **Verhoeff algorithm** for UIDAI Aadhaar verification.
   - Financial checksums: **Luhn algorithm (MOD-10)** for Visa, MasterCard, RuPay, Amex.
   - Strict pattern matchers for PAN, emails, Indian & international phone formats, passwords, 6-digit OTPs, API keys (`AIza...`, `sk-...`, `AKIA...`), and JWT tokens.
   - Live DOM attribute scanner for password fields, credit card autocomplete, and sensitive data attributes.

2. **Offscreen Canvas Visual Masker (`src/lib/imageMasker.js`)**:
   - Zero-pixel-leakage HTML5 offscreen canvas processor.
   - Implements permanent solid `#000000` blackout rectangles with 4px safety margins and cyan security seals over detected facial/DOM coordinate boxes.
   - Generates sanitized base64 and standard Google Gemini 1.5 Flash Vision multimodal JSON payloads.

3. **In-Browser Contextual RAG Privacy Engine (`src/lib/ragScanner.js`)**:
   - 100% client-side vector embeddings powered by `@xenova/transformers` (`all-MiniLM-L6-v2`) and in-memory **Orama Vector DB**.
   - Contextual detection for non-regex sensitive records (medical diagnoses, corporate secrets, biometric notes).

4. **Fail-Closed Gatekeeper & Synthetic Canary Honeypots (`src/lib/geminiClient.js`)**:
   - Automated synthetic canary tripwire (`runCanaryLeakageTest`): injects honeypot secrets into outbound test buffers.
   - If an unredacted canary leaks, executes **Dynamic Threshold Tuning** (lowers similarity threshold to 0.35, upgrades to `FAIL_CLOSED_STRICT`), re-sanitizes, and triggers a **Client-Side Hard Abort** alert over `BroadcastChannel`.

5. **Local Secret Injection Helper / DOM Automation Bridge (`src/lib/secretInjector.js`)**:
   - Solves the autonomous browser agent privacy paradox: AI agents reason and issue actions globally using semantic tokens (`[REDACTED: CARD_NUMBER]`, `[REDACTED: PASSCODE]`), while the local extension resolves and injects real secrets into DOM inputs from volatile browser RAM.

---

## 📊 Phase-Wise Progress Checklist

| Phase | Milestone / Module | Status | Verification Evidence |
| :--- | :--- | :---: | :---: |
| **Phase 1** | **Local Foundation & Core Engines** | 🟢 **Completed & Verified** | Automated 2x Test Suite |
| ↳ Part 1 | Local Regex & Algorithmic Scanner (`scanner.js`) | 🟢 **Verified & Pushed** | Verhoeff + Luhn + 11 PII Types Tested |
| ↳ Part 2 | HTML5 Canvas Visual Redactor (`imageMasker.js`) | 🟢 **Verified & Pushed** | Offscreen Canvas + Solid #000000 Blackouts |
| ↳ Part 3 | In-Browser Contextual RAG Engine (`ragScanner.js`) | 🟢 **Verified & Pushed** | MiniLM + Orama In-Memory Vector Search |
| ↳ Part 4 | Fail-Closed Safety Proxy (`geminiClient.js`) | 🟢 **Verified & Pushed** | Residual Leak Hard-Abort + Gemini Dispatch |
| **Phase 2** | **Extension Gateway & Interactive React Dashboard** | 🟢 **Completed & Verified** | Automated 2x Test Suite |
| ↳ Part 1 | Chrome Extension Gateway & Service Worker (`extension/`) | 🟢 **Verified & Pushed** | Manifest V3 + BroadcastChannel + DOM Scan |
| ↳ Part 2 | Glassmorphic React Dashboard UI (`ShieldDashboard.jsx`) | 🟢 **Verified & Pushed** | Tailwind CSS + Active Threat Ticker + Attack Tester |
| ↳ Part 3 | Live Recharts Analytics (`PrivacyAnalytics.jsx`) | 🟢 **Verified & Pushed** | Time-Series Area + Category Bar + Health Gauge |
| ↳ Part 4 | BroadcastChannel IPC & Diff Inspector (`PayloadDiffInspector.jsx`) | 🟢 **Verified & Pushed** | Side-by-side Payload Diff + Fail-Closed Alert |
| **Phase 3** | **Evaluation Scenarios, Synthetic Benchmarks & Secret Injector** | 🟢 **Completed & Verified** | Automated 2x Test Suite |
| ↳ Part 1 | 5 Official PDF Evaluation Scenarios (`testScenarios.js` & `EvaluationScenarios.jsx`) | 🟢 **Verified & Pushed** | E-commerce + Auth + Support + Faces + Dev Settings (100% Pass) |
| ↳ Part 2 | Automated Synthetic Canary Testing & Re-Sanitization (`geminiClient.js`) | 🟢 **Verified & Pushed** | Canary Honeypot Injections + Dynamic Threshold Tuning + Hard Abort |
| ↳ Part 3 | Local Secret Injection Helper & DOM Bridge (`secretInjector.js`) | 🟢 **Verified & Pushed** | Semantic Token RAM Mapping + DOM Autofill |
| **Phase 4** | **Production Build Polish, Bundle Verification & Final Documentation** | 🟢 **Completed & Verified** | Automated 2x Test Suite |
| ↳ Part 1 | Production Build Polish & Code Splitting (`vite.config.js`) | 🟢 **Verified & Pushed** | Modular Rolldown Chunks (< 400kB) + Asset Sync |
| ↳ Part 3 | Final Documentation, Architecture & GitHub Readiness (`README.md`) | 🟢 **Verified & Pushed** | Complete Phase 1-4 Coverage + Reproduction Suite |

---

## 🧪 5 Official PDF Evaluation Scenarios Covered

PrivacyLens natively implements and tests the 5 mandatory evaluation scenarios from the PS-004 specification:

| # | Scenario | Evaluated Target Surfaces | Redaction Result | Standalone Mock Page |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **E-Commerce Checkout** | Visa Card (Luhn-verified), CVV, Residential Address | `[REDACTED: CARD_NUMBER]`, `[REDACTED: CVV]`, `[REDACTED: SHIPPING_ADDRESS]` | [`/mock/ecommerce-checkout.html`](./public/mock/ecommerce-checkout.html) |
| **2** | **Authentication & Identity** | Passwords, Login Emails, 6-digit OTP codes | `[REDACTED: EMAIL]`, `[REDACTED: PASSCODE]`, `[REDACTED: OTP]` | [`/mock/authentication.html`](./public/mock/authentication.html) |
| **3** | **Customer Support Chat** | Phone numbers (+91, US formats), Private Inquiry Logs | `[REDACTED: PHONE_NUMBER]`, `[REDACTED: PRIVATE_CHAT_LOG]` | [`/mock/customer-support.html`](./public/mock/customer-support.html) |
| **4** | **Video/Profile Faces** | Profile pictures, Video streams, Facial landmarks | Solid `#000000` Blackout + Gemini Vision Multimodal JSON | [`/mock/profile-faces.html`](./public/mock/profile-faces.html) |
| **5** | **Developer Settings** | Cloud API Keys (`AIza...`, `sk-...`), JWTs, IP Addresses | `[REDACTED: API_KEY]`, `[REDACTED: AUTH_TOKEN]`, `[REDACTED: IP_ADDRESS]` | [`/mock/developer-settings.html`](./public/mock/developer-settings.html) |

---

## 🛠️ Quick Start & Local Reproduction Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm
- Google Chrome (for Chrome Extension testing)

### 1. Installation
```bash
git clone https://github.com/PECathon-2026/05-HoneyPoters.git
cd 05-HoneyPoters
npm install
```

### 2. Run Automated Verification Test Suites
```bash
# Run core engine tests (Regex, Checksums, Gatekeeper)
npm test

# Run 5 Official PDF Evaluation Scenarios benchmark
node tests/verify_phase3_evaluation_scenarios.mjs

# Run Synthetic Canary Honeypot Probe & Tripwire test
node tests/verify_phase3_canary_leakage.mjs

# Run Local Secret Injection & DOM Automation Bridge test
node tests/verify_phase3_secret_injector.mjs

# Run Extension Popup Storage Persistence & Favicon verification test
node tests/verify_popup_and_favicon.mjs
```

### 3. Start Vite Development Server
```bash
npm run dev
# Open http://localhost:5173 to access the Shield Dashboard & Evaluation Scenarios Lab
```

### 4. Build for Production
```bash
npm run build
# Generates optimized, code-split production bundles in dist/ in under 500ms
```

### 5. Load Chrome Extension in Developer Mode
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in top-right corner).
3. Click **Load unpacked** and select the `extension/` directory from this repository.
4. PrivacyLens will immediately begin intercepting outbound DOM inputs and syncing with the dashboard!

---

## 📖 In-Depth Technical Documentation

For complete technical deep-dives, architectural rationales, Hindi-English conceptual breakdowns (*Kya Hai, Kyu Hai, Kaise Kaam Kar Raha Hai*), and forensic test evidence, refer to:  
👉 **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**

---

## 👥 Team 05-HoneyPoters
- **Pranav Pushya** — Team Lead & Core Engine Architect
- **Teammate 1** — UI/UX Layout & Dashboard Visuals
- **Teammate 2** — Mock Data, Test Vectors & Audit Logs
- **Teammate 3** — Pitch Deck, Documentation & Jury Presentation
