import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, ShieldCheck, Calendar, MapPin, Sparkles, Wallet, ShoppingBag,
  Heart, MessageSquare, Bell, Store, Settings, Star, Trash2, Menu, X,
  FileText, Users, CreditCard, Grid, Truck, HelpCircle, HeartHandshake,
  Lock, Languages, Palette, CheckCircle, Plus, Info, Globe, Play, ExternalLink,
  Share2, Search, SlidersHorizontal, ThumbsUp, Send, Check, Package
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useSeller } from '@/modules/seller';
import { toast } from 'sonner';
import { CategoryNavBar, CategoryFilterItem } from '@shared/CategoryNavBar';
import { cn } from '@/lib/utils';

// Import modular extracted cockpit tabs
import { UniversalFeedCard, UnifiedFeedItem } from '@/modules/social';
import { CreatePostComposer } from '@/features/feed/components/CreatePostComposer';
import { PersonalOverviewTab } from '@/features/user-profile/components/PersonalOverviewTab';
import { PersonalOrdersTab } from '@/features/user-profile/components/PersonalOrdersTab';
import { PersonalStoreTab } from '@/features/user-profile/components/PersonalStoreTab';
import { PersonalSecurityTab } from '@/features/user-profile/components/PersonalSecurityTab';
import { PersonalVerificationTab } from '@/features/user-profile/components/PersonalVerificationTab';
import { PersonalSettingsTab } from '@/features/user-profile/components/PersonalSettingsTab';
import { PersonalAddressesTab } from '@/features/user-profile/components/PersonalAddressesTab';
import { PublicSellerStoreFront } from '@/features/user-profile/components/PublicSellerStoreFront';

interface SimulatedProfile {
  id: string;
  name: string;
  fullNameBn: string;
  handle: string;
  avatarUrl: string;
  coverUrl: string;
  rating: string;
  rawFollowers: number;
  followersCount: string;
  followingCount: string;
  reviewsCount: string;
  location: string;
  locationBn: string;
  verifiedBadge: boolean;
  divisionSpot: string;
  sourcingType: string;
  badgeLevel: string;
  roleCode: 'hybrid' | 'productseller' | 'serviceprovider' | 'verifieduser';
  rolesList: string[];
}

