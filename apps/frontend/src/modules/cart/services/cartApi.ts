import axios from 'axios';
import { CartItem, OrderPayload } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const cartApi = {
  /**
   * Fetches the current user's cart from the server
   */
  getCart: async () => {
    const response = await axios.get(`${API_BASE_URL}/cart`);
    return response.data as CartItem[];
  },

  /**
   * Syncs the local cart state with the server
   */
  syncCart: async (items: CartItem[]) => {
    const response = await axios.post(`${API_BASE_URL}/cart/sync`, { items });
    return response.data;
  },

  /**
   * Processes the checkout and creates orders
   */
  processCheckout: async (payload: OrderPayload) => {
    const response = await axios.post(`${API_BASE_URL}/checkout/process`, payload);
    return response.data; // Should return { success: true, orderIds: [] }
  },

  /**
   * Calculates shipping fees dynamically based on address and items
   */
  calculateShipping: async (addressId: string, items: CartItem[]) => {
    const response = await axios.post(`${API_BASE_URL}/checkout/shipping-fee`, { addressId, items });
    return response.data; // { feesPerSeller: { sellerId: amount }, totalShipping: number }
  }
};
