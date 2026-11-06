import { IPaymentProvider, IPaymentRequest, IPaymentResponse, IPaymentCallback } from '../interfaces/PaymentProvider';

export class SslCommerzPaymentProvider implements IPaymentProvider {
  public name = 'sslcommerz';

  private storeId: string;
  private storePassword: string;
  private isLive: boolean;
  private baseUrl: string;

  constructor() {
    this.storeId = process.env.SSLCOMMERZ_STORE_ID || '';
    this.storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || '';
    this.isLive = process.env.SSLCOMMERZ_IS_LIVE === 'true';
    this.baseUrl = this.isLive
      ? 'https://securepay.sslcommerz.com'
      : 'https://sandbox.sslcommerz.com';
  }

  private isConfigured(): boolean {
    return Boolean(this.storeId && this.storePassword);
  }

  async initiate(req: IPaymentRequest): Promise<IPaymentResponse> {
    const tranId = `PKM-SSL-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (!this.isConfigured()) {
      console.log(`[SSLCommerz Provider] Initiated in SANDBOX mode for Order: ${req.orderId}, Amount: ${req.amount} BDT`);
      return {
        transactionId: tranId,
        paymentId: `SSL_${Math.random().toString(36).substring(7).toUpperCase()}`,
        status: 'pending',
        provider: 'sslcommerz',
        isSandbox: true,
        message: 'SSLCommerz কার্ড ও নেট ব্যাংকিং গেটওয়ে সেশন প্রস্তুত হয়েছে',
        redirectUrl: `/checkout/sandbox-gateway?provider=sslcommerz&orderId=${req.orderId}&amount=${req.amount}&tx=${tranId}`
      };
    }

    try {
      const appUrl = process.env.APP_URL || 'https://paikarmart.com';
      const payload: Record<string, string> = {
        store_id: this.storeId,
        store_passwd: this.storePassword,
        total_amount: String(req.amount),
        currency: req.currency || 'BDT',
        tran_id: tranId,
        success_url: req.callbackUrl || `${appUrl}/api/v1/payment/callback/sslcommerz?status=success`,
        fail_url: req.callbackUrl || `${appUrl}/api/v1/payment/callback/sslcommerz?status=fail`,
        cancel_url: req.callbackUrl || `${appUrl}/api/v1/payment/callback/sslcommerz?status=cancel`,
        ipn_url: `${appUrl}/api/v1/payment/callback/sslcommerz?status=ipn`,
        shipping_method: 'Courier',
        product_name: req.description || `Order #${req.orderId}`,
        product_category: 'General',
        product_profile: 'general',
        cus_name: 'Paikar Mart Customer',
        cus_email: 'buyer@paikarmart.com',
        cus_add1: 'Dhaka, Bangladesh',
        cus_city: 'Dhaka',
        cus_postcode: '1200',
        cus_country: 'Bangladesh',
        cus_phone: req.customerPhone || '01700000000',
        ship_name: 'Paikar Mart Logistics',
        ship_add1: 'Dhaka, Bangladesh',
        ship_city: 'Dhaka',
        ship_postcode: '1200',
        ship_country: 'Bangladesh'
      };

      const formData = new URLSearchParams();
      for (const key of Object.keys(payload)) {
        formData.append(key, payload[key]);
      }

      const response = await fetch(`${this.baseUrl}/gwprocess/v4/api.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      const data = await response.json();

      if (data.status === 'SUCCESS' && data.GatewayPageURL) {
        return {
          transactionId: tranId,
          paymentId: data.sessionkey || tranId,
          status: 'pending',
          provider: 'sslcommerz',
          isSandbox: !this.isLive,
          redirectUrl: data.GatewayPageURL,
          message: 'SSLCommerz পেমেন্ট সেশন সফলভাবে তৈরি হয়েছে'
        };
      }

      console.warn('[SSLCommerz Provider] API returned failure status:', data);
      return {
        transactionId: tranId,
        status: 'failed',
        provider: 'sslcommerz',
        message: data.failedreason || 'SSLCommerz session initialization failed'
      };
    } catch (error: any) {
      console.error('[SSLCommerz Provider] Initiation error:', error.message);
      return {
        transactionId: tranId,
        status: 'failed',
        provider: 'sslcommerz',
        message: error.message || 'Payment provider communication error'
      };
    }
  }

  async verify(transactionId: string): Promise<IPaymentResponse> {
    if (!this.isConfigured()) {
      return {
        transactionId,
        status: 'success',
        provider: 'sslcommerz',
        isSandbox: true,
        message: 'SSLCommerz স্যান্ডবক্স ভেরিফিকেশন সফল'
      };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(transactionId)}&store_id=${encodeURIComponent(this.storeId)}&store_passwd=${encodeURIComponent(this.storePassword)}&format=json`
      );
      const data = await response.json();

      if (data.status === 'VALID' || data.status === 'VALIDATED') {
        return {
          transactionId: data.tran_id || transactionId,
          paymentId: data.val_id,
          status: 'success',
          provider: 'sslcommerz',
          isSandbox: !this.isLive,
          message: 'পেমেন্ট সফলভাবে সম্পন্ন ও ভেরিফাইড হয়েছে'
        };
      }

      return {
        transactionId,
        status: 'failed',
        provider: 'sslcommerz',
        message: `পেমেন্ট ভেরিফিকেশন ব্যর্থ হয়েছে (${data.status})`
      };
    } catch (error: any) {
      console.error('[SSLCommerz Provider] Validation error:', error);
      return {
        transactionId,
        status: 'failed',
        provider: 'sslcommerz',
        message: error.message || 'Verification service error'
      };
    }
  }

  async handleCallback(data: any): Promise<IPaymentCallback> {
    const status = data.status === 'VALID' || data.status === 'VALIDATED' || data.status === 'success'
      ? 'success'
      : 'failed';

    return {
      transactionId: data.tran_id || data.tx || 'SSL_TRAN',
      status,
      raw: data
    };
  }
}
