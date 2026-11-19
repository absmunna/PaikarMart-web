import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, ArrowLeft, TrendingUp, Package, Users, ShieldCheck, 
  Building2, PlusCircle, Filter, ArrowUpRight, CheckCircle2, 
  Send, Sparkles, ShoppingBag, Layers, Percent, Clock, MapPin,
  FileText, MessageSquare, Download, Check, X, Phone, Briefcase,
  ExternalLink, ChevronRight, AlertCircle, RefreshCw, Star, Truck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { safeBack } from "@/lib/navigation";
import { useAuth } from "@/modules/auth";
import { b2bProductService, WholesaleQueryParams, RFQSubmissionPayload } from "../services/b2bProductService";

interface B2BTierPrice {
  range: string;
  min_qty: number;
  max_qty: number | null;
  unit_price: number;
  discount_percent: number;
}

interface B2BProduct {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  images: string[];
  image: string;
  moq: number;
  lead_time: string;
  lead_time_days: number;
  factory_location: string;
  tier_pricing: B2BTierPrice[];
  factory_certifications: string[];
  is_published: boolean;
  status: string;
  sample_available: boolean;
  sample_price?: number;
  supply_capacity: string;
  vendor: {
    id: string;
    store_name: string;
    factory_name: string;
    business_type: 'manufacturer' | 'wholesaler' | 'importer';
    trade_license_number: string;
    trade_license_verified: boolean;
    rating: number;
    review_count: number;
    years_in_business: number;
    inspection_available: boolean;
    location: string;
    response_rate: string;
  };
}

const INDUSTRY_CATEGORIES = [
  { id: "all", nameEn: "All Industries", nameBn: "সব ইন্ডাস্ট্রি" },
  { id: "apparel_textile", nameEn: "Apparel & Textiles", nameBn: "পোশাক ও টেক্সটাইল" },
  { id: "electronics_hardware", nameEn: "Electronics & Gadgets", nameBn: "ইলেকট্রনিক্স ও গেজেটস" },
  { id: "leather_footwear", nameEn: "Leather & Footwear", nameBn: "চামড়াজাত পণ্য ও জুতো" },
  { id: "agro_commodity", nameEn: "Agro & Food Commodities", nameBn: "কৃষি ও খাদ্য কমোডিটি" },
  { id: "packaging_machinery", nameEn: "Packaging & Supplies", nameBn: "প্যাকেজিং ও ইন্ডাস্ট্রিয়াল" }
];

const MOQ_FILTERS = [
  { id: "all", label: "সব MOQ", max: null },
  { id: "moq_20", label: "MOQ ≤ ২০", max: 20 },
  { id: "moq_50", label: "MOQ ≤ ৫০", max: 50 },
  { id: "moq_100", label: "MOQ ≤ ১০০", max: 100 },
  { id: "moq_200", label: "MOQ ২০০+", max: 9999 }
];

const DISTRICTS_BANGLADESH = [
  "ঢাকা", "চট্টগ্রাম", "গাজীপুর", "নারায়ণগঞ্জ", "টাঙ্গাইল", "সিলেট", 
  "রাজশাহী", "খুলনা", "বগুড়া", "কুষ্টিয়া", "রংপুর", "বরিশাল", "ময়মনসিংহ"
];

