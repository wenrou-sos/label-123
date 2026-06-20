import { useMemo } from 'react';
import { HeatmapCellData, MonthHeatmapData } from '../types';
import { useAppStore } from '../store/useAppStore';
import {
  getPast12Months,
  getMonthCalendar,
  formatMonthShort,
} from '../utils/dateUtils';
import { getRatingHeatLevel, getRecordsByDate } from '../utils/statsUtils';
import { getYear, getMonth } from 'date-fns';

export const useHeatmapData = () => {
  const records = useAppStore((s) => s.records);

  const heatmapData = useMemo((): MonthHeatmapData[] => {
    const months = getPast12Months();

    return months.map((monthDate) => {
      const year = getYear(monthDate);
      const month = getMonth(monthDate) + 1;
      const calDays = getMonthCalendar(year, month);

      const cells: (HeatmapCellData | null)[] = calDays.map((day) => {
        if (!day.inMonth) return null;

        const record = getRecordsByDate(records, day.dateStr);
        const rating = record?.rating ?? 0;
        const hasRecord = !!record;
        const rawLevel = getRatingHeatLevel(rating);

        return {
          date: day.dateStr,
          dateObj: day.date,
          rating,
          level: (rawLevel === 0 && hasRecord ? 1 : rawLevel) as 0 | 1 | 2 | 3 | 4 | 5,
          hasRecord,
        };
      });

      return {
        year,
        month,
        monthLabel: formatMonthShort(year, month),
        cells,
      };
    });
  }, [records]);

  return heatmapData;
};
