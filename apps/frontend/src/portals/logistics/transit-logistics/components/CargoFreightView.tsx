import React, { useEffect, useState } from 'react';
import { Truck, Car, Clock, PackageCheck, CheckCircle2 } from 'lucide-react';
import {
  LogisticsQuoteBreakdown,
  LogisticsVehicleClass,
  RideDispatchRecord,
  useLogisticsStore
} from '@/features/logistics';

interface CargoFreightViewProps {
  onDispatchCreated: (dispatch: RideDispatchRecord) => void;
}

const CARGO_AND_RENTAL_OPTIONS: {
  id: LogisticsVehicleClass;
  title: string;
  titleBn: string;
  spec: string;
  mode: 'FREIGHT' | 'RENTAL';
}[] = [
  {
    id: 'pickup',
    title: '1-Ton Commercial Pickup',
    titleBn: '১-টন কমার্শিয়াল পিকআপ',
    spec: 'Up to 1,500 kg · Wholesale & Shop Replenishment',
    mode: 'FREIGHT'
  },
  {
    id: 'truck',
    title: '3–5 Ton Covered Van',
    titleBn: '৩–৫ টন কাভার্ড ট্রাক',
    spec: 'Up to 5,000 kg · Factory Pallets & Inter-City',
    mode: 'FREIGHT'
  },
  {
    id: 'rental_sedan',
    title: 'Chauffeur Sedan Rental',
    titleBn: 'সেডান গাড়ি ভাড়া (ঘণ্টা/ট্রিপ)',
    spec: '4 Seats · Executive & Business Meetings',
    mode: 'RENTAL'
  },
  {
    id: 'rental_noah',
    title: 'Noah Microbus XL Rental',
    titleBn: 'নোয়া মাইক্রোবাস ভাড়া',
    spec: '8 Seats · Corporate Trips & Airport Transfers',
    mode: 'RENTAL'
  }
];

