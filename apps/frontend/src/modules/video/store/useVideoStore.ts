import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VideoItem, LiveStreamSession, VideoUploadPayload } from '../types';
import { videoService, INITIAL_VIDEOS, INITIAL_REELS, INITIAL_LIVE_STREAMS } from '../services/videoService';

interface VideoState {
  videos: VideoItem[];
  reels: VideoItem[];
  liveStreams: LiveStreamSession[];
  activeReelIndex: number;
  isMuted: boolean;
  likedVideoIds: string[];
  savedVideoIds: string[];
  followedCreatorIds: string[];
  watchTimeMap: Record<string, number>; // videoId -> accumulated watch seconds
  viewedVideoIds: string[]; // tracked viewed video IDs in current session
  selectedCategory: string;
  searchQuery: string;
  activeVideo: VideoItem | null;
  isLoading: boolean;

  // Actions
  fetchVideos: () => Promise<void>;
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  toggleFollow: (creatorId: string) => void;
  incrementViewCount: (id: string) => void;
  incrementShareCount: (id: string) => void;
  trackWatchTime: (id: string, seconds: number) => void;
  toggleMute: () => void;
  nextReel: () => void;
  prevReel: () => void;
  setReelIndex: (index: number) => void;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
  setActiveVideo: (video: VideoItem | null) => void;
  addVideo: (payload: VideoUploadPayload) => Promise<VideoItem>;
  addLiveComment: (streamId: string, user: string, text: string) => void;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
      videos: INITIAL_VIDEOS,
      reels: INITIAL_REELS,
      liveStreams: INITIAL_LIVE_STREAMS,
      activeReelIndex: 0,
      isMuted: true, // Default muted for smooth browser autoplay policies
      likedVideoIds: ['reel-1', 'v-whl-1'],
      savedVideoIds: ['v-whl-1'],
      followedCreatorIds: ['creator-islampur'],
      watchTimeMap: {},
      viewedVideoIds: [],
      selectedCategory: 'all',
      searchQuery: '',
      activeVideo: null,
      isLoading: false,

      fetchVideos: async () => {
        set({ isLoading: true });
        try {
          const { selectedCategory, searchQuery } = get();
          const items = await videoService.getVideos({
            category: selectedCategory,
            search: searchQuery
          });
          const reels = await videoService.getReels();
          const live = await videoService.getLiveStreams();
          set({ videos: items, reels, liveStreams: live, isLoading: false });
        } catch (e) {
          console.warn("fetchVideos error:", e);
          set({ isLoading: false });
        }
      },

      toggleLike: (id: string) => {
        const { likedVideoIds, videos, reels } = get();
        const isLiked = likedVideoIds.includes(id);
        const updatedLiked = isLiked 
          ? likedVideoIds.filter(i => i !== id) 
          : [...likedVideoIds, id];

        const updateItem = (item: VideoItem) => {
          if (item.id === id) {
            return {
              ...item,
              likes: isLiked ? Math.max(0, item.likes - 1) : item.likes + 1
            };
          }
          return item;
        };

        set({
          likedVideoIds: updatedLiked,
          videos: videos.map(updateItem),
          reels: reels.map(updateItem)
        });
      },

      toggleSave: (id: string) => {
        const { savedVideoIds } = get();
        const isSaved = savedVideoIds.includes(id);
        set({
          savedVideoIds: isSaved 
            ? savedVideoIds.filter(i => i !== id) 
            : [...savedVideoIds, id]
        });
      },

      toggleFollow: (creatorId: string) => {
        const { followedCreatorIds } = get();
        const isFollowing = followedCreatorIds.includes(creatorId);
        set({
          followedCreatorIds: isFollowing
            ? followedCreatorIds.filter(i => i !== creatorId)
            : [...followedCreatorIds, creatorId]
        });
      },

      incrementViewCount: (id: string) => {
        const { viewedVideoIds, videos, reels } = get();
        if (viewedVideoIds.includes(id)) return; // View already counted in session

        const updateItem = (item: VideoItem) => {
          if (item.id === id) {
            let numericViews = typeof item.views === 'number' ? item.views : parseInt(item.views) || 100;
            return {
              ...item,
              views: numericViews + 1
            };
          }
          return item;
        };

        set({
          viewedVideoIds: [...viewedVideoIds, id],
          videos: videos.map(updateItem),
          reels: reels.map(updateItem)
        });
      },

      incrementShareCount: (id: string) => {
        const { videos, reels } = get();
        const updateItem = (item: VideoItem) => {
          if (item.id === id) {
            return {
              ...item,
              shares: (item.shares || 0) + 1
            };
          }
          return item;
        };

        set({
          videos: videos.map(updateItem),
          reels: reels.map(updateItem)
        });
      },

      trackWatchTime: (id: string, seconds: number) => {
        const { watchTimeMap } = get();
        const currentAccumulated = watchTimeMap[id] || 0;
        set({
          watchTimeMap: {
            ...watchTimeMap,
            [id]: Math.max(currentAccumulated, Math.floor(seconds))
          }
        });
      },

      toggleMute: () => {
        set(state => ({ isMuted: !state.isMuted }));
      },

      nextReel: () => {
        const { activeReelIndex, reels } = get();
        if (activeReelIndex < reels.length - 1) {
          set({ activeReelIndex: activeReelIndex + 1 });
        } else {
          set({ activeReelIndex: 0 }); // Loop back
        }
      },

      prevReel: () => {
        const { activeReelIndex } = get();
        if (activeReelIndex > 0) {
          set({ activeReelIndex: activeReelIndex - 1 });
        }
      },

      setReelIndex: (index: number) => {
        set({ activeReelIndex: index });
      },

      setSelectedCategory: (cat: string) => {
        set({ selectedCategory: cat });
        get().fetchVideos();
      },

      setSearchQuery: (q: string) => {
        set({ searchQuery: q });
      },

      setActiveVideo: (video: VideoItem | null) => {
        set({ activeVideo: video });
      },

      addVideo: async (payload: VideoUploadPayload) => {
        const newItem = await videoService.uploadVideo(payload);
        if (payload.isShort) {
          set(state => ({ reels: [newItem, ...state.reels] }));
        } else {
          set(state => ({ videos: [newItem, ...state.videos] }));
        }
        return newItem;
      },

      addLiveComment: (streamId: string, user: string, text: string) => {
        set(state => ({
          liveStreams: state.liveStreams.map(s => {
            if (s.id === streamId) {
              const newMsg = {
                id: `msg-${Date.now()}`,
                user,
                text,
                time: "Just now"
              };
              return {
                ...s,
                chatMessages: [...s.chatMessages, newMsg]
              };
            }
            return s;
          })
        }));
      }
    }),
    {
      name: 'paikarmart-video-storage',
      partialize: (state) => ({
        likedVideoIds: state.likedVideoIds,
        savedVideoIds: state.savedVideoIds,
        followedCreatorIds: state.followedCreatorIds,
        watchTimeMap: state.watchTimeMap,
        isMuted: state.isMuted
      })
    }
  )
);
