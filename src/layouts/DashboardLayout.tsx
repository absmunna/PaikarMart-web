import React from 'react';
import { Sidebar } from '../components/navigation/Sidebar';
import { Navbar } from '../components/navigation/Navbar';
import { BottomNav } from '../components/navigation/BottomNav';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex bg-[var(--pm-bg)] min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="md:hidden">
        <Navbar />
        <BottomNav />
      </div>
      <main className="flex-grow md:ml-[240px] p-8 pt-24">
        {children}
      </main>
    </div>
  );
};
