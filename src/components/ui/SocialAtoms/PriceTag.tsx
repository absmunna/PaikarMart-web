import React from 'react';

interface Props {
  wholesalePrice: number;
  retailPrice: number;
  discountPercentage?: number;
}

export const PriceTag: React.FC<Props> = ({ wholesalePrice, retailPrice, discountPercentage }) => {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-black text-white">৳{wholesalePrice.toLocaleString()}</span>
      <span className="text-xs text-white/50 line-through">৳{retailPrice.toLocaleString()}</span>
      {discountPercentage && (
        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded-md">
          {discountPercentage}% OFF
        </span>
      )}
    </div>
  );
};
