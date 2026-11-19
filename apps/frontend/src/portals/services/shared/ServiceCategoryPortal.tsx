import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck,
  Crosshair,
  MapPin,
  RotateCcw,
  Search,
  Sliders,
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  PlusCircle,
  DollarSign,
  TrendingUp,
  User as UserIcon,
  Star,
  Store,
  PhoneCall,
} from 'lucide-react';
import { APIProvider, AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps';
import { CommerceItem, ServiceBooking, User } from '@/types';
import { ServiceBookingModal, ServiceCard } from '@/features/services';
import { useLocationSettings } from '@/contexts';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  computeLocalGeofenceMeta,
  logisticsOrderApiClient,
  type ComputedHyperlocalMeta,
} from '@/features/logistics';

export interface ServicePortalBaseProps {
  items: CommerceItem[];
  onBookService: (booking: Omit<ServiceBooking, 'id' | 'status'>) => void;
  bookings: ServiceBooking[];
  currentUser?: User;
  onDeductBalance?: (amount: number) => boolean;
  externalSearchQuery?: string;
  externalSubCategory?: string;
  onResetChildPortal?: () => void;
  onUpdateBookingStatus?: (bookingId: string, status: 'scheduled' | 'in_progress' | 'completed') => void;
  onAddServiceItem?: (item: Omit<CommerceItem, 'id'>) => void;
}

export interface ServiceCategoryPortalConfig {
  portalId: string;
  badgeEn: string;
  badgeBn: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  accentGradient: string;
  searchPlaceholderEn: string;
  searchPlaceholderBn: string;
  itemMatcher?: (item: CommerceItem) => boolean;
}

interface ServiceCategoryPortalProps extends ServicePortalBaseProps {
  config: ServiceCategoryPortalConfig;
}

