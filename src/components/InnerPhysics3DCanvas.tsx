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
  ChevronRight,
  Info,
  Wind,
  Flame,
  Activity,
  Compass,
  Eye,
  Target,
  Waypoints,
  Camera,
  ArrowRight
} from 'lucide-react';

export type SimulationMode = 'qixue' | 'xuanfu' | 'liujing';

interface InnerPhysics3DCanvasProps {
  onSelectTopic?: (topicId: string) => void;
  initialMode?: SimulationMode;
}

// Meridian Node Definition with 3D Spatial Coordinates on Human Model
export interface MeridianNodeData {
  id: number;
  key: string;
  name: string;
  shortName: string;
  color: number;
  hexColor: string;
  position: [number, number, number]; // [x, y, z] on 3D body
  cameraOffset: [number, number, number]; // [x, y, z] relative camera view
  path: string;
  formula: string;
  mechanism: string;
  topicId: string;
}

export const MERIDIAN_NODES: MeridianNodeData[] = [
  {
    id: 0,
    key: 'taiyang',
    name: '太阳病 (表层气化与玄府)',
    shortName: '1. 太阳 (表)',
    color: 0xe11d48, // Cinnabar Red
    hexColor: '#e11d48',
    position: [0, 4.5, -0.6], // Head / Back / Neck
    cameraOffset: [0, 5, 8],
    path: '太阳为六经之藩篱，主表而统营卫。邪客太阳，玄府郁闭发为恶寒无汗；或卫强营弱发为发热汗出。',
    formula: '麻黄汤 / 桂枝汤',
    mechanism: '物理内景：桂枝温通心阳卫气，芍药和营敛阴，麻黄宣肺开汗孔。',
    topicId: 'T_LIUJING_1'
  },
  {
    id: 1,
    key: 'yangming',
    name: '阳明病 (胃家热实与津液)',
    shortName: '2. 阳明 (燥热)',
    color: 0xd97706, // Amber Gold
    hexColor: '#d97706',
    position: [0, 1.2, 1.2], // Front Chest / Stomach / Abdomen
    cameraOffset: [0, 1.5, 9],
    path: '邪入阳明，邪热炽盛伤津，或与肠道糟粕结聚为燥屎。表现为大汗出、大烦渴、潮热谵语。',
    formula: '白虎汤 / 大承气汤',
    mechanism: '物理内景：石膏降温抑气分大热，芒硝渗水软坚，大黄通导有形实结。',
    topicId: 'T_LIUJING_6'
  },
  {
    id: 2,
    key: 'shaoyang',
    name: '少阳病 (枢机与三焦膜系)',
    shortName: '3. 少阳 (枢机)',
    color: 0x0d9488, // Jade Cyan
    hexColor: '#0d9488',
    position: [1.8, 2.0, 0], // Lateral Flank / Chest sides
    cameraOffset: [4.5, 2.0, 8],
    path: '少阳主持半表半里，为气化与膜系体液之枢纽。邪聚少阳致往来寒热、胸胁苦满、心烦喜呕。',
    formula: '小柴胡汤',
    mechanism: '物理内景：柴胡透达少阳郁火，黄芩清泄相火，半夏降逆止呕。',
    topicId: 'T_LIUJING_10'
  },
  {
    id: 3,
    key: 'taiyin',
    name: '太阴病 (脾阳虚寒与水湿)',
    shortName: '4. 太阴 (脾虚)',
    color: 0x16a34a, // Emerald Green
    hexColor: '#16a34a',
    position: [0, -0.8, 0.8], // Spleen / Lower Abdomen
    cameraOffset: [0, -0.8, 8.5],
    path: '邪传太阴，脾阳衰微，运化失司，水湿内停。表现为腹满而吐、自利不渴、时腹自痛。',
    formula: '理中丸 / 桂枝加芍药汤',
    mechanism: '物理内景：干姜温脾阳，白术燥水湿，人参益脾气，恢复平滑肌吸收。',
    topicId: 'T_LIUJING_13'
  },
  {
    id: 4,
    key: 'shaoyin',
    name: '少阴病 (心肾阳微与水气)',
    shortName: '5. 少阴 (心肾)',
    color: 0x7c3aed, // Violet
    hexColor: '#7c3aed',
    position: [0, -2.6, 0.2], // Lower Heart / Kidney Axis
    cameraOffset: [0, -2.6, 8],
    path: '少阴为水火之枢，心肾阳虚则脉微细、但欲寐、四肢厥逆、水气泛滥。',
    formula: '四逆汤 / 真武汤',
    mechanism: '物理内景：附子强心肾原动力，甘草缓急急救回阳，茯苓白术温阳利水。',
    topicId: 'T_LIUJING_15'
  },
  {
    id: 5,
    key: 'jueyin',
    name: '厥阴病 (阴阳极厥与寒热)',
    shortName: '6. 厥阴 (极阴)',
    color: 0xbe185d, // Crimson Rose
    hexColor: '#be185d',
    position: [0, -4.2, 0], // Deep Liver / Pericardium Core / Pelvic Deep
    cameraOffset: [0, -4.2, 7.5],
    path: '厥阴为阴阳交替之极，阴阳失顺致消渴、气上撞心、手足厥逆、上热下寒。',
    formula: '乌梅丸 / 当归四逆汤',
    mechanism: '物理内景：酸苦涌泄与辛甘温阳并用，调平肝木与阴阳紊乱。',
    topicId: 'T_LIUJING_18'
  }
];

