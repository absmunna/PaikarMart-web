import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Bot, CheckCheck, 
  Store, User, Sparkles, ChevronDown 
} from 'lucide-react';
import { create } from 'zustand';

interface ChatMessage {
  id: string;
  sender: 'user' | 'vendor' | 'system';
  senderName: string;
  text: string;
  time: string;
}

interface ChatState {
  isOpen: boolean;
  activeVendorName: string;
  openChat: (vendorName?: string) => void;
  closeChat: () => void;
}

export const useLiveChatStore = create<ChatState>((set) => ({
  isOpen: false,
  activeVendorName: 'Paikar Mart সাপোর্ট ও পাইকারি আড়ত',
  openChat: (vendorName) => set({ 
    isOpen: true, 
    activeVendorName: vendorName || 'Paikar Mart সাপোর্ট ও পাইকারি আড়ত' 
  }),
  closeChat: () => set({ isOpen: false }),
}));

export const LiveChatDrawer: React.FC = () => {
  const { isOpen, closeChat, activeVendorName } = useLiveChatStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'system',
      senderName: 'সিস্টেম',
      text: 'আসসালামু আলাইকুম! পাইকার মার্ট লাইভ চ্যাটে স্বাগতম। আপনার কোনো পণ্য বা পাইকারি অর্ডার সংক্রান্ত জিজ্ঞাসা আছে কি?',
      time: '10:00 AM'
    },
    {
      id: 'm2',
      sender: 'vendor',
      senderName: activeVendorName,
      text: `স্বাগতম! আমি ${activeVendorName}-এর প্রতিনিধি। আমরা পাইকারি ও খুচরা উভয় ধরনের অর্ডারে বিশেষ রেট প্রদান করি। কীভাবে সাহায্য করতে পারি?`,
      time: '10:01 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    'স্টকে কি পণ্যটি আছে?',
    'সর্বনিম্ন কত পিস পাইকারি অর্ডার করা যাবে?',
    'ডেলিভারি কত দিনের মধ্যে পাওয়া যাবে?',
    'পেমেন্ট কি ক্যাশ অন ডেলিভারিতে হবে?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      senderName: 'আপনি',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulate vendor response
    setIsTyping(true);
    setTimeout(() => {
      let reply = 'জি, ধন্যবাদ আপনার বার্তার জন্য! আমাদের ইনভেন্টরি টিম আপনার রিকোয়েস্টটি চেক করছে।';
      if (text.includes('স্টক')) {
        reply = 'জি হ্যাঁ! আমাদের আড়তে পর্যাপ্ত স্টক প্রস্তুত রয়েছে। আপনি সরাসরি কার্ট থেকে বুকিং দিতে পারেন।';
      } else if (text.includes('সর্বনিম্ন') || text.includes('পিস')) {
        reply = 'আমাদের পাইকারি লট সাইজ সাধারণত ১০ পিস অথবা ১ কার্টন থেকে শুরু হয়। বড় লটে অতিরিক্ত ৫% বিশেষ ডিসকাউন্ট প্রযোজ্য!';
      } else if (text.includes('ডেলিভারি')) {
        reply = 'ঢাকা সিটিতে ২৪ ঘন্টার মধ্যে এবং ঢাকার বাইরে ৪৮-৭২ ঘন্টার মধ্যে আমাদের এক্সপ্রেস লজিস্টিক ডেলিভারি সম্পন্ন করে।';
      } else if (text.includes('পেমেন্ট') || text.includes('ক্যাশ')) {
        reply = 'জি! ক্যাশ অন ডেলিভারি, বিকাশ, নগদ এবং এসক্রো নিরাপদ পেমেন্ট সাপোর্ট রয়েছে।';
      }

      const vendorMsg: ChatMessage = {
        id: `ven_${Date.now()}`,
        sender: 'vendor',
        senderName: activeVendorName,
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, vendorMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-[var(--pm-surface)] h-full shadow-2xl flex flex-col border-l border-[var(--pm-border)] z-10"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--pm-border)] bg-[var(--pm-bg)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] flex items-center justify-center font-bold">
                    <Store className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--pm-surface)]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--pm-text)] truncate max-w-[200px]">
                    {activeVendorName}
                  </h3>
                  <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    অনলাইন আছেন • দ্রুত উত্তর দেন
                  </p>
                </div>
              </div>

              <button
                onClick={closeChat}
                className="p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] rounded-full hover:bg-[var(--pm-surface-hover)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--pm-surface)]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <span className="text-[10px] text-[var(--pm-text-muted)] px-1 mb-1">
                    {msg.senderName} • {msg.time}
                  </span>
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[var(--pm-accent)] text-white rounded-tr-none'
                        : msg.sender === 'system'
                        ? 'bg-amber-500/10 text-[var(--pm-text)] border border-amber-500/30'
                        : 'bg-[var(--pm-surface-hover)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1 text-[var(--pm-text-muted)] text-xs p-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--pm-accent)] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[var(--pm-accent)] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[var(--pm-accent)] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] ml-1">বিক্রেতা টাইপ করছেন...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2 bg-[var(--pm-bg)] border-t border-[var(--pm-border)] flex gap-1.5 overflow-x-auto hide-scrollbar">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="px-2.5 py-1 text-[11px] bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-full shrink-0 transition-colors shadow-2xs font-medium"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-[var(--pm-border)] bg-[var(--pm-surface)] flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="আপনার বার্তা লিখুন..."
                className="flex-1 bg-[var(--pm-bg)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] px-3.5 py-2.5 rounded-xl outline-none focus:border-[var(--pm-accent)] transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="p-2.5 bg-[var(--pm-accent)] text-white rounded-xl hover:bg-[var(--pm-accent)]/90 disabled:opacity-40 transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
