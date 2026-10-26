import axios from 'axios';
import { WalletTransaction } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const walletApi = {
  /**
   * Fetches current wallet balances and transaction history
   */
  getWalletData: async () => {
    const response = await axios.get(`${API_BASE_URL}/wallet/balance`);
    return response.data; // { balance: number, coins: number, transactions: [] }
  },

  /**
   * Initiates a top-up request (Redirects to MFS or returns payment link)
   */
  topUp: async (amount: number, method: 'bkash' | 'nagad' | 'rocket') => {
    const response = await axios.post(`${API_BASE_URL}/wallet/topup`, { amount, method });
    return response.data; // { success: true, paymentUrl: string }
  },

  /**
   * Request a withdrawal (for sellers or eligible users)
   */
  withdraw: async (amount: number, method: string, accountDetails: any) => {
    const response = await axios.post(`${API_BASE_URL}/wallet/withdraw`, { amount, method, accountDetails });
    return response.data;
  },

  /**
   * Fetches transaction history with pagination
   */
  getTransactions: async (page = 1, limit = 10) => {
    const response = await axios.get(`${API_BASE_URL}/wallet/transactions`, { params: { page, limit } });
    return response.data as WalletTransaction[];
  }
};
