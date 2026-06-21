import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subMonths,
  addMonths,
  isSameMonth,
  isSameDay,
  getDay,
  getDaysInMonth,
  subDays,
  startOfYear,
  endOfYear,
  getMonth,
  getYear,
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { SpecialDate } from '../types';

export const DATE_FORMAT = 'yyyy-MM-dd';

export const formatDate = (date: Date | string, fmt: string = DATE_FORMAT): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, fmt, { locale: zhCN });
};

export const formatDateCN = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy年M月d日', { locale: zhCN });
};

export const formatMonthCN = (year: number, month: number): string => {
  return `${year}年${month}月`;
};

export const formatMonthShort = (year: number, month: number): string => {
  return `${month}月`;
};

export const getMonthLabel = (date: Date): string => {
  return format(date, 'M月', { locale: zhCN });
};

export const getWeekdayLabels = (): string[] => {
  return ['日', '一', '二', '三', '四', '五', '六'];
};

export const todayStr = (): string => {
  return formatDate(new Date());
};

export const parseDate = (dateStr: string): Date => {
  return parseISO(dateStr);
};

export const getPast12Months = (endDate: Date = new Date()): Date[] => {
  const months: Date[] = [];
  for (let i = 11; i >= 0; i--) {
    months.push(startOfMonth(subMonths(endDate, i)));
  }
  return months;
};

export interface MonthCalendarDay {
  date: Date;
  dateStr: string;
  inMonth: boolean;
  dayOfWeek: number;
  weekIndex: number;
}

export const getMonthCalendar = (year: number, month: number): MonthCalendarDay[] => {
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  return days.map((d, idx) => ({
    date: d,
    dateStr: formatDate(d),
    inMonth: isSameMonth(d, monthStart),
    dayOfWeek: getDay(d),
    weekIndex: Math.floor(idx / 7),
  }));
};

export const getMaxWeeksInMonth = (): number => 6;

export const daysInMonth = (year: number, month: number): number => {
  return getDaysInMonth(new Date(year, month - 1, 1));
};

export const getLast28Days = (): Date[] => {
  const today = new Date();
  const start = subDays(today, 27);
  return eachDayOfInterval({ start, end: today });
};

export const getDaysInMonthInterval = (year: number, month: number): Date[] => {
  const start = new Date(year, month - 1, 1);
  const end = endOfMonth(start);
  return eachDayOfInterval({ start, end });
};

export const getDaysInYearInterval = (year: number): Date[] => {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(start);
  return eachDayOfInterval({ start, end });
};

export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  return date >= start && date <= end;
};

export const getMonthNum = (date: Date): number => getMonth(date) + 1;
export const getYearNum = (date: Date): number => getYear(date);

export const sameDay = (d1: Date | string, d2: Date | string): boolean => {
  const a = typeof d1 === 'string' ? parseDate(d1) : d1;
  const b = typeof d2 === 'string' ? parseDate(d2) : d2;
  return isSameDay(a, b);
};

export const prevMonth = (year: number, month: number): { year: number; month: number } => {
  const d = subMonths(new Date(year, month - 1, 1), 1);
  return { year: getYear(d), month: getMonth(d) + 1 };
};

export const nextMonthFunc = (year: number, month: number): { year: number; month: number } => {
  const d = addMonths(new Date(year, month - 1, 1), 1);
  return { year: getYear(d), month: getMonth(d) + 1 };
};

const getMonthDayKey = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MM-dd');
};

export const isSpecialDate = (date: string, specialDate: SpecialDate): boolean => {
  if (specialDate.repeatYearly) {
    return getMonthDayKey(date) === getMonthDayKey(specialDate.date);
  }
  return date === specialDate.date;
};

export const getSpecialDatesForDate = (
  date: string,
  specialDates: SpecialDate[]
): SpecialDate[] => {
  return specialDates.filter((sd) => isSpecialDate(date, sd));
};
