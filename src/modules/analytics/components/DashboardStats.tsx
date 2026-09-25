import React from 'react';
import { Card } from '../../../components/ui/Card';

export const DashboardStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <Card>
      <h3 className="text-gray-500 font-medium">Total Orders</h3>
      <p className="text-3xl font-bold">1,234</p>
    </Card>
    <Card>
      <h3 className="text-gray-500 font-medium">Total Revenue</h3>
      <p className="text-3xl font-bold">BDT 50,000</p>
    </Card>
    <Card>
      <h3 className="text-gray-500 font-medium">Active Products</h3>
      <p className="text-3xl font-bold">45</p>
    </Card>
  </div>
);
