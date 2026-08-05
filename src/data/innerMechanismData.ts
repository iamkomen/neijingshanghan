/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InnerMechanismNode {
  id: string;
  name: string;
  meridian: 'taiyang' | 'yangming' | 'shaoyang' | 'taiyin' | 'shaoyin' | 'jueyin';
  meridianName: string;
  systemTag: string; // e.g. "表郁微循环", "水通道与肾气化", "下丘脑体温中枢", "肠道屏障", "自律神经与HPA", "消化道能量ATP", "线粒体与休克", "血管舒缩风暴"
  shortDesc: string;
  
  // Microscopic Inner Mechanisms
  innerMechanism: {
    pathology: string; // 病理机制详解
    targetTissues: string[]; // 靶器官/组织
    biomarkers: string[]; // 现代医学关联指标 (e.g. PGE2, ADH, EF, Lactate)
    physicalConcept: string; // 物理中医内景视界 (e.g. 压力差下降, 热传导耗竭)
  };

  // Formula Countermeasure
  countermeasure: {
    formulaName: string;
    topicId?: string;
    gateId?: string;
    composition: string[];
    actionMechanism: string; // 药理与内景应对机制
    keyHerbPairs: { pair: string; function: string }[];
  };

  // Graph Positioning
  x: number;
  y: number;
}

export interface InnerMechanismLink {
  source: string; // Source Node ID
  target: string; // Target Node ID
  label: string;  // e.g. "化热入里", "随经入腑", "木郁克土", "损及少阴", "阴阳离决"
  direction: 'forward' | 'cross' | 'reverse' | 'deterioration';
  description: string;
}

