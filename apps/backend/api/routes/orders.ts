import { Router, type IRouter } from "express";
import { db, cartTotals, computeBreakdown, genId } from "@backend/api/lib/db";
import type { Order, OrderItem, OrderStatus, StatusHistoryEntry } from "@backend/api/lib/db";
import { prisma } from "@backend/config/database";

const router: IRouter = Router();

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:    ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped:    ["delivered"],
  delivered:  [],
  cancelled:  [],
};

// ── GET /api/orders  ─────────────────────────────────────────────────────────
// Returns buyer's own orders (newest first)
router.get("/orders", async (_req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      const buyer = db.orders.filter((o) => o.buyerId === db.currentUser.id);
      return res.json([...buyer].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    }

    const userId = db.currentUser.id;
    const dbOrders = await prisma.order.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map Prisma orders to match Virtual Order schema for front-end safety
    const mapped = dbOrders.map((o: any) => ({
      id: o.id,
      orderNo: o.orderNo || `PKM-DB${o.id.substring(0, 5).toUpperCase()}`,
      buyerId: o.buyerId,
      buyerName: "Paikar Mart Member",
      status: o.status as OrderStatus,
      subtotal: Number(o.subtotal || o.total),
      total: Number(o.total),
      vatAmount: Math.round(Number(o.subtotal || o.total) * 0.05),
      shippingFee: 60,
      currency: "BDT",
      deliveryAddress: o.deliveryAddress,
      deliveryDistrict: o.deliveryDistrict,
      paymentMethod: o.paymentMethod || "cod",
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      statusHistory: [{ status: o.status, at: o.createdAt.toISOString(), note: "Status track" }],
      items: o.items.map((it: any) => ({
        id: it.id,
        productId: it.productId,
        productTitle: it.title,
        unitPrice: Number(it.price),
        quantity: it.qty,
        lineTotal: Number(it.price) * it.qty,
        productImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?fit=crop&w=150&h=150"
      }))
    }));

    res.json(mapped);
  } catch (error) {
    console.error("Fetch API Orders Error:", error);
    res.status(500).json({ error: "Failed to load orders" });
  }
});

// ── GET /api/orders/all  ─────────────────────────────────────────────────────
// Admin view: all orders
router.get("/orders/all", async (_req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.json([...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    }

    const dbOrders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });

    const mapped = dbOrders.map((o: any) => ({
      id: o.id,
      orderNo: o.orderNo || `PKM-DB${o.id.substring(0, 5).toUpperCase()}`,
      buyerId: o.buyerId,
      status: o.status as OrderStatus,
      total: Number(o.total),
      deliveryAddress: o.deliveryAddress,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((it: any) => ({
        productTitle: it.title,
        quantity: it.qty,
        lineTotal: Number(it.price) * it.qty
      }))
    }));

    res.json(mapped);
  } catch (error) {
    console.error("Admin orders get error:", error);
    res.status(500).json({ error: "Failed to load orders" });
  }
});

// ── GET /api/orders/seller  ──────────────────────────────────────────────────
// Seller view
router.get("/orders/seller", async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      const vendorId = (req.query["vendorId"] as string) ?? "v1";
      const sellerOrders = db.orders
        .filter((o) => o.items.some((i) => i.vendorId === vendorId))
        .map((o) => ({
          ...o,
          items: o.items.filter((i) => i.vendorId === vendorId),
        }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return res.json(sellerOrders);
    }

    const vendorId = (req.query["vendorId"] as string) || db.currentUser.id;
    const dbOrders = await prisma.order.findMany({
      where: { sellerId: vendorId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });

    const mapped = dbOrders.map((o: any) => ({
      id: o.id,
      orderNo: o.orderNo || `PKM-DB${o.id.substring(0, 5).toUpperCase()}`,
      status: o.status as OrderStatus,
      total: Number(o.total),
      deliveryAddress: o.deliveryAddress,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((it: any) => ({
        productTitle: it.title,
        quantity: it.qty,
        lineTotal: Number(it.price) * it.qty
      }))
    }));

    res.json(mapped);
  } catch (error) {
    console.error("Seller orders map error:", error);
    res.status(500).json({ error: "Failed" });
  }
});

