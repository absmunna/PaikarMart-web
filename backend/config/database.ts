import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | null = null;

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    if (!prismaClient) {
      prismaClient = new PrismaClient();
    }
    return (prismaClient as any)[prop];
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
