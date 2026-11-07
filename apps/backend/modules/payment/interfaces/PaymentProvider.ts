export interface IPaymentRequest {
  orderId: string;
  amount: number;
  currency?: string;
  userId: string;
  description?: string;
  customerPhone?: string;
  callbackUrl?: string;
}

export interface IPaymentResponse {
  transactionId: string;
  redirectUrl?: string; // For web-based gateways
  paymentId?: string;
  status: 'pending' | 'success' | 'failed';
  provider?: string;
  isSandbox?: boolean;
  message?: string;
  amount?: number;
  currency?: string;
  orderId?: string;
}

export interface IPaymentCallback {
  transactionId: string;
  status: string;
  amount?: number;
  currency?: string;
  orderId?: string;
  raw: any;
}

export interface IPaymentProvider {
  name: string;
  initiate(req: IPaymentRequest): Promise<IPaymentResponse>;
  verify(transactionId: string): Promise<IPaymentResponse>;
  handleCallback(data: any): Promise<IPaymentCallback>;
}
