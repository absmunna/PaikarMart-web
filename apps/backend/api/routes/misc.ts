import { Router, type IRouter } from "express";
import { db, expandStory, expandDemand, expandProduct, genId } from "@backend/api/lib/db";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/permission";

import { prisma } from "@backend/config/database";

const router: IRouter = Router();

router.get("/categories", (_req, res) => res.json(db.categories));

router.get("/stories", (_req, res) => res.json(db.stories.map(expandStory)));

router.get(["/notifications", "/api/notifications"], async (req: any, res) => {
  try {
    if (process.env.DATABASE_URL) {
      const userId = req.user?.dbProfile?.id || req.user?.id || req.query?.userId;
      const dbNotifs = await prisma.notification.findMany({
        where: userId ? { userId } : {},
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      if (dbNotifs && dbNotifs.length > 0) {
        const mapped = dbNotifs.map((n: any) => ({
          id: n.id,
          userId: n.userId,
          kind: n.type || "system",
          type: n.type || "system",
          title: n.title,
          body: n.body,
          read: n.read,
          createdAt: n.createdAt.toISOString()
        }));
        return res.json(mapped);
      }
    }
  } catch (err) {
    console.warn("Prisma notifications query fallback:", err);
  }

  res.json(
    [...db.notifications].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    ),
  );
});

router.post(["/notifications/mark-all-read", "/api/notifications/mark-all-read"], async (req: any, res) => {
  try {
    if (process.env.DATABASE_URL) {
      const userId = req.user?.dbProfile?.id || req.user?.id;
      if (userId) {
        await prisma.notification.updateMany({
          where: { userId, read: false },
          data: { read: true }
        });
      }
    }
    db.notifications.forEach(n => { n.read = true; });
    res.json({ success: true, message: "সকল নোটিফিকেশন পড়া হয়েছে হিসেবে চিহ্নিত করা হয়েছে" });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
});

router.patch(["/notifications/:id/read", "/api/notifications/:id/read"], async (req: any, res) => {
  try {
    const { id } = req.params;
    if (process.env.DATABASE_URL) {
      await prisma.notification.update({
        where: { id },
        data: { read: true }
      }).catch(() => {});
    }
    const target = db.notifications.find(n => n.id === id);
    if (target) target.read = true;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notification" });
  }
});

router.get("/demands", (req, res) => {
  const { mine } = req.query as { mine?: string };
  let items = [...db.demands];
  if (mine === "true")
    items = items.filter((d) => d.authorId === db.currentUser.id);
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json(items.map(expandDemand));
});

router.post("/demands", (req, res) => {
  const { title, description, budget, categoryId, location, urgency } =
    req.body ?? {};
  if (!title || !categoryId) return res.status(400).json({ error: "invalid" });
  const d = {
    id: genId("dem"),
    title,
    description: description ?? "",
    budget: Number(budget) || 0,
    currency: "BDT",
    categoryId,
    location: location ?? db.currentUser.location,
    urgency: urgency ?? "normal",
    status: "open",
    matchCount: 0,
    createdAt: new Date().toISOString(),
    authorId: db.currentUser.id,
  };
  db.demands.unshift(d);
  res.status(201).json(expandDemand(d));
});

router.get("/demands/:id", (req, res) => {
  const d = db.demands.find((x) => x.id === req.params["id"]);
  if (!d) return res.status(404).json({ error: "not_found" });
  res.json({ ...expandDemand(d), matches: db.vendors.slice(0, d.matchCount) });
});

router.get("/search", (req, res) => {
  const { q = "", type = "all", categoryId, sort, minPrice, maxPrice, limit } = req.query as Record<string, string>;
  const needle = q.toLowerCase().trim();
  const lim = Number(limit) || 30;

  const products = needle
    ? db.products.filter((p) =>
        p.title.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(needle))
      )
    : [...db.products];

  const vendors = needle
    ? db.vendors.filter((v) =>
        v.name.toLowerCase().includes(needle) ||
        (v.tagline ?? "").toLowerCase().includes(needle) ||
        (v.description ?? "").toLowerCase().includes(needle)
      )
    : [...db.vendors];

  const categories = needle
    ? db.categories.filter((c) =>
        c.name.toLowerCase().includes(needle) || c.slug.includes(needle)
      )
    : [...db.categories];

  const allTags = Array.from(
    new Set(db.products.flatMap((p) => p.tags ?? []))
  );
  const tagSuggestions = needle
    ? allTags.filter((t) => t.toLowerCase().includes(needle)).slice(0, 8)
    : [];

  // category filter
  const filteredProducts = categoryId
    ? products.filter((p) => p.categoryId === categoryId)
    : products;

  // price filter
  const priceFiltered = filteredProducts.filter((p) => {
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    return true;
  });

  // sort
  let sorted = [...priceFiltered];
  if (sort === "price_asc") sorted.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") sorted.sort((a, b) => b.price - a.price);
  else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
  else if (sort === "newest") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  else sorted.sort((a, b) => b.reviewCount - a.reviewCount);

  const trending = db.categories
    .slice()
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 8)
    .map((c) => c.name);

  res.json({
    query: q,
    products: (type === "all" || type === "products") ? sorted.slice(0, lim).map(expandProduct) : [],
    vendors:  (type === "all" || type === "vendors")  ? vendors.slice(0, 10).map((v) => ({ ...v })) : [],
    categories: (type === "all" || type === "categories") ? categories : [],
    tagSuggestions,
    trending,
    totalProducts: sorted.length,
    totalVendors:  vendors.length,
    totalCategories: categories.length,
  });
});

