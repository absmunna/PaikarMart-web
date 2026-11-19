import React, { useState } from 'react';
import { 
  Star, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Package, 
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { Order, OrderReview } from '@/types';

interface OrderReviewModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (orderId: string, review: OrderReview) => void;
  initialReview?: OrderReview;
}

const REVIEW_TAGS = [
  'Fast Delivery',
  'Pristine Packaging',
  'High Quality',
  'Accurate Description',
  'Great Value',
  'Fresh & Authentic',
  'Courteous Courier'
];

const RATING_LABELS: Record<number, string> = {
  1: 'Poor · Needs improvement',
  2: 'Fair · Below expectations',
  3: 'Good · Met expectations',
  4: 'Very Good · Highly satisfied',
  5: 'Excellent · Exceeded expectations!'
};

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  order,
  isOpen,
  onClose,
  onSubmitReview,
  initialReview,
}) => {
  const [rating, setRating] = useState<number>(initialReview?.rating || 5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>(initialReview?.comment || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(initialReview?.tags || ['Fast Delivery', 'High Quality']);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;

    const review: OrderReview = {
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      tags: selectedTags
    };

    onSubmitReview(order.id, review);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  const activeRating = hoveredRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--pm-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--pm-warning-soft)] text-[var(--pm-warning)] flex items-center justify-center">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--pm-text)]">
                {initialReview ? 'Edit Order Review' : 'Rate & Review Order'}
              </h3>
              <p className="text-xs text-[var(--pm-muted)]">
                Order #{order.id} · Verified Purchase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-[var(--pm-success-soft)] text-[var(--pm-success)] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-[var(--pm-text)]">
              Thank You for Your Feedback!
            </h4>
            <p className="text-xs text-[var(--pm-muted)]">
              Your verified review helps our merchant community and fellow shoppers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Purchased Items Thumbnail Strip */}
            <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--pm-muted)] block">
                Purchased Items ({order.items.length})
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {order.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] shrink-0 text-xs shadow-2xs"
                  >
                    {item.product.imageUrl && (
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.title} 
                        className="w-6 h-6 rounded-md object-cover"
                      />
                    )}
                    <span className="font-semibold text-[var(--pm-text)] truncate max-w-[140px]">
                      {item.product.title}
                    </span>
                    <span className="text-[var(--pm-muted)] text-[10px] font-mono">
                      (x{item.quantity})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive 5-Star Rating */}
            <div className="text-center space-y-2 pt-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--pm-muted)] block">
                Overall Rating
              </label>
              
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = starValue <= activeRating;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onMouseEnter={() => setHoveredRating(starValue)}
                      onMouseLeave={() => setHoveredRating(null)}
                      onClick={() => setRating(starValue)}
                      className="p-1 rounded-lg transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                      title={`${starValue} Star${starValue > 1 ? 's' : ''}`}
                    >
                      <Star 
                        className={`w-8 h-8 transition-colors ${
                          isFilled 
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs' 
                            : 'text-[var(--pm-border)]'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>

              <p className="text-xs font-semibold text-[var(--pm-warning)] h-4">
                {RATING_LABELS[activeRating]}
              </p>
            </div>

            {/* Quick Feedback Highlight Tags */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                <span>What went well? (Select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {REVIEW_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                          : 'bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text Feedback */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                  <span>Written Review</span>
                </label>
                <span className="text-[10px] text-[var(--pm-muted)]">
                  {comment.length}/500
                </span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="Share your thoughts on item quality, packaging, courier delivery speed, or overall purchase experience..."
                className="w-full p-3 rounded-2xl bg-[var(--pm-input)] text-xs sm:text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:outline-hidden focus:border-[var(--pm-accent)] resize-none transition-all"
              />
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--pm-border)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={rating < 1}
                className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{initialReview ? 'Save Updated Review' : 'Submit Review'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
