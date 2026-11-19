import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, ShoppingBag, Search, Filter, 
  Clock, Store, Star, Plus, Navigation,
  ChevronRight, Utensils, ShoppingCart, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/Card';
import { useCartStore } from '@/modules/cart';
import { useLocation } from '@/modules/location/hooks/useLocation';
import { toast } from 'sonner';
import { NearbyStore } from '../types';
import { ProductCard } from '@/design-system/components/ui/ProductCard/ProductCard';

const MOCK_NEARBY_STORES: NearbyStore[] = [
  {
    id: 'ns1',
    name: "Sultan's Dine - Chilling Kitchen",
    nameBn: 'সুলতান ডাইন চিলিং কিচেন',
    type: 'food',
    latitude: 23.8103,
    longitude: 90.4125,
    address: 'Banani Road 11, Dhaka',
    rating: 4.9,
    isOpen: true,
    estimatedDeliveryMinutes: 25,
    distanceKm: 1.2
  },
  {
    id: 'ns2',
    name: 'Shwapno Express Grocery',
    nameBn: 'স্বপ্ন এক্সপ্রেস গ্রোসারি',
    type: 'grocery',
    latitude: 23.8150,
    longitude: 90.4160,
    address: 'Bashundhara R/A, Dhaka',
    rating: 4.7,
    isOpen: true,
    estimatedDeliveryMinutes: 15,
    distanceKm: 0.8
  },
  {
    id: 'ns3',
    name: 'Lazz Pharma Express',
    nameBn: 'লাজ ফার্মা এক্সপ্রেস',
    type: 'pharmacy',
    latitude: 23.8180,
    longitude: 90.4110,
    address: 'Uttara Sector 3, Dhaka',
    rating: 4.8,
    isOpen: false,
    estimatedDeliveryMinutes: 20,
    distanceKm: 3.5
  }
];

export const NearbyPortal: React.FC = () => {
  const { addItem } = useCartStore();
  const { address } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<'all' | 'food' | 'grocery' | 'pharmacy'>('all');

  const filteredStores = MOCK_NEARBY_STORES.filter(store => 
    (activeType === 'all' || store.type === activeType) &&
    (store.name.toLowerCase().includes(searchQuery.toLowerCase()) || store.nameBn.includes(searchQuery))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-[#0c101c] border border-white/5 p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-xl">
              <MapPin className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Nearby Stores</h1>
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                <Navigation className="w-3 h-3 text-sky-400" /> 
                Searching within 5 km of {address || 'Current Location'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="h-14 rounded-2xl border-white/10 px-6 font-black uppercase text-[10px] tracking-widest bg-white/5">
                <Clock className="w-4 h-4 mr-2 text-emerald-400" /> Open Now
             </Button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Shops', icon: Store, color: 'text-white bg-white/5' },
          { id: 'food', label: 'Food & Dining', icon: Utensils, color: 'text-orange-400 bg-orange-500/10' },
          { id: 'grocery', label: 'Daily Grocery', icon: ShoppingBag, color: 'text-emerald-400 bg-emerald-500/10' },
          { id: 'pharmacy', label: 'Medicine', icon: Activity, color: 'text-teal-400 bg-teal-500/10' },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id as any)}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
              activeType === type.id 
                ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                : `${type.color} border-white/5 hover:border-white/10 hover:bg-white/10`
            }`}
          >
            <type.icon className="w-4 h-4" />
            {type.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
        <Input 
          placeholder="Search for restaurants, groceries or medicine..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl text-sm font-bold"
        />
      </div>

      {/* Store Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStores.map((store) => (
          <ProductCard 
            key={store.id} 
            product={{
              id: store.id,
              name: store.name,
              nameBn: store.nameBn,
              type: 'service',
              vendor: store.name,
              location: store.address,
              image: `https://images.unsplash.com/photo-${store.type === 'food' ? '1555396273-367ea4eb4db5' : store.type === 'grocery' ? '1542838132-92c53300491e' : '1587854692152-cbe660dbde88'}?w=400&q=80`,
              rating: store.rating,
              distance: `${store.distanceKm} KM`,
              deliveryTime: `${store.estimatedDeliveryMinutes} MIN`,
              isOpen: store.isOpen
            }}
          />
        ))}
      </div>
    </div>
  );
};
