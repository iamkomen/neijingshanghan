/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, HelpCircle, 
  RefreshCw, Zap, Sparkles, BookOpenCheck, ChevronLeft, BookOpen, 
  Lightbulb, ShieldAlert, Key, Stethoscope, FileText, Bookmark, RotateCw, Filter, Layers, Tag, Brain
} from 'lucide-react';
import { Topic, Question, ClinicalCase, Clause } from '../types';
import { CLINICAL_CASES_20 } from '../data/lessons';
import TCMDiagram from './TCMDiagram';
import { saveWrongQuestion } from '../utils/wrongQuestions';

interface LessonModalProps {
  topic: Topic;
  onClose: () => void;
  onComplete: () => void;
}

// Subcomponent: Inner Landscape Deconstruction & Pathological Mapping Card with Contrast Color Blocks
function InnerLandscapeMappingCard({
  topicTitle,
  lessonTitle,
  clauses,
  lessonContent
}: {
  topicTitle: string;
  lessonTitle: string;
  clauses: Clause[];
  lessonContent: string;
}) {
  const activeClause = clauses && clauses.length > 0 ? clauses[0] : null;

  return (
    <div className="my-4 border-2 border-[#0d5d56] dark:border-[#14b8a6] rounded-2xl p-4 sm:p-5 space-y-4 bg-[#f0f7f7]/90 dark:bg-[#0f282a]/90 shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#c2f0ec] dark:border-[#134e4a]">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-[#0d5d56] text-white flex items-center gap-1 font-mono shadow-2xs">
            <Brain className="w-3.5 h-3.5 text-[#5eead4]" />
            内景深度解析
          </span>
          <h4 className="text-sm sm:text-base font-extrabold text-[#042f2e] dark:text-[#ccfbf1] font-serif">
            《伤寒论》原文 ↔ 生理病机拆解映射图谱
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold bg-[#c2f0ec] dark:bg-[#134e4a] text-[#0d5d56] dark:text-[#5eead4] px-2.5 py-0.5 rounded-full border border-[#0d5d56]/30">
          对比色块 · 病理转变全景
        </span>
      </div>

      {/* 1. 原文拆解 ↔ 生理病机 视觉映射矩阵 */}
      {activeClause ? (
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#0d5d56] dark:text-[#5eead4] font-serif flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#0d5d56]" />
            <span>【原文句段 ↔ 客观生理病机 拆解映射】</span>
          </div>

          <div className="bg-[#fffcf7] dark:bg-[#1a1715] rounded-xl border border-[#0d5d56]/30 dark:border-[#14b8a6]/30 overflow-hidden shadow-2xs">
            <div className="bg-[#0d5d56] text-white p-2.5 text-[11px] font-bold font-mono grid grid-cols-12 gap-2">
              <span className="col-span-4 sm:col-span-3">《伤寒论》原文句段</span>
              <span className="col-span-8 sm:col-span-9">客观生理病机 / 内景流体拆解</span>
            </div>

            <div className="p-3 space-y-2.5 text-xs">
              <div className="grid grid-cols-12 gap-2 items-center border-b border-[#e2d8c7]/60 dark:border-[#38322c]/60 pb-2">
                <div className="col-span-12 sm:col-span-3 font-serif font-bold text-[#b91c1c] dark:text-[#ef4444] bg-[#fee2e2] dark:bg-[#7f1d1d]/40 p-2 rounded-lg border border-[#fca5a5] dark:border-[#dc2626]">
                  「 {activeClause.clauseNum}: {activeClause.originalText} 」
                </div>
                <div className="col-span-12 sm:col-span-9 text-[#292524] dark:text-[#e7e5e4] font-medium leading-relaxed bg-[#f5f0e6]/60 dark:bg-[#2e2a25]/60 p-2 rounded-lg border border-[#e2d8c7] dark:border-[#443e37]">
                  <strong className="text-[#0d5d56] dark:text-[#5eead4]">【内景生理拆解】</strong>{activeClause.innerLandscape}
                </div>
              </div>

              {activeClause.formulaName && (
                <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono text-[#0d5d56] dark:text-[#5eead4] bg-[#c2f0ec]/40 dark:bg-[#134e4a]/40 p-2 rounded-lg">
                  <span>核心对应经方: <strong>{activeClause.formulaName}</strong></span>
                  {activeClause.formulaComposition && <span>配伍: {activeClause.formulaComposition}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#fffcf7] dark:bg-[#1a1715] p-3.5 rounded-xl border border-[#0d5d56]/20 text-xs leading-relaxed text-[#292524] dark:text-[#e7e5e4]">
          <strong className="text-[#0d5d56] dark:text-[#5eead4] block mb-1">【经方内景拆解】</strong>
          {lessonTitle}：解构《伤寒论》人体客观物理气化，以细胞与微循环视域还原方证病机。
        </div>
      )}

      {/* 2. 对比色块展示病理转变过程 */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-[#0d5d56] dark:text-[#5eead4] font-serif flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[#0d5d56]" />
          <span>【病理转变过程 · 三阶对比色块演化图谱】</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 色块 1: 常态生理基准 (Emerald / Teal) */}
          <div className="bg-[#ecfdf5] dark:bg-[#064e3b]/40 border-l-4 border-[#10b981] rounded-r-xl rounded-l-xs p-3.5 space-y-1.5 border border-[#a7f3d0]/60 dark:border-[#047857]/60 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-[#10b981] text-white text-[10px] font-extrabold font-mono">
                阶段一：常态生理
              </span>
              <span className="text-[10px] font-mono text-[#047857] dark:text-[#34d399] font-bold">气血平衡</span>
            </div>
            <p className="text-xs text-[#065f46] dark:text-[#d1fae5] leading-relaxed font-medium pt-1">
              玄府毛窍通畅，卫气固密于表，营血循行脉中，三焦津液升降出入顺畅，体温与水液代谢维持恒定。
            </p>
          </div>

          {/* 色块 2: 病理突变与邪正相搏 (Cinnabar / Flame Red) */}
          <div className="bg-[#fef2f2] dark:bg-[#7f1d1d]/40 border-l-4 border-[#ef4444] rounded-r-xl rounded-l-xs p-3.5 space-y-1.5 border border-[#fecdd3]/60 dark:border-[#b91c1c]/60 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-[#ef4444] text-white text-[10px] font-extrabold font-mono">
                阶段二：病理突变
              </span>
              <span className="text-[10px] font-mono text-[#b91c1c] dark:text-[#fca5a5] font-bold">外邪侵袭</span>
            </div>
            <p className="text-xs text-[#9f1239] dark:text-[#ffe4e6] leading-relaxed font-medium pt-1">
              寒邪/热邪骤至，表层微血管剧烈痉挛，玄府汗孔郁闭或不固，津液流体郁遏阻滞，引发发热、恶寒、疼痛等急症。
            </p>
          </div>

          {/* 色块 3: 传变转归与经方解法 (Royal Violet / Imperial Purple) */}
          <div className="bg-[#f3e8ff] dark:bg-[#581c87]/40 border-l-4 border-[#a855f7] rounded-r-xl rounded-l-xs p-3.5 space-y-1.5 border border-[#e9d5ff]/60 dark:border-[#7e22ce]/60 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-[#a855f7] text-white text-[10px] font-extrabold font-mono">
                阶段三：传变与解法
              </span>
              <span className="text-[10px] font-mono text-[#6b21a8] dark:text-[#e9d5ff] font-bold">经方逆转</span>
            </div>
            <p className="text-xs text-[#581c87] dark:text-[#f3e8ff] leading-relaxed font-medium pt-1">
              若未及时疏解，表邪可入里化热（传阳明）、转入枢机（传少阳）或直中虚寒（传太阴少阴）。经方通过开玄府、调营卫、温中阳直击病理源头。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponent: Differentiated 4-Color Block Clinical Case Renderer
function ClinicalCaseCard({ caseData }: { caseData: ClinicalCase; key?: React.Key }) {
  return (
    <div className="my-4 border border-[#ebdcc8] dark:border-[#38322c] rounded-2xl p-4 sm:p-5 space-y-3 bg-[#fffcf7] dark:bg-[#1a1715] shadow-xs">
      {/* Case Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#ebdcc8] dark:border-[#38322c]">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#b45309] text-white font-mono shadow-2xs">
            {caseData.channel}
          </span>
          <h4 className="text-sm sm:text-base font-bold text-[#1c1917] dark:text-[#f5f5f4] font-serif">
            {caseData.title}
          </h4>
        </div>
        {caseData.sourceClause && (
          <span className="text-[10px] font-mono text-[#a16207] dark:text-[#fde047] bg-[#fef9c3] dark:bg-[#713f12] px-2 py-0.5 rounded-md border border-[#fef08a] dark:border-[#a16207]">
            {caseData.sourceClause}
          </span>
        )}
      </div>

      {/* Grid of 4 Differentiated Color Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Block 1: 主诉 (Ochre / Warm Amber) */}
        <div className="bg-[#fdf8ee] dark:bg-[#2a1d12] border-l-4 border-[#b45309] dark:border-[#f59e0b] rounded-r-xl rounded-l-xs p-3.5 space-y-1.5 border border-[#fde68a]/60 dark:border-[#78350f]/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-[#b45309] text-white text-[10px] font-bold font-mono flex items-center gap-1">
              <Stethoscope className="w-3 h-3" />
              主诉诊察
            </span>
            <span className="text-[10px] font-mono text-[#78350f] dark:text-[#fde68a] font-semibold">临床现症</span>
          </div>
          <p className="text-xs text-[#78350f] dark:text-[#fef3c7] leading-relaxed font-medium pt-1">
            {caseData.chiefComplaint}
          </p>
        </div>

        {/* Block 2: 辨证思路 (Cinnabar Red) */}
        <div className="bg-[#faf2f2] dark:bg-[#2d1515] border-l-4 border-[#b91c1c] dark:border-[#ef4444] rounded-r-xl rounded-l-xs p-3.5 space-y-1.5 border border-[#f5d0d0]/60 dark:border-[#4a1d1d]/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-[#b91c1c] text-white text-[10px] font-bold font-mono flex items-center gap-1">
              <Brain className="w-3 h-3" />
              辨证思路
            </span>
            <span className="text-[10px] font-mono text-[#881337] dark:text-[#fca5a5] font-semibold">病机决断</span>
          </div>
          <p className="text-xs text-[#701a1a] dark:text-[#fecdd3] leading-relaxed font-medium pt-1 font-serif">
            {caseData.patternIdentification}
          </p>
        </div>

        {/* Block 3: 方剂选择 (Imperial Purple) */}
        <div className="bg-[#f8f5fa] dark:bg-[#241733] border-l-4 border-[#7e22ce] dark:border-[#c084fc] rounded-r-xl rounded-l-xs p-3.5 space-y-1.5 border border-[#e9d5ff]/60 dark:border-[#581c87]/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-[#7e22ce] text-white text-[10px] font-bold font-mono flex items-center gap-1">
              <Key className="w-3 h-3" />
              方剂选择
            </span>
            <span className="text-[10px] font-mono text-[#581c87] dark:text-[#f3e8ff] font-semibold">经方投用</span>
          </div>
          <p className="text-xs text-[#581c87] dark:text-[#f3e8ff] leading-relaxed font-bold pt-1">
            {caseData.formulaSelection}
          </p>
          {caseData.formulaComposition && (
            <p className="text-[11px] font-mono text-[#6b21a8] dark:text-[#e9d5ff] bg-white/60 dark:bg-black/30 p-1.5 rounded border border-[#c084fc]/30 mt-1">
              配伍: {caseData.formulaComposition}
            </p>
          )}
        </div>

        {/* Block 4: 现代机理解析 (Dai Teal / Emerald) */}
        <div className="bg-[#f0f7f7] dark:bg-[#0f282a] border-l-4 border-[#0d5d56] dark:border-[#14b8a6] rounded-r-xl rounded-l-xs p-3.5 space-y-1.5 border border-[#c2f0ec]/60 dark:border-[#134e4a]/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-[#0d5d56] text-white text-[10px] font-bold font-mono flex items-center gap-1">
              <Zap className="w-3 h-3" />
              现代机理解析
            </span>
            <span className="text-[10px] font-mono text-[#042f2e] dark:text-[#99f6e4] font-semibold">病理学内景</span>
          </div>
          <p className="text-xs text-[#115e59] dark:text-[#ccfbf1] leading-relaxed font-medium pt-1">
            {caseData.modernMechanism}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LessonModal({ topic, onClose, onComplete }: LessonModalProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 to lessons.length - 1 is learning; then quiz
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsAnswerCorrect] = useState(false);

  // 3D Card Flip & Navigation States
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'yuanwen' | 'neijing' | 'baihua' | 'anli' | 'koujue' | 'jinji'>('all');
  const [animatingDir, setAnimatingDir] = useState<'next' | 'prev' | null>(null);

  // Interactive Physiology Physics Simulator States
  const [physioCold, setPhysioCold] = useState<number>(65); // 0-100 表寒程度
  const [physioFluid, setPhysioFluid] = useState<number>(50); // 0-100 津液血行
  const [physioStomach, setPhysioStomach] = useState<number>(75); // 0-100 胃气能量

  const getPhysioAnalysis = () => {
    if (physioCold > 75 && physioFluid < 40) {
      return {
        syndrome: '太阳伤寒表实证（无汗身痛喘急）',
        formula: '麻黄汤（开表宣肺、强心发汗）',
        physics: '外寒极盛导致皮肤微血管强烈痉挛闭塞，汗腺毛孔完全紧闭，水液迫返于内导致胸满喘急、骨节剧痛。',
        pulse: '脉浮紧（流体压力极高、血管壁张力绷紧）'
      };
    } else if (physioCold > 50 && physioFluid >= 40) {
      return {
        syndrome: '太阳中风表虚证（发热汗出恶风）',
        formula: '桂枝汤（调和营卫、扩张微血管与静脉回流）',
        physics: '卫气抗邪于表，汗腺持续渗出津液，动脉过度扩张而静脉回流不足，导致营卫失调、体温失守。',
        pulse: '脉浮缓（脉象浮于表面但无强烈紧张感）'
      };
    } else if (physioStomach < 40) {
      return {
        syndrome: '太阴/少阴虚寒证（下焦清冷、胃气衰败）',
        formula: '理中汤 / 四逆汤（温中回阳、强心破阴）',
        physics: '中焦脾胃蒸腾热能衰竭，下焦水液无法温化气化，导致阴寒内盛、水分潴留、虚阳浮越。',
        pulse: '脉沉细微（心泵动力严重不足、血行迟缓）'
      };
    } else {
      return {
        syndrome: '少阳枢机不利证（寒热往来、胸胁苦满）',
        formula: '小柴胡汤（和解少阳、通达三焦与胆道流体）',
        physics: '病在半表半里，三焦淋巴与微血管气机阻滞，枢机不转导致寒热往来与胃气上逆。',
        pulse: '脉弦（肝胆三焦管道紧张度高，呈琴弦感）'
      };
    }
  };

  const totalLessons = topic.lessons.length;
  const quizQuestions = topic.practiceQuestions;

  const handleNextStep = () => {
    setIsFlipped(false);
    setSelectedCategory('all');
    if (currentStep < totalLessons - 1) {
      setAnimatingDir('next');
      setTimeout(() => setAnimatingDir(null), 500);
      setCurrentStep(currentStep + 1);
    } else {
      setQuizStarted(true);
    }
  };

  const handlePrevStep = () => {
    setIsFlipped(false);
    setSelectedCategory('all');
    if (quizStarted) {
      if (currentQuizIdx > 0) {
        setCurrentQuizIdx(currentQuizIdx - 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      } else {
        setQuizStarted(false);
      }
    } else if (currentStep > 0) {
      setAnimatingDir('prev');
      setTimeout(() => setAnimatingDir(null), 500);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    const currentQuestion = quizQuestions[currentQuizIdx];
    const correct = selectedOption === currentQuestion.answer;
    setIsAnswerCorrect(correct);
    setIsAnswerChecked(true);

    if (!correct) {
      saveWrongQuestion({
        id: currentQuestion.id || `pq_${Date.now()}`,
        topicTitle: topic.title,
        question: currentQuestion.question,
        options: currentQuestion.options,
        answer: currentQuestion.answer,
        explanation: currentQuestion.explanation,
        errorAttribution: currentQuestion.errorAttribution || `误选“${selectedOption}”，混淆了该考点在内景物理、玄府开阖或脏腑气化上的作用机理。`,
        userAnswer: selectedOption
      });
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    if (currentQuizIdx < quizQuestions.length - 1) {
      setCurrentQuizIdx(currentQuizIdx + 1);
    } else {
      onComplete();
    }
  };

  const currentLesson = topic.lessons[currentStep];
  const totalDots = totalLessons + (quizQuestions.length > 0 ? 1 : 0);

  /**
   * Utility to parse markdown bold tags (**text**), strip raw asterisks,
   * and convert key terms into high-contrast highlighted tag badges in New Chinese color palettes.
   */
  const renderFormattedMarkdown = (
    text: string, 
    themeColor: 'cinnabar' | 'teal' | 'amber' | 'purple' | 'rose' | 'blue' | 'zinc' = 'zinc'
  ): React.ReactNode => {
    if (!text) return null;

    // Clean leading/trailing markdown bullet characters
    const cleanText = text.replace(/^[-*•]\s+/, '').trim();

    // Split text by markdown bold tags **...**
    const parts = cleanText.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2).trim();

        if (themeColor === 'cinnabar') {
          return (
            <strong key={idx} className="font-extrabold text-[#701a1a] dark:text-[#fecdd3] bg-[#fee2e2] dark:bg-[#881337]/80 px-1.5 py-0.5 rounded-md mx-0.5 border border-[#fca5a5] dark:border-[#be123c] inline-block text-xs sm:text-sm shadow-2xs">
              {content}
            </strong>
          );
        }
        if (themeColor === 'teal') {
          return (
            <strong key={idx} className="font-extrabold text-[#042f2e] dark:text-[#ccfbf1] bg-[#ccfbf1] dark:bg-[#115e59]/80 px-1.5 py-0.5 rounded-md mx-0.5 border border-[#5eead4] dark:border-[#0d9488] inline-block text-xs sm:text-sm shadow-2xs">
              {content}
            </strong>
          );
        }
        if (themeColor === 'blue') {
          return (
            <strong key={idx} className="font-extrabold text-[#1e40af] dark:text-[#dbeafe] bg-[#dbeafe] dark:bg-[#1e3a8a]/80 px-1.5 py-0.5 rounded-md mx-0.5 border border-[#bfdbfe] dark:border-[#1d4ed8] inline-block text-xs sm:text-sm shadow-2xs">
              {content}
            </strong>
          );
        }
        if (themeColor === 'amber') {
          return (
            <strong key={idx} className="font-extrabold text-[#78350f] dark:text-[#fef3c7] bg-[#fef3c7] dark:bg-[#78350f]/80 px-1.5 py-0.5 rounded-md mx-0.5 border border-[#fde68a] dark:border-[#b45309] inline-block text-xs sm:text-sm shadow-2xs">
              {content}
            </strong>
          );
        }
        if (themeColor === 'purple') {
          return (
            <strong key={idx} className="font-extrabold text-[#581c87] dark:text-[#f3e8ff] bg-[#f3e8ff] dark:bg-[#6b21a8]/80 px-1.5 py-0.5 rounded-md mx-0.5 border border-[#e9d5ff] dark:border-[#7e22ce] inline-block text-xs sm:text-sm shadow-2xs">
              {content}
            </strong>
          );
        }
        if (themeColor === 'rose') {
          return (
            <strong key={idx} className="font-extrabold text-[#881337] dark:text-[#ffe4e6] bg-[#ffe4e6] dark:bg-[#9f1239]/80 px-1.5 py-0.5 rounded-md mx-0.5 border border-[#fecdd3] dark:border-[#e11d48] inline-block text-xs sm:text-sm shadow-2xs">
              {content}
            </strong>
          );
        }

        // Standard Xuan Paper / Stone badge
        return (
          <strong key={idx} className="font-extrabold text-[#44382a] dark:text-[#f5f5f4] bg-[#e7dfd3] dark:bg-[#44403c] px-1.5 py-0.5 rounded-md mx-0.5 border border-[#d6cbba] dark:border-[#57534e] inline-block text-xs sm:text-sm">
            {content}
          </strong>
        );
      }

      return part;
    });
  };

  /**
   * Helper function to render text blocks with distinct color blocks (新中式色块区隔),
   * strictly grouping content into:
   * 1. 📜 【原文 / 经典依据】 - 朱砂红 (Cinnabar Red)
   * 2. 💡 【白话解读 / 物理内景】 - 黛青 (Dai Cyan / Indigo)
   * 3. 📋 【临床案例 / 病机剖析】 - 赭石 / 琥珀 (Ocher / Amber)
   * 4. 🔑 【记忆口诀 / 经方歌诀】 - 紫檀 / 墨香 (Imperial Purple)
   * 5. ⚠️ 【易错点与临床禁忌】 - 朱红 (Cinnabar Warning)
   */
  const renderCardBlock = (blockText: string, blockIdx: number) => {
    const trim = blockText.trim();
    if (!trim) return null;

    // Heading 3: "### Title"
    if (trim.startsWith('### ')) {
      const headingText = trim.replace('### ', '');
      return (
        <h4 key={blockIdx} className="text-sm sm:text-base font-extrabold text-[#292524] dark:text-[#f5f5f4] flex items-center gap-2 pt-3 pb-2 border-b border-[#e7dfd3] dark:border-[#38322c]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shrink-0"></span>
          <span>{renderFormattedMarkdown(headingText, 'zinc')}</span>
        </h4>
      );
    }

    // Heading 2: "## Title"
    if (trim.startsWith('## ')) {
      const headingText = trim.replace('## ', '');
      return (
        <h3 key={blockIdx} className="text-base sm:text-lg font-bold text-[#1c1917] dark:text-[#fafaf9] pt-3 pb-1 border-b-2 border-[#10b981]">
          {renderFormattedMarkdown(headingText, 'zinc')}
        </h3>
      );
    }

    // BLOCKQUOTE / AMBER QUOTE BANNER: "> Quote text"
    if (trim.startsWith('>')) {
      const cleanQuote = trim.replace(/^>\s*/, '');
      return (
        <div key={blockIdx} className="bg-[#fffbeb] dark:bg-[#2b1e10] border-l-4 border-[#f59e0b] rounded-r-2xl rounded-l-xs p-4 text-sm sm:text-base font-bold text-[#b45309] dark:text-[#fde68a] my-3.5 shadow-2xs border border-[#fde68a]/60 dark:border-[#78350f]/80">
          {cleanQuote}
        </div>
      );
    }

    // COLOR BLOCK 1: 【原文 / 经典依据】 - 朱砂红 (Cinnabar Red)
    if (
      trim.includes('经典依据') || 
      trim.includes('理论来源') || 
      trim.includes('黄帝内经') || 
      trim.includes('素问') || 
      trim.includes('伤寒论') ||
      trim.includes('金匮要略') ||
      trim.startsWith('- **经典原文**') ||
      trim.startsWith('**经典原文**') ||
      trim.startsWith('- **理论来源**') ||
      trim.startsWith('**理论来源**') ||
      trim.startsWith('**经典依据**')
    ) {
      const cleaned = trim
        .replace(/^[-* ]*\*\*(理论来源|经典依据|原文|经典原文)\*\*[:：]?\s*/i, '')
        .replace(/^[-* ]*(理论来源|经典依据|原文|经典原文)[:：]?\s*/i, '')
        .replace(/^📖\s*/, '');

      return (
        <div key={blockIdx} className="bg-[#fffbeb] dark:bg-[#2b1e10] border-l-4 border-[#f59e0b] rounded-r-2xl rounded-l-xs p-4 text-xs md:text-sm space-y-1.5 my-3.5 shadow-2xs border border-[#fde68a]/60 dark:border-[#78350f]/80">
          <div className="flex items-center gap-1.5 text-[#b45309] dark:text-[#fde68a] font-bold text-xs tracking-wider">
            <span>📜 经典原文</span>
          </div>
          <div className="text-[#78350f] dark:text-[#fef3c7] font-serif leading-relaxed font-normal">
            {renderFormattedMarkdown(cleaned, 'amber')}
          </div>
        </div>
      );
    }

    // COLOR BLOCK 2: 【白话解读 / 物理内景 / 核心要点】
    if (
      trim.includes('白话解读') || 
      trim.includes('物理内景') || 
      trim.includes('理论通解') || 
      trim.includes('核心原理') || 
      trim.includes('核心定义') || 
      trim.includes('核心概念') ||
      trim.startsWith('- **核心要点**') || 
      trim.startsWith('**核心要点**') ||
      trim.startsWith('📌') ||
      trim.startsWith('💡')
    ) {
      const cleaned = trim
        .replace(/^[-* ]*\*\*(白话解读|物理内景|核心定义|核心要点|核心概念)\*\*[:：]?\s*/i, '')
        .replace(/^[-* ]*(白话解读|物理内景|核心定义|核心要点|核心概念)[:：]?\s*/i, '')
        .replace(/^[📌💡]\s*/, '');

      return (
        <div key={blockIdx} className="bg-[#ecfdf5] dark:bg-[#064e3b]/30 border-l-4 border-[#10b981] dark:border-[#34d399] rounded-r-2xl rounded-l-xs p-4 text-xs md:text-sm space-y-1 my-3.5 shadow-2xs border border-[#a7f3d0]/60 dark:border-[#047857]/40">
          <div className="flex items-center gap-1.5 text-[#047857] dark:text-[#34d399] font-bold text-xs tracking-wider font-serif">
            <span>核心要点</span>
          </div>
          <div className="text-[#065f46] dark:text-[#d1fae5] leading-relaxed font-normal">
            {renderFormattedMarkdown(cleaned, 'teal')}
          </div>
        </div>
      );
    }

    // COLOR BLOCK 3: 【举例 / 临床案例】
    if (
      trim.includes('临床案例') || 
      trim.includes('误辨案例') || 
      trim.includes('实战案例') || 
      trim.includes('案例分析') || 
      trim.includes('患者主诉') || 
      trim.startsWith('- **举例**') ||
      trim.startsWith('**举例**') ||
      trim.startsWith('- **案例**') ||
      trim.startsWith('**误辨案例**') ||
      trim.startsWith('📋')
    ) {
      const cleaned = trim
        .replace(/^[-* ]*\*\*(临床案例|误辨案例|实战案例|案例|举例)\*\*[:：]?\s*/i, '')
        .replace(/^[-* ]*(临床案例|误辨案例|实战案例|案例|举例)[:：]?\s*/i, '')
        .replace(/^📋\s*/, '');

      return (
        <div key={blockIdx} className="bg-[#eff6ff] dark:bg-[#1e3a8a]/30 border-l-4 border-[#3b82f6] dark:border-[#60a5fa] rounded-r-2xl rounded-l-xs p-4 text-xs md:text-sm space-y-1 my-3.5 shadow-2xs border border-[#bfdbfe]/60 dark:border-[#1d4ed8]/40">
          <div className="flex items-center gap-1.5 text-[#1d4ed8] dark:text-[#93c5fd] font-bold text-xs tracking-wider font-serif">
            <span>举例</span>
          </div>
          <div className="text-[#1e40af] dark:text-[#dbeafe] leading-relaxed font-normal">
            {renderFormattedMarkdown(cleaned, 'blue')}
          </div>
        </div>
      );
    }

    // COLOR BLOCK 4: 【记忆口诀】 - 黄金/琥珀
    if (
      trim.includes('记忆口诀') || 
      trim.includes('口诀') || 
      trim.includes('歌诀') || 
      trim.includes('方歌') || 
      trim.startsWith('- **记忆口诀**') || 
      trim.startsWith('**记忆口诀**') ||
      trim.startsWith('🔑')
    ) {
      const cleaned = trim
        .replace(/^[-* ]*\*\*(记忆口诀|口诀|歌诀|方歌)\*\*[:：]?\s*/i, '')
        .replace(/^[-* ]*(记忆口诀|口诀|歌诀|方歌)[:：]?\s*/i, '')
        .replace(/^🔑\s*/, '');

      return (
        <div key={blockIdx} className="bg-[#fffbeb] dark:bg-[#78350f]/30 border-l-4 border-[#f59e0b] dark:border-[#fbbf24] rounded-r-2xl rounded-l-xs p-4 text-xs md:text-sm space-y-1 my-3.5 shadow-2xs border border-[#fde68a]/60 dark:border-[#b45309]/40">
          <div className="flex items-center gap-1.5 text-[#b45309] dark:text-[#fde68a] font-bold text-xs tracking-wider font-serif">
            <span>记忆口诀</span>
          </div>
          <div className="text-[#78350f] dark:text-[#fef3c7] leading-relaxed font-normal">
            {renderFormattedMarkdown(cleaned, 'amber')}
          </div>
        </div>
      );
    }

    // COLOR BLOCK 5: 【易错点与临床禁忌】 - 玫瑰红 / 警告
    if (
      trim.includes('易错点') || 
      trim.includes('辨析禁忌') || 
      trim.includes('临床禁忌') || 
      trim.includes('急救警示') || 
      trim.startsWith('- **易错点**') || 
      trim.startsWith('**易错点**') ||
      trim.startsWith('⚠️') ||
      trim.startsWith('🚨')
    ) {
      const cleaned = trim
        .replace(/^[-* ]*\*\*(易错点|辨析禁忌|临床禁忌|急救警示)\*\*[:：]?\s*/i, '')
        .replace(/^[-* ]*(易错点|辨析禁忌|临床禁忌|急救警示)[:：]?\s*/i, '')
        .replace(/^[⚠️🚨]\s*/, '');

      return (
        <div key={blockIdx} className="bg-[#fef2f2] dark:bg-[#7f1d1d]/30 border-l-4 border-[#ef4444] dark:border-[#f87171] rounded-r-2xl rounded-l-xs p-4 text-xs md:text-sm space-y-1 my-3.5 shadow-2xs border border-[#fecdd3]/60 dark:border-[#b91c1c]/40">
          <div className="flex items-center gap-1.5 text-[#b91c1c] dark:text-[#fca5a5] font-bold text-xs tracking-wider font-serif">
            <span>易错点</span>
          </div>
          <div className="text-[#9f1239] dark:text-[#ffe4e6] leading-relaxed font-normal">
            {renderFormattedMarkdown(cleaned, 'rose')}
          </div>
        </div>
      );
    }

    // COLOR BLOCK 6: 【现代研究】 - 青翠 / Teal
    if (
      trim.includes('现代研究') || 
      trim.startsWith('- **现代研究**') || 
      trim.startsWith('**现代研究**') ||
      trim.startsWith('🔬')
    ) {
      const cleaned = trim
        .replace(/^[-* ]*\*\*现代研究\*\*[:：]?\s*/i, '')
        .replace(/^[-* ]*现代研究[:：]?\s*/i, '')
        .replace(/^🔬\s*/, '');

      return (
        <div key={blockIdx} className="bg-[#f0fdfa] dark:bg-[#134e4a]/30 border-l-4 border-[#14b8a6] dark:border-[#2dd4bf] rounded-r-2xl rounded-l-xs p-4 text-xs md:text-sm space-y-1 my-3.5 shadow-2xs border border-[#99f6e4]/60 dark:border-[#0d5d56]/40">
          <div className="flex items-center gap-1.5 text-[#0f766e] dark:text-[#2dd4bf] font-bold text-xs tracking-wider font-serif">
            <span>🔬 现代研究</span>
          </div>
          <div className="text-[#115e59] dark:text-[#ccfbf1] leading-relaxed font-normal">
            {renderFormattedMarkdown(cleaned, 'teal')}
          </div>
        </div>
      );
    }

    // Check if text has numbered items like "1. **同字不同意**：..."
    if (/^\d+\.\s+/.test(trim)) {
      const items = trim.split(/(?=\d+\.\s+)/);
      return (
        <div key={blockIdx} className="space-y-2.5 my-3">
          {items.map((it, idx) => {
            if (!it.trim()) return null;
            const cleanedItem = it.replace(/^\d+\.\s+/, '').trim();
            const numMatch = it.match(/^(\d+)\./);
            const numVal = numMatch ? numMatch[1] : (idx + 1).toString();

            return (
              <div 
                key={idx} 
                className="flex gap-3 items-start text-xs sm:text-sm text-[#374151] dark:text-[#e5e7eb] leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-[#dbeafe] text-[#2563eb] dark:bg-[#1e3a8a] dark:text-[#93c5fd] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-sans">
                  {numVal}
                </span>
                <div className="font-normal leading-relaxed flex-1">
                  {renderFormattedMarkdown(cleanedItem, 'zinc')}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Check if text contains bullet list lines starting with "* " or "- " or "• "
    if (/^\s*[*•-]\s+/m.test(trim)) {
      const lines = trim.split('\n');
      return (
        <div key={blockIdx} className="space-y-3 my-3">
          {lines.map((line, lIdx) => {
            const cleanLine = line.trim();
            if (!cleanLine) return null;

            if (/^[*•-]\s+/.test(cleanLine)) {
              const content = cleanLine.replace(/^[*•-]\s+/, '').trim();

              // Check if bullet line contains one of our key tags
              if (content.includes('核心要点') || content.startsWith('**核心要点**')) {
                const text = content.replace(/^.*?\*\*核心要点\*\*[:：]?\s*/, '').replace(/^.*?核心要点[:：]?\s*/, '');
                return (
                  <div key={lIdx} className="bg-[#ecfdf5] dark:bg-[#064e3b]/30 border-l-4 border-[#10b981] dark:border-[#34d399] rounded-r-2xl rounded-l-xs p-4 text-xs md:text-sm space-y-1 shadow-2xs border border-[#a7f3d0]/60 dark:border-[#047857]/40">
                    <div className="text-xs font-bold text-[#047857] dark:text-[#34d399] font-serif">核心要点</div>
                    <div className="text-xs sm:text-sm text-[#065f46] dark:text-[#d1fae5] leading-relaxed font-normal">{renderFormattedMarkdown(text, 'teal')}</div>
                  </div>
                );
              }

              if (content.includes('举例') || content.startsWith('**举例**')) {
                const text = content.replace(/^.*?\*\*举例\*\*[:：]?\s*/, '').replace(/^.*?举例[:：]?\s*/, '');
                return (
                  <div key={lIdx} className="bg-[#eff6ff] dark:bg-[#1e3a8a]/30 border-l-4 border-[#3b82f6] dark:border-[#60a5fa] rounded-r-2xl rounded-l-xs p-4 text-xs md:text-sm space-y-1 shadow-2xs border border-[#bfdbfe]/60 dark:border-[#1d4ed8]/40">
                    <div className="text-xs font-bold text-[#1d4ed8] dark:text-[#93c5fd] font-serif">举例</div>
                    <div className="text-xs sm:text-sm text-[#1e40af] dark:text-[#dbeafe] leading-relaxed font-normal">{renderFormattedMarkdown(text, 'blue')}</div>
                  </div>
                );
              }

              if (content.includes('易错点') || content.startsWith('**易错点**')) {
                const text = content.replace(/^.*?\*\*易错点\*\*[:：]?\s*/, '').replace(/^.*?易错点[:：]?\s*/, '');
                return (
                  <div key={lIdx} className="bg-[#fef2f2] dark:bg-[#7f1d1d]/30 border-l-4 border-[#ef4444] dark:border-[#f87171] rounded-r-2xl rounded-l-xs p-4 text-xs md:text-sm space-y-1 shadow-2xs border border-[#fecdd3]/60 dark:border-[#b91c1c]/40">
                    <div className="text-xs font-bold text-[#b91c1c] dark:text-[#fca5a5] font-serif">易错点</div>
                    <div className="text-xs sm:text-sm text-[#9f1239] dark:text-[#ffe4e6] leading-relaxed font-normal">{renderFormattedMarkdown(text, 'rose')}</div>
                  </div>
                );
              }

              if (content.includes('记忆口诀') || content.startsWith('**记忆口诀**')) {
                const text = content.replace(/^.*?\*\*记忆口诀\*\*[:：]?\s*/, '').replace(/^.*?记忆口诀[:：]?\s*/, '');
                return (
                  <div key={lIdx} className="bg-[#fffbeb] dark:bg-[#78350f]/30 border-l-4 border-[#f59e0b] dark:border-[#fbbf24] rounded-r-2xl rounded-l-xs p-4 text-xs md:text-sm space-y-1 shadow-2xs border border-[#fde68a]/60 dark:border-[#b45309]/40">
                    <div className="text-xs font-bold text-[#b45309] dark:text-[#fde68a] font-serif">记忆口诀</div>
                    <div className="text-xs sm:text-sm text-[#78350f] dark:text-[#fef3c7] leading-relaxed font-normal">{renderFormattedMarkdown(text, 'amber')}</div>
                  </div>
                );
              }

              if (content.includes('经典原文') || content.startsWith('**经典原文**')) {
                const text = content.replace(/^.*?\*\*经典原文\*\*[:：]?\s*/, '').replace(/^.*?经典原文[:：]?\s*/, '');
                return (
                  <div key={lIdx} className="bg-[#fffbeb] dark:bg-[#78350f]/30 border-l-4 border-[#f59e0b] dark:border-[#fbbf24] rounded-r-2xl rounded-l-xs p-4 text-xs md:text-sm space-y-1 shadow-2xs border border-[#fde68a]/60 dark:border-[#b45309]/40">
                    <div className="text-xs font-bold text-[#b45309] dark:text-[#fde68a] font-serif flex items-center gap-1.5">📜 经典原文</div>
                    <div className="text-xs sm:text-sm text-[#78350f] dark:text-[#fef3c7] leading-relaxed font-serif">{renderFormattedMarkdown(text, 'amber')}</div>
                  </div>
                );
              }

              if (content.includes('现代研究') || content.startsWith('**现代研究**')) {
                const text = content.replace(/^.*?\*\*现代研究\*\*[:：]?\s*/, '').replace(/^.*?现代研究[:：]?\s*/, '');
                return (
                  <div key={lIdx} className="bg-[#f0fdfa] dark:bg-[#134e4a]/30 border-l-4 border-[#14b8a6] dark:border-[#2dd4bf] rounded-r-2xl rounded-l-xs p-4 text-xs md:text-sm space-y-1 shadow-2xs border border-[#99f6e4]/60 dark:border-[#0d5d56]/40">
                    <div className="text-xs font-bold text-[#0f766e] dark:text-[#2dd4bf] font-serif flex items-center gap-1.5">🔬 现代研究</div>
                    <div className="text-xs sm:text-sm text-[#115e59] dark:text-[#ccfbf1] leading-relaxed font-normal">{renderFormattedMarkdown(text, 'teal')}</div>
                  </div>
                );
              }
              
              const keyValueMatch = content.match(/^(\*\*[^*]+\*\*)\s*[:：=]\s*(.*)/);
              if (keyValueMatch) {
                const keyTerm = keyValueMatch[1].replace(/\*\*/g, '');
                const valTerm = keyValueMatch[2];
                return (
                  <div key={lIdx} className="flex flex-col sm:flex-row sm:items-start gap-2 bg-[#f5f0e6] dark:bg-[#2e2a25] p-3 rounded-2xl border border-[#e2d8c7] dark:border-[#443e37] shadow-2xs">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#10b981] text-white shrink-0 shadow-2xs w-fit">
                      【 {keyTerm} 】
                    </span>
                    <div className="text-xs sm:text-sm text-[#1c1917] dark:text-[#f5f5f4] font-medium leading-relaxed pt-0.5">
                      {renderFormattedMarkdown(valTerm, 'zinc')}
                    </div>
                  </div>
                );
              }

              return (
                <div key={lIdx} className="flex gap-2.5 items-start text-xs sm:text-sm text-[#1c1917] dark:text-[#f5f5f4] leading-relaxed bg-[#f7f3e9]/80 dark:bg-[#27231f]/80 p-3 rounded-xl border border-[#e2d8c7]/80 dark:border-[#38322c]/80">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0 mt-1.5"></span>
                  <div className="font-normal flex-1">
                    {renderFormattedMarkdown(content, 'zinc')}
                  </div>
                </div>
              );
            }

            return (
              <p key={lIdx} className="text-xs sm:text-sm font-bold text-[#1c1917] dark:text-[#f5f5f4] pt-1">
                {renderFormattedMarkdown(cleanLine, 'zinc')}
              </p>
            );
          })}
        </div>
      );
    }

    // Default standard paragraph text
    return (
      <p key={blockIdx} className="text-xs sm:text-sm text-[#292524] dark:text-[#e7e5e4] leading-relaxed font-medium">
        {renderFormattedMarkdown(trim, 'zinc')}
      </p>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1c1917]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-[#f8f4eb] dark:bg-[#1a1715] rounded-3xl border border-[#e2d8c7] dark:border-[#3a332c] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* 1. TOP HEADER NAVIGATION - New Chinese Style Header */}
        <div className="px-5 py-3.5 bg-[#f4efe4] dark:bg-[#231f1c] border-b border-[#e2d8c7] dark:border-[#3a332c] flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-bold text-[#0d5d56] dark:text-[#5eead4] hover:text-[#042f2e] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>返回目录</span>
          </button>

          <div className="text-center px-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#b91c1c] dark:bg-[#ef4444] shrink-0"></span>
            <h2 className="text-xs sm:text-sm font-extrabold text-[#1c1917] dark:text-[#f5f5f4] truncate max-w-[180px] sm:max-w-[260px] font-serif">
              {topic.title}
            </h2>
          </div>

          <div className="text-xs font-mono font-bold text-[#78716c] dark:text-[#a8a29e] bg-[#e7dfd3]/80 dark:bg-[#342e28] px-2 py-0.5 rounded-md border border-[#d6cbba] dark:border-[#443c35]">
            {!quizStarted ? `${currentStep + 1}/${totalLessons}` : `测验`}
          </div>
        </div>

        {/* 2. TOP INDICATOR DOTS BAR (`• • • • •`) */}
        <div className="py-2.5 bg-[#ede6d8]/60 dark:bg-[#181513]/60 flex justify-center items-center gap-1.5 border-b border-[#e2d8c7]/50 dark:border-[#38322c]/50">
          {Array.from({ length: totalLessons }).map((_, idx) => {
            const isActive = !quizStarted && currentStep === idx;
            const isCompleted = currentStep > idx || quizStarted;
            return (
              <div
                key={idx}
                className={`h-2 transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-6 bg-[#b91c1c] dark:bg-[#ef4444] shadow-2xs'
                    : isCompleted
                    ? 'w-2 bg-[#0d5d56]/70 dark:bg-[#14b8a6]/70'
                    : 'w-2 bg-[#d6cbba] dark:bg-[#443e37]'
                }`}
              />
            );
          })}
          {quizQuestions.length > 0 && (
            <div
              className={`h-2 transition-all duration-300 rounded-full ${
                quizStarted
                  ? 'w-6 bg-[#b45309] dark:bg-[#f59e0b]'
                  : 'w-2 bg-[#d6cbba] dark:bg-[#443e37]'
              }`}
              title="小节测试"
            />
          )}
        </div>

        {/* 3. SCROLLABLE CARD BODY AREA */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-[#f8f4eb] dark:bg-[#1a1715]">
          {!quizStarted ? (
            /* STUDY LESSON CARD PANEL WITH 3D FLIP */
            <div className="[perspective:1200px] w-full relative">
              <div 
                className={`w-full transition-all duration-700 [transform-style:preserve-3d] ${
                  isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'
                } ${
                  animatingDir === 'next' ? 'animate-slide3dNext' : animatingDir === 'prev' ? 'animate-slide3dPrev' : ''
                }`}
              >
                {/* FRONT FACE OF CARD */}
                <div className={`[backface-visibility:hidden] bg-[#fffcf7] dark:bg-[#24201d] border border-[#ebdcc8] dark:border-[#3a332a] rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 ${isFlipped ? 'pointer-events-none' : ''}`}>
                  
                  {/* Knowledge Badge Tag & 3D Flip Action Header */}
                  <div className="flex items-center justify-between border-b border-[#f5f0e6] dark:border-[#2e2a25] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ecfdf5] text-[#059669] dark:bg-[#064e3b]/50 dark:text-[#34d399] border border-[#a7f3d0]/60 dark:border-[#047857]/40 shadow-2xs">
                        📖 知识卡片
                      </span>
                      <span className="hidden sm:inline text-[11px] font-serif text-[#a8a29e] dark:text-[#78716c] font-semibold">
                        《内景伤寒》经方卡
                      </span>
                    </div>

                    <button
                      onClick={() => setIsFlipped(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-[#f5f0e6] hover:bg-[#10b981] hover:text-white dark:bg-[#2e2a25] dark:hover:bg-[#10b981] text-[#0d5d56] dark:text-[#5eead4] transition-all border border-[#e2d8c7] dark:border-[#443e37] shadow-2xs cursor-pointer group"
                      title="点击 3D 翻转卡片，查验经方深研背面"
                    >
                      <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                      <span>3D 翻转考辨卡</span>
                    </button>
                  </div>

                  {/* NEO-CHINESE FINE-GRAINED CATEGORY NAVIGATION TABS */}
                  <div className="space-y-2 bg-[#f8f4eb]/80 dark:bg-[#1d1917]/80 p-3 rounded-2xl border border-[#e2d8c7] dark:border-[#3a332c]">
                    <div className="flex items-center justify-between px-1 text-[11px] font-bold text-[#78716c] dark:text-[#a8a29e]">
                      <span className="flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-[#0d5d56] dark:text-[#5eead4]" />
                        细致分类导航
                      </span>
                      <span className="font-mono text-[10px] text-[#b45309] dark:text-[#fde68a]">新中式五色精准比对</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {[
                        { id: 'all', label: '全部视角', icon: '📜', activeStyle: 'bg-[#292524] text-white dark:bg-[#f5f5f4] dark:text-[#1c1917]' },
                        { id: 'yuanwen', label: '原文依据', icon: '📜', activeStyle: 'bg-[#b91c1c] text-white' },
                        { id: 'neijing', label: '内景深度解析', icon: '🧠', activeStyle: 'bg-[#0d5d56] text-white shadow-md font-extrabold' },
                        { id: 'baihua', label: '白话物理', icon: '💡', activeStyle: 'bg-[#0d5d56] text-white' },
                        { id: 'anli', label: '临床案例', icon: '📋', activeStyle: 'bg-[#b45309] text-white' },
                        { id: 'koujue', label: '记忆口诀', icon: '🔑', activeStyle: 'bg-[#7e22ce] text-white' },
                        { id: 'jinji', label: '临证禁忌', icon: '⚠️', activeStyle: 'bg-[#dc2626] text-white' },
                      ].map((tab) => {
                        const isActive = selectedCategory === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setSelectedCategory(tab.id as any)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                              isActive
                                ? `${tab.activeStyle} border-transparent shadow-xs scale-105`
                                : 'bg-[#e7dfd3]/60 dark:bg-[#2a2521] text-[#44382a] dark:text-[#a8a29e] border-[#d6cbba]/60 dark:border-[#38322c] hover:bg-[#e7dfd3]'
                            }`}
                          >
                            <span className="text-[11px]">{tab.icon}</span>
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#1c1917] dark:text-[#f5f5f4] tracking-tight leading-snug font-serif border-b border-[#f5f0e6] dark:border-[#2e2a25] pb-2">
                    {currentLesson.title}
                  </h3>

                  {/* Dynamic Block Renderer with Color Blocks + Category Filter */}
                  <div className="space-y-3 pt-1">
                    {/* DEDICATED INNER LANDSCAPE MAPPING CARD */}
                    {(selectedCategory === 'all' || selectedCategory === 'neijing') && (
                      <InnerLandscapeMappingCard
                        topicTitle={topic.title}
                        lessonTitle={currentLesson.title}
                        clauses={topic.clauses}
                        lessonContent={currentLesson.content}
                      />
                    )}

                    {currentLesson.content
                      .split('\n\n')
                      .filter((block) => {
                        if (selectedCategory === 'all') return true;
                        const trim = block.trim();
                        if (trim.startsWith('## ') || trim.startsWith('### ')) return true;
                        if (selectedCategory === 'yuanwen') return trim.includes('经典依据') || trim.includes('理论来源') || trim.includes('黄帝内经') || trim.includes('伤寒论') || trim.includes('金匮要略') || trim.includes('原文') || trim.startsWith('- **理论来源**') || trim.startsWith('**理论来源**') || trim.startsWith('**经典依据**');
                        if (selectedCategory === 'neijing') return trim.includes('内景') || trim.includes('物理') || trim.includes('气化') || trim.includes('玄府') || trim.includes('核心原理') || trim.includes('病机');
                        if (selectedCategory === 'baihua') return trim.includes('白话解读') || trim.includes('物理内景') || trim.includes('理论通解') || trim.includes('核心原理') || trim.includes('核心定义') || trim.includes('核心概念') || trim.includes('核心要点') || trim.startsWith('- **核心要点**') || trim.startsWith('**核心要点**') || trim.startsWith('📌') || trim.startsWith('💡');
                        if (selectedCategory === 'anli') return trim.includes('临床案例') || trim.includes('误辨案例') || trim.includes('实战案例') || trim.includes('案例分析') || trim.includes('患者主诉') || trim.startsWith('- **案例**') || trim.startsWith('**误辨案例**') || trim.startsWith('📋');
                        if (selectedCategory === 'koujue') return trim.includes('记忆口诀') || trim.includes('口诀') || trim.includes('歌诀') || trim.includes('方歌') || trim.startsWith('- **记忆口诀**') || trim.startsWith('**记忆口诀**') || trim.startsWith('🔑');
                        if (selectedCategory === 'jinji') return trim.includes('易错点') || trim.includes('辨析禁忌') || trim.includes('临床禁忌') || trim.includes('急救警示') || trim.includes('警告') || trim.startsWith('- **易错点**') || trim.startsWith('**易错点**') || trim.startsWith('⚠️') || trim.startsWith('🚨');
                        return true;
                      })
                      .map((block, bIdx) => renderCardBlock(block, bIdx))}

                    {/* STRUCTURED 4-COLOR BLOCK CLINICAL CASES */}
                    {(selectedCategory === 'all' || selectedCategory === 'anli') && (
                      <div className="space-y-3 pt-2">
                        {currentLesson.clinicalCases && currentLesson.clinicalCases.length > 0 && (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-[#b45309] dark:text-[#fde68a] flex items-center gap-1.5 font-serif pt-2 border-t border-[#ebdcc8] dark:border-[#38322c]">
                              <Stethoscope className="w-4 h-4 text-[#b45309]" />
                              《伤寒论》经方诊疗实战案例（主诉•辨证•方剂•现代机理 4色块辨析）
                            </span>
                            {currentLesson.clinicalCases.map((c) => (
                              <ClinicalCaseCard key={c.id} caseData={c} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* INTERACTIVE PHYSIOLOGY PHYSICS SIMULATOR BOARD */}
                  <div className="mt-5 border-2 border-[#0d5d56]/40 dark:border-[#14b8a6]/40 bg-[#f0f7f7]/80 dark:bg-[#0f282a]/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#c2f0ec] dark:border-[#134e4a] pb-2.5">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4.5 h-4.5 text-[#0d5d56] dark:text-[#14b8a6]" />
                        <h4 className="text-xs sm:text-sm font-extrabold text-[#042f2e] dark:text-[#ccfbf1] font-serif">
                          内景生理物理参数·实战推演验证器
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-[#0d5d56] text-white px-2 py-0.5 rounded-full">
                        流体力学推演 Engine
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {/* Parameter 1: 表寒阻滞度 */}
                      <div className="space-y-1 bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-[#c2f0ec]/60 dark:border-[#134e4a]/60">
                        <div className="flex justify-between font-bold text-[#042f2e] dark:text-[#ccfbf1]">
                          <span>表寒闭阻程度:</span>
                          <span className="font-mono text-[#b91c1c]">{physioCold}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={physioCold} 
                          onChange={(e) => setPhysioCold(Number(e.target.value))}
                          className="w-full accent-[#b91c1c] cursor-pointer h-1.5 bg-[#e2d8c7] rounded-lg"
                        />
                        <span className="text-[10px] text-[#57534e] dark:text-[#a8a29e] block">肌表微血管收缩痉挛与毛孔闭合</span>
                      </div>

                      {/* Parameter 2: 津液血行量 */}
                      <div className="space-y-1 bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-[#c2f0ec]/60 dark:border-[#134e4a]/60">
                        <div className="flex justify-between font-bold text-[#042f2e] dark:text-[#ccfbf1]">
                          <span>津液血行充盈度:</span>
                          <span className="font-mono text-[#0d5d56]">{physioFluid}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={physioFluid} 
                          onChange={(e) => setPhysioFluid(Number(e.target.value))}
                          className="w-full accent-[#0d5d56] cursor-pointer h-1.5 bg-[#e2d8c7] rounded-lg"
                        />
                        <span className="text-[10px] text-[#57534e] dark:text-[#a8a29e] block">血管内有效循环血量与体液储量</span>
                      </div>

                      {/* Parameter 3: 胃气蒸腾热能 */}
                      <div className="space-y-1 bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-[#c2f0ec]/60 dark:border-[#134e4a]/60">
                        <div className="flex justify-between font-bold text-[#042f2e] dark:text-[#ccfbf1]">
                          <span>中焦胃气热能:</span>
                          <span className="font-mono text-[#b45309]">{physioStomach}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={physioStomach} 
                          onChange={(e) => setPhysioStomach(Number(e.target.value))}
                          className="w-full accent-[#b45309] cursor-pointer h-1.5 bg-[#e2d8c7] rounded-lg"
                        />
                        <span className="text-[10px] text-[#57534e] dark:text-[#a8a29e] block">脾胃消化腐熟与心阳动力输出</span>
                      </div>
                    </div>

                    {/* Derived Real-time Physics Analysis Box */}
                    {(() => {
                      const analysis = getPhysioAnalysis();
                      return (
                        <div className="bg-[#fffcf7] dark:bg-[#1a1715] p-3.5 rounded-xl border border-[#0d5d56]/30 dark:border-[#14b8a6]/30 space-y-2 shadow-2xs">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className="text-xs font-bold text-[#b91c1c] dark:text-[#ef4444] font-serif flex items-center gap-1">
                              <Brain className="w-3.5 h-3.5" />
                              推演病证: {analysis.syndrome}
                            </span>
                            <span className="text-xs font-extrabold text-[#0d5d56] dark:text-[#5eead4] bg-[#c2f0ec]/50 dark:bg-[#134e4a]/50 px-2 py-0.5 rounded-md font-mono">
                              对应经方: {analysis.formula}
                            </span>
                          </div>

                          <p className="text-xs text-[#292524] dark:text-[#e7e5e4] leading-relaxed">
                            <strong className="text-[#0d5d56] dark:text-[#14b8a6]">【物理演变机制】</strong>{analysis.physics}
                          </p>

                          <div className="text-[11px] font-mono text-[#78350f] dark:text-[#fde68a] bg-[#fef3c7]/60 dark:bg-[#78350f]/40 p-2 rounded-lg border border-[#fde68a]/60 flex items-center justify-between">
                            <span>切脉切诊演化结果:</span>
                            <span className="font-bold">{analysis.pulse}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* SVG TCM Inner Landscape Diagrams */}
                  {currentLesson.illustrations && currentLesson.illustrations.map((illustration, idx) => (
                    <div key={idx} className="mt-4 pt-2 border-t border-[#ebdcc8] dark:border-[#38322c]">
                      <h4 className="text-xs font-bold text-[#0d5d56] dark:text-[#14b8a6] mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-[#0d5d56]" />
                        内景物理示意图: {illustration.title}
                      </h4>
                      <TCMDiagram type={illustration.diagramType} />
                    </div>
                  ))}

                  {/* Original Classic Clauses Parchment Box at the end of last card */}
                  {currentStep === totalLessons - 1 && topic.clauses.length > 0 && (
                    <div className="mt-6 border-l-4 border-[#b91c1c] dark:border-[#ef4444] bg-[#faf2f2] dark:bg-[#2d1515] rounded-r-2xl p-4 sm:p-5 space-y-3 shadow-xs border border-[#f5d0d0]/60 dark:border-[#4a1d1d]/80">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[#881337] dark:text-[#fca5a5] font-extrabold text-xs">
                          <BookOpen className="w-4 h-4 text-[#b91c1c]" />
                          <span>📜 经典原文与内景通解汇总</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#881337] dark:text-[#fca5a5] bg-[#fee2e2] dark:bg-[#881337]/60 px-2 py-0.5 rounded-full">
                          朱砂红印
                        </span>
                      </div>
                      {topic.clauses.map((clause) => (
                        <div key={clause.id} className="bg-[#fffcf7] dark:bg-[#1f1a18] p-3.5 rounded-xl border border-[#ebdcc8] dark:border-[#3a332a] text-xs space-y-1.5 shadow-2xs">
                          <span className="text-[10px] uppercase font-bold text-[#b91c1c] dark:text-[#ef4444] block font-mono">
                            {clause.clauseNum}
                          </span>
                          <p className="font-bold text-[#1c1917] dark:text-[#f5f5f4] font-serif text-sm italic">
                            「 {clause.originalText} 」
                          </p>
                          <p className="text-[#44403c] dark:text-[#d6d3d1] pt-1.5 border-t border-[#f5f0e6] dark:border-[#2e2a25] leading-relaxed">
                            <strong className="text-[#0d5d56] dark:text-[#14b8a6] font-bold">【内景通解】</strong>{clause.innerLandscape}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* BACK FACE OF CARD (3D FLIPPED DEEP RESEARCH) */}
                <div className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#fdfbf7] dark:bg-[#1f1b18] border-2 border-[#b91c1c]/40 dark:border-[#ef4444]/40 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col justify-between overflow-y-auto ${!isFlipped ? 'pointer-events-none' : ''}`}>
                  <div className="space-y-4">
                    {/* Header on Back Side */}
                    <div className="flex items-center justify-between border-b-2 border-[#b91c1c] dark:border-[#ef4444] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#b91c1c] dark:bg-[#ef4444]"></span>
                        <h4 className="text-sm sm:text-base font-extrabold text-[#701a1a] dark:text-[#fca5a5] font-serif">
                          《伤寒杂病论》经方内景卡 • 背面深研
                        </h4>
                      </div>
                      <button
                        onClick={() => setIsFlipped(false)}
                        className="px-3.5 py-1.5 bg-[#b91c1c] text-white rounded-full text-xs font-bold hover:bg-[#991b1b] transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>翻回正面</span>
                      </button>
                    </div>

                    {/* Back Content Blocks */}
                    <div className="space-y-3 pt-1">
                      <div className="bg-[#faf2f2] dark:bg-[#2d1515] p-4 rounded-2xl border border-[#f5d0d0] dark:border-[#4a1d1d] space-y-2">
                        <span className="text-xs font-bold text-[#b91c1c] dark:text-[#fca5a5] flex items-center gap-1.5 font-serif">
                          📜 经方核心要点与气化机理
                        </span>
                        <p className="text-xs sm:text-sm text-[#701a1a] dark:text-[#fecdd3] font-serif leading-relaxed italic">
                          {currentLesson.title}
                        </p>
                      </div>

                      <div className="bg-[#f0f7f7] dark:bg-[#0f282a] p-4 rounded-2xl border border-[#c2f0ec] dark:border-[#134e4a] space-y-2">
                        <span className="text-xs font-bold text-[#0d5d56] dark:text-[#99f6e4] flex items-center gap-1.5 font-mono">
                          💡 物理内景思维复盘
                        </span>
                        <ul className="text-xs text-[#115e59] dark:text-[#ccfbf1] space-y-2 list-disc list-inside font-medium leading-relaxed">
                          <li><strong className="text-[#0d5d56] dark:text-[#5eead4]">阴阳气化：</strong>掌握六经传变与水火气血枢机升降。</li>
                          <li><strong className="text-[#0d5d56] dark:text-[#5eead4]">宣降通调：</strong>观察玄府开阖与寒热虚实临床转归。</li>
                          <li><strong className="text-[#0d5d56] dark:text-[#5eead4]">临证禁忌：</strong>严格区分表里同病与寒热错杂，严禁误用汗下。</li>
                        </ul>
                      </div>

                      {topic.clauses && topic.clauses.length > 0 && (
                        <div className="bg-[#fdf8ee] dark:bg-[#2a1d12] p-4 rounded-2xl border border-[#fde68a] dark:border-[#78350f] space-y-2">
                          <span className="text-xs font-bold text-[#b45309] dark:text-[#fde68a] flex items-center gap-1.5 font-serif">
                            📋 经典原句金印考辨 (第 {topic.clauses[0].clauseNum})
                          </span>
                          <p className="text-xs text-[#78350f] dark:text-[#fef3c7] font-serif italic bg-white/60 dark:bg-black/30 p-2.5 rounded-xl border border-[#b45309]/20">
                            「 {topic.clauses[0].originalText} 」
                          </p>
                        </div>
                      )}

                      {/* 20 Clinical Cases Section on Back Card */}
                      {topic.clinicalCases && topic.clinicalCases.length > 0 && (
                        <div className="pt-2 space-y-3 border-t border-[#e2d8c7] dark:border-[#38322c]">
                          <span className="text-xs font-bold text-[#b45309] dark:text-[#fde68a] flex items-center gap-1.5 font-serif">
                            <Stethoscope className="w-4 h-4 text-[#b45309]" />
                            《伤寒论》精选诊疗案例（主诉•辨证•方剂•现代机理 4色块）
                          </span>
                          {topic.clinicalCases.map((c) => (
                            <ClinicalCaseCard key={c.id} caseData={c} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#e2d8c7] dark:border-[#38322c] flex items-center justify-between text-xs text-[#78310f] dark:text-[#a8a29e]">
                    <span className="font-mono text-[10px] text-[#0d5d56] dark:text-[#5eead4]">卡片背面 • 经方内景金印</span>
                    <button
                      onClick={() => setIsFlipped(false)}
                      className="text-[#0d5d56] dark:text-[#2dd4bf] font-extrabold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>← 返回正面卡片</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* PRACTICE QUIZ PANEL - New Chinese Theme */
            <div className="bg-[#fffcf7] dark:bg-[#24201d] border border-[#ebdcc8] dark:border-[#3a332a] rounded-3xl p-5 sm:p-7 shadow-lg space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#fdf8ee] dark:bg-[#2a1d12] text-[#b45309] dark:text-[#fde68a] border border-[#fde68a] dark:border-[#78350f]">
                  <Sparkles className="w-3.5 h-3.5 text-[#b45309]" />
                  内景辨析练习 {currentQuizIdx + 1} / {quizQuestions.length}
                </span>
                <span className="text-[11px] text-[#78716c] dark:text-[#a8a29e] font-serif">
                  随堂考辨
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#1c1917] dark:text-[#f5f5f4] leading-snug font-serif">
                {quizQuestions[currentQuizIdx].question}
              </h3>

              {/* Options column */}
              <div className="space-y-2.5 pt-2">
                {quizQuestions[currentQuizIdx].options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrectAnswer = option === quizQuestions[currentQuizIdx].answer;

                  let btnStyle = "bg-[#f5f0e6]/70 dark:bg-[#2e2a25]/70 border-[#e2d8c7] dark:border-[#443e37] text-[#292524] dark:text-[#e7e5e4] hover:bg-[#e7dfd3] dark:hover:bg-[#38322c]";
                  if (isSelected) {
                    btnStyle = "bg-[#f0f7f7] dark:bg-[#0f282a] border-[#0d5d56] text-[#042f2e] dark:text-[#ccfbf1] ring-2 ring-[#0d5d56]/20 font-bold";
                  }
                  if (isAnswerChecked) {
                    if (isCorrectAnswer) {
                      btnStyle = "bg-[#dcfce7] dark:bg-[#14532d] border-[#16a34a] text-[#14532d] dark:text-[#dcfce7] font-bold";
                    } else if (isSelected) {
                      btnStyle = "bg-[#fee2e2] dark:bg-[#7f1d1d] border-[#dc2626] text-[#7f1d1d] dark:text-[#fee2e2]";
                    } else {
                      btnStyle = "bg-[#f5f0e6]/40 dark:bg-[#2e2a25]/40 border-[#e2d8c7]/50 dark:border-[#443e37]/50 text-[#a8a29e] opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span className="leading-normal">{option}</span>
                      {isAnswerChecked && isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Error Attribution Card */}
              {isAnswerChecked && (
                <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-fadeIn ${
                  isCorrect
                    ? 'bg-[#dcfce7] dark:bg-[#14532d]/40 border-[#86efac] dark:border-[#16a34a] text-[#14532d] dark:text-[#dcfce7]'
                    : 'bg-[#fee2e2] dark:bg-[#7f1d1d]/40 border-[#fca5a5] dark:border-[#dc2626] text-[#7f1d1d] dark:text-[#fee2e2]'
                }`}>
                  <div className="font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-serif">
                      {isCorrect ? '恭喜通解正确！🎉' : '辨析有偏差，请参悟内景归因 💡'}
                    </span>
                    {!isCorrect && (
                      <span className="text-[10px] font-bold bg-[#fecdd3] dark:bg-[#9f1239] text-[#881337] dark:text-[#ffe4e6] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <BookOpenCheck className="w-3 h-3" /> 已存错题库
                      </span>
                    )}
                  </div>

                  <div className="leading-relaxed font-mono bg-white/60 dark:bg-black/30 p-2.5 rounded-xl border border-current/20">
                    <strong className="block text-[#0d5d56] dark:text-[#5eead4] mb-0.5 font-serif">【内景考点正解】</strong>
                    {quizQuestions[currentQuizIdx].explanation}
                  </div>

                  {!isCorrect && (
                    <div className="leading-relaxed font-mono bg-[#fef2f2]/80 dark:bg-[#450a0a]/80 p-2.5 rounded-xl border border-red-300 dark:border-red-800 text-[#9f1239] dark:text-[#fca5a5]">
                      <strong className="block text-[#b91c1c] dark:text-[#f87171] mb-0.5 font-serif">【内景病机·错误归因分析】</strong>
                      {quizQuestions[currentQuizIdx].errorAttribution || `误选“${selectedOption}”，主要是混淆了该考点在内景流体、玄府通透性或脏腑气化上的作用机理。正解应从《伤寒论》人体客观物理病机深入理解。`}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. FOOTER BUTTON BAR - New Chinese Navigation Buttons */}
        <div className="px-5 py-3.5 bg-[#f4efe4] dark:bg-[#231f1c] border-t border-[#e2d8c7] dark:border-[#38322c] flex justify-between items-center gap-3">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0 && !quizStarted}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              currentStep === 0 && !quizStarted
                ? 'bg-[#e7dfd3]/50 dark:bg-[#342e28]/50 text-[#a8a29e] dark:text-[#57534e] cursor-not-allowed'
                : 'bg-[#e7dfd3] hover:bg-[#dcd3c1] dark:bg-[#342e28] dark:hover:bg-[#443c35] text-[#292524] dark:text-[#e7e5e4]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>上一张</span>
          </button>

          {!quizStarted ? (
            <div className="flex gap-2 flex-1 justify-end">
              {currentStep === totalLessons - 1 && (
                <button
                  onClick={onComplete}
                  className="px-3.5 py-2.5 rounded-2xl bg-[#b45309] hover:bg-[#92400e] text-white font-extrabold text-xs shadow-md shadow-[#b45309]/20 transition-all active:scale-95 flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <BookOpenCheck className="w-4 h-4" />
                  <span>完成关卡</span>
                </button>
              )}
              <button
                onClick={handleNextStep}
                className="flex-1 py-3 rounded-2xl bg-[#10b981] hover:bg-[#059669] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#10b981]/20 transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{currentStep === totalLessons - 1 ? '进入考辨测试' : '下一张'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                  className={`px-6 py-2.5 rounded-2xl font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
                    selectedOption
                      ? 'bg-[#0d5d56] hover:bg-[#0f766e] text-white shadow-[#0d5d56]/20'
                      : 'bg-[#e7dfd3] dark:bg-[#342e28] text-[#a8a29e] cursor-not-allowed shadow-none'
                  }`}
                >
                  <span>验证回答</span>
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className="px-6 py-2.5 rounded-2xl bg-[#0d5d56] hover:bg-[#0f766e] text-white font-extrabold text-xs shadow-md shadow-[#0d5d56]/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentQuizIdx === quizQuestions.length - 1 ? '完成关卡' : '下一题'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
