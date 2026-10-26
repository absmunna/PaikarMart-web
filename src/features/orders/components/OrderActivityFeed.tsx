import React from 'react';
import { Circle, Info, CheckCircle2, Package, Truck, CreditCard, Box, MapPin, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { OrderActivity, OrderState } from '@/modules/orders/orderTrackingStore';
import { cn } from '@/lib/utils';

interface OrderActivityFeedProps {
  activities: OrderActivity[];
}

const ACTIVITY_ICONS: Record<OrderState | string, any> = {
  ORDER_CREATED: Package,
  PAYMENT_CONFIRMED: ShieldCheck,
  PACKING: Box,
  READY_FOR_PICKUP: CheckCircle2,
  PICKED_UP: Truck,
  IN_TRANSIT: MapPin,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: CheckCircle2,
  COMPLETED: CheckCircle2,
  DELAY: AlertCircle,
};

function ShieldCheck(props: any) {
    return <CheckCircle2 {...props} />;
}

export const OrderActivityFeed: React.FC<OrderActivityFeedProps> = ({ activities }) => {
  // Sort by latest first
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="flex flex-col gap-6 w-full select-none">
      <h3 className="text-xs uppercase tracking-wider text-[var(--pm-text-secondary)] font-bold flex items-center gap-2">
        <Info className="w-4 h-4 text-cyan-400" /> Operational Log
      </h3>

      <div className="relative flex flex-col gap-8">
        {/* Connection line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[var(--pm-border)] z-0" />

        {sortedActivities.map((activity, idx) => {
          const Icon = ACTIVITY_ICONS[activity.status] || Info;
          const isLatest = idx === 0;

          return (
            <div key={activity.timestamp + idx} className="flex gap-6 items-start relative z-10">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300",
                  isLatest 
                    ? "bg-[#0b101d] border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]" 
                    : "bg-[#0b101d] border-[var(--pm-border)] text-zinc-500"
                )}
              >
                <Icon className={cn("w-5 h-5", isLatest && "animate-pulse")} />
              </div>

              <div className="flex-1 flex flex-col gap-1.5 pt-0.5">
                <div className="flex items-center justify-between gap-4">
                  <h4 className={cn("text-xs font-black uppercase tracking-tight", isLatest ? "text-white" : "text-[var(--pm-text-secondary)]")}>
                    {activity.status.replace(/_/g, ' ')}
                  </h4>
                  <span className="text-[10px] text-zinc-600 font-mono whitespace-nowrap">
                    {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                  </span>
                </div>
                
                <div className="bg-black/10 border border-white/5 rounded-xl p-3.5 hover:bg-black/20 transition-all">
                  <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                    "{activity.description}"
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span 
                      className={cn(
                        "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md border",
                        activity.source === 'system' ? "border-cyan-400/20 text-cyan-400 bg-cyan-400/5" :
                        activity.source === 'seller' ? "border-amber-400/20 text-amber-400 bg-amber-400/5" :
                        "border-blue-400/20 text-blue-400 bg-blue-400/5"
                      )}
                    >
                      {activity.source} origin
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