// ── GET /api/orders/:id  ─────────────────────────────────────────────────────
router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!process.env.DATABASE_URL) {
      const order = db.orders.find((o) => o.id === id);
      if (!order) return res.status(404).json({ error: "not_found" });
      return res.json(order);
    }

    const o = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!o) return res.status(404).json({ error: "not_found" });

    // Map Prisma structure
    const mapped = {
      id: o.id,
      orderNo: o.orderNo || `PKM-DB${o.id.substring(0, 5).toUpperCase()}`,
      buyerId: o.buyerId,
      buyerName: "Paikar Mart Member",
      status: o.status as OrderStatus,
      subtotal: Number(o.subtotal || o.total),
      total: Number(o.total),
      vatAmount: Math.round(Number(o.subtotal) * 0.05),
      shippingFee: 60,
      currency: "BDT",
      deliveryAddress: o.deliveryAddress,
      deliveryDistrict: o.deliveryDistrict,
      paymentMethod: o.paymentMethod || "cod",
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      statusHistory: [{ status: o.status, at: o.createdAt.toISOString(), note: "Tracking log" }],
      items: o.items.map((it: any) => ({
        id: it.id,
        productId: it.productId,
        productTitle: it.title,
        unitPrice: Number(it.price),
        quantity: it.qty,
        lineTotal: Number(it.price) * it.qty,
        productImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?fit=crop&w=150&h=150"
      }))
    };

    res.json(mapped);
  } catch (error) {
    console.error("Get order by ID API Error:", error);
    res.status(500).json({ error: "Failed to reload single order" });
  }
});

