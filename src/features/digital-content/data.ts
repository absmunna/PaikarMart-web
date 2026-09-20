/**
 * Demo digital-content catalog.
 * Replace with real API hooks once `/api/videos` is added to the OpenAPI spec.
 */
export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  previewUrl: string;
  fullUrl: string;
  previewSeconds: number;
  totalSeconds: number;
  price: number;
  currency: string;
  vendor: { id: string; name: string; verified: boolean };
  tags: string[];
}

export interface VideoPackage {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoIds: string[];
  price: number;
  currency: string;
  vendor: { id: string; name: string; verified: boolean };
}

const big = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const elephant = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
const sintel = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4";

export const DIGITAL_VIDEOS: VideoItem[] = [
  {
    id: "vid_001",
    title: "Wholesale Sourcing Masterclass",
    description: "Step-by-step playbook for sourcing wholesale stock at the best price.",
    thumbnail: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900",
    previewUrl: big, fullUrl: big,
    previewSeconds: 180, totalSeconds: 3600,
    price: 19.99, currency: "USD",
    vendor: { id: "v_acad", name: "PaikarMart Academy", verified: true },
    tags: ["wholesale", "course", "business"],
  },
  {
    id: "vid_002",
    title: "Service Selling Playbook",
    description: "How to package your services and sell them like products on PaikarMart.",
    thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900",
    previewUrl: elephant, fullUrl: elephant,
    previewSeconds: 180, totalSeconds: 2700,
    price: 14.99, currency: "USD",
    vendor: { id: "v_acad", name: "PaikarMart Academy", verified: true },
    tags: ["service", "course"],
  },
  {
    id: "vid_003",
    title: "Retail Store Setup in 1 Day",
    description: "Set up your retail storefront and ship your first order in 24 hours.",
    thumbnail: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=900",
    previewUrl: sintel, fullUrl: sintel,
    previewSeconds: 180, totalSeconds: 4200,
    price: 24.99, currency: "USD",
    vendor: { id: "v_acad", name: "PaikarMart Academy", verified: true },
    tags: ["retail", "course"],
  },
];

export const DIGITAL_PACKAGES: VideoPackage[] = [
  {
    id: "pkg_full",
    title: "Full Seller Bundle",
    description: "Get every PaikarMart Academy course at a discounted bundle price.",
    thumbnail: "https://images.unsplash.com/photo-1542744095-291d1f67b221?w=900",
    videoIds: ["vid_001", "vid_002", "vid_003"],
    price: 39.99, currency: "USD",
    vendor: { id: "v_acad", name: "PaikarMart Academy", verified: true },
  },
];

export function getVideoById(id: string) {
  return DIGITAL_VIDEOS.find((v) => v.id === id);
}
export function getPackageById(id: string) {
  return DIGITAL_PACKAGES.find((p) => p.id === id);
}
export function packagesContaining(videoId: string) {
  return DIGITAL_PACKAGES.filter((p) => p.videoIds.includes(videoId));
}
