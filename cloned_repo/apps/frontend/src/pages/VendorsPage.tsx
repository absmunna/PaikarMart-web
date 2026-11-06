import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Star, MapPin, Phone, MessageSquare, CheckCircle2, ShieldAlert,
  ArrowLeft, Store, Users, ExternalLink, Calendar, Briefcase, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Vendor {
  id: string;
  name: string;
  type: 'wholesaler' | 'retail_shop' | 'service_provider';
  typeName: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  trustScore: number;
  location: string;
  category: string;
  productsCount: number;
  phone: string;
  verified: boolean;
  featured: boolean;
}

const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'v_1',
    name: 'মদিনা রাইস এজেন্সি (Modina Rice Agency)',
    type: 'wholesaler',
    typeName: 'পাইকারি আড়তদার',
    avatar: '🌾',
    rating: 4.9,
    reviewsCount: 184,
    trustScore: 98,
    location: 'কারওয়ান বাজার, ঢাকা',
    category: 'চাল, ডাল ও খাদ্যশস্য',
    productsCount: 45,
    phone: '01711122233',
    verified: true,
    featured: true
  },
  {
    id: 'v_2',
    name: 'রহিম ইলেকট্রনিক্স পাইকারি পয়েন্ট',
    type: 'wholesaler',
    typeName: 'পাইকারি আড়তদার',
    avatar: '🔌',
    rating: 4.7,
    reviewsCount: 92,
    trustScore: 94,
    location: 'স্টেডিয়াম মার্কেট, ঢাকা',
    category: 'স্মার্টফোন ও গ্যাজেট',
    productsCount: 120,
    phone: '01822233344',
    verified: true,
    featured: false
  },
  {
    id: 'v_3',
    name: 'তাজমহল গ্রোসারি মার্ট',
    type: 'retail_shop',
    typeName: 'নিকটবর্তী শপ',
    avatar: '🛒',
    rating: 4.8,
    reviewsCount: 310,
    trustScore: 96,
    location: 'উত্তরা সেক্টর ১১, ঢাকা',
    category: 'নিত্যপ্রয়োজনীয় মুদি ও তেল',
    productsCount: 450,
    phone: '01933344455',
    verified: true,
    featured: true
  },
  {
    id: 'v_4',
    name: 'ভাই ভাই হার্ডওয়্যার স্টোর',
    type: 'retail_shop',
    typeName: 'নিকটবর্তী শপ',
    avatar: '🛠️',
    rating: 4.5,
    reviewsCount: 48,
    trustScore: 89,
    location: 'মিরপুর ১০, ঢাকা',
    category: 'ইলেকট্রিক ও হার্ডওয়্যার',
    productsCount: 320,
    phone: '01544455566',
    verified: false,
    featured: false
  },
  {
    id: 'v_5',
    name: 'মেসার্স হাসান এগ্রো অ্যান্ড ফিড',
    type: 'wholesaler',
    typeName: 'পাইকারি আড়তদার',
    avatar: '🌽',
    rating: 4.9,
    reviewsCount: 156,
    trustScore: 99,
    location: 'চাক্তাই, চট্টগ্রাম',
    category: 'পোল্ট্রি ও ফিশ ফিড',
    productsCount: 15,
    phone: '01655566677',
    verified: true,
    featured: true
  },
  {
    id: 'v_6',
    name: 'রবিন রেফ্রিজারেশন সার্ভিসিং',
    type: 'service_provider',
    typeName: 'সার্ভিস প্রোভাইডার',
    avatar: '❄️',
    rating: 4.6,
    reviewsCount: 64,
    trustScore: 91,
    location: 'মোহাম্মদপুর, ঢাকা',
    category: 'এসি ও ফ্রিজ মেরামত',
    productsCount: 6,
    phone: '01766677788',
    verified: true,
    featured: false
  }
];

