import { Heart, MessageCircle, Share2, ShoppingCart, MoreHorizontal, CheckCircle2 } from "lucide-react";

export interface FeedPostProps {
  id: string;
  authorName: string;
  authorAvatar?: string;
  isVerified?: boolean;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  productId?: string;
  productPrice?: number;
  likes: number;
  comments: number;
}

export default function FeedPost({
  authorName,
  authorAvatar,
  isVerified,
  timeAgo,
  content,
  imageUrl,
  productId,
  productPrice,
  likes,
  comments,
}: FeedPostProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-gray-400">{authorName.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="text-sm font-semibold text-gray-900">{authorName}</h4>
              {isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />}
            </div>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Content text */}
      <div className="mt-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
        {content}
      </div>

      {/* Media / Attached Product */}
      {imageUrl && (
        <div className="mt-3 overflow-hidden rounded-xl bg-gray-50">
          <img src={imageUrl} alt="Post content" className="w-full h-auto max-h-[400px] object-cover" />
        </div>
      )}

      {/* Call to action card for product posts */}
      {productId && productPrice && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3">
          <div>
            <p className="text-xs text-gray-500 font-medium">Featured Product</p>
            <p className="text-sm font-bold text-gray-900">৳{productPrice.toLocaleString()}</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            <ShoppingCart className="h-4 w-4" />
            Buy Now
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-6 border-t border-gray-50 pt-3">
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors group">
          <div className="rounded-full p-1.5 group-hover:bg-blue-50 transition-colors">
            <Heart className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">{likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors group">
          <div className="rounded-full p-1.5 group-hover:bg-blue-50 transition-colors">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium">{comments}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors group ml-auto">
          <div className="rounded-full p-1.5 group-hover:bg-blue-50 transition-colors">
            <Share2 className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
  );
}
