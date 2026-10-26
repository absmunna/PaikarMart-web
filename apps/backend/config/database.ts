import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | null = null;
let isConnected = false;
let connectionError: any = null;

const safeMockDelegate = new Proxy({}, {
  get: (_target, prop) => {
    return async (..._args: any[]) => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Database is unavailable; refusing to return mock data in production.');
      }
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
  connect: async () => {
    if (!process.env.DATABASE_URL) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('DATABASE_URL is required in production.');
      }
      console.log('Database: Running in Development Mock Mode (no DATABASE_URL provided).');
      isConnected = false;
      return;
    }

    try {
      if (!prismaClient) {
        prismaClient = new PrismaClient();
      }

      // Explicitly test connection with a 2.5-second timeout to avoid blocking server boot
      await Promise.race([
        prismaClient.$connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout to external database')), 2500))
      ]);

      isConnected = true;
      console.log('✅ Connected to database successfully (PostgreSQL/Supabase enabled).');
    } catch (error: any) {
      isConnected = false;
      connectionError = error;
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Unable to connect to the production database.', { cause: error });
      }
      console.warn('Database unavailable; development mock mode is enabled.', error);
    }
  },
  query: async (_text: string, _params?: any[]) => {
    return [];
  }
};
