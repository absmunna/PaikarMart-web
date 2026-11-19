import React, { useState } from 'react';
import { Order, PortalTab } from '@/types';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  ChevronRight,
  MapPin,
  PackageCheck,
  ArrowUpRight,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PurchasesOrdersTabProps {
  orders: Order[];
  onTrackOrder: (order: Order) => void;
  onSelectTab: (tab: PortalTab) => void;
  onReorder?: (order: Order) => Promise<void>;
}

export const PurchasesOrdersTab: React.FC<PurchasesOrdersTabProps> = ({
  orders,
  onTrackOrder,
  onSelectTab,
  onReorder
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [statusFilter, setStatusFilter] = useState<'all' | 'in_transit' | 'preparing' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesId = o.id.toLowerCase().includes(q);
      const matchesStore = (o.storeName || '').toLowerCase().includes(q);
      const matchesItems = o.items.some((i) => i.product.title.toLowerCase().includes(q));
      return matchesId || matchesStore || matchesItems;
    }
    return true;
  });

  const renderStatusText = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="text-xs font-bold text-[var(--pm-success)] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isBn ? 'ডেলিভারি সম্পন্ন' : 'Delivered'}</span>
          </span>
        );
      case 'in_transit':
        return (
          <span className="text-xs font-bold text-[var(--pm-accent)] flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span>{isBn ? 'কুরিয়ার রাইডারে' : 'In Transit'}</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="text-xs font-bold text-[var(--pm-warning)] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{isBn ? 'প্যাকিং চলছে' : 'Preparing'}</span>
          </span>
        );
      case 'confirmed':
      default:
        return (
          <span className="text-xs font-bold text-[var(--pm-muted)] flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isBn ? 'অর্ডার গৃহীত' : 'Confirmed'}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--pm-card)] p-3 sm:p-4 rounded-2xl sm:rounded-[2rem] border border-[var(--pm-border)] shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--pm-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'অর্ডার আইডি বা প্যাক সামগ্রী খুঁজুন...' : 'Search by order ID or item name...'}
            className="w-full pl-10 pr-4 py-2 rounded-[2rem] bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'all', label: isBn ? 'সব কেনাকাটা' : 'All Purchases' },
            { id: 'in_transit', label: isBn ? 'কুরিয়ারে' : 'In Transit' },
            { id: 'preparing', label: isBn ? 'প্রস্তুত হচ্ছে' : 'Preparing' },
            { id: 'delivered', label: isBn ? 'সম্পন্ন' : 'Delivered' }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-[2rem] text-xs font-bold whitespace-nowrap transition-all active-scale cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                  : 'bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] hover:text-[var(--pm-text)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Purchases List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-2xl sm:rounded-[2rem] p-3.5 sm:p-5 shadow-xs space-y-3 sm:space-y-4 hover:border-[var(--pm-accent-border)] transition-all"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--pm-border)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[var(--pm-text)] font-mono">
                      #{order.id}
                    </span>
                    <span aria-hidden="true" className="text-xs text-[var(--pm-muted)]">
                      ·
                    </span>
                    <span className="text-xs font-bold text-[var(--pm-text)]">
                      {order.storeName || order.items[0]?.product.storeName || 'PaikarMart Store'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--pm-muted)] font-mono mt-0.5">{order.createdAt}</p>
                </div>

                <div className="flex items-center gap-3">
                  {renderStatusText(order.status)}
                  <span aria-hidden="true" className="text-[var(--pm-border)]">
                    ·
                  </span>
                  <span className="text-sm font-black text-[var(--pm-text)] font-mono tabular-nums">
                    ৳{order.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 shrink-0 bg-[var(--pm-surface)] p-2 rounded-[1.25rem] border border-[var(--pm-border)] max-w-[240px]"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-[0.75rem] object-cover shrink-0"
                    />
                    <div className="min-w-0">
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

              {/* Footer */}
              <div className="pt-3 border-t border-[var(--pm-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-[var(--pm-muted)]">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate max-w-xs">{order.deliveryAddress}</span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {onReorder && (
                    <button
                      type="button"
                      disabled={reorderingId === order.id}
                      onClick={async () => {
                        setReorderingId(order.id);
                        try {
                          await onReorder(order);
                        } finally {
                          setReorderingId(null);
                        }
                      }}
                      className="px-3.5 py-2 rounded-[2rem] bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] font-bold transition-colors active-scale cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{reorderingId === order.id ? '...' : isBn ? 'পুনরায়' : 'Reorder'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onTrackOrder(order)}
                    className="px-4 py-2 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold transition-colors active-scale cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>{isBn ? 'ট্র্যাক অর্ডার ও রাইডার' : 'Track Order & Rider'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-[2rem] p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-[1.5rem] bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center mx-auto">
            <PackageCheck className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[var(--pm-text)]">
              {isBn ? 'কোনো ক্রয়কৃত অর্ডার পাওয়া যায়নি' : 'No Purchase Orders Found'}
            </h4>
            <p className="text-xs text-[var(--pm-muted)] max-w-sm mx-auto mt-1">
              {isBn
                ? 'আপনার কোনো কেনাকাটার অর্ডার নেই। পাইকারমার্ট হোলসেল ও রিটেইল পোর্টেলে ভিজিট করুন।'
                : 'You have not placed any buying orders yet. Explore the Marketplace & Wholesale Hub.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab('commerce')}
            className="px-5 py-2.5 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold transition-colors inline-flex items-center gap-1.5 active-scale cursor-pointer"
          >
            <span>{isBn ? 'শপ ফিড দেখুন' : 'Explore Commerce Feed'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
