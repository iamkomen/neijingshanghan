/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Activity,
  Layers,
  Zap,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Info,
  CheckCircle2,
  Sliders,
  X,
  Maximize2,
  Flame,
  Snowflake,
  Heart,
  ShieldAlert,
  ArrowRight,
  Compass,
  Droplets,
  Wind,
  Thermometer,
  Cpu
} from 'lucide-react';

export interface MeridianDetail {
  id: 'taiyang' | 'yangming' | 'shaoyang' | 'taiyin' | 'shaoyin' | 'jueyin';
  name: string; // e.g. "太阳经 (表 • 开)"
  type: 'yang' | 'yin';
  mechanismRole: '开' | '阖' | '枢';
  element: string; // e.g. "寒水 / 巨阳"
  organPair: string; // e.g. "膀胱与小肠 • 表之华盖"
  color: string;
  glowColor: string;
  bgGradient: string;
  motto: string;
  physicsDescription: string;
  pathologyFeatures: string[];
  keyFormulas: Array<{
    name: string;
    dosageRole: string;
    targetMechanism: string;
    shanghanClause: string;
    topicId?: string;
  }>;
  simulationMetrics: {
    poreTension: number; // 0 (collapsed/sweating) to 100 (spasm/no sweat)
    cardiacPump: number; // 0 (collapse) to 100 (hyperdynamic)
    fluidVapor: number; // 0 to 100
    autonomicTone: number; // 0 to 100
  };
}

