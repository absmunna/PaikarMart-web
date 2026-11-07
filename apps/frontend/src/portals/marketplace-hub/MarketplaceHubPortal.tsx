import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Search, Sparkles, Filter, ChevronRight, 
  Building2, ShieldCheck, Truck, Factory, Globe, 
  Boxes, Package, ArrowUpRight, CheckCircle2, 
  MapPin, Star, Tag, Layers, SlidersHorizontal, 
  ChevronDown, Send, PlusCircle, Check, Store, Activity, 
  Wrench, Laptop, Cpu, Coins, Award, Heart, HelpCircle, FileText, RefreshCw, Eye,
  PlayCircle, Monitor, Newspaper
} from 'lucide-react';
import { MARKETPLACE_CATEGORIES } from './config/marketplaceCategories.config';

import { MARKETPLACE_PORTALS } from './config/marketplacePortals.config';
import { MARKETPLACE_SELLER_TYPES } from './config/marketplaceSellers.config';
import { mockProducts } from '@/core/lib/workspace-stub';
import { useCartStore } from '@/modules/cart';
import { toast } from 'sonner';
import { SubPortalNav } from '@/design-system/components/navigation/SubPortalNav';
import { UnifiedPostCard } from '@/design-system/components/feed/UnifiedPostCard';
import { ProductGridSkeleton } from '@/app/AppShell/GlobalSkeletonSystem';

