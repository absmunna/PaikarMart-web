import React, { useState } from "react";
import { X, Image as ImageIcon, Video, Tag, Loader2, Package, LayoutGrid } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { handleFirestoreError, OperationType } from "../../lib/firestore-errors";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: "wholesale", name: "পাইকারি (Wholesale)", icon: "📦" },
  { id: "retail", name: "খুচরা (Retail)", icon: "🛍️" },
  { id: "nearby", name: "আশেপাশে (Nearby)", icon: "📍" },
  { id: "services", name: "সার্ভিস (Services)", icon: "🛠️" },
  { id: "digital", name: "ডিজিটাল (Digital)", icon: "💻" },
];

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { user, hasRole } = useAuth();
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("retail");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isSeller = hasRole("seller");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      // In PaikarMart, creating a post is adding a product to the commerce feed
      await addDoc(collection(db, "posts"), {
        sellerId: user.id,
        sellerName: user.name || "Anonymous",
        sellerAvatar: user.avatarUrl || "",
        content,
        image: imageUrl || null,
        price: price || null,
        category: category,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        type: "product_listing",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setContent("");
      setPrice("");
      setImageUrl("");
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "posts");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#1e2136] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/10 animate-in fade-in slide-in-from-bottom-10 duration-300">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-white">নতুন প্রোডাক্ট যোগ করুন</h2>
            <p className="text-xs text-gray-400">আপনার শপ বা সার্ভিসের জন্য নতুন পোস্ট</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {!isSeller && (
          <div className="mx-4 mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
            <p className="text-xs text-orange-400">
              আপনি এখনো সেলার হিসেবে ভেরিফাইড নন। আপনার পোস্টটি মডারেশনের পর পাবলিকলি দেখা যেতে পারে।
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex gap-3 mb-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#FF7A00] to-orange-600 flex items-center justify-center text-white font-bold uppercase overflow-hidden">
              {user?.name ? user.name.charAt(0) : "U"}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="প্রোডাক্টের নাম এবং বিস্তারিত বিবরণ লিখুন..."
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500 resize-none min-h-[100px] text-lg"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 ml-1">ক্যাটাগরি সিলেক্ট করুন</label>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      category === cat.id 
                      ? "bg-[#FF7A00] text-white shadow-lg shadow-[#FF7A00]/20" 
                      : "bg-[#0f111a] text-gray-400 border border-white/5 hover:border-white/10"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 ml-1">প্রাইস (৳)</label>
                <div className="flex items-center gap-3 bg-[#0f111a] rounded-2xl px-4 py-3 border border-white/5 focus-within:border-[#FF7A00]/50 transition-colors">
                  <Tag className="h-4 w-4 text-[#FF7A00]" />
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="৳ ০.০০"
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 ml-1">ইমেজ ইউআরএল</label>
                <div className="flex items-center gap-3 bg-[#0f111a] rounded-2xl px-4 py-3 border border-white/5 focus-within:border-[#FF7A00]/50 transition-colors">
                  <ImageIcon className="h-4 w-4 text-green-500" />
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 mb-6 bg-black/20 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2">
              <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <ImageIcon className="h-5 w-5 text-green-500" />
              </button>
              <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Video className="h-5 w-5 text-rose-500" />
              </button>
              <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Package className="h-5 w-5 text-blue-500" />
              </button>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
              <LayoutGrid className="h-3 w-3" />
              <span>ই-কমার্স পোস্টিং</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="w-full bg-[#FF7A00] hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-[#FF7A00]/25 flex items-center justify-center gap-2 text-lg"
          >
            {isSubmitting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              "প্রোডাক্ট লিস্ট করুন"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
