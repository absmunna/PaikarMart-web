export type CommentType = "qa" | "review";
export type CommentTarget = "product" | "seller" | "post";

export interface Comment {
  id: string;
  authorId: string;
  targetId: string;
  targetType: CommentTarget;
  sellerId?: string;
  parentId?: string;
  type: CommentType;
  text: string;
  createdAt: string;
  isSellerReply?: boolean;
  verifiedBuyer?: boolean;
  rating?: number;
  imageUrl?: string;
}
