import React from 'react';
import { useMonthlyStats } from '../hooks/useMonthlyStats';
import { TrendingUp, TrendingDown, Minus, FileText, Star, Flame } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { cn } from '../lib/utils';
import { formatMonthCN } from '../utils/dateUtils';
import { getYear, getMonth } from 'date-fns';

const TrendIcon: React.FC<{ direction: 'up' | 'down' | 'same'; className?: string }> = ({
  direction,
  className = '',
}) => {
  const iconClass = cn('size-4', className);
  if (direction === 'up') return <TrendingUp className={cn(iconClass, 'text-emerald-500')} strokeWidth={2.2} />;
  if (direction === 'down') return <TrendingDown className={cn(iconClass, 'text-rose-500')} strokeWidth={2.2} />;
  return <Minus className={cn(iconClass, 'text-warm-400')} strokeWidth={2.2} />;
};

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  highlight?: boolean;
  delay?: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, subValue, highlight, delay }) => (
  <div
    className={cn(
      'relative p-4 rounded-2xl overflow-hidden animate-slide-up',
      highlight
        ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-soft'
        : 'bg-gradient-to-br from-ivory-50 to-rose-50'
    )}
    style={{ animationDelay: delay }}
  >
    {highlight && (
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_60%)]" />
    )}
    <div className="relative flex items-start justify-between">
      <div
        className={cn(
          'p-2 rounded-xl mb-2',
          highlight ? 'bg-white/20' : 'bg-white/80 shadow-sm'
        )}
      >
        {icon}
      </div>
      {subValue}
    </div>
    <div className="relative">
      <p
        className={cn(
          'text-xs mb-1',
          highlight ? 'text-white/75' : 'text-warm-400'
        )}
      >
        {label}
      </p>
      <div
        className={cn(
          'font-serif font-bold leading-none',
          highlight ? 'text-white' : 'stat-number text-2xl'
        )}
      >
        {value}
      </div>
    </div>
  </div>
);

export const MonthlyStatsCard: React.FC = () => {
  const stats = useMonthlyStats();
  const now = new Date();
  const currentYear = getYear(now);
  const currentMonth = getMonth(now) + 1;

  return (
    <div className="card-gradient animate-slide-up" style={{ animationDelay: '0.05s' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-peach-300/40 to-rose-200">
            <FileText size={18} className="text-rose-500" strokeWidth={2} />
          </div>
          <div>
            <h2 className="font-serif font-semibold text-warm-600 text-lg">
              {formatMonthCN(currentYear, currentMonth)}统计
            </h2>
            <p className="text-xs text-warm-400 mt-0.5">本月记录全览</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatItem
          delay="0.08s"
          icon={<FileText size={16} className="text-rose-500" strokeWidth={2} />}
          label="记录次数"
          value={
            <span className="flex items-baseline gap-1">
              <span className="text-3xl">{stats.totalCount}</span>
              <span
                className={cn(
                  'text-xs font-medium',
                  stats.compareToLastMonth.countChange === 'up' && 'text-emerald-500',
                  stats.compareToLastMonth.countChange === 'down' && 'text-rose-500',
                  stats.compareToLastMonth.countChange === 'same' && 'text-warm-400'
                )}
              >
                {stats.compareToLastMonth.countChange === 'up' && '+'}
                {stats.compareToLastMonth.countChangePercent}%
              </span>
            </span>
          }
          subValue={
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white/80">
              <TrendIcon direction={stats.compareToLastMonth.countChange} />
            </div>
          }
        />

        <StatItem
          delay="0.12s"
          highlight
          icon={<Star size={16} className="text-white" strokeWidth={2} />}
          label="平均评分"
          value={
            <div className="flex items-center gap-2">
              <span className="text-3xl">{stats.avgRating.toFixed(1)}</span>
              <RatingStars rating={stats.avgRating} readOnly size={12} />
            </div>
          }
          subValue={
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white/20">
              <TrendIcon
                direction={stats.compareToLastMonth.ratingChange}
                className={cn(
                  stats.compareToLastMonth.ratingChange === 'up' && 'text-emerald-300',
                  stats.compareToLastMonth.ratingChange === 'down' && 'text-rose-200',
                  stats.compareToLastMonth.ratingChange === 'same' && 'text-white/60'
                )}
              />
            </div>
          }
        />

        <StatItem
          delay="0.16s"
          icon={<Flame size={16} className="text-peach-500" strokeWidth={2} />}
          label="最高连续记录"
          value={
            <span className="flex items-baseline gap-1">
              <span className="text-3xl">{stats.maxStreak}</span>
              <span className="text-xs font-medium text-warm-400">天</span>
            </span>
          }
        />

        <StatItem
          delay="0.20s"
          icon={<TrendingUp size={16} className="text-emerald-500" strokeWidth={2} />}
          label="环比变化"
          value={
            <div className="flex items-center gap-2">
              <TrendIcon
                direction={stats.compareToLastMonth.countChange}
                className="!size-6"
              />
              <div className="flex flex-col">
                <span
                  className={cn(
                    'text-sm font-semibold',
                    stats.compareToLastMonth.countChange === 'up' && 'text-emerald-500',
                    stats.compareToLastMonth.countChange === 'down' && 'text-rose-500',
                    stats.compareToLastMonth.countChange === 'same' && 'text-warm-500'
                  )}
                >
                  {stats.compareToLastMonth.countChange === 'up' && '次数上升'}
                  {stats.compareToLastMonth.countChange === 'down' && '次数下降'}
                  {stats.compareToLastMonth.countChange === 'same' && '与上月持平'}
                </span>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};
