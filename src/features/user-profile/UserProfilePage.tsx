import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, ShieldCheck, Calendar, MapPin, Sparkles, Wallet, ShoppingBag,
  Heart, MessageSquare, Bell, Store, Settings, Star, Trash2, Menu, X,
  FileText, Users, CreditCard, Grid, Truck, HelpCircle, HeartHandshake,
  Lock, Languages, Palette, CheckCircle, Plus, Info, Globe, Play, ExternalLink,
  Share2, Search, SlidersHorizontal, ThumbsUp, Send, Check, Package, Camera, Edit3, Save, MessageCircle, Info as InfoIcon
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useSeller } from '@/modules/seller';
import { toast } from 'sonner';
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

interface ProfileData {
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
  bio: string;
  bioBn: string;
}

export function UserProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // ---------------- VIEW MODE SELECTION ----------------
  // 'owner' (Viewing own logged-in account, edit access)
  // 'visitor' (Viewing someone else's public business/seller profile)
  const [viewMode, setViewMode] = useState<'owner' | 'visitor'>('owner');

  // Active simulated visitor profile ID when in visitor view mode
  const [selectedVisitorProfileId, setSelectedVisitorProfileId] = useState<string>('rahim-traders');

  // In-memory editable fields for the OWNER view to feel extremely reactive
  const [ownerBio, setOwnerBio] = useState<string>('আমার কাস্টম বায়ো / Custom sourcing bio on PaikarMart.');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState('');
  
  // Custom cover photo presets for simulation
  const [ownerCoverPreset, setOwnerCoverPreset] = useState<number>(0);
  const ownerCoverImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80',
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80'
  ];

  // Custom avatar presets for simulation
  const [ownerAvatarPreset, setOwnerAvatarPreset] = useState<number>(0);
  const ownerAvatarImages = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
  ];

  // Active tab inside Cockpit Settings
  const rawTab = searchParams.get('tab');
  const validCockpitTabs = [
    'overview', 'orders', 'addresses', 'wishlist', 'wallet', 'my-stores', 'security', 'verification', 'settings'
  ];
  const activeTab = validCockpitTabs.includes(rawTab || '') ? rawTab : null;

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // State for inquiry modal
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryQty, setInquiryQty] = useState('500');
  const [inquiryTargetPrice, setInquiryTargetPrice] = useState('280');
  const [inquiryMsg, setInquiryMsg] = useState('আসসালামু আলাইকুম, আমরা আপনার এই পণ্যের ব্যাপারে বাল্ক অর্ডারের জন্য আলোচনা করতে ইচ্ছুক। অনুগ্রহ করে MOQ এবং রেট জানান।');
  const [inquiryCategory, setInquiryCategory] = useState('Cotton T-Shirts');

  // State to toggle post compose dialog
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  // Is following state per simulated profile
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const [visitorFollowersOffset, setVisitorFollowersOffset] = useState<Record<string, number>>({});

  // ---------------- SELLER / OTHER USERS PROFILES ----------------
  const profilesToSimulate: ProfileData[] = [
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
      rolesList: ['Hybrid Seller', 'Direct Importer', 'Verified Sourcing Hub'],
      bio: 'Direct Wholesale Importers and manufacturers of cotton garment goods in Chawkbazar.',
      bioBn: 'চকবাজারে সুতি পোশাক সামগ্রীর সরাসরি পাইকারি আমদানিকারক ও প্রস্তুতকারক।'
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
      rolesList: ['Product Seller', 'Electronics Merchant'],
      bio: 'Dealers in all premium audio hardware, smart home electronics and wholesale devices.',
      bioBn: 'সব প্রিমিয়াম অডিও হার্ডওয়্যার, স্মার্ট হোম ইলেকট্রনিক্স এবং পাইকারি ডিভাইসের ডিলার।'
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
      rolesList: ['Service Provider', 'Skill Master'],
      bio: 'Providing custom handloom clothing manufacturing and premium training modules.',
      bioBn: 'কাস্টম তাঁত পোশাক প্রস্তুতকরণ এবং প্রিমিয়াম প্রশিক্ষণ মডিউল প্রদান করা হচ্ছে।'
    }
  ];

  // OWNER ACCOUNT INFORMATION (Drawn dynamically from Auth context or simulated beautifully)
  const ownerProfile = useMemo<ProfileData>(() => {
    return {
      id: 'my-own-account',
      name: user?.name || user?.fullName || 'MD Munna',
      fullNameBn: 'এমডি মুন্না',
      handle: user?.handle || 'munna_paikar',
      avatarUrl: ownerAvatarImages[ownerAvatarPreset],
      coverUrl: ownerCoverImages[ownerCoverPreset],
      rating: '4.9',
      rawFollowers: 120,
      followersCount: '১২০',
      followingCount: '১৮',
      reviewsCount: '৮',
      location: 'Dhanmondi, Dhaka',
      locationBn: 'ধানমণ্ডি, ঢাকা',
      verifiedBadge: true,
      divisionSpot: 'ঢাকা মেট্রোপলিটন এলাকা',
      sourcingType: 'অফিসিয়াল বায়ার এবং প্রো-আমদানিকারক',
      badgeLevel: 'Loyalty Tier Gold',
      roleCode: 'verifieduser',
      rolesList: ['Registered Buyer', 'Sourcing Scout'],
      bio: ownerBio,
      bioBn: ownerBio
    };
  }, [user, ownerBio, ownerCoverPreset, ownerAvatarPreset]);

  // Determine active displayed profile based on viewMode
  const activeProfile = useMemo(() => {
    if (viewMode === 'owner') {
      return ownerProfile;
    }
    return profilesToSimulate.find(p => p.id === selectedVisitorProfileId) || profilesToSimulate[0];
  }, [viewMode, ownerProfile, selectedVisitorProfileId]);

  const isFollowing = followingStates[activeProfile.id] || false;
  const followersCountAdjusted = useMemo(() => {
    const baseCount = activeProfile.rawFollowers;
    const offset = visitorFollowersOffset[activeProfile.id] || 0;
    const total = baseCount + offset;
    return total.toLocaleString('bn-BD');
  }, [activeProfile, visitorFollowersOffset]);

  const handleFollowToggle = () => {
    const nextState = !isFollowing;
    setFollowingStates({
      ...followingStates,
      [activeProfile.id]: nextState
    });

    const baseOffset = visitorFollowersOffset[activeProfile.id] || 0;
    setVisitorFollowersOffset({
      ...visitorFollowersOffset,
      [activeProfile.id]: nextState ? baseOffset + 1 : baseOffset - 1
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

  // Bio Editing Helpers
  const startEditingBio = () => {
    setTempBio(activeProfile.bio);
    setIsEditingBio(true);
  };

  const saveBio = () => {
    setOwnerBio(tempBio);
    setIsEditingBio(false);
    toast.success('বায়ো সফলভাবে সেভ করা হয়েছে / Biography updated successfully!');
  };

  // Cover & Avatar Simulation Rotations
  const rotateCoverPhoto = () => {
    if (viewMode !== 'owner') return;
    const nextIndex = (ownerCoverPreset + 1) % ownerCoverImages.length;
    setOwnerCoverPreset(nextIndex);
    toast.success('কভার ফটো আপডেট করা হয়েছে / Cover photo updated!');
  };

  const rotateAvatarPhoto = () => {
    if (viewMode !== 'owner') return;
    const nextIndex = (ownerAvatarPreset + 1) % ownerAvatarImages.length;
    setOwnerAvatarPreset(nextIndex);
    toast.success('প্রোফাইল ছবি পরিবর্তন করা হয়েছে / Profile picture updated!');
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInquiryModalOpen(false);
    toast.success(`সোর্সিং ইনকোয়ারি ${activeProfile.name} এর কাছে পাঠানো হয়েছে!`);
  };

  // Determine visible feed filter tabs based on viewMode and role
  const feedFilterTabs = useMemo(() => {
    return [
      { id: 'PRODUCTS', label: 'Products', labelBn: 'পণ্য', icon: ShoppingBag },
      { id: 'POSTS', label: 'Feed & Posts', labelBn: 'ফিড ও পোস্ট', icon: Grid },
      { id: 'ABOUT', label: 'About', labelBn: 'সম্পর্কে', icon: User }
    ];
  }, []);

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
    <div className="min-h-screen bg-[#080B13] text-zinc-100 flex flex-col pt-0 pb-24 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* ================= HIGHLY DETAILED SIMULATION CONTROL WORKPLACE BANNER ================= */}
      <div className="w-full bg-[#111625]/60 border-b border-cyan-500/10 py-3 px-4 sticky top-0 z-[50] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                viewMode === 'owner' ? "bg-emerald-400" : "bg-cyan-400"
              )}></span>
              <span className={cn(
                "relative inline-flex rounded-full h-3 w-3",
                viewMode === 'owner' ? "bg-emerald-500" : "bg-cyan-500"
              )}></span>
            </span>
            <p className="text-xs font-black uppercase tracking-wider text-zinc-300">
              {viewMode === 'owner' ? (
                <span>MY ACCOUNT (OWNER VIEW) / নিজের প্রোফাইল (মালিক ভিউ)</span>
              ) : (
                <span>PUBLIC PROFILE (VISITOR VIEW) / অন্যের প্রোফাইল (ভিজিটর ভিউ)</span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Button Switcher */}
            <div className="bg-black/40 p-1 rounded-xl border border-white/5 flex gap-1">
              <button
                onClick={() => {
                  setViewMode('owner');
                  setSearchParams({}); // reset any open cockpit tab so they see public profile structure first
                  toast.success('আপনার নিজের অ্যাকাউন্ট ভিউতে সুইচ করা হয়েছে! / Switched to Owner View!');
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer",
                  viewMode === 'owner'
                    ? "bg-emerald-500 text-black shadow-lg"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                Owner / নিজের ভিউ
              </button>
              
              <button
                onClick={() => {
                  setViewMode('visitor');
                  setSearchParams({});
                  toast.success('অন্য সেলার বা কাস্টমার ভিউতে সুইচ করা হয়েছে! / Switched to Visitor View!');
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all cursor-pointer",
                  viewMode === 'visitor'
                    ? "bg-cyan-500 text-black shadow-lg"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                Visitor / অন্যের ভিউ
              </button>
            </div>

            {/* If in visitor view, show dropdown list to switch between target sellers */}
            {viewMode === 'visitor' && (
              <div className="relative">
                <select
                  value={selectedVisitorProfileId}
                  onChange={(e) => {
                    setSelectedVisitorProfileId(e.target.value);
                    toast.success(`${profilesToSimulate.find(p => p.id === e.target.value)?.name} প্রোফাইলে সুইচ করা হয়েছে!`);
                  }}
                  className="px-3.5 py-1.5 bg-zinc-900 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-cyan-400 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer pr-8 appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='none' stroke='%2322d3ee' stroke-width='2' viewBox='0 0 24 24'><path d='m6 9 6 6 6-6'/></svg>")`,
                    backgroundPosition: 'right 10px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '10px'
                  }}
                >
                  {profilesToSimulate.map(p => (
                    <option key={p.id} value={p.id} className="bg-[#0c101c] text-zinc-300">
                      View: {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= 1. FACEBOOK-STYLE COVER PHOTO AREA ================= */}
      <div className="w-full max-w-7xl mx-auto md:px-8 pt-4">
        <div className="relative aspect-[3/1] md:aspect-[3.6/1] bg-[#111625] overflow-hidden md:rounded-2xl border border-white/5 group">
          <img
            src={activeProfile.coverUrl}
            alt="Business Cover"
            className="w-full h-full object-cover opacity-80 filter saturate-[0.9] transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          
          {/* Change Cover overlay button — ONLY for Owner View */}
          {viewMode === 'owner' && (
            <button
              onClick={rotateCoverPhoto}
              className="absolute top-4 left-4 px-4 py-2 bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-lg"
              title="Rotate Simulated Cover Design"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Update Cover / কভার পরিবর্তন</span>
            </button>
          )}

          <div className="absolute bottom-4 right-4 flex gap-2 z-20">
            <button
              onClick={handleShareProfile}
              className="px-4 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-lg"
              title="Share Profile Link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= 2. PROFILE HERO METRICS & OVERLAPPING AVATAR ================= */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-12 relative -mt-12 md:-mt-20 pb-6 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left justify-between border-b border-white/5 pb-6">
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 w-full">
            
            {/* Avatar block with circular overlapping outline and reactive change overlay */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#080B13] bg-[#111625] shrink-0 shadow-2xl relative group">
              <img
                src={activeProfile.avatarUrl}
                alt={activeProfile.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Change Avatar overlay — ONLY for Owner View */}
              {viewMode === 'owner' && (
                <button
                  onClick={rotateAvatarPhoto}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white cursor-pointer"
                  title="Rotate Avatar Preset"
                >
                  <Camera className="w-6 h-6 text-emerald-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Update / ছবি পাল্টান</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5 pb-1 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap justify-center md:justify-start">
                <h1 className="text-2xl md:text-3.5xl font-black text-white leading-tight">
                  {activeProfile.name}
                </h1>
                
                {activeProfile.verifiedBadge && (
                  <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-cyan-500/20 flex items-center gap-1 shrink-0 shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 fill-cyan-400/20" /> NID VERIFIED
                  </span>
                )}
                
                {viewMode === 'owner' && (
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1 shrink-0 shadow-lg">
                    🟢 Owner View
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 items-center md:items-start text-xs text-zinc-400">
                <p className="text-cyan-400 font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  {activeProfile.badgeLevel} • @{activeProfile.handle}
                </p>
                <p className="text-zinc-500 font-bold uppercase tracking-wider">{activeProfile.sourcingType}</p>
              </div>

              {/* Dynamic stats in header */}
              <div className="flex items-center gap-4 justify-center md:justify-start text-xs text-zinc-400 font-semibold pt-1">
                <span>
                  <strong className="text-white font-extrabold">
                    {viewMode === 'owner' ? activeProfile.followersCount : followersCountAdjusted}
                  </strong> Followers
                </span>
                <span>•</span>
                <span><strong className="text-white font-extrabold">{activeProfile.followingCount}</strong> Following</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/25" /> 
                  <strong className="text-white font-extrabold">{activeProfile.rating}</strong> ({activeProfile.reviewsCount})
                </span>
              </div>
            </div>
          </div>

          {/* ================= CORE ACTION BUTTONS (ADAPTS TO OWNER VS VISITOR) ================= */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 justify-center md:justify-end mt-4 md:mt-0">
            {viewMode === 'owner' ? (
              <>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="h-10 px-5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 font-black text-xs uppercase tracking-wider hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Settings className="w-4 h-4" /> Manage Account
                </button>
                
                <button
                  onClick={() => setIsComposerOpen(true)}
                  className="h-10 px-5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 text-emerald-400" /> Create Post
                </button>
              </>
            ) : (
              <>
                {/* Visitor Action: Follow Store with state tracking */}
                <button
                  onClick={handleFollowToggle}
                  className={cn(
                    "h-10 px-5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-md active:scale-95",
                    isFollowing
                      ? "bg-white/10 border border-white/10 text-zinc-300 hover:bg-white/15"
                      : "bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/15"
                  )}
                >
                  {isFollowing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isFollowing ? "Following" : "Follow Store / ফলো করুন"}
                </button>
                
                {/* Visitor Action: Send direct message */}
                <button
                  onClick={() => {
                    toast.success(`Opening chat room with ${activeProfile.name}...`);
                    navigate('/messages');
                  }}
                  className="h-10 px-5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-md"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" /> Message
                </button>

                {/* Visitor Action: Bulk wholesale inquiry request */}
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="h-10 px-5 rounded-lg bg-zinc-900 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider hover:bg-amber-500/10 hover:border-amber-500/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-md"
                >
                  <FileText className="w-4 h-4" /> Inquiry / ইনকোয়ারি
                </button>
              </>
            )}
          </div>
        </div>

        {/* ================= 3. FACEBOOK-STYLE FLAT TABS NAVIGATION ================= */}
        <div className="flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-none border-b border-white/5 mt-1">
          {feedFilterTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setFeedFilterTab(t.id);
                setSearchParams({}); // close any open cockpit tab when clicking standard tabs
              }}
              className={cn(
                "py-4 px-4 font-bold text-xs uppercase tracking-wider transition-all relative whitespace-nowrap cursor-pointer",
                (feedFilterTab === t.id && !activeTab)
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {t.label} / {t.labelBn}
            </button>
          ))}
          
          {/* Cockpit Settings menu link — ALWAYS visible for owner, hidden for visitor to maintain true access rules */}
          {viewMode === 'owner' && (
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                "py-4 px-4 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ml-auto cursor-pointer",
                activeTab
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" /> Cockpit Settings / সেটিংস
            </button>
          )}
        </div>
      </div>

      {/* ================= 4. MAIN CONTENT AREA ================= */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-12 mt-6 w-full flex-1">
        <AnimatePresence mode="wait">
          {activeTab && viewMode === 'owner' ? (
            /* ================= COCKPIT SETTINGS INTERFACE (OWNER ONLY) ================= */
            <motion.div
              key="cockpit"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left"
            >
              {/* Cockpit Left Sidebar Options */}
              <div className="md:col-span-4 lg:col-span-3 space-y-4">
                <div className="bg-[#111625] border border-white/5 rounded-2xl p-4 space-y-5">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Dashboard Cockpit
                    </span>
                    <button onClick={() => setSearchParams({})} className="text-[10px] font-black uppercase text-zinc-500 hover:text-cyan-400 transition-all">
                      Exit
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        groupName: "Account / অ্যাকাউন্ট",
                        items: [
                          { id: 'overview', label: 'Overview', labelBn: 'সংক্ষিপ্ত বিবরণ', icon: User },
                          { id: 'orders', label: 'My Orders', labelBn: 'আমার অর্ডার', icon: ShoppingBag },
                          { id: 'addresses', label: 'Addresses', labelBn: 'ঠিকানা', icon: MapPin },
                        ]
                      },
                      {
                        groupName: "Commerce / ব্যবসা ও ওয়ালেট",
                        items: [
                          { id: 'wallet', label: 'My Wallet', labelBn: 'আমার ওয়ালেট', icon: Wallet },
                          { id: 'my-stores', label: 'My Stores', labelBn: 'আমার স্টোরসমূহ', icon: Store },
                        ]
                      },
                      {
                        groupName: "System / সেটিংস",
                        items: [
                          { id: 'security', label: 'Security', labelBn: 'নিরাপত্তা', icon: Lock },
                          { id: 'verification', label: 'Verification', labelBn: 'ভেরিফিকেশন', icon: ShieldCheck },
                          { id: 'settings', label: 'Settings', labelBn: 'সেটিংস', icon: Settings },
                        ]
                      }
                    ].map((group) => (
                      <div key={group.groupName} className="space-y-1.5">
                        <span className="text-[9px] text-zinc-600 font-extrabold tracking-widest uppercase block px-2">
                          {group.groupName}
                        </span>
                        <div className="space-y-0.5">
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-left transition-all cursor-pointer",
                                  isActive
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner"
                                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                                )}
                              >
                                <Icon className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{item.label} / {item.labelBn}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSearchParams({})}
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 text-center block cursor-pointer"
                >
                  Exit Settings / ফেরত যান
                </button>
              </div>

              {/* Cockpit Config Details Screen */}
              <div className="md:col-span-8 lg:col-span-9">
                <div className="bg-[#111625] border border-white/5 p-5 md:p-8 rounded-2xl min-h-[500px]">
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

                  {activeTab === 'wallet' && (
                    <div className="space-y-6">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block border-b border-white/5 pb-2">আমার ওয়ালেট ক্যাশ ও রিওয়ার্ড কয়েন / Loyalty Coins & Wallet Cash</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 flex flex-col justify-between h-44 backdrop-blur-md">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest"> Loyalty Coins </span>
                            <h3 className="text-2.5xl font-black text-white mt-1 tabular-nums">৩,২০০ কয়েন্স</h3>
                            <span className="text-[9px] text-zinc-500 block font-bold mt-1 uppercase tracking-tight">৳৩২০ সমমূল্যের ডিসকাউন্ট ভাউচার কুপন লকড</span>
                          </div>
                          <button onClick={() => toast.success('Coins converted!')} className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer active:scale-95 shadow-lg shadow-emerald-500/20">Convert to Cash</button>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between h-44 backdrop-blur-md">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-white tracking-widest">PK Mart Balance / ক্যাশ ব্যালেন্স</span>
                            <h3 className="text-2.5xl font-black text-white mt-1 tabular-nums">৳৮,৫৪০.০০</h3>
                            <span className="text-[9px] text-zinc-500 block font-bold mt-1 uppercase tracking-tight">৫% শপিং ক্যাশব্যাক সহ bKash সংলগ্ন</span>
                          </div>
                          <button onClick={() => toast.success('bKash recharge initiated!')} className="py-2.5 bg-[#e2136e] hover:bg-[#c20c5d] text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer active:scale-95 shadow-lg">Recharge via bKash</button>
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
                </div>
              </div>
            </motion.div>
          ) : (
            /* ================= FACEBOOK-STYLE PROFILE PUBLIC & VISITOR LAYOUT ================= */
            <motion.div
              key="universal-profile-content"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left"
            >
              {/* ── LEFT SIDEBAR: INTRO & SIMULATION VIEWS ── */}
              <div className="md:col-span-5 lg:col-span-4 space-y-4">
                
                {/* Facebook Intro Card */}
                <div className="bg-[#111625] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Intro / পরিচিতি</h3>
                    
                    {viewMode === 'owner' && (
                      <button
                        onClick={isEditingBio ? saveBio : startEditingBio}
                        className="text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-all flex items-center gap-1"
                      >
                        {isEditingBio ? (
                          <><Save className="w-3 h-3" /> Save</>
                        ) : (
                          <><Edit3 className="w-3 h-3" /> Edit Bio</>
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Biography text block - inline editable for Owner Mode */}
                  {isEditingBio && viewMode === 'owner' ? (
                    <div className="space-y-2">
                      <textarea
                        value={tempBio}
                        onChange={(e) => setTempBio(e.target.value)}
                        className="w-full min-h-[80px] p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="আপনার বায়ো লিখুন..."
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setIsEditingBio(false)}
                          className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold text-zinc-400 uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveBio}
                          className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-[10px] font-black text-black uppercase tracking-wider"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 font-bold leading-relaxed text-center md:text-left bg-white/5 p-3.5 rounded-xl border border-white/5 italic">
                      "{activeProfile.bio}"
                    </p>
                  )}
                  
                  <div className="pt-2 space-y-3 text-xs text-zinc-400 font-medium">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Lives in <strong className="text-zinc-200">{activeProfile.location}</strong></span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Star className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500/10" />
                      <span>Rating <strong className="text-zinc-200">{activeProfile.rating}</strong> / 5.0 ({activeProfile.reviewsCount} Reviews)</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Followed by <strong className="text-zinc-200">{viewMode === 'owner' ? activeProfile.followersCount : followersCountAdjusted}</strong> people</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span>Handle: <span className="text-cyan-400 font-mono">@{activeProfile.handle}</span></span>
                    </div>
                  </div>

                  {/* Trust indicator badge inside Intro */}
                  {activeProfile.verifiedBadge && (
                    <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-3 flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                      <div className="text-[11px]">
                        <p className="font-extrabold text-white uppercase">NID VERIFIED ✓</p>
                        <p className="text-zinc-500 font-bold text-[10px] uppercase">Class: {activeProfile.badgeLevel}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sourcing/Business Tags Card */}
                <div className="bg-[#111625] border border-white/5 rounded-2xl p-5 space-y-3 shadow-xl">
                  <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest pb-1 border-b border-white/5">
                    Roles & Verification Tags / ট্যাগসমূহ
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {activeProfile.rolesList.map((r) => (
                      <span key={r} className="text-[10px] font-bold bg-[#1d243a] text-zinc-300 px-2.5 py-1 rounded-lg border border-white/5">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* ── RIGHT COLUMN: ACTIVE TAB VIEW ── */}
              <div className="md:col-span-7 lg:col-span-8 space-y-6">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
                  
                  {/* Products Tab View: Shows seller catalog storefront */}
                  {feedFilterTab === 'PRODUCTS' && (
                    <div className="space-y-4">
                      {/* Interactive header for public storefront */}
                      <div className="bg-gradient-to-r from-cyan-500/5 to-transparent border border-cyan-500/10 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-black text-cyan-400 tracking-widest block">STORE CATALOG</span>
                          <h4 className="text-base font-black text-white mt-0.5">{activeProfile.name} - Products & Offerings</h4>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" /> Catalog Verified
                        </span>
                      </div>

                      <PublicSellerStoreFront 
                        sellerName={activeProfile.name || "Seller Store"} 
                        isBilingual={true} 
                        hideHeader={true}
                      />
                    </div>
                  )}

                  {/* Feed Tab View: Social commerce postings with Create Post compose block */}
                  {feedFilterTab === 'POSTS' && (
                    <div className="space-y-4">
                      
                      {/* Facebook-style Compose Bar on Profile — ONLY visible in OWNER MODE */}
                      {viewMode === 'owner' ? (
                        <div 
                          onClick={() => setIsComposerOpen(true)}
                          className="bg-[#111625] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer transition-all group backdrop-blur-md"
                        >
                          <div className="flex items-center gap-3.5 w-full">
                            <img 
                              src={activeProfile.avatarUrl} 
                              alt="avatar" 
                              className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="bg-white/5 border border-white/5 group-hover:bg-white/10 text-zinc-500 text-xs py-3 px-4 rounded-xl w-full text-left transition-all font-bold">
                              আপনার চাহিদা, পণ্য শোকেস, বা সেবা পোস্ট করুন... (What's on your mind?)
                            </div>
                          </div>
                          <button className="flex items-center gap-1.5 bg-emerald-500 text-black font-extrabold text-[10px] uppercase tracking-wider px-4 py-3 rounded-xl hover:bg-emerald-400 transition-all shrink-0 shadow-lg active:scale-95">
                            <Plus className="w-4 h-4" /> POST
                          </button>
                        </div>
                      ) : (
                        /* Simple Info widget for visitor view posts tab */
                        <div className="bg-[#111625] border border-white/5 p-4 rounded-2xl flex items-center gap-3 text-xs text-zinc-400">
                          <InfoIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span>আপনি বর্তমানে <strong>{activeProfile.name}</strong> এর পাবলিক পোস্ট ও বাণিজ্যিক চাহিদা ফিড দেখছেন।</span>
                        </div>
                      )}

                      {/* Feed list */}
                      {socialFeedData.length > 0 ? (
                        socialFeedData.map((post) => (
                          <UniversalFeedCard 
                            key={post.id}
                            item={post} 
                            onLike={() => toast.success('Liked post!')} 
                          />
                        ))
                      ) : (
                        <div className="p-12 text-center bg-white/[0.01] border border-white/5 rounded-2xl">
                          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">এই ক্যাটাগরিতে কোনো পোস্ট পাওয়া যায়নি / No posts found.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* About Tab View: Biographical details */}
                  {feedFilterTab === 'ABOUT' && (
                    <div className="space-y-4">
                      
                      <div className="bg-[#111625] border border-white/5 p-6 rounded-2xl">
                        <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-3">Biography / জীবনী</h3>
                        <p className="text-sm text-zinc-300 leading-relaxed italic font-bold">
                          "{activeProfile.name} is a verified enterprise on Paikar Mart, committed to quality, trust-first bulk sourcing, and wholesale integrity."
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: "MEMBER SINCE", value: "2023" },
                          { label: "LOYALTY CLASS", value: activeProfile.badgeLevel },
                          { label: "IDENTITY STATUS", value: activeProfile.verifiedBadge ? "NID VERIFIED ✓" : "UNVERIFIED" },
                          { label: "BUSINESS TYPE", value: activeProfile.sourcingType.split(' / ')[0] || "Merchant" }
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-[#111625] border border-white/5 p-4.5 rounded-2xl">
                            <p className="text-[9px] text-zinc-500 font-black tracking-widest mb-1">{label}</p>
                            <p className="text-xs font-bold text-white uppercase tracking-wider">{value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Simulated Business Map spot */}
                      <div className="bg-[#111625] border border-white/5 p-5 rounded-2xl space-y-3">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Business Location / ব্যবসার অবস্থান</h4>
                        <div className="aspect-[3/1] rounded-xl overflow-hidden bg-black/40 border border-white/5 relative flex items-center justify-center p-4">
                          <div className="text-center space-y-1 z-10">
                            <MapPin className="w-7 h-7 text-cyan-400 mx-auto" />
                            <p className="text-xs font-bold text-white">{activeProfile.location}</p>
                            <p className="text-[10px] text-zinc-500">Dhaka Division, Bangladesh Sourcing Center</p>
                          </div>
                          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]" />
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= 5. CREATE POST COMPOSER MODAL (OWNER ONLY) ================= */}
      <AnimatePresence>
        {isComposerOpen && viewMode === 'owner' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[1000] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsComposerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-2xl bg-[#080B13] border border-white/10 rounded-[24px] relative overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsComposerOpen(false)}
                className="absolute top-6 right-6 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95"
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

      {/* ================= 6. BULK SOURCING INQUIRY MODAL (VISITOR ONLY) ================= */}
      <AnimatePresence>
        {isInquiryModalOpen && viewMode === 'visitor' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[1000] flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsInquiryModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0f1422] border border-amber-500/20 rounded-2xl relative overflow-hidden flex flex-col shadow-2xl p-6 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-black text-amber-400 tracking-widest block">Wholesale Sourcing Hub</span>
                  <h3 className="text-base font-black text-white mt-1">
                    Send Sourcing Inquiry to {activeProfile.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">ইনকোয়ারি ফরম (৳৫% অটো ট্যাক্স অন্তর্ভুক্ত)</p>
                </div>
                <button
                  onClick={() => setIsInquiryModalOpen(false)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={handleInquirySubmit} className="space-y-4 pt-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-zinc-400 font-extrabold block">Target Product / পণ্য:</label>
                    <input
                      type="text"
                      value={inquiryCategory}
                      onChange={(e) => setInquiryCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-zinc-400 font-extrabold block">Target Quantity / পরিমাণ:</label>
                    <input
                      type="number"
                      value={inquiryQty}
                      onChange={(e) => setInquiryQty(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-zinc-400 font-extrabold block">Target Budget Unit Price / বাজেট রেট (৳):</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-amber-500">৳</span>
                    <input
                      type="number"
                      value={inquiryTargetPrice}
                      onChange={(e) => setInquiryTargetPrice(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-zinc-400 font-extrabold block">Inquiry Message / বার্তা:</label>
                  <textarea
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    className="w-full min-h-[100px] p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                    required
                  />
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-center gap-3">
                  <InfoIcon className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="text-[10px] text-zinc-400 leading-relaxed">
                    <p className="font-extrabold text-white">MOQ & Verified Trade Guarantee</p>
                    <p>আপনার চাহিদা সরাসরি সোর্সিং পোর্টালে নিবন্ধিত হবে এবং bKash এআই চ্যাটে নোটিফিকেশন যাবে।</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInquiryModalOpen(false)}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 rounded-xl text-xs font-black uppercase tracking-wider text-black cursor-pointer shadow-lg active:scale-95 transition-all"
                  >
                    Send Inquiry / পাঠান
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default UserProfilePage;
