/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  FORMULA_NODES,
  FORMULA_LINKS,
  NetworkNode,
  NetworkLink
} from '../data/formulaNetworkData';
import {
  Network,
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

interface FormulaNetworkGraphProps {
  onSelectTopic: (topicId: string) => void;
  unlockedLevels?: string[];
  completedLessons?: string[];
}

export default function FormulaNetworkGraph({
  onSelectTopic,
  unlockedLevels = [],
  completedLessons = []
}: FormulaNetworkGraphProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('f_guizhitang');
  const [activeMeridianFilter, setActiveMeridianFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'evolution' | 'herbs' | 'all'>('evolution');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingPan, setIsDraggingPan] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Filter nodes based on Meridian filter, Search Query, and View Mode
  const filteredNodes = useMemo(() => {
    return FORMULA_NODES.filter((node) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = node.name.toLowerCase().includes(q);
        const matchDesc = node.description.toLowerCase().includes(q);
        const matchComp = node.composition?.some((c) => c.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchComp) return false;
      }

      // Meridian filter
      if (activeMeridianFilter !== 'all') {
        if (node.meridian !== activeMeridianFilter && node.type !== 'herb') {
          return false;
        }
      }

      // View mode filter
      if (viewMode === 'herbs') {
        return node.type === 'herb' || node.type === 'formula';
      } else if (viewMode === 'evolution') {
        return node.type === 'formula' || node.type === 'meridian';
      }

      return true;
    });
  }, [activeMeridianFilter, searchQuery, viewMode]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  // Filter links where both source and target exist in filtered nodes
  const filteredLinks = useMemo(() => {
    return FORMULA_LINKS.filter(
      (link) => filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
    );
  }, [filteredNodeIds]);

  // Selected Node Details
  const selectedNode = useMemo(() => {
    return FORMULA_NODES.find((n) => n.id === selectedNodeId) || null;
  }, [selectedNodeId]);

  // Connected Links for Selected Node
  const connectedLinks = useMemo(() => {
    if (!selectedNodeId) return [];
    return FORMULA_LINKS.filter(
      (l) => l.source === selectedNodeId || l.target === selectedNodeId
    );
  }, [selectedNodeId]);

  // Connected Neighbor Nodes
  const neighborNodes = useMemo(() => {
    if (!selectedNodeId) return [];
    const neighborIds = new Set<string>();
    connectedLinks.forEach((l) => {
      if (l.source === selectedNodeId) neighborIds.add(l.target);
      if (l.target === selectedNodeId) neighborIds.add(l.source);
    });
    return FORMULA_NODES.filter((n) => neighborIds.has(n.id));
  }, [selectedNodeId, connectedLinks]);

  // Drag Pan handling for canvas
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary mouse button
    setIsDraggingPan(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingPan) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDraggingPan(false);
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeColor = (node: NetworkNode) => {
    if (node.type === 'meridian') return '#4f46e5'; // Indigo
    if (node.type === 'herb') return '#059669'; // Emerald
    switch (node.meridian) {
      case 'taiyang':
        return '#dc2626'; // Red
      case 'yangming':
        return '#d97706'; // Amber
      case 'shaoyang':
        return '#0284c7'; // Sky Blue
      case 'taiyin':
        return '#059669'; // Emerald
      case 'shaoyin':
        return '#7c3aed'; // Violet
      case 'jueyin':
        return '#be123c'; // Rose
      default:
        return '#b91c1c';
    }
  };

  const getNodeBgClass = (node: NetworkNode) => {
    if (node.type === 'meridian') return 'bg-indigo-50 border-indigo-200 text-indigo-900';
    if (node.type === 'herb') return 'bg-emerald-50 border-emerald-200 text-emerald-900';
    return 'bg-amber-50 border-amber-200 text-amber-900';
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-br from-[#1c1917] to-[#292524] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-[#44403c]">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#b91c1c] text-white rounded-full text-xs font-extrabold font-mono tracking-wide">
              <Network className="w-3.5 h-3.5" />
              <span>经方关系图谱 ENGINE v2.0</span>
            </div>
            <div className="text-xs text-[#d6d3d1] font-mono">
              包含 {FORMULA_NODES.length} 个经方/药味枢纽 • {FORMULA_LINKS.length} 组气化传变路径
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-black font-serif tracking-wide text-[#f5f5f4]">
            六经传变与药物配伍关系网络图
          </h2>
          <p className="text-xs md:text-sm text-[#a8a29e] leading-relaxed max-w-3xl">
            本图谱将《伤寒论》中太阳、阳明、少阳、太阴、少阴、厥阴之<strong>六经气化转化路线</strong>与<strong>核心药味加减化裁逻辑</strong>进行可视化网络连结。点击图中任意经方或药味节点，可高亮关联病机并一键跳转至对应教学关卡！
          </p>
        </div>

        {/* Decorative Background Symbol */}
        <div className="absolute right-4 -bottom-6 text-white/5 font-serif text-9xl font-black pointer-events-none select-none">
          卦
        </div>
      </div>

      {/* FILTER & VIEW CONTROLS */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 md:p-5 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('evolution')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'evolution'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              六经演化全景图
            </button>
            <button
              onClick={() => setViewMode('herbs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'herbs'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              药物配伍衍生网络
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'all'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              全景全拓扑
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索经方/药味 (如: 桂枝汤, 附子)..."
              className="w-full pl-9 pr-4 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Canvas Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2.0))}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300"
              title="放大图谱"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.5))}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300"
              title="缩小图谱"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300"
              title="重置位置"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meridian Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mr-1">
            按六经筛选:
          </span>
          {[
            { id: 'all', label: '全部六经' },
            { id: 'taiyang', label: '太阳病' },
            { id: 'yangming', label: '阳明病' },
            { id: 'shaoyang', label: '少阳病' },
            { id: 'taiyin', label: '太阴病' },
            { id: 'shaoyin', label: '少阴病' },
            { id: 'jueyin', label: '厥阴病' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMeridianFilter(m.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMeridianFilter === m.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRAPH CANVAS & INSPECTOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* NETWORK GRAPH CANVAS PANEL */}
        <div className="lg:col-span-7 bg-[#fffcf7] dark:bg-zinc-900/80 border border-[#ebdcc8] dark:border-zinc-800 rounded-3xl p-4 shadow-sm relative overflow-hidden min-h-[500px] flex flex-col">
          <div className="flex justify-between items-center mb-2 px-2">
            <span className="text-xs font-extrabold text-[#0d5d56] dark:text-emerald-400 font-serif flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>拖拽与点击交互网络 (共 {filteredNodes.length} 节点)</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              滚轮/长按拖拽画布 • 单击节点高亮
            </span>
          </div>

          <div
            className="flex-1 w-full h-[480px] relative bg-[#fbf8f0] dark:bg-zinc-950 rounded-2xl border border-[#f0e6d6] dark:border-zinc-800/80 overflow-hidden cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              ref={svgRef}
              className="w-full h-full"
              viewBox="0 0 850 680"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Arrow markers */}
                <marker
                  id="arrow-default"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#a8a29e" />
                </marker>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#b91c1c" />
                </marker>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* LINKS / EDGES */}
                {filteredLinks.map((link, idx) => {
                  const sourceNode = FORMULA_NODES.find((n) => n.id === link.source);
                  const targetNode = FORMULA_NODES.find((n) => n.id === link.target);
                  if (!sourceNode || !targetNode) return null;

                  const isSelectedLink =
                    selectedNodeId &&
                    (link.source === selectedNodeId || link.target === selectedNodeId);

                  const midX = (sourceNode.x! + targetNode.x!) / 2;
                  const midY = (sourceNode.y! + targetNode.y!) / 2;

                  return (
                    <g key={`link-${idx}`}>
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={isSelectedLink ? '#b91c1c' : '#d6cebf'}
                        strokeWidth={isSelectedLink ? 2.5 : 1.2}
                        strokeDasharray={link.relationType === 'variation' ? '4,4' : 'none'}
                        markerEnd={isSelectedLink ? 'url(#arrow-active)' : 'url(#arrow-default)'}
                        className="transition-all duration-300"
                      />
                      {/* Link Relationship Label */}
                      <text
                        x={midX}
                        y={midY - 4}
                        fill={isSelectedLink ? '#b91c1c' : '#8c8275'}
                        fontSize="9"
                        fontWeight={isSelectedLink ? 'bold' : 'normal'}
                        textAnchor="middle"
                        className="pointer-events-none select-none font-serif"
                      >
                        {link.label}
                      </text>
                    </g>
                  );
                })}

                {/* NODES */}
                {filteredNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isNeighbor = neighborNodes.some((n) => n.id === node.id);
                  const nodeColor = getNodeColor(node);

                  let radius = 22;
                  if (node.type === 'meridian') radius = 28;
                  if (node.type === 'herb') radius = 18;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNodeId(node.id);
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Pulse effect for selected node */}
                      {isSelected && (
                        <circle
                          r={radius + 8}
                          fill="none"
                          stroke={nodeColor}
                          strokeWidth="2"
                          opacity="0.5"
                          className="animate-ping"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        r={radius}
                        fill={isSelected ? nodeColor : isNeighbor ? '#fff8ed' : '#ffffff'}
                        stroke={nodeColor}
                        strokeWidth={isSelected ? 3 : isNeighbor ? 2.5 : 1.5}
                        className="transition-all duration-200 shadow-md group-hover:scale-110"
                      />

                      {/* Icon or Symbol inside circle */}
                      <text
                        textAnchor="middle"
                        dy="4"
                        fill={isSelected ? '#ffffff' : nodeColor}
                        fontSize={node.type === 'herb' ? '10' : '11'}
                        fontWeight="bold"
                        className="pointer-events-none font-serif select-none"
                      >
                        {node.name.substring(0, 3)}
                      </text>

                      {/* Full Label below circle */}
                      <text
                        textAnchor="middle"
                        dy={radius + 14}
                        fill={isSelected ? '#1c1917' : '#57534e'}
                        fontSize="10"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        className="pointer-events-none select-none font-sans"
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>

        {/* NODE INSPECTOR & LEARNING DETAILS PANEL */}
        <div className="lg:col-span-5 space-y-4">
          {selectedNode ? (
            <div className="bg-[#fffcf7] dark:bg-zinc-900 border border-[#ebdcc8] dark:border-zinc-800 rounded-3xl p-5 md:p-6 shadow-md space-y-5">
              
              {/* NODE TITLE HEADER */}
              <div className="flex items-start justify-between gap-3 border-b border-[#f0e6d6] dark:border-zinc-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${getNodeBgClass(
                        selectedNode
                      )}`}
                    >
                      {selectedNode.type === 'formula'
                        ? '经典方剂'
                        : selectedNode.type === 'herb'
                        ? '核心药味'
                        : '六经病机枢纽'}
                    </span>
                    {selectedNode.category && (
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                        {selectedNode.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-[#1c1917] dark:text-[#f5f5f4] font-serif">
                    {selectedNode.name}
                  </h3>
                </div>

                {/* Direct Jump Button to Lesson Topic */}
                {selectedNode.topicId && (
                  <button
                    onClick={() => onSelectTopic(selectedNode.topicId!)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-xl text-xs font-extrabold shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <span>学习此关卡</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* FORMULA COMPOSITION (IF APPLICABLE) */}
              {selectedNode.composition && selectedNode.composition.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    方剂配伍药物:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.composition.map((herb, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#f4efe4] dark:bg-zinc-800 text-[#1c1917] dark:text-zinc-200 rounded-lg text-xs font-bold border border-[#e2d8c7] dark:border-zinc-700"
                      >
                        🌿 {herb}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  条文旨要与定义:
                </span>
                <p className="text-xs text-[#44403c] dark:text-[#d6d3d1] leading-relaxed bg-[#fbf8f0] dark:bg-zinc-950 p-3 rounded-xl border border-[#f0e6d6] dark:border-zinc-800 font-serif">
                  {selectedNode.description}
                </p>
              </div>

              {/* PHYSICAL INNER LANDSCAPE MECHANISM */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-[#0d5d56] dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>物理内景气化机制解剖:</span>
                </span>
                <p className="text-xs text-[#0d5d56] dark:text-emerald-300 leading-relaxed bg-[#f0f7f7] dark:bg-emerald-950/30 p-3.5 rounded-xl border border-[#c2f0ec] dark:border-emerald-900/40">
                  {selectedNode.innerMechanism}
                </p>
              </div>

              {/* CLAUSES REFERENCES */}
              {selectedNode.clauses && selectedNode.clauses.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    经典条文关联:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.clauses.map((cl, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-[11px] font-mono font-bold"
                      >
                        📖 {cl}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CONNECTED NEIGHBORS / TRANSFORMATIONS */}
              {neighborNodes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#f0e6d6] dark:border-zinc-800">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    关联传变/配伍枢纽 (点击切换):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {neighborNodes.map((neighbor) => (
                      <button
                        key={neighbor.id}
                        onClick={() => setSelectedNodeId(neighbor.id)}
                        className="p-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-[#b91c1c] dark:hover:border-emerald-500 rounded-xl text-left transition-all text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between group cursor-pointer"
                      >
                        <span className="truncate">{neighbor.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#b91c1c] transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTON */}
              {selectedNode.topicId && (
                <button
                  onClick={() => onSelectTopic(selectedNode.topicId!)}
                  className="w-full py-3 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-[#b91c1c]/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>一键进入【{selectedNode.name}】教学关卡与随堂考辨</span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-[#fffcf7] dark:bg-zinc-900 border border-[#ebdcc8] dark:border-zinc-800 rounded-3xl p-8 text-center space-y-3">
              <Info className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-xs text-zinc-500">点击左侧图谱中的任意节点，查看物理内景机制与关卡跳转</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
