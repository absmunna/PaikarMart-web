import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Heart, Share2, MapPin, 
  MoreHorizontal, Plus, Image as ImageIcon, 
  Video, Calendar, AlertCircle, Tag,
  ThumbsUp, Send, UserCircle, Search,
  Loader2
} from 'lucide-react';
import { LocalPost } from '../types';
import { cn } from '@/lib/utils';

export const NeighborhoodFeed: React.FC = () => {
  const [posts, setPosts] = useState<LocalPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'update' | 'demand' | 'alert'>('all');
  const [isPosting, setIsPosting] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/local/feed');
        const result = await response.json();
        if (result.status === 'success') {
          setPosts(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch local feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const filteredPosts = posts.filter(post => 
    activeFilter === 'all' ? true : post.type === activeFilter
  );

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: LocalPost = {
      id: `p${Date.now()}`,
      author: {
        name: 'You (Guest)',
        isVerified: false,
        role: 'Resident'
      },
      content: newPostContent,
      type: 'update',
      location: 'Current Location',
      timestamp: 'Just now',
      stats: { likes: 0, comments: 0, shares: 0 }
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setIsPosting(false);
  };

  return (
    <div className="space-y-6">
      {/* Feed Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(['all', 'update', 'demand', 'alert'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border",
              activeFilter === filter 
                ? "bg-cyan-500 text-black border-cyan-500 shadow-lg shadow-cyan-500/20" 
                : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Post Composer */}
      <div className="bg-zinc-900 border border-white/5 rounded-3xl p-4 shadow-xl">
        {!isPosting ? (
          <div 
            onClick={() => setIsPosting(true)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-zinc-500" />
            </div>
            <div className="flex-1 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 text-zinc-500 text-sm">
              What's happening in your neighborhood?
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <textarea
              autoFocus
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's happening in your neighborhood?"
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-zinc-500 min-h-[100px] resize-none"
            />
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex gap-2">
                <button className="p-2 bg-white/5 rounded-xl text-zinc-400 hover:text-cyan-400 transition-colors">
                  <ImageIcon size={20} />
                </button>
                <button className="p-2 bg-white/5 rounded-xl text-zinc-400 hover:text-cyan-400 transition-colors">
                  <Video size={20} />
                </button>
                <button className="p-2 bg-white/5 rounded-xl text-zinc-400 hover:text-cyan-400 transition-colors">
                  <MapPin size={20} />
                </button>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsPosting(false)}
                  className="px-4 py-2 text-zinc-500 font-bold text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handlePostSubmit}
                  disabled={!newPostContent.trim()}
                  className="px-6 py-2 bg-cyan-500 text-black font-black uppercase text-xs tracking-wider rounded-xl hover:bg-cyan-400 disabled:opacity-50 transition-all"
                >
                  Post
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            <p className="text-zinc-500 text-sm font-medium">Loading local feed...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
            <motion.div
              layout
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "bg-zinc-900 border rounded-3xl p-5 space-y-4 shadow-sm",
                post.type === 'alert' ? "border-rose-500/20 bg-rose-500/[0.02]" : "border-white/5"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <UserCircle className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">{post.author.name}</h4>
                      {post.author.isVerified && <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"><Plus size={8} className="text-white" /></div>}
                      <span className="text-[10px] bg-white/5 text-zinc-500 px-1.5 py-0.5 rounded uppercase font-bold">{post.author.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] mt-0.5 font-bold">
                      <span className="flex items-center gap-1"><MapPin size={10} className="text-cyan-500" /> {post.location}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>
                <button className="text-zinc-600 hover:text-white transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <p className="text-zinc-200 text-sm leading-relaxed">
                {post.content}
              </p>

              {post.tags && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-6">
                  <button className="flex items-center gap-2 text-zinc-500 hover:text-cyan-400 transition-colors group">
                    <ThumbsUp size={18} className="group-active:scale-125 transition-transform" />
                    <span className="text-xs font-bold">{post.stats.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-zinc-500 hover:text-cyan-400 transition-colors">
                    <MessageSquare size={18} />
                    <span className="text-xs font-bold">{post.stats.comments}</span>
                  </button>
                </div>
                <button className="text-zinc-500 hover:text-white transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <MessageSquare className="w-12 h-12 text-zinc-700" />
            <p className="text-zinc-500 text-sm font-medium">No posts found in this neighborhood.</p>
          </div>
        )}
      </div>
    </div>
  );
};
