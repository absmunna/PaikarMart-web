import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, ShoppingBag, RotateCcw, HelpCircle, 
  Eye, Star, Search, CheckCircle2, Package, 
  Store, AlertCircle, Loader2, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { useOrderTrackingStore } from '@/modules/orders';
import { useAuth } from '@/modules/auth';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function PersonalOrdersTab() {
  const navigate = useNavigate();
  const { isSeller, isAdmin } = useAuth();
  const { 
    orders, 
    sellerOrders, 
    fetchOrders, 
    fetchSellerOrders, 
    isLoading 
  } = useOrderTrackingStore();

  const [viewMode, setViewMode] = useState<'buyer' | 'seller'>('buyer');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
    if (isSeller || isAdmin) {
      fetchSellerOrders();
    }
  }, [fetchOrders, fetchSellerOrders, isSeller, isAdmin]);

  const activeOrdersList = viewMode === 'seller' ? sellerOrders : orders;

  const filteredOrders = useMemo(() => {
    return activeOrdersList.filter(ord => {
      // Basic status mapping for filter
      const status = String(ord.status).toLowerCase();
      if (activeFilter !== 'all') {
         if (activeFilter === 'pending' && status !== 'pending' && status !== 'order_created') return false;
         if (activeFilter === 'processing' && status !== 'processing' && status !== 'packing') return false;
         if (activeFilter === 'shipped' && status !== 'shipped' && status !== 'in_transit' && status !== 'out_for_delivery') return false;
         if (activeFilter === 'delivered' && status !== 'delivered' && status !== 'completed') return false;
         if (activeFilter === 'cancelled' && status !== 'cancelled') return false;
         if (activeFilter === 'returned' && status !== 'returned') return false;
      }
      
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const itemName = ord.items?.[0]?.name || ord.items?.[0]?.productTitle || '';
        return (
          itemName.toLowerCase().includes(q) || 
          ord.id.toLowerCase().includes(q) || 
          (ord.orderNo && ord.orderNo.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeOrdersList, activeFilter, searchQuery]);

  const handleTrack = (ord: any) => {
    navigate(`/orders/track/${ord.id}`);
  };

  const filterConfigs: { id: typeof activeFilter; labelBn: string; labelEn: string }[] = [
    { id: 'all', labelBn: 'সকল অর্ডার', labelEn: 'All Orders' },
    { id: 'pending', labelBn: 'অপেক্ষমান', labelEn: 'Pending' },
    { id: 'processing', labelBn: 'প্রক্রিয়াকরণ', labelEn: 'Processing' },
    { id: 'shipped', labelBn: 'পাঠানো হয়েছে', labelEn: 'Shipped' },
    { id: 'delivered', labelBn: 'ডেলিভার্ড', labelEn: 'Delivered' },
    { id: 'cancelled', labelBn: 'বাতিল', labelEn: 'Cancelled' },
    { id: 'returned', labelBn: 'রিটার্ন', labelEn: 'Returned' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            {viewMode === 'seller' ? <Store className="w-6 h-6 text-amber-400" /> : <ShoppingBag className="w-6 h-6 text-cyan-400" />}
            {viewMode === 'seller' ? 'Shop Orders / দোকানের অর্ডারসমূহ' : 'My Orders / আমার অর্ডারসমূহ'}
          </h2>
        </div>

        {(isSeller || isAdmin) && (
          <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setViewMode('buyer')}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2",
                viewMode === 'buyer' ? "bg-cyan-500 text-black shadow-lg" : "text-zinc-500 hover:text-white"
              )}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              কেনাকাটা
            </button>
            <button
              onClick={() => setViewMode('seller')}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2",
                viewMode === 'seller' ? "bg-amber-500 text-black shadow-lg" : "text-zinc-500 hover:text-white"
              )}
            >
              <Store className="w-3.5 h-3.5" />
              আমার দোকান
            </button>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="অর্ডার নম্বর বা পণ্যের নাম দিয়ে খুঁজুন... / Search by Order ID or Item..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-zinc-950/60 border border-white/5 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar select-none">
        {filterConfigs.map((fil) => (
          <button
            key={fil.id}
            onClick={() => setActiveFilter(fil.id)}
            className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer text-left shrink-0 ${
              activeFilter === fil.id
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-white/[0.02] text-zinc-500 hover:text-white border border-white/5'
            }`}
          >
            <span>{fil.labelBn}</span>
            <span className="block text-[8px] opacity-70 font-bold uppercase">{fil.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-500">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            <p className="text-xs font-bold animate-pulse">লোড হচ্ছে...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 border border-white/[0.03] rounded-3xl bg-white/[0.005]">
            <Package className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-zinc-500 uppercase">কোনো অর্ডার পাওয়া যায়নি</h3>
            <p className="text-[10px] text-zinc-600 mt-1 uppercase">No orders found matching this filter.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((ord) => (
              <motion.div
                key={ord.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all group"
              >
                <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shrink-0">
                      <img 
                        src={ord.items?.[0]?.image || ord.items?.[0]?.productImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200'} 
                        alt="Product" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-cyan-500 font-mono tracking-tighter">#{ord.orderNo || ord.id.slice(0, 8)}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider",
                          String(ord.status).toLowerCase() === 'delivered' || String(ord.status).toLowerCase() === 'completed' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          String(ord.status).toLowerCase() === 'cancelled' ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                          "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        )}>
                          {ord.status}
                        </span>
                      </div>
                      <h4 className="text-xs md:text-sm font-black text-white leading-tight line-clamp-1">
                        {ord.items?.[0]?.name || ord.items?.[0]?.productTitle || 'পণ্য সামগ্রী'}
                      </h4>
                      <p className="text-[10px] text-zinc-500">
                        তারিখ: <span className="text-zinc-400">{typeof ord.createdAt === 'string' ? ord.createdAt.split('T')[0] : 'সম্প্রতি'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-widest">Total</span>
                      <span className="text-sm font-black text-white">৳{ord.total?.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => handleTrack(ord)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                    >
                      View Details
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
