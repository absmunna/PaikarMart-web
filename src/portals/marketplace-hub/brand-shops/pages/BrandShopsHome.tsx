import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ArrowLeft, ShieldCheck, Heart, MessageSquare, Share2, 
  MapPin, Star, Phone, MessageCircle, ExternalLink, Filter, ShoppingBag, Check
} from 'lucide-react';
import { useCartStore } from '@/modules/cart';
import { useCartDrawerStore } from '@/modules/cart/cartDrawerStore';

interface BrandShop {
  id: string;
  name: string;
  banglaName: string;
  logo: string;
  banner: string;
  rating: number;
  reviewsCount: number;
  followers: number;
  isFollowed?: boolean;
  onboardingYear: number;
  salesVolume: string;
  address: string;
  category: string;
  type: 'b2b' | 'b2c' | 'both';
  badge: string;
  description: string;
  products: BrandProduct[];
}

interface BrandProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  moq?: number;
  coinCashback?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  type: 'b2b' | 'b2c';
}

const BRAND_SHOPS: BrandShop[] = [
  {
    id: 'brand-aarong',
    name: 'Aarong Handlooms',
    banglaName: 'আড়ং ক্রাফটস',
    logo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    rating: 4.9,
    reviewsCount: 1450,
    followers: 12400,
    onboardingYear: 2021,
    salesVolume: '৫০ লক্ষ+',
    address: 'তেজগাঁও শিল্প এলাকা, ঢাকা',
    category: 'ফ্যাশন ও লাইফস্টাইল',
    type: 'b2c',
    badge: 'অফিসিয়াল সুপারব্র্যান্ড',
    description: 'আড়ং বাংলাদেশের লোকজ ঐতিহ্য এবং আধুনিক ফ্যাশনের এক অনন্য মেলবন্ধন। প্রতিটি সুতোয় বোনা আমাদের নিজস্ব ঐতিহ্য ও সংস্কৃতি।',
    products: [
      {
        id: 'brand-p1',
        name: 'সিল্ক এমব্রয়ডারি জমকালো শাড়ি',
        price: 8500,
        originalPrice: 11000,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop',
        rating: 4.9,
        reviewsCount: 320,
        category: 'শাড়ি',
        type: 'b2c'
      },
      {
        id: 'brand-p2',
        name: 'প্রিমিয়াম কটন ট্র্যাডিশনাল পাঞ্জাবি',
        price: 3200,
        originalPrice: 4200,
        image: 'https://images.unsplash.com/photo-1597983073499-4d8749f2ca9f?w=400&h=400&fit=crop',
        rating: 4.8,
        reviewsCount: 247,
        category: 'পাঞ্জাবি',
        type: 'b2c'
      },
      {
        id: 'brand-p3',
        name: 'হস্তশিল্প মাটির ট্রাভেল ব্যাগ সেট',
        price: 4500,
        originalPrice: 5500,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
        rating: 4.7,
        reviewsCount: 94,
        category: 'ব্যাগ',
        type: 'b2c'
      }
    ]
  },
  {
    id: 'brand-pran',
    name: 'PRAN Agro Foods',
    banglaName: 'প্রাণ এগ্রো ফুডস',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    banner: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&h=400&fit=crop',
    rating: 4.8,
    reviewsCount: 3890,
    followers: 43200,
    onboardingYear: 2020,
    salesVolume: '২ কোটি+',
    address: 'প্রগতি সরণি, বাড্ডা, ঢাকা',
    category: 'মুদি ও খাদ্য পণ্য',
    type: 'both',
    badge: 'ন্যাশনাল গোল্ড মার্চেন্ট',
    description: 'প্রাণ বাংলাদেশের শীর্ষস্থানীয় খাদ্যপণ্য উৎপাদনকারী ব্র্যান্ড। খামারিদের কাছে থেকে সরাসরি সংগৃহীত তাজা ফল, শস্য ও দুগ্ধজাতীয় স্বাস্থ্যকর পণ্য।',
    products: [
      {
        id: 'brand-p4',
        name: 'প্রিমিয়াম মিনিকেট চাল (৫-টাকা ডিসকাউন্টে ৫০ কেজি বস্তা)',
        price: 3100,
        originalPrice: 3400,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
        moq: 10,
        coinCashback: 50,
        rating: 4.8,
        reviewsCount: 610,
        category: 'গ্রোসারি',
        type: 'b2b'
      },
      {
        id: 'brand-p5',
        name: 'খাঁটি সরিষার তেল বোতল (৫ লিটার - কার্টন প্যাক)',
        price: 1150,
        originalPrice: 1250,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
        moq: 5,
        coinCashback: 25,
        rating: 4.7,
        reviewsCount: 450,
        category: 'তেল',
        type: 'b2b'
      }
    ]
  },
  {
    id: 'brand-walton',
    name: 'Walton Digital',
    banglaName: 'ওয়ালটন ডিজিটাল',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    banner: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&h=400&fit=crop',
    rating: 4.7,
    reviewsCount: 2210,
    followers: 28500,
    onboardingYear: 2022,
    salesVolume: '১.৫ কোটি+',
    address: 'মতিঝিল বা/এ, ঢাকা',
    category: 'স্মার্ট ডিভাইসেস ও ইলেকট্রনিক্স',
    type: 'b2b',
    badge: 'মেগা ভেরিফায়েড সেলার',
    description: 'আমাদের পণ্য আমাদের গৌরব। আন্তর্জাতিক মানের হোম অ্যাপ্লায়েন্স এবং সর্বাধুনিক ডিজিটাল ডিভাইস নিয়ে ওয়ালটন সর্বদা আপনার পাশে দাঁড়িয়েছে।',
    products: [
      {
        id: 'brand-p6',
        name: 'ওয়ালটন স্মার্ট এলইডি অ্যান্ড্রয়েড টিভি ৩২"',
        price: 16500,
        originalPrice: 19500,
        image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop',
        moq: 2,
        coinCashback: 300,
        rating: 4.6,
        reviewsCount: 189,
        category: 'টিভি',
        type: 'b2b'
      },
      {
        id: 'brand-p7',
        name: 'প্রিমিয়াম স্মার্ট স্প্লিট এয়ার কন্ডিশনার ১.৫ টন',
        price: 44000,
        originalPrice: 49500,
        image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=400&h=400&fit=crop',
        moq: 1,
        coinCashback: 800,
        rating: 4.7,
        reviewsCount: 78,
        category: 'এসি',
        type: 'b2b'
      }
    ]
  },
  {
    id: 'brand-apex',
    name: 'Apex Footwear',
    banglaName: 'অ্যাপেক্স ফুটওয়্যার',
    logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    banner: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&h=400&fit=crop',
    rating: 4.85,
    reviewsCount: 1110,
    followers: 18900,
    onboardingYear: 2021,
    salesVolume: '৮০ লক্ষ+',
    address: 'গুলশান ১, ঢাকা',
    category: 'চামড়াজাত জুতো ও ফ্যাশন',
    type: 'b2c',
    badge: 'প্রাইড অফ ওরিজিনালস',
    description: 'প্রিমিয়াম কোয়ালিটি লেদার শু যা আপনার প্রতিটি পদক্ষেপকে করে তুলবে আরামদায়ক ও আভিজাত্যপূর্ণ। বাংলাদেশের অন্যতম বিশ্বস্ত জুতো ব্র্যান্ড।',
    products: [
      {
        id: 'brand-p8',
        name: 'অ্যান্টোনিও রিয়াল লেদার ড্রেস শু হিল',
        price: 4990,
        originalPrice: 6200,
        image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=400&fit=crop',
        rating: 4.9,
        reviewsCount: 182,
        category: 'ফরমাল',
        type: 'b2c'
      },
      {
        id: 'brand-p9',
        name: 'প্রিমিয়াম আরামদায়ক ক্যাসিন কেডস',
        price: 2890,
        originalPrice: 3500,
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop',
        rating: 4.8,
        reviewsCount: 312,
        category: 'কেডস',
        type: 'b2c'
      }
    ]
  },
  {
    id: 'brand-square',
    name: 'Square Organics',
    banglaName: 'স্কয়ার অর্গানিকস',
    logo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    banner: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&h=400&fit=crop',
    rating: 4.91,
    reviewsCount: 2950,
    followers: 35400,
    onboardingYear: 2020,
    salesVolume: '১.৮ কোটি+',
    address: 'উত্তরা মডেল টাউন, ঢাকা',
    category: 'মেডিসিন ও অ্যারোমা থেরাপি',
    type: 'both',
    badge: 'শতভাগ নির্ভরযোগ্য',
    description: 'সম্পূর্ণ অর্গানিক উপাদানে তৈরি পার্সোনাল কেয়ার, সৌন্দর্যচর্চা ও ভেষজ উপাদান। প্রতিটি ব্যবহারে সঠিক সুরক্ষার প্রতিশ্রুতি।',
    products: [
      {
        id: 'brand-p10',
        name: 'অর্গানিক কোকোনাট হেয়ার অয়েল (১৫-পিস কার্টন প্যাক)',
        price: 3600,
        originalPrice: 4500,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop',
        moq: 3,
        coinCashback: 100,
        rating: 4.9,
        reviewsCount: 210,
        category: 'পার্সোনাল কেয়ার',
        type: 'b2b'
      },
      {
        id: 'brand-p11',
        name: 'খাঁটি অ্যালোভেরা জেল রিফ্রেশিং সলিউশন',
        price: 220,
        originalPrice: 280,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        rating: 4.8,
        reviewsCount: 549,
        category: 'ফেস কেয়ার',
        type: 'b2c'
      }
    ]
  }
];

