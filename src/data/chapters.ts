/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chapter, LevelGate } from '../types';

export const CHAPTERS: Chapter[] = [
  {
    id: 'ch1',
    number: 1,
    title: '第1章 • 中医思维根基',
    subtitle: '从错误思维到经方正道',
    icon: 'Sprout',
    color: 'emerald',
    bgColor: 'bg-emerald-500',
    gates: [
      {
        id: 'g1_1',
        chapterId: 'ch1',
        title: '错误的传统思维',
        subtitle: '5卡 • 7题',
        topics: ['T1_1'],
        unlocked: true,
        completed: false
      },
      {
        id: 'g1_2',
        chapterId: 'ch1',
        title: '正确的中医思维',
        subtitle: '5卡 • 7题',
        topics: ['T1_2'],
        unlocked: false,
        completed: false
      }
    ]
  },
  {
    id: 'ch2',
    number: 2,
    title: '第2章 • 八纲辨证详解',
    subtitle: '阴阳表里寒热虚实的临床应用',
    icon: 'Scale',
    color: 'rose',
    bgColor: 'bg-rose-500',
    gates: [
      {
        id: 'g2_1',
        chapterId: 'ch2',
        title: '阴阳与表里',
        subtitle: '5卡 • 7题',
        topics: ['T2_1'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g2_2',
        chapterId: 'ch2',
        title: '虚实与寒热',
        subtitle: '5卡 • 7题',
        topics: ['T2_2'],
        unlocked: false,
        completed: false
      }
    ]
  },
  {
    id: 'ch3',
    number: 3,
    title: '第3章 • 人体内景：气血精津液',
    subtitle: '中医对人体运行规律的客观认识',
    icon: 'HeartPulse',
    color: 'amber',
    bgColor: 'bg-amber-600',
    gates: [
      {
        id: 'g3_1',
        chapterId: 'ch3',
        title: '气血精的定义与生成',
        subtitle: '5卡 • 7题',
        topics: ['T3_1'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g3_2',
        chapterId: 'ch3',
        title: '津液代谢与三焦玄府',
        subtitle: '5卡 • 7题',
        topics: ['T3_2'],
        unlocked: false,
        completed: false
      }
    ]
  },
  {
    id: 'ch4',
    number: 4,
    title: '第4章 • 六经体系与太阳病',
    subtitle: '六病定义与太阳病方剂',
    icon: 'Sun',
    color: 'orange',
    bgColor: 'bg-orange-500',
    gates: [
      {
        id: 'g4_1',
        chapterId: 'ch4',
        title: '六病定义与太阳病',
        subtitle: '5卡 • 7题',
        topics: ['T4_1'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g4_2',
        chapterId: 'ch4',
        title: '太阳经典经方',
        subtitle: '5卡 • 7题',
        topics: ['T4_2'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g4_3',
        chapterId: 'ch4',
        title: '太阳变证与水血案例',
        subtitle: '5卡 • 7题',
        topics: ['T4_3'],
        unlocked: false,
        completed: false
      }
    ]
  },
  {
    id: 'ch5',
    number: 5,
    title: '第5章 • 经方详解：阳明少阳与三阴',
    subtitle: '白虎承气柴胡四逆的临床应用',
    icon: 'Pill',
    color: 'yellow',
    bgColor: 'bg-yellow-600',
    gates: [
      {
        id: 'g5_1',
        chapterId: 'ch5',
        title: '阳明与少阳病方剂',
        subtitle: '5卡 • 7题',
        topics: ['T5_1'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g5_2',
        chapterId: 'ch5',
        title: '少阳枢机与变证方',
        subtitle: '5卡 • 7题',
        topics: ['T5_2'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g5_3',
        chapterId: 'ch5',
        title: '三阴病（太阴少阴）剖析',
        subtitle: '5卡 • 7题',
        topics: ['T5_3'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g5_4',
        chapterId: 'ch5',
        title: '厥阴病与寒热错杂案例',
        subtitle: '5卡 • 7题',
        topics: ['T5_4'],
        unlocked: false,
        completed: false
      }
    ]
  },
  {
    id: 'ch6',
    number: 6,
    title: '第6章 • 临床问诊与辨证用药',
    subtitle: '从症状到内景到用药',
    icon: 'Stethoscope',
    color: 'sky',
    bgColor: 'bg-sky-600',
    gates: [
      {
        id: 'g6_1',
        chapterId: 'ch6',
        title: '问诊要点与辨证用药',
        subtitle: '5卡 • 7题',
        topics: ['T6_1'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g6_2',
        chapterId: 'ch6',
        title: '腹诊方法与五步思维链',
        subtitle: '5卡 • 7题',
        topics: ['T6_2'],
        unlocked: false,
        completed: false
      }
    ]
  },
  {
    id: 'ch7',
    number: 7,
    title: '第7章 • 巧良医经验方剂',
    subtitle: '白片黑片湿疹汤通血散等',
    icon: 'Container',
    color: 'amber',
    bgColor: 'bg-amber-800',
    gates: [
      {
        id: 'g7_1',
        chapterId: 'ch7',
        title: '白片与黑片：昼夜调方',
        subtitle: '5卡 • 7题',
        topics: ['T7_1'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g7_2',
        chapterId: 'ch7',
        title: '巧良医专病经验方',
        subtitle: '5卡 • 7题',
        topics: ['T7_2'],
        unlocked: false,
        completed: false
      }
    ]
  },
  {
    id: 'ch8',
    number: 8,
    title: '第8章 • 临床病例实战',
    subtitle: '从症状到方剂的真实案例',
    icon: 'ClipboardList',
    color: 'purple',
    bgColor: 'bg-purple-600',
    gates: [
      {
        id: 'g8_1',
        chapterId: 'ch8',
        title: '疑难病内景分析',
        subtitle: '5卡 • 7题',
        topics: ['T8_1'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g8_2',
        chapterId: 'ch8',
        title: '真实病例分析',
        subtitle: '5卡 • 7题',
        topics: ['T8_2'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g8_3',
        chapterId: 'ch8',
        title: '六经辨证疑难案例链',
        subtitle: '5卡 • 7题',
        topics: ['T8_3'],
        unlocked: false,
        completed: false
      }
    ]
  },
  {
    id: 'ch9',
    number: 9,
    title: '第9章 • 六经辨证细微病机与临床案证（深度图谱）',
    subtitle: '六经精微病理、经方演变与20大经典临床案例深度全解',
    icon: 'Layers',
    color: 'emerald',
    bgColor: 'bg-emerald-600',
    gates: [
      {
        id: 'g9_1',
        chapterId: 'ch9',
        title: '太阳篇：风寒水血与玄府气化',
        subtitle: '5卡 • 5案',
        topics: ['T_LIUJING_1', 'T_LIUJING_2', 'T_LIUJING_3', 'T_LIUJING_4', 'T_LIUJING_5'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g9_2',
        chapterId: 'ch9',
        title: '阳明篇：燥热实结与湿热津亏',
        subtitle: '4卡 • 4案',
        topics: ['T_LIUJING_6', 'T_LIUJING_7', 'T_LIUJING_8', 'T_LIUJING_9'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g9_3',
        chapterId: 'ch9',
        title: '少阳太阴篇：膜系枢机与脾虚水湿',
        subtitle: '5卡 • 5案',
        topics: ['T_LIUJING_10', 'T_LIUJING_11', 'T_LIUJING_12', 'T_LIUJING_13', 'T_LIUJING_14'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g9_4',
        chapterId: 'ch9',
        title: '少阴厥阴篇：真寒假热与寒热错杂',
        subtitle: '6卡 • 6案',
        topics: ['T_LIUJING_15', 'T_LIUJING_16', 'T_LIUJING_17', 'T_LIUJING_18', 'T_LIUJING_19', 'T_LIUJING_20'],
        unlocked: false,
        completed: false
      }
    ]
  },
  {
    id: 'ch10',
    number: 10,
    title: '第10章 • 感冒经方诊疗与公益课讲义精要',
    subtitle: '《中医经方治疗感冒简易应用版》与巧良医公益课最新研讨',
    icon: 'Thermometer',
    color: 'amber',
    bgColor: 'bg-amber-600',
    gates: [
      {
        id: 'g10_1',
        chapterId: 'ch10',
        title: '感冒经方三阶决策与加减法',
        subtitle: '3卡 • 2题',
        topics: ['T10_1'],
        unlocked: false,
        completed: false
      },
      {
        id: 'g10_2',
        chapterId: 'ch10',
        title: '公益课内景精要与临床八维',
        subtitle: '2卡 • 2题',
        topics: ['T10_2'],
        unlocked: false,
        completed: false
      }
    ]
  }
];

export const LEVEL_GATES: LevelGate[] = CHAPTERS.flatMap(ch => ch.gates);
