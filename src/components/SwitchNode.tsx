import React from 'react';
import { NodeMetricData } from '../types';

interface SwitchNodeProps {
  node: NodeMetricData;
  isSelected?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const SwitchNode: React.FC<SwitchNodeProps> = ({
  node,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-[184px] bg-white rounded-lg border-[1.5px] ${
        isSelected ? 'border-[#0084FF] shadow-lg ring-2 ring-[#0084FF]/20' : 'border-[#0091FF] shadow-sm'
      } cursor-pointer select-none transition-all hover:shadow-md hover:scale-[1.01]`}
    >
      {/* Top Left Floating Glowing Switch Badge */}
      <div className="absolute -top-3.5 -left-3.5 z-10 pointer-events-none">
        {/* Halo Outer Glow */}
        <div className="w-13 h-13 rounded-full bg-[#E0F2FE]/70 border border-[#BAE6FD]/80 flex items-center justify-center p-1 backdrop-blur-[1px] shadow-sm">
          {/* Inner Badge */}
          <div className="w-10 h-10 rounded-full bg-white border border-[#93C5FD] flex items-center justify-center shadow-[0_2px_6px_rgba(0,145,255,0.25)]">
            {/* Switch Icon */}
            <svg
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <rect
                x="3"
                y="6"
                width="22"
                height="16"
                rx="3"
                fill="#0091FF"
              />
              {/* Top arrow area */}
              <path
                d="M7 11H17M17 11L14.5 8.5M17 11L14.5 13.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 14H11M11 14L13.5 11.5M11 14L13.5 16.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Bottom port line & slots */}
              <line x1="3" y1="18" x2="25" y2="18" stroke="#0070CC" strokeWidth="1" />
              <rect x="6" y="19.5" width="2.5" height="1.8" rx="0.5" fill="white" />
              <rect x="10.5" y="19.5" width="2.5" height="1.8" rx="0.5" fill="white" />
              <rect x="15" y="19.5" width="2.5" height="1.8" rx="0.5" fill="white" />
              <rect x="19.5" y="19.5" width="2.5" height="1.8" rx="0.5" fill="white" />
            </svg>
          </div>
        </div>
      </div>

      {/* Blue Header */}
      <div className="h-8 bg-[#0091FF] rounded-t-[6px] pl-11 pr-2 flex items-center text-white font-medium text-xs tracking-wide">
        <span className="truncate">{node.name}</span>
      </div>

      {/* 4 Quadrants Body */}
      <div className="grid grid-cols-2 text-center divide-x divide-y divide-gray-100 py-0.5">
        {/* Quadrant 1: Traffic */}
        <div className="p-2 flex flex-col justify-center items-center">
          <div className="text-gray-900 leading-tight">
            <span className="font-bold text-xs">{node.trafficValue}</span>
            <span className="text-[10px] text-gray-500 ml-0.5">
              {node.trafficUnit}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-0.5">流量</span>
        </div>

        {/* Quadrant 2: Server Response Time */}
        <div className="p-2 flex flex-col justify-center items-center">
          <div className="text-gray-900 leading-tight">
            <span className="font-bold text-xs">{node.responseTimeValue}</span>
            <span className="text-[10px] text-gray-500 ml-0.5">
              {node.responseTimeUnit}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-0.5">响应时间-服务器</span>
        </div>

        {/* Quadrant 3: Network Delay */}
        <div className="p-2 flex flex-col justify-center items-center">
          <div className="text-gray-900 leading-tight">
            <span className="font-bold text-xs">{node.networkDelayValue}</span>
            <span className="text-[10px] text-gray-500 ml-0.5">
              {node.networkDelayUnit}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-0.5">网络时延</span>
        </div>

        {/* Quadrant 4: Connection Fail Rate */}
        <div className="p-2 flex flex-col justify-center items-center">
          <div className="text-gray-900 leading-tight">
            <span className="font-bold text-xs">{node.connectFailRateValue}</span>
            <span className="text-[10px] text-gray-500 ml-0.5">
              {node.connectFailRateUnit}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 mt-0.5">建连失败率</span>
        </div>
      </div>
    </div>
  );
};
