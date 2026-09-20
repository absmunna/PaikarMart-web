import type { PrismaClient } from '@prisma/client';

let PrismaClientConstructor: any = null;
try {
    const req = typeof require !== 'undefined' ? require : undefined;
    if (req) {
        const pkg = req('@prisma/client');
        PrismaClientConstructor = pkg.PrismaClient;
    }
} catch {
    console.warn('[Database] PrismaClient could not be loaded from @prisma/client, using fallback mock proxy.');
}

let prismaClient: PrismaClient | null = null;

export const getPrisma = () => {
    if (!prismaClient) {
        const dbUrl = process.env.DATABASE_URL?.trim();
        console.log(`[Database] Initializing Prisma. DATABASE_URL set: ${!!dbUrl}`);
        
        if (dbUrl && PrismaClientConstructor) {
            try {
                prismaClient = new PrismaClientConstructor();
            } catch (err) {
                console.error('[Database] Failed to instantiate PrismaClient:', err);
            }
        } else if (!dbUrl) {
            console.warn('[Database] DATABASE_URL not set or empty, prisma client will not be initialized.');
        }
    }
    return prismaClient;
};

const createMockModelDelegate = (modelName: string) => {
    return new Proxy({}, {
        get: (target, method) => {
            if (typeof method !== 'string') return undefined;
            if (method === 'then') return undefined;
            
            return async (...args: any[]) => {
                console.warn(`[Database Fallback] Called prisma.${modelName}.${method} - DATABASE_URL is missing.`);
                
                if (method === 'findMany' || method === 'groupBy') {
                    return [];
                }
                if (method === 'count') {
                    return 0;
                }
                if (method === 'findUnique' || method === 'findFirst') {
                    return null;
                }
                if (method === 'create' || method === 'update' || method === 'upsert') {
                    const data = args[0]?.data || args[0]?.update || args[0]?.create || {};
                    return {
                        id: `mock-${modelName}-${Date.now()}`,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        ...data
                    };
                }
                if (method === 'delete' || method === 'deleteMany' || method === 'updateMany') {
                    return { count: 0 };
                }
                return null;
            };
        }
    });
};

// Proxy needs to handle missing prismaClient
export const prisma = new Proxy({} as PrismaClient, {
    get: (target, prop) => {
        const client = getPrisma();
        if (!client) {
            if (typeof prop !== 'string') return undefined;
            if (prop === 'then') return undefined;
            if (prop.startsWith('$')) {
                return async () => null;
            }
            return createMockModelDelegate(prop);
        }
        return (client as any)[prop];
    }
});

export const db = {
  connect: async () => {
    try {
      if (!process.env.DATABASE_URL) {
        console.warn('DATABASE_URL is not set. Database operations will fail.');
        return;
      }
      await prisma.$connect();
      console.log('Database connection initialized (Prisma enabled)');
    } catch (error) {
      console.error('Failed to connect to database:', error);
    }
  },
  query: async (text: string, params?: any[]) => {
    // Placeholder for custom queries
  }
};
