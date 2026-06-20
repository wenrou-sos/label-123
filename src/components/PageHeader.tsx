import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, BarChart3, Home, Settings } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  showHome?: boolean;
  showReview?: boolean;
  showSettings?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showBack = false,
  showHome = true,
  showReview = true,
  showSettings = true,
}) => {
  const location = useLocation();
  const openSettingPanel = useAppStore((s) => s.openSettingPanel);
  const isReviewPage = location.pathname === '/review';

  return (
    <header className="sticky top-0 z-40 bg-ivory-100/80 backdrop-blur-md border-b border-rose-100/50 safe-top">
      <div className="container max-w-lg mx-auto flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2 w-20">
          {showBack && (
            <Link
              to="/"
              className="p-2 -ml-2 rounded-full text-warm-500 hover:bg-rose-50 active:scale-95 transition-all"
              aria-label="返回"
            >
              <ChevronLeft size={22} strokeWidth={2} />
            </Link>
          )}
        </div>

        <h1 className="font-serif font-semibold text-lg text-warm-600 tracking-wide">
          {title}
        </h1>

        <div className="flex items-center gap-1 w-20 justify-end">
          {showHome && isReviewPage && (
            <Link
              to="/"
              className="p-2 rounded-full text-warm-500 hover:bg-rose-50 active:scale-95 transition-all"
              aria-label="首页"
            >
              <Home size={20} strokeWidth={1.8} />
            </Link>
          )}
          {showReview && !isReviewPage && (
            <Link
              to="/review"
              className={cn(
                'p-2 rounded-full hover:bg-rose-50 active:scale-95 transition-all',
                isReviewPage ? 'text-rose-500' : 'text-warm-500'
              )}
              aria-label="年度复盘"
            >
              <BarChart3 size={20} strokeWidth={1.8} />
            </Link>
          )}
          {showSettings && (
            <button
              onClick={openSettingPanel}
              className="p-2 -mr-2 rounded-full text-warm-500 hover:bg-rose-50 active:scale-95 transition-all"
              aria-label="设置"
            >
              <Settings size={20} strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
