import { useState, useCallback, useEffect } from 'react';
import { SellerProduct, SellerOrder, SellerVerificationPayload, ServiceBooking, DeliveryTask, ReturnRequest } from './types';

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? '/api/v1';

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${BASE_URL}/seller${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

export function useSeller() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [deliveryTasks, setDeliveryTasks] = useState<DeliveryTask[]>([]);
  const [returnsRequests, setReturnsRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/products');
      setProducts(data ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create product
  const createProduct = useCallback(async (payload: Omit<SellerProduct, 'id' | 'sellerId'>) => {
    const created = await apiFetch('/products', { method: 'POST', body: JSON.stringify(payload) });
    setProducts(prev => [created, ...prev]);
    return created;
  }, []);

  // Update product
  const updateProduct = useCallback(async (id: string, payload: Partial<SellerProduct>) => {
    const updated = await apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    return updated;
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (id: string) => {
    await apiFetch(`/products/${id}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/orders');
      setOrders(data ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status
  const setOrderStatus = useCallback(async (id: string, status: SellerOrder['status']) => {
    const updated = await apiFetch(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updated } : o));
    return updated;
  }, []);

  // Submit verification
  const submitVerification = useCallback(async (payload: SellerVerificationPayload) => {
    return apiFetch('/verification', { method: 'POST', body: JSON.stringify(payload) });
  }, []);

  // Load mocks for UI
  useEffect(() => {
    setServiceBookings([
      { id: "B-2101", customer: "Farhan Ahmed", service: "AC Deep Cleaning", date: "20 June 2026", time: "10:30 AM", status: "pending", phone: "01722883344", area: "Dhanmondi, Dhaka" }
    ]);
    setDeliveryTasks([
      { id: "D-102", orderId: "so_1001", courier: "Pathao Fast", status: "picked_up", route: "Dhanmondi -> Gulshan", timeline: ["Assigned: 2 Hours Ago"], type: "parcel" }
    ]);
    setReturnsRequests([
      { id: "RET-901", orderId: "so_1004", reason: "Color defect", status: "open", createdAt: "2 Days ago" }
    ]);
  }, []);

  const profile = null;

  return {
    products,
    orders,
    serviceBookings,
    deliveryTasks,
    returnsRequests,
    loading,
    error,
    fetchProducts,
    fetchOrders,
    createProduct,
    updateProduct,
    deleteProduct,
    setOrderStatus,
    submitVerification,
    profile,
  };
}
