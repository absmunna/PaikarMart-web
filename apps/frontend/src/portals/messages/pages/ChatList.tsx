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
    senderName: 'Aloop AI Assistant (এআই সহকারী)',
    senderAvatar: '🤖',
    lastMessage: 'আসসালামু আলাইকুম! কোনো পণ্য বা বিজনেসের ব্যাপারে সাহায্য করতে পারি?',
    time: 'সক্রিয় (Active)',
    unreadCount: 1,
    isOnline: true,
    isVerified: true,
    type: 'ai'
  };

  // 2. Map live Firestore chats or fallback if none yet
  const mappedLiveChats: DisplayChat[] = liveChats.map((conv) => {
    // Find the other participant
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

  const filteredChats = displayList.filter(chat => 
    chat.senderName.toLowerCase().includes(search.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(search.toLowerCase()) ||
    (chat.productContext && chat.productContext.toLowerCase().includes(search.toLowerCase()))
  );

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
    <div className="flex flex-col min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-24">
      {/* Messages Main Header */}
      <div className="p-5 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-black flex items-center gap-2 text-white">
                <MessageSquare className="w-6 h-6 text-[var(--pm-accent)]" /> মেসেজ সেন্টার
              </h1>
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">
                Real-Time B2B Negotiation & Communication
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />}
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/70 hover:text-white">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text"
            placeholder="ভেন্ডর, বায়ার বা পণ্যের নাম খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[var(--pm-accent)]/50 transition-all shadow-inner text-white placeholder-white/30"
          />
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {filteredChats.map((chat) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              if (chat.id === 'ai') {
                setIsAiOpen(true);
              } else {
                navigate(`/messages/${chat.id}`);
              }
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              chat.id === 'ai'
                ? "bg-gradient-to-r from-orange-950/40 via-amber-950/20 to-black/30 border-orange-500/20 hover:border-orange-500/40 hover:from-orange-950/50 hover:to-orange-950/30"
                : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10"
            }`}
          >
            <div className="flex gap-4">
              <div className="relative flex-shrink-0">
                {chat.id === 'ai' ? (
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-2xl border border-white/20 shadow-lg shadow-orange-500/10">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                ) : (
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[var(--pm-accent)]/20 to-transparent flex items-center justify-center text-sm font-black text-[var(--pm-accent)] border border-white/5">
                    {chat.senderAvatar}
                  </div>
                )}
                {chat.isOnline && (
                  <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0c0c16] ${chat.id === 'ai' ? 'bg-orange-400' : 'bg-cyan-400'}`} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <h3 className={`font-black text-sm truncate ${chat.id === 'ai' ? 'text-orange-400 font-extrabold' : 'text-white'}`}>
                      {chat.senderName}
                    </h3>
                    {chat.isVerified && (
                      <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${chat.id === 'ai' ? 'text-orange-400' : 'text-cyan-400'}`} />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold whitespace-nowrap ${chat.id === 'ai' ? 'text-orange-400/80' : 'text-white/30'}`}>
                    {chat.time}
                  </span>
                </div>

                {chat.productContext && (
                  <div className="mb-1">
                    <span className="inline-block text-[9px] font-bold text-cyan-400/90 bg-cyan-400/10 px-2 py-0.5 rounded-md truncate max-w-full">
                      ইনকোয়ারি: {chat.productContext}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <p className={`text-xs truncate pr-4 ${chat.id === 'ai' ? 'text-zinc-300 font-medium' : 'text-white/60'}`}>
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className={`text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-2 shadow-sm shrink-0 ${
                      chat.id === 'ai' 
                        ? 'bg-orange-500 ring-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]' 
                        : 'bg-[var(--pm-accent)] ring-[var(--pm-accent)] shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                    }`}>
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[8px] font-black uppercase text-white/40">
                    {chat.type}
                  </div>
                  {chat.unreadCount === 0 && chat.id !== 'ai' && (
                    <CheckCheck className="w-3.5 h-3.5 text-cyan-400 opacity-60" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredChats.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <p className="text-xs font-bold uppercase tracking-wider">কোনো বার্তা পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
}
