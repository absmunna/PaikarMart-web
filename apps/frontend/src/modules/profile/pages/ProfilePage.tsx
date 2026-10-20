import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Camera, 
  Edit3, 
  Share2, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Heart, 
  MessageCircle, 
  ThumbsUp, 
  CheckCircle2, 
  Image as ImageIcon, 
  Smile, 
  Video, 
  Globe, 
  MoreHorizontal, 
  Sparkles, 
  Plus, 
  X, 
  Mail, 
  Phone, 
  Check, 
  Clock, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TimelinePost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  comments: { id: string; author: string; avatar: string; text: string; time: string }[];
}

interface PhotoItem {
  id: string;
  url: string;
  title: string;
}

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  // Active view check: if no ID or ID is current user's ID/handle, it is personal profile
  const isMe = !id || id === 'my-own-account' || id === user?.id || id === user?.handle;

  // Personal profile profile details (strictly personal identity)
  const [profileData, setProfileData] = useState({
    name: user?.fullName || user?.name || 'MD Munna',
    handle: user?.handle || (user?.email ? user.email.split('@')[0] : 'munna_paikar'),
    bio: 'Wholesale sourcing enthusiast & digital entrepreneur on PaikarMart. Connecting factories to retail networks.',
    location: 'Dhanmondi, Dhaka, Bangladesh',
    workplace: 'PaikarMart Network Partner',
    joinedDate: 'Joined September 2023',
    followersCount: 1420,
    followingCount: 385,
    avatarUrl: user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&q=80',
    email: user?.email || 'abs.munna1@gmail.com',
    phone: user?.phone || '+880 1712-345678',
    website: 'https://paikarmart.com'
  });

  // Facebook Navigation Tabs: 'posts' | 'about' | 'photos' | 'activity'
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'photos' | 'activity'>('posts');

  // Edit Profile Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...profileData });

  // Post Composer State
  const [composerText, setComposerText] = useState('');
  const [composerImage, setComposerImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  // Cover & Avatar Picker Modals
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Active Comments Input Trackers
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Timeline Posts List
  const [posts, setPosts] = useState<TimelinePost[]>([
    {
      id: 'post-1',
      authorName: profileData.name,
      authorHandle: profileData.handle,
      authorAvatar: profileData.avatarUrl,
      timestamp: '2 hrs ago · 🌐 Public',
      content: 'Just closed a major wholesale supply batch for ready-made garments from Chawkbazar! Really loving the escrow and logistics integration on PaikarMart.',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800',
      likes: 38,
      commentsCount: 6,
      sharesCount: 3,
      isLiked: false,
      comments: [
        { id: 'c1', author: 'Karim Ahmed', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', text: 'Congratulations brother! Quality looks top notch.', time: '1 hr ago' },
        { id: 'c2', author: 'Tasnim Hossain', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', text: 'Sent you a DM regarding fabric specifications.', time: '35 mins ago' }
      ]
    },
    {
      id: 'post-2',
      authorName: profileData.name,
      authorHandle: profileData.handle,
      authorAvatar: profileData.avatarUrl,
      timestamp: 'Yesterday at 3:45 PM · 🌐 Public',
      content: 'Exploring new artisanal handloom suppliers in Pabna and Sirajganj. Empowering local micro-producers with fair wholesale access is the way forward. 🇧🇩✨',
      imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800',
      likes: 74,
      commentsCount: 12,
      sharesCount: 8,
      isLiked: true,
      comments: [
        { id: 'c3', author: 'Sohag Enterprise', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', text: 'Great initiative! We have 200+ looms ready for seasonal order.', time: 'Yesterday' }
      ]
    }
  ]);

  // Gallery Photos
  const photos: PhotoItem[] = [
    { id: 'p1', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400', title: 'RMG Bulk Lot' },
    { id: 'p2', url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=400', title: 'Handloom Cotton' },
    { id: 'p3', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400', title: 'Factory Inspection' },
    { id: 'p4', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400', title: 'Chawkbazar Meetup' },
    { id: 'p5', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=400', title: 'Logistics Sourcing' },
    { id: 'p6', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400', title: 'Export Packaging' },
  ];

  // Preset covers for easy customization
  const presetCovers = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&q=80',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&q=80',
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=1400&q=80',
    'https://images.unsplash.com/photo-1518655048521-f130df041f66?w=1400&q=80'
  ];

  // Preset avatars
  const presetAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'
  ];

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile URL copied to clipboard!', { id: 'copy-profile' });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim() && !composerImage) {
      toast.error('Please write something before publishing your post.');
      return;
    }

    const newPost: TimelinePost = {
      id: `post-${Date.now()}`,
      authorName: profileData.name,
      authorHandle: profileData.handle,
      authorAvatar: profileData.avatarUrl,
      timestamp: 'Just now · 🌐 Public',
      content: composerText.trim(),
      imageUrl: composerImage || undefined,
      likes: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setComposerText('');
    setComposerImage('');
    setShowImageInput(false);
    toast.success('Post published to your timeline!');
  };

  const handleToggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: `c-${Date.now()}`,
          author: profileData.name,
          avatar: profileData.avatarUrl,
          text,
          time: 'Just now'
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    toast.success('Comment added!');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...editFormData });
    setIsEditProfileOpen(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black pb-24">
      {/* =========================================================================
          FACEBOOK-STYLE PROFILE HEADER & COVER BANNER
         ========================================================================= */}
      <div className="w-full bg-zinc-950/80 border-b border-white/10 relative">
        <div className="max-w-6xl mx-auto">
          {/* Cover Banner */}
          <div className="relative w-full h-56 sm:h-72 md:h-88 lg:h-96 rounded-b-2xl overflow-hidden bg-zinc-900 group">
            <img 
              src={profileData.coverUrl} 
              alt="Cover Banner" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Edit Cover Button */}
            {isMe && (
              <button
                onClick={() => setIsCoverModalOpen(true)}
                className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs sm:text-sm font-bold border border-white/20 backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Edit Cover Photo</span>
              </button>
            )}
          </div>

          {/* Profile Identity Row (Avatar overlapping cover) */}
          <div className="px-4 sm:px-8 pb-4">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 sm:-mt-20 md:-mt-24 relative z-30">
              
              {/* Avatar + Main Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                {/* Avatar */}
                <div className="relative group shrink-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 sm:border-[6px] border-black bg-zinc-900 shadow-2xl relative">
                    <img 
                      src={profileData.avatarUrl} 
                      alt={profileData.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isMe && (
                    <button
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="absolute bottom-1 right-1 p-2 sm:p-2.5 rounded-full bg-zinc-800/90 hover:bg-cyan-500 hover:text-black text-white border-2 border-black shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
                      title="Update profile picture"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Name, Handle, Badges, Follower Stats */}
                <div className="space-y-1.5 pb-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {profileData.name}
                    </h1>
                    <span title="Verified PaikarMart User">
                      <CheckCircle2 className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 font-semibold flex items-center justify-center sm:justify-start gap-2">
                    <span>@{profileData.handle}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wider">
                      Verified Member
                    </span>
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-zinc-300 font-bold pt-0.5">
                    <span><strong className="text-white">{profileData.followersCount.toLocaleString()}</strong> Followers</span>
                    <span className="text-zinc-600">·</span>
                    <span><strong className="text-white">{profileData.followingCount}</strong> Following</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit Profile, Share */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center md:justify-end pb-2">
                {isMe ? (
                  <>
                    <Button
                      onClick={() => {
                        setEditFormData({ ...profileData });
                        setIsEditProfileOpen(true);
                      }}
                      className="flex-1 sm:flex-initial h-10 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider border border-white/10 shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 text-cyan-400" />
                      <span>Edit Profile</span>
                    </Button>

                    <Button
                      onClick={handleShareProfile}
                      variant="outline"
                      className="h-10 px-4 rounded-xl border-white/10 hover:bg-white/5 text-zinc-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => toast.success(`You are now following ${profileData.name}!`)}
                      className="flex-1 sm:flex-initial h-10 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Follow</span>
                    </Button>

                    <Button
                      onClick={handleShareProfile}
                      variant="outline"
                      className="h-10 px-4 rounded-xl border-white/10 hover:bg-white/5 text-zinc-200 font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Bio */}
            <div className="mt-4 pt-3 border-t border-white/5 max-w-2xl text-center sm:text-left">
              <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                {profileData.bio}
              </p>
            </div>
          </div>

          {/* Facebook Tab Navigation Bar */}
          <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-8 border-t border-white/10 overflow-x-auto no-scrollbar">
            {[
              { id: 'posts', label: 'Timeline Posts' },
              { id: 'about', label: 'About & Info' },
              { id: 'photos', label: 'Photos & Media' },
              { id: 'activity', label: 'Public Activity' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "py-3.5 px-3 sm:px-5 font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 cursor-pointer",
                  activeTab === tab.id
                    ? "border-cyan-400 text-cyan-400 font-extrabold"
                    : "border-transparent text-zinc-400 hover:text-white hover:border-zinc-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: TIMELINE / POSTS (Facebook 2-Column Responsive Layout)
         ========================================================================= */}
      {activeTab === 'posts' && (
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Intro & Profile Summary Card (4 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Intro Card */}
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-4">
              <h2 className="text-base font-black text-white tracking-tight flex items-center justify-between">
                <span>Intro</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 italic text-center py-1 bg-white/[0.02] rounded-xl border border-white/5 p-3">
                "{profileData.bio}"
              </p>

              <div className="space-y-3 pt-1 text-xs sm:text-sm text-zinc-300">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span>Works at <strong className="text-white">{profileData.workplace}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span>Lives in <strong className="text-white">{profileData.location}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span>{profileData.joinedDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                  <a href={profileData.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline font-semibold">
                    {profileData.website.replace('https://', '')}
                  </a>
                </div>
              </div>

              {isMe && (
                <Button
                  onClick={() => {
                    setEditFormData({ ...profileData });
                    setIsEditProfileOpen(true);
                  }}
                  variant="outline"
                  className="w-full h-9 rounded-xl border-white/10 hover:bg-white/5 text-xs font-bold text-zinc-200 mt-2 cursor-pointer"
                >
                  Edit Details
                </Button>
              )}
            </div>

            {/* Photos Preview Card (9-photo grid) */}
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-white tracking-tight">Photos</h2>
                <button 
                  onClick={() => setActiveTab('photos')} 
                  className="text-xs text-cyan-400 hover:underline font-bold cursor-pointer"
                >
                  See all photos
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden pt-1">
                {photos.slice(0, 6).map((photo) => (
                  <div key={photo.id} className="aspect-square bg-zinc-900 rounded-lg overflow-hidden group relative">
                    <img 
                      src={photo.url} 
                      alt={photo.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Post Composer & Timeline Feed (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* "What's on your mind?" Composer Box */}
            {isMe && (
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0">
                    <img src={profileData.avatarUrl} alt={profileData.name} className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="text"
                    value={composerText}
                    onChange={(e) => setComposerText(e.target.value)}
                    placeholder={`What's on your mind, ${profileData.name.split(' ')[0]}?`}
                    className="flex-1 h-11 px-4 rounded-full bg-white/[0.05] border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 focus:bg-white/[0.08] transition-all"
                  />
                </div>

                {showImageInput && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase">Attach Photo URL</span>
                      <button onClick={() => setShowImageInput(false)} className="text-zinc-500 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="url"
                      value={composerImage}
                      onChange={(e) => setComposerImage(e.target.value)}
                      placeholder="Paste image link (e.g. Unsplash URL)..."
                      className="w-full h-9 px-3 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowImageInput(!showImageInput)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 text-emerald-400 text-xs font-bold transition-all cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Photo/Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setComposerText(prev => prev + ' 🤝 Business update: ');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 text-amber-400 text-xs font-bold transition-all cursor-pointer hidden sm:flex"
                    >
                      <Smile className="w-4 h-4" />
                      <span>Feeling/Activity</span>
                    </button>
                  </div>

                  <Button
                    onClick={handleCreatePost}
                    disabled={!composerText.trim() && !composerImage}
                    className="h-8 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Post
                  </Button>
                </div>
              </div>
            )}

            {/* Timeline Posts List */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-4 shadow-xl">
                  {/* Post Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-900">
                        <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-white">{post.authorName}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                        </div>
                        <p className="text-[11px] text-zinc-400 font-medium">{post.timestamp}</p>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-normal whitespace-pre-wrap">
                    {post.content}
                  </p>

                  {/* Optional Attached Image */}
                  {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden bg-zinc-900 border border-white/5 max-h-96">
                      <img src={post.imageUrl} alt="Post Attachment" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Stats Counter Row */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <ThumbsUp className="w-3 h-3 fill-cyan-400" />
                      </span>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>{post.commentsCount} comments</span>
                      <span>{post.sharesCount} shares</span>
                    </div>
                  </div>

                  {/* Like, Comment, Share Action Buttons */}
                  <div className="grid grid-cols-3 gap-1 pt-1">
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={cn(
                        "flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                        post.isLiked 
                          ? "text-cyan-400 bg-cyan-500/10" 
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <ThumbsUp className={cn("w-4 h-4", post.isLiked && "fill-cyan-400")} />
                      <span>Like</span>
                    </button>

                    <button
                      onClick={() => setOpenCommentsPostId(openCommentsPostId === post.id ? null : post.id)}
                      className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Comment</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Post link copied to clipboard!');
                      }}
                      className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Comments Thread (Expandable) */}
                  {openCommentsPostId === post.id && (
                    <div className="pt-3 border-t border-white/5 space-y-3">
                      {/* Comments List */}
                      {post.comments.map((comm) => (
                        <div key={comm.id} className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-800 shrink-0 mt-0.5">
                            <img src={comm.avatar} alt={comm.author} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 bg-white/[0.04] rounded-2xl px-3 py-2 border border-white/5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-white">{comm.author}</span>
                              <span className="text-[10px] text-zinc-500">{comm.time}</span>
                            </div>
                            <p className="text-xs text-zinc-300 mt-0.5">{comm.text}</p>
                          </div>
                        </div>
                      ))}

                      {/* Add Comment Input */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-800 shrink-0">
                          <img src={profileData.avatarUrl} alt={profileData.name} className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="text"
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                          placeholder="Write a comment..."
                          className="flex-1 h-9 px-3 rounded-full bg-white/[0.05] border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black cursor-pointer transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ABOUT & INFO (Facebook Style Detailed Bio & Contacts)
         ========================================================================= */}
      {activeTab === 'about' && (
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-6">
            <h2 className="text-xl font-black text-white tracking-tight">Personal & Account Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Full Legal Name</span>
                <p className="text-base font-black text-white">{profileData.name}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Paikar Username</span>
                <p className="text-base font-black text-cyan-400">@{profileData.handle}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Contact Email</span>
                <p className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <span>{profileData.email}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Verified Phone</span>
                <p className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  <span>{profileData.phone}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Current Location</span>
                <p className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span>{profileData.location}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Member Since</span>
                <p className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <span>{profileData.joinedDate}</span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-semibold">PaikarMart Verified Member ID: {user?.id || 'pm-verified-user'}</span>
              {isMe && (
                <Button
                  onClick={() => {
                    setEditFormData({ ...profileData });
                    setIsEditProfileOpen(true);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Edit Profile Information
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PHOTOS & MEDIA (Facebook Gallery Grid)
         ========================================================================= */}
      {activeTab === 'photos' && (
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Photos & Media</h2>
                <p className="text-xs text-zinc-400">All photos and media items posted to timeline</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {photos.map((item) => (
                <div key={item.id} className="group aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 relative">
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs font-black text-white truncate">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: PUBLIC ACTIVITY (Recent Feed & Sourcing History)
         ========================================================================= */}
      {activeTab === 'activity' && (
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
          <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-4">
            <h2 className="text-xl font-black text-white tracking-tight">Recent Public Activity</h2>
            <div className="space-y-3">
              {[
                { action: 'Published a new timeline post regarding Garments Wholesale batch', time: '2 hours ago' },
                { action: 'Shared feedback on Pabna handloom weavers hub', time: 'Yesterday' },
                { action: 'Updated profile bio and location details to Dhanmondi, Dhaka', time: '3 days ago' },
                { action: 'Connected with 15 verified sourcing vendors in Chawkbazar', time: '1 week ago' },
              ].map((act, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-zinc-200">{act.action}</p>
                    <span className="text-[10px] text-zinc-500">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: EDIT PROFILE, COVER PICKER, AVATAR PICKER
         ========================================================================= */}
      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-black text-white">Edit Profile</h3>
              <button onClick={() => setIsEditProfileOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Bio / Tagline</label>
                <textarea
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Location</label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Workplace / Role</label>
                  <input
                    type="text"
                    value={editFormData.workplace}
                    onChange={(e) => setEditFormData({ ...editFormData, workplace: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Website</label>
                <input
                  type="url"
                  value={editFormData.website}
                  onChange={(e) => setEditFormData({ ...editFormData, website: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase text-xs px-6 rounded-xl cursor-pointer"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cover Photo Picker Modal */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-black text-white">Choose Cover Photo</h3>
              <button onClick={() => setIsCoverModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {presetCovers.map((url, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setProfileData({ ...profileData, coverUrl: url });
                    setIsCoverModalOpen(false);
                    toast.success('Cover photo updated!');
                  }}
                  className="aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400 cursor-pointer transition-all hover:scale-102"
                >
                  <img src={url} alt={`Cover option ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Picker Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-black text-white">Update Profile Picture</h3>
              <button onClick={() => setIsAvatarModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {presetAvatars.map((url, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setProfileData({ ...profileData, avatarUrl: url });
                    setIsAvatarModalOpen(false);
                    toast.success('Profile avatar updated!');
                  }}
                  className="aspect-square rounded-full overflow-hidden border-2 border-white/10 hover:border-cyan-400 cursor-pointer transition-all hover:scale-105"
                >
                  <img src={url} alt={`Avatar option ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
