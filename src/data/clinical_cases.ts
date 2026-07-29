/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClinicalCase } from '../types';

export const CASE_UI_CONFIG = {
  chiefComplaint: {
    label: '主诉诊察',
    badge: '📋 主诉',
    badgeBg: 'bg-[#b45309]',
    badgeText: 'text-white',
    cardBg: 'bg-[#fdf8ee] dark:bg-[#2a1d12]',
    borderColor: 'border-[#b45309] dark:border-[#f59e0b]',
    textColor: 'text-[#78350f] dark:text-[#fef3c7]',
    accentBg: 'bg-[#fef9c3]/80 dark:bg-[#451a03]/80',
    accentBorder: 'border-[#fde68a] dark:border-[#78350f]',
    iconName: 'Stethoscope'
  },
  patternIdentification: {
    label: '辨证思路',
    badge: '💡 辨证思路',
    badgeBg: 'bg-[#b91c1c]',
    badgeText: 'text-white',
    cardBg: 'bg-[#faf2f2] dark:bg-[#2d1515]',
    borderColor: 'border-[#b91c1c] dark:border-[#ef4444]',
    textColor: 'text-[#701a1a] dark:text-[#fecdd3]',
    accentBg: 'bg-white/80 dark:bg-black/30',
    accentBorder: 'border-[#f87171]/20',
    iconName: 'Brain'
  },
  formulaSelection: {
    label: '方剂选择',
    badge: '🔑 方剂选择',
    badgeBg: 'bg-[#7e22ce]',
    badgeText: 'text-white',
    cardBg: 'bg-[#f8f5fa] dark:bg-[#241733]',
    borderColor: 'border-[#7e22ce] dark:border-[#c084fc]',
    textColor: 'text-[#581c87] dark:text-[#f3e8ff]',
    accentBg: 'bg-white/80 dark:bg-black/30',
    accentBorder: 'border-[#c084fc]/30',
    iconName: 'Key'
  },
  modernMechanism: {
    label: '现代机理解析',
    badge: '⚡ 现代机理解析',
    badgeBg: 'bg-[#0d5d56]',
    badgeText: 'text-white',
    cardBg: 'bg-[#f0f7f7] dark:bg-[#0f282a]',
    borderColor: 'border-[#0d5d56] dark:border-[#14b8a6]',
    textColor: 'text-[#115e59] dark:text-[#ccfbf1]',
    accentBg: 'bg-white/80 dark:bg-black/30',
    accentBorder: 'border-[#c2f0ec]/40',
    iconName: 'Zap'
  }
};

