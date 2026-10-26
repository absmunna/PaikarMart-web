import React, { useState } from 'react';
import { 
  Share2, Heart, MessageCircle, ArrowLeft, Plus, Image, Globe, CheckCircle, 
  Tag, Send, MessageSquare, Megaphone, CheckCircle2, Factory, Sparkles
} from 'lucide-react';
import { B2BPost } from '@/modules/b2b/types/b2bTypes';
import { MOCK_B2B_POSTS } from '@/modules/b2b/store/useB2BFeedStore';

interface B2BTradeFeedViewProps {
  onNavigate: (view: string, id?: string) => void;
  onBack: () => void;
  onNotify: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export const B2BTradeFeedView: React.FC<B2BTradeFeedViewProps> = ({ 
  onNavigate, 
  onBack,
  onNotify
}) => {
  const [posts, setPosts] = useState<B2BPost[]>(MOCK_B2B_POSTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'product_launch' | 'bulk_offer' | 'trade_announcement'>('all');

  // New post trigger
  const [showCompose, setShowCompose] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'product_launch' | 'bulk_offer' | 'trade_announcement'>('product_launch');
  const [postImageUrl, setPostImageUrl] = useState('');

  // Likes structure map tracker
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  
  // Comment panel states
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [postCommentsMap, setPostCommentsMap] = useState<{[key: string]: Array<{author: string; content: string; date: string}>}>(
    {
      'bp-101': [
        { author: 'অরবিট টেক্সটাইল মার্চেন্ডাইজিং', content: 'রিলিজ হওয়া গজ ডেনিমের কাপড়টির কালার ফার্স্ট সার্টিফিকেট রেডি আছে?', date: '২ ঘণ্টা আগে' }
      ]
    }
  );

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedPosts.includes(id)) {
      setLikedPosts(prev => prev.filter(x => x !== id));
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes - 1 } : p));
    } else {
      setLikedPosts(prev => [...prev, id]);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
      onNotify('পোস্টটি লাইক করা হয়েছে!', 'success');
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      onNotify('পোস্টের শিরোনাম এবং বিস্তারিত তথ্য আবশ্যক!', 'warning');
      return;
    }

    const defaultImages = {
      product_launch: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
      bulk_offer: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&auto=format&fit=crop',
      trade_announcement: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100&auto=format&fit=crop'
    };

    const added: B2BPost = {
      id: `post-custom-${Date.now()}`,
      authorName: 'মেসার্স নিজ ম্যানুফ্যাকচারিং লিমিটেড',
      authorRole: 'Factory Owner (Dhanmondi HQ)',
      authorLogo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop',
      type: postType,
      title: postTitle,
      content: postContent,
      image: postImageUrl || defaultImages[postType],
      likes: 0,
      comments: 0,
      date: 'আজকে কিছুক্ষণ আগে'
    };

    setPosts([added, ...posts]);
    onNotify('আপনার ইন্ডাস্ট্রি আপডেট পোস্টটি পাবলিশ হয়েছে!', 'success');
    setShowCompose(false);

    setPostTitle('');
    setPostContent('');
    setPostImageUrl('');
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      author: 'নিজ মার্চেন্ডাইজিং ফার্ম (Self)',
      content: commentInput,
      date: 'এখনই'
    };

    const commentsForPost = postCommentsMap[postId] ? [...postCommentsMap[postId], newComment] : [newComment];
    setPostCommentsMap({ ...postCommentsMap, [postId]: commentsForPost });

    // increment comment count
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    setCommentInput('');
    onNotify('আপনার কমেন্টটি সফলভাবে পোস্ট হয়েছে!', 'success');
  };

  const handleShare = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/b2b/feed#${id}`);
      onNotify('শেয়ার লিংক ক্লিপবোর্ডে কপি করা হয়েছে!', 'success');
    } else {
      onNotify(`পোস্ট শেয়ার স্ট্যাটাস: ${title}`, 'success');
    }
  };

  const filteredPosts = posts.filter(p => activeFilter === 'all' || p.type === activeFilter);

  return (
    <div className="space-y-5 text-[#c5c6c7]">
      {/* Header back & navigation */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 border border-white/5 bg-white/5 rounded-xl text-white/80 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-extrabold flex items-center">Portal Main</span>
        </button>
        <span className="text-[11px] text-[var(--pm-text-secondary)] font-bold uppercase tracking-wider">Industrial Feed ({filteredPosts.length} posts)</span>
      </div>

      {/* Grid wrapper for desktop scale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Main Feed stream (Col-span 8 on LG) */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. Header Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/25 to-transparent border border-white/5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> B2B Commerce Feed
              </h2>
              <p className="text-[10px] text-white/50 leading-relaxed mt-0.5">
                বাংলাদেশের পাইকারি বাজার, ল্যান্ড পোর্ট ইমপোর্ট আপডেট এবং কটন স্পিনিং সুতার রেট ও নতুন লট খালাসের লাইভ ঘোষণা সমূহ ট্র্যাক করুন।
              </p>
            </div>
            <button
              onClick={() => setShowCompose(!showCompose)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10.5px] rounded-xl flex items-center gap-1.5 shrink-0 shadow-lg tracking-wider transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" /> WRITE POST
            </button>
          </div>

          {/* 2. Compose announcement box */}
          {showCompose && (
            <form onSubmit={handlePostSubmit} className="p-4 rounded-3xl border space-y-3.5 bg-[var(--pm-surface)]" style={{ borderColor: 'var(--pm-border)' }}>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1"><Megaphone className="w-3.5 h-3.5 text-orange-400" /> Compose Trade Broadcast</h3>
                <button type="button" onClick={() => setShowCompose(false)} className="text-[10px] text-rose-400 font-extrabold hover:underline">
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[9.5px] text-white/50 font-black uppercase">Broadcasting Type</label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="product_launch">New Launch (নতুন লট)</option>
                    <option value="bulk_offer">Bulk Liquidation (ডিসকাউন্ট অফার)</option>
                    <option value="trade_announcement">Notice (সাধারণ নোটিশ)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] text-white/50 font-black uppercase">Optional Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash..."
                    value={postImageUrl}
                    onChange={(e) => setPostImageUrl(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-white/5 bg-black/40 outline-none text-white focus:border-[var(--pm-accent)]/40"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] text-white/50 font-black uppercase">Headline / Subject *</label>
                <input
                  type="text"
                  placeholder="যেমন: ১২ আউন্স এক্সপোর্ট কটন ডেনিম টুইল লট রেডি"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl border border-white/5 bg-black/40 outline-none text-white focus:border-[var(--pm-accent)]/50 font-extrabold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] text-white/50 font-black uppercase">Post Details / Body *</label>
                <textarea
                  placeholder="আপনার রিলিজকৃত লটের বা স্পেশাল ডিসকাউন্ট ডেইটের বাজেট, মিনিমাম MOQ, ল্যান্ডিং পোর্ট বিস্তারিত বর্ণনা করুন..."
                  rows={3}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl border border-white/5 bg-black/40 outline-none text-white focus:border-[var(--pm-accent)]/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white font-extrabold text-xs rounded-xl tracking-wider transition active:scale-95 shadow-md"
              >
                BROADCAST INDUSTRY NOTICE NOW
              </button>
            </form>
          )}

          {/* 3. Filtering Tabs for Posts */}
          <div className="flex overflow-x-auto hide-scrollbar p-1 bg-white/5 rounded-2xl gap-1.5 shrink-0">
            {[
              { id: 'all', label: 'All Updates' },
              { id: 'product_launch', label: 'New Product Lot' },
              { id: 'bulk_offer', label: 'Warehouse Clearances' },
              { id: 'trade_announcement', label: 'Trade Notices' }
            ].map(sh => (
              <button
                key={sh.id}
                onClick={() => setActiveFilter(sh.id as any)}
                className={`flex-1 text-center py-2 px-3.5 rounded-xl text-xs font-black whitespace-nowrap ${
                  activeFilter === sh.id 
                    ? 'bg-[#1f2833] text-white shadow-sm' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {sh.label}
              </button>
            ))}
          </div>

          {/* 4. Display Feed Posts list */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                <p className="text-xs font-black text-white/50">রোল বা নোটিশ ক্যাটাগরিতে কোনো পোস্ট পাওয়া যায়নি।</p>
              </div>
            ) : (
              filteredPosts.map(post => {
                const hasLiked = likedPosts.includes(post.id);
                const commentsList = postCommentsMap[post.id] || [];
                const showComments = activeCommentsPostId === post.id;

                return (
                  <div
                    key={post.id}
                    className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl overflow-hidden p-4 space-y-3.5"
                  >
                    {/* Author row */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-2.5">
                        <img src={post.authorLogo} alt={post.authorName} className="w-10 h-10 rounded-xl object-cover border border-white/5" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="text-xs font-black text-white leading-normal flex items-center gap-1">
                            {post.authorName}
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 fill-none" />
                          </h4>
                          <span className="text-[10px] text-[var(--pm-text-secondary)] font-semibold mt-0.5 block">{post.authorRole}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[var(--pm-text-secondary)] font-bold">{post.date}</span>
                    </div>

                    {/* Post main body */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[8.5px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 rounded font-black uppercase tracking-wider">
                          {post.type.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="text-xs font-black text-white leading-snug">{post.title}</h3>
                      <p className="text-xs text-[var(--pm-text-secondary)] leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>

                    {/* Optional visual image attachment */}
                    {post.image && (
                      <div className="h-44 w-full rounded-xl overflow-hidden bg-black/20 border border-white/5">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Post micro interactions buttons footer of single post */}
                    <div className="flex items-center justify-between pt-3.5 mt-2 border-t border-white/5 text-[11px] text-[var(--pm-text-secondary)]">
                      <button
                        onClick={(e) => handleLike(post.id, e)}
                        className={`flex items-center gap-1 font-black ${hasLiked ? 'text-rose-500 hover:text-rose-400' : 'hover:text-white'}`}
                      >
                        <Heart className={`w-4 h-4 mr-0.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>Like ({post.likes || 0})</span>
                      </button>

                      <button
                        onClick={() => setActiveCommentsPostId(showComments ? null : post.id)}
                        className="flex items-center gap-1 font-bold hover:text-white"
                      >
                        <MessageCircle className="w-4 h-4 mr-0.5 text-cyan-400" />
                        <span>Inquiries ({post.comments || commentsList.length})</span>
                      </button>

                      <button
                        onClick={(e) => handleShare(post.id, post.title, e)}
                        className="flex items-center gap-1 font-bold hover:text-white"
                      >
                        <Share2 className="w-4 h-4 mr-0.5" />
                        <span>Share info</span>
                      </button>
                    </div>

                    {/* Expandable comments drawer panel inside card */}
                    {showComments && (
                      <div className="pt-3 border-t border-white/5 space-y-3">
                        {commentsList.length > 0 && (
                          <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                            {commentsList.map((comm, idx) => (
                              <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs space-y-1">
                                <div className="flex justify-between items-center text-[10px] text-white/50 font-bold">
                                  <span>{comm.author}</span>
                                  <span>{comm.date}</span>
                                </div>
                                <p className="font-medium text-white/90 leading-relaxed">{comm.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Submit Comment form */}
                        <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="অর্ডার বা সুতার কাউন্টার ইনফো নিয়ে প্রশ্ন করুন..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="flex-1 bg-black/40 rounded-xl p-2.5 pl-3 border border-white/10 text-xs text-white outline-none focus:border-[var(--pm-accent)]/40 placeholder-white/20"
                          />
                          <button type="submit" className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center shrink-0 transition">
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Desktop Sidebar (Live Bangladesh Wholesale Indices Tracker) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-4.5 sticky top-52">
          
          {/* Market Indices Tracker */}
          <div className="rounded-2xl border p-4.5 bg-[var(--pm-surface)] border-[var(--pm-border)] space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[11px] font-black tracking-widest text-[#f97316] uppercase flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block"></span>
                BD WHOLESALE INDEX (LIVE)
              </span>
              <span className="text-[9px] text-white/40">Zonal Yards</span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: '30s Carded Cotton Yarn (Narayanganj)', price: '৳ ১৮৩/পাউন্ড', change: '+৳ ১.২৫', isUp: true, hub: 'BSCIC Yarn Mokam' },
                { name: '160 GSM Combed Cotton Roll (Narsingdi)', price: '৳ ৩৫০/কেজি', change: '-৳ ২.০০', isUp: false, hub: 'Baburhat Wholesale' },
                { name: '12oz Twill Indigo Denim (Dhaka Yard)', price: '৳ ১৮৫/গজ', change: '+৳ ০.৫০', isUp: true, hub: 'Savar Factory Gate' },
                { name: 'Miniquet Rice (Agro Bulk Kushtia)', price: '৳ ৫,৪০০/বস্তা (৫০ কেজি)', change: '+৳ ৫০.০০', isUp: true, hub: 'Mokam Sourcing' },
                { name: 'Imported Soyabean Oil (Khatunganj)', price: '৳ ৭,২৫০/মণ', change: '-৳ ৩০.০০', isUp: false, hub: 'Chittagong Mokam' },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-black/25 hover:bg-black/35 border border-white/5 flex flex-col gap-1 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[11.5px] font-bold text-white leading-tight">{item.name}</span>
                    <span className={`text-[9.5px] font-black shrink-0 ${item.isUp ? 'text-cyan-400' : 'text-rose-400'}`}>
                      {item.change}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[9.5px]">
                    <span className="text-[var(--pm-accent)] font-extrabold">{item.price}</span>
                    <span className="text-white/30 text-[8.5px] uppercase">{item.hub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sourcing Hubs Hat-Day Calendar */}
          <div className="rounded-2xl border p-4.5 bg-[var(--pm-surface)] border-[var(--pm-border)] space-y-3.5">
            <h4 className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              📅 RURAL SOURCING CALENDAR (হাট-বার)
            </h4>
            <div className="space-y-3">
              {[
                { name: 'বাবুরহাট ভৈরব (নরসিংদী)', days: 'শনি, রবি, সোম', spec: 'টেক্সটাইল, লুঙ্গি, শাড়ি বাল্ক মোকাম' },
                { name: 'পোড়াদহ হাট (কুষ্টিয়া)', days: 'শুক্র, শনি', spec: 'কমদামী সুতি ও গজ কাপড় লট' },
                { name: 'শাহজাদপুর বড় মোকাম (সিরাজগঞ্জ)', days: 'রবি, বুধ', spec: 'তাঁতের শাড়ি, থ্রি-পিস ও সুতি সুতা' },
              ].map((hat, idx) => (
                <div key={idx} className="p-3 border-l-2 border-[var(--pm-accent)] pl-2.5 bg-black/15 rounded-r-xl">
                  <div className="flex justify-between font-black text-white/95">
                    <span className="text-xs">{hat.name}</span>
                    <span className="text-[9px] text-[var(--pm-accent)] bg-[var(--pm-accent)]/15 border border-[var(--pm-accent)]/20 px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0">
                      {hat.days}
                    </span>
                  </div>
                  <p className="text-[9.5px] text-white/40 mt-1">{hat.spec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Helpline support Desk */}
          <div className="rounded-2xl border p-4.5 bg-gradient-to-br from-indigo-950/20 to-teal-950/10 border-indigo-500/10 space-y-2.5">
            <h4 className="text-[11px] font-extrabold text-white flex items-center gap-1.5">
              📞 B2B TRADE SOURCING HELPDESK
            </h4>
            <p className="text-[9.5px] text-white/50 leading-relaxed">
              বাল্ক শিপমেন্ট, ল্যান্ডপোর্ট ডিউটি বা কার্গো ফ্রেইট ভেকরের রেট নিয়ে সরাসরি আমাদের মডারেটরদের সাহায্য চান।
            </p>
            <button 
              onClick={() => onNotify('ট্রেড হেল্পলাইনে কল রিকোয়েস্ট পাঠানো হয়েছে, একজন কনসালট্যান্ট আপনাকে কল করবেন!', 'success')}
              className="w-full mt-1.5 py-2.5 bg-indigo-600/95 hover:bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-wider transition duration-150 active:scale-95"
            >
              Request Call Match
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
