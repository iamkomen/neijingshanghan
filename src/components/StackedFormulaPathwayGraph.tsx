/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  GitCompare,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  PlusCircle,
  MinusCircle,
  Zap,
  Activity,
  Sliders,
  RotateCcw,
  BookOpen
} from 'lucide-react';

export interface HerbPairNode {
  id: string;
  name: string; // e.g. "桂枝 + 芍药"
  type: 'base' | 'addition' | 'subtraction' | 'dose_up';
  dosageInfo?: string;
  physicsRole: string; // e.g. "1:1 调和营卫，双向调节微血管张力"
}

export interface TargetNode {
  id: string;
  name: string;
  system: string; // e.g. "微血管网", "项背肌腱微循环", "气道平滑肌", "胸阳心肌"
  description: string;
}

export interface OutcomeNode {
  id: string;
  name: string;
  category: string;
}

export interface FormulaPathwayData {
  id: string;
  name: string;
  meridian: string; // e.g. "太阳病", "少阳病"
  baseFormulaId?: string; // Reference base formula for diff calculation
  shortDesc: string;
  classicTreatise: string; // e.g. 《伤寒论》第14条
  pairs: {
    pairId: string;
    pairName: string;
    changeType: 'inherited' | 'added' | 'subtracted' | 'dosage_changed';
    dosageNote: string;
    weight: number; // 1 to 10 (Line stroke weight)
    targetIds: string[];
    outcomeIds: string[];
    microDesc: string;
  }[];
}

