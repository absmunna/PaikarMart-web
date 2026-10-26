import { randomUUID } from "node:crypto";

type Vendor = {
  id: string;
  name: string;
  slug: string;
  type: string;
  tagline?: string;
  avatarUrl: string;
  coverUrl: string;
  location: string;
  rating: number;
  productCount: number;
  followers: number;
  verified: boolean;
  description?: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  videoUrl?: string;
  stock: number;
  vendorId: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  type: string;
  location: string;
  distanceKm?: number;
  tags?: string[];
  createdAt: string;
};

type Post = {
  id: string;
  authorId: string;
  type: string;
  content: string;
  images: string[];
  videoUrl?: string;
  productId?: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  liked: boolean;
  createdAt: string;
};

type Comment = {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
};

type Story = {
  id: string;
  authorId: string;
  imageUrl: string;
  caption?: string;
  createdAt: string;
};

type CartItem = { id: string; productId: string; quantity: number };

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  vendorId: string;
  vendorName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type PriceBreakdown = {
  subtotal: number;
  vatRate: string;         // e.g. "5%"
  vatAmount: number;
  shippingFee: number;
  shippingLabel: string;   // human-readable
  discountAmount: number;
  total: number;
};

export type StatusHistoryEntry = {
  status: OrderStatus;
  at: string;
  note?: string;
};

export type Order = {
  id: string;
  orderNo: string;
  buyerId: string;
  buyerName: string;
  items: OrderItem[];
  // BD compliance price breakdown
  breakdown: PriceBreakdown;
  // legacy flat fields (kept for backwards compat)
  subtotal: number;
  vatAmount: number;
  shippingFee: number;
  total: number;
  currency: "BDT";
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  // delivery
  deliveryAddress: string;
  deliveryDistrict: string;
  isInsideDhaka: boolean;
  maxDeliveryDays: number;
  expectedDelivery: string;
  deliveryPolicy: string;
  // payment
  paymentMethod: string;
  notes: string;
  termsAcceptedAt: string;
  createdAt: string;
  updatedAt: string;
};

type Demand = {
  id: string;
  title: string;
  description: string;
  budget: number;
  currency: string;
  categoryId: string;
  location: string;
  urgency: string;
  status: string;
  matchCount: number;
  createdAt: string;
  authorId: string;
};

type User = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bio?: string;
  isSeller: boolean;
  verified: boolean;
  location: string;
  trustScore?: number;
};

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  actorAvatarUrl?: string;
  read: boolean;
  createdAt: string;
};

const now = () => new Date().toISOString();
const ago = (mins: number) =>
  new Date(Date.now() - mins * 60_000).toISOString();

