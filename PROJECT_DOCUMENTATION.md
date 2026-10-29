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


---

### [Phase 3 - Part 1]: 5 Official PDF Evaluation Scenarios (`src/lib/testScenarios.js` & `src/components/EvaluationScenarios.jsx`)

#### 1. What is it? (Kya Hai)
`testScenarios.js` and `EvaluationScenarios.jsx` represent PrivacyLens's official evaluation test suite and interactive demonstration workbench, implementing all 5 mandatory evaluation scenarios specified in the PECathon 2026 Problem Statement (PS-004) PDF:
1. **E-Commerce Checkout**: Redaction of credit card details (Visa Luhn-verified 16-digit card, CVV) and residential shipping/delivery addresses.
2. **Authentication & Identity**: Redaction of plaintext passwords, login email identifiers, and 6-digit 2FA One-Time Passwords (OTPs).
3. **Customer Support Chat**: Masking of phone numbers (+91 mobile numbers, US/international formats) and private conversation chat log disclosures (e.g., medical inquiries, dispute notes).
4. **Video/Profile Faces**: Coordinate bounding box blackout on profile avatar pictures and video participant feeds with permanent solid `#000000` fills.
5. **Developer Settings & Secrets**: Redaction of Cloud API keys (`AIza...`, `sk-...`, `AKIA...`), JWT Bearer tokens (`eyJ...`), and IPv4/IPv6 addresses (`192.168.1.1`, `203.0.113.195`, `2001:0db8:...`).

It also ships with 5 standalone HTML mock test pages in `public/mock/` (`ecommerce-checkout.html`, `authentication.html`, `customer-support.html`, `profile-faces.html`, `developer-settings.html`) for headless testing and Chrome Extension DOM interaction.

#### 2. Why is it used? (Kyu Hai)
- **Compliance with Official Hackathon Benchmark Criteria**: The PECathon evaluation rubric specifically tests browser agent safety against these exact 5 realistic data exposure surfaces. Having pre-wired, deterministic test scenarios ensures judges and evaluators can verify PrivacyLens's defense capabilities in 1 click.
- **Holistic Coverage Across Text, DOM & Multimodal Vision**: Privacy threats do not occur solely in plaintext prompts. E-commerce forms contain autofilled DOM inputs, customer support involves chat transcripts, and profile avatars contain visual biometric faces. PrivacyLens protects across all 3 modalities.
- **Fail-Closed Double Verification**: Guarantees that neither raw payment credentials nor enterprise infrastructure secrets ever traverse the network boundary to cloud LLMs (Gemini, Claude, GPT-4).

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Scenario Metadata & Test Fixtures (`src/lib/testScenarios.js`)**:
   - Maps each scenario to realistic mock inputs, sensitive field definitions, expected semantic replacement tokens (`[REDACTED: CARD_NUMBER]`, `[REDACTED: SHIPPING_ADDRESS]`, `[REDACTED: PASSCODE]`, `[REDACTED: OTP]`, `[REDACTED: PHONE_NUMBER]`, `[REDACTED: PRIVATE_CHAT_LOG]`, `[REDACTED: PROFILE_FACE]`, `[REDACTED: API_KEY]`, `[REDACTED: AUTH_TOKEN]`, `[REDACTED: IP_ADDRESS]`), and underlying HTML DOM mock templates.
2. **Deterministic Execution Engine (`executeScenario`)**:
   - For text/DOM scenarios: passes raw input through `sanitizeText()`, asserts that 100% of target tokens exist in the output, and verifies that 0% of raw sensitive values leak.
   - For visual scenario: computes bounding box coordinate clamping (with 4px safety margins) on offscreen canvas, verifies zero overflow, and formats the output into standard Google Gemini 1.5 Flash Vision multimodal JSON payload.
3. **Automated Bulk Benchmark Runner (`runAllScenarios`)**:
   - Executes all 5 scenarios in sequence, computing latency, threat counts, and zero-leakage rates for jury scorecards.
4. **Interactive Dashboard Workbench (`src/components/EvaluationScenarios.jsx`)**:
   - Features scenario switcher tabs, side-by-side raw vs sanitized diff views, direct links to standalone HTML test pages, face coordinate blackout previews, and a 1-click "Run All 5 Automated Scenarios" benchmark button.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_phase3_evaluation_scenarios.mjs`) ran twice with zero errors:
- **Pass 1 - Individual Scenario Execution & Zero Leakage**:
  - Scenario 1 (E-Commerce): 5 threats neutralized (`CARD_NUMBER`, `CVV`, `SHIPPING_ADDRESS`, `EMAIL`); zero card or address leaks.
  - Scenario 2 (Authentication): 5 threats neutralized (`EMAIL`, `PASSWORD`, `OTP`); zero password or 6-digit OTP leaks.
  - Scenario 3 (Customer Support): 3 threats neutralized (`PHONE_NUMBER`, `PRIVATE_CHAT_LOG`); zero contact or dispute leaks.
  - Scenario 4 (Video/Profile Faces): 3 face bounding boxes clamped & redacted with permanent solid `#000000` blackout; multimodal Gemini Vision JSON verified.
  - Scenario 5 (Developer Settings): 8 threats neutralized (`API_KEY`, `AUTH_TOKEN`, `IP_ADDRESS`); zero cloud keys, JWTs, or IP addresses leaked.
