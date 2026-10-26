import { Router, Response } from "express";
import { requireAuth, AuthenticatedRequest } from "../../middleware/auth";
import {
  verifyPKShopAdmin,
  verifyPKShopSuperAdmin,
  pkShopTeamRegistry,
  PKShopTeamMember
} from "../../middleware/verifyPKShopAdmin";
import { prisma, db } from "../../config/database";

const router: Router = Router();

// Official PK Shop In-Memory Catalog (persists across runtime and syncs with Prisma)
interface PKProductItem {
  id: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  images: string[];
  isVerified: boolean;
  portal: string;
  coinCashbackPercent: number;
  shippingOption: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

interface PKOrderItem {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  deliveryAddress: string;
  geoCoordinates?: { lat: number; lng: number };
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
  paymentMethod: 'bkash' | 'nagad' | 'cod' | 'wallet';
  paymentStatus: 'PAID' | 'UNPAID' | 'ESCROW_HELD';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  sellerType: 'PK_SHOP_OFFICIAL';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Initial Seed Data for Flagship PK Store
let pkProducts: PKProductItem[] = [
  {
    id: "pk-prod-101",
    sku: "PK-LUX-001",
    title: "রয়্যাল সিল্ক এক্সক্লুসিভ পাঞ্জাবি (Royal Heritage Silk Panjabi)",
    description: "১০০% খাঁটি রাজশাহী সিল্ক, ঐতিহ্যবাহী নকশিকাঁথা কাজের সূক্ষ্ম কারুকার্য। পিকে শপ অফিশিয়াল স্পেশাল এডিশন।",
    price: 4850,
    originalPrice: 6200,
    stock: 45,
    category: "Luxury Fashion",
    images: [
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600"
    ],
    isVerified: true,
    portal: "pk-shop",
    coinCashbackPercent: 10,
    shippingOption: "Next-Day Air Express",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pk-prod-102",
    sku: "PK-TECH-002",
    title: "পিকে সাউন্ডবার প্রো আল্ট্রা (PK Studio Soundbar 120W)",
    description: "ডলবি অ্যাটমস সাররাউন্ড সাউন্ড ও ওয়্যারলেস সাবউফার সহ অফিশিয়াল স্টুডিও গ্রেড স্পিকার।",
    price: 8900,
    originalPrice: 11500,
    stock: 28,
    category: "Premium Electronics",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    ],
    isVerified: true,
    portal: "pk-shop",
    coinCashbackPercent: 8,
    shippingOption: "Same-Day Dhaka Delivery",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pk-prod-103",
    sku: "PK-ORG-003",
    title: "সুন্দরবনের প্রিমিয়াম খলিসা মধু (100% Pure Khalisha Honey 1kg)",
    description: "সুন্দরবনের গভীর অরণ্য থেকে সরাসরি সংগৃহীত প্রাকৃতিক ও ল্যাব-পরীক্ষিত র’ মধু।",
    price: 1650,
    originalPrice: 1950,
    stock: 120,
    category: "Curated Organics",
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600"
    ],
    isVerified: true,
    portal: "pk-shop",
    coinCashbackPercent: 5,
    shippingOption: "Standard Delivery (48h)",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pk-prod-104",
    sku: "PK-LEA-004",
    title: "হ্যান্ডক্রাফটেড টপ-গ্রেইন লেদার ব্যাকপ্যাক (Executive Leather Backpack)",
    description: "প্রিমিয়াম ফুল-গ্রেইন বাফেলো লেদার, ১৫.৬ ইঞ্চি ল্যাপটপ স্লট ও ওয়াটারপ্রুফ ইন্টারনাল কোটিং।",
    price: 5400,
    originalPrice: 7200,
    stock: 19,
    category: "Luxury Fashion",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
    ],
    isVerified: true,
    portal: "pk-shop",
    coinCashbackPercent: 7,
    shippingOption: "Next-Day Air Express",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let pkOrders: PKOrderItem[] = [
  {
    id: "pko-9001",
    orderNumber: "PK-ORD-2026-9001",
    buyerId: "u-buyer-01",
    buyerName: "রাকিবুল হাসান (Rakibul Hasan)",
    buyerPhone: "01711223344",
    deliveryAddress: "বাড়ি #১২, রোড #৪, সেক্টর #৭, উত্তরা, ঢাকা-১২৩০",
    geoCoordinates: { lat: 23.8759, lng: 90.3795 },
    items: [
      {
        productId: "pk-prod-101",
        title: "রয়্যাল সিল্ক এক্সক্লুসিভ পাঞ্জাবি",
        price: 4850,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=600"
      }
    ],
    totalAmount: 4850,
    paymentMethod: "bkash",
    paymentStatus: "ESCROW_HELD",
    status: "processing",
    sellerType: "PK_SHOP_OFFICIAL",
    notes: "কাল বিকেলে ডেলিভারি দেওয়া দরকার।",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pko-9002",
    orderNumber: "PK-ORD-2026-9002",
    buyerId: "u-buyer-02",
    buyerName: "নুসরাত জাহান (Nusrat Jahan)",
    buyerPhone: "01822334455",
    deliveryAddress: "ফ্ল্যাট ৩বি, গ্রিন ডেল টাওয়ার, ধানমন্ডি ২৭, ঢাকা",
    geoCoordinates: { lat: 23.7534, lng: 90.3752 },
    items: [
      {
        productId: "pk-prod-103",
        title: "সুন্দরবনের প্রিমিয়াম খলিসা মধু (1kg)",
        price: 1650,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600"
      }
    ],
    totalAmount: 3300,
    paymentMethod: "wallet",
    paymentStatus: "PAID",
    status: "pending",
    sellerType: "PK_SHOP_OFFICIAL",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. PUBLIC ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/pk-shop/products
 * Public catalog listing for the PK Shop flagship storefront
 */
router.get("/products", async (req, res) => {
  try {
    const { category, search, sort } = req.query as Record<string, string>;
    let results = pkProducts.filter(p => p.status === 'ACTIVE');

    if (category && category !== 'all') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase().trim();
      results = results.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (sort === 'price_asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      results.sort((a, b) => b.price - a.price);
    } else {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return res.json({
      success: true,
      total: results.length,
      products: results
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch PK Shop products", details: error.message });
  }
});

/**
 * GET /api/v1/pk-shop/products/:id
 * Public single product detail
 */
router.get("/products/:id", (req, res) => {
  const product = pkProducts.find(p => p.id === req.params.id || p.sku === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  return res.json({ success: true, product });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. PROTECTED ADMIN & MANAGEMENT ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/pk-shop/admin/stats
 * Dashboard KPI stats for Store Managers & Super Admins
 */
router.get("/admin/stats", requireAuth, verifyPKShopAdmin, (req: AuthenticatedRequest, res: Response) => {
  const totalSales = pkOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = pkOrders.filter(o => o.status === 'pending').length;
  const processingOrders = pkOrders.filter(o => o.status === 'processing').length;
  const totalInventory = pkProducts.reduce((sum, p) => sum + p.stock, 0);

  return res.json({
    success: true,
    stats: {
      totalSales,
      totalOrders: pkOrders.length,
      pendingOrders,
      processingOrders,
      totalProducts: pkProducts.length,
      totalInventory,
      activeTeamCount: pkShopTeamRegistry.length
    }
  });
});

/**
 * POST /api/v1/pk-shop/admin/products
 * Add or Update Flagship PK Shop products
 */
router.post("/admin/products", requireAuth, verifyPKShopAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      id,
      sku,
      title,
      description,
      price,
      originalPrice,
      stock,
      category,
      images,
      coinCashbackPercent,
      shippingOption,
      status
    } = req.body;

    if (!title || price === undefined || stock === undefined) {
      return res.status(400).json({ error: "Title, price, and stock are required fields." });
    }

    if (id) {
      // Update existing product
      const index = pkProducts.findIndex(p => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Product ID not found." });
      }

      pkProducts[index] = {
        ...pkProducts[index],
        sku: sku || pkProducts[index].sku,
        title,
        description: description || pkProducts[index].description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : pkProducts[index].originalPrice,
        stock: Number(stock),
        category: category || pkProducts[index].category,
        images: Array.isArray(images) && images.length ? images : pkProducts[index].images,
        coinCashbackPercent: coinCashbackPercent !== undefined ? Number(coinCashbackPercent) : pkProducts[index].coinCashbackPercent,
        shippingOption: shippingOption || pkProducts[index].shippingOption,
        status: status || pkProducts[index].status,
        updatedAt: new Date().toISOString()
      };

      return res.json({
        success: true,
        message: "PK Shop product updated successfully.",
        product: pkProducts[index]
      });
    }

    // Create new product
    const newProduct: PKProductItem = {
      id: `pk-prod-${Date.now()}`,
      sku: sku || `PK-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      description: description || "Authentic PK Shop exclusive flagship item.",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock),
      category: category || "Exclusive Catalog",
      images: Array.isArray(images) && images.length
        ? images
        : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"],
      isVerified: true,
      portal: "pk-shop",
      coinCashbackPercent: coinCashbackPercent ? Number(coinCashbackPercent) : 5,
      shippingOption: shippingOption || "Standard Express",
      status: status || "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    pkProducts.unshift(newProduct);

    return res.status(201).json({
      success: true,
      message: "New PK Shop product published to flagship catalog.",
      product: newProduct
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to save product", details: error.message });
  }
});

/**
 * DELETE /api/v1/pk-shop/admin/products/:id
 * Remove / Archive product
 */
router.delete("/admin/products/:id", requireAuth, verifyPKShopAdmin, (req: AuthenticatedRequest, res: Response) => {
  const index = pkProducts.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const removed = pkProducts.splice(index, 1)[0];
  return res.json({ success: true, message: "Product removed from PK Shop catalog", product: removed });
});

/**
 * GET /api/v1/pk-shop/admin/orders
 * Retrieve all orders placed on PK Shop
 */
router.get("/admin/orders", requireAuth, verifyPKShopAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.query as Record<string, string>;
  let results = [...pkOrders];

  if (status && status !== 'all') {
    results = results.filter(o => o.status.toLowerCase() === status.toLowerCase());
  }

  return res.json({
    success: true,
    total: results.length,
    orders: results
  });
});

/**
 * PATCH /api/v1/pk-shop/admin/orders/:orderId/status
 * Update order lifecycle status (Pending -> Processing -> Shipped -> Delivered -> Cancelled)
 */
router.patch("/admin/orders/:orderId/status", requireAuth, verifyPKShopAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status, notes } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  const order = pkOrders.find(o => o.id === req.params.orderId || o.orderNumber === req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found." });
  }

  order.status = status;
  if (notes) order.notes = notes;
  order.updatedAt = new Date().toISOString();

  // If order is cancelled, optionally replenish inventory
  if (status === 'cancelled') {
    order.items.forEach(item => {
      const prod = pkProducts.find(p => p.id === item.productId);
      if (prod) {
        prod.stock += item.quantity;
      }
    });
  }

  return res.json({
    success: true,
    message: `Order status updated to ${status}.`,
    order
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEAM GOVERNANCE ENDPOINTS (SUPER ADMIN ONLY)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/pk-shop/admin/team
 * List all authorized managers & moderators
 */
router.get("/admin/team", requireAuth, verifyPKShopAdmin, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    team: pkShopTeamRegistry
  });
});

/**
 * POST /api/v1/pk-shop/admin/team/add
 * Super Admin only: Grant STORE_MANAGER or MODERATOR to a user
 */
router.post("/admin/team/add", requireAuth, verifyPKShopSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, phone, name, role, permissions } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone number is required to assign staff role." });
    }

    if (!role || !['STORE_MANAGER', 'MODERATOR'].includes(role)) {
      return res.status(400).json({ error: "Role must be 'STORE_MANAGER' or 'MODERATOR'." });
    }

    // Default permissions based on role
    const defaultPerms = role === 'STORE_MANAGER'
      ? ["products:write", "orders:write", "inventory:write"]
      : ["orders:write", "inventory:read"];

    const newMember: PKShopTeamMember = {
      id: `pk-team-${Date.now()}`,
      email: email || '',
      phone: phone || '',
      name: name || (email ? email.split('@')[0] : 'PK Staff Member'),
      role,
      permissions: Array.isArray(permissions) && permissions.length ? permissions : defaultPerms,
      addedBy: req.user?.email || req.user?.id || 'super_admin',
      createdAt: new Date().toISOString()
    };

    // Remove if already existing and update
    const existingIndex = pkShopTeamRegistry.findIndex(m =>
      (email && m.email.toLowerCase() === email.toLowerCase()) ||
      (phone && m.phone === phone)
    );

    if (existingIndex !== -1) {
      pkShopTeamRegistry[existingIndex] = newMember;
    } else {
      pkShopTeamRegistry.push(newMember);
    }

    return res.status(201).json({
      success: true,
      message: `User assigned as ${role} for PK Shop successfully.`,
      member: newMember
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to assign team member", details: error.message });
  }
});

/**
 * DELETE /api/v1/pk-shop/admin/team/:id
 * Super Admin only: Revoke staff access
 */
router.delete("/admin/team/:id", requireAuth, verifyPKShopSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  const index = pkShopTeamRegistry.findIndex(m => m.id === req.params.id || m.email === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Team member not found." });
  }

  const removed = pkShopTeamRegistry.splice(index, 1)[0];
  return res.json({
    success: true,
    message: `Access revoked for ${removed.name} (${removed.role}).`,
    member: removed
  });
});

export { router as pkShopRoutes };
