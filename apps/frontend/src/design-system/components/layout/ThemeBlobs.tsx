import React from 'react';

export const ThemeBlobs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--pm-blob-1)] blur-[120px] opacity-20" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--pm-blob-2)] blur-[120px] opacity-20" />
  </div>
);
