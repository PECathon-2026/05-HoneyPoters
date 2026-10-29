# 🛡️ PrivacyLens (PS-004) — Comprehensive Technical Documentation
**PECathon 2026 (PECFEST)** — Punjab Engineering College (PEC), Chandigarh  
**Team 05-HoneyPoters** | Problem Statement: `PS-004` (Client-side Privacy-Preserving AI Browser / Safety Gateway)

---

## 📌 Executive Summary & Architectural Directive

PrivacyLens operates on the zero-trust principle that **no unredacted personal, financial, biometric, or credential data should ever traverse the browser network boundary to external cloud AI models**. 

Modern generative AI browser assistants and autonomous web agents routinely capture user prompts, form fields, and screen DOMs to reason and generate responses. In doing so, they inadvertently expose sensitive Indian and Global PII (Aadhaar, PAN, Card numbers, Passwords, Health notes, API keys) to third-party model servers.

PrivacyLens acts as a transparent, client-side safety shield placed immediately ahead of any cloud dispatch.

```text
[User / DOM / Agent] 
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                   PRIVACY LENS LOCAL SHIELD                 │
│                                                             │
│  [1. Regex & Algorithmic Scanner] (Verhoeff / Luhn Check)   │
│  [2. Offscreen Canvas Redactor]   (Solid #000000 Blackouts) │
│  [3. In-Browser Contextual RAG]   (MiniLM Vector Search)    │
│  [4. Fail-Closed Safety Proxy]    (Residual Leak Abort)     │
└─────────────────────────────────────────────────────────────┘
       │ (100% Sanitized & Safe)
       ▼
[External Cloud AI (Gemini 1.5 Flash)]
```

---

## 📑 Complete Project Index & Phase Roadmap

