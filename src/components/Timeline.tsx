import React from 'react';
import { Clock, Tag } from 'lucide-react';
import { DiaryRecord } from '../types';
import { useAppStore } from '../store/useAppStore';
import { RatingStars } from './RatingStars';
import { formatDateCN } from '../utils/dateUtils';
import { cn } from '../lib/utils';

interface TimelineItemProps {
  record: DiaryRecord;
  index: number;
  onClick: () => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ record, index, onClick }) => {
  const isLast = index === 0;

  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-rose-200 to-rose-100" />
      )}
      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-soft">
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>

      <button
        onClick={onClick}
        className={cn(
          'w-full text-left bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300',
          'active:scale-[0.98] border border-rose-50 hover:border-rose-100',
          'group'
        )}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-warm-400 text-sm">
            <Clock size={14} />
            <span className="font-medium">{formatDateCN(record.date)}</span>
          </div>
          <RatingStars rating={record.rating} readOnly size={14} />
        </div>

        <p className="text-warm-600 text-sm leading-relaxed line-clamp-2 mb-3 group-hover:text-warm-700 transition-colors">
          {record.content || <span className="text-warm-300 italic">暂无内容</span>}
        </p>

        {record.tags && record.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag size={12} className="text-rose-300" />
            {record.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-xs rounded-full bg-rose-50 text-rose-400 font-medium"
              >
                {tag}
              </span>
            ))}
            {record.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-warm-50 text-warm-400">
                +{record.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </button>
    </div>
  );
};

export const Timeline: React.FC = () => {
  const records = useAppStore((s) => s.records);
  const openDetailModal = useAppStore((s) => s.openDetailModal);

  const sortedRecords = React.useMemo(() => {
    return [...records].sort((a, b) => b.date.localeCompare(a.date));
  }, [records]);

  if (sortedRecords.length === 0) {
    return (
      <div className="card animate-slide-up text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center">
          <Clock size={28} className="text-rose-300" />
        </div>
        <h3 className="text-warm-600 font-medium mb-1">时光机等待开启</h3>
        <p className="text-warm-400 text-sm">记录你的第一篇日记，开启时光之旅</p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-soft">
          <Clock size={16} className="text-white" />
        </div>
        <h2 className="font-serif font-bold text-xl text-warm-700">时光机</h2>
        <span className="px-2 py-0.5 text-xs rounded-full bg-rose-50 text-rose-400 font-medium">
          {sortedRecords.length} 篇
        </span>
      </div>

      <div className="relative">
        {sortedRecords.map((record, index) => (
          <TimelineItem
            key={record.id}
            record={record}
            index={index}
            onClick={() => openDetailModal(record.date)}
          />
        ))}
      </div>
    </div>
  );
};
