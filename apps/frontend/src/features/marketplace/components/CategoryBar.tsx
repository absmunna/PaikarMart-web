import React, { useEffect, useState } from 'react';
import { ArrowRight, Award, Boxes, Bus, Car, Egg, Hotel, MapPin, Monitor, Pill, Store, Truck, Utensils, Wrench } from 'lucide-react';
import {
  CATEGORY_BAR_DATA,
  CategoryPillarScope,
  MainCategoryTile,
} from '@/data/portalsData';
import { marketplacePortals } from '@/hubs/marketplace-hub/config/marketplacePortals';
import { servicePortals } from '@/hubs/services-hub/config/servicePortals';
import type { PortalFilterType } from '@/portals/marketplace/pages/CommercePortal';
import type { PortalTab } from '@/types';

interface CategoryBarProps {
  isBn: boolean;
  activePortal: PortalFilterType;
  selectedSubCategory: string;
  onPortalSwitch: (portal: PortalFilterType) => void;
  onSubCategorySelect: (subCat: string) => void;
  onSearchFilter?: (keyword: string) => void;
  onSelectTab?: (tab: PortalTab) => void;
  initialPillar?: CategoryPillarScope;
  onMainTileSelect?: (tile: MainCategoryTile) => void;
}

const REGISTRY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  store: Store,
  boxes: Boxes,
  egg: Egg,
  pill: Pill,
  award: Award,
  monitor: Monitor,
  wrench: Wrench,
  utensils: Utensils,
  truck: Truck,
  car: Car,
  bus: Bus,
  hotel: Hotel,
};

const REGISTRY_TINTS = [
  'from-sky-500/20 to-blue-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
  'from-amber-500/20 to-orange-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  'from-emerald-500/20 to-green-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  'from-teal-500/20 to-cyan-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30',
  'from-purple-500/20 to-violet-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
  'from-cyan-500/20 to-blue-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
];

const registryToTiles = (entries: typeof marketplacePortals, prefix: string): MainCategoryTile[] =>
  entries
    .filter((entry) => entry.enabled)
    .sort((a, b) => a.order - b.order)
    .map((entry, index) => {
      const portalFilter = entry.id === 'wholesale'
        ? 'wholesale'
        : entry.id === 'logistics'
        ? undefined
        : entry.hubId === 'marketplace'
        ? 'retail'
        : 'services';
      const searchFilter = ['grocery', 'pharmacy', 'brand-shops', 'digital', 'food-delivery'].includes(entry.id)
        ? entry.id.replace('brand-shops', 'brand').replace('food-delivery', 'food')
        : undefined;

      return {
        id: `${prefix}-${entry.id}-home`,
        labelEn: entry.labelEn,
        labelBn: entry.labelBn,
        icon: REGISTRY_ICONS[entry.iconName] || MapPin,
        tintClass: REGISTRY_TINTS[index % REGISTRY_TINTS.length],
        portalFilter,
        searchFilter,
        subcategories: entry.categories.map((category) => ({
          id: `${entry.id}-${category.id}`,
          labelEn: category.labelEn,
          labelBn: category.labelBn,
          filterKey: category.filterKey,
        })),
      };
    });

