import React, { useState } from "react";
import { Radio, MessageCircle, Heart, Send, ShoppingBag, ArrowLeft, CheckCircle2, Eye, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
}

export default function LiveStreamView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", user: "Rahim Ahmed", text: "ভাই, পাইকারি অর্ডার কি মিনিমাম ৫০ পিস?", time: "10:15 AM" },
    { id: "2", user: "Sadia Islam", text: "Price koto?", time: "10:16 AM" },
    { id: "3", user: "Tanvir Hossain", text: "Order placed! Fast delivery please.", time: "10:16 AM" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const navigate = useNavigate();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now().toString(), user: "You", text: inputMessage, time: "Just now" }
    ]);
    setInputMessage("");
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-zinc-950 text-white flex flex-col lg:flex-row overflow-hidden">
      {/* Back button */}
      <button 
        onClick={() => navigate("/video")}
        className="absolute top-4 left-4 z-30 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {/* Main Video Stream Area */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" 
          alt="Live Stream" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        {/* Live Badges */}
        <div className="absolute top-4 right-4 flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-lg animate-pulse">
            <Radio className="h-4 w-4" /> LIVE
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold">
            <Eye className="h-4 w-4 text-[#FF7A00]" /> 4.2K Watching
          </span>
        </div>

        {/* Streamer Info Bottom-Left */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img 
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150" 
                alt="Chittagong Agro" 
                className="h-12 w-12 rounded-full object-cover border-2 border-[#FF7A00]"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-bold text-white">Chittagong Agro Trade</h3>
                  <CheckCircle2 className="h-4 w-4 text-[#FF7A00]" />
                </div>
                <p className="text-xs text-zinc-300">Direct Wholesale Marketplace Live Stream</p>
              </div>
            </div>
          </div>

          {/* Pinned Product Card in Stream */}
          <div className="hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 max-w-xs shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200" 
              alt="Mustard Oil" 
              className="h-14 w-14 rounded-xl object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500 text-white font-black uppercase">Featured Deal</span>
              <p className="text-xs font-bold text-white line-clamp-1 mt-1">Pure Mustard Oil 5L</p>
              <p className="text-xs font-black text-[#FF7A00]">৳980 <span className="text-[10px] text-zinc-400 line-through">৳1,200</span></p>
            </div>
            <button className="px-3 py-2 rounded-xl bg-[#FF7A00] text-white text-xs font-black shadow-lg">
              Buy
            </button>
          </div>
        </div>
      </div>

      {/* Live Chat & Interaction Sidebar */}
      <div className="w-full lg:w-96 bg-[#11131c] border-l border-white/10 flex flex-col h-72 lg:h-full">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-[#FF7A00]" /> Live Stream Chat
          </h3>
          <span className="text-xs text-zinc-400">Moderated by PaikarMart</span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="text-xs">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-[#FF7A00]">{m.user}</span>
                <span className="text-[10px] text-zinc-500">{m.time}</span>
              </div>
              <p className="text-zinc-300 bg-white/5 p-2.5 rounded-xl border border-white/5">{m.text}</p>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex items-center gap-2 bg-[#0f111a]">
          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Send a live message..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
          />
          <button 
            type="submit"
            className="p-2.5 rounded-xl bg-[#FF7A00] text-white hover:bg-[#e06b00] transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
