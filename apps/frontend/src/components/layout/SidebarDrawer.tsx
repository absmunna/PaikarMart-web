import React from 'react';
import { UnifiedSidebar, UnifiedSidebarProps } from '@/components/layout/UnifiedSidebar';

export interface SidebarDrawerProps extends Omit<UnifiedSidebarProps, 'mode'> {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = (props) => {
  return (
    <UnifiedSidebar
      mode="drawer"
      {...props}
    />
  );
};

