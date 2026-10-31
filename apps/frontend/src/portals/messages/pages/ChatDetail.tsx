import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Send, Image as ImageIcon, 
  MoreVertical, ShieldCheck, Phone, Video, 
  Plus, CheckCheck, ArrowLeft, Loader2, Store, Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/modules/auth';
import { 
  subscribeChatMessages, 
  sendChatMessage, 
  getConversation, 
  ChatMessageItem, 
  ChatConversation 
} from '@/modules/chat/services/chatFirestoreService';

const DEMO_FALLBACK_MESSAGES: Record<string, ChatMessageItem[]> = {
  'kb-store': [
    { id: '1', chatId: 'kb-store', text: 'আসসালামু আলাইকুম, ভাই। আপনার তৈরি পোশাকের অর্ডার প্রস্তুত করা হয়েছে।', senderId: 'seller', timestamp: new Date(Date.now() - 120000), status: 'read' },
    { id: '2', chatId: 'kb-store', text: 'ওয়ালাইকুম আসসালাম। ধন্যবাদ ভাই! ডেলিভারি কি আজই বের হবে?', senderId: 'me', timestamp: new Date(Date.now() - 60000), status: 'read' },
    { id: '3', chatId: 'kb-store', text: 'জ্বি, আমাদের ওয়্যারহাউজ থেকে পিকআপ ভ্যান রওনা দিয়েছে। ট্র্যাকিং কোড পেয়ে যাবেন।', senderId: 'seller', timestamp: new Date(), status: 'read' },
  ],
  'chawkbazar-hub': [
    { id: '1', chatId: 'chawkbazar-hub', text: 'নতুন আমদানিকৃত কসমেটিক্স স্টক কার্টন এভেইলেবল।', senderId: 'seller', timestamp: new Date(Date.now() - 1200000), status: 'read' },
    { id: '2', chatId: 'chawkbazar-hub', text: 'ক্যাটালগ এবং কার্টন প্রতি রেট জানতে চাই।', senderId: 'me', timestamp: new Date(Date.now() - 600000), status: 'read' },
  ],
  'rahim-retailer': [
    { id: '1', chatId: 'rahim-retailer', text: 'লটের স্যাম্পল কুরিয়ারে পাঠাবেন কবে?', senderId: 'customer', timestamp: new Date(Date.now() - 3600000), status: 'read' },
    { id: '2', chatId: 'rahim-retailer', text: 'আজ বিকেলে সুন্দরবন কুরিয়ারে বুকিং দেওয়া হবে।', senderId: 'me', timestamp: new Date(Date.now() - 1800000), status: 'read' },
  ]
};

function formatTime(timestamp: any): string {
  if (!timestamp) return 'এখন';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'এখন';
  }
}