export const MERIDIAN_DATA: Record<string, MeridianDetail> = {
  taiyang: {
    id: 'taiyang',
    name: '太阳病 (表 • 主开)',
    type: 'yang',
    mechanismRole: '开',
    element: '寒水 • 藩篱高压水泵',
    organPair: '足太阳膀胱经 / 手太阳小肠经',
    color: '#3b82f6', // Blue
    glowColor: 'rgba(59, 130, 246, 0.6)',
    bgGradient: 'from-blue-950 via-slate-900 to-zinc-950',
    motto: '太阳主表，如同人体最外层高压防线。寒邪束表则玄府闭塞，温通宣发则营卫调和。',
    physicsDescription: '【内景物理机制】太阳经为全身阳气之藩篱。桂枝汤通过桂枝温通毛细血管内皮、白芍静脉酸收回收，形成1:1血管开合动态平衡；麻黄汤则强力松弛玄府平滑肌，打开毛孔排汗祛邪。',
    pathologyFeatures: [
      '太阳中风：脉浮缓，汗出恶风，营卫不和',
      '太阳伤寒：脉浮紧，无汗而喘，体痛玄府闭',
      '太阳蓄水：小腹满，小便不利，水饮内停'
    ],
    keyFormulas: [
      {
        name: '桂枝汤',
        dosageRole: '桂枝三两 + 芍药三两 (1:1 营卫双向调控)',
        targetMechanism: '调和营卫，扩张真皮微血管，促使组织液转化为发汗底物。',
        shanghanClause: '《伤寒论》第12条：太阳病，头痛发热，汗出恶风，桂枝汤主之。',
        topicId: 'T_LIUJING_1'
      },
      {
        name: '麻黄汤',
        dosageRole: '麻黄三两 + 桂枝二两 + 杏仁五十枚',
        targetMechanism: '强力松弛玄府毛孔与气道平滑肌，解表散寒发汗。',
        shanghanClause: '《伤寒论》第35条：太阳病，恶风无汗而喘，麻黄汤主之。',
        topicId: 'T_LIUJING_2'
      },
      {
        name: '葛根汤',
        dosageRole: '葛根四两 + 麻黄三两 + 桂枝二两',
        targetMechanism: '升津舒筋，强力解除项背斜方肌与微血管痉挛。',
        shanghanClause: '《伤寒论》第31条：太阳病，项背强几几，无汗恶风，葛根汤主之。',
        topicId: 'T_LIUJING_3'
      }
    ],
    simulationMetrics: {
      poreTension: 85,
      cardiacPump: 65,
      fluidVapor: 70,
      autonomicTone: 50
    }
  },
  yangming: {
    id: 'yangming',
    name: '阳明病 (里 • 主阖)',
    type: 'yang',
    mechanismRole: '阖',
    element: '燥金燥土 • 里实炽热',
    organPair: '足阳明胃经 / 手阳明大肠经',
    color: '#eab308', // Amber Gold
    glowColor: 'rgba(234, 179, 8, 0.6)',
    bgGradient: 'from-amber-950 via-stone-900 to-zinc-950',
    motto: '阳明主里，为燥土大胃。胃家实则燥热炽盛、津液大伤，白虎清热、承气通腑降邪。',
    physicsDescription: '【内景物理机制】邪入阳明转化为高热燥实。白虎汤利用石膏（硫酸钙水合物）吸热沉降与知母保水，急剧降低核心体温；大承气汤利用大黄蒽醌类刺激肠道平滑肌蠕动，彻底清除里实毒素。',
    pathologyFeatures: [
      '阳明经证：大热、大汗、大渴、脉洪大（白虎汤）',
      '阳明腑证：潮热、谵语、腹满痛、大便燥结（承气汤）',
      '阳明发黄：湿热交蒸，胆汁逆流排泄受阻'
    ],
    keyFormulas: [
      {
        name: '白虎汤',
        dosageRole: '石膏一斤 + 知母六两 + 甘草二两 + 粳米一升',
        targetMechanism: '急剧吸收核心高热，补充血容量，阻止组织液干涸。',
        shanghanClause: '《伤寒论》第176条：伤寒脉浮济，发热无汗，表里俱热者，白虎汤主之。',
        topicId: 'T_LIUJING_5'
      },
      {
        name: '大承气汤',
        dosageRole: '大黄四两 + 芒硝三合 + 枳实五枚 + 厚朴半斤',
        targetMechanism: '刺激肠神经丛促进肠道积滞泄下，恢复肠屏障通透性。',
        shanghanClause: '《伤寒论》第212条：阳明病，谵语发潮热，大承气汤主之。',
        topicId: 'T_LIUJING_6'
      }
    ],
    simulationMetrics: {
      poreTension: 30,
      cardiacPump: 90,
      fluidVapor: 20,
      autonomicTone: 80
    }
  },
  shaoyang: {
    id: 'shaoyang',
    name: '少阳病 (半表半里 • 主枢)',
    type: 'yang',
    mechanismRole: '枢',
    element: '相火 • 枢机枢转',
    organPair: '足少阳胆经 / 手少阳三焦经',
    color: '#10b981', // Emerald Green
    glowColor: 'rgba(16, 185, 129, 0.6)',
    bgGradient: 'from-emerald-950 via-zinc-900 to-zinc-950',
    motto: '少阳介于表里之间，主自律神经与三焦水道之枢纽。小柴胡汤和解枢机、和畅气血。',
    physicsDescription: '【内景物理机制】少阳为气机升降出入之总枢纽。柴胡含有柴胡皂苷，可调节下丘脑-垂体-肾上腺轴；配伍黄芩清胆热、半夏降胃气，恢复自律神经紊乱与胆汁分泌正常化。',
    pathologyFeatures: [
      '往来寒热：表里气机枢转不利，免疫风暴起伏',
      '胸胁苦满：胸胁淋巴与微血管瘀阻',
      '默默不欲饮食、心烦喜呕：胆胃气逆，消化液分泌紊乱'
    ],
    keyFormulas: [
      {
        name: '小柴胡汤',
        dosageRole: '柴胡八两 + 黄芩三两 + 人参三两 + 半夏半升',
        targetMechanism: '调节自律神经系统平衡，阻断促炎细胞因子表达，和解少阳枢机。',
        shanghanClause: '《伤寒论》第96条：伤寒五六日，往来寒热，胸胁苦满，小柴胡汤主之。',
        topicId: 'T_LIUJING_7'
      },
      {
        name: '大柴胡汤',
        dosageRole: '柴胡八两 + 黄芩三两 + 大黄二两 + 枳实四两',
        targetMechanism: '和解少阳枢机兼泻下阳明腑实，促进奥迪括约肌松弛与胆汁排泄。',
        shanghanClause: '《伤寒论》第103条：柴胡证仍在，按之心下满痛者，大柴胡汤主之。',
        topicId: 'T_LIUJING_8'
      }
    ],
    simulationMetrics: {
      poreTension: 60,
      cardiacPump: 70,
      fluidVapor: 60,
      autonomicTone: 95
    }
  },
  taiyin: {
    id: 'taiyin',
    name: '太阴病 (里虚寒 • 主开)',
    type: 'yin',
    mechanismRole: '开',
    element: '湿土 • 脾胃虚寒',
    organPair: '足太阴脾经 / 手太阴肺经',
    color: '#d97706', // Amber/Orange
    glowColor: 'rgba(217, 119, 6, 0.6)',
    bgGradient: 'from-orange-950 via-stone-900 to-zinc-950',
    motto: '太阴为三阴之始，主脾土运化失常、自利不渴。理中温中健脾、恢复肠道水液吸收。',
    physicsDescription: '【内景物理机制】脾阳不振导致消化道平滑肌张力低下、肠道水分子吸收障碍。干姜（姜辣素）剧烈刺激肠道微血管扩张，配合人参甘草提高消化酶活性与微循环。',
    pathologyFeatures: [
      '腹满而吐、食不下：胃肠动力减弱，胃排空延迟',
      '自利不渴、时腹自痛：肠道水吸收障碍与平滑肌痉挛',
      '胸下结硬：脾阳不升、水湿停聚'
    ],
    keyFormulas: [
      {
        name: '理中丸 (汤)',
        dosageRole: '干姜三两 + 人参三两 + 白术三两 + 甘草三两',
        targetMechanism: '温中健脾，提高胃肠平滑肌张力，促进吸收肠道水分。',
        shanghanClause: '《伤寒论》第273条：太阴之为病，腹满而吐，食不下，自利益甚，理中丸主之。',
        topicId: 'T_LIUJING_9'
      }
    ],
    simulationMetrics: {
      poreTension: 40,
      cardiacPump: 45,
      fluidVapor: 30,
      autonomicTone: 40
    }
  },
  shaoyin: {
    id: 'shaoyin',
    name: '少阴病 (心肾衰微 • 主枢)',
    type: 'yin',
    mechanismRole: '枢',
    element: '君火/肾水 • 生死危候',
    organPair: '足少阴肾经 / 手少阴心经',
    color: '#dc2626', // Red
    glowColor: 'rgba(220, 38, 38, 0.6)',
    bgGradient: 'from-rose-950 via-stone-900 to-zinc-950',
    motto: '少阴主心阳与肾阳之生死枢纽。脉微细、但欲寐，四逆汤回阳救逆、强心复苏。',
    physicsDescription: '【内景物理机制】少阴病为心肾功能衰竭、微循环休克之危重症。附子（乌头碱类生物碱）激活心肌细胞线粒体ATP生成，强力提升心输出量与血压，挽救休克。',
    pathologyFeatures: [
      '脉微细、但欲寐：心泵输出量剧降，脑组织缺血缺氧',
      '四肢厥逆、恶寒缩卧：末梢毛细血管网完全闭塞',
      '下利清谷、小便白：肾小球滤过与重吸收功能极度衰竭'
    ],
    keyFormulas: [
      {
        name: '四逆汤',
        dosageRole: '附子一枚(炮) + 干姜一两半 + 甘草二两(炙)',
        targetMechanism: '急温心肾之阳，强力强心升压，恢复微循环灌注与细胞ATP生成。',
        shanghanClause: '《伤寒论》第323条：少阴病，脉沉细法当汗，肢厥者，四逆汤主之。',
        topicId: 'T_LIUJING_11'
      },
      {
        name: '真武汤',
        dosageRole: '茯苓三两 + 芍药三两 + 白术二两 + 附子一枚',
        targetMechanism: '温阳利水，挽救心源性水肿与肾功能衰竭。',
        shanghanClause: '《伤寒论》第316条：少阴病，二三日不已，至四五日，腹痛，肢体沉重，真武汤主之。',
        topicId: 'T_LIUJING_12'
      }
    ],
    simulationMetrics: {
      poreTension: 20,
      cardiacPump: 20, // Critical drop!
      fluidVapor: 15,
      autonomicTone: 25
    }
  },
  jueyin: {
    id: 'jueyin',
    name: '厥阴病 (阴阳交替 • 主阖)',
    type: 'yin',
    mechanismRole: '阖',
    element: '风木 • 寒热错杂',
    organPair: '足厥阴肝经 / 手厥阴心包经',
    color: '#8b5cf6', // Purple
    glowColor: 'rgba(139, 92, 246, 0.6)',
    bgGradient: 'from-purple-950 via-slate-900 to-zinc-950',
    motto: '厥阴为阴尽阳生之极。寒热错杂、厥热胜复，乌梅丸酸收抑木、寒热并用以安蛔平衡。',
    physicsDescription: '【内景物理机制】厥阴病反映自律神经交感与副交感神经极度紊乱。乌梅丸以大量乌梅酸收敛阴，配合细辛干姜附子温里、黄连黄柏清上热，实现复杂的寒热双向调控。',
    pathologyFeatures: [
      '消渴、气上撞心、心中疼热：上焦虚火炽盛，下焦真寒凝滞',
      '饥而不欲食、食即吐蛔：消化道自律神经混乱，胰胆液分泌失调',
      '厥热胜复：肢体冰冷与高热交替出现'
    ],
    keyFormulas: [
      {
        name: '乌梅丸',
        dosageRole: '乌梅三百枚 + 细辛六两 + 乾姜十两 + 黄连十六两 + 附子六两',
        targetMechanism: '寒热并用、酸苦复阴，重新协调交感与副交感神经紊乱。',
        shanghanClause: '《伤寒论》第338条：厥阴之为病，消渴，气上撞心，心中疼热，食即吐蛔，乌梅丸主之。',
        topicId: 'T_LIUJING_14'
      },
      {
        name: '当归四逆汤',
        dosageRole: '当归三两 + 桂枝三两 + 细辛三两 + 通草二两',
        targetMechanism: '养血温经通脉，强力改善肢端微血管痉挛（雷诺氏现象）。',
        shanghanClause: '《伤寒论》第351条：手足厥寒，脉细欲绝者，当归四逆汤主之。',
        topicId: 'T_LIUJING_13'
      }
    ],
    simulationMetrics: {
      poreTension: 50,
      cardiacPump: 55,
      fluidVapor: 40,
      autonomicTone: 90
    }
  }
};

