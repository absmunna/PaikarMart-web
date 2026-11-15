import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, Sliders, Crosshair, CalendarCheck } from 'lucide-react';
import { CommerceItem, ServiceBooking, User } from '@/types';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { ServiceCard } from '@/portals/services-hub/components/ServiceCard';
import { ServiceBookingModal } from '@/portals/services-hub/components/ServiceBookingModal';
import { useLocationSettings } from '@/contexts';
import { useLanguage } from '@/contexts/LanguageContext';
import { logisticsOrderApiClient } from '@/features/logistics';
import { computeLocalGeofenceMeta, type ComputedHyperlocalMeta } from '@/lib/hyperlocal';

interface NearbyServicesPortalProps {
  serviceItems: CommerceItem[];
  onBookService: (booking: Omit<ServiceBooking, 'id' | 'status'>) => void;
  bookings: ServiceBooking[];
  currentUser?: User;
  onDeductBalance?: (amount: number) => boolean;
}

export const NearbyServicesPortal: React.FC<NearbyServicesPortalProps> = ({
  serviceItems,
  onBookService,
  bookings,
  currentUser,
  onDeductBalance
}) => {
  const { activeLocation, coordinates, radarRadiusKm, setRadarRadiusKm, detectLiveLocation, isLocating } =
    useLocationSettings();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [selectedService, setSelectedService] = useState<CommerceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'physical' | 'digital'>('all');
  const [openOnly, setOpenOnly] = useState(false);
  const [serverMetaMap, setServerMetaMap] = useState<Record<string, ComputedHyperlocalMeta>>({});

  // Compute immediate deterministic coordinates & Haversine fallback
  const localMetaMap = useMemo(() => {
    const map: Record<string, ComputedHyperlocalMeta> = {};
    serviceItems.forEach((item, idx) => {
      map[item.id] = computeLocalGeofenceMeta(item, coordinates, radarRadiusKm, idx);
    });
    return map;
  }, [serviceItems, coordinates, radarRadiusKm]);

  // Sync with backend Haversine Geofence engine (/api/logistics/hyperlocal/rank)
  useEffect(() => {
    if (serviceItems.length === 0) return;
    let active = true;

    const providers = serviceItems.map((item) => {
      const m = localMetaMap[item.id];
      return {
        id: item.id,
        lat: m.coordinates.lat,
        lng: m.coordinates.lng,
        prepMinutes: item.prepMinutes ?? 15,
        isOpen: item.isOpen ?? true
      };
    });

    void logisticsOrderApiClient
      .rankHyperlocalProviders({
        buyerLat: coordinates.lat,
        buyerLng: coordinates.lng,
        radiusKm: radarRadiusKm,
        providers
      })
      .then((ranked) => {
        if (!active || !ranked) return;
        const next: Record<string, ComputedHyperlocalMeta> = {};
        ranked.forEach((entry) => {
          const base = localMetaMap[entry.id];
          if (base) {
            next[entry.id] = {
              ...base,
              ...entry
            };
          }
        });
        setServerMetaMap(next);
      });

    return () => {
      active = false;
    };
  }, [coordinates.lat, coordinates.lng, radarRadiusKm, serviceItems, localMetaMap]);

  const effectiveMetaMap = useMemo(
    () => ({ ...localMetaMap, ...serverMetaMap }),
    [localMetaMap, serverMetaMap]
  );

  const filteredServices = useMemo(() => {
    return serviceItems
      .filter((item) => {
        const meta = effectiveMetaMap[item.id];
        if (activeFilter === 'digital' && item.subCategory !== 'digital') return false;
        if (activeFilter === 'physical' && item.subCategory === 'digital') return false;
        if (openOnly && meta && !meta.isOpen) return false;
        if (activeFilter !== 'digital' && meta && !meta.withinRadius) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            item.title.toLowerCase().includes(q) ||
            item.storeName.toLowerCase().includes(q) ||
            (item.subCategory || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const da = effectiveMetaMap[a.id]?.distanceKm ?? 999;
        const db = effectiveMetaMap[b.id]?.distanceKm ?? 999;
        return da - db;
      });
  }, [serviceItems, effectiveMetaMap, activeFilter, openOnly, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn pb-20">
      {/* Compact promotion card keeps the booking flow focused. */}
      <section className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-900 to-teal-800 px-4 py-3 text-white shadow-sm">
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-emerald-200">{isBn ? 'সার্ভিস অফার' : 'Service offer'}</p>
          <p className="truncate text-sm font-black">{isBn ? 'ওয়ালেট পেমেন্টে ৫% সাশ্রয়' : 'Save 5% with wallet payment'}</p>
        </div>
        <span className="shrink-0 rounded-lg bg-white/15 px-2.5 py-1 text-[10px] font-bold">5% OFF</span>
      </section>

      {/* Header */}
      <div className="px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--pm-text)]">
              Nearby Services & Technicians
            </h1>
            <span className="text-xs font-bold text-[var(--pm-success)]">
              · {radarRadiusKm} km Geofence Active
            </span>
          </div>
          <p className="text-xs text-[var(--pm-muted)]">
            Hub: <span className="font-bold text-[var(--pm-text)]">{activeLocation}</span> · Book local technicians & save 5% paying advance via Wallet.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void detectLiveLocation()}
          disabled={isLocating}
          className="px-3.5 py-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] hover:border-[var(--pm-accent)] flex items-center gap-1.5 self-start cursor-pointer transition-colors"
        >
          <Crosshair className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
          <span>{isLocating ? 'Locating GPS...' : 'Refresh GPS'}</span>
        </button>
      </div>

      {/* Hyperlocal Radar Slider (1-20 km, default 5 km) */}
      <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--pm-text)]">
            <Sliders className="w-4 h-4 text-[var(--pm-accent)]" />
            <span>Hyperlocal Geofence Radius:</span>
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
              <span>Open Only</span>
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

      {/* Search & Filter */}
      <div className="bg-[var(--pm-bg)] py-1 sm:py-2 -mx-2 px-2 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-muted)]" />
          <input
            type="text"
            placeholder="Search nearest electrician, AC repair, salon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] text-sm focus:border-[var(--pm-accent)] outline-hidden"
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
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]'
                  : 'bg-[var(--pm-card)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] border border-[var(--pm-border)]'
              }`}
            >
              {f} Services
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Centered on User Active Hub */}
      <div className="h-56 sm:h-72 w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--pm-border)] shadow-md relative bg-[var(--pm-surface)]">
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

      {/* Active Scheduled Bookings Summary */}
      {bookings.length > 0 && (
        <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--pm-text)]">
            <CalendarCheck className="w-4 h-4 text-[var(--pm-success)]" />
            <span>Your Scheduled Service Bookings ({bookings.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {bookings.slice(0, 4).map((b) => (
              <div key={b.id} className="p-3 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-[var(--pm-text)] truncate">{b.serviceTitle}</p>
                  <p className="text-[11px] text-[var(--pm-muted)] truncate">
                    {b.providerName} · {b.timeSlot}
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

      {/* Ranked Proximity Service List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredServices.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-center space-y-3">
            <p className="text-sm font-bold text-[var(--pm-text)]">
              No providers matched within {radarRadiusKm} km.
            </p>
            <button
              type="button"
              onClick={() => setRadarRadiusKm(Math.min(20, radarRadiusKm + 5))}
              className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold cursor-pointer transition-colors"
            >
              Expand Radar to {Math.min(20, radarRadiusKm + 5)} km
            </button>
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

      {/* Booking Modal */}
      <ServiceBookingModal
        selectedService={selectedService}
        onClose={() => setSelectedService(null)}
        onBookService={onBookService}
        currentUser={currentUser}
        onDeductBalance={onDeductBalance}
        hyperlocalMeta={selectedService ? effectiveMetaMap[selectedService.id] : undefined}
      />
    </div>
  );
};