- **Pass 2 - Residual Leak Re-Scan & Fail-Closed Gatekeeper**:
  - Re-scanning all sanitized outputs with `scanText()` confirmed exactly 0 residual PII threats.
  - Bulk benchmark scorecard confirmed 5/5 scenarios passed (24 threats neutralized, < 1ms total latency, 100% zero-leakage rate).
  - Fail-Closed Gatekeeper confirmed hard network abort on raw scenario payloads in `FAIL_CLOSED_STRICT` mode.


---

### [Phase 3 - Part 2]: Automated Synthetic Canary Testing & Re-Sanitization (`src/lib/geminiClient.js`)

#### 1. What is it? (Kya Hai)
`runCanaryLeakageTest` is PrivacyLens's automated synthetic honeypot probe and self-healing privacy watchdog built into `src/lib/geminiClient.js`. It dynamically generates high-entropy synthetic canary secrets (`CANARY_HONEYPOT_TOKENS`) representing payment cards (Luhn-verified), Google Gemini API keys, passwords, 6-digit OTPs, and UIDAI Aadhaar numbers. It injects these canaries directly into outgoing test buffers to verify that client-side sanitization suppresses 100% of canary markers before network transmission.

#### 2. Why is it used? (Kyu Hai)
- **Proactive Leak Detection (Tripwire Defense)**: Static regex filters and heuristic scanners can suffer from edge-case bypasses or regex compilation drift. Canary honeypots act as active tripwires: if an unredacted canary value is detected in the post-sanitization buffer, the system instantly catches the breach before cloud dispatch.
- **Dynamic Threshold Tuning**: Rather than failing silently or using rigid static rules, detecting a canary leak triggers automatic threshold tightening (e.g., lowering RAG vector similarity threshold from `0.60` to `0.35` and upgrading the policy to `FAIL_CLOSED_STRICT`).
- **Emergency Client-Side Hard Abort**: Guarantees that if a honeypot probe trips, an immediate hard network abort occurs and an urgent UI alert banner is broadcast over the `privacylens_channel` BroadcastChannel IPC to notify the user.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Canary Injection (`runCanaryLeakageTest`)**:
   - Injects 5 synthetic canary honeypot tokens into an encapsulated header block (`[PRIVACYLENS_CANARY_BUFFER id="..."]`) preceding the outbound test payload.
2. **First-Pass Sanitization & Post-Sanitization Inspection**:
   - Executes primary `sanitizeText()` on the buffer.
   - Inspects the output to assert whether any raw canary secret (`creditCard`, `apiKey`, `password`, `otp`, `aadhaar`) persists.
3. **Dynamic Threshold Tuning & Re-Sanitization**:
   - If a leak is caught:
     - Automatically logs `CANARY_LEAK_PREVENTED`.
     - Tunes vector similarity thresholds from `0.60` down to `0.35`.
     - Enforces aggressive boundary checking and executes secondary re-sanitization to purge any residual leaks.
