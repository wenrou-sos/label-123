import React, { useState, useEffect } from 'react';
import { X, Target, Bell, BellOff, CheckCircle2, Heart, Calendar } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useExpectationCheck } from '../hooks/useExpectationCheck';
import { SpecialDateManager } from './SpecialDateManager';
import { cn } from '../lib/utils';
import { ExpectationSettings } from '../types';

export const SettingPanel: React.FC = () => {
  const isOpen = useAppStore((s) => s.isSettingPanelOpen);
  const closeSettingPanel = useAppStore((s) => s.closeSettingPanel);
  const setSettings = useAppStore((s) => s.setSettings);
  const currentSettings = useAppStore((s) => s.settings);
  const { actualCount4Weeks, weeklyActualAvg, expectedMin4Weeks, expectedMax4Weeks } =
    useExpectationCheck();

  const [localSettings, setLocalSettings] = useState<ExpectationSettings>(currentSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(currentSettings);
    setHasChanges(false);
  }, [currentSettings, isOpen]);

  useEffect(() => {
    setHasChanges(
      localSettings.minTimesPerWeek !== currentSettings.minTimesPerWeek ||
        localSettings.maxTimesPerWeek !== currentSettings.maxTimesPerWeek ||
        localSettings.reminderEnabled !== currentSettings.reminderEnabled
    );
  }, [localSettings, currentSettings]);

  const handleMinChange = (val: number) => {
    const newMin = Math.max(1, Math.min(val, localSettings.maxTimesPerWeek));
    setLocalSettings((s) => ({ ...s, minTimesPerWeek: newMin }));
  };

  const handleMaxChange = (val: number) => {
    const newMax = Math.max(localSettings.minTimesPerWeek, Math.min(val, 7));
    setLocalSettings((s) => ({ ...s, maxTimesPerWeek: newMax }));
  };

  const handleSave = () => {
    setSettings(localSettings);
    closeSettingPanel();
  };

  const weeklyMin = localSettings.minTimesPerWeek;
  const weeklyMax = localSettings.maxTimesPerWeek;
  const statusPercent = Math.min(
    100,
    Math.max(0, ((weeklyActualAvg - 0) / Math.max(weeklyMax, 1)) * 100)
  );
  const minPercent = ((weeklyMin - 0.5) / 7) * 100;
  const maxPercent = ((weeklyMax + 0.5) / 7) * 100;

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-warm-700/40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeSettingPanel}
      />

      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 safe-bottom transition-transform duration-500',
          'bg-gradient-to-t from-white to-ivory-50 rounded-t-[28px] shadow-2xl',
          'max-w-lg mx-auto',
          isOpen ? 'translate-y-0' : 'translate-y-full'
        )}
        style={{ touchAction: 'none' }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-warm-200/60" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-rose-100/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-rose-100 to-rose-200">
              <Target size={18} className="text-rose-500" strokeWidth={2} />
            </div>
            <h3 className="font-serif font-semibold text-lg text-warm-600">期望值设置</h3>
          </div>
          <button
            onClick={closeSettingPanel}
            className="p-2 rounded-full text-warm-400 hover:bg-rose-50 hover:text-warm-600 active:scale-90 transition-all"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        <div className="px-5 py-5 max-h-[65vh] overflow-y-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="label-text !mb-0 flex items-center gap-2">
                <Heart size={16} className="text-rose-400 fill-rose-300" strokeWidth={1.5} />
                期望记录频率
              </label>
              <span className="text-sm font-semibold text-rose-500 font-serif">
                每周 {weeklyMin} - {weeklyMax} 次
              </span>
            </div>

            <div className="relative px-2 mb-4">
              <div className="relative h-3 bg-warm-100 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-rose-200 to-peach-300/70 rounded-full"
                  style={{
                    left: `${minPercent}%`,
                    width: `${maxPercent - minPercent}%`,
                  }}
                />
                <div
                  className="absolute top-0 h-full w-1 bg-rose-500 rounded-full shadow transition-all duration-300"
                  style={{ left: `${statusPercent}%` }}
                />
              </div>

              <div className="relative mt-3 h-10">
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={1}
                  value={localSettings.minTimesPerWeek}
                  onChange={(e) => handleMinChange(Number(e.target.value))}
                  className="absolute inset-x-0 w-full h-10 appearance-none bg-transparent pointer-events-auto z-20 cursor-pointer"
                  style={{ WebkitAppearance: 'slider-horizontal' }}
                />
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={1}
                  value={localSettings.maxTimesPerWeek}
                  onChange={(e) => handleMaxChange(Number(e.target.value))}
                  className="absolute inset-x-0 w-full h-10 appearance-none bg-transparent pointer-events-auto z-10 cursor-pointer"
                  style={{ WebkitAppearance: 'slider-horizontal' }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-warm-400 mt-1 px-0.5">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <span key={n} className={cn(
                    n >= weeklyMin && n <= weeklyMax
                      ? 'text-rose-500 font-semibold'
                      : ''
                  )}>
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-peach-300/20 border border-rose-100">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white shadow-sm">
                  <CheckCircle2 size={18} className="text-emerald-500" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-warm-600 mb-1">当前实际频率</p>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="stat-number text-2xl">{weeklyActualAvg}</span>
                    <span className="text-sm text-warm-500">次 / 周</span>
                    <span className="text-xs text-warm-400">
                      （近4周共 {actualCount4Weeks} 次）
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        weeklyActualAvg < weeklyMin
                          ? 'bg-amber-400'
                          : weeklyActualAvg > weeklyMax
                          ? 'bg-emerald-400'
                          : 'bg-rose-400'
                      )}
                      style={{ width: `${statusPercent}%` }}
                    />
                  </div>
                  <p className="text-xs mt-2 text-warm-500">
                    期望范围：近4周 {expectedMin4Weeks} - {expectedMax4Weeks} 次
                  </p>
                </div>
              </div>
            </div>
          </div>

          <SpecialDateManager />

          <div className="mb-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-ivory-50 to-warm-50 border border-warm-100">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'p-2 rounded-xl transition-colors',
                    localSettings.reminderEnabled
                      ? 'bg-gradient-to-br from-rose-100 to-peach-300/40'
                      : 'bg-warm-100'
                  )}
                >
                  {localSettings.reminderEnabled ? (
                    <Bell size={18} className="text-rose-500" strokeWidth={2} />
                  ) : (
                    <BellOff size={18} className="text-warm-400" strokeWidth={2} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-warm-600">温馨提醒</p>
                  <p className="text-xs text-warm-400 mt-0.5">
                    偏差超过20%时温和提醒
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setLocalSettings((s) => ({ ...s, reminderEnabled: !s.reminderEnabled }))
                }
                className={cn(
                  'relative w-14 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2',
                  localSettings.reminderEnabled
                    ? 'bg-gradient-to-r from-rose-400 to-rose-500'
                    : 'bg-warm-200'
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center',
                    localSettings.reminderEnabled ? 'left-7' : 'left-1'
                  )}
                >
                  {localSettings.reminderEnabled ? (
                    <Heart size={12} className="text-rose-500 fill-rose-400" strokeWidth={1.5} />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-warm-300" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-rose-100/50 bg-white/60 backdrop-blur">
          <div className="flex gap-3">
            <button
              onClick={closeSettingPanel}
              className="flex-1 btn-secondary py-3"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={cn(
                'flex-1 btn-primary py-3',
                !hasChanges && 'opacity-50 cursor-not-allowed active:scale-100'
              )}
            >
              保存设置
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
