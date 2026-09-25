import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { SellerProduct, SellerOrder, SellerVerificationPayload, ServiceBooking, DeliveryTask, ReturnRequest } from "./types";

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

interface SellerContextValue {
  isSeller: boolean;
  becomeSeller: () => void;
  profile: any;
  updateProfile: (patch: any) => void;
  products: SellerProduct[];
  orders: SellerOrder[];
  serviceBookings: ServiceBooking[];
  setServiceBookings?: React.Dispatch<React.SetStateAction<ServiceBooking[]>>;
  deliveryTasks: DeliveryTask[];
  setDeliveryTasks?: React.Dispatch<React.SetStateAction<DeliveryTask[]>>;
  returnsRequests: ReturnRequest[];
  setReturnsRequests?: React.Dispatch<React.SetStateAction<ReturnRequest[]>>;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  createProduct: (input: Omit<SellerProduct, "id" | "sellerId">) => Promise<SellerProduct>;
  updateProduct: (id: string, patch: Partial<SellerProduct>) => Promise<SellerProduct>;
  deleteProduct: (id: string) => Promise<void>;
  setOrderStatus: (id: string, status: SellerOrder["status"]) => Promise<SellerOrder>;
  submitVerification: (payload: any, type?: any, category?: any) => Promise<any>;
  verificationStatus: string;
}

const SellerContext = createContext<SellerContextValue | null>(null);

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const [isSeller, setIsSeller] = useState(true);
  const [profile, setProfile] = useState<any>({ verificationStatus: "unsubmitted" });
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [deliveryTasks, setDeliveryTasks] = useState<DeliveryTask[]>([]);
  const [returnsRequests, setReturnsRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const createProduct = useCallback(async (payload: Omit<SellerProduct, 'id' | 'sellerId'>) => {
    const created = await apiFetch('/products', { method: 'POST', body: JSON.stringify(payload) });
    setProducts(prev => [created, ...prev]);
    return created;
  }, []);

  const updateProduct = useCallback(async (id: string, payload: Partial<SellerProduct>) => {
    const updated = await apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    return updated;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await apiFetch(`/products/${id}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

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

  const setOrderStatus = useCallback(async (id: string, status: SellerOrder['status']) => {
    const updated = await apiFetch(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updated } : o));
    return updated;
  }, []);

  const submitVerification = useCallback(async (payload: any, type?: any, category?: any) => {
    const body = typeof payload === 'object' && !Array.isArray(payload) && payload !== null
      ? payload
      : { documents: payload, type, category };
    const res = await apiFetch('/verification', { method: 'POST', body: JSON.stringify(body) });
    setProfile(p => ({ ...p, verificationStatus: "pending", ...body }));
    return res;
  }, []);

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

  const value: SellerContextValue = {
    isSeller,
    becomeSeller: () => setIsSeller(true),
    profile,
    updateProfile: (patch) => setProfile(p => ({ ...p, ...patch })),
    products,
    orders,
    serviceBookings,
    setServiceBookings,
    deliveryTasks,
    setDeliveryTasks,
    returnsRequests,
    setReturnsRequests,
    loading,
    error,
    fetchProducts,
    fetchOrders,
    createProduct,
    updateProduct,
    deleteProduct,
    setOrderStatus,
    submitVerification,
    verificationStatus: profile?.verificationStatus || "unsubmitted",
  };

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>;
}

const defaultSellerValue: SellerContextValue = {
  isSeller: false,
  becomeSeller: () => {},
  profile: { verificationStatus: "unsubmitted" },
  updateProfile: () => {},
  products: [],
  orders: [],
  serviceBookings: [],
  deliveryTasks: [],
  returnsRequests: [],
  loading: false,
  error: null,
  fetchProducts: async () => {},
  fetchOrders: async () => {},
  createProduct: async () => ({} as any),
  updateProduct: async () => ({} as any),
  deleteProduct: async () => {},
  setOrderStatus: async () => ({} as any),
  submitVerification: async () => ({}),
  verificationStatus: "unsubmitted",
};

export function useSeller() {
  const ctx = useContext(SellerContext);
  return ctx || defaultSellerValue;
}

export const useSellerContext = useSeller;
