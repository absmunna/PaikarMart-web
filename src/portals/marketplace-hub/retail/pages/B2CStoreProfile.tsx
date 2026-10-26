import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Store, Star, Users, CheckCircle2, 
  MapPin, Gift, Phone, Bookmark, Heart, ThumbsUp, MessageCircle, HelpCircle, BadgePercent 
} from 'lucide-react';
import { ProductCard } from "@/features/product/components/ProductCard";
import { Product } from '@/modules/product/types/product.types';
import { useCartStore } from '@modules/cart';
import { useNotificationStore } from '@/modules/notification/notificationStore';
import { toast } from 'sonner';

interface B2CStoreProfileProps {
  storeName: string;
  products: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

function StorePost({ post, storeName }: { post: any, storeName: string }) {
  const [likes, setLikes] = useState(post.likes);
  const [didLike, setDidLike] = useState(false);
  
  const handleLikePost = () => {
    if (didLike) {
      setLikes(likes - 1);
      setDidLike(false);
    } else {
      setLikes(likes + 1);
      setDidLike(true);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/5 overflow-hidden">
      {/* Poster Info */}
      <div className="p-3.5 flex items-center gap-2.5 border-b border-white/[0.05]">
        <div className="w-8 h-8 rounded-xl bg-[var(--pm-accent-soft)] flex items-center justify-center text-[var(--pm-accent)] font-bold text-sm">
          {storeName.charAt(0)}
        </div>
        <div>
          <h4 className="text-xs font-bold text-white mb-0.5">{storeName}</h4>
          <span className="text-[8px] text-[var(--pm-text-secondary)] font-bold">{post.date}</span>
        </div>
      </div>

      {/* Post Image Banner */}
      <div className="relative aspect-video overflow-hidden bg-black/40 border-b border-white/5">
        <img src={post.image} alt="Promotion Banner" className="w-full h-full object-cover" />
      </div>

      {/* Post Context Info block */}
      <div className="p-4 space-y-2">
        <h4 className="text-xs font-black text-white leading-snug">{post.title}</h4>
        <p className="text-[10px] text-[var(--pm-text-secondary)] leading-relaxed font-semibold">{post.content}</p>
      </div>

      {/* Direct Social Interaction keys */}
      <div className="p-2 border-t border-white/[0.05] flex items-center justify-around text-[10px] font-bold select-none text-[var(--pm-text-secondary)]">
        <button 
          onClick={handleLikePost}
          className={`flex items-center gap-1.5 py-1 px-3 hover:bg-white/5 rounded-lg transition-transform active:scale-95 ${
            didLike ? 'text-[var(--pm-accent)]' : ''
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${didLike ? 'fill-current':''}`} /> {likes} লাইক
        </button>
        <button className="flex items-center gap-1.5 py-1 px-3 hover:bg-white/5 rounded-lg">
          <MessageCircle className="w-3.5 h-3.5" /> {post.comments} কমেন্টস
        </button>
      </div>
    </div>
  );
}

export const B2CStoreProfile: React.FC<B2CStoreProfileProps> = ({ 
  storeName, 
  products, 
  onBack,
  onSelectProduct
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'deals' | 'feed' | 'about'>('products');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1402);
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Filter store-specific products
  const storeProducts = products.filter(p => p.sellerId && p.sellerId === storeName);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setFollowersCount(followersCount - 1);
      setIsFollowing(false);
      addNotification(`"${storeName}" আনফলো করা হয়েছে।`, 'info');
    } else {
      setFollowersCount(followersCount + 1);
      setIsFollowing(true);
      addNotification(`"${storeName}" ফলো করা হয়েছে!`, 'success');
      toast.success("আপনি এই শপটিকে সফলভাবে লাইনেড করেছেন!");
    }
  };

  // Store exclusive mock deals coupons
  const storeCoupons = [
    { code: "LEATHER15", discount: "৳১৫০ ছাড়", desc: "১৫০০ টাকা ক্রয়ে প্রযোজ্য", expires: "০৫ জুন ২০২৬" },
    { code: "FREE990", discount: "ফ্রি ডেলিভারি", desc: "৯৯০ টাকা ক্রয়ে প্রযোজ্য", expires: "১২ জুন ২০২৬" }
  ];

