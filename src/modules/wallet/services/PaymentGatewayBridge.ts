import { apiClient } from "@/modules/app/api/client";
import { toast } from "sonner";

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'upay' | 'card' | 'bank';

export interface PaymentRequest {
  amount: number;
  method: PaymentMethod;
  reference?: string;
  metadata?: any;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
  error?: string;
}

export class PaymentGatewayBridge {
  /**
   * Unified interface for payment initiation.
   * Calls the backend to securely handle API keys and provider logic.
   */
  static async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    console.log(`[PaymentBridge] Initiating ${request.method} payment for ৳${request.amount}`);
    
    try {
      const response = await apiClient.post(`/payment/initiate`, {
        providerName: request.method,
        amount: request.amount,
        orderId: request.reference || `ORDER-${Date.now()}`,
      });

      if (response.data && response.data.status === 'pending' || response.data.status === 'success') {
        const txId = response.data.transactionId;
        
        if (response.data.redirectUrl) {
          toast.info("Redirecting to secure payment gateway...");
          // In a real app: window.location.href = response.data.redirectUrl;
          // For simulation, we'll wait and then return success
        }

        return {
          success: true,
          transactionId: txId,
          redirectUrl: response.data.redirectUrl
        };
      }

      return { success: false, error: response.data.error || 'Failed to initiate payment' };
    } catch (error: any) {
      console.error('[PaymentBridge] Error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Payment service unavailable' 
      };
    }
  }

  static async initiateWithdrawal(request: PaymentRequest): Promise<PaymentResponse> {
    console.log(`[PaymentBridge] Initiating withdrawal to ${request.method} for ৳${request.amount}`);
    
    try {
      // Simulate backend call for withdrawal
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTxId = `WD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      return {
        success: true,
        transactionId: mockTxId
      };
    } catch (error) {
      return { success: false, error: 'Withdrawal failed' };
    }
  }
}
