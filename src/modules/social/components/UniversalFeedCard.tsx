import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, 
  ShoppingCart, Gavel, MapPin, Clock, 
  CheckCircle2, Navigation, ShoppingBag, 
  Briefcase, Globe, Info, Flame, Eye,
  Bookmark, Check, AlertTriangle, Wrench, Tag
} from 'lucide-react';
import { UnifiedFeedItem, FeedItemType, PortalDomain } from '@/modules/social/types';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/modules/cart';
import { useWishlistStore } from '@/modules/wishlist/wishlistStore';
import { useLanguage } from '@/features/language/LanguageContext';
import { toast } from 'sonner';
import { mapPostToFeedItem } from '@/modules/social/utils/mappers';
import { useFeedStore } from '@/modules/social/store/useFeedStore';
import { useNavigate } from 'react-router-dom';
import { QuickViewModal } from './QuickViewModal';

interface UniversalFeedCardProps {
  item: UnifiedFeedItem;
  onLike: (id: string) => void;
}

const DOMAIN_STYLE: Record<PortalDomain, { label: string, color: string, bg: string, border: string, icon: any }> = {
  RETAIL: { label: 'Retail', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: ShoppingBag },
  WHOLESALE: { label: 'Wholesale', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Briefcase },
  B2B: { label: 'B2B Hub', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: Gavel },
  SERVICES: { label: 'Services', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: Navigation },
  LOCAL: { label: 'Nearby', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: MapPin },
  SOCIAL: { label: 'Public', color: 'text-zinc-400', bg: 'bg-white/5', border: 'border-white/10', icon: Globe },
};

