import React from 'react';

export const HeatmapLegend: React.FC = () => {
  const levels = [
    { level: 0, label: '无记录', bg: 'bg-heat-0' },
    { level: 1, label: '1星', bg: 'bg-heat-1' },
    { level: 2, label: '2星', bg: 'bg-heat-2' },
    { level: 3, label: '3星', bg: 'bg-heat-3' },
    { level: 4, label: '4星', bg: 'bg-heat-4' },
    { level: 5, label: '5星', bg: 'bg-heat-5' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
      <span className="text-xs text-warm-400">少</span>
      {levels.map((item) => (
        <div key={item.level} className="flex items-center gap-1 group relative">
          <div
            className={`w-3.5 h-3.5 rounded-md ${item.bg} transition-transform group-hover:scale-125`}
          />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-warm-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
            {item.label}
          </div>
        </div>
      ))}
      <span className="text-xs text-warm-400">多</span>
    </div>
  );
};
