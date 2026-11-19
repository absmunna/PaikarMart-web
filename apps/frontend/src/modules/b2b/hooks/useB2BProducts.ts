import { useQuery } from '@tanstack/react-query';
import { b2bProductService } from '../services/b2bProductService';

export const useB2BProducts = () => {
  return useQuery({
    queryKey: ['b2b', 'products'],
    queryFn: () => b2bProductService.getProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useB2BProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ['b2b', 'product', id],
    queryFn: () => b2bProductService.getProductById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
