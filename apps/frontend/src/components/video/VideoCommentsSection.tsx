import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Heart, Send, CornerDownRight, ChevronDown, 
  ChevronUp, CheckCircle2, User, Sparkles, MessageCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { NestedVideoComment } from '@/modules/video/types';
import { useAuth } from '@/modules/auth';

export interface VideoCommentsSectionProps {
  videoId: string;
  initialComments?: NestedVideoComment[];
  className?: string;
  isCollapsible?: boolean;
}

const DEFAULT_COMMENTS_MAP: Record<string, NestedVideoComment[]> = {
  'default': [
    {
      id: 'c1',
      videoId: 'v-whl-1',
      authorName: 'রহিম ট্রেডার্স (চকবাজার)',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      authorRole: 'ভেরিফায়েড আড়তদার',
      content: 'ভাই, ১০০ পিস জ্যাকার্ড পাঞ্জাবি কি সরাসরি ক্যাশ অন ডেলিভারিতে চকবাজারে পাওয়া যাবে?',
      timeAgo: '২ ঘণ্টা আগে',
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: 'c1-r1',
          videoId: 'v-whl-1',
          parentId: 'c1',
          authorName: 'Dhaka Creator Zone',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
          authorRole: 'ক্রিয়েটর সেলার',
          content: 'জি ভাই! পাইকারমার্ট এসক্রো সিকিউরড ক্যাশ অন ডেলিভারিতে চকবাজার ও ইসলামপুরে ১০০% হোম ডেলিভারি পাবেন।',
          timeAgo: '১ ঘণ্টা আগে',
          likes: 8,
          isLiked: true
        }
      ]
    },
    {
      id: 'c2',
      videoId: 'v-whl-1',
      authorName: 'সায়মা ফ্যাশন হাউজ',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120',
      authorRole: 'ভেরিফায়েড বায়ার',
      content: 'কাপড়ের ফেব্রিক জ্যাকার্ড সুতি নাকি মিক্সড কটন? ডেলিভারি কতদিন লাগবে?',
      timeAgo: '৩ ঘণ্টা আগে',
      likes: 5,
      isLiked: false,
      replies: []
    }
  ]
};

