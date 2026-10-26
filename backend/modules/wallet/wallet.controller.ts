import { Request, Response } from 'express';
import { prisma } from '../../config/database';

// Helper to get or create demo user & wallet in DB
async function getOrCreateDemoWallet(userId: string) {
  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true }
  });

  if (!user) {
    // Attempt to grab any existing user, or create a demo one
    let firstUser = await prisma.user.findFirst({
      include: { wallet: true }
    });

    if (firstUser) {
      user = firstUser;
    } else {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: 'munna@paikarmart.com',
          name: 'MD MUNNA',
          password: 'demo-password',
          role: 'seller'
        },
        include: { wallet: true }
      });
    }
  }

  if (!user.wallet) {
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 45280.00,
        coins: 2500
      }
    });
    
    // Seed standard initial transactions
    await prisma.transaction.createMany({
      data: [
        {
          walletId: wallet.id,
          type: 'inflow',
          title: 'রেফারেল বোনাস (Referral Bonus)',
          subtitle: 'পাইকার মার্ট রেফারেল ক্যাম্পেইন',
          amount: 500.00,
          status: 'completed'
        },
        {
          walletId: wallet.id,
          type: 'outflow',
          title: 'পণ্য ক্রয় (Order Purchase)',
          subtitle: 'অর্ডার আইডি #PM-88210',
          amount: 3200.00,
          status: 'completed'
        }
      ]
    });

    return await prisma.wallet.findUnique({
      where: { id: wallet.id },
      include: { transactions: { orderBy: { createdAt: 'desc' } } }
    });
  }

  return await prisma.wallet.findUnique({
    where: { id: user.wallet.id },
    include: { transactions: { orderBy: { createdAt: 'desc' } } }
  });
}

export const getWallet = async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'dev-munna-id';

    if (!process.env.DATABASE_URL) {
      // Dev mode mock fallback
      return res.json({
        id: 'w_demo_id',
        userId,
        balance: 45280.00,
        coins: 2500,
        transactions: [
          {
            id: 'TXN10293',
            type: 'inflow',
            title: 'রেফারেল বোনাস (Referral Bonus)',
            subtitle: 'পাইকার মার্ট রেফারেল ক্যাম্পেইন',
            amount: 500,
            date: '১৯ মে ২০২৬, সকাল ১০:১৫',
            status: 'completed'
          },
          {
            id: 'TXN10292',
            type: 'outflow',
            title: 'পণ্য ক্রয় (Order Purchase)',
            subtitle: 'অর্ডার আইডি #PM-88210',
            amount: 3200,
            date: '১৮ মে ২০২৬, বিকাল ৪:৩০',
            status: 'completed'
          }
        ]
      });
    }

    const wallet = await getOrCreateDemoWallet(userId);
    res.json(wallet);
  } catch (error) {
    console.error('Fetch Wallet Error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
};

export const addMoney = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = req.headers['x-user-id'] as string || 'dev-munna-id';
    const amt = parseFloat(amount);

    if (isNaN(amt) || amt <= 0) {
      return res.status(400).json({ error: 'Invalid amount value' });
    }

    if (!process.env.DATABASE_URL) {
      return res.json({
        success: true,
        transaction: {
          id: `TXN${Math.floor(10000 + Math.random() * 90000)}`,
          type: 'inflow',
          title: 'অ্যাড মানি (Add Money via bKash)',
          subtitle: 'bKash Wallet Direct',
          amount: amt,
          status: 'completed',
          date: 'এখনই সম্পন্ন হয়েছে'
        }
      });
    }

    const wallet = await getOrCreateDemoWallet(userId);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

    // Update wallet balance in DB
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: amt }
      }
    });

    // Create transaction in DB
    const txn = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'inflow',
        title: 'অ্যাড মানি (Add Money via bKash)',
        subtitle: 'bKash Wallet Direct',
        amount: amt,
        status: 'completed'
      }
    });

    res.json({ success: true, wallet: updatedWallet, transaction: txn });
  } catch (error) {
    console.error('Add Money Error:', error);
    res.status(500).json({ error: 'Failed to process add money' });
  }
};

export const sendMoney = async (req: Request, res: Response) => {
  try {
    const { amount, phone } = req.body;
    const userId = req.headers['x-user-id'] as string || 'dev-munna-id';
    const amt = parseFloat(amount);

    if (isNaN(amt) || amt <= 0) {
      return res.status(400).json({ error: 'Invalid amount value' });
    }

    if (!process.env.DATABASE_URL) {
      return res.json({
        success: true,
        transaction: {
          id: `TXN${Math.floor(10000 + Math.random() * 90000)}`,
          type: 'outflow',
          title: 'টাকা পাঠান (Send Money)',
          subtitle: `নম্বর: ${phone || 'unknown'}`,
          amount: amt,
          status: 'completed',
          date: 'এখনই সম্পন্ন হয়েছে'
        }
      });
    }

    const wallet = await getOrCreateDemoWallet(userId);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

    if (Number(wallet.balance) < amt) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Deduct wallet balance in DB
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amt }
      }
    });

    // Create transaction in DB
    const txn = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'outflow',
        title: 'টাকা পাঠান (Send Money)',
        subtitle: `নম্বর: ${phone || 'unknown'}`,
        amount: amt,
        status: 'completed'
      }
    });

    res.json({ success: true, wallet: updatedWallet, transaction: txn });
  } catch (error) {
    console.error('Send Money Error:', error);
    res.status(500).json({ error: 'Failed to process send money' });
  }
};

export const rechargeMobile = async (req: Request, res: Response) => {
  try {
    const { amount, phone, operator } = req.body;
    const userId = req.headers['x-user-id'] as string || 'dev-munna-id';
    const amt = parseFloat(amount);

    if (isNaN(amt) || amt <= 0) {
      return res.status(400).json({ error: 'Invalid amount value' });
    }

    if (!process.env.DATABASE_URL) {
      return res.json({
        success: true,
        transaction: {
          id: `TXN${Math.floor(10000 + Math.random() * 90000)}`,
          type: 'outflow',
          title: `মোবাইল রিচার্জ (${operator || 'GP'})`,
          subtitle: `নম্বর: ${phone || 'unknown'}`,
          amount: amt,
          status: 'completed',
          date: 'এখনই সম্পন্ন হয়েছে'
        }
      });
    }

    const wallet = await getOrCreateDemoWallet(userId);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

    if (Number(wallet.balance) < amt) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Deduct wallet balance in DB
    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: amt }
      }
    });

    // Create transaction in DB
    const txn = await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'outflow',
        title: `মোবাইল রিচার্জ (${operator || 'GP'})`,
        subtitle: `নম্বর: ${phone || 'unknown'}`,
        amount: amt,
        status: 'completed'
      }
    });

    res.json({ success: true, wallet: updatedWallet, transaction: txn });
  } catch (error) {
    console.error('Mobile Recharge Error:', error);
    res.status(500).json({ error: 'Failed to process mobile recharge' });
  }
};
