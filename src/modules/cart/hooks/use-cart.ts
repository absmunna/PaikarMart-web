import { useMemo } from "react";
import { useCartStore } from "@/modules/cart";

export interface UseCartItem {
  productId: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
  vendorName: string;
}

export function useCart() {
  const store = useCartStore();

  const items = useMemo<UseCartItem[]>(() => {
    return store.items.map(item => ({
      productId: item.id,
      productName: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity ?? 0,
      vendorName: item.portal === "pk-shop" ? "PK Shop" : item.portal === "b2b" ? "B2B Wholesale" : "Retail Shop"
    }));
  }, [store.items]);

  const totalPrice = useMemo(() => {
    return store.getTotalPrice();
  }, [store.items, store.getTotalPrice]);

  return {
    items,
    totalPrice,
    updateQuantity: store.updateQuantity,
    removeFromCart: store.removeItem,
    clearCart: store.clearCart
  };
}
