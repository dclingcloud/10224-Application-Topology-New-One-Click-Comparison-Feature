import React from 'react';
import { LegendPill } from './MetricCharts';

// Helper for X-axis time ticks
const renderXAxisTicks = () => (
  <>
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
  </>
);

// 1. TCP建连次数柱状图 / 趋势图
export const TcpConnectCountChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">TCP建连次数</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#73D191" label="建连成功数" />
          <LegendPill color="#13C2C2" label="建连失败数" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          建连次数
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          {[
            { val: 150, y: 25 },
            { val: 100, y: 60 },
            { val: 50, y: 95 },
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

          {/* Regular green columns ~45 baseline with spikes */}
          {Array.from({ length: 42 }).map((_, i) => {
            const x = 30 + i * 10.5;
            let h = 33; // ~48 units
            if (i === 11) h = 88; // 09:48 spike ~130
            else if (i === 15) h = 55; // ~78
            else if (i === 24) h = 60; // 10:08 ~88
            else if (i === 25) h = 42;
            else if (i === 17 || i === 18) h = 22; // low dip

            return (
              <rect
                key={i}
                x={x}
                y={130 - h}
                width="6"
                height={h}
                fill="#73D191"
                rx="1"
              />
            );
          })}

          {renderXAxisTicks()}
        </svg>
      </div>
    </div>
  );
};

// 2. TCP SYN量柱状图 / 趋势图
export const TcpSynCountChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">TCP SYN量</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#FF7875" label="客户端SYN" />
          <LegendPill color="#D4B106" label="服务器SYN" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          SYN数量
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          {[
            { val: 150, y: 25 },
            { val: 100, y: 60 },
            { val: 50, y: 95 },
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

          {/* Double bars (pink for client, khaki for server) */}
          {Array.from({ length: 42 }).map((_, i) => {
            const x = 30 + i * 10.5;
            let hClient = 32;
            let hServer = 34;

            if (i === 11) {
              hClient = 88;
              hServer = 88;
            } else if (i === 14) {
              hClient = 54;
              hServer = 40;
            } else if (i === 24) {
              hClient = 58;
              hServer = 58;
            } else if (i === 26) {
              hClient = 70;
              hServer = 48;
            }

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={130 - hClient}
                  width="2.5"
                  height={hClient}
                  fill="#FF7875"
                  rx="0.5"
                />
                <rect
                  x={x + 3.2}
                  y={130 - hServer}
                  width="2.5"
                  height={hServer}
                  fill="#D4B106"
                  rx="0.5"
                />
              </g>
            );
          })}

          {/* Right Red Indicator Line & Tooltip */}
          <line x1="475" y1="25" x2="475" y2="130" stroke="#F5222D" strokeWidth="1" />
          <g transform="translate(425, 45)">
            <rect x="0" y="0" width="54" height="15" rx="2" fill="white" stroke="#FF7875" />
            <text x="27" y="11" fill="#FF7875" fontSize="8" textAnchor="middle">
              客户端SYN:48
            </text>
            <rect x="0" y="18" width="54" height="15" rx="2" fill="white" stroke="#D4B106" />
            <text x="27" y="29" fill="#D4B106" fontSize="8" textAnchor="middle">
              服务器SYN:48
            </text>
            <rect x="-8" y="36" width="62" height="13" rx="1" fill="#CF1322" />
            <text x="23" y="46" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace">
              2026-10-15 10:35
            </text>
          </g>

          {renderXAxisTicks()}
        </svg>
      </div>
    </div>
  );
};

