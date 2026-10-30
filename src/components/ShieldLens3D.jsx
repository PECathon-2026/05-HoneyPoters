/**
 * PrivacyLens — Cinematic Three.js (r186) 3D Optical Holographic Lens
 * Award-winning cybernetic 3D experience designed in Pure Black (#000000), Electric Cyan (#3DE2DD), and Crisp White (#FFFFFF)
 * Features:
 *  - Infinite Perspective Cyber Grid with glowing cyan horizon fade
 *  - Central Faceted Icosahedron Holographic Lens with Cyan wireframe and White glowing vertices
 *  - Concentric Gyroscopic Optical Rings rotating on 3 axes
 *  - Swirling 450+ Cyber Vortex Particles in Pure White and Electric Cyan
 *  - Silky-Smooth Inertial Mouse Parallax and Click Shockwave Deflection Pulses
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Zap, Sparkles, CheckCircle2 } from 'lucide-react';

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

  // 3D references
  const lensGroupRef = useRef(null);
  const coreMeshRef = useRef(null);
  const ringsRef = useRef([]);
  const particlesRef = useRef(null);
  const shockwavesRef = useRef([]);
  const gridRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const [pulseActive, setPulseActive] = useState(false);
  const [streamIntensity, setStreamIntensity] = useState('dense'); // 'standard' | 'dense'

  // Trigger interactive shockwave pulse
  const triggerDeflectionPulse = useCallback((label = null) => {
    setPulseActive(true);

    if (sceneRef.current) {
      // Spawn a dynamic expanding shockwave ring
      const ringGeom = new THREE.RingGeometry(0.3, 0.45, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x3de2dd,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
      });
      const shockwave = new THREE.Mesh(ringGeom, ringMat);
      shockwave.rotation.x = Math.PI / 2;
      sceneRef.current.add(shockwave);
      shockwavesRef.current.push({ mesh: shockwave, scale: 0.3, opacity: 0.95 });
    }

    if (onDeflectionTrigger) {
      onDeflectionTrigger(label || 'Security Boundary Wave');
    }

    setTimeout(() => {
      setPulseActive(false);
    }, 900);
  }, [onDeflectionTrigger]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x000000, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 2. LIGHTING (Black + Cyan + White palette)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const cyanLightTop = new THREE.PointLight(0x3de2dd, 4.5, 30);
    cyanLightTop.position.set(0, 4, 3);
    scene.add(cyanLightTop);

    const whiteLightFront = new THREE.PointLight(0xffffff, 3.0, 25);
    whiteLightFront.position.set(0, 0, 5);
    scene.add(whiteLightFront);

    const cyanLightBottom = new THREE.PointLight(0x3de2dd, 2.5, 20);
    cyanLightBottom.position.set(0, -3, 2);
    scene.add(cyanLightBottom);

    // 3. PERSPECTIVE CYBER GRID FLOOR (Pure Black + Cyan Horizon)
    const gridHelper = new THREE.GridHelper(30, 40, 0x3de2dd, 0x113333);
    gridHelper.position.y = -2.4;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.28;
    scene.add(gridHelper);
    gridRef.current = gridHelper;

    // 4. MAIN LENS GROUP
    const lensGroup = new THREE.Group();
    scene.add(lensGroup);
    lensGroupRef.current = lensGroup;

    // 4a. Outer Faceted Holographic Shield (Icosahedron)
    const shieldGeometry = new THREE.IcosahedronGeometry(1.9, 2);

    // Cyan glowing wireframe
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x3de2dd,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const shieldWire = new THREE.Mesh(shieldGeometry, wireMaterial);
    lensGroup.add(shieldWire);

    // Glass shell with cyan sheen
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x011b20,
      transparent: true,
      opacity: 0.22,
      roughness: 0.05,
      metalness: 0.3,
      transmission: 0.9,
      ior: 1.52,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });
    const shieldGlass = new THREE.Mesh(shieldGeometry, glassMaterial);
    lensGroup.add(shieldGlass);

    // White glowing vertex nodes
    const vertexPointsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.075,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const vertexPoints = new THREE.Points(shieldGeometry, vertexPointsMat);
    lensGroup.add(vertexPoints);

    // 4b. Inner Refractive Crystal Core (Pure White & Cyan Pulse)
    const coreGeometry = new THREE.OctahedronGeometry(0.85, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x3de2dd,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    lensGroup.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // 4c. Gyroscopic Optical Rings (3 Axes in Pure Cyan & White)
    const rings = [];
    const ringConfigs = [
      { radius: 2.35, color: 0x3de2dd, width: 0.03, speedX: 0.009, speedY: 0.005, tiltX: 0.4 },
      { radius: 2.75, color: 0xffffff, width: 0.02, speedX: -0.007, speedY: 0.008, tiltZ: 0.6 },
      { radius: 3.15, color: 0x3de2dd, width: 0.035, speedX: 0.005, speedY: -0.006, tiltY: 0.8 },
    ];

    ringConfigs.forEach((cfg) => {
      const rGeom = new THREE.RingGeometry(cfg.radius, cfg.radius + cfg.width, 80);
      const rMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: cfg.color === 0xffffff ? 0.75 : 0.65,
        blending: THREE.AdditiveBlending
      });
      const rMesh = new THREE.Mesh(rGeom, rMat);
      if (cfg.tiltX) rMesh.rotation.x = cfg.tiltX;
      if (cfg.tiltY) rMesh.rotation.y = cfg.tiltY;
      if (cfg.tiltZ) rMesh.rotation.z = cfg.tiltZ;
      lensGroup.add(rMesh);
      rings.push({ mesh: rMesh, ...cfg });
    });
    ringsRef.current = rings;

    // 5. SWIRLING CYBER VORTEX PARTICLES (Pure White + Electric Cyan)
    const particleCount = 420;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleAngles = new Float32Array(particleCount);
    const particleSpeeds = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleHeights = new Float32Array(particleCount);

    const cyanColor = new THREE.Color(0x3de2dd);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.6 + Math.random() * 4.2;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 4.5;
      const speed = (0.006 + Math.random() * 0.012) * (Math.random() > 0.5 ? 1 : -1);

      particleAngles[i] = angle;
      particleSpeeds[i] = speed;
      particleRadii[i] = radius;
      particleHeights[i] = height;

      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = height;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      // 60% Electric Cyan, 40% Crisp White
      const isWhite = Math.random() > 0.6;
      const chosenColor = isWhite ? whiteColor : cyanColor;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = {
      system: particleSystem,
      positions: particlePositions,
      angles: particleAngles,
      speeds: particleSpeeds,
      radii: particleRadii,
      heights: particleHeights,
      count: particleCount
    };

    // 6. MOUSE POINTER TRACKING (Silky-Smooth Inertia)
    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.55;
      mouseRef.current.targetY = y * 0.45;
    };

    const handleClick = () => {
      triggerDeflectionPulse('Holographic Wave Trigger');
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // 7. RESIZE LISTENER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. ANIMATION LOOP
    const clock = new THREE.Clock();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Silky mouse damping
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.045;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.045;

      // Lens Group Rotation & Parallax Tilt
      if (lensGroup) {
        lensGroup.rotation.y = time * 0.25 + mouseRef.current.x * 0.8;
        lensGroup.rotation.x = Math.sin(time * 0.4) * 0.08 + mouseRef.current.y * 0.7;
        lensGroup.position.y = Math.sin(time * 0.8) * 0.12;
      }

      // Core pulsating
      if (coreMesh) {
        coreMesh.rotation.y = -time * 0.6;
        coreMesh.rotation.z = time * 0.4;
        const scale = 0.85 + Math.sin(time * 3.5) * 0.08;
        coreMesh.scale.set(scale, scale, scale);
      }

      // Gyroscopic Rings rotation
      rings.forEach((ring) => {
        ring.mesh.rotation.z += ring.speedX;
        ring.mesh.rotation.y += ring.speedY;
      });

      // Cyber Grid subtle movement
      if (gridHelper) {
        gridHelper.rotation.y = time * 0.015;
      }

      // Particle Vortex Update
      if (particlesRef.current) {
        const { positions, angles, speeds, radii, heights, count } = particlesRef.current;
        const speedFactor = streamIntensity === 'dense' ? 1.5 : 1.0;

        for (let i = 0; i < count; i++) {
          angles[i] += speeds[i] * speedFactor;
          const r = radii[i];
          const a = angles[i];
          const h = heights[i] + Math.sin(time * 1.5 + i) * 0.15;

          positions[i * 3] = Math.cos(a) * r;
          positions[i * 3 + 1] = h;
          positions[i * 3 + 2] = Math.sin(a) * r;
        }
        particleGeometry.attributes.position.needsUpdate = true;
      }

      // Animate shockwaves
      const activeShockwaves = shockwavesRef.current;
      for (let i = activeShockwaves.length - 1; i >= 0; i--) {
        const sw = activeShockwaves[i];
        sw.scale += delta * 4.8;
        sw.opacity -= delta * 1.1;
        sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
        sw.mesh.material.opacity = Math.max(0, sw.opacity);

        if (sw.opacity <= 0.01 || sw.scale > 6.0) {
          scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          sw.mesh.material.dispose();
          activeShockwaves.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. CLEANUP
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('click', handleClick);

      try {
        shieldGeometry.dispose();
        wireMaterial.dispose();
        glassMaterial.dispose();
        vertexPointsMat.dispose();
        coreGeometry.dispose();
        coreMaterial.dispose();
        particleGeometry.dispose();
        particleMaterial.dispose();
        gridHelper.geometry.dispose();
        gridHelper.material.dispose();
        rings.forEach((r) => {
          r.mesh.geometry.dispose();
          r.mesh.material.dispose();
        });
        renderer.dispose();
      } catch (e) {}
    };
  }, [triggerDeflectionPulse, streamIntensity]);

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        className="w-full h-full min-h-[460px] cursor-grab active:cursor-grabbing"
        title="Interactive 3D PrivacyLens — Click to pulse deflection shockwave, move cursor to tilt"
      />

      {/* Floating Cyber HUD Pill (Black + Cyan + White) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/90 border border-[#3DE2DD]/30 backdrop-blur-md text-[11px] font-mono text-white shadow-[0_0_20px_rgba(61,226,221,0.2)]">
        <span className="w-2 h-2 rounded-full bg-[#3DE2DD] animate-ping" />
        <span className="font-bold text-[#3DE2DD]">PRIVACYLENS 3D</span>
        <span className="text-neutral-500">•</span>
        <span className="text-neutral-300">OPTICAL CYBER SHIELD</span>
      </div>

      {/* Interactive Floating Action Controls (Bottom of 3D Scene) */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 bg-black/90 border border-neutral-800 p-1.5 rounded-2xl backdrop-blur-md shadow-2xl text-xs font-mono">
          <button
            type="button"
            onClick={() => triggerDeflectionPulse('Interactive Shockwave Pulse')}
            className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-2 ${
              pulseActive
                ? 'bg-[#3DE2DD] text-black font-extrabold border-[#3DE2DD] shadow-[0_0_20px_rgba(61,226,221,0.5)]'
                : 'bg-neutral-900 text-white border-neutral-700 hover:border-[#3DE2DD] hover:text-[#3DE2DD]'
            }`}
            title="Pulse interactive deflection wave through the 3D lens"
          >
            <Zap className={`w-3.5 h-3.5 ${pulseActive ? 'text-black' : 'text-[#3DE2DD]'}`} />
            <span>Pulse Shield</span>
          </button>

          <button
            type="button"
            onClick={() => setStreamIntensity(streamIntensity === 'dense' ? 'standard' : 'dense')}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white transition flex items-center gap-1.5"
            title="Toggle particle vortex density"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3DE2DD]" />
            <span>{streamIntensity === 'dense' ? 'Vortex: Dense' : 'Vortex: Standard'}</span>
          </button>
        </div>

        <div className="bg-black/90 border border-neutral-800 px-3.5 py-1.5 rounded-2xl backdrop-blur-md text-xs font-mono text-white flex items-center gap-2 shadow-xl">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#3DE2DD]" />
          <span>Zero Cloud Egress: <strong className="text-[#3DE2DD]">100.0%</strong></span>
        </div>
      </div>
    </div>
  );
}

export default ShieldLens3D;
