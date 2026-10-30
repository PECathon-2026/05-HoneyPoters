/**
 * PrivacyLens — Interactive 3D Cybernetic Shield & Optical Refraction Lens
 * Built with Three.js (r186)
 * Features:
 *  - Geodesic Icosahedron Security Shield with Electric Cyan (#3DE2DD) wireframe
 *  - Floating Holographic Memory Vault Core with pulsating glow
 *  - 3 Concentric Security Boundary Rings (DOM Inspector, Checksum Gate, WASM Egress)
 *  - Threat Stream Particle System: Hostile data packets (crimson/amber) deflected into safe cyan/emerald tokens
 *  - Interactive Mouse Parallax, Click Shockwave Deflection Pulse, and Evaluator Controls
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Shield, Zap, Sparkles, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function ShieldLens3D({
  className = '',
  active = true,
  onDeflectionTrigger,
  threatCount = 0
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const frameIdRef = useRef(null);
  
  // Interactive 3D Objects refs
  const shieldMeshRef = useRef(null);
  const coreMeshRef = useRef(null);
  const ringsRef = useRef([]);
  const particlesRef = useRef(null);
  const shockwaveRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  
  // Interactive UI state
  const [pulseActive, setPulseActive] = useState(false);
  const [streamSpeed, setStreamSpeed] = useState('normal'); // 'normal' | 'overload'
  const [lastDeflectedThreat, setLastDeflectedThreat] = useState(null);

  // Trigger interactive shockwave deflection pulse
  const triggerDeflectionPulse = useCallback((threatLabel = null) => {
    setPulseActive(true);
    if (threatLabel) {
      setLastDeflectedThreat(threatLabel);
    }
    if (shockwaveRef.current) {
      shockwaveRef.current.scale.set(0.2, 0.2, 0.2);
      shockwaveRef.current.material.opacity = 0.95;
      shockwaveRef.current.visible = true;
    }
    if (onDeflectionTrigger) {
      onDeflectionTrigger(threatLabel);
    }
    setTimeout(() => {
      setPulseActive(false);
    }, 1200);
  }, [onDeflectionTrigger]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x3de2dd, 3, 20);
    cyanPointLight.position.set(3, 4, 4);
    scene.add(cyanPointLight);

    const emeraldPointLight = new THREE.PointLight(0x10b981, 2, 20);
    emeraldPointLight.position.set(-4, -3, 3);
    scene.add(emeraldPointLight);

    // 3. Central 3D Geodesic Shield (Outer Protection Perimeter)
    const shieldGeometry = new THREE.IcosahedronGeometry(1.8, 2);
    
    // Wireframe glowing layer
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x3de2dd,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
    });
    const shieldWireMesh = new THREE.Mesh(shieldGeometry, wireframeMaterial);
    scene.add(shieldWireMesh);
    shieldMeshRef.current = shieldWireMesh;

    // Faceted translucent glass shell
    const shellMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x052e37,
      transparent: true,
      opacity: 0.18,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.85,
      ior: 1.5,
      reflectivity: 0.7,
      clearcoat: 0.5,
    });
    const shieldShellMesh = new THREE.Mesh(shieldGeometry, shellMaterial);
    shieldWireMesh.add(shieldShellMesh);

    // Vertex points glow
    const pointsMat = new THREE.PointsMaterial({
      color: 0x3de2dd,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
    });
    const vertexPoints = new THREE.Points(shieldGeometry, pointsMat);
    shieldWireMesh.add(vertexPoints);

    // 4. Inner Holographic Core (Volatile RAM Vault)
    const coreGeometry = new THREE.OctahedronGeometry(0.75, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x3de2dd,
      emissive: 0x147d79,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // 5. Orbiting Concentric Security Boundary Rings
    const rings = [];
    const ringConfigs = [
      { radius: 2.3, color: 0x3de2dd, tiltX: 0.4, tiltZ: 0.2, speed: 0.008, label: 'DOM_MUTATION' },
      { radius: 2.7, color: 0x10b981, tiltX: -0.6, tiltZ: 0.5, speed: -0.006, label: 'CHECKSUM_GATE' },
      { radius: 3.1, color: 0x38bdf8, tiltX: 0.8, tiltZ: -0.3, speed: 0.004, label: 'WASM_EGRESS' },
    ];

    ringConfigs.forEach((cfg) => {
      const ringGeom = new THREE.RingGeometry(cfg.radius, cfg.radius + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = cfg.tiltX;
      ringMesh.rotation.z = cfg.tiltZ;
      scene.add(ringMesh);
      rings.push({ mesh: ringMesh, ...cfg });
    });
    ringsRef.current = rings;

    // 6. Expanding Deflection Pulse Shockwave
    const shockwaveGeom = new THREE.RingGeometry(0.2, 0.35, 64);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0x3de2dd,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
    });
    const shockwaveMesh = new THREE.Mesh(shockwaveGeom, shockwaveMat);
    shockwaveMesh.visible = false;
    scene.add(shockwaveMesh);
    shockwaveRef.current = shockwaveMesh;

    // 7. Threat Stream Particle System
    // Inbound packets (hostile crimson/amber outside, transformed to safe cyan/emerald inside shield)
    const particleCount = 280;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const radii = new Float32Array(particleCount);

    const colorSafeCyan = new THREE.Color(0x3de2dd);
    const colorSafeEmerald = new THREE.Color(0x10b981);
    const colorThreatAmber = new THREE.Color(0xf59e0b);
    const colorThreatRed = new THREE.Color(0xef4444);

    for (let i = 0; i < particleCount; i++) {
      // Spawn in a sphere outside the shield
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 3.2 + Math.random() * 3.5;
      
      const x = dist * Math.sin(phi) * Math.cos(theta);
      const y = dist * Math.sin(phi) * Math.sin(theta);
      const z = dist * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Inward velocity towards shield core
      velocities[i * 3] = -x * (0.003 + Math.random() * 0.005);
      velocities[i * 3 + 1] = -y * (0.003 + Math.random() * 0.005);
      velocities[i * 3 + 2] = -z * (0.003 + Math.random() * 0.005);

      radii[i] = dist;

      // Colors based on radius: outside = threat, inside = safe
      const baseColor = dist > 2.0 ? (Math.random() > 0.4 ? colorThreatAmber : colorThreatRed) : colorSafeCyan;
      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = {
      system: particleSystem,
      positions,
      colors,
      velocities,
      radii,
      count: particleCount
    };

    // 8. Mouse Pointer Interaction
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.45;
      mouseRef.current.targetY = y * 0.45;
    };

    const handlePointerClick = () => {
      triggerDeflectionPulse('Interactive User Probe');
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('click', handlePointerClick);

    // 9. Resize Handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth || 600;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Shield rotation & tilt
      if (shieldWireMesh) {
        shieldWireMesh.rotation.y += 0.005;
        shieldWireMesh.rotation.x = mouseRef.current.y * 0.8 + Math.sin(time * 0.5) * 0.05;
        shieldWireMesh.rotation.z = -mouseRef.current.x * 0.8;
      }

      // Core rotation & pulse
      if (coreMesh) {
        coreMesh.rotation.y -= 0.012;
        coreMesh.rotation.x += 0.008;
        const scale = 0.75 + Math.sin(time * 3) * 0.06;
        coreMesh.scale.set(scale, scale, scale);
      }

      // Security rings rotation
      rings.forEach((ring) => {
        ring.mesh.rotation.z += ring.speed;
        ring.mesh.rotation.y += ring.speed * 0.5;
      });

      // Expanding shockwave pulse
      if (shockwaveMesh && shockwaveMesh.visible) {
        const swScale = shockwaveMesh.scale.x + delta * 4.5;
        shockwaveMesh.scale.set(swScale, swScale, swScale);
        shockwaveMesh.material.opacity = Math.max(0, shockwaveMesh.material.opacity - delta * 1.2);
        if (shockwaveMesh.material.opacity <= 0.01 || swScale > 4.5) {
          shockwaveMesh.visible = false;
        }
      }

      // Animate threat stream particles
      if (particlesRef.current) {
        const { positions, colors, velocities, count } = particlesRef.current;
        const speedMultiplier = streamSpeed === 'overload' ? 2.5 : 1.0;

        for (let i = 0; i < count; i++) {
          positions[i * 3] += velocities[i * 3] * speedMultiplier;
          positions[i * 3 + 1] += velocities[i * 3 + 1] * speedMultiplier;
          positions[i * 3 + 2] += velocities[i * 3 + 2] * speedMultiplier;

          const px = positions[i * 3];
          const py = positions[i * 3 + 1];
          const pz = positions[i * 3 + 2];
          const currentDist = Math.sqrt(px * px + py * py + pz * pz);

          // As particle hits shield boundary (r ≈ 1.8), deflect and sanitize into cyan/emerald
          if (currentDist < 1.8) {
            // Deflection: reverse direction or fling tangent
            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

            // Transformed into sanitized clean packet
            const safeColor = Math.random() > 0.5 ? colorSafeCyan : colorSafeEmerald;
            colors[i * 3] = safeColor.r;
            colors[i * 3 + 1] = safeColor.g;
            colors[i * 3 + 2] = safeColor.b;
          }

          // Reset if too close to core or drifted too far
          if (currentDist < 0.6 || currentDist > 7.5) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const dist = 4.2 + Math.random() * 2.5;

            positions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = dist * Math.cos(phi);

            velocities[i * 3] = -positions[i * 3] * (0.003 + Math.random() * 0.004);
            velocities[i * 3 + 1] = -positions[i * 3 + 1] * (0.003 + Math.random() * 0.004);
            velocities[i * 3 + 2] = -positions[i * 3 + 2] * (0.003 + Math.random() * 0.004);

            // Hostile unredacted threat outside
            const baseColor = Math.random() > 0.4 ? colorThreatAmber : colorThreatRed;
            colors[i * 3] = baseColor.r;
            colors[i * 3 + 1] = baseColor.g;
            colors[i * 3 + 2] = baseColor.b;
          }
        }

        particleGeometry.attributes.position.needsUpdate = true;
        particleGeometry.attributes.color.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 11. Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('click', handlePointerClick);

      try {
        shieldGeometry.dispose();
        wireframeMaterial.dispose();
        shellMaterial.dispose();
        pointsMat.dispose();
        coreGeometry.dispose();
        coreMaterial.dispose();
        shockwaveGeom.dispose();
        shockwaveMat.dispose();
        particleGeometry.dispose();
        particleMaterial.dispose();
        renderer.dispose();
      } catch (e) {
        console.warn('Three.js cleanup note:', e);
      }
    };
  }, [triggerDeflectionPulse, streamSpeed]);

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div 
        ref={mountRef} 
        className="w-full h-full min-h-[420px] sm:min-h-[500px] cursor-crosshair"
        title="Interactive Three.js Shield — Move pointer to rotate, click to trigger deflection pulse"
      />

      {/* Floating HUD Telemetry Overlay on the 3D Scene */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none space-y-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/85 border border-[#3DE2DD]/30 backdrop-blur-md text-[11px] font-mono text-[#3DE2DD] shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#3DE2DD] animate-ping" />
          <span>THREE.JS R186 • DEFLECTION LENS</span>
        </div>
        <div className="hidden sm:block text-[10px] font-mono text-neutral-400 bg-black/70 px-2.5 py-1 rounded-lg border border-neutral-800 backdrop-blur-sm">
          POLYGONS: 3,240 | PARTICLES: 280 PKTS
        </div>
      </div>

      {/* Bottom Floating Evaluator Controls */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Quick Deflection Triggers */}
        <div className="flex items-center gap-2 bg-black/90 border border-neutral-800 p-1.5 rounded-2xl backdrop-blur-md shadow-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => triggerDeflectionPulse('Aadhaar Verhoeff Wave')}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              pulseActive
                ? 'bg-[#3DE2DD] text-black font-extrabold border-[#3DE2DD]'
                : 'bg-neutral-900/80 text-neutral-300 border-neutral-700 hover:text-white hover:border-[#3DE2DD]/50'
            }`}
            title="Fire a simulated PII packet deflection pulse across the 3D lens"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Deflect Wave</span>
          </button>

          <button
            type="button"
            onClick={() => setStreamSpeed(streamSpeed === 'normal' ? 'overload' : 'normal')}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
              streamSpeed === 'overload'
                ? 'bg-red-500/20 text-red-400 border-red-500/50 font-bold'
                : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-neutral-200'
            }`}
            title="Toggle packet stream density"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{streamSpeed === 'overload' ? 'Stream: Heavy' : 'Stream: Standard'}</span>
          </button>
        </div>

        {/* Right: Live Deflection Status Pill */}
        <div className="bg-black/90 border border-neutral-800 px-3.5 py-1.5 rounded-2xl backdrop-blur-md shadow-xl text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-neutral-300">
            {lastDeflectedThreat ? (
              <>Deflected: <strong className="text-[#3DE2DD]">{lastDeflectedThreat}</strong></>
            ) : (
              'Guard: 100% Client-Side Isolated'
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ShieldLens3D;
