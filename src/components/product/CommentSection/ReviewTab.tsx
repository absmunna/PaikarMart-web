import React, { useState } from 'react';
import { Star, CheckCircle, Award, User, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/features/language/LanguageContext';
import { toast } from 'sonner';

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  likes: number;
}

export interface ReviewTabProps {
  productId: string;
  initialReviews?: Review[];
}

export const ReviewTab: React.FC<ReviewTabProps> = ({ productId, initialReviews = [] }) => {
  const { isBn } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>(initialReviews.length > 0 ? initialReviews : [
    { id: 'rev-1', author: 'Anisur Rahman', rating: 5, comment: 'চমৎকার কোয়ালিটি পণ্য! একদম অরিজিনাল এবং ডেলিভারি খুব দ্রুত পেয়েছি।', date: 'June 20, 2026', isVerified: true, likes: 14 },
    { id: 'rev-2', author: 'Sabina Yasmin', rating: 4, comment: 'পণ্যটি খুব ভালো লেগেছে, মূল্যটাও পাইকারি হিসেবে বেশ রিজনেবল।', date: 'June 18, 2026', isVerified: true, likes: 6 },
    { id: 'rev-3', author: 'Mohammad Rahim', rating: 5, comment: 'Excellent product! Wholesale rates are unbeatable here.', date: 'June 15, 2026', isVerified: false, likes: 2 }
  ]);

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newReviewItem: Review = {
      id: `rev-${Date.now()}`,
      author: 'CurrentUser (You)',
      rating: newRating,
      comment: newComment,
      date: isBn ? 'আজ' : 'Today',
      isVerified: true, // Mock that our active user is a verified buyer of this product
      likes: 0
    };

    // Verified buyers are sorted higher (with more weight)
    setReviews([newReviewItem, ...reviews]);
    setNewComment('');
    toast.success(isBn ? 'রিভিউটি সফলভাবে যুক্ত করা হয়েছে!' : 'Review submitted successfully!');
  };

  const handleLike = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
    toast.success(isBn ? 'রিভিউটি সহায়ক হিসেবে চিহ্নিত হয়েছে!' : 'Marked review as helpful!');
  };

  // Sort reviews: Verified first, then rating, then likes
  const sortedReviews = [...reviews].sort((a, b) => {
    if (a.isVerified && !b.isVerified) return -1;
    if (!a.isVerified && b.isVerified) return 1;
    return b.likes - a.likes;
  });

  return (
    <div className="space-y-6">
      {/* Submit Form */}
      <form onSubmit={handleAddReview} className="bg-zinc-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
        <div>
          <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-2 block">
            {isBn ? "রেটিং এবং মতামত" : "Rating and Feedback"}
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star)}
                className="focus:outline-none cursor-pointer hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={isBn ? "পণ্যটি সম্পর্কে আপনার মতামত লিখুন..." : "Write your verified product review..."}
            className="w-full h-24 bg-zinc-900 border border-white/5 rounded-xl p-3 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            {isBn ? "ভেরিফাইড বায়ার রিভিউ" : "Verified Buyer Eligible"}
          </div>
          <button
            type="submit"
            className="h-9 px-4 bg-cyan-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-cyan-300 transition-colors min-h-[44px]"
          >
            {isBn ? "সাবমিট করুন" : "Submit Review"}
          </button>
        </div>
      </form>

      {/* Review List */}
      <div className="space-y-4">
        {sortedReviews.map((r) => (
          <div key={r.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center">
                  <User className="w-4.5 h-4.5 text-zinc-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-white text-xs font-black tracking-tight">{r.author}</h5>
                    {r.isVerified && (
                      <span className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-[7px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle className="w-2.5 h-2.5" />
                        {isBn ? "ভেরিফাইড বায়ার" : "Verified Buyer"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-800'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {r.date}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleLike(r.id)}
                className="h-7 px-3 bg-white/5 border border-white/5 text-[9px] text-zinc-400 font-black uppercase tracking-widest rounded-lg hover:bg-white/10 hover:text-white transition-all flex items-center gap-1 min-h-[44px]"
              >
                Helpful ({r.likes})
              </button>
            </div>

            <p className="text-[11.5px] text-zinc-300 leading-relaxed font-medium pl-1">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
