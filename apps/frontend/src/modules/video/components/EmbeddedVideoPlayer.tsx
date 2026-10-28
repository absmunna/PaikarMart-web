import React, { useState, useRef, useEffect } from 'react';
import { parseVideoUrl } from '../utils/parseVideoUrl';
import { VideoItem } from '../types';
import { Play, Pause, Volume2, VolumeX, Lock, Sparkles, ExternalLink, ShieldCheck, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useWalletStore } from '@/modules/wallet';

interface EmbeddedVideoPlayerProps {
  video: VideoItem;
  autoPlay?: boolean;
  className?: string;
  onUnlocked?: () => void;
}

export const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({
  video,
  autoPlay = false,
  className = '',
  onUnlocked
}) => {
  const { balance, updateBalance, addTransaction } = useWalletStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Paid Video Lock State (30-second preview rule)
  const isPaid = Boolean(video.isPaidContent);
  const price = video.priceAmount || 20;
  const [isUnlocked, setIsUnlocked] = useState(Boolean(video.isUnlockedByCurrentUser));
  const [showPaywall, setShowPaywall] = useState(false);

  // Parse source URL (YouTube / Facebook / Direct)
  const parsed = parseVideoUrl(video.videoUrl);

  // Handle direct video playback time updates for 30s preview limit on paid content
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      setCurrentTime(curr);

      // Enforce 30-second free preview for paid content
      if (isPaid && !isUnlocked && curr >= 30) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPaywall(true);
        toast.info("৩০ সেকেন্ড ফ্রি প্রিভিউ সমাপ্ত। সম্পূর্ণ ভিডিও দেখতে ওয়ালেট দিয়ে আনলক করুন!");
      }
    }
  };

  const handleUnlock = () => {
    if (balance < price) {
      toast.error(`আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। প্রয়োজন ৳${price}, বর্তমান ব্যালেন্স ৳${balance}`);
      return;
    }

    updateBalance(price, 'debit');
    addTransaction({
      type: 'debit',
      amount: price,
      label: `পেড ভিডিও আনলক: ${video.title.slice(0, 20)}...`,
      sublabel: 'PaikarMart Video OTT',
      status: 'success'
    });
    setIsUnlocked(true);
    setShowPaywall(false);
    toast.success(`৳${price} সফলভাবে পরিশোধ হয়েছে! সম্পূর্ণ ভিডিও আনলক করা হয়েছে।`);
    if (onUnlocked) onUnlocked();

    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (isPaid && !isUnlocked && currentTime >= 30) {
      setShowPaywall(true);
      return;
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // 1. YouTube Embedded Video Player
  if (parsed.externalSource === 'youtube') {
    return (
      <div className={`relative w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-white/10 ${className}`}>
        <div className="relative aspect-video w-full">
          <iframe
            src={parsed.embedUrl}
            title={video.title}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="px-3 py-1.5 bg-zinc-950 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="flex items-center gap-1 font-bold text-rose-400">
            <ExternalLink className="w-3 h-3" /> YouTube রিয়েল-টাইম এম্বেডেড প্লেয়ার
          </span>
          <span className="text-zinc-500 font-medium">ইন-অ্যাপ প্লেব্যাক সক্রিয়</span>
        </div>
      </div>
    );
  }

  // 2. Facebook Embedded Video Player
  if (parsed.externalSource === 'facebook') {
    return (
      <div className={`relative w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-white/10 ${className}`}>
        <div className="relative aspect-video w-full">
          <iframe
            src={parsed.embedUrl}
            title={video.title}
            className="absolute top-0 left-0 w-full h-full border-0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="px-3 py-1.5 bg-zinc-950 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="flex items-center gap-1 font-bold text-blue-400">
            <ExternalLink className="w-3 h-3" /> Facebook প্লাগইন ভিডিও প্লেয়ার
          </span>
          <span className="text-zinc-500 font-medium">ইন-অ্যাপ সেফ প্লেব্যাক</span>
        </div>
      </div>
    );
  }

  // 3. Direct Upload Native Video Player (Forced 1:1 Square Ratio)
  return (
    <div className={`relative w-full aspect-square max-w-[500px] mx-auto rounded-2xl overflow-hidden bg-black shadow-xl border border-white/10 group ${className}`}>
      <video
        ref={videoRef}
        src={parsed.embedUrl}
        poster={video.thumbnail}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        loop={!isPaid}
        playsInline
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />

      {/* Direct Upload 1:1 Screen Badge */}
      <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[9px] font-black text-amber-400 border border-amber-400/30 uppercase tracking-widest">
        ১:১ স্কয়ার ডিরেক্ট ভিডিও
      </span>

      {/* Paid Preview Indicator Badge */}
      {isPaid && !isUnlocked && (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-rose-500/90 text-white text-[10px] font-black shadow-md flex items-center gap-1 animate-pulse">
          <Lock className="w-3 h-3" />
          ৩০ সে: ফ্রি প্রিভিউ
        </span>
      )}

      {/* Basic HTML5 Play/Pause Controls Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer backdrop-blur-md"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
        </button>

        {/* Progress Bar */}
        <div className="flex-1 mx-3 h-1.5 bg-white/20 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-[#FF7A00]"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>

        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer backdrop-blur-md"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* 30-Second Preview Limit Paywall Overlay for Category 3 Paid Videos */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-20 bg-black/90 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center text-white"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-xl mb-3 border border-white/20">
              <Lock className="w-7 h-7" />
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider mb-2">
              পার্সোনাল ব্লগ ও পেড শো (৩-১০ মিনিট)
            </span>

            <h4 className="text-base font-black text-white mb-1">
              ৩০ সেকেন্ড ফ্রি প্রিভিউ সমাপ্ত!
            </h4>
            <p className="text-xs text-zinc-300 max-w-xs mb-4 leading-relaxed">
              সম্পূর্ণ পার্সোনাল কন্টেন্টটি উপভোগ করতে ওয়ালেট থেকে মাত্র ৳{price} টাকা পরিশোধ করুন।
            </p>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 w-full max-w-xs mb-4 flex items-center justify-between text-xs font-bold">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-400" /> বর্তমান ব্যালেন্স:
              </span>
              <span className="text-amber-400 font-black">৳{balance.toLocaleString('bn-BD')}</span>
            </div>

            <div className="flex gap-2.5 w-full max-w-xs">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play();
                    setIsPlaying(true);
                  }
                  setShowPaywall(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 text-xs font-bold transition-all cursor-pointer"
              >
                পুনরায় প্রিভিউ
              </button>
              <button
                onClick={handleUnlock}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-black shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>৳{price} আনলক</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
