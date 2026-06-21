import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { HeatmapCalendar } from '../components/HeatmapCalendar/HeatmapCalendar';
import { MonthlyStatsCard } from '../components/MonthlyStatsCard';
import { RatingTrendChart } from '../components/RatingTrendChart';
import { ReminderBar } from '../components/ReminderBar';
import { SpecialDateReminder } from '../components/SpecialDateReminder';
import { RecordDetailModal } from '../components/RecordDetailModal';
import { SettingPanel } from '../components/SettingPanel';
import { SearchModal } from '../components/SearchModal';
import { Heart, PenLine, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { todayStr } from '../utils/dateUtils';

export const Home: React.FC = () => {
  const openDetailModal = useAppStore((s) => s.openDetailModal);

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader title="二人时光" showBack={false} showReview={true} />

      <main className="flex-1 container max-w-lg mx-auto px-4 py-5 pb-32 space-y-5">
        <div
          className="relative overflow-hidden rounded-3xl p-6 animate-slide-up"
          style={{
            background:
              'linear-gradient(135deg, #FF6B9D 0%, #FF87AB 40%, #FFA07A 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-peach-400 blur-3xl" />
          </div>
          <div className="absolute top-4 right-4 text-white/30 animate-pulse-soft">
            <Heart size={80} strokeWidth={1} className="fill-current" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Heart size={16} className="fill-white" strokeWidth={2} />
              <span className="text-xs font-medium tracking-wider uppercase">
                Our Private Diary
              </span>
            </div>
            <h2 className="font-serif font-bold text-3xl text-white mb-1 leading-tight">
              记录每一个
              <br />
              值得珍藏的瞬间
            </h2>
            <p className="text-white/75 text-sm mt-2 mb-5 max-w-[260px] leading-relaxed">
              用文字和心情评分，留住属于你们的二人世界回忆
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => openDetailModal(todayStr())}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-rose-500 font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all"
              >
                <PenLine size={16} strokeWidth={2.2} />
                记录今天
              </button>
              <Link
                to="/review"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur text-white font-medium hover:bg-white/25 active:scale-95 transition-all border border-white/30"
              >
                <BarChart3 size={16} strokeWidth={2} />
                年度复盘
              </Link>
            </div>
          </div>
        </div>

        <ReminderBar />
        <SpecialDateReminder />

        <HeatmapCalendar />

        <MonthlyStatsCard />

        <RatingTrendChart />

        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-center py-3">
            <p className="text-xs text-warm-400 flex items-center justify-center gap-1.5">
              <Heart size={12} className="text-rose-400 fill-rose-300" strokeWidth={1.5} />
              所有数据安全存储在本地，仅你可见
            </p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 z-30 pointer-events-none">
        <div className="h-24 bg-gradient-to-t from-ivory-100 via-ivory-100/80 to-transparent pointer-events-none" />
      </div>

      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <button
          onClick={() => openDetailModal(todayStr())}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-soft flex items-center justify-center hover:shadow-lg active:scale-90 transition-all animate-bounce-in"
          aria-label="记录今天"
        >
          <PenLine size={22} strokeWidth={2.2} />
        </button>
      </div>

      <RecordDetailModal />
      <SettingPanel />
      <SearchModal />
    </div>
  );
};
