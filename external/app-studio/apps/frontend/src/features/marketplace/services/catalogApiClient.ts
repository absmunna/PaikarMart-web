import type {
  CommerceItem,
  MasterCatalogSubmission,
  MasterProduct,
  SellerListing,
} from '@/types';

export type CatalogSource = 'supabase' | 'unconfigured' | 'schema_missing' | 'error';

export interface CatalogProductsResult {
  products: CommerceItem[];
  source: CatalogSource;
  schemaReady: boolean;
  error?: string;
}

export async function fetchCatalogResult(signal?: AbortSignal): Promise<CatalogProductsResult> {
  try {
    const response = await fetch('/api/catalog/products', {
      headers: { Accept: 'application/json' },
      signal,
    });
    const payload = (await response.json().catch(() => ({}))) as Partial<CatalogProductsResult>;
    if (!response.ok) {
      return {
        products: [],
        source: payload.source || 'error',
        schemaReady: Boolean(payload.schemaReady),
        error: payload.error || 'Catalog service unavailable.',
      };
    }
    return {
      products: Array.isArray(payload.products) ? payload.products : [],
      source: payload.source || 'supabase',
      schemaReady: payload.schemaReady !== false,
      error: payload.error,
    };
  } catch (error) {
    if ((error as DOMException)?.name !== 'AbortError') {
      console.warn('Catalog API unavailable:', error);
    }
    return { products: [], source: 'error', schemaReady: false };
  }
}

export async function fetchCatalogProducts(signal?: AbortSignal): Promise<CommerceItem[]> {
  const result = await fetchCatalogResult(signal);
  return result.products;
}

export async function fetchCatalogProductById(
  id: string,
  signal?: AbortSignal
): Promise<{ product: CommerceItem | null; source: CatalogSource }> {
  try {
    const response = await fetch(`/api/catalog/products/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
      signal,
    });
    const payload = (await response.json().catch(() => ({}))) as {
      product?: CommerceItem | null;
      source?: CatalogSource;
    };
    return {
      product: payload.product || null,
      source: payload.source || (response.ok ? 'supabase' : 'error'),
    };
  } catch {
    return { product: null, source: 'error' };
  }
}

export async function fetchMasterCatalogProducts(
  signal?: AbortSignal
): Promise<{ masterProducts: MasterProduct[]; source: CatalogSource }> {
  try {
    const response = await fetch('/api/catalog/master-products', {
      headers: { Accept: 'application/json' },
      signal,
    });
    const payload = (await response.json().catch(() => ({}))) as {
      masterProducts?: MasterProduct[];
      source?: CatalogSource;
    };
    return {
      masterProducts: Array.isArray(payload.masterProducts) ? payload.masterProducts : [],
      source: payload.source || 'supabase',
    };
  } catch {
    return { masterProducts: [], source: 'error' };
  }
}

export async function fetchSellerListingsForMaster(
  masterProductId: string,
  signal?: AbortSignal
): Promise<{ listings: SellerListing[]; source: CatalogSource }> {
  try {
    const response = await fetch(`/api/catalog/listings/by-master/${encodeURIComponent(masterProductId)}`, {
      headers: { Accept: 'application/json' },
      signal,
    });
    const payload = (await response.json().catch(() => ({}))) as {
      listings?: SellerListing[];
      source?: CatalogSource;
    };
    return {
      listings: Array.isArray(payload.listings) ? payload.listings : [],
      source: payload.source || 'supabase',
    };
  } catch {
    return { listings: [], source: 'error' };
  }
}

export async function createSellerListingOffer(
  idToken: string,
  payload: Partial<SellerListing>
): Promise<{ ok: boolean; listing?: any; error?: string }> {
  const response = await fetch('/api/catalog/listings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as { listing?: any; error?: string };
  if (!response.ok) {
    return { ok: false, error: data.error || 'Failed to publish listing.' };
  }
  return { ok: true, listing: data.listing };
}

export async function fetchCatalogSubmissions(
  idToken: string,
  signal?: AbortSignal
): Promise<{ submissions: MasterCatalogSubmission[]; source: CatalogSource }> {
  try {
    const response = await fetch('/api/catalog/submissions', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      signal,
    });
    const payload = (await response.json().catch(() => ({}))) as {
      submissions?: MasterCatalogSubmission[];
      source?: CatalogSource;
    };
    return {
      submissions: Array.isArray(payload.submissions) ? payload.submissions : [],
      source: payload.source || (response.ok ? 'supabase' : 'error'),
    };
  } catch {
    return { submissions: [], source: 'error' };
  }
}

export async function submitCatalogProposal(
  idToken: string,
  payload: Partial<MasterCatalogSubmission>
): Promise<{ ok: boolean; submission?: any; error?: string }> {
  const response = await fetch('/api/catalog/submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => ({}))) as { submission?: any; error?: string };
  if (!response.ok) {
    return { ok: false, error: data.error || 'Failed to submit proposal.' };
  }
  return { ok: true, submission: data.submission };
}

export async function reviewCatalogProposal(
  idToken: string,
  submissionId: string,
  decision: 'approved' | 'rejected'
): Promise<{ ok: boolean; masterProduct?: MasterProduct | null; error?: string }> {
  const response = await fetch(`/api/catalog/submissions/${encodeURIComponent(submissionId)}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ decision }),
  });
  const data = (await response.json().catch(() => ({}))) as {
    masterProduct?: MasterProduct | null;
    error?: string;
  };
  if (!response.ok) {
    return { ok: false, error: data.error || 'Failed to review submission.' };
  }
  return { ok: true, masterProduct: data.masterProduct };
}
