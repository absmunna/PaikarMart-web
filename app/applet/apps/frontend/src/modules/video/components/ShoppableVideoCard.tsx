import React from 'react';
import { Play, Eye, CheckCircle2, Heart, Share2, ShoppingBag, Radio } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { VideoItem } from '../types';
import { useVideoStore } from '../store/useVideoStore';
import { useCartStore, useCartDrawerStore } from '@/modules/cart';

interface ShoppableVideoCardProps {
  video: VideoItem;
  className?: string;
  showProductPill?: boolean;
  aspectSquare?: boolean;
}

export const ShoppableVideoCard: React.FC<ShoppableVideoCardProps> = ({
  video,
  className = '',
  showProductPill = true,
  aspectSquare = false
}) => {
  const navigate = useNavigate();
  const { likedVideoIds, toggleLike } = useVideoStore();
  const isLiked = likedVideoIds.includes(video.id);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartDrawerStore((s) => s.open);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!video.linkedProduct) return;
    addItem({
      id: video.linkedProduct.id,
      name: video.linkedProduct.title,
      price: video.linkedProduct.price,
      originalPrice: video.linkedProduct.originalPrice,
      image: video.linkedProduct.image,
      quantity: video.linkedProduct.moq || 1,
      moq: video.linkedProduct.moq || 1,
      stock: 50,
      portal: video.linkedProduct.portal || 'wholesale',
      seller: video.creator.name
    });
    toast.success(`"${video.linkedProduct.title.slice(0, 20)}..." কার্টে যোগ হয়েছে!`);
    openCart();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/video/watch/${video.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("ভিডিও লিংক কপি করা হয়েছে!");
    }
  };

  const handleCardClick = () => {
    if (video.isShort) {
      navigate('/video/shorts');
    } else if (video.isLive) {
      navigate(`/video/live/${video.id}`);
    } else {
      navigate(`/video/watch/${video.id}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group bg-[#11131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#FF7A00]/40 transition-all duration-300 shadow-lg flex flex-col justify-between cursor-pointer ${className}`}
    >
      <div>
        {/* YouTube Style 16:9 Thumbnail Box */}
        <div className={`relative w-full overflow-hidden bg-black/60 ${aspectSquare ? 'aspect-square' : 'aspect-video'}`}>
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
            {video.isLive ? (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <Radio className="w-3 h-3" /> লাইভ
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-tight">
                {video.category}
              </span>
            )}

            {video.isPaidContent && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-black text-[9px] shadow-md">
                🔒 ৳{video.priceAmount || 20}
              </span>
            )}
          </div>

          {/* Duration Badge Bottom Right (YouTube Style) */}
          <div className="absolute bottom-2.5 right-2.5">
            {video.duration && (
              <span className="px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                {video.duration}
              </span>
            )}
          </div>

          {/* Hover Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
            <div className="w-10 h-10 rounded-full bg-[#FF7A00] text-white flex items-center justify-center shadow-lg shadow-[#FF7A00]/40 transform group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* YouTube Style Metadata Layout */}
        <div className="p-3.5 flex gap-3">
          {/* Creator Avatar (Left) */}
          <Link 
            to={`/video/channel/${video.creator.id}`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 group/avatar"
          >
            <img 
              src={video.creator.avatar} 
              alt={video.creator.name} 
              className="w-9 h-9 rounded-full object-cover border border-white/10 group-hover/avatar:border-[#FF7A00] transition-colors"
              referrerPolicy="no-referrer"
            />
          </Link>

          {/* Title & Details (Right) */}
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-[#FF7A00] transition-colors">
              {video.title}
            </h3>

            <div className="text-[11px] text-zinc-400 space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="font-bold text-zinc-300 truncate hover:text-white transition-colors">
                  {video.creator.name}
                </span>
                {video.creator.verified && <CheckCircle2 className="w-3 h-3 text-[#FF7A00] shrink-0" />}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <span>{video.views} ভিউ</span>
                <span>•</span>
                <span>{video.timeAgo || 'সম্প্রতি'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shoppable Product Pill at Bottom */}
      {showProductPill && video.linkedProduct && (
        <div className="px-3.5 pb-3.5">
          <div className="p-2 rounded-xl bg-zinc-900/90 border border-white/5 flex items-center justify-between gap-2.5 hover:border-[#FF7A00]/30 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <img 
                src={video.linkedProduct.image} 
                alt={video.linkedProduct.title} 
                className="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white truncate max-w-[120px] sm:max-w-[150px]">
                  {video.linkedProduct.title}
                </p>
                <span className="text-[11px] font-black text-[#FF7A00]">
                  ৳{video.linkedProduct.price.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleQuickAdd}
              className="px-2.5 py-1.5 rounded-lg bg-[#FF7A00] hover:bg-[#e06b00] text-white text-[10px] font-bold shrink-0 shadow-sm transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
              title="কার্টে যোগ করুন"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>কিনুন</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
