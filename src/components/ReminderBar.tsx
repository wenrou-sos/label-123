import React from 'react';
import { Heart, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useExpectationCheck } from '../hooks/useExpectationCheck';
import { cn } from '../lib/utils';

export const ReminderBar: React.FC = () => {
  const { showReminder, deviationType } = useExpectationCheck();
  const dismissReminder = useAppStore((s) => s.dismissReminder);
  const settings = useAppStore((s) => s.settings);

  if (!showReminder || !settings.reminderEnabled) return null;

  const reminderText =
    deviationType === 'low'
      ? '最近似乎有些忙碌，记得留些二人世界的时间哦'
      : '记录频率很高哦，你们的感情一定很甜蜜～';

  return (
    <div
      className={cn(
        'animate-slide-down relative overflow-hidden',
        'bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50',
        'border border-peach-300/40 rounded-2xl shadow-sm'
      )}
    >
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_50%,rgba(255,160,122,0.2),transparent_50%)]" />

      <div className="relative flex items-start gap-3 p-4 pr-10">
        <div className="flex-shrink-0 p-2 rounded-full bg-gradient-to-br from-rose-200 to-peach-300/60">
          <Heart
            size={18}
            className="text-rose-500 fill-rose-400 animate-heartbeat"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-warm-600 font-medium leading-relaxed">
            {reminderText}
          </p>
          <p className="mt-1 text-xs text-warm-400">
            期望频率：每周 {settings.minTimesPerWeek}-{settings.maxTimesPerWeek} 次
          </p>
        </div>

        <button
          onClick={dismissReminder}
          className="absolute top-3 right-3 p-1.5 rounded-full text-warm-400 hover:bg-white/60 hover:text-warm-500 active:scale-90 transition-all"
          aria-label="关闭提醒"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
