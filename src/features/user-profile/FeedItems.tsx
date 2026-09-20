import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageSquare, Share2, ShoppingBag, ShoppingCart, CheckCircle2, Bookmark, Navigation, Gavel } from 'lucide-react';
import type { FeedItem, SocialProfile } from './types';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/modules/cart';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface FeedItemCardProps {
  item: FeedItem;
  profile?: SocialProfile | null;
}

export const FeedItemCard = React.forwardRef<HTMLDivElement, FeedItemCardProps>(({ item, profile }, ref) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes);
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prod = item.product || {
      id: item.id,
      title: item.content || 'Product Item',
      price: 1200,
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600'
    };

    addItem({
      id: prod.id,
      sourceId: prod.id,
      name: prod.title,
      price: prod.price || 0,
      quantity: 1,
      image: prod.imageUrl || '',
      domain: 'retail',
      metadata: { portal: 'RETAIL' }
    });
    navigate('/checkout');
    toast.success(`${prod.title} কিনতে চেকআউট পেজে রিডায়রেক্ট করা হচ্ছে!`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prod = item.product || {
      id: item.id,
      title: item.content || 'Product Item',
      price: 1200,
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600'
    };

    addItem({
      id: prod.id,
      sourceId: prod.id,
      name: prod.title,
      price: prod.price || 0,
      quantity: 1,
      image: prod.imageUrl || '',
      domain: 'retail',
      metadata: { portal: 'RETAIL' }
    });
    toast.success(`${prod.title} কার্টে যোগ করা হয়েছে!`);
  };

  // Profile metadata
  const authorName = profile?.name || 'রহমান সুজ ও ফুটওয়্যার';
  const authorAvatar = profile?.avatarUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100';
  const isVerified = profile?.isVerified ?? true;
  const authorRole = profile?.role || 'seller';

  const getCTAButton = () => {
    if (item.type === 'demand') {
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); toast.info('বিডিং প্রপোজাল তৈরি করুন!'); }}
          className="h-7.5 px-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 font-bold text-[9px] rounded-lg flex items-center justify-center gap-1.5 uppercase transition-all"
        >
          <Gavel className="w-3.5 h-3.5" />
          <span>প্রস্তাব দিন / Bid Now</span>
        </button>
      );
    }

    if (item.type === 'product' && item.product) {
      return (
        <button 
          onClick={handleBuyNow}
          className="h-7.5 px-3 bg-cyan-400 text-black font-black text-[9px] hover:bg-[#00c853] rounded-lg flex items-center justify-center gap-1.5 uppercase transition-all shadow-[0_0_10px_rgba(0,230,118,0.3)] duration-200"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>কিনুন / Buy Now</span>
        </button>
      );
    }

    // Default status post CTA
    return null;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="bg-[#030604] border border-white/[0.03] rounded-2xl p-4 flex flex-col gap-3 shadow-md hover:border-cyan-400/20 transition-all group relative overflow-hidden"
    >
      {/* Decorative top green indicator for seller products */}
      {item.type === 'product' && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/30 to-cyan-400 opacity-30" />
      )}

      {/* Post Top Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.01] pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8.5 h-8.5 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-center overflow-hidden">
            <img 
              src={authorAvatar} 
              alt={authorName} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-[11px] text-white/90 group-hover:text-white transition-colors">{authorName}</span>
              {isVerified && (
                <div className="bg-cyan-500 rounded-full p-0.5 border border-black scale-75">
                  <CheckCircle2 className="w-2 h-2 text-white" />
                </div>
              )}
              <span className="text-[6.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                {authorRole}
              </span>
            </div>
            <span className="text-[8px] text-zinc-500 font-medium uppercase tracking-[0.11em] mt-1">{item.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Post Content description text */}
      {item.content && (
        <div className="cursor-pointer" onClick={() => item.type === 'product' && handleDetails()}>
          <p className="text-zinc-300 text-[11px] leading-relaxed whitespace-pre-wrap font-medium">
            {item.content}
          </p>
        </div>
      )}

      {/* Post Media Attachment Image */}
      {item.imageUrl && (
        <div className="relative rounded-xl overflow-hidden border border-white/[0.02] bg-zinc-900/50 aspect-video max-h-[220px]">
          <img 
            src={item.imageUrl} 
            alt="Feed attachment" 
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Product Card attachment */}
      {item.type === 'product' && item.product && (
        <div className="bg-zinc-950/80 border border-white/[0.03] rounded-xl p-3 flex gap-3.5 items-center hover:border-cyan-500/10 transition-all cursor-pointer" onClick={handleBuyNow}>
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/5 bg-zinc-900 shrink-0">
            <img 
              src={item.product.imageUrl || item.imageUrl} 
              alt={item.product.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-[11px] truncate">{item.product.title}</h4>
            <div className="mt-1 text-cyan-400 font-black text-xs">
              ৳{item.product.price.toLocaleString('en-US')}
            </div>
            <span className="inline-block mt-1 text-[7.5px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
              {item.product.bnLabel || 'ন্যূনতম MOQ: ৫০ পিস'}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-900 border border-white/[0.04] text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors shrink-0 shadow-md active:scale-95 duration-150"
          >
            <ShoppingCart className="w-4.5 h-4.5" strokeWidth={2.2} />
          </button>
        </div>
      )}

      {/* Quick Stats & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.02] text-zinc-500 text-[10px] font-bold">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 hover:text-rose-400 transition-colors py-1 cursor-pointer active:scale-90 duration-100 uppercase text-[9px] tracking-wider",
              liked && "text-rose-500 hover:text-rose-600"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", liked && "fill-rose-500")} />
            <span>{likesCount} likes</span>
          </button>

          <button className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors py-1 cursor-pointer uppercase text-[9px] tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{item.comments} comments</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {getCTAButton()}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(window.location.origin + `/marketplace/product/${item.product?.id || item.id}`);
              toast.success("লিংক কপি করা হয়েছে!");
            }}
            className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/[0.01] border border-white/[0.02] text-zinc-600 hover:text-white transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  function handleDetails() {
    if (item.product?.id) {
      navigate(`/marketplace/product/${item.product.id}`);
    } else {
      navigate(`/marketplace/product/${item.id}`);
    }
  }
});
