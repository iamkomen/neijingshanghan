/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useMemo } from 'react';
import {
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Info,
  ChevronRight,
  Activity,
  Layers,
  Search,
  CheckCircle2
} from 'lucide-react';

export interface OrganData {
  id: string;
  name: string;
  meridian: 'taiyang' | 'yangming' | 'shaoyang' | 'taiyin' | 'shaoyin' | 'jueyin';
  meridianName: string;
  category: string;
  position: { x: number; y: number };
  svgShape: 'circle' | 'ellipse' | 'path';
  pathData?: string;
  ellipseParams?: { rx: number; ry: number };
  color: string;
  description: string;
  innerPhysicalMechanism: string;
  shanghanClauses: Array<{
    clauseNo: string;
    text: string;
    formula: string;
    topicId?: string;
  }>;
}

export const VISCERA_DATA: OrganData[] = [
  {
    id: 'organ_heart',
    name: '心 (手少阴心经)',
    meridian: 'shaoyin',
    meridianName: '少阴病 / 心阳动力泵',
    category: '五脏之首 • 主血脉与君火',
    position: { x: 250, y: 220 },
    svgShape: 'ellipse',
    ellipseParams: { rx: 28, ry: 32 },
    color: '#9b3333', // Cinnabar Vermilion
    description: '心主血脉，藏神，为全身血液循环与体温气化的总枢纽。心阳衰微则脉微细、但欲寐；心阳充盈则百脉通畅。',
    innerPhysicalMechanism: '内景物理：心肌收缩力（心泵动力）决定了末梢毛细血管网的灌注压。桂枝甘草汤以桂枝急温心阳、甘草和中，瞬间复苏心泵频率。',
    shanghanClauses: [
      {
        clauseNo: '第64条',
        text: '发汗过多，其人叉手自冒心，心下悸，欲得按者，桂枝甘草汤主之。',
        formula: '桂枝甘草汤',
        topicId: 'T_LIUJING_1'
      },
      {
        clauseNo: '第117条',
        text: '烧针令汗，针处被寒，核起而赤者，必发奔豚，气从少腹上冲心...茯苓桂枝甘草大枣汤主之。',
        formula: '茯苓桂枝甘草大枣汤',
        topicId: 'T_LIUJING_4'
      },
      {
        clauseNo: '第323条',
        text: '少阴病，脉沉细法当汗，设不汗，心下悸，肢厥者，四逆汤主之。',
        formula: '四逆汤',
        topicId: 'T_LIUJING_15'
      }
    ]
  },
  {
    id: 'organ_lung',
    name: '肺 (手太阴肺经)',
    meridian: 'taiyang',
    meridianName: '太阳病 / 宣发肃降与玄府',
    category: '五脏之华盖 • 主气司呼吸',
    position: { x: 250, y: 170 },
    svgShape: 'ellipse',
    ellipseParams: { rx: 50, ry: 25 },
    color: '#2d6a62', // Mineral Teal
    description: '肺主一身之气，外合皮毛玄府，通调水道。寒邪束表则肺气不宣，发为哮喘、无汗或水饮内停。',
    innerPhysicalMechanism: '内景物理：肺泡与支气管平滑肌之张力调控。麻黄强力扩张支气管并开毛窍，杏仁降肺气下行，形成肺部气体交换之高效循环。',
    shanghanClauses: [
      {
        clauseNo: '第35条',
        text: '太阳病，头痛发热，身疼腰痛，骨节疼痛，恶风无汗而喘者，麻黄汤主之。',
        formula: '麻黄汤',
        topicId: 'T_LIUJING_2'
      },
      {
        clauseNo: '第40条',
        text: '伤寒表不解，心下有水气，干呕发热而咳...小青龙汤主之。',
        formula: '小青龙汤',
        topicId: 'T_LIUJING_2'
      },
      {
        clauseNo: '第63条',
        text: '发汗后，不可更行桂枝汤，汗出而喘，无大热者，可与麻黄杏仁甘草石膏汤。',
        formula: '麻杏石甘汤',
        topicId: 'T_LIUJING_2'
      }
    ]
  },
  {
    id: 'organ_stomach',
    name: '胃 (足阳明胃经)',
    meridian: 'yangming',
    meridianName: '阳明病 / 燥热与胃家实',
    category: '六腑之海 • 受纳腐熟水谷',
    position: { x: 230, y: 280 },
    svgShape: 'ellipse',
    ellipseParams: { rx: 32, ry: 26 },
    color: '#a3702c', // Ochre Amber
    description: '胃主受纳，为多气多血之府。邪入阳明极易蒸腾化热伤津，出现大汗出、大烦渴，或与糟粕结聚为燥屎。',
    innerPhysicalMechanism: '内景物理：胃肠道黏膜渗透压与热能积累。石膏知母降温抑制无形炽热，大黄芒硝以高渗透压引水入肠、通导有形实结。',
    shanghanClauses: [
      {
        clauseNo: '第176条',
        text: '伤寒脉浮济，大烦渴不解，霸发热者，白虎加人参汤主之。',
        formula: '白虎汤',
        topicId: 'T_LIUJING_6'
      },
      {
        clauseNo: '第208条',
        text: '阳明病，脉迟，汗出多，微恶寒者，表未解也，可发汗...若潮热，大便硬者，大承气汤主之。',
        formula: '大承气汤',
        topicId: 'T_LIUJING_7'
      },
      {
        clauseNo: '第247条',
        text: '谵语有潮热，反利脉调者，大承气汤主之。',
        formula: '麻子仁丸',
        topicId: 'T_LIUJING_9'
      }
    ]
  },
  {
    id: 'organ_spleen',
    name: '脾 (足太阴脾经)',
    meridian: 'taiyin',
    meridianName: '太阴病 / 脾阳虚寒与水湿',
    category: '五脏之本 • 运化水谷与升清',
    position: { x: 285, y: 285 },
    svgShape: 'ellipse',
    ellipseParams: { rx: 24, ry: 20 },
    color: '#2d7a52', // Bamboo Green
    description: '脾主运化水湿与升清。太阴受邪则脾阳衰微，水湿不化，表现为自利不渴、腹满而吐、时腹自痛。',
    innerPhysicalMechanism: '内景物理：消化道平滑肌张力低下与吸收屏障失效。干姜大温脾阳促进黏膜血流，白术吸收多余游离水份，恢复胃肠吸收功能。',
    shanghanClauses: [
      {
        clauseNo: '第273条',
        text: '太阴之为病，腹满而吐，食不下，自利益甚，时腹自痛。若下之，必胸下结硬。',
        formula: '理中汤',
        topicId: 'T_LIUJING_13'
      },
      {
        clauseNo: '第279条',
        text: '本太阳病，医反下之，因尔腹满时痛者，桂枝加芍药汤主之。',
        formula: '桂枝加芍药汤',
        topicId: 'T_LIUJING_14'
      }
    ]
  },
  {
    id: 'organ_liver',
    name: '肝 (足厥阴肝经)',
    meridian: 'jueyin',
    meridianName: '厥阴病 / 寒热错杂与疏泄',
    category: '五脏之罢极之本 • 主疏泄与藏血',
    position: { x: 195, y: 275 },
    svgShape: 'ellipse',
    ellipseParams: { rx: 35, ry: 28 },
    color: '#8c2b4e', // Plum Cinnabar
    description: '肝主疏泄与藏血，为阴阳交替之枢纽。厥阴病阴阳不顺，表现为上热下寒、消渴、手足厥逆。',
    innerPhysicalMechanism: '内景物理：肝脏门静脉血流与自主神经极度失调。乌梅酸敛安蛔，干姜附子温下寒，黄连黄柏清上热，寒热并用调平厥阴。',
    shanghanClauses: [
      {
        clauseNo: '第338条',
        text: '厥阴之为病，消渴，气上撞心，心中疼热，饥而不欲食，食则吐蛔...乌梅丸主之。',
        formula: '乌梅丸',
        topicId: 'T_LIUJING_18'
      },
      {
        clauseNo: '第351条',
        text: '手足厥寒，脉细欲绝者，当归四逆汤主之。',
        formula: '当归四逆汤',
        topicId: 'T_LIUJING_19'
      },
      {
        clauseNo: '第309条',
        text: '少阴病，吐利，手足逆冷，烦躁欲死者，吴茱萸汤主之。',
        formula: '吴茱萸汤',
        topicId: 'T_LIUJING_20'
      }
    ]
  },
  {
    id: 'organ_gall_triple',
    name: '胆与三焦膜系 (少阳枢机)',
    meridian: 'shaoyang',
    meridianName: '少阳病 / 膜系枢机与淋巴',
    category: '半表半里 • 枢机运转与三焦',
    position: { x: 185, y: 310 },
    svgShape: 'ellipse',
    ellipseParams: { rx: 18, ry: 16 },
    color: '#256e66', // Deep Teal Green
    description: '少阳主持半表半里，为网膜、网膜囊与淋巴体液流动之通道。枢机不利则往来寒热、胸胁苦满、心烦喜呕。',
    innerPhysicalMechanism: '内景物理：腹膜网膜系与微淋巴管之通透性调节。柴胡疏透半表半里之郁结，黄芩清泄相火，生姜半夏和胃降逆。',
    shanghanClauses: [
      {
        clauseNo: '第96条',
        text: '伤寒五六日，中风，往来寒热，胸胁苦满，嘿嘿不欲饮食，心烦喜呕...小柴胡汤主之。',
        formula: '小柴胡汤',
        topicId: 'T_LIUJING_10'
      },
      {
        clauseNo: '第103条',
        text: '太阳病，过经十余日，反二三下之...按之心下满痛者，此为实也，大柴胡汤主之。',
        formula: '大柴胡汤',
        topicId: 'T_LIUJING_11'
      },
      {
        clauseNo: '第147条',
        text: '伤寒五六日，已发汗而复下之，胸胁满微结，小便不利，渴而不呕...柴胡桂枝干姜汤主之。',
        formula: '柴胡桂枝干姜汤',
        topicId: 'T_LIUJING_12'
      }
    ]
  },
  {
    id: 'organ_kidney',
    name: '肾 (足少阴肾经)',
    meridian: 'shaoyin',
    meridianName: '少阴病 / 心肾阳气与水液',
    category: '先天之本 • 主水藏精',
    position: { x: 250, y: 350 },
    svgShape: 'ellipse',
    ellipseParams: { rx: 42, ry: 24 },
    color: '#5c4b82', // Deep Wisteria Violet
    description: '肾藏精主水，为人体生命原动力之源。少阴阳虚则水气泛滥、心下悸、肢体震颤或四肢厥逆。',
    innerPhysicalMechanism: '内景物理：肾小球滤过与肾小管水盐重吸收气化。附子注入强心肾原动力，白术茯苓温阳利水，生姜散胃水。',
    shanghanClauses: [
      {
        clauseNo: '第82条',
        text: '太阳病发汗，汗出不解，其人仍发热，心下悸，头眩，身瞤动，振振欲擗地者，真武汤主之。',
        formula: '真武汤',
        topicId: 'T_LIUJING_15'
      },
      {
        clauseNo: '第316条',
        text: '少阴病，二三日不已，至四五日，腹痛，小便不利，下利不止，便脓血者，真武汤主之。',
        formula: '真武汤',
        topicId: 'T_LIUJING_15'
      }
    ]
  },
  {
    id: 'organ_bladder',
    name: '膀胱与玄府 (太阳气化)',
    meridian: 'taiyang',
    meridianName: '太阳病 / 膀胱气化与水血',
    category: '州都之官 • 津液藏焉气化乃能出',
    position: { x: 250, y: 440 },
    svgShape: 'ellipse',
    ellipseParams: { rx: 30, ry: 22 },
    color: '#9e4e3b', // Red Clay Ochre
    description: '膀胱主贮尿与气化，与太阳表层玄府遥相呼应。邪入膀胱可致气化不利之蓄水证，或热结下焦之蓄血证。',
    innerPhysicalMechanism: '内景物理：平滑肌张力与下焦盆腔充血状态。桂枝温通膀胱气化，茯苓泽泻利水渗湿；桃仁大黄破血逐瘀。',
    shanghanClauses: [
      {
        clauseNo: '第71条',
        text: '太阳病，发汗后，大汗出，胃中干，烦躁不得眠...若脉浮，小便不利，微热消渴者，五苓散主之。',
        formula: '五苓散',
        topicId: 'T_LIUJING_4'
      },
      {
        clauseNo: '第106条',
        text: '太阳病不解，热结膀胱，其人如狂，血自下下者愈...桃核承气汤主之。',
        formula: '桃核承气汤',
        topicId: 'T_LIUJING_5'
      }
    ]
  }
];

