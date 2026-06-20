import React from 'react';
import { HeatmapCellData } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { cn, formatDateCN } from '../../lib/utils';
import { todayStr } from '../../utils/dateUtils';

interface HeatmapCellProps {
  cellData: HeatmapCellData;
  size?: 'sm' | 'md' | 'lg';
}

const heatLevelBg: Record<number, string> = {
  0: 'bg-heat-0',
  1: 'bg-heat-1',
  2: 'bg-heat-2',
  3: 'bg-heat-3',
  4: 'bg-heat-4',
  5: 'bg-heat-5',
};

const sizeClasses = {
  sm: 'w-2.5 h-2.5 rounded-[3px]',
  md: 'w-3.5 h-3.5 rounded-md',
  lg: 'w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-lg',
};

export const HeatmapCell: React.FC<HeatmapCellProps> = ({ cellData, size = 'md' }) => {
  const openDetailModal = useAppStore((s) => s.openDetailModal);
  const isToday = cellData.date === todayStr();

  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => {
    openDetailModal(cellData.date);
  };

  const level = cellData.level;
  const bgClass = heatLevelBg[level] || 'bg-heat-0';

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={handleClick}
        className={cn(
          'heatmap-cell',
          sizeClasses[size],
          bgClass,
          level === 0 && !cellData.hasRecord && 'heatmap-cell-empty',
          isToday && 'ring-2 ring-rose-500 ring-offset-1 ring-offset-ivory-100'
        )}
        style={{ animationDelay: `${Math.random() * 0.5}s` }}
        aria-label={`${formatDateCN(cellData.date)}${cellData.hasRecord ? `，评分${cellData.rating}星` : '，暂无记录'}`}
      />

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none animate-fade-in"
        >
          <div className="whitespace-nowrap bg-warm-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg">
            <p className="font-medium">{formatDateCN(cellData.date)}</p>
            {cellData.hasRecord ? (
              <p className="text-peach-300 mt-0.5">{cellData.rating} 星记录</p>
            ) : (
              <p className="text-warm-200 mt-0.5 opacity-70">暂无记录</p>
            )}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-warm-700" />
          </div>
        </div>
      )}
    </div>
  );
};
