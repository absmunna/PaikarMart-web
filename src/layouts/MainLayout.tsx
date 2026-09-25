import React from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return isDesktop ? (
    <DesktopLayout>{children}</DesktopLayout>
  ) : (
    <MobileLayout>{children}</MobileLayout>
  );
};