4. **Client-Side Hard Abort Alert**:
   - Broadcasts `CANARY_LEAK_HARD_ABORT` event via `BroadcastChannel` and the internal security event bus.
   - Triggers a `CRITICAL` alert with tamper-proof transaction forensics.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_phase3_canary_leakage.mjs`) ran twice with zero errors:
- **Pass 1 - Baseline Canary Neutralization**:
  - Injected 5 synthetic canaries into outgoing test buffer.
  - Confirmed that all 5 honeypots were neutralized on first pass (`canaryLeaked: false`, `isGuaranteedSafe: true`, `status: 'CANARY_VERIFIED_CLEAN'`).
- **Pass 2 - Simulated Leak Trap & Emergency Response**:
  - Injected simulated leak vector (`simulateLeak: true`).
  - Caught canary leak (`canaryLeaked: true`, 1 active leak detected).
  - Validated dynamic threshold tuning (`tunedSimilarityThreshold: 0.35`, `policyUpgradedTo: 'FAIL_CLOSED_STRICT'`).
  - Verified re-sanitization purged the leak completely (`isGuaranteedSafe: true`).
  - Verified Client-Side Hard Abort alert was created and broadcasted with audit record status `FAIL_CLOSED_BLOCKED`.


---

### [Phase 3 - Part 3]: Local Secret Injection Helper / DOM Automation Bridge (`src/lib/secretInjector.js`)

#### 1. What is it? (Kya Hai)
`secretInjector.js` is PrivacyLens's local DOM automation bridge and ephemeral in-memory secret vault (`LocalSecretVault`). It bridges the gap between client-side privacy protection and autonomous AI browser agent automation: while external cloud models (Gemini, Claude, GPT-4) reason and issue actions purely using sanitized semantic tokens (`[REDACTED: CARD_NUMBER]`, `[REDACTED: PASSCODE]`, `[REDACTED: SHIPPING_ADDRESS]`), the local secret injector maps these placeholder tokens back to local browser RAM secrets and automatically populates the target DOM input fields during local AI action execution.

#### 2. Why is it used? (Kyu Hai)
- **The Core Paradox of AI Browser Agents**: If an AI agent cannot fill passwords or credit cards on web forms, it cannot complete real-world tasks (e.g. checkout, login). However, if the user gives the AI agent real passwords and credit cards, sensitive credentials leak to cloud LLM logs and third-party APIs.
- **Solving the Paradox with Zero Cloud Leakage**: PrivacyLens allows AI agents to plan and issue instructions globally on semantic tokens (*"Fill `#cardNumber` with `[REDACTED: CARD_NUMBER]`"*), while the local client-side Chrome Extension resolves and injects the actual secrets into the DOM locally. Real credentials never leave browser RAM.
- **Ephemeral RAM Security (Zero Persistence)**: Secrets in `LocalSecretVault` reside only in volatile memory with configurable TTLs (e.g., 15 minutes) and are automatically purged upon session completion or tab closure.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **LocalSecretVault (`LocalSecretVault`)**:
   - Stores `token -> secret` pairings in volatile memory.
   - Provides `register()`, `registerFromThreats()` (directly ingests threat outputs from `sanitizeText()`), `resolve()`, `has()`, and `purgeExpired()`.
2. **Reverse De-Tokenization (`detokenizeText`)**:
   - Replaces schema tokens in AI command strings with local RAM secrets for local execution.
3. **DOM Automation & Input Synchronization (`injectIntoDOM`)**:
   - Targets DOM input elements (`HTMLInputElement`, `HTMLTextAreaElement`, `contenteditable`).
   - Sets values using reactive framework prototype setters (`HTMLInputElement.prototype.value`) and dispatches synthetic `input` and `change` events so React, Vue, and Angular forms detect changes.
4. **Autonomous AI Action Dispatcher (`executeAIAction`)**:
   - Processes action commands (`FILL`, `BATCH_FILL`, `FILL_FORM`, `SUBMIT_FORM`), auto-populating fields and generating a tamper-proof execution receipt confirming zero cloud leakage.
5. **Evaluation Scenarios Integration (`populateScenarioSecrets`, `simulateAIScenarioAutofill`)**:
   - Seamlessly integrates with the 5 official PDF evaluation scenarios (`ecommerce_checkout`, `authentication`, `developer_settings`), automating form autofill testing.

#### 4. Verification & Testing Evidence
The automated double-verification test suite (`tests/verify_phase3_secret_injector.mjs`) ran twice with zero errors:
- **Pass 1 - Ephemeral RAM Vault Operations**:
  - Registered direct secrets and extracted threat objects from `sanitizeText()`.
  - Validated instant token resolution (`[REDACTED: CARD_NUMBER]` -> `4242 4242 4242 4242`).
  - Validated string de-tokenization (`detokenizeText`).
- **Pass 2 - Autonomous AI Action & Scenario DOM Autofill**:
  - Scenario 1 (E-Commerce Checkout): Successfully populated `#cardNumber`, `#cardCvv`, and `#shippingAddress` in the DOM from RAM tokens.
  - Scenario 2 (Authentication): Successfully populated `#loginEmail`, `#loginPassword`, and `#loginOtp` with zero cloud credential exposure.
  - Scenario 5 (Developer Settings): Successfully populated `#apiKey`, `#jwtToken`, and `#serverIp` with developer credentials.
  - Confirmed 100% `zeroCloudLeakageConfirmed: true` across all AI action runs.


---

### [Phase 4 - Part 1 & Part 3]: Production Build Polish, Bundle Optimization & Final Architecture Documentation

#### 1. What is it? (Kya Hai)
Phase 4 represents PrivacyLens's production hardening, bundle modularization, asset synchronization, and final deployment readiness. It configures Rolldown/Vite manual chunking (`vite.config.js`), isolates core third-party dependencies (`vendor-react`, `vendor-recharts`, `vendor-ai`), synchronizes the core sanitization engine into the Manifest V3 Chrome Extension (`extension/lib/`), and provides complete architectural documentation and verification scripts for the PECathon 2026 jury.

