/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 新中式 (New Chinese Style) Global Theme Configuration
 * Defining authentic traditional Chinese palette constants & reusable UI tokens:
 * - 朱砂红 (Zhusha Red): #B91C1C / #991B1B - Imperial Seal Red, Primary Accents, Alerts
 * - 黛青 / 墨绿 (Dai Teal): #0D5D56 / #115E59 - Medical Physics, Mechanism & Serene Depth
 * - 宣纸米白 (Xuan Paper White): #FAF7F0 / #FFFCF7 - Authentic Rice Paper Canvas
 * - 赭石 / 琥珀 (Zheshi Ochre): #B45309 / #D97706 - Warm Ochre, Level Gates, Badges
 * - 松烟墨 (Soongyan Ink Black): #1C1917 / #292524 - Deep Typography & Charcoal Contrast
 * - 玄铁夜 (Obsidian Night): #141210 / #1F1C19 - Premium Dark Mode Backgrounds & Cards
 * - 绫绢 / 冰裂纹 (Paper Border): #EBDCC8 / #38322C - Traditional Frame Borders
 */

export const COLOR_PALETTE = {
  zhushaRed: {
    primary: '#B91C1C',
    hover: '#991B1B',
    lightBg: '#FAF2F2',
    darkBg: '#2D1515',
    border: '#F5D0D0',
    darkBorder: '#4A1D1D',
    text: '#B91C1C',
    darkText: '#FCA5A5'
  },
  daiTeal: {
    primary: '#0D5D56',
    hover: '#0B4D47',
    lightBg: '#F0F7F7',
    darkBg: '#0F282A',
    border: '#C2F0EC',
    darkBorder: '#134E4A',
    text: '#0D5D56',
    darkText: '#99F6E4'
  },
  zheshiOchre: {
    primary: '#B45309',
    hover: '#92400E',
    lightBg: '#FDF8EE',
    darkBg: '#2A1D12',
    border: '#FDE68A',
    darkBorder: '#78350F',
    text: '#B45309',
    darkText: '#FDE68A'
  },
  xuanPaper: {
    canvas: '#FAF7F0',
    card: '#FFFCF7',
    cardLighter: '#FFFDF9',
    border: '#EBDCC8',
    subtleBorder: '#F2E8DA'
  },
  moBlack: {
    primary: '#1C1917',
    secondary: '#57534E',
    muted: '#78716C'
  },
  obsidianDark: {
    canvas: '#141210',
    card: '#1F1C19',
    border: '#38322C'
  }
} as const;

export const TCM_THEME = {
  // Global Canvas Background
  canvas: 'bg-[#FAF7F0] dark:bg-[#141210] text-[#1C1917] dark:text-[#F5F5F4] min-h-screen font-sans',

  // App Header
  header: 'bg-[#FFFCF7]/90 dark:bg-[#1F1C19]/90 border-b border-[#EBDCC8] dark:border-[#38322C] backdrop-blur-md sticky top-0 z-40',

  // App Sidebar
  sidebar: 'bg-[#FFFCF7] dark:bg-[#1F1C19] border-r border-[#EBDCC8] dark:border-[#38322C]',
  
  // Sidebar Navigation Button Styles
  sidebarItemActive: 'bg-[#B45309] text-white font-black shadow-md border border-[#92400E]',
  sidebarItemInactive: 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FAF7F0] dark:hover:bg-[#2A2622] hover:text-[#1C1917] dark:hover:text-[#F5F5F4]',

  // Card Containers
  card: 'bg-[#FFFCF7] dark:bg-[#1F1C19] border border-[#EBDCC8] dark:border-[#38322C] rounded-2xl shadow-xs transition-all',
  cardHeader: 'border-b border-[#EBDCC8] dark:border-[#38322C] pb-3 mb-3',

  // Button Variants
  buttonZhusha: 'bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold rounded-xl shadow-xs transition-all active:scale-[0.98]',
  buttonDaiqing: 'bg-[#0D5D56] hover:bg-[#0B4D47] text-white font-bold rounded-xl shadow-xs transition-all active:scale-[0.98]',
  buttonZheshi: 'bg-[#B45309] hover:bg-[#92400E] text-white font-bold rounded-xl shadow-xs transition-all active:scale-[0.98]',
  buttonOutline: 'bg-[#FFFCF7] dark:bg-[#1F1C19] text-[#1C1917] dark:text-[#F5F5F4] border border-[#EBDCC8] dark:border-[#38322C] hover:bg-[#FAF7F0] dark:hover:bg-[#2A2622] font-bold rounded-xl transition-all',

  // Badge Styles
  badgeZhusha: 'px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#B91C1C] text-white font-mono shadow-2xs',
  badgeDaiqing: 'px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#0D5D56] text-white font-mono shadow-2xs',
  badgeZheshi: 'px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#B45309] text-white font-mono shadow-2xs',
  badgeXuan: 'px-2 py-0.5 rounded-md text-[10px] font-mono text-[#B45309] dark:text-[#FDE68A] bg-[#FDF8EE] dark:bg-[#2A1D12] border border-[#EBDCC8] dark:border-[#78350F]'
} as const;

export default TCM_THEME;