const ProductContent = ({ item, onClick }: { item: UnifiedFeedItem; onClick?: () => void }) => {
  const images = item.content.media || [];
  const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600'];

  return (
    <div className="px-4 pb-4" onClick={onClick}>
      <div className={cn(
        "w-full rounded-[2.5rem] bg-zinc-900/50 overflow-hidden border border-white/[0.04] relative group cursor-pointer shadow-inner",
        displayImages.length === 1 ? "aspect-square" : "aspect-[4/3]"
      )}>
        {displayImages.length === 1 ? (
          <img src={displayImages[0]} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
        ) : (
          <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 p-1">
            {displayImages.slice(0, 4).map((img, i) => (
              <div key={i} className={cn(
                "relative overflow-hidden",
                displayImages.length === 2 ? "row-span-2" : "",
                displayImages.length === 3 && i === 0 ? "row-span-2" : ""
              )}>
                <img src={img} alt={`Media ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                {displayImages.length > 4 && i === 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-black text-lg">+{displayImages.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {item.content.price && (
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-1.5 z-10">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[12px] font-black text-cyan-400">৳{item.content.price.toLocaleString()}</span>
          </div>
        )}
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-xs uppercase tracking-wider">Quick View</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DemandContent = ({ item, onClick }: { item: UnifiedFeedItem; onClick?: () => void }) => {
  const seed = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    "from-indigo-600 via-indigo-900 to-slate-900",
    "from-cyan-600 via-teal-900 to-black",
    "from-rose-600 via-rose-900 to-stone-900",
    "from-amber-500 via-orange-900 to-zinc-900",
    "from-cyan-500 via-blue-900 to-slate-900",
    "from-violet-600 via-purple-900 to-black",
    "from-lime-500 via-cyan-900 to-slate-900"
  ];
  const bgGradient = gradients[seed % gradients.length];

  return (
    <div className="px-4 pb-4" onClick={onClick}>
      <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden group/visual cursor-pointer border border-white/[0.06] bg-[#050805] shadow-inner">
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30", bgGradient)} />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-20">
          <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative text-center">
            <h3 className="text-base font-black text-white tracking-tight line-clamp-3 max-w-[240px] drop-shadow-2xl">
              {item.content.title}
            </h3>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-[1.5px] w-6 bg-white/20 rounded-full" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_cyan-400]" />
              <div className="h-[1.5px] w-6 bg-white/20 rounded-full" />
            </div>
          </motion.div>
        </div>
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-30">
          <div className="px-3 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-[8px] font-black text-white/60 uppercase tracking-[0.2em]">
            REF-{(seed % 999).toString().padStart(3, '0')}
          </div>
          {item.content.metadata?.urgency === 'High' && (
            <div className="px-3 py-1 rounded-xl bg-rose-500/20 backdrop-blur-md border border-rose-500/20 text-[8px] font-black text-rose-400 uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-lg">
              <Flame className="w-3 h-3 animate-pulse" /> High Urgency
            </div>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-30">
          <div className="flex flex-col">
            <span className="text-[8px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">Estimated Budget</span>
            <span className="text-sm font-black text-cyan-400 drop-shadow-md">৳{item.content.price?.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/80 shadow-xl group-hover/visual:scale-110 transition-transform">
            <Gavel className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

const RideContent = ({ item, onClick }: { item: UnifiedFeedItem; onClick?: () => void }) => (
  <div className="px-4 pb-4 cursor-pointer" onClick={onClick}>
    <div className="p-8 rounded-[2rem] bg-[#050805] border border-white/[0.06] flex items-center justify-between aspect-square flex-col justify-center gap-6 relative overflow-hidden shadow-inner">
      <div className="space-y-6 flex-1 flex flex-col justify-center items-center text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_cyan-400]" />
          <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Pickup</span>
          <p className="text-sm font-black text-white uppercase tracking-tight">{item.content.location || 'Dhaka'}</p>
        </div>
        <div className="w-[1px] h-10 border-dashed border-zinc-800 border-l" />
        <div className="flex flex-col items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
          <span className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Destination</span>
          <p className="text-sm font-black text-white/70 uppercase tracking-tight">Banani Area</p>
        </div>
      </div>
      <div className="w-14 h-14 rounded-[1.5rem] bg-orange-500/10 flex items-center justify-center border border-orange-500/10 shadow-xl">
        <Navigation className="w-6 h-6 text-orange-500 opacity-60" />
      </div>
    </div>
  </div>
);

const NewsContent = ({ item, onClick }: { item: UnifiedFeedItem; onClick?: () => void }) => {
  const mediaUrl = item.content.media && item.content.media[0] 
    ? item.content.media[0] 
    : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600';

  return (
    <div className="px-4 pb-4" onClick={onClick}>
      <div className="aspect-square w-full rounded-[2rem] bg-zinc-950 overflow-hidden border border-white/[0.04] relative group cursor-pointer shadow-inner">
        <img src={mediaUrl} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Labels inside Card */}
        <div className="absolute top-4 left-4 flex gap-2">
          {item.content.metadata?.categoryLabelBn && (
            <span className="px-3 py-1 bg-black/60 backdrop-blur-xl rounded-xl text-[8px] font-black text-white border border-white/10 uppercase tracking-[0.1em]">
              {item.content.metadata?.categoryLabelBn}
            </span>
          )}
          {item.content.metadata?.isPremium && (
            <span className="px-3 py-1 bg-amber-500/20 backdrop-blur-xl rounded-xl text-[8px] font-black text-amber-500 border border-amber-500/20 uppercase tracking-[0.1em]">
              Premium
            </span>
          )}
        </div>

        {/* Stats Overlay inside Card */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/60 text-[10px] font-black uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{item.content.metadata?.readTimeBn || '৩ মিনিট পাঠ'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{item.content.metadata?.views || item.stats.views || 100} Views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceContent = ({ item, onClick }: { item: UnifiedFeedItem; onClick?: () => void }) => {
  const mediaUrl = item.content.media && item.content.media[0] 
    ? item.content.media[0] 
    : 'https://images.unsplash.com/photo-1581578731522-745d05db9ad0?q=80&w=600';

  return (
    <div className="px-4 pb-4" onClick={onClick}>
      <div className="aspect-square w-full rounded-[2rem] bg-zinc-950 border border-white/[0.04] relative group cursor-pointer overflow-hidden shadow-inner">
        <img src={mediaUrl} alt="Service" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        {/* Service Badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="px-3 py-1 rounded-xl bg-orange-500/20 backdrop-blur-xl border border-orange-500/20 text-[8px] font-black text-orange-400 uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-lg">
            <Wrench className="w-3 h-3" />
            {item.content.metadata?.serviceType || 'Service'}
          </div>
        </div>

        {/* Price Tag */}
        {item.content.price && (
          <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-2xl">
            <span className="text-[12px] font-black text-white">৳{item.content.price.toLocaleString()}</span>
          </div>
        )}

        {/* Service Details Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-lg">
              <Clock className="w-3 h-3 text-sky-400" />
              <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                {item.content.metadata?.duration || '1-2h'}
              </span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-lg">
              <CheckCircle2 className="w-3 h-3 text-cyan-400" />
              <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CONTENT_MAP: Record<FeedItemType, React.FC<{ item: UnifiedFeedItem; onClick?: () => void }>> = {
  PRODUCT: ProductContent,
  DEMAND: DemandContent,
  BID: DemandContent,
  NEWS: NewsContent,
  RIDE: RideContent,
  SERVICE: ServiceContent,
};

export const UniversalFeedCardBridge = React.memo(({ post }: { post: any }) => {
  const { toggleLike } = useFeedStore();
  return <UniversalFeedCard item={mapPostToFeedItem(post)} onLike={toggleLike} />;
});

export const UniversalFeedCard = React.memo(({ item, onLike }: UniversalFeedCardProps) => {
  const { addItem } = useCartStore();
  const navigate = useNavigate();
  const { isBn } = useLanguage();
  const style = DOMAIN_STYLE[item.domain] || { label: 'Public', color: 'text-zinc-400', bg: 'bg-white/5', border: 'border-white/10', icon: Globe };
  const ContentComponent = CONTENT_MAP[item.type] || ProductContent;

  // Favorite states and actions
  const isFavorite = useWishlistStore((s) => s.items.some(i => i.id === item.id));
  const toggleWishlistRef = useWishlistStore((s) => s.toggleWishlist);

  // Floating menus state
  const [isCommentMenuOpen, setIsCommentMenuOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const productAdapter = {
    id: item.id,
    name: item.content.title,
    title: item.content.title,
    price: item.content.price || 0,
    image: item.content.media?.[0] || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600',
    description: item.content.description || '',
    vendorName: item.author.name,
  } as any;

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlistRef(productAdapter);
    if (isFavorite) {
      toast.error(`${item.content.title} উইশলিস্ট থেকে সরানো হয়েছে!`);
    } else {
      toast.success(`${item.content.title} উইশলিস্টে ফেভারেট হিসেবে সংরক্ষণ হয়েছে!`);
    }
  };

  const handleSellerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use role and id to determine profile path
    if (item.domain === 'SOCIAL' || !item.author.role || item.author.role === 'user' || item.author.role === 'buyer') {
      navigate(`/u/${item.author.id}`);
    } else {
      navigate(`/vendors/${item.author.id}`);
    }
  };

  const handleDetailsClick = () => {
    if (item.type === 'PRODUCT' || item.domain === 'RETAIL') {
      setIsQuickViewOpen(true);
    } else {
      handleFullDetailsNav();
    }
  };

  const handleFullDetailsNav = () => {
    if (item.type === 'PRODUCT' || item.domain === 'RETAIL') {
      navigate(`/marketplace/product/${item.id}`);
    } else if (item.type === 'DEMAND' || item.type === 'BID') {
      navigate(`/demand/${item.id}`);
    } else if (item.type === 'NEWS') {
      navigate(`/news`);
    } else if (item.domain === 'SERVICES' || item.type === 'SERVICE') {
      navigate(`/services`);
    } else {
      navigate(`/marketplace/product/${item.id}`);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: item.id,
      sourceId: item.id,
      name: item.content.title,
      price: item.content.price || 0,
      quantity: 1,
      image: item.content.media?.[0] || '',
      domain: 'retail',
      metadata: { portal: item.domain }
    });
    navigate('/checkout');
    toast.success(`${item.content.title} কিনুন অপশন সিলেক্ট করা হয়েছে!`);
  };

  const handleContactSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/messages');
    toast.success(`${item.author.name} এর সাথে ইনস্ট্যান্ট চ্যাট করুন`);
  };

  const handleSubmitBid = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info('আপনার বিড সাবমিট করা হচ্ছে... বিডিং প্রপোজাল তৈরি করুন!');
  };

  const handleAction = () => {
    switch (item.cta.action) {
      case 'ADD_TO_CART':
        addItem({
          id: item.id,
          sourceId: item.id,
          name: item.content.title,
          price: item.content.price || 0,
          quantity: item.content.metadata?.moq || 1,
          image: item.content.media[0] || '',
          domain: 'retail',
          metadata: { portal: item.domain }
        });
        toast.success(`${item.content.title} কার্টে যোগ করা হয়েছে!`);
        break;
      case 'PLACE_BID':
        toast.info('বিডিং পোর্টাল ওপেন হচ্ছে...');
        break;
      case 'READ_NEWS':
        navigate('/news');
        break;
      case 'CONSULT':
      case 'BOOK_NOW':
        navigate('/messages');
        toast.success(`${item.author.name} এর সাথে চ্যাট করুন।`);
        break;
      default:
        if (item.type === 'NEWS') {
          navigate('/news');
        } else {
          toast.info('বিস্তারিত তথ্য লোড করা হচ্ছে...');
        }
    }
  };

  const getCTAButton = () => {
    const isWholesale = item.domain === 'WHOLESALE' || item.domain === 'B2B';
    const isService = item.domain === 'SERVICES' || item.type === 'SERVICE' || item.type === 'RIDE';
    const moq = item.content.metadata?.moq;

    if (item.type === 'DEMAND' || item.type === 'BID') {
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); handleAction(); }}
          className="h-7 px-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 font-bold text-[9px] rounded-lg flex items-center justify-center gap-1.5 uppercase transition-all"
        >
          <Gavel className="w-3 h-3" />
          <span>প্রস্তাব দিন / Bid Now</span>
        </button>
      );
    }

    if (isWholesale) {
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); handleAction(); }}
          className="h-7 px-2.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 font-bold text-[9px] rounded-lg flex items-center justify-center gap-1.5 uppercase transition-all"
        >
          <Briefcase className="w-3 h-3" />
          <span>অর্ডার দিন / Order {moq || 20}+</span>
        </button>
      );
    }

    if (isService) {
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); handleAction(); }}
          className="h-7 px-2.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 font-bold text-[9px] rounded-lg flex items-center justify-center gap-1.5 uppercase transition-all"
        >
          <Navigation className="w-3 h-3" />
          <span>বুক করুন / Book Now</span>
        </button>
      );
    }

    if (item.type === 'NEWS') {
      return (
        <button 
          onClick={(e) => { e.stopPropagation(); handleAction(); }}
          className="h-7 px-2.5 bg-zinc-800 border border-white/5 text-zinc-300 hover:bg-zinc-700 font-bold text-[9px] rounded-lg flex items-center justify-center gap-1.5 uppercase transition-all"
        >
          <Eye className="w-3 h-3" />
          <span>পড়ুন / Read</span>
        </button>
      );
    }

    return (
      <button 
        onClick={handleBuyNow}
        className="h-7 px-3 bg-cyan-400 text-black font-black text-[9px] hover:bg-[#00c853] rounded-lg flex items-center justify-center gap-1.5 uppercase transition-all shadow-[0_0_10px_rgba(0,230,118,0.3)] animate-pulse"
      >
        <ShoppingBag className="w-3 h-3" />
        <span>কিনুন / Buy Now</span>
      </button>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#030604] rounded-3xl border border-white/[0.04] overflow-hidden group transition-all duration-300 relative shadow-2xl hover:border-white/10"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer group/avatar" onClick={handleSellerClick}>
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center overflow-hidden transition-transform group-hover/avatar:scale-105">
              <img src={item.author.avatar} alt={item.author.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            {item.author.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-1 border-2 border-black scale-75 shadow-lg">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 leading-none">
              <h4 
                onClick={handleSellerClick}
                className="text-[12px] font-black text-white hover:text-cyan-400 hover:underline underline-offset-4 decoration-2 transition-all cursor-pointer tracking-tight"
              >
                {item.author.name}
              </h4>
              <div className="flex items-center gap-1">
                {item.author.isVerified && (
                  <CheckCircle2 className="w-3 h-3 text-cyan-500 fill-cyan-500/10" />
                )}
                <span className={cn("text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border shadow-sm", style.bg, style.color, style.border)}>
                  {style.label}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
               <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.1em]">
                {new Date(item.content.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <div className="flex items-center gap-1">
                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.1em] flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 opacity-40" /> {item.content.location}
                </p>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <Globe className="w-2.5 h-2.5 text-zinc-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsActionsMenuOpen(!isActionsMenuOpen);
              setIsCommentMenuOpen(false);
            }}
            className="p-1.5 text-zinc-700 hover:text-white transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Actions Menu */}
          <AnimatePresence>
            {isActionsMenuOpen && (
              <>
                <div className="fixed inset-0 z-[100]" onClick={(e) => { e.stopPropagation(); setIsActionsMenuOpen(false); }} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute right-0 top-10 z-[101] min-w-[200px] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-1"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsActionsMenuOpen(false);
                      handleFavoriteToggle(e);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-white/5 transition-all text-white/90 text-[10px] font-bold uppercase tracking-wide"
                  >
                    <Bookmark className={cn("w-3.5 h-3.5", isFavorite ? "text-amber-500 fill-current" : "text-zinc-500")} />
                    <span>{isFavorite ? "Remove" : "Save"}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsActionsMenuOpen(false);
                      toast.success("রিপোর্ট করা হয়েছে");
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl text-left hover:bg-rose-500/10 transition-all text-rose-400 text-[10px] font-bold uppercase tracking-wide"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content text */}
      <div className="px-4 py-3 cursor-pointer" onClick={handleDetailsClick}>
        <h3 className="text-[14px] font-black text-white hover:text-cyan-400 transition-colors mb-2 leading-snug tracking-tight">
          {item.content.title}
        </h3>
        <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2 font-medium">
          {item.content.description}
        </p>
      </div>

      {/* Media / Specialized Content Area */}
      <ContentComponent item={item} onClick={handleDetailsClick} />

      {/* Interaction Bar - Stats */}
      <div className="px-4 py-1 flex items-center justify-between border-t border-white/[0.02]">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center ring-2 ring-black">
              <Heart className="w-2.5 h-2.5 text-white fill-current" />
            </div>
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-black">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <span className="text-[10px] text-zinc-500 font-medium">
            {item.stats.likes + (isFavorite ? 1 : 0)} • {item.stats.comments} Comments
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium">
          <span>{item.stats.shares} Shares</span>
        </div>
      </div>

      {/* Interaction Bar - Actions */}
      <div className="px-3 pb-3 flex items-center justify-between relative border-t border-white/[0.02] pt-2">
        <div className="flex items-center gap-0.5">
          <button 
            onClick={handleFavoriteToggle}
            className={cn(
              "h-8 px-3 flex items-center gap-1.5 rounded-xl transition-all duration-300 cursor-pointer hover:bg-white/5",
              isFavorite 
                ? "text-rose-500" 
                : "text-zinc-500 hover:text-white"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            <span className="text-[11px] font-bold">{isBn ? 'লাইক' : 'Like'}</span>
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsCommentMenuOpen(!isCommentMenuOpen);
              setIsActionsMenuOpen(false);
            }}
            className={cn(
              "h-8 px-3 flex items-center gap-1.5 rounded-xl transition-all duration-300 cursor-pointer hover:bg-white/5",
              isCommentMenuOpen 
                ? "text-cyan-400" 
                : "text-zinc-500 hover:text-white"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[11px] font-bold">{isBn ? 'কমেন্ট' : 'Comment'}</span>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({
                  title: item.content.title,
                  text: item.content.description,
                  url: window.location.origin + `/marketplace/product/${item.id}`,
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(`${window.location.origin}/marketplace/product/${item.id}`);
                toast.success("লিংক কপি করা হয়েছে!");
              }
            }}
            className="h-8 px-3 flex items-center gap-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-[11px] font-bold">{isBn ? 'শেয়ার' : 'Share'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {getCTAButton()}
        </div>

        {/* Comment Options Dropdown */}
        <AnimatePresence>
          {isCommentMenuOpen && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={(e) => { e.stopPropagation(); setIsCommentMenuOpen(false); }} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                className="absolute bottom-12 left-0 z-[101] min-w-[240px] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-1"
              >
                {[
                  { label: "Q&A", bn: "প্রশ্ন ও উত্তর", icon: Info, action: "qna" },
                  { label: "Comments", bn: "সাধারণ আলোচনা", icon: MessageCircle, action: "general" },
                  { label: "Reviews", bn: "ক্রেতাদের রিভিউ", icon: CheckCircle2, action: "reviews" },
                ].map((opt) => (
                  <button
                    key={opt.action}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCommentMenuOpen(false);
                      navigate(`/marketplace/product/${item.id}/comments?tab=${opt.action}`);
                    }}
                    className="flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-white/5 transition-all text-white group cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-all">
                      <opt.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold leading-none">{opt.label}</span>
                      <span className="text-[8px] text-zinc-500 mt-1 leading-none">{opt.bn}</span>
                    </div>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Inline Comment Prompt */}
      <div className="px-4 pb-4 flex items-center gap-2 border-t border-white/[0.01] pt-3">
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" 
            alt="Me" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1 relative">
          <input 
            type="text"
            placeholder={isBn ? "একটি মন্তব্য লিখুন..." : "Write a comment..."}
            className="w-full bg-zinc-900 border border-transparent focus:border-white/10 rounded-full px-4 py-1.5 text-[10px] text-white placeholder:text-zinc-600 focus:outline-none transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                toast.success("মন্তব্য পোস্ট করা হয়েছে!");
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </div>
      </div>
      
      <QuickViewModal 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
        item={item} 
        isBn={isBn}
        onFullDetails={handleFullDetailsNav}
      />
    </motion.div>
  );
});
