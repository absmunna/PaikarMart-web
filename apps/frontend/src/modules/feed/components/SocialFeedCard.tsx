import React, { useState, useRef } from 'react';
import { 
  Heart, MessageCircle, Bookmark, ShoppingCart, Zap, 
  MapPin, CheckCircle2, ChevronLeft, ChevronRight, 
  Play, Pause, Volume2, VolumeX, Share2, MoreHorizontal, UserPlus, UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '@/modules/wishlist';
import { useCartStore } from '@/modules/cart';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ReviewModal } from './ReviewModal';
import { FeedPost, ReviewItem } from '../types';

interface SocialFeedCardProps {
  post: FeedPost;
  onTagClick?: (tag: string) => void;
  onLocationClick?: (loc: string) => void;
}

export const SocialFeedCard: React.FC<SocialFeedCardProps> = ({
  post,
  onTagClick,
  onLocationClick
}) => {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  // Local interaction states
  const [isFollowing, setIsFollowing] = useState(post.isFollowing || post.userInteractions?.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(post.followersCount || 1200);
  const [isLiked, setIsLiked] = useState(post.userInteractions?.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.stats.likes || 0);
  const [isSaved, setIsSaved] = useState(post.userInteractions?.isSaved || false);
  const [savesCount, setSavesCount] = useState(post.stats.saves || 0);
  
  // Media carousel state
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Video state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Caption expandable state
  const [isExpanded, setIsExpanded] = useState(false);

  // Review & Q&A Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(post.reviews || []);
  const [commentsCount, setCommentsCount] = useState(post.stats.comments || reviewsList.length);

  // Product linkage
  const productData = post.product || {
    id: `prod-${post.id}`,
    title: post.content.slice(0, 36) + '...',
    price: 1250,
    originalPrice: 1600,
    discount: 22,
    moq: 1,
    image: post.mediaUrls[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
  };

  // Follow Button Action
  const handleFollowToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowersCount(prev => nextState ? prev + 1 : Math.max(0, prev - 1));
    toast.success(nextState 
      ? `আপনি ${post.sellerName} কে অনুসরণ করছেন` 
      : `${post.sellerName} কে আনফলো করা হয়েছে`
    );
  };

  // Wishlist Action (Heart)
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount(prev => nextLiked ? prev + 1 : Math.max(0, prev - 1));

    // Sync with Buyer Wishlist Store
    toggleWishlist({
      id: productData.id,
      name: productData.title,
      price: productData.price,
      originalPrice: productData.originalPrice || undefined,
      image: productData.image || post.mediaUrls[0],
      category: 'social-feed',
      stock: productData.stock || 50,
      sellerName: post.sellerName,
      sellerLocation: post.location,
      rating: 4.9,
      reviewCount: 30,
      isVerifiedSeller: post.isVerified
    } as any);

    if (nextLiked) {
      toast.success('পণ্যটি উইশলিস্টে যুক্ত হয়েছে! ❤️');
    } else {
      toast.info('উইশলিস্ট থেকে সরানো হয়েছে');
    }
  };

  // Bookmark / Save Action
  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    setSavesCount(prev => nextSaved ? prev + 1 : Math.max(0, prev - 1));
    toast.success(nextSaved ? 'পোস্টটি সংরক্ষিত হয়েছে' : 'সংরক্ষণ বাতিল করা হয়েছে');
  };

  // Add to Multi-Vendor Cart Action
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: productData.id,
      name: productData.title,
      price: productData.price,
      originalPrice: productData.originalPrice || undefined,
      image: productData.image || post.mediaUrls[0],
      quantity: 1,
      moq: productData.moq || 1,
      vendorName: post.sellerName,
      portal: post.type === 'wholesale' ? 'b2b' : 'b2c'
    });
    toast.success(`${productData.title.slice(0, 24)}... কার্টে যোগ হয়েছে! 🛒`);
  };

  // Quick Buy Action
  const handleQuickBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart(e);
    navigate('/checkout');
  };

  // Video playback toggle
  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleVideoMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleAddReview = (newRev: ReviewItem) => {
    setReviewsList(prev => [newRev, ...prev]);
    setCommentsCount(prev => prev + 1);
  };

  const isVideo = post.mediaType === 'video' || Boolean(post.videoUrl);
  const mediaList = post.mediaUrls && post.mediaUrls.length > 0 
    ? post.mediaUrls 
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'];

  return (
    <article className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl overflow-hidden shadow-xl shadow-black/40 transition-all hover:border-[var(--pm-border)]/80">
      
      {/* ─── 1. POST HEADER ─── */}
      <header className="p-4 flex items-center justify-between gap-3 bg-[var(--pm-surface)]">
        <div className="flex items-center gap-3 min-w-0">
          {/* Seller Avatar */}
          <Link to={`/store/${post.slug || post.sellerId}`} className="relative shrink-0 active:scale-95 transition-transform">
            <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-[var(--pm-accent)] via-rose-500 to-amber-400">
              <img
                src={post.avatarUrl}
                alt={post.sellerName}
                className="w-full h-full rounded-full object-cover bg-zinc-900"
              />
            </div>
            {post.isVerified && (
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--pm-surface)] flex items-center justify-center text-white" title="Verified Seller">
                <CheckCircle2 className="w-2.5 h-2.5" />
              </span>
            )}
          </Link>

          {/* Store Name, Location & Timestamp */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link to={`/store/${post.slug || post.sellerId}`} className="font-black text-sm text-white tracking-tight hover:text-[var(--pm-accent)] transition-colors cursor-pointer truncate">
                {post.sellerName}
              </Link>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[var(--pm-text-muted)] font-bold mt-0.5 flex-wrap">
              {/* Location Badge */}
              <button
                type="button"
                onClick={() => onLocationClick && onLocationClick(post.district || post.location)}
                className="flex items-center gap-1 text-[var(--pm-accent)] hover:underline truncate cursor-pointer"
              >
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{post.location}</span>
              </button>

              <span className="text-zinc-600">•</span>

              {/* Timestamp */}
              <time className="text-zinc-400 font-medium shrink-0">
                {new Date(post.createdAt).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' })}
              </time>
            </div>
          </div>
        </div>

        {/* Follow Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleFollowToggle}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
              isFollowing
                ? 'bg-white/10 text-zinc-300 border border-white/10 hover:bg-white/15'
                : 'bg-[var(--pm-accent)] text-white shadow-md shadow-[var(--pm-accent)]/20 hover:brightness-110'
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">অনুসরণ করছেন</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ অনুসরণ</span>
                <span className="sm:hidden">+</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ─── 2. 1:1 ASPECT-RATIO MEDIA CARD ─── */}
      <div className="relative w-full aspect-square bg-black overflow-hidden select-none group/media">
        {isVideo ? (
          <div 
            onClick={toggleVideoPlay} 
            className="w-full h-full relative cursor-pointer flex items-center justify-center"
          >
            <video
              ref={videoRef}
              src={post.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-honey-drip-from-a-wooden-spoon-32986-large.mp4'}
              poster={mediaList[0]}
              loop
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
            />

            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xl transition-transform hover:scale-110">
                  <Play className="w-8 h-8 ml-1 fill-white" />
                </div>
              </div>
            )}

            <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
              <button
                onClick={toggleVideoMute}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
                title={isMuted ? 'আনমিউট' : 'মিউট'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              ভিডিও রিভিউ
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center">
            <img
              src={mediaList[currentMediaIndex]}
              alt={post.content.slice(0, 20)}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {mediaList.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentMediaIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                  {mediaList.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentMediaIndex ? 'w-5 bg-[var(--pm-accent)]' : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white/10">
                  {currentMediaIndex + 1}/{mediaList.length}
                </div>
              </>
            )}

            {productData && (
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1 text-white flex items-center gap-1.5 shadow-lg">
                <span className="text-xs font-black text-amber-400">৳{productData.price.toLocaleString('bn-BD')}</span>
                {productData.originalPrice && (
                  <span className="text-[10px] text-zinc-400 line-through">
                    ৳{productData.originalPrice.toLocaleString('bn-BD')}
                  </span>
                )}
                {productData.discount && (
                  <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.2 rounded-md">
                    -{productData.discount}%
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── 3. ACTION FOOTER BAR ─── */}
      <div className="px-4 pt-3.5 pb-2">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--pm-border)]/60 pb-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleWishlistToggle}
              className={`flex items-center gap-1.5 text-xs font-black transition-all p-1.5 rounded-xl hover:bg-white/5 active:scale-90 ${
                isLiked ? 'text-rose-500' : 'text-zinc-400 hover:text-rose-400'
              }`}
              title="উইশলিস্ট ও লাইক"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-black text-zinc-400 hover:text-emerald-400 transition-all p-1.5 rounded-xl hover:bg-white/5 active:scale-90"
              title="ভেরিফায়েড রিভিউ ও প্রশ্নোত্তর"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{commentsCount}</span>
            </button>

            <button
              onClick={handleSaveToggle}
              className={`p-1.5 rounded-xl transition-all hover:bg-white/5 active:scale-90 ${
                isSaved ? 'text-amber-400' : 'text-zinc-400 hover:text-amber-400'
              }`}
              title="পোস্ট সেভ করুন"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-zinc-200 hover:text-white transition-all border border-white/10 cursor-pointer"
              title="কার্টে যোগ করুন"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={handleQuickBuy}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[var(--pm-accent)] to-orange-600 hover:opacity-90 active:scale-95 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[var(--pm-accent)]/25 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">সরাসরি কিনুন</span>
              <span className="sm:hidden">কিনুন</span>
            </button>
          </div>
        </div>

        <div className="pt-2.5 pb-1 space-y-2">
          <p className="text-xs text-zinc-200 leading-relaxed font-medium">
            <span className="font-black mr-1 text-white">{post.storeName || post.sellerName}:</span>
            {isExpanded ? post.content : `${post.content.slice(0, 110)}${post.content.length > 110 ? '...' : ''}`}
            {post.content.length > 110 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1.5 text-[var(--pm-accent)] font-bold text-xs hover:underline cursor-pointer"
              >
                {isExpanded ? 'সংক্ষেপ করুন' : 'আরও পড়ুন'}
              </button>
            )}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick && onTagClick(tag)}
                  className="text-[11px] font-bold text-[var(--pm-accent)]/90 hover:text-[var(--pm-accent)] bg-[var(--pm-accent)]/10 hover:bg-[var(--pm-accent)]/20 px-2 py-0.5 rounded-lg border border-[var(--pm-accent)]/20 transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        sellerName={post.sellerName}
        reviews={reviewsList}
        onAddReview={handleAddReview}
      />
    </article>
  );
};

