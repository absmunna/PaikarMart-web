import { useState, useEffect } from 'react';
import { ExclusiveDeal } from '../types';
import { apiClient } from '@/modules/app/api/client';

export const useExclusiveDeals = () => {
  const [deals, setDeals] = useState<ExclusiveDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      // In a real app, this would hit /api/deals/exclusive
      // For now, returning mock data to ensure the UI looks great immediately
      const response = await apiClient.get('/deals/exclusive');
      const data = response.data;
      setDeals(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      
      // Fallback mock data for demo
      const mockDeals: ExclusiveDeal[] = [
        {
          id: 'deal-1',
          productId: 'prod-1',
          product: {
            id: 'prod-1',
            title: 'Premium Wireless Headphones Gen 5',
            price: 5500,
            oldPrice: 7500,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
            sellerId: 'sel-1',
            rating: 4.8,
            reviewCount: 124,
            category: 'Electronics',
            description: 'Premium sound experience with active noise cancellation.',
            isPKStore: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any,
          dealPrice: 3800,
          initialStock: 50,
          currentStock: 8,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000 * 5).toISOString(), // 5 hours from now
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'deal-2',
          productId: 'prod-2',
          product: {
            id: 'prod-2',
            title: 'Organic Green Tea - High Altitude Harvest',
            price: 1200,
            oldPrice: 1800,
            image: 'https://images.unsplash.com/photo-1544787210-22bb84aa5fb9?w=800',
            images: ['https://images.unsplash.com/photo-1544787210-22bb84aa5fb9?w=800'],
            sellerId: 'sel-2',
            rating: 4.9,
            reviewCount: 312,
            category: 'Grocery',
            description: 'Hand-picked organic green tea from the hills of Sylhet.',
            isPKStore: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any,
          dealPrice: 850,
          initialStock: 200,
          currentStock: 142,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000 * 24).toISOString(), // 24 hours from now
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ];
      setDeals(mockDeals);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return { deals, loading, error, refetch: fetchDeals };
};
