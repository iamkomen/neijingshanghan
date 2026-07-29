/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Flame, Shield, GraduationCap, Settings, Sparkles, Download, Layers, BookOpen, BookMarked, User, Key, BookOpenCheck, Trophy, Network, Compass } from 'lucide-react';
import { UserState } from '../types';
import { UserAccount } from './AuthModal';

interface HeaderProps {
  userState: UserState;
  account: UserAccount;
  onNavigate: (view: 'map' | 'graph' | 'physics' | 'clinic' | 'prompts' | 'journal' | 'download' | 'settings') => void;
  currentView: string;
  onOpenAuthModal: () => void;
  onOpenWrongQuestions?: () => void;
  onOpenGraduation?: () => void;
}

export default function Header({ userState, account, onNavigate, currentView, onOpenAuthModal, onOpenWrongQuestions, onOpenGraduation }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-6 flex items-center transition-colors shadow-sm">
      <div className="w-full flex items-center justify-between gap-4">
        {/* App Branding */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('map')}>
          <div className="w-10 h-10 bg-emerald-500 dark:bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-extrabold leading-none text-slate-900 dark:text-white flex items-center gap-2">
              伤寒内景学堂
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
                PRO v2.1
              </span>
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium mt-1">
              物理中医 · 循序渐进法
            </span>
          </div>
        </div>

        {/* Global Stats and Nav Actions */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Stats Pills */}
          <div className="flex items-center gap-2">
            {/* Hearts Pill */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/50" title="生命值">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{userState.hearts} / 5</span>
            </div>
            {/* Streak Pill */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/50" title="连续学习天数">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{userState.streak} 天</span>
            </div>
          </div>

          {/* Quick Nav (visible on mobile/tablet) */}
          <nav className="flex lg:hidden items-center gap-1.5">
            <button
              onClick={() => onNavigate('map')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'map'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="学习地图"
            >
              <Layers className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('graph')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'graph'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="经方网络图"
            >
              <Network className="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>

            <button
              onClick={() => onNavigate('physics')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'physics'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
              }`}
              title="3D WebGL 物理内景演示"
            >
              <Compass className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('journal')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'journal'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="修行日记"
            >
              <BookMarked className="w-4 h-4" />
            </button>

            {onOpenWrongQuestions && (
              <button
                onClick={onOpenWrongQuestions}
                className="p-2 rounded-xl transition-all text-amber-600 dark:text-amber-400 hover:bg-amber-50 cursor-pointer"
                title="错题本"
              >
                <BookOpenCheck className="w-4 h-4" />
              </button>
            )}

            {onOpenGraduation && (
              <button
                onClick={onOpenGraduation}
                className="p-2 rounded-xl transition-all text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 cursor-pointer"
                title="结业证书"
              >
                <Trophy className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onNavigate('clinic')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'clinic'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="AI内景问诊"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('prompts')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'prompts'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="提示词悟道"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('download')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'download'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="离线打包"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className={`p-2 rounded-xl transition-all ${
                currentView === 'settings'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="系统设置"
            >
              <Settings className="w-4 h-4" />
            </button>
          </nav>

          {/* User Audit Display / Auth Button */}
          <div
            onClick={onOpenAuthModal}
            className="hidden lg:flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-6 cursor-pointer hover:opacity-80 transition-opacity"
            title="点击管理用户名与密码"
          >
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{account.username || userState.name || '岐黄弟子'}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 justify-end">
                {account.hasPasswordSet ? '🔒 密码已保护' : '设置登录密码'}
              </p>
            </div>
            <div className="w-9 h-9 bg-emerald-50 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-400 text-xs border border-emerald-200 dark:border-slate-700 shadow-sm relative">
              {(account.username || userState.name || '岐')[0]}
              {account.hasPasswordSet && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white p-0.5 rounded-full text-[8px]">
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
