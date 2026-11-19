import React from 'react';

export const NakshiOverlay = () => (
  <div 
    className="fixed inset-0 pointer-events-none -z-5 opacity-[var(--pm-nakshi-opacity)] transition-opacity duration-500"
    style={{
      backgroundImage: 'radial-gradient(circle, var(--pm-text) 1px, transparent 1px)',
      backgroundSize: '20px 20px',
    }}
  />
);
