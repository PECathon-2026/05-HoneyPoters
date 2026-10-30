// Delivered by Originkit · Customized for PrivacyLens (PS-004)
/* eslint-disable */
// @ts-nocheck
"use client";
import React from "react";
import CogTrain from "@/components/originkit/ui/hero-54/cog-train";
import { Download, Sliders, ArrowRight } from "lucide-react";

export function SectionHero({ onNavigate }) {
  return (
    <div className="hero-54">
      <section className="hero">
        <div className="hero-54-grid">
          <div>
            <p className="eyebrow">Calibre PS-004 · Hardware Isolation Engine</p>
            <div style={{ marginBottom: "12px" }}>
              <span style={{ fontSize: "clamp(36px, 4.8vw, 68px)", fontWeight: 900, letterSpacing: "-0.035em", color: "#ffffff" }}>
                Privacy<span style={{ color: "#3DE2DD" }}>Lens</span>
              </span>
            </div>
            <h1>
              Zero Cloud Leakage Shield for <span>AI Browser Agents</span>
            </h1>
            <p className="lede">
              Deterministic, client-side privacy architecture. Intercepts, redacts, and eliminates sensitive PII locally before any DOM instruction, screenshot, or network packet reaches external cloud LLMs.
            </p>
            <div className="ctas">
              <a 
                className="btn" 
                href="/PrivacyLens-Extension-v2.0.0.zip" 
                download="PrivacyLens-Extension-v2.0.0.zip"
                title="Download PrivacyLens Chrome Extension (.zip)"
              >
                <Download style={{ width: 18, height: 18 }} />
                <span>Download Extension (.zip)</span>
              </a>
              <button 
                type="button" 
                className="ghost" 
                onClick={() => onNavigate && onNavigate('shield')}
                title="Launch Shield Cockpit"
              >
                <Sliders style={{ width: 16, height: 16 }} />
                <span>Launch Shield Cockpit</span>
                <ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <ul className="specs">
              <li>
                <b>&lt;0.04 ms</b>
                <span>Interception latency</span>
              </li>
              <li>
                <b>0 Bytes</b>
                <span>RAM retention</span>
              </li>
              <li>
                <b>100.0%</b>
                <span>Zero cloud leakage</span>
              </li>
              <li>
                <b>PS-004</b>
                <span>Verhoeff & Luhn</span>
              </li>
            </ul>
          </div>
          <div className="watch">
            <div className="case">
              <svg className="hero-54-ring" viewBox="0 0 560 560" aria-hidden="true">
                <defs>
                  <path id="rim" d="M280,280 m-262,0 a262,262 0 1,1 524,0 a262,262 0 1,1 -524,0" />
                </defs>
                <text>
                  <textPath href="#rim" textLength="1640" lengthAdjust="spacing">
                    PRIVACYLENS · CALIBRE PS-004 · ZERO CLOUD LEAKAGE · VERHOEFF & LUHN · EPHEMERAL RAM · 100% ISOLATED ·
                  </textPath>
                </text>
              </svg>
              <div className="glass">
                <div id="movement" aria-label="PrivacyLens Calibre PS-004 cryptographic movement, cogs turning">
                  <CogTrain
                    background="#000000"
                    baseColor="#3DE2DD"
                    accentColor="#FFFFFF"
                    accentMix={32}
                    density={90}
                    size={56}
                    speed={35}
                    hover={180}
                    seed={7}
                    cog={{ variation: 68, toothDepth: 88, stroke: 1.5, hub: 38, spokes: 5 }}
                    style={{ width: "100%", height: "100%", minWidth: 0, minHeight: 0 }}
                  />
                </div>
              </div>
            </div>
            <p className="hint">Sweep across the lens to spin cryptographic gears</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SectionHero;
