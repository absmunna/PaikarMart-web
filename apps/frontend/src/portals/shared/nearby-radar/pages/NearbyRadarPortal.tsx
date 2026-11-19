import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Crosshair,
  Store,
  Wrench,
  Truck,
  Layers,
  Search,
  Star,
  ShieldCheck,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  Navigation,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { CommerceItem, User, ServiceBooking, PortalTab } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocationSettings } from '@/contexts/LocationContext';
import { computeLocalGeofenceMeta } from '@/features/logistics';
import { ServiceBookingModal } from '@/features/services';
import { ROUTE_PATHS } from '@/app/router/routeIds';

interface NearbyRadarPortalProps {
  currentUser: User;
  commerceItems: CommerceItem[];
  onAddToCart?: (item: CommerceItem, quantity: number, isWholesale: boolean) => void;
  onBookService?: (booking: Omit<ServiceBooking, 'id' | 'status'>) => void;
  onSelectTab?: (tab: PortalTab) => void;
}

type NearbyFilterCategory = 'all' | 'shops' | 'services' | 'logistics';

export const NearbyRadarPortal: React.FC<NearbyRadarPortalProps> = ({
  currentUser,
  commerceItems,
  onAddToCart,
  onBookService,
  onSelectTab
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    activeLocation,
    coordinates,
    radarRadiusKm,
    setRadarRadiusKm,
    detectLiveLocation,
    isLocating
  } = useLocationSettings();

  // URL Hub parameter support (?hub=services or ?hub=marketplace or ?hub=logistics)
  const hubParam = searchParams.get('hub');
  const initialCategory: NearbyFilterCategory =
    hubParam === 'services'
      ? 'services'
      : hubParam === 'logistics'
      ? 'logistics'
      : hubParam === 'marketplace'
      ? 'shops'
      : 'all';

  const [activeCategory, setActiveCategory] = useState<NearbyFilterCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [openOnly, setOpenOnly] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<CommerceItem | null>(null);

  // Sync if hubParam changes in URL
  useEffect(() => {
    if (hubParam === 'services') setActiveCategory('services');
    else if (hubParam === 'logistics') setActiveCategory('logistics');
    else if (hubParam === 'marketplace') setActiveCategory('shops');
  }, [hubParam]);

  // Compute live geofence distances deterministically for items
  const itemsWithDistance = useMemo(() => {
    return commerceItems.map((item, idx) => {
      const meta = computeLocalGeofenceMeta(item, coordinates, radarRadiusKm, idx);
      const isService = item.type === 'service';
      const isLogistics = item.type === 'rides' || Boolean(item.badge?.toLowerCase().includes('logistics'));

      return {
        ...item,
        distanceKm: meta.distanceKm,
        isWithinRadius: meta.withinRadius,
        isOpenNow: meta.isOpen,
        prepMinutes: meta.estimatedPrepMin,
        inferredCategory: isLogistics ? 'logistics' : isService ? 'services' : 'shops'
      };
    });
  }, [commerceItems, coordinates, radarRadiusKm]);

  // Filter based on active category, radius, openOnly, and searchQuery
  const filteredPlaces = useMemo(() => {
    return itemsWithDistance
      .filter((place) => {
        // Category domain
        if (activeCategory === 'shops' && place.inferredCategory !== 'shops') return false;
        if (activeCategory === 'services' && place.inferredCategory !== 'services') return false;
        if (activeCategory === 'logistics' && place.inferredCategory !== 'logistics') return false;

        // Radius filter
        if (!place.isWithinRadius && radarRadiusKm <= 5) return false;

        // Open only
        if (openOnly && !place.isOpenNow) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = place.title.toLowerCase().includes(q);
          const matchesStore = place.storeName.toLowerCase().includes(q);
          const matchesCat = place.category?.toLowerCase().includes(q) || false;
          if (!matchesTitle && !matchesStore && !matchesCat) return false;
        }

        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [itemsWithDistance, activeCategory, radarRadiusKm, openOnly, searchQuery]);

  const handleCategorySwitch = (cat: NearbyFilterCategory) => {
    setActiveCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'shops') newParams.set('hub', 'marketplace');
    else if (cat === 'services') newParams.set('hub', 'services');
    else if (cat === 'logistics') newParams.set('hub', 'logistics');
    else newParams.delete('hub');
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 animate-fadeIn">
      {/* 1. Header & Live Radar Radar Strip */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] p-4 sm:p-7 text-[var(--pm-text)] shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>{isBn ? 'হাইপারলোকাল জিপিএস রাডার' : 'Hyperlocal Radar (GPS)'}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">
              {isBn ? 'আপনার আশেপাশের দোকান ও সেবা' : 'Explore Nearby Outlets & Services'}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--pm-muted)] leading-relaxed">
              {isBn
                ? `বর্তমান অবস্থান: ${activeLocation || 'Dhaka, Bangladesh'} (${radarRadiusKm} কিমি রাডার পরিসীমা)`
                : `Current location: ${activeLocation || 'Dhaka, Bangladesh'} (within ${radarRadiusKm}km radar)`}
            </p>
          </div>

          <button
            type="button"
            onClick={detectLiveLocation}
            disabled={isLocating}
            className="px-4 py-2.5 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-xs font-bold flex items-center gap-2 cursor-pointer active-scale text-[var(--pm-text)] shrink-0 transition-colors"
          >
            <Crosshair className={`w-4 h-4 text-[var(--pm-accent)] ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? (isBn ? 'চিহ্নিত করা হচ্ছে...' : 'Locating...') : (isBn ? 'বর্তমান GPS সন্ধান' : 'Detect Live GPS')}</span>
          </button>
        </div>

        {/* 2. Radar Radius Control Chips */}
        <div className="mt-5 pt-4 border-t border-[var(--pm-border)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] font-black uppercase text-[var(--pm-muted)] tracking-wider">
              {isBn ? 'রাডার পরিসীমা:' : 'Radar Radius:'}
            </span>
            {[0.5, 1, 2, 5, 10, 20].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => setRadarRadiusKm(km)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  radarRadiusKm === km
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                    : 'bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
                }`}
              >
                {km} {isBn ? 'কিমি' : 'km'}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-[var(--pm-text)] cursor-pointer">
            <input
              type="checkbox"
              checked={openOnly}
              onChange={(e) => setOpenOnly(e.target.checked)}
              className="rounded accent-[var(--pm-accent)]"
            />
            <span>{isBn ? 'এখন খোলা আছে (Open Now)' : 'Open Now Only'}</span>
          </label>
        </div>

        {/* 3. Domain Filter Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategorySwitch('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeCategory === 'all'
                ? 'bg-[var(--pm-text)] text-[var(--pm-bg)] shadow-sm'
                : 'bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isBn ? 'সব নিকটস্থ' : 'All Nearby'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10">
              {itemsWithDistance.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCategorySwitch('shops')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeCategory === 'shops'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{isBn ? '🏪 দোকান ও শপ (মার্কেটপ্লেস)' : '🏪 Local Stores & Shops'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10">
              {itemsWithDistance.filter((i) => i.inferredCategory === 'shops').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCategorySwitch('services')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeCategory === 'services'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{isBn ? '🔧 টেকনিশিয়ান ও সার্ভিস' : '🔧 Technicians & Services'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10">
              {itemsWithDistance.filter((i) => i.inferredCategory === 'services').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCategorySwitch('logistics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeCategory === 'logistics'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{isBn ? '🚚 রাইডার ও ট্রান্সপোর্ট' : '🚚 Live Riders & Fleet'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10">
              {itemsWithDistance.filter((i) => i.inferredCategory === 'logistics').length}
            </span>
          </button>
        </div>
      </section>

      {/* 4. Search Filter */}
      <section className="relative">
        <Search className="w-4 h-4 text-[var(--pm-muted)] absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder={
            isBn
              ? 'নিকটস্থ দোকান, ফার্মেসি, রেস্টুরেন্ট বা মেকানিক খুঁজুন...'
              : 'Search nearby shops, pharmacies, technicians, or drivers...'
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] transition-all shadow-xs"
        />
      </section>

      {/* 5. Places Listing Grid */}
      <section aria-label="Nearby listing" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold text-[var(--pm-muted)]">
            {filteredPlaces.length} {isBn ? 'টি নিকটস্থ আউটলেট পাওয়া গেছে' : 'nearby places found'}
          </p>
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--pm-surface)] text-[var(--pm-muted)] flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[var(--pm-text)]">
              {isBn ? 'এই রেঞ্জে কোনো আউটলেট পাওয়া যায়নি' : 'No outlets found in this radius'}
            </h4>
            <p className="text-xs text-[var(--pm-muted)] max-w-sm mx-auto">
              {isBn
                ? 'রাডার পরিধি বাড়িয়ে ১০ বা ২০ কিমি সিলেক্ট করুন অথবা জিপিএস লোকেশন রিফ্রেশ করুন।'
                : 'Try increasing your radar radius to 10km or 20km to discover more nearby shops.'}
            </p>
            <button
              type="button"
              onClick={() => setRadarRadiusKm(20)}
              className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] text-xs font-bold cursor-pointer"
            >
              {isBn ? '২০ কিমি রাডার সেট করুন' : 'Expand to 20km'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3 group hover:border-[var(--pm-accent)]/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] overflow-hidden shrink-0">
                        <img
                          src={place.imageUrl || '/src/assets/images/paikarmart_fresh_grocery_1794489814176.jpg'}
                          alt={place.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[var(--pm-text)] truncate">{place.storeName}</h4>
                        <p className="text-[11px] text-[var(--pm-muted)] truncate">{place.title}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <Navigation className="w-2.5 h-2.5" />
                        {place.distanceKm < 1
                          ? `${Math.round(place.distanceKm * 1000)}m away`
                          : `${place.distanceKm.toFixed(1)} km`}
                      </span>
                      {place.isOpenNow ? (
                        <span className="text-[9px] font-bold text-emerald-500 mt-1">● Open Now</span>
                      ) : (
                        <span className="text-[9px] font-bold text-[var(--pm-muted)] mt-1">○ Closed</span>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-[var(--pm-muted)] line-clamp-2 leading-relaxed">
                    {place.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--pm-border)] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--pm-muted)]">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {place.rating || 4.8}
                    </span>
                    <span className="font-mono font-black text-sm text-[var(--pm-text)]">
                      ৳{place.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {place.inferredCategory === 'services' ? (
                      <button
                        type="button"
                        onClick={() => setSelectedServiceForBooking(place)}
                        className="px-3.5 py-1.5 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] text-xs font-bold cursor-pointer active-scale"
                      >
                        {isBn ? 'স্লট বুক করুন' : 'Book Service'}
                      </button>
                    ) : place.inferredCategory === 'logistics' ? (
                      <button
                        type="button"
                        onClick={() => navigate(ROUTE_PATHS.TRANSIT)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold cursor-pointer active-scale"
                      >
                        {isBn ? 'রাইড কল করুন' : 'Call Driver'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddToCart?.(place, 1, place.type === 'wholesale')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer active-scale"
                      >
                        {isBn ? 'অর্ডার করুন' : 'Order Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Service Booking Modal Integration */}
      {selectedServiceForBooking && onBookService && (
        <ServiceBookingModal
          selectedService={selectedServiceForBooking}
          onClose={() => setSelectedServiceForBooking(null)}
          onBookService={(booking) => {
            onBookService(booking);
            setSelectedServiceForBooking(null);
          }}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
