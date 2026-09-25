import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, Store, ArrowLeft } from 'lucide-react';
import { formatBDT } from '../lib/format';

interface ReelPost {
  id: string;
  content: string;
  videoUrl: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  type: string;
  createdAt: string;
  liked?: boolean;
  author: { id: string; name: string; avatarUrl: string; verified?: boolean };
  product?: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

export default function Reels() {
  const [posts, setPosts] = useState<ReelPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await fetch('/api/v1/feed/posts?type=video');
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.warn('API error, using mock fallback for Reels:', err);
        setPosts([
          {
            id: 'reel_1',
            content: 'আমাদের খামারের সম্পূর্ণ প্রাকৃতিক উপায়ে উৎপাদিত মধুর রিভিউ দেখুন! 🍯✨',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-honey-drip-from-a-wooden-spoon-32986-large.mp4',
            likeCount: 4200,
            commentCount: 156,
            shareCount: 89,
            type: 'video',
            createdAt: new Date().toISOString(),
            author: { id: 'v_1', name: 'Fresh Valley Farm', avatarUrl: '🥬', verified: true },
            product: {
              id: 'p_honey',
              title: 'খাঁটি সুন্দরবনের মধু (১ কেজি)',
              price: 850,
              images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=200&auto=format&fit=crop']
            }
          },
          {
            id: 'reel_2',
            content: 'নতুন ধামাকা গ্যাজেট! স্মার্ট ওয়াচ সিরিজ ৯ এর প্রিমিয়াম আনবক্সিং ভিডিও। ⌚🔥',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-smartwatch-on-a-users-wrist-40242-large.mp4',
            likeCount: 2950,
            commentCount: 98,
            shareCount: 40,
            type: 'video',
            createdAt: new Date().toISOString(),
            author: { id: 'v_2', name: 'Rahim Electronics', avatarUrl: '🔌', verified: false },
            product: {
              id: 'p_watch',
              title: 'Smart Watch Series 9 Ultimate',
              price: 2500,
              images: ['https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=200&auto=format&fit=crop']
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center bg-black text-white/70 text-xs font-bold">
        রিলস লোড হচ্ছে...
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="h-[100vh] flex flex-col gap-3 items-center justify-center bg-black text-white/70">
        <p className="text-sm font-bold">কোনো রিলস পাওয়া যায়নি।</p>
        <button onClick={() => navigate('/')} className="text-xs text-[var(--pm-accent)] underline">
          হোম পেজে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="h-[100vh] w-full snap-y snap-mandatory overflow-y-scroll scrollbar-none bg-black pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 relative">
      {/* Floating Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-50 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white active:scale-95 transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {posts.map((post) => (
        <Reel key={post.id} post={post} />
      ))}
    </div>
  );
}

function Reel({ post }: { post: ReelPost }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch(e => console.warn("Autoplay block:", e));
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.warn(e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="h-[100vh] w-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={post.videoUrl}
        loop
        muted
        playsInline
        onClick={togglePlay}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
      />
      
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/85 pointer-events-none" />

      {/* Right Actions Bar */}
      <div className="absolute right-4 bottom-28 md:bottom-16 flex flex-col gap-6 items-center z-10">
        <Link to={`/wholesale`} className="relative mb-2 shrink-0">
          <div className="h-11 w-11 rounded-full border-2 border-white bg-white/10 flex items-center justify-center overflow-hidden text-2xl shadow-lg">
            {post.author.avatarUrl}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[var(--pm-accent)] rounded-full p-1 border-2 border-black flex items-center justify-center">
            <Store className="h-2.5 w-2.5 text-white" />
          </div>
        </Link>

        <button onClick={() => setLiked(!liked)} className="flex flex-col items-center gap-1 group">
          <div className="h-11 w-11 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 active:scale-95 transition-all">
            <Heart className={`h-5 w-5 transition-all duration-300 ${liked ? 'fill-red-500 text-red-500 scale-125' : 'text-white'}`} />
          </div>
          <span className="text-white text-[10px] font-black drop-shadow-md">
            {post.likeCount + (liked ? 1 : 0)}
          </span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="h-11 w-11 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 active:scale-95 transition-all">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-black drop-shadow-md">{post.commentCount}</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="h-11 w-11 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 active:scale-95 transition-all">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-white text-[10px] font-black drop-shadow-md">{post.shareCount}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <MoreHorizontal className="h-5 w-5 text-white drop-shadow-md active:scale-95 transition-all" />
        </button>
      </div>

      {/* Bottom Info Details */}
      <div className="absolute bottom-28 md:bottom-12 left-4 right-20 z-10 flex flex-col gap-2.5">
        <Link to={`/wholesale`} className="flex items-center gap-1.5 w-fit">
          <h3 className="font-black text-white text-sm drop-shadow-md hover:underline">{post.author.name}</h3>
          {post.author.verified && (
            <span className="text-[10px] font-black bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] px-1.5 py-0.5 rounded-full">ভেরিফাইড</span>
          )}
        </Link>
        <p className="text-white/90 text-xs font-semibold leading-relaxed line-clamp-3 drop-shadow-sm">
          {post.content}
        </p>
        
        {post.product && (
          <Link 
            to={`/product/${post.product.id}`} 
            className="mt-2.5 flex items-center gap-2.5 p-2 pr-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 w-fit hover:bg-white/15 active:scale-95 transition-all"
          >
            <img src={post.product.images[0]} alt={post.product.title} className="h-10 w-10 rounded-xl object-cover" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white line-clamp-1">{post.product.title}</span>
              <span className="text-[11px] text-[var(--pm-accent)] font-black">৳ {post.product.price}</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
