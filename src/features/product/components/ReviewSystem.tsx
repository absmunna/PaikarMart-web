import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerifiedBuyer: boolean;
}

interface ReviewSystemProps {
  productId: string;
  reviews: Review[];
}

export const ReviewSystem = ({ productId, reviews }: ReviewSystemProps) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-[#0c1a12] border border-[#1e3425] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-zinc-600'}`} />
            ))}
          </div>
          <p className="text-sm text-white font-bold">{review.userName}</p>
          <p className="text-sm text-zinc-300 mt-1">{review.comment}</p>
          <p className="text-xs text-zinc-500 mt-2">{review.createdAt}</p>
        </div>
      ))}
    </div>
  );
};
