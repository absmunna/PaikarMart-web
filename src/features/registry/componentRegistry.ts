/**
 * Component registry — central catalog of swappable UI components.
 * Admin / AI tooling can hot-swap implementations without touching pages
 * or backend logic. Pages render via <Slot id="post.card" {...props} />.
 */
import { lazy, type ComponentType } from "react";
import { safeStorage } from "@/modules/app/utils/storage";

export type SlotId =
  | "post.card"
  | "product.card"
  | "vendor.card"
  | "video.player";

interface RegistryEntry {
  variants: Record<string, () => Promise<{ default: ComponentType<any> }>>;
  defaultVariant: string;
}

const REGISTRY: Record<SlotId, RegistryEntry> = {
  "post.card": {
    defaultVariant: "universal",
    variants: {
      universal: () => import("@/modules/social/components/UniversalFeedCard").then((m) => ({ default: m.UniversalFeedCardBridge })),
    },
  },
  "product.card": {
    defaultVariant: "default",
    variants: {
      default: () => import("@/features/product/components/ProductCard").then((m) => ({ default: m.ProductCard })),
    },
  },
  "vendor.card": {
    defaultVariant: "default",
    variants: {
      default: () => import("@/modules/seller/components/VendorCard").then((m) => ({ default: m.VendorCard })),
    },
  },
  "video.player": {
    defaultVariant: "default",
    variants: {
      default: () => import("@/features/digital-content/components/VideoPlayer").then((m) => ({ default: m.VideoPlayer })),
    },
  },
};

const STORAGE_KEY = "pm.uiRegistry.v1";

export function getActiveVariant(slot: SlotId): string {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    const m = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    return m[slot] ?? REGISTRY[slot].defaultVariant;
  } catch {
    return REGISTRY[slot].defaultVariant;
  }
}

export function setActiveVariant(slot: SlotId, variant: string) {
  if (!REGISTRY[slot].variants[variant]) return;
  const raw = safeStorage.getItem(STORAGE_KEY);
  const m = raw ? JSON.parse(raw) : {};
  m[slot] = variant;
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(m));
  window.dispatchEvent(new CustomEvent("pm:registry:changed"));
}

export function listSlots() {
  return (Object.keys(REGISTRY) as SlotId[]).map((id) => ({
    id,
    variants: Object.keys(REGISTRY[id].variants),
    active: getActiveVariant(id),
    defaultVariant: REGISTRY[id].defaultVariant,
  }));
}

const cache = new Map<string, ComponentType<any>>();

export function loadSlot(slot: SlotId): ComponentType<any> {
  const variant = getActiveVariant(slot);
  const key = `${slot}::${variant}`;
  let comp = cache.get(key);
  if (!comp) {
    comp = lazy(REGISTRY[slot].variants[variant]);
    cache.set(key, comp);
  }
  return comp;
}
