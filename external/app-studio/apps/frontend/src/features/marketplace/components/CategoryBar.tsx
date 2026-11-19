import React, { useEffect, useState } from 'react';
import { ArrowRight, Award, Boxes, Bus, Car, Egg, Hotel, MapPin, Monitor, Pill, Store, Truck, Utensils, Wrench } from 'lucide-react';
import {
  CATEGORY_BAR_DATA,
  CategoryPillarScope,
  MainCategoryTile,
} from '@/data/portalsData';
import { marketplacePortals, servicePortals } from '@/hubs/shared/portalRegistry';
import type { PortalFilterType } from '@/features/marketplace/types';
import type { PortalTab } from '@/types';

interface CategoryBarProps {
  isBn: boolean;
  activePortal: PortalFilterType;
  selectedSubCategory: string;
  searchQuery?: string;
  onPortalSwitch: (portal: PortalFilterType) => void;
  onSubCategorySelect: (subCat: string) => void;
  onSearchFilter?: (keyword: string) => void;
  onSelectTab?: (tab: PortalTab) => void;
  initialPillar?: CategoryPillarScope;
  activeChildPortalId?: string;
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

const SUB_CATEGORY_FILTER_KEYS = new Set([
  'all',
  'brand',
  'homemade',
  'online',
  'dropshipping',
  'factory',
  'importer',
  'exporter',
  'dealer',
  '0.5km',
  '2km',
  'express',
]);

const LOGISTICS_TILE_IDS = new Set([
  's-rides',
  'service-logistics-home',
  's-ride-home',
  's-transport-home',
  's-rent-home',
  's-emergency-home',
  'service-ride-home',
  'service-transport-home',
  'service-rent-home',
  'service-emergency-home',
]);

const registryToTiles = (entries: typeof marketplacePortals, prefix: string): MainCategoryTile[] => {
  const isMarket = prefix === 'c';
  const allMixedTile: MainCategoryTile = {
    id: `${prefix}-all-home`,
    labelEn: isMarket ? 'All Market' : 'All Services',
    labelBn: isMarket ? 'সব মার্কেট' : 'সব সার্ভিস',
    icon: isMarket ? Store : Wrench,
    tintClass: 'from-indigo-500/20 to-blue-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    portalFilter: isMarket ? 'all' : 'services',
    subcategories: [
      {
        id: `${prefix}-all-reset`,
        labelEn: 'Mixed Feed',
        labelBn: 'মিক্সড ফিড',
        filterKey: 'all',
      },
    ],
  };

  const childTiles = entries
    .filter((entry) => entry.enabled)
    .sort((a, b) => a.order - b.order)
    .map((entry, index) => {
      const portalFilter: PortalFilterType | undefined =
        entry.id === 'wholesale'
          ? 'wholesale'
          : entry.id === 'nearby-shops' || entry.id === 'nearby-services'
          ? 'nearby'
          : entry.id === 'demand-board' || entry.id === 'service-demands'
          ? 'demand'
          : entry.id === 'logistics'
          ? undefined
          : entry.id === 'retail'
          ? 'retail'
          : entry.hubId === 'marketplace'
          ? 'all'
          : 'services';

      return {
        id: `${prefix}-${entry.id}-home`,
        labelEn: entry.labelEn,
        labelBn: entry.labelBn,
        icon: REGISTRY_ICONS[entry.iconName] || MapPin,
        tintClass: REGISTRY_TINTS[index % REGISTRY_TINTS.length],
        portalFilter,
        searchFilter: undefined,
        subcategories: entry.categories.map((category) => ({
          id: `${entry.id}-${category.id}`,
          labelEn: category.labelEn,
          labelBn: category.labelBn,
          filterKey: category.filterKey,
        })),
      };
    });

  return [allMixedTile, ...childTiles];
};

const getTilesForPillar = (pillar: CategoryPillarScope): MainCategoryTile[] => {
  if (pillar === 'commerce-hub') {
    return registryToTiles(marketplacePortals, 'c');
  }
  if (pillar === 'services-hub') {
    return registryToTiles(servicePortals, 'service');
  }
  return CATEGORY_BAR_DATA[pillar] || CATEGORY_BAR_DATA.all;
};

export const CategoryBar: React.FC<CategoryBarProps> = ({
  isBn,
  activePortal,
  selectedSubCategory,
  searchQuery = '',
  onPortalSwitch,
  onSubCategorySelect,
  onSearchFilter,
  onSelectTab,
  initialPillar = 'all',
  activeChildPortalId,
  onMainTileSelect,
}) => {
  const [activeMainTileId, setActiveMainTileId] = useState<string>(() => {
    const initialTiles = getTilesForPillar(initialPillar);
    if (activeChildPortalId === 'all' && (initialPillar === 'commerce-hub' || initialPillar === 'services-hub')) {
      return initialTiles[0]?.id || 'all-discovery';
    }
    return (
      initialTiles.find((c) => c.portalFilter === activePortal && !c.searchFilter)?.id ||
      initialTiles[0]?.id ||
      'all-discovery'
    );
  });
  const [activeSubChipId, setActiveSubChipId] = useState<string>('all');

  useEffect(() => {
    const nextTiles = getTilesForPillar(initialPillar);
    if (activeChildPortalId === 'all' && (initialPillar === 'commerce-hub' || initialPillar === 'services-hub')) {
      setActiveMainTileId(nextTiles[0]?.id || 'all-discovery');
      setActiveSubChipId('all');
      return;
    }
    if (activeChildPortalId && activeChildPortalId !== 'all') {
      const prefix = initialPillar === 'services-hub' ? 'service-' : 'c-';
      const normalizedMatch = activeChildPortalId.startsWith(prefix)
        ? activeChildPortalId
        : `${prefix}${activeChildPortalId}-home`;
      if (nextTiles.some((t) => t.id === normalizedMatch)) {
        setActiveMainTileId(normalizedMatch);
        setActiveSubChipId('all');
        return;
      }
    }
    setActiveMainTileId((prevId) => {
      if (nextTiles.some((t) => t.id === prevId)) return prevId;
      return (
        nextTiles.find((c) => c.portalFilter === activePortal && !c.searchFilter)?.id ||
        nextTiles[0]?.id ||
        'all-discovery'
      );
    });
    setActiveSubChipId('all');
  }, [initialPillar, activePortal, activeChildPortalId]);

  const mainCategories = getTilesForPillar(initialPillar);
  const activeTile =
    mainCategories.find((c) => c.id === activeMainTileId) ||
    mainCategories.find((c) => c.portalFilter === activePortal && !c.searchFilter) ||
    mainCategories[0];

  const handleTileClick = (tile: MainCategoryTile) => {
    setActiveMainTileId(tile.id);
    setActiveSubChipId('all');
    onMainTileSelect?.(tile);

    if (LOGISTICS_TILE_IDS.has(tile.id)) {
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
    if (tile.searchFilter !== undefined && tile.searchFilter.trim() !== '') {
      onSearchFilter?.(tile.searchFilter);
    } else if (tile.id.startsWith('c-') || tile.id.startsWith('service-')) {
      onSearchFilter?.('');
    }
    onSubCategorySelect('all');
  };

  const subcategories = activeTile?.subcategories ?? [];
  const hasExplicitAllChip = subcategories.some(
    (sub) => sub.id.endsWith('-all') || sub.filterKey === 'all'
  );
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const isAllSubSelected =
    selectedSubCategory === 'all' &&
    (!normalizedSearch || normalizedSearch === (activeTile?.searchFilter || '').toLowerCase()) &&
    (activeSubChipId === 'all' || activeSubChipId.endsWith('-all'));

  return (
    <section
      aria-label="3-Tier Category Navigation"
      className="sticky top-16 z-30 w-full min-w-0 rounded-2xl bg-[var(--pm-card)]/95 backdrop-blur-xl border border-[var(--pm-border)] p-2 sm:p-3 shadow-md space-y-2 overflow-hidden"
    >
      {/* Portal entry rail: Hub switching lives in bottom navigation and Explore. */}
      <div className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 touch-pan-x overscroll-x-contain snap-x snap-mandatory">
        {mainCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeTile?.id === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleTileClick(cat)}
              aria-pressed={Boolean(isSelected)}
              className={`shrink-0 snap-start w-[78px] sm:w-[92px] min-h-[64px] sm:min-h-[70px] px-1.5 py-1.5 sm:px-2 sm:py-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer group active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pm-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pm-card)] ${
                isSelected
                  ? `bg-gradient-to-br ${cat.tintClass} shadow-sm ring-1 ring-[var(--pm-accent)]/40`
                  : 'bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-text)] hover:border-[var(--pm-accent)]/40'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                <Icon className="w-4 h-4 shrink-0 text-[var(--pm-accent)]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-center leading-tight line-clamp-1 sm:line-clamp-2 w-full px-0.5">
                {isBn ? cat.labelBn : cat.labelEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* TIER 3: Context-Aware Subcategory Chips */}
      {subcategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-[var(--pm-border)] touch-pan-x overscroll-x-contain snap-x snap-mandatory">
          <span className="text-[10px] font-bold text-[var(--pm-muted)] flex items-center gap-1 shrink-0 pr-1">
            <ArrowRight className="w-3 h-3 text-[var(--pm-accent)]" />
            {isBn ? 'সাব-ক্যাটাগরি:' : 'Sub:'}
          </span>
          {!hasExplicitAllChip && (
            <button
              type="button"
              onClick={() => {
                setActiveSubChipId('all');
                onSubCategorySelect('all');
                onSearchFilter?.(activeTile?.searchFilter || '');
              }}
              aria-pressed={isAllSubSelected}
              className={`shrink-0 snap-start px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pm-accent)] ${
                isAllSubSelected
                  ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border-[var(--pm-accent)]/40'
                  : 'bg-[var(--pm-surface)] text-[var(--pm-muted)] border-[var(--pm-border)] hover:text-[var(--pm-text)]'
              }`}
            >
              {isBn ? 'সব' : 'All'}
            </button>
          )}
          {subcategories.map((sub) => {
            const isResetChip = sub.id.endsWith('-all') || sub.filterKey === 'all';
            const isSubSelected = isResetChip
              ? isAllSubSelected
              : activeSubChipId === sub.id ||
                (SUB_CATEGORY_FILTER_KEYS.has(sub.filterKey) && selectedSubCategory === sub.filterKey) ||
                (!SUB_CATEGORY_FILTER_KEYS.has(sub.filterKey) &&
                  normalizedSearch === sub.filterKey.toLowerCase());

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  if (isResetChip) {
                    setActiveSubChipId(sub.id);
                    onSubCategorySelect('all');
                    onSearchFilter?.(
                      sub.filterKey !== 'all' ? sub.filterKey : activeTile?.searchFilter || ''
                    );
                    return;
                  }

                  setActiveSubChipId(sub.id);
                  if (SUB_CATEGORY_FILTER_KEYS.has(sub.filterKey)) {
                    onSubCategorySelect(sub.filterKey);
                    onSearchFilter?.(activeTile?.searchFilter || '');
                  } else {
                    onSubCategorySelect('all');
                    onSearchFilter?.(sub.filterKey);
                  }
                }}
                aria-pressed={isSubSelected}
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
