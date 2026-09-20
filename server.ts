import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { createServer as createViteServer } from "vite";
import morgan from 'morgan';
import { rateLimitMiddleware, authRateLimitMiddleware, writeRateLimitMiddleware } from '@backend/middleware/rateLimit';
import { corsMiddleware } from '@backend/middleware/cors';
import { auditMiddleware } from '@backend/middleware/audit';
import { sanitizeMiddleware } from '@backend/middleware/sanitize';
import { db } from '@backend/config/database';
import { authRoutes } from '@backend/modules/auth/auth.routes';
import { roleRoutes } from '@backend/modules/auth/role.routes';
import { productRoutes } from '@backend/modules/product/product.routes';
import { orderRoutes } from '@backend/modules/order/order.routes';
import { paymentRoutes } from '@backend/modules/payment/payment.routes';
import { escrowRoutes } from '@backend/modules/escrow/escrow.routes';
import { storageRoutes } from '@backend/modules/storage/storage.routes';
import { socialRoutes } from '@backend/modules/social/social.routes';
import { contentRoutes } from '@backend/modules/content/content.routes';
import { feedRoutes } from '@backend/modules/feed/feed.routes';
import { engagementRoutes } from '@backend/modules/engagement/engagement.routes';
import { analyticsRoutes } from '@backend/modules/analytics/analytics.routes';
import { intelligenceRoutes } from '@backend/modules/intelligence/intelligence.routes';
import { governanceRoutes } from '@backend/modules/governance/governance.routes';
import { nearbyRoutes } from '@backend/modules/nearby/nearby.routes';
import { deliveryRoutes } from '@backend/modules/delivery/delivery.routes';
import { aiRoutes } from '@backend/modules/ai/ai.routes';
import apiRouter from '@backend/api/routes/index';
import { errorMiddleware } from '@backend/middleware/error';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Socket.io initialization
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    socket.on("join_room", (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.id} joined room ${conversationId}`);
    });
    socket.on("send_message", (data) => {
      // Broadcast to room
      io.to(data.conversationId).emit("receive_message", data);
    });
  });

  // Initialize Database
  db.connect().catch(e => console.warn('Database not available yet:', e));

  // Security & Logging
  app.set('trust proxy', 1);
  app.set('etag', false);
  app.use((req, res, next) => {
    res.removeHeader('X-Frame-Options');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Content-Security-Policy', "default-src 'self'; img-src * data:; connect-src 'self' https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
    }
    next();
  });
  app.use(corsMiddleware);
  app.use(rateLimitMiddleware);
  app.use(morgan('combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(sanitizeMiddleware);
  app.use(auditMiddleware);

  // Legacy versioned API routes (for production compatibility)
  app.use('/api/v1/auth', authRateLimitMiddleware, authRoutes);
  app.use('/api/v1/roles', roleRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/orders', orderRoutes);
  app.use('/api/v1/payment', paymentRoutes);
  app.use('/api/v1/escrow', escrowRoutes);
  app.use('/api/v1/storage', storageRoutes);
  app.use('/api/v1/social', socialRoutes);
  app.use('/api/v1/content', contentRoutes);
  app.use('/api/v1/feed', feedRoutes);
  app.use('/api/v1/engagement', engagementRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);
  app.use('/api/v1/intelligence', intelligenceRoutes);
  app.use('/api/v1/governance', governanceRoutes);
  app.use('/api/v1/nearby', nearbyRoutes);
  app.use('/api/v1/delivery', deliveryRoutes);
  app.use('/api/v1/ai', aiRoutes);
  app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", message: "Paikar Mart API running" });
  });

  // Seller module routes – lazy-loaded so startup doesn't break if file missing yet
  try {
    const { sellerRoutes } = await import('@backend/modules/seller/seller.routes');
    app.use('/api/v1/seller', writeRateLimitMiddleware, sellerRoutes);
    console.log('Seller routes loaded at /api/v1/seller');
  } catch {
    console.warn('seller.routes.ts not found – seller endpoints unavailable');
  }

  // Frontend-compatible API routes (used by the new UI)
  app.use('/api', apiRouter);
  console.log('Api router loaded successfully at /api');


  app.use(errorMiddleware);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: process.cwd(),
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

startServer();
