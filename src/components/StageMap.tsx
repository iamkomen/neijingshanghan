/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { UserState, LevelGate } from '../types';
import { CHAPTERS, TOPICS, LEVEL_GATES } from '../data/lessons';

interface StageMapProps {
  userState: UserState;
  onSelectTopic: (topicId: string) => void;
  onStartExam: (gateId: string) => void;
  onUnlockGate?: (gateId: string) => void;
  onUnlockAllLevels?: () => void;
  onNavigateGraph?: () => void;
}

export default function StageMap({ 
  userState, 
  onSelectTopic, 
  onStartExam,
  onUnlockGate,
  onUnlockAllLevels,
  onNavigateGraph
}: StageMapProps) {
  const [selectedLockedGate, setSelectedLockedGate] = useState<LevelGate | null>(null);
  const [showLandscapeModal, setShowLandscapeModal] = useState<boolean>(false);

  // Check if a gate/level is unlocked
  const isGateUnlocked = (gateId: string) => {
    return userState.unlockedLevels.includes(gateId);
  };

  // Check if a topic is completed
  const isTopicCompleted = (topicId: string) => {
    return userState.completedLessons.includes(topicId);
  };

  // Helper to dynamically render Lucide icons by name
  const renderIcon = (iconName: string, className: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.BookOpen;
    return <IconComponent className={className} />;
  };

  // Chapter icon style mapping matching image design
  const getChapterStyle = (chapterNum: number) => {
    const styles: Record<number, { bg: string; iconBg: string; text: string; ring: string }> = {
      1: { bg: 'bg-[#556B2F]', iconBg: 'bg-[#4B6127] text-white', text: 'text-[#3B4D1C]', ring: 'ring-[#556B2F]' }, // 绿色
      2: { bg: 'bg-[#C03A2B]', iconBg: 'bg-[#A93226] text-white', text: 'text-[#922B21]', ring: 'ring-[#C03A2B]' }, // 朱红
      3: { bg: 'bg-[#D35400]', iconBg: 'bg-[#BA4A00] text-white', text: 'text-[#A04000]', ring: 'ring-[#D35400]' }, // 褐橙
      4: { bg: 'bg-[#F39C12]', iconBg: 'bg-[#D68910] text-white', text: 'text-[#B9770E]', ring: 'ring-[#F39C12]' }, // 太阳黄
      5: { bg: 'bg-[#D4AC0D]', iconBg: 'bg-[#B7950B] text-white', text: 'text-[#9A7D0A]', ring: 'ring-[#D4AC0D]' }, // 胶囊金
      6: { bg: 'bg-[#2E4053]', iconBg: 'bg-[#212F3D] text-white', text: 'text-[#1B2631]', ring: 'ring-[#2E4053]' }, // 听诊蓝
      7: { bg: 'bg-[#7E5109]', iconBg: 'bg-[#6E4406] text-white', text: 'text-[#5B3905]', ring: 'ring-[#7E5109]' }, // 药罐棕
      8: { bg: 'bg-[#7D3C98]', iconBg: 'bg-[#6C3483] text-white', text: 'text-[#5B2C6F]', ring: 'ring-[#7D3C98]' }, // 病例紫
    };
    return styles[chapterNum] || styles[1];
  };

  return (
    <div className="w-full max-w-lg mx-auto py-6 px-4 flex flex-col items-center font-sans select-none animate-fadeIn" id="stagemap-scroll-container">
      
      {/* HERO BANNER CARD */}
      <div className="w-full rounded-3xl overflow-hidden shadow-lg border border-amber-200/80 dark:border-amber-900/60 mb-5 relative group">
        <div className="h-44 w-full relative overflow-hidden bg-gradient-to-r from-amber-950 via-red-950 to-stone-900 p-5 flex flex-col justify-end text-white">
          <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-amber-500/10 blur-xl"></div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-amber-300 uppercase bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full w-fit mb-1.5 backdrop-blur-md">
            伤寒六经 · 病理知识图谱
          </span>
          <h1 className="text-lg md:text-xl font-extrabold tracking-tight font-serif text-amber-50 flex items-center gap-2">
            《伤寒论》物理内景与临床案证
          </h1>
          <p className="text-xs text-amber-200/80 font-medium line-clamp-1 mt-0.5">
            以六经为纲，以玄府气化为理，通达 397 法与经方精准辨析
          </p>
        </div>
      </div>

      {/* FORMULA RELATIONSHIP GRAPH PROMOTIONAL BANNER */}
      {onNavigateGraph && (
        <div
          onClick={onNavigateGraph}
          className="w-full bg-gradient-to-r from-red-950 via-amber-950 to-stone-900 border-2 border-red-800/80 hover:border-amber-500 rounded-3xl p-4 mb-5 shadow-lg flex items-center justify-between gap-4 cursor-pointer group transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-red-600/30 border border-red-500/50 rounded-2xl flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
              <Icons.Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-100 font-serif">
                  交互式‘经方关系网络图’
                </span>
                <span className="text-[9px] bg-red-600 text-white font-mono font-bold px-1.5 py-0.2 rounded-full">
                  NEW
                </span>
              </div>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                可探索不同条文药物配伍与六经转化逻辑，点击节点直达关卡
              </p>
            </div>
          </div>
          <Icons.ChevronRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
      )}
      <div className="w-full bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-3xl p-4 mb-5 flex items-center gap-4 shadow-sm relative">
        <div className="w-12 h-12 rounded-2xl border-2 border-emerald-400 dark:border-emerald-600 shadow-md shrink-0 bg-emerald-600 text-white flex items-center justify-center font-serif font-bold text-xl">
          岐
        </div>
        <div className="flex-1 flex flex-col justify-center relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 font-serif">
              岐黄导师 · 随堂教诲
            </span>
            <span className="text-[9px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold px-1.5 py-0.5 rounded-md">
              🔥 第 {userState.streak} 天修业
            </span>
          </div>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed">
            “六经不离玄府，发汗不离通阴。深研细微病机与临床医案，经方方能随手拈来！”
          </p>
        </div>
      </div>

      {/* INNER LANDSCAPE DIAGRAM QUICK VIEW CARD */}
      <div 
        onClick={() => setShowLandscapeModal(true)}
        className="w-full bg-amber-500/10 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/60 rounded-3xl p-3.5 mb-6 flex items-center justify-between gap-3 shadow-xs hover:border-amber-500 cursor-pointer transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-sm">
            <Icons.BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 font-serif">
              <span>六经气化内景修真图</span>
              <span className="text-[9px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-mono px-1.5 py-0.2 rounded font-bold">图谱观想</span>
            </h3>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-400 font-medium mt-0.5">
              点击观想六经通路、太阳高压与厥阴阴阳交替机制
            </p>
          </div>
        </div>
        <Icons.ChevronRight className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
      </div>

      {/* QUICK UNLOCK ACCESS BAR */}
      <div className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 mb-6 flex flex-wrap items-center justify-between gap-2 shadow-xs text-xs">
        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300 font-bold">
          <Icons.Unlock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>关卡解锁进度: {userState.unlockedLevels.length}/{LEVEL_GATES.length} 关</span>
        </div>
        <div className="flex items-center gap-2">
          {onUnlockAllLevels && userState.unlockedLevels.length < LEVEL_GATES.length && (
            <button
              onClick={onUnlockAllLevels}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <Icons.Sparkles className="w-3 h-3" />
              <span>一键解锁全部关卡</span>
            </button>
          )}
        </div>
      </div>

      {/* 8 CHAPTERS LIST */}
      <div className="w-full flex flex-col space-y-8 relative">
        {CHAPTERS.map((chapter) => {
          const style = getChapterStyle(chapter.number);

          return (
            <div key={chapter.id} className="w-full flex flex-col items-center relative">
              
              {/* CHAPTER HEADER BANNER CARD (Exact Match with Reference Image) */}
              <div id={`chapter-card-${chapter.id}`} className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-4 shadow-sm flex items-center gap-4 relative z-10">
                {/* Icon Box */}
                <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  {renderIcon(chapter.icon, "w-7 h-7 text-white stroke-[2.2]")}
                </div>

                {/* Chapter Title & Subtitle */}
                <div className="flex flex-col justify-center">
                  <h2 className="text-base md:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                    {chapter.title}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                    {chapter.subtitle}
                  </p>
                </div>
              </div>

              {/* GATES PATHWAY UNDER THIS CHAPTER */}
              <div className="w-full flex flex-col items-center py-6 relative">
                
                {chapter.gates.map((gate, gateIdx) => {
                  const unlocked = isGateUnlocked(gate.id);
                  const topicId = gate.topics[0];
                  const completed = topicId ? isTopicCompleted(topicId) : false;

                  return (
                    <div key={gate.id} className="flex flex-col items-center relative w-full my-2">
                      
                      {/* Vertical Connecting Line */}
                      {gateIdx < chapter.gates.length - 1 && (
                        <div className="absolute top-16 bottom-[-24px] w-1 bg-zinc-200 dark:bg-zinc-800 -z-10"></div>
                      )}

                      {/* Gate Node Circle Group */}
                      <div 
                        className="flex flex-col items-center group relative cursor-pointer" 
                        onClick={() => {
                          if (unlocked) {
                            onSelectTopic(topicId);
                          } else {
                            setSelectedLockedGate(gate);
                          }
                        }}
                      >
                        
                        {/* Outer Circle Container */}
                        <div className="relative">
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                            completed
                              ? 'bg-amber-100 dark:bg-amber-950/40 border-4 border-amber-500 text-amber-600 shadow-md hover:scale-105'
                              : unlocked
                              ? 'bg-white dark:bg-zinc-900 border-4 border-amber-400 text-zinc-800 dark:text-zinc-100 shadow-lg hover:scale-105 ring-4 ring-amber-400/20'
                              : 'bg-zinc-200 dark:bg-zinc-800/80 border-4 border-zinc-300 dark:border-zinc-700 text-zinc-400 opacity-90 hover:scale-105'
                          }`}>
                            {/* Inner Center Icon */}
                            {renderIcon(chapter.icon, `w-8 h-8 ${completed ? 'text-amber-600' : unlocked ? style.text : 'text-zinc-400'}`)}
                          </div>

                          {/* Lock Badge overlay at top-right */}
                          {!unlocked && (
                            <div className="absolute -top-1 -right-1 bg-zinc-700 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900 text-white rounded-full p-1 shadow-md">
                              <Icons.Lock className="w-3.5 h-3.5 fill-current" />
                            </div>
                          )}

                          {/* Completed Check Badge */}
                          {completed && (
                            <div className="absolute -top-1 -right-1 bg-amber-500 border-2 border-white dark:border-zinc-900 text-white rounded-full p-1 shadow-md">
                              <Icons.Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* Node Label Title */}
                        <span id={`gate-title-${gate.id}`} className={`text-sm font-bold mt-2 text-center transition-colors ${
                          unlocked ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'
                        }`}>
                          {gate.title}
                        </span>

                        {/* Node Subtitle / Status */}
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                          {unlocked ? (completed ? '已通关' : '4卡 • 15题') : '点击查看/解锁'}
                        </span>

                        {/* Start Exam Button / Action Pill for unlocked level */}
                        {unlocked ? (
                          <div className="flex gap-2 mt-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); onSelectTopic(topicId); }}
                              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Icons.BookOpen className="w-3 h-3" /> 学习卡片
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onStartExam(gate.id); }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Icons.Award className="w-3 h-3" /> 考题测试
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onUnlockGate) onUnlockGate(gate.id);
                            }}
                            className="mt-2 px-3 py-1 bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-bold rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Icons.Unlock className="w-3 h-3" /> 免测解锁
                          </button>
                        )}

                      </div>

                    </div>
                  );
                })}

              </div>

              {/* Inter-chapter Vertical Connection Line */}
              {chapter.number < CHAPTERS.length && (
                <div className="w-1 h-10 bg-zinc-300 dark:bg-zinc-800 my-1"></div>
              )}

            </div>
          );
        })}
      </div>

      {/* INNER LANDSCAPE FULLSCREEN MODAL */}
      {showLandscapeModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-5 max-w-2xl w-full space-y-4 shadow-2xl text-left animate-scaleUp relative overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <h3 className="text-sm font-bold text-amber-200 font-serif">
                  六经气化内景修真图 · AI 高清绘卷
                </h3>
              </div>
              <button
                onClick={() => setShowLandscapeModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded-full cursor-pointer transition-colors"
              >
                <Icons.X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="rounded-2xl p-6 border border-amber-500/40 shadow-lg bg-gradient-to-br from-amber-950 via-stone-900 to-zinc-950 text-amber-100 flex flex-col items-center justify-center text-center">
                <Icons.Layers className="w-12 h-12 text-amber-400 mb-2" />
                <h4 className="text-base font-extrabold font-serif text-amber-200">《伤寒论》六经气化内景全图</h4>
                <p className="text-xs text-amber-300/80 mt-1 max-w-md">
                  开、阖、枢六经运行通道 · 气血津液输布模型
                </p>
              </div>

              <div className="bg-zinc-800/80 border border-zinc-700/80 rounded-2xl p-4 space-y-2 text-xs text-zinc-300">
                <h4 className="font-bold text-amber-300 font-serif flex items-center gap-1.5">
                  <Icons.Sparkles className="w-3.5 h-3.5" />
                  <span>内景图解核心法门</span>
                </h4>
                <p className="leading-relaxed">
                  <strong>1. 太阳开机：</strong>太阳主表，如同人体最高层之高压水泵，桂枝加速血行化气，麻黄开玄府泄邪。
                </p>
                <p className="leading-relaxed">
                  <strong>2. 阳明阖机：</strong>阳明主里，为燥土大胃，清热白虎、承气通腑，下降里热之源。
                </p>
                <p className="leading-relaxed">
                  <strong>3. 少阳枢机：</strong>少阳枢转于半表半里，小柴胡汤达胸胁气分，和畅枢机。
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowLandscapeModal(false)}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
            >
              关 闭 观 想
            </button>
          </div>
        </div>
      )}

      {/* LOCKED GATE UNLOCK MODAL */}
      {selectedLockedGate && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl text-center animate-scaleUp relative">
            <button
              onClick={() => setSelectedLockedGate(null)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 rounded-full cursor-pointer"
            >
              <Icons.X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/40 border-4 border-amber-300 dark:border-amber-700 text-amber-600 flex items-center justify-center mx-auto shadow-md">
              <Icons.Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                关卡未解锁
              </span>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                《{selectedLockedGate.title}》
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                按照修业路线，通关前一关的学习卡片或考题测试即可自动解锁。您也可以通过下方快捷选项直接解禁此关卡！
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  if (onUnlockGate) onUnlockGate(selectedLockedGate.id);
                  setSelectedLockedGate(null);
                }}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Icons.Unlock className="w-4 h-4" />
                <span>⚡ 直接解锁本关</span>
              </button>

              {onUnlockAllLevels && (
                <button
                  onClick={() => {
                    onUnlockAllLevels();
                    setSelectedLockedGate(null);
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Icons.Sparkles className="w-4 h-4" />
                  <span>🔓 开启全关卡自由模式</span>
                </button>
              )}

              <button
                onClick={() => {
                  onSelectTopic('T1_1');
                  setSelectedLockedGate(null);
                }}
                className="w-full py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Icons.BookOpen className="w-4 h-4" />
                <span>📖 前往第 1 关开始学习</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

