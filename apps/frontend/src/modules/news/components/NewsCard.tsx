import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Share2, 
  MessageSquare, 
  Bookmark, 
  Clock, 
  Eye, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Flower2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NewsArticleType {
  id: string;
  title: string;
  titleBn: string;
  summary: string;
  summaryBn: string;
  content: string;
  contentBn: string;
  imageUrl: string;
  category: string;
  categoryLabel: string;
  categoryLabelBn: string;
  source: string;
  sourceLogo?: string;
  author: string;
  publishedAt: string;
  readTime: string;
  readTimeBn: string;
  views: number;
  initialLikes: number;
  isPremium?: boolean;
}

interface NewsCardProps {
  article: NewsArticleType;
}

export const NewsCard = React.forwardRef<HTMLDivElement, NewsCardProps>(({ article }, ref) => {
  const [likes, setLikes] = useState(article.initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<{ id: number; author: string; text: string; time: string }[]>([
    { id: 1, author: 'Kamal Hasan', text: 'পাইকারি উদ্যোক্তাদের জন্য দারুন খবর! অত্যন্ত সময়োপযোগী কাজ।', time: '5m' },
    { id: 2, author: 'Fariha Jannat', text: 'জামদানী নিয়ে এই ফিচারটা অনেক চমৎকার লাগলো। দেশি কাপড়ের জয় হোক।', time: '12m' }
  ]);
  const [newComment, setNewComment] = useState('');

  const toggleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [
      {
        id: Date.now(),
        author: 'You (Paikar Member)',
        text: newComment,
        time: 'Just now'
      },
      ...prev
    ]);
    setNewComment('');
  };

  return (
    <motion.article 
      ref={ref}
      layout
      className={cn(
        "group relative overflow-hidden rounded-[2.5rem] bg-white/[0.02] border border-white/5 shadow-2xl transition-all duration-500 hover:border-[var(--pm-accent)]/30 hover:bg-white/[0.03]",
        article.isPremium && "border-amber-500/30 hover:border-amber-500/50"
      )}
    >
      {/* Jamdani Corner Accent Pattern (Decorative Icons) */}
      <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity overflow-hidden p-4">
        <Flower2 className="w-full h-full text-amber-500/40 rotate-12" />
      </div>

      <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none opacity-10 group-hover:opacity-30 transition-opacity overflow-hidden p-4">
        <Sparkles className="w-full h-full text-[var(--pm-accent)]/40 -rotate-12" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* Magazine Cover Visual Block */}
        <div className="md:w-2/5 shrink-0 relative aspect-[16/10] md:aspect-square rounded-3xl overflow-hidden group/img">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Main Category Badge */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={cn(
              "px-3.5 py-1.5 rounded-2xl text-[10px] uppercase font-black tracking-widest backdrop-blur-md shadow-md text-white border border-white/10",
              article.isPremium 
                ? "bg-gradient-to-r from-amber-500 to-yellow-600 border-amber-400/20" 
                : "bg-[var(--pm-accent)]/80 border-[var(--pm-accent)]/20"
            )}>
              {article.categoryLabelBn}
            </span>
            {article.isPremium && (
              <span className="flex items-center gap-1 px-3 py-1 bg-black/60 border border-amber-500/40 rounded-2xl text-[9px] font-bold text-amber-400 tracking-wider backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-amber-400" /> Premium
              </span>
            )}
          </div>

          {/* Quick Metrics Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90 text-xs font-semibold">
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-xl">
              <Clock className="w-3.5 h-3.5 text-[var(--pm-accent)]/80" />
              <span>{article.readTimeBn}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-xl">
              <Eye className="w-3.5 h-3.5 text-[var(--pm-accent)]/80" />
              <span>{article.views + (hasLiked ? 1 : 0)} ভিউ</span>
            </div>
          </div>
        </div>

        {/* Content Details Block */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Publisher Info */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[var(--pm-accent)]/10 border border-[var(--pm-accent)]/20 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
              </div>
              <span className="text-xs text-[var(--pm-accent)] font-bold uppercase tracking-wider">{article.source}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-500 font-medium">{article.publishedAt}</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-xl md:text-2xl font-black text-white hover:text-[var(--pm-accent)] transition-colors tracking-tight leading-tight italic">
              {article.titleBn}
            </h2>
            <p className="text-xs text-zinc-500 font-medium tracking-wide">
              {article.title}
            </p>

            {/* Article Summary or Content */}
            <div className="text-sm text-zinc-400 font-medium leading-relaxed pt-1">
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="full-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-[var(--pm-accent)]/80 font-semibold mb-2">{article.summaryBn}</p>
                    <p className="whitespace-pre-line leading-loose text-zinc-300">{article.contentBn}</p>
                    {article.content && (
                      <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 mt-4">
                        <span className="text-[10px] text-zinc-500 font-black tracking-widest uppercase block mb-1">ENGLISH VERSION</span>
                        <p className="text-xs italic text-zinc-400 leading-relaxed">{article.content}</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <p className="line-clamp-3 md:line-clamp-4">
                    {article.summaryBn}
                  </p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Expand Details Arrow and Actions Panel */}
          <div className="flex flex-col gap-4 pt-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="self-start flex items-center gap-1 text-xs font-black text-[var(--pm-accent)] hover:opacity-80 transition-colors focus:outline-none uppercase tracking-wider"
            >
              <span>{isExpanded ? 'সংক্ষিপ্ত করুন' : 'বিস্তারিত খবর পড়ুন'}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4 animate-bounce" /> : <ChevronDown className="w-4 h-4 animate-bounce" />}
            </button>

            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              {/* Like / Clap reaction */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleLike}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors font-bold text-xs cursor-pointer",
                    hasLiked 
                      ? "bg-rose-500/15 text-rose-500" 
                      : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                  )}
                  aria-label="Like news"
                >
                  <Heart className={cn("w-4 h-4", hasLiked && "fill-rose-500")} />
                  <span>{likes}</span>
                </button>

                {/* Comment Toggle */}
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors font-bold text-xs cursor-pointer",
                    showComments
                      ? "bg-[var(--pm-accent)]/15 text-[var(--pm-accent)]" 
                      : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                  )}
                  aria-label="Toggle comments"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{comments.length}</span>
                </button>
              </div>

              {/* Share & Bookmark */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleShare}
                  className={cn(
                    "p-2 rounded-full transition-colors cursor-pointer",
                    isCopied 
                      ? "bg-[var(--pm-accent)]/20 text-[var(--pm-accent)]" 
                      : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                  )}
                  title="Copy news link"
                  aria-label="Share news"
                >
                  {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={cn(
                    "p-2 rounded-full transition-colors cursor-pointer",
                    isBookmarked 
                      ? "bg-amber-500/20 text-amber-400" 
                      : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                  )}
                  title="Bookmark news"
                  aria-label="Bookmark news"
                >
                  <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-amber-400")} />
                </button>
              </div>
            </div>

            {/* Comments Thread with dynamic styling */}
            <AnimatePresence>
              {showComments && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-white/5 pt-4 space-y-4"
                >
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input 
                      type="text" 
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="মন্তব্য লিখুন..." 
                      className="flex-1 bg-white/5 text-xs text-white placeholder-zinc-500 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)] border border-white/5"
                    />
                    <button 
                      type="submit" 
                      className="px-4 py-2.5 bg-[var(--pm-accent)] hover:opacity-90 text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
                    >
                      আপলোড
                    </button>
                  </form>

                  <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar pr-1">
                    {comments.map((comm) => (
                      <div key={comm.id} className="p-3 bg-white/[0.01] rounded-2xl border border-white/5 space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-[var(--pm-accent)] font-extrabold">{comm.author}</span>
                          <span className="text-zinc-500 font-medium">{comm.time}</span>
                        </div>
                        <p className="text-xs text-zinc-300 font-medium leading-relaxed">{comm.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

NewsCard.displayName = 'NewsCard';
