import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'https://paikarmart.com',
  'https://www.paikarmart.com',
  process.env.CLIENT_URL,
].filter(Boolean);

export const corsMiddleware = cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});