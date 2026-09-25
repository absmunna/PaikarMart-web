import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { RoleUploadModal } from '../components/upload/RoleUploadModal';

export const StoryBar: React.FC<{ context: string }> = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const stories = [
    { id: 'me', name: 'Your Story', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', isUser: true },
    { id: '1', name: 'Anamika', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anamika' },
    { id: '2', name: 'Chakbazar Direct', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chakbazar' },
    { id: '3', name: 'Rahim Stores', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahim' },
    { id: '4', name: 'Deshi Fabrics', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deshi' },
    { id: '5', name: 'Khatunganj Hub', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khatunganj' },
    { id: '6', name: 'Electronics BD', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Electronics' },
    { id: '7', name: 'Pure Food BD', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PureFood' },
  ];

  return (
    <>
      <div className="flex gap-4 overflow-x-auto py-3 px-1 no-scrollbar items-center">
        {stories.map((story) => (
          <div 
            key={story.id} 
            onClick={() => story.isUser && setIsUploadOpen(true)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          >
            <div className="relative">
              <div className={`w-16 h-16 rounded-full p-0.5 ${story.isUser ? 'border-2 border-dashed border-[#FF7A00]' : 'bg-gradient-to-tr from-[#FF7A00] via-[#FFD700] to-orange-400'}`}>
                <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden border-2 border-[#0f111a]">
                  <img src={story.avatar} alt={story.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              {story.isUser && (
                <div className="absolute bottom-0 right-0 bg-[#FF7A00] text-white p-1 rounded-full border-2 border-[#0f111a] shadow-sm">
                  <Plus className="w-3 h-3" />
                </div>
              )}
            </div>
            <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white max-w-[68px] truncate text-center">
              {story.name}
            </span>
          </div>
        ))}
      </div>

      <RoleUploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        defaultRole="reel"
      />
    </>
  );
};
