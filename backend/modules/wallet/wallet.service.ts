import { prisma } from '@backend/config/database';

export class WalletService {
  static async getOrCreateWallet(userId: string, type: string = 'main') {
    let wallet = await prisma.wallet.findUnique({
      where: {
        userId_type: {
          userId,
          type
        }
      },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 10 } }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          type,
          balance: 0.00,
          coins: 0
        },
        include: { transactions: true }
      });
    }

    return wallet;
  }

  static async creditWallet(userId: string, amount: number, title: string, subtitle?: string) {
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
          subtitle,
          status: 'completed'
        }
      })
    ]);

    return { wallet: updatedWallet, transaction };
  }

  static async debitWallet(userId: string, amount: number, title: string, subtitle?: string) {
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
          subtitle,
          status: 'completed'
        }
      })
    ]);

    return { wallet: updatedWallet, transaction };
  }

  static async getEscrowSummary(userId: string) {
    const escrows = await prisma.escrow.findMany({
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
  }
}
