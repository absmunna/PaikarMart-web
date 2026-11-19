import React from 'react';
import { Star } from 'lucide-react';

export const RatingDisplay = ({ rating, count }: { rating: number; count?: number }) => {
  return (
    <div className="flex items-center gap-1 text-[10px] font-black text-cyan-400">
      <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
      <span>{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-zinc-500 ml-0.5">({count})</span>}
    </div>
  );
};
