import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { calcRecent4WeeksCount, checkExpectationDeviation } from '../utils/statsUtils';

export const useExpectationCheck = () => {
  const records = useAppStore((s) => s.records);
  const settings = useAppStore((s) => s.settings);
  const showReminder = useAppStore((s) => s.showReminder);

  const actualCount4Weeks = useMemo(() => calcRecent4WeeksCount(records), [records]);

  const expectedMin4Weeks = settings.minTimesPerWeek * 4;
  const expectedMax4Weeks = settings.maxTimesPerWeek * 4;

  const isDeviating = useMemo(
    () => checkExpectationDeviation(records, settings),
    [records, settings]
  );

  const deviationType = useMemo((): 'low' | 'high' | 'normal' => {
    const lowerBound = expectedMin4Weeks * 0.8;
    const upperBound = expectedMax4Weeks * 1.2;
    if (actualCount4Weeks < lowerBound) return 'low';
    if (actualCount4Weeks > upperBound) return 'high';
    return 'normal';
  }, [actualCount4Weeks, expectedMin4Weeks, expectedMax4Weeks]);

  const weeklyActualAvg = Number((actualCount4Weeks / 4).toFixed(1));

  return {
    actualCount4Weeks,
    expectedMin4Weeks,
    expectedMax4Weeks,
    weeklyActualAvg,
    isDeviating,
    deviationType,
    showReminder,
    settings,
  };
};
