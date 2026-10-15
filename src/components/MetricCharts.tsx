import React from 'react';

// Common Legend Pill Component
export const LegendPill: React.FC<{
  color: string;
  label: string;
  shape?: 'rect' | 'line';
}> = ({ color, label, shape = 'rect' }) => (
  <div className="flex items-center gap-1.5 text-[11px] text-gray-700">
    {shape === 'line' ? (
      <span
        className="w-3.5 h-[2px] inline-block shrink-0"
        style={{ backgroundColor: color }}
      />
    ) : (
      <span
        className="w-3.5 h-2 rounded-[2px] inline-block shrink-0"
        style={{ backgroundColor: color }}
      />
    )}
    <span>{label}</span>
  </div>
);

// ----------------------------------------------------
// Existing Chart 1: 网络延时
// ----------------------------------------------------
export const NetworkDelayChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">网络延时</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#1890FF" label="网络时延-客户端" />
          <LegendPill color="#FA8C16" label="网络时延-服务器" />
          <LegendPill color="#52C41A" label="响应时间-服务器" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          (us)
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          <line
            x1="20"
            y1="30"
            x2="480"
            y2="30"
            stroke="#E5E7EB"
            strokeDasharray="3 3"
          />
          <line x1="20" y1="130" x2="480" y2="130" stroke="#D1D5DB" />

          <text
            x="12"
            y="34"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="end"
            fontFamily="monospace"
          >
            1
          </text>
          <text
            x="12"
            y="133"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="end"
            fontFamily="monospace"
          >
            0
          </text>

          <path
            d="M 20 130 L 150 130 L 170 128 L 190 130 L 480 130"
            fill="none"
            stroke="#52C41A"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />

          <text
            x="115"
            y="148"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10:15
          </text>
          <text
            x="250"
            y="148"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10:20
          </text>
          <text
            x="385"
            y="148"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10:25
          </text>
        </svg>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Existing Chart 2: 网络性能
