/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RefreshCw, Trash2, ShieldAlert, CheckCircle, GraduationCap, Heart, User, Award, Key, Lock, ShieldCheck } from 'lucide-react';
import { UserState } from '../types';
import { UserAccount } from './AuthModal';

interface SettingsPanelProps {
  userState: UserState;
  account: UserAccount;
  onResetProgress: () => void;
  onRefillHearts: () => void;
  onUpdateName: (name: string) => void;
  onOpenAuthModal: () => void;
  onUnlockAllLevels: () => void;
}

export default function SettingsPanel({
  userState,
  account,
  onResetProgress,
  onRefillHearts,
  onUpdateName,
  onOpenAuthModal,
  onUnlockAllLevels
}: SettingsPanelProps) {
  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 space-y-8">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl shadow-zinc-200/50 dark:shadow-none space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            伤寒内景多邻国学堂 · 系统设置
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            在这里您可以管理学习进度、设置弟子用户名与密码保护，或重置所有关卡记录。
          </p>
        </div>

        {/* SECTION 1: PROFILE & AUTH CREDENTIALS */}
        <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-2.5">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">弟子账号与安全密码</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${account.hasPasswordSet ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'}`}>
              {account.hasPasswordSet ? '🔒 已启用密码保护' : '⚠️ 未设置密码'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-zinc-900 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userState.name}
                    onChange={(e) => onUpdateName(e.target.value)}
                    className="text-base font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-1 outline-none"
                    placeholder="输入弟子姓名..."
                  />
                </div>
                <p className="text-[10px] text-zinc-400">点击文字可修改名字，呈现在结业考卷与离线归档中。</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>{account.hasPasswordSet ? '修改用户名与密码' : '设置登录密码'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: GAMIFIED TOOLS & REFILLS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Refill Hearts */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4.5 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block">悟道体能补给</span>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                一键补满生命值
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                大考失败或回答错误会损耗您的生命心形。点击按钮重新满血复活，恢复 5 颗心心！
              </p>
            </div>
            <button
              onClick={onRefillHearts}
              className="mt-4 w-full py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-red-100 dark:border-red-950/50 transition-all cursor-pointer active:scale-95"
            >
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              <span>瞬间“满血复活”(❤️ 补满至 5)</span>
            </button>
          </div>

          {/* Unlock All Levels */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4.5 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-widest block">自由通关模式</span>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-500" />
                一键解锁全部关卡
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                无需按顺序逐步考过，一键打开全部 8 章 16 门关卡与临床案例沙盒，自由学习！
              </p>
            </div>
            <button
              onClick={onUnlockAllLevels}
              className="mt-4 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md shadow-amber-500/20"
            >
              <Award className="w-4 h-4" />
              <span>开启全关卡自由模式</span>
            </button>
          </div>

          {/* Reset progress */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4.5 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block">归零重建</span>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-red-500" />
                重置学习进度
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                清除本地浏览器缓存中的所有关卡解锁信息与考试成绩，重新归零温故而知新。
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm("确定要全部推倒重来，清除所有已解锁进度吗？")) {
                  onResetProgress();
                }
              }}
              className="mt-4 w-full py-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-zinc-200 dark:border-zinc-700 transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>全部清空重来</span>
            </button>
          </div>
        </div>

        {/* THEORETICAL STATEMENT BRIEFING */}
        <div className="bg-emerald-600/5 dark:bg-zinc-900/30 border border-emerald-500/10 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
            <Award className="w-5 h-5" />
            《内景解伤寒》理论初衷声明
          </h4>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            本多邻国系统本着<strong>《愤怒的小中医》</strong>之伤寒核心内景解剖学宗旨进行立体开发：摒弃玄学化的虚词与模糊定义，将中医辨证与处方，完全建立在血分推动力（血管流速压力）、气分通透度（细胞外水流和淋巴引流）、以及玄府门轴（皮肤黏膜孔道开闭）的纯物理流体力学运转之上。
            通过“循序渐进”的卡牌式理论拆解与“临床问诊沙盒”，全方位立体教会用户如何物理学理解经方，使祖国医学实现科学化、直观化、可计算化，拒绝纸上谈兵，实战辨治一切外感与里伤寒杂病。
          </p>
        </div>
      </div>
    </div>
  );
}
