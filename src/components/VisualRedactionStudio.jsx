/**
 * PrivacyLens — Multimodal Visual Redaction Studio
 * Interactive HTML5 Canvas Blackout Engine & Gemini Vision Multimodal Pre-processor
 * Multi-aspect-ratio responsive with Deep Dark & Beige Light theme support.
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  Layers, 
  Maximize2, 
  Sparkles, 
  Lock, 
  Copy, 
  Check, 
  CheckCircle2, 
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { maskCanvas, DEFAULT_MASK_OPTIONS } from '../lib/imageMasker.js';

// Preloaded Synthetic Test Screenshots (Simulated Documents)
const PRESET_DOCUMENTS = [
  {
    id: 'aadhaar_kyc',
    title: '🇮🇳 UIDAI Aadhaar Card KYC Document',
    category: 'IDENTITY_KYC',
    description: 'Government photo identification document with 12-digit Aadhaar number and personal details.',
    width: 600,
    height: 380,
    boxes: [
      { x: 180, y: 190, width: 250, height: 42, label: '[REDACTED: AADHAAR]' },
      { x: 180, y: 130, width: 180, height: 26, label: '[REDACTED: FULL_NAME]' },
      { x: 180, y: 245, width: 220, height: 28, label: '[REDACTED: DOB/GENDER]' }
    ],
    drawBackground: (ctx) => {
      // Background card
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 600, 380);

      // Card Header with Indian tricolor bar
      ctx.fillStyle = '#ff9933';
      ctx.fillRect(0, 0, 600, 8);
      ctx.fillStyle = '#138808';
      ctx.fillRect(0, 372, 600, 8);

      // Header Bar
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('GOVERNMENT OF INDIA • UNIQUE IDENTIFICATION AUTHORITY', 30, 42);

      // Photo placeholder
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(35, 75, 115, 145);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('PHOTO', 68, 155);

      // Card details
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('Rahul Sharma', 180, 150);

      ctx.fillStyle = '#475569';
      ctx.font = '13px sans-serif';
      ctx.fillText('DOB: 14/08/1998 • Gender: MALE', 180, 265);

      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('2345 6789 0124', 180, 222);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('मेरा आधार, मेरी पहचान', 240, 340);
    }
  },
  {
    id: 'visa_credit_card',
    title: '💳 Visa Signature Credit Card Surface',
    category: 'FINANCIAL_PCI',
    description: 'Payment card surface with 16-digit PAN, CVV, expiry, and customer cardholder name.',
    width: 600,
    height: 380,
    boxes: [
      { x: 50, y: 190, width: 380, height: 38, label: '[REDACTED: CARD_NUMBER]' },
      { x: 50, y: 280, width: 200, height: 26, label: '[REDACTED: CARDHOLDER]' },
      { x: 380, y: 280, width: 90, height: 26, label: '[REDACTED: EXPIRY]' }
    ],
    drawBackground: (ctx) => {
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 600, 380);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e293b');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 380);

      // Gold EMV Chip
      ctx.fillStyle = '#eab308';
      ctx.fillRect(50, 95, 65, 50);
      ctx.strokeStyle = '#ca8a04';
      ctx.strokeRect(50, 95, 65, 50);

      // Bank Brand
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('PEC GLOBAL BANK • SIGNATURE', 50, 55);

      // Card Number
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('4242  4242  4242  4242', 50, 220);

      // Cardholder
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('RAHUL SHARMA', 50, 300);

      // Expiry
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('12/28', 390, 300);

      // Visa Logo
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'italic bold 28px sans-serif';
      ctx.fillText('VISA', 500, 345);
    }
  },
  {
    id: 'medical_record',
    title: '🏥 Clinical Diagnostic & Psychiatric Summary',
    category: 'HIPAA_HEALTH',
    description: 'Confidential patient EHR discharge note containing acute psychiatric and diagnostic data.',
    width: 600,
    height: 380,
    boxes: [
      { x: 40, y: 130, width: 500, height: 32, label: '[REDACTED: DIAGNOSIS]' },
      { x: 40, y: 210, width: 420, height: 32, label: '[REDACTED: PRESCRIPTION]' },
      { x: 40, y: 290, width: 440, height: 32, label: '[REDACTED: PSYCH_SUMMARY]' }
    ],
    drawBackground: (ctx) => {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, 0, 600, 380);

      ctx.fillStyle = '#818cf8';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('NEURO-CLINICAL HEALTH NETWORK • CONFIDENTIAL DISCHARGE', 40, 50);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Clinical Primary Pathology:', 40, 110);
      ctx.fillStyle = '#fce7f3';
      ctx.font = '13px sans-serif';
      ctx.fillText('Acute Stage 4 Renal Failure with Chronic Severe Hypertension', 48, 145);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Active Regimen Medications:', 40, 190);
      ctx.fillStyle = '#fce7f3';
      ctx.font = '13px sans-serif';
      ctx.fillText('Erythropoietin Alpha 4000 IU + Lisinopril 20mg', 48, 225);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Physician Psychiatric & Behavioral Summary:', 40, 270);
      ctx.fillStyle = '#fce7f3';
      ctx.font = '13px sans-serif';
      ctx.fillText('Severe clinical depressive episodes noted.', 48, 305);
    }
  }
];

export function VisualRedactionStudio() {
  const [selectedDocId, setSelectedDocId] = useState('aadhaar_kyc');
  const [activeBoxes, setActiveBoxes] = useState([]);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const rawCanvasRef = useRef(null);
  const maskedCanvasRef = useRef(null);

  const currentDoc = PRESET_DOCUMENTS.find(d => d.id === selectedDocId) || PRESET_DOCUMENTS[0];

  useEffect(() => {
    setActiveBoxes(currentDoc.boxes);
  }, [selectedDocId]);

  useEffect(() => {
    const rawCanvas = rawCanvasRef.current;
    const maskedCanvas = maskedCanvasRef.current;
    if (!rawCanvas || !maskedCanvas) return;

    rawCanvas.width = currentDoc.width;
    rawCanvas.height = currentDoc.height;
    maskedCanvas.width = currentDoc.width;
    maskedCanvas.height = currentDoc.height;

    const rawCtx = rawCanvas.getContext('2d');
    const maskedCtx = maskedCanvas.getContext('2d');

    // 1. Draw raw canvas with red outline markers over detected boxes
    currentDoc.drawBackground(rawCtx);
    activeBoxes.forEach((b) => {
      rawCtx.save();
      rawCtx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
      rawCtx.lineWidth = 2;
      rawCtx.setLineDash([6, 4]);
      rawCtx.strokeRect(b.x - 2, b.y - 2, b.width + 4, b.height + 4);
      
      // Floating indicator pill
      rawCtx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      rawCtx.fillRect(b.x - 2, Math.max(0, b.y - 20), 120, 18);
      rawCtx.fillStyle = '#ffffff';
      rawCtx.font = 'bold 9px monospace';
      rawCtx.fillText('⚠️ DETECTED LEAK', b.x + 4, Math.max(12, b.y - 7));
      rawCtx.restore();
    });

    // 2. Draw masked canvas with pure #000000 solid blackouts
    currentDoc.drawBackground(maskedCtx);
    maskCanvas(maskedCanvas, activeBoxes, {
      blackoutColor: '#000000',
      borderColor: '#38bdf8',
      showBadge: true
    });
  }, [currentDoc, activeBoxes]);

  const toggleBox = (index) => {
    const box = currentDoc.boxes[index];
    const exists = activeBoxes.some(b => b.x === box.x && b.y === box.y);
    if (exists) {
      setActiveBoxes(activeBoxes.filter(b => b.x !== box.x || b.y !== box.y));
    } else {
      setActiveBoxes([...activeBoxes, box]);
    }
  };

  const handleDownload = () => {
    const canvas = maskedCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `privacylens_redacted_${currentDoc.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyMultimodalPayload = () => {
    const canvas = maskedCanvasRef.current;
    if (!canvas) return;
    const b64 = canvas.toDataURL('image/png').split(',')[1] || '';
    const payload = JSON.stringify({
      contents: [{
        role: 'user',
        parts: [
          {
            text: 'Please analyze this user identity document.'
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: `${b64.substring(0, 80)}... [${b64.length} sanitized base64 bytes]`
            }
          }
        ]
      }],
      generationConfig: {
        safetySettings: [{ category: 'HARM_CATEGORY_PRIVACY', threshold: 'BLOCK_NONE' }]
      }
    }, null, 2);

    navigator.clipboard?.writeText(payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="w-full space-y-6 text-slate-800 dark:text-slate-100 font-sans transition-colors">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <Camera className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Multimodal Visual Redaction Studio
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              HTML5 Offscreen Canvas: Zero-pixel leakage visual blackout processor for screenshots & Gemini Vision
            </p>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download PNG
          </button>
          <button
            type="button"
            onClick={handleCopyMultimodalPayload}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/25 text-xs font-semibold border border-cyan-500/30 transition"
          >
            {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedPayload ? 'Copied!' : 'Copy Gemini Vision JSON'}
          </button>
        </div>
      </div>

      {/* DOCUMENT PRESET PICKER & ACTIVE REDACTION ZONES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DOCUMENT PICKER PILLS (4 COLS) */}
        <div className="lg:col-span-4 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl p-5 shadow-xl space-y-4 transition-colors">
          <div>
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider block mb-2">
              Select Sample Document:
            </span>
            <div className="space-y-2">
              {PRESET_DOCUMENTS.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    selectedDocId === doc.id
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-slate-900 dark:text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{doc.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{doc.description}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{doc.category}</span>
                    <span>{doc.boxes.length} Bounding Boxes</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE REDACTION ZONES TOGGLES */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider block mb-2">
              Detected Coordinate Masks ({activeBoxes.length}/{currentDoc.boxes.length}):
            </span>
            <div className="space-y-1.5">
              {currentDoc.boxes.map((box, idx) => {
                const isSelected = activeBoxes.some(b => b.x === box.x && b.y === box.y);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleBox(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono border transition ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span className="truncate">{box.label}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                      [{box.x}, {box.y}, {box.width}×{box.height}]
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SIDE-BY-SIDE CANVAS COMPARISON (8 COLS) */}
        <div className="lg:col-span-8 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Visual Redaction Canvas Comparison
              </h3>
            </div>
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 w-fit">
              ZERO RAW PIXELS TRANSMITTED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
            {/* RAW LEAKING SCREENSHOT */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-red-500 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Raw Screenshot (Leaking)
                </span>
                <span className="text-slate-400 text-[10px]">Unmasked DOM</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-red-500/40 bg-slate-950 p-1 flex items-center justify-center">
                <canvas
                  ref={rawCanvasRef}
                  className="w-full h-auto rounded-xl object-contain max-h-[220px]"
                />
              </div>
            </div>

            {/* SANITIZED BLACKOUT SCREENSHOT */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Masked Payload (Safe)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">Solid #000000 Blackout</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-950 p-1 flex items-center justify-center shadow-md">
                <canvas
                  ref={maskedCanvasRef}
                  className="w-full h-auto rounded-xl object-contain max-h-[220px]"
                />
              </div>
            </div>
          </div>

          {/* BOTTOM GUARANTEE PILL */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 gap-2">
            <span>Resolution: <strong>{currentDoc.width} × {currentDoc.height} px</strong></span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Solid #000000 Blackout • Non-Invertible</span>
            <span>Security Seal: <strong>PrivacyLens Verified</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisualRedactionStudio;
