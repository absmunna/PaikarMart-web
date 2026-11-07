import { IPaymentProvider, IPaymentRequest, IPaymentResponse, IPaymentCallback } from '../interfaces/PaymentProvider';

export class NagadPaymentProvider implements IPaymentProvider {
  public name = 'nagad';

  private merchantId: string;
  private merchantPrivateKey: string;
  private nagadPublicKey: string;
  private baseUrl: string;

  constructor() {
    this.merchantId = process.env.NAGAD_MERCHANT_ID || '';
    this.merchantPrivateKey = process.env.NAGAD_MERCHANT_PRIVATE_KEY || '';
    this.nagadPublicKey = process.env.NAGAD_PG_PUBLIC_KEY || '';
    this.baseUrl = process.env.NAGAD_BASE_URL || 'https://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs';
  }

  public isConfigured(): boolean {
    return Boolean(this.merchantId && this.merchantPrivateKey);
  }

  async initiate(req: IPaymentRequest): Promise<IPaymentResponse> {
    const txId = `NAGAD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (!this.isConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        return {
          transactionId: txId,
          status: 'failed',
          provider: 'nagad',
          isSandbox: false,
          message: 'Nagad payment gateway is disabled/unconfigured in production environment.'
        };
      }
      return {
        transactionId: txId,
        paymentId: `NG_${Math.random().toString(36).substring(7).toUpperCase()}`,
        status: 'pending',
        provider: 'nagad',
        isSandbox: true,
        amount: req.amount,
        currency: req.currency || 'BDT',
        orderId: req.orderId,
        message: 'নগদ অনলাইন গেটওয়েতে লেনদেন শুরু হয়েছে',
        redirectUrl: `/checkout/sandbox-gateway?provider=nagad&orderId=${req.orderId}&amount=${req.amount}&tx=${txId}`
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/check-out/initialize/${this.merchantId}/${req.orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-KM-Api-Version': 'v-0.2.0',
          'X-KM-IP-V4': '127.0.0.1',
          'X-KM-Client-Type': 'PC_WEB'
        },
        body: JSON.stringify({
          dateTime: new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14),
          sensitiveData: `orderId=${req.orderId}&amount=${req.amount}`,
          signature: 'nagad_signature_hash'
        })
      });

      const data = await response.json();
      if (data.callBackUrl) {
        return {
          transactionId: txId,
          paymentId: data.paymentReferenceId || txId,
          redirectUrl: data.callBackUrl,
          status: 'pending',
          provider: 'nagad',
          isSandbox: false,
          amount: req.amount,
          currency: req.currency || 'BDT',
          orderId: req.orderId
        };
      }

      return {
        transactionId: txId,
        status: 'failed',
        provider: 'nagad',
        message: data.message || 'Nagad session initialization failed'
      };
    } catch (error: any) {
      console.error('[Nagad Provider] Initiate error:', error);
      return {
        transactionId: txId,
        status: 'failed',
        provider: 'nagad',
        message: error.message || 'Payment provider communication error'
      };
    }
  }

  async verify(transactionId: string): Promise<IPaymentResponse> {
    if (!this.isConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        return {
          transactionId,
          status: 'failed',
          provider: 'nagad',
          isSandbox: false,
          message: 'Verification failed: Nagad credentials missing in production.'
        };
      }
      return {
        transactionId,
        status: 'success',
        provider: 'nagad',
        isSandbox: true,
        message: 'নগদ স্যান্ডবক্স ভেরিফিকেশন সম্পন্ন'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/verify/payment/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-KM-Api-Version': 'v-0.2.0'
        }
      });
      const data = await response.json();
      if (data.status === 'Success') {
        return {
          transactionId: data.issuerPaymentRefNo || transactionId,
          paymentId: data.paymentReferenceId || transactionId,
          status: 'success',
          provider: 'nagad',
          isSandbox: false,
          amount: data.amount ? parseFloat(data.amount) : undefined,
          currency: data.currency || 'BDT',
          orderId: data.orderId
        };
      }
      return {
        transactionId,
        status: 'failed',
        provider: 'nagad',
        message: data.message || 'Nagad verification failed'
      };
    } catch (err: any) {
      return {
        transactionId,
        status: 'failed',
        provider: 'nagad',
        message: err.message || 'Verification service error'
      };
    }
  }

  async handleCallback(data: any): Promise<IPaymentCallback> {
    const status = data.status === 'Success' || data.payment_ref_id ? 'success' : 'failed';
    const amount = data.amount ? parseFloat(data.amount) : undefined;
    const orderId = data.order_id || data.orderId;

    return {
      transactionId: data.payment_ref_id || data.issuer_payment_ref || 'UNKNOWN_TX',
      status,
      amount,
      currency: data.currency || 'BDT',
      orderId,
      raw: data
    };
  }
}
