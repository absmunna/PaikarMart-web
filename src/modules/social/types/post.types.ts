export type PostType = "Product" | "Service" | "Demand";

export interface Post {
  id: string;
  type: PostType;
  authorId: string;
  title: string;
  description: string;
  mediaUrl?: string;
  isVideo?: boolean;
  price?: number;
  location?: string;
  createdAt: string;
  likes: number;
  comments: number;
  rating?: number;
  reviewCount?: number;
  isLiked?: boolean;
}
