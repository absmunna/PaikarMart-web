import { useQuery, useMutation } from '@tanstack/react-query';
import { safeStorage } from "@/modules/app/utils/storage";
import { authService } from '@modules/auth/services/authService';
import { User } from '@modules/auth/types/auth';

// Placeholders for all requested hooks and types
export const useGetMe = (options?: any) => useQuery<User>({ queryKey: ['me'], queryFn: async () => {
    const data = await authService.getMe();
    const user = data.user;
    if (!user) return null as any;
    const fullName = user.fullName || user.name || 'User';
    const avatarUrl = user.avatarUrl || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`;
    return {
      ...user,
      fullName,
      name: fullName,
      avatarUrl,
      avatar: avatarUrl,
      verified: user.isVerified || user.verified || false,
      isVerified: user.isVerified || user.verified || false,
    } as User;
}, ...options });
export const getGetMeQueryKey = () => ['me'];

// Preloaded mock database for Bangladesh Wholesale Commerce
const INITIAL_VENDORS = [
  {
    id: "pk-retail",
    name: "PK Store",
    type: "retail",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    coverUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    verified: true,
    tagline: "Premium Curated Retail Products",
    rating: 4.9,
    followers: 4320,
    location: "Gulshan, Dhaka",
    tradeLicense: "TL-RETAIL-40291"
  },
  {
    id: "pk-wholesale",
    name: "PK Wholesale",
    type: "wholesale",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80",
    coverUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    verified: true,
    tagline: "Direct Manufacturer Sourcing Gateway",
    rating: 4.8,
    followers: 8750,
    location: "Chawkbazar, Dhaka",
    tradeLicense: "TL-WHOLE-19203"
  },
  {
    id: "pk-local",
    name: "PK Local Shop",
    type: "retail",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    coverUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80",
    verified: true,
    tagline: "Your Daily Neighbourhood Superstore",
    rating: 4.7,
    followers: 1250,
    location: "Mirpur-10, Dhaka",
    tradeLicense: "TL-LOCAL-83719"
  },
  {
    id: "pk-services",
    name: "PK Services",
    type: "wholesale",
    avatarUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&q=80",
    coverUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    verified: true,
    tagline: "Expert PWA Digital Agency & Home Repair",
    rating: 4.9,
    followers: 3400,
    location: "Dhanmondi, Dhaka",
    tradeLicense: "TL-SERVE-53810"
  },
  {
    id: "auth-vendor-1",
    name: "Standard Apparels BD",
    type: "wholesale",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
    coverUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    verified: true,
    tagline: "Export Quality Apparel Factory",
    rating: 4.6,
    followers: 1200,
    location: "Ghazipur, Dhaka",
    tradeLicense: "TL-APP-28310"
  },
  {
    id: "vendor-1",
    name: "Verified Wholesale Supplier Ltd",
    type: "wholesale",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=vendor-1",
    coverUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    verified: true,
    tagline: "Bulk Sourcing Partner",
    rating: 4.9,
    followers: 2450,
    location: "Savar, Dhaka",
    tradeLicense: "TL-BULK-99210"
  }
];

const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    title: "Premium Men's Export Casual Shirt",
    name: "Premium Men's Export Casual Shirt",
    price: 380,
    originalPrice: 550,
    compareAtPrice: 550,
    category: "Garments",
    categoryId: "1",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?fit=crop&w=400&h=400&q=80"],
    description: "Export quality casual check shirts for men. High durability custom 100% cotton fabric.",
    sellerId: "auth-vendor-1",
    vendorName: "Standard Apparels BD",
    rating: 4.5,
    reviews: 12
  },
  {
    id: "prod-2",
    title: "Rajshahi Premium Amrapali Mango (Maund)",
    name: "Rajshahi Premium Amrapali Mango (Maund)",
    price: 3200,
    category: "Food",
    categoryId: "2",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1553279768-865429fa0078?fit=crop&w=400&h=400&q=80"],
    description: "Premium fully ripe organic Amrapali mangoes directly sourced from Rajshahi orchards.",
    sellerId: "auth-vendor-2",
    vendorName: "Rajshahi Agro Mart",
    rating: 4.7,
    reviews: 28
  },
  {
    id: "prod-3",
    title: "TWS Earbuds AirPro v3 (Wholesale Carton)",
    name: "TWS Earbuds AirPro v3 (Wholesale Carton)",
    price: 450,
    originalPrice: 650,
    compareAtPrice: 650,
    category: "Electronics",
    categoryId: "3",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?fit=crop&w=400&h=400&q=80"],
    description: "High quality Bluetooth earbud headphones with touch controls and noise isolation.",
    sellerId: "auth-vendor-3",
    vendorName: "Chawk Gadget Zone",
    rating: 4.4,
    reviews: 94
  },
  // Category 1: Garments (categoryId: "1")
  {
    id: "pk-polo",
    title: "PK Classic Polo",
    name: "PK Classic Polo",
    price: 260,
    originalPrice: 380,
    compareAtPrice: 380,
    category: "Garments",
    categoryId: "1",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?fit=crop&w=400&h=400&q=80"],
    description: "100% Cotton, comfortable polo shirt with custom branding details. Perfect for B2B export testing.",
    sellerId: "pk-wholesale",
    vendorName: "PK Wholesale",
    rating: 4.8,
    reviews: 120,
    isWholesale: true
  },
  {
    id: "pk-denim",
    title: "PK Denim Jeans",
    name: "PK Denim Jeans",
    price: 480,
    originalPrice: 690,
    compareAtPrice: 690,
    category: "Garments",
    categoryId: "1",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?fit=crop&w=400&h=400&q=80"],
    description: "Perfect fit stretchable export-grade denim trousers. Durable stitching with premium dye.",
    sellerId: "pk-wholesale",
    vendorName: "PK Wholesale",
    rating: 4.7,
    reviews: 88,
    isWholesale: true
  },
  {
    id: "pk-panjabi",
    title: "PK Cotton Panjabi",
    name: "PK Cotton Panjabi",
    price: 1350,
    originalPrice: 1950,
    compareAtPrice: 1950,
    category: "Garments",
    categoryId: "1",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?fit=crop&w=400&h=400&q=80"],
    description: "Premium cotton traditional wear Panjabi for men. Highly breathable, soft fabric.",
    sellerId: "pk-retail",
    vendorName: "PK Store",
    rating: 4.9,
    reviews: 212,
    isWholesale: false
  },
  {
    id: "pk-tshirt",
    title: "PK Premium T-Shirt",
    name: "PK Premium T-Shirt",
    price: 160,
    originalPrice: 240,
    compareAtPrice: 240,
    category: "Garments",
    categoryId: "1",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?fit=crop&w=400&h=400&q=80"],
    description: "Premium export quality combed cotton T-shirt, solid color custom fit, ideal for retail and custom printing.",
    sellerId: "pk-wholesale",
    vendorName: "PK Wholesale",
    rating: 4.8,
    reviews: 432,
    isWholesale: true
  },
  {
    id: "pk-sharee",
    title: "PK Handloom Sharee",
    name: "PK Handloom Sharee",
    price: 1850,
    originalPrice: 2800,
    compareAtPrice: 2800,
    category: "Garments",
    categoryId: "1",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?fit=crop&w=400&h=400&q=80"],
    description: "Pure cotton Tangail handloom jamdani motifs saree. Soft texture with beautiful hand-crafted design.",
    sellerId: "pk-retail",
    vendorName: "PK Store",
    rating: 4.9,
    reviews: 75,
    isWholesale: false
  },

  // Category 2: Food & Agri (categoryId: "2")
  {
    id: "pk-oil",
    title: "PK Pure Mustard Oil",
    name: "PK Pure Mustard Oil",
    price: 280,
    originalPrice: 350,
    compareAtPrice: 350,
    category: "Food",
    categoryId: "2",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?fit=crop&w=400&h=400&q=80"],
    description: "100% authentic wood pressed pure mustard oil (Sorishar Tel). Unfiltered fresh scent.",
    sellerId: "pk-local",
    vendorName: "PK Local Shop",
    rating: 4.9,
    reviews: 310,
    isWholesale: false
  },
  {
    id: "pk-ghee",
    title: "PK Shahi Ghee",
    name: "PK Shahi Ghee",
    price: 750,
    originalPrice: 950,
    compareAtPrice: 950,
    category: "Food",
    categoryId: "2",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?fit=crop&w=400&h=400&q=80"],
    description: "Premium rich milk clarified butter. Fragrant and delicious, sourced from organic countryside cows.",
    sellerId: "pk-retail",
    vendorName: "PK Store",
    rating: 4.8,
    reviews: 195,
    isWholesale: false
  },
  {
    id: "pk-honey",
    title: "PK Sundarban Honey",
    name: "PK Sundarban Honey",
    price: 490,
    originalPrice: 650,
    compareAtPrice: 650,
    category: "Food",
    categoryId: "2",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?fit=crop&w=400&h=400&q=80"],
    description: "Raw wild beehive honey directly sourced from the Sundarbans forest. 100% natural and unpasteurized.",
    sellerId: "pk-local",
    vendorName: "PK Local Shop",
    rating: 4.9,
    reviews: 145,
    isWholesale: false
  },
  {
    id: "pk-rice",
    title: "PK Premium Rice Bag",
    name: "PK Premium Rice Bag",
    price: 1850,
    originalPrice: 2200,
    compareAtPrice: 2200,
    category: "Food",
    categoryId: "2",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?fit=crop&w=400&h=400&q=80"],
    description: "25kg Premium double polished Minikit variety direct from automated rice mill. Staple high-grade wholesale bulk.",
    sellerId: "pk-wholesale",
    vendorName: "PK Wholesale",
    rating: 4.6,
    reviews: 50,
    isWholesale: true
  },
  {
    id: "pk-tea",
    title: "PK Premium Leaf Tea",
    name: "PK Premium Leaf Tea",
    price: 130,
    originalPrice: 175,
    compareAtPrice: 175,
    category: "Food",
    categoryId: "2",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?fit=crop&w=400&h=400&q=80"],
    description: "Premium Sylhet flowery orange pekoe black tea. Classic bold aroma in 200g eco bags.",
    sellerId: "pk-local",
    vendorName: "PK Local Shop",
    rating: 4.8,
    reviews: 80,
    isWholesale: false
  },

  // Category 3: Electronics (categoryId: "3")
  {
    id: "pk-charger",
    title: "PK 20W PD Charger",
    name: "PK 20W PD Charger",
    price: 350,
    originalPrice: 550,
    compareAtPrice: 550,
    category: "Electronics",
    categoryId: "3",
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1622445262465-2481c4574875?fit=crop&w=400&h=400&q=80"],
    description: "Compact 20W Power Delivery wall charger. Universal compatibility, shock-resistant safety circuitry.",
    sellerId: "pk-wholesale",
    vendorName: "PK Wholesale",
    rating: 4.7,
    reviews: 130,
    isWholesale: true
  },
  {
    id: "pk-powerbank",
    title: "PK Slim Powerbank",
    name: "PK Slim Powerbank",
    price: 990,
    originalPrice: 1450,
    compareAtPrice: 1450,
    category: "Electronics",
    categoryId: "3",
    image: "https://images.unsplash.com/photo-1625805545899-7da9f77b72ff?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1625805545899-7da9f77b72ff?fit=crop&w=400&h=400&q=80"],
    description: "Ultra-compact 10000mAh durable external battery, smart security chips, dual high current power output ports.",
    sellerId: "pk-retail",
    vendorName: "PK Store",
    rating: 4.8,
    reviews: 160,
    isWholesale: false
  },
  {
    id: "pk-watch",
    title: "PK Active Smartwatch",
    name: "PK Active Smartwatch",
    price: 1850,
    originalPrice: 2800,
    compareAtPrice: 2800,
    category: "Electronics",
    categoryId: "3",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?fit=crop&w=400&h=400&q=80"],
    description: "High resolution AMOLED smart sports bracelet watch tracking step counts, heart speed, multi exercise routines, splashproof.",
    sellerId: "pk-retail",
    vendorName: "PK Store",
    rating: 4.9,
    reviews: 304,
    isWholesale: false
  },
  {
    id: "pk-speaker",
    title: "PK Bass Speaker",
    name: "PK Bass Speaker",
    price: 1100,
    originalPrice: 1690,
    compareAtPrice: 1690,
    category: "Electronics",
    categoryId: "3",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?fit=crop&w=400&h=400&q=80"],
    description: "Portable waterproof mini speaker with booming dynamic bass radiator. Up to 12 hours playtime range.",
    sellerId: "pk-local",
    vendorName: "PK Local Shop",
    rating: 4.8,
    reviews: 90,
    isWholesale: false
  },
  {
    id: "pk-cable",
    title: "PK Braided USB-C",
    name: "PK Braided USB-C",
    price: 120,
    originalPrice: 220,
    compareAtPrice: 220,
    category: "Electronics",
    categoryId: "3",
    image: "https://images.unsplash.com/photo-1541660721243-111fec6cda10?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1541660721243-111fec6cda10?fit=crop&w=400&h=400&q=80"],
    description: "Ultra durable braided ballistic nylon protective USB-C charging cable wire. Quick charge and high speed database sync.",
    sellerId: "pk-wholesale",
    vendorName: "PK Wholesale",
    rating: 4.9,
    reviews: 560,
    isWholesale: true
  },

  // Category 4: Home & Living (categoryId: "4")
  {
    id: "pk-bedsheet",
    title: "PK Floral Bedsheet",
    name: "PK Floral Bedsheet",
    price: 890,
    originalPrice: 1300,
    compareAtPrice: 1300,
    category: "Home",
    categoryId: "4",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?fit=crop&w=400&h=400&q=80"],
    description: "Premium pure soft cotton king double bed sheet package containing matched pillow covers.",
    sellerId: "pk-retail",
    vendorName: "PK Store",
    rating: 4.8,
    reviews: 62,
    isWholesale: false
  },
  {
    id: "pk-pan",
    title: "PK Ceramic Fry Pan",
    name: "PK Ceramic Fry Pan",
    price: 1250,
    originalPrice: 1800,
    compareAtPrice: 1800,
    category: "Home",
    categoryId: "4",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?fit=crop&w=400&h=400&q=80"],
    description: "Eco-friendly natural non-toxic ceramic non-stick cooking frying pan. High temperature uniform induction heat base.",
    sellerId: "pk-local",
    vendorName: "PK Local Shop",
    rating: 4.7,
    reviews: 44,
    isWholesale: false
  },
  {
    id: "pk-bulb",
    title: "PK 12W LED Bulb",
    name: "PK 12W LED Bulb",
    price: 150,
    originalPrice: 220,
    compareAtPrice: 220,
    category: "Home",
    categoryId: "4",
    image: "https://images.unsplash.com/photo-1550534791-2677533605ab?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1550534791-2677533605ab?fit=crop&w=400&h=400&q=80"],
    description: "Excellent performance solid energy reduction 12W smart white display lighting bulbs.",
    sellerId: "pk-wholesale",
    vendorName: "PK Wholesale",
    rating: 4.9,
    reviews: 110,
    isWholesale: true
  },
  {
    id: "pk-flask",
    title: "PK Vacuum Bottle",
    name: "PK Vacuum Bottle",
    price: 650,
    originalPrice: 890,
    compareAtPrice: 890,
    category: "Home",
    categoryId: "4",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?fit=crop&w=400&h=400&q=80"],
    description: "Strong stainless material premium thermal flask bottle keeping cold and warm drinks standard up to 18 hours.",
    sellerId: "pk-retail",
    vendorName: "PK Store",
    rating: 4.8,
    reviews: 135,
    isWholesale: false
  },

  // Category 5: Services (categoryId: "5")
  {
    id: "pk-ac-service",
    title: "PK AC Deep Service",
    name: "PK AC Deep Service",
    price: 999,
    originalPrice: 1500,
    compareAtPrice: 1500,
    category: "Services",
    categoryId: "5",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?fit=crop&w=400&h=400&q=80"],
    description: "Absolute split air conditioning diagnostic checking, filter washing, gas pressure measurements by verified local engineers.",
    sellerId: "pk-services",
    vendorName: "PK Services",
    rating: 4.9,
    reviews: 95,
    isWholesale: false
  },
  {
    id: "pk-cleaning-service",
    title: "PK Home Cleaning",
    name: "PK Home Cleaning",
    price: 1999,
    originalPrice: 3000,
    compareAtPrice: 3000,
    category: "Services",
    categoryId: "5",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?fit=crop&w=400&h=400&q=80"],
    description: "Complete apartment sanitization. Kitchen, bathroom, deep dust and oil removal services.",
    sellerId: "pk-services",
    vendorName: "PK Services",
    rating: 5.0,
    reviews: 18,
    isWholesale: false
  },
  {
    id: "pk-pc-service",
    title: "PK Computer Repair",
    name: "PK Computer Repair",
    price: 499,
    originalPrice: 800,
    compareAtPrice: 800,
    category: "Services",
    categoryId: "5",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?fit=crop&w=400&h=400&q=80",
    images: ["https://images.unsplash.com/photo-1531297484001-80022131f5a1?fit=crop&w=400&h=400&q=80"],
    description: "Slow computer debugging, operating system setup, RAM cleaning and motherboard diagnosis at affordable prices.",
    sellerId: "pk-services",
    vendorName: "PK Services",
    rating: 4.7,
    reviews: 32,
    isWholesale: false
  }
];

const INITIAL_DEMANDS = [
  {
    id: "dem-1",
    title: "৫০ পিস প্রিমিয়াম সুতি শাড়ি প্রয়োজন (ঈদ কালেকশন)",
    description: "আমাদের ঢাকা উত্তরের শোরুমের জন্য পাইকারিতে ভালো মানের সুতি প্রিন্ট এবং সিল্ক শাড়ি খুঁজছি। অনুগ্রহ করে ছবির সাথে দাম এবং সর্বনিম্ন ক্রয়ের সংখ্যা ইনবক্স করুন।",
    budget: 65000,
    status: "open",
    matchCount: 14,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    author: {
      id: "custom-buyer-1",
      name: "Tanzila Fashion Boutique",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80"
    }
  },
  {
    id: "dem-2",
    title: "৫০০০ পিস কাস্টম প্রিন্টেড টি-শার্ট অর্ডার করবো",
    description: "একটি চ্যারিটি ইভেন্টের জন্য কাস্টম স্ক্রিন প্রিন্টেড সাদা কটন টি-শার্ট লাগবে। সাইজ মিক্স হতে হবে। কারখানামালিকরা সরাসরি যোগাযোগ করতে পারেন পানির দামে দেওয়ার অফার সহ!",
    budget: 450000,
    status: "open",
    matchCount: 8,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    author: {
      id: "custom-buyer-2",
      name: "Youth Club Foundation",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80"
    }
  }
];

const INITIAL_POSTS = [
  {
    id: "post-1",
    content: "আমরা সরাসরি PK Wholesale ঢাকা চকবাজার হাব থেকে প্রিমিয়াম এক্সপোর্ট ওভেন শার্ট উৎপাদন ও পাইকারি সরবরাহ করছি। নূন্যতম অর্ডার ৫০ পিস।",
    type: "product",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    liked: false,
    likeCount: 142,
    commentCount: 28,
    shareCount: 12,
    author: {
      id: "pk-wholesale",
      name: "PK Wholesale",
      avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80",
      verified: true,
      type: "wholesale"
    },
    product: INITIAL_PRODUCTS[3] // PK Classic Polo
  },
  {
    id: "post-2",
    content: "সরাসরি রাজশাহী থেকে প্রিমিয়াম কোয়ালিটির আসল আম রুপালী সরাসরি বাগান থেকে ডেলিভারি দিচ্ছি। রিটেইলার এবং খুচরা বিক্রেতা ভাইদের জন্য আকর্ষণীয় পাইকারি রেট থাকবে।",
    type: "product",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    liked: true,
    likeCount: 53,
    commentCount: 12,
    shareCount: 7,
    author: {
      id: "auth-vendor-2",
      name: "Rajshahi Agro Mart",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      verified: true,
      type: "wholesale"
    },
    product: INITIAL_PRODUCTS[1]
  },
  {
    id: "post-video-1",
    content: "PK Wholesale সবচেয়ে বড় মোবাইল এক্সেসরিজ পাইকারি শোরুম ঘুরুন আমাদের সাথে! সরাসরি চায়না থেকে আমদানিকৃত গ্যাজেট পাচ্ছেন সবচেয়ে সাশ্রয়ী দামে।",
    type: "video",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-with-a-green-screen-34204-large.mp4",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    liked: false,
    likeCount: 325,
    commentCount: 84,
    shareCount: 55,
    author: {
      id: "pk-wholesale",
      name: "PK Wholesale",
      avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80",
      verified: true,
      type: "wholesale"
    }
  }
];

// LocalStorage helpers to load & merge custom user contributions
const getStoredPosts = () => {
  try {
    const custom = safeStorage.getItem("pm.custom_posts");
    let list = [];
    if (custom) {
      try { list = JSON.parse(custom); } catch { list = []; }
    }
    const all = [...list, ...INITIAL_POSTS];
    const seen = new Set();
    return all.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  } catch {
    return INITIAL_POSTS;
  }
};

const getStoredProducts = () => {
  try {
    const custom = safeStorage.getItem("pm.custom_products");
    let list = [];
    if (custom) {
      try { list = JSON.parse(custom); } catch { list = []; }
    }
    const all = [...list, ...INITIAL_PRODUCTS];
    const seen = new Set();
    const filtered = all.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    return filtered.map((p: any) => ({
      ...p,
      vendor: p.vendor || {
        id: p.sellerId || "pk-wholesale",
        name: p.vendorName || "Paikar Store",
        avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80"
      }
    }));
  } catch {
    return INITIAL_PRODUCTS.map((p: any) => ({
      ...p,
      vendor: p.vendor || {
        id: p.sellerId || "pk-wholesale",
        name: p.vendorName || "Paikar Store",
        avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80"
      }
    }));
  }
};

const getStoredDemands = () => {
  try {
    const custom = safeStorage.getItem("pm.custom_demands");
    let list = [];
    if (custom) {
      try { list = JSON.parse(custom); } catch { list = []; }
    }
    const all = [...list, ...INITIAL_DEMANDS];
    const seen = new Set();
    return all.filter(item => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  } catch {
    return INITIAL_DEMANDS;
  }
};

export const useGetCart = (options?: any) => useQuery<any>({ queryKey: ['cart'], queryFn: () => [] as any[], ...options });

export const useListProducts = (params?: any, options?: any) => useQuery<any>({
  queryKey: ['products', params],
  queryFn: () => {
    let prods = getStoredProducts();
    const categoryFilter = params?.category || params?.categoryId;
    if (categoryFilter && categoryFilter !== "all" && categoryFilter !== "সব") {
      const match = String(categoryFilter).toLowerCase().trim();
      prods = prods.filter(p => {
        const catName = p.category ? String(p.category).toLowerCase() : "";
        const catId = p.categoryId ? String(p.categoryId).toLowerCase() : "";
        return (
          catName === match ||
          catName.includes(match) ||
          catId === match ||
          (match === "1" && catName === "garments") ||
          (match === "2" && (catName === "food" || catName === "food & agri" || catName === "grocery")) ||
          (match === "3" && catName === "electronics") ||
          (match === "4" && (catName === "home" || catName === "home & living" || catName === "home")) ||
          (match === "5" && (catName === "services" || catName.includes("service"))) ||
          (match === "garments" && catName === "garments") ||
          (match === "clothing" && catName === "garments") ||
          (match === "পোশাক" && catName === "garments") ||
          (match === "food" && catName === "food") ||
          (match === "খাদ্য ও কৃষি" && catName === "food") ||
          (match === "ইলেকট্রনিক্স" && catName === "electronics") ||
          (match === "home" && catName === "home") ||
          (match === "গৃহস্থালি" && catName === "home") ||
          (match === "services" && catName === "services") ||
          (match === "সেবা সমূহ" && catName === "services")
        );
      });
    }

    if (params?.q) {
      const query = params.q.toLowerCase().trim();
      prods = prods.filter(p => 
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query))
      );
    }

    if (params?.type && params.type !== "all") {
      const t = params.type.toLowerCase();
      prods = prods.filter(p => {
        if (t === "wholesale") return p.isWholesale === true || p.type === "wholesale";
        if (t === "retail") return p.isWholesale !== true && p.type !== "service" && p.type !== "wholesale";
        if (t === "grocery") return p.category?.toLowerCase() === "food" || p.category?.toLowerCase() === "grocery";
        if (t === "service") return p.category?.toLowerCase() === "services" || p.type === "service";
        return true;
      });
    }

    if (params?.sort) {
      const s = params.sort;
      if (s === "price_asc") {
        prods = [...prods].sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (s === "price_desc") {
        prods = [...prods].sort((a, b) => (b.price || 0) - (a.price || 0));
      } else if (s === "rating") {
        prods = [...prods].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (s === "trending") {
        prods = [...prods].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      }
    }

    return prods;
  },
  ...options
});

export const getListProductsQueryKey = (params?: any) => ['products', params];

export const useGetProduct = (id: any, options?: any) => useQuery<any>({
  queryKey: ['product', id],
  queryFn: () => {
    const prods = getStoredProducts();
    return prods.find(p => p.id === id) || prods[0];
  },
  ...options
});

export const getGetProductQueryKey = (id: any) => ['product', id];

export const useAddToCart = () => useMutation({ mutationFn: (data: any) => Promise.resolve({}) });

export const useListCategories = (params?: any, options?: any) => useQuery<any>({
  queryKey: ['categories', params],
  queryFn: () => [
    { id: "1", name: "Garments", bangla: "পোশাক", icon: "Shirt", productCount: 45 },
    { id: "2", name: "Food & Agri", bangla: "খাদ্য ও কৃষি", icon: "Grape", productCount: 38 },
    { id: "3", name: "Electronics", bangla: "ইলেকট্রনিক্স", icon: "Smartphone", productCount: 52 },
    { id: "4", name: "Home & Living", bangla: "গৃহস্থালি", icon: "Home", productCount: 29 },
    { id: "5", name: "Services", bangla: "সেবা সমূহ", icon: "Wrench", productCount: 18 }
  ],
  ...options
});

export const getListCategoriesQueryKey = (params?: any) => ['categories', params];

export const useListDemands = (params?: any, options?: any) => useQuery<any>({
  queryKey: ['demands', params],
  queryFn: () => {
    const list = getStoredDemands();
    // In preview mode we return all as mine for convenience
    return list;
  },
  ...options
});

export const getListDemandsQueryKey = (params?: any) => ['demands', params];

export const useCreateDemand = () => useMutation({
  mutationFn: async (payload: { data: any }) => {
    const data = payload.data;
    const authorResponse = await authService.getMe();
    const currentUser = authorResponse?.user || { fullName: "User" };

    const newDemand = {
      id: "dem-" + Date.now(),
      title: data.title || "New Demand Request",
      description: data.description || "",
      budget: Number(data.budget) || 1000,
      status: "open",
      matchCount: 0,
      createdAt: new Date().toISOString(),
      author: {
        id: currentUser.id || "current-user",
        name: currentUser.fullName || "My Verified Store",
        avatarUrl: currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.fullName}`,
      }
    };

    const existStr = safeStorage.getItem("pm.custom_demands");
    let exist = [];
    try { exist = existStr ? JSON.parse(existStr) : []; } catch { exist = []; }
    safeStorage.setItem("pm.custom_demands", JSON.stringify([newDemand, ...exist]));

    // Also auto create a community post B2B companion
    const companionPost = {
      id: "post-dem-" + Date.now(),
      content: `📦 [B2B DEMAND POST]\nআইটেম: ${newDemand.title}\nবাজেট: ৳${newDemand.budget.toLocaleString()}\n\nবিবরণ: ${newDemand.description}`,
      type: "deal",
      createdAt: new Date().toISOString(),
      liked: false,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      author: {
        id: currentUser.id || "current-user",
        name: currentUser.fullName || "Buyer Partner",
        avatarUrl: currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.fullName}`,
        verified: false,
        type: "retail"
      }
    };
    const existPostsStr = safeStorage.getItem("pm.custom_posts");
    let existPosts = [];
    try { existPosts = existPostsStr ? JSON.parse(existPostsStr) : []; } catch { existPosts = []; }
    safeStorage.setItem("pm.custom_posts", JSON.stringify([companionPost, ...existPosts]));

    return newDemand;
  }
});

export const useGetDemand = (id: any, options?: any) => useQuery<any>({
  queryKey: ['demand', id],
  queryFn: () => {
    const list = getStoredDemands();
    return list.find(d => d.id === id) || list[0];
  },
  ...options
});

export const getGetDemandQueryKey = (id: any) => ['demand', id];

export const useGetSellerStats = (options?: any) => useQuery<any>({ queryKey: ['sellerStats'], queryFn: () => ({ totalSales: 45000, activeListings: 8, rating: 4.9 }) as any, ...options });

export const getGetSellerStatsQueryKey = () => ['sellerStats'];

export const useGetPlatformStats = (options?: any) => useQuery<any>({ queryKey: ['platformStats'], queryFn: () => ({ totalProducts: 1250, totalVendors: 420, totalUsers: 8430, dailyGmv: 425000 }) as any, ...options });

export const getGetPlatformStatsQueryKey = () => ['platformStats'];

export const useTogglePostLike = () => useMutation({
  mutationFn: async (variables: { id: string }) => {
    try {
      const posts = getStoredPosts();
      const match = posts.find(p => p.id === variables.id);
      if (match) {
        match.liked = !match.liked;
        match.likeCount = match.liked ? match.likeCount + 1 : Math.max(0, match.likeCount - 1);
        const customOnly = posts.filter(p => p.id.startsWith("post-"));
        safeStorage.setItem("pm.custom_posts", JSON.stringify(customOnly));
      }
    } catch { /* noop */ }
    return Promise.resolve({});
  }
});

export const getListPostsQueryKey = (params?: any) => ['posts', params];

export const useGetTrendingProducts = (params?: any, options?: any) => useQuery<any>({ queryKey: ['trendingProducts', params], queryFn: () => getStoredProducts().slice(0, 4), ...options });

export const getGetTrendingProductsQueryKey = (params?: any) => ['trendingProducts', params];

export const useListPosts = (params?: any, options?: any) => useQuery<any>({
  queryKey: ['posts', params],
  queryFn: () => {
    let list = getStoredPosts();
    if (params?.type && params.type !== "all") {
      list = list.filter(p => p.type === params.type);
    }
    return list;
  },
  ...options
});

export const useListNotifications = (params?: any, options?: any) => useQuery<any>({ queryKey: ['notifications', params], queryFn: () => [] as any[], ...options });

export const getListNotificationsQueryKey = (params?: any) => ['notifications', params];

export const useGetVendor = (id: any, options?: any) => useQuery<any>({
  queryKey: ['vendor', id],
  queryFn: () => {
    const list = INITIAL_VENDORS;
    const found = list.find(v => v.id === id);
    if (found) return found;
    return {
      id: id || "vendor-1",
      name: "Verified Wholesale Supplier Ltd",
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      coverUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
      verified: true,
      tagline: "Bulk Sourcing Partner",
      rating: 4.9,
      followers: 2450,
      location: "Ghazipur, Dhaka",
      type: "wholesale"
    };
  },
  ...options
});

export const getGetVendorQueryKey = (id: any) => ['vendor', id];

export const useListPostComments = (postId: any, options?: any) => useQuery<any>({ queryKey: ['postComments', postId], queryFn: () => [] as any[], ...options });

export const useCreatePostComment = () => useMutation({ mutationFn: (data: any) => Promise.resolve({}) });

export const getListPostCommentsQueryKey = (postId: any) => ['postComments', postId];

export const useCreatePost = () => useMutation({
  mutationFn: async (payload: { data: any }) => {
    const data = payload.data;
    const authorResponse = await authService.getMe();
    const currentUser = authorResponse?.user || { fullName: "User" };

    const newPost = {
      id: "post-" + Date.now(),
      content: data.content,
      type: data.type || "status",
      createdAt: new Date().toISOString(),
      liked: false,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      author: {
        id: currentUser.id || "current-user",
        name: currentUser.fullName || currentUser.name || "My Verified Store",
        avatarUrl: currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.fullName}`,
        verified: true,
        type: currentUser.role === "seller" ? "wholesale" : "retail"
      },
      product: data.product ? {
        id: "prod-" + Date.now(),
        title: data.product.title,
        price: Number(data.product.price) || 0,
        compareAtPrice: data.product.compareAtPrice ? Number(data.product.compareAtPrice) : undefined,
        images: [data.product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=450&q=80"]
      } : undefined,
      videoUrl: data.videoUrl
    };

    const existPostsStr = safeStorage.getItem("pm.custom_posts");
    let existPosts = [];
    try { existPosts = existPostsStr ? JSON.parse(existPostsStr) : []; } catch { existPosts = []; }
    safeStorage.setItem("pm.custom_posts", JSON.stringify([newPost, ...existPosts]));

    if (data.product) {
      const newProd = {
        id: newPost.product?.id,
        title: data.product.title,
        price: Number(data.product.price) || 0,
        compareAtPrice: data.product.compareAtPrice ? Number(data.product.compareAtPrice) : undefined,
        category: data.product.category || "Garments",
        images: [data.product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=450&q=80"],
        description: data.content,
        sellerId: currentUser.id || "current-user"
      };

      const existProdsStr = safeStorage.getItem("pm.custom_products");
      let existProds = [];
      try { existProds = existProdsStr ? JSON.parse(existProdsStr) : []; } catch { existProds = []; }
      safeStorage.setItem("pm.custom_products", JSON.stringify([newProd, ...existProds]));
    }

    return newPost;
  }
});
export const useGetSuggestedVendors = (params?: any, options?: any) => useQuery<any>({ queryKey: ['suggestedVendors', params], queryFn: () => INITIAL_VENDORS.slice(0, 3), ...options });
export const getGetSuggestedVendorsQueryKey = (params?: any) => ['suggestedVendors', params];
export const useListVendors = (params?: any, options?: any) => useQuery<any>({ queryKey: ['vendors', params], queryFn: () => INITIAL_VENDORS, ...options });
export const getListVendorsQueryKey = (params?: any) => ['vendors', params];
export const useListOrders = (params?: any, options?: any) => useQuery<any>({ queryKey: ['orders', params], queryFn: () => [] as any[], ...options });
export const getListOrdersQueryKey = (params?: any) => ['orders', params];

// Types
export type Product = any;
export type Post = any;
export type Vendor = any;
export type ListProductsType = any;
export type ListProductsSort = any;
export type DemandUrgency = 'low' | 'medium' | 'high' | 'normal' | 'urgent' | 'critical';
export type CreateDemandBodyUrgency = DemandUrgency;
export enum VendorType { RETAIL = 'retail', WHOLESALE = 'wholesale' }