#### 2. Why is it used? (Kyu Hai)
- **Sub-Second Production Builds & Zero Asset Warnings**: Heavy dependencies (Recharts SVG plotting, ONNX runtime, and Transformers) can create oversized monolithic bundles exceeding 500 KB, degrading initial extension and page load latency. Intelligent manual chunking keeps individual JS bundles under 400 KB and slashes production build time to under 500ms.
- **Manifest V3 Extension Engine Synchronization**: The Chrome Extension service worker and in-page content scripts must execute the exact same battle-tested scanner, canary probe, and local secret injector without runtime drift or missing modules.
- **Flawless Evaluation & Reproducibility**: Hackathon evaluators require deterministic reproduction commands, comprehensive test suites, and transparent technical architecture documentation explaining every data flow and fail-closed security boundary.

#### 3. How does it work? (Kaise Kaam Kar Raha Hai)
1. **Intelligent Modular Chunking (`vite.config.js`)**:
   - Implements functional `manualChunks(id)` splitting:
     - `vendor-react`: Isolates React 19 and ReactDOM (`221 KB / 69 KB gzip`).
     - `vendor-recharts`: Isolates Recharts data visualization graphics (`372 KB / 106 KB gzip`).
     - `index`: Core application logic, dashboard components, and PrivacyLens engines (`120 KB / 31 KB gzip`).
   - Completely eliminates chunk size warnings and optimizes cold-start caching.
2. **Extension Core Synchronization**:
   - Replicated latest Phase 3 & 4 libraries (`scanner.js`, `imageMasker.js`, `ragScanner.js`, `geminiClient.js`, `testScenarios.js`, `secretInjector.js`) into `extension/lib/`.
   - Wired `EXECUTE_AI_ACTION` handling into `extension/contentScript.js` to allow the extension to execute local DOM secret injection upon AI agent requests.
3. **Comprehensive Verification Suite**:
   - Provides turnkey verification scripts (`tests/verify_phase3_evaluation_scenarios.mjs`, `tests/verify_phase3_canary_leakage.mjs`, `tests/verify_phase3_secret_injector.mjs`, and `test_core_modules.mjs`) covering all 4 phases with 100% pass rates.

#### 4. Verification & Testing Evidence
The complete Phase 1-4 double-verification loop ran cleanly:
- **Build Pass**: `npm run build` completed in **416ms**, generating optimized chunks with zero asset warnings:
  - `dist/assets/index-*.js`: 120.73 kB
  - `dist/assets/vendor-react-*.js`: 221.06 kB
  - `dist/assets/vendor-recharts-*.js`: 372.69 kB
- **Extension Manifest V3 Verification**: Validated `manifest.json`, ESM background service worker, and DOM content script integration via `tests/verify_phase2_part1.mjs`.
- **Extension Popup State Persistence & Branding**: Verified via `tests/verify_popup_and_favicon.mjs`:
  - `chrome.storage.local.get(['shieldEnabled'])` restoration on load (defaults to `true`).
  - `chrome.storage.local.set({ shieldEnabled: false })` on toggle switch.
  - Active broadcast propagation (`SHIELD_TOGGLED`) across background service worker, open tabs (`contentScript.js`), and React dashboard (`BroadcastChannel`).
  - Interceptors fail-open/bypass when shield is toggled OFF and clear in-page badges.
  - Crisp glassmorphic Shield SVG logo (`public/favicon.svg`), 512x512 app logo (`public/logo.png`), and extension icons (`extension/icons/icon16.png`, `icon48.png`, `icon128.png`) configured in `manifest.json` and `index.html`.
- **UI Refactor, Themes & Dedicated Navigation**: Verified via `tests/verify_ui_refactor.mjs`:
  - Theme Engine (`ThemeContext`) with dynamic switching between Pure Z-Black OLED Dark Mode (`#000000` / `#0a0a0a` / `#111111` with neutral borders and zero bluish tint) and warm Beige-White Light Mode (`#fdfbf7` / `#f5f0eb`), Sun/Moon navbar toggle, and `localStorage` persistence.
  - Dedicated Home Page (`HomePage.jsx`) with Value Proposition hero, live Master Shield toggle & KPI metrics bar, and 4 Primary Navigation Cards (`/analytics`, `/diff`, `/scenarios`, `/audit`).
  - Dedicated page routing eliminating the crowded single-page layout.
  - Mobile & multi-aspect ratio responsiveness from 320px mobile to 4K desktop with responsive Tailwind breakpoints (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, `w-full overflow-x-auto` for tables and charts).
- **Full Engine Test Suite**: `npm test` and all verification suites passed with 100% zero-leakage confirmation across all 5 evaluation scenarios, canary honeypot probes, and DOM secret injection tests.
