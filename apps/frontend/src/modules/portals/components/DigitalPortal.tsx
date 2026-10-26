import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Laptop, ShoppingBag, Search, Filter,
  Zap, ShieldCheck, Star, Plus,
  ChevronRight, Smartphone, Video, Key,
  Download, Globe, Gamepad2, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/Card';
import { useCartStore } from '@/modules/cart';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const DIGITAL_PRODUCTS = [
  { id: 'd1', title: 'Netflix Premium 4K (1 Month)', price: 350, type: 'Subscription', icon: Video, color: 'text-rose-500', rating: 4.9, reviews: 1200, delivery: 'Instant' },
  { id: 'd2', title: 'Windows 11 Pro Retail Key', price: 850, type: 'License Key', icon: Key, color: 'text-sky-500', rating: 4.8, reviews: 850, delivery: 'Instant' },
  { id: 'd3', title: 'Adobe Creative Cloud (Full)', price: 2500, type: 'Software', icon: Laptop, color: 'text-fuchsia-500', rating: 4.7, reviews: 430, delivery: 'Manual' },
  { id: 'd4', title: 'PUBG Mobile 660 UC Pack', price: 950, type: 'In-Game', icon: Gamepad2, color: 'text-amber-500', rating: 4.9, reviews: 2100, delivery: 'Instant' },
];

export const DigitalPortal: React.FC = () => {
  const { addItem } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      sourceId: product.id,
      name: product.title,
      price: product.price,
      quantity: 1,
      image: '', // Digital products might not have images or use icons
      domain: 'digital',
      metadata: { portal: 'DIGITAL', delivery: product.delivery }
    });
    toast.success(`${product.title} added to cart! Check your email after payment.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-[#0c101c] border border-white/5 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-xl">
              <Laptop className="w-10 h-10 text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Digital Hub</h1>
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1">Subscriptions, License Keys & OTT</p>
            </div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="h-14 rounded-2xl border-white/10 px-6 font-black uppercase text-[10px] tracking-widest bg-white/5">
                <ShieldCheck className="w-4 h-4 mr-2 text-emerald-400" /> 100% Secure & Guaranteed
             </Button>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'OTT & TV', icon: Video, color: 'from-rose-500/10 to-rose-600/5', iconColor: 'text-rose-400' },
           { label: 'Gaming UC', icon: Gamepad2, color: 'from-amber-500/10 to-amber-600/5', iconColor: 'text-amber-400' },
           { label: 'Software', icon: Smartphone, color: 'from-sky-500/10 to-sky-600/5', iconColor: 'text-sky-400' },
           { label: 'Gift Cards', icon: Gift, color: 'from-fuchsia-500/10 to-fuchsia-600/5', iconColor: 'text-fuchsia-400' },
         ].map((cat, i) => (
           <Card key={i} className={cn("p-6 border-white/5 group hover:border-white/20 transition-all cursor-pointer rounded-3xl bg-gradient-to-br", cat.color)}>
              <cat.icon className={cn("w-8 h-8 mb-3 group-hover:scale-110 transition-transform", cat.iconColor)} />
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{cat.label}</h4>
           </Card>
         ))}
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
        <Input
          placeholder="Search for Netflix, Windows keys, or Game currency..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl text-sm font-bold shadow-xl"
        />
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {DIGITAL_PRODUCTS.map((prod) => (
           <Card key={prod.id} className="bg-[#111625] border-white/5 p-5 rounded-3xl group hover:border-violet-500/30 transition-all duration-500 shadow-xl flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                 <prod.icon className={cn("w-8 h-8", prod.color)} />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-white/5 text-[7px] font-black uppercase border-white/10">{prod.type}</Badge>
                    {prod.delivery === 'Instant' && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 text-[7px] font-black uppercase border-emerald-500/20">
                         <Zap className="w-2.5 h-2.5 mr-1 fill-emerald-400" /> Instant Delivery
                      </Badge>
                    )}
                 </div>
                 <h3 className="text-sm font-black text-white uppercase tracking-tight truncate group-hover:text-violet-400 transition-colors">{prod.title}</h3>
                 <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-amber-400 text-[10px] font-black">
                       <Star className="w-3 h-3 fill-amber-400" /> {prod.rating}
                    </div>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase">{prod.reviews} reviews</span>
                 </div>
              </div>
              <div className="text-right shrink-0">
                 <p className="text-xl font-black text-white tracking-tighter">৳{prod.price}</p>
                 <Button
                  onClick={() => handleAddToCart(prod)}
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-black text-[9px] uppercase tracking-widest h-8 px-4 rounded-lg mt-2"
                 >
                   Get Now
                 </Button>
              </div>
           </Card>
         ))}
      </div>

      {/* Trust Banner */}
      <div className="p-8 rounded-[2.5rem] bg-gradient-to-r from-violet-600 to-indigo-700 shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Automated Digital Delivery</h3>
               <p className="text-xs text-violet-100 font-bold uppercase tracking-widest opacity-80">Get your keys and access codes instantly on your dashboard & email.</p>
            </div>
            <div className="flex items-center gap-6 shrink-0">
               <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2">
                     <Download className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[8px] font-black text-white uppercase">Fast DL</span>
               </div>
               <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-2">
                     <Globe className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[8px] font-black text-white uppercase">Global</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
