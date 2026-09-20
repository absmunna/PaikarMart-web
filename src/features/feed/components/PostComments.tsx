import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, Star } from "lucide-react";
import {
  useListPostComments,
  useCreatePostComment,
  getListPostCommentsQueryKey,
  getListPostsQueryKey,
} from "@/modules/app/api/client/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { safeStorage } from "@/modules/app/utils/storage";
import { GlassContainer } from "@/components/ui/GlassContainer";
import { cn } from "@/lib/utils";

type Tab = "comments" | "reviews";

interface LocalReply {
  id: string;
  parentId: string;
  content: string;
  createdAt: string;
  authorName: string;
}

interface LocalReview {
  id: string;
  postId: string;
  rating: number;
  content: string;
  createdAt: string;
  authorName: string;
}

const REPLY_KEY = (postId: string) => `pm.replies.${postId}.v1`;
const REVIEW_KEY = (postId: string) => `pm.reviews.${postId}.v1`;

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = safeStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON<T>(key: string, val: T) {
  try {
    safeStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* noop */
  }
}

export function PostComments({ postId }: { postId: string }) {
  const qc = useQueryClient();
  const [tab, setTab] = React.useState<Tab>("comments");
  const [text, setText] = React.useState("");
  const [replyTo, setReplyTo] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");
  const [reviewText, setReviewText] = React.useState("");
  const [reviewRating, setReviewRating] = React.useState(5);

  const [replies, setReplies] = React.useState<LocalReply[]>(() =>
    readJSON<LocalReply[]>(REPLY_KEY(postId), []),
  );
  const [reviews, setReviews] = React.useState<LocalReview[]>(() =>
    readJSON<LocalReview[]>(REVIEW_KEY(postId), []),
  );

  const { data: comments } = useListPostComments(postId, {
    query: { queryKey: getListPostCommentsQueryKey(postId) },
  });
  const createComment = useCreatePostComment();

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    createComment.mutate(
      { id: postId, data: { content: text.trim() } },
      {
        onSuccess: () => {
          setText("");
          qc.invalidateQueries({ queryKey: getListPostCommentsQueryKey(postId) });
          qc.invalidateQueries({ queryKey: getListPostsQueryKey() });
        },
      },
    );
  };

  const submitReply = (parentId: string) => {
    if (!replyText.trim()) return;
    const r: LocalReply = {
      id: `r_${Date.now()}`,
      parentId,
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
      authorName: "You",
    };
    const next = [...replies, r];
    setReplies(next);
    writeJSON(REPLY_KEY(postId), next);
    setReplyText("");
    setReplyTo(null);
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    const r: LocalReview = {
      id: `rev_${Date.now()}`,
      postId,
      rating: reviewRating,
      content: reviewText.trim(),
      createdAt: new Date().toISOString(),
      authorName: "You",
    };
    const next = [r, ...reviews];
    setReviews(next);
    writeJSON(REVIEW_KEY(postId), next);
    setReviewText("");
    setReviewRating(5);
  };

  const fmt = (iso: string) => {
    try {
      return formatDistanceToNow(new Date(iso), { addSuffix: true });
    } catch {
      return "";
    }
  };

  return (
    <div className="border-t border-white/5 pt-3 mt-1 space-y-3">
      <div className="flex gap-1 text-xs">
        <button
          onClick={() => setTab("comments")}
          className={cn(
            "px-3 py-1.5 rounded-full font-medium",
            tab === "comments"
              ? "bg-primary text-white"
              : "bg-white/5 text-white/70 hover:bg-white/10",
          )}
        >
          Comments ({(comments?.length ?? 0) + replies.length})
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={cn(
            "px-3 py-1.5 rounded-full font-medium",
            tab === "reviews"
              ? "bg-primary text-white"
              : "bg-white/5 text-white/70 hover:bg-white/10",
          )}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      {tab === "comments" && (
        <div className="space-y-3">
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {(comments ?? []).map((c: any) => {
              const childReplies = replies.filter((r: any) => r.parentId === c.id);
              return (
                <div key={c.id} className="flex gap-2">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src={c.author?.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      {c.author?.name?.[0] ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <GlassContainer rounded="2xl" className="bg-white/5">
                      <div className="px-3 py-2">
                        <div className="text-xs font-semibold text-white">
                          {c.author?.name ?? "User"}
                        </div>
                        <div className="text-sm text-white/85 break-words">
                          {c.content}
                        </div>
                      </div>
                    </GlassContainer>
                    <div className="flex items-center gap-3 px-3 mt-1 text-[11px] text-white/50">
                      <span>{fmt(c.createdAt ?? '')}</span>
                      <button
                        className="hover:text-white"
                        onClick={() =>
                          setReplyTo(replyTo === c.id ? null : c.id)
                        }
                      >
                        Reply
                      </button>
                    </div>

                    {childReplies.length > 0 && (
                      <div className="mt-2 ml-3 border-l border-white/10 pl-3 space-y-2">
                        {childReplies.map((r) => (
                          <div key={r.id} className="text-sm">
                            <GlassContainer rounded="2xl" className="bg-white/5">
                              <div className="px-3 py-1.5">
                                <span className="font-semibold text-white text-xs mr-1">
                                  {r.authorName}
                                </span>
                                <span className="text-white/85">{r.content}</span>
                              </div>
                            </GlassContainer>
                            <div className="px-3 mt-0.5 text-[11px] text-white/50">
                              {fmt(r.createdAt ?? '')}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {replyTo === c.id && (
                      <div className="mt-2 flex gap-2">
                        <input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply…"
                          className="flex-1 bg-white/10 border border-white/10 rounded-full h-8 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <Button
                          size="sm"
                          className="h-8 px-3"
                          onClick={() => submitReply(c.id)}
                        >
                          Send
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {(!comments || comments.length === 0) && (
              <div className="text-xs text-white/40 px-1">
                No comments yet. Be the first.
              </div>
            )}
          </div>

          <form onSubmit={submitComment} className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment…"
              className="flex-1 bg-white/10 border border-white/10 rounded-full h-9 px-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              type="submit"
              size="sm"
              className="h-9 px-3"
              disabled={createComment.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {tab === "reviews" && (
        <div className="space-y-3">
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {reviews.length === 0 && (
              <div className="text-xs text-white/40 px-1">
                No reviews yet. Share your experience.
              </div>
            )}
            {reviews.map((r) => (
              <GlassContainer key={r.id} rounded="xl" className="bg-white/5">
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">
                      {r.authorName}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            i < r.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-white/20",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-white/85 mt-1 break-words">
                    {r.content}
                  </div>
                  <div className="text-[11px] text-white/40 mt-1">
                    {fmt(r.createdAt ?? '')}
                  </div>
                </div>
              </GlassContainer>
            ))}
          </div>

          <form onSubmit={submitReview} className="space-y-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setReviewRating(i + 1)}
                  aria-label={`Rate ${i + 1} stars`}
                >
                  <Star
                    className={cn(
                      "h-5 w-5 transition-colors",
                      i < reviewRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-white/30 hover:text-white/60",
                    )}
                  />
                </button>
              ))}
              <span className="text-xs text-white/50 ml-1">
                {reviewRating}/5
              </span>
            </div>
            <div className="flex gap-2">
              <input
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write a review…"
                className="flex-1 bg-white/10 border border-white/10 rounded-full h-9 px-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button type="submit" size="sm" className="h-9 px-3">
                Post
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
