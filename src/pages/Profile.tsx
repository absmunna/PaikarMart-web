import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, Mail, ShieldAlert, Plus, MapPin, Tag, Clock, Send, 
  X, ShieldCheck, MessageSquare, Phone, Camera, Settings, BookOpen, 
  Image as ImageIcon, Heart, MessageCircle, Share2, Award, Calendar, ExternalLink,
  ShoppingBag, Layers, CheckCircle2, ChevronRight, Store, MoreHorizontal,
  Pencil, Briefcase, GraduationCap, Home, Globe, ThumbsUp, Bookmark, Sparkles,
  SlidersHorizontal, Check, Eye, Package, Wallet, ArrowRight, Truck, CheckCheck
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useWalletStore } from '@/modules/wallet/useWalletStore';
import { toast } from 'sonner';

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
  commentsCount?: number;
}

interface PostComment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  time: string;
}

// Pre-defined cover photos
const COVER_PRESETS = [
  { id: 'slate', name: 'মডার্ন স্লেট', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop' },
  { id: 'dhaka', name: 'ঢাকা কমার্শিয়াল', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop' },
  { id: 'textile', name: 'টেক্সটাইল ও জুট মিল', url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1200&auto=format&fit=crop' },
  { id: 'farm', name: 'অর্গানিক খামার', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop' }
];

// Featured Highlights (Facebook Stories/Highlights)
const FEATURED_HIGHLIGHTS = [
  { id: '1', title: 'হোলসেল স্টক', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&fit=crop', badge: 'গ্যালারি' },
  { id: '2', title: 'নতুন কালেকশন', img: 'https://images.unsplash.com/photo-1546868871-70c122467d9b?w=300&fit=crop', badge: 'স্মার্ট' },
  { id: '3', title: 'ভেরিফায়েড মিল', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&fit=crop', badge: 'কারখানা' },
  { id: '4', title: 'কাস্টমার রিভিউ', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&fit=crop', badge: '⭐ ৫.০' },
];

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
  { id: 'tier_5', name: '৳২৫,০০০ - ৳৫০,০০০+ BDT' },
];

const SERVICE_SELLERS = [
  { id: 's1', name: 'ঢাকা এসি সলিউশনস', locationId: 'dhaka_mirpur', serviceId: 'ac_fridge', avatar: '❄️', verified: true, contact: '01712345678' },
  { id: 's2', name: 'উত্তরা রাইডার্স হাব', locationId: 'dhaka_uttara', serviceId: 'delivery_rider', avatar: '🛵', verified: true, contact: '01812345678' },
  { id: 's3', name: 'রংধনু ক্লিনিং সার্ভিস', locationId: 'dhaka_dhanmondi', serviceId: 'home_cleaning', avatar: '🧹', verified: false, contact: '01912345678' },
  { id: 's4', name: 'ফাস্ট আইটি গ্যারেজ', locationId: 'dhaka_gulshan', serviceId: 'it_web', avatar: '💻', verified: true, contact: '01512345678' },
  { id: 's5', name: 'হালিশহর প্লাম্বিং কোং', locationId: 'chittagong_halishahar', serviceId: 'plumbing', avatar: '🚰', verified: true, contact: '01312345678' },
  { id: 's6', name: 'টেস্টি হোমমেড ক্যাটারিং', locationId: 'dhaka_mirpur', serviceId: 'catering', avatar: '🥘', verified: false, contact: '01412345678' }
];

const PRODUCT_TYPES_CATALOG = [
  { id: 'honey', name: '🍯 খাঁটি সুন্দরবনের মধু (Pure Honey)', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&fit=crop' },
  { id: 'watch', name: '⌚ স্মার্ট ওয়াচ আলটিমেট (Smart Watch)', image: 'https://images.unsplash.com/photo-1546868871-70c122467d9b?w=500&fit=crop' },
  { id: 'veg', name: '🥬 অর্গানিক তাজা পালং শাক (Organic Spinach)', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&fit=crop' },
  { id: 'ghee', name: '🧈 প্রিমিয়াম গাওয়া ঘি (Premium Ghee)', image: 'https://images.unsplash.com/photo-1622484211148-716598e04041?w=500&fit=crop' },
  { id: 'shirt', name: '👕 এক্সক্লুসিভ কটন টি-শার্ট (Cotton T-Shirt)', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&fit=crop' }
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
  const { user, isAuthenticated, isSeller } = useAuth();
  const { updateProfile } = useAuthStore();
  const { balance, coins } = useWalletStore();
  const navigate = useNavigate();
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'orders' | 'demands' | 'photos'>('posts');
  
  // Modals
  const [openModal, setOpenModal] = useState(false);
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [openCoverModal, setOpenCoverModal] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  
  // Post & Profile state
  const [coverUrl, setCoverUrl] = useState(COVER_PRESETS[0].url);
  const [bioText, setBioText] = useState(
    isSeller 
      ? 'পাইকার মার্টের ভেরিফাইড হোলসেলার মার্চেন্ট 🛍️ সরাসরি মিল-গেট রেটে সেরা পাইকারি পণ্য সরবরাহ করি।' 
      : 'পাইকার মার্টে নিয়মিত পাইকারি ও খুচরা কেনাকাটা করি। নিরাপদ ট্রেডিং পার্টনার 🚀'
  );
  
  // Editable Profile fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCity, setEditCity] = useState('ঢাকা, বাংলাদেশ');
  const [editBio, setEditBio] = useState('');

  // Timeline Interactions
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [commentsMap, setCommentsMap] = useState<Record<string, PostComment[]>>({
    'p_mock_1': [
      { id: 'c1', userName: 'হাজী রফিক', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop', text: 'ভাই ১০ কেজির ডেলিভারি চার্জ কত পড়বে?', time: '১ ঘণ্টা আগে' },
      { id: 'c2', userName: 'ফারহানা জামান', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop', text: 'সুন্দরবনের মধু একদম ১০০% খাঁটি, আমি নিয়েছি।', time: '৪৫ মিনিট আগে' }
    ]
  });

  const [postFilter, setPostFilter] = useState<'all' | 'products' | 'demands'>('all');

  // Interactive Inline Composer
  const [composerContent, setComposerContent] = useState('');
  const [composerType, setComposerType] = useState<'status' | 'product' | 'deal'>('status');

  // Buyer Demands
  const [myDemands, setMyDemands] = useState<DemandItem[]>([]);
  // Seller Products
  const [myProducts, setMyProducts] = useState<ProductItem[]>([]);

  // Selection States for Dropdown posting
  const [selectedService, setSelectedService] = useState('ac_fridge');
  const [selectedLocation, setSelectedLocation] = useState('dhaka_mirpur');
  const [selectedBudget, setSelectedBudget] = useState('tier_1');
  const [selectedUrgency, setSelectedUrgency] = useState<'low' | 'normal' | 'urgent'>('normal');

  const [selectedProductType, setSelectedProductType] = useState('honey');
  const [selectedPriceTier, setSelectedPriceTier] = useState('price_1');
  const [selectedMOQ, setSelectedMOQ] = useState('moq_5');
  const [selectedOrigin, setSelectedOrigin] = useState('sundarban');

  useEffect(() => {
    if (user) {
      setEditName(user.fullName || user.name || '');
      setEditPhone(user.phone || '');
      setEditBio(bioText);
    }

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
        imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        likeCount: 42,
        commentsCount: 2
      }
    ]);
  }, [user]);

  // Handle Likes
  const togglePostLike = (id: string) => {
    setLikedPosts(prev => {
      const isLiked = !prev[id];
      if (isLiked) toast.success("পোস্টে লাইক দেওয়া হয়েছে!");
      return { ...prev, [id]: isLiked };
    });
  };

  // Handle Comment Submit
  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    const newComment: PostComment = {
      id: `c_${Date.now()}`,
      userName: user?.fullName || user?.name || 'ব্যবহারকারী',
      userAvatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`,
      text: commentInput.trim(),
      time: 'এখনই'
    };

    setCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setCommentInput('');
    toast.success("মন্তব্য প্রকাশ করা হয়েছে!");
  };

  // Handle Inline Quick Post
  const handleInlinePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerContent.trim()) return;

    if (composerType === 'deal' || !isSeller) {
      setMyDemands(prev => [
        {
          id: `d_user_${Date.now()}`,
          serviceId: 'general',
          serviceName: composerContent.slice(0, 45),
          budgetTierId: 'tier_2',
          budgetTierName: '৳২,০০০ - ৳৫,০০০ BDT',
          locationId: 'dhaka_mirpur',
          locationName: 'ঢাকা',
          urgency: 'normal',
          createdAt: new Date().toISOString(),
          matchCount: 1
        },
        ...prev
      ]);
    } else {
      setMyProducts(prev => [
        {
          id: `p_user_${Date.now()}`,
          title: composerContent.slice(0, 45),
          categoryName: 'জেনারেল পাইকারি পণ্য',
          price: '৳৮৫০ / পিস BDT',
          moq: '৫ পিস (MOQ)',
          origin: 'ঢাকা (Dhaka)',
          imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop',
          createdAt: new Date().toISOString(),
          likeCount: 0,
          commentsCount: 0
        },
        ...prev
      ]);
    }

    setComposerContent('');
    toast.success("পোস্ট সফলভাবে পাবলিশ হয়েছে!");
  };

  // Modal Demand Post
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
    toast.success("চাহিদা সফলভাবে পোস্ট হয়েছে!");
  };

  // Modal Product Upload
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
      likeCount: 0,
      commentsCount: 0
    };

    setMyProducts(prev => [newProduct, ...prev]);
    setOpenModal(false);
    toast.success("পণ্য সফলভাবে ক্যাটালগে যুক্ত হয়েছে!");
  };

  // Save Edit Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      updateProfile({
        name: editName.trim(),
        phone: editPhone.trim()
      });
      setBioText(editBio);
      setOpenEditProfileModal(false);
      toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'normal': return 'bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] border border-[var(--pm-accent)]/20';
      default: return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center text-[var(--pm-text)]">
        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-8 max-w-sm flex flex-col items-center gap-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] flex items-center justify-center">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black">লগইন প্রয়োজন</h2>
          <p className="text-xs text-[var(--pm-text-muted)] leading-relaxed">
            আপনার ফেসবুক স্টাইল প্রোফাইল এবং পোস্ট টাইমলাইন দেখতে অনুগ্রহ করে লগইন করুন।
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white py-2.5 rounded-2xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all"
          >
            লগইন করুন
          </button>
        </div>
      </div>
    );
  }

  const displayName = user.fullName || user.name || 'ইউজার';
  const displayAvatar = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

  return (
    <div className="w-full max-w-5xl mx-auto pb-24 text-[var(--pm-text)] select-none">
      
      {/* ━━━━━━━━ 1. FACEBOOK HERO COVER & AVATAR SECTION ━━━━━━━━ */}
      <div className="bg-[var(--pm-surface)] border-b border-[var(--pm-border)] rounded-b-3xl sm:shadow-xs overflow-hidden mb-5">
        
        {/* Cover Photo */}
        <div className="relative w-full h-44 sm:h-72 bg-slate-900 overflow-hidden group">
          <img 
            src={coverUrl} 
            alt="Cover" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button 
            onClick={() => setOpenCoverModal(true)}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-5 bg-black/60 hover:bg-black/85 backdrop-blur-md text-white border border-white/20 px-3.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">কভার ফটো পরিবর্তন</span>
            <span className="sm:hidden">কভার</span>
          </button>
        </div>

        {/* Profile Avatar & Info Row (Facebook Overlapping Pattern) */}
        <div className="px-4 sm:px-8 pb-4">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 -mt-16 sm:-mt-24 relative z-10 text-center md:text-left">
            
            {/* Left: Avatar & Meta */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 sm:gap-6">
              
              {/* Profile Avatar with Online indicator & Camera icon */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[var(--pm-surface)] overflow-hidden shadow-2xl bg-[var(--pm-bg)] shrink-0 ring-1 ring-[var(--pm-border)]">
                  <img 
                    src={displayAvatar} 
                    alt={displayName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {/* Active Status Badge */}
                <div className="absolute bottom-2 left-3 w-4 h-4 bg-emerald-500 border-2 border-[var(--pm-surface)] rounded-full shadow-xs" title="অ্যাক্টিভ" />

                {/* Edit Avatar Button */}
                <button 
                  onClick={() => setOpenEditProfileModal(true)}
                  className="absolute bottom-1 right-1 bg-[var(--pm-surface-hover)] hover:bg-[var(--pm-accent)] text-[var(--pm-text)] hover:text-white p-2 rounded-full border-2 border-[var(--pm-surface)] shadow-md transition-all active:scale-90 cursor-pointer"
                  title="প্রোফাইল ছবি পরিবর্তন"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Name, Role & Follower Count */}
              <div className="flex flex-col items-center md:items-start pt-1 md:pb-3">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-3xl font-black tracking-tight text-[var(--pm-text)]">
                    {displayName}
                  </h1>
                  <span title="ভেরিফাইড অ্যাকাউন্ট">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-500/20 shrink-0" />
                  </span>
                </div>

                {/* Role Pill & Stats */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1">
                  <span className="bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] border border-[var(--pm-accent)]/20 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {isSeller ? '🏢 ভেরিফাইড পাইকারি মার্চেন্ট' : '🛍️ প্রিমিয়াম বায়ার মেম্বার'}
                  </span>
                  <span className="text-xs text-[var(--pm-text-muted)] font-bold">
                    ১,২৩৪ জন ফলোয়ার
                  </span>
                  <span className="text-[var(--pm-text-muted)] hidden sm:inline">•</span>
                  <span className="text-xs font-bold text-amber-400 hidden sm:inline">
                    ⭐ ৪.৯ (১২০+ রিভিউ)
                  </span>
                </div>

                {/* Mutual connections avatar pile */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-[var(--pm-surface)]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="Friend" />
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-[var(--pm-surface)]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Friend" />
                    <img className="inline-block h-6 w-6 rounded-full ring-2 ring-[var(--pm-surface)]" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" alt="Friend" />
                  </div>
                  <span className="text-[11px] text-[var(--pm-text-muted)] font-medium">
                    হাজী রফিক ও আরও ৩৮ জন কানেক্টেড মার্চেন্ট
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Facebook Action Buttons */}
            <div className="flex items-center gap-2 pt-2 md:pb-3 w-full sm:w-auto justify-center">
              <button
                onClick={() => setOpenModal(true)}
                className="flex-1 sm:flex-none bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {isSeller ? 'পণ্য আপলোড' : 'চাহিদা পোস্ট'}
              </button>

              <button 
                onClick={() => setOpenEditProfileModal(true)}
                className="flex-1 sm:flex-none bg-[var(--pm-surface-hover)] hover:bg-[var(--pm-border)]/50 text-[var(--pm-text)] border border-[var(--pm-border)] px-4 py-2 rounded-xl text-xs font-black active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                প্রোফাইল এডিট
              </button>

              {/* More menu dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className="bg-[var(--pm-surface-hover)] hover:bg-[var(--pm-border)]/50 text-[var(--pm-text)] border border-[var(--pm-border)] p-2 rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                  title="অতিরিক্ত অপশন"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {moreMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl shadow-xl z-50 p-1.5 flex flex-col gap-1 text-xs font-semibold">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("প্রোফাইল লিংক কপি করা হয়েছে!");
                          setMoreMenuOpen(false);
                        }}
                        className="p-2 text-left hover:bg-[var(--pm-surface-hover)] rounded-xl flex items-center gap-2 text-[var(--pm-text)]"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[var(--pm-accent)]" /> প্রোফাইল লিংক কপি
                      </button>
                      <button 
                        onClick={() => {
                          setOpenCoverModal(true);
                          setMoreMenuOpen(false);
                        }}
                        className="p-2 text-left hover:bg-[var(--pm-surface-hover)] rounded-xl flex items-center gap-2 text-[var(--pm-text)]"
                      >
                        <Camera className="w-3.5 h-3.5 text-[var(--pm-accent)]" /> কভার থিম পরিবর্তন
                      </button>
                      <button 
                        onClick={() => {
                          navigate('/settings');
                          setMoreMenuOpen(false);
                        }}
                        className="p-2 text-left hover:bg-[var(--pm-surface-hover)] rounded-xl flex items-center gap-2 text-[var(--pm-text)]"
                      >
                        <Settings className="w-3.5 h-3.5 text-[var(--pm-accent)]" /> অ্যাকাউন্ট সেটিংস
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>

          <div className="w-full h-[1px] bg-[var(--pm-border)]/60 my-4" />

          {/* Facebook Minimal Tabs Navigation */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar -mb-4">
            {[
              { id: 'posts', label: 'পোস্টসমূহ', icon: BookOpen },
              { id: 'about', label: 'পরিচিতি', icon: UserIcon },
              { id: 'orders', label: 'অর্ডার হিস্ট্রি', icon: Package, badge: '৩' },
              { id: 'demands', label: isSeller ? 'পণ্য ক্যাটালগ' : 'ডিমান্ড বোর্ড', icon: isSeller ? ShoppingBag : Layers },
              { id: 'photos', label: 'ছবিসমূহ', icon: ImageIcon },
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-black transition-all relative border-b-2 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'border-[var(--pm-accent)] text-[var(--pm-accent)]' 
                      : 'border-transparent text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)] rounded-t-lg'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-[var(--pm-accent)]/20 text-[var(--pm-accent)] text-[9px] px-1.5 py-0.2 rounded-full font-black">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ━━━━━━━━ 2. FACEBOOK 2-COLUMN MINIMAL BODY ━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 px-2 sm:px-0">
        
        {/* ━━━━ LEFT COLUMN: INTRO / ABOUT SIDEBAR (5 COLS) ━━━━ */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Card 1: Intro (Facebook Standard Card) */}
          <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-[var(--pm-text)] tracking-tight">
                পরিচিতি (Intro)
              </h3>
              <button 
                onClick={() => setOpenEditProfileModal(true)}
                className="text-[11px] font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" /> এডিট
              </button>
            </div>

            {/* Bio text */}
            <div className="text-center p-3 rounded-xl bg-[var(--pm-bg)]/60 border border-[var(--pm-border)]/40">
              <p className="text-xs text-[var(--pm-text)] font-semibold leading-relaxed">
                {bioText}
              </p>
            </div>

            {/* Quick Wallet Info Widget in Sidebar */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-[var(--pm-accent)]/15 via-[var(--pm-accent)]/10 to-transparent border border-[var(--pm-accent)]/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--pm-accent)]/20 text-[var(--pm-accent)] flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[var(--pm-text-muted)] uppercase block">ওয়ালেট ব্যালেন্স</span>
                  <span className="text-sm font-black text-[var(--pm-text)]">৳ {balance ? balance.toLocaleString() : '৪৫,২৮০'}</span>
                </div>
              </div>
              <Link 
                to="/wallet"
                className="text-[11px] font-black text-[var(--pm-accent)] hover:underline flex items-center gap-0.5"
              >
                টপ-আপ <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Key Facebook Profile Attributes */}
            <div className="flex flex-col gap-3 pt-1 text-xs font-semibold text-[var(--pm-text-muted)]">
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                <span>
                  {isSeller ? 'মার্চেন্ট পার্টনার, ' : 'সক্রিয় ক্রেতা, '} 
                  <strong className="text-[var(--pm-text)]">পাইকার মার্ট বি২বি নেটওয়ার্ক</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                <span>বসবাস করেন: <strong className="text-[var(--pm-text)]">{editCity}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                <span>ট্রেড জোন: <strong className="text-[var(--pm-text)]">মিরপুর / ঢাকা উত্তর</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>এসক্রো ট্রাস্ট স্কোর: <strong className="text-emerald-500">৯৮% নিরাপদ ও ভেরিফায়েড</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                <span>যোগদানের তারিখ: <strong className="text-[var(--pm-text)]">মে ২০২৬</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                <a href="https://paikarmart.com" target="_blank" rel="noreferrer" className="text-[var(--pm-accent)] hover:underline truncate">
                  paikarmart.com/u/{user.email ? user.email.split('@')[0] : 'merchant'}
                </a>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('about')}
              className="w-full bg-[var(--pm-surface-hover)] hover:bg-[var(--pm-border)]/50 text-[var(--pm-text)] py-2 rounded-xl text-xs font-black transition-all active:scale-98 mt-1 border border-[var(--pm-border)] cursor-pointer"
            >
              বিস্তারিত বায়োডাটা দেখুন
            </button>
          </div>

          {/* Card 2: Featured Highlights (Facebook Stories/Collections) */}
          <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-[var(--pm-text)]">ফিচার্ড হাইলাইটস</h3>
              <span className="text-[10px] text-[var(--pm-accent)] font-bold">কালেকশন</span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {FEATURED_HIGHLIGHTS.map(f => (
                <div key={f.id} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[var(--pm-accent)]/40 p-0.5 group-hover:border-[var(--pm-accent)] transition-all">
                    <img src={f.img} alt={f.title} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--pm-text)] truncate max-w-full text-center">
                    {f.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Photos Preview (Facebook 6-Grid Preview) */}
          <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-[var(--pm-text)]">ছবিসমূহ (Photos)</h3>
                <span className="text-[10px] text-[var(--pm-text-muted)] font-medium">১২টি রিসেন্ট আপলোড</span>
              </div>
              <button 
                onClick={() => setActiveTab('photos')}
                className="text-xs font-bold text-[var(--pm-accent)] hover:underline cursor-pointer"
              >
                সব দেখুন
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden pt-1">
              {[
                'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1546868871-70c122467d9b?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1622484211148-716598e04041?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&h=300&fit=crop',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
              ].map((img, idx) => (
                <div key={idx} className="aspect-square bg-[var(--pm-bg)] overflow-hidden cursor-pointer group relative">
                  <img 
                    src={img} 
                    alt={`Photo ${idx}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Trade Connections (Facebook Friends Style) */}
          <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-[var(--pm-text)]">ট্রেড নেটওয়ার্ক</h3>
                <span className="text-[10px] text-[var(--pm-text-muted)] font-medium">১,২৩৪ জন মার্চেন্ট পার্টনার</span>
              </div>
              <button 
                onClick={() => toast.info("সকল কানেকশনস উইন্ডো")}
                className="text-xs font-bold text-[var(--pm-accent)] hover:underline cursor-pointer"
              >
                সবাইকে দেখুন
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {[
                { name: 'হাজী রফিক', role: 'টেক্সটাইল', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
                { name: 'ফারহানা জামান', role: 'অর্গানিক ফুড', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop' },
                { name: 'তানভীর আহমেদ', role: 'ইলেকট্রনিক্স', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
              ].map((friend, i) => (
                <div key={i} className="flex flex-col gap-1 cursor-pointer group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-[var(--pm-bg)] border border-[var(--pm-border)]">
                    <img src={friend.img} alt={friend.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[11px] font-bold text-[var(--pm-text)] truncate leading-tight group-hover:text-[var(--pm-accent)]">
                    {friend.name}
                  </span>
                  <span className="text-[9px] text-[var(--pm-text-muted)] truncate leading-tight">
                    {friend.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ━━━━ RIGHT COLUMN: MAIN TIMELINE FEED (7 COLS) ━━━━ */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          <AnimatePresence mode="wait">
            
            {/* ━━━ TAB 1: POSTS (Facebook Standard Feed View) ━━━ */}
            {activeTab === 'posts' && (
              <motion.div
                key="posts-feed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                {/* 1. Facebook "What's on your mind?" Composer Card */}
                <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={displayAvatar} 
                      alt={displayName} 
                      className="w-10 h-10 rounded-full object-cover border border-[var(--pm-border)] shrink-0" 
                    />
                    <form onSubmit={handleInlinePostSubmit} className="flex-1">
                      <input
                        type="text"
                        value={composerContent}
                        onChange={(e) => setComposerContent(e.target.value)}
                        placeholder={`আপনার মনে কী আছে, ${displayName}?`}
                        className="w-full bg-[var(--pm-bg)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-full px-4 py-2.5 text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-text-muted)] focus:outline-none focus:border-[var(--pm-accent)] transition-all font-medium"
                      />
                    </form>
                  </div>

                  <div className="w-full h-[1px] bg-[var(--pm-border)]/50 pt-1" />

                  {/* 4 Quick Actions like Facebook (Photo, Tag, Demand, Offer) */}
                  <div className="grid grid-cols-4 gap-1 text-[11px] font-bold text-[var(--pm-text-muted)] pt-1">
                    <button 
                      onClick={() => setOpenModal(true)}
                      className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors hover:text-emerald-500 cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-emerald-500" />
                      <span className="truncate">ছবি/পণ্য</span>
                    </button>

                    <button 
                      onClick={() => setOpenModal(true)}
                      className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors hover:text-blue-500 cursor-pointer"
                    >
                      <Tag className="w-4 h-4 text-blue-500" />
                      <span className="truncate">হোলসেল</span>
                    </button>

                    <button 
                      onClick={() => setOpenModal(true)}
                      className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors hover:text-amber-500 cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-amber-500" />
                      <span className="truncate">ডিমান্ড</span>
                    </button>

                    <button 
                      onClick={() => setOpenModal(true)}
                      className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors hover:text-rose-500 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-rose-500" />
                      <span className="truncate">অফার</span>
                    </button>
                  </div>
                </div>

                {/* 2. Manage Posts / Filter Bar */}
                <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs">
                  <span className="font-black text-[var(--pm-text)] flex items-center gap-1.5">
                    টাইমলাইন পোস্টসমূহ
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {(['all', 'products', 'demands'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setPostFilter(filter)}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                          postFilter === filter
                            ? 'bg-[var(--pm-accent)]/15 text-[var(--pm-accent)]'
                            : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                        }`}
                      >
                        {filter === 'all' && 'সকল'}
                        {filter === 'products' && 'পণ্য'}
                        {filter === 'demands' && 'চাহিদা'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Facebook-style Timeline Posts Stream */}
                
                {/* 3A. Product Posts */}
                {(postFilter === 'all' || postFilter === 'products') && myProducts.map((prod) => {
                  const isLiked = likedPosts[prod.id];
                  const comments = commentsMap[prod.id] || [];
                  const isCommentOpen = activeCommentPostId === prod.id;

                  return (
                    <div 
                      key={prod.id}
                      className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden flex flex-col"
                    >
                      {/* Post Header */}
                      <div className="p-3.5 sm:p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={displayAvatar} 
                            alt={displayName} 
                            className="w-10 h-10 rounded-full object-cover border border-[var(--pm-border)]"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-black text-[var(--pm-text)]">{displayName}</h4>
                              <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black px-1.5 py-0.2 rounded">
                                সেলার
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-[var(--pm-text-muted)] font-medium mt-0.5">
                              <span>{new Date(prod.createdAt).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5"><Globe className="w-3 h-3" /> পাবলিক</span>
                            </div>
                          </div>
                        </div>

                        <button className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] p-1 rounded-full cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Post Caption */}
                      <p className="px-3.5 sm:px-4 pb-3 text-xs text-[var(--pm-text)] font-medium leading-relaxed">
                        📦 সরাসরি মিল-গেট পাইকারি দরে পাওয়া যাচ্ছে <span className="font-bold text-[var(--pm-accent)]">{prod.title}</span>। নিজস্ব ফ্যাক্টরি থেকে সরাসরি সরবরাহ করা হচ্ছে। পাইকারি ক্রেতারা দ্রুত যোগাযোগ করতে পারেন।
                      </p>

                      {/* Post Media / Product Preview */}
                      <div className="w-full bg-[var(--pm-bg)] relative border-y border-[var(--pm-border)]/50">
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.title} 
                          className="w-full max-h-96 object-cover"
                        />
                        <div className="p-3 bg-[var(--pm-surface)]/95 backdrop-blur-md flex items-center justify-between border-t border-[var(--pm-border)]/50">
                          <div>
                            <span className="text-[10px] font-bold text-[var(--pm-text-muted)]">হোলসেল রেট</span>
                            <p className="text-sm font-black text-[var(--pm-accent)]">{prod.price}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-[var(--pm-text-muted)]">নূন্যতম অর্ডার</span>
                            <p className="text-xs font-black text-[var(--pm-text)]">{prod.moq}</p>
                          </div>
                        </div>
                      </div>

                      {/* Post Reactions & Comments Count */}
                      <div className="px-4 py-2 flex items-center justify-between text-[11px] text-[var(--pm-text-muted)] font-medium border-b border-[var(--pm-border)]/40">
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-1">
                            <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px]">👍</span>
                            <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px]">❤️</span>
                          </div>
                          <span>{prod.likeCount + (isLiked ? 1 : 0)} জন</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{comments.length}টি মন্তব্য</span>
                          <span>•</span>
                          <span>২টি শেয়ার</span>
                        </div>
                      </div>

                      {/* Facebook 4-Action Bar (Like, Comment, Share, Inquire) */}
                      <div className="px-2 py-1 flex items-center justify-between">
                        <button 
                          onClick={() => togglePostLike(prod.id)}
                          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                            isLiked ? 'text-[var(--pm-accent)]' : 'text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)]'
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-[var(--pm-accent)]' : ''}`} />
                          <span>লাইক</span>
                        </button>

                        <button 
                          onClick={() => setActiveCommentPostId(isCommentOpen ? null : prod.id)}
                          className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>মন্তব্য</span>
                        </button>

                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("পোস্টের লিংক কপি করা হয়েছে!");
                          }}
                          className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] transition-colors cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>শেয়ার</span>
                        </button>

                        <button 
                          onClick={() => toast.success("ইনকোয়ারি ও অর্ডার রিকোয়েস্ট পাঠানো হয়েছে")}
                          className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold text-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/10 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>অর্ডার</span>
                        </button>
                      </div>

                      {/* Inline Interactive Comments Drawer (Facebook Style) */}
                      {isCommentOpen && (
                        <div className="px-4 py-3 bg-[var(--pm-bg)]/50 border-t border-[var(--pm-border)]/50 space-y-3">
                          {/* List of comments */}
                          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                            {comments.map((c) => (
                              <div key={c.id} className="flex items-start gap-2.5">
                                <img src={c.userAvatar} alt={c.userName} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                                <div className="flex-1 bg-[var(--pm-surface)] p-2.5 rounded-2xl border border-[var(--pm-border)]/50 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-[var(--pm-text)]">{c.userName}</span>
                                    <span className="text-[10px] text-[var(--pm-text-muted)]">{c.time}</span>
                                  </div>
                                  <p className="text-[var(--pm-text)] mt-1 font-medium">{c.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Comment input box */}
                          <div className="flex items-center gap-2 pt-1">
                            <img src={displayAvatar} alt={displayName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                            <div className="flex-1 flex items-center bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-full px-3 py-1.5 focus-within:border-[var(--pm-accent)]">
                              <input 
                                type="text"
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment(prod.id)}
                                placeholder="একটি মন্তব্য লিখুন..."
                                className="w-full bg-transparent text-xs text-[var(--pm-text)] outline-none placeholder:text-[var(--pm-text-muted)]"
                              />
                              <button 
                                onClick={() => handleAddComment(prod.id)}
                                disabled={!commentInput.trim()}
                                className="text-[var(--pm-accent)] hover:opacity-80 disabled:opacity-30 cursor-pointer p-0.5"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}

                {/* 3B. Demand Posts */}
                {(postFilter === 'all' || postFilter === 'demands') && myDemands.map((demand) => {
                  const isLiked = likedPosts[demand.id];
                  const matchedSellers = SERVICE_SELLERS.filter(
                    s => s.locationId === demand.locationId && s.serviceId === demand.serviceId
                  );

                  return (
                    <div 
                      key={demand.id}
                      className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden flex flex-col"
                    >
                      {/* Post Header */}
                      <div className="p-3.5 sm:p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={displayAvatar} 
                            alt={displayName} 
                            className="w-10 h-10 rounded-full object-cover border border-[var(--pm-border)]"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-black text-[var(--pm-text)]">{displayName}</h4>
                              <span className={`text-[8px] font-black px-1.5 py-0.2 rounded uppercase ${getUrgencyBadge(demand.urgency)}`}>
                                {demand.urgency === 'urgent' ? 'জরুরী চাহিদা' : 'সার্ভিস চাহিদা'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-[var(--pm-text-muted)] font-medium mt-0.5">
                              <span>{new Date(demand.createdAt).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5"><Globe className="w-3 h-3" /> পাবলিক</span>
                            </div>
                          </div>
                        </div>

                        <button className="text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] p-1 rounded-full cursor-pointer">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Post Caption */}
                      <div className="px-3.5 sm:px-4 pb-3">
                        <p className="text-xs text-[var(--pm-text)] font-semibold leading-relaxed p-3.5 rounded-xl bg-[var(--pm-bg)]/60 border border-[var(--pm-border)]/50">
                          📢 <strong className="text-[var(--pm-accent)]">{demand.locationName}</strong>-এ জরুরী ভিত্তিতে <strong className="text-[var(--pm-text)]">{demand.serviceName}</strong> প্রয়োজন। 
                          বাজেট রেঞ্জ: <span className="font-bold text-[var(--pm-accent)]">{demand.budgetTierName}</span>। আগ্রহী স্থানীয় ভেন্ডররা যোগাযোগ করুন।
                        </p>
                      </div>

                      {/* Matched local sellers */}
                      {matchedSellers.length > 0 && (
                        <div className="mx-3.5 sm:mx-4 mb-3 p-3 rounded-xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)]/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-black text-[var(--pm-text)]">
                              👥 ম্যাচিং বিক্রেতা ({matchedSellers.length} জন)
                            </span>
                            <span className="text-[9px] text-emerald-500 font-bold">ভেরিফাইড</span>
                          </div>

                          <div className="flex flex-col gap-2">
                            {matchedSellers.map(s => (
                              <div key={s.id} className="flex items-center justify-between bg-[var(--pm-bg)] p-2 rounded-lg text-xs">
                                <span className="font-bold text-[var(--pm-text)]">{s.avatar} {s.name}</span>
                                <a 
                                  href={`tel:${s.contact}`} 
                                  className="bg-[var(--pm-accent)] text-white px-2 py-1 rounded text-[10px] font-black flex items-center gap-1 shadow-xs"
                                >
                                  <Phone className="w-3 h-3" /> কল
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reactions Count */}
                      <div className="px-4 py-2 flex items-center justify-between text-[11px] text-[var(--pm-text-muted)] font-medium border-t border-[var(--pm-border)]/40">
                        <div className="flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px]">👍</span>
                          <span>{isLiked ? '১ জন' : '০ জন'}</span>
                        </div>
                        <span>২টি প্রস্তাব জমা হয়েছে</span>
                      </div>

                      {/* Action Bar */}
                      <div className="px-2 py-1 flex items-center justify-between border-t border-[var(--pm-border)]/40">
                        <button 
                          onClick={() => togglePostLike(demand.id)}
                          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                            isLiked ? 'text-[var(--pm-accent)]' : 'text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)]'
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-[var(--pm-accent)]' : ''}`} />
                          <span>লাইক</span>
                        </button>

                        <button 
                          onClick={() => toast.info("কোটেশন দেওয়ার বক্স খুলছে...")}
                          className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>কোটেশন দিন</span>
                        </button>

                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("লিংক কপি করা হয়েছে!");
                          }}
                          className="flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] transition-colors cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>শেয়ার</span>
                        </button>
                      </div>

                    </div>
                  );
                })}

              </motion.div>
            )}

            {/* ━━━ TAB 2: ABOUT (Facebook Style Detailed About) ━━━ */}
            {activeTab === 'about' && (
              <motion.div
                key="about-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-base text-[var(--pm-text)]">
                    পরিচিতি ও ব্যবসায়িক বিবরণ (About)
                  </h3>
                  <button 
                    onClick={() => setOpenEditProfileModal(true)}
                    className="text-xs font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" /> তথ্য পরিবর্তন
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[var(--pm-bg)]/70 border border-[var(--pm-border)] space-y-1">
                    <span className="text-[10px] text-[var(--pm-text-muted)] font-black uppercase">পুরো নাম</span>
                    <p className="font-bold text-[var(--pm-text)]">{displayName}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--pm-bg)]/70 border border-[var(--pm-border)] space-y-1">
                    <span className="text-[10px] text-[var(--pm-text-muted)] font-black uppercase">অ্যাকাউন্টের ধরন</span>
                    <p className="font-bold text-[var(--pm-text)]">{isSeller ? 'মার্চেন্ট সেলার (Wholesale Store)' : 'সাধারণ পাইকার বায়ার (Buyer)'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--pm-bg)]/70 border border-[var(--pm-border)] space-y-1">
                    <span className="text-[10px] text-[var(--pm-text-muted)] font-black uppercase">ইমেইল ঠিকানা</span>
                    <p className="font-bold text-[var(--pm-text)]">{user.email || 'নিবন্ধিত নয়'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--pm-bg)]/70 border border-[var(--pm-border)] space-y-1">
                    <span className="text-[10px] text-[var(--pm-text-muted)] font-black uppercase">মোবাইল নম্বর</span>
                    <p className="font-bold text-[var(--pm-text)]">{user.phone || editPhone || '০১৭xxxxxxxx'}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--pm-bg)]/70 border border-[var(--pm-border)] space-y-1">
                    <span className="text-[10px] text-[var(--pm-text-muted)] font-black uppercase">ট্রেড লোকেশন / শহর</span>
                    <p className="font-bold text-[var(--pm-text)]">{editCity}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--pm-bg)]/70 border border-[var(--pm-border)] space-y-1">
                    <span className="text-[10px] text-[var(--pm-text-muted)] font-black uppercase">সিকিউরিটি স্ট্যাটাস</span>
                    <p className="font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5" /> ২-ফ্যাক্টর প্রটেক্টেড
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium leading-relaxed flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span>পাইকার মার্ট ট্রাস্ট সিস্টেম দ্বারা আপনার অ্যাকাউন্ট ও লেনদেন ২৫৬-বিট এনক্রিপশন ও এসক্রো সিকিউরিটি দ্বারা ১০০% সুরক্ষিত।</span>
                </div>
              </motion.div>
            )}

            {/* ━━━ TAB 3: ORDERS (Order History View) ━━━ */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl sm:rounded-3xl p-5 shadow-xs flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[var(--pm-text)]">আমার সাম্প্রতিক অর্ডারসমূহ</h3>
                    <p className="text-[11px] text-[var(--pm-text-muted)]">সরাসরি ট্র্যাকিং ও ইনভয়েস ডাউনলোড</p>
                  </div>
                  <Link 
                    to="/orders" 
                    className="text-xs font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1"
                  >
                    সব অর্ডার দেখুন <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3 pt-1">
                  {[
                    { id: 'PK-98241', item: 'খাঁটি সুন্দরবনের মধু (১০ কেজি বাল্ক)', amount: '৳ ৮,৫০০', status: 'ডেলিভারির পথে', date: '২৫ মে, ২০২৬', courier: 'রেডএক্স লজিস্টিকস' },
                    { id: 'PK-98104', item: 'এক্সক্লুসিভ কটন টি-শার্ট (১০০ পিস লট)', amount: '৳ ২৫,০০০', status: 'সম্পন্ন হয়েছে', date: '২০ মে, ২০২৬', courier: 'সুন্দরবন কুরিয়ার' },
                    { id: 'PK-97992', item: 'স্মার্ট ওয়াচ আলটিমেট এডিশন', amount: '৳ ২,৫০০', status: 'সম্পন্ন হয়েছে', date: '১২ মে, ২০২৬', courier: 'পাঠাও পার্সেল' },
                  ].map((order, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-[var(--pm-bg)]/60 border border-[var(--pm-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-[var(--pm-text)]">{order.item}</span>
                            <span className="text-[10px] font-mono text-[var(--pm-text-muted)]">#{order.id}</span>
                          </div>
                          <span className="text-[11px] text-[var(--pm-text-muted)] mt-0.5 block">
                            তারিখ: {order.date} • কুরিয়ার: {order.courier}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--pm-border)]/50">
                        <span className="font-black text-[var(--pm-accent)] text-sm">{order.amount}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          order.status === 'সম্পন্ন হয়েছে' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ━━━ TAB 4: DEMANDS / CATALOG ━━━ */}
            {activeTab === 'demands' && (
              <motion.div
                key="demands-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center justify-between bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl p-4">
                  <div>
                    <h3 className="text-sm font-black text-[var(--pm-text)]">
                      {isSeller ? 'মার্চেন্ট পণ্য ক্যাটালগ' : 'আমার চাহিদাকৃত রিকোয়েস্টসমূহ'}
                    </h3>
                    <span className="text-xs text-[var(--pm-text-muted)]">সরাসরি অ্যাকশন ও ইনকোয়ারি</span>
                  </div>
                  <button 
                    onClick={() => setOpenModal(true)}
                    className="bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-sm cursor-pointer"
                  >
                    + নতুন যোগ করুন
                  </button>
                </div>

                {isSeller ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {myProducts.map((p) => (
                      <div key={p.id} className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl p-3 flex gap-3">
                        <img src={p.imageUrl} alt={p.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                        <div className="flex flex-col justify-between min-w-0">
                          <h4 className="text-xs font-black text-[var(--pm-text)] truncate">{p.title}</h4>
                          <span className="text-xs font-black text-[var(--pm-accent)]">{p.price}</span>
                          <span className="text-[10px] text-[var(--pm-text-muted)]">{p.moq}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myDemands.map((d) => (
                      <div key={d.id} className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black">{d.serviceName}</h4>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded ${getUrgencyBadge(d.urgency)}`}>{d.urgency}</span>
                        </div>
                        <p className="text-xs text-[var(--pm-text-muted)] mt-1">বাজেট: {d.budgetTierName} • {d.locationName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ━━━ TAB 5: PHOTOS (Facebook Photos Gallery) ━━━ */}
            {activeTab === 'photos' && (
              <motion.div
                key="photos-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl sm:rounded-3xl p-5 shadow-xs flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[var(--pm-text)]">সকল আপলোডকৃত ছবি</h3>
                  <button 
                    onClick={() => toast.info("ছবি আপলোড উইন্ডো")}
                    className="text-xs font-bold text-[var(--pm-accent)] hover:underline cursor-pointer"
                  >
                    + ছবি আপলোড
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1546868871-70c122467d9b?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1622484211148-716598e04041?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
                  ].map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-[var(--pm-border)] group cursor-pointer relative bg-[var(--pm-bg)]">
                      <img src={img} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

      {/* ━━━━━━━━ 3. EDIT PROFILE MODAL ━━━━━━━━ */}
      <AnimatePresence>
        {openEditProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col text-[var(--pm-text)]"
            >
              <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between">
                <h3 className="font-black text-sm">প্রোফাইল এডিট করুন</h3>
                <button
                  onClick={() => setOpenEditProfileModal(false)}
                  className="p-1 rounded-full hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-5 flex flex-col gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--pm-text-muted)]">পুরো নাম</label>
                  <input 
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl py-2 px-3 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--pm-text-muted)]">বায়ো / স্টোর পরিচিতি</label>
                  <textarea 
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl p-3 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--pm-text-muted)]">মোবাইল নম্বর</label>
                  <input 
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl py-2 px-3 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[var(--pm-text-muted)]">শহর / বাসস্থান</label>
                  <input 
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl py-2 px-3 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white py-2.5 rounded-2xl text-xs font-black shadow-md shadow-[var(--pm-accent)]/20 active:scale-95 transition-all mt-2 cursor-pointer"
                >
                  পরিবর্তন সংরক্ষণ করুন
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ━━━━━━━━ 4. COVER PHOTO PRESET MODAL ━━━━━━━━ */}
      <AnimatePresence>
        {openCoverModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col text-[var(--pm-text)]"
            >
              <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between">
                <h3 className="font-black text-sm">কভার ফটো নির্বাচন করুন</h3>
                <button
                  onClick={() => setOpenCoverModal(false)}
                  className="p-1 rounded-full hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 grid grid-cols-2 gap-3">
                {COVER_PRESETS.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => {
                      setCoverUrl(c.url);
                      setOpenCoverModal(false);
                      toast.success(`কভার আপডেট হয়েছে: ${c.name}`);
                    }}
                    className={`rounded-2xl overflow-hidden border-2 cursor-pointer transition-all group ${
                      coverUrl === c.url ? 'border-[var(--pm-accent)] ring-2 ring-[var(--pm-accent)]/20' : 'border-[var(--pm-border)] hover:border-[var(--pm-accent)]/50'
                    }`}
                  >
                    <div className="h-20 overflow-hidden">
                      <img src={c.url} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <p className="p-2 text-center text-xs font-bold bg-[var(--pm-bg)] truncate">
                      {c.name}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ━━━━━━━━ 5. DROPDOWN MODAL FOR SAFE COMMERCE POSTING ━━━━━━━━ */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col text-[var(--pm-text)]"
            >
              {/* Header */}
              <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm">
                    {isSeller ? 'নতুন পাইকারি পণ্য আপলোড' : 'নতুন সার্ভিস চাহিদা রিকোয়েস্ট'}
                  </h3>
                  <p className="text-[10px] text-[var(--pm-text-muted)] font-medium mt-0.5">
                    স্প্যামমুক্ত ড্রপডাউন ফর্ম
                  </p>
                </div>
                <button
                  onClick={() => setOpenModal(false)}
                  className="p-1 rounded-full hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* DUAL ROLE FORMS */}
              {isSeller ? (
                /* SELLER PRODUCT UPLOAD FORM */
                <form onSubmit={handleUploadProduct} className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">প্রোডাক্ট ক্যাটাগরি ও আইটেম *</label>
                    <select
                      value={selectedProductType}
                      onChange={e => setSelectedProductType(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl p-3 text-xs font-bold text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                    >
                      {PRODUCT_TYPES_CATALOG.map(pt => (
                        <option key={pt.id} value={pt.id}>{pt.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">হোলসেল প্রাইস টায়ার (Wholesale Rate) *</label>
                    <select
                      value={selectedPriceTier}
                      onChange={e => setSelectedPriceTier(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl p-3 text-xs font-bold text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                    >
                      {WHOLESALE_PRICE_TIERS.map(pr => (
                        <option key={pr.id} value={pr.id}>{pr.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">নূন্যতম অর্ডার পরিমাণ (MOQ) *</label>
                    <select
                      value={selectedMOQ}
                      onChange={e => setSelectedMOQ(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl p-3 text-xs font-bold text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                    >
                      {MOQ_CATALOG.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">পণ্য প্রস্তুতকারী জেলা / অরিজিন *</label>
                    <select
                      value={selectedOrigin}
                      onChange={e => setSelectedOrigin(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl p-3 text-xs font-bold text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                    >
                      {ORIGINS_CATALOG.map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all mt-2 cursor-pointer"
                  >
                    পণ্যটি ক্যাটালগে যুক্ত করুন
                  </button>
                </form>
              ) : (
                /* BUYER DEMAND FORM */
                <form onSubmit={handlePostDemand} className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">সার্ভিসের ধরন বেছে নিন *</label>
                    <select
                      value={selectedService}
                      onChange={e => setSelectedService(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl p-3 text-xs font-bold text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                    >
                      {SERVICES_CATALOG.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">আপনার এলাকা / জোন *</label>
                    <select
                      value={selectedLocation}
                      onChange={e => setSelectedLocation(e.target.value)}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl p-3 text-xs font-bold text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
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
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl p-3 text-xs font-bold text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                    >
                      {BUDGET_TIERS.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">জরুরিতা (Urgency Level)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['low', 'normal', 'urgent'] as const).map(u => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setSelectedUrgency(u)}
                          className={`py-2 text-[10px] font-black rounded-xl border transition-all cursor-pointer ${
                            selectedUrgency === u 
                              ? 'bg-[var(--pm-accent)] text-white border-[var(--pm-accent)] shadow-sm' 
                              : 'bg-[var(--pm-bg)] text-[var(--pm-text-muted)] border-[var(--pm-border)]'
                          }`}
                        >
                          {u === 'urgent' ? '🚨 অতি জরুরী' : u === 'normal' ? '⚡ সাধারণ' : '🌱 ধীরেসুস্থে'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all mt-2 cursor-pointer"
                  >
                    চাহিদাটি পোস্ট করুন
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
