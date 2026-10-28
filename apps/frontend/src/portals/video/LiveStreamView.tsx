import React, { useState, useRef, useEffect } from "react";
import { 
  Radio, MessageCircle, Heart, Send, ShoppingBag, ArrowLeft, 
  CheckCircle2, Eye, Flame, Share2, Volume2, VolumeX, Sparkles, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useVideoStore } from "@/modules/video";
import { useCartStore, useCartDrawerStore } from "@/modules/cart";

interface FloatingHeart {
  id: number;
  x: number;
  color: string;
}

export default function LiveStreamView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { liveStreams, addLiveComment, followedCreatorIds, toggleFollow } = useVideoStore();
  
  const currentStream = liveStreams[0];
  const [inputMessage, setInputMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartDrawerStore((s) => s.open);

  const isFollowing = currentStream ? followedCreatorIds.includes(currentStream.host.id) : false;

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStream?.chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentStream) return;
    addLiveComment(currentStream.id, "আপনি", inputMessage.trim());
    setInputMessage("");
  };

  const handleSendHeart = () => {
    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x: Math.random() * 60 - 30, // random offset
      color: ['#FF7A00', '#F43F5E', '#EC4899', '#A855F7', '#F59E0B'][Math.floor(Math.random() * 5)]
    };
    setFloatingHearts(prev => [...prev.slice(-15), newHeart]);
  };

  const handleBuyPinned = () => {
    if (!currentStream?.pinnedProduct) return;
    addItem({
      id: currentStream.pinnedProduct.id,
      name: currentStream.pinnedProduct.title,
      price: currentStream.pinnedProduct.price,
      originalPrice: currentStream.pinnedProduct.originalPrice,
      image: currentStream.pinnedProduct.image,
      quantity: 1,
      moq: 1,
      stock: 50,
      portal: 'wholesale',
      seller: currentStream.host.name
    });
    toast.success("লাইভ অফার প্রোডাক্ট কার্টে যোগ হয়েছে!");
    openCart();
  };

  if (!currentStream) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        <p className="text-xs text-zinc-400">লাইভ স্ট্রিম লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[100dvh] bg-zinc-950 text-white flex flex-col lg:flex-row overflow-hidden select-none">
      {/* Top Floating Back button & Live status */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-3">
        <button 
          onClick={() => navigate("/video")}
          className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition-all active:scale-95 border border-white/10 cursor-pointer"
          title="ফিরে যান"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-lg animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <Radio className="h-3.5 w-3.5" /> LIVE
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold border border-white/10">
            <Eye className="h-3.5 w-3.5 text-[#FF7A00]" /> {currentStream.viewersCount.toLocaleString()} দর্শক
          </span>
        </div>
      </div>

      {/* Main Video Stream Container (Left on desktop) */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        <video 
          ref={videoRef}
          src={currentStream.streamUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/40 pointer-events-none" />

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-[#FF7A00]" />}
        </button>

        {/* Stream Host Info Overlay (Bottom Left) */}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <img 
                src={currentStream.host.avatar} 
                alt={currentStream.host.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-[#FF7A00] shadow-xl"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white drop-shadow-md">{currentStream.host.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
                  <button
                    onClick={() => toggleFollow(currentStream.host.id)}
                    className={`ml-2 px-3 py-0.5 rounded-full text-[10px] font-black cursor-pointer ${
                      isFollowing ? 'bg-white/20 text-white' : 'bg-[#FF7A00] text-white'
                    }`}
                  >
                    {isFollowing ? 'ফলোয়িং' : 'ফলো'}
                  </button>
                </div>
                <p className="text-xs text-zinc-300 drop-shadow">{currentStream.title}</p>
              </div>
            </div>
          </div>

          {/* Pinned Deal Card in Stream */}
          {currentStream.pinnedProduct && (
            <div className="p-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-[#FF7A00]/40 max-w-sm shadow-2xl flex items-center justify-between gap-3 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2.5 min-w-0">
                <img 
                  src={currentStream.pinnedProduct.image} 
                  alt={currentStream.pinnedProduct.title} 
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <span className="text-[9px] font-black uppercase text-rose-400 block tracking-wider">
                    লাইভ স্পট ছাড়
                  </span>
                  <p className="text-xs font-bold text-white truncate max-w-[140px]">
                    {currentStream.pinnedProduct.title}
                  </p>
                  <p className="text-xs font-black text-[#FF7A00]">
                    ৳{currentStream.pinnedProduct.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <button 
                onClick={handleBuyPinned}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-[#e06b00] hover:to-amber-600 text-white text-xs font-black shadow-lg shadow-[#FF7A00]/30 transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                কিনুন
              </button>
            </div>
          )}
        </div>

        {/* Floating Heart Reactions Animation */}
        <div className="absolute right-8 bottom-28 z-30 pointer-events-none w-20 h-80 overflow-hidden flex flex-col justify-end items-center">
          <AnimatePresence>
            {floatingHearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{ opacity: 1, y: 0, scale: 0.8, x: heart.x }}
                animate={{ opacity: 0, y: -260, scale: 1.5, x: heart.x * 2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute"
              >
                <Heart className="w-8 h-8 fill-current drop-shadow-lg" style={{ color: heart.color }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Live Chat & Real-Time Interaction Sidebar (Right on desktop) */}
      <div className="w-full lg:w-96 bg-[#11131e] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col h-72 lg:h-full">
        {/* Chat header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0e101a]">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#FF7A00]" />
            <span>লাইভ চ্যাট ও প্রশ্ন-উত্তর</span>
          </h3>
          <span className="text-[10px] text-zinc-400 font-bold bg-white/5 px-2 py-0.5 rounded-full">
            সরাসরি সেলার জবাব
          </span>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar text-xs">
          {currentStream.chatMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-2.5 rounded-2xl border transition-all ${
                msg.isSeller 
                  ? 'bg-[#FF7A00]/10 border-[#FF7A00]/30' 
                  : 'bg-white/[0.04] border-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className={`font-bold ${msg.isSeller ? 'text-[#FF7A00] flex items-center gap-1' : 'text-zinc-300'}`}>
                  {msg.user}
                  {msg.isSeller && <CheckCircle2 className="w-3 h-3 text-[#FF7A00]" />}
                </span>
                <span className="text-[9px] text-zinc-500">{msg.time}</span>
              </div>
              <p className="text-zinc-200 leading-relaxed text-xs">{msg.text}</p>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Chat Input & Floating Heart Trigger */}
        <div className="p-3 border-t border-white/10 bg-[#0c0e17] flex items-center gap-2">
          <form onSubmit={handleSend} className="flex-1 flex items-center gap-2">
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="সেলারকে কোনো প্রশ্ন লিখুন..."
              className="flex-1 px-4 py-2.5 rounded-full bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00]"
            />
            <button 
              type="submit"
              className="p-2.5 rounded-full bg-[#FF7A00] hover:bg-[#e06b00] text-white transition-all active:scale-95 cursor-pointer shrink-0"
              title="পাঠান"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Heart Send Button */}
          <button
            onClick={handleSendHeart}
            className="p-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 border border-rose-500/30 active:scale-90 transition-all cursor-pointer shrink-0"
            title="ভালোবাসা পাঠান"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