interface VisceraAnatomicalDiagramProps {
  onSelectTopic?: (topicId: string) => void;
}

export default function VisceraAnatomicalDiagram({ onSelectTopic }: VisceraAnatomicalDiagramProps) {
  const [selectedOrganId, setSelectedOrganId] = useState<string>('organ_heart');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [searchFilter, setSearchFilter] = useState<string>('');

  const selectedOrgan = useMemo(() => {
    return VISCERA_DATA.find((o) => o.id === selectedOrganId) || VISCERA_DATA[0];
  }, [selectedOrganId]);

  const filteredOrgans = useMemo(() => {
    if (!searchFilter.trim()) return VISCERA_DATA;
    const q = searchFilter.toLowerCase();
    return VISCERA_DATA.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.meridianName.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  // Drag Pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="bg-[#1c1917] text-white border border-[#44403c] rounded-3xl p-5 md:p-7 shadow-2xl space-y-6 relative overflow-hidden">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#332f2c] pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#b91c1c] text-white text-[11px] font-extrabold rounded-full font-mono tracking-wider flex items-center gap-1.5 shadow-sm">
              <Activity className="w-3.5 h-3.5" />
              <span>《伤寒论》物理内景解剖图</span>
            </span>
            <span className="text-xs text-[#a8a29e] font-serif">
              六经气化与脏腑剖析引擎
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black font-serif text-[#f5f5f4] tracking-wide">
            内景脏腑经络交互解剖图
          </h3>
          <p className="text-xs text-[#a8a29e] max-w-2xl leading-relaxed">
            以物理内景学说重现人体脏腑（心肺肝脾胃肾膀胱）与三焦膜系。点击解剖图中特定脏腑，可高亮其在《伤寒论》六经传变中的条文路径与气化机制。
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="搜索脏腑/经络..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#292524] border border-[#44403c] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: SVG CANVAS & CLAUSE INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SVG INTERACTIVE ANATOMICAL CANVAS */}
        <div className="lg:col-span-7 bg-[#0c0a09] border border-[#292524] rounded-3xl p-4 relative min-h-[520px] flex flex-col justify-between overflow-hidden shadow-inner">
          
          {/* Canvas Controls Header */}
          <div className="flex items-center justify-between z-10 px-2 py-1">
            <span className="text-xs font-bold text-amber-200/90 font-serif flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>人像人体内景投影 (点击脏腑节点)</span>
            </span>

            <div className="flex items-center gap-1 bg-[#1c1917]/80 p-1 rounded-xl border border-[#332f2c]">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 2.2))}
                className="p-1.5 hover:bg-[#292524] rounded-lg text-zinc-300 transition-colors"
                title="放大"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
                className="p-1.5 hover:bg-[#292524] rounded-lg text-zinc-300 transition-colors"
                title="缩小"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 hover:bg-[#292524] rounded-lg text-zinc-300 transition-colors"
                title="重置"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SVG Canvas Area */}
          <div
            className="w-full h-[460px] relative cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 500 580"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Body Glow Filter */}
                <filter id="body-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Organ Pulse Filter */}
                <filter id="organ-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                
                {/* HUMAN BODY OUTLINE SILHOUETTE */}
                <g opacity="0.35" stroke="#78716c" strokeWidth="1.5" fill="none">
                  {/* Head & Neck */}
                  <path d="M 250 40 C 230 40, 220 60, 220 85 C 220 105, 235 120, 240 125 C 230 135, 210 145, 180 155 C 160 162, 140 180, 135 210 L 125 310 C 120 330, 130 350, 140 370 L 155 520 L 180 520 L 195 380 L 250 380 L 305 380 L 320 520 L 345 520 L 360 370 C 370 350, 380 330, 375 310 L 365 210 C 360 180, 340 162, 320 155 C 290 145, 270 135, 260 125 C 265 120, 280 105, 280 85 C 280 60, 270 40, 250 40 Z" fill="#1c1917" />
                  
                  {/* Central Meridian Line (Ren Mai / Governing Vessel) */}
                  <line x1="250" y1="50" x2="250" y2="480" stroke="#a8a29e" strokeDasharray="3,3" opacity="0.6" />
                  
                  {/* Spine & Body Axis Lines */}
                  <path d="M 250 125 L 250 380" stroke="#f59e0b" strokeWidth="1" opacity="0.4" />
                </g>

                {/* MERIDIAN PATHWAYS (CONNECTING LINES BETWEEN ORGANS) */}
                <g fill="none" strokeWidth="1.8" opacity="0.6">
                  {/* Heart <-> Lung */}
                  <path d="M 250 220 L 250 170" stroke="#0284c7" strokeDasharray="2,2" />
                  {/* Heart <-> Kidney (Shaoyin axis) */}
                  <path d="M 250 220 Q 270 285 250 350" stroke="#7c3aed" strokeWidth="2" strokeDasharray="4,4" />
                  {/* Stomach <-> Spleen (Taiyin/Yangming pair) */}
                  <path d="M 230 280 L 285 285" stroke="#d97706" />
                  {/* Liver <-> Gallbladder (Jueyin/Shaoyang) */}
                  <path d="M 195 275 L 185 310" stroke="#be123c" />
                  {/* Kidney <-> Bladder */}
                  <path d="M 250 350 L 250 440" stroke="#dc2626" strokeWidth="2" />
                </g>

                {/* ORGANS SVG SHAPES */}
                {filteredOrgans.map((organ) => {
                  const isSelected = selectedOrganId === organ.id;
                  const { rx = 30, ry = 20 } = organ.ellipseParams || {};

                  return (
                    <g
                      key={organ.id}
                      transform={`translate(${organ.position.x}, ${organ.position.y})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrganId(organ.id);
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Pulse Ring when selected */}
                      {isSelected && (
                        <ellipse
                          rx={rx + 12}
                          ry={ry + 12}
                          fill="none"
                          stroke={organ.color}
                          strokeWidth="2"
                          opacity="0.6"
                          className="animate-ping"
                        />
                      )}

                      {/* Organ Outer Glow */}
                      <ellipse
                        rx={rx + 4}
                        ry={ry + 4}
                        fill={organ.color}
                        opacity={isSelected ? 0.35 : 0.15}
                        filter="url(#organ-glow)"
                      />

                      {/* Main Organ Ellipse Body */}
                      <ellipse
                        rx={rx}
                        ry={ry}
                        fill={isSelected ? organ.color : '#292524'}
                        stroke={organ.color}
                        strokeWidth={isSelected ? 3 : 1.8}
                        className="transition-all duration-300 group-hover:scale-105"
                      />

                      {/* Inner Name Label */}
                      <text
                        textAnchor="middle"
                        dy="4"
                        fill={isSelected ? '#ffffff' : organ.color}
                        fontSize="11"
                        fontWeight="bold"
                        className="pointer-events-none select-none font-serif"
                      >
                        {organ.name.split(' ')[0]}
                      </text>

                      {/* Outer Subtitle Tag */}
                      <text
                        textAnchor="middle"
                        dy={ry + 14}
                        fill={isSelected ? '#f5f5f4' : '#a8a29e'}
                        fontSize="9"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        className="pointer-events-none select-none font-sans"
                      >
                        {organ.meridianName.split('/')[0]}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Quick Select Buttons at Canvas Bottom */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#292524] z-10">
            <span className="text-[10px] font-bold text-zinc-500 uppercase mr-1">快速查看脏腑:</span>
            {VISCERA_DATA.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelectedOrganId(o.id)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedOrganId === o.id
                    ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                    : 'bg-[#1c1917] text-zinc-400 hover:bg-[#292524] hover:text-zinc-200'
                }`}
              >
                {o.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* CLAUSE PATHWAYS & PHYSICAL MECHANISM INSPECTOR */}
        <div className="lg:col-span-5 bg-[#292524] border border-[#44403c] rounded-3xl p-5 md:p-6 shadow-xl space-y-5">
          
          {/* HEADER INFO */}
          <div className="space-y-2 border-b border-[#383330] pb-4">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold text-white shadow-sm"
                style={{ backgroundColor: selectedOrgan.color }}
              >
                {selectedOrgan.category}
              </span>
            </div>

            <h3 className="text-xl font-black font-serif text-[#f5f5f4] flex items-center justify-between">
              <span>{selectedOrgan.name}</span>
            </h3>

            <p className="text-xs text-[#d6d3d1] leading-relaxed font-sans">
              {selectedOrgan.description}
            </p>
          </div>

          {/* PHYSICAL INNER LANDSCAPE MECHANISM */}
          <div className="space-y-1.5 bg-[#1c1917] p-3.5 rounded-2xl border border-[#3d3835]">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>物理内景气化机制解剖:</span>
            </span>
            <p className="text-xs text-amber-100/90 leading-relaxed font-serif">
              {selectedOrgan.innerPhysicalMechanism}
            </p>
          </div>

          {/* CORRESPONDING SHANGHANLUN CLAUSE PATHWAYS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>对应《伤寒论》核心条文路径 ({selectedOrgan.shanghanClauses.length} 条):</span>
              </span>
            </div>

            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
              {selectedOrgan.shanghanClauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="bg-[#1c1917] hover:bg-[#23201e] border border-[#3d3835] rounded-2xl p-3.5 space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-800/60 rounded-md text-[11px] font-mono font-bold">
                      📖 {clause.clauseNo}
                    </span>

                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <span>{clause.formula}</span>
                    </span>
                  </div>

                  <p className="text-xs text-zinc-200 leading-relaxed font-serif bg-[#0c0a09]/60 p-2.5 rounded-xl border border-[#292524]">
                    “{clause.text}”
                  </p>

                  {clause.topicId && onSelectTopic && (
                    <button
                      onClick={() => onSelectTopic(clause.topicId!)}
                      className="w-full py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer mt-1"
                    >
                      <span>前往【{clause.formula}】关卡刷题</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
