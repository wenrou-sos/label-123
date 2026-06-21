export interface DiaryRecord {
  id: string;
  date: string;
  rating: number;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ExpectationSettings {
  minTimesPerWeek: number;
  maxTimesPerWeek: number;
  reminderEnabled: boolean;
}

export interface MonthlyStats {
  year: number;
  month: number;
  totalCount: number;
  avgRating: number;
  maxStreak: number;
  compareToLastMonth: {
    countChange: 'up' | 'down' | 'same';
    countChangePercent: number;
    ratingChange: 'up' | 'down' | 'same';
  };
}

export interface YearlyStats {
  year: number;
  totalCount: number;
  avgMonthlyCount: number;
  avgRating: number;
  highestMonth: { month: number; count: number };
  lowestMonth: { month: number; count: number };
  compareToLastYear: {
    direction: 'up' | 'down' | 'same';
    changePercent: number;
    lastYearCount: number;
  };
  monthlyBreakdown: { month: number; count: number; avgRating: number }[];
}

export interface HeatmapCellData {
  date: string;
  dateObj: Date;
  rating: number;
  level: 0 | 1 | 2 | 3 | 4 | 5;
  hasRecord: boolean;
}

export interface MonthHeatmapData {
  year: number;
  month: number;
  monthLabel: string;
  cells: (HeatmapCellData | null)[];
}

export interface SpecialDate {
  id: string;
  date: string;
  name: string;
  emoji: string;
  repeatYearly: boolean;
}

export interface AppState {
  records: DiaryRecord[];
  settings: ExpectationSettings;
  specialDates: SpecialDate[];
  selectedDate: string | null;
  isDetailModalOpen: boolean;
  isSettingPanelOpen: boolean;
  isSearchModalOpen: boolean;
  showReminder: boolean;
  reminderDismissed: boolean;
  specialDateDismissed: Record<string, string>;
  setRecords: (records: DiaryRecord[]) => void;
  addRecord: (record: Omit<DiaryRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecord: (id: string, data: Partial<Omit<DiaryRecord, 'id' | 'createdAt'>>) => void;
  deleteRecord: (id: string) => void;
  setSettings: (settings: Partial<ExpectationSettings>) => void;
  setSpecialDates: (specialDates: SpecialDate[]) => void;
  addSpecialDate: (data: Omit<SpecialDate, 'id'>) => void;
  updateSpecialDate: (id: string, data: Partial<Omit<SpecialDate, 'id'>>) => void;
  deleteSpecialDate: (id: string) => void;
  selectDate: (date: string | null) => void;
  openDetailModal: (date?: string) => void;
  closeDetailModal: () => void;
  openSettingPanel: () => void;
  closeSettingPanel: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  dismissReminder: () => void;
  dismissSpecialDateReminder: (id: string) => void;
  checkAndUpdateReminder: () => void;
}