export const INNER_MECHANISM_NODES: InnerMechanismNode[] = [
  {
    id: 'm_taiyang_biaoyu',
    name: '太阳表郁与毛细血管痉挛',
    meridian: 'taiyang',
    meridianName: '太阳病',
    systemTag: '表郁微循环',
    shortDesc: '寒邪袭表导致微血管收缩、腠理玄府闭塞与体温调控障碍。',
    innerMechanism: {
      pathology: '外寒刺激皮肤感受器，交感神经急剧兴奋，真皮毛细血管网与小动脉反射性收缩，腠理玄府（毛孔/汗腺孔）完全闭塞。汗液无法排出，体表热散失受阻，体内积热，引发恶寒发热、头项强痛。',
      targetTissues: ['真皮毛细血管网', '汗腺玄府', '骨骼肌平滑肌', '体温调节中枢'],
      biomarkers: ['前列腺素E2 (PGE2) ↑', '皮肤血流量 ↓', '发汗阈值 ↑', '肌酸激酶 (CK) 波动'],
      physicalConcept: '毛细管网压力阻力骤增，体表热传导与蒸发散热对流双重阻断。'
    },
    countermeasure: {
      formulaName: '麻黄汤 / 桂枝汤',
      topicId: 'T_LIUJING_1',
      gateId: 'g9_1',
      composition: ['麻黄', '桂枝', '杏仁', '甘草', '芍药', '生姜', '大枣'],
      actionMechanism: '麻黄碱激动β2受体解除支气管与毛细血管痉挛，桂枝温通微循环扩张血管；桂枝汤中桂枝加芍药调控血管内皮开合，配伍生姜大枣补充血容量以助玄府发汗。',
      keyHerbPairs: [
        { pair: '麻黄 + 桂枝', function: '发汗解表，相须开闭毛窍，重建微循环通畅' },
        { pair: '桂枝 + 芍药', function: '一散一收，调和营卫，双向调节血管平滑肌张力' }
      ]
    },
    x: 180,
    y: 100
  },
  {
    id: 'm_taiyang_xushui',
    name: '太阳蓄水与水通道蛋白(AQP)障碍',
    meridian: 'taiyang',
    meridianName: '太阳病',
    systemTag: '水通道与肾气化',
    shortDesc: '太阳表邪入腑，膀胱气化受阻，水通道蛋白表达异常致水饮停聚。',
    innerMechanism: {
      pathology: '太阳表邪未解随经入腑，影响肾与膀胱气化功能。肾小球滤过与肾小管重吸收失衡，水通道蛋白（AQP-2、AQP-4）表达紊乱，细胞外液及胃肠腔水饮停聚，出现小便不利、消渴饮水即吐。',
      targetTissues: ['肾小管上皮细胞', '膀胱平滑肌', '胃粘膜上皮细胞'],
      biomarkers: ['水通道蛋白 (AQP-2/4) 紊乱', '抗利尿激素 (ADH) 异常', '肾小球滤过率 (GFR) ↓'],
      physicalConcept: '跨膜渗透压与流体力学平衡破坏，水分子通道关闭导致流体淤积。'
    },
    countermeasure: {
      formulaName: '五苓散',
      topicId: 'T_LIUJING_4',
      gateId: 'g9_1',
      composition: ['桂枝', '茯苓', '白术', '猪苓', '泽泻'],
      actionMechanism: '桂枝温通肾与膀胱动脉增强气化；茯苓、猪苓、泽泻调控肾小管细胞膜水通道蛋白(AQP)表达，促进水分子重吸收与排泄平衡；白术增强胃肠吸收。',
      keyHerbPairs: [
        { pair: '桂枝 + 泽泻', function: '通阳化气，引导肾小球滤过率恢复' },
        { pair: '茯苓 + 白术', function: '健脾渗湿，恢复细胞内外液渗透压平衡' }
      ]
    },
    x: 120,
    y: 220
  },
  {
    id: 'm_taiyang_xuxue',
    name: '太阳蓄血与盆腔瘀热结聚',
    meridian: 'taiyang',
    meridianName: '太阳病',
    systemTag: '盆腔微循环瘀血',
    shortDesc: '表邪化热入里与下焦血相搏，导致盆腔微血管网高凝与炎性风暴。',
    innerMechanism: {
      pathology: '表邪入里化热，热邪与下焦血分结聚，盆腔及少腹微循环出现严重血流淤滞、血小板聚集与局部炎性介质暴发。热扰中枢则精神异常，出现“其人如狂”或“如狂状”。',
      targetTissues: ['盆腔微血管网', '下腹静脉丛', '大脑皮层边缘系统'],
      biomarkers: ['D-二聚体 (D-Dimer) ↑', '全血黏度 ↑', '血栓素B2 (TXB2) ↑'],
      physicalConcept: '局部流体黏度极度升高，黏滞阻力致微血管局部流速趋近于零。'
    },
    countermeasure: {
      formulaName: '桃核承气汤 / 抵当汤',
      topicId: 'T_LIUJING_5',
      gateId: 'g9_1',
      composition: ['桃仁', '大黄', '桂枝', '芒硝', '甘草', '水蛭', '虻虫'],
      actionMechanism: '桃仁、水蛭抗凝溶栓，显著降低血黏度；大黄、芒硝清泻肠道瘀热并促使炎性介质排出；桂枝扩张下焦血管引药直达病所。',
      keyHerbPairs: [
        { pair: '桃仁 + 大黄', function: '逐瘀泻热，破除下焦微循环凝血块' },
        { pair: '桂枝 + 芒硝', function: '通脉软坚，促进渗出液与毒素加速排泄' }
      ]
    },
    x: 280,
    y: 220
  },
  {
    id: 'm_yangming_gaore',
    name: '阳明经证与下丘脑体温中枢过载',
    meridian: 'yangming',
    meridianName: '阳明病',
    systemTag: '下丘脑体温中枢',
    shortDesc: '邪气化热入里，下丘脑体温调定点上移致全身代谢亢进与脱水。',
    innerMechanism: {
      pathology: '邪气入里化热，下丘脑体温调节中枢调定点大幅上移（>39.5℃）。炎性细胞因子（IL-1、IL-6、TNF-α）大量释放，引发全身高代谢状态。持续大汗淋漓导致血容量骤降、血浆渗透压升高。',
      targetTissues: ['下丘脑体温中枢', '骨骼肌与汗腺', '骨髓与免疫系统'],
      biomarkers: ['体温 > 39.5℃', '白细胞 (WBC) 及 CRP ↑', '血浆渗透压 ↑', 'IL-6 / TNF-α 暴发'],
      physicalConcept: '热能暴发性释放，热传导梯度极高，体液剧烈蒸发导致相变脱水。'
    },
    countermeasure: {
      formulaName: '白虎汤 / 白虎加人参汤',
      topicId: 'T_LIUJING_6',
      gateId: 'g9_2',
      composition: ['石膏', '知母', '甘草', '粳米', '人参'],
      actionMechanism: '石膏（水合硫酸钙）作用于下丘脑直接降低体温调定点；知母所含芒果苷抑制促炎因子；人参补充脱水引发的低血容量与机体能量耗竭。',
      keyHerbPairs: [
        { pair: '石膏 + 知母', function: '强效退热抗炎，阻断体温中枢过载连锁反应' },
        { pair: '知母 + 人参', function: '滋阴益气，快速恢复血浆渗透压与体液平衡' }
      ]
    },
    x: 440,
    y: 100
  },
  {
    id: 'm_yangming_fushi',
    name: '阳明腑实与肠道屏障崩溃燥结',
    meridian: 'yangming',
    meridianName: '阳明病',
    systemTag: '肠道屏障与毒素',
    shortDesc: '高热导致肠液枯竭、肠道蠕动麻痹，肠道内毒素(LPS)吸收入血。',
    innerMechanism: {
      pathology: '里热炽盛耗伤肠道津液，粪块干硬燥结阻滞肠腔，肠平滑肌张力丧失。肠粘膜上皮紧密连接蛋白(Claudins)破坏，肠道内毒素(LPS)及细菌移位入血，引发全身炎症反应综合征(SIRS)。',
      targetTissues: ['肠道粘膜上皮', '肠壁神经丛', '门静脉系统'],
      biomarkers: ['血清内毒素 (LPS) ↑', 'D-乳酸 ↑', '肠鸣音消失', 'DAO (二胺氧化酶) ↑'],
      physicalConcept: '肠腔水流动力彻底停滞，高浓度毒素渗透阻力屏障破坏。'
    },
    countermeasure: {
      formulaName: '大承气汤 / 小承气汤 / 调胃承气汤',
      topicId: 'T_LIUJING_7',
      gateId: 'g9_2',
      composition: ['大黄', '芒硝', '厚朴', '枳实'],
      actionMechanism: '大黄蒽醌葡萄糖苷刺激肠壁平滑肌肌间神经丛产生阵缩；芒硝高渗作用吸引水分入肠腔软坚；厚朴、枳实解除肠道气滞并促进胃肠排空。',
      keyHerbPairs: [
        { pair: '大黄 + 芒硝', function: '泻下通便、高渗吸水，快速清除燥屎与内毒素' },
        { pair: '厚朴 + 枳实', function: '行气消积，强效激活消化道平滑肌蠕动动力' }
      ]
    },
    x: 520,
    y: 220
  },
  {
    id: 'm_shaoyang_shuji',
    name: '少阳枢机不利与自律神经/HPA轴紊乱',
    meridian: 'shaoyang',
    meridianName: '少阳病',
    systemTag: '自律神经与HPA轴',
    shortDesc: '邪在半表半里，交感/副交感神经失调及HPA轴振荡致寒热往来。',
    innerMechanism: {
      pathology: '病邪处于半表半里之枢机部位，下丘脑-垂体-肾上腺轴(HPA)失衡，自律神经系统（交感与副交感神经）交替兴奋，导致体温调节功能呈现波浪式振荡（寒热往来）。胆汁排泄不畅，消化道植物神经紊乱致胸胁苦满、心烦喜呕。',
      targetTissues: ['下丘脑-垂体-肾上腺轴(HPA)', '植物神经节', '胆囊与肝微循环'],
      biomarkers: ['皮质醇 (Cortisol) 节律失调', '心率变异性 (HRV) 异常', '胆汁酸 (TBA) 排泄↓'],
      physicalConcept: '系统自激振荡失控，相火郁发于半表半里无法顺畅传导。'
    },
    countermeasure: {
      formulaName: '小柴胡汤',
      topicId: 'T_LIUJING_8',
      gateId: 'g9_3',
      composition: ['柴胡', '黄芩', '半夏', '生姜', '人参', '甘草', '大枣'],
      actionMechanism: '柴胡皂苷调节自律神经并改善肝胆微循环；黄芩黄酮清泻半里之郁热；半夏、生姜降逆止呕镇静胃神经；人参甘草大枣稳定HPA轴反应。',
      keyHerbPairs: [
        { pair: '柴胡 + 黄芩', function: '透达少阳枢机，一升一降平息寒热往来振荡' },
        { pair: '半夏 + 生姜', function: '降逆和胃，抑制呕吐中枢及消化道平滑肌痉挛' }
      ]
    },
    x: 360,
    y: 340
  },
  {
    id: 'm_taiyin_pixu',
    name: '太阴脾虚与胃肠粘膜ATP生成障碍',
    meridian: 'taiyin',
    meridianName: '太阴病',
    systemTag: '消化道能量ATP',
    shortDesc: '脾阳不振导致消化道平滑肌无力、ATP三磷酸腺苷枯竭与腹泻。',
    innerMechanism: {
      pathology: '太阴脾土受邪，消化道粘膜细胞线粒体功能受抑制，ATP三磷酸腺苷生成急剧减少。胃肠平滑肌张力显著降低，吸收水分与营养的能力丧失，液体直接下注，表现为腹满而吐、食不下、自利不渴。',
      targetTissues: ['小肠粘膜上皮细胞', '消化道平滑肌', '肠膜微血管网'],
      biomarkers: ['细胞内 ATP 浓度 ↓', '胃动素/缩胆囊素 降低', '吸收不良指数 ↑'],
      physicalConcept: '系统功耗维持能量不足，细胞跨膜泵功丧失导致体液溃泻。'
    },
    countermeasure: {
      formulaName: '理中丸 / 人参汤',
      topicId: 'T_LIUJING_9',
      gateId: 'g9_4',
      composition: ['干姜', '人参', '白术', '甘草'],
      actionMechanism: '干姜所含姜辣素强烈扩张胃肠微血管、激活线粒体呼吸链，大幅提高ATP生成；人参皂苷修复受损肠粘膜；白术增强肠道平滑肌收缩张力。',
      keyHerbPairs: [
        { pair: '干姜 + 白术', function: '温中健脾，激活胃肠线粒体能量与平滑肌张力' },
        { pair: '人参 + 甘草', function: '补气建中，促进胃肠粘膜细胞ATP恢复' }
      ]
    },
    x: 220,
    y: 460
  },
  {
    id: 'm_shaoyin_yangxu',
    name: '少阴心肾阳虚与线粒体崩溃休克',
    meridian: 'shaoyin',
    meridianName: '少阴病',
    systemTag: '线粒体与心肾休克',
    shortDesc: '心肾阳气衰微致心肌及线粒体ATP停滞、全身微循环灌注不足。',
    innerMechanism: {
      pathology: '病入少阴，心肌细胞与肾小管细胞线粒体电子传递链严重受损，能量生成停滞。心输出量急剧下降，全身外周微循环严重灌注不足，组织细胞无氧代谢积聚大量乳酸，出现四肢厥冷、脉微细欲绝、但欲寐之休克前期或休克状态。',
      targetTissues: ['心肌细胞', '肾小管及肾上腺', '外周微血管床'],
      biomarkers: ['血乳酸 (Lactate) ↑↑', '心输出量 (CO) ↓', '射血分数 (EF) < 40%', '平均动脉压 (MAP) ↓'],
      physicalConcept: '核心热源引擎熄火，全身微循环动力泵与热传导全面崩溃。'
    },
    countermeasure: {
      formulaName: '四逆汤 / 通脉四逆汤',
      topicId: 'T_LIUJING_10',
      gateId: 'g9_5',
      composition: ['附子', '干姜', '甘草'],
      actionMechanism: '附子中的去甲乌药碱兴奋β受体强心升压，乌头碱类激活心肌与线粒体；干姜增强附子强心作用并改善组织微循环灌注；甘草延缓毒性吸收并稳定血容量。',
      keyHerbPairs: [
        { pair: '附子 + 干姜', function: '回阳救逆，强烈激活线粒体ATP重启心肾动力' },
        { pair: '干姜 + 甘草', function: '温中补气，维持微循环灌注压与电解质稳定' }
      ]
    },
    x: 420,
    y: 460
  },
  {
    id: 'm_shaoyin_yinxu',
    name: '少阴阴虚火旺与神经内分泌过度亢进',
    meridian: 'shaoyin',
    meridianName: '少阴病',
    systemTag: '神经内分泌亢进',
    shortDesc: '肾阴枯竭而心火独亢，儿茶酚胺及脑电活动异常致心中烦不得卧。',
    innerMechanism: {
      pathology: '少阴病热化证，体液严重亏耗（肾阴枯竭），心火失去水液制约而独亢。脑内神经递质（去甲肾上腺素、5-HT）过度释放，脑电波高频交感亢进，表现为“心中烦，不得卧”。',
      targetTissues: ['大脑皮层及网状结构', '心肌导电系统', '肾脏水盐代谢'],
      biomarkers: ['促肾上腺皮质激素 (ACTH) ↑', '血去甲肾上腺素 ↑', '睡眠脑电波紊乱'],
      physicalConcept: '水冷却介质干涸，核心发热源热失控导致电信号暴风。'
    },
    countermeasure: {
      formulaName: '黄连阿胶汤',
      topicId: 'T_LIUJING_11',
      gateId: 'g9_5',
      composition: ['黄连', '黄芩', '阿胶', '芍药', '鸡子黄'],
      actionMechanism: '黄连小檗碱、黄芩黄酮抑制中枢神经亢进与心火；阿胶、芍药补充胶体渗透压与营养体液；鸡子黄含丰富的磷脂与胆碱镇静中枢神经。',
      keyHerbPairs: [
        { pair: '黄连 + 阿胶', function: '泻火滋阴，一清心火一滋肾水，重建水火既济' },
        { pair: '芍药 + 鸡子黄', function: '养血柔肝、镇静安神，修复神经内分泌暴风' }
      ]
    },
    x: 580,
    y: 460
  },
  {
    id: 'm_jueyin_juereshengfu',
    name: '厥阴寒热错杂与血管舒缩风暴',
    meridian: 'jueyin',
    meridianName: '厥阴病',
    systemTag: '血管舒缩风暴',
    shortDesc: '阴阳不相顺接，微血管阵发痉挛与舒张交替致厥热胜复。',
    innerMechanism: {
      pathology: '病至厥阴，极度虚衰与应激状态交织，阴阳不相顺接。血管舒缩中枢严重失调，末梢微血管网呈现交替性严重痉挛（手足厥冷）与剧烈舒张（发热），伴消化道痉挛与炎性反应，出现“消渴，气上撞心，心中疼热，饥而不欲食”。',
      targetTissues: ['血管舒缩中枢', '植物神经节', '胃肠道平滑肌及粘膜'],
      biomarkers: ['内皮素 (ET-1) 与 NO 剧烈波动', '血糖/电解质紊乱', '血管张力不稳定'],
      physicalConcept: '系统非线性反馈失效，热冷极化剧烈震荡，系统稳定度崩溃。'
    },
    countermeasure: {
      formulaName: '乌梅丸 / 当归四逆汤',
      topicId: 'T_LIUJING_12',
      gateId: 'g9_6',
      composition: ['乌梅', '细辛', '干姜', '黄连', '当归', '附子', '蜀椒', '桂枝', '人参', '黄柏'],
      actionMechanism: '乌梅极酸调节肠道酸碱度与胃肠平滑肌痉挛；黄连黄柏清泻上焦与内脏之郁热；干姜附子细辛温通下焦之寒凝；当归桂枝补充并通畅末梢微循环。',
      keyHerbPairs: [
        { pair: '乌梅 + 黄连', function: '酸苦涌泄，安蛔镇痉，调和胃肠酸碱与神经敏感度' },
        { pair: '附子 + 当归', function: '温阳活血，改善末梢微血管网充盈与痉挛' }
      ]
    },
    x: 360,
    y: 580
  }
];

