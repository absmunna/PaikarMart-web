import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Navigation, ShoppingBag, Store, Star, Clock, 
  ChevronRight, Filter, Phone, ArrowLeft, ArrowUpRight, CheckCircle2,
  Bike, Sparkles, ShieldCheck
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '@/modules/cart';
import { useCartDrawerStore } from '@/modules/cart/cartDrawerStore';
import { toast } from 'sonner';

interface NearbyShop {
  id: string;
  name: string;
  category: string;
  distance: string;
  eta: string;
  rating: number;
  reviews: number;
  isOpen: boolean;
  openingHours: string;
  address: string;
  image: string;
  logo: string;
  deliveryFee: number;
  popularItems: { id: string; name: string; price: number; image: string }[];
}

const LOCAL_SHOPS: NearbyShop[] = [
  {
    id: 'shop-01',
    name: 'আলম সুপার শপ ও অর্গানিক গ্রোসারি',
    category: 'মুদি ও গ্রোসারি',
    distance: '৪৫০ মিটার',
    eta: '১৫-২৫ মিনিট',
    rating: 4.8,
    reviews: 320,
    isOpen: true,
    openingHours: 'সকাল ৮:০০ - রাত ১১:০০',
    address: 'রোড ৩, ব্লক বি, মিরপুর-১০, ঢাকা',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
    logo: '🛒',
    deliveryFee: 30,
    popularItems: [
      { id: 'item-01', name: 'দেশি গরুর খাঁটি দুধ (১ লিটার)', price: 95, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200' },
      { id: 'item-02', name: 'অর্গানিক ফার্ম ডিম (১ ডজন)', price: 145, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200' },
      { id: 'item-03', name: 'চিনিগুঁড়া পোলাও চাল (১ কেজি)', price: 135, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' }
    ]
  },
  {
    id: 'shop-02',
    name: 'মডার্ন ফার্মা ও হেলথকেয়ার পয়েন্ট',
    category: 'ফার্মেসি',
    distance: '৮০০ মিটার',
    eta: '২০-৩০ মিনিট',
    rating: 4.9,
    reviews: 215,
    isOpen: true,
    openingHours: '২৪ ঘণ্টা খোলা',
    address: 'সেনপাড়া পর্বতা, মিরপুর, ঢাকা',
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=600',
    logo: '💊',
    deliveryFee: 25,
    popularItems: [
      { id: 'item-04', name: 'নাপা এক্সট্রা ৫০ প্যাক', price: 125, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200' },
      { id: 'item-05', name: 'হ্যান্ড স্যানিটাইজার ৫০০ মিলি', price: 180, image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=200' },
      { id: 'item-06', name: 'ডিজিটাল থার্মোমিটার', price: 290, image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200' }
    ]
  },
  {
    id: 'shop-03',
    name: 'ঢাকা কাচ্চি ঘর ও রেস্তোরাঁ',
    category: 'রেস্টুরেন্ট ও খাবার',
    distance: '১.১ কিমি',
    eta: '২৫-৩৫ মিনিট',
    rating: 4.7,
    reviews: 580,
    isOpen: true,
    openingHours: 'দুপুর ১২:০০ - রাত ১১:০০',
    address: 'মিরপুর স্টেডিয়াম রোড, ঢাকা',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
    logo: '🍲',
    deliveryFee: 40,
    popularItems: [
      { id: 'item-07', name: 'বাসমতী খাসির কাচ্চি বিরিয়ানি', price: 380, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200' },
      { id: 'item-08', name: 'স্পেশাল বোরহানি ২৫০ মিলি', price: 60, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200' },
      { id: 'item-09', name: 'চিকেন রোস্ট লেগ পিস', price: 150, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=200' }
    ]
  },
  {
    id: 'shop-04',
    name: 'দেশি গ্যাজেট অ্যান্ড মোবাইল হাব',
    category: 'ইলেকট্রনিক্স',
    distance: '১.৪ কিমি',
    eta: '৩০-৪০ মিনিট',
    rating: 4.6,
    reviews: 142,
    isOpen: false,
    openingHours: 'সকাল ১০:০০ - রাত ৯:০০',
    address: 'মিরপুর শপিং সেন্টার, লেভেল ২',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600',
    logo: '🔌',
    deliveryFee: 50,
    popularItems: [
      { id: 'item-10', name: 'ফাস্ট চার্জিং টাইপ-সি ক্যাবল', price: 190, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200' },
      { id: 'item-11', name: '১০,০০০ mAh ফাস্ট পাওয়ারব্যাংক', price: 1150, image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=200' }
    ]
  },
  {
    id: 'shop-05',
    name: 'মিষ্টি মেলা ও বেকারি কনফেকশনারি',
    category: 'বেকারি ও মিষ্টি',
    distance: '৬০০ মিটার',
    eta: '১৫-২০ মিনিট',
    rating: 4.8,
    reviews: 280,
    isOpen: true,
    openingHours: 'সকাল ৮:০০ - রাত ১০:৩০',
    address: 'পল্লবী মেইন রোড, মিরপুর',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
    logo: '🧁',
    deliveryFee: 30,
    popularItems: [
      { id: 'item-12', name: 'রসগোল্লা ১ কেজি বক্স', price: 320, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=200' },
      { id: 'item-13', name: 'বাটার কুকিজ ২৫০ গ্রাম', price: 160, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200' }
    ]
  },
  {
    id: 'shop-06',
    name: 'টাটকা ফ্রুটস ও ভেজিটেবল কর্নার',
    category: 'মুদি ও গ্রোসারি',
    distance: '৩৫০ মিটার',
    eta: '১০-১৫ মিনিট',
    rating: 4.7,
    reviews: 190,
    isOpen: true,
    openingHours: 'সকাল ৭:০০ - রাত ১০:০০',
    address: 'মিরপুর-১০ কাঁচাবাজার',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600',
    logo: '🍎',
    deliveryFee: 25,
    popularItems: [
      { id: 'item-14', name: 'আম্রপালি আম ১ কেজি', price: 120, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200' },
      { id: 'item-15', name: 'দেশি শসা ও লেবু প্যাক', price: 80, image: 'https://images.unsplash.com/photo-1449339854873-750e6913301b?w=200' }
    ]
  }
];

const LOCAL_CATEGORIES = [
  'সব দোকান',
  'মুদি ও গ্রোসারি',
  'ফার্মেসি',
  'রেস্টুরেন্ট ও খাবার',
  'বেকারি ও মিষ্টি',
  'ইলেকট্রনিক্স'
];

const LOCATIONS = [
  'মিরপুর-১০, ঢাকা',
  'ধানমন্ডি-২৭, ঢাকা',
  'গুলশান-২, ঢাকা',
  'উত্তরা সেক্টর-৪, ঢাকা',
  'বনানী, ঢাকা',
  'চকবাজার, চট্টগ্রাম'
];

export default function NearbyHome() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState('সব দোকান');
  const [search, setSearch] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);

  const filteredShops = useMemo(() => {
    return LOCAL_SHOPS.filter((shop) => {
      const matchSearch = shop.name.toLowerCase().includes(search.toLowerCase()) ||
                          shop.category.toLowerCase().includes(search.toLowerCase()) ||
                          shop.address.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'সব দোকান' || shop.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  const handleQuickAddLocalItem = (item: { id: string; name: string; price: number; image: string }, shop: NearbyShop) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      portal: 'b2c',
      domain: 'food',
      vendorName: shop.name
    });
    toast.success(`কার্টে যোগ করা হয়েছে: ${item.name} (৳${item.price})`);
    openCart();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 text-[var(--pm-text)]">
      
      {/* Location Bar & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] transition-all active:scale-95 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--pm-text)]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Store className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">লোকাল হাব ও আশেপাশের দোকান</h1>
            </div>
            <p className="text-xs text-[var(--pm-text-muted)] mt-0.5">
              নিকটবর্তী মুদি, ফার্মেসি ও শপ থেকে দ্রুততম ২০-৩০ মিনিটে ডোরস্টেপ ডেলিভারি
            </p>
          </div>
        </div>

        {/* Location Selector Pill */}
        <div className="relative">
          <button
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
            className="px-4 py-2.5 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] flex items-center gap-2 text-xs font-bold transition-all shadow-xs"
          >
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>{selectedLocation}</span>
            <Navigation className="w-3 h-3 text-blue-400 ml-1" />
          </button>

          {isLocationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl shadow-xl p-2 z-30 space-y-1">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setIsLocationDropdownOpen(false);
                    toast.success(`লোকেশন আপডেট হয়েছে: ${loc}`);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    selectedLocation === loc
                      ? "bg-emerald-500/10 text-emerald-400 font-bold"
                      : "hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text)]"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Express Delivery Banner */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
              <Bike className="w-4 h-4" />
            </span>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">লোকাল এক্সপ্রেস ডেলিভারি</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--pm-text)]">
            আপনার বাসার কাছের দোকান থেকেই সব অর্ডার করুন।
          </h2>
          <p className="text-xs text-[var(--pm-text-muted)]">
            সরাসরি লোকাল দোকানের একই মূল্যে পণ্য পান এবং লোকাল রাইডার ডেলিভারি সম্পন্ন করবে।
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shrink-0">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-[var(--pm-text)]">গড় ডেলিভারি ২০ মিনিট</span>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--pm-text-muted)]" />
          <input
            type="text"
            placeholder="কাছের দোকান বা আইটেম খুঁজুন (যেমন: আলম সুপার শপ, ডিম, দুধ, নাপা)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 sm:h-14 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl pl-12 pr-4 text-sm outline-none focus:border-emerald-500 shadow-sm transition-all text-[var(--pm-text)] placeholder:text-[var(--pm-text-muted)]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {LOCAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                  : "bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] border-[var(--pm-border)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Shops Grid - Multi-Column Desktop */}
      {filteredShops.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          <Store className="w-12 h-12 text-[var(--pm-text-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-[var(--pm-text)]">এই এলাকায় কোনো দোকান পাওয়া যায়নি</h3>
          <p className="text-xs text-[var(--pm-text-muted)] mt-1">অন্য ক্যাটাগরি অথবা লোকেশন পরিবর্তন করুন</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div
              key={shop.id}
              className="group bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] overflow-hidden hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Shop Cover & Badges */}
                <div className="aspect-[16/9] w-full relative overflow-hidden bg-black/20">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md backdrop-blur-md border ${
                      shop.isOpen
                        ? "bg-emerald-600/90 text-white border-emerald-400/30"
                        : "bg-red-600/90 text-white border-red-400/30"
                    }`}>
                      {shop.isOpen ? "খোলা আছে" : "বন্ধ"}
                    </span>
                    <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      {shop.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold border border-white/10">
                    <Bike className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{shop.eta}</span>
                  </div>
                </div>

                {/* Shop Information */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{shop.logo}</span>
                        <h3 className="text-base font-black text-[var(--pm-text)] group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {shop.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg text-amber-400 shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-xs font-black">{shop.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--pm-text-muted)] flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{shop.address}</span>
                      <span className="font-bold text-[var(--pm-text)]">({shop.distance})</span>
                    </p>
                  </div>

                  {/* Popular Items Preview */}
                  <div className="space-y-2 pt-2 border-t border-[var(--pm-border)]/50">
                    <span className="text-[10px] font-black uppercase text-[var(--pm-text-muted)] tracking-wider">জনপ্রিয় পণ্য ও দ্রুত অর্ডার:</span>
                    <div className="space-y-1.5">
                      {shop.popularItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)]/40 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <img src={item.image} alt={item.name} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                            <span className="text-[var(--pm-text)] truncate font-medium">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-bold text-emerald-400">৳{item.price}</span>
                            <button
                              onClick={() => handleQuickAddLocalItem(item, shop)}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] active:scale-95 transition-all"
                            >
                              + যোগ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    toast.success(`${shop.name}-এর সম্পূর্ণ ক্যাটালগে প্রবেশ করা হচ্ছে`);
                    navigate('/b2c');
                  }}
                  className="w-full py-3 rounded-2xl bg-[var(--pm-surface-hover)] hover:bg-emerald-600 hover:text-white border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] transition-all flex items-center justify-center gap-2 active:scale-95 group-hover:border-emerald-500/30"
                >
                  দোকানে প্রবেশ করুন <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
