import React from 'react';
import { CategoryBar, CategoryBarProps } from './CategoryBar';

/**
 * DynamicCategoryBar has been merged into CategoryBar.
 * Re-exporting CategoryBar as DynamicCategoryBar for clean backward compatibility.
 */
export const DynamicCategoryBar: React.FC<CategoryBarProps> = (props) => {
  return <CategoryBar {...props} />;
};

export default DynamicCategoryBar;