export const CargoFreightView: React.FC<CargoFreightViewProps> = ({ onDispatchCreated }) => {
  const { fetchQuote, dispatchRideOrParcel } = useLogisticsStore();

  const [vehicleClass, setVehicleClass] = useState<LogisticsVehicleClass>('pickup');
  const [pickupName, setPickupName] = useState('Gazipur BSCIC Factory Gate 2');
  const [dropName, setDropName] = useState('Chawkbazar Wholesale Depot, Dhaka');
  const [distanceKm, setDistanceKm] = useState<number>(28);
  const [weightKg, setWeightKg] = useState<number>(850);
  const [rentalHours, setRentalHours] = useState<number>(4);
  const [quote, setQuote] = useState<LogisticsQuoteBreakdown | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOption = CARGO_AND_RENTAL_OPTIONS.find((o) => o.id === vehicleClass)!;

  useEffect(() => {
    let active = true;
    void fetchQuote({
      vehicleClass,
      distanceKm,
      weightKg: selectedOption.mode === 'FREIGHT' ? weightKg : 0,
      rentalHours
    }).then((q) => {
      if (active) setQuote(q);
    });
    return () => {
      active = false;
    };
  }, [vehicleClass, distanceKm, weightKg, rentalHours, selectedOption.mode, fetchQuote]);

  const handleDispatchCargo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupName.trim() || !dropName.trim()) return;
    setIsSubmitting(true);
    try {
      const dispatch = await dispatchRideOrParcel({
        category: selectedOption.mode,
        vehicleType: vehicleClass,
        pickupName: pickupName.trim(),
        dropName: dropName.trim(),
        distanceKm,
        weightKg: selectedOption.mode === 'FREIGHT' ? weightKg : undefined,
        rentalHours
      });
      onDispatchCreated(dispatch);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-[2rem] bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] space-y-5">
      <div>
        <h2 className="text-base font-bold text-[var(--pm-text)] flex items-center gap-2">
          <Truck className="w-5 h-5 text-[var(--pm-accent)]" />
          <span>B2B Cargo Trucks & Hourly Vehicle Rentals</span>
        </h2>
        <p className="text-xs text-[var(--pm-muted)] mt-0.5">
          Factory-to-wholesale freight haulage, covered pallets & chauffeur-driven corporate vehicle rentals
        </p>
      </div>

      {/* Fleet Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CARGO_AND_RENTAL_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setVehicleClass(opt.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer active-scale ${
              vehicleClass === opt.id
                ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)] text-[var(--pm-accent)]'
                : 'bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-text)] hover:border-[var(--pm-accent-border)]'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs">
              {opt.mode === 'FREIGHT' ? <Truck className="w-4 h-4 shrink-0" /> : <Car className="w-4 h-4 shrink-0" />}
              <span className="truncate">{opt.title}</span>
            </div>
            <p className="text-[11px] text-[var(--pm-muted)] mt-1 line-clamp-2">{opt.spec}</p>
          </button>
        ))}
      </div>

      <form onSubmit={(e) => void handleDispatchCargo(e)} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1.5">
                Loading Bay / Factory Pickup
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
                Unloading Depot / Destination
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1.5">
                Corridor Distance (km)
              </label>
              <input
                type="number"
                min={1}
                max={900}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-mono tabular-nums font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
              />
            </div>

            {selectedOption.mode === 'FREIGHT' ? (
              <div>
                <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1.5">
                  Cargo Tonnage (kg)
                </label>
                <input
                  type="number"
                  min={50}
                  max={5000}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-mono tabular-nums font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1.5">
                  Charter Duration (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={rentalHours}
                  onChange={(e) => setRentalHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs font-mono tabular-nums font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[var(--pm-muted)] mb-1.5">
                Loading Assistance
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-[var(--pm-surface)] text-xs font-bold text-[var(--pm-text)] border border-[var(--pm-border)] flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-[var(--pm-success)] shrink-0" />
                <span>Verified Manifest</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Charter & Cargo Tariff */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-2">
              <span className="text-xs font-bold text-[var(--pm-text)]">
                {selectedOption.title}
              </span>
              <span className="text-xs font-mono text-[var(--pm-accent)] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>ETA ~{quote?.estimatedEtaMin ?? 45}m</span>
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[var(--pm-muted)]">
                <span>Base Charter Fee</span>
                <span className="font-mono tabular-nums font-bold text-[var(--pm-text)]">
                  ৳{(quote?.baseFareBdt ?? 1200).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[var(--pm-muted)]">
                <span>Route Distance ({quote?.distanceKm ?? distanceKm} km)</span>
                <span className="font-mono tabular-nums font-bold text-[var(--pm-text)]">
                  ৳{(quote?.distanceFeeBdt ?? 0).toLocaleString()}
                </span>
              </div>
              {(quote?.weightSurchargeBdt ?? 0) > 0 && (
                <div className="flex justify-between text-[var(--pm-muted)]">
                  <span>Heavy Tonnage Surcharge</span>
                  <span className="font-mono tabular-nums font-bold text-[var(--pm-text)]">
                    ৳{quote!.weightSurchargeBdt.toLocaleString()}
                  </span>
                </div>
              )}
              {(quote?.rentalDurationFeeBdt ?? 0) > 0 && (
                <div className="flex justify-between text-[var(--pm-muted)]">
                  <span>Additional Hours ({rentalHours - 1}h)</span>
                  <span className="font-mono tabular-nums font-bold text-[var(--pm-text)]">
                    ৳{quote!.rentalDurationFeeBdt.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[var(--pm-border)] flex items-baseline justify-between">
              <span className="text-xs font-bold text-[var(--pm-muted)]">Total B2B Tariff</span>
              <span className="text-2xl font-mono tabular-nums font-black text-[var(--pm-text)]">
                ৳{(quote?.totalFareBdt ?? 2936).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap active-scale cursor-pointer transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Allocating Truck...' : 'Book Cargo / Vehicle Rental'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
