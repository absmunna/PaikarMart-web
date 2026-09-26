import React from 'react';

export const Orders = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">বাল্ক অর্ডার</h2>
      <div className="bg-[var(--pm-surface)] p-6 rounded-xl border border-[var(--pm-border)]">
        <p className="text-[var(--pm-text-secondary)]">কোন সক্রিয় বাল্ক অর্ডার পাওয়া যায়নি।</p>
      </div>
    </div>
  );
};
