import React, { useState } from 'react';
import {
  Search,
  PlusSquare,
  Shield,
  FolderPlus,
  Folder,
  ChevronDown,
  ChevronRight,
  GitFork,
  MoreHorizontal,
} from 'lucide-react';

interface TreeSidebarProps {
  selectedNodeId?: string;
}

export const TreeSidebar: React.FC<TreeSidebarProps> = () => {
  const [filterText, setFilterText] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    beijing: true,
    shanghai: true,
    folder90: true,
    folder6: true,
    chandao: true,
    na: false,
  });

  const toggleFolder = (key: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col select-none text-xs text-gray-700 shrink-0 h-full">
      {/* Top Filter and Add Button */}
      <div className="p-2.5 border-b border-gray-100 space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="过滤..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full h-7 pl-6 pr-2 text-xs border border-gray-300 rounded bg-[#FAFAFA] focus:bg-white focus:outline-none focus:border-[#0084FF]"
          />
          <Search size={12} className="absolute left-2 top-2 text-gray-400" />
        </div>

        <button
          type="button"
          className="w-full h-7 border border-gray-300 rounded flex items-center justify-center gap-1.5 text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-xs"
        >
          <PlusSquare size={13} className="text-gray-500" />
          <span>新建拓扑</span>
        </button>
      </div>

      {/* Tree Header */}
      <div className="px-3 py-2 flex items-center justify-between text-gray-800 font-medium">
        <span className="text-xs font-semibold">应用拓扑</span>
        <div className="flex items-center gap-2 text-gray-400">
          <Shield size={13} className="hover:text-gray-600 cursor-pointer" />
          <FolderPlus size={13} className="hover:text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto px-1 space-y-0.5 pb-4">
        {/* Beijing Data Center */}
        <div>
          <div
            onClick={() => toggleFolder('beijing')}
            className="flex items-center gap-1 px-1.5 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-800"
          >
            {expandedFolders.beijing ? (
              <ChevronDown size={12} className="text-gray-400" />
            ) : (
              <ChevronRight size={12} className="text-gray-400" />
            )}
            <Folder size={14} className="text-[#0084FF] fill-[#0084FF]/20" />
            <span className="truncate">Beijing Data Center</span>
          </div>

          {expandedFolders.beijing && (
            <div className="pl-4 space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-600">
                <GitFork size={13} className="text-[#0084FF] rotate-90" />
                <span className="truncate">Internet Egress to Bu...</span>
              </div>

              {/* Active Item: Production Core Zone */}
              <div className="flex items-center justify-between px-2 py-1 bg-[#E6F4FF] text-[#0084FF] font-medium rounded cursor-pointer border-r-2 border-[#0084FF]">
                <div className="flex items-center gap-1.5 truncate">
                  <GitFork size={13} className="text-[#0084FF] rotate-90" />
                  <span className="truncate">Production Core Zone</span>
                </div>
                <MoreHorizontal size={14} className="text-[#0084FF] shrink-0" />
              </div>
            </div>
          )}
        </div>

        {/* Shanghai Data Center */}
        <div>
          <div
            onClick={() => toggleFolder('shanghai')}
            className="flex items-center gap-1 px-1.5 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-800"
          >
            {expandedFolders.shanghai ? (
              <ChevronDown size={12} className="text-gray-400" />
            ) : (
              <ChevronRight size={12} className="text-gray-400" />
            )}
            <Folder size={14} className="text-[#0084FF] fill-[#0084FF]/20" />
            <span className="truncate">Shanghai Data Center</span>
          </div>

          {expandedFolders.shanghai && (
            <div className="pl-4 space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-600">
                <GitFork size={13} className="text-[#0084FF] rotate-90" />
                <span className="truncate">Internet Egress to Bu...</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-600">
                <GitFork size={13} className="text-[#0084FF] rotate-90" />
                <span className="truncate">Production Core Zone</span>
              </div>
            </div>
          )}
        </div>

        {/* 文件夹90 */}
        <div>
          <div
            onClick={() => toggleFolder('folder90')}
            className="flex items-center gap-1 px-1.5 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-800"
          >
            {expandedFolders.folder90 ? (
              <ChevronDown size={12} className="text-gray-400" />
            ) : (
              <ChevronRight size={12} className="text-gray-400" />
            )}
            <Folder size={14} className="text-[#0084FF] fill-[#0084FF]/20" />
            <span className="truncate">文件夹90</span>
          </div>
          {expandedFolders.folder90 && (
            <div className="pl-4 space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-600">
                <GitFork size={13} className="text-[#0084FF] rotate-90" />
                <span className="truncate">test</span>
              </div>
            </div>
          )}
        </div>

        {/* 文件夹6 */}
        <div>
          <div
            onClick={() => toggleFolder('folder6')}
            className="flex items-center gap-1 px-1.5 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-800"
          >
            {expandedFolders.folder6 ? (
              <ChevronDown size={12} className="text-gray-400" />
            ) : (
              <ChevronRight size={12} className="text-gray-400" />
            )}
            <Folder size={14} className="text-[#0084FF] fill-[#0084FF]/20" />
            <span className="truncate">文件夹6</span>
          </div>
          {expandedFolders.folder6 && (
            <div className="pl-4 space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-600">
                <GitFork size={13} className="text-[#0084FF] rotate-90" />
                <span className="truncate">审计日志</span>
              </div>
            </div>
          )}
        </div>

        {/* 禅道拓扑 */}
        <div>
          <div
            onClick={() => toggleFolder('chandao')}
            className="flex items-center gap-1 px-1.5 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-800"
          >
            {expandedFolders.chandao ? (
              <ChevronDown size={12} className="text-gray-400" />
            ) : (
              <ChevronRight size={12} className="text-gray-400" />
            )}
            <Folder size={14} className="text-[#0084FF] fill-[#0084FF]/20" />
            <span className="truncate">禅道拓扑</span>
          </div>
          {expandedFolders.chandao && (
            <div className="pl-4 space-y-0.5">
              <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-600">
                <GitFork size={13} className="text-[#0084FF] rotate-90" />
                <span className="truncate">禅道拓扑</span>
              </div>
            </div>
          )}
        </div>

        {/* N+A */}
        <div>
          <div
            onClick={() => toggleFolder('na')}
            className="flex items-center gap-1 px-1.5 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-800"
          >
            {expandedFolders.na ? (
              <ChevronDown size={12} className="text-gray-400" />
            ) : (
              <ChevronRight size={12} className="text-gray-400" />
            )}
            <Folder size={14} className="text-[#0084FF] fill-[#0084FF]/20" />
            <span className="truncate">N+A</span>
          </div>
        </div>

        {/* Direct Assets */}
        <div className="pt-1 space-y-0.5">
          <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700">
            <GitFork size={13} className="text-[#0084FF] rotate-90" />
            <span className="truncate">Medium-Risk Assets</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700">
            <GitFork size={13} className="text-[#0084FF] rotate-90" />
            <span className="truncate">Important Assets</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700">
            <GitFork size={13} className="text-[#0084FF] rotate-90" />
            <span className="truncate">Low-Risk Assets</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700">
            <GitFork size={13} className="text-[#0084FF] rotate-90" />
            <span className="truncate">External Agency Leased ...</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer text-gray-700">
            <GitFork size={13} className="text-[#0084FF] rotate-90" />
            <span className="truncate">CRM System</span>
          </div>
        </div>
      </div>
    </div>
  );
};