// 3. TCP重传量曲线图
export const TcpRetransmitChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">TCP重传量</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#9254DE" label="客户端重传" />
          <LegendPill color="#FA8C16" label="服务器重传" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          重传数
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          {[
            { val: '2,500', y: 25 },
            { val: '2,000', y: 46 },
            { val: '1,500', y: 67 },
            { val: '1,000', y: 88 },
            { val: '500', y: 109 },
            { val: '0', y: 130 },
          ].map((item) => (
            <g key={item.val}>
              <line
                x1="32"
                y1={item.y}
                x2="480"
                y2={item.y}
                stroke={item.val === '0' ? '#D1D5DB' : '#F0F0F0'}
                strokeDasharray={item.val === '0' ? undefined : '3 3'}
              />
              <text
                x="28"
                y={item.y + 3}
                fill="#9CA3AF"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                {item.val}
              </text>
            </g>
          ))}

          {/* High orange peak at 09:47 (~2200) */}
          <rect x="135" y="38" width="3" height="92" fill="#FA8C16" rx="0.5" />
          {/* Secondary orange peak at 09:53 (~1200) */}
          <rect x="155" y="80" width="3" height="50" fill="#FA8C16" rx="0.5" />
          {/* Third orange peak at 09:55 (~300) */}
          <rect x="165" y="117" width="3" height="13" fill="#FA8C16" rx="0.5" />
          {/* Small purple tick for client retransmit */}
          <rect x="148" y="121" width="3" height="9" fill="#9254DE" rx="0.5" />

          {/* Right Red Indicator Line & Tooltip */}
          <line x1="475" y1="25" x2="475" y2="130" stroke="#F5222D" strokeWidth="1" />
          <g transform="translate(425, 78)">
            <rect x="0" y="0" width="54" height="15" rx="2" fill="white" stroke="#9254DE" />
            <text x="27" y="11" fill="#9254DE" fontSize="8" textAnchor="middle">
              客户端重传:0
            </text>
            <rect x="0" y="18" width="54" height="15" rx="2" fill="white" stroke="#FA8C16" />
            <text x="27" y="29" fill="#FA8C16" fontSize="8" textAnchor="middle">
              服务器重传:0
            </text>
            <rect x="-8" y="36" width="62" height="13" rx="1" fill="#CF1322" />
            <text x="23" y="46" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace">
              2026-10-15 10:35
            </text>
          </g>

          {renderXAxisTicks()}
        </svg>
      </div>
    </div>
  );
};

// 4. TCP零窗口曲线图
export const TcpZeroWindowChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">TCP零窗口</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#9254DE" label="客户端零窗口数" />
          <LegendPill color="#13C2C2" label="服务器零窗口数" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          零窗口
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="purpleWindowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9254DE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9254DE" stopOpacity="0.1" />
            </linearGradient>
          </defs>

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

          {/* Purple Triangle Peak at 09:48 (~12) */}
          <polygon
            points="128,130 137,45 146,130"
            fill="url(#purpleWindowGrad)"
          />

          {/* Right Red Indicator Line & Tooltip */}
          <line x1="475" y1="25" x2="475" y2="130" stroke="#F5222D" strokeWidth="1" />
          <g transform="translate(415, 78)">
            <rect x="0" y="0" width="64" height="15" rx="2" fill="white" stroke="#9254DE" />
            <text x="32" y="11" fill="#9254DE" fontSize="8" textAnchor="middle">
              客户端零窗口数:0
            </text>
            <rect x="0" y="18" width="64" height="15" rx="2" fill="white" stroke="#13C2C2" />
            <text x="32" y="29" fill="#13C2C2" fontSize="8" textAnchor="middle">
              服务器零窗口数:0
            </text>
            <rect x="-2" y="36" width="68" height="13" rx="1" fill="#CF1322" />
            <text x="32" y="46" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace">
              2026-10-15 10:35
            </text>
          </g>

          {renderXAxisTicks()}
        </svg>
      </div>
    </div>
  );
};

// 5. TCP FIN量柱状图 / 趋势图
export const TcpFinCountChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">TCP FIN量</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#69C0FF" label="客户端FIN" />
          <LegendPill color="#FA8C16" label="服务器FIN" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          FIN数量
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
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

          {/* Interleaved bars (light blue for client, orange for server) */}
          {Array.from({ length: 42 }).map((_, i) => {
            const x = 30 + i * 10.5;
            let hClient = 22;
            let hServer = 20;

            if (i === 11) {
              hClient = 78; // 09:47 peak ~150
            } else if (i === 13) {
              hClient = 54;
              hServer = 45;
            } else if (i === 24) {
              hClient = 72; // 10:08 ~140
              hServer = 38;
            } else if (i === 34) {
              hClient = 75; // 10:20 ~145
            }

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={130 - hClient}
                  width="2.5"
                  height={hClient}
                  fill="#69C0FF"
                  rx="0.5"
                />
                <rect
                  x={x + 3.2}
                  y={130 - hServer}
                  width="2.5"
                  height={hServer}
                  fill="#FA8C16"
                  rx="0.5"
                />
              </g>
            );
          })}

          {/* Right Red Indicator Line & Tooltip */}
          <line x1="475" y1="25" x2="475" y2="130" stroke="#F5222D" strokeWidth="1" />
          <g transform="translate(425, 68)">
            <rect x="0" y="0" width="54" height="15" rx="2" fill="white" stroke="#69C0FF" />
            <text x="27" y="11" fill="#1890FF" fontSize="8" textAnchor="middle">
              客户端FIN:42
            </text>
            <rect x="0" y="18" width="54" height="15" rx="2" fill="white" stroke="#FA8C16" />
            <text x="27" y="29" fill="#FA8C16" fontSize="8" textAnchor="middle">
              服务器FIN:39
            </text>
            <rect x="-8" y="36" width="62" height="13" rx="1" fill="#CF1322" />
            <text x="23" y="46" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace">
              2026-10-15 10:35
            </text>
          </g>

          {renderXAxisTicks()}
        </svg>
      </div>
    </div>
  );
};

