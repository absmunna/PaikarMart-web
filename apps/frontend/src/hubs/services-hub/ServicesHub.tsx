import React, { useMemo } from 'react';
import type { CommerceItem, ServiceBooking, User } from '@/types';
import { NearbyServicesPortal } from '@/portals/services-hub/pages/NearbyServicesPortal';
import { HubFeedCard } from '@/hubs/shared/HubFeedCard';

interface ServicesHubProps {
  items: CommerceItem[];
  bookings: ServiceBooking[];
  currentUser?: User;
  activePortalId?: string;
  onBookService: (booking: Omit<ServiceBooking, 'id' | 'status'>) => void;
  onDeductBalance?: (amount: number) => boolean;
}

function getFeedKind(item: CommerceItem) {
  if (item.isDemandRequest || item.badge?.toLowerCase().includes('demand')) return 'Demand';
  if (item.type === 'rides') return 'Logistics';
  if (item.type === 'service') return 'Service';
  if (item.badge?.toLowerCase().includes('offer') || item.badge?.toLowerCase().includes('deal')) return 'Offer';
  return 'Provider';
}

export const ServicesHub: React.FC<ServicesHubProps> = ({
  items,
  bookings,
  currentUser,
  activePortalId = 'all',
  onBookService,
  onDeductBalance,
}) => {
  const allMixedItems = useMemo(
    () => items.filter((item) => {
      const badge = item.badge?.toLowerCase() || '';
      return item.type === 'service' || item.type === 'rides' || item.isDemandRequest || badge.includes('demand') || badge.includes('offer') || badge.includes('deal');
    }),
    [items]
  );

  const mixedItems = useMemo(() => {
    if (activePortalId === 'all') return allMixedItems;
    if (activePortalId === 'local-services') return allMixedItems.filter((item) => item.type !== 'rides');
    if (activePortalId === 'logistics') return allMixedItems.filter((item) => item.type === 'rides' || item.badge?.toLowerCase().includes('logistics'));
    const query = activePortalId === 'food-delivery' ? 'food' : activePortalId === 'travel' ? 'travel' : activePortalId;
    return allMixedItems.filter((item) => `${item.title} ${item.description} ${item.category} ${item.subCategory} ${item.badge}`.toLowerCase().includes(query));
  }, [activePortalId, allMixedItems]);

  const activePortalLabel = activePortalId === 'all'
    ? 'All Services'
    : activePortalId === 'local-services'
    ? 'Local Services'
    : activePortalId === 'food-delivery'
    ? 'Food Delivery'
    : activePortalId === 'logistics'
    ? 'Logistics & Rides'
    : 'Travel & Stays';

  const serviceItems = useMemo(
    () => items.filter((item) => item.type === 'service'),
    [items]
  );

  return (
    <div data-hub-id="services" data-feed-mode="mixed" className="space-y-4 sm:space-y-6 pb-20">
      <section className="rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] p-4 sm:p-7 text-[var(--pm-text)] shadow-lg">
        <p className="text-[10px] font-bold text-[var(--pm-accent)]">Services Hub · Mixed Feed</p>
        <h1 className="mt-1 text-xl sm:text-3xl font-black tracking-tight">সেবা, লোকাল প্রোভাইডার ও লজিস্টিকস</h1>
        <p className="mt-2 max-w-2xl text-xs sm:text-sm text-[var(--pm-muted)] line-clamp-2">
          Service cards, provider offers, buyer demands, rides and delivery options একসাথে দেখুন।
        </p>
      </section>

      <section aria-label="Mixed services feed" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-black text-[var(--pm-text)]">{activePortalLabel} Feed</h2>
            <p className="text-xs text-[var(--pm-muted)]">{mixedItems.length} টি service ও logistics listing</p>
          </div>
          <span className="rounded-full bg-[var(--pm-accent-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--pm-accent)]">Live</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {mixedItems.map((item) => (
            <HubFeedCard key={item.id} item={item} kind={getFeedKind(item)} />
          ))}
        </div>
      </section>

      <section aria-label="Nearby service booking">
        <NearbyServicesPortal
          serviceItems={serviceItems}
          onBookService={onBookService}
          bookings={bookings}
          currentUser={currentUser}
          onDeductBalance={onDeductBalance}
        />
      </section>
    </div>
  );
};
