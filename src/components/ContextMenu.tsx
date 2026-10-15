import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
  position: { x: number; y: number };
  onSelectMetricAnalysis: () => void;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  onSelectMetricAnalysis,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const menuItems = [
    { label: '指标分析', action: onSelectMetricAnalysis, isPrimary: true },
    { label: '下钻智溯', action: () => onClose() },
    { label: '应用分析', action: () => onClose() },
    { label: '告警分析', action: () => onClose() },
  ];

  return (
    <div
      ref={menuRef}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      className="absolute z-30 w-36 bg-white border border-gray-200 rounded-sm shadow-[0_6px_24px_rgba(0,0,0,0.14)] py-1 text-sm text-gray-800 select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {menuItems.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            item.action();
          }}
          className="w-full text-left px-5 py-2.5 text-xs text-gray-700 hover:bg-[#F2F7FF] hover:text-[#0084FF] transition-colors cursor-pointer flex items-center justify-between"
        >
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};
