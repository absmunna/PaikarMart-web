import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ArrowRight, Tag, Star, ChevronRight, Store, ShieldCheck } from 'lucide-react';
import { UnifiedFeedItem } from '@/modules/social/types';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/modules/cart';
import { toast } from 'sonner';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: UnifiedFeedItem;
  isBn: boolean;
  onFullDetails: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ isOpen, onClose, item, isBn, onFullDetails }) => {
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const images = item.content.media || [];
  const displayImage = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600';

  const handleBuyNow = () => {
    addItem({
      id: item.id,
      sourceId: item.id,
      name: item.content.title,
      price: item.content.price || 0,
      quantity: item.content.metadata?.moq || 1,
      image: displayImage,
      domain: 'retail',
      metadata: { portal: item.domain }
    });
    onClose();
    navigate('/checkout');
    toast.success(isBn ? `${item.content.title} কার্টে যোগ করা হয়েছে!` : `${item.content.title} added to cart!`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#0f1218] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: Image */}
          <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-full bg-zinc-100 dark:bg-zinc-900 relative">
            <img 
              src={displayImage} 
              alt={item.content.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {item.content.price && (
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#00a859]" />
                <span className="text-lg font-black text-[#00a859]">৳{item.content.price.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
            <div className="flex-1">
              {/* Seller Info */}
              <div className="flex items-center gap-2 mb-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                  <img src={item.author.avatar} alt={item.author.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{item.author.name}</h4>
                    {item.author.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-medium mt-0.5">
                    <Store className="w-3 h-3" />
                    <span>{isBn ? 'ভেরিফাইড মার্চেন্ট' : 'Verified Merchant'}</span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white leading-tight mb-3">
                {item.content.title}
              </h2>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-500">4.8 (120+ Reviews)</span>
                </div>
                <div className="text-[11px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                  {item.stats.likes} {isBn ? 'লাইক' : 'Likes'}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2">
                    {isBn ? 'পণ্যের বিবরণ' : 'Description'}
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.content.description || (isBn ? 'কোনো বিবরণ দেওয়া হয়নি।' : 'No description available.')}
                  </p>
                </div>

                {/* Specs if any */}
                {(item.content.metadata?.weight || item.content.metadata?.moq) && (
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-100 dark:border-white/5">
                    {item.content.metadata?.weight && (
                      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-2xl border border-zinc-200 dark:border-white/5">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Weight / Unit</span>
                        <span className="text-sm font-black text-zinc-900 dark:text-white">{item.content.metadata.weight}</span>
                      </div>
                    )}
                    {item.content.metadata?.moq && (
                      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-2xl border border-zinc-200 dark:border-white/5">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Min. Order (MOQ)</span>
                        <span className="text-sm font-black text-zinc-900 dark:text-white">{item.content.metadata.moq} Units</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-white/5 flex flex-col gap-3">
              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#00a859] hover:bg-[#008f4c] text-white font-bold transition-all cursor-pointer shadow-lg shadow-[#00a859]/20"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isBn ? 'এখনই কিনুন' : 'Buy Now'}</span>
              </button>
              
              <button
                onClick={() => {
                  onClose();
                  onFullDetails();
                }}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <span>{isBn ? 'সম্পূর্ণ বিস্তারিত দেখুন' : 'View Full Details'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
