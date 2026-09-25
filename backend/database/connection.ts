// import { PrismaClient } from '@prisma/client';
// export const prisma = new PrismaClient();

export const db = {
  connect: async () => {
    // await prisma.$connect();
    console.log('Database connection initialized (Prisma disabled)');
  },
  query: async (text: string, params?: any[]) => {
    // Placeholder for custom queries
  }
};
