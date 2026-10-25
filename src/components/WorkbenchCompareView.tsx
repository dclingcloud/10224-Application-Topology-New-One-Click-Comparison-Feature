import React, { useState, useEffect } from 'react';
import {
  Search,
  PlusSquare,
  Clock,
  Shield,
  FolderPlus,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  Mail,
  Download,
  Plus,
  RotateCw,
  Maximize2,
  MoreHorizontal,
  ChevronLeft,
} from 'lucide-react';

export interface WorkbenchCompareProps {
  nodes?: string[];
  nodeName?: string;
  baseTime?: string;
  compareTime?: string;
  selectedMetrics?: string[];
  initialMode?: 'multi' | 'single';
}

export const WorkbenchCompareView: React.FC<WorkbenchCompareProps> = ({
  nodes = ['交换机1', '交换机2'],
  nodeName = '交换机1',
  baseTime = '2026-10-25 19:39 ~ 2026-10-25 20:39',
  compareTime = '2026-10-24 19:39 ~ 2026-10-24 20:39',
  initialMode,
}) => {
  const displayNodes =
    nodes && nodes.length > 0
      ? nodes.length === 1
        ? [nodes[0], '交换机2']
        : nodes
      : ['交换机1', '交换机2'];

  const [viewMode, setViewMode] = useState<'multi' | 'single'>(
    initialMode || (nodes && nodes.length > 1 ? 'multi' : 'single')
  );

  useEffect(() => {
    if (initialMode) {
      setViewMode(initialMode);
    } else if (nodes && nodes.length > 1) {
      setViewMode('multi');
    } else {
      setViewMode('single');
    }
  }, [initialMode, nodes]);

  // Tree state
  const [filterText, setFilterText] = useState('');
  const [treeTab, setTreeTab] = useState<'custom' | 'scenario'>('custom');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    province: false,
    dscp: false,
    drilldown: false,
    rnd: false,
    ai: false,
    mouyi: true,
    periodic: true,
    ningbo: false,
  });

  const toggleFolder = (key: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Hover states for tooltips
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

  // Precisions
  const [topPrecision, setTopPrecision] = useState('分钟');
  const [cardPrecisions, setCardPrecisions] = useState<Record<string, string>>({
    c1: '分钟',
    c2: '分钟',
    c3: '分钟',
    c4: '分钟',
  });

  const setCardPrecision = (key: string, val: string) => {
    setCardPrecisions((prev) => ({ ...prev, [key]: val }));
  };

  // Format time range for badges
  const formatBadgeTime = (t: string) => {
    if (!t) return '2026-10-25 19:39 - 2026-10-25 20:39';
    return t.replace(/\s*~\s*/g, ' - ');
  };

  const baseBadgeTime = formatBadgeTime(baseTime);
  const compareBadgeTime = formatBadgeTime(compareTime);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F4F6F9] select-none">
      {/* 1. Left Tree Sidebar matching Image 1 */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 text-xs text-gray-700 h-full">
        {/* Top 2 Tabs: 自定义视图 / 场景报表 */}
        <div className="flex border-b border-gray-200 h-9 bg-white">
          <button
            type="button"
            onClick={() => setTreeTab('custom')}
            className={`flex-1 h-full flex items-center justify-center font-medium cursor-pointer relative ${
              treeTab === 'custom'
                ? 'text-[#0084FF]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>自定义视图</span>
            {treeTab === 'custom' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0084FF]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setTreeTab('scenario')}
            className={`flex-1 h-full flex items-center justify-center font-medium cursor-pointer relative ${
              treeTab === 'scenario'
                ? 'text-[#0084FF]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>场景报表</span>
            {treeTab === 'scenario' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0084FF]" />
            )}
          </button>
        </div>

        {/* Filter input + 新建视图 */}
        <div className="p-2 space-y-1.5 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="过滤..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full h-7 pl-6 pr-2 text-xs border border-gray-300 rounded bg-[#FAFAFA] focus:bg-white focus:outline-none focus:border-[#0084FF]"
            />
            <Search size={12} className="absolute left-2 top-2 text-gray-400" />
          </div>

          <button
            type="button"
            className="w-full h-6.5 border border-gray-300 rounded flex items-center justify-center gap-1.5 text-gray-600 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-xs"
          >
            <PlusSquare size={13} className="text-gray-500" />
            <span>新建视图</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="px-3 py-1.5 flex items-center justify-between text-gray-500 border-b border-gray-100 bg-[#FAFAFA]">
          <span className="font-semibold text-gray-800 text-[11px]">自定义视图</span>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock size={12} className="hover:text-gray-600 cursor-pointer" />
            <Shield size={12} className="hover:text-gray-600 cursor-pointer" />
            <FolderPlus size={12} className="hover:text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Tree Item List */}
        <div className="flex-1 overflow-y-auto py-1 px-1 text-[11px] space-y-0.5">
          <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700">
            <FileText size={13} className="text-[#0084FF] shrink-0" />
            <span>test</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700">
            <FileText size={13} className="text-[#0084FF] shrink-0" />
            <span>60天</span>
          </div>

          {/* 省份 */}
          <div>
            <div
              onClick={() => toggleFolder('province')}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700"
            >
              {expandedFolders.province ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              <Folder size={13} className="text-[#0084FF] shrink-0" />
              <span>省份</span>
            </div>
            {expandedFolders.province && (
              <div className="pl-6 py-0.5">
                <div className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-gray-100 rounded cursor-pointer text-gray-600">
                  <FileText size={12} className="text-[#0084FF] shrink-0" />
                  <span>省份测试</span>
                </div>
              </div>
            )}
          </div>

          {/* DSCP+站点 */}
          <div>
            <div
              onClick={() => toggleFolder('dscp')}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700"
            >
              {expandedFolders.dscp ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              <Folder size={13} className="text-[#0084FF] shrink-0" />
              <span>DSCP+站点</span>
            </div>
            {expandedFolders.dscp && (
              <div className="pl-6 py-0.5">
                <div className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-gray-100 rounded cursor-pointer text-gray-600">
                  <FileText size={12} className="text-[#0084FF] shrink-0" />
                  <span>DSCP</span>
                </div>
              </div>
            )}
          </div>

          {/* 自定义视图下钻 */}
          <div>
            <div
              onClick={() => toggleFolder('drilldown')}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700"
            >
              {expandedFolders.drilldown ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              <Folder size={13} className="text-[#0084FF] shrink-0" />
              <span>自定义视图下钻</span>
            </div>
            {expandedFolders.drilldown && (
              <div className="pl-6 py-0.5">
                <div className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-gray-100 rounded cursor-pointer text-gray-600">
                  <FileText size={12} className="text-[#0084FF] shrink-0" />
                  <span>自定义视图下钻</span>
                </div>
              </div>
            )}
          </div>

          {/* 研发测试 */}
          <div>
            <div
              onClick={() => toggleFolder('rnd')}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700"
            >
              {expandedFolders.rnd ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              <Folder size={13} className="text-[#0084FF] shrink-0" />
              <span>研发测试</span>
            </div>
            {expandedFolders.rnd && (
              <div className="pl-6 py-0.5 space-y-0.5">
                {[
                  '多个图表导出html',
                  '单个折线图',
                  '33590-站点测试',
                  '站点示范图',
                  'Jack',
                  '前端测试',
                  'TCP包类型测试',
                  '铁平测试',
                  '前端基线测试',
                  '自定义视图-IP访问失败',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-gray-100 rounded cursor-pointer text-gray-600 truncate"
                  >
                    <FileText size={12} className="text-[#0084FF] shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI相关 */}
          <div>
            <div
              onClick={() => toggleFolder('ai')}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700"
            >
              {expandedFolders.ai ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              <Folder size={13} className="text-[#0084FF] shrink-0" />
              <span>AI相关</span>
            </div>
            {expandedFolders.ai && (
              <div className="pl-6 py-0.5">
                <div className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-gray-100 rounded cursor-pointer text-gray-600">
                  <FileText size={12} className="text-[#0084FF] shrink-0" />
                  <span>1场景</span>
                </div>
              </div>
            )}
          </div>

          {/* 木易 (Open) -> 周期对比 */}
          <div>
            <div
              onClick={() => toggleFolder('mouyi')}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700"
            >
              {expandedFolders.mouyi ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              {expandedFolders.mouyi ? (
                <FolderOpen size={13} className="text-[#0084FF] shrink-0" />
              ) : (
                <Folder size={13} className="text-[#0084FF] shrink-0" />
              )}
              <span>木易</span>
            </div>

            {expandedFolders.mouyi && (
              <div className="pl-4 py-0.5 space-y-0.5">
                <div
                  onClick={() => toggleFolder('periodic')}
                  className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700"
                >
                  {expandedFolders.periodic ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  {expandedFolders.periodic ? (
                    <FolderOpen size={13} className="text-[#0084FF] shrink-0" />
                  ) : (
                    <Folder size={13} className="text-[#0084FF] shrink-0" />
                  )}
                  <span>周期对比</span>
                </div>

                {expandedFolders.periodic && (
                  <div className="pl-5 py-0.5 space-y-0.5">
                    {/* Item 1: 多对象对比 (Active in Image 1) */}
                    <div
                      onClick={() => setViewMode('multi')}
                      className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                        viewMode === 'multi'
                          ? 'bg-[#E6F4FF] text-[#0084FF] font-medium border border-[#BAE0FF]/50 shadow-2xs'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText size={12} className="text-[#0084FF] shrink-0" />
                        <span className="truncate">多对象对比</span>
                      </div>
                      {viewMode === 'multi' && (
                        <MoreHorizontal size={13} className="text-gray-400 hover:text-gray-700 shrink-0" />
                      )}
                    </div>

                    {/* Item 2: 周期对比 */}
                    <div
                      onClick={() => setViewMode('single')}
                      className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                        viewMode === 'single'
                          ? 'bg-[#E6F4FF] text-[#0084FF] font-medium border border-[#BAE0FF]/50 shadow-2xs'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText size={12} className="text-[#0084FF] shrink-0" />
                        <span className="truncate">周期对比</span>
                      </div>
                      {viewMode === 'single' && (
                        <MoreHorizontal size={13} className="text-gray-400 hover:text-gray-700 shrink-0" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 宁波联通 */}
          <div>
            <div
              onClick={() => toggleFolder('ningbo')}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700"
            >
              {expandedFolders.ningbo ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              <Folder size={13} className="text-[#0084FF] shrink-0" />
              <span>宁波联通</span>
            </div>
            {expandedFolders.ningbo && (
              <div className="pl-6 py-0.5 space-y-0.5">
                {['宁波联通2', '宁波联通', '2'].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-gray-100 rounded cursor-pointer text-gray-600"
                  >
                    <FileText size={12} className="text-[#0084FF] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Right Main View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Control Bar matching Image 1 */}
        <div className="h-10 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0">
          {/* Left tools */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-600">数据精度</span>
              <div className="relative">
                <select
                  value={topPrecision}
                  onChange={(e) => setTopPrecision(e.target.value)}
                  className="appearance-none h-6 pl-2 pr-6 border border-gray-300 rounded bg-white text-gray-700 hover:border-gray-400 cursor-pointer text-xs"
                >
                  <option value="分钟">分钟</option>
                  <option value="5分钟">5分钟</option>
                  <option value="小时">小时</option>
                  <option value="天">天</option>
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-1.5 top-1.5 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-1 cursor-pointer text-gray-600 select-none">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-[#0084FF]" />
              <span>刷新频率</span>
            </label>

            <button
              type="button"
              className="flex items-center gap-1 text-[#0084FF] hover:text-[#0073E6] cursor-pointer"
            >
              <span className="w-3.5 h-[2px] bg-[#0084FF] inline-block" />
              <span>基线</span>
            </button>
          </div>

          {/* Center Title: 多对象对比 in multi mode, 周期对比 in single mode */}
          <div className="text-sm font-semibold text-gray-800 tracking-wide">
            {viewMode === 'multi' ? '多对象对比' : '周期对比'}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              className="flex items-center gap-1.5 text-gray-700 hover:text-[#0084FF] cursor-pointer transition-colors"
            >
              <Mail size={13} className="text-gray-500" />
              <span>邮件发送</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 text-gray-700 hover:text-[#0084FF] cursor-pointer transition-colors"
            >
              <Download size={13} className="text-gray-500" />
              <span>导出</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1 px-3 py-1 bg-[#0091FF] hover:bg-[#0080E6] text-white rounded text-xs font-medium cursor-pointer shadow-xs transition-colors"
            >
              <Plus size={13} />
              <span>添加图表</span>
            </button>
          </div>
        </div>

        {/* Scrollable Charts Container */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
          {/* ======================================================== */}
          {/* MODE 1: MULTI-OBJECT COMPARISON (图1多对象对比 2x2 样式) */}
          {/* ======================================================== */}
          {viewMode === 'multi' ? (
            <div className="space-y-3.5">
              {/* Row 1: Node 1 (交换机1-基准 & 交换机1-周期) */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* Row 1 Left: 交换机1-基准 */}
                <div className="bg-white border border-gray-200 rounded-md p-3 shadow-2xs flex flex-col">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-800">
                        {displayNodes[0] || '交换机1'}-基准
                      </span>
                      <div
                        title={`基准时段: ${baseBadgeTime}`}
                        className="w-4.5 h-4.5 rounded-full bg-[#E6F4FF] flex items-center justify-center cursor-pointer text-[#0084FF]"
                      >
                        <Clock size={11} />
                      </div>
                      <button
                        type="button"
                        aria-label="重置"
                        className="text-gray-400 hover:text-[#0084FF] cursor-pointer"
                      >
                        <RotateCw size={11} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400">数据精度</span>
                        <div className="relative">
                          <select
                            value={cardPrecisions.c1}
                            onChange={(e) => setCardPrecision('c1', e.target.value)}
                            className="appearance-none h-5 pl-1.5 pr-4 border border-gray-300 rounded bg-white text-gray-700 text-[10px] cursor-pointer"
                          >
                            <option value="分钟">分钟</option>
                            <option value="5分钟">5分钟</option>
                            <option value="小时">小时</option>
                          </select>
                          <ChevronDown
                            size={9}
                            className="absolute right-1 top-1.5 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-1 cursor-pointer text-[10px]">
                        <input type="checkbox" className="w-3 h-3 rounded border-gray-300 text-[#0084FF]" />
                        <span>刷新频率</span>
                      </label>

                      <Clock size={12} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                    </div>
                  </div>

                  {/* Legends Bar */}
                  <div className="py-1.5 flex items-center justify-between text-[10px] text-gray-600">
                    <div className="flex items-center gap-3 truncate">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 truncate">
                        <span className="w-3.5 h-[2px] bg-[#52C41A] relative flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#52C41A]" />
                        </span>
                        <span className="truncate">应用(HTTPS_l7)_Interface 1(DataCenter-SH)_流量</span>
                      </div>
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 truncate">
                        <span className="w-3.5 h-[2px] bg-[#13C2C2] relative flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#13C2C2]" />
                        </span>
                        <span className="truncate">应用(HTTPS...</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-gray-400">
                      <div className="flex items-center gap-0.5 font-mono text-[9px]">
                        <ChevronLeft size={11} className="cursor-pointer hover:text-gray-700" />
                        <span>1/4</span>
                        <ChevronRight size={11} className="cursor-pointer hover:text-gray-700" />
                      </div>
                      <span className="text-[10px] text-gray-400">速率 (Mbps)</span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div
                    className="relative w-full h-[155px] mt-0.5"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCard('c1');
                      setHoverX(Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left)));
                    }}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <span className="absolute top-0 left-0 text-[9px] text-gray-400 font-mono">
                      流量 (MB)
                    </span>

                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 135" preserveAspectRatio="none">
                      {/* Grid Lines for Y = 80, 60, 40, 20, 0 */}
                      {[
                        { y: 15, lVal: '80', rVal: '10' },
                        { y: 42, lVal: '60', rVal: '8' },
                        { y: 69, lVal: '40', rVal: '6' },
                        { y: 96, lVal: '20', rVal: '4' },
                        { y: 120, lVal: '0', rVal: '0' },
                      ].map((row) => (
                        <g key={row.y}>
                          <line
                            x1="25"
                            y1={row.y}
                            x2="475"
                            y2={row.y}
                            stroke={row.y === 120 ? '#D1D5DB' : '#E5E7EB'}
                            strokeDasharray={row.y === 120 ? undefined : '3 3'}
                          />
                          <text x="22" y={row.y + 3} fill="#9CA3AF" fontSize="8" textAnchor="end" fontFamily="monospace">
                            {row.lVal}
                          </text>
                          <text x="478" y={row.y + 3} fill="#9CA3AF" fontSize="8" textAnchor="start" fontFamily="monospace">
                            {row.rVal}
                          </text>
                        </g>
                      ))}

                      {/* X Axis Time Ticks: 19:40, 19:50, 20:00, 20:10, 20:20, 20:30 */}
                      {[
                        { x: 50, label: '19:40' },
                        { x: 130, label: '19:50' },
                        { x: 215, label: '20:00' },
                        { x: 300, label: '20:10' },
                        { x: 385, label: '20:20' },
                        { x: 460, label: '20:30' },
                      ].map((t) => (
                        <text key={t.label} x={t.x} y="132" fill="#9CA3AF" fontSize="8" textAnchor="middle" fontFamily="monospace">
                          {t.label}
                        </text>
                      ))}

                      {/* Curve 1: Green Periodic Peaks matching Image 1 */}
                      <path
                        d="
                          M 25 105
                          L 50 105
                          Q 60 70 70 70
                          Q 80 70 90 105
                          L 115 105
                          Q 125 75 132 72
                          Q 140 75 150 105
                          L 170 105
                          Q 180 35 188 30
                          Q 196 35 205 105
                          L 220 105
                          Q 228 40 236 35
                          Q 244 42 255 105
                          L 275 105
                          Q 285 70 292 68
                          Q 300 72 310 105
                          L 330 105
                          Q 340 92 346 90
                          Q 352 92 360 105
                          L 380 105
                          Q 390 70 398 65
                          Q 406 72 415 105
                          L 435 105
                          Q 442 90 448 88
                          Q 455 92 462 105
                          L 475 105
                        "
                        fill="none"
                        stroke="#52C41A"
                        strokeWidth="1.5"
                      />

                      {/* Curve 2: Gold/Orange rate curve */}
                      <path
                        d="
                          M 25 107
                          L 50 107
                          Q 60 75 70 75
                          Q 80 75 90 107
                          L 115 107
                          Q 125 80 132 78
                          Q 140 80 150 107
                          L 170 107
                          Q 180 45 188 40
                          Q 196 45 205 107
                          L 220 107
                          Q 228 48 236 44
                          Q 244 50 255 107
                          L 275 107
                          Q 285 78 292 76
                          Q 300 80 310 107
                          L 330 107
                          Q 340 96 346 94
                          Q 352 96 360 107
                          L 380 107
                          Q 390 78 398 74
                          Q 406 80 415 107
                          L 435 107
                          Q 442 94 448 92
                          Q 455 96 462 107
                          L 475 107
                        "
                        fill="none"
                        stroke="#FA8C16"
                        strokeWidth="1.2"
                      />

                      {/* Curve 3: Cyan baseline */}
                      <path d="M 25 116 L 475 116" fill="none" stroke="#13C2C2" strokeWidth="1" />
                    </svg>

                    {hoveredCard === 'c1' && hoverX !== null && (
                      <div
                        className="absolute top-0 bottom-4 w-[1px] border-l border-dashed border-[#0084FF] pointer-events-none"
                        style={{ left: `${hoverX}px` }}
                      />
                    )}
                  </div>
                </div>

                {/* Row 1 Right: 交换机1-周期 */}
                <div className="bg-white border border-gray-200 rounded-md p-3 shadow-2xs flex flex-col">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-800">
                        {displayNodes[0] || '交换机1'}-周期
                      </span>
                      <div
                        title={`对比时段: ${compareBadgeTime}`}
                        className="w-4.5 h-4.5 rounded-full bg-[#E6F4FF] flex items-center justify-center cursor-pointer text-[#0084FF]"
                      >
                        <Clock size={11} />
                      </div>
                      <button
                        type="button"
                        aria-label="重置"
                        className="text-gray-400 hover:text-[#0084FF] cursor-pointer"
                      >
                        <RotateCw size={11} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400">数据精度</span>
                        <div className="relative">
                          <select
                            value={cardPrecisions.c2}
                            onChange={(e) => setCardPrecision('c2', e.target.value)}
                            className="appearance-none h-5 pl-1.5 pr-4 border border-gray-300 rounded bg-white text-gray-700 text-[10px] cursor-pointer"
                          >
                            <option value="分钟">分钟</option>
                            <option value="5分钟">5分钟</option>
                            <option value="小时">小时</option>
                          </select>
                          <ChevronDown
                            size={9}
                            className="absolute right-1 top-1.5 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-1 cursor-pointer text-[10px]">
                        <input type="checkbox" className="w-3 h-3 rounded border-gray-300 text-[#0084FF]" />
                        <span>刷新频率</span>
                      </label>

                      <Clock size={12} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                      <Maximize2 size={12} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                      <MoreHorizontal size={12} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                    </div>
                  </div>

                  {/* Legends Bar */}
                  <div className="py-1.5 flex items-center justify-between text-[10px] text-gray-600">
                    <div className="flex items-center gap-3 truncate">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 truncate">
                        <span className="w-3.5 h-[2px] bg-[#52C41A] relative flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#52C41A]" />
                        </span>
                        <span className="truncate">应用(HTTPS_l7)_Interface 1(DataCenter-SH)_流量</span>
                      </div>
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 truncate">
                        <span className="w-3.5 h-[2px] bg-[#13C2C2] relative flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#13C2C2]" />
                        </span>
                        <span className="truncate">应用(HTTPS...</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-gray-400">
                      <div className="flex items-center gap-0.5 font-mono text-[9px]">
                        <ChevronLeft size={11} className="cursor-pointer hover:text-gray-700" />
                        <span>1/4</span>
                        <ChevronRight size={11} className="cursor-pointer hover:text-gray-700" />
                      </div>
                      <span className="text-[10px] text-gray-400">速率 (Mbps)</span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div
                    className="relative w-full h-[155px] mt-0.5"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCard('c2');
                      setHoverX(Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left)));
                    }}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <span className="absolute top-0 left-0 text-[9px] text-gray-400 font-mono">
                      流量 (MB)
                    </span>

                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 135" preserveAspectRatio="none">
                      {/* Grid Lines for Y = 100, 80, 60, 40, 20, 0 */}
                      {[
                        { y: 15, lVal: '100', rVal: '15' },
                        { y: 36, lVal: '80', rVal: '12' },
                        { y: 57, lVal: '60', rVal: '9' },
                        { y: 78, lVal: '40', rVal: '6' },
                        { y: 99, lVal: '20', rVal: '3' },
                        { y: 120, lVal: '0', rVal: '0' },
                      ].map((row) => (
                        <g key={row.y}>
                          <line
                            x1="25"
                            y1={row.y}
                            x2="475"
                            y2={row.y}
                            stroke={row.y === 120 ? '#D1D5DB' : '#E5E7EB'}
                            strokeDasharray={row.y === 120 ? undefined : '3 3'}
                          />
                          <text x="22" y={row.y + 3} fill="#9CA3AF" fontSize="8" textAnchor="end" fontFamily="monospace">
                            {row.lVal}
                          </text>
                          <text x="478" y={row.y + 3} fill="#9CA3AF" fontSize="8" textAnchor="start" fontFamily="monospace">
                            {row.rVal}
                          </text>
                        </g>
                      ))}

                      {/* X Axis Time Ticks: 18:40, 18:50, 19:00, 19:10, 19:20, 19:30 */}
                      {[
                        { x: 50, label: '18:40' },
                        { x: 130, label: '18:50' },
                        { x: 215, label: '19:00' },
                        { x: 300, label: '19:10' },
                        { x: 385, label: '19:20' },
                        { x: 460, label: '19:30' },
                      ].map((t) => (
                        <text key={t.label} x={t.x} y="132" fill="#9CA3AF" fontSize="8" textAnchor="middle" fontFamily="monospace">
                          {t.label}
                        </text>
                      ))}

                      {/* Curve 1: Green High Spike at 18:48 (~100MB), second peak at 18:55 (~70MB), third peak at 19:17 (~68MB), peak at 19:33 (~85MB) */}
                      <path
                        d="
                          M 25 105
                          L 40 98
                          Q 50 102 60 70
                          C 65 30, 72 16, 78 18
                          C 85 20, 92 65, 100 68
                          C 106 70, 115 50, 122 55
                          C 130 62, 138 92, 145 92
                          L 165 92
                          Q 175 80 182 82
                          Q 190 85 198 100
                          L 230 100
                          Q 240 92 248 95
                          Q 256 98 265 104
                          L 285 104
                          Q 295 90 302 92
                          Q 310 95 318 105
                          L 330 105
                          C 338 75, 345 50, 352 50
                          C 358 50, 365 72, 372 70
                          C 378 68, 385 60, 392 62
                          C 400 66, 408 95, 415 95
                          L 435 95
                          Q 445 80 452 75
                          C 460 68, 468 45, 475 35
                        "
                        fill="none"
                        stroke="#52C41A"
                        strokeWidth="1.5"
                      />

                      {/* Curve 2: Cyan undulating wave */}
                      <path
                        d="
                          M 25 108
                          Q 50 102 65 88
                          Q 80 75 100 76
                          Q 115 78 135 92
                          Q 160 105 190 98
                          Q 220 92 250 102
                          Q 280 105 310 96
                          Q 340 85 365 78
                          Q 390 72 420 85
                          Q 450 96 475 102
                        "
                        fill="none"
                        stroke="#13C2C2"
                        strokeWidth="1.2"
                      />

                      {/* Curve 3: Orange rate curve */}
                      <path
                        d="
                          M 25 107
                          Q 50 105 70 85
                          Q 85 78 100 80
                          Q 120 82 140 95
                          Q 170 107 200 102
                          Q 230 105 260 106
                          Q 290 107 320 102
                          Q 345 82 360 80
                          Q 380 78 400 95
                          Q 430 106 475 107
                        "
                        fill="none"
                        stroke="#FA8C16"
                        strokeWidth="1.2"
                      />
                    </svg>

                    {hoveredCard === 'c2' && hoverX !== null && (
                      <div
                        className="absolute top-0 bottom-4 w-[1px] border-l border-dashed border-[#0084FF] pointer-events-none"
                        style={{ left: `${hoverX}px` }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Node 2 (交换机2-基准 & 交换机2-周期) */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* Row 2 Left: 交换机2-基准 */}
                <div className="bg-white border border-gray-200 rounded-md p-3 shadow-2xs flex flex-col">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-800">
                        {displayNodes[1] || '交换机2'}-基准
                      </span>
                      <div
                        title={`基准时段: ${baseBadgeTime}`}
                        className="w-4.5 h-4.5 rounded-full bg-[#E6F4FF] flex items-center justify-center cursor-pointer text-[#0084FF]"
                      >
                        <Clock size={11} />
                      </div>
                      <button
                        type="button"
                        aria-label="重置"
                        className="text-gray-400 hover:text-[#0084FF] cursor-pointer"
                      >
                        <RotateCw size={11} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400">数据精度</span>
                        <div className="relative">
                          <select
                            value={cardPrecisions.c3}
                            onChange={(e) => setCardPrecision('c3', e.target.value)}
                            className="appearance-none h-5 pl-1.5 pr-4 border border-gray-300 rounded bg-white text-gray-700 text-[10px] cursor-pointer"
                          >
                            <option value="分钟">分钟</option>
                            <option value="5分钟">5分钟</option>
                            <option value="小时">小时</option>
                          </select>
                          <ChevronDown
                            size={9}
                            className="absolute right-1 top-1.5 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-1 cursor-pointer text-[10px]">
                        <input type="checkbox" className="w-3 h-3 rounded border-gray-300 text-[#0084FF]" />
                        <span>刷新频率</span>
                      </label>

                      <Clock size={12} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                    </div>
                  </div>

                  {/* Legends Bar */}
                  <div className="py-1.5 flex items-center justify-between text-[10px] text-gray-600">
                    <div className="flex items-center gap-3 truncate">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 truncate">
                        <span className="w-3.5 h-[2px] bg-[#52C41A] relative flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#52C41A]" />
                        </span>
                        <span className="truncate">应用(禅道公网)_Interface 1(DataCenter-SH)_流量</span>
                      </div>
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 truncate">
                        <span className="w-3.5 h-[2px] bg-[#13C2C2] relative flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#13C2C2]" />
                        </span>
                        <span className="truncate">应用(禅道公网...</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-gray-400">
                      <div className="flex items-center gap-0.5 font-mono text-[9px]">
                        <ChevronLeft size={11} className="cursor-pointer hover:text-gray-700" />
                        <span>1/4</span>
                        <ChevronRight size={11} className="cursor-pointer hover:text-gray-700" />
                      </div>
                      <span className="text-[10px] text-gray-400">速率 (Kbps)</span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div
                    className="relative w-full h-[155px] mt-0.5"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCard('c3');
                      setHoverX(Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left)));
                    }}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <span className="absolute top-0 left-0 text-[9px] text-gray-400 font-mono">
                      流量 (KB)
                    </span>

                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 135" preserveAspectRatio="none">
                      {/* Grid Lines for Y = 1000, 800, 600, 400, 200, 0 */}
                      {[
                        { y: 15, lVal: '1000', rVal: '150' },
                        { y: 36, lVal: '800', rVal: '120' },
                        { y: 57, lVal: '600', rVal: '90' },
                        { y: 78, lVal: '400', rVal: '60' },
                        { y: 99, lVal: '200', rVal: '30' },
                        { y: 120, lVal: '0', rVal: '0' },
                      ].map((row) => (
                        <g key={row.y}>
                          <line
                            x1="25"
                            y1={row.y}
                            x2="475"
                            y2={row.y}
                            stroke={row.y === 120 ? '#D1D5DB' : '#E5E7EB'}
                            strokeDasharray={row.y === 120 ? undefined : '3 3'}
                          />
                          <text x="22" y={row.y + 3} fill="#9CA3AF" fontSize="8" textAnchor="end" fontFamily="monospace">
                            {row.lVal}
                          </text>
                          <text x="478" y={row.y + 3} fill="#9CA3AF" fontSize="8" textAnchor="start" fontFamily="monospace">
                            {row.rVal}
                          </text>
                        </g>
                      ))}

                      {/* X Axis Time Ticks: 19:40, 19:50, 20:00, 20:10, 20:20, 20:30 */}
                      {[
                        { x: 50, label: '19:40' },
                        { x: 130, label: '19:50' },
                        { x: 215, label: '20:00' },
                        { x: 300, label: '20:10' },
                        { x: 385, label: '20:20' },
                        { x: 460, label: '20:30' },
                      ].map((t) => (
                        <text key={t.label} x={t.x} y="132" fill="#9CA3AF" fontSize="8" textAnchor="middle" fontFamily="monospace">
                          {t.label}
                        </text>
                      ))}

                      {/* Curve 1: Green Peak at 20:05 (~400KB), sharp spike at 20:22 (~950KB) */}
                      <path
                        d="
                          M 25 118
                          L 220 118
                          C 230 118, 238 80, 244 76
                          C 250 82, 258 118, 270 118
                          L 350 118
                          C 358 118, 365 30, 370 20
                          C 375 22, 382 118, 395 118
                          L 475 118
                        "
                        fill="none"
                        stroke="#52C41A"
                        strokeWidth="1.5"
                      />

                      {/* Curve 2: Cyan peak matching shape */}
                      <path
                        d="
                          M 25 118
                          L 220 118
                          C 230 118, 238 88, 244 82
                          C 250 88, 258 118, 270 118
                          L 350 118
                          C 358 118, 365 38, 370 30
                          C 375 32, 382 118, 395 118
                          L 475 118
                        "
                        fill="none"
                        stroke="#13C2C2"
                        strokeWidth="1.2"
                      />
                    </svg>

                    {hoveredCard === 'c3' && hoverX !== null && (
                      <div
                        className="absolute top-0 bottom-4 w-[1px] border-l border-dashed border-[#0084FF] pointer-events-none"
                        style={{ left: `${hoverX}px` }}
                      />
                    )}
                  </div>
                </div>

                {/* Row 2 Right: 交换机2-周期 */}
                <div className="bg-white border border-gray-200 rounded-md p-3 shadow-2xs flex flex-col">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-800">
                        {displayNodes[1] || '交换机2'}-周期
                      </span>
                      <div
                        title={`对比时段: ${compareBadgeTime}`}
                        className="w-4.5 h-4.5 rounded-full bg-[#E6F4FF] flex items-center justify-center cursor-pointer text-[#0084FF]"
                      >
                        <Clock size={11} />
                      </div>
                      <button
                        type="button"
                        aria-label="重置"
                        className="text-gray-400 hover:text-[#0084FF] cursor-pointer"
                      >
                        <RotateCw size={11} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400">数据精度</span>
                        <div className="relative">
                          <select
                            value={cardPrecisions.c4}
                            onChange={(e) => setCardPrecision('c4', e.target.value)}
                            className="appearance-none h-5 pl-1.5 pr-4 border border-gray-300 rounded bg-white text-gray-700 text-[10px] cursor-pointer"
                          >
                            <option value="分钟">分钟</option>
                            <option value="5分钟">5分钟</option>
                            <option value="小时">小时</option>
                          </select>
                          <ChevronDown
                            size={9}
                            className="absolute right-1 top-1.5 text-gray-400 pointer-events-none"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-1 cursor-pointer text-[10px]">
                        <input type="checkbox" className="w-3 h-3 rounded border-gray-300 text-[#0084FF]" />
                        <span>刷新频率</span>
                      </label>

                      <Clock size={12} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                      <Maximize2 size={12} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                      <MoreHorizontal size={12} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                    </div>
                  </div>

                  {/* Legends Bar */}
                  <div className="py-1.5 flex items-center justify-between text-[10px] text-gray-600">
                    <div className="flex items-center gap-3 truncate">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 truncate">
                        <span className="w-3.5 h-[2px] bg-[#52C41A] relative flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#52C41A]" />
                        </span>
                        <span className="truncate">应用(禅道公网)_Interface 1(DataCenter-SH)_流量</span>
                      </div>
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 truncate">
                        <span className="w-3.5 h-[2px] bg-[#13C2C2] relative flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#13C2C2]" />
                        </span>
                        <span className="truncate">应用(禅道公网...</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-gray-400">
                      <div className="flex items-center gap-0.5 font-mono text-[9px]">
                        <ChevronLeft size={11} className="cursor-pointer hover:text-gray-700" />
                        <span>1/4</span>
                        <ChevronRight size={11} className="cursor-pointer hover:text-gray-700" />
                      </div>
                      <span className="text-[10px] text-gray-400">速率 (Kbps)</span>
                    </div>
                  </div>

                  {/* SVG Chart */}
                  <div
                    className="relative w-full h-[155px] mt-0.5"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCard('c4');
                      setHoverX(Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left)));
                    }}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <span className="absolute top-0 left-0 text-[9px] text-gray-400 font-mono">
                      流量 (MB)
                    </span>

                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 135" preserveAspectRatio="none">
                      {/* Grid Lines for Y = 2, 1, 0 */}
                      {[
                        { y: 15, lVal: '2', rVal: '200' },
                        { y: 41, lVal: '', rVal: '160' },
                        { y: 68, lVal: '1', rVal: '120' },
                        { y: 94, lVal: '', rVal: '80' },
                        { y: 107, lVal: '', rVal: '40' },
                        { y: 120, lVal: '0', rVal: '0' },
                      ].map((row, idx) => (
                        <g key={idx}>
                          <line
                            x1="25"
                            y1={row.y}
                            x2="475"
                            y2={row.y}
                            stroke={row.y === 120 ? '#D1D5DB' : '#E5E7EB'}
                            strokeDasharray={row.y === 120 ? undefined : '3 3'}
                          />
                          {row.lVal !== '' && (
                            <text x="22" y={row.y + 3} fill="#9CA3AF" fontSize="8" textAnchor="end" fontFamily="monospace">
                              {row.lVal}
                            </text>
                          )}
                          <text x="478" y={row.y + 3} fill="#9CA3AF" fontSize="8" textAnchor="start" fontFamily="monospace">
                            {row.rVal}
                          </text>
                        </g>
                      ))}

                      {/* X Axis Time Ticks: 18:40, 18:50, 19:00, 19:10, 19:20, 19:30 */}
                      {[
                        { x: 50, label: '18:40' },
                        { x: 130, label: '18:50' },
                        { x: 215, label: '19:00' },
                        { x: 300, label: '19:10' },
                        { x: 385, label: '19:20' },
                        { x: 460, label: '19:30' },
                      ].map((t) => (
                        <text key={t.label} x={t.x} y="132" fill="#9CA3AF" fontSize="8" textAnchor="middle" fontFamily="monospace">
                          {t.label}
                        </text>
                      ))}

                      {/* Curve 1: Green Small peak at 18:42, high peak at 19:20 (~1.5MB), second bump at 19:23 */}
                      <path
                        d="
                          M 25 118
                          L 35 118
                          Q 42 110 46 112
                          Q 52 115 58 118
                          L 340 118
                          C 350 118, 355 45, 360 40
                          C 365 42, 370 85, 375 75
                          C 380 80, 388 118, 395 118
                          L 475 118
                        "
                        fill="none"
                        stroke="#52C41A"
                        strokeWidth="1.5"
                      />

                      {/* Curve 2: Yellow rate curve */}
                      <path
                        d="
                          M 25 118
                          L 35 118
                          Q 42 112 46 114
                          Q 52 116 58 118
                          L 340 118
                          C 350 118, 355 58, 360 52
                          C 365 54, 370 92, 375 85
                          C 380 90, 388 118, 395 118
                          L 475 118
                        "
                        fill="none"
                        stroke="#D48806"
                        strokeWidth="1.2"
                      />
                    </svg>

                    {hoveredCard === 'c4' && hoverX !== null && (
                      <div
                        className="absolute top-0 bottom-4 w-[1px] border-l border-dashed border-[#0084FF] pointer-events-none"
                        style={{ left: `${hoverX}px` }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* MODE 2: SINGLE NODE PERIODIC COMPARE (图2单节点上下两图样式) */
            /* ======================================================== */
            <div className="space-y-3.5">
              {/* Card 1: 交换机1-基准 */}
              <div className="bg-white border border-gray-200 rounded-md p-3.5 shadow-2xs flex flex-col">
                {/* Header Row */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-gray-800">
                      {nodeName === '交换机' ? '交换机1' : nodeName}-基准
                    </span>
                    <span className="font-mono text-[11px] text-[#0084FF] bg-[#E6F4FF] border border-[#BAE0FF] px-2 py-0.5 rounded">
                      {baseBadgeTime}
                    </span>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#0084FF] cursor-pointer transition-colors"
                    >
                      <RotateCw size={11} />
                      <span>重置</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-gray-500">数据精度</span>
                      <div className="relative">
                        <select
                          value={cardPrecisions.c1}
                          onChange={(e) => setCardPrecision('c1', e.target.value)}
                          className="appearance-none h-5.5 pl-1.5 pr-5 border border-gray-300 rounded bg-white text-gray-700 text-[11px] cursor-pointer"
                        >
                          <option value="分钟">分钟</option>
                          <option value="5分钟">5分钟</option>
                          <option value="小时">小时</option>
                        </select>
                        <ChevronDown
                          size={10}
                          className="absolute right-1 top-1.5 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-1 cursor-pointer text-[11px]">
                      <input type="checkbox" className="w-3 h-3 rounded border-gray-300 text-[#0084FF]" />
                      <span>刷新频率</span>
                    </label>

                    <Clock size={13} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                    <Maximize2 size={13} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                    <MoreHorizontal size={13} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                  </div>
                </div>

                {/* Legends Row matching Image 2 */}
                <div className="py-2 px-1 flex items-center justify-between text-[11px] text-gray-600 border-b border-gray-50">
                  <span className="text-[10px] text-gray-400 font-mono">
                    流量 (KB)
                  </span>

                  <div className="flex items-center gap-3.5 flex-wrap">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                      <span className="w-3.5 h-[2px] bg-[#52C41A] relative flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#52C41A]" />
                      </span>
                      <span>应用(禅道公网)_Interface 1(DataCenter-SH)_流量</span>
                    </div>

                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                      <span className="w-3.5 h-[2px] bg-[#13C2C2] relative flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#13C2C2]" />
                      </span>
                      <span>应用(禅道公网)_Interface 1(DataCenter-SH)_平均包率</span>
                    </div>

                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                      <span className="w-3.5 h-[2px] bg-[#FA8C16] relative flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FA8C16]" />
                      </span>
                      <span>应用(禅道公网)_Interface 1(DataCenter-SH)_流量-服务器</span>
                    </div>

                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                      <span className="w-3.5 h-[2px] bg-[#722ED1] relative flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#722ED1]" />
                      </span>
                      <span>应用(禅道公网)_Interface 1(DataCenter-S...</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-gray-400 font-mono text-[9px] ml-1">
                      <ChevronLeft size={11} className="cursor-pointer hover:text-gray-700" />
                      <span>1/2</span>
                      <ChevronRight size={11} className="cursor-pointer hover:text-gray-700" />
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono">
                    平均包率 (pps)
                  </span>
                </div>

                {/* SVG Area */}
                <div
                  className="relative w-full h-[200px] mt-1"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredCard('s1');
                    setHoverX(Math.max(45, Math.min(rect.width - 45, e.clientX - rect.left)));
                  }}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 170" preserveAspectRatio="none">
                    {/* Grid lines for 1000, 800, 600, 400, 200, 0 */}
                    {[
                      { y: 20, lVal: '1000', rVal: '20' },
                      { y: 48, lVal: '800', rVal: '16' },
                      { y: 76, lVal: '600', rVal: '12' },
                      { y: 104, lVal: '400', rVal: '8' },
                      { y: 132, lVal: '200', rVal: '4' },
                      { y: 160, lVal: '0', rVal: '0' },
                    ].map((row) => (
                      <g key={row.y}>
                        <line
                          x1="45"
                          y1={row.y}
                          x2="955"
                          y2={row.y}
                          stroke={row.y === 160 ? '#D1D5DB' : '#E5E7EB'}
                          strokeDasharray={row.y === 160 ? undefined : '3 3'}
                        />
                        <text x="40" y={row.y + 3} fill="#9CA3AF" fontSize="9" textAnchor="end" fontFamily="monospace">
                          {row.lVal}
                        </text>
                        <text x="960" y={row.y + 3} fill="#9CA3AF" fontSize="9" textAnchor="start" fontFamily="monospace">
                          {row.rVal}
                        </text>
                      </g>
                    ))}

                    {/* X Ticks: 19:40, 19:50, 20:00, 20:10, 20:20, 20:30 */}
                    {[
                      { x: 90, label: '19:40' },
                      { x: 260, label: '19:50' },
                      { x: 430, label: '20:00' },
                      { x: 600, label: '20:10' },
                      { x: 770, label: '20:20' },
                      { x: 940, label: '20:30' },
                    ].map((t) => (
                      <text key={t.label} x={t.x} y="168" fill="#9CA3AF" fontSize="9.5" textAnchor="middle" fontFamily="monospace">
                        {t.label}
                      </text>
                    ))}

                    {/* Curve 1: Green Spike (Peak 1 at 20:05 ~400KB, Peak 2 at 20:22 ~950KB) */}
                    <path
                      d="
                        M 45 155
                        L 460 155
                        C 485 155, 500 110, 515 104
                        C 525 100, 540 155, 560 155
                        L 770 155
                        C 785 155, 800 35, 808 26
                        C 815 32, 825 155, 840 155
                        L 955 155
                      "
                      fill="none"
                      stroke="#52C41A"
                      strokeWidth="1.6"
                    />

                    {/* Curve 2: Cyan Spike (Peak 1 at 20:05 ~420KB, Peak 2 at 20:22 ~900KB) */}
                    <path
                      d="
                        M 45 156
                        L 460 156
                        C 485 156, 500 106, 515 98
                        C 525 96, 540 156, 560 156
                        L 770 156
                        C 785 156, 800 42, 808 34
                        C 815 38, 825 156, 840 156
                        L 955 156
                      "
                      fill="none"
                      stroke="#13C2C2"
                      strokeWidth="1.4"
                    />

                    {/* Curve 3: Orange baseline */}
                    <path
                      d="
                        M 45 158
                        L 955 158
                      "
                      fill="none"
                      stroke="#FA8C16"
                      strokeWidth="1"
                    />
                  </svg>

                  {hoveredCard === 's1' && hoverX !== null && (
                    <div
                      className="absolute top-0 bottom-4 w-[1px] border-l border-dashed border-[#0084FF] pointer-events-none"
                      style={{ left: `${hoverX}px` }}
                    />
                  )}
                </div>
              </div>

              {/* Card 2: 交换机-周期 (matching Image 2) */}
              <div className="bg-white border border-gray-200 rounded-md p-3.5 shadow-2xs flex flex-col">
                {/* Header Row */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-gray-800">
                      {nodeName === '交换机1' ? '交换机-周期' : `${nodeName}-周期`}
                    </span>
                    <span className="font-mono text-[11px] text-[#0084FF] bg-[#E6F4FF] border border-[#BAE0FF] px-2 py-0.5 rounded">
                      {baseBadgeTime}
                    </span>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#0084FF] cursor-pointer transition-colors"
                    >
                      <RotateCw size={11} />
                      <span>重置</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-gray-500">数据精度</span>
                      <div className="relative">
                        <select
                          value={cardPrecisions.c2}
                          onChange={(e) => setCardPrecision('c2', e.target.value)}
                          className="appearance-none h-5.5 pl-1.5 pr-5 border border-gray-300 rounded bg-white text-gray-700 text-[11px] cursor-pointer"
                        >
                          <option value="分钟">分钟</option>
                          <option value="5分钟">5分钟</option>
                          <option value="小时">小时</option>
                        </select>
                        <ChevronDown
                          size={10}
                          className="absolute right-1 top-1.5 text-gray-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-1 cursor-pointer text-[11px]">
                      <input type="checkbox" className="w-3 h-3 rounded border-gray-300 text-[#0084FF]" />
                      <span>刷新频率</span>
                    </label>

                    <Clock size={13} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                    <Maximize2 size={13} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                    <MoreHorizontal size={13} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                  </div>
                </div>

                {/* Legends Row matching Image 2 */}
                <div className="py-2 px-1 flex items-center justify-between text-[11px] text-gray-600 border-b border-gray-50">
                  <span className="text-[10px] text-gray-400 font-mono">
                    流量 (MB)
                  </span>

                  <div className="flex items-center gap-3.5 flex-wrap">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                      <span className="w-3.5 h-[2px] bg-[#52C41A] relative flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#52C41A]" />
                      </span>
                      <span>应用(禅道内网)_Interface 1(DataCenter-SH)_流量</span>
                    </div>

                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                      <span className="w-3.5 h-[2px] bg-[#13C2C2] relative flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#13C2C2]" />
                      </span>
                      <span>应用(禅道内网)_Interface 1(DataCenter-SH)_流量-客户端</span>
                    </div>

                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                      <span className="w-3.5 h-[2px] bg-[#FA8C16] relative flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FA8C16]" />
                      </span>
                      <span>应用(禅道内网)_Interface 1(DataCenter-SH)_流量-服务器</span>
                    </div>

                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                      <span className="w-3.5 h-[2px] bg-[#73D13D] relative flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#73D13D]" />
                      </span>
                      <span>应用(禅道内网)_Interface 1(DataCenter-SH)_速率</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono">
                    速率 (Kbps)
                  </span>
                </div>

                {/* SVG Area matching Image 2 */}
                <div
                  className="relative w-full h-[200px] mt-1"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredCard('s2');
                    setHoverX(Math.max(45, Math.min(rect.width - 45, e.clientX - rect.left)));
                  }}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 170" preserveAspectRatio="none">
                    {/* Grid lines: 250, 200, 150, 100, 50, 0 / Left: 2, 1, 0 */}
                    {[
                      { y: 20, lVal: '2', rVal: '250' },
                      { y: 48, lVal: '', rVal: '200' },
                      { y: 76, lVal: '', rVal: '150' },
                      { y: 90, lVal: '1', rVal: '' },
                      { y: 104, lVal: '', rVal: '100' },
                      { y: 132, lVal: '', rVal: '50' },
                      { y: 160, lVal: '0', rVal: '0' },
                    ].map((row, idx) => (
                      <g key={idx}>
                        <line
                          x1="45"
                          y1={row.y}
                          x2="955"
                          y2={row.y}
                          stroke={row.y === 160 ? '#D1D5DB' : '#E5E7EB'}
                          strokeDasharray={row.y === 160 ? undefined : '3 3'}
                        />
                        {row.lVal !== '' && (
                          <text x="40" y={row.y + 3} fill="#9CA3AF" fontSize="9" textAnchor="end" fontFamily="monospace">
                            {row.lVal}
                          </text>
                        )}
                        {row.rVal !== '' && (
                          <text x="960" y={row.y + 3} fill="#9CA3AF" fontSize="9" textAnchor="start" fontFamily="monospace">
                            {row.rVal}
                          </text>
                        )}
                      </g>
                    ))}

                    {/* X Ticks: 19:40, 19:50, 20:00, 20:10, 20:20, 20:30 */}
                    {[
                      { x: 90, label: '19:40' },
                      { x: 260, label: '19:50' },
                      { x: 430, label: '20:00' },
                      { x: 600, label: '20:10' },
                      { x: 770, label: '20:20' },
                      { x: 940, label: '20:30' },
                    ].map((t) => (
                      <text key={t.label} x={t.x} y="168" fill="#9CA3AF" fontSize="9.5" textAnchor="middle" fontFamily="monospace">
                        {t.label}
                      </text>
                    ))}

                    {/* Curve 1: Olive Green Curve at ~1.8 MB (Y ~ 33-44) hovering across the entire chart */}
                    <path
                      d="
                        M 45 36
                        C 90 33, 110 30, 140 31
                        C 180 32, 220 38, 260 36
                        C 300 34, 330 42, 350 41
                        C 380 40, 410 33, 430 34
                        C 460 35, 490 45, 510 44
                        C 540 43, 570 35, 600 36
                        C 640 37, 670 33, 690 34
                        C 730 35, 755 41, 770 40
                        C 800 39, 830 44, 850 43
                        C 890 42, 920 35, 955 36
                      "
                      fill="none"
                      stroke="#73D13D"
                      strokeWidth="1.8"
                    />

                    {/* Curve 2: Cyan line flat at baseline 0 */}
                    <path
                      d="
                        M 45 158
                        L 955 158
                      "
                      fill="none"
                      stroke="#13C2C2"
                      strokeWidth="1.2"
                    />
                  </svg>

                  {hoveredCard === 's2' && hoverX !== null && (
                    <div
                      className="absolute top-0 bottom-4 w-[1px] border-l border-dashed border-[#0084FF] pointer-events-none"
                      style={{ left: `${hoverX}px` }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
