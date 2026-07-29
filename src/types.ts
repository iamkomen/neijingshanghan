/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  type: 'multiple-choice' | 'match-columns' | 'sort-flow' | 'fill-blank';
  conceptId: string; // Linking to a specific clause or inner landscape point
  question: string;
  options: string[]; // For multiple choice or source columns
  answer: string;    // Correct option, or matched index mapping, or sorted string list
  explanation: string;
  clauseId?: string; // Optional Shanghan clause reference (e.g. "第1条")
  patientCase?: {
    symptoms: string;
    pulse: string;
    tongue: string;
  };
}

export interface Clause {
  id: string; // "C1", "C2" etc.
  clauseNum: string; // "第一条"
  originalText: string; // "太阳之为病，脉浮、头项强痛而恶寒。"
  innerLandscape: string; // Inner Landscape explanation
  keyHerbMechanisms?: Array<{ herb: string; mechanism: string; action: string }>;
  formulaName?: string;
  formulaComposition?: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  channel: string;               // 关联六经 (如: 太阳病, 阳明病, 少阳病)
  chiefComplaint: string;         // 主诉
  patternIdentification: string;  // 辨证思路
  formulaSelection: string;       // 方剂选择
  modernMechanism: string;        // 现代机理解析
  formulaComposition?: string;    // 方剂组成 (选填)
  sourceClause?: string;          // 伤寒论出处条文 (选填)
}

export interface Topic {
  id: string; // "T1" etc.
  title: string;
  subtitle: string;
  stageId: string; // "S1" for Taiyang, etc.
  icon: string; // Name of lucide-react icon
  clauses: Clause[];
  lessons: {
    id: string;
    title: string;
    content: string; // Markdown explanation
    illustrations?: {
      title: string;
      diagramType: 'xuanfu' | 'circulation' | 'pig' | 'water' | 'rat';
      description: string;
    }[];
    clinicalCases?: ClinicalCase[];
  }[];
  clinicalCases?: ClinicalCase[];
  practiceQuestions: Question[];
  examQuestions: Question[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgColor: string;
  gates: LevelGate[];
}

export interface LevelGate {
  id: string; // e.g. "g1_1"
  chapterId: string; // e.g. "ch1"
  title: string; // e.g. "错误的传统思维"
  subtitle: string; // e.g. "4卡 • 15题"
  topics: string[]; // List of topic IDs in this level
  unlocked: boolean;
  completed: boolean;
}

export interface UserState {
  name?: string;
  unlockedLevels: string[]; // List of gate IDs unlocked
  completedLessons: string[]; // List of lesson/topic IDs completed
  scores?: Record<string, number>; // examId -> highest percentage score
  hearts: number; // Max 5, loses 1 per wrong answer
  lastHeartRestore?: string; // Date string
  streak: number; // Learning streak in days
  lastActiveDate?: string; // YYYY-MM-DD
}

export interface MatchColumn {
  left: string;
  right: string;
}
