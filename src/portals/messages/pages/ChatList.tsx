import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Search, MoreVertical, CheckCheck, 
  Clock, ShieldCheck, Store, Filter, Sparkles, RotateCcw, ArrowLeft, Bot
} from 'lucide-react';
import { useChatStore } from '@/modules/ai/store/useChatStore';
import { useChatEngine } from '@/modules/ai/hooks/useChatEngine';
import { ChatWidget } from '@/modules/ai/components/ChatWidget';

interface Chat {
  id: string;
  senderName: string;
  senderAvatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  isVerified: boolean;
  type: 'vendor' | 'customer' | 'support' | 'ai';
}

const MOCK_CHATS: Chat[] = [
  {
    id: 'ai',
    senderName: 'Aloop AI Assistant (এআই সহকারী)',
    senderAvatar: '🤖',
    lastMessage: 'আসসালামু আলাইকুম! কোনো পন্য বা বিজনেসের ব্যাপারে সাহায্য করতে পারি?',
    time: 'সক্রিয় (Active)',
    unreadCount: 1,
    isOnline: true,
    isVerified: true,
    type: 'ai'
  },
  {
    id: '1',
    senderName: 'Keraniganj Bulk Store',
    senderAvatar: 'KB',
    lastMessage: 'ভাই, আপনার অর্ডারটি কি কনফার্ম করব?',
    time: '১ মিনিট আগে',
    unreadCount: 3,
    isOnline: true,
    isVerified: true,
    type: 'vendor'
  },
  {
    id: '2',
    senderName: 'Chawkbazar Cosmetics Hub',
    senderAvatar: 'CC',
    lastMessage: 'নতুন স্টক আগামী কাল আসবে।',
    time: '১০ মিনিট আগে',
    unreadCount: 0,
    isOnline: false,
    isVerified: true,
    type: 'vendor'
  },
  {
    id: '3',
    senderName: 'Rahim Uddin (Retailer)',
    senderAvatar: 'RU',
    lastMessage: 'লটের স্যাম্পল দেখা যাবে?',
    time: '১ ঘণ্টা আগে',
    unreadCount: 1,
    isOnline: true,
    isVerified: false,
    type: 'customer'
  }
];

export default function ChatList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Load AI assistant state from the single source of truth AI store
  const { 
    sessions, 
    activeSessionId, 
    clearSession 
  } = useChatStore();
  const { sendMessage } = useChatEngine();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeSession = sessions[activeSessionId];

  useEffect(() => {
    if (messagesEndRef.current && isAiOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages, isAiOpen]);

  const handleSend = (content: string) => {
    sendMessage(activeSessionId, content);
  };

  const filteredChats = MOCK_CHATS.filter(chat => 
    chat.senderName.toLowerCase().includes(search.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(search.toLowerCase())
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
          <h2 className="text-sm font-black tracking-tight">AI Assistant</h2>
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
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">B2B Negotiation Terminal</p>
             </div>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10">
             <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
            type="text"
            placeholder="ভেন্ডর বা বায়ারের নাম খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[var(--pm-accent)]/50 transition-all shadow-inner text-white placeholder-white/30"
          />
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
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
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-2xl border border-white/20 shadow-lg shadow-orange-500/10">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--pm-accent)]/20 to-transparent flex items-center justify-center text-lg font-black text-[var(--pm-accent)] border border-white/5">
                    {chat.senderAvatar}
                  </div>
                )}
                {chat.isOnline && (
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#0c0c16] ${chat.id === 'ai' ? 'bg-orange-400' : 'bg-cyan-500'}`} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <h3 className={`font-black text-sm truncate ${chat.id === 'ai' ? 'text-orange-400 font-extrabold' : 'text-white'}`}>{chat.senderName}</h3>
                    {chat.isVerified && <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${chat.id === 'ai' ? 'text-orange-400' : 'text-blue-400'}`} />}
                  </div>
                  <span className={`text-[10px] font-bold whitespace-nowrap ${chat.id === 'ai' ? 'text-orange-400/80' : 'text-white/30'}`}>{chat.time}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className={`text-xs truncate pr-4 ${chat.id === 'ai' ? 'text-zinc-300 font-medium' : 'text-white/50'}`}>{chat.lastMessage}</p>
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
                
                <div className="flex items-center gap-3 mt-2">
                   <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[8px] font-black uppercase text-white/40">
                      {chat.type}
                   </div>
                   {chat.unreadCount === 0 && <CheckCheck className="w-3.5 h-3.5 text-blue-400 opacity-50" />}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