  // Store custom promotional updates / feed timeline
  const storePosts = [
    {
      id: 1,
      title: "ঈদ ধামাকা অফার ২০২৬! 🎉",
      content: "আমাদের শপের জনপ্রিয় আইটেমগুলোতে এখন পাচ্ছেন ১৫% থেকে ৩০% পর্যন্ত ফ্ল্যাট ছাড়! স্টক সীমিত থাকার কারণে এখনই অর্ডার করতে চোখ রাখুন। অফারটি শুধুমাত্র এই সপ্তাহেই বলবৎ থাকবে।",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80",
      likes: 242,
      comments: 32,
      date: "২ দিন আগে"
    },
    {
      id: 2,
      title: "নতুন স্টক চলে এসেছে! 👜✨",
      content: "গ্রাহকদের দীর্ঘ অনুরোধে আমাদের প্রিমিয়াম ট্রাভেল ফ্লাস্ক ও লেদার ব্যাগগুলো পুনরায় রিস্টক করা হয়েছে। চমৎকার গুণমান আর শতভাগ জেনুইন উপাদানের গ্যারান্টি নিয়ে এখনই কার্টে নিয়ে নিন।",
      image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=500&q=80",
      likes: 184,
      comments: 15,
      date: "৫ দিন আগে"
    }
  ];

  const handleClaimCoupon = (code: string) => {
    toast.success(`কুপন "${code}" কপি করা হয়েছে! চেকআউটে ব্যবহার করুন।`);
  };

