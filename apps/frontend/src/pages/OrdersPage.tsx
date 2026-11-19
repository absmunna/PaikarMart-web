import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Truck, Clock, CheckCircle2, MapPin, 
  Phone, ChevronRight, Download, ShieldCheck, ArrowLeft, AlertCircle,
  Store, ShoppingBag, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrderTrackingStore, TrackingOrder as Order } from '@/modules/orders';
import { useLiveChatStore } from '@/components/chat/LiveChatDrawer';
import { useAuth } from '@/modules/auth';
import { safeBack } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';


const MOCK_DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord_1',
    orderNo: 'PM-94821',
    total: 3450,
    items: [
      { name: 'মিনিকেট প্রিমিয়াম চাল (৫০ কেজি বস্তা)', quantity: 1, price: 3450, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' }
    ],
    status: 'IN_TRANSIT',
    createdAt: '২২ সেপ্টেম্বর, ২০২৬ ১০:৩০ AM',
    updatedAt: '২২ সেপ্টেম্বর, ২০২৬ ০৩:১৫ PM',
    address: 'বাড়ি ১২, রোড ৪, ব্লক-সি, মিরপুর-১০, ঢাকা',
    deliveryMethod: 'PaikarMart Express Logistics',
    paymentMethod: 'bKash (Escrow Protected)',
    activities: [
      { status: 'ORDER_CREATED', timestamp: '১০:৩০ AM', source: 'system', description: 'অর্ডার প্লেস করা হয়েছে' },
      { status: 'PAYMENT_CONFIRMED', timestamp: '১০:৩২ AM', source: 'system', description: 'বিকাশ এসক্রো পেমেন্ট ভেরিফাইড' },
      { status: 'PACKING', timestamp: '১১:০০ AM', source: 'seller', description: 'কারওয়ান বাজার আড়ত থেকে বস্তা প্রস্তুত' },
      { status: 'IN_TRANSIT', timestamp: '০১:৪৫ PM', source: 'logistics', description: 'এক্সপ্রেস রাইডার পণ্য নিয়ে মিরপুরের উদ্দেশ্যে রওনা দিয়েছেন' }
    ],
    riderInfo: {
      name: 'মো: রফিকুল ইসলাম',
      phone: '01799887766',
      distance: '১.৮ কি.মি. দূরে',
      eta: '২৫ মিনিটের মধ্যে'
    },
    escrowStatus: {
      lockedAmount: 3450,
      releaseCondition: 'ডেলিভারি গ্রহণের পর অর্থ ছাড় হবে',
      isReleased: false,
      refundEligible: true
    }
  }
];

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isSeller, isAdmin } = useAuth();
  const { 
    orders, 
    sellerOrders, 
    fetchOrders, 
    fetchSellerOrders, 
    isLoading,
    error 
  } = useOrderTrackingStore();
  
  const openChat = useLiveChatStore((state) => state.openChat);
  
  const [viewMode, setViewMode] = useState<'buyer' | 'seller'>('buyer');
  const [activeTab, setActiveTab] = useState<'all' | 'transit' | 'delivered'>('all');
  
  // Decide which list to show based on viewMode
  const activeOrdersList = viewMode === 'seller' ? sellerOrders : orders;
  const displayOrders = activeOrdersList.length > 0 ? activeOrdersList : (viewMode === 'buyer' ? MOCK_DEFAULT_ORDERS : []);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Initialize data and selection
  useEffect(() => {
    fetchOrders();
    if (isSeller || isAdmin) {
      fetchSellerOrders();
    }
  }, [fetchOrders, fetchSellerOrders, isSeller, isAdmin]);

  useEffect(() => {
    if (displayOrders.length > 0 && !selectedOrder) {
      setSelectedOrder(displayOrders[0]);
    }
  }, [displayOrders, selectedOrder]);

  const filteredOrders = useMemo(() => {
    return displayOrders.filter((ord) => {
      const status = String(ord.status).toUpperCase();
      if (activeTab === 'transit') {
        return ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'PACKING', 'PROCESSING', 'PENDING', 'SHIPPED'].includes(status);
      }
      if (activeTab === 'delivered') {
        return ['DELIVERED', 'COMPLETED'].includes(status);
      }
      return true;
    });
  }, [displayOrders, activeTab]);

  const getStatusBadge = (status: Order['status']) => {
    const s = String(status).toUpperCase();
    switch (s) {
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
      case 'SHIPPED':
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full text-[11px] font-black">চলমান ডেলিভারি</span>;
      case 'DELIVERED':
      case 'COMPLETED':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-[11px] font-black">ডেলিভারড</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-full text-[11px] font-black">বাতিল</span>;
      default:
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-full text-[11px] font-black">প্রসেসিং</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24 w-full mx-auto px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mt-4 pb-4 border-b border-[var(--pm-border)]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => safeBack(navigate, '/')}
            className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] transition-all active:scale-95 text-[var(--pm-text)] shadow-xs cursor-pointer"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-[var(--pm-text)] tracking-tight">
              {viewMode === 'seller' ? 'দোকানের অর্ডারসমূহ' : 'আমার অর্ডারসমূহ'}
            </h1>
            <p className="text-xs text-[var(--pm-text-muted)]">
              {viewMode === 'seller' ? 'আপনার স্টোরের ইনকামিং অর্ডার ও ডেলিভারি ট্র্যাকিং' : 'লাইভ ট্র্যাকিং, ডেলিভারি স্ট্যাটাস ও ইনভয়েস'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {(isSeller || isAdmin) && (
            <div className="flex bg-[var(--pm-surface)] p-1 rounded-xl border border-[var(--pm-border)]">
              <button
                onClick={() => { setViewMode('buyer'); setSelectedOrder(null); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1.5",
                  viewMode === 'buyer' ? "bg-[var(--pm-accent)] text-white shadow-sm" : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]"
                )}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                কেনাকাটা
              </button>
              <button
                onClick={() => { setViewMode('seller'); setSelectedOrder(null); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1.5",
                  viewMode === 'seller' ? "bg-[var(--pm-accent)] text-white shadow-sm" : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]"
                )}
              >
                <Store className="w-3.5 h-3.5" />
                আমার দোকান
              </button>
            </div>
          )}
          <button
            onClick={() => openChat('Paikar Mart লজিস্টিক সাপোর্ট')}
            className="px-3.5 py-2 bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:text-[var(--pm-accent)] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            সাপোর্ট
          </button>
        </div>
      </div>

      {isLoading && displayOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--pm-text-muted)]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--pm-accent)]" />
          <p className="text-sm font-bold animate-pulse">অর্ডার লোড হচ্ছে...</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-2 border-b border-[var(--pm-border)] pb-2 text-xs font-bold">
            {[
              { id: 'all', label: 'সব অর্ডার' },
              { id: 'transit', label: viewMode === 'seller' ? 'ডেলিভারি চলছে' : 'চলমান ট্র্যাকিং' },
              { id: 'delivered', label: 'ডেলিভারি সম্পন্ন' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-[var(--pm-accent)] text-white shadow-sm'
                    : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Orders List */}
            <div className="lg:col-span-1 space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl">
                  <Package className="w-12 h-12 text-[var(--pm-text-muted)] mb-3 opacity-20" />
                  <p className="text-sm font-bold text-[var(--pm-text-muted)]">কোনো অর্ডার পাওয়া যায়নি</p>
                  <p className="text-[10px] text-[var(--pm-text-muted)] opacity-60">এই ক্যাটাগরিতে বর্তমানে কোনো ডেটা নেই</p>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedOrder?.id === ord.id
                        ? 'bg-[var(--pm-surface)] border-[var(--pm-accent)] shadow-md ring-1 ring-[var(--pm-accent)]/30'
                        : 'bg-[var(--pm-surface)] border-[var(--pm-border)] hover:border-[var(--pm-accent)]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-[var(--pm-text)] font-mono">
                        #{ord.orderNo || ord.id.slice(0, 8)}
                      </span>
                      {getStatusBadge(ord.status)}
                    </div>

                    <div className="text-xs text-[var(--pm-text-muted)] space-y-1">
                      <p className="line-clamp-1 text-[var(--pm-text)] font-medium">
                        {ord.items?.[0]?.name || ord.items?.[0]?.productTitle || 'অর্ডার সামগ্রী'}
                      </p>
                      <div className="flex justify-between items-center pt-2 border-t border-[var(--pm-border)]/50">
                        <span className="text-xs font-black text-[var(--pm-text)]">
                          ৳{ord.total?.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[var(--pm-text-muted)]">
                          {typeof ord.createdAt === 'string' ? ord.createdAt.split('T')[0] : 'সম্প্রতি'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right: Order Detail & Timeline */}
            <div className="lg:col-span-2 space-y-4">
              {selectedOrder ? (
                <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--pm-border)]">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-[var(--pm-text)]">
                          অর্ডার #{selectedOrder.orderNo || selectedOrder.id}
                        </h2>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      <p className="text-xs text-[var(--pm-text-muted)] mt-1">
                        অর্ডার তারিখ: {typeof selectedOrder.createdAt === 'string' ? selectedOrder.createdAt.replace('T', ' ').split('.')[0] : 'সম্প্রতি'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toast.info(`ইনভয়েস #${selectedOrder.orderNo} ডাউনলোডের জন্য প্রস্তুত করা হচ্ছে...`)}
                        className="px-3.5 py-2 bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:text-[var(--pm-accent)] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        ইনভয়েস
                      </button>
                    </div>
                  </div>

                  {/* Rider card if in transit */}
                  {selectedOrder.riderInfo && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[var(--pm-text)]">{selectedOrder.riderInfo.name}</h4>
                          <p className="text-[11px] text-amber-600 font-semibold">
                            {selectedOrder.riderInfo.distance} • আনুমানিক পৌঁছাবে: {selectedOrder.riderInfo.eta}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`tel:${selectedOrder.riderInfo.phone}`}
                        className="p-2.5 bg-amber-500 text-white rounded-xl active:scale-95 shadow-xs flex items-center gap-1 text-xs font-bold"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        কল দিন
                      </a>
                    </div>
                  )}

                  {/* Progress Timeline */}
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--pm-text-muted)] mb-3">
                      অর্ডার অগ্রগতি টাইমলাইন
                    </h3>
                    {selectedOrder.activities && selectedOrder.activities.length > 0 ? (
                      <div className="space-y-3 relative pl-6 border-l-2 border-[var(--pm-accent)]/30 ml-2">
                        {selectedOrder.activities?.map((act, idx) => (
                          <div key={idx} className="relative">
                            <span className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-[var(--pm-accent)] ring-4 ring-[var(--pm-surface)]" />
                            <div className="bg-[var(--pm-bg)] p-3 rounded-xl border border-[var(--pm-border)]">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-[var(--pm-text)]">{act.description}</span>
                                <span className="text-[10px] text-[var(--pm-text-muted)]">{act.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-[var(--pm-bg)] rounded-xl border border-[var(--pm-border)] text-center text-[10px] text-[var(--pm-text-muted)] italic">
                        টাইমলাইন ডেটা প্রসেসিং হচ্ছে...
                      </div>
                    )}
                  </div>

                  {/* Delivery Address & Escrow Protection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--pm-border)]">
                    <div className="p-3 bg-[var(--pm-bg)] rounded-xl border border-[var(--pm-border)] flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[var(--pm-accent)] shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-xs text-[var(--pm-text)]">ডেলিভারি ঠিকানা</h5>
                        <p className="text-[11px] text-[var(--pm-text-muted)] mt-0.5 leading-relaxed">
                          {typeof selectedOrder.address === 'string' ? selectedOrder.address : 'ঠিকানা সংরক্ষিত নেই'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-black text-xs text-emerald-700">এসক্রো মানি গ্যারান্টি</h5>
                        <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                          ৳{selectedOrder.total?.toLocaleString()} সম্পূর্ণ সুরক্ষিত রয়েছে।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl opacity-60">
                  <AlertCircle className="w-12 h-12 mb-4 text-[var(--pm-text-muted)]" />
                  <h3 className="font-bold text-lg">অর্ডার নির্বাচন করুন</h3>
                  <p className="text-xs text-[var(--pm-text-muted)] max-w-xs mx-auto mt-2">
                    বিস্তারিত তথ্য এবং লাইভ ট্র্যাকিং দেখার জন্য বাম পাশের তালিকা থেকে একটি অর্ডার নির্বাচন করুন।
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
