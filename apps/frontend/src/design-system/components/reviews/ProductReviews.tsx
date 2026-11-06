import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, MessageCircle, User, ThumbsUp, CheckCircle2, 
  Send, Sparkles, Filter, ShieldCheck, HeartHandshake, PenLine, AlertCircle,
  ArrowDownUp
} from 'lucide-react';
import { Review, reviewService } from '@/modules/reviews';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { StarRating } from '@/design-system/components/ui/StarRating';

interface ProductReviewsProps {
  productId?: string;
  shopId?: string;
  productTitle?: string;
}

const QUICK_FEEDBACK_TAGS = [
  '১০০% খাঁটি পণ্য',
  'দ্রুত ডেলিভারি',
  'উন্নত মানের ফেব্রিক',
  'সেলার খুব দায়িত্বশীল',
  'দাম অনুযায়ী সেরা',
  'নিরাপদ প্যাকেজিং',
];

export const ProductReviews: React.FC<ProductReviewsProps> = ({ 
  productId = '1', 
  shopId,
  productTitle 
}) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive Review Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [recommended, setRecommended] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filtering, Sorting & Helpful Tracking
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadReviews();
  }, [productId, shopId]);

  useEffect(() => {
    if (user?.name) {
      setCustomerName(user.name);
    }
  }, [user]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      let data: Review[] = [];
      if (productId) {
        data = await reviewService.getReviewsByProduct(productId);
      } else if (shopId) {
        data = await reviewService.getReviewsByShop(shopId);
      }
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
      // Also optionally append into feedback if comment is short
      if (!comment.includes(tag)) {
        setComment(prev => prev ? `${prev} • ${tag}` : tag);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalName = customerName.trim() || user?.name || 'ভেরিফাইড ক্রেতা (Customer)';
    if (!comment.trim()) {
      toast.error('অনুগ্রহ করে পণ্যের অভিজ্ঞতা জানিয়ে মতামত লিখুন (Please write feedback).');
      return;
    }
    if (rating < 1) {
      toast.error('অনুগ্রহ করে পণ্যের স্টার রেটিং নির্বাচন করুন (Please select a star rating).');
      return;
    }

    setIsSubmitting(true);
    try {
      const newReview = await reviewService.addReview({
        productId: productId || 'unknown',
        shopId: shopId || 'store-1',
        userId: user?.id || `guest-${Date.now()}`,
        userName: finalName,
        userAvatar: user?.avatarUrl,
        rating,
        comment: comment.trim(),
        tags: selectedTags,
        recommended,
        isVerifiedBuyer: true
      });
      
      setReviews(prev => [newReview, ...prev]);
      setComment('');
      setRating(5);
      setSelectedTags([]);
      setIsFormOpen(false);
      toast.success('আপনার রিভিউ সফলভাবে যুক্ত হয়েছে! ধন্যবাদ।');
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error('রিভিউ সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpfulClick = async (reviewId: string) => {
    if (helpfulVoted[reviewId]) {
      toast.info('আপনি ইতোমধ্যে ভোট দিয়েছেন');
      return;
    }

    setHelpfulVoted(prev => ({ ...prev, [reviewId]: true }));
    try {
      const newCount = await reviewService.markHelpful(reviewId);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpfulCount: newCount } : r));
      toast.success('মতামতটিকে সাহায্যকারী হিসেবে চিহ্নিত করা হয়েছে!');
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '5.0';
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[rounded] = (counts[rounded] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let result = reviews;
    if (filterRating !== 'all') {
      result = result.filter(r => Math.round(r.rating) === filterRating);
    }
    return [...result].sort((a, b) => {
      if (sortBy === 'highest') {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'lowest') {
        if (a.rating !== b.rating) {
          return a.rating - b.rating;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // 'recent' by default
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [reviews, filterRating, sortBy]);

  return (
    <div className="bg-transparent text-left select-none">
      {/* ─── Header & Rating Overview ─── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-black text-white">গ্রাহক রিভিউ ও রেটিং (Customer Reviews)</h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              ভেরিফাইড
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            {productTitle ? `${productTitle} সম্পর্কে আসল ক্রেতাদের মতামত` : 'সরাসরি পণ্য ক্রেতাদের যাচাইকৃত রেটিং ও অভিজ্ঞতা'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-[#FF7A00] hover:from-orange-600 hover:to-[#e06b00] text-white text-xs font-black shadow-lg shadow-orange-500/20 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <PenLine className="w-4 h-4" />
          <span>{isFormOpen ? 'ফর্ম বন্ধ করুন' : 'রিভিউ ও রেটিং দিন'}</span>
        </button>
      </div>

      {/* ─── Score Breakdown Grid ─── */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-12 gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
        {/* Left: Overall Big Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-black/20 border border-white/5 text-center">
          <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {averageRating}
          </span>
          <div className="my-2">
            <StarRating rating={Number(averageRating)} size="lg" />
          </div>
          <p className="text-xs font-bold text-zinc-300">
            সর্বমোট {reviews.length}টি কাস্টমার রিভিউ
          </p>
          <p className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> শতভাগ সত্য ক্রেতা সুরক্ষা
          </p>
        </div>

        {/* Right: Star Distribution Bars */}
        <div className="md:col-span-8 flex flex-col justify-center gap-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars] || 0;
            const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
            return (
              <div 
                key={stars} 
                onClick={() => setFilterRating(filterRating === stars ? 'all' : stars)}
                className="flex items-center gap-3 text-xs cursor-pointer group p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-1 w-12 text-zinc-300 font-bold shrink-0">
                  <span>{stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-16 text-right text-zinc-400 font-medium text-[11px] shrink-0">
                  {percentage}% ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Interactive Review Input Form ─── */}
      {isFormOpen && (
        <form 
          onSubmit={handleSubmit} 
          className="mb-8 p-5 md:p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-black/40 border border-orange-500/30 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF7A00]" />
              <h3 className="text-sm font-black text-white">আপনার মতামত ও রেটিং প্রদান করুন</h3>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium">সহজ ও দ্রুত সাবমিশন</span>
          </div>

          {/* 1. Star Rating Component */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2">
              ১. পণ্যের কোয়ালিটি অনুযায়ী স্টার নির্বাচন করুন:
            </label>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-wrap items-center gap-4">
              <StarRating 
                rating={rating} 
                size="lg" 
                interactive 
                onChange={(newScore) => setRating(newScore)}
                showLabel
              />
              <span className="text-[11px] text-zinc-400">
                (স্টারের উপর ক্লিক করে রেটিং সিলেক্ট করুন)
              </span>
            </div>
          </div>

          {/* 2. Customer Name */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              ২. আপনার নাম (Customer Name):
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="যেমন: মোঃ সাকিব আহমেদ"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00] transition-colors"
            />
          </div>

          {/* 3. Quick Tags */}
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2">
              ৩. দ্রুত অভিজ্ঞতা ট্যাগ সিলেক্ট করুন (ঐচ্ছিক):
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_FEEDBACK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF7A00] text-white border-[#FF7A00] shadow-sm'
                        : 'bg-white/5 text-zinc-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Feedback Text Input Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-zinc-300">
                ৪. বিস্তারিত মতামত ও গ্রাহক প্রতিক্রিয়া (Customer Feedback):
              </label>
              <span className="text-[10px] text-zinc-500">
                {comment.length} / ৫০০ অক্ষর
              </span>
            </div>
            <textarea
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="পণ্যটির মান, ডেলিভারির সময়, সাইজ বা সেলারের সেবা সম্পর্কে আপনার অভিজ্ঞতা শেয়ার করুন..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00] min-h-[110px] resize-none leading-relaxed transition-colors"
            />
          </div>

          {/* 5. Recommendation Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
            <span className="text-xs text-zinc-300 font-bold flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              আপনি কি এই পণ্যটি অন্য গ্রাহকদের ক্রয়ের জন্য সুপারিশ করেন?
            </span>
            <button
              type="button"
              onClick={() => setRecommended(!recommended)}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-colors ${
                recommended ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-zinc-400'
              }`}
            >
              {recommended ? 'হ্যাঁ, সুপারিশ করি' : 'না'}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-[#FF7A00] hover:from-orange-600 hover:to-[#e06b00] text-white text-xs font-black shadow-lg shadow-orange-500/20 flex items-center gap-2 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'জমা হচ্ছে...' : 'রিভিউ পোস্ট করুন'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ─── Filter Tabs & Review Counter ─── */}
      <div className="flex items-center justify-between flex-wrap gap-3 my-5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-[var(--pm-accent)]" /> ফিল্টার:
          </span>
          <button
            type="button"
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
              filterRating === 'all'
                ? 'bg-[var(--pm-accent)] text-white shadow-sm'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            সব ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars] || 0;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => setFilterRating(stars)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                  filterRating === stars
                    ? 'bg-[var(--pm-accent)] text-white shadow-sm'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                <span>{stars}★</span>
                <span className="text-[9px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs">
            <ArrowDownUp className="w-3.5 h-3.5 text-[var(--pm-accent)] shrink-0" />
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

          <span className="text-[11px] font-bold text-zinc-400 whitespace-nowrap">
            প্রদর্শিত {filteredReviews.length}টি রিভিউ
          </span>
        </div>
      </div>

      {/* ─── Reviews List ─── */}
      {loading ? (
        <div className="py-12 text-center text-zinc-400 text-xs">
          রিভিউ লোড হচ্ছে...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-2xl">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3 text-zinc-500">
            <MessageCircle className="w-6 h-6" />
          </div>
          <p className="text-zinc-300 font-bold text-sm">এই ফিল্টারে কোনো রিভিউ পাওয়া যায়নি।</p>
          <p className="text-zinc-500 text-xs mt-1">প্রথম রিভিউ দিতে ওপরের বাটনে ক্লিক করুন।</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div 
              key={rev.id} 
              className="p-4 md:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors space-y-3"
            >
              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF7A00]/20 to-orange-500/10 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00] font-black text-xs shrink-0 overflow-hidden">
                    {rev.userAvatar ? (
                      <img src={rev.userAvatar} alt={rev.userName} className="w-full h-full object-cover" />
                    ) : (
                      rev.userName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-white">{rev.userName}</h4>
                      {rev.isVerifiedBuyer && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> ভেরিফাইড ক্রেতা
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={rev.rating} size="xs" />
                      <span className="text-[10px] text-zinc-500">
                        {new Date(rev.createdAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {rev.recommended && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded-lg border border-emerald-400/15">
                    <CheckCircle2 className="w-3 h-3" /> ক্রেতা সুপারিশ করেছেন
                  </span>
                )}
              </div>

              {/* Tags */}
              {rev.tags && rev.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rev.tags.map((t, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-medium text-zinc-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Feedback Content */}
              <p className="text-xs text-zinc-300 leading-relaxed font-normal whitespace-pre-line">
                {rev.comment}
              </p>

              {/* Review Actions Footer */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <button
                  type="button"
                  onClick={() => handleHelpfulClick(rev.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    helpfulVoted[rev.id] 
                      ? 'text-emerald-400 bg-emerald-500/10' 
                      : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${helpfulVoted[rev.id] ? 'fill-emerald-400' : ''}`} />
                  <span className="text-[11px] font-bold">
                    উপকারী ({rev.helpfulCount || 0})
                  </span>
                </button>

                <span className="text-[10px] text-zinc-500">
                  নিরাপদ ও এসক্রো ট্রাস্টেড
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