  return (
    <div className="w-full bg-[var(--pm-bg)] min-h-screen text-[var(--pm-text)] pb-24">
      {/* Absolute top navbar */}
      <div className="sticky top-16 z-50 bg-[var(--pm-bg)]/90 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-white/[0.08]">
        <button 
          onClick={onBack}
          className="p-2 -ml-1 rounded-full hover:bg-white/5 text-[var(--pm-text)] transition-colors active:scale-95 shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-black uppercase tracking-wider text-[var(--pm-text-secondary)] truncate">মার্চেন্ট প্রোফাইল</span>
      </div>

      {/* Cover / Banner Presets Display */}
      <div className="h-28 sm:h-32 bg-gradient-to-r from-orange-500/20 via-orange-600/10 to-transparent relative border-b border-white/[0.05]">
        <div className="absolute inset-0 bg-black/40" />
        <span className="absolute bottom-3 right-4 bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[8px] font-black text-white/80 select-none">
          OFFICIAL VERIFIED SHOP
        </span>
      </div>

      {/* Shop Information Section */}
      <div className="px-4 -mt-10 relative z-10">
        <div className="flex items-end gap-3 justify-between">
          <div className="w-18 h-18 rounded-2xl bg-[var(--pm-surface)] border-2 border-[var(--pm-bg)] text-[var(--pm-accent)] flex items-center justify-center shadow-xl font-black text-3xl">
            {storeName.charAt(0)}
          </div>
          <button 
            onClick={handleFollowToggle}
            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition-all active:scale-95 ${
              isFollowing 
                ? 'bg-white/10 text-white border border-white/15'
                : 'bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white'
            }`}
          >
            {isFollowing ? 'ফলোয়িং' : 'ফলো করুন'}
          </button>
        </div>

        <div className="mt-3 space-y-2 select-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-base font-black text-white">{storeName}</h1>
            <CheckCircle2 className="w-4.5 h-4.5 text-cyan-400 fill-cyan-400/10 shrink-0" />
          </div>

          <div className="flex items-center gap-3 text-[10px] text-[var(--pm-text-secondary)] font-bold">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              ৪.৮ (২৪৪ রিভিউ)
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              {followersCount.toLocaleString('bn-BD')} ফলোয়ারস
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu Selection */}
      <div className="mt-6 px-4">
        <div className="flex border-b border-white/[0.06] select-none text-xs font-black pb-px">
          {[
            { id: 'products', label: 'পণ্য সমূহ' },
            { id: 'deals', label: 'কুপন ও অফার' },
            { id: 'feed', label: 'শপ ফিড' },
            { id: 'about', label: 'পরিচিতি' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 text-center pb-2.5 border-b-2 transition-all ${
                activeTab === tab.id 
                  ? 'border-[var(--pm-accent)] text-white text-[11px] font-black' 
                  : 'border-transparent text-[var(--pm-text-secondary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-5">
          {/* Products Grid list */}
          {activeTab === 'products' && (
            <div>
              {storeProducts.length === 0 ? (
                <div className="py-12 text-center text-[var(--pm-text-secondary)] bg-[var(--pm-surface)]/40 border border-white/5 rounded-2xl">
                  <Store className="w-12 h-12 text-zinc-600 mx-auto mb-2.5 animate-pulse" />
                  <p className="text-xs font-bold text-white">বর্তমানে কোনো পণ্য নেই</p>
                  <p className="text-[10px] text-[var(--pm-text-secondary)] mt-1">শপের রিস্টক খুব শীঘ্রই আপডেট করা হবে।</p>
                </div>
              ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(145px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(175px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(205px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(225px,1fr))] gap-4 sm:gap-5">
                  {storeProducts.map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Special Coupons section */}
          {activeTab === 'deals' && (
            <div className="space-y-3.5 text-left">
              <h3 className="text-[11px] font-black text-white uppercase tracking-wider mb-2 select-none">এক্সক্লুসিভ শপ ডিসকাউন্ট কুপনস</h3>
              {storeCoupons.map((cp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-[var(--pm-accent)]" />
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                      <BadgePercent className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                      {cp.discount}
                    </h4>
                    <p className="text-[10px] text-[var(--pm-text-secondary)] mt-1 font-semibold">{cp.desc}</p>
                    <p className="text-[8px] text-[var(--pm-text-secondary)] mt-0.5 font-bold">মেয়াদ: {cp.expires} পর্যন্ত</p>
                  </div>
                  <button 
                    onClick={() => handleClaimCoupon(cp.code)}
                    className="bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/20 active:scale-95 px-3 py-1.5 rounded-xl text-[9px] font-black tracking-wide border border-[var(--pm-accent)]/25 shrink-0"
                  >
                    ক্লেম করুন
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Timeline Feed posts updates */}
          {activeTab === 'feed' && (
            <div className="space-y-5 text-left">
              {storePosts.map(post => (
                <StorePost key={post.id} post={post} storeName={storeName} />
              ))}
            </div>
          )}

          {/* Bio introduction details verify licenses */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-xs text-left text-[var(--pm-text-secondary)] leading-relaxed">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2.5">
                <span className="text-[10px] font-black text-white uppercase tracking-wider block">দোকানের বিবরণ</span>
                <p className="text-[10px] font-medium leading-relaxed">
                  {storeName} ঢাকা, বাংলাদেশের একটি স্বনামধন্য বিরাসতি সরবরাহকারী ও আমদানিকারক প্রতিষ্ঠান। আমরা আমাদের ক্রেতা সাধারণের নিকট প্রিমিয়াম মানের সেরা পণ্য সবচেয়ে সাশ্রয়ী রিটেইল দামে অফার করতে প্রতিশ্রুতিবদ্ধ।
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/5 space-y-3 bg-black/15">
                <span className="text-[10px] font-black text-white uppercase tracking-wider block">শপ পারমিট ও লাইসেন্স</span>
                <div className="space-y-2 text-[10px] font-bold text-[var(--pm-text-secondary)]">
                  <div className="flex justify-between">
                    <span>লাইসেন্স নং</span>
                    <span className="text-white">TRND-84021-Dhaka</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ভেরিফিকেশন স্ট্যাটাস</span>
                    <span className="text-cyan-400">অনুমোদিত মার্চেন্ট (Verified)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>নিবন্ধন এলাকা</span>
                    <span className="text-white">ঢাকা সিটি কর্পোরেশন</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-center justify-center py-2.5 border-t border-white/5">
                <Phone className="w-4 h-4 text-[var(--pm-accent)]" />
                <span className="text-[10px] font-black text-white">হটলাইন: ০৯৬-৩৮০২২২২ (২৪/৭ সাপোর্ট)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