router.get("/stats/overview", (_req, res) => {
  res.json({
    totalProducts: db.products.length,
    totalVendors: db.vendors.length,
    totalUsers: db.users.length + 1,
    totalOrders: db.orders.length,
    dailyGmv: db.orders.reduce((s, o) => s + o.total, 0),
    topCategories: db.categories
      .slice()
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 5)
      .map((c) => ({ name: c.name, count: c.productCount })),
    recentActivity: db.notifications.slice(0, 5).map((n) => ({
      label: n.title,
      value: n.body,
      when: n.createdAt,
    })),
  });
});

router.get("/stats/seller", (_req, res) => {
  res.json({
    revenue: db.orders.reduce((s, o) => s + o.total, 0),
    ordersToday: db.orders.length,
    productsLive: db.products.length,
    activeDemandMatches: db.demands.reduce((s, d) => s + d.matchCount, 0),
    viewsThisWeek: 1284,
    weeklySales: ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"].map((day, i) => ({
      day,
      value: Math.round(500 + Math.random() * 1500 + i * 50),
    })),
  });
});

// ── GET /api/admin/sellers/pending ──────────────────────────────────────────
// Returns vendors whose verified === false — these are sellers awaiting admin
// approval. Protected by Super Admin / Admin RBAC.
router.get("/admin/sellers/pending", requireAuth, requireRole(["admin", "super_admin"]), (_req, res) => {
  const TYPE_MAP: Record<string, string> = {
    retail:    "Retail Seller",
    wholesale: "Wholesale",
    grocery:   "Grocery",
    dropship:  "Dropship",
    hotel:     "Hospitality",
    service:   "Service Provider",
    factory:   "Factory",
    digital:   "Digital Seller",
  };
  const pending = db.vendors
    .filter((v) => !v.verified)
    .map((v) => ({
      id:        v.id,
      name:      v.name,
      type:      TYPE_MAP[v.type] ?? v.type,
      district:  v.location,
      avatarUrl: v.avatarUrl,
      submitted: "Pending review",
    }));
  res.json(pending);
});

// Simple auth (in-memory, demo). Returns a session token + user.
function makeToken() {
  return `sess_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

router.post("/auth/login", (req, res) => {
  const { phone, email, name } = req.body ?? {};
  const handle = String(email || phone || "user").split("@")[0];
  db.currentUser.name = String(name || handle || db.currentUser.name);
  db.currentUser.handle = handle;

  // Demo role mapping based on phone number
  let role: string = (db.currentUser as any).role ?? "buyer";
  const p = String(phone || "");
  if (p === "01700000001") {
    role = "admin";
    (db.currentUser as any).role = "admin";
  } else if (p === "01700000002") {
    role = "seller";
    (db.currentUser as any).role = "seller";
    (db.currentUser as any).isSeller = true;
  } else if (p === "01700000003") {
    role = "wholesale";
    (db.currentUser as any).role = "wholesale";
  } else {
    // Any other phone → buyer (always reset, don't carry previous state)
    role = "buyer";
    (db.currentUser as any).role = "buyer";
  }

  res.json({
    ok: true,
    token: makeToken(),
    user: { ...db.currentUser, role },
  });
});

router.post("/auth/register", (req, res) => {
  const { name, email, phone } = req.body ?? {};
  if (name) db.currentUser.name = String(name);
  const handle = String(email || phone || "user").split("@")[0] || "user";
  db.currentUser.handle = handle;
  (db.currentUser as any).role = "user";
  res.status(201).json({
    ok: true,
    token: makeToken(),
    user: { ...db.currentUser, role: "user" },
  });
});

router.post("/auth/seller-register", (req, res) => {
  db.currentUser.isSeller = true;
  (db.currentUser as any).role = "seller";
  if (req.body?.name) db.currentUser.name = String(req.body.name);
  if (req.body?.shopName) (db.currentUser as any).shopName = String(req.body.shopName);
  res.status(201).json({
    ok: true,
    token: makeToken(),
    user: { ...db.currentUser, role: "seller" },
  });
});

router.post("/auth/promote-admin", (_req, res) => {
  (db.currentUser as any).role = "admin";
  res.json({ ok: true, user: { ...db.currentUser, role: "admin" } });
});

router.post("/auth/logout", (_req, res) => {
  (db.currentUser as any).role = "guest";
  res.json({ ok: true });
});

export { router as default };
