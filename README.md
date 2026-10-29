# 🛡️ PrivacyLens (PS-004)
### Client-Side Privacy-Preserving AI Browser Agent Shield & Safety Gateway
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

## 📐 System Architecture & Data Flow

```text
  +-------------------------------------------------------------------------+
  |                        CLIENT-SIDE BROWSER (EDGE)                       |
  |                                                                         |
  |   +--------------------+          +----------------------------------+  |
  |   |  User Input / DOM  |  ----->  | DOM Attribute Inspector          |  |
  |   |  (Forms, Prompts)  |          | (Password, CVV, Card Auto-detect)|  |
  |   +--------------------+          +----------------------------------+  |
  |             |                                       |                   |
  |             v                                       v                   |
  |   +--------------------+                  +--------------------+        |
  |   | Local Regex Engine |                  | HTML5 Offscreen    |        |
  |   | (Aadhaar, PAN, Card|                  | Canvas Redactor    |        |
  |   |  Luhn / Verhoeff)  |                  | (Solid #000000)    |        |
  |   +--------------------+                  +--------------------+        |
  |             |                                       |                   |
  |             +-------------------+-------------------+                   |
  |                                 |                                       |
  |                                 v                                       |
  |                   +---------------------------+                         |
  |                   | In-Browser Contextual RAG |                         |
  |                   | (MiniLM-L6-v2 + Orama DB) |                         |
  |                   | 100% Local Vector Search  |                         |
  |                   +---------------------------+                         |
  |                                 |                                       |
  |                                 v                                       |
  |                 +===============================+                       |
  |                 | FAIL-CLOSED SAFETY GATEKEEPER |                       |
  |                 |  (Double-Verification Check)  |                       |
  |                 +===============================+                       |
  |                     /                       \                           |
  |       [Residual PII Detected]          [100% Verified Safe]             |
  |                   v                                 v                   |
  |         +-------------------+             +-------------------+         |
  |         | HARD NETWORK ABORT|             | Outbound Payload  |         |
  |         | (Local Audit Log) |             | (Semantic Tokens) |         |
  |         +-------------------+             +-------------------+         |
  +-------------------------------------------------------|-----------------+
                                                          | Safe fetch()
                                                          v
                                            +---------------------------+
                                            | EXTERNAL CLOUD AI / APIs  |
                                            | (Google Gemini 1.5 Flash) |
                                            +---------------------------+
```

---

## 🚀 Key Technical Pillars

1. **Deterministic Algorithmic & Regex Scanning (`scanner.js`)**:
   - Indian standard checksums: **Verhoeff algorithm** for UIDAI Aadhaar verification.
   - Financial checksums: **Luhn algorithm (MOD-10)** for Visa, MasterCard, RuPay, Amex.
   - Strict pattern matchers for PAN, emails, Indian phone formats, passwords, API keys, and JWT tokens.
   - Live DOM attribute scanner for password fields, credit card autocomplete, and sensitive data attributes.

2. **Offscreen Canvas Visual Masker (`imageMasker.js`)**:
   - Zero-pixel-leakage HTML5 offscreen canvas processor.
   - Implements solid `#000000` blackout rectangles with padding and security seals over detected coordinate boxes.
   - Generates sanitized base64 image data before screenshot submission.

3. **In-Browser Contextual RAG Privacy Engine (`ragScanner.js`)**:
   - 100% client-side vector embeddings powered by `@xenova/transformers` (`all-MiniLM-L6-v2`) and in-memory **Orama Vector DB**.
   - Contextual detection for non-regex sensitive records (medical history, corporate secrets, biometric notes).

4. **Fail-Closed Gatekeeper Proxy (`geminiClient.js`)**:
   - Double-verification pipeline wrapping Google Gemini API.
   - If sanitization fails or unredacted residual PII persists, **HARD ABORTS** the network request.
   - Maintains a local audit trail and event bus without persisting raw secrets.

---

## 📊 Phase-Wise Progress Checklist