export default function MarketplaceHubPortal() {
  const navigate = useNavigate();
  const [activePortal, setActiveSubPortal] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Custom RFQ / Prescriptions state
  const [rfqTitle, setRfqTitle] = useState('');
  const [rfqQty, setRfqQty] = useState('');
  const [rfqPhone, setRfqPhone] = useState('');
  const [uploadedPrescription, setUploadedPrescription] = useState<string | null>(null);
  
  // Cart connection
  const addItem = useCartStore((state) => state.addItem);

  // Active Category Data
  const currentCategoryData = useMemo(() => {
    return MARKETPLACE_CATEGORIES.find(c => c.id === selectedCategory) || MARKETPLACE_CATEGORIES[0];
  }, [selectedCategory]);

  // Handle Quick Add to cart
  const handleQuickAdd = (product: any) => {
    addItem({
      id: product.id,
      title: product.name || product.title,
      price: product.price,
      image: product.image,
      store: product.seller || 'Verified Seller',
      quantity: 1
    });
    toast.success(`${product.name || product.title} কার্টে যোগ করা হয়েছে`);
  };

  // Randomized shuffle for main 'All' feed
  const [allProductsShuffled, setAllProductsShuffled] = useState<any[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Seed / Shuffle products on mount or manual trigger
  const shuffleAndSetProducts = () => {
    setIsInitialLoading(true);
    setTimeout(() => {
      const list = [...mockProducts];
      // Simple randomized sorting
      const shuffled = list.sort(() => Math.random() - 0.5);
      setAllProductsShuffled(shuffled);
      setIsInitialLoading(false);
      toast.info('ফিড সফলভাবে আপডেট করা হয়েছে!');
    }, 600);
  };

  useEffect(() => {
    shuffleAndSetProducts();
  }, []);

  // Filter Products Dynamically based on activePortal and query
  const filteredProducts = useMemo(() => {
    let sourceList = activePortal === 'all' ? allProductsShuffled : mockProducts;
    
    // 1. Portal filtering
    if (activePortal === 'wholesale') {
      sourceList = sourceList.filter(p => p.type === 'wholesale' || p.portal === 'wholesale' || (p.moq && p.moq > 1));
    } else if (activePortal === 'retail') {
      sourceList = sourceList.filter(p => p.type === 'retail' || p.portal === 'fashion' || p.portal === 'electronics');
    } else if (activePortal === 'pk-shop') {
      // Products tagged with premium ratings or high quality
      sourceList = sourceList.filter(p => p.rating && p.rating >= 4.8 && (p.price > 800 || p.type === 'retail'));
    } else if (activePortal === 'brands') {
      // Official brands filter
      const officialBrands = ['Aarong', 'Bata', 'Apple', 'Samsung', 'Walton', 'Vision', 'Sultan\'s Dine', 'Pizza Hut', 'Uber', 'Pathao', 'RedX'];
      sourceList = sourceList.filter(p => officialBrands.includes(p.seller || ''));
    } else if (activePortal === 'nearby') {
      // Local foods/rides/fresh produce
      sourceList = sourceList.filter(p => p.portal === 'food' || p.portal === 'ride' || p.id === '1' || p.id === '10');
    } else if (activePortal === 'pharmacy') {
      sourceList = sourceList.filter(p => p.portal === 'pharmacy');
    } else if (activePortal === 'grocery') {
      sourceList = sourceList.filter(p => p.portal === 'grocery' || p.portal === 'agriculture' || p.id === '5' || p.id === '10');
    } else if (activePortal === 'services') {
      sourceList = sourceList.filter(p => p.portal === 'services' || p.type === 'service');
    } else if (activePortal === 'digital') {
      sourceList = sourceList.filter(p => p.portal === 'digital' || p.type === 'digital');
    }

    // 2. Search filtering
    if (searchQuery) {
      sourceList = sourceList.filter(p => 
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.seller || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 3. Category filtering if selected (and not all)
    if (selectedCategory !== 'all') {
      const matchCat = MARKETPLACE_CATEGORIES.find(c => c.id === selectedCategory);
      if (matchCat) {
        sourceList = sourceList.filter(p => 
          p.category?.toLowerCase() === matchCat.nameBn.toLowerCase() || 
          p.category?.toLowerCase() === matchCat.id.toLowerCase() ||
          p.portal?.toLowerCase() === matchCat.id.toLowerCase()
        );
      }
    }

    return sourceList;
  }, [activePortal, allProductsShuffled, searchQuery, selectedCategory]);

  // Data for the beautiful portal grid
  const MOBILE_SUPER_HUBS = [
    { id: 'video', name: 'ভিডিও কমার্স', path: '/video', icon: PlayCircle, gradient: 'from-rose-500 to-red-600' },
    { id: 'wholesale', name: 'পাইকারি আড়ত', path: '/wholesale', icon: Building2, gradient: 'from-blue-600 to-indigo-700' },
    { id: 'retail', name: 'খুচরা মার্কেট', path: '/shop', icon: Store, gradient: 'from-orange-500 to-amber-600' },
    { id: 'nearby', name: 'লোকাল শপ', path: '/nearby', icon: MapPin, gradient: 'from-emerald-500 to-teal-700' },
    { id: 'services', name: 'সার্ভিস হাব', path: '/services', icon: Wrench, gradient: 'from-purple-500 to-pink-600' },
    { id: 'digital', name: 'ডিজিটাল গুডস', path: '/digital', icon: Monitor, gradient: 'from-cyan-500 to-blue-600' },
    { id: 'pk-shop', name: 'পিকে স্টোর', path: '/pk-shop', icon: Star, gradient: 'from-yellow-500 to-amber-600' },
    { id: 'feed', name: 'সোশ্যাল ফিড', path: '/', icon: Newspaper, gradient: 'from-rose-500 to-pink-600' },
    { id: 'demand', name: 'ডিমান্ড বোর্ড', path: '/demand', icon: Send, gradient: 'from-red-500 to-orange-600' },
    { id: 'wallet', name: 'সুপার ওয়ালেট', path: '/wallet', icon: Coins, gradient: 'from-violet-500 to-purple-700' },
  ];

  return (
    <div className="w-full pb-20 space-y-6 bg-[var(--pm-bg)] min-h-screen text-[var(--pm-text)] select-none">

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 pt-4">

        {/* 1. Super App 10-Portal Grid (Beautiful Icons moved from Market Page) */}
        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
              মার্কেটপ্লেস পোর্টাল হাব
            </span>
          </div>

          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {MOBILE_SUPER_HUBS.map((hub) => {
              const Icon = hub.icon;
              return (
                <div
                  key={hub.id}
                  onClick={() => navigate(hub.path)}
                  className="flex flex-col items-center gap-1.5 group active:scale-95 transition-transform cursor-pointer"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${hub.gradient} flex items-center justify-center text-white shadow-md shadow-black/20 group-hover:scale-105 transition-all border border-white/10`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2px]" />
                  </div>
                  <span className="text-[9px] font-bold text-center text-zinc-300 leading-tight line-clamp-1 group-hover:text-[var(--pm-accent)]">
                    {hub.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Interactive Banner based on Active Sub-Portal */}
        <div className="relative rounded-3xl overflow-hidden border border-[var(--pm-border)] bg-[var(--pm-card)] p-6 sm:p-8 shadow-2xl">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-[var(--pm-accent-soft)] rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--pm-accent)]">
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>PaikarMart Universal Hub Discovery</span>
            </div>
            
            {activePortal === 'all' && (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--pm-text)] leading-tight">
                  সব পোর্টালের পণ্য এক ছাদের নিচে, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">র‍্যান্ডম মিক্সড লাইভ ফিড</span>
                </h2>
                <p className="text-[var(--pm-text-secondary)] text-xs sm:text-sm leading-relaxed">
                  পাইকারি লট, খুচরা প্রডাক্ট, প্রিমিয়াম ব্রান্ড, অর্গানিক গ্রোসারি এবং ভেরিফাইড ফার্মেসী মেডিসিনসহ সব ক্যাটাগরির লাইভ ফিড একসাথে স্ক্রোল করুন। 
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={shuffleAndSetProducts}
                    className="px-4 py-2 bg-[var(--pm-card-hover)] border border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text)] text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> মিক্সড ফিড রিলোড করুন
                  </button>
                </div>
              </>
            )}

            {activePortal === 'wholesale' && (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--pm-text)] leading-tight">
                  দালালমুক্ত <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">মিল-গেট পাইকারি মূল্য</span> এবং B2B আড়ত
                </h2>
                <p className="text-[var(--pm-text-secondary)] text-xs sm:text-sm leading-relaxed">
                  গার্মেন্টস এক্সপোর্ট কোয়ালিটি লট, গ্যাজেট ইমপোর্ট ব্যাচ এবং এগ্রো বড় আড়তের পণ্য সরাসরি প্রস্তুতকারকদের কাছ থেকে সংগ্রহ করুন। নিরাপদ এসক্রো সিকিউরড পেমেন্ট গ্যারান্টি।
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsRfqOpen(true)}
                    className="px-4 py-2 bg-[var(--pm-accent)] hover:brightness-110 text-white text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[var(--pm-accent)]/25"
                  >
                    <PlusCircle className="w-4 h-4" /> বাল্ক ডিমান্ড / RFQ কোটেশন দিন
                  </button>
                </div>
              </>
            )}

            {activePortal === 'retail' && (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--pm-text)] leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">খুচরা ট্রেন্ডিং ও রিটেইল</span> স্পটলাইট মার্কেট
                </h2>
                <p className="text-[var(--pm-text-secondary)] text-xs sm:text-sm leading-relaxed">
                  কোনো ন্যূনতম লিমিট ছাড়াই একক পিস কেনাকাটায় দ্রুততম ক্যাশ অন ডেলিভারি। বিকাশ, নগদ ও কার্ড পেমেন্টে ১০% পর্যন্ত ইনস্ট্যান্ট ক্যাশব্যাক অফার চলমান।
                </p>
                <div className="flex gap-2">
                  <Link 
                    to="/b2c" 
                    className="px-4 py-2 bg-[var(--pm-accent)] hover:brightness-110 text-white text-xs font-black rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    সবচেয়ে বেশি বিক্রিত পণ্যসমূহ <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            )}

            {activePortal === 'pk-shop' && (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--pm-text)] leading-tight">
                  পিকে স্টোর <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">এক্সক্লুসিভ খাঁটি ও প্রিমিয়াম</span> কালেকশন
                </h2>
                <p className="text-[var(--pm-text-secondary)] text-xs sm:text-sm leading-relaxed">
                  পাইকারমার্টের নিজস্ব ল্যাব-পরীক্ষিত এবং সার্টিফাইড প্রিমিয়াম ফুড গ্রেড, সুন্দরবনের প্রাকৃতিক মধু ও ঐতিহ্যবাহী হস্তশিল্প। প্রতিটি কেনাকাটায় ৫% নিশ্চিত মার্ট কয়েন রিওয়ার্ড।
                </p>
                <div className="flex gap-2 text-xs font-black text-amber-400 items-center">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> শতভাগ রাসায়নিক মুক্ত গ্যারান্টি · ল্যাব সার্টিফাইড লট
                </div>
              </>
            )}

            {activePortal === 'brands' && (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--pm-text)] leading-tight">
                  শীর্ষ <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-fuchsia-400">দেশী ও বিদেশী ব্রান্ড শোরুম</span>
                </h2>
                <p className="text-[var(--pm-text-secondary)] text-xs sm:text-sm leading-relaxed">
                  আড়ং, বাটা, স্যামসাং, অ্যাপল এবং ইউনিলিভারের মতো স্বনামধন্য ব্রান্ডের অফিশিয়াল শপ ও ফ্ল্যাগশিপ পণ্য কিনুন শতভাগ ম্যানুফ্যাকচারার ওয়ারেন্টি ও সরাসরি সাপোর্ট সুবিধাসহ।
                </p>
                <div className="flex gap-2 text-xs font-black text-pink-400 items-center">
                  <ShieldCheck className="w-4 h-4" /> অফিসিয়াল শপ ওয়ারেন্টি · ইজি রিটার্ন পলিসি
                </div>
              </>
            )}

            {activePortal === 'nearby' && (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--pm-text)] leading-tight">
                  আপনার <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">আশেপাশের লোকাল শপ ও রেস্টুরেন্ট</span>
                </h2>
                <p className="text-[var(--pm-text-secondary)] text-xs sm:text-sm leading-relaxed">
                  আপনার এলাকার সুপারশপ, কাঁচাবাজার ও রেস্টুরেন্ট থেকে মাত্র ৩০ মিনিটে হোম ডেলিভারি অথবা ইনস্ট্যান্ট পিকআপের চমৎকার সুবিধা। রিয়েল-টাইম জিপিএস ট্র্যাকিং সাপোর্ট।
                </p>
                <div className="flex gap-2 text-xs font-black text-emerald-400 items-center">
                  <MapPin className="w-4 h-4" /> আপনার নিকটবর্তী এলাকায় ১০০+ ভেরিফাইড আউটলেট সচল আছে
                </div>
              </>
            )}

            {activePortal === 'pharmacy' && (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--pm-text)] leading-tight">
                  ভেরিফাইড <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">মেডিসিন ও অনলাইন ফার্মেসি</span> পোর্টাল
                </h2>
                <p className="text-[var(--pm-text-secondary)] text-xs sm:text-sm leading-relaxed">
                  স্কয়ার ও বেক্সিমকোর মতো শীর্ষ ফার্মাসিউটিক্যালসের প্রেশক্রিপশন ও ওটিসি ওষুধ সরাসরি রেজিস্টার্ড ফার্মেসি থেকে সংগ্রহ করুন। প্রেশক্রিপশন আপলোড করলে অভিজ্ঞ ফার্মাসিস্ট ওষুধ সিলেক্ট করবে।
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <label className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-teal-600/35">
                    <PlusCircle className="w-4 h-4" />
                    <span>প্রেসক্রিপশন আপলোড করুন (Upload Prescription)</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadedPrescription(e.target.files[0].name);
                          toast.success('প্রেসক্রিপশন সফলভাবে আপলোড হয়েছে! আমাদের রেজিস্টার্ড ফার্মাসিস্ট দ্রুত যোগাযোগ করবে।');
                        }
                      }}
                    />
                  </label>
                  {uploadedPrescription && (
                    <span className="text-xs font-black text-teal-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> {uploadedPrescription}
                    </span>
                  )}
                </div>
              </>
            )}

            {activePortal === 'grocery' && (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--pm-text)] leading-tight">
                  তাজা <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">গ্রোসারি বাজার ও খামার-তাজা</span> খাদ্য সামগ্রী
                </h2>
                <p className="text-[var(--pm-text-secondary)] text-xs sm:text-sm leading-relaxed">
                  কারওয়ান বাজার ও ডিরেক্ট খামার সোর্স থেকে সংগৃহীত বাসমতি চালের বস্তা, ঘানি ভাঙা সরিষার তেল, ফ্রেশ সবজি ও তাজা মাছ-মাংস সরাসরি আপনার দোরগোড়ায়।
                </p>
                <div className="flex gap-2 text-xs font-black text-amber-400 items-center">
                  <CheckCircle2 className="w-4 h-4" /> ১০০% অর্গানিক এবং প্রিজারভেটিভস মুক্ত খাদ্য গ্যারান্টি
                </div>
              </>
            )}

            {activePortal === 'services' && (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--pm-text)] leading-tight">
                  ভেরিফাইড <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">অন-ডিমান্ড ডিজিটাল সার্ভিস</span> পোর্টাল
                </h2>
                <p className="text-[var(--pm-text-secondary)] text-xs sm:text-sm leading-relaxed">
                  অভিজ্ঞ এসি টেকনিশিয়ান, কারেন্ট মেকানিক, প্লাম্বার, হাউজ শিফটিং মেম্বার্স এবং আইটি ওয়েব ডেভেলপার টিম সার্ভিস বুকিং করুন এক ক্লিনিকে। প্রতি সার্ভিস বুকিংয়ে এসক্রো নিরাপত্তা ও সেলার ট্র্যাকিং।
                </p>
                <div className="flex gap-2 text-xs font-black text-purple-400 items-center">
                  <CheckCircle2 className="w-4 h-4" /> ব্যাকগ্রাউন্ড-চেকড ও সার্টিফাইড সার্ভিস প্রোভাইডার্স
                </div>
              </>
            )}

            {activePortal === 'digital' && (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--pm-text)] leading-tight">
                  সফটওয়্যার, টেমপ্লেট ও <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">ডিজিটাল লাইসেন্স মার্কেটপ্লেস</span>
                </h2>
                <p className="text-[var(--pm-text-secondary)] text-xs sm:text-sm leading-relaxed">
                  ওয়ার্ডপ্রেস প্রিমিয়াম প্লাগইন, ক্যানভা প্রো বাৎসরিক লাইসেন্স, রিয়্যাক্ট/নেক্সটজেএস কমপ্লিট সোর্স কোড ও ব্যবসায়িক ই-বুকস সংগ্রহ করুন। পেমেন্ট করা মাত্র তাৎক্ষণিক ইমেইলে ডাউনলোড লিঙ্ক ও লাইসেন্স কি সরবরাহ।
                </p>
                <div className="flex gap-2 text-xs font-black text-violet-400 items-center">
                  <CheckCircle2 className="w-4 h-4" /> তাৎক্ষণিক লাইসেন্স কি ডেলিভারি (Instant Email Dispatch)
                </div>
              </>
            )}

          </div>
        </div>

        {/* Categories / Search Bar Container */}
        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-4 shadow-lg flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="flex items-center bg-[var(--pm-bg)] px-3 py-1 rounded-2xl w-full md:w-auto h-11 border border-[var(--pm-border)] flex-1">
            <Search className="w-4.5 h-4.5 text-[var(--pm-muted)] mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="মার্কেটপ্লেস থেকে খুঁজুন..."
              className="w-full bg-transparent text-xs text-white placeholder:text-[var(--pm-muted)] outline-none font-bold"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0 select-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black shrink-0 border transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[var(--pm-accent)] text-white border-transparent'
                  : 'bg-[var(--pm-bg)] text-[var(--pm-text-secondary)] border-[var(--pm-border)] hover:text-[var(--pm-text)]'
              }`}
            >
              সব ক্যাটাগরি
            </button>
            {MARKETPLACE_CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-[10px] font-black shrink-0 border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[var(--pm-accent)] text-white border-transparent shadow-md'
                    : 'bg-[var(--pm-bg)] text-[var(--pm-text-secondary)] border-[var(--pm-border)] hover:text-[var(--pm-text)]'
                }`}
              >
                {cat.nameBn}
              </button>
            ))}
          </div>
        </div>

        {/* Combined Random Mix Feed / Specialized Grid Area */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-base font-black text-[var(--pm-text)] flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[var(--pm-accent)]" />
                <span>র‍্যান্ডম মিক্সড লাইভ ফিড</span>
              </h3>
              <p className="text-[10px] text-[var(--pm-text-secondary)] mt-1">
                {filteredProducts.length} টি পণ্য পাওয়া গেছে
              </p>
            </div>
            {activePortal === 'all' && (
              <button 
                onClick={shuffleAndSetProducts}
                className="text-[10px] font-black text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] flex items-center gap-1 border border-[var(--pm-border)] px-3 py-1.5 rounded-xl bg-[var(--pm-card-hover)] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> মিক্সড রিশাফেল
              </button>
            )}
          </div>

          {isInitialLoading ? (
            <ProductGridSkeleton />
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col items-center justify-center">
              <Boxes className="w-12 h-12 text-[var(--pm-muted)] mb-3 animate-bounce" />
              <p className="text-xs font-black text-[var(--pm-text)]">দুঃখিত, কোনো পণ্য খুঁজে পাওয়া যায়নি!</p>
              <p className="text-[10px] text-[var(--pm-muted)] font-bold mt-1">অনুগ্রহ করে অন্য কোনো ফিল্টার বা কী-ওয়ার্ড ট্রাই করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <UnifiedPostCard 
                  key={product.id}
                  post={{
                    id: product.id,
                    type: product.type === 'service' ? 'service' : 'product',
                    domain: (product.portal === 'wholesale' || (product.moq && product.moq > 1)) ? 'WHOLESALE' : 'RETAIL',
                    authorName: product.seller || 'Verified Seller',
                    authorAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${product.seller || 'seller'}`,
                    isVerified: true,
                    authorRole: product.type === 'service' ? 'সার্ভিস প্রোভাইডার' : 'ভেরিফাইড সেলার',
                    timestamp: 'Active',
                    content: product.description || `নতুন ${product.name || product.title} এখন আমাদের স্টোরে। সেরা মূল্যে সংগ্রহ করুন।`,
                    imageUrl: product.image,
                    location: product.location || 'Dhaka',
                    likes: product.rating ? Math.floor(product.rating * 20) : 0,
                    comments: 12,
                    product: {
                      id: product.id,
                      title: product.name || product.title,
                      price: product.price,
                      imageUrl: product.image,
                      moq: product.moq
                    },
                    metadata: {
                      isPkExclusive: ['1', '5', '10'].includes(product.id),
                      isOfficialBrand: ['Aarong', 'Bata', 'Apple', 'Samsung', 'Walton', 'Vision'].includes(product.seller || ''),
                      distance: '৪৫০ মি',
                      deliveryTime: '১৫ মিনিট',
                      discountTag: product.discount ? `${product.discount}% ছাড়` : undefined
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Seller Network Banner */}
        <section className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-[32px] p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--pm-accent)]">
                <Building2 className="w-3.5 h-3.5" /> 
                <span>Seller Network</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-[var(--pm-text)] leading-tight">
                Connect your business to the largest social commerce hub
              </h3>
              <p className="text-xs text-[var(--pm-text-secondary)] max-w-2xl leading-relaxed">
                কারখানা মালিক, আমদানিকারক ও খুচরা বিক্রেতা হিসেবে রেজিস্ট্রেশন করুন। একই অ্যাকাউন্ট দিয়ে পাইকারি আড়ত বা অনলাইন ব্র্যান্ড শোরুম পরিচালনা করুন।
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <Link
                to="/become-seller"
                className="px-5 py-3 rounded-2xl bg-[var(--pm-accent)] hover:brightness-110 text-white text-xs font-black shadow-lg shadow-[var(--pm-accent)]/25 transition-all"
              >
                সেলার অ্যাকাউন্ট খুলুন
              </Link>
            </div>
          </div>
        </section>

      </div>

      {/* RFQ Submission Modal */}
      <AnimatePresence>
        {isRfqOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-6 shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--pm-border)]">
                <div>
                  <h3 className="text-base font-black text-[var(--pm-text)]">নতুন বাল্ক কোটেশন (RFQ) রিকোয়েস্ট</h3>
                  <p className="text-[10px] text-[var(--pm-text-secondary)] mt-1">সবচেয়ে কম মূল্যে ভেরিফাইড পাইকারদের থেকে অফার পান</p>
                </div>
                <button
                  onClick={() => setIsRfqOpen(false)}
                  className="p-1 rounded-full text-[var(--pm-muted)] hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                toast.success('আপনার আরএফকিউ কোটেশন সফলভাবে সাবমিট হয়েছে!');
                setIsRfqOpen(false);
              }} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-[var(--pm-text-secondary)] uppercase">পণ্যের নাম ও বিবরণ *</label>
                  <input
                    required
                    type="text"
                    value={rfqTitle}
                    onChange={(e) => setRfqTitle(e.target.value)}
                    placeholder="যেমন: ১০০০ পিস এক্সপোর্ট কম্বড টি-শার্ট"
                    className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-[var(--pm-text-secondary)] uppercase">পরিমাণ (MOQ) *</label>
                    <input
                      required
                      type="text"
                      value={rfqQty}
                      onChange={(e) => setRfqQty(e.target.value)}
                      placeholder="যেমন: ৫০০ পিস"
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-[var(--pm-text-secondary)] uppercase">মোবাইল নম্বর *</label>
                    <input
                      required
                      type="tel"
                      value={rfqPhone}
                      onChange={(e) => setRfqPhone(e.target.value)}
                      placeholder="যেমন: ০১৭xxxxxxxx"
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRfqOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] text-xs font-bold"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[var(--pm-accent)] text-white text-xs font-black shadow-lg"
                  >
                    RFQ সাবমিট করুন
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
