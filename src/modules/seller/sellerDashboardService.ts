import { supabase } from "@/lib/supabase";
import {
  useSellerDashboardStore,
  SellerKPI,
  SellerProduct,
  SellerOrder,
  SellerAIInsight,
  SellerBid,
} from "@/modules/seller/sellerDashboardStore";

const MOCK_BIDS: SellerBid[] = [
  {
    id: "b1",
    demandId: "d1",
    demandTitle: "1000 Units Organic Cotton T-Shirts",
    amount: 650000,
    status: "pending",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    message: "We can handle this bulk order with premium quality finishing.",
  },
];

const MOCK_INSIGHTS: SellerAIInsight[] = [
  {
    id: "i1",
    type: "trending",
    message: 'Your "Premium Cotton Panjabi" is trending in the Social Feed.',
    ctaLabel: "Boost Now",
    ctaAction: "boost",
  },
  {
    id: "i2",
    type: "price_demand",
    message: "Demand for Denim Jackets is up 40%. Consider restocking.",
    ctaLabel: "View Demand",
    ctaAction: "inventory",
  },
];

export const sellerDashboardService = {
  /**
   * Initialize data for the dashboard shell from Supabase
   */
  init: async (userId: string) => {
    const store = useSellerDashboardStore.getState();
    store.setLoading(true);

    try {
      // Fetch Products
      const { data: productsData, error: productsError } = await supabase
        .from("Product")
        .select("*")
        .eq("sellerId", userId);

      if (productsError) {
        console.error("Error fetching products:", productsError);
      }

      const parsedProducts: SellerProduct[] = (productsData || []).map((p) => ({
        id: p.id,
        title: p.title,
        price: Number(p.price) || 0,
        image:
          p.images?.[0] ||
          "https://images.unsplash.com/photo-1597983073492-bc240182d1c6?auto=format&fit=crop&q=80&w=200",
        stock: p.stock || 0,
        views: Math.floor(Math.random() * 1000), // Mocked for now
        sales: 0, // Should be computed from OrderItems
        conversion: 0, // Mocked for now
        isBoosted: false, // Mocked
        status: p.isActive
          ? p.stock > 0
            ? "active"
            : "out_of_stock"
          : "paused",
      }));

      // Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("Order")
        .select(
          `
          id,
          orderNo,
          total,
          status,
          createdAt,
          items:OrderItem(qty),
          buyer:User(fullName)
        `,
        )
        .eq("sellerId", userId);

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
      }

      let totalSales = 0;
      let totalOrders = 0;
      let pendingOrders = 0;

      const parsedOrders: SellerOrder[] = (ordersData || []).map((o) => {
        const amount = Number(o.total) || 0;
        totalOrders += 1;
        totalSales += amount;

        let status: SellerOrder["status"] = "new";
        if (o.status === "pending") {
          status = "new";
          pendingOrders += 1;
        } else if (o.status === "confirmed") status = "processing";
        else if (o.status === "shipped") status = "shipped";
        else if (o.status === "delivered") status = "completed";
        else if (o.status === "cancelled") status = "cancelled";
        else status = "new";

        const itemCount = o.items
          ? o.items.reduce((acc: number, item: any) => acc + (item.qty || 1), 0)
          : 1;

        return {
          id: o.id,
          buyerName: o.buyer?.[0]?.fullName || "Buyer",
          amount,
          status,
          createdAt: o.createdAt || new Date().toISOString(),
          itemCount,
        };
      });

      store.setKPIs({
        totalSales,
        totalOrders,
        conversionRate: 4.8, // Mocked overall conversion
        pendingOrders,
        refundRate: 1.2,
        stockAlerts: parsedProducts.filter((p) => p.stock < 5).length,
      });

      store.setProducts(parsedProducts);
      store.setOrders(parsedOrders);

      if (store.bids.length === 0) {
        store.setBids(MOCK_BIDS);
      }

      store.setInsights(MOCK_INSIGHTS);
    } catch (err) {
      console.error("Error in seller dashboard init:", err);
    } finally {
      store.setLoading(false);
    }
  },

  /**
   * Real-time listeners for the seller lifecycle
   */
  initEventListeners: () => {
    if (typeof window === "undefined") return;

    window.addEventListener("ORDER_CREATED", (e: any) => {
      const store = useSellerDashboardStore.getState();
      const newOrder: SellerOrder = {
        id: e.detail.orderId,
        buyerName: "Marketplace Buyer",
        amount: e.detail.total,
        status: "new",
        createdAt: new Date().toISOString(),
        itemCount: 1,
      };

      store.setOrders([newOrder, ...store.orders]);
      store.setKPIs({
        ...store.kpis,
        totalOrders: store.kpis.totalOrders + 1,
        pendingOrders: store.kpis.pendingOrders + 1,
      });
    });

    window.addEventListener("BID_PLACED", (e: any) => {
      const store = useSellerDashboardStore.getState();
      const newBid: SellerBid = {
        id: Math.random().toString(36).slice(2, 9),
        demandId: e.detail.demandId,
        demandTitle: e.detail.demandTitle,
        amount: e.detail.amount,
        message: e.detail.message,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      store.setBids([newBid, ...store.bids]);
    });

    window.addEventListener("STOCK_UPDATED", (e: any) => {
      const { productId, newStock } = e.detail;
      const store = useSellerDashboardStore.getState();
      store.updateProduct(productId, { stock: newStock });
    });
  },

  acceptOrder: async (orderId: string) => {
    const store = useSellerDashboardStore.getState();
    store.updateOrder(orderId, "processing");
    try {
      await supabase.from('Order').update({ status: 'confirmed' }).eq('id', orderId);
    } catch (e) {
      console.error(e);
    }
  },

  shipOrder: async (orderId: string) => {
    const store = useSellerDashboardStore.getState();
    store.updateOrder(orderId, "shipped");
    try {
      await supabase.from('Order').update({ status: 'shipped' }).eq('id', orderId);
    } catch (e) {
      console.error(e);
    }
  },

  updateStock: async (productId: string, newStock: number) => {
    const store = useSellerDashboardStore.getState();
    store.updateProduct(productId, { stock: newStock });
    try {
      await supabase.from('Product').update({ stock: newStock }).eq('id', productId);
    } catch (e) {
      console.error(e);
    }
  }
};
