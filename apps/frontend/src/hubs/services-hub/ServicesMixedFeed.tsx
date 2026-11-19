import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Utensils, Hotel, MapPin, ClipboardList, Activity, Cpu, Sparkles } from 'lucide-react';
import type { CommerceItem, ServiceBooking, User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { HubFeedCard } from '@/hubs/shared/HubFeedCard';
import { findRegisteredPortal, getPortalsForHub } from '@/hubs/shared/portalRegistry';
import {
  ServiceCategoryPortal,
  type ServicePortalBaseProps,
} from '@/portals/services/shared/ServiceCategoryPortal';
import {
  LocalServicesPortal,
  FoodDeliveryPortal,
  TravelStaysPortal,
  HealthClinicPortal,
  ApplianceRepairPortal,
} from '@/portals/services';

const SERVICE_CHILD_VIEWS: Record<string, React.ComponentType<ServicePortalBaseProps>> = {
  'local-services': LocalServicesPortal,
  'food-delivery': FoodDeliveryPortal,
  'health-clinic': HealthClinicPortal,
  'appliance-repair': ApplianceRepairPortal,
  travel: TravelStaysPortal,
};

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  wrench: Wrench,
  utensils: Utensils,
  activity: Activity,
  cpu: Cpu,
  hotel: Hotel,
  'map-pin': MapPin,
  clipboard: ClipboardList,
};

