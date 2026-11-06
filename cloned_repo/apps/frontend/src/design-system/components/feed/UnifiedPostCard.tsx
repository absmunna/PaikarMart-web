import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  ShoppingBag, 
  ShoppingCart, 
  CheckCircle2, 
  Bookmark, 
  Navigation, 
  Gavel,
  ChevronDown,
  ChevronUp,
  MapPin,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/modules/cart';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Unified Post Card Interface
export interface UnifiedPost {
  id: string;
  type: 'product' | 'demand' | 'status' | 'news' | 'service' | 'ride';
  domain?: 'RETAIL' | 'WHOLESALE' | 'B2B' | 'SERVICES' | 'LOCAL' | 'SOCIAL';
  authorName: string;
  authorAvatar: string;
  isVerified: boolean;
  authorRole: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  location?: string;
  likes: number;
  comments: number;
  product?: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    bnLabel?: string;
    moq?: number;
  };
  metadata?: {
    urgency?: string;
    readTime?: string;
    views?: number;
    serviceType?: string;
    duration?: string;
    isFlashSale?: boolean;
    isPkExclusive?: boolean;
    isOfficialBrand?: boolean;
    distance?: string;
    deliveryTime?: string;
    discountTag?: string;
  };
}

interface UnifiedPostCardProps {
  post: UnifiedPost;
}

