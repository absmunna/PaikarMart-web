import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showScore?: boolean;
  showLabel?: boolean;
  className?: string;
  allowHoverPreview?: boolean;
}

const RATING_LABELS: Record<number, { bn: string; en: string }> = {
  1: { bn: 'অসন্তোষজনক (Poor)', en: 'Poor' },
  2: { bn: 'মোটামুটি (Fair)', en: 'Fair' },
  3: { bn: 'ভালো (Good)', en: 'Good' },
  4: { bn: 'খুব ভালো (Very Good)', en: 'Very Good' },
  5: { bn: 'অসাধারণ! (Excellent)', en: 'Excellent' },
};

const STAR_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
  xl: 'w-9 h-9',
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  showScore = false,
  showLabel = false,
  className,
  allowHoverPreview = true,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = interactive && hoverRating !== null ? hoverRating : rating;

  const handleStarClick = (selectedStar: number) => {
    if (!interactive || !onChange) return;
    onChange(selectedStar);
  };

  const handleMouseEnter = (star: number) => {
    if (!interactive || !allowHoverPreview) return;
    setHoverRating(star);
  };

  const handleMouseLeave = () => {
    if (!interactive || !allowHoverPreview) return;
    setHoverRating(null);
  };

  const currentLabel = RATING_LABELS[activeRating] || null;

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div 
        className="flex items-center gap-1 select-none"
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: maxStars }).map((_, idx) => {
          const starNumber = idx + 1;
          const isFilled = starNumber <= activeRating;
          const isHovered = interactive && hoverRating !== null && starNumber <= hoverRating;

          return (
            <button
              key={starNumber}
              type="button"
              disabled={!interactive}
              onClick={() => handleStarClick(starNumber)}
              onMouseEnter={() => handleMouseEnter(starNumber)}
              className={cn(
                "relative transition-all duration-200 outline-none p-0.5",
                interactive 
                  ? "cursor-pointer hover:scale-125 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg" 
                  : "cursor-default pointer-events-none"
              )}
              aria-label={`${starNumber} star`}
            >
              <Star
                className={cn(
                  STAR_SIZES[size],
                  "transition-colors duration-150",
                  isFilled
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                    : "text-zinc-600 fill-zinc-800/40"
                )}
              />
            </button>
          );
        })}
      </div>

      {showScore && (
        <span className="font-black text-sm text-white/90">
          {rating ? Number(rating).toFixed(1) : '0.0'}
        </span>
      )}

      {showLabel && currentLabel && (
        <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full transition-all">
          {currentLabel.bn}
        </span>
      )}
    </div>
  );
};

export default StarRating;
