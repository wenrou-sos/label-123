import React, { useState } from 'react';
import { Timeline } from './Timeline';
import { generateMockRecords, TEST_CASES, TestCaseKey } from '../utils/testUtils';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
import { DiaryRecord } from '../types';

export const TimelineTest: React.FC = () => {
  const [activeCase, setActiveCase] = useState<TestCaseKey>('few');
  const [originalRecords, setOriginalRecords] = useState<DiaryRecord[] | null>(null);

  const setRecords = useAppStore((s) => s.setRecords);
  const realRecords = useAppStore((s) => s.records);

  const applyTestCase = (key: TestCaseKey) => {
    setActiveCase(key);

    if (originalRecords === null) {
      setOriginalRecords([...realRecords]);
    }

    const mockRecords = generateMockRecords(TEST_CASES[key].count);
    setRecords(mockRecords);
  };

  const restoreRecords = () => {
    if (originalRecords !== null) {
      setRecords(originalRecords);
      setOriginalRecords(null);
    }
  };

  const isUsingMock = originalRecords !== null;

  return (
    <div className="p-4 bg-warm-50 rounded-2xl mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-bold text-lg text-warm-700">
          🧪 时间线测试面板
        </h3>
        {isUsingMock && (
          <button
            onClick={restoreRecords}
            className="px-3 py-1 text-xs rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors"
          >
            恢复真实数据
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {(Object.keys(TEST_CASES) as TestCaseKey[]).map((key) => (
          <button
            key={key}
            onClick={() => applyTestCase(key)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-full transition-all',
              activeCase === key && isUsingMock
                ? 'bg-rose-500 text-white shadow-soft'
                : 'bg-white text-warm-500 hover:bg-rose-50'
            )}
          >
            {TEST_CASES[key].name}
          </button>
        ))}
      </div>

      <div className="text-xs text-warm-400 bg-white rounded-lg p-3">
        <p className="font-medium text-warm-500 mb-1">
          当前：{TEST_CASES[activeCase].name}
        </p>
        <p>• {TEST_CASES[activeCase].description}</p>
        <p>• 验证要点：连线方向是否正确、节点间是否有断层、首尾处理是否正确</p>
      </div>

      <div className="mt-4 bg-white rounded-xl p-4">
        <Timeline />
      </div>
    </div>
  );
};
