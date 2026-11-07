import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Lock, Sparkles, ExternalLink, Wallet, Eye, Heart, Share2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useWalletStore } from '@/modules/wallet';
import { VideoItem } from '@/modules/video/types';
import { parseVideoUrl } from '@/modules/video/utils/parseVideoUrl';
import { useVideoAnalytics } from '@/modules/video/hooks/useVideoAnalytics';

export interface VideoPlayerProps {
  url?: string;
  videoUrl?: string;
  video?: VideoItem;
  poster?: string;
  thumbnail?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16';
  autoPlay?: boolean;
  playing?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  isPaidContent?: boolean;
  priceAmount?: number;
  previewDurationSeconds?: number;
  onUnlocked?: () => void;
  onEnded?: () => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  videoUrl,
  video,
  poster,
  thumbnail,
  aspectRatio,
  autoPlay = false,
  playing,
  controls = true,
  muted = false,
  loop = false,
  isPaidContent,
  priceAmount,
  previewDurationSeconds = 30,
  onUnlocked,
  onEnded,
  className = ''
}) => {
  const { balance, updateBalance, addTransaction } = useWalletStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Target URL & Metadata resolution
  const targetUrl = url || videoUrl || video?.videoUrl || '';
  const targetPoster = poster || thumbnail || video?.thumbnail || '';
  const targetTitle = video?.title || 'PaikarMart Video';

  // Category 3 Paid Content Config
  const isPaid = isPaidContent !== undefined ? isPaidContent : Boolean(video?.isPaidContent);
  const price = priceAmount || video?.priceAmount || 20;
  const [isUnlocked, setIsUnlocked] = useState(Boolean(video?.isUnlockedByCurrentUser));
  const [showPaywall, setShowPaywall] = useState(false);

  // Playback Control States
  const [isPlaying, setIsPlaying] = useState(playing !== undefined ? playing : autoPlay);
  const [isMutedState, setIsMutedState] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Detect external link vs direct video file
  const parsedInfo = parseVideoUrl(targetUrl);
  const isExternalEmbed = parsedInfo.isExternalLink;

  // Analytics Hook Integration
  const analytics = useVideoAnalytics(video?.id || targetUrl, video);

  // Auto increment view count once when playback starts
  useEffect(() => {
    if (isPlaying) {
      analytics.incrementView();
    }
  }, [isPlaying, analytics]);

  // Handle 30-Second Free Preview Limit for Paid Videos & Track Watch Time
  const checkPreviewLimit = (progressSeconds: number) => {
    setCurrentTime(progressSeconds);
    analytics.trackWatchProgress(progressSeconds);

    if (isPaid && !isUnlocked && progressSeconds >= previewDurationSeconds) {
      setIsPlaying(false);
      setShowPaywall(true);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      toast.info(`৩০ সেকেন্ড ফ্রি প্রিভিউ সমাপ্ত! সম্পূর্ণ ভিডিও দেখতে ৳${price} দিয়ে আনলক করুন।`);
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
      label: `পেড ভিডিও আনলক: ${targetTitle.slice(0, 20)}...`,
      sublabel: 'PaikarMart Super Wallet',
      status: 'success'
    });

    setIsUnlocked(true);
    setShowPaywall(false);
    setIsPlaying(true);
    toast.success(`৳${price} সফলভাবে পরিশোধ হয়েছে! সম্পূর্ণ ভিডিও আনলক করা হয়েছে।`);
    
    if (onUnlocked) onUnlocked();
    if (videoRef.current) {
      videoRef.current.play().catch(console.warn);
    }
  };

  const togglePlay = () => {
    if (isPaid && !isUnlocked && currentTime >= previewDurationSeconds) {
      setShowPaywall(true);
      return;
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(console.warn);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMutedState;
    }
    setIsMutedState(!isMutedState);
  };

  // Sync prop changes
  useEffect(() => {
    if (playing !== undefined) setIsPlaying(playing);
  }, [playing]);

  const PlayerComp = ReactPlayer as any;

  // Render 1: Embedded Video Link via react-player (YouTube / Facebook / Twitch / etc)
  if (isExternalEmbed) {
    return (
      <div 
        ref={playerContainerRef} 
        className={`relative w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 group ${className}`}
      >
        {/* Live Analytics Metrics Overlay Bar */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 flex items-center gap-1 shadow-md">
              <Eye className="w-3 h-3 text-[#FF7A00]" />
              <span>{analytics.views} ভিউ</span>
            </span>
            {analytics.watchTimeSeconds > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20 flex items-center gap-1 shadow-md">
                <Clock className="w-3 h-3" />
                <span>{analytics.formattedWatchTime} ওয়াচ টাইম</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={analytics.handleLike}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md border transition-all cursor-pointer shadow-md active:scale-95 ${
                analytics.isLiked
                  ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30 font-black'
                  : 'bg-black/80 text-zinc-300 border-white/10 hover:text-white'
              }`}
              title="পছন্দ করুন"
            >
              <Heart className={`w-3 h-3 ${analytics.isLiked ? 'fill-current text-white' : 'text-rose-400'}`} />
              <span>{analytics.likes}</span>
            </button>

            <button
              onClick={analytics.handleShare}
              className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-zinc-300 border border-white/10 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-md active:scale-95"
              title="শেয়ার ও লিংক কপি"
            >
              <Share2 className="w-3 h-3 text-cyan-400" />
              <span>{analytics.shares}</span>
            </button>
          </div>
        </div>
        <div className="relative aspect-video w-full">
          <PlayerComp
            url={targetUrl}
            playing={isPlaying}
            controls={controls}
            muted={isMutedState}
            loop={loop}
            width="100%"
            height="100%"
            onProgress={(state: any) => checkPreviewLimit(state?.playedSeconds || 0)}
            onEnded={onEnded}
            config={{
              youtube: { playerVars: { modestbranding: 1, rel: 0 } }
            }}
            className="react-player"
          />
        </div>

        {/* Source Badge */}
        <div className="px-3 py-1.5 bg-zinc-950/90 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="flex items-center gap-1.5 font-bold text-rose-400">
            <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
            <span>{parsedInfo.externalSource === 'youtube' ? 'YouTube' : 'Facebook'} এম্বেডেড ইন-অ্যাপ প্লেয়ার</span>
          </span>
          <span className="text-zinc-500 font-medium">অটোমেটেড স্মুথ ভিডিও</span>
        </div>

        {/* Paid Preview Overlay for ReactPlayer */}
        <AnimatePresence>
          {showPaywall && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-30 bg-black/92 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center text-white"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-xl mb-3 border border-white/20">
                <Lock className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider mb-2">
                পার্সোনাল ব্লগ ও পেড শো
              </span>
              <h4 className="text-base font-black text-white mb-1">
                ৩০ সেকেন্ড ফ্রি প্রিভিউ সমাপ্ত!
              </h4>
              <p className="text-xs text-zinc-300 max-w-xs mb-4 leading-relaxed">
                সম্পূর্ণ ভিডিওটি উপভোগ করতে ওয়ালেট থেকে মাত্র ৳{price} টাকা পরিশোধ করুন।
              </p>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 w-full max-w-xs mb-4 flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-amber-400" /> ওয়ালেট ব্যালেন্স:
                </span>
                <span className="text-amber-400 font-black">৳{balance.toLocaleString('bn-BD')}</span>
              </div>
              <button
                onClick={handleUnlock}
                className="w-full max-w-xs py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-black shadow-lg shadow-amber-500/25 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>৳{price} ওয়ালেট আনলক</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Render 2: Direct Upload Video via Standard HTML5 <video> Tag (Enforced 1:1 Aspect Ratio)
  const ratioClass = aspectRatio === '9:16' ? 'aspect-[9/16]' : aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square max-w-[500px]';

  return (
    <div 
      ref={playerContainerRef}
      className={`relative w-full ${ratioClass} mx-auto rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 group ${className}`}
    >
      {/* Live Analytics Metrics Overlay Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 flex items-center gap-1 shadow-md">
            <Eye className="w-3 h-3 text-[#FF7A00]" />
            <span>{analytics.views} ভিউ</span>
          </span>
          {analytics.watchTimeSeconds > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20 flex items-center gap-1 shadow-md">
              <Clock className="w-3 h-3" />
              <span>{analytics.formattedWatchTime} ওয়াচ টাইম</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={analytics.handleLike}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md border transition-all cursor-pointer shadow-md active:scale-95 ${
              analytics.isLiked
                ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30 font-black'
                : 'bg-black/80 text-zinc-300 border-white/10 hover:text-white'
            }`}
            title="পছন্দ করুন"
          >
            <Heart className={`w-3 h-3 ${analytics.isLiked ? 'fill-current text-white' : 'text-rose-400'}`} />
            <span>{analytics.likes}</span>
          </button>

          <button
            onClick={analytics.handleShare}
            className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-zinc-300 border border-white/10 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-md active:scale-95"
            title="শেয়ার ও লিংক কপি"
          >
            <Share2 className="w-3 h-3 text-cyan-400" />
            <span>{analytics.shares}</span>
          </button>
        </div>
      </div>

      <video
        ref={videoRef}
        src={targetUrl}
        poster={targetPoster}
        autoPlay={autoPlay}
        muted={isMutedState}
        loop={loop && !isPaid}
        playsInline
        onTimeUpdate={() => {
          if (videoRef.current) {
            checkPreviewLimit(videoRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onEnded={onEnded}
        onClick={togglePlay}
        className="w-full h-full object-cover"
      />

      {/* Direct Upload 1:1 Ratio Badge */}
      <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[9px] font-black text-amber-400 border border-amber-400/30 uppercase tracking-widest pointer-events-none">
        ১:১ স্কয়ার ডিরেক্ট ভিডিও
      </span>

      {/* Paid Preview Indicator Badge */}
      {isPaid && !isUnlocked && (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-rose-500/90 text-white text-[10px] font-black shadow-md flex items-center gap-1 animate-pulse pointer-events-none">
          <Lock className="w-3 h-3" />
          ৩০ সে: ফ্রি প্রিভিউ
        </span>
      )}

      {/* HTML5 Controls Overlay */}
      {controls && (
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={togglePlay}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white cursor-pointer backdrop-blur-md transition-all active:scale-95"
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
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white cursor-pointer backdrop-blur-md transition-all active:scale-95"
          >
            {isMutedState ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* 30-Second Preview Limit Paywall Overlay */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-30 bg-black/92 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center text-white"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-xl mb-3 border border-white/20">
              <Lock className="w-7 h-7" />
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider mb-2">
              পার্সোনাল ব্লগ ও পেড শো
            </span>

            <h4 className="text-base font-black text-white mb-1">
              ৩০ সেকেন্ড ফ্রি প্রিভিউ সমাপ্ত!
            </h4>
            <p className="text-xs text-zinc-300 max-w-xs mb-4 leading-relaxed">
              সম্পূর্ণ পার্সোনাল কন্টেন্টটি উপভোগ করতে ওয়ালেট থেকে মাত্র ৳{price} টাকা পরিশোধ করুন।
            </p>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 w-full max-w-xs mb-4 flex items-center justify-between text-xs font-bold">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-400" /> ওয়ালেট ব্যালেন্স:
              </span>
              <span className="text-amber-400 font-black">৳{balance.toLocaleString('bn-BD')}</span>
            </div>

            <div className="flex gap-2.5 w-full max-w-xs">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play().catch(console.warn);
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
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white text-xs font-black shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
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

export default VideoPlayer;
