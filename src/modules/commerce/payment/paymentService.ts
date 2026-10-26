export type PaymentGateway = 'bkash' | 'nagad' | 'card' | 'cod';

export const paymentService = {
  processPayment: async (amount: number, gateway: PaymentGateway, orderId: string) => {
    // In real app: call backend to initiate SSLCommerz or bKash PG
    console.log(`Processing ${amount} via ${gateway} for Order ${orderId}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          url: gateway === 'cod' ? null : 'https://payment-mock.paikarmart.com/pay'
        });
      }, 1500);
    });
  }
};