// ----------------------------------------------------
export const NetworkPerformanceChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">网络性能</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#1890FF" label="重传率-客户端" />
          <LegendPill color="#52C41A" label="重传率-服务器" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          (%)
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="bluePerfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1890FF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1890FF" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="greenPerfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#52C41A" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#52C41A" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {[
            { val: 50, y: 25 },
            { val: 40, y: 46 },
            { val: 30, y: 67 },
            { val: 20, y: 88 },
            { val: 10, y: 109 },
            { val: 0, y: 130 },
          ].map((item) => (
            <g key={item.val}>
              <line
                x1="22"
                y1={item.y}
                x2="480"
                y2={item.y}
                stroke={item.val === 0 ? '#D1D5DB' : '#F0F0F0'}
                strokeDasharray={item.val === 0 ? undefined : '3 3'}
              />
              <text
                x="16"
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

          {/* Green wave */}
          <path
            d="M 22 75 
               C 35 30, 55 25, 70 40 
               C 85 55, 95 130, 115 130 
               C 135 130, 145 60, 160 55 
               C 180 50, 210 50, 230 60
               C 240 40, 255 25, 270 40
               C 285 55, 295 130, 315 130
               C 330 130, 340 55, 360 55
               C 380 55, 460 55, 475 55
               L 475 130 L 22 130 Z"
            fill="url(#greenPerfGrad)"
          />
          <path
            d="M 22 75 
               C 35 30, 55 25, 70 40 
               C 85 55, 95 130, 115 130 
               C 135 130, 145 60, 160 55 
               C 180 50, 210 50, 230 60
               C 240 40, 255 25, 270 40
               C 285 55, 295 130, 315 130
               C 330 130, 340 55, 360 55
               C 380 55, 460 55, 475 55"
            fill="none"
            stroke="#52C41A"
            strokeWidth="1.5"
          />

          {/* Blue wave */}
          <path
            d="M 22 70 
               C 30 110, 45 130, 55 130 
               C 75 130, 95 25, 115 25 
               C 135 25, 145 55, 165 55 
               C 185 55, 205 55, 225 55 
               C 235 90, 245 130, 255 130
               C 275 130, 295 25, 315 25
               C 335 25, 345 55, 365 55
               C 380 55, 460 55, 475 40
               L 475 130 L 22 130 Z"
            fill="url(#bluePerfGrad)"
          />
          <path
            d="M 22 70 
               C 30 110, 45 130, 55 130 
               C 75 130, 95 25, 115 25 
               C 135 25, 145 55, 165 55 
               C 185 55, 205 55, 225 55 
               C 235 90, 245 130, 255 130
               C 275 130, 295 25, 315 25
               C 335 25, 345 55, 365 55
               C 380 55, 460 55, 475 40"
            fill="none"
            stroke="#1890FF"
            strokeWidth="1.5"
          />

          <text
            x="115"
            y="148"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10:15
          </text>
          <text
            x="250"
            y="148"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10:20
          </text>
          <text
            x="385"
            y="148"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10:25
          </text>
        </svg>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Existing Chart 3: 网络负载
// ----------------------------------------------------
export const NetworkLoadChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">网络负载</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#0084FF" label="速率" />
          <LegendPill color="#52C41A" label="请求数" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          (bps)
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="greenLoadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#52C41A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#52C41A" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="blueLoadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1890FF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1890FF" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {[
            { val: 250, rVal: 2, y: 25 },
            { val: 200, y: 46 },
            { val: 150, y: 67 },
            { val: 100, rVal: 1, y: 88 },
            { val: 50, y: 109 },
            { val: 0, rVal: 0, y: 130 },
          ].map((item) => (
            <g key={item.val}>
              <line
                x1="26"
                y1={item.y}
                x2="470"
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
              {item.rVal !== undefined && (
                <text
                  x="482"
                  y={item.y + 3}
                  fill="#9CA3AF"
                  fontSize="10"
                  textAnchor="start"
                  fontFamily="monospace"
                >
                  {item.rVal}
                </text>
              )}
            </g>
          ))}

          {/* Green Smooth Hump Area */}
          <path
            d="M 26 50
               C 35 46, 50 46, 75 46
               C 90 46, 100 110, 115 110
               C 125 110, 130 50, 150 48
               C 170 46, 185 46, 205 46
               C 215 70, 225 100, 235 110
               C 245 110, 255 50, 270 48
               C 285 46, 310 46, 330 46
               C 350 46, 460 46, 470 50
               L 470 130 L 26 130 Z"
            fill="url(#greenLoadGrad)"
          />
          <path
            d="M 26 50
               C 35 46, 50 46, 75 46
               C 90 46, 100 110, 115 110
               C 125 110, 130 50, 150 48
               C 170 46, 185 46, 205 46
               C 215 70, 225 100, 235 110
               C 245 110, 255 50, 270 48
               C 285 46, 310 46, 330 46
               C 350 46, 460 46, 470 50"
            fill="none"
            stroke="#52C41A"
            strokeWidth="1.5"
          />

          {/* Blue Flow Area */}
          <path
            d="M 26 65
               C 40 90, 50 100, 60 100
               C 75 100, 95 60, 120 60
               C 145 60, 150 85, 170 85
               C 190 85, 210 60, 230 60
               C 250 60, 270 95, 290 95
               C 310 95, 340 60, 370 60
               C 400 60, 440 60, 470 75
               L 470 130 L 26 130 Z"
            fill="url(#blueLoadGrad)"
          />
          <path
            d="M 26 65
               C 40 90, 50 100, 60 100
               C 75 100, 95 60, 120 60
               C 145 60, 150 85, 170 85
               C 190 85, 210 60, 230 60
               C 250 60, 270 95, 290 95
               C 310 95, 340 60, 370 60
               C 400 60, 440 60, 470 75"
            fill="none"
            stroke="#1890FF"
            strokeWidth="1.5"
          />

          <text
            x="115"
            y="148"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10:15
          </text>
          <text
            x="250"
            y="148"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10:20
          </text>
          <text
            x="385"
            y="148"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10:25
          </text>
        </svg>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Existing Chart 4: 应用可用性
// ----------------------------------------------------
export const AppAvailabilityChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">应用可用性</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#1890FF" label="建连成功率" />
          <LegendPill color="#FA8C16" label="建连成功数" />
          <LegendPill color="#52C41A" label="建连失败率" />
          <LegendPill color="#13C2C2" label="建连失败数" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          (%)
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cyanPeakGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#13C2C2" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#13C2C2" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {[
            { val: 100, rVal: 1, y: 25 },
            { val: 80, y: 46 },
            { val: 60, y: 67 },
            { val: 40, y: 88 },
            { val: 20, y: 109 },
            { val: 0, rVal: 0, y: 130 },
          ].map((item) => (
            <g key={item.val}>
              <line
                x1="26"
                y1={item.y}
                x2="470"
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
              {item.rVal !== undefined && (
                <text
                  x="482"
                  y={item.y + 3}
                  fill="#9CA3AF"
                  fontSize="10"
                  textAnchor="start"
                  fontFamily="monospace"
                >
                  {item.rVal}
                </text>
              )}
            </g>
          ))}

          <path
            d="M 26 130 
               L 125 130 
               C 135 130, 142 120, 145 80
               C 148 40, 150 25, 152 25
               C 154 25, 156 40, 159 80
               C 162 120, 169 130, 178 130
               L 470 130 Z"
            fill="url(#cyanPeakGrad)"
          />
          <path
            d="M 26 130 
               L 125 130 
               C 135 130, 142 120, 145 80
               C 148 40, 150 25, 152 25
               C 154 25, 156 40, 159 80
               C 162 120, 169 130, 178 130
               L 470 130"
            fill="none"
            stroke="#13C2C2"
            strokeWidth="1.5"
          />

          <path
            d="M 26 130 L 130 130 L 140 128 L 165 128 L 175 130 L 470 130"
            fill="none"
            stroke="#FA8C16"
            strokeWidth="1"
          />

          <path
            d="M 26 130 L 470 130"
            fill="none"
            stroke="#1890FF"
            strokeWidth="1"
          />

          <text
            x="115"
            y="148"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10:15
          </text>
          <text
            x="250"
            y="148"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10:20
          </text>
          <text
            x="385"
            y="148"
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
            fontFamily="monospace"
          >
            10:25
          </text>
        </svg>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// New Chart 5 (From Image 2): 请求及响应传输时间曲线图
