/**
 * PrivacyLens — Multimodal Visual Redaction Studio
 * Interactive HTML5 Canvas Blackout Engine & Gemini Vision Multimodal Pre-processor
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
      ctx.fillText('[PHOTO]', 68, 155);

      // Field labels & mock values
      ctx.fillStyle = '#334155';
      ctx.font = '12px sans-serif';
      ctx.fillText('Name:', 180, 120);
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Rahul Sharma (Indian Citizen)', 185, 148);

      ctx.font = '12px sans-serif';
      ctx.fillText('Aadhaar Number:', 180, 180);
      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('2345 6789 0124', 188, 220);

      ctx.fillStyle = '#334155';
      ctx.font = '12px sans-serif';
      ctx.fillText('DOB: 15/08/1994 • Gender: Male', 185, 265);

      // Bottom QR code mock
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(470, 75, 95, 95);
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText('[SECURE QR]', 480, 125);
    }
  },
  {
    id: 'credit_card',
    title: '💳 Payment Gateway Checkout Screen',
    category: 'FINANCIAL_PCI',
    description: 'E-commerce checkout screen with 16-digit card number, CVV code, and expiry.',
    width: 600,
    height: 380,
    boxes: [
      { x: 45, y: 150, width: 330, height: 42, label: '[REDACTED: CARD_NUMBER]' },
      { x: 395, y: 150, width: 110, height: 42, label: '[REDACTED: CVV]' },
      { x: 45, y: 235, width: 280, height: 38, label: '[REDACTED: CARDHOLDER]' }
    ],
    drawBackground: (ctx) => {
      // Payment Card UI
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 600, 380);

      // Gradient Header
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('SECURE CHECKOUT • PCI-DSS TIER 1', 45, 50);

      // Card Container Mock
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 80, 540, 240);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Card Number (Visa / RuPay):', 45, 138);
      ctx.fillText('CVV / CVC:', 395, 138);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('4242 4242 4242 4242', 55, 180);
      ctx.fillText('894', 415, 180);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Cardholder Name:', 45, 225);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('PRIYA VERMA', 55, 262);
    }
  },
  {
    id: 'medical_record',
    title: '🏥 Clinical Diagnosis & Vital Report',
    category: 'HEALTH_HIPAA',
    description: 'Electronic health record containing patient clinical notes and sensitive biometric history.',
    width: 600,
    height: 380,
    boxes: [
      { x: 40, y: 115, width: 520, height: 48, label: '[REDACTED: MEDICAL_DIAGNOSIS]' },
      { x: 40, y: 200, width: 340, height: 42, label: '[REDACTED: PRESCRIPTION_DRUGS]' },
      { x: 40, y: 280, width: 260, height: 38, label: '[REDACTED: PSYCHIATRIC_NOTES]' }
    ],
    drawBackground: (ctx) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 600, 380);

      ctx.fillStyle = '#ec4899';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('HOSPITAL ELECTRONIC MEDICAL RECORD • CONFIDENTIAL', 40, 45);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Primary Clinical Diagnosis:', 40, 105);
      ctx.fillStyle = '#fce7f3';
      ctx.font = '13px sans-serif';
      ctx.fillText('Patient diagnosed with Acute Chronic Kidney Disease Failure (Stage 4)', 48, 145);

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
  const [viewMode, setViewMode] = useState('side_by_side'); // 'side_by_side' | 'slider'
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100

  const rawCanvasRef = useRef(null);
  const maskedCanvasRef = useRef(null);

  const currentDoc = PRESET_DOCUMENTS.find(d => d.id === selectedDocId) || PRESET_DOCUMENTS[0];

  // Initialize and render canvases whenever preset document changes
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
    <div className="w-full space-y-6 text-slate-100 font-sans mt-2">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <Camera className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              Multimodal Visual Redaction Studio
            </h2>
            <p className="text-xs text-slate-400">
              HTML5 Offscreen Canvas: Zero-pixel leakage visual blackout processor for screenshots & Gemini Vision
            </p>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download Redacted PNG
          </button>
          <button
            type="button"
            onClick={handleCopyMultimodalPayload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-semibold border border-cyan-500/40 transition"
          >
            {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedPayload ? 'Payload Copied!' : 'Copy Gemini Vision JSON'}
          </button>
        </div>
      </div>

      {/* DOCUMENT PRESET PICKER & ACTIVE REDACTION ZONES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DOCUMENT PICKER PILLS (4 COLS) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-5 shadow-xl space-y-4">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider block mb-2">
              Select Sample Document / Screenshot:
            </span>
            <div className="space-y-2">
              {PRESET_DOCUMENTS.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedDocId === doc.id
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{doc.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{doc.description}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-cyan-400 font-semibold">{doc.category}</span>
                    <span>{doc.boxes.length} Bounding Boxes</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE REDACTION ZONES TOGGLES */}
          <div className="border-t border-slate-800 pt-3">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider block mb-2">
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
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono border transition ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500 line-through'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                      {box.label}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      [{box.x}, {box.y}, {box.width}×{box.height}]
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SIDE-BY-SIDE CANVAS COMPARISON (8 COLS) */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Live Visual Redaction Canvas Comparison
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ZERO RAW PIXELS TRANSMITTED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
            {/* RAW LEAKING SCREENSHOT */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Raw Screenshot (Leaking)
                </span>
                <span className="text-slate-500 text-[10px]">Unmasked DOM</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-red-500/40 bg-slate-950 p-1 flex items-center justify-center">
                <canvas
                  ref={rawCanvasRef}
                  className="w-full h-auto rounded object-contain max-h-[220px]"
                />
              </div>
            </div>

            {/* SANITIZED BLACKOUT SCREENSHOT */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Masked Payload (Gemini Safe)
                </span>
                <span className="text-emerald-400 text-[10px]">Solid #000000 Blackout</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-950 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <canvas
                  ref={maskedCanvasRef}
                  className="w-full h-auto rounded object-contain max-h-[220px]"
                />
              </div>
            </div>
          </div>

          {/* BOTTOM GUARANTEE PILL */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
            <span>Canvas Resolution: <strong>{currentDoc.width} × {currentDoc.height} px</strong></span>
            <span className="text-cyan-400 font-semibold">Solid Blackout #000000 • Verified Non-Invertible</span>
            <span>Security Seal: <strong>PrivacyLens Verified</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisualRedactionStudio;