export default function BrandShopsHome() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'b2b' | 'b2c'>('all');
  const [selectedShop, setSelectedShop] = useState<BrandShop | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<BrandProduct | null>(null);
  
  // Follower increment system
  const [followedState, setFollowedState] = useState<Record<string, { count: number; following: boolean }>>(() => {
    const init: Record<string, { count: number; following: boolean }> = {};
    BRAND_SHOPS.forEach(s => {
      init[s.id] = { count: s.followers, following: false };
    });
    return init;
  });

  // Direct Message states
  const [isOpenChat, setIsOpenChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'brand'; text: string; time: string }>>([
    { sender: 'brand', text: 'আসসালামু আলাইকুম! পেইকার মার্টের অফিশিয়াল ব্র্যান্ড পোর্টালে আপনাকে স্বাগতম। আমরা কীভাবে আপনাকে সাহায্য করতে পারি?', time: 'ঠিক এখন' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Cart operations
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);

  const toggleFollow = (shopId: string) => {
    setFollowedState(prev => {
      const current = prev[shopId];
      if (current.following) {
        return {
          ...prev,
          [shopId]: { count: current.count - 1, following: false }
        };
      } else {
        return {
          ...prev,
          [shopId]: { count: current.count + 1, following: true }
        };
      }
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'ঠিক এখন' }]);
    setChatInput('');

    // Simulated reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'brand',
        text: 'ধন্যবাদ আপনার মেসেজের জন্য। আমাদের কাস্টমার রিলেশন টীম খুব দ্রুত আপনার প্রশ্নের উত্তর নিয়ে ফিরছে!',
        time: '১ সেকেন্ড আগে'
      }]);
    }, 1200);
  };

  const handleAddToCart = (product: BrandProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      portal: product.type === 'b2b' ? 'b2b' : 'b2c',
      coinCashback: product.coinCashback || 20,
    });
    // Trigger toast notification feedback
    openCart();
  };

  // Filtering shops based on tab & search
  const filteredShops = useMemo(() => {
    return BRAND_SHOPS.filter(shop => {
      const matchSearch = shop.name.toLowerCase().includes(search.toLowerCase()) ||
                          shop.banglaName.toLowerCase().includes(search.toLowerCase()) ||
                          shop.category.toLowerCase().includes(search.toLowerCase());
      const matchTab = activeTab === 'all' || 
                        shop.type === activeTab || 
                        shop.type === 'both';
      return matchSearch && matchTab;
    });
  }, [search, activeTab]);

  return (
    <div className="pt-2 pb-16 w-full max-w-[480px] mx-auto min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] relative">
      
      {/* Primary Directory View */}
      <AnimatePresence mode="wait">
        {!selectedShop ? (
          <motion.div
            key="directory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Header Area */}
            <div className="flex items-center gap-3 px-3 mb-4">
              <button 
                onClick={() => navigate('/')}
                className="w-8 h-8 rounded-full flex items-center justify-center border active:scale-95 transition-all cursor-pointer"
                style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="font-extrabold text-lg tracking-tight flex items-center gap-1.5 text-[var(--pm-text)]">
                  <ShieldCheck className="w-5 h-5 text-indigo-500 fill-indigo-500/20" /> ব্র্যান্ড শপ্স
                </h1>
                <p className="text-[11px] text-[var(--pm-text-secondary)]">ভেরিফাইড সুপারব্র্যান্ড ও ন্যাশনাল রিটেইল/B2B মার্চেন্ট ডিরেক্টরি</p>
              </div>
            </div>

            {/* Premium Gold Ribbon Sparkle banner */}
            <div className="px-3 mb-4">
              <div className="bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/30 rounded-2xl p-3 flex items-start gap-2.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-amber-500">শতভাগ কোয়ালিটি নিশ্চয়তা</span>
                  <p className="text-[11px] font-medium text-[var(--pm-text)]">এখানে তালিকাভুক্ত সকল দোকান মেগা-ভেরিফাইড এবং সরাসরি ব্র্যান্ড দ্বারা পরিচালিত।</p>
                </div>
              </div>
            </div>

            {/* Search Input Box */}
            <div className="px-3 mb-4">
              <div 
                className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 border shadow-xs transition-all focus-within:ring-2 focus-within:ring-indigo-500"
                style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
              >
                <Search className="w-4 h-4 text-[var(--pm-text-secondary)]" />
                <input 
                  type="text" 
                  placeholder="ব্র্যান্ডের নাম বা বিউটি, গ্রোসারি দিয়ে খুঁজুন..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 text-xs bg-transparent outline-none text-[var(--pm-text)]" 
                />
              </div>
            </div>

            {/* Horizontal Filter Tabs */}
            <div className="flex gap-2 px-3 pb-4">
              {[
                { id: 'all', label: 'সব ব্র্যান্ডস' },
                { id: 'b2b', label: 'পাইকারি (B2B)' },
                { id: 'b2c', label: 'খুচরা (B2C)' }
              ].map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as any)}
                  className="px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer"
                  style={activeTab === tab.id
                    ? { background: 'var(--pm-accent)', color: '#fff', borderColor: 'var(--pm-accent)' }
                    : { background: 'var(--pm-surface)', color: 'var(--pm-text-secondary)', borderColor: 'var(--pm-border)' }
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* list of registered official Brand shops */}
            <div className="px-3 space-y-3.5">
              {filteredShops.length === 0 ? (
                <div className="text-center py-16 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl">
                  <ShoppingBag className="w-10 h-10 mx-auto text-[var(--pm-text-secondary)] opacity-40 mb-3" />
                  <p className="text-xs font-semibold text-[var(--pm-text-secondary)]">কোনো ব্র্যান্ড দোকান পাওয়া যায়নি।</p>
                </div>
              ) : (
                filteredShops.map(shop => (
                  <motion.div 
                    key={shop.id}
                    layoutId={`shop-card-${shop.id}`}
                    onClick={() => setSelectedShop(shop)}
                    className="rounded-2xl border overflow-hidden flex flex-col cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 shadow-xs"
                    style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
                  >
                    {/* Header Image of Shop Card */}
                    <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                      <img 
                        referrerPolicy="no-referrer"
                        src={shop.banner} 
                        alt={shop.name} 
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className="absolute top-2.5 right-2.5 bg-indigo-650 bg-indigo-500 text-[9px] font-black text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {shop.type === 'both' ? 'B2B + B2C' : shop.type === 'b2b' ? 'B2B' : 'B2C'}
                      </span>
                      <div className="absolute bottom-2.5 left-3.5 flex items-center gap-2">
                        <img 
                          referrerPolicy="no-referrer"
                          src={shop.logo} 
                          alt={shop.name} 
                          className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-md bg-white"
                        />
                        <div>
                          <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                            {shop.banglaName} 
                            <ShieldCheck className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
                          </h4>
                          <p className="text-[9px] text-white/80">{shop.badge}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Brief Description */}
                    <div className="p-3">
                      <div className="flex items-center justify-between text-[10px] text-[var(--pm-text-secondary)] mb-2.5 border-b border-[var(--pm-border)]/50 pb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-[var(--pm-text)]">{shop.rating}</span>
                          <span>({shop.reviewsCount} রিভিউস)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3 text-indigo-400" />
                          <span>ভলিউম: </span>
                          <span className="font-bold text-indigo-400">{shop.salesVolume}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[var(--pm-text-secondary)] line-clamp-2 leading-relaxed mb-1.5">
                        {shop.description}
                      </p>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--pm-border)]/20">
                        <span className="text-[9px] font-semibold text-[var(--pm-accent)]">📍 {shop.address}</span>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-500/20 font-bold">{shop.category}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          /* Immersive Custom Brand Storefront View */
          <motion.div
            key="storefront"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            {/* Storefront Navigation Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--pm-border)]/40 mb-3">
              <button 
                onClick={() => setSelectedShop(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] active:scale-95 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> ফিরে যান
              </button>
              <span className="text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-bold">
                {selectedShop.badge}
              </span>
            </div>

            {/* Immersive Shop Banner Header */}
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
              <img 
                referrerPolicy="no-referrer"
                src={selectedShop.banner} 
                alt={selectedShop.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {/* Bottom shop info overlapping the banner */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    referrerPolicy="no-referrer"
                    src={selectedShop.logo} 
                    alt={selectedShop.name} 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-lg bg-white"
                  />
                  <div>
                    <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      {selectedShop.banglaName} 
                      <ShieldCheck className="w-4.5 h-4.5 text-sky-400 fill-sky-400/20" />
                    </h2>
                    <p className="text-[10px] text-white/80">স্থাপিত: {selectedShop.onboardingYear} • {selectedShop.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] bg-orange-500 text-white font-black px-1.5 py-0.1 rounded-md uppercase">
                        {selectedShop.type === 'both' ? 'B2B/B2C' : selectedShop.type === 'b2b' ? 'B2B Wholesale' : 'B2C Retail'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Follow Button */}
                <button 
                  onClick={() => toggleFollow(selectedShop.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer ${
                    followedState[selectedShop.id]?.following 
                    ? 'bg-transparent text-white border border-white/50' 
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  {followedState[selectedShop.id]?.following ? '✓ অনুসরণ করছেন' : '+ ফলো করুন'}
                </button>
              </div>
            </div>

            {/* Shop summary data indices */}
            <div className="grid grid-cols-3 gap-2 px-3 py-3 border-b border-[var(--pm-border)]/30" style={{ background: 'var(--pm-surface)' }}>
              <div className="text-center p-2 rounded-xl" style={{ background: 'var(--pm-bg)' }}>
                <p className="text-[9px] text-[var(--pm-text-secondary)]">গড় রেটিং</p>
                <p className="text-xs font-bold text-amber-400 flex items-center justify-center gap-0.5 mt-0.5">
                  ★ {selectedShop.rating}
                </p>
                <p className="text-[7px] text-[var(--pm-text-secondary)]">({selectedShop.reviewsCount} জন)</p>
              </div>
              <div className="text-center p-2 rounded-xl" style={{ background: 'var(--pm-bg)' }}>
                <p className="text-[9px] text-[var(--pm-text-secondary)]">ফলোয়ারস</p>
                <p className="text-xs font-bold text-[var(--pm-text)] mt-0.5">
                  {(followedState[selectedShop.id]?.count ?? selectedShop.followers).toLocaleString()}
                </p>
                <p className="text-[7px] text-[var(--pm-text-secondary)]">গ্রাহক সংখ্যা</p>
              </div>
              <div className="text-center p-2 rounded-xl" style={{ background: 'var(--pm-bg)' }}>
                <p className="text-[9px] text-[var(--pm-text-secondary)]">সেলার ভলিউম</p>
                <p className="text-xs font-bold text-indigo-400 mt-0.5">
                  {selectedShop.salesVolume}
                </p>
                <p className="text-[7px] text-[var(--pm-text-secondary)]">মোট ডেলিভারি</p>
              </div>
            </div>

            {/* Brief about store */}
            <div className="p-4 border-b border-[var(--pm-border)]/30">
              <h3 className="text-xs font-extrabold text-[var(--pm-text)] mb-1 flex items-center gap-1.5">
                📰 ব্র্যান্ডের পরিচিতি
              </h3>
              <p className="text-[11px] text-[var(--pm-text-secondary)] leading-relaxed">
                {selectedShop.description}
              </p>
              <div className="flex flex-col gap-1.5 mt-3 pt-2 text-[10px] text-[var(--pm-text-secondary)] border-t border-[var(--pm-border)]/20">
                <p className="flex items-center gap-1">📍 <span>প্রধান শো-রুম: <b>{selectedShop.address}</b></span></p>
                <p className="flex items-center gap-1">✉ <span>পেইকার ভেরিফাইড আইডি: <b>pm-verified-{(selectedShop.id).replace('brand-', '')}</b></span></p>
              </div>
            </div>

            {/* Floating Action CTA to Messenger Chat */}
            <div className="px-3 py-3 flex gap-2">
              <button 
                onClick={() => setIsOpenChat(true)}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" /> সরাসরি লাইভ চ্যাট
              </button>
              <a 
                href={`tel:+8801700000000`}
                className="w-12 h-10 rounded-xl border border-[var(--pm-border)] flex items-center justify-center cursor-pointer hover:bg-[var(--pm-surface)]"
              >
                <Phone className="w-4 h-4 text-cyan-500" />
              </a>
            </div>

            {/* Exclusive Product Grid for specific brand store */}
            <div className="p-3">
              <h3 className="text-xs font-extrabold text-[var(--pm-text)] mb-3 flex items-center gap-1.5 bg-indigo-500/5 px-2.5 py-1.5 rounded-xl border border-indigo-500/10">
                💎 বিশেষ এক্সক্লুসিভ কালেকশন ({selectedShop.products.length})
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {selectedShop.products.map(prod => (
                  <div 
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className="rounded-xl border overflow-hidden p-2 flex flex-col cursor-pointer transition-transform duration-200 hover:scale-98 relative"
                    style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)' }}
                  >
                    {/* Badge */}
                    <span className="absolute top-2 left-2 bg-indigo-500 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full z-10 border border-white/10">
                      {prod.type === 'b2b' ? 'Wholesale B2B' : 'Retail B2C'}
                    </span>
                    
                    {/* Product Image */}
                    <div className="h-28 w-full bg-slate-900 rounded-lg overflow-hidden mb-2 relative">
                      <img 
                        referrerPolicy="no-referrer"
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Basic product info */}
                    <h4 className="text-[11px] font-bold text-[var(--pm-text)] leading-snug line-clamp-2 h-8">
                      {prod.name}
                    </h4>

                    {/* MOQs & Ratings */}
                    <div className="flex items-center gap-1.5 text-[9px] text-[var(--pm-text-secondary)] my-1.5">
                      <span className="flex items-center gap-0.5 text-amber-400">★ {prod.rating}</span>
                      <span>({prod.reviewsCount})</span>
                      {prod.moq && (
                        <span className="text-[8px] bg-red-500/10 text-red-500 px-1 py-0.1 border border-red-500/20 font-black tracking-tighter">MOQ: {prod.moq}</span>
                      )}
                    </div>

                    {/* Price and cashback row split */}
                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        {prod.originalPrice > prod.price && (
                          <p className="text-[9px] text-[var(--pm-text-secondary)] line-through">৳{prod.originalPrice}</p>
                        )}
                        <p className="text-xs font-black text-[var(--pm-accent)]">৳{prod.price.toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(prod);
                        }}
                        className="w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center cursor-pointer shadow-sm active:scale-90 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Modal Panel */}
      <AnimatePresence>
        {isOpenChat && selectedShop && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setIsOpenChat(false)} />
            
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-[480px] rounded-t-[28px] shadow-2xl border-t flex flex-col"
              style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)', height: '70dvh' }}
            >
              {/* Header */}
              <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between bg-indigo-500/5 rounded-t-[28px]">
                <div className="flex items-center gap-2">
                  <img 
                    referrerPolicy="no-referrer"
                    src={selectedShop.logo} 
                    alt={selectedShop.name} 
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-[var(--pm-text)] flex items-center gap-1">
                      {selectedShop.banglaName} <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
                    </h4>
                    <p className="text-[8px] text-[var(--pm-text-secondary)]">সাধারণত ১ মিনিটে উত্তর দেয়</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpenChat(false)}
                  className="text-xs font-bold text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>

              {/* Message scroll list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 hide-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[75%] p-3 rounded-2xl text-xs relative ${
                        msg.sender === 'user' 
                        ? 'bg-[var(--pm-accent)] text-[#fff] rounded-tr-none' 
                        : 'bg-[var(--pm-bg)] text-[var(--pm-text)] rounded-tl-none border border-[var(--pm-border)]'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                      <span className="block text-[8px] mt-1 text-right opacity-70">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Composition Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[var(--pm-border)] flex gap-2" style={{ background: 'var(--pm-bg)' }}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="আপনার বার্তাটি লিখুন..."
                  className="flex-1 text-xs p-3 rounded-xl border bg-[var(--pm-surface)] outline-none text-[var(--pm-text)] focus:border-indigo-500"
                  style={{ borderColor: 'var(--pm-border)' }}
                />
                <button 
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center active:scale-95 transition-all"
                >
                  পাঠান
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Information Detail Overlap Drawer Sheet */}
      <AnimatePresence>
        {selectedProduct && selectedShop && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setSelectedProduct(null)} />

            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-[480px] rounded-t-[32px] p-5 shadow-2xl border-t flex flex-col"
              style={{ background: 'var(--pm-surface)', borderColor: 'var(--pm-border)', maxHeight: '85dvh' }}
            >
              <div className="w-12 h-1 bg-[var(--pm-border)] rounded-full mx-auto mb-4" />

              <div className="flex-1 overflow-y-auto pb-4 hide-scrollbar">
                <div className="h-48 rounded-2xl overflow-hidden mb-3.5 border relative" style={{ borderColor: 'var(--pm-border)' }}>
                  <img 
                    referrerPolicy="no-referrer"
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-indigo-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full border border-white/10 shadow-md">
                    {selectedProduct.type === 'b2b' ? 'B2B Wholesale' : 'B2C Retail'}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-2 mb-2">
                  <h1 className="text-base font-extrabold text-[var(--pm-text)] tracking-tight leading-snug">
                    {selectedProduct.name}
                  </h1>
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {selectedProduct.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3 text-xs text-[var(--pm-text-secondary)]">
                  <span className="text-amber-400">★ {selectedProduct.rating}</span>
                  <span>({selectedProduct.reviewsCount} কাস্টমার রিভিউ)</span>
                  <span>•</span>
                  <span className="text-cyan-500 font-bold">১৬২ পিস স্টকে আছে</span>
                </div>

                {/* Pricing module card */}
                <div className="p-3.5 rounded-2xl mb-4 border flex items-center justify-between" style={{ background: 'var(--pm-bg)', borderColor: 'var(--pm-border)' }}>
                  <div>
                    <span className="text-[10px] text-[var(--pm-text-secondary)]">বিশেষ অফারকৃত মূল্য</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-lg font-black text-[var(--pm-accent)]">৳{selectedProduct.price.toLocaleString()}</span>
                      {selectedProduct.originalPrice > selectedProduct.price && (
                        <span className="text-xs text-[var(--pm-text-secondary)] line-through">৳{selectedProduct.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  {selectedProduct.moq && (
                    <div className="text-right">
                      <span className="text-[8px] bg-red-400/10 text-red-500 border border-red-500/10 px-2 py-0.5 rounded-md font-bold block">নূন্যতম অর্ডার (MOQ)</span>
                      <span className="text-xs font-black text-red-500 block mt-1">{selectedProduct.moq} পিস</span>
                    </div>
                  )}
                </div>

                {/* Quality assurance parameters */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--pm-text-secondary)]">
                    <Check className="w-4 h-4 text-cyan-500" />
                    <span>১০০% অথেনটিক ব্র্যান্ড গ্যারান্টি</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--pm-text-secondary)]">
                    <Check className="w-4 h-4 text-cyan-500" />
                    <span>সহজ ৭ দিনের ফ্রি রিপ্লেসমেন্ট পলিসি</span>
                  </div>
                </div>

                {/* Operations bar */}
                <div className="flex gap-2.5">
                  <button 
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer active:scale-95 transition-all text-center"
                  >
                    শপিং ব্যাগ-এ যোগ করুন
                  </button>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2.5 rounded-xl border border-[var(--pm-border)] text-xs text-[var(--pm-text-secondary)] hover:text-[var(--pm-text)] active:scale-95 transition-all cursor-pointer"
                  >
                    বন্ধ
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
