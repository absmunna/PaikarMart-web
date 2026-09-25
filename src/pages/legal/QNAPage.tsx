import React, { useState } from 'react';
import { HelpCircle, MessagesSquare, Search, Send, User, Award, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/modules/app/appStore';
import { useAuth } from '@/features/auth/AuthContext';

interface QNAPost {
  id: number;
  user: string;
  avatar: string;
  role: string;
  question: string;
  likes: number;
  replies: {
    author: string;
    avatar: string;
    role: string;
    text: string;
    isVerified: boolean;
    date: string;
  }[];
  date: string;
}

const INITIAL_QNA: QNAPost[] = [
  {
    id: 1,
    user: 'রফিকুল ইসলাম',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rofik',
    role: 'খুচরা বিক্রেতা (ঢাকা)',
    question: 'আমি চকবাজার থেকে প্লাস্টিক মালামাল ভাগাভাগি করে কিনতে চাই। চট্টগ্রাম বা ঢাকার কেউ কি আমার সাথে গ্রুপ-অর্ডার করতে আগ্রহী আছেন?',
    likes: 12,
    replies: [
      {
        author: 'তানভীর আহমেদ',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir',
        role: 'যৌথ বায়ার',
        text: 'হ্যাঁ ভাই, আমিও চকবাজারের প্লাস্টিক প্রডাক্ট ৫০ ডজন নিতে চাচ্ছি। আমরা দুজনে মিলে MOQ পূরণ করতে পারব। ইনবক্স এ আসুন।',
        isVerified: true,
        date: '১ ঘণ্টা আগে'
      },
      {
        author: 'Paikar Mart Support',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PMS',
        role: 'মডারেটর',
        text: 'গ্রুপ ক্রয়ের ক্ষেত্রে পেমেন্ট সিকিউরিটি নিশ্চিত করতে আপনারা আমাদের Paikar Mart Escrow Wallet ব্যবহার করতে পারেন। কোনো অগ্রিম ব্যক্তিগত বিকাশ লেনদেন করবেন না।',
        isVerified: true,
        date: '৩০ মিনিট আগে'
      }
    ],
    date: '৩ ঘণ্টা আগে'
  },
  {
    id: 2,
    user: 'কামরুল হাসান',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kamrul',
    role: 'হোলসেলার (নরসিংদী)',
    question: 'নরসিংদীর শাড়ি থ্রি-পিস কি এখানে বাল্ক সাপ্লাই দেওয়া যাবে? আমাদের নিজস্ব ফ্যাক্টরি আছে।',
    likes: 8,
    replies: [
      {
        author: 'অনন্যা বুটিকস',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anannya',
        role: 'ভেরিফাইড রিসেলার',
        text: 'অবশ্যই যাবে ভাই! আপনি আপনার ফ্যাক্টরি ট্রেড লাইসেন্স সাবমিট করে "ফ্যাক্টরি কর্নার" এ সেলার অ্যাকাউন্ট খুলুন। আমরা আপনার থেকে রেগুলার সোর্সিং করব।',
        isVerified: true,
        date: '২ ঘণ্টা আগে'
      }
    ],
    date: '৫ ঘণ্টা আগে'
  }
];

export default function QNAPage() {
  const { lang } = useAppStore();
  const { user } = useAuth();
  const [posts, setPosts] = useState<QNAPost[]>(INITIAL_QNA);
  const [newQuestion, setNewQuestion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReplyPostId, setActiveReplyPostId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newPost: QNAPost = {
      id: posts.length + 1,
      user: user?.name || 'অতিথি ইউজার',
      avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      role: user?.role === 'seller' ? 'পেশাদার বিক্রেতা' : 'সাধারন মেম্বার',
      question: newQuestion,
      likes: 0,
      replies: [],
      date: 'এইমাত্র'
    };

    setPosts([newPost, ...posts]);
    setNewQuestion('');
  };

  const handleReplySubmit = (postId: number) => {
    if (!replyText.trim()) return;

    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [
            ...p.replies,
            {
              author: user?.name || 'অতিথি ইউজার',
              avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
              role: user?.role === 'seller' ? 'বিক্রেতা' : 'মেম্বার',
              text: replyText,
              isVerified: false,
              date: 'এইমাত্র'
            }
          ]
        };
      }
      return p;
    }));

    setReplyText('');
    setActiveReplyPostId(null);
  };

  const filteredPosts = posts.filter(p => 
    p.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500/10 to-transparent border border-white/5 rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-orange-500/10 text-[var(--pm-accent)] border border-orange-500/20 rounded-2xl">
            <MessagesSquare className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-[var(--pm-accent)]">Bangladesh Local Trade Forum</span>
            <h1 className="text-2xl md:text-3xl font-black text-[var(--pm-text)] uppercase tracking-tight">Q&A & Community Discussion</h1>
          </div>
        </div>
        <p className="text-xs md:text-sm text-[var(--pm-text-muted)] max-w-lg leading-relaxed">
          {lang === 'EN' ? 'Join discussions for price checks, wholesale recommendations, or coordinating shared shipments across districts.' : 'পণ্য সোর্সিং, চকবাজার দরদাম বা চট্টগ্রাম-ঢাকা যৌথ পার্সেল পাঠানোর ব্যাপারে যেকোনো প্রশ্ন করুন বা অন্যদের সাহায্য করুন।'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
        {/* Ask Question Corner */}
        <div className="lg:col-span-1 rounded-2xl border border-white/5 bg-[var(--pm-surface)] p-6 shadow-md relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--pm-accent)]/5 blur-2xl rounded-full" />
          <h3 className="text-sm font-black text-[var(--pm-text)] mb-1 flex items-center gap-2">
            <Award className="w-4 h-4 text-orange-400" />
            {lang === 'EN' ? 'Ask the Community' : 'নতুন প্রশ্ন জমা দিন'}
          </h3>
          <p className="text-[10px] text-[var(--pm-text-muted)] mb-4">
            {lang === 'EN' ? 'Ensure and follow general wholesale discussion rules.' : 'সঠিক সোর্সিং প্রশ্নের জন্য আপনার প্রয়োজনীয়তা পরিষ্কার করে লিখুন।'}
          </p>

          <form onSubmit={handleAskQuestion} className="space-y-3 relative z-10">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder={lang === 'EN' ? "What are you looking for?" : "আপনার প্রশ্নটি বা যৌথ ক্রয়ের রিকোয়েস্টটি বিস্তারিত এখানে লিখুন..."}
              rows={4}
              maxLength={250}
              className="w-full p-4 bg-slate-950/80 text-xs border border-white/10 rounded-xl focus:border-[var(--pm-accent)] outline-none text-white placeholder-white/20 resize-none shadow-inner"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-xs font-black shadow-lg cursor-pointer hover:brightness-115 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              {lang === 'EN' ? 'Post Question' : 'প্রশ্ন পোস্ট করুন'}
            </button>
          </form>
        </div>

        {/* Community Stream */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Search inside Discussion */}
          <div className="flex items-center bg-[var(--pm-surface)] border border-white/5 rounded-2xl px-4 py-3 shadow-inner">
            <Search className="w-4 h-4 text-[var(--pm-text-muted)] mr-3" />
            <input
              type="text"
              placeholder={lang === 'EN' ? "Search community forum..." : "ফোরামের পোস্ট ও প্রশ্নসমূহ সার্চ করুন..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-white placeholder-white/30 w-full"
            />
          </div>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div 
                key={post.id}
                className="p-5 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] hover:border-white/10 transition-all flex flex-col gap-4 shadow-sm"
              >
                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={post.avatar} alt="Avatar" className="w-9 h-9 rounded-xl border border-white/10 bg-slate-900" />
                    <div>
                      <h4 className="text-[11px] font-black text-white">{post.user}</h4>
                      <span className="text-[9px] text-[var(--pm-text-muted)] bg-[var(--pm-bg)] px-1.5 py-0.5 rounded-md border border-white/5">
                        {post.role}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[var(--pm-text-muted)] font-medium">
                    {post.date}
                  </span>
                </div>

                {/* Question bubble */}
                <p className="text-xs md:text-sm text-white leading-relaxed font-semibold">
                  {post.question}
                </p>

                {/* Replies container */}
                {post.replies.length > 0 && (
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-white/5 space-y-4">
                    {post.replies.map((reply, rid) => (
                      <div key={rid} className="flex gap-3 text-xs">
                        <img src={reply.avatar} alt="Reply" className="w-7 h-7 rounded-lg shrink-0 border border-white/5 bg-slate-900" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold text-orange-400">{reply.author}</span>
                            <span className="text-[8px] text-[var(--pm-text-muted)] bg-white/5 px-1 py-0.1 rounded">
                              {reply.role}
                            </span>
                            {reply.isVerified && <CheckCircle2 className="w-3 h-3 text-[var(--pm-accent)]" />}
                          </div>
                          <p className="text-[11px] text-white/70 leading-relaxed font-medium">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interaction footer */}
                <div className="flex items-center justify-between pt-1 border-t border-[var(--pm-border)]/50">
                  <span className="text-[10px] text-[var(--pm-text-muted)] font-bold">
                    👥 {post.replies.length} {lang === 'EN' ? 'Replies' : 'টি উত্তর'}
                  </span>

                  <button
                    onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                    className="text-[11px] text-[var(--pm-accent)] font-extrabold hover:underline cursor-pointer"
                  >
                    💬 {lang === 'EN' ? 'Write a Reply' : 'উত্তর দিন'}
                  </button>
                </div>

                {/* Inline Reply input */}
                {activeReplyPostId === post.id && (
                  <div className="flex gap-2 items-center mt-2">
                    <input
                      type="text"
                      placeholder={lang === 'EN' ? "Add public reply..." : "একটি উত্তর ক্যাজুয়ালি লিখুন..."}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                    <button
                      onClick={() => handleReplySubmit(post.id)}
                      className="p-2.5 bg-orange-600 hover:bg-orange-500 rounded-xl text-white transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