interface ServicesMixedFeedProps {
  items: CommerceItem[];
  bookings: ServiceBooking[];
  currentUser?: User;
  activePortalId?: string;
  externalSearchQuery?: string;
  externalSubCategory?: string;
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

export const ServicesMixedFeed: React.FC<ServicesMixedFeedProps> = ({
  items,
  bookings,
  currentUser,
  activePortalId = 'all',
  externalSearchQuery = '',
  externalSubCategory = 'all',
  onBookService,
  onDeductBalance,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();
  const [selectedChildPortal, setSelectedChildPortal] = useState(activePortalId);

  useEffect(() => {
    setSelectedChildPortal(activePortalId);
  }, [activePortalId]);

  const registeredServicePortals = useMemo(() => getPortalsForHub('services'), []);

  const handlePortalSelect = (portalId: string, entryRoute: string) => {
    if (portalId === 'nearby-services' || portalId === 'service-demands' || portalId === 'logistics') {
      navigate(entryRoute);
      return;
    }
    setSelectedChildPortal(portalId);
  };

  const allMixedItems = useMemo(
    () =>
      items.filter((item) => {
        const badge = item.badge?.toLowerCase() || '';
        return (
          item.type === 'service' ||
          item.type === 'rides' ||
          item.isDemandRequest ||
          badge.includes('demand') ||
          badge.includes('offer') ||
          badge.includes('deal')
        );
      }),
    [items]
  );

  const mixedItems = useMemo(() => {
    let list = allMixedItems;
    if (externalSubCategory && externalSubCategory !== 'all') {
      const subQ = externalSubCategory.toLowerCase();
      list = list.filter((item) =>
        `${item.title} ${item.description} ${item.category} ${item.subCategory} ${item.badge}`
          .toLowerCase()
          .includes(subQ)
      );
    }
    if (externalSearchQuery.trim()) {
      const q = externalSearchQuery.trim().toLowerCase();
      list = list.filter((item) =>
        `${item.title} ${item.description} ${item.category} ${item.subCategory} ${item.storeName} ${item.badge}`
          .toLowerCase()
          .includes(q)
      );
    }
    return list;
  }, [allMixedItems, externalSearchQuery, externalSubCategory]);

  const serviceItems = useMemo(
    () => items.filter((item) => item.type === 'service'),
    [items]
  );

  const sharedPortalProps: ServicePortalBaseProps = {
    items,
    bookings,
    currentUser,
    externalSearchQuery,
    externalSubCategory,
    onBookService,
    onDeductBalance,
    onResetChildPortal: () => setSelectedChildPortal('all'),
  };

  const registeredPortal =
    selectedChildPortal !== 'all' ? findRegisteredPortal(selectedChildPortal) : undefined;
  const ChildPortalComponent = registeredPortal
    ? SERVICE_CHILD_VIEWS[registeredPortal.id]
    : undefined;

  if (ChildPortalComponent) {
    return <ChildPortalComponent {...sharedPortalProps} />;
  }

  return (
    <div className="space-y-5 pb-20 animate-fadeIn">
      {/* Hero Banner */}
      <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-900 p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? 'সার্ভিসেস হাব · লাইভ ফিড' : 'Services Hub · Live Feed'}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight">
            {isBn ? 'লোকাল টেকনিশিয়ান, ফুড ডেলিভারি, হেলথ ও ট্রাভেল স্টে' : 'Local Technicians, Food Delivery, Health & Travel Stays'}
          </h1>
          <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
            {isBn
              ? 'এসি রিপেয়ার, ডাক্তার অ্যাপয়েন্টমেন্ট, রেস্টুরেন্ট ফুড, অ্যাপ্লায়েন্স ও হোটেল বুকিং এক জায়গা থেকে করুন। ওয়ালেট পেমেন্টে ৫% ছাড়!'
              : 'Book trusted electricians, doctor consultations, gourmet food delivery, appliance repair, and travel stays instantly.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedChildPortal('local-services')}
              className="px-3.5 py-2 rounded-xl bg-white text-emerald-950 text-xs font-black hover:bg-emerald-50 transition-colors cursor-pointer shadow-sm"
            >
              {isBn ? 'লোকাল সার্ভিস ব্রাউজ করুন' : 'Browse Local Services'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedChildPortal('health-clinic')}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-sm transition-colors cursor-pointer border border-white/20"
            >
              {isBn ? 'হেলথ ও ডাক্তার কেয়ার' : 'Health & Doctor Care'}
            </button>
          </div>
        </div>
      </section>

      {/* Child Portal Selector Rail */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => setSelectedChildPortal('all')}
          className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            selectedChildPortal === 'all'
              ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent'
              : 'bg-[var(--pm-card)] text-[var(--pm-text)] border-[var(--pm-border)]'
          }`}
        >
          {isBn ? 'সব সার্ভিস ফিড' : 'All Services Feed'}
        </button>
        {registeredServicePortals.map((portal) => {
          const Icon = SERVICE_ICONS[portal.iconName] || Wrench;
          const isActive = selectedChildPortal === portal.id;
          return (
            <button
              key={portal.id}
              type="button"
              onClick={() => handlePortalSelect(portal.id, portal.entryRoute)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent'
                  : 'bg-[var(--pm-card)] text-[var(--pm-text)] border-[var(--pm-border)] hover:border-[var(--pm-accent)]/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{isBn ? portal.labelBn : portal.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* All Services & Offers Mixed Feed Grid */}
      <section aria-label="Mixed services feed" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[var(--pm-text)]">
              {isBn ? 'লাইভ সার্ভিস ও অফার ফিড' : 'Live Services & Provider Offers'}
            </h2>
            <p className="text-xs text-[var(--pm-muted)]">
              {mixedItems.length} {isBn ? 'টি প্রোভাইডার ও সার্ভিস উপলব্ধ' : 'active listings & provider offers'}
            </p>
          </div>
          <span className="rounded-full bg-[var(--pm-accent-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--pm-accent)]">
            Live Radar
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {mixedItems.map((item) => (
            <HubFeedCard key={item.id} item={item} kind={getFeedKind(item)} />
          ))}
        </div>
      </section>

      {/* Nearby Service Booking Radar */}
      <section aria-label="Nearby service booking">
        <ServiceCategoryPortal
          items={serviceItems}
          bookings={bookings}
          currentUser={currentUser}
          externalSearchQuery={externalSearchQuery}
          externalSubCategory={externalSubCategory}
          onBookService={onBookService}
          onDeductBalance={onDeductBalance}
          config={{
            portalId: 'services-mixed-radar',
            badgeEn: 'Services Hub · Live Booking Radar',
            badgeBn: 'সার্ভিস হাব · লাইভ বুকিং রাডার',
            titleEn: 'Nearby Technicians & Home Repair',
            titleBn: 'কাছাকাছি টেকনিশিয়ান ও হোম রিপেয়ার',
            subtitleEn: 'Book certified local technicians & save 5% paying in advance via Wallet.',
            subtitleBn: 'ভেরিফায়েড টেকনিশিয়ান বুক করুন এবং ওয়ালেট পেমেন্টে ৫% সাশ্রয় পান।',
            accentGradient: 'from-emerald-700 to-teal-800',
            searchPlaceholderEn: 'Search nearest electrician, AC repair, plumber, doctor, salon...',
            searchPlaceholderBn: 'ইলেকট্রিশিয়ান, এসি রিপেয়ার, ডাক্তার, প্লাম্বার খুঁজুন...',
          }}
        />
      </section>
    </div>
  );
};
