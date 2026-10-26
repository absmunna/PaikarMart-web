import { useState } from "react";
import { Star, MessageCircle, ThumbsUp, Send, CheckCircle2 } from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import { useAuth } from "@/features/auth/AuthContext";

export interface Review {
  id: string;
  user: string;
  rating: number;
  text: string;
  helpful: number;
  date: string;
  isQA?: boolean;
  reply?: string;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "r1",
    user: "Nadia A.",
    rating: 5,
    text: "Excellent build quality and the embroidery is gorgeous. Fits true to size, ordered M and it's perfect.",
    helpful: 24,
    date: "3 days ago",
  },
  {
    id: "qa1",
    user: "Sabbir H.",
    rating: 0,
    text: "Is this color fast after washing?",
    helpful: 6,
    date: "2 weeks ago",
    isQA: true,
    reply: "Yes — we recommend cold wash for the first 2 cycles. Color stays true after that.",
  },
];

export function ReviewsSection({
  productRating,
  reviewCount,
}: {
  productRating: number;
  reviewCount: number;
}) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [tab, setTab] = useState<"all" | "reviews" | "qa">("all");
  
  // New input states
  const [showInputForm, setShowInputForm] = useState<"review" | "qa" | null>(null);
  const [newText, setNewText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const isSeller = user?.role === 'seller' || user?.role === 'admin';

  const filtered = tab === "reviews"
      ? reviews.filter((r) => !r.isQA)
      : tab === "qa"
        ? reviews.filter((r) => r.isQA)
        : reviews;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const sample = stars === 5 ? 0.62 : stars === 4 ? 0.24 : stars === 3 ? 0.08 : stars === 2 ? 0.04 : 0.02;
    return { stars, pct: Math.round(sample * 100) };
  });

  const handleSubmit = () => {
    if (!newText.trim()) return;
    
    const newEntry: Review = {
      id: Date.now().toString(),
      user: user?.name || "Guest User",
      rating: showInputForm === "review" ? newRating : 0,
      text: newText,
      helpful: 0,
      date: "Just now",
      isQA: showInputForm === "qa"
    };

    setReviews([newEntry, ...reviews]);
    setNewText("");
    setShowInputForm(null);
  };

  const handleReplySubmit = (id: string) => {
    if (!replyText.trim()) return;
    
    setReviews(reviews.map(r => 
      r.id === id ? { ...r, reply: replyText } : r
    ));
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-[rgb(var(--text))]">Reviews & Q&amp;A</h3>
      </div>

      <div className="glass-card p-4 mb-3">
        <div className="flex items-center gap-5">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[rgb(var(--text))]">
              {productRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3.5 w-3.5 ${
                    s <= Math.round(productRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-[rgb(var(--text-subtle))]"
                  }`}
                />
              ))}
            </div>
            <div className="text-[10px] text-[rgb(var(--text-muted))] mt-1">
              {reviewCount} reviews
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-[rgb(var(--text-muted))]">{d.stars}</span>
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-1.5 rounded-full bg-[rgba(var(--glass-tint)/0.15)] overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-8 text-right text-[rgb(var(--text-muted))]">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        {(["all", "reviews", "qa"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              tab === t
                ? "bg-[var(--pm-accent)] text-white"
                : "bg-white/5 border border-[var(--pm-border)]/50 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:border-[var(--pm-border)]"
            }`}
          >
            {t === "all" ? "All" : t === "reviews" ? "Reviews" : "Q&A"}
          </button>
        ))}
        {/* Actions Dropdown / Buttons */}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setShowInputForm(showInputForm === "review" ? null : "review")}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/20 transition"
          >
            Leave Review
          </button>
          <button
            onClick={() => setShowInputForm(showInputForm === "qa" ? null : "qa")}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/20 transition"
          >
            Ask Question
          </button>
        </div>
      </div>

      {showInputForm && (
        <div className="glass-card p-4 mb-4 border border-[var(--pm-accent)]/30 rounded-2xl bg-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-sm font-bold text-[var(--pm-text)] mb-3">
            {showInputForm === "review" ? "Write a Review" : "Ask a Question"}
          </h4>
          
          {showInputForm === "review" && (
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setNewRating(s)}
                  className="hover:scale-110 transition-transform"
                >
                  <Star className={`h-6 w-6 ${s <= newRating ? "fill-yellow-400 text-yellow-400" : "text-[var(--pm-text-muted)]"}`} />
                </button>
              ))}
            </div>
          )}

          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder={showInputForm === "review" ? "What did you like or dislike?" : "What do you want to know about this product?"}
            className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl p-3 text-sm text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] transition-colors min-h-[80px]"
          />
          
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowInputForm(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!newText.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--pm-accent)] text-white disabled:opacity-50 flex items-center gap-2 transition hover:opacity-90"
            >
              Submit <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((r) => (
          <div key={r.id} className="glass-card p-4 rounded-2xl border border-[var(--pm-border)]/50 bg-white/[0.02]">
            <div className="flex items-start gap-3">
              <Avatar fallback={r.user[0]} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-sm text-[var(--pm-text)] flex items-center gap-1.5">
                    {r.user}
                    {user?.name === r.user && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">You</span>}
                  </p>
                  <span className="text-[10px] text-[var(--pm-text-subtle)] font-medium">
                    {r.date}
                  </span>
                </div>
                
                {r.isQA ? (
                  <div className="text-[10px] font-black uppercase tracking-wider text-[var(--pm-accent)] mt-0.5 mb-1 flex items-center gap-1">
                    <span className="bg-[var(--pm-accent)]/20 px-1.5 py-0.5 rounded">Q&amp;A</span>
                  </div>
                ) : (
                  <div className="flex gap-0.5 mt-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3 w-3 ${
                          s <= r.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-[var(--pm-text-subtle)]/30"
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                <p className="text-sm text-[var(--pm-text)] mt-1.5 leading-relaxed">
                  {r.text}
                </p>
                
                {r.reply ? (
                  <div className="mt-3 p-3 bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl relative">
                    <div className="absolute top-3 left-0 w-1 h-full bg-[var(--pm-accent)] rounded-r-full -translate-y-3" />
                    <p className="text-[10px] font-black uppercase tracking-wider text-[var(--pm-accent)] flex items-center gap-1 mb-1">
                      <CheckCircle2 className="w-3 h-3" /> Seller Reply
                    </p>
                    <p className="text-sm text-[var(--pm-text)]">
                      {r.reply}
                    </p>
                  </div>
                ) : (
                  r.isQA && isSeller && (
                    <div className="mt-3">
                      {replyingTo === r.id ? (
                        <div className="mt-2 flex gap-2">
                          <input 
                            autoFocus
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your response..."
                            className="flex-1 bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                          />
                          <button 
                            onClick={() => handleReplySubmit(r.id)}
                            className="bg-[var(--pm-accent)] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                          >
                            Send
                          </button>
                        </div>
                      ) : (
                         <button 
                          onClick={() => setReplyingTo(r.id)}
                          className="text-[10px] uppercase font-bold text-[var(--pm-accent)] border border-[var(--pm-accent)]/20 px-2 py-1 rounded hover:bg-[var(--pm-accent)]/10 transition"
                        >
                          Reply as Seller
                        </button>
                      )}
                    </div>
                  )
                )}

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--pm-border)]/30 text-xs text-[var(--pm-text-muted)]">
                  <button className="flex items-center gap-1.5 hover:text-[var(--pm-accent)] transition-colors font-medium">
                    <ThumbsUp className="h-3.5 w-3.5" /> <span className="pt-0.5">Helpful ({r.helpful})</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-[var(--pm-accent)] transition-colors font-medium">
                    <MessageCircle className="h-3.5 w-3.5" /> <span className="pt-0.5">Comment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
