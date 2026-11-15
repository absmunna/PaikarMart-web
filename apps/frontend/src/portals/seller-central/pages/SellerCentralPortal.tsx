import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  VendorProfile,
  CommerceItem,
  ServiceBooking,
  BusinessDocument,
  PortalTab,
  User as UserType
} from '@/types';
import { isGovernanceRole } from '@paikarmart/shared';
import { vendorApiClient, VendorAnalyticsSummary } from '@/features/vendors';
import { SellerInventoryPage } from '@/portals/seller-central/pages/SellerInventoryPage';
import { ServicesSubDashboard } from '@/portals/seller-central/components/ServicesSubDashboard';
import { RidesSubDashboard } from '@/portals/seller-central/components/RidesSubDashboard';
import { CreatorSubDashboard } from '@/portals/seller-central/components/CreatorSubDashboard';
import { DocumentsVault } from '@/portals/seller-central/components/DocumentsVault';
import { QuickAttachCatalogModal } from '@/portals/seller-central/components/QuickAttachCatalogModal';
import { AdminCatalogGovernanceModal } from '@/portals/seller-central/components/AdminCatalogGovernanceModal';
import {
  Store,
  ShieldCheck,
  ShoppingBag,
  Wrench,
  Truck,
  Video,
  FileText,
  Settings,
  User,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { VendorWorkspaceSwitcher } from '@/portals/seller-central/components/VendorWorkspaceSwitcher';

interface SellerCentralPortalProps {
  vendorProfile: VendorProfile;
  currentUser?: UserType;
  products: CommerceItem[];
  bookings?: ServiceBooking[];
  onAddNewProduct: (newProductData: Omit<CommerceItem, 'id' | 'rating' | 'reviewsCount'>) => void;
  onCreatePromoPost: (product: CommerceItem) => void;
  onOpenStoreSettings: () => void;
  onSelectTab: (tab: PortalTab) => void;
}

export const SellerCentralPortal: React.FC<SellerCentralPortalProps> = ({
  vendorProfile,
  currentUser,
  products,
  bookings = [],
  onAddNewProduct,
  onCreatePromoPost,
  onOpenStoreSettings,
  onSelectTab
}) => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const isBn = language === 'bn';
  const editProductId = searchParams.get('edit');

  const canAccessGovernance = isGovernanceRole(currentUser?.role);
  const activeRoles = vendorProfile.activeRoles || ['retail_merchant', 'wholesale_supplier'];
  const initialDocs: BusinessDocument[] = vendorProfile.documents || [
    { id: 'd1', type: 'Trade License', fileName: 'Trade_License_2026_Dhaka.pdf', status: 'verified', uploadedAt: 'Oct 15, 2026' },
    { id: 'd2', type: 'NID / Passport', fileName: 'NID_Front_Back_Scanned.jpg', status: 'verified', uploadedAt: 'Oct 15, 2026' }
  ];

  const [documents, setDocuments] = useState<BusinessDocument[]>(initialDocs);
  const vendorProfiles = currentUser?.vendorProfiles?.length ? currentUser.vendorProfiles : [vendorProfile];
  const [activeVendorId, setActiveVendorId] = useState(() => {
    try {
      return localStorage.getItem('paikarmart_active_vendor_id') || vendorProfile.id;
    } catch {
      return vendorProfile.id;
    }
  });
  const activeVendorProfile = vendorProfiles.find((profile) => profile.id === activeVendorId) || vendorProfile;

  useEffect(() => {
    const resolvedId = vendorProfiles.some((profile) => profile.id === activeVendorId)
      ? activeVendorId
      : vendorProfiles[0]?.id || vendorProfile.id;
    if (resolvedId !== activeVendorId) setActiveVendorId(resolvedId);
    try {
      localStorage.setItem('paikarmart_active_vendor_id', resolvedId);
    } catch {}
  }, [activeVendorId, vendorProfile.id, vendorProfiles]);
  const [analytics, setAnalytics] = useState<VendorAnalyticsSummary | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'commerce' | 'services' | 'rides' | 'creator' | 'documents'>(
    editProductId ? 'commerce' : 'commerce'
  );

  useEffect(() => {
    if (editProductId) {
      setActiveSubTab('commerce');
    }
  }, [editProductId]);

  useEffect(() => {
    let active = true;
    void vendorApiClient.fetchVendorAnalytics(activeVendorProfile.id, currentUser?.id).then((res) => {
      if (active && res) setAnalytics(res);
    });
    return () => {
      active = false;
    };
  }, [activeVendorProfile.id, currentUser?.id]);

  const handleUploadDocument = (newDoc: BusinessDocument) => {
    setDocuments([newDoc, ...documents]);
  };

  const [showQuickAttachModal, setShowQuickAttachModal] = useState(false);
  const [showAdminGovernanceModal, setShowAdminGovernanceModal] = useState(false);

  const handleAttachOffer = (listing: any) => {
    onAddNewProduct({
      storeId: vendorProfile.id,
      storeName: vendorProfile.storeName,
      type: listing.tradeMode === 'wholesale' ? 'wholesale' : 'retail',
      tradeMode: listing.tradeMode || 'retail',
      title: listing.title || 'Product Offer',
      price: Number(listing.price) || 990,
      imageUrl: listing.imageUrl || '/src/assets/images/placeholder_sku.jpg',
      description: `Verified listing offer from ${vendorProfile.storeName}. Real photos: ${listing.sellerRealPhotos?.length || 0} attached.`,
      category: listing.category || 'Electronics',
      inStock: true,
      deliveryEta: listing.deliveryEta || '1-2 Days',
      minWholesaleQty: listing.minWholesaleQty || 1,
      wholesaleTiers: listing.wholesaleTiers || []
    });
    setShowQuickAttachModal(false);
  };

  const handleSubmitNewCatalogItem = (submission: any) => {
    onAddNewProduct({
      storeId: vendorProfile.id,
      storeName: vendorProfile.storeName,
      type: submission.tradeMode === 'wholesale' ? 'wholesale' : 'retail',
      tradeMode: submission.tradeMode || 'retail',
      title: submission.proposedTitle || 'Proposed Product',
      price: Number(submission.proposedPrice) || 1200,
      imageUrl: submission.proposedImages?.[0] || '/src/assets/images/placeholder_sku.jpg',
      description: submission.proposedDescription || 'New catalog product submission awaiting AI governance audit.',
      category: submission.proposedCategory || 'General',
      inStock: true,
      deliveryEta: '2-3 Days'
    });
    setShowQuickAttachModal(false);
  };

  const storeProductsCount = products.filter(
    (p) => p.storeId === activeVendorProfile.id || p.storeName === activeVendorProfile.storeName
  ).length;
  const activeStoreProducts = products.filter(
    (p) => p.storeId === activeVendorProfile.id || p.storeName === activeVendorProfile.storeName
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn pb-16">
      {/* Top Banner: Store Identity & Unboxed Trust Metadata */}
      <div className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shrink-0">
              <Store className="w-7 h-7" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--pm-text)] truncate">
                  {activeVendorProfile.storeName}
                </h1>
                <span className="text-xs font-bold text-[var(--pm-success)] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Trust Level {vendorProfile.trustLevel ?? 5}</span>
                </span>
              </div>

              <p className="text-xs text-[var(--pm-muted)] mt-0.5 truncate">
                {activeVendorProfile.legalEntityName} · Reg {activeVendorProfile.businessRegNumber} · {activeVendorProfile.commissionTier} · ★ {activeVendorProfile.rating.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <VendorWorkspaceSwitcher profiles={vendorProfiles} activeVendorId={activeVendorId} onChange={setActiveVendorId} />
            <button
              type="button"
              onClick={() => setShowQuickAttachModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap active-scale"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isBn ? '৩০ সেকেন্ড লিস্টিং' : '30s Quick Attach'}</span>
            </button>

            <Link
              to={`/store/${encodeURIComponent(vendorProfile.id)}`}
              className="px-3 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)] text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isBn ? 'পাবলিক স্টোর' : 'Storefront'}</span>
            </Link>

            {canAccessGovernance && (
              <button
                type="button"
                onClick={() => setShowAdminGovernanceModal(true)}
                className="px-3 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-accent-border)] text-[var(--pm-accent)] hover:bg-[var(--pm-accent-soft)] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'ক্যাটালগ গভর্ন্যান্স' : 'Catalog Governance'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelectTab('profile')}
              className="px-3 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              <span>{isBn ? 'প্রোফাইল' : 'Profile'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenStoreSettings}
              className="p-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)] transition-colors cursor-pointer"
              title="Store Settings & Payouts"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-Column Revenue & Escrow KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-[var(--pm-border)]">
          <div className="p-3 rounded-xl sm:rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
            <span className="text-[11px] font-bold text-[var(--pm-muted)] block">Gross BDT Sales</span>
            <span className="text-lg font-mono tabular-nums font-bold text-[var(--pm-text)] mt-0.5 block">
              ৳{(analytics?.metrics.grossSalesBdt ?? activeVendorProfile.totalSales).toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl sm:rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
            <span className="text-[11px] font-bold text-[var(--pm-muted)] block">Escrow On-Hold</span>
            <span className="text-lg font-mono tabular-nums font-bold text-[var(--pm-warning)] mt-0.5 block">
              ৳{(analytics?.metrics.escrowHeldBdt ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl sm:rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
            <span className="text-[11px] font-bold text-[var(--pm-muted)] block">Net Payout Ready</span>
            <span className="text-lg font-mono tabular-nums font-bold text-[var(--pm-success)] mt-0.5 block">
              ৳{(analytics?.metrics.netPayoutReadyBdt ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl sm:rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
            <span className="text-[11px] font-bold text-[var(--pm-muted)] block">Catalog SKUs</span>
            <span className="text-lg font-mono tabular-nums font-bold text-[var(--pm-text)] mt-0.5 block">
              {storeProductsCount || products.length}
            </span>
          </div>
        </div>

        {/* Active Business Capabilities (Clean text separators, zero pills) */}
        <div className="pt-2 border-t border-[var(--pm-border)] flex items-center gap-2 text-xs text-[var(--pm-muted)] overflow-x-auto no-scrollbar">
          <span className="font-bold text-[var(--pm-text)] shrink-0">
            {isBn ? 'সক্রিয় ভূমিকা:' : 'Active Roles:'}
          </span>
          {activeRoles.map((role, idx) => (
            <React.Fragment key={role}>
              {idx > 0 && <span aria-hidden="true">·</span>}
              <span className="capitalize whitespace-nowrap">{role.replace(/_/g, ' ')}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Sub-Dashboard Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[var(--pm-border)] pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('commerce')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'commerce'
              ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md font-black'
              : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isBn ? 'কমার্স প্রোডাক্ট ক্যাটালগ 🛒' : 'Commerce Store 🛒'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('services')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'services'
              ? 'bg-[var(--pm-success)] text-white shadow-md font-black'
              : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)]'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>{isBn ? 'সার্ভিস ও এ্যাপয়েন্টমেন্ট 🔧' : 'Services & Slots 🔧'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('rides')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'rides'
              ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md font-black'
              : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)]'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{isBn ? 'রাইড ও ট্রানজিট ড্রাইভার 🚗' : 'Rides & Transit 🚗'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('creator')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'creator'
              ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md font-black'
              : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)]'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>{isBn ? 'ক্রিয়েটর স্টুডিও 🎥' : 'Creator Studio 🎥'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('documents')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'documents'
              ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md font-black'
              : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isBn ? 'ডকুমেন্টস ভল্ট 📄' : 'Documents Vault 📄'}</span>
        </button>
      </div>

      {/* Active Sub-Dashboard Render */}
      {activeSubTab === 'commerce' && (
        <SellerInventoryPage
          products={activeStoreProducts}
          storeId={activeVendorProfile.id}
          storeName={activeVendorProfile.storeName}
          onAddNewProduct={onAddNewProduct}
          onCreatePromoPost={onCreatePromoPost}
          onOpenQuickAttach={() => setShowQuickAttachModal(true)}
          editProductId={editProductId || undefined}
        />
      )}

      {activeSubTab === 'services' && (
        <ServicesSubDashboard
          services={products.filter(p => p.type === 'service')}
          bookings={bookings}
        />
      )}

      {activeSubTab === 'rides' && (
        <RidesSubDashboard />
      )}

      {activeSubTab === 'creator' && (
        <CreatorSubDashboard />
      )}

      {activeSubTab === 'documents' && (
        <DocumentsVault
          documents={documents}
          ownerId={currentUser?.id || vendorProfile.id}
          onUploadDocument={handleUploadDocument}
        />
      )}

      {/* 30-Second Quick Attach Modal */}
      <QuickAttachCatalogModal
        isOpen={showQuickAttachModal}
        onClose={() => setShowQuickAttachModal(false)}
        onAttachOffer={handleAttachOffer}
        onSubmitNewCatalogItem={handleSubmitNewCatalogItem}
      />

      {/* Admin Catalog Governance & Gemini Vision AI Verification Modal */}
      <AdminCatalogGovernanceModal
        isOpen={showAdminGovernanceModal}
        onClose={() => setShowAdminGovernanceModal(false)}
      />

    </div>
  );
};
