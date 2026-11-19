import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Star, ShieldCheck, Truck, Store as StoreIcon, CheckCircle2, 
  Heart, Plus, Minus, ShoppingCart, ArrowLeft,
  Sparkles, MessageSquare, Calendar, Clock, Lock, Key, Download, ShieldAlert,
  Copy, Check, Package, Zap, ChevronLeft, ChevronRight, Maximize2, X
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { ProductReviews } from "@/components/reviews/ProductReviews";
import { useCartStore } from "@/modules/cart";
import { toast } from "sonner";
import { mockProducts } from "@/lib/workspace-stub";
import { 
  ECOMMERCE_PRODUCTS, 
  MultiSellerOffersSection, 
  LinkInventoryModal, 
  type SellerProductOffer 
} from "@/modules/product";
import { ChatModal } from "@/modules/chat";
import { safeBack } from "@/lib/navigation";
import { catalogService, MasterProduct, SellerOffer } from "@/modules/product/services/catalogService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/core/lib/firebase";

export default function ProductDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [masterProduct, setMasterProduct] = useState<MasterProduct | null>(null);
  const [offers, setOffers] = useState<SellerOffer[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);

  // Fetch Master Catalog Data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!id) return;
      setIsCatalogLoading(true);
      try {
        const master = await catalogService.getMasterProduct(id);
        if (master) {
          const productOffers = await catalogService.getOffersForProduct(id);
          if (isMounted) {
            setMasterProduct(master);
            setOffers(productOffers);
            setIsCatalogLoading(false);
          }
        } else {
          // Fallback to mock data if not in Firestore (or migration hasn't run)
          const mock = ECOMMERCE_PRODUCTS.find(p => p.id === id || p.asin === id);
          if (mock && isMounted) {
             // Map mock to MasterProduct/SellerOffer shape for UI compatibility
             setMasterProduct({
               pmin: mock.asin || `PMIN-${mock.id}`,
               name: mock.name,
               description: mock.description || '',
               category: mock.category,
               brand: (mock as any).brand || 'PaikarMart',
               images: mock.images || [mock.image],
               createdBy: 'system',
               createdAt: null
             });
             setOffers([{
               id: 'off-mock',
               pmin: mock.asin || `PMIN-${mock.id}`,
               sellerId: 'store-1',
               sellerName: mock.sellerName,
               sellerRating: mock.rating || 5,
               sellerReviewCount: mock.reviewCount || 10,
               sellerLocation: mock.sellerLocation,
               sellerVerified: mock.isVerified ?? true,
               sellerSku: 'MOCK-SKU',
               condition: "New",
               price: mock.price,
               originalPrice: mock.originalPrice,
               discount: mock.discount,
               stock: mock.stock,
               moq: mock.moq || 1,
               unit: mock.unit || 'pcs',
               fulfillmentType: "paikar_express",
               shippingFee: 0,
               dispatchTimeDays: 1,
               isBuyBoxWinner: true,
               isActive: true,
               createdAt: null
             } as any]);
             setIsCatalogLoading(false);
          }
        }
      } catch (err) {
        console.error("Error loading product detail from Firestore:", err);
        setIsCatalogLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [id]);

  const buyBoxWinner = useMemo(() => offers.find((o) => o.isBuyBoxWinner) || offers[0] || null, [offers]);
  const activeOffer = useMemo(() => offers.find((o) => o.id === selectedOfferId) || buyBoxWinner, [offers, selectedOfferId, buyBoxWinner]);

  const isOutOfStock = useMemo(() => !activeOffer || activeOffer.stock <= 0, [activeOffer]);

  // Sourcing Mode Classification (Legacy matched logic replacement)
  const isServiceItem = useMemo(() => masterProduct?.category === 'services', [masterProduct]);
  const isDigitalItem = useMemo(() => masterProduct?.category === 'digital', [masterProduct]);
  const isWholesaleItem = useMemo(() => masterProduct?.category === 'wholesale', [masterProduct]);

  // ASIN/PMIN display
  const pmin = masterProduct?.pmin || id || "PMIN-UNKNOWN";

  // Buy Box calculation function
  const recalculateOffers = (list: SellerOffer[]) => {
    let bestId: string | null = null;
    let maxScore = -999999;
    list.forEach((o) => {
      if (!o.isActive || o.stock <= 0) return;
      const landed = o.price + (o.shippingFee || 0);
      const score = (1000 - landed * 0.5) + (o.fulfillmentType === "paikar_express" ? 60 : 0) + (o.sellerRating * 15) - ((o.dispatchTimeDays - 1) * 12);
      if (score > maxScore) {
        maxScore = score;
        bestId = o.id;
      }
    });
    return list.map((o) => ({
      ...o,
      isBuyBoxWinner: o.id === bestId,
    }));
  };

  const [copiedAsin, setCopiedAsin] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isAutoSlideActive, setIsAutoSlideActive] = useState(true);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Medium (40)");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [bookingDate, setBookingDate] = useState("আজকে (Today)");
  const [bookingSlot, setBookingSlot] = useState("সকাল ১০:০০ - দুপুর ১২:০০");
  const [licenseType, setLicenseType] = useState("সিঙ্গেল লাইসেন্স (Personal Keys)");

  const handleCopyAsin = () => {
    navigator.clipboard?.writeText(pmin);
    setCopiedAsin(true);
    toast.success(`PMIN কপি করা হয়েছে: ${pmin}`);
    setTimeout(() => setCopiedAsin(false), 2000);
  };

  const handleOfferLinked = (newOffer: any) => {
    const updated = recalculateOffers([newOffer, ...offers]);
    setOffers(updated as SellerOffer[]);
    setSelectedOfferId(newOffer.id);
  };

  const handleUpdateOffer = (offerId: string, updates: Partial<SellerProductOffer>) => {
    const nextList = offers.map((o) => (o.id === offerId ? { ...o, ...updates } : o));
    setOffers(recalculateOffers(nextList));
  };

  // Dynamic product mapping reading from the active winning offer
  const product = {
    id: id || "prod-101",
    pmin,
    asin: pmin,
    brand: masterProduct?.brand || "Apex Apparel BD",
    barcode: (masterProduct as any)?.barcode || "8941123456789",
    title: masterProduct?.name || "Premium Combed Cotton Crewneck T-Shirt (Export Quality)",
    description: masterProduct?.description || "Experience breathable comfort with 100% combed ringspun cotton fabric (180 GSM). Specially crafted for Bangladesh's subtropical climate with reactive dye, anti-pilling wash, and double-stitched reinforced collar. Master catalog item supporting multiple verified vendor listings.",
    price: activeOffer?.price || 0,
    originalPrice: activeOffer?.originalPrice || Math.round((activeOffer?.price || 450) * 1.35),
    wholesalePrice: isWholesaleItem ? Math.round((activeOffer?.price || 450) * 0.75) : 220,
    moq: activeOffer?.moq || 1,
    rating: activeOffer?.sellerRating || 4.8,
    reviews: activeOffer?.sellerReviewCount || 124,
    sold: 1542,
    images: masterProduct?.images && masterProduct.images.length > 0 
      ? masterProduct.images 
      : [
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"
        ],
    variants: activeOffer?.variants || ["Small (38)", "Medium (40)", "Large (42)", "XL (44)", "XXL (46)"],
    colors: activeOffer?.colors || ["Black", "Navy Blue", "Heather Grey", "Olive Green"],
    seller: {
      id: activeOffer?.sellerId || "store-1",
      name: activeOffer?.sellerName || "PaikarMart Elite Partner",
      rating: activeOffer?.sellerRating || 4.9,
      verified: activeOffer?.sellerVerified ?? true,
      joinDate: "2021",
      location: activeOffer?.sellerLocation || "চকবাজার পাইকারি মার্কেট, ঢাকা",
      responseRate: "98%",
      fulfillmentType: (activeOffer as any)?.fulfillmentType || "paikar_express",
      shippingFee: (activeOffer as any)?.shippingFee || 50,
      condition: (activeOffer as any)?.condition || "New",
      stock: activeOffer?.stock || 85,
    }
  };

  const handleNextSlide = () => {
    setSlideDirection(1);
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevSlide = () => {
    setSlideDirection(-1);
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  // Auto-slide images every 3.5 seconds
  useEffect(() => {
    if (!isAutoSlideActive || isLightboxOpen || !product.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setSlideDirection(1);
      setActiveImageIndex((prev) => (prev + 1) % product.images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoSlideActive, isLightboxOpen, product.images]);

  const handleAddToCart = () => {
    let finalTitle = product.title;
    if (isServiceItem) {
      finalTitle = `${product.title} (বুকিং: ${bookingDate}, স্লট: ${bookingSlot})`;
    } else if (isDigitalItem) {
      finalTitle = `${product.title} (${licenseType})`;
    } else {
      finalTitle = `${product.title} (${selectedSize}, ${selectedColor})`;
    }

    addItem({
      id: product.id,
      name: product.title,
      title: finalTitle,
      price: product.price,
      image: product.images[0],
      store: product.seller.name,
      vendorName: product.seller.name,
      sellerId: product.seller.id,
      quantity: quantity,
      portal: isWholesaleItem ? 'wholesale' : isServiceItem ? 'service' : isDigitalItem ? 'digital' : 'retail'
    });
    toast.success(`কার্টে যোগ করা হয়েছে: ${quantity}x ${product.title}`);
  };

  const handleBuyNow = () => {
    let checkoutType: any = 'retail';
    let finalTitle = product.title;

    if (isServiceItem) {
      checkoutType = 'service';
      finalTitle = `${product.title} (বুকিং: ${bookingDate}, স্লট: ${bookingSlot})`;
    } else if (isDigitalItem) {
      checkoutType = 'digital';
      finalTitle = `${product.title} (${licenseType})`;
    } else if (isWholesaleItem) {
      checkoutType = 'wholesale';
    }

    // Direct redirection to universal checkout passing state
    navigate("/checkout", { 
      state: { 
        checkoutType,
        items: [{
          id: product.id,
          name: finalTitle,
          price: product.price,
          image: product.images[0],
          quantity: quantity,
          vendorName: product.seller.name
        }],
        subtotal: product.price * quantity
      } 
    });
    toast.info('ইউনিভার্সাল পেমেন্ট টার্মিনালে রিডাইরেক্ট করা হচ্ছে...');
  };

  return (
    <div className="w-full max-w-[1440px] px-2 sm:px-4 md:px-6 py-3 mx-auto min-h-screen text-white pb-32 space-y-4">
      
      {/* Back Button */}
      <button 
        onClick={() => safeBack(navigate, '/')} 
        className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white mb-1 transition-colors cursor-pointer"
        title="ফিরে যান"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> আগের পৃষ্ঠায় ফিরুন
      </button>

      {/* Main Details Section - Wide, Slim Border, Streamlined */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 bg-[var(--pm-surface)]/80 p-3.5 sm:p-5 md:p-6 rounded-2xl border border-white/5 shadow-sm items-start">
        
        {/* LEFT: Gallery Slider (col-span-5) */}
        <div 
          className="lg:col-span-5 flex flex-col gap-3"
          onMouseEnter={() => setIsAutoSlideActive(false)}
          onMouseLeave={() => setIsAutoSlideActive(true)}
        >
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-black/50 border border-white/10 relative group select-none">
            {/* Animated Slide Image */}
            <AnimatePresence initial={false} mode="wait" custom={slideDirection}>
              <motion.img 
                key={activeImageIndex}
                src={product.images[activeImageIndex]} 
                alt={product.title}
                custom={slideDirection}
                initial={{ opacity: 0, x: slideDirection > 0 ? 100 : slideDirection < 0 ? -100 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDirection > 0 ? -100 : slideDirection < 0 ? 100 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-full h-full object-cover cursor-zoom-in" 
                onClick={() => setIsLightboxOpen(true)}
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
              {isWholesaleItem && (
                <span className="bg-indigo-600/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-md">
                  B2B Bulk Lot · MOQ {product.moq} pcs
                </span>
              )}
              {isServiceItem && (
                <span className="bg-purple-600/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-md">
                  On-Demand Service Booking
                </span>
              )}
              {isDigitalItem && (
                <span className="bg-violet-600/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-md">
                  Instant Key Delivery
                </span>
              )}
            </div>

            {/* Zoom Button */}
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer hover:bg-black/80"
              title="জুুম করে দেখুন"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Previous & Next Slide Arrow Buttons */}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handlePrevSlide(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 hover:bg-[var(--pm-accent)] transition-all cursor-pointer shadow-lg active:scale-90"
                  title="আগের ছবি"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleNextSlide(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 hover:bg-[var(--pm-accent)] transition-all cursor-pointer shadow-lg active:scale-90"
                  title="পরের ছবি"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Slide Index Counter */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 right-3 z-10 px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-bold border border-white/10">
                {activeImageIndex + 1} / {product.images.length}
              </div>
            )}

            {/* Slide Indicator Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideDirection(idx > activeImageIndex ? 1 : -1);
                      setActiveImageIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeImageIndex === idx ? "w-4 bg-[var(--pm-accent)]" : "w-1.5 bg-white/40 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails Rail */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSlideDirection(i > activeImageIndex ? 1 : -1);
                    setActiveImageIndex(i);
                  }}
                  className={`aspect-square w-14 rounded-lg bg-black/40 border overflow-hidden shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === i ? "border-[var(--pm-accent)] ring-2 ring-[var(--pm-accent)]/30 scale-95 shadow-md" : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Specs & Action Controls (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-5">
          <div className="space-y-3.5">
            
            {/* Tag headers & Amazon ASIN Catalog Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {isServiceItem ? 'ভেরিফাইড স্লট সচল' : isDigitalItem ? 'অটো ডিসপ্যাচ লাইভ' : 'In Stock & Dispatch Ready'}
              </span>

              {/* Unique ASIN Badge with copy button */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md text-xs">
                <Package className="w-3 h-3 text-[var(--pm-accent)]" />
                <span className="text-[10px] font-mono font-bold text-white">PMIN: {pmin}</span>
                <button
                  type="button"
                  onClick={handleCopyAsin}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer ml-0.5"
                  title="PMIN কোড কপি করুন"
                >
                  {copiedAsin ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {product.brand && (
                <span className="text-[9px] font-bold text-zinc-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                  ব্র্যান্ড: <strong className="text-white">{product.brand}</strong>
                </span>
              )}

              {/* Seller Quick Action CTA */}
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(true)}
                className="text-[9px] font-black text-[var(--pm-accent)] hover:text-white bg-[var(--pm-accent)]/10 hover:bg-[var(--pm-accent)] border border-[var(--pm-accent)]/30 px-2.5 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1"
              >
                <span>+ স্টক লিঙ্ক করুন</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-2xl font-black text-white leading-tight">
              {product.title}
            </h1>
            
            {/* Reviews count & ASIN barcode */}
            <div className="flex items-center gap-3 flex-wrap text-xs select-none">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                </div>
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-zinc-400">({product.reviews} রিভিউ)</span>
              </div>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">{product.sold} টি ডেলিভারি সম্পন্ন</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-500 font-mono text-[10px]">EAN: {product.barcode}</span>
            </div>

            {/* Central Price Display & Buy Box Panel - Clean Slim Container */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-black/30 border border-white/5 select-none text-left">
              <div className="flex items-baseline gap-3">
                {isOutOfStock ? (
                  <span className="text-2xl sm:text-3xl font-black text-rose-500">
                    বর্তমানে স্টক আউট (Out of Stock)
                  </span>
                ) : (
                  <>
                    <span className="text-2xl sm:text-3xl font-black text-[var(--pm-accent)]">
                      ৳ {product.price.toLocaleString('bn-BD')} BDT
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-zinc-500 line-through">
                        ৳ {product.originalPrice.toLocaleString('bn-BD')}
                      </span>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% ছাড়
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Winning Offer / Buy Box Note */}
              {!isOutOfStock && activeOffer && (
                <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-zinc-400">বিক্রেতা (Featured):</span>
                    <Link
                      to={`/store/${product.seller?.id || 'store-1'}`}
                      className="font-bold text-white hover:text-[var(--pm-accent)] hover:underline transition-colors inline-flex items-center gap-1 cursor-pointer text-xs"
                      title={`${product.seller?.name} এর দোকান ভিজিট করুন`}
                    >
                      {product.seller.name} <StoreIcon className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                    </Link>
                    <Link
                      to={`/store/${product.seller?.id || 'store-1'}`}
                      className="text-[10px] font-black text-[var(--pm-accent)] hover:underline bg-[var(--pm-accent)]/10 px-2 py-0.5 rounded border border-[var(--pm-accent)]/20 transition-all cursor-pointer ml-1"
                    >
                      দোকান ভিজিট করুন →
                    </Link>
                    {product.seller.fulfillmentType === "paikar_express" ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-[var(--pm-accent)] bg-[var(--pm-accent)]/10 px-2 py-0.5 rounded border border-[var(--pm-accent)]/20">
                        <Zap className="w-2.5 h-2.5" /> Paikar Express
                      </span>
                    ) : (
                      <span className="text-[9px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                        মার্চেন্ট শিপিং
                      </span>
                    )}
                  </div>

                  <a
                    href="#multi-seller-offers"
                    className="text-xs font-black text-[var(--pm-accent)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    অন্যান্য বিক্রেতা ({offers.length} অফার) ৳{Math.min(...offers.map((o) => o.price))} থেকে ↓
                  </a>
                </div>
              )}

              {isWholesaleItem && (
                <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs font-bold text-zinc-400">
                  <span>বাল্ক ভ্যালু ডিসকাউন্ট (MOQ {product.moq}+):</span>
                  <span className="text-emerald-400 font-black">
                    ৳ {Math.round(product.price * 0.95)} / পিস (৳ {Math.round(product.price * 0.95 * quantity).toLocaleString('bn-BD')} লট)
                  </span>
                </div>
              )}
            </div>

            {/* DYNAMIC MODE CONFIGURATION SELECTOR FIELDS */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              
              {/* IF: SERVICE BOOKING PANEL */}
              {isServiceItem && (
                <div className="space-y-3 text-left">
                  {/* Scheduling date */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">সার্ভিস বুকিং তারিখ নির্ধারণ:</h3>
                    <div className="flex gap-2 flex-wrap select-none">
                      {["আজকে (Today)", "আগামীকাল (Tomorrow)", "পরশু (Day After)"].map((d) => (
                        <button 
                          key={d} 
                          type="button"
                          onClick={() => setBookingDate(d)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer outline-none ${
                            bookingDate === d 
                              ? "bg-purple-600 text-white border-transparent shadow-md scale-[1.02]" 
                              : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scheduling timeslots */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">উপযুক্ত সময় নির্বাচন:</h3>
                    <div className="flex gap-2 flex-wrap select-none">
                      {["সকাল ১০:০০ - দুপুর ১২:০০", "দুপুর ১২:০০ - বিকাল ৩:০০", "বিকাল ৪:০০ - সন্ধ্যা ৬:০০"].map((slot) => (
                        <button 
                          key={slot} 
                          type="button"
                          onClick={() => setBookingSlot(slot)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer outline-none ${
                            bookingSlot === slot 
                              ? "bg-purple-600 text-white border-transparent shadow-md scale-[1.02]" 
                              : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-[10px] text-purple-300 leading-relaxed font-semibold">
                    🛡️ এসক্রো প্রটেকশন সচল: সার্ভিস বুকিং ভ্যালু এসক্রো করা থাকবে। কাজ সম্পূর্ণ হওয়ার পর কোয়ালিটি যাচাই করে রিলিজ নিশ্চিত করবেন।
                  </div>
                </div>
              )}

              {/* IF: DIGITAL LICENSE PANEL */}
              {isDigitalItem && (
                <div className="space-y-3 text-left">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">লাইসেন্স টাইপ নির্বাচন করুন:</h3>
                    <div className="flex gap-2 flex-wrap select-none">
                      {["সিঙ্গেল লাইসেন্স (Personal Keys)", "আনলিমিটেড ডেভেলপার প্যাক (Unlimited)"].map((lic) => (
                        <button 
                          key={lic} 
                          type="button"
                          onClick={() => setLicenseType(lic)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer outline-none ${
                            licenseType === lic 
                              ? "bg-violet-600 text-white border-transparent shadow-md scale-[1.02]" 
                              : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20"
                          }`}
                        >
                          {lic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 bg-violet-500/10 rounded-xl border border-violet-500/20 text-[10px] text-violet-300 leading-relaxed font-semibold flex items-start gap-2">
                    <Key className="w-4 h-4 shrink-0 text-violet-400 mt-0.5" />
                    <p>পেমেন্ট সম্পন্ন হওয়ার পর আপনার নিবন্ধিত ইমেইলে সোর্স কোড/লাইসেন্স কী তাৎক্ষণিকভাবে স্বয়ংক্রিয়ভাবে ডিসপ্যাচ করা হবে।</p>
                  </div>
                </div>
              )}

              {/* IF: RETAIL & WHOLESALE STANDARD APPAREL VARIANT SELECTOR */}
              {!isServiceItem && !isDigitalItem && (
                <div className="space-y-3 text-left">
                  {/* Sizes */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">সাইজ বা পরিমাপ নির্বাচন:</h3>
                    <div className="flex gap-1.5 flex-wrap select-none">
                      {product.variants.map((v) => (
                        <button 
                          key={v} 
                          type="button"
                          onClick={() => setSelectedSize(v)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer outline-none ${
                            selectedSize === v 
                              ? "bg-[var(--pm-accent)] text-white border-transparent shadow-xs scale-[1.02]" 
                              : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">কালার নির্বাচন:</h3>
                    <div className="flex gap-1.5 flex-wrap select-none">
                      {product.colors.map((col) => (
                        <button 
                          key={col} 
                          type="button"
                          onClick={() => setSelectedColor(col)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer outline-none ${
                            selectedColor === col 
                              ? "bg-white text-zinc-950 border-transparent shadow-xs scale-[1.02]" 
                              : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20"
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* UNIVERSAL QUANTITY SELECTOR */}
              <div className="text-left select-none">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                  {isWholesaleItem ? `পরিমাণ (ন্যূনতম MOQ: ${product.moq} পিস):` : 'পরিমাণ বা লট সাইজ:'}
                </h3>
                <div className="flex items-center gap-3 w-32 border border-white/10 rounded-xl bg-black/30 p-1">
                  <button 
                    type="button"
                    onClick={() => {
                      const minLimit = isWholesaleItem ? product.moq : 1;
                      setQuantity(Math.max(minLimit, quantity - 1));
                    }} 
                    className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer outline-none"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="flex-1 text-center font-bold text-white text-xs">{quantity}</span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)} 
                    className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer outline-none"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                {isWholesaleItem && quantity === product.moq && (
                  <p className="text-[9px] text-indigo-400 font-extrabold mt-1 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> এটি পাইকারি বিক্রেতার সর্বনিম্ন MOQ রিকোয়ারমেন্ট লিমিট।
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Unified Central Settle Actions Panel */}
          <div className="pt-3 border-t border-white/5 space-y-3">
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              
              {/* Cart insertion (Iconic Compact Style) */}
              {!isServiceItem && (
                <button 
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="px-3.5 py-2.5 rounded-xl bg-[var(--pm-surface)] hover:bg-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-95 cursor-pointer outline-none shadow-xs group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-5 h-5 rounded-md bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] group-hover:bg-[var(--pm-accent)] group-hover:text-white transition-all flex items-center justify-center shrink-0">
                    <ShoppingCart className="h-3 w-3" />
                  </div>
                  <span>কার্টে রাখুন</span>
                </button>
              )}

              {/* Settle Instant checkout triggers (Iconic Compact Style) */}
              <button 
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--pm-accent)] via-orange-500 to-amber-500 hover:brightness-110 text-white font-black text-xs transition-all shadow-md shadow-[var(--pm-accent)]/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer outline-none border border-white/20 group disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              >
                {isServiceItem ? (
                  <>
                    <div className="w-5 h-5 rounded-md bg-white/20 text-white flex items-center justify-center shrink-0">
                      <Calendar className="h-3 w-3" />
                    </div>
                    <span>সার্ভিস বুকিং</span>
                  </>
                ) : isDigitalItem ? (
                  <>
                    <div className="w-5 h-5 rounded-md bg-white/20 text-white flex items-center justify-center shrink-0">
                      <Download className="h-3 w-3" />
                    </div>
                    <span>ইনস্ট্যান্ট অর্ডার</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-md bg-white/20 text-white flex items-center justify-center shrink-0">
                      <Zap className="h-3 w-3 fill-current" />
                    </div>
                    <span>{isOutOfStock ? 'স্টক নেই' : 'এখনই কিনুন'}</span>
                  </>
                )}
              </button>

              {/* Wishlist Button (Iconic Compact) */}
              <button 
                type="button"
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast(isWishlisted ? "উইশলিস্ট থেকে সরানো হয়েছে" : "উইশলিস্টে যুক্ত হয়েছে");
                }}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer outline-none active:scale-95 ${
                  isWishlisted ? "border-rose-500 bg-rose-500/10 text-rose-500" : "border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 bg-[var(--pm-surface)]"
                }`}
                title="উইশলিস্ট"
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
              </button>
            </div>

            {/* Delivery/Escrow assurances badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-white/5 text-left">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/20 border border-white/5">
                <Truck className="h-4 w-4 text-[var(--pm-accent)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">
                    {isDigitalItem ? 'তাৎক্ষণিক ডিজিটাল ডিসপ্যাচ' : 'সারা বাংলাদেশে কুরিয়ার'}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {isDigitalItem ? 'ইমেইল ঠিকানায় সরাসরি ডাউনলোড লিংক পাবেন' : 'ঢাকার ভেতরে ২৪ ঘন্টা, বাইরে ৩-৫ দিনে ডেলিভারি'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/20 border border-white/5">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">
                    {isServiceItem ? 'ভেরিফাইড এসক্রো পেমেন্ট' : 'পাইকারমার্ট ভেরিফাইড কোয়ালিটি'}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {isServiceItem ? 'কাজ সন্তোষজনক শেষ হওয়ার পরই পেমেন্ট রিলিজ' : '৭ দিনের মধ্যে সহজ রিটার্ন ও রিফান্ড নিশ্চয়তা'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Multi-Vendor Profile Summary Banner - Wide & Slim Border */}
      <div className="mt-3 bg-[var(--pm-surface)]/80 p-3.5 sm:p-4 rounded-2xl border border-white/5 flex items-center justify-between flex-wrap gap-3 shadow-xs select-none text-left">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-[var(--pm-accent)] border border-[var(--pm-accent)]/20 flex items-center justify-center font-black">
            <StoreIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-white">{product.seller.name}</h3>
              {product.seller.verified && (
                <span className="inline-flex items-center gap-1 text-[8.5px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" /> ভেরিফাইড মার্চেন্ট
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">{product.seller.location} · রেটিং ৪.৯/৫.০</p>
          </div>
        </div>

        <div className="flex items-center gap-2 select-none">
          <button 
            type="button"
            onClick={() => setIsChatModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5 text-[var(--pm-accent)]" /> ইনবক্স মেসেজ
          </button>
          <Link 
            to={`/store/${product.seller.id}`}
            className="px-4 py-2 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer"
          >
            স্টোর ভিজিট
          </Link>
        </div>
      </div>

      {/* Description & Technical Specification - Wide & Slim Border */}
      <div className="mt-3 bg-[var(--pm-surface)]/80 p-4 sm:p-5 rounded-2xl border border-white/5 shadow-xs text-left select-none">
        <h2 className="text-sm font-black text-white mb-3 flex items-center gap-2 border-b border-white/5 pb-2.5">
          <Sparkles className="h-4 w-4 text-[var(--pm-accent)]" /> পণ্যের বিবরণ ও স্পেসিফিকেশন শিট
        </h2>
        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line font-medium">
          {product.description}
        </p>
      </div>

      {/* Multi-Seller Master Catalog Offers Comparison Section */}
      <div id="multi-seller-offers" className="mt-3">
        <MultiSellerOffersSection
          asin={pmin}
          productTitle={product.title}
          offers={offers as any}
          buyBoxWinner={buyBoxWinner as any}
          onOpenLinkModal={() => setIsLinkModalOpen(true)}
          onUpdateOffer={handleUpdateOffer as any}
          onSelectBuyBoxOffer={(offer) => {
            setSelectedOfferId(offer.id);
            toast.info(`${offer.sellerName} এর অফারটি সক্রিয় করা হয়েছে`);
          }}
          activeSelectedOfferId={activeOffer?.id || null}
        />
      </div>

      {/* Reviews Section - Wide & Slim Border */}
      <div className="mt-3 bg-[var(--pm-surface)]/80 p-4 sm:p-5 rounded-2xl border border-white/5 shadow-xs">
        <ProductReviews productId={product.id} shopId={product.seller.id} productTitle={product.title} />
      </div>

      {/* Seller Inventory Linker Modal */}
      <LinkInventoryModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        asin={pmin}
        productTitle={product.title}
        brand={product.brand}
        currentBuyBoxWinner={buyBoxWinner as any}
        onOfferLinked={handleOfferLinked}
      />

      {/* Real-Time Live Chat with Vendor Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        vendorId={product.seller.id}
        vendorName={product.seller.name}
        productId={product.id}
        productName={product.title}
      />

      {/* Sticky Mobile Quick Action Bar (Compact & Iconic) */}
      <div className="fixed bottom-[60px] left-0 right-0 z-40 p-3 bg-[var(--pm-bg)]/95 backdrop-blur-xl border-t border-[var(--pm-border)] md:hidden shadow-2xl flex items-center gap-2">
        {!isServiceItem && (
          <button 
            type="button"
            onClick={handleAddToCart}
            className="px-3.5 py-2 rounded-xl bg-[var(--pm-surface)] text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-[var(--pm-border)] active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <div className="w-5 h-5 rounded-md bg-[var(--pm-accent)]/20 text-[var(--pm-accent)] flex items-center justify-center shrink-0">
              <ShoppingCart className="h-3 w-3" />
            </div>
            <span>কার্টে রাখুন</span>
          </button>
        )}

        <button 
          type="button"
          onClick={handleBuyNow}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[var(--pm-accent)] via-orange-500 to-amber-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-[var(--pm-accent)]/20 border border-white/20"
        >
          <div className="w-5 h-5 rounded-md bg-white/20 text-white flex items-center justify-center shrink-0">
            <Zap className="h-3 w-3 fill-current" />
          </div>
          <span>এখনই কিনুন</span>
        </button>

        <button 
          type="button"
          onClick={() => {
            setIsWishlisted(!isWishlisted);
            toast(isWishlisted ? "উইশলিস্ট থেকে সরানো হয়েছে" : "উইশলিস্টে যুক্ত হয়েছে");
          }}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
            isWishlisted ? "border-rose-500 bg-rose-500/10 text-rose-500" : "border-[var(--pm-border)] text-zinc-400 bg-[var(--pm-surface)]"
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
        </button>
      </div>

      {/* Fullscreen Lightbox Zoom Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={product.images[activeImageIndex]}
                alt={product.title}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-[var(--pm-accent)] text-white transition-colors cursor-pointer shadow-lg"
                    title="আগের ছবি"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-[var(--pm-accent)] text-white transition-colors cursor-pointer shadow-lg"
                    title="পরের ছবি"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Lightbox Index Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-mono font-bold border border-white/10">
                  {activeImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
