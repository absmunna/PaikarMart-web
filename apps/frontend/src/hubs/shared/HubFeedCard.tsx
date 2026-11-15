import React from 'react';
import { MapPin, Star, ShieldCheck } from 'lucide-react';
import type { CommerceItem } from '@/types';

interface HubFeedCardProps {
  item: CommerceItem;
  kind: string;
  onOpen?: (item: CommerceItem) => void;
}

const KIND_STYLES: Record<string, string> = {
  Service: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
  Demand: 'text-orange-600 dark:text-orange-400 bg-orange-500/10',
  Logistics: 'text-sky-600 dark:text-sky-400 bg-sky-500/10',
  Offer: 'text-rose-600 dark:text-rose-400 bg-rose-500/10',
  Provider: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
};

export const HubFeedCard: React.FC<HubFeedCardProps> = ({ item, kind, onOpen }) => (
  <article
    className="group overflow-hidden rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] shadow-xs transition-all hover:-translate-y-0.5 hover:border-[var(--pm-accent)]/50 hover:shadow-lg"
    onClick={() => onOpen?.(item)}
  >
    <div className="relative aspect-[16/9] overflow-hidden bg-[var(--pm-surface)]">
      <img
        src={item.imageUrl || '/src/assets/images/paikarmart_fresh_grocery_1794489814176.jpg'}
        alt={item.title}
        loading="lazy"
        decoding="async"
        onError={(event) => {
          event.currentTarget.src = '/src/assets/images/paikarmart_fresh_grocery_1794489814176.jpg';
        }}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className={`absolute left-3 top-3 rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-wider backdrop-blur-sm ${KIND_STYLES[kind] || KIND_STYLES.Provider}`}>
        {kind}
      </span>
    </div>

    <div className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-black leading-5 text-[var(--pm-text)]">{item.title}</h3>
          <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-[var(--pm-muted)]">
            <ShieldCheck className="h-3 w-3 shrink-0 text-[var(--pm-accent)]" />
            {item.storeName}
          </p>
        </div>
        <span className="shrink-0 font-mono text-sm font-black tabular-nums text-[var(--pm-text)]">৳{item.price.toLocaleString()}</span>
      </div>

      <p className="line-clamp-2 text-xs leading-5 text-[var(--pm-muted)]">{item.description}</p>

      <div className="flex items-center justify-between border-t border-[var(--pm-border)] pt-3 text-[10px] font-semibold text-[var(--pm-muted)]">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {item.proximityDistance || 'Nearby'}
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          {item.rating?.toFixed(1) || 'New'}
        </span>
      </div>
    </div>
  </article>
);
