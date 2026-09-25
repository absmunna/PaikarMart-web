import React from 'react';
import { Card } from '../../../components/ui/Card';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-[var(--pm-accent)] font-bold">BDT {product.price}</p>
      <button className="w-full mt-4 bg-[var(--pm-accent)] text-white py-2 rounded-lg text-sm font-medium">Add to Cart</button>
    </Card>
  );
};
