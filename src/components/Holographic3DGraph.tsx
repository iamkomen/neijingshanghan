/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  INNER_MECHANISM_NODES,
  INNER_MECHANISM_LINKS,
  InnerMechanismNode
} from '../data/innerMechanismData';
import {
  FORMULA_NODES,
  FORMULA_LINKS,
  NetworkNode
} from '../data/formulaNetworkData';
import {
  Sparkles,
  Zap,
  Play,
  Pause,
  Compass,
  Network,
  BookOpen,
  Brain,
  Layers,
  Search,
  Sliders,
  Shield,
  ArrowRight,
  ChevronRight,
  Filter,
  Info,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export type ViewMode = 'full-spatial' | 'transmission' | 'formula-evolution' | 'herb-pairs';

export interface ExtendedNode3D {
  id: string;
  name: string;
  subText: string;
  nodeType: 'meridian_transmission' | 'formula_base' | 'formula_variation' | 'herb_pair' | 'herb_item';
  x: number;
  y: number;
  z: number;
  color: number;
  topicId?: string;
  category: string;
  deltaSummary?: string; // e.g. "+ 葛根", "+ 生附子", "+ 厚朴 + 杏仁", "- 芍药"
  transmissionPath?: string; // e.g. "太阳表病 -> 少阳枢机"
  innerMechanismDetail: string;
  herbTargetDetail: string;
  raw?: any;
}

export interface ExtendedLink3D {
  source: string;
  target: string;
  label: string;
  linkType: 'transmission' | 'variation' | 'pair_synergy';
}

// --- Extended Comprehensive Dataset for 3D Holographic Graph ---
const HERB_PAIR_NODES: ExtendedNode3D[] = [
  {
    id: 'pair_gui_shao',
    name: '桂枝 + 白芍',
    subText: '调和营卫 • 促血化气与拉动静脉',
    nodeType: 'herb_pair',
    x: -6,
    y: 5,
    z: 2,
    color: 0xf59e0b,
    category: '核心药对',
    deltaSummary: '桂枝 (向外推) + 白芍 (向内拉)',
    transmissionPath: '体表营卫循环 • 血管平滑肌张力调控',
    innerMechanismDetail: '桂枝促进动脉血流与“血化气”向外透发；白芍放松静脉平滑肌并收缩过度渗出的营血，形成“推-拉”双向流动回路。',
    herbTargetDetail: '桂枝作用于心阳与体表毛细血管；白芍作用于静脉与淋巴回收通路。'
  },
  {
    id: 'pair_ma_shi',
    name: '麻黄 + 石膏',
    subText: '表寒里热 • 高压阀与冷凝器',
    nodeType: 'herb_pair',
    x: -2,
    y: 6,
    z: -3,
    color: 0xef4444,
    category: '核心药对',
    deltaSummary: '麻黄 (开表高压阀) + 石膏 (关胃肠玄府/降生化产热)',
    transmissionPath: '太阳表实痉挛 -> 阳明胃肠生化亢进',
    innerMechanismDetail: '麻黄强制打开体表玄府（毛孔）释放高压组织液；石膏直接降低细胞内生化反应速度，关闭胃肠道过度开放的玄府，防止体液进一步蒸发耗竭。',
    herbTargetDetail: '麻黄作用于肾上腺素受体与毛孔；石膏作用于胃肠道与全身细胞生化产热。'
  },
  {
    id: 'pair_jiang_fu_gui',
    name: '姜附桂 (姜附桂组合)',
    subText: '经典温阳三药 • 开中焦/动命门/通血脉',
    nodeType: 'herb_pair',
    x: 4,
    y: -4,
    z: 4,
    color: 0xd97706,
    category: '核心药对',
    deltaSummary: '干姜/生姜 + 生附子 + 桂枝',
    transmissionPath: '太阴虚寒 -> 少阴阳衰 -> 全身精路不通',
    innerMechanismDetail: '生姜/干姜直入脾胃开中焦黏膜玄府，锁住核心温度；生附子激活细胞线粒体ATP生成（命门火）；桂枝温通血脉并促血化气。三药合用构建强力温阳救逆闭环。',
    herbTargetDetail: '干姜（中焦胃肠黏膜） + 附子（心肾线粒体） + 桂枝（全身血管微循环）。'
  },
  {
    id: 'pair_chai_huang',
    name: '柴胡 + 黄芩',
    subText: '少阳枢机 • 疏膜透热与开膜清热',
    nodeType: 'herb_pair',
    x: 3,
    y: 4,
    z: 1,
    color: 0x0284c7,
    category: '核心药对',
    deltaSummary: '柴胡 (推胸膜郁热) + 黄芩 (开胸腹膜玄府)',
    transmissionPath: '少阳半表半里 • 胸腹膜悬浮膜系',
    innerMechanismDetail: '柴胡驱动胸膜与网膜气机，将蓄积在内脏周围的郁热向外推散；黄芩开放胸腹膜系玄府通道，引导热量顺畅排出。',
    herbTargetDetail: '柴胡（胸膜/大网膜） + 黄芩（少阳膜系玄府通道）。'
  },
  {
    id: 'pair_ling_zhu',
    name: '茯苓 + 白术',
    subText: '水液分配 • 降低血气阻力与淋巴回收',
    nodeType: 'herb_pair',
    x: -5,
    y: -3,
    z: -2,
    color: 0x10b981,
    category: '核心药对',
    deltaSummary: '茯苓 (稀释气血) + 白术 (增强淋巴蠕动)',
    transmissionPath: '太阳蓄水 / 太阴水饮内停',
    innerMechanismDetail: '茯苓降低血液与组织液黏稠度，减小流动阻力；白术增强微淋巴管蠕动，把游离于组织间隙的大分子阴气与水团拉回循环系统。',
    herbTargetDetail: '茯苓（肾小球与血液流动阻力） + 白术（微淋巴管与脾胃吸收）。'
  },
  {
    id: 'pair_nit_huang',
    name: '芒硝 + 大黄',
    subText: '高渗吸水软坚 • 打散燥屎推排毒素',
    nodeType: 'herb_pair',
    x: 7,
    y: 2,
    z: -4,
    color: 0xb45309,
    category: '核心药对',
    deltaSummary: '芒硝 (高渗吸水软坚) + 大黄 (增强肠道张力蠕动)',
    transmissionPath: '阳明腑实 • 肠道燥屎结聚',
    innerMechanismDetail: '芒硝以高渗作用将血管内水分拉入肠腔打散坚硬燥屎（类似开塞露原理）；大黄增强肠道平滑肌张力与蠕动，快速将毒素排出体外。',
    herbTargetDetail: '芒硝（肠腔渗透压） + 大黄（肠道平滑肌蠕动）。'
  },
  {
    id: 'pair_wu_ban',
    name: '五味子 + 半夏',
    subText: '挤海绵与洗洁精 • 缩细胞膜与除痰浊',
    nodeType: 'herb_pair',
    x: -3,
    y: 1,
    z: 5,
    color: 0x8b5cf6,
    category: '核心药对',
    deltaSummary: '五味子 (收紧细胞膜挤水) + 半夏 (洗洁精清除黏液)',
    transmissionPath: '太阳表寒兼肺胃水饮（小青龙汤）',
    innerMechanismDetail: '五味子收紧充水膨胀的肺泡细胞膜，将细胞内积水挤出（“挤海绵”）；半夏发挥表面活性剂作用（“洗洁精”），乳化打散黏腻的痰浊水饮。',
    herbTargetDetail: '五味子（肺泡细胞膜通透性） + 半夏（胸腔与胃部痰湿水饮）。'
  },
  {
    id: 'pair_ge_gui',
    name: '葛根 + 桂枝',
    subText: '抽调深层津液 • 九泉之水调至九天之上',
    nodeType: 'herb_pair',
    x: -8,
    y: 3,
    z: -1,
    color: 0xe11d48,
    category: '核心药对',
    deltaSummary: '葛根 (起阴气抽深水) + 桂枝 (调和表部营卫)',
    transmissionPath: '太阳表邪伴项背僵硬（葛根汤）',
    innerMechanismDetail: '葛根强力升提下焦与深层脏腑的阴气水份至体表（“九泉之水调九天之上”），润泽因缺水痉挛的颈项肌肉；桂枝促使水分顺畅分布于表。',
    herbTargetDetail: '葛根（下焦深层水分升提通路） + 桂枝（体表微循环）。'
  }
];

// --- Formula Derivative Tree Nodes (药物加减/化裁) ---
const FORMULA_VARIATION_NODES: ExtendedNode3D[] = [
  {
    id: 'var_gegentang',
    name: '葛根汤',
    subText: '桂枝汤加葛根麻黄',
    nodeType: 'formula_variation',
    x: -7,
    y: 6,
    z: 1,
    color: 0xef4444,
    category: '经方加减化裁',
    deltaSummary: '桂枝汤 + 葛根 4两 + 麻黄 3两',
    transmissionPath: '太阳表郁兼项背强几几',
    innerMechanismDetail: '在桂枝汤调和营卫的基础上，加葛根将下焦津液抽调升提至颈项背部（润泽项背），加麻黄开泄表部玄府解无汗表实。',
    herbTargetDetail: '加葛根（靶向颈项背部肌肉与下焦水液升提）、加麻黄（开体表毛孔）。',
    topicId: 'T_LIUJING_1'
  },
  {
    id: 'var_guizhi_fuzi',
    name: '桂枝加附子汤',
    subText: '桂枝汤加炮附子',
    nodeType: 'formula_variation',
    x: -5,
    y: -2,
    z: 3,
    color: 0xd97706,
    category: '经方加减化裁',
    deltaSummary: '桂枝汤 + 炮附子 1枚',
    transmissionPath: '过汗伤阳 -> 体表玄府门轴毁坏汗漏不止',
    innerMechanismDetail: '因发汗过度导致体表玄府“门轴毁坏”，汗液如溃堤般漏出，脉微恶寒。加炮附子温阳固表，修复玄府开合能力，阻断脱水。',
    herbTargetDetail: '加炮附子（修复体表毛孔开合门轴，温固表阳）。',
    topicId: 'T_LIUJING_1'
  },
  {
    id: 'var_guizhi_houpo_xingzi',
    name: '桂枝加厚朴杏子汤',
    subText: '桂枝汤加厚朴杏仁',
    nodeType: 'formula_variation',
    x: -4,
    y: 3,
    z: -4,
    color: 0x10b981,
    category: '经方加减化裁',
    deltaSummary: '桂枝汤 + 厚朴 2两 + 杏仁 半升',
    transmissionPath: '表邪未解兼下焦水饮上冲挤压胸肺致喘',
    innerMechanismDetail: '下焦与大网膜积水占据空间（小猪盖被），导致肺气无法下行而喘。厚朴把下焦积水排入肠道（釜底抽薪），杏仁将肺气压下。',
    herbTargetDetail: '加厚朴（腹腔大网膜与肠道积水下行）、加杏仁（宣降肺气平喘）。',
    topicId: 'T_LIUJING_1'
  },
  {
    id: 'var_guizhi_qu_shaoyao',
    name: '桂枝去芍药汤',
    subText: '桂枝汤去除白芍',
    nodeType: 'formula_variation',
    x: -6,
    y: 0,
    z: -1,
    color: 0xf59e0b,
    category: '经方加减化裁',
    deltaSummary: '桂枝汤 - 减去白芍',
    transmissionPath: '太阳表病误下 -> 胸满阳气受阻',
    innerMechanismDetail: '因误下导致胸阳受阻心下满。减去白芍消除其对静脉血管的拉力与阴柔收敛作用，使桂枝能够专一温通胸阳、宣发气机。',
    herbTargetDetail: '去白芍（解除静脉收敛拉力，专一温通胸阳）。',
    topicId: 'T_LIUJING_1'
  },
  {
    id: 'var_xiao_qing_long',
    name: '小青龙汤',
    subText: '麻黄汤合干姜细辛半夏五味子',
    nodeType: 'formula_variation',
    x: -1,
    y: 7,
    z: 2,
    color: 0x0284c7,
    category: '经方加减化裁',
    deltaSummary: '麻黄桂枝 + 干姜 + 细辛 + 五味子 + 半夏 + 芍药',
    transmissionPath: '太阳表寒闭塞 + 肺胃停饮水气上逆',
    innerMechanismDetail: '麻桂开表；干姜细辛温阳化饮；五味子收紧细胞膜挤出水份；半夏洗洁精除痰浊；白芍回收水液至静脉。',
    herbTargetDetail: '干姜细辛（温化水饮） + 五味子半夏（挤水与除痰浊）。',
    topicId: 'T_LIUJING_2'
  },
  {
    id: 'var_da_chai_hu',
    name: '大柴胡汤',
    subText: '小柴胡去参草加枳实大黄芍药',
    nodeType: 'formula_variation',
    x: 4,
    y: 6,
    z: -2,
    color: 0xb45309,
    category: '经方加减化裁',
    deltaSummary: '小柴胡汤 - 去人参甘草 + 加枳实大黄芍药',
    transmissionPath: '少阳胸膜郁热兼阳明胃肠燥实合病',
    innerMechanismDetail: '去人参甘草防止补气壅滞；加枳实增加肠道张力；加大黄增强肠道蠕动攻下燥屎；加白芍松弛肠道平滑肌止腹痛。',
    herbTargetDetail: '去参草加大黄枳实芍药（通腹泻热、双解少阳阳明）。',
    topicId: 'T_LIUJING_3'
  },
  {
    id: 'var_chai_gui_gan_jiang',
    name: '柴胡桂枝干姜汤',
    subText: '小柴胡去参姜夏加桂枝干姜天花粉牡蛎',
    nodeType: 'formula_variation',
    x: 5,
    y: 2,
    z: 4,
    color: 0xd97706,
    category: '经方加减化裁',
    deltaSummary: '小柴胡 - 去人参生姜半夏 + 加桂枝干姜天花粉牡蛎',
    transmissionPath: '少阳胸膜郁热兼太阴脾胃虚寒合病',
    innerMechanismDetail: '柴胡黄芩清少阳胸膜郁热；干姜桂枝温太阴脾胃虚寒化停饮；天花粉生津止渴；牡蛎软坚散结。上清下温、寒热同调。',
    herbTargetDetail: '加干姜桂枝（温脾阳止泻）、加天花粉牡蛎（生津散结）。',
    topicId: 'T_LIUJING_3'
  },
  {
    id: 'var_fuzi_lichong',
    name: '附子理中丸',
    subText: '理中丸加生附子',
    nodeType: 'formula_variation',
    x: 2,
    y: -6,
    z: -2,
    color: 0x9333ea,
    category: '经方加减化裁',
    deltaSummary: '理中丸 (干姜/人参/白术/甘草) + 加生附子',
    transmissionPath: '太阴脾虚加重直中少阴心肾阳衰',
    innerMechanismDetail: '在理中丸温脾阳开胃肠玄府的基础上，加生附子激活心肾线粒体ATP生成，温补命门之火，彻底阻断脾肾阳衰。',
    herbTargetDetail: '加生附子（激活线粒体ATP，太阴少阴同补）。',
    topicId: 'T_LIUJING_4'
  }
];

const EXTENDED_LINKS: ExtendedLink3D[] = [
  // 传经通路 LINKS
  { source: 'm_taiyang_biaoyu', target: 'm_shaoyang_xuji', label: '表邪未尽入少阳', linkType: 'transmission' },
  { source: 'm_shaoyang_xuji', target: 'm_yangming_fushi', label: '少阳郁热转阳明燥实', linkType: 'transmission' },
  { source: 'm_taiyang_biaoyu', target: 'm_taiyin_pihan', label: '误下损伤脾阳入太阴', linkType: 'transmission' },
  { source: 'm_taiyin_pihan', target: 'm_shaoyin_yangshuai', label: '太阴湿寒加重直中少阴', linkType: 'transmission' },
  { source: 'm_shaoyin_yangshuai', target: 'm_jueyin_hanre', label: '少阴极衰精路阻绝入厥阴', linkType: 'transmission' },

  // 经方衍化 LINKS
  { source: 'f_guizhitang', target: 'var_gegentang', label: '加葛根麻黄 (解肌通项背)', linkType: 'variation' },
  { source: 'f_guizhitang', target: 'var_guizhi_fuzi', label: '加炮附子 (固体表玄府门轴)', linkType: 'variation' },
  { source: 'f_guizhitang', target: 'var_guizhi_houpo_xingzi', label: '加厚朴杏仁 (釜底抽薪降肺气)', linkType: 'variation' },
  { source: 'f_guizhitang', target: 'var_guizhi_qu_shaoyao', label: '去白芍 (专一温通胸阳)', linkType: 'variation' },
  { source: 'f_mahuangtang', target: 'var_xiao_qing_long', label: '合干姜细辛半夏五味子 (化肺胃饮)', linkType: 'variation' },
  { source: 'f_xiaochaihu', target: 'var_da_chai_hu', label: '去参草加枳实大黄 (少阳阳明双解)', linkType: 'variation' },
  { source: 'f_xiaochaihu', target: 'var_chai_gui_gan_jiang', label: '加桂枝干姜花粉 (少阳太阴同治)', linkType: 'variation' },
  { source: 'f_lichongwan', target: 'var_fuzi_lichong', label: '加生附子 (温脾阳兼动命门火)', linkType: 'variation' },

  // 核心药对 LINKS
  { source: 'f_guizhitang', target: 'pair_gui_shao', label: '核心推拉药对', linkType: 'pair_synergy' },
  { source: 'f_mahuangtang', target: 'pair_ma_shi', label: '开表与关玄府药对', linkType: 'pair_synergy' },
  { source: 'f_sinitang', target: 'pair_jiang_fu_gui', label: '姜附桂温阳三药', linkType: 'pair_synergy' },
  { source: 'f_xiaochaihu', target: 'pair_chai_huang', label: '少阳开膜药对', linkType: 'pair_synergy' },
  { source: 'f_wulingsan', target: 'pair_ling_zhu', label: '水液分配回收药对', linkType: 'pair_synergy' },
  { source: 'f_dachengqi', target: 'pair_nit_huang', label: '高渗打散燥屎药对', linkType: 'pair_synergy' }
];

interface Holographic3DGraphProps {
  onSelectTopic: (topicId: string) => void;
  initialDataType?: 'inner-mechanism' | 'formula-network';
  onOpenDict?: () => void;
}

export default function Holographic3DGraph({
  onSelectTopic,
  initialDataType = 'inner-mechanism',
  onOpenDict
}: Holographic3DGraphProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('full-spatial');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('m_taiyang_biaoyu');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Three.js Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameId = useRef<number | null>(null);
  const nodeMeshesRef = useRef<{ id: string; mesh: THREE.Mesh; labelSprite: THREE.Sprite }[]>([]);
  const rotationGroupRef = useRef<THREE.Group | null>(null);

  // Particles Ref
  const qiParticleSystemRef = useRef<THREE.Points | null>(null);
  const qiParticleDataRef = useRef<Array<{
    type: 'aura' | 'flow';
    center?: THREE.Vector3;
    baseRadius?: number;
    baseAngle?: number;
    offsetY?: number;
    speed: number;
    phase?: number;
    curve?: THREE.QuadraticBezierCurve3;
  }>>([]);

  // Mouse & Raycaster
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Aggregate All 3D Nodes based on viewMode
  const allGraphData = useMemo(() => {
    // Standard Nodes from Inner Mechanism
    const mecNodes: ExtendedNode3D[] = INNER_MECHANISM_NODES.map((node) => {
      const x3d = (node.x - 360) / 38;
      const y3d = -(node.y - 330) / 38;
      const z3d = Math.sin(node.x * 0.01 + node.y * 0.01) * 3;

      let color = 0xef4444; // Taiyang
      if (node.meridian === 'yangming') color = 0xf59e0b;
      if (node.meridian === 'shaoyang') color = 0x0284c7;
      if (node.meridian === 'taiyin') color = 0x10b981;
      if (node.meridian === 'shaoyin') color = 0x9333ea;
      if (node.meridian === 'jueyin') color = 0xbe123c;

      return {
        id: node.id,
        name: node.name,
        subText: node.meridianName,
        nodeType: 'meridian_transmission',
        x: x3d,
        y: y3d,
        z: z3d,
        color,
        topicId: node.countermeasure.topicId,
        category: '六经病机传变',
        transmissionPath: `${node.meridianName}病位与传变`,
        innerMechanismDetail: node.innerMechanism.pathology,
        herbTargetDetail: `救逆经方【${node.countermeasure.formulaName}】：${node.countermeasure.actionMechanism}`,
        raw: node
      };
    });

    // Formula Base Nodes
    const formulaNodes: ExtendedNode3D[] = FORMULA_NODES.map((node) => {
      const x3d = ((node.x || 400) - 425) / 38;
      const y3d = -((node.y || 340) - 340) / 38;
      const z3d = (Math.random() - 0.5) * 4;

      let color = 0xd97706;
      if (node.type === 'meridian') color = 0x4f46e5;
      if (node.type === 'herb') color = 0x059669;

      return {
        id: node.id,
        name: node.name,
        subText: node.type === 'formula' ? '基础经方' : node.type === 'herb' ? '核心药味' : '病机枢纽',
        nodeType: node.type === 'formula' ? 'formula_base' : 'meridian_transmission',
        x: x3d,
        y: y3d,
        z: z3d,
        color,
        topicId: node.topicId,
        category: '经典基础经方',
        innerMechanismDetail: node.description,
        herbTargetDetail: node.innerMechanism || '组方配伍气化机理',
        raw: node
      };
    });

    let combinedNodes: ExtendedNode3D[] = [];
    let combinedLinks: ExtendedLink3D[] = [];

    if (viewMode === 'transmission') {
      // Show Six-Meridian Transmission Pathways
      combinedNodes = mecNodes;
      combinedLinks = INNER_MECHANISM_LINKS.map(l => ({
        source: l.source,
        target: l.target,
        label: l.label,
        linkType: 'transmission'
      }));
    } else if (viewMode === 'formula-evolution') {
      // Show Base Formulas + Formula Variation Nodes
      combinedNodes = [...formulaNodes.filter(n => n.nodeType === 'formula_base'), ...FORMULA_VARIATION_NODES];
      combinedLinks = EXTENDED_LINKS.filter(l => l.linkType === 'variation');
    } else if (viewMode === 'herb-pairs') {
      // Show Herb Pairs + Base Formulas
      combinedNodes = [...HERB_PAIR_NODES, ...formulaNodes.filter(n => n.nodeType === 'formula_base')];
      combinedLinks = EXTENDED_LINKS.filter(l => l.linkType === 'pair_synergy');
    } else {
      // Full Spatial Topo View
      combinedNodes = [...mecNodes, ...FORMULA_VARIATION_NODES, ...HERB_PAIR_NODES];
      combinedLinks = [
        ...INNER_MECHANISM_LINKS.map(l => ({ source: l.source, target: l.target, label: l.label, linkType: 'transmission' as const })),
        ...EXTENDED_LINKS
      ];
    }

    // Filter by search term if typed
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      combinedNodes = combinedNodes.filter(n =>
        n.name.toLowerCase().includes(term) ||
        n.category.toLowerCase().includes(term) ||
        n.innerMechanismDetail.toLowerCase().includes(term) ||
        (n.deltaSummary && n.deltaSummary.toLowerCase().includes(term))
      );
    }

    return { nodes: combinedNodes, links: combinedLinks };
  }, [viewMode, searchTerm]);

  // Selected Node Object
  const selectedNodeData = useMemo(() => {
    return allGraphData.nodes.find((n) => n.id === selectedNodeId) || allGraphData.nodes[0] || HERB_PAIR_NODES[0];
  }, [allGraphData, selectedNodeId]);

  // Create Sprite Text Helper
  const createTextSprite = (text: string, colorHex: string = '#ffffff') => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(8, 12, 22, 0.88)';
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.roundRect(8, 8, 240, 48, 12);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 22px serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.length > 9 ? text.substring(0, 8) + '…' : text, 128, 32);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(3.4, 0.85, 1);
    return sprite;
  };

  // Initialize WebGL Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 26);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfef3c7, 1.3);
    dirLight.position.set(12, 22, 18);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x0284c7, 2.5, 60);
    pointLight.position.set(0, 0, 12);
    scene.add(pointLight);

    const rotationGroup = new THREE.Group();
    scene.add(rotationGroup);
    rotationGroupRef.current = rotationGroup;

    // Cosmos Particles
    const particleCount = 900;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 65;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 65;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 65;

      pColors[i * 3] = 0.2 + Math.random() * 0.8;
      pColors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      pColors[i * 3 + 2] = 0.95;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const starfield = new THREE.Points(particleGeo, new THREE.PointsMaterial({ size: 0.18, vertexColors: true, transparent: true, opacity: 0.65 }));
    scene.add(starfield);

    build3DGraphContent(allGraphData, rotationGroup);

    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isPlaying && rotationGroupRef.current && !isDragging.current) {
        rotationGroupRef.current.rotation.y += 0.002 * rotationSpeed;
      }

      // Pulse meshes
      nodeMeshesRef.current.forEach(({ id, mesh }) => {
        const isSelected = id === selectedNodeId;
        const pulse = 1 + Math.sin(elapsed * 4 + mesh.position.x) * 0.1;
        if (isSelected) {
          mesh.scale.set(1.45 * pulse, 1.45 * pulse, 1.45 * pulse);
        } else {
          mesh.scale.set(1, 1, 1);
        }
      });

      // Animate Qi-Blood Particle Transmission Flow
      if (qiParticleSystemRef.current && qiParticleDataRef.current.length > 0) {
        const geo = qiParticleSystemRef.current.geometry;
        const posArr = geo.attributes.position.array as Float32Array;

        qiParticleDataRef.current.forEach((p, idx) => {
          if (p.type === 'aura' && p.center) {
            const angle = (p.baseAngle || 0) + elapsed * p.speed;
            const radius = (p.baseRadius || 1.2) + Math.sin(elapsed * 4 + idx) * 0.2;
            posArr[idx * 3] = p.center.x + Math.cos(angle) * radius;
            posArr[idx * 3 + 1] = p.center.y + Math.sin(elapsed * 2.5 + idx) * 0.35 + (p.offsetY || 0);
            posArr[idx * 3 + 2] = p.center.z + Math.sin(angle) * radius;
          } else if (p.type === 'flow' && p.curve) {
            const t = ((elapsed * p.speed + (p.phase || 0)) % 1);
            const pt = p.curve.getPoint(t);
            posArr[idx * 3] = pt.x + Math.sin(elapsed * 6 + idx * 0.5) * 0.08;
            posArr[idx * 3 + 1] = pt.y + Math.cos(elapsed * 6 + idx * 0.5) * 0.08;
            posArr[idx * 3 + 2] = pt.z;
          }
        });

        geo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
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
  }, [allGraphData]);

  // Re-build 3D Meshes when data or selection changes
  useEffect(() => {
    if (rotationGroupRef.current) {
      build3DGraphContent(allGraphData, rotationGroupRef.current);
    }
  }, [allGraphData, selectedNodeId]);

  // Build 3D Mesh Content
  const build3DGraphContent = (data: typeof allGraphData, group: THREE.Group) => {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
    }

    nodeMeshesRef.current = [];
    const nodePosMap = new Map<string, THREE.Vector3>();

    data.nodes.forEach((node) => {
      const pos = new THREE.Vector3(node.x, node.y, node.z);
      nodePosMap.set(node.id, pos);

      const isSelected = node.id === selectedNodeId;

      let geom: THREE.BufferGeometry;
      if (node.nodeType === 'formula_variation') {
        // Octahedron/Diamond for Formula Modifications
        geom = new THREE.OctahedronGeometry(isSelected ? 0.95 : 0.75, 0);
      } else if (node.nodeType === 'herb_pair') {
        // Torus / Ringed shape for Herb Pairs
        geom = new THREE.TorusGeometry(isSelected ? 0.9 : 0.7, 0.22, 16, 32);
      } else {
        // Standard Sphere for Transmission Nodes
        geom = new THREE.SphereGeometry(isSelected ? 0.88 : 0.68, 32, 32);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: isSelected ? 0.95 : 0.45,
        roughness: 0.25,
        metalness: 0.35
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(pos);
      mesh.userData = { id: node.id, name: node.name };
      group.add(mesh);

      // Ring
      const ringMesh = new THREE.Mesh(
        new THREE.TorusGeometry(isSelected ? 1.35 : 0.95, 0.04, 16, 32),
        new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: isSelected ? 0.95 : 0.4 })
      );
      ringMesh.position.copy(pos);
      ringMesh.rotation.x = Math.PI / 3;
      group.add(ringMesh);

      // Sprite Label
      const sprite = createTextSprite(node.name, `#${node.color.toString(16)}`);
      sprite.position.set(pos.x, pos.y - 1.25, pos.z);
      group.add(sprite);

      nodeMeshesRef.current.push({ id: node.id, mesh, labelSprite: sprite });
    });

    // Laser Tubes
    data.links.forEach((link) => {
      const srcPos = nodePosMap.get(link.source);
      const tgtPos = nodePosMap.get(link.target);
      if (!srcPos || !tgtPos) return;

      const isSelectedLink = link.source === selectedNodeId || link.target === selectedNodeId;

      const dist = srcPos.distanceTo(tgtPos);
      const midPoint = new THREE.Vector3().addVectors(srcPos, tgtPos).multiplyScalar(0.5);
      midPoint.z += dist * 0.16;

      const curve = new THREE.QuadraticBezierCurve3(srcPos, midPoint, tgtPos);
      const tubeGeo = new THREE.TubeGeometry(curve, 22, isSelectedLink ? 0.09 : 0.035, 8, false);

      let linkColor = isSelectedLink ? 0xf59e0b : 0x38bdf8;
      if (link.linkType === 'variation') linkColor = isSelectedLink ? 0xf59e0b : 0x10b981;
      if (link.linkType === 'pair_synergy') linkColor = isSelectedLink ? 0xf59e0b : 0xd97706;

      const tubeMat = new THREE.MeshStandardMaterial({
        color: linkColor,
        emissive: linkColor,
        emissiveIntensity: isSelectedLink ? 0.85 : 0.35,
        transparent: true,
        opacity: isSelectedLink ? 0.95 : 0.45
      });

      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      group.add(tubeMesh);
    });

    // Particles Flow
    const totalQiParticles = 220;
    const qiPositions = new Float32Array(totalQiParticles * 3);
    const qiColors = new Float32Array(totalQiParticles * 3);
    const qiParticleData: typeof qiParticleDataRef.current = [];

    const selPos = selectedNodeId ? nodePosMap.get(selectedNodeId) : null;
    const connectedLinks = selectedNodeId
      ? data.links.filter((l) => l.source === selectedNodeId || l.target === selectedNodeId)
      : [];

    for (let i = 0; i < totalQiParticles; i++) {
      if (selPos && (i < 100 || connectedLinks.length === 0)) {
        const baseRadius = 0.8 + Math.random() * 1.8;
        const baseAngle = Math.random() * Math.PI * 2;
        const offsetY = (Math.random() - 0.5) * 1.8;
        const speed = 1.2 + Math.random() * 1.8;

        qiParticleData.push({ type: 'aura', center: selPos, baseRadius, baseAngle, offsetY, speed });

        qiPositions[i * 3] = selPos.x + Math.cos(baseAngle) * baseRadius;
        qiPositions[i * 3 + 1] = selPos.y + offsetY;
        qiPositions[i * 3 + 2] = selPos.z + Math.sin(baseAngle) * baseRadius;

        qiColors[i * 3] = 0.98;
        qiColors[i * 3 + 1] = 0.65;
        qiColors[i * 3 + 2] = 0.15;
      } else if (connectedLinks.length > 0) {
        const link = connectedLinks[i % connectedLinks.length];
        const srcPos = nodePosMap.get(link.source);
        const tgtPos = nodePosMap.get(link.target);
        if (srcPos && tgtPos) {
          const dist = srcPos.distanceTo(tgtPos);
          const midPoint = new THREE.Vector3().addVectors(srcPos, tgtPos).multiplyScalar(0.5);
          midPoint.z += dist * 0.16;
          const curve = new THREE.QuadraticBezierCurve3(srcPos, midPoint, tgtPos);

          const phase = Math.random();
          const speed = 0.35 + Math.random() * 0.5;

          qiParticleData.push({ type: 'flow', curve, phase, speed });

          const pt = curve.getPoint(phase);
          qiPositions[i * 3] = pt.x;
          qiPositions[i * 3 + 1] = pt.y;
          qiPositions[i * 3 + 2] = pt.z;

          qiColors[i * 3] = 0.95;
          qiColors[i * 3 + 1] = 0.4;
          qiColors[i * 3 + 2] = 0.15;
        } else {
          qiPositions[i * 3] = 0;
          qiPositions[i * 3 + 1] = 0;
          qiPositions[i * 3 + 2] = 0;
          qiParticleData.push({ type: 'aura', speed: 0 });
        }
      } else {
        qiPositions[i * 3] = 0;
        qiPositions[i * 3 + 1] = 0;
        qiPositions[i * 3 + 2] = 0;
        qiParticleData.push({ type: 'aura', speed: 0 });
      }
    }

    const qiGeo = new THREE.BufferGeometry();
    qiGeo.setAttribute('position', new THREE.BufferAttribute(qiPositions, 3));
    qiGeo.setAttribute('color', new THREE.BufferAttribute(qiColors, 3));

    const qiPoints = new THREE.Points(qiGeo, new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      transparent: true,
      opacity: selPos ? 0.95 : 0.25,
      blending: THREE.AdditiveBlending
    }));

    group.add(qiPoints);
    qiParticleSystemRef.current = qiPoints;
    qiParticleDataRef.current = qiParticleData;
  };

  // Mouse Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (rotationGroupRef.current) {
      raycaster.current.setFromCamera(mouse.current, cameraRef.current);
      const intersects = raycaster.current.intersectObjects(rotationGroupRef.current.children);
      const hitNode = intersects.find((i) => i.object.userData && i.object.userData.id);
      if (hitNode) {
        setHoveredNodeId(hitNode.object.userData.id);
      } else {
        setHoveredNodeId(null);
      }
    }

    if (!isDragging.current || !rotationGroupRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    rotationGroupRef.current.rotation.y += deltaX * 0.008;
    rotationGroupRef.current.rotation.x += deltaY * 0.008;

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    isDragging.current = false;

    if (mountRef.current && cameraRef.current && rotationGroupRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const clickY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(new THREE.Vector2(clickX, clickY), cameraRef.current);
      const intersects = raycaster.current.intersectObjects(rotationGroupRef.current.children);
      const hit = intersects.find((i) => i.object.userData && i.object.userData.id);

      if (hit) {
        setSelectedNodeId(hit.object.userData.id);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.min(Math.max(cameraRef.current.position.z + e.deltaY * 0.015, 10), 45);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0a0f1d] via-[#111827] to-[#0d1322] text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden border border-[#1e293b]">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#0d5d56] text-white rounded-full text-xs font-extrabold font-mono tracking-wide shadow-md border border-[#14b8a6]/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>3D WEBGL 全息空间拓扑视界 v3.5 • 理论体系与加减推演</span>
            </div>
            {onOpenDict && (
              <button
                onClick={onOpenDict}
                className="px-3 py-1 bg-[#b91c1c] text-white rounded-full text-xs font-bold hover:bg-[#991b1b] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>速查内景活字典</span>
              </button>
            )}
          </div>

          <h2 className="text-xl md:text-2xl font-black font-serif tracking-wide text-cyan-100 flex items-center gap-2">
            三维全息空间图：传经通路 vs 药物加减 vs 核心药对
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-4xl">
            基于《内景解伤寒》最新论证，全方位理清<strong>病机传变通路</strong>与<strong>药物加减化裁/药对协同关系</strong>的本质区别。在 3D 空间中自由多视角切换，观察桂枝汤加减树、六经传化路线与“姜附桂/推拉药对”等靶点效应。
          </p>

          {/* Perspective Multi-View Switcher Bar */}
          <div className="pt-2 flex flex-wrap gap-2">
            {[
              { id: 'full-spatial', name: '1. 全景三维空间拓扑', icon: Network, color: 'bg-amber-500 text-stone-950' },
              { id: 'transmission', name: '2. 六经病变传变路线轴', icon: Brain, color: 'bg-cyan-500 text-stone-950' },
              { id: 'formula-evolution', name: '3. 经方衍化与药味加减树', icon: Layers, color: 'bg-emerald-500 text-stone-950' },
              { id: 'herb-pairs', name: '4. 核心药对增减协同网', icon: Zap, color: 'bg-purple-500 text-white' }
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setViewMode(tab.id as ViewMode);
                    if (tab.id === 'transmission') setSelectedNodeId('m_taiyang_biaoyu');
                    if (tab.id === 'formula-evolution') setSelectedNodeId('var_gegentang');
                    if (tab.id === 'herb-pairs') setSelectedNodeId('pair_gui_shao');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? `${tab.color} font-black shadow-lg scale-105`
                      : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 text-white/5 font-serif text-9xl font-black pointer-events-none select-none">
          图
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-[#111625] p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="在 3D 空间搜索经方（桂枝汤/葛根汤）、加减味（+附子/+葛根）、药对（姜附桂/麻黄石膏）..."
            className="w-full pl-10 pr-4 py-2 bg-[#090d16] border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              清除
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            3D Nodes: <strong className="text-amber-400">{allGraphData.nodes.length}</strong> | Links: <strong className="text-cyan-400">{allGraphData.links.length}</strong>
          </span>
          <button
            onClick={() => {
              setViewMode('full-spatial');
              setSearchTerm('');
              setSelectedNodeId('m_taiyang_biaoyu');
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            title="重置 3D 视角"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D CANVAS STAGE & MULTI-ANGLE INSPECTOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 3D WebGL Canvas Stage (8 cols) */}
        <div className="lg:col-span-8 bg-[#06070a] border border-slate-800 rounded-3xl p-3 relative min-h-[560px] shadow-2xl overflow-hidden flex flex-col justify-between select-none">
          
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono z-10 p-2">
            <span className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-700 text-cyan-300">
              <Compass className="w-4 h-4 text-amber-400 animate-spin" />
              <span>3D 全息控制: 拖拽翻转 • 滚轮缩放 • 点击 3D 节点高亮传变</span>
            </span>

            <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-amber-300"
                title={isPlaying ? '暂停自转' : '开启自转'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setRotationSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
                className="px-2.5 py-1 bg-slate-800 rounded-md text-[11px] font-bold text-slate-200"
              >
                {rotationSpeed}x 速度
              </button>
            </div>
          </div>

          {/* WebGL Canvas */}
          <div
            ref={mountRef}
            className="w-full h-[520px] rounded-2xl cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />

          {/* Hovered Node Floating Badge */}
          {hoveredNodeId && (
            <div className="absolute top-16 left-6 z-20 bg-slate-900/95 text-cyan-300 px-3.5 py-1.5 rounded-xl border border-cyan-500/60 text-xs font-serif font-bold shadow-xl animate-fadeIn pointer-events-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>悬停 3D 节点: {allGraphData.nodes.find((n) => n.id === hoveredNodeId)?.name}</span>
            </div>
          )}

          {/* Legend Explanation Footer inside Canvas */}
          <div className="text-[11px] text-slate-400 font-mono pt-2.5 px-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 bg-slate-950/70 rounded-b-2xl">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> 传经病位</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rotate-45 inline-block"></span> 经方加减味</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-purple-500 inline-block"></span> 核心药对</span>
            </div>
            <span>GPU 渲染 60FPS • WebGL 3D 空间</span>
          </div>
        </div>

        {/* Multi-Angle Details Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/95 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl text-slate-200">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-xs font-mono font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>3D 节点深度剖析</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Node ID: {selectedNodeData?.id}</span>
          </div>

          {/* Node Title & Badge */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg md:text-xl font-bold font-serif text-white flex items-center gap-2">
                {selectedNodeData?.name}
              </h3>
              <span className="text-[10px] font-bold font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-800">
                {selectedNodeData?.category}
              </span>
            </div>
            <p className="text-xs text-amber-300/90 font-mono mt-1 font-bold">
              {selectedNodeData?.subText}
            </p>
          </div>

          {/* Additions / Subtractions Delta Pill */}
          {selectedNodeData?.deltaSummary && (
            <div className="bg-[#1c1917] p-3 rounded-2xl border border-amber-500/40 text-xs space-y-1 shadow-sm">
              <span className="text-amber-400 font-extrabold flex items-center gap-1 font-serif text-xs">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                【药物加减 / 药对增减化裁关系】
              </span>
              <p className="text-amber-200 font-bold font-mono text-xs">
                {selectedNodeData.deltaSummary}
              </p>
            </div>
          )}

          {/* Transmission vs Modification Difference Distinction Box */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-sky-900/40 space-y-2 text-xs">
            <span className="text-sky-400 font-bold block font-serif flex items-center gap-1">
              <Brain className="w-4 h-4 text-sky-400" />
              【传经通路 vs 药物加减区别剖析】
            </span>
            <p className="text-slate-300 leading-relaxed font-serif text-xs">
              {selectedNodeData?.nodeType === 'formula_variation' ? (
                <span>
                  <strong>药物加减 (Modification)</strong>：基于基底经方（如桂枝汤、小柴胡汤），针对特定微观靶点（如加葛根升津、加厚朴排下水、去白芍通胸阳），不改主轴但调控局部。
                </span>
              ) : selectedNodeData?.nodeType === 'herb_pair' ? (
                <span>
                  <strong>核心药对 (Herb Pair)</strong>：两种或多种药物之间的微观物理协同作用（如桂枝+白芍的“推-拉”循环，干姜+附子的“开玄府+动线粒体”），为经方发挥效能的核心物理纽带。
                </span>
              ) : (
                <span>
                  <strong>传经通路 (Transmission)</strong>：病邪在体表毛孔（太阳）、少阳膜系、阳明胃肠或三阴脏腑之间的自然受损与发展轨迹（太阳 → 少阳 → 阳明 → 太阴 → 少阴 → 厥阴）。
                </span>
              )}
            </p>
          </div>

          {/* Physical Mechanism Detail */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-emerald-900/40 space-y-2 text-xs">
            <span className="text-emerald-400 font-bold block font-serif flex items-center gap-1">
              <Shield className="w-4 h-4 text-emerald-400" />
              【内景物理机制与流体力学】
            </span>
            <p className="text-slate-300 leading-relaxed font-serif">
              {selectedNodeData?.innerMechanismDetail}
            </p>
          </div>

          {/* Herb Target Detail */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-purple-900/40 space-y-2 text-xs">
            <span className="text-purple-400 font-bold block font-serif flex items-center gap-1">
              <Zap className="w-4 h-4 text-purple-400" />
              【药味靶点与血脉玄府效应】
            </span>
            <p className="text-purple-200 leading-relaxed font-serif">
              {selectedNodeData?.herbTargetDetail}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {selectedNodeData?.topicId && (
              <button
                onClick={() => onSelectTopic(selectedNodeData.topicId!)}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>进入对应六经关卡刷题</span>
              </button>
            )}

            {onOpenDict && (
              <button
                onClick={onOpenDict}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>在《内景活字典》中速查 185 条文物理机制</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
