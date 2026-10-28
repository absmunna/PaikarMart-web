import express from "express";
import path from "path";
import fs from "fs";
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
import { commercialRoutes } from './modules/commercial/commercial.routes';
import { pkShopRoutes } from './modules/portals/pkshop.routes';
import { verificationRoutes } from './modules/verification/verification.routes';
import { adminRoutes } from './modules/admin/admin.routes';
import vendorsRouter from './api/routes/vendors';
import miscRouter from './api/routes/misc';
import meRouter from './api/routes/me';

import { initializeFirebaseAdmin } from './config/firebase';

dotenv.config();
initializeFirebaseAdmin();

// Multi-path .env fallback for monorepo development & production
const envPathsToTry = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env'),
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env')
];
for (const envPath of envPathsToTry) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}



// Guard against process crashes in production due to unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Bypass & handle all AI Studio internal control plane routes to prevent 404 or HTML fallthroughs
  app.use((req, res, next) => {
    if (req.path.startsWith('/__aistudio_internal_control_plane')) {
      return res.status(200).json({ status: "ok", service: "paikarmart" });
    }
    next();
  });

  // Dedicated lightweight health check handler for Cloud Run, Nginx, and Container probes
  const healthCheckHandler = (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      status: "ok",
      service: "paikarmart",
      timestamp: new Date().toISOString(),
      database: {
        connected: db.isConnected(),
        status: db.isConnected() ? "connected" : "mock_resilient_mode"
      }
    });
  };

  app.get([
    "/health",
    "/healthz",
    "/status",
    "/_health",
    "/api/health",
    "/api/status",
    "/api/v1/health"
  ], healthCheckHandler);

  // Initialize Database
  // Don't await this if it fails or there is no DB, so it doesn't block startup
  db.connect().catch(e => console.warn('Database not available yet:', e));

  // Security & Logging
  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(rateLimitMiddleware);
  app.use(morgan('combined', { skip: (req) => !req.url.startsWith('/api') }));
  app.use(sanitizeMiddleware);
  app.use(auditMiddleware);
  app.use(express.json());

  // API v1 routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/orders', orderRoutes);
  app.use('/api/v1/demands', demandRoutes);
  app.use('/api/v1/feed', feedRoutes);
  app.use('/api/feed', feedRoutes);
  app.use('/api/v1/wallet', walletRoutes);
  app.use('/api/v1/cart', cartRoutes);
  app.use('/api/v1/payment', paymentRoutes);
  app.use('/api/v1/seller', sellerRoutes);
  app.use('/api/v1/search', searchRoutes);
  app.use('/api/v1/escrow', escrowRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);
  app.use('/api/v1/nearby', nearbyRoutes);
  app.use('/api/v1/shops/nearby', nearbyRoutes);
  app.use('/api/v1/local', nearbyRoutes);
  app.use('/api/local', nearbyRoutes);
  app.use('/api/v1/delivery', deliveryRoutes);
  app.use('/api/v1/logistics', logisticsHubRoutes);
  app.use('/api/v1/deals', dealRoutes);
  app.use('/api/v1/social', socialRoutes);
  app.use('/api/v1/content', contentRoutes);
  app.use('/api/v1/compliance', complianceRoutes);
  app.use('/api/v1/ai', aiRoutes);
  app.use('/api/v1/commercial', commercialRoutes);
  app.use('/api/v1/pk-shop', pkShopRoutes);
  app.use('/api/v1/verifications', verificationRoutes);
  app.use('/api/v1/admin', adminRoutes);
  
  // Cross-cutting utility routes
  app.use('/api/v1', vendorsRouter);
  app.use('/api/v1', miscRouter);
  app.use('/api/v1', meRouter);

  app.get("/api/v1/health", (req, res) => {
    res.json({
      status: "ok",
      message: "Paikar Mart API running",
      database: {
        connected: db.isConnected(),
        status: db.isConnected() ? "connected" : "mock_resilient_mode",
        lastError: db.getConnectionError() ? String(db.getConnectionError()?.message || db.getConnectionError()) : null
      }
    });
  });

  app.get("/api/v1/db-status", async (req, res) => {
    const isConn = db.isConnected();
    let sampleTest = null;
    let queryError = null;

    if (isConn) {
      try {
        sampleTest = await db.query("SELECT current_database(), current_user, now();");
      } catch (err: any) {
        queryError = err.message;
      }
    }

    res.json({
      connected: isConn,
      provider: "Supabase PostgreSQL (Prisma)",
      mode: isConn ? "live_database" : "resilient_mock_mode",
      lastConnectionError: db.getConnectionError() ? String(db.getConnectionError()?.message || db.getConnectionError()) : null,
      sampleQuery: sampleTest,
      queryError: queryError
    });
  });

  app.get("/test-server", (req, res) => {
    res.send("<h1>Server is UP and accessible</h1>");
  });

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  // Dynamically resolve frontend root directory
  const candidateFrontendRoots = [
    path.resolve(__dirname, '../frontend'),
    path.resolve(__dirname, '../../frontend'),
    path.resolve(process.cwd(), 'apps/frontend'),
    path.resolve(process.cwd(), '../frontend'),
  ];
  const frontendRoot = candidateFrontendRoots.find(p => fs.existsSync(p)) || path.resolve(process.cwd(), 'apps/frontend');
  const distPath = path.join(frontendRoot, 'dist');
  const indexHtml = path.join(distPath, 'index.html');

  // Production detection: explicit production env OR running compiled bundle from dist
  const isCompiledBundle = __dirname.endsWith('dist') || __dirname.includes(path.sep + 'dist');
  const isProduction = process.env.NODE_ENV === "production" || isCompiledBundle;

  // Serve static public assets (PWA manifest, icons, service worker)
  const publicPath = path.join(frontendRoot, 'public');
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));
  }

  // Vite middleware for development
  if (!isProduction) {
    console.log("🚀 Starting in DEVELOPMENT mode (Vite middleware)");
    const viteConfig = path.join(frontendRoot, 'vite.config.ts');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: frontendRoot,
      configFile: fs.existsSync(viteConfig) ? viteConfig : undefined,
    });
    app.use(vite.middlewares);
  } else {
    // Production: Serve frontend from dist
    console.log("📦 Starting in PRODUCTION mode (Serving from dist)");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }

    app.get('*', (req, res, next) => {
      // Pass unhandled API requests to standard 404 handler
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: "API endpoint not found" });
      }

      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml, (err) => {
          if (err && !res.headersSent) {
            next(err);
          }
        });
      } else {
        res.status(200).json({
          app: "Paikar Mart Backend API",
          status: "online",
          version: "1.0.0",
          environment: process.env.NODE_ENV || "production",
          endpoints: {
            health: "/api/v1/health",
            dbStatus: "/api/v1/db-status"
          },
          message: "Paikar Mart API Service is running smoothly. Frontend is hosted on Vercel (https://paikarmart.com)."
        });
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`==============================================`);
    console.log(`🚀 PAIKAR MART BACKEND API IS ONLINE & LIVE!`);
    console.log(`📡 Listening on: http://0.0.0.0:${PORT}`);
    console.log(`🩺 Health check: http://0.0.0.0:${PORT}/api/v1/health`);
    console.log(`==============================================`);
  });
}


startServer();