export default function ChatDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const chatId = id || 'general';
  const { user } = useAuthStore();
  const currentUserId = user?.id || 'guest_buyer';
  const currentUserName = user?.name || user?.fullName || 'আমি';

  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch conversation metadata
  useEffect(() => {
    let isMounted = true;
    async function loadMeta() {
      if (chatId.startsWith('chat_')) {
        const conv = await getConversation(chatId);
        if (isMounted && conv) {
          setConversation(conv);
        }
      }
    }
    loadMeta();
    return () => { isMounted = false; };
  }, [chatId]);

  // 2. Subscribe to real-time messages from Firestore
  useEffect(() => {
    setLoading(true);
    // If it's a real Firestore chat ID
    if (chatId.startsWith('chat_')) {
      const unsubscribe = subscribeChatMessages(
        chatId,
        (liveMsgs) => {
          setMessages(liveMsgs);
          setLoading(false);
        },
        () => {
          // If firestore read fails, fallback
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      // Demo / fallback conversation
      const fallback = DEMO_FALLBACK_MESSAGES[chatId] || [
        { 
          id: '1', 
          chatId, 
          text: 'আসসালামু আলাইকুম! কোনো পণ্য বা বাল্ক অর্ডারের ব্যাপারে কথা বলতে মেসেজ পাঠাতে পারেন।', 
          senderId: 'seller', 
          timestamp: new Date(), 
          status: 'read' 
        }
      ];
      setMessages(fallback);
      setLoading(false);
    }
  }, [chatId]);

  // Scroll to bottom on message updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;
    const textToSend = inputText.trim();
    setInputText('');

    // Optimistic message update
    const optimisticMessage: ChatMessageItem = {
      id: `temp_${Date.now()}`,
      chatId,
      senderId: currentUserId,
      senderName: currentUserName,
      text: textToSend,
      timestamp: new Date(),
      status: 'sent',
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    setSending(true);
    try {
      if (chatId.startsWith('chat_')) {
        await sendChatMessage(chatId, {
          senderId: currentUserId,
          senderName: currentUserName,
          text: textToSend,
        });
      }
    } catch (err) {
      console.error('Failed to send live message:', err);
    } finally {
      setSending(false);
    }
  };

  // Determine other participant details
  const otherParticipantId = conversation?.participants?.find((p) => p !== currentUserId) || 'partner';
  const partnerDetails = conversation?.participantDetails?.[otherParticipantId] || {
    name: chatId === 'kb-store' 
      ? 'Keraniganj Bulk Store (কেরানীগঞ্জ)' 
      : chatId === 'chawkbazar-hub'
      ? 'Chawkbazar Cosmetics Hub'
      : chatId === 'rahim-retailer'
      ? 'Rahim Traders'
      : 'পাইকারি বিক্রেতা',
    role: 'vendor',
    isVerified: true
  };

  const partnerInitials = partnerDetails.name
    ? partnerDetails.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'PM';

  const quickReplies = [
    { text: 'সর্বনিম্ন কত পিস?', icon: '📦' },
    { text: 'একটু দাম কমানো যাবে?', icon: '💰' },
    { text: 'ডেলিভারি চার্জ কত?', icon: '🚚' },
    { text: 'স্টক এভেইলেবল?', icon: '✅' },
    { text: 'কোটেশন পাঠান', icon: '📝' },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#05050a] text-white overflow-hidden relative">
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-cyan-600/20 to-transparent" />
      </div>

      {/* Header */}
      <div className="p-3.5 border-b border-white/5 bg-black/50 backdrop-blur-2xl flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => navigate('/messages')}
            className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center font-black text-xs text-cyan-400 border border-white/10">
                {partnerInitials}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#05050a]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs sm:text-sm font-black tracking-tight text-white truncate max-w-[160px] sm:max-w-[280px]">
                  {partnerDetails.name}
                </h2>
                {partnerDetails.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black text-cyan-400 uppercase tracking-wider">সক্রিয় (Active)</span>
                <span className="text-[9px] text-zinc-500">• {partnerDetails.role === 'vendor' ? 'ভেরিফাইড সেলার' : 'গ্রাহক'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <Video className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Detail Bar (Conditional) */}
      {conversation?.relatedProductName && (
        <div className="px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/20 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Store className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-[10px] font-black text-cyan-400 uppercase leading-none mb-0.5">পণ্য সংক্রান্ত আলোচনা</p>
              <p className="text-[11px] font-bold text-white truncate">{conversation.relatedProductName}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/product/${conversation.relatedProductId}`)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black text-[10px] font-black shrink-0 hover:brightness-110 active:scale-95 transition-all"
          >
            পণ্য দেখুন
          </button>
        </div>
      )}

      {/* Chat Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 no-scrollbar"
      >
        <div className="text-center py-4">
          <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em] bg-white/5 px-3 py-1 rounded-full border border-white/5">
            নিরাপদ এসক্রো নেগোসিয়েশন সক্রিয়
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-zinc-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            <span className="text-xs font-bold">বার্তা লোড হচ্ছে...</span>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId || msg.senderId === 'me';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3.5 rounded-2xl text-[13px] sm:text-sm leading-relaxed shadow-xl border transition-all ${
                    isMe 
                      ? 'bg-gradient-to-br from-cyan-600 to-teal-700 text-white border-white/10 rounded-tr-none' 
                      : 'bg-white/[0.08] text-white/95 border-white/10 backdrop-blur-md rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[9px] font-bold text-white/20 uppercase">{formatTime(msg.timestamp)}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Quick Actions & Input Container */}
      <div className="bg-black/80 backdrop-blur-3xl border-t border-white/5 z-20 pb-safe">
        {/* Quick Replies Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 py-3 border-b border-white/[0.03]">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(reply.text);
                setTimeout(handleSend, 100);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 whitespace-nowrap text-[11px] font-bold text-white/80 hover:bg-white/10 hover:border-cyan-500/30 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <span>{reply.icon}</span>
              <span>{reply.text}</span>
            </button>
          ))}
        </div>

        {/* Input Terminal */}
        <div className="p-3 pb-6 sm:pb-8">
          <div className="flex items-center gap-2.5 max-w-4xl mx-auto">
            <button 
              type="button"
              className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all shrink-0 border border-white/5 shadow-inner"
            >
              <Plus className="w-5 h-5" />
            </button>
            
            <div className="relative flex-1">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="সেলারকে বার্তা পাঠান..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-5 pr-12 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all font-medium text-white placeholder-white/20 shadow-inner"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <button 
                  type="button"
                  className="p-2 text-white/20 hover:text-white transition-colors"
                  title="ছবি আপলোড করুন"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button 
              onClick={handleSend}
              disabled={!inputText.trim() || sending}
              className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 to-teal-500 flex items-center justify-center text-black font-black shadow-lg shadow-cyan-400/20 disabled:opacity-30 disabled:shadow-none active:scale-90 transition-all shrink-0 cursor-pointer"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : <Send className="w-4 h-4 fill-current" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