export const UnifiedPostCard: React.FC<UnifiedPostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'পোস্ট সেভ থেকে সরানো হয়েছে' : 'পোস্টটি সেভ করা হয়েছে');
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.authorName,
          text: post.content,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('পোস্টের লিংক কপি করা হয়েছে');
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.product) return;
    addItem({
      id: post.product.id,
      sourceId: post.product.id,
      name: post.product.title,
      price: post.product.price,
      quantity: 1,
      image: post.product.imageUrl,
      domain: 'retail',
      metadata: { portal: 'RETAIL' }
    });
    navigate('/checkout');
    toast.success(`চেকআউটে রিডায়রেক্ট হচ্ছে: ${post.product.title}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!post.product) return;
    addItem({
      id: post.product.id,
      sourceId: post.product.id,
      name: post.product.title,
      price: post.product.price,
      quantity: 1,
      image: post.product.imageUrl,
      domain: 'retail',
      metadata: { portal: 'RETAIL' }
    });
    toast.success(`কার্টে যোগ হয়েছে: ${post.product.title}`);
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`মেসেজ পাঠাচ্ছেন: ${post.authorName}`);
    navigate(`/messages/${post.id}`);
  };

  // Determine if content is long enough to warrant an expand toggle
  const isContentLong = post.content.length > 180;
  const displayedContent = isContentLong && !isExpanded 
    ? `${post.content.slice(0, 180)}...` 
    : post.content;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 flex flex-col gap-3 hover:border-[var(--pm-accent)]/40 transition-all group shadow-sm hover:shadow-md overflow-hidden"
    >
      {/* ─── Header: Responsive author info + actions ─── */}
      <header className="flex items-center justify-between gap-2.5 min-w-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--pm-bg)] border border-[var(--pm-border)] overflow-hidden shrink-0 ring-1 ring-[var(--pm-border)]">
            <img 
              src={post.authorAvatar} 
              alt={post.authorName} 
              className="w-full h-full object-cover select-none" 
              loading="lazy"
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-bold text-xs sm:text-sm text-[var(--pm-text)] truncate block">
                {post.authorName}
              </span>
              {post.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 inline-block ml-0.5" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[var(--pm-text-muted)] truncate">
              <span>{post.timestamp}</span>
              {post.location && (
                <>
                  <span className="text-[var(--pm-border)]">•</span>
                  <MapPin className="w-2.5 h-2.5 inline" />
                  <span className="truncate">{post.location}</span>
                </>
              )}
              {post.domain && (
                <>
                  <span className="text-[var(--pm-border)]">•</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border",
                    post.domain === 'WHOLESALE' ? "text-blue-400 bg-blue-500/10 border-blue-500/20" :
                    post.domain === 'B2B' ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" :
                    post.domain === 'SERVICES' ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                    "text-amber-400 bg-amber-500/10 border-amber-500/20"
                  )}>
                    {post.domain}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action icons on header: Save / Bookmark & Share */}
        <div className="flex items-center gap-1 shrink-0">
          <button 
            type="button"
            onClick={handleShare}
            aria-label="শেয়ার করুন"
            className="p-1.5 sm:p-2 rounded-xl text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-white/5 active:scale-90 transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={handleSave}
            aria-label="সেভ করুন"
            className={cn(
              "p-1.5 sm:p-2 rounded-xl transition-all active:scale-90",
              isSaved 
                ? "text-[var(--pm-accent)] bg-[var(--pm-accent)]/10" 
                : "text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-white/5"
            )}
          >
            <Bookmark className={cn("w-4 h-4", isSaved && "fill-[var(--pm-accent)]")} />
          </button>
        </div>
      </header>

      {/* ─── Content Text: Responsive typography & fluid wrap ─── */}
      <div className="text-xs sm:text-sm text-[var(--pm-text)] leading-relaxed break-words">
        <p className="whitespace-pre-line">{displayedContent}</p>
        {isContentLong && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mt-1 inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[var(--pm-accent)] hover:underline"
          >
            {isExpanded ? (
              <>কম দেখুন <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>আরও পড়ুন <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        )}
      </div>

      {/* ─── Media: Responsive 1:1 Instagram/Facebook Square ─── */}
      {post.imageUrl && (
        <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden aspect-square bg-[var(--pm-bg)] border border-[var(--pm-border)]/40 group/media">
          <img 
            src={post.imageUrl} 
            alt="পোস্ট মিডিয়া" 
            className="w-full h-full object-cover select-none transition-transform duration-500 group-hover/media:scale-105" 
            loading="lazy"
          />
          {/* Post Type & Urgency Badges */}
          <div className="absolute top-2.5 left-2.5 pointer-events-none flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md bg-black/60 text-white border border-white/10 shadow-sm">
              {post.type === 'product' ? 'পণ্য' : post.type === 'demand' ? 'চাহিদা' : post.type === 'news' ? 'খবর' : post.type === 'service' ? 'সার্ভিস' : 'ফিড'}
            </span>
            {post.metadata?.urgency === 'High' && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-500/80 text-white shadow-sm flex items-center gap-1">
                <Flame className="w-3 h-3" /> জরুরী
              </span>
            )}
            {post.metadata?.isFlashSale && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white shadow-sm">
                Flash Sale
              </span>
            )}
            {post.metadata?.isPkExclusive && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500 text-black shadow-sm">
                PK Exclusive
              </span>
            )}
            {post.metadata?.discountTag && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white shadow-sm">
                {post.metadata.discountTag}
              </span>
            )}
          </div>

          {/* Floating Action Badges: Official Brand & Distance */}
          <div className="absolute bottom-2.5 right-2.5 pointer-events-none flex flex-col items-end gap-2">
            {post.metadata?.isOfficialBrand && (
              <span className="px-2 py-1 rounded-xl bg-black/75 backdrop-blur-md text-pink-400 text-[9px] font-black border border-pink-500/20 flex items-center gap-1 shadow-sm">
                🛡️ অফিশিয়াল ব্রান্ড
              </span>
            )}
            {post.metadata?.distance && (
              <span className="px-2 py-1 rounded-xl bg-black/75 backdrop-blur-md text-emerald-400 text-[9px] font-black border border-emerald-500/20 flex items-center gap-1 shadow-sm">
                📍 {post.metadata.distance} {post.metadata.deliveryTime ? `· ${post.metadata.deliveryTime}` : ''}
              </span>
            )}
          </div>

          {post.metadata?.readTime && (
            <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
               <span className="px-2 py-1 rounded-lg text-[9px] font-black bg-black/40 backdrop-blur-md text-white border border-white/10">
                 {post.metadata.readTime}
               </span>
            </div>
          )}
        </div>
      )}

      {/* ─── Product Card Embed (Responsive) ─── */}
      {post.type === 'product' && post.product && (
        <div 
          onClick={handleBuyNow}
          className="flex items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[var(--pm-bg)] border border-[var(--pm-border)] min-w-0 hover:border-[var(--pm-accent)]/40 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <img 
              src={post.product.imageUrl} 
              alt={post.product.title} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover shrink-0 border border-[var(--pm-border)]" 
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-[var(--pm-text)] truncate">
                {post.product.title}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-black text-[var(--pm-accent)]">
                  ৳{post.product.price.toLocaleString()}
                </p>
                {post.product.moq && post.product.moq > 1 && (
                  <span className="text-[10px] text-[var(--pm-text-muted)] font-bold">
                    (MOQ: {post.product.moq}+)
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className="hidden xs:inline-block text-[11px] font-bold text-[var(--pm-text-muted)] group-hover:text-[var(--pm-accent)] transition-colors shrink-0">
            বিস্তারিত →
          </span>
        </div>
      )}

      {/* ─── Action Bar: Responsive Social Reactions & Behavioral CTAs ─── */}
      <footer className="flex items-center justify-between gap-2 pt-2.5 sm:pt-3 border-t border-[var(--pm-border)]/50 min-w-0">
        {/* Left: Like & Comment / Message buttons */}
        <div className="flex items-center gap-2 sm:gap-3 text-[var(--pm-text-muted)] shrink-0">
          <button 
            type="button"
            onClick={handleLike} 
            className={cn(
              "flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold hover:bg-rose-500/10 transition-all active:scale-90",
              liked ? "text-rose-500 font-bold" : "hover:text-rose-500"
            )}
          >
            <Heart className={cn("w-4 h-4 transition-transform", liked && "fill-rose-500 scale-110")} />
            <span className="text-[11px] sm:text-xs">{likesCount}</span>
          </button>

          <button 
            type="button"
            onClick={handleMessage} 
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs font-semibold hover:text-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/10 transition-all active:scale-90"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[11px] sm:text-xs">{post.comments}</span>
          </button>
        </div>
        
        {/* Right: Dynamic Behavioral CTAs per Post Type */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {post.type === 'product' && (
            <>
              <button 
                type="button"
                onClick={handleAddToCart} 
                title="কার্টে যোগ করুন"
                aria-label="কার্টে যোগ করুন"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:bg-[var(--pm-accent)] hover:text-white hover:border-transparent transition-all active:scale-95 flex items-center gap-1 shrink-0 shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline text-xs font-bold">কার্ট</span>
              </button>
              
              <button 
                type="button"
                onClick={handleBuyNow} 
                className="px-3 sm:px-4 py-2 rounded-xl bg-[var(--pm-accent)] text-white text-xs sm:text-sm font-black shadow-sm shadow-[var(--pm-accent)]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>কিনুন</span>
              </button>
            </>
          )}

          {post.type === 'demand' && (
            <button 
              type="button"
              onClick={handleMessage} 
              className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs sm:text-sm font-black shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
            >
              <Gavel className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>দরপ্রস্তাব দিন</span>
            </button>
          )}

          {post.type === 'status' && (
            <button 
              type="button"
              onClick={handleMessage} 
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[var(--pm-bg)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:bg-[var(--pm-accent)] hover:text-white hover:border-transparent text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>মেসেজ</span>
            </button>
          )}
        </div>
      </footer>
    </motion.article>
  );
};

