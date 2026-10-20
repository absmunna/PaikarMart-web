import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding real data to Supabase PostgreSQL database...');

  // Hash a secure default password
  const hashedPassword = await bcrypt.hash('PaikarMart@2026', 10);

  // 1. Create or upsert Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@paikarmart.com' },
    update: {},
    create: {
      email: 'admin@paikarmart.com',
      name: 'PaikarMart Super Admin',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // 2. Create or upsert Verified Seller
  const seller = await prisma.user.upsert({
    where: { email: 'seller@paikarmart.com' },
    update: {},
    create: {
      email: 'seller@paikarmart.com',
      name: 'মেসার্স আলম ব্রাদার্স ট্রেডার্স (Alam Brothers)',
      password: hashedPassword,
      role: 'seller',
    },
  });

  // 3. Create or upsert Buyer
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@paikarmart.com' },
    update: {},
    create: {
      email: 'buyer@paikarmart.com',
      name: 'সাকিব আল হাসান (Sakib Al Hasan)',
      password: hashedPassword,
      role: 'buyer',
    },
  });

  // 4. Seed Wallets
  const existingWallet = await prisma.wallet.findUnique({ where: { userId: buyer.id } });
  if (!existingWallet) {
    await prisma.wallet.create({
      data: {
        userId: buyer.id,
        balance: 15400,
        coins: 250,
      },
    });
    console.log('Seeded initial wallet for buyer.');
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
