import React from 'react';
import {
  Award,
  Building2,
  Boxes,
  Egg,
  Hotel,
  Megaphone,
  MapPin,
  Monitor,
  Pill,
  Tag,
  Store,
  Truck,
  Utensils,
  Wrench,
} from 'lucide-react';
import type { HubPortalDefinition } from '@/hubs/shared/hubTypes';

interface HubPortalNavigationProps {
  portals: HubPortalDefinition[];
  activePortalId: string;
  selectedCategoryId: string;
  allLabel: string;
  categoryAllLabel: string;
  isBn: boolean;
  onPortalSelect: (portalId: string) => void;
  onCategorySelect: (categoryId: string) => void;
}

const PORTAL_ICONS = {
  award: Award,
  building: Building2,
  boxes: Boxes,
  egg: Egg,
  hotel: Hotel,
  megaphone: Megaphone,
  monitor: Monitor,
  pill: Pill,
  tag: Tag,
  store: Store,
  truck: Truck,
  utensils: Utensils,
  wrench: Wrench,
} as const;

export const HubPortalNavigation: React.FC<HubPortalNavigationProps> = ({
  portals,
  activePortalId,
  selectedCategoryId,
  allLabel,
  categoryAllLabel,
  isBn,
  onPortalSelect,
  onCategorySelect,
}) => {
  const activePortal = portals.find((portal) => portal.id === activePortalId);
  const categories = activePortal
    ? activePortal.categories.filter((category) => category.id !== 'all')
    : Array.from(new Map(
        portals.flatMap((portal) => portal.categories)
          .filter((category) => category.id !== 'all')
          .map((category) => [category.id, category])
      ).values());

  return (
    <section
      aria-label="Hub portal navigation"
      className="sticky top-14 z-30 -mx-3 space-y-2 border-b border-[var(--pm-border)] bg-[var(--pm-bg)]/95 px-3 py-2.5 backdrop-blur-xl sm:top-16 sm:-mx-4 sm:px-4"
    >
      <div className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 no-scrollbar" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activePortalId === 'all'}
          onClick={() => onPortalSelect('all')}
          className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${activePortalId === 'all' ? 'border-transparent bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]' : 'border-[var(--pm-border)] bg-[var(--pm-card)] text-[var(--pm-muted)]'}`}
        >
          {allLabel}
        </button>
        {portals.map((portal) => {
          const Icon = PORTAL_ICONS[portal.iconName as keyof typeof PORTAL_ICONS] || MapPin;
          const selected = activePortalId === portal.id;
          return (
            <button
              key={portal.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onPortalSelect(portal.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${selected ? 'border-transparent bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]' : 'border-[var(--pm-border)] bg-[var(--pm-card)] text-[var(--pm-text)] hover:border-[var(--pm-accent)]'}`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {isBn ? portal.labelBn : portal.labelEn}
            </button>
          );
        })}
      </div>

      {categories.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto border-t border-[var(--pm-border)] pt-2 no-scrollbar" aria-label="Portal categories">
          <button
            type="button"
            aria-pressed={selectedCategoryId === 'all'}
            onClick={() => onCategorySelect('all')}
            className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${selectedCategoryId === 'all' ? 'border-[var(--pm-accent)]/40 bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]' : 'border-[var(--pm-border)] bg-[var(--pm-card)] text-[var(--pm-muted)]'}`}
          >
            {categoryAllLabel}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={selectedCategoryId === category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${selectedCategoryId === category.id ? 'border-[var(--pm-accent)]/40 bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]' : 'border-[var(--pm-border)] bg-[var(--pm-card)] text-[var(--pm-muted)]'}`}
            >
              {isBn ? category.labelBn : category.labelEn}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
