import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE_URL = rawBase.replace(/\/+$/, '');

export interface WholesaleQueryParams {
  portal?: string;
  category?: string;
  industry?: string;
  moq_max?: number;
  search?: string;
  verified_only?: boolean;
}

export interface RFQSubmissionPayload {
  productId: string;
  productName: string;
  quantity: number;
  targetPrice?: number;
  deliveryDistrict: string;
  paymentTerms: 'wholesale_credit' | 'lc' | 'bank_transfer' | 'escrow';
  notes?: string;
  buyerName: string;
  buyerPhone: string;
  buyerCompany?: string;
}

export const b2bProductService = {
  getProducts: async (params?: WholesaleQueryParams) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/wholesale/products`, {
        params: {
          portal: 'wholesale',
          ...params
        },
        timeout: 8000
      });
      return response.data;
    } catch (error) {
      console.warn("Wholesale products fetch error, fallback to empty array:", error);
      return [];
    }
  },

  getProductById: async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`, { timeout: 8000 });
      return response.data;
    } catch (error) {
      console.warn("Product by id fetch error:", error);
      return null;
    }
  },

  submitRFQ: async (payload: RFQSubmissionPayload) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/wholesale/rfq`, payload, { timeout: 8000 });
      return response.data;
    } catch (error: any) {
      console.warn("Submit RFQ error:", error);
      throw error;
    }
  },

  getRFQs: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/wholesale/rfq`, { timeout: 8000 });
      return response.data;
    } catch (error) {
      return [];
    }
  },

  respondRFQ: async (id: string, responseData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/wholesale/rfq/${id}/respond`, responseData, { timeout: 8000 });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
