/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  INNER_MECHANISM_NODES,
  INNER_MECHANISM_LINKS,
  InnerMechanismNode,
  InnerMechanismLink
} from '../data/innerMechanismData';
import Holographic3DGraph from './Holographic3DGraph';
import StackedFormulaPathwayGraph from './StackedFormulaPathwayGraph';
import {
  Activity,
  Zap,
  Shield,
  Stethoscope,
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Info,
  Brain,
  Compass,
  Flame,
  Droplets,
  Heart,
  Thermometer,
  Play,
  FastForward,
  RotateCw,
  Move,
  Eye,
  EyeOff
} from 'lucide-react';

const MERIDIAN_3D_DATA = {
  taiyang: {
    id: 'taiyang',
    name: '太阳病 · 体表玄府区',
    title: '太阳经 (足太阳膀胱经 / 手太阳小肠经) · 气体交换与体表散热屏障',
    image: '/src/assets/images/taiyang_anatomy_ink_1785941202339.jpg',
    colorHex: '#ef4444',
    badgeBg: 'bg-red-500',
    pathwayTitle: '太阳表郁 → 卫气阻遏 → 肌腠痉挛传变路线',
    pathwayDescription: '风寒侵袭体表皮毛，玄府（毛窍微孔）受寒紧闭。卫气不得宣发而出，郁而化热；营血受阻于后项与背部膀胱经太阳之域，引发头项强痛、恶寒发热、脉浮紧。',
    organFocus: '体表皮毛、玄府微孔、太阳膀胱经走行区（项背腰臀）、肺主皮毛系统',
    keyFormulas: [
      { name: '麻黄汤', target: '开玄府、发汗散寒、平喘', topicId: 'ch01_1' },
      { name: '桂枝汤', target: '调和营卫、解肌发汗', topicId: 'ch01_1' },
      { name: '葛根汤', target: '升津舒项背、解肌发表', topicId: 'ch01_2' }
    ],
    transmissionRoutes: [
      { name: '顺传阳明 (化热入里)', desc: '表郁化热过载体温中枢，伤津脱水导致肠道燥结，转为阳明经证/腑实。', targetMeridian: 'yangming' },
      { name: '随经入腑 (太阳蓄水)', desc: '邪随太阳经脉深入膀胱，AQP水通道蛋白阻滞，小便不利，水饮内停。', targetMeridian: 'taiyang' },
      { name: '直中少阴 (太少两感)', desc: '素体阳虚心泵无力，风寒直接穿透表屏障深侵少阴线粒体。', targetMeridian: 'shaoyin' }
    ],
    overlayNodes: [
      { x: 50, y: 18, label: '头项强痛 (Rich血管痉挛点)', type: 'pathogen' },
      { x: 35, y: 28, label: '体表玄府微孔闭塞', type: 'pathogen' },
      { x: 50, y: 35, label: '肺主皮毛 (气体交换受阻)', type: 'qi' },
      { x: 65, y: 45, label: '足太阳膀胱经输穴', type: 'herb' }
    ]
  },
  yangming: {
    id: 'yangming',
    name: '阳明病 · 肠胃高热燥结区',
    title: '阳明经 (足阳明胃经 / 手阳明大肠经) · 消化道热盛与津液枯竭',
    image: '/src/assets/images/yangming_anatomy_ink_1785941214679.jpg',
    colorHex: '#f59e0b',
    badgeBg: 'bg-amber-500',
    pathwayTitle: '邪入阳明 → 肠道高热 → 腑实燥结传变路线',
    pathwayDescription: '太阳病未解或汗多伤津，斜传阳明。胃肠极热，体温中枢调控失灵，呈现大汗出、大烦渴、脉洪大（经证）；若热与实培结于肠道，致肠麻痹与毒素吸收，呈日晡潮热、手足濈然汗出、腹满痛（腑实）。',
    organFocus: '胃黏膜网、大肠小肠壁、体温调节中枢、肠道自律神经 plexus',
    keyFormulas: [
      { name: '白虎汤', target: '清胃热、生津止渴（无形之热）', topicId: 'ch02_1' },
      { name: '大承气汤', target: '峻下热结、荡涤肠道实热（有形之结）', topicId: 'ch02_2' },
      { name: '调胃承气汤', target: '缓下热结、泻热和胃', topicId: 'ch02_2' }
    ],
    transmissionRoutes: [
      { name: '阳明腑实 → 伤津脱水', desc: '肠道燥屎阻滞，高热灼伤阴津，可能诱发血容量不足与神昏讝语。', targetMeridian: 'yangming' },
      { name: '热极生风 (传厥阴)', desc: '阳明高热灼伤肝经阴血，引发虚风内动或惊厥。', targetMeridian: 'jueyin' }
    ],
    overlayNodes: [
      { x: 50, y: 42, label: '胃脘无形高热 (白虎汤靶点)', type: 'herb' },
      { x: 52, y: 58, label: '肠道燥结/实热 (大承气汤靶点)', type: 'pathogen' },
      { x: 45, y: 32, label: '下丘脑体温调控中枢过载', type: 'qi' }
    ]
  },
  shaoyang: {
    id: 'shaoyang',
    name: '少阳病 · 膜原枢机不利区',
    title: '少阳经 (足少阳胆经 / 手少阳三焦经) · 胸胁膜原与自律神经枢机',
    image: '/src/assets/images/shaoyang_anatomy_ink_1785941227188.jpg',
    colorHex: '#0284c7',
    badgeBg: 'bg-sky-500',
    pathwayTitle: '半表半里 → 枢机不利 → 柴胡证开合失常路线',
    pathwayDescription: '邪在半表半里，胆腑枢机失常。三焦水道通调受阻，出现口苦、咽干、目眩、往来寒热、胸胁苦满、嘿嘿不欲饮食、心烦喜呕。',
    organFocus: '胸胁腹膜、网膜膜原、淋巴三焦通道、胆囊及植物神经系统',
    keyFormulas: [
      { name: '小柴胡汤', target: '和解少阳、运转枢机、疏利三焦', topicId: 'ch03_1' },
      { name: '大柴胡汤', target: '和解少阳兼泻阳明内实', topicId: 'ch03_1' }
    ],
    transmissionRoutes: [
      { name: '少阳木郁 → 克太阴脾土', desc: '枢机不通导致胆胃不和、脾胃运化停滞，转化为太阴虚寒。', targetMeridian: 'taiyin' },
      { name: '少阳兼阳明', desc: '少阳表邪未解，阳明胃热已结，用大柴胡汤两解。', targetMeridian: 'yangming' }
    ],
    overlayNodes: [
      { x: 40, y: 38, label: '胸胁苦满 (网膜膜原微循环阻滞)', type: 'pathogen' },
      { x: 60, y: 40, label: '胆腑枢机 / 植物神经调控点', type: 'qi' },
      { x: 50, y: 48, label: '柴胡+黄芩 (和解枢机药对靶点)', type: 'herb' }
    ]
  },
  taiyin: {
    id: 'taiyin',
    name: '太阴病 · 脾胃虚寒吐泻区',
    title: '太阴经 (足太阴脾经 / 手太阴肺经) · 消化吸收与水湿运化失调',
    image: '/src/assets/images/taiyin_anatomy_ink_1785941238751.jpg',
    colorHex: '#10b981',
    badgeBg: 'bg-emerald-500',
    pathwayTitle: '太阴湿化 → 脾阳虚损 → 水饮内停吐利路线',
    pathwayDescription: '素体脾胃虚弱，或误用苦寒下剂，伤及中阳。表现为腹满而吐、食不下、自利益甚、时腹自痛。水湿不化，能量生成（ATP）不足。',
    organFocus: '脾脏、胰腺、小肠微绒毛吸收网、组织间质水湿积聚',
    keyFormulas: [
      { name: '理中丸', target: '温中健脾、祛寒补气', topicId: 'ch04_1' },
      { name: '桂枝人参汤', target: '解表温中、理中兼发表', topicId: 'ch04_1' }
    ],
    transmissionRoutes: [
      { name: '太阴湿化衰退 → 深陷少阴', desc: '脾阳极虚不能输布，损伤心肾阳气，转为少阴病虚寒危证。', targetMeridian: 'shaoyin' }
    ],
    overlayNodes: [
      { x: 48, y: 52, label: '中焦脾阳衰退 (ATP能量生成障碍)', type: 'pathogen' },
      { x: 52, y: 58, label: '肠道绒毛水肿 (自利益甚点)', type: 'qi' },
      { x: 45, y: 46, label: '干姜+白术 (温中燥湿靶点)', type: 'herb' }
    ]
  },
  shaoyin: {
    id: 'shaoyin',
    name: '少阴病 · 心肾阳衰微衰危证区',
    title: '少阴经 (足少阴肾经 / 手少阴心经) · 全身微循环休克与心肾泵动力崩溃',
    image: '/src/assets/images/shaoyin_anatomy_ink_1785941252099.jpg',
    colorHex: '#9333ea',
    badgeBg: 'bg-purple-600',
    pathwayTitle: '心肾阳衰 → 脉微细但欲寐 → 厥逆亡阳路线',
    pathwayDescription: '病深少阴，心肾二脏阳气极度虚衰。表现为脉微细、但欲寐、四肢厥冷、下利清谷。此为全身细胞线粒体功能休克与有效循环血量骤降之急危重症。',
    organFocus: '心肌泵、肾小球滤过网、全身微血管张力、线粒体氧化磷酸化',
    keyFormulas: [
      { name: '四逆汤', target: '回阳救逆、复脉救休克', topicId: 'ch05_1' },
      { name: '真武汤', target: '温阳利水、扶肾阳镇水饮', topicId: 'ch05_2' },
      { name: '麻黄细辛附子汤', target: '助阳解表、太少双解', topicId: 'ch05_1' }
    ],
    transmissionRoutes: [
      { name: '少阴阳衰 → 厥阴阴阳离决', desc: '少阴阳气彻底衰竭，导致厥逆不复，出现阴阳离决危候。', targetMeridian: 'jueyin' }
    ],
    overlayNodes: [
      { x: 50, y: 36, label: '心肌泵动力衰竭 (四逆汤复脉点)', type: 'pathogen' },
      { x: 50, y: 62, label: '肾阳虚衰 / 肾小球滤过失常', type: 'qi' },
      { x: 45, y: 50, label: '附子+干姜 (强心救逆靶点)', type: 'herb' }
    ]
  },
  jueyin: {
    id: 'jueyin',
    name: '厥阴病 · 寒热错杂厥热胜复区',
    title: '厥阴经 (足厥阴肝经 / 手厥阴心包经) · 阴阳交尽与深层精路气血错杂',
    image: '/src/assets/images/jueyin_anatomy_ink_1785941263527.jpg',
    colorHex: '#be123c',
    badgeBg: 'bg-rose-700',
    pathwayTitle: '阴阳相争 → 寒热错杂 → 厥热胜复演化路线',
    pathwayDescription: '厥阴为六经最后关卡，阴阳交尽，极易出现寒热错杂、厥热胜复。表现为消渴、气上撞心、心中疼热、饥而不欲食、食则吐蛔、下之利不止。',
    organFocus: '肝脏血海、心包网膜、下丘脑自主神经极端波动、深层微循环',
    keyFormulas: [
      { name: '乌梅丸', target: '温脏安蛔、寒热并治、安舒厥阴', topicId: 'ch06_1' },
      { name: '当归四逆汤', target: '温经散寒、养血通脉', topicId: 'ch06_1' }
    ],
    transmissionRoutes: [
      { name: '厥少阳回 → 疾病痊愈', desc: '若正气渐复，阳气胜于阴邪，则厥退热还，趋向康复。', targetMeridian: 'taiyang' },
      { name: '厥多热少 → 阴亡阳绝', desc: '若阴寒持续偏盛，四肢厥逆不回，则预后凶险。', targetMeridian: 'shaoyin' }
    ],
    overlayNodes: [
      { x: 48, y: 44, label: '心中疼热 / 寒热错杂核心区', type: 'pathogen' },
      { x: 52, y: 52, label: '肝脏藏血与微循环障碍', type: 'qi' },
      { x: 50, y: 48, label: '乌梅+细辛+干姜+黄连 (寒热并用靶点)', type: 'herb' }
    ]
  }
};

