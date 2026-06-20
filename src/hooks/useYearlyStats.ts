import { useMemo } from 'react';
import { YearlyStats } from '../types';
import { useAppStore } from '../store/useAppStore';
import { calcYearlyStats } from '../utils/statsUtils';
import { getYear } from 'date-fns';

export const useYearlyStats = (): YearlyStats => {
  const records = useAppStore((s) => s.records);

  return useMemo(() => {
    const year = getYear(new Date());
    return calcYearlyStats(records, year);
  }, [records]);
};

export const useCustomYearlyStats = (year: number): YearlyStats => {
  const records = useAppStore((s) => s.records);
  return useMemo(() => calcYearlyStats(records, year), [records, year]);
};
