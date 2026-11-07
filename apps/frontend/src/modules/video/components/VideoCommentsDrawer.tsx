import React, { useState } from 'react';
import { X, Send, Heart, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { VideoComment } from '../types';

interface VideoCommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  commentsCount?: number;
}

const INITIAL_COMMENTS: VideoComment[] = [
  {
    id: 'c1',
    videoId: 'v1',
    authorName: 'তানভীর আহমেদ',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    content: 'ভিডিওতে কাপড় ও সুইংয়ের ফিনিশিং অসাধারণ লাগছে! ১০ পিসের বান্ডেল এখনই অর্ডার করলাম।',
    timeAgo: '১ ঘণ্টা আগে',
    likes: 18
  },
  {
    id: 'c2',
    videoId: 'v1',
    authorName: 'ফারুক ট্রেডার্স (বগুড়া)',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
    content: 'কুরিয়ারে চট্টগ্রাম ও উত্তরবঙ্গে ডেলিভারি কয়দিনে পাওয়া যায় ভাই?',
    timeAgo: '২ ঘণ্টা আগে',
    likes: 6
  },
  {
    id: 'c3',
    videoId: 'v1',
    authorName: 'সাদিয়া সুলতানা',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    content: 'রং পাকা তো? আমি গত সপ্তাহে অন্য জায়গা থেকে নিয়ে ঠকেছি।',
    timeAgo: '৩ ঘণ্টা আগে',
    likes: 12
  }
];

export const VideoCommentsDrawer: React.FC<VideoCommentsDrawerProps> = ({
  isOpen,
  onClose,
  videoId,
  commentsCount = 3
}) => {
  const [comments, setComments] = useState<VideoComment[]>(INITIAL_COMMENTS);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newComment: VideoComment = {
      id: `c-${Date.now()}`,
      videoId,
      authorName: 'আপনি',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      content: inputText.trim(),
      timeAgo: 'এখনই',
      likes: 0
    };

    setComments([newComment, ...comments]);
    setInputText('');
    toast.success("মন্তব্য যুক্ত হয়েছে!");
  };

  const handleLike = (id: string) => {
    setComments(comments.map(c => {
      if (c.id === id) {
        return {
          ...c,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1,
          isLiked: !c.isLiked
        };
      }
      return c;
    }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full sm:max-w-md bg-[#131522] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl h-[70vh] sm:h-[600px] flex flex-col shadow-2xl text-white overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#FF7A00]" />
              <h3 className="font-black text-sm text-white">মন্তব্যসমূহ ({comments.length})</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comments list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 text-xs">
                <img 
                  src={comment.authorAvatar} 
                  alt={comment.authorName} 
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10 mt-0.5"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 bg-white/[0.04] p-3 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{comment.authorName}</span>
                    <span className="text-[10px] text-zinc-500">{comment.timeAgo}</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-xs">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px]">
                    <button 
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1 cursor-pointer transition-colors ${
                        comment.isLiked ? 'text-rose-500' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-[#0e101a] flex items-center gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="একটি সুন্দর মন্তব্য লিখুন..."
              className="flex-1 px-4 py-2.5 rounded-full bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-full bg-[#FF7A00] hover:bg-[#e06b00] text-white transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
