import { Request, Response } from 'express';
import { IPaymentProvider, IPaymentRequest, IPaymentResponse } from './interfaces/PaymentProvider';
import { BkashPaymentProvider } from './providers/bkash.provider';
import { NagadPaymentProvider } from './providers/nagad.provider';
import { WalletService } from '../wallet/wallet.service';

const providers: Record<string, IPaymentProvider> = {};

export const registerProvider = (provider: IPaymentProvider) => {
  providers[provider.name.toLowerCase()] = provider;
};

// Register real bKash and Nagad providers
registerProvider(new BkashPaymentProvider());
registerProvider(new NagadPaymentProvider());

// Helper mock provider for auxiliary methods (rocket, card, bank)
class AuxiliaryProvider implements IPaymentProvider {
  constructor(public name: string) {}
  async initiate(req: IPaymentRequest): Promise<IPaymentResponse> {
    const tx = `${this.name.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    return {
      transactionId: tx,
      status: 'pending',
      provider: this.name,
      isSandbox: true,
      redirectUrl: `/checkout/sandbox-gateway?provider=${this.name}&orderId=${req.orderId}&amount=${req.amount}&tx=${tx}`
    };
  }
  async verify(transactionId: string): Promise<IPaymentResponse> {
    return { transactionId, status: 'success', provider: this.name, isSandbox: true };
  }
  async handleCallback(data: any) {
    return { transactionId: data.tx || 'AUX_TX', status: 'success', raw: data };
  }
}

['rocket', 'card', 'bank'].forEach(p => {
  if (!providers[p]) registerProvider(new AuxiliaryProvider(p));
});

export const getPaymentProviders = async (req: Request, res: Response) => {
  const list = Object.keys(providers).map(key => ({
    id: key,
    name: key === 'bkash' ? 'bKash (বিকাশ)' : key === 'nagad' ? 'Nagad (নগদ)' : key.toUpperCase(),
    active: true,
    supportedCurrencies: ['BDT']
  }));
  res.json({ success: true, providers: list });
};

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, providerName, userId, customerPhone, callbackUrl } = req.body;

    if (!orderId || !amount || !providerName) {
      return res.status(400).json({ error: 'orderId, amount, and providerName are required' });
    }

    const providerKey = providerName.toLowerCase();
    const provider = providers[providerKey];
    if (!provider) {
      return res.status(400).json({ error: `Unsupported payment provider: ${providerName}` });
    }

    const effectiveUserId = userId || (req as any).user?.id || 'guest_buyer';
    const response = await provider.initiate({
      orderId,
      amount: Number(amount),
      userId: effectiveUserId,
      customerPhone,
      callbackUrl
    });

    res.json(response);
  } catch (error: any) {
    console.error('[Payment Controller] Error:', error);
    res.status(500).json({ error: 'Payment initiation failed', details: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { transactionId, providerName } = req.body;
    if (!transactionId || !providerName) {
      return res.status(400).json({ error: 'transactionId and providerName are required' });
    }

    const provider = providers[providerName.toLowerCase()];
    if (!provider) {
      return res.status(400).json({ error: 'Unsupported provider' });
    }

    const response = await provider.verify(transactionId);
    res.json(response);
  } catch (error: any) {
    console.error('[Payment Controller] Verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

export const handlePaymentCallback = async (req: Request, res: Response) => {
  try {
    const providerName = req.params.provider as string;
    const provider = providers[providerName.toLowerCase()];

    if (!provider) {
      return res.status(400).json({ error: 'Unsupported provider callback' });
    }

    const callbackData = await provider.handleCallback(req.body);

    if (callbackData.status === 'success') {
      const userId = (req.body.userId as string) || 'dev-munna-id';
      const amount = Number(req.body.amount) || 1000;

      await WalletService.creditWallet(
        userId,
        amount,
        `Payment via ${providerName.toUpperCase()}`,
        `TxID: ${callbackData.transactionId}`
      ).catch(e => console.warn('Wallet credit in callback:', e));
    }

    res.json({ status: 'received', ...callbackData });
  } catch (error: any) {
    console.error('[Payment Callback] Error:', error);
    res.status(500).json({ error: 'Callback processing failed', details: error.message });
  }
};
