import React from 'react';

export const PortalSkeleton = () => (
  <div className="space-y-6 animate-pulse p-4">
    <div className="h-48 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl w-full" />
    <div className="flex gap-2 overflow-x-auto pb-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-10 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl w-24 shrink-0" />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="space-y-3">
          <div className="aspect-4/3 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl w-full" />
          <div className="h-4 bg-[var(--pm-surface)] rounded-lg w-3/4" />
          <div className="h-4 bg-[var(--pm-surface)] rounded-lg w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

export const FeedSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex gap-3 overflow-x-auto pb-2">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="w-28 sm:w-32 h-44 sm:h-48 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl shrink-0" />
      ))}
    </div>
    <div className="h-32 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl w-full" />
    {[1, 2].map(i => (
      <div key={i} className="bg-[var(--pm-card)] rounded-3xl p-5 space-y-4 border border-[var(--pm-border)]">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-[var(--pm-surface)] rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-[var(--pm-surface)] rounded-lg w-1/4" />
            <div className="h-3 bg-[var(--pm-surface)] rounded-lg w-1/6" />
          </div>
        </div>
        <div className="h-20 bg-[var(--pm-surface)] rounded-2xl w-full" />
      </div>
    ))}
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="max-w-5xl mx-auto space-y-6 pb-28 animate-pulse px-2 sm:px-4 mt-4">
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[var(--pm-surface)] rounded-full" />
        <div className="space-y-2">
          <div className="h-4 bg-[var(--pm-surface)] rounded-lg w-32" />
          <div className="h-3 bg-[var(--pm-surface)] rounded-lg w-16" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-[var(--pm-surface)] rounded-xl" />
        <div className="w-8 h-8 bg-[var(--pm-surface)] rounded-xl" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <div className="lg:col-span-7 space-y-5">
        <div className="aspect-[4/3] sm:aspect-square bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-[2rem] w-full" />
        <div className="flex gap-3 overflow-x-auto pb-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-14 h-14 bg-[var(--pm-surface)] rounded-xl shrink-0" />
          ))}
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 bg-[var(--pm-surface)] rounded-full w-24" />
          ))}
        </div>
        <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-[2rem] h-64 w-full" />
      </div>
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-[2rem] p-6 space-y-4 shadow-sm">
          <div className="h-8 bg-[var(--pm-surface)] rounded-lg w-1/2" />
          <div className="h-4 bg-[var(--pm-surface)] rounded-lg w-full" />
          <div className="space-y-2 pt-4">
            <div className="h-10 bg-[var(--pm-surface)] rounded-xl w-full" />
            <div className="h-10 bg-[var(--pm-surface)] rounded-xl w-full" />
          </div>
          <div className="h-14 bg-[var(--pm-surface)] rounded-2xl w-full mt-6" />
        </div>
      </div>
    </div>
  </div>
);
