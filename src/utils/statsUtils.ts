import { DiaryRecord, MonthlyStats, YearlyStats, ExpectationSettings } from '../types';
import {
  getDaysInMonthInterval,
  getYearNum,
  getMonthNum,
  prevMonth,
  parseDate,
  getLast28Days,
  formatDate,
} from './dateUtils';
import { getYear, getMonth } from 'date-fns';

export const getRecordsByDate = (
  records: DiaryRecord[],
  dateStr: string
): DiaryRecord | undefined => {
  return records.find((r) => r.date === dateStr);
};

export const getRecordsInDateRange = (
  records: DiaryRecord[],
  startDate: Date,
  endDate: Date
): DiaryRecord[] => {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return records.filter((r) => {
    const t = parseDate(r.date).getTime();
    return t >= start && t <= end;
  });
};

export const getRecordsInMonth = (
  records: DiaryRecord[],
  year: number,
  month: number
): DiaryRecord[] => {
  return records.filter((r) => {
    const d = parseDate(r.date);
    return getYear(d) === year && getMonth(d) + 1 === month;
  });
};

export const getRecordsInYear = (records: DiaryRecord[], year: number): DiaryRecord[] => {
  return records.filter((r) => getYearNum(parseDate(r.date)) === year);
};

export const calcAvgRating = (records: DiaryRecord[]): number => {
  const rated = records.filter((r) => r.rating > 0);
  if (rated.length === 0) return 0;
  const sum = rated.reduce((acc, r) => acc + r.rating, 0);
  return Number((sum / rated.length).toFixed(1));
};