// ── POST /api/orders  ────────────────────────────────────────────────────────
// Buyer places a new order from their cart.
router.post("/orders", async (req, res) => {
  try {
    const {
      deliveryAddress,
      deliveryDistrict,
      paymentMethod,
      notes,
      termsAccepted,
      items
    } = req.body ?? {};

    // BD compliance: must accept terms
    if (!termsAccepted) {
      return res.status(400).json({ error: "terms_not_accepted", message: "You must accept the terms and conditions before placing an order." });
    }
    if (!deliveryAddress || String(deliveryAddress).trim().length < 10) {
      return res.status(400).json({ error: "invalid_address", message: "Please provide a full delivery address (min 10 chars)." });
    }

    if (!process.env.DATABASE_URL) {
      const totals = cartTotals();
      if (!totals.items.length) {
        return res.status(400).json({ error: "empty_cart", message: "Your cart is empty." });
      }

      const isInsideDhaka = String(deliveryDistrict ?? "").toLowerCase().includes("dhaka");
      const breakdown = computeBreakdown(totals.subtotal, isInsideDhaka);
      const maxDeliveryDays = isInsideDhaka ? 3 : 7;
      const expectedDelivery = new Date(Date.now() + maxDeliveryDays * 86400000).toISOString();
      const deliveryPolicy = isInsideDhaka
        ? "Delivery within 3 working days inside Dhaka (Bangladesh E-Commerce Policy)"
        : "Delivery within 7 working days outside Dhaka (Bangladesh E-Commerce Policy)";

      const orderItems: OrderItem[] = totals.items.map((ci: any) => ({
        id: genId("oi"),
        productId: ci.product.id,
        productTitle: ci.product.title,
        productImage: ci.product.images?.[0] ?? "",
        vendorId: ci.product.vendor?.id ?? "v1",
        vendorName: ci.product.vendor?.name ?? "Unknown Vendor",
        unitPrice: ci.product.price,
        quantity: ci.quantity,
        lineTotal: ci.product.price * ci.quantity,
      }));

      const now = new Date().toISOString();
      const order: Order = {
        id: genId("ord"),
        orderNo: `PKM-${Date.now().toString(36).toUpperCase()}`,
        buyerId: db.currentUser.id,
        buyerName: db.currentUser.name,
        items: orderItems,
        breakdown,
        subtotal: breakdown.subtotal,
        vatAmount: breakdown.vatAmount,
        shippingFee: breakdown.shippingFee,
        total: breakdown.total,
        currency: "BDT",
        status: "pending",
        statusHistory: [{ status: "pending", at: now, note: "Order placed by buyer" }],
        deliveryAddress: String(deliveryAddress).trim(),
        deliveryDistrict: String(deliveryDistrict ?? "").trim(),
        isInsideDhaka,
        maxDeliveryDays,
        expectedDelivery,
        deliveryPolicy,
        paymentMethod: paymentMethod ?? "cod",
        notes: notes ?? "",
        termsAcceptedAt: now,
        createdAt: now,
        updatedAt: now,
      };

      db.orders.unshift(order);
      db.cart = []; // clear cart after successful order

      db.notifications.unshift({
        id: genId("n"),
        type: "order",
        title: "অর্ডার সম্পন্ন হয়েছে",
        body: `${order.orderNo} — মোট ৳${breakdown.total} (৳${breakdown.subtotal} + ৳${breakdown.vatAmount} VAT + ${breakdown.shippingLabel})। ডেলিভারি: ${maxDeliveryDays} কর্মদিবস।`,
        read: false,
        createdAt: now,
      });

      return res.status(201).json(order);
    }

    const userId = db.currentUser.id;
    let user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) user = await prisma.user.findFirst();
    if (!user) {
      return res.status(401).json({ error: "User context not identified" });
    }

    // Load active cart items from DB
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "empty_cart", message: "Your database cart is empty." });
    }

    // Split orders dynamically per merchant
    const sellerGroups: { [key: string]: any[] } = {};
    for (const item of cartItems) {
      const sId = item.product.sellerId || "pk-store-ex";
      if (!sellerGroups[sId]) sellerGroups[sId] = [];
      sellerGroups[sId].push(item);
    }

    const createdOrders = [];
    const nowStamp = new Date();

    for (const [sId, groupItems] of Object.entries(sellerGroups)) {
      const subtotalSum = groupItems.reduce((acc, current) => acc + (Number(current.product.price) * current.qty), 0);
      const isInsideDhaka = String(deliveryDistrict ?? "").toLowerCase().includes("dhaka");
      const shippingFee = isInsideDhaka ? 60 : 120;
      const orderTotal = subtotalSum + shippingFee;

      const newOrder = await prisma.order.create({
        data: {
          buyerId: user.id,
          sellerId: sId,
          subtotal: subtotalSum,
          total: orderTotal,
          deliveryAddress: String(deliveryAddress).trim(),
          deliveryDistrict: String(deliveryDistrict ?? "").trim(),
          status: "pending",
          paymentMethod: paymentMethod || "cod",
          paymentStatus: paymentMethod === "wallet" ? "paid" : "pending",
          items: {
            create: groupItems.map(item => ({
              productId: item.productId,
              title: item.product.title,
              price: Number(item.product.price),
              qty: item.qty
            }))
          }
        }
      });

      createdOrders.push(newOrder);
    }

    // Clear db cart
    await prisma.cartItem.deleteMany({ where: { userId: user.id } });

    res.status(201).json(createdOrders.length === 1 ? createdOrders[0] : { multiple: true, orders: createdOrders });

  } catch (error) {
    console.error("Create API Order Error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});


// ── PATCH /api/orders/:id/status  ────────────────────────────────────────────
// Seller or admin updates order status with validation.
router.patch("/orders/:id/status", (req, res) => {
  const { status, note } = req.body ?? {};
  const order = db.orders.find((o) => o.id === req.params["id"]);

  if (!order) return res.status(404).json({ error: "not_found" });

  const allowed = VALID_TRANSITIONS[order.status as OrderStatus] ?? [];
  if (!allowed.includes(status)) {
    return res.status(400).json({
      error: "invalid_transition",
      message: `Cannot move from '${order.status}' → '${status}'. Allowed: ${allowed.join(", ") || "none"}`,
    });
  }

  const now = new Date().toISOString();
  const histEntry: StatusHistoryEntry = {
    status: status as OrderStatus,
    at: now,
    note: note ?? `Status updated to ${status}`,
  };

  order.status = status as OrderStatus;
  order.statusHistory.push(histEntry);
  order.updatedAt = now;

  // Push notification to buyer
  const statusLabels: Record<string, string> = {
    processing: "প্রক্রিয়াকরণ শুরু হয়েছে",
    shipped: "পণ্য পাঠানো হয়েছে",
    delivered: "পণ্য পৌঁছে গেছে",
    cancelled: "অর্ডার বাতিল হয়েছে",
  };
  db.notifications.unshift({
    id: genId("n"),
    type: "order_status",
    title: statusLabels[status] ?? `Order ${status}`,
    body: `${order.orderNo}: ${histEntry.note}`,
    read: false,
    createdAt: now,
  });

  res.json(order);
});

export default router;
