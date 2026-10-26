import { Post } from "./post.types";
import { User } from "@/modules/auth/types/user.types";
import { api } from "@/lib/api";

export const MOCK_SELLERS: User[] = [
  {
    id: "u-aisha",
    name: "Aisha Fashion",
    handle: "@aishafashion",
    avatar: "",
    isSeller: true,
    role: "seller",
    sellerType: "retail",
    shopName: "Aisha Fashion",
    shopCover: "/generated/banner2.png",
    shopLogo: "/generated/avatar2.png",
    isVerified: true,
    followers: 1240,
    rating: 4.9,
  },
  {
    id: "u-karim",
    name: "Karim Electronics",
    handle: "@karimstore",
    avatar: "",
    isSeller: true,
    role: "seller",
    sellerType: "wholesale",
    shopName: "Karim Electronics",
    shopCover: "/generated/banner3.png",
    shopLogo: "/generated/avatar3.png",
    isVerified: true,
    followers: 3120,
    rating: 4.6,
  },
  {
    id: "u-rahim",
    name: "Rahim Traders",
    handle: "@rahimtraders",
    avatar: "",
    isSeller: true,
    role: "seller",
    sellerType: "service",
    shopName: "Rahim Traders",
    shopCover: "/generated/banner4.png",
    shopLogo: "/generated/avatar4.png",
    isVerified: true,
    followers: 980,
    rating: 4.4,
  },
  {
    id: "u-dhaka-rides",
    name: "Dhaka Rides",
    handle: "@dhakarides",
    avatar: "",
    isSeller: true,
    role: "seller",
    sellerType: "content_creator",
    shopName: "Dhaka Rides",
    shopCover: "/generated/banner5.png",
    shopLogo: "/generated/avatar1.png",
    isVerified: true,
    followers: 540,
    rating: 4.5,
  },
];

interface ApiAuthor {
  id: string;
  name: string;
  handle: string;
  avatar: string | null;
  isSeller: boolean;
  followers?: number;
}

interface ApiPost {
  id: string;
  type: "Product" | "Service" | "Demand";
  authorId: string;
  title: string;
  description: string | null;
  mediaUrl: string | null;
  price: number | null;
  location: string | null;
  likes: number;
  comments: number;
  rating: string | null;
  reviewCount: number;
  createdAt: string;
  author?: ApiAuthor | null;
}

function adaptPost(p: ApiPost): Post {
  return {
    id: p.id,
    type: p.type,
    authorId: p.authorId,
    title: p.title,
    description: p.description ?? "",
    mediaUrl: p.mediaUrl ?? undefined,
    price: p.price ?? undefined,
    location: p.location ?? undefined,
    createdAt: p.createdAt,
    likes: p.likes,
    comments: p.comments,
    rating: p.rating ? Number(p.rating) : undefined,
    reviewCount: p.reviewCount,
    isLiked: false,
  };
}

export async function getFeedPosts(_page = 1, filter = "All"): Promise<Post[]> {
  const query = filter && filter !== "All" ? `?type=${encodeURIComponent(filter)}` : "";
  const list = await api.get<ApiPost[]>(`/api/posts${query}`);
  return list.map(adaptPost);
}

export async function getPostById(id: string): Promise<Post | undefined> {
  try {
    const p = await api.get<ApiPost>(`/api/posts/${id}`);
    return adaptPost(p);
  } catch {
    return undefined;
  }
}
