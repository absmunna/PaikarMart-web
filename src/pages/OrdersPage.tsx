import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Truck, Clock, CheckCircle2, MapPin, 
  Phone, ChevronRight, Download, ShieldCheck, ArrowLeft, AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrderTrackingStore, Order } from '../modules/orders/orderTrackingStore';
import { useLiveChatStore } from '../components/chat/LiveChatDrawer';

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
  },
  {
    id: 'ord_2',
    orderNo: 'PM-83920',
    total: 1150,
    items: [
      { name: 'PK Royal Cold-Pressed Mustard Oil (5L)', quantity: 1, price: 1150, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500' }
    ],
    status: 'DELIVERED',
    createdAt: '১৮ সেপ্টেম্বর, ২০২৬',
    updatedAt: '১৯ সেপ্টেম্বর, ২০২৬',
    address: 'বাড়ি ৪, ধানমন্ডি ২৭, ঢাকা',
    deliveryMethod: 'Standard Delivery',
    paymentMethod: 'ক্যাশ অন ডেলিভারি (COD)',
    activities: [
      { status: 'ORDER_CREATED', timestamp: '১০:০০ AM', source: 'system', description: 'অর্ডার সম্পন্ন' },
      { status: 'DELIVERED', timestamp: '০৪:৩০ PM', source: 'logistics', description: 'সফলভাবে গ্রাহকের হাতে পৌঁছে দেওয়া হয়েছে' }
    ],
    escrowStatus: {
      lockedAmount: 1150,
      releaseCondition: 'সম্পন্ন',
      isReleased: true,
      refundEligible: false
    }
  }
];

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders } = useOrderTrackingStore();
  const openChat = useLiveChatStore((state) => state.openChat);
  const displayOrders = orders.length > 0 ? orders : MOCK_DEFAULT_ORDERS;

  const [activeTab, setActiveTab] = useState<'all' | 'transit' | 'delivered'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(displayOrders[0]);

  const filteredOrders = displayOrders.filter((ord) => {
    if (activeTab === 'transit') return ord.status === 'IN_TRANSIT' || ord.status === 'OUT_FOR_DELIVERY' || ord.status === 'PACKING';
    if (activeTab === 'delivered') return ord.status === 'DELIVERED' || ord.status === 'COMPLETED';
    return true;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'IN_TRANSIT':
      case 'OUT_FOR_DELIVERY':
        return <span className="px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-full text-[11px] font-black">চলমান ডেলিভারি</span>;
      case 'DELIVERED':
      case 'COMPLETED':
        return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-[11px] font-black">ডেলিভারড</span>;
      default:
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-full text-[11px] font-black">প্রসেসিং</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24 w-full mx-auto px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mt-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--pm-text)] tracking-tight">আমার অর্ডারসমূহ</h1>
          <p className="text-xs text-[var(--pm-text-muted)]">লাইভ ট্র্যাকিং, ডেলিভারি স্ট্যাটাস ও ইনভয়েস</p>
        </div>
        <button
          onClick={() => openChat('Paikar Mart লজিস্টিক সাপোর্ট')}
          className="px-3.5 py-2 bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:text-[var(--pm-accent)] rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          লজিস্টিক সাপোর্ট
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--pm-border)] pb-2 text-xs font-bold">
        {[
          { id: 'all', label: 'সব অর্ডার' },
          { id: 'transit', label: 'চলমান ট্র্যাকিং' },
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
          {filteredOrders.map((ord) => (
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
                  {ord.items?.[0]?.name || 'অর্ডার সামগ্রী'}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--pm-border)]/50">
                  <span className="text-xs font-black text-[var(--pm-text)]">
                    ৳{ord.total?.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[var(--pm-text-muted)]">{ord.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Detail & Timeline */}
        {selectedOrder && (
          <div className="lg:col-span-2 space-y-4">
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
                    অর্ডার তারিখ: {selectedOrder.createdAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => alert(`ইনভয়েস #${selectedOrder.orderNo} ডাউনলোডের জন্য প্রস্তুত করা হচ্ছে...`)}
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
              </div>

              {/* Delivery Address & Escrow Protection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--pm-border)]">
                <div className="p-3 bg-[var(--pm-bg)] rounded-xl border border-[var(--pm-border)] flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[var(--pm-accent)] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-[var(--pm-text)]">ডেলিভারি ঠিকানা</h5>
                    <p className="text-[11px] text-[var(--pm-text-muted)] mt-0.5 leading-relaxed">
                      {selectedOrder.address}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-emerald-700">এসক্রো মানি গ্যারান্টি</h5>
                    <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                      ৳{selectedOrder.escrowStatus?.lockedAmount?.toLocaleString()} সম্পূর্ণ সুরক্ষিত রয়েছে।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
