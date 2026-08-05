/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Thermometer, Stethoscope, Calculator, AlertTriangle, BookOpen, CheckCircle, Flame, Sparkles } from 'lucide-react';

interface ColdFluProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ColdFluProtocolModal({ isOpen, onClose }: ColdFluProtocolModalProps) {
  // Symptom Checker State
  const [feverCold, setFeverCold] = useState<'wu_han' | 'you_han' | 'wang_lai'>('wu_han');
  const [phlegmType, setPhlegmType] = useState<'none' | 'white_thin' | 'yellow_thick' | 'water_rooster' | 'mixed'>('white_thin');
  const [thirstType, setThirstType] = useState<'not_thirsty' | 'thirsty_cold' | 'thirsty_warm'>('not_thirsty');
  const [bowelType, setBowelType] = useState<'normal' | 'constipated' | 'diarrhea_odorless' | 'diarrhea_foul'>('normal');

  // Dosage Calculator State
  const [patientAge, setAge] = useState<number>(30);

  if (!isOpen) return null;

  // Decision Logic based on 《中医经方治疗感冒简易应用版》
  const getRecommendation = () => {
    let formula = '麻黄汤';
    let otc = '风寒感冒颗粒 / 小青龙颗粒';
    let category = '表寒证';
    let rationale = '发热恶寒无汗，玄府闭塞，宜发汗解表。';

    if (feverCold === 'wang_lai') {
      formula = '小柴胡汤（若有表寒加桂枝、白芍）';
      otc = '小柴胡颗粒 + 风寒感冒颗粒';
      category = '少阳枢机不利 / 半表半里';
      rationale = '往来寒热、口苦咽干、胸胁苦满，宜和解少阳；若兼无汗恶寒，配合解表。';
    } else if (feverCold === 'you_han') {
      formula = '桂枝汤（咽痛加葛根）';
      otc = '桂枝颗粒 / 葛根汤颗粒';
      category = '表虚有汗';
      rationale = '发热有汗恶风，营卫不和，宜调和营卫。';
    } else {
      // wu_han
      if (phlegmType === 'yellow_thick' || thirstType === 'thirsty_cold') {
        if (phlegmType === 'mixed') {
          formula = '小青龙汤 + 生石膏 50g';
          otc = '小青龙颗粒 + 小儿咳喘灵颗粒';
          category = '表寒里热饮杂';
          rationale = '外有表寒无汗，内有黄白稀痰与郁热，宜解表化饮清热。';
        } else if (phlegmType === 'yellow_thick') {
          formula = '大青龙汤（麻黄汤+石膏） 或 麻杏石甘汤';
          otc = '桂黄清热颗粒 / 小儿咳喘灵颗粒';
          category = '表寒里热 / 肺热';
          rationale = '表寒闭塞兼内部细胞产热过亢（黄痰口渴），宜解表清里。';
        }
      } else if (phlegmType === 'water_rooster') {
        formula = '射干麻黄汤';
        otc = '寒喘丸 / 射干麻黄口服液';
        category = '寒饮郁肺（喉中水鸡声）';
        rationale = '喉间水鸡声，痰多清稀，宜温肺化饮、降逆平喘。';
      } else if (phlegmType === 'white_thin') {
        formula = '小青龙汤';
        otc = '小青龙颗粒';
        category = '表寒里饮';
        rationale = '发热恶寒无汗，内有水饮停聚（吐白稀痰、不口渴），宜温肺化饮。';
      }
    }

    if (bowelType === 'constipated') {
      formula += ' + 调胃承气汤';
      otc += '（加服麻仁滋脾丸/王氏保赤丸通便）';
      rationale += ' 兼有大便干燥硬结，须通下里实。';
    } else if (bowelType === 'diarrhea_odorless') {
      formula += ' + 附子理中丸 或 五苓散';
      rationale += ' 兼下利清稀不臭，中焦脾胃虚寒，宜温中止利。';
    } else if (bowelType === 'diarrhea_foul') {
      formula += ' + 葛根黄芩黄连汤';
      rationale += ' 兼下利臭秽，肠胃湿热，宜清热止利。';
    }

    return { formula, otc, category, rationale };
  };

  const rec = getRecommendation();

