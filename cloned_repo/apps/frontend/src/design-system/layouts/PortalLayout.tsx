import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { safeBack } from '@/lib/navigation';

interface PortalLayoutProps {
  children: React.ReactNode;
  portalName: string;
  accentColor: string;
}

export const PortalLayout = ({ children, portalName, accentColor }: PortalLayoutProps) => {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <header className="sticky top-0 z-50 glass h-[60px] flex items-center px-4 border-b" style={{ borderColor: accentColor }}>
        <button 
          onClick={() => safeBack(navigate, '/')}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-white"
          title="ফিরে যান"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="ml-4 font-bold text-lg" style={{ color: accentColor }}>{portalName}</h1>
      </header>
      <main className="p-4">{children}</main>
    </MainLayout>
  );
};
