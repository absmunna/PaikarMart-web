/**
 * Compatibility shim — same UI as canonical V2 BottomNav (center Hub).
 * Prefer: import { BottomNav } from '@/design-system/components/navigation'
 */
import React from 'react';
import { BottomNav } from '../navigation/BottomNav';

export const AppBottomNav: React.FC = () => {
  return <BottomNav />;
};

export default AppBottomNav;
