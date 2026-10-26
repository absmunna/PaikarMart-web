import { useState, useEffect } from 'react';
import { ExclusiveDeal } from '../types';
import { apiClient } from '@/modules/app/api/client';

export const useSellerDeals = () => {
  const [deals, setDeals] = useState<ExclusiveDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/deals/my-deals');
      const data = response.data;
      setDeals(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return { deals, loading, error, refetch: fetchDeals };
};
