/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BookMarked, Plus, Search, Calendar, Tag, Star, Trash2, Edit3, Save, Download, Sparkles, Check, FileText, Activity, Layers } from 'lucide-react';
import VisceraAnatomicalDiagram from './VisceraAnatomicalDiagram';

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  chapterTag: string;
  content: string;
  keyInsight: string;
  rating: number; // 1 to 5
  createdAt: number;
}

interface StudyJournalProps {
  onSelectTopic?: (topicId: string) => void;
}

const DEFAULT_TAGS = [
  "第1章 • 中医思维根基",
  "第2章 • 八纲辨证详解",
  "第3章 • 人体内景",
  "第4章 • 太阳病与营卫",
  "第5章 • 阳明少阳与三阴",
  "第6章 • 问诊与五步思维链",
  "第7章 • 巧良医经验方",
  "第8章 • 伤寒病例实战",
  "随感悟道"
];

const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: "entry_1",
    date: new Date().toISOString().split('T')[0],
    title: "参悟桂枝汤之“推-拉”营卫流体力学",
    chapterTag: "第4章 • 太阳病与营卫",
    keyInsight: "桂枝向外推（促进血化气），白芍向内拉（促进气入血），姜枣草补充体液内容物。",
    content: "今日复习《伤寒论》太阳病篇桂枝汤条文。传统理论常说“调和营卫”，但概念极为抽象。按物理内景理论解构：营为血管内有质量之血液，卫为玄府外之功能气化。桂枝强心扩张动脉向体表“推”，白芍松弛静脉平滑肌促进血液回心“拉”，形成血管内外完美的流体力学环流。临床若遇恶风发热、汗出脉浮者，此方即能瞬间恢复营卫动能闭环！",
    rating: 5,
    createdAt: Date.now() - 86400000
  },
  {
    id: "entry_2",
    date: new Date().toISOString().split('T')[0],
    title: "白虎汤与承气汤：细胞散热与高渗润燥的本质区别",
    chapterTag: "第5章 • 阳明少阳与三阴",
    keyInsight: "石膏抑制线粒体超频产热，知母关闭水通道；芒硝利用高渗盐析将水分吸入肠道泡软燥屎。",
    content: "深入分析阳明病两大学说：白虎汤主治无形之热，石膏与知母直接降低细胞产热效率并锁住体内津液；承气汤主治有形之燥屎结聚，大黄推动肠道蠕动，芒硝创造高渗透压环境吸引组织液充盈肠腔。两者皆为阳明热症，但一者在细胞膜物理层面降温，一者在胃肠管道层面通下，严丝合缝，不差毫厘。",
    rating: 5,
    createdAt: Date.now()
  }
];

