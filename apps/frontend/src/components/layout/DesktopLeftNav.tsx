import React from 'react';
import { PortalTab, User } from '@/types';
import { SettingsSectionId } from '@/portals/settings-center';
import { UnifiedSidebar, UnifiedSidebarProps } from '@/components/layout/UnifiedSidebar';

export interface DesktopLeftNavProps extends Omit<UnifiedSidebarProps, 'mode'> {}

export const DesktopLeftNav: React.FC<DesktopLeftNavProps> = (props) => {
  return <UnifiedSidebar mode="desktop" {...props} />;
};

