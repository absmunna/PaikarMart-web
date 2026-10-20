import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where 
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { SellerProduct, SellerOrder, SellerVerificationPayload, ServiceBooking, DeliveryTask, ReturnRequest } from "../types";

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? '/api/v1';

async function apiFetch(path: string, opts?: RequestInit) {
  try {
    const res = await fetch(`${BASE_URL}/seller${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    if (res.status === 204) return null;
    return res.json();
  } catch (e) {
    return null;
  }
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
      // 1. Try real Cloud Firestore
      try {
        const snap = await getDocs(collection(db, "products"));
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as SellerProduct));
          setProducts(list);
          return;
        }
      } catch (fsErr) {
        console.warn("Firestore products fetch note:", fsErr);
      }

      // 2. Fallback to API
      const data = await apiFetch('/products');
      setProducts(data ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (payload: Omit<SellerProduct, 'id' | 'sellerId'>) => {
    const sellerId = auth.currentUser?.uid || "seller-main";
    let productId = `p_${Date.now()}`;
    
    // 1. Persist to real Cloud Firestore
    try {
      const docRef = await addDoc(collection(db, "products"), {
        ...payload,
        sellerId,
        createdAt: new Date().toISOString()
      });
      productId = docRef.id;
    } catch (fsErr) {
      console.warn("Firestore product create error:", fsErr);
    }

    const created: SellerProduct = {
      id: productId,
      sellerId,
      title: payload.title || "Untitled Product",
      price: payload.price ?? 0,
      images: payload.images || [],
      stock: payload.stock ?? 0,
      ...payload
    };

    // 2. Also notify backend API
    apiFetch('/products', { method: 'POST', body: JSON.stringify(created) }).catch(() => {});

    setProducts(prev => [created, ...prev]);
    return created;
  }, []);

  const updateProduct = useCallback(async (id: string, payload: Partial<SellerProduct>) => {
    try {
      await updateDoc(doc(db, "products", id), payload);
    } catch (fsErr) {
      console.warn("Firestore product update note:", fsErr);
    }
    apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }).catch(() => {});
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...payload } : p));
    return { id, ...payload } as SellerProduct;
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (fsErr) {
      console.warn("Firestore product delete note:", fsErr);
    }
    apiFetch(`/products/${id}`, { method: 'DELETE' }).catch(() => {});
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      try {
        const snap = await getDocs(collection(db, "orders"));
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as SellerOrder));
          setOrders(list);
          return;
        }
      } catch (fsErr) {
        console.warn("Firestore orders fetch note:", fsErr);
      }
      const data = await apiFetch('/orders');
      setOrders(data ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const setOrderStatus = useCallback(async (id: string, status: SellerOrder['status']) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
    } catch (fsErr) {
      console.warn("Firestore order status update note:", fsErr);
    }
    apiFetch(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }).catch(() => {});
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    return { id, status } as any;
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
