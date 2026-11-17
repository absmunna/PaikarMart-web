import React, { useState, useMemo, useEffect } from 'react';
import {
  Factory,
  Truck,
  ShieldCheck,
  FileText,
  ShoppingBag,
  ArrowRight,
  Package,
  CheckCircle2,
  Lock,
  PackageCheck
} from 'lucide-react';
import { CommerceItem, RFQRequest, SampleRequest, PortalTab } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { WholesaleProductCard } from '@/hubs/marketplace/portals/wholesale/components/WholesaleProductCard';
import { WholesaleFilterBar, WholesaleSupplierFilter, MOQFilter } from '@/hubs/marketplace/portals/wholesale/components/WholesaleFilterBar';
import { RFQModal } from '@/hubs/marketplace/portals/wholesale/components/RFQModal';
import { SampleRequestModal } from '@/hubs/marketplace/portals/wholesale/components/SampleRequestModal';
import { SearchGroundingWidget, MapsGroundingWidget } from '@/features/ai';
import { useB2BRFQStore, PurchaseOrderDraft } from '@/features/b2b';
import { useWalletStore } from '@/features/wallet';
import { PortalBannerCarousel } from '@/components/shared/PortalBannerCarousel';

interface WholesalePortalProps {
  items: CommerceItem[];
  onAddToCart: (item: CommerceItem, quantity: number, isWholesale: boolean) => void;
  onSelectTab?: (tab: PortalTab) => void;
}

