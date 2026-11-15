import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ThumbsUp, 
  Heart, 
  MessageCircle, 
  Share2, 
  Globe, 
  CheckCircle2, 
  ShoppingCart, 
  MoreHorizontal,
  Send,
  Sparkles
} from 'lucide-react';
import { formatDisplayHandle, normalizeHandle } from '@paikarmart/shared';
import { SocialPost, ReactionType, User, CommerceItem } from '@/types';

interface FeedPostCardProps {
  post: SocialPost;
  currentUser: User;
  onReact: (postId: string, reaction: ReactionType) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onAddToCart: (item: CommerceItem) => void;
  commerceItems: CommerceItem[];
  onOpenStorePortal?: (storeId: string) => void;
}

export const FeedPostCard: React.FC<FeedPostCardProps> = ({
  post,
  currentUser,
  onReact,
  onAddComment,
  onAddToCart,
  commerceItems,
}) => {
  const navigate = useNavigate();
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [sentNotice, setSentNotice] = useState<string | null>(null);

  const totalReactions = 
    post.reactionsCount.like + 
    post.reactionsCount.love + 
    post.reactionsCount.care;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
    setShowComments(true);
  };

  const handleShare = () => {
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleProductClick = (e: React.MouseEvent) => {
    if (post.taggedProduct) {
      e.stopPropagation();
      navigate(`/hub/marketplace/product/${post.taggedProduct.id}`);
    }
  };

  // Find linked commerce item if tagged
  const linkedProduct = post.taggedProduct 
    ? commerceItems.find(i => i.id === post.taggedProduct?.id)
    : null;

  return (
    <article className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4 transition-shadow duration-300 hover:shadow-md premium-shadow">
      
      {/* Top Header: Author info & options */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/u/${normalizeHandle(post.authorHandle || post.authorName)}`)}
            className="relative cursor-pointer shrink-0 group"
            aria-label={`View ${post.authorName} profile`}
          >
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[var(--pm-border)] group-hover:ring-[var(--pm-accent)] transition-all shadow-sm"
            />
            {post.authorVerified && (
              <div className="absolute -right-0.5 -bottom-0.5 bg-[var(--pm-card)] rounded-full p-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pm-accent)] fill-[var(--pm-accent-soft)]" />
              </div>
            )}
          </button>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => navigate(`/u/${normalizeHandle(post.authorHandle || post.authorName)}`)}
                className="text-[15px] font-black text-[var(--pm-text)] hover:text-[var(--pm-accent)] hover:underline cursor-pointer text-left"
              >
                {post.authorName}
              </button>
              <span className="text-[11px] font-mono text-[var(--pm-muted)]">
                {formatDisplayHandle(post.authorHandle || post.authorName)}
              </span>
              {post.isSponsored && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] uppercase tracking-tighter">
                  {post.adNetwork || 'Promoted'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--pm-muted)]">
              <span>{post.timestamp}</span>
              <span aria-hidden="true">·</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {post.postType === 'demand' && (
            <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
              Demand
            </span>
          )}
          {post.postType === 'sale' && (
            <span className="px-3 py-1 rounded-full bg-[var(--pm-success-soft)] text-[var(--pm-success)] text-[10px] font-black uppercase tracking-widest border border-[var(--pm-success)]/20">
              Sale
            </span>
          )}
          <button 
            type="button" 
            aria-label="Post options"
            className="p-2 text-[var(--pm-muted)] hover:text-[var(--pm-text)] rounded-full hover:bg-[var(--pm-surface)] transition-colors active-scale cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Post Text Content */}
      <p className={`text-[15px] leading-relaxed whitespace-pre-line px-1 ${
        post.postType === 'demand' ? 'text-[var(--pm-text)] font-bold italic' : 'text-[var(--pm-text)] font-medium'
      }`}>
        {post.content}
      </p>

      {/* Attached Media Photo / Banner */}
      {post.mediaUrl && (
        <div className="rounded-2xl sm:rounded-[1.5rem] overflow-hidden border border-[var(--pm-border)] bg-[var(--pm-surface)] shadow-inner group">
          <img
            src={post.mediaUrl}
            alt="Post media"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            className="w-full max-h-[500px] object-cover group-hover:scale-[1.03] transition-transform duration-1000"
          />
        </div>
      )}

      {/* Embedded Tagged Commercial Item Card */}
      {post.taggedProduct && (
        <div 
          onClick={handleProductClick}
          className="rounded-2xl p-3 sm:p-4 bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-3 sm:gap-4 shadow-sm hover:shadow-md hover:border-[var(--pm-accent)] transition-all cursor-pointer group active-scale"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 shadow-sm ring-1 ring-[var(--pm-border)]">
              <img
                src={post.taggedProduct.image}
                alt={post.taggedProduct.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--pm-accent)]">
                  {post.taggedProduct.category}
                </span>
                <span aria-hidden="true" className="text-[var(--pm-muted)] text-[10px]">·</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/u/${normalizeHandle(post.taggedProduct?.storeHandle || post.taggedProduct?.storeName)}`);
                  }}
                  className="text-[10px] font-bold text-[var(--pm-muted)] hover:text-[var(--pm-accent)] hover:underline cursor-pointer truncate"
                >
                  {post.taggedProduct.storeName}
                </button>
              </div>
              <h5 className="text-[14px] font-black text-[var(--pm-text)] truncate group-hover:text-[var(--pm-accent)] transition-colors">
                {post.taggedProduct.title}
              </h5>
              <p className="text-[13px] font-mono font-black text-[var(--pm-text)] mt-0.5">
                ৳{post.taggedProduct.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {linkedProduct && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(linkedProduct);
                }}
                className="w-10 h-10 rounded-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] flex items-center justify-center shadow-lg transition-all active-scale cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Demand & Used Product CTA Bar */}
      {(post.postType === 'demand' || post.postType === 'sale') && (
        <div className="space-y-3 pt-2">
          {sentNotice && (
            <div className="p-3 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/25 text-[var(--pm-success)] text-xs font-black text-center animate-scale-in">
              {sentNotice}
            </div>
          )}
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => {
                const msg = post.postType === 'demand' ? 'Proposal sent to buyer!' : 'Message sent to seller!';
                setSentNotice(msg);
                setTimeout(() => setSentNotice(null), 2500);
              }}
              className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active-scale shadow-lg cursor-pointer ${
                post.postType === 'demand' 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/30' 
                  : 'bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)]'
              }`}
            >
              {post.postType === 'demand' ? 'I Have This / Send Proposal' : 'Contact Seller'}
            </button>
            <button 
              type="button"
              onClick={handleShare}
              className="px-6 py-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[11px] font-black uppercase tracking-widest text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors active-scale cursor-pointer"
            >
              {copiedShare ? 'Copied' : 'Share'}
            </button>
          </div>
        </div>
      )}

      {/* Reaction Counts & Comment Summaries */}
      <div className="flex items-center justify-between text-[11px] font-bold text-[var(--pm-muted)] px-1 pt-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-[var(--pm-accent)] border-2 border-[var(--pm-card)] flex items-center justify-center text-[10px] shadow-sm">
              👍
            </div>
            <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-[var(--pm-card)] flex items-center justify-center text-[10px] shadow-sm">
              ❤️
            </div>
          </div>
          <span className="font-mono">{totalReactions.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="hover:text-[var(--pm-accent)] transition-colors cursor-pointer"
          >
            {post.comments.length} comments
          </button>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      {/* Interactive Action Bar (Like, Comment, Share) */}
      <div className="relative pt-3 border-t border-[var(--pm-border)] flex items-center justify-between">
        
        {/* Floating Reaction Hover Tray - Refined Glassmorphism */}
        {showReactionPicker && (
          <div 
            onMouseLeave={() => setShowReactionPicker(false)}
            className="absolute -top-12 left-0 pm-glass border border-[var(--pm-border)] rounded-full px-2 py-1.5 shadow-2xl flex items-center gap-3 z-20 animate-scale-in"
          >
            {(['like', 'love', 'care', 'haha', 'wow'] as ReactionType[]).map((rx) => (
              <button
                key={rx}
                type="button"
                onClick={() => {
                  onReact(post.id, rx);
                  setShowReactionPicker(false);
                }}
                className="hover:scale-150 active:scale-90 transition-all text-xl p-1 drop-shadow-sm cursor-pointer"
              >
                {rx === 'like' ? '👍' : rx === 'love' ? '❤️' : rx === 'care' ? '🥰' : rx === 'haha' ? '😂' : '😮'}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onMouseEnter={() => setShowReactionPicker(true)}
            onClick={() => onReact(post.id, post.userReaction === 'like' ? 'love' : 'like')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all active-scale cursor-pointer ${
              post.userReaction
                ? 'text-[var(--pm-accent)] bg-[var(--pm-accent-soft)]'
                : 'text-[var(--pm-muted)] hover:bg-[var(--pm-surface)] hover:text-[var(--pm-text)]'
            }`}
          >
            {post.userReaction === 'love' ? (
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            ) : (
              <ThumbsUp className={`w-4 h-4 ${post.userReaction ? 'fill-[var(--pm-accent)] text-[var(--pm-accent)]' : ''}`} />
            )}
            <span>{post.userReaction || 'Like'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-[var(--pm-muted)] hover:bg-[var(--pm-surface)] hover:text-[var(--pm-text)] transition-all active-scale cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Comment</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-[var(--pm-muted)] hover:bg-[var(--pm-surface)] hover:text-[var(--pm-text)] transition-all active-scale cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>{copiedShare ? 'Copied' : 'Share'}</span>
        </button>

      </div>

      {/* Comment Section - Refined */}
      {showComments && (
        <div className="pt-4 border-t border-[var(--pm-border)] space-y-4 animate-fade-in">
          
          {/* List of comments */}
          <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 px-1">
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[var(--pm-border)]"
                />
                <div className="flex-1 space-y-1">
                  <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl px-4 py-2.5">
                    <span className="text-[13px] font-black text-[var(--pm-text)] block mb-0.5">
                      {comment.authorName}
                    </span>
                    <p className="text-[13px] font-medium text-[var(--pm-text)] leading-normal">
                      {comment.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 px-2 text-[10px] font-black uppercase tracking-tighter text-[var(--pm-muted)]">
                    <button className="hover:text-[var(--pm-accent)] cursor-pointer">Like</button>
                    <button className="hover:text-[var(--pm-accent)] cursor-pointer">Reply</button>
                    <span>12h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* New Comment Input - Unified Look */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-3 pt-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[var(--pm-border)]"
            />
            <div className="relative flex-1">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-[var(--pm-input)] border border-[var(--pm-border)] rounded-full pl-4 pr-10 py-2.5 text-[13px] font-medium text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] focus:ring-2 focus:ring-[var(--pm-accent)]/20 outline-none"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center disabled:opacity-20 transition-all active-scale shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </div>
      )}

    </article>
  );
};