export const calcMaxStreak = (records: DiaryRecord[], year: number, month: number): number => {
  const monthDays = getDaysInMonthInterval(year, month);
  const dateSet = new Set(records.map((r) => r.date));

  let currentStreak = 0;
  let maxStreak = 0;

  for (const day of monthDays) {
    const dateStr = formatDate(day);
    if (dateSet.has(dateStr)) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
};

export const calcChangeDirection = (
  current: number,
  previous: number
): 'up' | 'down' | 'same' => {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'same';
};

export const calcChangePercent = (current: number, previous: number): number => {
  if (previous === 0) {
    if (current > 0) return 100;
    return 0;
  }
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

export const calcMonthlyStats = (
  records: DiaryRecord[],
  year: number,
  month: number
): MonthlyStats => {
  const currentRecords = getRecordsInMonth(records, year, month);
  const totalCount = currentRecords.length;
  const avgRating = calcAvgRating(currentRecords);
  const maxStreak = calcMaxStreak(records, year, month);

  const { year: lastYear, month: lastMonth } = prevMonth(year, month);
  const lastMonthRecords = getRecordsInMonth(records, lastYear, lastMonth);
  const lastMonthCount = lastMonthRecords.length;
  const lastMonthAvgRating = calcAvgRating(lastMonthRecords);

  const countChangePercent = calcChangePercent(totalCount, lastMonthCount);

  return {
    year,
    month,
    totalCount,
    avgRating,
    maxStreak,
    compareToLastMonth: {
      countChange: calcChangeDirection(totalCount, lastMonthCount),
      countChangePercent,
      ratingChange: calcChangeDirection(avgRating, lastMonthAvgRating),
    },
  };
};

export const calcYearlyStats = (records: DiaryRecord[], year: number): YearlyStats => {
  const yearRecords = getRecordsInYear(records, year);
  const totalCount = yearRecords.length;

  const monthlyCounts: { month: number; count: number; avgRating: number }[] = [];
  for (let m = 1; m <= 12; m++) {
    const monthRecords = getRecordsInMonth(records, year, m);
    monthlyCounts.push({
      month: m,
      count: monthRecords.length,
      avgRating: calcAvgRating(monthRecords),
    });
  }

  const sortedByCount = [...monthlyCounts].filter((m) => m.count > 0).sort((a, b) => b.count - a.count);
  const highestMonth = sortedByCount[0] || { month: 1, count: 0 };
  const lowestMonth =
    [...monthlyCounts].filter((m) => m.count > 0).sort((a, b) => a.count - b.count)[0] ||
    { month: 1, count: 0 };

  const avgMonthlyCount = Number((totalCount / 12).toFixed(1));

  const ratedYearRecords = yearRecords.filter((r) => r.rating > 0);
  const avgRating =
    ratedYearRecords.length > 0
      ? Number(
          (ratedYearRecords.reduce((acc, r) => acc + r.rating, 0) /
            ratedYearRecords.length).toFixed(1)
        )
      : 0;

  const lastYearRecords = getRecordsInYear(records, year - 1);
  const lastYearCount = lastYearRecords.length;
  const changePercent = calcChangePercent(totalCount, lastYearCount);

  return {
    year,
    totalCount,
    avgMonthlyCount,
    avgRating,
    highestMonth: { month: highestMonth.month, count: highestMonth.count },
    lowestMonth: { month: lowestMonth.month, count: lowestMonth.count },
    compareToLastYear: {
      direction: calcChangeDirection(totalCount, lastYearCount),
      changePercent,
      lastYearCount,
    },
    monthlyBreakdown: monthlyCounts,
  };
};

export const calcRecent4WeeksCount = (records: DiaryRecord[]): number => {
  const last28Days = getLast28Days();
  const dateSet = new Set(last28Days.map((d) => formatDate(d)));
  return records.filter((r) => dateSet.has(r.date)).length;
};

export const checkExpectationDeviation = (
  records: DiaryRecord[],
  settings: ExpectationSettings
): boolean => {
  if (!settings.reminderEnabled) return false;

  const actualCount = calcRecent4WeeksCount(records);
  const expectedMin = settings.minTimesPerWeek * 4;
  const expectedMax = settings.maxTimesPerWeek * 4;

  const lowerBound = expectedMin * 0.8;
  const upperBound = expectedMax * 1.2;

  return actualCount < lowerBound || actualCount > upperBound;
};

export const getRatingHeatLevel = (rating: number): 0 | 1 | 2 | 3 | 4 | 5 => {
  if (rating <= 0) return 0;
  if (rating <= 1) return 1;
  if (rating <= 2) return 2;
  if (rating <= 3) return 3;
  if (rating <= 4) return 4;
  return 5;
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export interface MonthlyRatingPoint {
  month: number;
  avgRating: number;
  hasData: boolean;
}

export interface StablePeriodResult {
  startMonth: number;
  endMonth: number;
  stabilityScore: number;
  monthDiffAvg: number;
  range: number;
  stddev: number;
  length: number;
}

const MIN_STABLE_LENGTH = 3;
const STABILITY_THRESHOLD = 0.8;
const SCORE_TIE_EPSILON = 0.1;

const calcStddev = (vals: number[]): number => {
  if (vals.length < 2) return 0;
  const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
  return Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length);
};

const calcMonthDiffAvg = (vals: number[]): number => {
  if (vals.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < vals.length; i++) {
    sum += Math.abs(vals[i] - vals[i - 1]);
  }
  return sum / (vals.length - 1);
};

const calcStabilityScore = (
  monthDiffAvg: number,
  range: number,
  stddev: number
): number => {
  return monthDiffAvg * 0.5 + range * 0.3 + stddev * 0.2;
};

export const findStablePeriod = (
  points: MonthlyRatingPoint[]
): StablePeriodResult | null => {
  const valid = points.filter((p) => p.hasData);
  if (valid.length < MIN_STABLE_LENGTH) return null;

  const candidates: StablePeriodResult[] = [];

  const collectWindows = (seq: MonthlyRatingPoint[]) => {
    const n = seq.length;
    for (let len = MIN_STABLE_LENGTH; len <= n; len++) {
      for (let start = 0; start + len <= n; start++) {
        const window = seq.slice(start, start + len);
        const ratings = window.map((p) => p.avgRating);
        const monthDiffAvg = calcMonthDiffAvg(ratings);
        const range = Math.max(...ratings) - Math.min(...ratings);
        const stddev = calcStddev(ratings);
        const score = calcStabilityScore(monthDiffAvg, range, stddev);
        candidates.push({
          startMonth: window[0].month,
          endMonth: window[window.length - 1].month,
          stabilityScore: score,
          monthDiffAvg,
          range,
          stddev,
          length: len,
        });
      }
    }
  };

  let run: MonthlyRatingPoint[] = [];
  for (const p of points) {
    if (p.hasData) {
      run.push(p);
    } else {
      if (run.length >= MIN_STABLE_LENGTH) collectWindows(run);
      run = [];
    }
  }
  if (run.length >= MIN_STABLE_LENGTH) collectWindows(run);

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const scoreDiff = a.stabilityScore - b.stabilityScore;
    if (Math.abs(scoreDiff) > SCORE_TIE_EPSILON) {
      return scoreDiff;
    }
    if (a.length !== b.length) {
      return b.length - a.length;
    }
    return scoreDiff;
  });

  const best = candidates[0];
  if (best.stabilityScore >= STABILITY_THRESHOLD) return null;

  return best;
};

export const findBestMonth = (
  points: MonthlyRatingPoint[],
  mode: 'best' | 'worst'
): { month: number; avgRating: number } | null => {
  const valid = points.filter((p) => p.hasData);
  if (valid.length === 0) return null;
  const sorted = [...valid].sort((a, b) =>
    mode === 'best' ? b.avgRating - a.avgRating : a.avgRating - b.avgRating
  );
  return { month: sorted[0].month, avgRating: sorted[0].avgRating };
};
