import React, { useState, useEffect } from 'react';
import { Truck, Package, Search, CheckCircle2, MapPin, Plus, X, Calendar } from 'lucide-react';
import {
  CourierPartner,
  DispatchScheduleType,
  LogisticsQuoteBreakdown,
  ShipmentRecord,
  WeatherTrafficMode
} from '@/features/logistics/types/logisticsTypes';
import { useLogisticsStore } from '@/features/logistics/store/useLogisticsStore';
import { logisticsOrderApiClient } from '@/features/logistics/services/logisticsOrderApiClient';

export const CourierBookingPanel: React.FC = () => {
  const { dispatches, fetchFleetAndDispatches, dispatchRideOrParcel, fetchQuote } = useLogisticsStore();

  const [category, setCategory] = useState<'PARCEL' | 'FREIGHT'>('PARCEL');
  const [courierPartner, setCourierPartner] = useState<CourierPartner>('PaikarForce');
  const [pickupName, setPickupName] = useState('Gulshan / Tejgaon Hub, Dhaka');
  const [dropName, setDropName] = useState('Agrabad Commercial Area, Chattogram');
  const [stops, setStops] = useState<string[]>([]);
  const [distanceKm, setDistanceKm] = useState<number>(12);
  const [weightKg, setWeightKg] = useState<number>(5);
  const [dispatchType, setDispatchType] = useState<DispatchScheduleType>('now');
  const [scheduledAt, setScheduledAt] = useState('Tomorrow · 10:00 AM');
  const [weatherMode, setWeatherMode] = useState<WeatherTrafficMode>('normal');
  const [quote, setQuote] = useState<LogisticsQuoteBreakdown | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingBanner, setBookingBanner] = useState<string | null>(null);

  const [waybillQuery, setWaybillQuery] = useState('');
  const [lookedUpShipment, setLookedUpShipment] = useState<ShipmentRecord | null>(null);

  useEffect(() => {
    void fetchFleetAndDispatches();
  }, [fetchFleetAndDispatches]);

  useEffect(() => {
    let active = true;
    void fetchQuote({
      vehicleClass: category === 'FREIGHT' ? 'pickup' : 'parcel',
      distanceKm,
      weightKg,
      stopCount: 1 + stops.filter((s) => s.trim().length > 0).length,
      dispatchType,
      weatherMode
    }).then((q) => {
      if (active) setQuote(q);
    });
    return () => {
      active = false;
    };
  }, [category, distanceKm, weightKg, stops, dispatchType, weatherMode, fetchQuote]);

  const handleAddStop = () => {
    if (stops.length < 3) {
      setStops((prev) => [...prev, '']);
    }
  };

  const handleBookCourier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupName.trim() || !dropName.trim()) return;
    setIsSubmitting(true);
    try {
      const cleanStops = stops.map((s) => s.trim()).filter(Boolean);
      const created = await dispatchRideOrParcel({
        category,
        vehicleType: category === 'FREIGHT' ? 'pickup' : 'parcel',
        courierPartner,
        pickupName: pickupName.trim(),
        dropName: dropName.trim(),
        stops: cleanStops.length > 0 ? cleanStops : undefined,
        distanceKm,
        weightKg,
        dispatchType,
        scheduledAt: dispatchType === 'now' ? undefined : scheduledAt,
        weatherMode
      });
      setBookingBanner(
        `Waybill ${created.trackingCode} booked via ${created.courierPartner} · Tariff ৳${created.fareBdt.toLocaleString()}`
      );
      setTimeout(() => setBookingBanner(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookupWaybill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waybillQuery.trim()) return;
    const found = await logisticsOrderApiClient.lookupWaybill(waybillQuery.trim());
    setLookedUpShipment(found);
  };

  return (
    <div className="space-y-5">
      <div className="p-5 sm:p-6 rounded-[2rem] bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[var(--pm-text)] flex items-center gap-2">
              <Package className="w-5 h-5 text-[var(--pm-accent)]" />
              <span>Multi-Stop Parcel & Courier Waybill</span>
            </h2>
            <p className="text-xs text-[var(--pm-muted)] mt-0.5">
              Express parcel delivery with up to 3 extra drops, scheduled pickup discounts & partner selection
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-[2rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] w-fit">
            {(['PARCEL', 'FREIGHT'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCategory(mode)}
                className={`px-3.5 py-1.5 rounded-[2rem] text-xs font-bold whitespace-nowrap transition-all active-scale cursor-pointer ${
                  category === mode
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                    : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                {mode === 'PARCEL' ? 'Express Parcel' : 'Heavy Pickup'}
              </button>
            ))}
          </div>
        </div>

        {bookingBanner && (
          <div className="p-3.5 rounded-[1.5rem] bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-xs font-bold text-[var(--pm-success)] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{bookingBanner}</span>
          </div>
        )}

        <form onSubmit={(e) => void handleBookCourier(e)} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Route, Multi-Stops & Parameters */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1.5">
                  Pickup Warehouse / Address
                </label>
                <input
                  type="text"
                  required
                  value={pickupName}
                  onChange={(e) => setPickupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-medium text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1.5">
                  Primary Destination
                </label>
                <input
                  type="text"
                  required
                  value={dropName}
                  onChange={(e) => setDropName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-medium text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                />
              </div>
            </div>

            {/* Intermediate Multi-Stops */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--pm-muted)]">
                  Intermediate Drop Stops ({stops.length}/3)
                </span>
                {stops.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddStop}
                    className="text-xs font-bold text-[var(--pm-accent)] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stop (+৳55/stop)</span>
                  </button>
                )}
              </div>

              {stops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={stop}
                    onChange={(e) =>
                      setStops((prev) => prev.map((item, i) => (i === idx ? e.target.value : item)))
                    }
                    placeholder={`Stop #${idx + 1} address (e.g. Mirpur 10 Hub)`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--pm-input)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                  />
                  <button
                    type="button"
                    onClick={() => setStops((prev) => prev.filter((_, i) => i !== idx))}
                    className="p-2 rounded-xl text-[var(--pm-muted)] hover:text-[var(--pm-danger)] hover:bg-[var(--pm-danger-soft)] cursor-pointer transition-colors"
                    aria-label="Remove stop"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1.5">
                  Courier Partner
                </label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value as CourierPartner)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                >
                  <option value="PaikarForce">PaikarForce Express</option>
                  <option value="Steadfast">Steadfast Courier</option>
                  <option value="Pathao">Pathao Parcel</option>
                  <option value="RedX">RedX Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1.5">
                  Distance (km)
                </label>
                <input
                  type="number"
                  min={1}
                  max={800}
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-mono tabular-nums font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min={1}
                  max={5000}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-mono tabular-nums font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1.5">
                  Dispatch Schedule
                </label>
                <select
                  value={dispatchType}
                  onChange={(e) => setDispatchType(e.target.value as DispatchScheduleType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                >
                  <option value="now">Dispatch Immediately</option>
                  <option value="scheduled">Scheduled Pickup (-5% Off)</option>
                  <option value="recurring">Recurring B2B Plan (-8% Off)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1.5">
                  Traffic / Weather Window
                </label>
                <select
                  value={weatherMode}
                  onChange={(e) => setWeatherMode(e.target.value as WeatherTrafficMode)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                >
                  <option value="normal">Standard Window (1.0x)</option>
                  <option value="rush_hour">Peak Rush Hour (1.25x)</option>
                  <option value="rainy">Rainy Weather Dispatch (1.35x)</option>
                </select>
              </div>
            </div>

            {dispatchType !== 'now' && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                <input
                  type="text"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  placeholder="Schedule date/window..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--pm-input)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                />
              </div>
            )}
          </div>

          {/* Right Column: Server Quote Breakdown Sheet */}
          <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-2.5">
                <span className="text-xs font-bold text-[var(--pm-text)]">
                  Live Tariff Quote Summary
                </span>
                <span className="text-xs font-mono tabular-nums text-[var(--pm-accent)] font-bold">
                  ETA ~{quote?.estimatedEtaMin ?? 35} min
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[var(--pm-muted)]">
                  <span>Base Dispatch Tariff</span>
                  <span className="font-mono tabular-nums font-bold text-[var(--pm-text)]">
                    ৳{(quote?.baseFareBdt ?? 70).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--pm-muted)]">
                  <span>Distance ({quote?.distanceKm ?? distanceKm} km)</span>
                  <span className="font-mono tabular-nums font-bold text-[var(--pm-text)]">
                    ৳{(quote?.distanceFeeBdt ?? 0).toLocaleString()}
                  </span>
                </div>
                {(quote?.weightSurchargeBdt ?? 0) > 0 && (
                  <div className="flex justify-between text-[var(--pm-muted)]">
                    <span>Extra Weight Surcharge</span>
                    <span className="font-mono tabular-nums font-bold text-[var(--pm-text)]">
                      ৳{quote!.weightSurchargeBdt.toLocaleString()}
                    </span>
                  </div>
                )}
                {(quote?.multiStopFeeBdt ?? 0) > 0 && (
                  <div className="flex justify-between text-[var(--pm-muted)]">
                    <span>Multi-Stop Handling</span>
                    <span className="font-mono tabular-nums font-bold text-[var(--pm-text)]">
                      ৳{quote!.multiStopFeeBdt.toLocaleString()}
                    </span>
                  </div>
                )}
                {(quote?.surgeFeeBdt ?? 0) > 0 && (
                  <div className="flex justify-between text-[var(--pm-warning)]">
                    <span>Peak / Rain Modifier ({quote!.surgeMultiplier}x)</span>
                    <span className="font-mono tabular-nums font-bold">
                      +৳{quote!.surgeFeeBdt.toLocaleString()}
                    </span>
                  </div>
                )}
                {(quote?.scheduledDiscountBdt ?? 0) > 0 && (
                  <div className="flex justify-between text-[var(--pm-success)]">
                    <span>Schedule Discount</span>
                    <span className="font-mono tabular-nums font-bold">
                      -৳{quote!.scheduledDiscountBdt.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[var(--pm-border)] flex items-baseline justify-between">
                <span className="text-xs font-bold text-[var(--pm-muted)]">Total Tariff</span>
                <span className="text-2xl font-mono tabular-nums font-black text-[var(--pm-text)]">
                  ৳{(quote?.totalFareBdt ?? 240).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap active-scale cursor-pointer transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>{isSubmitting ? 'Dispatching...' : 'Book Pickup & Generate Waybill'}</span>
            </button>
          </div>
        </form>

        {/* Active Dispatches List */}
        {dispatches.length > 0 && (
          <div className="pt-3 border-t border-[var(--pm-border)] space-y-2.5">
            <h3 className="text-xs font-bold text-[var(--pm-muted)]">Recent Dispatches</h3>
            {dispatches.slice(0, 4).map((dsp) => (
              <div
                key={dsp.id}
                className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--pm-muted)] font-mono">
                    <span className="font-bold text-[var(--pm-text)]">
                      {dsp.trackingCode}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{dsp.courierPartner}</span>
                    <span aria-hidden="true">·</span>
                    <span>{dsp.dispatchType === 'recurring' ? 'Recurring' : dsp.dispatchType === 'scheduled' ? 'Scheduled' : 'Express'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[var(--pm-success)] font-bold">
                      {dsp.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[var(--pm-text)] truncate mt-0.5">
                    {dsp.pickupName} → {dsp.stops && dsp.stops.length > 0 ? `${dsp.stops.join(' → ')} → ` : ''}{dsp.dropName}
                  </p>
                </div>

                <span className="text-sm font-mono tabular-nums font-black text-[var(--pm-text)] shrink-0">
                  ৳{dsp.fareBdt.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Waybill / Order Tracker Lookup */}
      <div className="p-5 rounded-[2rem] bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-3">
        <h3 className="text-sm font-bold text-[var(--pm-text)]">
          Waybill & Shipment Tracking Lookup
        </h3>
        <form onSubmit={(e) => void handleLookupWaybill(e)} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--pm-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={waybillQuery}
              onChange={(e) => setWaybillQuery(e.target.value)}
              placeholder="Enter Order ID or Waybill (e.g. ORD-9021 or PKF-2026-...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-mono text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold whitespace-nowrap active-scale cursor-pointer transition-colors"
          >
            Track
          </button>
        </form>

        {lookedUpShipment && (
          <div className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-mono font-bold text-[var(--pm-text)]">
                {lookedUpShipment.trackingNumber} · {lookedUpShipment.courierPartner} · {lookedUpShipment.status}
              </p>
              <p className="text-[11px] text-[var(--pm-muted)] flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[var(--pm-danger)] shrink-0" />
                <span>{lookedUpShipment.checkpoints[0]?.message || lookedUpShipment.dropLocation}</span>
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[var(--pm-success)] shrink-0">
              {lookedUpShipment.etaText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
