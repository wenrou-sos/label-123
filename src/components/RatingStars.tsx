import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  showValue?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  onChange,
  readOnly = false,
  size = 22,
  showValue = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const displayRating = hoverRating || rating;

  const handleClick = (value: number) => {
    if (readOnly || !onChange) return;
    onChange(value);
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = displayRating >= starValue;
        const isHalf = !isFilled && displayRating >= starValue - 0.5;

        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            className={cn(
              'relative transition-transform duration-150',
              !readOnly && 'cursor-pointer hover:scale-110 active:scale-95',
              readOnly && 'cursor-default'
            )}
            style={{ minWidth: size, minHeight: size }}
            aria-label={`${starValue}星`}
          >
            <Star
              size={size}
              strokeWidth={1.5}
              className={cn(
                'transition-colors duration-150',
                isFilled
                  ? 'text-peach-400 fill-peach-400 drop-shadow-sm'
                  : isHalf
                  ? 'text-peach-400/50 fill-peach-400/30'
                  : 'text-warm-400/40 fill-transparent'
              )}
            />
          </button>
        );
      })}
      {showValue && rating > 0 && (
        <span className="ml-2 text-sm font-medium text-warm-500">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
