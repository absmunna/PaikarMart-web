import React, { useState, useRef } from "react";
import { 
  X, Image as ImageIcon, Video, Tag, Loader2, Package, LayoutGrid, 
  FileText, Upload, Sparkles, AlertCircle, CheckCircle2, Phone, MapPin, Film
} from "lucide-react";
import { useAuth } from "@/modules/auth";
import { postService, CreatePostInput } from "@/core/services/postService";
import { FeedPost } from "@/modules/feed/types";
import { toast } from "sonner";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (post: FeedPost) => void;
}

export type PostTypeTab = 'text' | 'photo' | 'video' | 'file' | 'product';

const CATEGORIES = [
  { id: "wholesale", name: "পাইকারি (Wholesale)", icon: "📦" },
  { id: "retail", name: "খুচরা (Retail)", icon: "🛍️" },
  { id: "nearby", name: "আশেপাশে (Nearby)", icon: "📍" },
  { id: "services", name: "সার্ভিস (Services)", icon: "🛠️" },
  { id: "digital", name: "ডিজিটাল (Digital)", icon: "💻" },
];

const PRESET_TAGS = ['#পাইকারি', '#নতুন_স্টক', '#ঈদ_কালেকশন', '#টেক্সটাইল', '#হোলসেল_অফার', '#জরুরি_ডিমান্ড'];

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const { user, isSeller, role } = useAuth();
  
  // Tab selector
  const [activeTab, setActiveTab] = useState<PostTypeTab>('text');

  // Common Post Fields
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("wholesale");
  const [location, setLocation] = useState("ঢাকা, বাংলাদেশ");
  const [selectedTags, setSelectedTags] = useState<string[]>(['#পাইকারি']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Photo Fields
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Video Fields
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFilePreview, setVideoFilePreview] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // File / Document Fields
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Product Fields
  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productOriginalPrice, setProductOriginalPrice] = useState("");
  const [productMoq, setProductMoq] = useState("10");
  const [productStock, setProductStock] = useState("100");
  const [productImage, setProductImage] = useState("");

  if (!isOpen) return null;

  // Handle Photo File Upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে হবে");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Video File Upload
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        toast.error("ভিডিওর সাইজ সর্বোচ্চ ২৫ মেগাবাইট হতে হবে");
        return;
      }
      const localUrl = URL.createObjectURL(file);
      setVideoFilePreview(localUrl);
      setVideoUrl(localUrl);
    }
  };

  // Handle Document File Upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("পোস্টের মূল বিবরণ লিখুন");
      return;
    }

    setIsSubmitting(true);
    try {
      // Build author real data from user account
      const authorId = user?.id || `user-${Date.now()}`;
      const authorName = user?.fullName || user?.name || "PaikarMart ইউজার";
      const authorAvatar = user?.avatarUrl || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`;
      const authorRole = user?.role || (isSeller ? 'seller' : 'buyer');
      const storeName = user?.seller?.shopName || authorName;
      const sellerPhone = user?.phone || '';
      const sellerEmail = user?.email || '';
      const isVerified = Boolean(user?.verification?.status === 'verified' || isSeller);

      const postInput: CreatePostInput = {
        authorId,
        authorName,
        authorAvatar,
        authorRole,
        storeName,
        isVerified,
        sellerPhone,
        sellerEmail,
        location,
        district: 'Dhaka',
        
        content,
        postType: activeTab,
        category,
        tags: selectedTags,

        // Photo attachments
        mediaUrls: (photoPreview || photoUrl) ? [photoPreview || photoUrl] : [],

        // Video attachment
        videoUrl: (videoFilePreview || videoUrl) ? (videoFilePreview || videoUrl) : null,

        // File attachment
        fileAttachment: fileName ? {
          name: fileName,
          url: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          size: fileSize || '২.৫ MB',
          type: 'application/pdf'
        } : null,

        // Product attachment
        product: activeTab === 'product' ? {
          title: productTitle || content.slice(0, 40),
          price: Number(productPrice) || 1200,
          originalPrice: productOriginalPrice ? Number(productOriginalPrice) : undefined,
          moq: Number(productMoq) || 10,
          stock: Number(productStock) || 100,
          category,
          image: productImage || photoPreview || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
        } : null
      };

      const created = await postService.createPost(postInput);

      if (onPostCreated) {
        onPostCreated(created);
      }

      toast.success("পোস্ট সফলভাবে পাবলিশ হয়েছে! 🚀");
      
      // Reset form
      setContent("");
      setPhotoUrl("");
      setPhotoPreview(null);
      setVideoUrl("");
      setVideoFilePreview(null);
      setFileName("");
      setFileSize("");
      setFileUrl("");
      setProductTitle("");
      setProductPrice("");
      setProductOriginalPrice("");
      onClose();
    } catch (err) {
      console.error("Post creation error:", err);
      toast.error("পোস্ট সেভ করতে সমস্যা হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[var(--pm-surface)] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[var(--pm-surface)]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-white">নতুন পোস্ট তৈরি করুন</h2>
              <p className="text-xs text-zinc-400">রিয়েল ইউজার একাউন্ট ও মাল্টিমিডিয়া পোস্ট</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Account Real Identity Banner */}
        <div className="px-4 py-3 bg-zinc-900/60 border-b border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[var(--pm-accent)] to-amber-400 shrink-0">
              <img
                src={user?.avatarUrl || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || user?.name || 'User'}`}
                alt="Account Avatar"
                className="w-full h-full rounded-full object-cover bg-zinc-800"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs text-white truncate">
                  {user?.fullName || user?.name || "PaikarMart ইউজার"}
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-white/10 text-amber-300">
                  {user?.role === 'seller' ? '🏢 সেলার' : user?.role === 'factory' ? '🏭 কারখানা' : user?.role === 'buyer' ? '🛒 বায়ার' : 'সদস্য'}
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 truncate">
                {user?.seller?.shopName || user?.email || user?.phone || "ভেরিফায়েড প্রোফাইল"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>অ্যাকাউন্ট সিঙ্কড</span>
          </div>
        </div>

        {/* Post Type Selector Tabs */}
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 bg-[var(--pm-surface)] overflow-x-auto hide-scrollbar border-b border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeTab === 'text' 
                ? 'bg-[var(--pm-accent)] text-white shadow-md shadow-[var(--pm-accent)]/20' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>📝 টেক্সট</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeTab === 'photo' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>🖼️ ছবি পোস্ট</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeTab === 'video' 
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>🎬 ভিডিও পোস্ট</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeTab === 'file' 
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>📄 ফাইল/PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('product')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeTab === 'product' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>🛍️ প্রোডাক্ট পোস্ট</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Main Content Area */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-bold">পোস্টের বিবরণ ও ক্যাপশন</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                activeTab === 'product'
                  ? "পণ্যটির পাইকারি রেট, কোয়ালিটি ও শর্ত বিস্তারিত লিখুন..."
                  : activeTab === 'video'
                  ? "ভিডিও রিভিউ বা আনবক্সিং সম্পর্কে বিস্তারিত লিখুন..."
                  : activeTab === 'file'
                  ? "ক্যাটালগ বা কোটেশন শীটের বিবরণ লিখুন..."
                  : "আপনার শপ আপডেট বা পাইকারি ডিমান্ড সম্পর্কে লিখুন..."
              }
              rows={3}
              className="w-full bg-zinc-900/90 border border-white/10 rounded-2xl p-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)] transition-all resize-none"
              autoFocus
            />
          </div>

          {/* ─── TAB 1: PHOTO UPLOAD SECTION ─── */}
          {activeTab === 'photo' && (
            <div className="p-3.5 bg-zinc-900/70 border border-white/10 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>ছবি সংযুক্ত করুন</span>
              </label>

              {photoPreview ? (
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black border border-white/10">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPhotoPreview(null); setPhotoUrl(""); }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/15 hover:border-emerald-500/50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-white/2"
                >
                  <Upload className="w-6 h-6 text-emerald-400" />
                  <span className="text-xs font-bold text-zinc-300">ডিভাইস থেকে ছবি আপলোড করুন</span>
                  <span className="text-[10px] text-zinc-500">JPG, PNG, WebP (সর্বোচ্চ ৫ মেগাবাইট)</span>
                </div>
              )}
              <input 
                ref={photoInputRef}
                type="file" 
                accept="image/*" 
                onChange={handlePhotoSelect} 
                className="hidden" 
              />

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400">অথবা ছবির অনলাইন URL লিখুন:</span>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => { setPhotoUrl(e.target.value); setPhotoPreview(e.target.value); }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* ─── TAB 2: VIDEO UPLOAD SECTION ─── */}
          {activeTab === 'video' && (
            <div className="p-3.5 bg-zinc-900/70 border border-white/10 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Film className="w-4 h-4 text-rose-400" />
                <span>ভিডিও সংযুক্ত করুন</span>
              </label>

              {videoFilePreview ? (
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black border border-white/10">
                  <video src={videoFilePreview} controls className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setVideoFilePreview(null); setVideoUrl(""); }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/15 hover:border-rose-500/50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-white/2"
                >
                  <Video className="w-6 h-6 text-rose-400" />
                  <span className="text-xs font-bold text-zinc-300">ভিডিও ফাইল আপলোড করুন</span>
                  <span className="text-[10px] text-zinc-500">MP4, WebM (সর্বোচ্চ ২৫ মেগাবাইট)</span>
                </div>
              )}
              <input 
                ref={videoInputRef}
                type="file" 
                accept="video/*" 
                onChange={handleVideoSelect} 
                className="hidden" 
              />

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400">অথবা ভিডিও স্ট্রিমিং URL লিখুন:</span>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/.../video.mp4"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>
          )}

          {/* ─── TAB 3: FILE / DOCUMENT ATTACHMENT SECTION ─── */}
          {activeTab === 'file' && (
            <div className="p-3.5 bg-zinc-900/70 border border-white/10 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>PDF বা ক্যাটালগ ফাইল সংযুক্ত করুন</span>
              </label>

              {fileName ? (
                <div className="p-3 bg-zinc-950 rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-sky-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{fileName}</p>
                      <span className="text-[10px] text-zinc-400">{fileSize || 'ডকুমেন্ট'}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFileName(""); setFileSize(""); setFileUrl(""); }}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-white/15 hover:border-sky-500/50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-white/2"
                >
                  <FileText className="w-6 h-6 text-sky-400" />
                  <span className="text-xs font-bold text-zinc-300">PDF বা ডকুমেন্ট ফাইল সিলেক্ট করুন</span>
                  <span className="text-[10px] text-zinc-500">PDF, DOC, XLS ক্যাটালগ</span>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf,.doc,.docx,.xls,.xlsx" 
                onChange={handleFileSelect} 
                className="hidden" 
              />
            </div>
          )}

          {/* ─── TAB 4: PRODUCT LISTING SECTION ─── */}
          {activeTab === 'product' && (
            <div className="p-3.5 bg-zinc-900/70 border border-amber-500/20 rounded-2xl space-y-3">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                <span>প্রোডাক্ট ডিটেইলস (পাইকারি/খুচরা)</span>
              </label>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">প্রোডাক্টের নাম</label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="যেমন: প্রিমিয়াম কটন পাঞ্জাবি ফেব্রিক"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">পাইকারি দাম (৳)</label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="৳ ১২৫০"
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">খুচরা/রেগুলার দাম (৳)</label>
                  <input
                    type="number"
                    value={productOriginalPrice}
                    onChange={(e) => setProductOriginalPrice(e.target.value)}
                    placeholder="৳ ১৫০০"
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">MOQ (ন্যূনতম অর্ডার)</label>
                  <input
                    type="number"
                    value={productMoq}
                    onChange={(e) => setProductMoq(e.target.value)}
                    placeholder="১০ পিস"
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">স্টক পরিমাণ</label>
                  <input
                    type="number"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    placeholder="১০০"
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">প্রোডাক্ট ইমেজ URL</label>
                <input
                  type="text"
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Category & Location selection */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-bold">ক্যাটাগরি সিলেক্ট করুন</label>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    category === cat.id 
                    ? "bg-[var(--pm-accent)] text-white shadow-md shadow-[var(--pm-accent)]/20" 
                    : "bg-zinc-900 text-zinc-400 border border-white/5 hover:border-white/10"
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Tags */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 font-bold">ট্যাগ সিলেক্ট করুন</label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-[var(--pm-accent)]/20 text-[var(--pm-accent)] border-[var(--pm-accent)]/30"
                        : "bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/10"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location field */}
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
              <span>লোকেশন</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ঢাকা, বাংলাদেশ"
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
            />
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="w-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black py-3.5 rounded-2xl transition-all shadow-xl shadow-[var(--pm-accent)]/20 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>পাবলিশ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>ফিডে পোস্ট প্রকাশ করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
