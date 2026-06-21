import React from 'react';
import { Heart, X, Gift } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { todayStr, getSpecialDatesForDate } from '../utils/dateUtils';
import { cn } from '../lib/utils';

export const SpecialDateReminder: React.FC = () => {
  const specialDates = useAppStore((s) => s.specialDates);
  const records = useAppStore((s) => s.records);
  const dismissed = useAppStore((s) => s.specialDateDismissed);
  const dismissSpecialDateReminder = useAppStore((s) => s.dismissSpecialDateReminder);
  const openDetailModal = useAppStore((s) => s.openDetailModal);
  const settings = useAppStore((s) => s.settings);

  if (!settings.reminderEnabled) return null;

  const today = todayStr();
  const todaySpecialDates = getSpecialDatesForDate(today, specialDates);

  const todayRecord = records.find((r) => r.date === today);
  const hasRecordToday = !!todayRecord;

  const pending = todaySpecialDates.filter(
    (sd) => dismissed[sd.id] !== today && !hasRecordToday
  );

  if (pending.length === 0) return null;

  const first = pending[0];

  return (
    <div
      className={cn(
        'animate-slide-down relative overflow-hidden',
        'bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50',
        'border border-pink-200/50 rounded-2xl shadow-sm'
      )}
    >
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_80%_50%,rgba(255,105,180,0.2),transparent_50%)]" />

      <div className="relative flex items-start gap-3 p-4 pr-10">
        <div className="flex-shrink-0 p-2 rounded-full bg-gradient-to-br from-pink-200 to-rose-200/60">
          <Gift size={18} className="text-pink-500" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-warm-700 font-medium leading-relaxed">
            今天是 <span className="text-rose-500 font-semibold">{first.name}</span>
            {pending.length > 1 && ` 等 ${pending.length} 个特殊日子`}
            ，记得记录一下哦～
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => openDetailModal(today)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs font-medium shadow hover:shadow-md active:scale-95 transition-all"
            >
              <Heart size={12} className="fill-white" strokeWidth={2} />
              去记录
            </button>
          </div>
        </div>

        <button
          onClick={() => dismissSpecialDateReminder(first.id)}
          className="absolute top-3 right-3 p-1.5 rounded-full text-warm-400 hover:bg-white/60 hover:text-warm-500 active:scale-90 transition-all"
          aria-label="关闭提醒"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
