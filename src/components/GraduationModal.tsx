/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Award, Trophy, Sparkles, CheckCircle2, Share2, Download } from 'lucide-react';
import { UserState } from '../types';

interface GraduationModalProps {
  userState: UserState;
  onClose: () => void;
}

export default function GraduationModal({ userState, onClose }: GraduationModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-gradient-to-b from-amber-50 via-white to-amber-50/30 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 rounded-3xl border-2 border-amber-300/80 dark:border-amber-700/60 shadow-2xl p-6 sm:p-8 text-center space-y-6 relative overflow-hidden animate-scaleUp">
        
        {/* Decorative ambient background flares */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy / Certificate Badge */}
        <div className="relative inline-block mx-auto pt-2">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 border-4 border-white dark:border-zinc-800 flex items-center justify-center text-white shadow-xl shadow-amber-500/20 mx-auto">
            <Trophy className="w-12 h-12 stroke-[2.2] animate-bounce" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-1.5 border-2 border-white dark:border-zinc-900 shadow-md">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Graduation Title */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900">
            🎓 结业大典 · 功德圆满
          </span>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight font-serif">
            《伤寒论》物理内景全篇结业证书
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            特此颁发给 <strong className="text-amber-600 dark:text-amber-400 text-sm font-bold">{userState.name || '岐黄弟子'}</strong> 同学，恭喜您通关全部 8 大章节 16 门关卡，领悟唯物物理内景真谛！
          </p>
        </div>

        {/* Certificate Parchment Box */}
        <div className="bg-amber-100/40 dark:bg-zinc-900/80 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 text-left space-y-3 font-serif shadow-inner">
          <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-amber-900/40 pb-2">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">【经方修业鉴定】</span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">证书编号: TCM-2026-9999</span>
          </div>
          <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed italic">
            “自古医道同源，唯物内景破迷思。今已通达太阳、阳明、少阳、太阴、少阴、厥阴六经辨证，熟谙微循环与水液代谢物理规律。”
          </p>
          <div className="flex justify-between items-center text-[11px] font-mono text-zinc-600 dark:text-zinc-400 pt-1">
            <span>修业评价: <strong>大医精诚 · 考核全优</strong></span>
            <span>中医学堂教研组</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => {
              alert("已生成结业典礼分享卡片，可截图保存！");
            }}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>分享荣誉勋章</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            返回学堂大地图
          </button>
        </div>

      </div>
    </div>
  );
}
