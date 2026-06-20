import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, DiaryRecord, ExpectationSettings } from '../types';
import {
  generateMockRecords,
  generateUUID,
  checkExpectationDeviation,
} from '../utils/statsUtils';
import { todayStr } from '../utils/dateUtils';

const DEFAULT_SETTINGS: ExpectationSettings = {
  minTimesPerWeek: 3,
  maxTimesPerWeek: 5,
  reminderEnabled: true,
};

const initialRecords = generateMockRecords();
const initialShouldShowReminder = checkExpectationDeviation(initialRecords, DEFAULT_SETTINGS);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      records: initialRecords,
      settings: DEFAULT_SETTINGS,
      selectedDate: null,
      isDetailModalOpen: false,
      isSettingPanelOpen: false,
      showReminder: initialShouldShowReminder,

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
        set((state) => ({ settings: { ...state.settings, ...settings } }));
        get().checkAndUpdateReminder();
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

      dismissReminder: () => {
        set({ showReminder: false });
      },

      checkAndUpdateReminder: () => {
        const { records, settings } = get();
        const shouldShow = checkExpectationDeviation(records, settings);
        set({ showReminder: shouldShow });
      },
    }),
    {
      name: 'private-diary-storage',
      partialize: (state) => ({
        records: state.records,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.checkAndUpdateReminder();
        }
      },
    }
  )
);
