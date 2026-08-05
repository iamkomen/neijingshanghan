/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Flame, Shield, GraduationCap, Settings, Sparkles, Download, Layers, BookOpen, BookMarked, User, Key, BookOpenCheck, Trophy, Network, Compass, Brain } from 'lucide-react';
import { UserState } from '../types';
import { UserAccount } from './AuthModal';
import { TCM_THEME } from '../theme';

interface HeaderProps {
  userState: UserState;
  account: UserAccount;
  onNavigate: (view: 'map' | 'graph' | 'inner-mechanism' | 'physics' | 'clinic' | 'prompts' | 'journal' | 'download' | 'settings') => void;
  currentView: string;
  onOpenAuthModal: () => void;
  onOpenWrongQuestions?: () => void;
  onOpenGraduation?: () => void;
  onOpenInnerDict?: () => void;
  onOpenColdFluProtocol?: () => void;
}

export default function Header({ userState, account, onNavigate, currentView, onOpenAuthModal, onOpenWrongQuestions, onOpenGraduation, onOpenInnerDict, onOpenColdFluProtocol }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#FFFCF7]/95 dark:bg-[#1F1C19]/95 backdrop-blur-md border-b border-[#EBDCC8] dark:border-[#38322C] px-6 flex items-center transition-colors shadow-xs">
      <div className="w-full flex items-center justify-between gap-4">
        {/* App Branding */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('map')}>
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border-2 border-[#b91c1c] bg-[#1c1917] flex items-center justify-center shrink-0">
            <img 
              src="/src/assets/images/tcm_app_logo_1785645956126.jpg" 
              alt="伤寒内景学堂徽标" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-extrabold leading-none text-[#1C1917] dark:text-[#FEF3C7] flex items-center gap-2 font-serif tracking-wide">
              伤寒内景学堂
              <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 text-white shadow-xs border border-amber-400/50">
                PRO v3.0 重铸版
              </span>
            </h1>
            <span className="text-[10px] text-[#B45309] dark:text-[#FDE68A] uppercase tracking-wider font-mono font-medium mt-1">
              物理中医 · 客观规律辨证系统
            </span>
          </div>
        </div>

        {/* Global Stats and Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Cold/Flu Quick Protocol Button */}
          {onOpenColdFluProtocol && (
            <button
              onClick={onOpenColdFluProtocol}
              className="flex items-center gap-1.5 bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#047857] dark:text-[#34D399] px-3 py-1.5 rounded-full border border-[#A7F3D0] dark:border-[#047857] text-xs font-bold hover:bg-[#047857] hover:text-white transition-all cursor-pointer shadow-xs font-serif shrink-0"
              title="《中医经方治疗感冒简易应用版》快速对证与精细剂量折算"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="hidden sm:inline">感冒经方速查 (剂量折算)</span>
              <span className="sm:hidden">感冒速查</span>
            </button>
          )}

          {/* Inner Dictionary Quick Trigger Button */}
          {onOpenInnerDict && (
            <button
              onClick={onOpenInnerDict}
              className="flex items-center gap-1.5 bg-[#FAF2F2] dark:bg-[#2D1515] text-[#B91C1C] dark:text-[#FCA5A5] px-3 py-1.5 rounded-full border border-[#F5D0D0] dark:border-[#4A1D1D] text-xs font-bold hover:bg-[#B91C1C] hover:text-white dark:hover:bg-[#EF4444] transition-all cursor-pointer shadow-xs font-serif shrink-0"
              title="查阅《内景活字典》185条文与经方物理机制"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">内景活字典 (185条文速查)</span>
              <span className="sm:hidden">活字典</span>
            </button>
          )}

          {/* Stats Pills */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Hearts Pill */}
            <div className="flex items-center gap-2 bg-[#FAF7F0] dark:bg-[#2A2622] px-3 py-1.5 rounded-full border border-[#EBDCC8] dark:border-[#38322C]" title="生命值">
              <Heart className="w-4 h-4 text-[#B91C1C] fill-[#B91C1C]" />
              <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4] font-mono">{userState.hearts} / 5</span>
            </div>
            {/* Streak Pill */}
            <div className="flex items-center gap-2 bg-[#FAF7F0] dark:bg-[#2A2622] px-3 py-1.5 rounded-full border border-[#EBDCC8] dark:border-[#38322C]" title="连续学习天数">
              <Flame className="w-4 h-4 text-[#B45309] fill-[#B45309]" />
              <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4] font-mono">{userState.streak} 天</span>
            </div>
          </div>

          {/* Quick Nav (visible on mobile/tablet) */}
          <nav className="flex lg:hidden items-center gap-1.5">
            <button
              onClick={() => onNavigate('map')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'map'
                  ? 'bg-[#B45309] text-white shadow-sm'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FAF7F0]'
              }`}
              title="学习地图"
            >
              <Layers className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('graph')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'graph'
                  ? 'bg-[#B45309] text-white shadow-sm'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FAF7F0]'
              }`}
              title="经方网络图"
            >
              <Network className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('inner-mechanism')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'inner-mechanism'
                  ? 'bg-[#B45309] text-white shadow-sm'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FAF7F0]'
              }`}
              title="内景病变机理图"
            >
              <Brain className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('physics')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'physics'
                  ? 'bg-[#B45309] text-white shadow-sm'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FAF7F0]'
              }`}
              title="3D WebGL 物理内景演示"
            >
              <Compass className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('journal')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'journal'
                  ? 'bg-[#B45309] text-white shadow-sm'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FAF7F0]'
              }`}
              title="修行日记"
            >
              <BookMarked className="w-4 h-4" />
            </button>

            {onOpenWrongQuestions && (
              <button
                onClick={onOpenWrongQuestions}
                className="p-2 rounded-xl transition-all text-[#B45309] dark:text-[#FDE68A] hover:bg-[#FAF7F0] cursor-pointer"
                title="错题本"
              >
                <BookOpenCheck className="w-4 h-4" />
              </button>
            )}

            {onOpenGraduation && (
              <button
                onClick={onOpenGraduation}
                className="p-2 rounded-xl transition-all text-[#B45309] dark:text-[#FDE68A] hover:bg-[#FAF7F0] cursor-pointer"
                title="结业证书"
              >
                <Trophy className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onNavigate('clinic')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'clinic'
                  ? 'bg-[#B45309] text-white shadow-sm'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FAF7F0]'
              }`}
              title="AI内景问诊"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('prompts')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'prompts'
                  ? 'bg-[#B45309] text-white shadow-sm'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FAF7F0]'
              }`}
              title="提示词悟道"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('download')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'download'
                  ? 'bg-[#B45309] text-white shadow-sm'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FAF7F0]'
              }`}
              title="离线打包"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'settings'
                  ? 'bg-[#B45309] text-white shadow-sm'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FAF7F0]'
              }`}
              title="系统设置"
            >
              <Settings className="w-4 h-4" />
            </button>
          </nav>

          {/* User Audit Display / Auth Button */}
          <div
            onClick={onOpenAuthModal}
            className="hidden lg:flex items-center gap-3 border-l border-[#EBDCC8] dark:border-[#38322C] pl-6 cursor-pointer hover:opacity-80 transition-opacity"
            title="点击管理用户名与密码"
          >
            <div className="text-right">
              <p className="text-xs font-bold text-[#1C1917] dark:text-[#FEF3C7] font-serif">{account.username || userState.name || '岐黄弟子'}</p>
              <p className="text-[10px] text-[#B45309] dark:text-[#FDE68A] font-mono font-medium flex items-center gap-1 justify-end">
                {account.hasPasswordSet ? '🔒 密码已保护' : '设置登录密码'}
              </p>
            </div>
            <div className="w-9 h-9 bg-[#B45309] text-white rounded-full flex items-center justify-center font-bold text-xs border border-[#92400E] shadow-xs relative">
              {(account.username || userState.name || '岐')[0]}
              {account.hasPasswordSet && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-[#B91C1C] text-white p-0.5 rounded-full text-[8px]">
                  <Key className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
