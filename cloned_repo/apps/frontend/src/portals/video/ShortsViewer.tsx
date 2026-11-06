import React, { useState, useRef, useEffect } from "react";
import { 
  Heart, MessageCircle, Share2, Volume2, VolumeX, ArrowLeft, 
  CheckCircle2, ChevronUp, ChevronDown, Play, Pause, ShoppingBag, 
  Store, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useVideoStore } from "@/modules/video";
import { ShoppableProductOverlay } from "@/modules/video/components/ShoppableProductOverlay";
import { VideoCommentsDrawer } from "@/modules/video/components/VideoCommentsDrawer";

export default function ShortsViewer() {
  const navigate = useNavigate();
  const { 
    reels, 
    activeReelIndex, 
    nextReel, 
    prevReel, 
    likedVideoIds, 
    toggleLike,
    followedCreatorIds,
    toggleFollow,
    isMuted,
    toggleMute
  } = useVideoStore();

  const currentReel = reels[activeReelIndex] || reels[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);

  const isLiked = currentReel ? likedVideoIds.includes(currentReel.id) : false;
  const isFollowing = currentReel ? followedCreatorIds.includes(currentReel.creator.id) : false;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [activeReelIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        nextReel();
      } else if (e.key === "ArrowUp") {
        prevReel();
      } else if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReelIndex, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.warn);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked && currentReel) {
      toggleLike(currentReel.id);
    }
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 800);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("রিলস লিংক কপি করা হয়েছে!");
    }
  };

  if (!currentReel) {
    return (
      <div className="h-[100dvh] w-full bg-black flex items-center justify-center text-white">
        <p className="text-xs text-zinc-400">রিলস লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex items-center justify-center text-white select-none">
      {/* Top Floating Back & Sound Controls */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-auto">
        <button 
          onClick={() => navigate("/video")}
          className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition-all active:scale-95 cursor-pointer border border-white/10"
          title="ফিরে যান"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-zinc-200">
            {activeReelIndex + 1} / {reels.length}
          </span>

          <button
            onClick={toggleMute}
            className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition-all active:scale-95 cursor-pointer border border-white/10"
            title={isMuted ? "সাউন্ড অন করুন" : "মিউট করুন"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-[#FF7A00]" />}
          </button>
        </div>
      </div>

      {/* Main Video Element */}
      <div 
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
        className="relative w-full max-w-md h-full flex items-center justify-center bg-black cursor-pointer overflow-hidden"
      >
        <video 
          ref={videoRef}
          src={currentReel.videoUrl} 
          loop
          muted={isMuted}
          playsInline
          autoPlay
          className="w-full h-full object-cover"
        />

        {/* Ambient Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/35 pointer-events-none" />

        {/* Play/Pause state indicator overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Double-tap floating heart animation */}
        <AnimatePresence>
          {showHeartPop && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.4, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <Heart className="w-28 h-28 text-rose-500 fill-current drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Content & Creator Info */}
        <div className="absolute bottom-6 left-4 right-18 z-30 space-y-3 pointer-events-auto text-left">
          {/* Creator Bar */}
          <div className="flex items-center gap-2.5">
            <img 
              src={currentReel.creator.avatar} 
              alt={currentReel.creator.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-[#FF7A00]"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-white drop-shadow-md">
                  {currentReel.creator.name}
                </span>
                {currentReel.creator.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A00]" />
                )}
              </div>
              <span className="text-[10px] text-zinc-300">
                {currentReel.creator.followers} ফলোয়ার • {currentReel.timeAgo || 'সম্প্রতি'}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFollow(currentReel.creator.id);
              }}
              className={`ml-2 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                isFollowing 
                  ? 'bg-white/20 text-white' 
                  : 'bg-[#FF7A00] hover:bg-[#e06b00] text-white shadow-md'
              }`}
            >
              {isFollowing ? 'ফলোয়িং' : 'ফলো'}
            </button>
          </div>

          {/* Caption */}
          <p className="text-xs text-white/95 leading-relaxed font-medium line-clamp-3 drop-shadow-md">
            {currentReel.title}
          </p>

          {/* Shoppable Product Banner Attached */}
          {currentReel.linkedProduct && (
            <div onClick={(e) => e.stopPropagation()} className="pt-1">
              <ShoppableProductOverlay 
                product={currentReel.linkedProduct} 
                variant="compact"
              />
            </div>
          )}
        </div>

        {/* Right Side Interaction Column */}
        <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-4 pointer-events-auto">
          {/* Like */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(currentReel.id);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className={`p-3 rounded-full backdrop-blur-md transition-all active:scale-90 ${
              isLiked 
                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' 
                : 'bg-black/50 text-white hover:bg-black/70 border border-white/10'
            }`}>
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentReel.likes}
            </span>
          </button>

          {/* Comments */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsCommentsOpen(true);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 border border-white/10 transition-all active:scale-90">
              <MessageCircle className="w-6 h-6 text-[#FF7A00]" />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentReel.commentsCount}
            </span>
          </button>

          {/* Share */}
          <button 
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 border border-white/10 transition-all active:scale-90">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow">
              {currentReel.shares}
            </span>
          </button>

          {/* Next / Prev Reel Arrows */}
          <div className="flex flex-col gap-1.5 pt-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                prevReel();
              }}
              disabled={activeReelIndex === 0}
              className="p-2 rounded-full bg-black/60 text-white disabled:opacity-30 hover:bg-black/90 border border-white/10 cursor-pointer"
              title="পূর্ববর্তী রিলস"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                nextReel();
              }}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-black/90 border border-white/10 cursor-pointer"
              title="পরবর্তী রিলস"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-in comments drawer */}
      <VideoCommentsDrawer 
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        videoId={currentReel.id}
        commentsCount={currentReel.commentsCount}
      />
    </div>
  );
}