export const B2BHome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVendor = user?.role === 'seller' || (user as any)?.role === 'retail_seller' || (user as any)?.role === 'manufacturer';
  const isAdmin = user?.role === 'admin' || (user as any)?.role === 'super_admin';

  // State Management
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedMoqFilter, setSelectedMoqFilter] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [products, setProducts] = useState<B2BProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // RFQ Submission Modal State
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [selectedProductForRfq, setSelectedProductForRfq] = useState<B2BProduct | null>(null);
  const [rfqQuantity, setRfqQuantity] = useState<number>(50);
  const [rfqTargetPrice, setRfqTargetPrice] = useState<string>("");
  const [rfqDeliveryDistrict, setRfqDeliveryDistrict] = useState("ঢাকা");
  const [rfqPaymentTerms, setRfqPaymentTerms] = useState<'wholesale_credit' | 'lc' | 'bank_transfer' | 'escrow'>('wholesale_credit');
  const [rfqNotes, setRfqNotes] = useState("");
  const [rfqBuyerName, setRfqBuyerName] = useState(user?.fullName || user?.name || "ট্রেডার বায়ার");
  const [rfqBuyerPhone, setRfqBuyerPhone] = useState(user?.phone || "০১৭XXXXXXXX");
  const [rfqBuyerCompany, setRfqBuyerCompany] = useState("মেসার্স ব্রাদার্স এন্টারপ্রাইজ");
  const [isSubmittingRfq, setIsSubmittingRfq] = useState(false);

  // Purchase Order (PO) Draft Dialog State
  const [generatedPoDraft, setGeneratedPoDraft] = useState<any | null>(null);

  // Chat with Supplier Modal State
  const [chatSupplierProduct, setChatSupplierProduct] = useState<B2BProduct | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'buyer' | 'supplier'; text: string; time: string }>>([]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Fetch B2B Wholesale Products
  const loadWholesaleProducts = async () => {
    try {
      setIsLoading(true);
      const activeMoqObj = MOQ_FILTERS.find(m => m.id === selectedMoqFilter);
      const params: WholesaleQueryParams = {
        portal: 'wholesale',
        industry: selectedIndustry !== 'all' ? selectedIndustry : undefined,
        moq_max: activeMoqObj?.max ? activeMoqObj.max : undefined,
        search: search.trim() || undefined,
        verified_only: verifiedOnly ? true : undefined
      };

      const data = await b2bProductService.getProducts(params);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Failed to fetch wholesale products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWholesaleProducts();
  }, [selectedIndustry, selectedMoqFilter, verifiedOnly]);

  // Debounced Search Trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      loadWholesaleProducts();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Open RFQ Modal for a specific product
  const handleOpenRfq = (product: B2BProduct) => {
    setSelectedProductForRfq(product);
    setRfqQuantity(product.moq);
    setRfqTargetPrice(product.tier_pricing[0]?.unit_price ? String(product.tier_pricing[0].unit_price) : "");
    setIsRfqOpen(true);
  };

  // Open Direct Chat with Supplier
  const handleOpenChat = (product: B2BProduct) => {
    setChatSupplierProduct(product);
    setChatHistory([
      {
        sender: 'supplier',
        text: `আসসালামু আলাইকুম। ${product.vendor.factory_name}-এ স্বাগতম! ${product.name}-এর পাইকারি লট বা কাস্টম স্পেসিফিকেশন সম্পর্কে কোনো জিজ্ঞাসা থাকলে জানান।`,
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Handle Send Chat Message
  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;
    const newMsg = {
      sender: 'buyer' as const,
      text: chatMessage.trim(),
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory(prev => [...prev, newMsg]);
    setChatMessage("");

    // Simulate instant supplier automated ACK
    setIsSendingChat(true);
    setTimeout(() => {
      setIsSendingChat(false);
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'supplier',
          text: `ধন্যবাদ আপনার বার্তার জন্য। আমাদের সেলস অফিসার খুব দ্রুত আপনার দেওয়া স্পেক অনুযায়ী রেসপন্ড করছেন। প্রয়োজন হলে সরাসরি কল করতে পারেন: ${chatSupplierProduct?.vendor.trade_license_number || 'সাপ্লায়ার সাপোর্ট'}।`,
          time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  // Calculate live tier estimate in RFQ Modal
  const calculatedUnitPrice = useMemo(() => {
    if (!selectedProductForRfq) return 0;
    if (rfqTargetPrice && parseFloat(rfqTargetPrice) > 0) {
      return parseFloat(rfqTargetPrice);
    }
    for (const tier of selectedProductForRfq.tier_pricing) {
      if (rfqQuantity >= tier.min_qty && (tier.max_qty === null || rfqQuantity <= tier.max_qty)) {
        return tier.unit_price;
      }
    }
    return selectedProductForRfq.tier_pricing[0]?.unit_price || 0;
  }, [selectedProductForRfq, rfqQuantity, rfqTargetPrice]);

  const calculatedSubtotal = calculatedUnitPrice * rfqQuantity;
  const calculatedAitTax = Math.round(calculatedSubtotal * 0.05);
  const calculatedGrandTotal = calculatedSubtotal + calculatedAitTax;

  // Handle RFQ Form Submission
  const handleSubmitRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForRfq) return;

    if (rfqQuantity < selectedProductForRfq.moq) {
      toast.error(`নূন্যতম অর্ডার পরিমাণ (MOQ) কমপক্ষে ${selectedProductForRfq.moq} পিস হতে হবে!`);
      return;
    }

    try {
      setIsSubmittingRfq(true);
      const payload: RFQSubmissionPayload = {
        productId: selectedProductForRfq.id,
        productName: selectedProductForRfq.name,
        quantity: rfqQuantity,
        targetPrice: calculatedUnitPrice,
        deliveryDistrict: rfqDeliveryDistrict,
        paymentTerms: rfqPaymentTerms,
        notes: rfqNotes,
        buyerName: rfqBuyerName,
        buyerPhone: rfqBuyerPhone,
        buyerCompany: rfqBuyerCompany
      };

      const result = await b2bProductService.submitRFQ(payload);

      setIsRfqOpen(false);
      setGeneratedPoDraft(result.poDraft);
      toast.success("বাল্ক কোটেশন রিকোয়েস্ট (RFQ) সফলভাবে সাবমিট হয়েছে এবং পারচেজ অর্ডার (PO) ড্রাফট তৈরি হয়েছে!");
    } catch (err: any) {
      toast.error("RFQ সাবমিট করতে সমস্যা হয়েছে: " + (err.message || "নেটওয়ার্ক এরর"));
    } finally {
      setIsSubmittingRfq(false);
    }
  };

  return (
    <div className="w-full pb-24 bg-[var(--pm-bg)] min-h-screen text-[var(--pm-text)] select-none">
      
      {/* ━━━ TOP B2B APP BAR ━━━ */}
      <header className="sticky top-0 z-40 bg-[var(--pm-surface)]/95 backdrop-blur-md border-b border-[var(--pm-border)] px-4 py-3 shadow-xs">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => safeBack(navigate, '/')}
              className="w-9 h-9 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-center text-[var(--pm-text)] hover:opacity-80 active:scale-95 transition-all cursor-pointer"
              title="হোমে ফিরুন"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-[var(--pm-text)]">
                  পাইকারি আড়ত ও বিটুবি ট্রেড
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-700 uppercase tracking-wider">
                  B2B Trade
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium truncate max-w-[220px]">
                সরাসরি কারখানা ও আমদানিকারক রেট · RFQ কোটেশন · এসক্রো পেমেন্ট
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadWholesaleProducts()}
              className="w-9 h-9 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-center text-zinc-400 hover:text-white active:scale-95 transition-all cursor-pointer"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-500' : ''}`} />
            </button>
            <button
              onClick={() => {
                if (products.length > 0) handleOpenRfq(products[0]);
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" /> RFQ পোস্ট
            </button>
          </div>
        </div>
      </header>

      {/* ━━━ MAIN CONTENT CONTAINER (MOBILE-FIRST MAX-W-XL) ━━━ */}
      <main className="max-w-xl mx-auto px-3.5 pt-3.5 space-y-4">

        {/* 1. ROLE-BASED ACTION BANNERS */}
        {isVendor && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--pm-text)]">সাপ্লায়ার সেন্ট্রাল (মিলার ও ফ্যাক্টরি প্যানেল)</p>
                <p className="text-[11px] text-zinc-400">বাল্ক ক্যাটালগ পরিচালনা ও ক্রেতাদের RFQ ইনভয়েস ইস্যু করুন</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shrink-0 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              সেলার ড্যাশবোর্ড
            </button>
          </div>
        )}

        {isAdmin && (
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between text-indigo-300 text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> এডমিন কনসোল: ট্রেড লাইসেন্স ভেরিফিকেশন ও হোলসেল এসক্রো মনিটর
            </span>
            <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded-full text-indigo-300">ADMIN</span>
          </div>
        )}

        {/* 2. ALIBABA / INDIAMART STYLE SOURCING HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#0c1838] via-[#10224d] to-[#0b1426] border border-blue-500/20 text-white shadow-xl">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[11px] font-bold text-blue-300">
              <Sparkles className="w-3.5 h-3.5" /> ১০০% ফ্যাক্টরি ডিরেক্ট রেট · নো মিডলম্যান
            </div>
            <h2 className="text-xl font-black tracking-tight leading-snug">
              সরাসরি উৎপাদনকারী মিল ও আমদানিকারকদের সাথে লেনদেন
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              ন্যূনতম MOQ ফ্লেক্সিবিলিটি, বাল্ক টায়ার প্রাইসিং ও পাইকার মার্ট এসক্রো পেমেন্ট সুরক্ষায় পণ্য সংগ্রহ করুন।
            </p>

            {/* Quick Sourcing Metrics Strip */}
            <div className="pt-2 grid grid-cols-3 gap-2 text-center text-zinc-300">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <p className="text-sm font-black text-blue-400">৫২০+ মিল</p>
                <p className="text-[10px] text-zinc-400">ভেরিফাইড সাপ্লায়ার</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <p className="text-sm font-black text-emerald-400">৪০% সাশ্রয়</p>
                <p className="text-[10px] text-zinc-400">মিল গেট ডিসকাউন্ট</p>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <p className="text-sm font-black text-amber-400">১০০% এসক্রো</p>
                <p className="text-[10px] text-zinc-400">নিরাপদ পেমেন্ট</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 3. BULK SEARCH BAR */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="পণ্য, স্পেক্স বা ফ্যাক্টরির নাম দিয়ে পাইকারি অনুসন্ধান..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 4. MOQ FILTER SLIDER / BUTTONS */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-xs font-extrabold text-[var(--pm-text)] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> নূন্যতম অর্ডার পরিমাণ (MOQ ফিল্টার)
            </span>
            {selectedMoqFilter !== 'all' && (
              <button
                onClick={() => setSelectedMoqFilter('all')}
                className="text-[11px] text-blue-400 font-bold hover:underline cursor-pointer"
              >
                রিসেট
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {MOQ_FILTERS.map((moq) => {
              const isSelected = selectedMoqFilter === moq.id;
              return (
                <button
                  key={moq.id}
                  onClick={() => setSelectedMoqFilter(moq.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-[var(--pm-card)] text-zinc-400 hover:text-white border border-[var(--pm-border)]'
                  }`}
                >
                  {moq.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. INDUSTRY CATEGORIES BAR */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-xs font-extrabold text-[var(--pm-text)] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> শিল্প ও খাতভিত্তিক ক্যাটাগরি
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {INDUSTRY_CATEGORIES.map((cat) => {
              const isSelected = selectedIndustry === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedIndustry(cat.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xs'
                      : 'bg-[var(--pm-card)] text-zinc-400 hover:text-white border border-[var(--pm-border)]'
                  }`}
                >
                  {cat.nameBn}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. VERIFIED FACTORY / SUPPLIER BADGES STRIP */}
        <div className="p-3 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar text-[11px] text-zinc-300">
          <div className="flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">ট্রেড লাইসেন্স ভেরিফাইড</span>
          </div>
          <span className="text-zinc-600">•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span className="font-bold">ফ্যাক্টরি অডিট</span>
          </div>
          <span className="text-zinc-600">•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <Truck className="w-4 h-4 text-amber-400" />
            <span className="font-bold">সারা দেশে বাল্ক কার্গো</span>
          </div>
        </div>

        {/* 7. BODY: B2B WHOLESALE PRODUCT CARDS */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-xs font-extrabold text-[var(--pm-text)] flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-blue-400" />
              কারখানা লট তালিকা ({products.length}টি লট)
            </span>
            <span className="text-[11px] text-zinc-500">RFQ কোটেশন ও চ্যাট</span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] p-4 space-y-3 animate-pulse">
                  <div className="w-full h-44 bg-zinc-800 rounded-2xl" />
                  <div className="h-4 bg-zinc-800 rounded-md w-3/4" />
                  <div className="h-10 bg-zinc-800 rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-14 text-center rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-3">
              <Package className="w-12 h-12 text-zinc-500 mx-auto" />
              <p className="text-sm font-bold text-[var(--pm-text)]">কোনো পাইকারি লট পাওয়া যায়নি</p>
              <p className="text-xs text-zinc-500">অন্য ইন্ডাস্ট্রি বা MOQ ফিল্টার নির্বাচন করুন</p>
              <button
                onClick={() => {
                  setSelectedIndustry('all');
                  setSelectedMoqFilter('all');
                  setSearch('');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold active:scale-95 transition-all cursor-pointer"
              >
                ফিল্টার রিসেট
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => {
                const vendor = product.vendor;
                return (
                  <div
                    key={product.id}
                    className="rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] hover:border-zinc-700 p-4 space-y-3 transition-all duration-200 shadow-sm"
                  >
                    {/* Top Row: Product Lot Media & Supplier Header */}
                    <div className="flex gap-3">
                      <div className="relative w-28 h-28 rounded-2xl bg-zinc-900 overflow-hidden shrink-0 border border-[var(--pm-border)]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-black text-amber-400">
                          MOQ: {product.moq} পিস
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        {/* Supplier Info */}
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-semibold truncate">
                          <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate">{vendor.factory_name}</span>
                          {vendor.trade_license_verified && (
                            <span title="ভেরিফাইড ট্রেড লাইসেন্স" className="inline-flex">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-black text-[var(--pm-text)] line-clamp-2 leading-snug">
                          {product.name}
                        </h3>

                        {/* Location & Rating */}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 pt-0.5">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-rose-400" /> {product.factory_location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                            <Star className="w-3 h-3 fill-amber-400" /> {vendor.rating} ({vendor.review_count})
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">রেসপন্স: {vendor.response_rate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: BULK TIER PRICING TABLE */}
                    <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 pb-1 border-b border-[var(--pm-border)]">
                        <span>অর্ডার লট পরিধি (Tier)</span>
                        <span>কারখানা পাইকারি দর</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {product.tier_pricing.map((tier, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded-xl border text-xs ${
                              idx === product.tier_pricing.length - 1
                                ? 'bg-blue-500/10 border-blue-500/30 text-blue-300 font-black'
                                : 'bg-[var(--pm-card)] border-[var(--pm-border)] text-[var(--pm-text)]'
                            }`}
                          >
                            <p className="text-[10px] text-zinc-400 truncate">{tier.range}</p>
                            <p className="text-xs font-black mt-0.5">৳{tier.unit_price.toLocaleString('bn-BD')}</p>
                            {tier.discount_percent > 0 && (
                              <span className="text-[9px] text-emerald-400 font-bold">
                                -{tier.discount_percent}% ছাড়
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Metadata: Lead time, Certifications */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-400 pt-0.5">
                      <span className="flex items-center gap-1 font-semibold text-zinc-300">
                        <Clock className="w-3 h-3 text-amber-400" /> লিড টাইম: {product.lead_time}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold truncate max-w-[200px]">
                        <ShieldCheck className="w-3 h-3" /> {product.factory_certifications[0]}
                      </span>
                    </div>

                    {/* Action Buttons: "Request Quotation (RFQ)" & "Chat with Supplier" */}
                    <div className="pt-1 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenChat(product)}
                        className="py-2.5 px-3 rounded-xl bg-[var(--pm-surface)] hover:bg-zinc-800 border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                        সাপ্লায়ারের সাথে চ্যাট
                      </button>

                      <button
                        onClick={() => handleOpenRfq(product)}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        কোটেশন চান (RFQ)
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ━━━ RFQ SUBMISSION MODAL ━━━ */}
      <AnimatePresence>
        {isRfqOpen && selectedProductForRfq && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRfqOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-lg bg-[var(--pm-surface)] rounded-t-3xl sm:rounded-3xl border border-[var(--pm-border)] p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--pm-border)]">
                <div>
                  <h3 className="text-base font-black text-[var(--pm-text)]">
                    বাল্ক কোটেশন রিকোয়েস্ট (RFQ)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {selectedProductForRfq.vendor.factory_name} বরাবর রিকোয়েস্ট
                  </p>
                </div>
                <button
                  onClick={() => setIsRfqOpen(false)}
                  className="w-8 h-8 rounded-xl bg-[var(--pm-card)] flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product Reference Strip */}
              <div className="p-3 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center gap-3">
                <img
                  src={selectedProductForRfq.image}
                  alt={selectedProductForRfq.name}
                  className="w-14 h-14 rounded-xl object-cover border border-[var(--pm-border)] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[var(--pm-text)] truncate">{selectedProductForRfq.name}</p>
                  <p className="text-[11px] text-zinc-400">নূন্যতম MOQ: {selectedProductForRfq.moq} পিস · লিড টাইম: {selectedProductForRfq.lead_time}</p>
                  <p className="text-xs font-black text-blue-400 mt-0.5">বেস রেট: ৳{selectedProductForRfq.tier_pricing[0].unit_price.toLocaleString('bn-BD')} / পিস</p>
                </div>
              </div>

              <form onSubmit={handleSubmitRfq} className="space-y-3.5">
                {/* 1. Quantity & Target Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      অর্ডার পরিমাণ (পিস) * (MOQ: {selectedProductForRfq.moq})
                    </label>
                    <input
                      type="number"
                      required
                      min={selectedProductForRfq.moq}
                      value={rfqQuantity}
                      onChange={(e) => setRfqQuantity(parseInt(e.target.value, 10) || selectedProductForRfq.moq)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      টার্গেট একক দর (৳ ঐচ্ছিক)
                    </label>
                    <input
                      type="number"
                      value={rfqTargetPrice}
                      onChange={(e) => setRfqTargetPrice(e.target.value)}
                      placeholder={`টায়ার রেট: ৳${calculatedUnitPrice}`}
                      className="w-full px-3 py-2.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 2. Delivery District & Freight Mode */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    ডেলিভারি জেলা ও গন্তব্য *
                  </label>
                  <select
                    value={rfqDeliveryDistrict}
                    onChange={(e) => setRfqDeliveryDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {DISTRICTS_BANGLADESH.map((dist) => (
                      <option key={dist} value={dist}>{dist} জেলা</option>
                    ))}
                  </select>
                </div>

                {/* 3. B2B Payment Terms (Wholesale Credit / LC / Bank Transfer) */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    পেমেন্ট ও ক্রেডিট শর্তাবলী (Payment Terms) *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'wholesale_credit', label: 'ট্রেড ক্রেডিট / এসক্রো', desc: 'নিরাপদ ডেলিভারি গ্যারান্টি' },
                      { id: 'lc', label: 'LC (লেটার অফ ক্রেডিট)', desc: 'ব্যাংক গ্যারান্টিযুক্ত' },
                      { id: 'bank_transfer', label: 'RTGS / ব্যাংক ট্রান্সফার', desc: 'সরাসরি অ্যাকাউন্ট' }
                    ].map((term) => (
                      <div
                        key={term.id}
                        onClick={() => setRfqPaymentTerms(term.id as any)}
                        className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                          rfqPaymentTerms === term.id
                            ? 'bg-blue-500/10 border-blue-500 text-blue-300 ring-1 ring-blue-500'
                            : 'bg-[var(--pm-card)] border-[var(--pm-border)] text-zinc-400'
                        }`}
                      >
                        <p className="text-xs font-bold">{term.label}</p>
                        <p className="text-[9px] text-zinc-500 mt-0.5">{term.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Buyer Details */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[11px] font-bold text-zinc-300 mb-1">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      value={rfqBuyerName}
                      onChange={(e) => setRfqBuyerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[11px] font-bold text-zinc-300 mb-1">প্রতিষ্ঠান / শপ *</label>
                    <input
                      type="text"
                      required
                      value={rfqBuyerCompany}
                      onChange={(e) => setRfqBuyerCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[11px] font-bold text-zinc-300 mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      value={rfqBuyerPhone}
                      onChange={(e) => setRfqBuyerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 5. Custom Specs / Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 mb-1">অতিরিক্ত স্পেক্স বা কাস্টমাইজেশন (ঐচ্ছিক)</label>
                  <textarea
                    rows={2}
                    value={rfqNotes}
                    onChange={(e) => setRfqNotes(e.target.value)}
                    placeholder="যেমন: নিজস্ব ব্র্যান্ড লোগো প্রিন্ট, নির্দিষ্ট কালার রেশিও বা প্যাকিং নির্দেশনা..."
                    className="w-full p-2.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Financial Summary Preview */}
                <div className="p-3 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>প্রস্তাবিত একক দর:</span>
                    <span className="font-bold text-[var(--pm-text)]">৳{calculatedUnitPrice.toLocaleString('bn-BD')} / পিস</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>লট সাবটোটাল ({rfqQuantity} পিস):</span>
                    <span className="font-bold text-[var(--pm-text)]">৳{calculatedSubtotal.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>আনুমানিক AIT / ট্যাক্স (৫%):</span>
                    <span className="font-bold text-amber-400">৳{calculatedAitTax.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[var(--pm-text)] pt-1.5 border-t border-[var(--pm-border)]">
                    <span>সর্বমোট PO ড্রাফট মূল্য:</span>
                    <span className="text-blue-400">৳{calculatedGrandTotal.toLocaleString('bn-BD')}</span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmittingRfq}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                >
                  {isSubmittingRfq ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> RFQ সাবমিট ও পারচেজ অর্ডার (PO) ড্রাফট তৈরি করুন
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ━━━ B2B PURCHASE ORDER (PO) DRAFT RECEIPT MODAL ━━━ */}
      <AnimatePresence>
        {generatedPoDraft && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] p-6 space-y-4 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="text-center space-y-1 pb-3 border-b border-[var(--pm-border)]">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[var(--pm-text)]">
                  B2B পারচেজ অর্ডার (PO) ড্রাফট প্রস্তুত
                </h3>
                <p className="text-[11px] font-mono text-blue-400">
                  {generatedPoDraft.poNumber} · {generatedPoDraft.rfqId}
                </p>
              </div>

              {/* Parties Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">ক্রেতা / বায়ার</p>
                  <p className="font-bold text-[var(--pm-text)]">{generatedPoDraft.buyer.company}</p>
                  <p className="text-[11px] text-zinc-400">{generatedPoDraft.buyer.name} · {generatedPoDraft.buyer.phone}</p>
                  <p className="text-[10px] text-zinc-500">গন্তব্য: {generatedPoDraft.buyer.district}</p>
                </div>
                <div className="p-3 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">সাপ্লায়ার / ফ্যাক্টরি</p>
                  <p className="font-bold text-[var(--pm-text)]">{generatedPoDraft.supplier.factoryName}</p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> {generatedPoDraft.supplier.tradeLicense}
                  </p>
                  <p className="text-[10px] text-zinc-500">{generatedPoDraft.supplier.location}</p>
                </div>
              </div>

              {/* Itemized Financials */}
              <div className="p-3.5 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-2 text-xs">
                <div className="pb-1.5 border-b border-[var(--pm-border)]">
                  <p className="font-bold text-[var(--pm-text)]">{generatedPoDraft.product.name}</p>
                  <p className="text-[11px] text-zinc-400">পরিমাণ: {generatedPoDraft.financials.quantity} পিস · একক দর: ৳{generatedPoDraft.financials.unitPrice}</p>
                </div>

                <div className="space-y-1 text-zinc-400 text-[11px]">
                  <div className="flex justify-between">
                    <span>লট সাবটোটাল:</span>
                    <span className="font-bold text-[var(--pm-text)]">৳{generatedPoDraft.financials.subtotal.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AIT ও প্রাক্কলিত ভ্যাট (৫%):</span>
                    <span className="font-bold text-amber-400">৳{generatedPoDraft.financials.estimatedAitVat.toLocaleString('bn-BD')}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[var(--pm-border)] text-xs font-black text-[var(--pm-text)]">
                    <span>সর্বমোট ইনভয়েস ভ্যালু:</span>
                    <span className="text-blue-400">৳{generatedPoDraft.financials.grandTotal.toLocaleString('bn-BD')}</span>
                  </div>
                </div>
              </div>

              {/* Payment & Credit Terms */}
              <div className="p-3 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-[11px] space-y-1">
                <span className="text-zinc-500">নির্বাচিত পেমেন্ট শর্ত:</span>
                <p className="font-bold text-blue-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {generatedPoDraft.paymentTermsLabel}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    toast.success("PO ড্রাফট কপি ডাউনলোড হয়েছে!");
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[var(--pm-surface)] hover:bg-zinc-800 border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> ডাউনলোড PO
                </button>
                <button
                  onClick={() => setGeneratedPoDraft(null)}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 text-white text-xs font-black shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  ঠিক আছে, বন্ধ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ━━━ CHAT WITH SUPPLIER MODAL ━━━ */}
      <AnimatePresence>
        {chatSupplierProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setChatSupplierProduct(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md h-[550px] rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col justify-between shadow-2xl z-10 overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-3.5 border-b border-[var(--pm-border)] flex items-center justify-between bg-[var(--pm-card)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-[var(--pm-text)] truncate flex items-center gap-1">
                      {chatSupplierProduct.vendor.factory_name}
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </p>
                    <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> লাইভ সাপ্লায়ার সাপোর্ট · রেসপন্স: {chatSupplierProduct.vendor.response_rate}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setChatSupplierProduct(null)}
                  className="w-7 h-7 rounded-lg bg-[var(--pm-surface)] flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Product Inquired Bar */}
              <div className="px-3 py-2 bg-blue-500/10 border-b border-blue-500/20 flex items-center justify-between text-[11px]">
                <span className="text-zinc-300 truncate max-w-[240px]">আলোচিত পণ্য: {chatSupplierProduct.name}</span>
                <span className="font-bold text-blue-400">MOQ: {chatSupplierProduct.moq} পিস</span>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'buyer' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'buyer'
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-zinc-500 px-1 mt-0.5">{msg.time}</span>
                  </div>
                ))}
                {isSendingChat && (
                  <div className="text-[11px] text-zinc-500 italic">সাপ্লায়ার টাইপ করছেন...</div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-[var(--pm-border)] bg-[var(--pm-card)] flex items-center gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChatMessage();
                  }}
                  placeholder="আপনার মেসেজ বা প্রাইস অফার লিখুন..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendChatMessage}
                  className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default B2BHome;
