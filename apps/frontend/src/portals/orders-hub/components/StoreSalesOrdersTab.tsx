import React, { useState } from 'react';
import { Order, VendorProfile } from '@/types';
import {
  Store,
  Truck,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Search,
  Send,
  Banknote
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLogisticsStore } from '@/features/logistics';

interface StoreSalesOrdersTabProps {
  orders: Order[];
  vendorProfile?: VendorProfile;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const StoreSalesOrdersTab: React.FC<StoreSalesOrdersTabProps> = ({
  orders,
  onUpdateOrder
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { syncOrderLifecycle } = useLogisticsStore();

  const [filter, setFilter] = useState<'all' | 'confirmed' | 'preparing' | 'in_transit' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'confirmed' || o.status === 'preparing').length;
  const inTransitCount = orders.filter((o) => o.status === 'in_transit').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  const filteredOrders = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesId = o.id.toLowerCase().includes(q);
      const matchesBuyer = (o.buyerName || '').toLowerCase().includes(q);
      const matchesItems = o.items.some((i) => i.product.title.toLowerCase().includes(q));
      return matchesId || matchesBuyer || matchesItems;
    }
    return true;
  });

  const handleAdvanceStatus = async (order: Order) => {
    let nextStatus: Order['status'] = order.status;

    if (order.status === 'confirmed') {
      nextStatus = 'preparing';
    } else if (order.status === 'preparing') {
      nextStatus = 'in_transit';
    } else if (order.status === 'in_transit') {
      nextStatus = 'delivered';
    }

    setUpdatingOrderId(order.id);
    try {
      const synced = await syncOrderLifecycle(order, nextStatus);
      onUpdateOrder(synced);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Store Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-[1.5rem] bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--pm-muted)]">
              {isBn ? 'মোট শপ সেলস' : 'Total Sales'}
            </span>
            <Banknote className="w-4 h-4 text-[var(--pm-success)]" />
          </div>
          <p className="text-base font-black text-[var(--pm-text)] font-mono tabular-nums">
            ৳{totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="p-3.5 rounded-[1.5rem] bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--pm-muted)]">
              {isBn ? 'পেন্ডিং অর্ডার' : 'Pending Orders'}
            </span>
            <Clock className="w-4 h-4 text-[var(--pm-warning)]" />
          </div>
          <p className="text-base font-black text-[var(--pm-warning)] font-mono tabular-nums">
            {pendingCount}
          </p>
        </div>

        <div className="p-3.5 rounded-[1.5rem] bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--pm-muted)]">
              {isBn ? 'কুরিয়ারে ডেলিভারি' : 'In Transit'}
            </span>
            <Truck className="w-4 h-4 text-[var(--pm-accent)]" />
          </div>
          <p className="text-base font-black text-[var(--pm-accent)] font-mono tabular-nums">
            {inTransitCount}
          </p>
        </div>

        <div className="p-3.5 rounded-[1.5rem] bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--pm-muted)]">
              {isBn ? 'সম্পন্ন সেলস' : 'Delivered'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-[var(--pm-success)]" />
          </div>
          <p className="text-base font-black text-[var(--pm-success)] font-mono tabular-nums">
            {deliveredCount}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--pm-card)] p-3 sm:p-4 rounded-[2rem] border border-[var(--pm-border)] shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--pm-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'গ্রাহকের নাম বা অর্ডার সার্চ...' : 'Search customer name, order ID or item...'}
            className="w-full pl-10 pr-4 py-2 rounded-[2rem] bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'all', label: isBn ? 'সব অর্ডার' : 'All Orders' },
            { id: 'confirmed', label: isBn ? 'নতুন' : 'New' },
            { id: 'preparing', label: isBn ? 'প্যাকিং' : 'Preparing' },
            { id: 'in_transit', label: isBn ? 'কুরিয়ারে' : 'In Transit' },
            { id: 'delivered', label: isBn ? 'সম্পন্ন' : 'Delivered' }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-[2rem] text-xs font-bold whitespace-nowrap transition-all active-scale cursor-pointer ${
                filter === f.id
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                  : 'bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] hover:text-[var(--pm-text)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Sales Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-[2rem] p-4 sm:p-5 shadow-xs space-y-4 hover:border-[var(--pm-success)]/60 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--pm-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[1.25rem] bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center font-black shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-[var(--pm-text)]">
                        {order.buyerName || 'Customer Account'}
                      </h4>
                      <span aria-hidden="true" className="text-[var(--pm-muted)]">
                        ·
                      </span>
                      <span className="text-xs text-[var(--pm-muted)] font-mono">#{order.id}</span>
                    </div>
                    <p className="text-[11px] text-[var(--pm-muted)] font-mono">
                      {order.createdAt} · {order.buyerPhone || '+880 1800-112233'}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-black text-[var(--pm-success)] font-mono tabular-nums self-end sm:self-auto">
                  +৳{order.total.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-2.5 rounded-[1.25rem] bg-[var(--pm-surface)] border border-[var(--pm-border)]"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-[0.75rem] object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[var(--pm-text)] truncate">
                        {item.product.title}
                      </p>
                      <p className="text-[10px] text-[var(--pm-muted)] font-mono tabular-nums">
                        Qty: {item.quantity} · ৳{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center gap-1.5 text-[var(--pm-muted)] bg-[var(--pm-surface)] p-2.5 rounded-[1.25rem] border border-[var(--pm-border)]">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{order.deliveryAddress}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--pm-muted)] bg-[var(--pm-surface)] p-2.5 rounded-[1.25rem] border border-[var(--pm-border)]">
                  <Banknote className="w-3.5 h-3.5 text-[var(--pm-success)] shrink-0" />
                  <span className="truncate">Payment: {order.paymentMethod}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--pm-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--pm-muted)] font-medium">Lifecycle Stage:</span>
                  <span className="font-bold text-[var(--pm-accent)] font-mono">
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                {order.status !== 'delivered' ? (
                  <button
                    type="button"
                    disabled={updatingOrderId === order.id}
                    onClick={() => void handleAdvanceStatus(order)}
                    className="px-4 py-2 rounded-[2rem] bg-[var(--pm-success)] hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold transition-all active-scale cursor-pointer flex items-center gap-1.5 shadow-xs self-end sm:self-auto whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {updatingOrderId === order.id
                        ? '...'
                        : order.status === 'confirmed'
                        ? isBn
                          ? 'অর্ডার গ্রহণ ও প্যাকিং শুরু'
                          : 'Accept & Start Preparing'
                        : order.status === 'preparing'
                        ? isBn
                          ? 'কুরিয়ারে হ্যান্ডওভার করুন'
                          : 'Dispatch to Courier Rider'
                        : isBn
                        ? 'ডেলিভারি সম্পন্ন করুন'
                        : 'Mark Delivery Completed'}
                    </span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-[var(--pm-success)] flex items-center gap-1.5 self-end sm:self-auto">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isBn ? 'অর্ডার সফলভাবে সম্পন্ন' : 'Order Fulfilled & Courier Delivered'}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-[2rem] p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-[1.5rem] bg-[var(--pm-warning-soft)] text-[var(--pm-warning)] flex items-center justify-center mx-auto">
            <Store className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-[var(--pm-text)]">
            {isBn ? 'কোনো গ্রাহক সেলস অর্ডার পাওয়া যায়নি' : 'No Customer Sales Orders'}
          </h4>
          <p className="text-xs text-[var(--pm-muted)] max-w-sm mx-auto">
            {isBn
              ? 'আপনার শপে এখনও কোনো অর্ডারের রিকোয়েস্ট আসেনি।'
              : 'Your store does not have any pending customer orders under this filter.'}
          </p>
        </div>
      )}
    </div>
  );
};
