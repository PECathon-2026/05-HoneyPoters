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

<!-- Phase 1 Parts will be documented here following the strict template -->
