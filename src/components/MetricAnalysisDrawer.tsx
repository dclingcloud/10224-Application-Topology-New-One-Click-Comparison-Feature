import React, { useState } from 'react';
import {
  Clock,
  Search,
  RotateCw,
  X,
  ChevronDown,
  PanelRightClose,
} from 'lucide-react';
import {
  NetworkDelayChart,
  NetworkPerformanceChart,
  NetworkLoadChart,
  AppAvailabilityChart,
  RequestResponseTimeChart,
} from './MetricCharts';
import {
  SpeedTrendChart,
  RealtimeTrafficChart,
  SessionCountChart,
  PacketTrafficContrastChart,
} from './LoadCharts';
import {
  TcpConnectCountChart,
  TcpSynCountChart,
  TcpRetransmitChart,
  TcpZeroWindowChart,
  TcpFinCountChart,
  TcpRstCountChart,
  TcpDupAckCountChart,
} from './TcpCharts';

interface MetricAnalysisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNodeName?: string;
}

type TabType = 'performance' | 'load' | 'tcp';

export const MetricAnalysisDrawer: React.FC<MetricAnalysisDrawerProps> = ({
  isOpen,
  onClose,
  selectedNodeName = '交换机1',
}) => {
  const [currentNode, setCurrentNode] = useState(selectedNodeName);
  const [activeTab, setActiveTab] = useState<TabType>('performance');

  if (!isOpen) return null;

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: 'performance', label: '性能' },
    { key: 'load', label: '负载量' },
    { key: 'tcp', label: 'TCP指标' },
  ];

  return (
    <div className="fixed inset-0 z-40 flex select-none pointer-events-auto">
      {/* Dark backdrop overlay */}
      <div
        onClick={onClose}
        className="flex-1 bg-black/40 backdrop-blur-[0.5px] transition-opacity cursor-pointer"
      />

      {/* Main Drawer Container */}
      <div className="relative w-[85%] min-w-[780px] max-w-[1400px] bg-[#F7F9FB] h-full shadow-2xl flex flex-col border-l border-gray-200 animate-in slide-in-from-right duration-200">
        {/* Docked Blue Left Tab: "指标分析" */}
        <div
          onClick={onClose}
          className="absolute -left-7.5 top-20 bg-[#0091FF] text-white text-xs px-1.5 py-4 rounded-l-md shadow-md cursor-pointer flex flex-col items-center justify-center font-medium tracking-widest hover:bg-[#0080E6] transition-colors"
          style={{ writingMode: 'vertical-rl' }}
          title="点击收起"
        >
          指标分析
        </div>

        {/* 1. Drawer Header */}
        <div className="h-11 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-800">指标分析</h3>
          </div>

          <div className="flex items-center gap-4 text-gray-500">
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

        {/* 2. Node Selector & Date-Time Toolbar */}
        <div className="h-11 bg-white px-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          {/* Left Node Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">节点</span>
            <div className="relative inline-block">
              <select
                value={currentNode}
                onChange={(e) => setCurrentNode(e.target.value)}
                className="appearance-none h-7 pl-3 pr-8 text-xs border border-gray-300 rounded bg-white text-gray-800 hover:border-gray-400 focus:outline-none focus:border-[#0091FF] cursor-pointer font-medium"
              >
                <option value="交换机1">交换机1</option>
                <option value="交换机">交换机</option>
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2 top-2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Right Date-Time Picker */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center gap-2 border border-gray-300 rounded px-2.5 py-1 bg-white hover:border-gray-400">
              <Clock size={13} className="text-gray-400" />
              <span className="font-mono text-gray-700 text-xs">
                2026-10-15 10:12 &nbsp; ~ &nbsp; 2026-10-15 10:27
              </span>
            </div>

            <button
              type="button"
              aria-label="查询"
              className="w-7 h-7 bg-[#0091FF] hover:bg-[#0080E6] text-white flex items-center justify-center rounded cursor-pointer transition-colors"
            >
              <Search size={14} />
            </button>

            <button
              type="button"
              aria-label="刷新"
              className="w-7 h-7 bg-white hover:bg-gray-50 border border-gray-300 text-gray-600 flex items-center justify-center rounded cursor-pointer transition-colors"
            >
              <RotateCw size={14} />
            </button>
          </div>
        </div>

        {/* 3. Three Tabs Under Node Selector: 负载量 / 性能 / TCP指标 */}
        <div className="bg-white px-4 border-b border-gray-200 flex items-center gap-8 shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative py-2.5 text-xs font-medium cursor-pointer transition-colors ${
                  isActive
                    ? 'text-[#0084FF] font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0084FF] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* 4. Tab Content Body */}
        <div className="flex-1 p-3.5 overflow-y-auto">
          {/* Tab 1: 性能 (网络延时、网络性能、网络负载、应用可用性、请求及响应传输时间) */}
          {activeTab === 'performance' && (
            <div className="grid grid-cols-2 gap-3.5">
              <NetworkDelayChart />
              <NetworkPerformanceChart />
              <NetworkLoadChart />
              <AppAvailabilityChart />
              <RequestResponseTimeChart />
            </div>
          )}

          {/* Tab 2: 负载量 (图1中的4个趋势图) */}
          {activeTab === 'load' && (
            <div className="grid grid-cols-2 gap-3.5">
              <SpeedTrendChart />
              <RealtimeTrafficChart />
              <SessionCountChart />
              <PacketTrafficContrastChart />
            </div>
          )}

          {/* Tab 3: TCP指标 (图3与图4中的7个TCP指标图) */}
          {activeTab === 'tcp' && (
            <div className="grid grid-cols-2 gap-3.5 pb-4">
              <TcpConnectCountChart />
              <TcpSynCountChart />
              <TcpRetransmitChart />
              <TcpZeroWindowChart />
              <TcpFinCountChart />
              <TcpRstCountChart />
              <TcpDupAckCountChart />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
