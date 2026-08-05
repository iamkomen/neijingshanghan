/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, BookOpenCheck, Trash2, CheckCircle2, AlertCircle, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { getWrongQuestions, removeWrongQuestion, clearWrongQuestions, WrongQuestionItem } from '../utils/wrongQuestions';

interface WrongQuestionsModalProps {
  onClose: () => void;
}

export default function WrongQuestionsModal({ onClose }: WrongQuestionsModalProps) {
  const [items, setItems] = useState<WrongQuestionItem[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [checkedStatus, setCheckedStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setItems(getWrongQuestions());
  }, []);

  const handleRemove = (id: string) => {
    const updated = removeWrongQuestion(id);
    setItems(updated);
  };

  const handleClearAll = () => {
    if (window.confirm("确定要清空错题本中的所有题目吗？")) {
      clearWrongQuestions();
      setItems([]);
    }
  };

  const handleSelectOption = (itemKey: string, option: string) => {
    if (checkedStatus[itemKey]) return;
    setSelectedAnswers(prev => ({ ...prev, [itemKey]: option }));
  };

  const handleCheckAnswer = (itemKey: string) => {
    setCheckedStatus(prev => ({ ...prev, [itemKey]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp">
        
        {/* HEADER */}
        <div className="px-6 py-4 bg-emerald-50/50 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                伤寒辨证 · 错题本
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  {items.length} 题
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                自动收集平日常识测验与大考中的错题，反复推导温故知新。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                title="清空错题本"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">清空</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            /* EMPTY STATE - Required by test checklist */
            <div className="text-center py-16 space-y-4 max-w-sm mx-auto">
              <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
                <Sparkles className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  暂无错题，功力深厚！
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  您在各小节练习与大考中均保持了极高的辨证准确率。继续保持！
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                返回学堂学习
              </button>
            </div>
          ) : (
            /* WRONG QUESTIONS LIST */
            <div className="space-y-6">
              {items.map((item, idx) => {
                const itemKey = item.id || `item_${idx}`;
                const userChoice = selectedAnswers[itemKey];
                const isChecked = checkedStatus[itemKey];

                return (
                  <div
                    key={itemKey}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 relative group"
                  >
                    {/* Item Top Badge */}
                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-2.5">
                      <span className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-[11px] rounded-md">
                        错题 {idx + 1} · {item.topicTitle}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-zinc-400 hover:text-red-500 text-xs font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-all cursor-pointer"
                        title="移出错题本"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>移除</span>
                      </button>
                    </div>

                    {/* Question text */}
                    <h4 className="text-xs md:text-sm font-bold text-zinc-800 dark:text-zinc-100 leading-relaxed">
                      {item.question}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2">
                      {item.options.map((opt, optIdx) => {
                        const isSelected = userChoice === opt;
                        const isCorrectOpt = opt === item.answer;

                        let style = "bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200";
                        if (isSelected) {
                          style = "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20";
                        }
                        if (isChecked) {
                          if (isCorrectOpt) {
                            style = "bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold";
                          } else if (isSelected) {
                            style = "bg-red-500/10 border-red-500 text-red-800 dark:text-red-200";
                          } else {
                            style = "bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-800 text-zinc-400 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(itemKey, opt)}
                            className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${style}`}
                          >
                            <span>{opt}</span>
                            {isChecked && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Action or Explanation */}
                    {!isChecked ? (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleCheckAnswer(itemKey)}
                          disabled={!userChoice}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            userChoice
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                          }`}
                        >
                          重新重答验证
                        </button>
                      </div>
                    ) : (
                      <div className="bg-amber-50/70 dark:bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl p-3.5 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                        <div>
                          <p className="font-bold text-emerald-800 dark:text-emerald-300">【内景物理正解】</p>
                          <p className="leading-relaxed font-sans">{item.explanation}</p>
                        </div>
                        {item.errorAttribution && (
                          <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/60">
                            <p className="font-bold text-red-800 dark:text-red-300">【内景病机·错误归因剖析】</p>
                            <p className="leading-relaxed font-sans text-red-900/90 dark:text-red-200">{item.errorAttribution}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            完成复习
          </button>
        </div>

      </div>
    </div>
  );
}
