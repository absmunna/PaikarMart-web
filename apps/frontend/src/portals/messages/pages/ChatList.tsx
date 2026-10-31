import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MessageSquare, Search, Filter, ShieldCheck, 
  ArrowLeft, Bot, CheckCheck, Loader2, Sparkles, Store
} from 'lucide-react';
import { useChatStore, useChatEngine, ChatWidget } from '@/modules/ai';
import { useAuthStore } from '@/modules/auth';
import { subscribeUserChats, ChatConversation } from '@/modules/chat/services/chatFirestoreService';

interface DisplayChat {
  id: string;
  senderName: string;
  senderAvatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isVerified: boolean;
  type: 'vendor' | 'customer' | 'support' | 'ai';
  productContext?: string;
}

const FALLBACK_CHATS: DisplayChat[] = [
  {
    id: 'kb-store',
    senderName: 'Keraniganj Bulk Store (কেরানীগঞ্জ বাল্ক স্টোর)',
    senderAvatar: 'KB',
    lastMessage: 'ভাই, আপনার তৈরি পোশাকের অর্ডার প্রস্তুত করা হয়েছে।',
    time: '২ মিনিট আগে',
    unreadCount: 2,
    isOnline: true,
    isVerified: true,
    type: 'vendor',
    productContext: 'হোয়াইট পোলো শার্ট লট'
  },
  {
    id: 'chawkbazar-hub',
    senderName: 'Chawkbazar Wholesale Hub (চকবাজার পাইকারি)',
    senderAvatar: 'CW',
    lastMessage: 'নতুন আমদানিকৃত কসমেটিক্স স্টক কার্টন এভেইলেবল।',
    time: '২০ মিনিট আগে',
    unreadCount: 0,
    isOnline: true,
    isVerified: true,
    type: 'vendor',
  },
  {
    id: 'rahim-retailer',
    senderName: 'Rahim Traders (রহিম ট্রেডার্স)',
    senderAvatar: 'RT',
    lastMessage: 'লটের স্যাম্পল কুরিয়ারে পাঠাবেন কবে?',
    time: '১ ঘণ্টা আগে',
    unreadCount: 1,
    isOnline: false,
    isVerified: false,
    type: 'customer',
  }
];

function formatTimestamp(ts: any): string {
  if (!ts) return 'সম্প্রতি';
  try {
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMin < 1) return 'এইমাত্র';
    if (diffMin < 60) return `${diffMin} মিনিট আগে`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
    return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
  } catch {
    return 'সম্প্রতি';
  }
}

