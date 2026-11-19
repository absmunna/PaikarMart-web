import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Bike, Car, HeartPulse, Navigation, Search, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CommerceItem } from '@/types';
import {
  LogisticsQuoteBreakdown,
  LogisticsVehicleClass,
  RideDispatchRecord,
  WeatherTrafficMode,
  useLogisticsStore
} from '@/features/logistics';
import { RideOptionCard } from '@/portals/logistics/transit-logistics/components/RideOptionCard';

interface RideFleetViewProps {
  rideItems: CommerceItem[];
  onQuickBookCard: (ride: CommerceItem) => void;
  onDispatchCreated: (dispatch: RideDispatchRecord) => void;
}

const RIDE_CLASSES: { id: LogisticsVehicleClass; label: string; seats: string; icon: React.ReactNode }[] = [
  { id: 'bike', label: 'Moto Bike', seats: '1 Seat', icon: <Bike className="w-4 h-4" /> },
  { id: 'cng', label: 'City CNG', seats: '3 Seats', icon: <Car className="w-4 h-4" /> },
  { id: 'car', label: 'AC Sedan', seats: '4 Seats', icon: <Car className="w-4 h-4" /> },
  { id: 'ambulance', label: '24/7 Ambulance', seats: 'Emergency', icon: <HeartPulse className="w-4 h-4 text-rose-500" /> }
];

