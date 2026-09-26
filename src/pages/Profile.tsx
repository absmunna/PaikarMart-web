import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, Mail, ShieldAlert, Plus, MapPin, Tag, Clock, Send, 
  X, ShieldCheck, MessageSquare, Phone, Camera, Settings, BookOpen, 
  Image as ImageIcon, Heart, MessageCircle, Share2, Award, Calendar, ExternalLink,
  ShoppingBag, Layers, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../modules/auth/store/authStore';

// Types
interface DemandItem {
  id: string;
  serviceId: string;
  serviceName: string;
  budgetTierId: string;
  budgetTierName: string;
  locationId: string;
  locationName: string;
  urgency: 'low' | 'normal' | 'urgent';
  createdAt: string;
  matchCount: number;
}

interface ProductItem {
  id: string;
  title: string;
  categoryName: string;
  price: string;
  moq: string;
  origin: string;
  imageUrl: string;
  createdAt: string;
  likeCount: number;
}

// Catalogs
const SERVICES_CATALOG = [
  { id: 'ac_fridge', name: '❄️ এসি ও ফ্রিজ সার্ভিস (AC & Fridge Service)' },
  { id: 'electrician', name: '⚡ ইলেকট্রিশিয়ান সার্ভিস (Electrician Service)' },
  { id: 'delivery_rider', name: '🛵 ডেলিভারি রাইডার (Delivery Rider)' },
  { id: 'home_cleaning', name: '🧹 হোম ক্লিনিং সার্ভিস (Home Cleaning)' },
  { id: 'plumbing', name: '🚰 প্লাম্বিং সার্ভিস (Plumbing Service)' },
  { id: 'it_web', name: '💻 আইটি ও ওয়েব ডেভেলপমেন্ট (IT & Web Service)' },
  { id: 'catering', name: '🥘 ক্যাটারিং ও হোমমেড ফুড (Catering & Food)' },
];

const LOCATIONS_CATALOG = [
  { id: 'dhaka_mirpur', name: '📍 ঢাকা, মিরপুর (Mirpur, Dhaka)' },
  { id: 'dhaka_uttara', name: '📍 ঢাকা, উত্তরা (Uttara, Dhaka)' },
  { id: 'dhaka_dhanmondi', name: '📍 ঢাকা, ধানমন্ডি (Dhanmondi, Dhaka)' },
  { id: 'dhaka_gulshan', name: '📍 ঢাকা, গুলশান (Gulshan, Dhaka)' },
  { id: 'dhaka_motijheel', name: '📍 ঢাকা, মতিঝিল (Motijheel, Dhaka)' },
  { id: 'chittagong_halishahar', name: '📍 চট্টগ্রাম, হালিশহর (Halishahar, Chittagong)' },
  { id: 'sylhet_zindabazar', name: '📍 সিলেট, জিন্দাবাজার (Zindabazar, Sylhet)' },
];

const BUDGET_TIERS = [
  { id: 'tier_1', name: '৳৫০০ - ৳২,০০০ BDT' },
  { id: 'tier_2', name: '৳২,০০০ - ৳৫,০০০ BDT' },
  { id: 'tier_3', name: '৳৫,০০০ - ৳১০,০০০ BDT' },
  { id: 'tier_4', name: '৳১০,০০০ - ৳২৫,০০০ BDT' },
  { id: 'tier_5', name: '৳২৫,০০০ - ৳৫‌০,০০০+ BDT' },
];

const SERVICE_SELLERS = [
  { id: 's1', name: 'ঢাকা এসি সলিউশনস', locationId: 'dhaka_mirpur', serviceId: 'ac_fridge', avatar: '❄️', verified: true, contact: '01712345678' },
  { id: 's2', name: 'উত্তরা রাইডার্স হাব', locationId: 'dhaka_uttara', serviceId: 'delivery_rider', avatar: '🛵', verified: true, contact: '01812345678' },
  { id: 's3', name: 'রংধনু ক্লিনিং সার্ভিস', locationId: 'dhaka_dhanmondi', serviceId: 'home_cleaning', avatar: '🧹', verified: false, contact: '01912345678' },
  { id: 's4', name: 'ফাস্ট আইটি গ্যারেজ', locationId: 'dhaka_gulshan', serviceId: 'it_web', avatar: '💻', verified: true, contact: '01512345678' },
  { id: 's5', name: 'হালিশহর প্লাম্বিং কোং', locationId: 'chittagong_halishahar', serviceId: 'plumbing', avatar: '🚰', verified: true, contact: '01312345678' },
  { id: 's6', name: 'টেস্টি হোমমেড ক্যাটারিং', locationId: 'dhaka_mirpur', serviceId: 'catering', avatar: '🥘', verified: false, contact: '01412345678' }
];

