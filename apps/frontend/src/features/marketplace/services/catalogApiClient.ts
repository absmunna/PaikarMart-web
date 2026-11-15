import type { CommerceItem } from '@/types';

type CatalogResponse = {
  products?: CommerceItem[];
  source?: string;
};

export async function fetchCatalogProducts(signal?: AbortSignal): Promise<CommerceItem[]> {
  try {
    const response = await fetch('/api/catalog/products', {
      headers: { Accept: 'application/json' },
      signal,
    });
    if (!response.ok) return [];
    const payload = await response.json() as CatalogResponse;
    return Array.isArray(payload.products) ? payload.products : [];
  } catch (error) {
    if ((error as DOMException)?.name !== 'AbortError') {
      console.warn('Catalog API unavailable; retaining offline catalog fallback.', error);
    }
    return [];
  }
}
