import React, { useState } from 'react';
import {
  Clock,
  Search,
  RotateCw,
  Folder,
  ChevronDown,
  ChevronRight,
  GitFork,
  SlidersHorizontal,
  Download,
  Filter,
  CheckSquare,
  HelpCircle,
  BarChart2,
  Share2,
  Layers,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface SmartTraceViewProps {
  timeRange: string;
  nodeName: string;
}

export const SmartTraceView: React.FC<SmartTraceViewProps> = ({
  timeRange,
  nodeName,
}) => {
  const [activeLeftTab, setActiveLeftTab] = useState<'link' | 'group'>('link');
  const [activeMode, setActiveMode] = useState<'classic' | 'catalog'>('classic');
  const [activeMidTab, setActiveMidTab] = useState('应用');
  const [searchQuery, setSearchQuery] = useState('');

  // Tree expanded state
  const [treeExpanded, setTreeExpanded] = useState<Record<string, boolean>>({
    dc: true,
    if1: true,
  });

  const toggleTree = (key: string) => {
    setTreeExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const midTabs = [
    '概要信息',
    'VLAN',
    '站点',
    '应用',
    '主机',
    'IP会话',
    '服务器访问',
    'TCP会话',
    'UDP会话',
    '服务器二元组',
    '端口',
    '模式',
  ];

  return (
    <div className="flex-1 flex overflow-hidden bg-white text-gray-800 select-none text-xs">
      {/* Left Sidebar (Width ~210px) */}
      <div className="w-52 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Top 2 Tabs: 链路 / 分析组 */}
        <div className="p-2 border-b border-gray-100 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveLeftTab('link')}
            className={`flex-1 py-1 text-xs rounded text-center font-medium cursor-pointer transition-colors ${
              activeLeftTab === 'link'
                ? 'bg-[#0084FF] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            链路
          </button>
          <button
            type="button"
            onClick={() => setActiveLeftTab('group')}
            className={`flex-1 py-1 text-xs rounded text-center font-medium cursor-pointer transition-colors ${
              activeLeftTab === 'group'
                ? 'bg-[#0084FF] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            分析组
          </button>
        </div>

        {/* Mode Buttons: 经典模式 / 目录模式 */}
        <div className="p-2 border-b border-gray-100 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveMode('classic')}
            className={`flex-1 py-0.5 text-xs rounded border text-center cursor-pointer transition-colors ${
              activeMode === 'classic'
                ? 'border-[#0084FF] text-[#0084FF] bg-[#E6F4FF]/30 font-medium'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            经典模式
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('catalog')}
            className={`flex-1 py-0.5 text-xs rounded border text-center cursor-pointer transition-colors ${
              activeMode === 'catalog'
                ? 'border-[#0084FF] text-[#0084FF] bg-[#E6F4FF]/30 font-medium'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            目录模式
          </button>
        </div>

        {/* Search input */}
        <div className="px-2 py-1.5 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="请输入检索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-6 pl-6 pr-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#0084FF]"
            />
            <Search size={12} className="absolute left-2 top-1.5 text-gray-400" />
          </div>
        </div>

        {/* Link Tree List */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
          <div>
            <div
              onClick={() => toggleTree('dc')}
              className="flex items-center gap-1 px-1 py-1 hover:bg-gray-50 rounded cursor-pointer text-gray-800"
            >
              {treeExpanded.dc ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <span className="text-[10px] text-gray-400">田</span>
              <span className="truncate">DataCenter-SH</span>
            </div>

            {treeExpanded.dc && (
              <div className="pl-3.5 space-y-0.5">
                <div
                  onClick={() => toggleTree('if1')}
                  className="flex items-center gap-1 px-1 py-0.5 hover:bg-gray-50 rounded cursor-pointer text-gray-800"
                >
                  {treeExpanded.if1 ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  <span className="text-gray-400">田</span>
                  <span className="text-[#0084FF] font-medium">⚡ Interface 1</span>
                </div>

                {treeExpanded.if1 && (
                  <div className="pl-4 space-y-0.5 text-gray-600 text-[11px]">
                    <div className="px-1 py-0.5 hover:bg-gray-50 rounded cursor-pointer truncate">
                      V1
                    </div>
                    <div className="px-1 py-0.5 hover:bg-gray-50 rounded cursor-pointer truncate">
                      Internet Gateway(V1001)
                    </div>
                    <div className="px-1 py-0.5 hover:bg-gray-50 rounded cursor-pointer truncate">
                      Business Zone 2(V1002)
                    </div>
                    <div className="px-1 py-0.5 hover:bg-gray-50 rounded cursor-pointer truncate">
                      Core Switch(V1003)
                    </div>
                    <div className="px-1 py-0.5 hover:bg-gray-50 rounded cursor-pointer truncate">
                      Business Zone 1(V1004)
                    </div>

                    {/* Active Link LB */}
                    <div className="px-1.5 py-1 bg-[#E6F4FF] text-[#0084FF] font-medium rounded border-r-2 border-[#0084FF] cursor-pointer truncate flex items-center justify-between">
                      <span className="truncate">Link LB(V1005) - {nodeName}</span>
                    </div>

                    <div className="px-1 py-0.5 hover:bg-gray-50 rounded cursor-pointer truncate">
                      V16777215
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Other Folders */}
          {['HS', 'Private_Cloud', 'ftp测试', 'h323测试', 'v4v6', 'vProbe', 'vxlan', '云探针', '测试'].map(
            (item) => (
              <div
                key={item}
                className="flex items-center gap-1 px-1 py-0.5 hover:bg-gray-50 rounded cursor-pointer text-gray-700 text-[11px]"
              >
                <ChevronRight size={11} className="text-gray-400" />
                <span className="text-[10px] text-gray-400">田</span>
                <span>{item}</span>
              </div>
            )
          )}
        </div>

        {/* Bottom Status */}
        <div className="h-7 px-3 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500 bg-gray-50/50">
          <span>回放任务</span>
          <span className="text-[#0084FF] cursor-pointer hover:underline">展开 🗁</span>
        </div>
      </div>

      {/* Right Main Analysis Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top 24h mini timeline bar (Matching Image 2) */}
        <div className="h-8 px-4 bg-[#F8FAFC] border-b border-gray-200 flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-800 font-medium">2026-10-15</span>
            <button
              type="button"
              className="w-4 h-4 rounded-full bg-[#0084FF] text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft size={10} />
            </button>
          </div>

          {/* Time ticks with selection frame */}
          <div className="flex-1 max-w-4xl mx-3 relative flex items-center">
            {/* Timeline ticks */}
            <div className="w-full flex justify-between text-[10px] text-gray-400 select-none">
              <span>00:01</span>
              <span>01:00</span>
              <span>02:00</span>
              <span>03:00</span>
              <span>04:00</span>
              <span>05:00</span>
              <span>06:00</span>
              <span>07:00</span>
              <span>08:00</span>
              <span>09:00</span>
              <span>10:00</span>
              <span>11:00</span>
              <span>12:00</span>
              <span>13:00</span>
              <span>14:00</span>
              <span>15:00</span>
              <span>16:00</span>
              <span>17:00</span>
              <span>18:00</span>
              <span>19:00</span>
              <span>20:00</span>
              <span>21:00</span>
              <span>22:00</span>
              <span>23:00</span>
              <span>00:00</span>
            </div>

            {/* Selected slider window highlight */}
            <div
              className="absolute h-5 bg-[#0084FF]/20 border border-[#0084FF] rounded-xs cursor-pointer pointer-events-none"
              style={{ left: '64%', width: '3.5%' }}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="w-4 h-4 rounded-full bg-[#0084FF] text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronRightIcon size={10} />
            </button>
            <span>2026-10-15</span>
          </div>
        </div>

        {/* Filter Breadcrumbs Row */}
        <div className="h-8 px-4 bg-white border-b border-gray-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-gray-700 cursor-pointer">
              <span>指标图表</span>
              <ChevronDown size={12} className="text-gray-400" />
            </div>

            <div className="flex items-center gap-2 text-gray-500">
              <span className="flex items-center gap-1 text-gray-600">
                <Filter size={11} className="text-[#0084FF]" /> 过滤
              </span>
              <span className="px-2 py-0.5 bg-[#E6F4FF] text-[#0084FF] rounded border border-[#BAE0FF] text-[11px] font-mono">
                VLAN = Link LB(V1005) - {nodeName}
              </span>
              <span className="px-2 py-0.5 bg-[#E6F4FF] text-[#0084FF] rounded border border-[#BAE0FF] text-[11px] font-mono">
                应用 = 禅道内网
              </span>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-0.5"
                title="撤销筛选"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <button
              type="button"
              className="flex items-center gap-1 hover:text-gray-800 cursor-pointer"
            >
              <Clock size={12} />
              <span>历史</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1 hover:text-gray-800 cursor-pointer"
            >
              <span>收起</span>
            </button>
          </div>
        </div>

        {/* Chart Settings & Actions Bar */}
        <div className="h-8 px-4 bg-[#FAFCFE] border-b border-gray-200 flex items-center justify-between text-[11px] text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span>数据精度</span>
              <select className="h-5 px-1 border border-gray-300 rounded bg-white text-[11px]">
                <option>分钟</option>
                <option>秒</option>
              </select>
            </div>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" className="rounded text-[#0084FF]" />
              <span>刷新频率</span>
            </label>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <span className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
              <span className="text-[#0084FF]">基线</span>
              <HelpCircle size={11} className="text-gray-400" />
            </span>
            <span className="cursor-pointer hover:text-gray-900">峰值</span>
            <span className="cursor-pointer hover:text-gray-900">自定义指标</span>
            <span className="cursor-pointer hover:text-gray-900">图表转换</span>
            <span className="cursor-pointer hover:text-gray-900 font-medium text-[#0084FF]">
              流量概览
            </span>
          </div>
        </div>

        {/* Area Flow Chart (Matching Image 2) */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="h-44 relative">
            {/* Units on Left and Right */}
            <span className="absolute -top-1 left-0 text-[10px] text-gray-400 font-mono">
              流量(KB)
            </span>
            <span className="absolute -top-1 right-0 text-[10px] text-gray-400 font-mono">
              时间(ms)
            </span>

            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 800 150"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="smartGreenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#52C41A" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#52C41A" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[
                { kb: 850, ms: 200, y: 20 },
                { kb: 680, ms: 160, y: 46 },
                { kb: 510, ms: 120, y: 72 },
                { kb: 340, ms: 80, y: 98 },
                { kb: 170, ms: 40, y: 124 },
                { kb: 0, ms: 0, y: 145 },
              ].map((item) => (
                <g key={item.kb}>
                  <line
                    x1="30"
                    y1={item.y}
                    x2="770"
                    y2={item.y}
                    stroke={item.kb === 0 ? '#D1D5DB' : '#F0F0F0'}
                    strokeDasharray={item.kb === 0 ? undefined : '3 3'}
                  />
                  <text
                    x="25"
                    y={item.y + 3}
                    fill="#9CA3AF"
                    fontSize="9"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {item.kb}
                  </text>
                  <text
                    x="775"
                    y={item.y + 3}
                    fill="#9CA3AF"
                    fontSize="9"
                    textAnchor="start"
                    fontFamily="monospace"
                  >
                    {item.ms}
                  </text>
                </g>
              ))}

              {/* Light Green Filled Area Curve (KB) */}
              <path
                d="M 30 55 
                   C 100 50, 160 52, 240 52
                   C 320 52, 380 50, 460 48
                   C 540 46, 620 48, 700 50
                   C 730 52, 750 54, 770 54
                   L 770 145 L 30 145 Z"
                fill="url(#smartGreenGrad)"
              />
              <path
                d="M 30 55 
                   C 100 50, 160 52, 240 52
                   C 320 52, 380 50, 460 48
                   C 540 46, 620 48, 700 50
                   C 730 52, 750 54, 770 54"
                fill="none"
                stroke="#52C41A"
                strokeWidth="1.5"
              />

              {/* Baseline indicator */}
              <line x1="30" y1="145" x2="770" y2="145" stroke="#D1D5DB" strokeWidth="1" />

              {/* X-Axis Ticks: 15:28 ~ 15:42 */}
              {[
                '15:28',
                '15:29',
                '15:30',
                '15:31',
                '15:32',
                '15:33',
                '15:34',
                '15:35',
                '15:36',
                '15:37',
                '15:38',
                '15:39',
                '15:40',
                '15:41',
                '15:42',
              ].map((tick, idx) => {
                const x = 30 + (idx / 14) * 740;
                return (
                  <text
                    key={tick}
                    x={x}
                    y="158"
                    fill="#9CA3AF"
                    fontSize="9"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {tick}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Category Tabs: 概要信息 · VLAN · 站点 · 应用 ... */}
        <div className="h-9 px-4 bg-white border-b border-gray-200 flex items-center gap-6 overflow-x-auto text-xs shrink-0">
          {midTabs.map((tab) => {
            const isActive = activeMidTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveMidTab(tab)}
                className={`relative h-full flex items-center cursor-pointer transition-colors ${
                  isActive
                    ? 'text-[#0084FF] font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0084FF]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Table Toolbar */}
        <div className="h-9 px-4 bg-[#F8FAFC] border-b border-gray-200 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-4 text-gray-700">
            <span className="cursor-pointer hover:text-[#0084FF]">快速解码</span>
            <span className="cursor-pointer hover:text-[#0084FF]">数据包下载</span>
            <span className="cursor-pointer hover:text-[#0084FF]">精确过滤</span>
            <span className="cursor-pointer hover:text-[#0084FF]">选择KPI</span>
            <span className="cursor-pointer hover:text-[#0084FF]">对象监测</span>
            <div className="flex items-center gap-1 cursor-pointer hover:text-[#0084FF]">
              <span>菜单</span>
              <ChevronDown size={11} className="text-gray-400" />
            </div>
          </div>

          <div className="relative w-44">
            <input
              type="text"
              placeholder="搜索当前应用"
              className="w-full h-6 pl-2 pr-6 text-[11px] border border-gray-300 rounded bg-white focus:outline-none focus:border-[#0084FF]"
            />
            <Search size={12} className="absolute right-2 top-1.5 text-gray-400" />
          </div>
        </div>

        {/* Detail Table */}
        <div className="flex-1 bg-white overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F6F9] text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="py-2 px-3 w-8">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="py-2 px-3">应用名称 ↕</th>
                <th className="py-2 px-3">类型</th>
                <th className="py-2 px-3">分析</th>
                <th className="py-2 px-3 font-mono">流量 ↕</th>
                <th className="py-2 px-3 font-mono">速率 ↕</th>
                <th className="py-2 px-3 font-mono">利用率 (总) ↕</th>
                <th className="py-2 px-3 font-mono">网络时延 ↕</th>
                <th className="py-2 px-3 font-mono">建连失败率 ↕</th>
                <th className="py-2 px-3 font-mono">响应时间-服务器 ↕</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr className="hover:bg-[#F2F8FF] transition-colors">
                <td className="py-2.5 px-3">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="py-2.5 px-3 font-medium text-gray-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#0084FF] rounded-xs" />
                  <span>禅道内网</span>
                </td>
                <td className="py-2.5 px-3 text-gray-500">ipv4</td>
                <td className="py-2.5 px-3">
                  <div className="w-4 h-4 rounded bg-[#722ED1] flex items-center justify-center text-white text-[9px]">
                    ●
                  </div>
                </td>
                <td className="py-2.5 px-3 font-mono">11.60 MB</td>
                <td className="py-2.5 px-3 font-mono">108.17 Kbps</td>
                <td className="py-2.5 px-3 font-mono">0.01 %</td>
                <td className="py-2.5 px-3 font-mono">447.93 us</td>
                <td className="py-2.5 px-3 font-mono">0.00 %</td>
                <td className="py-2.5 px-3 font-mono">167.10 ms</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="h-9 px-4 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <div>本页记录从1到1 总数 1条</div>
          <div className="flex items-center gap-3">
            <select className="h-6 px-1 border border-gray-300 rounded text-xs">
              <option>100条/页</option>
              <option>50条/页</option>
              <option>20条/页</option>
            </select>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="w-6 h-6 border border-gray-200 rounded flex items-center justify-center text-gray-400 hover:text-gray-700"
              >
                &lt;
              </button>
              <button
                type="button"
                className="w-6 h-6 bg-[#0084FF] text-white rounded flex items-center justify-center font-medium"
              >
                1
              </button>
              <button
                type="button"
                className="w-6 h-6 border border-gray-200 rounded flex items-center justify-center text-gray-400 hover:text-gray-700"
              >
                &gt;
              </button>
            </div>
            <div className="flex items-center gap-1">
              <span>前往</span>
              <input
                type="text"
                defaultValue="1"
                className="w-8 h-6 text-center border border-gray-300 rounded text-xs font-mono"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
