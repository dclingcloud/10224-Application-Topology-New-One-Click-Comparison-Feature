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
  Sparkles,
} from 'lucide-react';

export interface WorkbenchCompareProps {
  nodes?: string[];
  nodeName?: string;
  baseTime?: string;
  compareTime?: string;
  selectedMetrics?: string[];
  initialMode?: 'multi' | 'single';
}

interface CardCurveData {
  curTime: string;
  cmpTime: string;
  greenVal: string;
  cyanVal: string;
  greenY: number;
  cyanY: number;
}

// Helper to compute curve values and Y positions for a given variant and hover ratio
function computeCurveData(
  ratio: number,
  variant: 'switch' | 'switch1'
): CardCurveData {
  const totalMinutes = 60;
  const minuteOffset = Math.round(ratio * totalMinutes);
  const startHour = 9;
  const startMin = 25;
  const curTotalMins = startHour * 60 + startMin + minuteOffset;
  const curH = Math.floor(curTotalMins / 60).toString().padStart(2, '0');
  const curM = (curTotalMins % 60).toString().padStart(2, '0');

  const cmpTotalMins = (startHour - 1) * 60 + startMin + minuteOffset;
  const cmpH = Math.floor(cmpTotalMins / 60).toString().padStart(2, '0');
  const cmpM = (cmpTotalMins % 60).toString().padStart(2, '0');

  if (variant === 'switch') {
    let greenVal = 187.45;
    let cyanVal = 1.06;
    let greenY = 122;
    let cyanY = 175;

    if (Math.abs(ratio - 0.472) < 0.02) {
      greenVal = 187.45;
      cyanVal = 1.06;
      greenY = 122;
      cyanY = 175;
    } else {
      const x = ratio * 1000;
      let gHeight = 0;
      gHeight += Math.exp(-Math.pow((x - 275) / 22, 2)) * 600;
      gHeight += Math.exp(-Math.pow((x - 430) / 28, 2)) * 520;
      gHeight += Math.exp(-Math.pow((x - 472) / 24, 2)) * 187;
      gHeight += Math.exp(-Math.pow((x - 865) / 30, 2)) * 420;
      gHeight += Math.exp(-Math.pow((x - 600) / 22, 2)) * 200;
      gHeight += Math.exp(-Math.pow((x - 645) / 22, 2)) * 200;
      gHeight += Math.exp(-Math.pow((x - 735) / 22, 2)) * 190;
      gHeight += Math.exp(-Math.pow((x - 945) / 20, 2)) * 120;
      if (x < 100) gHeight += (1 - x / 100) * 390;

      greenVal = Math.max(0, Math.round(gHeight * 100) / 100);
      greenY = Math.max(25, 175 - (greenVal / 650) * 150);

      let cHeight = 0;
      cHeight += Math.exp(-Math.pow((x - 98) / 14, 2)) * 220;
      cHeight += Math.exp(-Math.pow((x - 198) / 16, 2)) * 370;
      cHeight += Math.exp(-Math.pow((x - 230) / 18, 2)) * 410;
      cHeight += Math.exp(-Math.pow((x - 635) / 24, 2)) * 175;
      cHeight += Math.exp(-Math.pow((x - 725) / 20, 2)) * 160;
      cHeight += Math.exp(-Math.pow((x - 840) / 25, 2)) * 145;
      cHeight += Math.exp(-Math.pow((x - 930) / 25, 2)) * 260;

      cyanVal = Math.max(1.06, Math.round(cHeight * 100) / 100);
      cyanY = Math.max(25, 175 - (cyanVal / 650) * 150);
    }

    return {
      curTime: `10/27 ${curH}:${curM}`,
      cmpTime: `10/27 ${cmpH}:${cmpM}`,
      greenVal: greenVal.toFixed(2),
      cyanVal: cyanVal.toFixed(2),
      greenY,
      cyanY,
    };
  } else {
    // switch1 variation: baseline rate around 68.80 Kbps, comparison around 0.85 Kbps
    let greenVal = 68.80;
    let cyanVal = 0.85;
    let greenY = 155;
    let cyanY = 175;

    if (Math.abs(ratio - 0.472) < 0.02) {
      greenVal = 68.80;
      cyanVal = 0.85;
      greenY = 155;
      cyanY = 175;
    } else {
      const x = ratio * 1000;
      let gHeight = 0;
      gHeight += Math.exp(-Math.pow((x - 245) / 20, 2)) * 480;
      gHeight += Math.exp(-Math.pow((x - 375) / 22, 2)) * 220;
      gHeight += Math.exp(-Math.pow((x - 515) / 25, 2)) * 380;
      gHeight += Math.exp(-Math.pow((x - 665) / 22, 2)) * 260;
      gHeight += Math.exp(-Math.pow((x - 815) / 26, 2)) * 340;
      if (x < 100) gHeight += (1 - x / 100) * 150;

      greenVal = Math.max(0, Math.round(gHeight * 100) / 100);
      greenY = Math.max(25, 175 - (greenVal / 650) * 150);

      let cHeight = 0;
      cHeight += Math.exp(-Math.pow((x - 145) / 16, 2)) * 260;
      cHeight += Math.exp(-Math.pow((x - 340) / 18, 2)) * 360;
      cHeight += Math.exp(-Math.pow((x - 590) / 20, 2)) * 220;
      cHeight += Math.exp(-Math.pow((x - 770) / 22, 2)) * 280;

      cyanVal = Math.max(0.85, Math.round(cHeight * 100) / 100);
      cyanY = Math.max(25, 175 - (cyanVal / 650) * 150);
    }

    return {
      curTime: `10/27 ${curH}:${curM}`,
      cmpTime: `10/27 ${cmpH}:${cmpM}`,
      greenVal: greenVal.toFixed(2),
      cyanVal: cyanVal.toFixed(2),
      greenY,
      cyanY,
    };
  }
}

