import React from 'react';
import { Tag } from 'lucide-react';
import { InventoryProductCardProps } from '@/features/inventory/types/inventoryTypes';

export const InventoryProductCard: React.FC<InventoryProductCardProps> = ({ item, isBn, isHighlighted = false, onCreatePromoPost }) => (
  <div className={`bg-[var(--pm-card)] border rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3 transition-all flex flex-col justify-between ${isHighlighted ? 'border-[var(--pm-accent)] ring-2 ring-[var(--pm-accent)] shadow-lg' : 'border-[var(--pm-border)] hover:border-[var(--pm-accent-border)]'}`}>
    <div className="space-y-3">
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--pm-surface)]">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${item.tradeMode === 'wholesale' ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border border-[var(--pm-accent-border)]' : 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]'}`}>
          {item.tradeMode === 'wholesale' ? 'Wholesale Tier' : 'Retail Item'}
        </span>
        <span className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${item.inStock ? 'bg-[var(--pm-success-soft)] text-[var(--pm-success)]' : 'bg-[var(--pm-danger-soft)] text-[var(--pm-danger)]'}`}>
          {item.inStock ? (isBn ? 'স্টকে আছে' : 'In stock') : (isBn ? 'স্টক শেষ' : 'Out of stock')}
        </span>
      </div>
      <div>
        <span className="text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-wider">{item.category}</span>
        <h4 className="text-xs font-bold text-[var(--pm-text)] line-clamp-1">{item.title}</h4>
        <p className="text-[11px] text-[var(--pm-muted)] line-clamp-2 mt-0.5">{item.description}</p>
      </div>
    </div>
    <div className="pt-3 border-t border-[var(--pm-border)] flex items-center justify-between gap-2">
      <span className="text-sm font-black text-[var(--pm-text)] font-mono tabular-nums">৳{item.price.toLocaleString()}</span>
      <button type="button" onClick={() => onCreatePromoPost(item)} className="px-3 py-1.5 rounded-xl bg-[var(--pm-accent-soft)] hover:bg-[var(--pm-accent-border)] text-[var(--pm-accent)] border border-[var(--pm-accent-border)] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1">
        <Tag className="w-3.5 h-3.5" />
        <span>{isBn ? 'প্রমো পোস্ট' : 'Promo Post'}</span>
      </button>
    </div>
  </div>
);
