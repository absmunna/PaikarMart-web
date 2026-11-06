import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, CheckCircle2, MessageCircle, Send, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ReviewItem } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle?: string;
  sellerName?: string;
  reviews: ReviewItem[];
  onAddReview: (review: ReviewItem) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  postTitle,
  sellerName,
  reviews,
  onAddReview
}) => {
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      authorName: 'ভেরিফায়েড বায়ার (আপনি)',
      verifiedBuyer: true,
      rating,
      text: commentText.trim(),
      timestamp: 'এইমাত্র'
    };

    onAddReview(newRev);
    setCommentText('');
    toast.success('ভেরিফায়েড রিভিউ সফলভাবে যোগ করা হয়েছে!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal / Drawer */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-x-2 bottom-2 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg w-auto bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-5 z-50 max-h-[85vh] flex flex-col shadow-2xl shadow-black"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--pm-border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-[var(--pm-accent)]">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">ভেরিফায়েড রিভিউ ও প্রশ্নোত্তর (Q&A)</h3>
                  <p className="text-[11px] text-[var(--pm-text-muted)] font-medium">
                    {sellerName ? `${sellerName}-এর পোস্ট` : 'ক্রেতাদের প্রতিক্রিয়া'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reviews List */}
            <div className="flex-1 overflow-y-auto space-y-3.5 py-4 pr-1">
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-[var(--pm-text-muted)] font-bold">এখনো কোনো রিভিউ দেওয়া হয়নি।</p>
                  <p className="text-[10px] text-zinc-500 mt-1">প্রথম ভেরিফায়েড রিভিউ বা প্রশ্নটি আপনিই লিখুন!</p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-zinc-200">{rev.authorName}</span>
                        {rev.verifiedBuyer && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" /> ভেরিফায়েড বায়ার
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500">{rev.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-zinc-600'}`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-zinc-300 font-medium leading-relaxed">{rev.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="pt-3 border-t border-[var(--pm-border)] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-zinc-400">রেটিং দিন:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="আপনার বাস্তব অভিজ্ঞতা বা প্রশ্ন লিখুন..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--pm-accent)] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2.5 bg-[var(--pm-accent)] hover:opacity-90 disabled:opacity-40 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-[var(--pm-accent)]/20 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>পাঠান</span>
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
