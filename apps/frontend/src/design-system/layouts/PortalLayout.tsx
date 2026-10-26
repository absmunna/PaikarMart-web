import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from './MainLayout';

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
        <ChevronLeft className="cursor-pointer" onClick={() => navigate(-1)} />
        <h1 className="ml-4 font-bold text-lg" style={{ color: accentColor }}>{portalName}</h1>
      </header>
      <main className="p-4">{children}</main>
    </MainLayout>
  );
};