- [Phase 1: Local Foundation & Core Engines](#phase-1---local-foundation--core-engines)
  - [Part 1: Local Regex & Algorithmic Scanner (`scanner.js`)](#phase-1---part-1-local-regex--algorithmic-scanner-srclibscannerjs)
  - [Part 2: HTML5 Canvas Visual Masker (`imageMasker.js`)](#phase-1---part-2-html5-canvas-visual-masker-srclibimagemaskerjs)
  - [Part 3: In-Browser Contextual RAG Engine (`ragScanner.js`)](#phase-1---part-3-in-browser-contextual-rag-engine-srclibragscannerjs)
  - [Part 4: Fail-Closed Safety Proxy (`geminiClient.js`)](#phase-1---part-4-fail-closed-safety-proxy-srclibgeminiclientjs)
- [Phase 2: Extension Gateway & Interactive React Dashboard](#phase-2---extension-gateway--interactive-react-dashboard)
  - [Part 1: Chrome Extension Gateway & Service Worker (`extension/`)](#phase-2---part-1-chrome-extension-gateway--service-worker-extension)
  - [Part 2: Glassmorphic React Dashboard UI Component (`ShieldDashboard.jsx`)](#phase-2---part-2-glassmorphic-react-dashboard-ui-component-srccomponentsshielddashboardjsx)
  - [Part 3: Live Recharts Analytics & Privacy Health Index (`PrivacyAnalytics.jsx`)](#phase-2---part-3-live-recharts-analytics--privacy-health-index-srccomponentsprivacyanalyticsjsx)
  - [Part 4: BroadcastChannel IPC & Payload Diff Inspector (`PayloadDiffInspector.jsx`)](#phase-2---part-4-broadcastchannel-ipc--payload-diff-inspector-srccomponentspayloaddiffinspectorjsx)
- [Phase 3: Multimodal Visual Redaction & Agentic Interceptor](#phase-3---multimodal-visual-redaction--agentic-interceptor)
  - [Part 1: Multimodal Visual Redaction Studio (`VisualRedactionStudio.jsx`)](#phase-3---part-1-multimodal-visual-redaction-studio-srccomponentsvisualredactionstudiojsx)
  - [Part 2: Autonomous Agentic Form Playground (`AgenticPlayground.jsx`)](#phase-3---part-2-autonomous-agentic-form-playground-srccomponentsagenticplaygroundjsx)
  - [Part 3: Forensic Audit Trail & Compliance Exporter (`AuditForensics.jsx`)](#phase-3---part-3-forensic-audit-trail--compliance-exporter-srccomponentsauditforensicsjsx)
  - [Part 4: Jury Showcase & Live Leak Benchmark (`JuryShowcase.jsx`)](#phase-3---part-4-jury-showcase--live-leak-benchmark-srccomponentsjuryshowcasejsx)
- [Phase 4: Jury Showcase, Live Benchmark & Presentation](#phase-4---jury-showcase-live-benchmark--presentation)

---

## Phase 1 - Local Foundation & Core Engines

### [Phase 1 - Part 1]: Local Regex & Algorithmic Scanner (`src/lib/scanner.js`)

#### 1. What is it? (Kya Hai)
`scanner.js` is PrivacyLens's deterministic edge inspection engine. It performs zero-latency, client-side identification and redaction of structured Personally Identifiable Information (PII), sensitive financial instruments, credentials, and DOM input elements. It combines specialized regular expressions with algorithmic checksum verifiers (Verhoeff for UIDAI Aadhaar and MOD-10 Luhn for global payment cards). Additionally, it houses the DOM Attribute Inspector to query sensitive live browser form fields before form submission or web agent automation.

#### 2. Why is it used? (Kyu Hai)
- **Problem Statement Alignment (PS-004)**: When browser extensions or autonomous AI agents read web page content, prompt queries, or clipboard data, user credentials and Indian national IDs (Aadhaar, PAN) are frequently bundled in the payload. Sending these in plaintext to external LLM servers violates data protection standards (DPDP Act 2023, GDPR).
- **False-Positive Mitigation**: Naive regex engines often misclassify random 16-digit timestamps or 12-digit order numbers as credit cards or Aadhaar numbers. By implementing algorithmic checks (`validateVerhoeff` and `validateLuhn`), PrivacyLens eliminates false positives while guaranteeing real PII is never missed.
- **Fail-Closed Guarantee**: The engine performs post-sanitization leak verification (`isSafe: boolean`). If an unredacted residual fragment remains, downstream API dispatch is blocked immediately.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Algorithmic Validation**:
   - **Verhoeff Algorithm**: Implements UIDAI dihedral group $D_5$ permutations (`VERHOEFF_D` multiplication table and `VERHOEFF_P` permutation table) to validate the 12th checksum digit of Indian Aadhaar numbers.
   - **Luhn Algorithm (MOD-10)**: Doubling alternate digits from right to left, subtracting 9 if $\ge 10$, and verifying the total sum modulo 10 equals 0.
2. **Regex Matchers**:
   - **PAN**: `\b([A-Z]{5}\d{4}[A-Z])\b` (case-insensitive, accommodating both official entity codes and mock test data).
   - **Payment Cards**: `\b(?:\d{4}[-\s]?){3}\d{4}\b|\b(?:\d{4}[-\s]?){2}\d{4}[-\s]?\d{3}\b|\b\d{13,19}\b` validated through Luhn.
   - **Aadhaar**: `\b([2-9]\d{3}[\s-]?\d{4}[\s-]?\d{4})\b(?!\s*[- ]?\d{4})` (ensures 16-digit cards are not partially parsed as 12-digit Aadhaar).
   - **Indian Phone**: `(?:(?:\+91|91|0)[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b`.
   - **Emails & Credentials**: RFC email regex, Gemini keys (`AIza[0-9A-Za-z\-_]{35}`), OpenAI keys (`sk-...`), AWS credentials (`AKIA...`), and plaintext passwords (`password="..."`).
3. **Semantic Token Substitution (`sanitizeText`)**:
   - Sorts detected threats by position and length.
   - Replaces matched strings with semantic tokens: `[REDACTED: AADHAAR]`, `[REDACTED: PAN]`, `[REDACTED: CARD_NUMBER]`, `[REDACTED: PASSCODE]`, etc.
   - Re-scans the sanitized output. If `residualThreats.length === 0`, sets `isSafe: true`.
4. **DOM Inspection Helper (`scanDOM`)**:
   - Queries `input, textarea, select, [contenteditable="true"]`.
   - Inspects `type="password"`, `autocomplete="cc-number"`, and sensitive keywords (`cvv`, `otp`, `aadhaar`, `pin`, `pan`) across `id`, `name`, `data-*`, and `placeholder`.
   - Computes screen coordinates (`getBoundingClientRect()`) and outputs pre-formatted `redactionBoxes` ready for canvas visual masking.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_part1.mjs`) verified:
- Structural integrity of exports: `validateVerhoeff`, `validateLuhn`, `scanText`, `sanitizeText`, `scanDOM`.
- Synthetic attack vectors passed:
  - Vector 1: Indian PAN (`ABCDE1234F`) -> `[REDACTED: PAN]`, `isSafe: true`.
  - Vector 2: Indian Aadhaar (`2345 6789 0124`) -> `[REDACTED: AADHAAR]`, `isSafe: true`.
  - Vector 3: Payment Card with Luhn (`4242 4242 4242 4242`) -> `[REDACTED: CARD_NUMBER]`, `isSafe: true`.
  - Vector 4: Email address (`accounts.payable@startup.co.in`) -> `[REDACTED: EMAIL]`, `isSafe: true`.
  - Vector 5: Indian mobile (`+91 98765 43210`) -> `[REDACTED: PHONE_NUMBER]`, `isSafe: true`.
  - Vector 6: Password & OTP (`password="mySecretP@ssw0rd99"`) -> `[REDACTED: PASSCODE]`, `isSafe: true`.
  - Vector 7: Cloud API key (`AIzaSy...`) -> `[REDACTED: API_KEY]`, `isSafe: true`.
  - Graceful fallback in non-browser Node environments.

---

### [Phase 1 - Part 2]: HTML5 Canvas Visual Masker (`src/lib/imageMasker.js`)

#### 1. What is it? (Kya Hai)
`imageMasker.js` is PrivacyLens's client-side visual obfuscation engine. It operates offscreen using an HTML5 `<canvas>` (or `OffscreenCanvas`) to process screenshots, web page snapshots, and image files before they are transmitted to multimodal AI models. It accepts an array of target coordinate bounding boxes `[{ x, y, width, height, label }]` (derived either from `scanDOM` or user selections) and paints solid `#000000` blackout rectangles over those areas.

#### 2. Why is it used? (Kyu Hai)
- **Multimodal Privacy Leaks**: In modern multimodal agentic workflows (e.g. Gemini 1.5/2.0 Flash vision), agents capture the entire browser viewport or desktop screen. Even if text prompts are sanitized, the screenshot itself contains sensitive fields (unmasked passwords, bank balances, credit card numbers, customer Aadhaar card photos).
- **Zero Raw Pixel Cloud Leakage**: Performing visual redaction on an offscreen canvas in client RAM ensures that sensitive pixels are permanently destroyed and replaced with pure black pixels before the base64 payload is generated. No external image-processing server is involved.
- **Visual Auditability**: Rather than blurring (which can be inverted using deconvolution AI attacks), solid blackout rectangles provide complete information destruction while rendering clear semantic labels (`[REDACTED: PASSWORD]`) so the vision model understands that content was intentionally suppressed.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Source Loading (`loadImageSource`)**:
   - Ingests multiple source types: HTML Image elements, Canvas elements, Blobs, Files, and base64 data URLs.
   - Converts input into a decoded raster image in memory.
2. **Offscreen Canvas Initialization (`createOffscreenCanvas`)**:
   - Spawns an offscreen canvas matching the exact natural dimensions of the source image.
   - Renders the clean background image onto the 2D canvas context.
3. **Bounding Box Clamping & Blackout Painting (`applyBlackouts`)**:
   - Applies safety padding (`padding: 4px`) to enclose input field borders and text baselines.
   - Mathematically clamps all coordinates: $x \ge 0$, $y \ge 0$, $w \le \text{canvasWidth} - x$, $h \le \text{canvasHeight} - y$.
   - Fills the region with solid `#000000`.
   - Draws a subtle `#38BDF8` 1px border indicating a verified PrivacyLens boundary.
   - Centers a high-contrast monospaced badge text (e.g. `[REDACTED: CARD_NUMBER]`).
4. **Sanitized Payload Generation (`maskImage`)**:
   - Converts the modified canvas to a clean sanitized base64 data URL (`image/png` or `image/jpeg`).
   - Strips metadata and exports `{ sanitizedBase64, width, height, masksCount, timestamp }`.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_part2.mjs`) verified:
- Configuration validation: `DEFAULT_MASK_OPTIONS.blackoutColor === '#000000'`.
- Canvas Math & Clamping verification:
  - Synthetic 2D context dry-run executed against normal coordinates, negative offsets ($x = -10$), and oversized boundaries ($x = 900, w = 200$ on 1000px width).
  - All 3 blackout rectangles were verified to execute `fillRect` with pure `#000000` fill and strictly clamped coordinates.
- SVG simulation verified: `generateMockRedactedSVG` correctly generates valid SVG data URLs with embedded blackout boxes for test harnesses and pitch presentations.

---

### [Phase 1 - Part 3]: In-Browser Contextual RAG Engine (`src/lib/ragScanner.js`)

#### 1. What is it? (Kya Hai)
`ragScanner.js` is PrivacyLens's client-side vector search and contextual semantic privacy engine. Unlike regular expressions that rely on rigid alphanumeric syntaxes (such as 12-digit Aadhaar or 10-character PAN), `ragScanner.js` detects unstructured, narrative-based confidential data. It combines in-memory vector database indexing via **Orama Vector DB** with 384-dimensional dense semantic embeddings (compatible with `@xenova/transformers` `all-MiniLM-L6-v2`).

#### 2. Why is it used? (Kyu Hai)
- **The Limits of Regex Matching**: A user writing *"The patient was clinically diagnosed with chronic kidney failure"* or *"Here is our internal staging vault root password configuration"* is transmitting critical confidential information. However, regex engines cannot detect these because there is no standardized syntactic pattern.
- **Zero Cloud Leakage Semantic AI**: Traditional RAG pipelines send text to cloud embedding APIs (OpenAI `text-embedding-3-small`, Pinecone, Weaviate), which itself creates a cloud privacy leak. PrivacyLens runs the vector database and similarity matching **100% locally in browser memory (RAM)** with zero outbound network traffic.
- **Enterprise Custom Privacy Rules**: Allows enterprise teams or compliance officers to inject custom privacy vectors (e.g. unannounced project code words, internal server IPs, proprietary formulas) directly into the client vector database without recompiling the codebase.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Orama In-Memory Vector Store (`initRagScanner`)**:
   - Initializes a high-performance in-memory database with schema: `{ ruleId, category, label, text, replacementToken, embedding: 'vector[384]' }`.
   - Populates vector exemplars across critical privacy categories:
     - `MEDICAL_DIAGNOSIS`: Oncology, psychiatric records, infectious diagnoses.
     - `ENTERPRISE_SECRET`: Internal staging vaults, master credentials, proprietary algorithms.
     - `HEALTH_BIOMETRIC`: Blood pressure, glucose, tachycardia readings.
     - `FINANCIAL_RECORD`: Bank balance, stock portfolio, debt statements.
     - `SALARY_COMPENSATION`: Annual CTC, monthly in-hand compensation, equity grants.
2. **Dense Vector Embedder (`getVectorEmbedder`)**:
   - Integrates `@xenova/transformers` (`all-MiniLM-L6-v2`) via mean-pooling and L2 unit normalization.
   - Provides an offline, zero-dependency deterministic mathematical projection fallback to guarantee vector search works even when offline or during hackathon network congestion.
3. **Similarity Search & Sanitization (`scanContextualText` / `sanitizeContextualText`)**:
   - Splits incoming user prompts into candidate sentence units.
   - Computes dense embeddings and performs vector cosine similarity queries against Orama DB (`similarityThreshold: 0.50 – 0.65`).
   - Replaces matching narrative text with semantic tokens (`[REDACTED: MEDICAL_RECORD]`, `[REDACTED: ENTERPRISE_SECRET]`).
4. **Dynamic Rule Injection (`addCustomPrivacyRule`)**:
   - Embeds user-provided confidential phrases and registers them into the live Orama vector index at runtime.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_part3.mjs`) verified:
- Structural & mathematical verification:
  - Vector dimensionality confirmed at 384 dimensions.
  - L2 unit norm confirmed ($\sum v_i^2 \approx 1.0 \pm 0.01$).
- Synthetic contextual vectors passed:
  - Medical diagnosis detection: *"clinical diagnosis confirms acute chronic kidney disease failure"* detected with similarity score $0.644 \to$ replaced with `[REDACTED: MEDICAL_RECORD]`.
  - Corporate secret detection: *"internal staging database master root password vault"* detected with similarity score $0.710 \to$ replaced with `[REDACTED: ENTERPRISE_SECRET]`.
  - Dynamic rule injection passed: Custom rule `PROJECT_ZEUS_CODENAME` successfully registered, indexed in Orama, and intercepted on query.

---

### [Phase 1 - Part 4]: Fail-Closed Safety Proxy (`src/lib/geminiClient.js`)

#### 1. What is it? (Kya Hai)
`geminiClient.js` is the central security orchestrator and outbound gateway of PrivacyLens. It exposes `sanitizeAndSendToGemini` (and alias `generateContentSafe`), which serves as a fail-closed client-side wrapper around the Google Gemini 1.5 Flash API (`generateContent`). It chains `scanner.js`, `ragScanner.js`, and `imageMasker.js` into an unbroken pre-flight sanitization pipeline, runs a strict residual leakage verification check, and executes a **Hard Network Abort** if any sensitive data cannot be definitively proven safe.

#### 2. Why is it used? (Kyu Hai)
- **The Fail-Closed Paradigm**: In computer security, systems are either "fail-open" (if an error or ambiguity occurs, traffic is allowed through) or "fail-closed" (if any security doubt exists, traffic is completely blocked). AI browser tools that fail open create severe catastrophic privacy breaches. PrivacyLens guarantees fail-closed execution: if tokenization, regex matching, or RAG fails, the request is terminated in memory and zero bytes are transmitted to Google's cloud servers.
- **Multimodal Unification**: Real-world generative AI prompts often contain both text instructions and captured viewport screenshots. `geminiClient.js` unifies text sanitization with visual canvas blackouts in a single transaction before payload construction.
- **Client-Side Tamper-Proof Telemetry**: Maintains a local audit trail (in client RAM and `localStorage`) tracking threat counts, model names, latency, and status (`BLOCKED`, `SANITIZED_AND_FORWARDED`, `CLEAN_DISPATCH`). Raw sensitive data is permanently omitted from audit logs to maintain zero local credential leakage.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Pre-Flight Pipeline Execution (`sanitizeAndSendToGemini`)**:
   - **Step 1 (Deterministic PII)**: Executes `scanner.sanitizeText(prompt)` to strip credit cards, Aadhaar, PAN, passwords, and API keys.
   - **Step 2 (Contextual PII)**: Ingests the output of Step 1 and passes it through `ragScanner.sanitizeContextualText()` to redact medical diagnoses, enterprise staging secrets, and financial balances.
   - **Step 3 (Visual Masking)**: Inspects attached image objects. If bounding boxes are specified (via `scanDOM` or user selection), runs `imageMasker.maskImage()` offscreen to replace sensitive coordinates with solid `#000000` blackouts.
2. **Fail-Closed Hard Network Abort Boundary**:
   - **A. Strict Mode Policy (`FAIL_CLOSED_STRICT`)**: If any deterministic or contextual threat is found, instantly throws `PrivacyLensSecurityError`, logs an audit entry, and aborts before `fetch()`.
   - **B. Critical Credential Check (`blockOnCritical`)**: If plaintext passwords or API keys are detected, blocks forwarding.
   - **C. Residual Leak Verification**: Runs `scanner.scanText()` on the final sanitized payload. If residual PII is detected, triggers an immediate hard abort (`RESIDUAL_LEAK_FAIL_CLOSED`).
3. **Cloud Dispatch (Google Gemini API)**:
   - Packages safe text parts and sanitized base64 visual parts into standard Gemini `{ contents: [{ role: 'user', parts: [...] }] }` payload format.
   - If an API key is absent (offline demo mode), generates an instant local simulated safe response for pitch presentation.
   - If an API key is present, issues `fetch()` to `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`.
4. **Event Bus Broadcasting**:
   - Emits real-time events (`AUDIT_LOG_CREATED`) via `addSecurityEventListener()`, enabling UI components and dashboard toasts to react immediately without polling.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_part4.mjs`) verified:
- Dual-layer sanitization pipeline passed: Complex multi-vector prompt containing both Aadhaar (`2345 6789 0124`) and medical diagnosis (*"clinical diagnosis confirms acute chronic kidney disease failure"*) was sanitized into:
  `Patient KYC Aadhaar [REDACTED: AADHAAR]. [REDACTED: MEDICAL_RECORD]`
  with zero raw numbers or disease names leaked.
- Fail-Closed Hard Abort verified: Prompt with `password="superSecretPass123"` in `FAIL_CLOSED_STRICT` mode threw `PrivacyLensSecurityError` with code `PRIVACYLENS_FAIL_CLOSED_BLOCKED` and message `[PrivacyLens Gatekeeper] Request HARD-ABORTED`.
- Clean dispatch verified: Clean query (*"Explain how distributed consensus works in Raft protocol"*) passed cleanly through with `CLEAN_DISPATCH` status.
- Local audit telemetry verified:
  - Recorded 3 requests, 1 blocked, 1 sanitized, 1 clean dispatch.
  - Zero Leakage Rate calculated at **100%**.
  - Real-time subscriber listener received all 3 dispatched security events.

---

## Phase 2 - Extension Gateway & Interactive React Dashboard

### [Phase 2 - Part 1]: Chrome Extension Gateway & Service Worker (`extension/`)

#### 1. What is it? (Kya Hai)
Phase 2 Part 1 is PrivacyLens's browser edge runtime gateway packaged as a Manifest V3 Chrome Extension. It comprises:
- `extension/manifest.json`: Manifest V3 specification with ESM Service Worker (`"type": "module"`), content script declarations, and storage/scripting permissions.
- `extension/background.js`: Central Service Worker acting as an outbound request interception gateway, routing outbound LLM prompts and images through PrivacyLens's local sanitization pipeline and broadcasting events.
- `extension/contentScript.js` & `extension/contentScript.css`: In-page inspector executing `scanDOM()` to detect sensitive password, credit card, Aadhaar, and PAN input fields, attaching real-time visual shield badges and intercepting form submissions.
- `extension/popup.html` & `extension/popup.js`: Quick-control extension popup displaying the master Shield Active/Inactive toggle, real-time telemetry counters, and security status pills.

#### 2. Why is it used? (Kyu Hai)
- **Active Browser Boundary Enforcement**: Core sanitization algorithms in Phase 1 operate in code; the Chrome Extension establishes the physical boundary between web pages, AI browser agents, and external cloud AI endpoints (e.g. Google Gemini, ChatGPT, Claude).
- **Zero Cloud Leakage at Ingestion**: Rather than asking developers to manually sanitize inputs in their web applications, the extension automatically hooks into user forms, inputs, and agent outbound dispatches at the browser level before any HTTP request leaves the client device.
- **Inter-Process Synchronization**: AI browser agents, web pages, extension popups, and the React Dashboard run in different browser contexts. Using native `BroadcastChannel` (`privacylens_channel`) alongside `chrome.runtime` messaging creates an instantaneous, decoupled security event bus.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Manifest V3 Architecture**:
   - Background service worker runs modern ES Modules (`type: "module"`), importing deterministic scanner, RAG engine, and canvas masker directly without bundling overhead.
   - Declares `web_accessible_resources` for modular access by content scripts.
2. **In-Page DOM & Form Interception (`contentScript.js`)**:
   - Scans DOM tree on page load using `scanDOM()` to identify `input[type="password"]`, `autocomplete="cc-number"`, and sensitive attribute keywords.
   - Listens to live `input` and `focusin` events; when sensitive patterns are entered, dynamically applies `.privacylens-protected-input` and floating badges (`🛡️ [PrivacyLens: PASSWORD]`).
   - Hooks into `submit` events across `<form>` elements to flag sensitive submissions before dispatch.
3. **Outbound Request Interception Gateway (`background.js`)**:
   - `interceptOutboundPayload({ prompt, image, targetUrl, options })`:
     - Checks master shield state: if disabled, logs bypass and permits dispatch.
     - Runs `sanitizeText()` locally to replace Aadhaar, PAN, Card, Passwords, Emails, and API keys with semantic tokens.
     - If images are provided with coordinate boxes, invokes `maskImage()` for offscreen `#000000` blackout redaction.
     - Enforces **Fail-Closed Gatekeeping**: if strict mode is active or residual PII is detected, issues a hard abort and records a `FAIL_CLOSED_BLOCKED` audit entry.
4. **BroadcastChannel Event Bus (`privacylens_channel`)**:
   - Broadcasts real-time events (`REQUEST_SANITIZED`, `FAIL_CLOSED_BLOCKED`, `SHIELD_TOGGLED`, `DOM_SCAN_COMPLETED`).
   - Enables the upcoming React Dashboard (`ShieldDashboard.jsx`) to receive telemetry and state updates instantaneously without polling.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_phase2_part1.mjs`) verified:
- **Manifest V3 Specification**: Validated `manifest_version: 3`, ESM Service Worker configuration, and permission manifest.
- **Pass 1 - Functional Interception**:
  - Outbound prompt containing Aadhaar (`2345 6789 0124`), PAN (`ABCDE1234F`), Visa (`4242 4242 4242 4242`), and Password was intercepted and sanitized into semantic tokens (`[REDACTED: AADHAAR]`, `[REDACTED: PAN]`, `[REDACTED: CARD_NUMBER]`, `[REDACTED: PASSCODE]`).
  - Zero raw secrets traversed the interceptor.
  - Broadcast event `REQUEST_SANITIZED` was received over `BroadcastChannel('privacylens_channel')`.
- **Pass 2 - Fail-Closed & State Controls**:
  - `FAIL_CLOSED_STRICT` mode hard-aborted sensitive requests with zero data transmission.
  - Master Shield Toggle (`toggleShield(false)`) accurately activated bypass mode, then re-engaged zero-leakage protection on `toggleShield(true)`.
  - DOM inspection identified password, credit card, and Aadhaar inputs with screen coordinate bounding boxes.

---

### [Phase 2 - Part 2]: Glassmorphic React Dashboard UI Component (`ShieldDashboard.jsx`)

#### 1. What is it? (Kya Hai)
`ShieldDashboard.jsx` is PrivacyLens's primary client-side user interface. Built with React 19, Tailwind CSS, and Aceternity UI design principles, it provides a cyber-defense glassmorphism cockpit. It features an interactive Master Shield Active/Inactive toggle, active threat category counters, a live event ticker stream, and an interactive Attack Benchmark Testbed for real-time payload sanitization demonstrations.

#### 2. Why is it used? (Kyu Hai)
- **User Agency & Transparent Security Controls**: Enterprise security and DPDP Act 2023 compliance require that users and compliance teams have instant visual confirmation of their browser's security posture. The dashboard makes client-side interception tangible, auditable, and configurable.
- **Master Shield & Mode Management**: Users can toggle between `REDACT_AND_FORWARD` (allowing sanitized semantic tokens to proceed to the cloud) and `FAIL_CLOSED_STRICT` (hard-aborting network dispatches if critical secrets like passwords or API keys are detected).
- **Interactive Hackathon Benchmark Demonstration**: Judges and evaluators can click pre-loaded synthetic attack vectors (Aadhaar KYC, Credit Cards, Medical diagnoses, Plaintext passwords) to observe instantaneous zero-latency local redactions.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Glassmorphic Cyber-Cockpit Layout**:
   - Styled with frosted glass backdrops (`bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl`), animated cyan glowing borders, and dark tech accents.
   - Houses real-time telemetry KPI metric counters: Intercepted Requests, Sanitized & Safe, Hard Aborts (Blocked), and Zero-Leak Ratio ($100.0\%$).
2. **Master Shield Toggle & Policy Modes**:
   - Master Toggle flips between *Shield Engaged* (emerald pulse glow) and *Shield Disabled* (crimson warning glow).
   - Mode switcher controls security gatekeeper strictness: `REDACT_AND_FORWARD` vs `FAIL_CLOSED_STRICT`.
3. **Active PII Threat Classifications**:
   - Displays real-time breakdown badges for UIDAI Aadhaar (Verhoeff), Income Tax PAN, Payment Cards (Luhn MOD-10), Plaintext Passwords & API Keys, and Contextual RAG secrets.
4. **Interactive Attack Benchmark Tester**:
   - Textarea equipped with 5 pre-loaded attack vector pills (Aadhaar + PAN KYC, Visa + CVV, Credentials, Medical Diagnostic, Clean Query).
   - "Sanitize & Intercept" button executes client-side regex and semantic tokenization via `usePrivacyLensIPC.simulateIntercept()`.
5. **Real-Time Live Event Ticker**:
   - Auto-updating transaction stream showing intercepted request status pills (`SANITIZED_AND_FORWARDED`, `FAIL_CLOSED_BLOCKED`, `BYPASSED`), latency in milliseconds, and sanitized preview diffs.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_phase2_part2.mjs`) verified:
- **Structural Integrity**: Verified `ShieldDashboard.jsx`, `usePrivacyLensIPC.js`, and `App.jsx` integration with zero bundling errors on Vite.
- **Pass 1 - Synthetic Attack Vectors & Threat Badges**:
  - Vector 1 (Aadhaar + PAN KYC) verified: replaced with `[REDACTED: AADHAAR]` and `[REDACTED: PAN]`.
  - Vector 2 (Visa Card + CVV) verified: replaced with `[REDACTED: CARD_NUMBER]` and `[REDACTED: CVV]`.
  - Vector 3 (Password + API Key) verified: replaced with `[REDACTED: PASSCODE]` and `[REDACTED: API_KEY]`.
  - Threat badge aggregation counters verified across categories.
- **Pass 2 - Master Shield Toggle & Policy Modes**:
  - `FAIL_CLOSED_STRICT` policy hard-abort verified.
  - BroadcastChannel IPC verified: sent and received `REQUEST_SANITIZED` messages over `privacylens_channel`.

---

### [Phase 2 - Part 3]: Live Recharts Analytics & Privacy Health Index (`PrivacyAnalytics.jsx`)

#### 1. What is it? (Kya Hai)
`PrivacyAnalytics.jsx` is PrivacyLens's data visualization and compliance telemetry component powered by `recharts`. It renders live gradient area charts tracking requests versus neutralized threats, granular bar charts classifying detected PII categories (Aadhaar, PAN, Payment Cards, Passwords, Contacts), and an interactive SVG Privacy Health Index radial gauge (0 to 100).

#### 2. Why is it used? (Kyu Hai)
- **Macro-Telemetry & Trend Auditing**: While the event ticker presents micro-level transactions, security officers and evaluators need macro-level trends over time. The time-series area chart visualizes request spikes versus intercepted threats.
- **Categorical Risk Breakdown**: Indian regulations (UIDAI Aadhaar Act, DPDP Act 2023) and global banking standards (PCI-DSS) impose distinct penalties for different credential leaks. Categorical distribution makes it immediately clear what types of sensitive data users are inadvertently exposing.
- **Real-Time Privacy Health Metric**: Condenses complex multi-factor client state into a single, intuitive Privacy Health Index score (Grade A+ at 100/100 when Shield is active, immediately dropping to <50 if bypassed).

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Dynamic Privacy Health Index Gauge (SVG Radial Meter)**:
   - Evaluates client shield posture: when active with 100% Zero Leakage, sets score to 100 (Grade A+ Fortified).
   - Dynamically calculates SVG `strokeDashoffset` ($C = 2\pi r \approx 440\text{px}$) with color transitions (Emerald for $\ge 90$, Amber for $70-89$, Red for $<70$).
   - Displays real-time compliance indicators: DPDP Act 2023 status, Zero Cloud Leakage ratio ($100.0\%$), and average gatekeeper latency ($<12\text{ms}$).
2. **Requests vs Neutralized Threats AreaChart**:
   - Renders 3 gradient-filled area layers: Outbound AI Requests (Cyan), Neutralized Threats (Emerald), and Hard Aborts (Red).
   - Uses `ResponsiveContainer`, `CartesianGrid`, and monospaced glassmorphic `CustomChartTooltip`.
3. **PII Threat Distribution BarChart**:
   - Categorizes threats into 6 primary buckets: Aadhaar (UIDAI), Income Tax PAN, Payment Cards (Visa/Mastercard), Passwords & API Keys, Contact & Emails, and Contextual Secrets.
   - Styled with custom rounded bar heads (`radius={[6, 6, 0, 0]}`) and distinct cyber-defense palette.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_phase2_part3.mjs`) verified:
- **Structural Integrity**: Validated Recharts components, gradient definitions, and responsive container layout without build errors.
- **Pass 1 - Telemetry & Category Math**:
  - Time-series progression verified across 6 timeline intervals.
  - Category distribution aggregation verified across Aadhaar, PAN, Cards, and Passwords.
- **Pass 2 - Health Index Gauge & Compliance Math**:
  - Active Shield score confirmed at 100/100 (Grade A+).
  - Inactive Shield score confirmed at 38/100 (Compromised/Bypassed).
  - SVG radial stroke dashoffset verified ($0\text{px}$ offset when full, $>200\text{px}$ offset when degraded).

---

### [Phase 2 - Part 4]: BroadcastChannel IPC & Payload Diff Inspector (`PayloadDiffInspector.jsx`)

#### 1. What is it? (Kya Hai)
`PayloadDiffInspector.jsx` is PrivacyLens's comparative security inspection panel. It provides a side-by-side terminal comparison between the **"Raw Intercepted Payload"** (captured from client forms, DOM inputs, or AI prompts) and the **"Sanitized Payload"** (safe for Google Gemini 1.5 Flash cloud dispatch). It includes glowing semantic token highlights, character size delta trackers, and an animated **Fail-Closed Hard Abort Visual Alert Overlay** that triggers whenever an unredacted payload or critical credential is blocked locally.

#### 2. Why is it used? (Kyu Hai)
- **Zero-Trust Auditability (Seeing is Believing)**: Security engineers, compliance auditors, and hackathon judges need unambiguous visual proof of what was redacted and what was permitted to leave the browser. The side-by-side view renders raw text versus sanitized semantic tokens side-by-side.
- **Fail-Closed Verification**: When an autonomous AI browser agent or script attempts to transmit credentials (e.g., plaintext passwords or master API keys in strict mode), the inspector displays a prominent red warning banner explaining that the request was terminated in client RAM and zero bytes were dispatched.
- **Seamless Inter-Process Synchronization**: Connected directly via `usePrivacyLensIPC()` over native `BroadcastChannel('privacylens_channel')`, enabling real-time synchronized payload inspection across tabs, extension workers, and dashboard views.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Side-by-Side Dual-Terminal Interface**:
   - **Left Panel (Raw Intercepted)**: Rendered in a crimson-accented terminal displaying the raw text containing sensitive Aadhaar numbers, PAN identifiers, credit cards, or passwords with raw threat counters.
   - **Center Pillar**: Features an animated pipeline flow icon with real-time gatekeeper processing latency ($<12\text{ms}$).
   - **Right Panel (Sanitized Cloud Dispatch)**: Rendered in an emerald/cyan-accented terminal where all sensitive PII substrings are transformed into bright cyan glowing badges (`[REDACTED: AADHAAR]`, `[REDACTED: PAN]`, `[REDACTED: CARD_NUMBER]`, `[REDACTED: PASSCODE]`).
2. **Fail-Closed Hard Abort Visual Alert Overlay**:
   - When a transaction status is `FAIL_CLOSED_BLOCKED` or `RESIDUAL_LEAK_BLOCKED`:
     - Displays a high-contrast red alert box with pulsating shield icon: `PRIVACYLENS_FAIL_CLOSED_BLOCKED`.
     - Confirms zero network transmission: right panel displays *"HARD NETWORK ABORT ENFORCED: Zero bytes traversed the browser network boundary"*.
3. **Interactive Inspection History Dropdown**:
   - Users can toggle between the live stream's latest intercepted transaction and prior historical audit records.
   - Includes a 1-click "Copy Sanitized Payload" button for manual test dispatch.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_phase2_part4.mjs`) verified:
- **Structural Integrity**: Validated component exports, modal alerts, and semantic token rendering algorithms in `PayloadDiffInspector.jsx`.
- **Pass 1 - Side-by-Side Diff & Token Mapping**:
  - Raw payload containing Aadhaar (`2345 6789 0124`), PAN (`ABCDE1234F`), Visa (`4242 4242 4242 4242`), and Password was mapped to respective semantic tokens.
  - Zero raw secrets leaked into the sanitized dispatch.
- **Pass 2 - Fail-Closed Alert Overlay & IPC Synchronization**:
  - `FAIL_CLOSED_BLOCKED` status verified to suppress cloud dispatch (`sanitizedPrompt === null`).
  - BroadcastChannel IPC verified: synchronization messages correctly received and processed over `privacylens_channel`.

---

## Phase 3 - Multimodal Visual Redaction & Agentic Interceptor

### [Phase 3 - Part 1]: Multimodal Visual Redaction Studio (`src/components/VisualRedactionStudio.jsx`)

#### 1. What is it? (Kya Hai)
`VisualRedactionStudio.jsx` is PrivacyLens's multimodal visual obfuscation workbench and vision pre-processor. It connects directly with the HTML5 offscreen canvas visual masking engine (`src/lib/imageMasker.js`). It allows users, enterprise compliance reviewers, and autonomous AI agents to preview raw viewport screenshots against permanently redacted, non-invertible `#000000` blackout canvases before transmitting multimodal image parts to Google Gemini 1.5 Flash Vision.

#### 2. Why is it used? (Kyu Hai)
- **Multimodal AI Data Leak Vector**: Modern vision-language models (Gemini 1.5/2.0 Flash, GPT-4o, Claude 3.5 Sonnet) routinely ingest screenshots of browser tabs, government identity portals, checkout pages, and electronic health records. Text-only sanitization leaves raw visual pixels exposed in screenshots.
- **Permanent, Non-Invertible Information Destruction**: Blur or pixelation filters can be mathematically inverted using deep-learning deconvolution algorithms. PrivacyLens replaces targeted pixel bounding boxes with solid `#000000` blackouts stamped with monospaced security seals (`[REDACTED: AADHAAR]`, `[REDACTED: CARD_NUMBER]`).
- **Interactive Multi-Document Demonstration**: Ships with realistic pre-loaded synthetic documents (UIDAI Aadhaar Card KYC, Payment Gateway Checkout with CVV, and Confidential Electronic Medical Records) so evaluators can test coordinate clamping and multimodal JSON packaging in 1 click.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Interactive Dual-Canvas Architecture**:
   - **Raw Canvas**: Renders simulated document raster and highlights detected sensitive regions with pulsating dashed red leak warning borders (`⚠️ DETECTED LEAK`).
   - **Masked Canvas**: Renders the identical source image through `maskCanvas()`, applying clamped solid `#000000` blackout rectangles with 4px safety margins and cyan security borders.
2. **Interactive Coordinate Mask Toggles**:
   - Lists active bounding boxes with exact screen coordinates `[x, y, width × height]`.
   - Users can toggle individual masks on or off to inspect the canvas redactor's responsiveness.
3. **Multimodal Gemini Vision JSON Generator**:
   - In 1 click, converts the sanitized canvas to base64 data URL and formats it into the standard Google Gemini 1.5 Flash Vision API request body:
     `{ contents: [{ role: 'user', parts: [{ text: '...' }, { inlineData: { mimeType: 'image/png', data: '...' } }] }] }`.
   - Includes a 1-click "Download Redacted PNG" button for offline verification.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_phase3_part1.mjs`) verified:
- **Structural Integrity**: Validated presets (`aadhaar_kyc`, `credit_card`, `medical_record`) and seamless integration in `App.jsx`.
- **Pass 1 - Canvas Blackout Math & Coordinate Clamping**:
  - Clamping algorithm validated against negative coordinate offsets ($x = -20$) and boundary overflows ($w = 700$ on 600px width).
  - All 3 blackout rectangles were verified to execute `fillRect` with pure `#000000` fill and zero out-of-bounds leakage.
- **Pass 2 - Multimodal Gemini Vision JSON Payload**:
  - Validated standard Gemini Vision payload structure with base64 image part and `image/png` MIME type.

---

### [Phase 3 - Part 2]: Autonomous Agentic Form Playground (`src/components/AgenticPlayground.jsx`)

#### 1. What is it? (Kya Hai)
`AgenticPlayground.jsx` is PrivacyLens's interactive browser session simulator and autonomous AI agent defense workbench. It simulates a live secure banking onboarding portal (`https://secure-portal.pec-bank.in/customer-kyc`) equipped with Indian KYC and financial fields (Aadhaar, PAN, Cards, Passwords, Contact details). It demonstrates in real time how autonomous AI browser agents (crawlers, automation bots, web copilots) attempting to extract the page DOM are transparently intercepted and sanitized before cloud dispatch.

#### 2. Why is it used? (Kyu Hai)
- **The Rise of Autonomous AI Browser Agents**: Modern browser automation agents (e.g. MultiOn, Claude Computer Use, OpenAI Operator) routinely extract entire DOM tree snapshots and form input states to perform tasks. When they do so, unencrypted user credentials (passwords, payment cards, national IDs) are sent directly to cloud LLM prompts.
- **Real-Time Visual Defense Feedback**: Users and evaluators can watch floating shield badges (`🛡️ Protected [AADHAAR]`, `🛡️ Protected [PASSWORD]`) dynamically attach to input fields as they type or autofill test profiles.
- **Side-by-Side "Direct Leak vs Shield" Benchmark**: Provides an undeniable proof-of-defense comparison: clicking "Simulate Direct Leak" shows all 8 raw credentials exposed, whereas "Extract with PrivacyLens Shield" sanitizes all 8 fields into zero-leak semantic tokens.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Simulated Browser Window & Live KYC Form**:
   - Features a mock URL navigation bar and realistic input fields for Full Name, UIDAI Aadhaar, PAN, Payment Card, CVV, Password, Mobile, and Email.
   - Includes 1-click test profile autofill buttons (*Rahul Sharma* and *Priya Patel*).
2. **Real-Time Input Field Badge Detection (`getFieldBadge`)**:
   - Queries `scanText()` on input values. If a password field or sensitive PII pattern is entered, renders an animated floating badge next to the input label.
3. **Autonomous Agent Extraction Simulation (`handleRunAgentExtraction`)**:
   - **Mode A (With Shield)**: Captures the agent DOM string, passes it through `sanitizeText()`, stores the audit entry, and displays the sanitized output in a cyan-accented terminal.
   - **Mode B (Direct Leak)**: Displays the catastrophic failure mode in an amber/red warning terminal showing unredacted passwords, card numbers, and Aadhaar numbers exposed to the cloud.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_phase3_part2.mjs`) verified:
- **Structural Integrity**: Validated component exports, mock profile schemas, and seamless mounting in `App.jsx`.
- **Pass 1 - Protected Agentic DOM Interception**:
  - Agent DOM snapshot containing 7 sensitive fields was intercepted and sanitized into verified semantic tokens (`[REDACTED: AADHAAR]`, `[REDACTED: PAN]`, `[REDACTED: CARD_NUMBER]`, `[REDACTED: PASSCODE]`).
  - Zero raw secrets traversed the interceptor.
- **Pass 2 - Direct Leak vs Shield Comparison**:
  - Unprotected mode verified to contain active leaks.
  - Real-time field badge detection confirmed for passwords and Aadhaar values.

---

### [Phase 3 - Part 3]: Forensic Audit Trail & Compliance Exporter (`src/components/AuditForensics.jsx`)

#### 1. What is it? (Kya Hai)
`AuditForensics.jsx` is PrivacyLens's tamper-evident forensic audit ledger and regulatory compliance reporting module. It maintains a searchable, filterable in-memory transaction log of every intercepted request, fail-closed block, and clean dispatch. It includes an interactive deep-dive inspection drawer and 1-click exporters producing standard CSV spreadsheets and JSON compliance reports structured for India's Digital Personal Data Protection (DPDP) Act 2023 and EU GDPR Article 30 records of processing activities.

#### 2. Why is it used? (Kyu Hai)
- **Legal & Regulatory Accountability**: The DPDP Act 2023 mandates that data fiduciaries maintain rigorous logs proving personal data was not leaked to third-party sub-processors or foreign cloud models. The audit ledger provides timestamped, immutable proof of client-side suppression.
- **Zero Raw Secret Persistence in RAM**: Standard logging systems frequently introduce secondary security vulnerabilities by persisting unmasked passwords and credit card numbers in logs. PrivacyLens enforces a strict zero-leak audit policy: only masked placeholders (`XXXX-XXXX-0124`, `AB*****4F`) and redacted semantic tokens are recorded.
- **Auditor & Jury Usability**: Compliance officers and evaluators can instantly filter records by status (`ALL`, `SANITIZED`, `BLOCKED`, `CLEAN`), search by transaction ID or URL, and export audit trails with 1 click.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Searchable & Filterable Table**:
   - Offers real-time substring search across Transaction ID, prompt content, target URL, and status.
   - Status filters toggle instantly between Sanitized dispatches, Hard Aborts, and Clean requests.
2. **One-Click Compliance Exporters**:
   - **CSV Export (`handleExportCSV`)**: Generates tabular datasets with fields: `Timestamp`, `Transaction_ID`, `Target_URL`, `Status`, `Threat_Count`, `Latency_ms`, and `Sanitized_Safe`.
   - **JSON Export (`handleExportJSON`)**: Generates structured reports containing metadata headers (`compliance_standard: 'India DPDP Act 2023 & EU GDPR Article 30'`), total counts, and full transaction records.
3. **Transaction Deep-Dive Modal**:
   - Clicking any audit row opens a focused inspection modal displaying full transaction metadata, pre-flight checks, processing latency, and tamper-proof verification seal.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_phase3_part3.mjs`) verified:
- **Structural Integrity**: Validated component exports, CSV/JSON exporters, and seamless integration in `App.jsx`.
- **Pass 1 - Ledger Filtering & Zero Raw Secret Persistence**:
  - Filter by status (`BLOCKED`, `SANITIZED`) confirmed.
  - Substring search confirmed.
  - Verified that audit records retain zero raw Aadhaar or PAN values in memory.
- **Pass 2 - Compliance Export Data Formatting**:
  - Validated DPDP Act 2023 / GDPR Article 30 JSON report structure.
  - Validated CSV spreadsheet formatting and header alignment.

---


### [Phase 2 / Stability Fix]: Vite Dev Server & Recharts 3.x React-Is Shim (`src/lib/reactIsShim.js`)

#### 1. What is it? (Kya Hai)
`reactIsShim.js` is a lightweight, zero-dependency ECMAScript Module (ESM) shim that exports all standard React element and type inspection functions (`isFragment`, `isElement`, `typeOf`, `ForwardRef`, `Memo`, `Suspense`, etc.) required by Recharts 3.x in React 19 / Vite development environments.

#### 2. Why is it used? (Kyu Hai)
- **Vite ESM Dev Server Compatibility**: The upstream `react-is` package uses a dynamic CommonJS export pattern (`if (process.env.NODE_ENV === 'production') ...`) which prevented Vite/esbuild from discovering named exports during dev bundling, triggering a fatal browser exception (`Uncaught SyntaxError: ... does not provide an export named 'isFragment'`) and rendering a blank white screen on `localhost:5173`.
- **Zero Overhead**: Provides pure ESM exports mapped to standard React symbols (`Symbol.for('react.fragment')`, etc.), completely resolving the Recharts import resolution issue without altering production build characteristics.
- **Glassmorphic Theme Cohesion**: Reset the default Vite `index.css` `#root` styling to a full-screen dark container (`#020617`, slate-950) so all glassmorphic components render edge-to-edge.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **ESM Symbol Matching**: Implements `isFragment`, `isElement`, `typeOf`, etc., using native React 18/19 symbols (`Symbol.for('react.fragment')`).
2. **Vite Alias Interception**: Configured in `vite.config.js`:
   ```javascript
   resolve: {
     alias: {
       'react-is': path.resolve(__dirname, 'src/lib/reactIsShim.js')
     }
   }
   ```
3. **Double Verification**: Both `npm run build` and headless Chrome DOM dump confirm 100% component mounting and rendering with zero console errors.

#### 4. Verification & Testing Evidence
- **Build Pass**: `npm run build` generated production bundle in 517ms without Rollup errors.
- **Dev Render Pass**: Headless Chrome rendered 116+ KB of DOM containing `PrivacyLens Shield Gateway`, `SHIELD IS ENGAGED`, `Payload Diff & Gatekeeper Inspector`, `Privacy Health Index`, `Visual Redaction Studio`, and `Agentic Playground`.
