import React, { useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { normalizeHandle, formatDisplayHandle } from '@paikarmart/shared';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Package,
  ShoppingBag,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Info,
  ChevronLeft,
  Share2,
  Heart,
  TrendingUp,
  Award,
  Smartphone,
  HelpCircle
} from 'lucide-react';
import { CommerceItem, User, Order, CartItem, RFQRequest, SampleRequest } from '@/types';
import { INITIAL_COMMERCE_ITEMS } from '@/data/mockData';
import { 
  GuestCheckoutForm, 
  AccountConversionPopup, 
  CheckoutSuccessSummary, 
  OtherSellersModal,
  ProductEngagementSection,
  retailApiClient
} from '@/features/marketplace';
import { BulkTierPricingTable } from '@/portals/wholesale-hub/components/BulkTierPricingTable';
import { RFQModal } from '@/portals/wholesale-hub/components/RFQModal';
import { SampleRequestModal } from '@/portals/wholesale-hub/components/SampleRequestModal';
import { getSellerListingsForMasterProduct } from '@/lib/masterCatalog';
import { SellerListing } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { verifyUniqueUser } from '@/lib/userVerification';
import { ProductDetailsSkeleton } from '@/components/shared/SkeletonLoaders';
import { Plus, Minus, FileText, PackageCheck } from 'lucide-react';
import { MessagingCenterModal } from '@/features/messaging';

interface ProductDetailsLandingProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onOrderPlaced: (order: Order) => void;
  commerceItems: CommerceItem[];
}

