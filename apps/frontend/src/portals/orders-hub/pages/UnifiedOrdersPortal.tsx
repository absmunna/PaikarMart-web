import React, { useState } from 'react';
import { Order, User, PortalTab } from '@/types';
import { PurchasesOrdersTab } from '@/portals/orders-hub/components/PurchasesOrdersTab';
import { StoreSalesOrdersTab } from '@/portals/orders-hub/components/StoreSalesOrdersTab';
import { OrderDetailsModal } from '@/portals/orders-hub/components/OrderDetailsModal';
import { OrderDashboard } from '@/portals/orders-hub/components/OrderDashboard';
import { GuestOrderTracker } from '@/portals/orders-hub/components/GuestOrderTracker';
import { ShoppingBag, Store, Sparkles, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLogisticsStore } from '@/features/logistics';

interface UnifiedOrdersPortalProps {
  currentUser: User;
  orders: Order[];
  onUpdateOrder: (updatedOrder: Order) => void;
  onReorderOrder?: (newOrder: Order) => void;
  onSelectTab: (tab: PortalTab) => void;
  onOpenVendorModal: () => void;
}

export const UnifiedOrdersPortal: React.FC<UnifiedOrdersPortalProps> = ({
  currentUser,
  orders,
  onUpdateOrder,
  onReorderOrder,
  onSelectTab,
  onOpenVendorModal
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const { reorderPreviousOrder, syncOrderLifecycle } = useLogisticsStore();

  const [activeTab, setActiveTab] = useState<'purchases' | 'sales'>('purchases');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  const buyerPurchases = orders;
  const storeSales = orders;
  const isGuest = !currentUser.id.startsWith('user_');

  const handleReorder = async (order: Order) => {
    const cloned = await reorderPreviousOrder(order);
    onReorderOrder?.(cloned);
  };

  const handleConfirmDelivery = async (order: Order) => {
    const updated = await syncOrderLifecycle(order, 'delivered');
    onUpdateOrder(updated);
    setSelectedOrderForTracking(updated);
  };

  if (isGuest) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in pb-12">
        <GuestOrderTracker
          orders={orders}
          onTrack={(order) => setSelectedOrderForTracking(order)}
        />

        <OrderDetailsModal
          isOpen={!!selectedOrderForTracking}
          onClose={() => setSelectedOrderForTracking(null)}
          order={selectedOrderForTracking}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-12">
      <OrderDashboard orders={orders} />

      {/* Header & Segmented Tab Switcher */}
      <div className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-2xl sm:rounded-[2rem] p-4 sm:p-5 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--pm-muted)]">
              <span className="font-bold text-[var(--pm-accent)]">
                {isBn ? 'ইউনিফাইড অর্ডার পোর্টাল' : 'Unified Orders Portal'}
              </span>
              {currentUser.isVendor && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[var(--pm-success)] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {isBn ? 'ভেন্ডর একাউন্ট এক্টিভ' : 'Dual Buyer & Vendor'}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--pm-text)] tracking-tight mt-1">
              {isBn ? 'আপনার কেনাকাটা ও শপ অর্ডার ট্র্যাকিং' : 'Purchases & Store Sales Order Center'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onSelectTab('rides')}
              className="px-4 py-2 rounded-[2rem] bg-[var(--pm-accent-soft)] hover:opacity-90 border border-[var(--pm-accent-border)] text-[var(--pm-accent)] text-xs font-bold transition-all active-scale cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{isBn ? 'কুরিয়ার ও লজিস্টিকস হাব' : 'Courier & Freight Hub'}</span>
            </button>

            {!currentUser.isVendor && (
              <button
                type="button"
                onClick={onOpenVendorModal}
                className="px-4 py-2 rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20 active-scale cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'ভেন্ডর রেজিস্টার করুন' : 'Become a Vendor'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Dual-Role Segmented Navigation Switcher */}
        <div className="flex items-center p-1 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl sm:rounded-[2rem] gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('purchases')}
            className={`flex-1 py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl sm:rounded-[2rem] text-xs font-bold transition-all flex items-center justify-center gap-2 active-scale cursor-pointer ${
              activeTab === 'purchases'
                ? 'bg-[var(--pm-card)] text-[var(--pm-accent)] shadow-sm font-black'
                : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isBn ? 'আমার ক্রয়সমূহ' : 'My Purchases'}</span>
            <span className="text-xs font-mono tabular-nums opacity-75">({buyerPurchases.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sales')}
            className={`flex-1 py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl sm:rounded-[2rem] text-xs font-bold transition-all flex items-center justify-center gap-2 active-scale cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-[var(--pm-card)] text-[var(--pm-success)] shadow-sm font-black'
                : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{isBn ? 'শপ কাস্টমার সেলস' : 'Store Sales Orders'}</span>
            <span className="text-xs font-mono tabular-nums opacity-75">({storeSales.length})</span>
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      {activeTab === 'purchases' ? (
        <PurchasesOrdersTab
          orders={buyerPurchases}
          onTrackOrder={(order) => setSelectedOrderForTracking(order)}
          onSelectTab={onSelectTab}
          onReorder={handleReorder}
        />
      ) : currentUser.isVendor ? (
        <StoreSalesOrdersTab
          orders={storeSales}
          vendorProfile={currentUser.vendorProfile}
          onUpdateOrder={onUpdateOrder}
        />
      ) : (
        <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-[2rem] p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-[1.5rem] bg-[var(--pm-warning-soft)] text-[var(--pm-warning)] flex items-center justify-center mx-auto shadow-inner">
            <Store className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-black text-[var(--pm-text)]">
              {isBn ? 'আপনি এখনও ভেন্ডর হিসেবে নিবন্ধিত নন' : 'Vendor Merchant Registration Required'}
            </h3>
            <p className="text-xs text-[var(--pm-muted)] leading-relaxed">
              {isBn
                ? 'একই একাউন্ট থেকে ক্রেতা ও বিক্রেতা উভয় সুবিধা পেতে বিনামূল্যে পাইকারমার্ট মার্চেন্ট ভেন্ডর রেজিস্ট্রেশন সম্পন্ন করুন।'
                : 'Register your business store to receive customer orders, manage courier dispatches, and track store revenue.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenVendorModal}
            className="px-6 py-3 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold transition-all shadow-lg inline-flex items-center gap-2 active-scale cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isBn ? 'ফ্রি ভেন্ডর রেজিস্ট্রেশন করুন' : 'Start Free Merchant Onboarding'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Interactive Order Details & Live Logistics Tracking Modal */}
      <OrderDetailsModal
        isOpen={!!selectedOrderForTracking}
        onClose={() => setSelectedOrderForTracking(null)}
        order={selectedOrderForTracking}
        onReorder={handleReorder}
        onConfirmDelivery={handleConfirmDelivery}
      />
    </div>
  );
};