export const FORMULA_PATHWAYS: FormulaPathwayData[] = [
  {
    id: 'guizhi_tang',
    name: '桂枝汤',
    meridian: '太阳中风',
    shortDesc: '解肌发表，调和营卫。太阳中风表虚证之祖方。',
    classicTreatise: '《伤寒论》第12条：太阳病，头痛发热，汗出恶风，桂枝汤主之。',
    pairs: [
      {
        pairId: 'guizhi_shaoyao',
        pairName: '桂枝 + 芍药 (1:1)',
        changeType: 'inherited',
        dosageNote: '各三两',
        weight: 6,
        targetIds: ['target_microvascular', 'target_sweat_gland'],
        outcomeIds: ['outcome_jieji', 'outcome_yingwei'],
        microDesc: '桂枝温通开微循环，芍药酸收敛阴防止大汗脱水，二药1:1等量达成血管开合动态平衡。'
      },
      {
        pairId: 'shengjiang_dazao',
        pairName: '生姜 + 大枣',
        changeType: 'inherited',
        dosageNote: '生姜三两，大枣十二枚',
        weight: 4,
        targetIds: ['target_stomach_volume', 'target_sweat_gland'],
        outcomeIds: ['outcome_yingwei', 'outcome_bufan'],
        microDesc: '温胃生津，为体表发汗提供充沛的血容量与组织液底物。'
      },
      {
        pairId: 'gancao_guizhi',
        pairName: '甘草 + 桂枝',
        changeType: 'inherited',
        dosageNote: '甘草二两(炙)',
        weight: 4,
        targetIds: ['target_cardiac_yang', 'target_microvascular'],
        outcomeIds: ['outcome_xinguang'],
        microDesc: '辛甘化阳，补益心气，防止发汗伤及胸阳心肌传导。'
      }
    ]
  },
  {
    id: 'guizhi_gegen_tang',
    name: '桂枝加葛根汤',
    meridian: '太阳中风兼项背强几几',
    baseFormulaId: 'guizhi_tang',
    shortDesc: '解肌发表，升津舒筋。治太阳病项背强几几、反汗出恶风。',
    classicTreatise: '《伤寒论》第14条：太阳病，项背强几几，反汗出恶风者，桂枝加葛根汤主之。',
    pairs: [
      {
        pairId: 'gegen_guizhi_shaoyao',
        pairName: '葛根 + (桂枝+芍药)',
        changeType: 'added',
        dosageNote: '加葛根四两 (重剂靶向)',
        weight: 9, // Thicker line!
        targetIds: ['target_neck_fascia', 'target_aqp_channels'],
        outcomeIds: ['outcome_shujin', 'outcome_shengjin'],
        microDesc: '【新增重剂靶点】葛根升提体液至项背筋膜，显著下调项背肌腱炎症因子，强力缓解斜方肌微血管痉挛。'
      },
      {
        pairId: 'guizhi_shaoyao',
        pairName: '桂枝 + 芍药 (1:1)',
        changeType: 'inherited',
        dosageNote: '各三两 (继承底方)',
        weight: 5,
        targetIds: ['target_microvascular', 'target_sweat_gland'],
        outcomeIds: ['outcome_jieji', 'outcome_yingwei'],
        microDesc: '继承桂枝汤基础，继续维持全身微循环解肌调和。'
      },
      {
        pairId: 'shengjiang_dazao',
        pairName: '生姜 + 大枣',
        changeType: 'inherited',
        dosageNote: '继承底方',
        weight: 4,
        targetIds: ['target_stomach_volume'],
        outcomeIds: ['outcome_yingwei'],
        microDesc: '补充津液底物，配合葛根将津液源源不断输送到项背。'
      }
    ]
  },
  {
    id: 'gegen_tang',
    name: '葛根汤',
    meridian: '太阳伤寒兼项背强几几',
    baseFormulaId: 'guizhi_tang',
    shortDesc: '刚柔相济，发汗解表，升津舒筋。治无汗恶风、项背强几几。',
    classicTreatise: '《伤寒论》第31条：太阳病，项背强几几，无汗恶风，葛根汤主之。',
    pairs: [
      {
        pairId: 'mahuang_gegen',
        pairName: '麻黄 + 葛根',
        changeType: 'added',
        dosageNote: '加麻黄三两 + 葛根四两',
        weight: 10, // Max thickness!
        targetIds: ['target_sweat_gland', 'target_neck_fascia'],
        outcomeIds: ['outcome_fahan', 'outcome_shujin'],
        microDesc: '【刚柔兼施】麻黄强力开闭玄府毛孔发汗，葛根生津充盈筋膜，防止无汗强发汗致筋脉失养。'
      },
      {
        pairId: 'mahuang_guizhi',
        pairName: '麻黄 + 桂枝',
        changeType: 'added',
        dosageNote: '麻黄三两 + 桂枝二两',
        weight: 8,
        targetIds: ['target_microvascular', 'target_sweat_gland'],
        outcomeIds: ['outcome_fahan'],
        microDesc: '相须发汗，急剧解除真皮毛细血管痉挛，打开玄府。'
      },
      {
        pairId: 'guizhi_shaoyao',
        pairName: '桂枝 + 芍药',
        changeType: 'inherited',
        dosageNote: '继承底方',
        weight: 5,
        targetIds: ['target_microvascular'],
        outcomeIds: ['outcome_jieji'],
        microDesc: '缓和麻黄剧烈发汗，保护血管内皮平滑肌。'
      }
    ]
  },
  {
    id: 'guizhi_houpo_xingzi_tang',
    name: '桂枝加厚朴杏子汤',
    meridian: '太阳中风兼喘',
    baseFormulaId: 'guizhi_tang',
    shortDesc: '解肌发表，降气平喘。治太阳病下后微喘、或喘家作。',
    classicTreatise: '《伤寒论》第18条：喘家作，桂枝汤加厚朴、杏子佳。',
    pairs: [
      {
        pairId: 'houpo_xingren',
        pairName: '厚朴 + 杏仁',
        changeType: 'added',
        dosageNote: '加厚朴二两 + 杏仁五十枚',
        weight: 8,
        targetIds: ['target_bronchial_smooth_muscle', 'target_airway_secretion'],
        outcomeIds: ['outcome_jiangqi_pingchuan'],
        microDesc: '【新增降气平喘靶点】厚朴解除支气管平滑肌痉挛，杏仁苦温宣降肺气、抑制气道黏液高分泌。'
      },
      {
        pairId: 'guizhi_shaoyao',
        pairName: '桂枝 + 芍药',
        changeType: 'inherited',
        dosageNote: '继承底方',
        weight: 5,
        targetIds: ['target_microvascular', 'target_sweat_gland'],
        outcomeIds: ['outcome_jieji'],
        microDesc: '解除体表微血管郁滞，消除引起反射性气喘的外邪。'
      }
    ]
  },
  {
    id: 'guizhi_qu_shaoyao_tang',
    name: '桂枝去芍药汤',
    meridian: '太阳病下后脉促胸满',
    baseFormulaId: 'guizhi_tang',
    shortDesc: '解肌温阳，宣通胸满。去除酸收之芍药，纯阳宣通胸膈。',
    classicTreatise: '《伤寒论》第21条：太阳病下之后，脉促胸满者，桂枝去芍药汤主之。',
    pairs: [
      {
        pairId: 'guizhi_gancao_heavy',
        pairName: '桂枝 + 甘草 (主导)',
        changeType: 'dosage_changed',
        dosageNote: '去除芍药，桂枝甘草独占主导',
        weight: 9,
        targetIds: ['target_cardiac_yang', 'target_thoracic_fullness'],
        outcomeIds: ['outcome_xinguang', 'outcome_xuantong_xiongman'],
        microDesc: '【纯阳温通】切断芍药酸收降阴阴凝作用，使桂枝甘草辛甘化阳效能集中爆发于心胸。'
      },
      {
        pairId: 'shaoyao_yin',
        pairName: '芍药 (已去除 - 切断阴降)',
        changeType: 'subtracted',
        dosageNote: '去芍药 (权重降为0)',
        weight: 1, // Cut dotted red line
        targetIds: [],
        outcomeIds: [],
        microDesc: '【去药原因】下后阴伤胸满，若再用芍药酸收收敛，会加重胸膈寒阴停聚与胸满。'
      }
    ]
  },
  {
    id: 'guizhi_qu_shaoyao_jia_fuzi_tang',
    name: '桂枝去芍药加附子汤',
    meridian: '太阳少阴同病 (脉促胸满微恶寒)',
    baseFormulaId: 'guizhi_tang',
    shortDesc: '解肌温阳，救逆固脱。去芍药兼加附子，温通胸阳兼救少阴衰劫。',
    classicTreatise: '《伤寒论》第22条：若微恶寒者，桂枝去芍药加附子汤主之。',
    pairs: [
      {
        pairId: 'guizhi_fuzi',
        pairName: '桂枝 + 附子',
        changeType: 'added',
        dosageNote: '去芍药，加附子一枚(炮)',
        weight: 10,
        targetIds: ['target_mitochondria_atp', 'target_cardiac_yang'],
        outcomeIds: ['outcome_jiuni_fuyang', 'outcome_xuantong_xiongman'],
        microDesc: '【强心救逆重剂】乌头碱类生物碱激活心肌细胞线粒体ATP生成，极大提高心输出量与外周微血管阻力。'
      },
      {
        pairId: 'shaoyao_yin',
        pairName: '芍药 (已去除)',
        changeType: 'subtracted',
        dosageNote: '去芍药',
        weight: 1,
        targetIds: [],
        outcomeIds: [],
        microDesc: '彻底切断阴凝酸收，纯阳温心肾之阳。'
      }
    ]
  },
  {
    id: 'dachaihu_tang',
    name: '大柴胡汤',
    meridian: '少阳阳明合病',
    baseFormulaId: 'guizhi_tang',
    shortDesc: '和解少阳，泻下阳明。少阳枢机不利兼阳明肠道腑实。',
    classicTreatise: '《伤寒论》第103条：太阳病，过经十余日，反二三下之…柴胡证仍在者，先与小柴胡汤…按之心下满痛者，此为实也，大柴胡汤主之。',
    pairs: [
      {
        pairId: 'dahuang_zhishi',
        pairName: '大黄 + 枳实',
        changeType: 'added',
        dosageNote: '大黄二两 + 枳实四两',
        weight: 9,
        targetIds: ['target_gut_barrier', 'target_biliary_drainage'],
        outcomeIds: ['outcome_xianxia_fushi'],
        microDesc: '【泻下腑实】刺激肠神经丛与肠道平滑肌蠕动，促使奥迪括约肌松弛与胆汁排泄，清除肠道内毒素。'
      },
      {
        pairId: 'chaihu_huangqin',
        pairName: '柴胡 + 黄芩',
        changeType: 'inherited',
        dosageNote: '柴胡八两 + 黄芩三两',
        weight: 8,
        targetIds: ['target_autonomic_nervous'],
        outcomeIds: ['outcome_hejie_shaoyang'],
        microDesc: '和解少阳枢机，调节下丘脑-垂体-肾上腺轴与自律神经平衡。'
      }
    ]
  }
];

