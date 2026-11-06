import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE_URL || '/api';
const API_BASE_URL = rawBase.replace(/\/+$/, '');

export interface ProductQueryParams {
  portal?: string;
  portal_id?: string;
  status?: string;
  category?: string;
  q?: string;
  search?: string;
  limit?: number;
  featured?: boolean;
}

export const fetchProducts = async (params?: ProductQueryParams) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, { 
      params: {
        status: 'active',
        ...params
      },
      timeout: 8000
    });
    return response.data;
  } catch (error) {
    console.warn("fetchProducts API failed, falling back to empty list:", error);
    return [];
  }
};

export const fetchProductById = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/products/${id}`, { timeout: 8000 });
  return response.data;
};

export const createProduct = async (productData: any) => {
  const response = await axios.post(`${API_BASE_URL}/products`, productData, { timeout: 8000 });
  return response.data;
};

