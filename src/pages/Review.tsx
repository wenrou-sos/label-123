import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { YearlyStatsCard } from '../components/YearlyStatsCard';
import { RatingTrendChart } from '../components/RatingTrendChart';
import { SettingPanel } from '../components/SettingPanel';
import { RecordDetailModal } from '../components/RecordDetailModal';
import { SearchModal } from '../components/SearchModal';
import { Sparkles, Heart } from 'lucide-react';
import { useYearlyStats } from '../hooks/useYearlyStats';
import { cn } from '../lib/utils';

export const Review: React.FC = () => {
  const stats = useYearlyStats();

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader title="年度复盘" showBack={true} showHome={true} />

      <main className="flex-1 container max-w-lg mx-auto px-4 py-5 pb-24 space-y-5">
        <div
          className="relative overflow-hidden rounded-3xl p-6 animate-slide-up"
          style={{
            background:
              'linear-gradient(135deg, #FFF1F5 0%, #FFE4EC 50%, #FFF8E1 100%)',
          }}
        >
          <div className="absolute top-3 right-4 text-rose-200 animate-pulse-soft">
            <Sparkles size={48} strokeWidth={1} />
          </div>
          <div className="absolute -bottom-4 -left-4 text-rose-300/60">
            <Heart size={60} className="fill-current" strokeWidth={1} />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 text-rose-500 mb-2">
              <Sparkles size={16} strokeWidth={2.2} />
              <span className="text-xs font-semibold tracking-wide">
                {stats.year} YEAR IN REVIEW
              </span>
            </div>
            <h2 className="font-serif font-bold text-3xl text-warm-600 mb-2 leading-tight">
              {stats.year}年，
              <br />
              我们一起走过
            </h2>
            <p className="text-sm text-warm-500 leading-relaxed max-w-[280px]">
              {stats.totalCount > 0 ? (
                <>
                  共记录了{' '}
                  <span className="stat-number font-bold">{stats.totalCount}</span>{' '}
                  个美好瞬间，
                  <br />
                  坚持的每一天都闪闪发光 ✨
                </>
              ) : (
                <>新的一年，从第一条记录开始吧～期待与你一起创造更多回忆</>
              )}
            </p>

            <div className="flex items-end justify-between mt-5">
              <div className="flex items-baseline gap-1">
                <span
                  className={cn(
                    'stat-number font-bold text-5xl leading-none',
                    stats.totalCount === 0 && 'opacity-40'
                  )}
                >
                  {stats.totalCount}
                </span>
                <span className="text-sm text-warm-500 font-medium ml-1">
                  条回忆
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-warm-400">月均</span>
                <span className="font-serif font-bold text-warm-600 text-xl">
                  {stats.avgMonthlyCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        <RatingTrendChart />

        <YearlyStatsCard />

        <div
          className="card-gradient animate-slide-up text-center py-6"
          style={{ animationDelay: '0.15s' }}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
            <Heart
              size={20}
              className="text-rose-500 fill-rose-400 animate-heartbeat"
            />
          </div>
          <p className="font-serif font-semibold text-warm-600 text-lg">
            陪伴是最长情的告白
          </p>
          <p className="text-xs text-warm-400 mt-1.5 leading-relaxed max-w-[260px] mx-auto">
            愿每一个平凡的日子，都有不平凡的温柔
          </p>
        </div>
      </main>

      <RecordDetailModal />
      <SettingPanel />
      <SearchModal />
    </div>
  );
};
