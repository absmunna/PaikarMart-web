import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ─── Types ───────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  title?: string;
  price: number;
  originalPrice?: number;
  compareAtPrice?: number;
  discount?: number;
  image?: string;
  images?: string[];
  category?: string;
  categoryId?: string;
  seller?: string;
  sellerId?: string;
  vendorName?: string;
  vendor?: { id: string; name: string; avatarUrl?: string };
  location?: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  description?: string;
  unit?: string;
  moq?: number;
  tags?: string[];
  type?: string;
  portal?: string;
}

export interface Post {
  id: string;
  content?: string;
  author?: { id: string; name: string; avatar?: string; avatarUrl?: string; verified?: boolean };
  likes?: number;
  comments?: number;
  shares?: number;
  isLiked?: boolean;
  liked?: boolean;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
  images?: string[];
  createdAt?: string;
  product?: Product;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  slug?: string;
  count?: number;
  productCount?: number;
  description?: string;
  subcategories?: string[];
}

export interface Demand {
  id: string;
  title: string;
  description: string;
  quantity?: number;
  unit?: string;
  budget?: number;
  deadline?: string;
  urgency?: string;
  status?: string;
  category?: string;
  categoryId?: string;
  location?: string;
  createdAt?: string;
  author?: { id: string; name: string; avatar?: string; avatarUrl?: string };
  responses?: number;
  matchCount?: number;
  matches?: { id: string; name: string; avatar?: string }[];
}