const img = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;
const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}`;

export const db = {
  currentUser: {
    id: "u-me",
    name: "Demo Buyer",
    handle: "demo",
    avatarUrl: avatar("me"),
    bio: "Welcome to PaikarMart",
    isSeller: false,
    verified: false,
    location: "Dhaka, BD",
    trustScore: 80,
  } as User,
  users: [] as User[],
  vendors: [] as Vendor[],
  categories: [] as Category[],
  products: [] as Product[],
  posts: [] as Post[],
  comments: [] as Comment[],
  stories: [] as Story[],
  cart: [] as CartItem[],
  orders: [] as Order[],
  demands: [] as Demand[],
  notifications: [] as Notification[],
};

function seed() {
  const cats: Category[] = [
    { id: "c1", name: "Electronics", slug: "electronics", icon: "smartphone", productCount: 0 },
    { id: "c2", name: "Fashion", slug: "fashion", icon: "shirt", productCount: 0 },
    { id: "c3", name: "Grocery", slug: "grocery", icon: "shopping-basket", productCount: 0 },
    { id: "c4", name: "Home", slug: "home", icon: "home", productCount: 0 },
    { id: "c5", name: "Services", slug: "services", icon: "briefcase", productCount: 0 },
    { id: "c6", name: "Real Estate", slug: "real-estate", icon: "building", productCount: 0 },
  ];
  db.categories = cats;

  const vendors: Vendor[] = [
    { id: "v1", name: "Dhaka Electronics", slug: "dhaka-electronics", type: "retail", tagline: "Latest gadgets", avatarUrl: avatar("v1"), coverUrl: img("v1cover"), location: "Dhaka", rating: 4.6, productCount: 0, followers: 2310, verified: true, description: "Top retailer of electronics in Dhaka." },
    { id: "v2", name: "Chittagong Wholesale", slug: "ctg-wholesale", type: "wholesale", tagline: "Bulk deals", avatarUrl: avatar("v2"), coverUrl: img("v2cover"), location: "Chittagong", rating: 4.4, productCount: 0, followers: 1180, verified: true, description: "Wholesale supplier of fashion items." },
    { id: "v3", name: "Sylhet Fresh Mart", slug: "sylhet-fresh", type: "grocery", tagline: "Fresh daily", avatarUrl: avatar("v3"), coverUrl: img("v3cover"), location: "Sylhet", rating: 4.8, productCount: 0, followers: 870, verified: false, description: "Fresh vegetables and grocery." },
    { id: "v4", name: "Khulna Drop Co", slug: "khulna-drop", type: "dropship", tagline: "Ships nationwide", avatarUrl: avatar("v4"), coverUrl: img("v4cover"), location: "Khulna", rating: 4.2, productCount: 0, followers: 540, verified: false },
    { id: "v5", name: "Cox Beach Resort", slug: "cox-resort", type: "hotel", tagline: "Sea-view rooms", avatarUrl: avatar("v5"), coverUrl: img("v5cover"), location: "Cox's Bazar", rating: 4.7, productCount: 0, followers: 1500, verified: true },
    { id: "v6", name: "Pro Plumbers BD", slug: "pro-plumbers", type: "service", tagline: "On-demand plumbing", avatarUrl: avatar("v6"), coverUrl: img("v6cover"), location: "Dhaka", rating: 4.5, productCount: 0, followers: 320, verified: false },
  ];
  db.vendors = vendors;

  const products: Product[] = [
    { id: "p1", title: "Wireless Earbuds Pro", description: "ANC, 30hr battery, BT 5.3", price: 2499, compareAtPrice: 3200, currency: "BDT", images: [img("p1"), img("p1b")], stock: 25, vendorId: "v1", categoryId: "c1", rating: 4.5, reviewCount: 128, type: "retail", location: "Dhaka", distanceKm: 2.1, tags: ["audio","bluetooth"], createdAt: ago(60) },
    { id: "p2", title: "Cotton Panjabi (Bulk x10)", description: "Premium cotton, mixed sizes", price: 8500, currency: "BDT", images: [img("p2")], stock: 50, vendorId: "v2", categoryId: "c2", rating: 4.3, reviewCount: 42, type: "wholesale", location: "Chittagong", distanceKm: 240, tags: ["panjabi","bulk"], createdAt: ago(120) },
    { id: "p3", title: "Fresh Hilsa Fish 1kg", description: "Padma river hilsa", price: 1450, currency: "BDT", images: [img("p3")], stock: 12, vendorId: "v3", categoryId: "c3", rating: 4.9, reviewCount: 67, type: "grocery", location: "Sylhet", distanceKm: 190, tags: ["fish","fresh"], createdAt: ago(20) },
    { id: "p4", title: "LED Smart Bulb 9W", description: "WiFi controlled, 16M colors", price: 690, currency: "BDT", images: [img("p4")], stock: 200, vendorId: "v4", categoryId: "c4", rating: 4.1, reviewCount: 18, type: "dropship", location: "Khulna", tags: ["smart-home"], createdAt: ago(180) },
    { id: "p5", title: "Sea-View Deluxe Room (1 night)", description: "Breakfast included", price: 4500, currency: "BDT", images: [img("p5")], stock: 5, vendorId: "v5", categoryId: "c6", rating: 4.8, reviewCount: 96, type: "hotel", location: "Cox's Bazar", tags: ["hotel","beach"], createdAt: ago(300) },
    { id: "p6", title: "Emergency Plumbing Visit", description: "Within 2 hours, Dhaka city", price: 800, currency: "BDT", images: [img("p6")], stock: 999, vendorId: "v6", categoryId: "c5", rating: 4.6, reviewCount: 31, type: "service", location: "Dhaka", distanceKm: 5, tags: ["plumbing","service"], createdAt: ago(45) },
    { id: "p7", title: "Smartphone Mid-Range X", description: "8GB/128GB, 50MP camera", price: 22999, compareAtPrice: 25000, currency: "BDT", images: [img("p7")], stock: 8, vendorId: "v1", categoryId: "c1", rating: 4.4, reviewCount: 210, type: "retail", location: "Dhaka", distanceKm: 2.1, tags: ["phone"], createdAt: ago(15) },
    { id: "p8", title: "Organic Rice 25kg Sack", description: "Chinigura premium", price: 3200, currency: "BDT", images: [img("p8")], stock: 40, vendorId: "v3", categoryId: "c3", rating: 4.7, reviewCount: 54, type: "grocery", location: "Sylhet", tags: ["rice","organic"], createdAt: ago(240) },
  ];
  db.products = products;
  for (const p of products) {
    const c = db.categories.find((x) => x.id === p.categoryId);
    if (c) c.productCount++;
    const v = db.vendors.find((x) => x.id === p.vendorId);
    if (v) v.productCount++;
  }

  db.posts = [
    { id: "post1", authorId: "v1", type: "product", content: "🔥 New arrival! Wireless Earbuds Pro - 22% off this week.", images: [img("p1")], productId: "p1", likeCount: 142, commentCount: 23, shareCount: 8, liked: false, createdAt: ago(30) },
    { id: "post2", authorId: "v3", type: "deal", content: "Fresh Hilsa from Padma! Order before 6pm for same-day delivery in Sylhet.", images: [img("p3")], productId: "p3", likeCount: 89, commentCount: 12, shareCount: 4, liked: false, createdAt: ago(90) },
    { id: "post3", authorId: "v5", type: "video", content: "Watch our beachfront sunset rooms in Cox's Bazar 🌅", images: [img("p5")], videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", likeCount: 312, commentCount: 41, shareCount: 19, liked: true, createdAt: ago(180) },
    { id: "post4", authorId: "v2", type: "status", content: "Eid bulk discounts live! Wholesale rates for retailers nationwide.", images: [], likeCount: 56, commentCount: 9, shareCount: 3, liked: false, createdAt: ago(240) },
    { id: "post5", authorId: "v6", type: "status", content: "Plumbing emergencies? We respond within 2 hours across Dhaka.", images: [img("p6")], likeCount: 34, commentCount: 5, shareCount: 1, liked: false, createdAt: ago(360) },
  ];

  db.stories = vendors.slice(0, 5).map((v, i) => ({
    id: `story${i}`,
    authorId: v.id,
    imageUrl: img(`story${i}`),
    caption: `${v.name} update`,
    createdAt: ago(60 * (i + 1)),
  }));

  db.demands = [
    { id: "d1", title: "Need 100 winter jackets", description: "Quality winter jackets for retail shop", budget: 60000, currency: "BDT", categoryId: "c2", location: "Dhaka", urgency: "normal", status: "open", matchCount: 3, createdAt: ago(120), authorId: "u-me" },
    { id: "d2", title: "Looking for office cleaning service", description: "Weekly cleaning for 3000 sqft office", budget: 5000, currency: "BDT", categoryId: "c5", location: "Dhaka", urgency: "low", status: "open", matchCount: 1, createdAt: ago(360), authorId: "u-me" },
  ];

  // Seed demo orders so the seller dashboard is not empty
  const mkBreakdown = (sub: number, inside: boolean): PriceBreakdown => {
    const vatAmount = Math.round(sub * 0.05);
    const shippingFee = sub >= 1000 ? 0 : inside ? 60 : 120;
    return {
      subtotal: sub,
      vatRate: "5%",
      vatAmount,
      shippingFee,
      shippingLabel: shippingFee === 0 ? "Free (above ৳1,000)" : `৳${shippingFee} (${inside ? "Dhaka" : "Outside Dhaka"})`,
      discountAmount: 0,
      total: sub + vatAmount + shippingFee,
    };
  };
  const mkHistory = (status: OrderStatus): StatusHistoryEntry[] => {
    const map: StatusHistoryEntry[] = [
      { status: "pending", at: ago(300), note: "Order placed by buyer" },
    ];
    if (["processing","shipped","delivered"].includes(status))
      map.push({ status: "processing", at: ago(200), note: "Seller accepted order" });
    if (["shipped","delivered"].includes(status))
      map.push({ status: "shipped", at: ago(100), note: "Dispatched via Pathao" });
    if (status === "delivered")
      map.push({ status: "delivered", at: ago(20), note: "Delivered successfully" });
    return map;
  };

  db.orders = [
    {
      id: "ord_seed_1",
      orderNo: "PKM-SEED001",
      buyerId: "u-me",
      buyerName: "Nadia Rahman",
      items: [{ id: "oi1", productId: "p1", productTitle: "Wireless Earbuds Pro", productImage: img("p1"), vendorId: "v1", vendorName: "Dhaka Electronics", unitPrice: 2499, quantity: 2, lineTotal: 4998 }],
      breakdown: mkBreakdown(4998, true),
      subtotal: 4998, vatAmount: Math.round(4998*0.05), shippingFee: 0, total: 4998 + Math.round(4998*0.05),
      currency: "BDT",
      status: "shipped",
      statusHistory: mkHistory("shipped"),
      deliveryAddress: "House 5, Road 12, Banani, Dhaka",
      deliveryDistrict: "Dhaka",
      isInsideDhaka: true,
      maxDeliveryDays: 3,
      expectedDelivery: new Date(Date.now() + 2 * 86400000).toISOString(),
      deliveryPolicy: "Delivery within 3 working days inside Dhaka",
      paymentMethod: "bkash",
      notes: "",
      termsAcceptedAt: ago(300),
      createdAt: ago(300),
      updatedAt: ago(100),
    },
    {
      id: "ord_seed_2",
      orderNo: "PKM-SEED002",
      buyerId: "u-buyer2",
      buyerName: "Imran Karim",
      items: [{ id: "oi2", productId: "p7", productTitle: "Smartphone Mid-Range X", productImage: img("p7"), vendorId: "v1", vendorName: "Dhaka Electronics", unitPrice: 22999, quantity: 1, lineTotal: 22999 }],
      breakdown: mkBreakdown(22999, true),
      subtotal: 22999, vatAmount: Math.round(22999*0.05), shippingFee: 0, total: 22999 + Math.round(22999*0.05),
      currency: "BDT",
      status: "processing",
      statusHistory: mkHistory("processing"),
      deliveryAddress: "Flat 3B, Gulshan-2, Dhaka",
      deliveryDistrict: "Dhaka",
      isInsideDhaka: true,
      maxDeliveryDays: 3,
      expectedDelivery: new Date(Date.now() + 3 * 86400000).toISOString(),
      deliveryPolicy: "Delivery within 3 working days inside Dhaka",
      paymentMethod: "cod",
      notes: "Call before delivery",
      termsAcceptedAt: ago(500),
      createdAt: ago(500),
      updatedAt: ago(200),
    },
    {
      id: "ord_seed_3",
      orderNo: "PKM-SEED003",
      buyerId: "u-buyer3",
      buyerName: "Sara Parveen",
      items: [{ id: "oi3", productId: "p2", productTitle: "Cotton Panjabi (Bulk x10)", productImage: img("p2"), vendorId: "v2", vendorName: "Chittagong Wholesale", unitPrice: 8500, quantity: 1, lineTotal: 8500 }],
      breakdown: mkBreakdown(8500, false),
      subtotal: 8500, vatAmount: Math.round(8500*0.05), shippingFee: 0, total: 8500 + Math.round(8500*0.05),
      currency: "BDT",
      status: "pending",
      statusHistory: mkHistory("pending"),
      deliveryAddress: "Village: Karimpur, Dist: Rajshahi",
      deliveryDistrict: "Rajshahi",
      isInsideDhaka: false,
      maxDeliveryDays: 7,
      expectedDelivery: new Date(Date.now() + 7 * 86400000).toISOString(),
      deliveryPolicy: "Delivery within 7 working days outside Dhaka",
      paymentMethod: "nagad",
      notes: "",
      termsAcceptedAt: ago(60),
      createdAt: ago(60),
      updatedAt: ago(60),
    },
    {
      id: "ord_seed_4",
      orderNo: "PKM-SEED004",
      buyerId: "u-me",
      buyerName: "Demo Buyer",
      items: [{ id: "oi4", productId: "p3", productTitle: "Fresh Hilsa Fish 1kg", productImage: img("p3"), vendorId: "v3", vendorName: "Sylhet Fresh Mart", unitPrice: 1450, quantity: 2, lineTotal: 2900 }],
      breakdown: mkBreakdown(2900, false),
      subtotal: 2900, vatAmount: Math.round(2900*0.05), shippingFee: 0, total: 2900 + Math.round(2900*0.05),
      currency: "BDT",
      status: "delivered",
      statusHistory: mkHistory("delivered"),
      deliveryAddress: "Mirpur-10, Dhaka",
      deliveryDistrict: "Dhaka",
      isInsideDhaka: true,
      maxDeliveryDays: 3,
      expectedDelivery: new Date(Date.now() - 2 * 86400000).toISOString(),
      deliveryPolicy: "Delivery within 3 working days inside Dhaka",
      paymentMethod: "bkash",
      notes: "",
      termsAcceptedAt: ago(2000),
      createdAt: ago(2000),
      updatedAt: ago(20),
    },
  ];

  db.notifications = [
    { id: "n1", type: "order", title: "Order shipped", body: "Your order PKM-SEED001 is on the way.", actorAvatarUrl: avatar("v1"), read: false, createdAt: ago(30) },
    { id: "n2", type: "demand_match", title: "New match", body: "Chittagong Wholesale matched your demand.", actorAvatarUrl: avatar("v2"), read: false, createdAt: ago(120) },
    { id: "n3", type: "review", title: "New review", body: "5-star review on Wireless Earbuds Pro.", read: true, createdAt: ago(720) },
  ];
}

seed();

export function genId(prefix = "id") {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

export function expandVendor(v: Vendor) {
  return v;
}
export function expandProduct(p: Product) {
  const vendor = db.vendors.find((v) => v.id === p.vendorId)!;
  const category = db.categories.find((c) => c.id === p.categoryId)!;
  const { vendorId, categoryId, ...rest } = p;
  return { ...rest, vendor, category };
}
export function expandPost(p: Post) {
  const author = db.vendors.find((v) => v.id === p.authorId)!;
  const product = p.productId
    ? db.products.find((x) => x.id === p.productId)
    : undefined;
  const { authorId, productId, ...rest } = p;
  return {
    ...rest,
    author,
    ...(product ? { product: expandProduct(product) } : {}),
  };
}
export function expandStory(s: Story) {
  const author = db.vendors.find((v) => v.id === s.authorId)!;
  const { authorId, ...rest } = s;
  return { ...rest, author };
}
export function expandComment(c: Comment) {
  const author =
    db.users.find((u) => u.id === c.authorId) ||
    (c.authorId === db.currentUser.id ? db.currentUser : db.currentUser);
  const { postId, authorId, ...rest } = c;
  return { ...rest, author };
}
export function expandDemand(d: Demand) {
  const category = db.categories.find((c) => c.id === d.categoryId)!;
  const author =
    d.authorId === db.currentUser.id
      ? db.currentUser
      : db.users.find((u) => u.id === d.authorId) || db.currentUser;
  const { categoryId, authorId, ...rest } = d;
  return { ...rest, category, author };
}
export function expandCartItem(ci: CartItem) {
  const product = db.products.find((p) => p.id === ci.productId);
  if (!product) return null;
  return { id: ci.id, quantity: ci.quantity, product: expandProduct(product) };
}
export function cartTotals() {
  const items = db.cart.map(expandCartItem).filter(Boolean) as any[];
  const subtotal = items.reduce(
    (s, i) => s + (i.product?.price ?? 0) * (i.quantity ?? 0),
    0,
  );
  return {
    items,
    subtotal,
    currency: "BDT",
    itemCount: items.reduce((s, i) => s + (i.quantity ?? 0), 0),
  };
}

/** Compute full BD compliance price breakdown from a subtotal + district */
export function computeBreakdown(subtotal: number, isInsideDhaka: boolean): import("./db").PriceBreakdown {
  const vatAmount = Math.round(subtotal * 0.05);
  const shippingFee = subtotal >= 1000 ? 0 : isInsideDhaka ? 60 : 120;
  return {
    subtotal,
    vatRate: "5%",
    vatAmount,
    shippingFee,
    shippingLabel: shippingFee === 0
      ? "Free (order above ৳1,000)"
      : `৳${shippingFee} (${isInsideDhaka ? "Inside Dhaka" : "Outside Dhaka"})`,
    discountAmount: 0,
    total: subtotal + vatAmount + shippingFee,
  };
}
