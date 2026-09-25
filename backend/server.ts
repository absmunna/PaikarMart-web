import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from "vite";
import morgan from 'morgan';
import { helmetMiddleware } from './middleware/helmet';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { corsMiddleware } from './middleware/cors';
import { auditMiddleware } from './middleware/audit';
import { sanitizeMiddleware } from './middleware/sanitize';
import { db } from './config/database';
import { authRoutes } from './modules/auth/auth.routes';
import { productRoutes } from './modules/product/product.routes';
import { orderRoutes } from './modules/order/order.routes';
import { demandRoutes } from './modules/demand/demand.routes';
import { feedRoutes } from './modules/feed/feed.routes';
import { walletRoutes } from './modules/wallet/wallet.routes';
import { cartRoutes } from './modules/cart/cart.routes';
import { paymentRoutes } from './modules/payment/payment.routes';
import { sellerRoutes } from './modules/seller/seller.routes';
import searchRoutes from './modules/search/search.routes';
import { escrowRoutes } from './modules/escrow/escrow.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';
import { nearbyRoutes } from './modules/nearby/nearby.routes';
import { deliveryRoutes } from './modules/delivery/delivery.routes';
import logisticsHubRoutes from './modules/delivery/logistics.hub.routes';
import { dealRoutes } from './modules/deal/deal.routes';
import { socialRoutes } from './modules/social/social.routes';
import { contentRoutes } from './modules/content/content.routes';
import { complianceRoutes } from './modules/compliance/compliance.routes';
import { aiRoutes } from './modules/ai/ai.routes';
import vendorsRouter from './api/routes/vendors';
import miscRouter from './api/routes/misc';
import meRouter from './api/routes/me';

dotenv.config();



async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Initialize Database
  // Don't await this if it fails or there is no DB, so it doesn't block startup
  db.connect().catch(e => console.warn('Database not available yet:', e));

  // Security & Logging
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(rateLimitMiddleware);
  app.use(morgan('combined'));
  app.use(sanitizeMiddleware);
  app.use(auditMiddleware);
  app.use(express.json());

  // API v1 routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/orders', orderRoutes);
  app.use('/api/v1/demands', demandRoutes);
  app.use('/api/v1/feed', feedRoutes);
  app.use('/api/v1/wallet', walletRoutes);
  app.use('/api/v1/cart', cartRoutes);
  app.use('/api/v1/payment', paymentRoutes);
  app.use('/api/v1/seller', sellerRoutes);
  app.use('/api/v1/search', searchRoutes);
  app.use('/api/v1/escrow', escrowRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);
  app.use('/api/v1/nearby', nearbyRoutes);
  app.use('/api/v1/shops/nearby', nearbyRoutes);
  app.use('/api/v1/delivery', deliveryRoutes);
  app.use('/api/v1/logistics', logisticsHubRoutes);
  app.use('/api/v1/deals', dealRoutes);
  app.use('/api/v1/social', socialRoutes);
  app.use('/api/v1/content', contentRoutes);
  app.use('/api/v1/compliance', complianceRoutes);
  app.use('/api/v1/ai', aiRoutes);
  
  // Cross-cutting utility routes
  app.use('/api/v1', vendorsRouter);
  app.use('/api/v1', miscRouter);
  app.use('/api/v1', meRouter);

  app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", message: "Paikar Mart API running" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: process.cwd(),
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve frontend from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}


startServer();
