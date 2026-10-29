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
- [Phase 2: Agentic Workflow & Browser Interceptor](#phase-2---agentic-workflow--browser-interceptor)
- [Phase 3: Interactive Security Dashboard & Real-Time Telemetry](#phase-3---interactive-security-dashboard--real-time-telemetry)
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
