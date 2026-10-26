import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, Truck, Package, MapPin, Map as MapIcon, Navigation } from 'lucide-react';
import { ShipmentStatus } from '@/modules/logistics/types';

interface UnifiedDeliveryTrackingProps {
  status: ShipmentStatus;
  orderId: string;
  isBilingual?: boolean;
}

const STATUS_CONFIG: Record<ShipmentStatus, { icon: any, labelEn: string, labelBn: string, color: string }> = {
  'PENDING': { icon: Clock, labelEn: 'Order Placed', labelBn: 'অর্ডার প্লেস করা হয়েছে', color: 'text-amber-400' },
  'COURIER_PICKED_UP': { icon: Package, labelEn: 'Picked Up', labelBn: 'কুরিয়ার রিসিভ করেছে', color: 'text-blue-400' },
  'AT_SORTING_CENTER': { icon: MapIcon, labelEn: 'Sorting Center', labelBn: 'সর্টিং সেন্টারে আছে', color: 'text-indigo-400' },
  'OUT_FOR_DELIVERY': { icon: Truck, labelEn: 'Out for Delivery', labelBn: 'ডেলিভারির জন্য বের হয়েছে', color: 'text-sky-400' },
  'DELIVERED': { icon: CheckCircle2, labelEn: 'Delivered', labelBn: 'ডেলিভারি সম্পন্ন', color: 'text-cyan-400' },
  'CASH_COLLECTED': { icon: CheckCircle2, labelEn: 'Cash Collected', labelBn: 'টাকা সংগ্রহ করা হয়েছে', color: 'text-cyan-500' },
  'CASH_DEPOSITED': { icon: CheckCircle2, labelEn: 'Cash Deposited', labelBn: 'টাকা জমা দেওয়া হয়েছে', color: 'text-cyan-600' },
  'RETURNED': { icon: CheckCircle2, labelEn: 'Returned', labelBn: 'রিটার্ন করা হয়েছে', color: 'text-rose-400' },
  'FAILED': { icon: CheckCircle2, labelEn: 'Failed', labelBn: 'ব্যর্থ হয়েছে', color: 'text-red-400' },
  'RIDER_ASSIGNED': { icon: Clock, labelEn: 'Rider Assigned', labelBn: 'রাইডার অ্যাসাইন করা হয়েছে', color: 'text-blue-400' },
  'RIDER_ARRIVED': { icon: MapPin, labelEn: 'Rider Arrived', labelBn: 'রাইডার পৌঁছেছে', color: 'text-indigo-400' },
  'TRIP_STARTED': { icon: Navigation, labelEn: 'Trip Started', labelBn: 'ট্রিপ শুরু হয়েছে', color: 'text-sky-400' },
  'TRIP_COMPLETED': { icon: CheckCircle2, labelEn: 'Trip Completed', labelBn: 'ট্রিপ সম্পন্ন হয়েছে', color: 'text-cyan-400' },
  'LOADING': { icon: Package, labelEn: 'Loading', labelBn: 'লোড হচ্ছে', color: 'text-amber-400' },
  'UNLOADING': { icon: Package, labelEn: 'Unloading', labelBn: 'আনলোড হচ্ছে', color: 'text-orange-400' },
};

const STEPS: ShipmentStatus[] = ['PENDING', 'COURIER_PICKED_UP', 'AT_SORTING_CENTER', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export function UnifiedDeliveryTracking({ status, orderId, isBilingual = false }: UnifiedDeliveryTrackingProps) {
  const currentStepIdx = STEPS.indexOf(status);
  const t = (en: string, bn: string) => isBilingual ? bn : en;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">#{orderId} {t('Tracking', 'ট্র্যাকিং')}</h3>
          <p className="text-[10px] text-slate-400">{t('Real-time Logistics Data', 'রিয়েল-টাইম লজিস্টিক ডেটা')}</p>
        </div>
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 ${STATUS_CONFIG[status]?.color || 'text-white'}`}>
          {isBilingual ? STATUS_CONFIG[status]?.labelBn : STATUS_CONFIG[status]?.labelEn}
        </span>
      </div>

      <div className="relative">
        {/* Step Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
        <div 
          className="absolute left-4 top-0 w-0.5 bg-cyan-500 transition-all duration-1000" 
          style={{ height: `${(currentStepIdx / (STEPS.length - 1)) * 100}%` }}
        />

        <div className="space-y-8 relative">
          {STEPS.map((step, idx) => {
            const config = STATUS_CONFIG[step];
            const Icon = config.icon;
            const isCompleted = idx <= currentStepIdx;
            const isActive = idx === currentStepIdx;

            return (
              <div key={step} className="flex items-start gap-4">
                <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-zinc-900 border-white/10 text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 pt-1">
                  <h4 className={`text-xs font-bold transition-all ${isCompleted ? 'text-white' : 'text-slate-500'}`}>
                    {isBilingual ? config.labelBn : config.labelEn}
                  </h4>
                  {isActive && (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-cyan-400 mt-1"
                    >
                      {t('Currently at this stage', 'বর্তমানে এই ধাপে আছে')}
                    </motion.p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-3">
        <MapPin className="w-5 h-5 text-cyan-500" />
        <div>
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{t('Last Known Location', 'শেষ অবস্থান')}</p>
          <p className="text-xs text-white">Dhanmondi Hub, Dhaka (1209)</p>
        </div>
      </div>
    </div>
  );
}
