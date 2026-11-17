import React from 'react';
import { Plus } from 'lucide-react';
import { Story, User } from '@/types';

interface StoriesTrayProps {
  stories: Story[];
  currentUser: User;
  onSelectStory?: (story: Story) => void;
}

export const StoriesTray: React.FC<StoriesTrayProps> = ({
  stories,
  currentUser,
  onSelectStory,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-2 min-w-max px-0.5">
        
        {/* Create Story Card */}
        <div className="relative w-24 sm:w-32 h-36 sm:h-48 rounded-2xl overflow-hidden bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs flex flex-col justify-between shrink-0 group cursor-pointer">
          <div className="h-24 sm:h-32 w-full overflow-hidden">
            <img
              src={currentUser.avatar}
              alt="Create Story"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="relative h-12 bg-[var(--pm-card)] flex flex-col items-center justify-end pb-1.5 px-1">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center ring-4 ring-[var(--pm-card)] shadow-xs group-hover:bg-[var(--pm-accent-hover)] transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-[var(--pm-text)] truncate w-full text-center">
              Create Story
            </span>
          </div>
        </div>

        {/* Friend / Brand Stories */}
        {stories.filter(s => s.id !== 'story_user').map((story) => (
          <div
            key={story.id}
            onClick={() => onSelectStory && onSelectStory(story)}
            className="relative w-24 sm:w-32 h-36 sm:h-48 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs shrink-0 group cursor-pointer border border-[var(--pm-border)] transition-all active:scale-[0.98]"
          >
            {/* Story Backdrop Image */}
            {story.mediaUrl ? (
              <img
                src={story.mediaUrl}
                alt={story.authorName}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-[var(--pm-accent)]" />
            )}

            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Author Avatar */}
            <div className="absolute top-2.5 left-2.5">
              <img
                src={story.authorAvatar}
                alt={story.authorName}
                referrerPolicy="no-referrer"
                className={`w-9 h-9 rounded-full object-cover ring-2 ${
                  story.isLive ? 'ring-red-500' : 'ring-[var(--pm-accent)]'
                }`}
              />
              {story.isLive && (
                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-red-600 text-white text-[8px] font-bold uppercase">
                  Live
                </span>
              )}
            </div>

            {/* Author Name */}
            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-[11px] font-bold text-white drop-shadow-xs truncate">
                {story.authorName}
              </p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};
