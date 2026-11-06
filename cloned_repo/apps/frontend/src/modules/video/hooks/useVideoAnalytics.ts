import { useEffect, useMemo, useCallback } from 'react';
import { useVideoStore } from '../store/useVideoStore';
import { VideoItem } from '../types';
import { toast } from 'sonner';

export interface UseVideoAnalyticsReturn {
  views: string | number;
  rawViews: number;
  likes: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  watchTimeSeconds: number;
  formattedWatchTime: string;
  incrementView: () => void;
  handleLike: () => void;
  handleSave: () => void;
  handleShare: () => void;
  trackWatchProgress: (seconds: number) => void;
}

export function formatSecondsToTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function useVideoAnalytics(
  videoId: string,
  initialVideo?: VideoItem
): UseVideoAnalyticsReturn {
  const {
    videos,
    reels,
    likedVideoIds,
    savedVideoIds,
    watchTimeMap,
    toggleLike,
    toggleSave,
    incrementViewCount,
    incrementShareCount,
    trackWatchTime
  } = useVideoStore();

  // Find target video item from store or fallback
  const videoItem = useMemo(() => {
    const all = [...videos, ...reels];
    return all.find(v => v.id === videoId) || initialVideo;
  }, [videos, reels, videoId, initialVideo]);

  const isLiked = likedVideoIds.includes(videoId);
  const isSaved = savedVideoIds.includes(videoId);
  const watchTimeSeconds = watchTimeMap[videoId] || 0;

  const views = videoItem?.views || '1.2K';
  const rawViews = typeof views === 'number' ? views : parseInt(views) || 1200;
  const likes = videoItem?.likes || 0;
  const shares = videoItem?.shares || 0;

  // Auto-increment view once when component mounts or video plays
  const incrementView = useCallback(() => {
    if (videoId) {
      incrementViewCount(videoId);
    }
  }, [videoId, incrementViewCount]);

  const handleLike = useCallback(() => {
    if (videoId) {
      toggleLike(videoId);
    }
  }, [videoId, toggleLike]);

  const handleSave = useCallback(() => {
    if (videoId) {
      toggleSave(videoId);
      toast.success(isSaved ? 'সেভ অপশন বাতিল করা হয়েছে' : 'ভিডিওটি সেভ করা হয়েছে!');
    }
  }, [videoId, isSaved, toggleSave]);

  const handleShare = useCallback(() => {
    if (videoId) {
      incrementShareCount(videoId);
      const shareUrl = `${window.location.origin}/video/watch/${videoId}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        toast.success('ভিডিও লিংক কপি করা হয়েছে!');
      }
    }
  }, [videoId, incrementShareCount]);

  const trackWatchProgress = useCallback((seconds: number) => {
    if (videoId && seconds > 0) {
      trackWatchTime(videoId, seconds);
    }
  }, [videoId, trackWatchTime]);

  const formattedWatchTime = useMemo(() => {
    return formatSecondsToTime(watchTimeSeconds);
  }, [watchTimeSeconds]);

  return {
    views,
    rawViews,
    likes,
    shares,
    isLiked,
    isSaved,
    watchTimeSeconds,
    formattedWatchTime,
    incrementView,
    handleLike,
    handleSave,
    handleShare,
    trackWatchProgress
  };
}
