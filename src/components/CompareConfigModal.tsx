import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Clock,
  Search,
  ChevronDown,
  Calendar,
  AlertCircle,
  Check,
} from 'lucide-react';

export interface CompareConfig {
  baseTime: string;
  comparePeriodType?: string;
  compareTime: string;
  selectedMetrics: string[];
  selectedNodes: string[];
}

interface CompareConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: CompareConfig) => void;
  initialNodes?: string[];
  title?: string;
}

export const CompareConfigModal: React.FC<CompareConfigModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialNodes,
  title,
}) => {
  // Base period (current topology window)
  const baseTimeStr = '2026-10-15 10:12 ~ 2026-10-15 10:27';

  // State 1: Comparison Time (default: yesterday at same time)
  const [compareTime, setCompareTime] = useState('2026-10-14 10:12 ~ 2026-10-14 10:27');
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [fromDate, setFromDate] = useState('2026-10-14');
  const [fromTime, setFromTime] = useState('10:12');
  const [toDate, setToDate] = useState('2026-10-14');
  const [toTime, setToTime] = useState('10:27');

  // State 2: Selected Metrics (defaults to 4-quadrant metrics as required)
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    '流量',
    '响应时间-服务器',
    '网络时延',
    '建连失败率',
  ]);
  const [isKpiPickerOpen, setIsKpiPickerOpen] = useState(false);
  const [kpiSearchText, setKpiSearchText] = useState('');

  // State 3: Selected Nodes (Multi-select dropdown)
  const [selectedNodes, setSelectedNodes] = useState<string[]>([
    '交换机',
    '交换机1',
  ]);
  const [isNodePickerOpen, setIsNodePickerOpen] = useState(false);

  useEffect(() => {
    if (isOpen && initialNodes && initialNodes.length > 0) {
      setSelectedNodes(initialNodes);
    }
  }, [isOpen, initialNodes]);

  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Available nodes
  const availableNodes = [
    { id: '交换机', label: '交换机 (核心汇聚)' },
    { id: '交换机1', label: '交换机1 (接入交换机)' },
    { id: 'Internet Egress to Bu...', label: 'Internet Egress to Bu...' },
    { id: 'Production Core Zone', label: 'Production Core Zone' },
  ];

  // All metrics based on Image 3
  const kpiCategories = [
    {
      name: '流量',
      items: [
        '流量',
        '流量-客户端',
        '流量-服务器',
        '字节率',
        '字节率-客户端',
        '字节率-服务器',
        '速率',
        '速率-客户端',
        '速率-服务器',
        '利用率（总）',
        '峰值利用率',
        '数据包数',
        '数据包数-客户端',
        '数据包数-服务器',
        '平均包率',
        '平均包率-客户端',
        '平均包率-服务器',
        '平均包长',
        '峰值速率',
        '谷值速率',
        '上行峰值流量（出网）',
        '下行峰值流量（进网）',
        '上行峰值速率（出网）',
        '下行峰值速率（进网）',
        '上行谷值流量',
        '下行谷值流量',
        '净荷包数-客户端',
        '净荷包数',
        '净荷包数-服务器',
        '应用巨帧包数-客户端',
        '应用巨帧包数',
        '应用巨帧包数-服务器',
        '净荷-客户端',
        '净荷',
        '净荷-服务器',
        '峰值流量',
        '谷值流量',
        '响应请求占比',
      ],
    },
    {
      name: '性能与延时',
      items: [
        '响应时间-服务器',
        '响应时间-客户端',
        '网络时延',
        '建连失败率',
        '重传率-客户端',
        '重传率-服务器',
        '建连成功率',
        '建连成功数',
        '零窗口数',
      ],
    },
  ];

  // Quick choices for Image 2 Date-Time Picker
  const quickTimeOptions = [
    { label: '昨天', range: '2026-10-14 10:12 ~ 2026-10-14 10:27' },
    { label: '今天', range: '2026-10-15 00:00 ~ 2026-10-15 10:27' },
    { label: '上周', range: '2026-10-08 10:12 ~ 2026-10-08 10:27' },
    { label: '本周', range: '2026-10-12 00:00 ~ 2026-10-15 10:27' },
    { label: '上月', range: '2026-09-15 10:12 ~ 2026-09-15 10:27' },
    { label: '本月', range: '2026-10-01 00:00 ~ 2026-10-15 10:27' },
    { label: '1分钟', range: '2026-10-15 10:26 ~ 2026-10-15 10:27' },
    { label: '5分钟', range: '2026-10-15 10:22 ~ 2026-10-15 10:27' },
    { label: '15分钟', range: '2026-10-15 10:12 ~ 2026-10-15 10:27' },
    { label: '30分钟', range: '2026-10-15 09:57 ~ 2026-10-15 10:27' },
    { label: '1小时', range: '2026-10-15 09:27 ~ 2026-10-15 10:27' },
    { label: '3小时', range: '2026-10-15 07:27 ~ 2026-10-15 10:27' },
    { label: '6小时', range: '2026-10-15 04:27 ~ 2026-10-15 10:27' },
    { label: '12小时', range: '2026-10-14 22:27 ~ 2026-10-15 10:27' },
    { label: '24小时', range: '2026-10-14 10:27 ~ 2026-10-15 10:27' },
    { label: '过去1天', range: '2026-10-14 00:00 ~ 2026-10-14 23:59' },
    { label: '过去3天', range: '2026-10-12 00:00 ~ 2026-10-14 23:59' },
    { label: '过去7天', range: '2026-10-08 00:00 ~ 2026-10-14 23:59' },
    { label: '过去14天', range: '2026-10-01 00:00 ~ 2026-10-14 23:59' },
    { label: '过去1个月', range: '2026-09-14 00:00 ~ 2026-10-14 23:59' },
    { label: '过去2个月', range: '2026-08-14 00:00 ~ 2026-10-14 23:59' },
    { label: '过去3个月', range: '2026-07-14 00:00 ~ 2026-10-14 23:59' },
  ];

  const historyQueries = [
    '10-12 14:05 - 10-13 14:05',
    '10-12 05:34 - 10-12 11:34',
    '10-12 10:35 - 10-12 11:35',
    '09-18 17:35 - 09-18 17:40',
    '09-18 17:39 - 09-18 17:40',
    '09-17 14:43 - 09-17 14:44',
    '09-17 13:58 - 09-17 14:03',
    '09-17 13:48 - 09-17 14:03',
  ];

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const removeMetric = (metric: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMetrics((prev) => prev.filter((m) => m !== metric));
  };

  const toggleNode = (nodeId: string) => {
    setSelectedNodes((prev) =>
      prev.includes(nodeId)
        ? prev.length > 1
          ? prev.filter((n) => n !== nodeId)
          : prev
        : [...prev, nodeId]
    );
  };

  const removeNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedNodes.length > 1) {
      setSelectedNodes((prev) => prev.filter((n) => n !== nodeId));
    }
  };

  const handleConfirmTimePicker = () => {
    setCompareTime(`${fromDate} ${fromTime} ~ ${toDate} ${toTime}`);
    setIsTimePickerOpen(false);
  };

  const handleSelectQuickTime = (range: string) => {
    setCompareTime(range);
    const parts = range.split(' ~ ');
    if (parts.length === 2) {
      const fromParts = parts[0].split(' ');
      const toParts = parts[1].split(' ');
      if (fromParts.length === 2) {
        setFromDate(fromParts[0]);
        setFromTime(fromParts[1]);
      }
      if (toParts.length === 2) {
        setToDate(toParts[0]);
        setToTime(toParts[1]);
      }
    }
    setIsTimePickerOpen(false);
  };

  const handleConfirmCompare = () => {
    onConfirm({
      baseTime: baseTimeStr,
      compareTime,
      selectedMetrics,
      selectedNodes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px] transition-opacity cursor-pointer"
      />

      {/* Modal Dialog */}
      <div
        ref={modalRef}
        className="relative w-[680px] bg-white rounded-lg shadow-2xl border border-gray-200 z-10 flex flex-col overflow-visible animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="h-11 px-5 border-b border-gray-200 flex items-center justify-between bg-[#FBFBFD] rounded-t-lg">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-800">{title || '一键对比配置'}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-5 text-xs text-gray-700">
          {/* 对比时间范围 (图1输入框 + 图2弹出选择器，基准时间置于标题行最右侧) */}
          <div className="space-y-1.5 relative">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">对比时间范围</span>
              <div className="flex items-center gap-1.5 text-gray-500 font-normal">
                <span className="text-[11px] text-gray-400">基准时间范围:</span>
                <span className="font-mono text-gray-700 text-xs bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  {baseTimeStr}
                </span>
              </div>
            </div>

            {/* Input Box (Matching Figure 1 style) */}
            <div
              onClick={() => {
                setIsTimePickerOpen(!isTimePickerOpen);
                setIsKpiPickerOpen(false);
                setIsNodePickerOpen(false);
              }}
              className="h-8 rounded border border-gray-300 hover:border-[#0084FF] bg-white flex items-center justify-between cursor-pointer overflow-hidden transition-all shadow-2xs"
            >
              <div className="flex items-center h-full flex-1">
                <div className="w-8 h-full bg-gray-50 border-r border-gray-200 flex items-center justify-center text-gray-400">
                  <Clock size={14} />
                </div>
                <span className="font-mono text-xs text-gray-800 px-3 truncate">
                  {compareTime}
                </span>
              </div>
              <button
                type="button"
                className="w-8 h-full bg-[#0091FF] hover:bg-[#0080E6] text-white flex items-center justify-center transition-colors shrink-0"
              >
                <Search size={14} />
              </button>
            </div>

            {/* Time Picker Popup Panel (Matching Figure 2 style) */}
            {isTimePickerOpen && (
              <div className="absolute left-0 top-15 z-50 w-[640px] bg-white rounded-md border border-gray-200 shadow-2xl p-4 flex flex-col space-y-3 animate-in fade-in duration-100">
                {/* 3 Columns */}
                <div className="grid grid-cols-12 gap-3 text-xs">
                  {/* Left Column: 自...至... & warning */}
                  <div className="col-span-4 pr-3 border-r border-gray-100 flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      <div>
                        <span className="text-[11px] text-gray-500 block mb-1">
                          自
                        </span>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-24 h-7 px-2 border border-gray-300 rounded font-mono text-[11px]"
                          />
                          <input
                            type="text"
                            value={fromTime}
                            onChange={(e) => setFromTime(e.target.value)}
                            className="w-16 h-7 px-2 border border-gray-300 rounded font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] text-gray-500 block mb-1">
                          至
                        </span>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-24 h-7 px-2 border border-gray-300 rounded font-mono text-[11px]"
                          />
                          <input
                            type="text"
                            value={toTime}
                            onChange={(e) => setToTime(e.target.value)}
                            className="w-16 h-7 px-2 border border-gray-300 rounded font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-gray-400 leading-normal pt-2">
                      自定义时间查询：时间段跨度过大会导致查询性能下降，请尽量缩短查询时间。
                    </div>
                  </div>

                  {/* Middle Column: 历史查询 */}
                  <div className="col-span-3 px-2 border-r border-gray-100 space-y-1.5">
                    <span className="text-[11px] text-gray-500 block mb-1 font-medium">
                      历史查询
                    </span>
                    <div className="space-y-1 overflow-y-auto max-h-48 pr-1">
                      {historyQueries.map((item, idx) => (
                        <div
                          key={item}
                          onClick={() => {
                            const formatted = `2026-${item.replace(' - ', ' ~ 2026-')}`;
                            handleSelectQuickTime(formatted);
                          }}
                          className={`flex items-center justify-between px-1.5 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                            idx === 0
                              ? 'text-[#0084FF] bg-[#E6F4FF]/50 hover:bg-[#E6F4FF]'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <span className="truncate">{item}</span>
                          {idx === 0 && (
                            <span className="text-gray-400 hover:text-gray-700 ml-1">
                              ✕
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: 快速查询(最近) */}
                  <div className="col-span-5 pl-2 space-y-1.5">
                    <span className="text-[11px] text-gray-500 block mb-1 font-medium">
                      快速查询(最近)
                    </span>
                    <div className="grid grid-cols-4 gap-x-2 gap-y-1.5 text-[11px]">
                      {quickTimeOptions.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => handleSelectQuickTime(opt.range)}
                          className="text-left text-gray-700 hover:text-[#0084FF] hover:bg-[#E6F4FF]/30 px-1 py-0.5 rounded cursor-pointer transition-colors truncate"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action inside Picker */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsTimePickerOpen(false)}
                    className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-600 cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmTimePicker}
                    className="px-4 py-1 text-xs bg-[#0084FF] hover:bg-[#0073E6] text-white rounded font-medium cursor-pointer shadow-2xs"
                  >
                    确定
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. 指标选择 (图3样式多选下拉框) */}
          <div className="space-y-1.5 relative">
            <label className="font-semibold text-gray-700 text-xs flex items-center justify-between">
              <span>指标选择 (KPI)</span>
              <span className="text-[10px] text-[#0084FF]">
                已选 {selectedMetrics.length} 项 (默认已带入四宫格指标)
              </span>
            </label>

            {/* Dropdown Display Trigger */}
            <div
              onClick={() => {
                setIsKpiPickerOpen(!isKpiPickerOpen);
                setIsTimePickerOpen(false);
                setIsNodePickerOpen(false);
              }}
              className="min-h-8 p-1 rounded border border-gray-300 hover:border-[#0084FF] bg-white flex items-center justify-between cursor-pointer flex-wrap gap-1 transition-colors"
            >
              <div className="flex items-center flex-wrap gap-1.5 flex-1">
                {selectedMetrics.map((metric) => (
                  <span
                    key={metric}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#E6F4FF] border border-[#BAE0FF] text-[#0084FF] text-xs font-medium"
                  >
                    <span>{metric}</span>
                    <button
                      type="button"
                      onClick={(e) => removeMetric(metric, e)}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <ChevronDown size={14} className="text-gray-400 mr-1 shrink-0" />
            </div>

            {/* KPI Picker Dropdown Panel (Matching Figure 3 style) */}
            {isKpiPickerOpen && (
              <div className="absolute left-0 top-15 z-50 w-full bg-white rounded-md border border-gray-200 shadow-2xl p-4 flex flex-col space-y-3 animate-in fade-in duration-100 max-h-[380px] overflow-hidden">
                {/* Top: 搜索框 + 已选择KPI标签 */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="relative w-48 shrink-0">
                    <input
                      type="text"
                      placeholder="搜索"
                      value={kpiSearchText}
                      onChange={(e) => setKpiSearchText(e.target.value)}
                      className="w-full h-7 pl-6 pr-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#0084FF]"
                    />
                    <Search
                      size={12}
                      className="absolute left-2 top-2 text-gray-400"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 flex-1 overflow-x-auto text-xs py-0.5">
                    <span className="text-gray-500 shrink-0 text-xs">
                      已选择KPI:
                    </span>
                    {selectedMetrics.map((metric) => (
                      <span
                        key={metric}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#E6F4FF] border border-[#BAE0FF] text-[#0084FF] text-xs shrink-0 font-medium"
                      >
                        <span>{metric}</span>
                        <button
                          type="button"
                          onClick={(e) => removeMetric(metric, e)}
                          className="hover:text-red-500 cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Checkbox Grid by Categories */}
                <div className="overflow-y-auto max-h-56 pr-1 space-y-4">
                  {kpiCategories.map((cat) => {
                    const filteredItems = cat.items.filter((item) =>
                      item.toLowerCase().includes(kpiSearchText.toLowerCase())
                    );
                    if (filteredItems.length === 0) return null;

                    return (
                      <div key={cat.name} className="space-y-2">
                        {/* Category Header */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                          <span className="w-1 h-3 bg-[#0084FF] rounded-xs" />
                          <span>{cat.name}</span>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-4 gap-x-2 gap-y-2 text-xs">
                          {filteredItems.map((item) => {
                            const isChecked = selectedMetrics.includes(item);
                            return (
                              <label
                                key={item}
                                onClick={() => toggleMetric(item)}
                                className="flex items-center gap-1.5 cursor-pointer text-gray-700 hover:text-gray-900 select-none truncate"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}}
                                  className="w-3.5 h-3.5 text-[#0084FF] rounded border-gray-300 focus:ring-0 cursor-pointer"
                                />
                                <span
                                  className={`truncate text-xs ${
                                    isChecked
                                      ? 'text-[#0084FF] font-medium'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {item}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action inside Picker */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsKpiPickerOpen(false)}
                    className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-600 cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsKpiPickerOpen(false)}
                    className="px-4 py-1 text-xs bg-[#0084FF] hover:bg-[#0073E6] text-white rounded font-medium cursor-pointer shadow-2xs"
                  >
                    确定
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. 对比节点 (多选下拉框) */}
          <div className="space-y-1.5 relative">
            <label className="font-semibold text-gray-700 text-xs flex items-center justify-between">
              <span>对比节点</span>
              <span className="text-[10px] text-gray-400">
                可多选参与周期对比的节点 (已选 {selectedNodes.length} 个)
              </span>
            </label>

            {/* Dropdown Trigger */}
            <div
              onClick={() => {
                setIsNodePickerOpen(!isNodePickerOpen);
                setIsTimePickerOpen(false);
                setIsKpiPickerOpen(false);
              }}
              className="min-h-8 p-1 rounded border border-gray-300 hover:border-[#0084FF] bg-white flex items-center justify-between cursor-pointer flex-wrap gap-1 transition-colors"
            >
              <div className="flex items-center flex-wrap gap-1.5 flex-1">
                {selectedNodes.map((node) => (
                  <span
                    key={node}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-800 text-xs font-medium"
                  >
                    <span>{node}</span>
                    {selectedNodes.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => removeNode(node, e)}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              <ChevronDown size={14} className="text-gray-400 mr-1 shrink-0" />
            </div>

            {/* Node Picker Dropdown Menu */}
            {isNodePickerOpen && (
              <div className="absolute left-0 top-15 z-50 w-full bg-white rounded-md border border-gray-200 shadow-xl p-2 flex flex-col space-y-1 animate-in fade-in duration-100">
                <div className="px-2 py-1 text-[11px] text-gray-400 border-b border-gray-100 flex items-center justify-between">
                  <span>选择节点</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedNodes(availableNodes.map((n) => n.id))
                      }
                      className="text-[#0084FF] hover:underline cursor-pointer"
                    >
                      全选
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedNodes(['交换机'])}
                      className="text-gray-500 hover:underline cursor-pointer"
                    >
                      重置
                    </button>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto py-1 space-y-0.5">
                  {availableNodes.map((node) => {
                    const isChecked = selectedNodes.includes(node.id);
                    return (
                      <label
                        key={node.id}
                        onClick={() => toggleNode(node.id)}
                        className={`flex items-center justify-between px-3 py-1.5 rounded cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-[#E6F4FF]/50 text-[#0084FF]'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-3.5 h-3.5 text-[#0084FF] rounded border-gray-300"
                          />
                          <span className="text-xs font-medium">
                            {node.label}
                          </span>
                        </div>
                        {isChecked && (
                          <Check size={13} className="text-[#0084FF]" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="h-12 px-5 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2.5 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirmCompare}
            className="px-5 py-1.5 text-xs font-medium text-white bg-[#0084FF] hover:bg-[#0073E6] rounded shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <Calendar size={13} />
            <span>开始对比</span>
          </button>
        </div>
      </div>
    </div>
  );
};
