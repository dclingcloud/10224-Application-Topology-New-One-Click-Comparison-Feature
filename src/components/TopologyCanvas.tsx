import React, { useState, useRef } from 'react';
import {
  FileText,
  AlertTriangle,
  Clock,
  Play,
  Columns,
  Camera,
  Grid,
  Minus,
  Plus,
  ArrowLeftRight,
} from 'lucide-react';
import { NodeMetricData } from '../types';
import { SwitchNode } from './SwitchNode';
import { ContextMenu } from './ContextMenu';

interface TopologyCanvasProps {
  onOpenMetricAnalysis: (nodeName: string) => void;
  onOpenCompare?: (nodeName?: string) => void;
}

export const TopologyCanvas: React.FC<TopologyCanvasProps> = ({
  onOpenMetricAnalysis,
  onOpenCompare,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Active context menu state
  const [activeMenu, setActiveMenu] = useState<{
    nodeId: string;
    nodeName: string;
    position: { x: number; y: number };
  } | null>(null);

  // The 2 nodes on the topology
  const nodes: NodeMetricData[] = [
    {
      id: 'switch_0',
      name: '交换机',
      type: 'switch',
      trafficValue: '125.81',
      trafficUnit: 'MB',
      responseTimeValue: '25.84',
      responseTimeUnit: 'ms',
      networkDelayValue: '121.10',
      networkDelayUnit: 'ms',
      connectFailRateValue: '48.13',
      connectFailRateUnit: '%',
      position: { x: 260, y: 190 },
    },
    {
      id: 'switch_1',
      name: '交换机1',
      type: 'switch',
      trafficValue: '19.63',
      trafficUnit: 'KB',
      responseTimeValue: '0',
      responseTimeUnit: 'us',
      networkDelayValue: '0',
      networkDelayUnit: 'us',
      connectFailRateValue: '100.00',
      connectFailRateUnit: '%',
      position: { x: 480, y: 190 },
    },
  ];

  const handleNodeClick = (node: NodeMetricData, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const target = e.currentTarget as HTMLElement;
    const targetRect = target.getBoundingClientRect();

    // Position context menu at bottom-right of the node card exactly as shown in Figure 2
    const menuX = targetRect.left - containerRect.left + 90;
    const menuY = targetRect.top - containerRect.top + 70;

    setActiveMenu({
      nodeId: node.id,
      nodeName: node.name,
      position: { x: menuX, y: menuY },
    });
  };

  const handleCanvasClick = () => {
    if (activeMenu) {
      setActiveMenu(null);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleCanvasClick}
      className="relative flex-1 bg-[#F8FAFC] border-t border-gray-200 overflow-hidden flex flex-col select-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, #E2E8F0 1px, transparent 1px),
          linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)
        `,
        backgroundSize: '150px 150px',
        backgroundPosition: '0 0',
      }}
    >
      {/* Canvas Top Bar */}
      <div className="h-9 px-4 flex items-center justify-between border-b border-gray-200/80 bg-white/70 backdrop-blur-xs z-10 shrink-0">
        {/* Left Title */}
        <div className="text-xs font-semibold text-gray-800">
          Production Core Zone
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 text-xs">
          {/* 一键对比按钮 (放在指标说明左侧) */}
          <button
            type="button"
            onClick={() => onOpenCompare?.()}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#BAE0FF] rounded text-[#0084FF] hover:bg-[#E6F4FF]/50 transition-colors shadow-2xs cursor-pointer text-xs font-medium"
          >
            <ArrowLeftRight size={13} className="text-[#0084FF]" />
            <span>一键对比</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded text-gray-700 hover:border-gray-300 transition-colors shadow-2xs cursor-pointer text-xs"
          >
            <FileText size={13} className="text-[#0084FF]" />
            <span>指标说明</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded text-gray-700 hover:border-gray-300 transition-colors shadow-2xs cursor-pointer text-xs"
          >
            <AlertTriangle size={13} className="text-[#FF4D4F]" />
            <span>告警总览</span>
          </button>

          <div className="flex items-center gap-2 px-2.5 py-1 bg-white border border-gray-200 rounded text-gray-700 shadow-2xs text-xs">
            <Clock size={13} className="text-gray-400" />
            <span className="font-mono text-gray-700">
              2026-10-15 10:12 - 2026-10-15 10:27
            </span>
            <div className="w-4 h-4 rounded-full bg-[#0084FF] flex items-center justify-center text-white cursor-pointer ml-1">
              <Play size={8} className="fill-white translate-x-[0.5px]" />
            </div>
            <Columns size={13} className="text-gray-400 cursor-pointer hover:text-gray-600 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Topology Canvas Inner Area */}
      <div className="relative flex-1 w-full h-full">
        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${node.position.x}px`,
              top: `${node.position.y}px`,
            }}
          >
            <SwitchNode
              node={node}
              isSelected={activeMenu?.nodeId === node.id}
              onClick={(e) => handleNodeClick(node, e)}
            />
          </div>
        ))}

        {/* Figure 2: Popover Context Menu */}
        {activeMenu && (
          <ContextMenu
            position={activeMenu.position}
            onSelectMetricAnalysis={() => {
              const nodeName = activeMenu.nodeName;
              setActiveMenu(null);
              onOpenMetricAnalysis(nodeName);
            }}
            onSelectPeriodicCompare={() => {
              const nodeName = activeMenu.nodeName;
              setActiveMenu(null);
              onOpenCompare?.(nodeName);
            }}
            onClose={() => setActiveMenu(null)}
          />
        )}

        {/* Bottom Right Floating Tools */}
        <div className="absolute right-6 bottom-6 flex flex-col items-end gap-3 z-10">
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              aria-label="截图"
              className="w-7 h-7 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center text-gray-600 cursor-pointer"
            >
              <Camera size={14} />
            </button>
            <button
              type="button"
              aria-label="网格对齐"
              className="w-7 h-7 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center text-gray-600 cursor-pointer"
            >
              <Grid size={14} />
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="bg-white/95 border border-gray-300 rounded shadow-sm px-2 py-1 flex items-center gap-2 text-gray-600">
            <button
              type="button"
              aria-label="缩小"
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="hover:text-gray-900 cursor-pointer"
            >
              <Minus size={13} />
            </button>
            <div className="w-20 h-1.5 bg-gray-200 rounded-full relative flex items-center">
              <div
                className="h-full bg-[#0084FF] rounded-full"
                style={{ width: `${zoomLevel - 40}%` }}
              />
              <div
                className="w-3 h-3 bg-white border-2 border-[#0084FF] rounded-full shadow absolute -translate-x-1/2 cursor-pointer"
                style={{ left: `${zoomLevel - 40}%` }}
              />
            </div>
            <button
              type="button"
              aria-label="放大"
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="hover:text-gray-900 cursor-pointer"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