  // Dosage Calculation
  const getDosageInstruction = (age: number) => {
    if (age >= 14) {
      return {
        unit: '碗（每碗约 180-200 ml）',
        amount: '一次 1 碗',
        freq: '急症发烧者 2-3 小时服 1 次；无发烧者一日 2-3 次',
        note: '按成人标准量。7-10 碗水浸泡1小时，大火烧开后中小火煮1小时剩 3 碗。'
      };
    } else if (age >= 7) {
      return {
        unit: '半碗（约 90-100 ml）',
        amount: '一次 半碗',
        freq: '急症发烧者 2-3 小时服 1 次；无发烧者一日 2-3 次',
        note: '按7-13岁少年用量，相当于成人量的 1/2。'
      };
    } else {
      const spoons = Math.max(1, Math.min(6, age));
      return {
        unit: `汤勺（1汤勺约 15 ml，${spoons} 岁服 ${spoons} 勺，共约 ${spoons * 15} ml）`,
        amount: `一次 ${spoons} 汤勺`,
        freq: '一日 2-3 次，频服',
        note: '7 岁以下按“几岁服几勺”法则，汤勺约 15ml/勺。'
      };
    }
  };

  const dosage = getDosageInstruction(patientAge);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-[#fffdfa] dark:bg-[#111f22] border-2 border-[#0d5d56] dark:border-[#14b8a6] rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0d5d56] to-[#134e4a] text-white p-4 sm:p-5 flex items-center justify-between shadow-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl border border-white/20">
              <Thermometer className="w-6 h-6 text-[#5eead4]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif flex items-center gap-2">
                中医经方治疗感冒简易应用版
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#5eead4] text-[#042f2e] font-mono font-black">
                  官方速查指南
                </span>
              </h3>
              <p className="text-xs text-[#ccfbf1]/90 font-mono mt-0.5">
                基于《内景经方学说》及感冒临床问诊决策模型
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm">
          {/* Section 1: Interactive Symptom Decision Tree */}
          <div className="bg-[#f0f7f7] dark:bg-[#132c2e] p-4 sm:p-5 rounded-2xl border border-[#0d5d56]/30 space-y-4">
            <div className="flex items-center gap-2 text-[#0d5d56] dark:text-[#5eead4] font-bold font-serif text-base border-b border-[#c2f0ec] dark:border-[#134e4a] pb-2">
              <Stethoscope className="w-5 h-5" />
              <span>一、感冒临床症状问诊速查器（四维交互匹配）</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. 寒热与汗出 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#292524] dark:text-[#e7e5e4] flex items-center gap-1">
                  <span>1. 寒热与玄府汗出：</span>
                </label>
                <select
                  value={feverCold}
                  onChange={(e) => setFeverCold(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#0d5d56]/40 dark:border-[#14b8a6]/40 bg-white dark:bg-[#1a3538] text-[#042f2e] dark:text-[#ccfbf1] font-medium"
                >
                  <option value="wu_han">发热恶寒、无汗身痛、流清涕 (太阳表寒闭塞)</option>
                  <option value="you_han">发热有汗恶风 (表虚营卫不和)</option>
                  <option value="wang_lai">往来寒热、恶心呕吐、口苦咽干 (少阳半表半里)</option>
                </select>
              </div>

              {/* 2. 咳嗽与痰色 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#292524] dark:text-[#e7e5e4] flex items-center gap-1">
                  <span>2. 咳嗽与痰色液态：</span>
                </label>
                <select
                  value={phlegmType}
                  onChange={(e) => setPhlegmType(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#0d5d56]/40 dark:border-[#14b8a6]/40 bg-white dark:bg-[#1a3538] text-[#042f2e] dark:text-[#ccfbf1] font-medium"
                >
                  <option value="white_thin">咳嗽白痰稀薄、不渴 (寒饮停肺)</option>
                  <option value="yellow_thick">咳嗽黄痰粘稠、口渴 (肺热过亢)</option>
                  <option value="water_rooster">喉中水鸡声哮鸣 (射干麻黄汤证)</option>
                  <option value="mixed">白痰黄痰混杂 / 白鼻涕黄鼻涕交替 (寒热夹杂)</option>
                </select>
              </div>

              {/* 3. 口渴偏好 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#292524] dark:text-[#e7e5e4] flex items-center gap-1">
                  <span>3. 口渴与饮水习惯：</span>
                </label>
                <select
                  value={thirstType}
                  onChange={(e) => setThirstType(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#0d5d56]/40 dark:border-[#14b8a6]/40 bg-white dark:bg-[#1a3538] text-[#042f2e] dark:text-[#ccfbf1] font-medium"
                >
                  <option value="not_thirsty">不口渴 或 喜温水 (无里热/寒饮)</option>
                  <option value="thirsty_cold">口渴喜大冷饮 (阳明里热亢盛)</option>
                  <option value="thirsty_warm">口干口苦咽干 (少阳或气化不利)</option>
                </select>
              </div>

              {/* 4. 二便肠胃 */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#292524] dark:text-[#e7e5e4] flex items-center gap-1">
                  <span>4. 肠胃与大便状态：</span>
                </label>
                <select
                  value={bowelType}
                  onChange={(e) => setBowelType(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#0d5d56]/40 dark:border-[#14b8a6]/40 bg-white dark:bg-[#1a3538] text-[#042f2e] dark:text-[#ccfbf1] font-medium"
                >
                  <option value="normal">大便正常或略干</option>
                  <option value="constipated">2-3天不大便 / 腹胀压痛硬块 (肠道里实)</option>
                  <option value="diarrhea_odorless">下利腹痛、大便不臭苔白 (中焦虚寒)</option>
                  <option value="diarrhea_foul">下利臭秽、肛门灼热苔黄 (肠胃湿热)</option>
                </select>
              </div>
            </div>

            {/* Match Outcome Card */}
            <div className="bg-[#fffcf7] dark:bg-[#1a2326] p-4 rounded-2xl border-2 border-[#0d5d56] shadow-md space-y-2 mt-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black font-mono px-3 py-1 bg-[#0d5d56] text-white rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#5eead4]" />
                  匹配病机：{rec.category}
                </span>
                <span className="text-xs font-mono font-bold text-[#0d5d56] dark:text-[#5eead4]">
                  推荐中成药：{rec.otc}
                </span>
              </div>

              <div className="text-sm font-bold text-[#b91c1c] dark:text-[#ef4444] font-serif pt-1">
                【推荐经典经方】 {rec.formula}
              </div>

              <p className="text-xs text-[#44403c] dark:text-[#d6d3d1] leading-relaxed">
                <strong className="text-[#0d5d56] dark:text-[#5eead4]">【内景机制解析】</strong> {rec.rationale}
              </p>
            </div>
          </div>

          {/* Section 2: Precise Children & Adult Dosage Calculator */}
          <div className="bg-[#fefce8] dark:bg-[#2e2613] p-4 sm:p-5 rounded-2xl border border-[#eab308]/40 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#fef08a] dark:border-[#713f12] pb-2">
              <div className="flex items-center gap-2 text-[#854d0e] dark:text-[#fef08a] font-bold font-serif text-base">
                <Calculator className="w-5 h-5 text-[#ca8a04]" />
                <span>二、儿童/成人精细量规与折算器（几岁几汤勺）</span>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="patient-age-input" className="text-xs font-bold text-[#854d0e] dark:text-[#fef08a]">患者年龄：</label>
                <input
                  id="patient-age-input"
                  type="number"
                  min={1}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setAge(parseInt(e.target.value) || 1)}
                  className="w-20 text-xs font-mono font-bold text-center p-1.5 rounded-lg border border-[#ca8a04] bg-white dark:bg-[#1a1715] text-[#854d0e] dark:text-[#fef08a]"
                />
                <span className="text-xs font-bold text-[#854d0e] dark:text-[#fef08a]">岁</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/80 dark:bg-[#1a1715]/80 p-3 rounded-xl border border-[#eab308]/30 space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#854d0e] dark:text-[#fef08a] block">
                  1. 单次服量
                </span>
                <p className="font-bold text-[#713f12] dark:text-[#fef08a] text-sm">
                  {dosage.amount}
                </p>
                <span className="text-[11px] text-[#854d0e]/80 dark:text-[#fef08a]/80 block">
                  {dosage.unit}
                </span>
              </div>

              <div className="bg-white/80 dark:bg-[#1a1715]/80 p-3 rounded-xl border border-[#eab308]/30 space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#854d0e] dark:text-[#fef08a] block">
                  2. 服药频率
                </span>
                <p className="font-bold text-[#713f12] dark:text-[#fef08a] text-sm">
                  {dosage.freq}
                </p>
              </div>

              <div className="bg-white/80 dark:bg-[#1a1715]/80 p-3 rounded-xl border border-[#eab308]/30 space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#854d0e] dark:text-[#fef08a] block">
                  3. 煎煮说明
                </span>
                <p className="text-[11px] text-[#713f12] dark:text-[#fef08a] leading-relaxed">
                  {dosage.note}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Essential Precautions & Mappings */}
          <div className="bg-[#fef2f2] dark:bg-[#381313] p-4 rounded-2xl border border-[#fca5a5] space-y-2">
            <div className="flex items-center gap-2 text-[#991b1b] dark:text-[#fca5a5] font-bold font-serif text-sm">
              <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
              <span>三、感冒用药严训与饮食禁忌</span>
            </div>
            <ul className="text-xs text-[#7f1d1d] dark:text-[#fecdd3] space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>心慌体弱者</strong>：若平时心慌体弱、脸色苍白，麻黄量须减半，同时加大炙甘草用量（如麻黄汤改为麻黄10g、炙甘草50g）。</li>
              <li><strong>绝对饮食禁忌</strong>：感冒期间，尤其是舌苔厚腻、咳嗽或肠胃不佳者，<strong>严禁食用鱼、肉、蛋、奶、油炸、烧烤及生冷水果</strong>，以稀热粥或清汤面为主。</li>
              <li><strong>发汗保温护理</strong>：服药后宜覆被微似汗出，切勿受凉受风；平时体弱者感冒期间切忌洗澡洗头。</li>
            </ul>
          </div>

          {/* Section 4: 16 Classic Cold Formula Recipe Index */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-[#0d5d56] dark:text-[#5eead4] font-bold font-serif text-base border-b border-[#c2f0ec] dark:border-[#134e4a] pb-2">
              <BookOpen className="w-5 h-5 text-[#0d5d56]" />
              <span>四、16首感冒核心经方标准组成与克数速查</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#f5f0e6] dark:bg-[#2a241e] rounded-xl border border-[#e2d8c7] dark:border-[#443e37]">
                <strong className="text-[#0d5d56] dark:text-[#5eead4]">1. 麻黄汤：</strong>麻黄15g 桂枝30g 杏仁30g 炙甘草30g
              </div>
              <div className="p-2.5 bg-[#f5f0e6] dark:bg-[#2a241e] rounded-xl border border-[#e2d8c7] dark:border-[#443e37]">
                <strong className="text-[#0d5d56] dark:text-[#5eead4]">2. 葛根汤：</strong>葛根50g 桂枝30g 白芍30g 麻黄10g 生姜30g 大枣50g 炙甘草20g
              </div>
              <div className="p-2.5 bg-[#f5f0e6] dark:bg-[#2a241e] rounded-xl border border-[#e2d8c7] dark:border-[#443e37]">
                <strong className="text-[#0d5d56] dark:text-[#5eead4]">3. 桂枝汤：</strong>桂枝30g 白芍30g 生姜30g 大枣50g 炙甘草20g
              </div>
              <div className="p-2.5 bg-[#f5f0e6] dark:bg-[#2a241e] rounded-xl border border-[#e2d8c7] dark:border-[#443e37]">
                <strong className="text-[#0d5d56] dark:text-[#5eead4]">4. 麻杏石甘汤：</strong>麻黄10g 杏仁30g 石膏100g 炙甘草30g
              </div>
              <div className="p-2.5 bg-[#f5f0e6] dark:bg-[#2a241e] rounded-xl border border-[#e2d8c7] dark:border-[#443e37]">
                <strong className="text-[#0d5d56] dark:text-[#5eead4]">5. 射干麻黄汤：</strong>射干20g 麻黄10g 生姜30g 细辛15g 紫菀20g 款冬花20g 五味子15g 大枣30g 生半夏30g
              </div>
              <div className="p-2.5 bg-[#f5f0e6] dark:bg-[#2a241e] rounded-xl border border-[#e2d8c7] dark:border-[#443e37]">
                <strong className="text-[#0d5d56] dark:text-[#5eead4]">6. 小青龙汤：</strong>麻黄15g 桂枝30g 白芍30g 干姜30g 细辛20g 五味子20g 炙甘草20g 生半夏30g
              </div>
              <div className="p-2.5 bg-[#f5f0e6] dark:bg-[#2a241e] rounded-xl border border-[#e2d8c7] dark:border-[#443e37]">
                <strong className="text-[#0d5d56] dark:text-[#5eead4]">7. 千金苇茎汤：</strong>苇茎30g 薏苡仁30g 冬瓜子20g 桃仁15g
              </div>
              <div className="p-2.5 bg-[#f5f0e6] dark:bg-[#2a241e] rounded-xl border border-[#e2d8c7] dark:border-[#443e37]">
                <strong className="text-[#0d5d56] dark:text-[#5eead4]">8. 大青龙汤：</strong>麻黄15g 桂枝30g 生姜30g 大枣50g 炙甘草20g 石膏100g 杏仁30g
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f5f0e6] dark:bg-[#1a282a] border-t border-[#e2d8c7] dark:border-[#134e4a] flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-[#78716c] dark:text-[#a8a29e] font-mono">
            《内景经方学说》• 经典经方临床规范
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0d5d56] hover:bg-[#134e4a] text-white transition-all shadow-md"
          >
            完成查询
          </button>
        </div>
      </div>
    </div>
  );
}