// Master List of Targets across all paths
export const ALL_TARGETS: TargetNode[] = [
  { id: 'target_microvascular', name: '真皮微血管网', system: '皮肤微循环', description: '调控血管平滑肌收缩与舒张，恢复体表血流量。' },
  { id: 'target_sweat_gland', name: '汗腺玄府毛孔', system: '汗腺排泄', description: '调控玄府开闭通透性，控制发汗散热与驱邪。' },
  { id: 'target_neck_fascia', name: '项背肌腱微循环', system: '筋膜与神经', description: '解痉止痛，改善斜方肌与项背软组织缺血缺氧。' },
  { id: 'target_aqp_channels', name: '水通道蛋白(AQP)', system: '水液代谢', description: '促进津液输布至体表与项背，充盈体液底物。' },
  { id: 'target_bronchial_smooth_muscle', name: '气道平滑肌', system: '下呼吸道', description: '舒张支气管平滑肌，缓解反射性咳嗽与气喘。' },
  { id: 'target_airway_secretion', name: '气道黏液高分泌', system: '呼吸道分泌', description: '抑制气道炎症与过多黏液分泌。' },
  { id: 'target_cardiac_yang', name: '心肌传导与胸阳', system: '心血管泵功能', description: '温通胸阳，提升心肌收缩力与冠脉灌注。' },
  { id: 'target_thoracic_fullness', name: '胸膈腔内压', system: '胸腔张力', description: '宣通胸膈满闷，消除下后邪气阴凝。' },
  { id: 'target_stomach_volume', name: '胃肠血容量底物', system: '消化道吸收', description: '温胃化气，补充血容量与发汗物质基础。' },
  { id: 'target_mitochondria_atp', name: '心肌线粒体ATP', system: '能量代谢', description: '重启细胞线粒体呼吸链，救治少阴厥逆休克。' },
  { id: 'target_gut_barrier', name: '肠道平滑肌与屏障', system: '胃肠动力', description: '促进肠道积滞排空，保护肠道黏膜屏障。' },
  { id: 'target_autonomic_nervous', name: '自律神经与下丘脑', system: '少阳枢机', description: '调节自律神经紊乱，抑制炎症风暴。' }
];

