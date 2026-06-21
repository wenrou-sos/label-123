import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, Calendar } from 'lucide-react';
import { cn, formatDateCN } from '../lib/utils';
import { SpecialDate } from '../types';
import { todayStr } from '../utils/dateUtils';

const PRESET_EMOJIS = ['💖', '🎂', '🎉', '💍', '🌟', '💝', '🌷', '🍀'];

interface EditorState {
  id: string | null;
  date: string;
  name: string;
  emoji: string;
  repeatYearly: boolean;
}

const createEmptyEditor = (): EditorState => ({
  id: null,
  date: todayStr(),
  name: '',
  emoji: '💖',
  repeatYearly: true,
});

interface SpecialDateManagerProps {
  specialDates: SpecialDate[];
  onAdd: (data: Omit<SpecialDate, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Omit<SpecialDate, 'id'>>) => void;
  onDelete: (id: string) => void;
}

export const SpecialDateManager: React.FC<SpecialDateManagerProps> = ({
  specialDates,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [showAdder, setShowAdder] = useState(false);

  const startAdd = () => {
    setEditor(createEmptyEditor());
    setShowAdder(true);
  };

  const startEdit = (sd: SpecialDate) => {
    setEditor({
      id: sd.id,
      date: sd.date,
      name: sd.name,
      emoji: sd.emoji,
      repeatYearly: sd.repeatYearly,
    });
    setShowAdder(false);
  };

  const cancelEdit = () => {
    setEditor(null);
    setShowAdder(false);
  };

  const handleSave = () => {
    if (!editor || !editor.name.trim() || !editor.date) return;

    if (editor.id) {
      onUpdate(editor.id, {
        date: editor.date,
        name: editor.name.trim(),
        emoji: editor.emoji,
        repeatYearly: editor.repeatYearly,
      });
    } else {
      onAdd({
        date: editor.date,
        name: editor.name.trim(),
        emoji: editor.emoji,
        repeatYearly: editor.repeatYearly,
      });
    }
    setEditor(null);
    setShowAdder(false);
  };

  const sorted = [...specialDates].sort((a, b) => {
    const aMd = a.date.slice(5);
    const bMd = b.date.slice(5);
    return aMd.localeCompare(bMd);
  });

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="label-text !mb-0 flex items-center gap-2">
          <Calendar size={16} className="text-rose-400" strokeWidth={1.5} />
          特殊日期
        </label>
        {!showAdder && !editor?.id && (
          <button
            onClick={startAdd}
            className="flex items-center gap-1 text-xs text-rose-500 font-medium hover:text-rose-600 active:scale-95 transition-all"
          >
            <Plus size={14} strokeWidth={2} />
            添加
          </button>
        )}
      </div>

      <div className="space-y-2">
        {sorted.length === 0 && !showAdder && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-peach-300/20 border border-rose-100 text-center">
            <p className="text-sm text-warm-500">
              还没有特殊日期，添加纪念日或生日吧～
            </p>
          </div>
        )}

        {sorted.map((sd) => {
          const isEditing = editor?.id === sd.id;
          return (
            <div
              key={sd.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border transition-all',
                isEditing
                  ? 'bg-gradient-to-br from-rose-50 to-peach-300/20 border-rose-200'
                  : 'bg-white/60 border-warm-100 hover:border-rose-100'
              )}
            >
              {isEditing ? (
                <EditorForm
                  editor={editor}
                  onChange={setEditor}
                  onSave={handleSave}
                  onCancel={cancelEdit}
                />
              ) : (
                <>
                  <span className="text-2xl leading-none">{sd.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-warm-700 truncate">
                      {sd.name}
                    </p>
                    <p className="text-xs text-warm-400 mt-0.5">
                      {formatDateCN(sd.date)}
                      {sd.repeatYearly && ' · 每年重复'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(sd)}
                      className="p-1.5 rounded-lg text-warm-400 hover:bg-rose-50 hover:text-rose-500 active:scale-90 transition-all"
                      aria-label="编辑"
                    >
                      <Pencil size={14} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => onDelete(sd.id)}
                      className="p-1.5 rounded-lg text-warm-400 hover:bg-red-50 hover:text-red-500 active:scale-90 transition-all"
                      aria-label="删除"
                    >
                      <Trash2 size={14} strokeWidth={2} />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {showAdder && editor && !editor.id && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-50 to-peach-300/20 border border-rose-200">
            <EditorForm
              editor={editor}
              onChange={setEditor}
              onSave={handleSave}
              onCancel={cancelEdit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface EditorFormProps {
  editor: EditorState;
  onChange: (e: EditorState) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditorForm: React.FC<EditorFormProps> = ({ editor, onChange, onSave, onCancel }) => {
  const canSave = editor.name.trim().length > 0 && editor.date;

  return (
    <div className="w-full space-y-3">
      <div>
        <label className="text-xs text-warm-500 mb-1 block">日期</label>
        <input
          type="date"
          value={editor.date}
          onChange={(e) => onChange({ ...editor, date: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-warm-200 bg-white text-sm text-warm-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300"
        />
      </div>

      <div>
        <label className="text-xs text-warm-500 mb-1 block">名称</label>
        <input
          type="text"
          value={editor.name}
          onChange={(e) => onChange({ ...editor, name: e.target.value })}
          placeholder="例如：在一起纪念日"
          maxLength={20}
          className="w-full px-3 py-2 rounded-lg border border-warm-200 bg-white text-sm text-warm-700 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-300"
        />
      </div>

      <div>
        <label className="text-xs text-warm-500 mb-2 block">图标</label>
        <div className="flex flex-wrap gap-2">
          {PRESET_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onChange({ ...editor, emoji })}
              className={cn(
                'w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all',
                editor.emoji === emoji
                  ? 'bg-rose-100 ring-2 ring-rose-400 scale-110'
                  : 'bg-white border border-warm-200 hover:border-rose-200'
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-xs text-warm-500">每年重复</label>
        <button
          onClick={() => onChange({ ...editor, repeatYearly: !editor.repeatYearly })}
          className={cn(
            'relative w-11 h-6 rounded-full transition-colors',
            editor.repeatYearly ? 'bg-rose-400' : 'bg-warm-200'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
              editor.repeatYearly ? 'translate-x-5' : 'translate-x-0.5'
            )}
          />
        </button>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-lg text-sm text-warm-500 bg-warm-100 hover:bg-warm-200 active:scale-95 transition-all"
        >
          取消
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className={cn(
            'flex-1 py-2 rounded-lg text-sm text-white bg-gradient-to-r from-rose-400 to-rose-500 active:scale-95 transition-all flex items-center justify-center gap-1',
            !canSave && 'opacity-50 cursor-not-allowed active:scale-100'
          )}
        >
          <Check size={14} strokeWidth={2} />
          保存
        </button>
      </div>
    </div>
  );
};
