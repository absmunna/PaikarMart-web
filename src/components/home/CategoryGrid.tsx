import React from 'react';
import { Card } from '../ui/Card';

const categories = ['Electronics', 'Fashion', 'Home Decor', 'Groceries', 'Services'];

export const CategoryGrid = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <div key={cat}>
            <Card className="text-center font-medium cursor-pointer hover:border-[var(--pm-accent)]">
              {cat}
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
