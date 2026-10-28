import React, { useState } from 'react';
import { Plus, Play } from 'lucide-react';
import { RoleUploadModal } from '@/components/upload/RoleUploadModal';
import { useVideoStore } from '@/modules/video';
import { useNavigate } from 'react-router-dom';

export const StoryBar: React.FC<{ context?: string }> = ({ context }) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const navigate = useNavigate();
  const { reels } = useVideoStore();

  const defaultStories = [
    { 
      id: 'me', 
      name: 'আপনার স্টোরি', 
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      cover: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=300&q=80',
      isUser: true 
    },
    { 
      id: '1', 
      name: 'Anamika Fashion', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anamika',
      cover: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80',
      hasUnseen: true
    },
    { 
      id: '2', 
      name: 'Chakbazar Direct', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chakbazar',
      cover: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80',
      hasUnseen: true
    },
    { 
      id: '3', 
      name: 'Rahim Stores', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim',
      cover: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
      hasUnseen: true
    },
    { 
      id: '4', 
      name: 'Deshi Fabrics', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deshi',
      cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&q=80',
      hasUnseen: false
    },
    { 
      id: '5', 
      name: 'Khatunganj Hub', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khatunganj',
      cover: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&q=80',
      hasUnseen: false
    },
    { 
      id: '6', 
      name: 'Electronics BD', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Electronics',
      cover: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300&q=80',
      hasUnseen: false
    },
  ];

  const stories = context === 'video' ? [
    { 
      id: 'me', 
      name: 'রিলস আপলোড', 
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      cover: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=300&q=80',
      isUser: true 
    },
    ...reels.map(r => ({
      id: r.id,
      name: r.creator.name,
      avatar: r.creator.avatar,
      cover: r.thumbnail,
      hasUnseen: true,
      isReel: true,
      views: r.views
    }))
  ] : defaultStories;

  return (
    <>
      <div className="bg-[var(--pm-surface)] rounded-2xl border border-[var(--pm-border)] p-2.5 shadow-sm">
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory py-0.5">
          {stories.map((story: any) => {
            if (story.isUser) {
              return (
                <div
                  key={story.id}
                  onClick={() => setIsUploadOpen(true)}
                  className="w-[92px] sm:w-[108px] h-[140px] sm:h-[160px] rounded-2xl relative overflow-hidden shrink-0 snap-start cursor-pointer group border border-[var(--pm-border)] bg-[var(--pm-surface-hover)] transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-sm flex flex-col justify-between"
                >
                  <div className="relative h-[65%] w-full overflow-hidden bg-black/40">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-[var(--pm-accent)] text-white flex items-center justify-center border-2 border-[var(--pm-surface)] shadow-md group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5 stroke-[3]" />
                    </div>
                  </div>

                  <div className="h-[35%] w-full bg-[var(--pm-surface)] flex items-end justify-center pb-2 px-1 text-center">
                    <span className="text-[10px] font-black text-[var(--pm-text)] leading-tight">
                      {story.name}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={story.id}
                onClick={() => navigate('/video/shorts')}
                className="w-[92px] sm:w-[108px] h-[140px] sm:h-[160px] rounded-2xl relative overflow-hidden shrink-0 snap-start cursor-pointer group border border-white/10 shadow-sm transition-all duration-300 hover:scale-[1.03] active:scale-95 block"
              >
                <img
                  src={story.cover}
                  alt={story.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                <div
                  className={`absolute top-2 left-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full p-[2px] z-10 transition-transform duration-300 group-hover:scale-110 ${
                    story.hasUnseen
                      ? 'bg-gradient-to-tr from-[var(--pm-accent)] via-amber-400 to-rose-500 shadow-md'
                      : 'bg-white/30'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-[var(--pm-surface)] border border-black/40 overflow-hidden">
                    <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>

                {story.isReel && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] text-[#FF7A00] font-black flex items-center gap-0.5 z-10">
                    <Play className="w-2.5 h-2.5 fill-current" /> রিলস
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2 z-10">
                  <span className="text-[10px] font-black text-white leading-tight drop-shadow-md line-clamp-2 block">
                    {story.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <RoleUploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        defaultRole="reel"
      />
    </>
  );
};
