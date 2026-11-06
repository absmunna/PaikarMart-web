import React, { useState, useMemo } from 'react';
import { Star, CheckCircle2, Send, PenLine, ArrowDownUp } from 'lucide-react';
import { StarRating } from '@/design-system/components/ui/StarRating';
import { toast } from 'sonner';

export interface ProductReviewItem {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerifiedBuyer?: boolean;
}

interface ReviewSystemProps {
  productId: string;
  reviews?: ProductReviewItem[];
  onReviewSubmit?: (newReview: ProductReviewItem) => void;
}

export const ReviewSystem: React.FC<ReviewSystemProps> = ({ 
  productId, 
  reviews: initialReviews = [], 
  onReviewSubmit 
}) => {
  const [reviewsList, setReviewsList] = useState<ProductReviewItem[]>(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedReviews = useMemo(() => {
    return [...reviewsList].sort((a, b) => {
      if (sortBy === 'highest') {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.id.localeCompare(a.id);
      }
      if (sortBy === 'lowest') {
        if (a.rating !== b.rating) return a.rating - b.rating;
        return b.id.localeCompare(a.id);
      }
      // 'recent' by default
      return b.id.localeCompare(a.id);
    });
  }, [reviewsList, sortBy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('মতামত বা ফিডব্যাক লিখুন (Please enter your feedback)');
      return;
    }

    setIsSubmitting(true);
    const newEntry: ProductReviewItem = {
      id: `rev-${Date.now()}`,
      userName: customerName.trim() || 'ভেরিফাইড ক্রেতা (Customer)',
      rating,
      comment: comment.trim(),
      createdAt: 'এইমাত্র',
      isVerifiedBuyer: true,
    };

    setReviewsList([newEntry, ...reviewsList]);
    if (onReviewSubmit) {
      onReviewSubmit(newEntry);
    }

    setComment('');
    setRating(5);
    setIsFormOpen(false);
    setIsSubmitting(false);
    toast.success('রিভিউ সফলভাবে জমা হয়েছে!');
  };

  return (
    <div className="space-y-4 text-left">
      {/* Header with Add Review Button */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        <div>
          <h4 className="text-sm font-black text-white">গ্রাহক রিভিউ ও স্টার রেটিং</h4>
          <p className="text-[11px] text-zinc-400 mt-0.5">যাচাইকৃত ক্রেতাদের মতামত</p>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md shadow-[var(--pm-accent)]/20"
        >
          <PenLine className="w-3.5 h-3.5" />
          <span>{isFormOpen ? 'ফর্ম লুকান' : 'মতামত লিখুন'}</span>
        </button>
      </div>

      {/* Star Rating and Customer Feedback Input Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-[#0c1a12] border border-[#1e3425] space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              স্টার রেটিং নির্বাচন করুন:
            </label>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
              <StarRating 
                rating={rating} 
                size="md" 
                interactive 
                onChange={(val) => setRating(val)}
                showLabel 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              আপনার নাম:
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="আপনার নাম লিখুন..."
              className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1">
              গ্রাহক মতামত (Customer Feedback):
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="পণ্যটির গুণগত মান, ডেলিভারি ও সেলার সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 min-h-[90px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>রিভিউ পোস্ট করুন</span>
            </button>
          </div>
        </form>
      )}

      {/* Reviews List & Controls */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-bold text-zinc-400">
          মোট {sortedReviews.length}টি রিভিউ
        </span>
        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl px-2.5 py-1 text-xs">
          <ArrowDownUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[11px] font-bold text-zinc-400 shrink-0">সর্ট:</span>
          <select
            aria-label="Sort reviews"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest' | 'lowest')}
            className="bg-transparent text-white text-[11px] font-bold outline-none cursor-pointer pr-1"
          >
            <option value="recent" className="bg-zinc-900 text-white">Most Recent</option>
            <option value="highest" className="bg-zinc-900 text-white">Highest Rated</option>
            <option value="lowest" className="bg-zinc-900 text-white">Lowest Rated</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {sortedReviews.map((review) => (
          <div key={review.id} className="bg-[#0c1a12] border border-[#1e3425] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="xs" />
                <span className="text-xs text-white font-bold">{review.userName}</span>
                {review.isVerifiedBuyer && (
                  <span className="inline-flex items-center gap-0.5 text-[8.5px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-2.5 h-2.5" /> ভেরিফাইড
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-500">{review.createdAt}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSystem;
