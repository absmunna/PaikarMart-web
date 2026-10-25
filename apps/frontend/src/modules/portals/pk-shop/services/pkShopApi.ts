import axios from 'axios';
import { PKShopProduct, PKShopOrder, PKShopTeamMember, PKShopStats } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/pk-shop`
  : '/api/v1/pk-shop';

const getAuthHeaders = () => {
  const token = localStorage.getItem('pm_auth_token') || 
                localStorage.getItem('token') || 
                sessionStorage.getItem('pm_auth_token') || 
                '';
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const CURATED_PK_PRODUCTS: PKShopProduct[] = [
  {
    id: "pk-101",
    sku: "PK-FASH-001",
    title: "হাতে বোনা ঢাকাই জামদানি শাড়ি (রয়েল প্রিমিয়াম কালেকশন)",
    description: "১০০ কাউন্ট সুতি সুতায় খাঁটি তাঁতিদের হাতে বোনা ঐতিহ্যবাহী ঢাকাই জামদানি শাড়ি। জড়ি ও রেশম সুতার নিখুঁত কারুকাজ। পিকে স্পেশাল সার্টিফিকেট সহ সরবরাহ।",
    price: 14500,
    originalPrice: 18000,
    stock: 15,
    category: "Luxury Fashion",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80"
    ],
    isVerified: true,
    portal: "pk-shop",
    coinCashbackPercent: 10,
    shippingOption: "১ দিনে এক্সপ্রেস ফ্রি ডেলিভারি",
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  },
  {
    id: "pk-102",
    sku: "PK-TECH-002",
    title: "স্মার্ট অ্যাক্টিভ নয়েজ ক্যান্সেলিং ওয়্যারলেস হেডফোন প্রো",
    description: "৪০ মিমি ডাইনামিক ড্রাইভার, হাই-রেস অডিও সার্টিফাইড, ৬০ ঘণ্টার প্লেব্যাক এবং হাইব্রিড এএনসি প্রযুক্তি সহ স্টুডিও কোয়ালিটি সাউন্ড।",
    price: 6250,
    originalPrice: 7500,
    stock: 24,
    category: "Premium Electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80"
    ],
    isVerified: true,
    portal: "pk-shop",
    coinCashbackPercent: 8,
    shippingOption: "৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি",
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  },
  {
    id: "pk-103",
    sku: "PK-ORG-003",
    title: "খাঁটি সুন্দরবন প্রাকৃতিক বুনো মধু (১ কেজি প্রিমিয়াম কাঁচের জার)",
    description: "সুন্দরবনের গভীর ম্যানগ্রোভ বনের খলিসা ও গরা ফুলের ১০০% বিশুদ্ধ প্রাকৃতিক ও অপরিশোধিত মধু। ল্যাব টেস্ট ভেরিফাইড।",
    price: 1450,
    originalPrice: 1750,
    stock: 50,
    category: "Curated Organics",
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80"
    ],
    isVerified: true,
    portal: "pk-shop",
    coinCashbackPercent: 12,
    shippingOption: "নিরাপদ প্যাকেজিং ও ফাস্ট ডেলিভারি",
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  },
  {
    id: "pk-104",
    sku: "PK-FASH-004",
    title: "ফুল গ্রেইন লেদার হ্যান্ডক্রাফটেড বিজনেসম্যান ল্যাপটপ ব্যাগ",
    description: "প্রিমিয়াম জেনুইন লেদার, ওয়াটার-রেজিস্ট্যান্ট লাইনিং, ১৫.৬ ইঞ্চি ল্যাপটপ স্লট ও প্রিমিয়াম ওয়াইকেকে মেটাল জিপার সহ কর্পোরেট লুক।",
    price: 4800,
    originalPrice: 5900,
    stock: 18,
    category: "Luxury Fashion",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"
    ],
    isVerified: true,
    portal: "pk-shop",
    coinCashbackPercent: 7,
    shippingOption: "ফ্রি হোম ডেলিভারি",
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  },
  {
    id: "pk-105",
    sku: "PK-TECH-005",
    title: "অটোমেটিক ইতালিয়ান বারিস্টা এসপ্রেসো কফি মেকার ২০ বার",
    description: "২০ বার হাই প্রেশার পাম্প, প্রিমিয়াম স্টেইনলেস স্টিল ফিনিশ ও থার্মোব্লক হিটিং সিস্টেম। বাড়িতেই তৈরি করুন ক্যাফে স্টাইল ক্যাপুচিনো।",
    price: 18900,
    originalPrice: 22500,
    stock: 8,
    category: "Premium Electronics",
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&q=80"
    ],
    isVerified: true,
    portal: "pk-shop",
    coinCashbackPercent: 10,
    shippingOption: "ওয়্যারহাউজ পিকআপ ও ফ্রি ইনস্টলেশন",
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  },
  {
    id: "pk-106",
    sku: "PK-TECH-006",
    title: "টাইটানিয়াম বেজেল অ্যামোলেড স্মার্ট ওয়াচ আল্ট্রা ২",
    description: "২.০৪ ইঞ্চি আল্ট্রা-ব্রাইট অ্যামোলেড ডিসপ্লে, ব্লুটুথ কলিং, জিপিএস ট্র্যাকিং ও কমপ্লিট হেলথ ট্র্যাকার সহ ওয়াটারপ্রুফ বডি।",
    price: 5400,
    originalPrice: 6800,
    stock: 32,
    category: "Premium Electronics",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
    ],
    isVerified: true,
    portal: "pk-shop",
    coinCashbackPercent: 15,
    shippingOption: "২৪ ঘণ্টায় এক্সপ্রেস ডেলিভারি",
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  },
  {
    id: "pk-107",
    sku: "PK-ORG-007",
    title: "খাঁটি গাওয়া ঘি ও নাটস প্রিমিয়াম গিফট হ্যাম্পার",
    description: "সিরাজগঞ্জের খাঁটি গাওয়া ঘি, রোস্টেড কাজু, কাঠবাদাম ও প্রিমিয়াম মেডিজুল খেজুর সমৃদ্ধ এক্সক্লুসিভ হ্যাম্পার বক্স।",
    price: 2950,
    originalPrice: 3600,
    stock: 40,
    category: "Curated Organics",
    images: [
      "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&q=80"
    ],
    isVerified: true,
    portal: "pk-shop",
    coinCashbackPercent: 10,
    shippingOption: "স্পেশাল এয়ার-টাইট গিফট প্যাকেজিং",
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  },
  {
    id: "pk-108",
    sku: "PK-EXCL-008",
    title: "আর্টিজান সলিড সেগুন কাঠের ভিন্টেজ ডেস্ক ল্যাম্প",
    description: "হাতে খোদাই করা সলিড চিটাগাং সেগুন কাঠ এবং রেট্রো এডিসন এলইডি ফিলামেন্ট বাল্ব সহ ঘরের আভিজাত্য বাড়ানোর ইউনিক পিস।",
    price: 3200,
    originalPrice: 4000,
    stock: 12,
    category: "Exclusive Catalog",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80"
    ],
    isVerified: true,
    portal: "pk-shop",
    coinCashbackPercent: 5,
    shippingOption: "ফ্রি ডোরস্টেপ ডেলিভারি",
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  }
];

export const pkShopApi = {
  // Public
  async getProducts(params?: { category?: string; search?: string; sort?: string }): Promise<PKShopProduct[]> {
    try {
      const res = await axios.get(`${API_BASE}/products`, { params, timeout: 3500 });
      if (res.data?.products && Array.isArray(res.data.products) && res.data.products.length > 0) {
        return res.data.products;
      }
    } catch {
      // Fallback to client resilient curated catalog
    }

    let filtered = [...CURATED_PK_PRODUCTS];

    if (params?.category && params.category !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }

    if (params?.sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (params?.sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  },

  async getProductById(id: string): Promise<PKShopProduct> {
    try {
      const res = await axios.get(`${API_BASE}/products/${id}`, { timeout: 3500 });
      if (res.data?.product) return res.data.product;
    } catch {
      // Fallback
    }
    return CURATED_PK_PRODUCTS.find(p => p.id === id) || CURATED_PK_PRODUCTS[0];
  },

  // Admin Stats
  async getAdminStats(): Promise<PKShopStats> {
    const res = await axios.get(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return res.data?.stats;
  },

  // Admin Product Management
  async saveProduct(product: Partial<PKShopProduct>): Promise<PKShopProduct> {
    const res = await axios.post(`${API_BASE}/admin/products`, product, {
      headers: getAuthHeaders()
    });
    return res.data?.product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await axios.delete(`${API_BASE}/admin/products/${id}`, {
      headers: getAuthHeaders()
    });
    return res.data?.success || false;
  },

  // Admin Order Processing
  async getOrders(status?: string): Promise<PKShopOrder[]> {
    const res = await axios.get(`${API_BASE}/admin/orders`, {
      params: { status },
      headers: getAuthHeaders()
    });
    return res.data?.orders || [];
  },

  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<PKShopOrder> {
    const res = await axios.patch(
      `${API_BASE}/admin/orders/${orderId}/status`,
      { status, notes },
      { headers: getAuthHeaders() }
    );
    return res.data?.order;
  },

  // Super Admin Team Governance
  async getTeamMembers(): Promise<PKShopTeamMember[]> {
    const res = await axios.get(`${API_BASE}/admin/team`, {
      headers: getAuthHeaders()
    });
    return res.data?.team || [];
  },

  async addTeamMember(member: { email?: string; phone?: string; name?: string; role: 'STORE_MANAGER' | 'MODERATOR'; permissions?: string[] }): Promise<PKShopTeamMember> {
    const res = await axios.post(`${API_BASE}/admin/team/add`, member, {
      headers: getAuthHeaders()
    });
    return res.data?.member;
  },

  async removeTeamMember(id: string): Promise<boolean> {
    const res = await axios.delete(`${API_BASE}/admin/team/${id}`, {
      headers: getAuthHeaders()
    });
    return res.data?.success || false;
  }
};
