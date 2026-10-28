import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FileText, PlaySquare, Wrench, Send, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '@/modules/auth';
import { postService } from '@/core/services/postService';
import { toast } from 'sonner';

export type Kind = 'status' | 'product' | 'video' | 'deal';

interface CreatePostComposerProps {
  onPostCreated?: (post: any) => void;
  onOpenModal?: () => void;
  onClose?: () => void;
  className?: string;
}

export const CreatePostComposer: React.FC<CreatePostComposerProps> = ({ 
  onPostCreated, 
  onOpenModal,
  onClose,
  className = "" 
}) => {
  const { user, isSeller } = useAuth();
  const [content, setContent] = useState('');
  const [kind, setKind] = useState<Kind>(isSeller ? 'product' : 'status');

  // Product meta details
  const [price, setPrice] = useState('450');
  const [stock, setStock] = useState('100');
  const [category, setCategory] = useState('Wholesale');
  const [shippingMethod, setShippingMethod] = useState('Courier');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500');

  const QUICK = [
    { 
      kind: 'product' as Kind, 
      label: isSeller ? 'পণ্য আপলোড' : 'Product', 
      Icon: Package, 
      href: isSeller ? '/seller/products' : '/shop', 
      color: 'text-emerald-400',
      action: onOpenModal
    },
    { 
      kind: 'deal' as Kind, 
      label: 'ডিমান্ড পোস্ট', 
      Icon: FileText, 
      href: '/demand', 
      color: 'text-amber-400',
      action: onOpenModal
    },
    { 
      kind: 'status' as Kind, 
      label: 'সার্ভিস', 
      Icon: Wrench, 
      href: '/services', 
      color: 'text-purple-400',
      action: onOpenModal
    },
    { 
      kind: 'video' as Kind, 
      label: 'রিলস ভিডিও', 
      Icon: PlaySquare, 
      color: 'text-rose-400',
      action: onOpenModal
    },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    const authorName = user?.fullName || user?.name || "PaikarMart ইউজার";
    const authorId = user?.id || `u-${Date.now()}`;
    const authorAvatar = user?.avatarUrl || user?.avatar;
    const authorRole = user?.role || (isSeller ? 'seller' : 'buyer');
    const storeName = user?.seller?.shopName || authorName;

    try {
      const created = await postService.createPost({
        authorId,
        authorName,
        authorAvatar,
        authorRole,
        storeName,
        isVerified: Boolean(user?.verification?.status === 'verified' || isSeller),
        sellerPhone: user?.phone,
        sellerEmail: user?.email,
        content,
        postType: kind === 'product' ? 'product' : (kind === 'video' ? 'video' : 'text'),
        category,
        mediaUrls: (kind === 'product' || kind === 'video') && mediaUrl ? [mediaUrl] : [],
        videoUrl: kind === 'video' ? mediaUrl : null,
        product: kind === 'product' ? {
          title: content.slice(0, 36),
          price: Number(price) || 450,
          moq: 1,
          stock: Number(stock) || 100,
          category,
          image: mediaUrl
        } : null
      });

      if (onPostCreated) {
        onPostCreated(created);
      }

      if (kind === 'product') {
        toast.success(`সফলভাবে পণ্য আপলোড হয়েছে! (দাম: ৳${price}, স্টক: ${stock})`);
      } else {
        toast.success("পোস্ট সফলভাবে পাবলিশ হয়েছে! 🚀");
      }
    } catch (err) {
      console.warn("Post creation fallback:", err);
      if (onPostCreated) {
        onPostCreated({ content, kind });
      }
    }
    
    setContent('');
    setKind(isSeller ? 'product' : 'status');
    if (onClose) onClose();
  };


  return (
    <div className={`bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] shadow-sm p-4 sm:p-5 flex flex-col gap-3.5 ${className}`}>
      {/* Header / Avatar + Input */}
      <form onSubmit={submit} className="flex items-start gap-3 text-left">
        <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full border border-[var(--pm-border)] bg-[var(--pm-surface-hover)] overflow-hidden shadow-xs">
          <img 
            src={user?.avatar || user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
            alt="Avatar" 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              isSeller 
                ? "নতুন পাইকারি পণ্য বা স্টোরের অফার লিখুন..." 
                : "আপনার কী পণ্য বা সার্ভিস প্রয়োজন? বিস্তারিত লিখুন..."
            }
            rows={2}
            className="w-full resize-none bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)] transition-all font-medium"
          />

          {/* E-commerce Meta Details for Product Upload */}
          {kind === 'product' && (
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[var(--pm-bg)]/50 border border-[var(--pm-border)]/50 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 text-left">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-[var(--pm-text-muted)] font-black block">Price / দাম (৳)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[var(--pm-text)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
                  placeholder="Price"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-[var(--pm-text-muted)] font-black block">Stock / স্টক পরিমাণ</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[var(--pm-text)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
                  placeholder="Stock"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-[var(--pm-text-muted)] font-black block">Category / ক্যাটাগরি</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[var(--pm-text)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
                >
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Nearby Food/Grocery">Nearby Food/Grocery</option>
                  <option value="Service">Service</option>
                  <option value="Digital">Digital</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-[var(--pm-text-muted)] font-black block">Shipping / শিপিং পদ্ধতি</label>
                <select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[var(--pm-text)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
                >
                  <option value="Courier">Courier / কুরিয়ার</option>
                  <option value="Home Delivery">Home Delivery / হোম ডেলিভারি</option>
                  <option value="Self Pickup">Self Pickup / সেলফ পিকআপ</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] uppercase text-[var(--pm-text-muted)] font-black block">Image URL / পণ্য ছবি লিংক</label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[var(--pm-text)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
                  placeholder="Paste product image URL"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as Kind)}
                className="bg-[var(--pm-bg)] text-[var(--pm-text)] text-[11px] sm:text-xs font-bold rounded-xl px-2.5 py-1.5 border border-[var(--pm-border)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
              >
                <option value="status">📝 সাধারণ আপডেট</option>
                <option value="product">📦 পাইকারি পণ্য</option>
                <option value="deal">📢 বায়ার ডিমান্ড</option>
                <option value="video">🎬 ভিডিও রিলস</option>
              </select>

              {onOpenModal && (
                <button
                  type="button"
                  onClick={onOpenModal}
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[var(--pm-accent)] hover:underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  {isSeller ? 'ক্যাটালগ পণ্য যুক্ত' : 'ডিমান্ড ফর্ম'}
                </button>
              )}
            </div>

            <button 
              type="submit" 
              disabled={!content.trim()}
              className="bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white px-4 py-1.5 rounded-xl text-xs font-black shadow-md shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              পোস্ট করুন
            </button>
          </div>
        </div>
      </form>

      {/* Quick Action Badges */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[var(--pm-border)]/50">
        {QUICK.map(({ kind, label, Icon, href, color, action }) => (
          action ? (
            <button
              key={kind}
              type="button"
              onClick={action}
              className="w-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs py-2 rounded-xl bg-[var(--pm-bg)]/70 border border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text)] transition-colors active:scale-98 cursor-pointer"
            >
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="font-bold truncate">{label}</span>
            </button>
          ) : (
            <Link key={kind} to={href} className="w-full">
              <button
                type="button"
                className="w-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs py-2 rounded-xl bg-[var(--pm-bg)]/70 border border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text)] transition-colors active:scale-98 cursor-pointer"
              >
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="font-bold truncate">{label}</span>
              </button>
            </Link>
          )
        ))}
      </div>
    </div>
  );
};

export default CreatePostComposer;
