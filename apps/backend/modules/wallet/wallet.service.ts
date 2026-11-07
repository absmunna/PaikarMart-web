import { prisma } from '../../config/database';

export interface DebitWalletParams {
  userId: string;
  amount: number;
  title: string;
  subtitle?: string;
  idempotencyKey?: string;
}

export interface CreditWalletParams {
  userId: string;
  amount: number;
  title: string;
  subtitle?: string;
  idempotencyKey?: string;
}

export class WalletService {
  /**
   * 👛 Get or create a wallet strictly for the authenticated user ID.
   */
  static async getOrCreateWallet(userId: string) {
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0.00,
          coins: 100
        },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 20
          }
        }
      });
    }

    return wallet;
  }

  /**
   * ⚡ Atomic & Idempotent Debit Operation
   * Enforces balance verification, atomic decrement, and ledger entry in a single DB transaction.
   * Prevents race conditions and negative balances on concurrent debit requests.
   */
  static async debitWallet(params: DebitWalletParams) {
    const { userId, amount, title, subtitle, idempotencyKey } = params;

    if (isNaN(amount) || amount <= 0) {
      throw new Error('INVALID_AMOUNT');
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Idempotency check: If an idempotencyKey was supplied and already processed, return existing result
      if (idempotencyKey) {
        const existingTxn = await tx.transaction.findUnique({
          where: { idempotencyKey }
        });
        if (existingTxn) {
          const currentWallet = await tx.wallet.findUnique({
            where: { id: existingTxn.walletId },
            include: { transactions: { orderBy: { createdAt: 'desc' }, take: 20 } }
          });
          return { wallet: currentWallet, transaction: existingTxn, isDuplicate: true };
        }
      }

      // 2. Fetch wallet inside atomic transaction context
      let wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) {
        wallet = await tx.wallet.create({
          data: { userId, balance: 0.00, coins: 100 }
        });
      }

      // 3. Verify sufficient balance
      if (Number(wallet.balance) < amount) {
        throw new Error('INSUFFICIENT_BALANCE');
      }

      // 4. Perform atomic decrement
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: amount }
        }
      });

      // 5. Hard boundary guard against race condition negative balance
      if (Number(updatedWallet.balance) < 0) {
        throw new Error('INSUFFICIENT_BALANCE');
      }

      // 6. Create ledger transaction entry in the exact same DB transaction
      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          idempotencyKey: idempotencyKey || undefined,
          type: 'outflow',
          amount,
          title,
          subtitle,
          status: 'completed'
        }
      });

      return { wallet: updatedWallet, transaction, isDuplicate: false };
    });
  }

  /**
   * 💳 Verified Credit Operation (Payment Settlement Callbacks & System Transfers)
   * Only executed after verified payment gateway settlement or escrow releases.
   */
  static async creditWallet(params: CreditWalletParams) {
    const { userId, amount, title, subtitle, idempotencyKey } = params;

    if (isNaN(amount) || amount <= 0) {
      throw new Error('INVALID_AMOUNT');
    }

    return await prisma.$transaction(async (tx) => {
      if (idempotencyKey) {
        const existingTxn = await tx.transaction.findUnique({
          where: { idempotencyKey }
        });
        if (existingTxn) {
          const currentWallet = await tx.wallet.findUnique({
            where: { id: existingTxn.walletId },
            include: { transactions: { orderBy: { createdAt: 'desc' }, take: 20 } }
          });
          return { wallet: currentWallet, transaction: existingTxn, isDuplicate: true };
        }
      }

      let wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) {
        wallet = await tx.wallet.create({
          data: { userId, balance: 0.00, coins: 100 }
        });
      }

      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: amount }
        }
      });

      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          idempotencyKey: idempotencyKey || undefined,
          type: 'inflow',
          amount,
          title,
          subtitle,
          status: 'completed'
        }
      });

      return { wallet: updatedWallet, transaction, isDuplicate: false };
    });
  }

  /**
   * 🛡️ Escrow Summary Calculation
   */
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
