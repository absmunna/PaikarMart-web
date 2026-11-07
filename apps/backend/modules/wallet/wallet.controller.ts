import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { WalletService } from './wallet.service';
import { db } from '../../config/database';

/**
 * 👛 GET /api/v1/wallet
 * Fetches authenticated user's wallet & recent transactions.
 * Never reads x-user-id header or returns fake demo balances.
 */
export const getWallet = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authenticated session required' });
    }

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Wallet service unavailable. Database connection offline.' });
    }

    const wallet = await WalletService.getOrCreateWallet(userId);
    return res.json(wallet);
  } catch (error: any) {
    console.error('Fetch Wallet Error:', error);
    return res.status(500).json({ error: 'Failed to fetch wallet information' });
  }
};

/**
 * 💳 POST /api/v1/wallet/add-money
 * Requires verified payment settlement. Prevents arbitrary client-side balance incrementing.
 */
export const addMoney = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authenticated session required' });
    }

    const { amount, paymentRef, gatewayTransactionId } = req.body;
    const amt = parseFloat(amount);

    if (isNaN(amt) || amt <= 0 || amt > 500000) {
      return res.status(400).json({ error: 'Invalid add-money amount' });
    }

    // Direct client balance addition is disabled in production without payment settlement verification
    const isGatewayConfigured = Boolean(process.env.BKASH_APP_KEY || process.env.SSLCOMMERZ_STORE_ID || process.env.PAYMENT_WEBHOOK_SECRET);
    
    if (!isGatewayConfigured && !paymentRef && !gatewayTransactionId) {
      return res.status(501).json({
        error: 'Direct unverified add-money is disabled. Verified payment gateway settlement (bKash/Nagad/SSLCommerz) is required.',
        code: 'PAYMENT_GATEWAY_REQUIRED'
      });
    }

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Database service offline. Payment processing disabled.' });
    }

    // Process credit only if verified settlement reference is provided
    const idempotencyKey = (req.headers['x-idempotency-key'] || req.body.idempotencyKey || paymentRef || gatewayTransactionId) as string | undefined;

    const result = await WalletService.creditWallet({
      userId,
      amount: amt,
      title: 'অ্যাড মানি (Add Money)',
      subtitle: paymentRef ? `Ref: ${paymentRef}` : 'Verified Payment Gateway Settlement',
      idempotencyKey
    });

    return res.json({
      success: true,
      wallet: result.wallet,
      transaction: result.transaction,
      isDuplicate: result.isDuplicate
    });
  } catch (error: any) {
    console.error('Add Money Error:', error);
    return res.status(500).json({ error: 'Failed to process add money transaction' });
  }
};

/**
 * 💸 POST /api/v1/wallet/send-money
 * Enforces atomic balance check & debit inside a single DB transaction with idempotency protection.
 */
export const sendMoney = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authenticated session required' });
    }

    const { amount, phone } = req.body;
    const amt = parseFloat(amount);

    if (isNaN(amt) || amt <= 0 || amt > 100000) {
      return res.status(400).json({ error: 'সহিহ টাকার পরিমাণ প্রদান করুন (১ থেকে ১,০০,০০০ টাকা)' });
    }

    const cleanedPhone = (phone || '').toString().trim();
    const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!cleanedPhone || !bdPhoneRegex.test(cleanedPhone)) {
      return res.status(400).json({ error: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন (যেমন: 01700000000)' });
    }

    if (req.user?.phone && req.user.phone === cleanedPhone) {
      return res.status(400).json({ error: 'নিজের নম্বরে টাকা পাঠানো সম্ভব নয়' });
    }

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Database service offline. Transaction aborted.' });
    }

    const idempotencyKey = (req.headers['x-idempotency-key'] || req.body.idempotencyKey) as string | undefined;

    try {
      const result = await WalletService.debitWallet({
        userId,
        amount: amt,
        title: 'টাকা পাঠান (Send Money)',
        subtitle: `নম্বর: ${cleanedPhone}`,
        idempotencyKey
      });

      return res.json({
        success: true,
        wallet: result.wallet,
        transaction: result.transaction,
        isDuplicate: result.isDuplicate
      });
    } catch (err: any) {
      if (err.message === 'INSUFFICIENT_BALANCE') {
        return res.status(400).json({ error: 'পর্যাপ্ত ওয়ালেট ব্যালেন্স নেই' });
      }
      throw err;
    }
  } catch (error: any) {
    console.error('Send Money Error:', error);
    return res.status(500).json({ error: 'টাকা পাঠানো সম্পন্ন করা যায়নি' });
  }
};

/**
 * 📱 POST /api/v1/wallet/recharge
 * Enforces atomic balance check, operator validation, and idempotency protection.
 */