// Master List of Therapeutic Outcomes
export const ALL_OUTCOMES: OutcomeNode[] = [
  { id: 'outcome_jieji', name: '解肌发表', category: '太阳表证' },
  { id: 'outcome_yingwei', name: '调和营卫', category: '太阳表证' },
  { id: 'outcome_shujin', name: '升津舒筋 (解项背强几几)', category: '经络舒利' },
  { id: 'outcome_shengjin', name: '生津止渴', category: '体液输布' },
  { id: 'outcome_fahan', name: '发汗解表 (表实)', category: '太阳表实' },
  { id: 'outcome_jiangqi_pingchuan', name: '降气平喘 (治喘家)', category: '肺气宣降' },
  { id: 'outcome_xinguang', name: '辛甘化阳 (温通心阳)', category: '胸阳温通' },
  { id: 'outcome_xuantong_xiongman', name: '宣通胸满', category: '胸膈宽胸' },
  { id: 'outcome_jiuni_fuyang', name: '回阳救逆', category: '少阴心肾' },
  { id: 'outcome_bufan', name: '缓急止痛', category: '平滑肌和缓' },
  { id: 'outcome_hejie_shaoyang', name: '和解少阳', category: '少阳枢机' },
  { id: 'outcome_xianxia_fushi', name: '泻下阳明腑实', category: '阳明肠道' }
];