export const VendorsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'wholesaler' | 'retail_shop' | 'service_provider'>('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Filters logic
  const filteredVendors = INITIAL_VENDORS.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || v.type === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-28 text-[var(--pm-text)] pt-4">
      {/* Directory Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate('/')} 
          className="p-2.5 rounded-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-lg font-black tracking-tight">ভেরিফাইড মার্চেন্ট ও স্টোর ডিরেক্টরি</h2>
          <p className="text-[10px] text-[var(--pm-text-muted)] font-semibold mt-0.5">
            পাইকার মার্টের ভেরিফাইড হোলসেলার এবং নিকটস্থ খুচরা বিক্রেতাগণ
          </p>
        </div>
      </div>

      {/* Modern Search Bar */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
        <input 
          type="text" 
          placeholder="নাম, লোকেশন বা পণ্যের ধরণ দিয়ে খুঁজুন..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl py-3.5 pl-11 pr-4 text-xs font-semibold placeholder:text-[var(--pm-text-muted)] outline-none focus:border-[var(--pm-accent)]/50 transition-all text-[var(--pm-text)]"
        />
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {[
          { id: 'all', label: 'সব মার্চেন্ট', icon: Store },
          { id: 'wholesaler', label: 'পাইকারি আড়তদার', icon: Briefcase },
          { id: 'retail_shop', label: 'নিকটবর্তী দোকান', icon: Store },
          { id: 'service_provider', label: 'সার্ভিস প্রোভাইডার', icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[10px] font-black border transition-all whitespace-nowrap shrink-0 active:scale-95 ${
              activeTab === tab.id 
                ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)]/30 text-[var(--pm-accent)]' 
                : 'bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-text-muted)]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      {filteredVendors.length === 0 ? (
        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl py-16 text-center text-[var(--pm-text-muted)] flex flex-col items-center gap-2">
          <Store className="w-12 h-12 text-[var(--pm-text-muted)] opacity-55" />
          <p className="text-xs font-bold mt-1">কোনো মার্চেন্ট বা দোকান পাওয়া যায়নি।</p>
          <p className="text-[10px] text-[var(--pm-text-muted)]/70">অনুগ্রহ করে অন্য কি-ওয়ার্ড দিয়ে সার্চ করুন।</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredVendors.map(vendor => (
            <motion.div
              key={vendor.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedVendor(vendor)}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-4 hover:border-[var(--pm-accent)]/30 transition-all cursor-pointer relative overflow-hidden flex flex-col gap-3 group"
            >
              {vendor.featured && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-amber-500 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  ফিচার্ড মার্চেন্ট
                </div>
              )}

              {/* Shop Profile Header */}
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  {vendor.avatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-black text-[var(--pm-text)] leading-tight truncate group-hover:text-[var(--pm-accent)] transition-colors">
                      {vendor.name}
                    </h3>
                    {vendor.verified && (
                      <CheckCircle2 className="w-4 h-4 text-[var(--pm-accent)] shrink-0 fill-[var(--pm-accent-soft)]" />
                    )}
                  </div>
                  
                  <span className="inline-block mt-1 text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text-muted)]">
                    {vendor.typeName}
                  </span>
                </div>
              </div>

              {/* Info Matrix */}
              <div className="grid grid-cols-3 gap-2 bg-[var(--pm-bg)]/50 p-2.5 rounded-2xl border border-[var(--pm-border)]/50 text-[10px] font-bold">
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] text-[var(--pm-text-muted)] uppercase mb-0.5">রেটিং</span>
                  <span className="text-[var(--pm-text)] flex items-center gap-0.5 text-xs font-black">
                    ⭐ {vendor.rating}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center border-x border-[var(--pm-border)]/70">
                  <span className="text-[8px] text-[var(--pm-text-muted)] uppercase mb-0.5">ট্রাস্ট স্কোর</span>
                  <span className="text-emerald-500 text-xs font-black">
                    🛡️ {vendor.trustScore}%
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] text-[var(--pm-text-muted)] uppercase mb-0.5">প্রোডাক্ট সংখ্যা</span>
                  <span className="text-[var(--pm-accent)] text-xs font-black">
                    {vendor.productsCount}+
                  </span>
                </div>
              </div>

              {/* Contact/Map metadata */}
              <div className="flex justify-between items-center text-[10px] text-[var(--pm-text-muted)] font-semibold mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                  <span>{vendor.location}</span>
                </div>
                <span className="text-[9px] font-bold text-[var(--pm-text-muted)] bg-[var(--pm-surface-hover)] px-2 py-1 rounded-lg">
                  {vendor.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL PANEL */}
      <AnimatePresence>
        {selectedVendor && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-[var(--pm-surface)] border-t border-[var(--pm-border)] w-full max-w-md rounded-t-[32px] overflow-hidden shadow-2xl flex flex-col text-[var(--pm-text)] pb-safe"
            >
              {/* Modal Drag Handle */}
              <div className="w-full flex justify-center py-3">
                <div className="w-12 h-1.5 rounded-full bg-[var(--pm-border)]" />
              </div>

              {/* Shop banner look */}
              <div className="px-5 pb-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-3xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                    {selectedVendor.avatar}
                  </div>
                  <button 
                    onClick={() => setSelectedVendor(null)}
                    className="bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-[var(--pm-text-secondary)] px-3 py-1.5 rounded-full text-[9px] font-black"
                  >
                    বন্ধ করুন
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black leading-tight text-[var(--pm-text)]">
                      {selectedVendor.name}
                    </h3>
                    {selectedVendor.verified && (
                      <CheckCircle2 className="w-5 h-5 text-[var(--pm-accent)] shrink-0 fill-[var(--pm-accent-soft)]" />
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--pm-text-muted)] font-black uppercase mt-1">
                    📍 {selectedVendor.location} • {selectedVendor.typeName}
                  </p>
                </div>

                <div className="bg-[var(--pm-bg)] p-4 rounded-3xl border border-[var(--pm-border)] flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[var(--pm-text-muted)]">পণ্য সরবরাহ সীমা:</span>
                    <span className="font-black text-[var(--pm-text)]">{selectedVendor.category}</span>
                  </div>
                  <hr className="border-[var(--pm-border)]/50" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[var(--pm-text-muted)]">মোট সচল লিস্টিং:</span>
                    <span className="font-black text-[var(--pm-accent)]">{selectedVendor.productsCount}+ টি প্রোডাক্ট</span>
                  </div>
                  <hr className="border-[var(--pm-border)]/50" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[var(--pm-text-muted)]">ক্রেতা সন্তুষ্টির হার:</span>
                    <span className="font-black text-emerald-500">⭐ {selectedVendor.rating} ({selectedVendor.reviewsCount} রিভিউ)</span>
                  </div>
                </div>

                {/* Secure call action buttons */}
                <div className="flex gap-2.5 mt-2">
                  <a 
                    href={`tel:${selectedVendor.phone}`}
                    className="flex-1 bg-[var(--pm-accent)] text-white py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    সরাসরি কল দিন (Call)
                  </a>
                  
                  <a 
                    href={`https://wa.me/${selectedVendor.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-2xl active:scale-95 transition-all flex items-center justify-center shrink-0 shadow-md cursor-pointer"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
