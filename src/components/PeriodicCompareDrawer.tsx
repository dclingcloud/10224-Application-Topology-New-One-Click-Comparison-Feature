import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  PanelRightClose,
  TrendingUp,
  TrendingDown,
  Minus,
  Settings2,
  Server,
  Layers,
} from 'lucide-react';
import { CompareConfig } from './CompareConfigModal';

export interface DrillDownParams {
  timeRange: string;
  nodeName: string;
}

interface PeriodicCompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: CompareConfig;
  onReconfigure: () => void;
  onDrillDown: (params: DrillDownParams) => void;
}

export const PeriodicCompareDrawer: React.FC<PeriodicCompareDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onReconfigure,
  onDrillDown,
}) => {
  // Point 4: Default active node tab to the first selected node
  const [activeNode, setActiveNode] = useState<string>(
    config.selectedNodes[0] || '交换机'
  );

  // Synchronized hover across all 4 charts (四表联动)
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  const [hoveredChart, setHoveredChart] = useState<string | null>(null);

  // Time range brush selection (滑动框选时间段, 初始为图1的 10:17 ~ 10:20, 间隔:3分钟)
  const [selection, setSelection] = useState<{
    startRatio: number;
    endRatio: number;
    startTime: string;
    endTime: string;
    durationMinutes: number;
  }>({
    startRatio: 0.33,
    endRatio: 0.53,
    startTime: '10/15 10:17',
    endTime: '10/15 10:20',
    durationMinutes: 3,
  });

  const [isBrushing, setIsBrushing] = useState(false);
  const [brushStartRatio, setBrushStartRatio] = useState<number | null>(null);

  useEffect(() => {
    if (config.selectedNodes.length > 0 && !config.selectedNodes.includes(activeNode)) {
      setActiveNode(config.selectedNodes[0]);
    }
  }, [config.selectedNodes, activeNode]);

  if (!isOpen) return null;

  // Mock comparison data for nodes
  const nodeCompareDataset: Record<
    string,
    {
      name: string;
      type: string;
      metrics: {
        name: string;
        baseValue: string;
        baseUnit: string;
        compareValue: string;
        compareUnit: string;
        diff: string;
        diffPercent: string;
        trend: 'up' | 'down' | 'flat';
        isGood: boolean;
        baseNum: number;
        compareNum: number;
      }[];
    }
  > = {
    交换机: {
      name: '交换机',
      type: '核心汇聚节点',
      metrics: [
        {
          name: '流量',
          baseValue: '125.81',
          baseUnit: 'MB',
          compareValue: '108.40',
          compareUnit: 'MB',
          diff: '+17.41 MB',
          diffPercent: '+16.06%',
          trend: 'up',
          isGood: true,
          baseNum: 125.81,
          compareNum: 108.40,
        },
        {
          name: '响应时间-服务器',
          baseValue: '25.84',
          baseUnit: 'ms',
          compareValue: '28.10',
          compareUnit: 'ms',
          diff: '-2.26 ms',
          diffPercent: '-8.04%',
          trend: 'down',
          isGood: true,
          baseNum: 25.84,
          compareNum: 28.10,
        },
        {
          name: '网络时延',
          baseValue: '121.10',
          baseUnit: 'ms',
          compareValue: '115.30',
          compareUnit: 'ms',
          diff: '+5.80 ms',
          diffPercent: '+5.03%',
          trend: 'up',
          isGood: false,
          baseNum: 121.10,
          compareNum: 115.30,
        },
        {
          name: '建连失败率',
          baseValue: '48.13',
          baseUnit: '%',
          compareValue: '52.40',
          compareUnit: '%',
          diff: '-4.27 %',
          diffPercent: '-8.15%',
          trend: 'down',
          isGood: true,
          baseNum: 48.13,
          compareNum: 52.40,
        },
      ],
    },
    交换机1: {
      name: '交换机1',
      type: '接入层交换机',
      metrics: [
        {
          name: '流量',
          baseValue: '19.63',
          baseUnit: 'KB',
          compareValue: '14.20',
          compareUnit: 'KB',
          diff: '+5.43 KB',
          diffPercent: '+38.24%',
          trend: 'up',
          isGood: true,
          baseNum: 19.63,
          compareNum: 14.20,
        },
        {
          name: '响应时间-服务器',
          baseValue: '0',
          baseUnit: 'us',
          compareValue: '0',
          compareUnit: 'us',
          diff: '0 us',
          diffPercent: '0.00%',
          trend: 'flat',
          isGood: true,
          baseNum: 0,
          compareNum: 0,
        },
        {
          name: '网络时延',
          baseValue: '0',
          baseUnit: 'us',
          compareValue: '0',
          compareUnit: 'us',
          diff: '0 us',
          diffPercent: '0.00%',
          trend: 'flat',
          isGood: true,
          baseNum: 0,
          compareNum: 0,
        },
        {
          name: '建连失败率',
          baseValue: '100.00',
          baseUnit: '%',
          compareValue: '98.50',
          compareUnit: '%',
          diff: '+1.50 %',
          diffPercent: '+1.52%',
          trend: 'up',
          isGood: false,
          baseNum: 100,
          compareNum: 98.5,
        },
      ],
    },
  };

  const currentNodeData =
    nodeCompareDataset[activeNode] || nodeCompareDataset['交换机'];

  const displayMetrics = currentNodeData.metrics.filter((m) =>
    config.selectedMetrics.some((selected) => m.name.includes(selected))
  );

  const metricsToRender =
    displayMetrics.length > 0 ? displayMetrics : currentNodeData.metrics;

  // Helper for synchronized hover calculation
  const getHoverValues = (metricIdx: number) => {
    if (hoverRatio === null) return null;
    const m = metricsToRender[metricIdx] || metricsToRender[0];
    const minute = Math.floor(12 + hoverRatio * 15);
    const timeStr = `10:${minute.toString().padStart(2, '0')}`;

    // Wave formulas for interpolation
    let factorBase = 1;
    let factorCompare = 1;
    if (metricIdx === 0) {
      factorBase = 0.85 + 0.35 * Math.sin(hoverRatio * Math.PI * 1.5);
      factorCompare = 0.8 + 0.28 * Math.sin((hoverRatio + 0.1) * Math.PI * 1.5);
    } else if (metricIdx === 1) {
      factorBase = 0.9 + 0.25 * Math.cos(hoverRatio * Math.PI);
      factorCompare = 0.85 + 0.3 * Math.cos(hoverRatio * Math.PI);
    } else if (metricIdx === 2) {
      factorBase = 0.95 + 0.1 * Math.sin(hoverRatio * 6);
      factorCompare = 0.95 + 0.08 * Math.sin(hoverRatio * 6);
    } else {
      factorBase = 0.9 + 0.25 * Math.sin(hoverRatio * 4);
      factorCompare = 0.85 + 0.3 * Math.sin(hoverRatio * 4);
    }

    const curBase = (m.baseNum * factorBase).toFixed(2);
    const curComp = (m.compareNum * factorCompare).toFixed(2);
    const diff = (parseFloat(curBase) - parseFloat(curComp)).toFixed(2);
    const diffP = (
      parseFloat(curComp) > 0
        ? ((parseFloat(diff) / parseFloat(curComp)) * 100).toFixed(2)
        : '0.00'
    );

    return {
      timeStr,
      baseVal: curBase,
      compVal: curComp,
      diff: parseFloat(diff) >= 0 ? `+${diff}` : `${diff}`,
      diffP: parseFloat(diff) >= 0 ? `+${diffP}%` : `${diffP}%`,
      unit: m.baseUnit,
    };
  };

  // Mouse event handlers for chart
  const handleChartMouseMove = (e: React.MouseEvent<SVGSVGElement>, chartKey: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const r = Math.max(0, Math.min(1, (x - 20) / (rect.width - 40)));
    setHoverRatio(r);
    setHoveredChart(chartKey);

    if (isBrushing && brushStartRatio !== null) {
      const start = Math.min(brushStartRatio, r);
      const end = Math.max(brushStartRatio, r);
      const startMin = Math.floor(12 + start * 15);
      const endMin = Math.floor(12 + end * 15);
      const dur = Math.max(1, endMin - startMin);
      setSelection({
        startRatio: start,
        endRatio: end,
        startTime: `10/15 10:${startMin.toString().padStart(2, '0')}`,
        endTime: `10/15 10:${endMin.toString().padStart(2, '0')}`,
        durationMinutes: dur,
      });
    }
  };

  const handleChartMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const r = Math.max(0, Math.min(1, (x - 20) / (rect.width - 40)));
    setIsBrushing(true);
    setBrushStartRatio(r);
  };

  const handleChartMouseUp = () => {
    setIsBrushing(false);
    setBrushStartRatio(null);
  };

  const handleChartMouseLeave = () => {
    setHoverRatio(null);
    setHoveredChart(null);
    if (isBrushing) {
      setIsBrushing(false);
      setBrushStartRatio(null);
    }
  };

  // Trigger drill-down to 智溯 / 流量分析
  const handleDrillDownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startHour = selection.startTime.replace('10/15 ', '');
    const endHour = selection.endTime.replace('10/15 ', '');
    onDrillDown({
      timeRange: `2026-10-15 ${startHour} ~ 2026-10-15 ${endHour}`,
      nodeName: activeNode,
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex select-none pointer-events-auto">
      {/* Dark backdrop */}
      <div
        onClick={onClose}
        className="flex-1 bg-black/40 backdrop-blur-[0.5px] transition-opacity cursor-pointer"
      />

      {/* Main Drawer Container */}
      <div className="relative w-[88%] min-w-[840px] max-w-[1480px] bg-[#F7F9FB] h-full shadow-2xl flex flex-col border-l border-gray-200 animate-in slide-in-from-right duration-200">
        {/* Docked Blue Left Tab */}
        <div
          onClick={onClose}
          className="absolute -left-7.5 top-20 bg-[#0084FF] text-white text-xs px-1.5 py-4 rounded-l-md shadow-md cursor-pointer flex flex-col items-center justify-center font-medium tracking-widest hover:bg-[#0073E6] transition-colors"
          style={{ writingMode: 'vertical-rl' }}
          title="点击收起"
        >
          周期对比
        </div>

        {/* 1. Drawer Header */}
        <div className="h-11 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-gray-800">周期对比</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-[#E6F4FF] text-[#0084FF] font-medium border border-[#BAE0FF]">
                基准: {config.baseTime}
              </span>
              <span className="text-gray-400">vs</span>
              <span className="px-2 py-0.5 rounded bg-[#FFF7E6] text-[#D46B08] font-medium border border-[#FFD591]">
                对比: {config.compareTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500">
            <button
              type="button"
              onClick={onReconfigure}
              className="flex items-center gap-1.5 text-xs text-[#0084FF] hover:text-[#0073E6] cursor-pointer transition-colors"
            >
              <Settings2 size={14} />
              <span>重新配置</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
            >
              <PanelRightClose size={15} />
              <span>收起弹窗</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭"
              className="hover:text-gray-900 cursor-pointer p-0.5 rounded hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 2. Sub-Toolbar: Node Tabs */}
        <div className="h-10 bg-white px-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">当前对比节点:</span>
            <div className="flex items-center gap-1">
              {config.selectedNodes.map((nodeName) => {
                const isActive = activeNode === nodeName;
                return (
                  <button
                    key={nodeName}
                    type="button"
                    onClick={() => setActiveNode(nodeName)}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded font-medium cursor-pointer transition-all ${
                      isActive
                        ? 'bg-[#E6F4FF] text-[#0084FF] border border-[#BAE0FF] shadow-2xs'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <Server size={12} className={isActive ? 'text-[#0084FF]' : 'text-gray-400'} />
                    <span>{nodeName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Legend & Instruction Indicator */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-[2.5px] bg-[#0084FF] inline-block rounded-xs" />
              <span className="text-gray-600">基准时段 (实线)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-[2.5px] bg-[#FA8C16] inline-block rounded-xs"
                style={{ borderTop: '2px dashed #FA8C16' }}
              />
              <span className="text-gray-600">对比时段 (虚线)</span>
            </div>
          </div>
        </div>

        {/* 3. Main Drawer Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {/* Point 5: 第一行卡片平铺铺满 (Full-width tiled metric comparison cards) */}
          <div className="w-full">
            <div
              className={`grid gap-3.5 w-full ${
                metricsToRender.length <= 4
                  ? `grid-cols-${metricsToRender.length || 4}`
                  : 'grid-cols-4'
              }`}
            >
              {metricsToRender.map((m) => (
                <div
                  key={m.name}
                  className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-2xs flex flex-col justify-between hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-800">
                      {m.name}
                    </span>
                    <span
                      className={`flex items-center gap-0.5 text-[11px] font-semibold ${
                        m.trend === 'flat'
                          ? 'text-gray-500'
                          : m.isGood
                          ? 'text-[#52C41A]'
                          : 'text-[#FF4D4F]'
                      }`}
                    >
                      {m.trend === 'up' && <TrendingUp size={12} />}
                      {m.trend === 'down' && <TrendingDown size={12} />}
                      {m.trend === 'flat' && <Minus size={12} />}
                      <span>{m.diffPercent}</span>
                    </span>
                  </div>

                  <div className="py-2.5 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-0.5">
                        基准值
                      </span>
                      <span className="text-base font-bold text-gray-900 font-mono">
                        {m.baseValue}
                      </span>
                      <span className="text-[10px] text-gray-500 ml-1">
                        {m.baseUnit}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block mb-0.5">
                        对比值
                      </span>
                      <span className="text-sm font-semibold text-gray-600 font-mono">
                        {m.compareValue}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-1">
                        {m.compareUnit}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">变动量:</span>
                    <span
                      className={`font-mono font-medium ${
                        m.trend === 'flat'
                          ? 'text-gray-500'
                          : m.isGood
                          ? 'text-[#52C41A]'
                          : 'text-[#FF4D4F]'
                      }`}
                    >
                      {m.diff}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: 趋势叠加对比 (2x2 Grid with Linked Crosshair & Mouse Brush Selection) */}
          <div className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-800">
                  【{activeNode}】指标周期走势叠加对比
                </span>
                <span className="text-[11px] text-[#0084FF] font-medium bg-[#E6F4FF] px-2 py-0.5 rounded">
                  四表鼠标联动 · 可在任意图表上鼠标框选滑动时间段下钻
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {[
                {
                  key: 'traffic',
                  name: '流量对比走势',
                  unit: 'MB',
                  idx: 0,
                  basePath: 'M 20 115 C 60 110, 120 30, 160 30 C 200 30, 240 100, 300 80 C 360 60, 420 40, 480 35',
                  compPath: 'M 20 120 C 70 115, 130 50, 170 50 C 210 50, 250 110, 310 95 C 370 80, 430 55, 480 50',
                },
                {
                  key: 'responseTime',
                  name: '响应时间-服务器对比走势',
                  unit: 'ms',
                  idx: 1,
                  basePath: 'M 20 70 C 80 65, 140 85, 200 45 C 260 25, 340 70, 400 65 C 440 60, 480 50, 480 50',
                  compPath: 'M 20 60 C 80 55, 140 100, 200 65 C 260 45, 340 80, 400 75 C 440 70, 480 65, 480 65',
                },
                {
                  key: 'delay',
                  name: '网络时延对比走势',
                  unit: 'ms',
                  idx: 2,
                  basePath: 'M 20 60 C 100 58, 200 62, 280 55 C 350 48, 420 58, 480 55',
                  compPath: 'M 20 68 C 100 65, 200 68, 280 62 C 350 56, 420 65, 480 62',
                },
                {
                  key: 'failRate',
                  name: '建连失败率对比走势',
                  unit: '%',
                  idx: 3,
                  basePath: 'M 20 100 C 120 100, 180 30, 220 30 C 260 30, 320 110, 480 110',
                  compPath: 'M 20 105 C 120 105, 175 42, 215 42 C 255 42, 315 110, 480 110',
                },
              ].map((chartItem) => {
                const hoverData = getHoverValues(chartItem.idx);
                const hoverSvgX = hoverRatio !== null ? 20 + hoverRatio * 460 : 0;
                const selStartX = 20 + selection.startRatio * 460;
                const selEndX = 20 + selection.endRatio * 460;
                const selWidth = selEndX - selStartX;

                return (
                  <div
                    key={chartItem.key}
                    className="bg-gray-50/60 border border-gray-200/80 rounded p-3 flex flex-col relative"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-gray-800">
                        {chartItem.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        ({chartItem.unit})
                      </span>
                    </div>

                    <div className="h-40 relative select-none">
                      <svg
                        className="w-full h-full overflow-visible cursor-crosshair"
                        viewBox="0 0 500 135"
                        preserveAspectRatio="none"
                        onMouseMove={(e) => handleChartMouseMove(e, chartItem.key)}
                        onMouseDown={handleChartMouseDown}
                        onMouseUp={handleChartMouseUp}
                        onMouseLeave={handleChartMouseLeave}
                      >
                        {/* Grid lines */}
                        {[20, 55, 90, 120].map((y) => (
                          <line
                            key={y}
                            x1="20"
                            y1={y}
                            x2="480"
                            y2={y}
                            stroke="#E5E7EB"
                            strokeDasharray="3 3"
                          />
                        ))}

                        {/* Base curve */}
                        <path
                          d={chartItem.basePath}
                          fill="none"
                          stroke="#0084FF"
                          strokeWidth="2"
                        />
                        {/* Compare curve */}
                        <path
                          d={chartItem.compPath}
                          fill="none"
                          stroke="#FA8C16"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />

                        {/* X-axis Ticks */}
                        <text x="50" y="132" fill="#9CA3AF" fontSize="9" fontFamily="monospace">
                          10:12
                        </text>
                        <text x="160" y="132" fill="#9CA3AF" fontSize="9" fontFamily="monospace">
                          10:17
                        </text>
                        <text x="300" y="132" fill="#9CA3AF" fontSize="9" fontFamily="monospace">
                          10:22
                        </text>
                        <text x="440" y="132" fill="#9CA3AF" fontSize="9" fontFamily="monospace">
                          10:27
                        </text>

                        {/* Brush Selection Box (Matching Image 1) */}
                        {selWidth > 5 && (
                          <g>
                            {/* Translucent Highlight Area */}
                            <rect
                              x={selStartX}
                              y={15}
                              width={selWidth}
                              height={105}
                              fill="rgba(0, 145, 255, 0.16)"
                              stroke="#0091FF"
                              strokeWidth="1"
                              strokeDasharray="3 3"
                            />
                            {/* Left Line & Time Text */}
                            <line
                              x1={selStartX}
                              y1={15}
                              x2={selStartX}
                              y2={120}
                              stroke="#0091FF"
                              strokeWidth="1.5"
                            />
                            <text
                              x={selStartX}
                              y={10}
                              fill="#0091FF"
                              fontSize="9"
                              fontWeight="bold"
                              fontFamily="monospace"
                              textAnchor="end"
                            >
                              {selection.startTime}
                            </text>

                            {/* Right Line & Time Text */}
                            <line
                              x1={selEndX}
                              y1={15}
                              x2={selEndX}
                              y2={120}
                              stroke="#0091FF"
                              strokeWidth="1.5"
                            />
                            <text
                              x={selEndX}
                              y={10}
                              fill="#0091FF"
                              fontSize="9"
                              fontWeight="bold"
                              fontFamily="monospace"
                              textAnchor="start"
                            >
                              {selection.endTime}
                            </text>
                          </g>
                        )}

                        {/* Synchronized Hover Crosshair Line (四表联动) */}
                        {hoverRatio !== null && (
                          <g>
                            <line
                              x1={hoverSvgX}
                              y1={15}
                              x2={hoverSvgX}
                              y2={120}
                              stroke="#0084FF"
                              strokeWidth="1.5"
                              strokeDasharray="2 2"
                            />
                            <circle
                              cx={hoverSvgX}
                              cy={60}
                              r="3.5"
                              fill="#0084FF"
                              stroke="white"
                              strokeWidth="1"
                            />
                            <circle
                              cx={hoverSvgX}
                              cy={68}
                              r="3.5"
                              fill="#FA8C16"
                              stroke="white"
                              strokeWidth="1"
                            />
                          </g>
                        )}
                      </svg>

                      {/* Floating Duration Badge & 钻取 Button (Matching Image 1) */}
                      {selWidth > 20 && (
                        <div
                          className="absolute pointer-events-auto"
                          style={{
                            left: `${(selection.startRatio + selection.endRatio) * 50}%`,
                            top: '-8px',
                            transform: 'translateX(-50%)',
                          }}
                        >
                          <div className="bg-[#0091FF] text-white text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1 font-medium whitespace-nowrap">
                            <span>间隔:{selection.durationMinutes}分钟</span>
                          </div>
                        </div>
                      )}

                      {/* 钻取 Action Button on the top right of selection */}
                      {selWidth > 20 && (
                        <div
                          className="absolute pointer-events-auto"
                          style={{
                            left: `${selection.endRatio * 100}%`,
                            top: '8px',
                          }}
                        >
                          <button
                            type="button"
                            onClick={handleDrillDownClick}
                            className="bg-[#0084FF] hover:bg-[#0073E6] text-white text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                            title="下钻至智溯页面新开tab"
                          >
                            <Layers size={10} />
                            <span>钻取</span>
                          </button>
                        </div>
                      )}

                      {/* Synchronized Hover Tooltip Card (四表联动数据展示) */}
                      {hoverRatio !== null && hoverData && (
                        <div
                          className="absolute pointer-events-none z-30 bg-white/95 backdrop-blur-xs border border-gray-200 rounded shadow-lg p-2 text-[10px] space-y-1 transition-all"
                          style={{
                            left: `${Math.min(75, Math.max(10, hoverRatio * 100))}%`,
                            top: '25px',
                          }}
                        >
                          <div className="font-mono text-gray-700 font-semibold border-b border-gray-100 pb-0.5">
                            时点: 10/15 {hoverData.timeStr} vs 10/14 {hoverData.timeStr}
                          </div>
                          <div className="flex items-center justify-between gap-3 text-[#0084FF]">
                            <span>基准值:</span>
                            <span className="font-mono font-bold">
                              {hoverData.baseVal} {hoverData.unit}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-[#D46B08]">
                            <span>对比值:</span>
                            <span className="font-mono font-medium">
                              {hoverData.compVal} {hoverData.unit}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-gray-600 border-t border-gray-100 pt-0.5">
                            <span>波动差值:</span>
                            <span className="font-mono font-bold text-gray-800">
                              {hoverData.diff} ({hoverData.diffP})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: 详细数据对比表 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs">
            <div className="px-4 py-2.5 bg-[#F9FAFC] border-b border-gray-200 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800">
                【{activeNode}】指标周期对比明细表
              </span>
              <span className="text-[10px] text-gray-400">
                共比对 {metricsToRender.length} 项关键指标
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F6F9] text-gray-500 font-medium border-b border-gray-200">
                  <tr>
                    <th className="py-2 px-4">指标项</th>
                    <th className="py-2 px-4 font-mono">基准值</th>
                    <th className="py-2 px-4 font-mono">对比值</th>
                    <th className="py-2 px-4 font-mono">变动绝对量</th>
                    <th className="py-2 px-4 font-mono">波动比率</th>
                    <th className="py-2 px-4">周期趋势评估</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {metricsToRender.map((m) => (
                    <tr
                      key={m.name}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="py-2.5 px-4 font-medium text-gray-900">
                        {m.name}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-gray-900 font-medium">
                        {m.baseValue} {m.baseUnit}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-gray-500">
                        {m.compareValue} {m.compareUnit}
                      </td>
                      <td
                        className={`py-2.5 px-4 font-mono font-medium ${
                          m.trend === 'flat'
                            ? 'text-gray-500'
                            : m.isGood
                            ? 'text-green-600'
                            : 'text-red-500'
                        }`}
                      >
                        {m.diff}
                      </td>
                      <td
                        className={`py-2.5 px-4 font-mono font-bold ${
                          m.trend === 'flat'
                            ? 'text-gray-500'
                            : m.isGood
                            ? 'text-green-600'
                            : 'text-red-500'
                        }`}
                      >
                        {m.diffPercent}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            m.trend === 'flat'
                              ? 'bg-gray-100 text-gray-600'
                              : m.isGood
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-600 border border-red-200'
                          }`}
                        >
                          {m.trend === 'flat'
                            ? '数据持平'
                            : m.isGood
                            ? '性能改善'
                            : '异常偏高'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
