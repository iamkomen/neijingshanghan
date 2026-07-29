/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Sparkles, BookOpen, UserCheck, Cpu, Play, Award, ClipboardCheck } from 'lucide-react';

interface PromptTemplate {
  id: string;
  title: string;
  tag: string;
  description: string;
  icon: string;
  baseTemplate: string;
  variables: { name: string; label: string; placeholder: string; defaultValue: string }[];
}

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'tutor',
    title: '经方内景物理导师・提示词',
    tag: '深度参悟',
    description: '此提示词能将 AI 转化为一位严谨的“流体力学中医学家”。不谈空泛玄学，只用细胞渗透压、动静脉压、玄府（细胞膜通道）开闭及气水分流物理模型，深度解剖任意中药方剂的物理运转全景。',
    icon: 'Cpu',
    baseTemplate: `你现在是一位精通《伤寒论》并拥有现代物理、流体力学与微循环生理学背景的“经方内景学派大导师”。
请针对用户给出的方剂：【{formula}】，以及相关疾病表现，进行符合“物理流体观”的深度剖析。

分析要求：
1. 【玄府开合】：分析该方剂如何调控皮肤/黏膜的细胞孔隙（玄府）状态（强开、微通、强闭、滋润）。
2. 【气水分流】：从“气分（组织间隙、细胞外液）”与“血分（血管及细胞内液）”的压力差角度，解释药液如何推动水液回流或排泄，解释如“小猪盖被（水寒停滞）”或“乌鸦喝水（阴虚燥结）”等物理图景。
3. 【药效力学】：逐一拆解方中核心药对（例如：桂枝配芍药、麻黄配杏仁等）在体内的“推-拉平衡”物理回流环。
4. 【学术本源】：结合《伤寒论》原文第几条，提供经文支撑，拒绝信口雌黄和现代西医强行套用，要遵循仲景内景生理学逻辑。

请用温和、权威、极具启发性的中医学堂导师口吻进行解答。`,
    variables: [
      { name: 'formula', label: '目标方剂 / 经方名称', placeholder: '如：桂枝加桂汤、真武汤、五苓散', defaultValue: '五苓散' }
    ]
  },
  {
    id: 'case_gen',
    title: '不重复临床案例考题器・提示词',
    tag: '组卷出题',
    description: '此提示词能驱使 AI 扮演严格的“中医执业大考出题官”。动态生成具有高还原度、脉舌物理征象完备的临床患者案例，专门考核用户对“玄府-气分-血分”物理辩证的实战拆解能力。',
    icon: 'ClipboardCheck',
    baseTemplate: `你现在是“内景伤寒多邻国学堂”的终极主考官。你需要为学生定制一道难度极高、极具临床实战意义的单项选择题。
考查的核心概念或条文是：【{concept}】。

出题原则：
1. 【杜绝重样】：严禁直接复制教科书原题。必须编撰一个栩栩如生的现代临床病案。
2. 【高保真物理指标】：病案必须包含患者性别、年龄、确切的主诉症状、详细的【脉象】（如脉浮紧而顶指、脉虚缓而按之无力）和【舌象】（如舌体水滑、舌边红起刺等），这些指标必须物理契合该条文对应的内景流体力学改变。
3. 【诱惑选项】：设计4个选项（A、B、C、D）。正确答案必须是从“玄府/气分/血分物理机制”或“对应经典方剂物理靶点”出发。干扰项必须具有极强的学术诱惑力（例如错误套用温病学说，或者错误的物理回流方向）。
4. 【硬核解析】：提供极其深刻的“玄府-气分-血分”细胞级物理原理解析，讲清楚为什么其他选项是物理学或生理学上的死胡同。

返回格式必须为：
问题：...
选项：A... B... C... D...
正确答案：...
内景硬核解析：...`,
    variables: [
      { name: 'concept', label: '考核条文或病机概念', placeholder: '如：太阳病第39条麻黄汤、太阴病脾虚湿阻等', defaultValue: '少阴病真武汤（心肾阳衰，水饮泛滥）' }
    ]
  },
  {
    id: 'debater',
    title: '伤寒条文物理对质导师・提示词',
    tag: '深度对质',
    description: '此提示词能让 AI 扮演一位“挑剔的学术对质导师”。在对话中，它会不断针对您提出的治疗方案或药对配伍进行刨根问底式物理追问，直到您的物理辨证完全无懈可击。',
    icon: 'UserCheck',
    baseTemplate: `你现在是伤寒论物理辨证学派的“辩证审判官”。
用户是一位正在进行太阳/太阴病修行的小中医。当用户向你汇报他对【{condition}】的方药治疗思路（如使用了【{plan}】）时，你需要进行学术“刺穿式”追问。

对质规则：
1. 肯定其方剂中的精妙药对，但立刻指出一个他可能忽视的【流体物理死角】（例如：“你用了大量麻黄强开玄府，你确定患者心脏的泵血动力足够支撑，不会导致血管内压暴跌发生休克吗？”）。
2. 要求用户必须从“玄府开合”与“动静脉回流压差”的角度解释他如何防止这种副作用。
3. 如果用户回答不圆满，请用仲景《伤寒论》原文相关的禁忌条文（例如：脉微弱者不可发汗）对其进行严肃喝退，并传授正确的内景规避心法。`,
    variables: [
      { name: 'condition', label: '临床病机/症状', placeholder: '如：脾虚水肿、外寒内饮', defaultValue: '体表受寒且素体心阳不足' },
      { name: 'plan', label: '治疗方案/药对', placeholder: '如：重用麻黄发汗', defaultValue: '重用麻黄强力发汗宣肺' }
    ]
  }
];

