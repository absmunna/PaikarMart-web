import { api } from "@/lib/api";

export interface OrderItem {
  productId: string;
  title: string;
  image?: string;
  price: number;
  qty: number;
  sellerId?: string;
  sellerName?: string;
}

export interface Order {
  id: string;
  userId: string;
  status: string;
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  address: { name: string; line1: string; city: string; phone: string } | null;
  items: OrderItem[];
  createdAt: string;
}

export interface CreateOrderInput {
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  address?: Order["address"];
  items: OrderItem[];
}

export async function listOrders(): Promise<Order[]> {
  return api.get<Order[]>("/orders");
}

export async function getOrder(id: string): Promise<Order | undefined> {
  try {
    return await api.get<Order>(`/orders/${id}`);
  } catch {
    return undefined;
  }
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  return api.post<Order>("/orders", input);
}

export async function listSellerOrders(sellerId: string): Promise<Order[]> {
  return api.get<Order[]>(`/seller/orders?sellerId=${encodeURIComponent(sellerId)}`);
}
