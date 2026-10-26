import { Request, Response } from 'express';
import { IPaymentProvider, IPaymentRequest, IPaymentResponse } from './interfaces/PaymentProvider';
import { WalletService } from '../wallet/wallet.service';

// Placeholder strategy until actual providers are injected
const providers: Record<string, IPaymentProvider> = {};

export const registerProvider = (provider: IPaymentProvider) => {
  providers[provider.name] = provider;
};

// --- Mock Providers for Development ---
class MockProvider implements IPaymentProvider {
  constructor(public name: string) {}
  async initiate(req: IPaymentRequest): Promise<IPaymentResponse> {
    return {
      transactionId: `${this.name.toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      status: 'pending',
      redirectUrl: `https://mock-gateway.com/${this.name}/pay`
    };
  }
  async verify(transactionId: string): Promise<IPaymentResponse> {
    return { transactionId, status: 'success' };
  }
  async handleCallback(data: any) {
    return { transactionId: data.tx, status: 'success', raw: data };
  }
}

// Auto-register common providers in Dev
if (process.env.NODE_ENV !== 'production' || true) {
  ['bkash', 'nagad', 'rocket', 'card', 'bank'].forEach(p => {
    if (!providers[p]) registerProvider(new MockProvider(p));
  });
}

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, providerName, userId } = req.body;
    
    const provider = providers[providerName.toLowerCase()];
    if (!provider) return res.status(400).json({ error: `Unsupported provider: ${providerName}` });

    const response = await provider.initiate({ orderId, amount, userId });
    res.json(response);
  } catch (error: any) {
    console.error('[Payment Controller] Error:', error);
    res.status(500).json({ error: 'Payment initiation failed', details: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { transactionId, providerName } = req.body;
    const provider = providers[providerName.toLowerCase()];
    if (!provider) return res.status(400).json({ error: 'Unsupported provider' });
    
    const response = await provider.verify(transactionId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

export const handlePaymentCallback = async (req: Request, res: Response) => {
  try {
    const providerName = req.params.provider as string;
    const provider = providers[providerName.toLowerCase()];
    
    if (!provider) return res.status(400).json({ error: 'Unsupported provider callback' });

    const callbackData = await provider.handleCallback(req.body);
    
    // Simulate updating wallet if payment was successful
    if (callbackData.status === 'success') {
      // In a real app, we'd look up the user/order associated with the transactionId
      // For simulation, we'll assume a demo user if none found
      const userId = 'dev-munna-id'; 
      const amount = req.body.amount || 1000; // Mock amount if not in body
      
      await WalletService.creditWallet(
        userId, 
        amount, 
        `Payment via ${providerName.toUpperCase()}`, 
        `TxID: ${callbackData.transactionId}`
      );
    }

    res.json({ status: 'received', ...callbackData });
  } catch (error: any) {
    console.error('[Payment Callback] Error:', error);
    res.status(500).json({ error: 'Callback processing failed', details: error.message });
  }
};
