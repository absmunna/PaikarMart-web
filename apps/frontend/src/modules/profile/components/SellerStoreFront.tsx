import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, ShoppingBag, Star, Clock, ShieldCheck, 
  MapPin, MessageSquare, Share2, Plus, 
  LayoutGrid, Grid, Info, Settings,
  Heart, ShoppingCart, Search, Filter,
  ArrowRight, ThumbsUp, MessageCircle, Send, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SellerStore, ProfileProduct } from '../types';
import { toast } from 'sonner';

interface SellerStoreFrontProps {
  store: SellerStore;
  products: ProfileProduct[];
  isOwner?: boolean;
}

export const SellerStoreFront: React.FC<SellerStoreFrontProps> = ({ store, products, isOwner }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'catalog' | 'reviews' | 'about'>('timeline');
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="space-y-6">
      {/* ── STORE HEADER SECTION ── */}
      <div className="relative">
        {/* Cover & Avatar Header Area */}
        <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden group">
          <img 
            src={store.coverUrl} 
            alt={store.storeName} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Avatar Overlay */}
          <div className="absolute -bottom-1 md:bottom-6 left-6 md:left-10 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-3xl bg-[#080B13] border-4 md:border-8 border-[#080B13] shadow-2xl overflow-hidden">
                <img src={store.avatarUrl} alt={store.storeName} className="w-full h-full object-cover" />
              </div>
              {store.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-sky-500 text-white p-1.5 rounded-xl border-4 border-[#080B13] shadow-lg">
                  <ShieldCheck className="w-4 h-4 md:w-6 md:h-6" />
                </div>
              )}
            </div>

            <div className="pb-2 space-y-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                <h1 className="text-xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none">
                  {store.storeName}
                </h1>
                <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[9px] font-black tracking-widest uppercase">
                  {store.category} Hub
                </Badge>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sky-400" /> {store.location}</span>
                <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" /> {store.rating} ({store.reviewCount} Reviews)</span>
                <span className="flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> {store.totalSales} Sales</span>
              </div>
            </div>
          </div>

          {/* Action Buttons in Header */}
          <div className="absolute top-4 right-4 md:top-auto md:bottom-8 md:right-8 flex gap-2">
             {isOwner ? (
               <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase tracking-widest h-9 px-6 rounded-xl shadow-lg shadow-emerald-500/20">
                 Dashboard
               </Button>
             ) : (
               <>
                 <Button 
                   onClick={() => setIsFollowing(!isFollowing)}
                   className={cn(
                     "font-black text-[10px] uppercase tracking-widest h-9 px-6 rounded-xl transition-all shadow-lg",
                     isFollowing ? "bg-white/10 text-white border border-white/10" : "bg-sky-500 hover:bg-sky-400 text-black shadow-sky-500/20"
                   )}
                 >
                   {isFollowing ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Plus className="w-3.5 h-3.5 mr-1.5" />}
                   {isFollowing ? 'Following' : 'Follow'}
                 </Button>
                 <Button variant="outline" className="bg-black/40 backdrop-blur-md border-white/10 text-white font-black text-[10px] uppercase tracking-widest h-9 w-9 p-0 rounded-xl">
                   <Share2 className="w-3.5 h-3.5" />
                 </Button>
               </>
             )}
          </div>
        </div>

        {/* Business Details Floating Card (Mobile/Small Desktop) */}
        <div className="mt-20 md:mt-0 pt-16 md:pt-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Response Time', value: `< ${store.responseTimeMinutes} min`, icon: Clock, color: 'text-sky-400' },
                { label: 'Followers', value: store.followersCount.toLocaleString(), icon: Grid, color: 'text-purple-400' },
                { label: 'Store Type', value: store.category, icon: Store, color: 'text-emerald-400' },
                { label: 'Location', value: store.location.split(',')[0], icon: MapPin, color: 'text-amber-400' }
              ].map((stat, i) => (
                <Card key={i} className="bg-[#111625] border-white/5 p-4 flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0", stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-sm font-black text-white truncate uppercase tracking-tight">{stat.value}</p>
                  </div>
                </Card>
              ))}
           </div>
        </div>
      </div>

      {/* ── SUB-NAVIGATION TABS ── */}
      <div className="flex items-center gap-1 border-b border-white/5 overflow-x-auto scrollbar-none sticky top-0 bg-[#080B13] z-20 py-2">
        {[
          { id: 'timeline', label: 'Timeline', icon: Grid },
          { id: 'catalog', label: 'Products', icon: ShoppingBag },
          { id: 'reviews', label: 'Reviews', icon: Star },
          { id: 'about', label: 'About', icon: Info }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "py-3 px-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all relative whitespace-nowrap",
              activeTab === tab.id 
                ? "text-sky-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-sky-400" 
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
        {!isOwner && (
          <Button variant="outline" className="ml-auto h-9 px-4 rounded-xl border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest hover:bg-sky-500/10">
            <MessageSquare className="w-3.5 h-3.5 mr-2" /> Message Seller
          </Button>
        )}
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto space-y-6"
            >
              {/* Facebook-style Product Post Cards */}
              {products.map((product) => (
                <Card key={product.id} className="bg-[#111625] border-white/5 overflow-hidden shadow-xl">
                  {/* Post Header */}
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                      <img src={store.avatarUrl} alt={store.storeName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-tight">{store.storeName}</h4>
                      <p className="text-[9px] text-zinc-500 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Just now · {store.location}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto text-zinc-500">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-xs text-zinc-300 font-bold leading-relaxed">
                      {product.title} is now available in our {store.category} hub! Stock is limited, get yours now. 
                      ৳{product.price.toLocaleString()} only. 
                    </p>
                  </div>

                  {/* 1:1 Aspect Ratio Media */}
                  <div className="aspect-square bg-black">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Action Bar */}
                  <div className="p-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-4">
                       <button className="flex items-center gap-1.5 text-zinc-400 hover:text-rose-500 transition-colors">
                         <Heart className="w-4 h-4" /> <span className="text-[10px] font-black uppercase">Wishlist</span>
                       </button>
                       <button className="flex items-center gap-1.5 text-zinc-400 hover:text-sky-400 transition-colors">
                         <MessageCircle className="w-4 h-4" /> <span className="text-[10px] font-black uppercase">Comment</span>
                       </button>
                    </div>
                    <div className="flex gap-2">
                       <Button size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[9px] uppercase tracking-widest h-8 px-4 rounded-lg">
                         Add to Cart
                       </Button>
                       <Button size="sm" className="bg-white/10 hover:bg-white/15 text-white font-black text-[9px] uppercase tracking-widest h-8 px-4 rounded-lg">
                         Direct Buy
                       </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}

          {activeTab === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="space-y-6"
            >
              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input placeholder="Search catalog..." className="bg-[#111625] border-white/5 pl-12 h-11 rounded-xl text-xs font-bold" />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                   <Button variant="outline" className="flex-1 bg-[#111625] border-white/5 rounded-xl h-11 text-[10px] font-black uppercase tracking-widest">
                     <Filter className="w-3.5 h-3.5 mr-2" /> Categories
                   </Button>
                   <Button variant="outline" className="flex-1 bg-[#111625] border-white/5 rounded-xl h-11 text-[10px] font-black uppercase tracking-widest">
                     Price Sort
                   </Button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {products.map((p) => (
                   <Card key={p.id} className="bg-[#111625] border-white/5 group overflow-hidden">
                      <div className="aspect-square relative overflow-hidden">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        {p.stock <= 5 && (
                          <Badge className="absolute top-2 left-2 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm">Low Stock</Badge>
                        )}
                      </div>
                      <div className="p-3 space-y-2">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-tight line-clamp-1">{p.title}</h4>
                        <div className="flex items-center justify-between">
                           <span className="text-xs font-black text-sky-400 tracking-tight">৳{p.price.toLocaleString()}</span>
                           <Button size="icon" className="w-7 h-7 bg-sky-500 hover:bg-sky-400 text-black rounded-lg">
                             <Plus className="w-3.5 h-3.5" />
                           </Button>
                        </div>
                      </div>
                   </Card>
                 ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              <div className="bg-[#111625] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center">
                 <div className="text-center md:text-left space-y-2 shrink-0">
                    <h2 className="text-5xl font-black text-white">{store.rating}</h2>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
                    </div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{store.reviewCount} Total Reviews</p>
                 </div>
                 <div className="flex-1 space-y-2 w-full">
                    {[5,4,3,2,1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-zinc-400 w-3">{rating}</span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-amber-500 rounded-full" style={{ width: `${rating === 5 ? 85 : rating === 4 ? 12 : 3}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-zinc-500 w-8">{rating === 5 ? '85%' : rating === 4 ? '12%' : '3%'}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Review Items */}
              <div className="space-y-4">
                 {[1, 2].map((i) => (
                   <Card key={i} className="bg-[#111625] border-white/5 p-5 space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/20 text-[10px] font-black text-sky-400">
                            U{i}
                         </div>
                         <div>
                            <p className="text-[11px] font-black text-white uppercase">Verified Buyer {i}</p>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[1,2,3,4,5].map(j => <Star key={j} className="w-2.5 h-2.5 fill-amber-500" />)}
                            </div>
                         </div>
                         <span className="ml-auto text-[9px] font-bold text-zinc-600 uppercase">2 days ago</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-bold">
                        Excellent product quality and very fast delivery from {store.storeName}. Highly recommended for bulk sourcing.
                      </p>
                      {/* Review Photo Tags */}
                      <div className="flex gap-2">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/5">
                           <img src={products[0].image} className="w-full h-full object-cover" />
                        </div>
                      </div>
                   </Card>
                 ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Card className="bg-[#111625] border-white/5 p-6 space-y-4">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-2">Business Bio</h3>
                 <p className="text-xs text-zinc-400 font-bold leading-relaxed">{store.bio}</p>
                 <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-xs">
                      <MapPin className="w-4 h-4 text-sky-400" />
                      <span className="text-zinc-300 font-bold">{store.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span className="text-zinc-300 font-bold">Responds within {store.responseTimeMinutes} minutes</span>
                    </div>
                 </div>
              </Card>

              <Card className="bg-[#111625] border-white/5 p-6 space-y-4">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-2">Store Policies</h3>
                 <div className="space-y-4">
                    <div>
                       <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Return Policy</h4>
                       <p className="text-xs text-zinc-300 font-bold">{store.policies?.return || 'Easy returns within 7 days of delivery.'}</p>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Delivery Zones</h4>
                       <p className="text-xs text-zinc-300 font-bold">{store.policies?.delivery || 'Express delivery within Dhaka. Standard shipping nationwide.'}</p>
                    </div>
                    <div>
                       <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Warranty</h4>
                       <p className="text-xs text-zinc-300 font-bold">{store.policies?.warranty || 'Official manufacturer warranty applies where applicable.'}</p>
                    </div>
                 </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