export const RideFleetView: React.FC<RideFleetViewProps> = ({
  rideItems,
  onQuickBookCard,
  onDispatchCreated
}) => {
  const { fleetVehicles, fetchQuote, dispatchRideOrParcel, fetchFleetAndDispatches } = useLogisticsStore();

  const [vehicleClass, setVehicleClass] = useState<LogisticsVehicleClass>('bike');
  const [pickupAddress, setPickupAddress] = useState('Karwan Bazar Hub, Dhaka');
  const [dropAddress, setDropAddress] = useState('Banani Commercial Area, Dhaka');
  const [distanceKm, setDistanceKm] = useState<number>(6);
  const [weatherMode, setWeatherMode] = useState<WeatherTrafficMode>('normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [quote, setQuote] = useState<LogisticsQuoteBreakdown | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    void fetchFleetAndDispatches();
  }, [fetchFleetAndDispatches]);

  useEffect(() => {
    let active = true;
    void fetchQuote({
      vehicleClass,
      distanceKm,
      weatherMode,
      dispatchType: 'now'
    }).then((q) => {
      if (active) setQuote(q);
    });
    return () => {
      active = false;
    };
  }, [vehicleClass, distanceKm, weatherMode, fetchQuote]);

  const handleBookInstantRide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress.trim() || !dropAddress.trim()) return;
    setIsBooking(true);
    try {
      const dispatch = await dispatchRideOrParcel({
        category: vehicleClass === 'ambulance' ? 'EMERGENCY' : 'RIDE',
        vehicleType: vehicleClass,
        pickupName: pickupAddress.trim(),
        dropName: dropAddress.trim(),
        distanceKm,
        weatherMode
      });
      onDispatchCreated(dispatch);
    } finally {
      setIsBooking(false);
    }
  };

  const onlineRideVehicles = fleetVehicles.filter(
    (v) => v.isOnline && ['bike', 'cng', 'car', 'ambulance'].includes(v.type)
  );

  const filteredRides = rideItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subCategory?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 2-Column Booking Sheet & Live Server Fare Quote */}
      <form
        onSubmit={(e) => void handleBookInstantRide(e)}
        className="p-5 sm:p-6 rounded-[2rem] bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] grid grid-cols-1 lg:grid-cols-12 gap-5"
      >
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-[var(--pm-text)] flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[var(--pm-accent)]" />
              <span>Instant Ride & Emergency Dispatch</span>
            </h2>
            <span className="text-xs font-mono text-[var(--pm-muted)]">
              {onlineRideVehicles.length} riders online nearby
            </span>
          </div>

          {/* Vehicle Class Switcher */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RIDE_CLASSES.map((vc) => (
              <button
                key={vc.id}
                type="button"
                onClick={() => setVehicleClass(vc.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer active-scale ${
                  vehicleClass === vc.id
                    ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)] text-[var(--pm-accent)]'
                    : 'bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-text)] hover:border-[var(--pm-accent-border)]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {vc.icon}
                  <span className="truncate">{vc.label}</span>
                </div>
                <span className="text-[11px] text-[var(--pm-muted)] block mt-0.5">{vc.seats}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1">
                Pickup Point
              </label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-medium text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1">
                Drop-off Destination
              </label>
              <input
                type="text"
                required
                value={dropAddress}
                onChange={(e) => setDropAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-medium text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1">
                Estimated Route Distance (km)
              </label>
              <input
                type="number"
                min={1}
                max={300}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-mono tabular-nums font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1">
                Traffic & Weather
              </label>
              <select
                value={weatherMode}
                onChange={(e) => setWeatherMode(e.target.value as WeatherTrafficMode)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
              >
                <option value="normal">Normal Flow (1.0x)</option>
                <option value="rush_hour">Dhaka Rush Hour (1.25x)</option>
                <option value="rainy">Monsoon / Rainy Priority (1.35x)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Live Quote Summary */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-2">
              <span className="text-xs font-bold text-[var(--pm-text)]">
                {quote?.label || 'Instant Quote'}
              </span>
              <span className="text-xs font-mono tabular-nums font-bold text-[var(--pm-accent)]">
                ETA ~{quote?.estimatedEtaMin ?? 12} min
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[var(--pm-muted)]">
                <span>Base Boarding Fare</span>
                <span className="font-mono tabular-nums font-bold text-[var(--pm-text)]">
                  ৳{(quote?.baseFareBdt ?? 50).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[var(--pm-muted)]">
                <span>Distance Charge ({quote?.distanceKm ?? distanceKm} km)</span>
                <span className="font-mono tabular-nums font-bold text-[var(--pm-text)]">
                  ৳{(quote?.distanceFeeBdt ?? 90).toLocaleString()}
                </span>
              </div>
              {(quote?.surgeFeeBdt ?? 0) > 0 && (
                <div className="flex justify-between text-[var(--pm-warning)]">
                  <span>Condition Surge ({quote!.surgeMultiplier}x)</span>
                  <span className="font-mono tabular-nums font-bold">
                    +৳{quote!.surgeFeeBdt.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[var(--pm-border)] flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-[var(--pm-muted)] block">
                  Estimated Ride Total
                </span>
                <span className="text-[11px] text-[var(--pm-muted)] flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--pm-success)]" />
                  <span>Escrow & GPS Protected Trip</span>
                </span>
              </div>
              <span className="text-2xl font-mono tabular-nums font-black text-[var(--pm-text)]">
                ৳{(quote?.totalFareBdt ?? 140).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isBooking}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap active-scale cursor-pointer transition-colors ${
              vehicleClass === 'ambulance'
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isBooking
                ? 'Matching Driver...'
                : vehicleClass === 'ambulance'
                ? 'Dispatch 24/7 Emergency Unit'
                : 'Confirm & Request Ride'}
            </span>
          </button>
        </div>
      </form>

      {/* Interactive Dhaka-Gazipur Route Map / Radar */}
      <div className="h-60 sm:h-72 w-full rounded-[2rem] overflow-hidden border border-[var(--pm-border)] shadow-sm relative bg-[var(--pm-surface)]">
        {(import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ? (
          <APIProvider apiKey={(import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              defaultCenter={{ lat: 23.777, lng: 90.399 }}
              defaultZoom={13}
              mapId="DEMO_MAP_ID"
              className="w-full h-full"
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              <AdvancedMarker position={{ lat: 23.7509, lng: 90.3935 }} title="Pickup Hub">
                <Pin background="#10b981" glyphColor="#ffffff" borderColor="#047857" />
              </AdvancedMarker>
              <AdvancedMarker position={{ lat: 23.7937, lng: 90.4066 }} title="Destination">
                <Pin background="#ef4444" glyphColor="#ffffff" borderColor="#b91c1c" />
              </AdvancedMarker>
              {onlineRideVehicles.map((veh) => (
                <AdvancedMarker
                  key={veh.id}
                  position={{ lat: veh.lat, lng: veh.lng }}
                  title={`${veh.model} (${veh.currentArea})`}
                >
                  <Pin background="#0284c7" glyphColor="#ffffff" borderColor="#0369a1" />
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-2 bg-gradient-to-br from-sky-950 to-slate-900 text-white">
            <Car className="w-8 h-8 text-sky-400" />
            <h3 className="text-sm font-bold">Dhaka-Gazipur Live Logistics Radar</h3>
            <p className="text-xs text-sky-200/80 max-w-md">
              {onlineRideVehicles.length} active vehicles · Avg response {onlineRideVehicles[0]?.etaMinutes ?? 6} mins · Coverage across Karwan Bazar, Farmgate, Gulshan & Banani
            </p>
          </div>
        )}
      </div>

      {/* Catalog Quick-Book Options */}
      {rideItems.length > 0 && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-muted)]" />
            <input
              type="text"
              placeholder="Filter instant ride & express fleet listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredRides.map((ride) => (
              <RideOptionCard key={ride.id} ride={ride} onClick={onQuickBookCard} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