export const ServiceCategoryPortal: React.FC<ServiceCategoryPortalProps> = ({
  config,
  items,
  onBookService,
  bookings,
  currentUser,
  onDeductBalance,
  externalSearchQuery = '',
  externalSubCategory = 'all',
  onResetChildPortal,
  onUpdateBookingStatus,
  onAddServiceItem,
}) => {
  const { activeLocation, coordinates, radarRadiusKm, setRadarRadiusKm, detectLiveLocation, isLocating } =
    useLocationSettings();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Role-Based Portal Mode: 'customer' vs 'provider'
  const isVendorUser = Boolean(currentUser?.isVendor || currentUser?.role === 'vendor');
  const [portalViewMode, setPortalViewMode] = useState<'customer' | 'provider'>(
    isVendorUser ? 'provider' : 'customer'
  );

  const [selectedService, setSelectedService] = useState<CommerceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [activeFilter, setActiveFilter] = useState<'all' | 'physical' | 'digital'>('all');
  const [openOnly, setOpenOnly] = useState(false);
  const [serverMetaMap, setServerMetaMap] = useState<Record<string, ComputedHyperlocalMeta>>({});
  const [isOnlineProvider, setIsOnlineProvider] = useState(true);
  const [localBookings, setLocalBookings] = useState<ServiceBooking[]>(bookings);

  // New service listing modal state for providers
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('1500');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  const domainItems = useMemo(() => {
    if (!config.itemMatcher) return items;
    return items.filter(config.itemMatcher);
  }, [config, items]);

  const localMetaMap = useMemo(() => {
    const map: Record<string, ComputedHyperlocalMeta> = {};
    domainItems.forEach((item, idx) => {
      map[item.id] = computeLocalGeofenceMeta(item, coordinates, radarRadiusKm, idx);
    });
    return map;
  }, [domainItems, coordinates, radarRadiusKm]);

  useEffect(() => {
    if (domainItems.length === 0) return;
    let active = true;

    const providers = domainItems.map((item) => {
      const m = localMetaMap[item.id];
      return {
        id: item.id,
        lat: m.coordinates.lat,
        lng: m.coordinates.lng,
        prepMinutes: item.prepMinutes ?? 15,
        isOpen: item.isOpen ?? true,
      };
    });

    void logisticsOrderApiClient
      .rankHyperlocalProviders({
        buyerLat: coordinates.lat,
        buyerLng: coordinates.lng,
        radiusKm: radarRadiusKm,
        providers,
      })
      .then((ranked) => {
        if (!active || !ranked) return;
        const next: Record<string, ComputedHyperlocalMeta> = {};
        ranked.forEach((entry) => {
          const base = localMetaMap[entry.id];
          if (base) {
            next[entry.id] = { ...base, ...entry };
          }
        });
        setServerMetaMap(next);
      });

    return () => {
      active = false;
    };
  }, [coordinates.lat, coordinates.lng, radarRadiusKm, domainItems, localMetaMap]);

  const effectiveMetaMap = useMemo(
    () => ({ ...localMetaMap, ...serverMetaMap }),
    [localMetaMap, serverMetaMap]
  );

  const filteredServices = useMemo(() => {
    const subQuery = (externalSubCategory || 'all').trim().toLowerCase();
    const q = searchQuery.trim().toLowerCase();

    return domainItems
      .filter((item) => {
        const meta = effectiveMetaMap[item.id];
        if (activeFilter === 'digital' && item.subCategory !== 'digital') return false;
        if (activeFilter === 'physical' && item.subCategory === 'digital') return false;
        if (openOnly && meta && !meta.isOpen) return false;
        if (activeFilter !== 'digital' && meta && !meta.withinRadius) return false;

        if (subQuery && subQuery !== 'all') {
          const haystack = `${item.title} ${item.description || ''} ${item.category || ''} ${item.subCategory || ''} ${item.badge || ''}`.toLowerCase();
          if (!haystack.includes(subQuery)) return false;
        }

        if (q) {
          const haystack = `${item.title} ${item.description || ''} ${item.storeName || ''} ${item.category || ''} ${item.subCategory || ''}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const da = effectiveMetaMap[a.id]?.distanceKm ?? 999;
        const db = effectiveMetaMap[b.id]?.distanceKm ?? 999;
        return da - db;
      });
  }, [domainItems, effectiveMetaMap, activeFilter, openOnly, externalSubCategory, searchQuery]);

  const handleUpdateStatus = (bookingId: string, newStatus: 'scheduled' | 'in_progress' | 'completed') => {
    if (onUpdateBookingStatus) {
      onUpdateBookingStatus(bookingId, newStatus);
    }
    setLocalBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const providerEarningsTotal = useMemo(
    () => localBookings.reduce((sum, b) => sum + (b.status === 'completed' ? b.totalEstimate : b.depositAmount), 0),
    [localBookings]
  );

  return (
    <div className="space-y-5 animate-fadeIn pb-24">
      {/* Portal Header & Role Switcher Banner */}
      <section className={`rounded-3xl bg-gradient-to-r ${config.accentGradient} p-5 sm:p-7 text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isBn ? config.badgeBn : config.badgeEn}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">
              {isBn ? config.titleBn : config.titleEn}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              {isBn ? config.subtitleBn : config.subtitleEn}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onResetChildPortal && (
              <button
                type="button"
                onClick={onResetChildPortal}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-sm transition-colors cursor-pointer border border-white/20"
              >
                {isBn ? 'সব সার্ভিস ফিড' : 'All Services Feed'}
              </button>
            )}

            {/* Role Switcher (Customer vs Provider/Vendor) */}
            <div className="flex items-center p-1 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20">
              <button
                type="button"
                onClick={() => setPortalViewMode('customer')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  portalViewMode === 'customer'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{isBn ? 'গ্রাহক ভিউ' : 'Customer View'}</span>
              </button>
              <button
                type="button"
                onClick={() => setPortalViewMode('provider')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  portalViewMode === 'provider'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{isBn ? 'প্রোভাইডার ড্যাশবোর্ড' : 'Provider Hub'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Content View */}
      {portalViewMode === 'provider' ? (
        /* ================= PROVIDER / VENDOR DASHBOARD ================= */
        <div className="space-y-6 animate-fadeIn">
          {/* Provider Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-sm space-y-1">
              <div className="flex items-center justify-between text-[var(--pm-muted)]">
                <span className="text-xs font-bold">{isBn ? 'মোট আয় (৳)' : 'Total Earnings'}</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black font-mono text-[var(--pm-text)]">
                ৳{providerEarningsTotal.toLocaleString()}
              </p>
              <p className="text-[11px] text-[var(--pm-success)] font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14.2% {isBn ? 'গত সপ্তাহের তুলনায়' : 'vs last week'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-sm space-y-1">
              <div className="flex items-center justify-between text-[var(--pm-muted)]">
                <span className="text-xs font-bold">{isBn ? 'সক্রিয় বুকিং' : 'Active Bookings'}</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black font-mono text-[var(--pm-text)]">
                {localBookings.filter((b) => b.status !== 'completed').length}
              </p>
              <p className="text-[11px] text-[var(--pm-muted)]">
                {isBn ? 'অপেক্ষমাণ ও চলমান কাজ' : 'Pending & in-progress'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-sm space-y-1">
              <div className="flex items-center justify-between text-[var(--pm-muted)]">
                <span className="text-xs font-bold">{isBn ? 'সম্পন্ন সার্ভিস' : 'Completed Services'}</span>
                <CheckCircle2 className="w-4 h-4 text-teal-500" />
              </div>
              <p className="text-2xl font-black font-mono text-[var(--pm-text)]">
                {localBookings.filter((b) => b.status === 'completed').length + 24}
              </p>
              <p className="text-[11px] text-[var(--pm-success)] font-bold">4.9 ★ ⭐ ⭐ ⭐ ⭐</p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--pm-text)]">
                  {isBn ? 'প্রোভাইডার স্ট্যাটাস' : 'Provider Status'}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isOnlineProvider ? 'bg-emerald-500/15 text-emerald-600' : 'bg-rose-500/15 text-rose-600'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isOnlineProvider ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {isOnlineProvider ? (isBn ? 'অনলাইন (রেডারে দৃশ্যমান)' : 'Online & Active') : (isBn ? 'অফলাইন' : 'Offline')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOnlineProvider(!isOnlineProvider)}
                className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isOnlineProvider
                    ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                }`}
              >
                {isOnlineProvider ? (isBn ? 'অফলাইন হোন' : 'Go Offline') : (isBn ? 'অনলাইন হোন (লিড পান)' : 'Go Online for Leads')}
              </button>
            </div>
          </div>

          {/* Incoming Booking Requests & Management */}
          <div className="p-5 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-4 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[var(--pm-text)]">
                  {isBn ? 'ইনকামিং সার্ভিস বুকিং ও রিকুয়েস্ট' : 'Incoming Service Booking Requests'}
                </h2>
                <p className="text-xs text-[var(--pm-muted)]">
                  {isBn
                    ? 'গ্রাহকদের বুকিং কনফার্ম করুন, কাজ শুরু করুন বা সম্পন্ন করুন।'
                    : 'Manage customer service appointments, start work, and complete assignments.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddServiceModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] text-xs font-bold hover:bg-[var(--pm-accent-hover)] transition-colors cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isBn ? 'নতুন সার্ভিস অফার যোগ করুন' : 'Add Service Listing'}</span>
              </button>
            </div>

            {localBookings.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
                <Store className="w-8 h-8 text-[var(--pm-muted)] mx-auto" />
                <p className="text-sm font-bold text-[var(--pm-text)]">
                  {isBn ? 'কোনো নতুন বুকিং নেই।' : 'No active booking requests right now.'}
                </p>
                <p className="text-xs text-[var(--pm-muted)]">
                  {isBn ? 'অনলাইন থাকুন যাতে কাছাকাছি গ্রাহকরা আপনাকে খুঁজে পান।' : 'Stay online to receive local customer requests.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {localBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-black text-[var(--pm-text)] truncate">{booking.serviceTitle}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            booking.status === 'completed'
                              ? 'bg-teal-500/15 text-teal-600'
                              : booking.status === 'in_progress'
                              ? 'bg-amber-500/15 text-amber-600'
                              : 'bg-blue-500/15 text-blue-600'
                          }`}
                        >
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--pm-muted)] flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[var(--pm-text)]">{booking.customerName}</span>
                        <span>· {booking.customerPhone}</span>
                        <span>· 📍 {booking.serviceAddress}</span>
                        <span>· 🕒 {booking.date} ({booking.timeSlot})</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-black text-sm text-[var(--pm-text)]">
                        ৳{booking.totalEstimate.toLocaleString()}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${booking.customerPhone}`}
                          className="p-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:border-[var(--pm-accent)] transition-colors"
                          title="Call Customer"
                        >
                          <PhoneCall className="w-4 h-4 text-emerald-600" />
                        </a>
                        {booking.status === 'scheduled' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(booking.id, 'in_progress')}
                            className="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 cursor-pointer"
                          >
                            {isBn ? 'কাজ শুরু করুন' : 'Start Work'}
                          </button>
                        )}
                        {booking.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(booking.id, 'completed')}
                            className="px-3 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 cursor-pointer"
                          >
                            {isBn ? 'সম্পন্ন করুন' : 'Mark Complete'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Service Modal for Providers */}
          {showAddServiceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-md rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] p-6 space-y-4 shadow-2xl animate-scaleUp">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[var(--pm-text)]">
                    {isBn ? 'নতুন সার্ভিস অফার যোগ করুন' : 'Create New Service Listing'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddServiceModal(false)}
                    className="text-xs font-bold text-[var(--pm-muted)] hover:text-[var(--pm-text)] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1">
                      {isBn ? 'সার্ভিস শিরোনাম' : 'Service Title'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Expert AC Servicing & Gas Recharge"
                      value={newServiceTitle}
                      onChange={(e) => setNewServiceTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] border border-[var(--pm-border)] text-xs focus:border-[var(--pm-accent)] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1">
                      {isBn ? 'মূল্য (টাকা)' : 'Base Price (BDT)'}
                    </label>
                    <input
                      type="number"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] border border-[var(--pm-border)] text-xs focus:border-[var(--pm-accent)] outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1">
                      {isBn ? 'বিবরণ' : 'Description'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Detailed service scope, warranty, and experience..."
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] border border-[var(--pm-border)] text-xs focus:border-[var(--pm-accent)] outline-hidden resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddServiceModal(false)}
                    className="px-4 py-2 rounded-xl border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] cursor-pointer"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newServiceTitle.trim()) return;
                      if (onAddServiceItem) {
                        onAddServiceItem({
                          title: newServiceTitle,
                          description: newServiceDesc || 'Verified local service provider listing.',
                          price: Number(newServicePrice) || 1500,
                          category: 'Services',
                          subCategory: config.portalId,
                          storeId: currentUser?.id || 'vendor-pro-1',
                          storeName: currentUser?.name || 'Pro Provider',
                          type: 'service',
                          rating: 5.0,
                          reviewsCount: 1,
                          deliveryEta: '30 mins',
                          imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
                          inStock: true,
                          badge: 'Verified Pro',
                        });
                      }
                      setShowAddServiceModal(false);
                      setNewServiceTitle('');
                      setNewServiceDesc('');
                    }}
                    className="px-5 py-2 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] text-xs font-black cursor-pointer shadow-sm hover:bg-[var(--pm-accent-hover)] transition-colors"
                  >
                    {isBn ? 'প্রকাশ করুন' : 'Publish Listing'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= CUSTOMER BROWSE & BOOK VIEW ================= */
        <div className="space-y-6 animate-fadeIn">
          {/* Offer Notification Banner */}
          <section className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-900 to-teal-800 px-4 py-3 text-white shadow-sm">
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-emerald-200">{isBn ? 'সার্ভিস অফার' : 'Service promotion'}</p>
              <p className="truncate text-sm font-black">
                {isBn ? 'ওয়ালেট অ্যাডভান্স পেমেন্টে ৫% সাশ্রয়' : 'Save 5% instantly with advance wallet payment'}
              </p>
            </div>
            <span className="shrink-0 rounded-lg bg-white/15 px-2.5 py-1 text-[10px] font-bold">5% OFF</span>
          </section>

          {/* Hyperlocal Radar Header & GPS Control */}
          <div className="px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-[var(--pm-text)]">
                  {isBn ? 'কাছাকাছি ভেরিফাইড প্রোভাইডার' : 'Nearby Verified Providers'}
                </h2>
                <span className="text-xs font-bold text-[var(--pm-success)]">
                  · {radarRadiusKm} km {isBn ? 'জিওফেন্স সক্রিয়' : 'Geofence Active'}
                </span>
              </div>
              <p className="text-xs text-[var(--pm-muted)]">
                {isBn ? 'হাব:' : 'Hub:'} <span className="font-bold text-[var(--pm-text)]">{activeLocation}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => void detectLiveLocation()}
              disabled={isLocating}
              className="px-3.5 py-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] hover:border-[var(--pm-accent)] flex items-center gap-1.5 self-start cursor-pointer transition-colors shadow-sm"
            >
              <Crosshair className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
              <span>{isLocating ? (isBn ? 'লোকেশন খুঁজছে...' : 'Locating GPS...') : (isBn ? 'GPS রিফ্রেশ' : 'Refresh GPS')}</span>
            </button>
          </div>

          {/* Geofence Controls & Radius Slider */}
          <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--pm-text)]">
                <Sliders className="w-4 h-4 text-[var(--pm-accent)]" />
                <span>{isBn ? 'হাইপারলোকাল রাডার:' : 'Hyperlocal Geofence Radius:'}</span>
                <span className="font-mono text-[var(--pm-accent)]">{radarRadiusKm} km</span>
              </div>

              <div className="flex items-center gap-1.5">
                {[2, 5, 10, 20].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRadarRadiusKm(preset)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold cursor-pointer transition-colors ${
                      radarRadiusKm === preset
                        ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]'
                        : 'bg-[var(--pm-surface)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] border border-[var(--pm-border)]'
                    }`}
                  >
                    {preset}km
                  </button>
                ))}
                <label className="ml-2 flex items-center gap-1.5 text-xs font-bold text-[var(--pm-muted)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={openOnly}
                    onChange={(e) => setOpenOnly(e.target.checked)}
                    className="accent-emerald-600 rounded"
                  />
                  <span>{isBn ? 'শুধু খোলা' : 'Open Only'}</span>
                </label>
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={radarRadiusKm}
              onChange={(e) => setRadarRadiusKm(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
              aria-label="Hyperlocal service radar radius in kilometers"
            />
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-[var(--pm-bg)] py-1 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-muted)]" />
              <input
                type="text"
                placeholder={isBn ? config.searchPlaceholderBn : config.searchPlaceholderEn}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] text-sm focus:border-[var(--pm-accent)] outline-hidden shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {(['all', 'physical', 'digital'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === f
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-sm'
                      : 'bg-[var(--pm-card)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] border border-[var(--pm-border)]'
                  }`}
                >
                  {f} Services
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Map View */}
          <div className="h-56 sm:h-72 w-full rounded-3xl overflow-hidden border border-[var(--pm-border)] shadow-md relative bg-[var(--pm-surface)]">
            {(import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ? (
              <APIProvider apiKey={(import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY}>
                <Map
                  key={`${coordinates.lat.toFixed(3)}-${coordinates.lng.toFixed(3)}`}
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  defaultCenter={coordinates}
                  defaultZoom={radarRadiusKm <= 5 ? 13 : radarRadiusKm <= 12 ? 12 : 11}
                  mapId="DEMO_MAP_ID"
                  className="w-full h-full"
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                >
                  {filteredServices.map((service) => {
                    const pos = effectiveMetaMap[service.id]?.coordinates || coordinates;
                    return (
                      <AdvancedMarker
                        key={service.id}
                        position={pos}
                        title={`${service.title} (${effectiveMetaMap[service.id]?.distanceKm ?? 0} km)`}
                        onClick={() => setSelectedService(service)}
                      >
                        <Pin background="#059669" glyphColor="#ffffff" borderColor="#047857" />
                      </AdvancedMarker>
                    );
                  })}
                </Map>
              </APIProvider>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-2 bg-gradient-to-br from-emerald-950 to-slate-900 text-white">
                <MapPin className="w-8 h-8 text-emerald-400" />
                <h3 className="text-sm font-bold">
                  Hyperlocal Geofence Radar · {activeLocation}
                </h3>
                <p className="text-xs text-emerald-200/80">
                  Showing {filteredServices.length} verified providers within {radarRadiusKm} km radius
                </p>
              </div>
            )}
          </div>

          {/* User's Scheduled Bookings List */}
          {localBookings.length > 0 && (
            <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--pm-text)]">
                <CalendarCheck className="w-4 h-4 text-[var(--pm-success)]" />
                <span>{isBn ? `আপনার বুকিং সমূহ (${localBookings.length})` : `Your Scheduled Service Bookings (${localBookings.length})`}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {localBookings.slice(0, 4).map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-[var(--pm-text)] truncate">{b.serviceTitle}</p>
                      <p className="text-[11px] text-[var(--pm-muted)] truncate">
                        {b.providerName} · {b.timeSlot} · <span className="text-emerald-600 font-bold uppercase">{b.status}</span>
                      </p>
                    </div>
                    <span className="font-mono font-bold text-[var(--pm-success)] shrink-0">
                      ৳{b.totalEstimate.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Services List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredServices.length === 0 ? (
              <div className="p-8 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-center space-y-3 shadow-sm">
                <p className="text-sm font-bold text-[var(--pm-text)]">
                  {isBn ? `${radarRadiusKm} কিমি-এর মধ্যে কোনো প্রোভাইডার পাওয়া যায়নি।` : `No providers matched within ${radarRadiusKm} km.`}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRadarRadiusKm(Math.min(20, radarRadiusKm + 5))}
                    className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold cursor-pointer transition-colors shadow-sm"
                  >
                    {isBn ? `রাডার ${Math.min(20, radarRadiusKm + 5)} কিমি করুন` : `Expand Radar to ${Math.min(20, radarRadiusKm + 5)} km`}
                  </button>
                  {onResetChildPortal && (
                    <button
                      type="button"
                      onClick={onResetChildPortal}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-surface)] text-[var(--pm-text)] text-xs font-bold cursor-pointer shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isBn ? 'সব সার্ভিস দেখুন' : 'View All Services'}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  hyperlocalMeta={effectiveMetaMap[service.id]}
                  onClick={setSelectedService}
                />
              ))
            )}
          </div>

          <ServiceBookingModal
            selectedService={selectedService}
            onClose={() => setSelectedService(null)}
            onBookService={onBookService}
            currentUser={currentUser}
            onDeductBalance={onDeductBalance}
            hyperlocalMeta={selectedService ? effectiveMetaMap[selectedService.id] : undefined}
          />
        </div>
      )}
    </div>
  );
};
