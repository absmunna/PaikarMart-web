import React from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag, Heart, Wallet, MapPin,
  ChevronRight, Star, Clock, ShieldCheck,
  Package, TrendingUp, CreditCard, Gift, Plus,
  Store, CheckCircle, Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { UserProfile } from '../types';

interface BuyerCockpitProps {
  user: UserProfile;
  onNavigateTab: (tab: string) => void;
}

export const BuyerCockpit: React.FC<BuyerCockpitProps> = ({ user, onNavigateTab }) => {
  return (
    <div className="space-y-6">
      {/* ── TOP STATS ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet Balance Card */}
        <Card className="bg-gradient-to-br from-[#111625] to-[#0c101c] border-white/5 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex flex-col gap-2 relative">
            <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Wallet Balance</span>
            </div>
            <h3 className="text-3xl font-black text-white leading-none">৳{user.walletBalance?.toLocaleString() || '0'}</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400">
                +{user.loyaltyCoins || '0'} COINS
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[9px] font-black uppercase text-zinc-500 hover:text-white"
                onClick={() => onNavigateTab('wallet')}
              >
                Manage <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Order Status Tracker Card */}
        <Card className="bg-[#111625] border-white/5 p-6 relative overflow-hidden group">
           <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                  <Package className="w-3.5 h-3.5 text-sky-400" />
                  <span>Recent Orders</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[9px] font-black uppercase text-zinc-500 hover:text-white"
                  onClick={() => onNavigateTab('orders')}
                >
                  View All
                </Button>
              </div>
              <div className="flex items-center justify-between gap-2">
                {[
                  { label: 'Pending', count: 2, icon: Clock, color: 'text-amber-400' },
                  { label: 'Shipping', count: 1, icon: Truck, color: 'text-sky-400' },
                  { label: 'Completed', count: 14, icon: CheckCircle, color: 'text-emerald-400' }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                    <span className="text-lg font-black text-white">{stat.count}</span>
                    <span className="text-[8px] font-black text-zinc-500 uppercase">{stat.label}</span>
                  </div>
                ))}
              </div>
           </div>
        </Card>

        {/* Trust Score / Activity Card */}
        <Card className="bg-[#111625] border-white/5 p-6">
           <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Buyer Reputation</span>
              </div>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-black text-white leading-none">{user.rating || '4.9'}</h3>
                <span className="text-xs font-bold text-zinc-500 pb-0.5">/ 5.0</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold leading-tight mt-1">
                You have completed 98% of your orders on time. Keep it up!
              </p>
           </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Wishlist Grid */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" /> Wishlist Items
            </h3>
            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-zinc-500" onClick={() => onNavigateTab('wishlist')}>
              See All
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[#111625] border-white/5 overflow-hidden group">
                <div className="aspect-square relative">
                  <img
                    src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=200&h=200&fit=crop`}
                    alt="Product"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2">
                    <Button size="icon" variant="ghost" className="w-7 h-7 bg-black/40 backdrop-blur-md rounded-full text-rose-500">
                      <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    </Button>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="text-[10px] font-bold text-white truncate uppercase">Premium Silk Saree {i}</h4>
                  <p className="text-xs font-black text-emerald-400">৳২,৪৫০</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="md:col-span-4 space-y-4">
          {/* Become a Seller CTA */}
          <Card className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-500/30 p-5 relative overflow-hidden group cursor-pointer hover:border-amber-500/50 transition-all">
             <div className="relative z-10 space-y-3">
               <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                 <Store className="w-5 h-5 text-amber-400" />
               </div>
               <h3 className="text-lg font-black text-white leading-tight">Start Selling on PaikarMart</h3>
               <p className="text-[10px] text-zinc-400 font-bold">Open your store in minutes and reach thousands of wholesale buyers.</p>
               <Button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-widest h-9">
                 Become a Seller
               </Button>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/20 transition-all" />
          </Card>

          {/* Saved Addresses */}
          <Card className="bg-[#111625] border-white/5 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Saved Addresses</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-lg text-sky-400">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { type: 'Home', address: 'Dhanmondi 27, Dhaka', icon: MapPin },
                { type: 'Office', address: 'Gulshan 2 Circle, Dhaka', icon: MapPin }
              ].map((addr, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <addr.icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-sky-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-white uppercase">{addr.type}</p>
                    <p className="text-[10px] text-zinc-500 font-bold line-clamp-1">{addr.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