// 6. TCP RST量柱状图 / 趋势图
export const TcpRstCountChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">TCP RST量</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#F759AB" label="客户端RST" />
          <LegendPill color="#85A5FF" label="服务器RST" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          RST数量
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          {[
            { val: 500, y: 25 },
            { val: 400, y: 46 },
            { val: 300, y: 67 },
            { val: 200, y: 88 },
            { val: 100, y: 109 },
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

          {/* Regular baseline ~55 and giant pink spike at 09:48 ~420 */}
          {Array.from({ length: 42 }).map((_, i) => {
            const x = 30 + i * 10.5;
            let hPink = 13;
            let hBlue = 0;

            if (i === 11) {
              hPink = 88; // spike to ~420
            } else if (i === 10) {
              hBlue = 20;
            } else if (i === 24) {
              hBlue = 22;
            } else if (i === 35) {
              hBlue = 22;
            }

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={130 - hPink}
                  width="2.5"
                  height={hPink}
                  fill="#F759AB"
                  rx="0.5"
                />
                {hBlue > 0 && (
                  <rect
                    x={x + 3.2}
                    y={130 - hBlue}
                    width="2.5"
                    height={hBlue}
                    fill="#85A5FF"
                    rx="0.5"
                  />
                )}
              </g>
            );
          })}

          {/* Right Red Indicator Line & Tooltip */}
          <line x1="475" y1="25" x2="475" y2="130" stroke="#F5222D" strokeWidth="1" />
          <g transform="translate(425, 68)">
            <rect x="0" y="0" width="54" height="15" rx="2" fill="white" stroke="#F759AB" />
            <text x="27" y="11" fill="#F759AB" fontSize="8" textAnchor="middle">
              客户端RST:54
            </text>
            <rect x="0" y="18" width="54" height="15" rx="2" fill="white" stroke="#85A5FF" />
            <text x="27" y="29" fill="#85A5FF" fontSize="8" textAnchor="middle">
              服务器RST:0
            </text>
            <rect x="-8" y="36" width="62" height="13" rx="1" fill="#CF1322" />
            <text x="23" y="46" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace">
              2026-10-15 10:35
            </text>
          </g>

          {renderXAxisTicks()}
        </svg>
      </div>
    </div>
  );
};

// 7. 重复ACK次数柱状图 / 趋势图
export const TcpDupAckCountChart: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-3 flex flex-col h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-800">重复ACK次数</h4>
        <div className="flex items-center gap-3">
          <LegendPill color="#9254DE" label="客户端重复ACK" />
          <LegendPill color="#52C41A" label="服务器重复ACK" />
        </div>
      </div>

      <div className="relative flex-1 min-h-[160px]">
        <span className="absolute top-0 left-0 text-[10px] text-gray-400 font-mono">
          ACK数量(K)
        </span>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 160"
          preserveAspectRatio="none"
        >
          {[
            { val: 20, y: 25 },
            { val: 15, y: 51 },
            { val: 10, y: 77 },
            { val: 5, y: 103 },
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

          {/* High purple spike at 09:47 (~18K) */}
          <rect x="135" y="36" width="3.5" height="94" fill="#9254DE" rx="0.5" />
          {/* Secondary tiny tick at 09:50 (~0.8K) */}
          <rect x="148" y="125" width="2.5" height="5" fill="#9254DE" rx="0.5" />
          {/* Third tiny tick at 09:54 (~1.2K) */}
          <rect x="165" y="122" width="2.5" height="8" fill="#9254DE" rx="0.5" />

          {/* Right Red Indicator Line & Tooltip */}
          <line x1="475" y1="25" x2="475" y2="130" stroke="#F5222D" strokeWidth="1" />
          <g transform="translate(405, 78)">
            <rect x="0" y="0" width="75" height="15" rx="2" fill="white" stroke="#9254DE" />
            <text x="37.5" y="11" fill="#9254DE" fontSize="8" textAnchor="middle">
              客户端重复ACK:0(K)
            </text>
            <rect x="0" y="18" width="75" height="15" rx="2" fill="white" stroke="#52C41A" />
            <text x="37.5" y="29" fill="#52C41A" fontSize="8" textAnchor="middle">
              服务器重复ACK:0(K)
            </text>
            <rect x="5" y="36" width="65" height="13" rx="1" fill="#CF1322" />
            <text x="37.5" y="46" fill="white" fontSize="7" textAnchor="middle" fontFamily="monospace">
              2026-10-15 10:35
            </text>
          </g>

          {renderXAxisTicks()}
        </svg>
      </div>
    </div>
  );
};
