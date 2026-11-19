import React from 'react';
import { ShoppingBag, Zap, MapPin, Wrench, Megaphone, Tag, Package } from 'lucide-react';
import type { PortalFilterType } from '@/features/marketplace/types';

interface MarketplaceFiltersProps {
  activePortal: PortalFilterType;
  onPortalSwitch: (portalId: PortalFilterType) => void;
  portalCounts: Record<string, number>;
  isBn: boolean;
  dynamicSubCategories: any[];
  selectedSubCategory: string;
  onSubCategorySelect: (id: string) => void;
  hideSubCategories?: boolean;
}

export const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  activePortal,
  onPortalSwitch,
  portalCounts,
  isBn,
  dynamicSubCategories,
  selectedSubCategory,
  onSubCategorySelect,
  hideSubCategories = false,
}) => {
  const portalToggles: {
    id: PortalFilterType;
    label: string;
    bnLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    accent: string;
    badge?: string;
  }[] = [
    { id: 'all', label: 'All Discovery', bnLabel: 'সব ফিড (Amazon Style)', icon: Zap, accent: 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]' },
    { id: 'retail', label: 'Retail (B2C)', bnLabel: 'রিটেইল (B2C)', icon: ShoppingBag, accent: 'bg-blue-500 text-white' },
    { id: 'wholesale', label: 'Wholesale B2B', bnLabel: 'পাইকারি (B2B)', icon: Package, accent: 'bg-amber-500 text-slate-950', badge: 'Bulk MOQ' },
    { id: 'nearby', label: 'Nearby Outlets', bnLabel: 'নিকটস্থ দোকান', icon: MapPin, accent: 'bg-emerald-600 text-white', badge: 'GPS Radar' },
    { id: 'services', label: 'Local Services', bnLabel: 'লোকাল সার্ভিস', icon: Wrench, accent: 'bg-purple-600 text-white' },
    { id: 'demand', label: 'Demand Board', bnLabel: 'ডিমান্ড বোর্ড (RFQ)', icon: Megaphone, accent: 'bg-orange-600 text-white', badge: 'Buyer Request' },
    { id: 'used', label: 'Used Market', bnLabel: 'ইউজড মার্কেট (P2P)', icon: Tag, accent: 'bg-teal-600 text-white', badge: 'Second Hand' },
  ];

  return (
    <div className="sticky top-16 z-20 pm-glass border-b border-[var(--pm-border)] -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-3 shadow-xs">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 scroll-smooth">
        {portalToggles.map((pt) => {
          const Icon = pt.icon;
          const isSelected = activePortal === pt.id;
          const count = portalCounts[pt.id] || 0;
          return (
            <button
              key={pt.id}
              type="button"
              onClick={() => onPortalSwitch(pt.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent shadow-md'
                  : 'bg-[var(--pm-card)] text-[var(--pm-text)] border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)] hover:border-[var(--pm-accent)]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{isBn ? pt.bnLabel : pt.label}</span>
              <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full font-mono ${
                isSelected 
                  ? 'bg-black/15' 
                  : 'bg-[var(--pm-surface)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {!hideSubCategories && dynamicSubCategories.length > 0 && (
        <div className="mt-2.5 pt-2.5 border-t border-[var(--pm-border)] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--pm-muted)] shrink-0 flex items-center gap-1">
            {isBn ? 'ক্যাটাগরি:' : 'Sub-Category:'}
          </span>

          {dynamicSubCategories.map((sub) => {
            const SubIcon = (sub as any).icon;
            const isSubSelected = selectedSubCategory === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSubCategorySelect(sub.id)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                  isSubSelected
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent shadow-xs'
                    : 'bg-[var(--pm-surface)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] border-[var(--pm-border)]'
                }`}
              >
                {SubIcon && <SubIcon className="w-3 h-3 shrink-0" />}
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
