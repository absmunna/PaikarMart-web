import React from 'react';
import { WholesaleCard } from '../components/WholesaleCard';

export const Products = () => {
  const products = [
    { id: 1, name: 'চালের বস্তা ৫০ কেজি', moq: 10, wholesalePrice: 1500 },
    { id: 2, name: 'রান্নার তেল ৫ লিটার', moq: 20, wholesalePrice: 850 },
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">পাইকারি পণ্য</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {products.map(product => <WholesaleCard key={product.id} product={product} />)}
      </div>
    </div>
  );
};
