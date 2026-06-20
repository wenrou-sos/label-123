import React, { useState, useEffect } from 'react';
import { X, Calendar, Trash2, Tag, Save, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn, formatDateCN } from '../lib/utils';
import { RatingStars } from './RatingStars';
import { getRecordsByDate } from '../utils/statsUtils';
import { DiaryRecord } from '../types';

const TAG_OPTIONS = ['日常', '浪漫', '旅行', '纪念日', '美食', '电影', '散步', '惊喜', '礼物', '吵架'];

export const RecordDetailModal: React.FC = () => {
  const isOpen = useAppStore((s) => s.isDetailModalOpen);
  const selectedDate = useAppStore((s) => s.selectedDate);
  const closeDetailModal = useAppStore((s) => s.closeDetailModal);
  const addRecord = useAppStore((s) => s.addRecord);
  const updateRecord = useAppStore((s) => s.updateRecord);
  const deleteRecord = useAppStore((s) => s.deleteRecord);
  const records = useAppStore((s) => s.records);

  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [existingRecord, setExistingRecord] = useState<DiaryRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && selectedDate) {
      const record = getRecordsByDate(records, selectedDate);
      if (record) {
        setExistingRecord(record);
        setRating(record.rating);
        setContent(record.content);
        setTags([...record.tags]);
      } else {
        setExistingRecord(null);
        setRating(0);
        setContent('');
        setTags([]);
      }
      setShowDeleteConfirm(false);
    }
  }, [isOpen, selectedDate, records]);

  const handleToggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!selectedDate) return;
    if (rating === 0 && content.trim() === '') {
      closeDetailModal();
      return;
    }

    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 300));

    const data = {
      date: selectedDate,
      rating: rating || 3,
      content: content.trim(),
      tags,
    };

    if (existingRecord) {
      updateRecord(existingRecord.id, data);
    } else {
      addRecord(data);
    }

    setIsSaving(false);
    closeDetailModal();
  };

  const handleDelete = () => {
    if (!existingRecord) return;
    deleteRecord(existingRecord.id);
    setShowDeleteConfirm(false);
    closeDetailModal();
  };

  const isEditing = existingRecord !== null;
  const isValid = rating > 0 || content.trim().length > 0;

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 transition-all duration-300',
          'bg-warm-700/50 backdrop-blur-[2px]',
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        onClick={closeDetailModal}
      />

      <div
        className={cn(
          'fixed inset-x-0 bottom-0 sm:bottom-6 sm:inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-lg md:w-full',
          'z-50 max-w-lg mx-auto w-full',
          'transition-all duration-400 ease-out',
          'bg-gradient-to-b from-white to-ivory-50',
          'rounded-t-[28px] sm:rounded-[28px] shadow-2xl safe-bottom',
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full sm:translate-y-10 opacity-0'
        )}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-warm-200/60" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-rose-100/50">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={cn(
                'p-2 rounded-xl',
                isEditing
                  ? 'bg-gradient-to-br from-rose-100 to-rose-200'
                  : 'bg-gradient-to-br from-peach-300/40 to-rose-100'
              )}
            >
              <Calendar
                size={18}
                className={isEditing ? 'text-rose-500' : 'text-peach-500'}
                strokeWidth={2}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif font-semibold text-lg text-warm-600 truncate">
                {selectedDate ? formatDateCN(selectedDate) : '记录'}
              </h3>
              <p className="text-xs text-warm-400 mt-0.5">
                {isEditing ? '编辑这条美好的回忆' : '记录今天的二人时光'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isEditing && !showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-full text-rose-400 hover:bg-rose-50 hover:text-rose-600 active:scale-90 transition-all"
                aria-label="删除"
              >
                <Trash2 size={18} strokeWidth={1.8} />
              </button>
            )}
            <button
              onClick={closeDetailModal}
              className="p-2 rounded-full text-warm-400 hover:bg-rose-50 hover:text-warm-600 active:scale-90 transition-all"
            >
              <X size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        {showDeleteConfirm ? (
          <div className="px-5 py-8 animate-bounce-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center">
                <Trash2 size={28} className="text-rose-400" strokeWidth={1.8} />
              </div>
              <h4 className="font-serif font-semibold text-xl text-warm-600 mb-2">
                确定删除这条记录吗？
              </h4>
              <p className="text-sm text-warm-500">
                删除后将无法恢复，美好的回忆值得珍惜哦～
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary"
              >
                再想想
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 rounded-full font-medium bg-rose-500 text-white hover:bg-rose-600 active:scale-95 transition-all shadow-soft"
              >
                确定删除
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 py-5 max-h-[60vh] overflow-y-auto space-y-5">
              <div>
                <label className="label-text flex items-center gap-2">
                  <Sparkles size={14} className="text-peach-400" strokeWidth={2} />
                  今日心情评分
                </label>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-peach-300/15 to-rose-50 border border-peach-300/20">
                  <RatingStars
                    rating={rating}
                    onChange={setRating}
                    size={32}
                    showValue
                  />
                  <div className="mt-3 flex justify-between text-xs text-warm-400">
                    <span>平淡</span>
                    <span>一般</span>
                    <span>不错</span>
                    <span>美好</span>
                    <span>难忘</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="label-text">记录内容</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="写下今天的点滴吧～无论是一顿温馨的晚餐，还是一次意外的小惊喜..."
                  className="input-base min-h-[120px] resize-none leading-relaxed"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-warm-400">
                    {content.length} / 500
                  </span>
                </div>
              </div>

              <div>
                <label className="label-text flex items-center gap-2">
                  <Tag size={14} className="text-rose-400" strokeWidth={2} />
                  添加标签
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((tag) => {
                    const isSelected = tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={cn(
                          'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-95',
                          isSelected
                            ? 'bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-soft'
                            : 'bg-warm-50 text-warm-500 hover:bg-rose-50 hover:text-rose-500 border border-warm-100'
                        )}
                      >
                        {isSelected && '✓ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-rose-100/50 bg-white/60 backdrop-blur">
              <div className="flex gap-3">
                <button
                  onClick={closeDetailModal}
                  className="flex-1 btn-secondary"
                >
                  {isEditing ? '取消' : '跳过'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !isValid}
                  className={cn(
                    'flex-1 btn-primary flex items-center justify-center gap-2',
                    (!isValid || isSaving) && 'opacity-50 cursor-not-allowed active:scale-100'
                  )}
                >
                  <Save size={18} strokeWidth={2} className={cn(isSaving && 'animate-pulse')} />
                  {isSaving ? '保存中...' : isEditing ? '更新记录' : '保存回忆'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
