import React from 'react';
import { WholesaleTier } from '@/types';
import { Check, TrendingDown } from 'lucide-react';

interface BulkTierPricingTableProps {
  basePrice: number;
  tiers?: WholesaleTier[];
  selectedQuantity: number;
  minWholesaleQty?: number;
  onSelectTier?: (qty: number) => void;
}

export const BulkTierPricingTable: React.FC<BulkTierPricingTableProps> = ({
  basePrice,
  tiers = [],
  selectedQuantity,
  minWholesaleQty = 20,
  onSelectTier,
}) => {
  // If no tiers provided, synthesize standard volume discount tiers based on MOQ
  const activeTiers: WholesaleTier[] = tiers.length > 0 
    ? tiers 
    : [
        { minQty: minWholesaleQty, pricePerUnit: Math.round(basePrice * 0.9) },
        { minQty: minWholesaleQty * 2, pricePerUnit: Math.round(basePrice * 0.8) },
        { minQty: minWholesaleQty * 5, pricePerUnit: Math.round(basePrice * 0.7) },
      ];

  return (
    <div className="bg-[var(--pm-surface)] rounded-xl border border-[var(--pm-border)] p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--pm-text)] flex items-center gap-1.5">
          <TrendingDown className="w-3.5 h-3.5 text-[var(--pm-success)]" />
          Volume Discount Slabs
        </span>
        <span className="text-[11px] text-[var(--pm-muted)] font-mono tabular-nums">
          MOQ: {minWholesaleQty} pcs
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {activeTiers.map((tier, idx) => {
          const discountPct = Math.round(((basePrice - tier.pricePerUnit) / basePrice) * 100);
          const isCurrentTier = selectedQuantity >= tier.minQty && 
            (idx === activeTiers.length - 1 || selectedQuantity < activeTiers[idx + 1].minQty);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectTier?.(tier.minQty)}
              className={`p-2 rounded-lg text-left transition-all border cursor-pointer ${
                isCurrentTier
                  ? 'bg-[var(--pm-success-soft)] border-[var(--pm-success)] ring-1 ring-[var(--pm-success)]/40'
                  : 'bg-[var(--pm-card)] border-[var(--pm-border)] hover:border-[var(--pm-border-strong)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-[var(--pm-muted)] font-mono tabular-nums">
                  {tier.minQty}+ pcs
                </span>
                {isCurrentTier && (
                  <Check className="w-3 h-3 text-[var(--pm-success)]" />
                )}
              </div>
              <div className="text-xs font-bold text-[var(--pm-text)] font-mono tabular-nums">
                ৳{tier.pricePerUnit}
              </div>
              <div className="text-[10px] text-[var(--pm-success)] font-medium">
                Save {discountPct}%
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