// Unified Comparison Card Component (Matching Figure 2/Figure 3 presentation)
interface UnifiedCompareCardProps {
  title: string;
  badgeTime: string;
  objectLabel: string;
  variant?: 'switch' | 'switch1';
  initialHoverRatio?: number;
}

const UnifiedCompareCard: React.FC<UnifiedCompareCardProps> = ({
  title,
  badgeTime,
  objectLabel,
  variant = 'switch',
  initialHoverRatio = 0.472,
}) => {
  const [hoverRatio, setHoverRatio] = useState<number>(initialHoverRatio);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [precision, setPrecision] = useState<string>('分钟');

  const cardData = computeCurveData(hoverRatio, variant);
  const svgCrosshairX = Math.max(45, Math.min(975, hoverRatio * 1000));
  const tooltipLeftPercent = (svgCrosshairX / 1000) * 100;
  const isTooltipOnRight = tooltipLeftPercent < 65;

  // Green & Cyan SVG paths
  const greenPathSwitch = `
    M 45 85
    C 55 90, 65 140, 75 160
    C 85 165, 95 168, 105 158
    C 112 148, 118 142, 125 145
    C 132 148, 138 168, 145 170
    C 152 172, 158 152, 165 150
    C 172 148, 180 170, 195 173
    L 255 173
    C 265 173, 270 45, 275 32
    C 280 42, 288 155, 298 165
    C 305 172, 315 173, 335 173
    C 345 173, 350 148, 358 145
    C 365 142, 375 168, 388 173
    L 402 173
    C 412 173, 422 65, 428 52
    C 435 62, 442 108, 452 118
    C 462 122, 472 122, 480 140
    C 488 160, 492 173, 510 173
    L 575 173
    C 585 173, 592 132, 598 130
    C 605 128, 612 165, 620 173
    C 628 173, 638 135, 645 130
    C 652 125, 660 165, 672 173
    L 715 173
    C 725 173, 730 135, 738 132
    C 745 130, 752 165, 760 168
    C 770 172, 780 152, 795 155
    C 805 158, 815 173, 835 173
    C 848 173, 858 85, 865 75
    C 872 82, 882 165, 895 173
    L 925 173
    C 935 173, 942 150, 948 148
    C 955 146, 965 168, 980 173
  `;

  const cyanPathSwitch = `
    M 45 175
    L 85 175
    C 90 175, 95 128, 100 125
    C 105 122, 110 168, 115 175
    L 175 175
    C 185 175, 192 98, 198 88
    C 205 92, 210 165, 215 173
    C 220 173, 226 88, 232 78
    C 238 82, 245 168, 252 175
    L 590 175
    C 605 175, 625 138, 635 135
    C 645 132, 655 160, 665 162
    C 675 164, 688 158, 698 158
    C 710 158, 720 142, 728 138
    C 735 135, 742 168, 750 175
    L 810 175
    C 825 175, 835 145, 842 142
    C 850 140, 865 158, 878 155
    C 890 152, 915 120, 928 115
    C 940 110, 952 160, 962 165
    C 970 168, 975 162, 980 160
  `;

  const greenPathSwitch1 = `
    M 45 140
    C 65 145, 80 155, 95 160
    C 110 165, 125 170, 140 170
    L 210 170
    C 225 170, 235 60, 245 45
    C 255 55, 265 150, 280 165
    C 295 172, 320 173, 340 173
    C 355 173, 365 130, 375 125
    C 385 120, 395 165, 410 173
    L 480 173
    C 495 173, 505 80, 515 70
    C 525 80, 535 155, 550 170
    L 630 170
    C 645 170, 655 110, 665 105
    C 675 115, 685 165, 700 173
    L 780 173
    C 795 173, 805 90, 815 80
    C 825 90, 835 160, 850 173
    L 980 173
  `;

  const cyanPathSwitch1 = `
    M 45 175
    L 120 175
    C 130 175, 138 120, 145 115
    C 152 120, 160 168, 170 175
    L 310 175
    C 320 175, 330 95, 340 90
    C 350 95, 360 165, 370 175
    L 560 175
    C 570 175, 580 130, 590 125
    C 600 130, 610 168, 620 175
    L 740 175
    C 750 175, 760 115, 770 110
    C 780 115, 790 165, 800 175
    L 980 175
  `;

  const greenD = variant === 'switch1' ? greenPathSwitch1 : greenPathSwitch;
  const cyanD = variant === 'switch1' ? cyanPathSwitch1 : cyanPathSwitch;

  return (
    <div
      className="bg-white border border-gray-200 rounded-md p-3.5 shadow-2xs flex flex-col"
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-gray-800">{title}</span>
          <span className="font-mono text-[11px] text-[#0084FF] bg-[#E6F4FF] border border-[#BAE0FF] px-2 py-0.5 rounded">
            {badgeTime || '2026-10-27 09:25 - 2026-10-27 10:25'}
          </span>
          <button
            type="button"
            onClick={() => {
              setHoverRatio(0.472);
              setIsHovered(false);
            }}
            className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#0084FF] cursor-pointer transition-colors"
          >
            <RotateCw size={11} />
            <span>重置</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          {/* 周期对比 pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F0F2F5] text-gray-700 rounded text-xs font-medium cursor-pointer hover:bg-gray-200 transition-colors">
            <span className="w-3 h-3 rounded-full border border-gray-500 relative overflow-hidden inline-block shrink-0">
              <span className="absolute left-0 top-0 bottom-0 w-1/2 bg-gray-500" />
            </span>
            <span>周期对比</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-gray-500">数据精度</span>
            <div className="relative">
              <select
                value={precision}
                onChange={(e) => setPrecision(e.target.value)}
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
            <input
              type="checkbox"
              className="w-3 h-3 rounded border-gray-300 text-[#0084FF]"
            />
            <span>刷新频率</span>
          </label>

          <Clock
            size={13}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          />
          <MoreHorizontal
            size={13}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          />
          <Maximize2
            size={13}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Chart Area */}
      <div
        className="relative w-full h-[220px] mt-2 select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = Math.max(
            0.045,
            Math.min(0.975, (e.clientX - rect.left) / rect.width)
          );
          setHoverRatio(ratio);
          setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Metric Unit Label Top Left */}
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          速率 (Kbps)
        </span>

        {/* SVG Chart */}
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
        >
          {/* Grid Lines: 650, 520, 390, 260, 130, 0 */}
          {[
            { y: 25, val: '650' },
            { y: 55, val: '520' },
            { y: 85, val: '390' },
            { y: 115, val: '260' },
            { y: 145, val: '130' },
            { y: 175, val: '0' },
          ].map((row) => (
            <g key={row.y}>
              <line
                x1="45"
                y1={row.y}
                x2="980"
                y2={row.y}
                stroke={row.y === 175 ? '#D1D5DB' : '#E5E7EB'}
                strokeDasharray={row.y === 175 ? undefined : '3 3'}
              />
              <text
                x="38"
                y={row.y + 3}
                fill="#9CA3AF"
                fontSize="9.5"
                textAnchor="end"
                fontFamily="monospace"
              >
                {row.val}
              </text>
            </g>
          ))}

          {/* X-Axis Time Ticks: 09:30, 09:40, 09:50, 10:00, 10:10, 10:20 */}
          {[
            { x: 120, label: '09:30' },
            { x: 280, label: '09:40' },
            { x: 440, label: '09:50' },
            { x: 600, label: '10:00' },
            { x: 760, label: '10:10' },
            { x: 920, label: '10:20' },
          ].map((t) => (
            <text
              key={t.label}
              x={t.x}
              y="190"
              fill="#9CA3AF"
              fontSize="9.5"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {t.label}
            </text>
          ))}

          {/* Curve 1: Green Current Time (当前时间) */}
          <path d={greenD} fill="none" stroke="#52C41A" strokeWidth="1.8" />

          {/* Curve 2: Cyan Comparison Time (对比时间) */}
          <path d={cyanD} fill="none" stroke="#13C2C2" strokeWidth="1.8" />

          {/* Crosshair and Indicators (Visible only on hover) */}
          {isHovered && (
            <g>
              {/* Vertical Dashed Line */}
              <line
                x1={svgCrosshairX}
                y1="25"
                x2={svgCrosshairX}
                y2="175"
                stroke="#BFBFBF"
                strokeDasharray="3 3"
              />

              {/* Top Anchor Pin (Green ring with horizontal wings) */}
              <g transform={`translate(${svgCrosshairX}, 18)`}>
                <line
                  x1="-8"
                  y1="0"
                  x2="8"
                  y2="0"
                  stroke="#52C41A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="4.5"
                  fill="white"
                  stroke="#52C41A"
                  strokeWidth="2"
                />
              </g>

              {/* Active Point on Green Curve */}
              <circle
                cx={svgCrosshairX}
                cy={cardData.greenY}
                r="3.5"
                fill="#52C41A"
                stroke="white"
                strokeWidth="1.5"
              />

              {/* Active Point on Cyan Curve */}
              <circle
                cx={svgCrosshairX}
                cy={cardData.cyanY}
                r="3.5"
                fill="#13C2C2"
                stroke="white"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip Box (Hides immediately on mouse leave) */}
        {isHovered && (
          <div
            className="absolute z-30 bg-white border border-gray-100 rounded-lg shadow-xl p-3 text-xs pointer-events-none select-none transition-all duration-75"
            style={{
              left: isTooltipOnRight
                ? `calc(${tooltipLeftPercent}% + 12px)`
                : undefined,
              right: !isTooltipOnRight
                ? `calc(${100 - tooltipLeftPercent}% + 12px)`
                : undefined,
              top: '12px',
              width: '295px',
            }}
          >
            {/* Row 1: Current Time Header */}
            <div className="flex items-center justify-between text-gray-500 font-mono text-[11px] mb-1">
              <span>{cardData.curTime}</span>
              <span>速率 (Kbps)</span>
            </div>

            {/* Row 2: Current Time Value */}
            <div className="flex items-center justify-between text-gray-800 font-medium text-xs mb-2.5">
              <div className="flex items-center gap-1.5 truncate pr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#52C41A] shrink-0" />
                <span className="truncate">{objectLabel}(当前时间)</span>
              </div>
              <span className="font-mono font-bold shrink-0">
                {cardData.greenVal} Kbps
              </span>
            </div>

            {/* Row 3: Comparison Time Header */}
            <div className="flex items-center justify-between text-gray-500 font-mono text-[11px] mb-1">
              <span>{cardData.cmpTime}</span>
              <span>速率 (Kbps)</span>
            </div>

            {/* Row 4: Comparison Time Value */}
            <div className="flex items-center justify-between text-gray-800 font-medium text-xs">
              <div className="flex items-center gap-1.5 truncate pr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#13C2C2] shrink-0" />
                <span className="truncate">{objectLabel}(对比时间)</span>
              </div>
              <span className="font-mono font-bold shrink-0">
                {cardData.cyanVal} Kbps
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const WorkbenchCompareView: React.FC<WorkbenchCompareProps> = ({
  nodes = ['交换机', '交换机1'],
  nodeName = '交换机',
  baseTime = '2026-10-25 19:39 ~ 2026-10-25 20:39',
  compareTime = '2026-10-24 19:39 ~ 2026-10-24 20:39',
  selectedMetrics,
  initialMode,
}) => {
  const displayNodes =
    nodes && nodes.length > 0
      ? nodes.length === 1
        ? [nodes[0], '交换机1']
        : nodes
      : ['交换机', '交换机1'];

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
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({
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

  // Precisions
  const [topPrecision, setTopPrecision] = useState('分钟');

  // Format time range for badges
  const formatBadgeTime = (t: string) => {
    if (!t) return '2026-10-25 19:39 - 2026-10-25 20:39';
    return t.replace(/\s*~\s*/g, ' - ');
  };

  const baseBadgeTime = formatBadgeTime(baseTime);
  const compareBadgeTime = formatBadgeTime(compareTime);

  // Pre-configured node datasets matching 速率-only comparison
  const nodeCompareDataset: Record<
    string,
    {
      name: string;
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
      }[];
    }
  > = {
    交换机: {
      name: '交换机',
      metrics: [
        {
          name: '速率',
          baseValue: '187.45',
          baseUnit: 'Kbps',
          compareValue: '108.40',
          compareUnit: 'Kbps',
          diff: '+79.05 Kbps',
          diffPercent: '+72.92%',
          trend: 'up',
          isGood: true,
        },
      ],
    },
    交换机1: {
      name: '交换机1',
      metrics: [
        {
          name: '速率',
          baseValue: '68.80',
          baseUnit: 'Kbps',
          compareValue: '45.20',
          compareUnit: 'Kbps',
          diff: '+23.60 Kbps',
          diffPercent: '+52.21%',
          trend: 'up',
          isGood: true,
        },
      ],
    },
    交换机2: {
      name: '交换机2',
      metrics: [
        {
          name: '速率',
          baseValue: '68.80',
          baseUnit: 'Kbps',
          compareValue: '45.20',
          compareUnit: 'Kbps',
          diff: '+23.60 Kbps',
          diffPercent: '+52.21%',
          trend: 'up',
          isGood: true,
        },
      ],
    },
  };

  // Renders conclusion with ONLY the single metric "速率"
  const renderNodeConclusion = (targetNode: string) => {
    const data =
      nodeCompareDataset[targetNode] ||
      nodeCompareDataset[targetNode.replace(/\d+$/, '')] ||
      nodeCompareDataset['交换机1'] ||
      nodeCompareDataset['交换机'];

    const rate = data.metrics.find((m) => m.name === '速率') || data.metrics[0];

    const formatDiffText = (m: typeof rate) => {
      if (m.trend === 'flat' || m.diffPercent === '0.00%') return '数据持平';
      const action = m.trend === 'down' ? '下降' : '上升';
      const cleanDiff = m.diff.replace(/^[+-]/, '');
      return `${action}${cleanDiff}，变化率是 ${m.diffPercent}`;
    };

    return (
      <span>
        <span className="font-semibold text-gray-900">{targetNode}</span>{' '}
        在对比时间（{compareBadgeTime}）内速率是{' '}
        <span className="font-mono font-medium text-gray-900">
          {rate.compareValue} {rate.compareUnit}
        </span>
        ，当前时间（{baseBadgeTime}）内速率是{' '}
        <span className="font-mono font-medium text-gray-900">
          {rate.baseValue} {rate.baseUnit}
        </span>
        ，相较对比时段{' '}
        <span
          className={`font-semibold ${
            rate.trend === 'down' ? 'text-[#52C41A]' : 'text-[#0084FF]'
          }`}
        >
          {formatDiffText(rate)}
        </span>
        。
      </span>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#F4F6F9] select-none">
      {/* 1. Left Tree Sidebar */}
      <div className="w-56 border-r border-gray-200 bg-white flex flex-col shrink-0 text-xs select-none">
        {/* Top Tab Bar: 自定义视图 | 场景报表 */}
        <div className="flex border-b border-gray-200 text-xs font-medium">
          <button
            type="button"
            onClick={() => setTreeTab('custom')}
            className={`flex-1 py-2 text-center transition-colors cursor-pointer relative ${
              treeTab === 'custom'
                ? 'text-[#0084FF] font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            自定义视图
            {treeTab === 'custom' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0084FF]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setTreeTab('scenario')}
            className={`flex-1 py-2 text-center transition-colors cursor-pointer relative ${
              treeTab === 'scenario'
                ? 'text-[#0084FF] font-semibold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            场景报表
            {treeTab === 'scenario' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0084FF]" />
            )}
          </button>
        </div>

        {/* Search & New View Button */}
        <div className="p-2 space-y-2 border-b border-gray-100">
          <div className="relative">
            <Search
              size={12}
              className="absolute left-2.5 top-2 text-gray-400"
            />
            <input
              type="text"
              placeholder="过滤..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-7 pr-2 py-1 text-xs border border-gray-200 rounded focus:outline-hidden focus:border-[#0084FF] placeholder-gray-400"
            />
          </div>

          <button
            type="button"
            className="w-full py-1 border border-gray-200 hover:border-gray-300 rounded text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer bg-white hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <PlusSquare size={13} className="text-gray-500" />
            <span>新建视图</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="px-3 py-1.5 flex items-center justify-between text-gray-500 border-b border-gray-100 bg-[#FAFAFA]">
          <span className="font-semibold text-gray-800 text-[11px]">
            自定义视图
          </span>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock size={12} className="hover:text-gray-600 cursor-pointer" />
            <Shield size={12} className="hover:text-gray-600 cursor-pointer" />
            <FolderPlus
              size={12}
              className="hover:text-gray-600 cursor-pointer"
            />
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
              {expandedFolders.province ? (
                <ChevronDown size={11} />
              ) : (
                <ChevronRight size={11} />
              )}
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
              {expandedFolders.dscp ? (
                <ChevronDown size={11} />
              ) : (
                <ChevronRight size={11} />
              )}
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
              {expandedFolders.drilldown ? (
                <ChevronDown size={11} />
              ) : (
                <ChevronRight size={11} />
              )}
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
              {expandedFolders.rnd ? (
                <ChevronDown size={11} />
              ) : (
                <ChevronRight size={11} />
              )}
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
              {expandedFolders.ai ? (
                <ChevronDown size={11} />
              ) : (
                <ChevronRight size={11} />
              )}
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
              {expandedFolders.mouyi ? (
                <ChevronDown size={11} />
              ) : (
                <ChevronRight size={11} />
              )}
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
                  {expandedFolders.periodic ? (
                    <ChevronDown size={11} />
                  ) : (
                    <ChevronRight size={11} />
                  )}
                  {expandedFolders.periodic ? (
                    <FolderOpen size={13} className="text-[#0084FF] shrink-0" />
                  ) : (
                    <Folder size={13} className="text-[#0084FF] shrink-0" />
                  )}
                  <span>周期对比</span>
                </div>

                {expandedFolders.periodic && (
                  <div className="pl-5 py-0.5 space-y-0.5">
                    {/* Item 1: 多对象对比 */}
                    <div
                      onClick={() => setViewMode('multi')}
                      className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                        viewMode === 'multi'
                          ? 'bg-[#E6F4FF] text-[#0084FF] font-medium border border-[#BAE0FF]/50 shadow-2xs'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText
                          size={12}
                          className="text-[#0084FF] shrink-0"
                        />
                        <span className="truncate">多对象对比</span>
                      </div>
                      {viewMode === 'multi' && (
                        <MoreHorizontal
                          size={13}
                          className="text-gray-400 hover:text-gray-700 shrink-0"
                        />
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
                        <FileText
                          size={12}
                          className="text-[#0084FF] shrink-0"
                        />
                        <span className="truncate">周期对比</span>
                      </div>
                      {viewMode === 'single' && (
                        <MoreHorizontal
                          size={13}
                          className="text-gray-400 hover:text-gray-700 shrink-0"
                        />
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
              {expandedFolders.ningbo ? (
                <ChevronDown size={11} />
              ) : (
                <ChevronRight size={11} />
              )}
              <Folder size={13} className="text-[#0084FF] shrink-0" />
              <span>宁波联通</span>
            </div>
            {expandedFolders.ningbo && (
              <div className="pl-6 py-0.5">
                <div className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-gray-100 rounded cursor-pointer text-gray-600">
                  <FileText size={12} className="text-[#0084FF] shrink-0" />
                  <span>宁波联通测试</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Workbench Periodic Compare Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F4F6F9]">
        {/* Top Filter and View Bar */}
        <div className="h-10 bg-white border-b border-gray-200 px-4 flex items-center justify-between text-xs shrink-0 select-none shadow-2xs">
          {/* Left Controls */}
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1.5">
              <span>数据精度</span>
              <div className="relative">
                <select
                  value={topPrecision}
                  onChange={(e) => setTopPrecision(e.target.value)}
                  className="appearance-none h-6 pl-2 pr-6 border border-gray-300 rounded bg-white text-gray-700 text-xs cursor-pointer focus:outline-hidden"
                >
                  <option value="分钟">分钟</option>
                  <option value="5分钟">5分钟</option>
                  <option value="小时">小时</option>
                </select>
                <ChevronDown
                  size={11}
                  className="absolute right-1.5 top-2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-gray-300 text-[#0084FF]"
              />
              <span>刷新频率</span>
            </label>

            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3.5 h-[2px] bg-[#0084FF] inline-block" />
              <span>基线</span>
            </div>
          </div>

          {/* Center Title */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 text-sm">
              {viewMode === 'multi' ? '多对象对比' : '周期对比'}
            </span>
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
          {/* MODE 1: MULTI-OBJECT COMPARISON (图1: 上下两个卡片: 交换机 & 交换机1) */}
          {/* ======================================================== */}
          {viewMode === 'multi' ? (
            <div className="space-y-3.5">
              {/* 对比分析结论 (指标仅为速率对比，去除其他指标) */}
              <div className="w-full bg-[#F4F9FF] border border-[#BAE0FF] rounded-lg p-3 text-xs leading-relaxed text-gray-700 shadow-2xs flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#0084FF] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Sparkles size={12} />
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="text-[11px] font-bold text-[#0084FF] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span>周期对比分析结论</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-gray-700 leading-relaxed">
                    {displayNodes.map((n) => (
                      <div key={n} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0084FF] shrink-0 mt-1.5" />
                        <div className="flex-1">{renderNodeConclusion(n)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 上下两个卡片，卡片样式与呈现查看选择一个对比节点后展示样式 (图2样式) */}
              {/* Top Card: 交换机 */}
              <UnifiedCompareCard
                title={displayNodes[0] || '交换机'}
                badgeTime={baseBadgeTime || '2026-10-27 09:25 - 2026-10-27 10:25'}
                objectLabel="应用(禅道公网)_Interface 1(DataCenter-SH)"
                variant="switch"
              />

              {/* Bottom Card: 交换机1 */}
              <UnifiedCompareCard
                title={displayNodes[1] || '交换机1'}
                badgeTime={baseBadgeTime || '2026-10-27 09:25 - 2026-10-27 10:25'}
                objectLabel="应用(HTTPS_l7)_Interface 1(DataCenter-SH)"
                variant="switch1"
              />
            </div>
          ) : (
            /* ======================================================== */
            /* MODE 2: SINGLE NODE PERIODIC COMPARE (单节点周期对比样式) */
            /* ======================================================== */
            <div className="space-y-3.5">
              {/* 对比分析结论 (指标仅为速率对比，去除其他指标) */}
              <div className="w-full bg-[#F4F9FF] border border-[#BAE0FF] rounded-lg p-3 text-xs leading-relaxed text-gray-700 shadow-2xs flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#0084FF] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Sparkles size={12} />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-[#0084FF] mb-1 flex items-center gap-1.5">
                    <span>周期对比分析结论</span>
                  </div>
                  <div className="text-gray-700 leading-relaxed">
                    {renderNodeConclusion(nodeName || '交换机')}
                  </div>
                </div>
              </div>

              {/* Single Node Card */}
              <UnifiedCompareCard
                title={nodeName || '交换机'}
                badgeTime={baseBadgeTime || '2026-10-27 09:25 - 2026-10-27 10:25'}
                objectLabel={
                  nodeName === '交换机1'
                    ? '应用(HTTPS_l7)_Interface 1(DataCenter-SH)'
                    : '应用(禅道公网)_Interface 1(DataCenter-SH)'
                }
                variant={nodeName === '交换机1' ? 'switch1' : 'switch'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
