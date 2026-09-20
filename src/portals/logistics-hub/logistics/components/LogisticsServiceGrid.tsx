import React from 'react';
import { 
  Bike, Car, Truck, Package, ShoppingBag, 
  Clock, MapPin, Building, Globe, Zap, 
  Ambulance, ShoppingCart, UserCheck, ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

export type LogisticsCategory = 
  | 'bike_ride' 
  | 'car_ride' 
  | 'food' 
  | 'local_delivery' 
  | 'same_day' 
  | 'courier' 
  | 'business_transport' 
  | 'truck' 
  | 'rent_car' 
  | 'emergency';

interface ServiceItem {
  id: LogisticsCategory;
  labelEn: string;
  labelBn: string;
  icon: any;
  color: string;
}

const SERVICES: ServiceItem[] = [
  { id: 'bike_ride', labelEn: 'Bike Ride', labelBn: 'বাইক রাইড', icon: Bike, color: 'text-orange-400 bg-orange-500/10' },
  { id: 'car_ride', labelEn: 'Car Ride', labelBn: 'কার রাইড', icon: Car, color: 'text-blue-400 bg-blue-500/10' },
  { id: 'food', labelEn: 'Food Delivery', labelBn: 'ফুড ডেলিভারি', icon: ShoppingCart, color: 'text-[#e2136e] bg-[#e2136e]/10' },
  { id: 'local_delivery', labelEn: 'Local Delivery', labelBn: 'লোকাল ডেলিভারি', icon: Package, color: 'text-cyan-400 bg-cyan-500/10' },
  { id: 'same_day', labelEn: 'Same Day', labelBn: 'সেম ডে', icon: Clock, color: 'text-sky-400 bg-sky-500/10' },
  { id: 'courier', labelEn: 'Courier', labelBn: 'কুরিয়ার', icon: Globe, color: 'text-indigo-400 bg-indigo-500/10' },
  { id: 'business_transport', labelEn: 'Business Trans', labelBn: 'বিজনেস ট্রান্সপোর্ট', icon: Building, color: 'text-amber-400 bg-amber-500/10' },
  { id: 'truck', labelEn: 'Truck Booking', labelBn: 'ট্রাক বুকিং', icon: Truck, color: 'text-zinc-400 bg-zinc-500/10' },
  { id: 'rent_car', labelEn: 'Rent Car', labelBn: 'রেন্ট এ কার', icon: Car, color: 'text-purple-400 bg-purple-500/10' },
  { id: 'emergency', labelEn: 'Emergency', labelBn: 'জরুরি সেবা', icon: Ambulance, color: 'text-rose-400 bg-rose-500/10' },
];

interface LogisticsServiceGridProps {
  onSelect: (category: LogisticsCategory) => void;
  activeCategory?: LogisticsCategory;
  isBilingual?: boolean;
}

export function LogisticsServiceGrid({ onSelect, activeCategory, isBilingual = false }: LogisticsServiceGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {SERVICES.map((service, idx) => {
        const Icon = service.icon;
        const isActive = activeCategory === service.id;
        
        return (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelect(service.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
              isActive 
                ? 'bg-white/10 border-white/20 shadow-xl shadow-white/5' 
                : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${service.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-white text-center line-clamp-1">
              {isBilingual ? service.labelBn : service.labelEn}
            </span>
            {isBilingual && (
              <span className="text-[9px] text-slate-400 font-medium">
                {service.labelEn}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
