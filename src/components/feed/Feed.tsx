import { useEffect, useState } from "react";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ShoppingCart, 
  MoreHorizontal,
  CheckCircle2
} from "lucide-react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, increment, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { handleFirestoreError, OperationType } from "../../lib/firestore-errors";

export interface Post {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  content: string;
  image?: string;
  price?: string;
  oldPrice?: string;
  category?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: any;
  updatedAt: any;
  userLiked?: boolean; // local state
}

const CATEGORY_LABELS: Record<string, string> = {
  wholesale: "পাইকারি",
  retail: "খুচরা",
  nearby: "আশেপাশে",
  services: "সার্ভিস",
  digital: "ডিজিটাল",
};

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(fetchedPosts);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Feed onSnapshot error:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [retryCount]);

  const handleLike = async (post: Post) => {
    if (!user) {
      alert("লাইক করতে লগইন করুন");
      return;
    }

    // Basic implementation for UI prototype
    // This increments the count. In a real scenario, you'd add/remove a document in the 'likes' subcollection
    // and securely enforce it with rules and Cloud Functions or batch writes.
    try {
      const postRef = doc(db, "posts", post.id);
      const isLiking = !post.userLiked;
      
      // Optistic UI update
      setPosts(prev => prev.map(p => {
        if (p.id === post.id) {
          return {
            ...p,
            userLiked: isLiking,
            likesCount: Math.max(0, p.likesCount + (isLiking ? 1 : -1))
          };
        }
        return p;
      }));

      // A simple non-transactional increment for prototyping
      await updateDoc(postRef, {
        likesCount: increment(isLiking ? 1 : -1),
        updatedAt: serverTimestamp()
      });

      const likeRef = doc(db, "posts", post.id, "likes", user.id || "temp");
      if (isLiking) {
        await setDoc(likeRef, { userId: user.id || "temp", createdAt: serverTimestamp() });
      } else {
        await deleteDoc(likeRef);
      }

    } catch (error) {
      console.error(error);
      // Revert optimistic update
      // In a robust implementation, we would fetch fresh state
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-400 font-medium">লোড হচ্ছে...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 px-4">
        <p className="text-rose-400 mb-4 font-medium">লোড করতে সমস্যা হয়েছে: {error}</p>
        <button 
          onClick={() => {
            setLoading(true);
            setRetryCount(prev => prev + 1);
          }}
          className="bg-[#FF7A00] hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors font-semibold shadow-lg shadow-orange-600/20"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-[#1e2136] rounded-2xl border border-white/5 mx-4 mt-4">
        <div className="text-4xl mb-4 opacity-50">📭</div>
        <p className="text-gray-400 font-medium">এখন পর্যন্ত কোনো পোস্ট পাওয়া যায়নি।</p>
        <p className="text-xs text-gray-500 mt-2">নতুন পোস্ট করলে এখানে দেখা যাবে।</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {posts.map((post) => (
        <article key={post.id} className="bg-[#1e2136] border-y border-white/5 pt-4 pb-2">
          
          {/* Post Header */}
          <div className="flex items-center justify-between px-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#FF7A00] to-orange-600 flex items-center justify-center text-white font-bold uppercase overflow-hidden border border-white/10">
                {post.sellerAvatar ? (
                  <img src={post.sellerAvatar} alt={post.sellerName} className="h-full w-full object-cover" />
                ) : (
                  post.sellerName.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold text-white text-[15px]">{post.sellerName}</h3>
                  <CheckCircle2 className="h-4 w-4 text-blue-400 fill-blue-400/20" />
                  {post.category && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-md bg-[#FF7A00]/10 text-[#FF7A00] text-[10px] font-bold border border-[#FF7A00]/20 uppercase">
                      {CATEGORY_LABELS[post.category] || post.category}
                    </span>
                  )}
                </div>
                {/* A basic time display placeholder */}
                <p className="text-xs text-gray-400">নতুন পোস্ট</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          {/* Post Content */}
          <div className="px-4 mb-3">
            <p className="text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Post Image & Price Tag */}
          {post.image && (
            <div className="relative w-full bg-black/50 aspect-square md:aspect-video overflow-hidden">
              <img src={post.image} alt="Product" className="w-full h-full object-cover" />
              
              {/* Floating Price Tag */}
              {(post.price || post.oldPrice) && (
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg flex flex-col items-end shadow-xl">
                  {post.oldPrice && (
                    <span className="text-xs text-gray-400 line-through mb-0.5">{post.oldPrice}</span>
                  )}
                  {post.price && (
                    <span className="text-lg font-bold text-[#FF7A00] leading-none">{post.price}</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Post Stats */}
          <div className="flex items-center justify-between px-4 py-3 text-xs text-gray-400 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center border border-[#1e2136] z-10">
                <Heart className="h-3 w-3 text-white fill-white" />
              </div>
              <span>{post.likesCount || 0}</span>
            </div>
            <div className="flex gap-3">
              <span>{post.commentsCount || 0} Comments</span>
              <span>{post.sharesCount || 0} Shares</span>
            </div>
          </div>

          {/* Post Actions */}
          <div className="grid grid-cols-4 px-2 py-1">
            <button 
              onClick={() => handleLike(post)}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg transition-colors col-span-1 ${post.userLiked ? 'text-red-500 hover:bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Heart className={`h-5 w-5 ${post.userLiked ? 'fill-red-500' : ''}`} />
              <span className="text-sm font-medium hidden sm:inline">Like</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors col-span-1">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">Comment</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors col-span-1">
              <Share2 className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">Share</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2 text-[#FF7A00] hover:bg-[#FF7A00]/10 rounded-lg transition-colors col-span-1">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">Buy</span>
            </button>
          </div>

        </article>
      ))}
    </div>
  );
}
