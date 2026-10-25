import React from 'react';
import {
  Search,
  Layers,
  Cloud,
  Network,
  Bell,
  Gauge,
  Monitor,
  ArrowLeftRight,
  FileText,
  Puzzle,
  Sliders,
  Activity,
  Video,
  Shield,
  BatteryCharging,
} from 'lucide-react';

interface IconSidebarProps {
  activeId?: string;
  onSelectNav?: (id: string) => void;
}

export const IconSidebar: React.FC<IconSidebarProps> = ({
  activeId = 'topology',
  onSelectNav,
}) => {
  const navItems = [
    { icon: Search, id: 'search', label: '搜' },
    { icon: Layers, id: 'trace', label: '智溯' },
    { icon: Cloud, id: 'cloud', label: '逸云' },
    { icon: Network, id: 'topology', label: '拓扑' },
    { icon: Bell, id: 'alerts', label: '告警' },
    { icon: Gauge, id: 'monitor', label: '监控' },
    { icon: Monitor, id: 'screen', label: '大屏' },
    { icon: ArrowLeftRight, id: 'trade', label: '交易' },
    { icon: FileText, id: 'securities', label: '证券' },
    { icon: Puzzle, id: 'decode', label: '解码' },
    { icon: Sliders, id: 'config', label: '配置' },
    { icon: Activity, id: 'netflow', label: 'NetFlow' },
    { icon: Video, id: 'av', label: '音视频' },
    { icon: Shield, id: 'firewall', label: '防火墙' },
    { icon: BatteryCharging, id: 'load', label: '负载' },
  ];

  return (
    <aside className="w-13 bg-[#1A1D24] flex flex-col items-center py-1 text-gray-400 select-none border-r border-[#15171D] shrink-0 overflow-y-auto">
      <div className="flex flex-col gap-1 w-full items-center">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive =
            activeId === item.id ||
            (item.id === 'trace' && (activeId === 'workbench' || activeId === 'trace')) ||
            (item.id === 'topology' && activeId === 'topology');

          return (
            <div
              key={item.id}
              onClick={() => onSelectNav?.(item.id)}
              className={`w-11 py-1.5 flex flex-col items-center justify-center rounded cursor-pointer transition-colors ${
                isActive
                  ? 'bg-[#0091FF] text-white font-medium shadow-xs'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <IconComp size={15} strokeWidth={1.8} />
              <span className="text-[10px] mt-0.5 scale-90 leading-none">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
