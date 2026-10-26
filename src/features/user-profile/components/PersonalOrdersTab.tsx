import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, ShoppingBag, RotateCcw, HelpCircle, Eye, Star, Search, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  item: string;
  qty: number;
  price: number;
  image: string;
  store: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  date: string;
  deliveryDate?: string;
  trackingId?: string;
  riderName?: string;
  riderPhone?: string;
}

export function PersonalOrdersTab() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const orders: OrderItem[] = [
    {
      id: 'PK-ORD-9028',
      item: 'Realme Smart Band 2 With Heart Rate Tracker',
      qty: 1,
      price: 2450,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200',
      store: 'Realme BD Official',
      status: 'pending',
      date: '21 June 2026',
      trackingId: 'TRK-RLM-9028'
    },
    {
      id: 'PK-ORD-8823',
      item: 'Premium Cotton Polo Shirt - Assorted Colors (Bulk / পাইকারি প্যাকেজ)',
      qty: 20,
      price: 9000,
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200',
      store: 'Bangladesh Textile Wholesale',
      status: 'shipped',
      date: '18 June 2026',
      trackingId: 'TRK-REDX-8823',
      riderName: 'Jamal Uddin',
      riderPhone: '01711223344'
    },
    {
      id: 'PK-ORD-7492',
      item: 'AC Deep Chem-Wash Service (এসি সার্ভিসিং)',
      qty: 1,
      price: 1500,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200',
      store: 'Dhaka AC Service Pro',
      status: 'delivered',
      date: '10 June 2026',
      deliveryDate: '10 June 2026'
    },
    {
      id: 'PK-ORD-7102',
      item: 'High Speed Memory Card Class 10 (64GB)',
      qty: 2,
      price: 1100,
      image: 'https://images.unsplash.com/photo-1558442074-3c19857bc1a3?w=200',
      store: 'Micro Electronics',
      status: 'cancelled',
      date: '02 June 2026'
    },
    {
      id: 'PK-ORD-6582',
      item: 'Chapa Shutki Fresh Premium Hilsa (বিটুবি বাল্ক অর্ডার)',
      qty: 5,
      price: 3500,
      image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=200',
      store: 'CoxS Bazar Dry Fish Mart',
      status: 'returned',
      date: '25 May 2026'
    }
  ];

  const handleTrack = (ord: OrderItem) => {
    if (ord.status === 'shipped') {
      toast.info(
        `অর্ডার ট্র্যাকিং আইডি: ${ord.trackingId}\nরাইডার: ${ord.riderName} (${ord.riderPhone})`,
        { duration: 5000 }
      );
    } else if (ord.status === 'pending') {
      toast.success('অর্ডার প্রক্রিয়াধীন রয়েছে। দ্রুতই কুরিয়ারে হস্তান্তর করা হবে!');
    } else if (ord.status === 'delivered') {
      toast.success('অর্ডারটি জুন ১০ তারিখে সফলভাবে ডেলিভারি হয়েছে!');
    } else {
      toast.error('অর্ডার ট্র্যাক করা সম্ভব নয় / Tracking unavailable.');
    }
  };

  const handleReturn = (ord: OrderItem) => {
    toast.success(`${ord.id} অর্ডারের রিফান্ড ও রিটার্ন রিকোয়েস্ট জমা হয়েছে! / Return request placed!`);
  };

  const filteredOrders = orders.filter(ord => {
    if (activeFilter !== 'all' && ord.status !== activeFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return ord.item.toLowerCase().includes(q) || ord.id.toLowerCase().includes(q) || ord.store.toLowerCase().includes(q);
    }
    return true;
  });

  const filterConfigs: { id: typeof activeFilter; labelBn: string; labelEn: string; color: string }[] = [
    { id: 'all', labelBn: 'সকল অর্ডার', labelEn: 'All Orders', color: 'bg-zinc-800 text-white' },
    { id: 'pending', labelBn: 'অপেক্ষমান', labelEn: 'Pending', color: 'bg-amber-500/10 text-amber-500 border border-amber-500/20' },
    { id: 'processing', labelBn: 'প্রক্রিয়াকরণ', labelEn: 'Processing', color: 'bg-blue-500/10 text-blue-500 border border-blue-500/20' },
    { id: 'shipped', labelBn: 'পাঠানো হয়েছে', labelEn: 'Shipped', color: 'bg-purple-500/10 text-purple-500 border border-purple-500/20' },
    { id: 'delivered', labelBn: 'ডেলিভার্ড', labelEn: 'Delivered', color: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' },
    { id: 'cancelled', labelBn: 'বাতিল', labelEn: 'Cancelled', color: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' },
    { id: 'returned', labelBn: 'রিটার্ন ও রিফান্ড', labelEn: 'Returned', color: 'bg-zinc-700/50 text-zinc-300' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="অর্ডার নম্বর বা পণ্যের নাম দিয়ে খুঁজুন... / Search by Order ID, Item or Merchant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-zinc-950/60 border border-white/5 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
      </div>

      {/* Filter Tabs scrollbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-hide no-scrollbar select-none">
        {filterConfigs.map((fil) => (
          <button
            key={fil.id}
            onClick={() => setActiveFilter(fil.id)}
            className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer text-left shrink-0 ${
              activeFilter === fil.id
                ? 'bg-cyan-500 text-black shadow-[0_4px_12px_rgba(16,185,129,0.25)]'
                : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <span>{fil.labelBn}</span>
            <span className="block text-[8px] opacity-70 font-bold uppercase">{fil.labelEn}</span>
          </button>
        ))}
      </div>

      {/* Orders List / Grid */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 border border-white/[0.03] rounded-3xl bg-white/[0.005]">
            <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white uppercase">কোনো অর্ডার পাওয়া যায়নি</h3>
            <p className="text-xs text-zinc-500 mt-1 uppercase">No orders found matching this filter.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((ord) => (
              <motion.div
                key={ord.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all"
              >
                {/* Header info */}
                <div className="p-4 bg-zinc-950/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-[var(--pm-accent)]">{ord.id}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400">তারিখ: {ord.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wide">মেইড ইন বাংলাদেশ</span>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      ord.status === 'delivered' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      ord.status === 'shipped' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      ord.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      ord.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-zinc-800 text-zinc-300'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                </div>

                {/* Items layout */}
                <div className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <img src={ord.image} alt={ord.item} className="w-16 h-16 rounded-xl object-cover bg-zinc-900 border border-white/5" />
                    <div className="space-y-1">
                      <h4 className="text-xs md:text-sm font-black text-white leading-tight line-clamp-2">{ord.item}</h4>
                      <p className="text-[10px] text-zinc-400">স্টোর: <span className="text-white font-semibold">{ord.store}</span> | পরিমাণ: <span className="text-white font-semibold">{ord.qty}টি</span></p>
                      <p className="text-[10px] text-zinc-500 uppercase font-black tracking-wide">ভ্যাট অন্তর্ভুক্ত (৫% VAT + ১০% কয়েন ক্যাশব্যাক)</p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-zinc-500 block">মোট মূল্য / Total Price</span>
                      <span className="text-sm font-black text-white">৳{(ord.price * ord.qty).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleTrack(ord)}
                        className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                      >
                        ট্র্যাক অর্ডার / Track
                      </button>
                      {ord.status === 'delivered' && (
                        <button
                          onClick={() => handleReturn(ord)}
                          className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-extrabold text-[10px] uppercase rounded-xl transition-all cursor-pointer"
                        >
                          রিটার্ন / Refund
                        </button>
                      )}
                    </div>
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
