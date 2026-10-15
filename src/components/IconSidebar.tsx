import React from 'react';
import {
  ChevronsRight,
  Search,
  BarChart2,
  Cloud,
  Network,
  Bell,
  Target,
  Gauge,
  LineChart,
  Server,
  LayoutGrid,
  Sliders,
  Globe,
  Video,
  Layers,
  Monitor,
} from 'lucide-react';

export const IconSidebar: React.FC = () => {
  const icons = [
    { icon: Search, id: 'search' },
    { icon: BarChart2, id: 'charts' },
    { icon: Cloud, id: 'cloud' },
    { icon: Network, id: 'network' },
    { icon: Bell, id: 'alerts' },
    { icon: Target, id: 'target' },
    { icon: Gauge, id: 'gauge' },
    { icon: LineChart, id: 'trends' },
    { icon: Server, id: 'servers' },
    { icon: LayoutGrid, id: 'grid' },
    { icon: Sliders, id: 'sliders' },
    { icon: Globe, id: 'globe' },
    { icon: Video, id: 'video' },
    { icon: Layers, id: 'layers' },
    { icon: Monitor, id: 'monitor' },
  ];

  return (
    <aside className="w-11 bg-[#282D38] flex flex-col items-center py-2 text-gray-400 select-none border-r border-[#1F2329] shrink-0 overflow-y-auto">
      {/* Top Toggle Arrow */}
      <div className="w-8 h-8 flex items-center justify-center hover:text-white cursor-pointer mb-2">
        <ChevronsRight size={16} />
      </div>

      <div className="w-6 h-[1px] bg-gray-700/60 mb-2" />

      {/* Navigation Icons */}
      <div className="flex flex-col gap-3 w-full items-center">
        {icons.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 hover:text-white cursor-pointer transition-colors text-gray-300"
            >
              <IconComp size={16} strokeWidth={1.75} />
            </div>
          );
        })}
      </div>
    </aside>
  );
};