| Phase | Milestone / Module | Status | Verification |
| :--- | :--- | :---: | :---: |
| **Phase 1** | **Local Foundation & Core Engines** | 🟢 **Completed & Verified** | Automated 2x Test Suite |
| ↳ Part 1 | Local Regex & Algorithmic Scanner (`scanner.js`) | 🟢 **Verified & Pushed** | Verhoeff + Luhn + 8 PII Types Tested |
| ↳ Part 2 | HTML5 Canvas Visual Redactor (`imageMasker.js`) | 🟢 **Verified & Pushed** | Offscreen Canvas + Blackouts Tested |
| ↳ Part 3 | In-Browser Contextual RAG Engine (`ragScanner.js`) | 🟢 **Verified & Pushed** | MiniLM + Orama In-Memory Vector Search |
| ↳ Part 4 | Fail-Closed Safety Proxy (`geminiClient.js`) | 🟢 **Verified & Pushed** | Residual Leak Hard-Abort + Gemini Dispatch |
| **Phase 2** | **Extension Gateway & Interactive React Dashboard** | 🟢 **Completed & Verified** | Automated 2x Test Suite |
| ↳ Part 1 | Chrome Extension Gateway & Service Worker (`extension/`) | 🟢 **Verified & Pushed** | Manifest V3 + BroadcastChannel + DOM Scan |
| ↳ Part 2 | Glassmorphic React Dashboard UI (`ShieldDashboard.jsx`) | 🟢 **Verified & Pushed** | Tailwind CSS + Active Threat Ticker + Attack Tester |
| ↳ Part 3 | Live Recharts Analytics (`PrivacyAnalytics.jsx`) | 🟢 **Verified & Pushed** | Time-Series Area + Category Bar + Health Gauge |
| ↳ Part 4 | BroadcastChannel IPC & Diff Inspector (`PayloadDiffInspector.jsx`) | 🟢 **Verified & Pushed** | Side-by-side Payload Diff + Fail-Closed Alert |
| **Phase 3** | **Multimodal Visual Redaction & Agentic Interceptor** | 🟡 In Progress | 2x Verification Loop |
| ↳ Part 1 | Multimodal Visual Redaction Studio (`VisualRedactionStudio.jsx`) | 🟢 **Verified & Pushed** | Offscreen Canvas + Solid #000000 Blackouts |
| ↳ Part 2 | Autonomous Agentic Form Playground (`AgenticPlayground.jsx`) | 🟢 **Verified & Pushed** | Interactive DOM Interceptor + Agent Simulation |
| ↳ Part 3 | Forensic Audit Trail & Compliance Exporter (`AuditForensics.jsx`) | 🟢 **Verified & Pushed** | Tamper-Proof Audit + JSON/CSV Export |
| ↳ Part 4 | Jury Showcase & Live Leak Benchmark (`JuryShowcase.jsx`) | ⚪ In Progress | Competitive Matrix + 1-Click Jury Demo |
| **Phase 4** | **Jury Showcase, Live Benchmark & Presentation** | ⚪ Scheduled | Pitch Deck + Live Leak Benchmark |

---

## 📖 In-Depth Technical Documentation

For complete technical deep-dives, architectural rationales, Hindi-English conceptual breakdowns (*Kya Hai, Kyu Hai, Kaise Kaam Kar Raha Hai*), and test evidence, refer to:
👉 **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**

---

## 🛠️ Quick Start & Local Development

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Setup Instructions
```bash
# Clone the repository
git clone https://github.com/PECathon-2026/05-HoneyPoters.git
cd 05-HoneyPoters

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run automated PrivacyLens test suite
npm test

# Run code linter
npm run lint

# Build for production
npm run build
```

---

## 👥 Team 05-HoneyPoters
- **Pranav Pushya** — Team Lead & Technical Anchor
- **Teammate 1** — UI/UX Layout & Dashboard Visuals
- **Teammate 2** — Mock Data, Test Vectors & Audit Logs
- **Teammate 3** — Pitch Deck, Documentation & Jury Presentation
