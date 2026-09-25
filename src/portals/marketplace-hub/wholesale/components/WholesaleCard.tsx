import React from 'react';

export const WholesaleCard = ({ product }: { product: any }) => {
  return (
    <div className="bg-[var(--pm-surface)] p-4 rounded-xl border border-[var(--pm-border)] shadow-md">
      <h3 className="font-bold cursor-pointer hover:underline">{product.name}</h3>
      <p className="text-sm text-[var(--pm-text-secondary)]">MOQ: {product.moq} পিস</p>
      <p className="text-lg font-bold text-[var(--pm-accent)]">৳{product.wholesalePrice}</p>
    </div>
  );
};
