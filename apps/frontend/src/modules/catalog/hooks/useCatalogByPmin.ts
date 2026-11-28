import { useEffect, useState } from 'react';
import { useCatalogStore } from '../store/catalogStore';
import type { BuyBoxResult, MasterProduct, SellerOffer } from '../types/catalog.types';

/**
 * Load master + offers + buy-box for a PMIN / ASIN.
 * Prefers backend GET /catalog/pmin/:pmin, falls back to local store mock.
 */
export function useCatalogByPmin(pminOrAsin: string | undefined) {
  const hydrateFromApi = useCatalogStore((s) => s.hydrateFromApi);
  const getMasterProduct = useCatalogStore((s) => s.getMasterProduct);
  const getBuyBox = useCatalogStore((s) => s.getBuyBox);
  const getOffers = useCatalogStore((s) => s.getOffers);

  const key = (pminOrAsin || '').trim();
  const [loading, setLoading] = useState(Boolean(key));
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'local' | null>(null);

  useEffect(() => {
    if (!key) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      const ok = await hydrateFromApi(key);
      if (cancelled) return;
      setSource(ok ? 'api' : 'local');
      if (!ok && !getMasterProduct(key) && !(getOffers(key)?.length > 0)) {
        setError('Catalog item not found');
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [key, hydrateFromApi, getMasterProduct, getOffers]);

  const master: MasterProduct | null = key ? getMasterProduct(key) : null;
  const offers: SellerOffer[] = key ? getOffers(key) : [];
  const buyBox: BuyBoxResult | null = key ? getBuyBox(key) : null;

  return { loading, error, source, master, offers, buyBox, pmin: key };
}
