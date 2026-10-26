import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Image as ImageIcon, Paperclip, 
  MoreVertical, ShieldCheck, Phone, Video, 
  Plus, CheckCheck, Smile
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  senderId: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

const MOCK_MESSAGES: Message[] = [
  { id: '1', text: 'আসসালামু আলাইকুম, ভাই। আপনার হোয়াইট পোলো শার্ট কি এখন স্টকে আছে?', senderId: 'customer', time: '১০:৩০ AM', status: 'read' },
  { id: '2', text: 'ওয়ালাইকুম আসসালাম। জ্বি ভাই, আছে। তবে লট মিনিমাম ৫০ পিস হতে হবে।', senderId: 'me', time: '১০:৩২ AM', status: 'read' },
  { id: '3', text: 'ভাই, এক পিসের পাইকারি রেট কত রাখবেন?', senderId: 'customer', time: '১০:৩৩ AM', status: 'read' },
  { id: '4', text: 'লট নিলে ১৭০ টাকা করে রাখা যাবে। প্রিমিয়াম কোয়ালিটি নিশ্চিত।', senderId: 'me', time: '১০:৩৫ AM', status: 'read' },
];

export default function ChatDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      senderId: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-screen bg-[#05050a] text-white overflow-hidden relative">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-600/20 to-transparent" />
      </div>

      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between z-20 sticky top-0">
        <div className="flex items-center gap-3">
          
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center font-black border border-white/10">
                KB
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-cyan-500 border-2 border-[#05050a]" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h2 className="text-sm font-black tracking-tight">Keraniganj Bulk Store</h2>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Active Now</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <Phone className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <Video className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar relative z-10"
      >
        <div className="text-center py-8">
           <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
              Secure Negotiation Active
           </span>
        </div>

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: msg.senderId === 'me' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] space-y-1`}>
              <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-xl border ${
                msg.senderId === 'me' 
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white border-white/10 rounded-tr-none' 
                  : 'bg-white/[0.05] text-white/90 border-white/5 backdrop-blur-md rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <div className={`flex items-center gap-1.5 px-2 ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[9px] font-bold text-white/30 uppercase">{msg.time}</span>
                {msg.senderId === 'me' && <CheckCheck className="w-3 h-3 text-cyan-400" />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Terminal */}
      <div className="p-4 pb-10 bg-black/40 backdrop-blur-3xl border-t border-white/5 z-20">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all shrink-0">
            <Plus className="w-5 h-5" />
          </button>
          
          <div className="relative flex-1">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="পণ্য সংক্রান্ত জানুন..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-medium text-white placeholder-white/20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
               <button className="p-2 text-white/20 hover:text-white transition-colors">
                  <ImageIcon className="w-4 h-4" />
               </button>
            </div>
          </div>

          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 disabled:opacity-30 disabled:shadow-none active:scale-95 transition-all shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
