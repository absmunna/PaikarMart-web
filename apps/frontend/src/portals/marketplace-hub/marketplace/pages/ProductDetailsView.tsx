import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Star, ShieldCheck, Truck, Store as StoreIcon, CheckCircle2, 
  Heart, Plus, Minus, ShoppingCart, ArrowLeft,
  Sparkles, MessageSquare, Calendar, Clock, Lock, Key, Download, ShieldAlert,
  Copy, Check, Package, Zap
} from "lucide-react";
import { useState, useMemo } from "react";
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

export default function ProductDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const matched = useMemo(() => {
    return (
      ECOMMERCE_PRODUCTS.find((p) => p.id === id || String(p.id) === String(id)) ||
      mockProducts.find((p) => p.id === id || String(p.id) === String(id))
    );
  }, [id]);

  // 1. Dynamic Sourcing Mode Classification
  const isServiceItem = useMemo(() => {
    return (matched as any)?.type === 'service' || (matched as any)?.portal === 'services' || (matched as any)?.portal === 'ride';
  }, [matched]);

  const isDigitalItem = useMemo(() => {
    return (matched as any)?.type === 'digital' || (matched as any)?.portal === 'digital';
  }, [matched]);

  const isWholesaleItem = useMemo(() => {
    return Boolean((matched as any)?.moq || (matched as any)?.category === 'wholesale' || (matched as any)?.type === 'wholesale');
  }, [matched]);

  // Set default quantity based on MOQ if it is a wholesale item
  const defaultQuantity = isWholesaleItem ? ((matched as any)?.moq || 20) : 1;

  const [quantity, setQuantity] = useState(defaultQuantity);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Scheduling states for Service booking
  const [bookingDate, setBookingDate] = useState("আজকে (Today)");
  const [bookingSlot, setBookingSlot] = useState("সকাল ১০:০০ - দুপুর ১২:০০");

  // License type states for Digital Products
  const [licenseType, setLicenseType] = useState("সিঙ্গেল লাইসেন্স (Personal Keys)");

  // Automated Unique ASIN/PMIN generation for the master catalog
  const asin = useMemo(() => {
    if ((matched as any)?.asin) return (matched as any).asin;
    const cleanId = (id || "101").replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase();
    return `PMIN-B${cleanId || "08X"}9J4M12`;
  }, [id, matched]);

  const [copiedAsin, setCopiedAsin] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Multi-seller offers for this master product
  const [offers, setOffers] = useState<SellerProductOffer[]>([
    {
      id: "off-1",
      masterProductId: id || "prod-101",
      asin,
      sellerId: "store-1",
      sellerName: (matched as any)?.sellerName || (matched as any)?.vendorName || "Dhaka Electronics & Apparel Hub",
      sellerRating: 4.9,
      sellerReviewCount: 312,
      sellerLocation: "চকবাজার পাইকারি মার্কেট, ঢাকা",
      sellerVerified: true,
      sellerSku: "DHK-TSHIRT-BLK-100",
      condition: "New",
      price: matched?.price || 450,
      originalPrice: (matched as any)?.originalPrice || Math.round((matched?.price || 450) * 1.35),
      stock: 85,
      minOrderQty: 1,
      fulfillmentType: "paikar_express",
      shippingFee: 50,
      freeShippingAbove: 1000,
      dispatchTimeDays: 1,
      warranty: "7 Days Easy Replacement",
      isBuyBoxWinner: true,
      isActive: true,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "off-2",
      masterProductId: id || "prod-101",
      asin,
      sellerId: "store-2",
      sellerName: "Chittagong Wholesale Syndicate",
      sellerRating: 4.4,
      sellerReviewCount: 148,
      sellerLocation: "টেরিবাজার, চট্টগ্রাম",
      sellerVerified: true,
      sellerSku: "CTG-COTTON-TEE-LOT",
      condition: "Wholesale Lot",
      price: Math.round((matched?.price || 450) * 0.92),
      originalPrice: Math.round((matched?.price || 450) * 1.2),
      stock: 350,
      minOrderQty: 5,
      fulfillmentType: "seller_fulfilled",
      shippingFee: 80,
      freeShippingAbove: 2500,
      dispatchTimeDays: 2,
      warranty: "Factory Defect Return Guaranteed",
      isBuyBoxWinner: false,
      isActive: true,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "off-3",
      masterProductId: id || "prod-101",
      asin,
      sellerId: "store-3",
      sellerName: "Khulna Express Direct",
      sellerRating: 4.2,
      sellerReviewCount: 64,
      sellerLocation: "দৌলতপুর, খুলনা",
      sellerVerified: false,
      sellerSku: "KHU-EXP-TEE-01",
      condition: "New",
      price: Math.round((matched?.price || 450) * 1.05),
      originalPrice: Math.round((matched?.price || 450) * 1.3),
      stock: 18,
      minOrderQty: 1,
      fulfillmentType: "seller_fulfilled",
      shippingFee: 0,
      freeShippingAbove: 0,
      dispatchTimeDays: 3,
      warranty: "3 Days Replacement",
      isBuyBoxWinner: false,
      isActive: true,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ]);

  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  // Buy Box calculation function
  const recalculateOffers = (list: SellerProductOffer[]) => {
    let bestId: string | null = null;
    let maxScore = -999999;
    list.forEach((o) => {
      if (!o.isActive || o.stock <= 0) return;
      const landed = o.price + o.shippingFee;
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

  const buyBoxWinner = useMemo(() => offers.find((o) => o.isBuyBoxWinner) || offers[0], [offers]);
  const activeOffer = useMemo(() => offers.find((o) => o.id === selectedOfferId) || buyBoxWinner, [offers, selectedOfferId, buyBoxWinner]);

  const handleCopyAsin = () => {
    navigator.clipboard?.writeText(asin);
    setCopiedAsin(true);
    toast.success(`ASIN কপি করা হয়েছে: ${asin}`);
    setTimeout(() => setCopiedAsin(false), 2000);
  };

  const handleOfferLinked = (newOffer: SellerProductOffer) => {
    const updated = recalculateOffers([newOffer, ...offers]);
    setOffers(updated);
    setSelectedOfferId(newOffer.id);
  };

  const handleUpdateOffer = (offerId: string, updates: Partial<SellerProductOffer>) => {
    const nextList = offers.map((o) => (o.id === offerId ? { ...o, ...updates } : o));
    setOffers(recalculateOffers(nextList));
  };

  // Dynamic product mapping reading from the active winning offer
  const product = {
    id: id || "prod-101",
    asin,
    brand: (matched as any)?.brand || "Apex Apparel BD",
    barcode: (matched as any)?.upcOrEan || "8941123456789",
    title: matched?.title || matched?.name || "Premium Combed Cotton Crewneck T-Shirt (Export Quality)",
    description: matched?.description || "Experience breathable comfort with 100% combed ringspun cotton fabric (180 GSM). Specially crafted for Bangladesh's subtropical climate with reactive dye, anti-pilling wash, and double-stitched reinforced collar. Master catalog item supporting multiple verified vendor listings.",
    price: activeOffer ? activeOffer.price : (matched?.price || 450),
    originalPrice: activeOffer?.originalPrice || (matched as any)?.originalPrice || Math.round((matched?.price || 450) * 1.35),
    wholesalePrice: (matched as any)?.moq ? Math.round((matched.price) * 0.75) : 220,
    moq: activeOffer?.minOrderQty || (matched as any)?.moq || 1,
    rating: activeOffer?.sellerRating || matched?.rating || 4.8,
    reviews: matched?.reviewCount || 124,
    sold: 1542,
    images: (matched as any)?.images && (matched as any).images.length > 0 
      ? (matched as any).images 
      : [
          matched?.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"
        ],
    variants: (matched as any)?.variants || ["Small (38)", "Medium (40)", "Large (42)", "XL (44)", "XXL (46)"],
    colors: (matched as any)?.colors || ["Black", "Navy Blue", "Heather Grey", "Olive Green"],
    seller: {
      id: activeOffer ? activeOffer.sellerId : ((matched as any)?.sellerId || "store-1"),
      name: activeOffer ? activeOffer.sellerName : ((matched as any)?.sellerName || "PaikarMart Elite Partner"),
      rating: activeOffer ? activeOffer.sellerRating : 4.9,
      verified: activeOffer ? activeOffer.sellerVerified : true,
      joinDate: "2021",
      location: activeOffer ? activeOffer.sellerLocation : "চকবাজার পাইকারি মার্কেট, ঢাকা",
      responseRate: "98%",
      fulfillmentType: activeOffer ? activeOffer.fulfillmentType : "paikar_express",
      shippingFee: activeOffer ? activeOffer.shippingFee : 50,
      condition: activeOffer ? activeOffer.condition : "New",
      stock: activeOffer ? activeOffer.stock : 85,
    }
  };

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
    <div className="px-4 py-6 md:px-6 md:py-8 max-w-7xl mx-auto min-h-screen text-white pb-32">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-xs font-black text-zinc-400 hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> আগের পৃষ্ঠায় ফিরুন
      </button>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-[#141624] p-5 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl items-start">
        
        {/* LEFT: Gallery (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative group">
            <img 
              src={product.images[activeImageIndex]} 
              alt={product.title} 
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
              referrerPolicy="no-referrer"
            />
            {isWholesaleItem && (
              <span className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg">
                B2B Bulk Lot · MOQ {product.moq} pcs
              </span>
            )}
            {isServiceItem && (
              <span className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg">
                On-Demand Service Booking
              </span>
            )}
            {isDigitalItem && (
              <span className="absolute top-4 left-4 bg-violet-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg">
                Instant Key Delivery
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar select-none">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-square w-16 rounded-xl bg-black/40 border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === i ? "border-orange-500 scale-95 shadow-md" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Specs & Action Controls (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
          <div className="space-y-4">
            
            {/* Tag headers & Amazon ASIN Catalog Bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {isServiceItem ? 'ভেরিফাইড স্লট সচল' : isDigitalItem ? 'অটো ডিসপ্যাচ লাইভ' : 'In Stock & Dispatch Ready'}
              </span>

              {/* Unique ASIN Badge with copy button */}
              <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/25 px-2.5 py-0.5 rounded-full text-xs">
                <Package className="w-3 h-3 text-[#FF7A00]" />
                <span className="text-[10px] font-mono font-bold text-white">ASIN: {asin}</span>
                <button
                  type="button"
                  onClick={handleCopyAsin}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer ml-0.5"
                  title="ASIN কোড কপি করুন"
                >
                  {copiedAsin ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {product.brand && (
                <span className="text-[9px] font-bold text-zinc-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                  ব্র্যান্ড: <strong className="text-zinc-200">{product.brand}</strong>
                </span>
              )}

              {/* Seller Quick Action CTA */}
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(true)}
                className="text-[9px] font-black text-[#FF7A00] hover:text-orange-400 bg-orange-500/5 hover:bg-orange-500/15 border border-orange-500/30 px-2.5 py-0.5 rounded-full transition-all cursor-pointer flex items-center gap-1"
              >
                <span>+ স্টক লিঙ্ক করুন</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {product.title}
            </h1>
            
            {/* Reviews count & ASIN barcode */}
            <div className="flex items-center gap-4 flex-wrap text-xs select-none">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                </div>
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-zinc-400">({product.reviews} রিভিউ)</span>
              </div>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-400">{product.sold} টি ডেলিভারি সম্পন্ন</span>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-500 font-mono text-[10px]">EAN: {product.barcode}</span>
            </div>

            {/* Central Price Display & Buy Box Panel */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 select-none text-left">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#FF7A00]">
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
              </div>

              {/* Winning Offer / Buy Box Note */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-400">বিক্রেতা (Featured):</span>
                  <span className="font-bold text-white">{product.seller.name}</span>
                  {product.seller.fulfillmentType === "paikar_express" ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black text-[#FF7A00] bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
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
                  className="text-xs font-black text-[#FF7A00] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  অন্যান্য বিক্রেতা ({offers.length} অফার) ৳{Math.min(...offers.map((o) => o.price))} থেকে ↓
                </a>
              </div>

              {isWholesaleItem && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-zinc-300">
                  <span>বাল্ক ভ্যালু ডিসকাউন্ট (MOQ {product.moq}+):</span>
                  <span className="text-emerald-400 font-black">
                    ৳ {Math.round(product.price * 0.95)} / পিস (৳ {Math.round(product.price * 0.95 * quantity).toLocaleString('bn-BD')} লট)
                  </span>
                </div>
              )}
            </div>

            {/* DYNAMIC MODE CONFIGURATION SELECTOR FIELDS */}
            <div className="space-y-5 pt-2 border-t border-white/[0.04]">
              
              {/* IF: SERVICE BOOKING PANEL */}
              {isServiceItem && (
                <div className="space-y-4 text-left">
                  {/* Scheduling date */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">সার্ভিস বুকিং তারিখ নির্ধারণ:</h3>
                    <div className="flex gap-2 flex-wrap select-none">
                      {["আজকে (Today)", "আগামীকাল (Tomorrow)", "পরশু (Day After)"].map((d) => (
                        <button 
                          key={d} 
                          type="button"
                          onClick={() => setBookingDate(d)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer outline-none ${
                            bookingDate === d 
                              ? "bg-purple-600 text-white border-transparent shadow-lg shadow-purple-600/25 scale-[1.02]" 
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
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">উপযুক্ত সময় নির্বাচন:</h3>
                    <div className="flex gap-2 flex-wrap select-none">
                      {["সকাল ১০:০০ - দুপুর ১২:০০", "দুপুর ১২:০০ - বিকাল ৩:০০", "বিকাল ৪:০০ - সন্ধ্যা ৬:০০"].map((slot) => (
                        <button 
                          key={slot} 
                          type="button"
                          onClick={() => setBookingSlot(slot)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer outline-none ${
                            bookingSlot === slot 
                              ? "bg-purple-600 text-white border-transparent shadow-lg shadow-purple-600/25 scale-[1.02]" 
                              : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-[10px] text-purple-300 leading-relaxed font-semibold">
                    🛡️ এসক্রো প্রটেকশন সচল: সার্ভিস বুকিং ভ্যালু এসক্রো করা থাকবে। কাজ সম্পূর্ণ হওয়ার পর কোয়ালিটি যাচাই করে রিলিজ নিশ্চিত করবেন।
                  </div>
                </div>
              )}

              {/* IF: DIGITAL LICENSE PANEL */}
              {isDigitalItem && (
                <div className="space-y-4 text-left">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">লাইসেন্স টাইপ নির্বাচন করুন:</h3>
                    <div className="flex gap-2 flex-wrap select-none">
                      {["সিঙ্গেল লাইসেন্স (Personal Keys)", "আনলিমিটেড ডেভেলপার প্যাক (Unlimited)"].map((lic) => (
                        <button 
                          key={lic} 
                          type="button"
                          onClick={() => setLicenseType(lic)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer outline-none ${
                            licenseType === lic 
                              ? "bg-violet-600 text-white border-transparent shadow-lg shadow-violet-600/25 scale-[1.02]" 
                              : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/20"
                          }`}
                        >
                          {lic}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-violet-500/10 rounded-2xl border border-violet-500/20 text-[10px] text-violet-300 leading-relaxed font-semibold flex items-start gap-2">
                    <Key className="w-4.5 h-4.5 shrink-0 text-violet-400" />
                    <p>পেমেন্ট সম্পন্ন হওয়ার পর আপনার নিবন্ধিত ইমেইলে সোর্স কোড/লাইসেন্স কী তাৎক্ষণিকভাবে স্বয়ংক্রিয়ভাবে ডিসপ্যাচ করা হবে।</p>
                  </div>
                </div>
              )}

              {/* IF: RETAIL & WHOLESALE STANDARD APPAREL VARIANT SELECTOR */}
              {!isServiceItem && !isDigitalItem && (
                <div className="space-y-4 text-left">
                  {/* Sizes */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">সাইজ বা পরিমাপ নির্বাচন:</h3>
                    <div className="flex gap-2 flex-wrap select-none">
                      {product.variants.map((v) => (
                        <button 
                          key={v} 
                          type="button"
                          onClick={() => setSelectedSize(v)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer outline-none ${
                            selectedSize === v 
                              ? "bg-[#FF7A00] text-white border-transparent shadow-lg shadow-orange-500/25 scale-[1.02]" 
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
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">কালার নির্বাচন:</h3>
                    <div className="flex gap-2 flex-wrap select-none">
                      {product.colors.map((col) => (
                        <button 
                          key={col} 
                          type="button"
                          onClick={() => setSelectedColor(col)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer outline-none ${
                            selectedColor === col 
                              ? "bg-white text-zinc-950 border-transparent shadow-md scale-[1.02]" 
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
                <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">
                  {isWholesaleItem ? `পরিমাণ (ন্যূনতম MOQ: ${product.moq} পিস):` : 'পরিমাণ বা লট সাইজ:'}
                </h3>
                <div className="flex items-center gap-3.5 w-36 border border-white/10 rounded-2xl bg-black/40 p-1">
                  <button 
                    type="button"
                    onClick={() => {
                      // Restrict below MOQ for wholesale
                      const minLimit = isWholesaleItem ? product.moq : 1;
                      setQuantity(Math.max(minLimit, quantity - 1));
                    }} 
                    className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 cursor-pointer outline-none"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex-1 text-center font-bold text-white text-sm">{quantity}</span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)} 
                    className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 cursor-pointer outline-none"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {isWholesaleItem && quantity === product.moq && (
                  <p className="text-[9px] text-indigo-400 font-extrabold mt-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> এটি পাইকারি বিক্রেতার সর্বনিম্ন MOQ রিকোয়ারমেন্ট লিমিট।
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Unified Central Settle Actions Panel */}
          <div className="pt-6 border-t border-white/[0.04] space-y-4">
            <div className="flex gap-3 flex-wrap sm:flex-nowrap">
              
              {/* Cart insertion (bypassed for services direct buy flow) */}
              {!isServiceItem && (
                <button 
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-95 cursor-pointer outline-none"
                >
                  <ShoppingCart className="h-4.5 w-4.5 text-[#FF7A00]" /> কার্টে রাখুন
                </button>
              )}

              {/* Settle Instant checkout triggers */}
              <button 
                type="button"
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-orange-500 to-[#FF7A00] hover:from-orange-600 hover:to-[#e06b00] text-white py-4 px-6 rounded-2xl font-black text-sm transition-all shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 active:scale-95 cursor-pointer outline-none"
              >
                {isServiceItem ? (
                  <>
                    <Calendar className="h-4.5 w-4.5" />
                    <span>সার্ভিস বুকিং সম্পন্ন করুন</span>
                  </>
                ) : isDigitalItem ? (
                  <>
                    <Download className="h-4.5 w-4.5" />
                    <span>ইনস্ট্যান্ট অর্ডার প্লেস করুন</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4.5 w-4.5" />
                    <span>এখনই অর্ডার কিনুন</span>
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast(isWishlisted ? "উইশলিস্ট থেকে সরানো হয়েছে" : "উইশলিস্টে যুক্ত হয়েছে");
                }}
                className={`p-4 border rounded-2xl transition-all cursor-pointer outline-none ${
                  isWishlisted ? "border-rose-500 bg-rose-500/10 text-rose-500" : "border-white/10 text-zinc-400 hover:text-rose-500 hover:border-rose-500/30"
                }`}
                title="উইশলিস্ট"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-500" : ""}`} />
              </button>
            </div>

            {/* Delivery/Escrow assurances badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/[0.04] text-left">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-black/20 border border-white/5">
                <Truck className="h-5 w-5 text-[#FF7A00] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">
                    {isDigitalItem ? 'তাৎক্ষণিক ডিজিটাল ডিসপ্যাচ' : 'সারা বাংলাদেশে নির্ভরযোগ্য কুরিয়ার'}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {isDigitalItem ? 'ইমেইল ঠিকানায় সরাসরি ডাউনলোড লিংক পাবেন' : 'ঢাকার ভেতরে ২৪ ঘন্টা, বাইরে ৩-৫ দিনে নিরাপদ ডেলিভারি'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-black/20 border border-white/5">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">
                    {isServiceItem ? 'ভেরিফাইড এসক্রো পেমেন্ট' : 'পেইকারমার্ট ভেরিফাইড কোয়ালিটি'}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {isServiceItem ? 'সার্ভিস কাজ সন্তোষজনক শেষ হওয়ার পরই পেমেন্ট রিলিজ' : '৭ দিনের মধ্যে সহজ রিটার্ন, এক্সচেঞ্জ এবং লাইভ রিফান্ড নিশ্চয়তা'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Multi-Vendor Profile Summary Banner */}
      <div className="mt-6 bg-[#141624] p-5 md:p-6 rounded-[2rem] border border-white/5 flex items-center justify-between flex-wrap gap-4 shadow-xl select-none text-left">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-[#FF7A00] border border-[#FF7A00]/20 flex items-center justify-center font-black text-xl">
            <StoreIcon className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">{product.seller.name}</h3>
              {product.seller.verified && (
                <span className="inline-flex items-center gap-1 text-[8.5px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" /> ভেরিফাইড মার্চেন্ট
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">{product.seller.location} · রেটিং ৪.৯/৫.০</p>
          </div>
        </div>

        <div className="flex items-center gap-3 select-none">
          <button 
            type="button"
            onClick={() => setIsChatModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquare className="h-3.5 w-3.5 text-[#FF7A00]" /> ইনবক্স মেসেজ
          </button>
          <Link 
            to={`/store/${product.seller.id}`}
            className="px-5 py-2.5 bg-[#FF7A00] hover:bg-[#e06b00] text-white rounded-xl text-xs font-black transition-all shadow-md shadow-[#FF7A00]/20 cursor-pointer"
          >
            স্টোর ভিজিট
          </Link>
        </div>
      </div>

      {/* Description & Technical specification sheets */}
      <div className="mt-6 bg-[#141624] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-xl text-left select-none">
        <h2 className="text-base font-black text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Sparkles className="h-5 w-5 text-[#FF7A00]" /> পণ্যের বিবরণ ও স্পেসিফিকেশন শিট
        </h2>
        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line font-medium">
          {product.description}
        </p>
      </div>

      {/* Multi-Seller Master Catalog Offers Comparison Section (Amazon Buy Box & Seller Offers) */}
      <div id="multi-seller-offers">
        <MultiSellerOffersSection
          asin={asin}
          productTitle={product.title}
          offers={offers}
          buyBoxWinner={buyBoxWinner}
          onOpenLinkModal={() => setIsLinkModalOpen(true)}
          onUpdateOffer={handleUpdateOffer}
          onSelectBuyBoxOffer={(offer) => {
            setSelectedOfferId(offer.id);
            toast.info(`${offer.sellerName} এর অফারটি সক্রিয় করা হয়েছে`);
          }}
          activeSelectedOfferId={activeOffer?.id || null}
        />
      </div>

      {/* Reviews Section */}
      <div className="mt-6 bg-[#141624] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-xl">
        <ProductReviews productId={product.id} />
      </div>

      {/* Seller Inventory Linker Modal */}
      <LinkInventoryModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        asin={asin}
        productTitle={product.title}
        brand={product.brand}
        currentBuyBoxWinner={buyBoxWinner}
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

    </div>
  );
}