export default function StudyJournal({ onSelectTopic }: StudyJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'diagram' | 'entries'>('diagram');

  // Form states
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formTitle, setFormTitle] = useState('');
  const [formTag, setFormTag] = useState(DEFAULT_TAGS[0]);
  const [formKeyInsight, setFormKeyInsight] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formRating, setFormRating] = useState(5);

  // Load entries from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("sh_study_journal_entries");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
          return;
        }
      } catch (err) {
        console.error("Failed to parse journal entries", err);
      }
    }
    // Fallback to initial
    setEntries(INITIAL_ENTRIES);
    localStorage.setItem("sh_study_journal_entries", JSON.stringify(INITIAL_ENTRIES));
  }, []);

  // Save entries helper
  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem("sh_study_journal_entries", JSON.stringify(newEntries));
  };

  const handleOpenAdd = () => {
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTitle('');
    setFormTag(DEFAULT_TAGS[0]);
    setFormKeyInsight('');
    setFormContent('');
    setFormRating(5);
    setEditingId(null);
    setIsAdding(true);
  };

  const handleOpenEdit = (entry: JournalEntry) => {
    setFormDate(entry.date);
    setFormTitle(entry.title);
    setFormTag(entry.chapterTag);
    setFormKeyInsight(entry.keyInsight);
    setFormContent(entry.content);
    setFormRating(entry.rating);
    setEditingId(entry.id);
    setIsAdding(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      alert("请填写日记标题与心得体会内容。");
      return;
    }

    if (editingId) {
      const updated = entries.map(item => item.id === editingId ? {
        ...item,
        date: formDate,
        title: formTitle.trim(),
        chapterTag: formTag,
        keyInsight: formKeyInsight.trim(),
        content: formContent.trim(),
        rating: formRating
      } : item);
      saveEntries(updated);
    } else {
      const newEntry: JournalEntry = {
        id: `entry_${Date.now()}`,
        date: formDate,
        title: formTitle.trim(),
        chapterTag: formTag,
        keyInsight: formKeyInsight.trim(),
        content: formContent.trim(),
        rating: formRating,
        createdAt: Date.now()
      };
      saveEntries([newEntry, ...entries]);
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("确定要删除这篇修行日记吗？")) {
      const filtered = entries.filter(item => item.id !== id);
      saveEntries(filtered);
    }
  };

  // Export entries as Markdown file
  const handleExportJournal = () => {
    let markdownText = `# 伤寒内景经方学堂 • 弟子修行悟道日记\n\n`;
    markdownText += `导出时间：${new Date().toLocaleString()}\n`;
    markdownText += `总记篇数：${entries.length} 篇\n\n`;
    markdownText += `---\n\n`;

    entries.forEach((entry, idx) => {
      markdownText += `## ${idx + 1}. ${entry.title}\n`;
      markdownText += `- **日期**：${entry.date}\n`;
      markdownText += `- **章节标签**：${entry.chapterTag}\n`;
      markdownText += `- **悟道评级**：${'★'.repeat(entry.rating)}\n`;
      if (entry.keyInsight) {
        markdownText += `- **核心金句**：> ${entry.keyInsight}\n`;
      }
      markdownText += `\n**心得体会**：\n${entry.content}\n\n`;
      markdownText += `---\n\n`;
    });

    const blob = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `伤寒论修行日记_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter logic
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.keyInsight.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === '全部' || entry.chapterTag === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 space-y-6 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#556B2F] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <BookMarked className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              修行日记 · 伤寒心得
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
                {entries.length} 篇悟道
              </span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              记录每日针对《伤寒论》与物理内景学说的心得体会、经方机制推导与临床感悟。数据永久保存在本地。
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJournal}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="导出为 Markdown 文档"
          >
            <Download className="w-4 h-4" />
            <span>导出日记</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>记一篇日记</span>
          </button>
        </div>
      </div>

      {/* SUB-MODULE TABS */}
      <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => setActiveTab('diagram')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'diagram'
              ? 'bg-white dark:bg-zinc-900 text-stone-900 dark:text-stone-100 shadow-md border border-zinc-200 dark:border-zinc-700'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Activity className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>【交互解剖图】内景脏腑经络图</span>
        </button>

        <button
          onClick={() => setActiveTab('entries')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'entries'
              ? 'bg-white dark:bg-zinc-900 text-stone-900 dark:text-stone-100 shadow-md border border-zinc-200 dark:border-zinc-700'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <BookMarked className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>【修行日记】悟道心得列表 ({entries.length})</span>
        </button>
      </div>

      {/* VISCERA ANATOMICAL DIAGRAM MODULE */}
      {activeTab === 'diagram' && (
        <VisceraAnatomicalDiagram onSelectTopic={onSelectTopic} />
      )}

      {/* JOURNAL ENTRIES MODULE */}
      {activeTab === 'entries' && (
        <>
          {/* ADD / EDIT FORM MODAL */}
      {isAdding && (
        <div className="bg-white dark:bg-zinc-900 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-4 animate-scaleUp">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              {editingId ? "编辑修行日记" : "写下今日悟道心得"}
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-bold px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800"
            >
              取消
            </button>
          </div>

          <form onSubmit={handleSaveForm} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Date */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">日期</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  required
                />
              </div>

              {/* Tag */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">关联章节 / 模块</label>
                <select
                  value={formTag}
                  onChange={(e) => setFormTag(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                >
                  {DEFAULT_TAGS.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">悟道程度</label>
                <div className="flex items-center gap-1 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 cursor-pointer focus:outline-none"
                    >
                      <Star className={`w-5 h-5 ${star <= formRating ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-700'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-zinc-500 ml-2">{formRating} 星悟道</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">日记标题</label>
              <input
                type="text"
                placeholder="例如：读桂枝汤调和营卫有感、阳明腑实下法流体力学心得..."
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
              />
            </div>

            {/* Key Insight */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">核心金句 / 内景物理提炼 (选填)</label>
              <input
                type="text"
                placeholder="例如：桂枝向外推，白芍向内收，形成内外营卫动能循环..."
                value={formKeyInsight}
                onChange={(e) => setFormKeyInsight(e.target.value)}
                className="w-full bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl px-3 py-2 text-xs font-medium text-amber-900 dark:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-[11px] font-bold text-zinc-500 uppercase mb-1">心得体会与详细推导</label>
              <textarea
                rows={5}
                placeholder="写下今日针对经方条文、药靶物理机制、病理推导的详细体会..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-xs leading-relaxed font-sans text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>保存日记</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white dark:bg-zinc-900 p-4 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="搜索日记内容或标题..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 pl-9 pr-3 py-1.5 text-xs font-medium rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedTag('全部')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedTag === '全部'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            全部 ({entries.length})
          </button>
          {DEFAULT_TAGS.map(tag => {
            const count = entries.filter(e => e.chapterTag === tag).length;
            if (count === 0) return null;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {tag.split('•')[0]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* JOURNAL ENTRIES LIST */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h4 className="text-sm font-bold text-zinc-600 dark:text-zinc-400">暂无匹配的修行日记</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            在日常研读《伤寒论》与刷题过程中，随时记录您的物理内景灵感与研习体会。
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 mt-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            新建第一篇日记
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3 relative group"
            >
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] rounded-md border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {entry.chapterTag}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {entry.date}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5" title={`${entry.rating} 星悟道`}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= entry.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 dark:text-zinc-800'}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                    <button
                      onClick={() => handleOpenEdit(entry)}
                      className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                      title="编辑"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                {entry.title}
              </h3>

              {/* Key Insight Highlight Quote Box */}
              {entry.keyInsight && (
                <div className="bg-amber-50/60 dark:bg-amber-950/30 border-l-4 border-amber-500 rounded-r-xl p-3 text-xs text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                  <span className="font-bold mr-1.5">【核心内景金句】</span>
                  {entry.keyInsight}
                </div>
              )}

              {/* Detailed Journal Content */}
              <p className="text-xs text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed font-sans">
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}
