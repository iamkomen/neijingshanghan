/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface TCMDiagramProps {
  type: 'xuanfu' | 'circulation' | 'pig' | 'water' | 'rat';
  animate?: boolean;
}

export default function TCMDiagram({ type, animate = true }: TCMDiagramProps) {
  const animClass = animate ? 'transition-all duration-1000' : '';

  switch (type) {
    case 'xuanfu':
      return (
        <div className="flex flex-col items-center bg-emerald-50/50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-emerald-100 dark:border-zinc-800">
          <svg viewBox="0 0 400 200" className="w-full max-w-sm h-48 drop-shadow-md">
            {/* Skin Surface */}
            <rect x="10" y="80" width="380" height="30" fill="#f4ebe1" stroke="#d5c8ba" strokeWidth="2" rx="4" />
            <text x="20" y="100" className="text-xs font-semibold fill-zinc-600">体表微循环 (毛细血管外层)</text>

            {/* Closed Pores (left) */}
            <g>
              <line x1="100" y1="75" x2="100" y2="115" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
              <line x1="120" y1="75" x2="120" y2="115" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
              <circle cx="110" cy="95" r="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
              <text x="110" y="99" textAnchor="middle" className="text-[10px] fill-red-600 font-bold font-mono">X</text>
              <text x="110" y="65" textAnchor="middle" className="text-xs fill-red-500 font-semibold">玄府死闭 (恶寒无汗)</text>
              {/* Cold waves blocking */}
              <path d="M 90 40 Q 110 50 130 40" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4" className="animate-pulse" />
            </g>

            {/* Open/Vaporizing Pores (right) */}
            <g>
              {/* Open Gate */}
              <line x1="280" y1="75" x2="280" y2="115" stroke="#10b981" strokeWidth="2" strokeDasharray="3" />
              <line x1="310" y1="75" x2="310" y2="115" stroke="#10b981" strokeWidth="2" strokeDasharray="3" />
              {/* Rising Qi-Vapor */}
              <path d="M 295 120 Q 285 70 295 40" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" className="animate-bounce" />
              <path d="M 305 120 Q 315 70 305 40" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" className="animate-bounce" />
              <text x="295" y="65" textAnchor="middle" className="text-xs fill-emerald-600 font-semibold">营卫和 (水化气出)</text>
            </g>

            {/* Blood vessels beneath */}
            <path d="M 10 150 Q 200 130 390 150" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
            <text x="200" y="170" textAnchor="middle" className="text-xs fill-red-500 font-semibold">血分 (脉内血液流速)</text>
          </svg>
          <div className="mt-4 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
              <strong>内景解码：</strong>左侧受寒玄府全闭，热气在肌肉憋阻产生体痛；右侧辛散温通，玄府打开，血气转化为汗液散逸。
            </p>
          </div>
        </div>
      );

    case 'circulation':
      return (
        <div className="flex flex-col items-center bg-rose-50/50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-rose-100 dark:border-zinc-800">
          <svg viewBox="0 0 400 200" className="w-full max-w-sm h-48 drop-shadow-md">
            {/* Artery */}
            <path d="M 20 50 L 380 50" stroke="#f43f5e" strokeWidth="8" strokeLinecap="round" />
            <text x="40" y="38" className="text-xs font-bold fill-rose-600 font-mono">动脉路 (血分・富氧/营养)</text>

            {/* Vein */}
            <path d="M 20 150 L 380 150" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
            <text x="40" y="175" className="text-xs font-bold fill-blue-600 font-mono">静脉回流 (酸收・大分子回收)</text>

            {/* Extracellular Grid (Qi area) */}
            <rect x="80" y="70" width="240" height="60" fill="#fef2f2" stroke="#fda4af" strokeWidth="1" strokeDasharray="3" rx="8" />
            <text x="200" y="105" textAnchor="middle" className="text-xs font-semibold fill-rose-700">气分 (组织细胞/淋巴间隙)</text>

            {/* Pushing Out (Guizhi) */}
            <g className="animate-pulse">
              <path d="M 120 58 L 120 85" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow)" />
              <text x="130" y="75" className="text-[10px] fill-rose-600 font-bold">桂枝化气 (出)</text>
            </g>

            {/* Drawing Back (Shaoyao) */}
            <g className="animate-pulse">
              <path d="M 280 125 L 280 142" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow)" />
              <text x="210" y="135" className="text-[10px] fill-blue-600 font-bold">白芍静脉回收 (入)</text>
            </g>

            {/* SVG Markers */}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
              </marker>
            </defs>
          </svg>
          <div className="mt-4 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
              <strong>内景解码：</strong>血液（营气）在外溢压下气化为卫气，进入气分细胞；静脉（由白芍控制）放松玄府，将代谢废物重新拉回血液系统。
            </p>
          </div>
        </div>
      );

    case 'pig':
      return (
        <div className="flex flex-col items-center bg-orange-50/50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-orange-100 dark:border-zinc-800">
          <svg viewBox="0 0 400 200" className="w-full max-w-sm h-48 drop-shadow-md">
            {/* Inner Core (Hot Little Pig) */}
            <rect x="80" y="80" width="240" height="70" fill="#fde047" stroke="#eab308" strokeWidth="2" rx="20" />
            <text x="200" y="110" textAnchor="middle" className="text-sm font-bold fill-amber-700">小猪 (脏腑核心产热)</text>
            <text x="200" y="135" textAnchor="middle" className="text-xs fill-amber-600 font-semibold">🔥 内部热量极大 (郁热)</text>

            {/* Heavy Blanket (Thick Fluid Stagnation) */}
            <path d="M 60 70 C 130 50, 270 50, 340 70 L 340 95 C 270 85, 130 85, 60 95 Z" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
            <text x="200" y="65" textAnchor="middle" className="text-xs font-bold fill-slate-600">重被 (痰湿瘀阻・气分不通)</text>

            {/* Heat blocked */}
            <path d="M 200 45 L 200 15" stroke="#ef4444" strokeWidth="3" strokeDasharray="3" />
            <text x="200" y="10" textAnchor="middle" className="text-xs fill-red-500 font-bold">🚫 热量被棉被挡住！到不了四肢</text>

            {/* Cold Extremities */}
            <circle cx="30" cy="115" r="20" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
            <text x="30" y="119" textAnchor="middle" className="text-[10px] fill-blue-600 font-bold font-mono">冰四肢</text>
            <circle cx="370" cy="115" r="20" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
            <text x="370" y="119" textAnchor="middle" className="text-[10px] fill-blue-600 font-bold font-mono">冰四肢</text>
          </svg>
          <div className="mt-4 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
              <strong>内景解码：</strong>小猪盖被代表胸膜腹膜被黏腻的痰湿完全包裹。内脏在发热，但热度无法传递给表层与四肢，形成“里热表寒、四肢厥逆”。
            </p>
          </div>
        </div>
      );

    case 'water':
      return (
        <div className="flex flex-col items-center bg-cyan-50/50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-cyan-100 dark:border-zinc-800">
          <svg viewBox="0 0 400 200" className="w-full max-w-sm h-48 drop-shadow-md">
            {/* Water Central Pool */}
            <circle cx="200" cy="100" r="30" fill="#a5f3fc" stroke="#06b6d4" strokeWidth="2" />
            <text x="200" y="104" textAnchor="middle" className="text-xs font-bold fill-cyan-700">体内水饮 (阴实)</text>

            {/* Path 1: Sweat */}
            <g className="animate-pulse">
              <path d="M 200 70 L 200 20" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow-cyan)" />
              <text x="205" y="45" className="text-[10px] fill-emerald-600 font-bold">1. 皮肤玄府排汗 (麻黄/桂枝)</text>
            </g>

            {/* Path 2: Urine */}
            <g className="animate-pulse">
              <path d="M 200 130 L 200 180" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow-cyan)" />
              <text x="205" y="165" className="text-[10px] fill-blue-600 font-bold">2. 肾小管小便排尿 (猪苓/泽泻)</text>
            </g>

            {/* Path 3: Lymph */}
            <g className="animate-pulse">
              <path d="M 170 100 L 100 100" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrow-cyan)" />
              <text x="80" y="85" className="text-[10px] fill-amber-600 font-bold">3. 淋巴回收 (白术/茯苓)</text>
            </g>

            {/* Path 4: Blood Vessels */}
            <g className="animate-pulse">
              <path d="M 230 100 L 300 100" stroke="#f43f5e" strokeWidth="3" markerEnd="url(#arrow-cyan)" />
              <text x="270" y="120" className="text-[10px] fill-rose-600 font-bold">4. 静脉血管重吸 (白芍)</text>
            </g>

            <defs>
              <marker id="arrow-cyan" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
              </marker>
            </defs>
          </svg>
          <div className="mt-4 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
              <strong>内景解码：</strong>解决水滞（水肿）的四大法门。靠表则发汗，靠下则小便，滞留淋巴用白术，血管泄水重吸用白芍。
            </p>
          </div>
        </div>
      );

    case 'rat':
      return (
        <div className="flex flex-col items-center bg-violet-50/50 dark:bg-zinc-900/40 p-6 rounded-2xl border border-violet-100 dark:border-zinc-800">
          <svg viewBox="0 0 400 200" className="w-full max-w-sm h-48 drop-shadow-md">
            {/* Upper Chest (Heat Trap) */}
            <rect x="50" y="20" width="300" height="60" fill="#fee2e2" stroke="#f87171" strokeWidth="2" rx="10" />
            <text x="200" y="45" textAnchor="middle" className="text-xs font-bold fill-red-600">上焦热腔 (心脑灼烧・虚烦/目赤)</text>
            <text x="200" y="65" textAnchor="middle" className="text-[10px] fill-red-500 font-semibold">🔥 精气积压在上无法下行</text>

            {/* Lower Abdomen (Ice Core) */}
            <rect x="50" y="120" width="300" height="60" fill="#eff6ff" stroke="#60a5fa" strokeWidth="2" rx="10" />
            <text x="200" y="145" textAnchor="middle" className="text-xs font-bold fill-blue-600">下焦寒核 (小肠/子宫冰冻・下利)</text>
            <text x="200" y="165" textAnchor="middle" className="text-[10px] fill-blue-500 font-semibold">❄️ 阳虚寒凝・细胞代谢关闭</text>

            {/* Separation Block (Rat) */}
            <g className="animate-pulse">
              <line x1="50" y1="100" x2="350" y2="100" stroke="#7c3aed" strokeWidth="4" strokeDasharray="6" />
              <text x="200" y="95" textAnchor="middle" className="text-xs font-bold fill-violet-700">压耗子 (上下交通阻绝)</text>
            </g>
          </svg>
          <div className="mt-4 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
              <strong>内景解码：</strong>中焦或下焦寒凝收缩，导致下部的阳气无法往上走，而上部的血液和精气也回流不下来。热全憋在头脑，寒全沉在腹部双脚。
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
