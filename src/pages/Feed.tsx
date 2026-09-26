import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, ShoppingBag, Star } from 'lucide-react';
import { HeroBanner, StatsRow, CategorySection } from '../components/home/HomeFeatures';
import { useLocationStore } from '../modules/location/locationStore';
import { StoryBar } from '../components/feed/StoryBar';
import { CreatePostComposer } from '../components/feed/CreatePostComposer';
import { TrendingRail } from '../components/feed/TrendingRail';

const posts = [
  {
    id: 1,
    user: { name: 'Fresh Valley Farm', avatar: '🥬', type: 'Seller', location: 'Savara, Dhaka' },
    content: 'Just harvested fresh organic spinach! Special wholesale price for today. 🥬✨',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=640&auto=format&fit=crop',
    likes: '1.2k',
    comments: '45',
    isPromoted: true
  },
  {
    id: 2,
    user: { name: 'Rahim Electronics', avatar: '🔌', type: 'Shop', location: 'Chittagong' },
    content: 'New arrivals! Smart watch series 9 is now in stock. Visit us for an exclusive demo. ⌚',
    image: 'https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=640&auto=format&fit=crop',
    likes: '850',
    comments: '12',
    isPromoted: false
  },
  {
    id: 3,
    user: { name: 'Sarah\'s Boutique', avatar: '👗', type: 'Boutique', location: 'Sylhet' },
    content: 'Our latest Nakshi designs are here. Hand-stitched with love. ❤️',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=640&auto=format&fit=crop',
    likes: '2.5k',
    comments: '128',
    isPromoted: true
  }
];

const FilterChip: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${active
        ? 'bg-[var(--pm-accent)] text-white border-[var(--pm-accent)] shadow-md'
        : 'bg-[var(--pm-surface)] text-[var(--pm-text-muted)] border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)]'
      }`}
  >
    {label}
  </button>
);

export default function Feed() {
  const { city } = useLocationStore();
  const [activeFilter, setActiveFilter] = useState('সব');
  const filters = ['সব', 'শপ', 'অফার', 'লোকাল', 'পাইকারি'];

  // Location-based filtering logic
  const filteredPosts = posts.filter(post => {
    const matchesFilter = activeFilter === 'সব' || post.user.type.includes(activeFilter);
    // Show posts from the same city OR promoted posts from anywhere
    const matchesLocation = post.user.location.toLowerCase().includes(city.toLowerCase()) || post.isPromoted;
    return matchesFilter && matchesLocation;
  });

  return (
    <div className="flex flex-col gap-4 pb-10">
      <HeroBanner />
      <StatsRow />
      <CategorySection />
      
      {/* Horizontal Filters */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar sticky top-[60px] bg-[var(--pm-surface)]/80 backdrop-blur-xl z-20 border-b border-[var(--pm-border)]">
        {filters.map(f => (
          <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
        ))}
      </div>

      {/* Feed Layout */}
      <div className="px-4 flex flex-col lg:flex-row gap-6">
        {/* Main Feed Column */}
        <div className="flex-1 min-w-0 max-w-2xl w-full flex flex-col gap-6">
          <StoryBar />
          <CreatePostComposer />
          
          <div className="space-y-6">
            {filteredPosts.length > 0 ? filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            className="bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--pm-accent)] to-[var(--pm-accent-2)] flex items-center justify-center text-xl shadow-inner">
                  {post.user.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-[var(--pm-text)] leading-none">{post.user.name}</h3>
                    {post.isPromoted && (
                      <span className="text-[8px] font-black uppercase bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] px-1.5 py-0.5 rounded-full">সুপারিশকৃত</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-[var(--pm-text-muted)]" />
                    <span className="text-[10px] text-[var(--pm-text-muted)]">{post.user.location}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-[var(--pm-text-muted)] hover:bg-[var(--pm-surface-hover)] rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <p className="text-sm text-[var(--pm-text)] leading-relaxed">{post.content}</p>
            </div>

            {/* Media */}
            {post.image && (
              <div className="aspect-[4/3] w-full overflow-hidden border-y border-[var(--pm-border)]">
                <img
                  src={post.image}
                  alt="Post media"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Actions */}
            <div className="p-4 border-t border-[var(--pm-border)]/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-[var(--pm-text-muted)] hover:text-red-500 transition-colors group">
                  <Heart className="w-5 h-5 group-active:scale-125 transition-transform" />
                  <span className="text-xs font-bold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-[var(--pm-text-muted)] hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-xs font-bold">{post.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 text-[var(--pm-text-muted)] hover:text-green-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <button className="bg-[var(--pm-accent)] text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5" /> কিনুন
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="p-10 text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[var(--pm-surface-hover)] flex items-center justify-center text-3xl">🏜️</div>
            <p className="text-sm text-[var(--pm-text-muted)]">{city}-এ কোনো পোস্ট পাওয়া যায়নি। অন্য লোকেশন ট্রাই করুন!</p>
          </div>
        )}
          </div>
        </div>

        {/* Right Sidebar (Desktop) */}
        <aside className="hidden lg:flex w-80 flex-col gap-6 shrink-0">
          <TrendingRail />
        </aside>
      </div>
    </div>
  );
}