export const CategoryBar: React.FC<CategoryBarProps> = ({
  isBn,
  activePortal,
  selectedSubCategory,
  onPortalSwitch,
  onSubCategorySelect,
  onSearchFilter,
  onSelectTab,
  initialPillar = 'all',
  onMainTileSelect,
}) => {
  const [activePillar, setActivePillar] = useState<CategoryPillarScope>(initialPillar);
  const [activeMainTileId, setActiveMainTileId] = useState<string>('all-discovery');

  useEffect(() => {
    setActivePillar(initialPillar);
    setActiveMainTileId('all-discovery');
  }, [initialPillar]);

  const mainCategories = activePillar === 'commerce-hub'
    ? registryToTiles(marketplacePortals, 'c')
    : activePillar === 'services-hub'
    ? registryToTiles(servicePortals, 'service')
    : activePillar === 'services-logistics-hub'
    ? registryToTiles(servicePortals.filter((entry) => entry.id === 'logistics'), 'service')
    : CATEGORY_BAR_DATA[activePillar] || CATEGORY_BAR_DATA.all;
  const activeTile = mainCategories.find((c) => c.id === activeMainTileId) || mainCategories[0];

  const handleTileClick = (tile: MainCategoryTile) => {
    setActiveMainTileId(tile.id);
    onMainTileSelect?.(tile);

    if (['s-rides', 'service-logistics-home', 'service-ride-home', 'service-transport-home', 'service-rent-home', 'service-emergency-home'].includes(tile.id)) {
      onSelectTab?.('rides');
      return;
    }
    if (tile.id === 'm-creator') {
      onSelectTab?.('creator');
      return;
    }

    if (tile.portalFilter) {
      onPortalSwitch(tile.portalFilter);
    }
    if (tile.searchFilter !== undefined) {
      onSearchFilter?.(tile.searchFilter);
    } else {
      onSearchFilter?.('');
    }
    onSubCategorySelect('all');
  };

  return (
    <section
      aria-label="3-Tier Category Navigation"
      className="sticky top-14 sm:top-16 z-30 w-full min-w-0 rounded-2xl sm:rounded-3xl bg-[var(--pm-card)]/95 backdrop-blur-xl border border-[var(--pm-border)] p-2.5 sm:p-4 shadow-md space-y-2.5 sm:space-y-3 overflow-hidden"
    >
      {/* Portal entry rail: Hub switching lives in bottom navigation and Explore. */}
      <div className="flex items-stretch gap-2 overflow-x-auto no-scrollbar py-0.5 touch-pan-x overscroll-x-contain snap-x snap-mandatory">
        {mainCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected =
            activeTile?.id === cat.id ||
            (cat.portalFilter && cat.portalFilter === activePortal && !cat.searchFilter && activeMainTileId === cat.id);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleTileClick(cat)}
              aria-pressed={isSelected}
              className={`shrink-0 snap-start w-[88px] sm:w-[110px] min-h-[76px] sm:min-h-[88px] px-2 py-2 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer group active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pm-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pm-card)] ${
                isSelected
                  ? `bg-gradient-to-br ${cat.tintClass} shadow-sm ring-1 ring-[var(--pm-accent)]/40`
                  : 'bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-text)] hover:border-[var(--pm-accent)]/40'
              }`}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4 text-[var(--pm-accent)]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-center leading-snug line-clamp-2 max-w-[82px] sm:max-w-[100px] px-0.5">
                {isBn ? cat.labelBn : cat.labelEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* TIER 3: Context-Aware Subcategory Chips */}
      {activeTile?.subcategories && activeTile.subcategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-[var(--pm-border)] touch-pan-x overscroll-x-contain snap-x snap-mandatory">
          <span className="text-[10px] font-bold text-[var(--pm-muted)] flex items-center gap-1 shrink-0 pr-1">
            <ArrowRight className="w-3 h-3 text-[var(--pm-accent)]" />
            {isBn ? 'সাব-ক্যাটাগরি:' : 'Sub:'}
          </span>
          <button
            type="button"
            onClick={() => {
              onSubCategorySelect('all');
              onSearchFilter?.(activeTile.searchFilter || '');
            }}
            className={`shrink-0 snap-start px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pm-accent)] ${
              selectedSubCategory === 'all'
                ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border-[var(--pm-accent)]/40'
                : 'bg-[var(--pm-surface)] text-[var(--pm-muted)] border-[var(--pm-border)] hover:text-[var(--pm-text)]'
            }`}
          >
            {isBn ? 'সব' : 'All'}
          </button>
          {activeTile.subcategories.map((sub) => {
            const isSubSelected = selectedSubCategory === sub.filterKey;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  if (['all', 'brand', 'homemade', 'online', 'dropshipping', 'factory', 'importer', 'exporter', 'dealer', '0.5km', '2km', 'express'].includes(sub.filterKey)) {
                    onSubCategorySelect(sub.filterKey);
                    if (sub.filterKey === 'all') onSearchFilter?.(activeTile.searchFilter || '');
                  } else {
                    onSubCategorySelect('all');
                    onSearchFilter?.(sub.filterKey);
                  }
                }}
                className={`shrink-0 snap-start px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pm-accent)] ${
                  isSubSelected
                    ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border-[var(--pm-accent)]/40'
                    : 'bg-[var(--pm-surface)] text-[var(--pm-muted)] border-[var(--pm-border)] hover:text-[var(--pm-text)]'
                }`}
              >
                {isBn ? sub.labelBn : sub.labelEn}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