export default function PromptHub() {
  const [activeTab, setActiveTab] = useState<string>('tutor');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [varValues, setVarValues] = useState<Record<string, string>>({
    formula: '五苓散',
    concept: '少阴病真武汤（心肾阳衰，水饮泛滥）',
    condition: '体表受寒且素体心阳不足',
    plan: '重用麻黄强力发汗宣肺'
  });

  const activeTemplate = PROMPT_TEMPLATES.find(t => t.id === activeTab) || PROMPT_TEMPLATES[0];

  const handleValueChange = (varName: string, value: string) => {
    setVarValues(prev => ({
      ...prev,
      [varName]: value
    }));
  };

  // Compile the prompt by replacing bracket variables
  const compiledPrompt = activeTemplate.baseTemplate.replace(/{([^{}]+)}/g, (match, key) => {
    return varValues[key] || match;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setCopiedId(activeTemplate.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn" id="prompt-hub-workspace">
      {/* Intro Header */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">交互吸收教学心法</span>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">仲景内景物理・AI 提示词悟道学堂</h2>
          </div>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-3xl">
          多邻国式学习不仅在乎知识的输入，更在乎您如何利用 AI 进行动态、个性化的反馈交流。
          我们为您精心提炼、打磨了三套<strong>“金牌物理内景提示词”</strong>。您可以直接在下方调整临床参数，一键复制进 Gemini 聊天中，让 AI 成为您不眠不休的专属伤寒助教。
        </p>
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left selector rails */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <p className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest pl-2">
            选择提示词法门 / Templates
          </p>
          <div className="flex flex-col gap-2">
            {PROMPT_TEMPLATES.map(tmpl => {
              const isActive = tmpl.id === activeTab;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setActiveTab(tmpl.id)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs font-bold transition-all flex flex-col gap-1.5 ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/10'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50">
                      {tmpl.tag}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">悟道点 +10</span>
                  </div>
                  <h4 className="text-sm font-bold tracking-tight mt-1">{tmpl.title}</h4>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal line-clamp-2">
                    {tmpl.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right workspace panel */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-6 flex flex-col shadow-lg">
          {/* Header */}
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 space-y-1">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              提示词实操工作区 · {activeTemplate.title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-450 leading-relaxed">
              输入您的个性化临床病理指标或药方，下方将自动在物理内景骨架中编译您的专属提示词，立即可用。
            </p>
          </div>

          {/* Interactive Parameters Input */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 space-y-4">
            <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-350 uppercase tracking-wide flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              调整以下动态参数 (Live Compile):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {activeTemplate.variables.map(variable => (
                <div key={variable.name} className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    {variable.label}
                  </label>
                  <input
                    type="text"
                    value={varValues[variable.name] || ''}
                    placeholder={variable.placeholder}
                    onChange={(e) => handleValueChange(variable.name, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-750 bg-white dark:bg-zinc-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-zinc-100"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Prompt Preview Codeblock */}
          <div className="flex flex-col flex-1 space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest">
                实时编译预览 / Compiled System Prompt
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100 dark:border-emerald-900 transition-all active:scale-95 cursor-pointer"
              >
                {copiedId === activeTemplate.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>已成功复制到剪贴板！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>一键复制提示词</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-zinc-950 dark:bg-black rounded-2xl p-5 border border-zinc-800 shadow-inner max-h-[300px] overflow-y-auto relative">
              <pre className="text-[11px] leading-relaxed font-mono text-zinc-300 whitespace-pre-wrap break-all select-all">
                {compiledPrompt}
              </pre>
            </div>
          </div>

          {/* Duolingo absorption tips */}
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-[11px] leading-relaxed border border-emerald-500/25 flex items-start gap-3">
            <Award className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-900 dark:text-emerald-300">💡 多邻国大医进修建议：</span>
              <p className="text-zinc-600 dark:text-zinc-400">
                将此复制发送给大语言模型（如 Gemini-1.5/3.5）后，它会为您量身定制不重样的考核题，并带着您在细胞通道与循环回流的海洋中模拟辨证。将 AI 导师得出的核心解释结合本系统的<strong>「AI 物理问诊」</strong>功能相互印证，能让您在 7 天内深度背诵并完美理解《伤寒论》核心大纲条文！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
