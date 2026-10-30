import cors from 'cors';

const staticOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://paikarmart.com',
  'https://www.paikarmart.com',
  process.env.CLIENT_URL,
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()) : []),
].filter(Boolean) as string[];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow server-to-server, curl, Postman or same-origin requests with no origin header
    if (!origin) return callback(null, true);
    
    // Check static match
    if (staticOrigins.includes(origin)) return callback(null, true);

    // Allow any Vercel deployment preview/production URL (*.vercel.app)
    if (/^https:\/\/([a-zA-Z0-9-]+\.)*vercel\.app$/.test(origin)) return callback(null, true);

    // Allow Google Cloud Run / AI Studio preview environments (*.run.app)
    if (/^https:\/\/([a-zA-Z0-9-]+\.)*run\.app$/.test(origin)) return callback(null, true);

    // Allow Render environments (*.onrender.com)
    if (/^https:\/\/([a-zA-Z0-9-]+\.)*onrender\.com$/.test(origin)) return callback(null, true);

    // Allow Paikar Mart domains (*.paikarmart.com)
    if (/^https:\/\/([a-zA-Z0-9-]+\.)*paikarmart\.com$/.test(origin)) return callback(null, true);

    // Allow localhost with any port during development
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);

    // If development environment or CORS_ORIGINS is '*', allow
    if (process.env.NODE_ENV !== 'production' || process.env.CORS_ORIGINS === '*') {
      return callback(null, true);
    }

    // Gracefully deny origin without throwing an unhandled Error that causes 500 crash
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
});