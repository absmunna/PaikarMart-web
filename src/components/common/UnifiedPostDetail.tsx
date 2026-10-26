import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, ShieldCheck, Heart, Store, MessageSquare, ChevronRight, 
  MapPin, Clock, ArrowLeft, ShoppingCart, Send, ThumbsUp, HelpCircle,
  Share2, MoreVertical, Wrench, Package, Briefcase, Gavel, Flame, Navigation,
  Plus, Minus
} from 'lucide-react';
import { UnifiedFeedItem } from '@/modules/social/types';
import { useCartStore } from '@/modules/cart/useCartStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatBDT } from '@/lib/format';

interface UnifiedPostDetailProps {
  item: UnifiedFeedItem;
  onBack: () => void;
  customFields?: React.ReactNode;
  actionButtonLabel?: string;
  onAction?: () => void;
}

export const UnifiedPostDetail: React.FC<UnifiedPostDetailProps> = ({ 
  item, 
  onBack,
  customFields,
  actionButtonLabel,
  onAction
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'qa'>('desc');
  const [isLiked, setIsLiked] = useState(item.interactions.hasLiked);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (onAction) {
      onAction();
      return;
    }

    if (item.type === 'PRODUCT') {
      addItem({
        id: item.id,
        sourceId: item.id,
        name: item.content.title,
        price: item.content.price || 0,
        quantity: quantity,
        image: item.content.media[0] || '',
        domain: item.domain.toLowerCase() as any,
        metadata: item.content.metadata
      });
      toast.success(`${item.content.title} কার্টে যোগ করা হয়েছে! (${quantity}টি)`);
    } else {
      navigate('/messages');
      toast.info(`${item.author.name}-এর সাথে যোগাযোগ করতে মেসেজ সেন্টারে নিয়ে যাওয়া হচ্ছে...`);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(!isLiked ? 'পছন্দের তালিকায় যুক্ত হয়েছে' : 'পছন্দের তালিকা থেকে সরানো হয়েছে');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.content.title,
        text: item.content.description,
        url: window.location.href,
      }).catch(() => toast.error('Share failed'));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('লিঙ্ক কপি করা হয়েছে! (Link Copied)');
    }
  };

  const incrementQty = () => setQuantity(prev => Math.min(prev + 1, 99));
  const decrementQty = () => setQuantity(prev => Math.max(prev - 1, 1));

  const mainMedia = item.content.media?.[0] || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800';

  return (
    <div className="w-full bg-[#010804] min-h-screen text-[var(--pm-text)] pb-[calc(140px+env(safe-area-inset-bottom))]">
      {/* ━━━ STICKY HEADER ━━━ */}
      <header className="sticky top-16 z-50 bg-[#010804]/80 backdrop-blur-3xl px-4 h-16 flex items-center justify-between border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all text-white active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 leading-none mb-1">
              {item.type}
            </span>
            <span className="text-[14px] font-black text-white leading-none tracking-tight">
              Details View
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-400 active:scale-90 transition-all"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>
          <button 
            onClick={handleLike}
            className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all active:scale-90"
          >
            <Heart className={cn("w-4.5 h-4.5 transition-colors", isLiked ? 'fill-red-500 stroke-red-500' : 'text-zinc-400')} />
          </button>
        </div>
      </header>

      {/* ━━━ MEDIA GALLERY (1:1) ━━━ */}
      <section className="px-4 mt-4">
        <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#050D08] relative group shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]">
          <motion.img 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            src={mainMedia} 
            alt={item.content.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none opacity-40" />
          
          {/* Badge overlays */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em]">
              {item.domain}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ CORE INFO ━━━ */}
      <section className="px-5 mt-8 space-y-6">
        {/* Chips */}
        <div className="flex flex-wrap gap-2.5">
          {item.author.isVerified && (
            <div className="bg-cyan-400/10 text-cyan-400 text-[9px] font-black px-3 py-1.5 rounded-xl border border-cyan-400/20 flex items-center gap-1.5 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Verified Merchant (যাচাইকৃত)
            </div>
          )}
          {item.type === 'DEMAND' && (
            <div className="bg-orange-500/10 text-orange-400 text-[9px] font-black px-3 py-1.5 rounded-xl border border-orange-500/20 flex items-center gap-1.5 uppercase tracking-widest">
               <Flame className="w-3 h-3" /> Urgent (জরুরি)
            </div>
          )}
          <div className="bg-blue-500/10 text-blue-400 text-[9px] font-black px-3 py-1.5 rounded-xl border border-blue-500/20 flex items-center gap-1.5 uppercase tracking-widest">
             <Package className="w-3 h-3" /> In Stock (মজুদ আছে)
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white leading-none tracking-tighter uppercase">
            {item.content.title}
          </h1>
          {item.content.location && (
            <p className="text-[11px] text-zinc-500 font-bold flex items-center gap-1.5 uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {item.content.location} (লোকেশন)
            </p>
          )}
        </div>

        {/* Pricing/Budget Row */}
        <div className="py-6 border-y border-white/[0.04] flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.25em] mb-1.5">
              {item.type === 'DEMAND' ? 'Estimated Budget (বাজেট)' : 'Price (মূল্য)'}
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-white">
                {item.content.price ? formatBDT(item.content.price) : 'Negotiable'}
              </span>
              {item.content.metadata?.oldPrice && (
                <span className="text-sm text-zinc-600 line-through font-bold">
                  {formatBDT(item.content.metadata.oldPrice)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-xl border border-amber-500/10">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-[12px] font-black">4.9</span>
            </div>
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">
              {item.stats.views?.toLocaleString() || '1.2K'} Views (দেখা হয়েছে)
            </p>
          </div>
        </div>

        {/* Custom Fields (Service Booking, Demand Fields, etc.) */}
        {customFields && (
          <div className="py-2">
            {customFields}
          </div>
        )}

        {/* Seller/Author Mini Info */}
        <div 
          onClick={() => navigate(`/u/${item.author.id}`)}
          className="p-5 rounded-[2rem] bg-[#050D08] border border-[#1e3425] flex items-center gap-4 group active:scale-[0.98] transition-all cursor-pointer shadow-lg"
        >
          <div className="w-12 h-12 rounded-[20px] overflow-hidden border border-white/10 shrink-0">
            <img src={item.author.avatar} alt={item.author.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[14px] font-black text-white truncate flex items-center gap-1.5">
              {item.author.name}
              {item.author.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
            </h4>
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-0.5">Verified Wholesaler</p>
          </div>
          <button className="h-10 px-5 rounded-2xl bg-cyan-400/10 text-[10px] font-black uppercase tracking-widest border border-cyan-400/20 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all">
            Visit
          </button>
        </div>
      </section>

      {/* ━━━ TABBED INTERACTION ━━━ */}
      <section className="mt-10">
        <div className="flex border-b border-white/[0.04] px-5 gap-8">
          {[
            { id: 'desc', label: 'Details' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'qa', label: 'Q&A' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "pb-4 text-[12px] font-black uppercase tracking-[0.2em] transition-all relative",
                activeTab === tab.id ? "text-cyan-400" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-cyan-400 rounded-full shadow-[0_-2px_10px_rgba(0,230,118,0.4)]" />
              )}
            </button>
          ))}
        </div>

        <div className="px-6 py-8 animate-in fade-in slide-in-from-top-2 duration-300">
          {activeTab === 'desc' && (
            <div className="space-y-6">
              <div className="p-5 rounded-[2rem] bg-cyan-400/5 border border-cyan-400/10 flex gap-4">
                <Clock className="w-6 h-6 text-cyan-400 shrink-0" />
                <div>
                  <h5 className="text-[11px] font-black text-white uppercase tracking-widest mb-1.5">Fast Logistics</h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-bold italic">Express delivery available within 24-48 hours via PM Logistics.</p>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-[13px] text-zinc-400 leading-relaxed font-bold">
                  {item.content.description}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Rating Breakdown */}
              <div className="p-5 rounded-[2rem] bg-[#050D08] border border-[#1e3425] space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-white">4.8</div>
                  <div className="space-y-1">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold">120 Verified Reviews</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-white w-3">{stars}</span>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${stars * 20}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 w-8 text-right">{(stars * 20) + 5}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Star Filter */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['All', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'].map((label) => (
                  <button key={label} className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-zinc-400 hover:text-white hover:bg-white/10 uppercase tracking-widest whitespace-nowrap">
                    {label}
                  </button>
                ))}
              </div>

              {/* Review List */}
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-5 rounded-[2rem] bg-[#050D08] border border-[#1e3425] space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800" />
                        <div>
                          <p className="text-[11px] font-black text-white">Verified Buyer #{i}</p>
                          <p className="text-[9px] text-zinc-600 font-bold">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-500 text-amber-500" />)}
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 italic font-bold leading-relaxed">"Great product quality. The delivery was faster than expected. Highly recommended!"</p>
                  </div>
                ))}
              </div>
              
              <button 
                 onClick={() => navigate(`/marketplace/product/${item.id}/comments`)}
                 className="w-full py-4 rounded-[2rem] bg-white/[0.03] border border-white/5 text-[11px] font-black text-white uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2"
               >
                 View All Reviews <ChevronRight className="w-4 h-4 text-cyan-400" />
               </button>
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="space-y-4">
               <div className="p-5 rounded-[2rem] bg-[#050D08] border border-[#1e3425] space-y-4">
                 <div className="flex gap-3">
                   <HelpCircle className="w-5 h-5 text-zinc-500 shrink-0" />
                   <p className="text-[12px] font-black text-white leading-tight">Does it come with a warranty certificate?</p>
                 </div>
                 <div className="flex gap-3 pl-5 border-l-2 border-cyan-400/20">
                   <MessageSquare className="w-5 h-5 text-cyan-400 shrink-0" />
                   <p className="text-[12px] text-zinc-500 font-bold italic">Yes, all our products include a digital warranty card and physical receipt.</p>
                 </div>
               </div>
               <button 
                 onClick={() => navigate(`/marketplace/product/${item.id}/comments`)}
                 className="w-full py-4 rounded-[2rem] bg-white/[0.03] border border-white/5 text-[11px] font-black text-white uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2"
               >
                 View All Questions <ChevronRight className="w-4 h-4 text-cyan-400" />
               </button>
            </div>
          )}
        </div>

        {/* ━━━ RELATED ITEMS ━━━ */}
        <div className="px-5 mt-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Related Items (সম্পর্কিত)</h3>
            <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">See All</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="min-w-[160px] space-y-2 group cursor-pointer">
                <div className="aspect-square rounded-3xl bg-[#050D08] border border-white/5 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80&sig=${i}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">Premium Gadget Product</p>
                  <p className="text-[11px] font-black text-cyan-400">{formatBDT(2500 + i * 500)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ STICKY BOTTOM ACTIONS ━━━ */}
      {/* Shifted up to avoid overlap with BottomNav (approx 58px + safe area) */}
      <footer className="fixed bottom-[calc(58px+env(safe-area-inset-bottom))] left-0 right-0 z-[700] bg-[#010804]/90 backdrop-blur-3xl border-t border-white/10 px-5 pt-4 pb-4 flex gap-3 shadow-[0_-15px_40px_rgba(0,0,0,0.8)]">
        {item.type === 'PRODUCT' && (
          <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-[18px] h-14 px-2">
            <button onClick={decrementQty} className="p-3 text-zinc-500 hover:text-white transition-all"><Minus className="w-4 h-4" /></button>
            <span className="px-3 text-xs font-black text-white">{quantity}</span>
            <button onClick={incrementQty} className="p-3 text-zinc-500 hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
          </div>
        )}
        
        <button 
          onClick={() => {
            navigate('/messages');
            toast.info("Wholesale inquiry chat initiated...");
          }}
          className="w-14 h-14 bg-white/[0.03] border border-white/10 rounded-[18px] flex items-center justify-center text-zinc-400 hover:text-white transition-all"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <button 
          onClick={handleAddToCart}
          className="flex-1 h-14 bg-cyan-400 rounded-[18px] flex items-center justify-center gap-2 text-black font-black uppercase tracking-[0.2em] text-[12px] shadow-[0_8px_32px_rgba(0,230,118,0.25)] active:scale-[0.98] transition-all outline-none"
        >
          {actionButtonLabel || (item.type === 'PRODUCT' ? 'Add to Cart' : 'Contact Vendor')}
        </button>
      </footer>
    </div>
  );
};
