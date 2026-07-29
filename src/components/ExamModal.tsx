/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Heart, Sparkles, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, Award, HelpCircle, BookOpenCheck } from 'lucide-react';
import { LevelGate, Question, UserState } from '../types';
import { TOPICS } from '../data/lessons';
import { saveWrongQuestion } from '../utils/wrongQuestions';

interface ExamModalProps {
  gate: LevelGate;
  userState: UserState;
  onClose: () => void;
  onPass: (score: number) => void;
  onLoseHeart: () => void;
}

export default function ExamModal({ gate, userState, onClose, onPass, onLoseHeart }: ExamModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [examFinished, setExamFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiGeneratedCount, setAiGeneratedCount] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Scramble a backup static question to prevent identical scenarios when offline
  const scrambleQuestion = (q: Question): Question => {
    const maleNames = ['张大伯', '李先生', '王大爷', '赵师傅', '小刘', '孙大叔'];
    const femaleNames = ['陈大娘', '李女士', '赵大妈', '张大姐', '小吴', '周阿姨'];
    const ages = [28, 35, 42, 56, 63, 71];

    const isFemale = Math.random() > 0.5;
    const name = isFemale 
      ? femaleNames[Math.floor(Math.random() * femaleNames.length)]
      : maleNames[Math.floor(Math.random() * maleNames.length)];
    const age = ages[Math.floor(Math.random() * ages.length)];

    let scrambledText = q.question;
    // Replace typical case starters if matched
    scrambledText = scrambledText.replace(/一位\d+岁的(男性|女性|老太太|患者)/, `一位 ${age} 岁的${isFemale ? '女性' : '男性'}患者 (${name})`);
    scrambledText = scrambledText.replace(/患者，\d+岁/, `${name}，${age}岁`);

    return {
      ...q,
      question: scrambledText
    };
  };

  useEffect(() => {
    setLoading(true);
    
    // Get all topics for the current gate
    const levelTopics = gate.topics.map(tid => TOPICS[topicIdMap(tid)]).filter(Boolean);
    
    // Extract pre-coded exam questions from all these topics
    const baseQuestions = levelTopics.flatMap(t => t.examQuestions || []);
    
    // Shuffle the available questions to ensure a dynamic exam experience
    const shuffled = [...baseQuestions].sort(() => Math.random() - 0.5);
    
    // Select up to 5 questions (or all of them if fewer than 5) and scramble their patient scenarios (names/ages)
    const selectedQuestions = shuffled.slice(0, 5).map(q => scrambleQuestion(q));
    
    setQuestions(selectedQuestions);
    setAiGeneratedCount(0); // 0 since we are using local high-fidelity question pool
    setLoading(false);
  }, [gate]);

  // Mini utility map
  const topicIdMap = (id: string) => id;

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(option);
  };

  const handleRequestClose = () => {
    if (examFinished || loading) {
      onClose();
    } else {
      setShowExitConfirm(true);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isAnswerChecked) return;
    const currentQ = questions[currentIdx];
    const correct = selectedOption === currentQ.answer;

    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
    } else {
      onLoseHeart();
      saveWrongQuestion({
        id: currentQ.id || `eq_${Date.now()}`,
        topicTitle: gate.title,
        question: currentQ.question,
        options: currentQ.options,
        answer: currentQ.answer,
        explanation: currentQ.explanation,
        userAnswer: selectedOption
      });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setExamFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-950 p-8 rounded-3xl text-center space-y-4 max-w-sm border border-zinc-100 dark:border-zinc-800 shadow-2xl">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 dark:border-zinc-800"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
          </div>
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
            中医学堂正在组卷大考...
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            正在为您提炼本关的核心辨证考点，定制专属不重复的临床案例与物理脉舌。
          </p>
        </div>
      </div>
    );
  }

  // Handle case when user ran out of hearts during the exam
  const isOutOfHearts = userState.hearts <= 0 && !isCorrect && isAnswerChecked;

  if (examFinished) {
    const finalPercentage = Math.round((correctCount / questions.length) * 100);
    const passed = finalPercentage >= 80;

    return (
      <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-6 text-center shadow-2xl space-y-6">
          <div className="flex justify-center">
            {passed ? (
              <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/20 border-4 border-amber-300 flex items-center justify-center text-amber-500 shadow-xl shadow-amber-500/10">
                <Award className="w-12 h-12 text-amber-500" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/20 border-4 border-red-300 flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {passed ? '大医精诚・成功通关！' : '功力尚浅・未能通关'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {gate.title}: {gate.subtitle}
            </p>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 flex justify-around border border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="block text-[10px] text-zinc-500 dark:text-zinc-400">答对题数</span>
              <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{correctCount} / {questions.length}</span>
            </div>
            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800"></div>
            <div>
              <span className="block text-[10px] text-zinc-500 dark:text-zinc-400">测验得分</span>
              <span className={`text-lg font-bold ${passed ? 'text-amber-600' : 'text-red-500'}`}>{finalPercentage}%</span>
            </div>
            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800"></div>
            <div>
              <span className="block text-[10px] text-zinc-500 dark:text-zinc-400">考核等级</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {passed ? '通达' : '重修'}
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {passed
              ? '恭喜您完成了对本篇章的深层悟道。已成功解禁下一门层级的大关卡！'
              : '伤寒大考需 80% 以上（答对至少4题）才可通关。请再次参悟条本，重整旗鼓。'}
          </p>

          <div className="flex flex-col gap-2 w-full">
            {passed ? (
              <button
                onClick={() => onPass(finalPercentage)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/10 transition-all active:scale-95 cursor-pointer"
              >
                🎉 解锁下一关
              </button>
            ) : (
              <>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => {
                      // Reset exam state & resample questions
                      setExamFinished(false);
                      setCurrentIdx(0);
                      setCorrectCount(0);
                      setSelectedOption(null);
                      setIsAnswerChecked(false);
                      setLoading(true);
                      setTimeout(() => {
                        const levelTopics = gate.topics.map(tid => TOPICS[tid]).filter(Boolean);
                        const baseQuestions = levelTopics.flatMap(t => t.examQuestions || []);
                        const shuffled = [...baseQuestions].sort(() => Math.random() - 0.5);
                        setQuestions(shuffled.slice(0, 5).map(q => scrambleQuestion(q)));
                        setLoading(false);
                      }, 400);
                    }}
                    className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>重新抽题大考</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    回大学堂复习
                  </button>
                </div>
                <button
                  onClick={() => onPass(finalPercentage)}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-900 text-amber-300 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1 border border-zinc-700"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>免测直接解锁下一关</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* EXIT CONFIRMATION DIALOG - Checklist Item #4 */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[60] bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                确定要退出大考吗？
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                退出将丢失本次答题进度。未完成大考将无法解锁下一模块。
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                继续答题
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Hearts Indicator and Close Button */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">组卷总考核：{gate.subtitle}</h2>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-100 dark:border-emerald-900 w-fit mt-0.5">
                <Sparkles className="w-2.5 h-2.5 text-emerald-500 animate-pulse" /> 本地经方高保真真题库 (免流量・零延迟)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Hearts indicator */}
            <div className="flex items-center gap-1.5 text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-2xl border border-red-100 dark:border-red-950/50">
              <Heart className="w-4 h-4 fill-red-500" />
              <span className="text-xs font-bold font-mono">{userState.hearts}</span>
            </div>
            {/* Close Button with Confirmation Trigger */}
            <button
              onClick={handleRequestClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="退出大考"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Scrollable Question area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {userState.hearts <= 0 ? (
            /* Lacking Hearts warning screen */
            <div className="text-center py-12 space-y-4 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-500 mx-auto">
                <Heart className="w-10 h-10 fill-red-500 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                生命值消耗殆尽！
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                答题有误，您目前的功力处于神劳状态。可以在学堂“主面板设置”中一键瞬间回血补满生命值，再次开启大考。
              </p>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                返回学堂
              </button>
            </div>
          ) : (
            /* CURRENT QUESTION */
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-100/50">
                  考试题 {currentIdx + 1} / {questions.length}
                </span>
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options lists */}
              <div className="flex flex-col gap-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrectAnswer = option === currentQ.answer;

                  let optionStyle = "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800";
                  if (isSelected) {
                    optionStyle = "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20";
                  }
                  if (isAnswerChecked) {
                    if (isCorrectAnswer) {
                      optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/30";
                    } else if (isSelected) {
                      optionStyle = "border-red-500 bg-red-500/10 text-red-800 dark:text-red-200 ring-2 ring-red-500/30";
                    } else {
                      optionStyle = "border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(option)}
                      disabled={isAnswerChecked}
                      className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer outline-none active:scale-[0.99] ${optionStyle}`}
                    >
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Verified explanations reveal */}
              {isAnswerChecked && (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed transition-all ${
                  isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                    : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-950 dark:text-red-100'
                }`}>
                  <p className="font-bold mb-1 flex items-center justify-between">
                    <span>{isCorrect ? '✅ 答对了！' : '❌ 答错了，生命值 -1'}</span>
                    {!isCorrect && (
                      <span className="text-[10px] font-bold bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <BookOpenCheck className="w-3 h-3" /> 已自动收入错题本
                      </span>
                    )}
                  </p>
                  <p className="font-mono leading-normal">
                    <strong>内景考考点分析：</strong>{currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer controls */}
        {userState.hearts > 0 && (
          <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
            {!isAnswerChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedOption}
                className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
                  selectedOption
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed shadow-none'
                }`}
              >
                <span>提交答案</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/10 transition-all active:scale-95"
              >
                <span>{currentIdx === questions.length - 1 ? '提交考卷' : '下一考题'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
