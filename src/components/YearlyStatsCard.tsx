import React from 'react';
import { useYearlyStats } from '../hooks/useYearlyStats';
import { TrendingUp, TrendingDown, Minus, CalendarDays, Award, ArrowDown, ArrowUp } from 'lucide-react';
import { cn, formatMonthShort } from '../lib/utils';

const TrendBadge: React.FC<{
  direction: 'up' | 'down' | 'same';
  percent: number;
}> = ({ direction, percent }) => {
  const base = 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold';

  if (direction === 'up') {
    return (
      <span className={cn(base, 'bg-emerald-50 text-emerald-600 border border-emerald-100')}>
        <ArrowUp size={14} strokeWidth={2.5} />
        同比增长 {percent}%
      </span>
    );
  }
  if (direction === 'down') {
    return (
      <span className={cn(base, 'bg-rose-50 text-rose-600 border border-rose-100')}>
        <ArrowDown size={14} strokeWidth={2.5} />
        同比下降 {Math.abs(percent)}%
      </span>
    );
  }
  return (
    <span className={cn(base, 'bg-warm-50 text-warm-500 border border-warm-100')}>
      <Minus size={14} strokeWidth={2.5} />
      与去年持平
    </span>
  );
};

export const YearlyStatsCard: React.FC = () => {
  const stats = useYearlyStats();
  const maxCount = Math.max(...stats.monthlyBreakdown.map((m) => m.count), 1);

  return (
    <div className="space-y-5">
      <div className="card-gradient animate-slide-up" style={{ animationDelay: '0.02s' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-rose-100 to-rose-200">
              <CalendarDays size={18} className="text-rose-500" strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-serif font-semibold text-warm-600 text-lg">
                {stats.year} 年度总览
              </h2>
              <p className="text-xs text-warm-400 mt-0.5">全年记录回顾</p>
            </div>
          </div>
          <TrendBadge
            direction={stats.compareToLastYear.direction}
            percent={stats.compareToLastYear.changePercent}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-soft overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_60%)]" />
            <p className="relative text-xs text-white/75 mb-1">全年记录</p>
            <p className="relative font-serif font-bold text-3xl">{stats.totalCount}</p>
            <p className="relative text-xs text-white/60 mt-2">
              去年：{stats.compareToLastYear.lastYearCount} 次
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-ivory-50 to-rose-50">
            <p className="text-xs text-warm-400 mb-1">月均频率</p>
            <p className="font-serif font-bold text-2xl stat-number">
              {stats.avgMonthlyCount}
            </p>
            <p className="text-xs text-warm-400 mt-2">次 / 月</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-ivory-50 to-peach-300/20">
            <p className="text-xs text-warm-400 mb-1">完成度</p>
            <p className="font-serif font-bold text-2xl stat-number">
              {Math.min(100, Math.round((stats.totalCount / 365) * 100))}%
            </p>
            <div className="mt-2 h-1.5 bg-warm-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 to-peach-400 transition-all duration-700"
                style={{ width: `${Math.min(100, (stats.totalCount / 365) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <Award size={16} className="text-emerald-500" strokeWidth={2} />
              <span className="text-xs font-medium text-emerald-600">最高频月份</span>
            </div>
            <p className="font-serif font-bold text-2xl text-emerald-700">
              {stats.highestMonth.month}月
            </p>
            <p className="text-xs text-emerald-600/70 mt-1">
              共 {stats.highestMonth.count} 次记录
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <Award size={16} className="text-amber-600" strokeWidth={2} />
              <span className="text-xs font-medium text-amber-700">待提升月份</span>
            </div>
            <p className="font-serif font-bold text-2xl text-amber-700">
              {stats.lowestMonth.month}月
            </p>
            <p className="text-xs text-amber-700/70 mt-1">
              仅 {stats.lowestMonth.count} 次记录
            </p>
          </div>
        </div>
      </div>

      <div className="card-gradient animate-slide-up" style={{ animationDelay: '0.08s' }}>
        <h3 className="font-serif font-semibold text-warm-600 text-base mb-5 flex items-center gap-2">
          <TrendingUp size={18} className="text-rose-500" strokeWidth={2} />
          月度频次分布
        </h3>

        <div className="space-y-3">
          {stats.monthlyBreakdown.map((m, idx) => (
            <div
              key={m.month}
              className="flex items-center gap-3 animate-slide-up"
              style={{ animationDelay: `${0.1 + idx * 0.03}s` }}
            >
              <span className="w-10 text-sm font-medium text-warm-500 text-right shrink-0">
                {formatMonthShort(0, m.month)}
              </span>
              <div className="flex-1 h-7 bg-warm-50 rounded-xl overflow-hidden relative">
                <div
                  className="h-full rounded-xl bg-gradient-to-r from-rose-300 via-rose-400 to-rose-500 transition-all duration-700 ease-out relative group"
                  style={{
                    width: `${(m.count / maxCount) * 100}%`,
                    minWidth: m.count > 0 ? '12%' : '0',
                  }}
                >
                  <div className="absolute inset-0 opacity-30 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] animate-[shimmer_2s_infinite]" />
                </div>
                {m.count > 0 && (
                  <span
                    className={cn(
                      'absolute top-1/2 -translate-y-1/2 text-xs font-medium transition-all',
                      (m.count / maxCount) * 100 > 25
                        ? 'left-3 text-white'
                        : 'text-warm-500'
                    )}
                    style={{ left: (m.count / maxCount) * 100 > 25 ? '12px' : `${Math.max(10, (m.count / maxCount) * 100 + 8)}%` }}
                  >
                    {m.count}次
                    {m.avgRating > 0 && (
                      <span className="opacity-70 ml-1">· {m.avgRating}★</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
