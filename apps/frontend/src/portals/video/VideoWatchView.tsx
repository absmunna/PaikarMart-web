import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, Pause, Volume2, VolumeX, Heart, Share2, Bookmark, 
  ArrowLeft, CheckCircle2, Eye, Sparkles, MessageCircle, 
  ShoppingBag, Store, Clock, ThumbsUp, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useVideoStore } from '@/modules/video';
import { ShoppableProductOverlay } from '@/modules/video/components/ShoppableProductOverlay';
import { ShoppableVideoCard } from '@/modules/video/components/ShoppableVideoCard';
import { VideoPlayer, VideoCommentsSection } from '@/components/video';
import { VideoCommentsDrawer } from '@/modules/video/components/VideoCommentsDrawer';
import { VideoItem } from '@/modules/video/types';

export default function VideoWatchView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    videos, 
    reels,
    likedVideoIds, 
    savedVideoIds, 
    followedCreatorIds,
    toggleLike, 
    toggleSave, 
    toggleFollow,
    fetchVideos
  } = useVideoStore();

  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    const all = [...videos, ...reels];
    const found = all.find(v => v.id === id);
    if (found) {
      setCurrentVideo(found);
    } else if (videos.length > 0) {
      setCurrentVideo(videos[0]);
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, videos, reels]);

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-[#0d0f18] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">ভিডিও লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const isLiked = likedVideoIds.includes(currentVideo.id);
  const isSaved = savedVideoIds.includes(currentVideo.id);
  const isFollowing = followedCreatorIds.includes(currentVideo.creator.id);
  const relatedVideos = videos.filter(v => v.id !== currentVideo.id).slice(0, 6);

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

  const toggleMuteAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("ভিডিও লিংক কপি করা হয়েছে!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-white pb-24">
      {/* Top back navigation bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between border-b border-white/5">
        <button
          onClick={() => navigate('/video')}
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ভিডিও হাবে ফিরে যান</span>
        </button>

        <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
          <span>PaikarMart Commerce OTT</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Video & Content Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player Box with react-player YouTube/Facebook Auto Embed & 1:1 Direct Upload Support */}
          <div className="relative w-full">
            <VideoPlayer video={currentVideo} autoPlay />

            {/* Attached Shoppable Product Overlay Inside Video Player */}
            {currentVideo.linkedProduct && (
              <div className="mt-3 hidden sm:block">
                <ShoppableProductOverlay 
                  product={currentVideo.linkedProduct} 
                  variant="banner"
                />
              </div>
            )}
          </div>

          {/* Attached Product Banner on Mobile below video */}
          {currentVideo.linkedProduct && (
            <div className="block sm:hidden">
              <ShoppableProductOverlay 
                product={currentVideo.linkedProduct} 
                variant="banner"
              />
            </div>
          )}

          {/* Video Title & Primary Metadata */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-[10px] font-black uppercase tracking-wider border border-[#FF7A00]/30">
                {currentVideo.category}
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#FF7A00]" /> {currentVideo.views} ভিউ
              </span>
              <span className="text-zinc-500 text-xs">•</span>
              <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {currentVideo.timeAgo || 'সম্প্রতি'}
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl font-black text-white leading-snug">
              {currentVideo.title}
            </h1>

            {/* Interaction Bar: Like, Share, Save, Comments */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 pb-4 border-b border-white/10">
              {/* Creator details */}
              <div className="flex items-center gap-3">
                <Link to={`/video/channel/${currentVideo.creator.id}`}>
                  <img 
                    src={currentVideo.creator.avatar} 
                    alt={currentVideo.creator.name} 
                    className="w-11 h-11 rounded-full object-cover border-2 border-white/10 hover:border-[#FF7A00] transition-colors"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <div>
                  <Link 
                    to={`/video/channel/${currentVideo.creator.id}`}
                    className="flex items-center gap-1 font-bold text-sm text-white hover:text-[#FF7A00] transition-colors"
                  >
                    <span>{currentVideo.creator.name}</span>
                    {currentVideo.creator.verified && <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />}
                  </Link>
                  <span className="text-[11px] text-zinc-400 block">
                    {currentVideo.creator.followers} সাবস্ক্রাইবার • {currentVideo.creator.location || 'বাংলাদেশ'}
                  </span>
                </div>
                <button
                  onClick={() => toggleFollow(currentVideo.creator.id)}
                  className={`ml-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isFollowing 
                      ? 'bg-white/10 text-zinc-300 hover:bg-white/15'
                      : 'bg-[#FF7A00] hover:bg-[#e06b00] text-white shadow-md shadow-[#FF7A00]/25'
                  }`}
                >
                  {isFollowing ? 'ফলোয়িং' : 'ফলো করুন'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLike(currentVideo.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isLiked 
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : 'bg-zinc-900 text-zinc-300 border-white/10 hover:bg-zinc-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{currentVideo.likes}</span>
                </button>

                <button
                  onClick={() => setIsCommentsOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 text-xs font-bold transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#FF7A00]" />
                  <span>{currentVideo.commentsCount}</span>
                </button>

                <button
                  onClick={() => toggleSave(currentVideo.id)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isSaved 
                      ? 'bg-[#FF7A00]/20 text-[#FF7A00] border-[#FF7A00]/40' 
                      : 'bg-zinc-900 text-zinc-300 border-white/10 hover:bg-zinc-800'
                  }`}
                  title="সেভ করুন"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 text-xs font-bold transition-all cursor-pointer"
                  title="শেয়ার করুন"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">শেয়ার</span>
                </button>
              </div>
            </div>

            {/* Description Box with Expand Toggle */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
              <p className={`text-xs text-zinc-300 leading-relaxed font-normal ${showFullDesc ? '' : 'line-clamp-2'}`}>
                {currentVideo.description}
              </p>
              
              {currentVideo.tags && currentVideo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentVideo.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] text-[#FF7A00] font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-[11px] font-bold text-[#FF7A00] hover:underline flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>{showFullDesc ? 'সংক্ষেপে দেখুন' : 'আরও বিস্তারিত দেখুন'}</span>
                {showFullDesc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Product Feature Full Banner */}
            {currentVideo.linkedProduct && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>লাইভ ভিডিও থেকে সরাসরি অর্ডার করুন</span>
                </h3>
                <ShoppableProductOverlay 
                  product={currentVideo.linkedProduct} 
                  variant="banner"
                />
              </div>
            )}

            {/* Nested Video Comments & Discussion Section */}
            <VideoCommentsSection videoId={currentVideo.id} />
          </div>
        </div>

        {/* Sidebar Column: Related Commerce Videos (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF7A00]" />
              <span>সম্পর্কিত পাইকারি ভিডিও</span>
            </h3>
            <span className="text-[10px] text-zinc-400 font-bold">
              {relatedVideos.length} টি ভিডিও
            </span>
          </div>

          <div className="space-y-4">
            {relatedVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => navigate(`/video/watch/${video.id}`)}
                className="group flex gap-3 p-2 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900 border border-white/5 hover:border-white/15 transition-all cursor-pointer"
              >
                <div className="relative w-36 aspect-video rounded-xl overflow-hidden bg-black shrink-0">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    referrerPolicy="no-referrer"
                  />
                  {video.duration && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-white text-[9px] font-mono font-bold">
                      {video.duration}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-between min-w-0 py-0.5">
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-[#FF7A00] transition-colors">
                      {video.title}
                    </h4>
                    <span className="text-[10px] text-zinc-400 block mt-1 truncate">
                      {video.creator.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <span>{video.views} ভিউ</span>
                    <span>•</span>
                    <span>{video.timeAgo || 'সম্প্রতি'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide-out comments drawer */}
      <VideoCommentsDrawer 
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        videoId={currentVideo.id}
        commentsCount={currentVideo.commentsCount}
      />
    </div>
  );
}
