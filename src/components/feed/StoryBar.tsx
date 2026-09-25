import React from 'react';
import { Link } from 'react-router-dom';

const mockStories = [
  { id: '1', author: { id: 'v1', name: 'Fresh Valley', avatarUrl: '🥬' } },
  { id: '2', author: { id: 'v2', name: 'Rahim Elec', avatarUrl: '🔌' } },
  { id: '3', author: { id: 'v3', name: 'Boutique', avatarUrl: '👗' } },
  { id: '4', author: { id: 'v4', name: 'Tech Gear', avatarUrl: '💻' } },
  { id: '5', author: { id: 'v5', name: 'Daily Grocers', avatarUrl: '🍎' } },
  { id: '6', author: { id: 'v6', name: 'Sneakers Pro', avatarUrl: '👟' } },
];

export const StoryBar = () => {
  return (
    <div className="bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] shadow-sm p-3">
      <div className="flex overflow-x-auto gap-4 hide-scrollbar snap-x snap-mandatory">
        {mockStories.map((story) => {
          const author = story.author;
          return (
            <Link
              key={story.id}
              to={`/wholesale`}
              className="flex flex-col items-center gap-2 shrink-0 group snap-start cursor-pointer"
            >
              <div className="rounded-full p-[2.5px] bg-gradient-to-tr from-[var(--pm-accent)] via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                <div className="h-14 w-14 rounded-full border-2 border-[var(--pm-bg)] bg-[var(--pm-surface-hover)] flex items-center justify-center text-2xl overflow-hidden">
                  {author.avatarUrl.length < 5 ? (
                    author.avatarUrl
                  ) : (
                    <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
              <span className="text-[10px] font-bold text-[var(--pm-text)] w-16 truncate text-center leading-tight">
                {author.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