export function UserProfilePage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { isSeller } = useSeller();

  // Navigation cockpit tab state
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');

  const validTabs = [
    'overview', 'orders', 'addresses', 'wishlist', 'reviews', 'following',                  // Account
    'wallet', 'messages', 'notifications',                                      // Commerce
    'my-stores', 'business-verification', 'team-management', 'business-subscription', // Business
    'all-portals', 'my-services', 'logistics', 'storefront',                       // Apps & Services
    'verification', 'security', 'language', 'appearance', 'settings', 'help-center', 'support' // System
  ];

  const activeTab = validTabs.includes(rawTab || '') ? rawTab : null;

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // ---------------- PROFILE SIMULATION PROFILES ----------------
  const profilesToSimulate: SimulatedProfile[] = [
    {
      id: 'rahim-traders',
      name: 'Rahim Traders Ltd.',
      fullNameBn: 'রহিম ট্রেডার্স লিঃ',
      handle: 'rahim_traders_bd',
      avatarUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300',
      coverUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200',
      rating: '4.9',
      rawFollowers: 4820,
      followersCount: '৪,৮২০',
      followingCount: '১৮০',
      reviewsCount: '১৬০+',
      location: 'Chawkbazar Hub, Dhaka',
      locationBn: 'চকবাজার হাব, ঢাকা',
      verifiedBadge: true,
      divisionSpot: 'ঢাকা মেট্রোপলিটন এলাকা',
      sourcingType: 'ইলেকট্রনিক্স ও সুতি গার্মেন্টস বাল্ক পরিবেশক',
      badgeLevel: 'Loyalty Class 7 Star',
      roleCode: 'hybrid',
      rolesList: ['Hybrid Seller', 'Direct Importer', 'Verified Sourcing Hub']
    },
    {
      id: 'smart-electronics',
      name: 'Smart Electronics BD',
      fullNameBn: 'স্মার্ট ইলেকট্রনিক্স বিডি',
      handle: 'smart_electronix_bd',
      avatarUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300',
      coverUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
      rating: '4.8',
      rawFollowers: 2930,
      followersCount: '২,৯৩০',
      followingCount: '৬৫',
      reviewsCount: '১২০+',
      location: 'Stadium Market, Dhaka',
      locationBn: 'স্টেডিয়াম মার্কেট, ঢাকা',
      verifiedBadge: true,
      divisionSpot: 'ঢাকা মেট্রোপলিটন এলাকা',
      sourcingType: 'পাইকারি আমদানিকারক ও ডিস্ট্রিবিউটর',
      badgeLevel: 'Verified Merchant Platinum',
      roleCode: 'productseller',
      rolesList: ['Product Seller', 'Electronics Merchant']
    },
    {
      id: 'karigari-boutique',
      name: 'Kari-gari Boutique',
      fullNameBn: 'কারি-গরি বুটিক ও ট্রেইনিং',
      handle: 'karigari_designs',
      avatarUrl: 'https://images.unsplash.com/photo-1510030469983-98e550d6193c?w=300',
      coverUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
      rating: '5.0',
      rawFollowers: 1150,
      followersCount: '১,১৫০',
      followingCount: '৪৪',
      reviewsCount: '৪২',
      location: 'Mirpur Zone 1, Dhaka',
      locationBn: 'মিরপুর জোন ১, ঢাকা',
      verifiedBadge: true,
      divisionSpot: 'ঢাকা মেট্রোপলিটন এলাকা',
      sourcingType: 'কারুশিল্প ও বুটিকস ট্রেনিং সেবা প্রদানকারী',
      badgeLevel: 'Top Rated Artisan',
      roleCode: 'serviceprovider',
      rolesList: ['Service Provider', 'Skill Master']
    },
    {
      id: 'rahim-user',
      name: 'Rahim Chowdhury',
      fullNameBn: 'রহিম চৌধুরী',
      handle: 'rahim_buyer_99',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      coverUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200',
      rating: '4.5',
      rawFollowers: 240,
      followersCount: '২৪০',
      followingCount: '৩২০',
      reviewsCount: '১৫',
      location: 'Dhanmondi, Dhaka',
      locationBn: 'ধানমণ্ডি, ঢাকা',
      verifiedBadge: true,
      divisionSpot: 'ঢাকা মেট্রোপলিটন এলাকা',
      sourcingType: 'রেজিস্টার্ড হোলসেল বায়ার / ক্রেতা',
      badgeLevel: 'Level 3 Member',
      roleCode: 'verifieduser',
      rolesList: ['Verified Buyer', 'Sourcing Scout']
    }
  ];

  // Active Simulated Profile
  const [activeProfileId, setActiveProfileId] = useState<string>('rahim-traders');
  const activeProfile = useMemo(() => {
    return profilesToSimulate.find(p => p.id === activeProfileId) || profilesToSimulate[0];
  }, [activeProfileId]);

  // Is following state per simulated profile
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const isFollowing = followingStates[activeProfile.id] || false;
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const handleFollowToggle = () => {
    const nextState = !isFollowing;
    setFollowingStates({
      ...followingStates,
      [activeProfile.id]: nextState
    });
    if (nextState) {
      toast.success(`${activeProfile.name} ফলো করা হয়েছে!`);
    } else {
      toast.info(`${activeProfile.name} আনফলো করা হয়েছে!`);
    }
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(`https://paikarmart.com/profile/${activeProfile.handle}`);
    toast.success('প্রোফাইল লিংক কপি করা হয়েছে / Profile URL copied!');
  };

    // Determine visible feed filter tabs based on role
    const feedFilterTabs = useMemo(() => {
      const list: CategoryFilterItem[] = [
        { id: 'PRODUCTS', label: 'Products', labelBn: 'পণ্য', icon: ShoppingBag, color: 'from-amber-500 to-orange-400' },
        { id: 'POSTS', label: 'Posts', labelBn: 'পোস্ট', icon: Grid, color: 'from-zinc-500 to-slate-400' },
        { id: 'ABOUT', label: 'About', labelBn: 'সম্পর্কে', icon: User, color: 'from-cyan-500 to-teal-400' }
      ];
      
      return list;
    }, []);
  
    // Handle active feed filter selection
    const [feedFilterTab, setFeedFilterTab] = useState<string>('PRODUCTS');
  
    // ---------------- COMPONENT FEED DATA ----------------
  const socialFeedData: UnifiedFeedItem[] = [
    {
      id: 'POST-1',
      type: 'PRODUCT',
      domain: 'RETAIL',
      author: {
        id: activeProfile.id,
        name: activeProfile.name,
        avatar: activeProfile.avatarUrl,
        isVerified: activeProfile.verifiedBadge
      },
      content: {
        title: 'অরিজিনাল ডাবল স্টিচ টি-শার্ট কালেকশন',
        description: 'ঈদ কালেকশনের জন্য এক্সপোর্ট কোয়ালিটি ডাবল স্টিচ টি-শার্ট স্টক ইন করা হয়েছে। আমাদের হোলসেল স্টোরে বিস্তারিত দেখুন।',
        media: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600'],
        location: activeProfile.locationBn,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        price: 350
      },
      stats: {
        likes: 45,
        comments: 12,
        shares: 5,
        views: 320
      },
      interactions: {
        hasLiked: false,
        hasSaved: false
      },
      cta: {
        label: 'কিনুন',
        action: 'ADD_TO_CART'
      }
    },
    {
      id: 'POST-2',
      type: 'DEMAND',
      domain: 'B2B',
      author: {
        id: activeProfile.id,
        name: activeProfile.name,
        avatar: activeProfile.avatarUrl,
        isVerified: activeProfile.verifiedBadge
      },
      content: {
        title: 'সরাসরি সাভার ই পি জেড রেডি প্রোডাক্ট',
        description: 'সরাসরি সাভার ই পি জেড ফ্যাক্টরি থেকে সেরা ফিনিশিং রেডি প্রোডাক্ট। ক্যাটালগ আপডেট করা হয়েছে।',
        media: ['https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600'],
        location: activeProfile.locationBn,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      stats: {
        likes: 120,
        comments: 34,
        shares: 10,
        views: 890
      },
      interactions: {
        hasLiked: false,
        hasSaved: false
      },
      cta: {
        label: 'বিস্তারিত',
        action: 'VIEW'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background text-white flex flex-col pt-0 pb-24">
      
      {/* 1. UNIVERSAL PROFILE COVER & BACKGROUND */}
      <div className="relative">
        <div className="h-56 md:h-64 bg-[#02050a] overflow-hidden relative">
          <img
            src={activeProfile.coverUrl}
            alt="Business Cover"
            className="w-full h-full object-cover opacity-60 filter saturate-[0.85] transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
          
          <div className="absolute top-5 right-5 flex gap-2 z-20">
             <button
                onClick={handleShareProfile}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-all"
                title="Share Profile Link"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
          </div>
        </div>

        {/* 2. UNIVERSAL IDENTITY HEADER (Cover, Avatar, Name, Verification, Location, Followers, Rating) */}
        <div className="max-w-[1360px] mx-auto px-4 md:px-6 relative -mt-16 z-10 text-left border-b border-white/10 pb-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
            
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left w-full md:w-auto">
              <div className="w-28 h-28 md:w-40 md:h-40 rounded-[32px] overflow-hidden border-4 border-background bg-white/[0.02] shrink-0 shadow-2xl relative group">
                <img
                  src={activeProfile.avatarUrl}
                  alt={activeProfile.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="space-y-2 pt-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                  <h1 className="text-2xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                    {activeProfile.name}
                  </h1>
                  
                  {activeProfile.verifiedBadge && (
                    <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-cyan-500/20 flex items-center gap-1.5 shrink-0 shadow-lg">
                      <ShieldCheck className="w-4 h-4" /> NID VERIFIED
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 items-center md:items-start">
                   <p className="text-cyan-400 text-xs font-black tracking-[0.2em] uppercase flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                     {activeProfile.badgeLevel} • @{activeProfile.handle}
                   </p>
                   <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">{activeProfile.sourcingType}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[12px] text-zinc-400 font-bold uppercase tracking-wider justify-center md:justify-start pt-1">
                  <span className="flex items-center gap-1.5 bg-white/5 py-1 px-3 rounded-full border border-white/5">
                    <MapPin className="w-4 h-4 text-cyan-500" /> {activeProfile.locationBn} / {activeProfile.location}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. CORE ACTION BUTTONS (Follow, Message, Share) */}
            <div className="flex flex-col gap-4 w-full md:w-auto mt-6 md:mt-0 shrink-0">
               {/* Stats Area (Premium Style) */}
               <div className="grid grid-cols-3 gap-2 w-full md:w-[360px]">
                  {[
                    { label: "PRODUCTS", value: activeProfile.id === 'rahim-traders' ? '45' : '0', icon: Package, color: "text-cyan-400" },
                    { label: "FOLLOWERS", value: activeProfile.followersCount, icon: Users, color: "text-blue-400" },
                    { label: "RATING", value: `${activeProfile.rating}★`, icon: Star, color: "text-amber-500" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div
                      key={label}
                      className="pm-glass-card flex flex-col items-center gap-1 py-3 px-2 text-center shadow-lg"
                    >
                      <Icon className={cn("w-4 h-4", color)} />
                      <p className="text-[14px] font-black text-white leading-none">{value}</p>
                      <p className="text-[8px] text-zinc-600 font-black tracking-widest">{label}</p>
                    </div>
                  ))}
               </div>

              <div className="flex items-center justify-center md:justify-end gap-2.5">
                <button
                  onClick={handleFollowToggle}
                  className={cn(
                    "flex-1 h-[48px] rounded-[18px] text-[12px] font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95",
                    isFollowing
                      ? "bg-white/[0.03] border border-white/10 text-zinc-500"
                      : "bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/20",
                  )}
                >
                  {isFollowing ? "Following" : "Follow Store"}
                </button>
                <button
                  onClick={() => navigate('/messages')}
                  className="flex-1 h-[48px] rounded-[18px] bg-white/[0.04] border border-white/10 text-white text-[12px] font-black uppercase tracking-wider hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-500" /> Message
                </button>
              </div>

              {/* View-As Switcher */}
              <div className="relative w-full">
                <select
                  value={activeProfileId}
                  onChange={(e) => {
                    setActiveProfileId(e.target.value);
                    toast.success(`${profilesToSimulate.find(p => p.id === e.target.value)?.name} প্রোফাইলে সুইচ করা হয়েছে!`);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer text-cyan-400 appearance-none outline-none pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%2322d3ee' stroke-width='2' viewBox='0 0 24 24'><path d='m6 9 6 6 6-6'/></svg>")`,
                    backgroundPosition: 'right 16px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '12px'
                  }}
                >
                  {profilesToSimulate.map(p => (
                    <option key={p.id} value={p.id} className="bg-[#04070f] text-zinc-300 py-2">
                      VIEW AS: {p.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN BODY LAYOUT AREA: Support dynamic navigation switches */}
      <div className="max-w-[1360px] mx-auto px-2 md:px-4 mt-6 w-full flex-1">
        <AnimatePresence mode="wait">
          {activeTab ? (
            /* ================= REGULATOR ACCOUNT COCKPIT MANAGEMENT ================= */
            <motion.div
              key="cockpit"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 gap-6 text-left"
            >
              <div className="flex justify-between items-center bg-white/[0.02] p-4 border border-white/5 rounded-2xl backdrop-blur-md">
                <div className="flex gap-2 items-center text-xs text-cyan-400 font-bold uppercase tracking-widest">
                  <User className="w-4 h-4" />
                  <span>My Personal Cockpit / পার্সোনাল ককপিট</span>
                  <span>/</span>
                  <span className="text-white">{activeTab}</span>
                </div>
                <button onClick={() => setSearchParams({})} className="px-4 py-2 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-all">
                  Back to Hub / ব্যাকে যান
                </button>
              </div>

              <div className="pm-glass-card p-5 md:p-8 min-h-[400px]">
                {activeTab === 'overview' && (
                  <PersonalOverviewTab onNavigateTab={(tab) => setActiveTab(tab)} />
                )}

                {activeTab === 'orders' && (
                  <PersonalOrdersTab />
                )}

                {activeTab === 'addresses' && (
                  <PersonalAddressesTab />
                )}

                {activeTab === 'my-stores' && (
                  <PersonalStoreTab onNavigateTab={(tab) => setActiveTab(tab)} />
                )}

                {activeTab === 'wishlist' && (
                  <div className="space-y-6">
                    <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block border-b border-white/5 pb-2">আমার উইশলিস্ট সংরক্ষণ / Saved Wishlist</span>
                    <div className="p-8 text-center bg-white/[0.01] border border-white/5 rounded-2xl">
                      <p className="text-xs text-zinc-500 font-bold">কোনো উইশলিস্ট আইটেম পাওয়া যায়নি / No wishlist items found.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'wallet' && (
                  <div className="space-y-6">
                    <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block border-b border-white/5 pb-2">আমার ওয়ালেট ক্যাশ ও রিওয়ার্ড কয়েন / Loyalty Coins & Wallet Cash</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 flex flex-col justify-between h-44 backdrop-blur-md">
                        <div>
                          <span className="text-[10px] uppercase font-black text-cyan-400 tracking-widest"> Loyalty Coins </span>
                          <h3 className="text-3xl font-black text-white mt-1 tabular-nums">৩,২০০ কয়েন্স</h3>
                          <span className="text-[9px] text-zinc-500 block font-bold mt-1 uppercase tracking-tight">৳৩২০ সমমূল্যের ডিসকাউন্ট ভাউচার কুপন লকড</span>
                        </div>
                        <button onClick={() => toast.success('Coins converted!')} className="py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all cursor-pointer active:scale-95 shadow-lg shadow-cyan-500/20">Convert to Cash</button>
                      </div>

                      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col justify-between h-44 backdrop-blur-md">
                        <div>
                          <span className="text-[10px] uppercase font-black text-white tracking-widest">PK Mart Balance / ক্যাশ ব্যালেন্স</span>
                          <h3 className="text-3xl font-black text-white mt-1 tabular-nums">৳৮,৫৪০.০০</h3>
                          <span className="text-[9px] text-zinc-500 block font-bold mt-1 uppercase tracking-tight">৫% শপিং ক্যাশব্যাক সহ bKash সংলগ্ন</span>
                        </div>
                        <button onClick={() => toast.success('bKash recharge initiated!')} className="py-3 bg-[#e2136e] hover:bg-[#c20c5d] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all cursor-pointer active:scale-95 shadow-lg">Recharge via bKash</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <PersonalSecurityTab />
                )}

                {activeTab === 'verification' && (
                  <PersonalVerificationTab />
                )}
                {activeTab === 'settings' && (
                  <PersonalSettingsTab />
                )}
                {activeTab === 'storefront' && (
                  <PublicSellerStoreFront sellerName={activeProfile.name} isBilingual={true} hideHeader={true} />
                )}
              </div>
            </motion.div>
          ) : (
            /* ================= UNIVERSAL PROFILE CONTENT (DYNAMIC PORTAL CHANGER) ================= */
            <motion.div
              key="universal-profile-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 text-left max-w-4xl mx-auto"
            >
              {/* Tab Selector (Premium Style) */}
              <div className="flex gap-2 p-2 rounded-[28px] bg-white/[0.02] border border-white/5 shadow-2xl backdrop-blur-md">
                {feedFilterTabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFeedFilterTab(t.id)}
                    className={cn(
                      "flex-1 py-3 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer",
                      feedFilterTab === t.id
                        ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-inner"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Content Body */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {feedFilterTab === 'PRODUCTS' && (
                  <PublicSellerStoreFront 
                    sellerName={activeProfile.name || "Seller Store"} 
                    isBilingual={true} 
                    hideHeader={true}
                  />
                )}

                {feedFilterTab === 'POSTS' && (
                  <div className="space-y-6">
                    {/* Facebook-style Compose Bar on Profile */}
                    <div 
                      onClick={() => setIsComposerOpen(true)}
                      className="bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 rounded-[32px] p-5 flex items-center justify-between gap-5 cursor-pointer transition-all mb-6 group backdrop-blur-md"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <img 
                          src={activeProfile.avatarUrl} 
                          alt="avatar" 
                          className="w-12 h-12 rounded-2xl object-cover border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="bg-white/5 border border-white/5 group-hover:bg-white/10 text-zinc-500 text-xs py-4 px-6 rounded-2xl w-full text-left transition-all font-bold">
                          আপনার চাহিদা, পণ্য শোকেস, বা সেবা পোস্ট করুন... (Post a demand, product, or service...)
                        </div>
                      </div>
                      <button className="flex items-center gap-2 bg-cyan-500 text-black font-black text-[11px] uppercase tracking-widest px-6 py-4 rounded-2xl hover:bg-cyan-400 transition-all shrink-0 shadow-lg shadow-cyan-500/20 active:scale-95">
                        <Plus className="w-4 h-4" /> পোস্ট
                      </button>
                    </div>

                    {socialFeedData.length > 0 ? (
                      socialFeedData.map((post) => (
                        <UniversalFeedCard 
                          key={post.id}
                          item={post} 
                          onLike={() => toast.success('Liked post!')} 
                        />
                      ))
                    ) : (
                      <div className="p-12 text-center bg-white/[0.01] border border-white/5 rounded-3xl backdrop-blur-sm">
                        <p className="text-xs text-zinc-500 font-black uppercase tracking-widest">এই ক্যাটাগরিতে কোনো পোস্ট পাওয়া যায়নি / No posts found.</p>
                      </div>
                    )}
                  </div>
                )}

                {feedFilterTab === 'ABOUT' && (
                  <div className="space-y-6">
                     <div className="pm-glass-card p-8">
                        <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-4">Biography / জীবনী</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed italic font-bold">
                          "{activeProfile.name} is a leading member on Paikar Mart, committed to quality and fair trade practices."
                        </p>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "MEMBER SINCE", value: "2023" },
                          { label: "LOYALTY CLASS", value: activeProfile.badgeLevel },
                          { label: "IDENTITY", value: activeProfile.verifiedBadge ? "NID VERIFIED ✓" : "UNVERIFIED" },
                          { label: "ROLE", value: activeProfile.sourcingType.split(' / ')[1] }
                        ].map(({ label, value }) => (
                          <div key={label} className="pm-glass-card p-5">
                            <p className="text-[9px] text-zinc-600 font-black tracking-[0.2em] mb-1.5">{label}</p>
                            <p className="text-[13px] font-black text-white uppercase tracking-tight">{value}</p>
                          </div>
                        ))}
                     </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. CREATE POST COMPOSER MODAL OVERLAY */}
      <AnimatePresence>
        {isComposerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[1000] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsComposerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-2xl bg-background border border-white/10 rounded-[40px] relative overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsComposerOpen(false)}
                className="absolute top-6 right-6 z-50 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="overflow-y-auto p-1 custom-scrollbar">
                <CreatePostComposer onClose={() => {
                  setIsComposerOpen(false);
                  toast.success("পোস্টটি প্রোফাইল ফিডে যোগ করা হয়েছে! / Post added to profile feed!");
                }} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default UserProfilePage;
