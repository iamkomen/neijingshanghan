/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StageMap from './components/StageMap';
import LessonModal from './components/LessonModal';
import ExamModal from './components/ExamModal';
import AIClinic from './components/AIClinic';
import FormulaNetworkGraph from './components/FormulaNetworkGraph';
import OfflineDownloader from './components/OfflineDownloader';
import SettingsPanel from './components/SettingsPanel';
import PromptHub from './components/PromptHub';
import StudyJournal from './components/StudyJournal';
import InnerPhysics3DCanvas from './components/InnerPhysics3DCanvas';
import AuthModal, { UserAccount } from './components/AuthModal';
import WrongQuestionsModal from './components/WrongQuestionsModal';
import GraduationModal from './components/GraduationModal';
import { UserState } from './types';
import { LEVEL_GATES, TOPICS } from './data/lessons';
import { Layers, Sparkles, Download, Settings, GraduationCap, BookOpen, BookMarked, User, BookOpenCheck, Trophy, Network, Compass } from 'lucide-react';

export default function App() {
  const [userState, setUserState] = useState<UserState>({
    name: "岐黄弟子",
    hearts: 5,
    streak: 3,
    unlockedLevels: ["g1_1"],
    completedLessons: []
  });

  const [account, setAccount] = useState<UserAccount>({
    username: "岐黄弟子",
    passwordHash: "",
    isLoggedIn: true,
    hasPasswordSet: false
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWrongQuestions, setShowWrongQuestions] = useState(false);
  const [showGraduation, setShowGraduation] = useState(false);
  const [currentView, setCurrentView] = useState<'map' | 'graph' | 'physics' | 'journal' | 'clinic' | 'prompts' | 'download' | 'settings'>('map');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activeGateId, setActiveGateId] = useState<string | null>(null);

  const [unlockToast, setUnlockToast] = useState<string | null>(null);

  // Load progress and user account from LocalStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("sh_duolingo_progress");
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        if (parsed && Array.isArray(parsed.unlockedLevels)) {
          if (!parsed.unlockedLevels.includes('g1_1')) {
            parsed.unlockedLevels.unshift('g1_1');
          }
          setUserState(parsed);
        }
      } catch (err) {
        console.error("Failed to load user progress.", err);
      }
    }

    const savedAccount = localStorage.getItem("sh_user_account");
    if (savedAccount) {
      try {
        const parsedAcc = JSON.parse(savedAccount);
        if (parsedAcc && parsedAcc.username) {
          setAccount(parsedAcc);
        }
      } catch (err) {
        console.error("Failed to load user account.", err);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setUnlockToast(msg);
    setTimeout(() => {
      setUnlockToast(null);
    }, 4500);
  };

  const handleUnlockGate = (gateId: string) => {
    const nextUnlocked = [...userState.unlockedLevels];
    if (!nextUnlocked.includes(gateId)) {
      nextUnlocked.push(gateId);
      saveState({
        ...userState,
        unlockedLevels: nextUnlocked
      });
      showToast("🎉 已成功快捷解锁所选关卡！您可以随时进行卡片学习与考题测试。");
    } else {
      showToast("该关卡已处于解锁状态！");
    }
  };

  const handleUnlockAllLevels = () => {
    const allGates = LEVEL_GATES.map(g => g.id);
    const allTopics = LEVEL_GATES.flatMap(g => g.topics);
    saveState({
      ...userState,
      unlockedLevels: allGates,
      completedLessons: allTopics
    });
    showToast(`🎉 已开启全关卡自由通关模式！所有 ${LEVEL_GATES.length} 门关卡与临床案例已全部解锁！`);
  };

  // Save progress helper
  const saveState = (newState: UserState) => {
    setUserState(newState);
    localStorage.setItem("sh_duolingo_progress", JSON.stringify(newState));
  };

  // Save user account helper
  const saveAccount = (newAccount: UserAccount) => {
    setAccount(newAccount);
    localStorage.setItem("sh_user_account", JSON.stringify(newAccount));
  };

  const handleLoginSuccess = (username: string) => {
    const updated = {
      ...account,
      username,
      isLoggedIn: true
    };
    saveAccount(updated);
    saveState({
      ...userState,
      name: username
    });
  };

  const handleSetPassword = (username: string, password: string) => {
    const updated = {
      username,
      passwordHash: password,
      isLoggedIn: true,
      hasPasswordSet: true
    };
    saveAccount(updated);
    saveState({
      ...userState,
      name: username
    });
  };

  const handleSelectTopic = (topicId: string) => {
    setActiveTopicId(topicId);
  };

  const handleCompleteTopic = () => {
    if (!activeTopicId) return;

    const completed = [...userState.completedLessons];
    if (!completed.includes(activeTopicId)) {
      completed.push(activeTopicId);
    }

    // Automatically unlock the next level gate when topic completed
    const currentGateIdx = LEVEL_GATES.findIndex(g => g.topics.includes(activeTopicId));
    const nextUnlocked = [...userState.unlockedLevels];
    let unlockedNew = false;

    if (currentGateIdx !== -1 && currentGateIdx < LEVEL_GATES.length - 1) {
      const nextGate = LEVEL_GATES[currentGateIdx + 1];
      if (!nextUnlocked.includes(nextGate.id)) {
        nextUnlocked.push(nextGate.id);
        unlockedNew = true;
      }
    }

    const totalTopics = LEVEL_GATES.flatMap(g => g.topics).length;
    const isAllCleared = completed.length >= totalTopics;

    const nextState = {
      ...userState,
      unlockedLevels: nextUnlocked,
      completedLessons: completed
    };

    saveState(nextState);
    setActiveTopicId(null);

    if (unlockedNew) {
      showToast("🎉 恭喜！关卡学习完成，下一门关卡已成功解锁！");
    }

    if (isAllCleared) {
      setShowGraduation(true);
    }
  };

  const handleStartExam = (gateId: string) => {
    setActiveGateId(gateId);
  };

  const handleLoseHeart = () => {
    const nextHearts = Math.max(0, userState.hearts - 1);
    saveState({
      ...userState,
      hearts: nextHearts
    });
  };

  const handlePassExam = (score: number) => {
    if (!activeGateId) return;

    // Determine next level gate to unlock
    const currentGateIdx = LEVEL_GATES.findIndex(g => g.id === activeGateId);
    const nextUnlocked = [...userState.unlockedLevels];
    let unlockedNew = false;

    if (currentGateIdx !== -1 && currentGateIdx < LEVEL_GATES.length - 1) {
      const nextGate = LEVEL_GATES[currentGateIdx + 1];
      if (!nextUnlocked.includes(nextGate.id)) {
        nextUnlocked.push(nextGate.id);
        unlockedNew = true;
      }
    }

    const currentGate = LEVEL_GATES[currentGateIdx];
    const completed = [...userState.completedLessons];
    if (currentGate) {
      currentGate.topics.forEach(tid => {
        if (!completed.includes(tid)) completed.push(tid);
      });
    }

    const totalTopics = LEVEL_GATES.flatMap(g => g.topics).length;
    const isAllCleared = completed.length >= totalTopics;

    const nextState = {
      ...userState,
      unlockedLevels: nextUnlocked,
      completedLessons: completed,
      // Pass rewards some hearts
      hearts: Math.min(5, userState.hearts + 1)
    };

    saveState(nextState);
    setActiveGateId(null);

    if (unlockedNew) {
      showToast("🎉 大考通关，已成功解禁下一门层级的大关卡！");
    }

    if (isAllCleared) {
      setShowGraduation(true);
    }
  };

  const handleResetProgress = () => {
    const defaultState: UserState = {
      name: userState.name,
      hearts: 5,
      streak: 1,
      unlockedLevels: ["g1_1"],
      completedLessons: []
    };
    saveState(defaultState);
    setCurrentView('map');
  };

  const handleRefillHearts = () => {
    saveState({
      ...userState,
      hearts: 5
    });
  };

  const handleUpdateName = (name: string) => {
    saveState({
      ...userState,
      name
    });
    saveAccount({
      ...account,
      username: name
    });
  };

  // Find active level gate & topic objects
  const activeTopic = activeTopicId ? TOPICS[activeTopicId] : null;
  const activeGate = activeGateId ? LEVEL_GATES.find(g => g.id === activeGateId) : null;

  // Calculate dynamic system progress
  const totalTopics = LEVEL_GATES.flatMap(g => g.topics).length;
  const progressPct = totalTopics > 0 ? Math.round((userState.completedLessons.length / totalTopics) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FAF8F2] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col font-sans antialiased transition-colors duration-300">
      {/* Dynamic Navigation Header */}
      <Header
        userState={userState}
        account={account}
        onNavigate={setCurrentView}
        currentView={currentView}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenWrongQuestions={() => setShowWrongQuestions(true)}
        onOpenGraduation={() => setShowGraduation(true)}
      />

      {/* Main Responsive Grid Layout */}
      <div className="flex flex-1 w-full overflow-hidden">
        
        {/* Left Sidebar (Desktop Only) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200/80 dark:border-zinc-800 p-6 gap-6 h-[calc(100vh-4rem)] sticky top-16">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">系统导航 / Navigation</p>
            
            <button
              onClick={() => setCurrentView('map')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                currentView === 'map'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Layers className="w-4.5 h-4.5" />
              <span>伤寒关卡地图</span>
            </button>

            <button
              onClick={() => setCurrentView('graph')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                currentView === 'graph'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Network className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
              <span>经方关系网络图</span>
            </button>

            <button
              onClick={() => setCurrentView('physics')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                currentView === 'physics'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-md border border-amber-400'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
              }`}
            >
              <Compass className="w-4.5 h-4.5" />
              <span>3D WebGL 物理内景</span>
            </button>

            <button
              onClick={() => setCurrentView('journal')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                currentView === 'journal'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <BookMarked className="w-4.5 h-4.5" />
              <span>修行日记</span>
            </button>

            <button
              onClick={() => setShowWrongQuestions(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all cursor-pointer"
            >
              <BookOpenCheck className="w-4.5 h-4.5 text-amber-600" />
              <span>错题本复习</span>
            </button>

            <button
              onClick={() => setShowGraduation(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-all cursor-pointer"
            >
              <Trophy className="w-4.5 h-4.5 text-yellow-600" />
              <span>结业典礼证书</span>
            </button>

            <button
              onClick={() => setCurrentView('clinic')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                currentView === 'clinic'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>AI内景物理问诊</span>
            </button>

            <button
              onClick={() => setCurrentView('prompts')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                currentView === 'prompts'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <BookOpen className="w-4.5 h-4.5" />
              <span>AI提示词悟道</span>
            </button>

            <button
              onClick={() => setCurrentView('download')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                currentView === 'download'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Download className="w-4.5 h-4.5" />
              <span>打包离线安装</span>
            </button>

            <button
              onClick={() => setCurrentView('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                currentView === 'settings'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              <span>修行系统设置</span>
            </button>
          </div>

          {/* System Mastery Card */}
          <div className="mt-auto bg-zinc-900 dark:bg-zinc-950 rounded-2xl p-4 text-white relative overflow-hidden shadow-md">
            <div className="relative z-10">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">系统修炼掌握度</p>
              <h3 className="text-sm font-bold mt-1">理论大纲层级</h3>
              <div className="mt-4 h-1.5 bg-zinc-800 rounded-full">
                <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
              </div>
              <p className="text-[10px] mt-2 text-zinc-300">当前进度: {progressPct}% ({userState.completedLessons.length}/{totalTopics})</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <GraduationCap className="w-20 h-20" />
            </div>
          </div>
        </aside>

        {/* Center Main Viewport */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#FAF8F2] dark:bg-zinc-950 relative">
          
          {/* FLOATING UNLOCK TOAST NOTIFICATION */}
          {unlockToast && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2.5 border-2 border-white animate-bounce">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{unlockToast}</span>
            </div>
          )}

          <div className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-12rem)] justify-between">
            <div>
              {currentView === 'map' && (
                <StageMap
                  userState={userState}
                  onSelectTopic={handleSelectTopic}
                  onStartExam={handleStartExam}
                  onUnlockGate={handleUnlockGate}
                  onUnlockAllLevels={handleUnlockAllLevels}
                  onNavigateGraph={() => setCurrentView('graph')}
                />
              )}

              {currentView === 'graph' && (
                <FormulaNetworkGraph
                  onSelectTopic={handleSelectTopic}
                  unlockedLevels={userState.unlockedLevels}
                  completedLessons={userState.completedLessons}
                />
              )}

              {currentView === 'physics' && (
                <InnerPhysics3DCanvas onSelectTopic={handleSelectTopic} />
              )}

              {currentView === 'journal' && (
                <StudyJournal onSelectTopic={handleSelectTopic} />
              )}

              {currentView === 'clinic' && (
                <AIClinic />
              )}

              {currentView === 'prompts' && (
                <PromptHub />
              )}

              {currentView === 'download' && (
                <OfflineDownloader />
              )}

              {currentView === 'settings' && (
                <SettingsPanel
                  userState={userState}
                  account={account}
                  onResetProgress={handleResetProgress}
                  onRefillHearts={handleRefillHearts}
                  onUpdateName={handleUpdateName}
                  onOpenAuthModal={() => setShowAuthModal(true)}
                  onUnlockAllLevels={handleUnlockAllLevels}
                />
              )}
            </div>

            {/* FOOTER */}
            <footer className="w-full text-center py-8 border-t border-zinc-200/80 dark:border-zinc-800 text-[10px] text-zinc-400 dark:text-zinc-600 font-mono mt-12">
              <div>内景解伤寒多邻国学堂 © 2026. All rights reserved.</div>
              <div className="mt-1">物理中医 · 循序渐进 · 妙解经方</div>
            </footer>
          </div>
        </main>

        {/* Right Performance Panel (Desktop Only) */}
        <aside className="hidden xl:flex flex-col w-72 bg-white dark:bg-zinc-900 border-l border-zinc-200/80 dark:border-zinc-800 p-6 gap-6 h-[calc(100vh-4rem)] sticky top-16">
          <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-4.5">
            <h4 className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">六经气化掌握度</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-end h-20 gap-1.5 px-2">
                <div className="flex-1 bg-emerald-400 dark:bg-emerald-500 rounded-t-md transition-all animate-fadeIn" style={{ height: userState.completedLessons.length > 0 ? '90%' : '15%' }} title="太阳篇"></div>
                <div className="flex-1 bg-emerald-500 rounded-t-md transition-all animate-fadeIn" style={{ height: userState.unlockedLevels.includes('yangming') ? '85%' : '15%' }} title="阳明篇"></div>
                <div className="flex-1 bg-emerald-300 dark:bg-emerald-400 rounded-t-md transition-all animate-fadeIn" style={{ height: userState.unlockedLevels.includes('shaoyang') ? '75%' : '15%' }} title="少阳篇"></div>
                <div className="flex-1 bg-orange-400 rounded-t-md transition-all animate-fadeIn" style={{ height: userState.unlockedLevels.includes('taiyin') ? '60%' : '15%' }} title="太阴篇"></div>
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-t-md transition-all animate-fadeIn" style={{ height: userState.unlockedLevels.includes('shaoyin') ? '45%' : '10%' }} title="少阴篇"></div>
                <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-t-md transition-all animate-fadeIn" style={{ height: userState.unlockedLevels.includes('jueyin') ? '30%' : '10%' }} title="厥阴篇"></div>
              </div>
              <div className="flex justify-between text-[8px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                <span>太阳</span><span>阳明</span><span>少阳</span><span>太阴</span><span>少阴</span><span>厥阴</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">物理内景验证审核</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60 shadow-sm rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">气血流体力学一致性</p>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500">模型运算完美闭环 (Stable)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60 shadow-sm rounded-xl">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold">本地静止离线算法库</p>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500">零网络无缝全功能 (Offline Ready)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60 shadow-sm rounded-xl">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold">玄府门轴开闭阻尼</p>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500">参悟考核匹配中 (Evaluating)</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('download')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 font-bold text-xs mt-auto transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>离线单文件 HTML 打包下载</span>
          </button>
        </aside>

      </div>

      {/* LEARNING TOPIC FLASHCARD MODAL */}
      {activeTopic && (
        <LessonModal
          topic={activeTopic}
          onClose={() => setActiveTopicId(null)}
          onComplete={handleCompleteTopic}
        />
      )}

      {/* GATE EXAM MODAL */}
      {activeGate && (
        <ExamModal
          gate={activeGate}
          userState={userState}
          onClose={() => setActiveGateId(null)}
          onPass={handlePassExam}
          onLoseHeart={handleLoseHeart}
        />
      )}

      {/* AUTH & PASSWORD MODAL */}
      {showAuthModal && (
        <AuthModal
          account={account}
          onLoginSuccess={handleLoginSuccess}
          onSetPassword={handleSetPassword}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* WRONG QUESTIONS NOTEBOOK MODAL */}
      {showWrongQuestions && (
        <WrongQuestionsModal
          onClose={() => setShowWrongQuestions(false)}
        />
      )}

      {/* GRADUATION CELEBRATION MODAL */}
      {showGraduation && (
        <GraduationModal
          userState={userState}
          onClose={() => setShowGraduation(false)}
        />
      )}
    </div>
  );
}
