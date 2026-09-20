import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, User } from 'lucide-react';
import { Review } from '../../modules/reviews/types';
import { reviewService } from '../../modules/reviews/reviewService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

interface ProductReviewsProps {
  productId?: string;
  shopId?: string; // If provided, fetches reviews for the shop. If productId is provided, fetches for product.
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, shopId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId, shopId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to leave a review.');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment.');
      return;
    }
    if (!productId && !shopId) {
      toast.error('Cannot submit review: Target missing.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newReview = await reviewService.addReview({
        productId: productId || 'unknown',
        shopId: shopId || 'unknown',
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatarUrl,
        rating,
        comment,
      });
      setReviews([newReview, ...reviews]);
      setComment('');
      setRating(5);
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="bg-transparent mt-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Reviews & Ratings</h2>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-lg font-black text-white">{averageRating}</span>
            <span className="text-sm text-zinc-400">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 bg-white/5 p-5 rounded-2xl border border-white/10">
          <h4 className="text-sm font-bold text-white mb-3">Leave a Review</h4>
          
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star 
                  className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'} transition-colors`} 
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product or supplier..."
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#FF7A00] min-h-[100px] resize-none mb-3"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#FF7A00] hover:bg-[#e06b00] text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <div className="mb-8 bg-white/5 p-5 rounded-2xl border border-white/10 text-center">
          <p className="text-sm text-zinc-400">Please sign in to leave a review.</p>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-zinc-400 text-sm">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
            <MessageCircle className="w-6 h-6 text-zinc-500" />
          </div>
          <p className="text-zinc-300 font-medium">No customer reviews yet.</p>
          <p className="text-zinc-500 text-sm mt-1">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4 pb-6 border-b border-white/5 last:border-0">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
                {review.userAvatar ? (
                  <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-zinc-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">{review.userName}</h5>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
