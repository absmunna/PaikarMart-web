import React from 'react';
import { CategoryBar, CategoryBarProps } from './CategoryBar';

/**
 * PortalIconBar has been modernized and merged into the main sticky CategoryBar.
 * We re-export CategoryBar here to ensure 100% backward compatibility with all portals.
 */
export const PortalIconBar: React.FC<CategoryBarProps> = (props) => {
  return <CategoryBar {...props} />;
};

export default PortalIconBar;
