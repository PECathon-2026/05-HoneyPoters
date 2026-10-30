# 🛡️ PrivacyLens (PS-004)

### Client-Side Privacy-Preserving AI Browser Agent Shield & Safety Gateway

[![PECathon 2026](https://img.shields.io/badge/PECathon_2026-PS--004_PrivacyLens-0284c7?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/PECathon-2026/05-HoneyPoters)
[![Zero Cloud Leakage](https://img.shields.io/badge/Zero_Cloud_Leakage-100%25_Verified-10b981?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/PECathon-2026/05-HoneyPoters)
[![Production Build](https://img.shields.io/badge/Production_Build-Passing_(433ms)-38bdf8?style=for-the-badge&logo=vite&logoColor=white)](https://github.com/PECathon-2026/05-HoneyPoters)
[![Team](https://img.shields.io/badge/Team-05--HoneyPoters-f59e0b?style=for-the-badge&logo=github&logoColor=white)](https://github.com/PECathon-2026/05-HoneyPoters)
[![Compliance](https://img.shields.io/badge/Compliance-DPDP_Act_2023_|_GDPR-a855f7?style=for-the-badge)](./PROJECT_DOCUMENTATION.md)

**PECathon 2026 (PECFEST)** — Punjab Engineering College (PEC), Chandigarh
**Team Name:** `05-HoneyPoters`
**Problem Statement:** `PS-004` (PrivacyLens: Client-side Privacy-Preserving AI Browser / Safety Gateway)

---

> ### 💡 Core Mantra
>
> *"Compute what is sensitive locally. Reason globally only on sanitized data."*
>
> PrivacyLens enforces a strict **Zero Cloud Leakage** boundary by intercepting, scanning, detecting, masking, and redacting sensitive PII (Aadhaar, PAN, Credit Cards, Passwords, OTPs, Contact details, API Keys, Medical/Contextual secrets, and visual DOM coordinates) on the client side **BEFORE** any text payload or visual screenshot ever leaves the browser.

---

## 📑 Table of Contents

1. [Architecture Diagram and End-to-End Data Flow](#1-architecture-diagram-and-end-to-end-data-flow)
2. [Setup Instructions and Configuration](#2-setup-instructions-and-configuration)
3. [Detection and Sanitization Methodology](#3-detection-and-sanitization-methodology)
4. [AI Integration and Action Validation](#4-ai-integration-and-action-validation)
5. [Security Assumptions and Known Limitations](#5-security-assumptions-and-known-limitations)
6. [Evaluation Methodology and Reproducible Results](#6-evaluation-methodology-and-reproducible-results)
7. [Chrome Extension Gateway &amp; Web App UI](#7-chrome-extension-gateway--web-app-ui)
8. [Compliance &amp; Legal Standards Alignment](#8-compliance--legal-standards-alignment)

---

## 1. Architecture Diagram and End-to-End Data Flow

PrivacyLens implements a multi-tier client-side defense placed immediately ahead of any cloud dispatch, decoupling private credential storage from global AI reasoning.

### System Architecture Diagram

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

### End-to-End Request Lifecycle

1. **Ingestion & In-Page Monitoring**: User prompts, form inputs, or autonomous agent screen scrapes are intercepted before HTTP transmission.
2. **Deterministic Edge Inspection**: High-entropy regex matchers combined with mathematical checksum validators (Verhoeff for Aadhaar, Luhn for Cards) identify structured PII.
3. **Visual Coordinate Blackout**: Attached screenshots or viewport frames are mapped to DOM coordinate boxes and rendered to an HTML5 offscreen canvas where solid `#000000` blackout rectangles replace sensitive pixels.
4. **Contextual Semantic RAG**: Unstructured confidential narratives (e.g., medical diagnoses, corporate secrets) are matched locally in client RAM against an embedded vector database using dense embeddings.
5. **Fail-Closed Gatekeeper Check**: The sanitized output is re-scanned. If any residual secret is detected or if strict security policy is enabled, the request is **hard-aborted** in client RAM (0 bytes dispatched).
6. **External Model Reasoning**: Sanitized semantic tokens (`[REDACTED: CARD_NUMBER]`, `[REDACTED: PASSCODE]`) are transmitted to Google Gemini 1.5 Flash alongside strict system instructions forbidding unmasking attempts.
7. **Local Action Automation Bridge**: When the model issues automation commands, the local extension resolves semantic tokens from an ephemeral volatile RAM vault and populates DOM inputs directly, keeping credentials 100% private.

---

## 2. Setup Instructions and Configuration

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm (v9+) or pnpm
- **Browser**: Google Chrome or Chromium-based browser (v110+) for Chrome Extension testing

### Installation & Quick Start

```bash
# 1. Clone repository
git clone https://github.com/PECathon-2026/05-HoneyPoters.git
cd 05-HoneyPoters

# 2. Install dependencies
npm install

# 3. Start Secure Backend API Gateway (Port 3001)
npm run server

# 4. Start Vite Frontend WebApp (Port 5173)
npm run dev
# Open http://localhost:5173 to access the Shield Dashboard & Evaluation Scenarios Lab
```

### Production Build

```bash
npm run build
# Compiles optimized, code-split production bundles into dist/ in under 500ms
```

### Loading Chrome Extension in Developer Mode

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle switch in the upper-right corner.
3. Click **Load unpacked** and select the `extension/` directory from this repository.
4. The PrivacyLens Shield icon will appear in the toolbar. The extension actively monitors DOM inputs and synchronizes telemetry with the React dashboard over `BroadcastChannel`.

### Environment Configuration & Policy Options

Create an optional `.env` file in the project root:

```ini
# Optional: Google Gemini API Key for live cloud generation
# If omitted, PrivacyLens automatically executes in 100% Offline / Simulated Safe Mode
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Target Gemini model (default: gemini-1.5-flash)
VITE_GEMINI_MODEL=gemini-1.5-flash
```

#### Security Policy Modes (`src/lib/geminiClient.js`)

| Policy Mode                                    | Description                     | Behavior on PII Detection                                                                                               |
| :--------------------------------------------- | :------------------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| **`REDACT_AND_FORWARD`** *(Default)* | Standard PrivacyLens Gatekeeper | Replaces detected PII with semantic tokens, blackouts images, verifies zero residual leaks, and forwards clean payload. |
| **`FAIL_CLOSED_STRICT`**               | High-Paranoia Defense           | If **any** sensitive threat is detected, terminates request in client RAM with an immediate hard network abort.   |
| **`AUDIT_ONLY`**                       | Dev Inspection Mode             | Scans and logs threat metrics without modifying the outbound payload (development only).                                |

---

## 3. Detection and Sanitization Methodology

PrivacyLens rejects naive string search in favor of a layered, multi-technique defense pipeline combining algorithmic checksums, DOM structure inspection, offscreen canvas graphics, and in-browser vector search:

### 3.1 Deterministic Algorithmic & Regex Scanning (`src/lib/scanner.js`)

- **UIDAI Aadhaar Checksum (Verhoeff Algorithm)**: Implements dihedral group $D_5$ permutations using `VERHOEFF_D` multiplication tables and `VERHOEFF_P` permutation tables to validate the 12th checksum digit of Indian Aadhaar numbers.
- **Payment Cards (MOD-10 Luhn Algorithm)**: Implements reverse doubling modulo-10 validation across Visa, MasterCard, RuPay, and American Express formats (13–19 digits).
- **Pattern Matchers**:
  - **Indian PAN**: `\b([A-Z]{5}\d{4}[A-Z])\b` (case-insensitive).
  - **Indian & International Phone**: `(?:(?:\+91\|91\|0)[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b` and US/Intl `\+?1?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}`.
  - **Credentials & Auth**: Plaintext passwords (`password="..."`), 6-digit OTP codes, Cloud API keys (`AIza...`, `sk-...`, `AKIA...`), and JWT Bearer tokens (`eyJ...`).
  - **Infrastructure & Addresses**: IPv4 / IPv6 addresses, multi-part residential delivery addresses, and CVV security codes.
- **Back-to-Front Substitution**: Replaces matched entities from back to front using character offsets, ensuring preceding indices remain unchanged during token substitution.

### 3.2 DOM Structural & Attribute Analysis (`scanDOM`)

- Inspects `input`, `textarea`, `select`, and `[contenteditable="true"]` nodes.
- Inspects `type="password"`, `autocomplete` (`cc-number`, `current-password`, `one-time-code`), `id`, `name`, `placeholder`, `aria-label`, and `data-*` attributes.
- Computes visible screen coordinates (`getBoundingClientRect()`) and outputs pre-formatted bounding boxes for canvas visual masking.

### 3.3 Multimodal Visual Redaction (`src/lib/imageMasker.js`)

- **Offscreen Canvas Processor**: Renders raw screenshots to an offscreen HTML5 `<canvas>` or `OffscreenCanvas`.
- **Permanent Information Destruction**: Paints solid `#000000` blackout rectangles over target coordinates with 4px safety margins. Unlike blur or pixelation filters, solid blackouts cannot be mathematically inverted using deep-learning deconvolution attacks.
- **Coordinate Clamping**: Mathematically bounds all boxes to $x \ge 0$, $y \ge 0$, $w \le \text{canvasWidth} - x$, $h \le \text{canvasHeight} - y$.
- **High-Contrast Badging**: Stamps clean monospaced indicator badges (e.g. `[REDACTED: CARD_NUMBER]`).

### 3.4 In-Browser Contextual RAG Privacy Engine (`src/lib/ragScanner.js`)

- **100% Client-Side Vector Embeddings**: Embeds unstructured sentences into 384-dimensional dense vectors using `@xenova/transformers` (`all-MiniLM-L6-v2`) with an offline mathematical projection fallback.
- **In-Memory Orama Vector Database**: Performs local cosine similarity queries (`similarityThreshold: 0.50 – 0.65`) against vector exemplars in browser RAM with zero outbound network calls.
- **Catches Unstructured Narratives**: Neutralizes confidential records that lack rigid alphanumeric syntax (e.g., medical diagnoses, corporate secrets, salary compensation notes).

---

## 4. AI Integration and Action Validation

PrivacyLens addresses the central dilemma of autonomous web agents: *how can an AI fill forms and perform actions without being given real credentials?*

### 4.1 Ephemeral Local Secret Vault & DOM Bridge (`src/lib/secretInjector.js`)

- **Ephemeral RAM Vault (`LocalSecretVault`)**: Maps tokens to real secrets in volatile memory with configurable TTLs (default: 15 minutes). Secrets are automatically purged upon TTL expiration, session completion, or tab close.
- **Reverse De-Tokenization (`detokenizeText`)**: Resolves schema tokens back into actual values locally in client RAM.
- **Reactive DOM Synchronization (`injectIntoDOM`)**: Interacts with form inputs using native framework prototype setters (`HTMLInputElement.prototype.value`) and dispatches synthetic `input` and `change` events so React, Vue, and Angular applications synchronize state.

### 4.2 Action Validation & Unsafe Operation Rejection (`validateProposedAction`)

Before executing any AI-proposed action, PrivacyLens evaluates the action against strict safety policies:

- **Prohibited Target Selectors**: Rejects selectors targeting hazardous DOM tags (`<script>`, `<iframe>`, `<object>`, `<embed>`).
- **XSS & Injection Protection**: Rejects targets containing `javascript:` pseudoprotocols, `data:text/html`, or inline event handler attributes (`onload=`, `onerror=`).
- **DOM Target Verification**: Verifies that targeted elements exist in the DOM tree before attempting execution.
- If an invalid target is detected, execution fails closed with status `REJECTED_UNSAFE_OPERATION`.

### 4.3 Anti-Inference & Reconstruction Directives (`PRIVACY_LENS_SYSTEM_INSTRUCTION`)

All external Gemini API requests include standard system instructions forbidding the model from attempting to infer, guess, unmask, or hallucinate the original confidential values behind semantic placeholders (`[REDACTED: CARD_NUMBER]`, `[REDACTED: PASSCODE]`).

### 4.4 Human-in-the-Loop User Approval (`requiresUserApproval`)

Irreversible or high-risk operations are gated behind explicit user confirmation:

- Identifies sensitive actions: `SUBMIT_FORM`, `TRANSFER_FUNDS`, `DELETE`, `PAYMENT`, or actions populating critical financial credentials (`CARD_NUMBER`, `CVV`, `PASSCODE`).
- If `userApproved !== true`, execution halts immediately with status `PENDING_USER_APPROVAL`, preventing unauthorized automated transactions.

---

## 5. Security Assumptions and Known Limitations

### 5.1 Security Assumptions & Trust Boundaries

- **Trusted Computing Base (Client Edge)**: The client device, browser runtime, and extension background service worker are considered trusted boundaries. Memory allocated within the extension's volatile RAM is protected by browser process isolation.
- **Untrusted External Cloud**: All third-party LLM APIs (Google Gemini, Anthropic Claude, OpenAI), cloud proxy servers, and external log aggregators are treated as untrusted boundaries. No plaintext PII or raw pixels cross this perimeter.
- **Untrusted Web Pages**: Target web pages navigated by autonomous agents are treated as untrusted. Hostile scripts cannot access `LocalSecretVault` instances running inside the isolated extension context.
- **Ephemeral Retention**: Audit logs permanently omit raw credentials and store only masked representations (`XXXX-XXXX-0124`, `****-****-****-4242`).

### 5.2 Known Limitations

1. **Heavily Obfuscated or Handwritten Visual Text**: The visual canvas masker redacts coordinate regions derived from DOM elements or face detectors. Screenshots containing handwritten notes or non-DOM text embedded inside complex images require dedicated client-side OCR for automated coordinate discovery.
2. **Dynamic SPA Mutation Timing**: In heavy single-page applications with deferred virtualized rendering, input fields rendered dynamically after initial DOM scan must be caught by live `input` and `focusin` event listeners.
3. **Client-Side Heavy Model Constraints**: Running full multi-billion parameter LLMs locally in browser memory can cause memory pressure on low-spec hardware. PrivacyLens solves this by using lightweight 384-dimensional dense embeddings (`all-MiniLM-L6-v2`) and in-memory Orama DB (< 50MB RAM), delegating reasoning to cloud models on sanitized tokens.

---

## 6. Evaluation Methodology and Reproducible Results

PrivacyLens has been evaluated against all 5 official evaluation scenarios and measured against all 7 official evaluation criteria from the PS-004 specification.

### 6.1 The 5 Official Evaluation Scenarios Covered

|      #      | Evaluation Scenario                    | Evaluated Target Surfaces                                                          |         Status         | Redaction Result                                                                   | Standalone Test Page                                                      |
| :---------: | :------------------------------------- | :--------------------------------------------------------------------------------- | :--------------------: | :--------------------------------------------------------------------------------- | :------------------------------------------------------------------------ |
| **1** | **E-Commerce Checkout**          | Visa card (Luhn-verified), CVV, shipping address, email                            | 🟢 **100% Pass** | `[REDACTED: CARD_NUMBER]`, `[REDACTED: CVV]`, `[REDACTED: SHIPPING_ADDRESS]` | [`/mock/ecommerce-checkout.html`](./public/mock/ecommerce-checkout.html) |
| **2** | **Authentication & Identity**    | Plaintext login passwords, user emails, 6-digit OTP codes                          | 🟢 **100% Pass** | `[REDACTED: EMAIL]`, `[REDACTED: PASSCODE]`, `[REDACTED: OTP]`               | [`/mock/authentication.html`](./public/mock/authentication.html)         |
| **3** | **Customer Support Chat**        | Phone numbers (+91 mobile, US formats), private dispute inquiry notes              | 🟢 **100% Pass** | `[REDACTED: PHONE_NUMBER]`, `[REDACTED: PRIVATE_CHAT_LOG]`                     | [`/mock/customer-support.html`](./public/mock/customer-support.html)     |
| **4** | **Video / Profile Faces**        | Avatar pictures, participant video feeds, facial landmarks                         | 🟢 **100% Pass** | Solid `#000000` Canvas Blackout + Gemini Vision Multimodal JSON                  | [`/mock/profile-faces.html`](./public/mock/profile-faces.html)           |
| **5** | **Developer Settings & Secrets** | Cloud API keys (`AIza...`, `sk-...`, `AKIA...`), JWTs, IPv4 / IPv6 addresses | 🟢 **100% Pass** | `[REDACTED: API_KEY]`, `[REDACTED: AUTH_TOKEN]`, `[REDACTED: IP_ADDRESS]`    | [`/mock/developer-settings.html`](./public/mock/developer-settings.html) |

### 6.2 The 7 Official Evaluation Criteria Measurements

Evaluated and confirmed via [`tests/benchmark_evaluation_criteria.mjs`](./tests/benchmark_evaluation_criteria.mjs):

| Evaluation Criterion              | Metric Evaluated                               |   Measured Score   | Evaluation Evidence                                                                                             |
| :-------------------------------- | :--------------------------------------------- | :-----------------: | :-------------------------------------------------------------------------------------------------------------- |
| **1. PII Detection Recall** | Sensitivity across 20 ground-truth PII targets |  **100.0%**  | 20/20 true positives detected, 0 false negatives. Verhoeff & Luhn checksums guarantee zero missed credentials.  |
| **2. Redaction Precision**  | Accuracy on non-sensitive interface text       |  **100.0%**  | 7/7 clean strings retained, 0 false positives (0 over-redactions on order numbers, dates, prices, buttons).     |
| **3. Privacy Leakage**      | Residual PII in outbound payloads              | **0.0% Leak** | Post-sanitization residual check: 0 residual PII. Synthetic canary honeypots neutralized on first pass.         |
| **4. Context Preservation** | Interface understanding after sanitization     | **Fortified** | Non-sensitive sentence structure, item names, and instructions remain 100% intact around semantic placeholders. |
| **5. Task Success**         | End-to-end task completion rate                |  **100.0%**  | Autonomous agent form autofill successfully executed across 3/3 scenario forms via local RAM vault.             |
| **6. Performance**          | Client processing latency & resource usage     | **0.029 ms** | Sub-millisecond text sanitization latency; total 5-scenario suite executes in 4.48 ms.                          |
| **7. Security**             | Adversarial input & fail-closed defense        | **Fortified** | Adversarial prompt injections caught and hard-aborted; unsafe script selectors rejected before execution.       |

### 6.3 Local Reproduction Commands

Run the automated verification test suites locally:

```bash
# 1. Run core engine, 4-task point-by-point, and evaluation criteria benchmark
npm test

# 2. Run the 5 official evaluation scenarios benchmark
node tests/verify_phase3_evaluation_scenarios.mjs

# 3. Run synthetic canary honeypot probe & tripwire test
node tests/verify_phase3_canary_leakage.mjs

# 4. Run local secret injection & DOM automation bridge test
node tests/verify_phase3_secret_injector.mjs

# 5. Run extension popup persistence & branding verification
node tests/verify_popup_and_favicon.mjs

# 6. Run UI refactor, theme engine & responsiveness test
node tests/verify_ui_refactor.mjs

# 7. Run criteria benchmark directly
node tests/benchmark_evaluation_criteria.mjs

# 8. Run Step 1 Secure Backend Gateway verification suite
node tests/verify_step1_backend.mjs
```

---

## 7. Chrome Extension Gateway & Web App UI

PrivacyLens delivers an **extension-first architecture**: the browser extension is the primary frontline product, with the WebApp serving as the deep diagnostic and forensic cockpit accessed directly through the extension:

### Manifest V3 Chrome Extension — Primary Flagship Product (`extension/`)

- **Primary Edge Gatekeeper**: Runs directly at the browser edge to intercept DOM events, web requests, and outbound AI payloads.
- **Active Protection Scope**: Live status indicator for Aadhaar (Verhoeff), Cards (Luhn), PAN, Passwords/OTP, Cloud API Keys, and Visual Faces.
- **`popup.html` / `popup.js`**:
  - Full theme alignment: Pure Z-Black (`#000000`) and Warm Beige (`#fdfbf7`) with instant Sun/Moon toggle.
  - Master Shield switch persisted via `chrome.storage.local` with real-time neutralized threat counters.
  - **Launch Shield Cockpit Button**: 1-click gateway button to launch/focus the WebApp Home page directly from the extension.
- **`background.js`**: Service Worker gateway intercepting outbound prompts, executing local sanitization, and broadcasting events over `BroadcastChannel('privacylens_channel')`.
- **`contentScript.js`**: In-page inspector running `scanDOM()`, attaching floating badges above sensitive inputs, intercepting form submits, and executing local AI DOM actions.

### Interactive React Web App Modules (`src/components/`)

- **HomePage (`HomePage.jsx`)**: 
  - Value proposition hero with direct `Launch Shield Cockpit` action button.
  - Live Master Shield controller, KPI metrics bar, and 4 dedicated navigation cards (`/analytics`, `/diff`, `/scenarios`, `/audit`).
  - **Top-Right 3 Buttons**: Exactly 3 buttons on the Home page header: **Shield Cockpit**, **Theme Toggle**, and **Auth Session**.
- **Cockpit Operational Tab Navigation (`App.jsx`)**:
  - Once inside Shield Cockpit or operational sub-pages, the tab navbar connects all operational tools with **zero Home button on the tab navbar**, eliminating navigation clutter.
- **SecOps Authentication Modal (`AuthModal.jsx`)**:
  - In-memory role-based session switcher (SecOps Administrator, PECathon Evaluator, DPDP Privacy Auditor) with zero-storage ephemeral RAM security boundaries.
- **Shield Dashboard (`ShieldDashboard.jsx`)**: Glassmorphic cyber-cockpit with real-time KPI counters, attack benchmark tester, and live event ticker.
- **Privacy Analytics (`PrivacyAnalytics.jsx`)**: Recharts gradient area charts, PII threat category bars, and SVG Privacy Health Index radial gauge (0–100).
- **Payload Diff Inspector (`PayloadDiffInspector.jsx`)**: Side-by-side terminal diff (Raw Intercepted vs Sanitized Safe), character count deltas, and Fail-Closed Hard Abort visual alert banner.
- **Visual Redaction Studio (`VisualRedactionStudio.jsx`)**: Dual-canvas visual studio comparing raw documents with permanently masked `#000000` blackout canvases.
- **Agentic Playground (`AgenticPlayground.jsx`)**: Simulated banking portal demonstrating real-time input badges (`🛡️ Protected [AADHAAR]`) and Direct Leak vs Shield comparisons.
- **Audit Forensics (`AuditForensics.jsx`)**: Forensic audit ledger with search, filtering, and 1-click CSV and DPDP Act 2023 JSON compliance exporters.

---

## 8. Compliance & Legal Standards Alignment

PrivacyLens is engineered to satisfy the legal obligations of modern data protection frameworks:

- **India Digital Personal Data Protection (DPDP) Act 2023**: Ensures that personal data identifiers (Aadhaar, PAN, phone numbers, biometric faces) are never transferred to foreign sub-processors or third-party AI cloud servers without explicit purpose limitation.
- **EU General Data Protection Regulation (GDPR)**: Satisfies Article 25 (*Data protection by design and by default*) and Article 32 (*Security of processing*) by enforcing client-side pseudonymization and permanent visual blackout before cross-border data transfer.
- **PCI-DSS (Payment Card Industry Data Security Standard)**: Enforces Requirement 3 (*Protect stored account data*) by ensuring cardholder data (PAN, CVV) is never exposed in plaintext and is purged from memory after use.

---

## 👥 Team 05-HoneyPoters

- **Pranav Pushya** — Team Lead & Core Engine Architect
- **Govind** — UI/UX Layout & Dashboard Visuals,Documentation 
- **Nandita** — Mock Data, Test Vectors & Audit Logs,Pitch Deck

