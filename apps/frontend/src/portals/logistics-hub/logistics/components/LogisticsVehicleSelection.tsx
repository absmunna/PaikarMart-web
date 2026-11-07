import React from 'react';
import { Bike, Car, Truck, Users, Clock, Info, Building, Ambulance } from 'lucide-react';
import { motion } from 'motion/react';

interface VehicleOption {
  id: string;
  nameEn: string;
  nameBn: string;
  seats: number;
  price: number;
  eta: string;
  icon: any;
  image?: string;
}

interface LogisticsVehicleSelectionProps {
  category: string;
  onSelect: (vehicle: VehicleOption) => void;
  selectedId?: string;
  isBilingual?: boolean;
}

const VEHICLES: Record<string, VehicleOption[]> = {
  bike_ride: [
    { id: 'bike_eco', nameEn: 'Bike Eco', nameBn: 'বাইক ইকো', seats: 1, price: 80, eta: '3 min', icon: Bike },
    { id: 'bike_premium', nameEn: 'Bike Plus', nameBn: 'বাইক প্লাস', seats: 1, price: 120, eta: '2 min', icon: Bike },
  ],
  car_ride: [
    { id: 'car_eco', nameEn: 'Economy', nameBn: 'ইকোনমি', seats: 4, price: 250, eta: '5 min', icon: Car },
    { id: 'car_premium', nameEn: 'Premium', nameBn: 'প্রিমিয়াম', seats: 4, price: 450, eta: '4 min', icon: Car },
    { id: 'micro', nameEn: 'Micro', nameBn: 'মাইক্রো', seats: 8, price: 800, eta: '8 min', icon: Users },
    { id: 'suv', nameEn: 'SUV / XL', nameBn: 'এসইউভি / এক্সএল', seats: 6, price: 650, eta: '6 min', icon: Car },
  ],
  truck: [
    { id: 'pickup', nameEn: 'Pickup Van', nameBn: 'পিকআপ ভ্যান', seats: 2, price: 1200, eta: '10 min', icon: Truck },
    { id: 'truck_1', nameEn: '1 Ton Truck', nameBn: '১ টন ট্রাক', seats: 2, price: 2500, eta: '15 min', icon: Truck },
    { id: 'truck_3', nameEn: '3 Ton Truck', nameBn: '৩ টন ট্রাক', seats: 2, price: 4500, eta: '20 min', icon: Truck },
    { id: 'truck_10', nameEn: '10 Ton+ Truck', nameBn: '১০ টন+ ট্রাক', seats: 2, price: 12000, eta: '45 min', icon: Truck },
  ],
  business_transport: [
    { id: 'covered_van', nameEn: 'Covered Van', nameBn: 'কাভার্ড ভ্যান', seats: 2, price: 3500, eta: '30 min', icon: Truck },
    { id: 'freight_container', nameEn: 'Freight Container', nameBn: 'ফ্রেট কন্টেইনার', seats: 2, price: 25000, eta: '2 hours', icon: Building },
  ],
  rent_car: [
    { id: 'rent_daily', nameEn: 'Daily Rental', nameBn: 'দৈনিক রেন্ট', seats: 4, price: 3500, eta: 'Scheduled', icon: Car },
    { id: 'rent_weekly', nameEn: 'Weekly Package', nameBn: 'সাপ্তাহিক প্যাকেজ', seats: 4, price: 22000, eta: 'Scheduled', icon: Car },
    { id: 'rent_monthly', nameEn: 'Monthly Package', nameBn: 'মাসিক প্যাকেজ', seats: 4, price: 85000, eta: 'Scheduled', icon: Car },
  ],
  emergency: [
    { id: 'ambulance_eco', nameEn: 'Economy Ambulance', nameBn: 'ইকোনমি অ্যাম্বুলেন্স', seats: 3, price: 1500, eta: '5 min', icon: Ambulance },
    { id: 'ambulance_icu', nameEn: 'ICU Ambulance', nameBn: 'আইসিইউ অ্যাম্বুলেন্স', seats: 4, price: 5000, eta: '8 min', icon: Ambulance },
  ]
};

export function LogisticsVehicleSelection({ category, onSelect, selectedId, isBilingual = false }: LogisticsVehicleSelectionProps) {
  const options = VEHICLES[category] || [];
  const t = (en: string, bn: string) => isBilingual ? bn : en;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">{t('Select Vehicle', 'যানবাহন নির্বাচন')}</h3>
      <div className="grid grid-cols-1 gap-3">
        {options.map((vehicle) => {
          const Icon = vehicle.icon;
          const isActive = selectedId === vehicle.id;

          return (
            <motion.button
              key={vehicle.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(vehicle)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                isActive 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/10 text-white' : 'bg-black/20 text-slate-400'}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-black text-white">{isBilingual ? vehicle.nameBn : vehicle.nameEn}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Users className="w-3 h-3" />
                      {vehicle.seats}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold">
                      <Clock className="w-3 h-3" />
                      {vehicle.eta}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-white">৳{vehicle.price}</p>
                <p className="text-[10px] text-slate-500">{t('Est. Fare', 'সম্ভাব্য ভাড়া')}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