// ----------------------------------------------------
export const RequestResponseTimeChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">
          请求及响应传输时间
        </h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#722ED1" label="请求传输时间" />
          <LegendPill color="#00B96B" label="响应传输时间" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          时间(ms)
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          {/* Grid lines (0, 100, 200, 300) */}
          {[
            { val: 300, y: 25 },
            { val: 200, y: 60 },
            { val: 100, y: 95 },
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

          {/* Vertical Grid Lines corresponding to time ticks */}
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

          {/* Green Line (响应传输时间) with high peak around 09:54 ~220ms */}
          <path
            d="M 26 130 
               L 115 130
               L 125 105
               L 135 125
               L 150 130
               L 155 60
               L 165 48
               L 170 130
               L 260 130
               L 275 122
               L 285 110
               L 295 130
               L 340 128
               L 360 126
               L 400 128
               L 480 130"
            fill="none"
            stroke="#00B96B"
            strokeWidth="1.5"
          />

          {/* Purple Line (请求传输时间) flat along ~130 */}
          <path
            d="M 26 130 L 150 130 L 170 129 L 290 129 L 340 129 L 480 130"
            fill="none"
            stroke="#722ED1"
            strokeWidth="1.5"
          />

          {/* Red Indicator cursor Line at 10:22 */}
          <line
            x1="335"
            y1={25}
            x2="335"
            y2={130}
            stroke="#F5222D"
            strokeWidth="1"
          />

          {/* Tooltip Badges on cursor line */}
          <g transform="translate(290, 80)">
            {/* Green Tooltip Badge */}
            <rect
              x="0"
              y="0"
              width="100"
              height="18"
              rx="2"
              fill="white"
              stroke="#00B96B"
              strokeWidth="1.5"
            />
            <text
              x="50"
              y="12"
              fill="#00B96B"
              fontSize="9"
              textAnchor="middle"
              fontWeight="500"
            >
              响应传输时间:3.56(ms)
            </text>

            {/* Purple Tooltip Badge */}
            <rect
              x="0"
              y="22"
              width="100"
              height="18"
              rx="2"
              fill="white"
              stroke="#722ED1"
              strokeWidth="1.5"
            />
            <text
              x="50"
              y="34"
              fill="#722ED1"
              fontSize="9"
              textAnchor="middle"
              fontWeight="500"
            >
              请求传输时间:0.691(ms)
            </text>

            {/* Red Date Tag */}
            <rect x="25" y="44" width="75" height="15" rx="1" fill="#CF1322" />
            <text
              x="62.5"
              y="55"
              fill="white"
              fontSize="8"
              textAnchor="middle"
              fontFamily="monospace"
            >
              2026-10-15 10:22
            </text>
          </g>

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

// ----------------------------------------------------
// New Chart 6 (From Image 2): 故障率曲线图
// ----------------------------------------------------
export const FailureRateChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">故障率</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#00B96B" label="重传故障率" />
          <LegendPill color="#F5222D" label="零窗口故障率" />
          <LegendPill color="#13C2C2" label="网络延时故障率" />
          <LegendPill color="#722ED1" label="建连故障率" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          百分比(%)
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          {/* Grid lines (0, 50, 100) */}
          {[
            { val: 100, y: 25 },
            { val: 50, y: 77 },
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

          {/* Vertical dashed lines */}
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

          {/* Flat 0% baseline curves */}
          <line x1="26" y1="130" x2="480" y2="130" stroke="#722ED1" strokeWidth="1.5" />
          <line x1="26" y1="130" x2="480" y2="130" stroke="#00B96B" strokeWidth="1" strokeDasharray="4 2" />

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
