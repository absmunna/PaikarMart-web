import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | null = null;

function createDummyModel() {
  return {
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    create: async ({ data }: any) => ({ id: `mock-${Date.now()}`, ...data }),
    createMany: async ({ data }: any) => ({ count: Array.isArray(data) ? data.length : 0 }),
    update: async ({ data }: any) => ({ id: `mock-${Date.now()}`, ...data }),
    updateMany: async () => ({ count: 0 }),
    upsert: async ({ create }: any) => ({ id: `mock-${Date.now()}`, ...create }),
    delete: async () => ({ id: `mock-${Date.now()}` }),
    deleteMany: async () => ({ count: 0 }),
    count: async () => 0,
    groupBy: async () => []
  };
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    if (prop === '$transaction') {
      return async (actions: any) => {
        if (Array.isArray(actions)) return Promise.all(actions);
        if (typeof actions === 'function') return actions(prisma);
        return [];
      };
    }
    if (prop === '$connect' || prop === '$disconnect') {
      return async () => {};
    }

    if (!process.env.DATABASE_URL) {
      return createDummyModel();
    }

    if (!prismaClient) {
      try {
        prismaClient = new PrismaClient();
      } catch (err) {
        console.warn('Prisma client instantiation error:', err);
        return createDummyModel();
      }
    }

    const val = (prismaClient as any)[prop];
    if (val === undefined) {
      return createDummyModel();
    }
    if (typeof val === 'function') {
      return val.bind(prismaClient);
    }
    return val;
  }
});

export const db = {
  connect: async () => {
    try {
      if (!process.env.DATABASE_URL) {
        console.log('Skipping db connect: DATABASE_URL not set');
        return;
      }
      if (!prismaClient) prismaClient = new PrismaClient();
      await prismaClient.$connect();
      console.log('Database connection initialized (Prisma enabled)');
    } catch (error) {
      console.error('Failed to connect to database:', error);
    }
  },
  query: async (text: string, params?: any[]) => {
    // Placeholder for custom queries - prisma handle most
  }
};
