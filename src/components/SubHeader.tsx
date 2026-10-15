import React from 'react';
import { Clock, Search, RotateCw, X } from 'lucide-react';

export interface TopTabItem {
  id: string;
  label: string;
  isCloseable?: boolean;
}

interface SubHeaderProps {
  tabs: TopTabItem[];
  activeTabId: string;
  onTabChange: (id: string) => void;
  onCloseTab?: (id: string) => void;
  timeRange?: string;
}

export const SubHeader: React.FC<SubHeaderProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  onCloseTab,
  timeRange = '2026-10-15 09:29  ~  2026-10-15 10:29',
}) => {
  return (
    <div className="h-10 bg-white border-b border-gray-200 px-4 flex items-center justify-between select-none shrink-0">
      {/* Left Tabs */}
      <div className="flex items-center h-full gap-2">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center h-full px-3 text-sm cursor-pointer transition-colors ${
                isActive
                  ? 'text-[#0084FF] font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{tab.label}</span>
                {tab.isCloseable && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab?.(tab.id);
                    }}
                    className="p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0084FF]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Right Date-Time Filter */}
      <div className="flex items-center gap-1.5 text-xs text-gray-700">
        <div className="flex items-center gap-2 border border-gray-300 rounded px-2.5 py-1 bg-white hover:border-gray-400">
          <Clock size={14} className="text-gray-400" />
          <span className="font-mono text-gray-700">{timeRange}</span>
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
  );
};
