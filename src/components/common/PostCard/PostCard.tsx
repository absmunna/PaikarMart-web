import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, 
  ShoppingCart, Gavel, MapPin, Clock, 
  CheckCircle2, Navigation, ShoppingBag, 
  Briefcase, Globe, Info, Flame, Eye,
  Bookmark, Check, AlertTriangle, Wrench,
  Star, Trophy, ChevronRight, Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/modules/cart';
import { useWishlistStore } from '@/modules/wishlist/wishlistStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export type PostCardVariant =
  | 'marketplace'    // Buy Now + price + rating
  | 'service'        // Book Appointment + availability
  | 'b2b'            // Submit Bid + MOQ
  | 'food'           // Order Now + delivery time
  | 'job'            // Apply Now + salary range
  | 'real_estate'    // Request Visit + price/sqft
  | 'social'         // Like + Comment + Share (no commerce)
  | 'demand';        // "Open Demand" — buyer wants something

export interface PostCardAuthor {
  id: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
  role?: string;
  roleLabel?: string;
  roleLabelBn?: string;
  location?: string;
}

export interface PostCardProps {
  id: string;
  variant: PostCardVariant;
  title: string;
  description: string;
  image?: string;
  media?: string[];
  price?: number;
  rating?: number;
  moq?: number;
  deliveryTime?: string;
  salaryRange?: string;
  location?: string;
  author: PostCardAuthor;
  timestamp?: string;
  metadata?: Record<string, any>;
  onLike?: (id: string) => void;
  onActionClick?: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  id,
  variant,
  title,
  description,
  image,
  media,
  price,
  rating = 4.8,
  moq,
  deliveryTime,
  salaryRange,
  location,
  author,
  timestamp,
  metadata = {},
  onLike,
  onActionClick
}) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  // Wishlist / Favorite Integration
  const isFavorite = useWishlistStore((s) => s.items.some(i => i.id === id));
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const displayImage = image || media?.[0] || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600';

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      id,
      name: title,
      title: title,
      price: price || 0,
      image: displayImage,
      description,
      vendorName: author.name,
    } as any);
    
    if (isFavorite) {
      toast.error(`${title} উইশলিস্ট থেকে সরানো হয়েছে!`);
    } else {
      toast.success(`${title} উইশলিস্টে সংরক্ষণ করা হয়েছে!`);
    }
  };

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    if (onLike) onLike(id);
    toast.success(liked ? 'লাইক সরানো হয়েছে' : 'পোস্টটি পছন্দ করেছেন!');
  };

  const handleSellerProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (author.role === 'user' || author.role === 'buyer') {
      navigate(`/u/${author.id}`);
    } else {
      navigate(`/vendors/${author.id}`);
    }
  };

  const handleCardDetailsClick = () => {
    if (onActionClick) {
      onActionClick(id);
      return;
    }
    
    // Default routes based on variant
    switch (variant) {
      case 'marketplace':
        navigate(`/marketplace/product/${id}`);
        break;
      case 'b2b':
        navigate(`/b2b`);
        break;
      case 'food':
        navigate(`/food`);
        break;
      case 'service':
        navigate(`/services`);
        break;
      case 'job':
        navigate(`/jobs`);
        break;
      case 'real_estate':
        navigate(`/real-estate`);
        break;
      case 'demand':
        navigate(`/demand/${id}`);
        break;
      default:
        navigate(`/marketplace/product/${id}`);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id,
      sourceId: id,
      name: title,
      price: price || 0,
      quantity: 1,
      image: displayImage,
      domain: 'retail',
      metadata: { portal: variant }
    });
    navigate('/checkout');
    toast.success(`${title} কিনতে চেকআউট পেজে পাঠানো হচ্ছে!`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id,
      sourceId: id,
      name: title,
      price: price || 0,
      quantity: moq || 1,
      image: displayImage,
      domain: variant === 'b2b' ? 'wholesale' : 'retail',
      metadata: { portal: variant }
    });
    toast.success(`${title} কার্টে যোগ করা হয়েছে!`);
  };

  // Render variant-specific bottom CTA / status info
  const renderCommerceSection = () => {
    switch (variant) {
      case 'marketplace':
        return (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.03]">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Price / মূল্য</span>
              <span className="text-sm font-black text-cyan-400">৳{price?.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleAddToCart}
                className="h-8 px-3 bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-300 font-bold text-[10px] rounded-lg transition-all"
              >
                + Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="h-8 px-4 bg-cyan-400 text-black font-black text-[10px] hover:bg-[#00c853] rounded-lg flex items-center gap-1.5 uppercase transition-all shadow-[0_0_10px_rgba(0,230,118,0.3)] min-h-[44px] min-w-[100px] justify-center"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>কিনুন / Buy</span>
              </button>
            </div>
          </div>
        );

      case 'b2b':
        return (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.03]">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">MOQ / সর্বনিম্ন অর্ডার</span>
              <span className="text-xs font-black text-blue-400">{moq || 100} units</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/b2b'); }}
              className="h-9 px-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 font-black text-[10px] rounded-lg flex items-center gap-1.5 uppercase transition-all min-h-[44px]"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>প্রস্তাব দিন / Bid Now</span>
            </button>
          </div>
        );

      case 'service':
        return (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.03]">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Rate / রেট</span>
              <span className="text-xs font-black text-orange-400">৳{price?.toLocaleString()} / {metadata.unit || 'hr'}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/messages'); }}
              className="h-9 px-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 font-black text-[10px] rounded-lg flex items-center gap-1.5 uppercase transition-all min-h-[44px]"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>বুক করুন / Book Now</span>
            </button>
          </div>
        );

      case 'food':
        return (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.03]">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Time / সময়</span>
              <span className="text-xs font-black text-rose-400">{deliveryTime || '20-30 min'}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/food'); }}
              className="h-9 px-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 font-black text-[10px] rounded-lg flex items-center gap-1.5 uppercase transition-all min-h-[44px]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>অর্ডার / Order</span>
            </button>
          </div>
        );

      case 'job':
        return (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.03]">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Salary / বেতন</span>
              <span className="text-xs font-black text-emerald-400">{salaryRange || '৳২০,০০০ - ৳৩০,০০০'}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); toast.success('আবেদন সম্পন্ন করার জন্য বিবরণ দেখুন!'); handleCardDetailsClick(); }}
              className="h-9 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 font-black text-[10px] rounded-lg flex items-center gap-1.5 uppercase transition-all min-h-[44px]"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>আবেদন করুন / Apply</span>
            </button>
          </div>
        );

      case 'real_estate':
        return (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.03]">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Value / মূল্য</span>
              <span className="text-xs font-black text-amber-400">{price ? `৳${price.toLocaleString()}` : 'Negotiable'}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/messages'); }}
              className="h-9 px-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 font-black text-[10px] rounded-lg flex items-center gap-1.5 uppercase transition-all min-h-[44px]"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>পরিদর্শন / Visit</span>
            </button>
          </div>
        );

      case 'demand':
        return (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.03]">
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Budget / বাজেট</span>
              <span className="text-xs font-black text-indigo-400">৳{price?.toLocaleString() || 'Negotiable'}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate(`/demand/${id}`); }}
              className="h-9 px-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 font-black text-[10px] rounded-lg flex items-center gap-1.5 uppercase transition-all min-h-[44px]"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>বিড দিন / Bid Now</span>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#030604] rounded-3xl border border-white/[0.04] overflow-hidden group transition-all duration-300 relative shadow-2xl hover:border-white/10 p-5"
    >
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer group/avatar" onClick={handleSellerProfileClick}>
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/[0.05] flex items-center justify-center overflow-hidden transition-transform group-hover/avatar:scale-105">
              <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            {author.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-1 border-2 border-black scale-75 shadow-lg">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 
                onClick={handleSellerProfileClick}
                className="text-[12px] font-black text-white hover:text-cyan-400 transition-colors cursor-pointer tracking-tight"
              >
                {author.name}
              </h4>
              {author.roleLabelBn && (
                <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">
                  {author.roleLabelBn}
                </span>
              )}
            </div>
            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 opacity-40" /> {location || author.location || 'Dhaka'}
            </p>
          </div>
        </div>

        {/* More Actions */}
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsActionsOpen(!isActionsOpen); }}
            className="p-1.5 text-zinc-600 hover:text-white transition-colors cursor-pointer"
          >
            <MoreHorizontal size={16} />
          </button>
          
          <AnimatePresence>
            {isActionsOpen && (
              <>
                <div className="fixed inset-0 z-50" onClick={() => setIsActionsOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute right-0 top-8 bg-zinc-950 border border-white/10 rounded-2xl p-2 min-w-[160px] z-50 shadow-2xl flex flex-col gap-1"
                >
                  <button 
                    onClick={(e) => { setIsActionsOpen(false); handleFavoriteToggle(e); }}
                    className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-white/5 text-white text-[10px] font-bold uppercase tracking-wide"
                  >
                    <Bookmark size={12} className={cn(isFavorite ? "text-amber-500 fill-current" : "text-zinc-500")} />
                    <span>{isFavorite ? 'Saved' : 'Save Item'}</span>
                  </button>
                  <button 
                    onClick={() => { setIsActionsOpen(false); toast.success('রিপোর্ট করা হয়েছে!'); }}
                    className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-rose-500/10 text-rose-400 text-[10px] font-bold uppercase tracking-wide"
                  >
                    <AlertTriangle size={12} />
                    <span>Report Post</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Info */}
      <div className="cursor-pointer" onClick={handleCardDetailsClick}>
        <h3 className="text-[13px] font-black text-white group-hover:text-cyan-400 transition-colors mb-1.5 leading-snug tracking-tight">
          {title}
        </h3>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium mb-4 line-clamp-2">
          {description}
        </p>

        {/* Render polymorphic visual display cards */}
        {variant !== 'social' && variant !== 'demand' && (
          <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/[0.04] relative">
            <img 
              src={displayImage} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            {rating && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-current" />
                <span className="text-[10px] font-black text-white">{rating}</span>
              </div>
            )}
          </div>
        )}

        {/* Specialized Open Demand Visual */}
        {variant === 'demand' && (
          <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/[0.06] relative bg-gradient-to-br from-indigo-950 via-slate-950 to-black p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                OPEN DEMAND / চাহিদা
              </span>
              {metadata.urgency === 'High' && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/20 text-[8px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1 animate-pulse">
                  <Flame size={10} /> HIGH
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-400 mb-1">Estimated Budget</p>
              <p className="text-xl font-black text-cyan-400">৳{price?.toLocaleString() || 'Negotiable'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Interactions list */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLikeToggle}
            className={cn(
              "h-8 w-8 flex items-center justify-center rounded-lg border transition-all duration-300",
              liked ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-white/[0.02] border-white/[0.02] text-zinc-700 hover:text-white"
            )}
          >
            <Heart size={14} className={cn(liked && "fill-current")} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/marketplace/product/${id}/comments`); }}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.02] border border-white/[0.02] text-zinc-700 hover:text-white transition-all cursor-pointer"
          >
            <MessageCircle size={14} />
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(`${window.location.origin}/marketplace/product/${id}`);
              toast.success('লিংক কপি করা হয়েছে!');
            }}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/[0.02] border border-white/[0.02] text-zinc-700 hover:text-white transition-all cursor-pointer"
          >
            <Share2 size={14} />
          </button>
        </div>

        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
          {variant.toUpperCase()}
        </span>
      </div>

      {/* Variant-specific interactive section */}
      {renderCommerceSection()}
    </motion.div>
  );
};
