import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Truck, MapPin, Phone, MessageSquare, 
  ChevronRight, CheckCircle2, Clock, ShieldCheck,
  Navigation, User, Bike
} from 'lucide-react';
import { useLogisticsStore } from '@/modules/logistics/store/useLogisticsStore';
import { cn } from '@/lib/utils';

interface LiveTrackingSheetProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LiveTrackingSheet: React.FC<LiveTrackingSheetProps> = ({ orderId, isOpen, onClose }) => {
  const { shipments, fetchShipment, isLoading } = useLogisticsStore();
  const shipment = shipments[orderId];

  useEffect(() => {
    if (isOpen && orderId) {
      fetchShipment(orderId);
    }
  }, [isOpen, orderId, fetchShipment]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-end justify-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-[480px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-[3rem] p-6 shadow-2xl relative pointer-events-auto overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent)]/10 flex items-center justify-center border border-[var(--pm-accent)]/20">
                <Navigation className="w-5 h-5 text-[var(--pm-accent)]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Live Tracking</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Order #{orderId}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all">
              <X className="w-5 h-5 text-zinc-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
            {/* Map Placeholder */}
            <div className="relative w-full h-48 bg-zinc-900 rounded-[2rem] border border-white/5 overflow-hidden group">
              <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/90.4125,23.8103,13/480x480?access_token=mock')] bg-center bg-cover" />
              
              {/* Pulsing Rider Dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-[var(--pm-accent)]/50 scale-150" />
                  <div className="w-4 h-4 bg-[var(--pm-accent)] rounded-full border-2 border-white shadow-lg relative z-10" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-black text-white uppercase">Rider is on the way</span>
                </div>
                <span className="text-[10px] font-black text-cyan-400 uppercase">ETA: 12 MINS</span>
              </div>
            </div>

            {/* Rider Info */}
            {shipment?.rider && (
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Anisur+Rahman&background=333&color=fff" alt="Rider" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-white">{shipment.rider.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Bike className="w-3 h-3" /> Bike · PaikarForce Hero
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${shipment.rider.phone}`} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 text-white transition-all">
                    <Phone className="w-4 h-4" />
                  </a>
                  <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 text-white transition-all">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-6 px-2">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Journey History</h4>
              <div className="relative space-y-8">
                <div className="absolute left-[13px] top-2 bottom-2 w-[1px] bg-white/10" />
                
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-6 animate-pulse">
                      <div className="w-7 h-7 rounded-full bg-white/5 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 bg-white/5 rounded" />
                        <div className="h-2 w-full bg-white/5 rounded" />
                      </div>
                    </div>
                  ))
                ) : (
                  shipment?.checkpoints.map((cp, i) => (
                    <div key={cp.id} className="flex gap-6 relative group">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0",
                        i === 0 ? "bg-[var(--pm-accent)] shadow-lg shadow-[var(--pm-accent)]/20" : "bg-zinc-900 border border-white/10"
                      )}>
                        {i === 0 ? <Truck className="w-3.5 h-3.5 text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className={cn(
                            "text-[11px] font-black uppercase tracking-tight",
                            i === 0 ? "text-white" : "text-zinc-500"
                          )}>{cp.message}</p>
                          <span className="text-[9px] font-bold text-zinc-600 uppercase whitespace-nowrap ml-2">
                            {new Date(cp.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          {cp.location}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer Label */}
          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3 h-3 text-cyan-500" />
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Paikar Verified Logistics System</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
