import React from 'react';
import { Card } from '@/components/ui/card';

export const Dashboard = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">B2B ড্যাশবোর্ড</h2>
      <Card>
        <p>বাল্ক অর্ডার, অ্যানালিটিক্স এবং অ্যাক্টিভ লিস্টিং-এর ওভারভিউ।</p>
      </Card>
    </div>
  );
};
