import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { IPaymentProvider, IPaymentRequest, IPaymentResponse } from './interfaces/PaymentProvider';
import { BkashPaymentProvider } from './providers/bkash.provider';
import { NagadPaymentProvider } from './providers/nagad.provider';
import { SslCommerzPaymentProvider } from './providers/sslcommerz.provider';
import { WalletService } from '../wallet/wallet.service';
import { prisma, db } from '../../config/database';

const bkashProvider = new BkashPaymentProvider();
const nagadProvider = new NagadPaymentProvider();
const sslcommerzProvider = new SslCommerzPaymentProvider();

const providers: Record<string, IPaymentProvider> = {
  bkash: bkashProvider,
  nagad: nagadProvider,
  sslcommerz: sslcommerzProvider
};

export const registerProvider = (provider: IPaymentProvider) => {
  providers[provider.name.toLowerCase()] = provider;
};

// Auxiliary Provider helper for auxiliary payment channels
class AuxiliaryProvider implements IPaymentProvider {
  constructor(public name: string) {}

  async initiate(req: IPaymentRequest): Promise<IPaymentResponse> {
    if (process.env.NODE_ENV === 'production') {
      return {
        transactionId: `AUX-${Date.now()}`,
        status: 'failed',
        provider: this.name,
        isSandbox: false,
        message: `${this.name.toUpperCase()} payment gateway is disabled/unconfigured in production.`
      };
    }
    const tx = `${this.name.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    return {
      transactionId: tx,
      status: 'pending',
      provider: this.name,
      isSandbox: true,
      amount: req.amount,
      currency: req.currency || 'BDT',
      orderId: req.orderId,
      redirectUrl: `/checkout/sandbox-gateway?provider=${this.name}&orderId=${req.orderId}&amount=${req.amount}&tx=${tx}`
    };
  }

  async verify(transactionId: string): Promise<IPaymentResponse> {
    if (process.env.NODE_ENV === 'production') {
      return {
        transactionId,
        status: 'failed',
        provider: this.name,
        isSandbox: false,
        message: 'Verification failed: Auxiliary provider disabled in production.'
      };
    }
    return { transactionId, status: 'success', provider: this.name, isSandbox: true };
  }

  async handleCallback(data: any) {
    if (process.env.NODE_ENV === 'production') {
      return { transactionId: data.tx || 'AUX_TX', status: 'failed', raw: data };
    }
    return { transactionId: data.tx || 'AUX_TX', status: 'success', raw: data };
  }
}

['rocket', 'card', 'bank'].forEach(p => {
  if (!providers[p]) registerProvider(new AuxiliaryProvider(p));
});

/**
 * 💳 GET /api/v1/payment/providers
 * Returns available payment providers and their active status based on server credentials.
 */
export const getPaymentProviders = async (req: AuthenticatedRequest, res: Response) => {
  const isProd = process.env.NODE_ENV === 'production';

  const list = [
    {
      id: 'bkash',
      name: 'bKash (বিকাশ)',
      active: bkashProvider.isConfigured() || !isProd,
      isSandbox: !bkashProvider.isConfigured(),
      supportedCurrencies: ['BDT']
    },
    {
      id: 'nagad',
      name: 'Nagad (নগদ)',
      active: nagadProvider.isConfigured() || !isProd,
      isSandbox: !nagadProvider.isConfigured(),
      supportedCurrencies: ['BDT']
    },
    {
      id: 'sslcommerz',
      name: 'SSLCommerz (Visa/Mastercard/Bank)',
      active: sslcommerzProvider.isConfigured() || !isProd,
      isSandbox: !sslcommerzProvider.isConfigured(),
      supportedCurrencies: ['BDT']
    },
    {
      id: 'rocket',
      name: 'DBBL Rocket (রকেট)',
      active: !isProd,
      isSandbox: true,
      supportedCurrencies: ['BDT']
    }
  ];

  return res.json({ success: true, providers: list });
};

/**
 * 🚀 POST /api/v1/payment/initiate
 * Validates order ownership and total amount against authoritative server DB record.
 */
export const initiatePayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authenticated user session required' });
    }

    const { orderId, providerName, customerPhone, callbackUrl } = req.body;
    if (!orderId || !providerName) {
      return res.status(400).json({ error: 'orderId and providerName are required' });
    }

    const providerKey = providerName.toLowerCase();
    const provider = providers[providerKey];
    if (!provider) {
      return res.status(400).json({ error: `Unsupported payment provider: ${providerName}` });
    }

    let authoritativeAmount: number = 0;
    let orderCurrency: string = 'BDT';

    if (db.isConnected()) {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) {
        return res.status(404).json({ error: 'Order not found in database' });
      }

      // Ownership check: User must own the order
      const isOwner = (order.userId && order.userId === userId) || (order.buyerId && order.buyerId === userId);
      if (!isOwner && req.user?.role !== 'super_admin' && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: You do not own this order' });
      }

      if (order.paymentStatus === 'paid') {
        return res.status(400).json({ error: 'Order has already been paid' });
      }

      authoritativeAmount = Number(order.total || order.totalAmount || order.price || 0);
    } else {
      // In dev mode when DB disconnected, require valid numeric amount in body
      authoritativeAmount = Number(req.body.amount || 0);
    }

    if (isNaN(authoritativeAmount) || authoritativeAmount <= 0) {
      return res.status(400).json({ error: 'Invalid order total amount' });
    }

    const response = await provider.initiate({
      orderId,
      amount: authoritativeAmount,
      currency: orderCurrency,
      userId,
      customerPhone,
      callbackUrl
    });

    return res.json(response);
  } catch (error: any) {
    console.error('[Payment Controller] Initiate error:', error);
    return res.status(500).json({ error: 'Payment initiation failed', details: error.message });
  }
};

/**
 * 🔍 POST /api/v1/payment/verify
 * Validates server-to-server transaction status and verifies amount matching against DB order.
 */
export const verifyPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Authenticated user session required' });
    }

    const { transactionId, providerName, orderId } = req.body;
    if (!transactionId || !providerName) {
      return res.status(400).json({ error: 'transactionId and providerName are required' });
    }

    const providerKey = providerName.toLowerCase();
    const provider = providers[providerKey];
    if (!provider) {
      return res.status(400).json({ error: 'Unsupported payment provider' });
    }

    if (db.isConnected() && orderId) {
      const dbOrder = await prisma.order.findUnique({ where: { id: orderId } });
      if (dbOrder && dbOrder.paymentStatus === 'paid') {
        return res.json({
          success: true,
          status: 'success',
          message: 'Order already verified and paid.',
          isDuplicate: true
        });
      }
    }

    // Server-to-server verification with provider
    const verifyResponse = await provider.verify(transactionId);

    if (verifyResponse.status !== 'success') {
      return res.status(400).json({
        success: false,
        status: 'failed',
        message: verifyResponse.message || 'Payment verification failed at provider'
      });
    }

    // Atomic DB Order & Ledger update if DB connected and orderId provided
    if (db.isConnected() && orderId) {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (order) {
        const orderAmount = Number(order.total || order.totalAmount || order.price || 0);

        // Verify provider verified amount matches DB order amount
        if (verifyResponse.amount && Math.abs(verifyResponse.amount - orderAmount) > 0.01) {
          return res.status(400).json({
            error: `Payment amount mismatch. Verified: ${verifyResponse.amount} BDT, Expected: ${orderAmount} BDT`,
            code: 'AMOUNT_MISMATCH'
          });
        }

        if (order.paymentStatus !== 'paid') {
          await prisma.$transaction([
            prisma.order.update({
              where: { id: order.id },
              data: {
                paymentStatus: 'paid',
                status: 'processing'
              }
            }),
            prisma.escrow.create({
              data: {
                orderId: order.id,
                amount: orderAmount,
                status: 'held',
                releaseAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              }
            })
          ]);
        }
      }
    }

    return res.json({
      success: true,
      status: 'success',
      transactionId: verifyResponse.transactionId,
      provider: providerKey,
      isSandbox: verifyResponse.isSandbox
    });
  } catch (error: any) {
    console.error('[Payment Controller] Verification error:', error);
    return res.status(500).json({ error: 'Payment verification failed' });
  }
};

/**
 * 📲 POST /api/v1/payment/callback/:provider
 * Handles webhook IPNs. Performs server-to-server verification before updating state.
 * Never trusts unverified raw request body data.
 */
export const handlePaymentCallback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const providerName = (req.params.provider || '').toLowerCase();
    const provider = providers[providerName];

    if (!provider) {
      return res.status(400).json({ error: 'Unsupported provider callback' });
    }

    // 1. Process raw callback payload
    const callbackData = await provider.handleCallback(req.body || req.query);

    if (callbackData.status !== 'success' || !callbackData.transactionId) {
      return res.status(400).json({
        status: 'failed',
        message: 'Payment provider callback reported failure or missing transaction ID'
      });
    }

    // 2. Perform official server-to-server verification with provider
    const verifiedResponse = await provider.verify(callbackData.transactionId);
    if (verifiedResponse.status !== 'success') {
      return res.status(400).json({
        status: 'failed',
        message: 'Server-to-server payment verification failed'
      });
    }

    const targetOrderId = verifiedResponse.orderId || callbackData.orderId || req.query?.orderId || req.body?.orderId;

    // 3. Process order update if order ID is identified
    if (db.isConnected() && targetOrderId) {
      const order = await prisma.order.findUnique({ where: { id: targetOrderId } });

      if (order) {
        const expectedAmount = Number(order.total || order.totalAmount || order.price || 0);

        if (verifiedResponse.amount && Math.abs(verifiedResponse.amount - expectedAmount) > 0.01) {
          return res.status(400).json({
            error: `Callback payment amount mismatch. Verified: ${verifiedResponse.amount}, Expected: ${expectedAmount}`,
            code: 'AMOUNT_MISMATCH'
          });
        }

        // Idempotency: skip if already marked paid
        if (order.paymentStatus === 'paid') {
          return res.json({
            status: 'received',
            message: 'Callback received and order already marked paid.',
            isDuplicate: true
          });
        }

        await prisma.$transaction([
          prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'paid',
              status: 'processing'
            }
          }),
          prisma.escrow.create({
            data: {
              orderId: order.id,
              amount: expectedAmount,
              status: 'held',
              releaseAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
          })
        ]);
      }
    }

    return res.json({
      status: 'received',
      transactionId: verifiedResponse.transactionId,
      verified: true
    });
  } catch (error: any) {
    console.error('[Payment Callback] Error:', error);
    return res.status(500).json({ error: 'Callback processing failed', details: error.message });
  }
};
