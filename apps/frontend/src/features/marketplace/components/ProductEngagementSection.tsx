import React, { useEffect, useState } from 'react';
import { Star, CheckCircle2, MessageSquare, Send, HelpCircle } from 'lucide-react';
import { User } from '@/types';
import {
  retailApiClient,
  ProductReviewItem,
  ProductQuestionItem,
} from '@/features/marketplace/services/retailApiClient';

interface ProductEngagementSectionProps {
  productId: string;
  currentUser: User;
  isBn: boolean;
  defaultSubTab?: 'reviews' | 'qna';
  fallbackRating: number;
  fallbackReviewsCount: number;
}

export const ProductEngagementSection: React.FC<ProductEngagementSectionProps> = ({
  productId,
  currentUser,
  isBn,
  defaultSubTab = 'reviews',
  fallbackRating,
  fallbackReviewsCount,
}) => {
  const [subTab, setSubTab] = useState<'reviews' | 'qna'>(defaultSubTab);
  const [reviews, setReviews] = useState<ProductReviewItem[]>([]);
  const [qna, setQna] = useState<ProductQuestionItem[]>([]);
  const [stats, setStats] = useState<{
    averageRating: number;
    totalReviews: number;
    verifiedCount: number;
    breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Review composer state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Q&A composer state
  const [questionText, setQuestionText] = useState('');
  const [qnaError, setQnaError] = useState<string | null>(null);
  const [submittingQna, setSubmittingQna] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    retailApiClient.fetchProductEngagement(productId).then((data) => {
      if (!active) return;
      if (data) {
        setReviews(data.reviews);
        setQna(data.qna);
        setStats(data.stats);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    if (comment.trim().length < 5) {
      setReviewError(isBn ? 'কমপক্ষে ৫ অক্ষরের রিভিউ লিখুন।' : 'Please write at least 5 characters.');
      return;
    }

    setSubmittingReview(true);
    try {
      const updated = await retailApiClient.submitProductReview(productId, {
        userId: currentUser.id,
        userName: currentUser.name,
        rating,
        comment: comment.trim(),
      });
      setReviews(updated.reviews);
      setStats(updated.stats);
      setComment('');
      setShowReviewForm(false);
    } catch (err: any) {
      setReviewError(err?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setQnaError(null);
    if (questionText.trim().length < 5) {
      setQnaError(isBn ? 'কমপক্ষে ৫ অক্ষরের প্রশ্ন লিখুন।' : 'Please write at least 5 characters.');
      return;
    }

    setSubmittingQna(true);
    try {
      const res = await retailApiClient.submitProductQuestion(productId, {
        authorId: currentUser.id,
        authorName: currentUser.name,
        question: questionText.trim(),
      });
      setQna((prev) => [res.question, ...prev]);
      setQuestionText('');
    } catch (err: any) {
      setQnaError(err?.message || 'Failed to post question.');
    } finally {
      setSubmittingQna(false);
    }
  };

  const displayAvg = stats && stats.totalReviews > 0 ? stats.averageRating : fallbackRating;
  const displayTotal = stats && stats.totalReviews > 0 ? stats.totalReviews : fallbackReviewsCount;

  return (
    <div className="space-y-4">
      {/* Sub-tab Switcher */}
      <div className="flex items-center justify-between gap-2 border-b border-[var(--pm-border)] pb-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          <button
            type="button"
            onClick={() => setSubTab('reviews')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              subTab === 'reviews'
                ? 'bg-[var(--pm-card)] text-[var(--pm-text)] shadow-xs'
                : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
            }`}
          >
            {isBn ? `ক্রেতা রিভিউ (${reviews.length})` : `Buyer Reviews (${reviews.length})`}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('qna')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              subTab === 'qna'
                ? 'bg-[var(--pm-card)] text-[var(--pm-text)] shadow-xs'
                : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
            }`}
          >
            {isBn ? `প্রশ্ন ও উত্তর (${qna.length})` : `Product Q&A (${qna.length})`}
          </button>
        </div>

        {subTab === 'reviews' && (
          <button
            type="button"
            onClick={() => setShowReviewForm((prev) => !prev)}
            className="text-xs font-bold text-[var(--pm-accent)] hover:underline whitespace-nowrap cursor-pointer"
          >
            {showReviewForm
              ? isBn ? 'বাতিল করুন' : 'Cancel'
              : isBn ? '+ রিভিউ লিখুন' : '+ Write Review'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-[var(--pm-muted)]">
          {isBn ? 'তথ্য লোড হচ্ছে...' : 'Loading verified feedback...'}
        </div>
      ) : subTab === 'reviews' ? (
        <div className="space-y-4">
          {/* Dynamic Rating Summary + Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
            <div className="sm:col-span-4 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span className="text-2xl font-mono font-bold text-[var(--pm-text)] tabular-nums">
                  {displayAvg}
                </span>
                <span className="text-xs text-[var(--pm-muted)] font-mono">/ 5.0</span>
              </div>
              <p className="text-xs text-[var(--pm-muted)] mt-1">
                {displayTotal} {isBn ? 'টি রেটিং' : 'ratings'} · {stats?.verifiedCount ?? 0} {isBn ? 'ভেরিফাইড ক্রয়' : 'verified'}
              </p>
            </div>

            <div className="sm:col-span-8 space-y-1.5">
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const count = stats?.breakdown?.[star] ?? 0;
                const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-[11px]">
                    <span className="w-6 font-mono text-[var(--pm-muted)] tabular-nums">{star}★</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--pm-border)] overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right font-mono text-[var(--pm-muted)] tabular-nums">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="p-4 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--pm-text)]">
                  {isBn ? 'আপনার রেটিং:' : 'Your Rating:'}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 cursor-pointer"
                      aria-label={`Rate ${s} stars`}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= rating ? 'fill-amber-500 text-amber-500' : 'text-[var(--pm-border-strong)]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  isBn
                    ? 'পণ্যের মান, আসল ছবি এবং ডেলিভারি অভিজ্ঞতা সম্পর্কে লিখুন...'
                    : 'Share product quality, packaging, and delivery experience...'
                }
                className="w-full p-3 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)] resize-none"
              />

              {reviewError && <p className="text-xs text-[var(--pm-danger)]">{reviewError}</p>}

              <button
                type="submit"
                disabled={submittingReview}
                className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] text-xs font-bold cursor-pointer"
              >
                {submittingReview
                  ? isBn ? 'সাবমিট হচ্ছে...' : 'Submitting...'
                  : isBn ? 'রিভিউ প্রকাশ করুন' : 'Publish Review'}
              </button>
            </form>
          )}

          {/* Review Items */}
          {reviews.length === 0 ? (
            <p className="text-xs text-[var(--pm-muted)] py-4 text-center">
              {isBn ? 'এখনও কোনো রিভিউ নেই। প্রথম রিভিউ দিন।' : 'No reviews yet for this product. Be the first to review.'}
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center text-xs font-bold shrink-0">
                        {rev.userName[0] || 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--pm-text)] truncate">
                          <span>{rev.userName}</span>
                          {rev.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--pm-success)]">
                              <span aria-hidden="true">·</span>
                              <CheckCircle2 className="w-3 h-3" />
                              {isBn ? 'ভেরিফাইড ক্রয়' : 'Verified Purchase'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-[var(--pm-border-strong)]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-[var(--pm-muted)] font-mono shrink-0">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--pm-muted)] leading-relaxed">{rev.comment}</p>
                  {rev.sellerReply && (
                    <div className="pt-2 border-t border-[var(--pm-border)] text-[11px] text-[var(--pm-muted)]">
                      <span className="font-semibold text-[var(--pm-text)]">
                        {isBn ? 'বিক্রেতার উত্তর: ' : 'Seller reply: '}
                      </span>
                      {rev.sellerReply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Product Q&A Section */
        <div className="space-y-4">
          <form onSubmit={handleSubmitQuestion} className="flex gap-2">
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder={
                isBn
                  ? 'পণ্য বা ওয়ারেন্টি নিয়ে বিক্রেতাকে প্রশ্ন করুন...'
                  : 'Ask the seller about specs, warranty, or batch...'
              }
              className="flex-1 px-3 py-2 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
            />
            <button
              type="submit"
              disabled={submittingQna}
              className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isBn ? 'জিজ্ঞাসা করুন' : 'Ask'}</span>
            </button>
          </form>
          {qnaError && <p className="text-xs text-[var(--pm-danger)]">{qnaError}</p>}

          {qna.length === 0 ? (
            <div className="py-6 text-center text-xs text-[var(--pm-muted)] flex flex-col items-center gap-1.5">
              <HelpCircle className="w-5 h-5 text-[var(--pm-muted)]" />
              <span>{isBn ? 'এই পণ্য নিয়ে এখনও কোনো প্রশ্ন করা হয়নি।' : 'No questions asked yet for this item.'}</span>
            </div>
          ) : (
            <div className="space-y-3">
              {qna.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-[var(--pm-text)] flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[var(--pm-accent)] shrink-0 mt-0.5" />
                      <span>{item.question}</span>
                    </p>
                    <span className="text-[11px] text-[var(--pm-muted)] shrink-0">{item.authorName}</span>
                  </div>
                  {item.answer ? (
                    <p className="text-xs text-[var(--pm-muted)] pl-5">
                      <span className="font-semibold text-[var(--pm-success)]">
                        {item.answeredBy || (isBn ? 'বিক্রেতা' : 'Seller')}:{' '}
                      </span>
                      {item.answer}
                    </p>
                  ) : (
                    <p className="text-[11px] text-[var(--pm-muted)] pl-5">
                      {isBn ? 'বিক্রেতার উত্তরের অপেক্ষায়...' : 'Awaiting seller response'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
