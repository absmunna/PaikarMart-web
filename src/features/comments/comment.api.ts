import { api } from "@/lib/api";
import { Comment, CommentTarget, CommentType } from "@/modules/social/types/comment.types";

const MOCK_COMMENTS: Comment[] = [
  {
    id: "c-1",
    authorId: "u-demo",
    targetId: "p-1",
    targetType: "product",
    type: "review",
    text: "Great product, fast delivery and excellent quality.",
    createdAt: new Date().toISOString(),
    rating: 5,
    verifiedBuyer: true,
  },
  {
    id: "c-2",
    authorId: "u-demo",
    targetId: "p-2",
    targetType: "product",
    type: "qa",
    text: "Does this support bulk orders?",
    createdAt: new Date().toISOString(),
    verifiedBuyer: false,
  },
  {
    id: "c-3",
    authorId: "u-karim",
    targetId: "c-2",
    targetType: "post",
    type: "qa",
    parentId: "c-2",
    text: "Yes, we can fulfill bulk inquiries with a custom quote.",
    createdAt: new Date().toISOString(),
    isSellerReply: true,
  },
];

export async function getCommentsByTarget(targetType: CommentTarget, targetId: string): Promise<Comment[]> {
  return api.get<Comment[]>(`/api/comments?targetType=${targetType}&targetId=${targetId}`);
}

export async function addComment(comment: Omit<Comment, "id" | "createdAt" | "isSellerReply" | "verifiedBuyer">): Promise<Comment> {
  return api.post<Comment>("/api/comments", comment);
}
