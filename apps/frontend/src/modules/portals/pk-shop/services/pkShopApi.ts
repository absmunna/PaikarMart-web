import axios from 'axios';
import { PKShopProduct, PKShopOrder, PKShopTeamMember, PKShopStats } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/pk-shop`
  : '/api/v1/pk-shop';

const getAuthHeaders = () => {
  const token = localStorage.getItem('pm_auth_token') ||
                localStorage.getItem('token') ||
                sessionStorage.getItem('pm_auth_token') ||
                '';
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const pkShopApi = {
  // Public
  async getProducts(params?: { category?: string; search?: string; sort?: string }): Promise<PKShopProduct[]> {
    const res = await axios.get(`${API_BASE}/products`, { params });
    return res.data?.products || [];
  },

  async getProductById(id: string): Promise<PKShopProduct> {
    const res = await axios.get(`${API_BASE}/products/${id}`);
    return res.data?.product;
  },

  // Admin Stats
  async getAdminStats(): Promise<PKShopStats> {
    const res = await axios.get(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return res.data?.stats;
  },

  // Admin Product Management
  async saveProduct(product: Partial<PKShopProduct>): Promise<PKShopProduct> {
    const res = await axios.post(`${API_BASE}/admin/products`, product, {
      headers: getAuthHeaders()
    });
    return res.data?.product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await axios.delete(`${API_BASE}/admin/products/${id}`, {
      headers: getAuthHeaders()
    });
    return res.data?.success || false;
  },

  // Admin Order Processing
  async getOrders(status?: string): Promise<PKShopOrder[]> {
    const res = await axios.get(`${API_BASE}/admin/orders`, {
      params: { status },
      headers: getAuthHeaders()
    });
    return res.data?.orders || [];
  },

  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<PKShopOrder> {
    const res = await axios.patch(
      `${API_BASE}/admin/orders/${orderId}/status`,
      { status, notes },
      { headers: getAuthHeaders() }
    );
    return res.data?.order;
  },

  // Super Admin Team Governance
  async getTeamMembers(): Promise<PKShopTeamMember[]> {
    const res = await axios.get(`${API_BASE}/admin/team`, {
      headers: getAuthHeaders()
    });
    return res.data?.team || [];
  },

  async addTeamMember(member: { email?: string; phone?: string; name?: string; role: 'STORE_MANAGER' | 'MODERATOR'; permissions?: string[] }): Promise<PKShopTeamMember> {
    const res = await axios.post(`${API_BASE}/admin/team/add`, member, {
      headers: getAuthHeaders()
    });
    return res.data?.member;
  },

  async removeTeamMember(id: string): Promise<boolean> {
    const res = await axios.delete(`${API_BASE}/admin/team/${id}`, {
      headers: getAuthHeaders()
    });
    return res.data?.success || false;
  }
};
