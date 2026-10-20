import axios from 'axios';
import { PortalCategory, PortalProduct, RFQSubmission, PortalDomain } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const portalsApi = {
  /**
   * Fetches dynamic portal modules metadata
   */
  getCategories: async (): Promise<PortalCategory[]> => {
    const response = await axios.get(`${API_BASE_URL}/portals/categories`);
    return response.data;
  },

  /**
   * Fetches portal-specific listings with MOQ/Location/Digital filters
   */
  getProducts: async (portalType: PortalDomain, params?: any): Promise<PortalProduct[]> => {
    const response = await axios.get(`${API_BASE_URL}/portals/${portalType.toLowerCase()}/products`, { params });
    return response.data;
  },

  /**
   * Submits B2B bulk request for quote
   */
  submitRFQ: async (rfqData: RFQSubmission): Promise<{ success: boolean; rfqId: string }> => {
    const response = await axios.post(`${API_BASE_URL}/portals/rfq/submit`, rfqData);
    return response.data;
  }
};