export const rechargeMobile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authenticated session required' });
    }

    const { amount, phone, operator, provider } = req.body;
    const amt = parseFloat(amount);
    const selectedOperator = (operator || provider || '').toString().trim();

    if (isNaN(amt) || amt < 10 || amt > 5000) {
      return res.status(400).json({ error: 'সহিহ রিচার্জ পরিমাণ প্রদান করুন (১০ থেকে ৫,০০০ টাকা)' });
    }

    const cleanedPhone = (phone || '').toString().trim();
    const bdPhoneRegex = /^(?:\+8801|01)[3-9]\d{8}$/;
    if (!cleanedPhone || !bdPhoneRegex.test(cleanedPhone)) {
      return res.status(400).json({ error: 'সঠিক মোবাইল নম্বর প্রদান করুন' });
    }

    const validOperators = ['GP', 'Robi', 'Banglalink', 'Teletalk', 'Airtel', 'Grameenphone'];
    if (!selectedOperator || !validOperators.some(op => op.toLowerCase() === selectedOperator.toLowerCase())) {
      return res.status(400).json({ error: 'সঠিক মোবাইল অপারেটর নির্বাচন করুন (GP, Robi, Banglalink, Teletalk, Airtel)' });
    }

    // Telecom API gateway requirement check in production
    const isTopupGatewayConfigured = Boolean(process.env.TOPUP_API_KEY || process.env.TELECOM_GATEWAY_URL);
    if (process.env.NODE_ENV === 'production' && !isTopupGatewayConfigured) {
      return res.status(501).json({
        error: 'মোবাইল রিচার্জ সুবিধা পেতে টেলিকম অপারেটর গেটওয়ে কনফিগারেশন প্রয়োজন।',
        code: 'TELECOM_GATEWAY_REQUIRED'
      });
    }

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Database service offline. Recharge aborted.' });
    }

    const idempotencyKey = (req.headers['x-idempotency-key'] || req.body.idempotencyKey) as string | undefined;

    try {
      const result = await WalletService.debitWallet({
        userId,
        amount: amt,
        title: `মোবাইল রিচার্জ (${selectedOperator.toUpperCase()})`,
        subtitle: `নম্বর: ${cleanedPhone}`,
        idempotencyKey
      });

      return res.json({
        success: true,
        wallet: result.wallet,
        transaction: result.transaction,
        isDuplicate: result.isDuplicate
      });
    } catch (err: any) {
      if (err.message === 'INSUFFICIENT_BALANCE') {
        return res.status(400).json({ error: 'পর্যাপ্ত ওয়ালেট ব্যালেন্স নেই' });
      }
      throw err;
    }
  } catch (error: any) {
    console.error('Mobile Recharge Error:', error);
    return res.status(500).json({ error: 'মোবাইল রিচার্জ সম্পন্ন করা যায়নি' });
  }
};

/**
 * 🏧 POST /api/v1/wallet/withdraw
 * Debit wallet for cashout request.
 */
export const withdrawMoney = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authenticated session required' });
    }

    const { amount, method, accountDetails } = req.body;
    const amt = parseFloat(amount);

    if (isNaN(amt) || amt < 100 || amt > 50000) {
      return res.status(400).json({ error: 'সহিহ উইথড্র পরিমাণ প্রদান করুন (১০০ থেকে ৫০,০০০ টাকা)' });
    }

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Database service offline. Withdrawal aborted.' });
    }

    const idempotencyKey = (req.headers['x-idempotency-key'] || req.body.idempotencyKey) as string | undefined;

    try {
      const result = await WalletService.debitWallet({
        userId,
        amount: amt,
        title: `ক্যাশআউট উইথড্র (${method || 'bKash'})`,
        subtitle: accountDetails ? `অ্যাকাউন্ট: ${accountDetails}` : 'মোবাইল/ব্যাংক উইথড্র',
        idempotencyKey
      });

      return res.json({
        success: true,
        wallet: result.wallet,
        transaction: result.transaction,
        isDuplicate: result.isDuplicate
      });
    } catch (err: any) {
      if (err.message === 'INSUFFICIENT_BALANCE') {
        return res.status(400).json({ error: 'পর্যাপ্ত ওয়ালেট ব্যালেন্স নেই' });
      }
      throw err;
    }
  } catch (error: any) {
    console.error('Withdraw Money Error:', error);
    return res.status(500).json({ error: 'উইথড্র রিকোয়েস্ট সম্পন্ন করা যায়নি' });
  }
};

/**
 * 📜 GET /api/v1/wallet/transactions
 */
export const getTransactions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authenticated session required' });
    }

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Database service offline.' });
    }

    const wallet = await WalletService.getOrCreateWallet(userId);
    return res.json({
      success: true,
      transactions: wallet.transactions || []
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
};

/**
 * 🔒 GET /api/v1/wallet/escrow
 */
export const getEscrow = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authenticated session required' });
    }

    if (!db.isConnected()) {
      return res.status(503).json({ error: 'Database service offline.' });
    }

    const summary = await WalletService.getEscrowSummary(userId);
    return res.json({
      success: true,
      escrow: summary
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch escrow summary' });
  }
};