interface Props {
  onSelectTopic?: (topicId: string) => void;
  onClose?: () => void;
}

export default function SixMeridianInnerLandscape({ onSelectTopic, onClose }: Props) {
  // Selected Meridian State
  const [activeMeridianId, setActiveMeridianId] = useState<
    'taiyang' | 'yangming' | 'shaoyang' | 'taiyin' | 'shaoyin' | 'jueyin'
  >('taiyang');

  // Interactive Simulation Conditions
  const [simulatedCondition, setSimulatedCondition] = useState<
    'normal' | 'taiyang_cold' | 'yangming_heat' | 'shaoyang_stagnation' | 'shaoyin_collapse' | 'jueyin_mixed'
  >('normal');

  // Currently Active Meridian Details
  const activeMeridian = useMemo(() => {
    return MERIDIAN_DATA[activeMeridianId];
  }, [activeMeridianId]);

  // Adjust metrics based on simulation condition
  const currentMetrics = useMemo(() => {
    const base = { ...activeMeridian.simulationMetrics };
    switch (simulatedCondition) {
      case 'taiyang_cold':
        return { poreTension: 95, cardiacPump: 75, fluidVapor: 80, autonomicTone: 60 };
      case 'yangming_heat':
        return { poreTension: 15, cardiacPump: 95, fluidVapor: 10, autonomicTone: 85 };
      case 'shaoyang_stagnation':
        return { poreTension: 65, cardiacPump: 65, fluidVapor: 50, autonomicTone: 98 };
      case 'shaoyin_collapse':
        return { poreTension: 10, cardiacPump: 15, fluidVapor: 10, autonomicTone: 20 };
      case 'jueyin_mixed':
        return { poreTension: 50, cardiacPump: 50, fluidVapor: 40, autonomicTone: 95 };
      default:
        return base;
    }
  }, [activeMeridian, simulatedCondition]);

  return (
    <div className="bg-[#0b0a09] text-zinc-100 rounded-3xl border border-amber-500/30 p-4 md:p-7 space-y-6 shadow-2xl relative overflow-hidden font-sans">
      
      {/* BACKGROUND DECORATIVE GLOW */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full filter blur-[120px] pointer-events-none transition-all duration-700 opacity-20"
        style={{ backgroundColor: activeMeridian.color }}
      ></div>

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800 relative z-10">
        <div className="flex items-start gap-4">
          <div className="hidden sm:block w-20 h-20 rounded-2xl border border-amber-500/40 overflow-hidden shrink-0 shadow-lg relative bg-stone-900">
            <img 
              src="/src/assets/images/six_meridians_map_1785646188221.jpg" 
              alt="六经气化内景修真全图" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-500 text-stone-950 rounded-full text-xs font-black font-mono tracking-wider shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                六经气化内景修真全图
              </span>
              <span className="text-xs font-mono text-amber-400/80">
                HD INNER LANDSCAPE BLUEPRINT v3.0
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-amber-100 mt-2">
              《伤寒论》开•阖•枢六经气化与脏腑内景演化引擎
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              点击下方六经节点，可实时观想开阖枢运行通道、微血管张力、心泵动力、玄府通透性及经方药对的微观物理靶向。
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-2xl cursor-pointer transition-all border border-zinc-700/80 shrink-0 self-start md:self-auto"
            title="关闭视图"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* SIX MERIDIANS NAVIGATION STRIP (三阳三阴六经卡) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 relative z-10">
        {Object.values(MERIDIAN_DATA).map((meridian) => {
          const isActive = meridian.id === activeMeridianId;

          return (
            <button
              key={meridian.id}
              onClick={() => setActiveMeridianId(meridian.id)}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden group ${
                isActive
                  ? 'bg-gradient-to-b from-amber-950 to-zinc-900 border-amber-400 shadow-xl scale-102 ring-2 ring-amber-400/50'
                  : 'bg-zinc-900/80 hover:bg-zinc-800/90 border-zinc-800 hover:border-amber-500/40 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-xs"
                  style={{ backgroundColor: meridian.color }}
                ></span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-amber-300 font-bold border border-zinc-800">
                  主{meridian.mechanismRole}
                </span>
              </div>

              <div className="text-xs font-bold font-serif text-zinc-100 group-hover:text-amber-200 transition-colors">
                {meridian.name.split(' ')[0]}
              </div>

              <div className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">
                {meridian.element}
              </div>
            </button>
          );
        })}
      </div>

      {/* CORE GRAPHICAL CANVAS AREA (SVG INNER LANDSCAPE & FLOW MAP) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT/MAIN SVG INNER LANDSCAPE CANVAS (8 COLS) */}
        <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-inner relative flex flex-col justify-between min-h-[420px] overflow-hidden">
          
          {/* Top Info Banner for Selected Meridian */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full animate-ping"
                style={{ backgroundColor: activeMeridian.color }}
              ></span>
              <span className="text-sm font-bold font-serif text-amber-200">
                {activeMeridian.name} • 气化通道模型
              </span>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-black/40 px-2.5 py-1 rounded-full border border-zinc-800">
              {activeMeridian.organPair}
            </span>
          </div>

          {/* DYNAMIC SVG INTERACTIVE BODY & QI-FLOW BLUEPRINT */}
          <div className="my-4 relative flex items-center justify-center">
            <svg viewBox="0 0 500 320" className="w-full max-w-lg h-auto drop-shadow-2xl">
              
              {/* Central Human Silhouette Outline */}
              <path
                d="M 250 30 C 235 30, 230 45, 230 55 C 230 65, 238 75, 235 85 C 220 95, 210 110, 205 130 C 200 150, 195 200, 190 260 L 310 260 C 305 200, 300 150, 295 130 C 290 110, 280 95, 265 85 C 262 75, 270 65, 270 55 C 270 45, 265 30, 250 30 Z"
                fill="#18181b"
                stroke="#3f3f46"
                strokeWidth="2"
                strokeDasharray="4"
              />

              {/* TAIYANG (Exterior Shield & Pores) */}
              <g className={`transition-opacity duration-500 ${activeMeridianId === 'taiyang' ? 'opacity-100' : 'opacity-30'}`}>
                {/* Surface Shield Circle */}
                <circle cx="250" cy="150" r="130" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6" className="animate-spin" style={{ animationDuration: '25s' }} />
                <text x="360" y="50" className="text-[10px] fill-blue-400 font-mono font-bold">太阳表藩篱 (玄府毛孔)</text>
                
                {/* Pores & Vapor Flow */}
                <line x1="200" y1="80" x2="180" y2="70" stroke="#60a5fa" strokeWidth="3" markerEnd="url(#arrow-blue)" />
                <line x1="300" y1="80" x2="320" y2="70" stroke="#60a5fa" strokeWidth="3" markerEnd="url(#arrow-blue)" />
              </g>

              {/* YANGMING (胃肠燥土 Core Center) */}
              <g className={`transition-opacity duration-500 ${activeMeridianId === 'yangming' ? 'opacity-100' : 'opacity-30'}`}>
                <rect x="225" y="140" width="50" height="70" rx="10" fill="#f59e0b" fillOpacity="0.25" stroke="#eab308" strokeWidth="3" />
                <text x="250" y="180" textAnchor="middle" className="text-[11px] fill-amber-300 font-serif font-bold">胃肠燥土</text>
                {/* Downward Purging Line */}
                <path d="M 250 210 L 250 250" stroke="#eab308" strokeWidth="4" strokeDasharray="4" className="animate-bounce" />
              </g>

              {/* SHAOYANG (Half-Exterior Half-Interior Flank Pivot) */}
              <g className={`transition-opacity duration-500 ${activeMeridianId === 'shaoyang' ? 'opacity-100' : 'opacity-30'}`}>
                {/* Flank Arcs */}
                <path d="M 205 120 Q 180 160 205 200" fill="none" stroke="#10b981" strokeWidth="4" />
                <path d="M 295 120 Q 320 160 295 200" fill="none" stroke="#10b981" strokeWidth="4" />
                <text x="135" y="160" className="text-[10px] fill-emerald-400 font-mono font-bold">少阳半表半里枢机</text>
              </g>

              {/* TAIYIN (Spleen Soil Storage) */}
              <g className={`transition-opacity duration-500 ${activeMeridianId === 'taiyin' ? 'opacity-100' : 'opacity-30'}`}>
                <ellipse cx="230" cy="180" rx="20" ry="15" fill="#d97706" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="2" />
                <text x="170" y="220" className="text-[10px] fill-amber-400 font-mono font-bold">太阴脾虚运化失常</text>
              </g>

              {/* SHAOYIN (Heart-Kidney Heart Pump & Lower Kidney Water) */}
              <g className={`transition-opacity duration-500 ${activeMeridianId === 'shaoyin' ? 'opacity-100' : 'opacity-30'}`}>
                {/* Heart Pump */}
                <circle cx="250" cy="100" r="16" fill="#ef4444" fillOpacity="0.4" stroke="#f87171" strokeWidth="3" className="animate-pulse" />
                <text x="250" y="104" textAnchor="middle" className="text-[10px] fill-white font-bold">心阳</text>
                {/* Kidney Water Connection */}
                <line x1="250" y1="116" x2="250" y2="210" stroke="#dc2626" strokeWidth="3" strokeDasharray="3" />
                <circle cx="250" cy="210" r="14" fill="#991b1b" fillOpacity="0.5" stroke="#ef4444" strokeWidth="2" />
                <text x="250" y="214" textAnchor="middle" className="text-[9px] fill-white font-bold">肾水</text>
              </g>

              {/* JUEYIN (Wind-Wood Alternation) */}
              <g className={`transition-opacity duration-500 ${activeMeridianId === 'jueyin' ? 'opacity-100' : 'opacity-30'}`}>
                <path d="M 230 130 C 270 120, 220 170, 270 160" fill="none" stroke="#a855f7" strokeWidth="3" strokeDasharray="5" className="animate-pulse" />
                <text x="310" y="130" className="text-[10px] fill-purple-400 font-mono font-bold">厥阴阴阳交替错杂</text>
              </g>

              {/* SVG Arrow Defs */}
              <defs>
                <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Bottom Motto & Inner Physics Explanation */}
          <div className="bg-black/60 border border-zinc-800 rounded-2xl p-3.5 space-y-1.5">
            <div className="text-xs font-bold text-amber-300 font-serif flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{activeMeridian.name} • 观想心法</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-serif">
              {activeMeridian.motto}
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE PATHOLOGY SIMULATOR & METRICS (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* SIMULATION CONDITION CONTROLLER */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 space-y-3">
            <div className="text-xs font-bold text-amber-300 font-serif flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-500" />
                病机模拟演练器 (Condition Simulator)
              </span>
              <button
                onClick={() => setSimulatedCondition('normal')}
                className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> 重置
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setSimulatedCondition('taiyang_cold')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  simulatedCondition === 'taiyang_cold'
                    ? 'bg-blue-950 border-blue-500 text-blue-200 font-bold'
                    : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                <Snowflake className="w-3.5 h-3.5 text-blue-400 mb-1" />
                太阳表寒束闭
              </button>

              <button
                onClick={() => setSimulatedCondition('yangming_heat')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  simulatedCondition === 'yangming_heat'
                    ? 'bg-amber-950 border-amber-500 text-amber-200 font-bold'
                    : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 mb-1" />
                阳明里热燥实
              </button>

              <button
                onClick={() => setSimulatedCondition('shaoyang_stagnation')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  simulatedCondition === 'shaoyang_stagnation'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                <Wind className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                少阳枢机停滞
              </button>

              <button
                onClick={() => setSimulatedCondition('shaoyin_collapse')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  simulatedCondition === 'shaoyin_collapse'
                    ? 'bg-rose-950 border-rose-500 text-rose-200 font-bold'
                    : 'bg-zinc-800/60 border-zinc-700/60 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400 mb-1" />
                少阴心阳竭厥
              </button>
            </div>

            {/* LIVE DYNAMIC METRIC BARS */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-800 text-[11px] font-mono">
              <div>
                <div className="flex justify-between text-zinc-300 mb-1">
                  <span>玄府毛孔张力 (Pore Tension):</span>
                  <span className="font-bold text-amber-400">{currentMetrics.poreTension}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${currentMetrics.poreTension}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-zinc-300 mb-1">
                  <span>心泵搏出量 (Cardiac Pump):</span>
                  <span className="font-bold text-rose-400">{currentMetrics.cardiacPump}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${currentMetrics.cardiacPump}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-zinc-300 mb-1">
                  <span>自律神经紧张度 (Autonomic Tone):</span>
                  <span className="font-bold text-emerald-400">{currentMetrics.autonomicTone}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${currentMetrics.autonomicTone}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* PHYSICAL MECHANISM DETAILED CARD */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 space-y-2">
            <div className="text-xs font-bold text-amber-300 font-serif flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-500" />
              <span>微观物理机制 (Microscopic Inner Physics)</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {activeMeridian.physicsDescription}
            </p>
          </div>

        </div>
      </div>

      {/* CORE CLASSIC FORMULAS & CLAUSES LIST FOR SELECTED MERIDIAN */}
      <div className="space-y-3 pt-2 relative z-10">
        <div className="text-sm font-bold font-serif text-amber-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>{activeMeridian.name} • 核心代表经方与药对靶向</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeMeridian.keyFormulas.map((formula, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-4 space-y-2 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-serif text-amber-300 group-hover:text-amber-200">
                  {formula.name}
                </span>
                {formula.topicId && onSelectTopic && (
                  <button
                    onClick={() => onSelectTopic(formula.topicId!)}
                    className="text-[11px] px-2.5 py-1 bg-amber-600/80 hover:bg-amber-500 text-stone-950 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>研习关卡</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="text-xs font-mono text-zinc-400 bg-black/40 p-2 rounded-xl border border-zinc-800/80">
                {formula.dosageRole}
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {formula.targetMechanism}
              </p>

              <div className="text-[11px] font-serif text-amber-400/80 italic pt-1 border-t border-zinc-800/80">
                {formula.shanghanClause}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER ACTION BANNER */}
      <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400 relative z-10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>支持实时观想与随证演练 · 深研伤寒经方之根本钥匙</span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-extrabold rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer self-end sm:self-auto"
          >
            完成观想并返回
          </button>
        )}
      </div>

    </div>
  );
}
