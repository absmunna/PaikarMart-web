import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | null = null;
let isConnected = false;
let connectionError: any = null;

// Safe mock delegate to prevent unhandled rejections if code queries Prisma while offline
const safeMockDelegate = new Proxy({}, {
  get: (_target, prop) => {
    return async (..._args: any[]) => {
      if (prop === 'count') return 0;
      if (prop === 'findMany') return [];
      if (prop === 'findUnique' || prop === 'findFirst') return null;
      if (prop === 'create' || prop === 'update' || prop === 'upsert') return { id: 'mock-id', ...(_args[0]?.data || {}) };
      if (prop === 'delete' || prop === 'deleteMany') return { count: 0 };
      return null;
    };
  }
});

export const prisma: PrismaClient & Record<string, any> = new Proxy({} as any, {
  get: (_target, prop) => {
    if (!isConnected) {
      return safeMockDelegate;
    }
    if (!prismaClient) {
      prismaClient = new PrismaClient();
    }
    return (prismaClient as any)[prop];
  }
});

export const db = {
  isConnected: () => isConnected,
  getConnectionError: () => connectionError,
  connect: async () => {
    if (!process.env.DATABASE_URL) {
      console.log('Database: Running in Development Mock Mode (no DATABASE_URL provided).');
      isConnected = false;
      return;
    }

    try {
      if (!prismaClient) {
        prismaClient = new PrismaClient();
      }

      // Explicitly test connection with a 6-second timeout for Supabase pooler
      await Promise.race([
        prismaClient.$connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout to external database (6s limit)')), 6000))
      ]);

      isConnected = true;
      connectionError = null;
      console.log('✅ Connected to database successfully (PostgreSQL/Supabase enabled).');
    } catch (error: any) {
      isConnected = false;
      connectionError = error;
      console.log(`ℹ️ External database unreachable (${error?.message || error}). Paikar Mart is operating in resilient Mock Mode.`);
    }
  },
  query: async (text: string, ..._params: any[]) => {
    if (!isConnected || !prismaClient) {
      return [];
    }
    try {
      return await (prismaClient as any).$queryRawUnsafe(text);
    } catch (err) {
      console.error('db.query error:', err);
      throw err;
    }
  }
};

