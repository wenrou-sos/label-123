import React from 'react';
import { useHeatmapData } from '../../hooks/useHeatmapData';
import { HeatmapCell } from './HeatmapCell';
import { HeatmapLegend } from './HeatmapLegend';
import { getWeekdayLabels, getMaxWeeksInMonth } from '../../utils/dateUtils';
import { cn } from '../../lib/utils';
import { Calendar } from 'lucide-react';

export const HeatmapCalendar: React.FC = () => {
  const heatmapData = useHeatmapData();
  const weekdayLabels = getWeekdayLabels();
  const maxWeeks = getMaxWeeksInMonth();

  return (
    <div className="card-gradient animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-rose-100 to-rose-200">
            <Calendar size={18} className="text-rose-500" strokeWidth={2} />
          </div>
          <div>
            <h2 className="font-serif font-semibold text-warm-600 text-lg">回忆热力图</h2>
            <p className="text-xs text-warm-400 mt-0.5">过去 12 个月的美好时光</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-5 px-5">
        <div className="inline-block min-w-full stagger-animation">
          <div className="grid gap-x-2 mb-2" style={{ gridTemplateColumns: `repeat(${heatmapData.length}, minmax(56px, 1fr))` }}>
            {heatmapData.map((month, idx) => (
              <div key={`header-${idx}`} className="text-xs font-medium text-warm-500 text-center truncate">
                {month.year % 100 !== heatmapData[0].year % 100 && idx > 0 && heatmapData[idx - 1].year !== month.year
                  ? `${month.year % 100}年${month.monthLabel}`
                  : month.monthLabel}
              </div>
            ))}
          </div>

          <div className="grid gap-x-2" style={{ gridTemplateColumns: `20px repeat(${heatmapData.length}, minmax(56px, 1fr))` }}>
            <div className="grid gap-y-1 py-1" style={{ gridTemplateRows: `repeat(${maxWeeks}, minmax(0, 1fr))` }}>
              {weekdayLabels.map((label, idx) => (
                <div
                  key={`weekday-${idx}`}
                  className={cn(
                    'text-[10px] text-warm-400 leading-none flex items-center justify-end pr-2',
                    idx % 2 === 1 ? 'opacity-100' : 'opacity-50'
                  )}
                  style={{ height: '14px' }}
                >
                  {idx % 2 === 1 ? label : ''}
                </div>
              ))}
            </div>

            {heatmapData.map((month, monthIdx) => (
              <div
                key={`month-${monthIdx}-${month.year}-${month.month}`}
                className="grid gap-x-1 gap-y-1 py-1 grid-flow-col auto-cols-max"
                style={{
                  gridTemplateRows: `repeat(${maxWeeks}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: maxWeeks }, (_, weekIdx) => {
                  const cellIdx = weekIdx * 7;
                  const cellsInWeek = month.cells.slice(cellIdx, cellIdx + 7);

                  return cellsInWeek.map((cell, dayIdx) => (
                    <div key={`cell-${weekIdx}-${dayIdx}`} style={{ height: '14px' }}>
                      {cell ? (
                        <HeatmapCell cellData={cell} size="sm" />
                      ) : (
                        <div className="w-2.5 h-2.5" />
                      )}
                    </div>
                  ));
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <HeatmapLegend />
    </div>
  );
};