export const ProductDetailsLanding: React.FC<ProductDetailsLandingProps> = ({
  currentUser,
  onUpdateUser,
  onOrderPlaced,
  commerceItems,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Simulate data fetch delay to show shimmer skeleton
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [id]);

  const product = useMemo(() => {
    const cachedProduct = commerceItems.find(item => item.id === id);
    const canonicalFallback = INITIAL_COMMERCE_ITEMS.find(item => item.id === id);
    if (!cachedProduct) return canonicalFallback;
    // Local/offline cache may predate canonical catalog fields. Preserve the
    // latest user-facing offer while restoring the master-product linkage.
    return canonicalFallback
      ? { ...canonicalFallback, ...cachedProduct, masterProductId: cachedProduct.masterProductId || canonicalFallback.masterProductId }
      : cachedProduct;
  }, [id, commerceItems]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return commerceItems
      .filter(item => item.category === product.category && item.id !== product.id)
      .slice(0, 4);
  }, [product, commerceItems]);

  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'qna'>('description');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [showConversion, setShowConversion] = useState(false);
  const [guestData, setGuestData] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Cash on Delivery');
  const checkoutRef = useRef<HTMLDivElement>(null);

  // Master Catalog & Multi-Seller States
  const [selectedSeller, setSelectedSeller] = useState<SellerListing | null>(null);
  const [isOtherSellersModalOpen, setIsOtherSellersModalOpen] = useState(false);
  const [rankedSellers, setRankedSellers] = useState<Array<SellerListing & { landedPrice?: number; isBuyBoxWinner?: boolean }>>([]);

  const masterProdId = product?.masterProductId || product?.id;
  const sellerListings = useMemo(() => {
    if (!masterProdId) return [];
    return getSellerListingsForMasterProduct(masterProdId);
  }, [masterProdId]);

  React.useEffect(() => {
    setSelectedSeller(null);
    if (sellerListings.length === 0) {
      setRankedSellers([]);
      return;
    }
    let active = true;
    retailApiClient.rankBuyBoxOffers(sellerListings).then((res) => {
      if (active && res.rankedOffers.length > 0) {
        setRankedSellers(res.rankedOffers);
      }
    });
    return () => {
      active = false;
    };
  }, [sellerListings]);

  const buyBoxWinner = rankedSellers.find((s) => s.isBuyBoxWinner) || rankedSellers[0] || sellerListings[0];

  // Wholesale specific states
  const isWholesaleItem = product?.tradeMode === 'wholesale';
  const moq = product?.minWholesaleQty || 20;
  const [quantity, setQuantity] = useState(isWholesaleItem ? moq : 1);
  const variantOptions = product?.variantOptions || [];
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  // Sync quantity if product changes
  React.useEffect(() => {
    if (product) {
      setQuantity(product.tradeMode === 'wholesale' ? (product.minWholesaleQty || 20) : 1);
      setSelectedVariants(Object.fromEntries((product.variantOptions || []).map((option) => [option.id, option.values[0] || ''])));
    }
  }, [product?.id]);

  const selectedVariantValues = Object.values(selectedVariants).filter(Boolean);
  const selectedVariantKey = selectedVariantValues.join(' · ');
  const selectedVariantLabel = Object.entries(selectedVariants)
    .filter(([, value]) => value)
    .map(([id, value]) => `${variantOptions.find((option) => option.id === id)?.label || id}: ${value}`)
    .join(' · ');
  const selectedVariantOffer = product?.variantOffers?.find((offer) => offer.key === selectedVariantKey);
  const selectedVariantStock = selectedVariantOffer?.stockQuantity;
  const hasVariantMatrix = Boolean(product?.variantOffers?.length);
  const canOrderSelectedVariant = Boolean(product?.inStock) && (!hasVariantMatrix || Boolean(selectedVariantOffer && (selectedVariantStock == null || selectedVariantStock > 0)));

  // Calculate current unit price honoring selected multi-seller offer or wholesale tiers
  const currentUnitPrice = useMemo(() => {
    if (!product) return 0;
    const baseUnit = selectedSeller ? selectedSeller.price : (selectedVariantOffer?.price ?? product.price);
    if (!isWholesaleItem) return baseUnit;
    const tiers = selectedSeller?.wholesaleTiers || product.wholesaleTiers;
    if (tiers && tiers.length > 0) {
      const matchedTier = [...tiers]
        .sort((a, b) => b.minQty - a.minQty)
        .find(t => quantity >= t.minQty);
      if (matchedTier) return matchedTier.pricePerUnit;
    }
    if (quantity >= moq * 5) return Math.round(baseUnit * 0.7);
    if (quantity >= moq * 2) return Math.round(baseUnit * 0.8);
    return Math.round(baseUnit * 0.9);
  }, [product, selectedSeller, selectedVariantOffer, quantity, isWholesaleItem, moq]);

  const totalLotPrice = currentUnitPrice * quantity;
  const deliveryFee = isWholesaleItem
    ? 150
    : totalLotPrice > 2000 || selectedSeller?.deliveryEta?.includes('Same Day')
      ? 0
      : 60;
  const tax = Number((totalLotPrice * 0.05).toFixed(2));
  const finalTotal = Number((totalLotPrice + deliveryFee + tax).toFixed(2));

  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [conversionNotice, setConversionNotice] = useState<string | null>(null);

  // States for registered user quick checkout
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [tempUserDetails, setTempUserDetails] = useState({
    name: currentUser.name,
    phone: currentUser.phone || '',
    address: currentUser.location
  });

  // Gallery Images incorporating seller's real shelf photos if selected
  const gallery = useMemo(() => {
    if (!product) return [];
    const baseGallery = [product.imageUrl, ...(product.galleryImages || [])];
    if (selectedSeller && selectedSeller.sellerRealPhotos && selectedSeller.sellerRealPhotos.length > 0) {
      return [...selectedSeller.sellerRealPhotos, ...baseGallery];
    }
    if (product.sellerRealPhotos && product.sellerRealPhotos.length > 0) {
      return [...baseGallery, ...product.sellerRealPhotos];
    }
    return baseGallery;
  }, [product, selectedSeller]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[var(--pm-muted)] mx-auto" />
        <h2 className="text-xl font-bold text-[var(--pm-text)]">Product Not Found</h2>
        <button onClick={() => navigate(-1)} className="text-[var(--pm-accent)] font-bold cursor-pointer">Go Back</button>
      </div>
    );
  }

  // Product Specs
  const specs = [
    { key: 'Seller', value: selectedSeller?.sellerName || product.storeName },
    ...(product.brand ? [{ key: 'Brand', value: product.brand }] : []),
    { key: 'Category', value: product.category },
    { key: 'Condition', value: product.isUsedItem ? 'Gently Used' : 'Brand New' },
    { key: 'Availability', value: product.inStock ? 'In Stock' : 'Out of Stock' },
    { key: 'Warranty', value: product.warrantyLabel || 'Verified Seller & Escrow Protection' },
    ...Object.entries(product.specifications || {}).map(([key, value]) => ({ key, value })),
  ];

  const handlePlaceOrder = async (data?: any) => {
    if (!canOrderSelectedVariant) {
      setCheckoutError(isBn ? 'এই variant বর্তমানে স্টকে নেই। অন্য variant নির্বাচন করুন।' : 'This variant is out of stock. Select another variant.');
      return;
    }
    const subtotal = totalLotPrice;
    const total = finalTotal;
    const paymentMethod = data?.paymentMethod || selectedPayment;

    // Wallet Balance Check
    if (paymentMethod.includes('Wallet') && currentUser.balance < total) {
      setCheckoutError(`Insufficient Wallet Balance (৳${currentUser.balance.toFixed(2)}). Total is ৳${total.toFixed(2)}.`);
      return;
    }

    setCheckoutError(null);
    setIsProcessing(true);

    const activeStoreId = selectedSeller?.sellerId || product.storeId;
    const activeStoreName = selectedSeller?.sellerName || product.storeName;
    const resolvedAddress = data?.address || tempUserDetails.address || currentUser.location;
    const resolvedBuyerName = data?.name || tempUserDetails.name || currentUser.name;
    const resolvedBuyerPhone = data?.phone || tempUserDetails.phone || '';

    const effectiveProduct: CommerceItem = {
      ...product,
      price: currentUnitPrice,
      storeId: activeStoreId,
      storeName: activeStoreName,
    };

    const cartItem: CartItem = {
      product: effectiveProduct,
      quantity,
      isWholesale: isWholesaleItem,
      selectedVariant: selectedVariantLabel || undefined,
    };

    try {
      const serverRes = await retailApiClient.createServerOrder({
        idempotencyKey: `pdp-${product.id}-${Date.now()}`,
        items: [cartItem],
        subtotal,
        deliveryFee,
        tax,
        deliveryAddress: resolvedAddress,
        paymentMethod,
        estimatedArrival: isWholesaleItem ? '5-7 Days' : (selectedSeller?.deliveryEta || product.deliveryEta || 'Same Day'),
        buyerName: resolvedBuyerName,
        buyerPhone: resolvedBuyerPhone,
        storeId: activeStoreId,
        storeName: activeStoreName,
      });

      const created = serverRes.order;
      const newOrder: Order = {
        id: created.id,
        createdAt: created.createdAt || new Date().toISOString(),
        items: [cartItem],
        subtotal: Number(created.subtotal ?? subtotal),
        deliveryFee: Number(created.deliveryFee ?? deliveryFee),
        tax: Number(created.tax ?? tax),
        total: Number(created.total ?? total),
        status: 'confirmed',
        deliveryAddress: created.deliveryAddress || resolvedAddress,
        paymentMethod: (created.paymentMethod || paymentMethod) as any,
        estimatedArrival: created.estimatedArrival || (isWholesaleItem ? '5-7 Days' : 'Same Day'),
        trackingStep: 1,
        buyerName: resolvedBuyerName,
        buyerPhone: resolvedBuyerPhone,
        storeId: activeStoreId,
        storeName: activeStoreName,
      };

      // Deduct from Wallet if applicable
      if (paymentMethod.includes('Wallet')) {
        onUpdateUser({
          ...currentUser,
          balance: currentUser.balance - newOrder.total,
          transactions: [
            {
              id: `tx_order_${newOrder.id}`,
              type: 'purchase',
              amount: newOrder.total,
              description: `Payment for Order #${newOrder.id} (${product.title})`,
              timestamp: 'Just now',
              status: 'completed',
              referenceId: newOrder.id
            },
            ...(currentUser.transactions || [])
          ]
        });
      }

      setConfirmedOrder(newOrder);
      onOrderPlaced(newOrder);

      const isActuallyGuest = !currentUser.id.startsWith('user_') && !currentUser.isVendor;
      if (isActuallyGuest) {
        setGuestData(data);
        setShowConversion(true);
      }
    } catch (err: any) {
      setCheckoutError(err?.message || 'Unable to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyUser = async (data: any) => {
    return await verifyUniqueUser(data.email, data.phone);
  };

  const isGuest = !currentUser.id.startsWith('user_') && !currentUser.isVendor;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-28 animate-fadeIn px-2 sm:px-4">
      {/* Sleek Sticky Top Nav */}
      <div className="flex items-center justify-between sticky top-14 pm-glass z-30 py-2 -mx-2 px-3 border-b border-[var(--pm-border)]">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} aria-label={isBn ? 'পণ্যের তালিকায় ফিরে যান' : 'Back to product list'} className="p-1.5 rounded-full bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="max-w-[140px] xs:max-w-[200px]">
            <h1 className="text-[13px] font-black text-[var(--pm-text)] truncate leading-tight">
              {product.title}
            </h1>
            <p className="text-[9px] text-[var(--pm-accent)] uppercase font-black tracking-tight">{product.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label={isFavorite ? (isBn ? 'পছন্দের তালিকা থেকে সরান' : 'Remove from saved items') : (isBn ? 'পছন্দের তালিকায় রাখুন' : 'Save product')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${isFavorite ? 'bg-pink-500/15 border-pink-500/30 text-pink-500 shadow-xs' : 'bg-[var(--pm-card)] border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'}`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-500' : ''}`} />
          </button>
          <button aria-label={isBn ? 'পণ্য শেয়ার করুন' : 'Share product'} className="p-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] cursor-pointer">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {confirmedOrder ? (
        <div className="max-w-2xl mx-auto bg-[var(--pm-card)] rounded-[2rem] border border-[var(--pm-border)] shadow-xl overflow-hidden">
          <CheckoutSuccessSummary 
            order={confirmedOrder} 
            onClose={() => navigate('/hub/marketplace')} 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Main Content Column */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Gallery Card */}
            <div className="bg-[var(--pm-card)] rounded-[2rem] border border-[var(--pm-border)] shadow-md overflow-hidden">
              <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden group">
                <img 
                  src={gallery[activeImage] || product.imageUrl} 
                  alt={product.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] text-[9px] font-black uppercase tracking-wider shadow-lg">
                    {product.badge}
                  </div>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="p-3 flex items-center gap-3 overflow-x-auto no-scrollbar bg-[var(--pm-surface)]">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      aria-label={`${isBn ? 'ছবি দেখুন' : 'View image'} ${idx + 1}`}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${activeImage === idx ? 'border-[var(--pm-accent)] scale-95' : 'border-transparent opacity-50'}`}
                    >
                      <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clean Editorial Proof Metadata Bar */}
            <div className="flex flex-wrap items-center gap-2 px-2 text-xs text-[var(--pm-muted)] font-medium">
              <span className="inline-flex items-center gap-1 text-[var(--pm-success)] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isBn ? 'ভেরিফাইড শপ' : 'Verified Merchant'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {product.reviewsCount} {isBn ? 'টি রিভিউ' : 'reviews'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{selectedSeller?.deliveryEta || product.deliveryEta}</span>
            </div>

            {/* Info Tabs Card */}
            <div className="bg-[var(--pm-card)] rounded-[2rem] border border-[var(--pm-border)] shadow-md overflow-hidden">
              <div className="flex border-b border-[var(--pm-border)]">
                {[
                  { id: 'description', label: isBn ? 'তথ্য' : 'Info', icon: Info },
                  { id: 'specs', label: isBn ? 'বিবরণ' : 'Specs', icon: Package },
                  { id: 'reviews', label: isBn ? 'রিভিউ' : 'Reviews', icon: Star },
                  { id: 'qna', label: isBn ? 'প্রশ্নোত্তর' : 'Q&A', icon: HelpCircle }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-3.5 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${activeTab === tab.id ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-inner' : 'text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)]'}`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="p-5 sm:p-6 min-h-[220px]">
                {activeTab === 'description' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-lg font-black text-[var(--pm-text)] leading-tight">
                        {product.title}
                      </h2>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[10px] font-bold text-[var(--pm-accent)] whitespace-nowrap">
                        <MapPin className="w-3 h-3" />
                        {product.proximityDistance || 'Nearby'}
                      </div>
                    </div>
                    
                    <p className="text-xs text-[var(--pm-muted)] leading-relaxed">
                      {product.description}
                    </p>

                    {product.highlights && product.highlights.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {product.highlights.map((highlight) => (
                          <div key={highlight} className="flex items-start gap-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] p-2.5 text-[11px] font-semibold text-[var(--pm-text)]">
                            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--pm-success)]" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-1">
                        <Truck className="w-4 h-4 text-[var(--pm-accent)]" />
                        <h4 className="text-[9px] font-black uppercase text-[var(--pm-muted)]">Delivery</h4>
                        <p className="text-[11px] font-bold text-[var(--pm-text)]">{product.deliveryEta}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-1">
                        <ShieldCheck className="w-4 h-4 text-[var(--pm-success)]" />
                        <h4 className="text-[9px] font-black uppercase text-[var(--pm-muted)]">Secure</h4>
                        <p className="text-[11px] font-bold text-[var(--pm-text)]">Buyer Protection</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-1 gap-1.5">
                      {specs.map((spec, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                          <span className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">{spec.key}</span>
                          <span className="text-[10px] font-black text-[var(--pm-text)]">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(activeTab === 'reviews' || activeTab === 'qna') && (
                  <ProductEngagementSection
                    key={`${product.id}-${activeTab}`}
                    productId={product.id}
                    currentUser={currentUser}
                    isBn={isBn}
                    defaultSubTab={activeTab === 'qna' ? 'qna' : 'reviews'}
                    fallbackRating={product.rating}
                    fallbackReviewsCount={product.reviewsCount}
                  />
                )}
              </div>
            </div>

            {/* Compact Vendor Card linking to unified @handle profile */}
            <div className="p-4 rounded-[1.5rem] bg-[var(--pm-card)] text-[var(--pm-text)] shadow-sm flex items-center gap-4 border border-[var(--pm-border)]">
              <button
                type="button"
                onClick={() => navigate(`/u/${normalizeHandle(selectedSeller?.sellerName || product.storeHandle || product.storeName)}`)}
                className="w-12 h-12 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] flex items-center justify-center font-black text-xl shrink-0 cursor-pointer transition-colors"
              >
                {(selectedSeller?.sellerName || product.storeName)[0]}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => navigate(`/u/${normalizeHandle(selectedSeller?.sellerName || product.storeHandle || product.storeName)}`)}
                    className="text-sm font-black truncate hover:text-[var(--pm-accent)] hover:underline cursor-pointer text-left"
                  >
                    {selectedSeller?.sellerName || product.storeName}
                  </button>
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--pm-accent)] shrink-0" />
                </div>
                <p className="text-[10px] text-[var(--pm-muted)] truncate font-medium">
                  {formatDisplayHandle(selectedSeller?.sellerName || product.storeHandle || product.storeName)} · ★ {selectedSeller?.sellerRating || product.rating} · {selectedSeller?.location || 'Verified Hub'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/u/${normalizeHandle(selectedSeller?.sellerName || product.storeHandle || product.storeName)}`)}
                className="px-3 py-2 rounded-xl bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] hover:bg-[var(--pm-accent)] text-[var(--pm-accent)] hover:text-[var(--pm-accent-fg)] text-[10px] font-bold transition-colors shrink-0 cursor-pointer"
              >
                Visit Shop
              </button>
              <button 
                onClick={() => setIsMessagingOpen(true)}
                title="Message Vendor"
                className="p-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)] transition-colors shrink-0 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>

            {/* Other Sellers Comparison Card (Buy Box) */}
            {sellerListings.length > 0 && (
              <div className="p-4 rounded-[1.5rem] bg-[var(--pm-card)] border border-[var(--pm-accent-border)] shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-black uppercase text-[var(--pm-accent)] tracking-wider">Buy Box · Multi-Seller</span>
                    <h4 className="text-xs font-bold text-[var(--pm-text)]">
                      {sellerListings.length} verified sellers offering this item
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOtherSellersModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-[10px] font-black uppercase transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    Compare Offers ({sellerListings.length})
                  </button>
                </div>
                <div className="space-y-1.5 pt-1">
                  {(rankedSellers.length > 0 ? rankedSellers : sellerListings).slice(0, 3).map((seller) => {
                    const isSelected = selectedSeller?.id === seller.id || (!selectedSeller && buyBoxWinner?.id === seller.id);
                    return (
                      <div
                        key={seller.id}
                        className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 ${isSelected ? 'border-[var(--pm-accent)]/50 bg-[var(--pm-accent-soft)]' : 'border-[var(--pm-border)] bg-[var(--pm-surface)]'}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[10px] font-bold text-[var(--pm-text)]">{seller.sellerName}</p>
                          <p className="truncate text-[9px] text-[var(--pm-muted)]">
                            ★ {seller.sellerRating.toFixed(1)} · {seller.deliveryEta} · {seller.location}
                          </p>
                        </div>
                        <span className="shrink-0 text-[11px] font-black text-[var(--pm-accent)]">৳{seller.price.toLocaleString()}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedSeller(seller)}
                          aria-label={`Select ${seller.sellerName}`}
                          className={`shrink-0 rounded-lg px-2 py-1 text-[9px] font-black ${isSelected ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]' : 'border border-[var(--pm-border-strong)] text-[var(--pm-muted)] hover:border-[var(--pm-accent)] hover:text-[var(--pm-accent)]'}`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Simplified Recommendations */}
            {relatedProducts.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-black text-[var(--pm-text)] px-1">Similar Items</h3>
                <div className="grid grid-cols-2 xs:grid-cols-4 gap-3">
                  {relatedProducts.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveImage(0);
                        navigate(`/hub/marketplace/product/${item.id}`);
                        window.scrollTo(0, 0);
                      }}
                      className="group bg-[var(--pm-card)] rounded-2xl border border-[var(--pm-border)] p-1.5 space-y-2 hover:border-[var(--pm-accent)]/50 hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-[var(--pm-surface)]">
                        <img src={item.imageUrl} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 duration-300" />
                      </div>
                      <div className="px-1 pb-1">
                        <h4 className="text-[10px] font-bold text-[var(--pm-text)] truncate">{item.title}</h4>
                        <p className="text-[11px] font-black text-[var(--pm-accent)]">৳{item.price.toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Mini Checkout Side (5 cols) */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            
            {/* Merchant Quick Edit */}
            {currentUser.isVendor && currentUser.vendorProfile?.id === product.storeId && (
              <div className="p-3.5 rounded-2xl bg-[var(--pm-warning-soft)] border border-[var(--pm-warning)]/25 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--pm-warning)]" />
                  <span className="text-[10px] font-black text-[var(--pm-warning)] uppercase tracking-tight">Admin Control</span>
                </div>
                <button 
                  onClick={() => navigate(`/portal/seller?edit=${product.id}`)}
                  className="px-3 py-1 rounded-lg bg-[var(--pm-warning)] text-white text-[9px] font-black uppercase shadow-sm cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}

            {/* Compact Pricing & Checkout Card */}
            <div ref={checkoutRef} className="scroll-mt-24 bg-[var(--pm-card)] rounded-[2rem] border border-[var(--pm-border)] shadow-xl p-5 sm:p-6 space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-[var(--pm-muted)] uppercase tracking-widest">
                      {isWholesaleItem ? 'Wholesale Unit Rate' : 'Retail Price'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-mono font-black text-[var(--pm-accent)] leading-none">৳{currentUnitPrice.toLocaleString()}</p>
                      {isWholesaleItem && <span className="text-[10px] text-[var(--pm-muted)] font-bold">/ unit</span>}
                    </div>
                  </div>
                  {isWholesaleItem && (
                    <div className="px-2 py-1 rounded-lg bg-[var(--pm-success)] text-white text-[9px] font-black uppercase shadow-sm flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Factory Rate
                    </div>
                  )}
                </div>

                {/* Wholesale Tiered Pricing Table */}
                {isWholesaleItem && (
                  <div className="animate-fade-in">
                    <BulkTierPricingTable
                      basePrice={product.price}
                      tiers={product.wholesaleTiers}
                      selectedQuantity={quantity}
                      minWholesaleQty={moq}
                      onSelectTier={(qty) => setQuantity(qty)}
                    />
                  </div>
                )}

                {variantOptions.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {variantOptions.map((option) => (
                      <label key={option.id} className="space-y-1">
                        <span className="block px-1 text-[9px] font-black uppercase tracking-wide text-[var(--pm-muted)]">{option.label}</span>
                        <select
                          aria-label={`Select ${option.label}`}
                          value={selectedVariants[option.id] || option.values[0] || ''}
                          onChange={(event) => setSelectedVariants((current) => ({ ...current, [option.id]: event.target.value }))}
                          className="w-full rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] px-3 py-2.5 text-xs font-bold text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                        >
                          {option.values.map((value) => <option key={value} value={value}>{value}</option>)}
                        </select>
                        {selectedVariantOffer && option.id === variantOptions[variantOptions.length - 1]?.id && (
                          <span className={`block px-1 text-[9px] font-semibold ${canOrderSelectedVariant ? 'text-[var(--pm-success)]' : 'text-[var(--pm-danger)]'}`}>
                            {canOrderSelectedVariant
                              ? `${selectedVariantStock} in stock · ${selectedVariantOffer.sku}`
                              : (selectedVariantOffer ? 'Out of stock' : 'Combination unavailable')}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                {/* Quantity Selector & Live Total */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-[var(--pm-muted)] uppercase block px-1">Quantity</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={isBn ? 'পরিমাণ কমান' : 'Decrease quantity'}
                        onClick={() => setQuantity(prev => Math.max(isWholesaleItem ? moq : 1, prev - (isWholesaleItem ? 10 : 1)))}
                        className="w-8 h-8 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-center text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] disabled:opacity-40 transition-all shadow-xs cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-black text-[var(--pm-text)] font-mono">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={isBn ? 'পরিমাণ বাড়ান' : 'Increase quantity'}
                        onClick={() => setQuantity(prev => prev + (isWholesaleItem ? 10 : 1))}
                        className="w-8 h-8 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-center text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="text-[9px] font-bold text-[var(--pm-muted)] uppercase block">Total Lot Value</span>
                    <p className="text-lg font-mono font-black text-[var(--pm-text)]">৳{totalLotPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* B2B Negotiation Actions */}
                {isWholesaleItem && (
                  <div className="grid grid-cols-2 gap-2 pb-2">
                    <button
                      onClick={() => setIsRFQModalOpen(true)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-[var(--pm-border)] hover:border-[var(--pm-success)] text-[var(--pm-text)] text-[10px] font-black uppercase transition-all cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-[var(--pm-success)]" />
                      Get Quote
                    </button>
                    <button
                      onClick={() => setIsSampleModalOpen(true)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-[var(--pm-border)] hover:border-[var(--pm-accent)] text-[var(--pm-text)] text-[10px] font-black uppercase transition-all cursor-pointer"
                    >
                      <PackageCheck className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                      Request Sample
                    </button>
                  </div>
                )}
              </div>

              {isGuest ? (
                <div className="space-y-4">
                  <div className="px-3 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-center">
                    <p className="text-[9px] text-[var(--pm-muted)] font-bold uppercase tracking-tight">Secure Checkout</p>
                  </div>
                  <GuestCheckoutForm 
                    onVerify={handleVerifyUser} 
                    onComplete={(data) => handlePlaceOrder(data)} 
                    disabled={!canOrderSelectedVariant}
                    disabledMessage={selectedVariantOffer ? 'Variant out of stock' : 'Variant unavailable'}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Point Counter */}
                  <div className="flex items-center justify-between bg-[var(--pm-success-soft)] px-3 py-2 rounded-xl border border-[var(--pm-success)]/25">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[var(--pm-success)]" />
                      <span className="text-[10px] font-black text-[var(--pm-success)] uppercase">Loyalty Reward</span>
                    </div>
                    <span className="text-[11px] font-black text-[var(--pm-success)]">+{Math.floor(product.price * 0.05)} Pts</span>
                  </div>

                  {!isEditingDetails ? (
                    <div className="space-y-2">
                      <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[9px] font-bold text-[var(--pm-muted)] uppercase block mb-0.5">Address</span>
                            <p className="text-[11px] font-bold text-[var(--pm-text)] truncate">
                              {tempUserDetails.address || currentUser.location}
                            </p>
                          </div>
                          <button 
                            onClick={() => setIsEditingDetails(true)} 
                            className="p-1.5 rounded-lg bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] text-[9px] font-black uppercase cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-[var(--pm-border)]">
                          <p className="text-[10px] font-bold text-[var(--pm-text)] truncate max-w-[100px]">
                            {tempUserDetails.name || currentUser.name}
                          </p>
                          <p className="text-[10px] font-mono font-bold text-[var(--pm-muted)]">
                            {tempUserDetails.phone || (isBn ? 'ফোন নম্বর যোগ করুন' : 'Add phone number')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 p-4 rounded-2xl border border-[var(--pm-accent-border)] bg-[var(--pm-accent-soft)]">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-[var(--pm-muted)] uppercase">Name</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 rounded-lg bg-[var(--pm-input)] text-[11px] font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]" 
                            value={tempUserDetails.name}
                            onChange={e => setTempUserDetails({...tempUserDetails, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-[var(--pm-muted)] uppercase">Phone</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 rounded-lg bg-[var(--pm-input)] text-[11px] font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)]" 
                            value={tempUserDetails.phone}
                            onChange={e => setTempUserDetails({...tempUserDetails, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[var(--pm-muted)] uppercase">Full Address</label>
                        <textarea 
                          className="w-full px-3 py-2 rounded-lg bg-[var(--pm-input)] text-[11px] font-bold text-[var(--pm-text)] border border-[var(--pm-border)] outline-none focus:border-[var(--pm-accent)] resize-none" 
                          rows={2}
                          value={tempUserDetails.address}
                          onChange={e => setTempUserDetails({...tempUserDetails, address: e.target.value})}
                        />
                      </div>
                      <button 
                        onClick={() => setIsEditingDetails(false)} 
                        className="w-full py-2 rounded-lg bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] text-[10px] font-black uppercase cursor-pointer"
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-[var(--pm-muted)] tracking-wider px-1">Payment</label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Clock },
                        { id: 'Wallet Balance', label: 'Wallet Balance', sub: `৳${currentUser.balance.toFixed(0)}`, icon: CreditCard },
                        { id: 'MFS Payment', label: 'bKash / Nagad', sub: 'Mobile wallet', icon: Smartphone }
                      ].map(method => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${selectedPayment === method.id ? 'bg-[var(--pm-accent)] border-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-sm' : 'bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-text)] hover:border-[var(--pm-accent)]/40'}`}
                        >
                          <div className="flex items-center gap-2">
                            <method.icon className={`w-3.5 h-3.5 ${selectedPayment === method.id ? 'text-[var(--pm-accent-fg)]' : 'text-[var(--pm-accent)]'}`} />
                            <div className="text-left">
                              <p className="text-[10px] font-black uppercase leading-tight">{method.label}</p>
                              {method.sub && <p className={`text-[8px] font-bold ${selectedPayment === method.id ? 'opacity-85' : 'text-[var(--pm-muted)]'}`}>{method.sub}</p>}
                            </div>
                          </div>
                          {selectedPayment === method.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--pm-border)] space-y-3">
                    <div className="space-y-1 text-xs text-[var(--pm-muted)]">
                      <div className="flex items-center justify-between px-1">
                        <span>Delivery ({selectedSeller?.deliveryEta || product.deliveryEta})</span>
                        <span className="font-mono tabular-nums text-[var(--pm-text)]">
                          {deliveryFee === 0 ? 'FREE' : `৳${deliveryFee.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-1">
                        <span>VAT / Tax (5%)</span>
                        <span className="font-mono tabular-nums text-[var(--pm-text)]">৳{tax.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between px-1 pt-1">
                        <span className="text-xs font-bold text-[var(--pm-muted)]">Total</span>
                        <span className="text-lg font-mono tabular-nums font-black text-[var(--pm-text)]">
                          ৳{finalTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {checkoutError && (
                      <div className="p-2.5 rounded-xl bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-[var(--pm-danger)] text-xs font-bold text-center">
                        {checkoutError}
                      </div>
                    )}

                    <button 
                      type="button"
                      disabled={isProcessing || isEditingDetails || !canOrderSelectedVariant}
                      onClick={() => handlePlaceOrder({ ...tempUserDetails, paymentMethod: selectedPayment })}
                      className="w-full py-3.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-black uppercase tracking-widest text-[11px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessing ? (
                        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>{canOrderSelectedVariant ? 'Buy Now' : 'Out of Stock'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {conversionNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[var(--pm-success)] text-white shadow-2xl font-bold text-xs flex items-center gap-2 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{conversionNotice}</span>
          <button onClick={() => setConversionNotice(null)} className="ml-2 font-black text-sm cursor-pointer">×</button>
        </div>
      )}

      <AccountConversionPopup 
        isOpen={showConversion} 
        onClose={() => setShowConversion(false)} 
        onConvert={(pwd) => {
          console.log('Account converted with password:', pwd);
          setConversionNotice(`Account created successfully for ${guestData?.email || guestData?.phone}!`);
          setGuestData(null);
        }}
        guestEmail={guestData?.email}
        guestPhone={guestData?.phone}
      />

      <RFQModal
        product={product}
        isOpen={isRFQModalOpen}
        onClose={() => setIsRFQModalOpen(false)}
        onSubmitRFQ={(rfq) => {
          setConversionNotice(`RFQ request for ${rfq.targetQuantity} units sent to manufacturer.`);
          setTimeout(() => setConversionNotice(null), 5000);
        }}
      />

      <SampleRequestModal
        product={product}
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSubmitSample={(sample) => {
          setConversionNotice(`Sample request submitted for inspection.`);
          setTimeout(() => setConversionNotice(null), 5000);
        }}
      />

      <OtherSellersModal
        isOpen={isOtherSellersModalOpen}
        onClose={() => setIsOtherSellersModalOpen(false)}
        productTitle={product.title}
        sellerListings={sellerListings}
        currentSellerId={selectedSeller?.id}
        onSelectSellerListing={(seller: SellerListing) => {
          setSelectedSeller(seller);
          setIsOtherSellersModalOpen(false);
          setConversionNotice(`Selected offer from ${seller.sellerName} (৳${seller.price.toLocaleString()})`);
          setTimeout(() => setConversionNotice(null), 4000);
        }}
      />

      <MessagingCenterModal
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        initialProductContext={{
          id: product.id,
          title: product.title,
          price: currentUnitPrice,
          imageUrl: product.imageUrl,
          isWholesale: isWholesaleItem
        }}
        initialVendorName={selectedSeller?.sellerName || product.storeName}
      />
    </div>
  );
};