export const CLINICAL_CASES_20: ClinicalCase[] = [
  {
    id: 'CC_01',
    title: '太阳中风表虚案（卫强营弱，汗孔失司）',
    channel: '太阳病',
    chiefComplaint: '感冒4天，体温37.9℃，特别怕风恶寒，身上一直汗出不止，颈项酸痛僵硬，伴鼻塞流涕、轻度干呕。',
    patternIdentification: '风邪袭表，卫气抗邪充血于体表（发热），营阴不能内守而玄府（汗孔）开阖失司泄漏津液（自汗）。自汗带走大量潜热故极度恶风。脉浮缓，舌淡红苔薄白润。属太阳中风表虚证。',
    formulaSelection: '桂枝汤（桂枝3两、芍药3两、甘草2两、生姜3两、大枣12枚）。服药后服热稀粥一碗以助药力，覆被微汗出。',
    modernMechanism: '体表微血管异常扩张伴汗腺自主神经门轴失控泄漏。桂枝扩血管透表与芍药收缩血管平滑肌1:1协同，配合生姜大枣补充血容量，重建微循环自稳态。',
    formulaComposition: '桂枝9g、芍药9g、生姜9g、炙甘草6g、大枣4枚',
    sourceClause: '《伤寒论》第12条：太阳中风，阳浮而阴弱…桂枝汤主之。'
  },
  {
    id: 'CC_02',
    title: '太阳伤寒表实案（玄府闭锁，高压无汗）',
    channel: '太阳病',
    chiefComplaint: '突发恶寒发热，体温39.3℃，全身无汗，剧烈头痛、腰痛、骨节酸痛，呼吸气急咳嗽。',
    patternIdentification: '寒邪强力收引闭束体表，肌腠玄府完全紧闭，卫阳郁遏不得宣发，肺气失宣上逆。脉浮紧有力，舌苔薄白。属太阳伤寒表实证。',
    formulaSelection: '麻黄汤（麻黄3两、桂枝2两、甘草1两、杏仁70个）。煮服后取微汗。',
    modernMechanism: '立毛肌强直收缩与汗腺排泄孔高压闭塞，体内热量积聚。麻黄碱兴奋β受体扩张支气管平滑肌并促汗，桂枝协同解痉开汗门，杏仁止咳平喘。',
    formulaComposition: '麻黄9g、桂枝6g、杏仁9g、炙甘草3g',
    sourceClause: '《伤寒论》第35条：太阳病，头痛发热，身疼腰痛…无汗而喘者，麻黄汤主之。'
  },
  {
    id: 'CC_03',
    title: '太阳阳明合病案（项强几几，风寒下利）',
    channel: '太阳病兼阳明',
    chiefComplaint: '恶寒发热，颈项后背僵硬不舒（项背强几几），全身无汗，伴频频腹泻下利水样便，日下利5-6次。',
    patternIdentification: '风寒表实未解，体表高压迫使水湿内走阳明肠道，肠道水液无法正常吸收而下利；背部筋脉失于津液濡养而僵硬。属太阳阳明合病。',
    formulaSelection: '葛根汤（葛根4两、麻黄3两、桂枝2两、芍药2两、甘草2两、生姜3两、大枣12枚）。',
    modernMechanism: '葛根素强效升举清阳，改善脑部与颈项部椎动脉血流量，缓解肌肉痉挛；同时抑制肠道异常蠕动与水液渗出，达成“升阳止泻与解肌”双重效果。',
    formulaComposition: '葛根12g、麻黄9g、桂枝6g、芍药6g、生姜9g、炙甘草6g、大枣4枚',
    sourceClause: '《伤寒论》第31条：太阳病，项背强几几，无汗恶风，葛根汤主之。'
  },
  {
    id: 'CC_04',
    title: '太阳表邪郁闭轻证案（日再发，身痒无汗）',
    channel: '太阳病',
    chiefComplaint: '感冒十余日不愈，每日阵发性发热恶寒如疟状，一日发作2-3次，全身皮肤发痒，无汗。',
    patternIdentification: '表邪大部已解，余邪郁于肌腠微循环，邪正交争导致阵发发热恶寒，卫气不得宣通郁于皮毛则身痒。属太阳病表郁轻证。',
    formulaSelection: '桂枝麻黄各半汤（桂枝汤与麻黄汤小剂量合方）。',
    modernMechanism: '小剂量透表发汗，避免大汗伤正，微幅调节体温调节中枢与皮肤微循环障碍，解除组胺样皮肤发痒反应。',
    formulaComposition: '桂枝6g、芍药6g、麻黄6g、生姜6g、炙甘草6g、大枣3枚、杏仁6g',
    sourceClause: '《伤寒论》第23条：太阳病，得之八九日，如疟状…身痒者，宜桂枝麻黄各半汤。'
  },
  {
    id: 'CC_05',
    title: '太阳表邪随经入腑案（蓄水水逆，小便不利）',
    channel: '太阳病兼腑证',
    chiefComplaint: '发热恶风，脐下动悸，小便量极少且排尿困难，烦渴极欲饮水，但水入即吐（水逆）。',
    patternIdentification: '太阳表邪未解，随经入腑影响膀胱气化功能，水液无法下行排泄而停聚于胃肠。胃富余水饮则水入即吐。属太阳蓄水证。',
    formulaSelection: '五苓散（猪苓18g、泽泻30g、白术18g、茯苓18g、桂枝12g）。捣为散，白饮和服。',
    modernMechanism: '水通道蛋白（AQP）表达失调。桂枝温阳通腑扩张肾血管，茯苓/泽泻/猪苓调节肾小球滤过与电解质平衡，白术运脾健胃消除水逆。',
    formulaComposition: '猪苓9g、泽泻15g、白术9g、茯苓9g、桂枝6g',
    sourceClause: '《伤寒论》第74条：太阳病，发汗后，大烦渴不解，脉浮，小便不利者，五苓散主之。'
  },
  {
    id: 'CC_06',
    title: '太阳表寒内饮案（咳嗽喘急，清稀泡沫痰）',
    channel: '太阳病兼水饮',
    chiefComplaint: '恶寒发热无汗，剧烈咳嗽喘急，吐大量清稀水样泡沫痰，胸膈满闷，夜间无法平卧。',
    patternIdentification: '外有表寒束闭，内有水饮停聚于肺（寒饮伏肺）。表寒闭肺，内饮阻气，肺失宣降。脉浮紧，苔白滑。属表寒里饮证。',
    formulaSelection: '小青龙汤（麻黄3两、芍药3两、细辛3两、干姜3两、甘草3两、桂枝3两、半夏半升、五味子半升）。',
    modernMechanism: '干姜、细辛温化下焦与肺部水饮，五味子收敛肺气防耗散，麻黄半夏解痉平喘并减少气道高反应性黏液分泌。',
    formulaComposition: '麻黄9g、芍药9g、细辛6g、干姜9g、甘草6g、桂枝9g、半夏9g、五味子6g',
    sourceClause: '《伤寒论》第40条：伤寒表不解，心下有水气，干呕发热而咳者…小青龙汤主之。'
  },
  {
    id: 'CC_07',
    title: '阳明气分大热案（大热大渴，脉洪大）',
    channel: '阳明病',
    chiefComplaint: '壮热不退（体温39.8℃），大汗淋漓，口渴极度想喝冷水，面红烦躁，脉洪大有力。',
    patternIdentification: '阳明邪热炽盛，里热蒸腾充斥气分，迫津外泄则大汗，津液大伤则大渴。属阳明经证（气分实热）。',
    formulaSelection: '白虎汤（石膏1斤、知母6两、甘草2两、粳米6合）。',
    modernMechanism: '石膏水合物强效抑制下丘脑体温调控中枢过热，知母降血糖保水保津，抗炎性细胞因子风暴，粳米补充肌糖原防止脱水衰竭。',
    formulaComposition: '石膏30g、知母12g、甘草6g、粳米15g',
    sourceClause: '《伤寒论》第168条：伤寒病，若吐若下后，七八日不解，热结在里…白虎加人参汤主之。'
  },
  {
    id: 'CC_08',
    title: '阳明腑实燥屎阻结案（日晡潮热，腹满硬痛）',
    channel: '阳明病',
    chiefComplaint: '每日下午（日晡）体温升高潮热，腹部胀满硬痛拒按，大便燥结7天未行，谵语神昏，手足濈然汗出。',
    patternIdentification: '阳明热结成实，燥屎阻滞肠道，肠胃气滞不通（具备痞、满、燥、实四症）。热邪上扰心神则谵语。属阳明腑实重证。',
    formulaSelection: '大承气汤（大黄4两、厚朴8两、枳实5枚、芒硝3合）。先煮厚朴枳实，后下大黄，芒硝溶服。',
    modernMechanism: '蒽醌类大黄素强烈刺激肠壁神经丛促进肠蠕动，芒硝高渗高吸水软化硬结粪块，厚朴枳实解除肠道气滞，快速排除肠道内毒素。',
    formulaComposition: '大黄12g、厚朴15g、枳实12g、芒硝9g',
    sourceClause: '《伤寒论》第208条：阳明病，潮热，大便溏，小便自可，胸胁满不去者…大承气汤主之。'
  },
  {
    id: 'CC_09',
    title: '少阳半表半里案（往来寒热，胸胁苦满）',
    channel: '少阳病',
    chiefComplaint: '发热与恶寒交替发作（往来寒热），胸胁部胀满不舒，心烦易呕，默默不欲饮食，口苦咽干目眩。',
    patternIdentification: '邪在少阳半表半里，枢机不利，胆火上炎则口苦咽干，胆胃不和则心烦喜呕不欲食。脉弦。属少阳病正局。',
    formulaSelection: '小柴胡汤（柴胡8两、黄芩3两、人参3两、半夏半升、甘草3两、生姜3两、大枣12枚）。',
    modernMechanism: '柴胡皂苷疏肝利胆，黄芩素抗炎解热，调节下丘脑-垂体-肾上腺轴（HPA轴），协调植物神经功能恢复胃肠道正常排空。',
    formulaComposition: '柴胡24g、黄芩9g、人参9g、半夏9g、甘草6g、生姜9g、大枣4枚',
    sourceClause: '《伤寒论》第96条：伤寒五六日中风，往来寒热，胸胁苦满…小柴胡汤主之。'
  },
  {
    id: 'CC_10',
    title: '少阳兼阳明腑实案（心下急痛，郁郁微烦）',
    channel: '少阳病兼阳明',
    chiefComplaint: '往来寒热，心窝部（心下）急痛郁郁微烦，按之腹痛剧烈，呕吐不止，大便秘结不通。',
    patternIdentification: '少阳枢机不利兼阳明热实初结，胆胃失和，腑气不通。属少阳阳明合病。',
    formulaSelection: '大柴胡汤（柴胡8两、黄芩3两、芍药3两、半夏半升、枳实4枚、大黄2两、生姜5两、大枣12枚）。',
    modernMechanism: '解除胆道与幽门平滑肌痉挛，促进胆汁分泌与胃排空，抑制肠道细菌移位，防止急性胆囊炎与急性胰腺炎重症化。',
    formulaComposition: '柴胡15g、黄芩9g、芍药9g、半夏9g、枳实9g、大黄6g、生姜12g、大枣4枚',
    sourceClause: '《伤寒论》第103条：太阳病，过经十余日，反二三下之…宜大柴胡汤。'
  },
  {
    id: 'CC_11',
    title: '太阴脾胃虚寒案（腹满时痛，自利不渴）',
    channel: '太阴病',
    chiefComplaint: '腹部胀满时时隐痛，喜温喜按，食欲极差，大便清稀下利且口不渴，手足发凉。',
    patternIdentification: '太阴脾阳虚弱，运化失职，寒湿内生，阴寒凝滞肠胃。脉沉细无力，舌淡苔白滑。属太阴脾胃虚寒证。',
    formulaSelection: '理中丸（人参3两、干姜3两、甘草3两、白术3两）。蜜丸或作汤剂水煎服。',
    modernMechanism: '干姜姜辣素强烈兴奋消化道血液循环与平滑肌张力，白术水提物增强肠道吸收功能，人参甘草补充能量储备，提升体温调节能力。',
    formulaComposition: '人参9g、干姜9g、白术9g、炙甘草9g',
    sourceClause: '《伤寒论》第273条：太阴之为病，腹满而吐，食不下，自利益甚…理中汤主之。'
  },
  {
    id: 'CC_12',
    title: '太阴虚寒兼太阳表邪案（误下腹痛，微恶寒）',
    channel: '太阴病兼太阳',
    chiefComplaint: '腹泻下利，误用下药后腹部阵发性剧痛满闷，伴微恶寒发热、脉浮无力。',
    patternIdentification: '本有太阴脾虚，误用下药损伤脾阳，兼有太阳表邪未尽。属太阴虚寒兼太阳表证。',
    formulaSelection: '桂枝加人参汤（桂枝汤原方加人参3两）。',
    modernMechanism: '补充消化道粘膜ATP能量储备与免疫屏障，提高肠道粘膜微循环血流量，同时解表调和营卫。',
    formulaComposition: '桂枝9g、芍药9g、生姜9g、甘草6g、大枣4枚、人参9g',
    sourceClause: '《伤寒论》第163条：太阳病，外证未解，而数下之…桂枝加人参汤主之。'
  },
  {
    id: 'CC_13',
    title: '少阴阴盛阳微案（四肢厥逆，神疲欲寐）',
    channel: '少阴病',
    chiefComplaint: '四肢冰冷冰凉至肘膝关节，极度疲倦神志昏昏欲睡（神疲欲寐），蜷缩恶寒，下利清谷（完谷不化），脉微欲绝。',
    patternIdentification: '少阴心肾阳虚，阴寒内盛，阳气暴脱，机体循环衰竭。属少阴病阳虚厥逆重证。',
    formulaSelection: '四逆汤（附子1枚生用、干姜1两半、甘草2两）。',
    modernMechanism: '乌头碱与去甲乌药碱强心升压，抗休克，显著增加心输出量与冠状动脉血流量，提升全身基础代谢率。',
    formulaComposition: '制附子15g、干姜9g、炙甘草12g',
    sourceClause: '《伤寒论》第323条：少阴病，脉沉者，急温之，宜四逆汤。'
  },
  {
    id: 'CC_14',
    title: '少阴阴虚火旺案（心烦不得眠，舌红无苔）',
    channel: '少阴病',
    chiefComplaint: '严重心烦难以入睡（彻夜难眠），口干咽燥，舌质红绛光红无苔，脉细数。',
    patternIdentification: '少阴肾水不足，心火独亢，水火不济，心神被扰。属少阴病热化证（阴虚火旺）。',
    formulaSelection: '黄连阿胶汤（黄连4两、黄芩2两、芍药2两、阿胶3两、鸡子黄2枚）。阿胶烊化，鸡子黄后下。',
    modernMechanism: '小檗碱镇静降火抑制中枢神经过度兴奋，阿胶与鸡子黄补充神经递质与氨基酸，调节脑神经褪黑素与神经内分泌平衡。',
    formulaComposition: '黄连12g、黄芩6g、芍药6g、阿胶9g、鸡子黄1枚',
    sourceClause: '《伤寒论》第303条：少阴病，得之二三日以上，心中烦，不得卧者，黄连阿胶汤主之。'
  },
  {
    id: 'CC_15',
    title: '少阴客热咽痛案（咽痛局限，无表证）',
    channel: '少阴病',
    chiefComplaint: '咽喉疼痛2天，无发热恶寒，咽部轻度红肿，吞咽时隐痛。',
    patternIdentification: '少阴客热上攻咽喉，局部分泌物滞留。属少阴咽痛轻证。',
    formulaSelection: '桔梗汤（桔梗1两、甘草2两）。',
    modernMechanism: '甘草皂苷强效抗炎类固醇样作用，桔梗皂苷刺激呼吸道黏膜增加排痰与局部抗炎镇痛。',
    formulaComposition: '桔梗6g、甘草12g',
    sourceClause: '《伤寒论》第311条：少阴病，二三日咽痛者，可与甘草汤，不差，与桔梗汤。'
  },
  {
    id: 'CC_16',
    title: '厥阴寒热错杂案（消渴气撞，蛔厥吐蛔）',
    channel: '厥阴病',
    chiefComplaint: '烦渴多饮，感觉有一股气从腹部上撞心口，心口疼热，饥饿却不想吃东西（食则吐），四肢厥冷。',
    patternIdentification: '厥阴病寒热错杂，上热下寒，木火刑金，蛔虫受寒上扰。属厥阴病主证（乌梅丸证）。',
    formulaSelection: '乌梅丸（乌梅300个、细辛6两、干姜10两、黄连16两、当归4两、蜀椒4两、桂枝6两、人参6两、黄柏6两、附子6两）。',
    modernMechanism: '酸性乌梅协同温里清热药调节胃肠酸碱度与植物神经敏感度，安蛔止痛，调和寒热两端。',
    formulaComposition: '乌梅15g、细辛3g、干姜9g、黄连12g、当归6g、蜀椒3g、桂枝6g、人参6g、黄柏6g、制附子6g',
    sourceClause: '《伤寒论》第338条：厥阴之为病，消渴，气上撞心，心中疼热，饥而不欲食…乌梅丸主之。'
  },
  {
    id: 'CC_17',
    title: '厥阴血虚寒凝案（手足厥寒，脉细欲绝）',
    channel: '厥阴病',
    chiefComplaint: '手足发凉冰冷至手腕脚踝（手足厥寒），口不渴，舌淡苔白，脉象极细微弱（脉细欲绝）。',
    patternIdentification: '厥阴阴血不足，复感寒邪凝滞血脉，末梢循环不良。属厥阴血虚寒凝证。',
    formulaSelection: '当归四逆汤（当归3两、桂枝3两、芍药3两、细辛3两、甘草2两、通草2两、大枣25枚）。',
    modernMechanism: '显著改善末梢微循环与雷诺氏现象，促进血管扩张，增加红细胞变形能力与组织供氧。',
    formulaComposition: '当归12g、桂枝9g、芍药9g、细辛3g、炙甘草6g、通草6g、大枣6枚',
    sourceClause: '《伤寒论》第351条：手足厥寒，脉细欲绝者，当归四逆汤主之。'
  },
  {
    id: 'CC_18',
    title: '太阳少阳合病兼太阴水饮案（往来寒热，胸胁满微结）',
    channel: '太阳少阳兼太阴',
    chiefComplaint: '往来寒热，胸胁胀满微结，小便排泄不畅，口渴而不呕吐，头部出汗，心烦意乱。',
    patternIdentification: '少阳枢机不利，兼太阴脾寒水饮上逆，三焦气化失司。属柴胡桂枝干姜汤证。',
    formulaSelection: '柴胡桂枝干姜汤（柴胡8两、桂枝3两、干姜2两、黄芩3两、牡蛎2两、甘草2两、瓜蒌根4两）。',
    modernMechanism: '调节水盐代谢与胆汁分泌，温脾散寒兼清上焦郁热，镇静安神缓解植物神经紊乱。',
    formulaComposition: '柴胡24g、桂枝9g、干姜6g、黄芩9g、煅牡蛎9g、甘草6g、天花粉12g',
    sourceClause: '《伤寒论》第147条：伤寒五六日，已发汗而复下之，胸胁满微结，小便不利…柴胡桂枝干姜汤主之。'
  },
  {
    id: 'CC_19',
    title: '太阳水热互结结胸实证案（心下石硬，按之剧痛）',
    channel: '太阳病变证',
    chiefComplaint: '从心窝部一直到少腹部腹皮硬满疼痛不可触摸，短气烦躁，下午潮热，脉沉紧按之硬如石头。',
    patternIdentification: '水热互结于胸腹，气道阻塞，实热成聚。属大结胸实证。',
    formulaSelection: '大陷胸汤（大黄6两、芒硝1升、甘遂1钱匕）。先煮大黄，去滓纳芒硝，煮一两沸，纳甘遂末。',
    modernMechanism: '甘遂强效排水泄热，联合芒硝大黄消除腹腔积液与急性腹膜炎渗出，急下存阴。',
    formulaComposition: '大黄12g、芒硝9g、甘遂1.5g',
    sourceClause: '《伤寒论》第135条：伤寒六七日，结胸热实，脉沉而紧，心下痛，按之石硬者，大陷胸汤主之。'
  },
  {
    id: 'CC_20',
    title: '太阳脾虚水气上冲案（心下逆满，起则头眩）',
    channel: '太阳病变证',
    chiefComplaint: '心窝部（心下）胀满逆气，站立起身时头晕目眩，心悸不安，感觉胃里有水声（水鸡鸣声）。',
    patternIdentification: '脾阳虚弱，水饮内停，水气上冲凌心犯肺。脉沉紧。属苓桂术甘汤证。',
    formulaSelection: '苓桂术甘汤（茯苓4两、桂枝3两、白术2两、甘草2两）。',
    modernMechanism: '茯苓、白术利尿利水，桂枝温阳平冲，显著降低内耳前庭水肿与心脏前后负荷，改善体位性低血压。',
    formulaComposition: '茯苓18g、桂枝12g、白术9g、炙甘草6g',
    sourceClause: '《伤寒论》第67条：伤寒若吐、若下后，心下逆满，气上冲胸，起则头眩…苓桂术甘汤主之。'
  }
];
