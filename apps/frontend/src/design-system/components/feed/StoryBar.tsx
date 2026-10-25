import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';
import { useAuth } from '@/modules/auth';

interface StoryItem {
  id: string;
  isAddStory?: boolean;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  coverImage: string;
  hasUnseen?: boolean;
}

const mockStories: StoryItem[] = [
  {
    id: 'add-story',
    isAddStory: true,
    author: { id: 'user', name: 'আপনার স্টোরি', avatarUrl: '👤' },
    coverImage: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=300&q=80',
  },
  {
    id: '1',
    author: { id: 'v1', name: 'Fresh Valley', avatarUrl: '🥬' },
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80',
    hasUnseen: true,
  },
  {
    id: '2',
    author: { id: 'v2', name: 'Rahim Elec', avatarUrl: '🔌' },
    coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
    hasUnseen: true,
  },
  {
    id: '3',
    author: { id: 'v3', name: 'Boutique Hub', avatarUrl: '👗' },
    coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80',
    hasUnseen: true,
  },
  {
    id: '4',
    author: { id: 'v4', name: 'Tech Gear', avatarUrl: '💻' },
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&q=80',
    hasUnseen: false,
  },
  {
    id: '5',
    author: { id: 'v5', name: 'Daily Grocers', avatarUrl: '🍎' },
    coverImage: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&q=80',
    hasUnseen: false,
  },
  {
    id: '6',
    author: { id: 'v6', name: 'Sneakers Pro', avatarUrl: '👟' },
    coverImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300&q=80',
    hasUnseen: false,
  },
];

export const StoryBar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-[var(--pm-surface)] rounded-2xl border border-[var(--pm-border)] p-2.5 shadow-sm">
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory py-0.5">
        
        {/* Facebook Style Vertical Story Cards */}
        {mockStories.map((story) => {
          if (story.isAddStory) {
            return (
              <div
                key={story.id}
                className="w-[92px] sm:w-[108px] h-[140px] sm:h-[160px] rounded-2xl relative overflow-hidden shrink-0 snap-start cursor-pointer group border border-[var(--pm-border)] bg-[var(--pm-surface-hover)] transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-sm flex flex-col justify-between"
              >
                {/* Background User Cover / Avatar Preview */}
                <div className="relative h-[65%] w-full overflow-hidden bg-black/40">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName || 'User'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--pm-accent)]/30 to-purple-600/30 flex items-center justify-center text-3xl">
                      👤
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Floating Plus Badge */}
                <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-[var(--pm-accent)] text-white flex items-center justify-center border-2 border-[var(--pm-surface)] shadow-md group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5 stroke-[3]" />
                  </div>
                </div>

                {/* Add Story Label */}
                <div className="h-[35%] w-full bg-[var(--pm-surface)] flex items-end justify-center pb-2 px-1 text-center">
                  <span className="text-[10px] font-black text-[var(--pm-text)] leading-tight">
                    স্টোরি দিন
                  </span>
                </div>
              </div>
            );
          }

          const { author, coverImage, hasUnseen } = story;

          return (
            <Link
              key={story.id}
              to="/wholesale"
              className="w-[92px] sm:w-[108px] h-[140px] sm:h-[160px] rounded-2xl relative overflow-hidden shrink-0 snap-start cursor-pointer group border border-white/10 shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-95 block"
            >
              {/* Cover Image */}
              <img
                src={coverImage}
                alt={author.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

              {/* Top-Left Avatar Badge with Ring */}
              <div
                className={`absolute top-2 left-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full p-[2px] z-10 transition-transform duration-300 group-hover:scale-110 ${
                  hasUnseen
                    ? 'bg-gradient-to-tr from-[var(--pm-accent)] via-purple-500 to-pink-500 shadow-md'
                    : 'bg-white/30'
                }`}
              >
                <div className="w-full h-full rounded-full bg-[var(--pm-surface)] border border-black/40 flex items-center justify-center text-xs overflow-hidden font-bold">
                  {author.avatarUrl.length < 5 ? (
                    author.avatarUrl
                  ) : (
                    <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
                  )}
                </div>
              </div>

              {/* Unseen Live Dot Indicator */}
              {hasUnseen && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 border border-black animate-pulse z-10" />
              )}

              {/* Bottom Author Title */}
              <div className="absolute bottom-2 left-2 right-2 z-10">
                <span className="text-[10px] font-black text-white leading-tight drop-shadow-md line-clamp-2 block">
                  {author.name}
                </span>
              </div>
            </Link>
          );
        })}

      </div>
    </div>
  );
};

