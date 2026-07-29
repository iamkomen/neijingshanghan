/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NetworkNode {
  id: string;
  name: string;
  type: 'formula' | 'herb' | 'meridian' | 'pair'; // Formula (经方), Herb (药味), Meridian state (六经病机), Herb Pair (核心药对)
  meridian?: 'taiyang' | 'yangming' | 'shaoyang' | 'taiyin' | 'shaoyin' | 'jueyin' | 'complex';
  category?: string;
  description: string;
  innerMechanism: string;
  topicId?: string; // Target learning topic ID for direct navigation
  gateId?: string; // Target level gate ID
  composition?: string[]; // Herb list for formulas
  clauses?: string[]; // Related clause numbers
  x?: number; // Visual graph coordinates
  y?: number;
}

export interface NetworkLink {
  source: string; // Node ID
  target: string; // Node ID
  label: string;  // e.g. "配伍加减", "传变逻辑", "主治要药", "化裁衍生"
  relationType: 'herb_in_formula' | 'transformation' | 'pair_building' | 'variation';
}

export const FORMULA_NODES: NetworkNode[] = [
  // --- 太阳病经方 ---
  {
    id: 'f_guizhitang',
    name: '桂枝汤',
    type: 'formula',
    meridian: 'taiyang',
    category: '解肌调和营卫',
    description: '太阳中风表虚证第一方。调和营卫、解肌祛风、开合玄府。',
    innerMechanism: '桂枝温通心阳散表寒，芍药酸收敛阴和营血，生姜大枣甘草培补中焦化津液，充盈肌腠玄府。',
    topicId: 'T_LIUJING_1',
    gateId: 'g9_1',
    composition: ['桂枝', '芍药', '生姜', '大枣', '甘草'],
    clauses: ['第12条', '第13条', '第42条', '第95条'],
    x: 180,
    y: 120
  },
  {
    id: 'f_mahuangtang',
    name: '麻黄汤',
    type: 'formula',
    meridian: 'taiyang',
    category: '发汗解表宣肺',
    description: '太阳伤寒表实证主方。发汗解表、宣肺平喘、开闭毛窍。',
    innerMechanism: '麻黄开闭塞之毛窍，桂枝温通经络助麻黄，杏仁降肺气以助宣发，甘草和中缓急。',
    topicId: 'T_LIUJING_2',
    gateId: 'g9_1',
    composition: ['麻黄', '桂枝', '杏仁', '甘草'],
    clauses: ['第35条', '第36条', '第37条'],
    x: 320,
    y: 100
  },
  {
    id: 'f_guimaban',
    name: '桂枝麻黄各半汤',
    type: 'formula',
    meridian: 'taiyang',
    category: '微发其汗',
    description: '太阳表郁轻证。邪微不得汗解，身痒如虫行。',
    innerMechanism: '桂枝汤与麻黄汤合方缩小剂量，微发其汗，使邪气从玄府微微发散而不伤正气。',
    topicId: 'T_LIUJING_3',
    gateId: 'g9_1',
    composition: ['桂枝', '芍药', '生姜', '大枣', '甘草', '麻黄', '杏仁'],
    clauses: ['第23条'],
    x: 250,
    y: 220
  },
  {
    id: 'f_wulingsan',
    name: '五苓散',
    type: 'formula',
    meridian: 'taiyang',
    category: '通阳化气利水',
    description: '太阳蓄水证。太阳表邪未解，随经入府，膀胱气化不利，水饮内停。',
    innerMechanism: '桂枝温通膀胱气化，茯苓白术猪苓泽泻渗湿利水，化气行水、表里双解。',
    topicId: 'T_LIUJING_4',
    gateId: 'g9_1',
    composition: ['桂枝', '茯苓', '白术', '猪苓', '泽泻'],
    clauses: ['第71条', '第73条', '第74条'],
    x: 120,
    y: 280
  },
  {
    id: 'f_taohechengqi',
    name: '桃核承气汤',
    type: 'formula',
    meridian: 'taiyang',
    category: '逐瘀泻热',
    description: '太阳蓄血证。表邪化热入里，与下焦血相搏结，其人如狂。',
    innerMechanism: '桃仁红花活血破瘀，大黄芒硝泻热通便，桂枝温通血脉引药下行，甘草缓急。',
    topicId: 'T_LIUJING_5',
    gateId: 'g9_1',
    composition: ['桃仁', '大黄', '芒硝', '桂枝', '甘草'],
    clauses: ['第106条'],
    x: 300,
    y: 320
  },

  // --- 阳明病经方 ---
  {
    id: 'f_baihutang',
    name: '白虎汤',
    type: 'formula',
    meridian: 'yangming',
    category: '清热生津',
    description: '阳明经证无形热盛。大汗出、大烦渴、大热、脉洪大。',
    innerMechanism: '石膏辛甘大寒清透阳明无形之热，知母苦寒质润清热滋阴，甘草粳米和中养胃防止伤津。',
    topicId: 'T_LIUJING_6',
    gateId: 'g9_2',
    composition: ['石膏', '知母', '甘草', '粳米'],
    clauses: ['第176条', '第219条'],
    x: 480,
    y: 120
  },
  {
    id: 'f_dachengqi',
    name: '大承气汤',
    type: 'formula',
    meridian: 'yangming',
    category: '峻下热结',
    description: '阳明腑证有形燥结。痞、满、燥、实，潮热谵语，腹满痛。',
    innerMechanism: '大黄荡涤肠胃实热，芒硝软坚润燥，枳实厚朴行气消痞除满，强力通下燥结。',
    topicId: 'T_LIUJING_7',
    gateId: 'g9_2',
    composition: ['大黄', '芒硝', '枳实', '厚朴'],
    clauses: ['第208条', '第241条'],
    x: 600,
    y: 180
  },

  // --- 少阳病经方 ---
  {
    id: 'f_xiaochaihu',
    name: '小柴胡汤',
    type: 'formula',
    meridian: 'shaoyang',
    category: '和解少阳枢机',
    description: '少阳半表半里证主方。往来寒热、胸胁苦满、心烦喜呕、默默不欲饮食。',
    innerMechanism: '柴胡升发透达少阳邪气，黄芩清泄少阳相火，半夏生姜降逆止呕，人参大枣甘草扶正和中。',
    topicId: 'T_LIUJING_10',
    gateId: 'g9_3',
    composition: ['柴胡', '黄芩', '半夏', '生姜', '人参', '大枣', '甘草'],
    clauses: ['第96条', '第97条', '第101条'],
    x: 420,
    y: 280
  },
  {
    id: 'f_dachaihu',
    name: '大柴胡汤',
    type: 'formula',
    meridian: 'shaoyang',
    category: '少阳阳明合病',
    description: '少阳未解、阳明腑实。按之心下满痛、郁郁微烦、大便不通。',
    innerMechanism: '小柴胡汤去人参甘草之补滞，加芍药大黄枳实以和解少阳兼泻阳明有形实热。',
    topicId: 'T_LIUJING_11',
    gateId: 'g9_3',
    composition: ['柴胡', '黄芩', '半夏', '生姜', '芍药', '枳实', '大黄', '大枣'],
    clauses: ['第103条', '第165条'],
    x: 540,
    y: 300
  },
  {
    id: 'f_chaihu_guizhi_ganjiang',
    name: '柴胡桂枝干姜汤',
    type: 'formula',
    meridian: 'shaoyang',
    category: '少阳太阴合病',
    description: '少阳枢机不利，兼太阴脾寒水饮。胸胁满微结、小便不利、渴而不呕、但头汗出。',
    innerMechanism: '柴胡黄芩和解少阳，桂枝干姜温通太阴脾阳，牡蛎天花粉软坚生津散结。',
    topicId: 'T_LIUJING_12',
    gateId: 'g9_3',
    composition: ['柴胡', '黄芩', '桂枝', '干姜', '天花粉', '牡蛎', '甘草'],
    clauses: ['第147条'],
    x: 400,
    y: 400
  },

  // --- 太阴病经方 ---
  {
    id: 'f_lizhongtang',
    name: '理中汤',
    type: 'formula',
    meridian: 'taiyin',
    category: '温中健脾',
    description: '太阴虚寒证。自利不渴、呕吐腹痛、脾胃虚寒、水饮不化。',
    innerMechanism: '干姜大温中焦脾阳，人参大补脾胃之气，白术健脾燥湿利水，甘草和中缓急补虚。',
    topicId: 'T_LIUJING_13',
    gateId: 'g9_3',
    composition: ['干姜', '人参', '白术', '甘草'],
    clauses: ['第273条', '第386条'],
    x: 220,
    y: 420
  },
  {
    id: 'f_guizhi_jiashaoyao',
    name: '桂枝加芍药汤',
    type: 'formula',
    meridian: 'taiyin',
    category: '通阳和络止痛',
    description: '太阴病误下，腹满时痛，脾络拘急。',
    innerMechanism: '桂枝汤倍用芍药（双倍剂量），柔肝缓急、解脾络拘挛，和营通络止腹痛。',
    topicId: 'T_LIUJING_14',
    gateId: 'g9_3',
    composition: ['桂枝', '芍药', '生姜', '大枣', '甘草'],
    clauses: ['第279条'],
    x: 140,
    y: 500
  },

  // --- 少阴病经方 ---
  {
    id: 'f_sini_tang',
    name: '四逆汤',
    type: 'formula',
    meridian: 'shaoyin',
    category: '回阳救逆',
    description: '少阴病寒化证。脉微细、但欲寐、四肢厥逆、下利清谷、心肾阳衰。',
    innerMechanism: '生附子大辛大热走十二经挽狂澜，干姜守中助附子回阳，生甘草缓附子之毒性并延长药力。',
    topicId: 'T_LIUJING_15',
    gateId: 'g9_4',
    composition: ['附子', '干姜', '甘草'],
    clauses: ['第323条', '第353条'],
    x: 520,
    y: 480
  },
  {
    id: 'f_zhenwutang',
    name: '真武汤',
    type: 'formula',
    meridian: 'shaoyin',
    category: '温阳利水',
    description: '少阴阳虚水泛。心下悸、头眩、身瞤动、振振欲擗地。',
    innerMechanism: '附子温补心肾阳气，茯苓白术健脾渗湿利水，生姜温胃散水，芍药和营敛阴缓急。',
    topicId: 'T_LIUJING_15',
    gateId: 'g9_4',
    composition: ['附子', '茯苓', '白术', '生姜', '芍药'],
    clauses: ['第82条', '第316条'],
    x: 320,
    y: 520
  },

  // --- 厥阴病经方 ---
  {
    id: 'f_wumeiwan',
    name: '乌梅丸',
    type: 'formula',
    meridian: 'jueyin',
    category: '温脏安蛔寒热错杂',
    description: '厥阴病寒热错杂主方。消渴、气上撞心、心中疼热、食则吐蛔、下之利不止。',
    innerMechanism: '乌梅极酸安蛔敛阴，细辛干姜附子蜀椒桂枝温脏散寒，黄连黄柏清泄上焦厥阴郁热，人参当归补气养血。',
    topicId: 'T_LIUJING_18',
    gateId: 'g9_4',
    composition: ['乌梅', '细辛', '干姜', '附子', '黄连', '黄柏', '当归', '人参', '桂枝', '蜀椒'],
    clauses: ['第338条'],
    x: 650,
    y: 420
  },
  {
    id: 'f_danggui_sini',
    name: '当归四逆汤',
    type: 'formula',
    meridian: 'jueyin',
    category: '养血通脉散寒',
    description: '厥阴病血虚寒凝。手足厥寒、脉细欲绝。',
    innerMechanism: '当归芍药养血和营，桂枝细辛温通经脉散表里阴寒，木通通利血脉，甘草大枣补脾和中。',
    topicId: 'T_LIUJING_19',
    gateId: 'g9_4',
    composition: ['当归', '桂枝', '芍药', '细辛', '甘草', '通草', '大枣'],
    clauses: ['第351条'],
    x: 660,
    y: 540
  },

  // --- 核心药味节点 (Herb Nodes) ---
  {
    id: 'h_guizhi',
    name: '桂枝',
    type: 'herb',
    description: '辛甘温。温通心阳、解肌发表、助气化、通经络。',
    innerMechanism: '内景物理：作为扩张表层血管与温通心肌泵动力的主力。',
    x: 200,
    y: 200
  },
  {
    id: 'h_mahuang',
    name: '麻黄',
    type: 'herb',
    description: '辛微苦温。发汗散寒、宣肺平喘、利水消肿。',
    innerMechanism: '内景物理：强力打开被寒邪闭塞之毛窍玄府，舒张支气管。',
    x: 350,
    y: 180
  },
  {
    id: 'h_fuzi',
    name: '附子',
    type: 'herb',
    description: '辛大热。回阳救逆、补火助阳、散寒止痛。',
    innerMechanism: '内景物理：注入强心肾能量，挽救衰竭之血液循环与细胞呼吸。',
    x: 480,
    y: 560
  },
  {
    id: 'h_chaihu',
    name: '柴胡',
    type: 'herb',
    description: '苦微寒。和解少阳、疏肝解郁、升举阳气。',
    innerMechanism: '内景物理：调节三焦膜系与胆囊淋巴流速，舒利枢机。',
    x: 450,
    y: 220
  },
  {
    id: 'h_ganjiang',
    name: '干姜',
    type: 'herb',
    description: '辛热。温中散寒、回阳通脉、温肺化饮。',
    innerMechanism: '内景物理：激活中焦胃肠黏膜血液循环，提升脾胃消化热能。',
    x: 300,
    y: 450
  },
  {
    id: 'h_dahuang',
    name: '大黄',
    type: 'herb',
    description: '苦寒。泻下攻积、清热泻火、凉血解毒、逐瘀通经。',
    innerMechanism: '内景物理：促进肠道剧烈蠕动，清除肠道积聚之有形毒素与燥屎。',
    x: 580,
    y: 240
  },

  // --- 六经转化状态节点 (Meridian States) ---
  {
    id: 'm_taiyang',
    name: '太阳病 (表虚/表实/水血)',
    type: 'meridian',
    meridian: 'taiyang',
    description: '病在肌表玄府。脉浮、头项强痛而恶寒。',
    innerMechanism: '人体最外层防御屏障，控制毛窍玄府开合与膀胱气化。',
    x: 150,
    y: 50
  },
  {
    id: 'm_yangming',
    name: '阳明病 (经热/腑实)',
    type: 'meridian',
    meridian: 'yangming',
    description: '胃家实也。邪气化热入里，燥热伤津。',
    innerMechanism: '中焦胃肠燥热亢盛，血管舒张大汗出或肠道水份被抽干燥结。',
    x: 550,
    y: 50
  },
  {
    id: 'm_shaoyang',
    name: '少阳病 (枢机不利)',
    type: 'meridian',
    meridian: 'shaoyang',
    description: '半表半里。口苦、咽干、目眩、往来寒热。',
    innerMechanism: '病在三焦膜系与胆腑枢机，表里气化失衡。',
    x: 380,
    y: 350
  },
  {
    id: 'm_taiyin',
    name: '太阴病 (脾胃虚寒)',
    type: 'meridian',
    meridian: 'taiyin',
    description: '腹满而吐、食不下、自利益甚、时腹自痛。',
    innerMechanism: '中焦脾阳虚弱，运化失职，水湿停滞。',
    x: 180,
    y: 350
  },
  {
    id: 'm_shaoyin',
    name: '少阴病 (心肾阳衰)',
    type: 'meridian',
    meridian: 'shaoyin',
    description: '脉微细、但欲寐。心肾阳气衰微，水气泛滥。',
    innerMechanism: '病在最深层生命动力核心，心泵力衰竭与肾气化丧失。',
    x: 450,
    y: 620
  },
  {
    id: 'm_jueyin',
    name: '厥阴病 (阴阳不顺)',
    type: 'meridian',
    meridian: 'jueyin',
    description: '消渴、气上撞心、心中疼热、食则吐蛔。',
    innerMechanism: '阴阳极度失调，寒热错杂，厥逆与发热交替。',
    x: 700,
    y: 350
  }
];

