export interface Review {
  id: string;
  productId: string;
  shopId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
