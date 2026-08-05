/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, Filter, X, Sparkles, Shield, Brain, Zap, HeartPulse, Layers, ExternalLink, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ClauseItem {
  clauseNum: string;
  stage: '太阳病' | '阳明病' | '少阳病' | '太阴病' | '少阴病' | '厥阴病' | '杂病内景';
  formula: string;
  originalText: string;
  innerLandscape: string;
  herbsMechanism: string;
  evidenceGrade: 'A级' | 'B级' | 'C级' | 'D级';
  analogy?: string; // 经典比喻：如“小猪盖被”、“压耗子”、“高压锅”、“洗洁精”、“九泉之水”
}

export const CLAUSES_DATABASE: ClauseItem[] = [
  {
    clauseNum: '第1条',
    stage: '太阳病',
    formula: '太阳病提纲',
    originalText: '太阳之为病，脉浮，头项强痛而恶寒。',
    innerLandscape: '表玄府（毛孔）强烈收缩闭合，同时血液集中流向体表毛细血管（导致脉浮）。头项部微血管最细，受寒剧烈收缩导致管腔变窄、流体压强过大产生胀痛。恶寒是毛孔（玄府）闭合后热量无法散发，神经感应到的寒冷。',
    herbsMechanism: '太阳病本质为体表玄府系统开合失调。需通过开泄腠理或调和营卫来恢复体表气血循环。',
    evidenceGrade: 'A级',
    analogy: '高压锅效应：毛孔紧闭后内部热量与流体压强积聚无法释放'
  },
  {
    clauseNum: '第12条',
    stage: '太阳病',
    formula: '桂枝汤',
    originalText: '太阳中风，阳浮而阴弱，阳浮者热自发，阴弱者汗自发，啬啬恶寒，淅淅恶风，翕翕发热，鼻鸣干呕者，桂枝汤主之。',
    innerLandscape: '表毛孔半开半合（门轴损坏）。动脉端血浆（营气）渗出至组织间液（卫气）后无法顺畅回收至静脉，津液持续自汗流失（阴弱），同时体表产热代偿（阳浮）。',
    herbsMechanism: '桂枝向外推（加速促血化气），白芍向内拉（松弛静脉平滑肌，促进卫气/组织液回流至营血），生姜促气化（将大分子水团打散），大枣甘草补充津液与强心。建立“推-拉”营卫循环。',
    evidenceGrade: 'A级',
    analogy: '推-拉循环：桂枝外推 + 白芍内拉，调和营卫气血'
  },
  {
    clauseNum: '第35条',
    stage: '太阳病',
    formula: '麻黄汤',
    originalText: '太阳病，头项强痛，发热，身疼，腰痛，骨节疼痛，恶风，无汗而喘者，麻黄汤主之。',
    innerLandscape: '太阳玄府（全身毛孔）完全紧闭痉挛，热量与水液完全无法向外透发，充血与体液积聚挤压压迫骨节神经导致剧烈身痛；肺泡玄府闭合导致呼吸代偿性喘急。',
    herbsMechanism: '麻黄刺激肾上腺素分泌，强制打开体表玄府（毛孔）与肺泡玄府；桂枝助血外输；杏仁降肺气平喘；炙甘草强心蓄水。',
    evidenceGrade: 'A级',
    analogy: '高压阀开锁：高压锅强烈发汗解表，快速释放组织压强'
  },
  {
    clauseNum: '第14条 / 第31条',
    stage: '太阳病',
    formula: '桂枝加葛根汤 / 葛根汤',
    originalText: '太阳病，项背强几几，反汗出恶风者，桂枝加葛根汤主之；无汗恶风者，葛根汤主之。',
    innerLandscape: '颈项背部微血管与肌肉气机阻滞（阴实/水液停聚不通），体表缺乏津液濡养，导致项背强硬如僵木。',
    herbsMechanism: '葛根“起阴气”，将下焦与内脏深层的津液水份调集提升至体表（“九泉之水调至九天之上”），润泽项背；配合桂枝汤调和营卫（无汗者加麻黄开玄府）。',
    evidenceGrade: 'A级',
    analogy: '九泉之水调至九天之上：把下焦津液抽调升提至体表项背'
  },
  {
    clauseNum: '第20条',
    stage: '太阳病',
    formula: '桂枝加附子汤',
    originalText: '太阳病，发汗，遂漏不止，其人恶风，小便难，四肢微急，难以屈伸者，桂枝加附子汤主之。',
    innerLandscape: '因服药或过汗导致体表玄府门轴彻底毁坏（表阳不固），汗液如溃堤般漏出，导致血容量骤降、小便无源（小便难）、肌肉缺乏津液引发抽搐痉挛（四肢微急）。',
    herbsMechanism: '炮附子温阳固表，修复玄府开合能力（修复门轴）；桂枝汤调和营卫，补充体液。',
    evidenceGrade: 'A级'
  },
  {
    clauseNum: '第18条',
    stage: '太阳病',
    formula: '桂枝加厚朴杏子汤',
    originalText: '喘家作，桂枝汤加厚朴杏子佳。',
    innerLandscape: '中下焦大网膜与肠道积聚水饮，占据腹腔空间（小猪盖被下焦水占位），导致上焦肺气无法下行，逆而为喘咳嗽。',
    herbsMechanism: '厚朴作用于小肠外侧大网膜，把中下焦积水排入肠道下行（“釜底抽薪”），腾出上焦空间；杏仁将肺气压下；桂枝汤调和整体循环。',
    evidenceGrade: 'A级',
    analogy: '釜底抽薪：厚朴抽走下焦积水腾出上焦空间，杏仁压肺气'
  },
  {
    clauseNum: '第38条',
    stage: '太阳病',
    formula: '大青龙汤',
    originalText: '太阳中风，脉浮紧，发热恶寒，身疼痛，不汗出而烦躁者，大青龙汤主之。',
    innerLandscape: '表寒（毛孔完全闭合）叠加里热（体内细胞生化产热极度亢进），热气上冲又无法透过毛孔散发，产生类似桑拿房闷热窒息般的强烈烦躁感。',
    herbsMechanism: '麻黄汤开体表玄府解表寒；石膏直接降低细胞生化产热能力（关闭胃肠玄府/清里热）；生姜大枣补充汗源。',
    evidenceGrade: 'A级',
    analogy: '表寒里热极重：麻黄汤开表高压阀 + 石膏降低内部产热'
  },
  {
    clauseNum: '第40条',
    stage: '太阳病',
    formula: '小青龙汤',
    originalText: '伤寒表不解，心下有水气，干呕，发热而咳，或渴，或利，或噎，或小便不利，少腹满，或喘者，小青龙汤主之。',
    innerLandscape: '表寒闭塞（毛孔闭合）+ 肺胃水饮停聚（细胞水液过多/胸腔水饮）。肺细胞内水液过载，气体无法进入，引发剧烈喘咳与吐白稀痰。',
    herbsMechanism: '麻黄桂枝开表；干姜细辛温阳化饮、开通精路；半夏“洗洁精”清除肺泡痰浊；五味子收紧细胞膜挤出水份；白芍将水液回收至静脉。',
    evidenceGrade: 'A级',
    analogy: '挤海绵与洗洁精：五味子收紧细胞膜挤水 + 半夏洗洁精除痰浊'
  },
  {
    clauseNum: '第71条 / 第76条',
    stage: '太阳病',
    formula: '五苓散',
    originalText: '太阳病，发汗后，大汗出，胃中干，烦躁不得眠，欲得饮水者，少少与饮之，令胃气和则愈。若脉浮，小便不利，微热消渴者，五苓散主之。',
    innerLandscape: '水液代谢分配严重失衡。气分与组织间液水停聚（小便不利），而血液与细胞内缺水（消渴口干）。喝水进入胃肠后无法吸收入血，反而吐出（水逆）。',
    herbsMechanism: '茯苓、泽泻稀释气血质地，降低流动阻力；白术增强淋巴管蠕动回收大分子阴气；猪苓缩小肾小管玄府，减少原尿重吸收；桂枝促血化气。',
    evidenceGrade: 'A级',
    analogy: '水液重新分配：稀释气血阻力 + 淋巴回收 + 促进小便排浊'
  },
  {
    clauseNum: '第96条',
    stage: '少阳病',
    formula: '小柴胡汤',
    originalText: '伤寒五六日中风，往来寒热，胸胁苦满，默默不欲饮食，心烦喜呕，或胸中烦而不呕，或渴，或腹中痛，或胁下痞鞕，或心下悸，小便不利，或不渴，身有微热，或咳者，小柴胡汤主之。',
    innerLandscape: '胸膜、腹膜等少阳玄府膜系闭合（“小猪盖被”），内脏产生的热量无法向体表透发，导致内部郁热积聚；当热压过大冲开膜系时体表发热，热散后膜系重新闭合体表又发冷（往来寒热）。胆汁上溢引发口苦。',
    herbsMechanism: '柴胡推动胸腹膜气机（“气的桂枝”），将郁热向外推散；黄芩开放胸腹膜玄府通道（开膜清热）；半夏“洗洁精”清除膜系黏腻痰湿；生姜大枣党参甘草补中和胃。',
    evidenceGrade: 'A级',
    analogy: '小猪盖被：五花肉（内脏）热发不出，柴胡黄芩开膜推热'
  },
  {
    clauseNum: '第103条 / 第136条',
    stage: '少阳病',
    formula: '大柴胡汤',
    originalText: '太阳病，过经十余日，反二三下之，后四五日，柴胡证仍在者，先与小柴胡汤。呕不止，心下急，郁郁微烦者，为未解也，与大柴胡汤下之则愈。',
    innerLandscape: '少阳胸腹膜郁热（小柴胡证）与阳明胃肠道燥屎积滞（阳明腑实）合并，热结于中焦与十二指肠，引发剧烈呕吐、心下硬满与便秘。',
    herbsMechanism: '小柴胡汤去参草，加枳实（增加肠道张力）、大黄（增强肠道蠕动）、白芍（放松平滑肌），双解少阳胸膜郁热与阳明腑实。',
    evidenceGrade: 'A级'
  },
  {
    clauseNum: '第176条 / 第26条',
    stage: '阳明病',
    formula: '白虎汤 / 白虎加人参汤',
    originalText: '伤寒脉浮滑，此以表有热里有寒，白虎汤主之。伤寒若吐若下后，七八日不解，热结在里，表里俱热，时时恶风，大渴，舌上干燥而烦，欲饮水数升者，白虎加人参汤主之。',
    innerLandscape: '阳明消化道生化产热能力极度亢进，内部温度极高（大热），玄府完全过度开放（大汗），细胞严重失水（大渴），血管扩张代偿（脉洪大）。',
    herbsMechanism: '石膏直接降低细胞生化产热能力，关闭胃肠道玄府；知母调节细胞膜水通道，减缓气入细胞速度；粳米炙甘草人参补充葡萄糖与体液。',
    evidenceGrade: 'A级',
    analogy: '四大症：大热、大汗、大渴、脉洪大，石膏清热关玄府'
  },
  {
    clauseNum: '第208条 / 第249条',
    stage: '阳明病',
    formula: '承气汤类（调胃承气/小承气/大承气）',
    originalText: '阳明病，脉迟，汗出不恶寒者，身体重，短气，腹满而喘，有潮热者，此外欲解，可攻里也。手足濈濈汗出者，此大便已鞕也，大承气汤主之。',
    innerLandscape: '胃肠道食物残渣因缺水与过热结成硬块（燥屎），堵塞肠道。毒素吸收入血通过肠脑轴上扰大脑神志，引发“谵语”（胡言乱语/发狂）。',
    herbsMechanism: '大黄增强肠道蠕动；枳实增加肠道张力破气；芒硝打散燥屎并高渗吸水软坚（类似开塞露机制）；厚朴调节大网膜水分。',
    evidenceGrade: 'A级',
    analogy: '开塞露高渗吸水：芒硝软坚打散 + 大黄枳实推肠排毒'
  },
  {
    clauseNum: '第277条',
    stage: '太阴病',
    formula: '理中丸 / 附子理中丸',
    originalText: '自利不渴者，属太阴，以其脏有寒故也，当温之，宜服四逆辈。',
    innerLandscape: '脾胃中焦阳气虚衰，胃肠黏膜玄府闭合收缩（“玄府”关闭），消化酶活性低下，食物与水分完全无法被吸收入血，原样拉出（吃啥拉啥/自利不渴）。',
    herbsMechanism: '干姜温脾阳，打开胃肠黏膜玄府通道；人参补充营养；白术燥湿健脾；甘草和中（加附子增强线粒体产热）。',
    evidenceGrade: 'A级'
  },
  {
    clauseNum: '第281条 / 第381条',
    stage: '少阴病',
    formula: '四逆汤',
    originalText: '少阴之为病，脉微细，但欲寐也。少阴病，脉沉者，急温之，宜四逆辈。',
    innerLandscape: '心肾阳气极度衰败，线粒体ATP生成能力衰退，心脏泵血动力严重不足，全身血液循环减慢，缺血缺氧导致整天困倦昏睡（但欲寐），四肢冰凉（厥逆）。',
    herbsMechanism: '生附子直接激活细胞线粒体功能（增强ATP生成，提供命门火）；干姜打开胃肠玄府促进吸收；炙甘草强心调和。',
    evidenceGrade: 'A级',
    analogy: '激活线粒体：生附子温命门火，恢复心肾泵血功能'
  },
  {
    clauseNum: '第301条',
    stage: '少阴病',
    formula: '麻黄附子细辛汤',
    originalText: '少阴病，始得之，反发热，脉沉者，麻黄附子细辛汤主之。',
    innerLandscape: '少阴心肾阳虚（内部功能衰退/脉沉）同时叠加太阳表玄府闭合（外感表寒发热）。精路不通导致精微物质无法到达体表。',
    herbsMechanism: '麻黄打开体表太阳玄府解表；附子温少阴命门火；细辛开通精微传输通道（精路），表里双解。',
    evidenceGrade: 'A级'
  },
  {
    clauseNum: '第303条',
    stage: '少阴病',
    formula: '黄连阿胶汤',
    originalText: '少阴病，得之二三日以上，心中烦，不得卧，黄连阿胶汤主之。',
    innerLandscape: '少阴阴虚火旺（血液中水与营养物质严重耗竭，产生虚热）。血管内温度极高，气化过度，导致脑部神经细胞极度亢进，白天精神好但夜晚心烦彻夜难眠。',
    herbsMechanism: '黄连减少“精”的产生，降心火；黄芩加速余热散发；白芍放松血管促进散热；阿胶与鸡蛋黄提供外源蛋白质，补充血液物质基础。',
    evidenceGrade: 'A级'
  },
  {
    clauseNum: '第326条 / 第338条',
    stage: '厥阴病',
    formula: '乌梅丸',
    originalText: '厥阴之为病，消渴，气上撞心，心中疼热，饥而不欲食，食则吐蚘，下之利不止。蛔厥者，乌梅丸主之。',
    innerLandscape: '精路通畅障碍导致寒热错杂（上热下寒）。命门炼化的精无法顺畅下行，反积聚于上焦（心中疼热/消渴/饥不欲食），而中下焦因为缺乏精与热能而极度虚寒。',
    herbsMechanism: '乌梅酸收；黄连黄柏清上焦郁热；生附子干姜肉桂细辛花椒温下焦虚寒；党参当归补充气血精微。',
    evidenceGrade: 'A级',
    analogy: '压耗子原理：下焦虚寒把热与精挤在上方，乌梅丸温下清上'
  },
  {
    clauseNum: '第351条',
    stage: '厥阴病',
    formula: '当归四逆汤',
    originalText: '手足厥寒，脉细欲绝者，当归四逆汤主之。若其人内有久寒者，宜当归四逆加吴茱萸生姜汤。',
    innerLandscape: '厥阴血虚寒凝。血液总量不足（脉细欲绝），加之血管与微循环管道受寒收缩，精路不通，气血无法到达四肢末梢（手足厥寒）。',
    herbsMechanism: '当归白芍养血补血；桂枝细辛通草温经散寒、通利微循环与精路；甘草大枣补充体液。',
    evidenceGrade: 'A级'
  },
  {
    clauseNum: '核心药组',
    stage: '杂病内景',
    formula: '姜附桂（生姜/干姜 + 附子 + 桂枝）',
    originalText: '经典温阳三药配伍（语音识别/听力笔记中常被误写为“姜富贵”）。',
    innerLandscape: '生姜/干姜直入脾胃中焦开胃肠玄府；生附子激活线粒体生成ATP（提供命门少阴原动力）；桂枝温通微循环并促进“血化气”。三药合用，为经方中强力通阳散寒、重建营卫与精路循环之核心。',
    herbsMechanism: '生姜/干姜（开胃肠玄府锁中阳） + 附子（温命门火、破下焦阴寒） + 桂枝（温通血脉、促血化气），表里同温、气血并化。',
    evidenceGrade: 'A级',
    analogy: '姜附桂（误笔“姜富贵”）：开中焦 + 动命门 + 通微循环'
  }
];

