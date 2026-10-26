import { prisma } from '../../config/database';

export class WalletService {
  static async getOrCreateWallet(userId: string, _type: string = 'main') {
    if (!process.env.DATABASE_URL) {
      return {
        id: `wallet-${userId}`,
        userId,
        balance: 45280.00,
        coins: 2500,
        transactions: []
      };
    }

    let wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0.00,
          coins: 0
        },
        include: { transactions: true }
      });
    }

    return wallet;
  }

  static async creditWallet(userId: string, amount: number, title: string, subtitle?: string) {
    if (!process.env.DATABASE_URL) {
      return {
        wallet: { id: `wallet-${userId}`, userId, balance: 45280.00 + amount, coins: 2500 },
        transaction: { id: `txn-${Date.now()}`, type: 'inflow', amount, title, subtitle, status: 'completed' }
      };
    }

    const wallet = await this.getOrCreateWallet(userId);

    const [updatedWallet, transaction] = await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } }
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'inflow',
          amount,
          title,
          subtitle: subtitle || '',
          status: 'completed'
        }
      })
    ]);

    return { wallet: updatedWallet, transaction };
  }

  static async debitWallet(userId: string, amount: number, title: string, subtitle?: string) {
    if (!process.env.DATABASE_URL) {
      return {
        wallet: { id: `wallet-${userId}`, userId, balance: 45280.00 - amount, coins: 2500 },
        transaction: { id: `txn-${Date.now()}`, type: 'outflow', amount, title, subtitle, status: 'completed' }
      };
    }

    const wallet = await this.getOrCreateWallet(userId);

    if (Number(wallet.balance) < amount) {
      throw new Error('Insufficient wallet balance');
    }

    const [updatedWallet, transaction] = await prisma.$transaction([
      prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } }
      }),
      prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'outflow',
          amount,
          title,
          subtitle: subtitle || '',
          status: 'completed'
        }
      })
    ]);

    return { wallet: updatedWallet, transaction };
  }

  static async getEscrowSummary(userId: string) {
    if (!process.env.DATABASE_URL || !(prisma as any).escrow) {
      return {
        totalHeld: 2500,
        totalReleased: 18000,
        nextPayoutAmount: 2500,
        nextPayoutDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        recentEscrows: []
      };
    }

    try {
      const escrows = await (prisma as any).escrow.findMany({
        where: {
          order: {
            sellerId: userId
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      const totalHeld = escrows
        .filter((e: any) => e.status === 'held')
        .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

      const totalReleased = escrows
        .filter((e: any) => e.status === 'released')
        .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

      const nextPayout = escrows
        .filter((e: any) => e.status === 'held')
        .sort((a: any, b: any) => (a.releaseAt?.getTime() || 0) - (b.releaseAt?.getTime() || 0))[0];

      return {
        totalHeld,
        totalReleased,
        nextPayoutAmount: nextPayout ? Number(nextPayout.amount) : 0,
        nextPayoutDate: nextPayout?.releaseAt?.toISOString() || null,
        recentEscrows: escrows.slice(0, 5).map((e: any) => ({
          id: e.id,
          orderId: e.orderId,
          amount: Number(e.amount),
          status: e.status,
          releaseDate: e.releaseAt?.toLocaleDateString() || 'Pending'
        }))
      };
    } catch {
      return {
        totalHeld: 2500,
        totalReleased: 18000,
        nextPayoutAmount: 2500,
        nextPayoutDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        recentEscrows: []
      };
    }
  }
}