// Preset Transmission Routes (病机传变路线)
export interface TransmissionRoute {
  id: string;
  title: string;
  desc: string;
  nodeSequence: number[]; // Sequence of node IDs
}

export const TRANSMISSION_ROUTES: TransmissionRoute[] = [
  {
    id: 'full_sequence',
    title: '六经依次传变 (太阳→阳明→少阳→太阴→少阴→厥阴)',
    desc: '从表入里、由浅入深的六经病机自然传变演进全过程。',
    nodeSequence: [0, 1, 2, 3, 4, 5]
  },
  {
    id: 'taiyang_yangming',
    title: '太阳传阳明 (表邪入里化热)',
    desc: '表寒未解，邪热转入胃肠充斥阳明，发为高热大汗。',
    nodeSequence: [0, 1]
  },
  {
    id: 'taiyang_shaoyang',
    title: '太阳传少阳 (表邪转港枢机)',
    desc: '表邪转入半表半里膜原，枢机不利发为往来寒热。',
    nodeSequence: [0, 2]
  },
  {
    id: 'taiyang_taiyin',
    title: '太阳直中太阴 (误下损伤脾阳)',
    desc: '表病误投苦寒攻下，直中太阴脾胃，发为腹满下利。',
    nodeSequence: [0, 3]
  },
  {
    id: 'shaoyin_jueyin',
    title: '少阴传厥阴 (心肾阳衰至极)',
    desc: '少阴危候进一步加重，阴阳极度失顺，手足厥冷。',
    nodeSequence: [4, 5]
  }
];

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
  const [activeMeridianNode, setActiveMeridianNode] = useState<number>(0);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('full_sequence');
  const [isCameraTracking, setIsCameraTracking] = useState<boolean>(true);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Smooth Camera Lerp Targets
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 18));
  const targetCameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentCameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Mouse drag control state
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationGroupRef = useRef<THREE.Group | null>(null);

  // Mode specific animated meshes refs
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const xuanfuPoresRef = useRef<THREE.Mesh[]>([]);
  const nodeMeshesRef = useRef<THREE.Mesh[]>([]);
  const pathLinesGroupRef = useRef<THREE.Group | null>(null);
  const lightPulseSpheresRef = useRef<THREE.Mesh[]>([]);
  const activeTransmissionCurves = useRef<THREE.CatmullRomCurve3[]>([]);

  // Raycaster for 3D Node Clicking
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseVecRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x12100e); // Deep Warm Charcoal Ink
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfef3c7, 1.2);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x388e8e, 0.8);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // Group for mouse rotation and human model
    const rotationGroup = new THREE.Group();
    scene.add(rotationGroup);
    rotationGroupRef.current = rotationGroup;

    // Build scene according to activeMode
    buildSceneContent(activeMode, rotationGroup, temperature, xuanfuState, activeMeridianNode, selectedRouteId);

    // 5. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth Camera Lerp Animation
      if (cameraRef.current && isCameraTracking) {
        cameraRef.current.position.lerp(targetCameraPos.current, 0.05);
        currentCameraLookAt.current.lerp(targetCameraLookAt.current, 0.05);
        cameraRef.current.lookAt(currentCameraLookAt.current);
      }

      if (isPlaying && rotationGroupRef.current) {
        // Subtle auto idle rotation if not dragging
        if (!isDragging.current) {
          rotationGroupRef.current.rotation.y += 0.002 * speed;
        }

        // Mode 1: Qi & Blood Animation
        if (activeMode === 'qixue' && particleSystemRef.current) {
          const positions = particleSystemRef.current.geometry.attributes.position;
          const count = positions.count;

          for (let i = 0; i < count; i++) {
            let y = positions.getY(i);
            y += (0.05 + (i % 3) * 0.02) * speed;
            if (y > 7) y = -7;
            positions.setY(i, y);

            let x = positions.getX(i);
            x += Math.sin(elapsed * 2 + i) * 0.01;
            positions.setX(i, x);
          }
          positions.needsUpdate = true;
        }

        // Mode 2: Xuanfu Micro-pores Pulse
        if (activeMode === 'xuanfu' && xuanfuPoresRef.current.length > 0) {
          xuanfuPoresRef.current.forEach((pore, idx) => {
            const pulseScale = 1 + Math.sin(elapsed * 3 + idx) * 0.08;
            pore.scale.set(pulseScale, pulseScale, pulseScale);
          });
        }

        // Mode 3: Six Meridians Pathogen Flowing Light Line Animation
        if (activeMode === 'liujing') {
          // Pulse Meridian Nodes
          nodeMeshesRef.current.forEach((nodeMesh, idx) => {
            if (idx === activeMeridianNode) {
              const scale = 1 + Math.sin(elapsed * 4) * 0.15;
              nodeMesh.scale.set(scale, scale, scale);
              (nodeMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9 + Math.sin(elapsed * 6) * 0.3;
            } else {
              nodeMesh.scale.set(1, 1, 1);
              (nodeMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4;
            }
          });

          // Flowing Light Pulses on Curves
          if (activeTransmissionCurves.current.length > 0 && lightPulseSpheresRef.current.length > 0) {
            lightPulseSpheresRef.current.forEach((pulseSphere, idx) => {
              const curve = activeTransmissionCurves.current[idx % activeTransmissionCurves.current.length];
              if (curve) {
                // Calculate position along curve from 0 to 1
                const speedFactor = 0.3 * speed;
                const progress = (elapsed * speedFactor + (idx * 0.25)) % 1.0;
                const point = curve.getPoint(progress);
                pulseSphere.position.copy(point);

                // Pulse opacity and scale
                const pulseScale = 1 + Math.sin(elapsed * 8 + idx) * 0.25;
                pulseSphere.scale.set(pulseScale, pulseScale, pulseScale);
              }
            });
          }
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

  // Update camera lerp targets when active node changes or mode changes
  useEffect(() => {
    if (activeMode === 'liujing') {
      const node = MERIDIAN_NODES[activeMeridianNode];
      if (node && isCameraTracking) {
        targetCameraPos.current.set(
          node.position[0] + node.cameraOffset[0],
          node.position[1] + node.cameraOffset[1],
          node.position[2] + node.cameraOffset[2]
        );
        targetCameraLookAt.current.set(
          node.position[0],
          node.position[1],
          node.position[2]
        );
      }
    } else {
      // Default overview camera position for other modes
      targetCameraPos.current.set(0, 0, 18);
      targetCameraLookAt.current.set(0, 0, 0);
    }
  }, [activeMeridianNode, activeMode, isCameraTracking]);

  // Re-build scene content when mode/state/selected route updates
  useEffect(() => {
    if (rotationGroupRef.current) {
      buildSceneContent(activeMode, rotationGroupRef.current, temperature, xuanfuState, activeMeridianNode, selectedRouteId);
    }
  }, [activeMode, temperature, xuanfuState, activeMeridianNode, selectedRouteId]);

  // Mouse Drag Interaction
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
    targetCameraPos.current.z = Math.min(Math.max(targetCameraPos.current.z + e.deltaY * 0.01, 6), 30);
  };

  // Click on 3D Canvas Raycaster for Node Selection
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || activeMode !== 'liujing') return;

    const rect = mountRef.current.getBoundingClientRect();
    mouseVecRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseVecRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseVecRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(nodeMeshesRef.current, true);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      const nodeId = clickedMesh.userData.nodeId;
      if (typeof nodeId === 'number') {
        setActiveMeridianNode(nodeId);
      }
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    targetCameraPos.current.set(0, 0, 18);
    targetCameraLookAt.current.set(0, 0, 0);
    if (rotationGroupRef.current) {
      rotationGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  // BUILD 3D SCENE MESHES
  const buildSceneContent = (
    mode: SimulationMode,
    group: THREE.Group,
    temp: 'normal' | 'cold' | 'heat',
    xState: 'closed' | 'normal' | 'sweating',
    mNode: number,
    routeId: string
  ) => {
    // Clear previous children
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    xuanfuPoresRef.current = [];
    nodeMeshesRef.current = [];
    lightPulseSpheresRef.current = [];
    activeTransmissionCurves.current = [];
    particleSystemRef.current = null;

    // ----------------------------------------------------
    // BUILD 3D HUMAN BODY SILHOUETTE (MODERN TRANSLUCENT ANATOMY)
    // ----------------------------------------------------
    const bodyColor = temp === 'cold' ? 0x1e3a3a : temp === 'heat' ? 0x4a1e1e : 0x2d2620;

    // Head Sphere
    const headGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const bodyMat = new THREE.MeshBasicMaterial({
      color: bodyColor,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 5.2, 0);
    group.add(head);

    // Torso Cylinder
    const torsoGeo = new THREE.CylinderGeometry(2.2, 1.6, 7.5, 20, 1, true);
    const torso = new THREE.Mesh(torsoGeo, bodyMat);
    torso.position.set(0, 0.5, 0);
    group.add(torso);

    // Spine Central Axis
    const spinePoints = [
      new THREE.Vector3(0, 5.0, 0),
      new THREE.Vector3(0, 2.5, -0.4),
      new THREE.Vector3(0, -0.5, -0.2),
      new THREE.Vector3(0, -3.5, 0)
    ];
    const spineCurve = new THREE.CatmullRomCurve3(spinePoints);
    const spineGeo = new THREE.TubeGeometry(spineCurve, 32, 0.08, 8, false);
    const spineMat = new THREE.MeshBasicMaterial({
      color: 0xd97706,
      transparent: true,
      opacity: 0.35
    });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    group.add(spine);

    // ----------------------------------------------------
    // MODE 1: 气血精津液 (QI, BLOOD, ESSENCE, JIN-YE DYNAMICS)
    // ----------------------------------------------------
    if (mode === 'qixue') {
      // Kidney / Essence (Dantian) Glowing Sphere
      const essenceGeo = new THREE.SphereGeometry(1.2, 32, 32);
      const essenceMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        emissive: 0x92400e,
        emissiveIntensity: 0.8,
        roughness: 0.25
      });
      const essenceSphere = new THREE.Mesh(essenceGeo, essenceMat);
      essenceSphere.position.set(0, -2.5, 0);
      group.add(essenceSphere);

      // Heart / Qi-Blood Pump Sphere
      const heartGeo = new THREE.SphereGeometry(1.0, 32, 32);
      const heartMat = new THREE.MeshStandardMaterial({
        color: 0xe11d48,
        emissive: 0x9f1239,
        emissiveIntensity: 0.85,
        roughness: 0.3
      });
      const heartSphere = new THREE.Mesh(heartGeo, heartMat);
      heartSphere.position.set(0, 1.8, 0.2);
      group.add(heartSphere);

      // Particle System for Qi, Blood, Jin-Ye Fluids
      const particleCount = 650;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorQi = new THREE.Color(0xf59e0b); // Golden Amber Qi
      const colorBlood = new THREE.Color(0xe11d48); // Cinnabar Vermilion Blood
      const colorJinye = new THREE.Color(0x06b6d4); // Cyan Jinye

      for (let i = 0; i < particleCount; i++) {
        const radius = 0.4 + Math.random() * 2.2;
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
      const gridWidth = 4;
      const gridHeight = 4;

      const poreColor =
        xState === 'closed' ? 0x0284c7 : xState === 'sweating' ? 0x10b981 : 0xd97706;

      for (let x = -gridWidth; x <= gridWidth; x += 2.0) {
        for (let z = -gridHeight; z <= gridHeight; z += 2.0) {
          const cellGeo = new THREE.BoxGeometry(1.6, 0.8, 1.6);
          const cellMat = new THREE.MeshStandardMaterial({
            color: 0x221f1d,
            roughness: 0.7,
            metalness: 0.1
          });
          const cellMesh = new THREE.Mesh(cellGeo, cellMat);
          cellMesh.position.set(x, -1, z);
          group.add(cellMesh);

          const poreRadius = xState === 'closed' ? 0.2 : xState === 'sweating' ? 0.65 : 0.4;
          const poreGeo = new THREE.CylinderGeometry(poreRadius, poreRadius * 0.8, 1.4, 16);
          const poreMat = new THREE.MeshStandardMaterial({
            color: poreColor,
            emissive: poreColor,
            emissiveIntensity: 0.4,
            roughness: 0.3
          });
          const poreMesh = new THREE.Mesh(poreGeo, poreMat);
          poreMesh.position.set(x, -0.2, z);
          group.add(poreMesh);
          xuanfuPoresRef.current.push(poreMesh);

          if (xState === 'sweating') {
            const dropGeo = new THREE.SphereGeometry(0.18, 16, 16);
            const dropMat = new THREE.MeshStandardMaterial({
              color: 0x38bdf8,
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

      if (xState === 'closed') {
        const shieldGeo = new THREE.SphereGeometry(6.5, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const shieldMat = new THREE.MeshBasicMaterial({
          color: 0x0284c7,
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
    // MODE 3: 六经传变轨迹线与病机节点 (INTERACTIVE MERIDIAN TRANSMISSION PATHS)
    // ----------------------------------------------------
    else if (mode === 'liujing') {
      const pathGroup = new THREE.Group();
      pathLinesGroupRef.current = pathGroup;
      group.add(pathGroup);

      // 1. Render 3D Meridian Nodes on the Human Body
      MERIDIAN_NODES.forEach((node) => {
        const isSelected = node.id === mNode;

        // Node Glowing Sphere
        const sphereGeo = new THREE.SphereGeometry(isSelected ? 0.48 : 0.35, 24, 24);
        const sphereMat = new THREE.MeshStandardMaterial({
          color: node.color,
          emissive: node.color,
          emissiveIntensity: isSelected ? 0.95 : 0.4,
          roughness: 0.2
        });
        const nodeMesh = new THREE.Mesh(sphereGeo, sphereMat);
        nodeMesh.position.set(node.position[0], node.position[1], node.position[2]);
        nodeMesh.userData = { nodeId: node.id };
        group.add(nodeMesh);
        nodeMeshesRef.current.push(nodeMesh);

        // Outer Halo Ring
        const haloGeo = new THREE.RingGeometry(0.5, 0.7, 32);
        const haloMat = new THREE.MeshBasicMaterial({
          color: node.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: isSelected ? 0.8 : 0.25
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.position.set(node.position[0], node.position[1], node.position[2]);
        haloMesh.lookAt(0, 0, 10);
        group.add(haloMesh);
      });

      // 2. Build Transmission Route Curves & Flowing Light Lines
      const currentRoute = TRANSMISSION_ROUTES.find((r) => r.id === routeId) || TRANSMISSION_ROUTES[0];
      const seq = currentRoute.nodeSequence;

      for (let i = 0; i < seq.length - 1; i++) {
        const startNode = MERIDIAN_NODES[seq[i]];
        const endNode = MERIDIAN_NODES[seq[i + 1]];

        if (startNode && endNode) {
          const startVec = new THREE.Vector3(...startNode.position);
          const endVec = new THREE.Vector3(...endNode.position);

          // Calculate arched midpoint for 3D trajectory curve
          const midVec = new THREE.Vector3()
            .addVectors(startVec, endVec)
            .multiplyScalar(0.5);
          
          // Add outward arc offset depending on node pair
          const offsetDist = 1.2 + Math.abs(startNode.id - endNode.id) * 0.4;
          if (startNode.id === 2 || endNode.id === 2) {
            midVec.x += offsetDist * 0.8; // Lateral arc for Shaoyang
          } else {
            midVec.z += offsetDist; // Frontal arc
          }

          const curve = new THREE.CatmullRomCurve3([startVec, midVec, endVec]);
          activeTransmissionCurves.current.push(curve);

          // Tube Geometry for Meridian Path Line
          const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
          const tubeMat = new THREE.MeshStandardMaterial({
            color: startNode.color,
            emissive: startNode.color,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.75,
            wireframe: false
          });
          const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
          pathGroup.add(tubeMesh);

          // Dynamic Flowing Light Pulse Spheres along path
          const pulseCount = 3;
          for (let p = 0; p < pulseCount; p++) {
            const pulseGeo = new THREE.SphereGeometry(0.2, 16, 16);
            const pulseMat = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.9
            });
            const pulseSphere = new THREE.Mesh(pulseGeo, pulseMat);
            pathGroup.add(pulseSphere);
            lightPulseSpheresRef.current.push(pulseSphere);
          }
        }
      }
    }
  };

  return (
    <div className="bg-[#1c1917] text-white border border-[#44403c] rounded-3xl p-5 md:p-7 shadow-2xl space-y-6 relative overflow-hidden font-sans">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#332f2c] pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#8c2b2b] text-amber-100 font-bold text-[11px] rounded-full font-mono tracking-wider flex items-center gap-1 shadow-sm border border-rose-900/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>3D WebGL 经络传变与光影内景引擎</span>
            </span>
            <span className="text-xs text-amber-200/80 font-serif hidden sm:inline">
              流动态轨迹线 · 平滑镜头跟随
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black font-serif text-[#f5f5f4] tracking-wide">
            《伤寒论》六经传变 3D 交互轨迹图谱
          </h3>
          <p className="text-xs text-[#a8a29e] max-w-2xl leading-relaxed">
            点击病机节点或传变路线，生成气血在六经间流动的光影轨迹线，平滑相机视角自动跟焦锁定内景病理。
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
                ? 'bg-[#d97706] text-stone-950 font-black shadow-md border border-amber-400/50'
                : 'text-zinc-400 hover:text-stone-200'
            }`}
          >
            <Waypoints className="w-4 h-4 text-stone-950" />
            <span>六经传变轨迹</span>
          </button>
        </div>
      </div>

      {/* CANVAS & INTERACTIVE CONTROL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 3D WEBGL CANVAS STAGE */}
        <div className="lg:col-span-8 bg-[#0c0a09] border border-[#292524] rounded-3xl p-2 relative min-h-[480px] shadow-inner overflow-hidden flex flex-col justify-between">
          
          {/* Floating Canvas Top Overlay Controls */}
          <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="bg-[#1c1917]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#332f2c] text-xs font-serif font-bold text-amber-200 pointer-events-auto flex items-center gap-2 shadow-lg">
              <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>
                {activeMode === 'qixue' && '三维粒子场: 肾精/宗气/营血/津液'}
                {activeMode === 'xuanfu' && '微观细胞阵列: 玄府毛窍汗孔'}
                {activeMode === 'liujing' && `3D光影流向: ${MERIDIAN_NODES[activeMeridianNode].name}`}
              </span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto bg-[#1c1917]/90 p-1 rounded-xl border border-[#332f2c] shadow-lg">
              <button
                onClick={() => setIsCameraTracking(!isCameraTracking)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 ${
                  isCameraTracking ? 'bg-amber-600 text-stone-950' : 'bg-[#292524] text-zinc-400'
                }`}
                title="开启/关闭相机跟焦"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isCameraTracking ? '跟焦开启' : '跟焦锁定'}</span>
              </button>

              <button
                onClick={handleResetCamera}
                className="p-1.5 hover:bg-[#292524] rounded-lg text-amber-300 transition-colors"
                title="重置 3D 视角"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 hover:bg-[#292524] rounded-lg text-amber-300 transition-colors"
                title={isPlaying ? '暂停动画' : '播放动画'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
                className="px-2 py-1 text-[11px] font-mono font-bold bg-[#292524] hover:bg-[#332f2c] rounded-lg text-amber-200 transition-colors"
              >
                {speed}x
              </button>
            </div>
          </div>

          {/* WebGL Canvas Container */}
          <div
            ref={mountRef}
            onClick={handleCanvasClick}
            className="w-full h-[480px] rounded-2xl cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />

          {/* Bottom Floating Overlay Hint */}
          <div className="absolute bottom-4 left-4 z-10 text-[11px] text-amber-200/90 font-mono bg-[#0c0a09]/85 px-3 py-1.5 rounded-xl border border-[#292524] flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>直接点击 3D 人体上的病机发光节点，可触发流体轨迹与视角跟随</span>
          </div>
        </div>

        {/* SIDE PARAMETER & TRANSMISSION ROUTE CONTROL BOARD */}
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
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                    <span><b>宗气 / 卫气</b>：金黄色粒子，循行于体表与胸中。</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <span><b>营血</b>：深红色粒子，沿脉道贯通心肾轴。</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0" />
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

          {/* MODE 3 CONTROLS - MERIDIAN TRANSMISSION PATHS */}
          {activeMode === 'liujing' && (
            <div className="space-y-4">
              {/* Route Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5 font-serif">
                  <Waypoints className="w-4 h-4 text-amber-400" />
                  <span>病机传变轨迹模式 (光影管道):</span>
                </label>
                <div className="space-y-1.5">
                  {TRANSMISSION_ROUTES.map((route) => (
                    <button
                      key={route.id}
                      onClick={() => setSelectedRouteId(route.id)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                        selectedRouteId === route.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-100 font-bold shadow-md'
                          : 'bg-[#1c1917] border-[#383330] text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{route.title}</span>
                        {selectedRouteId === route.id && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Meridian Nodes Selector */}
              <div className="space-y-2 pt-2 border-t border-[#383330]">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span>点击病机节点 (相机聚焦跟随):</span>
                  <span className="text-[10px] text-amber-400">已选: {MERIDIAN_NODES[activeMeridianNode].shortName}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MERIDIAN_NODES.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => setActiveMeridianNode(node.id)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-left transition-all flex items-center gap-2 cursor-pointer ${
                        activeMeridianNode === node.id
                          ? 'bg-amber-500 border-amber-400 text-stone-950 font-black shadow-lg scale-[1.02]'
                          : 'bg-[#1c1917] border-[#383330] text-zinc-300 hover:bg-[#23201e]'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: node.hexColor }}
                      />
                      <span className="truncate">{node.shortName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Meridian Details Card */}
              <div className="bg-[#1c1917] p-3.5 rounded-2xl border border-[#3d3835] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 font-serif">
                    {MERIDIAN_NODES[activeMeridianNode].name}
                  </span>
                  <span className="text-[10px] bg-rose-950 border border-rose-800 text-rose-300 px-2 py-0.5 rounded-full font-mono">
                    主方: {MERIDIAN_NODES[activeMeridianNode].formula}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {MERIDIAN_NODES[activeMeridianNode].path}
                </p>

                <div className="pt-2 text-[11px] text-amber-100/90 font-serif border-t border-[#292524]">
                  💡 {MERIDIAN_NODES[activeMeridianNode].mechanism}
                </div>

                {MERIDIAN_NODES[activeMeridianNode].topicId && onSelectTopic && (
                  <button
                    onClick={() => onSelectTopic(MERIDIAN_NODES[activeMeridianNode].topicId)}
                    className="w-full mt-2 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <span>直达【{MERIDIAN_NODES[activeMeridianNode].formula.split(' ')[0]}】通关刷题</span>
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
