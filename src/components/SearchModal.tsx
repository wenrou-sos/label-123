import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Tag, Calendar, Star } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn, formatDateCN } from '../lib/utils';
import { DiaryRecord } from '../types';
import { filterRecords, smartTruncate } from '../utils/statsUtils';
import { useDebounce } from '../hooks/useDebounce';

const TAG_OPTIONS = ['日常', '浪漫', '旅行', '纪念日', '美食', '电影', '散步', '惊喜', '礼物', '吵架'];

const highlightText = (text: string, keyword: string): React.ReactNode => {
  if (!keyword.trim()) return text;

  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerKeyword);
  let keyCounter = 0;

  while (index !== -1) {
    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }
    parts.push(
      <mark
        key={`hl-${keyCounter++}`}
        className="bg-rose-200/60 text-rose-700 px-0.5 rounded"
      >
        {text.slice(index, index + keyword.length)}
      </mark>
    );
    lastIndex = index + keyword.length;
    index = lowerText.indexOf(lowerKeyword, lastIndex);
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

export const SearchModal: React.FC = () => {
  const isOpen = useAppStore((s) => s.isSearchModalOpen);
  const closeSearchModal = useAppStore((s) => s.closeSearchModal);
  const openDetailModal = useAppStore((s) => s.openDetailModal);
  const records = useAppStore((s) => s.records);

  const [keyword, setKeyword] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedKeyword = useDebounce(keyword, 200);

  useEffect(() => {
    if (isOpen) {
      setKeyword('');
      setSelectedTags([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const searchResults = useMemo<DiaryRecord[]>(() => {
    return filterRecords(records, {
      keyword: debouncedKeyword,
      tags: selectedTags,
    });
  }, [records, debouncedKeyword, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleResultClick = (record: DiaryRecord) => {
    closeSearchModal();
    setTimeout(() => openDetailModal(record.date), 200);
  };

  const hasAnyFilter = debouncedKeyword.trim().length > 0 || selectedTags.length > 0;
  const displayKeyword = debouncedKeyword.trim();

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300',
          'bg-warm-700/40 backdrop-blur-sm',
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        onClick={closeSearchModal}
      />

      <div
        className={cn(
          'fixed inset-x-0 top-0 z-50',
          'max-w-lg mx-auto w-full',
          'transition-all duration-300 ease-out',
          isOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        )}
      >
        <div className="bg-ivory-100/90 backdrop-blur-md border-b border-rose-100/50 safe-top">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400"
                  strokeWidth={2}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索日记内容、标签..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/80 border border-warm-200 text-sm text-warm-700 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-all"
                />
                {keyword && (
                  <button
                    onClick={() => setKeyword('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
                  >
                    <X size={16} strokeWidth={2} />
                  </button>
                )}
              </div>
              <button
                onClick={closeSearchModal}
                className="text-sm text-warm-500 font-medium hover:text-rose-500 transition-colors px-1"
              >
                取消
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {TAG_OPTIONS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 flex items-center gap-1',
                      isSelected
                        ? 'bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-sm'
                        : 'bg-white/60 text-warm-500 hover:bg-rose-50 hover:text-rose-500 border border-warm-100'
                    )}
                  >
                    <Tag size={11} strokeWidth={2} />
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-ivory-100/60 backdrop-blur-sm max-h-[60vh] overflow-y-auto">
          {hasAnyFilter && (
            <div className="px-4 py-2">
              <p className="text-xs text-warm-400">
                {searchResults.length > 0
                  ? `找到 ${searchResults.length} 条相关记录`
                  : '没有找到相关记录'}
              </p>
            </div>
          )}

          {searchResults.length > 0 ? (
            <div className="space-y-2 px-4 pb-4">
              {searchResults.map((record) => {
                const { text: displayText } = smartTruncate(
                  record.content,
                  displayKeyword,
                  100
                );

                return (
                  <button
                    key={record.id}
                    onClick={() => handleResultClick(record)}
                    className="w-full text-left p-3 rounded-xl bg-white/80 border border-warm-100 hover:border-rose-200 hover:bg-rose-50/50 active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar
                          size={12}
                          className="text-rose-400"
                          strokeWidth={1.8}
                        />
                        <span className="text-xs text-warm-500 font-medium">
                          {formatDateCN(record.date)}
                        </span>
                      </div>
                      {record.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star
                            size={12}
                            className="text-amber-400 fill-amber-300"
                            strokeWidth={1.5}
                          />
                          <span className="text-xs text-warm-500 font-medium">
                            {record.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {record.content && (
                      <p className="text-sm text-warm-600 leading-relaxed mb-2 line-clamp-2">
                        {highlightText(displayText, displayKeyword)}
                      </p>
                    )}

                    {record.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {record.tags.map((tag) => (
                          <span
                            key={tag}
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[10px] font-medium',
                              selectedTags.includes(tag)
                                ? 'bg-rose-100 text-rose-600'
                                : 'bg-warm-50 text-warm-400'
                            )}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : hasAnyFilter ? (
            <div className="px-4 py-12 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-50 flex items-center justify-center">
                <Search
                  size={20}
                  className="text-rose-300"
                  strokeWidth={2}
                />
              </div>
              <p className="text-sm text-warm-400">没有找到相关记录</p>
              <p className="text-xs text-warm-300 mt-1">
                试试换个关键词或标签吧
              </p>
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-warm-50 flex items-center justify-center">
                <Search
                  size={20}
                  className="text-warm-300"
                  strokeWidth={2}
                />
              </div>
              <p className="text-sm text-warm-400">输入关键词或选择标签开始搜索</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