interface InnerMechanismTransmissionGraphProps {
  onSelectTopic: (topicId: string) => void;
}

export default function InnerMechanismTransmissionGraph({
  onSelectTopic
}: InnerMechanismTransmissionGraphProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('m_taiyang_biaoyu');
  const [meridianFilter, setMeridianFilter] = useState<string>('all');
  const [systemFilter, setSystemFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive mode: 'meridian-3d' (人体三维经络透视) | 'graph' (2D拖拽全景图) | '3d' (3D全息空间拓扑) | 'simulation' (传变演练) | 'stacked-formula' (层叠经方加减与药效权重)
  const [viewTab, setViewTab] = useState<'meridian-3d' | 'graph' | '3d' | 'simulation' | 'stacked-formula'>('meridian-3d');

  // 3D Meridian Perspective state
  const [selectedMeridian3D, setSelectedMeridian3D] = useState<'taiyang' | 'yangming' | 'shaoyang' | 'taiyin' | 'shaoyin' | 'jueyin'>('taiyang');
  const [showQiStream, setShowQiStream] = useState<boolean>(true);
  const [showPathogenOverlay, setShowPathogenOverlay] = useState<boolean>(true);
  const [showHerbTargets, setShowHerbTargets] = useState<boolean>(true);

  // Custom dragged node positions
  const [customPositions, setCustomPositions] = useState<{ [id: string]: { x: number; y: number } }>({});
  const draggingNodeIdRef = useRef<string | null>(null);

  // Canvas Zoom & Pan State
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingPan, setIsDraggingPan] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Get current node coordinate considering custom drag overrides
  const getNodePos = (node: InnerMechanismNode) => {
    if (customPositions[node.id]) return customPositions[node.id];
    return { x: node.x, y: node.y };
  };

  // Transmission Simulation Sequence Step State
  const [simulationStep, setSimulationStep] = useState<number>(0);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Transmission preset simulation routes
  const SIMULATION_ROUTES = [
    {
      id: 'route_1',
      title: '路线一：太阳表郁 → 阳明经证 → 阳明腑实（顺传阳明化热）',
      description: '寒邪袭表未散，郁极发热入里过载体温中枢，持续大汗脱水致肠道燥结屏障崩溃。',
      sequence: ['m_taiyang_biaoyu', 'm_yangming_gaore', 'm_yangming_fushi']
    },
    {
      id: 'route_2',
      title: '路线二：太阳表郁 → 太阳蓄水 / 蓄血（随经入腑）',
      description: '表邪随太阳经脉入腑，或致肾与膀胱AQP水通道气化障碍，或与下焦血相搏致盆腔高凝。',
      sequence: ['m_taiyang_biaoyu', 'm_taiyang_xushui', 'm_taiyang_xuxue']
    },
    {
      id: 'route_3',
      title: '路线三：太阳未解 → 少阳枢机不利 → 太阴脾虚 → 少阴心肾衰竭 → 厥阴风火',
      description: '伤寒典型传变全过程：从表郁至少阳自律神经失调，传入太阴ATP耗竭，直深少阴线粒体崩溃，终至厥阴阴阳离决。',
      sequence: ['m_taiyang_biaoyu', 'm_shaoyang_shuji', 'm_taiyin_pixu', 'm_shaoyin_yangxu', 'm_jueyin_juereshengfu']
    }
  ];

  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(0);
  const currentRoute = SIMULATION_ROUTES[activeRouteIndex];

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return INNER_MECHANISM_NODES.filter((node) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = node.name.toLowerCase().includes(q);
        const matchTag = node.systemTag.toLowerCase().includes(q);
        const matchFormula = node.countermeasure.formulaName.toLowerCase().includes(q);
        const matchPath = node.innerMechanism.pathology.toLowerCase().includes(q);
        if (!matchName && !matchTag && !matchFormula && !matchPath) return false;
      }

      if (meridianFilter !== 'all' && node.meridian !== meridianFilter) {
        return false;
      }

      if (systemFilter !== 'all' && node.systemTag !== systemFilter) {
        return false;
      }

      return true;
    });
  }, [meridianFilter, systemFilter, searchQuery]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  // Filtered links
  const filteredLinks = useMemo(() => {
    return INNER_MECHANISM_LINKS.filter(
      (link) => filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
    );
  }, [filteredNodeIds]);

  // Selected Node Data
  const selectedNode = useMemo(() => {
    return INNER_MECHANISM_NODES.find((n) => n.id === selectedNodeId) || INNER_MECHANISM_NODES[0];
  }, [selectedNodeId]);

  // Links connected to selected node
  const connectedLinks = useMemo(() => {
    return INNER_MECHANISM_LINKS.filter(
      (l) => l.source === selectedNodeId || l.target === selectedNodeId
    );
  }, [selectedNodeId]);

  // Neighbor nodes
  const neighborNodes = useMemo(() => {
    const ids = new Set<string>();
    connectedLinks.forEach((l) => {
      if (l.source === selectedNodeId) ids.add(l.target);
      if (l.target === selectedNodeId) ids.add(l.source);
    });
    return INNER_MECHANISM_NODES.filter((n) => ids.has(n.id));
  }, [selectedNodeId, connectedLinks]);

  // Pan & Node Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDraggingPan(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    draggingNodeIdRef.current = nodeId;
    setSelectedNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeIdRef.current) {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left - pan.x;
      const rawY = e.clientY - rect.top - pan.y;

      const scaleX = 720 / (rect.width * zoom);
      const scaleY = 660 / (rect.height * zoom);

      const svgX = Math.min(Math.max(Math.round(rawX * scaleX), 20), 700);
      const svgY = Math.min(Math.max(Math.round(rawY * scaleY), 20), 640);

      setCustomPositions((prev) => ({
        ...prev,
        [draggingNodeIdRef.current!]: { x: svgX, y: svgY }
      }));
      return;
    }

    if (isDraggingPan) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    draggingNodeIdRef.current = null;
    setIsDraggingPan(false);
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleResetPositions = () => {
    setCustomPositions({});
  };

  // Color helper for meridians
  const getMeridianColor = (meridian: string) => {
    switch (meridian) {
      case 'taiyang':
        return { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500', hex: '#ef4444' };
      case 'yangming':
        return { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', hex: '#f59e0b' };
      case 'shaoyang':
        return { bg: 'bg-sky-500', text: 'text-sky-500', border: 'border-sky-500', hex: '#0284c7' };
      case 'taiyin':
        return { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', hex: '#10b981' };
      case 'shaoyin':
        return { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600', hex: '#9333ea' };
      case 'jueyin':
        return { bg: 'bg-rose-700', text: 'text-rose-700', border: 'border-rose-700', hex: '#be123c' };
      default:
        return { bg: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-600', hex: '#b45309' };
    }
  };

  return (
    <div className="space-y-6">
      {/* TITLE BANNER */}
      <div className="bg-gradient-to-br from-[#1a130b] via-[#2a1d12] to-[#17130e] text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden border border-[#523d29]">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#b45309] text-white rounded-full text-xs font-extrabold font-mono tracking-wide shadow-sm">
              <Brain className="w-3.5 h-3.5" />
              <span>内景生理/病理传变 ENGINE v2.5</span>
            </div>
            <div className="text-xs text-[#fde68a] font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              物理内景微观解剖 & 经方方药靶点精准映射
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-black font-serif tracking-wide text-[#fef3c7]">
            伤寒病变机理传变图（人体内景与方药应对全景图谱）
          </h2>
          <p className="text-xs md:text-sm text-[#d6c4a5] leading-relaxed max-w-3xl">
            本全景图谱从<strong>人体内部内景机制</strong>（如微血管网痉挛、水通道蛋白AQP失调、下丘脑体温中枢过载、肠道屏障崩溃、线粒体ATP耗竭）与<strong>方药应对措施</strong>（解肌开合、高渗利水、刺激肠神经丛、线粒体重启）双重视角，直观解析《伤寒论》六经病变传变拓扑规律。
          </p>

          {/* View Tab Buttons */}
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={() => setViewTab('meridian-3d')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewTab === 'meridian-3d'
                  ? 'bg-[#f59e0b] text-stone-950 font-black shadow-lg scale-105'
                  : 'bg-black/40 text-[#fde68a] hover:bg-black/60 border border-[#78350f]'
              }`}
            >
              <Eye className="w-4 h-4 text-rose-400" />
              人体三维经络透视
            </button>
            <button
              onClick={() => setViewTab('stacked-formula')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewTab === 'stacked-formula'
                  ? 'bg-[#f59e0b] text-stone-950 font-black shadow-lg scale-105'
                  : 'bg-black/40 text-[#fde68a] hover:bg-black/60 border border-[#78350f]'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-300" />
              层叠式经方加减与药效权重演化图
            </button>
            <button
              onClick={() => setViewTab('graph')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewTab === 'graph'
                  ? 'bg-[#f59e0b] text-stone-950 font-black shadow-lg scale-105'
                  : 'bg-black/40 text-[#fde68a] hover:bg-black/60 border border-[#78350f]'
              }`}
            >
              <Compass className="w-4 h-4" />
              2D 全景平面拓扑
            </button>
            <button
              onClick={() => setViewTab('3d')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewTab === '3d'
                  ? 'bg-[#f59e0b] text-stone-950 font-black shadow-lg scale-105'
                  : 'bg-black/40 text-[#fde68a] hover:bg-black/60 border border-[#78350f]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              3D 全息空间星系拓扑网络
            </button>
            <button
              onClick={() => setViewTab('simulation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                viewTab === 'simulation'
                  ? 'bg-[#f59e0b] text-stone-950 font-black shadow-lg scale-105'
                  : 'bg-black/40 text-[#fde68a] hover:bg-black/60 border border-[#78350f]'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              伤寒传变动态演练模式
            </button>
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute right-3 -bottom-8 text-white/5 font-serif text-9xl font-black pointer-events-none select-none">
          景
        </div>
      </div>

      {/* RENDER VIEW TAB: 人体三维经络透视 (3D HUMAN MERIDIAN PERSPECTIVE) */}
      {viewTab === 'meridian-3d' && (() => {
        const currentMeridian = MERIDIAN_3D_DATA[selectedMeridian3D];

        return (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 md:p-7 space-y-6 shadow-xl animate-fadeIn">
            {/* Top Bar: Meridian Selector Tabs */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Eye className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold font-serif text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      人体三维经络透视全景图
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      中式半透明水墨画图谱 · 点击六经按钮切换透视视界与病邪传变叠影
                    </p>
                  </div>
                </div>

                {/* Layer Control Switches */}
                <div className="flex flex-wrap items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 text-xs font-bold font-mono">
                  <button
                    onClick={() => setShowQiStream(!showQiStream)}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      showQiStream
                        ? 'bg-amber-500 text-stone-950 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>气血流注路径</span>
                  </button>
                  <button
                    onClick={() => setShowPathogenOverlay(!showPathogenOverlay)}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      showPathogenOverlay
                        ? 'bg-red-500 text-white shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>病邪/玄府闭塞点</span>
                  </button>
                  <button
                    onClick={() => setShowHerbTargets(!showHerbTargets)}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      showHerbTargets
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>经方药效靶点</span>
                  </button>
                </div>
              </div>

              {/* 6 Meridian Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
                {(Object.keys(MERIDIAN_3D_DATA) as (keyof typeof MERIDIAN_3D_DATA)[]).map((mKey) => {
                  const item = MERIDIAN_3D_DATA[mKey];
                  const isSelected = selectedMeridian3D === mKey;

                  return (
                    <button
                      key={mKey}
                      onClick={() => setSelectedMeridian3D(mKey)}
                      className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 border-amber-500 text-white shadow-lg scale-102 ring-2 ring-amber-500/50'
                          : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.badgeBg}`}></span>
                        <span className="text-[10px] font-mono opacity-60 uppercase">{mKey}</span>
                      </div>
                      <div className="font-bold font-serif text-xs mt-2">
                        {item.name.split('·')[0]}
                      </div>
                      <div className="text-[10px] opacity-75 font-mono line-clamp-1 mt-0.5">
                        {item.name.split('·')[1]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Anatomy Display Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Side: Ink Wash Translucent Anatomy Canvas (7 Cols) */}
              <div className="lg:col-span-7 bg-[#12100e] rounded-3xl border border-amber-900/60 overflow-hidden relative shadow-2xl group min-h-[520px] flex flex-col justify-between select-none">
                
                {/* Canvas Overlay Tag */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black text-white font-mono shadow-md ${currentMeridian.badgeBg}`}>
                    {currentMeridian.name}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-black/70 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                    中式半透明水墨内景
                  </span>
                </div>

                {/* Main Translucent Image with SVG Flow Overlay */}
                <div className="relative w-full h-[480px] sm:h-[540px] overflow-hidden flex items-center justify-center bg-black/40">
                  <img
                    src={currentMeridian.image}
                    alt={currentMeridian.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12100e] via-transparent to-black/30"></div>

                  {/* SVG OVERLAY LAYERS */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Glowing Animated Qi-Blood Flow Paths */}
                    {showQiStream && (
                      <g className="animate-pulse opacity-80">
                        <path
                          d="M 50 15 Q 52 35 50 50 T 50 85"
                          fill="none"
                          stroke={currentMeridian.colorHex}
                          strokeWidth="1.2"
                          strokeDasharray="2 2"
                        />
                        <path
                          d="M 35 30 Q 50 45 65 30"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="0.8"
                          strokeDasharray="1.5 1.5"
                        />
                      </g>
                    )}

                    {/* Nodes Hotspots */}
                    {currentMeridian.overlayNodes.map((node, idx) => {
                      if (node.type === 'pathogen' && !showPathogenOverlay) return null;
                      if (node.type === 'herb' && !showHerbTargets) return null;
                      if (node.type === 'qi' && !showQiStream) return null;

                      let color = '#f59e0b';
                      if (node.type === 'pathogen') color = '#ef4444';
                      if (node.type === 'herb') color = '#10b981';

                      return (
                        <g key={idx}>
                          {/* Pulsing ring */}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="3"
                            fill="none"
                            stroke={color}
                            strokeWidth="0.5"
                            className="animate-ping"
                          />
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="1.5"
                            fill={color}
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* HTML Overlay Badges over Canvas */}
                  {currentMeridian.overlayNodes.map((node, idx) => {
                    if (node.type === 'pathogen' && !showPathogenOverlay) return null;
                    if (node.type === 'herb' && !showHerbTargets) return null;
                    if (node.type === 'qi' && !showQiStream) return null;

                    let badgeStyle = 'bg-amber-950/90 text-amber-200 border-amber-500/60';
                    if (node.type === 'pathogen') badgeStyle = 'bg-red-950/90 text-red-200 border-red-500/60';
                    if (node.type === 'herb') badgeStyle = 'bg-emerald-950/90 text-emerald-200 border-emerald-500/60';

                    return (
                      <div
                        key={`label_${idx}`}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl border text-[11px] font-bold font-serif shadow-lg backdrop-blur-md pointer-events-auto transition-all hover:scale-110 ${badgeStyle}`}
                      >
                        {node.label}
                      </div>
                    );
                  })}
                </div>

                {/* Canvas Footer Legend */}
                <div className="p-4 bg-zinc-950/90 border-t border-amber-900/40 text-xs text-zinc-300 font-mono flex flex-wrap items-center justify-between gap-2 z-20">
                  <span className="text-amber-400 font-bold">【器官分布 Focus】:</span>
                  <span className="text-zinc-300 font-serif">{currentMeridian.organFocus}</span>
                </div>
              </div>

              {/* Right Side: Pathological Mechanism & Transmission Vector Panel (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                {/* Title & Pathological Description */}
                <div className="bg-[#fffdfa] dark:bg-[#1a1714] border border-[#ebdcc8] dark:border-[#3a3229] rounded-3xl p-5 space-y-3 shadow-md">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-700 dark:text-amber-400 font-bold">
                    <Activity className="w-4 h-4" />
                    <span>{currentMeridian.pathwayTitle}</span>
                  </div>
                  <h4 className="text-base font-bold font-serif text-zinc-900 dark:text-zinc-100">
                    {currentMeridian.title}
                  </h4>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-serif pt-1">
                    {currentMeridian.pathwayDescription}
                  </p>
                </div>

                {/* Key Recommended Formulas */}
                <div className="bg-[#f0fdf4] dark:bg-[#0d2818] border border-[#bbf7d0] dark:border-[#14532d] rounded-3xl p-5 space-y-3 shadow-md">
                  <div className="flex items-center justify-between pb-2 border-b border-[#bbf7d0] dark:border-[#14532d]">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-serif flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      对应经方救逆靶向 (Formulas)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                      点击即可调取临床课案
                    </span>
                  </div>

                  <div className="space-y-2">
                    {currentMeridian.keyFormulas.map((f, fIdx) => (
                      <div
                        key={fIdx}
                        onClick={() => f.topicId && onSelectTopic(f.topicId)}
                        className="p-3 rounded-2xl bg-white dark:bg-zinc-900/90 border border-emerald-200/80 dark:border-emerald-800/80 hover:border-emerald-500 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                      >
                        <div>
                          <span className="font-bold text-emerald-800 dark:text-emerald-200 font-serif text-xs block group-hover:text-emerald-600">
                            {f.name}
                          </span>
                          <span className="text-[11px] text-zinc-600 dark:text-zinc-400">
                            {f.target}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transmission Vectors (传变衍生路径) */}
                <div className="bg-zinc-900 text-white rounded-3xl p-5 space-y-3 shadow-xl border border-zinc-800">
                  <span className="text-xs font-bold text-amber-400 font-serif flex items-center gap-1.5">
                    <ArrowRight className="w-4 h-4" />
                    六经传变衍生矢量 (Transmission Vectors)
                  </span>

                  <div className="space-y-2">
                    {currentMeridian.transmissionRoutes.map((route, rIdx) => (
                      <div
                        key={rIdx}
                        onClick={() => setSelectedMeridian3D(route.targetMeridian as any)}
                        className="p-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-amber-500 cursor-pointer transition-all space-y-1 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300 font-serif group-hover:text-amber-200">
                            【{route.name}】
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                            切换至 {MERIDIAN_3D_DATA[route.targetMeridian as keyof typeof MERIDIAN_3D_DATA]?.name.split('·')[0]}
                            <ChevronRight className="w-3 h-3 text-amber-400 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-tight">
                          {route.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* RENDER VIEW TAB 0: STACKED FORMULA EVOLUTION PATHWAY GRAPH */}
      {viewTab === 'stacked-formula' && (
        <StackedFormulaPathwayGraph onSelectTopic={onSelectTopic} />
      )}

      {/* RENDER VIEW TAB 2: 3D HOLOGRAPHIC MODE */}
      {viewTab === '3d' && (
        <Holographic3DGraph onSelectTopic={onSelectTopic} initialDataType="inner-mechanism" />
      )}

      {/* FILTER & CONTROL BAR (2D Graph View) */}
      {viewTab === 'graph' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 md:p-5 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Meridian Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-mono">
                <Filter className="w-3.5 h-3.5" /> 六经归经:
              </span>
              {[
                { id: 'all', name: '全部六经' },
                { id: 'taiyang', name: '太阳病' },
                { id: 'yangming', name: '阳明病' },
                { id: 'shaoyang', name: '少阳病' },
                { id: 'taiyin', name: '太阴病' },
                { id: 'shaoyin', name: '少阴病' },
                { id: 'jueyin', name: '厥阴病' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMeridianFilter(item.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    meridianFilter === item.id
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索内景机制/方药/指标 (如 AQP, 四逆汤)..."
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Zoom & Position Reset Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleResetPositions}
                className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                title="重置手动拖拽的节点位置"
              >
                <Move className="w-3.5 h-3.5" />
                <span>重置节点位置</span>
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.15, 2.0))}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300"
                title="放大"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.15, 0.6))}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300"
                title="缩小"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300"
                title="重置视角"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TAB 1: GRAPH TOPOLOGY CANVAS */}
      {viewTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* MAIN GRAPH CANVAS (8 COLS) */}
          <div className="lg:col-span-7 bg-[#FAF8F2] dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-4 relative overflow-hidden shadow-inner min-h-[560px] flex flex-col justify-between select-none">
            
            {/* Canvas Overlay Header Info */}
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono z-10 px-2 pt-1">
              <span className="flex items-center gap-1 bg-white/80 dark:bg-zinc-900/80 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 backdrop-blur-xs">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                提示：鼠标左键按住节点可自由拖拽位置，防止文字重叠
              </span>
              <span>缩放: {Math.round(zoom * 100)}%</span>
            </div>

            {/* SVG Interactive Canvas */}
            <div
              className="relative w-full h-[520px] overflow-hidden cursor-grab active:cursor-grabbing rounded-2xl bg-[#fffefb] dark:bg-[#12100e] border border-[#ebdcc8]/60 dark:border-zinc-800/80 my-2"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <svg
                ref={svgRef}
                className="w-full h-full"
                viewBox="0 0 720 660"
                preserveAspectRatio="xMidYMid meet"
              >
                <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                  {/* Grid Lines for Inner Landscape Zones */}
                  <line x1="0" y1="310" x2="720" y2="310" stroke="#ebdcc8" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-zinc-800" />
                  <line x1="360" y1="0" x2="360" y2="660" stroke="#ebdcc8" strokeWidth="1" strokeDasharray="4 4" className="dark:stroke-zinc-800" />

                  <text x="15" y="25" fill="#a16207" fontSize="10" fontWeight="bold" fontFamily="serif">表证/肌腠玄府区 (太阳/阳明外表)</text>
                  <text x="520" y="25" fill="#c2410c" fontSize="10" fontWeight="bold" fontFamily="serif">阳明高热与肠道腑实区</text>
                  <text x="15" y="640" fill="#047857" fontSize="10" fontWeight="bold" fontFamily="serif">太阴脾虚/消化道能量区</text>
                  <text x="520" y="640" fill="#6b21a8" fontSize="10" fontWeight="bold" fontFamily="serif">少阴心肾/线粒体休克区</text>

                  {/* Draw Link Connection Lines */}
                  {filteredLinks.map((link, idx) => {
                    const sourceNode = INNER_MECHANISM_NODES.find((n) => n.id === link.source);
                    const targetNode = INNER_MECHANISM_NODES.find((n) => n.id === link.target);
                    if (!sourceNode || !targetNode) return null;

                    const srcPos = getNodePos(sourceNode);
                    const tgtPos = getNodePos(targetNode);

                    const isConnected =
                      selectedNodeId === link.source || selectedNodeId === link.target;

                    // Stroke styles based on link direction
                    let strokeColor = '#d6d3d1'; // default light gray
                    if (link.direction === 'forward') strokeColor = '#f59e0b';
                    if (link.direction === 'deterioration') strokeColor = '#dc2626';
                    if (link.direction === 'cross') strokeColor = '#8b5cf6';

                    return (
                      <g key={`link_${idx}`}>
                        <line
                          x1={srcPos.x}
                          y1={srcPos.y}
                          x2={tgtPos.x}
                          y2={tgtPos.y}
                          stroke={isConnected ? strokeColor : '#e7e5e4'}
                          strokeWidth={isConnected ? 3 : 1.5}
                          strokeDasharray={link.direction === 'cross' ? '5 5' : 'none'}
                          className="transition-all duration-300"
                        />
                        {/* Link Label Badge */}
                        <g transform={`translate(${(srcPos.x + tgtPos.x) / 2}, ${(srcPos.y + tgtPos.y) / 2})`}>
                          <rect
                            x="-32"
                            y="-9"
                            width="64"
                            height="18"
                            rx="4"
                            fill={isConnected ? '#1c1917' : '#f5f5f4'}
                            stroke={isConnected ? strokeColor : '#d6d3d1'}
                            strokeWidth="1"
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fill={isConnected ? '#ffffff' : '#57534e'}
                            fontSize="9"
                            fontWeight="bold"
                          >
                            {link.label}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* Draw Nodes */}
                  {filteredNodes.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    const colorStyle = getMeridianColor(node.meridian);
                    const pos = getNodePos(node);

                    return (
                      <g
                        key={node.id}
                        transform={`translate(${pos.x}, ${pos.y})`}
                        onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNodeId(node.id);
                        }}
                        className="cursor-move group"
                      >
                        {/* Selected Pulsating Halo Ring */}
                        {isSelected && (
                          <circle
                            r="36"
                            fill="none"
                            stroke={colorStyle.hex}
                            strokeWidth="2.5"
                            className="animate-ping opacity-40"
                          />
                        )}

                        {/* Outer Circle Node */}
                        <circle
                          r={isSelected ? '28' : '22'}
                          fill={isSelected ? colorStyle.hex : '#ffffff'}
                          stroke={colorStyle.hex}
                          strokeWidth={isSelected ? '3' : '2'}
                          className="transition-all duration-300 shadow-md group-hover:scale-110"
                        />

                        {/* Inner Symbol / Icon Text */}
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fill={isSelected ? '#ffffff' : colorStyle.hex}
                          fontSize="11"
                          fontWeight="black"
                          fontFamily="serif"
                        >
                          {node.meridianName.substring(0, 2)}
                        </text>

                        {/* Node Label Floating Below */}
                        <g transform="translate(0, 36)">
                          <rect
                            x="-65"
                            y="-10"
                            width="130"
                            height="22"
                            rx="6"
                            fill={isSelected ? '#1c1917' : '#ffffff'}
                            stroke={isSelected ? colorStyle.hex : '#e7e5e4'}
                            strokeWidth="1"
                            className="shadow-xs"
                          />
                          <text
                            x="0"
                            y="4"
                            textAnchor="middle"
                            fill={isSelected ? '#fde68a' : '#1c1917'}
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                          >
                            {node.name.length > 10 ? node.name.substring(0, 9) + '…' : node.name}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Bottom Legend */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 font-mono pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> 太阳病</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 阳明病</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> 少阳病</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 太阴病</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> 少阴病</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-700"></span> 厥阴病</span>
              </div>
              <span>点击节点查看内景与方药解惑</span>
            </div>
          </div>

          {/* RIGHT DETAILED INSPECTOR DRAWER (5 COLS) */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-5 md:p-6 space-y-5 shadow-lg">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-white font-mono ${getMeridianColor(selectedNode.meridian).bg}`}>
                  {selectedNode.meridianName}
                </span>
                <span className="text-xs font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  {selectedNode.systemTag}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">ID: {selectedNode.id}</span>
            </div>

            {/* Node Title & Description */}
            <div>
              <h3 className="text-lg font-bold font-serif text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Brain className="w-5 h-5 text-amber-600" />
                {selectedNode.name}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed font-medium">
                {selectedNode.shortDesc}
              </p>
            </div>

            {/* BLOCK 1: 内景微观病理机制 (Modern Microscopic Pathology) */}
            <div className="bg-[#fffdfa] dark:bg-[#1a1815] border-l-4 border-amber-600 rounded-r-xl rounded-l-xs p-4 space-y-2 border border-[#fef08a]/60 dark:border-[#78350f]/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] font-bold font-mono flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  人体内景生理/病理解剖
                </span>
                <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 font-semibold">微观机制</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-serif pt-1">
                {selectedNode.innerMechanism.pathology}
              </p>

              {/* Biomarkers */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-1">
                  关键生理指标与生物标记物:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.innerMechanism.biomarkers.map((bm, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-2 py-0.5 rounded bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-[10px] font-mono font-bold border border-amber-200 dark:border-amber-800"
                    >
                      {bm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Physics Concept */}
              <div className="text-[11px] font-mono text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/40 p-2 rounded border border-amber-200/60 dark:border-amber-900/40 mt-1">
                ⚡ <strong>物理中医视界:</strong> {selectedNode.innerMechanism.physicalConcept}
              </div>
            </div>

            {/* BLOCK 2: 经方应对措施 (Formula Countermeasures) */}
            <div className="bg-[#f0fdf4] dark:bg-[#0d2818] border-l-4 border-emerald-600 rounded-r-xl rounded-l-xs p-4 space-y-2.5 border border-[#bbf7d0]/60 dark:border-[#14532d]/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  经方应对措施与药理靶点
                </span>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-serif">
                  {selectedNode.countermeasure.formulaName}
                </span>
              </div>

              <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
                {selectedNode.countermeasure.actionMechanism}
              </p>

              {/* Key Herb Pairs */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  核心药对机制:
                </span>
                {selectedNode.countermeasure.keyHerbPairs.map((pair, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-2 rounded bg-white dark:bg-zinc-950/60 border border-emerald-200/80 dark:border-emerald-900/60 text-xs space-y-0.5"
                  >
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 font-serif text-[11px] block">
                      【{pair.pair}】
                    </span>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-tight">
                      {pair.function}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCK 3: Connected Transmission Pathways */}
            <div className="space-y-2 pt-1 border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 font-serif flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                关联传变衍生节点 ({neighborNodes.length} 个)
              </span>
              <div className="flex flex-wrap gap-2">
                {neighborNodes.map((nbr) => (
                  <button
                    key={nbr.id}
                    onClick={() => setSelectedNodeId(nbr.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5"
                  >
                    <span className={`w-2 h-2 rounded-full ${getMeridianColor(nbr.meridian).bg}`}></span>
                    <span>{nbr.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Jump to Topic Lesson Button */}
            {selectedNode.countermeasure.topicId && (
              <button
                onClick={() => onSelectTopic(selectedNode.countermeasure.topicId!)}
                className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>进入相关理论关卡学习（{selectedNode.countermeasure.formulaName}）</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIEW TAB 2: TRANSMISSION DYNAMIC SIMULATION (伤寒传变动态演练模式) */}
      {viewTab === 'simulation' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          {/* Simulation Preset Route Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-serif flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              选择伤寒传变推演路线 (Transmission Route Presets)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SIMULATION_ROUTES.map((route, rIdx) => (
                <button
                  key={route.id}
                  onClick={() => {
                    setActiveRouteIndex(rIdx);
                    setSimulationStep(0);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    activeRouteIndex === rIdx
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 dark:border-amber-600 shadow-sm'
                      : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-300 font-serif">
                    {route.title}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {route.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="bg-zinc-900 text-white rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-mono text-xs font-bold">
                步骤 {simulationStep + 1} / {currentRoute.sequence.length}
              </span>
              <span className="text-xs text-zinc-300 font-serif">
                当前内景传变节点: {INNER_MECHANISM_NODES.find((n) => n.id === currentRoute.sequence[simulationStep])?.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={simulationStep === 0}
                onClick={() => setSimulationStep((s) => Math.max(0, s - 1))}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-xs font-bold text-zinc-200 transition-all"
              >
                上一步
              </button>
              <button
                disabled={simulationStep === currentRoute.sequence.length - 1}
                onClick={() => setSimulationStep((s) => Math.min(currentRoute.sequence.length - 1, s + 1))}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-30 text-xs font-bold text-stone-950 shadow-md transition-all flex items-center gap-1"
              >
                下一步推演 <FastForward className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSimulationStep(0)}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
                title="重新推演"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detailed Display of Current Sequence Node */}
          {(() => {
            const stepNodeId = currentRoute.sequence[simulationStep];
            const node = INNER_MECHANISM_NODES.find((n) => n.id === stepNodeId);
            if (!node) return null;

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 animate-fadeIn">
                {/* Left Card: Internal Pathology */}
                <div className="bg-[#fffdfa] dark:bg-[#181512] border border-[#ebdcc8] dark:border-[#38322c] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#ebdcc8] dark:border-[#38322c]">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#b45309] text-white font-mono">
                      {node.meridianName} · {node.systemTag}
                    </span>
                    <span className="text-xs font-mono text-[#a16207]">病理状态</span>
                  </div>

                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-serif">
                    {node.name}
                  </h4>

                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-serif">
                    {node.innerMechanism.pathology}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                      受累器官与指标变化:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {node.innerMechanism.biomarkers.map((bm, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-[10px] font-mono">
                          {bm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Card: Prescription Countermeasure */}
                <div className="bg-[#f0fdf4] dark:bg-[#0c2415] border border-[#bbf7d0] dark:border-[#14532d] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#bbf7d0] dark:border-[#14532d]">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-600 text-white font-mono">
                      经方救逆应对
                    </span>
                    <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 font-serif">
                      {node.countermeasure.formulaName}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    {node.countermeasure.actionMechanism}
                  </p>

                  <div className="p-3 bg-white/80 dark:bg-black/40 rounded-xl border border-emerald-200 dark:border-emerald-900 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 font-mono block">
                      配伍组成: {node.countermeasure.composition.join('、')}
                    </span>
                    <div className="text-[10px] text-zinc-600 dark:text-zinc-400">
                      主要药对: {node.countermeasure.keyHerbPairs.map((k) => k.pair).join('；')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