// Seller Products Catalogs
const PRODUCT_TYPES_CATALOG = [
  { id: 'honey', name: '🍯 খাঁটি সুন্দরবনের মধু (Pure Honey)', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&fit=crop' },
  { id: 'watch', name: '⌚ স্মার্ট ওয়াচ আলটিমেট (Smart Watch)', image: 'https://images.unsplash.com/photo-1546868871-70c122467d9b?w=400&fit=crop' },
  { id: 'veg', name: '🥬 অর্গানিক তাজা পালং শাক (Organic Spinach)', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&fit=crop' },
  { id: 'ghee', name: '🧈 প্রিমিয়াম গাওয়া ঘি (Premium Ghee)', image: 'https://images.unsplash.com/photo-1622484211148-716598e04041?w=400&fit=crop' },
  { id: 'shirt', name: '👕 এক্সক্লুসিভ কটন টি-শার্ট (Cotton T-Shirt)', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&fit=crop' }
];

const WHOLESALE_PRICE_TIERS = [
  { id: 'price_1', name: '৳৩৫০ / কেজি BDT' },
  { id: 'price_2', name: '৳২,৫০০ / পিস BDT' },
  { id: 'price_3', name: '৳৮০ / কেজি BDT' },
  { id: 'price_4', name: '৳১,২০০ / কেজি BDT' },
  { id: 'price_5', name: '৳৪৫০ / পিস BDT' }
];

const MOQ_CATALOG = [
  { id: 'moq_5', name: '৫ পিস/কেজি (MOQ)' },
  { id: 'moq_10', name: '১০ পিস/কেজি (MOQ)' },
  { id: 'moq_50', name: '৫০ পিস/কেজি (MOQ)' },
  { id: 'moq_100', name: '১০০ পিস/কেজি (MOQ)' }
];

const ORIGINS_CATALOG = [
  { id: 'sundarban', name: 'সুন্দরবন (Sundarban)' },
  { id: 'dhaka', name: 'ঢাকা (Dhaka)' },
  { id: 'jessore', name: 'যশোর (Jessore)' },
  { id: 'chittagong', name: 'চট্টগ্রাম (Chittagong)' }
];

export default function Profile() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  // Facebook Tabs
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'photos'>('posts');
  const [openModal, setOpenModal] = useState(false);
  
  // Buyer state
  const [myDemands, setMyDemands] = useState<DemandItem[]>([]);
  // Seller state
  const [myProducts, setMyProducts] = useState<ProductItem[]>([]);

  // Selection States for Buyer Dropdown posting
  const [selectedService, setSelectedService] = useState('ac_fridge');
  const [selectedLocation, setSelectedLocation] = useState('dhaka_mirpur');
  const [selectedBudget, setSelectedBudget] = useState('tier_1');
  const [selectedUrgency, setSelectedUrgency] = useState<'low' | 'normal' | 'urgent'>('normal');

  // Selection States for Seller Product Uploading (Spam free)
  const [selectedProductType, setSelectedProductType] = useState('honey');
  const [selectedPriceTier, setSelectedPriceTier] = useState('price_1');
  const [selectedMOQ, setSelectedMOQ] = useState('moq_5');
  const [selectedOrigin, setSelectedOrigin] = useState('sundarban');

  useEffect(() => {
    // Initial seeds
    setMyDemands([
      {
        id: 'd_mock_1',
        serviceId: 'ac_fridge',
        serviceName: 'এসি ও ফ্রিজ সার্ভিস (AC & Fridge Service)',
        budgetTierId: 'tier_2',
        budgetTierName: '৳২,০০০ - ৳৫,০০০ BDT',
        locationId: 'dhaka_mirpur',
        locationName: 'ঢাকা, মিরপুর (Mirpur, Dhaka)',
        urgency: 'urgent',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        matchCount: 2
      }
    ]);

    setMyProducts([
      {
        id: 'p_mock_1',
        title: 'খাঁটি সুন্দরবনের মধু (১ কেজি)',
        categoryName: 'খাঁটি সুন্দরবনের মধু (Pure Honey)',
        price: '৳৮৫০ / কেজি BDT',
        moq: '৫ কেজি (MOQ)',
        origin: 'সুন্দরবন (Sundarban)',
        imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=200&auto=format&fit=crop',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        likeCount: 42
      }
    ]);
  }, []);

  const isSeller = user?.role === 'seller';

  const handlePostDemand = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceObj = SERVICES_CATALOG.find(s => s.id === selectedService);
    const locationObj = LOCATIONS_CATALOG.find(l => l.id === selectedLocation);
    const budgetObj = BUDGET_TIERS.find(b => b.id === selectedBudget);

    if (!serviceObj || !locationObj || !budgetObj) return;

    const newDemand: DemandItem = {
      id: `d_user_${Date.now()}`,
      serviceId: selectedService,
      serviceName: serviceObj.name.replace(/^[^\s]+\s/, ''),
      budgetTierId: selectedBudget,
      budgetTierName: budgetObj.name,
      locationId: selectedLocation,
      locationName: locationObj.name.replace(/^[^\s]+\s/, ''),
      urgency: selectedUrgency,
      createdAt: new Date().toISOString(),
      matchCount: SERVICE_SELLERS.filter(s => s.locationId === selectedLocation && s.serviceId === selectedService).length
    };

    setMyDemands(prev => [newDemand, ...prev]);
    setOpenModal(false);
  };

  const handleUploadProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const prodTypeObj = PRODUCT_TYPES_CATALOG.find(p => p.id === selectedProductType);
    const priceObj = WHOLESALE_PRICE_TIERS.find(pr => pr.id === selectedPriceTier);
    const moqObj = MOQ_CATALOG.find(m => m.id === selectedMOQ);
    const originObj = ORIGINS_CATALOG.find(o => o.id === selectedOrigin);

    if (!prodTypeObj || !priceObj || !moqObj || !originObj) return;

    const newProduct: ProductItem = {
      id: `p_user_${Date.now()}`,
      title: prodTypeObj.name.replace(/^[^\s]+\s/, ''),
      categoryName: prodTypeObj.name,
      price: priceObj.name,
      moq: moqObj.name,
      origin: originObj.name,
      imageUrl: prodTypeObj.image,
      createdAt: new Date().toISOString(),
      likeCount: 0
    };

    setMyProducts(prev => [newProduct, ...prev]);
    setOpenModal(false);
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'normal': return 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border border-[var(--pm-accent)]/20';
      default: return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center text-[var(--pm-text)]">
        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-8 max-w-sm flex flex-col items-center gap-4 shadow-xl">
          <UserIcon className="w-16 h-16 text-[var(--pm-text-muted)] animate-bounce" />
          <h2 className="text-lg font-black">লগইন প্রয়োজন</h2>
          <p className="text-xs text-[var(--pm-text-muted)] leading-relaxed">
            আপনার প্রোফাইল এবং কাস্টমাইজড প্রফেশনাল ড্যাশবোর্ড দেখতে অনুগ্রহ করে লগইন করুন।
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[var(--pm-accent)] text-white py-2.5 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/15 active:scale-95 transition-all hover:opacity-90"
          >
            লগইন করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 text-[var(--pm-text)]">
      
      {/* Cover Photo */}
      <div className="relative w-full h-44 sm:h-64 bg-gradient-to-r from-[var(--pm-accent)] via-indigo-600 to-purple-800 rounded-b-3xl overflow-hidden shadow-lg border-b border-[var(--pm-border)]/50">
        <div className="absolute inset-0 bg-black/20" />
        <button className="absolute bottom-4 right-4 bg-black/55 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 active:scale-95 transition-all">
          <Camera className="w-3.5 h-3.5" />
          কভার ফটো পরিবর্তন
        </button>
      </div>

      {/* Avatar & User Details Info (Facebook Overlapping Style) */}
      <div className="px-4 sm:px-8 pb-4 border-b border-[var(--pm-border)]/50">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-5 -mt-16 sm:-mt-20 relative z-10 text-center md:text-left">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-[var(--pm-surface)] overflow-hidden shadow-2xl relative bg-[var(--pm-bg)] shrink-0">
            <img 
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
            <button className="absolute bottom-1 right-1 bg-[var(--pm-accent)] text-white p-1.5 rounded-full border-2 border-[var(--pm-surface)] shadow-md hover:scale-105 transition-transform">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 pb-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">{user.name}</h1>
              <span className="bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full w-fit mx-auto md:mx-0 border border-[var(--pm-accent)]/10">
                {isSeller ? 'প্রো সেলার (Seller Shop)' : 'পাইকার ক্রেতা (Buyer)'}
              </span>
            </div>
            <p className="text-[11px] text-[var(--pm-text-muted)] mt-1.5 font-bold flex items-center justify-center md:justify-start gap-1">
              <span>{isSeller ? '৪.২K স্টোর ফলোয়ার' : '১.৫K ফলোয়ার'}</span> · <span>{isSeller ? '৩৫০ ভিউস' : '১২০ জন ফলো করছেন'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 pb-2 shrink-0">
            {isSeller ? (
              <button
                onClick={() => setOpenModal(true)}
                className="bg-[var(--pm-accent)] text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/15 active:scale-95 transition-all flex items-center gap-1.5 hover:opacity-95"
              >
                <Plus className="w-4 h-4" />
                নতুন প্রোডাক্ট আপলোড
              </button>
            ) : (
              <button
                onClick={() => setOpenModal(true)}
                className="bg-[var(--pm-accent)] text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/15 active:scale-95 transition-all flex items-center gap-1.5 hover:opacity-95"
              >
                <Plus className="w-4 h-4" />
                রিকোয়েস্ট দিন
              </button>
            )}
            <button className="bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] px-4 py-2.5 rounded-2xl text-xs font-black active:scale-95 transition-all flex items-center gap-1.5">
              <Settings className="w-4 h-4" />
              প্রোফাইল এডিট
            </button>
          </div>
        </div>
      </div>

      {/* Facebook tabs navigation */}
      <div className="flex border-b border-[var(--pm-border)]/50 px-2 sm:px-6 bg-[var(--pm-surface)]/20">
        {[
          { id: 'posts', label: isSeller ? 'আমার প্রোডাক্ট শপ' : 'আমার ডিমান্ড বোর্ড', icon: isSeller ? ShoppingBag : BookOpen },
          { id: 'about', label: 'আমাদের সম্পর্কে', icon: UserIcon },
          { id: 'photos', label: 'ছবিসমূহ (Photos)', icon: ImageIcon },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-black transition-all relative border-b-2 ${
              activeTab === tab.id 
                ? 'border-[var(--pm-accent)] text-[var(--pm-accent)] font-black' 
                : 'border-transparent text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 sm:p-6">
        
        {/* Left column sidebar (Facebook Intro Card) */}
        <div className="flex flex-col gap-5 md:col-span-1">
          <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-5 shadow-sm flex flex-col gap-4">
            <h3 className="font-black text-sm text-[var(--pm-text)]">স্টোর পরিচিতি (Intro)</h3>
            
            <div className="flex flex-col gap-3.5 text-xs font-bold text-[var(--pm-text-muted)]">
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                <span>স্ট্যাটাস: <span className="text-[var(--pm-text)]">{isSeller ? 'ভেরিফাইড হোলসেলার' : 'নিবন্ধিত বায়ার'}</span></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                <span>মে ২০২৬-এ যোগ দিয়েছেন</span>
              </div>
            </div>

            <button className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text)] py-2 rounded-xl text-xs font-black active:scale-95 transition-all">
              বিস্তারিত এডিট করুন
            </button>
          </div>
        </div>

        {/* Right column main area (Selected tab content) */}
        <div className="md:col-span-2 flex flex-col gap-5">
          
          <AnimatePresence mode="wait">
            {activeTab === 'posts' && (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-5"
              >
                {/* Standard Facebook Create Post Box (Dropdown Driven Only) */}
                <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-4 shadow-sm flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full border border-[var(--pm-border)] overflow-hidden shrink-0">
                    <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button 
                    onClick={() => setOpenModal(true)}
                    className="flex-1 bg-[var(--pm-bg)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-full px-4 py-2.5 text-left text-xs text-[var(--pm-text-muted)] font-semibold transition-colors active:scale-[0.99]"
                  >
                    {isSeller ? 'নতুন পাইকারি পণ্য (Product Shop) আপলোড করুন...' : 'নতুন সার্ভিস চাহিদা (Demand) পোস্ট করুন...'}
                  </button>
                </div>

                {/* Seller view or Buyer view */}
                {isSeller ? (
                  // Seller Products catalog lists
                  myProducts.length === 0 ? (
                    <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl py-12 text-center text-[var(--pm-text-muted)] flex flex-col items-center gap-2">
                      <span className="text-3xl">📦</span>
                      <p className="text-xs font-bold">এখনো কোনো প্রোডাক্ট আপলোড করা হয়নি।</p>
                    </div>
                  ) : (
                    <div className="grid gap-5">
                      {myProducts.map((prod) => (
                        <div 
                          key={prod.id} 
                          className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl overflow-hidden shadow-sm border border-[var(--pm-border)] hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row">
                            {/* Product preview image */}
                            <div className="w-full sm:w-44 h-40 bg-[var(--pm-bg)] flex-shrink-0 relative overflow-hidden">
                              <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                              <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md">হোলসেল</span>
                            </div>
                            
                            {/* Product data */}
                            <div className="flex-1 p-5 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[9px] text-[var(--pm-accent)] font-black uppercase tracking-widest">{prod.categoryName.replace(/^[^\s]+\s/, '')}</span>
                                  <span className="text-[9px] text-[var(--pm-text-muted)] font-bold">{new Date(prod.createdAt).toLocaleDateString('bn-BD')}</span>
                                </div>
                                <h3 className="text-sm font-black text-[var(--pm-text)] mt-1.5 leading-snug">{prod.title}</h3>
                                
                                <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] text-[var(--pm-text-muted)] font-bold bg-[var(--pm-bg)]/45 p-2.5 rounded-xl border border-[var(--pm-border)]/30">
                                  <div>৳ পাইকারি রেট: <span className="text-[var(--pm-accent)] font-black">{prod.price}</span></div>
                                  <div>📦 নূন্যতম অর্ডার (MOQ): <span className="text-[var(--pm-text)] font-black">{prod.moq}</span></div>
                                  <div className="col-span-2">📍 পণ্য উৎস / লোকেশন: <span className="text-[var(--pm-text)] font-semibold">{prod.origin}</span></div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between border-t border-[var(--pm-border)]/50 pt-3 mt-4">
                                <span className="text-[9px] text-[var(--pm-text-muted)] font-bold">নিরাপদ ভেরিফাইড প্রফেশনাল লিস্টিং</span>
                                <button className="bg-[var(--pm-accent)] text-white px-3 py-1.5 rounded-xl text-[9px] font-black active:scale-95 transition-all shadow-sm">প্রোডাক্ট এডিট</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  // Buyer demands catalog lists
                  myDemands.length === 0 ? (
                    <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl py-12 text-center text-[var(--pm-text-muted)] flex flex-col items-center gap-2">
                      <span className="text-3xl">📢</span>
                      <p className="text-xs font-bold">এখনো কোনো চাহিদার রিকোয়েস্ট পোস্ট করা হয়নি।</p>
                    </div>
                  ) : (
                    myDemands.map((demand) => {
                      const matchedSellers = SERVICE_SELLERS.filter(
                        s => s.locationId === demand.locationId && s.serviceId === demand.serviceId
                      );

                      return (
                        <div 
                          key={demand.id} 
                          className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full border border-[var(--pm-border)] overflow-hidden shrink-0">
                                <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-[var(--pm-text)] leading-tight">{user.name}</h4>
                                <p className="text-[9px] text-[var(--pm-text-muted)] font-bold mt-0.5">
                                  {new Date(demand.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase shrink-0 ${getUrgencyBadge(demand.urgency)}`}>
                              {demand.urgency === 'urgent' ? 'জরুরী' : demand.urgency === 'normal' ? 'সাধারণ' : 'ধীরগতি'}
                            </span>
                          </div>

                          <p className="text-xs text-[var(--pm-text)] leading-relaxed font-semibold bg-[var(--pm-bg)]/50 p-3.5 rounded-2xl border border-[var(--pm-border)]/40">
                            📢 {demand.locationName}-এ জরুরী ভিত্তিতে {demand.serviceName} সার্ভিস প্রয়োজন। আনুমানিক বাজেট ক্যাটাগরি: <span className="text-[var(--pm-accent)] font-black">{demand.budgetTierName}</span>। আগ্রহী স্থানীয় সার্ভিস প্রোভাইডারদের দ্রুত যোগাযোগ করার জন্য অনুরোধ করা হচ্ছে।
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-[10px] text-[var(--pm-text-muted)] font-bold bg-[var(--pm-bg)]/20 p-2.5 rounded-2xl border border-[var(--pm-border)]/20">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                              <span>এলাকা: {demand.locationName}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Tag className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                              <span>বাজেট: {demand.budgetTierName}</span>
                            </div>
                          </div>

                          <div className="border-t border-[var(--pm-border)]/50 pt-4 mt-1">
                            <h4 className="text-[11px] font-black text-[var(--pm-text)] mb-3 flex items-center gap-1">
                              👥 মিল থাকা স্থানীয় বিক্রেতা ({matchedSellers.length} জন):
                            </h4>
                            
                            {matchedSellers.length === 0 ? (
                              <p className="text-[10px] text-[var(--pm-text-muted)] italic">আপনার এলাকায় এই ক্যাটেগরির কোনো সার্ভিস সেলার এখনো নিবন্ধিত হয়নি। আমরা অনুসন্ধান করছি...</p>
                            ) : (
                              <div className="grid gap-3 sm:grid-cols-2">
                                {matchedSellers.map(seller => (
                                  <div key={seller.id} className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-[var(--pm-accent)]/30 transition-colors">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span className="text-2xl shrink-0">{seller.avatar}</span>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1">
                                          <span className="text-xs font-black text-[var(--pm-text)] truncate">{seller.name}</span>
                                          {seller.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                                        </div>
                                        <span className="text-[9px] text-[var(--pm-text-muted)] font-bold">ভেরিফাইড স্থানীয় বিক্রেতা</span>
                                      </div>
                                    </div>
                                    <a 
                                      href={`tel:${seller.contact}`} 
                                      className="bg-[var(--pm-accent)] text-white px-2.5 py-1.5 rounded-xl text-[9px] font-black flex items-center gap-1 active:scale-95 transition-all shrink-0 shadow-sm"
                                    >
                                      <Phone className="w-3 h-3" />
                                      কল করুন
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })
                  )
                )}
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-5 shadow-sm flex flex-col gap-4"
              >
                <h3 className="font-black text-sm text-[var(--pm-text)]">আমাদের সম্পর্কে (About Us)</h3>
                <p className="text-xs text-[var(--pm-text-muted)] leading-relaxed font-semibold">
                  {isSeller 
                    ? 'আমরা পাইকার মার্টের নিবন্ধিত পাইকারি হোলসেলার স্টোর। আমরা সরাসরি খামার ও বড় আমদানিকারকদের সাথে পণ্য সরাসরি বায়ারদের দোরগোড়ায় পৌঁছে দেই।' 
                    : 'পাইকার মার্ট সামাজিক কমার্স ও হোলসেল সুপার অ্যাপ। আমরা পাইকারি বিক্রেতা ও স্থানীয় রিটেইলারদের মেলবন্ধন ঘটিয়ে বাংলাদেশের কমার্স সেক্টরে নতুন বিপ্লব সাধন করতে প্রতিশ্রুতিবদ্ধ।'}
                </p>
                <div className="w-full h-[1px] bg-[var(--pm-border)]/50" />
                
                <h4 className="font-bold text-xs">অফিসিয়াল ওয়েবসাইট</h4>
                <a href="https://paikarmart.com" target="_blank" rel="noreferrer" className="text-xs text-[var(--pm-accent)] flex items-center gap-1 font-bold">
                  https://paikarmart.com <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            )}

            {activeTab === 'photos' && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-5 shadow-sm grid grid-cols-3 gap-3"
              >
                {[
                  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop'
                ].map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-[var(--pm-border)]/40 relative group cursor-pointer">
                    <img src={img} alt="Photos" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Shared Dropdown Modal for both roles (Spam Free) */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col text-[var(--pm-text)]"
            >
              {/* Header */}
              <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm">{isSeller ? 'নতুন পাইকারি প্রোডাক্ট আপলোড' : 'নতুন ডিমান্ড সার্ভিস রিকোয়েস্ট'}</h3>
                  <p className="text-[10px] text-[var(--pm-text-muted)] font-medium mt-0.5">কোনো মুক্ত বা ব্যক্তিগত টেক্সট লিখতে পারবেন না (স্প্যাম মুক্ত)।</p>
                </div>
                <button
                  onClick={() => setOpenModal(false)}
                  className="p-1 rounded-full hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* DUAL ROLE FORMS */}
              {isSeller ? (
                /* SELLER PRODUCT UPLOAD FORM (Pure drop downs) */
                <form onSubmit={handleUploadProduct} className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">প্রোডাক্ট টাইপ ও ক্যাটাগরি *</label>
                    <select
                      value={selectedProductType}
                      onChange={e => setSelectedProductType(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-2.5 py-3 text-xs text-[var(--pm-text)] focus:outline-none"
                    >
                      {PRODUCT_TYPES_CATALOG.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">পাইকারি রেট ও বাজেট টায়ার *</label>
                    <select
                      value={selectedPriceTier}
                      onChange={e => setSelectedPriceTier(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-2.5 py-3 text-xs text-[var(--pm-text)] focus:outline-none"
                    >
                      {WHOLESALE_PRICE_TIERS.map(pr => (
                        <option key={pr.id} value={pr.id}>{pr.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">সর্বনিম্ন অর্ডার পরিমাণ (MOQ) *</label>
                    <select
                      value={selectedMOQ}
                      onChange={e => setSelectedMOQ(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-2.5 py-3 text-xs text-[var(--pm-text)] focus:outline-none"
                    >
                      {MOQ_CATALOG.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">পণ্য উৎস / জেলা লোকেশন *</label>
                    <select
                      value={selectedOrigin}
                      onChange={e => setSelectedOrigin(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-2.5 py-3 text-xs text-[var(--pm-text)] focus:outline-none"
                    >
                      {ORIGINS_CATALOG.map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-[var(--pm-bg)] p-3 rounded-2xl border border-[var(--pm-border)]/60 text-[10px] text-[var(--pm-text-muted)] leading-relaxed">
                    📦 <span className="font-black text-[var(--pm-text)]">নিরাপদ ডাইরেক্ট পাবলিশ:</span> ক্যাটালগ থেকে নির্বাচিত তথ্য অনুযায়ী আপনার স্টোরে পণ্যটি ডাইরেক্ট আপলোড হবে। কোনো ব্যক্তিগত বিবরণ বা অবৈধ মেসেজ শেয়ার করা সম্পূর্ণ নিষিদ্ধ।
                  </div>

                  <button
                    type="submit"
                    className="bg-[var(--pm-accent)] text-white w-full py-3 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all mt-2 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    প্রোডাক্ট স্টোরে আপলোড করুন
                  </button>
                </form>
              ) : (
                /* BUYER DEMAND POST FORM (Pure drop downs) */
                <form onSubmit={handlePostDemand} className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">প্রয়োজনীয় সার্ভিস ক্যাটাগরি *</label>
                    <select
                      value={selectedService}
                      onChange={e => setSelectedService(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-2.5 py-3 text-xs text-[var(--pm-text)] focus:outline-none"
                    >
                      {SERVICES_CATALOG.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">আপনার লোকেশন/এলাকা *</label>
                    <select
                      value={selectedLocation}
                      onChange={e => setSelectedLocation(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-2.5 py-3 text-xs text-[var(--pm-text)] focus:outline-none"
                    >
                      {LOCATIONS_CATALOG.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">আনুমানিক বাজেট রেঞ্জ *</label>
                    <select
                      value={selectedBudget}
                      onChange={e => setSelectedBudget(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-2.5 py-3 text-xs text-[var(--pm-text)] focus:outline-none"
                    >
                      {BUDGET_TIERS.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">জরুরি অবস্থা *</label>
                    <select
                      value={selectedUrgency}
                      onChange={e => setSelectedUrgency(e.target.value as any)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-2.5 py-3 text-xs text-[var(--pm-text)] focus:outline-none"
                    >
                      <option value="low">ধীরগতি (Low)</option>
                      <option value="normal">সাধারণ (Normal)</option>
                      <option value="urgent">জরুরী (Urgent)</option>
                    </select>
                  </div>

                  <div className="bg-[var(--pm-bg)] p-3 rounded-2xl border border-[var(--pm-border)]/60 text-[10px] text-[var(--pm-text-muted)] leading-relaxed">
                    📢 <span className="font-black text-[var(--pm-text)]">অটো-কনструкশন প্রিভিউ:</span> আপনার নির্বাচিত তথ্যের ওপর ভিত্তি করে একটি স্ট্যান্ডার্ড নিরাপদ পোস্ট তৈরি হবে। কোনো ব্যক্তিগত বিবরণ বা অবৈধ মেসেজ শেয়ার করা সম্পূর্ণ নিষিদ্ধ।
                  </div>

                  <button
                    type="submit"
                    className="bg-[var(--pm-accent)] text-white w-full py-3 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all mt-2 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    রিকোয়েস্ট সাবমিট করুন
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
