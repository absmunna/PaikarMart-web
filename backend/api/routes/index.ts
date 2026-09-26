import { Router, type IRouter } from "express";
import healthRouter from "./health";
import meRouter from "./me";
import postsRouter from "./posts";
import productsRouter from "./products";
import vendorsRouter from "./vendors";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import miscRouter from "./misc";
import logisticsRouter from "./logistics";

// Modular Routes
import { authRoutes } from "../../modules/auth/auth.routes";
import { aiRoutes } from "../../modules/ai/ai.routes";
import { paymentRoutes } from "../../modules/payment/payment.routes";
import { productRoutes } from "../../modules/product/product.routes";
import { orderRoutes } from "../../modules/order/order.routes";
import { socialRoutes } from "../../modules/social/social.routes";
import { nearbyRoutes } from "../../modules/nearby/nearby.routes";
import { deliveryRoutes } from "../../modules/delivery/delivery.routes";
import { dealRoutes } from "../../modules/deal/deal.routes";
import searchRoutes from "../../modules/search/search.routes";
import logisticsHubRoutes from "../../modules/delivery/logistics.hub.routes";
import communityHubRoutes from "../../modules/content/community.hub.routes";

const router: IRouter = Router();

// Base Routes
router.use(healthRouter);
router.use(meRouter);

// --- UNIFIED SEARCH ---
router.use("/search", searchRoutes);

// --- MARKETPLACE HUB ---
router.use("/marketplace", productRoutes);
router.use("/marketplace/orders", orderRoutes);
router.use("/marketplace/deals", dealRoutes);

// --- LOGISTICS HUB ---
router.use("/logistics", logisticsHubRoutes);

// --- LOCAL HUB ---
router.use("/local", nearbyRoutes);

// --- COMMUNITY HUB ---
router.use("/community", communityHubRoutes);

// --- SHARED SERVICES ---
router.use("/auth", authRoutes);
router.use("/ai", aiRoutes);
router.use("/payment", paymentRoutes);

// Legacy/Compatibility
router.use(postsRouter);
router.use(productsRouter);
router.use(vendorsRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(miscRouter);
router.use(logisticsRouter);

export default router;
