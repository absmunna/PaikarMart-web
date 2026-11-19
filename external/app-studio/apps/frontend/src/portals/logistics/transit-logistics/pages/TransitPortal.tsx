import React, { useState } from 'react';
import { Bike, CheckCircle2, Package, ShieldCheck, Truck } from 'lucide-react';
import { CommerceItem, User } from '@/types';
import { DriverMatchingOverlay } from '@/portals/logistics/transit-logistics/components/DriverMatchingOverlay';
import { RideFleetView } from '@/portals/logistics/transit-logistics/components/RideFleetView';
import { CargoFreightView } from '@/portals/logistics/transit-logistics/components/CargoFreightView';
import { FleetPartnerConsole } from '@/portals/logistics/transit-logistics/components/FleetPartnerConsole';
import { CourierBookingPanel, RideDispatchRecord, useLogisticsStore } from '@/features/logistics';

interface TransitPortalProps {
  rideItems: CommerceItem[];
  currentUser?: User;
  initialSubPortal?: LogisticsSubPortal;
}

type LogisticsSubPortal = 'ride' | 'courier' | 'cargo' | 'fleet';

const SUB_PORTAL_TABS: {
  id: LogisticsSubPortal;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: 'ride', label: 'Instant Ride', icon: <Bike className="w-3.5 h-3.5" /> },
  { id: 'courier', label: 'Parcel & Waybill', icon: <Package className="w-3.5 h-3.5" /> },
  { id: 'cargo', label: 'Cargo & Rentals', icon: <Truck className="w-3.5 h-3.5" /> },
  { id: 'fleet', label: 'Fleet Console', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
];

export const TransitPortal: React.FC<TransitPortalProps> = ({ rideItems, currentUser, initialSubPortal = 'ride' }) => {
  const { dispatchRideOrParcel } = useLogisticsStore();
  const [activeSubPortal, setActiveSubPortal] = useState<LogisticsSubPortal>('ride');
  const [selectedRide, setSelectedRide] = useState<CommerceItem | null>(null);
  const [matchedDispatch, setMatchedDispatch] = useState<RideDispatchRecord | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  React.useEffect(() => {
    setActiveSubPortal(initialSubPortal);
  }, [initialSubPortal]);

  const handleQuickBookCard = async (ride: CommerceItem) => {
    setSelectedRide(ride);
    setMatchedDispatch(null);
    setIsSearching(true);
    try {
      const dispatch = await dispatchRideOrParcel({
        category:
          ride.subCategory === 'pickup' || ride.subCategory === 'truck'
            ? 'FREIGHT'
            : ride.subCategory === 'ambulance'
            ? 'EMERGENCY'
            : 'RIDE',
        vehicleType: ride.subCategory || 'bike',
        pickupName: 'Karwan Bazar Hub, Dhaka',
        dropName: 'Banani Commercial Area, Dhaka',
        distanceKm: 6
      });
      setTimeout(() => {
        setIsSearching(false);
        setMatchedDispatch(dispatch);
      }, 1000);
    } catch {
      setIsSearching(false);
    }
  };

  const handleDispatchCreated = (dispatch: RideDispatchRecord) => {
    setSelectedRide(null);
    setMatchedDispatch(dispatch);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-20">
      {/* Unified Transit & Logistics Hub Banner + 4-Sub-Portal Switcher */}
      <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 text-[var(--pm-text)] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-xl space-y-1.5 sm:space-y-2">
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">
              Transit & Logistics Hub
            </h1>
            <p className="text-[var(--pm-muted)] text-xs sm:text-sm line-clamp-2">
              Instant Bike & Emergency Fleet, Multi-Stop Waybills, B2B Cargo Trucks & Partner Dispatch Console.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] max-w-full overflow-x-auto no-scrollbar shrink-0">
            {SUB_PORTAL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubPortal(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all active-scale cursor-pointer ${
                  activeSubPortal === tab.id
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                    : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Sub-Portal Surface */}
      {activeSubPortal === 'ride' && (
        <RideFleetView
          rideItems={rideItems}
          onQuickBookCard={(r) => void handleQuickBookCard(r)}
          onDispatchCreated={handleDispatchCreated}
        />
      )}

      {activeSubPortal === 'courier' && <CourierBookingPanel />}

      {activeSubPortal === 'cargo' && (
        <CargoFreightView onDispatchCreated={handleDispatchCreated} />
      )}

      {activeSubPortal === 'fleet' && <FleetPartnerConsole currentUser={currentUser} />}

      {/* Driver Matching Overlay */}
      <DriverMatchingOverlay
        isSearching={isSearching}
        selectedRide={selectedRide}
        onCancel={() => setIsSearching(false)}
      />

      {/* Matched Dispatch Confirmation Toast */}
      {!isSearching && matchedDispatch && (
        <div className="fixed bottom-20 left-4 right-4 max-w-xl mx-auto z-40 animate-slide-up">
          <div className="bg-emerald-600 text-white p-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono font-bold text-emerald-100 truncate">
                  {matchedDispatch.trackingCode} · {matchedDispatch.driverName} · {matchedDispatch.vehicleType.toUpperCase()}
                </p>
                <p className="text-sm font-bold truncate">
                  Dispatched (৳{matchedDispatch.fareBdt.toLocaleString()}) · {matchedDispatch.distanceKm} km route
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMatchedDispatch(null)}
              className="px-3 py-1.5 bg-black/20 hover:bg-black/30 rounded-[2rem] text-xs font-bold shrink-0 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