export const WholesalePortal: React.FC<WholesalePortalProps> = ({
  items,
  onAddToCart,
  onSelectTab,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierCategory, setSelectedSupplierCategory] = useState<WholesaleSupplierFilter>('all');
  const [selectedMOQ, setSelectedMOQ] = useState<MOQFilter>('all');

  const {
    poDrafts,
    sampleOrders,
    syncWholesaleOrders,
    submitPurchaseRFQ,
    submitSampleOrder,
    markPoEscrowLocked
  } = useB2BRFQStore();
  const { createEscrowHold } = useWalletStore();

  // Modals
  const [activeRFQProduct, setActiveRFQProduct] = useState<CommerceItem | null>(null);
  const [activeSampleProduct, setActiveSampleProduct] = useState<CommerceItem | null>(null);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [lockingPoNumber, setLockingPoNumber] = useState<string | null>(null);

  useEffect(() => {
    void syncWholesaleOrders();
  }, [syncWholesaleOrders]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const isWholesale = item.tradeMode === 'wholesale' || item.type === 'wholesale';
      if (!isWholesale) return false;

      if (selectedSupplierCategory !== 'all') {
        const subCat = (item.subCategory || '').toLowerCase();
        if (!subCat.includes(selectedSupplierCategory)) {
          return false;
        }
      }

      const moq = item.minWholesaleQty || 20;
      if (selectedMOQ === 'low' && moq >= 50) return false;
      if (selectedMOQ === 'medium' && (moq < 50 || moq > 200)) return false;
      if (selectedMOQ === 'high' && moq <= 200) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesStore = item.storeName.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesStore && !matchesDesc && !matchesCat) {
          return false;
        }
      }

      return true;
    });
  }, [items, selectedSupplierCategory, selectedMOQ, searchQuery]);

  const handleRFQSubmit = async (rfq: Omit<RFQRequest, 'id' | 'createdAt' | 'status'>) => {
    setErrorBanner(null);
    const createdPo = await submitPurchaseRFQ({
      productId: rfq.productId,
      productTitle: rfq.productTitle,
      targetQuantity: rfq.targetQuantity,
      targetPricePerUnit: rfq.targetPricePerUnit,
      baseUnitPrice: activeRFQProduct?.price,
      companyName: rfq.companyName,
      contactPerson: rfq.contactPerson,
      phone: rfq.phone,
      email: rfq.email,
      destinationCity: rfq.destinationCity,
      paymentTerms: rfq.paymentTerms || 'escrow',
      notes: rfq.notes
    });

    setRecentNotification(
      `Proforma PO ${createdPo.poNumber} generated (৳${createdPo.financials.grandTotal.toLocaleString()} incl. AIT/VAT). Suppliers will reply via ${rfq.phone}.`
    );
    setTimeout(() => setRecentNotification(null), 6000);
  };

  const handleSampleSubmit = async (sample: Omit<SampleRequest, 'id' | 'createdAt' | 'status'>) => {
    setErrorBanner(null);
    const createdSample = await submitSampleOrder({
      productId: sample.productId,
      productTitle: sample.productTitle,
      companyName: sample.companyName,
      contactPerson: sample.contactPerson,
      phone: sample.phone,
      shippingAddress: sample.shippingAddress,
      sampleFee: activeSampleProduct?.price
    });
    setRecentNotification(
      `Sample dispatched for ${createdSample.productTitle} · Tracking: ${createdSample.trackingCode}`
    );
    setTimeout(() => setRecentNotification(null), 6000);
  };

  const handleLockPoInEscrow = async (po: PurchaseOrderDraft) => {
    setLockingPoNumber(po.poNumber);
    setErrorBanner(null);
    try {
      const escrow = await createEscrowHold({
        orderId: po.poNumber,
        poNumber: po.poNumber,
        title: `${po.product.name} (${po.financials.quantity} pcs)`,
        amount: po.financials.grandTotal,
        buyerName: po.buyer.name,
        sellerId: po.supplier.id,
        sellerName: po.supplier.factoryName
      });
      await markPoEscrowLocked(po.poNumber, escrow.id);
      setRecentNotification(
        `Escrow ${escrow.id} locked for ${po.poNumber} (৳${po.financials.grandTotal.toLocaleString()}). Viewable inside Wallet & Escrow Portal.`
      );
      setTimeout(() => setRecentNotification(null), 6000);
    } catch (err: any) {
      setErrorBanner(
        err?.message || 'Insufficient wallet balance to lock this PO in Escrow. Deposit funds in Wallet Portal first.'
      );
    } finally {
      setLockingPoNumber(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Commercial Ad Poster Carousel */}
      <PortalBannerCarousel portalType="wholesale" isBn={isBn} />

      {/* 2. Notification & Error Banners */}
      {recentNotification && (
        <div className="p-3.5 rounded-[1.5rem] bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-xs text-[var(--pm-success)] flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{recentNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setRecentNotification(null)}
            className="text-[11px] font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorBanner && (
        <div className="p-3.5 rounded-[1.5rem] bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-xs text-[var(--pm-danger)] flex items-center justify-between animate-fade-in">
          <span>{errorBanner}</span>
          <button
            type="button"
            onClick={() => onSelectTab?.('wallet')}
            className="px-3 py-1 rounded-[2rem] bg-[var(--pm-danger)] text-white text-[11px] font-bold whitespace-nowrap cursor-pointer"
          >
            Open Wallet
          </button>
        </div>
      )}

      {/* 3. Active B2B Purchase Orders (PO) & Sample Tracker */}
      {(poDrafts.length > 0 || sampleOrders.length > 0) && (
        <div className="p-5 rounded-[2rem] bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--pm-success)]" />
                <span>Active Purchase Orders (PO) & Sample Tracker</span>
              </h2>
              <p className="text-xs text-[var(--pm-muted)]">
                Server-synced bulk quotations, AIT/VAT totals & Escrow protection lock
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-[var(--pm-muted)]">
              {poDrafts.length} POs · {sampleOrders.length} Samples
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {poDrafts.slice(0, 4).map((po) => (
              <div
                key={po.poNumber}
                className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[var(--pm-muted)]">
                    <span className="font-mono font-bold text-[var(--pm-text)]">
                      {po.poNumber}
                    </span>
                    <span className="font-semibold text-[var(--pm-success)]">
                      {po.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--pm-text)] line-clamp-1">
                    {po.product.name}
                  </h4>
                  <p className="text-[11px] text-[var(--pm-muted)]">
                    {po.supplier.factoryName} · {po.financials.quantity} pcs @ ৳
                    {po.financials.unitPrice}/pc
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--pm-border)]">
                  <div>
                    <span className="text-[10px] text-[var(--pm-muted)] block">
                      Total (incl. 5% AIT/VAT)
                    </span>
                    <span className="text-sm font-mono tabular-nums font-black text-[var(--pm-text)]">
                      ৳{po.financials.grandTotal.toLocaleString()}
                    </span>
                  </div>

                  {po.status === 'escrow_locked' ? (
                    <button
                      type="button"
                      onClick={() => onSelectTab?.('wallet')}
                      className="px-3 py-1.5 rounded-[2rem] bg-[var(--pm-success-soft)] text-[var(--pm-success)] border border-[var(--pm-success)]/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Escrow {po.escrowId || 'Locked'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={lockingPoNumber === po.poNumber}
                      onClick={() => void handleLockPoInEscrow(po)}
                      className="px-3.5 py-1.5 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] text-[11px] font-bold flex items-center gap-1 active-scale cursor-pointer"
                    >
                      <Lock className="w-3 h-3" />
                      {lockingPoNumber === po.poNumber ? 'Locking...' : 'Lock in Escrow'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {sampleOrders.slice(0, 2).map((smp) => (
              <div
                key={smp.id}
                className="p-4 rounded-[1.5rem] bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--pm-accent)] font-semibold">
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span className="font-mono">{smp.id}</span>
                    <span>·</span>
                    <span>{smp.status}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--pm-text)] truncate">
                    {smp.productTitle}
                  </h4>
                  <p className="text-[11px] text-[var(--pm-muted)] font-mono">
                    Tracking: {smp.trackingCode}
                  </p>
                </div>
                <span className="text-xs font-mono tabular-nums font-bold text-[var(--pm-text)] shrink-0">
                  ৳{smp.sampleFee}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Filter & Search Controls */}
      <WholesaleFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedSupplierCategory}
        onSelectCategory={setSelectedSupplierCategory}
        selectedMOQ={selectedMOQ}
        onSelectMOQ={setSelectedMOQ}
        totalItemsCount={filteredItems.length}
      />

      {/* 5. AI Market Intelligence & Grounding Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SearchGroundingWidget
          initialPrompt="What are current raw cotton & yarn wholesale prices in Bangladesh?"
          placeholder="Research live market rates, inflation, import duties..."
        />
        <MapsGroundingWidget
          initialPrompt="Locate export-oriented knitwear garment factories in Gazipur"
          placeholder="Search factory hubs, cargo ports, wholesale markets..."
        />
      </div>

      {/* 6. Wholesale Products Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <WholesaleProductCard
              key={item.id}
              product={item}
              onAddToCart={onAddToCart}
              onRequestRFQ={(product) => setActiveRFQProduct(product)}
              onRequestSample={(product) => setActiveSampleProduct(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[var(--pm-card)] rounded-[2rem] border border-[var(--pm-border)] p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-center mx-auto text-[var(--pm-muted)]">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-[var(--pm-text)]">
            No wholesale listings match your filter
          </h3>
          <p className="text-xs text-[var(--pm-muted)] max-w-sm mx-auto">
            Try adjusting your search query, supplier category, or minimum order quantity (MOQ) filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedSupplierCategory('all');
              setSelectedMOQ('all');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 7. RFQ Modal */}
      <RFQModal
        product={activeRFQProduct}
        isOpen={!!activeRFQProduct}
        onClose={() => setActiveRFQProduct(null)}
        onSubmitRFQ={(rfq) => {
          void handleRFQSubmit(rfq);
        }}
      />

      {/* 8. Sample Request Modal */}
      <SampleRequestModal
        product={activeSampleProduct}
        isOpen={!!activeSampleProduct}
        onClose={() => setActiveSampleProduct(null)}
        onSubmitSample={(sample) => {
          void handleSampleSubmit(sample);
        }}
      />
    </div>
  );
};
