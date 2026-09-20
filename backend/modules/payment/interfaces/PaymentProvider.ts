export interface IPaymentRequest {
  orderId: string;
  amount: number;
  currency?: string;
  userId: string;
  description?: string;
}

export interface IPaymentResponse {
  transactionId: string;
  redirectUrl?: string; // For web-based gateways
  status: 'pending' | 'success' | 'failed';
}

export interface IPaymentCallback {
  transactionId: string;
  status: string;
  raw: any;
}

export interface IPaymentProvider {
  name: string;
  initiate(req: IPaymentRequest): Promise<IPaymentResponse>;
  verify(transactionId: string): Promise<IPaymentResponse>;
  handleCallback(data: any): Promise<IPaymentCallback>;
}