export interface Vendor {
  id: string;
  name: string;
  logo?: string;
  avatarUrl?: string;
  coverUrl?: string;
  tagline?: string;
  followers?: number;
  description?: string;
  createdAt?: string;
  totalOrders?: number;
  products?: Product[];
  recentPosts?: Post[];
  rating: number;
  productCount?: number;
  category?: string;
  type?: string;
  location?: string;
  verified?: boolean;
  responseTime?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Notification {
  id: string;
  title: string;
  message?: string;
  read: boolean;
  createdAt?: string;
  type?: string;
}

export type CreateDemandBodyUrgency = 'low' | 'normal' | 'medium' | 'high' | 'urgent' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ListProductsSort = 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular' | 'trending';
export type ListProductsType = 'retail' | 'wholesale' | 'factory_direct' | 'service' | 'digital_service' | 'grocery' | 'dropship' | 'hotel';

// ─── Query Keys ───────────────────────────────────────────
export const getListProductsQueryKey = (params?: object) => ['products', params];
export const getGetProductQueryKey = (id: string) => ['product', id];
export const getListCategoriesQueryKey = () => ['categories'];
export const getListDemandsQueryKey = (params?: object) => ['demands', params];
export const getGetDemandQueryKey = (id: string) => ['demand', id];
export const getListVendorsQueryKey = (params?: object) => ['vendors', params];
export const getGetVendorQueryKey = (id: string) => ['vendor', id];
export const getListPostsQueryKey = (params?: object) => ['posts', params];
export const getGetSellerStatsQueryKey = () => ['seller-stats'];
export const getGetSuggestedVendorsQueryKey = () => ['suggested-vendors'];
export const getGetTrendingProductsQueryKey = () => ['trending-products'];
export const getListNotificationsQueryKey = () => ['notifications'];
export const getListPostCommentsQueryKey = (postId?: string) => ['post-comments', postId];
export const getGetPlatformStatsQueryKey = () => ['platform-stats'];

// ─── Mock Products ────────────────────────────────────────
export const mockProducts: Product[] = [
  { id: '1', name: 'ইলিশ মাছ (বড়)', price: 1200, originalPrice: 1500, discount: 20, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', category: 'মাছ', seller: 'ঢাকা ফিশ মার্ট', rating: 4.5, reviewCount: 128, stock: 50, unit: 'কেজি', type: 'retail' },
  { id: '2', name: 'বাসমতি চাল (প্রিমিয়াম)', price: 180, originalPrice: 200, discount: 10, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', category: 'চাল', seller: 'আড়ং রাইস', rating: 4.8, reviewCount: 256, stock: 200, unit: 'কেজি', type: 'retail' },
  { id: '3', name: 'Samsung Galaxy A55', price: 45000, originalPrice: 50000, discount: 10, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', category: 'মোবাইল', seller: 'টেক বাজার', rating: 4.6, reviewCount: 89, stock: 15, type: 'retail' },
  { id: '4', name: 'হ্যান্ডলুম শাড়ি', price: 2500, originalPrice: 3000, discount: 17, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', category: 'পোশাক', seller: 'বুটিক কর্নার', rating: 4.7, reviewCount: 45, stock: 30, type: 'retail' },
  { id: '5', name: 'অর্গানিক মধু', price: 850, image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400', category: 'খাদ্য', seller: 'প্রাকৃতিক ফার্ম', rating: 4.9, reviewCount: 312, stock: 80, unit: 'কেজি', type: 'grocery' },
  { id: '6', name: 'লেদার হ্যান্ডব্যাগ', price: 1800, originalPrice: 2200, discount: 18, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', category: 'ব্যাগ', seller: 'লেদার ওয়ার্ল্ড', rating: 4.4, reviewCount: 67, stock: 25, type: 'retail' },
  { id: '7', name: 'পাঞ্জাবি লিনেন কটন', price: 1850, originalPrice: 2400, discount: 23, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e16?w=400', category: 'পোশাক', seller: 'করিম ফ্যাশন', rating: 4.7, reviewCount: 342, stock: 45, type: 'wholesale' },
  { id: '8', name: 'জামদানি শাড়ি হ্যান্ডমেড', price: 8500, originalPrice: 11000, discount: 23, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', category: 'শাড়ি', seller: 'ঢাকা বুটিক', rating: 4.9, reviewCount: 87, stock: 12, type: 'retail' },
  { id: '9', name: 'Apple iPhone 15 Pro', price: 145000, originalPrice: 155000, discount: 6, image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400', category: 'মোবাইল', seller: 'টেক প্লাজা', rating: 4.8, reviewCount: 203, stock: 8, type: 'retail' },
  { id: '10', name: 'গরুর মাংস (তাজা)', price: 750, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400', category: 'মাংস', seller: 'ফার্ম ফ্রেশ', rating: 4.6, reviewCount: 178, stock: 100, unit: 'কেজি', type: 'grocery' },
  { id: '11', name: 'সোলার প্যানেল ৩৩০W', price: 18500, originalPrice: 22000, discount: 16, image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', category: 'সোলার', seller: 'গ্রীন এনার্জি', rating: 4.5, reviewCount: 34, stock: 20, type: 'wholesale' },
  { id: '12', name: 'বেতের আসবাবপত্র সেট', price: 12000, originalPrice: 15000, discount: 20, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', category: 'আসবাবপত্র', seller: 'হোম ডেকর', rating: 4.3, reviewCount: 56, stock: 10, type: 'retail' },
  { id: '13', name: 'AC Servicing & Repair', price: 1500, originalPrice: 2000, discount: 25, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400', category: 'Electrician', seller: 'Expert Hands BD', rating: 4.9, reviewCount: 102, stock: 999, type: 'service', portal: 'services' },
  { id: '14', name: 'House Shifting & Moving', price: 4500, originalPrice: 6000, discount: 20, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', category: 'Moving', seller: 'Safe Movers BD', rating: 4.7, reviewCount: 88, stock: 999, type: 'service', portal: 'services' },
  { id: '15', name: 'Plumbing Service Call', price: 500, originalPrice: 700, discount: 15, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400', category: 'Plumbing', seller: 'Quick Fix Plumbers', rating: 4.6, reviewCount: 45, stock: 999, type: 'service', portal: 'services' },
  { id: '16', name: 'Web Development Package', price: 12000, originalPrice: 15000, discount: 20, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', category: 'Tech', seller: 'Digital Crafters', rating: 5.0, reviewCount: 23, stock: 999, type: 'service', portal: 'services' },
  { id: '17', name: 'Legal Consultation', price: 2500, originalPrice: 3000, discount: 16, image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400', category: 'Legal', seller: 'Rahman & Associates', rating: 4.8, reviewCount: 56, stock: 999, type: 'service', portal: 'services' },
  
  // Rides
  { id: '18', name: 'Bike Ride (City Center)', price: 150, image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400', category: 'Bike', seller: 'Pathao Rider', rating: 4.8, reviewCount: 1500, stock: 999, type: 'ride', portal: 'ride' },
  { id: '19', name: 'Car Ride (Premium)', price: 450, image: 'https://images.unsplash.com/photo-1549317661-bc32c0734c81?w=400', category: 'Car', seller: 'Uber Driver', rating: 4.9, reviewCount: 890, stock: 999, type: 'ride', portal: 'ride' },
  { id: '20', name: 'CNG Auto (Hourly)', price: 300, image: 'https://images.unsplash.com/photo-1627581177810-7298642a8a5f?w=400', category: 'CNG', seller: 'Local CNG', rating: 4.5, reviewCount: 450, stock: 999, type: 'ride', portal: 'ride' },
  { id: '21', name: 'Ambulance (Emergency)', price: 1500, image: 'https://images.unsplash.com/photo-1587559070757-f72a388edbba?w=400', category: 'Emergency', seller: 'Al Markazul', rating: 4.9, reviewCount: 120, stock: 999, type: 'ride', portal: 'ride' },
  { id: '22', name: 'Parcel Delivery (Intercity)', price: 120, image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=400', category: 'Parcel', seller: 'RedX', rating: 4.7, reviewCount: 3400, stock: 999, type: 'ride', portal: 'ride' },

  // Digital
  { id: '23', name: 'E-Commerce React Template', price: 2500, originalPrice: 3500, discount: 28, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', category: 'Templates', seller: 'UI Pirates', rating: 4.9, reviewCount: 345, stock: 999, type: 'digital', portal: 'digital' },
  { id: '24', name: 'Canva Pro (1 Year)', price: 800, originalPrice: 4000, discount: 80, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', category: 'Software', seller: 'Digital Soft BD', rating: 4.6, reviewCount: 1230, stock: 999, type: 'digital', portal: 'digital' },
  { id: '25', name: 'SEO Mastery Course', price: 1500, originalPrice: 5000, discount: 70, image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400', category: 'Courses', seller: 'BD SEO Guru', rating: 4.8, reviewCount: 89, stock: 999, type: 'digital', portal: 'digital' },
  { id: '26', name: 'WP Rocket Plugin License', price: 500, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', category: 'Plugins', seller: 'Web Tools', rating: 4.7, reviewCount: 456, stock: 999, type: 'digital', portal: 'digital' },
  { id: '27', name: 'Figma Dashboard UI Kit', price: 1200, originalPrice: 2000, discount: 40, image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400', category: 'UI Kits', seller: 'Design Space', rating: 4.9, reviewCount: 231, stock: 999, type: 'digital', portal: 'digital' },

  // Hotel
  { id: '28', name: 'Cox\'s Bazar Ocean View Suite', price: 5500, originalPrice: 7000, discount: 21, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400', category: 'Resort', seller: 'Seagull Hotel', rating: 4.8, reviewCount: 560, stock: 5, type: 'hotel', portal: 'hotel' },
  { id: '29', name: 'Sylhet Tea Garden Resort', price: 6500, originalPrice: 8500, discount: 23, image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400', category: 'Resort', seller: 'Grand Sultan', rating: 4.9, reviewCount: 890, stock: 3, type: 'hotel', portal: 'hotel' },
  { id: '30', name: 'Dhaka Premium Single Room', price: 3000, image: 'https://images.unsplash.com/photo-1505691938895-1758d7def511?w=400', category: 'Hotel', seller: 'Pan Pacific', rating: 4.6, reviewCount: 120, stock: 10, type: 'hotel', portal: 'hotel' },
  { id: '31', name: 'Sajek Valley Eco Cottage', price: 4000, originalPrice: 5000, discount: 20, image: 'https://images.unsplash.com/photo-1542314831-c6a4d27ce66f?w=400', category: 'Cottage', seller: 'Meghmachang', rating: 4.8, reviewCount: 450, stock: 2, type: 'hotel', portal: 'hotel' },
  { id: '32', name: 'Kuakata Beach View Room', price: 2500, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400', category: 'Hotel', seller: 'Kuakata Inn', rating: 4.3, reviewCount: 230, stock: 8, type: 'hotel', portal: 'hotel' },

  // Food
  { id: '33', name: 'Kacchi Biryani (Mutton)', price: 450, image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400', category: 'Biryani', seller: 'Sultan\'s Dine', rating: 4.9, reviewCount: 3450, stock: 999, type: 'food', portal: 'food' },
  { id: '34', name: 'Beef Burger Combo', price: 380, originalPrice: 450, discount: 15, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category: 'Fast Food', seller: 'Takeout', rating: 4.7, reviewCount: 2100, stock: 999, type: 'food', portal: 'food' },
  { id: '35', name: 'Chicken Pizza (12 inch)', price: 750, originalPrice: 900, discount: 16, image: 'https://images.unsplash.com/photo-1513104890a38-7c7f476f4cbf?w=400', category: 'Pizza', seller: 'Pizza Hut', rating: 4.5, reviewCount: 1100, stock: 999, type: 'food', portal: 'food' },
  { id: '36', name: 'Fuchka (10 pcs)', price: 80, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', category: 'Street Food', seller: 'Dhanmondi Fuchka', rating: 4.8, reviewCount: 5600, stock: 999, type: 'food', portal: 'food' },
  { id: '37', name: 'Chocolate Cold Coffee', price: 180, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', category: 'Beverage', seller: 'Crimson Cup', rating: 4.6, reviewCount: 890, stock: 999, type: 'food', portal: 'food' },

  // Fashion
  { id: '38', name: 'Men\'s Denim Jacket', price: 1450, originalPrice: 2000, discount: 27, image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400', category: 'Winter Wear', seller: 'Yellow', rating: 4.7, reviewCount: 340, stock: 45, type: 'fashion', portal: 'fashion' },
  { id: '39', name: 'Women\'s Kurti Collection', price: 1200, originalPrice: 1500, discount: 20, image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=400', category: 'WomensWear', seller: 'Aarong', rating: 4.8, reviewCount: 670, stock: 120, type: 'fashion', portal: 'fashion' },
  { id: '40', name: 'Formal Leather Shoes', price: 2500, image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400', category: 'Shoes', seller: 'Bata', rating: 4.6, reviewCount: 230, stock: 35, type: 'fashion', portal: 'fashion' },
  { id: '41', name: 'Premium Watch (Analog)', price: 3500, originalPrice: 5000, discount: 30, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', category: 'Accessories', seller: 'Time Zone', rating: 4.9, reviewCount: 150, stock: 12, type: 'fashion', portal: 'fashion' },
  { id: '42', name: 'Trendy Sunglasses', price: 500, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', category: 'Accessories', seller: 'Lenskart', rating: 4.5, reviewCount: 890, stock: 200, type: 'fashion', portal: 'fashion' },

  // Electronics
  { id: '43', name: 'Smart LED TV 43"', price: 25000, originalPrice: 32000, discount: 21, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', category: 'TV', seller: 'Walton Plaza', rating: 4.7, reviewCount: 450, stock: 20, type: 'electronics', portal: 'electronics' },
  { id: '44', name: 'Inverter AC 1.5 Ton', price: 55000, originalPrice: 60000, discount: 8, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400', category: 'AC', seller: 'Vision Emporium', rating: 4.8, reviewCount: 230, stock: 15, type: 'electronics', portal: 'electronics' },
  { id: '45', name: 'Gaming Laptop RTX 4060', price: 135000, originalPrice: 145000, discount: 7, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', category: 'Laptop', seller: 'Star Tech', rating: 4.9, reviewCount: 120, stock: 5, type: 'electronics', portal: 'electronics' },
  { id: '46', name: 'Wireless Earbuds', price: 1500, originalPrice: 2500, discount: 40, image: 'https://images.unsplash.com/photo-1572569438065-e97089b380db?w=400', category: 'Audio', seller: 'Gadget & Gear', rating: 4.5, reviewCount: 890, stock: 100, type: 'electronics', portal: 'electronics' },
  { id: '47', name: 'Smartwatch Series 8', price: 3000, originalPrice: 4500, discount: 33, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400', category: 'Wearable', seller: 'Tech Den', rating: 4.6, reviewCount: 560, stock: 60, type: 'electronics', portal: 'electronics' },

  // Dropship
  { id: '48', name: 'Mini Portable Projector', price: 4500, originalPrice: 6000, discount: 25, image: 'https://images.unsplash.com/photo-1540899011985-7036ad6debed?w=400', category: 'Gadgets', seller: 'Global Sourcing BD', rating: 4.6, reviewCount: 230, stock: 500, type: 'dropship', portal: 'dropship' },
  { id: '49', name: 'Posture Corrector Brace', price: 600, originalPrice: 1200, discount: 50, image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400', category: 'Health', seller: 'Trendy Items BD', rating: 4.4, reviewCount: 890, stock: 1000, type: 'dropship', portal: 'dropship' },
  { id: '50', name: 'RGB LED Strip 5M', price: 450, originalPrice: 800, discount: 43, image: 'https://images.unsplash.com/photo-1550684376-efdb6e39fc21?w=400', category: 'Decor', seller: 'Flash Deals BD', rating: 4.8, reviewCount: 4500, stock: 2000, type: 'dropship', portal: 'dropship' },
  { id: '51', name: 'Electric Neck Massager', price: 850, originalPrice: 1500, discount: 43, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', category: 'Health Gadget', seller: 'Global Sourcing BD', rating: 4.5, reviewCount: 670, stock: 450, type: 'dropship', portal: 'dropship' },
  { id: '52', name: 'Silicone Stretch Lids', price: 250, originalPrice: 500, discount: 50, image: 'https://images.unsplash.com/photo-1584813589839-813d11b33946?w=400', category: 'Kitchen', seller: 'Smart Kitchen', rating: 4.7, reviewCount: 1200, stock: 3000, type: 'dropship', portal: 'dropship' },

  // Pharmacy
  { id: '53', name: 'Napa Extend 665mg', price: 6, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', category: 'Pain Relief', seller: 'Beximco Pharmacy', rating: 4.9, reviewCount: 2100, stock: 5000, type: 'pharmacy', portal: 'pharmacy' },
  { id: '54', name: 'Optifit Eye Drops 10ml', price: 180, originalPrice: 200, discount: 10, image: 'https://images.unsplash.com/photo-1576671414121-aa2d60f985a3?w=400', category: 'Eye Care', seller: 'Alcon BD', rating: 4.7, reviewCount: 289, stock: 150, type: 'pharmacy', portal: 'pharmacy' },
  { id: '55', name: 'Vitamin D3 1000IU (30 caps)', price: 200, image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400', category: 'Vitamins', seller: 'Aristopharma', rating: 4.8, reviewCount: 445, stock: 300, type: 'pharmacy', portal: 'pharmacy' },
  { id: '56', name: 'Fexo 120mg (Antihistamine)', price: 10, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400', category: 'Allergy', seller: 'Incepta Pharma', rating: 4.7, reviewCount: 567, stock: 2000, type: 'pharmacy', portal: 'pharmacy' },
  { id: '57', name: 'Metformin 500mg', price: 8, image: 'https://images.unsplash.com/photo-1550572017-edb799988a29?w=400', category: 'Diabetes', seller: 'Square Pharma', rating: 4.9, reviewCount: 1450, stock: 800, type: 'pharmacy', portal: 'pharmacy' },

  // Agriculture
  { id: '58', name: 'Premium Hilsa Fish', price: 1200, image: 'https://images.unsplash.com/photo-1509978778156-518eea30166b?w=400', category: 'Fishery', seller: 'Padma Fresh', rating: 4.9, reviewCount: 2340, stock: 50, type: 'agriculture', portal: 'agriculture' },
  { id: '59', name: 'Organic Basmati Rice', price: 95, originalPrice: 110, discount: 13, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', category: 'Crops', seller: 'Dinajpur Agro', rating: 4.7, reviewCount: 1870, stock: 500, type: 'agriculture', portal: 'agriculture' },
  { id: '60', name: 'Farm Fresh Potato', price: 28, image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400', category: 'Crops', seller: 'Munshiganj Farmers', rating: 4.5, reviewCount: 4120, stock: 1000, type: 'agriculture', portal: 'agriculture' },
  { id: '61', name: 'Deshi Cow Milk (Raw)', price: 90, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', category: 'Livestock', seller: 'Sirajganj Dairy', rating: 4.6, reviewCount: 3200, stock: 200, type: 'agriculture', portal: 'agriculture' },
  { id: '62', name: 'Fresh Organic Vegetables Box', price: 450, originalPrice: 500, discount: 10, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', category: 'Organic', seller: 'Green Earth', rating: 4.8, reviewCount: 980, stock: 100, type: 'agriculture', portal: 'agriculture' },
];

// ─── Mock Categories ──────────────────────────────────────
const mockCategories: Category[] = [
  { id: '1', name: 'ইলেকট্রনিক্স', icon: '📱', slug: 'electronics', count: 1250, productCount: 1250 },
  { id: '2', name: 'পোশাক', icon: '👗', slug: 'fashion', count: 3400, productCount: 3400 },
  { id: '3', name: 'খাদ্য', icon: '🛒', slug: 'grocery', count: 890, productCount: 890 },
  { id: '4', name: 'গৃহস্থালি', icon: '🏠', slug: 'home', count: 560, productCount: 560 },
  { id: '5', name: 'সৌন্দর্য', icon: '💄', slug: 'beauty', count: 720, productCount: 720 },
  { id: '6', name: 'কৃষি', icon: '🌾', slug: 'agriculture', count: 430, productCount: 430 },
  { id: '7', name: 'ওষুধ', icon: '💊', slug: 'pharmacy', count: 280, productCount: 280 },
  { id: '8', name: 'বই', icon: '📚', slug: 'books', count: 1100, productCount: 1100 },
  { id: '9', name: 'মোবাইল', icon: '📲', slug: 'mobile', count: 680, productCount: 680 },
  { id: '10', name: 'খেলাধুলা', icon: '⚽', slug: 'sports', count: 390, productCount: 390 },
  { id: '11', name: 'শিশু পণ্য', icon: '👶', slug: 'baby', count: 460, productCount: 460 },
  { id: '12', name: 'গাড়ি যন্ত্রাংশ', icon: '🚗', slug: 'automotive', count: 320, productCount: 320 },
];

// ─── Mock Vendors ─────────────────────────────────────────
const mockVendors: Vendor[] = [
  { id: '1', name: 'আড়ং', logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=100', rating: 4.9, productCount: 450, category: 'পোশাক', type: 'retail', location: 'ঢাকা', verified: true, responseTime: '১ ঘণ্টা' },
  { id: '2', name: 'ঢাকা ফিশ মার্ট', logo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', rating: 4.7, productCount: 120, category: 'মাছ', type: 'retail', location: 'ঢাকা', verified: true, responseTime: '২ ঘণ্টা' },
  { id: '3', name: 'টেক বাজার', logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100', rating: 4.6, productCount: 380, category: 'ইলেকট্রনিক্স', type: 'retail', location: 'ঢাকা', verified: true, responseTime: '৩০ মিনিট' },
  { id: '4', name: 'করিম ফ্যাশন হাউস', logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', rating: 4.8, productCount: 247, category: 'পোশাক', type: 'wholesale', location: 'নারায়ণগঞ্জ', verified: true, responseTime: '১ ঘণ্টা' },
  { id: '5', name: 'প্রাকৃতিক ফার্ম', logo: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=100', rating: 4.9, productCount: 85, category: 'খাদ্য', type: 'retail', location: 'গাজীপুর', verified: false, responseTime: '২ ঘণ্টা' },
  { id: '6', name: 'হোম ডেকর প্লাস', logo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100', rating: 4.3, productCount: 190, category: 'গৃহস্থালি', type: 'retail', location: 'চট্টগ্রাম', verified: false, responseTime: '৪ ঘণ্টা' },
  { id: '7', name: 'গ্রীন এনার্জি সলিউশন', logo: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=100', rating: 4.5, productCount: 60, category: 'সোলার', type: 'wholesale', location: 'ঢাকা', verified: true, responseTime: '৩ ঘণ্টা' },
  { id: '8', name: 'মেঘনা টেক্সটাইল', logo: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100', rating: 4.4, productCount: 530, category: 'কাপড়', type: 'wholesale', location: 'নারায়ণগঞ্জ', verified: true, responseTime: '২ ঘণ্টা' },
];

// ─── Mock Demands ─────────────────────────────────────────
const mockDemands: Demand[] = [
  { id: '1', title: '৫০০ পিস পাঞ্জাবি বাল্ক অর্ডার', description: 'ঈদের জন্য পাইকারি রেটে ৫০০+ পিস পাঞ্জাবি লাগবে। কটন বা মিক্সড কাপড়, সাইজ M-XXL। রং: সাদা, নীল, ক্রিম।', quantity: 500, unit: 'পিস', budget: 900000, deadline: '১৫ দিন', urgency: 'high', category: 'পোশাক', location: 'ঢাকা', responses: 8, createdAt: '2025-05-28' },
  { id: '2', title: 'অর্গানিক সবজি সাপ্লায়ার দরকার', description: 'রেস্টুরেন্টের জন্য প্রতিদিন তাজা অর্গানিক সবজি দরকার। টমেটো, গাজর, ক্যাপসিকাম, পালংশাক। কমপক্ষে ৫০ কেজি/দিন।', quantity: 50, unit: 'কেজি/দিন', budget: 15000, deadline: '৭ দিন', urgency: 'urgent', category: 'কৃষি', location: 'চট্টগ্রাম', responses: 12, createdAt: '2025-05-27' },
  { id: '3', title: 'অফিস ফার্নিচার সেট — ৫০ চেয়ার + ডেস্ক', description: 'নতুন অফিসের জন্য ৫০ সেট ওয়ার্কস্টেশন লাগবে। বাজেটের মধ্যে মানসম্পন্ন হলেই চলবে। EMI সুবিধা থাকলে ভালো।', quantity: 50, unit: 'সেট', budget: 500000, deadline: '৩০ দিন', urgency: 'normal', category: 'আসবাবপত্র', location: 'ঢাকা', responses: 5, createdAt: '2025-05-26' },
  { id: '4', title: 'প্রিন্টিং মেশিন — দ্বিতীয় হাতের চলবে', description: 'ছোট প্রিন্টিং শপের জন্য A3/A4 ডিজিটাল প্রিন্টিং মেশিন লাগবে। রিকন্ডিশন্ড হলেও চলবে। বাজেট টাইট।', quantity: 1, unit: 'পিস', budget: 80000, deadline: '১০ দিন', urgency: 'medium', category: 'ইলেকট্রনিক্স', location: 'সিলেট', responses: 3, createdAt: '2025-05-25' },
  { id: '5', title: '১০০০ পিস কটন টি-শার্ট — বাল্ক', description: 'কর্পোরেট ইভেন্টের জন্য কাস্টম প্রিন্ট সহ ১০০০ পিস টি-শার্ট দরকার। লোগো প্রিন্টিং সহ। ডেলিভারি ঢাকায়।', quantity: 1000, unit: 'পিস', budget: 200000, deadline: '২০ দিন', urgency: 'high', category: 'পোশাক', location: 'ঢাকা', responses: 15, createdAt: '2025-05-24' },
  { id: '6', title: 'সৌর বিদ্যুৎ প্যানেল — গ্রামীণ হাসপাতাল', description: 'একটি গ্রামীণ হাসপাতালের জন্য ৫কিলোওয়াট সোলার সিস্টেম দরকার। ইনস্টলেশন সহ। সরকারি অনুদানের আওতায়।', quantity: 1, unit: 'সিস্টেম', budget: 350000, deadline: '৪৫ দিন', urgency: 'low', category: 'সোলার', location: 'ময়মনসিংহ', responses: 6, createdAt: '2025-05-22' },
];

// ─── Mock Notifications ───────────────────────────────────
const mockNotifications: Notification[] = [
  { id: '1', title: 'অর্ডার নিশ্চিত হয়েছে', message: 'আপনার অর্ডার #PM-1234 নিশ্চিত হয়েছে', read: false, type: 'order', createdAt: '2025-05-28' },
  { id: '2', title: 'নতুন অফার', message: 'আজকের বিশেষ অফার মিস করবেন না — ৩০% ছাড়!', read: false, type: 'promo', createdAt: '2025-05-27' },
  { id: '3', title: 'ডেলিভারি আপডেট', message: 'আপনার পার্সেল পথে আছে। আজকেই পৌঁছাবে।', read: true, type: 'delivery', createdAt: '2025-05-26' },
  { id: '4', title: 'নতুন বার্তা', message: 'করিম ট্রেডার্স আপনাকে একটি বার্তা পাঠিয়েছেন', read: false, type: 'message', createdAt: '2025-05-28' },
];

// ─── Hooks — all list hooks return arrays directly ────────

export const useListProducts = (_params?: any, _opts?: any) =>
  useQuery({ 
    queryKey: getListProductsQueryKey(_params), 
    queryFn: async () => {
      let result = [...mockProducts];
      if (_params?.type) {
        result = result.filter(p => p.type === _params.type || p.portal === _params.type);
      }
      if (_params?.categoryId) {
        result = result.filter(p => p.categoryId === _params.categoryId || p.category?.toLowerCase() === _params.categoryId.toLowerCase());
      }
      return result;
    }, 
    staleTime: 60000 
  });

export const useGetProduct = (id: string, _opts?: any) =>
  useQuery({ queryKey: getGetProductQueryKey(id), queryFn: async () => mockProducts.find(p => p.id === id) ?? mockProducts[0], staleTime: 60000 });

export const useGetTrendingProducts = (_opts?: any) =>
  useQuery({ queryKey: getGetTrendingProductsQueryKey(), queryFn: async () => mockProducts.slice(0, 4), staleTime: 60000 });

export const useListCategories = (_params?: any, _opts?: any) =>
  useQuery({ queryKey: getListCategoriesQueryKey(), queryFn: async () => mockCategories, staleTime: 60000 });

export const useListDemands = (_params?: any, _opts?: any) =>
  useQuery({ queryKey: getListDemandsQueryKey(_params), queryFn: async () => mockDemands, staleTime: 60000 });

export const useGetDemand = (id: string, _opts?: any) =>
  useQuery({ queryKey: getGetDemandQueryKey(id), queryFn: async () => mockDemands.find(d => d.id === id) ?? mockDemands[0], staleTime: 60000 });

export const useCreateDemand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const newDemand: Demand = {
        id: String(Date.now()),
        title: data?.data?.title ?? 'নতুন ডিমান্ড',
        description: data?.data?.description ?? '',
        budget: data?.data?.budget,
        urgency: data?.data?.urgency ?? 'normal',
        category: data?.data?.categoryId,
        location: data?.data?.location,
        responses: 0,
        createdAt: new Date().toISOString(),
      };
      mockDemands.unshift(newDemand);
      return newDemand;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['demands'] }),
  });
};

export const useListVendors = (_params?: any, _opts?: any) =>
  useQuery({ queryKey: getListVendorsQueryKey(_params), queryFn: async () => mockVendors, staleTime: 60000 });

export const useGetVendor = (id: string, _opts?: any) =>
  useQuery({ queryKey: getGetVendorQueryKey(id), queryFn: async () => mockVendors.find(v => v.id === id) ?? mockVendors[0], staleTime: 60000 });

export const useGetSuggestedVendors = (_opts?: any) =>
  useQuery({ queryKey: getGetSuggestedVendorsQueryKey(), queryFn: async () => mockVendors.slice(0, 4), staleTime: 60000 });

export const useListPosts = (_params?: any, _opts?: any) =>
  useQuery({ queryKey: getListPostsQueryKey(_params), queryFn: async () => [] as Post[], staleTime: 60000 });

export const useCreatePost = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data: any) => ({ ...data, id: String(Date.now()) } as Post), onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }) });
};

export const useTogglePostLike = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (vars: string | { id?: string }) => ({ id: typeof vars === 'string' ? vars : (vars.id ?? '') }), onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }) });
};

export const useGetMe = (_opts?: any) =>
  useQuery({ queryKey: ['me'], queryFn: async () => ({ id: 'guest', name: 'Guest User', fullName: 'Guest User', handle: 'guest', avatarUrl: undefined as string | undefined, email: undefined as string | undefined, role: 'guest' }), staleTime: 60000 });

export const useGetCart = (_opts?: any) =>
  useQuery({ queryKey: ['cart'], queryFn: async () => ({ items: [] as CartItem[], total: 0, itemCount: 0 }), staleTime: 60000 });

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data: any) => data, onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }) });
};

export const useGetSellerStats = (_opts?: any) =>
  useQuery({ queryKey: getGetSellerStatsQueryKey(), queryFn: async () => ({ revenue: 124500, orders: 342, products: 87, pendingOrders: 12, productsLive: 87 }), staleTime: 60000 });

export const useListNotifications = (_opts?: any) =>
  useQuery({ queryKey: getListNotificationsQueryKey(), queryFn: async () => mockNotifications, staleTime: 60000 });

export const useGetPlatformStats = (_opts?: any) =>
  useQuery({
    queryKey: getGetPlatformStatsQueryKey(),
    queryFn: async () => ({ totalProducts: 12500, totalVendors: 850, totalOrders: 45000, totalUsers: 120000 }),
    staleTime: 60000,
  });

// ─── Post Comments ────────────────────────────────────────
export const useListPostComments = (postId: string, _opts?: any) =>
  useQuery({
    queryKey: getListPostCommentsQueryKey(postId),
    queryFn: async () => [] as { id: string; content: string; createdAt?: string; author?: { name: string; avatar?: string; avatarUrl?: string } }[],
    staleTime: 60000,
  });

export const useCreatePostComment = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data: any) => data, onSuccess: () => qc.invalidateQueries({ queryKey: ['post-comments'] }) });
};

// ─── Additional hooks some pages may use ─────────────────
export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data: any) => data, onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (id: string) => id, onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data: any) => ({ ...data, id: String(Date.now()) }), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
};

export const useUpdateDemand = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data: any) => data, onSuccess: () => qc.invalidateQueries({ queryKey: ['demands'] }) });
};

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (id: string) => id, onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) });
};

export const useUpdateCart = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (data: any) => data, onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }) });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async (id: string) => id, onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }) });
};

export const useClearCart = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: async () => null, onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }) });
};