export const VideoCommentsSection: React.FC<VideoCommentsSectionProps> = ({
  videoId,
  initialComments,
  className = '',
  isCollapsible = false
}) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(!isCollapsible);

  // Load persisted comments per videoId from localStorage or defaults
  const storageKey = `pm_video_nested_comments_${videoId}`;
  const [comments, setComments] = useState<NestedVideoComment[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse comments from localStorage');
    }
    return initialComments || DEFAULT_COMMENTS_MAP[videoId] || DEFAULT_COMMENTS_MAP['default'];
  });

  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplyIds, setExpandedReplyIds] = useState<string[]>(['c1']);

  // Persist comments changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(comments));
    } catch (e) {
      console.warn('Failed to save comments');
    }
  }, [comments, storageKey]);

  // Total comment count including replies
  const countTotalComments = (list: NestedVideoComment[]): number => {
    return list.reduce((total, c) => total + 1 + (c.replies ? countTotalComments(c.replies) : 0), 0);
  };

  const totalCount = countTotalComments(comments);

  // Add top-level comment
  const handleAddTopComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: NestedVideoComment = {
      id: `comment-${Date.now()}`,
      videoId,
      parentId: null,
      authorName: user?.fullName || 'পাইকারমার্ট মেম্বার',
      authorAvatar: user?.avatar || user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
      authorRole: 'মেম্বার বায়ার',
      content: newCommentText.trim(),
      timeAgo: 'এখনই',
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
    toast.success('মন্তব্য সফলভাবে যোগ করা হয়েছে!');
  };

  // Add nested reply to a specific parent comment
  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const newReply: NestedVideoComment = {
      id: `reply-${Date.now()}`,
      videoId,
      parentId,
      authorName: user?.fullName || 'পাইকারমার্ট মেম্বার',
      authorAvatar: user?.avatar || user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
      authorRole: 'মেম্বার বায়ার',
      content: replyText.trim(),
      timeAgo: 'এখনই',
      likes: 0,
      isLiked: false,
      replies: []
    };

    const addReplyRecursive = (list: NestedVideoComment[]): NestedVideoComment[] => {
      return list.map(c => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply]
          };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: addReplyRecursive(c.replies)
          };
        }
        return c;
      });
    };

    setComments(addReplyRecursive(comments));
    setReplyText('');
    setReplyingToId(null);
    if (!expandedReplyIds.includes(parentId)) {
      setExpandedReplyIds([...expandedReplyIds, parentId]);
    }
    toast.success('রিপ্লাই সফলভাবে যোগ করা হয়েছে!');
  };

  // Toggle like on a comment or nested reply
  const handleToggleLikeComment = (commentId: string) => {
    const toggleLikeRecursive = (list: NestedVideoComment[]): NestedVideoComment[] => {
      return list.map(c => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
          };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: toggleLikeRecursive(c.replies)
          };
        }
        return c;
      });
    };

    setComments(toggleLikeRecursive(comments));
  };

  const toggleExpandReplies = (commentId: string) => {
    if (expandedReplyIds.includes(commentId)) {
      setExpandedReplyIds(expandedReplyIds.filter(id => id !== commentId));
    } else {
      setExpandedReplyIds([...expandedReplyIds, commentId]);
    }
  };

  // Single Comment Item Renderer (Recursive for Nested Replies)
  const renderCommentItem = (comment: NestedVideoComment, depth = 0) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isRepliesExpanded = expandedReplyIds.includes(comment.id);
    const isReplying = replyingToId === comment.id;

    return (
      <div key={comment.id} className="space-y-2">
        <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-white/5 space-y-2 hover:border-white/15 transition-all">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={comment.authorAvatar} 
                alt={comment.authorName} 
                className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex items-center gap-2">
                <span className="text-xs font-black text-white truncate">{comment.authorName}</span>
                {comment.authorRole && (
                  <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] font-bold text-amber-300 shrink-0 border border-white/10">
                    {comment.authorRole}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium shrink-0">{comment.timeAgo}</span>
          </div>

          {/* Comment Body */}
          <p className="text-xs text-zinc-200 leading-relaxed font-normal pl-9">
            {comment.content}
          </p>

          {/* Action Row: Like & Reply */}
          <div className="flex items-center gap-4 pl-9 pt-1 text-[11px]">
            <button
              onClick={() => handleToggleLikeComment(comment.id)}
              className={`flex items-center gap-1 font-bold cursor-pointer transition-colors ${
                comment.isLiked ? 'text-rose-500 font-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likes}</span>
            </button>

            <button
              onClick={() => {
                if (isReplying) setReplyingToId(null);
                else {
                  setReplyingToId(comment.id);
                  setReplyText('');
                }
              }}
              className="text-zinc-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <CornerDownRight className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>উত্তর দিন</span>
            </button>

            {hasReplies && (
              <button
                onClick={() => toggleExpandReplies(comment.id)}
                className="text-[#FF7A00] font-bold flex items-center gap-1 cursor-pointer hover:underline"
              >
                <span>{isRepliesExpanded ? 'রিপ্লাই লুকান' : `রিপ্লাই দেখুন (${comment.replies?.length})`}</span>
                {isRepliesExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>

        {/* Inline Reply Form Box */}
        <AnimatePresence>
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="ml-6 pl-3 border-l-2 border-[#FF7A00]/50 pt-2"
            >
              <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-white/10">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddReply(comment.id);
                  }}
                  placeholder={`${comment.authorName}-কে উত্তর লিখুন...`}
                  className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none px-2"
                  autoFocus
                />
                <button
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyText.trim()}
                  className="p-1.5 rounded-lg bg-[#FF7A00] text-white disabled:opacity-40 cursor-pointer hover:bg-[#e06b00] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested Replies Rendering Thread */}
        {hasReplies && isRepliesExpanded && (
          <div className="ml-6 pl-3 border-l-2 border-white/10 space-y-2 mt-2">
            {comment.replies!.map(reply => renderCommentItem(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-4 text-white ${className}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-[#FF7A00]/20 text-[#FF7A00]">
            <MessageSquare className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <span>কমিউনিটি ডিসকাশন ও কমেন্ট</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-amber-300 font-mono font-bold">
              {totalCount}টি
            </span>
          </h3>
        </div>

        {isCollapsible && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Post New Top-Level Comment Form */}
          <form onSubmit={handleAddTopComment} className="flex items-center gap-2.5">
            <img 
              src={user?.avatar || user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'} 
              alt="My Avatar" 
              className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 flex items-center bg-zinc-900 border border-white/10 rounded-2xl px-3.5 py-2 focus-within:border-[#FF7A00] transition-colors">
              <input 
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="পাবলিক মন্তব্য বা পাইকারি অনুসন্ধানের প্রস্তাব দিন..."
                className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="p-1.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white disabled:opacity-40 transition-all active:scale-95 cursor-pointer ml-2"
                title="পাবলিশ করুন"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Comments List Thread */}
          <div className="space-y-3 pt-1">
            {comments.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/40 rounded-2xl border border-dashed border-white/10 text-zinc-400 text-xs">
                এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্য করুন!
              </div>
            ) : (
              comments.map(c => renderCommentItem(c))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCommentsSection;
