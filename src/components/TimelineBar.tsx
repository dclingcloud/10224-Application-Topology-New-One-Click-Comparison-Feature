import React from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

export const TimelineBar: React.FC = () => {
  // Generate 34 status blocks matching Figure 1 colors
  const blocks = Array.from({ length: 34 }, (_, index) => {
    let color = '#74D99F'; // Light green
    if (index >= 24 && index <= 32) {
      color = '#00B84D'; // Bright green active window
    } else if (index === 33) {
      color = '#D1EFE0'; // Pale muted end
    }
    return { id: index, color };
  });

  const timeTicks = [
    '09:35',
    '09:40',
    '09:45',
    '09:50',
    '09:55',
    '10:00',
    '10:05',
    '10:10',
    '10:15',
    '10:20',
    '10:25',
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-md mx-3 mt-2.5 mb-2 px-3 py-1.5 flex items-center justify-between select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Left Time Control */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="前一段时间"
          className="w-6 h-6 border border-gray-200 hover:border-gray-300 rounded flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} />
        </button>
        <div className="text-center leading-tight">
          <div className="text-xs font-medium text-gray-700 font-mono">09:29</div>
          <div className="text-[10px] text-gray-400 font-mono">2026-10-15</div>
        </div>
      </div>

      {/* Center Segment Bar & Axis */}
      <div className="flex-1 max-w-4xl mx-4 flex flex-col justify-center">
        <div className="flex items-center gap-[3px] h-5 w-full">
          {blocks.map((b) => (
            <div
              key={b.id}
              className="flex-1 h-4 rounded-[1.5px] transition-transform hover:scale-y-110 cursor-pointer"
              style={{ backgroundColor: b.color }}
            />
          ))}
        </div>

        {/* Ticks */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mt-0.5 px-2">
          {timeTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      </div>

      {/* Right Time Control & Play */}
      <div className="flex items-center gap-2">
        <div className="text-center leading-tight">
          <div className="text-xs font-medium text-gray-700 font-mono">10:29</div>
          <div className="text-[10px] text-gray-400 font-mono">2026-10-15</div>
        </div>
        <button
          type="button"
          aria-label="后一段时间"
          className="w-6 h-6 border border-gray-200 hover:border-gray-300 rounded flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ChevronRight size={14} />
        </button>
        <button
          type="button"
          aria-label="播放"
          className="w-6 h-6 bg-[#2B2F38] hover:bg-black rounded-full flex items-center justify-center text-white transition-colors cursor-pointer ml-1"
        >
          <Play size={10} className="fill-white translate-x-[0.5px]" />
        </button>
      </div>
    </div>
  );
};
