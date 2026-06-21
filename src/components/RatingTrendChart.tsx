import React, { useMemo, useState } from 'react';
import { useYearlyStats } from '../hooks/useYearlyStats';
import { TrendingUp } from 'lucide-react';
import { cn, formatMonthShort } from '../lib/utils';

interface Point {
  month: number;
  count: number;
  avgRating: number;
  hasData: boolean;
  x: number;
  y: number;
}

const VIEW_W = 600;
const VIEW_H = 280;
const PAD = { top: 30, right: 24, bottom: 40, left: 40 };
const GRAPH_W = VIEW_W - PAD.left - PAD.right;
const GRAPH_H = VIEW_H - PAD.top - PAD.bottom;
const MIN_RATING = 1;
const MAX_RATING = 5;

const ratingToY = (rating: number) => {
  const clamped = Math.max(MIN_RATING, Math.min(MAX_RATING, rating));
  const t = (clamped - MIN_RATING) / (MAX_RATING - MIN_RATING);
  return PAD.top + GRAPH_H - t * GRAPH_H;
};

const monthToX = (month: number) => {
  const t = (month - 1) / 11;
  return PAD.left + t * GRAPH_W;
};

const smoothPath = (points: { x: number; y: number }[]): string => {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
};

export const RatingTrendChart: React.FC = () => {
  const stats = useYearlyStats();
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const { points, validSegments, hasAnyData, avgLine } = useMemo(() => {
    const breakdown = stats.monthlyBreakdown;

    const allPoints: Point[] = breakdown.map((m) => {
      const hasData = m.avgRating > 0;
      return {
        month: m.month,
        count: m.count,
        avgRating: m.avgRating,
        hasData,
        x: monthToX(m.month),
        y: hasData ? ratingToY(m.avgRating) : -999,
      };
    });

    const segments: { points: Point[]; pathD: string; areaD: string }[] = [];
    let buf: Point[] = [];
    const flush = () => {
      if (buf.length > 0) {
        const pathD = smoothPath(buf);
        const first = buf[0];
        const last = buf[buf.length - 1];
        const bottomY = PAD.top + GRAPH_H;
        const areaD =
          `${pathD} L ${last.x.toFixed(2)} ${bottomY} L ${first.x.toFixed(2)} ${bottomY} Z`;
        segments.push({ points: [...buf], pathD, areaD });
        buf = [];
      }
    };
    for (const p of allPoints) {
      if (p.hasData) buf.push(p);
      else flush();
    }
    flush();

    return {
      points: allPoints,
      validSegments: segments,
      hasAnyData: allPoints.some((p) => p.hasData),
      avgLine: stats.avgRating,
    };
  }, [stats.monthlyBreakdown, stats.avgRating]);

  const yTicks = [1, 2, 3, 4, 5];
  const hoveredPoint = hoveredMonth ? points.find((p) => p.month === hoveredMonth) : null;
  const showHover = hoveredPoint && hoveredPoint.hasData;

  return (
    <div className="card-gradient animate-slide-up" style={{ animationDelay: '0.06s' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-peach-300/50 to-rose-200">
            <TrendingUp size={18} className="text-rose-500" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-serif font-semibold text-warm-600 text-lg">
              心情评分趋势
            </h3>
            <p className="text-xs text-warm-400 mt-0.5">
              {stats.year} 年 12 个月平均评分变化
            </p>
          </div>
        </div>
        {hasAnyData && avgLine > 0 && (
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-warm-400 uppercase tracking-wide">
              年度均值
            </span>
            <span className="stat-number font-bold text-2xl leading-none">
              {avgLine.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <div className="relative w-full rounded-2xl bg-gradient-to-br from-ivory-50 to-rose-50/60 border border-rose-100/70 p-2 sm:p-3">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full h-auto block select-none"
          role="img"
          aria-label="月度心情评分趋势折线图"
        >
          <defs>
            <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6B9D" stopOpacity="0.38" />
              <stop offset="60%" stopColor="#FF87AB" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FFB6CE" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="trendLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFA07A" />
              <stop offset="100%" stopColor="#D63384" />
            </linearGradient>
            <filter id="lineGlow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="avgDash" x1="0" x2="1">
              <stop offset="0%" stopColor="#8B7A7A" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#8B7A7A" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8B7A7A" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = ratingToY(tick);
            const isMid = tick === 3;
            return (
              <g key={tick}>
                <line
                  x1={PAD.left}
                  x2={VIEW_W - PAD.right}
                  y1={y}
                  y2={y}
                  stroke={isMid ? '#FFC8DA' : '#F5EDE8'}
                  strokeDasharray={isMid ? '0' : '4 6'}
                  strokeWidth={isMid ? 1.2 : 1}
                />
                <text
                  x={PAD.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#B09386"
                  className="font-sans"
                >
                  {tick}★
                </text>
              </g>
            );
          })}

          {points.map((p) => (
            <line
              key={`v-${p.month}`}
              x1={p.x}
              x2={p.x}
              y1={PAD.top}
              y2={PAD.top + GRAPH_H}
              stroke="#F5EDE8"
              strokeDasharray="2 6"
              strokeWidth="1"
              opacity="0.6"
            />
          ))}

          {hasAnyData && avgLine >= MIN_RATING && avgLine <= MAX_RATING && (
            <g>
              <line
                x1={PAD.left}
                x2={VIEW_W - PAD.right}
                y1={ratingToY(avgLine)}
                y2={ratingToY(avgLine)}
                stroke="url(#avgDash)"
                strokeWidth="2"
                strokeDasharray="8 6"
              />
              <rect
                x={VIEW_W - PAD.right - 42}
                y={ratingToY(avgLine) - 10}
                width="38"
                height="20"
                rx="10"
                fill="#FFF9F5"
                stroke="#F5EDE8"
              />
              <text
                x={VIEW_W - PAD.right - 23}
                y={ratingToY(avgLine) + 4}
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
                fill="#5C4A4A"
              >
                均{avgLine.toFixed(1)}
              </text>
            </g>
          )}

          {validSegments.map((seg, idx) => (
            <g key={`seg-${idx}`}>
              <path
                d={seg.areaD}
                fill="url(#trendArea)"
                className="transition-opacity duration-300"
                opacity="0.95"
              />
              <path
                d={seg.pathD}
                fill="none"
                stroke="url(#trendLine)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#lineGlow)"
              />
            </g>
          ))}

          {points.map((p) => (
            <g key={`lbl-${p.month}`}>
              <text
                x={p.x}
                y={VIEW_H - PAD.bottom + 22}
                textAnchor="middle"
                fontSize="11"
                fill="#8B7A7A"
                className="font-sans"
              >
                {formatMonthShort(0, p.month)}
              </text>
            </g>
          ))}

          {points.map((p) =>
            p.hasData ? (
              <g
                key={`pt-${p.month}`}
                onMouseEnter={() => setHoveredMonth(p.month)}
                onMouseLeave={() => setHoveredMonth(null)}
                onTouchStart={() => setHoveredMonth(p.month)}
                onTouchEnd={() => setHoveredMonth(null)}
                className="cursor-pointer"
                style={{ pointerEvents: 'all' }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredMonth === p.month ? 9 : 6}
                  fill="#FFFFFF"
                  stroke="#FF5C8E"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredMonth === p.month ? 5 : 3}
                  fill="#FF6B9D"
                  className="transition-all duration-200"
                />
                <rect
                  x={p.x - 18}
                  y={p.y - 18}
                  width="36"
                  height="36"
                  rx="18"
                  fill="transparent"
                />
              </g>
            ) : (
              <g key={`pt-empty-${p.month}`} opacity="0.4">
                <circle
                  cx={p.x}
                  cy={PAD.top + GRAPH_H + 2}
                  r="3"
                  fill="none"
                  stroke="#B09386"
                  strokeDasharray="2 2"
                  strokeWidth="1.5"
                />
              </g>
            )
          )}

          {showHover && hoveredPoint && (
            <g pointerEvents="none" className="animate-fade-in">
              <line
                x1={hoveredPoint.x}
                x2={hoveredPoint.x}
                y1={PAD.top}
                y2={hoveredPoint.y - 10}
                stroke="#FF5C8E"
                strokeDasharray="3 3"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <g
                transform={`translate(${Math.min(
                  Math.max(hoveredPoint.x - 58, PAD.left),
                  VIEW_W - PAD.right - 116
                )}, ${Math.max(hoveredPoint.y - 72, PAD.top)})`}
              >
                <rect
                  width="116"
                  height="60"
                  rx="14"
                  fill="#5C4A4A"
                  opacity="0.95"
                />
                <text
                  x="14"
                  y="22"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="600"
                  className="font-sans"
                >
                  {stats.year} 年 {hoveredPoint.month} 月
                </text>
                <line
                  x1="14"
                  x2="102"
                  y1="30"
                  y2="30"
                  stroke="#FFA07A"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <text x="14" y="46" fill="#FFB6CE" fontSize="10">
                  平均评分
                </text>
                <text
                  x="102"
                  y="46"
                  fill="#FFFFFF"
                  fontSize="13"
                  fontWeight="700"
                  textAnchor="end"
                >
                  {hoveredPoint.avgRating.toFixed(1)} ★
                </text>
                <text x="14" y="54" fill="#FFB6CE" fontSize="10">
                  记录次数
                </text>
                <text
                  x="102"
                  y="54"
                  fill="#FFA07A"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="end"
                >
                  {hoveredPoint.count} 次
                </text>
              </g>
            </g>
          )}
        </svg>

        {!hasAnyData && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-sm text-warm-400">
              还没有评分记录，记录几次后就能看到心情曲线啦～
            </p>
          </div>
        )}
      </div>

      <div
        className={cn(
          'mt-4 grid grid-cols-3 gap-2 text-xs',
          !hasAnyData && 'opacity-50 pointer-events-none'
        )}
      >
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-100">
          <p className="text-emerald-600 font-medium">🟢 心情高峰</p>
          <p className="text-emerald-700/70 mt-0.5 leading-snug">
            {(() => {
              const best = points
                .filter((p) => p.hasData)
                .sort((a, b) => b.avgRating - a.avgRating)[0];
              return best
                ? `${best.month}月（${best.avgRating.toFixed(1)}★）`
                : '暂无';
            })()}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/40 border border-amber-100">
          <p className="text-amber-700 font-medium">🟡 低谷期</p>
          <p className="text-amber-700/70 mt-0.5 leading-snug">
            {(() => {
              const low = points
                .filter((p) => p.hasData)
                .sort((a, b) => a.avgRating - b.avgRating)[0];
              return low
                ? `${low.month}月（${low.avgRating.toFixed(1)}★）`
                : '暂无';
            })()}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-rose-50 to-peach-300/20 border border-rose-100">
          <p className="text-rose-600 font-medium">💖 平稳期</p>
          <p className="text-rose-700/70 mt-0.5 leading-snug">
            {(() => {
              const segments: Point[][] = [];
              let run: Point[] = [];
              for (const p of points) {
                if (p.hasData) run.push(p);
                else {
                  if (run.length >= 2) segments.push(run);
                  run = [];
                }
              }
              if (run.length >= 2) segments.push(run);
              if (segments.length === 0) return '数据不足';

              const stddev = (vals: number[]) => {
                if (vals.length < 2) return 0;
                const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
                return Math.sqrt(
                  vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length
                );
              };

              let best = segments[0];
              let bestStd = stddev(best.map((p) => p.avgRating));
              for (const seg of segments.slice(1)) {
                const std = stddev(seg.map((p) => p.avgRating));
                if (std < bestStd || (std === bestStd && seg.length > best.length)) {
                  best = seg;
                  bestStd = std;
                }
              }

              const startM = best[0].month;
              const endM = best[best.length - 1].month;
              const range = startM === endM ? `${startM}月` : `${startM}-${endM}月`;
              return `${range}（波动±${bestStd.toFixed(1)}★）`;
            })()}
          </p>
        </div>
      </div>
    </div>
  );
};
