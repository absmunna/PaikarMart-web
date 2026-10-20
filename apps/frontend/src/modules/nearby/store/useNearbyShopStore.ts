import { create } from 'zustand';

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface Shop {
  id: string;
  name: string;
  category: string;
  categoryLocal: string;
  address: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  isOpen: boolean;
  isVerified: boolean;
  hasTradeLicense: boolean;
  phone: string;
  type: string;
  trustLevel: number;
  owner: string;
  lat: number;
  lng: number;
  image?: string;
  catalog: CatalogItem[];
}

interface NearbyShopStore {
  shops: Shop[];
  isLoading: boolean;
  error: string | null;
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
  setShops: (shops: Shop[]) => void;
  addShop: (shop: Shop) => void;
}

const mockShops: Shop[] = [
  {
    id: "nb-1",
    name: "রহিম জেনারেল স্টোর (Rahim General Store)",
    category: "grocery",
    categoryLocal: "মুদিখানা",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
    rating: 4.8,
    reviews: 156,
    address: "মিরপুর ২, ঢাকা (Mirpur 2, Dhaka)",
    location: "মিরপুর ২, ঢাকা (Mirpur 2, Dhaka)",
    distance: "0.8 km",
    isOpen: true,
    isVerified: true,
    hasTradeLicense: true,
    phone: "01700000001",
    type: "shop",
    trustLevel: 7,
    owner: "মো: আব্দুর রহিম",
    lat: 23.8041,
    lng: 90.3601,
    catalog: [
      { id: "p1", name: "Fresh Milk (১ লিটার)", price: 90, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100" },
      { id: "p2", name: "Premium Miniket Rice (৫ কেজি)", price: 340, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100" },
      { id: "p3", name: "Organic Mustard Oil (১ লিটার)", price: 280, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100" }
    ]
  },
  {
    id: "nb-2",
    name: "লাজ ফার্মা - মিরপুর শাখা (Lazz Pharma)",
    category: "pharmacy",
    categoryLocal: "ফার্মেসি",
    image: "https://images.unsplash.com/photo-1586015555751-6397455d8b2d?w=600",
    rating: 4.9,
    reviews: 420,
    address: "মিরপুর ১০, ঢাকা (Mirpur 10, Dhaka)",
    location: "মিরপুর ১০, ঢাকা (Mirpur 10, Dhaka)",
    distance: "1.2 km",
    isOpen: true,
    isVerified: true,
    hasTradeLicense: true,
    phone: "01700000002",
    type: "shop",
    trustLevel: 7,
    owner: "ফার্মাসিস্ট সুহেল রানা",
    lat: 23.8223,
    lng: 90.3654,
    catalog: [
      { id: "p4", name: "Napa Extend (১২ টি)", price: 30, image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=100" },
      { id: "p5", name: "Antiseptic Liquid (২০০ মিলি)", price: 120, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100" },
      { id: "p6", name: "Surgical Mask Box (৫০ টি)", price: 150, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100" }
    ]
  },
  {
    id: "nb-3",
    name: "করিম ইলেকট্রিশিয়ান (Karim Expert Electrician)",
    category: "services",
    categoryLocal: "সেবাসমূহ",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
    rating: 4.7,
    reviews: 84,
    address: "মিরপুর ১৪, ঢাকা (Mirpur 14, Dhaka)",
    location: "মিরপুর ১৪, ঢাকা (Mirpur 14, Dhaka)",
    distance: "1.5 km",
    isOpen: true,
    isVerified: true,
    hasTradeLicense: false,
    phone: "01700000003",
    type: "service",
    trustLevel: 5,
    owner: "আব্দুল করিম",
    lat: 23.8123,
    lng: 90.3789,
    catalog: [
      { id: "s1", name: "Ceiling Fan Repairing (ফ্যান মেরামত)", price: 200, image: "https://images.unsplash.com/photo-1565608414364-7936a798cb3d?w=100" },
      { id: "s2", name: "Short Circuit Troubleshooting", price: 500, image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=100" },
      { id: "s3", name: "Home AC Service & Diagnostic", price: 1200, image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=100" }
    ]
  },
  {
    id: "nb-4",
    name: "সালমা বুটিকস ও টেইলার্স (Salma Boutique)",
    category: "homemade",
    categoryLocal: "হোমমেড ও বুটিকস",
    image: "https://images.unsplash.com/photo-1556905200-279565513a2d?w=600",
    rating: 4.6,
    reviews: 32,
    address: "মিরপুর ১২, ঢাকা (Mirpur 12, Dhaka)",
    location: "মিরপুর ১২, ঢাকা (Mirpur 12, Dhaka)",
    distance: "1.9 km",
    isOpen: true,
    isVerified: true,
    hasTradeLicense: false,
    phone: "01700000004",
    type: "service",
    trustLevel: 4,
    owner: "সালমা সুলতানা",
    lat: 23.8345,
    lng: 90.3592,
    catalog: [
      { id: "s4", name: "Ladies Three-piece Stitching", price: 450, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=100" },
      { id: "s5", name: "Exclusive Cotton Sharee Crafting", price: 1500, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100" }
    ]
  }
];

export const useNearbyShopStore = create<NearbyShopStore>((set) => ({
  shops: mockShops,
  isLoading: false,
  error: null,
  selectedShop: null,
  setSelectedShop: (shop) => set({ selectedShop: shop }),
  setShops: (shops) => set({ shops }),
  addShop: (shop) => set((state) => ({ shops: [shop, ...state.shops] })),
}));
