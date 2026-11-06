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
      className={`group bg-[#131522] border border-white/5 rounded-3xl overflow-hidden hover:border-[#FF7A00]/40 transition-all duration-300 shadow-xl flex flex-col justify-between cursor-pointer ${className}`}
    >
      <div>
        {/* Thumbnail Box */}
        <div className={`relative w-full overflow-hidden bg-black/60 ${aspectSquare ? 'aspect-square' : 'aspect-video'}`}>
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            <div className="flex items-center gap-1.5">
              {video.isLive ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <Radio className="w-3 h-3" /> লাইভ
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-black border border-white/10 uppercase tracking-tight">
                  {video.category}
                </span>
              )}
            </div>

            {video.isPaidContent && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-[9px] shadow-md flex items-center gap-1">
                🔒 ৳{video.priceAmount || 20} (৩০সে: ফ্রি)
              </span>
            )}
          </div>

          {/* Duration or Views Bottom Badges */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            {video.duration && (
              <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                {video.duration}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1">
              <Eye className="w-3 h-3 text-[#FF7A00]" /> {video.views}
            </span>
          </div>

          {/* Hover Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
            <div className="w-12 h-12 rounded-full bg-[#FF7A00] text-white flex items-center justify-center shadow-lg shadow-[#FF7A00]/40 transform group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Video Info Body */}
        <div className="p-4 space-y-3">
          {/* Creator Info */}
          <div className="flex items-center justify-between gap-2">
            <Link 
              to={`/video/channel/${video.creator.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2.5 group/creator min-w-0"
            >
              <img 
                src={video.creator.avatar} 
                alt={video.creator.name} 
                className="w-8 h-8 rounded-full object-cover border border-white/10 group-hover/creator:border-[#FF7A00] transition-colors shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white group-hover/creator:text-[#FF7A00] transition-colors truncate">
                    {video.creator.name}
                  </span>
                  {video.creator.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />}
                </div>
                <span className="text-[10px] text-zinc-400 block truncate">
                  {video.creator.followers} ফলোয়ার • {video.timeAgo || 'সম্প্রতি'}
                </span>
              </div>
            </Link>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(video.id);
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLiked ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                title="পছন্দ করুন"
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={handleShare}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="শেয়ার করুন"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-zinc-100 line-clamp-2 leading-snug group-hover:text-white transition-colors">
            {video.title}
          </h3>
        </div>
      </div>

      {/* Linked Product Box at Bottom */}
      {showProductPill && video.linkedProduct && (
        <div className="px-4 pb-4">
          <div className="p-2.5 rounded-2xl bg-zinc-900/80 border border-white/5 flex items-center justify-between gap-3 group/prod hover:border-[#FF7A00]/30 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={video.linkedProduct.image} 
                alt={video.linkedProduct.title} 
                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <span className="text-[8px] font-black uppercase text-[#FF7A00] tracking-wider block">
                  শপেবল প্রোডাক্ট
                </span>
                <p className="text-[11px] font-bold text-white truncate max-w-[130px] sm:max-w-[160px]">
                  {video.linkedProduct.title}
                </p>
                <span className="text-xs font-black text-[#FF7A00]">
                  ৳{video.linkedProduct.price.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleQuickAdd}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-[11px] font-bold shrink-0 shadow-md shadow-[#FF7A00]/20 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
              title="কার্টে যোগ করুন"
            >
              <ShoppingBag className="w-3 h-3" />
              <span className="hidden sm:inline">কার্টে নিন</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
