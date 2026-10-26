import React from 'react';
import { useParams } from 'react-router-dom';

export const ProductDetails = () => {
  const { id } = useParams();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-200 h-96 rounded-2xl"></div>
        <div>
          <h1 className="text-3xl font-bold mb-4">Product {id}</h1>
          <p className="text-xl text-[var(--pm-accent)] font-bold mb-6">BDT 1,500</p>
          <button className="bg-[var(--pm-accent)] text-white px-8 py-3 rounded-full font-semibold">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};