export const FORMULA_LINKS: NetworkLink[] = [
  // --- 太阳病衍生加减 ---
  { source: 'm_taiyang', target: 'f_guizhitang', label: '表虚主方', relationType: 'transformation' },
  { source: 'm_taiyang', target: 'f_mahuangtang', label: '表实主方', relationType: 'transformation' },
  { source: 'f_guizhitang', target: 'f_guimaban', label: '加麻黄微发汗', relationType: 'variation' },
  { source: 'f_mahuangtang', target: 'f_guimaban', label: '合桂枝汤', relationType: 'variation' },
  { source: 'f_guizhitang', target: 'f_wulingsan', label: '随经入府蓄水', relationType: 'transformation' },
  { source: 'f_guizhitang', target: 'f_taohechengqi', label: '化热入血蓄血', relationType: 'transformation' },

  // --- 药味归经与配伍 ---
  { source: 'h_guizhi', target: 'f_guizhitang', label: '温通心阳', relationType: 'herb_in_formula' },
  { source: 'h_guizhi', target: 'f_mahuangtang', label: '协同透表', relationType: 'herb_in_formula' },
  { source: 'h_guizhi', target: 'f_wulingsan', label: '化气利水', relationType: 'herb_in_formula' },
  { source: 'h_mahuang', target: 'f_mahuangtang', label: '发汗宣肺', relationType: 'herb_in_formula' },

  // --- 太阳 -> 阳明 传变 ---
  { source: 'f_guizhitang', target: 'f_baihutang', label: '过汗伤津化热', relationType: 'transformation' },
  { source: 'm_yangming', target: 'f_baihutang', label: '经证热盛', relationType: 'transformation' },
  { source: 'f_baihutang', target: 'f_dachengqi', label: '热盛伤津成实', relationType: 'transformation' },
  { source: 'm_yangming', target: 'f_dachengqi', label: '腑证燥结', relationType: 'transformation' },
  { source: 'h_dahuang', target: 'f_dachengqi', label: '泻热通肠', relationType: 'herb_in_formula' },
  { source: 'h_dahuang', target: 'f_dachengqi', label: '逐瘀泻热', relationType: 'herb_in_formula' },

  // --- 太阳 -> 少阳 传变 ---
  { source: 'f_guizhitang', target: 'f_xiaochaihu', label: '邪入少阳膜系', relationType: 'transformation' },
  { source: 'm_shaoyang', target: 'f_xiaochaihu', label: '和解枢机', relationType: 'transformation' },
  { source: 'h_chaihu', target: 'f_xiaochaihu', label: '枢机要药', relationType: 'herb_in_formula' },
  { source: 'f_xiaochaihu', target: 'f_dachaihu', label: '兼阳明腑实', relationType: 'variation' },
  { source: 'f_xiaochaihu', target: 'f_chaihu_guizhi_ganjiang', label: '兼太阴脾寒', relationType: 'variation' },

  // --- 太阳/少阳 -> 太阴 传变 ---
  { source: 'f_guizhitang', target: 'f_lizhongtang', label: '误下伤脾阳', relationType: 'transformation' },
  { source: 'f_guizhitang', target: 'f_guizhi_jiashaoyao', label: '倍用芍药止腹痛', relationType: 'variation' },
  { source: 'm_taiyin', target: 'f_lizhongtang', label: '虚寒主方', relationType: 'transformation' },
  { source: 'h_ganjiang', target: 'f_lizhongtang', label: '温中健脾', relationType: 'herb_in_formula' },

  // --- 太阴 -> 少阴 传变 ---
  { source: 'f_lizhongtang', target: 'f_sini_tang', label: '脾阳衰连及心肾阳微', relationType: 'transformation' },
  { source: 'm_shaoyin', target: 'f_sini_tang', label: '回阳救逆', relationType: 'transformation' },
  { source: 'm_shaoyin', target: 'f_zhenwutang', label: '温阳利水', relationType: 'transformation' },
  { source: 'h_fuzi', target: 'f_sini_tang', label: '回阳第一药', relationType: 'herb_in_formula' },
  { source: 'h_fuzi', target: 'f_zhenwutang', label: '温肾化气', relationType: 'herb_in_formula' },

  // --- 少阴 -> 厥阴 传变 ---
  { source: 'm_jueyin', target: 'f_wumeiwan', label: '寒热错杂', relationType: 'transformation' },
  { source: 'm_jueyin', target: 'f_danggui_sini', label: '血虚寒凝', relationType: 'transformation' },
  { source: 'f_sini_tang', target: 'f_wumeiwan', label: '阴阳格拒寒热并用', relationType: 'transformation' },
  { source: 'h_fuzi', target: 'f_wumeiwan', label: '温内藏寒邪', relationType: 'herb_in_formula' },
  { source: 'h_guizhi', target: 'f_danggui_sini', label: '温通血脉', relationType: 'herb_in_formula' }
];
