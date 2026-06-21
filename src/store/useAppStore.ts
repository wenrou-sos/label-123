import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, DiaryRecord, ExpectationSettings, SpecialDate } from '../types';
import {
  generateUUID,
  checkExpectationDeviation,
} from '../utils/statsUtils';
import { todayStr } from '../utils/dateUtils';

const DEFAULT_SETTINGS: ExpectationSettings = {
  minTimesPerWeek: 3,
  maxTimesPerWeek: 5,
  reminderEnabled: true,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      records: [],
      settings: DEFAULT_SETTINGS,
      specialDates: [],
      selectedDate: null,
      isDetailModalOpen: false,
      isSettingPanelOpen: false,
      isSearchModalOpen: false,
      showReminder: false,
      reminderDismissed: false,
      specialDateDismissed: {},

      setRecords: (records: DiaryRecord[]) => {
        set({ records });
        get().checkAndUpdateReminder();
      },

      addRecord: (recordData) => {
        const now = Date.now();
        const existingRecord = get().records.find((r) => r.date === recordData.date);

        if (existingRecord) {
          get().updateRecord(existingRecord.id, recordData);
          return;
        }

        const newRecord: DiaryRecord = {
          ...recordData,
          id: generateUUID(),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({ records: [...state.records, newRecord] }));
        get().checkAndUpdateReminder();
      },

      updateRecord: (id, data) => {
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...data, updatedAt: Date.now() } : r
          ),
        }));
        get().checkAndUpdateReminder();
      },

      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        }));
        get().checkAndUpdateReminder();
      },

      setSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
          reminderDismissed: false,
        }));
        get().checkAndUpdateReminder();
      },

      setSpecialDates: (specialDates: SpecialDate[]) => {
        set({ specialDates });
      },

      addSpecialDate: (data) => {
        const newItem: SpecialDate = {
          ...data,
          id: generateUUID(),
        };
        set((state) => ({ specialDates: [...state.specialDates, newItem] }));
      },

      updateSpecialDate: (id, data) => {
        set((state) => ({
          specialDates: state.specialDates.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        }));
      },

      deleteSpecialDate: (id) => {
        set((state) => ({
          specialDates: state.specialDates.filter((s) => s.id !== id),
        }));
      },

      selectDate: (date) => {
        set({ selectedDate: date });
      },

      openDetailModal: (date) => {
        const d = date || todayStr();
        set({ selectedDate: d, isDetailModalOpen: true });
      },

      closeDetailModal: () => {
        set({ isDetailModalOpen: false, selectedDate: null });
      },

      openSettingPanel: () => {
        set({ isSettingPanelOpen: true });
      },

      closeSettingPanel: () => {
        set({ isSettingPanelOpen: false });
      },

      openSearchModal: () => {
        set({ isSearchModalOpen: true });
      },

      closeSearchModal: () => {
        set({ isSearchModalOpen: false });
      },

      dismissReminder: () => {
        set({ showReminder: false, reminderDismissed: true });
      },

      dismissSpecialDateReminder: (id) => {
        set((state) => ({
          specialDateDismissed: {
            ...state.specialDateDismissed,
            [id]: todayStr(),
          },
        }));
      },

      checkAndUpdateReminder: () => {
        const { records, settings, reminderDismissed } = get();
        const isDeviating = checkExpectationDeviation(records, settings);
        if (!isDeviating) {
          set({ showReminder: false, reminderDismissed: false });
        } else if (!reminderDismissed) {
          set({ showReminder: true });
        }
      },
    }),
    {
      name: 'private-diary-storage',
      version: 3,
      partialize: (state) => ({
        records: state.records,
        settings: state.settings,
        specialDates: state.specialDates,
        specialDateDismissed: state.specialDateDismissed,
      }),
      migrate: (persistedState: unknown, version: number) => {
        const state = (persistedState ?? {}) as {
          records?: DiaryRecord[];
          settings?: ExpectationSettings;
          specialDates?: SpecialDate[];
          specialDateDismissed?: Record<string, string>;
        };
        const records = state.records ?? [];

        let next = {
          ...state,
          records: records.filter((r) => !r.id?.startsWith('mock-')),
        };

        if (version < 3) {
          next = {
            ...next,
            specialDates: [],
            specialDateDismissed: {},
          };
        }

        return next;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkAndUpdateReminder();
        }
      },
    }
  )
);
