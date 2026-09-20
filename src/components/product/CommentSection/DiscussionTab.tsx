import React, { useState } from 'react';
import { MessageSquare, User, Clock, Heart } from 'lucide-react';
import { useLanguage } from '@/features/language/LanguageContext';
import { toast } from 'sonner';

export interface DiscussionPost {
  id: string;
  author: string;
  comment: string;
  date: string;
  likes: number;
}

export interface DiscussionTabProps {
  productId: string;
  initialDiscussion?: DiscussionPost[];
}

export const DiscussionTab: React.FC<DiscussionTabProps> = ({ productId, initialDiscussion = [] }) => {
  const { isBn } = useLanguage();
  const [posts, setPosts] = useState<DiscussionPost[]>(initialDiscussion.length > 0 ? initialDiscussion : [
    {
      id: 'disc-1',
      author: 'Afnan Majid',
      comment: 'কালার অপশনগুলো কি কি আছে? ব্ল্যাক বা নেভি ব্লু স্টক এ আছে?',
      date: 'June 21, 2026',
      likes: 3
    },
    {
      id: 'disc-2',
      author: 'Zarin Tasnim',
      comment: 'ঢাকার বাইরে কুরিয়ার দিয়ে পেতে কতদিন লাগবে?',
      date: 'June 20, 2026',
      likes: 1
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newPost: DiscussionPost = {
      id: `disc-${Date.now()}`,
      author: 'User',
      comment: newComment,
      date: isBn ? 'আজ' : 'Today',
      likes: 0
    };

    setPosts([newPost, ...posts]);
    setNewComment('');
    toast.success(isBn ? 'আপনার মন্তব্যটি সফলভাবে প্রকাশ করা হয়েছে!' : 'Comment posted successfully!');
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="space-y-6">
      {/* Post Form */}
      <form onSubmit={handlePost} className="bg-zinc-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
        <div>
          <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-2 block">
            {isBn ? "আলোচনা করুন" : "Join the Discussion"}
          </label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={isBn ? "পণ্যটি সম্পর্কে যেকোনো সাধারণ প্রশ্ন বা মন্তব্য লিখুন..." : "Post a general query, comment, or thought..."}
            className="w-full h-20 bg-zinc-900 border border-white/5 rounded-xl p-3 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="h-9 px-4 bg-cyan-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-cyan-300 transition-colors min-h-[44px]"
          >
            {isBn ? "পোস্ট করুন" : "Post Comment"}
          </button>
        </div>
      </form>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <h5 className="text-white text-xs font-black tracking-tight">{p.author}</h5>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {p.date}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleLike(p.id)}
                className="h-8 px-2.5 bg-white/5 border border-white/5 text-[9px] text-zinc-400 hover:text-rose-400 rounded-lg flex items-center gap-1 transition-colors min-h-[44px]"
              >
                <Heart size={10} className="fill-current text-rose-500" />
                <span>{p.likes}</span>
              </button>
            </div>

            <p className="text-[11.5px] text-zinc-300 leading-relaxed font-medium pl-1">{p.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
