import React from 'react';
import { Search, Maximize, User } from 'lucide-react';

export const TopHeader: React.FC = () => {
  return (
    <header className="h-12 bg-[#1A1D24] text-white flex items-center justify-between px-4 select-none border-b border-[#2A2E39] z-20 shrink-0">
      {/* Left Brand */}
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-wider text-white font-mono">
          NGPM
        </span>
      </div>

      {/* Right User & Tools */}
      <div className="flex items-center gap-5 text-gray-300">
        <button
          type="button"
          aria-label="搜索"
          className="hover:text-white transition-colors cursor-pointer"
        >
          <Search size={18} strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label="全屏"
          className="hover:text-white transition-colors cursor-pointer"
        >
          <Maximize size={17} strokeWidth={2} />
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-gray-200">
            <User size={15} />
          </div>
          <span className="text-sm font-normal text-gray-200">admin</span>
        </div>
      </div>
    </header>
  );
};
