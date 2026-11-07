import { IPaymentProvider, IPaymentRequest, IPaymentResponse, IPaymentCallback } from '../interfaces/PaymentProvider';

export class BkashPaymentProvider implements IPaymentProvider {
  public name = 'bkash';

  private appKey: string;
  private appSecret: string;
  private username: string;
  private password: string;
  private baseUrl: string;
  private idToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.appKey = process.env.BKASH_APP_KEY || '';
    this.appSecret = process.env.BKASH_APP_SECRET || '';
    this.username = process.env.BKASH_USERNAME || '';
    this.password = process.env.BKASH_PASSWORD || '';
    this.baseUrl = process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized';
  }

  public isConfigured(): boolean {
    return Boolean(this.appKey && this.appSecret && this.username && this.password);
  }

  /**
   * Acquire or refresh bKash grant token
   */
  private async grantToken(): Promise<string> {
    if (this.idToken && Date.now() < this.tokenExpiresAt) {
      return this.idToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/checkout/token/grant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'username': this.username,
          'password': this.password
        },
        body: JSON.stringify({
          app_key: this.appKey,
          app_secret: this.appSecret
        })
      });

      const data = await response.json();
      if (data.id_token) {
        this.idToken = data.id_token;
        this.tokenExpiresAt = Date.now() + 3500 * 1000; // ~1 hour
        return this.idToken;
      }
      throw new Error(data.statusMessage || 'Failed to acquire bKash token');
    } catch (err: any) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`bKash Token Grant Error: ${err.message}`);
      }
      this.idToken = 'sandbox_bkash_token';
      return this.idToken;
    }
  }

  /**
   * Create bKash payment request
   */
  async initiate(req: IPaymentRequest): Promise<IPaymentResponse> {
    const txId = `BKASH-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (!this.isConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        return {
          transactionId: txId,
          status: 'failed',
          provider: 'bkash',
          isSandbox: false,
          message: 'bKash payment gateway is disabled/unconfigured in production environment.'
        };
      }
      // Sandbox mode in non-production environments
      return {
        transactionId: txId,
        paymentId: `BK_${Math.random().toString(36).substring(7).toUpperCase()}`,
        status: 'pending',
        provider: 'bkash',
        isSandbox: true,
        amount: req.amount,
        currency: req.currency || 'BDT',
        orderId: req.orderId,
        message: 'বিকাশ স্যান্ডবক্স গেটওয়েতে লেনদেন শুরু হয়েছে',
        redirectUrl: `/checkout/sandbox-gateway?provider=bkash&orderId=${req.orderId}&amount=${req.amount}&tx=${txId}`
      };
    }

    try {
      const token = await this.grantToken();
      const response = await fetch(`${this.baseUrl}/checkout/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
          'X-APP-Key': this.appKey
        },
        body: JSON.stringify({
          mode: '0011',
          payerReference: req.customerPhone || '01700000000',
          callbackURL: req.callbackUrl || `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/payment/callback/bkash`,
          amount: req.amount.toString(),
          currency: req.currency || 'BDT',
          intent: 'sale',
          merchantInvoiceNumber: req.orderId
        })
      });

      const data = await response.json();
      if (data.paymentID && data.bkashURL) {
        return {
          transactionId: txId,
          paymentId: data.paymentID,
          redirectUrl: data.bkashURL,
          status: 'pending',
          provider: 'bkash',
          isSandbox: false,
          amount: req.amount,
          currency: req.currency || 'BDT',
          orderId: req.orderId
        };
      }

      return {
        transactionId: txId,
        status: 'failed',
        provider: 'bkash',
        message: data.statusMessage || 'bKash session creation failed'
      };
    } catch (error: any) {
      console.error('[bKash Provider] Initiate error:', error);
      return {
        transactionId: txId,
        status: 'failed',
        provider: 'bkash',
        message: error.message || 'Payment provider communication error'
      };
    }
  }

  /**
   * Execute/Verify bKash payment
   */
  async verify(transactionId: string): Promise<IPaymentResponse> {
    if (!this.isConfigured()) {
      if (process.env.NODE_ENV === 'production') {
        return {
          transactionId,
          status: 'failed',
          provider: 'bkash',
          isSandbox: false,
          message: 'Verification failed: bKash credentials missing in production.'
        };
      }
      // Non-production sandbox mock verification
      return {
        transactionId,
        status: 'success',
        provider: 'bkash',
        isSandbox: true,
        message: 'বিকাশ স্যান্ডবক্স ভেরিফিকেশন সম্পন্ন'
      };
    }

    try {
      const token = await this.grantToken();
      const response = await fetch(`${this.baseUrl}/checkout/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
          'X-APP-Key': this.appKey
        },
        body: JSON.stringify({ paymentID: transactionId })
      });

      const data = await response.json();
      if (data.transactionStatus === 'Completed') {
        return {
          transactionId: data.trxID || transactionId,
          paymentId: data.paymentID || transactionId,
          status: 'success',
          provider: 'bkash',
          isSandbox: false,
          amount: data.amount ? parseFloat(data.amount) : undefined,
          currency: data.currency || 'BDT',
          orderId: data.merchantInvoiceNumber
        };
      }

      return {
        transactionId,
        status: 'failed',
        provider: 'bkash',
        message: data.statusMessage || 'Payment execution failed'
      };
    } catch (err: any) {
      console.error('[bKash Provider] Verify error:', err);
      return {
        transactionId,
        status: 'failed',
        provider: 'bkash',
        message: err.message || 'Verification service error'
      };
    }
  }

  /**
   * Handle bKash IPN / webhook callback
   */
  async handleCallback(data: any): Promise<IPaymentCallback> {
    const paymentId = data.paymentID || data.paymentId || 'UNKNOWN';
    const status = data.status === 'success' || data.transactionStatus === 'Completed' ? 'success' : 'failed';
    const amount = data.amount ? parseFloat(data.amount) : undefined;
    const orderId = data.merchantInvoiceNumber || data.orderId;

    return {
      transactionId: data.trxID || paymentId,
      status,
      amount,
      currency: data.currency || 'BDT',
      orderId,
      raw: data
    };
  }
}
