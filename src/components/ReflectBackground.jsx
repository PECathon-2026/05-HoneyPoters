/**
 * ReflectBackground — WebGL Caustic Ray Shader
 * Interactive fluid light reflections reacting to pointer movements
 * Primary Theme: Pure Z-Black (#000000) with Accent Electric Cyan (#3DE2DD)
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useEffect, useRef } from "react";

const VERTEX_SRC = `
attribute vec4 a_position;
void main() { gl_Position = a_position; }
`;

const FRAGMENT_SRC = `
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float u_speed;
uniform vec3 u_tint;
uniform float u_scale;
uniform float u_contrast;
uniform float u_iterations;
uniform vec2 u_pointer;
uniform float u_pointerStrength;

#define TAU 6.28318530718
#define MAX_ITER 8

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float time = iTime * u_speed + 23.0;
    vec2 uv = fragCoord.xy / iResolution.xy;

    vec2 p = mod(uv * TAU * u_scale, TAU) - 250.0;

    vec2 pointerDelta = uv - u_pointer;
    pointerDelta.x *= iResolution.x / max(iResolution.y, 1.0);
    float pointerDist = length(pointerDelta);
    p += normalize(pointerDelta + 1e-4) * u_pointerStrength * exp(-pointerDist * 4.0) * TAU;

    vec2 i = vec2(p);
    float c = 1.0;
    float inten = 0.005;
    float used = 0.0;

    for (int n = 0; n < MAX_ITER; n++) {
        if (float(n) >= u_iterations) break;
        float t = time * (1.0 - (3.5 / float(n + 1)));
        i = p + vec2(
            cos(t - i.x) + sin(t + i.y),
            sin(t - i.y) + cos(t + i.x)
        );
        float sx = sin(i.x + t) / inten;
        float sy = cos(i.y + t) / inten;
        sx = (sx >= 0.0 ? 1.0 : -1.0) * max(abs(sx), 0.05);
        sy = (sy >= 0.0 ? 1.0 : -1.0) * max(abs(sy), 0.05);
        c += 1.0 / length(vec2(p.x / sx, p.y / sy));
        used += 1.0;
    }

    c /= max(used, 1.0);
    c = 1.17 - pow(c, 1.4);

    float lum = pow(abs(c), u_contrast);
    vec3 colour = clamp(u_tint * lum * 2.0, 0.0, 1.0);

    fragColor = vec4(colour, 1.0);
}

void main() { mainImage(gl_FragColor, gl_FragCoord.xy); }
`;

function parseColor(input) {
  const fallback = [0.239, 0.886, 0.867]; // #3DE2DD default
  if (!input) return fallback;
  const str = String(input).trim();
  if (str[0] === "#") {
    let hex = str.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        return [r / 255, g / 255, b / 255];
      }
    }
    return fallback;
  }
  const m = str.match(/[\d.]+/g);
  if (m && m.length >= 3) {
    return [
      Math.min(255, parseFloat(m[0])) / 255,
      Math.min(255, parseFloat(m[1])) / 255,
      Math.min(255, parseFloat(m[2])) / 255,
    ];
  }
  return fallback;
}

function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function ReflectBackground({
  tint = "#3DE2DD",
  backgroundColor = "#000000",
  speed = 85,
  scale = 1.1,
  contrast = 7.5,
  iterations = 5,
  opacity = 100,
  blur = 2,
  animation = true,
  pointerStrength = 45,
  className = "",
  style = {},
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const tintRef = useRef([0.239, 0.886, 0.867]);
  const speedRef = useRef(0.42);
  const scaleRef = useRef(1.1);
  const contrastRef = useRef(7.5);
  const iterationsRef = useRef(5);
  const animationRef = useRef(true);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const pointerActiveRef = useRef(0);
  const pointerActiveTargetRef = useRef(0);
  const pointerStrengthRef = useRef(0.45);

  tintRef.current = parseColor(tint);
  speedRef.current = ((Number.isFinite(speed) ? speed : 85) / 100) * 0.5;
  scaleRef.current = Number.isFinite(scale) ? scale : 1.1;
  contrastRef.current = Number.isFinite(contrast) ? contrast : 7.5;
  iterationsRef.current = Number.isFinite(iterations) ? Math.round(iterations) : 5;
  animationRef.current = animation !== false;
  pointerStrengthRef.current = Number.isFinite(pointerStrength) ? pointerStrength / 100 : 0.45;

  const safeBlur = Number.isFinite(blur) ? blur : 0;
  const safeOpacity = Number.isFinite(opacity) ? opacity / 100 : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "high-performance" });
    if (!gl) {
      console.warn("WebGL not supported for caustic background");
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");
    const uSpeed = gl.getUniformLocation(program, "u_speed");
    const uTint = gl.getUniformLocation(program, "u_tint");
    const uScale = gl.getUniformLocation(program, "u_scale");
    const uContrast = gl.getUniformLocation(program, "u_contrast");
    const uIterations = gl.getUniformLocation(program, "u_iterations");
    const uPointer = gl.getUniformLocation(program, "u_pointer");
    const uPointerStrength = gl.getUniformLocation(program, "u_pointerStrength");

    const start = performance.now();
    let rafId = 0;
    let frozenT = 0;

    const draw = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const cw = canvas.clientWidth || 300;
      const ch = canvas.clientHeight || 300;
      const bw = Math.max(1, Math.round(cw * dpr));
      const bh = Math.max(1, Math.round(ch * dpr));

      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
        gl.viewport(0, 0, bw, bh);
      }

      const t = animationRef.current ? (performance.now() - start) / 1000 : frozenT;
      frozenT = t;
      const [r, g, b] = tintRef.current;

      gl.uniform2f(uResolution, bw, bh);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uSpeed, speedRef.current);
      gl.uniform3f(uTint, r, g, b);
      gl.uniform1f(uScale, scaleRef.current);
      gl.uniform1f(uContrast, contrastRef.current);
      gl.uniform1f(uIterations, iterationsRef.current);

      pointerActiveRef.current +=
        (pointerActiveTargetRef.current - pointerActiveRef.current) * 0.08;
      gl.uniform2f(uPointer, pointerRef.current.x, pointerRef.current.y);
      gl.uniform1f(uPointerStrength, pointerStrengthRef.current * pointerActiveRef.current);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const loop = () => {
      draw();
      rafId = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);

    draw();
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      try {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buffer);
      } catch (e) {}
    };
  }, []);

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    pointerRef.current.x = (e.clientX - rect.left) / rect.width;
    pointerRef.current.y = 1 - (e.clientY - rect.top) / rect.height;
    pointerActiveTargetRef.current = 1;
  };

  const handlePointerLeave = () => {
    pointerActiveTargetRef.current = 0;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none pointer-events-auto ${className}`}
      style={{
        background: backgroundColor || "#000000",
        ...style,
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{
          opacity: safeOpacity,
        }}
      />
      {safeBlur > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: `blur(${safeBlur}px)`,
            WebkitBackdropFilter: `blur(${safeBlur}px)`,
          }}
        />
      )}
    </div>
  );
}

export default ReflectBackground;
