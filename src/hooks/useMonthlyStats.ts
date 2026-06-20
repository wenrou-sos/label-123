import { useMemo } from 'react';
import { MonthlyStats } from '../types';
import { useAppStore } from '../store/useAppStore';
import { calcMonthlyStats } from '../utils/statsUtils';
import { getYear, getMonth } from 'date-fns';

export const useMonthlyStats = (): MonthlyStats => {
  const records = useAppStore((s) => s.records);

  return useMemo(() => {
    const now = new Date();
    const year = getYear(now);
    const month = getMonth(now) + 1;
    return calcMonthlyStats(records, year, month);
  }, [records]);
};

export const useCustomMonthlyStats = (
  year: number,
  month: number
): MonthlyStats => {
  const records = useAppStore((s) => s.records);
  return useMemo(() => calcMonthlyStats(records, year, month), [records, year, month]);
};
