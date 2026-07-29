/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  Sparkles,
  Zap,
  RotateCcw,
  Play,
  Pause,
  Layers,
  ChevronRight,
  Info,
  Maximize2,
  Minimize2,
  Wind,
  Flame,
  Droplets,
  Activity,
  Compass,
  ArrowRight
} from 'lucide-react';

export type SimulationMode = 'qixue' | 'xuanfu' | 'liujing';

interface InnerPhysics3DCanvasProps {
  onSelectTopic?: (topicId: string) => void;
  initialMode?: SimulationMode;
}

export default function InnerPhysics3DCanvas({
  onSelectTopic,
  initialMode = 'qixue'
}: InnerPhysics3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<SimulationMode>(initialMode);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [temperature, setTemperature] = useState<'normal' | 'cold' | 'heat'>('normal');
  const [xuanfuState, setXuanfuState] = useState<'closed' | 'normal' | 'sweating'>('normal');
  const [activeMeridianNode, setActiveMeridianNode] = useState<number>(0); // 0: Taiyang, 1: Yangming, 2: Shaoyang, 3: Taiyin, 4: Shaoyin, 5: Jueyin

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Mouse drag control state
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationGroupRef = useRef<THREE.Group | null>(null);

  // Mode specific animated meshes refs
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const xuanfuPoresRef = useRef<THREE.Mesh[]>([]);
  const meridianRingsRef = useRef<THREE.Mesh[]>([]);
  const pathogenMeshRef = useRef<THREE.Mesh | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141211); // Warm Charcoal Ink background
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfef3c7, 1.0);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x527a7a, 0.7);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // Group for mouse rotation
    const rotationGroup = new THREE.Group();
    scene.add(rotationGroup);
    rotationGroupRef.current = rotationGroup;

    // Build scene according to activeMode
    buildSceneContent(activeMode, rotationGroup, temperature, xuanfuState, activeMeridianNode);

    // 5. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (isPlaying && rotationGroupRef.current) {
        // Subtle auto idle rotation
        if (!isDragging.current) {
          rotationGroupRef.current.rotation.y += 0.003 * speed;
        }

        // Mode specific animations
        if (activeMode === 'qixue' && particleSystemRef.current) {
          const positions = particleSystemRef.current.geometry.attributes.position;
          const count = positions.count;

          for (let i = 0; i < count; i++) {
            let y = positions.getY(i);
            y += (0.05 + (i % 3) * 0.02) * speed;
            if (y > 7) y = -7;
            positions.setY(i, y);

            // Add slight spiral/wobble
            let x = positions.getX(i);
            x += Math.sin(elapsed * 2 + i) * 0.01;
            positions.setX(i, x);
          }
          positions.needsUpdate = true;
        }

        if (activeMode === 'xuanfu' && xuanfuPoresRef.current.length > 0) {
          xuanfuPoresRef.current.forEach((pore, idx) => {
            const pulseScale = 1 + Math.sin(elapsed * 3 + idx) * 0.08;
            pore.scale.set(pulseScale, pulseScale, pulseScale);
          });
        }

        if (activeMode === 'liujing' && pathogenMeshRef.current && meridianRingsRef.current.length > 0) {
          const targetRing = meridianRingsRef.current[activeMeridianNode];
          if (targetRing) {
            const angle = elapsed * 1.5 * speed;
            const radius = 2.5 + activeMeridianNode * 0.8;
            pathogenMeshRef.current.position.x = Math.cos(angle) * radius;
            pathogenMeshRef.current.position.y = (3 - activeMeridianNode * 1.2);
            pathogenMeshRef.current.position.z = Math.sin(angle) * radius;
          }

          // Pulse active ring
          meridianRingsRef.current.forEach((ring, idx) => {
            if (idx === activeMeridianNode) {
              ring.rotation.z += 0.02 * speed;
              (ring.material as THREE.MeshStandardMaterial).opacity = 0.8 + Math.sin(elapsed * 4) * 0.2;
            } else {
              (ring.material as THREE.MeshStandardMaterial).opacity = 0.25;
            }
          });
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
        rendererRef.current.dispose();
      }
    };
  }, [activeMode]);

  // Re-build scene content on state updates
  useEffect(() => {
    if (rotationGroupRef.current) {
      buildSceneContent(activeMode, rotationGroupRef.current, temperature, xuanfuState, activeMeridianNode);
    }
  }, [activeMode, temperature, xuanfuState, activeMeridianNode]);

  // Mouse Interaction Drag & Wheel
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !rotationGroupRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    rotationGroupRef.current.rotation.y += deltaX * 0.008;
    rotationGroupRef.current.rotation.x += deltaY * 0.008;

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.min(Math.max(cameraRef.current.position.z + e.deltaY * 0.01, 8), 32);
  };

  // BUILD 3D SCENE MESHES
  const buildSceneContent = (
    mode: SimulationMode,
    group: THREE.Group,
    temp: 'normal' | 'cold' | 'heat',
    xState: 'closed' | 'normal' | 'sweating',
    mNode: number
  ) => {
    // Clear previous children
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    xuanfuPoresRef.current = [];
    meridianRingsRef.current = [];
    particleSystemRef.current = null;
    pathogenMeshRef.current = null;

    // ----------------------------------------------------
    // MODE 1: 气血精津液 (QI, BLOOD, ESSENCE, JIN-YE DYNAMICS)
    // ----------------------------------------------------
    if (mode === 'qixue') {
      // Human Silhouette Axis Wireframe
      const torsoGeo = new THREE.CylinderGeometry(2.5, 1.8, 8, 16, 1, true);
      const torsoMat = new THREE.MeshBasicMaterial({
        color: temp === 'cold' ? 0x2b5b54 : temp === 'heat' ? 0x9b3333 : 0xa3702c,
        wireframe: true,
        transparent: true,
        opacity: 0.18
      });
      const torso = new THREE.Mesh(torsoGeo, torsoMat);
      group.add(torso);

      // Kidney / Essence (Dantian) Glowing Sphere
      const essenceGeo = new THREE.SphereGeometry(1.2, 32, 32);
      const essenceMat = new THREE.MeshStandardMaterial({
        color: 0xa3702c,
        emissive: 0x734b17,
        emissiveIntensity: 0.7,
        roughness: 0.25
      });
      const essenceSphere = new THREE.Mesh(essenceGeo, essenceMat);
      essenceSphere.position.set(0, -2.5, 0);
      group.add(essenceSphere);

      // Heart / Qi-Blood Pump Sphere
      const heartGeo = new THREE.SphereGeometry(1.0, 32, 32);
      const heartMat = new THREE.MeshStandardMaterial({
        color: 0x9b3333,
        emissive: 0x611f1f,
        emissiveIntensity: 0.8,
        roughness: 0.3
      });
      const heartSphere = new THREE.Mesh(heartGeo, heartMat);
      heartSphere.position.set(0, 1.5, 0);
      group.add(heartSphere);

      // Particle System for Qi, Blood, Jin-Ye Fluids
      const particleCount = 600;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorQi = new THREE.Color(0xd9a74a); // Muted Golden Amber Qi
      const colorBlood = new THREE.Color(0x9b3333); // Cinnabar Vermilion Blood
      const colorJinye = new THREE.Color(0x2b5b54); // Mineral Cyan Jinye

      for (let i = 0; i < particleCount; i++) {
        const radius = 0.5 + Math.random() * 2.2;
        const angle = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 12;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        let c = colorQi;
        if (i % 3 === 1) c = colorBlood;
        if (i % 3 === 2) c = colorJinye;

        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: true,
        transparent: true,
        opacity: temp === 'cold' ? 0.5 : 0.95
      });

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      particleSystemRef.current = particleSystem;
      group.add(particleSystem);
    }

    // ----------------------------------------------------
    // MODE 2: 玄府微观开阖 (XUANFU MICRO-PORES 3D CELL STRUCTURE)
    // ----------------------------------------------------
    else if (mode === 'xuanfu') {
      // Skin Cell Matrix Floor
      const gridWidth = 5;
      const gridHeight = 5;

      const poreColor =
        xState === 'closed' ? 0x2b5b54 : xState === 'sweating' ? 0x2d7a52 : 0xa3702c;

      for (let x = -gridWidth; x <= gridWidth; x += 2.2) {
        for (let z = -gridHeight; z <= gridHeight; z += 2.2) {
          // Cellular Base Block
          const cellGeo = new THREE.BoxGeometry(1.8, 0.8, 1.8);
          const cellMat = new THREE.MeshStandardMaterial({
            color: 0x262220,
            roughness: 0.7,
            metalness: 0.1
          });
          const cellMesh = new THREE.Mesh(cellGeo, cellMat);
          cellMesh.position.set(x, -1, z);
          group.add(cellMesh);

          // Xuanfu Micro-Pore Cylinder in center
          const poreRadius = xState === 'closed' ? 0.2 : xState === 'sweating' ? 0.65 : 0.4;
          const poreGeo = new THREE.CylinderGeometry(poreRadius, poreRadius * 0.8, 1.4, 16);
          const poreMat = new THREE.MeshStandardMaterial({
            color: poreColor,
            emissive: poreColor,
            emissiveIntensity: 0.35,
            roughness: 0.3
          });
          const poreMesh = new THREE.Mesh(poreGeo, poreMat);
          poreMesh.position.set(x, -0.2, z);
          group.add(poreMesh);
          xuanfuPoresRef.current.push(poreMesh);

          // Sweat Drops floating when sweating
          if (xState === 'sweating') {
            const dropGeo = new THREE.SphereGeometry(0.18, 16, 16);
            const dropMat = new THREE.MeshStandardMaterial({
              color: 0x388e8e,
              roughness: 0.1,
              transparent: true,
              opacity: 0.85
            });
            const drop = new THREE.Mesh(dropGeo, dropMat);
            drop.position.set(x + (Math.random() - 0.5) * 0.4, 1.2 + Math.random() * 1.5, z);
            group.add(drop);
          }
        }
      }

      // Wind-Cold Defensive Shield Dome
      if (xState === 'closed') {
        const shieldGeo = new THREE.SphereGeometry(7, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const shieldMat = new THREE.MeshBasicMaterial({
          color: 0x388e8e,
          wireframe: true,
          transparent: true,
          opacity: 0.35
        });
        const shield = new THREE.Mesh(shieldGeo, shieldMat);
        shield.position.set(0, -1, 0);
        group.add(shield);
      }
    }

    // ----------------------------------------------------
    // MODE 3: 六经传变 (SIX MERIDIANS PATHOGEN TRANSMISSION)
    // ----------------------------------------------------
    else if (mode === 'liujing') {
      const meridianData = [
        { name: '1. 太阳病 (表层玄府)', color: 0x9b3333, radius: 2.5, y: 3 },
        { name: '2. 阳明病 (胃家热实)', color: 0xa3702c, radius: 3.3, y: 1.8 },
        { name: '3. 少阳病 (半表半里枢机)', color: 0x2b5b54, radius: 4.1, y: 0.6 },
        { name: '4. 太阴病 (脾阳虚寒)', color: 0x2d7a52, radius: 4.9, y: -0.6 },
        { name: '5. 少阴病 (心肾阳微)', color: 0x5c4b82, radius: 5.7, y: -1.8 },
        { name: '6. 厥阴病 (阴阳极厥)', color: 0x8c2b4e, radius: 6.5, y: -3.0 }
      ];

      meridianData.forEach((data, idx) => {
        // Torus Ring for each meridian layer
        const ringGeo = new THREE.TorusGeometry(data.radius, 0.12, 16, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          color: data.color,
          emissive: data.color,
          emissiveIntensity: idx === mNode ? 0.75 : 0.2,
          transparent: true,
          opacity: idx === mNode ? 0.9 : 0.3
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = data.y;
        group.add(ring);
        meridianRingsRef.current.push(ring);
      });

      // Pathogen Sphere (寒邪/热邪 3D Entity)
      const pathogenGeo = new THREE.IcosahedronGeometry(0.5, 2);
      const pathogenMat = new THREE.MeshStandardMaterial({
        color: 0x8c2b2b,
        emissive: 0x541818,
        emissiveIntensity: 0.9,
        wireframe: true
      });
      const pathogen = new THREE.Mesh(pathogenGeo, pathogenMat);
      pathogenMeshRef.current = pathogen;
      group.add(pathogen);
    }
  };

  // MERIDIAN EXPLANATION DETAILS DATA
  const MERIDIAN_EXPLANATION = [
    {
      name: '太阳病 (表层气化与玄府)',
      path: '太阳为六经之藩篱，主表而统营卫。邪客太阳，玄府郁闭发为恶寒无汗；或卫强营弱发为发热汗出。',
      formula: '麻黄汤 / 桂枝汤',
      mechanism: '物理内景：桂枝温通心阳卫气，芍药和营敛阴，麻黄宣肺开汗孔。',
      topicId: 'T_LIUJING_1'
    },
    {
      name: '阳明病 (胃家热实与津液)',
      path: '邪入阳明，邪热炽盛伤津，或与肠道糟粕结聚为燥屎。表现为大汗出、大烦渴、潮热谵语。',
      formula: '白虎汤 / 大承气汤',
      mechanism: '物理内景：石膏降温抑气分大热，芒硝渗水软坚，大黄通导有形实结。',
      topicId: 'T_LIUJING_6'
    },
    {
      name: '少阳病 (枢机与三焦膜系)',
      path: '少阳主持半表半里，为气化与膜系体液之枢纽。邪聚少阳致往来寒热、胸胁苦满、心烦喜呕。',
      formula: '小柴胡汤',
      mechanism: '物理内景：柴胡透达少阳郁火，黄芩清泄相火，半夏降逆止呕。',
      topicId: 'T_LIUJING_10'
    },
    {
      name: '太阴病 (脾阳虚寒与水湿)',
      path: '邪传太阴，脾阳衰微，运化失司，水湿内停。表现为腹满而吐、自利不渴、时腹自痛。',
      formula: '理中丸 / 桂枝加芍药汤',
      mechanism: '物理内景：干姜温脾阳，白术燥水湿，人参益脾气，恢复平滑肌吸收。',
      topicId: 'T_LIUJING_13'
    },
    {
      name: '少阴病 (心肾阳微与水气)',
      path: '少阴为水火之枢，心肾阳虚则脉微细、但欲寐、四肢厥逆、水气泛滥。',
      formula: '四逆汤 / 真武汤',
      mechanism: '物理内景：附子强心肾原动力，甘草缓急急救回阳，茯苓白术温阳利水。',
      topicId: 'T_LIUJING_15'
    },
    {
      name: '厥阴病 (阴阳极厥与寒热)',
      path: '厥阴为阴阳交替之极，阴阳失顺致消渴、气上撞心、手足厥逆、上热下寒。',
      formula: '乌梅丸 / 当归四逆汤',
      mechanism: '物理内景：酸苦涌泄与辛甘温阳并用，调平肝木与阴阳紊乱。',
      topicId: 'T_LIUJING_18'
    }
  ];

  return (
    <div className="bg-[#1c1917] text-white border border-[#44403c] rounded-3xl p-5 md:p-7 shadow-2xl space-y-6 relative overflow-hidden">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#332f2c] pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#8c2b2b] text-amber-100 font-bold text-[11px] rounded-full font-mono tracking-wider flex items-center gap-1 shadow-sm border border-rose-900/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>3D WebGL 物理内景仿真引擎</span>
            </span>
            <span className="text-xs text-amber-200/80 font-serif">
              真实几何粒子与光影渲染
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black font-serif text-[#f5f5f4] tracking-wide">
            《伤寒论》晦涩原理 3D 动态可视化
          </h3>
          <p className="text-xs text-[#a8a29e] max-w-2xl leading-relaxed">
            支持鼠标/触摸按住自由旋转视角、滚轮缩放。三维演示“气血精津液运行”、“玄府微观开阖”以及“六经传变轨迹”。
          </p>
        </div>

        {/* MODE SELECTOR TABS */}
        <div className="flex items-center gap-1.5 bg-[#1f1c1a] p-1.5 rounded-2xl border border-[#383330] shrink-0">
          <button
            onClick={() => setActiveMode('qixue')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'qixue'
                ? 'bg-[#8c2b2b] text-stone-100 font-black shadow-md border border-rose-900/50'
                : 'text-zinc-400 hover:text-stone-200'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>气血精津液</span>
          </button>

          <button
            onClick={() => setActiveMode('xuanfu')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'xuanfu'
                ? 'bg-[#2b5b54] text-stone-100 font-black shadow-md border border-teal-900/50'
                : 'text-zinc-400 hover:text-stone-200'
            }`}
          >
            <Wind className="w-4 h-4 text-teal-300" />
            <span>玄府开阖</span>
          </button>

          <button
            onClick={() => setActiveMode('liujing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'liujing'
                ? 'bg-[#a3702c] text-stone-950 font-black shadow-md border border-amber-400/50'
                : 'text-zinc-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-4 h-4 text-stone-950" />
            <span>六经传变</span>
          </button>
        </div>
      </div>

      {/* CANVAS & INTERACTIVE CONTROL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 3D WEBGL CANVAS STAGE */}
        <div className="lg:col-span-8 bg-[#0c0a09] border border-[#292524] rounded-3xl p-2 relative min-h-[460px] shadow-inner overflow-hidden flex flex-col justify-between">
          
          {/* Floating Canvas Top Overlay Controls */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <div className="bg-[#1c1917]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#332f2c] text-xs font-serif font-bold text-amber-200 pointer-events-auto flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                {activeMode === 'qixue' && '三维粒子场: 肾精/宗气/营血/津液'}
                {activeMode === 'xuanfu' && '微观细胞阵列: 玄府毛窍汗孔'}
                {activeMode === 'liujing' && '六经层次同心环与病邪演变轨迹'}
              </span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto bg-[#1c1917]/90 p-1 rounded-xl border border-[#332f2c]">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 hover:bg-[#292524] rounded-lg text-amber-300 transition-colors"
                title={isPlaying ? '暂停动画' : '播放动画'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
                className="px-2 py-1 text-[11px] font-mono font-bold bg-[#292524] hover:bg-[#332f2c] rounded-lg text-amber-200 transition-colors"
              >
                {speed}x 速率
              </button>
            </div>
          </div>

          {/* WebGL Canvas Container */}
          <div
            ref={mountRef}
            className="w-full h-[460px] rounded-2xl cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />

          {/* Bottom Floating Hint */}
          <div className="absolute bottom-4 left-4 z-10 text-[11px] text-zinc-500 font-mono bg-[#0c0a09]/80 px-2.5 py-1 rounded-lg border border-[#292524]">
            💡 提示: 按住鼠标拖拽可 3D 旋转，滚轮可缩放视角
          </div>
        </div>

        {/* SIDE PARAMETER & SIMULATION CONTROL BOARD */}
        <div className="lg:col-span-4 bg-[#292524] border border-[#44403c] rounded-3xl p-5 space-y-5 shadow-xl">
          
          {/* MODE 1 CONTROLS */}
          {activeMode === 'qixue' && (
            <div className="space-y-4">
              <div className="border-b border-[#383330] pb-3">
                <h4 className="text-base font-bold font-serif text-amber-200 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>气血精津液 气化调控</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  《伤寒论》核心在于调和气血津液，调节气化之寒热平衡。
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">环境寒热温度刺激:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTemperature('cold')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      temperature === 'cold'
                        ? 'bg-sky-950 border-sky-500 text-sky-200 shadow-sm'
                        : 'bg-[#1c1917] border-[#383330] text-zinc-400'
                    }`}
                  >
                    ❄️ 寒邪凝滞
                  </button>
                  <button
                    onClick={() => setTemperature('normal')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      temperature === 'normal'
                        ? 'bg-amber-950 border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-[#1c1917] border-[#383330] text-zinc-400'
                    }`}
                  >
                    🌱 平衡常态
                  </button>
                  <button
                    onClick={() => setTemperature('heat')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      temperature === 'heat'
                        ? 'bg-rose-950 border-rose-500 text-rose-200 shadow-sm'
                        : 'bg-[#1c1917] border-[#383330] text-zinc-400'
                    }`}
                  >
                    🔥 阳明大热
                  </button>
                </div>
              </div>

              <div className="bg-[#1c1917] p-3.5 rounded-2xl border border-[#3d3835] space-y-2">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>粒子三维色标指示:</span>
                </span>
                <div className="text-xs space-y-1.5 text-zinc-300">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-300 shrink-0" />
                    <span><b>宗气 / 卫气</b>：高频金黄色粒子，循行于体表与胸中。</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <span><b>营血</b>：深红色粒子，沿脉道贯通心肾轴。</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                    <span><b>津液</b>：浅蓝色粒子，润泽脏腑与玄府汗孔。</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2 CONTROLS */}
          {activeMode === 'xuanfu' && (
            <div className="space-y-4">
              <div className="border-b border-[#383330] pb-3">
                <h4 className="text-base font-bold font-serif text-amber-200 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-sky-400" />
                  <span>玄府微观汗孔开阖调控</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  金元刘完素提倡“玄府学说”：玄府为气血津液升降出入之微观门户。
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">玄府状态与方剂作用:</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setXuanfuState('closed')}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all ${
                      xuanfuState === 'closed'
                        ? 'bg-sky-950 border-sky-500 text-sky-200 shadow-sm'
                        : 'bg-[#1c1917] border-[#383330] text-zinc-400'
                    }`}
                  >
                    <span>1. 风寒束表 (麻黄汤证: 玄府郁闭无汗)</span>
                    <span className="text-[10px] bg-sky-900 px-1.5 py-0.5 rounded">毛窍紧闭</span>
                  </button>

                  <button
                    onClick={() => setXuanfuState('sweating')}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all ${
                      xuanfuState === 'sweating'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-200 shadow-sm'
                        : 'bg-[#1c1917] border-[#383330] text-zinc-400'
                    }`}
                  >
                    <span>2. 解表发汗 (麻黄开腠理 / 桂枝和营卫)</span>
                    <span className="text-[10px] bg-emerald-900 px-1.5 py-0.5 rounded">津液蒸腾</span>
                  </button>

                  <button
                    onClick={() => setXuanfuState('normal')}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all ${
                      xuanfuState === 'normal'
                        ? 'bg-amber-950 border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-[#1c1917] border-[#383330] text-zinc-400'
                    }`}
                  >
                    <span>3. 常态开阖 (卫气固密，玄府通畅)</span>
                    <span className="text-[10px] bg-amber-900 px-1.5 py-0.5 rounded">正常出入</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-amber-100/90 font-serif bg-[#1c1917] p-3 rounded-2xl border border-[#3d3835] leading-relaxed">
                “玄府者，无物不有，无处不在，乃气血津液升降出入之门户。”——麻黄强力扩张毛窍，桂枝和营卫，即为调节玄府开阖之典范。
              </p>
            </div>
          )}

          {/* MODE 3 CONTROLS */}
          {activeMode === 'liujing' && (
            <div className="space-y-4">
              <div className="border-b border-[#383330] pb-3">
                <h4 className="text-base font-bold font-serif text-amber-200 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>六经传变层次选择</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  点击下方六经层次，查看病邪入侵深度与对应经络之病机：
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {MERIDIAN_EXPLANATION.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMeridianNode(idx)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                      activeMeridianNode === idx
                        ? 'bg-amber-500 border-amber-400 text-stone-950 font-black shadow-md'
                        : 'bg-[#1c1917] border-[#383330] text-zinc-300 hover:bg-[#23201e]'
                    }`}
                  >
                    {item.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Selected Meridian Details Card */}
              <div className="bg-[#1c1917] p-3.5 rounded-2xl border border-[#3d3835] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 font-serif">
                    {MERIDIAN_EXPLANATION[activeMeridianNode].name}
                  </span>
                  <span className="text-[10px] bg-rose-950 border border-rose-800 text-rose-300 px-2 py-0.5 rounded-full font-mono">
                    主方: {MERIDIAN_EXPLANATION[activeMeridianNode].formula}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {MERIDIAN_EXPLANATION[activeMeridianNode].path}
                </p>

                <div className="pt-1 text-[11px] text-amber-100/90 font-serif border-t border-[#292524]">
                  💡 {MERIDIAN_EXPLANATION[activeMeridianNode].mechanism}
                </div>

                {MERIDIAN_EXPLANATION[activeMeridianNode].topicId && onSelectTopic && (
                  <button
                    onClick={() => onSelectTopic(MERIDIAN_EXPLANATION[activeMeridianNode].topicId)}
                    className="w-full mt-2 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span>直达【{MERIDIAN_EXPLANATION[activeMeridianNode].formula.split(' ')[0]}】通关刷题</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
