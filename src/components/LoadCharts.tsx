import React from 'react';
import { LegendPill } from './MetricCharts';

// Chart 1: 速率曲线图
export const SpeedTrendChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h4 className="text-xs font-semibold text-gray-800">速率</h4>
        <div className="flex items-center gap-3 flex-wrap">
          <LegendPill color="#EB2F96" label="速率" />
          <LegendPill color="#9E8A42" label="上周同期速率" />
          <LegendPill color="#13C2C2" label="速率基线" />
          <LegendPill color="#52734D" label="峰值速率" />
          <LegendPill color="#BFBFBF" label="谷值速率" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          速率(Mbps)
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pinkSpeedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EB2F96" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#EB2F96" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid lines (0, 5, 10, 15) */}
          {[
            { val: 15, y: 25 },
            { val: 10, y: 60 },
            { val: 5, y: 95 },
            { val: 0, y: 130 },
          ].map((item) => (
            <g key={item.val}>
              <line
                x1="26"
                y1={item.y}
                x2="480"
                y2={item.y}
                stroke={item.val === 0 ? '#D1D5DB' : '#F0F0F0'}
                strokeDasharray={item.val === 0 ? undefined : '3 3'}
              />
              <text
                x="20"
                y={item.y + 3}
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="end"
                fontFamily="monospace"
              >
                {item.val}
              </text>
            </g>
          ))}

          {/* Vertical grid lines */}
          {[95, 175, 255, 335, 415].map((x) => (
            <line
              key={x}
              x1={x}
              y1={25}
              x2={x}
              y2={130}
              stroke="#F5F5F5"
              strokeDasharray="3 3"
            />
          ))}

          {/* Pink Area Spike around 09:47 (~9.5 Mbps) */}
          <path
            d="M 125 130 
               L 132 130 
               L 137 62 
               L 142 130 
               Z"
            fill="url(#pinkSpeedGrad)"
          />
          {/* Small Pink hump at 10:07 and 10:17 */}
          <path
            d="M 160 130 L 165 125 L 170 130 Z"
            fill="url(#pinkSpeedGrad)"
          />
          <path
            d="M 285 130 L 290 124 L 295 130 Z"
            fill="url(#pinkSpeedGrad)"
          />

          {/* Khaki line (上周同期速率) with spikes */}
          <path
            d="M 26 130
               L 85 130
               L 95 86
               L 105 130
               L 185 130
               L 195 122
               L 205 128
               L 215 130
               L 330 130
               L 340 98
               L 350 130
               L 360 130
               L 370 95
               L 380 130
               L 415 127
               L 425 83
               L 435 130
               L 480 130"
            fill="none"
            stroke="#9E8A42"
            strokeWidth="1.5"
          />

          {/* Cyan Baseline */}
          <line
            x1="26"
            y1="130"
            x2="480"
            y2="130"
            stroke="#13C2C2"
            strokeWidth="1.5"
          />

          {/* X-Axis Ticks */}
          {[
            { label: '09:40', x: 95 },
            { label: '09:50', x: 175 },
            { label: '10:00', x: 255 },
            { label: '10:10', x: 335 },
            { label: '10:20', x: 415 },
            { label: '10:30', x: 475 },
          ].map((tick) => (
            <text
              key={tick.label}
              x={tick.x}
              y="148"
              fill={tick.label === '10:00' ? '#374151' : '#9CA3AF'}
              fontWeight={tick.label === '10:00' ? 'bold' : 'normal'}
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {tick.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

// Chart 2: 实时流量曲线图
export const RealtimeTrafficChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">
          实时流量
        </h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#52C41A" label="流量" />
          <LegendPill color="#1890FF" label="上周同期流量" />
          <LegendPill color="#F5222D" label="流量基线" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          数据流量(MB)
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="greenTrafficGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#52C41A" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#52C41A" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Grid lines (0, 20, 40, 60, 80) */}
          {[
            { val: 80, y: 25 },
            { val: 60, y: 51 },
            { val: 40, y: 77 },
            { val: 20, y: 103 },
            { val: 0, y: 130 },
          ].map((item) => (
            <g key={item.val}>
              <line
                x1="26"
                y1={item.y}
                x2="480"
                y2={item.y}
                stroke={item.val === 0 ? '#D1D5DB' : '#F0F0F0'}
                strokeDasharray={item.val === 0 ? undefined : '3 3'}
              />
              <text
                x="20"
                y={item.y + 3}
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="end"
                fontFamily="monospace"
              >
                {item.val}
              </text>
            </g>
          ))}

          {/* Vertical grid lines */}
          {[95, 175, 255, 335, 415].map((x) => (
            <line
              key={x}
              x1={x}
              y1={25}
              x2={x}
              y2={130}
              stroke="#F5F5F5"
              strokeDasharray="3 3"
            />
          ))}

          {/* Green Area Peak (流量) around 09:48 ~70 MB */}
          <path
            d="M 130 130 
               L 137 38 
               L 144 130 
               Z"
            fill="url(#greenTrafficGrad)"
          />
          {/* Smaller Green humps at 09:54 and 10:08 */}
          <path
            d="M 155 130 L 165 118 L 175 130 Z"
            fill="url(#greenTrafficGrad)"
          />
          <path
            d="M 295 130 L 302 122 L 310 130 Z"
            fill="url(#greenTrafficGrad)"
          />

          {/* Blue line (上周同期流量) spikes */}
          <path
            d="M 26 130
               L 70 128
               L 80 130
               L 90 75
               L 100 130
               L 205 130
               L 215 116
               L 225 125
               L 235 130
               L 330 130
               L 345 88
               L 360 130
               L 370 126
               L 377 82
               L 387 130
               L 435 126
               L 445 68
               L 455 130
               L 480 130"
            fill="none"
            stroke="#1890FF"
            strokeWidth="1.5"
          />

          {/* Coral Baseline */}
          <line
            x1="26"
            y1="130"
            x2="480"
            y2="130"
            stroke="#F5222D"
            strokeWidth="1.5"
          />

          {/* X-Axis Ticks */}
          {[
            { label: '09:40', x: 95 },
            { label: '09:50', x: 175 },
            { label: '10:00', x: 255 },
            { label: '10:10', x: 335 },
            { label: '10:20', x: 415 },
            { label: '10:30', x: 475 },
          ].map((tick) => (
            <text
              key={tick.label}
              x={tick.x}
              y="148"
              fill={tick.label === '10:00' ? '#374151' : '#9CA3AF'}
              fontWeight={tick.label === '10:00' ? 'bold' : 'normal'}
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {tick.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

// Chart 3: 会话数曲线图
export const SessionCountChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">会话数</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#FA8C16" label="会话数" />
          <LegendPill color="#8C8C8C" label="请求量" />
          <LegendPill color="#BFBFBF" label="用户数" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          数量
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="orangeSessionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FA8C16" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FA8C16" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Grid lines (0, 50, 100, 150, 200) */}
          {[
            { val: 200, y: 25 },
            { val: 150, y: 51 },
            { val: 100, y: 77 },
            { val: 50, y: 103 },
            { val: 0, y: 130 },
          ].map((item) => (
            <g key={item.val}>
              <line
                x1="26"
                y1={item.y}
                x2="480"
                y2={item.y}
                stroke={item.val === 0 ? '#D1D5DB' : '#F0F0F0'}
                strokeDasharray={item.val === 0 ? undefined : '3 3'}
              />
              <text
                x="20"
                y={item.y + 3}
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="end"
                fontFamily="monospace"
              >
                {item.val}
              </text>
            </g>
          ))}

          {/* Vertical grid lines */}
          {[95, 175, 255, 335, 415].map((x) => (
            <line
              key={x}
              x1={x}
              y1={25}
              x2={x}
              y2={130}
              stroke="#F5F5F5"
              strokeDasharray="3 3"
            />
          ))}

          {/* Orange Filled Profile with Spikes */}
          <path
            d="M 26 130
               L 26 103
               L 45 101
               L 65 98
               L 80 102
               L 100 102
               L 106 50
               L 112 103
               L 118 64
               L 125 96
               L 140 106
               L 148 100
               L 155 100
               L 165 82
               L 180 82
               L 190 108
               L 205 116
               L 218 97
               L 225 104
               L 242 104
               L 248 50
               L 254 104
               L 262 100
               L 270 104
               L 282 90
               L 290 102
               L 305 103
               L 320 104
               L 345 104
               L 352 98
               L 358 50
               L 364 103
               L 380 103
               L 395 104
               L 410 108
               L 420 98
               L 430 108
               L 440 101
               L 455 104
               L 480 104
               L 480 130
               Z"
            fill="url(#orangeSessionGrad)"
          />

          {/* X-Axis Ticks */}
          {[
            { label: '09:40', x: 95 },
            { label: '09:50', x: 175 },
            { label: '10:00', x: 255 },
            { label: '10:10', x: 335 },
            { label: '10:20', x: 415 },
            { label: '10:30', x: 475 },
          ].map((tick) => (
            <text
              key={tick.label}
              x={tick.x}
              y="148"
              fill={tick.label === '10:00' ? '#374151' : '#9CA3AF'}
              fontWeight={tick.label === '10:00' ? 'bold' : 'normal'}
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {tick.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

// Chart 4: 数据包量和流量对比图 (Trend representation)
export const PacketTrafficContrastChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">
          数据包量和流量对比
        </h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#FF7875" label="数据包量" />
          <LegendPill color="#8C8C8C" label="流量" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          数据包量(K)
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          {/* Grid lines (0, 20, 40, 60, 80, 100) */}
          {[
            { val: 100, y: 25 },
            { val: 80, y: 46 },
            { val: 60, y: 67 },
            { val: 40, y: 88 },
            { val: 20, y: 109 },
            { val: 0, y: 130 },
          ].map((item) => (
            <g key={item.val}>
              <line
                x1="26"
                y1={item.y}
                x2="480"
                y2={item.y}
                stroke={item.val === 0 ? '#D1D5DB' : '#F0F0F0'}
                strokeDasharray={item.val === 0 ? undefined : '3 3'}
              />
              <text
                x="20"
                y={item.y + 3}
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="end"
                fontFamily="monospace"
              >
                {item.val}
              </text>
            </g>
          ))}

          {/* Vertical grid lines */}
          {[95, 175, 255, 335, 415].map((x) => (
            <line
              key={x}
              x1={x}
              y1={25}
              x2={x}
              y2={130}
              stroke="#F5F5F5"
              strokeDasharray="3 3"
            />
          ))}

          {/* Small baseline indicators for packet counts */}
          {Array.from({ length: 45 }).map((_, i) => {
            const x = 30 + i * 10;
            return (
              <line
                key={i}
                x1={x}
                y1={130}
                x2={x}
                y2={128}
                stroke="#FF7875"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Prominent High Column/Peak at 09:48 (~94 K) */}
          <rect
            x="137"
            y="32"
            width="8"
            height="98"
            fill="#FF7875"
            rx="1"
          />

          {/* Secondary Peaks at 09:54 (~15K) and 10:08 (~9K) */}
          <rect
            x="165"
            y="114"
            width="6"
            height="16"
            fill="#FF7875"
            rx="1"
          />
          <rect
            x="173"
            y="124"
            width="4"
            height="6"
            fill="#FF7875"
            rx="1"
          />
          <rect
            x="302"
            y="121"
            width="6"
            height="9"
            fill="#FF7875"
            rx="1"
          />

          {/* Smooth Trend line connecting peaks */}
          <path
            d="M 26 129
               L 130 129
               C 134 129, 137 32, 141 32
               C 145 32, 150 129, 160 129
               L 168 114
               L 176 129
               L 295 129
               L 305 121
               L 315 129
               L 480 129"
            fill="none"
            stroke="#FF4D4F"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />

          {/* X-Axis Ticks */}
          {[
            { label: '09:40', x: 95 },
            { label: '09:50', x: 175 },
            { label: '10:00', x: 255 },
            { label: '10:10', x: 335 },
            { label: '10:20', x: 415 },
            { label: '10:30', x: 475 },
          ].map((tick) => (
            <text
              key={tick.label}
              x={tick.x}
              y="148"
              fill={tick.label === '10:00' ? '#374151' : '#9CA3AF'}
              fontWeight={tick.label === '10:00' ? 'bold' : 'normal'}
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
            >
              {tick.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
