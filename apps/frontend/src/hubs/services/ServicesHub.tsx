import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import type { CommerceItem, ServiceBooking, User } from '@/types';
import { HubFeedCard } from '@/hubs/shared/HubFeedCard';
import { HubPortalNavigation } from '@/hubs/shared/HubPortalNavigation';
import { NearbyServicesPortal } from '@/hubs/services/portals/local-services/pages/NearbyServicesPortal';
import { servicePortals } from '@/hubs/services/config/servicePortals';

interface ServicesHubProps {
  items: CommerceItem[];
  bookings: ServiceBooking[];
  currentUser?: User;
  onBookService: (booking: Omit<ServiceBooking, 'id' | 'status'>) => void;
  onDeductBalance?: (amount: number) => boolean;
}

const getFeedKind = (item: CommerceItem) => {
  if (item.isDemandRequest || item.badge?.toLowerCase().includes('demand')) return 'Demand';
  if (item.type === 'service') return 'Service';
  return 'Provider';
};

export const ServicesHub: React.FC<ServicesHubProps> = ({
  items,
  bookings,
  currentUser,
  onBookService,
  onDeductBalance,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [searchParams, setSearchParams] = useSearchParams();
  const portalParam = searchParams.get('portal');
  const activePortalId = servicePortals.some((portal) => portal.id === portalParam) ? portalParam! : 'all';
  const activePortal = servicePortals.find((portal) => portal.id === activePortalId);
  const selectedCategoryId = searchParams.get('category') || 'all';
  const selectedCategory = activePortal?.categories.find((category) => category.id === selectedCategoryId);

  const selectPortal = (portalId: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (portalId === 'all') next.delete('portal');
      else next.set('portal', portalId);
      next.delete('category');
      return next;
    });
  };

  const selectCategory = (categoryId: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (categoryId === 'all') next.delete('category');
      else next.set('category', categoryId);
      return next;
    });
  };

  const serviceItems = useMemo(() => {
    let result = items.filter((item) => item.type === 'service');
    if (selectedCategory && selectedCategory.filterKey !== 'all') {
      const query = selectedCategory.filterKey.toLowerCase();
      result = result.filter((item) =>
        `${item.title} ${item.description} ${item.category} ${item.subCategory} ${item.badge}`.toLowerCase().includes(query)
      );
    }
    return result;
  }, [items, selectedCategory]);

  const mixedItems = useMemo(() => {
    let result = items.filter((item) => {
      return item.type === 'service' || item.isDemandRequest;
    });

    if (activePortalId === 'food-delivery') {
      result = result.filter((item) => `${item.title} ${item.description} ${item.category} ${item.subCategory}`.toLowerCase().match(/food|restaurant|meal|bakery|খাবার|রেস্টুরেন্ট/));
    } else if (activePortalId === 'travel') {
      result = result.filter((item) => `${item.title} ${item.description} ${item.category} ${item.subCategory}`.toLowerCase().match(/travel|hotel|stay|tour|venue|ভ্রমণ|হোটেল/));
    }

    if (selectedCategory && selectedCategory.filterKey !== 'all') {
      const query = selectedCategory.filterKey.toLowerCase();
      result = result.filter((item) =>
        `${item.title} ${item.description} ${item.category} ${item.subCategory} ${item.badge}`.toLowerCase().includes(query)
      );
    }
    return result;
  }, [items, activePortalId, selectedCategory]);

  const activePortalLabel = activePortal
    ? (isBn ? activePortal.labelBn : activePortal.labelEn)
    : (isBn ? 'সব সেবা' : 'All Services');

  return (
    <div data-hub-id="services" data-feed-mode="mixed" className="space-y-4 pb-20 sm:space-y-6">
      <section className="rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-4 text-[var(--pm-text)] shadow-xs sm:rounded-3xl sm:p-7">
        <p className="text-[10px] font-bold text-[var(--pm-accent)]">Services Hub · Mixed Feed</p>
        <h1 className="mt-1 text-xl font-black tracking-tight sm:text-3xl">সেবা ও প্রোভাইডার—এক জায়গায়</h1>
        <p className="mt-2 line-clamp-2 max-w-2xl text-xs text-[var(--pm-muted)] sm:text-sm">
          স্থানীয় সেবা, সার্ভিস ডিমান্ড, খাবার ও ট্রাভেল listing এক feed থেকে খুঁজুন।
        </p>
      </section>

      <HubPortalNavigation
        portals={servicePortals}
        activePortalId={activePortalId}
        selectedCategoryId={selectedCategoryId}
        allLabel={isBn ? 'সব সেবা' : 'All Services'}
        categoryAllLabel={isBn ? 'সব ক্যাটাগরি' : 'All categories'}
        isBn={isBn}
        onPortalSelect={selectPortal}
        onCategorySelect={selectCategory}
      />

      {activePortalId === 'local-services' ? (
        <section aria-label="Local service portal home">
          <NearbyServicesPortal
            serviceItems={serviceItems}
            onBookService={onBookService}
            bookings={bookings}
            currentUser={currentUser}
            onDeductBalance={onDeductBalance}
          />
        </section>
      ) : (
        <section aria-label="Mixed services feed" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-lg font-black text-[var(--pm-text)]">{activePortalLabel} Feed</h2>
              <p className="text-xs text-[var(--pm-muted)]">{mixedItems.length} টি সেবা, অফার ও ডিমান্ড listing</p>
            </div>
            <span className="rounded-full bg-[var(--pm-accent-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--pm-accent)]">Live</span>
          </div>

          {mixedItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {mixedItems.map((item) => <HubFeedCard key={item.id} item={item} kind={getFeedKind(item)} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--pm-border)] bg-[var(--pm-card)] px-5 py-10 text-center">
              <p className="font-bold text-[var(--pm-text)]">{isBn ? 'এখানে এখনো কোনো listing নেই' : 'No listings in this category yet'}</p>
              <p className="mt-1 text-xs text-[var(--pm-muted)]">{isBn ? 'অন্য portal বা category বেছে দেখুন।' : 'Try another portal or category.'}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