export default function ChatList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'vendors'>('all');
  const [search, setSearch] = useState('');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [liveChats, setLiveChats] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = user?.id || 'guest_buyer';

  // Listen to Firestore chats in real-time
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeUserChats(
      currentUserId,
      (conversations) => {
        setLiveChats(conversations);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUserId]);

  // AI Assistant Chat Widget states
  const { 
    sessions, 
    activeSessionId 
  } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeSession = sessions[activeSessionId];

  useEffect(() => {
    if (messagesEndRef.current && isAiOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages, isAiOpen]);

  // Build unified chat cards:
  // 1. AI Assistant pinned at the top
  const aiChat: DisplayChat = {
    id: 'ai',
    senderName: 'Paikar AI Business Assistant',
    senderAvatar: '🤖',
    lastMessage: 'আসসালামু আলাইকুম! আমি আপনাকে পাইকারি বাজার ও বিজনেসে সাহায্য করতে পারি।',
    time: 'সক্রিয় (Online)',
    unreadCount: 1,
    isOnline: true,
    isVerified: true,
    type: 'ai'
  };

  // 2. Map live Firestore chats or fallback if none yet
  const mappedLiveChats: DisplayChat[] = liveChats.map((conv) => {
    const otherParticipantId = conv.participants.find((p) => p !== currentUserId) || conv.participants[0] || 'vendor';
    const details = conv.participantDetails?.[otherParticipantId] || {
      name: otherParticipantId === 'seller' ? 'ভেন্ডর' : 'গ্রাহক',
      role: 'vendor',
      isVerified: true
    };

    const initials = details.name ? details.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'PM';

    return {
      id: conv.id,
      senderName: details.name,
      senderAvatar: initials,
      lastMessage: conv.lastMessage || 'কোনো নতুন বার্তা নেই',
      time: formatTimestamp(conv.lastMessageTimestamp),
      unreadCount: conv.unreadCounts?.[currentUserId] || 0,
      isOnline: true,
      isVerified: details.isVerified ?? true,
      type: (details.role as any) || 'vendor',
      productContext: conv.relatedProductName
    };
  });

  const displayList: DisplayChat[] = [
    aiChat,
    ...(mappedLiveChats.length > 0 ? mappedLiveChats : FALLBACK_CHATS)
  ];

  const filteredChats = displayList.filter(chat => {
    const matchesSearch = chat.senderName.toLowerCase().includes(search.toLowerCase()) ||
                         chat.lastMessage.toLowerCase().includes(search.toLowerCase()) ||
                         (chat.productContext && chat.productContext.toLowerCase().includes(search.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (activeTab === 'unread') return chat.unreadCount > 0;
    if (activeTab === 'vendors') return chat.type === 'vendor' || chat.type === 'ai';
    
    return true;
  });

  if (isAiOpen) {
    return (
      <div className="flex flex-col h-screen bg-[#05050a] text-white overflow-hidden relative pb-20">
        <div className="p-4 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center gap-3 z-20 sticky top-0">
          <button 
            onClick={() => setIsAiOpen(false)}
            className="w-10 h-10 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center hover:bg-white/[0.05] transition-all cursor-pointer text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-orange-400" />
            <h2 className="text-sm font-black tracking-tight">Paikar AI Business Assistant</h2>
          </div>
        </div>
        <div className="flex-1 overflow-hidden p-2">
          <ChatWidget mode="embed" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-24 select-none">
      {/* Messages Main Header */}
      <div className="p-5 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-black flex items-center gap-2.5 text-white">
              <MessageSquare className="w-6 h-6 text-cyan-400" /> মেসেজ সেন্টার
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-1">
              B2B Negotiation & Live Support
            </p>
          </div>
          <div className="flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />}
            <button className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/10 text-white/40 hover:text-white transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text"
            placeholder="ভেন্ডর, বায়ার বা পণ্যের নাম..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner text-white placeholder-white/20"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'সবগুলো', count: displayList.length },
            { id: 'unread', label: 'পড়া হয়নি', count: displayList.filter(c => c.unreadCount > 0).length },
            { id: 'vendors', label: 'ভেন্ডর', count: displayList.filter(c => c.type === 'vendor' || c.type === 'ai').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all flex items-center gap-2 border cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-black border-cyan-500 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/[0.02] text-zinc-400 border-white/10 hover:border-white/20'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${
                  activeTab === tab.id ? 'bg-black/20' : 'bg-white/10 text-zinc-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 no-scrollbar">
        {filteredChats.map((chat) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={() => {
              if (chat.id === 'ai') {
                setIsAiOpen(true);
              } else {
                navigate(`/messages/${chat.id}`);
              }
            }}
            className={`p-4 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden ${
              chat.id === 'ai'
                ? "bg-gradient-to-br from-cyan-950/30 via-black to-black border-cyan-500/20 hover:border-cyan-500/40"
                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
            }`}
          >
            {/* Active Glow for AI */}
            {chat.id === 'ai' && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />
            )}

            <div className="flex gap-4 relative z-10">
              <div className="relative flex-shrink-0">
                {chat.id === 'ai' ? (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl border border-white/20 shadow-xl shadow-cyan-500/10 group-hover:scale-105 transition-transform">
                    <Bot className="w-8 h-8 text-black" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent flex items-center justify-center text-sm font-black text-cyan-400 border border-white/5 group-hover:border-cyan-500/30 transition-all">
                    {chat.senderAvatar}
                  </div>
                )}
                {chat.isOnline && (
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-3 border-[#05050a] ${chat.id === 'ai' ? 'bg-cyan-400' : 'bg-emerald-500'}`} />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <h3 className={`font-black text-[13px] sm:text-sm truncate ${chat.id === 'ai' ? 'text-cyan-400' : 'text-white'}`}>
                      {chat.senderName}
                    </h3>
                    {chat.isVerified && (
                      <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${chat.id === 'ai' ? 'text-cyan-400' : 'text-cyan-500'}`} />
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-600 whitespace-nowrap">
                    {chat.time}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className={`text-xs truncate font-medium ${chat.id === 'ai' ? 'text-zinc-300' : 'text-zinc-500'} group-hover:text-zinc-300 transition-colors`}>
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className={`text-black text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 shadow-lg ${
                      chat.id === 'ai' 
                        ? 'bg-cyan-400 shadow-cyan-500/20' 
                        : 'bg-cyan-500 shadow-cyan-500/20'
                    }`}>
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                
                {chat.productContext && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-1 h-3 rounded-full bg-cyan-500/40" />
                    <span className="text-[9px] font-bold text-cyan-500/80 uppercase tracking-wider truncate">
                      {chat.productContext}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredChats.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10 mx-auto mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-700">কোনো বার্তা পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
}