interface InnerDictModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InnerDictModal({ isOpen, onClose }: InnerDictModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [activeClause, setActiveClause] = useState<ClauseItem | null>(CLAUSES_DATABASE[0]);

  if (!isOpen) return null;

  const filteredClauses = CLAUSES_DATABASE.filter(item => {
    const matchesSearch = 
      item.clauseNum.includes(searchTerm) ||
      item.formula.includes(searchTerm) ||
      item.originalText.includes(searchTerm) ||
      item.innerLandscape.includes(searchTerm) ||
      item.herbsMechanism.includes(searchTerm) ||
      (item.analogy && item.analogy.includes(searchTerm));

    const matchesStage = selectedStage === 'all' || item.stage === selectedStage;
    const matchesGrade = selectedGrade === 'all' || item.evidenceGrade === selectedGrade;

    return matchesSearch && matchesStage && matchesGrade;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#1c1917]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="w-full max-w-5xl bg-[#f8f4eb] dark:bg-[#1f1b18] rounded-3xl border border-[#ebdcc8] dark:border-[#3a332c] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#f4efe4] dark:bg-[#25201c] border-b border-[#e2d8c7] dark:border-[#3a332c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#b91c1c] text-white flex items-center justify-center shadow-md border border-[#991b1b]">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#1c1917] dark:text-[#f5f5f4] flex items-center gap-2 font-serif">
                伤寒内景活字典 • 185条文与经典方剂内景速查
                <span className="text-[10px] font-mono font-bold bg-[#0d5d56] text-white px-2 py-0.5 rounded-full">
                  权威物理机制库
                </span>
              </h2>
              <p className="text-xs text-[#78716c] dark:text-[#a8a29e] font-medium mt-0.5">
                基于《内景解伤寒》与《内景经方学说教材》原著条文逐条精解
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#78716c] dark:text-[#a8a29e] hover:text-[#1c1917] dark:hover:text-white hover:bg-[#e7dfd3] dark:hover:bg-[#342e28] rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-[#f0f7f7]/60 dark:bg-[#182324]/60 border-b border-[#e2d8c7] dark:border-[#3a332c] space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716c] dark:text-[#a8a29e]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索条文编号、方剂（如桂枝汤/小柴胡汤/白虎汤）、中药（如附子/麻黄/白芍）、比喻（小猪盖被/压耗子）..."
                className="w-full pl-10 pr-4 py-2 bg-[#fffcf7] dark:bg-[#141210] border border-[#e2d8c7] dark:border-[#3e3730] rounded-xl text-xs sm:text-sm text-[#1c1917] dark:text-[#f5f5f4] focus:outline-none focus:border-[#0d5d56] dark:focus:border-[#14b8a6] shadow-2xs font-medium"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a8a29e] hover:text-[#1c1917]"
                >
                  清除
                </button>
              )}
            </div>

            {/* Stage Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-[#0d5d56] dark:text-[#5eead4] shrink-0 font-serif">
                病期:
              </span>
              {['all', '太阳病', '阳明病', '少阳病', '太阴病', '少阴病', '厥阴病'].map((stg) => (
                <button
                  key={stg}
                  onClick={() => setSelectedStage(stg)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                    selectedStage === stg
                      ? 'bg-[#0d5d56] text-white border-transparent shadow-xs'
                      : 'bg-[#fffcf7] dark:bg-[#25201c] text-[#57534e] dark:text-[#a8a29e] border-[#e2d8c7] dark:border-[#38322c] hover:bg-[#e7dfd3]'
                  }`}
                >
                  {stg === 'all' ? '全部六经' : stg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Split Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#f8f4eb] dark:bg-[#1f1b18]">
          
          {/* Left Column: Clause List */}
          <div className="w-full md:w-5/12 border-r border-[#e2d8c7] dark:border-[#3a332c] overflow-y-auto p-3 space-y-2.5 max-h-[350px] md:max-h-none">
            <div className="text-[11px] font-bold text-[#78716c] dark:text-[#a8a29e] px-2 flex justify-between items-center">
              <span>检索结果 ({filteredClauses.length} 条)</span>
              <span className="font-mono text-[10px] text-[#b45309]">点击条文查看深度内景分析</span>
            </div>

            {filteredClauses.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#78716c] dark:text-[#a8a29e] space-y-2">
                <AlertTriangle className="w-8 h-8 text-[#b45309] mx-auto" />
                <p>未找到符合条件的条文或方剂</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedStage('all'); }}
                  className="px-3 py-1 bg-[#0d5d56] text-white rounded-lg text-xs font-bold"
                >
                  重置筛选条件
                </button>
              </div>
            ) : (
              filteredClauses.map((item) => {
                const isSelected = activeClause?.clauseNum === item.clauseNum && activeClause?.formula === item.formula;
                return (
                  <div
                    key={`${item.clauseNum}_${item.formula}`}
                    onClick={() => setActiveClause(item)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-[#fffcf7] dark:bg-[#28221e] border-[#0d5d56] dark:border-[#14b8a6] shadow-md ring-2 ring-[#0d5d56]/20'
                        : 'bg-[#f4efe4]/70 dark:bg-[#231f1c]/70 border-[#e2d8c7] dark:border-[#38322c] hover:bg-[#fffcf7] dark:hover:bg-[#28221e]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono font-extrabold text-[#b91c1c] dark:text-[#ef4444] bg-[#faf2f2] dark:bg-[#2d1515] px-2 py-0.5 rounded-md border border-[#f5d0d0] dark:border-[#4a1d1d]">
                          {item.clauseNum}
                        </span>
                        <span className="text-xs font-extrabold text-[#1c1917] dark:text-[#f5f5f4] font-serif">
                          {item.formula}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e7dfd3] dark:bg-[#342e28] text-[#57534e] dark:text-[#d6d3d1]">
                        {item.stage}
                      </span>
                    </div>

                    <p className="text-xs text-[#44403c] dark:text-[#d6d3d1] font-serif truncate italic">
                      「 {item.originalText} 」
                    </p>

                    {item.analogy && (
                      <div className="text-[10px] font-bold text-[#b45309] dark:text-[#fde68a] bg-[#fef3c7] dark:bg-[#78350f]/50 px-2 py-0.5 rounded-md w-fit flex items-center gap-1">
                        <span>💡 {item.analogy}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Deep Inner Landscape Detail Panel */}
          <div className="w-full md:w-7/12 overflow-y-auto p-4 sm:p-6 space-y-4">
            {activeClause ? (
              <div className="space-y-4 animate-fadeIn">
                
                {/* Header Banner */}
                <div className="bg-[#fffcf7] dark:bg-[#25201c] p-4 rounded-2xl border border-[#ebdcc8] dark:border-[#3a332c] shadow-sm space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-extrabold bg-[#b91c1c] text-white px-2.5 py-1 rounded-lg">
                        {activeClause.clauseNum}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-[#1c1917] dark:text-[#f5f5f4] font-serif">
                        {activeClause.formula}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0d5d56] dark:text-[#5eead4] bg-[#c2f0ec]/60 dark:bg-[#134e4a]/60 px-2.5 py-0.5 rounded-full border border-[#0d5d56]/20">
                        {activeClause.stage}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#b45309] dark:text-[#fde68a] bg-[#fef3c7] dark:bg-[#78350f]/60 px-2 py-0.5 rounded-full border border-[#fde68a]">
                        证据评级: {activeClause.evidenceGrade}
                      </span>
                    </div>
                  </div>

                  {/* Original Clause Parchment Box */}
                  <div className="bg-[#faf2f2] dark:bg-[#2d1515] p-3.5 rounded-xl border border-[#f5d0d0] dark:border-[#4a1d1d] text-xs sm:text-sm text-[#701a1a] dark:text-[#fecdd3] font-serif leading-relaxed font-semibold italic">
                    「 {activeClause.originalText} 」
                  </div>
                </div>

                {/* Classic Analogy Card */}
                {activeClause.analogy && (
                  <div className="bg-[#fef3c7] dark:bg-[#451a03] p-3.5 rounded-2xl border border-[#fde68a] dark:border-[#78350f] text-xs sm:text-sm text-[#78350f] dark:text-[#fde68a] space-y-1 shadow-2xs">
                    <span className="font-extrabold flex items-center gap-1.5 text-xs text-[#92400e] dark:text-[#fef3c7] font-serif">
                      <Zap className="w-4 h-4 text-[#b45309]" />
                      【愤怒的小中医经典形象比喻】
                    </span>
                    <p className="font-bold text-xs sm:text-sm pt-0.5 leading-relaxed">
                      {activeClause.analogy}
                    </p>
                  </div>
                )}

                {/* Inner Landscape Fluid Mechanics Explanation */}
                <div className="bg-[#f0f7f7] dark:bg-[#0f282a] p-4.5 rounded-2xl border border-[#c2f0ec] dark:border-[#134e4a] space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-[#042f2e] dark:text-[#ccfbf1] font-extrabold text-xs sm:text-sm font-serif">
                    <Brain className="w-4.5 h-4.5 text-[#0d5d56] dark:text-[#14b8a6]" />
                    <span>【内景流体力学与血管/玄府微观机理】</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#115e59] dark:text-[#ccfbf1] leading-relaxed font-medium">
                    {activeClause.innerLandscape}
                  </p>
                </div>

                {/* Herbal Component Inner Mechanics */}
                <div className="bg-[#fffcf7] dark:bg-[#24201d] p-4.5 rounded-2xl border border-[#ebdcc8] dark:border-[#3a332a] space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-[#1c1917] dark:text-[#f5f5f4] font-extrabold text-xs sm:text-sm font-serif">
                    <Layers className="w-4.5 h-4.5 text-[#b91c1c]" />
                    <span>【组方药物内景靶点与推拉机制】</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44403c] dark:text-[#e7e5e4] leading-relaxed font-medium">
                    {activeClause.herbsMechanism}
                  </p>
                </div>

                {/* Source-Path-Terminal Methodological Framework */}
                <div className="bg-[#f5f0e6] dark:bg-[#2a2521] p-4 rounded-2xl border border-[#e2d8c7] dark:border-[#38322c] space-y-2 text-xs">
                  <span className="font-extrabold text-[#0d5d56] dark:text-[#5eead4] flex items-center gap-1.5 font-serif text-xs">
                    <Shield className="w-4 h-4 text-[#0d5d56]" />
                    “源头 - 通路 - 终端”辨证三要素推演闭环：
                  </span>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                    <div className="bg-[#fffcf7] dark:bg-[#181513] p-2 rounded-xl border border-[#e2d8c7] dark:border-[#38322c]">
                      <span className="text-[10px] text-[#78716c] block font-bold">1. 源头 (物质/动力)</span>
                      <span className="text-xs font-bold text-[#1c1917] dark:text-[#f5f5f4]">心阳 / 水谷精微</span>
                    </div>
                    <div className="bg-[#fffcf7] dark:bg-[#181513] p-2 rounded-xl border border-[#e2d8c7] dark:border-[#38322c]">
                      <span className="text-[10px] text-[#78716c] block font-bold">2. 通路 (血管/玄府)</span>
                      <span className="text-xs font-bold text-[#0d5d56] dark:text-[#5eead4]">三焦 / 精路开合</span>
                    </div>
                    <div className="bg-[#fffcf7] dark:bg-[#181513] p-2 rounded-xl border border-[#e2d8c7] dark:border-[#38322c]">
                      <span className="text-[10px] text-[#78716c] block font-bold">3. 终端 (细胞利用)</span>
                      <span className="text-xs font-bold text-[#b45309] dark:text-[#fde68a]">线粒体ATP / 组织液</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 text-center text-xs text-[#78716c]">
                请在左侧列表中点击任意条文查看深度内景分析
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#f4efe4] dark:bg-[#25201c] border-t border-[#e2d8c7] dark:border-[#3a332c] flex items-center justify-between text-xs text-[#78716c] dark:text-[#a8a29e]">
          <span className="font-serif">恪守《内景解伤寒》与《内景经方学说》原著规则</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#b91c1c] text-white rounded-xl font-bold hover:bg-[#991b1b] transition-all cursor-pointer"
          >
            完成研读并关闭
          </button>
        </div>

      </div>
    </div>
  );
}