interface Props {
  onSelectTopic?: (topicId: string) => void;
}

export default function StackedFormulaPathwayGraph({ onSelectTopic }: Props) {
  // Currently selected primary formula
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('guizhi_gegen_tang');
  
  // Comparison base formula (default guizhi_tang)
  const [comparisonBaseId, setComparisonBaseId] = useState<string>('guizhi_tang');

  // Toggle comparative view mode
  const [isCompareMode, setIsCompareMode] = useState<boolean>(true);

  // Hovered Herb Pair / Link info
  const [hoveredPairId, setHoveredPairId] = useState<string | null>(null);

  // Active Formula Object
  const currentFormula = useMemo(() => {
    return FORMULA_PATHWAYS.find((f) => f.id === selectedFormulaId) || FORMULA_PATHWAYS[0];
  }, [selectedFormulaId]);

  // Base Comparison Formula Object
  const baseFormula = useMemo(() => {
    return FORMULA_PATHWAYS.find((f) => f.id === comparisonBaseId) || FORMULA_PATHWAYS[0];
  }, [comparisonBaseId]);

  // Color mapper for change types
  const getChangeTypeBadge = (type: 'inherited' | 'added' | 'subtracted' | 'dosage_changed') => {
    switch (type) {
      case 'added':
        return {
          label: '➕ 增药/强化药对',
          bg: 'bg-emerald-500 text-white',
          border: 'border-emerald-600',
          lineColor: '#10b981', // Emerald green
          glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]'
        };
      case 'subtracted':
        return {
          label: '❌ 去药/切断路径',
          bg: 'bg-rose-500 text-white',
          border: 'border-rose-600',
          lineColor: '#f43f5e', // Rose red
          glow: 'drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]'
        };
      case 'dosage_changed':
        return {
          label: '⚡ 药量重置/主导',
          bg: 'bg-amber-500 text-stone-950 font-black',
          border: 'border-amber-600',
          lineColor: '#f59e0b', // Amber gold
          glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
        };
      case 'inherited':
      default:
        return {
          label: '🟢 继承底方药对',
          bg: 'bg-teal-700 text-white',
          border: 'border-teal-800',
          lineColor: '#0d9488', // Teal
          glow: ''
        };
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 md:p-7 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500 text-stone-950 rounded-full text-xs font-black font-mono tracking-wider shadow-xs flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              层叠式经方加减与药效权重演化图
            </span>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              STACKED FORMULA EVOLUTION ENGINE v2.5
            </span>
          </div>
          <h3 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 mt-2">
            经方药对增减与微观靶点权重分布图谱
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            以底方（如桂枝汤）为坐标原点，可视化直观呈现衍生经方（如桂枝加葛根汤、桂枝去芍药汤、葛根汤）在<strong>药对增减（加味/去味/重置）</strong>上的差异化路径，并以<strong>连线粗细代表药效与生物指标的作用权重</strong>。
          </p>
        </div>

        {/* Mode Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              isCompareMode
                ? 'bg-amber-600 text-white ring-2 ring-amber-400/50'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>{isCompareMode ? '已开启底方对比模式' : '切换为底方对比视图'}</span>
          </button>
        </div>
      </div>

      {/* FORMULA SELECTOR STRIP */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 font-serif flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            选择目标演算经方 (Target Formula):
          </span>
          {isCompareMode && (
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <span>基准对照底方:</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                {baseFormula.name}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {FORMULA_PATHWAYS.map((f) => {
            const isSelected = f.id === selectedFormulaId;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFormulaId(f.id)}
                className={`p-2.5 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-md scale-105 font-bold'
                    : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800 hover:border-amber-400'
                }`}
              >
                <div className="text-xs font-serif truncate">{f.name}</div>
                <div className="text-[10px] opacity-80 truncate font-mono mt-0.5">
                  {f.meridian}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPARISON INFOGRAM BANNER */}
      <div className="bg-[#FAF8F2] dark:bg-[#151310] border border-[#ebdcc8] dark:border-[#38322c] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-600 text-white text-[11px] font-bold font-serif">
              当前展示：{currentFormula.name}
            </span>
            <span className="text-xs font-mono text-amber-700 dark:text-amber-400">
              [{currentFormula.meridian}]
            </span>
          </div>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed">
            {currentFormula.classicTreatise}
          </p>
        </div>

        {/* Legend for Line Thickness Weight */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 bg-white/80 dark:bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="font-bold text-zinc-800 dark:text-zinc-200">连线粗细 = 药效权重:</span>
          <span className="flex items-center gap-1">
            <span className="w-6 h-0.5 bg-teal-500 inline-block"></span> 权重3~4 (基础)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 h-1.5 bg-amber-500 inline-block"></span> 权重6~7 (主导)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 h-2.5 bg-emerald-500 inline-block shadow-xs"></span> 权重8~10 (重剂加味)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 h-0.5 border-b-2 border-dashed border-rose-500 inline-block"></span> 去药切断
          </span>
        </div>
      </div>

      {/* 4-TIER STACKED GRAPHICAL CANVAS */}
      <div className="bg-[#fcfbfa] dark:bg-[#0e0d0c] border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-4 md:p-6 shadow-inner relative overflow-x-auto min-w-[760px]">
        
        {/* Tier Columns Header Labels */}
        <div className="grid grid-cols-4 gap-4 text-center pb-4 border-b border-zinc-200 dark:border-zinc-800 font-serif text-xs font-bold text-zinc-700 dark:text-zinc-300">
          <div className="flex items-center justify-center gap-1.5 bg-amber-100/60 dark:bg-amber-950/40 py-2 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            第一层：经方处方 (Formula)
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-teal-100/60 dark:bg-teal-950/40 py-2 rounded-xl border border-teal-200/60 dark:border-teal-900/40">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            第二层：药对增减与量比 (Herb Pairs)
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-sky-100/60 dark:bg-sky-950/40 py-2 rounded-xl border border-sky-200/60 dark:border-sky-900/40">
            <span className="w-2 h-2 rounded-full bg-sky-600"></span>
            第三层：微观物理靶点 (Pathology Target)
          </div>
          <div className="flex items-center justify-center gap-1.5 bg-emerald-100/60 dark:bg-emerald-950/40 py-2 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            第四层：临床功用靶向 (Outcome)
          </div>
        </div>

        {/* SVG Layered Connections and Nodes Display */}
        <div className="relative py-6">
          <div className="grid grid-cols-4 gap-6 items-center">
            
            {/* TIER 1: Selected Formula Node */}
            <div className="space-y-4 flex flex-col items-center justify-center">
              <div className="p-5 bg-gradient-to-br from-amber-500 to-amber-700 text-white rounded-3xl shadow-xl border-2 border-amber-300 text-center w-full max-w-[200px] relative group hover:scale-105 transition-transform">
                <div className="text-xs font-mono font-bold text-amber-200">
                  {currentFormula.meridian}
                </div>
                <h4 className="text-lg font-black font-serif mt-1">
                  {currentFormula.name}
                </h4>
                <div className="text-[11px] text-amber-100 font-mono mt-1">
                  包含 {currentFormula.pairs.length} 组核心药对路径
                </div>
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-xs font-bold shadow-md">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {isCompareMode && (
                <div className="p-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 text-center w-full max-w-[200px] text-xs">
                  <div className="font-bold text-zinc-800 dark:text-zinc-200">对比底方: {baseFormula.name}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">自动识别加味/减味路径</div>
                </div>
              )}
            </div>

            {/* TIER 2: Herb Pairs List (Layered Stack) */}
            <div className="space-y-4">
              {currentFormula.pairs.map((pair) => {
                const badgeInfo = getChangeTypeBadge(pair.changeType);
                const isHovered = hoveredPairId === pair.pairId;

                return (
                  <div
                    key={pair.pairId}
                    onMouseEnter={() => setHoveredPairId(pair.pairId)}
                    onMouseLeave={() => setHoveredPairId(null)}
                    className={`p-3.5 rounded-2xl border transition-all relative cursor-pointer ${
                      isHovered
                        ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-500 shadow-md scale-102 ring-2 ring-amber-400/40'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${badgeInfo.bg}`}>
                        {badgeInfo.label}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 font-bold">
                        权重: {pair.weight}/10
                      </span>
                    </div>

                    <div className="text-sm font-extrabold font-serif text-zinc-900 dark:text-zinc-100">
                      {pair.pairName}
                    </div>

                    <div className="text-[11px] font-mono text-amber-800 dark:text-amber-300 mt-0.5 font-bold">
                      剂量: {pair.dosageNote}
                    </div>

                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-tight">
                      {pair.microDesc}
                    </p>

                    {/* Weight Stroke Thickness Indicator Bar */}
                    <div className="mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>药效传导强度:</span>
                      <div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-500"
                          style={{ width: `${(pair.weight / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TIER 3: Microscopic Pathology Targets */}
            <div className="space-y-3">
              {ALL_TARGETS.filter((tgt) =>
                currentFormula.pairs.some((p) => p.targetIds.includes(tgt.id))
              ).map((target) => {
                // Find highest connecting weight to this target
                const connectingPairs = currentFormula.pairs.filter((p) => p.targetIds.includes(target.id));
                const maxWeight = Math.max(...connectingPairs.map((p) => p.weight), 1);
                const isHighlighted = connectingPairs.some((p) => p.pairId === hoveredPairId);

                return (
                  <div
                    key={target.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isHighlighted
                        ? 'bg-sky-50 dark:bg-sky-950/80 border-sky-500 shadow-md scale-102 ring-2 ring-sky-400'
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-sky-700 dark:text-sky-300 font-bold">
                      <span>🎯 {target.system}</span>
                      <span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800">
                        靶向: {maxWeight}px 粗度
                      </span>
                    </div>

                    <div className="text-xs font-bold font-serif text-zinc-900 dark:text-zinc-100 mt-1">
                      {target.name}
                    </div>

                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">
                      {target.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* TIER 4: Therapeutic Outcomes */}
            <div className="space-y-3">
              {ALL_OUTCOMES.filter((outcome) =>
                currentFormula.pairs.some((p) => p.outcomeIds.includes(outcome.id))
              ).map((outcome) => {
                const connectingPairs = currentFormula.pairs.filter((p) => p.outcomeIds.includes(outcome.id));
                const isHighlighted = connectingPairs.some((p) => p.pairId === hoveredPairId);

                return (
                  <div
                    key={outcome.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isHighlighted
                        ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 shadow-md scale-102 ring-2 ring-emerald-400'
                        : 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/60'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold">
                      🏆 {outcome.category}
                    </div>

                    <div className="text-xs font-black font-serif text-emerald-950 dark:text-emerald-100 mt-0.5">
                      {outcome.name}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* DETAILED INSPECTION DRAWER / EXPLANATION FOOTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-[#fffdfa] dark:bg-[#181614] border border-[#ebdcc8] dark:border-[#38322c] rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-amber-800 dark:text-amber-300 font-serif flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-600" />
            连线粗细与药效权重解构
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            在伤寒经方中，增加重剂药物（如桂枝加葛根汤重用葛根四两、大柴胡汤重用枳实四两）会使该药对连线粗细大幅增加（8~10px），直击微观组织靶点，形成主导治疗通路。
          </p>
        </div>

        <div className="bg-[#f0fdf4] dark:bg-[#0c2415] border border-[#bbf7d0] dark:border-[#14532d] rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-serif flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            加减法性（随证加减）
          </div>
          <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            加药（如加厚朴杏子治喘）拓展了靶器官范围；去药（如去芍药消除降阴）切断了反向抑制通路，使心胸阳气得以爆发宣通。
          </p>
        </div>

        <div className="bg-[#eff6ff] dark:bg-[#1e293b] border border-[#bfdbfe] dark:border-[#1e3a8a] rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-blue-800 dark:text-blue-300 font-serif flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-600" />
            现代物理中医启示
          </div>
          <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            经方的方药加减并非零散凑方，而是严密的物理流体力学与神经网络调控公式，通过剂量权重的增减实现对人体微循环与能量流动的精准引导。
          </p>
        </div>
      </div>

    </div>
  );
}