export const INNER_MECHANISM_LINKS: InnerMechanismLink[] = [
  {
    source: 'm_taiyang_biaoyu',
    target: 'm_yangming_gaore',
    label: '表邪化热入里',
    direction: 'forward',
    description: '太阳表邪未及时发汗解表，表郁之热郁极发爆发入里，下丘脑体温中枢调定点上移，转为阳明经证高热。'
  },
  {
    source: 'm_taiyang_biaoyu',
    target: 'm_yangming_fushi',
    label: '表邪误下化燥',
    direction: 'forward',
    description: '太阳表证未解而误用下药，损伤津液，肠液枯竭，燥屎结聚转为阳明腑实证。'
  },
  {
    source: 'm_taiyang_biaoyu',
    target: 'm_taiyang_xushui',
    label: '随经入腑蓄水',
    direction: 'forward',
    description: '太阳表邪不解，顺太阳经脉侵入膀胱之腑，导致肾与膀胱气化障碍、水通道蛋白表达紊乱。'
  },
  {
    source: 'm_taiyang_biaoyu',
    target: 'm_taiyang_xuxue',
    label: '热与血结蓄血',
    direction: 'forward',
    description: '太阳表邪化热深陷，与下焦血分相搏结，造成盆腔微循环极度瘀血与高凝状态。'
  },
  {
    source: 'm_taiyang_biaoyu',
    target: 'm_shaoyang_shuji',
    label: '传入半表半里',
    direction: 'forward',
    description: '太阳表邪抗争相持，未能完全发散，邪气向内侵入半表半里，致少阳枢机不利。'
  },
  {
    source: 'm_taiyang_biaoyu',
    target: 'm_taiyin_pixu',
    label: '直中太阴或误下',
    direction: 'cross',
    description: '素体脾胃虚弱者，表邪直中太阴；或太阳表证误用攻下，损伤脾阳致消化道ATP枯竭。'
  },
  {
    source: 'm_taiyang_biaoyu',
    target: 'm_shaoyin_yangxu',
    label: '直中少阴危候',
    direction: 'cross',
    description: '老年或心肾阳虚体质，寒邪极盛直中少阴，心肾微循环与线粒体瞬间受抑制，直达厥冷休克。'
  },
  {
    source: 'm_yangming_gaore',
    target: 'm_yangming_fushi',
    label: '高热耗津燥结',
    direction: 'forward',
    description: '阳明高热大汗持续，体液极度蒸发脱水，肠道水分被抽干，粪块燥结引发肠屏障崩溃。'
  },
  {
    source: 'm_shaoyang_shuji',
    target: 'm_yangming_gaore',
    label: '少阳失控转阳明',
    direction: 'forward',
    description: '少阳枢机不利，相火郁发不得宣泄，化热化燥侵入阳明，转为阳明高热证。'
  },
  {
    source: 'm_shaoyang_shuji',
    target: 'm_taiyin_pixu',
    label: '木郁克土传太阴',
    direction: 'cross',
    description: '少阳肝胆气郁失和，木郁克制脾土，影响胃肠运动与ATP合成，引发腹痛自利。'
  },
  {
    source: 'm_taiyin_pixu',
    target: 'm_shaoyin_yangxu',
    label: '脾阳损及肾阳',
    direction: 'deterioration',
    description: '太阴下利不愈，脾阳衰微日久必损及肾阳，导致心肾线粒体能量全面枯竭，传入少阴危重证。'
  },
  {
    source: 'm_shaoyin_yangxu',
    target: 'm_shaoyin_yinxu',
    label: '阳损及阴或阴虚火旺',
    direction: 'cross',
    description: '少阴病日久热化，或发汗过度伤阴，由阳虚水饮转为阴虚火旺、心中烦不得卧。'
  },
  {
    source: 'm_shaoyin_yangxu',
    target: 'm_jueyin_juereshengfu',
    label: '阴阳离决转厥阴',
    direction: 'deterioration',
    description: '少阴心肾衰竭进至极点，阴阳气不相顺接，引发阵发性微血管风暴与厥热胜复错杂危机。'
  },
  {
    source: 'm_shaoyin_yinxu',
    target: 'm_jueyin_juereshengfu',
    label: '热极生风入厥阴',
    direction: 'cross',
    description: '少阴阴虚至极，心火独亢，阴液枯涸，热极生风，传变入厥阴肝经引发风木交争。'
  }
];
