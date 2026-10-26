import { motion, AnimatePresence } from "motion/react";
import { Heart, Trash2, ShoppingCart, ArrowLeft, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlistStore } from "@/modules/wishlist/wishlistStore";
// import { ProductCard } from "@/features/product/components/ProductCard";
import { formatBDT } from "@/lib/format";
import { toast } from "sonner";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { items, clearWishlist, removeFromWishlist } = useWishlistStore();

  const handleClearAll = () => {
    clearWishlist();
    toast.success("উইশলিস্ট পরিষ্কার করা হয়েছে");
  };

  const totalSavings = items.reduce((sum: any, item: any) => {
    const orig = (item as any).originalPrice || (item as any).compareAtPrice || 0;
    return sum + Math.max(0, orig - item.price);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-24 text-[var(--pm-text)]"
    >
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-[var(--pm-border)]/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-black flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              উইশলিস্ট
              {items.length > 0 && (
                <span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full">
                  {items.length}টি পণ্য
                </span>
              )}
            </h1>
          </div>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-[11px] font-black text-zinc-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            সব মুছুন
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-5">
        {items.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center gap-4"
          >
            <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <Heart className="w-9 h-9 text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white mb-1">উইশলিস্ট খালি</h2>
              <p className="text-sm text-zinc-500">পছন্দের পণ্যে ❤️ চাপলে এখানে সেভ হবে</p>
            </div>
            <Link
              to="/marketplace"
              className="mt-2 flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--pm-accent)] text-white text-sm font-black hover:bg-[var(--pm-accent)]/90 transition-all shadow-[0_4px_16px_rgba(0,168,89,0.3)]"
            >
              <Sparkles className="w-4 h-4" />
              পণ্য দেখুন
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Savings banner */}
            {totalSavings > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-4 rounded-2xl bg-[var(--pm-accent)]/10 border border-[var(--pm-accent)]/20 flex items-center justify-between"
              >
                <div>
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">সম্ভাব্য সাশ্রয়</p>
                  <p className="text-lg font-black text-[var(--pm-accent)]">{formatBDT(totalSavings)}</p>
                </div>
                <div className="text-3xl">🎉</div>
              </motion.div>
            )}

            {/* Product grid */}
            <motion.div
              layout
              className="product-sink-grid"
            >
              <AnimatePresence mode="popLayout">
                {items.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    {/* <ProductCard product={item as any} /> */}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Bottom CTA */}
            <div className="mt-8 pt-6 border-t border-[var(--pm-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-zinc-400">{items.length}টি পণ্য সেভ করা আছে</p>
                <p className="text-[11px] text-zinc-600">লগইন অবস্থায় সব ডিভাইসে sync হয়</p>
              </div>
              <Link
                to="/marketplace"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-sm font-black hover:border-[var(--pm-accent)]/30 hover:text-[var(--pm-accent)] transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                আরও কেনাকাটা করুন
              </Link>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
